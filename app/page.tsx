'use client';

import { useState, useEffect } from 'react';
import { authService, User } from '@/lib/auth';
import { storageService, Task, Note, QuickNote } from '@/lib/storage';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { QuickNotesWidget } from '@/components/dashboard/QuickNotesWidget';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { NotesManager } from '@/components/notes/NotesManager';
import { CalendarView } from '@/components/calendar/CalendarView';
import { CircleCheck as CheckCircle2, Clock, ListTodo, CircleAlert as AlertCircle } from 'lucide-react';
import { isPast } from 'date-fns';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        loadUserData(user.id, user.role);
      }
    }
  }, []);

  const loadUserData = (userId: string, role: 'admin' | 'user') => {
    if (role === 'admin') {
      setTasks(storageService.getTasks());
      setNotes(storageService.getNotes());
      setQuickNotes(storageService.getQuickNotes());
    } else {
      setTasks(storageService.getTasks(userId));
      setNotes(storageService.getNotes(userId));
      setQuickNotes(storageService.getQuickNotes(userId));
    }
  };

  const handleAuthSuccess = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      loadUserData(user.id, user.role);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setTasks([]);
    setNotes([]);
    setQuickNotes([]);
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = storageService.addTask(task);
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    storageService.updateTask(id, updates);
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleDeleteTask = (id: string) => {
    storageService.deleteTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleAddNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote = storageService.addNote(note);
    setNotes([...notes, newNote]);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    storageService.updateNote(id, updates);
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  const handleDeleteNote = (id: string) => {
    storageService.deleteNote(id);
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleAddQuickNote = (content: string, color: string) => {
    if (currentUser) {
      const newQuickNote = storageService.addQuickNote({ userId: currentUser.id, content, color });
      setQuickNotes([...quickNotes, newQuickNote]);
    }
  };

  const handleUpdateQuickNote = (id: string, content: string) => {
    storageService.updateQuickNote(id, content);
    setQuickNotes(quickNotes.map((qn) => (qn.id === id ? { ...qn, content } : qn)));
  };

  const handleDeleteQuickNote = (id: string) => {
    storageService.deleteQuickNote(id);
    setQuickNotes(quickNotes.filter((qn) => qn.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
        {isRegisterMode ? (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onToggleMode={() => setIsRegisterMode(false)}
          />
        ) : (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onToggleMode={() => setIsRegisterMode(true)}
          />
        )}
      </div>
    );
  }

  const getStats = () => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const completed = tasks.filter((t) => t.status === 'Done').length;
    const overdue = tasks.filter(
      (t) => t.status !== 'Done' && t.dueDate && isPast(new Date(t.dueDate))
    ).length;

    return { total, inProgress, completed, overdue };
  };

  const stats = getStats();

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'tasks':
        return 'Task Board';
      case 'notes':
        return 'Lecture Notes';
      case 'calendar':
        return 'Calendar';
      default:
        return 'Dashboard';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        userName={currentUser?.name || ''}
      />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        <Header title={getViewTitle()} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentView === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold">
                  {getGreeting()}, {currentUser?.name}!
                </h2>
                <p className="text-muted-foreground">
                  Here's what's happening with your studies today
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Tasks"
                  value={stats.total}
                  icon={ListTodo}
                  color="text-blue-600"
                />
                <StatsCard
                  title="In Progress"
                  value={stats.inProgress}
                  icon={Clock}
                  color="text-yellow-600"
                />
                <StatsCard
                  title="Completed"
                  value={stats.completed}
                  icon={CheckCircle2}
                  color="text-green-600"
                />
                <StatsCard
                  title="Overdue"
                  value={stats.overdue}
                  icon={AlertCircle}
                  color="text-red-600"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpcomingDeadlines tasks={tasks} />
                <QuickNotesWidget
                  notes={quickNotes}
                  onAdd={handleAddQuickNote}
                  onUpdate={handleUpdateQuickNote}
                  onDelete={handleDeleteQuickNote}
                />
              </div>

              <PomodoroTimer />
            </div>
          )}

          {currentView === 'tasks' && currentUser && (
            <div className="max-w-7xl mx-auto">
              <KanbanBoard
                tasks={tasks}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                userId={currentUser.id}
              />
            </div>
          )}

          {currentView === 'notes' && currentUser && (
            <div className="max-w-7xl mx-auto">
              <NotesManager
                notes={notes}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                userId={currentUser.id}
              />
            </div>
          )}

          {currentView === 'calendar' && (
            <div className="max-w-7xl mx-auto">
              <CalendarView tasks={tasks} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
