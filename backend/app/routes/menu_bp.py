from flask import Blueprint, request, jsonify # Blueprint para modularizar y relacionar con app
from flask_jwt_extended import jwt_required, get_jwt_identity   # Jwt para tokens
from app.services.auth_service import is_user_admin
from app.services.menu_service import get_menu_service, add_menu_item_service, edit_menu_item_service, delete_menu_item_serivce
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError

menu_bp = Blueprint('menu', __name__)     # instanciar admin_bp desde clase Blueprint para crear las rutas.

@menu_bp.route('/', methods=['GET'])
def get_menu():
    try:
        menu_list = get_menu_service()
        return jsonify({'menu': menu_list}), 200

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 404

    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500


@menu_bp.route('/', methods=['POST'])
@jwt_required()
def add_menu_item():
    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    category_id = request.form.get('category_id')
    image = request.files.get("image", None)
    
    user_id = get_jwt_identity()
    
    
    if name is None or description is None or price is None or category_id is None:
        return jsonify({"error": "Faltan campos obligtorio"}), 400
    
    try:
        user_admin = is_user_admin(user_id)
        
        price = int(price)
        new_menu_item = add_menu_item_service(name, description, price, category_id, image)
        return jsonify({'msg': 'Menu creado satisfactoriamente','menu_item':new_menu_item}), 201
    
    except (TypeError):
        return jsonify({"error": str(e)}), 400

    except UnauthorizedError as e:
        return jsonify({'error':str(e)}), 401
       
    except ConflictError as e:
        return jsonify({'error':str(e)}), 400        
    
    except ValueError as e:
        return jsonify({'error':str(e)}), 400  
    
    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500
      
      

@menu_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def edit_menu_item(id):
    data = request.get_json()
    user_id = get_jwt_identity()
    
    try:
        user_admin = is_user_admin(user_id)
        
        if not data:
            raise ValueError("Faltan datos")

        updated_item = edit_menu_item_service(id,**data)
        return jsonify({'msg': 'Menu actualizado correctamente','menu_item':updated_item}), 200

    except ValueError as e:
        return jsonify({'error':str(e)}), 400
    
    except UnauthorizedError as e:
        return jsonify({'error':str(e)}), 401
       
    except NotFoundError as e:
        return jsonify({'error':str(e)}), 404
    
    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500
    
    
@menu_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_menu_item(id):
    user_id = get_jwt_identity()
    
    try:
        user_admin = is_user_admin(user_id)
        
        deleted_menu_item = delete_menu_item_serivce(id)
        if deleted_menu_item:
            return jsonify({'msg': 'Menu eliminado correctamente'}), 200
    
    except ValueError as e:
        return jsonify({'error':str(e)}), 400
    
    except UnauthorizedError as e:
        return jsonify({'error':str(e)}), 401
       
    except NotFoundError as e:
        return jsonify({'error':str(e)}), 404
    
    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500
      