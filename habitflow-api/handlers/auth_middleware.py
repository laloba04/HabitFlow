from utils.firebase_auth import verify_firebase_token


def get_user_id(event: dict) -> str:
    """
    Extrae y verifica el token Bearer del header Authorization.
    Devuelve el uid del usuario o lanza Exception.
    """
    headers = event.get('headers') or {}
    auth_header = headers.get('authorization') or headers.get('Authorization', '')

    if not auth_header.startswith('Bearer '):
        raise Exception('Missing or invalid Authorization header')

    token = auth_header[7:]
    payload = verify_firebase_token(token)

    uid = payload.get('user_id') or payload.get('sub')
    if not uid:
        raise Exception('Token does not contain user_id')

    return uid


def unauthorized(message: str = 'Unauthorized') -> dict:
    return {
        'statusCode': 401,
        'headers': {'Content-Type': 'application/json'},
        'body': f'{{"error": "{message}"}}'
    }


def error_response(status_code: int, message: str) -> dict:
    return {
        'statusCode': status_code,
        'headers': {'Content-Type': 'application/json'},
        'body': f'{{"error": "{message}"}}'
    }


def success_response(data, status_code: int = 200) -> dict:
    import json
    return {
        'statusCode': status_code,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(data, default=str)
    }
