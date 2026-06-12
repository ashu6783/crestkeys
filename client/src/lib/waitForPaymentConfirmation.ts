import apiRequest from "../lib/ApiRequest";

interface PaymentStatusResponse {
  status: "none" | "pending" | "succeeded" | "failed";
  paid: boolean;
}

interface WaitOptions {
  maxAttempts?: number;
  intervalMs?: number;
  paymentIntentId?: string;
}

export async function waitForPaymentConfirmation(
  postId: string,
  options: WaitOptions = {}
): Promise<void> {
  const { maxAttempts = 20, intervalMs = 1000, paymentIntentId } = options;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (paymentIntentId && attempt > 0 && attempt % 3 === 0) {
      try {
        await apiRequest.post("/payment/sync", { paymentIntentId, postId });
      } catch {
        // Webhook may still be in flight; keep polling.
      }
    }

    const { data } = await apiRequest.get<PaymentStatusResponse>(
      `/payment/status/${postId}`
    );

    if (data.paid || data.status === "succeeded") {
      return;
    }

    if (data.status === "failed") {
      throw new Error("Payment failed. Please try again.");
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  if (paymentIntentId) {
    try {
      const { data } = await apiRequest.post<PaymentStatusResponse>(
        "/payment/sync",
        { paymentIntentId, postId }
      );
      if (data.paid || data.status === "succeeded") {
        return;
      }
    } catch {
      // Fall through to timeout message below.
    }
  }

  throw new Error(
    "Payment received but confirmation is still processing. Please refresh in a moment."
  );
}
