import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mskrwsgljwbvgzfljplo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Safely create the client if key is provided, otherwise export null to support local-only/guest mode.
export const supabase = supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn(
    'VITE_SUPABASE_ANON_KEY is missing. Supabase integration is disabled, and the app will run in local-only / guest mode.'
  );
}
export default supabase;
