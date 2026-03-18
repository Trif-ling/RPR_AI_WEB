import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

// Importy log
import logoWhite from '../logo-tmave.svg'; 
import logoDark from '../logo-svetle.svg';

function Navbar({ isToggled, toggleTheme, language, setLanguage, text, currentThemeState }) {

  const handleToggle = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    toggleTheme(x, y);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        {/* Kontejner pro loga - velikost se nyní řídí čistě v CSS */}
        <div className="logo-container">
          
          {/* Logo pro DARK MODE (bílý text) */}
          <img 
            src={logoWhite} 
            alt="Junomi" 
            className={`logo-img ${currentThemeState === 'dark' ? 'visible' : 'hidden'}`} 
          />
          
          {/* Logo pro LIGHT MODE (černý text) */}
          <img 
            src={logoDark} 
            alt="Junomi" 
            className={`logo-img ${currentThemeState === 'light' ? 'visible' : 'hidden'}`} 
          />
        </div>
      </Link>
      
      <ul className="navbar-links">
        <li><a href="/#about">{text?.nav_about || "About"}</a></li>
        <li><a href="/#statistics">{text?.nav_stats || "Stats"}</a></li>
        <li><Link to="/chat">{text?.nav_chat || "Chat"}</Link></li>
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
          <select 
            className="lang-select" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="cz">CZ</option>
            <option value="en">EN</option>
          </select>
          <span className="arrow-down">▼</span>
        </div>

       <Link to="/login" className="nav-login-btn">
      {text.nav_login}
    </Link>
      </div>
    </nav>
  );
}

export default Navbar;