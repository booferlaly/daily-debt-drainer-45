
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const SubscriptionCancelPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card className="border-amber-100 bg-amber-50">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-amber-500" />
          </div>
          <CardTitle className="text-center text-amber-800">Subscription Cancelled</CardTitle>
          <CardDescription className="text-center text-amber-700">
            Your subscription process was cancelled.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-amber-700">
          <p>
            No charges have been made to your account. You can subscribe to the Credit Reporting feature anytime when you're ready.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-amber-600 hover:bg-amber-700" 
            onClick={() => navigate('/calendar')}
          >
            Return to Calendar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionCancelPage;
