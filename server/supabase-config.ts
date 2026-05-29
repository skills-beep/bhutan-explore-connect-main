import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for backend

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
