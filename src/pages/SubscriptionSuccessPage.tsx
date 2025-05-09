
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    async function verifySubscription() {
      try {
        // Extract session ID from URL query parameters
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        
        if (sessionId) {
          // Verify the subscription with our backend
          await supabase.functions.invoke('check-subscription');
        }
      } catch (error) {
        console.error('Error verifying subscription:', error);
      } finally {
        setIsVerifying(false);
      }
    }
    
    verifySubscription();
  }, [location]);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card className="border-green-100 bg-green-50">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-green-800">Subscription Successful!</CardTitle>
          <CardDescription className="text-center text-green-700">
            Thank you for subscribing to our Credit Reporting service.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-green-700">
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
              <p>Verifying your subscription...</p>
            </div>
          ) : (
            <p>
              Your subscription has been activated successfully. You now have access to the Credit Reporting feature.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            onClick={() => navigate('/calendar')}
          >
            Return to Calendar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionSuccessPage;
