
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  PieChart,
  CreditCard 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mobileNavItems = [
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
    title: 'Micropay',
    icon: Wallet,
    path: '/micropayments',
  },
  {
    title: 'Budget',
    icon: PieChart,
    path: '/budget',
  },
  {
    title: 'Credit',
    icon: CreditCard,
    path: '/credit',
  },
];

const MobileNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background py-2 z-10">
      <nav className="flex justify-around">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center py-1 px-2 rounded-md text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;
