import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import { Context } from "../js/store/appContext";
import { useAuth } from "../hooks/useAuth";

const Cart = () => {
	const { store, actions } = useContext(Context);
	const { isAuthenticated, loading } = useAuth();
	const navigate = useNavigate();
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		actions.loadCartFromStorage();
	}, [actions]);

	const total = useMemo(() => actions.getCartTotal(), [store.cart]);
	const hasItems = store.cart && store.cart.length > 0;
	const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

	const handleQuantityChange = (menuId, delta) => {
		const item = store.cart.find((cartItem) => cartItem.id === menuId);
		if (!item) return;
		actions.updateCartQuantity(menuId, item.quantity + delta);
	};

	const handleRemove = (menuId) => {
		actions.removeFromCart(menuId);
	};

	const handleCreateInvoice = async () => {
		if (!hasItems) {
			toast.error("Tu carrito está vacío");
			return;
		}

		if (!isAuthenticated) {
			toast.error("Inicia sesión para finalizar tu pedido");
			navigate("/login");
			return;
		}

		setProcessing(true);
		const invoice = await actions.createInvoice();
		setProcessing(false);
		if (invoice) {
			toast.success("Pedido registrado");
			actions.clearCart();
		} else if (store.error) {
			toast.error(store.error);
		}
	};

	const handlePaypalApprove = async (orderId) => {
		const capture = await actions.capturePaypalOrder(orderId);
		setProcessing(false);
		if (capture) {
			toast.success("Pago confirmado");
		} else if (store.error) {
			toast.error(store.error);
		}
	};

	const renderPayPalButtons = () => {
		if (!paypalClientId) {
			return <p className="text-muted">Configura tu clave de PayPal para habilitar el pago.</p>;
		}

		return (
			<PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD" }}>
				<PayPalButtons
					style={{ layout: "vertical" }}
					disabled={!hasItems || processing || !isAuthenticated}
					forceReRender={[total]}
					createOrder={async () => {
						setProcessing(true);
						const order = await actions.createPaypalOrder();
						if (!order) {
							setProcessing(false);
							throw new Error("No pudimos iniciar el pago");
						}
						return order.order_id;
					}}
					onApprove={async (data) => {
						await handlePaypalApprove(data.orderID);
					}}
					onError={(err) => {
						console.error(err);
						setProcessing(false);
						toast.error("No pudimos procesar el pago");
					}}
				/>
			</PayPalScriptProvider>
		);
	};

	return (
		<section className="cart_section layout_padding">
			<div className="container">
				<div className="heading_container heading_center mb-4">
					<h2>Tu pedido</h2>
					<p className="text-muted">Revisa los productos antes de pagar.</p>
				</div>

				{!hasItems && (
					<div className="text-center">
						<p className="mb-3">Aún no agregaste productos.</p>
						<Link className="btn btn-primary" to="/menu">
							Ver menú
						</Link>
					</div>
				)}

				{hasItems && (
					<div className="row">
						<div className="col-lg-8">
							<div className="list-group shadow-sm">
								{store.cart.map((item) => (
									<div key={item.id} className="list-group-item d-flex align-items-center justify-content-between">
										<div className="d-flex align-items-center gap-3">
											<img
												src={item.path ? `${import.meta.env.VITE_BACKEND_URL}/${item.path}` : "https://cdn.pixabay.com/photo/2014/12/21/23/36/burgers-575655_1280.png"}
												alt={item.name}
												className="rounded"
												style={{ width: "70px", height: "70px", objectFit: "cover" }}
											/>
											<div>
												<h6 className="mb-1">{item.name}</h6>
												<p className="mb-1 text-muted">${item.price}</p>
												<div className="d-flex align-items-center gap-2">
													<button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item.id, -1)} aria-label="Disminuir cantidad">
														-
													</button>
													<span>{item.quantity}</span>
													<button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item.id, 1)} aria-label="Aumentar cantidad">
														+
													</button>
												</div>
											</div>
										</div>
										<div className="text-end">
											<p className="mb-1 fw-bold">${(item.price * item.quantity).toFixed(2)}</p>
											<button className="btn btn-link text-danger p-0" onClick={() => handleRemove(item.id)}>
												Quitar
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="col-lg-4 mt-4 mt-lg-0">
							<div className="card shadow-sm">
								<div className="card-body">
									<h5 className="card-title">Resumen</h5>
									<div className="d-flex justify-content-between mb-2">
										<span>Subtotal</span>
										<strong>${total.toFixed(2)}</strong>
									</div>
									<div className="mb-3 text-muted small">Los precios se confirman en el backend antes de cobrar.</div>

									<button
										className="btn btn-outline-secondary w-100 mb-2"
										onClick={handleCreateInvoice}
										disabled={processing || !isAuthenticated}
									>
										{processing ? "Procesando..." : "Confirmar pedido sin pago"}
									</button>

									{!isAuthenticated && !loading && (
										<p className="text-danger small mb-3">Inicia sesión para completar tu pago.</p>
									)}

									{renderPayPalButtons()}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default Cart;
