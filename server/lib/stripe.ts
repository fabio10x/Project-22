import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing from .env");
}

export const stripe = new Stripe(secretKey);

export const APP_URL = process.env.APP_URL ?? "http://localhost:8080";
