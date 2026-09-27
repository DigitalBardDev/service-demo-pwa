// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// These pull from a hidden .env.local file that you will create for each client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isPlaceholder = supabaseUrl.includes('placeholder-template-url');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
