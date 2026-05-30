import { createClient } from "@supabase/supabase-js";

const fallbackSupabaseUrl = "https://gkiedbiaahhuzhwjoshx.supabase.co";
const fallbackSupabaseAnonKey = "sb_publishable_m8ISAlNdWLirjC4g_FbdAA_rzmK6Lrq";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || fallbackSupabaseUrl;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || fallbackSupabaseAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase env vars were not found at build time; using bundled public Supabase fallback.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});