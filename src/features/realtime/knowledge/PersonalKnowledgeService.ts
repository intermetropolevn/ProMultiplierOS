import { 
  CandidateEvidence, 
  AnswerBlueprint, 
  RelevantExperienceItem,
  AnswerCoverageStatus
} from '../types';
import { EvidenceRankingService, EvidenceRankingOptions, RankedEvidenceItem } from './EvidenceRankingService';

const STORAGE_KEY_EVIDENCE = 'career_os_candidate_evidence_v3';
const STORAGE_KEY_BLUEPRINTS = 'career_os_answer_blueprints_v3';

const DEFAULT_EVIDENCE: CandidateEvidence[] = [
  {
    id: 'ev-crm-workflow',
    title: 'CRM Workflow Redesign',
    type: 'project',
    description: 'Led cross-functional workflow redesign and database migration of 12M customer records from legacy CRM to PostgreSQL with continuous CDC replication and zero unplanned downtime.',
    role: 'Product Management',
    domains: ['Enterprise SaaS', 'Cloud Infrastructure & DevOps'],
    skills: ['Workflow Redesign', 'Stakeholder Coordination', 'Process Optimization', 'Risk Assessment', 'Change Data Capture (CDC)'],
    metrics: [
      'Compressed customer onboarding workflow from 14 days to 2 days',
      '0 seconds unplanned downtime across 3 enterprise tenants',
      '99.999% verification parity in dual-run verification phase'
    ],
    keywords: [
      'workflow', 'product workflow', 'improved a product workflow', 'workflow redesign', 
      'process', 'redesign', 'stakeholder', 'coordination', 'crm', 'migration', 'database'
    ],
    source: 'Platform Engineering & Product Operations',
    confidence: 0.94,
    relatedQuestions: ['q-pm-product-workflow', 'q-devops-zero-downtime', 'q-pm-ambiguity-decision', 'q-star-disagreement'],
  },
  {
    id: 'ev-marketing-automation',
    title: 'Marketing Automation',
    type: 'project',
    description: 'Automated cross-functional marketing and sales handoff workflow with dynamic lead routing and campaign trigger rules.',
    role: 'Product Management',
    domains: ['Enterprise SaaS', 'E-Commerce & Retail'],
    skills: ['Marketing Automation', 'Lead Routing', 'Workflow Optimization', 'Campaign Triggers'],
    metrics: [
      '+28% MQL-to-SQL conversion rate within 60 days',
      'Saved 15 engineer-hours per week on manual lead sync'
    ],
    keywords: ['marketing automation', 'workflow', 'lead', 'process', 'automation', 'campaign', 'improved'],
    source: 'Growth Product Track',
    confidence: 0.82,
    relatedQuestions: ['q-pm-product-workflow'],
  },
  {
    id: 'ev-partnership-process',
    title: 'Partnership Process',
    type: 'experience',
    description: 'Standardized partner API onboarding process and technical contract testing with external logistics providers under ambiguous SLAs.',
    role: 'Product Management',
    domains: ['Enterprise SaaS', 'E-Commerce & Retail'],
    skills: ['Partner Operations', 'SLA Alignment', 'Process Documentation', 'Vendor Coordination'],
    metrics: [], // Metric unavailable! Demonstrates Metric ⚠ and Metric Priority comparison
    keywords: ['partnership', 'process', 'partnership process', 'vendor', 'sla', 'coordination', 'workflow'],
    source: 'Commercial Integrations Track',
    confidence: 0.68,
    relatedQuestions: ['q-pm-product-workflow', 'q-pm-process-unquantified'],
  },
  {
    id: 'ev-conflict-engineering',
    title: 'Conflict with Engineering on Microservices Split',
    type: 'story',
    description: 'Tech lead advocated splitting session management into a dedicated graph database service. Guided resolution using 2-day empirical benchmarking rather than dogmatic argument.',
    role: 'Software Engineering',
    domains: ['Enterprise SaaS', 'Fintech & Payments'],
    skills: ['Stakeholder Management', 'Architecture Trade-offs', 'RFC Consensus', 'Data-driven Benchmarking'],
    metrics: [
      'Built 2-day load test benchmark (10,000 concurrent writes)',
      '14ms p99 latency with Postgres-Redis vs 180ms graph cluster failover',
      'Saved ~$4,000 monthly in cluster licensing fees',
      'Zero downtime or alerts during Black Friday peak'
    ],
    keywords: ['disagree', 'engineering', 'architectural decision', 'rfc', 'benchmark', 'postgres', 'redis', 'conflict', 'stakeholder'],
    source: 'Previous Senior Software Engineer Role',
    confidence: 0.94,
    relatedQuestions: ['q-star-disagreement'],
  },
  {
    id: 'ev-crm-migration',
    title: 'CRM Migration',
    type: 'project',
    description: 'Led cross-functional migration of 12M customer records from legacy CRM to PostgreSQL with continuous CDC replication and zero unplanned downtime.',
    role: 'Software Engineering',
    domains: ['Enterprise SaaS', 'Cloud Infrastructure & DevOps'],
    skills: ['Decision Making', 'Structured Thinking', 'Risk Assessment', 'PostgreSQL', 'Change Data Capture (CDC)'],
    metrics: [
      '12M customer records synchronized',
      '0 seconds unplanned downtime across 3 enterprise tenants',
      '99.999% data verification parity in dual-run verification phase'
    ],
    keywords: ['crm', 'migration', 'database', 'zero-downtime', 'ambiguity', 'without enough information', 'decision', 'tradeoff'],
    source: 'Platform Engineering Portfolio',
    confidence: 0.89,
    relatedQuestions: ['q-devops-zero-downtime', 'q-pm-ambiguity-decision', 'q-star-disagreement'],
  },
  {
    id: 'ev-seo-migration',
    title: 'SEO Migration',
    type: 'project',
    description: 'Architected URL taxonomy and redirect graph during site replatforming with incomplete crawl logs. Formulated heuristic route rules to protect organic rankings under ambiguity.',
    role: 'Product Management',
    domains: ['Enterprise SaaS', 'E-Commerce & Retail'],
    skills: ['Decision Making', 'Structured Thinking', 'Risk Assessment', 'URL Canonicalization'],
    metrics: [], // Quantified outcome not found!
    keywords: ['seo', 'migration', 'incomplete data', 'without enough information', 'ambiguity', 'decision'],
    source: 'Growth Product Track',
    confidence: 0.81,
    relatedQuestions: ['q-pm-ambiguity-decision'],
  },
  {
    id: 'ev-partnership',
    title: 'Partnership',
    type: 'project',
    description: 'Integrated external partner API specifications with ambiguous SLA definitions. Formulated mock servers and contract testing to unblock sprint delivery.',
    role: 'Product Management',
    domains: ['Enterprise SaaS', 'E-Commerce & Retail'],
    skills: ['Decision Making', 'Structured Thinking', 'Risk Assessment', 'Partner SLAs'],
    metrics: [], // Quantified outcome not found!
    keywords: ['partnership', 'sla', 'ambiguity', 'decision', 'without enough information'],
    source: 'Commercial Integrations Track',
    confidence: 0.72,
    relatedQuestions: ['q-pm-ambiguity-decision'],
  },
  {
    id: 'ev-payment-idempotency',
    title: 'Core Payment Gateway Idempotency & Latency Optimization',
    type: 'project',
    description: 'Engineered strict at-most-once financial transaction pipeline with atomic Redis locks and immutable PostgreSQL unique constraints.',
    role: 'Software Engineering',
    domains: ['Fintech & Payments'],
    skills: ['Distributed Locks', 'Redis SET NX', 'PostgreSQL Serializable Transactions', 'API Gateway Resilience'],
    metrics: [
      'Zero duplicate charges across $45M annual transaction volume',
      'P99 replay response latency reduced from 420ms to 85ms'
    ],
    keywords: ['payment', 'idempotency', 'redis', 'duplicate charges', 'timeout', 'at-most-once', 'unique constraint'],
    source: 'Fintech Core Processing Team',
    confidence: 0.96,
    relatedQuestions: ['q-tech-idempotency'],
  },
  {
    id: 'ev-incomplete-data-decision',
    title: 'Self-Serve Checkout Expansion Under Incomplete Telemetry',
    type: 'decision',
    description: 'Executive mandate to launch new tiered pricing flow with sparse historical conversion data. Framed hypotheses using Type 1 vs Type 2 decision model and synthetic painted-door experiment.',
    role: 'Product Management',
    domains: ['Enterprise SaaS', 'E-Commerce & Retail'],
    skills: ['Ambiguity Framing', 'Type 1 vs Type 2 Decisions', 'Hypothesis Testing', 'Tripwire Guardrails'],
    metrics: [
      '+18% conversion lift in 30-day trial cohort',
      'Tripwire metric alerted early on mobile checkout drop-off, patched in 48 hours'
    ],
    keywords: ['ambiguity', 'incomplete data', 'painted door', 'hypothesis', 'proxy metrics', 'tripwire metrics', 'risk'],
    source: 'Growth Product Initiative',
    confidence: 0.89,
    relatedQuestions: ['q-pm-ambiguity-decision'],
  },
  {
    id: 'ev-seo-partnership',
    title: 'Partnership Integration with Third-Party Logistics Providers',
    type: 'project',
    description: 'Integrated external partner API specifications with ambiguous SLA definitions. Formulated mock servers and contract testing to unblock sprint delivery.',
    role: 'Product Management',
    domains: ['Enterprise SaaS', 'E-Commerce & Retail'],
    skills: ['Partner API SLAs', 'Contract Testing', 'Agile De-scoping'],
    metrics: [
      'Launched 3 logistics partners within single quarter',
      'Add a concrete metric if available.'
    ],
    keywords: ['partnership', 'seo', 'integration', 'ambiguity', 'trade-offs'],
    source: 'Commercial Integrations Track',
    confidence: 0.76,
    relatedQuestions: ['q-pm-ambiguity-decision'],
  },
  {
    id: 'ev-tech-debt-billing',
    title: 'Billing Engine Modularization & Capacity Negotiation',
    type: 'story',
    description: 'Calculated Cost of Delay on legacy billing regressions (140 engineer-hours/quarter). Negotiated 20% sprint refactoring allocation with product leadership to enable multi-currency launch.',
    role: 'Software Engineering',
    domains: ['Enterprise SaaS', 'Fintech & Payments'],
    skills: ['Technical Debt Management', 'Cost of Delay', 'Refactoring', 'Capacity Allocation'],
    metrics: [
      'Customer-facing defect rate dropped by 45%',
      'PR review/test cycle time compressed from 4 days to 6 hours',
      'Delivered multi-currency feature on scheduled deadline'
    ],
    keywords: ['technical debt', 'velocity', 'refactor', 'billing', 'cost of delay', 'boy scout rule'],
    source: 'Infrastructure & Billing Workstream',
    confidence: 0.91,
    relatedQuestions: ['q-tech-debt-velocity'],
  }
];

const DEFAULT_BLUEPRINTS: Record<string, AnswerBlueprint> = {
  'q-pm-product-workflow': {
    id: 'bp-pm-product-workflow',
    questionId: 'q-pm-product-workflow',
    evidenceIds: ['ev-crm-workflow'],
    framework: 'STAR-T (Situation, Task, Action, Trade-off, Result)',
    opening: 'When optimizing product workflows, I balance reducing cross-functional friction against strict data integrity and delivery constraints.',
    situation: 'Legacy CRM customer onboarding workflow required manual CSV reconciliations across 3 departments, taking 14 days per account.',
    task: 'Redesign end-to-end customer sync pipeline with continuous CDC replication while maintaining 100% auditability.',
    action: [
      'Mapped cross-department handoffs to isolate bottlenecks in billing and provisioning',
      'Built automated pipeline with Postgres CDC and zero-downtime dual-write verification',
      'Coordinated rollout with customer success and sales operations leads'
    ],
    tradeoffs: [
      'Prioritized strict consistency over batch sync speed to eliminate manual reconciliation'
    ],
    result: [
      'Compressed onboarding cycle from 14 days down to 2 days with zero manual data entry errors'
    ],
    metrics: ['14 days -> 2 days onboarding cycle', '0 seconds unplanned downtime', '99.999% verification parity'],
    mustMention: ['workflow redesign', 'stakeholder coordination', 'measurable outcome'],
    avoid: ['focusing only on UI without backend data flow', 'ignoring cross-functional training'],
    targetDuration: '2 - 3 minutes',
  },
  'q-pm-process-unquantified': {
    id: 'bp-pm-process-unquantified',
    questionId: 'q-pm-process-unquantified',
    evidenceIds: ['ev-partnership-process'],
    framework: 'STAR-T (Situation, Task, Action, Trade-off, Result)',
    opening: 'I structured partner onboarding SLAs to prevent cross-team delivery delays.',
    situation: 'Partner onboarding had unclear specifications and conflicting sprint deadlines across vendors.',
    task: 'Establish transparent SLA contracts and mock testing interfaces.',
    action: [
      'Created standardized API contract documentation for external logistics partners',
      'Built mock server environments to unblock frontend feature development'
    ],
    tradeoffs: [
      'Delayed final contract signing by 1 week to ensure rigorous security compliance reviews'
    ],
    result: [
      'Partner integration was successfully deployed without breaking existing client workflows'
    ],
    metrics: [], // Metric unavailable! Illustrates Metric ⚠ status
    mustMention: ['partner contracts', 'mock testing', 'SLA alignment'],
    avoid: ['vague commitments', 'untested vendor payloads'],
    targetDuration: '2 minutes',
  },
  'q-star-disagreement': {
    id: 'bp-star-disagreement',
    questionId: 'q-star-disagreement',
    evidenceIds: ['ev-conflict-engineering'],
    framework: 'STAR-T (Situation, Task, Action, Trade-off, Result)',
    opening: 'I believe technical disagreements are healthy when grounded in objective benchmarks rather than personal opinions.',
    situation: 'Tech lead proposed migrating user session store to a distributed graph database for social features.',
    task: 'Evaluate architectural stability, licensing cost, and operational burden while preserving strong team trust.',
    action: [
      'Scheduled a constructive 1-on-1 rather than arguing in group channels',
      'Built a 2-day benchmark load test simulating 10,000 concurrent writes',
      'Created an objective RFC comparing query latency, failover recovery, and operational complexity'
    ],
    tradeoffs: [
      'PostgreSQL required slight recursive query tuning vs. Graph DB native traversal',
      'Saved $4k/mo licensing and avoided team unfamiliarity with distributed graph operations'
    ],
    result: [
      'Tech lead accepted the benchmarked hybrid Postgres + Redis recommendation',
      'Delivered milestone on schedule with zero downtime during Black Friday'
    ],
    metrics: ['14ms p99 vs 180ms failover', '$4,000/mo saved in licensing', '0 alerts on Black Friday'],
    mustMention: ['benchmarking over dogma', '1-on-1 collaborative RFC', 'team alignment'],
    avoid: ['badmouthing the tech lead', 'focusing on ego instead of system metrics'],
    targetDuration: '2 - 3 minutes',
  },
  'q-tech-idempotency': {
    id: 'bp-tech-idempotency',
    questionId: 'q-tech-idempotency',
    evidenceIds: ['ev-payment-idempotency'],
    framework: 'Distributed Systems Blueprint (Failure Modes, Token Protocol, Lock & Safety Net)',
    opening: 'In financial APIs, network timeouts are ambiguous—a dropped connection does not mean the charge failed on the processor.',
    situation: 'High-volume mobile checkout experiencing retries due to flaky cellular connections.',
    task: 'Guarantee strict at-most-once payment processing with sub-100ms cached replay latency.',
    action: [
      'Enforced mandatory Idempotency-Key HTTP header generated on client checkout initiation (UUIDv4)',
      'Acquired atomic Redis distributed lock using SET lock:{key} token NX EX 30',
      'Wrote immutable transaction record in PostgreSQL with serializable UNIQUE (merchant_id, idempotency_key)'
    ],
    tradeoffs: [
      'Added small Redis latency overhead (1-2ms) to eliminate catastrophic double-charge risk',
      'Cached response payloads expire after 24h with PostgreSQL as durable backup source'
    ],
    result: [
      'Zero duplicate charges recorded over $45M processed volume',
      'Cached replay responses served in 85ms'
    ],
    metrics: ['Zero double charges', '$45M transaction volume', '85ms P99 replay latency'],
    mustMention: ['Idempotency-Key header', 'Redis SET NX atomic lock', 'Postgres UNIQUE constraint'],
    avoid: ['in-memory only state', 'forgetting lock TTL expiration'],
    targetDuration: '2 - 3 minutes',
  },
  'q-pm-ambiguity-decision': {
    id: 'bp-pm-ambiguity',
    questionId: 'q-pm-ambiguity-decision',
    evidenceIds: ['ev-incomplete-data-decision', 'ev-crm-migration'],
    framework: 'Type 1 vs Type 2 Framing (Assumptions, Low-Cost Experiment, Tripwires)',
    opening: 'When data is incomplete, I first distinguish whether a decision is reversible (two-way door) or irreversible (one-way door).',
    situation: 'Expanding into new pricing tiers with zero historical conversion data and conflicting executive opinions.',
    task: 'Maintain delivery momentum while safeguarding against revenue cannibalization.',
    action: [
      'Classified decision as a two-way door to avoid analysis paralysis',
      'Articulated 3 explicit assumptions regarding user willingness to pay',
      'Deployed a painted-door prototype and monitored 30-day cohort conversion'
    ],
    tradeoffs: [
      'Risked minor confusion on mock tier vs. saving 8 weeks of full backend engineering',
      'Established tripwire metrics: if churn exceeded 5%, immediate rollback'
    ],
    result: [
      'Validated demand with +18% conversion lift before building deep backend billing integrations',
      'Shipped ahead of quarterly target'
    ],
    metrics: ['+18% conversion lift', '48-hour rollback window'],
    mustMention: ['Type 1 vs Type 2 door', 'explicit working assumptions', 'tripwire metric'],
    avoid: ['waiting months for perfect data', 'reckless gambling without tripwires'],
    targetDuration: '2 - 2.5 minutes',
  },
  'q-tech-debt-velocity': {
    id: 'bp-tech-debt',
    questionId: 'q-tech-debt-velocity',
    evidenceIds: ['ev-tech-debt-billing'],
    framework: 'STAR-T (Cost of Delay, Negotiation, Incremental Refactor, Velocity Validation)',
    opening: 'I treat technical debt as financial debt: the issue is not having debt, but paying excessive compound interest.',
    situation: 'Brittle legacy billing code caused 140 engineer-hours of hotfix toil during feature sprints.',
    task: 'Convince product partners to allocate engineering time to refactor core billing modules without missing the multi-currency milestone.',
    action: [
      'Calculated Cost of Delay with defect metrics instead of complaining about code aesthetics',
      'Negotiated a structured 20% capacity allocation across 3 sprints',
      'Isolated billing engine behind clean interfaces with automated regression tests'
    ],
    tradeoffs: [
      'Slightly slowed down non-critical cosmetic requests to bulletproof the core money pipeline'
    ],
    result: [
      'Customer defect rate dropped 45%',
      'PR review cycle dropped from 4 days to 6 hours',
      'Shipped multi-currency on schedule with zero billing discrepancies'
    ],
    metrics: ['-45% defect rate', 'PR cycle 4 days -> 6 hours', '140 engineer-hours saved'],
    mustMention: ['Cost of Delay calculation', '20% capacity rule', 'business-metric translation'],
    avoid: ['demanding 3-month total feature freeze', 'purist code dogma'],
    targetDuration: '2 - 3 minutes',
  }
};

export class PersonalKnowledgeService {
  public static getEvidence(): CandidateEvidence[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EVIDENCE);
      if (stored) {
        const parsed: CandidateEvidence[] = JSON.parse(stored);
        const existingIds = new Set(parsed.map(p => p.id));
        const missing = DEFAULT_EVIDENCE.filter(d => !existingIds.has(d.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem(STORAGE_KEY_EVIDENCE, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
      localStorage.setItem(STORAGE_KEY_EVIDENCE, JSON.stringify(DEFAULT_EVIDENCE));
      return DEFAULT_EVIDENCE;
    } catch {
      return DEFAULT_EVIDENCE;
    }
  }

  public static saveEvidence(evidenceList: CandidateEvidence[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_EVIDENCE, JSON.stringify(evidenceList));
    } catch (e) {
      console.warn('Could not save evidence to localStorage', e);
    }
  }

  public static addOrUpdateEvidence(evidence: CandidateEvidence): CandidateEvidence[] {
    const list = this.getEvidence();
    const existingIndex = list.findIndex(e => e.id === evidence.id);
    let updated: CandidateEvidence[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = evidence;
    } else {
      updated = [evidence, ...list];
    }
    this.saveEvidence(updated);
    return updated;
  }

  public static getBlueprintForQuestion(questionId?: string): AnswerBlueprint | null {
    if (!questionId) return null;
    return DEFAULT_BLUEPRINTS[questionId] || null;
  }

  /**
   * Retrieves and ranks relevant personal experience based on the 10 dimensions:
   * question intent, role, sector, domain, skills, experience type,
   * question type, existing question relationships, evidence tags, and metrics availability.
   *
   * Also applies METRIC PRIORITY:
   * Preferring the story with stronger measurable evidence if two stories are equally relevant.
   */
  public static retrieveRelevantEvidence(
    semanticIntent: string,
    queryText: string,
    competencies: string[],
    context?: {
      role?: string;
      sector?: string;
      domain?: string;
      questionType?: string;
      relatedQuestionIds?: string[];
      emphasizeImpact?: boolean;
    }
  ): {
    bestStory: CandidateEvidence | null;
    topEvidence: RelevantExperienceItem[];
    blueprint?: AnswerBlueprint;
    answerCoverage?: AnswerCoverageStatus;
    metricPriorityApplied?: boolean;
    metricPriorityMessage?: string;
  } {
    const allEvidence = this.getEvidence();

    const ranking = EvidenceRankingService.rankCandidateEvidence(allEvidence, {
      questionText: queryText,
      semanticIntent,
      role: context?.role,
      sector: context?.sector,
      domain: context?.domain,
      skills: competencies,
      questionType: context?.questionType,
      relatedQuestionIds: context?.relatedQuestionIds,
      emphasizeImpact: context?.emphasizeImpact,
    });

    const topEvidence: RelevantExperienceItem[] = ranking.rankedList.slice(0, 3).map(item => ({
      evidence: item.evidence,
      confidence: Number((item.relevancePct / 100).toFixed(2)),
      relevanceReason: item.relevanceExplanation,
      relevancePct: item.relevancePct,
      hasMetrics: item.hasMetrics,
      metricPriorityApplied: item.metricPriorityApplied,
      metricPriorityReason: item.metricPriorityReason,
    }));

    const bestStory = ranking.bestStory?.evidence || topEvidence[0]?.evidence || null;

    // Retrieve blueprint if available
    let blueprint: AnswerBlueprint | undefined;
    if (bestStory) {
      for (const rq of bestStory.relatedQuestions) {
        if (DEFAULT_BLUEPRINTS[rq]) {
          blueprint = DEFAULT_BLUEPRINTS[rq];
          break;
        }
      }
    }

    // Evaluate answer coverage on blueprint
    const answerCoverage = EvidenceRankingService.evaluateAnswerCoverage(blueprint);

    return {
      bestStory,
      topEvidence,
      blueprint,
      answerCoverage,
      metricPriorityApplied: ranking.metricPriorityApplied,
      metricPriorityMessage: ranking.metricPriorityMessage,
    };
  }
}

