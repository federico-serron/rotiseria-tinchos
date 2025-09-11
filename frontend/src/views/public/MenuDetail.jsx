import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Context } from '../../js/store/appContext';
import toast from 'react-hot-toast';

const MenuDetail = () => {
  const { id } = useParams();
  const { store, actions } = useContext(Context);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      // try to find in store first
      const local = store.menu && store.menu.find((m) => String(m.id) === String(id));
      if (local) {
        setItem(local);
        setLoading(false);
        return;
      }

      try {
        // If you have an endpoint to fetch single menu item, use it; otherwise fetch all
        if (actions.getMenuItem) {
          const resp = await actions.getMenuItem(id);
          if (resp) {
            setItem(resp);
          } else {
            toast.error(store.error || 'No se encontró el ítem');
          }
        } else {
          const ok = await actions.getMenuItems();
          if (ok) {
            const found = store.menu.find((m) => String(m.id) === String(id));
            if (found) setItem(found);
            else toast.error('Ítem no encontrado');
          } else {
            toast.error(store.error || 'Error cargando ítems');
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Error cargando ítem');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!item) return (
    <div className="container py-5">
      <div className="alert alert-warning">Ítem no encontrado.</div>
      <Link to="/menu" className="btn btn-primary">Volver al Menú</Link>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-5">
          <img
            src={item.image || '/placeholder.png'}
            alt={item.name}
            className="img-fluid rounded"
            style={{ maxHeight: 400, objectFit: 'cover', width: '100%' }}
          />
        </div>
        <div className="col-md-7">
          <h2>{item.name}</h2>
          <h4 className="text-muted">{item.category || 'Sin categoría'}</h4>
          <p className="lead">{item.description}</p>

          <div className="mb-3">
            <strong>Precio: </strong>
            <span className="ms-2">${item.price}</span>
          </div>

          <div className="mb-3">
            <strong>Disponible: </strong>
            <span className="ms-2">{item.available || item.is_available ? 'Sí' : 'No'}</span>
          </div>

          <div className="d-flex gap-2">
            <Link to="/menu" className="btn btn-outline-secondary">Volver</Link>
            <button className="btn btn-primary">Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetail;
