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


def add_menu_item_service(name, description, price, category_id):
    """    Adds a new menu item to the database."""
    
    existing_menu = Menu.query.filter_by(name=name).first()
    if existing_menu:
        raise ConflictError("Ya existe un item con ese nombre, intenta uno diferente")

    new_menu_item = Menu(name=name, description=description, price=price, category_id=category_id)
    
    db.session.add(new_menu_item)
    db.session.commit()
        
    return new_menu_item.serialize()


def edit_menu_item_service(id, **kwargs):
    """
    Updates an item from the menu
    
    Receives:
        id -> menu id
        **kwargs -> dictornary sent it form the frontend as a json
    
    Returns:
        dict -> menu item updated
            
    Raises:
        NotFoundError: If no menu item is found.
    """
    
    item = Menu.query.filter_by(id=id).first()
    if not item:
        raise NotFoundError("No se encontro el menu a editar")
    
    updatebale_fields = ['name', 'description', 'price', 'category_id', 'is_available']
    
    for key,value in kwargs.items():
        if key in updatebale_fields:
            setattr(item, key, value)
            
    db.session.commit()
    
    return item.serialize()


def delete_menu_item_serivce(id):
    item = Menu.query.filter_by(id=id).first()
    
    if not item:
        raise NotFoundError("No se encontro el menu a eliminar")
    
    item.is_available = False
    db.session.commit()
    
    return True