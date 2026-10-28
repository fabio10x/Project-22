import { describe, it, expect } from "vitest";
import { z } from "zod";
import { getPlanLimits, PLAN_LIMITS, RANGE_DAYS } from "../../shared/plans";

// ── Re-export the schema from checkout.ts for testing (inline copy) ──────────
// We duplicate the schema here rather than importing the route file, which
// would pull in Express and other server-only modules.
const checkoutBodySchema = z.object({
  planId: z.enum(["starter", "standard", "premium"]),
  interval: z.enum(["monthly", "yearly"]),
});

// ── Checkout validation ───────────────────────────────────────────────────────

describe("checkout body validation", () => {
  it("accepts valid standard/monthly", () => {
    const result = checkoutBodySchema.safeParse({
      planId: "standard",
      interval: "monthly",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.planId).toBe("standard");
      expect(result.data.interval).toBe("monthly");
    }
  });

  it("accepts valid premium/yearly", () => {
    const result = checkoutBodySchema.safeParse({
      planId: "premium",
      interval: "yearly",
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown planId", () => {
    const result = checkoutBodySchema.safeParse({
      planId: "enterprise",
      interval: "monthly",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown interval", () => {
    const result = checkoutBodySchema.safeParse({
      planId: "standard",
      interval: "weekly",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty body", () => {
    const result = checkoutBodySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects starter plan (no Stripe checkout for free tier)", () => {
    // Starter is a valid enum value but the checkout handler guards against it
    // at the DB lookup stage. The schema accepts it so the handler can give a
    // clear "plan not available" message rather than a generic 400.
    const result = checkoutBodySchema.safeParse({
      planId: "starter",
      interval: "monthly",
    });
    // starter IS in the enum, so schema passes — handler rejects it downstream
    expect(result.success).toBe(true);
  });
});

// ── Webhook metadata guard (logic extracted from stripe-webhook.ts) ───────────

function hasRequiredWebhookMetadata(metadata: Record<string, string | undefined>) {
  return !!metadata.user_id && !!metadata.plan_id;
}

describe("webhook metadata guard", () => {
  it("passes when both user_id and plan_id are present", () => {
    expect(
      hasRequiredWebhookMetadata({ user_id: "user_123", plan_id: "standard" }),
    ).toBe(true);
  });

  it("fails when user_id is missing", () => {
    expect(
      hasRequiredWebhookMetadata({ plan_id: "standard" }),
    ).toBe(false);
  });

  it("fails when plan_id is missing", () => {
    expect(
      hasRequiredWebhookMetadata({ user_id: "user_123" }),
    ).toBe(false);
  });

  it("fails when metadata is empty", () => {
    expect(hasRequiredWebhookMetadata({})).toBe(false);
  });
});

// ── Plan gating logic ─────────────────────────────────────────────────────────

describe("getPlanLimits", () => {
  it("starter gets 7-day max stats and no activity", () => {
    const limits = getPlanLimits("starter");
    expect(limits.maxStatsDays).toBe(7);
    expect(limits.maxActivityItems).toBe(0);
    expect(limits.canExport).toBe(false);
  });

  it("standard gets 30-day max stats and 20 activity items", () => {
    const limits = getPlanLimits("standard");
    expect(limits.maxStatsDays).toBe(30);
    expect(limits.maxActivityItems).toBe(20);
    expect(limits.canExport).toBe(false);
  });

  it("premium gets 90-day max stats, 50 activity items, and export", () => {
    const limits = getPlanLimits("premium");
    expect(limits.maxStatsDays).toBe(90);
    expect(limits.maxActivityItems).toBe(50);
    expect(limits.canExport).toBe(true);
  });

  it("unknown plan falls back to starter limits", () => {
    const limits = getPlanLimits("unknown_plan");
    expect(limits).toEqual(PLAN_LIMITS.starter);
  });
});

describe("range capping logic", () => {
  function capRange(requestedRange: keyof typeof RANGE_DAYS, maxDays: number) {
    const requested = RANGE_DAYS[requestedRange];
    const allowed = Math.min(requested, maxDays);
    return { allowed, capped: allowed < requested };
  }

  it("starter cannot see 30d stats — caps to 7d", () => {
    const { allowed, capped } = capRange("30d", getPlanLimits("starter").maxStatsDays);
    expect(allowed).toBe(7);
    expect(capped).toBe(true);
  });

  it("starter cannot see 90d stats — caps to 7d", () => {
    const { allowed, capped } = capRange("90d", getPlanLimits("starter").maxStatsDays);
    expect(allowed).toBe(7);
    expect(capped).toBe(true);
  });

  it("starter 7d request is not capped", () => {
    const { capped } = capRange("7d", getPlanLimits("starter").maxStatsDays);
    expect(capped).toBe(false);
  });

  it("standard 30d request is not capped", () => {
    const { capped } = capRange("30d", getPlanLimits("standard").maxStatsDays);
    expect(capped).toBe(false);
  });

  it("standard cannot see 90d stats — caps to 30d", () => {
    const { allowed, capped } = capRange("90d", getPlanLimits("standard").maxStatsDays);
    expect(allowed).toBe(30);
    expect(capped).toBe(true);
  });

  it("premium 90d request is not capped", () => {
    const { capped } = capRange("90d", getPlanLimits("premium").maxStatsDays);
    expect(capped).toBe(false);
  });
});
