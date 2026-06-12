import Stripe from "stripe";
import Payment from "../models/payment";

type PaymentStatus = "succeeded" | "failed";

export async function syncPaymentFromIntent(
  paymentIntent: Stripe.PaymentIntent,
  status: PaymentStatus
): Promise<void> {
  const result = await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntent.id },
    { status, clientSecret: undefined },
    { upsert: false, new: true }
  );

  if (!result) {
    console.warn(
      `No Payment record for PaymentIntent ${paymentIntent.id} (status: ${status})`
    );
  }
}
