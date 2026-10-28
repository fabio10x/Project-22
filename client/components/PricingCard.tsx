import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { cn } from "@/lib/utils";
import { useStartTrialPath } from "@/lib/auth";

export interface PricingFeature {
  label: string;
  included: boolean;
}

export interface PricingPlan {
  id: "starter" | "standard" | "premium";
  name: string;
  monthlyPrice: number;
  features: PricingFeature[];
  highlighted?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  price: number;
  billedLabel: string;
  interval: "monthly" | "yearly";
  /** Starter is the free trial link; Standard and Premium start Stripe Checkout. */
  isTrialPlan?: boolean;
}

function CheckIcon() {
  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 17 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M6.20704 11.7692C5.91354 11.7692 5.62062 11.659 5.39648 11.4381L0 6.11882L1.62112 4.52032L6.20704 9.04065L15.3789 0L17 1.5985L7.0176 11.4381C6.79347 11.659 6.50054 11.7692 6.20704 11.7692Z"
        fill="#68D585"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="17"
      height="14"
      viewBox="-1 -1 17 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M12 0L0 12M12 12L0 0"
        stroke="#D5D7DD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M7.4668 0L14.0001 6.06667L7.4668 12.1333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
      <path
        d="M0 5.81675H13.0667"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
    </svg>
  );
}

const buttonClass = (highlighted?: boolean) =>
  cn(
    "mt-[31px] flex h-[59px] w-full max-w-[205px] items-center justify-between rounded-lg px-[21px] text-[17px] font-bold tracking-[-0.6px] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
    highlighted
      ? "bg-[#473BF0] text-white"
      : "bg-[#473BF0]/[0.08] text-[#473BF0]",
  );

export default function PricingCard({
  plan,
  price,
  billedLabel,
  interval,
  isTrialPlan = false,
}: PricingCardProps) {
  const trialPath = useStartTrialPath();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setError(null);

    // Signed-out: send them to /checkout which handles sign-in → Stripe in one step
    if (!isSignedIn) {
      navigate(
        `/checkout?planId=${plan.id}&interval=${interval}`,
      );
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: plan.id, interval }),
      });
      const text = await res.text();
      let data: { url?: string; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          res.status === 404
            ? "Checkout route not found. Restart the dev server (pnpm dev)."
            : `Server error (${res.status}). Check the terminal logs.`,
        );
      }
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <article className="flex flex-col rounded-[10px] border border-[#E7E9ED] bg-white px-8 pb-[38px] pt-[37px] font-gilroy xl:px-[49px]">
      <h3 className="text-[13px] font-bold uppercase leading-none tracking-[1.625px] text-[#473BF0]">
        {plan.name}
      </h3>

      <div className="mt-[40px] flex items-end gap-1.5">
        <p className="text-[60px] font-bold leading-[65px] tracking-[-2px] text-[#161C2D]">
          <span className="text-[24px]">$</span>
          {price}
        </p>
        <span className="mb-[3px] font-rubik text-[17px] font-normal leading-[29px] tracking-[-0.094px] text-[#161C2D]">
          / month
        </span>
      </div>

      <p className="mt-[11px] text-[15px] leading-[26px] tracking-[-0.1px] text-[#161C2D]/70">
        {billedLabel}
      </p>

      <ul className="mt-[38px] flex flex-col gap-[15px]">
        {plan.features.map((feature) => (
          <li
            key={feature.label}
            className={cn(
              "flex items-center gap-[11px] text-[17px] leading-[29px] tracking-[-0.2px] text-[#161C2D]",
              !feature.included && "text-[#161C2D]/70",
            )}
          >
            {feature.included ? <CheckIcon /> : <CrossIcon />}
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>

      {isTrialPlan ? (
        <Link to={trialPath} className={buttonClass(plan.highlighted)}>
          Start Free Trial
          <ArrowIcon />
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleUpgrade}
          disabled={!isLoaded || loading}
          className={buttonClass(plan.highlighted)}
        >
          {loading ? "Redirecting..." : `Upgrade to ${plan.name}`}
          <ArrowIcon />
        </button>
      )}

      {error && (
        <p role="alert" className="mt-3 text-[14px] text-[#E5484D]">
          {error}
        </p>
      )}

      <p className="mt-3 text-[15px] leading-[26px] tracking-[-0.1px] text-[#161C2D]/70">
        {isTrialPlan ? "No credit card required" : "Cancel anytime"}
      </p>
    </article>
  );
}
