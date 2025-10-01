'use client';

import { Task } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard as Edit, Trash2, Calendar, CircleAlert as AlertCircle } from 'lucide-react';
import { format, isPast, differenceInDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onDragStart, onEdit, onDelete }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Done';
  const daysUntilDue = task.dueDate ? differenceInDays(new Date(task.dueDate), new Date()) : null;

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="p-4 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm flex-1">{task.title}</h4>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getCategoryColor(task.category)}>
            {task.category}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>

        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
            {isOverdue && <AlertCircle className="h-3 w-3" />}
            <Calendar className="h-3 w-3" />
            <span>
              {isOverdue
                ? 'Overdue'
                : daysUntilDue === 0
                ? 'Due today'
                : daysUntilDue === 1
                ? 'Due tomorrow'
                : format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
