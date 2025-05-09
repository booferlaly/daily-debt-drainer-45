
import React, { useCallback, useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link } from 'lucide-react';
import { createLinkToken, exchangePublicToken } from '@/services/plaidService';
import { supabase } from "@/integrations/supabase/client";

interface PlaidLinkProps {
  onSuccess?: (publicToken: string, metadata: any) => void;
  className?: string;
}

export function PlaidLink({ onSuccess, className }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Get a link token when the component mounts
  useEffect(() => {
    const getLinkToken = async () => {
      try {
        setLoading(true);
        const token = await createLinkToken();
        setLinkToken(token);
      } catch (error) {
        console.error('Error getting link token:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize Plaid Link. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    getLinkToken();
  }, [toast]);

  const onPlaidSuccess = useCallback(
    async (publicToken: string, metadata: any) => {
      try {
        setLoading(true);

        // Process the public token
        const result = await exchangePublicToken(publicToken);

        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Save the accounts to the database
        const { data, error } = await supabase.functions.invoke('plaid-link', {
          body: {
            action: 'save_accounts',
            user_id: user.id,
            item_id: result.item_id,
            access_token: result.access_token,
            accounts: result.accounts
          }
        });

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Your accounts have been successfully linked.',
        });

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess(publicToken, metadata);
        }
      } catch (error) {
        console.error('Error in Plaid link flow:', error);
        toast({
          title: 'Error',
          description: 'Failed to link your accounts. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, toast]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: (err, metadata) => {
      if (err) {
        console.error('Plaid Link exit error:', err, metadata);
      }
    },
  });

  return (
    <Button
      onClick={() => open()}
      disabled={!ready || loading || !linkToken}
      className={className}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Link className="mr-2 h-4 w-4" />
      )}
      Link Bank Account
    </Button>
  );
}
