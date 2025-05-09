
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ShoppingCart, 
  Home, 
  Utensils, 
  Car, 
  PiggyBank, 
  CreditCard, 
  Clock, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";

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
    <div className="space-y-4 mb-6">
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full sm:w-auto text-xs">
          <TabsTrigger value="all" className="px-2 sm:px-3">All</TabsTrigger>
          <TabsTrigger value="owed" className="px-2 sm:px-3">They Owe</TabsTrigger>
          <TabsTrigger value="owe" className="px-2 sm:px-3">You Owe</TabsTrigger>
          <TabsTrigger value="settled" className="px-2 sm:px-3">Settled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-wrap gap-2 items-center">
        <Select 
          value={categoryFilter} 
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-[140px] text-xs">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>All Categories</span>
              </div>
            </SelectItem>
            <SelectItem value="food">
              <div className="flex items-center gap-2">
                <Utensils className="h-3.5 w-3.5" />
                <span>Food</span>
              </div>
            </SelectItem>
            <SelectItem value="housing">
              <div className="flex items-center gap-2">
                <Home className="h-3.5 w-3.5" />
                <span>Housing</span>
              </div>
            </SelectItem>
            <SelectItem value="utilities">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-3.5 w-3.5" />
                <span>Utilities</span>
              </div>
            </SelectItem>
            <SelectItem value="transportation">
              <div className="flex items-center gap-2">
                <Car className="h-3.5 w-3.5" />
                <span>Transportation</span>
              </div>
            </SelectItem>
            <SelectItem value="entertainment">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Entertainment</span>
              </div>
            </SelectItem>
            <SelectItem value="credit_card">
              <div className="flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Credit Card</span>
              </div>
            </SelectItem>
            <SelectItem value="other">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Other</span>
              </div>
            </SelectItem>
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
            <SelectItem value="recent">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Most Recent</span>
              </div>
            </SelectItem>
            <SelectItem value="oldest">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Oldest</span>
              </div>
            </SelectItem>
            <SelectItem value="highest">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-3.5 w-3.5" />
                <span>Highest Amount</span>
              </div>
            </SelectItem>
            <SelectItem value="lowest">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-3.5 w-3.5" />
                <span>Lowest Amount</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ExpenseFilters;
