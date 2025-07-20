import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="display-1 text-danger">404</h1>
      <h2 className="mb-3">¡Uy! Página no encontrada</h2>
      <p className="lead">La página que estás buscando no existe o fue movida.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
