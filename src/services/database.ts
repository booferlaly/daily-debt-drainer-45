
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/models';

// User profiles
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
  
  return data;
};

export const updateUserProfile = async (userId: string, updates: { username?: string, full_name?: string, avatar_url?: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  return data;
};

// This is a placeholder for future authentication-related functions
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get the profile data
  try {
    const profile = await getUserProfile(user.id);
    
    return {
      id: user.id,
      name: profile?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      profileImage: profile?.avatar_url
    };
  } catch (error) {
    console.error('Error getting current user profile:', error);
    
    // Return basic user info without profile
    return {
      id: user.id,
      name: user.email?.split('@')[0] || 'User',
      email: user.email || '',
      profileImage: undefined
    };
  }
};

// For future implementation: Financial institutions functions
export const getFinancialInstitutions = async () => {
  // Placeholder for future implementation
  return [];
};

// For future implementation: Account connections functions
export const getUserConnections = async (userId: string) => {
  // Placeholder for future implementation
  return [];
};

export const createConnection = async (connection: any) => {
  // Placeholder for future implementation
  throw new Error('Not implemented yet');
};

export const updateConnection = async (id: string, updates: any) => {
  // Placeholder for future implementation
  throw new Error('Not implemented yet');
};

// For future implementation: Financial accounts functions
export const getUserAccounts = async (userId: string) => {
  // Placeholder for future implementation
  return [];
};

export const createAccount = async (account: any) => {
  // Placeholder for future implementation
  throw new Error('Not implemented yet');
};

export const updateAccount = async (id: string, updates: any) => {
  // Placeholder for future implementation
  throw new Error('Not implemented yet');
};

// For future implementation: Transactions functions
export const getAccountTransactions = async (accountId: string, options = { limit: 100, offset: 0 }) => {
  // Placeholder for future implementation
  return [];
};

export const createTransaction = async (transaction: any) => {
  // Placeholder for future implementation
  throw new Error('Not implemented yet');
};
