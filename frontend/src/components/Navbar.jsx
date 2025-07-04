import React, { useState } from "react";
import { FaUser, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom"; // Si usás React Router

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
<header className="header_section" style={{ backgroundColor: "#111", padding: "1px 0", position: "sticky", top: 0, zIndex: 1030 }}>
  <div className="container">
    <nav className="navbar navbar-expand-lg custom_nav-container">
      <a className="navbar-brand" href="/">
        <span>Feane</span>
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        style={{ borderColor: "rgba(255,255,255,0.5)" }}
      >
        <i className="fa fa-bars" style={{ color: "white" }}></i>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item active">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/menu">Menu</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/book">Book Table</a>
          </li>
        </ul>
        <div className="user_option d-flex align-items-center gap-3">
          <a href="/" className="user_link" style={{ color: "white" }}>
            <i className="fa fa-user" aria-hidden="true"></i>
          </a>
          <a className="cart_link" href="#" style={{ color: "white" }}>
            {/* Poné acá tu SVG carrito o algún ícono */}
          </a>
          <form className="form-inline" onSubmit={e => e.preventDefault()}>
            <button className="btn my-2 my-sm-0 nav_search-btn" type="submit" style={{ color: "white" }}>
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </form>
          <a href="/" className="order_online" style={{ color: "white" }}>Order Online</a>
        </div>
      </div>
    </nav>
  </div>
</header>

  );
};

export default Navbar;
