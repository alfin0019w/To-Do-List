export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'Assignments' | 'Exams' | 'Lectures' | 'Personal';
  status: 'Todo' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  course: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuickNote {
  id: string;
  userId: string;
  content: string;
  color: string;
  createdAt: string;
}

export const storageService = {
  getTasks: (userId?: string): Task[] => {
    if (typeof window === 'undefined') return [];
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    return userId ? tasks.filter((t: Task) => t.userId === userId) : tasks;
  },

  saveTasks: (tasks: Task[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  },

  addTask: (task: Omit<Task, 'id' | 'createdAt'>): Task => {
    const tasks = storageService.getTasks();
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    storageService.saveTasks(tasks);
    return newTask;
  },

  updateTask: (id: string, updates: Partial<Task>) => {
    const tasks = storageService.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      storageService.saveTasks(tasks);
    }
  },

  deleteTask: (id: string) => {
    const tasks = storageService.getTasks();
    storageService.saveTasks(tasks.filter(t => t.id !== id));
  },

  getNotes: (userId?: string): Note[] => {
    if (typeof window === 'undefined') return [];
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    return userId ? notes.filter((n: Note) => n.userId === userId) : notes;
  },

  saveNotes: (notes: Note[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('notes', JSON.stringify(notes));
  },

  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const notes = storageService.getNotes();
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    storageService.saveNotes(notes);
    return newNote;
  },

  updateNote: (id: string, updates: Partial<Note>) => {
    const notes = storageService.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updates, updatedAt: new Date().toISOString() };
      storageService.saveNotes(notes);
    }
  },

  deleteNote: (id: string) => {
    const notes = storageService.getNotes();
    storageService.saveNotes(notes.filter(n => n.id !== id));
  },

  getQuickNotes: (userId?: string): QuickNote[] => {
    if (typeof window === 'undefined') return [];
    const quickNotes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
    return userId ? quickNotes.filter((qn: QuickNote) => qn.userId === userId) : quickNotes;
  },

  saveQuickNotes: (quickNotes: QuickNote[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('quickNotes', JSON.stringify(quickNotes));
  },

  addQuickNote: (quickNote: Omit<QuickNote, 'id' | 'createdAt'>): QuickNote => {
    const quickNotes = storageService.getQuickNotes();
    const newQuickNote = {
      ...quickNote,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    quickNotes.push(newQuickNote);
    storageService.saveQuickNotes(quickNotes);
    return newQuickNote;
  },

  updateQuickNote: (id: string, content: string) => {
    const quickNotes = storageService.getQuickNotes();
    const index = quickNotes.findIndex(qn => qn.id === id);
    if (index !== -1) {
      quickNotes[index].content = content;
      storageService.saveQuickNotes(quickNotes);
    }
  },

  deleteQuickNote: (id: string) => {
    const quickNotes = storageService.getQuickNotes();
    storageService.saveQuickNotes(quickNotes.filter(qn => qn.id !== id));
  }
};
