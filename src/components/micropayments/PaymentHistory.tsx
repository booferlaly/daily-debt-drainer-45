
import React from 'react';
import { microPayments, debts } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const PaymentHistory = () => {
  // Group micropayments by date
  const groupedMicroPayments = microPayments.reduce((acc, payment) => {
    if (!acc[payment.date]) {
      acc[payment.date] = [];
    }
    acc[payment.date].push(payment);
    return acc;
  }, {} as Record<string, typeof microPayments>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedMicroPayments).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Get debt name by id
  const getDebtName = (debtId: string) => {
    const debt = debts.find(d => d.id === debtId);
    return debt ? debt.name : 'Unknown';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment History</h2>
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-0">
              {sortedDates.map(date => {
                const payments = groupedMicroPayments[date].filter(p => p.status === 'pending');
                if (payments.length === 0) return null;
                
                return (
                  <div key={date} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{formatDate(date)}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} total
                      </p>
                    </div>
                    <div className="space-y-2">
                      {payments.map(payment => (
                        <div key={payment.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/10">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-warning"></div>
                            <span>{getDebtName(payment.debtId)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-warning/10 text-warning">
                              Pending
                            </Badge>
                            <span className="font-medium">${payment.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              {sortedDates.map(date => {
                const payments = groupedMicroPayments[date].filter(p => p.status === 'completed');
                if (payments.length === 0) return null;
                
                return (
                  <div key={date} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{formatDate(date)}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} total
                      </p>
                    </div>
                    <div className="space-y-2">
                      {payments.map(payment => (
                        <div key={payment.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/10">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success"></div>
                            <span>{getDebtName(payment.debtId)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-success/10 text-success">
                              Completed
                            </Badge>
                            <span className="font-medium">${payment.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              {sortedDates.map(date => (
                <div key={date} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{formatDate(date)}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${groupedMicroPayments[date].reduce((sum, p) => sum + p.amount, 0).toFixed(2)} total
                    </p>
                  </div>
                  <div className="space-y-2">
                    {groupedMicroPayments[date].map(payment => (
                      <div key={payment.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/10">
                        <div className="flex items-center gap-2">
                          <div 
                            className={`w-2 h-2 rounded-full ${
                              payment.status === 'completed' ? 'bg-success' : 
                              payment.status === 'pending' ? 'bg-warning' : 
                              'bg-debt'
                            }`}
                          ></div>
                          <span>{getDebtName(payment.debtId)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={`
                              ${payment.status === 'completed' ? 'bg-success/10 text-success' : ''}
                              ${payment.status === 'pending' ? 'bg-warning/10 text-warning' : ''}
                              ${payment.status === 'failed' ? 'bg-debt/10 text-debt' : ''}
                            `}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                          <span className="font-medium">${payment.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
