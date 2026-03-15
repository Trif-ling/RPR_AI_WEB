import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './LoginPage.css';

function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setErrorMsg("Neplatný nebo vypršelý odkaz. Prosím, vyžádejte si obnovu hesla znovu.");
      }
    };
    checkSession();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg("Heslo musí mít alespoň 6 znaků.");
      setLoading(false);
      return;
    }

    // Uložení nového hesla do Supabase
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Heslo bylo úspěšně změněno! Přesměrovávám do chatu...");
      // Počkáme 2 vteřiny, aby si uživatel stihl přečíst úspěšnou hlášku, a hodíme ho do chatu
      setTimeout(() => {
        navigate('/chat');
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container-modern">
        <div className="login-content-inner">
          
          <h2>Zadej nové heslo</h2>
          <p className="subtitle">
            Tvůj účet byl ověřen. Nyní si můžeš nastavit nové heslo pro přihlášení.
          </p>

          {/* CHYBOVÁ ZPRÁVA */}
          {errorMsg && (
            <div style={{ backgroundColor: '#ff4d4f20', color: '#ff4d4f', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #ff4d4f50' }}>
              {errorMsg}
            </div>
          )}

          {/* ZPRÁVA O ÚSPĚCHU */}
          {successMsg && (
            <div style={{ backgroundColor: '#00d08420', color: '#00d084', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #00d08450' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleUpdate}>
            <div className="form-group-modern">
              <label>Nové heslo</label>
              <div className="input-with-icon">
                {/* Ikonka zámečku */}
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={successMsg !== null} // Zakážeme úpravy po úspěšné změně
                />
              </div>
            </div>

            <button type="submit" className="submit-btn-glow" disabled={loading || successMsg !== null}>
              {loading ? "Ukládám..." : "Uložit nové heslo"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default UpdatePasswordPage;