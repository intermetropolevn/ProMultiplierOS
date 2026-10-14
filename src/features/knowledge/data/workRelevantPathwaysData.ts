import { WorkRelevantPathway } from '../types/workPathways';

export const WORK_RELEVANT_PATHWAYS: WorkRelevantPathway[] = [
  // 1. PRODUCT MANAGER — FULL PRODUCT LIFECYCLE & DISCOVERY WORKSTREAM (User Prompt Example)
  {
    id: 'pathway-pm-product-lifecycle',
    title: 'Full-Lifecycle Product Management & Discovery Workstream',
    codeName: 'PM-LIFECYCLE-01',
    role: 'Product Management',
    domain: 'Enterprise SaaS',
    pathwayArchetype: 'workstream',
    summary: 'An end-to-end operational pathway guiding a product idea from initial discovery and user empathy synthesis through PRD authoring, experimental validation, go-to-market release, and post-launch metric optimization.',
    scopeClarification: 'This pathway is a concrete, granular workstream inside the Product Manager role—it does NOT represent the entire job description (such as hiring, annual budget negotiation, or organizational headcount planning). It models the repeatable unit of discovery-to-delivery product execution.',
    organizationalContext: 'How Organizations & Institutions Operate: In modern enterprise and public institutional environments, product changes undergo Cross-Functional Review (Product, Engineering, Design, InfoSec, Legal, and Compliance). GTM phases require alignment with Customer Success, Sales Enablement, and formal Change Management boards (CAB) to prevent regulatory or operational disruption.',
    emergingInnovations: [
      'AI-assisted qualitative user interview transcript synthesis & sentiment clustering',
      'Automated PRD draft generation grounded in Figma user journeys & Jira epics',
      'Continuous feature flagging with real-time multi-arm bandit experimentation',
      'Synthetic user behavioral simulation for early prototype validation'
    ],
    toolsAndPlatforms: ['Figma', 'Miro', 'Jira', 'Notion', 'Mixpanel', 'Amplitude', 'LaunchDarkly', 'Dovetail', 'Confluence', 'Slack'],
    connectedSkills: [
      { name: 'Product Discovery & User Interviews', relevance: 'primary', proficiency: 'Expert' },
      { name: 'PRD & Technical Spec Writing', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Opportunity Solution Tree Mapping', relevance: 'primary', proficiency: 'Practitioner' },
      { name: 'Product Analytics & Funnel Analysis', relevance: 'primary', proficiency: 'Expert' },
      { name: 'A/B Experiment Design & Hypothesis Testing', relevance: 'primary', proficiency: 'Practitioner' },
      { name: 'Cross-functional Stakeholder Management', relevance: 'secondary', proficiency: 'Expert' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'User Empathy Synthesis Deck & Opportunity Tree',
        type: 'Artifact',
        format: 'Miro / PDF',
        description: 'Visual synthesis of 12+ customer problem interviews mapped to high-leverage pain points and outcome metrics.'
      },
      {
        title: 'Exhaustive PRD with Edge Case Matrix',
        type: 'Product Spec',
        format: 'Markdown / Notion',
        description: 'Comprehensive Product Requirements Document covering user stories, acceptance criteria, edge cases, and telemetry schema.'
      },
      {
        title: 'A/B Experimentation Plan & Power Analysis',
        type: 'Experiment Spec',
        format: 'Doc',
        description: 'Pre-registered hypothesis, minimum detectable effect (MDE), sample size calculation, and guardrail metrics.'
      },
      {
        title: 'Launch Readiness Checklist & Post-Mortem Memo',
        type: 'Governance Deliverable',
        format: 'Checklist / Memo',
        description: 'Tier-1 GTM sign-off checklist including training docs, support escalation runbook, and 30-day post-launch retrospective.'
      }
    ],
    connectedEvidence: [
      {
        title: 'Enterprise Billing Self-Serve PRD & Usability Prototype',
        strengthLevel: 5,
        roleReadinessImpact: 'Proves authoritative capability to formulate end-to-end product requirements with edge cases and telemetry specs.'
      },
      {
        title: 'Cohort Retention Optimization Experiment Report',
        strengthLevel: 4,
        roleReadinessImpact: 'Validates ability to design data-driven feature experiments and interpret telemetry metrics.'
      }
    ],
    stages: [
      {
        stepNumber: 1,
        title: 'Product Discovery',
        phase: 'Inception & Exploration',
        whatProfessionalsDo: 'Conduct continuous discovery interviews with target customer segments. Analyze customer support tickets, lost-deal CRM notes, and industry benchmark reports to spot underserved customer problems.',
        toolsAndPlatforms: ['Dovetail', 'Salesforce CRM', 'Gong', 'Notion'],
        deliverable: 'Discovery Insights Brief & Problem Cluster Matrix',
        organizationalOperations: 'Align with Sales and Customer Success leadership to recruit representative enterprise clients without violating NDA or confidentiality terms.',
        emergingInnovations: 'Automated clustering of voice-of-customer calls using AI semantic indexing.',
        commonPitfalls: ['Jumping directly to solutions before verifying that the customer problem exists at high frequency and willingness to pay.']
      },
      {
        stepNumber: 2,
        title: 'User Research',
        phase: 'Inception & Exploration',
        whatProfessionalsDo: 'Design semi-structured interview scripts, conduct 45-minute deep-dive user sessions, record workflows, and extract recurring emotional friction and workflow bottlenecks.',
        toolsAndPlatforms: ['Zoom', 'Dovetail', 'Figma', 'Miro'],
        deliverable: 'User Research Synthesis & Verbatim Evidence Board',
        organizationalOperations: 'Secure customer consent forms adhering to GDPR/CCPA data governance and institutional privacy policies.',
        emergingInnovations: 'Real-time transcript summarization highlighting behavioral hesitations.',
        commonPitfalls: ['Leading questions that confirm existing designer/PM biases rather than revealing true user workflow pain.']
      },
      {
        stepNumber: 3,
        title: 'Problem Framing',
        phase: 'Synthesis & Alignment',
        whatProfessionalsDo: 'Convert qualitative user findings into precise "How Might We" problem statements. Define customer job-to-be-done (JTBD) and establish unambiguous North Star success metrics.',
        toolsAndPlatforms: ['Miro', 'FigJam', 'Confluence'],
        deliverable: 'Executive Problem Framing Canvas & North Star KPI Target',
        organizationalOperations: 'Present to Product Leadership to gain strategic endorsement before allocating dedicated engineering resources.',
        emergingInnovations: 'Automated alignment heatmaps scoring problem priority against company quarterly OKRs.',
        commonPitfalls: ['Framing problems too broadly (e.g., "improve user experience") without measurable boundary conditions.']
      },
      {
        stepNumber: 4,
        title: 'Opportunity Mapping',
        phase: 'Synthesis & Alignment',
        whatProfessionalsDo: 'Construct an Opportunity Solution Tree connecting desired business outcomes to customer opportunities, branching out potential solution hypotheses.',
        toolsAndPlatforms: ['Miro', 'Lucidchart'],
        deliverable: 'Opportunity Solution Tree & Comparative Impact/Effort Matrix',
        organizationalOperations: 'Collaborate with Engineering Leads and Staff Architects to assess technical feasibility and architectural constraints.',
        emergingInnovations: 'Algorithmic dependency mapping across internal microservice boundaries.',
        commonPitfalls: ['Fixating on a single pet solution rather than exploring diverse paths to achieve the target outcome.']
      },
      {
        stepNumber: 5,
        title: 'PRD (Product Requirements Document)',
        phase: 'Specification & Scoping',
        whatProfessionalsDo: 'Author an exhaustive PRD detailing user stories, acceptance criteria, wireframe flows, data contracts, telemetry events, fallback states, and security considerations.',
        toolsAndPlatforms: ['Notion', 'Confluence', 'Figma', 'Linear / Jira'],
        deliverable: 'Versioned PRD Specification Document with Sign-Off Matrix',
        organizationalOperations: 'Facilitate formal 3-Amigos review (PM, Tech Lead, Design Lead) plus InfoSec/Legal compliance reviews for enterprise features.',
        emergingInnovations: 'Automatic linting of PRDs for ambiguous requirements and unhandled edge cases.',
        commonPitfalls: ['Omitting error states, offline behaviors, permission hierarchies, or audit log requirements.']
      },
      {
        stepNumber: 6,
        title: 'Roadmap',
        phase: 'Planning & Prioritization',
        whatProfessionalsDo: 'Break the PRD into deliverable epics and sprint stories. Sequence deliverables by risk and value, establish release milestones, and communicate timelines to stakeholders.',
        toolsAndPlatforms: ['Jira Software', 'Productboard', 'Linear'],
        deliverable: 'Prioritized Product Delivery Roadmap & Milestone Release Plan',
        organizationalOperations: 'Present roadmap dependencies in Executive Portfolio reviews and institutional steering committee sessions.',
        emergingInnovations: 'Dynamic capacity modeling forecasting delivery confidence percentiles (p50/p90).',
        commonPitfalls: ['Overcommitting fixed dates without accounting for legacy tech debt or unforeseen third-party API dependencies.']
      },
      {
        stepNumber: 7,
        title: 'Experiment Design',
        phase: 'Validation & Experimentation',
        whatProfessionalsDo: 'Define hypothesis, control vs. treatment variants, sample size calculations, metric sensitivity, guardrail KPIs (e.g., page latency, crash rate), and decision rules.',
        toolsAndPlatforms: ['LaunchDarkly', 'Statsig', 'Optimizely', 'Google Sheets'],
        deliverable: 'Pre-Registration Experiment Protocol Document',
        organizationalOperations: 'Check with Data Science & Analytics teams to ensure cohort randomization does not leak between shared team accounts.',
        emergingInnovations: 'Sequential Bayesian testing allowing continuous early stopping without p-hacking risks.',
        commonPitfalls: ['Peeking at early significance and declaring victory prematurely before achieving required sample size.']
      },
      {
        stepNumber: 8,
        title: 'Product Analytics',
        phase: 'Measurement & Telemetry',
        whatProfessionalsDo: 'Define tracking taxonomy, event payloads, and custom dimensions. Build tracking QA test plans and construct baseline analytics dashboards in Mixpanel or Amplitude.',
        toolsAndPlatforms: ['Amplitude', 'Mixpanel', 'Segment', 'Postman'],
        deliverable: 'Analytics Tracking Plan (Schema) & Executive Core Dashboard',
        organizationalOperations: 'Audit data schemas with the Data Governance committee to verify compliance with privacy regulations.',
        emergingInnovations: 'Automated telemetry validation verifying event emission during pull request CI builds.',
        commonPitfalls: ['Tracking vanity metrics (e.g. pageviews) instead of meaningful value-exchange activation milestones.']
      },
      {
        stepNumber: 9,
        title: 'Launch',
        phase: 'Go-To-Market & Delivery',
        whatProfessionalsDo: 'Execute phased rollout via feature flags (internal dogs fooding → 5% beta → 25% → 100%). Coordinate release notes, customer support macros, sales battlecards, and help center guides.',
        toolsAndPlatforms: ['LaunchDarkly', 'Zendesk', 'Intercom', 'Slack'],
        deliverable: 'GTM Release Packet, Customer Documentation & Support Playbook',
        organizationalOperations: 'Sign off with Customer Operations, Legal, and Public Relations on rollout messaging and operational SLAs.',
        emergingInnovations: 'Automated anomaly detection triggering rollbacks if error rates breach 0.1% during canary phases.',
        commonPitfalls: ['Releasing to 100% of users simultaneously without a gradual canary rollback guardrail.']
      },
      {
        stepNumber: 10,
        title: 'Growth',
        phase: 'Adoption & Scale',
        whatProfessionalsDo: 'Analyze initial cohort onboarding drop-offs. Iterate on copy, activation prompts, viral invitation loops, and contextual in-app guidance to accelerate feature adoption.',
        toolsAndPlatforms: ['Appcues', 'Pendo', 'Mixpanel', 'FullStory'],
        deliverable: 'Growth Experiment Log & Funnel Conversion Optimization Report',
        organizationalOperations: 'Synchronize growth levers with Marketing demand generation campaigns and Customer Success renewal cycles.',
        emergingInnovations: 'AI-driven personalized in-app onboarding flows tailored to user industry vertical.',
        commonPitfalls: ['Focusing purely on top-of-funnel acquisition while ignoring onboarding drop-offs and day-30 retention.']
      },
      {
        stepNumber: 11,
        title: 'Post-launch Optimization',
        phase: 'Evaluation & Refinement',
        whatProfessionalsDo: 'Synthesize quantitative adoption telemetry with qualitative user feedback. Host cross-functional retrospective, document lessons learned, and prioritize fast-follow backlog items.',
        toolsAndPlatforms: ['Amplitude', 'Jira', 'Notion', 'Loom'],
        deliverable: '30-Day Product Post-Mortem Memo & V2 Backlog Prioritization',
        organizationalOperations: 'Archive compliance artifacts and report ROI achievements to the Executive Leadership team.',
        emergingInnovations: 'Automated post-launch impact attribution comparing projected vs. actual revenue uplift.',
        commonPitfalls: ['Immediately moving team to the next project without fixing critical usability bugs and performance bottlenecks identified in launch.']
      }
    ],
    estimatedDuration: '6 - 12 Weeks (per major product initiative)',
    executionCadence: 'Continuous & Sprint-Aligned',
    evidenceStrengthLevel: 5,
    tags: ['product-management', 'discovery', 'user-research', 'prd', 'roadmap', 'analytics', 'experimentation', 'gtm']
  },

  // 2. SOFTWARE ENGINEER — FEATURE DELIVERY & PRODUCTION ENGINEERING LIFECYCLE (User Prompt Example)
  {
    id: 'pathway-swe-production-lifecycle',
    title: 'Feature Delivery & Production Engineering Lifecycle',
    codeName: 'SWE-LIFECYCLE-02',
    role: 'Software Engineering',
    domain: 'Cloud Infrastructure & DevOps',
    pathwayArchetype: 'engineering_module',
    summary: 'A disciplined, production-grade engineering workflow spanning monorepo setup, contract-first API development, zero-downtime database migrations, automated CI/CD pipelines, distributed observability, and incident on-call response.',
    scopeClarification: 'This pathway models the granular software engineering unit of work required to ship resilient production features. It is NOT an entire job description (which also encompasses team mentorship, organizational architecture strategy, and cross-team career leveling).',
    organizationalContext: 'How Organizations & Institutions Operate: Enterprise engineering teams adhere to Branch Protection rules, Peer Code Review standards (at least 1-2 Staff/Senior approvals), automated SonarQube/SAST security gates, and SOC2 audit log requirements before deployment to production environments.',
    emergingInnovations: [
      'LLM-assisted unit test generation and mutation testing',
      'Automated synthetic traffic shadowing & canary verification in staging',
      'Zero-downtime expand/contract schema evolution tooling',
      'OpenTelemetry distributed tracing auto-instrumentation'
    ],
    toolsAndPlatforms: ['Git', 'GitHub Actions', 'Docker', 'PostgreSQL', 'Prisma / Drizzle', 'Jest / Vitest', 'Postman', 'Datadog', 'Kubernetes', 'PagerDuty'],
    connectedSkills: [
      { name: 'Git Workflow & Branching Strategy', relevance: 'primary', proficiency: 'Expert' },
      { name: 'REST & gRPC API Development', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Relational Database Schema Migrations', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Automated Testing (Unit, Integration, E2E)', relevance: 'primary', proficiency: 'Expert' },
      { name: 'CI/CD Pipeline Engineering', relevance: 'primary', proficiency: 'Practitioner' },
      { name: 'Distributed Tracing & Observability', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Production Incident Triage & Root Cause Analysis', relevance: 'secondary', proficiency: 'Practitioner' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'Production Pull Request with 90%+ Test Coverage',
        type: 'Source Code & Tests',
        format: 'GitHub PR',
        description: 'Clean, atomic feature branch with passing unit/integration suites, linters, and architectural documentation.'
      },
      {
        title: 'OpenAPI 3.1 Contract & Postman Collection',
        type: 'API Contract',
        format: 'YAML / JSON',
        description: 'Strict schema specification with request/response schemas, error status models, and authentication headers.'
      },
      {
        title: 'Zero-Downtime Migration Script (Expand/Contract)',
        type: 'Database Migration',
        format: 'SQL / TypeScript',
        description: 'Forward-compatible schema evolution migration with non-blocking index creation and rollback safety.'
      },
      {
        title: 'Datadog Service Dashboard & PagerDuty Alert Rule',
        type: 'Observability Spec',
        format: 'Terraform / JSON',
        description: 'Live p95/p99 latency tracking, error rate monitors, and automatic threshold alerts.'
      }
    ],
    connectedEvidence: [
      {
        title: 'Distributed Transaction Processing Engine Repository',
        strengthLevel: 5,
        roleReadinessImpact: 'Demonstrates deep engineering execution across concurrent database transactions, idempotency, and automated testing.'
      },
      {
        title: 'OpenTelemetry Observability Dashboard & Runbook',
        strengthLevel: 4,
        roleReadinessImpact: 'Validates ability to configure production monitoring, alerts, and incident diagnosis.'
      }
    ],
    stages: [
      {
        stepNumber: 1,
        title: 'Repository Setup',
        phase: 'Environment & Setup',
        whatProfessionalsDo: 'Clone repository, configure containerized local dependencies via Docker Compose, verify environment secrets, and confirm pre-commit hooks (Husky, ESLint, Prettier).',
        toolsAndPlatforms: ['Git', 'Docker Compose', 'pnpm / npm', 'Husky'],
        deliverable: 'Verified Local Development Environment with Passing Health Checks',
        organizationalOperations: 'Fetch scoped credentials via enterprise secret managers (HashiCorp Vault or AWS Secrets Manager) without committing plaintext keys.',
        emergingInnovations: 'Dev Containers and cloud-based ephemeral workspaces (Codespaces).',
        commonPitfalls: ['Hardcoding local environment paths or omitting environment variable documentation in .env.example.']
      },
      {
        stepNumber: 2,
        title: 'Feature Branch',
        phase: 'Environment & Setup',
        whatProfessionalsDo: 'Create a clean, isolated feature branch using company naming conventions (e.g. `feat/JIRA-1284-idempotent-checkout`). Sync latest trunk branch and set up upstream tracking.',
        toolsAndPlatforms: ['Git', 'GitHub CLI', 'Jira'],
        deliverable: 'Isolated Git Branch Linked to Issue Tracker Ticket',
        organizationalOperations: 'Enforce branch policies requiring all tickets to be mapped to active sprint milestones.',
        emergingInnovations: 'Automated branch creation directly from ticket status transitions in Jira.',
        commonPitfalls: ['Branching off stale development branches without rebasing on main, leading to nasty merge conflicts later.']
      },
      {
        stepNumber: 3,
        title: 'API Development',
        phase: 'Implementation & Logic',
        whatProfessionalsDo: 'Author contract-first endpoint logic. Implement input validation using Zod schemas, enforce JWT authorization scopes, handle edge-case error envelopes, and ensure business logic idempotency.',
        toolsAndPlatforms: ['TypeScript', 'Node.js / Go', 'Zod', 'Postman'],
        deliverable: 'Idempotent API Controller & Validated Service Layer Logic',
        organizationalOperations: 'Publish updated OpenAPI contracts to internal Developer Portals for Frontend team consumers.',
        emergingInnovations: 'Type-safe RPC generators (tRPC / connect-rpc) generating client SDKs automatically.',
        commonPitfalls: ['Trusting client input payloads without strict runtime schema validation.']
      },
      {
        stepNumber: 4,
        title: 'Database Migration',
        phase: 'Implementation & Logic',
        whatProfessionalsDo: 'Draft forward-compatible schema evolution using expand-and-contract pattern. Add nullable columns, write migration scripts with `CONCURRENTLY` indexes, and test rollbacks in local staging.',
        toolsAndPlatforms: ['PostgreSQL', 'Prisma', 'Drizzle ORM', 'Flyway'],
        deliverable: 'Idempotent Expand/Contract Migration Script with Non-blocking Indexes',
        organizationalOperations: 'Submit migration plan for Database Administrator (DBA) or Senior Architect lock-risk review.',
        emergingInnovations: 'Automated database CI branch previews (e.g. Neon / Supabase branching).',
        commonPitfalls: ['Adding a `NOT NULL` constraint with a default value on large tables without multi-phase backfill, causing table lock timeouts.']
      },
      {
        stepNumber: 5,
        title: 'Testing',
        phase: 'Verification & Quality',
        whatProfessionalsDo: 'Write comprehensive unit tests with mocked boundaries, integration tests with real testcontainers (PostgreSQL/Redis), and end-to-end regression workflows.',
        toolsAndPlatforms: ['Vitest', 'Jest', 'Playwright', 'Testcontainers'],
        deliverable: 'Automated Test Suite with >85% Critical Path Coverage',
        organizationalOperations: 'Ensure all tests run deterministically in CI without flaky race conditions or network external calls.',
        emergingInnovations: 'Property-based fuzz testing and automated AI mutation testing.',
        commonPitfalls: ['Writing brittle unit tests that test implementation details instead of observable behavior and contracts.']
      },
      {
        stepNumber: 6,
        title: 'CI/CD',
        phase: 'Integration & Deployment',
        whatProfessionalsDo: 'Open pull request against main branch. Pass automated GitHub Actions matrix (lint, typecheck, unit tests, SAST security scan, docker build), address peer code review comments, and merge.',
        toolsAndPlatforms: ['GitHub Actions', 'Docker', 'SonarCloud', 'ArgoCD'],
        deliverable: 'Approved & Merged PR with Built Immutable Docker Image Tag',
        organizationalOperations: 'Enforce branch protection requiring at least two senior code review approvals and green security audits.',
        emergingInnovations: 'Automated PR preview environments deployed on pull request opening.',
        commonPitfalls: ['Bypassing failed CI checks with administrative overrides or disabling flaky tests.']
      },
      {
        stepNumber: 7,
        title: 'Observability',
        phase: 'Production Readiness',
        whatProfessionalsDo: 'Verify OpenTelemetry trace context propagation across microservice calls. Set up Datadog / Grafana latency dashboards (p50/p95/p99) and configure actionable SLO-based alerts.',
        toolsAndPlatforms: ['Datadog', 'OpenTelemetry', 'Grafana', 'Prometheus'],
        deliverable: 'Production Service Dashboard & Actionable Alert Thresholds',
        organizationalOperations: 'Register new service in Central Service Catalog with designated ownership tier and on-call escalation policies.',
        emergingInnovations: 'eBPF-powered zero-code profiling and telemetry tracing.',
        commonPitfalls: ['Logging sensitive customer PII or tokens into unstructured stdout logs.']
      },
      {
        stepNumber: 8,
        title: 'Incident Response',
        phase: 'Operational Resilience',
        whatProfessionalsDo: 'Handle on-call rotation. Triage incoming high-priority alerts, inspect error logs, assess customer impact, declare SEV level, coordinate rollback or mitigation, and publish status updates.',
        toolsAndPlatforms: ['PagerDuty', 'Datadog', 'Slack (#incident-war-room)', 'Incident.io'],
        deliverable: 'Blameless Post-Mortem Document with Remediation Action Items',
        organizationalOperations: 'Notify Executive Incident Commanders and adhere to formal incident communication SLAs for enterprise SLAs.',
        emergingInnovations: 'Automated runbook execution and instant historical incident similarity search.',
        commonPitfalls: ['Attempting complex live code refactoring during a live Sev1 outage instead of rolling back to known good state.']
      },
      {
        stepNumber: 9,
        title: 'Performance Optimization',
        phase: 'Operational Resilience',
        whatProfessionalsDo: 'Analyze production p99 latency spikes, review database `EXPLAIN ANALYZE` query plans, introduce Redis caching layers with cache invalidation strategies, and optimize payload serialization.',
        toolsAndPlatforms: ['pgHero', 'Redis', 'Flamegraphs / Clinic.js', 'k6 Load Testing'],
        deliverable: 'Performance Benchmark Report Demonstrating Latency Reduction',
        organizationalOperations: 'Conduct quarterly architectural review to evaluate cloud infrastructure cost efficiency and capacity headroom.',
        emergingInnovations: 'Continuous in-production CPU and memory profiling without latency overhead.',
        commonPitfalls: ['Premature optimization of algorithms before profiling to identify the actual database or network bottleneck.']
      }
    ],
    estimatedDuration: '2 - 3 Weeks (per feature delivery cycle)',
    executionCadence: 'Sprint-Based / Continuous Integration',
    evidenceStrengthLevel: 5,
    tags: ['software-engineering', 'git-workflow', 'api', 'database-migration', 'testing', 'ci-cd', 'observability', 'incident-response', 'performance']
  },

  // 3. ZERO-DOWNTIME DATABASE MIGRATION & SCHEMA EVOLUTION (Engineering Module & SOP)
  {
    id: 'pathway-swe-zero-downtime-migration',
    title: 'Zero-Downtime Database Migration & Schema Evolution',
    codeName: 'SWE-MIGRATE-03',
    role: 'Software Engineering',
    domain: 'Enterprise SaaS',
    pathwayArchetype: 'engineering_module',
    summary: 'A critical engineering SOP and module for evolving high-volume production relational schemas without downtime, locking timeouts, or customer data loss using the Expand and Contract architecture pattern.',
    scopeClarification: 'This is a specialized engineering module and repeatable procedure. It represents a targeted unit of operational work executing a complex data transformation safely in production.',
    organizationalContext: 'How Organizations Operate: In regulated finance and SaaS organizations, database schema alterations require formal Change Advisory Board (CAB) review, verification of query lock timeouts (`statement_timeout = 2s`), and scheduled off-peak deployment windows.',
    emergingInnovations: [
      'Ghost/pg_repack non-blocking table rewrites',
      'Automated dual-writing consistency checkers comparing read hashes',
      'Ephemeral branch previews for migration schema verification'
    ],
    toolsAndPlatforms: ['PostgreSQL', 'Prisma', 'pg_repack', 'Flyway', 'Datadog', 'Kubernetes'],
    connectedSkills: [
      { name: 'PostgreSQL Architecture & Query Optimization', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Expand & Contract Migration Strategy', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Database Locks & Transaction Isolation Levels', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Data Integrity Verification & Reconciliation', relevance: 'secondary', proficiency: 'Practitioner' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'Multi-Phase Migration Runbook with Rollback Plan',
        type: 'SOP Runbook',
        format: 'Markdown / Confluence',
        description: 'Step-by-step checklist specifying Phase 1 (Expand), Phase 2 (Backfill), and Phase 3 (Contract) with abort criteria.'
      },
      {
        title: 'Asynchronous Backfill Worker Script',
        type: 'Background Worker',
        format: 'TypeScript / SQL',
        description: 'Batch processing worker with sleep throttles to backfill historical records without saturating database I/O.'
      }
    ],
    connectedEvidence: [
      {
        title: 'Zero-Downtime Payment Ledger Schema Migration Script',
        strengthLevel: 5,
        roleReadinessImpact: 'Proves high-level expertise handling high-stakes database transformations safely.'
      }
    ],
    stages: [
      {
        stepNumber: 1,
        title: 'Schema Contract Drafting',
        phase: 'Design',
        whatProfessionalsDo: 'Model target schema changes. Ensure all new columns are nullable or have non-blocking defaults. Verify foreign key index presence.',
        toolsAndPlatforms: ['dbdiagram.io', 'PostgreSQL', 'Prisma'],
        deliverable: 'Draft Schema Diff & Lock Assessment Memo'
      },
      {
        stepNumber: 2,
        title: 'Expand Phase (Dual Write)',
        phase: 'Deployment',
        whatProfessionalsDo: 'Deploy code that writes to both old and new schema columns simultaneously while continuing to read from the old column.',
        toolsAndPlatforms: ['GitHub Actions', 'Kubernetes'],
        deliverable: 'Dual-Write Production Deployment with Zero Errors'
      },
      {
        stepNumber: 3,
        title: 'Historical Data Backfill',
        phase: 'Data Sync',
        whatProfessionalsDo: 'Execute batched background job copying historical records from old column to new column in chunks of 500 with sleep delays to avoid replication lag.',
        toolsAndPlatforms: ['Node.js Worker', 'pg_stat_activity', 'Datadog'],
        deliverable: '100% Backfilled Historical Rows with Validated Hash Parity'
      },
      {
        stepNumber: 4,
        title: 'Contract Phase (Read Switch)',
        phase: 'Cutover',
        whatProfessionalsDo: 'Switch application read queries to the new column. Monitor error rates, cache hit ratios, and query latencies for 48 hours.',
        toolsAndPlatforms: ['Datadog', 'LaunchDarkly'],
        deliverable: 'Successful Read Traffic Cutover to New Schema Columns'
      },
      {
        stepNumber: 5,
        title: 'Cleanup & Deprecation',
        phase: 'Retirement',
        whatProfessionalsDo: 'Drop old unused column in a final migration after all microservice consumers have stopped referencing it.',
        toolsAndPlatforms: ['Flyway', 'PostgreSQL'],
        deliverable: 'Clean Final Schema State with Zero Tech Debt'
      }
    ],
    estimatedDuration: '1 - 2 Weeks',
    executionCadence: 'On-Demand / Major Architectural Milestone',
    evidenceStrengthLevel: 5,
    tags: ['database', 'postgresql', 'zero-downtime', 'migrations', 'architecture', 'resilience']
  },

  // 4. DEVOPS & CLOUD — GITOPS INFRASTRUCTURE & AUTOMATED CANARY DELIVERY
  {
    id: 'pathway-devops-gitops-canary',
    title: 'Cloud-Native Infrastructure as Code & GitOps Canary Pipeline',
    codeName: 'DEV-GITOPS-04',
    role: 'DevOps & Cloud',
    domain: 'Cloud Infrastructure & DevOps',
    pathwayArchetype: 'git_workflow',
    summary: 'Automated declarative infrastructure provisioning with Terraform, combined with ArgoCD GitOps synchronizations and Flagger automated canary progressive rollouts.',
    scopeClarification: 'This is a Git & Repository Workflow and infrastructure package within DevOps/SRE roles. It defines the mechanics of automated release governance.',
    organizationalContext: 'Public & Enterprise Institutions: GitOps serves as an immutable audit log for compliance frameworks (SOC2 Type II, ISO 27001, FedRAMP). Every infrastructure mutation must trace back to a cryptographically signed commit and an approved pull request.',
    emergingInnovations: [
      'Automated eBPF-based service mesh traffic routing',
      'AI policy enforcement during Terraform PR evaluation (Infracost / Trivy)',
      'Automated metric analysis using Prometheus anomaly detectors for rollback decisions'
    ],
    toolsAndPlatforms: ['Terraform', 'Kubernetes', 'ArgoCD', 'Flagger', 'Prometheus', 'GitHub Actions', 'Trivy'],
    connectedSkills: [
      { name: 'Terraform & Infrastructure as Code (IaC)', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Kubernetes Cluster Management & GitOps', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Progressive Delivery & Canary Traffic Shifting', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Cloud Security & Policy as Code', relevance: 'secondary', proficiency: 'Practitioner' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'Declarative Terraform Multi-Environment Module',
        type: 'IaC Codebase',
        format: 'HCL',
        description: 'Modular AWS/GCP infrastructure with VPC peering, EKS/GKE cluster configurations, and IAM least-privilege roles.'
      },
      {
        title: 'ArgoCD Application Manifest & Flagger Canary Spec',
        type: 'GitOps Manifest',
        format: 'YAML',
        description: 'Automated canary configuration with 5-step traffic shifting (10%, 25%, 50%, 100%) checking latency < 100ms.'
      }
    ],
    connectedEvidence: [
      {
        title: 'Multi-Region Kubernetes GitOps Deployment Repository',
        strengthLevel: 5,
        roleReadinessImpact: 'Proves high-level capability to architect automated, resilient cloud deployments.'
      }
    ],
    stages: [
      {
        stepNumber: 1,
        title: 'IaC Module Definition',
        phase: 'Provisioning',
        whatProfessionalsDo: 'Author reusable Terraform modules for networking, compute clusters, and storage buckets with parameterized environments.',
        toolsAndPlatforms: ['Terraform', 'Terragrunt', 'AWS CLI'],
        deliverable: 'Versioned Terraform Module with Automated Infracost Estimation'
      },
      {
        stepNumber: 2,
        title: 'Automated Security & Drift Check',
        phase: 'Validation',
        whatProfessionalsDo: 'Execute Trivy vulnerability scans and OPA (Open Policy Agent) compliance policies against Terraform pull requests in CI.',
        toolsAndPlatforms: ['Trivy', 'Open Policy Agent', 'GitHub Actions'],
        deliverable: 'Clean SAST & Compliance Security Attestation'
      },
      {
        stepNumber: 3,
        title: 'GitOps State Synchronization',
        phase: 'Deployment',
        whatProfessionalsDo: 'Merge PR into deployment branch. ArgoCD controller detects commit, syncs manifests, and applies declarative state to Kubernetes cluster.',
        toolsAndPlatforms: ['ArgoCD', 'Kubernetes', 'Helm'],
        deliverable: 'Kubernetes Desired State Synchronized & Healthy'
      },
      {
        stepNumber: 4,
        title: 'Progressive Canary Rollout',
        phase: 'Canary Release',
        whatProfessionalsDo: 'Flagger routes 10% of live traffic to the new canary pod. Analyzes error rate and p99 latency via Prometheus over 10-minute intervals before advancing.',
        toolsAndPlatforms: ['Flagger', 'Istio', 'Prometheus'],
        deliverable: 'Automated Canary Verification with Zero False Positives'
      },
      {
        stepNumber: 5,
        title: 'Traffic Promotion or Rollback',
        phase: 'Verification',
        whatProfessionalsDo: 'Promote canary to 100% upon meeting all SLO criteria. If error rate exceeds 0.5%, Flagger automatically cuts traffic back to primary pods.',
        toolsAndPlatforms: ['Slack Alerts', 'PagerDuty', 'Grafana'],
        deliverable: '100% Production Promotion Confirmed with Zero User Impact'
      }
    ],
    estimatedDuration: '1 - 2 Sprints',
    executionCadence: 'Continuous Delivery',
    evidenceStrengthLevel: 5,
    tags: ['devops', 'gitops', 'terraform', 'kubernetes', 'canary', 'argocd', 'cloud']
  },

  // 5. MANUFACTURING & INDUSTRIAL TECH — OT/IT EDGE TELEMETRY & PREDICTIVE MAINTENANCE (Domain Focus)
  {
    id: 'pathway-ind-edge-telemetry',
    title: 'OT/IT Edge Telemetry Ingestion & Predictive Maintenance SOP',
    codeName: 'IND-TELEMETRY-05',
    role: 'Product & Technical Operations',
    domain: 'Manufacturing & Industrial Tech',
    pathwayArchetype: 'operational_procedure',
    summary: 'Industrial IoT standard operating procedure linking factory floor Programmable Logic Controllers (PLCs) via OPC-UA/MQTT to cloud telemetry, executing real-time anomaly detection and predictive work order dispatch.',
    scopeClarification: 'This pathway models the specialized operational module bridging physical Operational Technology (OT) and enterprise cloud IT—representing a focused technical workflow inside smart manufacturing.',
    organizationalContext: 'Industrial & Public Sector Operations: Factory operations prioritize worker safety and machine uptime above all. Interventions require plant manager clearance, Lockout/Tagout (LOTO) protocols, and alignment with ISO 55000 asset management standards.',
    emergingInnovations: [
      'Edge-computed TinyML vibration and thermal anomaly inference',
      'Digital twin synchronization modeling turbine component fatigue',
      'Automated Computerized Maintenance Management System (CMMS) dispatch via webhook'
    ],
    toolsAndPlatforms: ['OPC-UA', 'MQTT / HiveMQ', 'AWS IoT Greengrass', 'InfluxDB', 'Grafana', 'SAP PM / Maximo'],
    connectedSkills: [
      { name: 'Industrial IoT Protocol Integration (OPC-UA / MQTT)', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Time-Series Data Ingestion & Anomaly Detection', relevance: 'primary', proficiency: 'Expert' },
      { name: 'CMMS Maintenance Workflow Automation', relevance: 'primary', proficiency: 'Practitioner' },
      { name: 'Industrial Safety & Asset Governance (ISO 55000)', relevance: 'secondary', proficiency: 'Practitioner' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'Edge Gateway Telemetry Architecture Blueprint',
        type: 'Architecture Diagram',
        format: 'Lucid / Draw.io',
        description: 'Network topology showing industrial DMZ, edge gateway brokers, and outbound TLS 1.3 telemetry tunnels.'
      },
      {
        title: 'Predictive Vibration Alert & LOTO Dispatch Runbook',
        type: 'Operational SOP',
        format: 'SOP Document',
        description: 'Standard operating procedure for maintenance technicians upon receiving threshold anomaly notifications.'
      }
    ],
    connectedEvidence: [
      {
        title: 'Factory Digital Twin & Predictive Maintenance Telemetry Pipeline',
        strengthLevel: 5,
        roleReadinessImpact: 'Validates real-world industrial tech implementation in heavy manufacturing environments.'
      }
    ],
    stages: [
      {
        stepNumber: 1,
        title: 'Sensor Protocol Mapping (Modbus / OPC-UA)',
        phase: 'Edge Configuration',
        whatProfessionalsDo: 'Map physical accelerometer and thermocouple registers on Siemens / Allen-Bradley PLCs into standardized OPC-UA data nodes.',
        toolsAndPlatforms: ['Kepware', 'OPC-UA Expert', 'Industrial Edge Gateway'],
        deliverable: 'Standardized Sensor Node Tag Catalog'
      },
      {
        stepNumber: 2,
        title: 'Edge Gateway Ingestion & Normalization',
        phase: 'Ingestion',
        whatProfessionalsDo: 'Deploy local edge daemon filtering sensor noise, computing 10-second rolling averages, and packaging payloads into lightweight JSON over MQTT.',
        toolsAndPlatforms: ['AWS IoT Greengrass', 'HiveMQ Broker'],
        deliverable: 'Low-Bandwidth Resilient MQTT Telemetry Stream'
      },
      {
        stepNumber: 3,
        title: 'Time-Series Anomaly Detection',
        phase: 'Analytics',
        whatProfessionalsDo: 'Stream normalized metrics into time-series database. Run statistical outlier models flagging bearing wear frequency spikes (e.g. kurtosis > 4.5).',
        toolsAndPlatforms: ['InfluxDB', 'Python / Scikit-learn', 'Grafana'],
        deliverable: 'Automated Predictive Alert Trigger'
      },
      {
        stepNumber: 4,
        title: 'Plant Floor Alert Routing & CMMS Dispatch',
        phase: 'Operations',
        whatProfessionalsDo: 'Webhook event generates high-priority preventive maintenance ticket in SAP Plant Maintenance (PM), reserving replacement parts in inventory.',
        toolsAndPlatforms: ['SAP PM', 'IBM Maximo', 'Twilio SMS'],
        deliverable: 'Automated Work Order Dispatched to On-Shift Shift Supervisor'
      },
      {
        stepNumber: 5,
        title: 'Maintenance Post-Audit & Model Retraining',
        phase: 'Continuous Improvement',
        whatProfessionalsDo: 'Technician replaces worn bearing, inputs physical wear measurements into tablet, and closes work order, updating ground truth training labels.',
        toolsAndPlatforms: ['SAP Tablet Client', 'JupyterLab'],
        deliverable: 'Closed Maintenance Audit & Retrained Anomaly Model'
      }
    ],
    estimatedDuration: '4 - 6 Weeks (Deployment & Validation)',
    executionCadence: '24/7 Continuous Telemetry Operations',
    evidenceStrengthLevel: 5,
    tags: ['manufacturing', 'industrial-tech', 'iot', 'predictive-maintenance', 'edge-computing', 'telemetry', 'operations']
  },

  // 6. DATA ANALYTICS & BI — WAREHOUSE MODELING & DECISION INTELLIGENCE WORKSTREAM
  {
    id: 'pathway-data-bi-pipeline',
    title: 'Enterprise Dimensional Modeling & Decision Intelligence Pipeline',
    codeName: 'DATA-BI-06',
    role: 'Data Analytics & BI',
    domain: 'Enterprise SaaS',
    pathwayArchetype: 'business_process',
    summary: 'A structured analytics pipeline from raw product event extraction through dbt dimensional star schema modeling, metric layer governance, and executive KPI dashboard delivery.',
    scopeClarification: 'This represents the core data modeling and decision intelligence workstream inside analytics teams. It models how business questions translate into validated data models.',
    organizationalContext: 'How Organizations Operate: Corporate governance requires a single source of truth for financial and revenue metrics (ARR, churn, CAC). Metric definitions must be formally certified by Finance and Revenue Operations before executive reporting.',
    emergingInnovations: [
      'Semantic metric layers (dbt Semantic Layer / Cube.js) standardizing metric queries across BI tools',
      'Automated data lineage and impact analysis during pull requests',
      'AI natural language querying over curated dimensional models'
    ],
    toolsAndPlatforms: ['Snowflake', 'BigQuery', 'dbt (data build tool)', 'Tableau', 'Looker', 'Fivetran', 'Monte Carlo'],
    connectedSkills: [
      { name: 'SQL & Dimensional Modeling (Kimball Star Schema)', relevance: 'primary', proficiency: 'Expert' },
      { name: 'dbt (Data Build Tool) Pipeline Engineering', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Executive BI Dashboard Design (Tableau / Looker)', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Data Quality Auditing & Anomaly Detection', relevance: 'secondary', proficiency: 'Practitioner' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'dbt Dimensional Warehouse Repository with Data Tests',
        type: 'Data Codebase',
        format: 'SQL / dbt YAML',
        description: 'Complete staging, intermediate, and dimensional fact/dimension models with automated freshness tests.'
      },
      {
        title: 'Executive Revenue & Customer Retention Dashboard',
        type: 'BI Dashboard',
        format: 'Tableau / Looker',
        description: 'Interactive executive view tracking cohort retention, churn predictors, and customer lifetime value (LTV).'
      }
    ],
    connectedEvidence: [
      {
        title: 'Enterprise SaaS Customer Retention dbt Pipeline',
        strengthLevel: 5,
        roleReadinessImpact: 'Proves high proficiency in data warehouse architecture, SQL transformations, and metric definition.'
      }
    ],
    stages: [
      {
        stepNumber: 1,
        title: 'Business Problem Framing',
        phase: 'Discovery',
        whatProfessionalsDo: 'Meet with VP of Finance and CRO to understand metric ambiguities around monthly net retention and enterprise expansion.',
        toolsAndPlatforms: ['Notion', 'Miro', 'Zoom'],
        deliverable: 'Certified Metric Definition Spec Document'
      },
      {
        stepNumber: 2,
        title: 'Source Data Ingestion & Audit',
        phase: 'Extraction',
        whatProfessionalsDo: 'Sync Stripe, Salesforce, and product event streams into raw warehouse schemas via automated connectors. Audit for null IDs and duplicate transactions.',
        toolsAndPlatforms: ['Fivetran', 'Snowflake'],
        deliverable: 'Validated Raw Source Tables with Zero Ingestion Gaps'
      },
      {
        stepNumber: 3,
        title: 'dbt Dimensional Modeling (Facts & Dims)',
        phase: 'Transformation',
        whatProfessionalsDo: 'Write dbt SQL models creating `dim_customers` (Type-2 Slowly Changing Dimension) and `fct_mrr_movements` fact tables with automated schema tests.',
        toolsAndPlatforms: ['dbt Core', 'Snowflake', 'Git'],
        deliverable: 'Tested Star Schema Marts with Automated dbt Docs'
      },
      {
        stepNumber: 4,
        title: 'Semantic Layer Metric Certification',
        phase: 'Governance',
        whatProfessionalsDo: 'Define calculated metrics in the dbt Semantic Layer with unambiguous mathematical definitions for Net Revenue Retention (NRR).',
        toolsAndPlatforms: ['dbt Semantic Layer', 'Cube'],
        deliverable: 'Certified Semantic Metric Catalog'
      },
      {
        stepNumber: 5,
        title: 'Executive Dashboard Prototyping',
        phase: 'Delivery',
        whatProfessionalsDo: 'Build performant, mobile-optimized executive dashboard with drill-down capability into customer segments and geography.',
        toolsAndPlatforms: ['Tableau', 'Looker'],
        deliverable: 'Live Interactive Executive Decision Dashboard'
      }
    ],
    estimatedDuration: '3 - 4 Weeks',
    executionCadence: 'Sprint-Based / Quarterly Strategic Cycles',
    evidenceStrengthLevel: 5,
    tags: ['data-analytics', 'bi', 'dbt', 'snowflake', 'dimensional-modeling', 'tableau', 'sql']
  },

  // 7. UI/UX & PRODUCT DESIGN — DESIGN SYSTEM & USABILITY TESTING WORKSTREAM
  {
    id: 'pathway-design-system-tokens',
    title: 'Design System Tokenization & Usability Testing Sprint',
    codeName: 'DES-SYSTEM-07',
    role: 'UI/UX & Product Design',
    domain: 'Enterprise SaaS',
    pathwayArchetype: 'cross_functional_workflow',
    summary: 'A cross-functional design and engineering workflow mapping design tokens, accessible component states, interactive Figma prototypes, and moderated usability testing.',
    scopeClarification: 'This is a cross-functional workflow and product module representing the systematic bridge between UX research and frontend component libraries.',
    organizationalContext: 'How Organizations Operate: Enterprise design systems enforce WCAG 2.1 AA legal accessibility compliance. Component updates require design review sign-off and automated visual regression checks (Chromatic) before merging.',
    emergingInnovations: [
      'Figma-to-code automated design token synchronization via GitHub Actions',
      'Automated color contrast and keyboard navigation accessibility audits in Figma',
      'AI-generated synthetic user test sessions highlighting interaction friction'
    ],
    toolsAndPlatforms: ['Figma', 'Tokens Studio', 'Storybook', 'Maze', 'Chromatic', 'GitHub'],
    connectedSkills: [
      { name: 'Design System Architecture & Design Tokens', relevance: 'primary', proficiency: 'Expert' },
      { name: 'High-Fidelity Prototyping & Micro-interactions', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Moderated & Unmoderated Usability Testing', relevance: 'primary', proficiency: 'Expert' },
      { name: 'WCAG 2.1 AA Accessibility Standards', relevance: 'secondary', proficiency: 'Practitioner' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'Figma Enterprise Design System & Token Library',
        type: 'Design System',
        format: 'Figma File / Tokens JSON',
        description: 'Complete component library with light/dark tokens, typography scales, accessibility contrasts, and responsive variants.'
      },
      {
        title: 'Usability Testing Synthesis Report & Task Completion Matrix',
        type: 'UX Research Synthesis',
        format: 'Slide Deck / PDF',
        description: 'Findings from 10 moderated usability sessions scoring System Usability Scale (SUS: 86/100) and friction points.'
      }
    ],
    connectedEvidence: [
      {
        title: 'Multi-Brand Accessible Design System in Figma & Storybook',
        strengthLevel: 5,
        roleReadinessImpact: 'Demonstrates industry-standard design system orchestration and frontend collaboration.'
      }
    ],
    stages: [
      {
        stepNumber: 1,
        title: 'User Workflow Mapping & Wireframing',
        phase: 'Exploration',
        whatProfessionalsDo: 'Sketch user journeys and low-fidelity wireframes exploring checkout and configuration flows.',
        toolsAndPlatforms: ['FigJam', 'Miro'],
        deliverable: 'Low-Fidelity User Journey Flowchart'
      },
      {
        stepNumber: 2,
        title: 'Design Token Synchronization',
        phase: 'Systematization',
        whatProfessionalsDo: 'Define spacing, color palettes, and typography tokens. Export token JSON to GitHub repository for frontend styling engines.',
        toolsAndPlatforms: ['Tokens Studio', 'Figma', 'GitHub'],
        deliverable: 'Versioned Design Token Package'
      },
      {
        stepNumber: 3,
        title: 'Interactive High-Fidelity Prototype',
        phase: 'Prototyping',
        whatProfessionalsDo: 'Construct clickable Figma prototype with realistic input variables, hover states, error animations, and responsive screen sizes.',
        toolsAndPlatforms: ['Figma Interactive Components'],
        deliverable: 'Functional Clickable Prototype for User Testing'
      },
      {
        stepNumber: 4,
        title: 'Moderated Usability Testing',
        phase: 'Validation',
        whatProfessionalsDo: 'Facilitate 5 moderated user test sessions with enterprise administrators. Record task completion times, confusion moments, and qualitative comments.',
        toolsAndPlatforms: ['Maze', 'Zoom', 'Dovetail'],
        deliverable: 'Usability Session Recordings & Quantitative Task Matrix'
      },
      {
        stepNumber: 5,
        title: 'Developer Handoff & Storybook Sync',
        phase: 'Delivery',
        whatProfessionalsDo: 'Annotate specs with component padding, token variable names, and accessibility ARIA labels. Review Storybook component implementation.',
        toolsAndPlatforms: ['Figma Dev Mode', 'Storybook', 'Chromatic'],
        deliverable: 'Approved Component Handoff with 100% Visual Parity'
      }
    ],
    estimatedDuration: '2 - 3 Weeks',
    executionCadence: 'Sprint-Based',
    evidenceStrengthLevel: 5,
    tags: ['ui-ux', 'design-system', 'figma', 'tokens', 'usability-testing', 'accessibility', 'frontend']
  },

  // 8. AI & MACHINE LEARNING — PRODUCTION LLM PIPELINE & GUARDRAILS
  {
    id: 'pathway-ai-llm-pipeline',
    title: 'Production LLM Deployment, Prompt Guardrails & Inference Pipeline',
    codeName: 'AI-LLM-08',
    role: 'Data & Machine Learning',
    domain: 'AI & Machine Learning',
    pathwayArchetype: 'engineering_module',
    summary: 'A disciplined engineering pathway for deploying generative AI features: dataset curation, prompt engineering with few-shot evaluations, safety guardrails, semantic caching, and latency telemetry.',
    scopeClarification: 'This is an engineering module and project stage within AI/ML roles. It defines the specialized operational pipeline of deploying safe, cost-efficient LLM agents into customer applications.',
    organizationalContext: 'How Organizations Operate: Enterprise AI adoption requires strict adherence to NIST AI Risk Management standards, copyright audits, PII scrubbing (preventing client data leaks to foundation models), and strict per-tenant token rate budgeting.',
    emergingInnovations: [
      'Real-time semantic caching reducing model inference costs by 40%',
      'Automated LLM-as-a-judge evaluation frameworks (RAGAS / DeepEval)',
      'Speculative decoding and token streaming optimization'
    ],
    toolsAndPlatforms: ['Python', 'LangChain / LlamaIndex', 'vLLM', 'LangSmith', 'Qdrant / Pinecone', 'OpenAI / Gemini SDK', 'Postman'],
    connectedSkills: [
      { name: 'LLM Prompt Engineering & System Instructions', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Retrieval-Augmented Generation (RAG) Architecture', relevance: 'primary', proficiency: 'Expert' },
      { name: 'AI Safety Guardrails & Hallucination Mitigation', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Vector Database Indexing & Hybrid Search', relevance: 'secondary', proficiency: 'Practitioner' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'Production RAG Ingestion & Vector Search Pipeline',
        type: 'AI Service Codebase',
        format: 'Python / Docker',
        description: 'Document chunking, embedding generation, Qdrant hybrid search, and context re-ranking service.'
      },
      {
        title: 'LLM Evaluation Suite & Safety Benchmark Report',
        type: 'Benchmark Report',
        format: 'Jupyter Notebook / PDF',
        description: 'Empirical benchmark measuring answer correctness, hallucination rate (<1.2%), and latency budget.'
      }
    ],
    connectedEvidence: [
      {
        title: 'Enterprise Knowledge Assistant RAG & Evaluation Pipeline',
        strengthLevel: 5,
        roleReadinessImpact: 'Validates production-readiness in building and deploying modern AI systems.'
      }
    ],
    stages: [
      {
        stepNumber: 1,
        title: 'Problem Framing & Latency Budgeting',
        phase: 'Scoping',
        whatProfessionalsDo: 'Determine whether task requires small fine-tuned model or prompt-engineered LLM. Establish p95 latency budget (<1.5s) and per-query cost limit (<$0.02).',
        toolsAndPlatforms: ['Google Docs', 'Python benchmark scripts'],
        deliverable: 'AI Architecture Feasibility Document'
      },
      {
        stepNumber: 2,
        title: 'Knowledge Chunking & Vector Ingestion',
        phase: 'Data Pipeline',
        whatProfessionalsDo: 'Parse domain documentation into semantic chunks with metadata tags. Generate vector embeddings and store in indexed vector database with HNSW search.',
        toolsAndPlatforms: ['LlamaIndex', 'Qdrant', 'Text-Embedding-004'],
        deliverable: 'Indexed High-Throughput Vector Knowledge Base'
      },
      {
        stepNumber: 3,
        title: 'System Instructions & Safety Guardrails',
        phase: 'Prompt Engineering',
        whatProfessionalsDo: 'Author strict system prompt with few-shot reasoning examples. Integrate NeMo Guardrails or regex safety filters preventing prompt injection and toxic output.',
        toolsAndPlatforms: ['NeMo Guardrails', 'LangSmith'],
        deliverable: 'Hardened Prompt Template with Injection Test Cases'
      },
      {
        stepNumber: 4,
        title: 'Automated Evaluation Suite (LLM-as-a-Judge)',
        phase: 'Testing',
        whatProfessionalsDo: 'Run test suite of 200 representative gold queries. Measure context recall, faithfulness, and answer relevance using automated scoring models.',
        toolsAndPlatforms: ['Ragas', 'DeepEval', 'Weights & Biases'],
        deliverable: 'Automated Benchmark Scorecard (94% Accuracy)'
      },
      {
        stepNumber: 5,
        title: 'Inference Serving & Semantic Caching',
        phase: 'Production Serving',
        whatProfessionalsDo: 'Deploy FastAPI inference service with Redis semantic caching for repeated queries. Stream tokens to frontend via Server-Sent Events (SSE).',
        toolsAndPlatforms: ['FastAPI', 'Redis', 'Docker', 'Datadog'],
        deliverable: 'Low-Latency Streaming API with 40% Cache Hit Ratio'
      }
    ],
    estimatedDuration: '3 - 5 Weeks',
    executionCadence: 'Sprint-Based',
    evidenceStrengthLevel: 5,
    tags: ['ai-ml', 'llm', 'rag', 'vector-database', 'langchain', 'prompt-engineering', 'safety']
  },

  // 9. SECURITY & SYSTEMS — ENTERPRISE INCIDENT RESPONSE & THREAT HUNTING
  {
    id: 'pathway-sec-threat-response',
    title: 'Enterprise Threat Hunting & SOC2 Incident Response Workflow',
    codeName: 'SEC-INCIDENT-09',
    role: 'Security & Systems',
    domain: 'Cybersecurity',
    pathwayArchetype: 'operational_procedure',
    summary: 'A standard operating procedure and repeatability cluster for detecting anomalous security events, executing host isolation, collecting memory forensics, and reporting regulatory breach notifications.',
    scopeClarification: 'This is an operational procedure and responsibility within Security & Systems roles. It governs the structured response to security compromises.',
    organizationalContext: 'Public & Regulatory Mandates: Enterprise cybersecurity teams must report confirmed breach incidents to relevant regulatory authorities (e.g. CISA, GDPR 72-hour notice, SEC Material Cyber Incident guidelines) and preserve cryptographic forensic chains of custody.',
    emergingInnovations: [
      'Automated SIEM alert correlation and false-positive reduction via ML',
      'Instant cloud workload isolation via dynamic security group updates',
      'Automated memory forensics and malware behavioral sandbox execution'
    ],
    toolsAndPlatforms: ['Splunk', 'CrowdStrike Falcon', 'Wireshark', 'Osquery', 'Jira Service Management', 'AWS GuardDuty'],
    connectedSkills: [
      { name: 'Threat Detection & SIEM Log Correlation', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Incident Containment & Host Isolation', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Memory & Disk Forensics Analysis', relevance: 'primary', proficiency: 'Practitioner' },
      { name: 'Regulatory Breach Disclosure & Legal Alignment', relevance: 'secondary', proficiency: 'Practitioner' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'Security Incident Post-Mortem & Timeline Report',
        type: 'Audit Document',
        format: 'Formal Report / PDF',
        description: 'Complete chronological forensic timeline of threat intrusion, attacker TTPs (MITRE ATT&CK), and remediation.'
      },
      {
        title: 'Automated SIEM Detection Rule & Remediation Script',
        type: 'Detection Rule',
        format: 'Sigma / Python',
        description: 'Custom detection signature triggering instant host network isolation upon anomalous privilege escalation.'
      }
    ],
    connectedEvidence: [
      {
        title: 'Enterprise Incident Response Exercise & Post-Mortem Memo',
        strengthLevel: 5,
        roleReadinessImpact: 'Validates ability to navigate complex high-stress enterprise cybersecurity incidents.'
      }
    ],
    stages: [
      {
        stepNumber: 1,
        title: 'Telemetry Ingress & SIEM Alert Trigger',
        phase: 'Detection',
        whatProfessionalsDo: 'Monitor SIEM console for alert triggers (e.g. anomalous outbound SSH traffic or credential dumping attempts on a bastion host).',
        toolsAndPlatforms: ['Splunk', 'AWS GuardDuty'],
        deliverable: 'Triage Ticket with Severity Classification (SEV-1)'
      },
      {
        stepNumber: 2,
        title: 'Host Containment & Isolation',
        phase: 'Containment',
        whatProfessionalsDo: 'Execute immediate network quarantine on compromised server via CrowdStrike agent, preserving volatility of system memory for forensics.',
        toolsAndPlatforms: ['CrowdStrike', 'AWS CLI'],
        deliverable: 'Quarantined Host Snapshot with Zero Lateral Movement'
      },
      {
        stepNumber: 3,
        title: 'Forensic Collection & Root Cause Analysis',
        phase: 'Investigation',
        whatProfessionalsDo: 'Acquire memory dump, extract web server access logs, inspect bash histories, and map attacker techniques against the MITRE ATT&CK framework.',
        toolsAndPlatforms: ['Volatility', 'Osquery', 'Wireshark'],
        deliverable: 'Forensic Artifact Package with Verified Chain of Custody'
      },
      {
        stepNumber: 4,
        title: 'Eradication & System Hardening',
        phase: 'Eradication',
        whatProfessionalsDo: 'Revoke compromised IAM access tokens, patch vulnerable software dependencies, rotate database credentials, and redeploy from clean immutable images.',
        toolsAndPlatforms: ['HashiCorp Vault', 'Terraform', 'Kubernetes'],
        deliverable: 'Hardened Production Environment with Rotated Secrets'
      },
      {
        stepNumber: 5,
        title: 'Regulatory Notification & Post-Mortem',
        phase: 'Closure',
        whatProfessionalsDo: 'Collaborate with Legal Counsel to determine GDPR/SEC notification obligations. Conduct blameless team post-mortem and publish prevention actions.',
        toolsAndPlatforms: ['Jira', 'Confluence'],
        deliverable: 'Executive Incident Briefing & Completed Regulatory Filing'
      }
    ],
    estimatedDuration: '48 - 72 Hours (Active Incident Cycle)',
    executionCadence: 'On-Demand / Incident Triggered',
    evidenceStrengthLevel: 5,
    tags: ['cybersecurity', 'incident-response', 'threat-hunting', 'soc2', 'forensics', 'siem', 'mitre-attack']
  },

  // 10. RESEARCH WORKFLOW — EMPIRICAL MARKET DISCOVERY & QUANTITATIVE USER RESEARCH
  {
    id: 'pathway-res-market-discovery',
    name: 'Empirical Market Discovery & Quantitative User Research Sprint',
    title: 'Empirical Market Discovery & Quantitative User Research Sprint',
    codeName: 'RES-DISCOVER-10',
    pathwayType: 'Research Workflow',
    parentRole: 'Business Analysis & Strategy',
    role: 'Business Analysis & Strategy',
    domain: 'Enterprise SaaS',
    function: 'Business Strategy & Finance',
    workType: 'Discovery & Research',
    description: 'A rigorous empirical research workflow synthesizing competitive intelligence, MaxDiff feature preference surveys, total addressable market (TAM) sizing, and willingness-to-pay sensitivity.',
    summary: 'A rigorous empirical research workflow synthesizing competitive intelligence, MaxDiff feature preference surveys, total addressable market (TAM) sizing, and willingness-to-pay sensitivity.',
    objective: 'Establish statistically significant market demand and pricing power before capital allocation.',
    triggerWhenUsed: 'Triggered during annual strategic planning, new product tier incubation, or major TAM expansion.',
    scopeClarification: 'A targeted research workflow producing decision intelligence—not ongoing corporate bookkeeping.',
    organizationalContext: 'Public & Enterprise Strategy: High-stakes business cases undergo Executive Investment Committee reviews and board-level risk audits.',
    inputs: ['Quarterly strategic directives', 'Churn verbatim records', 'Competitor SEC 10-K filings'],
    outputs: ['Market Demand Study', 'Van Westendorp Price Sensitivity Analysis', 'Executive Strategy Deck'],
    toolsAndPlatforms: ['Qualtrics', 'R / Python', 'Pitch', 'Gartner Reports', 'Statista'],
    connectedSkills: [
      { name: 'Quantitative Survey Design & MaxDiff Analysis', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Total Addressable Market (TAM) Financial Modeling', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Competitive Strategy & Win/Loss Synthesis', relevance: 'primary', proficiency: 'Practitioner' }
    ],
    requiredSkills: [
      { name: 'Quantitative Survey Design & MaxDiff Analysis', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Total Addressable Market (TAM) Financial Modeling', relevance: 'primary', proficiency: 'Expert' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'Executive Market Sizing & Price Sensitivity Brief',
        type: 'Research Report',
        format: 'PDF / Slides',
        description: 'Empirical analysis with 95% confidence intervals on willingness-to-pay thresholds.'
      }
    ],
    deliverables: [
      {
        title: 'Executive Market Sizing & Price Sensitivity Brief',
        type: 'Research Report',
        format: 'PDF / Slides',
        description: 'Empirical analysis with 95% confidence intervals on willingness-to-pay thresholds.'
      }
    ],
    connectedEvidence: [
      {
        title: 'B2B Enterprise SaaS Willingness-to-Pay Study',
        strengthLevel: 4,
        roleReadinessImpact: 'Proves high capability to conduct empirical business strategy research.'
      }
    ],
    knowledgeSources: ['Harvard Business School Strategy Playbook', 'Van Westendorp Methodology Spec'],
    relatedFrameworks: ['Van Westendorp Price Sensitivity', 'Porter Five Forces', 'Jobs-to-be-Done'],
    relatedProjects: ['European Market Expansion Feasibility Assessment'],
    relatedJobOpportunities: ['Senior Business Strategy Analyst', 'Director of Corporate Development'],
    stages: [
      {
        stepNumber: 1,
        title: 'Hypothesis Formulation & Sample Sizing',
        phase: 'Inception',
        whatProfessionalsDo: 'Formulate falsifiable hypotheses regarding customer willingness-to-pay and calculate statistical sample size (n=400+).',
        toolsAndPlatforms: ['R', 'Google Sheets'],
        deliverable: 'Pre-Registered Research Protocol'
      },
      {
        stepNumber: 2,
        title: 'Survey Fieldwork & Conjoint Execution',
        phase: 'Data Collection',
        whatProfessionalsDo: 'Field targeted survey to verified enterprise IT decision-makers with fraud filters and attention checks.',
        toolsAndPlatforms: ['Qualtrics', 'UserTesting'],
        deliverable: 'Cleaned Empirical Response Dataset'
      },
      {
        stepNumber: 3,
        title: 'Econometric Modeling & Executive Briefing',
        phase: 'Synthesis',
        whatProfessionalsDo: 'Run hierarchical Bayesian regression in R, extract demand elasticity, and present findings to C-Suite.',
        toolsAndPlatforms: ['Python', 'Pitch'],
        deliverable: 'Final Strategic Investment Memo'
      }
    ],
    activities: [
      {
        stepNumber: 1,
        title: 'Hypothesis Formulation & Sample Sizing',
        phase: 'Inception',
        whatProfessionalsDo: 'Formulate falsifiable hypotheses regarding customer willingness-to-pay and calculate statistical sample size (n=400+).',
        toolsAndPlatforms: ['R', 'Google Sheets'],
        deliverable: 'Pre-Registered Research Protocol'
      },
      {
        stepNumber: 2,
        title: 'Survey Fieldwork & Conjoint Execution',
        phase: 'Data Collection',
        whatProfessionalsDo: 'Field targeted survey to verified enterprise IT decision-makers with fraud filters and attention checks.',
        toolsAndPlatforms: ['Qualtrics', 'UserTesting'],
        deliverable: 'Cleaned Empirical Response Dataset'
      },
      {
        stepNumber: 3,
        title: 'Econometric Modeling & Executive Briefing',
        phase: 'Synthesis',
        whatProfessionalsDo: 'Run hierarchical Bayesian regression in R, extract demand elasticity, and present findings to C-Suite.',
        toolsAndPlatforms: ['Python', 'Pitch'],
        deliverable: 'Final Strategic Investment Memo'
      }
    ],
    difficulty: 'Advanced',
    seniorityRelevance: ['Senior', 'Lead / Staff', 'Principal / Fellow'],
    evidenceLevel: 4,
    evidenceStrengthLevel: 4,
    tags: ['research', 'market-analysis', 'pricing', 'conjoint', 'strategy', 'surveys'],
    createdDate: '2026-09-01',
    updatedDate: '2026-09-29',
    isArchived: false
  },

  // 11. PROJECT STAGE — SOC2 TYPE II AUDIT READINESS & COMPLIANCE GATE
  {
    id: 'pathway-sec-soc2-stage',
    name: 'SOC2 Type II Audit Readiness & Compliance Gate Milestone',
    title: 'SOC2 Type II Audit Readiness & Compliance Gate Milestone',
    codeName: 'SEC-SOC2-11',
    pathwayType: 'Project Stage',
    parentRole: 'Security & Systems',
    role: 'Security & Systems',
    domain: 'LegalTech & Compliance',
    function: 'Cybersecurity & Governance',
    workType: 'Quality, Governance & Compliance',
    description: 'A formal temporal project stage governing the 6-month observation window, automated evidence collection, access review attestations, and external CPA audit sign-off.',
    summary: 'A formal temporal project stage governing the 6-month observation window, automated evidence collection, access review attestations, and external CPA audit sign-off.',
    objective: 'Attain unreserved SOC2 Type II compliance attestation with zero exceptions.',
    triggerWhenUsed: 'Triggered annually as an operational gate before enterprise vendor procurement.',
    scopeClarification: 'A critical compliance stage with defined entry/exit gates, not an ad-hoc debugging task.',
    organizationalContext: 'Regulatory & Corporate Governance: SOC2 reports are legally binding representations audited by independent AICPA licensed firms.',
    inputs: ['Internal security policies', 'AWS/GCP IAM configurations', 'HR onboarding/offboarding records'],
    outputs: ['Independent Auditor SOC2 Type II Report', 'Continuous Compliance Control Matrix'],
    toolsAndPlatforms: ['Vanta', 'Drata', 'AWS CloudTrail', 'Okta', 'Jira Service Management'],
    connectedSkills: [
      { name: 'SOC2 Trust Services Criteria (Security, Availability, Confidentiality)', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Automated Compliance Evidence Collection (Vanta / Drata)', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Vendor Security Review & Third-Party Risk Management', relevance: 'primary', proficiency: 'Practitioner' }
    ],
    requiredSkills: [
      { name: 'SOC2 Trust Services Criteria', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Automated Compliance Evidence Collection', relevance: 'primary', proficiency: 'Expert' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'Clean SOC2 Type II AICPA Independent Audit Report',
        type: 'Audit Certification',
        format: 'PDF / Verified Attestation',
        description: 'Formal certification verifying that controls operated effectively over the 6-month period.'
      }
    ],
    deliverables: [
      {
        title: 'Clean SOC2 Type II AICPA Independent Audit Report',
        type: 'Audit Certification',
        format: 'PDF / Verified Attestation',
        description: 'Formal certification verifying that controls operated effectively over the 6-month period.'
      }
    ],
    connectedEvidence: [
      {
        title: 'Enterprise SOC2 Type II Evidence Repository & Access Matrix',
        strengthLevel: 5,
        roleReadinessImpact: 'Authoritative proof of enterprise security governance and audit leadership.'
      }
    ],
    knowledgeSources: ['AICPA Trust Services Criteria 2024', 'NIST SP 800-53'],
    relatedFrameworks: ['SOC2 Type II', 'ISO 27001', 'HIPAA Security Rule'],
    relatedProjects: ['Enterprise SaaS Zero-Trust Compliance Transformation'],
    relatedJobOpportunities: ['Security & Compliance Director', 'Lead Security GRC Analyst'],
    stages: [
      {
        stepNumber: 1,
        title: 'Control Baseline & Gap Assessment',
        phase: 'Gate Entry',
        whatProfessionalsDo: 'Connect automated compliance tools to cloud infrastructure and identity providers to map existing controls against the AICPA criteria.',
        toolsAndPlatforms: ['Vanta', 'AWS IAM'],
        deliverable: 'Gap Remediation Backlog'
      },
      {
        stepNumber: 2,
        title: '6-Month Observation Window Monitoring',
        phase: 'Observation Window',
        whatProfessionalsDo: 'Maintain continuous test coverage, enforce quarterly user access reviews, and verify vendor SOC2 reports.',
        toolsAndPlatforms: ['Okta', 'Drata'],
        deliverable: 'Unbroken Evidence Audit Log'
      },
      {
        stepNumber: 3,
        title: 'External Auditor Walkthrough & Sign-off',
        phase: 'Gate Exit',
        whatProfessionalsDo: 'Host sample testing sessions with third-party CPAs and remediate potential exceptions.',
        toolsAndPlatforms: ['Auditor Portal', 'Jira'],
        deliverable: 'Final SOC2 Type II Attestation'
      }
    ],
    activities: [
      {
        stepNumber: 1,
        title: 'Control Baseline & Gap Assessment',
        phase: 'Gate Entry',
        whatProfessionalsDo: 'Connect automated compliance tools to cloud infrastructure and identity providers to map existing controls against the AICPA criteria.',
        toolsAndPlatforms: ['Vanta', 'AWS IAM'],
        deliverable: 'Gap Remediation Backlog'
      },
      {
        stepNumber: 2,
        title: '6-Month Observation Window Monitoring',
        phase: 'Observation Window',
        whatProfessionalsDo: 'Maintain continuous test coverage, enforce quarterly user access reviews, and verify vendor SOC2 reports.',
        toolsAndPlatforms: ['Okta', 'Drata'],
        deliverable: 'Unbroken Evidence Audit Log'
      },
      {
        stepNumber: 3,
        title: 'External Auditor Walkthrough & Sign-off',
        phase: 'Gate Exit',
        whatProfessionalsDo: 'Host sample testing sessions with third-party CPAs and remediate potential exceptions.',
        toolsAndPlatforms: ['Auditor Portal', 'Jira'],
        deliverable: 'Final SOC2 Type II Attestation'
      }
    ],
    difficulty: 'Expert',
    seniorityRelevance: ['Senior', 'Lead / Staff', 'Manager / Director'],
    evidenceLevel: 5,
    evidenceStrengthLevel: 5,
    tags: ['soc2', 'compliance', 'security', 'audit', 'grc', 'enterprise'],
    createdDate: '2026-08-15',
    updatedDate: '2026-09-29',
    isArchived: false
  },

  // 12. WORKSTREAM — MULTI-CHANNEL ACQUISITION FUNNEL & GROWTH ENGINE
  {
    id: 'pathway-growth-engine-workstream',
    name: 'Multi-Channel Acquisition Funnel & Growth Engine Workstream',
    title: 'Multi-Channel Acquisition Funnel & Growth Engine Workstream',
    codeName: 'GRO-ENGINE-12',
    pathwayType: 'Workstream',
    parentRole: 'Growth & Product Marketing',
    role: 'Growth & Product Marketing',
    domain: 'AdTech & MarTech',
    function: 'Cross-Functional Operations',
    workType: 'Optimization & Maintenance',
    description: 'An ongoing growth workstream orchestrating viral referral loops, search-engine programmatic landing pages, lifecycle onboarding email sequences, and CAC:LTV optimization.',
    summary: 'An ongoing growth workstream orchestrating viral referral loops, search-engine programmatic landing pages, lifecycle onboarding email sequences, and CAC:LTV optimization.',
    objective: 'Drive continuous sustainable organic growth lowering blended customer acquisition costs by 35%.',
    triggerWhenUsed: 'Active throughout sprint cycles and continuous demand generation campaigns.',
    scopeClarification: 'A continuous workstream of experiments and conversion improvements.',
    organizationalContext: 'How Organizations Operate: Growth initiatives coordinate closely with Brand Marketing, Legal (CAN-SPAM / GDPR opt-in laws), and Engineering for fast code deployment.',
    inputs: ['User attribution telemetry', 'Product onboarding drop-off logs', 'Ad spend budget'],
    outputs: ['High-converting Programmatic Landing Pages', 'Lifecycle Email Automation Sequence', 'Weekly Growth Experiment Scorecard'],
    toolsAndPlatforms: ['HubSpot', 'Customer.io', 'Segment', 'Next.js', 'Google Search Console', 'Mixpanel'],
    connectedSkills: [
      { name: 'Programmatic SEO & Content Systems', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Lifecycle Marketing & Behavioral Trigger Sequences', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Conversion Rate Optimization (CRO) & Funnel Analysis', relevance: 'primary', proficiency: 'Expert' }
    ],
    requiredSkills: [
      { name: 'Programmatic SEO', relevance: 'primary', proficiency: 'Expert' },
      { name: 'Lifecycle Marketing Automation', relevance: 'primary', proficiency: 'Expert' }
    ],
    deliverablesAndArtifacts: [
      {
        title: 'Programmatic Landing Page Engine & Conversion Benchmark',
        type: 'Growth Engine',
        format: 'Next.js / Analytics Spec',
        description: '1,200 indexed dynamic pages delivering 4.8% organic conversion rate.'
      }
    ],
    deliverables: [
      {
        title: 'Programmatic Landing Page Engine & Conversion Benchmark',
        type: 'Growth Engine',
        format: 'Next.js / Analytics Spec',
        description: '1,200 indexed dynamic pages delivering 4.8% organic conversion rate.'
      }
    ],
    connectedEvidence: [
      {
        title: 'Enterprise PLG Growth Engine & Referral Architecture',
        strengthLevel: 4,
        roleReadinessImpact: 'Demonstrates data-driven mastery of growth loops and funnel conversion.'
      }
    ],
    knowledgeSources: ['Reforge Growth Series', 'Baymard Institute Checkout Usability Guidelines'],
    relatedFrameworks: ['AARRR Pirate Metrics', 'ICE Prioritization Score', 'Viral Coefficient K-Factor'],
    relatedProjects: ['Self-Serve Tier Viral Loop Engine'],
    relatedJobOpportunities: ['Head of Growth', 'Senior Growth Product Manager'],
    stages: [
      {
        stepNumber: 1,
        title: 'Funnel Telemetry & Drop-Off Audit',
        phase: 'Analysis',
        whatProfessionalsDo: 'Inspect step-by-step signup funnel in Mixpanel, identifying highest-friction friction point between signup and activation milestone.',
        toolsAndPlatforms: ['Mixpanel', 'FullStory'],
        deliverable: 'Funnel Drop-off Friction Matrix'
      },
      {
        stepNumber: 2,
        title: 'Behavioral Trigger Sequence Deployment',
        phase: 'Execution',
        whatProfessionalsDo: 'Configure conditional email and in-app prompt triggers in Customer.io nudging users toward key activation aha-moments.',
        toolsAndPlatforms: ['Customer.io', 'Figma'],
        deliverable: 'Automated 5-Step Lifecycle Journey'
      },
      {
        stepNumber: 3,
        title: 'Conversion Optimization & Lift Measurement',
        phase: 'Measurement',
        whatProfessionalsDo: 'Run A/B test on onboarding checklist vs. guided product tour, measuring Day-14 retained active users.',
        toolsAndPlatforms: ['LaunchDarkly', 'Statsig'],
        deliverable: 'Growth Experiment Result Scorecard'
      }
    ],
    activities: [
      {
        stepNumber: 1,
        title: 'Funnel Telemetry & Drop-Off Audit',
        phase: 'Analysis',
        whatProfessionalsDo: 'Inspect step-by-step signup funnel in Mixpanel, identifying highest-friction friction point between signup and activation milestone.',
        toolsAndPlatforms: ['Mixpanel', 'FullStory'],
        deliverable: 'Funnel Drop-off Friction Matrix'
      },
      {
        stepNumber: 2,
        title: 'Behavioral Trigger Sequence Deployment',
        phase: 'Execution',
        whatProfessionalsDo: 'Configure conditional email and in-app prompt triggers in Customer.io nudging users toward key activation aha-moments.',
        toolsAndPlatforms: ['Customer.io', 'Figma'],
        deliverable: 'Automated 5-Step Lifecycle Journey'
      },
      {
        stepNumber: 3,
        title: 'Conversion Optimization & Lift Measurement',
        phase: 'Measurement',
        whatProfessionalsDo: 'Run A/B test on onboarding checklist vs. guided product tour, measuring Day-14 retained active users.',
        toolsAndPlatforms: ['LaunchDarkly', 'Statsig'],
        deliverable: 'Growth Experiment Result Scorecard'
      }
    ],
    difficulty: 'Advanced',
    seniorityRelevance: ['Mid-Level', 'Senior', 'Lead / Staff'],
    evidenceLevel: 4,
    evidenceStrengthLevel: 4,
    tags: ['growth', 'plg', 'seo', 'lifecycle', 'cro', 'funnel', 'marketing'],
    createdDate: '2026-09-10',
    updatedDate: '2026-09-29',
    isArchived: false
  }
];

