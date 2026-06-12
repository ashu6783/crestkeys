import express from "express";
import {
  createPaymentIntent,
  getPaymentStatus,
  syncPayment,
} from "../controllers/payment.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);
router.post("/sync", verifyToken, syncPayment);
router.get("/status/:postId", verifyToken, getPaymentStatus);

export default router;
