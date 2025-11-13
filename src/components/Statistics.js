// src/components/Statistics.js
import React from 'react';
import './Statistics.css';

function Statistics() {
  return (
    <section className="statistics-section" id="statistics">
      <h2>STATISTICS</h2>
      <div className="statistics-container">

        <div className="stat-item">
          <h3>157</h3>
          <p>users</p>
        </div>

        <div className="stat-item">
          <h3>0.3s</h3>
          <p>avg. time response</p>
        </div>

        <div className="stat-item">
          <h3>24/7</h3>
          <p>online</p>
        </div>

        <div className="stat-item">
          <h3>89%</h3>
          <p>satisfaction</p>
        </div>

      </div>
    </section>
  );
}

export default Statistics;