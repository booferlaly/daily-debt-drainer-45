
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
import { supabase } from '@/integrations/supabase/client';

type AddExpenseDialogProps = {
  onExpenseAdded: (newExpense: any) => void;
};

const AddExpenseDialog = ({ onExpenseAdded }: AddExpenseDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{id: string, name: string}[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string, name: string } | null>(null);
  
  const form = useForm({
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

  // For simplicity, we'll fetch a few random users from the profiles table
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .limit(10);
        
        if (error) throw error;
        
        // Filter out current user and map to required format
        const otherUsers = data
          .filter(user => user.id !== currentUser?.id)
          .map(user => ({
            id: user.id,
            name: user.full_name || 'Unknown User'
          }));
        
        setUsers(otherUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        // If we can't get real users, use some dummy data
        setUsers([
          { id: 'user-2', name: 'John Doe' },
          { id: 'user-3', name: 'Jane Smith' },
          { id: 'user-4', name: 'Mike Johnson' },
        ]);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleSubmit = async (data: any) => {
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
      
      // Calculate split amount
      const totalParticipants = selectedUsers.length + 1; // +1 for current user
      const amountPerPerson = parseFloat(data.amount) / totalParticipants;
      
      // Create participants array
      const participants = [
        {
          user_id: currentUser.id,
          name: currentUser.name,
          amount: amountPerPerson,
          paid: true // Current user paid the expense
        },
        ...selectedUsers.map(userId => {
          const user = users.find(u => u.id === userId);
          return {
            user_id: userId,
            name: user?.name || 'Unknown',
            amount: amountPerPerson,
            paid: false
          };
        })
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
    setSelectedUsers([]);
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
              
              <div>
                <Label htmlFor="participants">Split with</Label>
                <Select 
                  value={selectedUsers.join(',')} 
                  onValueChange={(val) => setSelectedUsers(val ? val.split(',') : [])}
                >
                  <SelectTrigger id="participants">
                    <SelectValue placeholder="Select people" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
