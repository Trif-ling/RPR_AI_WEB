import React, { useEffect, useRef, useState } from 'react';
import './AboutUs.css';

function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    // Sledovač, který zjistí, jestli už je komponenta na obrazovce
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true); // Zapne animaci
        }
      });
    }, { threshold: 0.2 }); // Animace se spustí, když je vidět alespoň 20% sekce
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    // Třída "is-visible" se přidá dynamicky, až se sem doscrolluje
    <section 
      className={`about-section ${isVisible ? 'is-visible' : ''}`} 
      ref={domRef}
      id="about"
    >
      <h2>O NÁS</h2>
      <div className="about-content">
        <p>
          Jsme tým zapálených studentů, kteří věří, že umělá inteligence by měla být dostupná, 
          rychlá a intuitivní pro každého. Projekt JuNoMi vznikl z touhy posouvat hranice 
          toho, co dokážeme s moderními technologiemi vytvořit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, 
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </p>
      </div>
    </section>
  );
}

export default AboutUs;