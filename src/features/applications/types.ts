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

// ============================================================================
// UNIFIED PARTICIPATION TRACKER TAXONOMY & LIFECYCLES
// ============================================================================

export type ParticipationType = 
  // Primary 15 canonical types requested
  | 'interview'
  | 'assessment'
  | 'workshop'
  | 'conference'
  | 'meetup'
  | 'seminar'
  | 'webinar'
  | 'meeting'
  | 'networking'
  | 'bootcamp'
  | 'hackathon'
  | 'competition'
  | 'community'
  | 'volunteer'
  | 'other'
  // Existing internal aliases for full backward-compatibility
  | 'career_opportunity'
  | 'challenge_hackathon'
  | 'builder_match'
  | 'mentor_mentee'
  | 'credential'
  | 'learning_program';

export type UnifiedParticipationStatus = 
  | 'saved'
  | 'invited'
  | 'registered'
  | 'confirmed'
  | 'attended'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type ParticipationStatus = 
  | 'NOT_STARTED'
  | 'ACTIVE'
  | 'WAITING'
  | 'COMPLETED'
  | 'SUCCESSFUL'
  | 'UNSUCCESSFUL'
  | 'WITHDRAWN'
  | 'ARCHIVED'
  | 'SAVED'
  | 'INVITED'
  | 'REGISTERED'
  | 'CONFIRMED'
  | 'ATTENDED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type ParticipationRole = 
  | 'Participant'
  | 'Attendee'
  | 'Speaker'
  | 'Panelist'
  | 'Facilitator'
  | 'Organizer'
  | 'Volunteer'
  | 'Mentor'
  | 'Guest'
  | 'Interviewer'
  | 'Candidate'
  | 'Team Member';

export type EvidenceType = 
  | 'certificate'
  | 'badge'
  | 'notes'
  | 'presentation'
  | 'project_output'
  | 'recording'
  | 'photo'
  | 'link'
  | 'document'
  | 'artifact';

export interface ParticipationEvidenceItem {
  id: string;
  title: string;
  type: EvidenceType;
  url?: string;
  fileSize?: string;
  uploadedAt: string;
  description?: string;
  verificationBadge?: boolean;
}

export interface ParticipationFollowUpTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface WorkshopDetails {
  instructor?: string;
  workshopTopic?: string;
  learningObjectives?: string[];
  materials?: { title: string; url: string }[];
  keyTakeaways?: string[];
  certificateEvidence?: string;
}

export interface ConferenceDetails {
  conferenceName?: string;
  venue?: string;
  speakers?: string[];
  sessions?: { title: string; speaker?: string; time?: string }[];
  tracks?: string[];
  networkingOpportunities?: string[];
  keyTakeaways?: string[];
  certificateBadge?: string;
}

export interface MeetingDetails {
  participants?: string[];
  agenda?: string;
  meetingObjective?: string;
  decisions?: string[];
  actionItems?: { text: string; assignee?: string; done: boolean }[];
  followUpDate?: string;
  relatedProjectId?: string;
}

export interface WebinarDetails {
  speaker?: string;
  topic?: string;
  platformOrVenue?: string;
  resources?: { title: string; url: string }[];
  keyTakeaways?: string[];
}

export interface BootcampDetails {
  provider?: string;
  curriculum?: string[];
  startDate?: string;
  endDate?: string;
  completionStatus?: string;
  certificate?: string;
  skillsAcquired?: string[];
}

export interface HackathonCompetitionDetails {
  organizer?: string;
  team?: string;
  project?: string;
  role?: string;
  submission?: string;
  resultOrRanking?: string;
  award?: string;
  relatedProject?: string;
  evidence?: string;
}

export interface CommunityVolunteerDetails {
  organization?: string;
  causeOrDomain?: string;
  role?: string;
  contribution?: string;
  impactOrOutcome?: string;
  hours?: number;
  evidence?: string;
}

export interface ParticipationStageConfig {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  dotColor: string;
  badgeBg: string;
}

export interface ParticipationTypeMetadata {
  id: ParticipationType;
  label: string;
  category: 'activity' | 'career' | 'learning' | 'networking' | 'collaboration';
  defaultRole: ParticipationRole;
  allowedStatuses: UnifiedParticipationStatus[];
  description: string;
  iconName: string;
  badgeBg: string;
}

export const CANONICAL_PARTICIPATION_TYPES: ParticipationTypeMetadata[] = [
  { id: 'interview', label: 'Interview', category: 'career', defaultRole: 'Candidate', allowedStatuses: ['invited', 'confirmed', 'attended', 'completed', 'cancelled', 'no_show'], description: 'Job, admissions, or technical screening interview', iconName: 'Video', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'assessment', label: 'Assessment / Assignment', category: 'career', defaultRole: 'Candidate', allowedStatuses: ['invited', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Take-home case, coding test, or skills evaluation', iconName: 'FileText', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'workshop', label: 'Workshop', category: 'learning', defaultRole: 'Participant', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Interactive hands-on skills training session', iconName: 'Sparkles', badgeBg: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'conference', label: 'Conference', category: 'networking', defaultRole: 'Attendee', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Industry summit, keynote panels, and networking tracks', iconName: 'Users', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'meetup', label: 'Meetup', category: 'networking', defaultRole: 'Attendee', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Informal local or virtual tech and community gathering', iconName: 'Compass', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'seminar', label: 'Seminar', category: 'learning', defaultRole: 'Attendee', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Deep-dive academic or professional presentation', iconName: 'BookOpen', badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'webinar', label: 'Webinar', category: 'learning', defaultRole: 'Attendee', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Online interactive broadcast or product demo', iconName: 'Tv', badgeBg: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'meeting', label: 'Meeting', category: 'collaboration', defaultRole: 'Participant', allowedStatuses: ['invited', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Strategic sync, mentor check-in, or project alignment', iconName: 'Calendar', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'networking', label: 'Networking Event', category: 'networking', defaultRole: 'Attendee', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Social mixer, builder hour, or recruiting night', iconName: 'Share2', badgeBg: 'bg-violet-50 text-violet-700 border-violet-200' },
  { id: 'bootcamp', label: 'Bootcamp', category: 'learning', defaultRole: 'Participant', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Intensive cohort curriculum and capstone projects', iconName: 'Award', badgeBg: 'bg-amber-50 text-amber-900 border-amber-300' },
  { id: 'hackathon', label: 'Hackathon', category: 'collaboration', defaultRole: 'Team Member', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Timed sprint building innovative software solutions', iconName: 'Trophy', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'competition', label: 'Competition', category: 'career', defaultRole: 'Participant', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Case competition, design sprint, or challenge cup', iconName: 'Target', badgeBg: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'community', label: 'Community Event', category: 'collaboration', defaultRole: 'Participant', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Open-source sprint, hack night, or developer circle', iconName: 'Hammer', badgeBg: 'bg-lime-50 text-lime-800 border-lime-300' },
  { id: 'volunteer', label: 'Volunteer / NGO Event', category: 'activity', defaultRole: 'Volunteer', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Pro-bono consulting, mentoring, or social impact initiative', iconName: 'Heart', badgeBg: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'other', label: 'Other', category: 'activity', defaultRole: 'Participant', allowedStatuses: ['saved', 'registered', 'confirmed', 'attended', 'completed', 'cancelled'], description: 'Custom professional activity or engagement', iconName: 'Layers', badgeBg: 'bg-slate-50 text-slate-700 border-slate-200' },
];

export interface ParticipationLifecycleConfig {
  type: ParticipationType;
  label: string;
  categoryTab: string;
  description: string;
  defaultStatus: ParticipationStatus;
  stages: ParticipationStageConfig[];
}

export interface TrackerActivity {
  id: string;
  itemId: string;
  type: 
    | 'STAGE_CHANGE'
    | 'INTERVIEW'
    | 'ASSIGNMENT'
    | 'SESSION'
    | 'SUBMISSION'
    | 'NOTE'
    | 'TASK'
    | 'UPDATE';
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
  metadata?: any;
}

export const PARTICIPATION_LIFECYCLES: Record<ParticipationType, ParticipationLifecycleConfig> = {
  career_opportunity: {
    type: 'career_opportunity',
    label: 'Career Opportunity',
    categoryTab: 'career',
    description: 'Track job applications, recruitment stages, take-home case studies, and offers.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'applied', label: 'Applied', shortLabel: 'Applied', description: 'Application submitted to company', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'screening', label: 'Screening', shortLabel: 'Screening', description: 'Recruiter or HR phone screening', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'interview', label: 'Interview', shortLabel: 'Interview', description: 'Technical, hiring manager, or domain round', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'assignment', label: 'Assignment / Test', shortLabel: 'Assignment', description: 'Take-home case study or coding challenge', dotColor: 'bg-purple-600', badgeBg: 'bg-purple-50 text-purple-700' },
      { id: 'final_round', label: 'Final Round', shortLabel: 'Final', description: 'Leadership interview or executive review', dotColor: 'bg-rose-600', badgeBg: 'bg-rose-50 text-rose-700' },
      { id: 'offer', label: 'Offer', shortLabel: 'Offer', description: 'Offer received, equity/base negotiation', dotColor: 'bg-teal-600', badgeBg: 'bg-teal-50 text-teal-700' },
      { id: 'outcome', label: 'Outcome', shortLabel: 'Outcome', description: 'Accepted offer, withdrawn, or concluded', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  challenge_hackathon: {
    type: 'challenge_hackathon',
    label: 'Challenge / Hackathon',
    categoryTab: 'challenge',
    description: 'Track hackathons, product challenges, case competitions, and innovation sprints.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'registered', label: 'Registered / Applied', shortLabel: 'Registered', description: 'Registration or entry application submitted', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'eligibility', label: 'Eligibility', shortLabel: 'Eligible', description: 'Rules verification and admission confirmed', dotColor: 'bg-sky-600', badgeBg: 'bg-sky-50 text-sky-700' },
      { id: 'team_formation', label: 'Team Formation', shortLabel: 'Team', description: 'Forming or joining cross-functional squad', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'preparation', label: 'Preparation', shortLabel: 'Prep', description: 'Sprint planning, research, and architecture drafting', dotColor: 'bg-violet-600', badgeBg: 'bg-violet-50 text-violet-700' },
      { id: 'submission', label: 'Submission', shortLabel: 'Submitted', description: 'Repository, demo video, and deck submitted', dotColor: 'bg-purple-600', badgeBg: 'bg-purple-50 text-purple-700' },
      { id: 'evaluation', label: 'Evaluation', shortLabel: 'Judges', description: 'Jury scoring and technical code review', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'finalist', label: 'Finalist', shortLabel: 'Finalist', description: 'Selected for top finalist stage', dotColor: 'bg-orange-600', badgeBg: 'bg-orange-50 text-orange-700' },
      { id: 'demo_pitch', label: 'Demo / Pitch', shortLabel: 'Pitch', description: 'Live presentation or prototype demonstration', dotColor: 'bg-pink-600', badgeBg: 'bg-pink-50 text-pink-700' },
      { id: 'winner_completed', label: 'Winner / Completed', shortLabel: 'Concluded', description: 'Award, honorable mention, or completed', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  builder_match: {
    type: 'builder_match',
    label: 'Builder Match',
    categoryTab: 'builder',
    description: 'Track collaborative matching with complementary engineers, PMs, and founders.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'applied', label: 'Applied', shortLabel: 'Applied', description: 'Builder match profile submitted or requested', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'profile_review', label: 'Profile Review', shortLabel: 'Review', description: 'Evaluating complementary skill compatibility', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'matching', label: 'Matching', shortLabel: 'Matching', description: 'Algorithm or mutual mutual interest triage', dotColor: 'bg-violet-600', badgeBg: 'bg-violet-50 text-violet-700' },
      { id: 'matched', label: 'Matched', shortLabel: 'Matched', description: 'Mutual builder pairing confirmed', dotColor: 'bg-purple-600', badgeBg: 'bg-purple-50 text-purple-700' },
      { id: 'introduction', label: 'Introduction', shortLabel: 'Intro', description: 'Initial sync and alignment call', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'collaboration', label: 'Collaboration', shortLabel: 'Pairing', description: 'Working together on project milestones', dotColor: 'bg-rose-600', badgeBg: 'bg-rose-50 text-rose-700' },
      { id: 'active', label: 'Active', shortLabel: 'Active', description: 'Full sprint execution in progress', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Completed', description: 'Shipped build and mutual recommendations', dotColor: 'bg-teal-600', badgeBg: 'bg-teal-50 text-teal-700' }
    ]
  },
  mentor_mentee: {
    type: 'mentor_mentee',
    label: 'Mentor / Mentee',
    categoryTab: 'mentor',
    description: 'Track 1-on-1 mentorship journeys, goal milestones, and session progress.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'applied', label: 'Applied', shortLabel: 'Applied', description: 'Mentorship application or request sent', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'review', label: 'Review', shortLabel: 'Review', description: 'Program intake and mentor evaluation', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'matched', label: 'Matched', shortLabel: 'Matched', description: 'Mentor-mentee pairing established', dotColor: 'bg-violet-600', badgeBg: 'bg-violet-50 text-violet-700' },
      { id: 'intro_session', label: 'Intro Session', shortLabel: 'Intro Call', description: 'Goal setting and expectations alignment', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'active', label: 'Active', shortLabel: 'Active Cadence', description: 'Recurring 1-on-1 mentorship sessions', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Completed', description: 'Completed program milestones and final review', dotColor: 'bg-teal-600', badgeBg: 'bg-teal-50 text-teal-700' }
    ]
  },
  credential: {
    type: 'credential',
    label: 'Credential',
    categoryTab: 'credential_program',
    description: 'Track professional certifications, exams, and formal competency credentials.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'enrolled', label: 'Enrolled', shortLabel: 'Enrolled', description: 'Registration or credential voucher secured', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'coursework', label: 'Coursework', shortLabel: 'Coursework', description: 'Curriculum study and practice questions', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'assessment', label: 'Assessment', shortLabel: 'Assessment', description: 'Practice exam or diagnostic assessment', dotColor: 'bg-purple-600', badgeBg: 'bg-purple-50 text-purple-700' },
      { id: 'exam', label: 'Exam', shortLabel: 'Exam Scheduled', description: 'Formal proctored exam date scheduled', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'certified', label: 'Certified', shortLabel: 'Certified', description: 'Credential officially awarded and verified', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  learning_program: {
    type: 'learning_program',
    label: 'Learning Program',
    categoryTab: 'credential_program',
    description: 'Track structured executive programs, bootcamps, and career accelerators.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'applied', label: 'Applied', shortLabel: 'Applied', description: 'Admissions application submitted', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'accepted', label: 'Accepted', shortLabel: 'Accepted', description: 'Cohort acceptance and enrollment offer', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'enrolled', label: 'Enrolled', shortLabel: 'Enrolled', description: 'Tuition confirmed and onboarding completed', dotColor: 'bg-violet-600', badgeBg: 'bg-violet-50 text-violet-700' },
      { id: 'in_progress', label: 'In Progress', shortLabel: 'In Progress', description: 'Live modules, sprint assignments, and peer reviews', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Graduated', description: 'Capstone defense and graduation certificate', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  workshop: {
    type: 'workshop',
    label: 'Workshop',
    categoryTab: 'learning',
    description: 'Track interactive hands-on skills training sessions.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Bookmarked for consideration', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Registered', shortLabel: 'Registered', description: 'Registration submitted or seat reserved', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'confirmed', label: 'Confirmed', shortLabel: 'Confirmed', description: 'Calendar invite and materials received', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'attended', label: 'Attended', shortLabel: 'Attended', description: 'Attended session and participated in exercises', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Completed', description: 'Artifacts captured, takeaways logged & completed', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  conference: {
    type: 'conference',
    label: 'Conference',
    categoryTab: 'networking',
    description: 'Track industry summits, keynote panels, and networking tracks.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Summit bookmarked', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Registered', shortLabel: 'Registered', description: 'Pass or badge acquired', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'confirmed', label: 'Confirmed', shortLabel: 'Confirmed', description: 'Travel, agenda & session tracks scheduled', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'attended', label: 'Attended', shortLabel: 'Attended', description: 'Sessions attended, badges & notes gathered', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Completed', description: 'Key takeaways and leads logged', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  meeting: {
    type: 'meeting',
    label: 'Meeting',
    categoryTab: 'collaboration',
    description: 'Track strategic syncs, mentor check-ins, or project alignment meetings.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'invited', label: 'Invited / Scheduled', shortLabel: 'Invited', description: 'Calendar invite sent or received', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'confirmed', label: 'Confirmed', shortLabel: 'Confirmed', description: 'Agenda aligned and attendance confirmed', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'attended', label: 'Attended', shortLabel: 'Attended', description: 'Meeting concluded, discussions captured', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Completed & Action Items', shortLabel: 'Action Items', description: 'Decisions and action items logged', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  webinar: {
    type: 'webinar',
    label: 'Webinar',
    categoryTab: 'learning',
    description: 'Track online broadcasts, product launches, and virtual demos.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Webinar saved', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Registered', shortLabel: 'Registered', description: 'Link and calendar invite received', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'confirmed', label: 'Confirmed', shortLabel: 'Confirmed', description: 'Reminder set', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'attended', label: 'Attended', shortLabel: 'Attended', description: 'Attended livestream or watch party', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Completed', description: 'Slides & takeaways reviewed', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  meetup: {
    type: 'meetup',
    label: 'Meetup',
    categoryTab: 'networking',
    description: 'Track informal local or virtual community gatherings.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Meetup saved', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Registered', shortLabel: 'RSVPed', description: 'RSVP confirmed on platform', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'attended', label: 'Attended', shortLabel: 'Attended', description: 'Attended meetup and met peers', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Completed', description: 'Followed up with contacts', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  seminar: {
    type: 'seminar',
    label: 'Seminar',
    categoryTab: 'learning',
    description: 'Track academic lectures and expert research presentations.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Seminar saved', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Registered', shortLabel: 'Registered', description: 'Enrolled in seminar list', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'attended', label: 'Attended', shortLabel: 'Attended', description: 'Attended lecture and discussion', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Completed', description: 'Research notes summarized', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  networking: {
    type: 'networking',
    label: 'Networking Event',
    categoryTab: 'networking',
    description: 'Track social mixers, builder hours, and recruiting nights.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Event saved', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Registered', shortLabel: 'Registered', description: 'Ticket or RSVP confirmed', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'attended', label: 'Attended', shortLabel: 'Attended', description: 'Attended and networked with peers', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Completed', description: 'Connected on LinkedIn and logged leads', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  bootcamp: {
    type: 'bootcamp',
    label: 'Bootcamp',
    categoryTab: 'learning',
    description: 'Track intensive cohort-based training and capstones.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Bootcamp program saved', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Applied / Registered', shortLabel: 'Applied', description: 'Admissions form submitted', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'confirmed', label: 'Enrolled & Confirmed', shortLabel: 'Enrolled', description: 'Cohort seat confirmed', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'attended', label: 'In Progress / Attending', shortLabel: 'In Progress', description: 'Live lectures and projects', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Graduated / Completed', shortLabel: 'Graduated', description: 'Certificate and capstone defense', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  hackathon: {
    type: 'hackathon',
    label: 'Hackathon',
    categoryTab: 'collaboration',
    description: 'Track coding sprints, prototype hackathons, and demo days.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Hackathon saved', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Registered', shortLabel: 'Registered', description: 'Team or individual registration accepted', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'confirmed', label: 'Team & Kickoff', shortLabel: 'Kickoff', description: 'Team locked and problem statement selected', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'attended', label: 'Building & Submitted', shortLabel: 'Submitted', description: 'Repository and demo submitted to judges', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Demo / Award / Completed', shortLabel: 'Concluded', description: 'Final rankings and awards awarded', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  competition: {
    type: 'competition',
    label: 'Competition',
    categoryTab: 'career',
    description: 'Track case competitions, pitch events, and design challenges.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Competition bookmarked', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Registered', shortLabel: 'Registered', description: 'Entry submitted', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'attended', label: 'Competed', shortLabel: 'Competed', description: 'Delivered presentation or pitch', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Completed', description: 'Outcome and score verified', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  community: {
    type: 'community',
    label: 'Community Event',
    categoryTab: 'collaboration',
    description: 'Track open-source sprints, developer circles, and local initiatives.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Event saved', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Registered', shortLabel: 'Registered', description: 'Joined participant roster', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'attended', label: 'Attended', shortLabel: 'Attended', description: 'Participated in community activities', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Completed', shortLabel: 'Completed', description: 'Logged contributions', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  volunteer: {
    type: 'volunteer',
    label: 'Volunteer / NGO Event',
    categoryTab: 'activity',
    description: 'Track pro-bono consulting, social impact projects, and volunteering.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Opportunity saved', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Signed Up', shortLabel: 'Signed Up', description: 'Volunteer commitment confirmed', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'attended', label: 'Volunteered', shortLabel: 'Volunteered', description: 'Completed volunteer hours and deliverables', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Impact Verified', shortLabel: 'Impact Verified', description: 'Hours certified and impact documented', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  interview: {
    type: 'interview',
    label: 'Interview',
    categoryTab: 'career',
    description: 'Track job, admissions, or technical screening interviews.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'invited', label: 'Invited / Scheduled', shortLabel: 'Scheduled', description: 'Interview scheduled on calendar', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'confirmed', label: 'Prep Completed', shortLabel: 'Prepped', description: 'Blueprints, questions & evidence prepped', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'attended', label: 'Interview Conducted', shortLabel: 'Conducted', description: 'Live interview completed', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Debrief & Follow-Up', shortLabel: 'Debriefed', description: 'Thank-you note sent and performance analyzed', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  assessment: {
    type: 'assessment',
    label: 'Assessment / Assignment',
    categoryTab: 'career',
    description: 'Track take-home cases, coding evaluations, and technical tests.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'invited', label: 'Prompt Received', shortLabel: 'Prompt Received', description: 'Prompt and deadline received', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'confirmed', label: 'Drafting Solution', shortLabel: 'Drafting', description: 'Building models, slides or code', dotColor: 'bg-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700' },
      { id: 'attended', label: 'Submitted', shortLabel: 'Submitted', description: 'Deliverables sent to reviewers', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Evaluated', shortLabel: 'Evaluated', description: 'Reviewer feedback recorded', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  },
  other: {
    type: 'other',
    label: 'Other',
    categoryTab: 'activity',
    description: 'Track custom career engagements and professional activities.',
    defaultStatus: 'ACTIVE',
    stages: [
      { id: 'saved', label: 'Saved', shortLabel: 'Saved', description: 'Activity saved', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700' },
      { id: 'registered', label: 'Active', shortLabel: 'Active', description: 'In progress', dotColor: 'bg-blue-600', badgeBg: 'bg-blue-50 text-blue-700' },
      { id: 'attended', label: 'Attended', shortLabel: 'Attended', description: 'Engagement completed', dotColor: 'bg-amber-600', badgeBg: 'bg-amber-50 text-amber-800' },
      { id: 'completed', label: 'Concluded', shortLabel: 'Concluded', description: 'Outcome documented', dotColor: 'bg-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' }
    ]
  }
};

export interface JobApplication {
  id: string;
  jobOpportunityId?: string;
  roleBlueprintId?: string;
  companyId?: string;
  companyName: string;
  companyLogo?: string;
  roleId?: string;
  roleTitle: string;
  roleCategory?: string;
  salary?: string;
  jobUrl?: string;
  jobSnapshot?: JobSnapshot;
  location?: string;
  employmentType?: string;
  
  // Participation Tracker Unified Fields
  participationType?: ParticipationType;
  participationStatus?: ParticipationStatus;
  unifiedStatus?: UnifiedParticipationStatus;
  participationRole?: ParticipationRole;
  currentStageId?: string;
  currentStageName?: string;
  expectedOutcome?: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  isOnline?: boolean;
  venue?: string;
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  domain?: string;
  organization?: string;
  description?: string;
  topics?: string[];
  keyTakeaways?: string[];
  outcomes?: string;
  evidenceItems?: ParticipationEvidenceItem[];
  followUpTasks?: ParticipationFollowUpTask[];
  followUpDate?: string;
  relatedOpportunityId?: string;
  relatedOpportunityTitle?: string;
  relatedProjectId?: string;
  relatedProjectTitle?: string;
  relatedKnowledgeId?: string;
  relatedKnowledgeTitle?: string;
  relatedBlueprintId?: string;
  relatedBlueprintTitle?: string;
  readinessContribution?: number;
  readinessSkills?: string[];

  // Dynamic Type-Specific Data Containers
  workshopDetails?: WorkshopDetails;
  conferenceDetails?: ConferenceDetails;
  meetingDetails?: MeetingDetails;
  webinarDetails?: WebinarDetails;
  bootcampDetails?: BootcampDetails;
  hackathonDetails?: HackathonCompetitionDetails;
  communityDetails?: CommunityVolunteerDetails;

  // Type-specific data containers
  hackathonData?: {
    teamName?: string;
    teamMembers?: string[];
    projectName?: string;
    projectDescription?: string;
    repositoryUrl?: string;
    pitchDeckUrl?: string;
    submissionUrl?: string;
    deliverables?: { id: string; title: string; completed: boolean; dueDate?: string }[];
  };

  builderMatchData?: {
    matchedBuilderId?: string;
    matchedBuilderName?: string;
    matchedBuilderRole?: string;
    matchedBuilderAvatar?: string;
    matchedBuilderSkills?: string[];
    teamName?: string;
    projectTitle?: string;
    availability?: string;
    collaborationStatus?: 'exploring' | 'pairing' | 'active_sprint' | 'completed';
    nextAction?: string;
  };

  mentorshipData?: {
    mentorOrMenteeName?: string;
    mentorshipRole?: 'mentor' | 'mentee';
    mentorAvatar?: string;
    mentorTitle?: string;
    programName?: string;
    completedSessions: number;
    totalSessions: number;
    nextSessionDate?: string;
    nextSessionAgenda?: string;
    goals: string[];
    nextAction?: string;
  };

  credentialProgramData?: {
    providerName?: string;
    credentialType?: 'certification' | 'certificate' | 'bootcamp' | 'fellowship';
    examDate?: string;
    score?: string;
    credentialId?: string;
    credentialUrl?: string;
    certificationBadgeUrl?: string;
    milestones?: { title: string; completed: boolean; date?: string }[];
  };

  activities?: TrackerActivity[];

  // Canonical Pipeline State (Backward-compatible for Job Applications)
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

// Unified Tracker Item Alias
export type ParticipationTrackerItem = JobApplication;
