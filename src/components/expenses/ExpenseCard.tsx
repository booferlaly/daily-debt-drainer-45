
import { Expense } from '@/types/models';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ExpenseCardProps {
  expense: Expense;
  currentUserId: string;
}

const ExpenseCard = ({ expense, currentUserId }: ExpenseCardProps) => {
  const isOwner = expense.paidBy === currentUserId;
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  // Calculate what you owe or are owed
  const userParticipant = expense.participants.find(p => p.userId === currentUserId);
  const userAmount = userParticipant?.amount || 0;
  const userPaid = userParticipant?.paid || false;
  
  let statusText = '';
  let statusColor = '';
  
  if (isOwner) {
    const unpaidAmount = expense.participants
      .filter(p => p.userId !== currentUserId && !p.paid)
      .reduce((sum, p) => sum + p.amount, 0);
    
    if (unpaidAmount === 0) {
      statusText = 'Settled';
      statusColor = 'bg-success/10 text-success';
    } else {
      statusText = `You are owed $${unpaidAmount.toFixed(2)}`;
      statusColor = 'bg-primary/10 text-primary';
    }
  } else {
    if (userPaid) {
      statusText = 'You paid';
      statusColor = 'bg-success/10 text-success';
    } else {
      statusText = `You owe $${userAmount.toFixed(2)}`;
      statusColor = 'bg-debt/10 text-debt';
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
              <AvatarFallback>{expense.paidBy === currentUserId ? 'You' : expense.participants.find(p => p.userId === expense.paidBy)?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">Paid by {expense.paidBy === currentUserId ? 'you' : expense.participants.find(p => p.userId === expense.paidBy)?.name}</span>
          </div>
          <Badge variant="outline" className={statusColor}>
            {statusText}
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          Split between {expense.participants.length} people
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
