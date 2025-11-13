// src/components/Hero.js
import React from 'react';
import './Hero.css'; // Budeme potřebovat styly

function Hero() {
  return (
    <div className="hero-container">
      <div className="hero-text">
        <h2>Your Personal AI Assistant.</h2>
        <ul>
          <li>Get Instant Answers and Creative Ideas.</li>
          <li>A Glimpse into the Future of AI, Built by Students.</li>
        </ul>
      </div>
      <div className="hero-model">
        {/* Tady bude později ten 3D model */}
        <p>AI character/3D model</p>
      </div>
    </div>
  );
}

export default Hero;