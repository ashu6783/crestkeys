import express from "express";
import { createPaymentIntent, confirmPayment } from "../controllers/payment.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);
router.post("/confirm", verifyToken, confirmPayment);

export default router;
