import { TimedAssignment } from '../types';

export const TIMED_ASSIGNMENTS_DATA: TimedAssignment[] = [
  {
    id: 'assign-behavioral-conflict',
    title: 'Disagreement on Technical Architecture',
    type: 'Behavioral',
    timeLimitSeconds: 120, // 2 minutes
    prompt: 'Tell me about a time you strongly disagreed with a peer or technical lead on an engineering decision. How did you handle the situation and what was the outcome?',
    context: 'Assesses cross-functional collaboration, data-driven persuasion, executive composure, and focus on team outcomes over ego.',
    dimensionsTested: ['Conflict Resolution', 'Data-driven Decision Making', 'Humility & Ownership', 'Impact & Metrics'],
    framework: 'STAR-T (Situation, Task, Action, Trade-off, Result)',
    hints: [
      'Focus on objective data or experiments rather than opinion clashes.',
      'Briefly explain the trade-off you had to accept or evaluate.',
      'Quantify the final impact (latency, cost, or reliability).'
    ],
    sampleStrongAnswer: 'At my previous company, our lead proposed moving our session cache to a distributed graph database. I had concerns about read latency and operational overhead. Rather than arguing conceptually, I built a 2-day synthetic load test benchmark comparing Postgres-Redis against the graph cluster under 10,000 concurrent writes. The benchmark showed Redis delivered 14ms p99 vs 180ms on the graph node. We aligned on Redis, saving $4,000/month in licenses with zero downtime on Black Friday.'
  },
  {
    id: 'assign-system-design-payments',
    title: 'High-Throughput Payment Idempotency Engine',
    type: 'System Design',
    timeLimitSeconds: 480, // 8 minutes
    prompt: 'Design an idempotent payment processing gateway that handles 5,000 requests/sec with strict at-most-once guarantees, network retry resilience, and zero duplicate charges.',
    context: 'Evaluates distributed transactions, idempotency key generation, cache layers, distributed locking, and database consistency.',
    dimensionsTested: ['Distributed Consistency', 'Failure Mode Handling', 'Data Modeling', 'Latency Budgeting'],
    framework: 'C4 System Design (Requirements, API Contract, Data Flow, Failure Modes, Scaling)',
    hints: [
      'Establish client-generated idempotency keys (UUIDv4) with TTLs.',
      'Use atomic Redis locks (SET NX) with lease renewal or Postgres serializable writes.',
      'Define clear state transitions: PENDING -> EXECUTING -> SUCCEEDED / FAILED.'
    ],
    sampleStrongAnswer: 'The system uses an API Gateway that checks a distributed Redis cache for the Idempotency-Key. If present and completed, cached payload returns immediately (85ms). If in-flight, returns HTTP 409 with Retry-After. If new, acquires an atomic lock with 30s TTL, writes PENDING record to Postgres partitioned ledger with unique constraint, emits event to transactional outbox, triggers payment provider via circuit breaker, and updates state atomically.'
  },
  {
    id: 'assign-product-case-onboarding',
    title: 'Product Scenario: Drop-off at Enterprise Checkout',
    type: 'Product Case',
    timeLimitSeconds: 300, // 5 minutes
    prompt: 'Telemetry shows a 34% drop-off between tier selection and contract confirmation for self-serve enterprise customers. How do you diagnose root causes and propose a 3-week mitigation plan?',
    context: 'Tests product analytics hygiene, hypothesis formation, user interview triangulation, and phased execution.',
    dimensionsTested: ['Metric Decomposition', 'User Psychology', 'Hypothesis Testing', 'Prioritization'],
    framework: 'CIRCLES / Problem Decomposition (Diagnose, Hypothesize, Validate, Execute)',
    hints: [
      'Segment the drop-off by browser, company size, and payment method.',
      'Identify whether the friction is informational (hidden fees) or technical (auth/billing).',
      'Propose a quick-win painted door / A/B test alongside qualitative customer calls.'
    ],
    sampleStrongAnswer: 'First, I segment funnel drop-offs by device, seat count, and geo to isolate anomalies. Second, I audit session replays and interview 5 dropped users to uncover whether hesitation stems from legal procurement hurdles or pricing sticker shock. For mitigation, Week 1: add upfront billing breakdowns and live procurement FAQ. Week 2: introduce a 14-day delayed invoice option for 50+ seat tiers. Week 3: measure cohort conversion lift against a guardrail churn threshold.'
  },
  {
    id: 'assign-tech-arch-zero-downtime',
    title: 'Zero-Downtime Data Migration Architecture',
    type: 'Technical Architecture',
    timeLimitSeconds: 360, // 6 minutes
    prompt: 'Outline a technical architecture to migrate 20 million active user records from a legacy single-node database to a sharded modern datastore with zero downtime and roll-back safety.',
    context: 'Assesses dual-write paradigms, Change Data Capture (CDC), data verification heuristics, and cutover protocols.',
    dimensionsTested: ['Data Pipeline Reliability', 'Dual-write vs CDC', 'Rollback Strategy', 'Data Consistency Audit'],
    framework: 'Expand & Contract Pattern (Phase 1: Dual Write, Phase 2: Backfill, Phase 3: Verification, Phase 4: Cutover)',
    hints: [
      'Address how you prevent write skew during the historical backfill.',
      'Explain automated parity reconciliation before cutover.',
      'Define automated rollback criteria if error rates exceed 0.01%.'
    ],
    sampleStrongAnswer: 'I implement the Expand and Contract pattern: Step 1: Deploy application dual-writes with async queueing to the new datastore while reading from primary. Step 2: Run an idempotent backfill script using Debezium CDC for historical rows. Step 3: Run continuous background checksum verification to ensure 99.999% parity. Step 4: Flip read traffic via feature flag with immediate automated rollback if p99 latency spikes above 50ms.'
  },
  {
    id: 'assign-biz-english-executive',
    title: 'Executive Communication: Project Delay & Scope Re-alignment',
    type: 'Communication',
    timeLimitSeconds: 180, // 3 minutes
    prompt: 'Deliver a concise, 90-second spoken/written executive briefing to your VP of Engineering explaining that a key compliance milestone will be delayed by two weeks, with proposed mitigation.',
    context: 'Evaluates executive presence, BLUF (Bottom Line Up Front), accountability, and action-oriented framing.',
    dimensionsTested: ['BLUF Structure', 'Accountability & Tone', 'Resource Trade-offs', 'Next Steps'],
    framework: 'Minto Pyramid / BLUF (Headline, Context & Impact, Corrective Action, Decision Request)',
    hints: [
      'Start with the headline delay immediately—do not bury the lead.',
      'State the precise risk (e.g., SOC2 audit timeline) and the root blocker.',
      'Present two concrete options and your firm recommendation.'
    ],
    sampleStrongAnswer: 'Bottom line up front: Our SOC2 automated audit logging milestone will slip by 10 business days to October 24 due to an unexpected schema mismatch with our legacy auth service. Customer data remains fully secure. To protect our Q4 sales commitments, we have redirected two senior platform engineers from our internal tooling sprint to patch the endpoint. I recommend maintaining this sprint focus rather than cutting scope, which keeps us fully compliant before the auditors arrive.'
  },
  {
    id: 'assign-situational-stakeholder',
    title: 'Handling Conflicting C-Level Priorities',
    type: 'Situational / Stakeholder',
    timeLimitSeconds: 180, // 3 minutes
    prompt: 'The Chief Revenue Officer requests an urgent custom enterprise feature for a $200k contract, while the CTO insists on freezing feature development for infrastructure hardening. How do you resolve this impasse?',
    context: 'Assesses commercial acumen vs engineering resilience, objective criteria creation, and leadership mediation.',
    dimensionsTested: ['Business Judgment', 'Technical Integrity', 'Objective Scoring', 'Stakeholder Alignment'],
    framework: 'Impact vs Risk Matrix & Phased Delivery',
    hints: [
      'Avoid picking one executive over the other.',
      'Quantify the Cost of Delay on both sides (revenue loss vs outage risk).',
      'Look for modular compromises (e.g. feature branch or contract SLA concessions).'
    ],
    sampleStrongAnswer: 'I gather both leaders with an objective impact ledger. Rather than taking sides, I quantify the trade-offs: the $200k ARR opportunity versus the cost of delay on platform stability. I evaluate if a lightweight Phase 1 of the custom feature can be scoped into 4 developer days using existing abstractions, while isolating the risky database migrations until week 4. By establishing a shared definition of success, both commercial goals and platform guardrails are preserved.'
  }
];
