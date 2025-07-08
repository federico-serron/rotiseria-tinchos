from app import db, bcrypt, jwt
from app.models import User, Menu
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError


def get_menu_service():
    """
    Retrieves the menu items from the database.
    
    Returns:
        list: A list of menu items.
    
    Raises:
        NotFoundError: If no menu items are found.
    """
    menu_items = Menu.query.all()
    
    if not menu_items:
        raise NotFoundError("No hay menus disponibles aun.")
    
    return [item.serialize() for item in menu_items] 