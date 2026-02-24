import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

function Hero({ text }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Váš osobní asistent s umělou inteligencí.</h1>
        <h3 className="hero-subtitle">Získejte okamžité odpovědi a kreativní nápady.</h3>
        
        <p className="hero-description">
          Pohled do budoucnosti umělé inteligence, kterou vytvořili studenti. 
          JuNoMi není jen obyčejný chatbot. Je to váš digitální společník navržený pro maximální efektivitu, 
          rychlost a bezpečnost. Ať už potřebujete pomoci s programováním, psaním textů, 
          nebo jen hledáte inspiraci, JuNoMi je tu pro vás 24/7.
        </p>
        
        <p className="hero-description-secondary">
          Vyzkoušejte sílu moderních modelů zabalenou do intuitivního a bleskově rychlého rozhraní. 
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
        </p>

        <div className="hero-buttons">
          {/* Tlačítko pošle uživatele rovnou na registraci */}
          <Link to="/login" state={{ isRegister: true }} className="btn-primary">Začít zdarma</Link>
          <Link to="/chat" className="btn-secondary">Vyzkoušet bez účtu</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;