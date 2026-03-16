import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './LoginPage.css';
import HCaptcha from '@hcaptcha/react-hcaptcha';

function LoginPage({ text = {}, theme}) {
  const location = useLocation();
  const navigate = useNavigate(); // Pro přesměrování po přihlášení
  
  const [isLogin, setIsLogin] = useState(location.state?.isRegister ? false : true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetMsg, setResetMsg] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  
  // Stavy pro formulář 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  // Stavy pro UI (načítání, chyby)
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMsg('');
    setErrorMsg(null);

    // Pošle email a řekne Supabase, kam má uživatele po kliknutí v emailu přesměrovat
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setResetMsg("Odkaz pro obnovu hesla byl odeslán na tvůj e-mail.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      let loggedInUser = null; // Pomocná proměnná pro synchronizaci

      if (isLogin) {
        // === PŘIHLÁŠENÍ ===
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;
        loggedInUser = data.user;
        console.log("Úspěšně přihlášen:", data.user);

      } else {
        // === REGISTRACE ===
        
        // Zkontrolujeme, jestli uživatel odklikl CAPTCHU
        if (!captchaToken) {
          setErrorMsg("Prosím, potvrď, že nejsi robot.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username
            },
            captchaToken: captchaToken
          }
        });

        if (error) throw error;
        loggedInUser = data.user;
        console.log("Úspěšně registrován:", data.user);
      }

      // === NOVÉ: SYNCHRONIZACE COOKIE SOUHLASU PO PŘIHLÁŠENÍ ===
      if (loggedInUser) {
        const localConsent = localStorage.getItem('junomi_cookie_consent');
        
        if (localConsent === 'accepted') {
          await supabase.from('profiles').update({ cookie_consent: true }).eq('id', loggedInUser.id);
        } else if (localConsent === 'declined') {
          await supabase.from('profiles').update({ cookie_consent: false }).eq('id', loggedInUser.id);
        }
      }

      // Po úspěšném přihlášení/registraci a synchronizaci přesměrujeme do chatu
      navigate('/chat'); 

    } catch (error) {
      console.error("Chyba auth:", error.message);
      if (error.message === "Invalid login credentials") {
        setErrorMsg("Špatný e-mail nebo heslo.");
      } else if (error.message === "User already registered") {
        setErrorMsg("Uživatel s tímto e-mailem už existuje.");
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container-modern">
        <div className="login-content-inner">

 <h2>
            {isForgotPassword ? "Obnova hesla" : (isLogin ? text.loginWelcome : text.loginCreate)}
          </h2>
          <p className="subtitle">
            {isForgotPassword ? "Zadej svůj e-mail a my ti pošleme odkaz na reset hesla." : (isLogin ? text.loginSubLog : text.loginSubReg)}
          </p>
          
          {/* ZOBRAZENÍ CHYBOVÉ HLÁŠKY */}
          {errorMsg && (
            <div style={{ backgroundColor: '#ff4d4f20', color: '#ff4d4f', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #ff4d4f50' }}>
              {errorMsg}
            </div>
          )}

          {/* ZOBRAZENÍ ZPRÁVY O ÚSPĚŠNÉM ODESLÁNÍ RESETU */}
          {resetMsg && (
            <div style={{ backgroundColor: '#00d08420', color: '#00d084', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #00d08450' }}>
              {resetMsg}
            </div>
          )}
          
          {isForgotPassword ? (
            <form onSubmit={handleResetPassword}>
              <div className="form-group-modern">
                <label>Email</label>
                <div className="input-with-icon">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  <input 
                    type="email" 
                    placeholder="tvuj@email.cz" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn-glow" disabled={loading}>
                {loading ? "Odesílám..." : "Poslat odkaz na e-mail"}
              </button>
              <p className="toggle-text-modern" style={{marginTop: '15px'}}>
                Zpět na <span onClick={() => { setIsForgotPassword(false); setErrorMsg(null); setResetMsg(''); }}>Přihlášení</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group-modern">
                  <label>{text.loginUser}</label>
                  <div className="input-with-icon">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <input 
                      type="text" 
                      placeholder={text.loginUserPlace} 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="form-group-modern">
                <label>Email</label>
                <div className="input-with-icon">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  <input 
                    type="email" 
                    placeholder="tvuj@email.cz" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group-modern">
                <label>{text.loginPass}</label>
                <div className="input-with-icon">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {isLogin && (
                <div className="forgot-password">
                  <span onClick={() => setIsForgotPassword(true)} style={{ cursor: 'pointer' }}>
                    {text.loginForgot}
                  </span>
                </div>
              )}

              {!isLogin && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 10px 0' }}>
                  <HCaptcha
                    sitekey="10000000-ffff-ffff-ffff-000000000001" // Oficiální testovací klíč
                    theme={theme}
                    onVerify={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken(null)} // Kdyby to trvalo moc dlouho
                  />
                </div>
              )}

              <button type="submit" className="submit-btn-glow" disabled={loading}>
                {loading ? "Načítám..." : (isLogin ? text.loginBtnLog : text.loginBtnReg)}
              </button>
            </form>
          )}

          {!isForgotPassword && (
            <p className="toggle-text-modern">
              {isLogin ? text.loginNoAcc : text.loginHasAcc}
              <span onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}>
                {isLogin ? text.loginCreate : text.loginBtnLog}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;