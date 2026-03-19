import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

function PrivacyPage({ text = {} }) {
  return (
    <div className="page-container" style={{ paddingTop: '150px', minHeight: '100vh' }}>
      
      <div style={{ maxWidth: '900px', margin: '0 auto 50px', padding: '0 20px', color: 'var(--text-color)', textAlign: 'justify' }}>
        <h1 style={{ color: 'var(--accent-color)', marginBottom: '40px', textAlign: 'center' }}>
          {text.priv_title}
        </h1>
        
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '30px' }}>
          {text.priv_intro}
        </p>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--accent-color)' }}>
          {text.priv_s1_title}
        </h3>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '15px' }}>
          {text.priv_s1_intro}
        </p>
        <ul style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px', paddingLeft: '20px' }}>
          <li><strong>{text.priv_s1_l1_b}</strong> {text.priv_s1_l1_t}</li>
          <li><strong>{text.priv_s1_l2_b}</strong> {text.priv_s1_l2_t}</li>
          <li><strong>{text.priv_s1_l3_b}</strong> {text.priv_s1_l3_t}</li>
        </ul>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(255, 77, 77, 0.1)', borderLeft: '4px solid #ff4d4d' }}>
          <strong>{text.priv_s1_warn_b}</strong> {text.priv_s1_warn_t}
        </p>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--accent-color)' }}>
          {text.priv_s2_title}
        </h3>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '15px' }}>
          {text.priv_s2_intro}
        </p>
        <ul style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px', paddingLeft: '20px' }}>
          <li><strong>{text.priv_s2_l1_b}</strong> {text.priv_s2_l1_t}</li>
          <li><strong>{text.priv_s2_l2_b}</strong> {text.priv_s2_l2_t}</li>
          <li><strong>{text.priv_s2_l3_b}</strong> {text.priv_s2_l3_t}</li>
        </ul>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--accent-color)' }}>
          {text.priv_s3_title}
        </h3>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px' }}>
          {text.priv_s3_text}
        </p>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--accent-color)' }}>
          {text.priv_s4_title}
        </h3>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px' }}>
          {text.priv_s4_text}
        </p>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--accent-color)' }}>
          {text.priv_s5_title}
        </h3>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '15px' }}>
          {text.priv_s5_intro}
        </p>
        <ul style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px', paddingLeft: '20px' }}>
          <li><strong>{text.priv_s5_l1_b}</strong> {text.priv_s5_l1_t}</li>
          <li><strong>{text.priv_s5_l2_b}</strong> {text.priv_s5_l2_t}</li>
          <li><strong>{text.priv_s5_l3_b}</strong> {text.priv_s5_l3_t}</li>
          <li><strong>{text.priv_s5_l4_b}</strong> {text.priv_s5_l4_t}</li>
          <li><strong>{text.priv_s5_l5_b}</strong> {text.priv_s5_l5_t}</li>
          <li><strong>{text.priv_s5_l6_b}</strong> {text.priv_s5_l6_t}</li>
          <li><strong>{text.priv_s5_l7_b}</strong> {text.priv_s5_l7_t}</li>
        </ul>

        <div style={{ marginTop: '60px', borderTop: '1px solid var(--border-color)', paddingTop: '30px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {text.priv_back}
          </Link>
        </div>
      </div>

      <Footer text={text} />
    </div>
  );
}

export default PrivacyPage;