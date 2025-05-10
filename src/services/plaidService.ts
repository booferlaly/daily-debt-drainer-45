import { supabase } from "@/integrations/supabase/client";
import { PlaidAccount, PlaidLinkResult } from "@/types/models";
import { toast } from "sonner";

/**
 * Create a link token for Plaid Link initialization
 */
export const createLinkToken = async (): Promise<string> => {
  try {
    console.log("Requesting link token from Plaid...");
    const { data, error } = await supabase.functions.invoke('plaid-link', {
      body: { action: 'create_link_token' }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }
    
    if (!data || !data.link_token) {
      console.error('Invalid response from Plaid link function:', data);
      if (data && data.error) {
        throw new Error(data.error);
      }
      throw new Error('Invalid response from server');
    }
    
    return data.link_token;
  } catch (error) {
    console.error('Error creating link token:', error);
    throw error;
  }
};

/**
 * Exchange a public token for access token and retrieve account information
 */
export const exchangePublicToken = async (publicToken: string): Promise<PlaidLinkResult> => {
  try {
    console.log("Exchanging public token...");
    const { data, error } = await supabase.functions.invoke('plaid-link', {
      body: { 
        action: 'exchange_public_token',
        public_token: publicToken
      }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }
    
    if (!data) {
      console.error('Invalid response from exchange token function');
      throw new Error('Invalid response from server');
    }
    
    if (data.error) {
      console.error('Plaid API error:', data.error);
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error exchanging public token:', error);
    throw error;
  }
};

/**
 * Save linked accounts to the database
 */
export const savePlaidAccounts = async (
  userId: string, 
  itemId: string, 
  accessToken: string, 
  accounts: PlaidAccount[]
) => {
  try {
    console.log("Saving Plaid accounts...");
    const { data, error } = await supabase.functions.invoke('plaid-link', {
      body: { 
        action: 'save_accounts',
        user_id: userId,
        item_id: itemId,
        access_token: accessToken,
        accounts
      }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }
    
    if (data && data.error) {
      console.error('Error saving accounts:', data.error);
      throw new Error(data.error);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving Plaid accounts:', error);
    throw error;
  }
};

/**
 * Get accounts for a user
 */
export const getPlaidAccounts = async (userId: string) => {
  try {
    console.log("Getting Plaid accounts for user:", userId);
    const { data, error } = await supabase.functions.invoke('plaid-link', {
      body: { 
        action: 'get_accounts',
        user_id: userId
      }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }
    
    if (data && data.error) {
      console.error('Error retrieving accounts:', data.error);
      throw new Error(data.error);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error getting Plaid accounts:', error);
    throw error;
  }
};