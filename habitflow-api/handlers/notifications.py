import json
import os
import firebase_admin
from firebase_admin import credentials, messaging, firestore

# Mantiene vivo Firebase entre ejecuciones en Lambda para ser más rápido
if not firebase_admin._apps:
    try:
        # Cargamos las credenciales del archivo local que hemos copiado al directorio del API
        cred = credentials.Certificate('firebase-credentials.json')
        default_app = firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error inicializando Firebase Admin: {e}")

def get_users_tokens():
    """Recupera los tokens de dispositivos móviles FCM de la tabla users de Firestore"""
    tokens = []
    try:
        db = firestore.client()
        # Escaneamos los usuarios para buscar tokens vinculados
        users_ref = db.collection('users')
        docs = users_ref.stream()

        for doc in docs:
            data = doc.to_dict()
            if 'fcmToken' in data:
                tokens.append({
                    "uid": doc.id,
                    "token": data['fcmToken']
                })
    except Exception as e:
        print(f"Error leyendo Firestore: {e}")
    
    return tokens

def lambda_handler(event, context):
    """
    Cron / Función desencadenada por AWS EventBridge todos los días a las 20:00 (por ejemplo)
    O activada a mano para las pruebas.
    """
    print("Iniciando tarea de notificación a dispositivos de HabitFlow...")
    
    # 1. Obtenemos a quién enviar
    users_with_push = get_users_tokens()
    if not users_with_push:
        return {
            "statusCode": 200,
            "body": json.dumps("No hay usuarios con tokens registrados para Push")
        }

    # 2. Fabricamos el paquete visual (El título y texto que sale en tu pantalla)
    message_title = "¿Qué tal tu día?"
    message_body = "Recuerda registrar tus hábitos en HabitFlow antes de dormir. ¡Mantén tu racha viva!"

    # 3. Mandamos mensajes individualmente (por ahora)
    success_count = 0
    failure_count = 0

    for user in users_with_push:
        token = user['token']
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=message_title,
                    body=message_body,
                ),
                token=token,
            )
            
            # Envío real a los servidores de Firebase
            response = messaging.send(message)
            print(f"Notificación enviada con éxito al Firebase Token: {response}")
            success_count += 1
            
        except Exception as e:
            # Si el token es inválido (el usuario desinstaló la app, borramos el token viejo de la BBDD)
            failure_count += 1
            print(f"Error enviando mensaje a {user['uid']}, probablemente el token haya caducado. {e}")

    # Retorno final a AWS
    resultado_final = f"Proceso finalizado. Notificaciones entregadas: {success_count}, Falladas: {failure_count}"
    print(resultado_final)
    
    return {
        "statusCode": 200,
        "body": json.dumps(resultado_final)
    }
