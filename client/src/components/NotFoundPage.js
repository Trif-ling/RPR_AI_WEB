import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '60vh', 
      textAlign: 'center',
      color: 'var(--text-color, white)'
    }}>
      <h1 style={{ fontSize: '6rem', margin: '0', color: 'var(--accent-color, #00d084)' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Jejda! Tady nic není.</h2>
      <p style={{ opacity: '0.7', marginBottom: '30px', maxWidth: '400px' }}>
        Stránka, kterou hledáte, buď neexistuje, nebo byla přesunuta někam jinam.
      </p>
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--accent-color, #00d084)',
          color: 'black',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Vrátit se domů
      </button>
    </div>
  );
};

export default NotFoundPage;