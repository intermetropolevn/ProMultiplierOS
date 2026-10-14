import React, { useState } from 'react';
import { Briefcase, Compass, Sparkles, Plus } from 'lucide-react';
import { JobListing, RoleBlueprint } from '../../types';
import { JobsExplorer } from './JobsExplorer';
import { RolesExplorer } from './RolesExplorer';
import { JobDetailModal } from './JobDetailModal';
import { RoleDetailModal } from '../prepare/RoleDetailModal';
import { AddJobModal } from './AddJobModal';
import { JobService } from '../../services/jobService';

interface DiscoverHubProps {
  onSelectJob: (job: JobListing) => void;
  onToggleSaveJob: (job: JobListing) => void;
  isJobSaved: (jobId: string) => boolean;
  onStartPracticeForJob: (job: JobListing) => void;
  onSelectRole: (role: RoleBlueprint) => void;
  onStartPracticeForRole: (role: RoleBlueprint) => void;
}

export const DiscoverHub: React.FC<DiscoverHubProps> = ({
  onSelectJob,
  onToggleSaveJob,
  isJobSaved,
  onStartPracticeForJob,
  onSelectRole,
  onStartPracticeForRole,
}) => {
  const [subView, setSubView] = useState<'jobs' | 'roles'>('jobs');
  const [activeJobModal, setActiveJobModal] = useState<JobListing | null>(null);
  const [activeRoleModal, setActiveRoleModal] = useState<RoleBlueprint | null>(null);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  const handleOpenJob = (job: JobListing) => {
    setActiveJobModal(job);
    onSelectJob(job);
  };

  const handleOpenRole = (role: RoleBlueprint) => {
    setActiveRoleModal(role);
    onSelectRole(role);
  };

  return (
    <div className="space-y-6">
      {/* UNIFIED BANNER & CONTROL SURFACE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        {/* ROW 1: Heading & Supporting Description (LEFT) + Primary Quick Actions (RIGHT) */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Job Opportunities &amp; Market Discovery
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-2xl leading-relaxed">
              Filter verified tier-1 tech roles, explore architectural requirements, and launch targeted interview preparation.
            </p>
          </div>

          {/* Quick Actions in top-right corner */}
          <div className="flex items-center gap-2.5 shrink-0 self-start">
            <button
              id="btn-discover-add-job"
              onClick={() => setIsAddJobOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>+ Add Opportunity</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Primary Discover Mode Controls */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-medium">
            <button
              id="subview-jobs-btn"
              onClick={() => setSubView('jobs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                subView === 'jobs'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Opportunities &amp; Postings</span>
            </button>

            <button
              id="subview-roles-btn"
              onClick={() => setSubView('roles')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                subView === 'roles'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Compass className="w-4 h-4 text-purple-600" />
              <span>Role Blueprints</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            {subView === 'jobs'
              ? 'Cross-platform indexed roles with real external postings'
              : 'Comprehensive career progression & competency frameworks'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {subView === 'jobs' ? (
        <JobsExplorer
          onSelectJob={handleOpenJob}
          onToggleSave={onToggleSaveJob}
          isJobSaved={isJobSaved}
          onStartPracticeForJob={onStartPracticeForJob}
        />
      ) : (
        <RolesExplorer
          onSelectRole={handleOpenRole}
          onPracticeRole={onStartPracticeForRole}
        />
      )}

      {/* Modals */}
      <JobDetailModal
        job={activeJobModal}
        isOpen={Boolean(activeJobModal)}
        onClose={() => setActiveJobModal(null)}
        onToggleSave={onToggleSaveJob}
        isSaved={activeJobModal ? isJobSaved(activeJobModal.id) : false}
        onStartPracticeForJob={onStartPracticeForJob}
        onDeleteCustomJob={(jobId) => {
          JobService.deleteJob(jobId);
          setActiveJobModal(null);
        }}
        onJobUpdated={(updatedJob) => {
          setActiveJobModal(updatedJob);
        }}
      />

      <RoleDetailModal
        role={activeRoleModal}
        isOpen={Boolean(activeRoleModal)}
        onClose={() => setActiveRoleModal(null)}
        onStartPractice={onStartPracticeForRole}
      />

      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onJobAdded={(newJob) => {
          setIsAddJobOpen(false);
          // Broadcast update
          window.dispatchEvent(new CustomEvent('career_jobs_updated'));
        }}
      />
    </div>
  );
};
