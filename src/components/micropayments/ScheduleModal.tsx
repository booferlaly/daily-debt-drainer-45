
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal = ({ isOpen, onClose }: ScheduleModalProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState('');
  const [debtId, setDebtId] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [loading, setLoading] = useState(false);
  const [debts, setDebts] = useState([
    { id: "1", name: "Credit Card A" },
    { id: "2", name: "Student Loan" },
    { id: "3", name: "Car Loan" },
    { id: "4", name: "Personal Loan" },
  ]);

  const handleSchedule = async () => {
    if (!amount || !debtId || !selectedDate) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Call our new Edge Function
      const { data, error } = await supabase.functions.invoke('schedule-payment', {
        body: {
          debtId,
          amount: parseFloat(amount),
          paymentDate: selectedDate.toISOString(),
          frequency,
        }
      });
      
      if (error) throw new Error(error.message || 'Failed to schedule payment');
      
      toast({
        title: 'Payment Scheduled',
        description: `Your payment of $${amount} has been scheduled for ${selectedDate?.toLocaleDateString()}`,
      });
      
      onClose();
      setAmount('');
      setFrequency('once');
    } catch (error) {
      console.error('Error scheduling payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Micropayment</DialogTitle>
          <DialogDescription>
            Set up a scheduled micropayment to help reduce your debt.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="debt">Select Debt</Label>
            <Select value={debtId} onValueChange={setDebtId}>
              <SelectTrigger id="debt">
                <SelectValue placeholder="Select debt" />
              </SelectTrigger>
              <SelectContent>
                {debts.map((debt) => (
                  <SelectItem key={debt.id} value={debt.id}>
                    {debt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Payment Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">One time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSchedule} 
            disabled={loading || !amount || !debtId}
            className="gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Scheduling...' : 'Schedule Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
