import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import './Statistics.css';

// === 1. POMOCNÁ KOMPONENTA PRO PLYNULOU ANIMACI ČÍSEL ===
const AnimatedNumber = ({ endValue, decimals = 0, suffix = '', prefix = '', isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Spustí animaci až když je prvek vidět na obrazovce
    if (!isVisible) return;

    let startTime = null;
    const duration = 2000; // Animace bude trvat 2 vteřiny

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing funkce (čísla na konci plynule zpomalí)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(endValue * easeOutQuart);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue); // Pojistka, aby se to zastavilo přesně na cílovém čísle
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, isVisible]);

  return (
    <span>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};


// === 2. HLAVNÍ KOMPONENTA STATISTIK ===
function Statistics({ text = {} }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Stavy pro data, která budeme tahat z databáze
  const [usersCount, setUsersCount] = useState(12); // Výchozí hodnota (ta se nahradí reálnou)
  
  // Získání reálných čísel ze Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: uCount, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (uCount !== null && !error) {
          setUsersCount(uCount);
        }
      } catch (err) {
        console.error("Chyba při načítání statistik:", err);
      }
    };

    fetchStats();
  }, []);

  // Sledování scrollování (zjistí, kdy uživatel dojede k této sekci)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Animace proběhne jen jednou
        }
      },
      { threshold: 0.3 } // Spustí se, až když je alespoň 30% sekce vidět
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="statistics-section" id="statistics" ref={sectionRef}>
      <h2>{text.stats_title}</h2>
      <div className="statistics-container">
        
        <div className="stat-item">
          <h3>
            <AnimatedNumber endValue={usersCount} isVisible={isVisible} />
          </h3>
          <p>{text.stats_users}</p>
        </div>
        
        <div className="stat-item">
          <h3>
            <AnimatedNumber endValue={0.4} decimals={1} suffix="s" isVisible={isVisible} />
          </h3>
          <p>{text.stats_time}</p>
        </div>
        
        <div className="stat-item">
          <h3>24/7</h3>
          <p>{text.stats_online}</p>
        </div>
      </div>
    </section>
  );
}

export default Statistics;