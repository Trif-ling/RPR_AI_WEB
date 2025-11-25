// src/App.js
import React, { useState, useEffect } from 'react';
// Importujeme Router věci
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Statistics from './components/Statistics';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import ChatPage from './components/ChatPage'; // Nová stránka
import { translations } from './translations';

function App() {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('cz');
  const [isToggled, setIsToggled] = useState(false);
  
  const [bubble, setBubble] = useState({
    active: false,
    x: 0,
    y: 0,
    color: '#fff'
  });

  const t = translations[language];

  const handleThemeChange = (e) => {
    setIsToggled(prev => !prev);
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
    const nextColor = theme === 'dark' ? '#ffffff' : '#000000';
    setBubble({ active: true, x, y, color: nextColor });
    setTimeout(() => {
      setTheme((curr) => (curr === 'dark' ? 'light' : 'dark'));
      setBubble(prev => ({ ...prev, active: false }));
    }, 500); 
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
  }, [theme]);

  return (
    <Router>
      <div className="App" id={theme}>
        
        {bubble.active && (
          <div 
            className="inversion-bubble"
            style={{ left: bubble.x, top: bubble.y, backgroundColor: bubble.color }}
          />
        )}

        <div className="content-wrapper">
          {/* Navbar je vidět všude */}
          <Navbar 
            isToggled={isToggled} 
            toggleTheme={handleThemeChange} 
            language={language} 
            setLanguage={setLanguage}
            text={t} 
          />

          {/* ZDE JE ZMĚNA: Přepínání obsahu podle adresy */}
          <Routes>
            
            {/* Hlavní stránka (Landing Page) */}
            <Route path="/" element={
              <>
                <Hero text={t} />
                <AboutUs text={t} />
                <Statistics text={t} />
                <CallToAction text={t} />
                <Footer text={t} />
              </>
            } />

            {/* Stránka Chatu */}
            <Route path="/chat" element={<ChatPage text={t} />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;