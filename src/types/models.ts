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
  user_id: string;
  participants?: ExpenseParticipant[];
  notes?: string;
  created_at?: string;
}

export interface ExpenseParticipant {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
  user_id: string;
  expense_id: string;
  created_at?: string;
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

export interface CreditBureau {
  id: string;
  name: string;
  description: string;
  logo?: string;
}

export interface CreditReportingStatus {
  id: string;
  debtId: string;
  bureauId: string;
  lastReported: string | null;
  status: 'pending' | 'verified' | 'reported' | 'error';
  nextReportDate: string | null;
  isActive: boolean;
}

// New interfaces for financial account connections
export interface FinancialAccount {
  id: string;
  userId: string;
  institutionId: string;
  accountName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'loan' | 'investment' | 'other';
  accountNumber: string; // Last 4 digits only for security
  currentBalance: number;
  availableBalance?: number;
  currency: string;
  isActive: boolean;
  lastUpdated: string;
  accountMask?: string; // Masked account number (e.g., "****1234")
  externalId: string; // ID from the financial provider
}

export interface FinancialInstitution {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  url?: string;
  oauth: boolean; // Whether the institution supports OAuth
  products: string[]; // Array of supported products like 'transactions', 'auth', 'identity'
}

export interface AccountConnection {
  id: string;
  userId: string;
  institutionId: string;
  accessToken: string; // Encrypted access token from the financial provider
  itemId: string; // Reference ID for the connection
  status: 'active' | 'pending' | 'error' | 'disconnected';
  error?: string;
  consentExpiration?: string; // When user consent expires
  lastUpdated: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  merchantName?: string;
  pending: boolean;
  externalId: string; // ID from the financial provider
}

// Plaid types
export interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balances?: {
    available: number | null;
    current: number | null;
    limit: number | null;
    iso_currency_code: string | null;
    unofficial_currency_code: string | null;
  };
}

export interface PlaidLinkResult {
  access_token: string;
  item_id: string;
  accounts: PlaidAccount[];
}

export interface PlaidItem {
  id: string;
  user_id: string;
  item_id: string;
  access_token: string;
  created_at: string;
}

export interface StoredPlaidAccount {
  id: string;
  user_id: string;
  item_id: string;
  account_id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  institution_id: string | null;
  available_balance: number | null;
  current_balance: number | null;
  iso_currency_code: string | null;
  created_at: string;
}
