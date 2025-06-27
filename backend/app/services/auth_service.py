from app.models import User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def create_user_service(email, password, name, phone, address=None):
    
    if not email or not password or not name or not phone:
        raise ValueError("Email, password, name and phone are required.")
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        raise ValueError("Email already exists.")
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    new_user = User(name=name, email=email, password=password_hash, phone=phone, address=address)
    