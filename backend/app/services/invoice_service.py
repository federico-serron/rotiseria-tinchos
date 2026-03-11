from decimal import Decimal, ROUND_HALF_UP
from app import db, bcrypt, jwt
from app.models import User, Menu, Invoice, InvoiceMenu
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError


def get_user_invoices(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise NotFoundError("No se encontro el usuario")
    
    user_invoices = Invoice.query.filter_by(user_id=user_id).all()
    if not user_invoices:
        raise NotFoundError("No tienes facturas")
    
    return [invoice.serialize() for invoice in user_invoices]



def _normalize_items(items: list[dict]):
    """
    Validates and normalizes the items payload returning a list of tuples
    with the related menu instance and the required quantity.
    """
    if not items or not isinstance(items, list):
        raise BadRequestError("Debes enviar al menos un producto para facturar")

    normalized_items = []
    total = Decimal("0.00")

    for item in items:
        try:
            menu_id = int(item.get("menu_id"))
            quantity = int(item.get("quantity"))
        except (TypeError, ValueError):
            raise BadRequestError("Formato de items inválido")

        if quantity <= 0:
            raise BadRequestError("La cantidad debe ser mayor a cero")

        menu = Menu.query.get(menu_id)
        if not menu or not menu.is_available:
            raise NotFoundError("Menu no encontrado o no disponible")

        price = Decimal(str(menu.price))
        total += price * quantity
        normalized_items.append((menu, quantity))

    return normalized_items, total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_items_total(items: list[dict]) -> Decimal:
    """
    Returns the total amount for the provided items using server-side pricing
    to avoid tampering.
    """
    _, total = _normalize_items(items)
    return total


def add_invoice_menu_service(
    user_id,
    items: list[dict],
    status: str = "pending",
    payment_id: str | None = None,
    payment_provider: str | None = None,
    payment_status: str | None = None
):
    user = User.query.get(user_id)
    if not user:
        raise NotFoundError("Usuario no encontrado")

    normalized_items, total = _normalize_items(items)
    invoice = Invoice(
        user=user,
        total=float(total),
        status=status,
        payment_id=payment_id,
        payment_provider=payment_provider,
        payment_status=payment_status or status,
    )

    for menu, quantity in normalized_items:
        invoice_item = InvoiceMenu(menu=menu, quantity=quantity)
        invoice.invoice_menus.append(invoice_item)
    
    db.session.add(invoice)
    db.session.commit()
    return invoice.serialize()
