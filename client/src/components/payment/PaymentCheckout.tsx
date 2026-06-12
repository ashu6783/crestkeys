import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import apiRequest from "../../lib/ApiRequest";
import CheckoutForm from "./CheckoutForm";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim();

if (!publishableKey) {
  console.error("VITE_STRIPE_PUBLISHABLE_KEY is not configured");
}

const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey)
  : null;

interface PaymentCheckoutProps {
  postId: string;
  amount: number;
  idempotencyKey: string;
  onPaymentSuccess: () => void;
}

function getErrorMessage(err: unknown): string {
  const data = (err as { response?: { data?: { error?: string; detail?: string } } })
    ?.response?.data;
  return data?.detail || data?.error || (err as Error)?.message || "Unable to start payment";
}

function isUnauthorized(err: unknown): boolean {
  return (err as { response?: { status?: number } })?.response?.status === 401;
}

export default function PaymentCheckout({
  postId,
  amount,
  idempotencyKey,
  onPaymentSuccess,
}: PaymentCheckoutProps) {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = useCallback(async () => {
    if (!stripePromise) {
      setError("Stripe is not configured for this site. Missing publishable key.");
      setInitLoading(false);
      return;
    }

    setInitLoading(true);
    setError(null);

    try {
      const response = await apiRequest.post("/payment/create-payment-intent", {
        postId,
        idempotencyKey,
      });

      if (response.data.alreadyPaid) {
        onPaymentSuccess();
        return;
      }

      if (!response.data.clientSecret) {
        setError("Payment could not be initialized. Please try again.");
        return;
      }

      setClientSecret(response.data.clientSecret);
    } catch (err: unknown) {
      if (isUnauthorized(err)) {
        navigate("/login", {
          state: { from: `${window.location.pathname}${window.location.search}` },
        });
        return;
      }
      setError(getErrorMessage(err));
    } finally {
      setInitLoading(false);
    }
  }, [postId, idempotencyKey, onPaymentSuccess, navigate]);

  useEffect(() => {
    initializePayment();
  }, [initializePayment]);

  if (initLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#B8860B]" />
        <p className="text-sm">Preparing secure checkout...</p>
      </div>
    );
  }

  if (!clientSecret || !stripePromise) {
    return (
      <div className="py-6 text-center">
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={initializePayment}
          className="text-sm font-medium text-[#B8860B] hover:text-[#a17609]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: "stripe" },
      }}
    >
      <CheckoutForm
        postId={postId}
        amount={amount}
        clientSecret={clientSecret}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
}
