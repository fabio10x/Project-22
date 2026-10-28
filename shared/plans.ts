/**
 * Canonical plan limits — imported by both client and server.
 * Keep this file pure (no Node or browser APIs).
 */

export type PlanId = "starter" | "standard" | "premium";

export interface PlanLimits {
  /** Maximum days of stats history the plan can see */
  maxStatsDays: 7 | 30 | 90;
  /** Maximum activity feed items returned (0 = feature locked) */
  maxActivityItems: 0 | 20 | 50;
  /** Whether the plan can export data */
  canExport: boolean;
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  starter:  { maxStatsDays: 7,  maxActivityItems: 0,  canExport: false },
  standard: { maxStatsDays: 30, maxActivityItems: 20, canExport: false },
  premium:  { maxStatsDays: 90, maxActivityItems: 50, canExport: true  },
};

export function getPlanLimits(planId: string): PlanLimits {
  return PLAN_LIMITS[(planId as PlanId)] ?? PLAN_LIMITS.starter;
}

/** The dashboard range selector values and the days each represents */
export const RANGE_DAYS = { "7d": 7, "30d": 30, "90d": 90 } as const;
export type DashboardRange = keyof typeof RANGE_DAYS;
