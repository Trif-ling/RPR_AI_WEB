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

  const [bubbleZIndex, setBubbleZIndex] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? -1 : 9999;
  });

  const [language, setLanguage] = useState('cz');
  
  // 2. STAV PRO POZICI BUBLINY
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

  // 4. FUNKCE PRO ZMĚNU TÉMATU
  const handleThemeChange = (x, y) => {
  // 1. Nastavíme startovní pozici bubliny
  setBubblePos({ x, y });
  
  // 2. Okamžitě spustíme vizuální expanzi bubliny
  // Pokud jsme v Dark, jdeme na Light (expandujeme bílou bublinu)
  const nextIsLight = theme === 'dark'; 
  setIsToggled(nextIsLight);

  // 3. Zpozdíme přepnutí dat (tématu, loga, barev)
  // o 250ms, aby bublina stihla vizuálně překrýt obrazovku.
  setTimeout(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, 250); 
};

  return (
    <Router>
      <div className="App" id={theme}>
        
        {/* BUBLINA */}
        <div 
          className={`inversion-bubble ${isToggled ? 'expanded' : ''}`}
          style={{ 
            left: bubblePos.x, 
            top: bubblePos.y 
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