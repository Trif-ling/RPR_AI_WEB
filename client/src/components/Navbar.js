import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

// Importy log
import logoWhite from '../logo-tmave.svg'; 
import logoDark from '../logo-svetle.svg';

function Navbar({ isToggled, toggleTheme, language, setLanguage, text, currentThemeState }) {
  // Paměť pro stav otevření/zavření mobilního menu
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    toggleTheme(x, y);
  };

  // Funkce pro zavření menu po kliknutí na odkaz
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        <div className="logo-container">
          <img src={logoWhite} alt="Junomi" className={`logo-img ${currentThemeState === 'dark' ? 'visible' : 'hidden'}`} />
          <img src={logoDark} alt="Junomi" className={`logo-img ${currentThemeState === 'light' ? 'visible' : 'hidden'}`} />
        </div>
      </Link>
      
      {/* Tlačítko Hamburger Menu (viditelné jen na mobilech) */}
      <button className={`hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Tento kontejner drží odkazy a tlačítka - na PC je to řádek, na mobilu vyjížděcí menu */}
      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <ul className="navbar-links">
          <li><a href="/#about" onClick={closeMenu}>{text?.nav_about || "About"}</a></li>
          <li><a href="/#statistics" onClick={closeMenu}>{text?.nav_stats || "Stats"}</a></li>
          <li><Link to="/chat" onClick={closeMenu}>{text?.nav_chat || "Chat"}</Link></li>
        </ul>

        <div className="navbar-controls">
          <label className="theme-switch" onClick={handleToggle}>
            <input type="checkbox" checked={isToggled} readOnly />
            <span className="switch-track">
              <span className="switch-knob">
                {isToggled ? (
                  <svg className="icon-svg sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                ) : (
                  <svg className="icon-svg moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                )}
              </span>
            </span>
          </label>

          <div className="language-selector">
            <select className="lang-select" value={language} onChange={(e) => { setLanguage(e.target.value); closeMenu(); }}>
              <option value="cz">CZ</option>
              <option value="en">EN</option>
            </select>
            <span className="arrow-down">▼</span>
          </div>

          <Link to="/login" className="nav-login-btn" onClick={closeMenu}>
            {text.nav_login}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;