// src/components/CallToAction.js
import React from 'react';
import './CallToAction.css';

function CallToAction() {
  return (
    <section className="cta-section">
      <h2>Let's create something amazing.</h2>
      <p>Our model is ready to turn your ideas into reality.</p>
      <a href="/chat" className="cta-button">
        Start creating
      </a>
    </section>
  );
}

export default CallToAction;