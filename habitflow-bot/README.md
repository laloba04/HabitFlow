# HabitFlow Bot

Bot de Telegram para gestionar hábitos y gastos personales. Permite crear hábitos diarios, registrar su cumplimiento y llevar un control de gastos por categoría, todo desde Telegram.

## Comandos

| Comando | Descripción | Ejemplo |
|---|---|---|
| `/start` | Bienvenida y lista de comandos | `/start` |
| `/habitos` | Lista tus hábitos con racha actual | `/habitos` |
| `/habito <nombre>` | Crea un nuevo hábito diario | `/habito Beber agua` |
| `/completar <nombre>` | Marca un hábito como completado hoy (acepta nombre parcial) | `/completar agua` |
| `/gastos` | Resumen de gastos del mes por categoría | `/gastos` |
| `/gasto <cantidad> <categoría> <descripción>` | Registra un gasto | `/gasto 12.50 food Almuerzo` |
| `/stats` | Estadísticas del día y del mes | `/stats` |

### Categorías de gastos disponibles

`food`, `transport`, `entertainment`, `health`, `shopping`, `bills`, `other`

## Requisitos

- Python 3.10+
- Cuenta de Firebase con Firestore habilitado
- Token de bot de Telegram (obtenido desde [@BotFather](https://t.me/BotFather))

## Instalación

1. Entra al directorio del bot:

```bash
cd habitflow-bot
```

2. Crea y activa un entorno virtual:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Instala las dependencias:

```bash
pip install -r requirements.txt
```

4. Copia el archivo de ejemplo de variables de entorno y rellénalo:

```bash
cp .env.example .env
```

5. Coloca tu archivo de credenciales de Firebase (`firebase-credentials.json`) en el directorio del bot.

## Variables de entorno

Crea un archivo `.env` con las siguientes variables:

```
TELEGRAM_TOKEN=tu-token-de-botfather
FIREBASE_CREDENTIALS=firebase-credentials.json
```

| Variable | Descripción |
|---|---|
| `TELEGRAM_TOKEN` | Token del bot obtenido desde @BotFather |
| `FIREBASE_CREDENTIALS` | Ruta al archivo JSON de credenciales de Firebase Admin SDK |

## Ejecución

```bash
source .venv/bin/activate
python bot.py
```

## Estructura de datos en Firestore

Cada usuario se identifica con el UID `telegram_{telegram_user_id}`.

**Colección `habits`:**
```json
{
  "userId": "telegram_123456789",
  "name": "Beber agua",
  "frequency": "daily",
  "currentStreak": 5,
  "longestStreak": 12,
  "completionHistory": ["2026-03-01", "2026-03-02"],
  "createdAt": "2026-02-01T10:00:00"
}
```

**Colección `expenses`:**
```json
{
  "userId": "telegram_123456789",
  "amount": 12.50,
  "category": "food",
  "description": "Almuerzo",
  "date": "2026-03-06",
  "createdAt": "2026-03-06T13:30:00"
}
```

## Autora

**María Bravo Angulo**
