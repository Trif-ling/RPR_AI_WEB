import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Chybí Supabase klíče!");
}

const customStorage = {
  getItem: (key) => {
    if (localStorage.getItem('junomi_cookie_consent') === 'accepted') {
      return localStorage.getItem(key);
    }
    return sessionStorage.getItem(key); // Fallback na dočasnou paměť (smaže se po zavření okna)
  },
  setItem: (key, value) => {
    if (localStorage.getItem('junomi_cookie_consent') === 'accepted') {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
};

// Vytvoření klienta s naší novou chytrou pamětí
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage, // Připojení naší logiky
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});