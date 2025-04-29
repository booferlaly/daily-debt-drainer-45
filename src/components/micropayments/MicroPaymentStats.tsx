
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart } from '@/components/ui/chart';

const MicroPaymentStats = () => {
  const [timeframe, setTimeframe] = useState('month');
  
  // Mock data for charts
  const monthlyData = [
    {
      name: "Week 1",
      amount: 92.40,
    },
    {
      name: "Week 2",
      amount: 97.65,
    },
    {
      name: "Week 3",
      amount: 105.00,
    },
    {
      name: "Week 4",
      amount: 105.70,
    },
  ];
  
  const dailyData = [
    {
      name: "Mon",
      amount: 15.70,
    },
    {
      name: "Tue",
      amount: 15.70,
    },
    {
      name: "Wed",
      amount: 15.70,
    },
    {
      name: "Thu",
      amount: 15.70,
    },
    {
      name: "Fri",
      amount: 15.70,
    },
    {
      name: "Sat",
      amount: 15.70,
    },
    {
      name: "Sun",
      amount: 15.70,
    },
  ];

  // Projection data showing balance reduction over time
  const projectionData = [
    { name: 'May', debt: 28251 },
    { name: 'Jun', debt: 27500 },
    { name: 'Jul', debt: 26723 },
    { name: 'Aug', debt: 25921 },
    { name: 'Sep', debt: 25094 },
    { name: 'Oct', debt: 24241 },
    { name: 'Nov', debt: 23361 },
    { name: 'Dec', debt: 22456 },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Micropayment Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity" className="w-full">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="projection">Projection</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="space-y-4">
            <div className="flex justify-end mb-2">
              <div className="inline-flex items-center rounded-md border border-input bg-transparent p-1">
                <button
                  onClick={() => setTimeframe('week')}
                  className={`px-3 py-1 text-sm rounded-sm ${timeframe === 'week' ? 'bg-primary text-white' : ''}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeframe('month')}
                  className={`px-3 py-1 text-sm rounded-sm ${timeframe === 'month' ? 'bg-primary text-white' : ''}`}
                >
                  Month
                </button>
              </div>
            </div>
            
            <div className="h-[300px]">
              <BarChart
                data={timeframe === 'week' ? dailyData : monthlyData}
                index="name"
                categories={["amount"]}
                colors={["#10b981"]}
                yAxisWidth={48}
                showXAxis
                showYAxis
                showLegend={false}
                valueFormatter={(value: number) => `$${value.toFixed(2)}`}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Total This Month</p>
                <p className="text-2xl font-bold">$400.75</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Daily Average</p>
                <p className="text-2xl font-bold">$15.70</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="projection">
            <p className="text-sm text-muted-foreground mb-4">
              Projected debt balance based on your current micropayment plan
            </p>
            <div className="h-[300px]">
              <LineChart
                data={projectionData}
                index="name"
                categories={["debt"]}
                colors={["#10b981"]}
                valueFormatter={(value: number) => `$${value.toLocaleString()}`}
                yAxisWidth={65}
                showXAxis
                showYAxis
                showLegend={false}
                showTooltip={true}
              />
            </div>
            <div className="mt-4 p-3 bg-success/10 rounded-md">
              <p className="text-sm font-medium text-success">
                With your current plan, you'll reduce your debt by $5,795 in the next 8 months!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MicroPaymentStats;
