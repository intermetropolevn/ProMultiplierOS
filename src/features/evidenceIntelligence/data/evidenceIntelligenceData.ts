import { 
  EvidenceItem, 
  WorkInitiative, 
  CapabilityDefinition, 
  EvidenceSourceConnector, 
  EvidenceGraphData,
  RoleReadinessEvidenceCheck
} from '../types';

export const SEED_WORK_INITIATIVES: WorkInitiative[] = [
  {
    id: 'init-onboarding-revamp',
    title: 'Self-Serve Onboarding Revamp & Activation Loop',
    status: 'Shipped',
    timeframe: 'Q2 - Q3 2026',
    objective: 'Transform multi-step friction-heavy signup and workspace setup into an interactive, role-customized self-serve activation flow.',
    userRole: 'Product Lead',
    responsibilities: [
      'Authored 3-part opportunity solution tree and comprehensive PRD',
      'Orchestrated 4 A/B variant experiments measuring time-to-first-value (TTFV)',
      'Led weekly cross-functional synchronization between Design, Engineering, and Growth Marketing',
      'Synthesized user interview insights from 18 session recordings into friction heatmaps'
    ],
    activityCounts: {
      tasks: 14,
      documents: 3,
      meetings: 7,
      experiments: 4,
      decisions: 5,
      deliverables: 3,
      notes: 18
    },
    activities: [
      { id: 'act-1', source: 'Jira', title: 'Ticket PROD-1402: Implement lightweight workspace wizard', type: 'task', timestamp: '2026-08-12', authorOrParticipant: 'User (Assignee: Eng)', summary: 'Closed sprint task for wizard UI' },
      { id: 'act-2', source: 'Notion', title: 'PRD: Onboarding Self-Serve Flow v2.2', type: 'document', timestamp: '2026-07-28', authorOrParticipant: 'User (Author)', summary: 'Comprehensive feature specifications and acceptance metrics' },
      { id: 'act-3', source: 'Google Calendar / Meetings', title: 'Cross-functional Launch Readiness & Guardrails Sync', type: 'meeting', timestamp: '2026-09-04', authorOrParticipant: 'User + 6 Attendees', summary: 'Aligned security, marketing, and infra on 20% canary deployment' },
      { id: 'act-4', source: 'Analytics / Amplitude', title: 'Experiment EXP-401: 3-step vs 5-step funnel', type: 'experiment', timestamp: '2026-08-20', authorOrParticipant: 'User (Lead Analyst)', summary: 'Statistical significance reached at p<0.01' },
      { id: 'act-5', source: 'Research Notes', title: '18 User Friction Session Teardowns', type: 'research_note', timestamp: '2026-07-15', authorOrParticipant: 'User', summary: 'Identified password complexity and team invite drop-off points' }
    ],
    artifacts: [
      { id: 'art-1', title: 'Onboarding System PRD v2.2', type: 'PRD', dateCreated: '2026-07-28', sizeOrScope: '14 pages + 6 user flows' },
      { id: 'art-2', title: 'Figma Onboarding Prototype & Design Tokens', type: 'Figma Prototype', dateCreated: '2026-08-02', sizeOrScope: 'Interactive wireframes' },
      { id: 'art-3', title: 'Activation Funnel Metric SQL Query & Telemetry Spec', type: 'SQL Query', dateCreated: '2026-08-10', sizeOrScope: 'dbt model + Amplitude schema' }
    ],
    decisions: [
      { id: 'dec-1', title: 'Decommission legacy 7-field company questionnaire upfront', date: '2026-08-04', rationale: 'Account enrichment API eliminates manual data entry, reducing bounce by 19%', alternativesConsidered: 'Keeping questions as optional collapsed accordion' },
      { id: 'dec-2', title: 'Adopt progressive workspace provisioning instead of blocking loading spinners', date: '2026-08-18', rationale: 'Immediate access creates psychological ownership before background database indexing completes', alternativesConsidered: 'Showing 15-second progress bar animation' }
    ],
    experiments: [
      { id: 'exp-1', hypothesis: 'Pre-populating recommended project templates based on selected role increases Day-1 task creation by 25%', variantChosen: 'Variant B: Role-targeted template gallery', metricObserved: '+34% template deployments', result: 'Success' },
      { id: 'exp-2', hypothesis: 'Deferring credit card requirement until Day 14 trial expiration increases signup volume with negligible trial degradation', variantChosen: 'Variant A: Cardless trial', metricObserved: '+42% signups, conversion to paid rose 1.8%', result: 'Success' }
    ],
    outcomes: [
      { id: 'out-1', metricName: 'User Activation Velocity (TTFV)', quantitativeLift: '-68% Time-to-First-Value', baseline: '44 minutes', result: '14 minutes', timeframe: '30-day post-launch cohort', verified: true },
      { id: 'out-2', metricName: 'Free-to-Paid Trial Conversion', quantitativeLift: '+31% Trial Conversion Rate', baseline: '3.2%', result: '4.2%', timeframe: 'Q3 2026', verified: true }
    ],
    evidenceGeneratedIds: ['ev-onboarding-strategy', 'ev-onboarding-experimentation'],
    capabilitiesDemonstrated: ['cap-product-strategy', 'cap-experimentation', 'cap-stakeholder-mgmt', 'cap-product-analytics', 'cap-cross-functional-coord'],
    sourceDistribution: [
      { source: 'Jira', count: 14, details: 'Sprint task deliverables' },
      { source: 'Notion', count: 3, details: 'PRDs & Strategy briefs' },
      { source: 'Google Calendar / Meetings', count: 7, details: 'Working sessions & GTM alignment' },
      { source: 'Research Notes', count: 18, details: 'User session recordings & observations' },
      { source: 'Analytics / Amplitude', count: 4, details: 'Controlled A/B testing cohorts' },
      { source: 'Manual Reflection', count: 1, details: 'Post-mortem retrospection' }
    ]
  },
  {
    id: 'init-data-contracts',
    title: 'Enterprise Data Contracts & Event Schema Registry',
    status: 'Shipped',
    timeframe: 'Q1 - Q2 2026',
    objective: 'Establish enforceable schema contracts and automated CI/CD validation between producer squads and the centralized analytical data warehouse.',
    userRole: 'Technical Platform PM',
    responsibilities: [
      'Authored schema governance RFC and data contract specification standard',
      'Partnered with Staff Engineers to integrate JSON Schema validation into Git pre-commit hooks',
      'Negotiated backward-compatibility deprecation windows across 6 microservice engineering squads'
    ],
    activityCounts: {
      tasks: 19,
      documents: 5,
      meetings: 9,
      experiments: 2,
      decisions: 4,
      deliverables: 4,
      notes: 12
    },
    activities: [
      { id: 'act-dc-1', source: 'GitHub', title: 'Merged PR #382: JSONSchema contract linter workflow', type: 'deliverable', timestamp: '2026-04-12', authorOrParticipant: 'User (Co-author)', summary: 'CI validation pipeline for schema changes' },
      { id: 'act-dc-2', source: 'Notion', title: 'Data Contract Governance Framework RFC', type: 'document', timestamp: '2026-03-20', authorOrParticipant: 'User', summary: 'Organizational standard for schema evolution' }
    ],
    artifacts: [
      { id: 'art-dc-1', title: 'Enterprise Data Contract RFC', type: 'Architecture RFC', dateCreated: '2026-03-20', sizeOrScope: 'Company-wide architectural standard' },
      { id: 'art-dc-2', title: 'OpenLineage & dbt Contract Validation Suite', type: 'SQL Query', dateCreated: '2026-04-15', sizeOrScope: '65 automated schema tests' }
    ],
    decisions: [
      { id: 'dec-dc-1', title: 'Enforce strict semantic versioning on all Kafka topic events', date: '2026-04-02', rationale: 'Prevents silent downstream dashboard failures caused by renaming unverified fields', alternativesConsidered: 'Ad-hoc Slack notifications before deployment' }
    ],
    experiments: [
      { id: 'exp-dc-1', hypothesis: 'Automated contract linting in PR checks will reduce broken pipeline alerts by 50%', variantChosen: 'Mandatory CI blocking check', metricObserved: '-84% incident pager alerts', result: 'Success' }
    ],
    outcomes: [
      { id: 'out-dc-1', metricName: 'Data Pipeline Breakage Incidents', quantitativeLift: '-84% Schema Breakage Alerts', baseline: '12 / month', result: '1.8 / month', timeframe: 'Q2 2026', verified: true },
      { id: 'out-dc-2', metricName: 'Engineering Time Saved in Data Debugging', quantitativeLift: '140+ Eng Hours Saved / Mo', baseline: 'Manual root-cause triage', result: 'Automated CI catch', timeframe: 'H1 2026', verified: true }
    ],
    evidenceGeneratedIds: ['ev-data-contracts-arch', 'ev-tech-decision-making'],
    capabilitiesDemonstrated: ['cap-technical-understanding', 'cap-architecture', 'cap-system-thinking', 'cap-engineering-collab', 'cap-process-design'],
    sourceDistribution: [
      { source: 'GitHub', count: 19, details: 'Commits, schema specs & PR reviews' },
      { source: 'Notion', count: 5, details: 'Architecture RFCs & SLA contracts' },
      { source: 'Google Calendar / Meetings', count: 9, details: 'Architecture review boards' },
      { source: 'Analytics / Amplitude', count: 2, details: 'Telemetry schema tests' }
    ]
  },
  {
    id: 'init-pricing-expansion',
    title: 'Automated Pricing Tier & Expansion Monetization',
    status: 'Shipped',
    timeframe: 'Q4 2025 - Q1 2026',
    objective: 'Re-architect self-serve subscription packaging from flat seat pricing to hybrid seat + consumption usage tiers, unlocking net expansion revenue.',
    userRole: 'Product & Commercial Strategy Lead',
    responsibilities: [
      'Built financial simulation model evaluating churn risk across 4,200 existing customer accounts',
      'Designed in-app paywall triggers and proactive quota notification workflows',
      'Coordinated pricing transition messaging and grandfathering policies with Sales and CS'
    ],
    activityCounts: {
      tasks: 11,
      documents: 4,
      meetings: 6,
      experiments: 3,
      decisions: 3,
      deliverables: 2,
      notes: 14
    },
    activities: [
      { id: 'act-pr-1', source: 'Notion', title: 'Hybrid Usage Pricing Matrix & Sensitivity Model', type: 'document', timestamp: '2025-11-14', authorOrParticipant: 'User', summary: 'Financial sensitivity analysis across customer tiers' },
      { id: 'act-pr-2', source: 'Analytics / Amplitude', title: 'Quota Threshold Notification A/B Test', type: 'experiment', timestamp: '2026-01-20', authorOrParticipant: 'User', summary: 'Evaluated 80% vs 90% quota alert conversion' }
    ],
    artifacts: [
      { id: 'art-pr-1', title: 'Pricing & Packaging Strategic Memorandum', type: 'Presentation', dateCreated: '2025-11-20', sizeOrScope: 'Executive board presentation' },
      { id: 'art-pr-2', title: 'Usage Quota Paywall UI & Notification Specs', type: 'PRD', dateCreated: '2025-12-05', sizeOrScope: '8 in-app trigger scenarios' }
    ],
    decisions: [
      { id: 'dec-pr-1', title: 'Grandfather existing annual accounts for 12 months with fixed credit caps', date: '2025-12-10', rationale: 'Minimizes churn risk while giving customers time to adapt to consumption metrics', alternativesConsidered: 'Forced immediate migration upon renewal' }
    ],
    experiments: [
      { id: 'exp-pr-1', hypothesis: 'In-app usage warning at 80% threshold increases proactive card upgrades by 20%', variantChosen: 'Variant B: Proactive upgrade card with one-click credit top-up', metricObserved: '+38% self-serve top-ups', result: 'Success' }
    ],
    outcomes: [
      { id: 'out-pr-1', metricName: 'Net Revenue Retention (NRR)', quantitativeLift: '+14% Expansion ARR Lift ($1.8M)', baseline: '104% NRR', result: '118% NRR', timeframe: 'Annualized 2026', verified: true }
    ],
    evidenceGeneratedIds: ['ev-pricing-strategy', 'ev-commercial-thinking'],
    capabilitiesDemonstrated: ['cap-monetization', 'cap-business-acumen', 'cap-commercial-thinking', 'cap-product-strategy', 'cap-stakeholder-mgmt'],
    sourceDistribution: [
      { source: 'Notion', count: 4, details: 'Financial models & packaging decks' },
      { source: 'Jira', count: 11, details: 'Paywall and billing engineering tasks' },
      { source: 'Google Calendar / Meetings', count: 6, details: 'Executive P&L reviews' },
      { source: 'Analytics / Amplitude', count: 3, details: 'Conversion funnel experiments' }
    ]
  }
];

export const SEED_INBOX_ITEMS: EvidenceItem[] = [
  {
    id: 'inbox-1',
    title: 'Cross-Functional Onboarding & Growth Loop Overhaul',
    description: 'Led a cross-functional onboarding improvement initiative from discovery through experimentation, coordinating across 14 sprint tasks, 3 PRD specifications, 7 working meetings, and 4 multi-variant experiments.',
    source: 'Aggregated Work Sources',
    linkedInitiativeId: 'init-onboarding-revamp',
    linkedInitiativeTitle: 'Self-Serve Onboarding Revamp & Activation Loop',
    role: 'Product Lead',
    contributionType: 'Lead',
    capabilities: ['cap-product-strategy', 'cap-experimentation', 'cap-stakeholder-mgmt'],
    capabilityLabels: ['Product Strategy', 'Experimentation', 'Stakeholder Management'],
    skills: ['Continuous Discovery', 'A/B Testing', 'Funnel Analytics', 'Cross-functional Alignment'],
    scope: 'Pillar-wide customer onboarding across web and mobile surfaces',
    complexity: 'High',
    ownershipLevel: 'Primary Lead',
    impactSummary: 'Achieved 68% reduction in Time-to-First-Value and 31% lift in free-to-paid trial conversion.',
    outcomes: [
      { id: 'out-inbox-1', metricName: 'Activation Velocity', quantitativeLift: '-68% TTFV', timeframe: 'Q3 2026', verified: true },
      { id: 'out-inbox-2', metricName: 'Trial Conversion', quantitativeLift: '+31% Lift', timeframe: 'Q3 2026', verified: true }
    ],
    supportingArtifacts: [
      { id: 'art-inb-1', title: 'Onboarding PRD v2.2', type: 'PRD', dateCreated: '2026-07-28' },
      { id: 'art-inb-2', title: 'Experiment EXP-401 Report', type: 'Dashboard', dateCreated: '2026-08-20' }
    ],
    date: '2026-10-12',
    monthYear: 'OCT 2026',
    year: 2026,
    month: 'OCT',
    evidenceConfidence: 86,
    attributionConfidence: 90,
    validationStatus: 'Suggested',
    attribution: {
      userRole: 'Product Lead',
      userContributionSummary: 'Spearheaded problem discovery, PRD specification, and experimentation roadmap. Authored core trade-offs.',
      attributionConfidence: 90,
      outcomeAttribution: 'Shared',
      coContributors: [
        { name: 'Sarah Chen', role: 'Staff Product Designer', discipline: 'UX / Prototyping', share: 'Co-Lead' },
        { name: 'Alex Rivera', role: 'Tech Lead / Staff Eng', discipline: 'Frontend & API Engineering', share: 'Co-Lead' },
        { name: 'Marcus Vance', role: 'Growth Marketing Lead', discipline: 'Acquisition & Copy', share: 'Contributor' }
      ]
    },
    qualitySignals: {
      hasArtifact: true,
      hasDecisionLogged: true,
      hasCrossFunctionalLead: true,
      hasShippedOutcome: true,
      hasMeasuredMetric: true,
      hasPeerValidation: true,
      isRepeatedBehavior: true
    },
    dimensionScores: {
      frequency: 8,
      complexity: 8,
      scope: 8,
      ownership: 9,
      impact: 8,
      evidenceQuality: 9,
      consistency: 8,
      validation: 8
    },
    detectedActivitiesSummary: {
      tasks: 14,
      documents: 3,
      meetings: 7,
      experiments: 4,
      decisions: 2,
      deliverables: 3,
      notes: 18
    },
    whyExplanation: 'Detected from high clustering of 14 completed Jira tasks, 3 authored Notion PRDs, 7 meeting calendar entries, and verified Amplitude A/B test milestones linked to initiative "Self-Serve Onboarding Revamp".',
    sourceBreakdown: [
      { source: 'Jira', count: 14 },
      { source: 'Notion', count: 3 },
      { source: 'Google Calendar / Meetings', count: 7 },
      { source: 'Analytics / Amplitude', count: 4 },
      { source: 'Research Notes', count: 18 }
    ]
  },
  {
    id: 'inbox-2',
    title: 'Enterprise Schema Registry & Data Contract Architecture',
    description: 'Designed technical standards and automated CI validation checks for cross-squad data contracts, decreasing schema breakage incidents by 84%.',
    source: 'GitHub + Notion',
    linkedInitiativeId: 'init-data-contracts',
    linkedInitiativeTitle: 'Enterprise Data Contracts & Event Schema Registry',
    role: 'Technical Platform PM',
    contributionType: 'Owner',
    capabilities: ['cap-technical-understanding', 'cap-architecture', 'cap-system-thinking'],
    capabilityLabels: ['Technical Understanding', 'Architecture', 'System Thinking'],
    skills: ['Data Contracts', 'JSON Schema', 'Kafka Topics', 'CI/CD Linter'],
    scope: '6 microservice engineering squads and central analytical warehouse',
    complexity: 'Strategic',
    ownershipLevel: 'Sole Creator of Spec',
    impactSummary: 'Eliminated 10+ monthly data outage alerts and saved 140+ monthly engineering debugging hours.',
    outcomes: [
      { id: 'out-inbox-3', metricName: 'Pipeline Breakages', quantitativeLift: '-84% Alerts', timeframe: 'Q2 2026', verified: true }
    ],
    supportingArtifacts: [
      { id: 'art-inb-3', title: 'Data Contract RFC v1.0', type: 'Architecture RFC', dateCreated: '2026-03-20' },
      { id: 'art-inb-4', title: 'GitHub PR #382 Validation Suite', type: 'SQL Query', dateCreated: '2026-04-12' }
    ],
    date: '2026-10-08',
    monthYear: 'OCT 2026',
    year: 2026,
    month: 'OCT',
    evidenceConfidence: 92,
    attributionConfidence: 94,
    validationStatus: 'Suggested',
    attribution: {
      userRole: 'Technical Platform PM',
      userContributionSummary: 'Authored company-wide RFC and drove consensus among squad leads.',
      attributionConfidence: 94,
      outcomeAttribution: 'Primary Driver',
      coContributors: [
        { name: 'Devon Wright', role: 'Principal Data Engineer', discipline: 'Data Infrastructure', share: 'Co-Lead' },
        { name: 'Elena Rostova', role: 'Staff Backend Engineer', discipline: 'Event Streaming', share: 'Contributor' }
      ]
    },
    qualitySignals: {
      hasArtifact: true,
      hasDecisionLogged: true,
      hasCrossFunctionalLead: true,
      hasShippedOutcome: true,
      hasMeasuredMetric: true,
      hasPeerValidation: true,
      isRepeatedBehavior: false
    },
    dimensionScores: {
      frequency: 7,
      complexity: 9,
      scope: 8,
      ownership: 9,
      impact: 9,
      evidenceQuality: 9,
      consistency: 7,
      validation: 9
    },
    detectedActivitiesSummary: {
      tasks: 19,
      documents: 5,
      meetings: 9,
      experiments: 2,
      decisions: 4,
      deliverables: 4,
      notes: 12
    },
    whyExplanation: 'Detected from Git repository commits to schema registry repo, accompanied by authored RFC document and approval records from 6 engineering leads.',
    sourceBreakdown: [
      { source: 'GitHub', count: 19 },
      { source: 'Notion', count: 5 },
      { source: 'Google Calendar / Meetings', count: 9 }
    ]
  },
  {
    id: 'inbox-3',
    title: 'Hybrid Consumption-Based Pricing & Tier Restructuring',
    description: 'Modeled financial impact and drove executive agreement for transition from seat licenses to hybrid consumption quotas, delivering $1.8M expansion ARR.',
    source: 'Notion + Analytics',
    linkedInitiativeId: 'init-pricing-expansion',
    linkedInitiativeTitle: 'Automated Pricing Tier & Expansion Monetization',
    role: 'Product Strategy Lead',
    contributionType: 'Lead',
    capabilities: ['cap-monetization', 'cap-business-acumen', 'cap-commercial-thinking'],
    capabilityLabels: ['Monetization', 'Business Acumen', 'Commercial Thinking'],
    skills: ['Financial Sensitivity Modeling', 'Pricing Packaging', 'Net Revenue Retention', 'Executive Presentations'],
    scope: 'Company-wide enterprise and mid-market revenue model',
    complexity: 'Strategic',
    ownershipLevel: 'Strategy Lead',
    impactSummary: 'Boosted Net Revenue Retention from 104% to 118% in fiscal year 2026.',
    outcomes: [
      { id: 'out-inbox-4', metricName: 'Net Revenue Retention', quantitativeLift: '+14% NRR ($1.8M ARR)', timeframe: 'Q1 2026', verified: true }
    ],
    supportingArtifacts: [
      { id: 'art-inb-5', title: 'Pricing Sensitivity Model XLS & Deck', type: 'Presentation', dateCreated: '2025-11-20' }
    ],
    date: '2026-09-28',
    monthYear: 'SEP 2026',
    year: 2026,
    month: 'SEP',
    evidenceConfidence: 89,
    attributionConfidence: 88,
    validationStatus: 'Suggested',
    attribution: {
      userRole: 'Product Strategy Lead',
      userContributionSummary: 'Built financial model and presented proposal to Board of Directors and Executive Staff.',
      attributionConfidence: 88,
      outcomeAttribution: 'Shared',
      coContributors: [
        { name: 'Claire Dubois', role: 'VP of Finance', discipline: 'Financial Planning', share: 'Co-Lead' },
        { name: 'Jordan Miller', role: 'Head of Sales', discipline: 'Commercial Enablement', share: 'Co-Lead' }
      ]
    },
    qualitySignals: {
      hasArtifact: true,
      hasDecisionLogged: true,
      hasCrossFunctionalLead: true,
      hasShippedOutcome: true,
      hasMeasuredMetric: true,
      hasPeerValidation: true,
      isRepeatedBehavior: false
    },
    dimensionScores: {
      frequency: 6,
      complexity: 9,
      scope: 9,
      ownership: 8,
      impact: 10,
      evidenceQuality: 9,
      consistency: 7,
      validation: 9
    },
    detectedActivitiesSummary: {
      tasks: 11,
      documents: 4,
      meetings: 6,
      experiments: 3,
      decisions: 3,
      deliverables: 2,
      notes: 14
    },
    whyExplanation: 'Detected from financial model document revisions, executive calendar meeting transcripts, and confirmed Stripe/Salesforce revenue expansion data.',
    sourceBreakdown: [
      { source: 'Notion', count: 4 },
      { source: 'Google Calendar / Meetings', count: 6 },
      { source: 'Jira', count: 11 }
    ]
  }
];

export const SEED_TIMELINE_EVIDENCE: EvidenceItem[] = [
  {
    id: 'ev-onboarding-strategy',
    title: 'Product Strategy: Outcome-Driven Onboarding Modernization',
    description: 'Led end-to-end strategic discovery, customer journey re-architecture, and quantitative goal setting for core SaaS onboarding funnel.',
    source: 'Notion & Jira',
    linkedInitiativeId: 'init-onboarding-revamp',
    linkedInitiativeTitle: 'Self-Serve Onboarding Revamp & Activation Loop',
    role: 'Product Lead',
    contributionType: 'Lead',
    capabilities: ['cap-product-strategy', 'cap-prioritization', 'cap-customer-understanding'],
    capabilityLabels: ['Product Strategy', 'Prioritization', 'Customer Understanding'],
    skills: ['Opportunity Solution Trees', 'User Journey Mapping', 'North Star Metrics'],
    scope: 'Universal self-serve signup across web and mobile',
    complexity: 'High',
    ownershipLevel: 'Primary Lead',
    impactSummary: 'Transformed onboarding conversion into the primary company-wide growth driver.',
    outcomes: [
      { id: 'out-tl-1', metricName: 'Activation Velocity', quantitativeLift: '-68% TTFV', timeframe: 'Q3 2026', verified: true }
    ],
    supportingArtifacts: [
      { id: 'art-tl-1', title: 'Onboarding PRD v2.2', type: 'PRD', dateCreated: '2026-07-28' },
      { id: 'art-tl-2', title: 'User Journey Opportunity Tree', type: 'Figma Prototype', dateCreated: '2026-07-10' }
    ],
    date: '2026-10-04',
    monthYear: 'OCT 2026',
    year: 2026,
    month: 'OCT',
    evidenceConfidence: 94,
    attributionConfidence: 92,
    validationStatus: 'Validated',
    attribution: {
      userRole: 'Product Lead',
      userContributionSummary: 'Defined vision, PRD, and prioritization criteria for squads.',
      attributionConfidence: 92,
      outcomeAttribution: 'Primary Driver',
      coContributors: [
        { name: 'Sarah Chen', role: 'Staff Product Designer', discipline: 'UX', share: 'Co-Lead' }
      ]
    },
    qualitySignals: {
      hasArtifact: true,
      hasDecisionLogged: true,
      hasCrossFunctionalLead: true,
      hasShippedOutcome: true,
      hasMeasuredMetric: true,
      hasPeerValidation: true,
      isRepeatedBehavior: true
    },
    dimensionScores: {
      frequency: 8,
      complexity: 8,
      scope: 8,
      ownership: 9,
      impact: 9,
      evidenceQuality: 9,
      consistency: 8,
      validation: 9
    }
  },
  {
    id: 'ev-onboarding-experimentation',
    title: 'Controlled Experimentation: 4-Variant Activation Program',
    description: 'Designed and executed statistical A/B test matrix evaluating progressive disclosure vs upfront questionnaires, achieving p<0.01 significance.',
    source: 'Analytics / Amplitude',
    linkedInitiativeId: 'init-onboarding-revamp',
    linkedInitiativeTitle: 'Self-Serve Onboarding Revamp & Activation Loop',
    role: 'Growth PM',
    contributionType: 'Lead',
    capabilities: ['cap-experimentation', 'cap-product-analytics'],
    capabilityLabels: ['Experimentation', 'Product Analytics'],
    skills: ['Causal Inference', 'Sample Size Power Sizing', 'A/B Testing', 'SQL Telemetry'],
    scope: 'Production traffic across 45,000 monthly active visitor signups',
    complexity: 'High',
    ownershipLevel: 'Experiment Lead',
    impactSummary: 'Unlocked 31% lift in free-to-paid trial conversion.',
    outcomes: [
      { id: 'out-tl-2', metricName: 'Free-to-Paid Conversion', quantitativeLift: '+31% Lift', timeframe: 'SEP 2026', verified: true }
    ],
    supportingArtifacts: [
      { id: 'art-tl-3', title: 'Experiment EXP-401 Dashboard', type: 'Dashboard', dateCreated: '2026-08-20' }
    ],
    date: '2026-09-18',
    monthYear: 'SEP 2026',
    year: 2026,
    month: 'SEP',
    evidenceConfidence: 90,
    attributionConfidence: 92,
    validationStatus: 'Confirmed',
    attribution: {
      userRole: 'Product Lead',
      userContributionSummary: 'Designed test hypotheses and verified statistical telemetry.',
      attributionConfidence: 92,
      outcomeAttribution: 'Shared',
      coContributors: [
        { name: 'Alex Rivera', role: 'Staff Eng', discipline: 'Frontend', share: 'Co-Lead' }
      ]
    },
    qualitySignals: {
      hasArtifact: true,
      hasDecisionLogged: true,
      hasCrossFunctionalLead: true,
      hasShippedOutcome: true,
      hasMeasuredMetric: true,
      hasPeerValidation: true,
      isRepeatedBehavior: true
    },
    dimensionScores: {
      frequency: 7,
      complexity: 8,
      scope: 7,
      ownership: 9,
      impact: 8,
      evidenceQuality: 9,
      consistency: 8,
      validation: 8
    }
  },
  {
    id: 'ev-stakeholder-alignment',
    title: 'Cross-Functional Stakeholder Alignment & Operational Launch Cadence',
    description: 'Aligned conflicting priorities between Engineering infrastructure constraints, Security compliance, and Sales commitments during canary deployment.',
    source: 'Google Calendar / Meetings',
    linkedInitiativeId: 'init-onboarding-revamp',
    linkedInitiativeTitle: 'Self-Serve Onboarding Revamp & Activation Loop',
    role: 'Product Lead',
    contributionType: 'Lead',
    capabilities: ['cap-stakeholder-mgmt', 'cap-cross-functional-coord', 'cap-decision-making'],
    capabilityLabels: ['Stakeholder Management', 'Cross-functional Coordination', 'Decision Making'],
    skills: ['Stakeholder Diplomacy', 'Canary Rollout Governance', 'De-escalation'],
    scope: '6 departments encompassing 45 internal stakeholders',
    complexity: 'High',
    ownershipLevel: 'Facilitator & Decision Driver',
    impactSummary: 'Zero launch delays, zero security infractions, 100% executive sign-off.',
    outcomes: [
      { id: 'out-tl-3', metricName: 'Launch Predictability', quantitativeLift: '100% on-time milestone delivery', timeframe: 'AUG 2026', verified: true }
    ],
    supportingArtifacts: [
      { id: 'art-tl-4', title: 'Canary Launch RACI & Rollback Matrix', type: 'Presentation', dateCreated: '2026-08-15' }
    ],
    date: '2026-08-25',
    monthYear: 'AUG 2026',
    year: 2026,
    month: 'AUG',
    evidenceConfidence: 88,
    attributionConfidence: 90,
    validationStatus: 'Confirmed',
    attribution: {
      userRole: 'Product Lead',
      userContributionSummary: 'Negotiated consensus between InfoSec and Commercial leads.',
      attributionConfidence: 90,
      outcomeAttribution: 'Sole Owner',
      coContributors: []
    },
    qualitySignals: {
      hasArtifact: true,
      hasDecisionLogged: true,
      hasCrossFunctionalLead: true,
      hasShippedOutcome: true,
      hasMeasuredMetric: false,
      hasPeerValidation: true,
      isRepeatedBehavior: true
    },
    dimensionScores: {
      frequency: 8,
      complexity: 7,
      scope: 8,
      ownership: 9,
      impact: 7,
      evidenceQuality: 8,
      consistency: 8,
      validation: 9
    }
  },
  {
    id: 'ev-data-contracts-arch',
    title: 'Technical Systems Architecture: Data Contract Schema Standard',
    description: 'Authored company-wide RFC for JSONSchema-based data contracts, defining schema evolution rules and breaking-change deprecation policies.',
    source: 'GitHub & Notion',
    linkedInitiativeId: 'init-data-contracts',
    linkedInitiativeTitle: 'Enterprise Data Contracts & Event Schema Registry',
    role: 'Technical Platform PM',
    contributionType: 'Owner',
    capabilities: ['cap-technical-understanding', 'cap-architecture', 'cap-system-thinking'],
    capabilityLabels: ['Technical Understanding', 'Architecture', 'System Thinking'],
    skills: ['Schema Evolution', 'Distributed Systems', 'API Contracts', 'GitOps'],
    scope: 'Entire backend event-driven architecture across 6 teams',
    complexity: 'Strategic',
    ownershipLevel: 'RFC Author',
    impactSummary: 'Decreased production pipeline breakage by 84%.',
    outcomes: [
      { id: 'out-tl-4', metricName: 'Incident Reduction', quantitativeLift: '-84% schema bugs', timeframe: 'Q2 2026', verified: true }
    ],
    supportingArtifacts: [
      { id: 'art-tl-5', title: 'Data Contract RFC v1.0', type: 'Architecture RFC', dateCreated: '2026-03-20' }
    ],
    date: '2026-07-14',
    monthYear: 'JUL 2026',
    year: 2026,
    month: 'JUL',
    evidenceConfidence: 93,
    attributionConfidence: 95,
    validationStatus: 'Validated',
    attribution: {
      userRole: 'Technical Platform PM',
      userContributionSummary: 'Authored architectural specification and led architecture review board approval.',
      attributionConfidence: 95,
      outcomeAttribution: 'Primary Driver',
      coContributors: [
        { name: 'Devon Wright', role: 'Principal Data Eng', discipline: 'Infrastructure', share: 'Co-Lead' }
      ]
    },
    qualitySignals: {
      hasArtifact: true,
      hasDecisionLogged: true,
      hasCrossFunctionalLead: true,
      hasShippedOutcome: true,
      hasMeasuredMetric: true,
      hasPeerValidation: true,
      isRepeatedBehavior: false
    },
    dimensionScores: {
      frequency: 6,
      complexity: 9,
      scope: 8,
      ownership: 9,
      impact: 9,
      evidenceQuality: 9,
      consistency: 7,
      validation: 9
    }
  },
  {
    id: 'ev-pricing-strategy',
    title: 'Commercial Strategy: Hybrid Consumption Monetization Model',
    description: 'Modeled financial impact of shifting pricing tiers, evaluated churn sensitivity across 4,200 accounts, and presented strategy to the executive team.',
    source: 'Notion & Analytics',
    linkedInitiativeId: 'init-pricing-expansion',
    linkedInitiativeTitle: 'Automated Pricing Tier & Expansion Monetization',
    role: 'Product Strategy Lead',
    contributionType: 'Lead',
    capabilities: ['cap-monetization', 'cap-business-acumen', 'cap-commercial-thinking'],
    capabilityLabels: ['Monetization', 'Business Acumen', 'Commercial Thinking'],
    skills: ['Financial Modeling', 'Pricing Packaging', 'Net Revenue Retention', 'Executive Storytelling'],
    scope: 'Entire product revenue stream',
    complexity: 'Strategic',
    ownershipLevel: 'Strategy Lead',
    impactSummary: 'Directly unlocked $1.8M in annualized net expansion ARR.',
    outcomes: [
      { id: 'out-tl-5', metricName: 'Net Revenue Retention', quantitativeLift: '+14% NRR ($1.8M ARR)', timeframe: 'Q1 2026', verified: true }
    ],
    supportingArtifacts: [
      { id: 'art-tl-6', title: 'Pricing Packaging Model & Board RFC', type: 'Presentation', dateCreated: '2025-11-20' }
    ],
    date: '2026-03-10',
    monthYear: 'MAR 2026',
    year: 2026,
    month: 'MAR',
    evidenceConfidence: 91,
    attributionConfidence: 90,
    validationStatus: 'Validated',
    attribution: {
      userRole: 'Product Strategy Lead',
      userContributionSummary: 'Spearheaded quantitative modeling and pricing packaging architecture.',
      attributionConfidence: 90,
      outcomeAttribution: 'Shared',
      coContributors: [
        { name: 'Claire Dubois', role: 'VP Finance', discipline: 'Finance', share: 'Co-Lead' },
        { name: 'Jordan Miller', role: 'Head of Sales', discipline: 'Sales', share: 'Co-Lead' }
      ]
    },
    qualitySignals: {
      hasArtifact: true,
      hasDecisionLogged: true,
      hasCrossFunctionalLead: true,
      hasShippedOutcome: true,
      hasMeasuredMetric: true,
      hasPeerValidation: true,
      isRepeatedBehavior: false
    },
    dimensionScores: {
      frequency: 6,
      complexity: 9,
      scope: 9,
      ownership: 8,
      impact: 10,
      evidenceQuality: 9,
      consistency: 7,
      validation: 9
    }
  }
];

export const CAPABILITY_DEFINITIONS_CATALOG: CapabilityDefinition[] = [
  // PRODUCT DOMAIN
  {
    id: 'cap-product-strategy',
    name: 'Product Strategy',
    domain: 'PRODUCT',
    description: 'Formulating outcome-driven roadmaps, identifying market opportunities, defining product vision, and aligning product bets with sustainable competitive moats.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 8,
      complexity: 9,
      scope: 8,
      ownership: 9,
      impact: 9,
      evidenceQuality: 9,
      consistency: 8,
      validation: 9
    },
    verifiedEvidenceCount: 4,
    recentEvidenceTitles: [
      'Product Strategy: Outcome-Driven Onboarding Modernization',
      'Hybrid Consumption-Based Pricing & Tier Restructuring'
    ],
    historicalEvidenceTitles: [
      'Self-serve Workspace Adoption Roadmap (2025)',
      'Enterprise Collaboration Module Strategy (2025)'
    ],
    missingEvidenceNotes: [
      'Strong execution in high-growth and B2B SaaS domains',
      'Limited evidence of 0-to-1 consumer viral loop incubation'
    ],
    gapClassification: 'Exposure Gap',
    gapReason: 'Work has focused predominantly on B2B SaaS platforms rather than high-velocity consumer viral apps.',
    recommendedAction: 'Explore consumer-facing product discovery experiments or advise on an early-stage PLG incubation project.'
  },
  {
    id: 'cap-experimentation',
    name: 'Experimentation',
    domain: 'PRODUCT',
    description: 'Designing statistically rigorous A/B and multi-variant test frameworks, validating hypotheses, and rapidly interpreting behavioral drop-offs.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 8,
      complexity: 8,
      scope: 7,
      ownership: 9,
      impact: 8,
      evidenceQuality: 9,
      consistency: 8,
      validation: 8
    },
    verifiedEvidenceCount: 5,
    recentEvidenceTitles: [
      'Controlled Experimentation: 4-Variant Activation Program',
      'Quota Threshold Notification A/B Test'
    ],
    historicalEvidenceTitles: [
      'Cardless Trial vs Credit Card Gate Experiment (2025)'
    ],
    missingEvidenceNotes: [
      'High demonstrated skill in conversion funnels and activation'
    ]
  },
  {
    id: 'cap-product-discovery',
    name: 'Product Discovery',
    domain: 'PRODUCT',
    description: 'Uncovering latent customer problems through generative customer interviews, continuous feedback loops, and opportunity solution tree mapping.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 8,
      complexity: 8,
      scope: 8,
      ownership: 8,
      impact: 8,
      evidenceQuality: 8,
      consistency: 8,
      validation: 8
    },
    verifiedEvidenceCount: 3,
    recentEvidenceTitles: [
      '18 User Session Recordings & Friction Teardowns'
    ],
    historicalEvidenceTitles: [
      'Customer Advisory Board Enterprise Interview Matrix (2025)'
    ],
    missingEvidenceNotes: []
  },
  {
    id: 'cap-product-analytics',
    name: 'Product Analytics',
    domain: 'PRODUCT',
    description: 'Querying event data (SQL, Amplitude), tracking telemetry schemas, calculating cohort retention curves, and evaluating feature usage depth.',
    observedProficiency: 'Intermediate',
    confidence: 'Moderate',
    evidenceStrength: 'Moderate',
    dimensionScores: {
      frequency: 7,
      complexity: 7,
      scope: 6,
      ownership: 7,
      impact: 7,
      evidenceQuality: 7,
      consistency: 7,
      validation: 7
    },
    verifiedEvidenceCount: 3,
    recentEvidenceTitles: [
      'Activation Funnel Metric SQL Query & Telemetry Spec'
    ],
    historicalEvidenceTitles: [
      'Monthly Cohort Retention Analysis (2025)'
    ],
    missingEvidenceNotes: [
      '△ Limited verified evidence of advanced predictive modeling or machine learning telemetry integration'
    ],
    gapClassification: 'Skill Gap',
    gapReason: 'Strong in descriptive event analytics (funnels, retention cohorts), but lacks verified machine learning feature telemetry.',
    recommendedAction: 'Deploy a predictive churn or predictive propensity scoring model into production analytics pipeline.'
  },
  {
    id: 'cap-prioritization',
    name: 'Prioritization',
    domain: 'PRODUCT',
    description: 'Making disciplined, transparent trade-offs between customer feature requests, architectural technical debt, and revenue-generating bets.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 9,
      complexity: 8,
      scope: 8,
      ownership: 9,
      impact: 8,
      evidenceQuality: 9,
      consistency: 8,
      validation: 9
    },
    verifiedEvidenceCount: 4,
    recentEvidenceTitles: [
      'Onboarding Backlog & Technical Debt Trade-off Matrix'
    ],
    historicalEvidenceTitles: [
      'Q1 Product Portfolio Cut-line RFC (2026)'
    ],
    missingEvidenceNotes: []
  },
  {
    id: 'cap-customer-understanding',
    name: 'Customer Understanding',
    domain: 'PRODUCT',
    description: 'Deep empathy for user pain points, buyer workflows, organizational friction, and day-to-day user mental models.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 8,
      complexity: 8,
      scope: 7,
      ownership: 8,
      impact: 8,
      evidenceQuality: 8,
      consistency: 8,
      validation: 8
    },
    verifiedEvidenceCount: 4,
    recentEvidenceTitles: [
      'Customer Persona & Friction Journey Mapping'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },

  // TECH DOMAIN
  {
    id: 'cap-technical-understanding',
    name: 'Technical Understanding',
    domain: 'TECH',
    description: 'Comprehending system architecture, distributed microservices constraints, database schemas, latency boundaries, and API contracts.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 8,
      complexity: 9,
      scope: 8,
      ownership: 9,
      impact: 9,
      evidenceQuality: 9,
      consistency: 8,
      validation: 9
    },
    verifiedEvidenceCount: 4,
    recentEvidenceTitles: [
      'Technical Systems Architecture: Data Contract Schema Standard',
      'JSONSchema Linter CI/CD Workflow'
    ],
    historicalEvidenceTitles: [
      'Vector Search & RAG Infrastructure Spec (2025)'
    ],
    missingEvidenceNotes: []
  },
  {
    id: 'cap-architecture',
    name: 'Architecture',
    domain: 'TECH',
    description: 'Designing modular, loosely coupled software and data systems that withstand scaling, concurrency, and security requirements.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 7,
      complexity: 9,
      scope: 8,
      ownership: 9,
      impact: 9,
      evidenceQuality: 9,
      consistency: 7,
      validation: 9
    },
    verifiedEvidenceCount: 3,
    recentEvidenceTitles: [
      'Enterprise Data Contract RFC v1.0'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },
  {
    id: 'cap-system-thinking',
    name: 'System Thinking',
    domain: 'TECH',
    description: 'Anticipating secondary and tertiary consequences across interconnected technical, organizational, and behavioral feedback loops.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 8,
      complexity: 8,
      scope: 8,
      ownership: 8,
      impact: 8,
      evidenceQuality: 8,
      consistency: 8,
      validation: 8
    },
    verifiedEvidenceCount: 3,
    recentEvidenceTitles: [
      'Event-Driven Producer/Consumer Backward Compatibility Guardrail'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },
  {
    id: 'cap-engineering-collab',
    name: 'Engineering Collaboration',
    domain: 'TECH',
    description: 'Partnering with technical leads, participating in code & architecture reviews, and gaining engineering trust through technical rigor.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 9,
      complexity: 8,
      scope: 8,
      ownership: 8,
      impact: 8,
      evidenceQuality: 9,
      consistency: 9,
      validation: 9
    },
    verifiedEvidenceCount: 5,
    recentEvidenceTitles: [
      'Weekly Technical Architecture Review Board'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },

  // BUSINESS DOMAIN
  {
    id: 'cap-monetization',
    name: 'Monetization',
    domain: 'BUSINESS',
    description: 'Architecting pricing tiers, packaging strategies, usage metrics, paywalls, and contract expansion mechanisms.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 7,
      complexity: 9,
      scope: 9,
      ownership: 8,
      impact: 10,
      evidenceQuality: 9,
      consistency: 7,
      validation: 9
    },
    verifiedEvidenceCount: 3,
    recentEvidenceTitles: [
      'Commercial Strategy: Hybrid Consumption Monetization Model',
      'Usage Quota Threshold Alerts Optimization'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },
  {
    id: 'cap-business-acumen',
    name: 'Business Acumen',
    domain: 'BUSINESS',
    description: 'Understanding P&L drivers, SaaS unit economics, CAC/LTV payback dynamics, enterprise procurement friction, and revenue forecasting.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 7,
      complexity: 8,
      scope: 8,
      ownership: 8,
      impact: 9,
      evidenceQuality: 9,
      consistency: 7,
      validation: 8
    },
    verifiedEvidenceCount: 3,
    recentEvidenceTitles: [
      'SaaS Packaging Sensitivity Model XLS'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },
  {
    id: 'cap-commercial-thinking',
    name: 'Commercial Thinking',
    domain: 'BUSINESS',
    description: 'Aligning product capabilities with enterprise buyer willingness to pay, competitor positioning, and direct sales velocity.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 7,
      complexity: 8,
      scope: 8,
      ownership: 8,
      impact: 9,
      evidenceQuality: 8,
      consistency: 7,
      validation: 8
    },
    verifiedEvidenceCount: 2,
    recentEvidenceTitles: [
      'Enterprise Tier Custom SLA Packaging'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },

  // OPERATIONS DOMAIN
  {
    id: 'cap-stakeholder-mgmt',
    name: 'Stakeholder Management',
    domain: 'OPERATIONS',
    description: 'Engaging, communicating, and synthesizing expectations across diverse internal and external stakeholders without direct authority.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 9,
      complexity: 8,
      scope: 8,
      ownership: 9,
      impact: 8,
      evidenceQuality: 9,
      consistency: 9,
      validation: 9
    },
    verifiedEvidenceCount: 5,
    recentEvidenceTitles: [
      'Cross-Functional Stakeholder Alignment & Operational Launch Cadence'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },
  {
    id: 'cap-process-design',
    name: 'Process Design',
    domain: 'OPERATIONS',
    description: 'Building repeatable operational workflows, escalation rubrics, and feedback loops that increase organizational velocity.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 8,
      complexity: 8,
      scope: 8,
      ownership: 8,
      impact: 8,
      evidenceQuality: 8,
      consistency: 8,
      validation: 8
    },
    verifiedEvidenceCount: 3,
    recentEvidenceTitles: [
      'Incident Post-Mortem & Blameless Review Standard Operating Procedure'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },
  {
    id: 'cap-cross-functional-coord',
    name: 'Cross-functional Coordination',
    domain: 'OPERATIONS',
    description: 'Synchronizing multi-team schedules, dependencies, and risk registers across Engineering, Product, Marketing, and Support.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 9,
      complexity: 8,
      scope: 8,
      ownership: 9,
      impact: 8,
      evidenceQuality: 9,
      consistency: 9,
      validation: 9
    },
    verifiedEvidenceCount: 4,
    recentEvidenceTitles: [
      'Onboarding Canary Release War Room Coordination'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },

  // LEADERSHIP DOMAIN
  {
    id: 'cap-decision-making',
    name: 'Decision Making',
    domain: 'LEADERSHIP',
    description: 'Making timely, principled decisions under high ambiguity, documenting decision records, and committing teams to chosen paths.',
    observedProficiency: 'Advanced',
    confidence: 'High',
    evidenceStrength: 'Strong',
    dimensionScores: {
      frequency: 8,
      complexity: 8,
      scope: 8,
      ownership: 9,
      impact: 8,
      evidenceQuality: 9,
      consistency: 8,
      validation: 9
    },
    verifiedEvidenceCount: 4,
    recentEvidenceTitles: [
      'ADR-04: Progressive Workspace Provisioning Trade-off Decision'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: []
  },
  {
    id: 'cap-people-leadership',
    name: 'People Leadership',
    domain: 'LEADERSHIP',
    description: 'Formally managing, coaching, setting career progression ladders, and conducting performance reviews for reporting team members.',
    observedProficiency: 'Emerging',
    confidence: 'Low',
    evidenceStrength: 'Insufficient',
    dimensionScores: {
      frequency: 3,
      complexity: 4,
      scope: 3,
      ownership: 4,
      impact: 4,
      evidenceQuality: 4,
      consistency: 3,
      validation: 4
    },
    verifiedEvidenceCount: 1,
    recentEvidenceTitles: [
      'Mentorship of 2 Associate PMs in PRD Authoring'
    ],
    historicalEvidenceTitles: [],
    missingEvidenceNotes: [
      '○ No strong evidence of formal administrative people management or direct headcount performance evaluation'
    ],
    gapClassification: 'Experience Gap',
    gapReason: 'User has functioned primarily as an Individual Contributor and Squad Lead without direct reporting line accountability.',
    recommendedAction: 'Take on formal co-management of an Associate PM or transition to a Lead IC role with explicit junior mentorship mandates.'
  }
];

export const SEED_CAPABILITY_DEFINITIONS_CATALOG = CAPABILITY_DEFINITIONS_CATALOG;

export const SEED_SOURCE_CONNECTORS: EvidenceSourceConnector[] = [
  {
    id: 'conn-jira',
    source: 'Jira',
    category: 'Task Management',
    status: 'Connected',
    evidenceTypesCaptured: ['Sprint tasks', 'Bugs triaged', 'Epics delivered', 'Release versions'],
    lastSync: '12 minutes ago',
    privacyScope: 'Work tickets only (no private internal comments)',
    recordsIngested: 142,
    autoExtractEvidence: true,
    isExcluded: false
  },
  {
    id: 'conn-notion',
    source: 'Notion',
    category: 'Documents & Knowledge',
    status: 'Connected',
    evidenceTypesCaptured: ['PRD specifications', 'RFC documents', 'Meeting synthesis', 'Strategy briefs'],
    lastSync: '34 minutes ago',
    privacyScope: 'Public product team workspaces only',
    recordsIngested: 38,
    autoExtractEvidence: true,
    isExcluded: false
  },
  {
    id: 'conn-github',
    source: 'GitHub',
    category: 'Code & Architecture',
    status: 'Connected',
    evidenceTypesCaptured: ['Merged pull requests', 'Schema specifications', 'Architecture reviews', 'Issue discussions'],
    lastSync: '1 hour ago',
    privacyScope: 'Metadata and code diff summaries (no proprietary keys)',
    recordsIngested: 56,
    autoExtractEvidence: true,
    isExcluded: false
  },
  {
    id: 'conn-meet',
    source: 'Google Calendar / Meetings',
    category: 'Calendar & Communication',
    status: 'Connected',
    evidenceTypesCaptured: ['Cross-functional launches', 'Design reviews', 'Architecture syncs', 'Customer interviews'],
    lastSync: '2 hours ago',
    privacyScope: 'Meeting titles & attendee roles (transcripts scrubbed of personal identifiers)',
    recordsIngested: 88,
    autoExtractEvidence: true,
    isExcluded: false
  },
  {
    id: 'conn-analytics',
    source: 'Analytics / Amplitude',
    category: 'Analytics & Product',
    status: 'Connected',
    evidenceTypesCaptured: ['A/B test milestones', 'Funnel completion records', 'Telemetry schemas'],
    lastSync: '3 hours ago',
    privacyScope: 'Aggregated metric summaries only',
    recordsIngested: 14,
    autoExtractEvidence: true,
    isExcluded: false
  },
  {
    id: 'conn-figma',
    source: 'Figma',
    category: 'Design & UX',
    status: 'Ready to Connect',
    evidenceTypesCaptured: ['Wireframes reviewed', 'Prototypes shared', 'Design token specs'],
    lastSync: 'Never',
    privacyScope: 'Comment threads and file canvas links',
    recordsIngested: 0,
    autoExtractEvidence: false,
    isExcluded: false
  },
  {
    id: 'conn-manual',
    source: 'Manual Reflection',
    category: 'Manual Reflection',
    status: 'Connected',
    evidenceTypesCaptured: ['User self-reflections', 'Milestone retrospectives', 'External certifications'],
    lastSync: 'Real-time',
    privacyScope: 'Private to user CareerOS vault',
    recordsIngested: 9,
    autoExtractEvidence: true,
    isExcluded: false
  }
];

export const SEED_EVIDENCE_GRAPH_DATA: EvidenceGraphData = {
  nodes: [
    // Root User
    { id: 'node-user', label: 'User: Product Practitioner', type: 'user', group: 'root', size: 36, badge: 'CareerOS Owner' },

    // Initiatives
    { id: 'node-init-onboarding', label: 'Onboarding Revamp Initiative', type: 'initiative', group: 'work', size: 30, badge: 'Initiative' },
    { id: 'node-init-data-contracts', label: 'Data Contracts & Schema Registry', type: 'initiative', group: 'work', size: 28, badge: 'Initiative' },
    { id: 'node-init-pricing', label: 'Hybrid Usage Pricing Transition', type: 'initiative', group: 'work', size: 28, badge: 'Initiative' },

    // Activities
    { id: 'node-act-tasks', label: '14 Jira Tasks & Sprints', type: 'activity', group: 'activity', size: 20 },
    { id: 'node-act-docs', label: '3 PRDs & Spec RFCs', type: 'activity', group: 'activity', size: 20 },
    { id: 'node-act-meetings', label: '7 Cross-Functional Syncs', type: 'activity', group: 'activity', size: 20 },
    { id: 'node-act-experiments', label: '4 A/B Funnel Tests', type: 'activity', group: 'activity', size: 20 },

    // Artifacts
    { id: 'node-art-prd', label: 'Onboarding PRD v2.2', type: 'artifact', group: 'activity', size: 22 },
    { id: 'node-art-sql', label: 'Telemetry Event Specs', type: 'artifact', group: 'activity', size: 22 },

    // Evidence
    { id: 'node-ev-strategy', label: 'Outcome-Driven Strategy Evidence', type: 'evidence', group: 'evidence', size: 26, badge: 'Validated (86%)' },
    { id: 'node-ev-experimentation', label: 'Controlled A/B Testing Evidence', type: 'evidence', group: 'evidence', size: 26, badge: 'Validated (90%)' },

    // Capabilities
    { id: 'node-cap-strategy', label: 'Product Strategy', type: 'capability', group: 'capability', size: 28, badge: 'Advanced' },
    { id: 'node-cap-experimentation', label: 'Experimentation', type: 'capability', group: 'capability', size: 28, badge: 'Advanced' },
    { id: 'node-cap-stakeholder', label: 'Stakeholder Management', type: 'capability', group: 'capability', size: 26, badge: 'Advanced' },

    // Outcomes
    { id: 'node-out-ttfv', label: '-68% Time-to-First-Value', type: 'outcome', group: 'outcome', size: 24, badge: 'Quantitative' },
    { id: 'node-out-conversion', label: '+31% Trial Conversion', type: 'outcome', group: 'outcome', size: 24, badge: 'Quantitative' },

    // Target Role Requirement
    { id: 'node-role-spm', label: 'Senior Product Manager', type: 'role_requirement', group: 'role', size: 34, badge: 'Target Role (P4)' }
  ],
  links: [
    { source: 'node-user', target: 'node-init-onboarding', relationship: 'undertakes', label: 'Led' },
    { source: 'node-user', target: 'node-init-data-contracts', relationship: 'undertakes', label: 'Spearheaded' },
    { source: 'node-user', target: 'node-init-pricing', relationship: 'undertakes', label: 'Designed' },

    { source: 'node-init-onboarding', target: 'node-act-tasks', relationship: 'comprises' },
    { source: 'node-init-onboarding', target: 'node-act-docs', relationship: 'comprises' },
    { source: 'node-init-onboarding', target: 'node-act-meetings', relationship: 'comprises' },
    { source: 'node-init-onboarding', target: 'node-act-experiments', relationship: 'comprises' },

    { source: 'node-act-docs', target: 'node-art-prd', relationship: 'produces' },
    { source: 'node-act-experiments', target: 'node-art-sql', relationship: 'produces' },

    { source: 'node-init-onboarding', target: 'node-ev-strategy', relationship: 'crystallizes_into', label: 'Synthesizes' },
    { source: 'node-init-onboarding', target: 'node-ev-experimentation', relationship: 'crystallizes_into', label: 'Proves' },

    { source: 'node-ev-strategy', target: 'node-cap-strategy', relationship: 'demonstrates' },
    { source: 'node-ev-strategy', target: 'node-cap-stakeholder', relationship: 'demonstrates' },
    { source: 'node-ev-experimentation', target: 'node-cap-experimentation', relationship: 'demonstrates' },

    { source: 'node-ev-strategy', target: 'node-out-ttfv', relationship: 'yields' },
    { source: 'node-ev-experimentation', target: 'node-out-conversion', relationship: 'yields' },

    { source: 'node-cap-strategy', target: 'node-role-spm', relationship: 'fulfills', label: 'Core Need' },
    { source: 'node-cap-experimentation', target: 'node-role-spm', relationship: 'fulfills', label: 'Growth Need' },
    { source: 'node-cap-stakeholder', target: 'node-role-spm', relationship: 'fulfills', label: 'Execution Need' }
  ]
};

export const SEED_ROLE_READINESS_CHECK: RoleReadinessEvidenceCheck = {
  targetRoleId: 'role-sr-product-manager',
  targetRoleTitle: 'Senior Product Manager',
  overallReadinessPercentage: 82,
  readinessBand: 'Ready for Transition',
  strongEvidenceCapabilities: [
    'Product Strategy (4 verified signals, high complexity)',
    'Continuous Discovery & Customer Empathy (18 recorded sessions)',
    'Technical Understanding & Architecture (Data Contracts RFC)',
    'Monetization & Business Acumen ($1.8M ARR expansion model)',
    'Stakeholder Diplomacy & Governance (Canary launch facilitation)'
  ],
  emergingEvidenceCapabilities: [
    'Product Analytics (strong in funnels; predictive telemetry emerging)',
    'Cross-portfolio Resource Negotiation'
  ],
  evidenceGaps: [
    {
      capabilityName: 'People Leadership',
      gapType: 'Experience Gap',
      currentState: 'Demonstrated informal squad mentorship (2 associate PMs), but lacks formal direct-report performance accountability.',
      recommendedNextAction: 'Request formal co-management assignment for an incoming PM or lead a formalized summer intern project.'
    },
    {
      capabilityName: '0-to-1 Consumer Viral Mechanics',
      gapType: 'Exposure Gap',
      currentState: 'Substantial B2B SaaS depth; limited public consumer viral loop signals.',
      recommendedNextAction: 'Design an interactive public benchmark tool or open-source community asset.'
    }
  ],
  adjacentMobilityRoles: [
    {
      roleId: 'role-growth-product-mgr',
      title: 'Growth Product Manager',
      overlapPercentage: 88,
      evidenceOverlap: 84,
      difficulty: 'Low',
      keyGap: 'Multi-touch marketing attribution systems'
    },
    {
      roleId: 'role-product-ops-mgr',
      title: 'Product Operations Manager',
      overlapPercentage: 82,
      evidenceOverlap: 78,
      difficulty: 'Low',
      keyGap: 'Enterprise tooling consolidation governance'
    },
    {
      roleId: 'role-tech-product-mgr',
      title: 'Technical Product Manager',
      overlapPercentage: 86,
      evidenceOverlap: 82,
      difficulty: 'Low',
      keyGap: 'Microservices latency budget enforcement'
    },
    {
      roleId: 'role-bizops-mgr',
      title: 'Business Operations Manager',
      overlapPercentage: 74,
      evidenceOverlap: 70,
      difficulty: 'Moderate',
      keyGap: 'Corporate M&A and departmental budgeting'
    }
  ]
};
