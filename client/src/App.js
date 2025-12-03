import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import komponent
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Statistics from './components/Statistics';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import ChatPage from './components/ChatPage';
import { translations } from './translations';
import './index.css';

function App() {
  // 1. INICIALIZACE STAVŮ
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark'; 
  });

  const [isToggled, setIsToggled] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light'; 
  });

  // Stav pro Z-Index (aby bublina nepřekážela, když není aktivní)
  const [bubbleZIndex, setBubbleZIndex] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? -1 : 9999;
  });

  const [language, setLanguage] = useState('cz');
  const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });

  const t = translations[language];

  // 3. EFEKT: APLIKACE TŘÍD
  useEffect(() => {
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      document.body.style.backgroundColor = '#000000'; 
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#ffffff'; 
    }
  }, [theme]);

  // 4. FUNKCE PRO ZMĚNU TÉMATU (S logikou Z-Indexu)
  const handleThemeChange = (x, y) => {
    setBubblePos({ x, y });
    
    if (theme === 'dark') {
      // Jdeme do LIGHT
      setBubbleZIndex(9999); // Bublina nahoru
      setIsToggled(true);    // Expandovat

      setTimeout(() => {
        setTheme('light');
      }, 250);

      // Po animaci bublinu schováme dospod
      setTimeout(() => {
        setBubbleZIndex(-1);
      }, 700);

    } else {
      // Jdeme do DARK
      setBubbleZIndex(9999); // Bublina nahoru
      setTheme('dark');      // Přepnout téma (pozadí zčerná pod bublinou)
      
      setTimeout(() => {
        setIsToggled(false); // Smrsknout bublinu
      }, 10);
    }
  };

  return (
    <Router>
      <div className="App" id={theme}>
        
        {/* BUBLINA - Přidán style pro zIndex */}
        <div 
          className={`inversion-bubble ${isToggled ? 'expanded' : ''}`}
          style={{ 
            left: bubblePos.x, 
            top: bubblePos.y,
            zIndex: bubbleZIndex 
          }}
        />

        {/* HLAVNÍ OBSAH */}
        <div className="content-wrapper">
          <Navbar 
            isToggled={isToggled} 
            toggleTheme={handleThemeChange} 
            language={language} 
            setLanguage={setLanguage}
            text={t} 
            currentThemeState={theme}
          />

          <Routes>
            <Route path="/" element={
              <>
                <Hero text={t} />
                <AboutUs text={t} />
                <Statistics text={t} />
                <CallToAction text={t} />
                <Footer text={t} />
              </>
            } />

            <Route path="/chat" element={<ChatPage text={t} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;