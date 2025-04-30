
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ExternalLink,
  AlertTriangle,
  CalendarClock 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Debt, CreditBureau, CreditReportingStatus } from '@/types/models';

// Sample credit bureaus data
const creditBureaus: CreditBureau[] = [
  {
    id: 'experian',
    name: 'Experian',
    description: 'One of the three major credit bureaus in the United States',
  },
  {
    id: 'equifax',
    name: 'Equifax',
    description: 'One of the three major credit bureaus in the United States',
  },
  {
    id: 'transunion',
    name: 'TransUnion',
    description: 'One of the three major credit bureaus in the United States',
  }
];

// Sample reporting status data
const initialReportingStatus: CreditReportingStatus[] = [
  {
    id: 'status-1',
    debtId: 'debt-1',
    bureauId: 'experian',
    lastReported: null,
    status: 'pending',
    nextReportDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false
  },
  {
    id: 'status-2',
    debtId: 'debt-1',
    bureauId: 'equifax',
    lastReported: null,
    status: 'pending',
    nextReportDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false
  },
  {
    id: 'status-3',
    debtId: 'debt-1',
    bureauId: 'transunion',
    lastReported: null,
    status: 'pending',
    nextReportDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false
  },
  {
    id: 'status-4',
    debtId: 'debt-2',
    bureauId: 'experian',
    lastReported: null,
    status: 'pending',
    nextReportDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false
  }
];

interface CreditBureauReportingProps {
  debts: Debt[];
}

const CreditBureauReporting = ({ debts }: CreditBureauReportingProps) => {
  const { toast } = useToast();
  const [reportingStatus, setReportingStatus] = useState<CreditReportingStatus[]>(initialReportingStatus);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  const handleToggleReporting = (statusId: string) => {
    setReportingStatus(prev => 
      prev.map(status => 
        status.id === statusId 
        ? { ...status, isActive: !status.isActive } 
        : status
      )
    );
    
    const status = reportingStatus.find(s => s.id === statusId);
    if (status) {
      const bureau = creditBureaus.find(b => b.id === status.bureauId);
      const debt = debts.find(d => d.id === status.debtId);
      
      toast({
        title: status.isActive ? "Reporting Disabled" : "Reporting Enabled",
        description: `${status.isActive ? "Stopped" : "Started"} reporting ${debt?.name || "debt"} to ${bureau?.name || "bureau"}.`,
      });
    }
  };

  const handleVerifyAccount = () => {
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setReportingStatus(prev => 
        prev.map(status => 
          selectedDebt && status.debtId === selectedDebt.id
          ? { 
              ...status, 
              status: 'verified',
              lastReported: new Date().toISOString()
            } 
          : status
        )
      );
      
      setIsVerifying(false);
      setOpenDialog(false);
      
      toast({
        title: "Verification Complete",
        description: `Your account has been verified and will be reported to credit bureaus.`,
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'reported':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleOpenVerifyDialog = (debt: Debt) => {
    setSelectedDebt(debt);
    setOpenDialog(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Credit Bureau Reporting</span>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={() => {
              toast({
                title: "Information",
                description: "Learn more about how credit reporting works and how it can improve your credit score."
              });
            }}
          >
            <ExternalLink className="h-3 w-3" />
            Learn More
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="rounded-md bg-muted/50 p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 text-primary p-2 rounded-full">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Why Report Your Payments?</h4>
                <p className="text-sm text-muted-foreground">
                  Reporting your consistent micropayments to credit bureaus can improve your credit score over time.
                  Enable reporting below to start building your credit history.
                </p>
              </div>
            </div>
          </div>

          {debts.map(debt => {
            const debtStatuses = reportingStatus.filter(status => status.debtId === debt.id);
            const isVerified = debtStatuses.some(status => status.status === 'verified' || status.status === 'reported');
            
            return (
              <div key={debt.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{debt.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${debt.balance.toLocaleString()} • {debt.category === 'credit_card' ? 'Credit Card' : 'Loan'}
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={isVerified ? "outline" : "default"}
                    onClick={() => handleOpenVerifyDialog(debt)}
                    disabled={isVerified}
                  >
                    {isVerified ? 'Verified' : 'Verify Account'}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {creditBureaus.map(bureau => {
                    const status = reportingStatus.find(
                      s => s.debtId === debt.id && s.bureauId === bureau.id
                    );
                    
                    if (!status) return null;
                    
                    return (
                      <div key={bureau.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-full",
                            status.status === 'verified' || status.status === 'reported' 
                              ? "bg-success/10 text-success" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {getStatusIcon(status.status)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{bureau.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {status.lastReported 
                                ? `Last reported: ${new Date(status.lastReported).toLocaleDateString()}` 
                                : status.status === 'verified' 
                                  ? 'Ready to report' 
                                  : 'Not reporting'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {(status.status === 'verified' || status.status === 'reported') && (
                            <div className="mr-4 flex items-center">
                              <CalendarClock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {status.nextReportDate 
                                  ? `Next: ${new Date(status.nextReportDate).toLocaleDateString()}`
                                  : 'Not scheduled'}
                              </span>
                            </div>
                          )}
                          
                          <Switch
                            id={`toggle-${status.id}`}
                            checked={status.isActive}
                            onCheckedChange={() => handleToggleReporting(status.id)}
                            disabled={status.status !== 'verified' && status.status !== 'reported'}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {!isVerified && (
                  <div className="mt-3 text-xs flex items-center text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 mr-1 text-warning" />
                    <span>You must verify your account before enabling reporting</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Account for Reporting</DialogTitle>
            <DialogDescription>
              To report your payments to credit bureaus, we need to verify your account information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-medium text-amber-800">Important:</span>{' '}
                  <span className="text-amber-700">
                    By verifying this account, you consent to reporting your payment activity
                    to major credit bureaus. This helps build your credit history.
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="consent-checkbox" className="flex items-center space-x-2 text-sm">
                <input 
                  type="checkbox" 
                  id="consent-checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span>I consent to reporting my payment activity to credit bureaus</span>
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleVerifyAccount} 
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CreditBureauReporting;
