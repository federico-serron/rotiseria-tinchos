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
              <h4>Contact Us</h4>
              <div className="contact_link_box">
                <a href="#">
                  <FaMapMarker aria-hidden="true" />
                  <span>Location</span>
                </a>
                <a href="tel:+011234567890">
                  <FaPhone aria-hidden="true" />
                  <span>Call +01 1234567890</span>
                </a>
                <a href="mailto:demo@gmail.com">
                  <FaEnvelope aria-hidden="true" />
                  <span>demo@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Logo & Social */}
          <div className="col-md-4 footer-col">
            <div className="footer_detail">
              <a href="#" className="footer-logo">
                Feane
              </a>
              <p>
                Necessary, making this the first true generator on the Internet.
                It uses a dictionary of over 200 Latin words, combined with
              </p>
              <div className="footer_social">
                <a href="#"><FaFacebook /></a>
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaLinkedin /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaPinterest /></a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="col-md-4 footer-col">
            <h4>Opening Hours</h4>
            <p>Everyday</p>
            <p>10.00 Am - 10.00 Pm</p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="footer-info">
          <p>
            &copy; {year} All Rights Reserved By{" "}
            <a href="https://html.design/">Free Html Templates</a>
            <br />
            <br />
            &copy; {year} Distributed By{" "}
            <a href="https://themewagon.com/" target="_blank" rel="noreferrer">
              ThemeWagon
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
