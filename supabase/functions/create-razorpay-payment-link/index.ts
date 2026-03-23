// Supabase Edge Function: create-razorpay-payment-link
// Creates a Razorpay Payment Link and returns the short URL for WhatsApp sharing
// Deploy with: supabase functions deploy create-razorpay-payment-link

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
    const {
      registration_id,
      game_id,
      amount,
      currency,
      player_name,
      player_email,
      player_phone,
      game_name,
      callback_url,
    } = await req.json();

    const keyId = Deno.env.get('RAZORPAY_KEY_ID')!;
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!;

    // Create Razorpay Payment Link
    const linkRes = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
      body: JSON.stringify({
        amount,
        currency: currency || 'INR',
        description: `Payment for ${game_name}`,
        customer: {
          name: player_name,
          email: player_email,
          contact: player_phone,
        },
        notify: {
          sms: false,
          email: false,
        },
        callback_url: callback_url || undefined,
        callback_method: callback_url ? 'get' : undefined,
        notes: {
          game_id,
          registration_id,
        },
        expire_by: Math.floor(Date.now() / 1000) + 86400, // 24 hour expiry
      }),
    });

    if (!linkRes.ok) {
      const err = await linkRes.text();
      throw new Error(`Razorpay error: ${err}`);
    }

    const link = await linkRes.json();

    // Store payment link ID in registration (reuse razorpay_order_id column)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabase
      .from('registrations')
      .update({ razorpay_order_id: link.id })
      .eq('id', registration_id);

    return new Response(
      JSON.stringify({
        short_url: link.short_url,
        payment_link_id: link.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
