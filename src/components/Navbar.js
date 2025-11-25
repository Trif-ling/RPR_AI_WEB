// src/components/Navbar.js
import React from 'react';
import './Navbar.css';

// Důležité: Přijímáme prop "isToggled"
function Navbar({ isToggled, toggleTheme, language, setLanguage, text }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">LOGO</div>
      
      <ul className="navbar-links">
        <li><a href="#about">{text.nav_about}</a></li>
        <li><a href="#statistics">{text.nav_stats}</a></li>
        <li><a href="/chat">{text.nav_chat}</a></li>
      </ul>

      <div className="navbar-controls">
        
        {/* IPHONE TOGGLE SWITCH */}
        <label className="theme-switch">
          <input 
            type="checkbox" 
            onChange={toggleTheme} 
            // Řídíme se podle okamžitého stavu (aby nebylo zpoždění)
            checked={isToggled} 
          />
          <span className="switch-track">
            <span className="switch-knob">
              {/* Ikona se mění také okamžitě */}
              {isToggled ? (
                // IKONA SLUNCE
                <svg className="icon-svg sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                // IKONA MĚSÍCE
                <svg className="icon-svg moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </span>
          </span>
        </label>

        {/* VÝBĚR JAZYKA */}
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