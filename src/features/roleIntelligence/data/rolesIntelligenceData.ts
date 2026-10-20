import { 
  FrameworkMetadata, 
  RoleIntelligenceItem,
  RoleGraphData 
} from '../types';
import { ADDITIONAL_ROLES_DATA } from './additionalRolesData';

export const FRAMEWORK_METADATA_LIST: FrameworkMetadata[] = [
  {
    id: 'careeros_native',
    name: 'CareerOS Evaluation Model',
    shortName: 'CareerOS Native',
    creator: 'CareerOS Intelligence Systems',
    frameworkType: 'career_architecture',
    primaryPurpose: 'Holistic role sizing and multidimensional capability analysis engineered specifically for Product, Tech, and Product × Biz × Ops hybrid roles.',
    bestSuitedRoles: [
      'Product Managers & Leaders',
      'Technical Product Managers (TPM)',
      'Product Operations & BizOps',
      'Solutions Architects & Engineers',
      'Growth & Strategic Operations'
    ],
    evaluationDimensions: [
      'Functional / Technical Knowledge',
      'Business Domain Knowledge',
      'Problem Complexity',
      'Decision Scope',
      'Product / Customer Impact',
      'Business Impact',
      'Operational Scope',
      'Stakeholder Complexity',
      'Strategic Influence',
      'Leadership / Ownership'
    ],
    typicalUse: 'Individual capability benchmarking, lateral career transitions, readiness gap modeling, and cross-functional role comparison without HR compensation baggage.',
    careerosRelevance: 'Primary internal intelligence model calibrated for tech ecosystem dynamism where traditional corporate HR frameworks under-index on product autonomy, cross-functional orchestration, and algorithmic impact.',
    evaluationLogic: 'Decouples role evaluation from bureaucratic headcounts; focuses on blast radius, decision autonomy, ambiguous problem navigation, and stakeholder friction.',
    roleCoverage: 'Universal for modern software, platform engineering, AI systems, product strategy, and technical business operations.',
    strengths: [
      'Tailored to product, modern tech, and operations intersections',
      'Visualizes 10 balanced dimensions instead of flattening to a single number',
      'Directly links to CareerOS readiness scores, evidence, and career mobility'
    ],
    limitations: [
      'Internal intelligence framework; not used for statutory HR compensation filing'
    ]
  },
  {
    id: 'korn_ferry_hay',
    name: 'Korn Ferry Hay Guide Chart-Profile Method',
    shortName: 'Korn Ferry Hay',
    creator: 'Edward N. Hay (Korn Ferry)',
    frameworkType: 'job_evaluation',
    primaryPurpose: 'Measures relative job size, internal equity, and organizational hierarchy based on point-factor evaluation of content and accountability.',
    bestSuitedRoles: [
      'Established corporate roles',
      'Enterprise leadership',
      'Traditional engineering hierarchies',
      'Structured operational positions'
    ],
    evaluationDimensions: [
      'Know-How (Practical, Managerial, Human Relations)',
      'Problem Solving (Thinking Environment, Thinking Challenge)',
      'Accountability (Freedom to Act, Impact on End Results, Magnitude)'
    ],
    typicalUse: 'Large enterprise job leveling, executive compensation benchmarking, salary band setting, and organization restructuring.',
    careerosRelevance: 'Useful reference when evaluating the organizational gravity, freedom to act, and accountability magnitude of senior product and tech leaders in Fortune 500 or scaled tech companies.',
    evaluationLogic: 'Assigns quantitative points across Know-How, Problem Solving, and Accountability. Total points map to standard job size grades.',
    roleCoverage: 'Global cross-industry applicability across 100+ countries and thousands of global conglomerates.',
    strengths: [
      'Rigorous point-factor scoring recognized worldwide by corporate HR boards',
      'Explicit emphasis on Accountability (Freedom to Act)'
    ],
    limitations: [
      'Can be overly bureaucratic for rapidly evolving hybrid roles (e.g. Product Ops, AI Engineers)',
      'Tends to overweight direct people management over individual contributor technical leverage'
    ]
  },
  {
    id: 'mercer_ipe',
    name: 'Mercer International Position Evaluation (IPE)',
    shortName: 'Mercer IPE',
    creator: 'Mercer Consulting',
    frameworkType: 'job_evaluation',
    primaryPurpose: 'A global position evaluation system that sizes roles according to contribution to business results and strategic context.',
    bestSuitedRoles: [
      'Multinational tech corporations',
      'Regional business units',
      'Cross-border functional leaders',
      'Shared services & global operations'
    ],
    evaluationDimensions: [
      'Impact (Organization Size, Contribution, Nature of Impact)',
      'Communication (Frame of Communication, Negotiation Complexity)',
      'Innovation (Conceptual Innovation, Complexity of Ideas)',
      'Knowledge (Functional Expertise, Breadth, Geographic Scope)',
      'Risk & Complexity (Decision Environment, Uncertainty)'
    ],
    typicalUse: 'Multinational job grading, global mobility pay scaling, grading consolidation, and corporate M&A role harmonization.',
    careerosRelevance: 'Highly relevant for assessing communication diplomacy, negotiation breadth, and conceptual innovation in Product and BizOps leaders operating across matrixed global teams.',
    evaluationLogic: 'Evaluates positions on 5 factors (Impact, Communication, Innovation, Knowledge, Risk) into a total Mercer Class (1 to 60+).',
    roleCoverage: 'Comprehensive global position grading across all corporate and technical disciplines.',
    strengths: [
      'Strong separation of Communication / Negotiation and Conceptual Innovation',
      'Robust global geographic normalization factors'
    ],
    limitations: [
      'Complex factor weightings that require enterprise subscription data to verify completely'
    ]
  },
  {
    id: 'wtw_ggs',
    name: 'Willis Towers Watson Global Grading System (WTW GGS)',
    shortName: 'WTW GGS',
    creator: 'Willis Towers Watson',
    frameworkType: 'job_grading',
    primaryPurpose: 'Dual-axis job grading architecture assessing organizational size/complexity alongside individual position contribution.',
    bestSuitedRoles: [
      'Mid-to-large tech enterprises',
      'Corporate venture & digital transformation',
      'Specialized individual contributors',
      'Functional management tracks'
    ],
    evaluationDimensions: [
      'Functional Knowledge & Depth',
      'Business Expertise & Industry Context',
      'Problem Solving & Ambiguity',
      'Nature & Area of Impact',
      'Interpersonal Skills & Cultural Influence',
      'Leadership & Resource Guidance'
    ],
    typicalUse: 'Career framework design, global grade band assignment (Bands 1-25), and dual IC/Manager career ladder construction.',
    careerosRelevance: 'Directly informs dual-ladder progression architectures (separating Staff/Principal IC tracks from Engineering/Product Management tracks).',
    evaluationLogic: 'Filters first by Organization Size (Revenue/Headcount), then assigns Band (Individual Contributor, Management, Executive), followed by grade steps.',
    roleCoverage: 'Widespread adoption among tech giants and diversified commercial organizations.',
    strengths: [
      'Clear, transparent dual-ladder tracks (Professional vs Management)',
      'Clean evaluation of problem solving and business context'
    ],
    limitations: [
      'Initial grading step is tied heavily to company revenue size rather than role-intrinsic value'
    ]
  },
  {
    id: 'aon_radford',
    name: 'Aon Radford Global Compensation & Leveling Architecture',
    shortName: 'Aon Radford',
    creator: 'Aon Hewitt / Radford',
    frameworkType: 'job_leveling',
    primaryPurpose: 'The de facto technology, biotech, and high-growth venture industry standard for role architecture, leveling, and market-oriented compensation benchmarking.',
    bestSuitedRoles: [
      'Software & Cloud Engineers',
      'Product Managers & Product Designers',
      'Data Scientists & AI Researchers',
      'Developer Relations & Solutions Architects'
    ],
    evaluationDimensions: [
      'Job Level Code (P1-P6 for Professional IC, M1-M6 for Management, E1-E3 for Executive)',
      'Organizational Impact & Autonomy',
      'Technical Complexity & Domain Scope',
      'Supervision Required vs Provided',
      'Market Benchmark Clustering'
    ],
    typicalUse: 'Tech startup and Silicon Valley equity/cash leveling, tech job family structuring, and Silicon Valley compensation committee reviews.',
    careerosRelevance: 'Essential reference for tech workers. Most tech employees understand levels as P3 (Mid), P4 (Senior), P5 (Staff/Principal), and M2 (Director). Radford terminology is the lingua franca of tech hiring.',
    evaluationLogic: 'Discrete standardized leveling criteria across predefined tech job families (Software, Product, Systems, Data, Security).',
    roleCoverage: 'Over 90% of venture-backed tech companies and major tech platforms participate in Radford surveys.',
    strengths: [
      'The definitive benchmark standard across tech and venture ecosystems',
      'Seamlessly aligns with modern tech company levels (Google L5/L6, Meta IC5/IC6, Amazon L6/L7)'
    ],
    limitations: [
      'Primarily benchmark and level-based; less focus on internal developmental coaching or competency gap analysis'
    ]
  },
  {
    id: 'patterson',
    name: 'Patterson Decision Band Method (DBM)',
    shortName: 'Patterson Decision Band',
    creator: 'Dr. T.T. Paterson',
    frameworkType: 'job_evaluation',
    primaryPurpose: 'Evaluates role value strictly by the complexity, type, and organizational authority of decisions made by the position.',
    bestSuitedRoles: [
      'Decision-centric roles',
      'Product Strategy & Operations',
      'Program Directors & Governance',
      'Enterprise Systems Architects'
    ],
    evaluationDimensions: [
      'Band F: Policy-Making / Strategy Defining (Board/CEO level)',
      'Band E: Programming / Strategic Execution (VP / Product Exec)',
      'Band D: Interpretive / Systemic Allocation (Director / Staff / Principal)',
      'Band C: Process / Method Optimization (Senior PM / Senior Engineer)',
      'Band B: Operational / Routine Execution (Associate / Junior)',
      'Band A: Defined / Structured Tasks (Support)'
    ],
    typicalUse: 'Fair organizational restructuring, flattening managerial overhead, and identifying decision bottlenecks.',
    careerosRelevance: 'Uniquely suited for Product Managers and BizOps professionals whose actual value lies not in lines of code written, but in the clarity, velocity, and soundness of decisions made under uncertainty.',
    evaluationLogic: 'Ranks jobs by the nature of decision-making authority: Defined -> Operational -> Process -> Interpretive -> Programming -> Policy.',
    roleCoverage: 'Universal framework used extensively in government, healthcare, and progressive tech governance.',
    strengths: [
      'Philosophically purest match for knowledge workers and product strategists',
      'Cuts through vanity job titles to ask: "What decisions does this role actually have authority to make?"'
    ],
    limitations: [
      'Fewer commercial salary surveys directly publish under Patterson band names today'
    ]
  }
];

export const ROLES_INTELLIGENCE_DATA: RoleIntelligenceItem[] = [
  {
    id: 'role-sr-product-manager',
    title: 'Senior Product Manager',
    jobFamily: 'Product Management',
    domain: 'Software Platforms & Cloud Applications',
    roleFamilyCategory: 'product',
    currentLevel: 'P4 (Senior)',
    targetLevel: 'P5 (Staff / Group PM)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Owns end-to-end product strategy, discovery, and execution for a mission-critical product domain. Drives compounding business value and customer outcomes through cross-functional leverage without formal reporting lines.',
    overview: 'Senior Product Managers operate at the intersection of business strategy, user experience, and technical systems. Unlike junior PMs who execute scoped feature backlogs, Senior PMs own problem spaces, shape strategic roadmaps, model unit economics, and influence senior engineering and commercial leadership.',
    coreResponsibilities: [
      'Define 12-to-18 month vision and outcome-driven roadmap for product surface area',
      'Lead continuous discovery with enterprise and consumer users to validate problem hypotheses',
      'Partner with Principal Engineers on architecture trade-offs, scalability, and technical debt',
      'Establish quantitative telemetry, north-star metrics, and guardrail metrics',
      'Drive cross-functional Go-To-Market execution across Product Marketing, Sales, Legal, and Support',
      'Mentor Associate and Mid-Level PMs in structured product thinking and artifact rigor'
    ],
    scope: 'Directly responsible for a multi-million ARR product pillar, 2-3 engineering squads (15-25 engineers/designers), and cross-functional GTM alignment.',
    decisionRights: [
      'Roadmap prioritization and feature sunsetting authority within product surface',
      'Release readiness criteria and launch rollback trigger approval',
      'Definition of core user personas and prioritized problem statements',
      'Selection of product telemetry frameworks and analytics instrumentation'
    ],
    expectedImpact: 'Measurable lift in net retention rate (NRR), customer lifetime value (LTV), activation velocity, and reduction in time-to-value for target customer segments.',
    typicalSeniority: '5 - 9 years of cross-functional technology and product experience.',
    keySkills: [
      'Outcome-Driven Roadmapping',
      'Continuous Discovery & Customer Interviews',
      'Quantitative Telemetry (Amplitude, SQL)',
      'Opportunity Solution Trees',
      'Unit Economics & Pricing Strategy',
      'Technical Architecture Fluency',
      'Executive Storytelling'
    ],
    businessKnowledge: [
      'SaaS Business Models & Cohort Retention',
      'Market Sizing & TAM/SAM Modeling',
      'Competitive Moats & Platform Dynamics',
      'Enterprise Procurement & Security Requirements'
    ],
    technicalKnowledge: [
      'Distributed Systems & API Contracts',
      'Event-Driven Architectures & Kafka/Queues',
      'Vector Search & LLM Orchestration Constraints',
      'Cloud Infrastructure Cost Driver Models'
    ],
    behavioralCompetencies: [
      'Influence Without Authority',
      'Principled Disagreement & Alignment',
      'Decision Velocity Under Ambiguity',
      'High Agency & Extreme Ownership',
      'Synthesized Communication'
    ],
    toolsAndPlatforms: ['Amplitude', 'Looker', 'Figma', 'Linear', 'Jira', 'Notion', 'Postman', 'SQL'],
    commonKpis: [
      { metric: 'Net Revenue Retention (NRR)', targetBenchmark: '> 115%', importance: 'critical' },
      { metric: 'Feature Adoption Rate', targetBenchmark: '> 40% of target cohort in 30 days', importance: 'critical' },
      { metric: 'Cycle Time (Discovery to GA)', targetBenchmark: '< 8 weeks per milestone', importance: 'primary' },
      { metric: 'Customer Effort Score (CES)', targetBenchmark: '< 2.0 on 7-point scale', importance: 'primary' }
    ],
    typicalDeliverables: [
      { title: 'Product Strategy & Annual Narrative RFC', frequency: 'Annual', purpose: 'Synthesizes competitive landscape, customer shifts, and 3-year strategic bets.' },
      { title: 'Opportunity Solution Tree & PRD', frequency: 'Bi-monthly', purpose: 'Articulates customer problem, measurable success criteria, and scoped technical boundaries.' },
      { title: 'Quarterly Metric Business Review (QBR)', frequency: 'Quarterly', purpose: 'Presents cohort telemetry, goal attainment, and roadmap adjustments to executive team.' }
    ],
    adjacentRoles: [
      { roleId: 'role-product-ops-mgr', roleTitle: 'Product Operations Manager', overlapPercentage: 78, transferability: 'High', commonBridgeSkills: ['Process Architecture', 'Telemetry', 'Stakeholder Alignment'], notes: 'Natural pivot for PMs who excel at operational leverage, toolchain governance, and scaling best practices across product orgs.' },
      { roleId: 'role-tech-product-mgr', roleTitle: 'Technical Product Manager', overlapPercentage: 85, transferability: 'High', commonBridgeSkills: ['API Specs', 'System Architecture', 'Telemetry'], notes: 'Immediate fit if deep technical and engineering fluency is present.' },
      { roleId: 'role-growth-product-mgr', roleTitle: 'Growth Product Manager', overlapPercentage: 82, transferability: 'High', commonBridgeSkills: ['Experimentation', 'Funnel Analytics', 'A/B Testing'], notes: 'Direct transition for data-heavy PMs focusing on acquisition and viral loops.' },
      { roleId: 'role-bizops-mgr', roleTitle: 'Business Operations Manager', overlapPercentage: 68, transferability: 'Medium', commonBridgeSkills: ['Financial Modeling', 'Executive Synthesis', 'Cross-functional Strategy'], notes: 'Excellent pivot for PMs interested in corporate strategy, organizational efficiency, and P&L.' }
    ],
    careerProgression: {
      icTrack: ['Senior PM (P4)', 'Staff Product Manager (P5)', 'Principal Product Manager (P6)', 'Distinguished Product Partner (P7)'],
      managementTrack: ['Senior PM (P4)', 'Group Product Manager (M1)', 'Director of Product (M2)', 'VP of Product (M3)', 'Chief Product Officer (M4)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 4, proficiency: 'senior', description: 'Deep mastery of product discovery, specification, API contracts, and engineering constraints.', evidencePrompt: 'Architected complex multi-squad product specs and evaluated API schemas with engineering leads.', rationale: 'Understands system trade-offs without needing engineers to translate technical blockers.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 4, proficiency: 'senior', description: 'Thorough comprehension of SaaS metrics, monetization, enterprise sales cycles, and competitive landscape.', evidencePrompt: 'Modeled pricing tier impacts and adjusted roadmap to drive expansion revenue.', rationale: 'Directly accounts for commercial viability and unit economics in roadmap bets.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 4, proficiency: 'senior', description: 'Solves ill-defined, ambiguous customer problems with multiple conflicting trade-offs.', evidencePrompt: 'Decoupled monolithic legacy workflows into modular self-serve micro-experiences.', rationale: 'Capable of turning ambiguous market signals into crisp execution plans.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 4, proficiency: 'senior', description: 'Has binding authority over product prioritization, release milestones, and trade-offs within product domain.', evidencePrompt: 'Sunken feature decommissioned despite vocal resistance to protect long-term platform velocity.', rationale: 'Operates with high autonomy on product surface decisions.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 5, proficiency: 'strategic', description: 'Directly influences core user workflows, retention curves, and enterprise adoption.', evidencePrompt: 'Redesigned core onboarding flow leading to a 34% reduction in Day-7 user churn.', rationale: 'Product surface directly dictates user love and retention.' },
      { key: 'business_impact', label: 'Business Impact', score: 4, proficiency: 'senior', description: 'Materially moves P&L metrics, NRR, and customer expansion opportunities.', evidencePrompt: 'Enabled $4.2M in annual expansion ARR through enterprise governance tier.', rationale: 'Measurable direct link to top-line commercial outcomes.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 3, proficiency: 'advanced', description: 'Coordinates 2-3 engineering squads, design partners, and GTM cross-functional cadence.', evidencePrompt: 'Orchestrated synchronized launch across 4 time zones with zero critical operational incidents.', rationale: 'Solid operational cadence across technical squads.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 4, proficiency: 'senior', description: 'Aligns conflicting demands across Sales, Customer Success, Security, Engineering, and C-Suite.', evidencePrompt: 'Negotiated consensus between enterprise sales and engineering over security compliance backlog.', rationale: 'Excels at diplomacy and framing discussions around common business goals.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 4, proficiency: 'senior', description: 'Shapes departmental roadmaps and influences cross-product portfolio priorities.', evidencePrompt: 'Authored company-wide AI integration RFC adopted across 3 product lines.', rationale: 'Ideas frequently adopted across neighboring product teams.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 4, proficiency: 'senior', description: 'Drives extreme ownership of outcomes, mentors junior PMs, and fosters team psychological safety.', evidencePrompt: 'Mentored 2 Associate PMs who successfully shipped their first GA releases.', rationale: 'Acts as cultural anchor for the product group.' }
    ],
    referenceEvaluations: [
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Leveling',
        levelOrScore: 'Level P4 (Senior Professional)',
        rationale: 'Works on problems of diverse scope where analysis of data requires evaluation of identifiable factors. Demonstrates good judgment in selecting methods and techniques for obtaining solutions. Receives little instruction on day-to-day work, general instructions on new assignments.',
        marketAlignmentNotes: 'Equivalent to Google L5, Meta IC5, Amazon L6, Stripe L3.',
        dimensions: [
          { name: 'Impact', weightOrScope: 'Substantial', scoreOrBand: 'P4', interpretation: 'Direct impact on product revenue and customer retention.' },
          { name: 'Autonomy', weightOrScope: 'High', scoreOrBand: 'P4', interpretation: 'Operates independently with periodic strategic reviews.' },
          { name: 'Complexity', weightOrScope: 'Complex', scoreOrBand: 'P4', interpretation: 'Solves multifaceted business and technical challenges.' }
        ]
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay Evaluation',
        levelOrScore: '540 Hay Points (Grade 18-19)',
        rationale: 'Substantial Know-How (E II 3 = 264 pts), Thinking Challenge under defined objectives (D 4 (43%) = 115 pts), and Accountability with primary impact on medium-sized unit (E 2 P = 161 pts).',
        marketAlignmentNotes: 'Senior Professional / Practice Lead band in global enterprise hierarchies.',
        dimensions: [
          { name: 'Know-How', weightOrScope: '49%', scoreOrBand: '264 pts (E II 3)', interpretation: 'Seasoned professional integration with strong human relations mastery.' },
          { name: 'Problem Solving', weightOrScope: '21%', scoreOrBand: '115 pts (D 4 43%)', interpretation: 'Semi-standardized environment requiring adaptive thinking and innovation.' },
          { name: 'Accountability', weightOrScope: '30%', scoreOrBand: '161 pts (E 2 P)', interpretation: 'Primary impact on designated product line with broad freedom to act.' }
        ]
      },
      {
        frameworkId: 'mercer_ipe',
        frameworkName: 'Mercer IPE System',
        levelOrScore: 'Position Class 54 (Grade 14)',
        rationale: 'Substantial direct impact on operational results; high communication negotiation required across matrixed functions; complex conceptual innovation in digital products.',
        marketAlignmentNotes: 'Senior Specialist / Domain Lead across multinational tech matrix structures.',
        dimensions: [
          { name: 'Impact', weightOrScope: 'High', scoreOrBand: 'Class 54', interpretation: 'Direct contribution to operational and financial performance.' },
          { name: 'Communication', weightOrScope: 'Matrixed', scoreOrBand: 'Level 4', interpretation: 'Negotiates and influences across cross-functional leadership.' },
          { name: 'Innovation', weightOrScope: 'Conceptual', scoreOrBand: 'Level 4', interpretation: 'Develops novel product models and customer interaction paradigms.' }
        ]
      },
      {
        frameworkId: 'wtw_ggs',
        frameworkName: 'WTW Global Grading System',
        levelOrScore: 'Grade 13 (Individual Contributor - Expert)',
        rationale: 'Broad mastery of product management discipline with demonstrated ability to guide technical squads without formal managerial hierarchy. High problem-solving ambiguity.',
        marketAlignmentNotes: 'Top of Senior IC band, gateway to Principal / Director tracks.',
        dimensions: [
          { name: 'Functional Knowledge', weightOrScope: 'High', scoreOrBand: 'GGS 13', interpretation: 'Recognized subject matter expert across product organization.' },
          { name: 'Business Expertise', weightOrScope: 'Broad', scoreOrBand: 'GGS 13', interpretation: 'Integrates commercial goals with engineering realities.' }
        ]
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band Method',
        levelOrScore: 'Band D (Interpretive Decisions)',
        rationale: 'Makes interpretive decisions regarding *how* strategic goals are met. Interprets market strategy and determines specific product feature allocations, timing, and system specs.',
        marketAlignmentNotes: 'Equivalent to senior professional / department lead decision rights.',
        dimensions: [
          { name: 'Decision Authority', weightOrScope: 'Interpretive', scoreOrBand: 'Band D', interpretation: 'Determines operational methodology and prioritizes tactical execution to meet broad goals.' },
          { name: 'Discretion', weightOrScope: 'High Discretion', scoreOrBand: 'Band D', interpretation: 'Selects solutions from ambiguous possibilities without routine procedural templates.' }
        ]
      }
    ],
    levelMapping: {
      careerosInferredLevel: 'P4 / Senior Product Specialist',
      levelCode: 'P4',
      icEquivalent: 'Staff / Principal Product IC (P5)',
      managementEquivalent: 'Group Product Manager / Director of Product (M1/M2)',
      scopeSummary: {
        roleScope: 'Multi-million ARR product pillar; 2-3 engineering squads (15-25 technical members).',
        decisionScope: 'Binding roadmap prioritization, feature lifecycle, and telemetry framework authority.',
        impactScope: 'Company-level Net Revenue Retention (NRR) and active user retention curves.',
        complexity: 'Solves ambiguous customer problems with interdependent technical architecture constraints.',
        leadershipScope: 'Matrix leadership without direct reports; mentors junior PMs.'
      },
      referenceFrameworkLevels: {
        kornFerryHay: '540 Points (Grade 18)',
        mercerIpe: 'Position Class 54',
        wtwGgs: 'Grade 13 (Expert IC)',
        aonRadford: 'P4 (Senior Professional)',
        patterson: 'Band D (Interpretive)'
      },
      evidenceRationale: [
        'Radford P4: Exercises independent judgment within defined company objectives; establishes release criteria.',
        'Hay Accountability: Freedom to act bounded by product mission; primary impact on segment revenue.',
        'Patterson Band D: Establishes the "how" rather than executing pre-scripted tasks (Band C) or defining executive company purpose (Band E).'
      ]
    },
    competencies: [
      {
        id: 'comp-prod-strategy',
        name: 'Outcome-Driven Product Strategy',
        category: 'product',
        requiredLevel: 'senior',
        description: 'Synthesizes market dynamics, user telemetry, and technical leverage into defensible, outcome-oriented roadmaps.',
        externalFrameworkRefs: [
          { framework: 'SFIA', codeOrLevel: 'Level 5 (Ensure, advise)', description: 'Sets direction and guides delivery of complex product portfolios.' },
          { framework: 'O*NET', codeOrLevel: '15-1299.08', description: 'Computer Systems Analysts / Product Managers: Analyze tech solutions.' }
        ]
      },
      {
        id: 'comp-cont-discovery',
        name: 'Continuous Discovery & User Research',
        category: 'product',
        requiredLevel: 'senior',
        description: 'Conducts weekly customer interviews, formulates falsifiable opportunity solution trees, and tests hypotheses rapidly.',
        externalFrameworkRefs: [
          { framework: 'ESCO', codeOrLevel: '2431.1.2', description: 'Product specialist: Analyze market demands and user feedback.' }
        ]
      },
      {
        id: 'comp-tech-systems',
        name: 'Technical Architecture Fluency',
        category: 'technical',
        requiredLevel: 'advanced',
        description: 'Critiques API specs, understands latency/concurrency trade-offs, and coordinates with engineering leads on architectural debt.',
        externalFrameworkRefs: [
          { framework: 'SFIA', codeOrLevel: 'Level 4 (Enable)', description: 'Applies technical knowledge to support solution delivery.' }
        ]
      },
      {
        id: 'comp-data-telemetry',
        name: 'Quantitative Telemetry & Cohort Analysis',
        category: 'technical',
        requiredLevel: 'senior',
        description: 'Constructs SQL queries, instruments event tracking schemas, and analyzes cohort retention curves in Amplitude/Mixpanel.',
        externalFrameworkRefs: [
          { framework: 'O*NET', codeOrLevel: '15-2051.01', description: 'Business Intelligence Analysts: Conduct complex data inquiries.' }
        ]
      },
      {
        id: 'comp-commercial-acumen',
        name: 'Unit Economics & Commercial Acumen',
        category: 'business',
        requiredLevel: 'advanced',
        description: 'Evaluates COGS, customer acquisition cost (CAC), LTV, gross margin impact of features, and pricing tier boundaries.',
        externalFrameworkRefs: [
          { framework: 'SHL', codeOrLevel: 'Commercial Orientation', description: 'Demonstrates awareness of business financial drivers.' }
        ]
      },
      {
        id: 'comp-cross-leadership',
        name: 'Influence Without Authority',
        category: 'leadership',
        requiredLevel: 'senior',
        description: 'Builds consensus across stubborn engineering leads, demanding sales executives, and skeptical designers through transparent evidence.',
        externalFrameworkRefs: [
          { framework: 'SHL', codeOrLevel: 'Persuading & Influencing', description: 'Gains clear agreement and commitment from diverse peers.' }
        ]
      }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-sr-product-manager',
        toRoleId: 'role-product-ops-mgr',
        toRoleTitle: 'Product Operations Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 88,
        transferabilityLevel: 'Very High',
        skillOverlapPercentage: 82,
        skillOverlapItems: ['Product Discovery', 'Telemetry & Metrics', 'Toolchain Governance', 'Stakeholder Communication'],
        skillGaps: ['Org-Wide Process Systems', 'Continuous Discovery Enablement', 'Tool Vendor Procurement'],
        requiredExperience: 'Proven ability to operationalize templates, feedback loops, and data pipelines across multiple product teams.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Empowers transition from individual squad delivery to organizational force multiplier.',
        recommendedPathway: ['Standardize discovery artifacts across 3 squads', 'Build central feedback intake loop in Notion/Linear', 'Lead product review governance rhythm']
      },
      {
        fromRoleId: 'role-sr-product-manager',
        toRoleId: 'role-growth-product-mgr',
        toRoleTitle: 'Growth Product Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 84,
        transferabilityLevel: 'High',
        skillOverlapPercentage: 79,
        skillOverlapItems: ['Quantitative Analytics', 'A/B Testing', 'Funnel Optimization', 'User Psychology'],
        skillGaps: ['Viral Loop Modeling', 'Attribution Modeling', 'Rapid Experimentation Cadence'],
        requiredExperience: 'Demonstrated experience running high-frequency A/B experiments and optimizing signup/activation funnels.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Fast-tracks direct commercial impact and executive visibility through measurable revenue acceleration.',
        recommendedPathway: ['Run 5 self-serve onboarding experiments', 'Deepen statistics & sample size calculation mastery', 'Analyze marketing attribution pipelines']
      },
      {
        fromRoleId: 'role-sr-product-manager',
        toRoleId: 'role-bizops-mgr',
        toRoleTitle: 'Business Operations Manager (BizOps)',
        toRoleTrack: 'hybrid',
        transferabilityScore: 74,
        transferabilityLevel: 'Moderate',
        skillOverlapPercentage: 68,
        skillOverlapItems: ['Executive Synthesis', 'Unit Economics', 'Cross-Functional Roadmapping', 'Problem Structuring'],
        skillGaps: ['Financial P&L Modeling', 'M&A Due Diligence', 'Corporate Governance'],
        requiredExperience: 'Experience conducting business case analyses, restructuring team incentives, and building financial models.',
        estimatedTransitionDifficulty: 'Moderate',
        strategicValue: 'Expands career trajectory into Chief of Staff, VP of Operations, or General Manager (GM) roles.',
        recommendedPathway: ['Build comprehensive departmental financial forecast', 'Conduct build-vs-buy analysis for infrastructure', 'Partner with CFO team on pricing overhaul']
      },
      {
        fromRoleId: 'role-sr-product-manager',
        toRoleId: 'role-tech-product-mgr',
        toRoleTitle: 'Technical Product Manager',
        toRoleTrack: 'ic',
        transferabilityScore: 86,
        transferabilityLevel: 'Very High',
        skillOverlapPercentage: 84,
        skillOverlapItems: ['PRD Writing', 'Prioritization', 'Telemetry', 'Cross-functional Execution'],
        skillGaps: ['Deep Distributed Systems Specs', 'Microservices Topology', 'Cloud Cost Modeling'],
        requiredExperience: 'Experience authoring technical RFCs, evaluating REST/gRPC API payloads, and working with platform squads.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Critical path toward Principal Infrastructure PM or Technical Director in AI/Cloud platform companies.',
        recommendedPathway: ['Own developer platform public API spec', 'Conduct architectural trade-off audit with Principal Engineers', 'Master database indexing & queue dynamics']
      }
    ]
  },
  {
    id: 'role-product-ops-mgr',
    title: 'Product Operations Manager',
    jobFamily: 'Product Operations & Strategy',
    domain: 'Product Operating Models & Toolchains',
    roleFamilyCategory: 'product_business_ops',
    currentLevel: 'P4 (Senior)',
    targetLevel: 'P5 (Lead / Principal)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Supercharges product team velocity, consistency, and customer connectivity by designing scalable operating systems, feedback pipelines, experimentation guardrails, and telemetry toolchains.',
    overview: 'Product Operations sits at the vital intersection of Product, Data, Customer Success, and Operations. As product teams grow beyond 5 squads, chaos and duplication inevitably emerge. The Product Operations Manager creates the organizational architecture—from standardized discovery rituals to user interview pipelines—enabling PMs to spend more time building and less time dealing with operational friction.',
    coreResponsibilities: [
      'Design and govern the global Product Operating Rhythm (cadence, QBRs, roadmap planning)',
      'Manage and integrate the product stack (Linear, Amplitude, Coda, LaunchDarkly, UserTesting)',
      'Build continuous customer feedback loops aggregating Zendesk, Gong calls, and telemetry',
      'Standardize product discovery, RFC, and release readiness templates across squads',
      'Democratize data access and telemetry literacy across product managers and designers',
      'Bridge product and GTM functions for launch readiness, enablement, and feedback capture'
    ],
    scope: 'Org-wide impact across 10-30 product managers, 80+ engineers, and executive leadership.',
    decisionRights: [
      'Standardization of product documentation and PRD templates across all teams',
      'Selection and procurement of product management tools and telemetry platforms',
      'Approval of Launch Readiness criteria for enterprise-facing releases',
      'Design of feedback ingestion taxonomies and customer tagging systems'
    ],
    expectedImpact: 'Elimination of redundant product work, 40% reduction in discovery cycle times, and 100% executive visibility into roadmap milestone health.',
    typicalSeniority: '4 - 8 years in Product Management, BizOps, or Tech Operations.',
    keySkills: [
      'Product Toolchain Architecture',
      'Process Systems Thinking',
      'Qualitative & Quantitative Feedback Aggregation',
      'Experimentation Governance',
      'Cross-Functional Change Management',
      'Executive Dashboards & Reporting'
    ],
    businessKnowledge: [
      'SaaS Operating Cadences & OKR Cycles',
      'Software Development Life Cycle (SDLC) Governance',
      'Customer Success & Support Workflows',
      'Vendor Licensing & Procurement'
    ],
    technicalKnowledge: [
      'API Webhooks & Workflow Automation (Zapier, Make, Scripts)',
      'Analytics Instrumentation (Segment, Amplitude, Mixpanel)',
      'Feature Flagging Systems (LaunchDarkly, Statsig)',
      'Relational Data Schema Concepts'
    ],
    behavioralCompetencies: [
      'Empathetic Systems Design',
      'Diplomatic Change Management',
      'Relentless Simplification',
      'Unflappable Calm in Matrixed Chaos',
      'Extreme Attention to Workflow Friction'
    ],
    toolsAndPlatforms: ['Linear', 'Jira', 'Notion', 'Coda', 'Amplitude', 'Gong', 'Zendesk', 'Segment', 'LaunchDarkly'],
    commonKpis: [
      { metric: 'Discovery-to-Delivery Cycle Time', targetBenchmark: '25% reduction across org', importance: 'critical' },
      { metric: 'Product Toolchain Adoption', targetBenchmark: '> 90% compliance', importance: 'primary' },
      { metric: 'Customer Signal Ingestion Rate', targetBenchmark: '100% of major accounts tagged', importance: 'primary' },
      { metric: 'PM Sentiment / NPS', targetBenchmark: '> +45 internal score', importance: 'supporting' }
    ],
    typicalDeliverables: [
      { title: 'Product Operating System Blueprint', frequency: 'Annual', purpose: 'Defines cadence, templates, and accountability milestones for the whole product team.' },
      { title: 'Global Customer Signal Digest', frequency: 'Bi-weekly', purpose: 'Synthesizes enterprise customer feature requests, churn drivers, and usability friction.' },
      { title: 'Toolchain Health & Cost Audit', frequency: 'Quarterly', purpose: 'Reviews license utilization, workflow bottlenecks, and tool ROI.' }
    ],
    adjacentRoles: [
      { roleId: 'role-sr-product-manager', roleTitle: 'Senior Product Manager', overlapPercentage: 78, transferability: 'High', commonBridgeSkills: ['Roadmapping', 'User Feedback', 'Telemetry', 'Stakeholder Alignment'], notes: 'Direct transition back into owning a specific product surface.' },
      { roleId: 'role-bizops-mgr', roleTitle: 'Business Operations Manager', overlapPercentage: 82, transferability: 'High', commonBridgeSkills: ['Process Optimization', 'Executive Reporting', 'Cross-functional Rhythm'], notes: 'Seamless move into corporate-wide strategic operational leverage.' },
      { roleId: 'role-tpm', roleTitle: 'Technical Program Manager (TPM)', overlapPercentage: 75, transferability: 'High', commonBridgeSkills: ['Dependency Tracking', 'Release Cadence', 'Cross-team Delivery'], notes: 'Natural fit if technical systems dependency tracking is a personal strength.' }
    ],
    careerProgression: {
      icTrack: ['Product Ops Specialist (P3)', 'Senior Product Ops Manager (P4)', 'Staff / Lead Product Ops (P5)', 'Principal Product Operations Architect (P6)'],
      managementTrack: ['Senior Product Ops Manager (P4)', 'Head of Product Operations (M1)', 'Director of Product Strategy & Operations (M2)', 'VP of Product Operations (M3)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 3, proficiency: 'advanced', description: 'Deep knowledge of product tools, telemetry instrumentation, and automation workflows.', evidencePrompt: 'Architected automated integration between Gong, Zendesk, and Linear for customer voice capture.', rationale: 'Excellent automation and tool architecture mastery.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 4, proficiency: 'senior', description: 'Understands how product cadence impacts GTM revenue, release marketing, and customer renewals.', evidencePrompt: 'Harmonized release cycles with marketing campaigns to prevent revenue slippage.', rationale: 'Translates business needs into operational realities.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 4, proficiency: 'senior', description: 'Tackles systemic organizational friction, conflicting stakeholder incentives, and tool sprawl.', evidencePrompt: 'Consolidated 4 disparate issue tracking tools into a unified Linear workspace with zero data loss.', rationale: 'Solves complex organizational topologies.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 3, proficiency: 'advanced', description: 'Sets operational policies, template standards, and tooling guidelines for the department.', evidencePrompt: 'Made company-wide mandate on standardized release readiness checklists.', rationale: 'Strong authority over operating mechanisms.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 4, proficiency: 'senior', description: 'Amplifies customer voice so that engineering squads build the highest-value features.', evidencePrompt: 'Customer feedback loop surfaced critical compliance blocker 2 months prior to contract renewal.', rationale: 'Broad systemic multiplier on product quality.' },
      { key: 'business_impact', label: 'Business Impact', score: 3, proficiency: 'advanced', description: 'Reduces operational overhead and speeds up time-to-market for revenue-generating features.', evidencePrompt: 'Saved an estimated 400 PM engineering hours per quarter through streamlined intake.', rationale: 'Substantial efficiency and velocity multiplier.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 5, proficiency: 'strategic', description: 'Orchestrates the entire product division cadence, tooling, and cross-functional handoffs.', evidencePrompt: 'Managed annual planning rhythm across 12 squads and 140 technical contributors.', rationale: 'Primary operational core of the product organization.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 5, proficiency: 'strategic', description: 'Navigates PMs, Engineers, Designers, CPO, VP Marketing, Sales Leadership, and Support.', evidencePrompt: 'Facilitated quarterly roadmap alignment with 6 department heads without escalation to CEO.', rationale: 'Diplomatic linchpin of cross-functional alignment.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 4, proficiency: 'senior', description: 'Influences how the company builds products and allocates headcount across initiatives.', evidencePrompt: 'Resource utilization report prompted leadership to reallocate 2 squads to enterprise tier.', rationale: 'Trusted advisor to Head of Product.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 4, proficiency: 'senior', description: 'Acts as cultural catalyst for clarity, accountability, and psychological safety.', evidencePrompt: 'Spearheaded weekly product learning lunch and retrospectives.', rationale: 'Empowers others without direct authority.' }
    ],
    referenceEvaluations: [
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Leveling',
        levelOrScore: 'Level P4 (Senior Business / Operations Specialist)',
        rationale: 'Applies in-depth advanced operational concepts to solve organizational challenges. Operates with considerable autonomy across cross-functional departments.',
        marketAlignmentNotes: 'Radford Business Operations / Product Operations job family (Job Code 4104).',
        dimensions: [
          { name: 'Impact', weightOrScope: 'Broad', scoreOrBand: 'P4', interpretation: 'Improves organizational efficiency across entire product organization.' },
          { name: 'Complexity', weightOrScope: 'High', scoreOrBand: 'P4', interpretation: 'Designs complex cross-functional workflow architectures.' }
        ]
      },
      {
        frameworkId: 'mercer_ipe',
        frameworkName: 'Mercer IPE System',
        levelOrScore: 'Position Class 52',
        rationale: 'High communication negotiation across matrix; strong process innovation; broad functional knowledge of product development practices.',
        marketAlignmentNotes: 'Senior Cross-Functional Operations Specialist.',
        dimensions: [
          { name: 'Communication', weightOrScope: 'Diplomatic', scoreOrBand: 'Level 4', interpretation: 'Negotiates alignment across distinct product squads.' },
          { name: 'Innovation', weightOrScope: 'Process Systems', scoreOrBand: 'Level 4', interpretation: 'Designs new ways of working and operational frameworks.' }
        ]
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay Evaluation',
        levelOrScore: '510 Hay Points (Grade 18)',
        rationale: 'High integration Know-How across diverse functions; problem solving focused on organizational friction; contributory impact on departmental performance.',
        marketAlignmentNotes: 'Senior Functional Specialist in global grading charts.',
        dimensions: [
          { name: 'Know-How', weightOrScope: 'Integration', scoreOrBand: '240 pts', interpretation: 'Integrates specialized product tools with organizational workflows.' },
          { name: 'Accountability', weightOrScope: 'Contributory', scoreOrBand: '150 pts', interpretation: 'Contributory impact on product delivery and operational health.' }
        ]
      },
      {
        frameworkId: 'wtw_ggs',
        frameworkName: 'WTW Global Grading System',
        levelOrScore: 'Grade 12-13 (Operations Specialist)',
        rationale: 'Applies sophisticated methodology to enhance cross-functional efficiency; trusted counsel to product executives.',
        marketAlignmentNotes: 'Top Senior Professional Band.',
        dimensions: [
          { name: 'Problem Solving', weightOrScope: 'Systemic', scoreOrBand: 'GGS 12', interpretation: 'Resolves systemic friction in product development lifecycles.' }
        ]
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band Method',
        levelOrScore: 'Band D (Process Optimization & Interpretive)',
        rationale: 'Determines the systems, processes, and rules of engagement by which multiple product squads execute their work.',
        marketAlignmentNotes: 'Interpretive systems architect decision rights.',
        dimensions: [
          { name: 'Decision Authority', weightOrScope: 'Interpretive', scoreOrBand: 'Band D', interpretation: 'Selects the operational methods and tools used across squads.' }
        ]
      }
    ],
    levelMapping: {
      careerosInferredLevel: 'P4 / Senior Product Operations Specialist',
      levelCode: 'P4',
      icEquivalent: 'Lead / Principal Product Operations Architect (P5)',
      managementEquivalent: 'Head of Product Operations / Director of Product Strategy & Ops (M1/M2)',
      scopeSummary: {
        roleScope: 'Entire product organization (10-30 PMs, 80+ engineers, design, data).',
        decisionScope: 'Toolchain architecture, documentation standards, release readiness protocols.',
        impactScope: 'Cycle time, PM efficiency, telemetry completeness, GTM alignment.',
        complexity: 'Solving organizational friction and incentive misalignment in high-growth tech.',
        leadershipScope: 'High influence without direct reports; leads cross-functional working groups.'
      },
      referenceFrameworkLevels: {
        kornFerryHay: '510 Points (Grade 18)',
        mercerIpe: 'Position Class 52',
        wtwGgs: 'Grade 12-13 (Specialist)',
        aonRadford: 'P4 (Senior Professional)',
        patterson: 'Band D (Interpretive)'
      },
      evidenceRationale: [
        'Radford P4: Solves complex organizational challenges affecting multiple squads.',
        'Mercer IPE 52: Matrix communication complexity across multiple disciplines.',
        'Patterson Band D: Decides operational frameworks and toolchain standards across the group.'
      ]
    },
    competencies: [
      {
        id: 'comp-ops-process',
        name: 'Product Operating Cadence Design',
        category: 'operational',
        requiredLevel: 'senior',
        description: 'Designs and iterates the rhythm of business: sprint reviews, quarterly planning, and retrospectives.',
        externalFrameworkRefs: [
          { framework: 'SFIA', codeOrLevel: 'Level 5 (Ensure, advise)', description: 'Designs organizational business processes and methods.' }
        ]
      },
      {
        id: 'comp-ops-tooling',
        name: 'Product Stack Architecture & Integrations',
        category: 'technical',
        requiredLevel: 'senior',
        description: 'Evaluates, configures, and automates tools like Linear, Amplitude, Coda, LaunchDarkly, and Gong.',
        externalFrameworkRefs: [
          { framework: 'O*NET', codeOrLevel: '15-1299.09', description: 'Information Technology Project Managers.' }
        ]
      },
      {
        id: 'comp-ops-signals',
        name: 'Customer Voice & Feedback Loops',
        category: 'product',
        requiredLevel: 'senior',
        description: 'Aggregates qualitative and quantitative feedback into categorized, actionable repositories for squads.',
        externalFrameworkRefs: [
          { framework: 'ESCO', codeOrLevel: '2431.1', description: 'Market research and customer intelligence specialist.' }
        ]
      },
      {
        id: 'comp-ops-change',
        name: 'Diplomatic Change Management',
        category: 'leadership',
        requiredLevel: 'senior',
        description: 'Rolls out new workflows without alienating stubborn engineers or busy PMs.',
        externalFrameworkRefs: [
          { framework: 'SHL', codeOrLevel: 'Leading & Deciding', description: 'Demonstrates initiative and initiates action in team processes.' }
        ]
      }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-product-ops-mgr',
        toRoleId: 'role-sr-product-manager',
        toRoleTitle: 'Senior Product Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 84,
        transferabilityLevel: 'High',
        skillOverlapPercentage: 80,
        skillOverlapItems: ['Discovery Insights', 'Telemetry Analysis', 'Stakeholder Communication', 'Backlog Prioritization'],
        skillGaps: ['Direct PRD Authoring for Squads', 'Direct Feature Ownership & Trade-offs'],
        requiredExperience: 'Direct experience leading a cross-functional squad through feature discovery to GA.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Transitions back to direct ownership of product surface with deep empathy for operational best practices.',
        recommendedPathway: ['Co-own a feature launch with a Senior PM', 'Run user discovery sessions independently', 'Write 2 end-to-end technical PRDs']
      },
      {
        fromRoleId: 'role-product-ops-mgr',
        toRoleId: 'role-bizops-mgr',
        toRoleTitle: 'Business Operations Manager (BizOps)',
        toRoleTrack: 'hybrid',
        transferabilityScore: 88,
        transferabilityLevel: 'Very High',
        skillOverlapPercentage: 85,
        skillOverlapItems: ['Process Systems', 'Executive Reporting', 'Cross-functional Coordination', 'Tool Integration'],
        skillGaps: ['P&L Modeling', 'Corporate Finance', 'Contract Negotiation'],
        requiredExperience: 'Experience conducting business planning and financial analysis.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Broadens impact from product organization to total company corporate strategy.',
        recommendedPathway: ['Partner with Finance on SaaS metrics audit', 'Lead company-wide OKR consolidation', 'Build financial ROI models for tech investments']
      }
    ]
  },
  {
    id: 'role-bizops-mgr',
    title: 'Business Operations Manager (BizOps)',
    jobFamily: 'Strategy & Business Operations',
    domain: 'Enterprise Strategy & Cross-Functional Execution',
    roleFamilyCategory: 'product_business_ops',
    currentLevel: 'P4 (Senior)',
    targetLevel: 'P5 (Staff / Director of BizOps)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Serves as an internal strategic consultant and operational strike team, solving the company’s most ambiguous high-stakes problems across Product, Sales, Finance, and Operations.',
    overview: 'Business Operations (BizOps) acts as the operational nervous system for high-growth tech companies. Whether evaluating new international market entry, restructuring pricing models, overhauling customer onboarding economics, or leading M&A integration, the BizOps Manager blends rigorous quantitative modeling with hands-on cross-functional execution.',
    coreResponsibilities: [
      'Lead strategic projects commissioned by CEO, COO, and VP of Product',
      'Build quantitative financial, operational, and unit economic models',
      'Diagnose operational bottlenecks across Product, Sales, and Customer Success',
      'Drive corporate planning, annual budget allocations, and OKR architecture',
      'Conduct competitive intelligence and market entry feasibility studies',
      'Design incentive compensation and resource allocation structures'
    ],
    scope: 'Cross-functional company-wide scope touching multiple business units, C-Suite stakeholders, and strategic financial levers.',
    decisionRights: [
      'Methodology for annual financial and headcount planning models',
      'Operational definitions of core company north star metrics',
      'Resource reallocation recommendations for executive committee approval',
      'Governance of cross-departmental initiative milestone tracking'
    ],
    expectedImpact: 'Direct contribution to EBITDA margin, annual revenue growth, operational efficiency, and rapid execution of executive strategic bets.',
    typicalSeniority: '4 - 8 years in Top-Tier Management Consulting, Investment Banking, BizOps, or Strategic Product Operations.',
    keySkills: [
      'Financial & Unit Economic Modeling (Excel, Sheets)',
      'Structured Problem Solving & Issue Trees (MECE)',
      'Executive Storytelling (Minto Pyramid, C-Suite Decks)',
      'Quantitative Telemetry & SQL',
      'Cross-Functional Project Leadership',
      'Contract & Vendor Commercial Optimization'
    ],
    businessKnowledge: [
      'SaaS P&L Structure, Gross Margin, and Rule of 40',
      'Go-To-Market Funnel Economics (LTV/CAC, Payback Period)',
      'International Market Expansion & Regulatory Dynamics',
      'Corporate Finance & Board Reporting'
    ],
    technicalKnowledge: [
      'Relational Databases & Data Warehouses (Snowflake, BigQuery)',
      'BI Dashboard Engineering (Looker, Tableau)',
      'CRM & Billing Data Topologies (Salesforce, Stripe Billing)',
      'API Integration Basics'
    ],
    behavioralCompetencies: [
      'High Tolerance for Ambiguity',
      'Executive Presence & Gravitas',
      'Structured Analytical Rigor',
      'Bias for Operational Pragmatism',
      'Unbiased Objective Perspective'
    ],
    toolsAndPlatforms: ['Excel', 'Looker', 'Salesforce', 'BigQuery', 'Notion', 'Slack', 'Linear', 'Stripe'],
    commonKpis: [
      { metric: 'Strategic Project ROI', targetBenchmark: '> 4x impact on target metric', importance: 'critical' },
      { metric: 'Annual Planning Completion Rate', targetBenchmark: '100% on schedule with zero blind spots', importance: 'primary' },
      { metric: 'Gross Margin Expansion', targetBenchmark: '+200 bps year-over-year', importance: 'primary' }
    ],
    typicalDeliverables: [
      { title: 'Executive Strategic Memorandum & Financial Model', frequency: 'Ad-hoc / Monthly', purpose: 'Evaluates major business bets (e.g. self-serve pricing shift, regional expansion).' },
      { title: 'Quarterly Operating Review (QOR) Synthesis', frequency: 'Quarterly', purpose: 'Consolidates company-wide performance against financial and operational targets.' },
      { title: 'Operational Efficiency Teardown', frequency: 'Bi-annual', purpose: 'Identifies $500k+ in vendor, tool, or operational process redundancies.' }
    ],
    adjacentRoles: [
      { roleId: 'role-product-ops-mgr', roleTitle: 'Product Operations Manager', overlapPercentage: 82, transferability: 'High', commonBridgeSkills: ['Process Optimization', 'Toolchain Architecture', 'Cross-Functional Rhythm'], notes: 'Direct pivot into product-focused operational leverage.' },
      { roleId: 'role-sr-product-manager', roleTitle: 'Senior Product Manager', overlapPercentage: 68, transferability: 'Medium', commonBridgeSkills: ['Problem Structuring', 'Unit Economics', 'Executive Presentation'], notes: 'Strong path for BizOps managers passionate about building customer-facing software.' },
      { roleId: 'role-tpm', roleTitle: 'Technical Program Manager', overlapPercentage: 72, transferability: 'High', commonBridgeSkills: ['Program Governance', 'Cross-Department Alignment', 'Milestone Tracking'], notes: 'Natural fit when managing complex technical rollout initiatives.' }
    ],
    careerProgression: {
      icTrack: ['BizOps Associate (P3)', 'Senior BizOps Manager (P4)', 'Staff / Principal BizOps Lead (P5)', 'Distinguished Corporate Strategist (P6)'],
      managementTrack: ['Senior BizOps Manager (P4)', 'Head of BizOps (M1)', 'Director of Strategy & Operations (M2)', 'VP of Strategy & Operations / Chief of Staff (M3)', 'Chief Operating Officer (M4)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 3, proficiency: 'advanced', description: 'Strong quantitative modeling, financial modeling, SQL, and database concepts.', evidencePrompt: 'Built three-statement financial model projecting expansion impact on cash burn.', rationale: 'Advanced financial and data manipulation fluency.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 5, proficiency: 'strategic', description: 'Comprehensive understanding of P&L, SaaS valuation drivers, market dynamics, and corporate finance.', evidencePrompt: 'Led restructuring of enterprise contract payment terms to optimize working capital.', rationale: 'Top-tier business and commercial strategy.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 5, proficiency: 'strategic', description: 'Solves the company’s most unstructured problems where no playbook exists.', evidencePrompt: 'Designed response to sudden competitor 40% price cut within 72 hours.', rationale: 'Thrives in unstructured ambiguity.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 4, proficiency: 'senior', description: 'Directly crafts recommendations that drive C-Suite and Board capital allocation.', evidencePrompt: 'Recommendation to delay EMEA expansion saved $2.1M in wasted GTM spend.', rationale: 'High influence over resource distribution.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 3, proficiency: 'advanced', description: 'Indirect product impact through pricing, packaging, and strategic focus.', evidencePrompt: 'Recommended deprecation of low-margin legacy product tier.', rationale: 'Influences product strategy from a commercial angle.' },
      { key: 'business_impact', label: 'Business Impact', score: 5, proficiency: 'strategic', description: 'Directly moves bottom-line profitability, EBITDA, and company cash efficiency.', evidencePrompt: 'Discovered and eliminated $1.4M in cloud compute redundancies with engineering leads.', rationale: 'Massive quantifiable commercial footprint.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 4, proficiency: 'senior', description: 'Touches multiple departments across the corporate ecosystem.', evidencePrompt: 'Aligned 5 department heads on shared OKRs and SLA handoffs.', rationale: 'Cross-functional orchestrator.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 5, proficiency: 'strategic', description: 'Works directly with CEO, CFO, Board members, and department heads on sensitive initiatives.', evidencePrompt: 'Delivered board meeting slide deck and handled CFO stress testing.', rationale: 'High executive diplomacy and emotional intelligence.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 5, proficiency: 'strategic', description: 'Shapes company-level strategy, annual budget allocations, and M&A thesis.', evidencePrompt: 'Co-authored 3-year strategic growth horizon document with CEO.', rationale: 'Trusted right hand to executive leadership.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 4, proficiency: 'senior', description: 'Takes extreme ownership of company health; acts as cultural exemplar of analytical integrity.', evidencePrompt: 'Mentored BizOps analysts in advanced SQL modeling and Minto pyramid narrative.', rationale: 'High agency and intellectual honesty.' }
    ],
    referenceEvaluations: [
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Leveling',
        levelOrScore: 'Level P4 (Senior Business Operations & Strategy)',
        rationale: 'Addresses broad operational and strategic dilemmas with enterprise-wide implications. Operates independently under executive direction.',
        marketAlignmentNotes: 'Radford Strategy & Business Operations Job Code 4104.',
        dimensions: [
          { name: 'Impact', weightOrScope: 'Enterprise', scoreOrBand: 'P4', interpretation: 'Direct impact on corporate financial and operational efficiency.' }
        ]
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay Evaluation',
        levelOrScore: '530 Hay Points (Grade 18-19)',
        rationale: 'High specialized Know-How (E II 3 = 264 pts), strategic Problem Solving (E 4 (50%) = 132 pts), and Contributory Accountability to executive decisions (E 3 C = 134 pts).',
        marketAlignmentNotes: 'Corporate Strategy Senior Manager band.',
        dimensions: [
          { name: 'Know-How', weightOrScope: '49%', scoreOrBand: '264 pts', interpretation: 'Advanced management science, corporate finance, and business systems.' },
          { name: 'Problem Solving', weightOrScope: '25%', scoreOrBand: '132 pts', interpretation: 'Uncharted strategic problem-solving.' }
        ]
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band Method',
        levelOrScore: 'Band D-E (Interpretive to Programmatic)',
        rationale: 'Translates policy-level goals (Band E/F) into operational reality (Band D) and provides critical decision support for executive steering.',
        marketAlignmentNotes: 'High-level strategic advisory decision band.',
        dimensions: [
          { name: 'Decision Authority', weightOrScope: 'Strategic Advisory', scoreOrBand: 'Band D/E', interpretation: 'Influences strategic resource allocation across business units.' }
        ]
      }
    ],
    levelMapping: {
      careerosInferredLevel: 'P4 / Senior Business Operations Partner',
      levelCode: 'P4',
      icEquivalent: 'Principal Strategist / Staff BizOps Architect (P5)',
      managementEquivalent: 'Director of Business Operations / Chief of Staff (M2)',
      scopeSummary: {
        roleScope: 'Cross-functional enterprise scope across C-Suite and business units.',
        decisionScope: 'Financial model methodology, planning governance, allocation proposals.',
        impactScope: 'Company EBITDA, gross margin, cash runway, and executive execution velocity.',
        complexity: 'Solving high-stakes, ill-defined strategic business dilemmas.',
        leadershipScope: 'Strategic influence across executive stakeholders.'
      },
      referenceFrameworkLevels: {
        kornFerryHay: '530 Points (Grade 18)',
        mercerIpe: 'Position Class 53',
        wtwGgs: 'Grade 13 (Expert IC)',
        aonRadford: 'P4 (Senior Professional)',
        patterson: 'Band D/E (Interpretive/Programmatic)'
      },
      evidenceRationale: [
        'Radford P4: Solves complex problems where data requires multi-dimensional business evaluation.',
        'Hay Know-How: High integration of strategy, finance, and cross-functional operations.',
        'Patterson D-E: Translates C-Suite policy into concrete operational allocations.'
      ]
    },
    competencies: [
      {
        id: 'comp-bizops-modeling',
        name: 'Financial & Unit Economic Modeling',
        category: 'business',
        requiredLevel: 'strategic',
        description: 'Constructs robust 3-statement models, cohort LTV/CAC calculators, and sensitivity analyses.',
        externalFrameworkRefs: [
          { framework: 'O*NET', codeOrLevel: '13-1111.00', description: 'Management Analysts: Analyze business procedures.' }
        ]
      },
      {
        id: 'comp-bizops-synthesis',
        name: 'Executive Narrative & Minto Pyramid',
        category: 'business',
        requiredLevel: 'strategic',
        description: 'Synthesizes complex, messy qualitative and quantitative signals into crisp 1-page executive memos.',
        externalFrameworkRefs: [
          { framework: 'SHL', codeOrLevel: 'Formulating Strategies & Concepts', description: 'Works strategically to realize organizational goals.' }
        ]
      },
      {
        id: 'comp-bizops-sql',
        name: 'Database Querying & Analytics',
        category: 'technical',
        requiredLevel: 'advanced',
        description: 'Writes optimized SQL queries to extract raw transactional and telemetry data from data lakes.',
        externalFrameworkRefs: [
          { framework: 'SFIA', codeOrLevel: 'Level 4 (Enable)', description: 'Conducts quantitative data analysis.' }
        ]
      }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-bizops-mgr',
        toRoleId: 'role-product-ops-mgr',
        toRoleTitle: 'Product Operations Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 88,
        transferabilityLevel: 'Very High',
        skillOverlapPercentage: 85,
        skillOverlapItems: ['Process Design', 'Tool Integration', 'Metric Governance', 'Cross-Functional Cadence'],
        skillGaps: ['Deep Product Discovery Rituals', 'Specific Product Tooling (Figma, LaunchDarkly)'],
        requiredExperience: 'Exposure to product development cycles and engineering squads.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Brings rigorous financial and operational discipline to product organizations.',
        recommendedPathway: ['Embed with product team for 1 quarter', 'Learn modern product stack', 'Co-lead product planning rhythm']
      },
      {
        fromRoleId: 'role-bizops-mgr',
        toRoleId: 'role-sr-product-manager',
        toRoleTitle: 'Senior Product Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 76,
        transferabilityLevel: 'High',
        skillOverlapPercentage: 72,
        skillOverlapItems: ['Problem Structuring', 'Unit Economics', 'Executive Presentation', 'Customer Empathy'],
        skillGaps: ['Technical Spec Writing (PRDs)', 'Daily Agile/Scrum Cadence', 'UX Wireframing'],
        requiredExperience: 'Demonstrated collaboration with engineers on digital tooling or software features.',
        estimatedTransitionDifficulty: 'Moderate',
        strategicValue: 'Supercharges PM effectiveness with unmatched business acumen and executive gravitas.',
        recommendedPathway: ['Shadow a Lead PM on PRD creation', 'Conduct customer discovery interviews', 'Take on product feature ownership in growth or monetization']
      }
    ]
  },
  {
    id: 'role-tpm',
    title: 'Technical Program Manager (TPM)',
    jobFamily: 'Program & Engineering Management',
    domain: 'Distributed Infrastructure & Complex Systems Delivery',
    roleFamilyCategory: 'technology',
    currentLevel: 'P4 (Senior)',
    targetLevel: 'P5 (Staff / Principal TPM)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Orchestrates complex, multi-squad engineering programs spanning distributed architectures, cloud migrations, compliance boundaries, and platform reliability.',
    overview: 'Unlike generic project managers who shuffle task cards, Technical Program Managers (TPMs) hold deep engineering fluent conversations. They map intricate architectural dependency graphs, anticipate systemic bottlenecks months before launch, enforce technical rigor, and ensure that massive multi-million dollar engineering initiatives deliver on time with zero operational failure.',
    coreResponsibilities: [
      'Architect cross-functional engineering schedules across 5-10 technical squads',
      'Identify and remediate critical path architectural dependencies and API blockers',
      'Drive post-mortems, reliability reviews, and disaster recovery exercise schedules',
      'Establish technical risk registers and clear executive escalation paths',
      'Interface with Security, Legal, and Compliance on regulatory audits (SOC2, FedRAMP, GDPR)',
      'Lead company-wide infrastructure migrations (e.g. cloud migrations, Kubernetes adoption)'
    ],
    scope: 'Multi-squad engineering programs (40-100+ engineers) with direct bearing on platform uptime, regulatory compliance, and architectural modernization.',
    decisionRights: [
      'Sign-off on production release milestone schedules and deployment freezes',
      'Enforcement of architectural dependency gating before integration testing',
      'Determination of technical risk mitigation strategies and emergency escalations',
      'Definition of cross-team engineering communication protocols'
    ],
    expectedImpact: 'Zero missed regulatory deadlines, 99.99% multi-system release success rate, and elimination of multi-week dependency deadlocks between squads.',
    typicalSeniority: '5 - 10 years in Software Engineering, Systems Architecture, or Technical Program Management.',
    keySkills: [
      'Technical Dependency Mapping',
      'Distributed Systems Architecture Fluency',
      'Critical Path & Risk Management',
      'Cross-Team Conflict De-escalation',
      'Security & Regulatory Compliance Auditing',
      'Executive Milestone Reporting'
    ],
    businessKnowledge: [
      'Regulatory Compliance Standards (SOC2, ISO27001, HIPAA)',
      'Cloud Infrastructure Cost Driver Models',
      'Enterprise SLA / SLO Contracts',
      'Vendor SLA & Disaster Recovery Provisions'
    ],
    technicalKnowledge: [
      'Microservices & Service Mesh Topology',
      'Database Migration Strategies & Zero-Downtime Replication',
      'CI/CD Pipelines & Canary Deployment Stages',
      'Observability Stacks (Datadog, Prometheus, OpenTelemetry)'
    ],
    behavioralCompetencies: [
      'Uncompromising Technical Rigor',
      'Psychological Resilience Under Crisis',
      'Clarity in Complex Chaos',
      'Direct, Transparent Engineering Communication',
      'Proactive Anticipation of Failure Modes'
    ],
    toolsAndPlatforms: ['Jira / Linear', 'Confluence', 'GitHub Projects', 'Datadog', 'Lucidchart / Miro', 'PagerDuty', 'Slack'],
    commonKpis: [
      { metric: 'Critical Path Schedule Variance', targetBenchmark: '< 5% deviation', importance: 'critical' },
      { metric: 'Zero-Downtime Migration Success', targetBenchmark: '100% data integrity', importance: 'critical' },
      { metric: 'Dependency Blockers Mean Time to Unblock', targetBenchmark: '< 48 hours', importance: 'primary' }
    ],
    typicalDeliverables: [
      { title: 'Technical Program Charter & Dependency Architecture', frequency: 'Bi-annual', purpose: 'Maps all squad APIs, deliverables, and integration deadlines.' },
      { title: 'Executive Program Status & Risk Register', frequency: 'Weekly', purpose: 'Provides clear RAG (Red/Amber/Green) visibility and escalation needs.' },
      { title: 'Disaster Recovery & Failure Mode Analysis', frequency: 'Annual', purpose: 'Audits multi-region failover and system resilience.' }
    ],
    adjacentRoles: [
      { roleId: 'role-solutions-architect', roleTitle: 'Solutions Architect', overlapPercentage: 80, transferability: 'High', commonBridgeSkills: ['System Design', 'Enterprise Architecture', 'Technical Communication'], notes: 'Natural fit if technical architecture design is your core passion.' },
      { roleId: 'role-product-ops-mgr', roleTitle: 'Product Operations Manager', overlapPercentage: 75, transferability: 'High', commonBridgeSkills: ['Process Architecture', 'Stakeholder Alignment', 'Tooling Cadence'], notes: 'Great pivot if interested in product discovery and team empowerment.' },
      { roleId: 'role-tech-product-mgr', roleTitle: 'Technical Product Manager', overlapPercentage: 76, transferability: 'High', commonBridgeSkills: ['Technical Literacy', 'Cross-Squad Execution', 'Roadmapping'], notes: 'Transition to owning product outcomes rather than delivery timelines.' }
    ],
    careerProgression: {
      icTrack: ['Senior TPM (P4)', 'Staff TPM (P5)', 'Principal TPM (P6)', 'Distinguished Systems Program Partner (P7)'],
      managementTrack: ['Senior TPM (P4)', 'Manager, Technical Program Management (M1)', 'Director of Technical Programs (M2)', 'VP of Engineering Operations / Infrastructure (M3)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 5, proficiency: 'strategic', description: 'Deep technical comprehension of distributed systems, APIs, cloud infrastructure, and deployment pipelines.', evidencePrompt: 'Led multi-region AWS to GCP database failover without dropped packets.', rationale: 'Engineers respect and trust technical assessments.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 3, proficiency: 'advanced', description: 'Solid understanding of SLAs, regulatory risk, and operational risk mitigation.', evidencePrompt: 'Prevented $200k in SLA penalty breach through proactive capacity provisioning.', rationale: 'Strong operational and regulatory acumen.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 5, proficiency: 'strategic', description: 'Untangles massively interdependent multi-squad architectures and critical paths.', evidencePrompt: 'Resolved circular dependency deadlock between payments engine and authentication service.', rationale: 'Master of architectural knot untying.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 4, proficiency: 'senior', description: 'Authoritative decisions on release gating, testing thresholds, and deployment freezes.', evidencePrompt: 'Ordered rollback of major release due to observed memory leak in staging.', rationale: 'Definitive delivery authority.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 4, proficiency: 'senior', description: 'Guarantees platform uptime, data reliability, and zero data loss for enterprise customers.', evidencePrompt: 'Directly preserved 99.99% availability during peak holiday traffic.', rationale: 'Guards customer trust and uptime.' },
      { key: 'business_impact', label: 'Business Impact', score: 4, proficiency: 'senior', description: 'Prevents catastrophic regulatory fines, SLA damages, and engineering thrash.', evidencePrompt: 'Delivered FedRAMP compliance audit 3 weeks ahead of target.', rationale: 'Critical risk reduction and efficiency.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 5, proficiency: 'strategic', description: 'Spans 40-100 engineers across multiple organizations and timezones.', evidencePrompt: 'Orchestrated migration cadence across 8 squads located in 4 countries.', rationale: 'Huge operational footprint.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 4, proficiency: 'senior', description: 'Manages engineering managers, principal architects, compliance officers, and CTO.', evidencePrompt: 'De-escalated heated architectural disagreement between security and platform leads.', rationale: 'High technical diplomacy.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 4, proficiency: 'senior', description: 'Influences company infrastructure roadmap and engineering standards.', evidencePrompt: 'Standards for microservice contracts adopted across the entire engineering department.', rationale: 'Broad technical policy influence.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 4, proficiency: 'senior', description: 'Exemplifies extreme ownership during incidents and high-stress delivery milestones.', evidencePrompt: 'Commanded incident bridge during critical Sev-1 outage until complete resolution.', rationale: 'Rock-solid under pressure.' }
    ],
    referenceEvaluations: [
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Leveling',
        levelOrScore: 'Level P4 (Senior Technical Program Manager)',
        rationale: 'Manages complex technical programs with high visibility and cross-functional dependencies. Requires deep technical knowledge and advanced project leadership.',
        marketAlignmentNotes: 'Radford Technical Program Management job family (Job Code 4106).',
        dimensions: [
          { name: 'Technical Depth', weightOrScope: 'High', scoreOrBand: 'P4', interpretation: 'Understands intricate architecture dependencies.' }
        ]
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay Evaluation',
        levelOrScore: '535 Hay Points (Grade 18-19)',
        rationale: 'High specialized technical Know-How combined with multi-team integration; high problem-solving complexity under tight deadlines.',
        marketAlignmentNotes: 'Senior Technical Practice Lead in global grading charts.',
        dimensions: [
          { name: 'Know-How', weightOrScope: 'Technical', scoreOrBand: '264 pts', interpretation: 'Extensive distributed systems and program management expertise.' }
        ]
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band Method',
        levelOrScore: 'Band D (Interpretive Systems Delivery)',
        rationale: 'Interprets technical strategy and decides exact execution gating, sequencing, and risk trade-offs.',
        marketAlignmentNotes: 'Interpretive technical decision authority.',
        dimensions: [
          { name: 'Decision Rights', weightOrScope: 'Gating Authority', scoreOrBand: 'Band D', interpretation: 'Decides production deployment readiness.' }
        ]
      }
    ],
    levelMapping: {
      careerosInferredLevel: 'P4 / Senior Technical Program Specialist',
      levelCode: 'P4',
      icEquivalent: 'Staff / Principal Technical Program Manager (P5/P6)',
      managementEquivalent: 'Director of Technical Program Management / Eng Operations (M2)',
      scopeSummary: {
        roleScope: 'Multi-squad engineering programs (40-100+ engineers).',
        decisionScope: 'Release gating, architectural dependency scheduling, risk mitigation.',
        impactScope: 'Zero-downtime reliability, regulatory compliance, engineering velocity.',
        complexity: 'Solving complex distributed technical dependencies under tight deadlines.',
        leadershipScope: 'Matrixed technical leadership without direct reports.'
      },
      referenceFrameworkLevels: {
        kornFerryHay: '535 Points (Grade 18)',
        mercerIpe: 'Position Class 53',
        wtwGgs: 'Grade 13 (Technical Specialist)',
        aonRadford: 'P4 (Senior Professional)',
        patterson: 'Band D (Interpretive)'
      },
      evidenceRationale: [
        'Radford P4: Solves complex engineering synchronization challenges.',
        'Hay Accountability: Primary impact on timely delivery of critical infrastructure bets.',
        'Patterson Band D: Exercises independent gating authority over production releases.'
      ]
    },
    competencies: [
      {
        id: 'comp-tpm-dependencies',
        name: 'Technical Dependency Architecture',
        category: 'technical',
        requiredLevel: 'senior',
        description: 'Maps complex microservice and API dependencies and identifies circular deadlocks.',
        externalFrameworkRefs: [
          { framework: 'SFIA', codeOrLevel: 'Level 5 (Ensure, advise)', description: 'Technical program and project management.' }
        ]
      },
      {
        id: 'comp-tpm-risk',
        name: 'Technical Risk Management',
        category: 'technical',
        requiredLevel: 'senior',
        description: 'Anticipates edge-case failure modes, latency spikes, and regulatory compliance tripwires.',
        externalFrameworkRefs: [
          { framework: 'O*NET', codeOrLevel: '15-1299.09', description: 'Information Technology Project Managers.' }
        ]
      }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-tpm',
        toRoleId: 'role-solutions-architect',
        toRoleTitle: 'Solutions Architect',
        toRoleTrack: 'hybrid',
        transferabilityScore: 82,
        transferabilityLevel: 'High',
        skillOverlapPercentage: 80,
        skillOverlapItems: ['System Architecture', 'Technical Communication', 'Risk Assessment', 'Security Review'],
        skillGaps: ['Customer Pre-Sales Engagement', 'Commercial Proposal Scoping'],
        requiredExperience: 'Direct customer-facing technical design experience.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Transitions internal program leadership to external revenue-generating client architecture.',
        recommendedPathway: ['Shadow enterprise customer architecture calls', 'Design reference implementation architecture', 'Master cloud provider sizing economics']
      }
    ]
  },
  {
    id: 'role-solutions-architect',
    title: 'Solutions Architect',
    jobFamily: 'Solutions & Customer Engineering',
    domain: 'Enterprise Cloud Systems & Integration Architecture',
    roleFamilyCategory: 'hybrid_cross_functional',
    currentLevel: 'P4 (Senior)',
    targetLevel: 'P5 (Staff / Principal Architect)',
    track: 'hybrid',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Architects scalable, secure, and resilient enterprise system integrations, translating complex client business requirements into production cloud architectures.',
    overview: 'Solutions Architects bridge the gap between enterprise clients and core engineering. They are deeply trusted technical advisors who design custom integrations, evaluate security postures, design data flows, and ensure that complex software deployments succeed in the client’s real-world environment.',
    coreResponsibilities: [
      'Design enterprise-grade cloud topologies and API integration blueprints',
      'Conduct technical discovery with client CTOs, CISOs, and Chief Enterprise Architects',
      'Author technical RFCs, security whitepapers, and reference architectures',
      'Ensure compliance with data residency, security standards, and identity federation',
      'Provide technical guidance to customer engineering and professional services squads',
      'Feed field architectural requirements back into the core Product roadmap'
    ],
    scope: 'High-value enterprise customer deals ($500k - $5M ARR per client), partner ecosystems, and strategic reference architectures.',
    decisionRights: [
      'Technical architecture sign-off for enterprise bespoke integrations',
      'Validation of security postures and compliance exceptions',
      'Selection of recommended partner tools and reference cloud topologies',
      'Technical feasibility sign-off on enterprise contract statements of work (SOW)'
    ],
    expectedImpact: 'Shortened enterprise sales cycles, 100% technical win rate on competitive bake-offs, and zero post-deployment architectural rewrites.',
    typicalSeniority: '5 - 10 years in Cloud Engineering, Solutions Engineering, or Software Architecture.',
    keySkills: [
      'Cloud Architecture (AWS / GCP / Azure)',
      'Enterprise Identity & Access (SSO, SAML, OAuth, OIDC)',
      'API Security & Gateway Topologies',
      'Executive Technical Advisory',
      'Data Residency & Cryptographic Compliance',
      'Proof-of-Concept (PoC) Engineering'
    ],
    businessKnowledge: [
      'Enterprise Procurement & RFP Cycles',
      'Total Cost of Ownership (TCO) & Cloud ROI Modeling',
      'Commercial Contract SOW Structuring',
      'Partner Channel Economics'
    ],
    technicalKnowledge: [
      'Kubernetes, Docker & Container Orchestration',
      'Relational & Document Databases (PostgreSQL, MongoDB, DynamoDB)',
      'Enterprise Messaging (Kafka, SQS, RabbitMQ)',
      'Zero-Trust Security & Network Topologies (VPC Peering, PrivateLink)'
    ],
    behavioralCompetencies: [
      'Executive Gravitas with C-Suite Engineers',
      'High Empathy for Client Operational Frustrations',
      'Patience in Navigating Corporate Red Tape',
      'Absolute Honesty Regarding Technical Trade-offs',
      'Clear, Visual System Diagramming'
    ],
    toolsAndPlatforms: ['AWS / GCP / Azure Consoles', 'Terraform', 'Postman', 'Lucidchart', 'Docker', 'GitHub', 'Salesforce'],
    commonKpis: [
      { metric: 'Enterprise Technical Win Rate', targetBenchmark: '> 85%', importance: 'critical' },
      { metric: 'Average Time to Production Launch', targetBenchmark: '< 60 days for Tier 1 accounts', importance: 'primary' },
      { metric: 'Post-Sale Architecture Defect Rate', targetBenchmark: '< 2% rework needed', importance: 'primary' }
    ],
    typicalDeliverables: [
      { title: 'Enterprise Reference Architecture Blueprint', frequency: 'Per client deal', purpose: 'Comprehensive cloud topology diagram, network flows, and authentication specs.' },
      { title: 'Security & Compliance Threat Model', frequency: 'Per enterprise deal', purpose: 'Preempts CISO audit questions regarding encryption, data residency, and SOC2.' },
      { title: 'Product Feedback & Field Request RFC', frequency: 'Monthly', purpose: 'Synthesizes missing product features blocking $1M+ pipeline.' }
    ],
    adjacentRoles: [
      { roleId: 'role-tech-product-mgr', roleTitle: 'Technical Product Manager', overlapPercentage: 82, transferability: 'High', commonBridgeSkills: ['Technical Architecture', 'Client Requirements', 'API Design'], notes: 'Direct transition into owning the core product features customers ask for.' },
      { roleId: 'role-tpm', roleTitle: 'Technical Program Manager', overlapPercentage: 80, transferability: 'High', commonBridgeSkills: ['System Design', 'Risk Evaluation', 'Technical Coordination'], notes: 'Natural pivot for architects who enjoy complex multi-squad implementation.' }
    ],
    careerProgression: {
      icTrack: ['Solutions Architect (P3)', 'Senior Solutions Architect (P4)', 'Staff / Principal Solutions Architect (P5)', 'Fellow / Distinguished Enterprise Architect (P6)'],
      managementTrack: ['Senior Solutions Architect (P4)', 'Solutions Architecture Manager (M1)', 'Director of Solutions Engineering & Architecture (M2)', 'VP of Customer Engineering / Field CTO (M3)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 5, proficiency: 'strategic', description: 'Deep hands-on and theoretical mastery of cloud architecture, identity federation, security, and networking.', evidencePrompt: 'Designed multi-region active-active cloud architecture complying with Swiss banking regulations.', rationale: 'World-class technical architecture depth.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 4, proficiency: 'senior', description: 'Understands enterprise procurement, TCO ROI models, and client industry compliance requirements.', evidencePrompt: 'Modeled 3-year cloud TCO proving $1.2M savings to client CFO.', rationale: 'Strong commercial and financial acumen.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 5, proficiency: 'strategic', description: 'Solves messy integration challenges in complex, legacy enterprise environments.', evidencePrompt: 'Architected bridge between client mainframe AS400 and modern GraphQL APIs.', rationale: 'Thrives in hybrid legacy-modern systems.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 4, proficiency: 'senior', description: 'Authoritative decisions on integration patterns and security validation for client accounts.', evidencePrompt: 'Rejected insecure client authentication proposal and designed hardened mTLS alternative.', rationale: 'Final architectural gating on enterprise deployments.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 5, proficiency: 'strategic', description: 'Directly unlocks customer value and ensures software works seamlessly in enterprise production.', evidencePrompt: 'Integration enabled Fortune 50 company to process 12M customer transactions daily.', rationale: 'Customer experience depends on this architecture.' },
      { key: 'business_impact', label: 'Business Impact', score: 5, proficiency: 'strategic', description: 'Directly unblocks tens of millions in enterprise ARR pipeline and prevents customer churn.', evidencePrompt: 'Architectural solution unblocked $3.8M annual recurring contract.', rationale: 'Immense revenue enablement power.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 3, proficiency: 'advanced', description: 'Coordinates with client engineering teams and internal customer success.', evidencePrompt: 'Guided 12 client engineers through staging deployment.', rationale: 'Focused operational footprint on strategic accounts.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 5, proficiency: 'strategic', description: 'Navigates client CTOs, CISOs, compliance officers, and internal sales and engineering leads.', evidencePrompt: 'Convinced client CISO of data residency safety during high-stakes audit.', rationale: 'Top-tier executive technical diplomacy.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 4, proficiency: 'senior', description: 'Directly shapes core product roadmap based on high-value field requirements.', evidencePrompt: 'Field findings led product team to build automated VPC peering into core product.', rationale: 'Direct voice into product strategy.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 4, proficiency: 'senior', description: 'Champions technical excellence and acts as trusted advisor to client leadership.', evidencePrompt: 'Mentored 3 junior solutions engineers through cloud certification.', rationale: 'Technical role model.' }
    ],
    referenceEvaluations: [
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Leveling',
        levelOrScore: 'Level P4 (Senior Solutions Architect)',
        rationale: 'Applies advanced technical and architecture principles to enterprise-scale engagements. Leads customer discovery and integration strategy with minimal supervision.',
        marketAlignmentNotes: 'Radford Pre-Sales Solutions Architecture Job Code 4108.',
        dimensions: [
          { name: 'Technical Depth', weightOrScope: 'Enterprise', scoreOrBand: 'P4', interpretation: 'Expertise in modern cloud and security architectures.' }
        ]
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay Evaluation',
        levelOrScore: '550 Hay Points (Grade 19)',
        rationale: 'Exceptional specialized technical Know-How (E III 3 = 304 pts); problem solving under high ambiguity (E 4 (50%) = 152 pts); primary consultative accountability (E 1 P = 140 pts).',
        marketAlignmentNotes: 'Senior Enterprise Solutions Principal band.',
        dimensions: [
          { name: 'Know-How', weightOrScope: 'High Depth', scoreOrBand: '304 pts', interpretation: 'Advanced systems architecture, security, and enterprise integration.' }
        ]
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band Method',
        levelOrScore: 'Band D (Interpretive Systems Architecture)',
        rationale: 'Interprets customer enterprise constraints and determines the optimal architecture solution within product capabilities.',
        marketAlignmentNotes: 'High-level technical advisory decision band.',
        dimensions: [
          { name: 'Decision Scope', weightOrScope: 'Architectural Validation', scoreOrBand: 'Band D', interpretation: 'Validates and signs off on bespoke enterprise integration topologies.' }
        ]
      }
    ],
    levelMapping: {
      careerosInferredLevel: 'P4 / Senior Solutions Architect',
      levelCode: 'P4',
      icEquivalent: 'Staff / Principal Solutions Architect (P5/P6)',
      managementEquivalent: 'Director of Solutions Engineering / Field CTO (M2/M3)',
      scopeSummary: {
        roleScope: 'Multi-million ARR enterprise accounts, partner integrations, cloud blueprints.',
        decisionScope: 'Technical architecture feasibility, security posture sign-off, integration patterns.',
        impactScope: 'Enterprise pipeline conversion, customer lifetime value, platform reliability.',
        complexity: 'Solving complex distributed enterprise integrations and compliance challenges.',
        leadershipScope: 'Trusted technical advisor to client C-Suite; technical mentor to team.'
      },
      referenceFrameworkLevels: {
        kornFerryHay: '550 Points (Grade 19)',
        mercerIpe: 'Position Class 54',
        wtwGgs: 'Grade 13 (Expert IC)',
        aonRadford: 'P4 (Senior Professional)',
        patterson: 'Band D (Interpretive)'
      },
      evidenceRationale: [
        'Radford P4: Solves complex enterprise architecture problems with high commercial impact.',
        'Hay Know-How: High technical mastery combined with consultative diplomacy.',
        'Patterson Band D: Exercises binding authority on technical solution design.'
      ]
    },
    competencies: [
      {
        id: 'comp-sa-cloud',
        name: 'Enterprise Cloud Systems Topology',
        category: 'technical',
        requiredLevel: 'strategic',
        description: 'Designs resilient, multi-region cloud infrastructures across AWS, GCP, and Azure.',
        externalFrameworkRefs: [
          { framework: 'SFIA', codeOrLevel: 'Level 5 (Ensure, advise)', description: 'Systems architecture and design.' }
        ]
      },
      {
        id: 'comp-sa-security',
        name: 'Enterprise Security & Identity Federation',
        category: 'technical',
        requiredLevel: 'strategic',
        description: 'Implements SSO, SAML, OAuth2, mutual TLS, and zero-trust network boundaries.',
        externalFrameworkRefs: [
          { framework: 'O*NET', codeOrLevel: '15-1212.00', description: 'Information Security Analysts.' }
        ]
      }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-solutions-architect',
        toRoleId: 'role-tech-product-mgr',
        toRoleTitle: 'Technical Product Manager',
        toRoleTrack: 'ic',
        transferabilityScore: 84,
        transferabilityLevel: 'High',
        skillOverlapPercentage: 82,
        skillOverlapItems: ['System Architecture', 'API Specs', 'Enterprise Client Pain Points', 'Security Standards'],
        skillGaps: ['Product Backlog Management', 'Long-Term Roadmap Strategy', 'Sprint Prioritization'],
        requiredExperience: 'Experience guiding software development teams on feature scoping.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Channels deep understanding of enterprise client pain points into building world-class core platform features.',
        recommendedPathway: ['Partner with Platform PM on next-gen API spec', 'Lead customer advisory board sessions', 'Write PRD for self-serve integration portal']
      }
    ]
  },
  {
    id: 'role-tech-product-mgr',
    title: 'Technical Product Manager',
    jobFamily: 'Product Management',
    domain: 'Core Platforms, Developer APIs & Infrastructure',
    roleFamilyCategory: 'product',
    currentLevel: 'P4 (Senior)',
    targetLevel: 'P5 (Staff / Group PM)',
    track: 'ic',
    evaluationStatus: 'Evaluated',
    rolePurpose: 'Steers complex infrastructure, developer-facing platforms, and data pipelines, translating sophisticated technical constraints into developer-loved products.',
    overview: 'Technical Product Managers (TPMs) specialize in products where the user is an engineer, data scientist, or automated system. They operate with high technical fluency, writing unambiguous API specifications, modeling compute/storage costs, evaluating distributed database trade-offs, and ensuring that core platform components scale seamlessly.',
    coreResponsibilities: [
      'Define vision and roadmap for developer platform, APIs, SDKs, and data infrastructure',
      'Author technical PRDs and API specifications with precision',
      'Partner with Principal Engineers on architecture trade-offs, scalability, and technical debt',
      'Establish telemetry for platform performance (p99 latency, uptime, error rates, throughput)',
      'Conduct developer discovery interviews with internal and external engineers',
      'Model and optimize cloud infrastructure cost drivers and compute unit economics'
    ],
    scope: 'Core platform systems powering all downstream customer products, 20-30 platform engineers, multi-million compute budget.',
    decisionRights: [
      'API schema versioning and deprecation schedules',
      'Rate limiting policies, SLA tiers, and developer sandbox parameters',
      'Technical debt prioritization vs new platform capability backlog',
      'Selection of internal infrastructure and developer tooling platforms'
    ],
    expectedImpact: '99.99% platform API availability, reduction in internal squad integration cycle time by 50%, and sub-100ms p99 latency across core services.',
    typicalSeniority: '5 - 9 years of Software Engineering and Product Management experience.',
    keySkills: [
      'API Design & Schema Versioning (OpenAPI, gRPC, GraphQL)',
      'Distributed Systems Fluency',
      'Developer Experience (DX) & Documentation',
      'Cloud Infrastructure Cost Modeling',
      'Quantitative Telemetry & Querying (SQL, PromQL)',
      'Technical RFC Authoring'
    ],
    businessKnowledge: [
      'API Monetization & Usage-Based Pricing',
      'Enterprise SLA / SLO Contracts',
      'Developer Ecosystems & Open Source Dynamics',
      'Cloud Cost Optimization (FinOps)'
    ],
    technicalKnowledge: [
      'Microservices & Event-Driven Architecture (Kafka, RabbitMQ)',
      'Relational, Document & Vector Databases',
      'Authentication & Authorization (OAuth2, Scopes, JWT)',
      'CI/CD Pipelines & Containerization'
    ],
    behavioralCompetencies: [
      'Technical Empathy for Developers',
      'Obsession with Precision and Edge Cases',
      'Peer-Level Engineering Credibility',
      'Principled Prioritization of Technical Debt',
      'Relentless Simplification of Complex Interfaces'
    ],
    toolsAndPlatforms: ['Postman', 'GitHub', 'Datadog', 'Swagger/OpenAPI', 'Linear', 'BigQuery', 'Docker'],
    commonKpis: [
      { metric: 'API p99 Latency', targetBenchmark: '< 120ms', importance: 'critical' },
      { metric: 'Developer Time-to-First-Hello-World', targetBenchmark: '< 15 minutes', importance: 'critical' },
      { metric: 'Platform Availability SLA', targetBenchmark: '99.99%', importance: 'critical' }
    ],
    typicalDeliverables: [
      { title: 'Platform API Specification & Versioning RFC', frequency: 'Quarterly', purpose: 'Defines endpoint contracts, error envelopes, and idempotency mechanisms.' },
      { title: 'Cloud Infrastructure Unit Cost Breakdown', frequency: 'Monthly', purpose: 'Analyzes compute cost per active API transaction to protect gross margin.' },
      { title: 'Developer Portal Documentation & Quickstart Guides', frequency: 'Ongoing', purpose: 'Provides frictionless onboarding for internal and external engineers.' }
    ],
    adjacentRoles: [
      { roleId: 'role-sr-product-manager', roleTitle: 'Senior Product Manager', overlapPercentage: 85, transferability: 'High', commonBridgeSkills: ['Roadmapping', 'Prioritization', 'Telemetry', 'User Discovery'], notes: 'Smooth transition to user-facing or consumer software surfaces.' },
      { roleId: 'role-solutions-architect', roleTitle: 'Solutions Architect', overlapPercentage: 82, transferability: 'High', commonBridgeSkills: ['Cloud Systems', 'API Contracts', 'Technical Discovery'], notes: 'Transition to customer-facing enterprise architecture.' }
    ],
    careerProgression: {
      icTrack: ['TPM (P3)', 'Senior TPM (P4)', 'Staff Platform PM (P5)', 'Principal Platform Architect / PM (P6)'],
      managementTrack: ['Senior TPM (P4)', 'Group Platform PM (M1)', 'Director of Platform Product (M2)', 'VP of Platform / Chief Platform Officer (M3)']
    },
    careerosDimensions: [
      { key: 'functional_technical_knowledge', label: 'Functional / Technical Knowledge', score: 5, proficiency: 'strategic', description: 'Exceptional technical depth in APIs, microservices, databases, and cloud systems.', evidencePrompt: 'Authored idempotency key specification and rate-limiting algorithm for public API.', rationale: 'Operates at the level of senior systems engineers.' },
      { key: 'business_domain_knowledge', label: 'Business Domain Knowledge', score: 3, proficiency: 'advanced', description: 'Solid understanding of usage-based pricing, developer ecosystem dynamics, and FinOps.', evidencePrompt: 'Designed tiered usage pricing thresholds based on request volume and payload size.', rationale: 'Strong commercial alignment on platform products.' },
      { key: 'problem_complexity', label: 'Problem Complexity', score: 5, proficiency: 'strategic', description: 'Solves complex distributed systems constraints and technical trade-offs.', evidencePrompt: 'Architected migration from synchronous REST to asynchronous event-driven Kafka events.', rationale: 'Tackles deep architectural challenges.' },
      { key: 'decision_scope', label: 'Decision Scope', score: 4, proficiency: 'senior', description: 'Authoritative decisions on API versioning, deprecations, and platform architecture priorities.', evidencePrompt: 'Decided to deprecate v1 endpoints to prevent multi-region synchronization bugs.', rationale: 'High platform governance authority.' },
      { key: 'product_customer_impact', label: 'Product / Customer Impact', score: 4, proficiency: 'senior', description: 'Enables all downstream product squads to build customer features with high reliability.', evidencePrompt: 'Platform upgrades reduced downstream squad deployment bugs by 45%.', rationale: 'Foundation for entire company software.' },
      { key: 'business_impact', label: 'Business Impact', score: 4, proficiency: 'senior', description: 'Drives platform scalability and reduces cloud infrastructure costs.', evidencePrompt: 'Caching optimization saved $840k in annual database read replicas.', rationale: 'Measurable direct operational savings.' },
      { key: 'operational_scope', label: 'Operational Scope', score: 4, proficiency: 'senior', description: 'Directs 2-4 platform engineering squads (20-30 developers).', evidencePrompt: 'Coordinated platform infrastructure release across 3 engineering leads.', rationale: 'Strong technical squad leadership.' },
      { key: 'stakeholder_complexity', label: 'Stakeholder Complexity', score: 4, proficiency: 'senior', description: 'Aligns Principal Engineers, Security Architects, and internal product squads.', evidencePrompt: 'Brokered consensus on cross-service authorization between security and feature PMs.', rationale: 'High technical credibility.' },
      { key: 'strategic_influence', label: 'Strategic Influence', score: 4, proficiency: 'senior', description: 'Defines the technical platform foundation upon which the company scales.', evidencePrompt: 'Platform vision RFC adopted as cornerstone of 3-year technology strategy.', rationale: 'Long-term architectural influence.' },
      { key: 'leadership_ownership', label: 'Leadership / Ownership', score: 4, proficiency: 'senior', description: 'Champions developer experience, software craftsmanship, and platform hygiene.', evidencePrompt: 'Led internal developer community of practice and API guild.', rationale: 'High peer influence.' }
    ],
    referenceEvaluations: [
      {
        frameworkId: 'aon_radford',
        frameworkName: 'Aon Radford Leveling',
        levelOrScore: 'Level P4 (Senior Technical Product Manager)',
        rationale: 'Works on technical product problems of broad scope. Exercises independent judgment in selecting technical architectures and defining platform specifications.',
        marketAlignmentNotes: 'Radford Technical Product Management Job Code 4102.',
        dimensions: [
          { name: 'Technical Depth', weightOrScope: 'High', scoreOrBand: 'P4', interpretation: 'Fluent in software engineering and system design.' }
        ]
      },
      {
        frameworkId: 'korn_ferry_hay',
        frameworkName: 'Korn Ferry Hay Evaluation',
        levelOrScore: '545 Hay Points (Grade 19)',
        rationale: 'Exceptional specialized technical Know-How; adaptive Problem Solving under complex distributed constraints; primary accountability for platform reliability.',
        marketAlignmentNotes: 'Senior Technical Platform Specialist band.',
        dimensions: [
          { name: 'Know-How', weightOrScope: 'Technical Specialist', scoreOrBand: '275 pts', interpretation: 'Deep engineering and system architecture integration.' }
        ]
      },
      {
        frameworkId: 'patterson',
        frameworkName: 'Patterson Decision Band Method',
        levelOrScore: 'Band D (Interpretive Technical Architecture)',
        rationale: 'Determines the technical specifications, API schemas, and platform capabilities that govern how systems interact.',
        marketAlignmentNotes: 'Interpretive technical decision authority.',
        dimensions: [
          { name: 'Decision Authority', weightOrScope: 'API Standards', scoreOrBand: 'Band D', interpretation: 'Sets platform contracts and technical deprecation milestones.' }
        ]
      }
    ],
    levelMapping: {
      careerosInferredLevel: 'P4 / Senior Technical Product Specialist',
      levelCode: 'P4',
      icEquivalent: 'Staff / Principal Platform PM (P5/P6)',
      managementEquivalent: 'Director of Platform Engineering & Product (M2)',
      scopeSummary: {
        roleScope: 'Core developer platforms, public APIs, cloud infrastructure, 20-30 platform engineers.',
        decisionScope: 'API schema contracts, deprecation dates, platform debt prioritization.',
        impactScope: 'Company-wide system uptime, developer velocity, compute cost efficiency.',
        complexity: 'Solving distributed scalability, concurrency, and developer ergonomics.',
        leadershipScope: 'High technical influence over principal engineers.'
      },
      referenceFrameworkLevels: {
        kornFerryHay: '545 Points (Grade 19)',
        mercerIpe: 'Position Class 54',
        wtwGgs: 'Grade 13 (Expert IC)',
        aonRadford: 'P4 (Senior Professional)',
        patterson: 'Band D (Interpretive)'
      },
      evidenceRationale: [
        'Radford P4: Deep technical problem solving on developer-facing platform surfaces.',
        'Hay Know-How: High technical depth bridging engineering and product management.',
        'Patterson Band D: Exercises binding authority on platform API contracts.'
      ]
    },
    competencies: [
      {
        id: 'comp-tpm-api-design',
        name: 'API Contract & Schema Design',
        category: 'technical',
        requiredLevel: 'strategic',
        description: 'Designs intuitive, backwards-compatible REST, gRPC, and GraphQL interfaces.',
        externalFrameworkRefs: [
          { framework: 'SFIA', codeOrLevel: 'Level 5 (Ensure, advise)', description: 'Software design and architecture.' }
        ]
      },
      {
        id: 'comp-tpm-finops',
        name: 'Cloud Cost Modeling (FinOps)',
        category: 'business',
        requiredLevel: 'advanced',
        description: 'Calculates unit economics of compute, memory, database operations, and egress bandwidth.',
        externalFrameworkRefs: [
          { framework: 'O*NET', codeOrLevel: '15-1299.08', description: 'Computer Systems Analysts.' }
        ]
      }
    ],
    mobilityTransitions: [
      {
        fromRoleId: 'role-tech-product-mgr',
        toRoleId: 'role-sr-product-manager',
        toRoleTitle: 'Senior Product Manager',
        toRoleTrack: 'hybrid',
        transferabilityScore: 88,
        transferabilityLevel: 'Very High',
        skillOverlapPercentage: 85,
        skillOverlapItems: ['Roadmapping', 'Prioritization', 'Telemetry', 'User Discovery'],
        skillGaps: ['Consumer / Enterprise User Psychology', 'Go-To-Market Marketing Coordination'],
        requiredExperience: 'Exposure to business-facing feature launches.',
        estimatedTransitionDifficulty: 'Low',
        strategicValue: 'Transitions to customer-facing business surfaces with unmatched technical credibility.',
        recommendedPathway: ['Lead a user-facing dashboard launch', 'Shadow customer interviews with sales prospects', 'Study conversion funnel psychology']
      }
    ]
  },
  ...ADDITIONAL_ROLES_DATA
];

export const ROLE_GRAPH_DATA: RoleGraphData = {
  nodes: [
    { id: 'role-pm', label: 'Product Manager', type: 'role', group: 'product', size: 28, levelBadge: 'P3' },
    { id: 'role-sr-pm', label: 'Senior Product Manager', type: 'role', group: 'product', size: 34, levelBadge: 'P4' },
    { id: 'role-staff-pm', label: 'Staff / Principal PM', type: 'career_path', group: 'product', size: 30, levelBadge: 'P5/P6' },
    { id: 'role-gpm', label: 'Group PM / Director', type: 'career_path', group: 'product', size: 30, levelBadge: 'M1/M2' },
    
    { id: 'role-product-ops', label: 'Product Operations Manager', type: 'adjacent_role', group: 'product_business_ops', size: 32, levelBadge: 'P4' },
    { id: 'role-bizops', label: 'Business Operations (BizOps)', type: 'adjacent_role', group: 'product_business_ops', size: 32, levelBadge: 'P4' },
    { id: 'role-tpm-node', label: 'Technical Program Manager (TPM)', type: 'adjacent_role', group: 'technology', size: 30, levelBadge: 'P4' },
    { id: 'role-sa-node', label: 'Solutions Architect', type: 'adjacent_role', group: 'hybrid_cross_functional', size: 30, levelBadge: 'P4' },
    { id: 'role-tech-pm-node', label: 'Technical PM (TPM/Platform)', type: 'adjacent_role', group: 'technology', size: 32, levelBadge: 'P4' },
    
    // Core Skills & Competencies
    { id: 'skill-strategy', label: 'Product Strategy & Roadmapping', type: 'skill', group: 'skills', size: 20 },
    { id: 'skill-discovery', label: 'Continuous Discovery', type: 'skill', group: 'skills', size: 20 },
    { id: 'skill-telemetry', label: 'Quantitative Telemetry (SQL/Amplitude)', type: 'skill', group: 'skills', size: 20 },
    { id: 'skill-economics', label: 'Unit Economics & Financial Modeling', type: 'skill', group: 'skills', size: 20 },
    { id: 'skill-tech-systems', label: 'Distributed Systems & API Design', type: 'skill', group: 'skills', size: 20 },
    { id: 'skill-ops-cadence', label: 'Process Systems & Operating Cadence', type: 'skill', group: 'skills', size: 20 },
    { id: 'skill-diplomacy', label: 'Executive Stakeholder Diplomacy', type: 'competency', group: 'skills', size: 20 },
    
    // Scope & Industry
    { id: 'scope-decision-rights', label: 'Binding Feature & GTM Decision Rights', type: 'scope', group: 'scope', size: 18 },
    { id: 'ind-cloud-saas', label: 'Cloud Platforms & SaaS', type: 'industry', group: 'industry', size: 18 },
    
    // Learning & Opportunities
    { id: 'learn-agentic-rag', label: 'Agentic Workflows & RAG Architecture', type: 'learning', group: 'learning', size: 16 },
    { id: 'learn-finops', label: 'FinOps Cloud Cost Modeling Masterclass', type: 'learning', group: 'learning', size: 16 },
    { id: 'opp-company-x', label: 'Senior Product Manager (Company X)', type: 'opportunity', group: 'opportunity', size: 18 },
    { id: 'opp-vinfast', label: 'Platform Infrastructure Lead (VinFast)', type: 'opportunity', group: 'opportunity', size: 18 }
  ],
  links: [
    { source: 'role-pm', target: 'role-sr-pm', relationship: 'progresses_to', label: 'Vertical Promotion' },
    { source: 'role-sr-pm', target: 'role-staff-pm', relationship: 'progresses_to', label: 'IC Ladder' },
    { source: 'role-sr-pm', target: 'role-gpm', relationship: 'progresses_to', label: 'Management Ladder' },
    
    { source: 'role-sr-pm', target: 'role-product-ops', relationship: 'adjacent_to', label: '88% Mobility' },
    { source: 'role-sr-pm', target: 'role-tech-pm-node', relationship: 'adjacent_to', label: '86% Mobility' },
    { source: 'role-sr-pm', target: 'role-bizops', relationship: 'adjacent_to', label: '74% Mobility' },
    { source: 'role-product-ops', target: 'role-bizops', relationship: 'adjacent_to', label: '88% Mobility' },
    { source: 'role-bizops', target: 'role-tpm-node', relationship: 'adjacent_to', label: '75% Mobility' },
    { source: 'role-tpm-node', target: 'role-sa-node', relationship: 'adjacent_to', label: '82% Mobility' },
    { source: 'role-sa-node', target: 'role-tech-pm-node', relationship: 'adjacent_to', label: '84% Mobility' },

    { source: 'role-sr-pm', target: 'skill-strategy', relationship: 'requires' },
    { source: 'role-sr-pm', target: 'skill-discovery', relationship: 'requires' },
    { source: 'role-sr-pm', target: 'skill-telemetry', relationship: 'requires' },
    { source: 'role-sr-pm', target: 'skill-economics', relationship: 'requires' },
    { source: 'role-sr-pm', target: 'skill-diplomacy', relationship: 'requires' },

    { source: 'role-product-ops', target: 'skill-ops-cadence', relationship: 'requires' },
    { source: 'role-product-ops', target: 'skill-telemetry', relationship: 'requires' },
    { source: 'role-bizops', target: 'skill-economics', relationship: 'requires' },
    { source: 'role-tech-pm-node', target: 'skill-tech-systems', relationship: 'requires' },
    { source: 'role-sa-node', target: 'skill-tech-systems', relationship: 'requires' },

    { source: 'role-sr-pm', target: 'scope-decision-rights', relationship: 'scoped_at' },
    { source: 'role-sr-pm', target: 'ind-cloud-saas', relationship: 'scoped_at' },

    { source: 'role-sr-pm', target: 'learn-agentic-rag', relationship: 'empowers' },
    { source: 'role-tech-pm-node', target: 'learn-finops', relationship: 'empowers' },
    { source: 'role-sr-pm', target: 'opp-company-x', relationship: 'leads_to_opportunity' },
    { source: 'role-tech-pm-node', target: 'opp-vinfast', relationship: 'leads_to_opportunity' }
  ]
};
