# HabitFlow API ⚡

Backend serverless para HabitFlow usando AWS Lambda y DynamoDB.

![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900?logo=awslambda)
![DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-4053D6?logo=amazondynamodb)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)

## 🎯 Descripción

API REST serverless que gestiona hábitos y gastos. Construida con AWS Lambda (Python) y DynamoDB.

## 📡 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/habits` | Listar hábitos |
| POST | `/habits` | Crear hábito |
| PUT | `/habits/{id}` | Actualizar |
| DELETE | `/habits/{id}` | Eliminar |
| GET | `/expenses` | Listar gastos |
| POST | `/expenses` | Crear gasto |

## 🔐 Seguridad

- Verificación JWT (Firebase)
- Validación de inputs
- Rate limiting (API Gateway throttling)
- IAM roles mínimos

## 📁 Estructura

```
habitflow-api/
├── handlers/
│   ├── habits.py
│   └── expenses.py
├── utils/
│   ├── validator.py
│   └── firebase_auth.py
├── template.yaml
└── requirements.txt
```

## 🚀 Deploy

```bash
sam build
sam deploy --guided
```

## 👩‍💻 Autora

**María Bravo Angulo**
