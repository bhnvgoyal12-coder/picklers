import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

/**
 * On page load, checks if the current user has a pending registration
 * for this game and verifies payment status with Razorpay.
 * Auto-updates to "paid" if Razorpay confirms payment.
 */
export function useCheckPendingPayment(
  gameId: string | undefined,
  userPhone: string | undefined,
  onPaid: () => void
) {
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!gameId || !userPhone || checkedRef.current) return;
    checkedRef.current = true;

    (async () => {
      // Find pending registration for this user+game
      const { data: reg } = await supabase
        .from('registrations')
        .select('id, payment_status, razorpay_order_id')
        .eq('game_id', gameId)
        .eq('player_phone', userPhone)
        .eq('payment_status', 'pending')
        .maybeSingle();

      if (!reg || !reg.razorpay_order_id) return;

      // Check with Razorpay if it's actually been paid
      try {
        const { data } = await supabase.functions.invoke('check-payment-status', {
          body: { registration_id: reg.id },
        });

        if (data?.status === 'paid') {
          onPaid();
        }
      } catch {
        // Silent — don't disrupt the page
      }
    })();
  }, [gameId, userPhone, onPaid]);
}
