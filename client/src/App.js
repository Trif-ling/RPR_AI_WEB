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
import RobotScene from './components/Robot'; 
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

  // Bublina má buď -1 (schovaná) nebo 9999 (překrývá vše, včetně robota s z-index 50)
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
      setBubbleZIndex(9999); // Aktivujeme bublinu (překryje robota)
      setIsToggled(true);    
      setTimeout(() => setTheme('light'), 250);
      setTimeout(() => setBubbleZIndex(-1), 700);
    } else {
      setBubbleZIndex(9999); // Aktivujeme bublinu (překryje robota)
      setTheme('dark');      
      setTimeout(() => setIsToggled(false), 10);
    }
  };

  return (
    <Router>
      <div className="App" id={theme}>
        
        {/* Robot se vykreslí do našeho kontejneru s z-index: 50 */}
        <RobotScene />

        {/* Bublina má z-index: 9999 (když je aktivní), takže robota zakryje */}
        <div 
          className={`inversion-bubble ${isToggled ? 'expanded' : ''}`}
          style={{ 
            left: bubblePos.x, 
            top: bubblePos.y,
            zIndex: bubbleZIndex 
          }}
        />

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