
import { createClient } from '@supabase/supabase-js';
import { FinancialAccount, FinancialInstitution, AccountConnection, Transaction } from '../types/models';

// These values will be provided by Supabase once connected
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Financial institutions
export const getFinancialInstitutions = async (): Promise<FinancialInstitution[]> => {
  const { data, error } = await supabase
    .from('financial_institutions')
    .select('*');
  
  if (error) {
    console.error('Error fetching financial institutions:', error);
    throw error;
  }
  
  return data as FinancialInstitution[];
};

// Account connections
export const getUserConnections = async (userId: string): Promise<AccountConnection[]> => {
  const { data, error } = await supabase
    .from('account_connections')
    .select('*, financial_institutions(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user connections:', error);
    throw error;
  }
  
  return data as AccountConnection[];
};

export const createConnection = async (connection: Omit<AccountConnection, 'id' | 'createdAt' | 'lastUpdated'>): Promise<AccountConnection> => {
  const { data, error } = await supabase
    .from('account_connections')
    .insert({
      user_id: connection.userId,
      institution_id: connection.institutionId,
      access_token: connection.accessToken,
      item_id: connection.itemId,
      status: connection.status,
      error: connection.error,
      consent_expiration: connection.consentExpiration
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating connection:', error);
    throw error;
  }
  
  return data as AccountConnection;
};

export const updateConnection = async (id: string, updates: Partial<AccountConnection>): Promise<AccountConnection> => {
  const { data, error } = await supabase
    .from('account_connections')
    .update({
      status: updates.status,
      error: updates.error,
      consent_expiration: updates.consentExpiration,
      access_token: updates.accessToken,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating connection:', error);
    throw error;
  }
  
  return data as AccountConnection;
};

// Financial accounts
export const getUserAccounts = async (userId: string): Promise<FinancialAccount[]> => {
  const { data, error } = await supabase
    .from('financial_accounts')
    .select('*, financial_institutions(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user accounts:', error);
    throw error;
  }
  
  return data as FinancialAccount[];
};

export const createAccount = async (account: Omit<FinancialAccount, 'id' | 'lastUpdated'>): Promise<FinancialAccount> => {
  const { data, error } = await supabase
    .from('financial_accounts')
    .insert({
      user_id: account.userId,
      institution_id: account.institutionId,
      account_name: account.accountName,
      account_type: account.accountType,
      account_number: account.accountNumber,
      account_mask: account.accountMask,
      current_balance: account.currentBalance,
      available_balance: account.availableBalance,
      currency: account.currency,
      is_active: account.isActive,
      external_id: account.externalId
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating account:', error);
    throw error;
  }
  
  return data as FinancialAccount;
};

export const updateAccount = async (id: string, updates: Partial<FinancialAccount>): Promise<FinancialAccount> => {
  const { data, error } = await supabase
    .from('financial_accounts')
    .update({
      account_name: updates.accountName,
      current_balance: updates.currentBalance,
      available_balance: updates.availableBalance,
      is_active: updates.isActive,
      last_updated: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating account:', error);
    throw error;
  }
  
  return data as FinancialAccount;
};

// Transactions
export const getAccountTransactions = async (accountId: string, options = { limit: 100, offset: 0 }): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('account_id', accountId)
    .order('date', { ascending: false })
    .range(options.offset, options.offset + options.limit - 1);
  
  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
  
  return data as Transaction[];
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      account_id: transaction.accountId,
      date: transaction.date,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      merchant_name: transaction.merchantName,
      pending: transaction.pending,
      external_id: transaction.externalId
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
  
  return data as Transaction;
};
