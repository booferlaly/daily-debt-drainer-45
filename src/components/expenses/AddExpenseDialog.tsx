
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  CreditCard, 
  Utensils, 
  Home, 
  Zap, 
  Car, 
  Film, 
  PackageOpen 
} from "lucide-react";
import { createExpense, getCurrentUser } from '@/services/database';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type AddExpenseDialogProps = {
  onExpenseAdded: (newExpense: any) => void;
};

// Create a schema for form validation
const expenseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.string().min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  category: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

const AddExpenseDialog = ({ onExpenseAdded }: AddExpenseDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string, name: string } | null>(null);
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      title: '',
      amount: '',
      category: '',
      notes: ''
    }
  });

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser({
            id: user.id,
            name: user.name
          });
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch user information',
          variant: 'destructive'
        });
      }
    };

    fetchCurrentUser();
  }, [toast]);

  const handleSubmit = async (data: ExpenseFormValues) => {
    if (!currentUser) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add expenses',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Create participants array with only current user
      const participants = [
        {
          user_id: currentUser.id,
          name: currentUser.name,
          amount: parseFloat(data.amount),
          paid: true // Current user paid the expense
        }
      ];
      
      // Create the expense
      const newExpense = await createExpense({
        title: data.title,
        amount: parseFloat(data.amount),
        category: data.category,
        notes: data.notes,
        participants
      });
      
      onExpenseAdded(newExpense);
      setOpen(false);
      resetForm();
      
      toast({
        title: 'Success',
        description: 'Expense added successfully',
      });
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add expense',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    form.reset();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Dinner, Groceries, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="food">
                          <div className="flex items-center gap-2">
                            <Utensils className="h-4 w-4" />
                            <span>Food</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="housing">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span>Housing</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="utilities">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            <span>Utilities</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="transportation">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            <span>Transportation</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="entertainment">
                          <div className="flex items-center gap-2">
                            <Film className="h-4 w-4" />
                            <span>Entertainment</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="credit_card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Credit Card</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="other">
                          <div className="flex items-center gap-2">
                            <PackageOpen className="h-4 w-4" />
                            <span>Other</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any additional details here"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Expense'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
