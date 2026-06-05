import React, { useCallback, useEffect, useRef, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import apiRequest from "../../lib/ApiRequest";

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#dc2626",
      iconColor: "#dc2626",
    },
  },
};

interface CheckoutFormProps {
  postId: string;
  amount: number;
  idempotencyKey: string;
  onPaymentSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  postId,
  amount,
  idempotencyKey,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardFocused, setCardFocused] = useState(false);
  const onPaymentSuccessRef = useRef(onPaymentSuccess);
  onPaymentSuccessRef.current = onPaymentSuccess;

  const initializePayment = useCallback(async () => {
    setInitLoading(true);
    setError(null);

    try {
      const response = await apiRequest.post("/payment/create-payment-intent", {
        postId,
        idempotencyKey,
      });

      if (response.data.alreadyPaid) {
        onPaymentSuccessRef.current();
        return;
      }

      setClientSecret(response.data.clientSecret);
      setPaymentIntentId(response.data.paymentIntentId);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (err as Error)?.message ||
        "Unable to start payment";
      setError(message);
    } finally {
      setInitLoading(false);
    }
  }, [postId, idempotencyKey]);

  useEffect(() => {
    initializePayment();
  }, [initializePayment]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!stripe || !elements || !clientSecret || !paymentIntentId) {
      setError("Payment is not ready yet. Please wait a moment.");
      setSubmitting(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details are missing. Please refresh and try again.");
      setSubmitting(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        setSubmitting(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        await apiRequest.post("/payment/confirm", {
          paymentIntentId: paymentIntent.id,
          postId,
        });
        onPaymentSuccess();
        return;
      }

      setError("Payment could not be completed. Please try again.");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (err as Error)?.message ||
        "Payment error";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (initLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-[#B8860B] mb-3" />
        <p className="text-sm">Preparing secure checkout...</p>
      </div>
    );
  }

  if (!clientSecret) {
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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-[#B8860B]" />
        <h3 className="font-semibold text-gray-800">Card payment</h3>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Amount due:{" "}
        <span className="font-semibold text-gray-800">
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </p>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        Card details
      </label>
      <div
        className={`rounded-lg border bg-white px-4 py-3 transition-shadow ${
          cardFocused
            ? "border-[#B8860B] ring-2 ring-[#B8860B]/20"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <CardElement
          options={CARD_ELEMENT_OPTIONS}
          onFocus={() => setCardFocused(true)}
          onBlur={() => setCardFocused(false)}
        />
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
        <Lock className="h-3.5 w-3.5" />
        <span>Payments are processed securely by Stripe</span>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || submitting || !clientSecret}
        className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-[#B8860B] py-3 font-medium text-white shadow-sm transition hover:bg-[#a17609] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
