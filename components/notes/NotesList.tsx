'use client';

import { Note } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesList({ notes, selectedNote, onSelectNote, onDeleteNote }: NotesListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-2">
        {notes.length === 0 ? (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No notes found</p>
            </div>
          </Card>
        ) : (
          notes.map((note) => (
            <Card
              key={note.id}
              className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                selectedNote?.id === note.id ? 'border-primary bg-accent' : ''
              }`}
              onClick={() => onSelectNote(note)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm truncate flex-1">{note.title}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {note.course && (
                  <p className="text-xs text-muted-foreground">{note.course}</p>
                )}

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
