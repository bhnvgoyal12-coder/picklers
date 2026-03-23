// Supabase Edge Function: create-razorpay-order
// Deploy with: supabase functions deploy create-razorpay-order
// Set secrets: supabase secrets set RAZORPAY_KEY_ID=rzp_xxx RAZORPAY_KEY_SECRET=xxx

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
    const { registration_id, game_id, amount, currency } = await req.json();

    const mode = Deno.env.get('RAZORPAY_MODE') || 'test';
    const keyId = mode === 'live'
      ? Deno.env.get('RAZORPAY_LIVE_KEY_ID')!
      : Deno.env.get('RAZORPAY_TEST_KEY_ID')!;
    const keySecret = mode === 'live'
      ? Deno.env.get('RAZORPAY_LIVE_KEY_SECRET')!
      : Deno.env.get('RAZORPAY_TEST_KEY_SECRET')!;

    // Create Razorpay order
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
      body: JSON.stringify({
        amount,
        currency: currency || 'INR',
        receipt: `reg_${registration_id}`,
        notes: { game_id, registration_id },
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      throw new Error(`Razorpay error: ${err}`);
    }

    const order = await orderRes.json();

    // Update registration with order ID
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabase
      .from('registrations')
      .update({ razorpay_order_id: order.id })
      .eq('id', registration_id);

    return new Response(
      JSON.stringify({ order_id: order.id, amount: order.amount, currency: order.currency }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
