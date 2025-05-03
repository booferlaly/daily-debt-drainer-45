
-- SQL schema for Supabase database setup

-- Users table (this would be integrated with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Financial institutions table
CREATE TABLE IF NOT EXISTS financial_institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  primary_color TEXT,
  url TEXT,
  oauth BOOLEAN DEFAULT FALSE,
  products JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Account connections table (stores connection info to financial providers)
CREATE TABLE IF NOT EXISTS account_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  institution_id UUID REFERENCES financial_institutions(id) NOT NULL,
  access_token TEXT NOT NULL, -- Stored encrypted
  item_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'pending', 'error', 'disconnected')) DEFAULT 'pending',
  error TEXT,
  consent_expiration TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

-- Financial accounts table
CREATE TABLE IF NOT EXISTS financial_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  institution_id UUID REFERENCES financial_institutions(id) NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT CHECK (account_type IN ('checking', 'savings', 'credit', 'loan', 'investment', 'other')) NOT NULL,
  account_number TEXT,
  account_mask TEXT,
  current_balance DECIMAL(19, 4) NOT NULL,
  available_balance DECIMAL(19, 4),
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT TRUE,
  external_id TEXT NOT NULL, -- ID from the financial provider
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, external_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES financial_accounts(id) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount DECIMAL(19, 4) NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  merchant_name TEXT,
  pending BOOLEAN DEFAULT FALSE,
  external_id TEXT NOT NULL, -- ID from the financial provider
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(account_id, external_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_financial_accounts_user_id ON financial_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_account_connections_user_id ON account_connections(user_id);

-- Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE financial_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Financial institutions - accessible by all authenticated users
CREATE POLICY financial_institutions_select_policy ON financial_institutions 
  FOR SELECT TO authenticated USING (true);

-- Account connections - users can only manage their own connections
CREATE POLICY account_connections_select_policy ON account_connections 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
  
CREATE POLICY account_connections_insert_policy ON account_connections 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY account_connections_update_policy ON account_connections 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  
CREATE POLICY account_connections_delete_policy ON account_connections 
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Financial accounts - users can only see their own accounts
CREATE POLICY financial_accounts_select_policy ON financial_accounts 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
  
CREATE POLICY financial_accounts_insert_policy ON financial_accounts 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY financial_accounts_update_policy ON financial_accounts 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  
CREATE POLICY financial_accounts_delete_policy ON financial_accounts 
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Transactions - users can only see transactions for their own accounts
CREATE POLICY transactions_select_policy ON transactions 
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM financial_accounts 
      WHERE financial_accounts.id = transactions.account_id 
      AND financial_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY transactions_insert_policy ON transactions 
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM financial_accounts 
      WHERE financial_accounts.id = transactions.account_id 
      AND financial_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY transactions_update_policy ON transactions 
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM financial_accounts 
      WHERE financial_accounts.id = transactions.account_id 
      AND financial_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY transactions_delete_policy ON transactions 
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM financial_accounts 
      WHERE financial_accounts.id = transactions.account_id 
      AND financial_accounts.user_id = auth.uid()
    )
  );
