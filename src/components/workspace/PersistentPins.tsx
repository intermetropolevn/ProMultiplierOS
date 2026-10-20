import React, { useState, useEffect, useRef } from 'react';
import { 
  Pin, 
  Plus, 
  CheckSquare, 
  Square, 
  Trash2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  MoreVertical, 
  ArrowRight, 
  Edit3, 
  Copy, 
  Check, 
  X,
  FileText,
  CheckCircle2,
  ListTodo,
  Tag,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { SavedJobApplication } from '../../types';
import { 
  UnifiedTaskService, 
  PinnedViewItem, 
  TaskPriority, 
  CareerTask, 
  CareerNote,
  PinCategory 
} from '../../services/unifiedTaskService';

interface PersistentPinsProps {
  savedJobs?: SavedJobApplication[];
  onNavigateToJob?: (jobId: string) => void;
  onNavigateToKnowledge?: () => void;
  onStartPracticeTopic?: (topic: string) => void;
  className?: string;
  variant?: 'sidebar' | 'dashboard-strip';
  autoCollapseDelayMs?: number;
}

const INTENT_KEY = 'career_os_pins_intent';

export const PersistentPins: React.FC<PersistentPinsProps> = ({
  savedJobs = [],
  onNavigateToJob,
  onNavigateToKnowledge,
  onStartPracticeTopic,
  className = '',
  variant = 'dashboard-strip',
  autoCollapseDelayMs = 4500,
}) => {
  const [pinnedItems, setPinnedItems] = useState<PinnedViewItem[]>(() => {
    return UnifiedTaskService.getAllPinnedItems(savedJobs);
  });

  // State: expanded vs collapsed
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (variant === 'sidebar') return true;
    const storedIntent = sessionStorage.getItem(INTENT_KEY);
    if (storedIntent === 'collapsed') return false;
    if (storedIntent === 'expanded') return true;
    return true; // Initial state: expanded for discovery
  });

  const [hasInteracted, setHasInteracted] = useState(false);
  const [filterCategory, setFilterCategory] = useState<PinCategory>('all');
  
  // Compact Creation Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<'note' | 'task'>('note');
  const [createTitle, setCreateTitle] = useState('');
  const [createContent, setCreateContent] = useState('');
  const [createPriority, setCreatePriority] = useState<TaskPriority>('high');
  const [createDueDate, setCreateDueDate] = useState('Tomorrow');
  const [createTags, setCreateTags] = useState('');
  const [createContext, setCreateContext] = useState('');

  // Note -> Task Conversion Modal State
  const [conversionNote, setConversionNote] = useState<CareerNote | null>(null);
  const [convertTitle, setConvertTitle] = useState('');
  const [convertDescription, setConvertDescription] = useState('');
  const [convertPriority, setConvertPriority] = useState<TaskPriority>('high');
  const [convertDueDate, setConvertDueDate] = useState('Tomorrow');

  // Note Edit Modal State
  const [editingNote, setEditingNote] = useState<CareerNote | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  // Active contextual menu dropdown
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync pinned items whenever shared tasks or notes are modified
  useEffect(() => {
    const handleSync = () => {
      setPinnedItems(UnifiedTaskService.getAllPinnedItems(savedJobs));
    };
    window.addEventListener('career_tasks_updated', handleSync);
    window.addEventListener('career_pins_updated', handleSync);
    window.addEventListener('career_radar_updated', handleSync);
    return () => {
      window.removeEventListener('career_tasks_updated', handleSync);
      window.removeEventListener('career_pins_updated', handleSync);
      window.removeEventListener('career_radar_updated', handleSync);
    };
  }, [savedJobs]);

  // Click outside listener for note menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Progressive Disclosure: Auto-collapse in dashboard-strip mode unless interacted
  useEffect(() => {
    if (variant !== 'dashboard-strip') return;
    const storedIntent = sessionStorage.getItem(INTENT_KEY);
    if (storedIntent) return;

    timerRef.current = setTimeout(() => {
      if (!hasInteracted) {
        setIsExpanded(false);
      }
    }, autoCollapseDelayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [variant, hasInteracted, autoCollapseDelayMs]);

  const handleToggleExpand = () => {
    setHasInteracted(true);
    setIsExpanded(prev => {
      const next = !prev;
      sessionStorage.setItem(INTENT_KEY, next ? 'expanded' : 'collapsed');
      return next;
    });
  };

  // Toggle Task Completion
  const handleToggleTaskComplete = (taskId: string) => {
    setHasInteracted(true);
    UnifiedTaskService.toggleTaskComplete(taskId);
  };

  // Unpin item
  const handleUnpinItem = (item: PinnedViewItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHasInteracted(true);
    setActiveMenuId(null);

    if (item.type === 'task') {
      UnifiedTaskService.toggleTaskPin(item.originalId);
    } else if (item.type === 'note') {
      UnifiedTaskService.toggleNotePin(item.originalId);
    } else {
      // Remove other item types from view
      setPinnedItems(prev => prev.filter(p => p.id !== item.id));
    }
  };

  // Delete item completely
  const handleDeleteItem = (item: PinnedViewItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHasInteracted(true);
    setActiveMenuId(null);

    if (item.type === 'task') {
      UnifiedTaskService.deleteTask(item.originalId);
    } else if (item.type === 'note') {
      UnifiedTaskService.deleteNote(item.originalId);
    } else {
      setPinnedItems(prev => prev.filter(p => p.id !== item.id));
    }
  };

  // Duplicate Note
  const handleDuplicateNote = (noteId: string) => {
    setHasInteracted(true);
    setActiveMenuId(null);
    UnifiedTaskService.duplicateNote(noteId);
  };

  // Submit Unified Creation Form ([Note] or [Task])
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;
    setHasInteracted(true);

    const parsedTags = createTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (createType === 'note') {
      UnifiedTaskService.addNote({
        title: createTitle.trim(),
        content: createContent.trim() || createTitle.trim(),
        tags: parsedTags.length > 0 ? parsedTags : ['Active Thought'],
        context: createContext.trim() || 'Quick Note',
        isPinned: true,
      });
    } else {
      UnifiedTaskService.addTask({
        title: createTitle.trim(),
        description: createContent.trim() || undefined,
        completed: false,
        priority: createPriority,
        dueDate: createDueDate.trim() || 'Next actions',
        source: 'manual',
        sourceLabel: createContext.trim() || 'Your Pins',
        isPinned: true,
        tags: parsedTags.length > 0 ? parsedTags : ['Quick Task'],
      });
    }

    // Reset Form
    setCreateTitle('');
    setCreateContent('');
    setCreateTags('');
    setCreateContext('');
    setIsCreateOpen(false);
  };

  // Start Note -> Task Conversion
  const handleStartConversion = (note: CareerNote) => {
    setConversionNote(note);
    setConvertTitle(note.title);
    setConvertDescription(note.content);
    setConvertPriority('high');
    setConvertDueDate('Tomorrow');
    setActiveMenuId(null);
  };

  // Execute Note -> Task Conversion
  const handleExecuteConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversionNote || !convertTitle.trim()) return;

    UnifiedTaskService.convertNoteToTask(conversionNote.id, {
      title: convertTitle.trim(),
      description: convertDescription.trim(),
      priority: convertPriority,
      dueDate: convertDueDate.trim() || 'Tomorrow',
    });

    setConversionNote(null);
  };

  // Start Note Edit
  const handleStartEditNote = (note: CareerNote) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setActiveMenuId(null);
  };

  // Save Note Edit
  const handleSaveEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote || !editTitle.trim()) return;

    const parsedTags = editTags.split(',').map(t => t.trim()).filter(Boolean);
    UnifiedTaskService.updateNote(editingNote.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      tags: parsedTags.length > 0 ? parsedTags : editingNote.tags,
    });

    setEditingNote(null);
  };

  const filteredItems = pinnedItems.filter(item => {
    if (filterCategory === 'all') return true;
    return item.type === filterCategory;
  });

  // 1. COLLAPSED LAUNCHER STATE (Progressive Disclosure)
  if (variant === 'dashboard-strip' && !isExpanded) {
    const mostRecentItem = pinnedItems[0];
    const remainingCount = Math.max(0, pinnedItems.length - 1);

    return (
      <div className={`bg-white/95 rounded-2xl border border-slate-200/90 shadow-2xs px-4 py-2.5 flex items-center justify-between gap-3 transition-all duration-300 ease-in-out ${className}`}>
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shrink-0">
            <Pin className="w-3.5 h-3.5 rotate-45 text-amber-500 fill-amber-500/20" />
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="font-bold tracking-wider text-slate-800 uppercase text-[11px]">
              YOUR PINS
            </span>
            <span className="text-slate-400 font-bold">·</span>
            <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded-full">
              {pinnedItems.length}
            </span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 shrink-0 hidden sm:block mx-1"></div>

          {mostRecentItem && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
              <button
                type="button"
                onClick={handleToggleExpand}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-medium text-slate-700 truncate max-w-[260px] flex items-center gap-1.5 transition cursor-pointer"
                title={mostRecentItem.title}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  mostRecentItem.type === 'task' ? 'bg-amber-400' :
                  mostRecentItem.type === 'job' ? 'bg-blue-500' :
                  mostRecentItem.type === 'knowledge' ? 'bg-purple-500' :
                  'bg-emerald-400'
                }`} />
                <span className="truncate">{mostRecentItem.title}</span>
              </button>

              {remainingCount > 0 && (
                <button
                  type="button"
                  onClick={handleToggleExpand}
                  className="px-2 py-0.8 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-600 border border-slate-200 transition cursor-pointer shrink-0"
                  title="View all pinned items"
                >
                  +{remainingCount}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Expand Affordance Button */}
        <button
          type="button"
          onClick={handleToggleExpand}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/90 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs"
          title="Expand Your Pins Desk"
        >
          <span>Expand</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // 2. EXPANDED WORKSPACE
  const isDashboardStrip = variant === 'dashboard-strip';

  return (
    <div className={`flex flex-col bg-white/95 rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-300 relative ${className}`}>
      
      {/* Top Header & Controls */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
            <Pin className="w-3.5 h-3.5 rotate-45 text-amber-500 fill-amber-500/20" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Your Pins &amp; Quick Notes
          </h3>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-full">
            {filteredItems.length}
          </span>
        </div>

        {/* Categories / Filter Buttons + Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'task', 'note', 'job', 'knowledge'] as const).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setHasInteracted(true);
                setFilterCategory(cat);
              }}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* [+ Pin] Trigger Button */}
          <button
            type="button"
            onClick={() => {
              setHasInteracted(true);
              setIsCreateOpen(prev => !prev);
            }}
            className="ml-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-3xs"
            title="Create Note or Task"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pin</span>
          </button>

          {isDashboardStrip && (
            <button
              type="button"
              onClick={handleToggleExpand}
              className="ml-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
              title="Collapse into compact launcher"
            >
              <span>Collapse</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* COMPACT CREATION SURFACE (Single surface with clear [Note] / [Task] type switch) */}
      {isCreateOpen && (
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 animate-in fade-in">
          <form onSubmit={handleCreateSubmit} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">Create new</span>
              
              {/* Type Switch: [ Note ] [ Task ] */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setCreateType('note')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    createType === 'note'
                      ? 'bg-white text-slate-900 shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Note
                </button>
                <button
                  type="button"
                  onClick={() => setCreateType('task')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    createType === 'task'
                      ? 'bg-white text-slate-900 shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Task
                </button>
              </div>
            </div>

            {/* Note Fields */}
            {createType === 'note' ? (
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="Note title (e.g. System Design principles)..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  autoFocus
                />
                <textarea
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  placeholder="Add note, active thought, or insight..."
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={createTags}
                    onChange={(e) => setCreateTags(e.target.value)}
                    placeholder="Optional tags (e.g. Design, STAR)"
                    className="px-2.5 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700"
                  />
                  <input
                    type="text"
                    value={createContext}
                    onChange={(e) => setCreateContext(e.target.value)}
                    placeholder="Optional context (e.g. Architecture)"
                    className="px-2.5 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700"
                  />
                </div>
              </div>
            ) : (
              /* Task Fields */
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="Task title (e.g. Prepare 30 core interview questions)..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  autoFocus
                />
                <textarea
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  placeholder="Description (optional details)..."
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <select
                    value={createPriority}
                    onChange={(e) => setCreatePriority(e.target.value as TaskPriority)}
                    className="px-2 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700 cursor-pointer"
                  >
                    <option value="high">HIGH Priority</option>
                    <option value="medium">MEDIUM Priority</option>
                    <option value="low">LOW Priority</option>
                  </select>

                  <input
                    type="text"
                    value={createDueDate}
                    onChange={(e) => setCreateDueDate(e.target.value)}
                    placeholder="Due date"
                    className="px-2.5 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700"
                  />

                  <input
                    type="text"
                    value={createTags}
                    onChange={(e) => setCreateTags(e.target.value)}
                    placeholder="Tags (comma-separated)"
                    className="px-2.5 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700"
                  />

                  <input
                    type="text"
                    value={createContext}
                    onChange={(e) => setCreateContext(e.target.value)}
                    placeholder="Related context (e.g. My Profile)"
                    className="px-2.5 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!createTitle.trim()}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-3xs"
              >
                Pin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PINNED CARDS GRID */}
      <div className={`p-3.5 ${
        isDashboardStrip 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto' 
          : 'space-y-2.5 max-h-[420px] overflow-y-auto'
      }`}>
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 col-span-full space-y-1">
            <Pin className="w-5 h-5 mx-auto text-slate-300 opacity-50" />
            <p>No pinned items in this category.</p>
            <p className="text-[11px] text-slate-400">Click [+ Pin] above or pin actions from My Profile.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isTask = item.type === 'task';
            const isNote = item.type === 'note';

            return (
              <div 
                key={item.id} 
                className="group relative bg-white hover:bg-slate-50/80 p-3 rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Metadata Header with Category & Actions */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                        item.type === 'task' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        item.type === 'job' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        item.type === 'knowledge' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.type}
                      </span>

                      {item.priority && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded ${
                          item.priority === 'high' ? 'bg-rose-50 text-rose-700' :
                          item.priority === 'medium' ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {item.priority}
                        </span>
                      )}

                      {item.convertedFromNote && (
                        <span className="text-[9px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1 py-0.2 rounded">
                          Converted from Note
                        </span>
                      )}
                    </div>

                    {/* Contextual Action Menu / Unpin */}
                    <div className="flex items-center gap-0.5">
                      {isNote && item.rawNote ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === item.id ? null : item.id);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Note options"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {/* Contextual Note Menu [⋯] */}
                          {activeMenuId === item.id && (
                            <div 
                              ref={menuRef}
                              className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 text-xs font-medium text-slate-700 animate-in fade-in"
                            >
                              <button
                                type="button"
                                onClick={() => item.rawNote && handleStartEditNote(item.rawNote)}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3 text-slate-400" />
                                <span>Edit Note</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => item.rawNote && handleStartConversion(item.rawNote)}
                                className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-blue-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                              >
                                <ListTodo className="w-3 h-3 text-blue-600" />
                                <span>Convert to Task</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => item.rawNote && handleDuplicateNote(item.rawNote.id)}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                              >
                                <Copy className="w-3 h-3 text-slate-400" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleUnpinItem(item, e)}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-600 cursor-pointer"
                              >
                                <Pin className="w-3 h-3 text-slate-400" />
                                <span>Unpin</span>
                              </button>
                              <div className="h-px bg-slate-100 my-1" />
                              <button
                                type="button"
                                onClick={(e) => handleDeleteItem(item, e)}
                                className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-1.5 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3 text-rose-500" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleUnpinItem(item, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-600 p-0.5 transition-opacity cursor-pointer"
                          title="Unpin from Your Pins"
                        >
                          <Pin className="w-3 h-3 rotate-45" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Checkbox for Task */}
                  {isTask ? (
                    <div className="flex items-start gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleToggleTaskComplete(item.originalId)}
                        className="mt-0.5 shrink-0 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {item.completed ? (
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs font-bold leading-snug ${
                          item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}>
                          {item.title}
                        </h4>

                        {item.excerpt && (
                          <p className={`text-[11px] leading-relaxed line-clamp-2 mt-1 ${
                            item.completed ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                        {item.title}
                      </h4>
                      {item.excerpt && (
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 mb-2">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Metadata: Source, Due Date, Tags */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px] text-slate-400 flex-wrap">
                  <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                    {item.sourceLabel && (
                      <span className="font-semibold text-slate-600 truncate">
                        {item.sourceLabel}
                      </span>
                    )}
                    {item.dueDate && (
                      <>
                        <span>·</span>
                        <span className="text-slate-500 font-medium">
                          {item.dueDate}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      {item.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-medium text-[9px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* NOTE -> TASK CONVERSION MODAL */}
      {conversionNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Convert Note to Task</h3>
              </div>
              <button
                type="button"
                onClick={() => setConversionNote(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteConversion} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  value={convertTitle}
                  onChange={(e) => setConvertTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description / Context</label>
                <textarea
                  value={convertDescription}
                  onChange={(e) => setConvertDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={convertPriority}
                    onChange={(e) => setConvertPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 cursor-pointer"
                  >
                    <option value="high">HIGH</option>
                    <option value="medium">MEDIUM</option>
                    <option value="low">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                  <input
                    type="text"
                    value={convertDueDate}
                    onChange={(e) => setConvertDueDate(e.target.value)}
                    placeholder="e.g. Due tomorrow"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                The original note will be converted into this shared task without duplicate records.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConversionNote(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!convertTitle.trim()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg font-bold cursor-pointer shadow-3xs"
                >
                  Convert to Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTE EDIT MODAL */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Edit Note</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditNote} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="e.g. Design, Personal"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editTitle.trim()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg font-bold cursor-pointer shadow-3xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
