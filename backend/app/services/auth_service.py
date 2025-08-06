from app import db, bcrypt
from app.models import User
from app.exceptions import NotFoundError, UnauthorizedError, BadRequestError, ConflictError
from datetime import timedelta
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity



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
        raise BadRequestError(f"Faltan campos obligatorios: {', '.join(missing_fields)}")
    
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
    
    if not email or not password:
        raise BadRequestError("Email y Contrasena son obligatorios")
    
    user = User.query.filter_by(email=email).first()
    if not user:
        raise NotFoundError(f"No se encontro un usuario con el email {email}")

    password_from_db = user.password
    true_o_false = bcrypt.check_password_hash(password_from_db, password)
        
    if true_o_false:
        expires = timedelta(minutes=120)

        user_id = user.id
        role = user.role
        access_token = create_access_token(identity=str(user_id), expires_delta=expires, additional_claims={"role": role})
        
        return access_token
    else:
        raise ConflictError("Usuario y/o contrasena incorrectos")
    
def edit_user_service(user_id, **kwargs):
    
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise NotFoundError("No se encontro el usuario")
    
    editable_fields = ['name', 'password', 'phone', 'address']
    for key, value in kwargs.items():
        if key == 'password':
            password_hash = bcrypt.generate_password_hash(value).decode('utf-8')
            setattr(user, key, password_hash)
        elif key in editable_fields and value:
            setattr(user, key, value)
        else:
            raise BadRequestError(f"No puedes editar el campo {key}")
        
    db.session.commit()
    
    return user.serialize()