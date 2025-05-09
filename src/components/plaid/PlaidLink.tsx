
import React, { useCallback, useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link } from 'lucide-react';
import { createLinkToken, exchangePublicToken, savePlaidAccounts } from '@/services/plaidService';
import { supabase } from "@/integrations/supabase/client";

interface PlaidLinkProps {
  onSuccess?: () => void;
  className?: string;
}

export function PlaidLink({ onSuccess, className }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get a link token when the component mounts
  const getLinkToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await createLinkToken();
      setLinkToken(token);
      console.log("Link token created successfully");
    } catch (err) {
      console.error('Error getting link token:', err);
      setError('Failed to initialize Plaid Link. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to initialize Plaid Link. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    getLinkToken();
  }, [getLinkToken]);

  const onPlaidSuccess = useCallback(
    async (publicToken: string, metadata: any) => {
      try {
        setLoading(true);
        setError(null);

        // Process the public token
        const result = await exchangePublicToken(publicToken);

        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Save the accounts to the database
        await savePlaidAccounts(
          user.id,
          result.item_id,
          result.access_token,
          result.accounts
        );

        toast({
          title: 'Success',
          description: 'Your accounts have been successfully linked.',
        });

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        console.error('Error in Plaid link flow:', err);
        setError('Failed to link your accounts. Please try again.');
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

  const handleRetry = () => {
    getLinkToken();
  };

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
    <>
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
      {error && (
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry} 
            className="text-xs"
          >
            Retry
          </Button>
        </div>
      )}
    </>
  );
}
