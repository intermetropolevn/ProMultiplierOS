// =========================================================================
// CAREER OS - CAPABILITY ACTIVATION & TRIGGER ENGINE TYPES
// =========================================================================

import { ParsedCareerIntent, SupportedLanguage } from '../types';

/**
 * The 5 Intelligence Capability Levels
 */
export type CapabilityLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

/**
 * Non-technical user-facing mode titles (Rule #10)
 */
export type UserFacingMode = 
  | 'Quick'           // L0: Direct LLM (Rewrite, simple Q&A, explain)
  | 'Standard'        // L1: Contextual Intelligence (Profile, Skills, Job Match)
  | 'Deep Analysis'   // L2/L3: Agentic Multi-Step Analysis & Verification
  | 'Deep Research';  // L4: Maximum Compute Multi-Source Web & Market Research

/**
 * User manual override preference
 */
export type UserOverrideMode = 'auto' | 'quick' | 'standard' | 'deep_analysis' | 'deep_research';

/**
 * 13 Trigger Signals evaluated to determine activation score (0 - 100 each)
 */
export interface TriggerSignals {
  /** Intrinsic cognitive complexity of the reasoning required */
  complexity: number;
  /** Number of sequential dependent steps required */
  number_of_steps: number;
  /** Need for fresh external/industry/company data */
  external_information_required: number;
  /** Career decision impact/stakes (salary, offer, strategic pivot) */
  career_impact: number;
  /** Ambiguity, missing variables, or conflicting premises */
  uncertainty: number;
  /** Reliance on user profile, CV, portfolio, past performance */
  personal_context_required: number;
  /** Need to execute specialized computational tools or schema parsers */
  tool_requirement: number;
  /** Quantitative analysis, financial modeling, or case exhibits */
  data_analysis_required: number;
  /** Deep market, competitor, or organizational landscape exploration */
  research_requirement: number;
  /** Prior failure or low-score attempt in current session */
  previous_failure: number;
  /** Verification failure in preceding loop stage */
  verification_failure: number;
  /** User's explicit intent or depth selection */
  user_requested_depth: number;
  /** Real-time market volatility or urgent upcoming deadline */
  time_sensitivity: number;
}

/**
 * Independent capability activation matrix (Rule #4)
 * Capabilities are activated individually, not simply as a monolithic tier.
 */
export interface ActivatedCapabilities {
  /** Internal semantic retrieval from Career OS knowledge graph & evidence ledger */
  retrieval: boolean;
  /** Multi-phase goal planning and dynamic DAG execution */
  planning: boolean;
  /** Access to episodic user history and procedural memory */
  memory: boolean;
  /** Execution of specialized tools (calculators, parsers, validators) */
  tools: boolean;
  /** Code execution or mathematical simulation sandbox */
  code: boolean;
  /** Standard secondary research */
  research: boolean;
  /** Exhaustive multi-source web, competitor, and market research */
  deepResearch: boolean;
  /** Quality verification level applied before finalizing answer */
  verification: 'none' | 'lightweight' | 'rigorous';
  /** Generation and ranking of multiple competing candidate hypotheses */
  multipleCandidates: boolean;
  /** Meta-cognitive self-reflection and weakness diagnosis */
  reflection: boolean;
}

/**
 * System events that trigger intelligence workflows (Rule #5)
 */
export type SystemEventType =
  | 'JOB_OPENED'
  | 'JOB_SAVED'
  | 'JOB_APPLIED'
  | 'CASE_STARTED'
  | 'CASE_SUBMITTED'
  | 'ASSESSMENT_COMPLETED'
  | 'INTERVIEW_STARTED'
  | 'INTERVIEW_COMPLETED'
  | 'FEEDBACK_RECEIVED'
  | 'SKILL_UPDATED'
  | 'NEW_EVIDENCE_ADDED'
  | 'NEW_RESOURCE_ADDED'
  | 'CAREER_GOAL_CHANGED'
  | 'RESEARCH_REQUESTED'
  | 'APPLICATION_STATUS_CHANGED';

/**
 * Payload carried by a system event trigger
 */
export interface SystemEventPayload {
  eventType: SystemEventType;
  jobId?: string;
  company?: string;
  role?: string;
  caseId?: string;
  assessmentId?: string;
  submissionText?: string;
  score?: number | string;
  evaluatorFeedback?: string;
  skills?: string[];
  interviewTranscript?: string;
  statusChange?: { from: string; to: string };
  metadata?: Record<string, any>;
}

/**
 * Compute Budget allocation strictly limiting token spend and execution bounds
 */
export interface ComputeBudget {
  maxTokens: number;
  maxToolCalls: number;
  maxSteps: number;
  maxLatencyMs: number;
  costTier: 'minimal' | 'low' | 'medium' | 'high' | 'maximum';
}

/**
 * Escalation trail record
 */
export interface EscalationRecord {
  fromLevel: CapabilityLevel;
  toLevel: CapabilityLevel;
  trigger: 'verifier_confidence_low' | 'tool_failure' | 'insufficient_evidence' | 'user_override';
  confidence: number;
  reason: string;
  timestamp: string;
}

/**
 * De-escalation trail record (Rule #8)
 */
export interface DeEscalationRecord {
  fromLevel: CapabilityLevel;
  toLevel: CapabilityLevel;
  trigger: 'evidence_sufficient' | 'simple_resolution' | 'memory_hit';
  reason: string;
  timestamp: string;
}

/**
 * Comprehensive Activation Decision Audit Record (Rule #12)
 */
export interface ActivationDecision {
  id: string;
  timestamp: string;
  inputType: 'USER_PROMPT' | 'SYSTEM_EVENT';
  rawInput: string;
  eventPayload?: SystemEventPayload;
  detectedIntent: string;
  detectedLanguage: SupportedLanguage;
  complexityScore: number; // 0 - 100
  signals: TriggerSignals;
  activationScore: number; // 0 - 100
  selectedLevel: CapabilityLevel;
  userFacingMode: UserFacingMode;
  activatedCapabilities: ActivatedCapabilities;
  decisionReason: string;
  computeBudget: ComputeBudget;
  escalations: EscalationRecord[];
  deEscalations: DeEscalationRecord[];
  userOverrideApplied?: UserOverrideMode;
  episodicMemoryHit?: {
    hit: boolean;
    cachedKey?: string;
    previousOutcome?: string;
  };
  executionState: 'decided' | 'running' | 'completed' | 'failed';
  executionLogs: {
    phase: string;
    detail: string;
    status: 'ok' | 'escalated' | 'deescalated' | 'warning';
    timestamp: string;
  }[];
  finalOutcome?: {
    summary: string;
    evidenceCount?: number;
    skillsEvaluated?: string[];
    followUpOffer?: string; // e.g. for JOB_SAVED: "Research sâu hơn về company / market?"
    tokensUsed?: number;
    durationMs?: number;
  };
}

/**
 * Acceptance Test Definition for verification against user specifications (Rule #11)
 */
export interface AcceptanceTestDefinition {
  id: string; // 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
  name: string;
  prompt: string;
  expectedLevel: CapabilityLevel;
  expectedMode: UserFacingMode;
  description: string;
  scenarioType: 'user_prompt' | 'override' | 'escalation' | 'deescalation' | 'memory' | 'mixed_lang';
  override?: UserOverrideMode;
  simulateVerifierFailure?: boolean;
  simulateEvidenceSufficientEarly?: boolean;
  isRepeatedTask?: boolean;
}

export interface AcceptanceTestResult {
  testId: string;
  name: string;
  prompt: string;
  expectedLevel: CapabilityLevel;
  actualLevel: CapabilityLevel;
  expectedMode: UserFacingMode;
  actualMode: UserFacingMode;
  passed: boolean;
  score: number;
  notes: string;
  decision: ActivationDecision;
}
