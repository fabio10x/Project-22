import { getSupabaseAdmin } from "./supabase-admin";
import { getPlanLimits, type PlanId, type PlanLimits } from "../../shared/plans";

/**
 * Looks up the user's most recent active/trialing subscription in Supabase
 * and returns the corresponding plan limits. Falls back to starter if no
 * active subscription is found or if the subscription is canceled.
 */
export async function getUserPlanLimits(
  userId: string,
): Promise<{ planId: PlanId } & PlanLimits> {
  const { data } = await getSupabaseAdmin()
    .from("project22_subscriptions")
    .select("plan_id, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const isActive =
    data?.status === "active" || data?.status === "trialing";
  const planId: PlanId = isActive
    ? ((data?.plan_id as PlanId) ?? "starter")
    : "starter";

  return { planId, ...getPlanLimits(planId) };
}
