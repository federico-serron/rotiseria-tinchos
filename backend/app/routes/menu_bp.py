from flask import Blueprint, request, jsonify # Blueprint para modularizar y relacionar con app
from flask_bcrypt import Bcrypt                                  # Bcrypt para encriptación
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity   # Jwt para tokens
from app.models import User                                          # importar tabla "User" de models
from app import db, bcrypt, jwt
from datetime import timedelta                                   # importa tiempo especifico para rendimiento de token válido
from app.services.menu_service import get_menu_service
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


@menu_bp.route('/demo')
def demo():
    return jsonify({'msg':'Este es un mensaje que viene desde el backend, especificamente la Demo Page... :)'}), 200

@menu_bp.route('/about')
def about():
    return jsonify({'msg':'About Page'})