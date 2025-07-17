import React, { useState } from "react";
import { FaUser, FaSearch, FaShoppingCart  } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/images/logoSvg.png"; 

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
<header className="header_section" style={{ backgroundColor: "#111", padding: "1px 0", position: "sticky", top: 0, zIndex: 1030 }}>
  <div className="container-fluid">
    <nav className="navbar navbar-expand-lg custom_nav-container">
      <Link className="navbar-brand" to={"/"}>
        <img src={logo} alt="Logo" className="img-fluid logo-navbar" />
        <span>Rotiseria Tincho's</span>
      </Link>

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

      <div className="collapse navbar-collapse py-2" id="navbarSupportedContent">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/menu">Menú</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">¿Quiénes somos?</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">Contáctanos</Link>
          </li>
        </ul>
        <div className="user_option ">
        <Link to="/login" className="user_link">
            <FaUser/>
          </Link>
        <Link className="cart_link" to="#">
            <FaShoppingCart />
          </Link>
          <form className="form-inline" onSubmit={e => e.preventDefault()}>
            <button className="btn" type="submit" style={{ color: "white" }}>
              <FaSearch />
            </button>
          </form>
          <Link to="/" className="order_online" style={{ color: "white" }}>Ordenar Online</Link>
        </div>
      </div>
    </nav>
  </div>
</header>

  );
};

export default Navbar;
