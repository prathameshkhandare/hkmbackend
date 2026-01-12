
import { createClient } from '@supabase/supabase-js';

// Helper to get Supabase client using Worker environment variables
export const getSupabase = (env: any) => {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Missing Supabase keys. Available keys:", Object.keys(env).filter(k => k.includes('SUPABASE')));
    throw new Error('Supabase configuration missing');
  }
  return createClient(url, key);
};
