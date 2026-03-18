import React from 'react';
import '@google/model-viewer'; 
import './Hero.css';
import { useNavigate } from 'react-router-dom';

function Hero({ text }) {
  const navigate = useNavigate();
  
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 data-aos="fade-up">{text.hero_title}</h1>
        <h3 className="hero-subtitle" data-aos="fade-up" data-aos-delay="100">
          {text.hero_subtitle}
        </h3>
        
        {/* Ostatní popisky a tlačítka nech jak jsou... */}
        <p className="hero-description">{text.hero_desc1}</p>
        <div className="hero-buttons">
           <button className="btn-primary" onClick={() => navigate('/login')}>{text.hero_btn_login}</button>
           <button className="btn-secondary" onClick={() => navigate('/chat')}>{text.hero_btn_try}</button>
        </div>
      </div>

      <div className="hero-3d-container">
        {/* ZŮSTANE JEN TENTO 3D MODEL, ŽÁDNÝ <img /> TAG VEDLE NĚJ! */}
        <model-viewer
          src="/models/samurai.glb" 
          alt="3D Samurai Model"
          auto-rotate
          camera-controls
          loading="eager"
          shadow-intensity="2"
          exposure="1.5"
          environment-image="neutral"
          auto-rotate-delay="0"
          rotation-per-second="30deg"
          interaction-prompt="none"
          style={{ width: '100%', height: '100%', outline: 'none' }}
        >
        </model-viewer>
      </div>
    </section>
  );
}

export default Hero;