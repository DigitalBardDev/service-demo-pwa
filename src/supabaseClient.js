// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Fallback to a dummy URL so the build doesn't crash on Vercel without environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const isPlaceholder = supabaseUrl.includes('placeholder');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
