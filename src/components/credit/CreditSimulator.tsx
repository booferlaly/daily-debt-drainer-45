
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditScoreAction } from '@/types/models';

interface CreditSimulatorProps {
  currentScore: number;
  projectedScore: number;
  actions: CreditScoreAction[];
}

const CreditSimulator = ({ 
  currentScore, 
  projectedScore, 
  actions 
}: CreditSimulatorProps) => {
  const [selectedActions, setSelectedActions] = useState<number[]>([]);
  const [simulatedScore, setSimulatedScore] = useState(currentScore);
  
  const toggleAction = (index: number) => {
    setSelectedActions(prev => {
      if (prev.includes(index)) {
        // Remove action
        const newScore = simulatedScore - actions[index].impactPoints;
        setSimulatedScore(newScore);
        return prev.filter(i => i !== index);
      } else {
        // Add action
        const newScore = simulatedScore + actions[index].impactPoints;
        setSimulatedScore(newScore);
        return [...prev, index];
      }
    });
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setSelectedActions([]);
    setSimulatedScore(currentScore);
  };
  
  // Select all actions
  const selectAllActions = () => {
    const allIndices = actions.map((_, index) => index);
    setSelectedActions(allIndices);
    
    const totalImpact = actions.reduce((sum, action) => sum + action.impactPoints, 0);
    setSimulatedScore(currentScore + totalImpact);
  };
  
  // Helper function to determine score category
  const getScoreCategory = (score: number) => {
    if (score >= 800) return { category: 'Excellent', color: '#10B981' };
    if (score >= 740) return { category: 'Very Good', color: '#34D399' };
    if (score >= 670) return { category: 'Good', color: '#3B82F6' };
    if (score >= 580) return { category: 'Fair', color: '#F59E0B' };
    return { category: 'Poor', color: '#EF4444' };
  };
  
  const { category: currentCategory } = getScoreCategory(currentScore);
  const { category: simulatedCategory, color: simulatedColor } = getScoreCategory(simulatedScore);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Score Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current</p>
              <p className="text-3xl font-bold">{currentScore}</p>
              <p className="text-sm">{currentCategory}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center text-2xl text-muted-foreground px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Simulated</p>
              <p className="text-3xl font-bold" style={{ color: simulatedColor }}>
                {simulatedScore}
              </p>
              <p className="text-sm" style={{ color: simulatedColor }}>
                {simulatedCategory}
              </p>
            </div>
          </div>
          
          <div className="w-full pt-6 pb-2">
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={resetSimulation}>Reset</Button>
              <Button variant="outline" size="sm" onClick={selectAllActions}>Select All</Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm font-medium">Select actions to simulate:</p>
          {actions.map((action, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedActions.includes(index) 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleAction(index)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">{action.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated time: {action.timePeriod}
                  </p>
                </div>
                <div className="ml-4 text-center">
                  <span className={`font-bold ${selectedActions.includes(index) ? 'text-primary' : ''}`}>
                    +{action.impactPoints}
                  </span>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditSimulator;
