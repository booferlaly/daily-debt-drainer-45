
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/database';
import ExpenseHeader from '@/components/expenses/ExpenseHeader';
import ExpenseFilters from '@/components/expenses/ExpenseFilters';
import ExpenseList from '@/components/expenses/ExpenseList';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { emptyStateMessages } from '@/components/expenses/EmptyStateMessages';
import useExpenseFilters from '@/hooks/useExpenseFilters';
import useExpenseManager from '@/hooks/useExpenseManager';

const ExpensesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    
    fetchUser();
  }, []);

  // Use custom hooks for expense management and filtering
  const { 
    expenses, 
    handleExpenseAdded, 
    handleSettle 
  } = useExpenseManager(currentUserId);
  
  const filteredExpenses = useExpenseFilters({
    expenses,
    activeTab,
    categoryFilter,
    sortOrder,
    currentUserId
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <ExpenseHeader onExpenseAdded={handleExpenseAdded} />
      
      <ExpenseFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="all" className="m-0 pt-2">
          <ExpenseList
            expenses={filteredExpenses}
            currentUserId={currentUserId || ''}
            onSettle={handleSettle}
            emptyMessage={emptyStateMessages.all}
          />
        </TabsContent>
        
        <TabsContent value="owed" className="m-0 pt-2">
          <ExpenseList
            expenses={filteredExpenses}
            currentUserId={currentUserId || ''}
            onSettle={handleSettle}
            emptyMessage={emptyStateMessages.owed}
          />
        </TabsContent>
        
        <TabsContent value="owe" className="m-0 pt-2">
          <ExpenseList
            expenses={filteredExpenses}
            currentUserId={currentUserId || ''}
            onSettle={handleSettle}
            emptyMessage={emptyStateMessages.owe}
          />
        </TabsContent>
        
        <TabsContent value="settled" className="m-0 pt-2">
          <ExpenseList
            expenses={filteredExpenses}
            currentUserId={currentUserId || ''}
            onSettle={handleSettle}
            emptyMessage={emptyStateMessages.settled}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpensesPage;
