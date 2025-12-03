// src/components/AboutUs.js
import React from 'react';
import './AboutUs.css';

function AboutUs({ text }) {
  return (
    <section className="about-us-section" id="about">
      <h2>{text.about_title}</h2>
      
      <div className="about-us-container">
        {/* První box - díky CSS (nth-child: 1) bude široký přes celou šířku */}
        <div className="about-us-box">
          <p>{text.about_box1}</p>
        </div>
        
        {/* Druhý box - bude vlevo dole */}
        <div className="about-us-box">
          <p>{text.about_box2}</p>
        </div>
        
        {/* Třetí box - bude vpravo dole */}
        <div className="about-us-box">
          <p>{text.about_box3}</p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;