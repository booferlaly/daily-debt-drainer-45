
import React from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import DebtCard from '@/components/debts/DebtCard';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { CircleDollarSign, CreditCard, CalendarClock, Wallet, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  debts,
  expenses,
  currentUser,
  calculateTotalDebt,
  calculateDailyMicropayments,
  calculateTotalOwedToYou,
  calculateTotalYouOwe
} from '@/data/mockData';

const Dashboard = () => {
  // Calculate summary stats
  const totalDebt = calculateTotalDebt();
  const dailyMicropayments = calculateDailyMicropayments();
  const monthlyMicropayments = dailyMicropayments * 30;
  const totalOwed = calculateTotalOwedToYou();
  const totalYouOwe = calculateTotalYouOwe();
  
  // Sort debts by balance (highest first)
  const sortedDebts = [...debts].sort((a, b) => b.balance - a.balance);
  
  // Get recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex gap-2">
            <Receipt className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
          <Button className="flex gap-2">
            <CircleDollarSign className="h-4 w-4" />
            <span>Add Debt</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Debt"
          value={`$${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="Daily Micropayments"
          value={`$${dailyMicropayments.toFixed(2)}`}
          description={`$${monthlyMicropayments.toFixed(2)} monthly`}
          icon={<CalendarClock className="h-4 w-4" />}
        />
        <StatsCard
          title="Owed to You"
          value={`$${totalOwed.toFixed(2)}`}
          trend={totalOwed > 0 ? 'up' : 'neutral'}
          trendValue={totalOwed > 0 ? `From ${expenses.filter(e => e.paidBy === currentUser.id && e.participants.some(p => p.userId !== currentUser.id && !p.paid)).length} expenses` : 'All settled up'}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatsCard
          title="You Owe"
          value={`$${totalYouOwe.toFixed(2)}`}
          trend={totalYouOwe > 0 ? 'down' : 'neutral'}
          trendValue={totalYouOwe > 0 ? `From ${expenses.filter(e => e.paidBy !== currentUser.id && e.participants.some(p => p.userId === currentUser.id && !p.paid)).length} expenses` : 'All paid'}
          icon={<Receipt className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Debts</h2>
            <Button variant="ghost" size="sm" className="text-sm" asChild>
              <a href="/debts">View All</a>
            </Button>
          </div>
          <div className="grid gap-4">
            {sortedDebts.slice(0, 2).map(debt => (
              <DebtCard key={debt.id} debt={debt} />
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Expenses</h2>
            <Button variant="ghost" size="sm" className="text-sm" asChild>
              <a href="/expenses">View All</a>
            </Button>
          </div>
          <div className="grid gap-4">
            {recentExpenses.map(expense => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                currentUserId={currentUser.id} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
