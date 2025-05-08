
import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  
  // This effect handles the hash fragment from email confirmations
  useEffect(() => {
    // Check if there's a hash in the URL (typically from email confirmations)
    const handleAuthRedirect = async () => {
      const { hash, pathname } = window.location;
      
      // Handle email confirmation redirects from Supabase
      if ((hash && hash.includes('access_token')) || (hash && hash.includes('error'))) {
        console.log('Auth redirect detected, processing authentication');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Authentication error:', error);
          navigate('/auth', { replace: true });
        } else if (data?.session) {
          // Successfully authenticated, redirect to dashboard
          navigate('/', { replace: true });
        }
      }
    };
    
    handleAuthRedirect();
  }, [navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth page if not logged in
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Render children if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
