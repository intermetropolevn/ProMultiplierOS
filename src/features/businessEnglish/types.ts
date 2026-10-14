// =========================================================================
// CAREER OS - BUSINESS ENGLISH WORKSPACE TYPES
// =========================================================================

export type BusinessEnglishTab = 
  | 'role_play'
  | 'vocabulary'
  | 'shadow_speaking'
  | 'topics'
  | 'domain_knowledge'
  | 'communication_patterns';

export type SeniorityLevel = 
  | 'Associate / Junior'
  | 'Mid-Level Specialist'
  | 'Senior Professional'
  | 'Lead / Principal'
  | 'Manager / Director'
  | 'Executive / VP';

export type ConversationPartnerRole = 
  | 'Manager'
  | 'Teammate / Peer'
  | 'Product Manager'
  | 'Engineering Lead'
  | 'External Client'
  | 'Cross-functional Stakeholder'
  | 'Executive Sponsor'
  | 'Recruiter / Talent Partner';

export type PracticeDifficulty = 
  | 'Foundational'
  | 'Intermediate'
  | 'Advanced'
  | 'Executive';

export type WorkplaceContext = 
  | 'Meetings & Syncs'
  | 'Presentations & Pitches'
  | 'Stakeholder Alignment'
  | 'Project Management & Delivery'
  | 'Conflict & Negotiation'
  | 'Technical Trade-offs'
  | 'Feedback & Performance'
  | 'Client & Commercial';

export interface BusinessEnglishScenario {
  id: string;
  title: string;
  situation: string;
  category: WorkplaceContext;
  partnerRole: ConversationPartnerRole;
  partnerName: string;
  partnerAvatarColor: string;
  partnerTitle: string;
  seniority: SeniorityLevel;
  difficulty: PracticeDifficulty;
  businessContext: string;
  learningObjectives: string[];
  initialMessage: string;
  suggestedPhrases: string[];
  expectedTone: string;
  domain?: string;
}

export interface RolePlayMessage {
  id: string;
  sender: 'partner' | 'user';
  text: string;
  timestamp: string;
  audioAvailable?: boolean;
  coachingFeedback?: {
    strength?: string;
    suggestion?: string;
    betterPhrasing?: string;
  };
}

export interface RolePlaySessionFeedback {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  completedAt: string;
  overallScore: number; // 0 - 100
  metrics: {
    englishAccuracy: number;
    naturalness: number;
    businessVocabulary: number;
    clarityConciseness: number;
    professionalTone: number;
    confidenceAssertiveness: number;
    communicationEffectiveness: number;
    domainTerminology: number;
  };
  strengths: string[];
  improvementAreas: string[];
  inContextAlternatives: {
    original: string;
    improved: string;
    why: string;
    toneCategory: 'More Natural' | 'Senior Executive' | 'Concise & Direct' | 'Diplomatic';
  }[];
  coachSummary: string;
  recommendedNextTopics: string[];
}

export interface VocabularyItem {
  id: string;
  term: string;
  meaning: string;
  businessContext: string;
  naturalUsage: string;
  relatedPhrases: string[];
  difficulty: PracticeDifficulty;
  domain: string;
  contextCategory: 
    | 'Meetings'
    | 'Presentations'
    | 'Stakeholder Management'
    | 'Project Management'
    | 'Product'
    | 'Engineering'
    | 'Marketing'
    | 'Sales'
    | 'Finance'
    | 'Strategy'
    | 'Workplace Communication';
  exampleSentences: string[];
  synonyms?: string[];
  isMastered?: boolean;
  isBookmarked?: boolean;
}

export interface UserVocabularySet {
  id: string;
  title: string;
  description: string;
  domainTag: string;
  terms: string[];
  exampleSentences: {
    term: string;
    sentence: string;
    context: string;
  }[];
  generatedDialogue?: {
    speaker: string;
    role: string;
    text: string;
    highlightedTerms: string[];
  }[];
  createdAt: string;
  lastPracticed?: string;
  isSyncedToProfile?: boolean;
}

export interface ShadowSpeakingLine {
  id: string;
  speaker: string;
  role: string;
  text: string;
  naturalGrouping: string[];
  stressWords: string[];
  pausePoints: string[];
  phoneticsHint?: string;
  audioSampleRate?: string;
}

export interface ShadowSpeakingLesson {
  id: string;
  title: string;
  topic: string;
  scenario: string;
  difficulty: PracticeDifficulty;
  durationSeconds: number;
  contextBackground: string;
  learningFocus: string;
  lines: ShadowSpeakingLine[];
}

export interface CommunicationPatternTier {
  text: string;
  tone: string;
  explanation: string;
  idealSituation: string;
}

export interface CommunicationPattern {
  id: string;
  situation: string;
  category: string;
  purpose: string;
  basic: CommunicationPatternTier;
  professional: CommunicationPatternTier;
  confident: CommunicationPatternTier;
  executive: CommunicationPatternTier;
  contextRationale: string;
  keyPrinciples: string[];
}

export interface BusinessTopic {
  id: string;
  title: string;
  category: string;
  shortContext: string;
  whyItMatters: string;
  keyVocabulary: string[];
  usefulPhrases: string[];
  discussionQuestions: string[];
  relatedScenarioId: string;
  relatedDomain: string;
  readTimeMinutes: number;
}

export interface DomainConcept {
  id: string;
  domain: 
    | 'Digital'
    | 'Product'
    | 'Technology'
    | 'Software Engineering'
    | 'AI & Machine Learning'
    | 'Data & Analytics'
    | 'Marketing'
    | 'Sales'
    | 'Business & Strategy'
    | 'Finance'
    | 'Operations';
  conceptName: string;
  plainEnglishExplanation: string;
  businessMeaning: string;
  commonWorkplaceUsage: string;
  relatedTerminology: string[];
  exampleSentences: string[];
  exampleMeetingUsage: string;
  relatedRoles: string[];
  relatedScenarioId?: string;
}

export interface MascotNudge {
  id: string;
  triggerContext: string;
  headline: string;
  tip: string;
  suggestedPhrasing?: string;
  encouragement: string;
}
