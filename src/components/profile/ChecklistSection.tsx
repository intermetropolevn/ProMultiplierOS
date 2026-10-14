import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ListTodo, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export interface ChecklistItem {
  id: string;
  text: string;
  category: 'practice' | 'evidence' | 'target';
  completed: boolean;
  priority: 'high' | 'medium';
}

const STORAGE_CHECKLIST_KEY = 'career_os_profile_checklist_v1';

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'c1', text: 'Rehearse STAR response on Cross-functional Conflict Resolution', category: 'practice', completed: true, priority: 'high' },
  { id: 'c2', text: 'Practice 1 System Design session on High-Throughput Idempotency', category: 'practice', completed: false, priority: 'high' },
  { id: 'c3', text: 'Link verified proof point (MTTR reduction) to Stripe Application', category: 'target', completed: true, priority: 'medium' },
  { id: 'c4', text: 'Verify Kafka & Debezium distributed tracing evidence item in library', category: 'evidence', completed: false, priority: 'high' },
];

export const ChecklistSection: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CHECKLIST_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load checklist', e);
    }
    return INITIAL_CHECKLIST;
  });

  const [newItemText, setNewItemText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHECKLIST_KEY, JSON.stringify(checklist));
    } catch (e) {
      console.error('Failed to persist checklist', e);
    }
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: `c-${Date.now()}`,
      text: newItemText.trim(),
      category: 'practice',
      completed: false,
      priority: 'high',
    };

    setChecklist(prev => [newItem, ...prev]);
    setNewItemText('');
    setShowAddForm(false);
  };

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ListTodo className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Readiness Next Actions</h3>
              <span className="text-slate-300">·</span>
              <span className="text-2xs font-mono font-bold text-blue-700">
                {completedCount}/{checklist.length} Complete
              </span>
            </div>
            <p className="text-2xs text-slate-500">Actionable steps to reach 100% interview calibration</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
        >
          <Plus className="w-3.5 h-3.5" /> Add Task
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between text-2xs font-semibold mb-1">
          <span className="text-slate-600">Calibration Readiness</span>
          <span className="text-blue-600">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Task Input */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="mb-3 flex gap-2">
          <input
            type="text"
            placeholder="Add specific practice or evidence step..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
          >
            Add
          </button>
        </form>
      )}

      {/* Checklist items */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
              item.completed 
                ? 'bg-slate-50/70 border-slate-200 text-slate-400' 
                : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {item.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 hover:text-blue-600 shrink-0" />
              )}
              <span className={`text-2xs sm:text-xs truncate ${item.completed ? 'line-through' : 'font-medium'}`}>
                {item.text}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-3xs uppercase font-bold px-1.5 py-0.5 rounded ${
                item.priority === 'high' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {item.priority}
              </span>
              <button
                onClick={(e) => deleteItem(item.id, e)}
                className="text-slate-300 hover:text-red-500 p-0.5 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
