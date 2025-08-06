from flask import Blueprint, request, jsonify # Blueprint para modularizar y relacionar con app
from flask_jwt_extended import jwt_required, get_jwt_identity   # Jwt para tokens
from app.services.auth_service import is_user_admin
from app.exceptions import NotFoundError, UnauthorizedError, ConflictError, BadRequestError
from app.services.invoice_service import add_invoice_menu_service, get_user_invoices

invoice_bp = Blueprint('api/invoices', __name__)


@invoice_bp.route('/', methods=['GET'])
@jwt_required()
def get_invoices():
    user_id = get_jwt_identity()
    try:
        user_invoices = get_user_invoices(user_id)
        return jsonify({'invoices': user_invoices, 'qty': str(len(user_invoices))}), 200

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 404

    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500
    


@invoice_bp.route('/', methods=['POST'])
@jwt_required()
def add_invoice_menu():
    
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        invoice_menu = add_invoice_menu_service(user_id, data)
        return jsonify({'invoice': invoice_menu}), 201

    except NotFoundError as e:
        return jsonify({'error': str(e)}), 404

    except Exception as e:
        return jsonify({'error':'Hubo un error en el servidor, contacta al Admin por favor'}), 500