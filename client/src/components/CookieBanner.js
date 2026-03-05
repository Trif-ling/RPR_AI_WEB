import React, { useState, useEffect } from 'react';
import './CookieBanner.css';

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Při načtení webu zkontrolujeme, jestli už uživatel dříve souhlasil/nesouhlasil
    const consent = localStorage.getItem('junomi_cookie_consent');
    if (!consent) {
      // Pokud záznam neexistuje, bublinu zobrazíme
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('junomi_cookie_consent', 'accepted');
    setIsVisible(false);
    // Zde bys v budoucnu spustil Google Analytics nebo jiný měřící nástroj
  };

  const handleDecline = () => {
    localStorage.setItem('junomi_cookie_consent', 'declined');
    setIsVisible(false);
    // Zde zajistíš, že se žádná měřící skripta nespustí
  };

  if (!isVisible) return null; // Pokud už vybral, nevykresluj nic

  return (
    <div className="cookie-banner-modern">
      <div className="cookie-content">
        <div className="cookie-text">
          <h4>🍪 Respektujeme tvé soukromí</h4>
          <p>
            Abychom mohli JuNoMi neustále zlepšovat a pamatovat si tvé přihlášení, 
            potřebujeme tvůj souhlas s používáním cookies a sběrem analytických dat. 
            Žádný spam, jen nutná data pro běh a vylepšování webu.
          </p>
        </div>
        <div className="cookie-buttons">
          <button className="btn-decline" onClick={handleDecline}>Odmítnout</button>
          <button className="btn-accept" onClick={handleAccept}>Přijmout vše</button>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;