import React, { useState } from "react";
import { FaUser, FaSearch, FaShoppingCart  } from "react-icons/fa";
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
      <Link className="navbar-brand" to={"/"}>
        <span>Feane</span>
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

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/menu">Menu</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">Quienes somos?</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">Contactanos</Link>
          </li>
        </ul>
        <div className="user_option d-flex align-items-center gap-3">
          <Link to="/" className="user_link" style={{ color: "white" }}>
            <FaUser/>
          </Link>
          <Link className="cart_link" to="#" style={{ color: "white" }}>
            <FaShoppingCart />
          </Link>
          <form className="form-inline" onSubmit={e => e.preventDefault()}>
            <button className="btn my-2 my-sm-0 nav_search-btn" type="submit" style={{ color: "white" }}>
              <FaSearch />
            </button>
          </form>
          <Link to="/" className="order_online" style={{ color: "white" }}>Order Online</Link>
        </div>
      </div>
    </nav>
  </div>
</header>

  );
};

export default Navbar;
