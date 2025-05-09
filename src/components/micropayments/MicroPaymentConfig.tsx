
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { debts } from '@/data/mockData';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface MicroPaymentConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

const MicroPaymentConfig = ({ isOpen, onClose }: MicroPaymentConfigProps) => {
  const { toast } = useToast();
  const [debtSettings, setDebtSettings] = useState(
    debts.map(debt => ({
      id: debt.id,
      name: debt.name,
      enabled: true,
      amount: debt.micropaymentAmount || 0,
    }))
  );
  const [weekendPayments, setWeekendPayments] = useState(true);
  
  const handleSliderChange = (id: string, values: number[]) => {
    setDebtSettings(debtSettings.map(debt => 
      debt.id === id ? { ...debt, amount: values[0] } : debt
    ));
  };
  
  const handleToggleDebt = (id: string, enabled: boolean) => {
    setDebtSettings(debtSettings.map(debt => 
      debt.id === id ? { ...debt, enabled } : debt
    ));
  };
  
  const totalDailyAmount = debtSettings
    .filter(debt => debt.enabled)
    .reduce((sum, debt) => sum + debt.amount, 0);
  
  const handleSave = () => {
    // In a real app, this would update the data persistently
    toast({
      title: "Settings saved",
      description: `Your daily micropayment settings have been updated.`,
    });
    onClose();
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configure Micropayments</SheetTitle>
          <SheetDescription>
            Adjust how much you want to pay daily towards each debt.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Daily Amount</span>
              <span className="text-lg font-bold">${totalDailyAmount.toFixed(2)}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ${(totalDailyAmount * 30).toFixed(2)} estimated per month
            </div>
          </div>
          
          <div className="space-y-5">
            <h3 className="text-sm font-medium">Debt Allocation</h3>
            {debtSettings.map(debt => (
              <div key={debt.id} className="space-y-2 pb-4 border-b">
                <div className="flex justify-between items-center">
                  <Label className="font-medium">{debt.name}</Label>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={debt.enabled} 
                      onCheckedChange={(checked) => handleToggleDebt(debt.id, checked)} 
                    />
                    <span className="text-sm font-bold text-right w-16">
                      ${debt.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <Slider
                  disabled={!debt.enabled}
                  value={[debt.amount]}
                  min={0}
                  max={50}
                  step={0.5}
                  onValueChange={(values) => handleSliderChange(debt.id, values)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Advanced Settings</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Label htmlFor="weekend-payments">Weekend Payments</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-2 text-sm">
                    When enabled, micropayments will be processed on weekends. 
                    Disabling this will only process payments on weekdays.
                  </PopoverContent>
                </Popover>
              </div>
              <Switch 
                id="weekend-payments" 
                checked={weekendPayments}
                onCheckedChange={setWeekendPayments}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MicroPaymentConfig;
