import React, { useState, useContext } from "react";
import { FaUser, FaSearch, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logoSvg.png";
import { useAuth } from "../hooks/useAuth";
import { Context } from '../js/store/appContext';


const Navbar = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { store, actions } = useContext(Context);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const linksNavbar = [
    { name: "Inicio", path: "/", alt: "Inicio" },
    { name: "Menú", path: "/menu", alt: "Menú" },
    { name: "¿Quiénes somos?", path: "/about", alt: "Quiénes somos?" },
    { name: "Contáctanos", path: "/contact", alt: "Contáctanos" },
  ]

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    if (isAuthenticated) {
      const resp = await actions.logout()

      if (resp) {
        navigate('/')
        return
      } else {
        console.log("No pudimos deslogeuarte")
        return
      }
    }
  }

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
              {linksNavbar.map((link, idx) => (
                <li key={idx} className={`nav-item ${location.pathname === link.path ? 'active' : ''}`} alt={link.alt}>
                  <Link className="nav-link" to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
            <div className="user_option ">
              {isAuthenticated &&
                <Link onClick={handleLogout} className="user_link text-danger">
                  <FaSignOutAlt />
                </Link>}
              <Link to="/login" className="user_link">
                <FaUser />
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
