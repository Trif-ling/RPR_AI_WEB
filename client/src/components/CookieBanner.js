import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // 👈 Přidán import Supabase databáze
import './CookieBanner.css';

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkConsent = async () => {
      // 1. Zkontrolujeme lokální paměť (nejrychlejší)
      const localConsent = localStorage.getItem('junomi_cookie_consent');
      if (localConsent) {
        return; // Uživatel už na tomto zařízení naklikal, nic nezobrazujeme
      }

      // 2. Pokud v lokální paměti nic není, zkusíme zjistit, jestli není uživatel přihlášený
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Pokud je přihlášený, podíváme se do jeho profilu v DB
        const { data: profile } = await supabase
          .from('profiles')
          .select('cookie_consent')
          .eq('id', session.user.id)
          .single();

        // Pokud už v minulosti (třeba na mobilu) souhlas dal/odmítl (není to null)
        if (profile && profile.cookie_consent !== null) {
          const consentValue = profile.cookie_consent ? 'accepted' : 'declined';
          localStorage.setItem('junomi_cookie_consent', consentValue);
          
          // Rovnou přesuneme tokeny podle jeho minulé volby
          if (profile.cookie_consent) {
            Object.keys(sessionStorage).forEach(key => {
              if (key.startsWith('sb-')) {
                localStorage.setItem(key, sessionStorage.getItem(key));
                sessionStorage.removeItem(key);
              }
            });
          }
          return; // Vše jsme načetli z DB, bublinu neukazujeme
        }
      }

      // 3. Pokud nic z toho neplatí (není přihlášen nebo nikdy nesouhlasil), zobrazíme bublinu
      setIsVisible(true);
    };

    checkConsent();
  }, []);

  // --- FUNKCE PŘI KLIKNUTÍ NA PŘIJMOUT ---
  const handleAccept = async () => {
    localStorage.setItem('junomi_cookie_consent', 'accepted');
    setIsVisible(false);

    // Přesun tokenů do trvalé paměti
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.setItem(key, sessionStorage.getItem(key));
        sessionStorage.removeItem(key);
      }
    });

    // Uložení souhlasu do Databáze (pokud je uživatel přihlášený)
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase
        .from('profiles')
        .update({ cookie_consent: true })
        .eq('id', session.user.id);
    }
  };

  // --- FUNKCE PŘI KLIKNUTÍ NA ODMÍTNOUT ---
  const handleDecline = async () => {
    localStorage.setItem('junomi_cookie_consent', 'declined');
    setIsVisible(false);

    // Přesun tokenů do dočasné paměti (smaže se po zavření okna)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) {
        sessionStorage.setItem(key, localStorage.getItem(key));
        localStorage.removeItem(key);
      }
    });

    // Uložení nesouhlasu do Databáze (pokud je uživatel přihlášený)
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase
        .from('profiles')
        .update({ cookie_consent: false })
        .eq('id', session.user.id);
    }
  };

  if (!isVisible) return null;

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