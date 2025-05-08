
import { 
  Debt, 
  Expense, 
  MicroPayment, 
  BudgetCategory,
  CreditScore
} from "@/types/models";

// Sample Users
export const currentUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
};

export const friends = [
  { id: "user-2", name: "Jane Smith", email: "jane@example.com" },
  { id: "user-3", name: "Mike Johnson", email: "mike@example.com" },
  { id: "user-4", name: "Sara Wilson", email: "sara@example.com" },
];

// Sample Expenses
export const expenses: Expense[] = [
  {
    id: "exp-1",
    title: "Dinner at Italian Restaurant",
    amount: 120.50,
    date: "2024-04-25",
    category: "Food",
    user_id: "user-1",
    participants: [
      { id: "p-1", user_id: "user-1", name: "You", amount: 30.12, paid: true, expense_id: "exp-1" },
      { id: "p-2", user_id: "user-2", name: "Jane Smith", amount: 30.13, paid: false, expense_id: "exp-1" },
      { id: "p-3", user_id: "user-3", name: "Mike Johnson", amount: 30.12, paid: false, expense_id: "exp-1" },
      { id: "p-4", user_id: "user-4", name: "Sara Wilson", amount: 30.13, paid: false, expense_id: "exp-1" },
    ],
    notes: "Great dinner with friends",
  },
  {
    id: "exp-2",
    title: "Apartment Rent",
    amount: 2400,
    date: "2024-04-01",
    category: "Housing",
    user_id: "user-1",
    participants: [
      { id: "p-5", user_id: "user-1", name: "You", amount: 1200, paid: true, expense_id: "exp-2" },
      { id: "p-6", user_id: "user-3", name: "Mike Johnson", amount: 1200, paid: true, expense_id: "exp-2" },
    ],
  },
  {
    id: "exp-3",
    title: "Groceries",
    amount: 85.25,
    date: "2024-04-22",
    category: "Food",
    user_id: "user-1",
    participants: [
      { id: "p-7", user_id: "user-1", name: "You", amount: 42.62, paid: true, expense_id: "exp-3" },
      { id: "p-8", user_id: "user-3", name: "Mike Johnson", amount: 42.63, paid: false, expense_id: "exp-3" },
    ],
  },
  {
    id: "exp-4",
    title: "Utilities",
    amount: 145.80,
    date: "2024-04-15",
    category: "Utilities",
    user_id: "user-3",
    participants: [
      { id: "p-9", user_id: "user-1", name: "You", amount: 48.60, paid: false, expense_id: "exp-4" },
      { id: "p-10", user_id: "user-2", name: "Jane Smith", amount: 48.60, paid: false, expense_id: "exp-4" },
      { id: "p-11", user_id: "user-3", name: "Mike Johnson", amount: 48.60, paid: true, expense_id: "exp-4" },
    ],
  },
];

// Sample Debt Data
export const debts: Debt[] = [
  {
    id: "debt-1",
    name: "Chase Sapphire",
    balance: 4500.75,
    interestRate: 16.99,
    minPayment: 85,
    dueDate: 15, // 15th of each month
    category: "credit_card",
    micropaymentAmount: 3.00,
  },
  {
    id: "debt-2",
    name: "Citi Double Cash",
    balance: 2250.30,
    interestRate: 14.75,
    minPayment: 45,
    dueDate: 5,
    category: "credit_card",
    micropaymentAmount: 1.50,
  },
  {
    id: "debt-3",
    name: "Student Loan",
    balance: 18500.00,
    interestRate: 4.5,
    minPayment: 210,
    dueDate: 28,
    category: "loan",
    micropaymentAmount: 7.00,
  },
  {
    id: "debt-4",
    name: "Personal Loan",
    balance: 3000,
    interestRate: 9.99,
    minPayment: 125,
    dueDate: 10,
    category: "personal",
    micropaymentAmount: 4.20,
  },
];

// Sample Micropayments
export const microPayments: MicroPayment[] = [
  {
    id: "mp-1",
    debtId: "debt-1",
    amount: 3.00,
    date: "2024-04-29",
    status: "completed",
  },
  {
    id: "mp-2",
    debtId: "debt-1",
    amount: 3.00,
    date: "2024-04-28",
    status: "completed",
  },
  {
    id: "mp-3",
    debtId: "debt-2",
    amount: 1.50,
    date: "2024-04-29",
    status: "completed",
  },
  {
    id: "mp-4",
    debtId: "debt-3",
    amount: 7.00,
    date: "2024-04-29",
    status: "completed",
  },
  {
    id: "mp-5",
    debtId: "debt-4",
    amount: 4.20,
    date: "2024-04-29",
    status: "completed",
  },
  {
    id: "mp-6",
    debtId: "debt-1",
    amount: 3.00,
    date: "2024-04-30",
    status: "pending",
  },
  {
    id: "mp-7",
    debtId: "debt-2",
    amount: 1.50,
    date: "2024-04-30",
    status: "pending",
  },
];

// Sample Budget Categories
export const budgetCategories: BudgetCategory[] = [
  { 
    id: "budget-1", 
    name: "Housing", 
    planned: 1200, 
    actual: 1200, 
    color: "#10B981" 
  },
  { 
    id: "budget-2", 
    name: "Food", 
    planned: 500, 
    actual: 620, 
    color: "#F59E0B" 
  },
  { 
    id: "budget-3", 
    name: "Transportation", 
    planned: 200, 
    actual: 180, 
    color: "#3B82F6" 
  },
  { 
    id: "budget-4", 
    name: "Entertainment", 
    planned: 150, 
    actual: 200, 
    color: "#8B5CF6" 
  },
  { 
    id: "budget-5", 
    name: "Utilities", 
    planned: 250, 
    actual: 235, 
    color: "#EC4899" 
  },
  { 
    id: "budget-6", 
    name: "Debt Payments", 
    planned: 400, 
    actual: 400, 
    color: "#6366F1" 
  },
];

// Sample Credit Score
export const creditScore: CreditScore = {
  score: 680,
  lastUpdated: "2024-04-15",
  factors: {
    paymentHistory: 98, // percentage
    creditUtilization: 45, // percentage
    creditAge: 72, // months
    newCredit: 2, // accounts
    creditMix: 4, // accounts
  }
};

// Sample Credit Score Simulation
export const creditScoreSimulations = {
  currentScore: 680,
  projectedScore: 720,
  actions: [
    {
      description: "Pay down Chase Sapphire to below 30% utilization",
      impactPoints: 18,
      timePeriod: "1-3 months"
    },
    {
      description: "Pay down Citi Double Cash to below 30% utilization",
      impactPoints: 12,
      timePeriod: "1-2 months"
    },
    {
      description: "Make all monthly payments on time",
      impactPoints: 10,
      timePeriod: "3-6 months"
    }
  ]
};

// Helper Functions
export const calculateTotalDebt = (): number => {
  return debts.reduce((sum, debt) => sum + debt.balance, 0);
};

export const calculateDailyMicropayments = (): number => {
  return debts.reduce((sum, debt) => sum + (debt.micropaymentAmount || 0), 0);
};

export const calculateMonthlyDebtPayment = (): number => {
  return debts.reduce((sum, debt) => sum + debt.minPayment, 0);
};

export const calculateTotalOwedToYou = (): number => {
  return expenses
    .filter(expense => expense.user_id === currentUser.id)
    .flatMap(expense => expense.participants)
    .filter(participant => participant.user_id !== currentUser.id && !participant.paid)
    .reduce((sum, participant) => sum + participant.amount, 0);
};

export const calculateTotalYouOwe = (): number => {
  return expenses
    .filter(expense => expense.user_id !== currentUser.id)
    .flatMap(expense => expense.participants)
    .filter(participant => participant.user_id === currentUser.id && !participant.paid)
    .reduce((sum, participant) => sum + participant.amount, 0);
};

export const calculateBudgetTotals = () => {
  const planned = budgetCategories.reduce((sum, cat) => sum + cat.planned, 0);
  const actual = budgetCategories.reduce((sum, cat) => sum + cat.actual, 0);
  return { planned, actual, difference: planned - actual };
};
