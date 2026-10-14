import { 
  RoleCategory, 
  SectorDomain, 
  ExperienceLevel, 
  InterviewQuestion 
} from '../../types';

export type { 
  RoleCategory, 
  SectorDomain, 
  ExperienceLevel, 
  InterviewQuestion 
};

import type { 
  SpeakerRole, 
  DetectedLanguage, 
  SpeechState, 
  TranscriptChunk 
} from './speech/types';

export type { 
  SpeakerRole, 
  DetectedLanguage, 
  SpeechState, 
  TranscriptChunk 
};

export type { 
  RealtimeSpeechState,
  SpeechLanguageDetails,
  LanguageProportions,
  WordTimestamp,
  SpeechTimeline,
  RealtimeTranscriptEvent,
  TranscriptSubscriber,
  StateSubscriber,
  SpeechProviderType,
  SpeechProviderInfo,
  SpeechErrorDetails
} from './speech/types';

export interface Utterance {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  speaker: SpeakerRole;
  language: DetectedLanguage | string;
  confidence: number;
  isQuestion: boolean;
}

export type EvidenceType = 
  | 'project' 
  | 'experience' 
  | 'story' 
  | 'decision' 
  | 'incident' 
  | 'achievement';

export interface CandidateEvidence {
  id: string;
  title: string;
  type: EvidenceType;
  description: string;
  role: RoleCategory;
  domains: SectorDomain[];
  skills: string[];
  metrics: string[];
  keywords: string[];
  source: string;
  confidence: number;
  relatedQuestions: string[];
}

export interface AnswerBlueprint {
  id: string;
  questionId?: string;
  evidenceIds: string[];
  framework: string; // e.g., 'STAR-T (Situation, Task, Action, Trade-off, Result)'
  opening: string;
  situation: string;
  task: string;
  action: string[];
  tradeoffs: string[];
  result: string[];
  metrics: string[];
  mustMention: string[];
  avoid: string[];
  targetDuration: string;
}

export type MatchCategory = 'STRONG MATCH' | 'RELATED MATCH' | 'NO STRONG MATCH';

export interface RelatedMatchItem {
  question: InterviewQuestion;
  confidence: number;
  intent: string;
}

export interface RelevantExperienceItem {
  evidence: CandidateEvidence;
  confidence: number;
  relevanceReason: string;
  relevancePct?: number;
  hasMetrics?: boolean;
  metricPriorityApplied?: boolean;
  metricPriorityReason?: string;
}

export interface AnswerCoverageItem {
  element: 'Situation' | 'Task' | 'Action' | 'Trade-off' | 'Result' | 'Metric';
  status: 'covered' | 'warning';
  label: string;
  symbol: '✓' | '⚠';
  detail?: string;
}

export interface AnswerCoverageStatus {
  items: AnswerCoverageItem[];
  hasBlueprint: boolean;
  isPreparationOnly: true;
  summary: string;
  missingElements: string[];
}

export interface DetectedQuestionResult {
  rawText: string;
  isQuestion: boolean;
  semanticIntent: string; // e.g. 'stakeholder_conflict', 'ambiguity_decision'
  intentLabel: string; // e.g. 'Stakeholder Conflict'
  competencies: string[]; // e.g. ['stakeholder management', 'communication', 'leadership']
  roleCategory?: RoleCategory;
  domain?: SectorDomain;
  matchedQuestion?: InterviewQuestion;
  matchConfidence: number; // 0.0 - 1.0
  matchCategory: MatchCategory;
  relatedMatches: RelatedMatchItem[];
  relatedIntents?: string[];
  candidateEvidence?: CandidateEvidence[];
  relevantExperienceList?: RelevantExperienceItem[];
  bestStory?: CandidateEvidence;
  answerBlueprint?: AnswerBlueprint;
  answerCoverage?: AnswerCoverageStatus;
  keyPoints: string[];
  answerDirection?: string[];
  detectedLanguage: DetectedLanguage;
  processedAt: number;
  retrievalMatchState?: 'Strong Match' | 'Related Match' | 'No Strong Match';
  matchReason?: string;
  metricPriorityApplied?: boolean;
  metricPriorityMessage?: string;
  contextState?: {
    isFollowUp: boolean;
    parentQuestionId?: string;
    followUpType?: string;
    questionSequence: number;
    conversationContext: string;
    relatedToIntent?: string;
  };
}

export type InterviewMode = 'mock' | 'live_intelligence';
