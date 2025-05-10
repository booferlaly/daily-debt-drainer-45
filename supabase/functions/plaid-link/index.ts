import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { Configuration, PlaidApi, PlaidEnvironments } from "https://esm.sh/plaid@12.2.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { action } = body;
    
    // Initialize Plaid client
    const clientId = Deno.env.get("PLAID_CLIENT_ID");
    const secret = Deno.env.get("PLAID_SECRET");
    const plaidEnv = Deno.env.get("PLAID_ENV") || "sandbox";
    
    if (!clientId || !secret) {
      console.error("Missing Plaid credentials - PLAID_CLIENT_ID or PLAID_SECRET not set");
      return new Response(
        JSON.stringify({ 
          error: "Plaid API credentials not configured. Please contact support.",
          details: {
            message: "Missing required environment variables",
            missingVars: [
              !clientId && "PLAID_CLIENT_ID",
              !secret && "PLAID_SECRET"
            ].filter(Boolean)
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }
    
    // Create Plaid configuration
    const configuration = new Configuration({
      basePath: plaidEnv === "sandbox" ? PlaidEnvironments.sandbox : PlaidEnvironments.development,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    });
    
    // Initialize the Plaid client
    const plaidClient = new PlaidApi(configuration);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({ 
          error: "Database configuration error. Please contact support.",
          details: {
            message: "Missing Supabase credentials"
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Handle different actions
    if (action === 'create_link_token') {
      console.log("Creating link token");
      try {
        // Create link token
        const createTokenResponse = await plaidClient.linkTokenCreate({
          user: {
            client_user_id: crypto.randomUUID(),
          },
          client_name: 'Daily Debt Drainer',
          products: ['auth', 'transactions'],
          country_codes: ['US'],
          language: 'en',
          webhook: `${Deno.env.get('SUPABASE_URL')}/functions/v1/plaid-webhook`,
        });
        
        if (!createTokenResponse.data || !createTokenResponse.data.link_token) {
          throw new Error("Invalid response from Plaid API");
        }
        
        console.log("Link token created successfully");
        
        return new Response(
          JSON.stringify({ link_token: createTokenResponse.data.link_token }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (e) {
        console.error("Error creating Plaid link token:", e);
        const errorDetails = e.response?.data || {};
        const errorMessage = errorDetails.error_message || e.message || "Failed to create link token";
        
        return new Response(
          JSON.stringify({ 
            error: errorMessage,
            details: errorDetails
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
    }

    // Handle other actions...
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
    
  } catch (error) {
    console.error("Plaid error:", error);
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred",
        details: {
          message: error.message,
          ...error.response?.data
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});