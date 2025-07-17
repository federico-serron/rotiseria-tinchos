from app import db, bcrypt, jwt
from app.models import User, Menu, Invoice, InvoiceMenu
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError

def add_invoice_menu_service(user_id, items: list[dict]):
    
    user = User.query.get(user_id)
    if not user:
        raise NotFoundError("Usuario no encontrado")
    
    total = 0
    invoice = Invoice(user=user, total=0, status="pending")

    for item in items:
        menu = Menu.query.get(item["menu_id"])
        if not menu:
            raise NotFoundError("Menu no encontrado1")
        quantity = item["quantity"]
        total += menu.price * quantity
        invoice_item = InvoiceMenu(menu=menu, quantity=quantity)
        invoice.invoice_menus.append(invoice_item)
    
    invoice.total = total
    db.session.add(invoice)
    db.session.commit()
    return invoice.serialize()