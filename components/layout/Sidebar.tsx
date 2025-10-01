'use client';

import { Chrome as Home, SquareCheck as CheckSquare, BookOpen, Calendar, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userName: string;
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'tasks', label: 'Task Board', icon: CheckSquare },
  { id: 'notes', label: 'Lecture Notes', icon: BookOpen },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
];

export function Sidebar({ currentView, onNavigate, onLogout, userName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Student Dashboard</h2>
        <p className="text-sm text-muted-foreground">{userName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'ghost'}
              className={cn('w-full justify-start', currentView === item.id && 'bg-primary text-primary-foreground')}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 bg-background border-r flex flex-col transition-transform duration-300 md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </aside>

      <aside className="hidden md:flex w-64 border-r flex-col bg-background">
        <NavContent />
      </aside>
    </>
  );
}
