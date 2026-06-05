import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RRC2QFSQWj2Vo1fPw9vNiWEcDeYh49Y6GR8SAHuO9rPt52H4fIXffNOPoKjUHLsHO0qmu4o7CSCO0rY2FpXtRds00p3XIMrbH"
);

interface PaymentCheckoutProps {
  postId: string;
  amount: number;
  idempotencyKey: string;
  onPaymentSuccess: () => void;
}

export default function PaymentCheckout(props: PaymentCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
