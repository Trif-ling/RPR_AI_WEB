// src/App.js
import React, { useState, useEffect } from 'react';
// ŘÁDEK S IMPORTEM App.css JSME SMAZALI, PROTOŽE SOUBOR NEEXISTUJE
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Statistics from './components/Statistics';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import { translations } from './translations';

function App() {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('cz');
  
  // Stav pro tlačítko (vizuální)
  const [isToggled, setIsToggled] = useState(false);
  
  // Stav pro bublinu
  const [bubble, setBubble] = useState({
    active: false,
    x: 0,
    y: 0
  });

  const t = translations[language];

  const handleThemeChange = (e) => {
    // 1. Přepneme tlačítko
    setIsToggled(prev => !prev);

    // 2. Najdeme střed tlačítka
    const switchElement = e.target.closest('.theme-switch');
    let x = 0, y = 0;
    
    if (switchElement) {
      const rect = switchElement.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    // 3. Spustíme bublinu
    setBubble({ active: true, x, y });

    // 4. Změna tématu se zpožděním
    setTimeout(() => {
      setTheme((curr) => (curr === 'dark' ? 'light' : 'dark'));
      setBubble(prev => ({ ...prev, active: false }));
    }, 500); 
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
  }, [theme]);

  return (
    <div className="App" id={theme}>
      {/* Inverzní bublina */}
      {bubble.active && (
        <div 
          className="inversion-bubble"
          style={{
            left: bubble.x,
            top: bubble.y,
          }}
        />
      )}

      <div className="content-wrapper">
        <Navbar 
          isToggled={isToggled} 
          toggleTheme={handleThemeChange} 
          language={language} 
          setLanguage={setLanguage}
          text={t} 
        />
        <Hero text={t} />
        <AboutUs text={t} />
        <Statistics text={t} />
        <CallToAction text={t} />
        <Footer text={t} />
      </div>
    </div>
  );
}

export default App;