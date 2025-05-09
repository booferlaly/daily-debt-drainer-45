
-- Create plaid_items table
CREATE TABLE IF NOT EXISTS public.plaid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  item_id TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create plaid_accounts table
CREATE TABLE IF NOT EXISTS public.plaid_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  item_id TEXT NOT NULL,
  account_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  mask TEXT,
  type TEXT NOT NULL,
  subtype TEXT,
  institution_id TEXT,
  available_balance NUMERIC,
  current_balance NUMERIC,
  iso_currency_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  FOREIGN KEY (item_id) REFERENCES plaid_items(item_id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.plaid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plaid_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for plaid_items
CREATE POLICY "Users can view their own plaid items" 
  ON public.plaid_items 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Edge functions can insert plaid items" 
  ON public.plaid_items 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Edge functions can update plaid items" 
  ON public.plaid_items 
  FOR UPDATE 
  USING (true);

-- Create policies for plaid_accounts
CREATE POLICY "Users can view their own plaid accounts" 
  ON public.plaid_accounts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Edge functions can insert plaid accounts" 
  ON public.plaid_accounts 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Edge functions can update plaid accounts" 
  ON public.plaid_accounts 
  FOR UPDATE 
  USING (true);
