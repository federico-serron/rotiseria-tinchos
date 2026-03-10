import os
from decimal import Decimal, InvalidOperation
import requests
from app.exceptions import BadRequestError
from app.services.invoice_service import calculate_items_total, add_invoice_menu_service


PAYPAL_API_BASE = os.getenv("PAYPAL_API_BASE", "https://api-m.sandbox.paypal.com")


def _get_paypal_credentials():
    client_id = os.getenv("PAYPAL_CLIENT_ID")
    client_secret = os.getenv("PAYPAL_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise BadRequestError("PayPal no está configurado correctamente")

    return client_id, client_secret


def _get_access_token():
    client_id, client_secret = _get_paypal_credentials()
    try:
        response = requests.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            data={"grant_type": "client_credentials"},
            auth=(client_id, client_secret),
            headers={"Accept": "application/json"},
            timeout=10,
        )
    except requests.RequestException as exc:
        raise BadRequestError("No pudimos conectarnos con PayPal") from exc

    if response.status_code != 200:
        raise BadRequestError("No pudimos iniciar el pago con PayPal")

    data = response.json()
    return data.get("access_token")


def create_paypal_order(items: list[dict], currency_code: str = "USD"):
    """
    Creates a PayPal order based on the validated items payload.
    """
    total = calculate_items_total(items)
    access_token = _get_access_token()

    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": currency_code,
                    "value": format(total, ".2f"),
                }
            }
        ],
    }

    try:
        response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders",
            json=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
            timeout=15,
        )
    except requests.RequestException as exc:
        raise BadRequestError("No pudimos crear la orden de PayPal") from exc

    if response.status_code not in (201, 200):
        raise BadRequestError("No pudimos crear la orden de pago")

    data = response.json()
    order_id = data.get("id")
    if not order_id:
        raise BadRequestError("PayPal no devolvió un identificador de orden")

    return order_id, total


def capture_paypal_order(user_id: int, order_id: str, items: list[dict]):
    """
    Captures an approved PayPal order and stores the invoice once the capture succeeds.
    """
    if not order_id:
        raise BadRequestError("Falta el ID de la orden de PayPal")

    total = calculate_items_total(items)
    access_token = _get_access_token()

    try:
        response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
            timeout=15,
        )
    except requests.RequestException as exc:
        raise BadRequestError("No pudimos confirmar el pago con PayPal") from exc

    if response.status_code not in (200, 201):
        raise BadRequestError("No pudimos confirmar el pago en PayPal")

    data = response.json()
    status = data.get("status")
    purchase_units = data.get("purchase_units", [])
    payment_capture_id = None
    captured_amount = None

    if purchase_units:
        payments = purchase_units[0].get("payments", {})
        captures = payments.get("captures", [])
        if captures:
            payment_capture_id = captures[0].get("id")
            captured_amount = captures[0].get("amount", {}).get("value")

    # Ensure the captured amount matches our server-side calculation
    if captured_amount:
        try:
            captured_decimal = Decimal(str(captured_amount))
        except InvalidOperation as exc:  # pragma: no cover - safeguard
            raise BadRequestError("Respuesta de pago inválida") from exc

        if captured_decimal != total:
            raise BadRequestError("El monto cobrado no coincide con el total esperado")

    invoice = add_invoice_menu_service(
        user_id=user_id,
        items=items,
        status="paid" if status == "COMPLETED" else "pending",
        payment_id=payment_capture_id or order_id,
        payment_provider="paypal",
        payment_status=status.lower() if status else None,
    )

    return {"status": status, "invoice": invoice, "order_id": order_id}
