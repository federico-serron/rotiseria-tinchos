from app import db, bcrypt, jwt
from flask import current_app
from app.models import User, Menu, Media
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError
from werkzeug.utils import secure_filename
from app.utils import allowed_file
import os


def     get_menu_service(page, per_page):
    """
    Retrieves the menu items from the database.
    
    Returns:
        list: A list of menu items.
    
    Raises:
        NotFoundError: If no menu items are found.
    """
    query = db.paginate(Menu.query.filter_by(is_available=True), page=page, per_page=per_page, error_out=False)
     
    if not query.items:
        raise NotFoundError("No hay menus disponibles aun.")
    
    return query


def add_menu_item_service(name, description, price, category_id, image):
    """    Adds a new menu item to the database."""
    MAX_FILE_SIZE = 1 * 1024 * 1024  # 1 MB en bytes
    

    price = int(price)
    category_id = int(category_id)

    if price <= 0 or category_id <= 0:
        raise ValueError("El valor del menu no puede ser menor a 1")
    
    existing_menu = Menu.query.filter_by(name=name).first()
    if existing_menu:
        raise ConflictError("Ya existe un item con ese nombre, intenta uno diferente")
    
    
    if image:
        
        # Validar extensión
        if not allowed_file(image.filename):
            raise TypeError("Solo se permiten imágenes JPG o PNG")

        # Validar tamaño del archivo
        image.stream.seek(0, os.SEEK_END)
        file_size = image.stream.tell()
        image.stream.seek(0)  # Volver al inicio

        if file_size > MAX_FILE_SIZE:
            raise ValueError("La imagen no puede pesar más de 1MB")
        
        filename = secure_filename(image.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        abs_path = os.path.join(upload_folder, filename)
        relative_path = os.path.join('uploads', filename).replace("\\", "/")
        image.save(abs_path)
        
        media = Media(type='menu', path=f"/{relative_path}")
        db.session.add(media)
        db.session.flush()
        
        media_id = media.id
        
    else:
        media_id = None
        
    new_menu_item = Menu(name=name, description=description, price=price, category_id=category_id, media_id=media_id)
    
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