import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        {/* Levý sloupec: Značka a popis */}
        <div className="footer-brand">
          <h2>JuNoMi</h2>
          <p>
            Váš osobní asistent s umělou inteligencí, připravený proměnit nápady v realitu. 
            Vytvořeno s vášní studenty pro budoucnost.
          </p>
        </div>
        
        {/* Prostřední sloupec: Rychlé odkazy */}
        <div className="footer-links">
          <h4>Rychlé odkazy</h4>
          <ul>
            <li><Link to="/">Domů</Link></li>
            <li><a href="#about">O nás</a></li>
            <li><Link to="/chat">Chat s JuNoMi</Link></li>
          </ul>
        </div>

        {/* Pravý sloupec: Podpora a účet */}
        <div className="footer-links">
          <h4>Podpora</h4>
          <ul>
            <li><Link to="/login">Přihlášení</Link></li>
            <li><Link to="/login" state={{ isRegister: true }}>Registrace</Link></li>
            <li><a href="#privacy">Ochrana soukromí</a></li>
          </ul>
        </div>
      </div>
      
      {/* Spodní linka s copyrightem */}
      <div className="footer-bottom">
        <p>AI FighterS © {new Date().getFullYear()}. Všechna práva vyhrazena.</p>
      </div>
    </footer>
  );
}

export default Footer;