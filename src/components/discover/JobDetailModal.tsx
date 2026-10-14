import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Calendar, 
  Globe, 
  Trash2,
  Edit3,
  AlertTriangle,
  Archive,
  X
} from 'lucide-react';
import { JobListing } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { JobEvidenceMatchModal } from '../library/JobEvidenceMatchModal';
import { AddJobModal } from './AddJobModal';
import { resolveJobSource, getDeadlineInfo } from '../../data/jobTaxonomies';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { JobService } from '../../services/jobService';

interface JobDetailModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (job: JobListing) => void;
  onStartPracticeForJob: (job: JobListing) => void;
  onDeleteCustomJob?: (jobId: string) => void;
  onJobUpdated?: (updatedJob: JobListing) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job: initialJob,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onStartPracticeForJob,
  onDeleteCustomJob,
  onJobUpdated,
}) => {
  const [currentJob, setCurrentJob] = useState<JobListing | null>(initialJob);
  const [isEvidenceMatchOpen, setIsEvidenceMatchOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync internal job if prop changes
  React.useEffect(() => {
    setCurrentJob(initialJob);
  }, [initialJob]);

  // Toast auto-clear
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const job = currentJob || initialJob;
  if (!job) return null;

  const sourceInfo = resolveJobSource(
    job.externalUrl, 
    job.customPlatform || job.jobSource || job.externalPlatform, 
    job.company
  );
  const deadlineInfo = getDeadlineInfo(job.applicationDeadline || undefined, job.deadlineType);
  const isGlobal = job.location.toLowerCase().includes('global') || job.location.toLowerCase().includes('worldwide');
  const customDom = job.customIndustryDomain || job.customDomain;
  const status = job.opportunityStatus || job.status || 'active';

  // Check whether Job Opportunity is linked to Application Tracker
  const applications = applicationStore.getApplications();
  const linkedApplication = applications.find(app => 
    app.jobOpportunityId === job.id || 
    (app.jobUrl && job.externalUrl && app.jobUrl === job.externalUrl) ||
    (app.companyName.toLowerCase() === job.company.toLowerCase() && app.roleTitle.toLowerCase() === job.title.toLowerCase())
  );

  const handlePerformDelete = () => {
    if (onDeleteCustomJob) {
      onDeleteCustomJob(job.id);
    } else {
      JobService.deleteJob(job.id);
    }
    setIsDeleteConfirmOpen(false);
    onClose();
    showToast('Job opportunity deleted.');
  };

  const handlePerformArchive = () => {
    JobService.archiveJob(job.id);
    const updated = { ...job, opportunityStatus: 'archived' as const, status: 'archived' as const };
    setCurrentJob(updated);
    if (onJobUpdated) onJobUpdated(updated);
    setIsDeleteConfirmOpen(false);
    showToast('Job opportunity archived.');
  };

  const handleJobSavedFromEdit = (updated: JobListing) => {
    setCurrentJob(updated);
    if (onJobUpdated) onJobUpdated(updated);
    setIsEditModalOpen(false);
    showToast('Job opportunity updated.');
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="7xl"
      >
        <div className="space-y-6 text-left relative">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2.5 max-w-4xl">
              {/* Taxonomy & Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  {job.roleCategory}
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  {job.domain === 'Others' && customDom ? `Others (${customDom})` : job.domain}
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  {job.level}
                </span>
                <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                  <span className="text-slate-400">Platform:</span>
                  <strong className="text-slate-900">{job.customPlatform || sourceInfo.sourceName}</strong>
                </span>

                {/* Status Badge */}
                {status === 'archived' ? (
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg">
                    Archived Opportunity
                  </span>
                ) : status === 'expired' ? (
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Expired Opportunity</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    Active Opportunity
                  </span>
                )}

                {job.isCustom && (
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                    Custom Entry
                  </span>
                )}

                {linkedApplication && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Linked to Application Tracker</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {job.title}
              </h2>

              {/* Meta Strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 font-medium">
                <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {job.company}
                </span>

                <span className="flex items-center gap-1.5 text-slate-700">
                  {isGlobal ? (
                    <Globe className="w-4 h-4 text-blue-600" />
                  ) : (
                    <MapPin className="w-4 h-4 text-slate-400" />
                  )}
                  <span>{job.location} ({job.workMode})</span>
                </span>

                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  {job.salaryRange}
                </span>

                {deadlineInfo.status !== 'none' ? (
                  <span className={`flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded-md text-xs ${
                    deadlineInfo.isEstimated
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/90'
                      : deadlineInfo.status === 'approaching'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : deadlineInfo.status === 'passed'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{deadlineInfo.label}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>No deadline specified</span>
                  </span>
                )}

                <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Posted {job.postedAt || (job.postedDate && job.postedDate !== 'Not specified' ? job.postedDate : 'Not specified')}
                  </span>
                </span>
              </div>
            </div>

            {/* Action CTAs in Header (Near Top-Right) */}
            <div className="flex sm:flex-row lg:flex-col items-center gap-2.5 shrink-0 w-full sm:w-auto">
              
              {/* Edit Job Button */}
              <button
                type="button"
                id="job-edit-btn"
                onClick={() => setIsEditModalOpen(true)}
                className="w-full sm:w-auto lg:w-48 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Job</span>
              </button>

              {/* Save Opportunity Button */}
              <button
                id="job-toggle-save-btn"
                onClick={() => onToggleSave(job)}
                className={`w-full sm:w-auto lg:w-48 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-blue-600" />
                    <span>Saved Opportunity</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-500" />
                    <span>Save Opportunity</span>
                  </>
                )}
              </button>

              {/* External Apply Button */}
              <a
                id="job-external-link-btn"
                href={job.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto lg:w-48 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <span>Apply on {job.customPlatform || sourceInfo.sourceName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Delete Opportunity Button with Confirmation */}
              <button
                type="button"
                id="job-delete-btn"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="w-full sm:w-auto lg:w-48 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Opportunity</span>
              </button>
            </div>
          </div>

          {/* Spacious 12-Column Responsive Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Left Column (8 of 12) */}
            <div className="lg:col-span-8 space-y-7">
              
              {/* Role Overview */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Role Overview & Context</span>
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                  {job.description}
                </p>
              </div>

              {/* Key Responsibilities */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Responsibilities & Scope</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {job.keyResponsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-colors shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 leading-relaxed font-medium">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Breakdown: Required vs Nice-to-Have */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Required Core Skills
                    </h4>
                    <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {job.requiredSkills.length} Core
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Nice-to-Have Skills
                    </h4>
                    <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {job.niceToHaveSkills.length || 'Optional'}
                    </span>
                  </div>
                  {job.niceToHaveSkills && job.niceToHaveSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {job.niceToHaveSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No explicit nice-to-have skills listed in source posting.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Column (4 of 12) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* AI Interview Simulation CTA Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-300">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">Interview Simulation</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold leading-snug">Prepare for this Opportunity</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Practice real interview questions calibrated to {job.company}&apos;s engineering and product bar.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      id="launch-mock-interview-btn"
                      onClick={() => onStartPracticeForJob(job)}
                      className="w-full py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Launch Mock Interview</span>
                    </button>

                    <button
                      id="validate-evidence-btn"
                      onClick={() => setIsEvidenceMatchOpen(true)}
                      className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Validate Evidence Match</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Posting Intelligence Summary */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Posting Intelligence</span>
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Lifecycle Status:</span>
                    <strong className="text-slate-900 capitalize">{status}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Posted Date:</span>
                    <span className="text-slate-900 font-semibold">
                      {job.postedAt || (job.postedDate && job.postedDate !== 'Not specified' ? job.postedDate : 'Not specified')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Application Deadline:</span>
                    <span className="text-right">
                      <span className="text-slate-900 font-semibold block">{deadlineInfo.label}</span>
                      {job.deadlineType === 'estimated' && (
                        <span className="text-[10px] text-amber-700 block font-normal">
                          Estimated (+1 mo from posted date)
                        </span>
                      )}
                      {job.deadlineType === 'explicit' && (
                        <span className="text-[10px] text-emerald-700 block font-normal">
                          From job posting
                        </span>
                      )}
                      {job.deadlineType === 'manual' && (
                        <span className="text-[10px] text-blue-700 block font-normal">
                          Manual override
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Industry Domain:</span>
                    <span className="text-right">
                      <span className="text-slate-900 font-semibold block">
                        {job.domain === 'Others' && customDom ? customDom : job.domain}
                      </span>
                      {job.domain === 'Others' && !customDom && (
                        <span className="text-[10px] text-slate-400 block font-normal">
                          Not confidently classified
                        </span>
                      )}
                      {job.industryDomainSource === 'ai' && job.domain !== 'Others' && (
                        <span className="text-[10px] text-emerald-700 block font-normal">
                          AI inferred (High confidence)
                        </span>
                      )}
                      {job.industryDomainSource === 'user' && (
                        <span className="text-[10px] text-amber-700 block font-normal">
                          Manual override
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Source Platform:</span>
                    <span className="text-slate-900 font-semibold">{job.customPlatform || sourceInfo.sourceName}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 text-left space-y-4 animate-in fade-in zoom-in-95">
            
            {linkedApplication ? (
              // Case: Linked to Application Tracker
              <>
                <div className="flex items-center gap-3 text-amber-600">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Linked Application Tracker Record</h3>
                    <p className="text-xs text-slate-500">This job is linked to an active application record.</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <div><strong>Application:</strong> {linkedApplication.roleTitle} at {linkedApplication.companyName}</div>
                  <div><strong>Stage:</strong> {linkedApplication.pipelineState || linkedApplication.status}</div>
                  <p className="text-2xs text-amber-800 pt-1 border-t border-amber-200/80">
                    Deleting the canonical Job Opportunity may leave this Application record without a linked source posting. Archiving instead is recommended.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePerformArchive}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive Job (Recommended)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePerformDelete}
                    className="w-full sm:w-auto px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    Delete Anyway
                  </button>
                </div>
              </>
            ) : (
              // Case: Regular Deletion Confirmation
              <>
                <div className="flex items-center gap-3 text-rose-600">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Delete Job Opportunity?</h3>
                    <p className="text-xs text-slate-500">This action cannot be undone.</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>You&apos;re about to permanently delete:</p>
                  <p className="font-bold text-slate-900 text-sm">
                    {job.title}
                  </p>
                  <p className="text-slate-600">
                    {job.company}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePerformDelete}
                    className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Opportunity</span>
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {isEditModalOpen && (
        <AddJobModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          initialJob={job}
          onJobUpdated={handleJobSavedFromEdit}
        />
      )}

      {/* Evidence Match Modal */}
      {isEvidenceMatchOpen && (
        <JobEvidenceMatchModal
          job={job}
          onClose={() => setIsEvidenceMatchOpen(false)}
        />
      )}
    </>
  );
};
