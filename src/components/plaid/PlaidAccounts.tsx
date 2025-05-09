
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlaidAccounts } from '@/services/plaidService';
import { useToast } from '@/hooks/use-toast';
import { StoredPlaidAccount } from '@/types/models';
import { Loader2, CreditCard, Building, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PlaidLink } from './PlaidLink';

interface PlaidAccountsProps {
  userId: string | null;
}

export function PlaidAccounts({ userId }: PlaidAccountsProps) {
  const [accounts, setAccounts] = useState<StoredPlaidAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchAccounts = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const accountsData = await getPlaidAccounts(userId);
      setAccounts(accountsData || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your linked accounts.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [userId]);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <CreditCard className="h-5 w-5" />;
      case 'depository':
        return <Building className="h-5 w-5" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  const handlePlaidSuccess = () => {
    // Refresh accounts after successful link
    fetchAccounts();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>
          Connect your bank accounts to set up micropayments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{account.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ••••{account.mask} • {account.subtype}
                    </p>
                  </div>
                </div>
                <div>
                  {account.available_balance !== null && (
                    <Badge variant="outline" className="bg-primary/5 text-primary">
                      ${account.available_balance.toFixed(2)} Available
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <p className="text-muted-foreground">
              You don't have any linked accounts yet.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <PlaidLink
          onSuccess={handlePlaidSuccess}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
