
import React from 'react';
import { debts, microPayments } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MicroPaymentStats from '@/components/micropayments/MicroPaymentStats';
import { CalendarClock, CreditCard, Settings } from 'lucide-react';

const MicropaymentsPage = () => {
  const totalDailyAmount = debts.reduce((sum, debt) => sum + (debt.micropaymentAmount || 0), 0);
  const totalMonthlyAmount = totalDailyAmount * 30;
  
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Micropayments</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Settings className="h-4 w-4" />
            <span>Configure</span>
          </Button>
          <Button className="flex gap-2">
            <CalendarClock className="h-4 w-4" />
            <span>Schedule</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
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
        
        <MicroPaymentStats />
      </div>
      
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
    </div>
  );
};

export default MicropaymentsPage;
