import "dotenv/config";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { handleDemo } from "./routes/demo";
import { handleCreateCheckout } from "./routes/checkout";
import { handleStripeWebhook } from "./routes/stripe-webhook";
import { handleSubscriptionInit } from "./routes/subscription-init";
import { handleCreatePortal } from "./routes/portal";
import { handleDashboard } from "./routes/dashboard";

// ── Rate limiters ─────────────────────────────────────────────────────────────

/** Tight limit for routes that trigger Stripe API calls */
const paymentLimiter = rateLimit({
  windowMs: 60_000,       // 1 minute
  max: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a moment and try again." },
});

/** Looser limit for read-heavy routes */
const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a moment and try again." },
});

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());

  // Stripe webhook needs the raw body to verify its signature.
  // Must be registered before express.json().
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook,
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Payments (rate-limited — each call hits Stripe's API)
  app.post("/api/checkout", paymentLimiter, handleCreateCheckout);
  app.post("/api/subscription/init", paymentLimiter, handleSubscriptionInit);
  app.post("/api/portal", paymentLimiter, handleCreatePortal);

  // Dashboard (plan-gated, read-only)
  app.get("/api/dashboard", apiLimiter, handleDashboard);

  return app;
}
