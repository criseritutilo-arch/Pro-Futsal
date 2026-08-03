import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (url?: string, key?: string) => {
  if (supabaseInstance) return supabaseInstance;
  
  const finalUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nhqtsrxvugsumsthciaq.supabase.co';
  const finalKey = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_JMBayuwGJRQ_phrkdCX4MA_DJpP_YCo';
  
  if (finalUrl && finalKey) {
    supabaseInstance = createClient(finalUrl, finalKey);
    return supabaseInstance;
  }
  return null;
};
