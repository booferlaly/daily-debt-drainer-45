
import React from 'react';
import AddExpenseDialog from '@/components/expenses/AddExpenseDialog';
import { Expense } from '@/types/models';

interface ExpenseHeaderProps {
  onExpenseAdded: (newExpense: Expense) => void;
}

const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({ onExpenseAdded }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
      <AddExpenseDialog onExpenseAdded={onExpenseAdded} />
    </div>
  );
};

export default ExpenseHeader;
