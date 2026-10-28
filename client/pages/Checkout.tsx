import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, useClerk } from "@clerk/react";

/**
 * /checkout?planId=standard&interval=monthly
 *
 * This page exists purely to bridge the sign-in → Stripe checkout flow.
 * When a signed-out user clicks "Upgrade", they are sent here after signing in,
 * and the checkout API is called automatically so they never have to click twice.
 */
export default function Checkout() {
  const [searchParams] = useSearchParams();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { redirectToSignIn } = useClerk();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false); // prevent double-firing in StrictMode

  const planId = searchParams.get("planId") ?? "";
  const interval = (searchParams.get("interval") ?? "monthly") as
    | "monthly"
    | "yearly";

  useEffect(() => {
    // Wait for Clerk to finish hydrating the session
    if (!isLoaded) return;

    // Guard: only standard and premium go through Stripe; starter is free.
    if (!planId || !["standard", "premium"].includes(planId)) {
      navigate("/pricing", { replace: true });
      return;
    }

    // Not signed in: use Clerk's own redirect so the session cookie is
    // properly set before we come back to this page.
    if (!isSignedIn) {
      redirectToSignIn({
        redirectUrl: `/checkout?planId=${planId}&interval=${interval}`,
      });
      return;
    }

    // Signed in + valid plan – fire the checkout once
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const token = await getToken();
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ planId, interval }),
        });

        const text = await res.text();
        let data: { url?: string; error?: string } = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(`Server error (${res.status}). Check the terminal logs.`);
        }

        if (!res.ok || !data.url) {
          throw new Error(data.error ?? "Could not start checkout.");
        }

        window.location.href = data.url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    })();
  }, [isLoaded, isSignedIn, planId, interval, navigate, getToken, redirectToSignIn]);


  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#ECF2F7] px-4 font-gilroy">
        <div className="w-full max-w-md rounded-[14px] border border-[#E7E9ED] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#E5484D]/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="#E5484D" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-[20px] font-bold tracking-[-0.5px] text-[#161C2D]">
            Checkout failed
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#161C2D]/60">{error}</p>
          <Link
            to="/pricing"
            className="mt-6 inline-flex h-[48px] items-center justify-center rounded-lg bg-[#473BF0] px-8 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
          >
            Back to pricing
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading / redirecting state ──────────────────────────────────────────
  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#ECF2F7] px-4 font-gilroy">
      <div className="w-full max-w-md rounded-[14px] border border-[#E7E9ED] bg-white p-10 text-center shadow-sm">
        {/* Animated spinner */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center">
          <svg
            className="animate-spin text-[#473BF0]"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="20" cy="20" r="16"
              stroke="currentColor"
              strokeWidth="4"
              strokeOpacity="0.15"
            />
            <path
              d="M36 20a16 16 0 00-16-16"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="text-[20px] font-bold tracking-[-0.5px] text-[#161C2D]">
          Taking you to checkout…
        </h1>
        <p className="mt-2 text-[15px] text-[#161C2D]/60">
          Setting up your{" "}
          <span className="font-semibold capitalize text-[#473BF0]">{planId}</span>{" "}
          plan. Just a moment.
        </p>

        {/* Stripe trust badge */}
        <p className="mt-8 flex items-center justify-center gap-1.5 text-[13px] text-[#161C2D]/40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z"
              fill="currentColor" fillOpacity="0.5" />
          </svg>
          Secured by Stripe
        </p>
      </div>
    </div>
  );
}
