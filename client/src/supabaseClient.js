import { createClient } from '@supabase/supabase-js';

// Načtení klíčů z .env souboru
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Kontrola, zda se klíče správně načetly (dobré pro hledání chyb)
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Chybí Supabase klíče! Zkontroluj soubor .env ve složce client.");
}

// Vytvoření a exportování Supabase klienta
export const supabase = createClient(supabaseUrl, supabaseAnonKey);