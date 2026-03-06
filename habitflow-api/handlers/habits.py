import json
import os
import uuid
from datetime import datetime
import boto3
from botocore.exceptions import ClientError

from handlers.auth_middleware import get_user_id, unauthorized, error_response, success_response
from utils.validator import validate_habit, sanitize_string

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('HABITS_TABLE', 'habitflow-habits')


def lambda_handler(event: dict, context) -> dict:
    method = event.get('requestContext', {}).get('http', {}).get('method', '')
    path_params = event.get('pathParameters') or {}

    try:
        user_id = get_user_id(event)
    except Exception as e:
        return unauthorized(str(e))

    if method == 'GET':
        return get_habits(user_id)
    elif method == 'POST':
        return create_habit(user_id, event)
    elif method == 'PUT':
        habit_id = path_params.get('habitId')
        return update_habit(user_id, habit_id, event)
    elif method == 'DELETE':
        habit_id = path_params.get('habitId')
        return delete_habit(user_id, habit_id)
    else:
        return error_response(405, 'Method not allowed')


def get_habits(user_id: str) -> dict:
    table = dynamodb.Table(TABLE_NAME)
    try:
        response = table.query(
            KeyConditionExpression='userId = :uid',
            ExpressionAttributeValues={':uid': user_id}
        )
        return success_response({'habits': response.get('Items', [])})
    except ClientError as e:
        return error_response(500, 'Error retrieving habits')


def create_habit(user_id: str, event: dict) -> dict:
    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return error_response(400, 'Invalid JSON body')

    errors = validate_habit(body)
    if errors:
        return error_response(400, '; '.join(errors))

    table = dynamodb.Table(TABLE_NAME)
    habit_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    item = {
        'userId': user_id,
        'habitId': habit_id,
        'name': sanitize_string(body['name']),
        'frequency': body['frequency'],
        'currentStreak': 0,
        'longestStreak': 0,
        'completionHistory': [],
        'createdAt': now,
        'updatedAt': now,
    }

    try:
        table.put_item(Item=item)
        return success_response({'habit': item}, 201)
    except ClientError:
        return error_response(500, 'Error creating habit')


def update_habit(user_id: str, habit_id: str, event: dict) -> dict:
    if not habit_id:
        return error_response(400, 'habitId is required')

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return error_response(400, 'Invalid JSON body')

    table = dynamodb.Table(TABLE_NAME)
    now = datetime.utcnow().isoformat()

    # Solo permitir actualizar campos específicos
    allowed_fields = {'name', 'frequency', 'currentStreak', 'longestStreak', 'completionHistory'}
    updates = {k: v for k, v in body.items() if k in allowed_fields}

    if not updates:
        return error_response(400, 'No valid fields to update')

    if 'name' in updates:
        updates['name'] = sanitize_string(updates['name'])

    updates['updatedAt'] = now

    update_expr = 'SET ' + ', '.join(f'#k{i} = :v{i}' for i in range(len(updates)))
    expr_names = {f'#k{i}': k for i, k in enumerate(updates.keys())}
    expr_values = {f':v{i}': v for i, v in enumerate(updates.values())}
    expr_values[':uid'] = user_id

    try:
        response = table.update_item(
            Key={'userId': user_id, 'habitId': habit_id},
            UpdateExpression=update_expr,
            ConditionExpression='userId = :uid',
            ExpressionAttributeNames=expr_names,
            ExpressionAttributeValues=expr_values,
            ReturnValues='ALL_NEW'
        )
        return success_response({'habit': response.get('Attributes', {})})
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return error_response(404, 'Habit not found')
        return error_response(500, 'Error updating habit')


def delete_habit(user_id: str, habit_id: str) -> dict:
    if not habit_id:
        return error_response(400, 'habitId is required')

    table = dynamodb.Table(TABLE_NAME)

    try:
        table.delete_item(
            Key={'userId': user_id, 'habitId': habit_id},
            ConditionExpression='userId = :uid',
            ExpressionAttributeValues={':uid': user_id}
        )
        return success_response({'message': 'Habit deleted'})
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return error_response(404, 'Habit not found')
        return error_response(500, 'Error deleting habit')
