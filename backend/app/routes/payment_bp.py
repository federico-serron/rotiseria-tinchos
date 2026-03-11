from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.exceptions import BadRequestError, NotFoundError
from app.services.payment_service import create_paypal_order, capture_paypal_order
from app.services.invoice_service import calculate_items_total


payment_bp = Blueprint("api/payments", __name__)


@payment_bp.route("/paypal/create-order", methods=["POST"])
@jwt_required(locations=["cookies"])
def paypal_create_order():
    payload = request.get_json() or {}
    items = payload.get("items")
    try:
        order_id, total = create_paypal_order(items)
        return jsonify({"order_id": order_id, "total": float(total)}), 201
    except (BadRequestError, NotFoundError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception:
        return jsonify({"error": "Hubo un error al preparar el pago"}), 500


@payment_bp.route("/paypal/capture", methods=["POST"])
@jwt_required(locations=["cookies"])
def paypal_capture():
    payload = request.get_json() or {}
    items = payload.get("items")
    order_id = payload.get("order_id")
    user_id = get_jwt_identity()

    try:
        capture_result = capture_paypal_order(user_id, order_id, items)
        return jsonify(capture_result), 200
    except (BadRequestError, NotFoundError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception:
        return jsonify({"error": "No pudimos confirmar el pago"}), 500


@payment_bp.route("/cart/total", methods=["POST"])
@jwt_required(locations=["cookies"])
def cart_total():
    payload = request.get_json() or {}
    items = payload.get("items")
    try:
        total = calculate_items_total(items)
        return jsonify({"total": float(total)}), 200
    except (BadRequestError, NotFoundError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception:
        return jsonify({"error": "No pudimos calcular el total"}), 500
