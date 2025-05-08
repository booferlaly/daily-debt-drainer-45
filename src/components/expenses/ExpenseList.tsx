
import React from 'react';
import { Receipt } from 'lucide-react';
import { Expense } from '@/types/models';
import ExpenseCard from './ExpenseCard';

interface ExpenseListProps {
  expenses: Expense[];
  currentUserId: string;
  onSettle: (expenseId: string) => void;
  emptyMessage: {
    title: string;
    description: string;
  };
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  currentUserId, 
  onSettle,
  emptyMessage 
}) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{emptyMessage.title}</h3>
        <p className="text-muted-foreground">{emptyMessage.description}</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-6">
      {expenses.map(expense => (
        <ExpenseCard 
          key={expense.id} 
          expense={expense} 
          currentUserId={currentUserId}
          onSettle={() => onSettle(expense.id)}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
