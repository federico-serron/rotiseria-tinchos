import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Perfil' },
  { to: '/dashboard/pedidos', label: 'Pedidos' },
  { to: '/dashboard/productos', label: 'Productos' },
];

const Dashboard = () => {
  const {role, userId} = useAuth()
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
          className={`col-12 col-md-3 col-lg-2 d-md-block bg-white sidebar border-end p-0 ${
            isSidebarOpen ? 'd-block' : 'd-none d-md-block'
          }`}
        >
          <div className="d-flex flex-md-column flex-row flex-nowrap align-items-center align-items-md-start px-3 pt-3 text-dark min-vh-100">
            <span className="fs-4 fw-bold mb-4 d-none d-md-block">Usuario</span>
            <ul className="nav nav-pills flex-md-column flex-row mb-auto w-100 justify-content-center justify-content-md-start">
              {navItems.map((item) => (
                <li className="nav-item w-100" key={item.to}>
                  <Link
                    to={item.to}
                    className={`nav-link w-100 text-start ${location.pathname === item.to ? 'active' : ''}`}
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
              Hola 
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;