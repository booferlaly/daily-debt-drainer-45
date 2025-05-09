
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, getDaysInMonth, isToday, isFuture, isPast, addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Debt } from "@/types/models";
import { CreditCard, FileText, Wallet } from "lucide-react";

interface DebtDueListProps {
  debts: Debt[];
  currentMonth: Date;
}

const DebtDueList = ({ debts, currentMonth }: DebtDueListProps) => {
  // Create a copy of the month to work with
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  // Map debts to dates in the current month
  const dueItems = debts.map(debt => {
    const dueDate = new Date(year, month, debt.dueDate);
    return { debt, dueDate };
  });
  
  // Sort by date
  dueItems.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  // Function to get status badge for a due date
  const getStatusBadge = (date: Date) => {
    if (isToday(date)) {
      return <Badge className="bg-red-500 hover:bg-red-600">Due Today</Badge>;
    } else if (isPast(date)) {
      return <Badge variant="destructive">Past Due</Badge>;
    } else if (isFuture(date) && date < addDays(new Date(), 7)) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Due Soon</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  // Function to get an icon based on debt category
  const getDebtIcon = (category: string) => {
    switch (category) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'loan':
        return <FileText className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Due Dates for {format(currentMonth, 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dueItems.map(({ debt, dueDate }) => (
            <div key={debt.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {getDebtIcon(debt.category)}
                </div>
                <div>
                  <h3 className="font-medium">{debt.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${debt.minPayment.toFixed(2)} due on {format(dueDate, 'MMMM d')}
                  </p>
                </div>
              </div>
              <div>
                {getStatusBadge(dueDate)}
              </div>
            </div>
          ))}
          
          {dueItems.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No payments due this month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebtDueList;
