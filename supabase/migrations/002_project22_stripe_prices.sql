-- =====================================================================
-- Project 22 - Stripe price IDs for each plan
-- stripe_price_id          = monthly price ID (already exists)
-- stripe_yearly_price_id   = yearly price ID (new)
-- Run once in: Supabase Dashboard > SQL Editor > New query
-- =====================================================================

alter table public.project22_plans
  add column if not exists stripe_yearly_price_id text;
