// src/components/AboutUs.js
import React from 'react';
import './AboutUs.css';

function AboutUs({ text }) {
  return (
    <section className="about-us-section" id="about">
      <h2>{text.about_title}</h2>
      <div className="about-us-container">
        <div className="about-us-box">
          <p>{text.about_box1}</p>
        </div>
        <div className="about-us-box">
          <p>{text.about_box2}</p>
        </div>
        <div className="about-us-box">
          <p>{text.about_box3}</p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;