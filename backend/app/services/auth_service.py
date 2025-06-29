from app import db, bcrypt, jwt
from app.models import User

def create_user_service(email, password, name, phone, address=None, role="user"):
    
    if not email or not password or not name or not phone:
        raise ValueError("Email, password, name and phone are required.")
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        raise ValueError("Email already exists.")
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    new_user = User(name=name, email=email, password=password_hash, phone=phone, address=address, role=role)
    
    db.session.add(new_user)
    db.session.commit()
    
    return new_user.serialize()

def login_user_service(email, password):
    
    return 
    