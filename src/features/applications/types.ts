export type JobApplicationStatus = 
  | 'WISHLIST'
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'ASSESSMENT'
  | 'CASE'
  | 'FINAL_INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'ACCEPTED';

/** Canonical 5-stage Application Pipeline State */
export type ApplicationPrimaryState =
  | 'applied_screening'
  | 'assessment_case'
  | 'interviews'
  | 'offer_negotiation'
  | 'archived_closed';

export type ApplicationSubState =
  // applied_screening
  | 'wishlist'
  | 'applied'
  | 'screening'
  | 'recruiter_outreach'
  // assessment_case
  | 'assessment'
  | 'take_home'
  | 'case_study'
  | 'technical_test'
  | 'design_exercise'
  | 'business_case'
  | 'design_challenge'
  // interviews
  | 'recruiter'
  | 'hiring_manager'
  | 'technical'
  | 'behavioral'
  | 'panel'
  | 'final'
  // offer_negotiation
  | 'offer_received'
  | 'negotiating'
  | 'negotiation'
  | 'decision_pending'
  | 'declined'
  // archived_closed
  | 'accepted'
  | 'rejected'
  | 'withdrawn'
  | 'no_response';

export interface ApplicationStateHistory {
  fromState?: ApplicationPrimaryState;
  toState: ApplicationPrimaryState;
  fromSubState?: ApplicationSubState;
  toSubState?: ApplicationSubState;
  changedAt: string;
  reason?: string;
}

export type InterviewRoundType = 'RECRUITER' | 'HIRING_MANAGER' | 'TECHNICAL' | 'SYSTEM_DESIGN' | 'PANEL' | 'FINAL_EXECUTIVE';

export interface ApplicationInterview {
  id: string;
  applicationId: string;
  type: InterviewRoundType;
  title: string;
  interviewer?: string;
  interviewerRole?: string;
  scheduledAt: string;
  durationMinutes?: number;
  locationOrUrl?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface CanonicalPipelineStageConfig {
  id: ApplicationPrimaryState;
  title: string;
  description: string;
  subStates: { id: ApplicationSubState; label: string }[];
}

export const CANONICAL_PIPELINE_STAGES: CanonicalPipelineStageConfig[] = [
  {
    id: 'applied_screening',
    title: 'Applied & Screening',
    description: 'Awaiting recruiter review, resume screen, or preliminary call',
    subStates: [
      { id: 'applied', label: 'Applied' },
      { id: 'screening', label: 'Recruiter Screen' }
    ]
  },
  {
    id: 'assessment_case',
    title: 'Assessment & Case',
    description: 'Active take-home challenge, technical assessment, or case study',
    subStates: [
      { id: 'take_home', label: 'Take-Home Challenge' },
      { id: 'technical_test', label: 'Technical Test' },
      { id: 'business_case', label: 'Business Case' },
      { id: 'design_challenge', label: 'Design Challenge' },
      { id: 'case_study', label: 'Case Study' },
      { id: 'assessment', label: 'General Assessment' }
    ]
  },
  {
    id: 'interviews',
    title: 'Interview Rounds',
    description: 'Technical interviews, loop panels, and final conversations',
    subStates: [
      { id: 'technical', label: 'Technical Round' },
      { id: 'behavioral', label: 'Behavioral & Culture' },
      { id: 'panel', label: 'Panel Interview' },
      { id: 'final', label: 'Final Round' }
    ]
  },
  {
    id: 'offer_negotiation',
    title: 'Offer & Negotiation',
    description: 'Offer received, equity/base package evaluation and negotiation',
    subStates: [
      { id: 'offer_received', label: 'Offer Received' },
      { id: 'negotiation', label: 'Negotiation Active' },
      { id: 'accepted', label: 'Offer Accepted' },
      { id: 'declined', label: 'Offer Declined' }
    ]
  },
  {
    id: 'archived_closed',
    title: 'Archived & Closed',
    description: 'Closed opportunities, archived applications, or rejections',
    subStates: [
      { id: 'rejected', label: 'Rejected' },
      { id: 'withdrawn', label: 'Withdrawn' }
    ]
  }
];

export interface ApplicationOffer {
  id: string;
  applicationId: string;
  baseSalary?: string;
  bonusOrEquity?: string;
  totalComp?: string;
  deadline?: string;
  receivedAt: string;
  status: 'OFFER_RECEIVED' | 'NEGOTIATING' | 'ACCEPTED' | 'DECLINED';
  notes?: string;
}

export interface PipelineStateDefinition {
  id: ApplicationPrimaryState;
  label: string;
  shortLabel: string;
  filterLabel: string;
  badgeClass: string;
  dotColor: string;
  description: string;
}

export const PIPELINE_STATES: Record<ApplicationPrimaryState, PipelineStateDefinition> = {
  applied_screening: {
    id: 'applied_screening',
    label: 'Applied / Screening',
    shortLabel: 'Applied',
    filterLabel: 'Applied',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500',
    description: 'Submitted applications awaiting recruiter or HR preliminary screening.'
  },
  assessment_case: {
    id: 'assessment_case',
    label: 'Assessment / Case',
    shortLabel: 'In Assessment',
    filterLabel: 'In Assessment',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotColor: 'bg-purple-500',
    description: 'Active take-home assignments, technical coding challenges, or business case studies.'
  },
  interviews: {
    id: 'interviews',
    label: 'Interviews',
    shortLabel: 'Interviewing',
    filterLabel: 'Interviewing',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
    description: 'Hiring manager conversations, technical deep-dives, panel, and final rounds.'
  },
  offer_negotiation: {
    id: 'offer_negotiation',
    label: 'Offer / Negotiation',
    shortLabel: 'Offer',
    filterLabel: 'Offer',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    description: 'Received formal offers undergoing compensation negotiation and decision finalization.'
  },
  archived_closed: {
    id: 'archived_closed',
    label: 'Archived (Closed)',
    shortLabel: 'Archived',
    filterLabel: 'Archived',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-400',
    description: 'Closed opportunities (Accepted, Rejected, or Withdrawn).'
  }
};

export function mapLegacyStatusToPipelineState(status?: string): { primary: ApplicationPrimaryState; sub?: ApplicationSubState } {
  if (!status) return { primary: 'applied_screening', sub: 'applied' };
  const s = status.toUpperCase();
  switch (s) {
    case 'WISHLIST':
    case 'APPLIED':
      return { primary: 'applied_screening', sub: 'applied' };
    case 'SCREENING':
      return { primary: 'applied_screening', sub: 'screening' };
    case 'ASSESSMENT':
      return { primary: 'assessment_case', sub: 'assessment' };
    case 'CASE':
      return { primary: 'assessment_case', sub: 'case_study' };
    case 'INTERVIEW':
    case 'TECHNICAL':
      return { primary: 'interviews', sub: 'technical' };
    case 'FINAL_INTERVIEW':
    case 'ONSITE':
      return { primary: 'interviews', sub: 'final' };
    case 'OFFER':
      return { primary: 'offer_negotiation', sub: 'offer_received' };
    case 'ACCEPTED':
      return { primary: 'archived_closed', sub: 'accepted' };
    case 'REJECTED':
      return { primary: 'archived_closed', sub: 'rejected' };
    case 'WITHDRAWN':
      return { primary: 'archived_closed', sub: 'withdrawn' };
    default:
      return { primary: 'applied_screening', sub: 'applied' };
  }
}

export function mapPipelineStateToLegacyStatus(primary: ApplicationPrimaryState, sub?: ApplicationSubState): JobApplicationStatus {
  switch (primary) {
    case 'applied_screening':
      return sub === 'screening' ? 'SCREENING' : 'APPLIED';
    case 'assessment_case':
      return sub === 'case_study' ? 'CASE' : 'ASSESSMENT';
    case 'interviews':
      return sub === 'final' ? 'FINAL_INTERVIEW' : 'INTERVIEW';
    case 'offer_negotiation':
      return 'OFFER';
    case 'archived_closed':
      if (sub === 'accepted') return 'ACCEPTED';
      if (sub === 'withdrawn') return 'WITHDRAWN';
      return 'REJECTED';
    default:
      return 'APPLIED';
  }
}

export interface UpcomingDeadlineItem {
  id: string;
  sourceType: 'TEST_ASSIGNMENT' | 'INTERVIEW' | 'PREPARATION_TASK';
  applicationId: string;
  applicationTitle: string;
  companyName: string;
  companyLogo?: string;
  itemTitle: string;
  categoryOrSubtype: string;
  dueAt: string;
  urgency: 'HIGH' | 'MODERATE' | 'NORMAL';
  daysRemaining: number;
  hoursRemaining: number;
  status: string;
}

export function calculateUrgency(dueAt: string): {
  urgency: 'HIGH' | 'MODERATE' | 'NORMAL';
  hoursRemaining: number;
  daysRemaining: number;
  label: string;
} {
  const diffMs = new Date(dueAt).getTime() - Date.now();
  const hoursRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
  const daysRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

  if (diffMs <= 0) {
    return { urgency: 'HIGH', hoursRemaining: 0, daysRemaining: 0, label: 'Overdue' };
  }
  if (hoursRemaining < 48) {
    return {
      urgency: 'HIGH',
      hoursRemaining,
      daysRemaining,
      label: hoursRemaining < 24 ? `Due in ${hoursRemaining}h` : `Due in ${Math.ceil(hoursRemaining / 24)}d (<48h)`
    };
  }
  if (daysRemaining <= 7) {
    return {
      urgency: 'MODERATE',
      hoursRemaining,
      daysRemaining,
      label: `Due in ${daysRemaining} days`
    };
  }
  return {
    urgency: 'NORMAL',
    hoursRemaining,
    daysRemaining,
    label: `Due in ${daysRemaining} days`
  };
}

export interface JobSnapshot {
  title: string;
  company: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  skills: string[];
  location: string;
  salary?: string;
  sourceUrl?: string;
  capturedAt: string;
  originalSourceText?: string;
}

export interface ApplicationRequirement {
  id: string;
  category: 
    | 'Required Skills' 
    | 'Preferred Skills' 
    | 'Experience' 
    | 'Domain Knowledge' 
    | 'Technical Knowledge' 
    | 'Leadership' 
    | 'Analytical Skills' 
    | 'Strategic Thinking'
    | 'Unmapped';
  text: string;
  mappedSkillId?: string;
  mappedSkillName?: string;
  confidence: 'High' | 'Medium' | 'Low' | 'Unmapped';
}

export type AssessmentType = 
  | 'CASE_INTERVIEW'
  | 'TAKE_HOME_CASE'
  | 'BUSINESS_CASE'
  | 'PRODUCT_CASE'
  | 'STRATEGY_CASE'
  | 'TECHNICAL_TEST'
  | 'DESIGN_CHALLENGE'
  | 'PRESENTATION'
  | 'WRITTEN_ASSIGNMENT'
  | 'PORTFOLIO_REVIEW'
  | 'OTHER';

export type AssessmentStatus = 
  | 'NOT_STARTED'
  | 'ANALYZING'
  | 'PREPARING'
  | 'DRAFTING'
  | 'REVIEWING'
  | 'READY'
  | 'SUBMITTED'
  | 'COMPLETED';

export interface ApplicationAssessment {
  id: string;
  applicationId: string;
  type: AssessmentType;
  title: string;
  description: string;
  deadline?: string;
  status: AssessmentStatus;
  estimatedEffort?: string;
  submissionUrl?: string;
  submissionMethod?: string;
  caseId?: string;
  taskIds: string[];
  submittedAt?: string;
  outcome?: string;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseExhibitItem {
  id: string;
  title: string;
  description: string;
  type: 'TABLE' | 'CHART' | 'DOCUMENT' | 'FINANCIAL_MODEL';
  dataPreview?: any;
}

export interface CaseAnalysisReport {
  overview: string;
  decisionToMake: string;
  constraints: string[];
  providedInfo: string[];
  missingInfo: string[];
  suggestedSkills: { name: string; relevance: number; reason: string }[];
  detectedIndustry?: string;
  detectedGeography?: string;
  detectedCaseTypes: { type: string; confidence: 'High' | 'Medium' | 'Low' }[];
  deliverablesExpected: string[];
}

export interface ApplicationCase {
  id: string;
  assessmentId: string;
  applicationId: string;
  title: string;
  prompt: string;
  context: string;
  companyContext?: string;
  industryId?: string;
  geography?: string;
  caseTypeIds: string[];
  skillIds: string[];
  relatedKnowledgeIds: string[];
  relatedFrameworkIds: string[];
  relatedDataPointIds: string[];
  relatedIntelligenceIds: string[];
  relatedResourceIds: string[];
  relatedCaseStudyIds: string[];
  questions: string[];
  exhibits: CaseExhibitItem[];
  assumptions: string[];
  myNotes?: string;
  myHypotheses?: string;
  myAnalysis?: string;
  myRecommendation?: string;
  submissionDocument?: string;
  submissionUrl?: string;
  submissionVersion?: number;
  status: string;
  isPrivate: boolean;
  visibility: 'PRIVATE' | 'PERSONAL' | 'ANONYMIZED' | 'PUBLIC';
  analysisReport?: CaseAnalysisReport;
  createdAt: string;
  updatedAt: string;
}

export interface PreparationTask {
  id: string;
  applicationId: string;
  assessmentId?: string;
  title: string;
  type: 
    | 'UNDERSTAND_CASE'
    | 'REVIEW_FRAMEWORK'
    | 'EXPLORE_DATA'
    | 'PRACTICE_CASE'
    | 'EXECUTIVE_SYNTHESIS'
    | 'DRAFT_SOLUTION'
    | 'FINAL_REVIEW';
  relatedSkillId?: string;
  relatedSkillName?: string;
  relatedKnowledgeId?: string;
  relatedKnowledgeTitle?: string;
  relatedResourceId?: string;
  relatedCaseStudyId?: string;
  relatedCaseStudyTitle?: string;
  relatedDataPointId?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedMinutes: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  whyRecommended: string;
  completedAt?: string;
}

export interface ApplicationSkillGap {
  applicationId: string;
  skillId: string;
  skillName: string;
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  currentEvidenceCount: number;
  currentEvidenceLevel: 'None' | 'Low' | 'Medium' | 'Strong';
  requiredLevel: 'High' | 'Medium';
  gapScore: number; // 0 (no gap) to 100 (high gap)
  recommendedPracticeTitle: string;
  recommendedPracticeType: string;
}

export interface ApplicationEvidence {
  id: string;
  applicationId: string;
  assessmentId?: string;
  skillId?: string;
  skillName: string;
  knowledgeId?: string;
  evidenceType: 
    | 'CASE_SOLUTION' 
    | 'PRESENTATION' 
    | 'WRITTEN_ASSIGNMENT' 
    | 'INTERVIEW_RESPONSE' 
    | 'PORTFOLIO' 
    | 'FEEDBACK' 
    | 'PRACTICE' 
    | 'OTHER';
  title: string;
  description: string;
  artifactUrl?: string;
  score?: number;
  feedback?: string;
  confidence?: 'High' | 'Medium';
  createdAt: string;
}

export interface ApplicationIntelligenceItem {
  id: string;
  applicationId: string;
  sourceEntityId: string;
  sourceEntityType: 
    | 'SKILL' 
    | 'KNOWLEDGE' 
    | 'FRAMEWORK' 
    | 'INDUSTRY_DATA' 
    | 'INDUSTRY_INTELLIGENCE' 
    | 'RESOURCE' 
    | 'CASE' 
    | 'WORKFLOW';
  title: string;
  subtitle?: string;
  relevanceScore: number; // 0 - 100
  relevanceReason: string;
  intelligenceType: 
    | 'Skills' 
    | 'Knowledge' 
    | 'Industry Data' 
    | 'Industry Intelligence' 
    | 'Similar Cases' 
    | 'Resources';
  categoryTag?: string;
  localizedTitle?: { en: string; vi: string };
  localizedReason?: { en: string; vi: string };
  canonicalEntities?: string[];
  inputLanguage?: string;
  sourceLanguage?: string;
  factType?: 'USER_FACT' | 'SOURCE_FACT' | 'CAREER_OS_KNOWLEDGE' | 'AI_INFERENCE' | 'AI_RECOMMENDATION' | 'USER_HYPOTHESIS';
  confidence?: number;
  metadata?: any;
}

export interface ContextualIntelligenceSummary {
  applicationId: string;
  skillsCount: number;
  knowledgeCount: number;
  industryDataCount: number;
  similarCasesCount: number;
  resourcesCount: number;
  items: ApplicationIntelligenceItem[];
}

export interface CompanyIntelligence {
  companyName: string;
  businessModel: string;
  products: string[];
  market: string;
  competitors: string[];
  strategicPriorities: string[];
  recentDevelopments: string[];
  industryPosition: string;
  sourceUrl?: string;
  verifiedSource: boolean;
  capturedAt: string;
}

export interface ApplicationOutcome {
  applicationId: string;
  status: 'ADVANCED' | 'REJECTED' | 'OFFER' | 'NO_RESPONSE' | 'WITHDRAWN' | 'UNKNOWN';
  decidedAt?: string;
  companyFeedback?: string;
  interviewerFeedback?: string;
  selfReview?: string;
  learnings: string[];
  recommendedFollowUps: string[];
}

export interface JobApplicationDocument {
  id: string;
  name: string;
  url?: string;
  type: string;
  uploadedAt: string;
  fileSize?: string;
}

export interface JobApplication {
  id: string;
  jobOpportunityId?: string;
  roleBlueprintId?: string;
  companyId?: string;
  companyName: string;
  companyLogo?: string;
  roleId?: string;
  roleTitle: string;
  jobUrl?: string;
  jobSnapshot?: JobSnapshot;
  location?: string;
  employmentType?: string;
  
  // Canonical Pipeline State
  pipelineState: ApplicationPrimaryState;
  pipelineSubState?: ApplicationSubState;
  stateHistory?: ApplicationStateHistory[];

  // Backward-compatible status
  status: JobApplicationStatus;

  appliedAt?: string;
  deadline?: string;
  requirementIds: string[];
  requirements: ApplicationRequirement[];
  skillIds: string[];
  knowledgeIds: string[];
  assessmentIds: string[];
  interviews?: ApplicationInterview[];
  offer?: ApplicationOffer;
  notes?: string;
  documents: JobApplicationDocument[];
  companyIntelligence?: CompanyIntelligence;
  outcome?: ApplicationOutcome;
  isSyntheticSample?: boolean;
  createdAt: string;
  updatedAt: string;
}
