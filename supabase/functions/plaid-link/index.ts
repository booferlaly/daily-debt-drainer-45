
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, PlaidApi, PlaidEnvironments } from "https://esm.sh/plaid@12.2.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

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
    // Initialize Plaid client
    const configuration = new Configuration({
      basePath: PlaidEnvironments.sandbox, // Use sandbox for testing, change to development or production
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': Deno.env.get("PLAID_CLIENT_ID") || "",
          'PLAID-SECRET': Deno.env.get("PLAID_SECRET") || "",
        },
      },
    });
    
    const plaidClient = new PlaidApi(configuration);
    
    // Parse request body
    const body = await req.json();
    const { action } = body;
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Handle different actions
    if (action === 'create_link_token') {
      // Get the user info from auth header
      const authHeader = req.headers.get('Authorization')!;
      if (!authHeader) {
        throw new Error('Missing Authorization header');
      }
      
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
      
      return new Response(
        JSON.stringify({ link_token: createTokenResponse.data.link_token }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } else if (action === 'exchange_public_token') {
      const { public_token } = body;
      if (!public_token) {
        throw new Error('No public token provided');
      }
      
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
    } else if (action === 'save_accounts') {
      const { user_id, item_id, access_token, accounts } = body;
      
      if (!user_id || !item_id || !access_token || !accounts) {
        throw new Error('Missing required parameters');
      }
      
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
    } else if (action === 'get_accounts') {
      const { user_id } = body;
      
      if (!user_id) {
        throw new Error('Missing user_id parameter');
      }
      
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
    } else {
      throw new Error('Invalid action');
    }
  } catch (error) {
    console.error("Plaid error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
