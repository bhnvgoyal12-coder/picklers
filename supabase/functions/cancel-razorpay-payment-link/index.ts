// Supabase Edge Function: cancel-razorpay-payment-link
// Cancels a Razorpay Payment Link and updates registration status
// Deploy with: supabase functions deploy cancel-razorpay-payment-link --no-verify-jwt

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { payment_link_id, registration_id } = await req.json();

    if (!payment_link_id) throw new Error('payment_link_id is required');

    const mode = Deno.env.get('RAZORPAY_MODE') || 'test';
    const keyId = mode === 'live'
      ? Deno.env.get('RAZORPAY_LIVE_KEY_ID')!
      : Deno.env.get('RAZORPAY_TEST_KEY_ID')!;
    const keySecret = mode === 'live'
      ? Deno.env.get('RAZORPAY_LIVE_KEY_SECRET')!
      : Deno.env.get('RAZORPAY_TEST_KEY_SECRET')!;

    // Cancel the payment link on Razorpay
    const cancelRes = await fetch(
      `https://api.razorpay.com/v1/payment_links/${payment_link_id}/cancel`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        },
      }
    );

    // Update registration to failed if we have a registration_id
    if (registration_id) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      await supabase
        .from('registrations')
        .update({ payment_status: 'failed' })
        .eq('id', registration_id)
        .eq('payment_status', 'pending'); // Only update if still pending
    }

    const cancelled = cancelRes.ok;
    return new Response(
      JSON.stringify({ cancelled }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
