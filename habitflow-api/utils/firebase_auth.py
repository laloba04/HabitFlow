import os
import requests
from jose import jwt, JWTError

FIREBASE_PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID', '')
GOOGLE_CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'


def verify_firebase_token(token: str) -> dict:
    """
    Verifica un JWT de Firebase y devuelve el payload si es válido.
    Lanza Exception si el token es inválido.
    """
    # Obtener certificados públicos de Google
    certs_response = requests.get(GOOGLE_CERTS_URL)
    certs = certs_response.json()

    # Obtener el kid del header del token
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get('kid')

    if kid not in certs:
        raise Exception('Invalid token: kid not found')

    public_key = certs[kid]

    payload = jwt.decode(
        token,
        public_key,
        algorithms=['RS256'],
        audience=FIREBASE_PROJECT_ID,
        issuer=f'https://securetoken.google.com/{FIREBASE_PROJECT_ID}'
    )

    return payload
