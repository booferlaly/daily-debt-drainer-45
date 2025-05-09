
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, CreditCard, CalendarClock } from 'lucide-react';

interface MicropaymentsHeaderProps {
  onOpenAutoPayModal: () => void;
  onOpenConfigModal: () => void;
  onOpenScheduleModal: () => void;
}

const MicropaymentsHeader = ({ 
  onOpenAutoPayModal,
  onOpenConfigModal,
  onOpenScheduleModal
}: MicropaymentsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
      <h1 className="text-3xl font-bold tracking-tight">Micropayments</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex gap-2" 
          onClick={onOpenConfigModal}
        >
          <Settings className="h-4 w-4" />
          <span>Configure</span>
        </Button>
        <Button className="flex gap-2" onClick={onOpenAutoPayModal}>
          <CreditCard className="h-4 w-4" />
          <span>Set Up Auto Pay</span>
        </Button>
        <Button className="flex gap-2" onClick={onOpenScheduleModal}>
          <CalendarClock className="h-4 w-4" />
          <span>Schedule</span>
        </Button>
      </div>
    </div>
  );
};

export default MicropaymentsHeader;
