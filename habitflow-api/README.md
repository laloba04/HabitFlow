# HabitFlow API ⚡

Backend serverless para HabitFlow usando AWS Lambda y DynamoDB.

![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900?logo=awslambda)
![DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-4053D6?logo=amazondynamodb)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)
![SAM](https://img.shields.io/badge/AWS-SAM-FF9900?logo=amazonaws)

## 🎯 Descripción

API REST serverless que gestiona hábitos y gastos. Construida con AWS Lambda (Python 3.12) y DynamoDB. Cada endpoint requiere un token JWT de Firebase válido.

## 📡 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/habits` | Listar hábitos del usuario |
| POST | `/habits` | Crear hábito |
| PUT | `/habits/{habitId}` | Actualizar hábito |
| DELETE | `/habits/{habitId}` | Eliminar hábito |
| GET | `/expenses` | Listar gastos (opcional: `?month=YYYY-MM`) |
| POST | `/expenses` | Crear gasto |
| DELETE | `/expenses/{expenseId}` | Eliminar gasto |

Todos los endpoints requieren el header:
```
Authorization: Bearer <Firebase ID Token>
```

## 🔐 Seguridad

- Verificación JWT de Firebase con `python-jose` + certificados públicos de Google
- Validación y sanitización de inputs en cada request
- `ConditionExpression` en DynamoDB para verificar ownership antes de modificar
- Rate limiting via API Gateway throttling
- IAM con principio de mínimo privilegio

## 📁 Estructura

```
habitflow-api/
├── handlers/
│   ├── habits.py           # CRUD hábitos
│   ├── expenses.py         # CRUD gastos
│   └── auth_middleware.py  # Extracción y verificación del token
├── utils/
│   ├── firebase_auth.py    # Verificación JWT con Google certs
│   └── validator.py        # Validación y sanitización XSS
├── template.yaml           # SAM — IaC
├── requirements.txt
└── .env.example
```

## 🚀 Deploy

```bash
# Compilar y desplegar
sam build
sam deploy --guided
```

## 👩‍💻 Autora

**María Bravo Angulo**
- LinkedIn: [maria-bravo-angulo](https://www.linkedin.com/in/maria-bravo-angulo-363133337/)
- GitHub: [@laloba04](https://github.com/laloba04)
