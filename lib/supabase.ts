import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (url?: string, key?: string) => {
  if (supabaseInstance) return supabaseInstance;
  
  const finalUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const finalKey = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (finalUrl && finalKey) {
    supabaseInstance = createClient(finalUrl, finalKey);
    return supabaseInstance;
  }
  return null;
};
