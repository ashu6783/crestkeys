import mongoose, { Schema, model } from "mongoose";
import { IPayment } from "../types";

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    idempotencyKey: { type: String, required: true, unique: true },
    stripePaymentIntentId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
    clientSecret: { type: String },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, postId: 1, status: 1 });

export default model<IPayment>("Payment", paymentSchema);
