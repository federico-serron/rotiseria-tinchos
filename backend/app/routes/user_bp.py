from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import User
from app import bcrypt
from app.services.auth_service import create_user_service, login_user_service
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError

user_bp = Blueprint('user', __name__)

# RUTA CREAR USUARIO
@user_bp.route('/signup', methods=['POST'])
def create_user():
    email = request.json.get('email')
    password = request.json.get('password')
    name = request.json.get('name')
    phone = request.json.get('phone')
    address = request.json.get('address')
    try:
    
        #new_user = create_user_service(email, password, name, phone, address)
        data = request.get_json()
        new_user = create_user_service(**data)
        return jsonify({'msg': 'User created successfully.','user':new_user}), 201
    
    except ConflictError as e:
        return jsonify({'error': str(e)}), 400
    
    except BadRequestError as e:
        return jsonify({'error': str(e)}), 400
    
    except Exception as e:
        return jsonify({'error': 'Error in user creation: ' + str(e)}), 500


#RUTA LOG-IN ( CON TOKEN DE RESPUESTA )
@user_bp.route('/login', methods=['POST'])
def get_token():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        
        login_successfull_token = login_user_service(email, password)
        return jsonify({"access_token": login_successfull_token}), 200

    except BadRequestError as e:
        return jsonify({'error': str(e)}), 400

    except ConflictError as e:
        return jsonify({'error': str(e)}), 400

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 404

    except Exception as e:
        return {"Error":"El email proporcionado no corresponde a ninguno registrado: " + str(e)}, 500
    

    
@user_bp.route('/users')
@jwt_required()  # Decorador para requerir autenticación con JWT
def show_users():
    current_user_id = get_jwt_identity()  # Obtiene la id del usuario del token
    if current_user_id:
        users = User.query.all()
        user_list = []
        for user in users:
            user_dict = {
                'id': user.id,
                'email': user.email
            }
            user_list.append(user_dict)
        return jsonify(user_list), 200
    else:
        return {"Error": "Token inválido o no proporcionado"}, 401