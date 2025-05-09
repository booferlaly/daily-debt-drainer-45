
import React, { useState } from 'react';
import MicropaymentsHeader from '@/components/micropayments/MicropaymentsHeader';
import DailyPaymentSummary from '@/components/micropayments/DailyPaymentSummary';
import MicroPaymentStats from '@/components/micropayments/MicroPaymentStats';
import PaymentHistory from '@/components/micropayments/PaymentHistory';
import AutoPayModal from '@/components/micropayments/AutoPayModal';
import MicroPaymentConfig from '@/components/micropayments/MicroPaymentConfig';
import ScheduleModal from '@/components/micropayments/ScheduleModal';

const MicropaymentsPage = () => {
  const [showAutoPayModal, setShowAutoPayModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  return (
    <div className="space-y-6">
      <MicropaymentsHeader 
        onOpenAutoPayModal={() => setShowAutoPayModal(true)} 
        onOpenConfigModal={() => setShowConfigModal(true)}
        onOpenScheduleModal={() => setShowScheduleModal(true)}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <DailyPaymentSummary />
        <MicroPaymentStats />
      </div>
      
      <PaymentHistory />
      
      <AutoPayModal isOpen={showAutoPayModal} onClose={() => setShowAutoPayModal(false)} />
      <MicroPaymentConfig isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
      <ScheduleModal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} />
    </div>
  );
};

export default MicropaymentsPage;
