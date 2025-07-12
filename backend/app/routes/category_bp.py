from flask import Blueprint, request, jsonify # Blueprint para modularizar y relacionar con app
from flask_jwt_extended import jwt_required, get_jwt_identity   # Jwt para tokens
from app.services.auth_service import is_user_admin
from app.services.category_service import get_categories_service, add_category_service
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError

category_bp = Blueprint('categories', __name__)     # instanciar admin_bp desde clase Blueprint para crear las rutas.


@category_bp.route('/', methods=['GET'])
def get_categories():
    try:
        categories_list = get_categories_service()
        return jsonify({'categories': categories_list}), 200

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 200

    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500
    

@category_bp.route('/', methods=['POST'])
@jwt_required()
def add_category():
    
    try:
        pass
        
    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500