import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  FileText, 
  Video, 
  CheckSquare, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ChevronDown,
  Check, 
  Trash2, 
  Archive, 
  Copy, 
  Tag, 
  Layers,
  Award,
  ListTodo,
  Briefcase
} from 'lucide-react';
import { 
  JobApplication, 
  ApplicationPrimaryState, 
  ApplicationSubState,
  CANONICAL_PIPELINE_STAGES,
  ApplicationAssessment,
  ApplicationInterview,
  PreparationTask
} from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { JOBS_DATA } from '../../data/jobsData';
import { JobListing } from '../../types';
import { AddTestAssignmentModal } from '../tracker/AddTestAssignmentModal';
import { ScheduleInterviewModal } from '../tracker/ScheduleInterviewModal';

interface ApplicationDetailViewProps {
  applicationId: string;
  onBack: () => void;
  onApplicationUpdated?: () => void;
}

interface StateOption {
  primary: ApplicationPrimaryState;
  sub?: ApplicationSubState;
  label: string;
  dotColor: string;
}

const PIPELINE_STATE_OPTIONS: StateOption[] = [
  { primary: 'applied_screening', sub: 'applied', label: 'Applied', dotColor: 'bg-slate-900' },
  { primary: 'applied_screening', sub: 'screening', label: 'HR screening', dotColor: 'bg-slate-500' },
  { primary: 'assessment_case', sub: 'take_home', label: 'Take-home case', dotColor: 'bg-purple-500' },
  { primary: 'interviews', sub: 'technical', label: '1st interview', dotColor: 'bg-pink-500' },
  { primary: 'interviews', sub: 'panel', label: '2nd interview', dotColor: 'bg-blue-500' },
  { primary: 'interviews', sub: 'final', label: 'Final interview', dotColor: 'bg-emerald-500' },
  { primary: 'offer_negotiation', sub: 'offer_received', label: 'Offer received', dotColor: 'bg-teal-500' },
  { primary: 'archived_closed', sub: 'rejected', label: 'Archived / Closed', dotColor: 'bg-slate-400' },
];

export const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({
  applicationId,
  onBack,
  onApplicationUpdated
}) => {
  const [app, setApp] = useState<JobApplication | undefined>(() => 
    applicationStore.getApplicationById(applicationId)
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'job_listing' | 'tests' | 'interviews' | 'tasks'>('overview');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // Editable notes
  const [notes, setNotes] = useState(app?.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // New task input
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const reload = () => {
    const updated = applicationStore.getApplicationById(applicationId);
    setApp(updated ? { ...updated } : undefined);
    if (updated) {
      setNotes(updated.notes || '');
    }
    if (onApplicationUpdated) onApplicationUpdated();
  };

  // Resolve canonical Job Opportunity / Discovery data
  const linkedJob: JobListing | undefined = useMemo(() => {
    if (!app) return undefined;
    return JOBS_DATA.find(j => 
      j.company.toLowerCase() === app.companyName.toLowerCase() ||
      j.title.toLowerCase() === app.roleTitle.toLowerCase() ||
      j.title.toLowerCase().includes(app.roleTitle.toLowerCase()) ||
      app.roleTitle.toLowerCase().includes(j.title.toLowerCase())
    );
  }, [app]);

  // Linked assessments & tests
  const assessments: ApplicationAssessment[] = useMemo(() => {
    if (!app) return [];
    return applicationStore.getAllAssessments().filter(a => a.applicationId === app.id);
  }, [app]);

  // Linked tasks
  const tasks: PreparationTask[] = useMemo(() => {
    if (!app) return [];
    return applicationStore.getPreparationTasks(app.id);
  }, [app]);

  if (!app) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Application not found</h3>
        <p className="text-xs text-slate-500">This record may have been removed or archived.</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Return to Pipeline
        </button>
      </div>
    );
  }

  const primaryState = app.pipelineState || 'applied_screening';
  const stageDef = CANONICAL_PIPELINE_STAGES.find(s => s.id === primaryState);

  // State Change Handler
  const handleStateSelect = (primary: ApplicationPrimaryState, sub?: ApplicationSubState) => {
    applicationStore.moveApplicationToState(app.id, primary, sub, `Updated state from detail view`);
    setIsStateDropdownOpen(false);
    reload();
  };

  // Notes Saver
  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    applicationStore.saveApplication({
      ...app,
      notes
    });
    setIsSavingNotes(false);
    setNotesSavedSuccess(true);
    setTimeout(() => setNotesSavedSuccess(false), 2500);
    reload();
  };

  // Add Quick Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    applicationStore.savePreparationTask({
      id: `task-${Date.now()}`,
      applicationId: app.id,
      title: newTaskTitle.trim(),
      type: 'FINAL_REVIEW',
      priority: 'HIGH',
      estimatedMinutes: 30,
      status: 'TODO',
      whyRecommended: 'Follow-up task created in Application Tracker'
    });
    setNewTaskTitle('');
    reload();
  };

  // Toggle Task
  const handleToggleTask = (task: PreparationTask) => {
    applicationStore.toggleTaskStatus(task.id);
    reload();
  };

  // Toggle Assessment Status
  const handleToggleAssessment = (ass: ApplicationAssessment) => {
    const nextStatus = ass.status === 'COMPLETED' ? 'PREPARING' : 'COMPLETED';
    applicationStore.saveAssessment({
      ...ass,
      status: nextStatus
    });
    reload();
  };

  // Dynamic Context-Aware Next Action Derivation
  const nextAction = (() => {
    // 1. Pending Assessment / Test
    const pendingAssessment = assessments.find(a => a.status !== 'COMPLETED');
    if (pendingAssessment) {
      return {
        title: `Active Test Assignment: ${pendingAssessment.title}`,
        badge: 'Priority Deliverable',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        description: pendingAssessment.deadline 
          ? `Submission deadline is ${new Date(pendingAssessment.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}. Review case prompt and prepare submission.`
          : 'Complete the test challenge deliverables and log submission progress.',
        actionLabel: 'View Test Assignment',
        onAction: () => setActiveTab('tests'),
        secondaryLabel: 'Log As Completed',
        onSecondary: () => handleToggleAssessment(pendingAssessment)
      };
    }

    // 2. Upcoming Interview Round
    const upcomingInterview = app.interviews?.find(iv => iv.status === 'SCHEDULED');
    if (upcomingInterview) {
      return {
        title: `Upcoming Round: ${upcomingInterview.title || upcomingInterview.type.replace(/_/g, ' ') + ' Interview'}`,
        badge: 'Interview Scheduled',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        description: upcomingInterview.scheduledAt
          ? `Scheduled for ${new Date(upcomingInterview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}. Focus on architectural trade-offs, STAR stories, and team alignment.`
          : 'Prepare behavioral and technical questions for this scheduled conversation.',
        actionLabel: 'Review Interview Details',
        onAction: () => setActiveTab('interviews'),
        secondaryLabel: 'Add Prep Task',
        onSecondary: () => setActiveTab('tasks')
      };
    }

    // 3. Stage-Specific Recommendations
    if (primaryState === 'applied_screening') {
      if (app.pipelineSubState === 'screening') {
        return {
          title: 'Recruiter Screening Active: Conduct Follow-up',
          badge: 'Screening Round',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          description: 'Follow up with the talent recruiter, confirm stage progression, or log assignment instructions.',
          actionLabel: 'Log Test Assignment',
          onAction: () => setIsTestModalOpen(true),
          secondaryLabel: 'Schedule Interview',
          onSecondary: () => setIsInterviewModalOpen(true)
        };
      }
      return {
        title: 'Application Submitted: Prepare Screening Pitch',
        badge: 'Initial Stage',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        description: `Review requirements for ${app.companyName}, tailor your 60-second self-introduction, and align salary benchmark expectations.`,
        actionLabel: 'Advance to HR Screening',
        onAction: () => handleStateSelect('applied_screening', 'screening'),
        secondaryLabel: 'Schedule Call',
        onSecondary: () => setIsInterviewModalOpen(true)
      };
    }

    if (primaryState === 'assessment_case') {
      return {
        title: 'Assessment & Case: Prepare Rigorous Submission',
        badge: 'Case Stage',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        description: 'Structure problem breakdown, validate unit economics, and prepare concise executive presentation slides.',
        actionLabel: 'Log Test Challenge',
        onAction: () => setIsTestModalOpen(true),
        secondaryLabel: 'Advance to Interviews',
        onSecondary: () => handleStateSelect('interviews', 'technical')
      };
    }

    if (primaryState === 'interviews') {
      return {
        title: 'Interview Rounds: Leadership & Competency Alignment',
        badge: 'Active Rounds',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Conduct deep-dive preparation into technical case architecture, team leadership principles, and strategic questions for the interviewers.',
        actionLabel: 'Schedule Interview Round',
        onAction: () => setIsInterviewModalOpen(true),
        secondaryLabel: 'Advance to Offer',
        onSecondary: () => handleStateSelect('offer_negotiation', 'offer_received')
      };
    }

    if (primaryState === 'offer_negotiation') {
      return {
        title: 'Offer Received: Evaluate Total Compensation & Leverage',
        badge: 'Decision Stage',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        description: 'Assess base pay, equity grant vesting timeline, benefits, and draft professional counter-offer points.',
        actionLabel: 'Record Accepted Offer',
        onAction: () => handleStateSelect('archived_closed', 'accepted'),
        secondaryLabel: 'Add Negotiation Note',
        onSecondary: () => setActiveTab('overview')
      };
    }

    return {
      title: 'Application Archived: Capture Learnings & Retro',
      badge: 'Archived',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      description: 'Document recruiter feedback, note calibrated competencies, and keep relationship active for future openings.',
      actionLabel: 'Reactivate to Applied',
      onAction: () => handleStateSelect('applied_screening', 'applied'),
      secondaryLabel: 'Review Notes',
      onSecondary: () => setActiveTab('overview')
    };
  })();

  const currentStateLabel = () => {
    const match = PIPELINE_STATE_OPTIONS.find(
      opt => opt.primary === app.pipelineState && opt.sub === app.pipelineSubState
    );
    return match?.label || app.pipelineSubState?.replace(/_/g, ' ') || stageDef?.title || 'Applied';
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Pipeline</span>
          </button>
          
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Pipeline</span>
            <span>/</span>
            <span className="font-bold text-slate-800">{app.companyName}</span>
          </div>
        </div>

        {/* State Selector Dropdown directly in header */}
        <div className="relative self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2 cursor-pointer"
          >
            <span className="text-[10px] text-slate-400 uppercase font-black">Stage:</span>
            <span className="capitalize">{currentStateLabel()}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isStateDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-20 cursor-default" 
                onClick={() => setIsStateDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-1.5 z-30 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 w-56 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Change Pipeline State
                </div>
                {PIPELINE_STATE_OPTIONS.map((opt) => {
                  const isSelected = app.pipelineState === opt.primary && (app.pipelineSubState === opt.sub || (!app.pipelineSubState && !opt.sub));
                  return (
                    <button
                      key={`${opt.primary}-${opt.sub || 'none'}`}
                      type="button"
                      onClick={() => handleStateSelect(opt.primary, opt.sub)}
                      className={`w-full px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between text-left ${
                        isSelected 
                          ? 'bg-blue-50 text-blue-800 font-black' 
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${opt.dotColor}`} />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Hero Application Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          
          <div className="flex items-start gap-4">
            {/* Company Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md">
              {app.companyName.substring(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {app.roleTitle}
                </h1>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                  primaryState === 'applied_screening' ? 'bg-amber-100 text-amber-900' :
                  primaryState === 'assessment_case' ? 'bg-purple-100 text-purple-900' :
                  primaryState === 'interviews' ? 'bg-blue-100 text-blue-900' :
                  primaryState === 'offer_negotiation' ? 'bg-emerald-100 text-emerald-900' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {stageDef?.title.toUpperCase()}
                </span>
                {app.pipelineSubState && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {app.pipelineSubState.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {app.companyName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {app.location || linkedJob?.location || 'Remote'}
                </span>
                <span>•</span>
                <span>Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                {app.deadline && (
                  <>
                    <span>•</span>
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Due {new Date(app.deadline).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-start shrink-0">
            <button
              type="button"
              onClick={() => setIsTestModalOpen(true)}
              className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Test</span>
            </button>
            <button
              type="button"
              onClick={() => setIsInterviewModalOpen(true)}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Interview</span>
            </button>
          </div>

        </div>

        {/* Dynamic Context-Aware Recommended Next Action Box */}
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-slate-50/80 to-blue-50/30 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${nextAction.badgeColor}`}>
                {nextAction.badge}
              </span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                {nextAction.title}
              </h4>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {nextAction.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {nextAction.secondaryLabel && (
              <button
                type="button"
                onClick={nextAction.onSecondary}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                {nextAction.secondaryLabel}
              </button>
            )}
            <button
              type="button"
              onClick={nextAction.onAction}
              className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>{nextAction.actionLabel}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pipeline Stage Stepper */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
            Pipeline Progression
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CANONICAL_PIPELINE_STAGES.map((s, idx) => {
              const isCurrent = primaryState === s.id;
              const stageIndex = CANONICAL_PIPELINE_STAGES.findIndex(st => st.id === primaryState);
              const isCompleted = idx < stageIndex;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStateSelect(s.id, s.subStates[0]?.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isCurrent 
                      ? 'bg-blue-50/80 border-blue-200 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                      : isCompleted
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black">{idx + 1}</span>
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />}
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="text-xs font-bold leading-tight truncate">
                    {s.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Tabbed Content: Overview & Follow-up, Linked Job Opportunity, Tests, Interviews, Tasks */}
      <div className="space-y-4">
        
        {/* Tab Headers */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80">
          {[
            { id: 'overview', label: 'Overview & Notes' },
            { id: 'job_listing', label: linkedJob ? 'Linked Job Discovery' : 'Job Information' },
            { id: 'tests', label: `Test Assignments (${assessments.length})` },
            { id: 'interviews', label: `Interviews (${app.interviews?.length || 0})` },
            { id: 'tasks', label: `Action Tasks (${tasks.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & NOTES */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Left: Notes & Follow-up */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900">Application Notes &amp; Follow-up Log</h3>
                </div>
                {notesSavedSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved
                  </span>
                )}
              </div>

              <textarea
                rows={7}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log recruiter conversation insights, questions asked, referrals, compensation discussions, and follow-up deadlines..."
                className="w-full text-xs font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:outline-hidden leading-relaxed resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSavingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>

            {/* Right: Key Application Metadata */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-sm font-black text-slate-900">Application Snapshot</h3>
              
              <div className="space-y-3 divide-y divide-slate-100 text-xs">
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400 font-medium">Company</span>
                  <span className="font-bold text-slate-800">{app.companyName}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400 font-medium">Target Role</span>
                  <span className="font-bold text-slate-800 text-right">{app.roleTitle}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400 font-medium">Work Mode / Location</span>
                  <span className="font-bold text-slate-800">{app.location || 'Remote'}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400 font-medium">Compensation Range</span>
                  <span className="font-bold text-emerald-600">
                    {linkedJob?.salaryRange || app.salary || 'Negotiable'}
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400 font-medium">External Job URL</span>
                  {app.jobUrl || linkedJob?.externalUrl ? (
                    <a
                      href={app.jobUrl || linkedJob?.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>View Listing</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Not specified</span>
                  )}
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400 font-medium">Calibrated Skills</span>
                  <span className="font-bold text-slate-800">
                    {app.skillIds?.length || linkedJob?.requiredSkills.length || 0} skills mapped
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LINKED JOB DISCOVERY DATA */}
        {activeTab === 'job_listing' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-6">
            {linkedJob ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {linkedJob.roleCategory}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {linkedJob.level} Level
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                        {linkedJob.salaryRange}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-2">
                      {linkedJob.title} — {linkedJob.company}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Domain: {linkedJob.domain} • Work Mode: {linkedJob.workMode} ({linkedJob.location})
                    </p>
                  </div>

                  {linkedJob.externalUrl && (
                    <a
                      href={linkedJob.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-center shrink-0"
                    >
                      <span>External Job Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Job Description */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    Role Description
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                    {linkedJob.description}
                  </p>
                </div>

                {/* Key Responsibilities */}
                {linkedJob.keyResponsibilities && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {linkedJob.keyResponsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Required Skills Badges */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    Required Competencies &amp; Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {linkedJob.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200/80"
                      >
                        {sk}
                      </span>
                    ))}
                    {linkedJob.niceToHaveSkills?.map((sk) => (
                      <span
                        key={sk}
                        className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200/80"
                      >
                        {sk} (Nice-to-have)
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-800 mb-1">Custom / Manually Sourced Application</p>
                  <p>This application was logged manually. You can add job requirements and skills below:</p>
                </div>

                {app.requirements && app.requirements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Extracted Requirements
                    </h4>
                    <div className="space-y-2">
                      {app.requirements.map(r => (
                        <div key={r.id} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-200">
                          <span className="font-bold text-slate-800">{r.mappedSkillName || r.category}:</span>{' '}
                          <span className="text-slate-600">{r.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TEST ASSIGNMENTS & CASES */}
        {activeTab === 'tests' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Test Assignments &amp; Challenges</h3>
                <p className="text-xs text-slate-500 font-medium">Take-home cases, technical tests, and assessment prompts</p>
              </div>
              <button
                type="button"
                onClick={() => setIsTestModalOpen(true)}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Test Assignment</span>
              </button>
            </div>

            {assessments.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">No test assignments logged yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click "Add Test Assignment" to record take-home case briefs, prompt instructions, and submission deadlines.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.map(ass => {
                  const isDone = ass.status === 'COMPLETED';
                  return (
                    <div
                      key={ass.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDone ? 'bg-slate-50/70 border-slate-200 opacity-75' : 'bg-white border-purple-200/80 shadow-2xs'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            isDone ? 'bg-slate-200 text-slate-700' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {ass.type.replace(/_/g, ' ')}
                          </span>
                          <h4 className={`text-xs font-black ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {ass.title}
                          </h4>
                        </div>
                        {ass.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">{ass.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          {ass.deadline && (
                            <span className="flex items-center gap-1 font-bold text-purple-700">
                              <Clock className="w-3 h-3" />
                              Due {new Date(ass.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                          {ass.estimatedEffort && (
                            <span>• Effort: {ass.estimatedEffort}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {ass.submissionUrl && (
                          <a
                            href={ass.submissionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleAssessment(ass)}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                            isDone 
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          {isDone ? 'Mark In Progress' : 'Mark Completed'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SCHEDULED INTERVIEWS */}
        {activeTab === 'interviews' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Interview Rounds &amp; Debriefs</h3>
                <p className="text-xs text-slate-500 font-medium">Scheduled conversations, panel rounds, and interviewer feedback</p>
              </div>
              <button
                type="button"
                onClick={() => setIsInterviewModalOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Interview</span>
              </button>
            </div>

            {(!app.interviews || app.interviews.length === 0) ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <Video className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">No interview rounds scheduled yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click "Schedule Interview" to log screening conversations, system design rounds, and executive panel interviews.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {app.interviews.map(iv => (
                  <div
                    key={iv.id}
                    className="p-4 rounded-2xl bg-white border border-blue-200/70 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                          {iv.type.replace(/_/g, ' ')}
                        </span>
                        <h4 className="text-xs font-black text-slate-900">
                          {iv.title || `${iv.type} Round`}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {iv.scheduledAt && (
                          <span className="font-bold text-blue-700 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(iv.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        {iv.interviewer && (
                          <span>• Interviewer: {iv.interviewer}</span>
                        )}
                      </div>
                      {iv.notes && (
                        <p className="text-xs text-slate-500 mt-1">{iv.notes}</p>
                      )}
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-center">
                      {iv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ACTION TASKS & CHECKLIST */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-5">
            <div>
              <h3 className="text-base font-black text-slate-900">Follow-up Preparation Checklist</h3>
              <p className="text-xs text-slate-500 font-medium">To-do actions, research tasks, and milestone preparation items</p>
            </div>

            {/* Quick add task form */}
            <form onSubmit={handleAddTask} className="flex items-center gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add new follow-up task (e.g., Draft thank you note, review 10-K filing)..."
                className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Add Task
              </button>
            </form>

            <div className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No action tasks for this application yet.
                </div>
              ) : (
                tasks.map(task => {
                  const isDone = task.status === 'DONE';
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task)}
                      className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 cursor-pointer"
                        />
                        <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {isDone ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      {isTestModalOpen && (
        <AddTestAssignmentModal
          isOpen={isTestModalOpen}
          applications={[app]}
          preselectedAppId={app.id}
          onClose={() => setIsTestModalOpen(false)}
          onAssignmentCreated={() => reload()}
        />
      )}

      {isInterviewModalOpen && (
        <ScheduleInterviewModal
          isOpen={isInterviewModalOpen}
          applicationId={app.id}
          onClose={() => setIsInterviewModalOpen(false)}
          onCreated={() => reload()}
        />
      )}

    </div>
  );
};
