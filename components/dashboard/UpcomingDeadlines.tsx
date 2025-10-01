'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/storage';
import { Clock, CircleAlert as AlertCircle } from 'lucide-react';
import { format, isPast, differenceInDays } from 'date-fns';

interface UpcomingDeadlinesProps {
  tasks: Task[];
}

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const upcomingTasks = tasks
    .filter(task => task.status !== 'Done' && task.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Assignments':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Exams':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Lectures':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Personal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTimeUrgency = (dueDate: string) => {
    const date = new Date(dueDate);
    const daysUntil = differenceInDays(date, new Date());

    if (isPast(date)) {
      return { text: 'Overdue', isUrgent: true };
    } else if (daysUntil === 0) {
      return { text: 'Due today', isUrgent: true };
    } else if (daysUntil === 1) {
      return { text: 'Due tomorrow', isUrgent: true };
    } else if (daysUntil <= 7) {
      return { text: `${daysUntil} days left`, isUrgent: false };
    } else {
      return { text: format(date, 'MMM d, yyyy'), isUrgent: false };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming deadlines
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => {
              const { text, isUrgent } = getTimeUrgency(task.dueDate);
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className={`h-2 w-2 rounded-full mt-2 ${getPriorityColor(task.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm truncate">{task.title}</h4>
                      <Badge variant="outline" className={getCategoryColor(task.category)}>
                        {task.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {isUrgent && <AlertCircle className="h-3 w-3 text-red-500" />}
                      <p className={`text-xs ${isUrgent ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                        {text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
