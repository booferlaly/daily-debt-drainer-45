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
    
    if (!clientId || !secret) {
      console.error("Missing Plaid credentials");
      return new Response(
        JSON.stringify({ error: "Missing Plaid API credentials" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    // Create Plaid configuration
    const configuration = new Configuration({
      basePath: PlaidEnvironments.sandbox,
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Handle different actions
    if (action === 'create_link_token') {
      console.log("Creating link token");
      try {
        // Create link token
        const createTokenResponse = await plaidClient.linkTokenCreate({
          user: {
            client_user_id: crypto.randomUUID(), // Use a unique ID for the user
          },
          client_name: 'Debt Micropayment App',
          products: ['auth', 'transactions'],
          country_codes: ['US'],
          language: 'en',
        });
        
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
        return new Response(
          JSON.stringify({ error: e.message || "Failed to create Plaid link token" }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
    } else if (action === 'exchange_public_token') {
      const { public_token } = body;
      if (!public_token) {
        return new Response(
          JSON.stringify({ error: 'No public token provided' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
      
      try {
        // Exchange public token for access token
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
          public_token,
        });
        
        const accessToken = exchangeResponse.data.access_token;
        const itemId = exchangeResponse.data.item_id;
        
        // Get account information
        const accountsResponse = await plaidClient.accountsGet({
          access_token: accessToken,
        });
        
        const accounts = accountsResponse.data.accounts;
        
        return new Response(
          JSON.stringify({ 
            access_token: accessToken, 
            item_id: itemId,
            accounts: accounts
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (e) {
        console.error("Error exchanging Plaid token:", e);
        return new Response(
          JSON.stringify({ error: e.message || "Failed to exchange public token" }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
    } else if (action === 'save_accounts') {
      const { user_id, item_id, access_token, accounts } = body;
      
      if (!user_id || !item_id || !access_token || !accounts) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
      
      try {
        // First save the plaid item
        const { error: itemError } = await supabase
          .from('plaid_items')
          .insert({
            user_id,
            item_id,
            access_token
          });
        
        if (itemError) {
          throw new Error(`Error saving item: ${itemError.message}`);
        }
        
        // Then save the accounts
        const accountsToInsert = accounts.map(account => ({
          user_id,
          item_id,
          account_id: account.account_id,
          name: account.name,
          mask: account.mask,
          type: account.type,
          subtype: account.subtype,
          institution_id: null,
          available_balance: account.balances?.available || null,
          current_balance: account.balances?.current || null,
          iso_currency_code: account.balances?.iso_currency_code || null
        }));
        
        const { error: accountsError } = await supabase
          .from('plaid_accounts')
          .insert(accountsToInsert);
        
        if (accountsError) {
          throw new Error(`Error saving accounts: ${accountsError.message}`);
        }
        
        return new Response(
          JSON.stringify({ success: true }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (e) {
        console.error("Error saving Plaid accounts:", e);
        return new Response(
          JSON.stringify({ error: e.message || "Failed to save accounts" }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
    } else if (action === 'get_accounts') {
      const { user_id } = body;
      
      if (!user_id) {
        return new Response(
          JSON.stringify({ error: 'Missing user_id parameter' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
      
      try {
        const { data, error } = await supabase
          .from('plaid_accounts')
          .select('*')
          .eq('user_id', user_id);
        
        if (error) {
          throw new Error(`Error getting accounts: ${error.message}`);
        }
        
        return new Response(
          JSON.stringify(data),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (e) {
        console.error("Error retrieving Plaid accounts:", e);
        return new Response(
          JSON.stringify({ error: e.message || "Failed to get accounts" }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
  } catch (error) {
    console.error("Plaid error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});