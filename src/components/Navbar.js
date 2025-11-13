// src/components/Navbar.js
import React from 'react';
import './Navbar.css'; // Vytvoříme za chvíli pro stylování

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">LOGO</div>
      <ul className="navbar-links">
        <li><a href="#about">About us</a></li>
        <li><a href="#statistics">Statistics</a></li>
        <li><a href="/chat">Chat with (name)</a></li> {/* Odkaz na jinou stránku */}
      </ul>
      <div className="navbar-auth">
        <a href="/login">Login</a>
        <a href="/register" className="register-btn">Register</a>
      </div>
    </nav>
  );
}

export default Navbar;