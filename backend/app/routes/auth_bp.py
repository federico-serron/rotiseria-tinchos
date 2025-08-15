from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt, unset_jwt_cookies, set_access_cookies
from app.models import User
from app import bcrypt
from app.services.auth_service import create_user_service, login_user_service, edit_user_service
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError
from app.blacklist import BLACKLIST

auth_bp = Blueprint('api/auth', __name__)


@auth_bp.route('/me', methods=['GET'])
@jwt_required(locations=["cookies"])
def me():
    user_id = get_jwt_identity()
    claims = get_jwt()
    
    return jsonify({
        "authenticated": True,
        "user_id": user_id,
        "role": claims.get("role")
    }), 200
    
    
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        
        login_successfull_token = login_user_service(email, password)
        resp = jsonify({"msg": "Has iniciado sesion exitosamente!", "access_token": login_successfull_token})
        
        is_production = current_app.config["ENV"] == "production"

        set_access_cookies(resp, login_successfull_token)
        
        return resp, 200

    except BadRequestError as e:
        return jsonify({'error': str(e)}), 400

    except ConflictError as e:
        return jsonify({'error': str(e)}), 400

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 404

    except Exception as e:
        return {"error":"Error al intentar iniciar sesion: " + str(e)}, 500
    
@auth_bp.post("/logout")
def logout():
    resp = jsonify({"msg": "Sesión cerrada"})
    unset_jwt_cookies(resp)
    return resp, 200