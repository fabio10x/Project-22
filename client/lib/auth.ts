import { useAuth } from "@clerk/react";

/**
 * Where "Start a free trial" buttons should lead.
 * Signed-in users go straight to the dashboard, everyone else signs up first.
 */
export function useStartTrialPath() {
  const { isSignedIn } = useAuth();
  return isSignedIn ? "/dashboard" : "/sign-up";
}
