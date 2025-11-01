import React, { useContext, useMemo, useState } from 'react';
import { Context } from '../../js/store/appContext';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { store, actions } = useContext(Context);

  // Support multiple possible cart keys used in projects
  const cart = store.cart || store.cartItems || store.basket || [];

  // local quantities map to allow editing before dispatching
  const [localQty, setLocalQty] = useState(() => {
    const map = {};
    (cart || []).forEach((it) => {
      map[it.id] = it.quantity ?? it.qty ?? 1;
    });
    return map;
  });

  const handleQtyChange = (id, value) => {
    const qty = Math.max(1, Number(value) || 1);
    setLocalQty((s) => ({ ...s, [id]: qty }));
  };

  const handleUpdate = async (id) => {
    const qty = localQty[id] ?? 1;
    // try known actions if present
    if (actions.updateCartItem) {
      await actions.updateCartItem(id, qty);
    } else if (actions.updateCart) {
      await actions.updateCart(id, qty);
    } else if (actions.addToCart) {
      // fallback: re-add with qty (may increment instead of replace)
      await actions.addToCart(id, qty);
    }
    // refresh local store-cart if an action exists
    if (actions.getCart) await actions.getCart();
  };

  const handleRemove = async (id) => {
    if (actions.removeFromCart) {
      await actions.removeFromCart(id);
    } else if (actions.removeCartItem) {
      await actions.removeCartItem(id);
    }
    if (actions.getCart) await actions.getCart();
  };

  const subtotal = useMemo(() => {
    return (cart || []).reduce((acc, it) => {
      const qty = localQty[it.id] ?? it.quantity ?? it.qty ?? 1;
      const price = Number(it.price ?? it.unit_price ?? 0) || 0;
      return acc + price * qty;
    }, 0);
  }, [cart, localQty]);

  const shipping = subtotal > 0 ? 0 : 0; // placeholder, customize if needed
  const total = subtotal + shipping;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Resumen del pedido</h1>

      <div className="row">
        <div className="col-lg-8">
          {(!cart || cart.length === 0) && (
            <div className="alert alert-info">Tu carrito está vacío. <Link to="/menu">Ver productos</Link></div>
          )}

          {(cart || []).map((item) => (
            <div className="card mb-3" key={item.id}>
              <div className="row g-0 align-items-center">
                <div className="col-4 col-md-3">
                  <img
                    src={item.image || item.img || '/placeholder.png'}
                    alt={item.name}
                    className="img-fluid rounded-start"
                    style={{ objectFit: 'cover', height: 110, width: '100%' }}
                  />
                </div>
                <div className="col-8 col-md-9">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                    <div>
                      <h5 className="card-title mb-1">{item.name}</h5>
                      <p className="mb-1 text-muted small">{item.description}</p>
                      <p className="mb-0"><strong>${item.price ?? item.unit_price ?? 0}</strong></p>
                    </div>

                    <div className="d-flex gap-2 align-items-center mt-3 mt-md-0">
                      <div className="input-group input-group-sm" style={{ width: 120 }}>
                        <span className="input-group-text">Cant</span>
                        <input
                          type="number"
                          className="form-control"
                          value={localQty[item.id] ?? item.quantity ?? item.qty ?? 1}
                          min={1}
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        />
                        <button className="btn btn-outline-primary" type="button" onClick={() => handleUpdate(item.id)}>Actualizar</button>
                      </div>

                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(item.id)}>Quitar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="col-lg-4">
          <div className="card sticky-top" style={{ top: '1rem' }}>
            <div className="card-body">
              <h5 className="card-title">Resumen</h5>
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Subtotal
                  <span>${subtotal.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Envío
                  <span>${shipping.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
                  Total
                  <span>${total.toFixed(2)}</span>
                </li>
              </ul>

              <button className="btn btn-primary w-100 mb-2">Ir a pagar</button>
              <Link to="/menu" className="btn btn-outline-secondary w-100">Seguir comprando</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
