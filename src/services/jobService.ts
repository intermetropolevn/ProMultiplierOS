import { JobListing, JobOpportunityLifecycleStatus } from '../types';
import { JOBS_DATA } from '../data/jobsData';
import { resolveJobSource, getDeadlineInfo, normalizeJobUrl } from '../data/jobTaxonomies';

const CUSTOM_JOBS_STORAGE_KEY = 'career_os_custom_jobs_v1';
const STATUS_OVERRIDES_STORAGE_KEY = 'career_os_job_status_overrides_v1';
const DELETED_JOBS_STORAGE_KEY = 'career_os_deleted_jobs_v1';

export class JobService {
  /**
   * Get deleted job IDs from localStorage
   */
  public static getDeletedJobIds(): string[] {
    try {
      const data = localStorage.getItem(DELETED_JOBS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveDeletedJobIds(ids: string[]): void {
    try {
      localStorage.setItem(DELETED_JOBS_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed to save deleted job IDs', e);
    }
  }

  /**
   * Get user-added custom jobs from localStorage
   */
  public static getCustomJobs(): JobListing[] {
    try {
      const data = localStorage.getItem(CUSTOM_JOBS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Save custom jobs to localStorage
   */
  public static saveCustomJobs(jobs: JobListing[]): void {
    try {
      localStorage.setItem(CUSTOM_JOBS_STORAGE_KEY, JSON.stringify(jobs));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('career_jobs_updated'));
      }
    } catch (e) {
      console.warn('Failed to save custom jobs', e);
    }
  }

  /**
   * Status overrides map (jobId -> 'active' | 'expired' | 'archived')
   */
  public static getStatusOverrides(): Record<string, JobOpportunityLifecycleStatus> {
    try {
      const data = localStorage.getItem(STATUS_OVERRIDES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return {};
    } catch {
      return {};
    }
  }

  public static saveStatusOverrides(overrides: Record<string, JobOpportunityLifecycleStatus>): void {
    try {
      localStorage.setItem(STATUS_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('career_jobs_updated'));
      }
    } catch (e) {
      console.warn('Failed to save job status overrides', e);
    }
  }

  /**
   * Evaluates the canonical lifecycle status of a Job Opportunity:
   * 1. Check user override (e.g. explicitly archived)
   * 2. Check explicit status on job
   * 3. Check application deadline (expired if deadline passed)
   * 4. Default to 'active'
   */
  public static getJobStatus(job: JobListing): JobOpportunityLifecycleStatus {
    const overrides = this.getStatusOverrides();
    if (overrides[job.id]) {
      return overrides[job.id];
    }
    if (job.opportunityStatus) {
      return job.opportunityStatus;
    }
    if (job.status === 'archived' || job.status === 'expired' || job.status === 'active') {
      return job.status;
    }
    if (job.applicationDeadline) {
      const deadlineInfo = getDeadlineInfo(job.applicationDeadline);
      if (deadlineInfo.status === 'passed') {
        return 'expired';
      }
    }
    return 'active';
  }

  /**
   * Archive a job opportunity
   */
  public static archiveJob(jobId: string): void {
    const overrides = this.getStatusOverrides();
    overrides[jobId] = 'archived';
    this.saveStatusOverrides(overrides);
  }

  /**
   * Restore an archived job opportunity
   */
  public static restoreJob(job: JobListing): void {
    const overrides = this.getStatusOverrides();
    if (job.opportunityStatus && job.opportunityStatus !== 'archived') {
      overrides[job.id] = job.opportunityStatus;
    } else {
      overrides[job.id] = 'active';
    }
    this.saveStatusOverrides(overrides);
  }

  /**
   * Set specific status for a job
   */
  public static setJobStatus(jobId: string, status: JobOpportunityLifecycleStatus): void {
    const overrides = this.getStatusOverrides();
    overrides[jobId] = status;
    this.saveStatusOverrides(overrides);
  }

  /**
   * Add a new custom job opportunity
   */
  public static addCustomJob(jobData: Partial<JobListing>): JobListing {
    const rawUrl = jobData.externalUrl?.trim() || '';
    const norm = normalizeJobUrl(rawUrl);
    const finalUrl = norm.isValid ? norm.normalized : (rawUrl || 'https://www.linkedin.com/jobs');

    const sourceInfo = resolveJobSource(finalUrl, jobData.jobSource || jobData.externalPlatform, jobData.company);
    const initialStatus = jobData.opportunityStatus || jobData.status || 'active';
    const customDom = jobData.customIndustryDomain?.trim() || jobData.customDomain?.trim() || undefined;
    const customPlat = jobData.customPlatform?.trim() || undefined;

    const resolvedPlatformName = (sourceInfo.sourceName === 'Others' && customPlat) 
      ? customPlat 
      : sourceInfo.sourceName;

    const resolvedDomain = jobData.domain || 'Others';
    const resolvedPostedAt = jobData.postedAt ? jobData.postedAt.trim() : undefined;
    const resolvedDeadline = jobData.applicationDeadline ? jobData.applicationDeadline.trim() : undefined;

    const newJob: JobListing = {
      id: jobData.id || `custom-job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: jobData.title || 'Untitled Role',
      company: jobData.company || 'Confidential Company',
      companyLogo: jobData.companyLogo,
      roleCategory: jobData.roleCategory || 'Software Engineering',
      domain: resolvedDomain,
      customDomain: customDom,
      customIndustryDomain: customDom,
      industryDomain: resolvedDomain,
      industryDomainConfidence: jobData.industryDomainConfidence,
      industryDomainSource: jobData.industryDomainSource || (resolvedDomain === 'Others' ? 'default' : 'user'),
      industryClassificationStatus: jobData.industryClassificationStatus || (resolvedDomain === 'Others' ? 'unclassified' : 'classified'),
      level: jobData.level || 'Senior',
      location: jobData.location?.trim() || 'Global',
      workMode: jobData.workMode || 'Remote',
      salaryRange: jobData.salaryRange?.trim() || 'Competitive / Negotiable',
      postedDate: resolvedPostedAt 
        ? new Date(resolvedPostedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : (jobData.postedDate || 'Not specified'),
      postedAt: resolvedPostedAt || undefined,
      description: jobData.description || 'No detailed description provided.',
      keyResponsibilities: jobData.keyResponsibilities && jobData.keyResponsibilities.length > 0 
        ? jobData.keyResponsibilities 
        : ['Execute key strategic priorities aligned with role deliverables.'],
      requiredSkills: jobData.requiredSkills || [],
      niceToHaveSkills: jobData.niceToHaveSkills || [],
      externalUrl: finalUrl,
      externalPlatform: resolvedPlatformName,
      jobSource: resolvedPlatformName,
      customPlatform: customPlat,
      sourceId: sourceInfo.sourceId,
      featured: false,
      hasSpecificDeadline: jobData.hasSpecificDeadline ?? Boolean(resolvedDeadline),
      applicationDeadline: resolvedDeadline,
      deadlineType: jobData.deadlineType || (resolvedDeadline ? 'explicit' : 'none'),
      deadlineSource: jobData.deadlineSource || (resolvedDeadline ? 'job_posting' : 'none'),
      isCustom: true,
      opportunityStatus: initialStatus,
      status: initialStatus,
      createdAt: new Date().toISOString(),
    };

    const current = this.getCustomJobs();
    const updated = [newJob, ...current];
    this.saveCustomJobs(updated);

    if (initialStatus !== 'active') {
      this.setJobStatus(newJob.id, initialStatus);
    }

    // Record field-scoped input history for smart autofill
    try {
      const { JobInputHistoryService } = require('./jobInputHistoryService');
      JobInputHistoryService.recordJobSaved({
        company: newJob.company,
        title: newJob.title,
        location: newJob.location,
        salaryRange: newJob.salaryRange,
        requiredSkills: newJob.requiredSkills,
        customIndustryDomain: newJob.customIndustryDomain,
        customPlatform: newJob.customPlatform,
        domain: newJob.domain
      });
    } catch {
      // Ignore if circular in non-browser context
    }

    return newJob;
  }

  /**
   * Update an existing canonical Job Opportunity
   */
  public static updateJob(jobId: string, updatedData: Partial<JobListing>): JobListing {
    const allJobs = this.getAllJobs();
    const existing = allJobs.find(j => j.id === jobId);

    const rawUrl = updatedData.externalUrl?.trim() || existing?.externalUrl || '';
    const norm = normalizeJobUrl(rawUrl);
    const finalUrl = norm.isValid ? norm.normalized : (rawUrl || 'https://www.linkedin.com/jobs');

    const sourceInfo = resolveJobSource(
      finalUrl, 
      updatedData.jobSource || updatedData.externalPlatform || existing?.jobSource, 
      updatedData.company || existing?.company
    );

    const customDom = updatedData.customIndustryDomain !== undefined 
      ? (updatedData.customIndustryDomain?.trim() || undefined)
      : (existing?.customIndustryDomain || existing?.customDomain);

    const customPlat = updatedData.customPlatform !== undefined
      ? (updatedData.customPlatform?.trim() || undefined)
      : existing?.customPlatform;

    const resolvedPlatformName = (sourceInfo.sourceName === 'Others' && customPlat)
      ? customPlat
      : (updatedData.externalPlatform || sourceInfo.sourceName);

    const newStatus = updatedData.opportunityStatus || updatedData.status || existing?.opportunityStatus || 'active';
    const resolvedDomain = updatedData.domain || existing?.domain || 'Others';
    const updatedPostedAt = updatedData.postedAt !== undefined ? updatedData.postedAt : existing?.postedAt;
    const resolvedDeadline = updatedData.hasSpecificDeadline === false 
      ? undefined 
      : (updatedData.applicationDeadline ? updatedData.applicationDeadline.trim() : (existing?.applicationDeadline || undefined));

    const mergedJob: JobListing = {
      ...(existing || {}),
      ...updatedData,
      id: jobId,
      title: updatedData.title?.trim() || existing?.title || 'Untitled Role',
      company: updatedData.company?.trim() || existing?.company || 'Confidential Company',
      roleCategory: updatedData.roleCategory || existing?.roleCategory || 'Software Engineering',
      domain: resolvedDomain,
      customDomain: customDom,
      customIndustryDomain: customDom,
      industryDomain: resolvedDomain,
      industryDomainConfidence: updatedData.industryDomainConfidence !== undefined ? updatedData.industryDomainConfidence : existing?.industryDomainConfidence,
      industryDomainSource: updatedData.industryDomainSource || existing?.industryDomainSource || 'user',
      industryClassificationStatus: updatedData.industryClassificationStatus || existing?.industryClassificationStatus || (resolvedDomain === 'Others' ? 'unclassified' : 'classified'),
      level: updatedData.level || existing?.level || 'Senior',
      location: updatedData.location?.trim() || existing?.location || 'Global',
      workMode: updatedData.workMode || existing?.workMode || 'Remote',
      salaryRange: updatedData.salaryRange?.trim() || existing?.salaryRange || 'Competitive / Negotiable',
      description: updatedData.description !== undefined ? updatedData.description : (existing?.description || ''),
      requiredSkills: updatedData.requiredSkills || existing?.requiredSkills || [],
      niceToHaveSkills: updatedData.niceToHaveSkills || existing?.niceToHaveSkills || [],
      keyResponsibilities: updatedData.keyResponsibilities || existing?.keyResponsibilities || ['Execute key strategic priorities aligned with role deliverables.'],
      externalUrl: finalUrl,
      externalPlatform: resolvedPlatformName,
      jobSource: resolvedPlatformName,
      customPlatform: customPlat,
      sourceId: sourceInfo.sourceId,
      hasSpecificDeadline: updatedData.hasSpecificDeadline ?? existing?.hasSpecificDeadline ?? Boolean(resolvedDeadline),
      applicationDeadline: resolvedDeadline,
      deadlineType: updatedData.deadlineType || existing?.deadlineType || (resolvedDeadline ? 'explicit' : 'none'),
      deadlineSource: updatedData.deadlineSource || existing?.deadlineSource || (resolvedDeadline ? 'job_posting' : 'none'),
      postedAt: updatedPostedAt || undefined,
      opportunityStatus: newStatus,
      status: newStatus,
      postedDate: updatedPostedAt 
        ? new Date(updatedPostedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : (updatedData.postedDate || existing?.postedDate || 'Not specified'),
      isCustom: true,
    };

    const current = this.getCustomJobs();
    const existingIndex = current.findIndex(j => j.id === jobId);

    if (existingIndex >= 0) {
      current[existingIndex] = mergedJob;
      this.saveCustomJobs([...current]);
    } else {
      // It was a catalog job being edited -> save as override in custom jobs
      this.saveCustomJobs([mergedJob, ...current]);
    }

    this.setJobStatus(jobId, newStatus);

    // Record field-scoped input history for smart autofill
    try {
      const { JobInputHistoryService } = require('./jobInputHistoryService');
      JobInputHistoryService.recordJobSaved({
        company: mergedJob.company,
        title: mergedJob.title,
        location: mergedJob.location,
        salaryRange: mergedJob.salaryRange,
        requiredSkills: mergedJob.requiredSkills,
        customIndustryDomain: mergedJob.customIndustryDomain,
        customPlatform: mergedJob.customPlatform,
        domain: mergedJob.domain
      });
    } catch {
      // Ignore
    }

    return mergedJob;
  }

  /**
   * Delete a job opportunity permanently (both custom and catalog jobs)
   */
  public static deleteJob(jobId: string): void {
    const current = this.getCustomJobs();
    const updated = current.filter(j => j.id !== jobId);
    this.saveCustomJobs(updated);

    const deletedIds = this.getDeletedJobIds();
    if (!deletedIds.includes(jobId)) {
      deletedIds.push(jobId);
      this.saveDeletedJobIds(deletedIds);
    }

    const overrides = this.getStatusOverrides();
    if (overrides[jobId]) {
      delete overrides[jobId];
      this.saveStatusOverrides(overrides);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('career_jobs_updated'));
    }
  }

  /**
   * Delete a custom job (alias to deleteJob for backward compatibility)
   */
  public static deleteCustomJob(jobId: string): void {
    this.deleteJob(jobId);
  }

  /**
   * Get all jobs (custom jobs + pre-seeded catalog) hydrated with status,
   * excluding deleted jobs and prioritizing custom overrides of catalog jobs.
   */
  public static getAllJobs(): JobListing[] {
    const custom = this.getCustomJobs();
    const customIds = new Set(custom.map(j => j.id));
    const deletedIds = new Set(this.getDeletedJobIds());

    // Normalize pre-seeded jobs with source and deadline resolution if missing
    const catalog = JOBS_DATA
      .filter(job => !customIds.has(job.id) && !deletedIds.has(job.id))
      .map(job => {
        const source = resolveJobSource(job.externalUrl, job.jobSource || job.externalPlatform, job.company);
        return {
          ...job,
          jobSource: job.jobSource || source.sourceName,
          sourceId: job.sourceId || source.sourceId,
        };
      });

    const combined = [...custom.filter(j => !deletedIds.has(j.id)), ...catalog];
    return combined.map(job => {
      const status = this.getJobStatus(job);
      return {
        ...job,
        opportunityStatus: status,
        status: status,
      };
    });
  }

  /**
   * Dynamically derive all unique locations represented in current dataset
   * Always handles "Global" as a valid option, followed by sorted specific locations.
   */
  public static getDerivedLocations(jobs: JobListing[]): string[] {
    const locationsSet = new Set<string>();
    let hasGlobal = false;

    jobs.forEach(job => {
      if (!job.location) return;
      const loc = job.location.trim();
      if (loc.toLowerCase() === 'global' || loc.toLowerCase() === 'remote (worldwide)') {
        hasGlobal = true;
      } else {
        // Handle slash-separated locations (e.g., "San Francisco, CA / Remote (US)")
        const parts = loc.split('/').map(p => p.trim());
        parts.forEach(p => {
          if (p.toLowerCase() === 'global') {
            hasGlobal = true;
          } else if (p) {
            locationsSet.add(p);
          }
        });
      }
    });

    const sortedSpecific = Array.from(locationsSet).sort((a, b) => a.localeCompare(b));
    return hasGlobal ? ['Global', ...sortedSpecific] : sortedSpecific;
  }
}
