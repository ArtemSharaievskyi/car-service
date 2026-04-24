import "server-only";
import Stripe from "stripe";

let stripeClient;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2026-02-25.clover",
    });
  }

  return stripeClient;
}
