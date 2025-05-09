
import React from 'react';
import { debts } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

const DailyPaymentSummary = () => {
  const totalDailyAmount = debts.reduce((sum, debt) => sum + (debt.micropaymentAmount || 0), 0);
  const totalMonthlyAmount = totalDailyAmount * 30;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Payment Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/50 rounded-lg p-4 mb-6">
          <div>
            <h3 className="font-medium text-lg">${totalDailyAmount.toFixed(2)}</h3>
            <p className="text-sm text-muted-foreground">Daily micropayments</p>
          </div>
          <div className="text-right">
            <h3 className="font-medium text-lg">${totalMonthlyAmount.toFixed(2)}</h3>
            <p className="text-sm text-muted-foreground">Monthly total</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Your Daily Micropayments</h3>
          {debts.map(debt => (
            <div key={debt.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{debt.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ${debt.minPayment} min. payment due on the {debt.dueDate}th
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${debt.micropaymentAmount?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-muted-foreground">daily</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyPaymentSummary;
