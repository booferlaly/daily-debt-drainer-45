
import React from 'react';
import { Button } from '@/components/ui/button';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt, Plus, Filter } from 'lucide-react';
import { expenses, currentUser } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ExpensesPage = () => {
  const owedToMe = expenses.filter(expense => 
    expense.paidBy === currentUser.id && 
    expense.participants.some(p => p.userId !== currentUser.id && !p.paid)
  );
  
  const iOwe = expenses.filter(expense =>
    expense.paidBy !== currentUser.id &&
    expense.participants.some(p => p.userId === currentUser.id && !p.paid)
  );
  
  const settled = expenses.filter(expense =>
    (expense.paidBy === currentUser.id && 
     !expense.participants.some(p => p.userId !== currentUser.id && !p.paid)) ||
    (expense.paidBy !== currentUser.id &&
     !expense.participants.some(p => p.userId === currentUser.id && !p.paid))
  );
  
  const allExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <Button className="sm:w-auto flex gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="owed">They Owe</TabsTrigger>
            <TabsTrigger value="owe">You Owe</TabsTrigger>
            <TabsTrigger value="settled">Settled</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 items-center">
          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Most Recent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsContent value="all" className="m-0 mt-2">
          <div className="grid gap-4">
            {allExpenses.map(expense => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                currentUserId={currentUser.id}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="owed" className="m-0 mt-2">
          <div className="grid gap-4">
            {owedToMe.map(expense => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                currentUserId={currentUser.id}
              />
            ))}
            {owedToMe.length === 0 && (
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
            {iOwe.map(expense => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                currentUserId={currentUser.id}
              />
            ))}
            {iOwe.length === 0 && (
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
            {settled.map(expense => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                currentUserId={currentUser.id}
              />
            ))}
            {settled.length === 0 && (
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
