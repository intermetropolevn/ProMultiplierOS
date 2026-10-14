import React, { useState, useEffect, useRef } from 'react';
import { 
  Pin, 
  Plus, 
  CheckSquare, 
  Square, 
  Filter, 
  ExternalLink, 
  Trash2, 
  Bookmark, 
  Briefcase, 
  Sparkles, 
  Tag, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Clock,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { SavedJobApplication } from '../../types';

export interface PinnedItem {
  id: string;
  title: string;
  category: 'task' | 'note' | 'job' | 'knowledge';
  tags: string[];
  date: string;
  excerpt?: string;
  tasks?: { id: string; text: string; completed: boolean }[];
  linkUrl?: string;
  sourceType?: string;
}

const STORAGE_KEY = 'career_os_user_pins_v1';
const INTENT_KEY = 'career_os_pins_intent';

const INITIAL_PINS: PinnedItem[] = [
  {
    id: 'pin-1',
    title: 'Design homework',
    category: 'task',
    tags: ['Urgent task', 'Course'],
    date: '29.07.2025',
    excerpt: 'Talking about functionality today - how every element should have a reason to exist. Focus on user clarity.',
    tasks: [
      { id: 't1', text: 'Create a prototype of landing', completed: false },
      { id: 't2', text: 'Calibrate STAR story for Stripe payment idempotency', completed: true },
    ]
  },
  {
    id: 'pin-2',
    title: 'Little notes about design',
    category: 'note',
    tags: ['Personal'],
    date: '29.07.2025',
    excerpt: "Talking about functionality today — how every element should have a reason to exist. 'If it doesn't help the user, it's just decoration.' That really stuck. Rethink layout hierarchies.",
  },
  {
    id: 'pin-3',
    title: 'Stripe — Staff Backend Engineer',
    category: 'job',
    tags: ['Applied', 'Tier-1 Fintech'],
    date: 'Active',
    excerpt: 'High-throughput payment rails, distributed transaction guarantees, Kafka idempotent consumer.',
  },
  {
    id: 'pin-4',
    title: 'Local-First CRDT Deep Dive',
    category: 'knowledge',
    tags: ['Architecture', 'P1 Preparation'],
    date: '29.07.2026',
    excerpt: 'Contrast commutative replicated data types with 2-phase commit under split-brain states.',
  }
];

interface PersistentPinsProps {
  savedJobs?: SavedJobApplication[];
  onNavigateToJob?: (jobId: string) => void;
  onNavigateToKnowledge?: () => void;
  onStartPracticeTopic?: (topic: string) => void;
  className?: string;
  variant?: 'sidebar' | 'dashboard-strip';
  autoCollapseDelayMs?: number;
}

export const PersistentPins: React.FC<PersistentPinsProps> = ({
  savedJobs = [],
  onNavigateToJob,
  onNavigateToKnowledge,
  onStartPracticeTopic,
  className = '',
  variant = 'dashboard-strip',
  autoCollapseDelayMs = 5000,
}) => {
  const [pins, setPins] = useState<PinnedItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PINS;
    } catch {
      return INITIAL_PINS;
    }
  });

  // Intent: did user explicitly expand or collapse during this session?
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (variant === 'sidebar') return true;
    const storedIntent = sessionStorage.getItem(INTENT_KEY);
    if (storedIntent === 'collapsed') return false;
    if (storedIntent === 'expanded') return true;
    return true; // Initial state: expanded so user understands where pins live
  });

  const [hasInteracted, setHasInteracted] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'task' | 'note' | 'job' | 'knowledge'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [newPinText, setNewPinText] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
    } catch (e) {
      console.error('Failed to persist pins', e);
    }
  }, [pins]);

  // AUTO-COLLAPSE BEHAVIOR:
  // After a short period of inactivity (autoCollapseDelayMs) on initial entrance,
  // transition into a compact collapsed horizontal launcher strip unless user interacted
  useEffect(() => {
    if (variant !== 'dashboard-strip') return;
    const storedIntent = sessionStorage.getItem(INTENT_KEY);
    if (storedIntent) return; // Respect explicit user decision in session

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

  // Toggle subtask completion
  const handleToggleTask = (pinId: string, taskId: string) => {
    setHasInteracted(true);
    setPins(prev => prev.map(pin => {
      if (pin.id === pinId && pin.tasks) {
        return {
          ...pin,
          tasks: pin.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return pin;
    }));
  };

  // Quick add new pin
  const handleAddQuickPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPinText.trim()) return;
    setHasInteracted(true);

    const newPin: PinnedItem = {
      id: `pin-${Date.now()}`,
      title: newPinText.trim(),
      category: 'note',
      tags: ['Active Thought', 'Personal'],
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      excerpt: newPinText.trim(),
    };

    setPins(prev => [newPin, ...prev]);
    setNewPinText('');
  };

  const handleDeletePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(true);
    setPins(prev => prev.filter(p => p.id !== id));
  };

  const filteredPins = pins.filter(pin => {
    if (filterCategory === 'all') return true;
    return pin.category === filterCategory;
  });

  // 1. COLLAPSED LAUNCHER STATE (Auto-collapsed or manually collapsed)
  if (variant === 'dashboard-strip' && !isExpanded) {
    const mostRecentPin = pins[0];
    const remainingCount = Math.max(0, pins.length - 1);

    return (
      <div className={`bg-white/95 rounded-2xl border border-slate-200/90 shadow-2xs px-4 py-2.5 flex items-center justify-between gap-3 transition-all duration-300 ease-in-out ${className}`}>
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shrink-0">
            <Pin className="w-3.5 h-3.5 rotate-45 text-amber-500 fill-amber-500/20" />
          </div>
          
          {/* Label matching spec: YOUR PINS • 4 */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="font-bold tracking-wider text-slate-800 uppercase text-[11px]">
              YOUR PINS
            </span>
            <span className="text-slate-400 font-bold">·</span>
            <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded-full">
              {pins.length}
            </span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 shrink-0 hidden sm:block mx-1"></div>

          {/* [most recent pin] [+3] */}
          {mostRecentPin && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
              <button
                type="button"
                onClick={handleToggleExpand}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-medium text-slate-700 truncate max-w-[260px] flex items-center gap-1.5 transition cursor-pointer"
                title={mostRecentPin.title}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  mostRecentPin.category === 'task' ? 'bg-amber-400' :
                  mostRecentPin.category === 'job' ? 'bg-blue-500' :
                  mostRecentPin.category === 'knowledge' ? 'bg-purple-500' :
                  'bg-emerald-400'
                }`} />
                <span className="truncate">{mostRecentPin.title}</span>
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

        {/* Expand Affordance Button: [Expand] */}
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

  // 2. EXPANDED DASHBOARD STRIP OR SIDEBAR
  const isDashboardStrip = variant === 'dashboard-strip';

  return (
    <div className={`flex flex-col bg-white/95 rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-300 ${className}`}>
      {/* Pins Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
            <Pin className="w-3.5 h-3.5 rotate-45 text-amber-500 fill-amber-500/20" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Your Pins &amp; Quick Notes
          </h3>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-full">
            {filteredPins.length}
          </span>
        </div>

        {/* Categories / Filter */}
        <div className="flex items-center gap-1.5">
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

          {isDashboardStrip && (
            <button
              type="button"
              onClick={handleToggleExpand}
              className="ml-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
              title="Collapse into compact launcher"
            >
              <span>Collapse</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Input Bar: "What's on your mind today?" */}
      <div className="p-2.5 sm:p-3 bg-slate-50/70 border-b border-slate-100">
        <form onSubmit={handleAddQuickPin} className="flex items-center gap-1.5 bg-white rounded-xl border border-slate-200 px-2.5 py-1.5 shadow-2xs focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <input
            type="text"
            value={newPinText}
            onChange={(e) => {
              setHasInteracted(true);
              setNewPinText(e.target.value);
            }}
            placeholder="Add note, active thought, or quick task..."
            className="flex-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
          />
          <button
            type="submit"
            disabled={!newPinText.trim()}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              newPinText.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pin</span>
          </button>
        </form>
      </div>

      {/* Pinned Cards Grid (Horizontal in dashboard-strip mode, vertical list in sidebar mode) */}
      <div className={`p-3.5 ${
        isDashboardStrip 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto' 
          : 'space-y-2.5 max-h-[360px] overflow-y-auto'
      }`}>
        {filteredPins.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 col-span-full">
            <Pin className="w-5 h-5 mx-auto mb-1 text-slate-300 opacity-50" />
            No pinned items in this category.
          </div>
        ) : (
          filteredPins.map(pin => (
            <div 
              key={pin.id} 
              className="group relative bg-white hover:bg-slate-50/80 p-3 rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with category tag & delete */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    pin.category === 'task' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    pin.category === 'job' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    pin.category === 'knowledge' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                    'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {pin.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-400">{pin.date}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeletePin(pin.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-0.5 cursor-pointer"
                      title="Unpin"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                  {pin.title}
                </h4>

                {pin.excerpt && (
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-2">
                    {pin.excerpt}
                  </p>
                )}

                {/* Subtasks if any */}
                {pin.tasks && pin.tasks.length > 0 && (
                  <div className="space-y-1 pt-1.5 border-t border-slate-100">
                    {pin.tasks.map(task => (
                      <div 
                        key={task.id}
                        onClick={() => handleToggleTask(pin.id, task.id)}
                        className="flex items-start gap-1.5 cursor-pointer text-[10px] group/item"
                      >
                        <button 
                          type="button"
                          className="mt-0.5 shrink-0 text-slate-400 group-hover/item:text-blue-600 transition-colors"
                        >
                          {task.completed ? (
                            <CheckSquare className="w-3 h-3 text-blue-600" />
                          ) : (
                            <Square className="w-3 h-3 text-slate-300" />
                          )}
                        </button>
                        <span className={`leading-tight truncate ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
                        }`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags footer */}
              {pin.tags && pin.tags.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1 flex-wrap">
                  {pin.tags.map((tag, idx) => (
                    <span key={idx} className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
