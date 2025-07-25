from flask import Blueprint, request, jsonify # Blueprint para modularizar y relacionar con app
from flask_jwt_extended import jwt_required, get_jwt_identity   # Jwt para tokens
from app.services.auth_service import is_user_admin
from app.services.category_service import get_categories_service, add_category_service, edit_category_service, delete_category_service
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError

category_bp = Blueprint('categories', __name__)     # instanciar admin_bp desde clase Blueprint para crear las rutas.


@category_bp.route('/', methods=['GET'])
def get_categories():
    try:
        categories_list = get_categories_service()
        return jsonify({'categories': categories_list}), 200

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 404

    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500
    

@category_bp.route('/', methods=['POST'])
@jwt_required()
def add_category():
    
    data = request.get_json()
    user_id = get_jwt_identity() 
    
    try:
        user_admin = is_user_admin(user_id)
        
        if not data.get('name')  or not data.get('note'):
            raise BadRequestError("Nombre y Nota son necesarios")
        
        new_category = add_category_service(**data)
        return jsonify({'msg': 'Categoria creada correctamente','category':new_category}), 201
    
    except ConflictError as e:
        return jsonify({'error': str(e)}), 400
    
    except BadRequestError as e:
        return jsonify({'error': str(e)}), 400
        
    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500
    
    
@category_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def edit_category(id):
    
    data = request.get_json()
    user_id = get_jwt_identity() 
    
    try:
        user_admin = is_user_admin(user_id)
        
        if not data:
            raise BadRequestError("Faltan datos para editar")
        
        edited_category = edit_category_service(id, **data)
        return jsonify({'msg': 'Categoria actualizada correctamente','category':edited_category}), 200

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 400
    
    except BadRequestError as e:
        return jsonify({'error': str(e)}), 400
        
    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500
    
    
@category_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    
    user_id = get_jwt_identity() 
    
    try:
        user_admin = is_user_admin(user_id)
        
        deleted_category = delete_category_service(id)
        if deleted_category:
            return jsonify({'msg': 'Categoria eliminada correctamente'}), 200

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 400
    
    except BadRequestError as e:
        return jsonify({'error': str(e)}), 400
        
    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500