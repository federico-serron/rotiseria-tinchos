import React from "react";
import {
  FaMapMarker,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer_section">
      <div className="container">
        <div className="row">
          {/* Contact */}
          <div className="col-md-4 footer-col">
            <div className="footer_contact">
              <h4>Contacto</h4>
              <div className="contact_link_box">
                <a href="#">
                  <FaMapMarker aria-hidden="true" />
                  <span className="px-1">Ubicacion</span>
                </a>
                <a href="tel:+011234567890">
                  <FaPhone aria-hidden="true" />
                  <span className="px-1">Llama a +598 1234567890</span>
                </a>
                <a href="mailto:demo@gmail.com">
                  <FaEnvelope aria-hidden="true" />
                  <span className="px-1">tinchos@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Logo & Social */}
          <div className="col-md-4 footer-col">
            <div className="footer_detail">
              <a href="#" className="footer-logo">
                Rotiseria Tincho's
              </a>
              <div className="footer_social">
                <a href="#"><FaFacebook /></a>
                <a href="#"><FaInstagram /></a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="col-md-4 footer-col">
            <h4>Horarios</h4>
            <p>Lunes a Viernes</p>
            <p>10.00 - 14.00 </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="footer-info">
          <p>
            &copy; {year} Made By{" "}
            <a href="https://www.fserron.com/" target="_blank" rel="noreferrer">
              Federico Serron
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
