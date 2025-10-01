'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { QuickNote } from '@/lib/storage';
import { StickyNote, Plus, Trash2 } from 'lucide-react';

interface QuickNotesWidgetProps {
  notes: QuickNote[];
  onAdd: (content: string, color: string) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

const COLORS = [
  '#fef3c7',
  '#fecaca',
  '#fed7aa',
  '#d9f99d',
  '#a7f3d0',
  '#bfdbfe',
  '#ddd6fe',
  '#fbcfe8'
];

export function QuickNotesWidget({ notes, onAdd, onUpdate, onDelete }: QuickNotesWidgetProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleAdd = () => {
    if (newNote.trim()) {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      onAdd(newNote, randomColor);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const handleEdit = (note: QuickNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingId && editContent.trim()) {
      onUpdate(editingId, editContent);
      setEditingId(null);
      setEditContent('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            Quick Notes
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isAdding && (
            <div className="p-3 rounded-lg border-2 border-dashed border-primary/50 bg-muted/30">
              <Textarea
                placeholder="Write a quick note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="mb-2 min-h-[80px] resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAdd}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {notes.map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-lg shadow-sm relative group"
              style={{ backgroundColor: note.color }}
            >
              {editingId === note.id ? (
                <>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="mb-2 min-h-[80px] resize-none bg-white/50"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={handleSaveEdit}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p
                    className="text-sm whitespace-pre-wrap break-words min-h-[60px] cursor-pointer"
                    onClick={() => handleEdit(note)}
                  >
                    {note.content}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={() => onDelete(note.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          ))}

          {!isAdding && notes.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full text-center py-4">
              No quick notes yet. Click + to add one.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
