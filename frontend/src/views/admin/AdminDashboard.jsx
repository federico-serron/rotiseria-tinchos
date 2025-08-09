import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const navItems = [
    { to: '/admin', label: 'Inicio' },
    { to: '/admin/users', label: 'Usuarios' },
    { to: '/admin/pedidos', label: 'Pedidos' },
    { to: '/admin/menu', label: 'Productos' },
    { to: '/admin/categorias', label: 'Categorias' },
  ];


  const { role, userId } = useAuth()
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <nav
          className={`col-12 col-md-3 col-lg-2 d-md-block bg-white sidebar border-end p-0 ${isSidebarOpen ? 'd-block' : 'd-none d-md-block'
            }`}
        >
          <div className="d-flex flex-md-column flex-row flex-nowrap align-items-center align-items-md-start px-3 pt-3 text-dark min-vh-100">
            <span className="fs-4 fw-bold mb-4 d-none d-md-block">Panel Admin</span>
            <ul className="nav nav-pills flex-md-column flex-row mb-auto w-100 justify-content-center justify-content-md-start">
              {navItems.map((item) => (
                <li className="nav-item w-100" key={item.to}>
                  <Link
                    to={item.to}
                    className={`nav-link w-100 text-start ${location.pathname === item.to ? 'active' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col px-0 py-4">
          <div className="container">
            {/* Hamburger Button */}
            <button
              className="btn btn-primary d-md-none mb-3"
              onClick={toggleSidebar}
            >
              ☰ Menu
            </button>

            {/* Dashboard Content */}
            <div className="row">
              <div className="col-md-4">
                <div className="card text-white bg-primary mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Usuarios</h5>
                    <p className="card-text">120 registrados</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-white bg-success mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Pedidos</h5>
                    <p className="card-text">45 completados</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-white bg-warning mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Productos</h5>
                    <p className="card-text">230 disponibles</p>
                  </div>
                </div>
              </div>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;