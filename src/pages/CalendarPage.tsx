
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import DebtDueList from "@/components/calendar/DebtDueList";
import { Debt } from "@/types/models";
import { calculateDueDatesForMonth } from "@/utils/dateUtils";
import SubscribeButton from "@/components/subscription/SubscribeButton";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  
  // Mock debts from the app state - in a real app, this would come from your data store
  const debts = [
    {
      id: "1",
      name: "Credit Card A",
      balance: 3500,
      interestRate: 18.99,
      minPayment: 85,
      dueDate: 15, // due on the 15th of each month
      category: "credit_card"
    },
    {
      id: "2",
      name: "Student Loan",
      balance: 12000,
      interestRate: 4.5,
      minPayment: 150,
      dueDate: 5, // due on the 5th of each month
      category: "loan"
    },
    {
      id: "3",
      name: "Car Loan",
      balance: 8500,
      interestRate: 6.25,
      minPayment: 320,
      dueDate: 22, // due on the 22nd of each month
      category: "loan"
    },
    {
      id: "4",
      name: "Personal Loan",
      balance: 2000,
      interestRate: 10,
      minPayment: 100,
      dueDate: 28, // due on the 28th of each month
      category: "personal"
    }
  ] as Debt[];

  // Get all due dates for the current month
  const dueDates = calculateDueDatesForMonth(currentDate, debts);
  
  // Handler for date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  
  // Function to check if a date has due payments
  const isDueDate = (date: Date) => {
    return dueDates.some(dueDate => isSameDay(dueDate.date, date));
  };
  
  // Filter debts that are due on the selected date
  const debtsForSelectedDate = selectedDate 
    ? dueDates
        .filter(dueDate => isSameDay(dueDate.date, selectedDate))
        .map(dueDate => dueDate.debt)
    : [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Payment Calendar</h1>
        <SubscribeButton className="shrink-0" />
      </div>
      
      <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")} className="mb-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{format(currentDate, 'MMMM yyyy')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  showOutsideDays
                  className="rounded-md border mx-auto"
                  modifiers={{
                    dueDate: (date) => isDueDate(date),
                  }}
                  modifiersClassNames={{
                    dueDate: "bg-red-100 text-red-800 font-semibold",
                  }}
                  components={{
                    DayContent: ({ date }) => {
                      const matchingDueDates = dueDates.filter(dueDate => 
                        isSameDay(dueDate.date, date)
                      );
                      
                      return (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <span>{date.getDate()}</span>
                          {matchingDueDates.length > 0 && (
                            <span className="absolute top-0 right-0 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                          )}
                        </div>
                      );
                    }
                  }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate 
                    ? `Due on ${format(selectedDate, 'MMMM d, yyyy')}` 
                    : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  debtsForSelectedDate.length > 0 ? (
                    <div className="space-y-4">
                      {debtsForSelectedDate.map(debt => (
                        <div key={debt.id} className="p-3 border rounded-md">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{debt.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Minimum Payment: ${debt.minPayment.toFixed(2)}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-100">
                              Due Today
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No payments due on this date
                    </div>
                  )
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    Select a date to view due payments
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-6">
          <DebtDueList debts={debts} currentMonth={currentDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarPage;
