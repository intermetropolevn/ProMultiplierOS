// =========================================================================
// CAREER INTELLIGENCE ENGINE - CORE ARCHITECTURAL TYPES
// =========================================================================

import { SupportedLanguage } from '../types';
import { CapabilityLevel } from '../activation/types';
import { ResearchDepth, ResearchReportOutput } from './researchTypes';

/**
 * 20 Canonical Task Categories for Career OS
 */
export type CareerTaskType =
  | 'simple_qa'
  | 'retrieval'
  | 'classification'
  | 'summarization'
  | 'profile_analysis'
  | 'job_matching'
  | 'skill_gap_analysis'
  | 'career_recommendation'
  | 'case_analysis'
  | 'assessment'
  | 'interview_simulation'
  | 'learning'
  | 'company_research'
  | 'industry_research'
  | 'deep_research'
  | 'multi_step_execution'
  | 'data_analysis'
  | 'writing'
  | 'planning'
  | 'unknown';

export type TaskComplexity = 'low' | 'medium' | 'high' | 'very_high';
export type ComputeBudgetTier = 'low' | 'medium' | 'high' | 'maximum';

/**
 * TaskRouter Output Contract
 */
export interface TaskRouterDecision {
  taskType: CareerTaskType;
  complexity: TaskComplexity;
  requiresPlanning: boolean;
  requiresRetrieval: boolean;
  requiresTools: boolean;
  requiresResearch: boolean;
  requiresCode: boolean;
  requiresVerification: boolean;
  requiresLongTermMemory: boolean;
  computeBudget: ComputeBudgetTier;
  confidence: number;
  rationale: string;
  detectedEntities: string[];
  canonicalConcepts: string[];
  suggestedLevel: CapabilityLevel;
  suggestedResearchDepth?: ResearchDepth;
}

/**
 * Compute Budget Specification
 */
export interface ComputeBudgetLimits {
  tier: ComputeBudgetTier;
  maxTokens: number;
  maxToolCalls: number;
  maxSteps: number;
  maxLatencyMs: number;
  allowCandidateGeneration: boolean;
  maxRevisions: number;
  estimatedCostUsd: number;
}

/**
 * Model Router Selection
 */
export type ModelProfile = 
  | 'cheap_fast'      // e.g. Gemini Flash Lite / Mini
  | 'reasoning'       // e.g. Gemini 2.5 Flash / Pro with thinking
  | 'research'        // e.g. Gemini Pro Grounded
  | 'coding'          // e.g. Gemini Code Execution
  | 'embedding';      // Text Embedding 004

export interface ModelSelection {
  profile: ModelProfile;
  modelId: string;
  temperature: number;
  maxOutputTokens: number;
  reasoningEffort?: 'low' | 'medium' | 'high';
  enableSearchGrounding: boolean;
  enableCodeExecution: boolean;
  rationale: string;
}

/**
 * Career OS Entities for Context Assembly
 */
export interface CareerOSContextSnapshot {
  userProfile?: {
    targetRole?: string;
    targetDomain?: string;
    targetLevel?: string;
    currentSkills?: string[];
    readinessScore?: number;
  };
  jobs?: Array<{
    id: string;
    title: string;
    company: string;
    requiredSkills: string[];
    roleCategory: string;
  }>;
  cases?: Array<{
    id: string;
    title: string;
    companyType: string;
    sector: string;
    difficulty: string;
  }>;
  questions?: Array<{
    id: string;
    question: string;
    type: string;
    roleCategory: string;
  }>;
  evidenceLedger?: Array<{
    id: string;
    claim: string;
    evidenceText: string;
    confidence: number;
    skillTags: string[];
    verified: boolean;
  }>;
  activeApplication?: {
    jobId: string;
    companyName: string;
    roleTitle: string;
    status: string;
  };
  activePageModule?: string;
}

/**
 * Context Assembly Result from ContextEngine
 */
export interface AssembledContext {
  taskGoal: string;
  entitiesExtracted: Array<{ id: string; name: string; type: string }>;
  conceptsMapped: Array<{ raw: string; canonicalId: string; canonicalName: string }>;
  retrievedItems: Array<{
    id: string;
    type: string;
    title: string;
    content: string;
    relevanceScore: number;
    source: string;
  }>;
  userModelInferences: Array<InferredUserAttribute>;
  systemInstructions: string;
  tokenCountEstimate: number;
}

/**
 * Planning Engine Task Graph
 */
export interface PlanStep {
  id: string;
  objective: string;
  dependencies: string[];
  requiredTools: string[];
  expectedOutput: string;
  verificationCriteria: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  result?: any;
  error?: string;
  retryCount: number;
  durationMs?: number;
}

export interface StructuredPlanGraph {
  goal: string;
  complexity: TaskComplexity;
  steps: PlanStep[];
  executionStrategy: 'sequential' | 'dag_parallel';
  estimatedDurationMs: number;
  status: 'planned' | 'executing' | 'completed' | 're-planning' | 'failed';
  replanCount: number;
}

/**
 * Tool Runtime Contracts
 */
export type ToolCategory = 
  | 'career_os_data'
  | 'search'
  | 'web_research'
  | 'calculator'
  | 'code_execution'
  | 'document_retrieval'
  | 'structured_data_processing';

export interface ToolDefinition {
  name: string;
  description: string;
  category: ToolCategory;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  permissions: string[];
  riskLevel: 'safe' | 'read_only' | 'idempotent' | 'mutative';
  cost: 'none' | 'low' | 'medium' | 'high';
  timeoutMs: number;
  handler: (args: any, context?: any) => Promise<any>;
}

export interface ToolCallRecord {
  callId: string;
  toolName: string;
  inputArgs: any;
  outputResult?: any;
  error?: string;
  status: 'success' | 'failed' | 'timeout';
  executionTimeMs: number;
  costTokens?: number;
}

/**
 * Code Execution Sandbox Contract
 */
export interface CodeExecutionRequest {
  code: string;
  language: 'javascript' | 'python' | 'expression';
  inputData?: Record<string, any>;
  timeoutMs?: number;
}

export interface CodeExecutionResult {
  success: boolean;
  output: any;
  logs: string[];
  executionTimeMs: number;
  error?: string;
}

/**
 * Memory Engine Contracts (4 Classes)
 */
export interface SemanticMemoryItem {
  id: string;
  conceptId: string;
  canonicalName: string;
  definitionEn: string;
  definitionVi: string;
  domain: string;
  tags: string[];
  confidence: number;
  updatedAt: string;
}

export interface EpisodicMemoryItem {
  id: string;
  taskId: string;
  timestamp: string;
  userPrompt: string;
  taskType: CareerTaskType;
  complexity: TaskComplexity;
  planSummary?: string;
  successfulOutcome: boolean;
  finalAnswerSummary: string;
  verifiedScore: number;
  trajectoryId: string;
}

export interface ProceduralMemoryItem {
  id: string;
  patternName: string;
  taskType: CareerTaskType;
  stepSequence: string[];
  successfulRunsCount: number;
  averageScore: number;
  applicableConditions: string[];
}

/**
 * Inferred User Model (Strictly distinct from raw profile facts)
 * Rule: Claim + Evidence + Confidence + Timestamp + Source
 */
export interface InferredUserAttribute {
  id: string;
  claim: string;
  dimension: 'strength' | 'weakness' | 'preference' | 'behavior_pattern' | 'recurring_gap';
  skillId?: string;
  evidence: string;
  confidence: number; // 0.0 - 1.0 (Only claims >= 0.70 used as high-confidence)
  timestamp: string;
  source: 'case_submission' | 'interview_answer' | 'assessment_rubric' | 'user_feedback' | 'code_review';
  isStale?: boolean;
}

// Re-export specialized Research Engine contracts
export * from './researchTypes';

/**
 * Research Engine Contracts (Level 4 Deep Research)
 */
export interface ResearchSourceItem {
  id: string;
  title: string;
  url: string;
  authorOrPublisher: string;
  publishedDate?: string;
  credibilityScore: number; // 0.0 - 1.0
  keyClaims: string[];
  domainRelevance: number;
}

export interface ResearchSynthesisReport {
  query: string;
  sourcesCollected: ResearchSourceItem[];
  keyFindings: string[];
  conflictingViewpoints: Array<{
    topic: string;
    viewpointA: { source: string; claim: string };
    viewpointB: { source: string; claim: string };
    resolution: string;
  }>;
  evidenceQuotes: Array<{ quote: string; sourceUrl: string; sourceTitle: string }>;
  synthesisSummary: string;
  citationConfidence: number;
}

/**
 * Verifier Engine Contracts (11 Quality Categories)
 */
export type VerifierCategory =
  | 'factual_correctness'
  | 'source_correctness'
  | 'citation_validity'
  | 'logical_consistency'
  | 'numerical_correctness'
  | 'task_completion'
  | 'rubric_compliance'
  | 'career_relevance'
  | 'evidence_grounding'
  | 'hallucination_detection'
  | 'language_quality';

export interface VerifierIssue {
  category: VerifierCategory;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  suggestedCorrection: string;
}

export interface VerifierResult {
  passed: boolean;
  score: number; // 0.0 - 1.0
  issues: VerifierIssue[];
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  needsRevision: boolean;
  detailsByCategory: Record<VerifierCategory, { score: number; passed: boolean; note?: string }>;
  verifiedAt: string;
}

/**
 * Evaluation Engine Contracts (Answer + Trajectory)
 */
export interface TrajectoryEvaluation {
  taskId: string;
  overallScore: number; // 0 - 100
  metrics: {
    taskSuccess: number; // 0 - 100
    correctness: number;
    groundedness: number;
    citationQuality: number;
    planningQuality: number;
    toolUseAccuracy: number;
    recoveryRate: number;
    verificationPassRate: number;
    efficiency: number;
    latencyScore: number;
    costEfficiency: number;
  };
  milestoneAccomplishments: Array<{
    milestone: string;
    achieved: boolean;
    note: string;
  }>;
  evaluationSummary: string;
}

/**
 * Feedback Engine Contracts
 */
export type FeedbackSource = 
  | 'user_rating' 
  | 'user_correction' 
  | 'assessment_rubric' 
  | 'interview_transcript' 
  | 'application_outcome' 
  | 'case_evaluator' 
  | 'verifier_auto' 
  | 'career_milestone';

export interface NormalizedFeedback {
  id: string;
  targetId: string;
  targetType: 'agent_output' | 'plan_step' | 'tool_call' | 'user_inference' | 'application';
  feedbackType: 'positive' | 'correction' | 'complaint' | 'factual_dispute' | 'outcome_success' | 'outcome_rejection';
  severity: 'info' | 'minor' | 'moderate' | 'major';
  signal: string;
  evidence: string;
  source: FeedbackSource;
  confidence: number;
  timestamp: string;
}

/**
 * Learning Engine (9 Levels of Optimization)
 */
export type LearningOptimizationLevel =
  | 'L1_prompt_optimization'
  | 'L2_retrieval_optimization'
  | 'L3_context_optimization'
  | 'L4_tool_selection_optimization'
  | 'L5_planning_optimization'
  | 'L6_memory_optimization'
  | 'L7_model_routing_optimization'
  | 'L8_compute_budget_optimization'
  | 'L9_fine_tuning_candidate';

export interface OptimizationRecord {
  id: string;
  level: LearningOptimizationLevel;
  triggerSignal: string;
  hypothesis: string;
  baselineMetrics: { passRate: number; latencyMs: number; tokenCost: number };
  proposedAdjustment: string;
  benchmarkStatus: 'pending' | 'passed_benchmark' | 'rejected';
  benchmarkDelta?: { passRateDelta: number; latencyDelta: number };
  appliedAt?: string;
}

/**
 * Trajectory Logger Contract (Comprehensive Replay & Audit)
 */
export interface AgentTrajectoryRecord {
  runId: string;
  timestamp: string;
  task: {
    rawPrompt: string;
    pageModule?: string;
    userGoal?: string;
  };
  routerDecision: TaskRouterDecision;
  computeBudget: ComputeBudgetLimits;
  modelSelection: ModelSelection;
  contextSnapshot: {
    retrievedItemsCount: number;
    entitiesDetected: string[];
    userInferencesApplied: number;
  };
  plan?: StructuredPlanGraph;
  executionSteps: Array<{
    stepNumber: number;
    actionType: 'retrieve' | 'plan' | 'tool_call' | 'code_exec' | 'research' | 'generate' | 'verify' | 'revise';
    description: string;
    toolCall?: ToolCallRecord;
    codeExec?: CodeExecutionResult;
    observationSummary: string;
    durationMs: number;
  }>;
  revisions: Array<{
    attempt: number;
    issuesFound: string[];
    remedyApplied: string;
    newVerificationScore: number;
  }>;
  verificationResult: VerifierResult;
  evaluationResult?: TrajectoryEvaluation;
  feedbacksReceived: NormalizedFeedback[];
  finalOutput: {
    text: string;
    sources: string[];
    confidence: number;
    nextRecommendedAction?: string;
  };
  runtimeStats: {
    totalDurationMs: number;
    totalTokensUsed: number;
    toolCallsCount: number;
    costEstimatedUsd: number;
    finalStatus: 'success' | 'revised_success' | 'partial' | 'failed';
  };
  diagnosticAnswers?: TenDiagnosticAnswers;
}

// =========================================================================
// SELF-IMPROVEMENT LOOP CONTRACTS & TAXONOMY (SECTIONS 1 - 15)
// =========================================================================

/**
 * 17-Type Comprehensive Failure Taxonomy (Section 3)
 */
export type CareerFailureType =
  | 'retrieval_failure'
  | 'context_failure'
  | 'planning_failure'
  | 'reasoning_failure'
  | 'tool_selection_failure'
  | 'tool_execution_failure'
  | 'memory_failure'
  | 'hallucination'
  | 'citation_failure'
  | 'verification_failure'
  | 'communication_failure'
  | 'task_interpretation_failure'
  | 'insufficient_information'
  | 'overthinking'
  | 'underthinking'
  | 'cost_inefficiency'
  | 'latency_inefficiency';

/**
 * Independent Verifiers (Section 4)
 */
export type IndependentVerifierName =
  | 'FactualVerifier'
  | 'CitationVerifier'
  | 'LogicVerifier'
  | 'NumericalVerifier'
  | 'TaskVerifier'
  | 'RubricVerifier'
  | 'CareerRelevanceVerifier'
  | 'EvidenceVerifier';

export interface SingleVerifierOutput {
  verifierName: IndependentVerifierName;
  passed: boolean;
  score: number; // 0.0 - 1.0
  confidence: number; // 0.0 - 1.0
  issues: VerifierIssue[];
  primaryFailureType?: CareerFailureType;
  details: string;
}

export interface VerifierAggregatorResult extends VerifierResult {
  independentOutputs: Record<IndependentVerifierName, SingleVerifierOutput>;
  primaryFailureType?: CareerFailureType;
  secondaryFailureTypes: CareerFailureType[];
  confidence: number;
  finalDecision: 'pass' | 'remedy_needed' | 'hard_fail';
}

/**
 * Improvement Target Layers (Section 7)
 */
export type ImprovementTargetLayer =
  | 'Prompt'
  | 'Retrieval'
  | 'Context'
  | 'Memory'
  | 'Planning'
  | 'Tool_selection'
  | 'Model_routing'
  | 'Compute_allocation'
  | 'Verifier'
  | 'Fine_tuning_RL_candidate';

/**
 * Failure Diagnosis Contract (Section 3, 5, 7)
 */
export interface FailureDiagnosis {
  runId: string;
  hasFailure: boolean;
  primaryFailureType?: CareerFailureType;
  secondaryFailureTypes: CareerFailureType[];
  rootCauseAnalysis: string;
  affectedStepIndices: number[];
  canTargetedSelfCorrect: boolean;
  targetedLayer: ImprovementTargetLayer;
  recommendedRevisionAction: string;
  confidence: number;
}

/**
 * Evaluation Dataset Item & Partitions (Section 8)
 */
export type DatasetPartition = 'train' | 'validation' | 'test' | 'regression' | 'hard_cases';

export interface EvaluationDatasetExample {
  id: string;
  task: string;
  input: string;
  context: string;
  expectedProperties: string[];
  trajectoryId: string;
  trajectorySummary: string;
  finalOutput: string;
  verifierScore: number;
  humanFeedback?: string;
  outcome: 'success' | 'partial' | 'failure';
  failureType?: CareerFailureType;
  partition: DatasetPartition;
  tags: string[];
  createdAt: string;
}

/**
 * Agent Benchmark Types (Section 9)
 */
export type BenchmarkCategory =
  | 'retrieval'
  | 'job_matching'
  | 'skill_gap_analysis'
  | 'case_solving'
  | 'interview_evaluation'
  | 'career_planning'
  | 'company_research'
  | 'deep_research'
  | 'long_horizon';

export interface BenchmarkMetrics {
  success: number; // 0 - 100
  correctness: number;
  groundedness: number;
  evidenceQuality: number;
  planningQuality: number;
  toolUse: number;
  recovery: number;
  efficiency: number;
  cost: number;
  latency: number;
}

export interface BenchmarkTestCase {
  id: string;
  name: string;
  category: BenchmarkCategory;
  prompt: string;
  expectedKeyTerms: string[];
  expectedTools: string[];
  maxTokens: number;
  maxDurationMs: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

/**
 * Long-Horizon Evaluation Milestones (Section 10)
 */
export interface LongHorizonMilestone {
  milestoneId: string;
  name: string;
  order: number;
  expectedDeliverable: string;
  achieved: boolean;
  score: number; // 0 - 100
  evidence: string;
  durationMs: number;
}

/**
 * Test-Time Candidate Generation & Critic (Section 11)
 */
export interface CandidateGeneration {
  candidateId: string;
  label: string; // 'Candidate A' | 'Candidate B' | 'Candidate C'
  text: string;
  criticScore: number;
  verifierScore: number;
  criticStrengths: string[];
  criticWeaknesses: string[];
  rank: number;
  selected: boolean;
  revisedText?: string;
}

/**
 * Regression Suite & Gatekeeper Policy (Section 12, 14)
 */
export interface RegressionSuiteComparison {
  suiteId: string;
  timestamp: string;
  baselineAgentVersion: string;
  candidateAgentVersion: string;
  currentAgentScore: number;
  candidateAgentScore: number;
  metricsDelta: {
    successDelta: number;
    correctnessDelta: number;
    groundednessDelta: number;
    citationDelta: number;
    hallucinationDelta: number; // Must NOT increase (delta <= 0)
    costDeltaPct: number; // Must not exceed +15%
    latencyDeltaPct: number; // Must not exceed +15%
  };
  passedCriticalChecks: boolean;
  gatekeeperDecision: 'approved_for_deployment' | 'rejected_critical_regression' | 'rejected_hallucination_increase' | 'rejected_cost_latency_drift';
  decisionRationale: string;
}

/**
 * 10 Canonical Diagnostic Questions Answers (Section 15)
 */
export interface TenDiagnosticAnswers {
  taskDescription: string;
  contextUsed: {
    itemCount: number;
    sources: string[];
    entities: string[];
    userInferences: string[];
  };
  toolsUsed: {
    toolNames: string[];
    successCount: number;
    failureCount: number;
  };
  planSteps: {
    total: number;
    steps: Array<{ index: number; objective: string; status: string }>;
  };
  failedSteps: Array<{ index: number; description: string; error?: string }>;
  verifierFindings: {
    overallScore: number;
    passed: boolean;
    issuesFound: string[];
    failedVerifiers: string[];
  };
  failureReason: {
    primaryTaxonomy: CareerFailureType | 'none';
    rootCause: string;
  };
  userFeedback: {
    hasFeedback: boolean;
    signals: string[];
    type?: string;
  };
  taskSuccess: {
    isSuccess: boolean;
    status: 'success' | 'revised_success' | 'partial' | 'failed';
    overallQualityScore: number;
  };
  improvementOpportunity: {
    targetLayer: ImprovementTargetLayer;
    concreteProposal: string;
  };
}

/**
 * Unified Public Interface Input & Output (Section 20)
 */
export interface CareerIntelligenceRequest {
  task: string;
  context?: CareerOSContextSnapshot;
  mode?: 'auto' | 'quick' | 'standard' | 'deep_analysis' | 'deep_research';
  computeBudget?: ComputeBudgetTier;
  tools?: string[];
  research?: boolean;
  verification?: 'none' | 'lightweight' | 'rigorous';
  targetEntityId?: string;
  metadata?: Record<string, any>;
}

export interface CareerIntelligenceResponse {
  success: boolean;
  result: string;
  taskType: CareerTaskType;
  complexity: TaskComplexity;
  levelActivated: CapabilityLevel;
  confidence: number;
  sources: Array<{ title: string; urlOrId: string; snippet: string }>;
  actionsTaken: string[];
  verificationResult: VerifierResult;
  researchReport?: ResearchReportOutput;
  nextRecommendedAction?: string;
  trajectoryId: string;
  stats: {
    durationMs: number;
    tokensUsed: number;
    toolCallsMade: number;
    revisionsMade: number;
  };
}
