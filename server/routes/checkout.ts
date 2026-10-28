import { RequestHandler } from "express";
import { z } from "zod";
import { getClerkUserId } from "../lib/clerk-auth";
import { getSupabaseAdmin } from "../lib/supabase-admin";
import { APP_URL, stripe } from "../lib/stripe";

const bodySchema = z.object({
  planId: z.enum(["starter", "standard", "premium"]),
  interval: z.enum(["monthly", "yearly"]),
});

/** POST /api/checkout - creates a Stripe Checkout session for a paid plan. */
export const handleCreateCheckout: RequestHandler = async (req, res) => {
  // 1. The user must be signed in with Clerk
  const userId = await getClerkUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Sign in to upgrade." });
    return;
  }

  // 2. Validate the request body
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid plan or interval." });
    return;
  }
  const { planId, interval } = parsed.data;

  // 3. Look up the Stripe price for this plan
  const priceColumn =
    interval === "monthly" ? "stripe_price_id" : "stripe_yearly_price_id";
  const { data: plan, error: planError } = await getSupabaseAdmin()
    .from("project22_plans")
    .select(priceColumn)
    .eq("id", planId)
    .single();

  const priceId = plan?.[priceColumn as keyof typeof plan] as string | undefined;
  if (planError || !priceId) {
    res.status(500).json({ error: "This plan is not available yet." });
    return;
  }

  // 4. Create the subscription checkout. The Clerk user id travels in metadata
  //    so the webhook knows who paid.
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      metadata: { user_id: userId, plan_id: planId, interval },
      subscription_data: {
        metadata: { user_id: userId, plan_id: planId, interval },
      },
      success_url: `${APP_URL}/dashboard?checkout=success`,
      cancel_url: `${APP_URL}/pricing?checkout=cancelled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout failed:", err);
    res.status(500).json({ error: "Could not start checkout. Try again." });
  }
};
