import { OrgModelBlueprint } from '../types/knowledgeTaxonomy';

export const ORG_MODELS_DATA: OrgModelBlueprint[] = [
  {
    id: 'org-product-squads',
    type: 'product_squad',
    title: 'Autonomous Product Squads (Mission-Oriented)',
    headline: 'Cross-functional units with end-to-end customer mission ownership, minimal cross-team handoffs, and direct outcome metrics.',
    bestFitStage: 'Scale-ups and high-velocity SaaS products (Series B to Enterprise expansion)',
    corePhilosophy: 'You build it, you run it, you own the outcome. Teams are aligned around user journeys or value streams rather than technical layers.',
    advantages: [
      'High deployment velocity without cross-departmental approval bottlenecks',
      'Extreme customer empathy because engineers directly measure retention and conversion',
      'Clear quarterly OKR alignment tied to measurable business impact'
    ],
    frictionPoints: [
      'Risk of technical fragmentation (duplicate microservices, disparate tech stacks)',
      'Shared platform components often suffer from the "tragedy of the commons"',
      'Requires strong senior technical leadership to prevent architectural drift'
    ],
    applicableRoles: [
      'Product Management',
      'Software Engineering',
      'UI/UX & Product Design',
      'Data Analytics & BI'
    ],
    topologyBreakdown: [
      {
        unitName: 'Core Product Squad',
        description: 'Co-located (or virtual sync) team of 5-8 makers dedicated to a specific user lifecycle problem.',
        composition: '1 PM (Product Owner), 1 Product Designer, 1 Tech Lead, 3-4 Software Engineers, 1 embedded Data Analyst.',
        autonomyLevel: 'High'
      },
      {
        unitName: 'Shared Platform & Enablement Squad',
        description: 'Specialized squad providing developer platforms, CI/CD, shared design systems, and cloud infrastructure.',
        composition: '1 Staff Infra Engineer, 3-4 Cloud Engineers, 1 Developer Experience PM.',
        autonomyLevel: 'Medium'
      },
      {
        unitName: 'Product Leadership Cluster',
        description: 'Coordinates thematic goals across 3-5 complementary squads.',
        composition: 'Group Product Manager (GPM), Director of Engineering, Staff Product Designer.',
        autonomyLevel: 'High'
      }
    ],
    reportingStructure: [
      {
        role: 'Senior Product Manager',
        reportsTo: 'Director of Product or VP of Product',
        primaryCollaborators: ['Tech Lead', 'Staff Designer', 'Product Marketing Manager'],
        cadence: 'Bi-weekly 1:1 strategy calibration; weekly squad sprint reviews'
      },
      {
        role: 'Tech Lead / Senior Engineer',
        reportsTo: 'Engineering Manager (People & Craft)',
        primaryCollaborators: ['PM (Product Scope)', 'Architect (System Standards)', 'Staff Infra'],
        cadence: 'Weekly 1:1 on career and technical governance; daily async standups'
      },
      {
        role: 'Product Designer',
        reportsTo: 'Design Director / Head of Design',
        primaryCollaborators: ['PM (Discovery & Specs)', 'Frontend Engineers (Design Tokens & QA)'],
        cadence: 'Weekly design critique; bi-weekly squad milestone sign-off'
      }
    ],
    decisionDependencies: [
      {
        decisionType: 'Feature Scope & User Experience Sign-off',
        ownerRole: 'Senior Product Manager',
        approverRole: 'Product Squad (Consensus) / GPM',
        consultedRoles: ['Tech Lead', 'Product Designer', 'Customer Success'],
        escalationPath: 'Director of Product'
      },
      {
        decisionType: 'Microservice / Data Store Architecture Selection',
        ownerRole: 'Tech Lead',
        approverRole: 'Staff Architect / Engineering Council (RFC Process)',
        consultedRoles: ['Platform Squad', 'DevOps / Security'],
        escalationPath: 'VP of Engineering'
      },
      {
        decisionType: 'Production Rollback on Regression SLA Breach',
        ownerRole: 'On-Call Engineer / Tech Lead',
        approverRole: 'Immediate Self-Executive Action',
        consultedRoles: ['PM', 'Engineering Manager'],
        escalationPath: 'VP of Engineering / Incident Commander'
      }
    ],
    raciMatrix: [
      {
        activity: 'Quarterly OKR Definition & Roadmap Commitment',
        responsible: 'Senior Product Manager',
        accountable: 'Group Product Manager (GPM)',
        consulted: ['Tech Lead', 'Staff Designer', 'Data Analyst'],
        informed: ['Executive Leadership', 'Sales & Support']
      },
      {
        activity: 'Technical Specification & Database Schema Design',
        responsible: 'Tech Lead',
        accountable: 'Engineering Manager',
        consulted: ['Software Engineers', 'Staff Architect', 'PM'],
        informed: ['Platform Squad', 'Security Officer']
      },
      {
        activity: 'Design System Component Contribution',
        responsible: 'Product Designer',
        accountable: 'Design System Lead',
        consulted: ['Frontend Engineers', 'Accessibility Specialist'],
        informed: ['Squad PM']
      },
      {
        activity: 'Feature Flag Staged Rollout & Experimentation',
        responsible: 'Software Engineer (PR Author)',
        accountable: 'Tech Lead',
        consulted: ['Data Analyst (Sample Size & Significance)', 'PM'],
        informed: ['Customer Support Lead']
      }
    ],
    roleFitChecklist: [
      {
        role: 'Senior Product Manager',
        whereItFits: 'Acts as squad captain; sets context, defines the problem statement, drives metrics prioritization.',
        keyOwnership: 'Problem space definition, user journey prioritization, business outcome metrics.',
        frictionWarning: 'Avoid treating the squad as an agency; involve engineers early in user research.'
      },
      {
        role: 'Distributed Systems / Backend Engineer',
        whereItFits: 'Primary builder of backend services; ensures resilience, idempotency, and API contracts.',
        keyOwnership: 'Data schemas, API latency, integration tests, operational runbooks.',
        frictionWarning: 'Balance shipping fast with long-term code maintainability; avoid building isolated databases without schema governance.'
      }
    ]
  },
  {
    id: 'org-matrix-structure',
    type: 'matrix',
    title: 'Dual-Axis Matrix (Discipline Craft + Delivery Project)',
    headline: 'Makers belong to a functional craft department for capability growth, while leased into cross-departmental delivery initiatives.',
    bestFitStage: 'Mid to large enterprise tech companies with strict compliance, regulated sectors, or consulting engagements.',
    corePhilosophy: 'Maintain uncompromising craft standards and talent development while directing fluid capacity toward high-priority corporate projects.',
    advantages: [
      'Unsurpassed craft consistency (code quality, design standards, architectural compliance)',
      'Easy resource re-allocation across projects without firing or hiring disruptions',
      'Clear career progression pathways through dedicated discipline mentors'
    ],
    frictionPoints: [
      'Dual-boss dilemma (Project Director vs Department Head conflict on priorities)',
      'Excessive consensus meetings, status reporting, and prioritization politics',
      'Diffused accountability when project deliverables miss critical milestone deadlines'
    ],
    applicableRoles: [
      'Program & Project Management',
      'Software Engineering',
      'Security & Systems',
      'Business Analysis & Strategy'
    ],
    topologyBreakdown: [
      {
        unitName: 'Functional Craft Department (Vertical Axis)',
        description: 'Centers of excellence (e.g., Software Engineering Department, Security Guild, Design Practice).',
        composition: 'VP of Discipline, Discipline Directors, Practice Leads, Staff Practitioners.',
        autonomyLevel: 'Medium'
      },
      {
        unitName: 'Project Delivery Taskforce (Horizontal Axis)',
        description: 'Time-bound cross-functional initiative team assembled to achieve a single contract or product launch.',
        composition: 'Project Director / Program Manager, allocated Senior Engineers, UX Designer, Business Analyst.',
        autonomyLevel: 'Medium'
      }
    ],
    reportingStructure: [
      {
        role: 'Senior Software Engineer',
        reportsTo: 'Engineering Department Manager (for performance reviews) & Project Delivery Lead (for daily assignments)',
        primaryCollaborators: ['Other Domain Engineers', 'Lead Business Analyst', 'QA Lead'],
        cadence: 'Bi-weekly craft 1:1; daily project standups; monthly department all-hands'
      },
      {
        role: 'Technical Program Manager (TPM)',
        reportsTo: 'Head of Program Management Office (PMO)',
        primaryCollaborators: ['Department Heads', 'Enterprise Architects', 'External Vendors'],
        cadence: 'Weekly executive steering committee; daily blocker escalation'
      }
    ],
    decisionDependencies: [
      {
        decisionType: 'Project Scope Adjustments vs Delivery Schedule',
        ownerRole: 'Project Delivery Lead',
        approverRole: 'Steering Committee / Client Sponsor',
        consultedRoles: ['Engineering Lead', 'Business Analyst'],
        escalationPath: 'PMO Director & VP of Engineering'
      },
      {
        decisionType: 'Architectural Standards Waiver / Technical Debt Approval',
        ownerRole: 'Discipline Practice Lead',
        approverRole: 'Chief Technology Officer (CTO)',
        consultedRoles: ['Project Delivery Lead', 'Security Lead'],
        escalationPath: 'CTO Executive Decision'
      }
    ],
    raciMatrix: [
      {
        activity: 'Resource Allocation & Skill Matching',
        responsible: 'Department Discipline Lead',
        accountable: 'VP of Functional Craft',
        consulted: ['Project Delivery Lead', 'Candidate Engineer'],
        informed: ['PMO Director']
      },
      {
        activity: 'Milestone Delivery Acceptance & Sign-off',
        responsible: 'Project Delivery Lead',
        accountable: 'Steering Committee Chair',
        consulted: ['QA Director', 'Engineering Lead', 'Business Stakeholders'],
        informed: ['Discipline Heads']
      }
    ],
    roleFitChecklist: [
      {
        role: 'Technical Program Manager',
        whereItFits: 'Orchestrator of dependencies across horizontal projects and vertical engineering disciplines.',
        keyOwnership: 'Critical path schedules, risk registers, cross-team alignment, status dashboards.',
        frictionWarning: 'Ensure you possess executive escalation authority; avoid becoming just a calendar coordinator.'
      }
    ]
  },
  {
    id: 'org-spotify-tribes',
    type: 'squad_tribe_spotify',
    title: 'Spotify Model (Tribe, Chapter, Guild Topology)',
    headline: 'Decoupled autonomous squads clustered into domain Tribes, cross-pollinated by craft Chapters and interest Guilds.',
    bestFitStage: 'Multi-product platforms and engineering organizations with 100+ makers.',
    corePhilosophy: 'Autonomy with alignment. Tribes provide high-level mission cohesion, while Chapters safeguard professional competence.',
    advantages: [
      'Scales engineering organizations without creating rigid functional silos',
      'Guilds enable grassroots innovation (e.g. AI guild, accessibility guild, Rust guild)',
      'Engineers have a stable Chapter Lead while moving freely between squads'
    ],
    frictionPoints: [
      'Chapter leads can become disconnected from engineers daily code contributions',
      'Tribes can become competitive kingdoms with conflicting architecture goals',
      'Guilds can become talk-shops without dedicated execution budget'
    ],
    applicableRoles: [
      'Software Engineering',
      'DevOps & Cloud',
      'Product Management',
      'Data & Machine Learning'
    ],
    topologyBreakdown: [
      {
        unitName: 'Squad (Mini-Startup)',
        description: 'Cross-functional team of 6-10 people dedicated to a long-term mission (e.g., Search & Discovery Squad).',
        composition: 'PO, Tech Lead, Engineers, Designer, QA.',
        autonomyLevel: 'High'
      },
      {
        unitName: 'Tribe (Domain Cluster)',
        description: 'Collection of 4-8 interrelated squads working on the same domain (e.g., Core Monetization Tribe).',
        composition: 'Tribe Lead (Business), Tribe Tech Lead (Engineering), Tribe Product Lead.',
        autonomyLevel: 'High'
      },
      {
        unitName: 'Chapter (Competence Basecamp)',
        description: 'Engineers of the same craft inside a Tribe (e.g., Web Frontend Chapter in Payments Tribe).',
        composition: 'Chapter Lead (Line Manager) and Chapter Members embedded across squads.',
        autonomyLevel: 'Medium'
      },
      {
        unitName: 'Guild (Cross-Tribe Interest Community)',
        description: 'Open-membership community of practice across the whole company (e.g., Distributed Systems Guild).',
        composition: 'Voluntary members from any squad or tribe, led by a Guild Coordinator.',
        autonomyLevel: 'Low'
      }
    ],
    reportingStructure: [
      {
        role: 'Staff Software Engineer',
        reportsTo: 'Engineering Chapter Lead',
        primaryCollaborators: ['Squad Product Owner', 'Tribe Tech Lead', 'Guild Peers'],
        cadence: 'Weekly 1:1 with Chapter Lead; daily squad sync'
      },
      {
        role: 'Tribe Tech Lead',
        reportsTo: 'Head of Engineering / VP Engineering',
        primaryCollaborators: ['Tribe Lead (Product)', 'Chapter Leads', 'Principal Architects'],
        cadence: 'Bi-weekly architecture sync across Tribes'
      }
    ],
    decisionDependencies: [
      {
        decisionType: 'Cross-Tribe Shared API Contracts',
        ownerRole: 'Tribe Tech Leads',
        approverRole: 'Architecture Guild / Principal Council',
        consultedRoles: ['Impacted Squad Tech Leads'],
        escalationPath: 'Head of Engineering'
      }
    ],
    raciMatrix: [
      {
        activity: 'Engineering Performance Review & Compensation',
        responsible: 'Chapter Lead',
        accountable: 'Head of Engineering',
        consulted: ['Squad Product Owner (360 feedback)', 'Squad Peers'],
        informed: ['HR Business Partner']
      }
    ],
    roleFitChecklist: [
      {
        role: 'Lead / Staff Engineer',
        whereItFits: 'Bridges Tribe technical strategy with individual Squad implementation; leads Chapters or Guilds.',
        keyOwnership: 'Cross-squad architecture, tech debt reduction, mentoring chapter members.',
        frictionWarning: 'Ensure you maintain high squad proximity while participating in cross-tribe guilds.'
      }
    ]
  },
  {
    id: 'org-functional-hierarchy',
    type: 'functional',
    title: 'Functional Hierarchy (Discipline-First)',
    headline: 'Teams grouped strictly by specialized craft discipline with centralized executive leadership and structured handoffs.',
    bestFitStage: 'Hardware engineering, deep-tech research, high-compliance manufacturing, or pre-product-market fit specialists.',
    corePhilosophy: 'Mastery over speed. Decisions are vetted by deep functional domain authorities.',
    advantages: [
      'Maximum technical depth and specialization within disciplines',
      'Zero redundancy in tooling and standardized procurement',
      'Strong institutional memory and peer-reviewed rigor'
    ],
    frictionPoints: [
      'Slow cross-functional communication and painful departmental handoffs',
      'Priorities often get trapped in "us vs them" departmental politics',
      'Individual contributors lack direct line of sight to customer business outcomes'
    ],
    applicableRoles: [
      'Security & Systems',
      'Data & Machine Learning',
      'Software Engineering'
    ],
    topologyBreakdown: [
      {
        unitName: 'Functional Silos',
        description: 'Engineering, Product, Marketing, QA, Security report straight up to C-level function heads.',
        composition: 'Disciplined hierarchy from Junior to VP of Function.',
        autonomyLevel: 'Low'
      }
    ],
    reportingStructure: [
      {
        role: 'Security Engineer',
        reportsTo: 'Chief Information Security Officer (CISO) chain',
        primaryCollaborators: ['DevOps Leads', 'Compliance Officers'],
        cadence: 'Weekly functional standup'
      }
    ],
    decisionDependencies: [
      {
        decisionType: 'Production Security Clearance',
        ownerRole: 'Security Review Board',
        approverRole: 'CISO',
        consultedRoles: ['App Team Lead'],
        escalationPath: 'CEO'
      }
    ],
    raciMatrix: [
      {
        activity: 'Security Compliance Audit & Penetration Sign-off',
        responsible: 'Security Engineer',
        accountable: 'CISO',
        consulted: ['Platform Engineering Lead'],
        informed: ['Product Management']
      }
    ],
    roleFitChecklist: [
      {
        role: 'Security & Systems Engineer',
        whereItFits: 'Independent authority validating systems against zero-trust frameworks and corporate compliance.',
        keyOwnership: 'Penetration testing, IAM governance, SOC2/ISO27001 posture.',
        frictionWarning: 'Bridge empathy with product velocity to avoid being perceived as the "department of No".'
      }
    ]
  },
  {
    id: 'org-startup-pod',
    type: 'startup_pod',
    title: 'Early-Stage Startup Pod (Founder-Led Swarm)',
    headline: 'Ultra-fluid, generalist team working directly alongside founders to discover product-market fit with immediate feedback loops.',
    bestFitStage: 'Seed to Series A startups (1 to 25 employees).',
    corePhilosophy: 'Speed of iteration is the only competitive advantage. Everyone is a generalist with high ownership.',
    advantages: [
      'Zero bureaucratic overhead, zero ticketing gates, instant code-to-production path',
      'Deep personal agency and direct contact with early adopters and investors',
      'Opportunity to touch every layer: product design, architecture, sales calls, customer support'
    ],
    frictionPoints: [
      'High context-switching fatigue and unpredictable working hours',
      'Minimal documentation and tech debt accumulation',
      'Priorities can pivot radically based on a single customer call'
    ],
    applicableRoles: [
      'Software Engineering',
      'Product Management',
      'Growth & Product Marketing',
      'UI/UX & Product Design'
    ],
    topologyBreakdown: [
      {
        unitName: 'All-Hands Product Swarm',
        description: 'Entire technical and product team swarming on the next weekly milestone or customer demo.',
        composition: 'Founding Engineer, Full-Stack Developers, Founder/CEO.',
        autonomyLevel: 'High'
      }
    ],
    reportingStructure: [
      {
        role: 'Founding Engineer / Lead Developer',
        reportsTo: 'Founder / CEO or CTO',
        primaryCollaborators: ['Founding Designer', 'Head of Growth'],
        cadence: 'Continuous Slack/Discord huddles; daily informal sync'
      }
    ],
    decisionDependencies: [
      {
        decisionType: 'Feature Architecture vs Speed Tradeoff',
        ownerRole: 'Founding Engineer',
        approverRole: 'CTO / Founder',
        consultedRoles: ['Whole Pod'],
        escalationPath: 'Founder'
      }
    ],
    raciMatrix: [
      {
        activity: 'Shipping an MVP Feature to Production',
        responsible: 'Founding Engineer',
        accountable: 'Founder / CEO',
        consulted: ['Customer Users'],
        informed: ['Investors / Board']
      }
    ],
    roleFitChecklist: [
      {
        role: 'Full-Stack / Founding Engineer',
        whereItFits: 'Builds frontend, backend, databases, and deployment scripts while directly debugging user issues.',
        keyOwnership: 'End-to-end implementation velocity, cloud costs, customer satisfaction.',
        frictionWarning: 'Must be comfortable discarding code that fails user validation without emotional attachment.'
      }
    ]
  }
];
