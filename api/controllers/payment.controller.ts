import { Request, Response } from "express";
import Stripe from "stripe";
import { getStripe, stripe } from "../utils/stripe";
import { syncPaymentFromIntent } from "../utils/paymentSync";
import Post from "../models/post";
import Payment from "../models/payment";
import { CustomRequest } from "../middleware/verifyToken";

export const createPaymentIntent = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { postId, idempotencyKey } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  if (!postId || typeof postId !== "string") {
    res.status(400).json({ error: "postId is required" });
    return;
  }

  if (!idempotencyKey || typeof idempotencyKey !== "string") {
    res.status(400).json({ error: "idempotencyKey is required" });
    return;
  }

  try {
    const existingPayment = await Payment.findOne({ idempotencyKey });
    if (existingPayment) {
      if (existingPayment.status === "succeeded") {
        res.status(200).json({ alreadyPaid: true });
        return;
      }
      if (existingPayment.clientSecret) {
        res.status(200).json({
          clientSecret: existingPayment.clientSecret,
          paymentIntentId: existingPayment.stripePaymentIntentId,
        });
        return;
      }
    }

    const priorSuccess = await Payment.findOne({
      userId,
      postId,
      status: "succeeded",
    });
    if (priorSuccess) {
      res.status(200).json({ alreadyPaid: true });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    const price = Number(post.price);
    if (!Number.isFinite(price) || price <= 0) {
      res.status(400).json({ error: "Invalid property price" });
      return;
    }

    const amountInCents = Math.round(price * 100);
    if (!Number.isInteger(amountInCents) || amountInCents < 50) {
      res.status(400).json({
        error: "Property price is too low for card payment (minimum $0.50)",
      });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          userId,
          postId,
          idempotencyKey,
        },
      },
      { idempotencyKey }
    );

    await Payment.findOneAndUpdate(
      { idempotencyKey },
      {
        userId,
        postId,
        idempotencyKey,
        stripePaymentIntentId: paymentIntent.id,
        amount: price,
        currency: "usd",
        status: "pending",
        clientSecret: paymentIntent.client_secret,
      },
      { upsert: true, new: true }
    );

    console.log(
      `[payment] Created PaymentIntent ${paymentIntent.id} for post ${postId} (user ${userId})`
    );

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: price,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown payment error";
    console.error("Stripe PaymentIntent Error:", error);
    res.status(500).json({
      error: "Failed to create payment intent",
      detail: message,
    });
  }
};

export const syncPayment = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { paymentIntentId, postId } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    res.status(400).json({ error: "paymentIntentId is required" });
    return;
  }

  if (!postId || typeof postId !== "string") {
    res.status(400).json({ error: "postId is required" });
    return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.metadata.userId !== userId) {
      res.status(403).json({ error: "Payment does not belong to this user" });
      return;
    }

    if (paymentIntent.metadata.postId !== postId) {
      res.status(400).json({ error: "Payment does not match this property" });
      return;
    }

    if (paymentIntent.status === "succeeded") {
      await syncPaymentFromIntent(paymentIntent, "succeeded");
      console.log(`[payment] Synced ${paymentIntentId} → succeeded (via /sync)`);
    } else if (
      paymentIntent.status === "canceled" ||
      paymentIntent.last_payment_error
    ) {
      await syncPaymentFromIntent(paymentIntent, "failed");
    }

    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId }).lean();

    res.status(200).json({
      status: payment?.status ?? "pending",
      paid: payment?.status === "succeeded",
      stripeStatus: paymentIntent.status,
    });
  } catch (error) {
    console.error("Payment sync error:", error);
    res.status(500).json({ error: "Failed to sync payment status" });
  }
};

export const getPaymentStatus = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  const { postId } = req.params;

  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  if (!postId?.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({ error: "Invalid post ID" });
    return;
  }

  try {
    const payment = await Payment.findOne({ userId, postId })
      .sort({ createdAt: -1 })
      .lean();

    if (!payment) {
      res.status(200).json({ status: "none", paid: false });
      return;
    }

    res.status(200).json({
      status: payment.status,
      paid: payment.status === "succeeded",
      paymentIntentId: payment.stripePaymentIntentId,
    });
  } catch (error) {
    console.error("Payment status error:", error);
    res.status(500).json({ error: "Failed to get payment status" });
  }
};

export const handleStripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!signature || typeof signature !== "string") {
    res.status(400).send("Missing stripe-signature header");
    return;
  }

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    res.status(500).send("Webhook secret not configured");
    return;
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    res.status(400).send(`Webhook Error: ${(error as Error).message}`);
    return;
  }

  try {
    console.log(`Stripe webhook received: ${event.type} (${event.id})`);

    switch (event.type) {
      case "payment_intent.succeeded":
        await syncPaymentFromIntent(
          event.data.object as Stripe.PaymentIntent,
          "succeeded"
        );
        console.log(
          `[payment] Webhook updated ${(event.data.object as Stripe.PaymentIntent).id} → succeeded`
        );
        break;
      case "payment_intent.payment_failed":
        await syncPaymentFromIntent(
          event.data.object as Stripe.PaymentIntent,
          "failed"
        );
        console.log(
          `[payment] Webhook updated ${(event.data.object as Stripe.PaymentIntent).id} → failed`
        );
        break;
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};
