
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import { 
  calculateTotalDebt, 
  calculateDailyMicropayments,
  calculateTotalOwedToYou,
  calculateTotalYouOwe,
  calculateBudgetTotals,
  creditScore,
  expenses
} from "@/data/mockData";
import CreditScoreGauge from "@/components/credit/CreditScoreGauge";
import BudgetOverview from "@/components/budget/BudgetOverview";
import {
  CircleDollarSign,
  CreditCard,
  PiggyBank,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";

const Dashboard = () => {
  // Calculate metrics
  const totalDebt = calculateTotalDebt();
  const dailyMicropayments = calculateDailyMicropayments();
  const totalOwed = calculateTotalOwedToYou();
  const totalOwe = calculateTotalYouOwe();
  const { planned, actual } = calculateBudgetTotals();
  
  // Format amounts for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Get upcoming and recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  const pendingExpenses = expenses.filter(expense => 
    expense.participants?.some(p => !p.paid)
  ).slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Debt"
          value={formatAmount(totalDebt)}
          icon={<CreditCard className="text-debt" />}
          trend="down"
          trendValue="-2.3% from last month"
        />
        <StatsCard 
          title="Daily Micropayments"
          value={formatAmount(dailyMicropayments)}
          icon={<PiggyBank className="text-primary" />}
          description="Helps reduce debt faster"
        />
        <StatsCard 
          title="People Owe You"
          value={formatAmount(totalOwed)}
          icon={<Users className="text-primary" />}
          description={`From ${expenses.filter(expense => 
            expense.user_id === "user-1" && 
            expense.participants?.some(p => p.user_id !== "user-1" && !p.paid)
          ).length} expenses`}
        />
        <StatsCard 
          title="You Owe Others"
          value={formatAmount(totalOwe)}
          icon={<Receipt className="text-debt" />}
          description={`From ${expenses.filter(expense => 
            expense.user_id !== "user-1" && 
            expense.participants?.some(p => p.user_id === "user-1" && !p.paid)
          ).length} expenses`}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Budget</h2>
            <BudgetOverview />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Credit Score</h2>
            <div className="flex flex-col items-center">
              <CreditScoreGauge creditScore={creditScore} />
              <div className="text-sm text-muted-foreground mt-2">
                Last updated: {new Date(creditScore.lastUpdated).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-success mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+15 points this month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
            <div className="space-y-2">
              {recentExpenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                  <div>
                    <div className="font-medium">{expense.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${expense.amount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      {expense.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Pending Settlements</h2>
            <div className="space-y-2">
              {pendingExpenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                  <div>
                    <div className="font-medium">{expense.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {expense.user_id === "user-1" ? "You are owed" : "You owe"}
                    </div>
                    <div className="text-xs font-medium text-debt">
                      ${expense.participants?.filter(p => 
                        expense.user_id === "user-1" ? 
                          p.user_id !== "user-1" && !p.paid :
                          p.user_id === "user-1" && !p.paid
                      ).reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
