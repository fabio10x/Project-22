import { useEffect, useState } from "react";

import PricingCard, { type PricingPlan } from "@/components/PricingCard";
import Testimonials from "@/components/Testimonials";
import { cn } from "@/lib/utils";
import { project22Tables, supabase } from "@/lib/supabase";

const YEARLY_DISCOUNT = 0.25;

interface PlanPrices {
  monthly: number;
  yearly: number;
}

// Features are shown from this list. Prices come from Supabase when available.
const fallbackPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 19,
    features: [
      { label: "Commercial License", included: true },
      { label: "100+ HTML UI Elements", included: true },
      { label: "01 Domain Support", included: true },
      { label: "6 Month Premium Support", included: false },
      { label: "Lifetime Updates", included: false },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    monthlyPrice: 49,
    highlighted: true,
    features: [
      { label: "Commercial License", included: true },
      { label: "100+ HTML UI Elements", included: true },
      { label: "Unlimited Domain Support", included: true },
      { label: "6 Month Premium Support", included: true },
      { label: "Lifetime Updates", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 99,
    features: [
      { label: "Commercial License", included: true },
      { label: "100+ HTML UI Elements", included: true },
      { label: "Unlimited Domain Support", included: true },
      { label: "6 Month Premium Support", included: true },
      { label: "Lifetime Updates", included: true },
    ],
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [dbPrices, setDbPrices] = useState<Record<string, PlanPrices>>({});

  useEffect(() => {
    let cancelled = false;

    supabase
      .from(project22Tables.plans)
      .select("name, monthly_price, yearly_price")
      .eq("is_active", true)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const map: Record<string, PlanPrices> = {};
        for (const row of data) {
          map[row.name] = {
            monthly: row.monthly_price,
            yearly: row.yearly_price,
          };
        }
        setDbPrices(map);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Use Supabase prices when loaded, otherwise the built-in fallback prices
  const plans = fallbackPlans.map((plan) => {
    const fromDb = dbPrices[plan.name];
    return {
      ...plan,
      monthlyPrice: fromDb?.monthly ?? plan.monthlyPrice,
      yearlyPrice:
        fromDb?.yearly ??
        Math.round(plan.monthlyPrice * (1 - YEARLY_DISCOUNT)),
    };
  });

  return (
    <section className="w-full bg-[#ECF2F7] py-16 font-gilroy sm:py-24 lg:pb-[117px] lg:pt-[97px]">
      <div className="mx-auto flex w-full max-w-[1109px] flex-col items-center px-6 lg:px-6 xl:px-0">
        <div className="flex max-w-[589px] flex-col items-center gap-[17px] text-center">
          <h2 className="text-[28px] font-bold leading-9 tracking-[-1.2px] text-[#161C2D] sm:text-[36px] sm:leading-[48px]">
            Pricing &amp; Plans
          </h2>
          <p className="text-[17px] leading-[29px] tracking-[-0.2px] text-[#161C2D]/70 sm:text-[19px] sm:leading-8">
            With lots of unique blocks, you can easily build a page without
            coding. Build your next landing page.
          </p>
        </div>

        <div className="mt-[50px] flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[19px] leading-8 tracking-[-0.2px] text-[#161C2D]">
          <span>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            aria-label="Bill yearly"
            onClick={() => setYearly((value) => !value)}
            className={cn(
              "relative h-[33px] w-[72px] shrink-0 rounded-full transition-colors",
              yearly ? "bg-[#473BF0]" : "bg-[#161C2D]/15",
            )}
          >
            <span
              className={cn(
                "absolute left-[7px] top-[6px] h-[21px] w-[21px] rounded-full bg-white transition-transform",
                yearly && "translate-x-[37px]",
              )}
            />
          </button>
          <span>Yearly</span>
          <span className="inline-flex h-[29px] items-center rounded-full bg-[#473BF0]/10 px-[13px] text-[13px] font-bold uppercase leading-none tracking-[1.625px] text-[#473BF0]">
            Save {YEARLY_DISCOUNT * 100}%
          </span>
        </div>

        <div className="mt-[50px] grid w-full grid-cols-1 gap-[31px] sm:mx-auto sm:max-w-[349px] lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              price={yearly ? plan.yearlyPrice : plan.monthlyPrice}
              billedLabel={yearly ? "billed yearly" : "billed monthly"}
              interval={yearly ? "yearly" : "monthly"}
              isTrialPlan={plan.id === "starter"}
            />
          ))}
        </div>

        <div className="mt-16 w-full lg:mt-[107px]">
          <Testimonials />
        </div>
      </div>
    </section>
  );
}
