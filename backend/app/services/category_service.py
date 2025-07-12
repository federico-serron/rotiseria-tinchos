from app import db, bcrypt, jwt
from app.models import User, Category
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError

def get_categories_service():
    categories_list = Category.query.all()
    
    if not categories_list:
        raise NotFoundError("No hay categorias disponibles")
    
    return [category.serialize() for category in categories_list]


def add_category_service():
    pass