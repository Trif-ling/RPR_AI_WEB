import React from 'react';
import './CallToAction.css';

function CallToAction({ text }) {
  return (
    <section className="cta-section">
      <h2>{text.cta_title}</h2>
      <p>{text.cta_text}</p>
      <a href="/chat" className="cta-button">
        {text.cta_btn}
      </a>
    </section>
  );
}

export default CallToAction;
