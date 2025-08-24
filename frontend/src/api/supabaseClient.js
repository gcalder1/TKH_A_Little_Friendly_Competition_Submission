// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  "https://ejvmoeebazywkoangxtw.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
