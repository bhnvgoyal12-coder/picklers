// Supabase Edge Function: verify-razorpay-payment
// Deploy with: supabase functions deploy verify-razorpay-payment

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const data = encoder.encode(`${orderId}|${paymentId}`);
  const sig = await crypto.subtle.sign('HMAC', key, data);
  const expectedHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return expectedHex === signature;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { registration_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await req.json();

    const mode = Deno.env.get('RAZORPAY_MODE') || 'test';
    const keySecret = mode === 'live'
      ? Deno.env.get('RAZORPAY_LIVE_KEY_SECRET')!
      : Deno.env.get('RAZORPAY_TEST_KEY_SECRET')!;

    const isValid = await verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      keySecret
    );

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    if (isValid) {
      await supabase
        .from('registrations')
        .update({
          payment_status: 'paid',
          razorpay_payment_id,
        })
        .eq('id', registration_id);

      return new Response(
        JSON.stringify({ status: 'paid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      await supabase
        .from('registrations')
        .update({ payment_status: 'failed' })
        .eq('id', registration_id);

      return new Response(
        JSON.stringify({ status: 'failed', error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
