from flask import Blueprint, request, jsonify # Blueprint para modularizar y relacionar con app
from flask_jwt_extended import jwt_required, get_jwt_identity   # Jwt para tokens
from app.services.auth_service import is_user_admin
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError

invoice_bp = Blueprint('invoices', __name__)


@invoice_bp.route('/', methods=['GET'])
def get_categories():
    try:
        return jsonify({'msg': "Hola invoices"}), 200

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 404

    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500
    

