
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt, Plus, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Expense } from '@/types/models';
import AddExpenseDialog from '@/components/expenses/AddExpenseDialog';
import { useToast } from '@/hooks/use-toast';
import { getExpenses, getCurrentUser, updateExpenseParticipant } from '@/services/database';
import { useQuery } from '@tanstack/react-query';

const ExpensesPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
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

  // Fetch expenses using React Query
  const { data: expensesData = [], refetch: refetchExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
    enabled: !!currentUserId,
  });

  // Convert from database type to our application type
  const expenses: Expense[] = React.useMemo(() => {
    return expensesData.map(e => ({
      ...e,
      participants: []
    })) as Expense[];
  }, [expensesData]);
  
  // Filter and sort expenses based on current selections
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
          
          // Update each participant (in a real app, you might want to do this in a transaction)
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <AddExpenseDialog onExpenseAdded={handleExpenseAdded} />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto text-xs">
            <TabsTrigger value="all" className="px-2 sm:px-3">All</TabsTrigger>
            <TabsTrigger value="owed" className="px-2 sm:px-3">They Owe</TabsTrigger>
            <TabsTrigger value="owe" className="px-2 sm:px-3">You Owe</TabsTrigger>
            <TabsTrigger value="settled" className="px-2 sm:px-3">Settled</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 items-center">
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={sortOrder} 
            onValueChange={setSortOrder}
          >
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder="Most Recent" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="all" className="m-0 mt-2">
          <div className="grid gap-4">
            {filteredExpenses.map(expense => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                currentUserId={currentUserId || ''}
                onSettle={() => handleSettle(expense.id)}
              />
            ))}
            {filteredExpenses.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No expenses found</h3>
                <p className="text-muted-foreground">Add a new expense to get started.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Repeat the content for other tabs with the same pattern */}
        <TabsContent value="owed" className="m-0 mt-2">
          <div className="grid gap-4">
            {filteredExpenses.map(expense => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                currentUserId={currentUserId || ''}
                onSettle={() => handleSettle(expense.id)}
              />
            ))}
            {filteredExpenses.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No one owes you money</h3>
                <p className="text-muted-foreground">All your expenses are settled or you haven't added any.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="owe" className="m-0 mt-2">
          <div className="grid gap-4">
            {filteredExpenses.map(expense => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                currentUserId={currentUserId || ''}
                onSettle={() => handleSettle(expense.id)}
              />
            ))}
            {filteredExpenses.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">You don't owe anyone</h3>
                <p className="text-muted-foreground">All your debts are settled or you haven't added any.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="settled" className="m-0 mt-2">
          <div className="grid gap-4">
            {filteredExpenses.map(expense => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                currentUserId={currentUserId || ''}
                onSettle={() => handleSettle(expense.id)}
              />
            ))}
            {filteredExpenses.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No settled expenses</h3>
                <p className="text-muted-foreground">You don't have any settled expenses yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpensesPage;
