// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Navbar.css';

function Navbar({ isToggled, toggleTheme, language, setLanguage, text }) {
  return (
    <nav className="navbar">
      {/* Kliknutí na LOGO vrátí na domovskou stránku */}
      <Link to="/" className="navbar-logo">LOGO</Link>
      
      <ul className="navbar-links">
        <li><a href="/#about">{text.nav_about}</a></li>
        <li><a href="/#statistics">{text.nav_stats}</a></li>
        
        {/* Odkaz na Chat pomocí Link */}
        <li><Link to="/chat">{text.nav_chat}</Link></li>
      </ul>

      <div className="navbar-controls">
        
        <label className="theme-switch">
          <input 
            type="checkbox" 
            onChange={toggleTheme} 
            checked={isToggled} 
          />
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
            <option value="de">DE</option>
          </select>
          <span className="arrow-down">▼</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;