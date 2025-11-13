// src/components/AboutUs.js
import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <section className="about-us-section" id="about">
      <h2>About us</h2>
      <div className="about-us-container">
        <div className="about-us-box">
          <p>Our mission is to build an AI that feels inspiring, not robotic. We are students creating a smarter tool that combines power with a visually-rich interface, making it a genuine joy to use.</p>
        </div>
        <div className="about-us-box">
          <p>We combined our skills in machine learning and UI/UX to build a tool we'd actually love to use.</p>
        </div>
        <div className="about-us-box">
          <p>We believe great technology deserves great design. AI should be simple, intuitive, responsive, and beautiful.</p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;