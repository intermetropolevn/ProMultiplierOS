export type ExpertHelpType = 
  | 'review_work'
  | 'challenge_thinking'
  | 'career_advice'
  | 'technical_expertise'
  | 'practice_coaching'
  | 'build_with_me';

export type ExpertMode = 
  | 'mentor'
  | 'coach'
  | 'reviewer'
  | 'advisor'
  | 'practitioner'
  | 'specialist'
  | 'builder';

export type FeedbackFormat = 'async' | 'session_30' | 'session_60';

export type FocusArea = 
  | 'problem_framing'
  | 'product_thinking'
  | 'strategy'
  | 'ux'
  | 'technical_feasibility'
  | 'business_impact'
  | 'communication'
  | 'prioritization'
  | 'interview_performance';

export interface FeedbackContext {
  careerGoal: string;
  targetRole: string;
  roleBlueprintId?: string;
  relevantCapability: string;
  workSubmittedTitle: string;
  workSubmittedContent: string;
  sourceType: 'practice' | 'mission' | 'build' | 'evidence' | 'readiness';
  sourceId?: string;
  readinessScore: number;
  knownSkillGaps: string[];
}

export interface ExpertProfile {
  id: string;
  name: string;
  avatar?: string;
  handle: string;
  role: string;
  company: string;
  location: string;
  timezone: string;
  modes: ExpertMode[];
  matchScore: number; // e.g. 92%
  skills: string[];
  domains: string[];
  experienceYears: number;
  pastCompanies: string[];
  evidenceHighlights: string[];
  whyRecommended: string;
  feedbackFormats: FeedbackFormat[];
  availabilityNote: string;
  verifiedValidationCount: number;
}

export interface AIReviewEvaluation {
  strengths: string[];
  gaps: string[];
  recommendedImprovement: string;
  capabilityAssessment: {
    capability: string;
    score: number;
  };
  recommendationNote: string;
  shouldSeekHumanExpert: boolean;
  humanExpertRationale: string;
}

export interface FeedbackIteration {
  iterationNumber: number;
  submittedAnswer: string;
  score: number;
  date: string;
  deltaSummary?: string;
}

export interface FollowUpMessage {
  id: string;
  sender: 'user' | 'expert';
  senderName: string;
  content: string;
  timestamp: string;
}

export interface FeedbackRequest {
  id: string;
  userId: string;
  helpType: ExpertHelpType;
  context: FeedbackContext;
  selectedFocusAreas: FocusArea[];
  feedbackFormat: FeedbackFormat;
  expertId?: string;
  expertName?: string;
  status: 'waiting_for_expert' | 'in_review' | 'feedback_delivered' | 'completed';
  submittedAt: string;
  deadline?: string;
  privacyShared: {
    practiceResponse: boolean;
    careerGoal: boolean;
    targetRole: boolean;
    relevantCapability: boolean;
    fullCareerProfile: boolean;
    otherCareerEvidence: boolean;
    currentApplications: boolean;
  };
  aiReview?: AIReviewEvaluation;
  expertFeedback?: {
    expertId: string;
    expertName: string;
    overallAssessment: string;
    whatWorked: string[];
    whatCouldImprove: string[];
    expertRecommendation: string;
    suggestedNextStep: 'improve_work' | 'apply_feedback' | 'find_build' | 'create_evidence';
    scoreBefore: number;
    scoreAfter: number;
    deliveredAt: string;
    verifiedValidationBadge: boolean;
    recommendedResources?: Array<{
      id: string;
      title: string;
      type: string;
      url?: string;
    }>;
  };
  iterations?: FeedbackIteration[];
  followUpMessages?: FollowUpMessage[];
}

export interface CreateFeedbackPayload {
  helpType: ExpertHelpType;
  context: FeedbackContext;
  selectedFocusAreas: FocusArea[];
  feedbackFormat: FeedbackFormat;
  expertId?: string;
  expertName?: string;
  deadline?: string;
  privacyShared?: {
    practiceResponse: boolean;
    careerGoal: boolean;
    targetRole: boolean;
    relevantCapability: boolean;
    fullCareerProfile: boolean;
    otherCareerEvidence: boolean;
    currentApplications: boolean;
  };
}
