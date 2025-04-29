import React from 'react';
import { Button } from '@/components/ui/button';
import BudgetOverview from '@/components/budget/BudgetOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { budgetCategories, calculateBudgetTotals, expenses } from '@/data/mockData';
import { PieChart, Wallet, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const BudgetPage = () => {
  const budgetTotals = calculateBudgetTotals();
  const overBudget = budgetTotals.difference < 0;
  
  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<string, typeof expenses>);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
        <Button className="sm:w-auto flex gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Budget Category</span>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${budgetTotals.planned.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">For this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${budgetTotals.actual.toLocaleString()}
            </div>
            <Progress 
              value={(budgetTotals.actual / budgetTotals.planned) * 100}
              className="h-2 mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.abs(budgetTotals.difference).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} {overBudget ? 'over budget' : 'remaining'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Budget Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overBudget ? 'text-debt' : 'text-success'}`}>
              {overBudget ? 'Over Budget' : 'Under Budget'}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.abs((budgetTotals.actual / budgetTotals.planned - 1) * 100).toFixed(1)}% {overBudget ? 'over' : 'under'} planned budget
            </p>
          </CardContent>
        </Card>
      </div>
      
      <BudgetOverview categories={budgetCategories} totals={budgetTotals} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Categories</TabsTrigger>
                <TabsTrigger value="housing">Housing</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="space-y-4">
                  {Object.keys(expensesByCategory).map(category => (
                    <div key={category}>
                      <h3 className="font-medium mb-2">{category}</h3>
                      <div className="space-y-2">
                        {expensesByCategory[category]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 3)
                          .map(expense => (
                            <div key={expense.id} className="flex justify-between items-center p-3 border rounded-md">
                              <div>
                                <p className="font-medium">{expense.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${expense.amount.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="housing" className="mt-0">
                {expensesByCategory['Housing'] ? (
                  <div className="space-y-2">
                    {expensesByCategory['Housing']
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(expense => (
                        <div key={expense.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{expense.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${expense.amount.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No housing expenses</h3>
                    <p className="text-muted-foreground">You haven't added any housing expenses yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="food" className="mt-0">
                {expensesByCategory['Food'] ? (
                  <div className="space-y-2">
                    {expensesByCategory['Food']
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(expense => (
                        <div key={expense.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{expense.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${expense.amount.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No food expenses</h3>
                    <p className="text-muted-foreground">You haven't added any food expenses yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="other" className="mt-0">
                <div className="space-y-4">
                  {Object.keys(expensesByCategory)
                    .filter(category => category !== 'Housing' && category !== 'Food')
                    .map(category => (
                      <div key={category}>
                        <h3 className="font-medium mb-2">{category}</h3>
                        <div className="space-y-2">
                          {expensesByCategory[category]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map(expense => (
                              <div key={expense.id} className="flex justify-between items-center p-3 border rounded-md">
                                <div>
                                  <p className="font-medium">{expense.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${expense.amount.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetPage;
