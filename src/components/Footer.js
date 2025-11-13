// src/components/Footer.js
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 {new Date().getFullYear()} Tým RpRProject. Všechna práva vyhrazena.</p>
        <div className="footer-links">
          {/* Sem můžete dát odkazy na sociální sítě, pokud máte */}
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;