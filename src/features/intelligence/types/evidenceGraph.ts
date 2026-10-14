// =========================================================================
// CAREER OS - EVIDENCE GRAPH & RELATIONSHIP MODEL TYPES
// =========================================================================

import { EvidenceStrengthLevel, SourceFamily } from '../../sources/types';

/**
 * 4 Distinct Evidence Tiers
 * LEARNED ≠ APPLIED ≠ DEMONSTRATED ≠ VALIDATED
 */
export type EvidenceTier = 'learned' | 'applied' | 'demonstrated' | 'validated';

export interface EvidenceTierDefinition {
  tier: EvidenceTier;
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  shortDesc: string;
  detailedDefinition: string;
  typicalEvidenceSources: string;
  strengthRange: string;
}

export const EVIDENCE_TIER_DEFINITIONS: Record<EvidenceTier, EvidenceTierDefinition> = {
  learned: {
    tier: 'learned',
    label: 'Learned (Comprehended)',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-200',
    shortDesc: 'Theoretical knowledge absorbed via passive study or curriculum.',
    detailedDefinition: 'Concepts, frameworks, and mental models studied through books, video lectures, online courses, university degrees, or research documentation. Does not prove execution in code or business.',
    typicalEvidenceSources: 'Books, MOOCs, Articles, Documentation, Academic coursework',
    strengthRange: 'L0 - L2'
  },
  applied: {
    tier: 'applied',
    label: 'Applied (Executed in Sandbox)',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    shortDesc: 'Hands-on implementation executed in personal, tutorial, or lab environments.',
    detailedDefinition: 'Hands-on practice where code was written, pipelines were configured, or prototypes were built in non-production sandboxes (personal GitHub repos, course capstones, labs, hackathons).',
    typicalEvidenceSources: 'Personal projects, Sandboxes, Open-source toy repos, Labs, Capstones',
    strengthRange: 'L3'
  },
  demonstrated: {
    tier: 'demonstrated',
    label: 'Demonstrated (Commercial Production)',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-200',
    shortDesc: 'Real-world delivery under commercial, organizational, and user constraints.',
    detailedDefinition: 'Actual work delivered in commercial organizations or live products with real users, SLAs, peer dependencies, and measurable production impact (PRDs, architecture RFCs, customer decks, shipped systems).',
    typicalEvidenceSources: 'Work experiences, Shipped production systems, Internal PRDs, Client presentations',
    strengthRange: 'L4 - L5'
  },
  validated: {
    tier: 'validated',
    label: 'Validated (Independently Verified)',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    shortDesc: 'Independently evaluated, certified, or audited by third-party experts.',
    detailedDefinition: 'Proof independently verified by accredited third parties, formal performance evaluations, passed interview case assessments, peer code reviews, or audited commercial outcome metrics.',
    typicalEvidenceSources: 'Passed mock/real interview cases, Accredited certifications, Audited KPIs, Peer reviews',
    strengthRange: 'L6'
  }
};

/**
 * 8-Node Relationship Model:
 * Source → Knowledge → Skill → Competency → Evidence → Project / Artifact / Experience → Role → Job
 */
export interface EvidenceRelationshipNode {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourceFamily: SourceFamily;
  sourceType: string;
  sourceUrl?: string;
  authorOrProvider?: string;

  // Extracted Conceptual Knowledge units
  knowledgeConcepts: string[];

  // Skill linking
  canonicalSkillId: string;
  skillName: string;

  // Associated Higher Competency
  competencies: string[];

  // Evidence Tier & Strength
  tier: EvidenceTier;
  evidenceStrength: EvidenceStrengthLevel;
  evidenceStatement?: string;

  // Concrete Tangible Manifestation (Project / Artifact / Experience / Case)
  tangibleEntity?: {
    id?: string;
    type: 'project' | 'artifact' | 'experience' | 'case_evaluation' | 'certification';
    title: string;
    url?: string;
    description?: string;
    metricsSummary?: string;
  };

  // Target Career Application (Role & Job)
  targetRoles: string[];
  targetJobMatch?: {
    jobId: string;
    jobTitle: string;
    company: string;
  };

  // Outcome & Quantified Validation
  outcomeMetrics: string[];
  validationMetadata?: {
    evaluator?: string;
    score?: string | number;
    evaluationDate?: string;
    result?: 'passed' | 'failed' | 'exceptional' | 'verified';
    credentialId?: string;
    credentialIssuer?: string;
  };

  // Temporal & Auditing
  dateAchieved: string;
  recencyMonths: number;
  userNotes?: string;
  isUserOverridden?: boolean;
}

/**
 * Multi-Factor Scoring Breakdown (Not simply counting sources!)
 * Weights:
 * - Application Depth: 30%
 * - External Validation: 25%
 * - Outcome & Impact: 20%
 * - Recency: 15%
 * - Relevance: 10%
 */
export interface MultiFactorProficiencyScore {
  overallScore: number; // 0 - 100
  tierDistribution: Record<EvidenceTier, number>;
  peakEvidenceStrength: EvidenceStrengthLevel;
  
  // Pillars (0 - 100 each)
  applicationDepthScore: number; // (Weight 30%)
  externalValidationScore: number; // (Weight 25%)
  outcomeImpactScore: number; // (Weight 20%)
  recencyScore: number; // (Weight 15%)
  relevanceScore: number; // (Weight 10%)

  // Transparent calculation logs for user audit
  scoringFactors: {
    name: string;
    score: number;
    weight: number;
    weightedContribution: number;
    assessment: string;
    evidenceHighlights: string[];
  }[];
}

/**
 * Transparent & Editable Explanation
 */
export interface TransparentSkillExplanation {
  canonicalSkillId: string;
  skillName: string;
  computedExplanation: string;
  userCustomExplanation?: string;
  isOverridden: boolean;
  userRationale?: string;
  lastEditedAt?: string;
}

/**
 * Chronological Evidence Timeline Event
 */
export interface EvidenceTimelineEvent {
  id: string;
  date: string;
  formattedDate: string;
  tier: EvidenceTier;
  title: string;
  subtitle: string;
  sourceFamily: SourceFamily;
  strength: EvidenceStrengthLevel;
  concreteArtifact?: string;
  outcomeMetric?: string;
  validationBadge?: string;
  summaryQuote?: string;
}

/**
 * Comprehensive Skill Evidence Profile View Model
 */
export interface DetailedSkillEvidenceProfile {
  canonicalSkillId: string;
  canonicalSkillName: string;
  aliases: string[];
  multilingualTags: { lang: string; label: string }[];
  description: string;
  domain: string;
  
  // Multi-factor metrics
  scoring: MultiFactorProficiencyScore;

  // Transparent explanation
  explanation: TransparentSkillExplanation;

  // 4-Tier Categorized collections
  tiers: {
    learned: EvidenceRelationshipNode[];
    applied: EvidenceRelationshipNode[];
    demonstrated: EvidenceRelationshipNode[];
    validated: EvidenceRelationshipNode[];
  };

  // Full Relationship Graph Lineage
  relationshipChain: {
    sources: { id: string; title: string; type: string }[];
    knowledgeConcepts: string[];
    canonicalSkill: string;
    competencies: string[];
    tangibleEntities: { title: string; type: string }[];
    targetRoles: string[];
    matchedJobs: { title: string; company: string }[];
  };

  // Timeline
  timeline: EvidenceTimelineEvent[];
}
