-- =====================================================================
-- Project 22 - database schema
-- Every table is prefixed with "project22_" so it never mixes with
-- the other projects in the same Supabase database.
-- Run this whole file once in: Supabase Dashboard > SQL Editor > New query
-- =====================================================================

-- ---------- Tables ----------

-- One row per signed-in user (user_id = Clerk user id, e.g. "user_2abc...")
create table if not exists public.project22_profiles (
  user_id      text primary key,
  email        text,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Pricing plans shown on the Pricing page
create table if not exists public.project22_plans (
  id              text primary key,            -- "starter", "standard", "premium"
  name            text not null,
  monthly_price   integer not null,            -- in USD
  yearly_price    integer not null,            -- in USD per month, billed yearly
  stripe_price_id text,                        -- filled in during the Stripe step
  sort_order      integer not null default 0,
  is_active       boolean not null default true
);

-- A user's current subscription (written by the Stripe webhook later)
create table if not exists public.project22_subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                text not null references public.project22_profiles(user_id) on delete cascade,
  plan_id                text not null references public.project22_plans(id),
  status                 text not null default 'trialing',  -- trialing | active | past_due | canceled
  billing_interval       text not null default 'monthly',   -- monthly | yearly
  stripe_customer_id     text,
  stripe_subscription_id text unique,
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Daily visit/conversion numbers for the dashboard chart
create table if not exists public.project22_daily_stats (
  user_id      text not null references public.project22_profiles(user_id) on delete cascade,
  stat_date    date not null,
  visits       integer not null default 0,
  conversions  integer not null default 0,
  primary key (user_id, stat_date)
);

-- Recent activity feed for the dashboard
create table if not exists public.project22_activity (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null references public.project22_profiles(user_id) on delete cascade,
  action      text not null,                   -- e.g. "Started a free trial"
  created_at  timestamptz not null default now()
);

create index if not exists project22_subscriptions_user_idx on public.project22_subscriptions (user_id);
create index if not exists project22_activity_user_idx on public.project22_activity (user_id, created_at desc);

-- ---------- Keep updated_at fresh ----------

create or replace function public.project22_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists project22_profiles_updated_at on public.project22_profiles;
create trigger project22_profiles_updated_at
  before update on public.project22_profiles
  for each row execute function public.project22_set_updated_at();

drop trigger if exists project22_subscriptions_updated_at on public.project22_subscriptions;
create trigger project22_subscriptions_updated_at
  before update on public.project22_subscriptions
  for each row execute function public.project22_set_updated_at();

-- ---------- Row Level Security ----------
-- Users can only read/write their own rows. The Clerk user id is read from
-- the JWT "sub" claim (this works once Clerk is connected to Supabase in step 2).
-- Writes to subscriptions are done only with the service role (Stripe webhook).

alter table public.project22_profiles      enable row level security;
alter table public.project22_plans         enable row level security;
alter table public.project22_subscriptions enable row level security;
alter table public.project22_daily_stats   enable row level security;
alter table public.project22_activity      enable row level security;

-- Plans are public (pricing page)
drop policy if exists "project22 plans are readable" on public.project22_plans;
create policy "project22 plans are readable"
  on public.project22_plans for select
  to anon, authenticated
  using (is_active);

-- Profiles
drop policy if exists "project22 own profile select" on public.project22_profiles;
create policy "project22 own profile select"
  on public.project22_profiles for select
  to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);

drop policy if exists "project22 own profile insert" on public.project22_profiles;
create policy "project22 own profile insert"
  on public.project22_profiles for insert
  to authenticated
  with check ((select auth.jwt() ->> 'sub') = user_id);

drop policy if exists "project22 own profile update" on public.project22_profiles;
create policy "project22 own profile update"
  on public.project22_profiles for update
  to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);

-- Subscriptions (read only for the user; writes come from the server)
drop policy if exists "project22 own subscriptions select" on public.project22_subscriptions;
create policy "project22 own subscriptions select"
  on public.project22_subscriptions for select
  to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);

-- Daily stats
drop policy if exists "project22 own stats select" on public.project22_daily_stats;
create policy "project22 own stats select"
  on public.project22_daily_stats for select
  to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);

-- Activity
drop policy if exists "project22 own activity select" on public.project22_activity;
create policy "project22 own activity select"
  on public.project22_activity for select
  to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);

drop policy if exists "project22 own activity insert" on public.project22_activity;
create policy "project22 own activity insert"
  on public.project22_activity for insert
  to authenticated
  with check ((select auth.jwt() ->> 'sub') = user_id);

-- ---------- Seed data ----------

insert into public.project22_plans (id, name, monthly_price, yearly_price, sort_order) values
  ('starter',  'Starter',  19, 14, 1),
  ('standard', 'Standard', 49, 37, 2),
  ('premium',  'Premium',  99, 74, 3)
on conflict (id) do nothing;
