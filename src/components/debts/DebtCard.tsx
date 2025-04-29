
import { Debt } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Receipt,
  FileText,
  Calendar,
  Wallet
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DebtCardProps {
  debt: Debt;
}

const DebtCard = ({ debt }: DebtCardProps) => {
  const getDebtIcon = (category: string) => {
    switch (category) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'loan':
        return <FileText className="h-4 w-4" />;
      case 'personal':
        return <Wallet className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  // Format the due date as "5th" or "15th" etc.
  const formatDueDate = (day: number) => {
    if (day === 1 || day === 21 || day === 31) {
      return `${day}st`;
    } else if (day === 2 || day === 22) {
      return `${day}nd`;
    } else if (day === 3 || day === 23) {
      return `${day}rd`;
    } else {
      return `${day}th`;
    }
  };

  const dailyPaymentAmount = debt.micropaymentAmount || 0;
  const dailyPaymentPerMonth = dailyPaymentAmount * 30;
  const percentageOfMinPayment = (dailyPaymentPerMonth / debt.minPayment) * 100;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              {getDebtIcon(debt.category)}
            </div>
            <CardTitle className="text-base">{debt.name}</CardTitle>
          </div>
          <div className="text-xs bg-muted px-2 py-1 rounded-full">
            {debt.category === 'credit_card' ? 'Credit Card' : 
             debt.category === 'loan' ? 'Loan' : 
             debt.category === 'personal' ? 'Personal Loan' : 'Other'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-lg font-bold">${debt.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Interest Rate</p>
            <p className="text-lg font-bold">{debt.interestRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Min Payment</p>
            <p className="text-lg font-bold">${debt.minPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Due Date</p>
            <p className="text-lg font-bold flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              {formatDueDate(debt.dueDate)}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>Daily Micropayment</span>
            <span className="font-medium">${debt.micropaymentAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <Progress value={percentageOfMinPayment} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Monthly Total: ${dailyPaymentPerMonth.toFixed(2)}</span>
            <span>{percentageOfMinPayment.toFixed(0)}% of Min Payment</span>
          </div>
          <div className="flex space-x-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">Adjust</Button>
            <Button size="sm" className="flex-1">Pay Extra</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebtCard;
