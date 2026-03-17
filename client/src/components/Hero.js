import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

function Hero({ text }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* Přidáno fade-up = plynulé vyjetí zespodu */}
        <h1 data-aos="fade-up">Váš osobní asistent s umělou inteligencí.</h1>
        
        {/* Zpoždění 100ms */}
        <h3 className="hero-subtitle" data-aos="fade-up" data-aos-delay="100">
          Získejte okamžité odpovědi a kreativní nápady.
        </h3>
        
        {/* Zpoždění 200ms */}
        <p className="hero-description" data-aos="fade-up" data-aos-delay="200">
          Pohled do budoucnosti umělé inteligence, kterou vytvořili studenti. 
          JuNoMi není jen obyčejný chatbot. Je to váš digitální společník navržený pro maximální efektivitu, 
          rychlost a bezpečnost. Ať už potřebujete pomoci s programováním, psaním textů, 
          nebo jen hledáte inspiraci, JuNoMi je tu pro vás 24/7.
        </p>
        
        {/* Zpoždění 300ms */}
        <p className="hero-description-secondary" data-aos="fade-up" data-aos-delay="300">
          Vyzkoušejte sílu moderních modelů zabalenou do intuitivního a bleskově rychlého rozhraní. 
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
        </p>

        {/* Zpoždění 400ms */}
        <div className="hero-buttons" data-aos="fade-up" data-aos-delay="400">
          {/* Tlačítko pošle uživatele rovnou na registraci */}
          <Link to="/login" state={{ isRegister: true }} className="btn-primary">Začít zdarma</Link>
          <Link to="/chat" className="btn-secondary">Vyzkoušet bez účtu</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;