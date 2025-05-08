
import { Expense } from '@/types/models';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  currentUserId: string;
  onSettle?: () => void;
}

const ExpenseCard = ({ expense, currentUserId, onSettle }: ExpenseCardProps) => {
  const isOwner = expense.user_id === currentUserId;
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  // Calculate what you owe or are owed
  const userParticipant = expense.participants?.find(p => p.user_id === currentUserId);
  const userAmount = userParticipant?.amount || 0;
  const userPaid = userParticipant?.paid || false;
  
  let statusText = '';
  let statusColor = '';
  let showSettleButton = false;
  
  if (isOwner) {
    const unpaidAmount = expense.participants
      ?.filter(p => p.user_id !== currentUserId && !p.paid)
      .reduce((sum, p) => sum + p.amount, 0) || 0;
    
    if (unpaidAmount === 0) {
      statusText = 'Settled';
      statusColor = 'bg-success/10 text-success';
    } else {
      statusText = `You are owed $${unpaidAmount.toFixed(2)}`;
      statusColor = 'bg-primary/10 text-primary';
      showSettleButton = true;
    }
  } else {
    if (userPaid) {
      statusText = 'You paid';
      statusColor = 'bg-success/10 text-success';
    } else {
      statusText = `You owe $${userAmount.toFixed(2)}`;
      statusColor = 'bg-debt/10 text-debt';
      showSettleButton = true;
    }
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{expense.title}</CardTitle>
            <CardDescription className="text-xs">
              {formattedDate} • {expense.category}
            </CardDescription>
          </div>
          <div className="text-lg font-semibold">
            ${expense.amount.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{expense.user_id === currentUserId ? 'You' : (expense.participants?.find(p => p.user_id === expense.user_id)?.name || '?').charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">Paid by {expense.user_id === currentUserId ? 'you' : expense.participants?.find(p => p.user_id === expense.user_id)?.name || 'Unknown'}</span>
          </div>
          <Badge variant="outline" className={statusColor}>
            {statusText}
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          Split between {(expense.participants?.length || 0)} people
        </div>
      </CardContent>
      {showSettleButton && onSettle && (
        <CardFooter className="pt-2 pb-3">
          <Button 
            onClick={onSettle} 
            variant="outline" 
            size="sm" 
            className="ml-auto flex gap-1"
          >
            <Check className="h-3 w-3" />
            Mark as Settled
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ExpenseCard;
