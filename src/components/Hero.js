// src/components/Hero.js
import React from 'react';
import './Hero.css';

function Hero({ text }) {
  return (
    <div className="hero-container">
      <div className="hero-text">
        <h2>{text.hero_title}</h2>
        <ul>
          <li>{text.hero_sub1}</li>
          <li>{text.hero_sub2}</li>
        </ul>
      </div>
      <div className="hero-model">
        <p>{text.hero_model_placeholder}</p>
      </div>
    </div>
  );
}

export default Hero;