# HabitFlow 🌱

Ecosistema para seguimiento de hábitos y control de gastos personales.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Ionic](https://img.shields.io/badge/Ionic-7-3880FF?logo=ionic)
![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular)
![AWS](https://img.shields.io/badge/AWS-Lambda%20%2B%20DynamoDB-FF9900?logo=amazonaws)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)

## 🎯 Descripción

HabitFlow es un ecosistema completo para el seguimiento de hábitos y control de gastos personales. Incluye app móvil híbrida, bot de Telegram, landing page y backend serverless en AWS.

**Plataformas:**
- 📱 **iOS** (Ionic)
- 🤖 **Android** (Ionic)
- 🌐 **Web** (Landing Next.js) - [habit-flow-psi-one.vercel.app](https://habit-flow-psi-one.vercel.app/)
- 🤖 **Telegram** (Bot Python)

## 🏗️ Arquitectura

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Ionic App  │   │  Telegram   │   │   Landing   │
│  (Angular)  │   │    Bot      │   │  (Next.js)  │
└──────┬──────┘   └──────┬──────┘   └─────────────┘
       │                 │
       │    Firebase     │
       │      Auth       │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │   API Gateway   │
       │   (HTTP API)    │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │     Lambda      │
       │  (validación)   │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │    DynamoDB     │
       └─────────────────┘
```

## 📦 Componentes

| Componente | Descripción | Tecnología |
|------------|-------------|------------|
| **habitflow-app** | App móvil híbrida | Ionic 8 + Angular 20 |
| **habitflow-api** | Backend serverless | AWS Lambda + DynamoDB |
| **habitflow-bot** | Bot de Telegram | Python + python-telegram-bot |
| **habitflow-landing** | Landing page | Next.js + Tailwind + Vercel |

## ✨ Funcionalidades

### 📱 App Móvil
- Autenticación con Firebase
- CRUD de hábitos con rachas
- Registro de gastos por categoría
- Dashboard con estadísticas
- Gráficos de progreso
- Notificaciones locales
- Modo oscuro

### 🤖 Bot Telegram
- Registro rápido de hábitos
- Consulta de estadísticas
- Recordatorios automáticos

### 🌐 Landing Page
- Presentación del producto
- Capturas de pantalla
- Call to action

## 🔐 Seguridad

### Autenticación (Firebase)
- **Firebase Auth**: email y contraseña
- **Firestore Security Rules**: cada usuario solo accede a sus datos

### Lambda
- **Verificación del token de Firebase** en cada petición
- **Validación y saneado de entradas** (`utils/validator.py`)
- **Configuración por variables de entorno**, sin credenciales en el código

### DynamoDB
- **Acceso con el SDK** (boto3), sin construir consultas a mano

### Pendiente para producción
- Límites de peticiones (throttling) en API Gateway
- Rol IAM propio con mínimo privilegio (ahora usa el `LabRole` de AWS Academy)
- AWS WAF

## 🛠️ Tech Stack

| Capa | Tecnología |
|------|------------|
| Mobile | Ionic 8, Angular 20, Capacitor 8 |
| Auth | Firebase Authentication |
| Backend | AWS Lambda (Python) |
| Database | DynamoDB |
| API | API Gateway (HTTP API) |
| Bot | Python + python-telegram-bot |
| Landing | Next.js 14, Tailwind CSS |
| Hosting | Vercel (landing), AWS (API) |

## 📁 Estructura del Proyecto

```
habitflow/
├── habitflow-app/           # App Ionic/Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── habit.service.ts
│   │   │   │   └── expense.service.ts
│   │   │   └── guards/
│   │   │       └── auth.guard.ts
│   │   └── environments/
│   └── capacitor.config.ts
├── habitflow-api/           # Backend AWS
│   ├── handlers/
│   │   ├── habits.py
│   │   ├── expenses.py
│   │   └── auth_middleware.py
│   ├── utils/
│   │   ├── validator.py     # Validación de inputs
│   │   ├── sanitizer.py     # Sanitización XSS
│   │   └── firebase_auth.py # Verificación JWT
│   ├── template.yaml        # SAM template
│   └── requirements.txt
├── habitflow-bot/           # Bot Telegram
│   ├── bot.py
│   └── requirements.txt
├── habitflow-landing/       # Landing Next.js
│   ├── app/
│   ├── components/
│   └── public/
└── README.md
```

## 🚀 Instalación

### App Móvil

```bash
cd habitflow-app
npm install
ionic serve          # Desarrollo
ionic build          # Producción
npx cap add ios      # Añadir iOS
npx cap add android  # Añadir Android
```

### Backend AWS

```bash
cd habitflow-api
pip install -r requirements.txt
sam build
sam deploy --guided
```

### Bot Telegram

```bash
cd habitflow-bot
pip install -r requirements.txt
python bot.py
```

### Landing Page

```bash
cd habitflow-landing
npm install
npm run dev      # Desarrollo
npm run build    # Producción
```

## ⚙️ Configuración

### Firebase
1. Crear proyecto en Firebase Console
2. Activar Authentication (Email/Password)
3. Copiar config a `environments/environment.ts`

### AWS (Lambda)
Variables de entorno en Lambda:
```
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_API_KEY=tu-api-key
```

### Telegram
1. Crear bot con @BotFather
2. Copiar token a variables de entorno

## 🎓 AWS Certified Developer Associate

Este proyecto cubre los siguientes temas del examen:

| Tema | Servicio usado |
|------|----------------|
| Desarrollo serverless | Lambda |
| Bases de datos NoSQL | DynamoDB |
| APIs REST | API Gateway |
| Seguridad | Verificación de tokens, validación de entradas |
| Infraestructura como código | SAM/CloudFormation |
| Monitorización | CloudWatch |

## 💰 Coste estimado (AWS Academy)

| Servicio | Coste/mes |
|----------|:---------:|
| Firebase Auth | $0 (gratis) |
| Lambda | ~$0-1 |
| DynamoDB | ~$1-2 |
| API Gateway | ~$0-1 |
| CloudWatch | ~$0-1 |
| **Total** | **~$3-5** |

## 🗺️ Roadmap

- [x] Setup proyecto Ionic + Angular
- [x] Autenticación Firebase
- [x] Backend AWS Lambda
- [x] CRUD hábitos
- [x] CRUD gastos
- [x] Seguridad (verificación de tokens, validación)
- [x] Bot Telegram
- [x] Dashboard con gráficos
- [~] Landing page (base hecha, pendiente mejoras)
- [x] Hero con mockup de la app
- [x] Características (6 cards)
- [x] Plataformas y arquitectura
- [x] Estadísticas con contadores animados
- [x] FAQ con acordeón
- [x] CTA y Footer
- [x] Sección de Seguridad
  - [x] Sección de Tech Stack
  - [x] Despliegue en Vercel
- [x] Notificaciones push

## 👩‍💻 Autora

**María Bravo Angulo**
- LinkedIn: [maria-bravo-angulo](https://www.linkedin.com/in/maria-bravo-angulo-363133337/)
- GitHub: [@laloba04](https://github.com/laloba04)

