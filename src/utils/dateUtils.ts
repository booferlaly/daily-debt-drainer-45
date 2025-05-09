
import { Debt } from "@/types/models";

/**
 * Calculate due dates for a specific month based on debt due dates
 */
export const calculateDueDatesForMonth = (month: Date, debts: Debt[]) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  
  return debts.map(debt => {
    // Create a date object for the due date in the specified month
    const date = new Date(year, monthIndex, debt.dueDate);
    return { debt, date };
  });
};
