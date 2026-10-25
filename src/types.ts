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

export interface CompensationBenchmarkTier {
  level: 'junior' | 'mid' | 'senior' | 'lead';
  levelLabel?: string;
  min: number | string;
  max: number | string;
  currency: string;
  hasVariable?: boolean;
}

export interface InterviewPipelineStage {
  order: number;
  name: string;
  duration: string;
  description?: string;
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
  marketDemand: 'High' | 'Very High' | 'Surging' | 'Medium' | 'Emerging';
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

  // Extended fields for Role Blueprint Creator & Editor
  roleFamily?: string;
  industryDomain?: SectorDomain | string;
  seniorityLevel?: ExperienceLevel | string;
  missionScope?: string;
  compensationBenchmarks?: CompensationBenchmarkTier[];
  typicalDay?: {
    time: string;
    activity: string;
    description: string;
  }[];
  techStack?: string[];
  interviewPipeline?: InterviewPipelineStage[];
  status?: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
  isCustom?: boolean;
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
  seniorCalibrationFocus?: string;
  sampleAnswer?: string;
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
  companyName?: string;
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

// ==================================================
// CAREER OPPORTUNITY & REUSABLE COMMERCIAL LAYER
// ==================================================

export type OpportunityType = 
  | 'challenge' 
  | 'learning' 
  | 'venture' 
  | 'promotion' 
  | 'company_signal';

export type OpportunitySubtype = 
  // A. Challenges & Hackathons
  | 'hackathon' 
  | 'competition' 
  | 'case_competition' 
  | 'product_challenge' 
  | 'ai_challenge' 
  | 'design_challenge' 
  | 'open_innovation_challenge'
  // B. Learning & Career Programs (Internal Category)
  | 'bootcamp' 
  | 'training_program' 
  | 'fellowship' 
  | 'mentorship_program' 
  | 'career_accelerator' 
  | 'upskilling_program' 
  | 'reskilling_program' 
  | 'certification_program' 
  | 'apprenticeship' 
  | 'residency_learning_program'
  // C. Venture & Founder Programs
  | 'startup_accelerator' 
  | 'incubator' 
  | 'founder_program' 
  | 'pitching_competition' 
  | 'startup_challenge' 
  | 'venture_program' 
  | 'grant' 
  | 'funding_program' 
  | 'entrepreneurship_fellowship'
  // D. Promotions & Deals
  | 'career_service' 
  | 'professional_service' 
  | 'course_deal' 
  | 'tool_deal' 
  | 'software_deal' 
  | 'subscription' 
  | 'bundle' 
  | 'discount' 
  | 'partner_benefit' 
  | 'member_benefit' 
  | 'career_product'
  // E. Company Signals & Upvotes
  | 'company_ranking' 
  | 'company_upvote' 
  | 'trending_company' 
  | 'employer_popularity' 
  | 'employer_award' 
  | 'community_score' 
  | 'hiring_momentum' 
  | 'community_signal'
  // Backward compatibility aliases
  | 'accelerator' 
  | 'deal' 
  | 'pro_service' 
  | 'course' 
  | 'tool' 
  | 'product' 
  | 'venture' 
  | 'pitching';

export type OpportunityMonetizationType = 
  | 'organic' 
  | 'sponsored' 
  | 'partnership' 
  | 'affiliate' 
  | 'quest' 
  | 'membership' 
  | 'promotion' 
  | 'hybrid';

export type OpportunitySponsorshipBadge = 
  | 'organic'
  | 'sponsored' 
  | 'partner' 
  | 'featured' 
  | 'member_benefit';

export type OpportunityStatus = 'active' | 'upcoming' | 'closing_soon' | 'completed' | 'archived';

export interface ProgramMetadata {
  duration?: string; // e.g. "8 weeks", "12 weeks full-time"
  schedule?: string; // e.g. "Mon & Wed 6-9 PM PT", "Self-paced"
  deliveryMode?: 'Remote' | 'Hybrid' | 'In-Person' | 'Self-Paced' | 'Live Cohort';
  cost?: string; // e.g. "Free", "$1,200", "Income Share Agreement"
  isFree?: boolean;
  scholarship?: string; // e.g. "Scholarship Available", "Up to 100% Merit & Need"
  scholarshipAvailable?: boolean;
  certificate?: boolean | string; // e.g. "Certificate of Completion"
  careerOutcomes?: string[]; // e.g. ["Product Manager", "AI Product Specialist"]
  targetRoles?: string[]; // e.g. ["Product Manager", "Technical PM"]
  skillsGained?: string[];
  placementSupport?: string; // e.g. "1-on-1 Career Coaching & Hiring Partner Introductions"
  hiringPartners?: string[]; // e.g. ["Google", "Stripe", "OpenAI"]
  syllabusModules?: Array<{
    title: string;
    description?: string;
    duration?: string;
  }>;
}

export interface OpportunityQuestReward {
  questId: string;
  questTitle?: string;
  questAction: string; // e.g. "Complete application", "Submit project", "Activate offer"
  creditsReward: number; // e.g. 300, 500 Credits
  badgeReward?: string;
  xpReward?: number;
}

export interface OpportunityCommercial {
  opportunityId: string;
  partnerId?: string;
  partnerName?: string;
  campaignId?: string;
  monetizationType: OpportunityMonetizationType;
  sponsorshipStatus: OpportunitySponsorshipBadge;
  featuredStatus?: boolean;
  sponsoredPlacement?: boolean;
  affiliateUrl?: string;
  affiliateCommission?: string; // e.g. "15%" or "$25/sale"
  questId?: string;
  questAction?: string; // e.g. "Complete submission"
  membershipBenefitId?: string;
  membershipTierRequired?: 'free' | 'pro' | 'executive';
  rewardId?: string;
  rewardCredits?: number; // e.g. 500 Credits
  trackingId?: string;
}

export interface OpportunityCompanySignal {
  companyRanking?: number; // e.g. #12
  upvoteCount: number;
  trendingScore: number; // e.g. 96
  communityScore: number; // e.g. 4.8 / 5.0
  reviewCount?: number;
  employerPopularity?: 'Top 1%' | 'Top 5%' | 'Trending' | 'Rising Star';
  awards?: string[];
  hiringMomentum?: 'Aggressive' | 'Selective' | 'Steady' | 'Freezing';
  userHasUpvoted?: boolean;
}

export interface CareerOpportunity {
  id: string;
  title: string;
  type: OpportunityType;
  subtype: OpportunitySubtype;
  organization: string;
  organizationId?: string;
  organizationLogo?: string;
  description: string;
  shortDescription: string;
  status: OpportunityStatus;
  deadline?: string; // e.g. "2026-11-20" or "Nov 20, 2026" or "Rolling"
  startDate?: string;
  endDate?: string;
  location: string; // e.g. "Remote · Global" or "San Francisco, CA"
  isRemote: boolean;
  eligibility: string; // e.g. "Open to all software engineers and AI builders"
  requirements?: string[];
  skills: string[];
  industry: string; // e.g. "AI & Machine Learning", "Fintech", "Developer Tools"
  reward?: string; // e.g. "$10,000+ Prize Pool", "$50k Non-dilutive Grant", "30% Lifetime Discount"
  benefits?: string[];
  price?: string; // e.g. "$1,200", "Free"
  applicationUrl: string;
  sourceUrl?: string;
  image?: string;
  tags: string[];
  ctaText: string; // e.g. "Register", "Join Hackathon", "Apply for Grant", "Claim Offer", "Enroll", "Learn More", "Submit Pitch"
  commercial?: OpportunityCommercial;
  companySignal?: OpportunityCompanySignal;
  programMetadata?: ProgramMetadata;
  quest?: OpportunityQuestReward;
  matchScore?: number; // e.g. 94
  recommendationReason?: string; // e.g. "Matches your Product Manager + AI career path"
  personalizationMatch?: {
    matchPercentage: number;
    reason: string;
    matchedRoles?: string[];
    matchedSkills?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface TrackedRadarOpportunity {
  opportunityId: string;
  opportunity: CareerOpportunity;
  addedAt: string;
  deadline?: string;
  status: 'saved' | 'interested' | 'applied_joined' | 'registered' | 'completed' | 'in_progress';
  notes?: string;
  completionDate?: string;
  pinnedToDesk?: boolean;
}

// ==================================================
export * from './types/builderMatch';

// ==================================================
// CAREER MISSION & GROWTH LOOP TYPES
// ==================================================
export * from './types/careerMission';

// ==================================================
export * from './types/expertFeedback';

// ==================================================
// CAREEROS BETA BASELINE ACCESS & EXPOSURE CONFIG
// ==================================================
export * from './config/careerOsBaseline';

