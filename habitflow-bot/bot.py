import os
import logging
from datetime import datetime, date, timedelta
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

load_dotenv()

# Configuración de logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Inicialización de Firebase
cred = credentials.Certificate(os.getenv('FIREBASE_CREDENTIALS', 'firebase-credentials.json'))
firebase_admin.initialize_app(cred)
db = firestore.client()

# Categorías de gastos permitidas
CATEGORIES = {'food', 'transport', 'entertainment', 'health', 'shopping', 'bills', 'other'}

# Emojis por categoría
CATEGORY_EMOJI = {
    'food': '🍔', 'transport': '🚌', 'entertainment': '🎬',
    'health': '💊', 'shopping': '🛍️', 'bills': '📱', 'other': '📦'
}

# Nombres en español por categoría
CATEGORY_LABELS = {
    'food': 'Comida', 'transport': 'Transporte', 'entertainment': 'Ocio',
    'health': 'Salud', 'shopping': 'Compras', 'bills': 'Facturas', 'other': 'Otros'
}


# --- Funciones helper ---

def get_uid(user_id: int) -> str:
    """Devuelve el UID de Firestore para un usuario de Telegram."""
    return f"telegram_{user_id}"


def get_today() -> str:
    """Devuelve la fecha actual en formato YYYY-MM-DD."""
    return date.today().isoformat()


def get_month_prefix() -> str:
    """Devuelve el prefijo del mes actual en formato YYYY-MM."""
    return date.today().strftime('%Y-%m')


# --- Handlers de comandos ---

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Mensaje de bienvenida con lista de comandos disponibles."""
    nombre = update.effective_user.first_name or 'usuario'
    mensaje = (
        f"¡Hola, {nombre}! 👋 Soy HabitFlow, tu asistente de hábitos y gastos.\n\n"
        "Aquí tienes lo que puedo hacer por ti:\n\n"
        "📋 *Hábitos*\n"
        "/habitos — Ver tus hábitos y rachas actuales\n"
        "/habito <nombre> — Crear un nuevo hábito\n"
        "  _Ej: /habito Beber agua_\n"
        "/completar <nombre> — Marcar un hábito como completado hoy\n"
        "  _Ej: /completar agua_\n\n"
        "💰 *Gastos*\n"
        "/gastos — Ver resumen de gastos del mes\n"
        "/gasto <cantidad> <categoría> <descripción> — Registrar un gasto\n"
        "  _Ej: /gasto 12.50 food Almuerzo_\n\n"
        "📊 *Estadísticas*\n"
        "/stats — Ver resumen del día y del mes\n\n"
        "Categorías disponibles: food, transport, entertainment, health, shopping, bills, other\n\n"
        "¡Empecemos! 🚀"
    )
    await update.message.reply_text(mensaje, parse_mode='Markdown')


async def habitos(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Lista los hábitos del usuario con su racha actual."""
    try:
        uid = get_uid(update.effective_user.id)
        today = get_today()

        # Consultar hábitos del usuario en Firestore
        docs = db.collection('habits').where('userId', '==', uid).stream()
        lista = list(docs)

        if not lista:
            await update.message.reply_text(
                "Aún no tienes hábitos registrados.\n"
                "Crea uno con /habito <nombre>\n"
                "_Ej: /habito Beber agua_",
                parse_mode='Markdown'
            )
            return

        lineas = ["📋 *Tus hábitos:*\n"]
        for doc in lista:
            datos = doc.to_dict()
            nombre = datos.get('name', 'Sin nombre')
            racha = datos.get('currentStreak', 0)
            historial = datos.get('completionHistory', [])

            # Verificar si ya está completado hoy
            completado_hoy = today in historial
            icono = '✅' if completado_hoy else '⬜'

            lineas.append(f"{icono} *{nombre}*")
            lineas.append(f"   🔥 Racha: {racha} días\n")

        await update.message.reply_text('\n'.join(lineas), parse_mode='Markdown')

    except Exception as e:
        logger.error(f"Error en /habitos: {e}")
        await update.message.reply_text("Ocurrió un error al obtener tus hábitos. Inténtalo de nuevo.")


async def crear_habito(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Crea un nuevo hábito diario para el usuario."""
    try:
        # Validar que se proporcionó el nombre
        if not context.args:
            await update.message.reply_text(
                "Debes indicar el nombre del hábito.\n"
                "_Ej: /habito Beber agua_",
                parse_mode='Markdown'
            )
            return

        uid = get_uid(update.effective_user.id)
        nombre = ' '.join(context.args)

        # Crear el documento del hábito en Firestore
        db.collection('habits').add({
            'userId': uid,
            'name': nombre,
            'frequency': 'daily',
            'currentStreak': 0,
            'longestStreak': 0,
            'completionHistory': [],
            'createdAt': datetime.utcnow().isoformat(),
        })

        await update.message.reply_text(
            f"✅ Hábito *{nombre}* creado correctamente.\n"
            f"Márcalo como completado con /completar {context.args[0].lower()}",
            parse_mode='Markdown'
        )

    except Exception as e:
        logger.error(f"Error en /habito: {e}")
        await update.message.reply_text("Ocurrió un error al crear el hábito. Inténtalo de nuevo.")


async def completar_habito(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Marca un hábito como completado hoy."""
    try:
        # Validar que se proporcionó el nombre o parte de él
        if not context.args:
            await update.message.reply_text(
                "Debes indicar el nombre (o parte) del hábito.\n"
                "_Ej: /completar agua_",
                parse_mode='Markdown'
            )
            return

        uid = get_uid(update.effective_user.id)
        busqueda = ' '.join(context.args).lower()
        today = get_today()

        # Buscar hábitos del usuario
        docs = db.collection('habits').where('userId', '==', uid).stream()
        coincidencias = []

        for doc in docs:
            datos = doc.to_dict()
            if busqueda in datos.get('name', '').lower():
                coincidencias.append((doc.reference, datos))

        # Verificar coincidencias
        if len(coincidencias) == 0:
            await update.message.reply_text(
                f"No encontré ningún hábito que contenga '*{busqueda}*'.\n"
                "Usa /habitos para ver tus hábitos.",
                parse_mode='Markdown'
            )
            return

        if len(coincidencias) > 1:
            nombres = '\n'.join([f"• {d.get('name', '')}" for _, d in coincidencias])
            await update.message.reply_text(
                f"Encontré varios hábitos que coinciden con '*{busqueda}*':\n{nombres}\n\n"
                "Sé más específico para marcar uno solo.",
                parse_mode='Markdown'
            )
            return

        # Exactamente una coincidencia: marcar como completado
        ref, datos = coincidencias[0]
        historial = datos.get('completionHistory', [])
        nombre = datos.get('name', 'hábito')
        racha_actual = datos.get('currentStreak', 0)
        racha_mas_larga = datos.get('longestStreak', 0)

        # Verificar si ya está completado hoy
        if today in historial:
            await update.message.reply_text(
                f"✅ Ya completaste *{nombre}* hoy.\n"
                f"🔥 Racha actual: {racha_actual} días",
                parse_mode='Markdown'
            )
            return

        # Añadir hoy al historial
        historial.append(today)

        # Calcular la nueva racha
        ayer = (date.today() - timedelta(days=1)).isoformat()
        if ayer in historial:
            nueva_racha = racha_actual + 1
        else:
            nueva_racha = 1

        # Actualizar racha más larga si es necesario
        nueva_racha_mas_larga = max(racha_mas_larga, nueva_racha)

        # Guardar cambios en Firestore
        ref.update({
            'completionHistory': historial,
            'currentStreak': nueva_racha,
            'longestStreak': nueva_racha_mas_larga,
        })

        # Mensaje celebratorio según la racha
        if nueva_racha == 1:
            celebracion = "¡Buen comienzo! 💪"
        elif nueva_racha < 7:
            celebracion = "¡Sigue así! 🌟"
        elif nueva_racha < 30:
            celebracion = "¡Increíble constancia! 🏆"
        else:
            celebracion = "¡Eres una máquina! 🔥🔥🔥"

        await update.message.reply_text(
            f"✅ ¡*{nombre}* completado!\n"
            f"🔥 Racha actual: {nueva_racha} días\n\n"
            f"{celebracion}",
            parse_mode='Markdown'
        )

    except Exception as e:
        logger.error(f"Error en /completar: {e}")
        await update.message.reply_text("Ocurrió un error al completar el hábito. Inténtalo de nuevo.")


async def gastos(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra el resumen de gastos del mes actual por categoría."""
    try:
        uid = get_uid(update.effective_user.id)
        mes = get_month_prefix()

        # Consultar gastos del usuario en Firestore
        docs = db.collection('expenses').where('userId', '==', uid).stream()

        # Filtrar por mes actual y agrupar por categoría
        totales_por_categoria = {}
        total_mes = 0.0

        for doc in docs:
            datos = doc.to_dict()
            fecha = datos.get('date', '')
            # Filtrar gastos del mes actual
            if fecha.startswith(mes):
                categoria = datos.get('category', 'other')
                importe = float(datos.get('amount', 0))
                totales_por_categoria[categoria] = totales_por_categoria.get(categoria, 0.0) + importe
                total_mes += importe

        if not totales_por_categoria:
            await update.message.reply_text(
                f"No tienes gastos registrados en {mes}.\n"
                "Registra uno con /gasto <cantidad> <categoría> <descripción>\n"
                "_Ej: /gasto 12.50 food Almuerzo_",
                parse_mode='Markdown'
            )
            return

        # Construir el mensaje de resumen
        lineas = [f"💰 *Gastos de {mes}*\n"]
        for categoria, total in sorted(totales_por_categoria.items()):
            emoji = CATEGORY_EMOJI.get(categoria, '📦')
            label = CATEGORY_LABELS.get(categoria, categoria.capitalize())
            lineas.append(f"{emoji} {label}: *{total:.2f}€*")

        lineas.append(f"\n💳 *Total del mes: {total_mes:.2f}€*")

        await update.message.reply_text('\n'.join(lineas), parse_mode='Markdown')

    except Exception as e:
        logger.error(f"Error en /gastos: {e}")
        await update.message.reply_text("Ocurrió un error al obtener tus gastos. Inténtalo de nuevo.")


async def crear_gasto(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Registra un nuevo gasto."""
    try:
        # Validar que se proporcionaron los argumentos necesarios
        if not context.args or len(context.args) < 3:
            await update.message.reply_text(
                "Formato incorrecto. Usa: /gasto <cantidad> <categoría> <descripción>\n"
                "_Ej: /gasto 12.50 food Almuerzo con compañeros_\n\n"
                f"Categorías disponibles: {', '.join(sorted(CATEGORIES))}",
                parse_mode='Markdown'
            )
            return

        uid = get_uid(update.effective_user.id)

        # Validar la cantidad
        try:
            cantidad = float(context.args[0])
            if cantidad <= 0:
                raise ValueError("La cantidad debe ser positiva")
        except ValueError:
            await update.message.reply_text(
                f"La cantidad '*{context.args[0]}*' no es válida. Debe ser un número positivo.\n"
                "_Ej: /gasto 12.50 food Almuerzo_",
                parse_mode='Markdown'
            )
            return

        # Validar la categoría (case-insensitive)
        categoria_input = context.args[1].lower()
        if categoria_input not in CATEGORIES:
            await update.message.reply_text(
                f"Categoría '*{context.args[1]}*' no válida.\n"
                f"Categorías disponibles: {', '.join(sorted(CATEGORIES))}",
                parse_mode='Markdown'
            )
            return

        # La descripción es el resto de los argumentos
        descripcion = ' '.join(context.args[2:])

        # Crear el documento del gasto en Firestore
        db.collection('expenses').add({
            'userId': uid,
            'amount': cantidad,
            'category': categoria_input,
            'description': descripcion,
            'date': get_today(),
            'createdAt': datetime.utcnow().isoformat(),
        })

        emoji = CATEGORY_EMOJI.get(categoria_input, '📦')
        label = CATEGORY_LABELS.get(categoria_input, categoria_input.capitalize())

        await update.message.reply_text(
            f"{emoji} Gasto registrado:\n"
            f"*{descripcion}*\n"
            f"💶 {cantidad:.2f}€ en {label}",
            parse_mode='Markdown'
        )

    except Exception as e:
        logger.error(f"Error en /gasto: {e}")
        await update.message.reply_text("Ocurrió un error al registrar el gasto. Inténtalo de nuevo.")


async def stats(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra estadísticas del día: hábitos completados hoy y gasto total del mes."""
    try:
        uid = get_uid(update.effective_user.id)
        today = get_today()
        mes = get_month_prefix()

        # --- Estadísticas de hábitos ---
        habitos_docs = list(db.collection('habits').where('userId', '==', uid).stream())
        total_habitos = len(habitos_docs)
        completados_hoy = 0
        racha_mas_larga = 0

        for doc in habitos_docs:
            datos = doc.to_dict()
            historial = datos.get('completionHistory', [])
            if today in historial:
                completados_hoy += 1
            racha = datos.get('currentStreak', 0)
            if racha > racha_mas_larga:
                racha_mas_larga = racha

        # --- Estadísticas de gastos ---
        gastos_docs = db.collection('expenses').where('userId', '==', uid).stream()
        total_mes = 0.0

        for doc in gastos_docs:
            datos = doc.to_dict()
            if datos.get('date', '').startswith(mes):
                total_mes += float(datos.get('amount', 0))

        # --- Construir el mensaje ---
        mensaje = (
            f"📊 *Estadísticas de hoy ({today})*\n\n"
            f"📋 Hábitos completados hoy: *{completados_hoy}/{total_habitos}*\n"
            f"🔥 Racha más larga activa: *{racha_mas_larga} días*\n"
            f"💰 Gasto del mes: *{total_mes:.2f}€*"
        )

        await update.message.reply_text(mensaje, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"Error en /stats: {e}")
        await update.message.reply_text("Ocurrió un error al obtener las estadísticas. Inténtalo de nuevo.")


def main():
    """Punto de entrada principal del bot."""
    token = os.getenv('TELEGRAM_TOKEN')
    if not token:
        raise ValueError("TELEGRAM_TOKEN no configurado en .env")

    app = Application.builder().token(token).build()

    # Registrar los handlers de comandos
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("habitos", habitos))
    app.add_handler(CommandHandler("habito", crear_habito))
    app.add_handler(CommandHandler("completar", completar_habito))
    app.add_handler(CommandHandler("gastos", gastos))
    app.add_handler(CommandHandler("gasto", crear_gasto))
    app.add_handler(CommandHandler("stats", stats))

    logger.info("Bot iniciado")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
