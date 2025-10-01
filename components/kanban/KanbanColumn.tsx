'use client';

import { Task } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: Task['status'];
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const STATUS_CONFIG = {
  'Todo': { title: 'To Do', color: 'border-t-gray-500' },
  'In Progress': { title: 'In Progress', color: 'border-t-blue-500' },
  'Done': { title: 'Done', color: 'border-t-green-500' }
};

export function KanbanColumn({
  status,
  tasks,
  onDragOver,
  onDrop,
  onDragStart,
  onEditTask,
  onDeleteTask
}: KanbanColumnProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Card className={`border-t-4 ${config.color}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {config.title}
          <span className="text-sm font-normal text-muted-foreground">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="space-y-3 min-h-[400px]"
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tasks yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
