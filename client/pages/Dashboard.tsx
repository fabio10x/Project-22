import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Lock,
  Menu,
  Settings,
  Users,
  X,
  TrendingUp,
  Activity,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase, project22Tables } from "@/lib/supabase";
import { PLAN_LIMITS, type DashboardRange, type PlanId } from "@shared/plans";
import { formatDistanceToNow, format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subscription {
  plan_id: string;
  status: string;
  billing_interval: string;
  current_period_end: string | null;
}

interface DailyStat {
  stat_date: string;
  visits: number;
  conversions: number;
}

interface ActivityItem {
  id: string;
  action: string;
  created_at: string;
}

interface DashboardData {
  plan: {
    id: PlanId;
    maxStatsDays: number;
    maxActivityItems: number;
    canExport: boolean;
  };
  range: {
    requested: DashboardRange;
    allowed: DashboardRange;
    capped: boolean;
  };
  stats: DailyStat[];
  activity: ActivityItem[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bucketStats(rows: DailyStat[], buckets: number) {
  if (!rows.length) return [];
  const size = Math.max(1, Math.ceil(rows.length / buckets));
  const result: { label: string; visits: number }[] = [];
  for (let i = 0; i < rows.length; i += size) {
    const slice = rows.slice(i, i + size);
    const label =
      slice.length === 1
        ? format(new Date(slice[0].stat_date), "MMM d")
        : `${format(new Date(slice[0].stat_date), "MMM d")}–${format(new Date(slice[slice.length - 1].stat_date), "d")}`;
    result.push({ label, visits: slice.reduce((s, r) => s + r.visits, 0) });
  }
  return result;
}

function pct(a: number, b: number) {
  if (!b) return null;
  const d = ((a - b) / b) * 100;
  return { value: Math.abs(d).toFixed(1), up: d >= 0 };
}

const planLabel: Record<string, string> = {
  starter: "Starter",
  standard: "Standard",
  premium: "Premium",
};
const planColor: Record<string, string> = {
  starter: "bg-gray-100 text-gray-600",
  standard: "bg-[#473BF0]/10 text-[#473BF0]",
  premium: "bg-amber-50 text-amber-600",
};
const statusColor: Record<string, string> = {
  trialing: "bg-blue-50 text-blue-600",
  active: "bg-green-50 text-green-700",
  past_due: "bg-orange-50 text-orange-600",
  canceled: "bg-red-50 text-red-600",
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Analytics", icon: BarChart3 },
  { label: "Customers", icon: Users },
  { label: "Settings", icon: Settings },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("animate-pulse rounded bg-[#ECF2F7]", className)} style={style} />
  );
}

// ─── Upgrade lock overlay ─────────────────────────────────────────────────────

function UpgradeLock({ requiredPlan }: { requiredPlan: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[10px] bg-white/80 backdrop-blur-[2px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#473BF0]/10">
        <Lock size={18} className="text-[#473BF0]" aria-hidden="true" />
      </div>
      <p className="text-[14px] font-bold text-navy">
        {planLabel[requiredPlan] ?? requiredPlan} plan required
      </p>
      <Link
        to="/pricing"
        className="rounded-lg bg-[#473BF0] px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
      >
        Upgrade →
      </Link>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { userId, getToken } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [range, setRange] = useState<DashboardRange>("7d");
  const [notifications, setNotifications] = useState(3);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  // ── Subscription (direct Supabase – RLS-gated, no plan limits needed) ──────
  const { data: subscription, isLoading: subLoading } = useQuery<Subscription | null>({
    queryKey: ["subscription", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from(project22Tables.subscriptions)
        .select("plan_id, status, billing_interval, current_period_end")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      return data ?? null;
    },
  });

  // ── Dashboard data (server-gated) ──────────────────────────────────────────
  const { data: dashData, isLoading: dashLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard", userId, range],
    enabled: !!userId,
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`/api/dashboard?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not load dashboard data.");
      return res.json();
    },
  });

  // ── Derived values ─────────────────────────────────────────────────────────

  const stats = dashData?.stats ?? [];
  const activity = dashData?.activity ?? [];
  const planId = (dashData?.plan.id ?? subscription?.plan_id ?? "starter") as PlanId;
  const planLimits = PLAN_LIMITS[planId] ?? PLAN_LIMITS.starter;
  const rangeCapped = dashData?.range.capped ?? false;

  const half = Math.floor(stats.length / 2);
  const currentPeriod = stats.slice(half);
  const priorPeriod = stats.slice(0, half);

  const totalVisits = currentPeriod.reduce((s, r) => s + r.visits, 0);
  const totalConversions = currentPeriod.reduce((s, r) => s + r.conversions, 0);
  const priorVisits = priorPeriod.reduce((s, r) => s + r.visits, 0);
  const priorConversions = priorPeriod.reduce((s, r) => s + r.conversions, 0);
  const convRate = totalVisits > 0 ? ((totalConversions / totalVisits) * 100).toFixed(1) : "—";
  const priorConvRate = priorVisits > 0 ? (priorConversions / priorVisits) * 100 : 0;

  const visitsPct = pct(totalVisits, priorVisits);
  const convPct = pct(totalConversions, priorConversions);
  const convRatePct = pct(parseFloat(convRate) || 0, priorConvRate);

  const chartData = bucketStats(stats, 7);
  const maxVisit = Math.max(...chartData.map((d) => d.visits), 1);

  // Range tabs – mark which are above the user's plan
  const rangeDays = { "7d": 7, "30d": 30, "90d": 90 } as const;
  function isRangeLocked(r: DashboardRange) {
    return rangeDays[r] > planLimits.maxStatsDays;
  }
  function rangeUpgradeTarget(r: DashboardRange): string {
    if (rangeDays[r] <= 7) return "";
    if (rangeDays[r] <= 30) return "standard";
    return "premium";
  }

  // ── Manage billing ─────────────────────────────────────────────────────────

  async function handleManageBilling() {
    setPortalError(null);
    setPortalLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Could not open portal.");
      window.location.href = data.url;
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : "Something went wrong.");
      setPortalLoading(false);
    }
  }

  // ── Stat cards ─────────────────────────────────────────────────────────────

  const statCards = [
    { label: "Total visits",      value: dashLoading ? null : totalVisits.toLocaleString(),                  pct: visitsPct,    icon: TrendingUp },
    { label: "Conversions",       value: dashLoading ? null : totalConversions.toLocaleString(),             pct: convPct,      icon: ArrowUpRight },
    { label: "Conversion rate",   value: dashLoading ? null : convRate === "—" ? "—" : `${convRate}%`,      pct: convRatePct,  icon: Activity },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-[calc(100vh-72px)] bg-[#ECF2F7] font-gilroy text-navy">
      {sidebarOpen && (
        <button type="button" aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-navy/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy px-5 pb-6 pt-[88px] text-white transition-transform lg:sticky lg:top-0 lg:z-0 lg:h-[calc(100vh-72px)] lg:translate-x-0 lg:pt-8",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        <button type="button" aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="absolute right-4 top-4 text-white lg:hidden">
          <X size={22} />
        </button>

        {/* Plan badge */}
        {!subLoading && subscription && (
          <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              Current plan
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <Sparkles size={14} className="text-[#473BF0]" aria-hidden="true" />
              <span className="text-[15px] font-bold text-white">
                {planLabel[subscription.plan_id] ?? subscription.plan_id}
              </span>
              <span className={cn(
                "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold capitalize",
                statusColor[subscription.status] ?? "bg-white/10 text-white",
              )}>
                {subscription.status}
              </span>
            </div>
            {subscription.current_period_end && (
              <p className="mt-1 text-[11px] text-white/40">
                Renews {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
              </p>
            )}
          </div>
        )}
        {subLoading && <Skeleton className="mb-6 h-[76px] bg-white/10" />}

        <nav aria-label="Dashboard">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <li key={item.label}>
                  <button type="button"
                    onClick={() => { setActiveNav(item.label); setSidebarOpen(false); }}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[15px] transition-colors",
                      isActive ? "bg-[#473BF0] text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}>
                    <Icon size={18} aria-hidden="true" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link to="/" className="mt-auto rounded-lg px-4 py-3 text-[15px] text-white/70 transition-colors hover:bg-white/10 hover:text-white">
          Back to website
        </Link>
      </aside>

      {/* ── Main ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-[#E7E9ED] bg-white px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-navy hover:bg-navy/5 lg:hidden">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-[22px] font-bold tracking-[-0.6px] sm:text-[26px]">{activeNav}</h1>
              <p className="text-[14px] text-navy/60">Welcome back, here is your summary.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <button type="button" id="manage-billing-btn"
                onClick={handleManageBilling} disabled={portalLoading}
                className="flex items-center gap-2 rounded-lg border border-[#E7E9ED] bg-white px-4 py-2 text-[13px] font-bold text-[#473BF0] transition-colors hover:bg-[#473BF0]/5 disabled:cursor-not-allowed disabled:opacity-60">
                <CreditCard size={15} aria-hidden="true" />
                {portalLoading ? "Opening…" : "Manage billing"}
              </button>
              {portalError && (
                <p role="alert" className="mt-1 text-[12px] text-[#E5484D]">{portalError}</p>
              )}
            </div>
            <button type="button" aria-label={`Notifications (${notifications} unread)`}
              onClick={() => setNotifications(0)}
              className="relative rounded-lg p-2 text-navy hover:bg-navy/5">
              <Bell size={22} />
              {notifications > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#473BF0] px-1 text-[10px] font-bold text-white">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="flex flex-col gap-6 p-4 sm:p-8">

          {/* Starter upgrade banner */}
          {!subLoading && subscription?.status === "trialing" && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#473BF0]/20 bg-[#473BF0]/5 px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#473BF0]" aria-hidden="true" />
                <p className="text-[14px] font-bold text-[#473BF0]">You're on the free Starter plan.</p>
                <p className="hidden text-[14px] text-[#473BF0]/70 sm:block">Upgrade to unlock analytics and more.</p>
              </div>
              <Link to="/pricing"
                className="rounded-lg bg-[#473BF0] px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90">
                See plans →
              </Link>
            </div>
          )}

          {/* Stat cards */}
          <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <article key={stat.label}
                  className="rounded-[10px] border border-[#E7E9ED] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] text-navy/60">{stat.label}</p>
                    <Icon size={16} className="text-navy/30" aria-hidden="true" />
                  </div>
                  {stat.value === null ? (
                    <Skeleton className="mt-3 h-8 w-24" />
                  ) : (
                    <p className="mt-2 text-[28px] font-bold tracking-[-1px]">{stat.value}</p>
                  )}
                  {stat.value !== null && stat.pct ? (
                    <p className={cn("mt-2 inline-flex items-center gap-1 text-[13px] font-bold",
                      stat.pct.up ? "text-mint" : "text-[#E5484D]")}>
                      {stat.pct.up
                        ? <ArrowUpRight size={14} aria-hidden="true" />
                        : <ArrowDownRight size={14} aria-hidden="true" />}
                      {stat.pct.value}%
                      <span className="font-normal text-navy/50">vs prior period</span>
                    </p>
                  ) : (
                    stat.value !== null && (
                      <p className="mt-2 text-[13px] text-navy/40">No prior data yet</p>
                    )
                  )}
                </article>
              );
            })}
          </section>

          {/* Chart + activity */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Bar chart */}
            <section className="relative rounded-[10px] border border-[#E7E9ED] bg-white p-5 xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-bold tracking-[-0.4px]">Visits overview</h2>
                  {rangeCapped && (
                    <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[#473BF0]">
                      <Lock size={11} aria-hidden="true" />
                      Showing {dashData?.range.allowed} — upgrade for more history
                    </p>
                  )}
                </div>
                <div role="group" aria-label="Date range"
                  className="flex gap-1 rounded-lg bg-[#ECF2F7] p-1">
                  {(["7d", "30d", "90d"] as const).map((r) => {
                    const locked = isRangeLocked(r);
                    return (
                      <button key={r} type="button"
                        aria-pressed={range === r}
                        onClick={() => setRange(r)}
                        title={locked ? `Upgrade to ${planLabel[rangeUpgradeTarget(r)]} for ${r}` : undefined}
                        className={cn(
                          "flex items-center gap-1 rounded-md px-3 py-1 text-[13px] font-bold transition-colors",
                          range === r ? "bg-white text-[#473BF0] shadow-sm"
                            : locked ? "cursor-pointer text-navy/30 hover:text-navy/50"
                              : "text-navy/60 hover:text-navy",
                        )}>
                        {locked && <Lock size={10} aria-hidden="true" />}
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {dashLoading ? (
                <div className="mt-8 flex h-56 items-end gap-3">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
                      <Skeleton className="w-full rounded-t-md" style={{ height: `${35 + (i * 8) % 55}%` }} />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  ))}
                </div>
              ) : chartData.length === 0 ? (
                <div className="mt-8 flex h-56 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#E7E9ED]">
                  <BarChart3 size={32} className="text-navy/20" aria-hidden="true" />
                  <p className="text-[15px] font-bold text-navy/40">No visit data yet</p>
                  <p className="text-[13px] text-navy/30">Stats appear once visitors start arriving.</p>
                </div>
              ) : (
                <div className="mt-8 flex h-56 items-end gap-2 sm:gap-3">
                  {chartData.map((d) => (
                    <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <div title={`${d.visits.toLocaleString()} visits`}
                        className="w-full rounded-t-md bg-[#473BF0]/80 transition-all hover:bg-[#473BF0]"
                        style={{ height: `${(d.visits / maxVisit) * 100}%` }} />
                      <span className="max-w-full truncate text-[11px] text-navy/60">{d.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Activity feed */}
            <section className="relative rounded-[10px] border border-[#E7E9ED] bg-white p-5">
              <h2 className="text-[18px] font-bold tracking-[-0.4px]">Recent activity</h2>

              {/* Locked for starter */}
              {!dashLoading && planLimits.maxActivityItems === 0 && (
                <UpgradeLock requiredPlan="standard" />
              )}

              {dashLoading ? (
                <ul className="mt-4 flex flex-col divide-y divide-[#E7E9ED]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="flex flex-col gap-2 py-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </li>
                  ))}
                </ul>
              ) : activity.length === 0 && planLimits.maxActivityItems > 0 ? (
                <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
                  <Activity size={28} className="text-navy/20" aria-hidden="true" />
                  <p className="text-[14px] font-bold text-navy/40">No activity yet</p>
                  <p className="text-[12px] text-navy/30">Actions you take will appear here.</p>
                </div>
              ) : (
                <ul className="mt-4 flex flex-col divide-y divide-[#E7E9ED]">
                  {activity.map((item) => (
                    <li key={item.id} className="flex flex-col gap-1 py-3">
                      <p className="text-[14px] font-bold leading-snug text-navy">{item.action}</p>
                      <p className="text-[12px] text-navy/50">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Subscription detail */}
          {!subLoading && subscription && (
            <section className="rounded-[10px] border border-[#E7E9ED] bg-white p-5">
              <h2 className="text-[18px] font-bold tracking-[-0.4px]">Subscription</h2>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className={cn("rounded-full px-3 py-1 text-[13px] font-bold capitalize",
                  planColor[subscription.plan_id] ?? "bg-gray-100 text-gray-600")}>
                  {planLabel[subscription.plan_id] ?? subscription.plan_id} plan
                </span>
                <span className={cn("rounded-full px-3 py-1 text-[13px] font-bold capitalize",
                  statusColor[subscription.status] ?? "bg-gray-100 text-gray-600")}>
                  {subscription.status}
                </span>
                {subscription.billing_interval && subscription.status === "active" && (
                  <span className="text-[13px] capitalize text-navy/50">
                    Billed {subscription.billing_interval}
                  </span>
                )}
                {subscription.current_period_end && (
                  <span className="text-[13px] text-navy/50">
                    {subscription.status === "canceled" ? "Ends" : "Renews"}{" "}
                    {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}
                  </span>
                )}
                <button type="button" onClick={handleManageBilling} disabled={portalLoading}
                  className="ml-auto flex items-center gap-1.5 text-[13px] font-bold text-[#473BF0] hover:underline disabled:opacity-60">
                  <CreditCard size={13} aria-hidden="true" />
                  {portalLoading ? "Opening…" : "Manage billing"}
                </button>
              </div>
            </section>
          )}
          {subLoading && <Skeleton className="h-[88px] rounded-[10px]" />}
        </main>
      </div>
    </div>
  );
}
