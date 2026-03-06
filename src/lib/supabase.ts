import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Client-side Supabase client (uses anon key, respects RLS)
export function getClientSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server-side Supabase client (uses service role key, bypasses RLS)
export function getServerSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase server credentials not configured");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && (supabaseServiceKey || supabaseAnonKey));
}
