from app import db, bcrypt, jwt
from app.models import User, Category
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError

def get_categories_service():
    categories_list = Category.query.all()
    
    if not categories_list:
        raise NotFoundError("No hay categorias disponibles")
    
    return [category.serialize() for category in categories_list]


def add_category_service(**kwargs):
    
    existing_category = Category.query.filter_by(name=kwargs.get('name')).first()
    if existing_category:
        raise ConflictError("Ya existe una categoria con este nombre")
    
    allowed_fields = ['name', 'note', 'media_id']
    for key in kwargs.keys():
        if key not in allowed_fields:
            raise BadRequestError(f"El campo {key} no es valido para la categoria")
    
    new_category = Category(**kwargs)
        
    db.session.add(new_category)
    db.session.commit()
    
    return new_category.serialize()


def edit_category_service(id, **kwargs):
    
    category = Category.query.filter_by(id=id).first()
    if not category:
        raise NotFoundError("No se encontro la categoria a editar")
    
    allowed_fields = ['name', 'note', 'media_id']
    
    for key,value in kwargs.items():
        if key in allowed_fields and value:
            setattr(category, key, value)
        else:
            raise BadRequestError(f"No puedes editar el campo {key}")
        
    db.session.commit()
    
    return category.serialize()


def delete_category_service(id):
    
    if not id:
        raise BadRequestError("No indicaste que categoria deseas eliminar")
    
    category = Category.query.filter_by(id=id).first()
    
    if not category:
        raise NotFoundError("No se encontro la categoria a eliminar")
    
    db.session.delete(category)
    db.session.commit()
    
    return True