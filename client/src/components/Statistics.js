// src/components/Statistics.js
import React from 'react';
import './Statistics.css';

function Statistics({ text }) {
  return (
    <section className="statistics-section" id="statistics">
      <h2>{text.stats_title}</h2>
      <div className="statistics-container">
        
        <div className="stat-item">
          <h3>~12</h3>
          <p>{text.stats_users}</p>
        </div>
        
        <div className="stat-item">
          <h3>0.3s</h3>
          <p>{text.stats_time}</p>
        </div>
        
        <div className="stat-item">
          <h3>24/7</h3>
          <p>{text.stats_online}</p>
        </div>
        
        <div className="stat-item">
          <h3>89%</h3>
          <p>{text.stats_satisfaction}</p>
        </div>

      </div>
    </section>
  );
}

export default Statistics;