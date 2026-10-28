import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env",
  );
}

/**
 * Returns the current Clerk session token, or null when signed out.
 * Set by <SupabaseAuthSync /> once Clerk has loaded.
 */
let getClerkToken: (() => Promise<string | null>) | null = null;

export function setSupabaseTokenGetter(
  getter: (() => Promise<string | null>) | null,
) {
  getClerkToken = getter;
}

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-anon-key",
  {
    // Sends the Clerk token with every request so RLS can read the user id
    accessToken: async () => (getClerkToken ? await getClerkToken() : null),
  },
);

/** Every Project 22 table starts with this prefix. */
export const PROJECT22_TABLE_PREFIX = "project22_";

export const project22Tables = {
  profiles: `${PROJECT22_TABLE_PREFIX}profiles`,
  plans: `${PROJECT22_TABLE_PREFIX}plans`,
  subscriptions: `${PROJECT22_TABLE_PREFIX}subscriptions`,
  dailyStats: `${PROJECT22_TABLE_PREFIX}daily_stats`,
  activity: `${PROJECT22_TABLE_PREFIX}activity`,
} as const;
