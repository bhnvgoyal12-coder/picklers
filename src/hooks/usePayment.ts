import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { loadRazorpayScript, openRazorpayCheckout } from '../lib/razorpay';
import type { RazorpaySuccessResponse } from '../types';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrderAndPay = async (params: {
    registrationId: string;
    gameId: string;
    gameName: string;
    amount: number;
    currency: string;
    playerName: string;
    playerEmail: string;
    playerPhone: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create Razorpay order via Supabase Edge Function
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            registration_id: params.registrationId,
            game_id: params.gameId,
            amount: params.amount,
            currency: params.currency,
          },
        }
      );

      if (orderError) throw new Error(orderError.message);

      // Step 2: Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load payment gateway');

      // Step 3: Open checkout
      return new Promise((resolve) => {
        openRazorpayCheckout({
          orderId: orderData.order_id,
          amount: params.amount,
          currency: params.currency,
          gameName: params.gameName,
          playerName: params.playerName,
          playerEmail: params.playerEmail,
          playerPhone: params.playerPhone,
          onSuccess: async (response: RazorpaySuccessResponse) => {
            try {
              // Step 4: Verify payment
              const { error: verifyError } = await supabase.functions.invoke(
                'verify-razorpay-payment',
                {
                  body: {
                    registration_id: params.registrationId,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                  },
                }
              );

              if (verifyError) throw new Error(verifyError.message);
              setLoading(false);
              resolve(true);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Payment verification failed');
              setLoading(false);
              resolve(false);
            }
          },
          onFailure: (err) => {
            setError(typeof err === 'string' ? err : 'Payment cancelled');
            setLoading(false);
            resolve(false);
          },
        });
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
      setLoading(false);
      return false;
    }
  };

  return { createOrderAndPay, loading, error };
}
