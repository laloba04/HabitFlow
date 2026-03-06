import json
import os
import uuid
from datetime import datetime
from decimal import Decimal
import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

from handlers.auth_middleware import get_user_id, unauthorized, error_response, success_response
from utils.validator import validate_expense, sanitize_string

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('EXPENSES_TABLE', 'habitflow-expenses')


def lambda_handler(event: dict, context) -> dict:
    method = event.get('requestContext', {}).get('http', {}).get('method', '')
    path_params = event.get('pathParameters') or {}

    try:
        user_id = get_user_id(event)
    except Exception as e:
        return unauthorized(str(e))

    if method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        month = query_params.get('month')
        return get_expenses(user_id, month)
    elif method == 'POST':
        return create_expense(user_id, event)
    elif method == 'DELETE':
        expense_id = path_params.get('expenseId')
        return delete_expense(user_id, expense_id)
    else:
        return error_response(405, 'Method not allowed')


def get_expenses(user_id: str, month: str = None) -> dict:
    """
    Obtiene todos los gastos del usuario.
    Si se proporciona el parámetro `month` (formato YYYY-MM), filtra por ese mes.
    """
    table = dynamodb.Table(TABLE_NAME)
    try:
        if month:
            # Validar formato del mes
            import re
            if not re.match(r'^\d{4}-\d{2}$', month):
                return error_response(400, 'month must be in YYYY-MM format')

            # Filtrar por el prefijo del mes en el campo date
            response = table.query(
                KeyConditionExpression=Key('userId').eq(user_id),
                FilterExpression=Attr('date').begins_with(month)
            )
        else:
            response = table.query(
                KeyConditionExpression=Key('userId').eq(user_id)
            )

        return success_response({'expenses': response.get('Items', [])})
    except ClientError:
        return error_response(500, 'Error retrieving expenses')


def create_expense(user_id: str, event: dict) -> dict:
    """Crea un nuevo gasto para el usuario."""
    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return error_response(400, 'Invalid JSON body')

    errors = validate_expense(body)
    if errors:
        return error_response(400, '; '.join(errors))

    table = dynamodb.Table(TABLE_NAME)
    expense_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    # DynamoDB no acepta float; usar Decimal para importes
    amount = Decimal(str(body['amount']))

    item = {
        'userId': user_id,
        'expenseId': expense_id,
        'amount': amount,
        'category': body['category'],
        'description': sanitize_string(body['description']),
        'date': body['date'],
        'createdAt': now,
    }

    try:
        table.put_item(Item=item)
        return success_response({'expense': item}, 201)
    except ClientError:
        return error_response(500, 'Error creating expense')


def delete_expense(user_id: str, expense_id: str) -> dict:
    """Elimina un gasto verificando que pertenece al usuario."""
    if not expense_id:
        return error_response(400, 'expenseId is required')

    table = dynamodb.Table(TABLE_NAME)

    try:
        table.delete_item(
            Key={'userId': user_id, 'expenseId': expense_id},
            ConditionExpression='userId = :uid',
            ExpressionAttributeValues={':uid': user_id}
        )
        return success_response({'message': 'Expense deleted'})
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return error_response(404, 'Expense not found')
        return error_response(500, 'Error deleting expense')
