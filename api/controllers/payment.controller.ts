import { Response } from "express";
import { stripe } from "../utils/stripe";
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

    if (!post.price || post.price <= 0) {
      res.status(400).json({ error: "Invalid property price" });
      return;
    }

    const amountInCents = Math.round(post.price * 100);

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
        amount: post.price,
        currency: "usd",
        status: "pending",
        clientSecret: paymentIntent.client_secret,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: post.price,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown payment error";
    console.error("Stripe PaymentIntent Error:", error);
    res.status(500).json({
      error: "Failed to create payment intent",
      ...(process.env.NODE_ENV !== "production" && { detail: message }),
    });
  }
};

export const confirmPayment = async (
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

    if (paymentIntent.status !== "succeeded") {
      res.status(400).json({ error: "Payment has not succeeded yet" });
      return;
    }

    if (paymentIntent.metadata.userId !== userId) {
      res.status(403).json({ error: "Payment does not belong to this user" });
      return;
    }

    if (paymentIntent.metadata.postId !== postId) {
      res.status(400).json({ error: "Payment does not match this property" });
      return;
    }

    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      { status: "succeeded", clientSecret: undefined },
      { upsert: false }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Payment confirmation Error:", error);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
};
