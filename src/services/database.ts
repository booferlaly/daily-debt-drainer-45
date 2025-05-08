import { supabase } from '@/integrations/supabase/client';
import { User, Expense, ExpenseParticipant } from '@/types/models';

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

// Authentication-related functions
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

// Expenses functions
export const getExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
  
  return data || [];
};

export const getExpenseWithParticipants = async (expenseId: string): Promise<Expense | null> => {
  // First get the expense
  const { data: expense, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', expenseId)
    .single();
    
  if (error) {
    console.error('Error fetching expense:', error);
    throw error;
  }
  
  if (!expense) return null;
  
  // Then get the participants
  const { data: participants, error: participantsError } = await supabase
    .from('expense_participants')
    .select('*')
    .eq('expense_id', expenseId);
    
  if (participantsError) {
    console.error('Error fetching expense participants:', participantsError);
    throw participantsError;
  }
  
  return {
    ...expense,
    participants: participants || []
  } as Expense;
};

export const createExpense = async (expense: {
  title: string;
  amount: number;
  category: string;
  date?: string;
  notes?: string;
  participants: {
    user_id: string;
    name: string;
    amount: number;
    paid: boolean;
  }[];
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Start a transaction
  // First create the expense
  const { data: createdExpense, error } = await supabase
    .from('expenses')
    .insert({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date || new Date().toISOString(),
      notes: expense.notes,
      user_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
  
  // Then create the participants
  const participantsToInsert = expense.participants.map(participant => ({
    expense_id: createdExpense.id,
    user_id: participant.user_id,
    name: participant.name,
    amount: participant.amount,
    paid: participant.paid
  }));
  
  if (participantsToInsert.length > 0) {
    const { error: participantsError } = await supabase
      .from('expense_participants')
      .insert(participantsToInsert);
      
    if (participantsError) {
      console.error('Error creating expense participants:', participantsError);
      throw participantsError;
    }
  }
  
  // Return the full expense with participants
  return getExpenseWithParticipants(createdExpense.id);
};

export const updateExpense = async (
  expenseId: string, 
  updates: {
    title?: string;
    amount?: number;
    category?: string;
    date?: string;
    notes?: string;
  }
) => {
  const { error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', expenseId);
    
  if (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
  
  return getExpenseWithParticipants(expenseId);
};

export const updateExpenseParticipant = async (participantId: string, updates: { paid?: boolean, amount?: number }) => {
  const { data, error } = await supabase
    .from('expense_participants')
    .update(updates)
    .eq('id', participantId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating expense participant:', error);
    throw error;
  }
  
  return data;
};

export const deleteExpense = async (expenseId: string) => {
  // The cascade delete will handle removing participants
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId);
    
  if (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
  
  return true;
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
