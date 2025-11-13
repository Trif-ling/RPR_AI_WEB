// src/App.js
import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Statistics from './components/Statistics';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer'; // <-- 1. IMPORTUJEME

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <AboutUs />
      <Statistics />
      <CallToAction />
      <Footer /> {/* <-- 2. VKLÁDÁME KOMPONENTU */}
    </div>
  );
}

export default App;