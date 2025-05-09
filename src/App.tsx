
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ExpensesPage from "./pages/ExpensesPage";
import MicropaymentsPage from "./pages/MicropaymentsPage";
import BudgetPage from "./pages/BudgetPage";
import CreditSimulatorPage from "./pages/CreditSimulatorPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CalendarPage from "./pages/CalendarPage";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage";
import SubscriptionCancelPage from "./pages/SubscriptionCancelPage";

// Simple settings page component
const SettingsPage = () => (
  <div className="container mx-auto px-4 py-6">
    <h1 className="text-3xl font-bold mb-6">Settings</h1>
    <p>Settings page content will go here.</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth page - publicly accessible */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="micropayments" element={<MicropaymentsPage />} />
                <Route path="budget" element={<BudgetPage />} />
                <Route path="credit" element={<CreditSimulatorPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="subscription-success" element={<SubscriptionSuccessPage />} />
                <Route path="subscription-cancel" element={<SubscriptionCancelPage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
