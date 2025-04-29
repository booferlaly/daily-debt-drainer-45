
import { CreditScore } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreditScoreGaugeProps {
  creditScore: CreditScore;
}

const CreditScoreGauge = ({ creditScore }: CreditScoreGaugeProps) => {
  const { score } = creditScore;
  
  // Helper function to determine score category
  const getScoreCategory = (score: number) => {
    if (score >= 800) return { category: 'Excellent', color: '#10B981' };
    if (score >= 740) return { category: 'Very Good', color: '#34D399' };
    if (score >= 670) return { category: 'Good', color: '#3B82F6' };
    if (score >= 580) return { category: 'Fair', color: '#F59E0B' };
    return { category: 'Poor', color: '#EF4444' };
  };
  
  const { category, color } = getScoreCategory(score);
  
  // Calculate position on the gauge (300-850 scale)
  const minScore = 300;
  const maxScore = 850;
  const scoreRange = maxScore - minScore;
  const position = ((score - minScore) / scoreRange) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="mb-6 w-full max-w-md">
          {/* Gauge container */}
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mt-4">
            {/* Score ranges indicator */}
            <div className="absolute inset-0 flex">
              <div className="h-full w-1/5 bg-debt"></div>
              <div className="h-full w-1/5 bg-warning"></div>
              <div className="h-full w-1/5 bg-info"></div>
              <div className="h-full w-1/5 bg-[#34D399]"></div>
              <div className="h-full w-1/5 bg-success"></div>
            </div>
            
            {/* Score pointer */}
            <div 
              className="absolute top-0 w-0 h-0 pointer-events-none"
              style={{ 
                left: `${position}%`, 
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: `12px solid ${color}`,
                transform: 'translateX(-8px)',
                filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))'
              }}
            ></div>
          </div>
          
          {/* Score number display */}
          <div className="flex justify-between text-xs mt-1">
            <span>300</span>
            <span>850</span>
          </div>
          
          {/* Score category labels */}
          <div className="flex justify-between text-xs mt-1 px-2">
            <span className="text-debt">Poor</span>
            <span className="text-warning">Fair</span>
            <span className="text-info">Good</span>
            <span className="text-success">Excellent</span>
          </div>
        </div>
        
        {/* Score value and category */}
        <div className="text-center">
          <div className="text-5xl font-bold" style={{ color }}>
            {score}
          </div>
          <div 
            className="text-lg font-medium mt-1 mb-3"
            style={{ color }}
          >
            {category}
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(creditScore.lastUpdated).toLocaleDateString()}
          </div>
        </div>
        
        {/* Credit factors */}
        <div className="grid grid-cols-2 gap-4 w-full mt-6">
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-xs text-muted-foreground">Payment History</p>
            <p className="text-lg font-bold">{creditScore.factors.paymentHistory}%</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-xs text-muted-foreground">Credit Utilization</p>
            <p className="text-lg font-bold">{creditScore.factors.creditUtilization}%</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-xs text-muted-foreground">Credit Age</p>
            <p className="text-lg font-bold">{Math.floor(creditScore.factors.creditAge / 12)} yr {creditScore.factors.creditAge % 12} mo</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-xs text-muted-foreground">Credit Mix</p>
            <p className="text-lg font-bold">{creditScore.factors.creditMix} accounts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditScoreGauge;
