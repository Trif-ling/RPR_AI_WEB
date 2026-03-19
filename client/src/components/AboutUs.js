import React from 'react';
import './AboutUs.css';

function AboutUs({ text = {} }) {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        
        <h2 className="section-title">{text.about_title}</h2>
        <div className="underline"></div>
        
        <div className="about-content-wrapper">
          <div className="about-text-side">
            <p className="about-description">{text.about_text}</p>
            
            <div className="team-grid-modern">
              <div className="team-card-modern">
                <div className="card-dot"></div>
                <h3>Daniel Milota</h3>
                <p>Frontend Developer</p>
              </div>
              <div className="team-card-modern">
                <div className="card-dot"></div>
                <h3>Ondřej Juhás</h3>
                <p>Backend Developer</p>
              </div>
              <div className="team-card-modern">
                <div className="card-dot"></div>
                <h3>Filip Novotný</h3>
                <p>Manager & Designer</p>
              </div>
            </div>
          </div>

          <div className="about-image-side">
            <div className="image-border-effect">
              <img 
                src="../foto.png" 
                alt="JuNoMi Team" 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutUs;