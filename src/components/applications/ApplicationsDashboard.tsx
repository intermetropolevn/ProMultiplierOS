import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  Clock, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  Check,
  FileText, 
  Award, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Trash2,
  Filter,
  Search,
  ExternalLink,
  Kanban,
  List,
  Video,
  Copy,
  Archive,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  X
} from 'lucide-react';
import { 
  JobApplication, 
  ApplicationPrimaryState,
  ApplicationSubState,
  CANONICAL_PIPELINE_STAGES,
  UpcomingDeadlineItem 
} from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { AddApplicationModal } from './AddApplicationModal';
import { StageTransitionModal } from '../tracker/StageTransitionModal';
import { AddTestAssignmentModal } from '../tracker/AddTestAssignmentModal';
import { ScheduleInterviewModal } from '../tracker/ScheduleInterviewModal';
import { UpcomingDeadlinesWidget } from '../tracker/UpcomingDeadlinesWidget';
import { PipelineBoardView } from '../tracker/PipelineBoardView';

interface ApplicationsDashboardProps {
  onSelectApplication: (applicationId: string) => void;
}

interface StateOption {
  primary: ApplicationPrimaryState;
  sub?: ApplicationSubState;
  label: string;
  dotColor: string;
  badgeBg: string;
}

const PIPELINE_STATE_OPTIONS: StateOption[] = [
  { primary: 'applied_screening', sub: 'applied', label: 'Applied', dotColor: 'bg-slate-900', badgeBg: 'bg-slate-100 text-slate-800 hover:bg-slate-200' },
  { primary: 'applied_screening', sub: 'screening', label: 'HR screening', dotColor: 'bg-slate-500', badgeBg: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
  { primary: 'assessment_case', sub: 'take_home', label: 'Take-home case', dotColor: 'bg-purple-500', badgeBg: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
  { primary: 'interviews', sub: 'technical', label: '1st interview', dotColor: 'bg-pink-500', badgeBg: 'bg-pink-50 text-pink-700 hover:bg-pink-100' },
  { primary: 'interviews', sub: 'panel', label: '2nd interview', dotColor: 'bg-blue-500', badgeBg: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
  { primary: 'interviews', sub: 'final', label: 'Final interview', dotColor: 'bg-emerald-500', badgeBg: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
  { primary: 'offer_negotiation', sub: 'offer_received', label: 'Offer received', dotColor: 'bg-teal-500', badgeBg: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
  { primary: 'archived_closed', sub: 'rejected', label: 'Archived / Closed', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
];

export const ApplicationsDashboard: React.FC<ApplicationsDashboardProps> = ({
  onSelectApplication
}) => {
  const [applications, setApplications] = useState<JobApplication[]>(() => 
    applicationStore.getApplications()
  );
  const [deadlines, setDeadlines] = useState<UpcomingDeadlineItem[]>(() => 
    applicationStore.getAllUpcomingDeadlines()
  );

  // View state - List view default as in Image 2
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [filterStage, setFilterStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdownAppId, setActiveDropdownAppId] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transitionApp, setTransitionApp] = useState<JobApplication | null>(null);
  const [testModalAppId, setTestModalAppId] = useState<string | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [interviewModalAppId, setInterviewModalAppId] = useState<string | null>(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isDeadlinesModalOpen, setIsDeadlinesModalOpen] = useState(false);

  const reloadData = () => {
    setApplications(applicationStore.getApplications());
    setDeadlines(applicationStore.getAllUpcomingDeadlines());
  };

  // 1. Active Applications count (non-archived)
  const activeAppsCount = useMemo(() => {
    return applications.filter(a => a.pipelineState !== 'archived_closed').length;
  }, [applications]);

  // 2. Test Assignments count (assessments from applicationStore)
  const testAssignmentsCount = useMemo(() => {
    const storeAssessments = applicationStore.getAllAssessments();
    const appTestsCount = applications.reduce((total, a) => {
      const tests = a.testAssignments ? a.testAssignments.length : 0;
      return total + tests;
    }, 0);
    return Math.max(storeAssessments.length, appTestsCount);
  }, [applications]);

  // 3. Offers & Advanced count (directly synchronized with canonical offer_negotiation pipeline stage)
  const offersAndAdvancedCount = useMemo(() => {
    return applications.filter(a => a.pipelineState === 'offer_negotiation').length;
  }, [applications]);

  // 4. Upcoming Deadlines / Tasks count (imminent deadlines & pending tasks)
  const urgentTasksCount = useMemo(() => {
    if (deadlines && deadlines.length > 0) {
      return deadlines.length;
    }
    return applications.filter(a => a.deadline && a.pipelineState !== 'archived_closed').length;
  }, [applications, deadlines]);

  // Filter applications by stage and search
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const primaryState = app.pipelineState || 'applied_screening';
      
      if (filterStage !== 'All' && primaryState !== filterStage) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCompany = app.companyName.toLowerCase().includes(q);
        const matchesRole = app.roleTitle.toLowerCase().includes(q);
        const matchesLocation = app.location && app.location.toLowerCase().includes(q);
        const matchesSkills = app.skillIds && app.skillIds.some(s => s.toLowerCase().includes(q));
        return matchesCompany || matchesRole || matchesLocation || matchesSkills;
      }

      return true;
    });
  }, [applications, filterStage, searchQuery]);

  // Stage counts for filter pills
  const stageStats = useMemo(() => {
    const counts: Record<string, number> = {
      applied_screening: 0,
      assessment_case: 0,
      interviews: 0,
      offer_negotiation: 0,
      archived_closed: 0
    };
    applications.forEach(a => {
      const state = a.pipelineState || 'applied_screening';
      if (counts[state] !== undefined) {
        counts[state]++;
      }
    });
    return counts;
  }, [applications]);

  const handleStateChange = (appId: string, primary: ApplicationPrimaryState, sub?: ApplicationSubState) => {
    applicationStore.moveApplicationToState(
      appId,
      primary,
      sub,
      `State updated from pipeline to ${primary}${sub ? ' (' + sub + ')' : ''}`
    );
    setActiveDropdownAppId(null);
    reloadData();
  };

  const handleDuplicate = (appId: string) => {
    const dup = applicationStore.duplicateApplication(appId);
    if (dup) {
      reloadData();
    }
  };

  const handleArchive = (appId: string) => {
    applicationStore.archiveApplication(appId);
    reloadData();
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to remove this application?')) {
      applicationStore.deleteApplication(id);
      reloadData();
    }
  };

  const getCurrentStateLabel = (app: JobApplication): string => {
    const match = PIPELINE_STATE_OPTIONS.find(
      opt => opt.primary === app.pipelineState && opt.sub === app.pipelineSubState
    );
    if (match) return match.label;

    if (app.pipelineSubState) {
      return app.pipelineSubState.replace(/_/g, ' ');
    }
    const stage = CANONICAL_PIPELINE_STAGES.find(s => s.id === app.pipelineState);
    return stage?.title || 'Applied';
  };

  const getCurrentStateDot = (app: JobApplication): string => {
    const match = PIPELINE_STATE_OPTIONS.find(
      opt => opt.primary === app.pipelineState && opt.sub === app.pipelineSubState
    );
    if (match) return match.dotColor;

    switch (app.pipelineState) {
      case 'applied_screening': return 'bg-slate-900';
      case 'assessment_case': return 'bg-purple-500';
      case 'interviews': return 'bg-blue-500';
      case 'offer_negotiation': return 'bg-teal-500';
      case 'archived_closed': return 'bg-slate-400';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* UNIFIED BANNER & CONTROL SURFACE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        {/* ROW 1: Heading & Supporting Description (LEFT) + Primary Quick Actions (RIGHT) */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Application Pipeline &amp; Case Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-2xl leading-relaxed">
              Centralized canonical stage progression, upcoming technical case assignments, interview schedules, and integrated workspaces.
            </p>
          </div>

          {/* Quick Actions in top-right corner */}
          <div className="flex items-center gap-2.5 shrink-0 self-start">
            <button
              onClick={() => setIsDeadlinesModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-colors shadow-2xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Upcoming Deadlines ({urgentTasksCount})</span>
            </button>
            <button
              id="btn-add-application-primary"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>+ New Application</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Primary Tracker Mode Controls */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-medium">
            <button
              id="view-mode-list-btn"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <List className="w-4 h-4 text-blue-600" />
              <span>List View</span>
            </button>

            <button
              id="view-mode-board-btn"
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Kanban className="w-4 h-4 text-purple-600" />
              <span>Pipeline Board</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            {viewMode === 'list'
              ? 'Detailed chronological & stage records with contextual actions'
              : 'Visual stage columns with drag-and-drop progression'}
          </div>
        </div>
      </div>

      {/* 2. Four Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: ACTIVE APPLICATIONS */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Active Applications
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{activeAppsCount}</span>
            <span className="text-xs text-slate-500 font-medium">In pipeline</span>
          </div>
        </div>

        {/* Card 2: TEST ASSIGNMENTS */}
        <div 
          onClick={() => {
            setTestModalAppId(applications[0]?.id || null);
            setIsTestModalOpen(true);
          }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
              Test Assignments
            </span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{testAssignmentsCount}</span>
            <span className="text-xs text-slate-500 font-medium">Assignments logged</span>
          </div>
        </div>

        {/* Card 3: OFFERS & ADVANCED */}
        <div 
          onClick={() => setFilterStage('offer_negotiation')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
              Offers &amp; Advanced
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{offersAndAdvancedCount}</span>
            <span className="text-xs text-slate-500 font-medium">Near final</span>
          </div>
        </div>

        {/* Card 4: UPCOMING DEADLINES */}
        <div 
          onClick={() => setIsDeadlinesModalOpen(true)}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
              Upcoming Deadlines
            </span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition-colors">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{urgentTasksCount}</span>
            <span className="text-xs text-slate-500 font-medium">Tasks pending</span>
          </div>
        </div>

      </div>

      {/* 3. Pipeline Filter Bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        
        {/* Stage Filter Controls */}
        <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-medium overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setFilterStage('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterStage === 'All'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            All Stages · {applications.length}
          </button>

          {CANONICAL_PIPELINE_STAGES.map(s => {
            const count = stageStats[s.id] || 0;
            const isSelected = filterStage === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilterStage(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {s.title} · {count}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, role, skill..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* 4. Application Pipeline Primary Rows (Image 2) */}
      {viewMode === 'board' ? (
        <PipelineBoardView
          applications={filteredApps}
          onSelectApplication={onSelectApplication}
          onOpenTransitionModal={(app) => setTransitionApp(app)}
          onQuickAdvance={(app) => {
            const primary = app.pipelineState || 'applied_screening';
            const currentIndex = CANONICAL_PIPELINE_STAGES.findIndex(s => s.id === primary);
            if (currentIndex >= 0 && currentIndex < CANONICAL_PIPELINE_STAGES.length - 1) {
              const nextStage = CANONICAL_PIPELINE_STAGES[currentIndex + 1];
              handleStateChange(app.id, nextStage.id, nextStage.subStates[0]?.id);
            }
          }}
          onAddTest={(app) => {
            setTestModalAppId(app.id);
            setIsTestModalOpen(true);
          }}
          onScheduleInterview={(app) => {
            setInterviewModalAppId(app.id);
            setIsInterviewModalOpen(true);
          }}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      ) : (
        <div className="space-y-3">
          {filteredApps.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No applications match current filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Adjust search queries or clear stage filters to see opportunities.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilterStage('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredApps.map(item => {
              const primaryState = item.pipelineState || 'applied_screening';
              const stageDef = CANONICAL_PIPELINE_STAGES.find(s => s.id === primaryState);
              const isDropdownOpen = activeDropdownAppId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 relative group"
                >
                  {/* Left Info Column */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Company initial avatar */}
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center font-black text-slate-800 text-xs shrink-0">
                      {item.companyName.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Role title & stage badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 
                          onClick={() => onSelectApplication(item.id)}
                          title="Open application workspace"
                          className="text-sm font-black text-slate-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
                        >
                          {item.roleTitle}
                        </h4>

                        {/* Primary stage badge */}
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          primaryState === 'applied_screening' ? 'bg-amber-100 text-amber-900' :
                          primaryState === 'assessment_case' ? 'bg-purple-100 text-purple-900' :
                          primaryState === 'interviews' ? 'bg-blue-100 text-blue-900' :
                          primaryState === 'offer_negotiation' ? 'bg-emerald-100 text-emerald-900' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {stageDef?.title.toUpperCase() || primaryState.toUpperCase()}
                        </span>

                        {/* Sub-state pill */}
                        {item.pipelineSubState && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {item.pipelineSubState.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>

                      {/* Meta line: Company • Location • Applied date • Due date */}
                      <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-slate-500">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {item.companyName}
                        </span>
                        <span>•</span>
                        <span>{item.location || 'Remote'}</span>
                        <span>•</span>
                        <span>Applied: {new Date(item.appliedAt || item.createdAt).toLocaleDateString()}</span>
                        
                        {item.deadline && (
                          <>
                            <span>•</span>
                            <span className="text-amber-700 font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Due {new Date(item.deadline).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Skills calibrated line */}
                      {item.skillIds && item.skillIds.length > 0 && (
                        <div className="mt-1 text-[11px] text-slate-400 font-medium">
                          {item.skillIds.length} skills calibrated
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: State Change Dropdown + Action Icons (NO WORKSPACE BUTTON!) */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    
                    {/* Change State Dropdown / Popover */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownAppId(isDropdownOpen ? null : item.id);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/90 text-slate-800 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200/80 shadow-3xs"
                      >
                        <span className={`w-2 h-2 rounded-full ${getCurrentStateDot(item)}`} />
                        <span>{getCurrentStateLabel(item)}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {/* Popover Menu with Bullet Dots matching Image 2 */}
                      {isDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-20 cursor-default" 
                            onClick={() => setActiveDropdownAppId(null)} 
                          />
                          <div className="absolute right-0 mt-1.5 z-30 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 w-52 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                              Select Pipeline State
                            </div>
                            {PIPELINE_STATE_OPTIONS.map((opt) => {
                              const isSelected = item.pipelineState === opt.primary && (item.pipelineSubState === opt.sub || (!item.pipelineSubState && !opt.sub));
                              return (
                                <button
                                  key={`${opt.primary}-${opt.sub || 'none'}`}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStateChange(item.id, opt.primary, opt.sub);
                                  }}
                                  className={`w-full px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between text-left ${
                                    isSelected 
                                      ? 'bg-blue-50 text-blue-800 border border-blue-200/60 font-black' 
                                      : `${opt.badgeBg}`
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

                    {/* Secondary icon buttons: Copy, Archive, Delete */}
                    <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(item.id)}
                        title="Duplicate Application"
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleArchive(item.id)}
                        title="Archive Application"
                        className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(item.id, e)}
                        title="Delete Application"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* MODALS */}

      {/* 1. Add Application Modal (Triggered by Active Applications Card 1 + button) */}
      {isAddModalOpen && (
        <AddApplicationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onApplicationCreated={(newApp) => {
            reloadData();
            onSelectApplication(newApp.id);
          }}
        />
      )}

      {/* 2. Add Test Challenge Modal (Triggered by Test Assignments Card 2 + button) */}
      {isTestModalOpen && (
        <AddTestAssignmentModal
          isOpen={isTestModalOpen}
          applications={applications}
          preselectedAppId={testModalAppId || applications[0]?.id}
          onClose={() => {
            setIsTestModalOpen(false);
            setTestModalAppId(null);
          }}
          onAssignmentCreated={() => reloadData()}
        />
      )}

      {/* 3. Upcoming Deadlines Timeline Modal (Triggered by Card 4 corner calendar icon) */}
      {isDeadlinesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Upcoming Deadlines &amp; Tasks</h3>
                  <p className="text-xs text-slate-500 font-medium">Prioritized timeline for take-home cases, interviews, and urgent application deadlines</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDeadlinesModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {deadlines.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No Urgent Deadlines Pending</h4>
                <p className="text-xs text-slate-500">All applications and upcoming milestone deliverables are up to date.</p>
              </div>
            ) : (
              <UpcomingDeadlinesWidget
                deadlines={deadlines}
                onSelectAction={(appId) => {
                  setIsDeadlinesModalOpen(false);
                  onSelectApplication(appId);
                }}
                onOpenWorkspace={(appId) => {
                  setIsDeadlinesModalOpen(false);
                  onSelectApplication(appId);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* 4. Schedule Interview Modal */}
      {isInterviewModalOpen && (
        <ScheduleInterviewModal
          isOpen={isInterviewModalOpen}
          onClose={() => {
            setIsInterviewModalOpen(false);
            setInterviewModalAppId(null);
          }}
          applicationId={interviewModalAppId || applications[0]?.id || ''}
          onCreated={() => reloadData()}
        />
      )}

      {/* 5. Stage Transition Modal */}
      {transitionApp && (
        <StageTransitionModal
          application={transitionApp}
          isOpen={!!transitionApp}
          onClose={() => setTransitionApp(null)}
          onTransitionCompleted={() => {
            reloadData();
            setTransitionApp(null);
          }}
        />
      )}

    </div>
  );
};
