import { RequestHandler } from "express";
import { z } from "zod";
import { getClerkUserId } from "../lib/clerk-auth";
import { getSupabaseAdmin } from "../lib/supabase-admin";
import { getUserPlanLimits } from "../lib/plan-gate";
import { RANGE_DAYS, type DashboardRange } from "../../shared/plans";

const querySchema = z.object({
  range: z.enum(["7d", "30d", "90d"]).default("7d"),
});

/**
 * GET /api/dashboard?range=7d|30d|90d
 *
 * Returns stats and activity for the signed-in user, capped by their plan limits.
 * All gating is enforced here — the client just renders what it receives.
 */
export const handleDashboard: RequestHandler = async (req, res) => {
  const userId = await getClerkUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = querySchema.safeParse(req.query);
  const range: DashboardRange = parsed.success ? parsed.data.range : "7d";

  // Resolve this user's plan and its limits
  const limits = await getUserPlanLimits(userId);

  // Cap the requested range to whatever their plan allows
  const requestedDays = RANGE_DAYS[range];
  const allowedDays = Math.min(requestedDays, limits.maxStatsDays);
  const isRangeCapped = allowedDays < requestedDays;

  const fromDate = new Date(Date.now() - allowedDays * 86_400_000)
    .toISOString()
    .split("T")[0];

  const supabase = getSupabaseAdmin();

  // Fetch stats for the allowed period
  const { data: stats, error: statsError } = await supabase
    .from("project22_daily_stats")
    .select("stat_date, visits, conversions")
    .eq("user_id", userId)
    .gte("stat_date", fromDate)
    .order("stat_date", { ascending: true });

  if (statsError) {
    console.error("Dashboard stats error:", statsError.message);
    res.status(500).json({ error: "Could not load stats." });
    return;
  }

  // Fetch activity — only if the plan allows it
  let activity: { id: string; action: string; created_at: string }[] = [];
  if (limits.maxActivityItems > 0) {
    const { data } = await supabase
      .from("project22_activity")
      .select("id, action, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limits.maxActivityItems);
    activity = data ?? [];
  }

  res.json({
    plan: {
      id: limits.planId,
      maxStatsDays: limits.maxStatsDays,
      maxActivityItems: limits.maxActivityItems,
      canExport: limits.canExport,
    },
    range: {
      requested: range,
      allowed: `${allowedDays}d` as DashboardRange,
      capped: isRangeCapped,
    },
    stats: stats ?? [],
    activity,
  });
};
