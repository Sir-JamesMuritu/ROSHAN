import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface STKPushRequest {
  phone_number: string;
  amount: number;
  enrollment_id: string;
  narrative?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { phone_number, amount, enrollment_id, narrative } = await req.json() as STKPushRequest;

    // Validate inputs
    if (!phone_number || !amount || !enrollment_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: phone_number, amount, enrollment_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format phone number (ensure it starts with 254)
    let formattedPhone = phone_number.replace(/\s+/g, '').replace(/^0/, '254').replace(/^\+/, '');
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    // Validate phone number format
    if (!/^254[17]\d{8}$/.test(formattedPhone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format. Use format: 0712345678 or 254712345678' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate amount
    if (amount < 1 || amount > 150000) {
      return new Response(
        JSON.stringify({ error: 'Amount must be between KES 1 and KES 150,000' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const INTASEND_SECRET_KEY = Deno.env.get('INTASEND_SECRET_KEY');
    const INTASEND_PUBLISHABLE_KEY = Deno.env.get('INTASEND_PUBLISHABLE_KEY');

    if (!INTASEND_SECRET_KEY || !INTASEND_PUBLISHABLE_KEY) {
      console.error('IntaSend API keys not configured');
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // IntaSend Sandbox API endpoint
    const INTASEND_API_URL = 'https://sandbox.intasend.com/api/v1/payment/mpesa-stk-push/';

    const payload = {
      public_key: INTASEND_PUBLISHABLE_KEY,
      amount: amount,
      phone_number: formattedPhone,
      api_ref: `payment_${enrollment_id}_${Date.now()}`,
      narrative: narrative || 'Fee Payment - RTI',
    };

    console.log('Initiating STK Push:', { phone: formattedPhone, amount, enrollment_id });

    const response = await fetch(INTASEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INTASEND_SECRET_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log('IntaSend response:', responseData);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: responseData.message || 'Failed to initiate payment',
          details: responseData 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'STK Push initiated. Please check your phone and enter your M-Pesa PIN.',
        invoice_id: responseData.invoice?.invoice_id,
        state: responseData.invoice?.state,
        checkout_id: responseData.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('STK Push error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
