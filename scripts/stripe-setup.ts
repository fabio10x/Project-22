/**
 * One-time setup: creates the Stripe products and prices for each plan,
 * then saves the price IDs to the project22_plans table.
 *
 * Safe to re-run. Products and prices are matched by metadata / lookup_key,
 * so nothing is duplicated.
 *
 * Usage: pnpm tsx scripts/stripe-setup.ts
 */
import "dotenv/config";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!stripeKey || !supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY, VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
  );
}

const stripe = new Stripe(stripeKey);
// Server-only client: the service role bypasses RLS, so never ship it to the browser.
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const PLANS = [
  { id: "starter", name: "Starter", monthly: 19, yearly: 14 },
  { id: "standard", name: "Standard", monthly: 49, yearly: 37 },
  { id: "premium", name: "Premium", monthly: 99, yearly: 74 },
] as const;

async function getOrCreateProduct(planId: string, name: string) {
  const existing = await stripe.products.search({
    query: `metadata['project22_plan_id']:'${planId}' AND active:'true'`,
  });
  if (existing.data[0]) return existing.data[0];

  return stripe.products.create({
    name: `Brainwave.io ${name}`,
    metadata: { project22_plan_id: planId },
  });
}

async function getOrCreatePrice(options: {
  productId: string;
  lookupKey: string;
  unitAmountUsd: number;
  interval: "month" | "year";
}) {
  const existing = await stripe.prices.list({
    lookup_keys: [options.lookupKey],
    limit: 1,
  });
  if (existing.data[0]) return existing.data[0];

  return stripe.prices.create({
    product: options.productId,
    currency: "usd",
    unit_amount: options.unitAmountUsd * 100,
    recurring: { interval: options.interval },
    lookup_key: options.lookupKey,
    transfer_lookup_key: false,
  });
}

async function main() {
  for (const plan of PLANS) {
    const product = await getOrCreateProduct(plan.id, plan.name);

    // Monthly: charged every month
    const monthly = await getOrCreatePrice({
      productId: product.id,
      lookupKey: `project22_${plan.id}_monthly`,
      unitAmountUsd: plan.monthly,
      interval: "month",
    });

    // Yearly: the yearly_price in the table is per month, so charge 12x that once a year
    const yearly = await getOrCreatePrice({
      productId: product.id,
      lookupKey: `project22_${plan.id}_yearly`,
      unitAmountUsd: plan.yearly * 12,
      interval: "year",
    });

    const { error } = await supabase
      .from("project22_plans")
      .update({
        stripe_price_id: monthly.id,
        stripe_yearly_price_id: yearly.id,
      })
      .eq("id", plan.id);

    if (error) throw new Error(`Supabase update failed for ${plan.id}: ${error.message}`);

    console.log(
      `${plan.name}: product ${product.id}, monthly ${monthly.id}, yearly ${yearly.id}`,
    );
  }

  console.log("Done. Plans saved to project22_plans.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
