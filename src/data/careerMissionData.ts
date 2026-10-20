import { CareerMission } from '../types/careerMission';

export const INITIAL_CAREER_MISSIONS: CareerMission[] = [
  {
    id: 'mission-ai-pm-2026',
    title: 'Become an AI Product Manager',
    tagline: 'Lead generative AI product strategy and ship high-retention agentic workflows',
    targetRoleId: 'role-senior-pm',
    targetRoleTitle: 'Senior Product Manager',
    targetDomain: 'AI / Machine Learning & Enterprise SaaS',
    targetCompany: 'Leading AI Labs / Enterprise Tech',
    status: 'active',
    currentStage: 'practice',
    baselineReadiness: 62,
    currentReadiness: 76,
    targetReadiness: 92,
    missionHorizon: '90_days',
    targetCompletionDate: '2026-12-15',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-10-16T12:00:00Z',
    evidenceIds: ['ev-saas-activation-proto', 'ev-case-study-llm-eval'],
    completedBuildIds: ['build-opp-acme-cloud'],
    capabilityGaps: [
      {
        id: 'gap-ai-eval',
        capability: 'AI Model Evaluation & System Quality Benchmarking',
        category: 'technical',
        currentLevel: 2,
        targetLevel: 5,
        gapSeverity: 'high',
        rationale: 'Modern AI PMs need deterministic evaluation metrics (hallucination rate, latency p99, cost per query) beyond vague qualitative reviews.',
        recommendedAction: 'Study the Agentic Evaluation Framework in Knowledge System and complete an LLM benchmark case.',
        linkedResource: {
          type: 'knowledge',
          id: 'ku-agentic-evaluation',
          label: 'Knowledge Unit · Agentic Evaluation Metrics'
        },
        status: 'in_progress'
      },
      {
        id: 'gap-rbac-arch',
        capability: 'Enterprise Multi-tenant Authorization & Permission Staging',
        category: 'execution',
        currentLevel: 3,
        targetLevel: 5,
        gapSeverity: 'medium',
        rationale: 'B2B enterprise adoption stalls unless products can handle hierarchical workspaces and SOC2 compliance out of the box.',
        recommendedAction: 'Collaborate on the Acme Cloud Permission Staging Challenge in Builder Match.',
        linkedResource: {
          type: 'builder',
          id: 'build-opp-acme-cloud',
          label: 'Builder Match · Acme Cloud Onboarding Challenge'
        },
        status: 'in_progress'
      },
      {
        id: 'gap-exec-story',
        capability: 'Executive Business Case & Financial Diligence',
        category: 'strategy',
        currentLevel: 3,
        targetLevel: 5,
        gapSeverity: 'medium',
        rationale: 'Product executives require rigorous NPV, payback periods, and unit economics calculations before funding new platforms.',
        recommendedAction: 'Run live case simulation on SaaS Unit Economics & Pricing Migration.',
        linkedResource: {
          type: 'practice',
          id: 'case-saas-pricing',
          label: 'Live Practice · SaaS Pricing Strategy Simulation'
        },
        status: 'identified'
      },
      {
        id: 'gap-prompt-eng',
        capability: 'Context Window Optimization & Prompt Routing',
        category: 'technical',
        currentLevel: 3,
        targetLevel: 4,
        gapSeverity: 'low',
        rationale: 'Understanding model context limits and structured JSON output guarantees prevents production API failures.',
        recommendedAction: 'Review Structured Output Guarantees blueprint in Answer Blueprints.',
        linkedResource: {
          type: 'blueprint',
          id: 'bp-structured-outputs',
          label: 'Answer Blueprint · Production LLM Architecture'
        },
        status: 'closed'
      }
    ],
    steps: [
      {
        id: 'step-1-diagnose',
        stage: 'diagnose',
        title: 'Complete Baseline Career Gap Diagnostic',
        description: 'Benchmark current resume and verified capabilities against Senior AI Product Manager blueprint criteria.',
        actionType: 'knowledge_read',
        targetTab: 'profile',
        readinessImpact: 5,
        estimatedMinutes: 15,
        status: 'completed',
        completedAt: '2026-09-02T10:30:00Z',
        actionCtaLabel: 'View Diagnostic Report',
        contextHint: 'Diagnostic mapped 4 key capability gaps preventing top-decile readiness.'
      },
      {
        id: 'step-2-learn',
        stage: 'learn',
        title: 'Master Agentic Evaluation & System Quality Metrics',
        description: 'Read the comprehensive framework on LLM evaluation pipelines, ground truth datasets, and latency budgets.',
        actionType: 'knowledge_read',
        targetTab: 'knowledge',
        targetEntityId: 'ku-agentic-eval',
        targetEntityName: 'Agentic Evaluation Framework',
        readinessImpact: 6,
        estimatedMinutes: 25,
        status: 'completed',
        completedAt: '2026-09-15T14:20:00Z',
        actionCtaLabel: 'Review Knowledge Unit',
        contextHint: 'Covers MECE evaluation metrics, p95 latency thresholds, and cost modeling.'
      },
      {
        id: 'step-3-practice',
        stage: 'practice',
        title: 'Practice: "LLM Latency vs Accuracy Cost Tradeoff" Drill',
        description: 'Conduct a timed interview scenario defending trade-offs between quantized local models and frontier LLM APIs.',
        actionType: 'practice_drill',
        targetTab: 'practice',
        targetEntityName: 'GenAI Trade-off Scenario',
        readinessImpact: 8,
        estimatedMinutes: 30,
        status: 'in_progress',
        actionCtaLabel: 'Start Practice Drill',
        contextHint: 'Recommended next best action to calibrate strategic communication under scrutiny.'
      },
      {
        id: 'step-4-feedback',
        stage: 'feedback',
        title: 'Calibrate with Benchmark Answer Blueprint',
        description: 'Compare practice output with top-tier FAANG/Stripe PM response rubrics and synthesize follow-up learnings.',
        actionType: 'feedback_review',
        targetTab: 'knowledge',
        targetEntityName: 'Product Strategy Rubric L6',
        readinessImpact: 4,
        estimatedMinutes: 20,
        status: 'pending',
        actionCtaLabel: 'Inspect Benchmark Blueprint',
        contextHint: 'Examines framing, counter-arguments, and risk mitigation criteria.'
      },
      {
        id: 'step-5-build',
        stage: 'build',
        title: 'Build Prototype: Acme Cloud Onboarding & Permission Staging',
        description: 'Join the Builder Match challenge to design a working solution that recovers trial-to-active conversion from 19% back to 31%.',
        actionType: 'builder_challenge',
        targetTab: 'builder_match',
        targetEntityId: 'build-opp-acme-cloud',
        targetEntityName: 'Acme Cloud Activation Challenge',
        readinessImpact: 9,
        estimatedMinutes: 120,
        status: 'pending',
        actionCtaLabel: 'Open Builder Match Challenge',
        contextHint: 'Generates real evidence and working prototypes to showcase in portfolio.'
      },
      {
        id: 'step-6-prove',
        stage: 'prove',
        title: 'Convert Solution into Verified Career Evidence',
        description: 'Log metrics ledger entries showing measurable impact (+12% conversion lift hypothesis) and add to profile story bank.',
        actionType: 'evidence_document',
        targetTab: 'profile',
        readinessImpact: 6,
        estimatedMinutes: 25,
        status: 'pending',
        actionCtaLabel: 'Log Metrics & Evidence',
        contextHint: 'Translates raw project outcomes into verified career signals.'
      },
      {
        id: 'step-7-opportunity',
        stage: 'opportunity',
        title: 'Target Top-Tier AI PM Roles & Pitch Program Grants',
        description: 'Apply to matched senior positions and pitch for ecosystem venture grants with completed evidence portfolio.',
        actionType: 'opportunity_apply',
        targetTab: 'discover',
        targetEntityName: 'Senior AI Product Manager at Stripe',
        readinessImpact: 4,
        estimatedMinutes: 45,
        status: 'pending',
        actionCtaLabel: 'Explore Matched Roles & Grants',
        contextHint: 'You will enter interviews with completed builds, validated metrics, and proven blueprints.'
      }
    ],
    nextBestActionId: 'step-3-practice'
  },
  {
    id: 'mission-distributed-architect',
    title: 'Staff Distributed Systems Architect',
    tagline: 'Architect resilient multi-region transaction ledgers with sub-50ms latency',
    targetRoleId: 'role-tech-lead',
    targetRoleTitle: 'Full Stack Tech Lead / Systems Architect',
    targetDomain: 'Fintech, High-Frequency Ledgers & Cloud Infrastructure',
    targetCompany: 'Global Fintech & Infrastructure Pioneers',
    status: 'paused',
    currentStage: 'learn',
    baselineReadiness: 55,
    currentReadiness: 68,
    targetReadiness: 90,
    missionHorizon: '60_days',
    targetCompletionDate: '2026-11-30',
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-10-10T16:00:00Z',
    evidenceIds: [],
    completedBuildIds: [],
    capabilityGaps: [
      {
        id: 'gap-consensus',
        capability: 'Raft / Paxos Consensus Protocol Tuning & Failover',
        category: 'technical',
        currentLevel: 3,
        targetLevel: 5,
        gapSeverity: 'high',
        rationale: 'Zero-downtime ledger migration requires deep understanding of partition tolerance and quorum guarantees.',
        recommendedAction: 'Study the Distributed Consistency Patterns in Knowledge Library.',
        status: 'in_progress'
      },
      {
        id: 'gap-capacity',
        capability: 'P99 Latency Tuning & Kernel Memory Profiling',
        category: 'technical',
        currentLevel: 3,
        targetLevel: 5,
        gapSeverity: 'medium',
        rationale: 'Must eliminate GC pauses and optimize Linux socket buffer allocations for 100k TPS.',
        recommendedAction: 'Review Linux Performance Tuning guide and complete simulation.',
        status: 'identified'
      }
    ],
    steps: [
      {
        id: 'step-dist-1',
        stage: 'diagnose',
        title: 'Run Architectural Readiness Assessment',
        description: 'Assess distributed systems competency matrix against Tier-1 infrastructure expectations.',
        actionType: 'knowledge_read',
        targetTab: 'profile',
        readinessImpact: 5,
        status: 'completed',
        completedAt: '2026-08-16T11:00:00Z',
        actionCtaLabel: 'View Diagnostic'
      },
      {
        id: 'step-dist-2',
        stage: 'learn',
        title: 'Deep Dive: Consensus & Distributed Consistency Models',
        description: 'Review Raft leader election, log replication, and Jepsen verification cases in the Knowledge System.',
        actionType: 'knowledge_read',
        targetTab: 'knowledge',
        readinessImpact: 7,
        status: 'in_progress',
        actionCtaLabel: 'Open Knowledge System'
      },
      {
        id: 'step-dist-3',
        stage: 'practice',
        title: 'Live System Design: 100k TPS Distributed Payment Switch',
        description: 'Simulate technical architecture presentation addressing split-brain and reconciliation guarantees.',
        actionType: 'live_simulation',
        targetTab: 'practice',
        readinessImpact: 9,
        status: 'pending',
        actionCtaLabel: 'Start Architectural Simulation'
      },
      {
        id: 'step-dist-4',
        stage: 'build',
        title: 'Build: Local-First Conflict-Free Data Core',
        description: 'Prototype hybrid logical clock sync in the Builder Match collaborative workspace.',
        actionType: 'builder_challenge',
        targetTab: 'builder_match',
        readinessImpact: 10,
        status: 'pending',
        actionCtaLabel: 'Collaborate on Build'
      }
    ],
    nextBestActionId: 'step-dist-2'
  }
];
