import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './LoginPage.css';

// Přidali jsme { text } sem nahoru:
function LoginPage({ text }) {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.isRegister ? false : true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulář odeslán!");
  };

  return (
    <div className="login-page">
      <div className="login-container-modern">
        <div className="login-content-inner">

          {/* VYUŽITÍ PŘEKLADŮ */}
          <h2>{isLogin ? text.loginWelcome : text.loginCreate}</h2>
          <p className="subtitle">
            {isLogin ? text.loginSubLog : text.loginSubReg}
          </p>
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group-modern">
                <label>{text.loginUser}</label>
                <div className="input-with-icon">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <input type="text" placeholder={text.loginUserPlace} required />
                </div>
              </div>
            )}

            <div className="form-group-modern">
              <label>Email</label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                <input type="email" placeholder="tvoje@email.cz" required />
              </div>
            </div>

            <div className="form-group-modern">
              <label>{text.loginPass}</label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input type="password" placeholder="••••••••" required />
              </div>
            </div>

            {isLogin && (
              <div className="forgot-password">
                <span>{text.loginForgot}</span>
              </div>
            )}

            <button type="submit" className="submit-btn-glow">
              {isLogin ? text.loginBtnLog : text.loginBtnReg}
            </button>
          </form>

          <p className="toggle-text-modern">
            {isLogin ? text.loginNoAcc : text.loginHasAcc}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? text.loginCreate : text.loginBtnLog}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;