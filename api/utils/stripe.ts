import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is missing!");
    }
    stripeClient = new Stripe(stripeSecretKey);
  }
  return stripeClient;
}

/** @deprecated Use getStripe() — kept for existing imports */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripe(), prop, getStripe());
  },
});
