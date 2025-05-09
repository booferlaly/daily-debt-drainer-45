
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaidLink } from '@/components/plaid/PlaidLink';
import { PlaidAccounts } from '@/components/plaid/PlaidAccounts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

export function PlaidIntegration() {
  // Get current user
  const { data: userData } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data;
    }
  });

  const userId = userData?.user?.id || null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Bank</CardTitle>
          <CardDescription>
            Link your bank accounts to set up daily or weekly micropayments for your debts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Why connect your bank?</AlertTitle>
            <AlertDescription>
              Linking your bank account allows you to automatically make small payments towards your debt on a regular schedule, helping you pay off debt faster without feeling the financial strain of larger payments.
            </AlertDescription>
          </Alert>
          
          <Alert variant="default" className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle>Secure Connection</AlertTitle>
            <AlertDescription>
              We use Plaid to securely connect to your bank. Your banking credentials are never stored on our servers, and all communication is encrypted.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <PlaidAccounts userId={userId} />
    </div>
  );
}
