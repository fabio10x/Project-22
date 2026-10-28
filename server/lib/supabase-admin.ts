import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client. The service role key bypasses RLS,
 * so this must never be imported from client code.
 */
export function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
