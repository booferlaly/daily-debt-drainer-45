
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Expense } from '@/types/models';
import { getExpenses, updateExpenseParticipant, deleteExpense } from '@/services/database';
import { useToast } from '@/hooks/use-toast';

export const useExpenseManager = (currentUserId: string | null) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  
  // Fetch expenses using React Query
  const { data: expensesData = [], refetch: refetchExpenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
    enabled: !!currentUserId,
  });

  // Convert from database type to our application type
  const expenses: Expense[] = expensesData.map(e => ({
    ...e,
    participants: []
  })) as Expense[];
  
  const handleExpenseAdded = (newExpense: Expense) => {
    // Refresh the expenses list
    refetchExpenses();
    
    toast({
      title: "Expense Added",
      description: `${newExpense.title} has been added to your expenses.`,
    });
  };
  
  const handleSettle = async (expenseId: string) => {
    try {
      setIsSettling(true);
      // Find the expense
      const expense = expenses.find(e => e.id === expenseId);
      
      if (!expense || !currentUserId) return;
      
      // Find the participant that needs to be updated
      const participantToUpdate = expense.participants?.find(p => 
        p.user_id === currentUserId && !p.paid
      );
      
      if (participantToUpdate) {
        // Update the participant to mark as paid
        await updateExpenseParticipant(participantToUpdate.id, { paid: true });
        
        // Refresh expenses
        refetchExpenses();
        
        toast({
          title: "Expense Settled",
          description: "The expense has been marked as settled.",
        });
      } else {
        // If current user is the payer, mark all unpaid participants as paid
        if (expense.user_id === currentUserId) {
          const unpaidParticipants = expense.participants?.filter(p => !p.paid) || [];
          
          // Update each participant
          for (const participant of unpaidParticipants) {
            await updateExpenseParticipant(participant.id, { paid: true });
          }
          
          // Refresh expenses
          refetchExpenses();
          
          toast({
            title: "Expense Settled",
            description: "All participants have been marked as paid.",
          });
        }
      }
    } catch (error: any) {
      console.error('Error settling expense:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to settle expense",
        variant: "destructive",
      });
    } finally {
      setIsSettling(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      setIsDeleting(true);
      
      // Delete the expense
      await deleteExpense(expenseId);
      
      // Refresh expenses
      refetchExpenses();
      
      toast({
        title: "Expense Deleted",
        description: "The expense has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete expense",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    expenses,
    handleExpenseAdded,
    handleSettle,
    handleDeleteExpense,
    refetchExpenses,
    isLoading,
    isSettling,
    isDeleting
  };
};

export default useExpenseManager;
