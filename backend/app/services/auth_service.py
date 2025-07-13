from app import db, bcrypt, jwt
from app.models import User
from app.exceptions import NotFoundError, UnauthorizedError, BadRequestError, ConflictError

def is_user_admin(user_id):
    user = User.query.filter_by(id=user_id).first()
    
    if not user or user is None:
        raise NotFoundError("No existe el usuario con este email")
    
    if user.role != 'admin':
        raise UnauthorizedError("Usuario no tiene permisos para acceder")
    
    return True


def create_user_service(**kwargs):
    
    required_fields = ['email', 'password', 'name', 'phone']
    missing_fields = [field for field in required_fields if kwargs.get(field) in [None, ""]]
    
    if missing_fields:
        raise BadRequestError(f"Faltan campos obligatorios: {", ".join(missing_fields)}")
    
    email = kwargs.get('email')
    password = kwargs.get('password')
    name = kwargs.get('name')
    phone = kwargs.get('phone')
    address = kwargs.get('address')
    role = kwargs.get('role')
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        raise ConflictError("Este email ya esta en uso, intenta con uno diferente")
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    new_user = User(name=name, email=email, password=password_hash, phone=phone, address=address, role=role)
    
    db.session.add(new_user)
    db.session.commit()
    
    return new_user.serialize()

def login_user_service(email, password):
    
    return 
    