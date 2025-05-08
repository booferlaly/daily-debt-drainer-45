
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpenseFiltersProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  activeTab,
  setActiveTab,
  categoryFilter,
  setCategoryFilter,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid grid-cols-4 w-full sm:w-auto text-xs">
          <TabsTrigger value="all" className="px-2 sm:px-3">All</TabsTrigger>
          <TabsTrigger value="owed" className="px-2 sm:px-3">They Owe</TabsTrigger>
          <TabsTrigger value="owe" className="px-2 sm:px-3">You Owe</TabsTrigger>
          <TabsTrigger value="settled" className="px-2 sm:px-3">Settled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex gap-2 items-center">
        <Select 
          value={categoryFilter} 
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-[140px] text-xs">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="housing">Housing</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="transportation">Transportation</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={sortOrder} 
          onValueChange={setSortOrder}
        >
          <SelectTrigger className="w-[140px] text-xs">
            <SelectValue placeholder="Most Recent" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest Amount</SelectItem>
            <SelectItem value="lowest">Lowest Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ExpenseFilters;
