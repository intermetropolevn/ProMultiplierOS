import { CareerProject } from '../types';

export const INITIAL_PROJECTS: CareerProject[] = [
  {
    id: 'proj-checkout-idempotency',
    title: 'Core Checkout Idempotency & Payment Replay Engine',
    tagline: 'High-throughput at-most-once payment processing pipeline with atomic distributed locking and zero duplicate charges across $45M volume.',
    role: 'Lead Platform / Backend Engineer',
    company: 'Fintech Payments Group',
    domain: 'Fintech & Payments',
    status: 'completed',
    timeframe: 'Q1 2025 - Q3 2025',
    techStack: ['PostgreSQL', 'Redis', 'Node.js / TypeScript', 'Kafka', 'Docker', 'Prometheus'],
    metrics: [
      '0 duplicate transactions across $45M processed annual volume',
      '85ms P99 cached replay latency for retried checkout requests',
      '99.999% reconciliation audit pass rate on monthly ledger'
    ],
    sections: [
      {
        id: 'sec-chk-1',
        type: 'business_context',
        title: 'Business Context & Objective',
        order: 1,
        content: `Our mobile checkout processing system was handling over **4,500 transactions per minute** during flash sale spikes. Due to intermittent 4G/5G edge connectivity in Southeast Asia, mobile shoppers repeatedly tapped "Submit Payment" after client socket timeouts, generating duplicate payment authorization requests to our downstream acquiring banks.`
      },
      {
        id: 'sec-chk-2',
        type: 'problem',
        title: 'Core Problem Statement',
        order: 2,
        content: `Downstream payment gateways lacked native cross-retry deduplication without strict idempotency keys. In Q4 alone, duplicate authorization holds resulted in:
- **$180,000** in temporary double charges triggering chargeback disputes
- **1,400+ angry customer support tickets**
- Disproportionately high merchant penalty fees from payment schemes (Visa/Mastercard)`
      },
      {
        id: 'sec-chk-3',
        type: 'options',
        title: 'Architecture & Solution Options Evaluated',
        order: 3,
        content: `We evaluated 3 distinct deduplication strategies:

| Strategy | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- |
| **A. Database Unique Constraints Only** | Zero external dependencies; ACID guaranteed | Heavy lock contention under 5,000 RPS flash spikes; degrades database pool | Rejected as primary layer |
| **B. Distributed In-Memory Lock (Redis SET NX)** | Ultra-fast (< 2ms); protects DB from write storms | Risk of cache node evictions or unhandled lock expiration | Adopted with DB backing |
| **C. Optimistic Offline Deduplication via Event Log** | Decoupled and non-blocking | Delayed feedback; does not prevent initial parallel bank authorization | Rejected |

**Selected Hybrid Design:** Atomic Redis distributed lease with client-generated \`Idempotency-Key\` UUIDs + durable PostgreSQL serializable constraints as the authoritative single source of truth.`
      },
      {
        id: 'sec-chk-4',
        type: 'tradeoffs',
        title: 'Strategic & Architectural Trade-offs',
        order: 4,
        content: `- **Added 2ms baseline latency** per write request to acquire the distributed Redis lock, which was completely acceptable given payment gateway network latency is 400-800ms.
- **Short-lived response caching:** Cached successful payment responses in Redis with a 24-hour TTL. If the user’s device retried, the system served the identical cached response within **85ms** without hitting the payment gateway twice.`
      },
      {
        id: 'sec-chk-5',
        type: 'result',
        title: 'Measurable Outcomes & Business Impact',
        order: 5,
        content: `1. **Zero duplicate charges** recorded across over **$45,000,000** in annualized processed payment volume.
2. **85ms P99 replay latency** for retried requests (down from 1,200ms gateway round trips).
3. **100% automated reconciliation parity** with zero manual finance ops intervention.`
      },
      {
        id: 'sec-chk-6',
        type: 'lessons_learned',
        title: 'Lessons Learned & Retrospective',
        order: 6,
        content: `Always enforce payload hashing alongside idempotency keys. Early in staging, we discovered a edge case where a client sent the *same* idempotency key with a *different* cart amount. We updated the middleware to verify SHA-256 fingerprint matching on the request body to reject mutated replays with HTTP 422.`
      }
    ],
    workingNotes: `# Working Notes & Scratchpad
- Verified Redis cluster failover behavior under simulated network partition.
- Added Grafana dashboard for \`idempotency_cache_hit_ratio\` and \`lock_contention_rate\`.
- Next step: Review webhook notification replay idempotency for merchant callbacks.`,
    evidenceNotes: `Telemetry gathered during 2025 Black Friday:
- Total checkout requests: 6.2M
- Idempotency hits (retried requests successfully prevented): 42,390
- False positives: 0`,
    linkedStoryIds: ['story-crm-migration'],
    linkedBlueprintIds: ['bp-1789129141783'],
    createdAt: '2025-06-15T08:00:00.000Z',
    updatedAt: '2025-09-12T14:20:00.000Z'
  },
  {
    id: 'proj-zero-downtime-crm',
    title: 'Zero-Downtime CRM & Data Pipeline Modernization',
    tagline: 'Dual-run migration of 12M customer records from legacy monolith CRM to PostgreSQL with real-time Kafka Debezium CDC reconciliation.',
    role: 'Lead Platform Engineer & Project Owner',
    company: 'Enterprise SaaS Solutions',
    domain: 'Cloud Infrastructure & DevOps',
    status: 'completed',
    timeframe: 'Q3 2024 - Q1 2025',
    techStack: ['PostgreSQL', 'Apache Kafka', 'Debezium CDC', 'Kubernetes', 'Go', 'Prometheus'],
    metrics: [
      '12,000,000 customer records synchronized with 99.999% checksum parity',
      '0 seconds unplanned downtime during final production DNS cutover',
      '$35,000 monthly legacy database license savings'
    ],
    sections: [
      {
        id: 'sec-crm-1',
        type: 'business_context',
        title: 'Business Context & Objective',
        order: 1,
        content: `The company’s 7-year-old proprietary CRM database was suffering from severe schema drift, erratic latency spikes up to 4 seconds, and blocked modern multi-region sales automation. Migrating the system using a traditional offline maintenance window would have required **14 hours of total downtime**, which was contractually forbidden by 3 Tier-1 enterprise tenants with 99.99% SLA requirements.`
      },
      {
        id: 'sec-crm-2',
        type: 'problem',
        title: 'Core Problem Statement',
        order: 2,
        content: `Over 12M customer records across 80+ relational tables had to be normalized, enriched, and migrated to a modern partitioned PostgreSQL cluster while serving active read/write traffic at 3,000 queries per second.`
      },
      {
        id: 'sec-crm-3',
        type: 'decision',
        title: 'Decision & Architecture Strategy',
        order: 3,
        content: `Implemented a **Dual-Run Change Data Capture (CDC)** architecture:
- Deployed **Debezium connectors** to read MySQL binlog change events without querying the production database.
- Streamed mutated row events to **Kafka event topics**.
- Built an idempotent ingestion microservice in Go to transform and insert records into PostgreSQL.
- Maintained a continuous background checksum verification job comparing primary keys and row hashes.`
      },
      {
        id: 'sec-crm-4',
        type: 'tradeoffs',
        title: 'Strategic & Architectural Trade-offs',
        order: 4,
        content: `- We invested **3 additional engineering weeks** building automated schema reconciliation and audit tooling, but completely eliminated business disruption.
- We opted for continuous CDC replication rather than taking a high-risk multi-hour offline freeze.`
      },
      {
        id: 'sec-crm-5',
        type: 'result',
        title: 'Measurable Outcomes & Business Impact',
        order: 5,
        content: `- **Zero downtime:** Final DNS cutover executed in 90 seconds without a single dropped transaction.
- **12,000,000 customer records** verified at 99.999% field parity.
- Decommissioned legacy database servers, saving **$35,000/month** in proprietary licensing fees.`
      }
    ],
    workingNotes: `# Working Notes
- Verified that Kafka partition ordering by tenantId prevents out-of-order CDC updates.
- Checksum audit ran daily for 14 days prior to cutover. Parity held rock solid.`,
    evidenceNotes: `Dual-run verification log:
- Total rows compared: 12,148,220
- Discrepancies detected and resolved prior to cutover: 14 (all due to timezone formatting)`,
    linkedStoryIds: ['story-crm-migration'],
    linkedBlueprintIds: ['bp-1789129141783'],
    createdAt: '2024-09-01T10:00:00.000Z',
    updatedAt: '2025-02-15T16:00:00.000Z'
  },
  {
    id: 'proj-k8s-canary-pipeline',
    title: 'Kubernetes Automated Canary Pipeline & Metric Rollbacks',
    tagline: 'Architected automated zero-downtime Kubernetes canary rollouts using Argo Rollouts with automated Prometheus metric health evaluation.',
    role: 'Senior DevOps / SRE Lead',
    company: 'Cloud Scale Platforms',
    domain: 'Cloud Infrastructure & DevOps',
    status: 'active',
    timeframe: 'Q2 2025 - Present',
    techStack: ['Kubernetes', 'Argo Rollouts', 'Prometheus', 'Envoy', 'Helm', 'Grafana'],
    metrics: [
      '< 0.2% change failure rate across 400+ continuous production releases',
      '45-second automated rollback execution upon error budget anomaly',
      '0 HTTP 502 connection drop errors during peak volume deployments'
    ],
    sections: [
      {
        id: 'sec-k8s-1',
        type: 'business_context',
        title: 'Business Context & Objective',
        order: 1,
        content: `With engineering expanding to 18 squads releasing 15+ microservices daily, manual deployment monitoring was burning out on-call engineers. Defective releases occasionally reached 100% of production users before anyone noticed error alerts.`
      },
      {
        id: 'sec-k8s-2',
        type: 'decision',
        title: 'Decision & Technical Strategy',
        order: 2,
        content: `Designed an automated canary pipeline using **Argo Rollouts** and **Prometheus AnalysisTemplates**:
- Progressive traffic shifting: **5% → 25% → 50% → 100%** over 15 minutes.
- Automated Prometheus metric queries checking HTTP 5xx rate (< 0.1%) and P99 latency (< 250ms).
- Immediate automated rollback if any threshold is breached during canary evaluation.`
      },
      {
        id: 'sec-k8s-3',
        type: 'result',
        title: 'Measurable Outcomes',
        order: 3,
        content: `- Production change failure rate dropped to **< 0.2%**.
- Automated rollback time reduced from 20 minutes (manual human triaging) to **45 seconds**.
- Over 400 releases delivered seamlessly without customer disruption.`
      }
    ],
    workingNotes: `# SRE Log
- Added preStop sleep 10s hooks to prevent inflight socket severance.
- AnalysisTemplate queries tuned to filter out transient test bots.`,
    evidenceNotes: `Prometheus query benchmark:
- rate(http_requests_total{status=~"5.."}[2m]) / rate(http_requests_total[2m]) < 0.001`,
    linkedStoryIds: [],
    linkedBlueprintIds: [],
    createdAt: '2025-04-10T11:00:00.000Z',
    updatedAt: '2025-08-20T17:30:00.000Z'
  },
  {
    id: 'proj-self-serve-pricing-tier',
    title: 'Self-Serve Checkout Expansion & Growth Experiment',
    tagline: 'Navigated conflicting executive opinions on a new tiered pricing model by framing it as a two-way door decision and launching a painted-door prototype.',
    role: 'Senior Product Manager (Growth)',
    company: 'Global E-Commerce Platforms',
    domain: 'Enterprise SaaS',
    status: 'completed',
    timeframe: 'Q3 2024 - Q4 2024',
    techStack: ['Mixpanel', 'FullStory', 'Optimizely', 'React', 'Stripe'],
    metrics: [
      '+18% conversion lift in 30-day trial cohort',
      '48-hour patch turnaround on critical mobile checkout friction',
      'Preserved 8 senior engineering weeks by avoiding premature backend builds'
    ],
    sections: [
      {
        id: 'sec-prc-1',
        type: 'business_context',
        title: 'Business Context & Objective',
        order: 1,
        content: `Executive leadership was deadlocked over whether to introduce a **$49/month self-serve tier**. The sales leadership feared cannibalizing $500/mo enterprise pipeline, while the growth team argued we were forfeiting thousands of high-intent developer inbound leads.`
      },
      {
        id: 'sec-prc-2',
        type: 'decision',
        title: 'Decision & Hypothesis Framing',
        order: 2,
        content: `Framed the initiative as a **Type 2 (reversible) door decision**. Rather than committing 8 engineering weeks building automated multi-tenant billing upfront, we launched a 2-week painted-door experiment with clear tripwire guardrails to measure empirical buyer intent.`
      },
      {
        id: 'sec-prc-3',
        type: 'result',
        title: 'Empirical Results & Rollout',
        order: 3,
        content: `Validated an **18% trial-to-paid conversion lift** with under 3% sales overlap. When we identified a 35% mobile checkout drop-off, we shipped a patch within 48 hours and subsequently greenlit full backend implementation.`
      }
    ],
    workingNotes: `# PM Journal
- Key stakeholder alignment meeting with VP Sales scheduled for Tuesday.
- Tripwire defined: If cannibalization exceeds 5%, pause experiment immediately.`,
    evidenceNotes: `Cohort analysis:
- 1,200 unique visitors exposed to self-serve pricing
- 216 completed checkout intention flow`,
    linkedStoryIds: ['story-pricing-experiment'],
    linkedBlueprintIds: [],
    createdAt: '2024-07-15T09:00:00.000Z',
    updatedAt: '2024-11-30T15:00:00.000Z'
  },
  {
    id: 'proj-onboarding-progressive-disclosure',
    title: 'Customer Onboarding Funnel Overhaul via Progressive Disclosure',
    tagline: 'Lowered new user cognitive overload by redesigning complex setup flows with progressive disclosure while preserving power-user keyboard shortcuts.',
    role: 'Product Designer & PM Lead',
    company: 'Cloud Data Workspace',
    domain: 'Enterprise SaaS',
    status: 'in_review',
    timeframe: 'Q4 2024 - Q2 2025',
    techStack: ['Figma', 'TypeScript', 'Tailwind CSS', 'PostHog', 'Segment'],
    metrics: [
      '+38% new user onboarding activation rate',
      '70% command palette adoption among veteran power users',
      '45% reduction in onboarding-related support tickets'
    ],
    sections: [
      {
        id: 'sec-onb-1',
        type: 'business_context',
        title: 'Business Context',
        order: 1,
        content: `Product telemetry revealed a **45% Day-1 drop-off rate** when new users encountered our initial configuration matrix. At the same time, power users complained that simple wizards slowed down their daily workflows.`
      },
      {
        id: 'sec-onb-2',
        type: 'decision',
        title: 'Solution & Progressive Disclosure Design',
        order: 2,
        content: `Redesigned onboarding using **Progressive Disclosure**:
- New users are guided through 3 lightweight, high-signal questions that configure 90% of their workspace automatically.
- Veteran power users gain instant access to a Command Palette (\`Cmd+K\`) for advanced multi-tenant configuration.`
      },
      {
        id: 'sec-onb-3',
        type: 'result',
        title: 'Measurable Outcomes',
        order: 3,
        content: `- Onboarding completion increased by **38%**.
- 70% of daily active power users adopted the Command Palette.
- Support ticket volume regarding setup dropped by **45%** in the first 60 days.`
      }
    ],
    workingNotes: `# Design Log
- Usability testing session with 8 analysts showed average time to first query decreased from 14 mins to 3.5 mins.`,
    evidenceNotes: `User interviews: 12 recorded sessions transcribed.`,
    linkedStoryIds: ['story-onboarding-progressive-disclosure'],
    linkedBlueprintIds: [],
    createdAt: '2024-10-01T14:00:00.000Z',
    updatedAt: '2025-03-01T18:00:00.000Z'
  }
];
