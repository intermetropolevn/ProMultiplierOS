import { RoleIntelligenceItem } from '../types';

export const ADDITIONAL_ROLES_DATA: RoleIntelligenceItem[] = [
  // 1. Product Manager (Mid-Level P3)
  {
    id: 'role-product-manager',
    title: 'Product Manager',
    jobFamily: 'Product Management',
    domain: 'B2B Software & Digital Workflows',
    roleFamilyCategory: 'product',
    currentLevel: 'P3 (Mid-level)',
    targetLevel: 'P4 (Senior PM)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Drives the tactical discovery, delivery, and lifecycle optimization of a defined product capability or core user journey, collaborating directly with engineering and design.',
    overview: 'Product Managers at P3 level lead autonomous feature teams. They transform customer friction into prioritized backlogs, run user experiments, analyze conversion funnels, and ensure sprint commitments translate directly to customer value.',
    coreResponsibilities: [
      'Own end-to-end user stories, PRDs, and acceptance criteria for dedicated engineering squad',
      'Conduct regular user interviews, usability testing sessions, and survey analyses',
      'Track feature adoption, drop-off rates, and customer effort scores',
      'Prioritize sprint backlogs balancing bugs, technical debt, and new value delivery',
      'Partner with Product Marketing on feature release notes and customer communications'
    ],
    scope: 'Dedicated to 1 engineering squad (6-8 engineers + 1 product designer) and a specific feature module.',
    decisionRights: [
      'Sprint backlog priority and sprint scope boundaries',
      'Acceptance sign-off for completed user stories',
      'A/B test hypothesis formulation and variant selection',
      'Bug triage and severity prioritization for squad domain'
    ],
    expectedImpact: 'Increased user activation within feature domain, reduced cycle time from spec to production release, and high sprint completion predictability.',
    typicalSeniority: '2 - 5 years of tech or product management experience.',
    keySkills: [
      'User Story Authoring & PRD Specs',
      'Scrum & Kanban Execution',
      'Quantitative Product Telemetry',
      'Customer Discovery Interviews',
      'Wireframing & Prototype Review',
      'Cross-functional Sprint Facilitation'
    ],
    businessKnowledge: [
      'Product-Led Growth (PLG) Funnel Metrics',
      'Customer Journey Mapping',
      'Basic Unit Economics (CAC / LTV)',
      'SaaS Subscription Lifecycle'
    ],
    technicalKnowledge: [
      'REST APIs & Webhooks Basics',
      'SQL Querying for Product Analytics',
      'Mobile/Web App Performance Metrics',
      'CI/CD Feature Flag Deployment'
    ],
    behavioralCompetencies: [
      'Empathy for Customer Friction',
      'Collaborative Team Spirit',
      'Clarity in Written Communication',
      'Curiosity & Fast Feedback Synthesis'
    ],
    toolsAndPlatforms: ['Jira', 'Linear', 'Mixpanel', 'Figma', 'Postman', 'Notion', 'Metabase'],
    commonKpis: [
      { metric: 'Feature Adoption Rate', targetBenchmark: '> 35% within 45 days', importance: 'critical' },
      { metric: 'Sprint Velocity Attainment', targetBenchmark: '> 85% predictable delivery', importance: 'primary' },
      { metric: 'User Activation Velocity', targetBenchmark: '< 5 days to first key event', importance: 'primary' }
    ],
    typicalDeliverables: [
      { title: 'Product Requirements Document (PRD)', frequency: 'Monthly', purpose: 'Specifies customer problem, scope, user stories, and acceptance tests.' },
      { title: 'Bi-Weekly Sprint Roadmap Review', frequency: 'Bi-weekly', purpose: 'Maintains team alignment and surfaces blockers for upcoming sprint.' }
    ],
    adjacentRoles: [
      { roleId: 'role-sr-product-manager', roleTitle: 'Senior Product Manager', overlapPercentage: 88, transferability: 'High', commonBridgeSkills: ['Multi-squad roadmapping', 'Unit economics', 'Executive presence'], notes: 'Direct vertical progression pathway upon demonstrating strategic autonomy.' },
      { roleId: 'role-product-ops-mgr', roleTitle: 'Product Operations Manager', overlapPercentage: 74, transferability: 'High', commonBridgeSkills: ['Process design', 'Feedback consolidation', 'Toolchain optimization'], notes: 'Great pivot for PMs who love operational leverage and workflow refinement.' },
      { roleId: 'role-product-owner', roleTitle: 'Product Owner', overlapPercentage: 92, transferability: 'High', commonBridgeSkills: ['Backlog management', 'Scrum ceremonies', 'Acceptance testing'], notes: 'Lateral operational variant in scaled agile enterprise settings.' }
    ],
    careerProgression: {
      icTrack: ['Associate PM (P2)', 'Product Manager (P3)', 'Senior Product Manager (P4)', 'Staff PM (P5)'],
      managementTrack: ['Product Manager (P3)', 'Senior PM (P4)', 'Group Product Manager (M1)', 'Director of Product (M2)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 3, proficiency: 'advanced', description: 'Strong understanding of product workflows, basic API mechanics, and metric tracking.', evidencePrompt: 'Authored clear technical PRDs and collaborated smoothly with backend engineers.', rationale: 'Capable of independent specification and testing.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 3, proficiency: 'advanced', description: 'Understands industry context and product monetization model.', evidencePrompt: 'Linked feature hypotheses to cohort retention and conversion lift.', rationale: 'Balances customer desires with company business objectives.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 3, proficiency: 'advanced', description: 'Tackles well-defined problem spaces with defined user pain points.', evidencePrompt: 'Resolved checkout abandonment issue by eliminating multi-step form friction.', rationale: 'Executes effectively within bounded problem domains.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 3, proficiency: 'advanced', description: 'Autonomous decision rights over backlog prioritization within squad domain.', evidencePrompt: 'Made trade-off calls between technical debt and feature polish.', rationale: 'Has squad-level autonomy.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 3, proficiency: 'advanced', description: 'Drives measurable satisfaction for specific user cohorts.', evidencePrompt: 'Shipped refreshed export tool used by 12,000 monthly active users.', rationale: 'Direct contribution to user experience quality.' },
      { key: 'business_impact', label: 'Business Impact', score: 3, proficiency: 'advanced', description: 'Supports ARR growth through feature adoption and churn reduction.', evidencePrompt: 'Improved self-serve activation by 12% in primary onboarding flow.', rationale: 'Provides steady incremental commercial value.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 3, proficiency: 'advanced', description: 'Facilitates 1 squad and manages day-to-day agile workflow.', evidencePrompt: 'Ran daily standups and sprint planning with zero scheduling slippage.', rationale: 'Solid single-squad operational rhythm.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 3, proficiency: 'advanced', description: 'Interacts with internal squad and functional liaisons (CS, QA, Marketing).', evidencePrompt: 'Maintained proactive release communication with Customer Success.', rationale: 'Manages immediate stakeholder relationships with poise.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 2, proficiency: 'working', description: 'Contributes feature insights to the overarching product strategy.', evidencePrompt: 'Synthesized customer feedback that shaped next quarter’s theme.', rationale: 'Influences features rather than company-wide vision.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 3, proficiency: 'advanced', description: 'Takes pride in squad delivery and advocates passionately for user needs.', evidencePrompt: 'Took ownership of unexpected launch outage and spearheaded post-mortem.', rationale: 'Reliable owner of team outcomes.' }
    ],
    levelMapping: {
      careerosInferredLevel: 'P3 — Mid-level Product Specialist',
      levelCode: 'P3',
      icEquivalent: 'Senior Product Manager (P4) / Staff PM (P5)',
      managementEquivalent: 'Lead PM / Group PM (M1)',
      referenceFrameworkLevels: {
        aonRadford: 'P3 (Professional / Experienced)',
        kornFerryHay: 'Hay 360-440 Points (Grade 14)',
        mercerIpe: 'IPE Class 50 (Position Class 12)',
        wtwGgs: 'WTW Grade 10 (Senior Professional)',
        patterson: 'Band C (Process / Operational Choice)'
      },
      scopeSummary: {
        roleScope: 'Autonomous delivery for 1 squad / bounded feature capability.',
        decisionScope: 'Tactical sprint prioritization, story acceptance, and variant testing.',
        impactScope: 'Feature adoption and user cohort satisfaction within designated module.',
        complexity: 'Moderate; solves defined user problems within existing architecture.',
        leadershipScope: 'Peer leadership of squad engineers and designer; no direct reports.'
      },
      evidenceRationale: [
        'Demonstrates end-to-end feature ownership from discovery through post-launch analysis.',
        'Operates independently without daily managerial oversight on sprint decisions.',
        'Requires senior guidance only for cross-portfolio strategy or novel monetization models.'
      ]
    },
    referenceEvaluations: [
      {
        frameworkId: 'careeros_native',
        frameworkName: 'CareerOS Native Evaluation',
        levelOrScore: 'P3 Equivalent (Score: 2.9 / 5.0)',
        dimensions: [
          { name: 'Knowledge', weightOrScope: 'Core', scoreOrBand: '3 - Advanced', interpretation: 'Competent in modern product delivery and user telemetry.' },
          { name: 'Decision Autonomy', weightOrScope: 'Squad', scoreOrBand: '3 - Advanced', interpretation: 'Owns squad backlog and story scope.' },
          { name: 'Impact Blast Radius', weightOrScope: 'Module', scoreOrBand: '3 - Advanced', interpretation: 'Impacts feature adoption curves directly.' }
        ],
        rationale: 'Solid mid-level product professional who ships value consistently and owns team discovery loops.',
        marketAlignmentNotes: 'Standard market expectation for mid-career PMs in high-growth tech.'
      },
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Global Compensation',
        levelOrScore: 'P3 Professional',
        dimensions: [
          { name: 'Job Level Code', weightOrScope: 'Benchmark', scoreOrBand: 'P3', interpretation: 'Experienced Individual Contributor' },
          { name: 'Work Discretion', weightOrScope: 'Moderate', scoreOrBand: 'Standard Practices', interpretation: 'Exercises judgment within defined policies and practices.' }
        ],
        rationale: 'Applies professional knowledge to solve problems of moderate scope and complexity.',
        marketAlignmentNotes: 'P3 is the standard anchor grade for self-directed product contributors.'
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay System',
        levelOrScore: 'Grade 14 (380 Points)',
        dimensions: [
          { name: 'Know-How', weightOrScope: 'Primary', scoreOrBand: 'EI2 (Specialized)', interpretation: 'Deep specialized product knowledge in modern software environments.' },
          { name: 'Problem Solving', weightOrScope: 'Analytical', scoreOrBand: '38% (Semi-Routine)', interpretation: 'Solves user and backlog challenges within established frameworks.' },
          { name: 'Accountability', weightOrScope: 'Contributory', scoreOrBand: 'D1C (Contributory)', interpretation: 'Contributes to module-level revenue and engagement metrics.' }
        ],
        rationale: 'Balanced profile with solid know-how and tactical operational accountability.',
        marketAlignmentNotes: 'Aligns with mid-level management/specialist bands in global enterprises.'
      },
      {
        frameworkId: 'mercer_ipe',
        frameworkName: 'Mercer IPE Position Evaluation',
        levelOrScore: 'IPE Class 50',
        dimensions: [
          { name: 'Impact', weightOrScope: 'Operational', scoreOrBand: 'Direct Contributor', interpretation: 'Delivers tangible software enhancements to end-users.' },
          { name: 'Innovation', weightOrScope: 'Conceptual', scoreOrBand: 'Adaptation', interpretation: 'Modifies workflows and tests novel variations to solve friction.' }
        ],
        rationale: 'Direct contributor to organizational unit goals.',
        marketAlignmentNotes: 'Mercer Class 50 corresponds to typical tech enterprise product specialists.'
      },
      {
        frameworkId: 'wtw_ggs',
        frameworkName: 'WTW Global Grading System',
        levelOrScore: 'WTW Grade 10',
        dimensions: [
          { name: 'Functional Knowledge', weightOrScope: 'Broad', scoreOrBand: 'Level 3', interpretation: 'Broad expertise across user workflows and product tools.' },
          { name: 'Business Expertise', weightOrScope: 'Unit', scoreOrBand: 'Level 2', interpretation: 'Understands how squad features influence business outcomes.' }
        ],
        rationale: 'Professional ladder grade 10 with established autonomy.',
        marketAlignmentNotes: 'Accords with competitive mid-level SaaS talent pools.'
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band Method',
        levelOrScore: 'Band C (Process Decisions)',
        dimensions: [
          { name: 'Decision Band', weightOrScope: 'Operational', scoreOrBand: 'Band C (Process)', interpretation: 'Chooses how to execute defined objectives and optimize team workflows.' }
        ],
        rationale: 'Operates in Band C with freedom to select methods and prioritize within assigned goals.',
        marketAlignmentNotes: 'Standard band for autonomous product specialists.'
      }
    ],
    competencies: [
      { id: 'comp-prd-authoring', name: 'Product Specification & PRD Rigor', category: 'product', requiredLevel: 'advanced', description: 'Translating user needs into unambiguous technical requirements.' },
      { id: 'comp-backlog-grooming', name: 'Agile Backlog Prioritization', category: 'operational', requiredLevel: 'advanced', description: 'Continuous grooming and trade-off negotiation in sprint cycles.' },
      { id: 'comp-telemetry', name: 'Funnel Telemetry & Event Analytics', category: 'technical', requiredLevel: 'advanced', description: 'Querying and interpreting user event tracks to validate product adoption.' }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-product-manager',
        toRoleId: 'role-sr-product-manager',
        toRoleTitle: 'Senior Product Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 92,
        transferabilityLevel: 'Very High',
        skillOverlapPercentage: 88,
        skillOverlapItems: ['PRD authoring', 'Backlog prioritization', 'User research', 'Sprint execution'],
        skillGaps: ['Multi-squad roadmapping', 'Unit economics modeling', 'Executive stakeholder persuasion'],
        requiredExperience: 'Successful track record of leading a major multi-quarter launch.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Core career ladder progression with expanded organizational gravity.',
        recommendedPathway: ['Expand scope to mentor an associate PM', 'Own a multi-squad feature dependency', 'Lead an annual roadmap RFC']
      },
      {
        fromRoleId: 'role-product-manager',
        toRoleId: 'role-product-ops-mgr',
        toRoleTitle: 'Product Operations Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 82,
        transferabilityLevel: 'High',
        skillOverlapPercentage: 75,
        skillOverlapItems: ['Toolchain fluency', 'Voice-of-customer synthesis', 'Launch coordination'],
        skillGaps: ['Cross-org process governance', 'CS/Sales enablement at scale'],
        requiredExperience: 'Passion for scaling internal team productivity.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Accelerates organizational influence across dozens of product squads.',
        recommendedPathway: ['Standardize squad templates', 'Build cross-team release feedback loops']
      }
    ]
  },

  // 2. Product Owner (P3)
  {
    id: 'role-product-owner',
    title: 'Product Owner',
    jobFamily: 'Product Delivery & Agile Architecture',
    domain: 'Enterprise Applications & Digital Systems',
    roleFamilyCategory: 'product_business_ops',
    currentLevel: 'P3 (Mid-level)',
    targetLevel: 'P4 (Senior PO / Technical PM)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Maximizes the return on engineering investment by managing sprint backlogs, clarifying user stories, and serving as the definitive voice of customer and business stakeholders to the Scrum development team.',
    overview: 'The Product Owner acts as the crucial liaison between business stakeholders, strategic product management, and agile delivery engineering. Rather than high-level visionary roadmapping, the PO excels at decomposition, tactical trade-offs, and predictable execution.',
    coreResponsibilities: [
      'Create, maintain, and prioritize the team sprint backlog with high operational precision',
      'Elaborate epics and features into detailed, testable user stories with Gherkin acceptance criteria',
      'Participate actively in all Scrum ceremonies (Planning, Daily Standup, Review, Retrospective)',
      'Inspect work-in-progress and make real-time scope decisions during active sprints',
      'Validate delivered increments against compliance, security, and performance standards'
    ],
    scope: 'Directly accountable for 1-2 Scrum development teams and predictable bi-weekly increment delivery.',
    decisionRights: [
      'Acceptance or rejection of sprint increment work items',
      'Order of backlog items based on value, risk, and dependencies',
      'Sprint goal formulation in partnership with Scrum Master and Tech Lead'
    ],
    expectedImpact: 'High sprint velocity predictability, zero ambiguity in development tickets, and reduced rework from misaligned expectations.',
    typicalSeniority: '3 - 6 years of agile software delivery or technical analysis experience.',
    keySkills: [
      'Agile Backlog Grooming & Story Splitting',
      'Gherkin / BDD Acceptance Criteria',
      'Scrum Framework Mastery',
      'Stakeholder Expectation Management',
      'Technical Dependency Mapping',
      'Release Burn-up Tracking'
    ],
    businessKnowledge: ['Enterprise Workflow Automation', 'SLA & Uptime Governance', 'Regulatory Compliance Checklists'],
    technicalKnowledge: ['Database Schemas & ERDs', 'API Swagger/OpenAPI Specs', 'Test Automation Pyramids'],
    behavioralCompetencies: ['Decisiveness Under Pressure', 'Uncompromising Detail Orientation', 'Diplomacy & De-escalation'],
    toolsAndPlatforms: ['Jira Software', 'Azure DevOps', 'Confluence', 'Miro', 'Postman'],
    commonKpis: [
      { metric: 'Sprint Say/Do Ratio', targetBenchmark: '> 90% delivered against planned', importance: 'critical' },
      { metric: 'Story Defect Density', targetBenchmark: '< 2 defects per 100 story points', importance: 'critical' },
      { metric: 'Backlog Health Horizon', targetBenchmark: 'Ready backlog 3 sprints in advance', importance: 'primary' }
    ],
    typicalDeliverables: [
      { title: 'Refined Sprint Backlog & Acceptance Criteria', frequency: 'Weekly', purpose: 'Ensures zero blocking ambiguity for engineering sprint execution.' },
      { title: 'Sprint Review Demo & Stakeholder Release Notes', frequency: 'Bi-weekly', purpose: 'Showcases completed business increments to operational leadership.' }
    ],
    adjacentRoles: [
      { roleId: 'role-product-manager', roleTitle: 'Product Manager', overlapPercentage: 86, transferability: 'High', commonBridgeSkills: ['Backlog management', 'User stories', 'Stakeholder alignment'], notes: 'Natural lateral expansion by taking on market discovery and financial roadmapping.' },
      { roleId: 'role-tpm', roleTitle: 'Technical Program Manager', overlapPercentage: 78, transferability: 'High', commonBridgeSkills: ['Dependency tracking', 'Agile governance', 'Release management'], notes: 'Strong pivot if engineering architecture and schedule coordination are core strengths.' }
    ],
    careerProgression: {
      icTrack: ['Junior PO (P2)', 'Product Owner (P3)', 'Senior Product Owner (P4)', 'Principal PO / Delivery Architect (P5)'],
      managementTrack: ['Product Owner (P3)', 'Lead PO (M1)', 'Director of Agile Product Delivery (M2)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 3, proficiency: 'advanced', description: 'Deep mastery of agile ticket anatomy, acceptance criteria, and system interfaces.', evidencePrompt: 'Decomposed monolithic ERP integration into 24 incremental user stories.', rationale: 'Excellent tactical technical acumen.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 3, proficiency: 'advanced', description: 'Understands operational business logic and user compliance constraints.', evidencePrompt: 'Verified audit log requirements for healthcare data retention.', rationale: 'Translates policy into actionable engineering stories.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 3, proficiency: 'advanced', description: 'Manages complex dependencies across interconnected software modules.', evidencePrompt: 'Unblocked 3 conflicting squad dependencies ahead of major platform release.', rationale: 'High competence with operational dependencies.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 3, proficiency: 'advanced', description: 'Authority over sprint item acceptance and prioritization sequencing.', evidencePrompt: 'Rejected non-compliant feature PR until security credentials adhered to zero-trust.', rationale: 'Clear decision rights within squad scope.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 3, proficiency: 'advanced', description: 'Ensures quality and usability of daily software updates.', evidencePrompt: 'Streamlined approval queue reducing operational processing time by 28%.', rationale: 'Direct contributor to workflow efficiency.' },
      { key: 'business_impact', label: 'Business Impact', score: 3, proficiency: 'advanced', description: 'Reduces wasted engineering hours and prevents costly post-launch rollbacks.', evidencePrompt: 'Maintained 94% say/do predictability for 6 consecutive quarters.', rationale: 'Drives engineering cost-efficiency.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 4, proficiency: 'senior', description: 'Runs daily cadence and backlog machinery for multiple agile ceremonies.', evidencePrompt: 'Facilitated synchronized backlog grooming for 14 engineers.', rationale: 'Strong agile operational governance.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 3, proficiency: 'advanced', description: 'Balances continuous requests from sales, support, and business sponsors.', evidencePrompt: 'Created transparent intake matrix that eliminated competing ad-hoc requests.', rationale: 'Manages incoming pressure with structured prioritization.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 2, proficiency: 'working', description: 'Informs feature feasibility and capacity limits to portfolio managers.', evidencePrompt: 'Provided velocity metrics that guided realistic annual commitments.', rationale: 'Tactical execution influence.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 3, proficiency: 'advanced', description: 'Embodies accountability for what gets built and accepted.', evidencePrompt: 'Partnered with QA to establish automated test checklists before sprint sign-off.', rationale: 'Solid ownership of team output.' }
    ],
    levelMapping: {
      careerosInferredLevel: 'P3 — Agile Product Delivery Specialist',
      levelCode: 'P3',
      icEquivalent: 'Senior Product Owner (P4) / Delivery Architect (P5)',
      managementEquivalent: 'Lead PO (M1) / Agile Delivery Director (M2)',
      referenceFrameworkLevels: {
        aonRadford: 'P3 Professional',
        kornFerryHay: 'Hay 370 Points (Grade 14)',
        mercerIpe: 'IPE Class 49',
        wtwGgs: 'WTW Grade 10',
        patterson: 'Band C (Operational Coordination)'
      },
      scopeSummary: {
        roleScope: 'Agile execution and backlog management for 1-2 Scrum development teams.',
        decisionScope: 'Backlog item acceptance, ticket prioritization, and sprint scope control.',
        impactScope: 'Engineering velocity, increment quality, and business stakeholder satisfaction.',
        complexity: 'Moderate to high technical dependency management.',
        leadershipScope: 'Product leadership inside the Scrum triad (PO, SM, Tech Lead).'
      },
      evidenceRationale: [
        'Maintains high velocity predictability and zero ambiguity in story contracts.',
        'Operates with deep competence in agile delivery frameworks.',
        'Serves as the indispensable link between business ambition and technical realization.'
      ]
    },
    referenceEvaluations: [
      {
        frameworkId: 'careeros_native',
        frameworkName: 'CareerOS Native Evaluation',
        levelOrScore: 'P3 Equivalent (Score: 3.0 / 5.0)',
        dimensions: [
          { name: 'Operational Scope', weightOrScope: 'Cadence', scoreOrBand: '4 - Senior', interpretation: 'Exceptional agile process mastery and dependency management.' },
          { name: 'Functional Knowledge', weightOrScope: 'Execution', scoreOrBand: '3 - Advanced', interpretation: 'Precise story elaboration and acceptance testing.' }
        ],
        rationale: 'High operational leverage in engineering velocity and quality assurance.',
        marketAlignmentNotes: 'Standard enterprise PO grading across financial and corporate IT.'
      },
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Tech Leveling',
        levelOrScore: 'P3 (Professional)',
        dimensions: [
          { name: 'Level Code', weightOrScope: 'Standard', scoreOrBand: 'P3', interpretation: 'Applies full professional agile knowledge.' }
        ],
        rationale: 'Fully autonomous in managing backlog and cross-functional team delivery.',
        marketAlignmentNotes: 'Commonly benchmarked under Agile Delivery / Product Owner job families.'
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay System',
        levelOrScore: 'Grade 14 (370 Points)',
        dimensions: [
          { name: 'Know-How', weightOrScope: 'Specialized', scoreOrBand: 'EI2', interpretation: 'Specialized knowledge of software development lifecycle and business processes.' }
        ],
        rationale: 'Balanced technical-operational contributor.',
        marketAlignmentNotes: 'Standard mid-tier corporate grade.'
      },
      {
        frameworkId: 'mercer_ipe',
        frameworkName: 'Mercer IPE',
        levelOrScore: 'IPE Class 49',
        dimensions: [
          { name: 'Impact', weightOrScope: 'Direct', scoreOrBand: 'Team Deliverables', interpretation: 'Drives output of engineering squad.' }
        ],
        rationale: 'Direct impact on product delivery schedules and release predictability.',
        marketAlignmentNotes: 'Standard mid-level enterprise ranking.'
      },
      {
        frameworkId: 'wtw_ggs',
        frameworkName: 'WTW Global Grading',
        levelOrScore: 'WTW Grade 10',
        dimensions: [
          { name: 'Problem Solving', weightOrScope: 'Analytical', scoreOrBand: 'Level 3', interpretation: 'Resolves ambiguous requirements and dependency bottlenecks.' }
        ],
        rationale: 'Senior professional contributor in agile disciplines.',
        marketAlignmentNotes: 'Consistent with corporate IT standards.'
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Band',
        levelOrScore: 'Band C (Process Autonomy)',
        dimensions: [
          { name: 'Decision Authority', weightOrScope: 'Operational', scoreOrBand: 'Band C', interpretation: 'Selects execution pathways to achieve product backlog outcomes.' }
        ],
        rationale: 'High autonomy over procedural and sprint decisions.',
        marketAlignmentNotes: 'Exact fit for Agile Product Owner.'
      }
    ],
    competencies: [
      { id: 'comp-po-backlog', name: 'Backlog Decomposition & Sprint Ordering', category: 'operational', requiredLevel: 'advanced', description: 'Translating complex epics into clear, right-sized sprint stories.' },
      { id: 'comp-po-scrum', name: 'Scrum Ceremony Stewardship', category: 'core', requiredLevel: 'advanced', description: 'Guiding teams through sprint reviews, planning, and retrospectives.' }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-product-owner',
        toRoleId: 'role-product-manager',
        toRoleTitle: 'Product Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 88,
        transferabilityLevel: 'Very High',
        skillOverlapPercentage: 85,
        skillOverlapItems: ['Story writing', 'Prioritization', 'Sprint execution', 'User empathy'],
        skillGaps: ['Customer market research', 'Pricing & packaging', 'Strategic roadmap narratives'],
        requiredExperience: 'Exposure to customer problem discovery before requirements are pre-defined.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Transitions from reactive execution to proactive market strategy.',
        recommendedPathway: ['Participate in customer discovery calls', 'Build a business case for a prospective product line']
      }
    ]
  },

  // 3. Growth Product Manager (P4)
  {
    id: 'role-growth-product-mgr',
    title: 'Growth Product Manager',
    jobFamily: 'Product Management',
    domain: 'Product-Led Growth (PLG) & Growth Loops',
    roleFamilyCategory: 'product',
    currentLevel: 'P4 (Senior)',
    targetLevel: 'P5 (Staff Growth PM / Head of Growth)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Drives compounding top-of-funnel acquisition, activation velocity, monetized expansion, and referral loops through scientific experimentation, data analytics, and friction removal.',
    overview: 'Growth Product Managers bridge the divide between Product, Marketing, and Data Science. Instead of building brand-new functional modules, they treat the entire user journey as an algorithmic engine—optimizing time-to-value, virality, self-serve upgrades, and retention curves.',
    coreResponsibilities: [
      'Design and manage high-tempo growth experimentation programs across signup, onboarding, and upgrade flows',
      'Model acquisition funnels and cohort retention curves to identify friction points and expansion leverage',
      'Partner with Growth Marketing on organic acquisition, SEO surface loops, and paid conversion channels',
      'Implement multi-variant A/B tests with statistical rigor and automated sample size monitoring',
      'Optimize self-serve checkout, paywall gating, feature limits, and tier transition points'
    ],
    scope: 'Owns user activation and self-serve monetization metrics across the entire consumer/SMB user base.',
    decisionRights: [
      'Onboarding flow variations and friction elimination tests',
      'Paywall placement, pricing display formats, and free trial trigger criteria',
      'Hypothesis acceptance criteria and early experiment termination calls'
    ],
    expectedImpact: 'Direct, measurable acceleration of Net Revenue Retention (NRR), self-serve Annual Recurring Revenue (ARR), and free-to-paid conversion rates.',
    typicalSeniority: '5 - 8 years of data-intensive product management or growth engineering experience.',
    keySkills: [
      'Statistical A/B Testing & Causal Inference',
      'Funnel Telemetry (Amplitude, Mixpanel, SQL)',
      'Product-Led Growth (PLG) Architecture',
      'Viral Loops & Referral Mechanics',
      'Conversion Rate Optimization (CRO)',
      'Behavioral Psychology & Nudge Design'
    ],
    businessKnowledge: ['SaaS Monetization & Tiering', 'LTV/CAC Ratios & Payback Periods', 'Cohort Churn Decomposition'],
    technicalKnowledge: ['Experimentation Frameworks (Statsig, LaunchDarkly)', 'SQL & dbt Data Modeling', 'Frontend Web Performance'],
    behavioralCompetencies: ['Obsessive Quantitative Curiosity', 'Rapid Experimentation Cadence', 'Intellectual Honesty in Failure'],
    toolsAndPlatforms: ['Amplitude', 'Statsig', 'Looker', 'Figma', 'Segment', 'SQL', 'PostHog'],
    commonKpis: [
      { metric: 'Free-to-Paid Conversion Rate', targetBenchmark: '> 4.5% across organic cohorts', importance: 'critical' },
      { metric: 'Day-30 Cohort Retention', targetBenchmark: '> 42% benchmark in SaaS', importance: 'critical' },
      { metric: 'Experimentation Velocity', targetBenchmark: '> 6 concurrent production tests weekly', importance: 'primary' }
    ],
    typicalDeliverables: [
      { title: 'Growth Experimentation Hypothesis Brief', frequency: 'Weekly', purpose: 'Articulates hypothesis, statistical power calculations, and test variants.' },
      { title: 'Monthly Cohort & Monetization Deep Dive', frequency: 'Monthly', purpose: 'Synthesizes cohort retention dynamics and revenue expansion drivers.' }
    ],
    adjacentRoles: [
      { roleId: 'role-sr-product-manager', roleTitle: 'Senior Product Manager', overlapPercentage: 84, transferability: 'High', commonBridgeSkills: ['Roadmapping', 'User psychology', 'Telemetry'], notes: 'Direct lateral sibling; pivots easily to core product domain leadership.' },
      { roleId: 'role-product-marketing-mgr', roleTitle: 'Product Marketing Manager', overlapPercentage: 76, transferability: 'High', commonBridgeSkills: ['Positioning', 'Funnel messaging', 'Customer segmentation'], notes: 'Complementary commercial focus on value messaging and persona enablement.' }
    ],
    careerProgression: {
      icTrack: ['Growth PM (P3)', 'Senior Growth PM (P4)', 'Staff Growth PM (P5)', 'Principal Growth Architect (P6)'],
      managementTrack: ['Senior Growth PM (P4)', 'Group PM - Growth (M1)', 'Head of Growth / VP of Growth (M2/M3)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 4, proficiency: 'senior', description: 'Advanced mastery of analytics, behavioral funnels, and statistical A/B test methodologies.', evidencePrompt: 'Constructed custom multi-touch attribution and causal inference model in SQL.', rationale: 'World-class quantitative growth toolkit.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 5, proficiency: 'strategic', description: 'Expert in SaaS unit economics, payback periods, pricing tiers, and revenue expansion loops.', evidencePrompt: 'Restructured freemium limits resulting in a 24% boost in self-serve upgrade velocity.', rationale: 'Direct P&L and commercial monetization acumen.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 4, proficiency: 'senior', description: 'Dissects complex user behavioral drop-offs and models non-linear retention dynamics.', evidencePrompt: 'Pinpointed silent drop-off in enterprise OAuth onboarding affecting 18% of signups.', rationale: 'Excels at needle-in-haystack quantitative problem spaces.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 4, proficiency: 'senior', description: 'Autonomous authority over experimentation roadmaps and friction removal deployments.', evidencePrompt: 'Killed 4 inconclusive experiments early to redirect engineering bandwidth to high-conviction loop.', rationale: 'Decisive experimentation governance.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 4, proficiency: 'senior', description: 'Transforms user onboarding and makes complex applications self-explanatory.', evidencePrompt: 'Reduced user time-to-first-value (TTFV) from 42 minutes to 6 minutes.', rationale: 'Huge impact on user activation experience.' },
      { key: 'business_impact', label: 'Business Impact', score: 5, proficiency: 'strategic', description: 'Directly moves revenue needle through conversion lift, self-serve ARR, and churn mitigation.', evidencePrompt: 'Delivered $3.1M in incremental self-serve ARR over a 12-month period.', rationale: 'Clear, attributable commercial outcomes.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 4, proficiency: 'senior', description: 'Runs rapid-cadence growth squad comprising engineers, data analysts, and copywriters.', evidencePrompt: 'Maintained 8 experiments per week cadence with zero platform regressions.', rationale: 'High-tempo agile operational tempo.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 4, proficiency: 'senior', description: 'Coordinates across Marketing, Sales Operations, Data Science, and Executive leadership.', evidencePrompt: 'Aligned Growth Marketing and Core Product leads on unified user attribution schema.', rationale: 'Operates smoothly across cross-functional silos.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 4, proficiency: 'senior', description: 'Shapes corporate growth models and informs company-wide revenue forecasts.', evidencePrompt: 'Board deck growth teardown adopted as foundation for Series C expansion bets.', rationale: 'Elevated strategic presence.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 4, proficiency: 'senior', description: 'Takes unconditional accountability for conversion and retention targets.', evidencePrompt: 'Led cross-department growth task force during revenue plateau and restored trajectory.', rationale: 'High agency and resilience.' }
    ],
    levelMapping: {
      careerosInferredLevel: 'P4 — Senior Growth & Monetization Specialist',
      levelCode: 'P4',
      icEquivalent: 'Staff Growth PM (P5) / Principal Growth Architect (P6)',
      managementEquivalent: 'Group PM - Growth (M1) / Head of Growth (M2)',
      referenceFrameworkLevels: {
        aonRadford: 'P4 (Senior Professional)',
        kornFerryHay: 'Hay 480 Points (Grade 16)',
        mercerIpe: 'IPE Class 53',
        wtwGgs: 'WTW Grade 12',
        patterson: 'Band D (Interpretive / Strategic Execution)'
      },
      scopeSummary: {
        roleScope: 'End-to-end user lifecycle optimization, self-serve monetization, and growth loops.',
        decisionScope: 'Experiment prioritization, paywall trigger placements, and onboarding UX.',
        impactScope: 'Company-wide conversion rates, cohort retention, and self-serve ARR growth.',
        complexity: 'High; combines behavioral psychology, statistical modeling, and engineering velocity.',
        leadershipScope: 'Growth squad lead and cross-functional influencer across Marketing and Product.'
      },
      evidenceRationale: [
        'Drives measurable millions in incremental top-line self-serve ARR.',
        'Operates with mathematical and statistical rigor in A/B experimentation.',
        'Transforms product friction into frictionless self-reinforcing adoption loops.'
      ]
    },
    referenceEvaluations: [
      {
        frameworkId: 'careeros_native',
        frameworkName: 'CareerOS Native Evaluation',
        levelOrScore: 'P4 Equivalent (Score: 4.2 / 5.0)',
        dimensions: [
          { name: 'Business Impact', weightOrScope: 'Revenue', scoreOrBand: '5 - Strategic', interpretation: 'Direct driver of self-serve recurring revenue.' },
          { name: 'Functional Knowledge', weightOrScope: 'Analytics', scoreOrBand: '4 - Senior', interpretation: 'Exceptional data science, PLG, and experimentation expertise.' }
        ],
        rationale: 'High-impact specialized senior product strategist combining data, engineering, and commercial acumen.',
        marketAlignmentNotes: 'Top-tier tech standard for Senior Growth Product Managers.'
      },
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Tech Leveling',
        levelOrScore: 'P4 (Senior Professional)',
        dimensions: [
          { name: 'Impact Scope', weightOrScope: 'Senior', scoreOrBand: 'P4', interpretation: 'Works independently on high-impact revenue-driving product systems.' }
        ],
        rationale: 'Solves complex funnel optimization challenges requiring interdisciplinary expertise.',
        marketAlignmentNotes: 'Benchmark match under Product Management - Growth.'
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay System',
        levelOrScore: 'Grade 16 (480 Points)',
        dimensions: [
          { name: 'Accountability', weightOrScope: 'High', scoreOrBand: 'E2S', interpretation: 'Significant impact on business revenue and customer conversion.' }
        ],
        rationale: 'Recognized for high accountability and measurable commercial contribution.',
        marketAlignmentNotes: 'Senior professional grade in global tech.'
      },
      {
        frameworkId: 'mercer_ipe',
        frameworkName: 'Mercer IPE',
        levelOrScore: 'IPE Class 53',
        dimensions: [
          { name: 'Innovation', weightOrScope: 'Continuous', scoreOrBand: 'Breakthrough Tests', interpretation: 'Deploys novel behavioral mechanisms to unlock growth.' }
        ],
        rationale: 'Combines conceptual innovation with immediate quantitative feedback.',
        marketAlignmentNotes: 'High-grade individual contributor.'
      },
      {
        frameworkId: 'wtw_ggs',
        frameworkName: 'WTW Global Grading',
        levelOrScore: 'WTW Grade 12',
        dimensions: [
          { name: 'Business Expertise', weightOrScope: 'SaaS Unit Economics', scoreOrBand: 'Level 4', interpretation: 'Deep command of growth models and monetization dynamics.' }
        ],
        rationale: 'Senior professional with broad commercial and analytical reach.',
        marketAlignmentNotes: 'Aligns with senior tech benchmarks.'
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band',
        levelOrScore: 'Band D (Strategic / Interpretive Execution)',
        dimensions: [
          { name: 'Decision Complexity', weightOrScope: 'Strategic', scoreOrBand: 'Band D', interpretation: 'Interprets broad revenue objectives into concrete product growth interventions.' }
        ],
        rationale: 'Acts with broad authority on experimentation hypotheses and user experience trade-offs.',
        marketAlignmentNotes: 'Exact calibration for growth product leads.'
      }
    ],
    competencies: [
      { id: 'comp-growth-ab-testing', name: 'Hypothesis Design & Causal A/B Testing', category: 'technical', requiredLevel: 'senior', description: 'Designing experiments with statistical power, sample sizing, and bias mitigation.' },
      { id: 'comp-growth-plg-loops', name: 'Product-Led Growth (PLG) Architecture', category: 'product', requiredLevel: 'senior', description: 'Building organic viral and referral mechanics into core user workflows.' },
      { id: 'comp-growth-monetization', name: 'Self-Serve Monetization Optimization', category: 'business', requiredLevel: 'senior', description: 'Optimizing checkout friction, paywalls, and packaging upgrade paths.' }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-growth-product-mgr',
        toRoleId: 'role-sr-product-manager',
        toRoleTitle: 'Senior Product Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 89,
        transferabilityLevel: 'Very High',
        skillOverlapPercentage: 84,
        skillOverlapItems: ['Roadmapping', 'User psychology', 'Telemetry', 'Agile delivery'],
        skillGaps: ['Deep technical architecture trade-offs', 'Long-term foundational platform bets'],
        requiredExperience: 'Desire to build core features and deep system capabilities beyond optimization.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Brings obsessive data-driven rigor to foundational product development.',
        recommendedPathway: ['Partner on a 0-to-1 core product initiative', 'Deepen understanding of backend microservices constraints']
      }
    ]
  },

  // 4. Product Marketing Manager (P4)
  {
    id: 'role-product-marketing-mgr',
    title: 'Product Marketing Manager',
    jobFamily: 'Product Marketing & Commercialization',
    domain: 'B2B Tech GTM & Positioning Strategy',
    roleFamilyCategory: 'product_business_ops',
    currentLevel: 'P4 (Senior)',
    targetLevel: 'P5 (Staff PMM / Lead Product Marketer)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Owns product positioning, value proposition messaging, competitive intelligence, Go-To-Market (GTM) launches, and sales enablement across the commercial lifecycle.',
    overview: 'Senior Product Marketing Managers translate technical product capabilities into compelling business narratives that resonate with buyers, users, and market analysts. They define buyer personas, orchestrate tier-1 launches, and equip sales teams with battlecards and ROI calculators.',
    coreResponsibilities: [
      'Define differentiated value positioning and core messaging hierarchy for product lines',
      'Orchestrate cross-functional tier-1 Go-To-Market launches across Sales, Marketing, and PR',
      'Conduct rigorous competitive intelligence teardowns and create actionable sales battlecards',
      'Interview enterprise buyers to map procurement criteria and pain triggers',
      'Build sales enablement collateral (pitch decks, demo scripts, one-pagers, ROI business cases)'
    ],
    scope: 'Covers commercial Go-To-Market and narrative positioning for 1-2 major product pillars.',
    decisionRights: [
      'Product messaging and public-facing value proposition approval',
      'Launch tier classification and external release sequencing',
      'Persona definitions and primary buyer target segmentation'
    ],
    expectedImpact: 'Higher sales win rates against competitors, accelerated deal velocity, and press/analyst recognition (Gartner, Forrester).',
    typicalSeniority: '5 - 8 years in B2B product marketing, strategy, or commercial product management.',
    keySkills: [
      'Product Positioning & Messaging Hierarchies',
      'Competitive Intelligence & Battlecard Design',
      'Tier-1 Go-To-Market (GTM) Orchestration',
      'Sales Enablement & Field Collateral',
      'Win/Loss Analysis & Buyer Interviews',
      'Analyst Relations (Gartner, Forrester)'
    ],
    businessKnowledge: ['Enterprise Procurement Cycles', 'B2B Sales Methodologies (MEDDPICC)', 'Pricing & Packaging Packaging'],
    technicalKnowledge: ['Product Architecture Fluency', 'API Capabilities vs Marketing Claims', 'Security & Compliance Value Drivers'],
    behavioralCompetencies: ['Narrative Synthesis', 'Executive Presence & Storytelling', 'Cross-Functional Diplomatic Influence'],
    toolsAndPlatforms: ['Klue', 'Crayon', 'Highspot', 'Gong', 'Figma', 'Salesforce', 'HubSpot'],
    commonKpis: [
      { metric: 'Competitive Win Rate', targetBenchmark: '> 60% in targeted competitor bake-offs', importance: 'critical' },
      { metric: 'Sales Enablement Content Adoption', targetBenchmark: '> 75% sales rep utilization', importance: 'primary' },
      { metric: 'Pipeline Generated from Launch', targetBenchmark: '> $5M qualified pipeline in 90 days', importance: 'primary' }
    ],
    typicalDeliverables: [
      { title: 'Product Positioning & Messaging Guide', frequency: 'Quarterly', purpose: 'Standardizes value pillars, proof points, and elevator pitches across company.' },
      { title: 'Competitive Battlecard Teardown', frequency: 'Bi-monthly', purpose: 'Equips sales reps with landmine questions, rebuttal scripts, and feature matrices.' }
    ],
    adjacentRoles: [
      { roleId: 'role-sr-product-manager', roleTitle: 'Senior Product Manager', overlapPercentage: 79, transferability: 'High', commonBridgeSkills: ['Persona research', 'Feature prioritization', 'Market sizing'], notes: 'Natural pivot if deep interest in technical discovery and execution exists.' },
      { roleId: 'role-growth-product-mgr', roleTitle: 'Growth Product Manager', overlapPercentage: 74, transferability: 'High', commonBridgeSkills: ['Funnel conversion', 'Messaging tests', 'User segmentation'], notes: 'Direct synergy on activation and customer messaging.' }
    ],
    careerProgression: {
      icTrack: ['Product Marketing Specialist (P3)', 'Senior PMM (P4)', 'Staff PMM (P5)', 'Principal Market Strategist (P6)'],
      managementTrack: ['Senior PMM (P4)', 'Head of Product Marketing (M1)', 'VP of Marketing & Strategy (M2)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 4, proficiency: 'senior', description: 'Deep fluency in positioning, narrative architectures, and GTM mechanics.', evidencePrompt: 'Authored positioning document that established new category category leadership.', rationale: 'Mastery of commercial communication.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 4, proficiency: 'senior', description: 'Comprehensive understanding of B2B sales cycles, MEDDPICC qualification, and competitive dynamics.', evidencePrompt: 'Conducted 30 win/loss interviews to redesign sales objection playbook.', rationale: 'Strong market and commercial acumen.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 4, proficiency: 'senior', description: 'Synthesizes highly technical software capabilities into simple, differentiated executive benefits.', evidencePrompt: 'Distilled complex distributed database architecture into 3 clear business ROI pillars.', rationale: 'Excellent abstraction and narrative simplification.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 4, proficiency: 'senior', description: 'Authority over public narrative, launch tiers, and field enablement materials.', evidencePrompt: 'Decided to delay launch by 2 weeks to align analyst embargoes, yielding 4 tier-1 press features.', rationale: 'Decisive commercial gatekeeper.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 4, proficiency: 'senior', description: 'Shapes customer perception and ensures buyers understand real business value.', evidencePrompt: 'Clarified onboarding copy resulting in 19% increase in feature discovery.', rationale: 'Influences customer comprehension and trust.' },
      { key: 'business_impact', label: 'Business Impact', score: 4, proficiency: 'senior', description: 'Directly moves win rates, pipeline velocity, and enterprise deal sizes.', evidencePrompt: 'Enabled $6.4M in closed-won enterprise ACV through targeted sales battlecards.', rationale: 'Direct commercial revenue catalyst.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 4, proficiency: 'senior', description: 'Orchestrates synchronized multi-team launches across 5 distinct departments.', evidencePrompt: 'Managed 60-person launch war room encompassing Demand Gen, Sales, PR, and Product.', rationale: 'High cross-functional orchestration capability.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 5, proficiency: 'strategic', description: 'Navigates high-friction interfaces between Engineering, Sales leadership, and Executive PR.', evidencePrompt: 'Mediated dispute between VP of Sales and Head of Product over launch feature readiness.', rationale: 'Diplomatic linchpin of the commercial organization.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 4, proficiency: 'senior', description: 'Informs product roadmap by surfacing unaddressed competitive gaps and buyer demands.', evidencePrompt: 'PMM market analysis directly motivated $2M engineering investment in SOC-2 compliance.', rationale: 'High influence on product prioritization.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 4, proficiency: 'senior', description: 'Acts as general manager of the product launch experience.', evidencePrompt: 'Volunteered to train 120 global sales reps across 3 regional bootcamps.', rationale: 'Outstanding commercial leadership.' }
    ],
    levelMapping: {
      careerosInferredLevel: 'P4 — Senior Product Marketing & Commercial Strategist',
      levelCode: 'P4',
      icEquivalent: 'Staff PMM (P5) / Principal Market Strategist (P6)',
      managementEquivalent: 'Head of Product Marketing (M1) / VP of Marketing (M2)',
      referenceFrameworkLevels: {
        aonRadford: 'P4 (Senior Professional)',
        kornFerryHay: 'Hay 470 Points (Grade 16)',
        mercerIpe: 'IPE Class 52',
        wtwGgs: 'WTW Grade 12',
        patterson: 'Band D (Strategic Narrative Execution)'
      },
      scopeSummary: {
        roleScope: 'Go-To-Market strategy, positioning, competitive intelligence, and field enablement.',
        decisionScope: 'Messaging hierarchies, launch tier classification, and collateral sign-off.',
        impactScope: 'Sales win rates, qualified pipeline generation, and market category leadership.',
        complexity: 'High; requires technical comprehension combined with persuasive commercial storytelling.',
        leadershipScope: 'Launch commander across Marketing, Sales, Product, and Analyst Relations.'
      },
      evidenceRationale: [
        'Drives measurable pipeline acceleration and competitive win rates.',
        'Translates intricate tech architectures into crisp executive value propositions.',
        'Orchestrates flawless multi-functional GTM launch execution.'
      ]
    },
    referenceEvaluations: [
      {
        frameworkId: 'careeros_native',
        frameworkName: 'CareerOS Native Evaluation',
        levelOrScore: 'P4 Equivalent (Score: 4.1 / 5.0)',
        dimensions: [
          { name: 'Stakeholder Complexity', weightOrScope: 'Cross-Org', scoreOrBand: '5 - Strategic', interpretation: 'Unmatched diplomacy across Sales, Engineering, and Exec teams.' },
          { name: 'Business Impact', weightOrScope: 'Revenue', scoreOrBand: '4 - Senior', interpretation: 'Direct catalyst for sales pipeline and competitive win rates.' }
        ],
        rationale: 'Senior strategic role serving as the commercial catalyst for technical software platforms.',
        marketAlignmentNotes: 'Senior PMM benchmark across enterprise SaaS leaders.'
      },
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Tech Leveling',
        levelOrScore: 'P4 (Senior Professional)',
        dimensions: [
          { name: 'Level Code', weightOrScope: 'Standard', scoreOrBand: 'P4', interpretation: 'Seasoned individual contributor leading GTM strategy.' }
        ],
        rationale: 'Autonomous in developing market positioning and driving major commercial releases.',
        marketAlignmentNotes: 'Standard market mapping under Product Marketing job family.'
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay System',
        levelOrScore: 'Grade 16 (470 Points)',
        dimensions: [
          { name: 'Know-How', weightOrScope: 'Specialized', scoreOrBand: 'EI3', interpretation: 'Comprehensive knowledge of commercial marketing and software positioning.' }
        ],
        rationale: 'Recognized for high specialized know-how and communication impact.',
        marketAlignmentNotes: 'Standard senior corporate grade.'
      },
      {
        frameworkId: 'mercer_ipe',
        frameworkName: 'Mercer IPE',
        levelOrScore: 'IPE Class 52',
        dimensions: [
          { name: 'Communication', weightOrScope: 'External', scoreOrBand: 'Negotiation & Influence', interpretation: 'Influences external analysts, press, and enterprise buyers.' }
        ],
        rationale: 'High communication and conceptual innovation profile.',
        marketAlignmentNotes: 'Top-bracket professional contributor.'
      },
      {
        frameworkId: 'wtw_ggs',
        frameworkName: 'WTW Global Grading',
        levelOrScore: 'WTW Grade 12',
        dimensions: [
          { name: 'Interpersonal Skills', weightOrScope: 'Broad', scoreOrBand: 'Level 4', interpretation: 'Persuades senior stakeholders across diverse functional silos.' }
        ],
        rationale: 'Senior contributor grade 12 in marketing strategy.',
        marketAlignmentNotes: 'Accords with competitive enterprise benchmarks.'
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band',
        levelOrScore: 'Band D (Interpretive / Strategic Narrative)',
        dimensions: [
          { name: 'Decision Authority', weightOrScope: 'Commercial', scoreOrBand: 'Band D', interpretation: 'Interprets strategic product goals into customer-facing narratives and field tactics.' }
        ],
        rationale: 'Full discretion over messaging strategy and launch playbooks.',
        marketAlignmentNotes: 'Exact fit for Senior Product Marketing Manager.'
      }
    ],
    competencies: [
      { id: 'comp-pmm-positioning', name: 'Strategic Positioning & Narrative Framing', category: 'product', requiredLevel: 'senior', description: 'Defining differentiated category messaging that cuts through market noise.' },
      { id: 'comp-pmm-gtm', name: 'Tier-1 Go-To-Market Orchestration', category: 'operational', requiredLevel: 'senior', description: 'Coordinating cross-functional launches with predictable timing and pipeline impact.' },
      { id: 'comp-pmm-enablement', name: 'Sales Enablement & Battlecard Design', category: 'business', requiredLevel: 'senior', description: 'Equipping sales teams with scripts, objection handling, and competitor teardowns.' }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-product-marketing-mgr',
        toRoleId: 'role-sr-product-manager',
        toRoleTitle: 'Senior Product Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 82,
        transferabilityLevel: 'High',
        skillOverlapPercentage: 78,
        skillOverlapItems: ['Persona research', 'Feature value synthesis', 'Roadmap inputs'],
        skillGaps: ['Engineering sprint management', 'API contracts and data schema specs'],
        requiredExperience: 'Direct experience writing technical requirements and managing sprint trade-offs.',
        estimatedTransitionDifficulty: 'Moderate',
        strategicValue: 'Creates an extraordinarily commercially-astute Product Manager.',
        recommendedPathway: ['Shadow engineering sprint grooming sessions', 'Author a technical PRD under Senior PM mentorship']
      }
    ]
  },

  // 5. Solutions Engineer (P3)
  {
    id: 'role-solutions-engineer',
    title: 'Solutions Engineer',
    jobFamily: 'Pre-Sales & Technical Solutions',
    domain: 'Enterprise Cloud & API Integrations',
    roleFamilyCategory: 'hybrid_cross_functional',
    currentLevel: 'P3 (Mid-level)',
    targetLevel: 'P4 (Senior Solutions Engineer / Solutions Architect)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Acts as the technical authority during the pre-sales cycle, building proof-of-concept (PoC) integrations, conducting deep-dive demos, and removing architectural technical blockers for prospective enterprise customers.',
    overview: 'Solutions Engineers combine software engineering chops with client-facing empathy. They partner closely with Account Executives to understand customer architecture, design custom integration prototypes, address security questionnaires, and guarantee technical win rates.',
    coreResponsibilities: [
      'Deliver tailored, interactive technical product demonstrations to prospective CTOs and engineers',
      'Build rapid proof-of-concept (PoC) integrations using modern APIs, SDKs, and webhook pipelines',
      'Answer in-depth enterprise security, compliance, data residency, and scalability questionnaires',
      'Translate prospective customer technical requirements into feedback loops for core Product & Engineering',
      'Support post-sale onboarding handoffs to ensure customer architecture adheres to best practices'
    ],
    scope: 'Covers technical sales engagements across 15-25 active enterprise deal cycles concurrently.',
    decisionRights: [
      'Technical feasibility sign-off for custom enterprise integration commitments',
      'Proof-of-concept scope boundaries and sandbox demonstration configurations',
      'Selection of reference code samples and integration architecture recommendations'
    ],
    expectedImpact: 'High technical win rates (> 80%), shortened enterprise sales cycles, and seamless handoff to implementation teams.',
    typicalSeniority: '3 - 6 years of software engineering, technical support, or pre-sales engineering experience.',
    keySkills: [
      'Interactive Technical Demonstrations',
      'Rapid API & Webhook Prototyping (Python, TypeScript)',
      'Enterprise Architecture Consultation',
      'Pre-Sales Technical Qualification',
      'Security Questionnaire Resolution',
      'Executive Technical Storytelling'
    ],
    businessKnowledge: ['B2B Sales Cycles & Annual Contract Value (ACV)', 'Enterprise Procurement Dynamics', 'SLA Contracts'],
    technicalKnowledge: ['REST, GraphQL, and Webhook Architecture', 'Cloud Infrastructure (AWS, GCP, Azure)', 'OAuth 2.0 & SAML/SSO'],
    behavioralCompetencies: ['Active Listening Under Technical Scrutiny', 'Composure in High-Stakes Demos', 'Customer Empathy'],
    toolsAndPlatforms: ['Postman', 'Docker', 'GitHub', 'Salesforce', 'Gong', 'AWS/GCP Console', 'VS Code'],
    commonKpis: [
      { metric: 'Technical Win Rate', targetBenchmark: '> 80% on qualified opportunities', importance: 'critical' },
      { metric: 'PoC Completion Velocity', targetBenchmark: '< 14 days to technical sign-off', importance: 'critical' },
      { metric: 'Influenced ACV Quota', targetBenchmark: '> 100% quota attainment annually', importance: 'primary' }
    ],
    typicalDeliverables: [
      { title: 'Custom Proof-of-Concept Integration Sandbox', frequency: 'Bi-weekly', purpose: 'Proves technical viability and performance to customer engineering evaluators.' },
      { title: 'Technical Architecture & Solution Blueprint Document', frequency: 'Weekly', purpose: 'Outlines data flows, authentication, and API endpoints for customer IT.' }
    ],
    adjacentRoles: [
      { roleId: 'role-solutions-architect', roleTitle: 'Solutions Architect', overlapPercentage: 88, transferability: 'High', commonBridgeSkills: ['Cloud architecture', 'API design', 'Client consultation'], notes: 'Direct vertical progression towards post-sale enterprise governance and systems scale.' },
      { roleId: 'role-tech-product-mgr', roleTitle: 'Technical Product Manager', overlapPercentage: 78, transferability: 'High', commonBridgeSkills: ['API contracts', 'Customer pain translation', 'System architecture'], notes: 'Excellent pivot for SEs who want to build the core platform rather than sell it.' }
    ],
    careerProgression: {
      icTrack: ['Associate SE (P2)', 'Solutions Engineer (P3)', 'Senior Solutions Engineer (P4)', 'Staff Solutions Engineer (P5)'],
      managementTrack: ['Solutions Engineer (P3)', 'Manager, Solutions Engineering (M1)', 'Director of Pre-Sales & Solutions (M2)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 4, proficiency: 'senior', description: 'Strong coding, debugging, and API integration capabilities across multiple stacks.', evidencePrompt: 'Built custom Python/Node middleware integration in 48 hours to win $250k ACV deal.', rationale: 'Excellent hands-on technical agility.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 3, proficiency: 'advanced', description: 'Understands enterprise deal mechanics, procurement friction, and ROI justification.', evidencePrompt: 'Helped account executive build TCO model demonstrating $400k annual savings.', rationale: 'Solid commercial literacy.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 4, proficiency: 'senior', description: 'Diagnoses complex legacy customer system architectures and designs clean integration bridges.', evidencePrompt: 'Designed real-time webhook bridge overcoming customer firewall restriction.', rationale: 'High agility with non-standard technical environments.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 3, proficiency: 'advanced', description: 'Authority to commit technical feasibility and PoC scope during negotiations.', evidencePrompt: 'Refused out-of-scope custom build request to prevent post-sale delivery catastrophe.', rationale: 'Protective and prudent technical decision rights.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 4, proficiency: 'senior', description: 'Instills confidence in prospective enterprise customers and unblocks adoption.', evidencePrompt: 'Customer VP of Eng cited SE demo as decisive factor in selecting platform over competitor.', rationale: 'Direct impact on customer trust and adoption.' },
      { key: 'business_impact', label: 'Business Impact', score: 4, proficiency: 'senior', description: 'Direct contributor to revenue pipeline, technical wins, and enterprise ACV.', evidencePrompt: 'Directly supported $4.8M in closed-won new logo ACV across fiscal year.', rationale: 'Essential revenue engine contributor.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 3, proficiency: 'advanced', description: 'Manages concurrent PoC timelines, demo environments, and customer follow-ups.', evidencePrompt: 'Maintained 18 concurrent deal evaluations with zero missed technical SLAs.', rationale: 'Disciplined multi-deal operational cadence.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 4, proficiency: 'senior', description: 'Communicates seamlessly with customer developers, enterprise security officers, and sales reps.', evidencePrompt: 'Navigated tense technical audit with prospective customer Chief InfoSec Officer.', rationale: 'High versatility across technical and non-technical stakeholders.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 3, proficiency: 'advanced', description: 'Channels valuable enterprise market demands back into product roadmap prioritization.', evidencePrompt: 'Catalogued recurring enterprise SAML feature requests that prompted dedicated sprint.', rationale: 'Valuable feedback conduit for product management.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 3, proficiency: 'advanced', description: 'Takes complete ownership of the technical win in every deal cycle.', evidencePrompt: 'Created reusable Postman collection adopted by the entire global SE team.', rationale: 'Generous team contributor.' }
    ],
    levelMapping: {
      careerosInferredLevel: 'P3 — Technical Solutions Specialist',
      levelCode: 'P3',
      icEquivalent: 'Senior Solutions Engineer (P4) / Staff SE (P5)',
      managementEquivalent: 'Manager, Solutions Engineering (M1) / Director of Pre-Sales (M2)',
      referenceFrameworkLevels: {
        aonRadford: 'P3 Professional (Sales Engineering)',
        kornFerryHay: 'Hay 400 Points (Grade 14)',
        mercerIpe: 'IPE Class 50',
        wtwGgs: 'WTW Grade 10',
        patterson: 'Band C (Technical Interpretation & Process)'
      },
      scopeSummary: {
        roleScope: 'Technical pre-sales consultation and proof-of-concept delivery across 15-25 deals.',
        decisionScope: 'Integration architecture recommendations and technical feasibility validation.',
        impactScope: 'Enterprise technical win rate, sales cycle velocity, and new ACV bookings.',
        complexity: 'Moderate to high; requires real-time problem-solving across heterogeneous client tech stacks.',
        leadershipScope: 'Technical co-pilot alongside Account Executives; team knowledge sharer.'
      },
      evidenceRationale: [
        'Consistently achieves > 80% technical win rate across complex client evaluations.',
        'Prototypes functional API bridges rapidly to prove architectural viability.',
        'Seamlessly translates intricate security protocols to client executive leadership.'
      ]
    },
    referenceEvaluations: [
      {
        frameworkId: 'careeros_native',
        frameworkName: 'CareerOS Native Evaluation',
        levelOrScore: 'P3 Equivalent (Score: 3.5 / 5.0)',
        dimensions: [
          { name: 'Functional Knowledge', weightOrScope: 'Technical', scoreOrBand: '4 - Senior', interpretation: 'Hands-on API, cloud, and security integration fluency.' },
          { name: 'Business Impact', weightOrScope: 'Revenue', scoreOrBand: '4 - Senior', interpretation: 'Direct driver of enterprise closed-won ACV.' }
        ],
        rationale: 'High-value hybrid technical sales specialist bridging code and commercial enterprise growth.',
        marketAlignmentNotes: 'Standard market grading across SaaS pre-sales engineering.'
      },
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Tech Leveling',
        levelOrScore: 'P3 (Professional)',
        dimensions: [
          { name: 'Level Code', weightOrScope: 'Standard', scoreOrBand: 'P3', interpretation: 'Experienced pre-sales technical professional.' }
        ],
        rationale: 'Exercises independent technical discretion on client demo and PoC configurations.',
        marketAlignmentNotes: 'Mapped under Technical Sales / Solutions Engineering.'
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay System',
        levelOrScore: 'Grade 14 (400 Points)',
        dimensions: [
          { name: 'Know-How', weightOrScope: 'Specialized', scoreOrBand: 'EI2', interpretation: 'Specialized programming and system architecture knowledge.' }
        ],
        rationale: 'Balanced technical depth and human relation communication skills.',
        marketAlignmentNotes: 'Mid-level enterprise benchmark.'
      },
      {
        frameworkId: 'mercer_ipe',
        frameworkName: 'Mercer IPE',
        levelOrScore: 'IPE Class 50',
        dimensions: [
          { name: 'Communication', weightOrScope: 'External', scoreOrBand: 'Negotiation', interpretation: 'Resolves technical objections with client architects.' }
        ],
        rationale: 'Direct contributor to organizational commercial targets.',
        marketAlignmentNotes: 'Standard commercial tech ranking.'
      },
      {
        frameworkId: 'wtw_ggs',
        frameworkName: 'WTW Global Grading',
        levelOrScore: 'WTW Grade 10',
        dimensions: [
          { name: 'Problem Solving', weightOrScope: 'Applied', scoreOrBand: 'Level 3', interpretation: 'Analyzes client tech barriers and designs integration prototypes.' }
        ],
        rationale: 'Experienced professional with direct revenue leverage.',
        marketAlignmentNotes: 'Competitive SaaS standard.'
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band',
        levelOrScore: 'Band C (Process Interpretation)',
        dimensions: [
          { name: 'Decision Authority', weightOrScope: 'Technical', scoreOrBand: 'Band C', interpretation: 'Determines technical configuration approaches within sales objectives.' }
        ],
        rationale: 'Autonomous in technical client engagement tactics.',
        marketAlignmentNotes: 'Direct match for Solutions Engineer.'
      }
    ],
    competencies: [
      { id: 'comp-se-demo', name: 'Executive Technical Demonstration', category: 'core', requiredLevel: 'advanced', description: 'Delivering compelling, zero-defect live software demonstrations under pressure.' },
      { id: 'comp-se-poc', name: 'Rapid API & Middleware Prototyping', category: 'technical', requiredLevel: 'advanced', description: 'Writing clean glue code, webhook receivers, and API test scripts in days.' }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-solutions-engineer',
        toRoleId: 'role-solutions-architect',
        toRoleTitle: 'Solutions Architect',
        toRoleTrack: 'hybrid',
        transferabilityScore: 92,
        transferabilityLevel: 'Very High',
        skillOverlapPercentage: 88,
        skillOverlapItems: ['API architecture', 'Client consultation', 'Cloud platforms', 'Security questionnaires'],
        skillGaps: ['Long-term post-sale systems governance', 'Enterprise multi-region disaster recovery architecture'],
        requiredExperience: 'Experience designing multi-year platform implementations beyond immediate pre-sales scopes.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Deepens architectural authority and scales to strategic enterprise governance.',
        recommendedPathway: ['Earn Cloud Solutions Architect certification (AWS/GCP)', 'Lead a multi-phase customer migration blueprint']
      }
    ]
  },

  // 6. Data Product Manager (P4)
  {
    id: 'role-data-product-mgr',
    title: 'Data Product Manager',
    jobFamily: 'Product Management & Data Platforms',
    domain: 'Data Platforms, Vector Search & AI/ML Workflows',
    roleFamilyCategory: 'technology',
    currentLevel: 'P4 (Senior)',
    targetLevel: 'P5 (Staff Data PM / Principal Data Architect)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Treats internal and external data assets as first-class products, architecting data contracts, telemetry pipelines, vector database schemas, and AI/ML model deployment interfaces.',
    overview: 'Data Product Managers define the roadmaps for data platforms, feature stores, analytics warehouses, and ML pipelines. They operate between data engineers, machine learning scientists, and downstream product squads—ensuring data is discoverable, governed, latency-optimized, and directly usable by AI and business systems.',
    coreResponsibilities: [
      'Define vision, SLAs, and technical roadmap for enterprise data platform and semantic data layers',
      'Establish enforceable data contracts, schema registries, and automated lineage tracking',
      'Partner with Machine Learning engineers on training data ingestion, feature stores, and vector indexing',
      'Oversee data governance, privacy compliance (GDPR, CCPA), and role-based access control (RBAC)',
      'Drive adoption of self-serve analytics tools and semantic metrics definitions across the organization'
    ],
    scope: 'Owns the centralized data platform powering analytics and AI capabilities across 10+ downstream product teams.',
    decisionRights: [
      'Data contract schema definitions and breaking change deprecation schedules',
      'Data infrastructure stack selection (Snowflake/BigQuery, dbt, Kafka, Pinecone)',
      'Data privacy enforcement standards and column-level masking policies'
    ],
    expectedImpact: 'Dramatically reduced query latencies, elimination of data discrepancies between squads, and accelerated deployment velocity for AI/ML features.',
    typicalSeniority: '5 - 9 years of technical product management, data engineering, or quantitative analytics experience.',
    keySkills: [
      'Data Contracts & Schema Evolution (Protobuf, JSON Schema)',
      'Data Warehouse & Lakehouse Architecture (Snowflake, BigQuery, Databricks)',
      'Streaming & Event Bus Pipelines (Kafka, Flink)',
      'Vector Databases & Embeddings (Pinecone, Qdrant, Milvus)',
      'Data Governance, Lineage & Metadata (OpenLineage, Amundsen)',
      'Semantic Metrics Layer Design (Cube, dbt Semantic Layer)'
    ],
    businessKnowledge: ['Data Monetization Models', 'Data Privacy Regulations (GDPR/HIPAA)', 'Cloud Compute Cost Driver Optimization'],
    technicalKnowledge: ['SQL, Python, and PySpark', 'Vector Indexing Algorithms (HNSW)', 'CI/CD for Data Pipelines (DataOps)'],
    behavioralCompetencies: ['Systems Rigor & Zero-Ambiguity Thinking', 'Patience with Technical Debt', 'Collaborative Stewardship'],
    toolsAndPlatforms: ['Snowflake', 'dbt', 'Kafka', 'Pinecone', 'Databricks', 'Airflow', 'BigQuery', 'Cube'],
    commonKpis: [
      { metric: 'Data Pipeline Freshness SLA', targetBenchmark: '> 99.5% delivered within 15-minute window', importance: 'critical' },
      { metric: 'Query Cost per 10k Operations', targetBenchmark: '< $0.08 normalized compute cost', importance: 'critical' },
      { metric: 'Downstream Squad Adoption Rate', targetBenchmark: '> 90% product squads using central semantic layer', importance: 'primary' }
    ],
    typicalDeliverables: [
      { title: 'Data Contract Specification & SLA RFC', frequency: 'Monthly', purpose: 'Defines schema expectations, change management policies, and consumers.' },
      { title: 'Data Platform Architecture & Capacity Roadmap', frequency: 'Quarterly', purpose: 'Outlines pipeline scaling, storage migrations, and cost-optimization initiatives.' }
    ],
    adjacentRoles: [
      { roleId: 'role-tech-product-mgr', roleTitle: 'Technical Product Manager', overlapPercentage: 86, transferability: 'High', commonBridgeSkills: ['API contracts', 'System architecture', 'Engineering collaboration'], notes: 'Direct lateral counterpart focusing on software platforms rather than data pipelines.' },
      { roleId: 'role-solutions-architect', roleTitle: 'Solutions Architect', overlapPercentage: 79, transferability: 'High', commonBridgeSkills: ['Cloud infrastructure', 'Data residency', 'System design'], notes: 'Natural trajectory if enterprise data integration consulting is preferred.' }
    ],
    careerProgression: {
      icTrack: ['Data PM (P3)', 'Senior Data PM (P4)', 'Staff Data Product Architect (P5)', 'Principal Data Strategist (P6)'],
      managementTrack: ['Senior Data PM (P4)', 'Group PM - Data & AI (M1)', 'Director of Data Platform (M2)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 5, proficiency: 'strategic', description: 'Extraordinary depth in modern data architecture, lakehouses, vector search, and schema governance.', evidencePrompt: 'Architected company-wide dbt semantic layer and Kafka event schema registry.', rationale: 'Highest technical tier in data platforms.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 4, proficiency: 'senior', description: 'Understands cloud data compute costs, privacy compliance risks, and data monetization value.', evidencePrompt: 'Reduced annual Snowflake compute bill by $450k through automated clustering optimization.', rationale: 'Direct cost and risk management acumen.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 5, proficiency: 'strategic', description: 'Tackles distributed data synchronization, multi-tenant privacy, and high-throughput real-time indexing.', evidencePrompt: 'Solved vector search latency bottleneck by implementing hybrid BM25 + HNSW index topology.', rationale: 'Operates in state-of-the-art data complexity.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 4, proficiency: 'senior', description: 'Authority over enterprise data contracts, schema change rejections, and storage tooling choices.', evidencePrompt: 'Enforced breaking-change governance that prevented downstream reporting outage.', rationale: 'Crucial platform governance rights.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 4, proficiency: 'senior', description: 'Enables downstream product teams to build blazing-fast AI features with reliable data foundations.', evidencePrompt: 'Unblocked AI search team by provisioning real-time embedding sync pipeline.', rationale: 'Multiplies effectiveness of 10+ customer-facing squads.' },
      { key: 'business_impact', label: 'Business Impact', score: 4, proficiency: 'senior', description: 'Eliminates compliance audit fines, drives data compute savings, and accelerates AI time-to-market.', evidencePrompt: 'Passed SOC-2 Type II audit with zero data lineage or masking infractions.', rationale: 'Foundation of enterprise operational safety.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 4, proficiency: 'senior', description: 'Manages multi-tier data platform SLA delivery across high-availability pipelines.', evidencePrompt: 'Maintained 99.9% uptime across 120 streaming Kafka topics and 450 dbt models.', rationale: 'Reliable high-throughput operational stewardship.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 5, proficiency: 'strategic', description: 'Aligns conflicting demands between Data Science, Security, Finance, and Product engineering.', evidencePrompt: 'Negotiated universal data contract adoption across 8 disparate engineering squad leads.', rationale: 'Superb consensus-building across technical teams.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 5, proficiency: 'strategic', description: 'Dictates company-wide data strategy, AI readiness, and architectural platform roadmap.', evidencePrompt: 'Authored 3-year Enterprise AI Data Readiness Whitepaper approved by CTO.', rationale: 'Foundational organizational influence.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 4, proficiency: 'senior', description: 'Champions data quality culture, mentors data analysts, and models rigorous engineering hygiene.', evidencePrompt: 'Founded internal Data Guild training 80+ engineers on contract-first design.', rationale: 'Outstanding cultural and technical anchor.' }
    ],
    levelMapping: {
      careerosInferredLevel: 'P4 — Senior Data & Platform Architecture PM',
      levelCode: 'P4',
      icEquivalent: 'Staff Data Product Architect (P5) / Principal Data Strategist (P6)',
      managementEquivalent: 'Group PM - Data & AI (M1) / Director of Data Platform (M2)',
      referenceFrameworkLevels: {
        aonRadford: 'P4 (Senior Professional)',
        kornFerryHay: 'Hay 510 Points (Grade 17)',
        mercerIpe: 'IPE Class 54',
        wtwGgs: 'WTW Grade 13',
        patterson: 'Band D (Strategic / Platform Architecture)'
      },
      scopeSummary: {
        roleScope: 'Centralized data platform, semantic metrics layer, and AI vector data infrastructure.',
        decisionScope: 'Data contracts, schema registry enforcement, and cloud data architecture stack.',
        impactScope: 'Organizational AI velocity, data pipeline reliability, and cloud compute cost efficiency.',
        complexity: 'Very High; requires distributed systems, database internals, and data governance mastery.',
        leadershipScope: 'Platform lead coordinating between Data Engineering, ML Science, and Product Squads.'
      },
      evidenceRationale: [
        'Establishes enterprise data contract standards adopted across entire engineering org.',
        'Reduces cloud compute overhead while guaranteeing sub-second vector search performance.',
        'Serves as the indispensable architectural foundation for enterprise AI and business intelligence.'
      ]
    },
    referenceEvaluations: [
      {
        frameworkId: 'careeros_native',
        frameworkName: 'CareerOS Native Evaluation',
        levelOrScore: 'P4 Equivalent (Score: 4.4 / 5.0)',
        dimensions: [
          { name: 'Functional Knowledge', weightOrScope: 'Data & AI', scoreOrBand: '5 - Strategic', interpretation: 'Unrivaled expertise in data contracts, lakehouses, and vector databases.' },
          { name: 'Strategic Influence', weightOrScope: 'Platform', scoreOrBand: '5 - Strategic', interpretation: 'Dictates company-wide AI data foundation and architectural standards.' }
        ],
        rationale: 'Top-tier technical product specialist defining the data and AI backbone of the modern enterprise.',
        marketAlignmentNotes: 'Benchmark match under Data Product Management / Platform Architecture.'
      },
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Tech Leveling',
        levelOrScore: 'P4 (Senior Professional)',
        dimensions: [
          { name: 'Level Code', weightOrScope: 'Standard', scoreOrBand: 'P4', interpretation: 'Operates with complete technical autonomy on core platform systems.' }
        ],
        rationale: 'High specialized individual contributor solving intricate data infrastructure problems.',
        marketAlignmentNotes: 'Mapped under Technical Product Management - Data Infrastructure.'
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay System',
        levelOrScore: 'Grade 17 (510 Points)',
        dimensions: [
          { name: 'Know-How', weightOrScope: 'Specialized', scoreOrBand: 'FII3', interpretation: 'Authoritative know-how in data engineering systems and platform architecture.' }
        ],
        rationale: 'Exceptional know-how and system-wide problem solving capacity.',
        marketAlignmentNotes: 'Senior technical professional grade.'
      },
      {
        frameworkId: 'mercer_ipe',
        frameworkName: 'Mercer IPE',
        levelOrScore: 'IPE Class 54',
        dimensions: [
          { name: 'Knowledge Breadth', weightOrScope: 'Enterprise', scoreOrBand: 'Broad Technical', interpretation: 'Guides data architecture across all business units.' }
        ],
        rationale: 'High conceptual innovation and broad enterprise knowledge breadth.',
        marketAlignmentNotes: 'Upper-tier specialist in global tech organizations.'
      },
      {
        frameworkId: 'wtw_ggs',
        frameworkName: 'WTW Global Grading',
        levelOrScore: 'WTW Grade 13',
        dimensions: [
          { name: 'Functional Expertise', weightOrScope: 'Recognized', scoreOrBand: 'Level 5', interpretation: 'Recognized internal authority on data systems and vector semantics.' }
        ],
        rationale: 'Lead professional grade 13 in data infrastructure.',
        marketAlignmentNotes: 'Direct match for scaled tech data architects.'
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band',
        levelOrScore: 'Band D (Platform Architecture Decisions)',
        dimensions: [
          { name: 'Decision Complexity', weightOrScope: 'Systemic', scoreOrBand: 'Band D', interpretation: 'Establishes technical standards, schema contracts, and pipeline architecture.' }
        ],
        rationale: 'Strategic authority over data platform design and execution.',
        marketAlignmentNotes: 'Direct match for Senior Data Product Manager.'
      }
    ],
    competencies: [
      { id: 'comp-data-contracts', name: 'Data Contract & Schema Registry Governance', category: 'technical', requiredLevel: 'strategic', description: 'Enforcing contract-first data architectures and backward-compatible schema changes.' },
      { id: 'comp-data-vector', name: 'Vector Database & Embeddings Topology', category: 'technical', requiredLevel: 'senior', description: 'Designing high-throughput vector search indexes and embedding pipelines for LLMs.' },
      { id: 'comp-data-semantic', name: 'Semantic Metrics Layer Architecture', category: 'product', requiredLevel: 'senior', description: 'Standardizing business metric formulas across downstream BI and AI platforms.' }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-data-product-mgr',
        toRoleId: 'role-tech-product-mgr',
        toRoleTitle: 'Technical Product Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 90,
        transferabilityLevel: 'Very High',
        skillOverlapPercentage: 86,
        skillOverlapItems: ['API contracts', 'System architecture', 'Developer tooling', 'SLA management'],
        skillGaps: ['Core application feature workflows', 'Consumer UI/UX ergonomics'],
        requiredExperience: 'Desire to build full-stack developer platforms beyond purely data pipelines.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Seamless transition between data systems and software engineering platforms.',
        recommendedPathway: ['Lead an internal developer portal initiative', 'Shadow platform engineering squad releases']
      }
    ]
  }
];
