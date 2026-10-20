import { ExpertProfile, FeedbackRequest } from '../types/expertFeedback';

export const INITIAL_EXPERTS: ExpertProfile[] = [
  {
    id: 'expert-sarah-chen',
    name: 'Sarah Chen',
    handle: '@sarahchen_pm',
    role: 'Senior Product Leader · B2B SaaS & Growth',
    company: 'ex-Stripe, ex-Datadog',
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    modes: ['reviewer', 'practitioner', 'mentor', 'advisor'],
    matchScore: 92,
    skills: [
      'Product Strategy',
      'Growth & Monetization',
      'B2B SaaS',
      'Activation Loops',
      'Executive Storytelling'
    ],
    domains: ['Enterprise SaaS', 'FinTech', 'Developer Platforms'],
    experienceYears: 11,
    pastCompanies: ['Stripe', 'Datadog', 'Dropbox'],
    evidenceHighlights: [
      'Led Stripe Billing self-serve activation redesign resulting in +14% trial conversion lift',
      'Engineered Datadog Log Pipeline RBAC authorization models for Fortune 500 tenants'
    ],
    whyRecommended: 'Has led activation and retention initiatives for B2B SaaS products similar to your target challenges. Ranked top reviewer for strategic trade-offs.',
    feedbackFormats: ['async', 'session_30', 'session_60'],
    availabilityNote: 'Usually reviews async submissions within 24h · 2 session slots this week',
    verifiedValidationCount: 47
  },
  {
    id: 'expert-marcus-vance',
    name: 'Marcus Vance',
    handle: '@marcus_arch',
    role: 'Principal Distributed Systems Architect',
    company: 'ex-AWS Infrastructure, ex-Twilio',
    location: 'Seattle, WA',
    timezone: 'PST (UTC-8)',
    modes: ['practitioner', 'reviewer', 'specialist', 'builder'],
    matchScore: 95,
    skills: [
      'Distributed Systems',
      'Raft / Paxos Consensus',
      'P99 Latency Tuning',
      'Idempotent Ledgers',
      'High-Throughput Kafka'
    ],
    domains: ['Cloud Infrastructure', 'Fintech Ledgers', 'High-Frequency Streaming'],
    experienceYears: 14,
    pastCompanies: ['Amazon Web Services', 'Twilio', 'Microsoft'],
    evidenceHighlights: [
      'Architected AWS DynamoDB global tables failover replication',
      'Published seminal industry whitepaper on zero-downtime distributed cutovers'
    ],
    whyRecommended: 'Deep practitioner expertise in consensus protocols, partition tolerance, and high-frequency financial ledgers under production fire.',
    feedbackFormats: ['async', 'session_30'],
    availabilityNote: 'Async reviews within 36h · 1 session slot available on Friday',
    verifiedValidationCount: 63
  },
  {
    id: 'expert-elena-rostova',
    name: 'Elena Rostova',
    handle: '@elena_ai',
    role: 'Staff AI Research Engineer & Systems Lead',
    company: 'ex-OpenAI Applied, ex-Scale AI',
    location: 'New York, NY',
    timezone: 'EST (UTC-5)',
    modes: ['specialist', 'coach', 'builder', 'reviewer'],
    matchScore: 94,
    skills: [
      'LLM System Metrics',
      'Agentic Evaluation',
      'Quantization Tradeoffs',
      'Latency Budgets',
      'Context Routing'
    ],
    domains: ['Artificial Intelligence', 'Developer Tooling', 'Enterprise AI'],
    experienceYears: 8,
    pastCompanies: ['OpenAI', 'Scale AI', 'Google Research'],
    evidenceHighlights: [
      'Designed automated agent evaluation harnesses adopted by 80+ engineering teams',
      'Published latency vs accuracy Pareto frontiers for local SLM deployments'
    ],
    whyRecommended: 'Pioneered deterministic evaluation metrics for non-deterministic LLM pipelines with strict p95 latency and cost budgets.',
    feedbackFormats: ['async', 'session_30', 'session_60'],
    availabilityNote: 'Active daily · Quick async turnaround on AI architecture PRDs',
    verifiedValidationCount: 51
  },
  {
    id: 'expert-david-kalu',
    name: 'David Kalu',
    handle: '@davidkalu',
    role: 'Head of Growth & Monetization',
    company: 'ex-Figma, ex-Ramp',
    location: 'London, UK',
    timezone: 'GMT (UTC+0)',
    modes: ['advisor', 'practitioner', 'mentor', 'coach'],
    matchScore: 89,
    skills: [
      'Product-Led Growth',
      'SaaS Unit Economics',
      'Pricing Tier Migration',
      'A/B Experimentation',
      'Executive Diligence'
    ],
    domains: ['Product-Led SaaS', 'Fintech', 'Design Systems'],
    experienceYears: 10,
    pastCompanies: ['Figma', 'Ramp', 'TransferWise'],
    evidenceHighlights: [
      'Led Figma Team tier self-serve expansion model and international monetization',
      'Spearheaded Ramp invoice financing PLG loops and payback period optimizations'
    ],
    whyRecommended: 'Specializes in stress-testing enterprise pricing transitions and financial diligence models under board and investor scrutiny.',
    feedbackFormats: ['async', 'session_30'],
    availabilityNote: 'Async within 24h · European & US morning friendly timezones',
    verifiedValidationCount: 38
  },
  {
    id: 'expert-maya-lin',
    name: 'Maya Lin',
    handle: '@mayalin_design',
    role: 'Design Director & Experience Architect',
    company: 'ex-Airbnb, ex-Linear',
    location: 'Austin, TX',
    timezone: 'CST (UTC-6)',
    modes: ['builder', 'reviewer', 'coach', 'practitioner'],
    matchScore: 88,
    skills: [
      'Design Systems',
      'Ergonomic UX',
      'Complex Workflows',
      'Information Architecture',
      'Usability Audits'
    ],
    domains: ['Enterprise UX', 'Collaboration Software', 'Developer UX'],
    experienceYears: 12,
    pastCompanies: ['Airbnb', 'Linear', 'IDEO'],
    evidenceHighlights: [
      'Architected keyboard-first ergonomic command system at Linear',
      'Redesigned global host verification workflow for Airbnb'
    ],
    whyRecommended: 'Exceptional track record simplifying high-density workflow interfaces and multi-workspace access control models.',
    feedbackFormats: ['async', 'session_30', 'session_60'],
    availabilityNote: '3 review slots this week · Async responses within 48h',
    verifiedValidationCount: 42
  }
];

export const INITIAL_FEEDBACK_REQUESTS: FeedbackRequest[] = [
  {
    id: 'req-spm-strategy-growth',
    userId: 'current-user',
    helpType: 'review_work',
    context: {
      careerGoal: 'Become a Senior Product Manager',
      targetRole: 'Senior Product Manager',
      roleBlueprintId: 'role-senior-pm',
      relevantCapability: 'Product Strategy & Strategic Trade-offs',
      workSubmittedTitle: 'Product Growth Case: Acme Cloud Trial-to-Active Onboarding',
      workSubmittedContent: `We observed that trial-to-active workspace completion dropped from 31% to 19% following the release of multi-workspace enterprise permission gates.

My proposed intervention:
1. Introduce a "Progressive Permission Staging" sandbox where trial teams can explore core collaborative features without requiring immediate SOC2 IT Admin approval.
2. Provide a 1-click "Staging to Production" governance export report that compliance officers can audit in under 2 minutes.
3. Establish metric checkpoints: Day-3 collaborative invite rate, Day-7 active workspace threshold, and Day-14 conversion contract signed.`,
      sourceType: 'practice',
      readinessScore: 76,
      knownSkillGaps: [
        'AI Model Evaluation & System Quality Benchmarking',
        'Executive Strategic Trade-offs & Deliberate Scope Elimination'
      ]
    },
    selectedFocusAreas: ['strategy', 'product_thinking', 'business_impact', 'prioritization'],
    feedbackFormat: 'session_30',
    expertId: 'expert-sarah-chen',
    expertName: 'Sarah Chen',
    status: 'feedback_delivered',
    submittedAt: '2026-10-15T10:00:00Z',
    deadline: '2026-10-16T18:00:00Z',
    privacyShared: {
      practiceResponse: true,
      careerGoal: true,
      targetRole: true,
      relevantCapability: true,
      fullCareerProfile: false,
      otherCareerEvidence: false,
      currentApplications: false
    },
    aiReview: {
      strengths: [
        'Strong problem framing and clear identification of enterprise permission friction',
        'Good metric progression from Day-3 invites to Day-14 signed contracts'
      ],
      gaps: [
        'Weak strategic trade-off analysis: does not state what will be deliberately NOT built',
        'Compliance risk mitigation is assumed rather than defended with concrete boundary conditions'
      ],
      recommendedImprovement: 'Explicitly define scope elimination: explain what enterprise integrations you will reject in v1 to protect shipping velocity.',
      capabilityAssessment: {
        capability: 'Product Strategy',
        score: 71
      },
      recommendationNote: 'Human feedback from an experienced B2B practitioner would add significant value here because enterprise procurement involves nuanced political and security trade-offs.',
      shouldSeekHumanExpert: true,
      humanExpertRationale: 'B2B enterprise activation requires real-world practitioner calibration.'
    },
    expertFeedback: {
      expertId: 'expert-sarah-chen',
      expertName: 'Sarah Chen',
      overallAssessment: 'Strong foundation with sharp execution instincts. The sandbox staging hypothesis directly addresses the root friction.',
      whatWorked: [
        'Progressive Permission Staging is the exact right architectural framing for enterprise trial friction',
        'The 2-minute compliance audit export anticipates the primary blocker in IT procurement'
      ],
      whatCouldImprove: [
        'You have not made a difficult strategic trade-off. At Senior PM level, you must declare what you are explicitly choosing NOT to build',
        'In v1, engineering teams usually get bogged down building custom SAML/SCIM connectors. You must explicitly decline custom connectors until post-trial conversion'
      ],
      expertRecommendation: 'Explicitly decline custom IdP/SCIM provisioning in v1. Support only standard Google/GitHub OAuth and standard OIDC. This protects your 3-week shipping velocity and proves activation first.',
      suggestedNextStep: 'find_build',
      scoreBefore: 76,
      scoreAfter: 81,
      deliveredAt: '2026-10-15T15:30:00Z',
      verifiedValidationBadge: true,
      recommendedResources: [
        {
          id: 'res-wardley-mapping',
          title: 'Wardley Mapping for B2B Enterprise Feature Staging',
          type: 'Knowledge System · Strategic Framework'
        },
        {
          id: 'res-b2b-activation',
          title: 'Stripe Billing Self-Serve Activation Architecture',
          type: 'Case Study · Proven Blueprints'
        }
      ]
    },
    iterations: [
      {
        iterationNumber: 1,
        submittedAnswer: 'Initial proposal with sandbox staging without explicit scope elimination.',
        score: 76,
        date: '2026-10-15T10:00:00Z',
        deltaSummary: 'Baseline answer'
      },
      {
        iterationNumber: 2,
        submittedAnswer: 'Updated proposal explicitly rejecting custom SCIM bridges in v1, mandating OIDC-only, and redirecting 40% engineering capacity to automated audit report generation.',
        score: 81,
        date: '2026-10-16T09:00:00Z',
        deltaSummary: '+5% lift · Senior-level strategic trade-off validated by Sarah Chen'
      }
    ],
    followUpMessages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'You',
        content: 'Sarah, thank you! If enterprise buyers push back on the lack of Okta SCIM sync during trial, how would you coach the sales engineering team?',
        timestamp: '2026-10-15T16:15:00Z'
      },
      {
        id: 'msg-2',
        sender: 'expert',
        senderName: 'Sarah Chen',
        content: 'Tell sales engineers to position sandbox staging as "Risk-Free Pilot Mode". SCIM is only necessary when provisioning hundreds of paid seats. Emphasize that pilot data seamlessly ports over once the enterprise MSA is executed.',
        timestamp: '2026-10-15T16:45:00Z'
      }
    ]
  }
];
