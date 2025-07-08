from flask import Blueprint, request, jsonify # Blueprint para modularizar y relacionar con app
from flask_bcrypt import Bcrypt                                  # Bcrypt para encriptación
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity   # Jwt para tokens
from app.models import User                                          # importar tabla "User" de models
from app import db, bcrypt, jwt
from datetime import timedelta                                   # importa tiempo especifico para rendimiento de token válido
from app.services.menu_service import get_menu_service, add_menu_item_service
from app.services.auth_service import is_user_admin
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError

menu_bp = Blueprint('menu', __name__)     # instanciar admin_bp desde clase Blueprint para crear las rutas.

@menu_bp.route('/', methods=['GET'])
def get_menu():
    try:
        menu_list = get_menu_service()
        return jsonify({'menu': menu_list}), 200

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 200

    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500


@menu_bp.route('/', methods=['POST'])
@jwt_required()
def add_menu_item():
    name = request.json.get('name')
    description = request.json.get('description')
    price = request.json.get('price')
    category_id = request.json.get('category_id')
    user_id = get_jwt_identity()
    
    
    if name is None or description is None or price is None or category_id is None:
        return jsonify({"error": "Faltan campos obligtorio"}), 400
    
    try:
        user_admin = is_user_admin(user_id)
        
        new_menu_item = add_menu_item_service(name, description, price, category_id)
        return jsonify({'msg': 'Menu creado satisfactoriamente','menu_item':new_menu_item}), 201
    
    except UnauthorizedError as e:
        return jsonify({'error':str(e)}), 401
       
    except ConflictError as e:
        return jsonify({'error':str(e)}), 400        
    
    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500
      