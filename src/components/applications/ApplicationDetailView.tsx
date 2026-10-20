import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
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
  Briefcase,
  Trophy,
  Hammer,
  Users,
  Compass,
  Link as LinkIcon,
  FolderGit2,
  Send,
  MessageSquare,
  Activity,
  Bookmark,
  Paperclip,
  Share2,
  Tv,
  BookOpen,
  Heart,
  ShieldCheck,
  TrendingUp,
  Target,
  X
} from 'lucide-react';
import { 
  JobApplication, 
  ParticipationType,
  ParticipationRole,
  UnifiedParticipationStatus,
  PARTICIPATION_LIFECYCLES,
  ParticipationEvidenceItem,
  ParticipationFollowUpTask,
  EvidenceType,
  ApplicationAssessment,
  ApplicationInterview,
  PreparationTask
} from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { JOBS_DATA } from '../../data/jobsData';
import { AddTestAssignmentModal } from '../tracker/AddTestAssignmentModal';
import { ScheduleInterviewModal } from '../tracker/ScheduleInterviewModal';

interface ApplicationDetailViewProps {
  applicationId: string;
  onBack: () => void;
  onApplicationUpdated?: () => void;
}

export const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({
  applicationId,
  onBack,
  onApplicationUpdated
}) => {
  const [app, setApp] = useState<JobApplication | undefined>(() => 
    applicationStore.getApplicationById(applicationId)
  );

  // Canonical 5 tabs per Section 8: overview, context, experience, evidence, followup
  const [activeTab, setActiveTab] = useState<'overview' | 'context' | 'experience' | 'evidence' | 'followup' | 'tests' | 'interviews'>('overview');
  
  // Status & Stage dropdowns
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // Editable notes state
  const [notes, setNotes] = useState(app?.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // New takeaway input
  const [newTakeaway, setNewTakeaway] = useState('');

  // New task input
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  // New activity note input
  const [newActivityNote, setNewActivityNote] = useState('');

  // Add Evidence modal/inline state
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [evTitle, setEvTitle] = useState('');
  const [evType, setEvType] = useState<EvidenceType>('certificate');
  const [evUrl, setEvUrl] = useState('');
  const [evDescription, setEvDescription] = useState('');

  // Link Entity state
  const [isLinkEntityOpen, setIsLinkEntityOpen] = useState(false);
  const [linkOppTitle, setLinkOppTitle] = useState('');
  const [linkProjTitle, setLinkProjTitle] = useState('');
  const [linkBlueprintTitle, setLinkBlueprintTitle] = useState('');
  const [linkKnowledgeTitle, setLinkKnowledgeTitle] = useState('');

  const reload = () => {
    const updated = applicationStore.getApplicationById(applicationId);
    setApp(updated ? { ...updated } : undefined);
    if (updated) {
      setNotes(updated.notes || '');
    }
    if (onApplicationUpdated) onApplicationUpdated();
  };

  const pType: ParticipationType = app?.participationType || 'workshop';
  const lifecycle = PARTICIPATION_LIFECYCLES[pType] || PARTICIPATION_LIFECYCLES.workshop;
  const stages = lifecycle.stages;

  // Assessments & Tasks
  const assessments: ApplicationAssessment[] = useMemo(() => {
    if (!app) return [];
    return applicationStore.getAllAssessments().filter(a => a.applicationId === app.id);
  }, [app]);

  const tasks: PreparationTask[] = useMemo(() => {
    if (!app) return [];
    return applicationStore.getPreparationTasks(app.id);
  }, [app]);

  if (!app) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Participation record not found</h3>
        <p className="text-xs text-slate-500">This record may have been removed or archived.</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Return to Participation Tracker
        </button>
      </div>
    );
  }

  // Resolve current stage
  const currentStageIndex = stages.findIndex(s => s.id === (app.currentStageId || stages[0].id));
  const activeStageIndex = currentStageIndex >= 0 ? currentStageIndex : 0;
  const currentStage = stages[activeStageIndex] || stages[0];

  const currentStatus = app.unifiedStatus || (app.participationStatus === 'COMPLETED' ? 'completed' : app.participationStatus === 'SAVED' ? 'saved' : 'registered');

  // Status badge style
  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case 'saved': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'invited': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'registered': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'confirmed': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'attended': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'completed': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'no_show': return 'bg-slate-200 text-slate-700 border-slate-300';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const handleStatusSelect = (nextStatus: UnifiedParticipationStatus) => {
    applicationStore.updateParticipationUnifiedStatus(app.id, nextStatus);
    setIsStatusDropdownOpen(false);
    reload();
  };

  const handleStageSelect = (stageId: string, stageLabel: string) => {
    applicationStore.updateParticipationStage(app.id, stageId, stageLabel, `Moved to ${stageLabel} from detail workspace`);
    setIsStageDropdownOpen(false);
    reload();
  };

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

  const handleAddTakeaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTakeaway.trim()) return;
    applicationStore.addTakeaway(app.id, newTakeaway.trim());
    setNewTakeaway('');
    reload();
  };

  const handleAddFollowUpTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    applicationStore.addFollowUpTask(app.id, {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
      dueDate: newTaskDueDate || undefined,
      priority: newTaskPriority
    });
    setNewTaskTitle('');
    setNewTaskDueDate('');
    reload();
  };

  const handleToggleFollowUpTask = (taskId: string) => {
    applicationStore.toggleFollowUpTask(app.id, taskId);
    reload();
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim()) return;
    applicationStore.addEvidenceItem(app.id, {
      id: `ev-${Date.now()}`,
      title: evTitle.trim(),
      type: evType,
      url: evUrl.trim() || undefined,
      description: evDescription.trim() || undefined,
      uploadedAt: new Date().toISOString(),
      verificationBadge: evType === 'certificate' || evType === 'badge'
    });
    setEvTitle('');
    setEvUrl('');
    setEvDescription('');
    setIsAddEvidenceOpen(false);
    reload();
  };

  const handleDeleteEvidence = (evId: string) => {
    if (confirm('Remove this evidence item?')) {
      applicationStore.deleteEvidenceItem(app.id, evId);
      reload();
    }
  };

  const handleAddActivityNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityNote.trim()) return;
    applicationStore.addActivity(app.id, {
      id: `act-${Date.now()}`,
      itemId: app.id,
      type: 'NOTE',
      title: 'Update Logged',
      description: newActivityNote.trim(),
      timestamp: new Date().toISOString()
    });
    setNewActivityNote('');
    reload();
  };

  const handleSaveEntities = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkOppTitle.trim()) {
      applicationStore.linkParticipationEntity(app.id, 'opportunity', `opp-${Date.now()}`, linkOppTitle.trim());
    }
    if (linkProjTitle.trim()) {
      applicationStore.linkParticipationEntity(app.id, 'project', `proj-${Date.now()}`, linkProjTitle.trim());
    }
    if (linkBlueprintTitle.trim()) {
      applicationStore.linkParticipationEntity(app.id, 'blueprint', `bp-${Date.now()}`, linkBlueprintTitle.trim());
    }
    if (linkKnowledgeTitle.trim()) {
      applicationStore.linkParticipationEntity(app.id, 'knowledge', `ku-${Date.now()}`, linkKnowledgeTitle.trim());
    }
    setIsLinkEntityOpen(false);
    reload();
  };

  // Type-specific icon renderer
  const getTypeIcon = (type?: ParticipationType) => {
    switch (type) {
      case 'workshop': return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'conference': return <Users className="w-5 h-5 text-indigo-600" />;
      case 'meeting': return <Calendar className="w-5 h-5 text-slate-800" />;
      case 'webinar': return <Tv className="w-5 h-5 text-teal-600" />;
      case 'seminar': return <BookOpen className="w-5 h-5 text-cyan-600" />;
      case 'meetup': return <Compass className="w-5 h-5 text-emerald-600" />;
      case 'networking': return <Share2 className="w-5 h-5 text-violet-600" />;
      case 'bootcamp': return <Award className="w-5 h-5 text-amber-700" />;
      case 'hackathon':
      case 'challenge_hackathon': return <Trophy className="w-5 h-5 text-rose-600" />;
      case 'competition': return <Target className="w-5 h-5 text-orange-600" />;
      case 'community': return <Hammer className="w-5 h-5 text-lime-700" />;
      case 'volunteer': return <Heart className="w-5 h-5 text-pink-600" />;
      case 'interview': return <Video className="w-5 h-5 text-blue-600" />;
      case 'assessment': return <FileText className="w-5 h-5 text-purple-600" />;
      default: return <Briefcase className="w-5 h-5 text-blue-600" />;
    }
  };

  // Date format
  const dateStr = app.startDate || app.deadline || app.appliedAt || app.createdAt;
  const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Scheduled';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* ==================================================
          1. TOP NAVIGATION BAR (Header & Breadcrumbs)
          ================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Participation Tracker</span>
          </button>
          
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Participation Tracker</span>
            <span>/</span>
            <span className="font-bold text-slate-800">{app.organization || app.companyName}</span>
          </div>
        </div>

        {/* Quick Status Dropdown directly in header */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border shadow-2xs flex items-center gap-2 cursor-pointer capitalize ${getStatusBadge(currentStatus)}`}
            >
              <span className="text-[10px] uppercase font-black opacity-70">Status:</span>
              <span>{currentStatus.replace(/_/g, ' ')}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isStatusDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20 cursor-default" 
                  onClick={() => setIsStatusDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-1.5 z-30 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 w-56 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Update Participation Status
                  </div>
                  {(['saved', 'invited', 'registered', 'confirmed', 'attended', 'completed', 'cancelled', 'no_show'] as UnifiedParticipationStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusSelect(st)}
                      className={`w-full px-3 py-1.5 text-xs font-semibold rounded-xl capitalize text-left flex items-center justify-between cursor-pointer ${
                        currentStatus === st ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{st.replace(/_/g, ' ')}</span>
                      {currentStatus === st && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Stage Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStageDropdownOpen(!isStageDropdownOpen)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <span className="text-[10px] text-slate-400 uppercase font-black">Stage:</span>
              <span className="truncate max-w-[120px]">{currentStage.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isStageDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20 cursor-default" 
                  onClick={() => setIsStageDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-1.5 z-30 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 w-64 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Change Lifecycle Stage
                  </div>
                  {stages.map((st) => {
                    const isSelected = st.id === currentStage.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleStageSelect(st.id, st.label)}
                        className={`w-full px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between text-left ${
                          isSelected ? 'bg-blue-50 text-blue-800 font-black' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${st.dotColor}`} />
                          <span>{st.label}</span>
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
      </div>

      {/* ==================================================
          2. HERO DETAIL CARD (Overview Section 8)
          ================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          
          <div className="flex items-start gap-4 flex-1">
            {/* Avatar / Icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-xs bg-slate-50 border border-slate-200">
              {getTypeIcon(pType)}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              
              {/* Badges Strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  {lifecycle.label}
                </span>

                <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200">
                  Role: {app.participationRole || 'Participant'}
                </span>

                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border capitalize ${getStatusBadge(currentStatus)}`}>
                  {currentStatus.replace(/_/g, ' ')}
                </span>

                {app.isOnline && (
                  <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                    Virtual / Online
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {app.roleTitle}
              </h1>

              {/* Logistics & Organizer */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {app.organization || app.companyName}
                </span>

                <span>•</span>

                <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formattedDate} {app.startTime ? `at ${app.startTime}` : ''}
                </span>

                {app.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {app.location}
                    </span>
                  </>
                )}
              </div>

            </div>
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            {currentStatus !== 'completed' && currentStatus !== 'attended' && (
              <button
                type="button"
                onClick={() => handleStatusSelect('completed')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Mark Attended / Completed</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddEvidenceOpen(true)}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>+ Add Evidence</span>
            </button>

            {pType === 'career_opportunity' && (
              <button
                type="button"
                onClick={() => setIsInterviewModalOpen(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Schedule Interview</span>
              </button>
            )}
          </div>

        </div>

        {/* Stepper Progression */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-2xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-400">
              Lifecycle Progression ({lifecycle.label})
            </span>
            <span className="text-slate-500 font-semibold">
              Step {activeStageIndex + 1} of {stages.length}: {currentStage.label}
            </span>
          </div>

          <div className="grid grid-flow-col auto-cols-fr gap-2 overflow-x-auto no-scrollbar py-1">
            {stages.map((st, idx) => {
              const isCurrent = idx === activeStageIndex;
              const isCompleted = idx < activeStageIndex;

              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleStageSelect(st.id, st.label)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-w-[120px] ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : isCompleted
                      ? 'bg-blue-50/70 border-blue-200 text-slate-900 hover:bg-blue-100/70'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      isCurrent ? 'text-blue-100' : isCompleted ? 'text-blue-600' : 'text-slate-400'
                    }`}>
                      Stage {idx + 1}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    )}
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                  <div className="font-bold text-xs mt-1 truncate" title={st.label}>
                    {st.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ==================================================
          3. TABS NAVIGATION (Section 8: Overview, Context, Experience, Evidence, Follow-up)
          ================================================== */}
      <div className="space-y-4">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          
          {/* Tab 1: Overview */}
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Overview
          </button>

          {/* Tab 2: Context */}
          <button
            type="button"
            onClick={() => setActiveTab('context')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'context'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Context &amp; Links
          </button>

          {/* Tab 3: Experience */}
          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'experience'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Experience &amp; Takeaways
          </button>

          {/* Tab 4: Evidence */}
          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Evidence ({app.evidenceItems?.length || 0})</span>
          </button>

          {/* Tab 5: Follow-up */}
          <button
            type="button"
            onClick={() => setActiveTab('followup')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'followup'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Follow-up &amp; Tasks ({app.followUpTasks?.length || tasks.length})</span>
          </button>

          {/* Career Opportunity Extra Tabs */}
          {pType === 'career_opportunity' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('interviews')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'interviews'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Interviews ({app.interviews?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tests')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'tests'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Tests &amp; Cases ({assessments.length})</span>
              </button>
            </>
          )}

        </div>

        {/* ==================================================
            TAB 1: OVERVIEW (Section 8)
            ================================================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Details & High-level summary */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Core Overview Specs */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">
                  Participation Overview
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Activity Type</span>
                    <p className="font-bold text-slate-800">{lifecycle.label}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Status</span>
                    <p className="font-bold text-slate-800 capitalize">{currentStatus.replace(/_/g, ' ')}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</span>
                    <p className="font-bold text-slate-800">{app.participationRole || 'Participant'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date &amp; Time</span>
                    <p className="font-bold text-slate-800">{formattedDate} {app.startTime ? `· ${app.startTime}` : ''}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Organizer</span>
                    <p className="font-bold text-slate-800">{app.organization || app.companyName}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Format</span>
                    <p className="font-bold text-slate-800">{app.isOnline ? 'Virtual / Online' : 'In-Person / Onsite'}</p>
                  </div>
                </div>

                {app.description && (
                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                    <span className="font-bold text-slate-700 block">Description &amp; Purpose</span>
                    <p className="text-slate-600 leading-relaxed">{app.description}</p>
                  </div>
                )}
              </div>

              {/* Operational / Dynamic Layout Section (Meeting / Workshop / Hackathon) */}
              {pType === 'meeting' && app.meetingDetails && (
                <div className="bg-slate-50/70 border border-slate-300 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-700" />
                      <span>Operational Meeting Workspace</span>
                    </h3>
                    <span className="text-2xs font-bold text-slate-500 uppercase">Operational Mode</span>
                  </div>

                  {app.meetingDetails.meetingObjective && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 space-y-0.5">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Objective</span>
                      <p>{app.meetingDetails.meetingObjective}</p>
                    </div>
                  )}

                  {app.meetingDetails.agenda && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Agenda</span>
                      <p className="whitespace-pre-line text-slate-700">{app.meetingDetails.agenda}</p>
                    </div>
                  )}

                  {app.meetingDetails.decisions && app.meetingDetails.decisions.length > 0 && (
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-slate-700 uppercase text-[10px]">Decisions Reached</span>
                      <ul className="space-y-1">
                        {app.meetingDetails.decisions.map((dec, i) => (
                          <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white border border-slate-200 text-slate-800">
                            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0 stroke-[2.5]" />
                            <span>{dec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Workshop Highlights */}
              {pType === 'workshop' && app.workshopDetails && (
                <div className="bg-amber-50/30 border border-amber-200/80 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Workshop Objectives &amp; Learning Modules</span>
                  </h3>
                  {app.workshopDetails.instructor && (
                    <p className="text-xs text-slate-600">
                      <strong>Instructor / Facilitator:</strong> {app.workshopDetails.instructor}
                    </p>
                  )}
                  {app.workshopDetails.learningObjectives && (
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-700">Learning Objectives:</span>
                      <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
                        {app.workshopDetails.learningObjectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Right Column: Readiness Signals, Evidence Counter, Quick Links */}
            <div className="space-y-6">
              
              {/* Career Readiness Signals Contribution (Section 9) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Career Readiness Contribution
                  </span>
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600">
                    +{app.readinessContribution || (app.skillIds?.length ? app.skillIds.length * 4 : 10)} pts
                  </span>
                  <span className="text-xs text-slate-500 font-medium">to readiness score</span>
                </div>
                <p className="text-2xs text-slate-500 leading-relaxed">
                  Demonstrated skills from this engagement contribute directly to your verified career competency blueprint.
                </p>
                {app.readinessSkills && app.readinessSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {app.readinessSkills.map((sk, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Evidence Snapshot */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Evidence &amp; Artifacts
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {app.evidenceItems?.length || 0} Attached
                  </span>
                </div>
                {app.evidenceItems && app.evidenceItems.length > 0 ? (
                  <div className="space-y-2">
                    {app.evidenceItems.slice(0, 2).map((ev) => (
                      <div key={ev.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">{ev.title}</span>
                        </div>
                        {ev.verificationBadge && (
                          <span title="Verified">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setActiveTab('evidence')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 pt-1 block cursor-pointer"
                    >
                      View all evidence ({app.evidenceItems.length}) →
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 space-y-2">
                    <p className="text-xs text-slate-400">No evidence attached yet.</p>
                    <button
                      type="button"
                      onClick={() => setIsAddEvidenceOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      + Attach Certificate or Artifact
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ==================================================
            TAB 2: CONTEXT & CAREER OS LINKS (Section 8 & Section 9)
            ================================================== */}
        {activeTab === 'context' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Context &amp; Cross-Module Links
                </h3>
                <p className="text-xs text-slate-500">
                  Connect this participation activity to Opportunities, Projects, Knowledge Library items, and Role Blueprints.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkEntityOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                + Edit Connections
              </button>
            </div>

            {/* Connections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Linked Opportunity */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-2xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Related Opportunity</span>
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                </div>
                {app.relatedOpportunityTitle ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">{app.relatedOpportunityTitle}</p>
                    <p className="text-xs text-slate-500">Connected to opportunity pipeline</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No opportunity connected yet</p>
                )}
              </div>

              {/* Linked Project */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-2xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Related Project</span>
                  <Hammer className="w-3.5 h-3.5 text-purple-600" />
                </div>
                {app.relatedProjectTitle ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">{app.relatedProjectTitle}</p>
                    <p className="text-xs text-slate-500">Connected to engineering portfolio project</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No project connected yet</p>
                )}
              </div>

              {/* Linked Role Blueprint */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-2xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Role Blueprint</span>
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                {app.relatedBlueprintTitle ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">{app.relatedBlueprintTitle}</p>
                    <p className="text-xs text-slate-500">Maps directly to career progression blueprint</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No blueprint linked yet</p>
                )}
              </div>

              {/* Linked Knowledge Library */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-2xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Knowledge System</span>
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                {app.relatedKnowledgeTitle ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">{app.relatedKnowledgeTitle}</p>
                    <p className="text-xs text-slate-500">Linked to Knowledge Library reference guides</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No knowledge unit linked yet</p>
                )}
              </div>

            </div>

            {/* Topics & Tags */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block">Active Topics &amp; Categorization</span>
              <div className="flex flex-wrap gap-2">
                {app.topics && app.topics.length > 0 ? (
                  app.topics.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                      #{t}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No topics specified.</span>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ==================================================
            TAB 3: EXPERIENCE & TAKEAWAYS (Section 8)
            ================================================== */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            
            {/* Notes & Reflections */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Notes &amp; Observations
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record executive notes, ideas, key interactions, or technical reflections.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {notesSavedSuccess && (
                    <span className="text-2xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Saved
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write observations, takeaways, key talking points, or follow-up insights..."
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors leading-relaxed font-sans"
              />
            </div>

            {/* Key Takeaways Interactive Section */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Key Takeaways &amp; Learnings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Capture high-signal takeaways for career memory and interview storytelling.
                  </p>
                </div>
              </div>

              {/* Add Takeaway Form */}
              <form onSubmit={handleAddTakeaway} className="flex gap-2">
                <input
                  type="text"
                  value={newTakeaway}
                  onChange={(e) => setNewTakeaway(e.target.value)}
                  placeholder="Add a key takeaway (e.g. 'Evaluate retrieval precision independent of generation')..."
                  className="flex-1 text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  + Add Takeaway
                </button>
              </form>

              {/* Takeaway List */}
              <div className="space-y-2 pt-1">
                {app.keyTakeaways && app.keyTakeaways.length > 0 ? (
                  app.keyTakeaways.map((tw, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{tw}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center">No takeaways recorded yet. Add your first takeaway above!</p>
                )}
              </div>
            </div>

            {/* Skills & Competencies */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">
                Skills Demonstrated &amp; Acquired
              </h3>
              <div className="flex flex-wrap gap-2">
                {app.skillIds && app.skillIds.length > 0 ? (
                  app.skillIds.map((sk, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                      {sk}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No skills tagged.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ==================================================
            TAB 4: EVIDENCE MODEL (Section 10)
            ================================================== */}
        {activeTab === 'evidence' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  First-Class Evidence &amp; Artifacts
                </h3>
                <p className="text-xs text-slate-500">
                  Certificates, presentations, code outputs, recordings, and badges that substantiate your career readiness.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEvidenceOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Attach Evidence</span>
              </button>
            </div>

            {/* Evidence Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {app.evidenceItems && app.evidenceItems.length > 0 ? (
                app.evidenceItems.map(ev => (
                  <div key={ev.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 capitalize">
                          {ev.type.replace(/_/g, ' ')}
                        </span>
                        {ev.verificationBadge && (
                          <span className="text-2xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{ev.title}</h4>
                      {ev.description && (
                        <p className="text-xs text-slate-500 leading-relaxed">{ev.description}</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-2xs text-slate-400">
                      <span>Uploaded {new Date(ev.uploadedAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        {ev.url && (
                          <a
                            href={ev.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <span>Open Artifact</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteEvidence(ev.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                          title="Remove Evidence"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Paperclip className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">No evidence attached yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Attach certificates, presentation decks, recordings, or project links to strengthen your career signals.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddEvidenceOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                  >
                    + Attach First Evidence Item
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================================
            TAB 5: FOLLOW-UP ACTIONS & TASKS (Section 8)
            ================================================== */}
        {activeTab === 'followup' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-6 shadow-2xs">
            
            {/* Follow-up Tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Follow-Up Action Items
                  </h3>
                  <p className="text-xs text-slate-500">
                    Schedule debriefs, thank-you messages, code implementations, or partner follow-ups.
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {app.followUpTasks?.filter(t => t.completed).length || 0} / {app.followUpTasks?.length || 0} Done
                </span>
              </div>

              {/* Add Task Form */}
              <form onSubmit={handleAddFollowUpTask} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Send thank-you note to speaker, publish notes to Confluence..."
                  className="sm:col-span-2 text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                />
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  + Add Action
                </button>
              </form>

              {/* Tasks Checklist */}
              <div className="space-y-2 pt-2">
                {app.followUpTasks && app.followUpTasks.length > 0 ? (
                  app.followUpTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleFollowUpTask(task.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        task.completed 
                          ? 'bg-slate-50 border-slate-200 text-slate-400' 
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                          task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-xs font-medium ${task.completed ? 'line-through' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      {task.dueDate && (
                        <span className="text-2xs text-slate-400 font-medium">
                          Due {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center">No follow-up action items created yet.</p>
                )}
              </div>
            </div>

            {/* Timeline & Chronological Activity Log */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Activity History &amp; Updates Log
              </h3>

              <form onSubmit={handleAddActivityNote} className="flex gap-2">
                <input
                  type="text"
                  value={newActivityNote}
                  onChange={(e) => setNewActivityNote(e.target.value)}
                  placeholder="Post a quick milestone update or note to this timeline..."
                  className="flex-1 text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
                >
                  Post Update
                </button>
              </form>

              <div className="space-y-2.5 pt-2">
                {app.activities && app.activities.length > 0 ? (
                  app.activities.map(act => (
                    <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{act.title}</span>
                          <span className="text-2xs text-slate-400">
                            {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        {act.description && (
                          <p className="text-slate-600 text-[11px] leading-relaxed">{act.description}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center">No timeline updates recorded.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Existing Tab: INTERVIEWS (For Career Opportunity) */}
        {activeTab === 'interviews' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Scheduled Interview Rounds
              </h3>
              <button
                type="button"
                onClick={() => setIsInterviewModalOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                + Schedule Round
              </button>
            </div>
            <div className="space-y-3">
              {app.interviews && app.interviews.length > 0 ? (
                app.interviews.map(iv => (
                  <div key={iv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{iv.title}</span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-2xs">
                        {iv.type}
                      </span>
                    </div>
                    <p className="text-slate-600">Interviewer: {iv.interviewer || 'Hiring Panel'}</p>
                    <p className="text-2xs text-slate-400">Scheduled: {new Date(iv.scheduledAt).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No interviews scheduled yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Existing Tab: TESTS & CASES */}
        {activeTab === 'tests' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Technical Tests &amp; Take-Home Cases
              </h3>
              <button
                type="button"
                onClick={() => setIsTestModalOpen(true)}
                className="px-3.5 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                + Add Test Assignment
              </button>
            </div>
            <div className="space-y-3">
              {assessments.length > 0 ? (
                assessments.map(ass => (
                  <div key={ass.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{ass.title}</span>
                      <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-2xs">
                        {ass.type}
                      </span>
                    </div>
                    {ass.deadline && (
                      <p className="text-amber-700 font-medium">Deadline: {new Date(ass.deadline).toLocaleDateString()}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No test assignments recorded.</p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ==================================================
          MODALS
          ================================================== */}
      {/* 1. Add Evidence Modal */}
      {isAddEvidenceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsAddEvidenceOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Attach Evidence Item</h3>
              <button type="button" onClick={() => setIsAddEvidenceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddEvidence} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Evidence Title *</label>
                <input
                  type="text"
                  required
                  value={evTitle}
                  onChange={(e) => setEvTitle(e.target.value)}
                  placeholder="e.g. Stanford AI Lab Completion Certificate"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Evidence Type</label>
                <select
                  value={evType}
                  onChange={(e) => setEvType(e.target.value as EvidenceType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden capitalize"
                >
                  <option value="certificate">Certificate</option>
                  <option value="badge">Badge</option>
                  <option value="notes">Notes</option>
                  <option value="presentation">Presentation</option>
                  <option value="project_output">Project Output</option>
                  <option value="recording">Recording</option>
                  <option value="photo">Photo</option>
                  <option value="document">Document / PDF</option>
                  <option value="link">Link</option>
                  <option value="artifact">Other Artifact</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">URL / Link</label>
                <input
                  type="url"
                  value={evUrl}
                  onChange={(e) => setEvUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={evDescription}
                  onChange={(e) => setEvDescription(e.target.value)}
                  placeholder="Brief context or verification note..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Save Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Link Entities Modal */}
      {isLinkEntityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsLinkEntityOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Connect Career OS Entities</h3>
              <button type="button" onClick={() => setIsLinkEntityOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEntities} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Related Opportunity</label>
                <input
                  type="text"
                  value={linkOppTitle}
                  onChange={(e) => setLinkOppTitle(e.target.value)}
                  placeholder={app.relatedOpportunityTitle || "e.g. Senior Product Manager"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Related Project</label>
                <input
                  type="text"
                  value={linkProjTitle}
                  onChange={(e) => setLinkProjTitle(e.target.value)}
                  placeholder={app.relatedProjectTitle || "e.g. Vector Search Architecture"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Blueprint</label>
                <input
                  type="text"
                  value={linkBlueprintTitle}
                  onChange={(e) => setLinkBlueprintTitle(e.target.value)}
                  placeholder={app.relatedBlueprintTitle || "e.g. AI Product Manager Blueprint"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Knowledge System Item</label>
                <input
                  type="text"
                  value={linkKnowledgeTitle}
                  onChange={(e) => setLinkKnowledgeTitle(e.target.value)}
                  placeholder={app.relatedKnowledgeTitle || "e.g. Unit Economics & SaaS Metrics"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkEntityOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Save Links
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Schedule Interview Modal */}
      {isInterviewModalOpen && (
        <ScheduleInterviewModal
          isOpen={isInterviewModalOpen}
          onClose={() => setIsInterviewModalOpen(false)}
          applications={[app]}
          preselectedAppId={app.id}
          onInterviewScheduled={() => {
            setIsInterviewModalOpen(false);
            reload();
          }}
        />
      )}

      {/* 4. Add Test Assignment Modal */}
      {isTestModalOpen && (
        <AddTestAssignmentModal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          applications={[app]}
          preselectedAppId={app.id}
          onAssignmentCreated={() => {
            setIsTestModalOpen(false);
            reload();
          }}
        />
      )}

    </div>
  );
};
