
import { supabase } from "@/integrations/supabase/client";
import { PlaidAccount, PlaidLinkResult } from "@/types/models";

/**
 * Create a link token for Plaid Link initialization
 */
export const createLinkToken = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('plaid-link', {
      body: { action: 'create_link_token' }
    });
    
    if (error) throw error;
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
    const { data, error } = await supabase.functions.invoke('plaid-link', {
      body: { 
        action: 'exchange_public_token',
        public_token: publicToken
      }
    });
    
    if (error) throw error;
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
    // First save the item using custom RPC
    const { data: itemData, error: itemError } = await supabase.functions.invoke('plaid-link', {
      body: { 
        action: 'save_accounts',
        user_id: userId,
        item_id: itemId,
        access_token: accessToken,
        accounts
      }
    });
    
    if (itemError) throw itemError;
    
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
    const { data, error } = await supabase.functions.invoke('plaid-link', {
      body: { 
        action: 'get_accounts',
        user_id: userId
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting Plaid accounts:', error);
    throw error;
  }
};
