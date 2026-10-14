// =========================================================================
// CAREER INTELLIGENCE ENGINE - RESEARCH CAPABILITY TYPES
// =========================================================================

/**
 * Adaptive Research Depth levels
 * Simple question -> NO research or quick_lookup. Never run deep research blindly.
 */
export type ResearchDepth = 'quick_lookup' | 'standard_research' | 'deep_research';

/**
 * Source quality criteria evaluated for every source
 * Rule: Never consider all search results of equal value.
 */
export interface SourceQualityCriteria {
  /** Domain reputation, institutional backing, peer recognition (0.0 - 1.0) */
  authority: number;
  /** Publication freshness, freshness decay curve (0.0 - 1.0) */
  recency: number;
  /** Primary disclosure vs secondary summary vs hearsay (0.0 - 1.0) */
  directness: number;
  /** Unbiased third-party vs sponsored corporate PR (0.0 - 1.0) */
  independence: number;
  /** Presence of verifiable empirical numbers, methodologies, citations (0.0 - 1.0) */
  evidenceQuality: number;
  /** Semantic & contextual alignment with research question and sub-questions (0.0 - 1.0) */
  relevance: number;
  /** Weighted composite quality score (0.0 - 1.0) */
  compositeScore: number;
  /** Brief explanation of quality rating */
  rationale: string;
}

export type SourceType =
  | 'official_doc'
  | 'financial_filing'
  | 'tech_radar'
  | 'verified_salary_index'
  | 'industry_report'
  | 'peer_review'
  | 'news_analysis'
  | 'community_discussion';

/**
 * Individual extracted claim traced to a source
 */
export interface ExtractedClaim {
  id: string;
  claim: string;
  sourceId: string;
  category: 'factual' | 'numerical' | 'strategic' | 'cultural' | 'compensation' | 'sentiment';
  confidence: number;
  quote: string;
  numericalValue?: number;
  unit?: string;
  careerEntityTag: string; // e.g. 'company', 'role', 'skill', 'compensation'
}

/**
 * Ranked and evaluated source
 */
export interface RankedSource {
  id: string;
  title: string;
  url: string;
  authorOrPublisher: string;
  publishedDate: string;
  sourceType: SourceType;
  quality: SourceQualityCriteria;
  extractedClaims: ExtractedClaim[];
  rawSnippet: string;
  // Backward compatibility with ResearchSourceItem
  credibilityScore: number;
  domainRelevance: number;
  keyClaims: string[];
}

/**
 * Conflict detection record
 * Rule: When sources conflict, preserve both claims, compare quality, explain uncertainty.
 * Never choose a claim simply because it was repeated multiple times.
 */
export interface ConflictRecord {
  id: string;
  topic: string;
  claimA: {
    claim: string;
    sourceId: string;
    sourceTitle: string;
    qualityScore: number;
    date: string;
  };
  claimB: {
    claim: string;
    sourceId: string;
    sourceTitle: string;
    qualityScore: number;
    date: string;
  };
  natureOfConflict:
    | 'contradictory_numbers'
    | 'divergent_trends'
    | 'differing_cultural_reports'
    | 'dated_vs_recent'
    | 'methodology_difference';
  sourceComparison: string;
  explanationOfUncertainty: string;
  recommendedStance: string;
  preservedClaims: string[];
}

/**
 * Research Planner configuration
 * Created BEFORE search is performed
 */
export interface ResearchPlan {
  goal: string;
  depth: ResearchDepth;
  researchQuestion: string;
  subQuestions: string[];
  requiredEvidence: string[];
  sourceTypes: SourceType[];
  searchStrategy: string;
  stopConditions: {
    maxQueries: number;
    maxSources: number;
    targetCoverage: number; // e.g. 0.85
    minConfidence: number; // e.g. 0.80
    minSourceDiversity: number; // e.g. 3 distinct domains
    marginalGainCutoff: number; // e.g. 0.10
  };
}

/**
 * Career OS Entity Integration
 * Research results must map back to Career OS entities
 */
export interface CareerOSMapping {
  company?: {
    name: string;
    businessModel: string;
    product: string;
    market: string;
    competitors: string[];
    strategicDirection: string;
    roleRequirements: string[];
    relevantSkills: string[];
    userFitAnalysis: string;
  };
  industry?: {
    sector: string;
    growthTrends: string[];
    disruptions: string[];
    macroRisks: string[];
  };
  role?: {
    title: string;
    level: string;
    coreExpectations: string[];
    salaryRange: {
      min: number;
      max: number;
      median: number;
      currency: string;
      sampleSize: number;
      asOf: string;
    };
  };
  skill?: {
    inDemand: string[];
    emerging: string[];
    declining: string[];
  };
  knowledge?: Array<{
    domain: string;
    concept: string;
    insight: string;
  }>;
  trend?: Array<{
    title: string;
    velocity: 'accelerating' | 'steady' | 'nascent';
    horizon: string;
    impact: string;
  }>;
  evidence?: Array<{
    claim: string;
    dataPoint: string;
    sourceId: string;
    confidence: number;
  }>;
  opportunity?: string[];
  risk?: string[];
}

/**
 * Research Memory Item with Freshness & Expiration Metadata
 * Rule: Time-sensitive info is not permanent knowledge.
 */
export interface ResearchMemoryItem {
  id: string;
  topic: string;
  researchDate: string; // ISO string
  expiresAt: string; // ISO string
  freshnessStatus: 'fresh' | 'aging' | 'expired';
  ttlDays: number;
  timeSensitiveDimensions: string[]; // e.g. ['salary', 'headcount', 'market_share']
  confidence: number;
  sources: RankedSource[];
  claims: ExtractedClaim[];
  evidence: Array<{ quote: string; sourceUrl: string; sourceTitle: string }>;
  conflicts: ConflictRecord[];
  relatedEntities: string[];
  careerMapping: CareerOSMapping;
}

/**
 * Final Research Report Output
 * Meets the required structure:
 * Executive Summary, Key Findings, Evidence, Implications, Uncertainties, Sources
 */
export interface ResearchReportOutput {
  executiveSummary: string;
  keyFindings: Array<{
    id: string;
    text: string;
    confidence: number;
    evidenceTrace: string[];
    sourceIds: string[];
  }>;
  evidence: Array<{
    claim: string;
    quote: string;
    sourceTitle: string;
    sourceUrl: string;
    dataPoint?: string;
  }>;
  implications: Array<{
    area: 'career' | 'technical' | 'market' | 'strategic';
    statement: string;
  }>;
  uncertainties: Array<{
    topic: string;
    reason: string;
    conflictingSources?: string[];
    recommendedVerification?: string;
  }>;
  sources: RankedSource[];
  careerMapping: CareerOSMapping;
  plan: ResearchPlan;
  conflicts: ConflictRecord[];
  metrics: {
    depth: ResearchDepth;
    totalQueriesExecuted: number;
    totalSourcesEvaluated: number;
    sourcesRanked: number;
    conflictsDetected: number;
    crossChecksPerformed: number;
    evidenceCoverage: number;
    marginalInformationGain: number;
    confidence: number;
    stopReason: string;
    durationMs: number;
    tokensUsed: number;
  };
}

/**
 * Options for triggering research dynamically
 */
export interface ResearchRequestOptions {
  query: string;
  userRequestedDepth?: ResearchDepth | 'auto';
  targetEntities?: string[];
  dimensions?: string[];
  careerImpact?: 'low' | 'medium' | 'high' | 'critical';
  existingUncertainty?: number;
  computeBudget?: 'low' | 'medium' | 'high' | 'maximum';
  forceFresh?: boolean;
  context?: any;
}
