import React from 'react';
import { Link } from 'react-router-dom';
import burger404 from '../assets/images/burger-404.jpg'; 

const NotFound = () => {
  return (
    <div className="container text-center py-5">
      <img src={burger404} alt="404 Burger" className="img-fluid mb-4" style={{ maxWidth: '300px' }} />
      <h2 className="mb-3">¡Uy! Página no encontrada</h2>
      <p className="lead">La página que estás buscando no existe o fue movida.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
