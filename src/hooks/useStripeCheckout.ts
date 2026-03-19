import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/components/auth/AuthProvider';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface UseStripeCheckoutReturn {
  initiateCheckout: (visaId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useStripeCheckout(): UseStripeCheckoutReturn {
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCheckout = useCallback(async (visaId: string) => {
    if (!user) {
      setError('You must be logged in to purchase');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visaId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [user]);

  return {
    initiateCheckout,
    isLoading,
    error,
  };
}
