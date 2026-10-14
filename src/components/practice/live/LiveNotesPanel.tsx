import React, { useState } from 'react';
import { Edit3, Plus, Trash2, Tag, Clock, Check, MessageSquare } from 'lucide-react';
import { LiveInterviewNoteItem } from '../../../types';

interface LiveNotesPanelProps {
  notes: LiveInterviewNoteItem[];
  onAddNote: (note: Omit<LiveInterviewNoteItem, 'id' | 'timestamp'>) => void;
  onDeleteNote: (id: string) => void;
  currentTimeString: string;
}

export const LiveNotesPanel: React.FC<LiveNotesPanelProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  currentTimeString,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedTag, setSelectedTag] = useState<'Question' | 'Comment' | 'Follow-up' | 'Observation'>('Comment');

  const tags: Array<'Question' | 'Comment' | 'Follow-up' | 'Observation'> = [
    'Comment',
    'Question',
    'Follow-up',
    'Observation'
  ];

  const tagColors: Record<string, string> = {
    'Comment': 'bg-blue-50 text-blue-700 border-blue-200',
    'Question': 'bg-amber-50 text-amber-700 border-amber-200',
    'Follow-up': 'bg-purple-50 text-purple-700 border-purple-200',
    'Observation': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onAddNote({
      text: inputText.trim(),
      tag: selectedTag,
    });
    setInputText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Live Notes
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Independent notes &amp; follow-up items
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {notes.length} Notes
        </span>
      </div>

      {/* Input form */}
      <form onSubmit={handleCreateNote} className="space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Tag:</span>
          {tags.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTag(t)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                selectedTag === t
                  ? tagColors[t] + ' ring-1 ring-offset-1'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type quick interviewer comment or note..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No notes yet</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Take quick notes during the interview. Notes are automatically timestamped and saved with your session.
            </p>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${tagColors[note.tag] || 'bg-slate-100 text-slate-600'}`}>
                    {note.tag}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {note.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {note.text}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onDeleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity cursor-pointer"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        User-controlled notes are private and saved locally.
      </div>
    </div>
  );
};
