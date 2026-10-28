import { RequestHandler } from "express";
import { getClerkUserId } from "../lib/clerk-auth";
import { getSupabaseAdmin } from "../lib/supabase-admin";
import { APP_URL, stripe } from "../lib/stripe";

/**
 * POST /api/portal
 *
 * Creates a Stripe Billing Portal session for the signed-in user so they can
 * change or cancel their plan without leaving the app. Returns { url }.
 *
 * Requires the user to have a stripe_customer_id in project22_subscriptions.
 */
export const handleCreatePortal: RequestHandler = async (req, res) => {
  const userId = await getClerkUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Sign in to manage billing." });
    return;
  }

  // Look up the Stripe customer id from the most recent active subscription
  const { data: sub } = await getSupabaseAdmin()
    .from("project22_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .not("stripe_customer_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!sub?.stripe_customer_id) {
    res.status(404).json({
      error: "No billing account found. Complete a purchase first.",
    });
    return;
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${APP_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Billing portal failed:", err);
    res.status(500).json({ error: "Could not open the billing portal. Try again." });
  }
};
