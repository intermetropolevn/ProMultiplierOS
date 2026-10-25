import { 
  EvidenceItem, 
  CandidateStory, 
  StructuredAnswerBlueprint, 
  MetricLedgerItem, 
  EvidenceCategory,
  StoryBestFor,
  StoryEvidenceQuality,
  BlueprintFramework
} from '../types';
import { QUESTIONS_DATA } from '../../../data/questionsData';
import { InterviewQuestion } from '../../../types';
import { curatedBetaData } from '../../../services/curatedBetaData';
import { AccessControlService } from '../../../services/accessControlService';
import { demoWorkspaceService } from '../../../services/demoWorkspaceService';
import { dataExposureGuard } from '../../../services/dataExposureGuardService';

const STORAGE_KEYS = {
  EVIDENCE: 'career_os_profile_evidence_v2',
  STORIES: 'career_os_profile_stories_v2',
  BLUEPRINTS: 'career_os_profile_blueprints_v2',
  METRICS: 'career_os_profile_metrics_v2',
};

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'ev-crm-migration',
    title: 'CRM Migration & Data Pipeline Modernization',
    shortSummary: 'Zero-downtime dual-run migration of 12M customer records from legacy CRM to PostgreSQL with real-time Kafka CDC reconciliation.',
    category: 'Projects',
    context: 'The company’s 7-year-old proprietary CRM suffered from schema drift, latency spikes up to 4s, and blocked modern sales automation. Migrating in a single maintenance window would require 14 hours of total downtime.',
    myRole: 'Lead Platform Engineer & Project Owner',
    actions: 'Designed a dual-run architecture using Debezium CDC and Kafka to stream change logs in real time. Implemented automated checksum parity validation across 12M records before cutting DNS.',
    decision: 'Adopted continuous Change Data Capture (CDC) replication rather than taking a high-risk multi-hour offline maintenance window.',
    tradeoffs: 'Invested 3 extra weeks developing automated schema reconciliation tooling, but completely eliminated business disruption for 3 enterprise tenants.',
    outcome: 'Completed cutover with 0 seconds unplanned downtime, verified 99.999% parity on financial audit records, and decommissioned $35k/month legacy licenses.',
    metrics: [
      '12,000,000 customer records synchronized',
      '0 seconds unplanned downtime',
      '99.999% data verification parity in dual-run phase',
      '$35,000 monthly legacy license savings'
    ],
    skills: ['Stakeholder Management', 'Product Operations', 'CRM', 'PostgreSQL', 'Kafka', 'CDC (Debezium)', 'Zero-Downtime Migration'],
    domains: ['Enterprise SaaS', 'Cloud Infrastructure & DevOps'],
    roles: ['Software Engineering', 'Product Management'],
    tags: ['migration', 'database', 'zero-downtime', 'debezium', 'kafka'],
    linkedQuestionIds: ['q-star-disagreement', 'q-devops-zero-downtime', 'q-pm-ambiguity-decision'],
    createdAt: '2026-08-10T09:00:00.000Z',
    updatedAt: '2026-09-01T14:30:00.000Z',
  },
  {
    id: 'ev-conflict-engineering',
    title: 'Microservices Split vs Monolith Benchmarking',
    shortSummary: 'Resolved a heated technical disagreement with an engineering lead by running empirical 2-day load test benchmarks rather than debating opinions.',
    category: 'Conflicts',
    context: 'Our engineering lead advocated splitting session management into a dedicated distributed graph database cluster for new social connections, while backend engineers raised concerns about ops overhead and failover stability.',
    myRole: 'Senior Backend Engineer / Tech Lead',
    actions: 'Scheduled a private 1-on-1 to align on mutual team goals. Proposed spending 2 days writing an empirical benchmark with 10,000 concurrent writes comparing Postgres-Redis vs the graph cluster.',
    decision: 'Used empirical latency and operational failover benchmarks rather than rhetorical argument or executive escalation.',
    tradeoffs: 'Accepted slightly more complex recursive SQL queries on Postgres in exchange for zero new cluster licensing costs and 14ms p99 latency.',
    outcome: 'Tech lead enthusiastically accepted the benchmarked hybrid design. Shipped Black Friday release on schedule with zero alerts.',
    metrics: [
      '14ms p99 latency achieved vs 180ms failover spike on graph cluster',
      'Saved $4,000/month in specialized cluster licensing',
      '0 downtime or alerts across Black Friday peak volume'
    ],
    skills: ['Stakeholder Management', 'Architecture Trade-offs', 'RFC Consensus', 'Data-driven Benchmarking', 'Constructive Disagreement'],
    domains: ['Enterprise SaaS', 'Fintech & Payments'],
    roles: ['Software Engineering'],
    tags: ['conflict', 'benchmarking', 'postgres', 'redis', 'architecture'],
    linkedQuestionIds: ['q-star-disagreement'],
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-09-02T11:15:00.000Z',
  },
  {
    id: 'ev-pricing-tier-experiment',
    title: 'Self-Serve Checkout Expansion Under Incomplete Telemetry',
    shortSummary: 'Navigated conflicting executive opinions on a new tiered pricing model by framing it as a two-way door decision and launching a painted-door prototype.',
    category: 'Experiments',
    context: 'Executive team was deadlocked over whether to add a $49/mo self-serve tier. Sales worried about cannibalizing $500/mo contracts; growth team wanted inbound self-serve volume. We had zero empirical conversion data.',
    myRole: 'Senior Product Manager (Growth)',
    actions: 'Framed the decision using the Type 1 vs Type 2 door framework. Stated 3 explicit falsifiable assumptions and launched a painted-door test with synthetic checkout screens.',
    decision: 'Shipped a 2-week painted-door experiment with strict tripwire rollback metrics instead of waiting months for perfect customer survey telemetry.',
    tradeoffs: 'Accepted minor customer confusion on mock upgrade modal vs burning 8 engineering weeks building backend billing prematurely.',
    outcome: 'Validated 18% trial-to-paid conversion lift; identified and patched a 35% mobile checkout drop-off within 48 hours before writing full backend logic.',
    metrics: [
      '+18% conversion lift in 30-day trial cohort',
      '48-hour patch turnaround on mobile checkout drop-off',
      'Saved 8 weeks of senior engineering roadmap from unvalidated features'
    ],
    skills: ['Hypothesis Testing', 'Ambiguity Framing', 'Type 1 vs Type 2 Decisions', 'Tripwire Guardrails', 'Product Strategy'],
    domains: ['Enterprise SaaS', 'E-Commerce & Retail'],
    roles: ['Product Management'],
    tags: ['experiment', 'growth', 'ambiguity', 'pricing', 'plg'],
    linkedQuestionIds: ['q-pm-ambiguity-decision', 'q-pm-feature-prioritization'],
    createdAt: '2026-08-20T14:20:00.000Z',
    updatedAt: '2026-09-03T16:45:00.000Z',
  },
  {
    id: 'ev-payment-idempotency',
    title: 'Core Payment Gateway Idempotency & Latency Optimization',
    shortSummary: 'Engineered an at-most-once financial transaction pipeline with atomic Redis locks and immutable PostgreSQL unique constraints.',
    category: 'Technical Decisions',
    context: 'Mobile shoppers on flaky cell connections frequently retried checkouts after network dropouts, risking disastrous double charges on credit cards.',
    myRole: 'Senior Software Engineer (Fintech Core)',
    actions: 'Enforced client-side UUID Idempotency-Key headers, atomic Redis distributed locking with SET NX EX 30, and immutable serializable transactions.',
    decision: 'Implemented Redis-cached response replay for retries while keeping durable database constraints as the authoritative source of truth.',
    tradeoffs: 'Added 2ms latency per write request for Redis lock acquisition to completely eliminate catastrophic double-charge hazards.',
    outcome: 'Zero duplicate charges recorded over $45M processed annual volume, and cached replay responses served in 85ms.',
    metrics: [
      '0 duplicate charges across $45,000,000 processed volume',
      '85ms P99 replay latency for retried requests',
      '100% automated reconciliation audit accuracy'
    ],
    skills: ['Distributed Systems', 'Redis SET NX', 'PostgreSQL Serializable Transactions', 'Idempotency', 'API Gateway Resilience'],
    domains: ['Fintech & Payments'],
    roles: ['Software Engineering'],
    tags: ['payments', 'idempotency', 'redis', 'security', 'fintech'],
    linkedQuestionIds: ['q-tech-idempotency'],
    createdAt: '2026-08-05T08:30:00.000Z',
    updatedAt: '2026-08-28T12:00:00.000Z',
  },
  {
    id: 'ev-tech-debt-billing',
    title: 'Billing Engine Modularization & Capacity Negotiation',
    shortSummary: 'Overcame team burnout and recurring Friday deployment regressions by negotiating a 20% sprint refactoring capacity using Cost of Delay metrics.',
    category: 'Leadership',
    context: 'Legacy billing code was causing 140 engineer-hours of quarterly hotfix toil. Product leadership resisted feature delays for cleanup work.',
    myRole: 'Staff Software Engineer / Tech Lead',
    actions: 'Gathered telemetry on hotfix hours, translated technical debt into dollar cost of delay, and negotiated a structured 20% capacity allocation across 3 sprints.',
    decision: 'Refactored incrementally behind clean interfaces using the Boy Scout rule rather than demanding a 3-month total feature freeze.',
    tradeoffs: 'Postponed non-critical cosmetic UI enhancements by 2 weeks to bulletproof the core multi-currency payment pipeline.',
    outcome: 'Customer defect rate dropped by 45%, PR review cycle compressed from 4 days to 6 hours, and shipped multi-currency on schedule.',
    metrics: [
      '-45% reduction in customer-facing defect rate',
      'PR review/test cycle time compressed from 4 days to 6 hours',
      '140 engineer-hours reclaimed per quarter from hotfix toil'
    ],
    skills: ['Technical Debt Management', 'Cost of Delay', 'Refactoring', 'Capacity Allocation', 'Executive Persuasion'],
    domains: ['Enterprise SaaS', 'Fintech & Payments'],
    roles: ['Software Engineering', 'Product Management'],
    tags: ['leadership', 'technical-debt', 'refactor', 'cost-of-delay'],
    linkedQuestionIds: ['q-tech-debt-velocity'],
    createdAt: '2026-08-12T11:00:00.000Z',
    updatedAt: '2026-09-02T18:10:00.000Z',
  },
  {
    id: 'ev-partnership-integration',
    title: 'Partnership Integration with Third-Party Logistics Providers',
    shortSummary: 'Integrated 3 external carrier APIs with ambiguous SLAs by building contract testing mocks and progressive decoupling.',
    category: 'Stakeholder',
    context: 'Enterprise sales promised 3 new shipping carrier integrations in Q4. However, the partners’ API specifications were missing error codes and SLA definitions.',
    myRole: 'Technical Product Manager',
    actions: 'Hosted weekly technical syncs with external provider engineers, established strict OpenAPI mock servers, and defined fallback SLA boundaries.',
    decision: 'Decoupled carrier live rate lookups with cached asynchronous fallbacks to prevent third-party outages from crashing our checkout.',
    tradeoffs: 'Provided estimated rates during partner timeouts instead of failing the user order.',
    outcome: 'Launched all 3 logistics partners within the target quarter, unlocking $1.2M in annual enterprise customer contracts.',
    metrics: [
      '3 logistics partners integrated within 1 quarter',
      '$1,200,000 in unlocked enterprise contract ARR',
      'Add a concrete metric for API timeout fallback frequency if available.'
    ],
    skills: ['Partner API SLAs', 'Contract Testing', 'Agile De-scoping', 'External Stakeholder Management'],
    domains: ['Enterprise SaaS', 'E-Commerce & Retail'],
    roles: ['Product Management'],
    tags: ['stakeholder', 'partnership', 'carrier-api', 'enterprise'],
    linkedQuestionIds: ['q-star-disagreement', 'q-pm-feature-prioritization'],
    createdAt: '2026-08-25T15:00:00.000Z',
    updatedAt: '2026-09-03T10:00:00.000Z',
  },
  {
    id: 'ev-onboarding-churn-diagnostics',
    title: 'Customer Onboarding Funnel Overhaul via Progressive Disclosure',
    shortSummary: 'Lowered new user cognitive overload by redesigning setup flows with progressive disclosure while preserving power-user keyboard speed.',
    category: 'Customer Insights',
    context: 'Telemetry revealed a 45% Day-1 drop-off rate on complex query configuration, while expert users demanded rapid muscle-memory shortcuts.',
    myRole: 'Product Designer & PM Lead',
    actions: 'Conducted 12 contextual user interviews, segmented cohorts into novices vs analysts, and introduced a Command Palette (Cmd+K) alongside a clean setup wizard.',
    decision: 'Implemented progressive disclosure with an opt-in beta toggle rather than forcing a disruptive sudden redesign.',
    tradeoffs: 'Maintained two UI presentation layers for 30 days during the opt-in transition period.',
    outcome: 'Onboarding completion surged by 38% while power-user task completion time remained unaffected.',
    metrics: [
      '+38% new user onboarding activation rate',
      '70% command palette adoption among veteran power users',
      '45% reduction in setup-related support tickets'
    ],
    skills: ['Progressive Disclosure', 'User Research', 'Cohort Analysis', 'Telemetry Analytics', 'Change Management'],
    domains: ['Enterprise SaaS'],
    roles: ['UI/UX & Product Design', 'Product Management'],
    tags: ['customer-insights', 'progressive-disclosure', 'onboarding', 'cmd-k'],
    linkedQuestionIds: ['q-design-system-friction', 'q-pm-feature-prioritization'],
    createdAt: '2026-08-18T13:45:00.000Z',
    updatedAt: '2026-09-01T09:30:00.000Z',
  },
  {
    id: 'ev-k8s-canary-rollouts',
    title: 'Kubernetes Automated Canary Pipeline & Metric Rollbacks',
    shortSummary: 'Architected automated zero-downtime Kubernetes canary rollouts using Argo Rollouts with automated Prometheus metric analysis.',
    category: 'Product Decisions',
    context: 'Manual deployments at 50,000 req/s caused intermittent connection drops during pod restarts, requiring on-call engineers to manually review logs.',
    myRole: 'Senior DevOps / SRE Lead',
    actions: 'Configured preStop connection-draining hooks, Argo Rollouts canary traffic splitting (5% → 25% → 50% → 100%), and automated metric queries.',
    decision: 'Enforced automated rollback if HTTP 5xx error rate exceeds 0.1% during the canary evaluation window.',
    tradeoffs: 'Deployments take 15 minutes instead of 3 minutes, but production incidents caused by bad deployments dropped to near zero.',
    outcome: 'Cut deployment change failure rate to < 0.2% and automated rollback execution to within 45 seconds of threshold breaches.',
    metrics: [
      '< 0.2% change failure rate across 400+ production releases',
      '45-second automated rollback execution upon anomaly detection',
      '0 connection drop 502 errors during high-load deployments'
    ],
    skills: ['Argo Rollouts', 'Kubernetes', 'Prometheus Alerting', 'Canary Rollouts', 'SRE Reliability'],
    domains: ['Cloud Infrastructure & DevOps'],
    roles: ['DevOps & Cloud', 'Software Engineering'],
    tags: ['devops', 'kubernetes', 'canary', 'prometheus', 'automation'],
    linkedQuestionIds: ['q-devops-zero-downtime'],
    createdAt: '2026-08-14T16:00:00.000Z',
    updatedAt: '2026-09-02T12:00:00.000Z',
  }
];

export const INITIAL_STORIES: CandidateStory[] = [
  {
    id: 'story-crm-migration',
    title: 'CRM Migration & Data Pipeline Modernization',
    evidenceId: 'ev-crm-migration',
    bestFor: ['Conflict', 'Ambiguity', 'Decision Making', 'Scale'],
    relevantRoles: ['PM', 'Growth PM', 'Software Engineering', 'Staff Architect'],
    skills: ['Stakeholder Management', 'Communication', 'Product Operations', 'Zero-Downtime Migration'],
    metricsStatus: 'Available',
    metrics: [
      '12,000,000 customer records synchronized',
      '0 seconds unplanned downtime across 3 enterprise tenants',
      '99.999% data verification parity in dual-run phase'
    ],
    evidenceQuality: 'Strong evidence',
    synopsis: 'Migrated 12M customer records to Postgres using real-time CDC. Overcame enterprise tenant fears through rigorous dual-run verification.',
    context: 'Legacy CRM was blocking customer growth with 4s query lags, but business partners feared data corruption from weekend cutovers.',
    myRole: 'Lead Platform Engineer & Project Owner',
    actions: 'Aligned sales operations and engineering on a zero-downtime Kafka CDC strategy, established automated parity checks, and executed seamless cutover.',
    decision: 'Dual-run CDC over high-risk multi-hour maintenance freeze.',
    tradeoffs: 'Spent 3 weeks building custom verification tools to preserve 100% business uptime.',
    outcome: 'Shipped migration with zero downtime, verified 99.999% parity, and decommissioned $35k/mo legacy software.',
    linkedQuestionIds: ['q-star-disagreement', 'q-devops-zero-downtime', 'q-pm-ambiguity-decision'],
    createdAt: '2026-08-10T09:00:00.000Z',
    updatedAt: '2026-09-01T14:30:00.000Z',
  },
  {
    id: 'story-conflict-engineering',
    title: 'Microservices Split vs Monolith Benchmarking',
    evidenceId: 'ev-conflict-engineering',
    bestFor: ['Conflict', 'Leadership', 'Decision Making'],
    relevantRoles: ['Software Engineering', 'Tech Lead', 'Staff Engineer'],
    skills: ['Stakeholder Management', 'Communication', 'RFC Writing', 'Benchmarking'],
    metricsStatus: 'Available',
    metrics: [
      '14ms p99 query latency achieved',
      '$4,000/month saved in licensing',
      '0 alerts across Black Friday peak'
    ],
    evidenceQuality: 'Strong evidence',
    synopsis: 'Navigated an architectural dispute with a tech lead by creating an objective 2-day benchmark rather than engaging in dogmatic debate.',
    context: 'Tech lead wanted a graph database cluster that would introduce significant operational risk and high license costs.',
    myRole: 'Senior Backend Engineer',
    actions: 'Organized a private 1-on-1, ran load test simulations comparing Postgres-Redis with Graph DB, and authored a collaborative RFC.',
    decision: 'Ground decisions in empirical production metrics rather than opinion.',
    tradeoffs: 'Tuned recursive SQL queries instead of adopting native graph traversal.',
    outcome: 'Tech lead adopted recommendation with complete alignment; zero incidents during peak shopping weekend.',
    linkedQuestionIds: ['q-star-disagreement'],
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-09-02T11:15:00.000Z',
  },
  {
    id: 'story-pricing-experiment',
    title: 'Self-Serve Pricing Tier Experiment',
    evidenceId: 'ev-pricing-tier-experiment',
    bestFor: ['Ambiguity', 'Decision Making', 'Failure', 'Leadership'],
    relevantRoles: ['PM', 'Growth PM'],
    skills: ['Hypothesis Testing', 'Ambiguity Framing', 'Tripwire Metrics', 'Cross-Functional Alignment'],
    metricsStatus: 'Available',
    metrics: [
      '+18% conversion lift in trial cohort',
      '48-hour mobile checkout bug turnaround',
      '8 weeks engineering preserved'
    ],
    evidenceQuality: 'Strong evidence',
    synopsis: 'Broke executive deadlock on a new pricing tier by treating it as a reversible Type-2 decision with a painted-door experiment.',
    context: 'Sales feared cannibalization; growth wanted self-serve. Zero empirical telemetry existed.',
    myRole: 'Senior Product Manager (Growth)',
    actions: 'Framed decision reversibility, deployed synthetic upgrade screen test, and monitored cohort conversion with automated tripwires.',
    decision: 'Launch low-cost test before committing 8 weeks of engineering capital.',
    tradeoffs: 'Risked minor customer questions to de-risk massive product investment.',
    outcome: 'Demonstrated 18% lift with low sales overlap; rolled out tier successfully.',
    linkedQuestionIds: ['q-pm-ambiguity-decision', 'q-pm-feature-prioritization'],
    createdAt: '2026-08-20T14:20:00.000Z',
    updatedAt: '2026-09-03T16:45:00.000Z',
  },
  {
    id: 'story-partnership-project',
    title: 'Logistics Carrier Partnership Integration',
    evidenceId: 'ev-partnership-integration',
    bestFor: ['Conflict', 'Leadership', 'Ambiguity'],
    relevantRoles: ['PM', 'Technical PM', 'Engineering Manager'],
    skills: ['Stakeholder Management', 'Communication', 'Contract Negotiation', 'Agile De-scoping'],
    metricsStatus: 'Missing',
    metrics: [
      '3 logistics partners integrated within 1 quarter',
      '$1.2M annual enterprise contract revenue',
      'Add a concrete metric for API timeout fallback frequency if available.'
    ],
    evidenceQuality: 'Needs metrics',
    synopsis: 'Managed external partner developers who were slipping deadlines and delivering inconsistent API contracts.',
    context: 'Three logistics partners had incomplete schemas that threatened holiday shipping launches.',
    myRole: 'Technical Product Manager',
    actions: 'Instituted mock contract testing, established clear SLA fallback boundaries, and de-scoped live telemetry to unblock launch.',
    decision: 'Graceful fallback to cached rates when partner API response times breached 2 seconds.',
    tradeoffs: 'Used static cached rates during partner outages to preserve checkout conversion.',
    outcome: 'Delivered all three partner carriers on time, securing $1.2M in annual contracts.',
    linkedQuestionIds: ['q-star-disagreement', 'q-pm-feature-prioritization'],
    createdAt: '2026-08-25T15:00:00.000Z',
    updatedAt: '2026-09-03T10:00:00.000Z',
  },
  {
    id: 'story-tech-debt-payoff',
    title: 'Billing Tech Debt Payoff & Capacity Negotiation',
    evidenceId: 'ev-tech-debt-billing',
    bestFor: ['Failure', 'Leadership', 'Decision Making'],
    relevantRoles: ['Staff Engineer', 'Tech Lead', 'PM'],
    skills: ['Stakeholder Management', 'Cost of Delay', 'Refactoring', 'Capacity Allocation'],
    metricsStatus: 'Available',
    metrics: [
      '-45% defect rate reduction',
      'PR review cycle compressed 4 days → 6 hours',
      '140 engineer-hours saved quarterly'
    ],
    evidenceQuality: 'Strong evidence',
    synopsis: 'Turned around a fragile billing monolith by framing technical debt as business Cost of Delay to win 20% sprint refactoring capacity.',
    context: 'Frequent billing regressions were eating 140 hours a quarter, but product leaders resisted code cleanup.',
    myRole: 'Staff Software Engineer',
    actions: 'Calculated financial Cost of Delay, proposed a pragmatic 20% capacity compromise, and modularized billing logic with automated tests.',
    decision: 'Incremental Boy Scout refactoring instead of demanding an unrealistic 3-month feature freeze.',
    tradeoffs: 'Deferred cosmetic features to safeguard financial transactions.',
    outcome: 'Halved defect rates and delivered multi-currency expansion on time without downtime.',
    linkedQuestionIds: ['q-tech-debt-velocity'],
    createdAt: '2026-08-12T11:00:00.000Z',
    updatedAt: '2026-09-02T18:10:00.000Z',
  },
  {
    id: 'story-onboarding-progressive-disclosure',
    title: 'Product Workflow Redesign & Progressive Disclosure',
    evidenceId: 'ev-onboarding-churn-diagnostics',
    bestFor: ['Conflict', 'Ambiguity', 'Customer Insights'],
    relevantRoles: ['PM', 'Product Designer', 'UI/UX Lead'],
    skills: ['Stakeholder Management', 'Communication', 'Progressive Disclosure', 'User Research'],
    metricsStatus: 'Available',
    metrics: [
      '+38% onboarding activation rate',
      '70% command palette adoption among power users',
      '-45% support tickets'
    ],
    evidenceQuality: 'Strong evidence',
    synopsis: 'Balanced the competing needs of power users and beginners by redesigning the interface with progressive disclosure and Cmd+K shortcuts.',
    context: 'New users dropped off by 45% due to UI complexity, while vocal power users resisted any changes to their shortcuts.',
    myRole: 'Product Designer & PM Lead',
    actions: 'Conducted cohort interviews, designed progressive disclosure layers, introduced a command palette, and launched an opt-in beta.',
    decision: 'Opt-in dual interface transition period to reduce change aversion.',
    tradeoffs: 'Maintained two UI presentation states for 30 days during transition.',
    outcome: 'Surged activation by 38% while winning power user praise.',
    linkedQuestionIds: ['q-design-system-friction', 'q-pm-feature-prioritization'],
    createdAt: '2026-08-18T13:45:00.000Z',
    updatedAt: '2026-09-01T09:30:00.000Z',
  }
];

export const INITIAL_BLUEPRINTS: StructuredAnswerBlueprint[] = [
  {
    id: 'bp-star-conflict-engineering',
    title: 'STAR Blueprint: Technical Disagreement with Tech Lead',
    questionId: 'q-star-disagreement',
    questionText: 'Tell me about a time you strongly disagreed with a technical or architectural decision proposed by a tech lead or product partner. How did you handle it, and what was the outcome?',
    storyId: 'story-conflict-engineering',
    storyTitle: 'Microservices Split vs Monolith Benchmarking',
    framework: 'STAR',
    components: {
      openingHook: 'I believe technical disagreements are healthy when grounded in objective production benchmarks rather than dogma or seniority.',
      situation: 'Our tech lead proposed migrating user session store to a distributed graph database for upcoming social features.',
      task: 'Evaluate operational stability, licensing costs, and failover complexity while preserving strong team trust.',
      action: [
        'Organized a private 1-on-1 rather than debating in public Slack channels to avoid ego friction.',
        'Proposed an empirical 2-day benchmark simulating 10,000 concurrent writes on both Postgres and Graph DB.',
        'Authored an objective RFC comparing p99 latency, backup tooling, and operational overhead.'
      ],
      result: [
        'Postgres with Redis achieved 14ms p99 query latency vs 180ms failover spikes on the graph cluster.',
        'Tech lead appreciated the objective data and agreed to the hybrid Postgres-Redis design.',
        'Shipped on schedule, sustained Black Friday without an alert, and saved $4,000/month in specialized licenses.'
      ],
      keyCues: [
        'Private 1-on-1 alignment (no public ego confrontation)',
        '2-day empirical benchmark (data over dogma)',
        'Collaborative RFC with clear compromise',
        '14ms p99 latency & $4k/mo licensing savings'
      ],
      avoidCues: [
        'Do not frame the tech lead as foolish or obstinate',
        'Avoid theoretical arguments without concrete numbers'
      ]
    },
    metrics: ['14ms p99 vs 180ms failover', '$4,000/mo saved in licensing', '0 alerts on Black Friday'],
    targetDurationSeconds: 150,
    targetRole: 'Software Engineering',
    roleCategory: 'Software Engineering',
    targetJob: 'Staff Backend Architect',
    targetCompany: 'Stripe',
    domain: 'Fintech & Payments',
    tags: ['conflict', 'architecture', 'benchmarking'],
    assignedRoles: ['Engineering Lead', 'Technical Interviewer', 'Peer', 'Hiring Manager'],
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-09-03T12:00:00.000Z',
  },
  {
    id: 'bp-pdi-ambiguity-pricing',
    title: 'Problem → Decision → Impact: Self-Serve Pricing Tier',
    questionId: 'q-pm-ambiguity-decision',
    questionText: 'How do you handle situations where you have to make a high-impact product or architectural decision without enough data?',
    storyId: 'story-pricing-experiment',
    storyTitle: 'Self-Serve Pricing Tier Experiment',
    framework: 'Problem → Decision → Impact',
    components: {
      openingHook: 'When data is incomplete, I first categorize whether the decision is a Type 1 irreversible door or a Type 2 reversible door to prevent analysis paralysis.',
      problem: 'The executive team deadlocked on introducing a $49/month self-serve tier. Sales feared cannibalizing $500/month deals; growth wanted self-serve volume. We had zero empirical conversion history.',
      decision: 'Classified the decision as a two-way door. Designed a 2-week painted-door experiment with explicit hypothesis criteria and automated tripwires before writing backend billing code.',
      tradeoffs: [
        'Risked minor confusion on mock tier modal vs burning 8 weeks of senior engineering capital.',
        'Set an automated tripwire: if enterprise pipeline churned by > 3%, immediate experiment pause.'
      ],
      impact: [
        'Discovered a +18% conversion lift with near-zero overlap with sales deals.',
        'Identified and patched a critical 35% mobile checkout funnel drop-off in 48 hours.',
        'Preserved 8 weeks of engineering roadmap to build only what customers actually paid for.'
      ],
      keyCues: [
        'Type 1 vs Type 2 door framework',
        'Painted-door experiment with tripwire metrics',
        'Rapid 48-hour mobile drop-off fix',
        '+18% conversion lift validated'
      ],
      avoidCues: [
        'Never say you waited months for perfect survey data',
        'Do not take unmonitored reckless risks without tripwires'
      ]
    },
    metrics: ['+18% conversion lift', '48-hour patch turnaround', '8 weeks engineering saved'],
    targetDurationSeconds: 140,
    targetRole: 'Product Management',
    roleCategory: 'Product Management',
    targetJob: 'Senior Growth PM',
    targetCompany: 'Ramp',
    domain: 'Enterprise SaaS',
    tags: ['pricing', 'ambiguity', 'experimentation'],
    assignedRoles: ['Product Manager', 'Cross-functional Partner', 'Executive', 'Hiring Manager'],
    createdAt: '2026-08-22T14:00:00.000Z',
    updatedAt: '2026-09-02T16:00:00.000Z',
  },
  {
    id: 'bp-car-crm-migration',
    title: 'CAR Blueprint: Zero-Downtime CRM Migration',
    questionId: 'q-devops-zero-downtime',
    questionText: 'How do you design a CI/CD deployment pipeline for a high-traffic Kubernetes cluster that guarantees zero-downtime rollouts and instant automated rollbacks if error rates spike?',
    storyId: 'story-crm-migration',
    storyTitle: 'CRM Migration & Data Pipeline Modernization',
    framework: 'CAR',
    components: {
      openingHook: 'In production platform migrations, zero downtime isn’t a luxury—it is an architectural contract with customers.',
      context: 'Migrating 12M customer records from a brittle legacy CRM to Postgres. Enterprise contracts strictly forbade any multi-hour weekend outages.',
      action: [
        'Implemented real-time Change Data Capture (CDC) with Debezium and Kafka for continuous replication.',
        'Ran a 3-week dual-run validation pipeline verifying checksum parity across all records.',
        'Automated instant DNS failover with zero dropped HTTP connections.'
      ],
      result: [
        'Executed complete cutover with 0 seconds unplanned downtime.',
        'Achieved 99.999% audit data verification parity across 12M records.',
        'Eliminated $35k/month in legacy licensing fees.'
      ],
      keyCues: [
        'Debezium CDC + Kafka dual-run stream',
        'Checksum verification parity',
        '0 seconds downtime & $35k/mo license savings'
      ]
    },
    metrics: ['12M customer records', '0s unplanned downtime', '99.999% data verification parity'],
    targetDurationSeconds: 120,
    targetRole: 'Software Engineering',
    roleCategory: 'Software Engineering',
    targetJob: 'Lead Platform Engineer',
    targetCompany: 'Robinhood',
    domain: 'Cloud Infrastructure & DevOps',
    tags: ['zero-downtime', 'kafka', 'migration', 'cdc'],
    assignedRoles: ['Engineering Lead', 'Technical Interviewer'],
    createdAt: '2026-08-24T16:30:00.000Z',
    updatedAt: '2026-09-01T11:00:00.000Z',
  },
  {
    id: 'bp-custom-tech-debt',
    title: 'Custom Blueprint: Cost of Delay Tech Debt Negotiation',
    questionId: 'q-tech-debt-velocity',
    questionText: 'Tell me about a time you had to balance aggressive product feature deadlines against accumulating technical debt. How did you negotiate and execute the technical payoff?',
    storyId: 'story-tech-debt-payoff',
    storyTitle: 'Billing Tech Debt Payoff & Capacity Negotiation',
    framework: 'Custom',
    components: {
      context: 'Frequent billing regressions were eating 140 hours a quarter, causing developer churn and blocking international currency launches.',
      solutionAndImpact: 'Framed tech debt as business Cost of Delay instead of code cleanliness. Negotiated an incremental 20% refactor tax per sprint rather than demanding an unrealistic 3-month feature freeze. Modularized the billing engine behind clean interfaces, reducing defect rates by 45% and compressing PR review cycles from 4 days to 6 hours.',
      keyCues: [
        'Cost of Delay calculation (140 hours)',
        '20% capacity compromise',
        'Defects dropped 45%, PR review 4 days → 6 hours'
      ]
    },
    metrics: ['-45% defect rate', '140 engineer-hours saved', 'PR cycle 4 days → 6 hours'],
    targetDurationSeconds: 150,
    targetRole: 'Software Engineering',
    roleCategory: 'Software Engineering',
    targetJob: 'Staff Systems Architect',
    targetCompany: 'Datadog',
    domain: 'Enterprise SaaS',
    tags: ['cost-of-delay', 'tech-debt', 'negotiation', 'velocity'],
    assignedRoles: ['Engineering Lead', 'Product Manager', 'Hiring Manager'],
    createdAt: '2026-08-26T12:00:00.000Z',
    updatedAt: '2026-09-03T09:00:00.000Z',
  },
  {
    id: 'bp-star-payment-idempotency',
    title: 'STAR Blueprint: Payment Idempotency & Concurrency',
    questionId: 'q-payment-idempotency',
    questionText: 'Tell me about a high-stakes production system failure or race condition you diagnosed and resolved under pressure.',
    storyId: 'story-payment-idempotency',
    storyTitle: 'Core Payment Gateway Idempotency',
    framework: 'STAR',
    components: {
      situation: 'A double-charge race condition triggered when mobile users tapped "Pay Now" repeatedly during 3G connectivity drops, causing customer escalations.',
      task: 'Design an idempotent payment architecture with zero double charges and under 100ms response time.',
      action: [
        'Implemented Redis atomic distributed locking using cryptographically random idempotency keys from client requests.',
        'Cached finalized transaction payloads with 24-hour TTL to return instant replay responses for retried checkouts.',
        'Introduced automated synthetic chaos testing to simulate packet loss and concurrent identical webhook retries.'
      ],
      result: [
        'Eliminated double charges completely: 0 duplicates across $45M in annual volume.',
        'P99 replay response latency dropped to 85ms.',
        'Standardized the idempotency library across all backend checkout services.'
      ],
      keyCues: [
        'Atomic Redis distributed lock',
        '24-hour TTL payload cache',
        '0 duplicates across $45M volume'
      ]
    },
    metrics: ['0 duplicates across $45M volume', '85ms P99 replay latency', '100% test coverage'],
    targetDurationSeconds: 140,
    targetRole: 'Software Engineering',
    roleCategory: 'Software Engineering',
    targetJob: 'Senior Distributed Systems Engineer',
    targetCompany: 'Stripe',
    domain: 'Fintech & Payments',
    tags: ['idempotency', 'race-conditions', 'redis', 'payments'],
    assignedRoles: ['Technical Interviewer', 'Engineering Lead', 'Peer'],
    createdAt: '2026-08-28T14:00:00.000Z',
    updatedAt: '2026-09-03T10:00:00.000Z',
  },
  {
    id: 'bp-custom-career-trajectory',
    title: 'Custom Blueprint: Career Evolution & Technical Philosophy',
    questionId: 'q-career-motivation',
    questionText: 'Walk me through your background, your transition into staff-level technical architecture, and what you look for in your next role.',
    storyId: 'story-onboarding-progressive-disclosure',
    storyTitle: 'Career Evolution & Staff Architecture',
    framework: 'Custom',
    components: {
      context: 'Over 8+ years, evolved from full-stack engineer building user-facing features to staff platform architect leading multi-team infrastructure decisions, payment reliability, and capacity planning.',
      solutionAndImpact: 'Specialized in high-concurrency distributed systems, technical debt negotiation using business cost-of-delay, and mentoring senior engineers. Seeking a high-trust role with deep platform ownership and mission-critical scale.'
    },
    metrics: ['8+ years experience', 'Owned $45M/yr payment pipeline', 'Mentored 12+ engineers'],
    targetDurationSeconds: 130,
    targetRole: 'Software Engineering',
    roleCategory: 'Software Engineering',
    targetJob: 'Staff Backend Architect',
    targetCompany: 'Fintech / Enterprise',
    domain: 'Enterprise SaaS',
    tags: ['career', 'trajectory', 'leadership', 'philosophy'],
    assignedRoles: ['Recruiter', 'Hiring Manager', 'Executive'],
    createdAt: '2026-08-29T10:00:00.000Z',
    updatedAt: '2026-09-03T11:00:00.000Z',
  }
];

export const INITIAL_METRICS: MetricLedgerItem[] = [
  {
    id: 'm-1',
    metric: '12,000,000 customer records synchronized with zero downtime',
    value: '12M records',
    metricType: 'Scale & Volume',
    sourceEvidenceId: 'ev-crm-migration',
    sourceTitle: 'CRM Migration & Data Pipeline Modernization',
    verificationStatus: 'Verified',
    notes: 'Verified against database audit checksums during dual-run CDC phase.'
  },
  {
    id: 'm-2',
    metric: '0 seconds unplanned downtime across 3 enterprise tenants',
    value: '0s downtime',
    metricType: 'Reliability & Uptime',
    sourceEvidenceId: 'ev-crm-migration',
    sourceTitle: 'CRM Migration & Data Pipeline Modernization',
    verificationStatus: 'Verified',
    notes: 'Zero dropped connections during cutover window.'
  },
  {
    id: 'm-3',
    metric: '$35,000 monthly legacy license savings after decommission',
    value: '$420,000 / yr',
    metricType: 'Cost & Revenue',
    sourceEvidenceId: 'ev-crm-migration',
    sourceTitle: 'CRM Migration & Data Pipeline Modernization',
    verificationStatus: 'Verified',
    notes: 'Decommissioned legacy CRM vendor contracts.'
  },
  {
    id: 'm-4',
    metric: '14ms p99 query latency achieved vs 180ms failover on graph cluster',
    value: '14ms p99',
    metricType: 'Efficiency & Latency',
    sourceEvidenceId: 'ev-conflict-engineering',
    sourceTitle: 'Microservices Split vs Monolith Benchmarking',
    verificationStatus: 'Verified',
    notes: 'Load test benchmark with 10k concurrent simulated writes.'
  },
  {
    id: 'm-5',
    metric: '0 duplicate charges across $45M annual transaction volume',
    value: '0 duplicates / $45M',
    metricType: 'Reliability & Uptime',
    sourceEvidenceId: 'ev-payment-idempotency',
    sourceTitle: 'Core Payment Gateway Idempotency',
    verificationStatus: 'Verified',
    notes: 'Zero double charges recorded in audit ledger.'
  },
  {
    id: 'm-6',
    metric: '85ms P99 replay response latency for retried checkout requests',
    value: '85ms P99',
    metricType: 'Efficiency & Latency',
    sourceEvidenceId: 'ev-payment-idempotency',
    sourceTitle: 'Core Payment Gateway Idempotency',
    verificationStatus: 'Verified',
    notes: 'Redis cached response payload served directly.'
  },
  {
    id: 'm-7',
    metric: '+18% trial-to-paid conversion lift in 30-day cohort',
    value: '+18% lift',
    metricType: 'Customer Impact',
    sourceEvidenceId: 'ev-pricing-tier-experiment',
    sourceTitle: 'Self-Serve Pricing Tier Experiment',
    verificationStatus: 'Verified',
    notes: 'Statistically significant sample across 4,200 accounts.'
  },
  {
    id: 'm-8',
    metric: '48-hour patch turnaround on mobile checkout drop-off',
    value: '48h turnaround',
    metricType: 'Team & Velocity',
    sourceEvidenceId: 'ev-pricing-tier-experiment',
    sourceTitle: 'Self-Serve Pricing Tier Experiment',
    verificationStatus: 'Verified',
    notes: 'Tripwire alert flagged conversion anomaly within 4 hours.'
  },
  {
    id: 'm-9',
    metric: '-45% customer-facing defect rate after billing refactor',
    value: '-45% defects',
    metricType: 'Reliability & Uptime',
    sourceEvidenceId: 'ev-tech-debt-billing',
    sourceTitle: 'Billing Engine Modularization',
    verificationStatus: 'Verified',
    notes: 'Tracked across 90 days following 20% capacity allocation.'
  },
  {
    id: 'm-10',
    metric: 'PR review/test cycle time compressed from 4 days to 6 hours',
    value: '4d → 6h',
    metricType: 'Team & Velocity',
    sourceEvidenceId: 'ev-tech-debt-billing',
    sourceTitle: 'Billing Engine Modularization',
    verificationStatus: 'Verified',
    notes: 'Automated test suites replaced manual deployment verification.'
  },
  {
    id: 'm-11',
    metric: '140 engineer-hours reclaimed per quarter from hotfix toil',
    value: '140h / quarter',
    metricType: 'Team & Velocity',
    sourceEvidenceId: 'ev-tech-debt-billing',
    sourceTitle: 'Billing Engine Modularization',
    verificationStatus: 'Estimated',
    notes: 'Based on sprint ticket tagging and time-tracking audits.'
  },
  {
    id: 'm-12',
    metric: '3 logistics partners integrated within single target quarter',
    value: '3 partners',
    metricType: 'Scale & Volume',
    sourceEvidenceId: 'ev-partnership-integration',
    sourceTitle: 'Logistics Carrier Partnership Integration',
    verificationStatus: 'Verified',
    notes: 'Shipped USPS, FedEx, and DHL integrations.'
  },
  {
    id: 'm-13',
    metric: 'API timeout fallback frequency (Metric missing - add baseline)',
    value: 'Missing baseline',
    metricType: 'Reliability & Uptime',
    sourceEvidenceId: 'ev-partnership-integration',
    sourceTitle: 'Logistics Carrier Partnership Integration',
    verificationStatus: 'Needs Baseline',
    notes: 'Add concrete metrics for API fallback frequency to elevate story to strong evidence.'
  },
  {
    id: 'm-14',
    metric: '+38% new user onboarding activation rate',
    value: '+38% activation',
    metricType: 'Customer Impact',
    sourceEvidenceId: 'ev-onboarding-churn-diagnostics',
    sourceTitle: 'Product Workflow Redesign',
    verificationStatus: 'Verified',
    notes: 'Progressive disclosure layout measured against baseline cohort.'
  }
];

export class KnowledgeStorageService {
  // Evidence CRUD
  public static getEvidence(): EvidenceItem[] {
    const access = AccessControlService.getAccessLevel();

    if (access === 'DEMO') {
      return demoWorkspaceService.getEvidenceItems();
    }

    if (curatedBetaData.isCuratedBetaActive()) {
      return curatedBetaData.getEvidenceItems();
    }

    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(INITIAL_EVIDENCE));
      return INITIAL_EVIDENCE;
    } catch {
      return INITIAL_EVIDENCE;
    }
  }

  public static saveEvidence(items: EvidenceItem[]): void {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      demoWorkspaceService.saveEvidenceItems(items, true);
      return;
    }
    const auth = dataExposureGuard.assertWriteAuthorized('evidence', 'update');
    if (!auth.allowed) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save evidence', e);
    }
  }

  public static addOrUpdateEvidence(item: EvidenceItem): EvidenceItem[] {
    const list = this.getEvidence();
    const existingIndex = list.findIndex(i => i.id === item.id);

    if (existingIndex < 0) {
      let customCount = 0;
      const isDemo = AccessControlService.getAccessLevel() === 'DEMO';
      if (isDemo) {
        // Only check project limit when creating a Project item directly
        if (item.category === 'Projects') {
          const decision = demoWorkspaceService.canCreateEntity('projects');
          if (!decision.allowed) {
            console.warn('Project creation blocked by Demo Workspace limit:', decision.reason);
            throw new Error(decision.reason || 'Demo Workspace limit reached for Projects (2 / 2).');
          }
        }
      } else {
        try {
          const data = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
          if (data) {
            const storedList: EvidenceItem[] = JSON.parse(data);
            customCount = storedList.filter(i => !INITIAL_EVIDENCE.some(init => init.id === i.id)).length;
          }
        } catch {}

        const decision = AccessControlService.canCreateWorkflowItem('evidence', customCount);
        if (!decision.allowed) {
          console.warn('Evidence creation blocked by access control:', decision.reason);
          throw new Error(decision.reason || 'Creation restricted by active access tier.');
        }
      }
    }

    let updated: EvidenceItem[];
    const now = new Date().toISOString();
    
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = { ...item, updatedAt: now };
    } else {
      updated = [{ ...item, createdAt: now, updatedAt: now }, ...list];
    }
    this.saveEvidence(updated);
    return updated;
  }

  public static deleteEvidence(id: string): EvidenceItem[] {
    const list = this.getEvidence().filter(i => i.id !== id);
    this.saveEvidence(list);
    return list;
  }

  // Stories CRUD
  public static getStories(): CandidateStory[] {
    const tier = AccessControlService.getAccessLevel();
    if (tier === 'PUBLIC') {
      return dataExposureGuard.paginateAndProject('stories', INITIAL_STORIES.slice(0, 1), undefined, 'PUBLIC').items;
    }
    if (tier === 'GUEST') {
      return dataExposureGuard.paginateAndProject('stories', INITIAL_STORIES.slice(0, 3), undefined, 'GUEST').items;
    }
    if (tier === 'DEMO') {
      return dataExposureGuard.paginateAndProject('stories', INITIAL_STORIES.slice(0, 5), undefined, 'DEMO').items;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORIES);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
      return INITIAL_STORIES;
    } catch {
      return INITIAL_STORIES;
    }
  }

  public static saveStories(stories: CandidateStory[]): void {
    const auth = dataExposureGuard.assertWriteAuthorized('stories', 'update');
    if (!auth.allowed) return;
    if (!dataExposureGuard.canPersistFullCatalogToStorage()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
    } catch (e) {
      console.warn('Failed to save stories', e);
    }
  }

  public static addOrUpdateStory(story: CandidateStory): CandidateStory[] {
    const auth = dataExposureGuard.assertWriteAuthorized('stories', 'create');
    if (!auth.allowed) {
      return this.getStories();
    }
    const list = this.getStories();
    const existingIndex = list.findIndex(s => s.id === story.id);
    let updated: CandidateStory[];
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = { ...story, updatedAt: now };
    } else {
      updated = [{ ...story, createdAt: now, updatedAt: now }, ...list];
    }
    this.saveStories(updated);
    return updated;
  }

  public static deleteStory(id: string): CandidateStory[] {
    const auth = dataExposureGuard.assertWriteAuthorized('stories', 'delete');
    if (!auth.allowed) return this.getStories();
    const list = this.getStories().filter(s => s.id !== id);
    this.saveStories(list);
    return list;
  }

  // Blueprints CRUD
  public static getBlueprints(): StructuredAnswerBlueprint[] {
    const access = AccessControlService.getAccessLevel();

    if (access === 'DEMO') {
      return demoWorkspaceService.getQaBlueprints();
    }

    if (curatedBetaData.isCuratedBetaActive()) {
      return curatedBetaData.getBlueprints();
    }

    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLUEPRINTS);
      if (data) {
        const parsed: StructuredAnswerBlueprint[] = JSON.parse(data);
        let needsResave = false;

        // Ensure every blueprint has assignedRoles backfilled if missing
        const hydrated = parsed.map(bp => {
          if (!bp.assignedRoles || !Array.isArray(bp.assignedRoles)) {
            needsResave = true;
            const initMatch = INITIAL_BLUEPRINTS.find(ib => ib.id === bp.id);
            if (initMatch?.assignedRoles) {
              return { ...bp, assignedRoles: initMatch.assignedRoles };
            }
            if (bp.targetRole?.toLowerCase().includes('product')) {
              return { ...bp, assignedRoles: ['Product Manager', 'Cross-functional Partner'] };
            }
            return { ...bp, assignedRoles: ['Engineering Lead', 'Technical Interviewer'] };
          }
          return bp;
        });

        // Ensure default seeded blueprints exist
        for (const initBp of INITIAL_BLUEPRINTS) {
          if (!hydrated.some(h => h.id === initBp.id)) {
            hydrated.push(initBp);
            needsResave = true;
          }
        }

        if (needsResave) {
          try {
            localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(hydrated));
          } catch {
            // ignore
          }
        }

        return hydrated;
      }
      localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(INITIAL_BLUEPRINTS));
      return INITIAL_BLUEPRINTS;
    } catch {
      return INITIAL_BLUEPRINTS;
    }
  }

  public static saveBlueprints(blueprints: StructuredAnswerBlueprint[]): void {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      demoWorkspaceService.saveQaBlueprints(blueprints, true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('career_blueprints_updated'));
      }
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(blueprints));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('career_blueprints_updated'));
      }
    } catch (e) {
      console.warn('Failed to save blueprints', e);
    }
  }

  public static addOrUpdateBlueprint(blueprint: StructuredAnswerBlueprint): StructuredAnswerBlueprint[] {
    const list = this.getBlueprints();
    const existingIndex = list.findIndex(b => b.id === blueprint.id);

    if (existingIndex < 0) {
      let customCount = 0;
      if (AccessControlService.getAccessLevel() === 'DEMO') {
        customCount = demoWorkspaceService.getCategoryUsage('qa_blueprints').used;
      } else {
        try {
          const data = localStorage.getItem(STORAGE_KEYS.BLUEPRINTS);
          if (data) {
            const parsed: StructuredAnswerBlueprint[] = JSON.parse(data);
            customCount = parsed.filter(i => !INITIAL_BLUEPRINTS.some(init => init.id === i.id)).length;
          }
        } catch {}
      }

      const decision = AccessControlService.canCreateWorkflowItem('blueprints', customCount);
      if (!decision.allowed) {
        console.warn('Blueprint creation blocked by access control:', decision.reason);
        throw new Error(decision.reason || 'Creation restricted by active access tier.');
      }
    }

    let updated: StructuredAnswerBlueprint[];
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = list[existingIndex];
      // Preserve assignedRoles if not explicitly supplied or empty in update
      const assignedRoles = (blueprint.assignedRoles && blueprint.assignedRoles.length > 0)
        ? Array.from(new Set(blueprint.assignedRoles))
        : (existing.assignedRoles || []);

      updated = [...list];
      updated[existingIndex] = { 
        ...existing,
        ...blueprint, 
        assignedRoles,
        updatedAt: now 
      };
    } else {
      const assignedRoles = blueprint.assignedRoles && blueprint.assignedRoles.length > 0
        ? Array.from(new Set(blueprint.assignedRoles))
        : ['Engineering Lead', 'Technical Interviewer'];

      updated = [{ ...blueprint, assignedRoles, createdAt: now, updatedAt: now }, ...list];
    }
    this.saveBlueprints(updated);
    return updated;
  }

  public static assignBlueprintToRoles(blueprintId: string, roles: string[]): StructuredAnswerBlueprint[] {
    const list = this.getBlueprints();
    const existingIndex = list.findIndex(b => b.id === blueprintId);
    if (existingIndex < 0) return list;

    // Deduplicate roles
    const uniqueRoles = Array.from(new Set(roles.filter(Boolean)));
    const updated = [...list];
    updated[existingIndex] = {
      ...updated[existingIndex],
      assignedRoles: uniqueRoles,
      updatedAt: new Date().toISOString()
    };
    this.saveBlueprints(updated);
    return updated;
  }

  public static getBlueprintsForRole(role: string): StructuredAnswerBlueprint[] {
    const list = this.getBlueprints();
    return list.filter(b => b.assignedRoles && b.assignedRoles.includes(role));
  }

  public static deleteBlueprint(id: string): StructuredAnswerBlueprint[] {
    const list = this.getBlueprints().filter(b => b.id !== id);
    this.saveBlueprints(list);
    return list;
  }

  // Metrics Ledger CRUD
  public static getMetrics(): MetricLedgerItem[] {
    const tier = AccessControlService.getAccessLevel();
    if (tier === 'PUBLIC') {
      return dataExposureGuard.paginateAndProject('metrics', INITIAL_METRICS.slice(0, 1), undefined, 'PUBLIC').items;
    }
    if (tier === 'GUEST') {
      return dataExposureGuard.paginateAndProject('metrics', INITIAL_METRICS.slice(0, 3), undefined, 'GUEST').items;
    }
    if (tier === 'DEMO') {
      return dataExposureGuard.paginateAndProject('metrics', INITIAL_METRICS.slice(0, 5), undefined, 'DEMO').items;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.METRICS);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(INITIAL_METRICS));
      return INITIAL_METRICS;
    } catch {
      return INITIAL_METRICS;
    }
  }

  public static saveMetrics(metrics: MetricLedgerItem[]): void {
    const auth = dataExposureGuard.assertWriteAuthorized('metrics', 'update');
    if (!auth.allowed) return;
    if (!dataExposureGuard.canPersistFullCatalogToStorage()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
    } catch (e) {
      console.warn('Failed to save metrics', e);
    }
  }

  public static addOrUpdateMetric(metric: MetricLedgerItem): MetricLedgerItem[] {
    const auth = dataExposureGuard.assertWriteAuthorized('metrics', 'create');
    if (!auth.allowed) return this.getMetrics();
    const list = this.getMetrics();
    const existingIndex = list.findIndex(m => m.id === metric.id);
    let updated: MetricLedgerItem[];

    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = metric;
    } else {
      updated = [metric, ...list];
    }
    this.saveMetrics(updated);
    return updated;
  }

  public static deleteMetric(id: string): MetricLedgerItem[] {
    const auth = dataExposureGuard.assertWriteAuthorized('metrics', 'delete');
    if (!auth.allowed) return this.getMetrics();
    const list = this.getMetrics().filter(m => m.id !== id);
    this.saveMetrics(list);
    return list;
  }

  // Question ↔ Story Relationships
  public static getStoriesForQuestion(questionId: string): CandidateStory[] {
    const stories = this.getStories();
    return stories.filter(s => s.linkedQuestionIds.includes(questionId));
  }

  public static getQuestionsForStory(storyId: string): InterviewQuestion[] {
    const story = this.getStories().find(s => s.id === storyId);
    if (!story) return [];
    return QUESTIONS_DATA.filter(q => story.linkedQuestionIds.includes(q.id));
  }

  public static toggleStoryQuestionLink(storyId: string, questionId: string): CandidateStory | null {
    const stories = this.getStories();
    const story = stories.find(s => s.id === storyId);
    if (!story) return null;

    const isLinked = story.linkedQuestionIds.includes(questionId);
    let updatedQuestions: string[];
    if (isLinked) {
      updatedQuestions = story.linkedQuestionIds.filter(q => q !== questionId);
    } else {
      updatedQuestions = [...story.linkedQuestionIds, questionId];
    }

    const updatedStory: CandidateStory = {
      ...story,
      linkedQuestionIds: updatedQuestions,
      updatedAt: new Date().toISOString()
    };

    this.addOrUpdateStory(updatedStory);

    // Also update evidence if linked
    if (story.evidenceId) {
      const evidenceList = this.getEvidence();
      const evidence = evidenceList.find(e => e.id === story.evidenceId);
      if (evidence) {
        this.addOrUpdateEvidence({
          ...evidence,
          linkedQuestionIds: updatedQuestions
        });
      }
    }

    return updatedStory;
  }

  public static resetToDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(INITIAL_EVIDENCE));
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
    localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(INITIAL_BLUEPRINTS));
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(INITIAL_METRICS));
  }

  public static exportKnowledgeJson(): string {
    const exportAuth = dataExposureGuard.assertWriteAuthorized('knowledge', 'export');
    if (!exportAuth.allowed) {
      throw new Error(exportAuth.reason || 'Knowledge export requires Full Access.');
    }
    const payload = {
      evidence: this.getEvidence(),
      stories: this.getStories(),
      blueprints: this.getBlueprints(),
      metrics: this.getMetrics(),
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };
    return JSON.stringify(payload, null, 2);
  }

  public static importKnowledgeJson(jsonStr: string): boolean {
    const importAuth = dataExposureGuard.assertWriteAuthorized('knowledge', 'import');
    if (!importAuth.allowed) {
      return false;
    }
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.evidence && Array.isArray(parsed.evidence)) {
        this.saveEvidence(parsed.evidence);
      }
      if (parsed.stories && Array.isArray(parsed.stories)) {
        this.saveStories(parsed.stories);
      }
      if (parsed.blueprints && Array.isArray(parsed.blueprints)) {
        this.saveBlueprints(parsed.blueprints);
      }
      if (parsed.metrics && Array.isArray(parsed.metrics)) {
        this.saveMetrics(parsed.metrics);
      }
      return true;
    } catch (e) {
      console.error('Failed to import knowledge JSON', e);
      return false;
    }
  }
}
