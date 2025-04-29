
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  paidBy: string;
  participants: ExpenseParticipant[];
  notes?: string;
}

export interface ExpenseParticipant {
  userId: string;
  name: string;
  amount: number;
  paid: boolean;
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
  dueDate: number; // day of month
  category: 'credit_card' | 'loan' | 'personal' | 'other';
  micropaymentAmount?: number;
}

export interface MicroPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  actual: number;
  color: string;
}

export interface CreditScore {
  score: number;
  lastUpdated: string;
  factors: {
    paymentHistory: number; // percentage
    creditUtilization: number; // percentage
    creditAge: number; // months
    newCredit: number; // accounts
    creditMix: number; // accounts
  };
}

export interface CreditScoreSimulation {
  currentScore: number;
  projectedScore: number;
  actions: CreditScoreAction[];
}

export interface CreditScoreAction {
  description: string;
  impactPoints: number;
  timePeriod: string;
}
