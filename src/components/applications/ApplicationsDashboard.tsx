import React, { useState, useMemo, useEffect } from 'react';
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  Clock, 
  Plus, 
  Sparkles, 
  Check, 
  FileText, 
  Award, 
  Target, 
  TrendingUp, 
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
  X,
  Trophy,
  Hammer,
  Users,
  Compass,
  SlidersHorizontal,
  Bookmark,
  Upload,
  Paperclip,
  Share2,
  Tv,
  BookOpen,
  Heart,
  Layers,
  CheckSquare
} from 'lucide-react';
import { 
  JobApplication, 
  ParticipationType,
  ParticipationStatus,
  UnifiedParticipationStatus,
  PARTICIPATION_LIFECYCLES,
  UpcomingDeadlineItem 
} from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { TrackNewParticipationModal } from '../tracker/TrackNewParticipationModal';
import { ImportParticipationModal } from '../tracker/ImportParticipationModal';
import { StageTransitionModal } from '../tracker/StageTransitionModal';
import { useAccessControl } from '../../services/accessControlService';
import { AddTestAssignmentModal } from '../tracker/AddTestAssignmentModal';
import { ScheduleInterviewModal } from '../tracker/ScheduleInterviewModal';
import { UpcomingDeadlinesWidget } from '../tracker/UpcomingDeadlinesWidget';
import { PipelineBoardView } from '../tracker/PipelineBoardView';

export type MainTimelineTab = 'all' | 'upcoming' | 'completed' | 'saved';

interface ApplicationsDashboardProps {
  onSelectApplication: (applicationId: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const ApplicationsDashboard: React.FC<ApplicationsDashboardProps> = ({
  onSelectApplication,
  onNavigateToTab
}) => {
  const { accessLevel, capabilities, recordMeaningfulInteraction } = useAccessControl();
  const [applications, setApplications] = useState<JobApplication[]>(() => 
    applicationStore.getApplications()
  );
  const [deadlines, setDeadlines] = useState<UpcomingDeadlineItem[]>(() => 
    applicationStore.getAllUpcomingDeadlines()
  );

  // View state: List view default
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  
  // Section 3 Tabs: All, Upcoming, Completed, Saved
  const [activeTab, setActiveTab] = useState<MainTimelineTab>('all');
  
  // Multi-Filters (Section 4)
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [organizerFilter, setOrganizerFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all'); // all, online, in_person
  const [relatedOppFilter, setRelatedOppFilter] = useState<string>('all'); // all, has_opp
  const [relatedProjFilter, setRelatedProjFilter] = useState<string>('all'); // all, has_proj
  const [sortBy, setSortBy] = useState<'recommended' | 'newest' | 'date' | 'priority'>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Modals
  const [activeDropdownAppId, setActiveDropdownAppId] = useState<string | null>(null);
  const [isTrackNewModalOpen, setIsTrackNewModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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

  useEffect(() => {
    const handleUpdate = () => reloadData();
    window.addEventListener('career_applications_updated', handleUpdate);
    window.addEventListener('career_access_changed', handleUpdate);
    return () => {
      window.removeEventListener('career_applications_updated', handleUpdate);
      window.removeEventListener('career_access_changed', handleUpdate);
    };
  }, []);

  // Helper: Determine if item is Saved, Completed, or Upcoming
  const isItemSaved = (item: JobApplication): boolean => {
    return item.unifiedStatus === 'saved' || 
           item.participationStatus === 'SAVED' || 
           item.pipelineSubState === 'wishlist' || 
           item.status === 'WISHLIST';
  };

  const isItemCompleted = (item: JobApplication): boolean => {
    return item.unifiedStatus === 'completed' || 
           item.unifiedStatus === 'attended' || 
           item.participationStatus === 'COMPLETED' || 
           item.pipelineState === 'archived_closed' || 
           item.status === 'ACCEPTED' || 
           item.currentStageId === 'completed' || 
           item.currentStageId === 'winner_completed' || 
           item.currentStageId === 'certified' ||
           item.currentStageId === 'outcome';
  };

  const isItemUpcoming = (item: JobApplication): boolean => {
    if (isItemSaved(item) || isItemCompleted(item)) return false;
    return true;
  };

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: applications.length,
      upcoming: applications.filter(isItemUpcoming).length,
      completed: applications.filter(isItemCompleted).length,
      saved: applications.filter(isItemSaved).length,
    };
  }, [applications]);

  // Section 3: Summary Cards Metrics
  const upcomingCount = tabCounts.upcoming;
  const completedCount = tabCounts.completed;

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return applications.filter(a => {
      const dateToCheck = a.startDate || a.deadline || a.appliedAt || a.createdAt;
      if (!dateToCheck) return false;
      const d = new Date(dateToCheck);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
  }, [applications]);

  const totalParticipationCount = applications.length;

  // Filter options lists
  const uniqueTopics = useMemo(() => {
    const set = new Set<string>();
    applications.forEach(a => {
      if (a.topics) a.topics.forEach(t => set.add(t));
      if (a.domain) set.add(a.domain);
    });
    return Array.from(set).filter(Boolean).sort();
  }, [applications]);

  const uniqueSkills = useMemo(() => {
    const set = new Set<string>();
    applications.forEach(a => {
      if (a.skillIds) a.skillIds.forEach(s => set.add(s));
    });
    return Array.from(set).filter(Boolean).sort();
  }, [applications]);

  const uniqueOrganizers = useMemo(() => {
    const set = new Set<string>();
    applications.forEach(a => {
      if (a.organization) set.add(a.organization);
      if (a.companyName) set.add(a.companyName);
    });
    return Array.from(set).filter(Boolean).sort();
  }, [applications]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (typeFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    if (dateFilter !== 'all') count++;
    if (topicFilter !== 'all') count++;
    if (skillFilter !== 'all') count++;
    if (organizerFilter !== 'all') count++;
    if (locationFilter !== 'all') count++;
    if (relatedOppFilter !== 'all') count++;
    if (relatedProjFilter !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    typeFilter, statusFilter, dateFilter, topicFilter, skillFilter, 
    organizerFilter, locationFilter, relatedOppFilter, relatedProjFilter, searchQuery
  ]);

  const resetAllFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setDateFilter('all');
    setTopicFilter('all');
    setSkillFilter('all');
    setOrganizerFilter('all');
    setLocationFilter('all');
    setRelatedOppFilter('all');
    setRelatedProjFilter('all');
    setSearchQuery('');
  };

  // Main Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return applications.filter(app => {
      // 1. Primary Timeline Tab Filter (All, Upcoming, Completed, Saved)
      if (activeTab === 'upcoming' && !isItemUpcoming(app)) return false;
      if (activeTab === 'completed' && !isItemCompleted(app)) return false;
      if (activeTab === 'saved' && !isItemSaved(app)) return false;

      // 2. Participation Type Filter
      if (typeFilter !== 'all') {
        const pType = app.participationType || 'career_opportunity';
        if (pType !== typeFilter) {
          // Check aliases
          if (typeFilter === 'hackathon' && pType !== 'challenge_hackathon') return false;
          else if (typeFilter === 'career_opportunity' && pType !== 'interview' && pType !== 'assessment') return false;
          else if (pType !== typeFilter) return false;
        }
      }

      // 3. Status Filter (Unified status)
      if (statusFilter !== 'all') {
        const uStatus = (app.unifiedStatus || app.participationStatus || app.status || '').toLowerCase();
        if (uStatus !== statusFilter.toLowerCase()) return false;
      }

      // 4. Date Filter
      if (dateFilter !== 'all') {
        const dStr = app.startDate || app.deadline || app.appliedAt || app.createdAt;
        if (!dStr) return false;
        const targetDate = new Date(dStr);
        const now = new Date();
        const diffDays = Math.round((targetDate.getTime() - now.getTime()) / 86400000);

        if (dateFilter === 'today' && Math.abs(diffDays) > 1) return false;
        if (dateFilter === 'this_week' && (diffDays < -7 || diffDays > 7)) return false;
        if (dateFilter === 'this_month') {
          if (targetDate.getMonth() !== now.getMonth() || targetDate.getFullYear() !== now.getFullYear()) return false;
        }
        if (dateFilter === 'upcoming' && diffDays < 0) return false;
        if (dateFilter === 'past' && diffDays > 0) return false;
      }

      // 5. Topic Filter
      if (topicFilter !== 'all') {
        const matchesTopic = (app.topics && app.topics.some(t => t.toLowerCase() === topicFilter.toLowerCase())) ||
                             (app.domain && app.domain.toLowerCase() === topicFilter.toLowerCase());
        if (!matchesTopic) return false;
      }

      // 6. Skill Filter
      if (skillFilter !== 'all') {
        const matchesSkill = app.skillIds && app.skillIds.some(s => s.toLowerCase() === skillFilter.toLowerCase());
        if (!matchesSkill) return false;
      }

      // 7. Organizer Filter
      if (organizerFilter !== 'all') {
        const org = (app.organization || app.companyName || '').toLowerCase();
        if (org !== organizerFilter.toLowerCase()) return false;
      }

      // 8. Location / Online Filter
      if (locationFilter !== 'all') {
        if (locationFilter === 'online' && !app.isOnline && !app.location?.toLowerCase().includes('remote') && !app.location?.toLowerCase().includes('online')) return false;
        if (locationFilter === 'in_person' && app.isOnline) return false;
      }

      // 9. Related Opportunity Filter
      if (relatedOppFilter === 'has_opp') {
        if (!app.relatedOpportunityId && !app.relatedOpportunityTitle && !app.jobOpportunityId) return false;
      }

      // 10. Related Project Filter
      if (relatedProjFilter === 'has_proj') {
        if (!app.relatedProjectId && !app.relatedProjectTitle && !app.hackathonData?.projectName) return false;
      }

      // 11. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = app.roleTitle.toLowerCase().includes(q);
        const matchesOrg = (app.organization || app.companyName || '').toLowerCase().includes(q);
        const matchesDesc = (app.description || '').toLowerCase().includes(q);
        const matchesNotes = (app.notes || '').toLowerCase().includes(q);
        const matchesTopics = app.topics && app.topics.some(t => t.toLowerCase().includes(q));
        const matchesSkills = app.skillIds && app.skillIds.some(s => s.toLowerCase().includes(q));
        const matchesRole = (app.participationRole || '').toLowerCase().includes(q);
        const matchesType = (app.participationType || '').toLowerCase().includes(q);

        if (!matchesTitle && !matchesOrg && !matchesDesc && !matchesNotes && !matchesTopics && !matchesSkills && !matchesRole && !matchesType) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      }
      if (sortBy === 'date') {
        const dateA = a.startDate || a.deadline || a.createdAt || '';
        const dateB = b.startDate || b.deadline || b.createdAt || '';
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      }
      if (sortBy === 'priority') {
        const weight: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (weight[b.priority || 'MEDIUM'] || 0) - (weight[a.priority || 'MEDIUM'] || 0);
      }
      // 'recommended'
      return 0;
    });
  }, [
    applications, 
    activeTab, 
    typeFilter, 
    statusFilter, 
    dateFilter, 
    topicFilter, 
    skillFilter, 
    organizerFilter, 
    locationFilter, 
    relatedOppFilter, 
    relatedProjFilter, 
    sortBy, 
    searchQuery
  ]);

  // Handlers
  const handleStateAdvance = (appId: string, nextStageId: string, nextStageName: string) => {
    applicationStore.updateParticipationStage(appId, nextStageId, nextStageName);
    reloadData();
  };

  const handleQuickStatusChange = (appId: string, nextStatus: UnifiedParticipationStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    applicationStore.updateParticipationUnifiedStatus(appId, nextStatus);
    reloadData();
  };

  const handleDuplicate = (appId: string) => {
    const dup = applicationStore.duplicateApplication(appId);
    if (dup) reloadData();
  };

  const handleArchive = (appId: string) => {
    applicationStore.archiveApplication(appId);
    reloadData();
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to remove this participation record?')) {
      applicationStore.deleteApplication(id);
      reloadData();
    }
  };

  // Type-specific icon renderer
  const getTypeIcon = (type?: ParticipationType) => {
    switch (type) {
      case 'workshop': return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'conference': return <Users className="w-4 h-4 text-indigo-600" />;
      case 'meeting': return <Calendar className="w-4 h-4 text-slate-700" />;
      case 'webinar': return <Tv className="w-4 h-4 text-teal-600" />;
      case 'seminar': return <BookOpen className="w-4 h-4 text-cyan-600" />;
      case 'meetup': return <Compass className="w-4 h-4 text-emerald-600" />;
      case 'networking': return <Share2 className="w-4 h-4 text-violet-600" />;
      case 'bootcamp': return <Award className="w-4 h-4 text-amber-700" />;
      case 'hackathon':
      case 'challenge_hackathon': return <Trophy className="w-4 h-4 text-rose-600" />;
      case 'competition': return <Target className="w-4 h-4 text-orange-600" />;
      case 'community': return <Hammer className="w-4 h-4 text-lime-700" />;
      case 'volunteer': return <Heart className="w-4 h-4 text-pink-600" />;
      case 'interview': return <Video className="w-4 h-4 text-blue-600" />;
      case 'assessment': return <FileText className="w-4 h-4 text-purple-600" />;
      default: return <Briefcase className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeLabel = (type?: ParticipationType) => {
    if (!type) return 'Workshop';
    if (type === 'challenge_hackathon') return 'Hackathon';
    if (type === 'career_opportunity') return 'Career Opportunity';
    if (type === 'builder_match') return 'Builder Match';
    if (type === 'mentor_mentee') return 'Mentorship';
    if (type === 'learning_program') return 'Bootcamp';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusBadgeColor = (status?: string) => {
    const s = (status || 'registered').toLowerCase();
    switch (s) {
      case 'saved': return 'text-slate-700 bg-slate-100 border-slate-300';
      case 'invited': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'registered': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'confirmed': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'attended': return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'completed': return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'cancelled': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'no_show': return 'text-slate-600 bg-slate-200 border-slate-300';
      default: return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ==================================================
          1. HEADER & PRIMARY CTAs (Section 3)
          ================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        
        {/* ROW 1: Title, Subtitle, and Primary Actions */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Participation Tracker
              </span>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Showing {applications.length} sample participation records (Curated Beta Preview)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Participation Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-2xl leading-relaxed">
              Track professional activities, learning experiences, events, meetings, and career-related engagements.
            </p>
          </div>

          {/* Top Actions: Secondary actions + Primary CTA */}
          <div className="flex items-center gap-2 flex-wrap shrink-0 self-start">
            
            {/* Import Button (Secondary) */}
            <button
              id="btn-import-participation"
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 transition-colors shadow-2xs cursor-pointer"
              title="Import Activities & Sample Pack"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import</span>
            </button>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors shadow-2xs cursor-pointer ${
                showFilterPanel || activeFiltersCount > 0
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Primary CTA: + Add Participation */}
            <button
              id="btn-add-participation-primary"
              type="button"
              onClick={() => {
                recordMeaningfulInteraction('creation_preview');
                setIsTrackNewModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white stroke-[2.5]" />
              <span>+ Add Participation</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Primary Tabs (Section 3: All, Upcoming, Completed, Saved) + View Switcher */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          
          {/* Main Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            
            {/* Tab: All */}
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All ({tabCounts.all})
            </button>

            {/* Tab: Upcoming */}
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Upcoming ({tabCounts.upcoming})</span>
            </button>

            {/* Tab: Completed */}
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed ({tabCounts.completed})</span>
            </button>

            {/* Tab: Saved */}
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'saved'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({tabCounts.saved})</span>
            </button>

          </div>

          {/* View Mode Switcher: List View vs Stage Board */}
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-medium shrink-0">
            <button
              type="button"
              id="view-mode-list-btn"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <List className="w-3.5 h-3.5 text-blue-600" />
              <span>List View</span>
            </button>

            <button
              type="button"
              id="view-mode-board-btn"
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 text-purple-600" />
              <span>Stage Board</span>
            </button>
          </div>

        </div>

      </div>

      {/* ==================================================
          2. FOUR SUMMARY METRIC CARDS (Section 3)
          ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: UPCOMING */}
        <div 
          onClick={() => setActiveTab('upcoming')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-700 transition-colors">
              Upcoming
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black tracking-tight text-slate-900">{upcomingCount}</span>
            <span className="text-xs text-slate-500 font-medium">Scheduled activities</span>
          </div>
        </div>

        {/* Card 2: COMPLETED */}
        <div 
          onClick={() => setActiveTab('completed')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-700 transition-colors">
              Completed
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black tracking-tight text-slate-900">{completedCount}</span>
            <span className="text-xs text-slate-500 font-medium">Attended &amp; verified</span>
          </div>
        </div>

        {/* Card 3: THIS MONTH */}
        <div 
          onClick={() => {
            setDateFilter('this_month');
            setShowFilterPanel(true);
          }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-amber-700 transition-colors">
              This Month
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black tracking-tight text-slate-900">{thisMonthCount}</span>
            <span className="text-xs text-slate-500 font-medium">Active this month</span>
          </div>
        </div>

        {/* Card 4: TOTAL PARTICIPATION */}
        <div 
          onClick={() => {
            setActiveTab('all');
            resetAllFilters();
          }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-purple-300 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-purple-700 transition-colors">
              Total Participation
            </span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black tracking-tight text-slate-900">{totalParticipationCount}</span>
            <span className="text-xs text-slate-500 font-medium">Across all types</span>
          </div>
        </div>

      </div>

      {/* ==================================================
          3. MULTI-FILTERS & SEARCH BAR (Section 4)
          ================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-3">
        
        {/* Top Search & Primary Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity title, organizer, topic, skill, notes..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Select Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Filter 1: Participation Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Type: All</option>
              <option value="workshop">Workshop</option>
              <option value="conference">Conference</option>
              <option value="meeting">Meeting</option>
              <option value="webinar">Webinar</option>
              <option value="seminar">Seminar</option>
              <option value="meetup">Meetup</option>
              <option value="networking">Networking Event</option>
              <option value="bootcamp">Bootcamp</option>
              <option value="hackathon">Hackathon</option>
              <option value="competition">Competition</option>
              <option value="community">Community Event</option>
              <option value="volunteer">Volunteer / NGO</option>
              <option value="interview">Interview</option>
              <option value="assessment">Assessment / Case</option>
              <option value="career_opportunity">Career Opportunity</option>
              <option value="builder_match">Builder Match</option>
              <option value="other">Other</option>
            </select>

            {/* Filter 2: Unified Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="saved">Saved</option>
              <option value="invited">Invited</option>
              <option value="registered">Registered</option>
              <option value="confirmed">Confirmed</option>
              <option value="attended">Attended</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No-Show</option>
            </select>

            {/* Filter 3: Date */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Date: Any Time</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past / Completed</option>
            </select>

            {/* Sorter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="date">Sort: By Date</option>
              <option value="newest">Sort: Recently Added</option>
              <option value="priority">Sort: Highest Priority</option>
            </select>

            {/* More Filters Toggle */}
            <button
              type="button"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`p-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                showFilterPanel || activeFiltersCount > 3
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Expanded Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Collapsible Expanded Filters Panel (Organizer, Topic, Skill, Location, Related Opp/Proj) */}
        {showFilterPanel && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs animate-in fade-in duration-150">
            
            {/* Filter 4: Organizer */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Organizer
              </label>
              <select
                value={organizerFilter}
                onChange={(e) => setOrganizerFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-700 cursor-pointer truncate"
              >
                <option value="all">All Organizers ({uniqueOrganizers.length})</option>
                {uniqueOrganizers.map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>

            {/* Filter 5: Topic */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Topic
              </label>
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-700 cursor-pointer truncate"
              >
                <option value="all">All Topics ({uniqueTopics.length})</option>
                {uniqueTopics.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Filter 6: Skill */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Skill
              </label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-700 cursor-pointer truncate"
              >
                <option value="all">All Skills ({uniqueSkills.length})</option>
                {uniqueSkills.map(sk => (
                  <option key={sk} value={sk}>{sk}</option>
                ))}
              </select>
            </div>

            {/* Filter 7: Location / Online */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Location Mode
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-700 cursor-pointer"
              >
                <option value="all">All Formats</option>
                <option value="online">Online / Virtual</option>
                <option value="in_person">In-Person / Onsite</option>
              </select>
            </div>

            {/* Filter 8 & 9: Related Connections */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Career OS Links
              </label>
              <select
                value={relatedOppFilter === 'has_opp' ? 'opp' : relatedProjFilter === 'has_proj' ? 'proj' : 'all'}
                onChange={(e) => {
                  if (e.target.value === 'opp') {
                    setRelatedOppFilter('has_opp');
                    setRelatedProjFilter('all');
                  } else if (e.target.value === 'proj') {
                    setRelatedProjFilter('has_proj');
                    setRelatedOppFilter('all');
                  } else {
                    setRelatedOppFilter('all');
                    setRelatedProjFilter('all');
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-700 cursor-pointer"
              >
                <option value="all">All Items</option>
                <option value="opp">Linked to Opportunity</option>
                <option value="proj">Linked to Project</option>
              </select>
            </div>

          </div>
        )}

        {/* Active Filter Pills Bar */}
        {activeFiltersCount > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap text-2xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider mr-1">Active:</span>
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                Type: {typeFilter}
                <button type="button" onClick={() => setTypeFilter('all')} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                Status: {statusFilter}
                <button type="button" onClick={() => setStatusFilter('all')} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {dateFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                Date: {dateFilter}
                <button type="button" onClick={() => setDateFilter('all')} className="hover:text-amber-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {organizerFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                Org: {organizerFilter}
                <button type="button" onClick={() => setOrganizerFilter('all')} className="hover:text-purple-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {topicFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                Topic: {topicFilter}
                <button type="button" onClick={() => setTopicFilter('all')} className="hover:text-teal-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {skillFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                Skill: {skillFilter}
                <button type="button" onClick={() => setSkillFilter('all')} className="hover:text-emerald-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {locationFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                Format: {locationFilter}
                <button type="button" onClick={() => setLocationFilter('all')} className="hover:text-slate-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                Query: "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')} className="hover:text-slate-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-2xs font-bold text-red-600 hover:text-red-800 ml-auto cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

      </div>

      {/* Results & Beta Indicator */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 gap-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-bold text-slate-900">{filteredItems.length}</strong> participation {filteredItems.length === 1 ? 'record' : 'records'}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            accessLevel === 'FULL'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : accessLevel === 'DEMO'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : accessLevel === 'GUEST'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            {capabilities.tierBadgeLabel}
          </span>
        </div>
      </div>

      {/* ==================================================
          4. CONTENT: LIST VIEW OR BOARD VIEW
          ================================================== */}
      {viewMode === 'board' ? (
        <PipelineBoardView
          applications={filteredItems}
          onSelectApplication={onSelectApplication}
          categoryTab="all"
          onOpenTransitionModal={(app) => setTransitionApp(app)}
          onAdvanceStage={handleStateAdvance}
          onQuickAdvance={(app) => {
            const pType = app.participationType || 'workshop';
            const lifecycle = PARTICIPATION_LIFECYCLES[pType] || PARTICIPATION_LIFECYCLES.workshop;
            const currentStageId = app.currentStageId || lifecycle.stages[0].id;
            const idx = lifecycle.stages.findIndex(s => s.id === currentStageId);
            if (idx >= 0 && idx < lifecycle.stages.length - 1) {
              const nextStage = lifecycle.stages[idx + 1];
              handleStateAdvance(app.id, nextStage.id, nextStage.label);
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
        /* ==================================================
           LIST VIEW (Clean, informative, fast scanning)
           ================================================== */
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto my-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No participation items found</h3>
                <p className="text-xs text-slate-500">
                  {activeFiltersCount > 0 
                    ? 'No activities match your active filters. Try clearing filters or searching for another topic.'
                    : 'Get started by adding your first participation activity or loading sample activities.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                {activeFiltersCount > 0 ? (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Reset Filters
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsTrackNewModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Participation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsImportModalOpen(true)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Load Sample Pack
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            filteredItems.map(item => {
              const pType = item.participationType || 'workshop';
              const currentStatus = item.unifiedStatus || (item.participationStatus === 'COMPLETED' ? 'completed' : item.participationStatus === 'SAVED' ? 'saved' : 'registered');
              const role = item.participationRole || 'Participant';
              const isCompleted = isItemCompleted(item);
              const isSaved = isItemSaved(item);

              // Date formatted
              const dateStr = item.startDate || item.deadline || item.appliedAt || item.createdAt;
              const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming';

              const evidenceCount = item.evidenceItems?.length || 0;
              const taskCount = item.followUpTasks?.length || 0;
              const completedTaskCount = item.followUpTasks?.filter(t => t.completed).length || 0;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectApplication(item.id)}
                  className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer shadow-2xs hover:shadow-xs group ${
                    isCompleted
                      ? 'border-emerald-200/90 bg-emerald-50/10 hover:border-emerald-400'
                      : isSaved
                      ? 'border-purple-200/90 bg-purple-50/10 hover:border-purple-400'
                      : 'border-slate-200/90 hover:border-blue-400'
                  }`}
                >
                  {/* Left: Type Icon + Title + Metadata */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-2xs">
                      {getTypeIcon(pType)}
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      
                      {/* Top Badges Strip: Type, Role, Status, Format */}
                      <div className="flex flex-wrap items-center gap-1.5 text-2xs">
                        <span className="font-extrabold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                          {getTypeLabel(pType)}
                        </span>
                        
                        <span className="font-bold text-slate-600 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">
                          Role: {role}
                        </span>

                        <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border capitalize text-[10px] ${getStatusBadgeColor(currentStatus)}`}>
                          {currentStatus.replace(/_/g, ' ')}
                        </span>

                        {item.isOnline && (
                          <span className="px-1.5 py-0.5 rounded-md font-medium bg-teal-50 text-teal-700 border border-teal-200">
                            Virtual
                          </span>
                        )}

                        {item.priority === 'CRITICAL' && (
                          <span className="px-1.5 py-0.5 rounded-md font-bold text-rose-700 bg-rose-50 border border-rose-200">
                            High Priority
                          </span>
                        )}
                      </div>

                      {/* Main Title */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {item.roleTitle}
                      </h3>

                      {/* Subtitle / Organization, Location & Date */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {item.organization || item.companyName}
                        </span>

                        <span>•</span>

                        <span className="flex items-center gap-1 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {formattedDate} {item.startTime ? `· ${item.startTime}` : ''}
                        </span>

                        {item.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 truncate max-w-[200px]">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {item.location}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Highlights: Key Takeaways or Topics / Connections */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {item.topics && item.topics.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            #{t}
                          </span>
                        ))}

                        {item.relatedOpportunityTitle && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5" />
                            <span>{item.relatedOpportunityTitle}</span>
                          </span>
                        )}

                        {item.relatedProjectTitle && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold flex items-center gap-1">
                            <Hammer className="w-2.5 h-2.5" />
                            <span>{item.relatedProjectTitle}</span>
                          </span>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Right: Evidence Pill, Task Counter & Quick Action */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    
                    {/* Evidence & Tasks Counters */}
                    <div className="flex flex-col items-end gap-1 text-right">
                      {evidenceCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <Paperclip className="w-3 h-3" />
                          <span>{evidenceCount} Evidence</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">No evidence</span>
                      )}

                      {taskCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <CheckSquare className="w-3 h-3 text-slate-400" />
                          <span>{completedTaskCount}/{taskCount} tasks</span>
                        </span>
                      )}
                    </div>

                    {/* Quick Status Advance / Action */}
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {!isCompleted ? (
                        <button
                          type="button"
                          onClick={(e) => handleQuickStatusChange(item.id, 'completed', e)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                          title="Mark Attended &amp; Completed"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span className="hidden sm:inline">Complete</span>
                        </button>
                      ) : (
                        <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectApplication(item.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View Full Participation Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* ==================================================
          5. MODALS & SUB-FLOWS
          ================================================== */}
      {/* 1. Track New Participation Modal */}
      <TrackNewParticipationModal
        isOpen={isTrackNewModalOpen}
        onClose={() => setIsTrackNewModalOpen(false)}
        onItemCreated={(created) => {
          reloadData();
          onSelectApplication(created.id);
        }}
      />

      {/* 2. Import Participation Modal */}
      <ImportParticipationModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={reloadData}
      />

      {/* 3. Stage Transition Modal */}
      {/* 3. Stage Transition Modal */}
      {transitionApp && (
        <StageTransitionModal
          isOpen={!!transitionApp}
          application={transitionApp}
          onClose={() => setTransitionApp(null)}
          onTransitionComplete={() => {
            reloadData();
            setTransitionApp(null);
          }}
        />
      )}

      {/* 4. Add Test / Assessment Modal */}
      {testModalAppId && (
        <AddTestAssignmentModal
          isOpen={isTestModalOpen}
          applications={applications}
          preselectedAppId={testModalAppId}
          onClose={() => {
            setIsTestModalOpen(false);
            setTestModalAppId(null);
          }}
          onAssignmentCreated={reloadData}
        />
      )}

      {/* 5. Schedule Interview Modal */}
      {interviewModalAppId && (
        <ScheduleInterviewModal
          isOpen={isInterviewModalOpen}
          applications={applications}
          preselectedAppId={interviewModalAppId}
          onClose={() => {
            setIsInterviewModalOpen(false);
            setInterviewModalAppId(null);
          }}
          onInterviewScheduled={reloadData}
        />
      )}

      {/* 6. Upcoming Deadlines Widget Modal */}
      {isDeadlinesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsDeadlinesModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl p-5 shadow-2xl border border-slate-200 z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upcoming Deadlines &amp; Milestones</h3>
              <button 
                type="button" 
                onClick={() => setIsDeadlinesModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <UpcomingDeadlinesWidget
              deadlines={deadlines}
              onOpenWorkspace={(appId) => {
                setIsDeadlinesModalOpen(false);
                onSelectApplication(appId);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
