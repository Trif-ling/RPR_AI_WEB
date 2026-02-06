import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // <--- 1. PŘIDÁNO TADY

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
  const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });

  const t = translations[language];

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

  const handleThemeChange = (x, y) => {
    setBubblePos({ x, y });
    
    if (theme === 'dark') {
      setBubbleZIndex(9999);
      setIsToggled(true);    
      setTimeout(() => setTheme('light'), 250);
      setTimeout(() => setBubbleZIndex(-1), 700);
    } else {
      setBubbleZIndex(9999);
      setTheme('dark');      
      setTimeout(() => setIsToggled(false), 10);
    }
  };

  return (
    <HelmetProvider> {}
      <Router>
        <div className="App" id={theme} style={{ position: 'relative', overflowX: 'hidden' }}>
          
          <div 
            className={`inversion-bubble ${isToggled ? 'expanded' : ''}`}
            style={{ 
              left: bubblePos.x, 
              top: bubblePos.y,
              zIndex: bubbleZIndex 
            }}
          />

          <div className="content-wrapper" style={{ position: 'relative', zIndex: 1 }}>
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
                  {/* OBRÁZEK SAMURAJE */}
                  <img 
                    src="/Samurai-removebg-preview.png" 
                    alt="Samurai" 
                    className="hero-samurai"
                    style={{
                      position: 'absolute',
                      top: '80px',
                      right: '0',
                      width: '50vw',
                      maxWidth: '800px',
                      minWidth: '300px',
                      zIndex: -1,          
                      pointerEvents: 'none',
                      opacity: 0.6         
                           }}
                  />

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
    </HelmetProvider> {}
  );
}

export default App;