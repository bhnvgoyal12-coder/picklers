import { useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useWhatsAppPayment() {
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inFlightRef = useRef(false);
  const paymentLinkIdRef = useRef<string | null>(null);
  const registrationIdRef = useRef<string | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setPolling(false);
    inFlightRef.current = false;
  }, []);

  const cancelPayment = useCallback(async () => {
    stopPolling();

    // Cancel the Razorpay payment link if we have one
    if (paymentLinkIdRef.current && registrationIdRef.current) {
      try {
        await supabase.functions.invoke('cancel-razorpay-payment-link', {
          body: {
            payment_link_id: paymentLinkIdRef.current,
            registration_id: registrationIdRef.current,
          },
        });
      } catch {
        // Best effort — don't block the UI
      }
      paymentLinkIdRef.current = null;
      registrationIdRef.current = null;
    }
  }, [stopPolling]);

  const createLinkAndPay = async (params: {
    registrationId: string;
    gameId: string;
    gameName: string;
    amount: number;
    currency: string;
    playerName: string;
    playerEmail: string;
    playerPhone: string;
    callbackUrl: string;
  }): Promise<boolean> => {
    if (inFlightRef.current) return false;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create Razorpay Payment Link
      const { data, error: fnError } = await supabase.functions.invoke(
        'create-razorpay-payment-link',
        {
          body: {
            registration_id: params.registrationId,
            game_id: params.gameId,
            amount: params.amount,
            currency: params.currency,
            player_name: params.playerName,
            player_email: params.playerEmail,
            player_phone: params.playerPhone,
            game_name: params.gameName,
            callback_url: params.callbackUrl,
          },
        }
      );

      if (fnError) throw new Error(fnError.message);
      if (!data?.short_url) throw new Error('Failed to create payment link');

      // Store refs for cancellation
      paymentLinkIdRef.current = data.payment_link_id;
      registrationIdRef.current = params.registrationId;

      // Step 2: Open payment link in new tab
      window.open(data.short_url, '_blank');

      setLoading(false);

      // Step 3: Start polling for payment status
      setPolling(true);
      return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes at 5-second intervals

        pollRef.current = setInterval(async () => {
          attempts++;

          try {
            const { data: statusData } = await supabase.functions.invoke(
              'check-payment-status',
              { body: { registration_id: params.registrationId } }
            );

            if (statusData?.status === 'paid') {
              stopPolling();
              paymentLinkIdRef.current = null;
              registrationIdRef.current = null;
              resolve(true);
              return;
            }

            if (statusData?.status === 'failed') {
              stopPolling();
              setError('Payment link expired or was cancelled');
              resolve(false);
              return;
            }
          } catch {
            // Ignore polling errors, keep trying
          }

          if (attempts >= maxAttempts) {
            stopPolling();
            setError('Payment check timed out. If you paid, please refresh the page.');
            resolve(false);
          }
        }, 5000);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create payment link');
      setLoading(false);
      inFlightRef.current = false;
      return false;
    }
  };

  return { createLinkAndPay, loading, polling, error, stopPolling, cancelPayment };
}
