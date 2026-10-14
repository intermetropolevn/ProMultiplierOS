import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ExternalLink, 
  Briefcase, 
  ArrowUpDown,
  Plus,
  Calendar,
  Globe,
  ShieldCheck,
  RotateCcw,
  Trash2,
  Archive,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { JobListing, RoleCategory, SectorDomain, ExperienceLevel, WorkMode, UserCareerProfile } from '../../types';
import { 
  CANONICAL_ROLES, 
  CANONICAL_DOMAINS, 
  CANONICAL_LEVELS, 
  CANONICAL_WORK_MODES, 
  resolveJobSource, 
  getDeadlineInfo 
} from '../../data/jobTaxonomies';
import { JobService } from '../../services/jobService';
import { StorageService } from '../../services/storageService';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { JobRadarSnapshot } from './JobRadarSnapshot';
import { AddJobModal } from './AddJobModal';
import { JobEvidenceMatchModal } from '../library/JobEvidenceMatchModal';

interface JobsExplorerProps {
  onSelectJob: (job: JobListing) => void;
  onToggleSave: (job: JobListing) => void;
  isJobSaved: (jobId: string) => boolean;
  onStartPracticeForJob: (job: JobListing) => void;
  onOpenApplication?: (applicationId: string) => void;
}

export const JobsExplorer: React.FC<JobsExplorerProps> = ({
  onSelectJob,
  onToggleSave,
  isJobSaved,
  onStartPracticeForJob,
  onOpenApplication,
}) => {
  // All jobs loaded from JobService (pre-seeded + custom jobs)
  const [allJobs, setAllJobs] = useState<JobListing[]>(() => JobService.getAllJobs());
  const [userProfile, setUserProfile] = useState<UserCareerProfile>(() => StorageService.getProfile());
  const [trackedApplications, setTrackedApplications] = useState(() => applicationStore.getApplications());

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'active' | 'expired' | 'archived'>('All');
  const [sortBy, setSortBy] = useState<'saved' | 'newest'>('saved');

  // Pagination state (default: 30 jobs per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(30);

  // Success notification after creating job opportunity
  const [createdJobSuccess, setCreatedJobSuccess] = useState<JobListing | null>(null);

  // Modals state
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [evidenceJobModal, setEvidenceJobModal] = useState<JobListing | null>(null);

  // Refresh jobs list and application tracker relationships
  const refreshJobs = () => {
    setAllJobs(JobService.getAllJobs());
    setTrackedApplications(applicationStore.getApplications());
  };

  // React to storage events
  useEffect(() => {
    window.addEventListener('career_jobs_updated', refreshJobs);
    window.addEventListener('career_applications_updated', refreshJobs);
    return () => {
      window.removeEventListener('career_jobs_updated', refreshJobs);
      window.removeEventListener('career_applications_updated', refreshJobs);
    };
  }, []);

  // Derive unique locations dynamically from all active jobs
  const derivedLocations = useMemo(() => {
    return JobService.getDerivedLocations(allJobs);
  }, [allJobs]);

  // Handle adding custom job
  const handleJobAdded = (newJob: JobListing) => {
    refreshJobs();
    setCreatedJobSuccess(newJob);
  };

  // Handle deleting job
  const handleDeleteCustomJob = (jobId: string) => {
    JobService.deleteJob(jobId);
    refreshJobs();
  };

  // Handle archive toggle
  const handleToggleArchive = (job: JobListing) => {
    if (job.status === 'archived') {
      JobService.restoreJob(job);
    } else {
      JobService.archiveJob(job.id);
    }
    refreshJobs();
  };

  // Reset to page 1 whenever search, filters, or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedDomain, selectedLevel, selectedWorkMode, selectedLocation, selectedStatus, sortBy, pageSize]);

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return allJobs
      .filter(job => {
        // 1. Status Filter
        if (selectedStatus === 'active') {
          if (job.status !== 'active') return false;
        } else if (selectedStatus === 'expired') {
          if (job.status !== 'expired') return false;
        } else if (selectedStatus === 'archived') {
          if (job.status !== 'archived') return false;
        } else {
          // 'All' -> hide archived opportunities by default to preserve clean working view
          if (job.status === 'archived') return false;
        }

        // 2. Search Query: across title, company, skills, location, domain, or source name
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = job.title.toLowerCase().includes(q);
          const matchesCompany = job.company.toLowerCase().includes(q);
          const matchesLocation = job.location.toLowerCase().includes(q);
          const matchesSource = (job.jobSource || job.externalPlatform || job.customPlatform || '').toLowerCase().includes(q);
          const matchesRole = (job.roleCategory || '').toLowerCase().includes(q);
          const matchesDomain = (job.domain || '').toLowerCase().includes(q) || 
                                (job.customIndustryDomain || job.customDomain || '').toLowerCase().includes(q);
          const matchesSkill = (job.requiredSkills || []).some(s => s.toLowerCase().includes(q)) ||
                               (job.niceToHaveSkills || []).some(s => s.toLowerCase().includes(q));

          if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesSource && !matchesRole && !matchesDomain && !matchesSkill) {
            return false;
          }
        }

        // 3. Role Filter
        if (selectedRole !== 'All' && job.roleCategory !== selectedRole) {
          return false;
        }

        // 4. Domain Filter
        if (selectedDomain !== 'All' && job.domain !== selectedDomain) {
          return false;
        }

        // 5. Level Filter
        if (selectedLevel !== 'All' && job.level !== selectedLevel) {
          return false;
        }

        // 6. Work Mode Filter
        if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) {
          return false;
        }

        // 7. Location Filter
        if (selectedLocation !== 'All') {
          if (selectedLocation.toLowerCase() === 'global') {
            const isGlobal = job.location.toLowerCase().includes('global') || job.location.toLowerCase().includes('worldwide');
            if (!isGlobal) return false;
          } else {
            if (!job.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'saved') {
          const aSaved = isJobSaved(a.id);
          const bSaved = isJobSaved(b.id);
          if (aSaved && !bSaved) return -1;
          if (!aSaved && bSaved) return 1;
        }

        // Default or secondary sort: newest (custom or newly created first)
        if (a.isCustom && !b.isCustom) return -1;
        if (!a.isCustom && b.isCustom) return 1;
        return 0;
      });
  }, [allJobs, searchQuery, selectedRole, selectedDomain, selectedLevel, selectedWorkMode, selectedLocation, selectedStatus, sortBy, isJobSaved]);

  // Real Pagination Math
  const totalItems = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + pageSize);

  const hasActiveFilters = 
    searchQuery.trim() !== '' ||
    selectedRole !== 'All' ||
    selectedDomain !== 'All' ||
    selectedLevel !== 'All' ||
    selectedWorkMode !== 'All' ||
    selectedLocation !== 'All' ||
    selectedStatus !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('All');
    setSelectedDomain('All');
    setSelectedLevel('All');
    setSelectedWorkMode('All');
    setSelectedLocation('All');
    setSelectedStatus('All');
  };

  // Helper to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (validCurrentPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, validCurrentPage - 1);
      const end = Math.min(totalPages - 1, validCurrentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (validCurrentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Job Opportunity Intelligence & Discovery Snapshot (Separate Intelligence Layer) */}
      <JobRadarSnapshot
        jobs={allJobs}
        profile={userProfile}
        isJobSaved={isJobSaved}
        onToggleSaveJob={onToggleSave}
        onSelectJob={onSelectJob}
        onInspectEvidenceMatch={(job) => setEvidenceJobModal(job)}
        onStartPracticeForJob={onStartPracticeForJob}
      />

      {/* Non-Blocking Success Banner After Creating Job Opportunity */}
      {createdJobSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">Job opportunity created successfully.</div>
              <div className="text-xs text-emerald-800 font-medium">
                {createdJobSuccess.title} — {createdJobSuccess.company}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                onSelectJob(createdJobSuccess);
                setCreatedJobSuccess(null);
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              View Job
            </button>
            <button
              type="button"
              onClick={() => setCreatedJobSuccess(null)}
              className="p-1.5 text-emerald-700 hover:text-emerald-900 rounded-lg cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Canonical Job Opportunity Database & Search/Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
        
        {/* Search Bar & Action Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="job-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, company, skills, or job source..."
              aria-label="Search opportunities"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="job-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'saved' | 'newest')}
                aria-label="Sort opportunities"
                className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-hidden cursor-pointer"
              >
                <option value="saved">Saved First</option>
                <option value="newest">Newest</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Add Job Opportunity Button */}
            <button
              type="button"
              id="add-job-opportunity-btn"
              onClick={() => setIsAddJobModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job Opportunity</span>
            </button>
          </div>
        </div>

        {/* Filters Group (6 Filter Selects): Role, Domain, Level, Work Mode, Location, Status */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100">
          
          {/* 1. Status Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              aria-label="Filter by Opportunity Status"
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Active</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired Only</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* 2. Role Category */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Role Family
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              aria-label="Filter by Role Family"
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Roles</option>
              {CANONICAL_ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* 3. Industry Domain */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              aria-label="Filter by Domain"
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Domains</option>
              {CANONICAL_DOMAINS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* 4. Seniority Level */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              aria-label="Filter by Seniority Level"
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Levels</option>
              {CANONICAL_LEVELS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* 5. Work Mode */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Work Mode
            </label>
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              aria-label="Filter by Work Mode"
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Modes</option>
              {CANONICAL_WORK_MODES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* 6. Dynamic Geographic Location */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter by Location"
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
            >
              <option value="All">All Locations</option>
              {derivedLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Filters Clear Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Found <strong className="text-slate-900 font-bold">{totalItems}</strong> matching opportunities
            </span>
            <button
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* 3. Header Results Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <strong className="font-bold text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)}</strong> of{' '}
          <strong className="font-bold text-slate-900">{totalItems}</strong> jobs
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-2xs uppercase tracking-wider font-bold hidden sm:inline">Per Page:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value={30}>30 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {/* 4. Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No matching opportunities found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or broadening your role, domain, or status filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paginatedJobs.map(job => {
            const saved = isJobSaved(job.id);
            const sourceInfo = resolveJobSource(job.externalUrl, job.jobSource || job.externalPlatform, job.company);
            const deadlineInfo = getDeadlineInfo(job.applicationDeadline, job.deadlineType);
            const isGlobal = job.location.toLowerCase().includes('global') || job.location.toLowerCase().includes('worldwide');
            const isArchived = job.status === 'archived';
            const isExpired = job.status === 'expired';

            // Check if tracked in Application Tracker
            const trackedApp = trackedApplications.find(a => a.jobOpportunityId === job.id);

            return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md ${
                  isArchived 
                    ? 'opacity-75 border-slate-200 bg-slate-50/50' 
                    : 'border-slate-200/90 hover:border-blue-400'
                }`}
              >
                <div>
                  {/* Top metadata row with clean unboxed styling */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-2xs font-semibold">
                      <span className="text-blue-700 font-bold uppercase tracking-wider">
                        {job.roleCategory}
                      </span>
                      <span>·</span>
                      <span className="text-slate-600">
                        {job.domain === 'Others' && (job.customIndustryDomain || job.customDomain)
                          ? `Others (${job.customIndustryDomain || job.customDomain})`
                          : job.domain}
                      </span>
                      <span>·</span>
                      <span className="text-slate-600">
                        {job.level}
                      </span>

                      {/* Opportunity Status Pill */}
                      {isArchived ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Archived
                        </span>
                      ) : isExpired ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Expired</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      )}

                      {job.isCustom && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-200">
                          Custom
                        </span>
                      )}
                    </div>

                    <button
                      id={`wishlist-btn-${job.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(job);
                      }}
                      aria-label={saved ? 'Remove from saved' : 'Save opportunity'}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                        saved
                          ? 'bg-blue-50 border-blue-200 text-blue-600'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {saved ? <BookmarkCheck className="w-4 h-4 fill-blue-600" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Job Title & Company */}
                  <div
                    onClick={() => onSelectJob(job)}
                    className="cursor-pointer group/title"
                  >
                    <h3 className="text-base font-bold text-slate-900 group-hover/title:text-blue-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1 text-slate-800 font-semibold">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {job.company}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        {isGlobal ? (
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{job.location} ({job.workMode})</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Posted: {job.postedDate || job.postedAt || 'Recently'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Application Tracker Relationship Indicator */}
                  {trackedApp && (
                    <div className="mt-2.5 px-3 py-1.5 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-center justify-between text-2xs">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tracked in Application Tracker</span>
                        <span className="text-blue-600 font-normal">({trackedApp.pipelineSubState || trackedApp.status})</span>
                      </div>
                      {onOpenApplication && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenApplication(trackedApp.id);
                          }}
                          className="font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                        >
                          View Application →
                        </button>
                      )}
                    </div>
                  )}

                  {/* Description Snippet */}
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Required Skills Chips */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80">
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                        +{job.requiredSkills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col gap-3">
                  
                  {/* Row 1: Salary & Explicit vs Estimated Deadline */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{job.salaryRange}</span>
                    </div>

                    {/* Deadline Badge with strict Estimated vs Official distinction */}
                    {deadlineInfo.isEstimated || job.deadlineType === 'estimated' ? (
                      <span 
                        title="Inferred based on posting date (+1 month). Not an employer-provided deadline."
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/90 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Estimated Deadline: {deadlineInfo.formattedDate || deadlineInfo.label}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-amber-700 bg-amber-100/90 px-1 rounded">Inferred</span>
                      </span>
                    ) : deadlineInfo.status !== 'none' ? (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        deadlineInfo.status === 'approaching'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : deadlineInfo.status === 'passed'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        <Calendar className="w-3 h-3 text-blue-600" />
                        <span>Application Deadline: {deadlineInfo.formattedDate || deadlineInfo.label}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Open until filled</span>
                      </span>
                    )}
                  </div>

                  {/* Row 2: Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => onSelectJob(job)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <span>Inspect Opportunity</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Archive / Restore Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleArchive(job)}
                        title={isArchived ? "Restore Job Opportunity" : "Archive Job Opportunity"}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      >
                        {isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                      </button>

                      {/* Evidence Match inspect */}
                      <button
                        type="button"
                        onClick={() => setEvidenceJobModal(job)}
                        title="Inspect your verified career evidence match for this job"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>

                      {/* Mock Interview Launch */}
                      <button
                        id={`card-practice-btn-${job.id}`}
                        onClick={() => onStartPracticeForJob(job)}
                        title="Launch custom mock interview tailored to this position"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span className="hidden sm:inline">Mock Prep</span>
                      </button>

                      {/* Apply on Source CTA */}
                      <a
                        id={`card-apply-btn-${job.id}`}
                        href={job.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors shrink-0"
                      >
                        <span>{sourceInfo.sourceName}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Real Pagination Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs text-xs">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <span>
            Showing <strong className="text-slate-900 font-bold">{totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)}</strong> of{' '}
            <strong className="text-slate-900 font-bold">{totalItems}</strong> jobs
          </span>

          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-2xs text-slate-400 font-bold uppercase">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validCurrentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1 mx-1">
              {getPageNumbers().map((p, idx) => {
                if (typeof p === 'string') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">
                      ...
                    </span>
                  );
                }
                const isActive = p === validCurrentPage;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={validCurrentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isAddJobModalOpen}
        onClose={() => setIsAddJobModalOpen(false)}
        onJobAdded={handleJobAdded}
      />

      {/* Evidence Match Modal */}
      {evidenceJobModal && (
        <JobEvidenceMatchModal
          job={evidenceJobModal}
          onClose={() => setEvidenceJobModal(null)}
        />
      )}
    </div>
  );
};
