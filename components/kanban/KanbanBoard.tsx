'use client';

import { useState } from 'react';
import { Task } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { TaskDialog } from './TaskDialog';

interface KanbanBoardProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  userId: string;
}

const STATUSES: Task['status'][] = ['Todo', 'In Progress', 'Done'];

export function KanbanBoard({ tasks, onAddTask, onUpdateTask, onDeleteTask, userId }: KanbanBoardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    onAddTask({ ...taskData, userId });
    setIsDialogOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
      setEditingTask(null);
      setIsDialogOpen(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onUpdateTask(taskId, { status });
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
            onDragStart={handleDragStart}
            onEditTask={handleEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <TaskDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSave={editingTask ? handleUpdateTask : handleAddTask}
        task={editingTask}
      />
    </div>
  );
}
