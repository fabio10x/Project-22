import { RequestHandler } from "express";
import { getClerkUserId } from "../lib/clerk-auth";
import { getSupabaseAdmin } from "../lib/supabase-admin";

/**
 * POST /api/subscription/init
 *
 * Called once after a user signs in to ensure they have at least a starter
 * subscription row. Safe to call repeatedly – it is a no-op if a row already
 * exists. Uses the service role so RLS is bypassed.
 */
export const handleSubscriptionInit: RequestHandler = async (req, res) => {
  const userId = await getClerkUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const supabase = getSupabaseAdmin();

  // Return early if the user already has any subscription row
  const { data: existing } = await supabase
    .from("project22_subscriptions")
    .select("plan_id, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existing) {
    res.json({ plan_id: existing.plan_id, status: existing.status });
    return;
  }

  // First-time user: create a starter (free trial) row
  const { error } = await supabase.from("project22_subscriptions").insert({
    user_id: userId,
    plan_id: "starter",
    status: "trialing",
    billing_interval: "monthly",
  });

  if (error) {
    console.error("Could not create starter subscription:", error.message);
    res.status(500).json({ error: "Could not initialise subscription." });
    return;
  }

  res.json({ plan_id: "starter", status: "trialing" });
};
