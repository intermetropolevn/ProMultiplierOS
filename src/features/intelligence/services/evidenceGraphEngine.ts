// =========================================================================
// CAREER OS - EVIDENCE GRAPH & MULTI-FACTOR INTELLIGENCE ENGINE
// =========================================================================

import { sourceStore } from '../../sources/services/sourceStore';
import { NormalizedSource, EvidenceStrengthLevel } from '../../sources/types';
import { 
  EvidenceTier, 
  EvidenceRelationshipNode, 
  DetailedSkillEvidenceProfile,
  MultiFactorProficiencyScore,
  TransparentSkillExplanation,
  EvidenceTimelineEvent,
  EVIDENCE_TIER_DEFINITIONS
} from '../types/evidenceGraph';
import { CanonicalSkillRegistry } from './canonicalSkillRegistry';

const USER_OVERRIDES_STORAGE_KEY = 'career_os_evidence_graph_overrides_v1';

interface StoredOverrides {
  tierOverrides: Record<string, EvidenceTier>; // composite key: `${canonicalSkillId}::${sourceId}` -> tier
  explanations: Record<string, { userCustomExplanation: string; userRationale: string; lastEditedAt: string }>;
  customMetrics: Record<string, string[]>; // `${canonicalSkillId}::${sourceId}` -> metrics
}

export class EvidenceGraphEngine {
  private static overrides: StoredOverrides = {
    tierOverrides: {},
    explanations: {},
    customMetrics: {}
  };

  private static initialized = false;

  private static loadOverrides() {
    if (this.initialized) return;
    try {
      const raw = localStorage.getItem(USER_OVERRIDES_STORAGE_KEY);
      if (raw) {
        this.overrides = JSON.parse(raw);
      }
    } catch {
      // fallback to empty
    }
    this.initialized = true;
  }

  private static saveOverrides() {
    try {
      localStorage.setItem(USER_OVERRIDES_STORAGE_KEY, JSON.stringify(this.overrides));
    } catch {
      // ignore
    }
  }

  /**
   * Determine the default Evidence Tier for a source
   * LEARNED ≠ APPLIED ≠ DEMONSTRATED ≠ VALIDATED
   */
  public static deriveEvidenceTier(source: NormalizedSource): EvidenceTier {
    // 1. Validated takes highest precedence: assessments, accredited credentials, third-party audits
    if (
      source.sourceFamily === 'assessment' ||
      (source.assessmentData && source.assessmentData.result === 'passed') ||
      (source.sourceFamily === 'credential' && source.evidenceStrength >= 4)
    ) {
      return 'validated';
    }

    // 2. Demonstrated: Shipped commercial work, PRDs, architecture RFCs, live production artifacts
    if (
      source.sourceFamily === 'artifact' ||
      source.sourceFamily === 'experience' ||
      source.evidenceStrength >= 5
    ) {
      return 'demonstrated';
    }

    // 3. Applied: Hands-on code repositories, sandbox projects, personal tools, lab exercises
    if (
      source.sourceFamily === 'project' ||
      source.evidenceStrength === 3
    ) {
      return 'applied';
    }

    // 4. Learned: Passive courses, books, lectures, research papers, articles
    return 'learned';
  }

  /**
   * Builds the comprehensive relationship model for a single canonical skill
   * Source → Knowledge → Skill → Competency → Evidence → Project / Artifact / Experience → Role → Job
   */
  public static getDetailedSkillProfile(canonicalSkillIdentifier: string): DetailedSkillEvidenceProfile | undefined {
    this.loadOverrides();
    const resolution = CanonicalSkillRegistry.resolve(canonicalSkillIdentifier);
    const canonicalSkillId = resolution.canonicalId;
    const canonicalName = resolution.canonicalName;
    const definition = resolution.definition;

    const allSources = sourceStore.getSources();
    const matchedEvidenceNodes: EvidenceRelationshipNode[] = [];

    const now = new Date();

    for (const src of allSources) {
      const allSrcSkills = Array.from(new Set([...(src.confirmedSkills || []), ...(src.inferredSkills || [])]));
      const matchesThisSkill = allSrcSkills.some(rawSkill => {
        const res = CanonicalSkillRegistry.resolve(rawSkill);
        return res.canonicalId === canonicalSkillId;
      });

      if (!matchesThisSkill) continue;

      // Check for user tier override
      const overrideKey = `${canonicalSkillId}::${src.id}`;
      const effectiveTier = this.overrides.tierOverrides[overrideKey] || this.deriveEvidenceTier(src);
      const customMetrics = this.overrides.customMetrics[overrideKey] || [];

      // Calculate recency in months
      const sourceDateStr = src.dateCompleted || src.datePublished || src.createdAt;
      const sourceDate = new Date(sourceDateStr);
      const diffMs = Math.max(0, now.getTime() - (isNaN(sourceDate.getTime()) ? now.getTime() : sourceDate.getTime()));
      const recencyMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.4));

      // Extract concrete entity
      let tangibleType: 'project' | 'artifact' | 'experience' | 'case_evaluation' | 'certification' = 'artifact';
      if (src.sourceFamily === 'project') tangibleType = 'project';
      else if (src.sourceFamily === 'experience') tangibleType = 'experience';
      else if (src.sourceFamily === 'assessment') tangibleType = 'case_evaluation';
      else if (src.sourceFamily === 'credential') tangibleType = 'certification';

      // Concrete outcome metrics
      const outcomeMetrics: string[] = [...customMetrics];
      if (src.assessmentData?.score) {
        outcomeMetrics.push(`Evaluated Score: ${src.assessmentData.score}`);
      }
      if (src.assessmentData?.result) {
        outcomeMetrics.push(`Result: ${src.assessmentData.result.toUpperCase()}`);
      }
      if (src.evidenceStatements && src.evidenceStatements.length > 0) {
        outcomeMetrics.push(src.evidenceStatements[0]);
      }

      // Determine validation metadata
      const validationMetadata = src.assessmentData ? {
        evaluator: src.author || 'Senior Interview Assessor',
        score: src.assessmentData.score,
        evaluationDate: src.assessmentData.evaluationDate || src.dateCompleted,
        result: src.assessmentData.result === 'passed' ? 'passed' as const : 'verified' as const,
        credentialIssuer: src.provider
      } : (src.sourceFamily === 'credential' ? {
        credentialIssuer: src.provider || src.author,
        result: 'verified' as const
      } : undefined);

      // Associated job match
      const targetJobMatch = src.assessmentData?.relatedJobTitle ? {
        jobId: src.assessmentData.relatedJobId || 'job-match-1',
        jobTitle: src.assessmentData.relatedJobTitle,
        company: 'FinFlow Global'
      } : undefined;

      const node: EvidenceRelationshipNode = {
        id: `node-${src.id}-${canonicalSkillId}`,
        sourceId: src.id,
        sourceTitle: src.title,
        sourceFamily: src.sourceFamily,
        sourceType: src.sourceType,
        sourceUrl: src.url,
        authorOrProvider: src.author || src.provider,
        knowledgeConcepts: Array.from(new Set([...(src.confirmedKnowledge || []), ...(src.inferredKnowledge || [])])),
        canonicalSkillId,
        skillName: canonicalName,
        competencies: src.competencies || definition?.competencies || ['Technical Execution'],
        tier: effectiveTier,
        evidenceStrength: src.evidenceStrength,
        evidenceStatement: src.evidenceStatements?.[0] || src.description,
        tangibleEntity: {
          type: tangibleType,
          title: src.title,
          url: src.url,
          description: src.description,
          metricsSummary: outcomeMetrics.join(' • ')
        },
        targetRoles: src.careerRelevance || definition?.targetRoles || ['Technical Lead'],
        targetJobMatch,
        outcomeMetrics,
        validationMetadata,
        dateAchieved: sourceDateStr,
        recencyMonths,
        userNotes: src.notes,
        isUserOverridden: !!this.overrides.tierOverrides[overrideKey]
      };

      matchedEvidenceNodes.push(node);
    }

    // Group into 4 distinct tiers: LEARNED ≠ APPLIED ≠ DEMONSTRATED ≠ VALIDATED
    const tiers = {
      learned: matchedEvidenceNodes.filter(n => n.tier === 'learned'),
      applied: matchedEvidenceNodes.filter(n => n.tier === 'applied'),
      demonstrated: matchedEvidenceNodes.filter(n => n.tier === 'demonstrated'),
      validated: matchedEvidenceNodes.filter(n => n.tier === 'validated')
    };

    // Calculate Multi-Factor Proficiency Score (NOT simply counting sources!)
    const scoring = this.calculateMultiFactorScore(tiers, matchedEvidenceNodes);

    // Generate or fetch Transparent Explanation
    const explanation = this.generateExplanation(canonicalSkillId, canonicalName, tiers, scoring);

    // Build Chronological Timeline
    const timeline = this.buildTimeline(matchedEvidenceNodes);

    // Multilingual aliases
    const aliases = definition ? [
      ...(definition.multilingualAliases.en || []),
      ...(definition.multilingualAliases.vi || []),
      ...(definition.multilingualAliases.ja || [])
    ] : [canonicalName];

    const multilingualTags: { lang: string; label: string }[] = [];
    if (definition?.multilingualAliases.vi?.[0]) {
      multilingualTags.push({ lang: 'VI', label: definition.multilingualAliases.vi[0] });
    }
    if (definition?.multilingualAliases.ja?.[0]) {
      multilingualTags.push({ lang: 'JA', label: definition.multilingualAliases.ja[0] });
    }

    // Full Relationship Graph Lineage
    const relationshipChain = {
      sources: matchedEvidenceNodes.map(n => ({ id: n.sourceId, title: n.sourceTitle, type: n.sourceType })),
      knowledgeConcepts: Array.from(new Set(matchedEvidenceNodes.flatMap(n => n.knowledgeConcepts))),
      canonicalSkill: canonicalName,
      competencies: Array.from(new Set(matchedEvidenceNodes.flatMap(n => n.competencies))),
      tangibleEntities: matchedEvidenceNodes.filter(n => n.tangibleEntity).map(n => ({ title: n.tangibleEntity!.title, type: n.tangibleEntity!.type })),
      targetRoles: Array.from(new Set(matchedEvidenceNodes.flatMap(n => n.targetRoles))),
      matchedJobs: matchedEvidenceNodes.filter(n => n.targetJobMatch).map(n => ({ title: n.targetJobMatch!.jobTitle, company: n.targetJobMatch!.company }))
    };

    return {
      canonicalSkillId,
      canonicalSkillName: canonicalName,
      aliases,
      multilingualTags,
      description: definition?.description || `Professional capability in ${canonicalName}.`,
      domain: definition?.domain || 'Technology & Product',
      scoring,
      explanation,
      tiers,
      relationshipChain,
      timeline
    };
  }

  /**
   * Multi-Factor Proficiency Scoring Algorithm
   * Prioritize:
   * 1. relevance (10%)
   * 2. recency (15%)
   * 3. application (30%)
   * 4. outcome (20%)
   * 5. external validation (25%)
   * 
   * Strict Rule: A skill with 10 books (learned only) will score much lower than a skill with 1 demonstrated production artifact and 1 validated case!
   */
  private static calculateMultiFactorScore(
    tiers: { learned: EvidenceRelationshipNode[]; applied: EvidenceRelationshipNode[]; demonstrated: EvidenceRelationshipNode[]; validated: EvidenceRelationshipNode[] },
    allNodes: EvidenceRelationshipNode[]
  ): MultiFactorProficiencyScore {
    if (allNodes.length === 0) {
      return {
        overallScore: 0,
        tierDistribution: { learned: 0, applied: 0, demonstrated: 0, validated: 0 },
        peakEvidenceStrength: 0,
        applicationDepthScore: 0,
        externalValidationScore: 0,
        outcomeImpactScore: 0,
        recencyScore: 0,
        relevanceScore: 0,
        scoringFactors: []
      };
    }

    const peakStrength = Math.max(...allNodes.map(n => n.evidenceStrength), 0) as EvidenceStrengthLevel;

    // 1. Application Depth (Weight 30%)
    // Hands-on vs passive:
    // Learned only: capped at 25
    // Applied: 65
    // Demonstrated (Production): 90
    // Both Demonstrated + Applied: 100
    let applicationDepthScore = 20;
    if (tiers.demonstrated.length > 0 && tiers.applied.length > 0) {
      applicationDepthScore = 100;
    } else if (tiers.demonstrated.length > 0) {
      applicationDepthScore = 90;
    } else if (tiers.applied.length > 0) {
      applicationDepthScore = 65;
    } else if (tiers.learned.length > 0) {
      applicationDepthScore = 25; // Passive consumption only
    }

    // 2. External Validation (Weight 25%)
    // Third-party verification (passed case interview, certified exam, peer-reviewed)
    let externalValidationScore = 15;
    if (tiers.validated.length > 0) {
      const hasPassedCase = tiers.validated.some(n => n.validationMetadata?.result === 'passed');
      if (hasPassedCase) {
        externalValidationScore = 100;
      } else {
        externalValidationScore = 85;
      }
    } else if (peakStrength >= 5) {
      externalValidationScore = 50; // High rigor production artifact
    } else {
      externalValidationScore = 15; // Self-asserted
    }

    // 3. Outcome & Quantified Impact (Weight 20%)
    // Presence of tangible business metrics, uptime, latency, ARR
    const nodesWithMetrics = allNodes.filter(n => n.outcomeMetrics && n.outcomeMetrics.length > 0);
    let outcomeImpactScore = 25;
    if (nodesWithMetrics.length >= 2) {
      outcomeImpactScore = 95;
    } else if (nodesWithMetrics.length === 1) {
      outcomeImpactScore = 75;
    } else if (tiers.demonstrated.length > 0) {
      outcomeImpactScore = 55;
    }

    // 4. Recency (Weight 15%)
    // Currency of hands-on or validated application (temporal decay)
    const minRecencyMonths = Math.min(...allNodes.map(n => n.recencyMonths));
    let recencyScore = 50;
    if (minRecencyMonths <= 6) {
      recencyScore = 100; // Fresh within last 6 months
    } else if (minRecencyMonths <= 12) {
      recencyScore = 85; // Active within 1 year
    } else if (minRecencyMonths <= 24) {
      recencyScore = 70; // 1-2 years
    } else if (minRecencyMonths <= 36) {
      recencyScore = 50; // 2-3 years
    } else {
      recencyScore = 30; // 3+ years old (skills decay without usage)
    }

    // 5. Relevance (Weight 10%)
    // Target career paths and domain alignment
    const hasTargetRoleAlignment = allNodes.some(n => n.targetRoles && n.targetRoles.length > 0);
    const relevanceScore = hasTargetRoleAlignment ? 95 : 60;

    // Weighted Overall Score Calculation
    const overallScore = Math.round(
      (applicationDepthScore * 0.30) +
      (externalValidationScore * 0.25) +
      (outcomeImpactScore * 0.20) +
      (recencyScore * 0.15) +
      (relevanceScore * 0.10)
    );

    const scoringFactors = [
      {
        name: 'Application Depth',
        score: applicationDepthScore,
        weight: 30,
        weightedContribution: Math.round(applicationDepthScore * 0.30),
        assessment: tiers.demonstrated.length > 0 
          ? `Commercial production delivery verified (${tiers.demonstrated.length} live artifacts/roles).`
          : tiers.applied.length > 0 
          ? 'Hands-on execution in sandbox/prototypes.' 
          : 'Passive theoretical study only (books/courses).',
        evidenceHighlights: tiers.demonstrated.map(d => d.sourceTitle).slice(0, 2)
      },
      {
        name: 'External Validation',
        score: externalValidationScore,
        weight: 25,
        weightedContribution: Math.round(externalValidationScore * 0.25),
        assessment: tiers.validated.length > 0 
          ? `Independently verified by ${tiers.validated.length} formal assessment/credential evaluators.`
          : 'Self-reported without independent third-party audit.',
        evidenceHighlights: tiers.validated.map(v => v.sourceTitle).slice(0, 2)
      },
      {
        name: 'Outcome & Impact',
        score: outcomeImpactScore,
        weight: 20,
        weightedContribution: Math.round(outcomeImpactScore * 0.20),
        assessment: nodesWithMetrics.length > 0 
          ? `${nodesWithMetrics.length} concrete quantified metrics documented.`
          : 'Qualitative descriptions only without hard metrics.',
        evidenceHighlights: nodesWithMetrics.flatMap(m => m.outcomeMetrics).slice(0, 2)
      },
      {
        name: 'Recency Currency',
        score: recencyScore,
        weight: 15,
        weightedContribution: Math.round(recencyScore * 0.15),
        assessment: minRecencyMonths <= 6 
          ? 'Active proof within the last 6 months.'
          : minRecencyMonths <= 18 
          ? `Last practiced ~${minRecencyMonths} months ago.`
          : 'Historical knowledge; decay may require refreshed demonstration.',
        evidenceHighlights: [`Latest active proof: ${minRecencyMonths} months ago`]
      },
      {
        name: 'Career Relevance',
        score: relevanceScore,
        weight: 10,
        weightedContribution: Math.round(relevanceScore * 0.10),
        assessment: 'Directly linked to target executive and engineering roles in portfolio.',
        evidenceHighlights: allNodes.flatMap(n => n.targetRoles).slice(0, 2)
      }
    ];

    return {
      overallScore: Math.min(100, Math.max(5, overallScore)),
      tierDistribution: {
        learned: tiers.learned.length,
        applied: tiers.applied.length,
        demonstrated: tiers.demonstrated.length,
        validated: tiers.validated.length
      },
      peakEvidenceStrength: peakStrength,
      applicationDepthScore,
      externalValidationScore,
      outcomeImpactScore,
      recencyScore,
      relevanceScore,
      scoringFactors
    };
  }

  /**
   * Generates transparent, human-readable rationale
   */
  private static generateExplanation(
    canonicalSkillId: string,
    skillName: string,
    tiers: { learned: EvidenceRelationshipNode[]; applied: EvidenceRelationshipNode[]; demonstrated: EvidenceRelationshipNode[]; validated: EvidenceRelationshipNode[] },
    scoring: MultiFactorProficiencyScore
  ): TransparentSkillExplanation {
    const override = this.overrides.explanations[canonicalSkillId];

    const parts: string[] = [];

    // Stage 1: Synthesis
    parts.push(
      `Career OS synthesizes ${skillName} at a ${scoring.overallScore}% verified proficiency (Peak: L${scoring.peakEvidenceStrength}).`
    );

    // Stage 2: Distinctions
    const tierNarratives: string[] = [];
    if (tiers.learned.length > 0) {
      tierNarratives.push(`learned conceptually across ${tiers.learned.length} theoretical resource${tiers.learned.length > 1 ? 's' : ''}`);
    }
    if (tiers.applied.length > 0) {
      tierNarratives.push(`applied in ${tiers.applied.length} hands-on sandbox project${tiers.applied.length > 1 ? 's' : ''}`);
    }
    if (tiers.demonstrated.length > 0) {
      tierNarratives.push(`demonstrated in ${tiers.demonstrated.length} commercial production artifact${tiers.demonstrated.length > 1 ? 's' : ''}`);
    }
    if (tiers.validated.length > 0) {
      tierNarratives.push(`objectively validated by ${tiers.validated.length} formal assessment${tiers.validated.length > 1 ? 's' : ''}`);
    }

    if (tierNarratives.length > 0) {
      parts.push(`This capability was ${tierNarratives.join(', and ')}.`);
    }

    // Stage 3: Rigor note
    if (tiers.validated.length > 0) {
      const topValidation = tiers.validated[0];
      parts.push(
        `Highest-trust validation: Passed "${topValidation.sourceTitle}" with evaluation score: ${topValidation.validationMetadata?.score || 'Strong Hire/Pass'}.`
      );
    } else if (tiers.demonstrated.length > 0) {
      const topDem = tiers.demonstrated[0];
      parts.push(
        `Primary commercial proof: Deployed "${topDem.sourceTitle}" with active production impact.`
      );
    }

    const computedExplanation = parts.join(' ');

    return {
      canonicalSkillId,
      skillName,
      computedExplanation,
      userCustomExplanation: override?.userCustomExplanation,
      isOverridden: !!override?.userCustomExplanation,
      userRationale: override?.userRationale,
      lastEditedAt: override?.lastEditedAt
    };
  }

  /**
   * Chronological Evidence Timeline
   */
  private static buildTimeline(nodes: EvidenceRelationshipNode[]): EvidenceTimelineEvent[] {
    const sorted = [...nodes].sort((a, b) => {
      const dateA = new Date(a.dateAchieved).getTime();
      const dateB = new Date(b.dateAchieved).getTime();
      return (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
    });

    return sorted.map(n => {
      const parsedDate = new Date(n.dateAchieved);
      const formattedDate = isNaN(parsedDate.getTime()) 
        ? 'Ongoing' 
        : parsedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      return {
        id: `timeline-${n.id}`,
        date: n.dateAchieved,
        formattedDate,
        tier: n.tier,
        title: n.sourceTitle,
        subtitle: `${n.sourceType} • ${EVIDENCE_TIER_DEFINITIONS[n.tier].label}`,
        sourceFamily: n.sourceFamily,
        strength: n.evidenceStrength,
        concreteArtifact: n.tangibleEntity?.title,
        outcomeMetric: n.outcomeMetrics[0],
        validationBadge: n.validationMetadata ? `Validated by ${n.validationMetadata.evaluator || 'Evaluator'}` : undefined,
        summaryQuote: n.evidenceStatement
      };
    });
  }

  /**
   * User Override: Change Evidence Tier (e.g. Learned -> Applied -> Demonstrated -> Validated)
   */
  public static setTierOverride(canonicalSkillId: string, sourceId: string, newTier: EvidenceTier) {
    this.loadOverrides();
    const key = `${canonicalSkillId}::${sourceId}`;
    this.overrides.tierOverrides[key] = newTier;
    this.saveOverrides();
  }

  /**
   * User Override: Customize Explanation and Rationale
   */
  public static setExplanationOverride(canonicalSkillId: string, userCustomExplanation: string, userRationale?: string) {
    this.loadOverrides();
    this.overrides.explanations[canonicalSkillId] = {
      userCustomExplanation,
      userRationale: userRationale || '',
      lastEditedAt: new Date().toISOString()
    };
    this.saveOverrides();
  }

  /**
   * User Override: Add or Edit Quantified Outcome Metric for an evidence item
   */
  public static addCustomMetric(canonicalSkillId: string, sourceId: string, metric: string) {
    this.loadOverrides();
    const key = `${canonicalSkillId}::${sourceId}`;
    if (!this.overrides.customMetrics[key]) {
      this.overrides.customMetrics[key] = [];
    }
    this.overrides.customMetrics[key].push(metric);
    this.saveOverrides();
  }

  /**
   * Reset overrides for a skill
   */
  public static resetSkillOverrides(canonicalSkillId: string) {
    this.loadOverrides();
    delete this.overrides.explanations[canonicalSkillId];
    // Remove tier overrides matching this skill
    Object.keys(this.overrides.tierOverrides).forEach(k => {
      if (k.startsWith(`${canonicalSkillId}::`)) {
        delete this.overrides.tierOverrides[k];
      }
    });
    this.saveOverrides();
  }

  /**
   * Get all canonical skill profiles recognized across all sources
   */
  public static getAllSkillProfiles(): DetailedSkillEvidenceProfile[] {
    const allSources = sourceStore.getSources();
    const uniqueCanonicalIds = new Set<string>();

    for (const src of allSources) {
      const skills = [...(src.confirmedSkills || []), ...(src.inferredSkills || [])];
      for (const sk of skills) {
        const res = CanonicalSkillRegistry.resolve(sk);
        uniqueCanonicalIds.add(res.canonicalId);
      }
    }

    const profiles: DetailedSkillEvidenceProfile[] = [];
    for (const id of uniqueCanonicalIds) {
      const profile = this.getDetailedSkillProfile(id);
      if (profile) profiles.push(profile);
    }

    // Sort by overall score descending
    return profiles.sort((a, b) => b.scoring.overallScore - a.scoring.overallScore);
  }
}
