import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreditScoreGauge from '@/components/credit/CreditScoreGauge';
import CreditSimulator from '@/components/credit/CreditSimulator';
import { creditScore, creditScoreSimulations, debts } from '@/data/mockData';
import { CreditCard, AlertCircle, Calendar, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const CreditSimulatorPage = () => {
  // Calculate credit utilization for each credit card
  const creditCards = debts.filter(debt => debt.category === 'credit_card');
  
  // Assuming each credit card has a credit limit (for this example)
  const creditCardLimits: Record<string, number> = {
    'debt-1': 10000, // Chase Sapphire
    'debt-2': 5000,  // Citi Double Cash
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Credit Simulator</h1>
        <Button className="sm:w-auto flex gap-2">
          <CreditCard className="h-4 w-4" />
          <span>Connect Accounts</span>
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <CreditScoreGauge creditScore={creditScore} />
        <CreditSimulator 
          currentScore={creditScoreSimulations.currentScore}
          projectedScore={creditScoreSimulations.projectedScore}
          actions={creditScoreSimulations.actions}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Credit Utilization Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h3 className="text-lg font-semibold">Overall Utilization</h3>
                  <p className="text-sm text-muted-foreground">
                    {creditScore.factors.creditUtilization}% of available credit used
                  </p>
                </div>
                <div className="text-sm flex items-center mt-2 md:mt-0">
                  {creditScore.factors.creditUtilization > 30 ? (
                    <AlertCircle className="h-4 w-4 mr-1 text-debt" />
                  ) : (
                    <Check className="h-4 w-4 mr-1 text-success" />
                  )}
                  <span className={creditScore.factors.creditUtilization > 30 ? "text-debt" : "text-success"}>
                    {creditScore.factors.creditUtilization > 30 ? 'High utilization may be impacting your score' : 'Good utilization ratio'}
                  </span>
                </div>
              </div>
              <Progress 
                value={creditScore.factors.creditUtilization} 
                max={100} 
                className="h-2" 
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Your Credit Cards</h3>
              {creditCards.map(card => {
                const limit = creditCardLimits[card.id] || 0;
                const utilization = (card.balance / limit) * 100;
                const isHighUtilization = utilization > 30;
                
                return (
                  <div key={card.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{card.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${card.balance.toLocaleString()} of ${limit.toLocaleString()} credit limit
                        </p>
                      </div>
                      <div 
                        className={`text-xs px-2 py-1 rounded-full ${
                          isHighUtilization ? 'bg-debt/10 text-debt' : 'bg-success/10 text-success'
                        }`}
                      >
                        {utilization.toFixed(0)}% utilized
                      </div>
                    </div>
                    
                    <Progress 
                      value={utilization} 
                      max={100} 
                      className="h-2" 
                    />
                    
                    {isHighUtilization && (
                      <div className="mt-3 text-xs flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1 text-warning" />
                        <span className="text-muted-foreground">
                          To improve your score, try to keep utilization below 30%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <Card className="bg-muted/50 border">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">Micropayments Can Improve Your Credit</h4>
                    <p className="text-sm text-muted-foreground">
                      Your daily micropayment strategy can help reduce your credit utilization ratio over time,
                      potentially raising your credit score by 20-40 points in the next 3 months.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditSimulatorPage;
