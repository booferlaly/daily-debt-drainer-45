
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type AddBudgetCategoryDialogProps = {
  onCategoryAdded: (newCategory: any) => void;
};

// Create a schema for form validation
const budgetCategoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  planned: z.string().min(1, "Planned amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  color: z.string().min(1, "Color is required"),
});

type BudgetCategoryFormValues = z.infer<typeof budgetCategoryFormSchema>;

// Predefined color options
const colorOptions = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Red", value: "#EF4444" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
];

const AddBudgetCategoryDialog = ({ onCategoryAdded }: AddBudgetCategoryDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<BudgetCategoryFormValues>({
    resolver: zodResolver(budgetCategoryFormSchema),
    defaultValues: {
      name: '',
      planned: '',
      color: '#3B82F6', // Default color
    }
  });

  const handleSubmit = async (data: BudgetCategoryFormValues) => {
    try {
      setLoading(true);
      
      // Create the new budget category
      const newCategory = {
        id: crypto.randomUUID(),
        name: data.name,
        planned: parseFloat(data.planned),
        actual: 0, // New categories start with 0 actual spending
        color: data.color,
      };
      
      // Here you would normally make an API call to save the category
      
      onCategoryAdded(newCategory);
      setOpen(false);
      resetForm();
      
      toast({
        title: 'Success',
        description: 'Budget category added successfully',
      });
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add budget category',
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
          <span>Add Budget Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Budget Category</DialogTitle>
          <DialogDescription>
            Create a new budget category to track your spending.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Housing, Food, Transportation, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="planned"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planned Budget ($)</FormLabel>
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
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map((color) => (
                        <div
                          key={color.value}
                          className={`w-full aspect-square rounded-md cursor-pointer border-2 ${
                            field.value === color.value ? 'border-primary' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => form.setValue('color', color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgetCategoryDialog;
