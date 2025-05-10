import React, { useCallback, useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link, RefreshCw } from 'lucide-react';
import { createLinkToken, exchangePublicToken, savePlaidAccounts } from '@/services/plaidService';
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      const response = await createLinkToken();
      
      if (!response || !response.link_token) {
        throw new Error(response?.error || 'Failed to create link token');
      }
      
      setLinkToken(response.link_token);
      console.log("Link token created successfully");
    } catch (err: any) {
      const errorMessage = err.details?.error_message || err.message || 'Failed to initialize Plaid Link';
      console.error('Error getting link token:', errorMessage, err.details || {});
      setError(`Failed to initialize Plaid Link: ${errorMessage}`);
      toast({
        title: 'Error',
        description: `Failed to initialize Plaid Link: ${errorMessage}`,
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
        
        if (!result || result.error) {
          throw new Error(result?.error || 'Failed to exchange public token');
        }

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
      } catch (err: any) {
        const errorMessage = err.details?.error_message || err.message || 'Failed to link accounts';
        console.error('Error in Plaid link flow:', errorMessage, err.details || {});
        setError(`Failed to link your accounts: ${errorMessage}`);
        toast({
          title: 'Error',
          description: `Failed to link your accounts: ${errorMessage}`,
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
        setError(`Link process exited: ${err.message || 'Unknown error'}`);
      }
    },
  });

  return (
    <div className="space-y-2">
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
        <div className="mt-2 space-y-2">
          <Alert variant="destructive" className="py-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry} 
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      )}
    </div>
  );
}