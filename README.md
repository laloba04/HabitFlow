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
- 🌐 **Web** (Landing Next.js)
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
       │  (+ throttling) │
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
| **habitflow-app** | App móvil híbrida | Ionic 7 + Angular 17 |
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
- **Firebase Auth**: Email/password + providers sociales
- **JWT tokens**: Verificación en cada request a Lambda
- **Refresh tokens**: Renovación automática de sesión

### API Gateway
- **Throttling**: Rate limiting (100 requests/segundo por IP)
- **Burst limit**: Máximo 200 requests en ráfaga
- **API Key**: Autenticación de clientes (opcional)
- **HTTPS only**: TLS 1.2+ obligatorio

### Lambda
- **Validación de inputs**: Sanitización de todos los datos
- **Verificación JWT**: Comprobar token de Firebase en cada request
- **Variables de entorno**: Credenciales en env vars (no hardcodeadas)
- **Logging seguro**: Sin datos sensibles en CloudWatch
- **IAM roles mínimos**: Principio de mínimo privilegio

### Frontend
- **Sanitización XSS**: Escape de contenido dinámico
- **HTTPS obligatorio**: Comunicación cifrada
- **CSP Headers**: Content Security Policy
- **Firebase Security Rules**: Acceso restringido por usuario

### DynamoDB
- **Cifrado en reposo**: Automático con AWS KMS
- **Acceso por IAM**: Sin credenciales en código
- **Consultas seguras**: Sin inyección gracias a SDK

### Nota sobre producción
> En un entorno de producción se añadiría AWS WAF para protección adicional contra ataques comunes (SQL injection, XSS, DDoS). Para este proyecto se usa throttling de API Gateway como alternativa.

## 🛠️ Tech Stack

| Capa | Tecnología |
|------|------------|
| Mobile | Ionic 7, Angular 17, Capacitor |
| Auth | Firebase Authentication |
| Backend | AWS Lambda (Python) |
| Database | DynamoDB |
| API | API Gateway (con throttling) |
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

### API Gateway Throttling
```yaml
# template.yaml
ThrottlingBurstLimit: 200
ThrottlingRateLimit: 100
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
| Seguridad | IAM, throttling |
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

- [ ] Setup proyecto Ionic + Angular
- [ ] Autenticación Firebase
- [ ] Backend AWS Lambda
- [ ] CRUD hábitos
- [ ] CRUD gastos
- [ ] Seguridad (throttling, validación)
- [ ] Bot Telegram
- [ ] Landing page
- [ ] Dashboard con gráficos
- [ ] Notificaciones push

## 👩‍💻 Autora

**María Bravo Angulo**
- LinkedIn: [maria-bravo-angulo](https://www.linkedin.com/in/maria-bravo-angulo-363133337/)
- GitHub: [@laloba04](https://github.com/laloba04)

