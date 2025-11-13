// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Můžeš nechat, i když je prázdný
import App from './App'; // Importuje tvůj App.js

// Najde v HTML souboru prvek s ID 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

// A řekne Reactu, aby do něj vykreslil celou tvoji aplikaci (App)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);