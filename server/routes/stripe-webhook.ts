import { RequestHandler } from "express";
import type Stripe from "stripe";
import { getSupabaseAdmin } from "../lib/supabase-admin";
import { stripe } from "../lib/stripe";

/**
 * POST /api/stripe/webhook
 * Stripe calls this when a subscription is created, changed or cancelled.
 * It must receive the raw request body so the signature can be checked.
 */
export const handleStripeWebhook: RequestHandler = async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers["stripe-signature"];
  if (!secret || typeof signature !== "string") {
    res.status(400).send("Missing webhook secret or signature");
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, secret);
  } catch {
    res.status(400).send("Invalid signature");
    return;
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await saveSubscription(event.data.object as Stripe.Subscription, event.type);
        break;

      case "invoice.payment_failed": {
        // Card declined or expired — mark the subscription past_due so plan
        // gating immediately restricts access until the customer updates their card.
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : (invoice.customer as Stripe.Customer)?.id;
        if (customerId) {
          await markPastDue(customerId);
        }
        break;
      }

      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handling failed:", err);
    res.status(500).send("Webhook handler failed");
  }
};

async function saveSubscription(sub: Stripe.Subscription, eventType: string) {
  const userId = sub.metadata.user_id;
  const planId = sub.metadata.plan_id;
  const interval = sub.metadata.interval === "yearly" ? "yearly" : "monthly";
  if (!userId || !planId) {
    console.warn("Subscription has no user/plan metadata, skipping", sub.id);
    return;
  }

  const status = eventType === "customer.subscription.deleted" ? "canceled" : sub.status;
  const periodEnd = sub.items.data[0]?.current_period_end;

  const { error } = await getSupabaseAdmin()
    .from("project22_subscriptions")
    .upsert(
      {
        user_id: userId,
        plan_id: planId,
        status,
        billing_interval: interval,
        stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
        stripe_subscription_id: sub.id,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      },
      { onConflict: "stripe_subscription_id" },
    );

  if (error) throw new Error(error.message);
}

/**
 * Called when invoice.payment_failed fires.
 * Sets the customer's subscription status to past_due so the plan-gate
 * immediately restricts them to starter limits until they update their card.
 */
async function markPastDue(stripeCustomerId: string) {
  const { error } = await getSupabaseAdmin()
    .from("project22_subscriptions")
    .update({ status: "past_due" })
    .eq("stripe_customer_id", stripeCustomerId)
    .in("status", ["active", "trialing"]); // only downgrade currently-active subs

  if (error) throw new Error(error.message);
}
