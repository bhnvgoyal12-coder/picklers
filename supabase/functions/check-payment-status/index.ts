// Supabase Edge Function: check-payment-status
// Checks Razorpay Payment Link status and updates registration if paid
// Deploy with: supabase functions deploy check-payment-status

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { registration_id } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch registration
    const { data: reg, error: regErr } = await supabase
      .from('registrations')
      .select('razorpay_order_id, payment_status')
      .eq('id', registration_id)
      .single();

    if (regErr || !reg) {
      throw new Error('Registration not found');
    }

    // Already paid — return immediately
    if (reg.payment_status === 'paid') {
      return new Response(
        JSON.stringify({ status: 'paid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No payment link ID stored
    if (!reg.razorpay_order_id) {
      return new Response(
        JSON.stringify({ status: 'pending' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const mode = Deno.env.get('RAZORPAY_MODE') || 'test';
    const keyId = mode === 'live'
      ? Deno.env.get('RAZORPAY_LIVE_KEY_ID')!
      : Deno.env.get('RAZORPAY_TEST_KEY_ID')!;
    const keySecret = mode === 'live'
      ? Deno.env.get('RAZORPAY_LIVE_KEY_SECRET')!
      : Deno.env.get('RAZORPAY_TEST_KEY_SECRET')!;

    // Check payment link status with Razorpay
    const linkRes = await fetch(
      `https://api.razorpay.com/v1/payment_links/${reg.razorpay_order_id}`,
      {
        headers: {
          Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        },
      }
    );

    if (!linkRes.ok) {
      // If it's not a payment link ID, it might be a regular order ID — return current DB status
      return new Response(
        JSON.stringify({ status: reg.payment_status }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const link = await linkRes.json();

    if (link.status === 'paid') {
      // Extract payment ID from the first payment in the link
      const paymentId = link.payments?.[0]?.payment_id || '';

      await supabase
        .from('registrations')
        .update({
          payment_status: 'paid',
          razorpay_payment_id: paymentId,
        })
        .eq('id', registration_id);

      return new Response(
        JSON.stringify({ status: 'paid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (link.status === 'expired' || link.status === 'cancelled') {
      await supabase
        .from('registrations')
        .update({ payment_status: 'failed' })
        .eq('id', registration_id);

      return new Response(
        JSON.stringify({ status: 'failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ status: 'pending' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
