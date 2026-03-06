import re


def validate_habit(data: dict) -> list[str]:
    """Valida los campos de un hábito. Devuelve lista de errores."""
    errors = []

    name = data.get('name', '')
    if not name or not isinstance(name, str):
        errors.append('name is required')
    elif len(name.strip()) < 1 or len(name.strip()) > 100:
        errors.append('name must be between 1 and 100 characters')
    # Sanitizar XSS básico
    elif re.search(r'<[^>]+>', name):
        errors.append('name contains invalid characters')

    frequency = data.get('frequency')
    if frequency not in ('daily', 'weekly'):
        errors.append('frequency must be "daily" or "weekly"')

    return errors


def validate_expense(data: dict) -> list[str]:
    """Valida los campos de un gasto. Devuelve lista de errores."""
    errors = []

    amount = data.get('amount')
    if amount is None:
        errors.append('amount is required')
    else:
        try:
            amount_float = float(amount)
            if amount_float <= 0:
                errors.append('amount must be greater than 0')
            if amount_float > 1_000_000:
                errors.append('amount is too large')
        except (ValueError, TypeError):
            errors.append('amount must be a number')

    valid_categories = {'food', 'transport', 'entertainment', 'health', 'shopping', 'bills', 'other'}
    category = data.get('category')
    if category not in valid_categories:
        errors.append(f'category must be one of: {", ".join(sorted(valid_categories))}')

    description = data.get('description', '')
    if not description or not isinstance(description, str):
        errors.append('description is required')
    elif len(description.strip()) > 200:
        errors.append('description must be 200 characters or less')
    elif re.search(r'<[^>]+>', description):
        errors.append('description contains invalid characters')

    date = data.get('date', '')
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', date):
        errors.append('date must be in YYYY-MM-DD format')

    return errors


def sanitize_string(value: str) -> str:
    """Elimina caracteres HTML peligrosos."""
    return re.sub(r'[<>&"\'`]', '', str(value)).strip()
