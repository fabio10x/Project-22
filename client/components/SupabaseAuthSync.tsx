import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/react";
import { project22Tables, setSupabaseTokenGetter, supabase } from "@/lib/supabase";

/**
 * Keeps Supabase in step with Clerk:
 * - gives the Supabase client a way to get the Clerk token
 * - creates a project22_profiles row the first time a user signs in
 * - ensures a starter subscription row exists (via server so service role is used)
 */
export default function SupabaseAuthSync() {
  const { isLoaded, isSignedIn, getToken, userId } = useAuth();
  const { user } = useUser();

  // Hand the Clerk token getter to the Supabase client
  useEffect(() => {
    setSupabaseTokenGetter(() => getToken({ template: "supabase" }));
    return () => setSupabaseTokenGetter(null);
  }, [getToken]);

  // Create or update the profile row, then ensure a subscription row exists
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId || !user) return;

    const email = user.primaryEmailAddress?.emailAddress ?? null;
    const fullName = user.fullName ?? null;
    const avatarUrl = user.imageUrl ?? null;

    supabase
      .from(project22Tables.profiles)
      .upsert(
        { user_id: userId, email, full_name: fullName, avatar_url: avatarUrl },
        { onConflict: "user_id" },
      )
      .then(async ({ error }) => {
        if (error) {
          console.error("Could not sync profile:", error.message);
          return;
        }
        // Ensure a starter subscription row exists for this user.
        // Uses the server so we can write with the service role (RLS bypass).
        const token = await getToken();
        fetch("/api/subscription/init", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch((err) =>
          console.error("Could not init subscription:", err),
        );
      });
  }, [isLoaded, isSignedIn, userId, user, getToken]);

  return null;
}

