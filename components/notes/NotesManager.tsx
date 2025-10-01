'use client';

import { useState, useMemo } from 'react';
import { Note } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';

interface NotesManagerProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  userId: string;
}

export function NotesManager({ notes, onAddNote, onUpdateNote, onDeleteNote, userId }: NotesManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.course.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (isCreating) {
      onAddNote({ ...noteData, userId });
      setIsCreating(false);
    } else if (selectedNote) {
      onUpdateNote(selectedNote.id, noteData);
    }
  };

  const handleDeleteNote = (id: string) => {
    onDeleteNote(id);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const handleCloseEditor = () => {
    setIsCreating(false);
    setSelectedNote(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={handleCreateNote}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <NotesList
          notes={filteredNotes}
          selectedNote={selectedNote}
          onSelectNote={handleSelectNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>

      <div className="lg:col-span-2">
        {(isCreating || selectedNote) ? (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onClose={handleCloseEditor}
          />
        ) : (
          <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Select a note or create a new one</p>
              <Button onClick={handleCreateNote}>
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
