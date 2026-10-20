import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ListTodo, 
  Sparkles,
  Pin,
  Clock,
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';
import { UnifiedTaskService, CareerTask, TaskPriority } from '../../services/unifiedTaskService';
import { CareerMissionService } from '../../services/careerMissionService';
import { CareerMission } from '../../types/careerMission';
import { Target, Zap, ArrowRight } from 'lucide-react';

interface ChecklistSectionProps {
  onOpenMissionControl?: () => void;
  onOpenCreateMission?: () => void;
  onGetExpertFeedback?: (context?: any) => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  onOpenMissionControl,
  onOpenCreateMission,
  onGetExpertFeedback,
}) => {
  const [activeMission, setActiveMission] = useState<CareerMission | null>(() => {
    return CareerMissionService.getActiveMission();
  });

  const [tasks, setTasks] = useState<CareerTask[]>(() => {
    return UnifiedTaskService.getTasks().filter(t => t.source === 'readiness' || t.category === 'practice' || t.category === 'evidence' || t.category === 'target');
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('high');
  const [newDueDate, setNewDueDate] = useState('Tomorrow');

  // Listen for task changes from anywhere in the app (e.g. Your Pins toggles)
  useEffect(() => {
    const handleUpdate = () => {
      setTasks(UnifiedTaskService.getTasks().filter(t => t.source === 'readiness' || t.category === 'practice' || t.category === 'evidence' || t.category === 'target'));
    };
    const handleMissionUpdate = () => {
      setActiveMission(CareerMissionService.getActiveMission());
    };
    window.addEventListener('career_tasks_updated', handleUpdate);
    window.addEventListener('career_mission_updated', handleMissionUpdate);
    return () => {
      window.removeEventListener('career_tasks_updated', handleUpdate);
      window.removeEventListener('career_mission_updated', handleMissionUpdate);
    };
  }, []);

  const handleToggleComplete = (taskId: string) => {
    UnifiedTaskService.toggleTaskComplete(taskId);
  };

  const handleTogglePin = (taskId: string) => {
    UnifiedTaskService.toggleTaskPin(taskId);
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    UnifiedTaskService.deleteTask(taskId);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    UnifiedTaskService.addTask({
      title: newTitle.trim(),
      description: 'Custom readiness action added to interview preparation plan.',
      completed: false,
      priority: newPriority,
      dueDate: newDueDate.trim() || 'Next actions',
      source: 'readiness',
      sourceLabel: 'My Profile · Readiness Action Plan',
      isPinned: true, // auto-pin new user action to Your Pins for immediate visibility
      category: 'practice',
      tags: ['Readiness', 'Custom Action'],
    });

    setNewTitle('');
    setShowAddForm(false);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 transition-all space-y-5">
      
      {/* 0. ACTIVE CAREER MISSION & GROWTH LOOP CARD */}
      {activeMission ? (
        <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl text-white space-y-3 shadow-md border border-blue-500/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 block">
                  Active Career Mission
                </span>
                <span className="text-xs font-bold text-white">
                  {activeMission.title}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
              Phase: {activeMission.currentStage}
            </span>
          </div>

          <div className="text-xs text-blue-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/10">
            <div>
              You have <strong className="text-white">{activeMission.capabilityGaps.length} capability gaps</strong> preventing stronger readiness for {activeMission.targetRoleTitle}.
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onOpenCreateMission && (
                <button
                  type="button"
                  onClick={onOpenCreateMission}
                  className="text-2xs text-blue-200 hover:text-white underline cursor-pointer"
                >
                  Create a Mission
                </button>
              )}
              {onOpenMissionControl && (
                <button
                  type="button"
                  onClick={onOpenMissionControl}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-2xs transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Growth Loop Control</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              <span>No Active Career Mission</span>
            </div>
            <p className="text-2xs text-blue-700">
              Turn your career goals into an actionable 8-stage Growth Loop
            </p>
          </div>
          {onOpenCreateMission && (
            <button
              type="button"
              onClick={onOpenCreateMission}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer shrink-0"
            >
              Create a Mission
            </button>
          )}
        </div>
      )}

      {/* 1. INTERVIEW READINESS PROGRESS BAR & ACTIONABLE BENCHMARK */}
      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Interview Readiness
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-slate-900">
                {progressPercent}%
              </span>
              <span className="text-xs font-semibold text-slate-500">
                · {completedCount} / {totalCount} actions complete
              </span>
            </div>
          </div>

          <div className="text-right">
            {progressPercent === 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100/70 border border-blue-200 px-2.5 py-1 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {totalCount} actions recommended
              </span>
            ) : progressPercent === 100 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                All actions calibrated
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-3xs">
                {pendingCount} remaining actions
              </span>
            )}
          </div>
        </div>

        {/* Action Progress Bar */}
        <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progressPercent, 4)}%` }}
          />
        </div>
      </div>

      {/* 1.5 EXTERNAL VALIDATION UNCERTAINTY CALLOUT (Requirement 2: From Readiness) */}
      {onGetExpertFeedback && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50/70 border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 border border-amber-300/60">
              <AlertCircle className="w-4 h-4 text-amber-700" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                  Readiness Confidence Signal
                </span>
                <span className="font-bold text-slate-900 text-xs">
                  Product Strategy · 68% Calibration
                </span>
              </div>
              <p className="text-slate-700 text-xs font-medium leading-relaxed">
                Your Product Strategy readiness is improving, but confidence is limited by lack of external validation.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-readiness-get-expert-feedback"
            onClick={() => onGetExpertFeedback({
              relevantCapability: 'Product Strategy',
              careerGoal: activeMission?.title || 'Become a Senior Product Manager',
              targetRole: activeMission?.targetRoleTitle || 'Senior Product Manager',
              workSubmittedTitle: 'Product Strategy & Sandbox Trial Activation Defense',
              workSubmittedContent: `Observed trial activation drop from 31% to 19% after permissions launch.\nProposed progressive permission staging with automated compliance exports for IT stakeholders.`,
              sourceType: 'readiness',
              readinessScore: 68,
              knownSkillGaps: ['Enterprise Multi-tenant Governance', 'Executive Strategic Trade-offs']
            })}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
            <span>Get Expert Feedback</span>
          </button>
        </div>
      )}

      {/* 2. READINESS ACTION PLAN SECTION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ListTodo className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Readiness Action Plan</h3>
              <p className="text-2xs text-slate-500">Your next actions to improve interview readiness</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(prev => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            {showAddForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            <span>{showAddForm ? 'Cancel' : 'Add Action'}</span>
          </button>
        </div>

        {/* Optional Add Task Form */}
        {showAddForm && (
          <form onSubmit={handleAddTask} className="mb-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="text-xs font-bold text-slate-800">Add Readiness Action</div>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Practice speaking for 1 hour..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md text-slate-700 cursor-pointer"
                >
                  <option value="high">HIGH Priority</option>
                  <option value="medium">MEDIUM Priority</option>
                  <option value="low">LOW Priority</option>
                </select>

                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="Due date (e.g. Tomorrow)"
                  className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md text-slate-700 w-28"
                />
              </div>

              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Save Action
              </button>
            </div>
          </form>
        )}

        {/* Compact, Highly Scannable Task List */}
        <div className="space-y-2">
          {tasks.map(task => {
            const isCompleted = task.completed;
            const isPinned = task.isPinned;

            return (
              <div
                key={task.id}
                onClick={() => handleToggleComplete(task.id)}
                className={`group flex items-start justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isCompleted 
                    ? 'bg-slate-50/70 border-slate-200/60 opacity-80' 
                    : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300 shadow-3xs'
                }`}
              >
                {/* Left: Checkbox + Content */}
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(task.id);
                    }}
                    className="mt-0.5 shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors cursor-pointer"
                    aria-label={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={`text-xs font-semibold leading-snug ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}>
                        {task.title}
                      </span>
                    </div>

                    {task.description && (
                      <p className={`text-2xs leading-relaxed line-clamp-1 ${
                        isCompleted ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {task.description}
                      </p>
                    )}

                    {/* Metadata Strip: Priority, Due Date, Source */}
                    <div className="flex items-center gap-2 pt-0.5 text-[10px] flex-wrap">
                      <span className={`font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                        task.priority === 'high' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/70' 
                          : task.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/70'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>

                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-slate-500 font-medium">
                          <Clock className="w-2.5 h-2.5 text-slate-400" />
                          <span>{task.dueDate}</span>
                        </span>
                      )}

                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-medium truncate max-w-[190px]">
                        {task.sourceLabel || 'My Profile · Readiness'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Pin Toggle & Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Pin button / icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePin(task.id);
                    }}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-xs font-medium ${
                      isPinned 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/80 shadow-3xs' 
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isPinned ? 'Pinned to Your Pins (click to unpin)' : 'Pin to Your Pins'}
                    aria-label={isPinned ? 'Unpin task' : 'Pin task'}
                  >
                    <Pin className={`w-3.5 h-3.5 rotate-45 ${
                      isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
                    }`} />
                    <span className="text-[11px] font-semibold hidden sm:inline">
                      {isPinned ? 'Pinned' : 'Pin'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteTask(task.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    title="Delete action"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
