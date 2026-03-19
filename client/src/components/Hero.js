import React, { useState, useEffect } from 'react';
import '@google/model-viewer'; 
import './Hero.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Hero({ text }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Zjištění stavu přihlášení hned po načtení
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Tento posluchač okamžitě zareaguje, pokud se uživatel přihlásí/odhlásí
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Funkce pro anonymní chat (odhlásí uživatele a přesměruje ho)
  const handleAnonymousChat = async () => {
    await supabase.auth.signOut();
    navigate('/chat');
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 data-aos="fade-up">{text.hero_title}</h1>
        <h3 className="hero-subtitle" data-aos="fade-up" data-aos-delay="100">
          {text.hero_subtitle}
        </h3>
        
        <p className="hero-description">{text.hero_desc1}</p>
        
        {/* DYNAMICKÁ TLAČÍTKA PODLE PŘIHLÁŠENÍ */}
        <div className="hero-buttons">
          {user ? (
            <>
              <button className="btn-primary" onClick={() => navigate('/chat')}>Přejít k JuNoMi</button>
              <button className="btn-secondary" onClick={handleAnonymousChat}>Chatovat anonymně</button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={() => navigate('/login')}>{text.hero_btn_login}</button>
              <button className="btn-secondary" onClick={() => navigate('/chat')}>{text.hero_btn_try}</button>
            </>
          )}
        </div>

      </div>

      <div className="hero-3d-container">
        <model-viewer
          src="/models/samurai.glb" 
          alt="JuNoMi Samurai"
          camera-controls
          disable-zoom
          loading="eager"
          shadow-intensity="2"
          exposure="1.5"
          environment-image="neutral"
          interaction-prompt="none"
          camera-orbit="0deg 75deg 105%"
          min-camera-orbit="-30deg 60deg auto"
          max-camera-orbit="30deg 90deg auto"
          style={{ width: '100%', height: '100%', outline: 'none' }}
        >
        </model-viewer>
      </div>
    </section>
  );
}

export default Hero;