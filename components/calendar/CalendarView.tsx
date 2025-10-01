'use client';

import { useState } from 'react';
import { Task } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Assignments':
        return 'bg-blue-500';
      case 'Exams':
        return 'bg-red-500';
      case 'Lectures':
        return 'bg-purple-500';
      case 'Personal':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return isSameDay(parseISO(task.dueDate), date);
    });
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEE';
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-sm py-2">
          {format(addDays(startDate, i), dateFormat).substring(0, 3)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayTasks = getTasksForDate(currentDay);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isCurrentDay = isToday(day);

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] border p-2 cursor-pointer hover:bg-accent transition-colors ${
              !isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : ''
            } ${isCurrentDay ? 'border-primary border-2' : ''}`}
            onClick={() => setSelectedDate(currentDay)}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-sm ${isCurrentDay ? 'font-bold text-primary' : ''}`}
              >
                {format(day, 'd')}
              </span>
              {dayTasks.length > 0 && (
                <span className="text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                  {dayTasks.length}
                </span>
              )}
            </div>
            <div className="space-y-1">
              {dayTasks.slice(0, 2).map((task) => (
                <div
                  key={task.id}
                  className={`text-xs p-1 rounded truncate ${getCategoryColor(task.category)} text-white`}
                >
                  {task.title}
                </div>
              ))}
              {dayTasks.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{dayTasks.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderDays()}
          {renderCells()}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Assignments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Exams</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm">Lectures</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Personal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </DialogTitle>
            <DialogDescription>
              {selectedDateTasks.length > 0
                ? `${selectedDateTasks.length} task${selectedDateTasks.length > 1 ? 's' : ''} scheduled`
                : 'No tasks scheduled'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedDateTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold">{task.title}</h4>
                  <Badge variant="outline" className={getCategoryColor(task.category) + ' text-white border-0'}>
                    {task.category}
                  </Badge>
                </div>
                {task.description && (
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Badge variant="secondary">{task.status}</Badge>
                  <Badge variant="secondary">{task.priority}</Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
