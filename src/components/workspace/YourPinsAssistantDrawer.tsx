import React, { useState, useEffect, useRef } from 'react';
import { 
  Pin, 
  X, 
  Plus, 
  CheckSquare, 
  Square, 
  Send, 
  Bot, 
  Sparkles, 
  MoreVertical, 
  Edit3, 
  Copy, 
  Trash2, 
  ListTodo,
  AtSign,
  ArrowUp,
  Layers,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { SavedJobApplication, UserCareerProfile } from '../../types';
import { 
  UnifiedTaskService, 
  PinnedViewItem, 
  CareerNote, 
  TaskPriority, 
  PinCategory 
} from '../../services/unifiedTaskService';

interface YourPinsAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: UserCareerProfile;
  savedJobs?: SavedJobApplication[];
  onOpenApplication?: (appId: string) => void;
  onNavigateToJob?: (jobId: string) => void;
  onNavigateToKnowledge?: () => void;
}

export const YourPinsAssistantDrawer: React.FC<YourPinsAssistantDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  savedJobs = [],
  onOpenApplication,
  onNavigateToJob,
  onNavigateToKnowledge,
}) => {
  const [pinnedItems, setPinnedItems] = useState<PinnedViewItem[]>(() => {
    return UnifiedTaskService.getAllPinnedItems(savedJobs);
  });
  const [filterCategory, setFilterCategory] = useState<PinCategory>('all');
  
  // Compact Creation Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<'note' | 'task'>('note');
  const [createTitle, setCreateTitle] = useState('');
  const [createContent, setCreateContent] = useState('');
  const [createPriority, setCreatePriority] = useState<TaskPriority>('high');
  const [createDueDate, setCreateDueDate] = useState('Tomorrow');

  // Conversion Modal State
  const [conversionNote, setConversionNote] = useState<CareerNote | null>(null);
  const [convertTitle, setConvertTitle] = useState('');
  const [convertDescription, setConvertDescription] = useState('');
  const [convertPriority, setConvertPriority] = useState<TaskPriority>('high');
  const [convertDueDate, setConvertDueDate] = useState('Tomorrow');

  // Context Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // AI Chat State
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello Alex! Your active target is **${profile?.targetTitle || 'Technical Product Manager'}**. I have your pinned notes, current readiness action plan, and target companies loaded in context.`
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Sync pinned items with unified service
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleTaskComplete = (taskId: string) => {
    UnifiedTaskService.toggleTaskComplete(taskId);
  };

  const handleUnpin = (item: PinnedViewItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMenuId(null);
    if (item.type === 'task') {
      UnifiedTaskService.toggleTaskPin(item.originalId);
    } else if (item.type === 'note') {
      UnifiedTaskService.toggleNotePin(item.originalId);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;

    if (createType === 'note') {
      UnifiedTaskService.addNote({
        title: createTitle.trim(),
        content: createContent.trim() || createTitle.trim(),
        tags: ['Quick Note'],
        context: 'Your Pins',
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
        sourceLabel: 'Your Pins',
        isPinned: true,
        tags: ['Pinned Task'],
      });
    }

    setCreateTitle('');
    setCreateContent('');
    setIsCreateOpen(false);
  };

  const handleStartConversion = (note: CareerNote) => {
    setConversionNote(note);
    setConvertTitle(note.title);
    setConvertDescription(note.content);
    setConvertPriority('high');
    setConvertDueDate('Tomorrow');
    setActiveMenuId(null);
  };

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

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isAiResponding) return;

    const userText = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsAiResponding(true);

    setTimeout(() => {
      let reply = `Based on your target (${profile?.targetTitle || 'Product Manager'}), here is the recommendation: `;
      if (userText.toLowerCase().includes('interview') || userText.toLowerCase().includes('question')) {
        reply += "Rehearse the STAR response on cross-functional alignment and check the 30 core PM questions pinned on your board.";
      } else if (userText.toLowerCase().includes('task') || userText.toLowerCase().includes('action')) {
        reply += "I've checked your Readiness Action Plan. Your next high-impact action is to practice speaking for 1 hour.";
      } else {
        reply += "I've analyzed your pinned context and role blueprints. Focus on quantifying system trade-offs and team throughput metrics.";
      }
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsAiResponding(false);
      chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  if (!isOpen) return null;

  const filteredItems = pinnedItems.filter(item => {
    if (filterCategory === 'all') return true;
    return item.type === filterCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Slide-Over Drawer Container */}
      <aside className="relative w-full sm:w-[440px] md:w-[460px] bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-50 overflow-hidden">
        
        {/* ==================================================
            PRIMARY PANEL HEADER (ONLY ONE PRIMARY HEADER!)
            📌 Your Pins & Assistant
            Subtitle: "Quick personal context, notes & AI copilot"
            ================================================== */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-3xs">
              <Pin className="w-4 h-4 rotate-45 text-amber-500 fill-amber-500/20" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Your Pins &amp; Assistant</span>
              </h2>
              <p className="text-xs text-slate-500">Quick personal context, notes &amp; AI copilot</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE UTILITY WORKSPACE */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar divide-y divide-slate-100">
          
          {/* ==================================================
              SECTION 1: YOUR PINS & QUICK NOTES
              ================================================== */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Your Pins &amp; Quick Notes
                </span>
                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded-full">
                  {filteredItems.length}
                </span>
              </div>

              {/* [+ Pin] Action */}
              <button
                type="button"
                onClick={() => setIsCreateOpen(prev => !prev)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-3xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pin</span>
              </button>
            </div>

            {/* Filter Tabs: ALL, TASK, NOTE, JOB, KNOWLEDGE */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {(['all', 'task', 'note', 'job', 'knowledge'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    filterCategory === cat
                      ? 'bg-slate-900 text-white shadow-3xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Compact Creation Surface */}
            {isCreateOpen && (
              <form onSubmit={handleCreateSubmit} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-bold text-slate-800">Create new</span>
                  
                  {/* Type switch: [ Note ] [ Task ] */}
                  <div className="flex items-center p-0.5 bg-white rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCreateType('note')}
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                        createType === 'note' ? 'bg-slate-900 text-white' : 'text-slate-600'
                      }`}
                    >
                      Note
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateType('task')}
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                        createType === 'task' ? 'bg-slate-900 text-white' : 'text-slate-600'
                      }`}
                    >
                      Task
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder={createType === 'note' ? "Note title..." : "Task title..."}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />

                <textarea
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  placeholder={createType === 'note' ? "Add note, active thought..." : "Task description..."}
                  rows={2}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 resize-none focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />

                {createType === 'task' && (
                  <div className="flex items-center gap-2">
                    <select
                      value={createPriority}
                      onChange={(e) => setCreatePriority(e.target.value as TaskPriority)}
                      className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md text-slate-700 cursor-pointer"
                    >
                      <option value="high">HIGH</option>
                      <option value="medium">MEDIUM</option>
                      <option value="low">LOW</option>
                    </select>
                    <input
                      type="text"
                      value={createDueDate}
                      onChange={(e) => setCreateDueDate(e.target.value)}
                      placeholder="Due date (e.g. Tomorrow)"
                      className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md text-slate-700 flex-1"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!createTitle.trim()}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-md text-xs font-bold"
                  >
                    Pin
                  </button>
                </div>
              </form>
            )}

            {/* Pinned Items List */}
            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-0.5">
              {filteredItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No pinned items in this category.
                </div>
              ) : (
                filteredItems.map(item => {
                  const isTask = item.type === 'task';
                  const isNote = item.type === 'note';

                  return (
                    <div 
                      key={item.id}
                      className="p-2.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/80 transition-all text-xs relative group"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                            item.type === 'task' ? 'bg-amber-100 text-amber-800' :
                            item.type === 'job' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'knowledge' ? 'bg-purple-100 text-purple-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.type}
                          </span>

                          {item.priority && (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1 rounded">
                              {item.priority.toUpperCase()}
                            </span>
                          )}

                          {item.convertedFromNote && (
                            <span className="text-[9px] font-semibold text-indigo-700 bg-indigo-50 px-1 rounded">
                              Converted from Note
                            </span>
                          )}
                        </div>

                        {/* Note Context Menu or Unpin */}
                        <div className="flex items-center gap-0.5">
                          {isNote && item.rawNote ? (
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                                className="p-0.5 rounded text-slate-400 hover:text-slate-700"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {activeMenuId === item.id && (
                                <div 
                                  ref={menuRef}
                                  className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-xl py-1 z-30 text-xs font-medium"
                                >
                                  <button
                                    type="button"
                                    onClick={() => item.rawNote && handleStartConversion(item.rawNote)}
                                    className="w-full text-left px-2.5 py-1 text-blue-700 font-semibold hover:bg-blue-50"
                                  >
                                    Convert to Task
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleUnpin(item, e)}
                                    className="w-full text-left px-2.5 py-1 text-slate-600 hover:bg-slate-50"
                                  >
                                    Unpin
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => handleUnpin(item, e)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-600 p-0.5"
                              title="Unpin"
                            >
                              <Pin className="w-3 h-3 rotate-45" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      {isTask ? (
                        <div className="flex items-start gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleToggleTaskComplete(item.originalId)}
                            className="mt-0.5 shrink-0 text-slate-400 hover:text-blue-600"
                          >
                            {item.completed ? (
                              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-300" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <span className={`font-bold leading-tight ${
                              item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}>
                              {item.title}
                            </span>
                            {item.excerpt && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.excerpt}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-slate-900 leading-tight">{item.title}</h4>
                          {item.excerpt && (
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{item.excerpt}</p>
                          )}
                        </div>
                      )}

                      {/* Source & Date */}
                      <div className="mt-1.5 pt-1 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[200px]">{item.sourceLabel}</span>
                        {item.dueDate && <span>{item.dueDate}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ==================================================
              SECTION 2: NEW AI CHAT
              ================================================== */}
          <div className="p-4 space-y-3 flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  New AI Chat
                </span>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Copilot Active</span>
              </span>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar text-xs min-h-[160px] max-h-[220px]">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`p-2.5 rounded-xl text-xs ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-xs max-w-[88%]' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs max-w-[94%] leading-relaxed'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAiResponding && (
                <div className="text-slate-400 text-xs italic flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-pulse text-indigo-500" />
                  <span>Synthesizing career context...</span>
                </div>
              )}
              <div ref={chatScrollRef} />
            </div>

            {/* Context Prompt Bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                  @{profile?.targetTitle || 'Target Role'}
                </span>
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                  @Readiness Plan
                </span>
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:border-blue-400 focus-within:bg-white transition-all shadow-3xs">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="@ context, ask question or synthesize next steps..."
                  className="flex-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAiResponding}
                  className="p-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white transition cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>

      </aside>

      {/* Conversion Modal inside Drawer */}
      {conversionNote && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900">Convert Note to Task</span>
              <button onClick={() => setConversionNote(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteConversion} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  value={convertTitle}
                  onChange={(e) => setConvertTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description</label>
                <textarea
                  value={convertDescription}
                  onChange={(e) => setConvertDescription(e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={convertPriority}
                  onChange={(e) => setConvertPriority(e.target.value as TaskPriority)}
                  className="px-2 py-1 border border-slate-200 rounded-md"
                >
                  <option value="high">HIGH</option>
                  <option value="medium">MEDIUM</option>
                  <option value="low">LOW</option>
                </select>
                <input
                  type="text"
                  value={convertDueDate}
                  onChange={(e) => setConvertDueDate(e.target.value)}
                  placeholder="Due date"
                  className="px-2 py-1 border border-slate-200 rounded-md"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConversionNote(null)}
                  className="px-2.5 py-1 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold"
                >
                  Convert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
