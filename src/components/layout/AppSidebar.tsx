
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  CreditCard,
  PieChart,
  Wallet, 
  Settings,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    title: 'Expenses',
    icon: Receipt,
    path: '/expenses',
  },
  {
    title: 'Micropayments',
    icon: Wallet,
    path: '/micropayments',
  },
  {
    title: 'Budget',
    icon: PieChart,
    path: '/budget',
  },
  {
    title: 'Credit Simulator',
    icon: CreditCard,
    path: '/credit',
  },
  {
    title: 'Calendar',
    icon: Calendar,
    path: '/calendar',
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

const AppSidebar = () => {
  return (
    <div className="min-h-screen w-64 border-r bg-card py-4 hidden md:block">
      <div className="px-3 py-2">
        <div className="mb-8 px-4">
          <h2 className="text-lg font-semibold gradient-text">Daily Debt Drainer</h2>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AppSidebar;
