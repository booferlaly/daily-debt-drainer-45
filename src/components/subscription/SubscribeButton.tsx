
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, BadgeCheck } from 'lucide-react';

interface SubscribeButtonProps {
  className?: string;
}

export interface SubscriptionStatus {
  subscribed: boolean;
  subscription_end: string | null;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ className }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  const checkSubscriptionStatus = async () => {
    try {
      setCheckingStatus(true);
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      
      setSubscriptionStatus(data as SubscriptionStatus);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
    
    // Poll subscription status every 30 seconds
    const intervalId = setInterval(checkSubscriptionStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      
      const priceId = 'price_1RMkpAQYY7toxIKScCOYgKKE'; // Replace with your actual price ID from Stripe
      
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { priceId }
      });
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Unable to start subscription process',
          variant: 'destructive',
        });
        return;
      }
      
      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <Button disabled className={className}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking subscription...
      </Button>
    );
  }

  if (subscriptionStatus?.subscribed) {
    return (
      <Button variant="outline" className={`${className} bg-green-50 text-green-700 border-green-200`}>
        <BadgeCheck className="mr-2 h-4 w-4" />
        Credit Reporting Active
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleSubscription}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Enable Credit Reporting ($10/month)
        </>
      )}
    </Button>
  );
};

export default SubscribeButton;
