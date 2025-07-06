from flask import Blueprint, request, jsonify # Blueprint para modularizar y relacionar con app
from flask_bcrypt import Bcrypt                                  # Bcrypt para encriptación
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity   # Jwt para tokens
from app.models import User                                          # importar tabla "User" de models
from app import db, bcrypt, jwt
from datetime import timedelta                                   # importa tiempo especifico para rendimiento de token válido
from app.services.auth_service import create_user_service

menu_bp = Blueprint('menu', __name__)     # instanciar admin_bp desde clase Blueprint para crear las rutas.

@menu_bp.route('/', methods=['GET'])
def show_hello_world():
     return jsonify({"msg":"Soy el menu"}),200