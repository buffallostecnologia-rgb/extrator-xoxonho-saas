import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente configuráveis na Vercel / local (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sua-instancia.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anonima-publica';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('sua-instancia')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
