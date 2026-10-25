import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Briefcase, Building2, Globe, FileText, Sparkles, AlertCircle, Search, ChevronLeft, ChevronRight, Check, Lock } from 'lucide-react';
import { JobApplication, JobApplicationStatus, mapLegacyStatusToPipelineState } from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { JobService } from '../../services/jobService';
import { JobListing } from '../../types';
import { AccessCreationBanner } from '../access/AccessCreationBanner';
import { ProgressiveCreationSection } from '../access/ProgressiveCreationSection';
import { DemoQuotaGate } from '../access/DemoQuotaGate';
import { useAccessControl } from '../../services/accessControlService';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationCreated: (app: JobApplication) => void;
}

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
  onApplicationCreated
}) => {
  const { capabilities, canCreate, openAccessModal } = useAccessControl();
  const [accessError, setAccessError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'existing' | 'manual'>('existing');
  const isSubmittingRef = useRef(false);
  
  // Available jobs from JobService
  const [allJobs, setAllJobs] = useState<JobListing[]>(() => JobService.getAllJobs());
  const [selectedJobId, setSelectedJobId] = useState<string>(() => allJobs[0]?.id || '');
  
  // Discover jobs search & pagination state
  const [jobSearch, setJobSearch] = useState('');
  const [jobPage, setJobPage] = useState(1);
  const [jobPageSize, setJobPageSize] = useState<number>(30);

  // Manual fields
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [status, setStatus] = useState<JobApplicationStatus>('APPLIED');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  // Reset page when search or pageSize changes
  useEffect(() => {
    setJobPage(1);
  }, [jobSearch, jobPageSize]);

  // Refresh available jobs when custom jobs are added/updated/deleted
  useEffect(() => {
    const handleUpdate = () => setAllJobs(JobService.getAllJobs());
    window.addEventListener('career_jobs_updated', handleUpdate);
    return () => window.removeEventListener('career_jobs_updated', handleUpdate);
  }, []);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      if (job.status === 'archived') return false;
      if (!jobSearch.trim()) return true;
      const q = jobSearch.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        (job.domain || '').toLowerCase().includes(q) ||
        (job.customIndustryDomain || job.customDomain || '').toLowerCase().includes(q) ||
        (job.requiredSkills || []).some(s => s.toLowerCase().includes(q))
      );
    });
  }, [allJobs, jobSearch]);

  // Pagination math
  const totalJobs = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalJobs / jobPageSize));
  const validPage = Math.min(jobPage, totalPages);
  const startIndex = (validPage - 1) * jobPageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobPageSize);

  // Helper for pagination numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (validPage > 3) pages.push('...');
      const start = Math.max(2, validPage - 1);
      const end = Math.min(totalPages - 1, validPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (validPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  if (!isOpen) return null;

  const handleCreateFromExisting = () => {
    if (isSubmittingRef.current) return;
    if (!canCreate('participation')) return;
    const job = allJobs.find(j => j.id === selectedJobId) || allJobs[0];
    if (!job) return;
    isSubmittingRef.current = true;

    const { primary, sub } = mapLegacyStatusToPipelineState('APPLIED');
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      companyName: job.company,
      roleTitle: job.title,
      jobUrl: job.externalUrl,
      location: `${job.location} (${job.workMode})`,
      employmentType: 'Full-time',
      pipelineState: primary,
      pipelineSubState: sub,
      status: 'APPLIED',
      appliedAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      requirementIds: job.requiredSkills.map((_, i) => `req-ex-${i}`),
      requirements: job.requiredSkills.map((sk, i) => ({
        id: `req-ex-${i}`,
        category: 'Required Skills',
        text: `Proficiency with ${sk} and production software design`,
        mappedSkillName: sk,
        confidence: 'High'
      })),
      skillIds: job.requiredSkills,
      knowledgeIds: [],
      assessmentIds: [],
      documents: [],
      jobSnapshot: {
        title: job.title,
        company: job.company,
        description: job.description,
        responsibilities: job.keyResponsibilities,
        requirements: job.requiredSkills,
        preferredQualifications: job.niceToHaveSkills,
        skills: job.requiredSkills,
        location: job.location,
        salary: job.salaryRange,
        sourceUrl: job.externalUrl,
        capturedAt: new Date().toISOString(),
        originalSourceText: job.description
      },
      companyIntelligence: {
        companyName: job.company,
        businessModel: 'Enterprise technology services & cloud platforms',
        products: ['Core Platform', 'Developer APIs'],
        market: job.domain,
        competitors: ['Industry Peers'],
        strategicPriorities: ['Hiring senior engineering and product talent'],
        recentDevelopments: ['Actively expanding regional team'],
        industryPosition: 'Market leader in sector',
        verifiedSource: true,
        capturedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    applicationStore.saveApplication(newApp);
    onApplicationCreated(newApp);
    onClose();
  };

  const handleCreateManual = () => {
    if (isSubmittingRef.current || isExtracting) return;
    if (!canCreate('participation')) return;
    if (!companyName.trim() || !roleTitle.trim()) return;

    isSubmittingRef.current = true;
    setIsExtracting(true);

    setTimeout(() => {
      // Extract requirements from description text
      const extractedSkills: string[] = [];
      const keywords = ['Strategic Thinking', 'Market Sizing', 'Unit Economics', 'Python', 'Go', 'Kubernetes', 'SQL', 'System Design', 'Leadership', 'Distributed Systems'];
      keywords.forEach(kw => {
        if (description.toLowerCase().includes(kw.toLowerCase())) {
          extractedSkills.push(kw);
        }
      });

      if (extractedSkills.length === 0) {
        extractedSkills.push('Strategic Thinking', 'Analytical Problem Solving', 'Communication');
      }

      const { primary, sub } = mapLegacyStatusToPipelineState(status);
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        companyName: companyName.trim(),
        roleTitle: roleTitle.trim(),
        jobUrl: jobUrl.trim() || undefined,
        location: location.trim() || 'Remote',
        employmentType: 'Full-time',
        pipelineState: primary,
        pipelineSubState: sub,
        status,
        appliedAt: new Date().toISOString(),
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        requirementIds: extractedSkills.map((_, i) => `req-m-${i}`),
        requirements: extractedSkills.map((sk, i) => ({
          id: `req-m-${i}`,
          category: 'Required Skills',
          text: `Demonstrated competence in ${sk}`,
          mappedSkillName: sk,
          confidence: 'High'
        })),
        skillIds: extractedSkills,
        knowledgeIds: [],
        assessmentIds: [],
        documents: [],
        jobSnapshot: {
          title: roleTitle.trim(),
          company: companyName.trim(),
          description: description.trim() || 'Preserved job description snapshot.',
          responsibilities: ['Execute key role objectives and cross-functional leadership.'],
          requirements: extractedSkills,
          preferredQualifications: [],
          skills: extractedSkills,
          location: location.trim() || 'Remote',
          salary: salary.trim() || undefined,
          sourceUrl: jobUrl.trim() || undefined,
          capturedAt: new Date().toISOString(),
          originalSourceText: description.trim()
        },
        companyIntelligence: {
          companyName: companyName.trim(),
          businessModel: 'Technology and business operations',
          products: ['Flagship Offerings'],
          market: 'Target Tech Sector',
          competitors: ['Regional competitors'],
          strategicPriorities: ['Scaling regional operations'],
          recentDevelopments: ['Hiring actively for strategic functions'],
          industryPosition: 'Industry participant',
          verifiedSource: false,
          capturedAt: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      applicationStore.saveApplication(newApp);
      setIsExtracting(false);
      onApplicationCreated(newApp);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Application</h2>
              <p className="text-xs text-slate-500">Track and follow up on this job opportunity within your career pipeline.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <DemoQuotaGate workflowKey="participation" isEditing={false} onViewExistingItems={onClose}>
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <AccessCreationBanner workflowKey="participation" workflowLabel="applications" />

          {accessError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {accessError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveMode('existing')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMode === 'existing'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Select from Discover Jobs
            </button>
            <button
              onClick={() => setActiveMode('manual')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMode === 'manual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paste Job Description
            </button>
          </div>

          {activeMode === 'existing' ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <label className="block text-xs font-bold text-slate-700">Choose Verified Job Listing</label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Per page:</span>
                  <select
                    value={jobPageSize}
                    onChange={(e) => setJobPageSize(Number(e.target.value))}
                    className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5"
                  >
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Search jobs by title, company, skills, location..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Count Summary */}
              <div className="flex items-center justify-between text-2xs text-slate-500 font-medium px-1">
                <span>
                  Showing <strong className="text-slate-900 font-bold">{totalJobs === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + jobPageSize, totalJobs)}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{totalJobs}</strong> jobs
                </span>
                {jobSearch.trim() && (
                  <button
                    type="button"
                    onClick={() => setJobSearch('')}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {/* Paginated Job Items */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {paginatedJobs.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    No jobs match your search &quot;{jobSearch}&quot;.
                  </div>
                ) : (
                  paginatedJobs.map(job => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobId(job.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedJobId === job.id
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {job.title}
                          {job.isCustom && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded">
                              Custom
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                          {job.company}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2.5 text-[11px] text-slate-500">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.level}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600">{job.salaryRange}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-2xs">
                  <button
                    type="button"
                    disabled={validPage === 1}
                    onClick={() => setJobPage(p => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((p, idx) => {
                      if (typeof p === 'string') {
                        return <span key={`ell-${idx}`} className="px-1 text-slate-400">...</span>;
                      }
                      const isActive = p === validPage;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setJobPage(p)}
                          className={`w-6 h-6 rounded-md font-bold text-2xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white'
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
                    disabled={validPage === totalPages}
                    onClick={() => setJobPage(p => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Stripe, Shopee, VNG"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Title *</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g., Product Strategy Manager"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location & Work Mode</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Singapore (Hybrid) or Remote"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Stage</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as JobApplicationStatus)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="WISHLIST">Wishlist</option>
                    <option value="APPLIED">Applied</option>
                    <option value="SCREENING">Screening</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="ASSESSMENT">Assessment</option>
                    <option value="CASE">Case Stage</option>
                    <option value="FINAL_INTERVIEW">Final Interview</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <ProgressiveCreationSection workflowKey="participation">
            {activeMode === 'manual' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Description & Requirements</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste the full job post text. Career OS will automatically extract structured skills, requirements, and preserve a snapshot..."
                  rows={4}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>
            )}

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Automated Career OS Extraction:</span> When created, the platform will preserve an immutable job snapshot and map required skills to existing Career OS knowledge, industry intelligence, and practice frameworks.
              </div>
            </div>
          </ProgressiveCreationSection>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {!capabilities.canCreate ? (
            <button
              type="button"
              onClick={() => openAccessModal('DEMO')}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock in Demo</span>
            </button>
          ) : (
            <button
              onClick={activeMode === 'existing' ? handleCreateFromExisting : handleCreateManual}
              disabled={isExtracting || (activeMode === 'manual' && (!companyName.trim() || !roleTitle.trim()))}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isExtracting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Extracting Requirements...</span>
                </>
              ) : (
                <span>Add and Follow up This Application</span>
              )}
            </button>
          )}
        </div>
        </DemoQuotaGate>

      </div>
    </div>
  );
};
