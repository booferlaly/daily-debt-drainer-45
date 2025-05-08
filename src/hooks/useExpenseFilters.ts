
import { useState, useEffect } from 'react';
import { Expense } from '@/types/models';

interface UseExpenseFiltersProps {
  expenses: Expense[];
  activeTab: string;
  categoryFilter: string;
  sortOrder: string;
  currentUserId: string | null;
}

export const useExpenseFilters = ({
  expenses,
  activeTab,
  categoryFilter,
  sortOrder,
  currentUserId
}: UseExpenseFiltersProps) => {
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  
  useEffect(() => {
    if (!expenses || !currentUserId) {
      setFilteredExpenses([]);
      return;
    }
    
    let result = [...expenses] as Expense[];
    
    // Apply tab filter
    if (activeTab === 'owed') {
      result = result.filter(expense => 
        expense.user_id === currentUserId && 
        expense.participants?.some(p => p.user_id !== currentUserId && !p.paid)
      );
    } else if (activeTab === 'owe') {
      result = result.filter(expense =>
        expense.user_id !== currentUserId &&
        expense.participants?.some(p => p.user_id === currentUserId && !p.paid)
      );
    } else if (activeTab === 'settled') {
      result = result.filter(expense =>
        (expense.user_id === currentUserId && 
        !expense.participants?.some(p => p.user_id !== currentUserId && !p.paid)) ||
        (expense.user_id !== currentUserId &&
        !expense.participants?.some(p => p.user_id === currentUserId && !p.paid))
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(expense => expense.category === categoryFilter);
    }
    
    // Apply sorting
    if (sortOrder === 'recent') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOrder === 'highest') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortOrder === 'lowest') {
      result.sort((a, b) => a.amount - b.amount);
    }
    
    setFilteredExpenses(result);
  }, [expenses, activeTab, categoryFilter, sortOrder, currentUserId]);
  
  return filteredExpenses;
};

export default useExpenseFilters;
