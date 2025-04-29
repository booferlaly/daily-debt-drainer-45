
import { BudgetCategory } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart } from '@/components/ui/chart';

interface BudgetOverviewProps {
  categories: BudgetCategory[];
  totals: {
    planned: number;
    actual: number;
    difference: number;
  };
}

const BudgetOverview = ({ categories, totals }: BudgetOverviewProps) => {
  const chartData = categories.map(cat => ({
    name: cat.name,
    value: cat.actual,
  }));
  
  const colors = categories.map(cat => cat.color);
  
  const overBudget = totals.difference < 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Monthly Budget</h3>
                <span className="text-sm text-muted-foreground">
                  {Math.abs(totals.difference).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} {overBudget ? 'over' : 'under'} budget
                </span>
              </div>
              <Progress 
                value={Math.min((totals.actual / totals.planned) * 100, 100)} 
                className={`h-2 ${overBudget ? "bg-debt/30" : ""}`} 
              />
              <div className="flex justify-between text-xs mt-1">
                <span>Spent: {totals.actual.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                <span>Budget: {totals.planned.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {categories.map(category => {
                const percentUsed = (category.actual / category.planned) * 100;
                const isOverBudget = category.actual > category.planned;
                
                return (
                  <div key={category.id}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span>{category.name}</span>
                      </div>
                      <div className="text-right">
                        <span 
                          className={isOverBudget ? "text-debt" : ""}
                        >
                          {category.actual.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                        <span className="text-muted-foreground text-xs ml-1">
                          / {category.planned.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(percentUsed, 100)} 
                      className={`h-1 ${isOverBudget ? "bg-debt/30" : ""}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="h-[300px] flex items-center justify-center">
            <PieChart
              data={chartData}
              index="name"
              categories={["value"]}
              colors={colors}
              valueFormatter={(value: number) => `$${value.toLocaleString()}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;
