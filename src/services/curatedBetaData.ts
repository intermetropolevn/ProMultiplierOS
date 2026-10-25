/**
 * CareerOS / ProMultiplier OS — Curated Public Beta Dataset Service
 * 
 * Policy: "Full-looking product, intentionally shallow public dataset."
 * - PUBLIC (L0): 1 sample record per module
 * - GUEST (L1): ~3 curated records per module
 * - DEMO (L2): Expanded curated records (up to 5) + max 2 user-created items
 * - FULL (L3): Unrestricted full catalog & unlimited creation
 */

import type { 
  JobListing, 
  RoleBlueprint, 
  CareerOpportunity, 
  SectorDomain
} from '../types';
import type { BuilderProfile, BuildOpportunity, BuildTeam } from '../types/builderMatch';
import type { StructuredAnswerBlueprint, EvidenceItem } from '../features/knowledge/types';
import type { CareerProject } from '../features/projects/types';
import { INITIAL_PROJECTS } from '../features/projects/data/seedProjects';
import type { CareerMission } from '../types/careerMission';
import { INITIAL_CAREER_MISSIONS } from '../data/careerMissionData';
import type { WorkExperienceRecord } from './workExperienceService';
import type { JobApplication } from '../features/applications/types';
import { AccessControlService } from './accessControlService';
import { dataExposureGuard, PaginationParams } from './dataExposureGuardService';
import { INITIAL_OPPORTUNITIES } from '../data/opportunitiesData';
import { JOBS_DATA } from '../data/jobsData';
import { ROLES_DATA } from '../data/rolesData';
import { INITIAL_BUILD_OPPORTUNITIES, INITIAL_BUILDERS, INITIAL_TEAMS } from '../data/builderMatchData';

// ============================================================================
// 1. JOB OPPORTUNITIES (Curated Records)
// ============================================================================
export const CURATED_JOBS: JobListing[] = [
  {
    id: 'curated-job-stripe-platform',
    title: 'Senior Platform Software Engineer',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=120&auto=format&fit=crop&q=80',
    roleCategory: 'Software Engineering',
    domain: 'Fintech & Payments',
    level: 'Senior',
    location: 'San Francisco, CA / Remote (US)',
    workMode: 'Remote',
    salaryRange: '$195,000 – $245,000 USD',
    postedDate: 'Oct 14, 2026',
    postedAt: '2026-10-14T08:00:00.000Z',
    description: 'Build mission-critical transactional pipelines, idempotency guarantees, and distributed ledgers handling billions in daily global payments.',
    keyResponsibilities: [
      'Architect zero-downtime ledger migration pipelines with automated data parity reconciliation.',
      'Enforce distributed idempotency semantics and fault-tolerant event streaming.',
      'Partner with financial compliance teams to satisfy global regulatory audit standards.'
    ],
    requiredSkills: ['Distributed Systems', 'PostgreSQL', 'Kafka', 'Go / Java', 'Idempotency'],
    niceToHaveSkills: ['CDC / Debezium', 'High-Availability Architectures'],
    externalUrl: 'https://stripe.com/jobs/senior-platform-engineer',
    externalPlatform: 'Stripe Careers',
    jobSource: 'Company Direct',
    sourceId: 'stripe-direct',
    featured: true,
    hasSpecificDeadline: true,
    applicationDeadline: '2026-11-30T23:59:59.000Z',
    deadlineType: 'explicit',
    opportunityStatus: 'active',
    status: 'active'
  },
  {
    id: 'curated-job-figma-pm',
    title: 'Lead Product Manager — Collaborative Workspaces',
    company: 'Figma',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    roleCategory: 'Product Management',
    domain: 'Enterprise SaaS',
    level: 'Lead / Staff',
    location: 'San Francisco, CA (Hybrid)',
    workMode: 'Hybrid',
    salaryRange: '$210,000 – $260,000 USD',
    postedDate: 'Oct 10, 2026',
    postedAt: '2026-10-10T10:00:00.000Z',
    description: 'Shape the future of collaborative design workflows, developer handoff integrations, and enterprise team permissions.',
    keyResponsibilities: [
      'Drive roadmap execution for multi-team collaborative workspaces and progressive permission staging.',
      'Optimize trial-to-paid activation funnels across self-serve and sales-assisted enterprise tiers.',
      'Lead cross-functional squads of engineers, designers, and user researchers.'
    ],
    requiredSkills: ['Product Strategy', 'PLG Funnels', 'User Research', 'Enterprise Permissions', 'Cohort Analysis'],
    niceToHaveSkills: ['Figma Plugin API', 'Developer Experience'],
    externalUrl: 'https://www.figma.com/careers/lead-pm-workspaces',
    externalPlatform: 'Figma Careers',
    jobSource: 'Company Direct',
    sourceId: 'figma-direct',
    featured: true,
    hasSpecificDeadline: true,
    applicationDeadline: '2026-12-15T23:59:59.000Z',
    deadlineType: 'explicit',
    opportunityStatus: 'active',
    status: 'active'
  },
  {
    id: 'curated-job-anthropic-ai',
    title: 'Senior AI Systems Engineer — Agentic Tooling',
    company: 'Anthropic',
    companyLogo: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=120&auto=format&fit=crop&q=80',
    roleCategory: 'Data & Machine Learning',
    domain: 'AI & Machine Learning',
    level: 'Senior',
    location: 'San Francisco, CA / Seattle, WA',
    workMode: 'Hybrid',
    salaryRange: '$230,000 – $310,000 USD + Equity',
    postedDate: 'Oct 08, 2026',
    postedAt: '2026-10-08T12:00:00.000Z',
    description: 'Design and benchmark deterministic agentic tool execution pipelines, context window caching, and automated hallucination verification suites.',
    keyResponsibilities: [
      'Scale low-latency function calling protocols and structured JSON schema decoders.',
      'Implement multi-agent benchmarking harnesses evaluating accuracy vs token compute cost.',
      'Harden agentic execution sandboxes against untrusted tool side-effects.'
    ],
    requiredSkills: ['Python', 'LLM Systems', 'Benchmarking & Evals', 'Distributed Systems', 'Vector Search'],
    niceToHaveSkills: ['vLLM', 'Rust', 'Kubernetes'],
    externalUrl: 'https://www.anthropic.com/careers/ai-systems-engineer',
    externalPlatform: 'Anthropic Careers',
    jobSource: 'Company Direct',
    sourceId: 'anthropic-direct',
    featured: true,
    hasSpecificDeadline: false,
    opportunityStatus: 'active',
    status: 'active'
  },
  ...JOBS_DATA.slice(0, 2)
];

// ============================================================================
// 2. CAREER PROGRAMS & SIGNALS (Curated Records)
// ============================================================================
export const CURATED_OPPORTUNITIES: CareerOpportunity[] = INITIAL_OPPORTUNITIES.slice(0, 5);

// ============================================================================
// 3. ROLE BLUEPRINTS (Curated Records)
// ============================================================================
export const CURATED_ROLES: RoleBlueprint[] = ROLES_DATA.slice(0, 5).map(role => ({
  ...role,
  status: role.status || 'published',
  missionScope: role.overview,
  techStack: role.primaryTechStack,
  typicalDay: role.dailyTasksTimeline.map(d => ({
    time: d.time,
    activity: d.task,
    description: d.description,
  })),
  interviewPipeline: role.typicalInterviewStages.map((stage, idx) => ({
    order: idx + 1,
    name: stage.replace(/\s*\(\d+m\)/, ''),
    duration: stage.match(/\((\d+m)\)/)?.[1] || '60m',
    description: `Evaluation stage for ${stage}`
  }))
}));

// ============================================================================
// 4. CAREER EVIDENCE ITEMS (Self-contained to avoid circular dependency)
// ============================================================================
export const CURATED_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'curated-ev-crm-migration',
    title: 'Zero-Downtime CRM Migration & Data Pipeline Modernization',
    shortSummary: 'Led dual-run CDC pipeline migration of 12M enterprise customer records with 0 seconds unplanned downtime.',
    category: 'Projects',
    context: 'Monolithic legacy CRM database suffered 4.2s p99 latency spikes and $35k/mo licensing costs across 12M records.',
    myRole: 'Lead Platform Engineer & Migration Architect',
    actions: 'Designed real-time Debezium CDC and Kafka streaming replication with continuous SHA-256 record parity verification.',
    decision: 'Chose continuous dual-run reconciliation over a weekend maintenance outage to guarantee zero business disruption.',
    tradeoffs: 'Invested 2 weeks in automated parity verification scripts in exchange for 100% rollback safety.',
    outcome: 'Completed cutover with 0s unplanned downtime, reduced p99 latency to 65ms, and saved $35,000/month.',
    metrics: ['0s unplanned downtime', '12M records migrated', '$35,000/month saved', '65ms p99 latency'],
    skills: ['PostgreSQL', 'Kafka', 'CDC (Debezium)', 'Distributed Systems', 'System Design'],
    domains: ['Fintech & Payments', 'Cloud Infrastructure & DevOps'],
    roles: ['Software Engineering'],
    tags: ['migration', 'zero-downtime', 'kafka'],
    linkedQuestionIds: [],
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-09-01T14:30:00.000Z'
  },
  {
    id: 'curated-ev-payment-idempotency',
    title: 'Distributed Payment Idempotency & Atomic Settlement Engine',
    shortSummary: 'Eliminated duplicate charge race conditions across $45M+ in transaction volume using Redis locks and serializable transactions.',
    category: 'Projects',
    context: 'Mobile network retries during peak checkout windows triggered occasional double-settlements on concurrent requests.',
    myRole: 'Senior Backend Engineer',
    actions: 'Implemented client-side idempotency key enforcement backed by atomic Redis SET NX locks and PostgreSQL serializable isolation.',
    decision: 'Enforced strict idempotency headers at the API gateway layer with 24-hour state retention.',
    tradeoffs: 'Added 2.4ms median lock overhead to guarantee zero duplicate financial ledger entries.',
    outcome: '0 duplicate charges across $45M+ processed volume and 14ms p99 transaction latency.',
    metrics: ['0 duplicate charges', '$45M+ volume protected', '14ms p99 latency'],
    skills: ['Redis', 'PostgreSQL', 'Idempotency', 'Distributed Locking', 'Fintech Ledgers'],
    domains: ['Fintech & Payments'],
    roles: ['Software Engineering'],
    tags: ['payments', 'idempotency', 'redis'],
    linkedQuestionIds: [],
    createdAt: '2026-08-18T09:00:00.000Z',
    updatedAt: '2026-08-29T11:00:00.000Z'
  },
  {
    id: 'curated-ev-onboarding-progressive',
    title: 'Self-Serve PLG Onboarding & Progressive Disclosure Redesign',
    shortSummary: 'Redesigned developer activation flow, reducing time-to-first-API-call from 18 minutes to 90 seconds.',
    category: 'Projects',
    context: '68% of self-serve trial signups dropped off during multi-step workspace configuration before sending their first event.',
    myRole: 'Lead Product Manager / Growth Architect',
    actions: 'Replaced upfront 9-field setup wizard with progressive disclosure and pre-provisioned sandbox API keys.',
    decision: 'Prioritized instant interactive sandbox telemetry over mandatory billing and team hierarchy setup.',
    tradeoffs: 'Deferred organization metadata collection to Day-3 active usage triggers.',
    outcome: 'Lifted trial-to-paid conversion from 19% to 31% (+12% absolute lift) and cut time-to-value to 90 seconds.',
    metrics: ['+12% trial conversion lift', '90s time-to-first-event', '-65% support tickets'],
    skills: ['Product Strategy', 'PLG Funnels', 'Activation Analytics', 'User Research', 'A/B Testing'],
    domains: ['Enterprise SaaS'],
    roles: ['Product Management'],
    tags: ['onboarding', 'plg', 'activation'],
    linkedQuestionIds: [],
    createdAt: '2026-08-20T12:00:00.000Z',
    updatedAt: '2026-09-02T16:00:00.000Z'
  }
];

// ============================================================================
// 5. PARTICIPATION TRACKER ITEMS
// ============================================================================
export const CURATED_APPLICATIONS: Partial<JobApplication>[] = [];

// ============================================================================
// 6. BUILDER MATCH (Curated Build Opportunities, Builders, & Teams)
// ============================================================================
export const CURATED_BUILD_OPPORTUNITIES: BuildOpportunity[] = INITIAL_BUILD_OPPORTUNITIES.slice(0, 5);
export const CURATED_BUILDERS: BuilderProfile[] = INITIAL_BUILDERS.slice(0, 5);
export const CURATED_TEAMS: BuildTeam[] = INITIAL_TEAMS.slice(0, 5);

// ============================================================================
// 7. Q&A BLUEPRINTS (Self-contained to avoid circular dependency)
// ============================================================================
export const CURATED_BLUEPRINTS: StructuredAnswerBlueprint[] = [
  {
    id: 'curated-bp-star-conflict',
    title: 'STAR: Resolving Architectural Disagreements via Benchmarking',
    questionId: 'q-star-disagreement',
    questionText: 'Tell me about a time you strongly disagreed with a senior technical decision. How did you handle it and what was the outcome?',
    storyId: 'story-conflict-engineering',
    storyTitle: 'Microservices Split vs Monolith Benchmarking',
    framework: 'STAR',
    components: {
      openingHook: 'I believe technical disagreements are healthy when grounded in objective production benchmarks rather than subjective dogma or organizational seniority.',
      situation: 'Our engineering lead advocated migrating user session store to a distributed graph database for upcoming social features.',
      task: 'Evaluate operational stability, licensing costs, and failover complexity while preserving strong team trust.',
      action: [
        'Organized a private 1-on-1 rather than debating in public channels to eliminate ego friction.',
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
        'Do not frame the colleague as obstinate',
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
    updatedAt: '2026-09-03T12:00:00.000Z'
  },
  {
    id: 'curated-bp-pdi-pricing',
    title: 'Problem → Decision → Impact: Self-Serve Pricing Tier Experiment',
    questionId: 'q-pm-ambiguity-decision',
    questionText: 'How do you handle situations where you have to make a high-impact product or architectural decision without enough data?',
    storyId: 'story-pricing-experiment',
    storyTitle: 'Self-Serve Pricing Tier Experiment',
    framework: 'Problem → Decision → Impact',
    components: {
      openingHook: 'When data is incomplete, I first categorize whether the decision is a Type 1 irreversible door or a Type 2 reversible door to prevent analysis paralysis.',
      problem: 'Executive team deadlocked on introducing a $49/month self-serve tier. Sales feared cannibalizing $500/month deals; growth wanted self-serve volume. We had zero empirical conversion history.',
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
    targetJob: 'Senior Product Manager',
    targetCompany: 'Enterprise SaaS',
    domain: 'Enterprise SaaS',
    tags: ['ambiguity', 'pricing', 'experimentation'],
    assignedRoles: ['VP Product', 'Hiring Manager'],
    createdAt: '2026-08-22T14:00:00.000Z',
    updatedAt: '2026-09-04T10:00:00.000Z'
  },
  {
    id: 'curated-bp-star-migration',
    title: 'STAR: Zero-Downtime Data Pipeline Modernization',
    questionId: 'q-devops-zero-downtime',
    questionText: 'Walk me through how you planned and executed a mission-critical database migration without incurring downtime.',
    storyId: 'story-crm-migration',
    storyTitle: 'CRM Migration & Data Pipeline Modernization',
    framework: 'STAR',
    components: {
      openingHook: 'Zero-downtime cutover is not an event, but a disciplined continuous verification process that decouples data synchronization from traffic switching.',
      situation: 'Our monolithic CRM held 12 million active customer records and was suffering 4-second latency spikes, but shutting down meant 14 hours of business loss for enterprise customers.',
      task: 'Migrate to PostgreSQL with zero unplanned downtime and 100% financial audit compliance.',
      action: [
        'Architected a dual-run pipeline using Debezium CDC and Kafka streaming change logs in real-time.',
        'Constructed automated verification script checking record hashes across both systems continuously.',
        'Conducted DNS cutover during low-traffic window after 7 days of 99.999% hash parity.'
      ],
      result: [
        'Cutover completed with 0 seconds unplanned downtime.',
        'Decommissioned $35,000/month in legacy database licenses.',
        'P99 database query latency dropped from 4.2s to 65ms.'
      ],
      keyCues: [
        'Change Data Capture (CDC) continuous replication',
        'Automated checksum verification',
        'Zero seconds unplanned downtime',
        'Immediate 65ms p99 latency benefit'
      ],
      avoidCues: [
        'Do not skip rollback plan details',
        'Avoid downplaying data verification risks'
      ]
    },
    metrics: ['0 seconds unplanned downtime', '12M records synchronized', '$35,000/month saved'],
    targetDurationSeconds: 160,
    targetRole: 'Software Engineering',
    roleCategory: 'Software Engineering',
    targetJob: 'Lead Platform Engineer',
    targetCompany: 'Cloud Infrastructure Corp',
    domain: 'Cloud Infrastructure & DevOps',
    tags: ['migration', 'zero-downtime', 'databases'],
    assignedRoles: ['Principal Architect', 'Director of Engineering'],
    createdAt: '2026-08-25T11:00:00.000Z',
    updatedAt: '2026-09-05T15:00:00.000Z'
  }
];

// ============================================================================
// 8. WORK EXPERIENCES (Self-contained to avoid circular dependency)
// ============================================================================
export const CURATED_WORK_EXPERIENCES: WorkExperienceRecord[] = [
  {
    id: 'curated-exp-stripe',
    company: 'Stripe / Fintech Core Platforms',
    role: 'Lead Platform Engineer & Project Owner',
    dates: '2023 — Present',
    location: 'San Francisco, CA (Remote)',
    scope: 'Core payments infrastructure, transaction ledgers, and database replication engines processing over $40M daily volume.',
    responsibilities: [
      'Architected zero-downtime dual-run data pipeline migrating 12M customer records to PostgreSQL.',
      'Designed and executed real-time Debezium CDC and Kafka change-log streaming reconciliation.',
      'Led RFC review cycle and aligned 3 enterprise tenant leadership teams on migration safety.'
    ],
    achievements: [
      'Cut over mission-critical database with 0 seconds unplanned downtime.',
      'Eliminated $35,000/month in legacy third-party database licenses.',
      'Achieved 99.999% data verification parity across all financial records during dual-run.'
    ],
    measurableOutcomes: [
      '0 seconds downtime across 12M records',
      '$35,000 / month license savings',
      '99.999% audit accuracy'
    ],
    relevantSkills: ['PostgreSQL', 'Kafka', 'CDC (Debezium)', 'Distributed Systems', 'Zero-Downtime Migration', 'Stakeholder Management'],
    linkedEvidenceId: 'curated-ev-crm-migration',
    provenance: 'evidence',
    isDemo: true,
    updatedAt: '2026-09-01T14:30:00.000Z'
  },
  {
    id: 'curated-exp-ramp',
    company: 'Ramp / High-Scale Financial Infra',
    role: 'Senior Backend Engineer / Tech Lead',
    dates: '2021 — 2023',
    location: 'New York, NY',
    scope: 'Transactional idempotency, merchant settlement APIs, and backend platform latency optimizations.',
    responsibilities: [
      'Enforced client-side idempotency keys with atomic Redis locks (SET NX EX 30) and serializable DB transactions.',
      'Resolved heated architecture conflict with tech lead via empirical 2-day benchmarking on 10,000 concurrent writes.',
      'Negotiated 20% sprint refactoring capacity using Cost of Delay metrics to pay down brittle billing tech debt.'
    ],
    achievements: [
      'Zero duplicate charges recorded over $45,000,000 in processed volume.',
      'Achieved 14ms p99 query latency vs 180ms failover spikes on alternative graph database designs.',
      'Reduced customer defect rate by 45% and compressed PR review cycle time from 4 days to 6 hours.'
    ],
    measurableOutcomes: [
      '0 duplicate charges over $45M volume',
      '14ms p99 query latency',
      '-45% customer defect rate'
    ],
    relevantSkills: ['Redis', 'PostgreSQL Serializable Transactions', 'Distributed Systems', 'Idempotency', 'Cost of Delay'],
    linkedEvidenceId: 'curated-ev-payment-idempotency',
    provenance: 'evidence',
    isDemo: true,
    updatedAt: '2026-08-28T12:00:00.000Z'
  },
  {
    id: 'curated-exp-acme',
    company: 'Acme Cloud Platform',
    role: 'Senior Technical Product Operations & Systems Engineer',
    dates: '2019 — 2021',
    location: 'Remote',
    scope: 'Led telemetry infrastructure, activation observability, and partner integrations across enterprise accounts.',
    responsibilities: [
      'Orchestrated multi-tenant telemetry pipeline ingesting 25,000 events/minute.',
      'Redesigned developer self-serve onboarding, improving activation velocity from 18 mins to 90 seconds.',
      'Standardized API error taxonomies and client SDK retry mechanisms.'
    ],
    achievements: [
      'Boosted trial onboarding conversion from 19% to 31%.',
      'Streamlined developer integration turnaround time by 65%.',
      'Awarded Company Operational Excellence Recognition in Q3 2020.'
    ],
    measurableOutcomes: [
      '+12% trial conversion velocity lift',
      '90s developer onboarding turnaround',
      '99.98% telemetry pipeline availability'
    ],
    relevantSkills: ['Product Operations', 'Funnel Analytics', 'PostHog', 'API Governance', 'Developer Experience'],
    linkedEvidenceId: 'curated-ev-onboarding-progressive',
    provenance: 'evidence',
    isDemo: true,
    updatedAt: '2026-08-20T10:00:00.000Z'
  }
];

// ============================================================================
// 9. DOMAIN / SECTOR MAPPING (Featured Domains)
// ============================================================================
export const CURATED_DOMAINS: SectorDomain[] = [
  'Enterprise SaaS',
  'Fintech & Payments',
  'AI & Machine Learning',
  'Cloud Infrastructure & DevOps'
];

// ============================================================================
// 10. PROJECTS (Curated Sample Projects)
// ============================================================================
export const CURATED_PROJECTS: CareerProject[] = INITIAL_PROJECTS.slice(0, 5);

// ============================================================================
// 11. CAREER MISSION (1 Active Mission with supporting milestones)
// ============================================================================
export const CURATED_CAREER_MISSIONS: CareerMission[] = [INITIAL_CAREER_MISSIONS[0]];

/**
 * Curated Public Beta Data Manager Singleton
 */
class CuratedBetaDataService {
  /**
   * Determine if public curated mode is active
   */
  public isCuratedBetaActive(): boolean {
    try {
      const access = AccessControlService.getAccessLevel();
      // Curated mode applies to PUBLIC, GUEST, and DEMO access tiers
      return access !== 'FULL';
    } catch {
      return true;
    }
  }

  private sliceByAccess<T>(resource: string, items: T[], pagination?: PaginationParams): T[] {
    try {
      const access = AccessControlService.getAccessLevel();
      let authorizedSlice: T[];
      if (access === 'PUBLIC') {
        authorizedSlice = items.slice(0, 1);
      } else if (access === 'GUEST') {
        authorizedSlice = items.slice(0, 3);
      } else {
        // DEMO & others: expanded curated records (5 items)
        authorizedSlice = items.slice(0, 5);
      }
      return dataExposureGuard.paginateAndProject(resource, authorizedSlice, pagination, access).items;
    } catch {
      return dataExposureGuard.projectCollectionForTier(items.slice(0, 3), 'GUEST');
    }
  }

  public getJobs(pagination?: PaginationParams): JobListing[] {
    return this.sliceByAccess('jobs', CURATED_JOBS, pagination);
  }

  public getOpportunities(pagination?: PaginationParams): CareerOpportunity[] {
    return this.sliceByAccess('opportunities', CURATED_OPPORTUNITIES, pagination);
  }

  public getRoles(pagination?: PaginationParams): RoleBlueprint[] {
    return this.sliceByAccess('roles', CURATED_ROLES, pagination);
  }

  public getEvidenceItems(pagination?: PaginationParams): EvidenceItem[] {
    return this.sliceByAccess('evidence', CURATED_EVIDENCE_ITEMS, pagination);
  }

  public getApplications(pagination?: PaginationParams): Partial<JobApplication>[] {
    return this.sliceByAccess('applications', CURATED_APPLICATIONS, pagination);
  }

  public getBuildOpportunities(pagination?: PaginationParams): BuildOpportunity[] {
    return this.sliceByAccess('build_opportunities', CURATED_BUILD_OPPORTUNITIES, pagination);
  }

  public getBuilders(pagination?: PaginationParams): BuilderProfile[] {
    return this.sliceByAccess('builders', CURATED_BUILDERS, pagination);
  }

  public getTeams(pagination?: PaginationParams): BuildTeam[] {
    return this.sliceByAccess('teams', CURATED_TEAMS, pagination);
  }

  public getBlueprints(pagination?: PaginationParams): StructuredAnswerBlueprint[] {
    return this.sliceByAccess('blueprints', CURATED_BLUEPRINTS, pagination);
  }

  public getWorkExperiences(pagination?: PaginationParams): WorkExperienceRecord[] {
    return this.sliceByAccess('work_experiences', CURATED_WORK_EXPERIENCES, pagination);
  }

  public getFeaturedDomains(): SectorDomain[] {
    const access = AccessControlService.getAccessLevel();
    if (access === 'PUBLIC') return CURATED_DOMAINS.slice(0, 1);
    if (access === 'GUEST') return CURATED_DOMAINS.slice(0, 3);
    return CURATED_DOMAINS.slice(0, 5);
  }

  public getProjects(pagination?: PaginationParams): CareerProject[] {
    return this.sliceByAccess('projects', CURATED_PROJECTS, pagination);
  }

  public getCareerMissions(): CareerMission[] {
    return dataExposureGuard.projectCollectionForTier(CURATED_CAREER_MISSIONS);
  }
}

export const curatedBetaData = new CuratedBetaDataService();
