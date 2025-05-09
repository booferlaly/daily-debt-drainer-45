
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
    // Get Supabase client with service role key to bypass RLS
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

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if user exists in Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let hasSubscription = false;
    let subscriptionEnd = null;

    if (customers.data.length > 0) {
      const customer = customers.data[0];
      
      // Check for active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 1,
      });
      
      if (subscriptions.data.length > 0) {
        hasSubscription = true;
        subscriptionEnd = new Date(subscriptions.data[0].current_period_end * 1000).toISOString();
        
        // Update the subscribers table
        await supabase
          .from('subscribers')
          .upsert({
            user_id: user.id,
            email: user.email,
            stripe_customer_id: customer.id,
            subscribed: true,
            subscription_tier: 'credit-reporting',
            subscription_end: subscriptionEnd,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
      } else {
        // No active subscription, update record accordingly
        await supabase
          .from('subscribers')
          .upsert({
            user_id: user.id,
            email: user.email,
            stripe_customer_id: customer.id,
            subscribed: false,
            subscription_tier: null,
            subscription_end: null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
      }
    } else {
      // Customer doesn't exist in Stripe yet
      await supabase
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email,
          stripe_customer_id: null,
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
    }

    return new Response(JSON.stringify({ 
      subscribed: hasSubscription,
      subscription_end: subscriptionEnd,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in check-subscription:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
