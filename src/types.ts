export type ExperienceLevel = 
  | 'Intern / Fresh Grad'
  | 'Junior'
  | 'Mid-Level'
  | 'Senior'
  | 'Lead / Staff'
  | 'Principal / Fellow'
  | 'Manager / Director'
  | 'Executive / C-Suite';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type SectorDomain = 
  | 'Fintech & Payments'
  | 'Enterprise SaaS'
  | 'AI & Machine Learning'
  | 'Cloud Infrastructure & DevOps'
  | 'Cybersecurity'
  | 'E-Commerce & Retail'
  | 'Healthcare & MedTech'
  | 'Logistics & Supply Chain'
  | 'EdTech & E-Learning'
  | 'Gaming & Entertainment'
  | 'Web3 & Blockchain'
  | 'PropTech & Real Estate'
  | 'AutoTech & Mobility'
  | 'Digital Media & Entertainment'
  | 'AdTech & MarTech'
  | 'Software Outsourcing & IT Services'
  | 'LegalTech & Compliance'
  | 'Management Consulting & Advisory'
  | 'HRTech & Recruitment'
  | 'ClimateTech & GreenTech'
  | 'TravelTech & Hospitality'
  | 'FoodTech & F&B'
  | 'AgriTech'
  | 'Manufacturing & Industrial Tech'
  | 'Others';

export type RoleCategory = 
  | 'Software Engineering'
  | 'Product Management'
  | 'Product & Technical Operations'
  | 'UI/UX & Product Design'
  | 'Data Analytics & BI'
  | 'Data & Machine Learning'
  | 'Business Analysis & Strategy'
  | 'Program & Project Management'
  | 'Growth & Product Marketing'
  | 'DevOps & Cloud'
  | 'Security & Systems';

export type JobApplicationStatus = 
  | 'Wishlist'
  | 'Applied'
  | 'Screening'
  | 'Technical'
  | 'Onsite'
  | 'Offer'
  | 'Archived';

export type JobOpportunityLifecycleStatus = 'active' | 'expired' | 'archived';

export type JobDeadlineType = 'explicit' | 'estimated' | 'manual' | 'none';
export type JobDeadlineSource = 'job_posting' | 'posting_date_estimate' | 'user' | 'none';
export type IndustryDomainSource = 'ai' | 'user' | 'default';
export type IndustryClassificationStatus = 'unclassified' | 'classified';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  roleCategory: RoleCategory;
  domain: SectorDomain;
  customDomain?: string;
  customIndustryDomain?: string;
  industryDomain?: SectorDomain;
  industryDomainConfidence?: number;
  industryDomainSource?: IndustryDomainSource;
  industryClassificationStatus?: IndustryClassificationStatus;
  level: ExperienceLevel;
  location: string;
  workMode: WorkMode;
  salaryRange: string;
  postedDate: string;
  postedAt?: string | null;
  description: string;
  keyResponsibilities: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  externalPlatform?: string;
  jobSource?: string;
  customPlatform?: string;
  sourceId?: string;
  externalUrl: string;
  featured?: boolean;
  hasSpecificDeadline?: boolean;
  applicationDeadline?: string | null;
  deadlineType?: JobDeadlineType;
  deadlineSource?: JobDeadlineSource;
  isCustom?: boolean;
  createdAt?: string;
  opportunityStatus?: JobOpportunityLifecycleStatus;
  status?: JobOpportunityLifecycleStatus;
}

export interface SavedJobApplication {
  id: string;
  jobId: string;
  job: JobListing;
  status: JobApplicationStatus;
  savedAt: string;
  notes?: string;
  appliedDate?: string;
  targetSalary?: string;
  referralContact?: string;
}

export interface CompetencyPillar {
  name: string;
  description: string;
  keyIndicators: string[];
}

export interface RoleBlueprint {
  id: string;
  title: string;
  category: RoleCategory;
  level: ExperienceLevel;
  tagline: string;
  overview: string;
  salaryBenchmark: {
    junior: string;
    mid: string;
    senior: string;
    lead: string;
  };
  marketDemand: 'High' | 'Very High' | 'Surging';
  competencies: CompetencyPillar[];
  dailyTasksTimeline: {
    time: string;
    task: string;
    description: string;
  }[];
  primaryTechStack: string[];
  commonTools: string[];
  keyPerformanceMetrics: string[];
  careerProgression: string[];
  typicalInterviewStages: string[];
}

export interface IndustryDomainGuide {
  id: string;
  name: SectorDomain;
  iconName: string;
  summary: string;
  coreBusinessProblems: string[];
  regulatoryAndCompliance: string[];
  architecturalPatterns: string[];
  criticalTerminology: {
    term: string;
    definition: string;
    exampleUsage: string;
  }[];
  interviewTraps: string[];
  sampleDiscussionTopics: string[];
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  phase: string;
  keyActions: string[];
  toolsUsed: string[];
  deliverables: string[];
  commonPitfalls: string[];
}

export interface ProfessionalWorkflow {
  id: string;
  title: string;
  category: RoleCategory;
  domain: SectorDomain;
  summary: string;
  estimatedDuration: string;
  frequency: string;
  steps: WorkflowStep[];
  realWorldImpact: string;
}

export interface PracticalCase {
  id: string;
  title: string;
  companyType: string;
  sector: SectorDomain;
  roleCategory: RoleCategory;
  difficulty: ExperienceLevel;
  backgroundScenario: string;
  theCoreConflict: string;
  engineeringOrProductTradeoffs: {
    optionA: string;
    optionB: string;
    prosA: string[];
    consA: string[];
    prosB: string[];
    consB: string[];
  };
  recommendedResolution: string;
  keyTakeaways: string[];
  interviewDiscussionPrompts: string[];
}

export type QuestionType = 
  | 'Behavioral (STAR)'
  | 'Technical Architecture'
  | 'Product Sense & Strategy'
  | 'System Design'
  | 'Domain Deep-Dive';

export interface InterviewQuestion {
  id: string;
  roleCategory: RoleCategory;
  domain: SectorDomain;
  level: ExperienceLevel;
  type: QuestionType;
  question: string;
  context: string;
  rubricCriteria: {
    criterion: string;
    weight: number;
    whatStrongCandidatesSay: string;
    redFlags: string;
  }[];
  starGuidance?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  keywordsToMention: string[];
  exemplaryModelAnswer: string;
  storedFollowUps?: string[];
}

export type QuestionSetId = 
  | 'standard_curriculum'
  | 'conflict_leadership'
  | 'architecture_scale'
  | 'product_strategy'
  | 'domain_deepdive';

export interface InterviewConfig {
  roleCategory: RoleCategory;
  domain: SectorDomain;
  level: ExperienceLevel;
  interviewType: QuestionType;
  questionCount: number;
  timePerQuestionSeconds: number;
  enableVoiceReading: boolean;
  interviewMode?: 'mock' | 'live_intelligence';
  mockExperienceType?: 'realtime_ai' | 'classic' | 'timed_assignment';
  questionSet?: QuestionSetId;
  timedAssignmentType?: TimedAssignmentType;
}

export type TimedAssignmentType = 
  | 'Behavioral'
  | 'Technical Architecture'
  | 'System Design'
  | 'Product Case'
  | 'Business Case'
  | 'Communication'
  | 'Situational / Stakeholder';

export interface TimedAssignment {
  id: string;
  title: string;
  type: TimedAssignmentType;
  prompt: string;
  context: string;
  timeLimitSeconds: number;
  dimensionsTested: string[];
  framework: string;
  hints: string[];
  sampleStrongAnswer: string;
}

export interface LiveParticipant {
  id: string;
  name: string;
  role: string;
  isInterviewer: boolean;
  avatarColor: string;
}

export interface LiveTimelineItem {
  id: string;
  speakerId: string;
  speakerName: string;
  isInterviewer: boolean;
  timestamp: string;
  text: string;
  isQuestion?: boolean;
  detectedIntent?: string;
  matchedBlueprintId?: string;
}

export interface LiveInterviewNoteItem {
  id: string;
  timestamp: string;
  tag: 'Question' | 'Comment' | 'Follow-up' | 'Observation';
  text: string;
}

export interface LiveSessionRecord {
  id: string;
  savedAt: string;
  role: string;
  domain: string;
  companyName: string;
  durationSeconds: number;
  participants: LiveParticipant[];
  timeline: LiveTimelineItem[];
  notes: LiveInterviewNoteItem[];
  processed?: boolean;
  processingResult?: {
    summary: string;
    detectedQuestions: {
      question: string;
      intent: string;
      matchedBlueprint: string;
      relevanceScore: number;
    }[];
    keyTopics: string[];
    actionItems: string[];
  };
}

export interface AnswerEvaluation {
  score: number; // 0 - 100
  ratingTier: 'Exceptional' | 'Strong' | 'Competent' | 'Needs Work';
  starBreakdown?: {
    situationTaskScore: number;
    actionScore: number;
    resultImpactScore: number;
  };
  strengths: string[];
  improvementAreas: string[];
  keywordsMatched: string[];
  keywordsMissed: string[];
  detailedFeedback: string;
}

export interface QuestionResponse {
  questionId: string;
  question: InterviewQuestion;
  candidateAnswer: string;
  notes: string;
  timeSpentSeconds: number;
  evaluation?: AnswerEvaluation;
}

export interface MockInterviewSession {
  id: string;
  createdAt: string;
  config: InterviewConfig;
  responses: QuestionResponse[];
  overallScore: number;
  readinessSummary: string;
  totalDurationSeconds: number;
  completed: boolean;
}

export interface UserCareerProfile {
  name?: string;
  targetRole: RoleCategory;
  targetRoleBlueprintId?: string;
  targetDomain: SectorDomain;
  targetIndustryDomains?: SectorDomain[];
  targetLevel: ExperienceLevel;
  experienceLevel?: ExperienceLevel;
  targetTitle?: string;
  targetSalary: string;
  bookmarkedQuestionIds: string[];
  readinessScore: number;
}
