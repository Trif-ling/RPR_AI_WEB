// src/components/Footer.js
import React from 'react';
import './Footer.css';

function Footer({ text }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 {new Date().getFullYear()} Tým RpRProject. {text.footer_rights}</p>
        <div className="footer-links">
          <a href="#">{text.footer_privacy}</a>
          <a href="#">{text.footer_terms}</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;