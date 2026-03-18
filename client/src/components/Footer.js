import React from 'react';
import { Link } from 'react-router-dom';
 import './Footer.css'; 

// ⚠️ Opět přidat { text }
function Footer({ text = {} }) {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        
        {/* Levý sloupec s logem a popisem */}
        <div className="footer-brand">
          <h2>JuNoMi</h2>
          <p>{text.footer_desc}</p>
        </div>

        {/* Prostřední sloupec: Rychlé odkazy */}
        <div className="footer-links">
          <h4>{text.footer_links_title}</h4>
          <ul>
            <li><Link to="/">{text.footer_home}</Link></li>
            <li><a href="#about">{text.nav_about}</a></li>
            <li><Link to="/chat">{text.hero_btn_try}</Link></li>
          </ul>
        </div>

        {/* Pravý sloupec: Podpora */}
        <div className="footer-links"> 
          <h4>{text.footer_support_title}</h4>
          <ul>
            <li><Link to="/login">{text.footer_login}</Link></li>
            <li><Link to="/login" state={{ isRegister: true }}>{text.footer_register}</Link></li> 
            <li><Link to="/privacy">{text.footer_privacy}</Link></li>
          </ul>
        </div>

      </div>

      {/* Spodní linka s autorskými právy */}
      <div className="footer-bottom">
        <p>AI FighterS © 2026. {text.footer_rights}</p>
      </div>
    </footer>
  );
}

export default Footer;