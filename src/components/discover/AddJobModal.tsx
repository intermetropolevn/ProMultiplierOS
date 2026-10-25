import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { 
  JobListing, 
  RoleCategory, 
  SectorDomain, 
  ExperienceLevel, 
  WorkMode, 
  JobOpportunityLifecycleStatus,
  JobDeadlineType,
  JobDeadlineSource,
  IndustryDomainSource,
  IndustryClassificationStatus
} from '../../types';
import { 
  CANONICAL_ROLES, 
  CANONICAL_DOMAINS, 
  CANONICAL_LEVELS, 
  CANONICAL_WORK_MODES, 
  CANONICAL_JOB_SOURCES,
  resolveJobSource,
  normalizeJobUrl
} from '../../data/jobTaxonomies';
import { JobService } from '../../services/jobService';
import { JobInputHistoryService, JobHistoryEntry, JobHistoryField } from '../../services/jobInputHistoryService';
import { JobSemanticExtractor, addOneCalendarMonth } from '../../features/intelligence/services/jobSemanticExtractor';
import { ClassificationMemoryService } from '../../features/intelligence/services/classificationMemoryService';
import { AccessCreationBanner } from '../access/AccessCreationBanner';
import { ProgressiveCreationSection } from '../access/ProgressiveCreationSection';
import { DemoQuotaGate } from '../access/DemoQuotaGate';
import { useAccessControl } from '../../services/accessControlService';
import { 
  Briefcase, 
  Building2, 
  Globe, 
  Calendar, 
  DollarSign, 
  Link2, 
  Check, 
  Plus, 
  MapPin, 
  FileText,
  Clock,
  RotateCcw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Cpu,
  Maximize2,
  Minimize2,
  Sparkles,
  Lock
} from 'lucide-react';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobAdded?: (job: JobListing) => void;
  onJobUpdated?: (job: JobListing) => void;
  initialJob?: JobListing | null;
  mode?: 'create' | 'edit';
}

export const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose,
  onJobAdded,
  onJobUpdated,
  initialJob = null,
  mode = 'create',
}) => {
  const isEditMode = mode === 'edit' && Boolean(initialJob);
  const { capabilities, canCreate, openContextualPrompt } = useAccessControl();
  const isSubmittingRef = useRef(false);

  // Core Form State (Primary Source of Truth)
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  // Expand / Collapse state for Brief Overview / Scope
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  // Validation & Submission State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Platform state
  const [detectedSource, setDetectedSource] = useState<string>('LinkedIn');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('src-linkedin');
  const [hasUserOverriddenPlatform, setHasUserOverriddenPlatform] = useState(false);
  const [customPlatformName, setCustomPlatformName] = useState('');

  // Inferred & Structured Fields
  const [roleCategory, setRoleCategory] = useState<RoleCategory>('Software Engineering');
  // Default Industry Domain for new jobs is 'Others' (unclassified until >=90% confident)
  const [domain, setDomain] = useState<SectorDomain>('Others');
  const [customIndustryDomain, setCustomIndustryDomain] = useState('');
  const [industryDomainSource, setIndustryDomainSource] = useState<IndustryDomainSource>('default');
  const [industryClassificationStatus, setIndustryClassificationStatus] = useState<IndustryClassificationStatus>('unclassified');
  const [industryDomainConfidence, setIndustryDomainConfidence] = useState<number | undefined>(undefined);
  const [suggestedDomain, setSuggestedDomain] = useState<SectorDomain | undefined>(undefined);
  const [suggestedDomainConfidence, setSuggestedDomainConfidence] = useState<number | undefined>(undefined);

  const [level, setLevel] = useState<ExperienceLevel>('Senior');
  const [workMode, setWorkMode] = useState<WorkMode>('Remote');
  
  // Location
  const [isGlobalLocation, setIsGlobalLocation] = useState(true);
  const [customLocation, setCustomLocation] = useState('');
  
  // Posted Date & Application Deadline (Decoupled Fields)
  const [postedDate, setPostedDate] = useState('');
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineType, setDeadlineType] = useState<JobDeadlineType>('none');
  const [deadlineSource, setDeadlineSource] = useState<JobDeadlineSource>('none');
  
  // Lifecycle Status (Independent from deadline)
  const [opportunityStatus, setOpportunityStatus] = useState<JobOpportunityLifecycleStatus>('active');

  // Compensation & Skills
  const [salaryRange, setSalaryRange] = useState('');
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('');

  // Intelligence Extraction Tracking & Evidence Memory
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionNotice, setExtractionNotice] = useState<string | null>(null);
  const [inferredValues, setInferredValues] = useState<Partial<{
    workMode: WorkMode;
    domain: SectorDomain;
    roleCategory: RoleCategory;
    level: ExperienceLevel;
    location: string;
    salaryRange: string;
  }>>({});
  const [workModeEvidence, setWorkModeEvidence] = useState<{ mode: WorkMode; confidence: string; evidence: string } | null>(null);
  const [userEditedFields, setUserEditedFields] = useState<Set<string>>(new Set());
  const extractionDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Smart history suggestion dropdown state
  const [activeSuggestionField, setActiveSuggestionField] = useState<JobHistoryField | null>(null);
  const [suggestions, setSuggestions] = useState<JobHistoryEntry[]>([]);
  const [companyRelatedHint, setCompanyRelatedHint] = useState<{ domain?: string; location?: string } | null>(null);

  // Pre-fill fields when modal opens or initialJob changes
  useEffect(() => {
    if (isOpen) {
      isSubmittingRef.current = false;
      setFieldErrors({});
      setSubmitError(null);
      setIsSubmitting(false);
      setUserEditedFields(new Set());
      setExtractionNotice(null);
      setInferredValues({});
      setWorkModeEvidence(null);
      setIsOverviewExpanded(false);

      if (isEditMode && initialJob) {
        setTitle(initialJob.title || '');
        setCompany(initialJob.company || '');
        setUrl(initialJob.externalUrl || '');

        const currentSource = initialJob.jobSource || initialJob.externalPlatform || 'LinkedIn';
        const matchedSource = CANONICAL_JOB_SOURCES.find(
          s => s.name.toLowerCase() === currentSource.toLowerCase() || s.id === initialJob.sourceId
        );

        if (matchedSource) {
          setSelectedSourceId(matchedSource.id);
          setDetectedSource(matchedSource.name);
          setHasUserOverriddenPlatform(matchedSource.name !== 'LinkedIn');
          if (matchedSource.id === 'src-others') {
            setCustomPlatformName(initialJob.customPlatform || currentSource);
          } else {
            setCustomPlatformName('');
          }
        } else {
          setSelectedSourceId('src-others');
          setDetectedSource('Others');
          setCustomPlatformName(initialJob.customPlatform || currentSource);
          setHasUserOverriddenPlatform(true);
        }

        setRoleCategory(initialJob.roleCategory || 'Software Engineering');
        const loadedDom = initialJob.industryDomain || initialJob.domain || 'Others';
        setDomain(loadedDom);
        setCustomIndustryDomain(initialJob.customIndustryDomain || initialJob.customDomain || '');
        setIndustryDomainSource(initialJob.industryDomainSource || 'user');
        setIndustryClassificationStatus(initialJob.industryClassificationStatus || (loadedDom === 'Others' ? 'unclassified' : 'classified'));
        setIndustryDomainConfidence(initialJob.industryDomainConfidence);
        setSuggestedDomain(undefined);
        setSuggestedDomainConfidence(undefined);

        setLevel(initialJob.level || 'Senior');
        setWorkMode(initialJob.workMode || 'Remote');

        const isGlob = !initialJob.location || initialJob.location.toLowerCase() === 'global' || initialJob.location.toLowerCase() === 'worldwide';
        setIsGlobalLocation(isGlob);
        setCustomLocation(isGlob ? '' : initialJob.location);

        const loadedPostedAt = initialJob.postedAt || '';
        setPostedDate(loadedPostedAt);

        const loadedDeadline = initialJob.applicationDeadline || '';
        setDeadlineDate(loadedDeadline);
        setHasDeadline(Boolean(initialJob.applicationDeadline));
        setDeadlineType(initialJob.deadlineType || (loadedDeadline ? 'explicit' : 'none'));
        setDeadlineSource(initialJob.deadlineSource || (loadedDeadline ? 'job_posting' : 'none'));

        setOpportunityStatus(initialJob.opportunityStatus || initialJob.status || 'active');
        setSalaryRange(initialJob.salaryRange || '');
        setRequiredSkillsInput((initialJob.requiredSkills || []).join(', '));
        setDescription(initialJob.description || '');
      } else {
        // Reset for create mode - DEFAULT: Industry Domain = Others
        setTitle('');
        setCompany('');
        setUrl('');
        setDetectedSource('LinkedIn');
        setSelectedSourceId('src-linkedin');
        setHasUserOverriddenPlatform(false);
        setCustomPlatformName('');
        setRoleCategory('Software Engineering');
        // Begins with Others until CareerOS Intelligence has sufficient evidence (>=90%)
        setDomain('Others');
        setCustomIndustryDomain('');
        setIndustryDomainSource('default');
        setIndustryClassificationStatus('unclassified');
        setIndustryDomainConfidence(undefined);
        setSuggestedDomain(undefined);
        setSuggestedDomainConfidence(undefined);
        setLevel('Senior');
        setWorkMode('Remote');
        setIsGlobalLocation(true);
        setCustomLocation('');
        // No posted date, no deadline by default - leave blank!
        setPostedDate('');
        setHasDeadline(false);
        setDeadlineDate('');
        setDeadlineType('none');
        setDeadlineSource('none');
        setOpportunityStatus('active');
        setSalaryRange('');
        setRequiredSkillsInput('');
        setDescription('');
      }
      setActiveSuggestionField(null);
      setSuggestions([]);
      setCompanyRelatedHint(null);
    }
  }, [isOpen, isEditMode, initialJob]);

  // URL Auto-detection logic:
  useEffect(() => {
    if (url.trim()) {
      const resolved = resolveJobSource(url, undefined, company);
      setDetectedSource(resolved.sourceName);

      if (!hasUserOverriddenPlatform) {
        setSelectedSourceId(resolved.sourceId);
      }

      // Check URL validity as user types
      const norm = normalizeJobUrl(url);
      if (norm.isValid && fieldErrors.url) {
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next.url;
          return next;
        });
      }
    }
  }, [url, company, hasUserOverriddenPlatform]);

  // Track explicit manual user edits so CareerOS Intelligence doesn't overwrite manual overrides
  const markFieldEdited = (fieldName: string) => {
    setUserEditedFields(prev => new Set(prev).add(fieldName));
  };

  // Run Semantic Extraction from Brief Overview & Core Info with Context-Aware Priority Ranking
  const performSemanticExtraction = (overviewText: string, currentTitle = title, currentCompany = company) => {
    if (!capabilities.canViewIntelligence) return;
    if (!overviewText.trim() && !currentTitle.trim()) return;

    setIsExtracting(true);
    try {
      const extracted = JobSemanticExtractor.extractFromJobBrief({
        title: currentTitle,
        company: currentCompany,
        overview: overviewText,
        url,
      });

      // Record inferred values for manual override tracking
      setInferredValues({
        workMode: extracted.workMode,
        domain: extracted.domain,
        roleCategory: extracted.roleCategory,
        level: extracted.level,
        location: extracted.location,
        salaryRange: extracted.salaryRange,
      });

      setWorkModeEvidence({
        mode: extracted.attributeDetails.workMode.value,
        confidence: extracted.attributeDetails.workMode.confidence,
        evidence: extracted.attributeDetails.workMode.evidence,
      });

      // 1. Role Family: Prioritize Job Title
      if (!userEditedFields.has('roleCategory')) {
        setRoleCategory(extracted.roleCategory);
      }

      // 2. Industry Domain: Strict 90% Confidence Gate
      if (!userEditedFields.has('domain')) {
        if (extracted.industryDomainConfidence >= 0.90 && extracted.domain !== 'Others') {
          // Strictly high confidence >= 90% -> automatically replace Others
          setDomain(extracted.domain);
          setIndustryDomainConfidence(extracted.industryDomainConfidence);
          setIndustryDomainSource('ai');
          setIndustryClassificationStatus('classified');
          setSuggestedDomain(undefined);
          setSuggestedDomainConfidence(undefined);
        } else {
          // Confidence < 90% -> keep Others!
          setDomain('Others');
          setIndustryDomainConfidence(extracted.industryDomainConfidence);
          setIndustryDomainSource('default');
          setIndustryClassificationStatus('unclassified');
          if (extracted.suggestedDomain && extracted.suggestedDomain !== 'Others') {
            setSuggestedDomain(extracted.suggestedDomain);
            setSuggestedDomainConfidence(extracted.suggestedDomainConfidence);
          } else {
            setSuggestedDomain(undefined);
            setSuggestedDomainConfidence(undefined);
          }
        }
      } else {
        // User manually selected domain -> do NOT overwrite!
        if (extracted.domain !== domain && extracted.industryDomainConfidence >= 0.90 && extracted.domain !== 'Others') {
          setSuggestedDomain(extracted.domain);
          setSuggestedDomainConfidence(extracted.industryDomainConfidence);
        }
      }

      // 3. Seniority Level & Work Mode
      if (!userEditedFields.has('level')) {
        setLevel(extracted.level);
      }
      if (!userEditedFields.has('workMode')) {
        setWorkMode(extracted.workMode);
      }
      if (!userEditedFields.has('location')) {
        setIsGlobalLocation(extracted.isGlobalLocation);
        setCustomLocation(extracted.isGlobalLocation ? '' : extracted.location);
      }
      if (!userEditedFields.has('salaryRange') && extracted.salaryRange) {
        setSalaryRange(extracted.salaryRange);
      }
      if (!userEditedFields.has('requiredSkills') && extracted.requiredSkills.length > 0) {
        setRequiredSkillsInput(extracted.requiredSkills.join(', '));
      }

      // 4. Date Extraction: Priority (1: Explicit Deadline, 2: Posted Date, 3: Estimated +1 mo, 4: No Deadline)
      if (!userEditedFields.has('postedDate') && extracted.postedAt) {
        setPostedDate(extracted.postedAt);
      }

      if (!userEditedFields.has('deadline')) {
        if (extracted.deadlineType === 'explicit' && extracted.applicationDeadline) {
          // Priority 1: Explicit application deadline found in posting
          setDeadlineDate(extracted.applicationDeadline);
          setDeadlineType('explicit');
          setDeadlineSource('job_posting');
          setHasDeadline(true);
        } else if (!extracted.applicationDeadline && (extracted.postedAt || postedDate)) {
          // Priority 3: Estimated deadline = posted date + 1 calendar month
          const pDate = extracted.postedAt || postedDate;
          const est = addOneCalendarMonth(pDate);
          if (est) {
            setDeadlineDate(est);
            setDeadlineType('estimated');
            setDeadlineSource('posting_date_estimate');
            setHasDeadline(true);
          }
        } else if (extracted.deadlineType === 'estimated' && extracted.applicationDeadline) {
          setDeadlineDate(extracted.applicationDeadline);
          setDeadlineType('estimated');
          setDeadlineSource('posting_date_estimate');
          setHasDeadline(true);
        } else if (!extracted.postedAt && !postedDate && !extracted.applicationDeadline) {
          // Priority 4: No deadline & no posted date -> remain null
          setDeadlineDate('');
          setDeadlineType('none');
          setDeadlineSource('none');
          setHasDeadline(false);
        }
      }

      const summary = extracted.detectedSignals.length > 0
        ? extracted.detectedSignals.slice(0, 3).join(' · ')
        : `${extracted.workMode} · ${extracted.domain} · ${extracted.level}`;
      setExtractionNotice(summary);
    } catch (e) {
      console.warn('Semantic extraction error:', e);
    } finally {
      setIsExtracting(false);
    }
  };

  // Debounced semantic extraction trigger as user enters/pastes in Brief Overview
  const handleOverviewChange = (val: string) => {
    setDescription(val);
    if (extractionDebounceTimer.current) {
      clearTimeout(extractionDebounceTimer.current);
    }

    if (val.trim().length > 15) {
      extractionDebounceTimer.current = setTimeout(() => {
        performSemanticExtraction(val, title, company);
      }, 500);
    }
  };

  // Date and Deadline change handlers with strict semantics
  const handlePostedDateChange = (val: string) => {
    setPostedDate(val);
    markFieldEdited('postedDate');

    // If deadline is NOT manual, dynamically re-calculate estimated deadline
    if (!userEditedFields.has('deadline') && deadlineType !== 'manual') {
      if (val.trim()) {
        const est = addOneCalendarMonth(val.trim());
        if (est) {
          setDeadlineDate(est);
          setDeadlineType('estimated');
          setDeadlineSource('posting_date_estimate');
          setHasDeadline(true);
        }
      } else {
        setDeadlineDate('');
        setDeadlineType('none');
        setDeadlineSource('none');
        setHasDeadline(false);
      }
    }
  };

  const handleDeadlineDateChange = (val: string) => {
    setDeadlineDate(val);
    markFieldEdited('deadline');
    if (val.trim()) {
      setDeadlineType('manual');
      setDeadlineSource('user');
      setHasDeadline(true);
    } else {
      setDeadlineType('none');
      setDeadlineSource('none');
      setHasDeadline(false);
    }
  };

  const handleToggleSpecifyExactDeadline = (checked: boolean) => {
    setHasDeadline(checked);
    markFieldEdited('deadline');
    if (checked) {
      if (deadlineDate) {
        setDeadlineType('manual');
        setDeadlineSource('user');
      }
    } else {
      // Unchecked: if posted date exists, fall back to estimated +1 month
      if (postedDate.trim()) {
        const est = addOneCalendarMonth(postedDate.trim());
        if (est) {
          setDeadlineDate(est);
          setDeadlineType('estimated');
          setDeadlineSource('posting_date_estimate');
        } else {
          setDeadlineDate('');
          setDeadlineType('none');
          setDeadlineSource('none');
        }
      } else {
        setDeadlineDate('');
        setDeadlineType('none');
        setDeadlineSource('none');
      }
    }
  };

  // Handlers for manual overrides that silently record user corrections into classification memory
  const handleWorkModeChange = (newMode: WorkMode) => {
    setWorkMode(newMode);
    markFieldEdited('workMode');

    if (inferredValues.workMode && inferredValues.workMode !== newMode) {
      ClassificationMemoryService.recordCorrection({
        attribute: 'workMode',
        originalInference: inferredValues.workMode,
        userCorrection: newMode,
        matchedEvidence: workModeEvidence?.evidence,
        contextSnippet: description,
        company: company.trim(),
      });
    }
  };

  const handleDomainChange = (newDomain: SectorDomain) => {
    setDomain(newDomain);
    setIndustryDomainSource('user');
    setIndustryClassificationStatus(newDomain === 'Others' ? 'unclassified' : 'classified');
    markFieldEdited('domain');

    if (inferredValues.domain && inferredValues.domain !== newDomain) {
      ClassificationMemoryService.recordCorrection({
        attribute: 'domain',
        originalInference: inferredValues.domain,
        userCorrection: newDomain,
        contextSnippet: description,
        company: company.trim(),
      });
    }
  };

  const handleRoleChange = (newRole: RoleCategory) => {
    setRoleCategory(newRole);
    markFieldEdited('roleCategory');

    if (inferredValues.roleCategory && inferredValues.roleCategory !== newRole) {
      ClassificationMemoryService.recordCorrection({
        attribute: 'roleCategory',
        originalInference: inferredValues.roleCategory,
        userCorrection: newRole,
        contextSnippet: description,
        company: company.trim(),
      });
    }
  };

  const handleLevelChange = (newLevel: ExperienceLevel) => {
    setLevel(newLevel);
    markFieldEdited('level');

    if (inferredValues.level && inferredValues.level !== newLevel) {
      ClassificationMemoryService.recordCorrection({
        attribute: 'level',
        originalInference: inferredValues.level,
        userCorrection: newLevel,
        contextSnippet: description,
        company: company.trim(),
      });
    }
  };

  // Handle smart history typing trigger (>= 3 characters)
  const handleFieldChangeWithHistory = (field: JobHistoryField, val: string, setter: (v: string) => void) => {
    setter(val);
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (val.trim().length >= 3) {
      const matches = JobInputHistoryService.getSuggestions(field, val, 5);
      if (matches.length > 0) {
        setActiveSuggestionField(field);
        setSuggestions(matches);
      } else {
        setActiveSuggestionField(null);
        setSuggestions([]);
      }
    } else {
      setActiveSuggestionField(null);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (field: JobHistoryField, entry: JobHistoryEntry) => {
    if (field === 'company') {
      setCompany(entry.value);
      if (entry.metadata?.relatedDomain || entry.metadata?.relatedLocation) {
        setCompanyRelatedHint({
          domain: entry.metadata.relatedDomain,
          location: entry.metadata.relatedLocation
        });
      }
    } else if (field === 'title') {
      setTitle(entry.value);
    } else if (field === 'location') {
      setCustomLocation(entry.value);
      setIsGlobalLocation(false);
      markFieldEdited('location');
    } else if (field === 'salaryRange') {
      setSalaryRange(entry.value);
      markFieldEdited('salaryRange');
    } else if (field === 'customIndustryDomain') {
      setCustomIndustryDomain(entry.value);
      markFieldEdited('domain');
    } else if (field === 'customPlatform') {
      setCustomPlatformName(entry.value);
    } else if (field === 'requiredSkills') {
      const current = requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
      if (!current.includes(entry.value)) {
        setRequiredSkillsInput(current.length > 0 ? `${current.join(', ')}, ${entry.value}` : entry.value);
        markFieldEdited('requiredSkills');
      }
    }
    setActiveSuggestionField(null);
    setSuggestions([]);
  };

  const applyRelatedCompanyHint = () => {
    if (companyRelatedHint?.domain) {
      const matchDom = CANONICAL_DOMAINS.find(d => d.toLowerCase() === companyRelatedHint.domain?.toLowerCase());
      if (matchDom) {
        setDomain(matchDom);
        markFieldEdited('domain');
      }
    }
    if (companyRelatedHint?.location) {
      if (companyRelatedHint.location.toLowerCase() === 'global') {
        setIsGlobalLocation(true);
        setCustomLocation('');
      } else {
        setIsGlobalLocation(false);
        setCustomLocation(companyRelatedHint.location);
      }
      markFieldEdited('location');
    }
    setCompanyRelatedHint(null);
  };

  if (!isOpen) return null;

  // Form submission with explicit, actionable validation and loading state
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting) return;
    if (!capabilities.canCreate) {
      openContextualPrompt();
      return;
    }
    if (!isEditMode && !canCreate('jobs')) {
      return;
    }

    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'Job Title is required';
    }
    if (!company.trim()) {
      errors.company = 'Company Name is required';
    }

    // URL Normalization & Validation
    let normalizedFinalUrl = '';
    if (url.trim()) {
      const norm = normalizeJobUrl(url);
      if (!norm.isValid) {
        errors.url = norm.error || 'Please enter a valid URL (e.g. linkedin.com/jobs/... or https://...)';
      } else {
        normalizedFinalUrl = norm.normalized;
      }
    } else {
      normalizedFinalUrl = 'https://www.linkedin.com/jobs';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError('Please fill in the required fields before adding the job opportunity.');
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const locationValue = isGlobalLocation 
        ? 'Global' 
        : customLocation.trim() || 'Global';

      const reqSkills = requiredSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const sourceObj = CANONICAL_JOB_SOURCES.find(s => s.id === selectedSourceId);
      let resolvedPlatform = sourceObj ? sourceObj.name : detectedSource;
      if (selectedSourceId === 'src-others' && customPlatformName.trim()) {
        resolvedPlatform = customPlatformName.trim();
      }

      const customDom = domain === 'Others' ? customIndustryDomain.trim() || undefined : undefined;
      const deadlineValue = hasDeadline && deadlineDate ? deadlineDate.trim() : undefined;
      const postedAtValue = postedDate.trim() ? postedDate.trim() : undefined;

      const payload: Partial<JobListing> = {
        title: title.trim(),
        company: company.trim(),
        externalUrl: normalizedFinalUrl,
        jobSource: resolvedPlatform,
        externalPlatform: resolvedPlatform,
        customPlatform: selectedSourceId === 'src-others' ? customPlatformName.trim() || undefined : undefined,
        sourceId: selectedSourceId,
        roleCategory,
        domain,
        customDomain: customDom,
        customIndustryDomain: customDom,
        industryDomain: domain,
        industryDomainConfidence,
        industryDomainSource,
        industryClassificationStatus,
        level,
        workMode,
        location: locationValue,
        salaryRange: salaryRange.trim() || 'Competitive / Negotiable',
        hasSpecificDeadline: hasDeadline && Boolean(deadlineDate),
        applicationDeadline: deadlineValue,
        deadlineType,
        deadlineSource,
        postedAt: postedAtValue,
        postedDate: postedAtValue 
          ? new Date(postedAtValue).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : (initialJob?.postedDate || 'Not specified'),
        requiredSkills: reqSkills.length > 0 ? reqSkills : ['Core Architecture', 'Technical Problem Solving'],
        niceToHaveSkills: initialJob?.niceToHaveSkills || [],
        description: description.trim() || `Opportunity at ${company} within ${domain}.`,
        opportunityStatus,
        status: opportunityStatus,
      };

      // Record smart history for future suggestions
      JobInputHistoryService.recordJobSaved({
        company: company.trim(),
        title: title.trim(),
        location: locationValue,
        salaryRange: salaryRange.trim(),
        requiredSkills: reqSkills,
        customIndustryDomain: customDom,
        customPlatform: selectedSourceId === 'src-others' ? customPlatformName.trim() : undefined,
        domain: domain,
      });

      if (isEditMode && initialJob) {
        const updated = JobService.updateJob(initialJob.id, payload);
        if (onJobUpdated) onJobUpdated(updated);
      } else {
        const created = JobService.addCustomJob(payload);
        if (onJobAdded) onJobAdded(created);
      }

      onClose();
    } catch (err: any) {
      console.error('Failed to create/update job opportunity:', err);
      setSubmitError(err?.message || 'Could not save job opportunity. Please verify input data.');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const selectedSource = CANONICAL_JOB_SOURCES.find(s => s.id === selectedSourceId);
  const isOverridden = hasUserOverriddenPlatform && selectedSource?.name !== detectedSource;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditMode ? "Edit Job Opportunity" : "Add Job Opportunity"} 
      maxWidth="5xl"
    >
      <DemoQuotaGate workflowKey="jobs" isEditing={isEditMode} onViewExistingItems={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-5 text-left">
        
        {/* Actionable Error Banner if validation fails */}
        {submitError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">{submitError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Beta Access Tier Creation Policy Banner */}
        <AccessCreationBanner 
          workflowKey="jobs" 
          workflowLabel="job opportunities" 
          currentCount={JobService.getCustomJobs().length} 
        />

        {/* ========================================================================= */}
        {/* 1. CORE JOB INFORMATION (PRIMARY SOURCE OF TRUTH)                          */}
        {/* Order: Job Title, Company Name, Job Posting URL, Brief Overview / Scope    */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          
          {/* Job Title & Company Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Job Title */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={title}
                  onChange={e => handleFieldChangeWithHistory('title', e.target.value, setTitle)}
                  onBlur={() => setTimeout(() => setActiveSuggestionField(null), 250)}
                  placeholder="e.g. Senior Backend Engineer"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                    fieldErrors.title ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-blue-500'
                  }`}
                />
              </div>
              {fieldErrors.title && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{fieldErrors.title}</span>
                </p>
              )}

              {/* Smart Suggestions for Title */}
              {activeSuggestionField === 'title' && suggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span>Previously Used Titles</span>
                    <span>Select to autofill</span>
                  </div>
                  {suggestions.map((entry, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={() => handleSelectSuggestion('title', entry)}
                      className="w-full px-3 py-2 text-left text-xs text-slate-800 hover:bg-blue-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="font-semibold">{entry.value}</span>
                      <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        Used {entry.usageCount}x
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Company Name */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={company}
                  onChange={e => handleFieldChangeWithHistory('company', e.target.value, setCompany)}
                  onBlur={() => setTimeout(() => setActiveSuggestionField(null), 250)}
                  placeholder="e.g. Stripe, TotallyAwesome, Golden Owl Solutions"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                    fieldErrors.company ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-blue-500'
                  }`}
                />
              </div>
              {fieldErrors.company && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{fieldErrors.company}</span>
                </p>
              )}

              {/* Smart Suggestions for Company */}
              {activeSuggestionField === 'company' && suggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span>Previously Used Companies</span>
                    <span>Select to autofill</span>
                  </div>
                  {suggestions.map((entry, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={() => handleSelectSuggestion('company', entry)}
                      className="w-full px-3 py-2 text-left text-xs text-slate-800 hover:bg-blue-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{entry.value}</span>
                        {entry.metadata && (
                          <span className="text-[11px] text-slate-400">
                            {[entry.metadata.relatedDomain, entry.metadata.relatedLocation].filter(Boolean).join(' • ')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Previously used
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Optional Hint to fill related values without overwriting */}
              {companyRelatedHint && (
                <div className="mt-1.5 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-2 text-xs text-blue-900 animate-in fade-in">
                  <span>
                    Remembered for <strong>{company}</strong>: {companyRelatedHint.domain} {companyRelatedHint.location && `• ${companyRelatedHint.location}`}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={applyRelatedCompanyHint}
                      className="px-2 py-0.5 bg-blue-600 text-white text-[11px] font-bold rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompanyRelatedHint(null)}
                      className="text-[11px] text-slate-500 hover:text-slate-700 px-1 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location & Job Posting URL (Basic Fields) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={isGlobalLocation ? 'Global / Remote' : customLocation}
                  onChange={e => {
                    const val = e.target.value;
                    if (val.toLowerCase() === 'global' || val.toLowerCase() === 'global / remote') {
                      setIsGlobalLocation(true);
                      setCustomLocation('');
                    } else {
                      setIsGlobalLocation(false);
                      handleFieldChangeWithHistory('location', val, setCustomLocation);
                    }
                    markFieldEdited('location');
                  }}
                  placeholder="e.g. San Francisco, CA, Ho Chi Minh City, or Global"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Job Posting URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  URL
                </label>
                <span className="text-[11px] text-blue-600 font-medium">
                  Job Posting Link
                </span>
              </div>
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={url}
                  onChange={e => {
                    setUrl(e.target.value);
                    if (fieldErrors.url) {
                      setFieldErrors(prev => {
                        const next = { ...prev };
                        delete next.url;
                        return next;
                      });
                    }
                  }}
                  placeholder="e.g. linkedin.com/jobs/view/... or https://jobsgo.vn/job/..."
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                    fieldErrors.url ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-blue-500'
                  }`}
                />
              </div>
              {fieldErrors.url && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{fieldErrors.url}</span>
                </p>
              )}
            </div>
          </div>

          <div className="hidden">
            <div>
              <div>
              {isOverridden ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] font-bold border border-amber-200">
                      Manual override: {selectedSource?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setHasUserOverriddenPlatform(false);
                        const resolved = resolveJobSource(url, undefined, company);
                        setSelectedSourceId(resolved.sourceId);
                      }}
                      className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                      title="Reset to auto-detected platform"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-emerald-200">
                    Auto-detected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="source-select" className="text-xs text-slate-500 font-medium">Manual Override:</label>
                <select
                  id="source-select"
                  aria-label="Platform Source Override"
                  value={selectedSourceId}
                  onChange={e => {
                    setSelectedSourceId(e.target.value);
                    setHasUserOverriddenPlatform(true);
                  }}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <optgroup label="GLOBAL JOB PLATFORMS">
                    {CANONICAL_JOB_SOURCES.filter(s => s.region === 'global').map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="VIETNAM PLATFORMS">
                    {CANONICAL_JOB_SOURCES.filter(s => s.region === 'vietnam').map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="SOCIAL / COMMUNITY">
                    {CANONICAL_JOB_SOURCES.filter(s => s.region === 'social').map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="DIRECT">
                    <option value="src-company">Company Site</option>
                  </optgroup>
                  <optgroup label="OTHER">
                    <option value="src-others">Others</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* If Others is selected, show optional Platform Name input */}
            {selectedSourceId === 'src-others' && (
              <div className="pt-2 animate-in fade-in">
                <label htmlFor="custom-platform-input" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Platform Name <span className="text-slate-400 font-normal lowercase">(optional custom job board/community)</span>
                </label>
                <input
                  id="custom-platform-input"
                  type="text"
                  value={customPlatformName}
                  onChange={e => handleFieldChangeWithHistory('customPlatform', e.target.value, setCustomPlatformName)}
                  placeholder="e.g. Tech Community / Local Job Board"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>
            )}
          </div>

          {/* Brief Overview / Scope (Clean Native Integration with Inline Expand Control) */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2 mb-1">
              <label htmlFor="brief-overview-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Brief Overview / Scope
              </label>

              <div className="flex items-center gap-3">
                {/* Subtle Inline Status */}
                {isExtracting ? (
                  <span className="text-[11px] text-slate-500 flex items-center gap-1.5 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                    <span>Analyzing job details…</span>
                  </span>
                ) : extractionNotice ? (
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 hidden sm:flex">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Job details analyzed</span>
                  </span>
                ) : null}

                {/* Expand / Collapse Control */}
                <button
                  type="button"
                  onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors px-2 py-0.5 rounded-md hover:bg-slate-200/60"
                  title={isOverviewExpanded ? "Collapse view" : "Expand to larger editing area"}
                >
                  {isOverviewExpanded ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Collapse ↙</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Expand ↗</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              id="brief-overview-input"
              rows={isOverviewExpanded ? 16 : 5}
              value={description}
              onChange={e => handleOverviewChange(e.target.value)}
              onBlur={() => {
                if (description.trim().length > 10) {
                  performSemanticExtraction(description, title, company);
                }
              }}
              placeholder="Paste or write the job description, responsibilities, team scope, requirements, or tech stack. CareerOS will use this information to suggest the structured fields below."
              className={`w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs resize-none transition-all leading-relaxed ${
                isOverviewExpanded ? 'min-h-[320px]' : ''
              }`}
            />

            {/* Subtle Inferred Summary Banner */}
            {extractionNotice && (
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 text-xs text-slate-700 shadow-2xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-800">
                    <span className="text-slate-500">Inferred:</span> {extractionNotice}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0 hidden sm:inline">
                  Adjust below if needed
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ADVANCED SECTION: Required Core Skills, Salary Intelligence,           */}
        {/*    Role Fit Signals, Market Signals, Opportunity Intelligence             */}
        {/* ========================================================================= */}
        <ProgressiveCreationSection workflowKey="jobs">
        <div className="pt-2">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Classified Structure &amp; Opportunity Intelligence
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Review and adjust inferred fields as needed
            </span>
          </div>

          <div className="space-y-4">
            {/* Canonical Taxonomies: Role Family & Industry Domain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="canonical-role-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Role Family
                  </label>
                  {userEditedFields.has('roleCategory') && inferredValues.roleCategory && inferredValues.roleCategory !== roleCategory && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 font-medium">
                      Manual override
                    </span>
                  )}
                </div>
                <select
                  id="canonical-role-select"
                  value={roleCategory}
                  onChange={e => handleRoleChange(e.target.value as RoleCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {CANONICAL_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="canonical-domain-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Industry Domain
                  </label>
                  {userEditedFields.has('domain') ? (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 font-medium">
                      Manual override
                    </span>
                  ) : industryDomainSource === 'ai' && domain !== 'Others' ? (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      AI inferred ({industryDomainConfidence ? `${Math.round(industryDomainConfidence * 100)}%` : 'High'})
                    </span>
                  ) : null}
                </div>
                <select
                  id="canonical-domain-select"
                  value={domain}
                  onChange={e => handleDomainChange(e.target.value as SectorDomain)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {CANONICAL_DOMAINS.map(dom => (
                    <option key={dom} value={dom}>{dom}</option>
                  ))}
                </select>

                {/* Subtle Classification Confidence Status */}
                {domain === 'Others' && !userEditedFields.has('domain') && (
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="text-slate-400 font-normal">
                      {industryDomainConfidence !== undefined && industryDomainConfidence < 0.85
                        ? `Industry not confidently classified (${Math.round(industryDomainConfidence * 100)}% confidence). Kept as Others`
                        : 'Select industry or allow CareerOS to infer from job details'}
                    </span>
                  </p>
                )}

                {/* Non-intrusive Suggestion when user has overridden or new evidence suggests another domain */}
                {suggestedDomain && suggestedDomain !== domain && (
                  <div className="mt-2 p-2 bg-blue-50/90 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
                    <span className="text-blue-900 font-medium">
                      Detected signal: <strong>{suggestedDomain}</strong>
                      {suggestedDomainConfidence ? ` (${Math.round(suggestedDomainConfidence * 100)}% confidence)` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDomain(suggestedDomain);
                        setIndustryDomainSource('ai');
                        setIndustryClassificationStatus('classified');
                        if (suggestedDomainConfidence) setIndustryDomainConfidence(suggestedDomainConfidence);
                        setSuggestedDomain(undefined);
                      }}
                      className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 cursor-pointer shadow-2xs hover:bg-blue-50 transition-colors"
                    >
                      Apply?
                    </button>
                  </div>
                )}

                {domain === 'Others' && (
                  <div className="mt-2.5 animate-in fade-in">
                    <label htmlFor="custom-domain-input" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Custom Industry Domain <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      id="custom-domain-input"
                      type="text"
                      value={customIndustryDomain}
                      onChange={e => {
                        handleFieldChangeWithHistory('customIndustryDomain', e.target.value, setCustomIndustryDomain);
                        markFieldEdited('domain');
                      }}
                      placeholder="e.g. Digital Transformation Consulting"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Seniority Level & Work Mode (Context-Aware with Evidence) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="canonical-level-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Seniority Level
                  </label>
                  {userEditedFields.has('level') && inferredValues.level && inferredValues.level !== level && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 font-medium">
                      Manual override
                    </span>
                  )}
                </div>
                <select
                  id="canonical-level-select"
                  value={level}
                  onChange={e => handleLevelChange(e.target.value as ExperienceLevel)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {CANONICAL_LEVELS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="canonical-workmode-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Work Mode
                  </label>
                  {userEditedFields.has('workMode') && inferredValues.workMode && inferredValues.workMode !== workMode && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 font-medium">
                      Manual override
                    </span>
                  )}
                </div>
                <select
                  id="canonical-workmode-select"
                  value={workMode}
                  onChange={e => handleWorkModeChange(e.target.value as WorkMode)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {CANONICAL_WORK_MODES.map(wm => (
                    <option key={wm} value={wm}>{wm}</option>
                  ))}
                </select>

                {/* Evidence snippet & confidence indicator */}
                {workModeEvidence && !userEditedFields.has('workMode') && (
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="font-semibold text-slate-700">Evidence:</span>
                    <span className="truncate max-w-[280px]" title={workModeEvidence.evidence}>
                      &quot;{workModeEvidence.evidence}&quot;
                    </span>
                    <span className="text-slate-400">({workModeEvidence.confidence})</span>
                  </p>
                )}
              </div>
            </div>

            {/* Location (Global vs Specific) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Location
                </label>
                {userEditedFields.has('location') && inferredValues.location && (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 font-medium">
                    Manual override
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="locationType"
                    checked={isGlobalLocation}
                    onChange={() => {
                      setIsGlobalLocation(true);
                      markFieldEdited('location');
                    }}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    Global / Anywhere
                  </span>
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="locationType"
                    checked={!isGlobalLocation}
                    onChange={() => {
                      setIsGlobalLocation(false);
                      markFieldEdited('location');
                    }}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Specific City / Region
                  </span>
                </label>
              </div>

              {!isGlobalLocation && (
                <div className="relative">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={e => {
                      handleFieldChangeWithHistory('location', e.target.value, setCustomLocation);
                      markFieldEdited('location');
                    }}
                    onBlur={() => setTimeout(() => setActiveSuggestionField(null), 250)}
                    placeholder="e.g. Ho Chi Minh City, Hanoi, Singapore, San Francisco, CA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                  />

                  {activeSuggestionField === 'location' && suggestions.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <span>Previously Used Locations</span>
                        <span>Select to autofill</span>
                      </div>
                      {suggestions.map((entry, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={() => handleSelectSuggestion('location', entry)}
                          className="w-full px-3 py-2 text-left text-xs text-slate-800 hover:bg-blue-50 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <span className="font-semibold">{entry.value}</span>
                          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            Previously used
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Opportunity Lifecycle, Posted Date & Application Deadline (Decoupled Fields) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label htmlFor="opportunity-status-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Opportunity Lifecycle Status
                  </label>
                  <select
                    id="opportunity-status-select"
                    value={opportunityStatus}
                    onChange={e => setOpportunityStatus(e.target.value as JobOpportunityLifecycleStatus)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <p className="text-xs text-slate-500 mt-1">
                  {opportunityStatus === 'active' && 'Currently available or still being tracked.'}
                  {opportunityStatus === 'expired' && 'Posting is no longer active or the opportunity has passed its deadline.'}
                  {opportunityStatus === 'archived' && 'Hidden from the active working list but retained for historical records.'}
                </p>
              </div>

              {/* Date Inputs: Posted Date vs Application Deadline */}
              <div className="pt-3 border-t border-slate-200/70 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Field A: POSTED DATE */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="posted-date-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Posted Date
                      </label>
                      {postedDate ? (
                        <span className="text-[10px] text-slate-500 font-medium">
                          {userEditedFields.has('postedDate') ? 'User specified' : 'From job posting'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-normal">
                          Not specified
                        </span>
                      )}
                    </div>
                    <input
                      id="posted-date-input"
                      type="date"
                      value={postedDate}
                      onChange={e => handlePostedDateChange(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      {postedDate 
                        ? `Job posted on ${postedDate}` 
                        : 'Source publication date. Left blank if not specified.'}
                    </p>
                  </div>

                  {/* Field B: APPLICATION DEADLINE */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="deadline-date-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {deadlineType === 'estimated' ? 'Estimated Deadline' : 'Application Deadline'}
                      </label>
                      
                      {/* Visual Badge distinction for deadline type */}
                      {deadlineType === 'estimated' && deadlineDate && (
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Estimated · +1 month from posted date</span>
                        </span>
                      )}
                      {deadlineType === 'explicit' && deadlineDate && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>From job posting</span>
                        </span>
                      )}
                      {deadlineType === 'manual' && deadlineDate && (
                        <span className="text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80 font-semibold">
                          Manual override
                        </span>
                      )}
                      {(!deadlineDate || deadlineType === 'none') && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          Not specified
                        </span>
                      )}
                    </div>

                    <input
                      id="deadline-date-input"
                      type="date"
                      value={deadlineDate}
                      onChange={e => handleDeadlineDateChange(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                        deadlineType === 'estimated'
                          ? 'bg-amber-50/50 border border-amber-300/80 text-amber-950 font-medium'
                          : 'bg-white border border-slate-300 text-slate-900'
                      }`}
                    />

                    <p className="text-[11px] text-slate-500 mt-1">
                      {deadlineType === 'estimated' && (
                        <span className="text-amber-700">
                          Estimated deadline based on posting date + 1 calendar month. Edit to override manually.
                        </span>
                      )}
                      {deadlineType === 'explicit' && (
                        <span className="text-emerald-700">
                          Confirmed application deadline extracted from the job posting.
                        </span>
                      )}
                      {deadlineType === 'manual' && (
                        <span className="text-blue-700">
                          Manual override. Authoritative date saved.
                        </span>
                      )}
                      {(!deadlineDate || deadlineType === 'none') && (
                        <span>
                          No confirmed deadline. This opportunity will not expire automatically.
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Specify exact deadline date toggle */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-slate-200/50">
                  <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasDeadline}
                      onChange={e => handleToggleSpecifyExactDeadline(e.target.checked)}
                      className="rounded-sm text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">Specify exact deadline date</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Use this when the job posting provides a confirmed application deadline.
                  </span>
                </div>
              </div>
            </div>

            {/* Salary & Required Core Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Salary / Compensation Range
                  </label>
                  {userEditedFields.has('salaryRange') && inferredValues.salaryRange && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 font-medium">
                      Manual override
                    </span>
                  )}
                </div>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={e => {
                      handleFieldChangeWithHistory('salaryRange', e.target.value, setSalaryRange);
                      markFieldEdited('salaryRange');
                    }}
                    onBlur={() => setTimeout(() => setActiveSuggestionField(null), 250)}
                    placeholder="e.g. $180,000 - $240,000 or Competitive"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {activeSuggestionField === 'salaryRange' && suggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span>Previously Used Compensation</span>
                      <span>Select to autofill</span>
                    </div>
                    {suggestions.map((entry, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={() => handleSelectSuggestion('salaryRange', entry)}
                        className="w-full px-3 py-2 text-left text-xs text-slate-800 hover:bg-blue-50 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="font-semibold">{entry.value}</span>
                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                          Previously used
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Required Core Skills
                </label>
                <input
                  type="text"
                  value={requiredSkillsInput}
                  onChange={e => {
                    handleFieldChangeWithHistory('requiredSkills', e.target.value, setRequiredSkillsInput);
                    markFieldEdited('requiredSkills');
                  }}
                  onBlur={() => setTimeout(() => setActiveSuggestionField(null), 250)}
                  placeholder="PostgreSQL, Kafka, Go, Distributed Systems (comma separated)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />

                {activeSuggestionField === 'requiredSkills' && suggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span>Previously Used Skills</span>
                      <span>Click to add</span>
                    </div>
                    {suggestions.map((entry, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={() => handleSelectSuggestion('requiredSkills', entry)}
                        className="w-full px-3 py-2 text-left text-xs text-slate-800 hover:bg-blue-50 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="font-semibold">{entry.value}</span>
                        <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                          Skill Suggestion
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </ProgressiveCreationSection>

        {/* Actions - Exactly ONE plus icon in [+ Add Job Opportunity] */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          {!capabilities.canCreate ? (
            <button
              type="button"
              onClick={() => openContextualPrompt()}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock in Demo</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditMode ? 'Saving Changes…' : 'Creating…'}</span>
                </>
              ) : isEditMode ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Job Opportunity</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
      </DemoQuotaGate>
    </Modal>
  );
};
