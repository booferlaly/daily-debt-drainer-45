
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, CreditCard, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutoPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AutoPayModal = ({ isOpen, onClose }: AutoPayModalProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentDay, setPaymentDay] = useState<string>('daily');
  const [isRemindersEnabled, setIsRemindersEnabled] = useState<boolean>(true);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please enter your payment method details.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Auto Pay Enabled",
      description: `Your ${paymentDay} micropayments will be processed automatically.`,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Up Auto Pay</DialogTitle>
          <DialogDescription>
            Configure automatic payments for your daily debt micropayments.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <div className="flex items-center space-x-2 p-4 border rounded-md">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <Input 
                  id="payment-method" 
                  placeholder="Card Number (e.g. 4242 4242 4242 4242)"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border-0 p-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="MM/YY" className="col-span-1" />
                <Input placeholder="CVC" className="col-span-1" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Frequency</Label>
              <RadioGroup defaultValue="daily" onValueChange={setPaymentDay} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="flex-1 cursor-pointer">
                    Daily Payments
                  </Label>
                  <span className="text-sm text-muted-foreground">Recommended</span>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly" className="flex-1 cursor-pointer">Weekly Payments</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center justify-between border rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="notifications" className="cursor-pointer">
                  Payment Reminders
                </Label>
              </div>
              <Switch 
                id="notifications" 
                checked={isRemindersEnabled} 
                onCheckedChange={setIsRemindersEnabled} 
              />
            </div>
            
            <div className="bg-amber-50 border-amber-200 border rounded-md p-3 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium">Remember:</p>
                <p>You can cancel auto payments at any time from your account settings.</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Enable Auto Pay</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AutoPayModal;
