
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client with service role key for database operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Get auth user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) throw new Error("Invalid auth token");

    // Parse request data
    const { 
      debtId, 
      amount, 
      paymentDate, 
      frequency 
    } = await req.json();

    // Validate required fields
    if (!debtId || !amount || !paymentDate || !frequency) {
      throw new Error("Missing required payment information");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Find or create a customer
    let customerId;
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      });
      customerId = newCustomer.id;
    }

    // For now, we'll create a payment intent for the micropayment
    // In a real implementation, you might want to use Stripe Billing or a recurring schedule
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: "usd",
      customer: customerId,
      description: `Micropayment for debt ${debtId}`,
      metadata: {
        debtId,
        frequency,
        userId: user.id,
      },
    });

    // Store the payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        debt_id: debtId,
        stripe_session_id: paymentIntent.id,
        amount: Math.round(amount * 100),
        currency: 'usd',
        status: 'pending',
        payment_date: new Date(paymentDate).toISOString(),
        frequency: frequency,
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Return the client secret for finalizing the payment
    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in schedule-payment:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
