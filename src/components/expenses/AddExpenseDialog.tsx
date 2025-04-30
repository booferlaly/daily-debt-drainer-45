
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '@/data/mockData';

type AddExpenseDialogProps = {
  onExpenseAdded: (newExpense: any) => void;
};

// Sample user data for dropdown
const sampleUsers = [
  { id: 'user-2', name: 'John Doe' },
  { id: 'user-3', name: 'Jane Smith' },
  { id: 'user-4', name: 'Mike Johnson' },
];

const AddExpenseDialog = ({ onExpenseAdded }: AddExpenseDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !amount || !category || participants.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newExpense = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      category,
      paidBy: 'user-1',  // Current logged in user
      participants: [
        { userId: 'user-1', name: 'You', amount: 0, paid: true },
        ...participants.map(userId => {
          const user = sampleUsers.find(u => u.id === userId);
          const participantAmount = parseFloat(amount) / (participants.length + 1);
          return {
            userId,
            name: user?.name || 'Unknown',
            amount: participantAmount,
            paid: false
          };
        })
      ]
    };
    
    onExpenseAdded(newExpense);
    setOpen(false);
    resetForm();
    
    toast({
      title: "Success",
      description: "Expense added successfully",
    });
  };
  
  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setParticipants([]);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="sm:w-auto flex gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Enter the details of your expense below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Dinner, Groceries, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input 
                id="amount" 
                type="number" 
                step="0.01"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="participants">Split with</Label>
              <Select 
                value={participants.join(',')} 
                onValueChange={(val) => setParticipants(val ? val.split(',') : [])}
              >
                <SelectTrigger id="participants">
                  <SelectValue placeholder="Select people" />
                </SelectTrigger>
                <SelectContent>
                  {sampleUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
