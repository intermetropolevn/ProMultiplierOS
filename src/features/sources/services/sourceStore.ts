import { 
  NormalizedSource, 
  SourceFamily, 
  EvidenceStrengthLevel, 
  SkillEvidenceProfile, 
  JobEvidenceMatchReport,
  JobEvidenceMatchRequirement
} from '../types';
import { BOOKS_DATA } from '../../../data/booksData';
import { JobListing, RoleBlueprint } from '../../../types';
import { getEvidenceStrengthDefinition } from '../taxonomy';
import { CanonicalSkillRegistry } from '../../intelligence/services/canonicalSkillRegistry';

const STORAGE_KEY = 'career_os_sources_registry_v1';

export const INITIAL_SEED_SOURCES: NormalizedSource[] = [
  // 1. Initial Books migrated from BOOKS_DATA (Seamless backward compatibility)
  ...BOOKS_DATA.map((book): NormalizedSource => ({
    id: book.id,
    title: book.title,
    sourceFamily: 'learn',
    sourceType: 'book',
    description: book.summary || book.subtitle,
    url: book.officialUrl || book.publisherUrl,
    author: book.authors.join(', '),
    organization: book.publisher,
    provider: book.publisher,
    datePublished: book.publicationYear ? `${book.publicationYear}-01-01` : undefined,
    status: 'completed',
    language: 'en',
    languages: ['en'],
    tags: [...book.topics],
    notes: book.provenance,
    attachments: [],
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
    evidenceStrength: 1, // L1 Exposure
    inferredKnowledge: [...book.topics],
    confirmedKnowledge: [...book.topics.slice(0, 3)],
    inferredSkills: [...book.skills],
    confirmedSkills: [...book.skills],
    competencies: book.skills.slice(0, 3),
    domains: [book.domain],
    methods: ['Empirical Analysis', 'Conceptual Modeling'],
    frameworks: book.topics.filter(t => t.toLowerCase().includes('framework') || t.toLowerCase().includes('scrum')),
    evidenceStatements: [
      `Conceptual mastery of ${book.title} published by ${book.publisher || 'author'}.`
    ],
    careerRelevance: [...book.roles],
    metadata: {
      isbn: book.isbn,
      edition: book.edition,
      publisher: book.publisher,
      authors: book.authors,
      accessMode: book.accessMode
    }
  })),

  // 2. Verified Credentials
  {
    id: 'cred-aws-solutions-architect',
    title: 'AWS Certified Solutions Architect – Associate',
    sourceFamily: 'credential',
    sourceType: 'professional_certification',
    description: 'Validates ability to design secure, resilient, high-performing, and cost-optimized distributed systems on AWS.',
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    organization: 'Amazon Web Services',
    provider: 'AWS Training & Certification',
    dateStarted: '2025-11-01',
    dateCompleted: '2026-02-15',
    status: 'earned',
    language: 'en',
    languages: ['en'],
    tags: ['aws', 'cloud', 'architecture', 'distributed-systems', 'security'],
    attachments: [],
    createdAt: '2026-02-16T10:00:00.000Z',
    updatedAt: '2026-02-16T10:00:00.000Z',
    evidenceStrength: 3, // L3 Credential
    inferredKnowledge: ['Multi-AZ High Availability', 'VPC Peering & Transit Gateway', 'S3 Storage Classes', 'IAM Least Privilege'],
    confirmedKnowledge: ['AWS Well-Architected Framework', 'Cloud Cost Optimization', 'Idempotent Queuing via SQS/SNS'],
    inferredSkills: ['Cloud Infrastructure', 'AWS', 'System Design', 'Security & IAM'],
    confirmedSkills: ['Cloud Infrastructure & DevOps', 'Distributed Systems', 'Architecture Trade-offs'],
    competencies: ['Cloud Architecture', 'Cost Governance', 'Disaster Recovery'],
    domains: ['Cloud Infrastructure & DevOps', 'Enterprise SaaS'],
    methods: ['AWS Well-Architected Review', 'Stateless Compute Partitioning'],
    frameworks: ['AWS Well-Architected Framework (6 Pillars)'],
    evidenceStatements: [
      'Passed proctored AWS Solutions Architect examination (Score: 885/1000). Credential ID: AWS-PSA-948102.'
    ],
    careerRelevance: ['Software Engineering', 'DevOps & Cloud', 'Cloud Architect'],
    metadata: {
      credentialId: 'AWS-PSA-948102',
      issuer: 'Amazon Web Services',
      issueDate: '2026-02-15',
      expirationDate: '2029-02-15',
      score: '885/1000'
    }
  },
  {
    id: 'cred-scrum-pspo',
    title: 'Professional Scrum Product Owner I (PSPO I)',
    sourceFamily: 'credential',
    sourceType: 'professional_certification',
    description: 'Demonstrates understanding of the Scrum framework and the ability to apply it to maximize the value of products.',
    url: 'https://www.scrum.org/certificates/pspo-i',
    organization: 'Scrum.org',
    provider: 'Scrum.org',
    dateStarted: '2026-01-10',
    dateCompleted: '2026-03-02',
    status: 'earned',
    language: 'en',
    languages: ['en'],
    tags: ['scrum', 'product-management', 'agile', 'backlog-refinement'],
    attachments: [],
    createdAt: '2026-03-03T11:00:00.000Z',
    updatedAt: '2026-03-03T11:00:00.000Z',
    evidenceStrength: 3,
    inferredKnowledge: ['Empirical Process Control', 'Product Goal Alignment', 'Backlog Ordering Algorithms'],
    confirmedKnowledge: ['Product Backlog Refinement', 'Value Maximization Metrics', 'Sprint Review Cadence'],
    inferredSkills: ['Scrum Framework', 'Product Ownership'],
    confirmedSkills: ['Product Strategy', 'Stakeholder Management', 'Sprint Cadence & Ceremonies'],
    competencies: ['Value Delivery Prioritization', 'Scope Negotiation'],
    domains: ['Enterprise SaaS'],
    methods: ['User Story Mapping', 'Evidence-Based Management (EBM)'],
    frameworks: ['Scrum 2020 Guide', 'Evidence-Based Management'],
    evidenceStatements: [
      'Certified Scrum Product Owner I by Scrum.org with 96% assessment score.'
    ],
    careerRelevance: ['Product Management', 'Product Owner'],
    metadata: {
      credentialId: 'PSPO-I-55291',
      issuer: 'Scrum.org',
      issueDate: '2026-03-02'
    }
  },
  // 2b. Certificates (Completion & Training Credentials)
  {
    id: 'cred-google-data-analytics',
    title: 'Google Data Analytics Professional Certificate',
    sourceFamily: 'credential',
    sourceType: 'certificate',
    description: 'Official certificate proving completion of hands-on training across SQL queries, Tableau dashboards, spreadsheet calculations, and R data visualization.',
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    organization: 'Google',
    provider: 'Google Career Certificates & Coursera',
    dateStarted: '2025-08-01',
    dateCompleted: '2025-11-20',
    status: 'earned',
    language: 'en',
    languages: ['en'],
    tags: ['google', 'data-analytics', 'sql', 'tableau', 'r'],
    attachments: [],
    createdAt: '2025-11-21T09:00:00.000Z',
    updatedAt: '2025-11-21T09:00:00.000Z',
    evidenceStrength: 3,
    inferredKnowledge: ['Relational Database Queries', 'Data Cleaning Protocols', 'Visualization Storytelling'],
    confirmedKnowledge: ['SQL Joins & Aggregations', 'Dashboard Visual Hierarchy', 'Statistical Sample Sizing'],
    inferredSkills: ['Data Analytics', 'SQL', 'Tableau'],
    confirmedSkills: ['Data Analytics', 'SQL', 'Dashboarding'],
    competencies: ['Quantitative Synthesis', 'Data Integrity Auditing'],
    domains: ['Enterprise SaaS', 'Consumer Tech'],
    methods: ['Exploratory Data Analysis', 'Cohort Aggregations'],
    frameworks: ['Google Data Analysis Process (Ask, Prepare, Process, Analyze, Share, Act)'],
    evidenceStatements: [
      'Earned Google Data Analytics Professional Certificate with Capstone Case Study.'
    ],
    careerRelevance: ['Product Analytics', 'Data Analyst', 'Product Operations'],
    metadata: {
      credentialId: 'GDA-772910-CC',
      issuer: 'Google Career Certificates',
      issueDate: '2025-11-20'
    }
  },
  // 2c. Diplomas (Formal Academic/Professional Program Qualifications)
  {
    id: 'cred-diploma-data-science',
    title: 'Graduate Diploma in Data Science & Artificial Intelligence',
    sourceFamily: 'credential',
    sourceType: 'diploma',
    description: 'A formal educational qualification awarded after completing a structured 1-year postgraduate academic and professional program.',
    url: 'https://www.iss.nus.edu.sg',
    organization: 'National University & Systems Institute',
    provider: 'Institute of Systems Science',
    dateStarted: '2024-08-15',
    dateCompleted: '2025-08-01',
    status: 'earned',
    language: 'en',
    languages: ['en'],
    tags: ['diploma', 'data-science', 'machine-learning', 'postgraduate'],
    attachments: [],
    createdAt: '2025-08-05T10:00:00.000Z',
    updatedAt: '2025-08-05T10:00:00.000Z',
    evidenceStrength: 4,
    inferredKnowledge: ['Supervised Learning', 'Feature Engineering', 'Time Series Forecasting'],
    confirmedKnowledge: ['Model Evaluation & Loss Functions', 'Data Pipelines', 'Statistical Inference'],
    inferredSkills: ['Machine Learning', 'Python', 'Feature Engineering'],
    confirmedSkills: ['Data Science', 'Machine Learning', 'Statistical Modeling'],
    competencies: ['Predictive Modeling', 'Data Governance'],
    domains: ['Artificial Intelligence', 'Enterprise SaaS'],
    methods: ['Cross-Validation', 'Hyperparameter Tuning'],
    frameworks: ['CRISP-DM Process Model'],
    evidenceStatements: [
      'Awarded Graduate Diploma with Distinction in Applied AI Capstone.'
    ],
    careerRelevance: ['Data Science', 'Product Management', 'Machine Learning Engineer'],
    metadata: {
      credentialId: 'GD-DSAI-2025-042',
      institution: 'NUS Institute of Systems Science',
      credentialLevel: 'Postgraduate',
      fieldOfStudy: 'Data Science & Applied Artificial Intelligence'
    }
  },
  // 2d. Degrees (Formal Academic Qualifications)
  {
    id: 'cred-degree-cs-bachelor',
    title: "Bachelor's Degree in Computer Science & Distributed Systems",
    sourceFamily: 'credential',
    sourceType: 'degree',
    description: 'Formal academic qualification covering algorithms, operating systems, distributed database architecture, and computer networks.',
    url: 'https://illinois.edu',
    organization: 'University of Illinois Urbana-Champaign',
    provider: 'UIUC College of Engineering',
    dateStarted: '2020-09-01',
    dateCompleted: '2024-05-18',
    status: 'earned',
    language: 'en',
    languages: ['en'],
    tags: ['degree', 'bachelor', 'computer-science', 'algorithms', 'engineering'],
    attachments: [],
    createdAt: '2024-05-20T12:00:00.000Z',
    updatedAt: '2024-05-20T12:00:00.000Z',
    evidenceStrength: 4,
    inferredKnowledge: ['Data Structures & Algorithms', 'Concurrency Primitives', 'Distributed Consensus'],
    confirmedKnowledge: ['Network Protocols (TCP/IP)', 'Database Indexing (B-Trees)', 'Memory Management'],
    inferredSkills: ['Computer Science', 'Distributed Systems', 'Software Engineering'],
    confirmedSkills: ['Algorithms & Data Structures', 'System Architecture', 'Operating Systems'],
    competencies: ['Algorithmic Thinking', 'Low-Latency Engineering'],
    domains: ['Cloud Infrastructure & DevOps', 'Enterprise SaaS'],
    methods: ['Asymptotic Complexity Analysis', 'Formal Verification'],
    frameworks: ['IEEE / ACM Computer Science Curriculum Guidelines'],
    evidenceStatements: [
      "Graduated with Bachelor's of Science in Computer Science (Cum Laude)."
    ],
    careerRelevance: ['Software Engineering', 'Cloud Architect', 'Technical Product Manager'],
    metadata: {
      university: 'University of Illinois Urbana-Champaign',
      qualificationType: "Bachelor's Degree",
      fieldOfStudy: 'Computer Science',
      credentialLevel: 'Graduate',
      accreditation: 'ABET Computing Accreditation Commission'
    }
  },

  // 3. Structured Courses
  {
    id: 'learn-coursera-product-management',
    title: 'Coursera & UVA: Digital Product Management Specialization',
    sourceFamily: 'learn',
    sourceType: 'course',
    description: 'Comprehensive 4-course online specialization on hypothesis-driven product discovery, metrics, design sprints, and agile product development.',
    url: 'https://www.coursera.org/specializations/digital-product-management',
    organization: 'University of Virginia Darden School of Business',
    provider: 'Coursera & Darden',
    dateStarted: '2025-03-01',
    dateCompleted: '2025-05-10',
    status: 'completed',
    language: 'en',
    languages: ['en'],
    tags: ['coursera', 'product-management', 'discovery', 'agile', 'darden'],
    attachments: [],
    createdAt: '2025-05-11T10:00:00.000Z',
    updatedAt: '2025-05-11T10:00:00.000Z',
    evidenceStrength: 2,
    inferredKnowledge: ['Hypothesis-Driven Development', 'Design Sprint Mechanics', 'Product Backlog Architecture'],
    confirmedKnowledge: ['Continuous Discovery Habits', 'Value Proposition Design'],
    inferredSkills: ['Product Discovery', 'User Story Mapping'],
    confirmedSkills: ['Product Strategy', 'Customer Research'],
    competencies: ['Opportunity Solution Tree', 'Outcome-Oriented Prioritization'],
    domains: ['Enterprise SaaS', 'Consumer Tech'],
    methods: ['Design Sprints', 'Customer Interviewing'],
    frameworks: ['Opportunity Solution Tree', 'Jobs To Be Done (JTBD)'],
    evidenceStatements: [
      'Completed UVA Darden Digital Product Management 4-course track with graded peer projects.'
    ],
    careerRelevance: ['Product Management', 'Product Marketing'],
    metadata: {
      provider: 'Coursera',
      instructor: 'Alex Cowan',
      duration: '4 Months (Self-Paced)'
    }
  },
  // 3b. Professional Programs
  {
    id: 'learn-exec-ed-digital-transformation',
    title: 'INSEAD Executive Education: Leading Digital Transformation & AI Strategy',
    sourceFamily: 'learn',
    sourceType: 'professional_program',
    description: 'Specialized executive education program focused on AI-driven business models, organizational change, data moats, and platform ecosystem strategy.',
    url: 'https://www.insead.edu/executive-education/digital-transformation',
    organization: 'INSEAD',
    provider: 'INSEAD Executive Education',
    dateStarted: '2025-10-01',
    dateCompleted: '2025-11-15',
    status: 'completed',
    language: 'en',
    languages: ['en'],
    tags: ['insead', 'executive-education', 'digital-transformation', 'ai-strategy'],
    attachments: [],
    createdAt: '2025-11-16T12:00:00.000Z',
    updatedAt: '2025-11-16T12:00:00.000Z',
    evidenceStrength: 2,
    inferredKnowledge: ['Ecosystem Platform Dynamics', 'AI Readiness Assessments', 'Change Management'],
    confirmedKnowledge: ['Data Moat Defensibility', 'Corporate Governance in Tech'],
    inferredSkills: ['Executive Leadership', 'Strategic Roadmapping'],
    confirmedSkills: ['Product Strategy', 'Organizational Design'],
    competencies: ['Platform Ecosystem Strategy', 'Corporate Transformation'],
    domains: ['Enterprise SaaS', 'FinTech & Banking'],
    methods: ['Strategic Scenario Planning', 'Platform Flywheel Analysis'],
    frameworks: ['INSEAD Digital Disruption Matrix', 'Platform Business Model Framework'],
    evidenceStatements: [
      'Completed INSEAD Executive Program on Digital Transformation with board presentation capstone.'
    ],
    careerRelevance: ['Product Management', 'Executive Leadership', 'VP of Product'],
    metadata: {
      institution: 'INSEAD',
      duration: '6 Weeks (Executive Cohort)'
    }
  },
  // 3c. Learning Paths
  {
    id: 'path-senior-product-manager',
    title: 'Product Manager Learning Path: Discovery, Strategy & Growth Loops',
    sourceFamily: 'learn',
    sourceType: 'learning_path',
    description: 'Curated end-to-end multi-module roadmap advancing through foundational to executive competencies: Courses + Books + Certifications + Frameworks + Projects + Assessments.',
    url: 'https://careeros.internal/learning-paths/senior-pm',
    organization: 'Career OS Curated Roadmap',
    provider: 'Career OS Curriculum',
    dateStarted: '2026-01-01',
    status: 'in_progress',
    language: 'en',
    languages: ['en'],
    tags: ['learning-path', 'product-management', 'growth-loops', 'scrum', 'strategy'],
    attachments: [],
    createdAt: '2026-01-05T08:00:00.000Z',
    updatedAt: '2026-01-05T08:00:00.000Z',
    evidenceStrength: 2,
    inferredKnowledge: ['End-to-End Product Lifecycle', 'Evidence-Based Product Decisions'],
    confirmedKnowledge: ['Continuous Discovery', 'Strategic Trade-offs', 'Growth Accounting'],
    inferredSkills: ['Product Strategy', 'Customer Research', 'Metrics Design'],
    confirmedSkills: ['Product Strategy', 'Roadmapping', 'Cross-Functional Leadership'],
    competencies: ['Holistic Product Leadership', 'Curriculum Synthesis'],
    domains: ['Enterprise SaaS', 'Consumer Tech'],
    methods: ['Iterative Pathway Drills', 'Dual-Track Agile'],
    frameworks: ['Career OS 8-Stage Growth Loop'],
    evidenceStatements: [
      'Active enrolled in Career OS Senior Product Manager Structured Learning Pathway (5/8 milestones completed).'
    ],
    careerRelevance: ['Product Management', 'Product Owner', 'Director of Product'],
    learningPathSequence: [
      { stepNumber: 1, title: 'Inspired: How to Create Tech Products Customers Love', assetType: 'Book', provider: 'Marty Cagan (Wiley)', isCompleted: true },
      { stepNumber: 2, title: 'Coursera & UVA: Digital Product Management', assetType: 'Course', provider: 'Coursera', isCompleted: true },
      { stepNumber: 3, title: 'Professional Scrum Product Owner I (PSPO I)', assetType: 'Certification', provider: 'Scrum.org', isCompleted: true },
      { stepNumber: 4, title: 'Opportunity Solution Tree & Continuous Discovery', assetType: 'Framework', provider: 'Teresa Torres', isCompleted: true },
      { stepNumber: 5, title: 'Reforge: Advanced Product Strategy & Growth Loops', assetType: 'Course', provider: 'Reforge', isCompleted: true },
      { stepNumber: 6, title: 'Grab Product Operations Case: Driver Onboarding SLA', assetType: 'Assessment', provider: 'Grab Interview Process', isCompleted: true },
      { stepNumber: 7, title: 'Zero-Downtime Dual-Run CRM Data Migration', assetType: 'Project', provider: 'Enterprise Implementation', isCompleted: false },
      { stepNumber: 8, title: 'INSEAD Executive Education: Leading Digital Transformation', assetType: 'Course', provider: 'INSEAD', isCompleted: false }
    ],
    metadata: {
      milestones: 8,
      completedMilestones: 5
    }
  },

  // 3. Structured Courses
  {
    id: 'learn-reforge-product-strategy',
    title: 'Reforge: Advanced Product Strategy & Growth Loops',
    sourceFamily: 'learn',
    sourceType: 'cohort_program',
    description: 'Intensive 6-week executive cohort analyzing compounding growth loops, qualitative user segmentation, and retention cohorts.',
    url: 'https://www.reforge.com/product-strategy',
    organization: 'Reforge',
    provider: 'Reforge',
    dateStarted: '2026-04-01',
    dateCompleted: '2026-05-15',
    status: 'completed',
    language: 'en',
    languages: ['en'],
    tags: ['reforge', 'product-strategy', 'growth', 'retention', 'loops'],
    attachments: [],
    createdAt: '2026-05-16T14:00:00.000Z',
    updatedAt: '2026-05-16T14:00:00.000Z',
    evidenceStrength: 2,
    inferredKnowledge: ['Growth Loops vs Linear Funnels', 'Feature Product Fit vs Product Market Fit', 'Retention Cohort Flattening'],
    confirmedKnowledge: ['Qualitative User Segmentation', 'Growth Loop Synthesis', 'Defensibility Moats'],
    inferredSkills: ['Growth Analytics', 'Customer Retention'],
    confirmedSkills: ['Product Strategy', 'Hypothesis Testing', 'Experimentation'],
    competencies: ['Strategic Roadmapping', 'Metric Hierarchy Design'],
    domains: ['Enterprise SaaS', 'E-Commerce & Retail'],
    methods: ['Growth Loop Analysis', 'Cohort Hazard Rate Tracking'],
    frameworks: ['Reforge Growth Loop Framework', 'Casey Winters Retention Curve Matrix'],
    evidenceStatements: [
      'Completed Reforge Product Strategy Cohort, submitting final strategic teardown for B2B SaaS retention.'
    ],
    careerRelevance: ['Product Management', 'Product Operations'],
    metadata: {
      provider: 'Reforge',
      duration: '6 Weeks (Cohort)',
      instructor: 'Fareed Mosavat & Elena Verna'
    }
  },

  // 4. Projects (Evidence Strength 4-5)
  {
    id: 'proj-kafka-crm-migration',
    title: 'Zero-Downtime Dual-Run CRM Data Migration Pipeline',
    sourceFamily: 'project',
    sourceType: 'work_project',
    description: 'Zero-downtime migration of 12M customer records from legacy CRM to PostgreSQL with real-time Kafka Debezium CDC reconciliation.',
    organization: 'Fintech Platform Corp',
    provider: 'Internal Work Project',
    dateStarted: '2026-03-01',
    dateCompleted: '2026-07-20',
    status: 'completed',
    language: 'en',
    languages: ['en'],
    tags: ['kafka', 'debezium', 'postgresql', 'cdc', 'zero-downtime', 'migration'],
    attachments: [],
    createdAt: '2026-07-21T09:00:00.000Z',
    updatedAt: '2026-07-21T09:00:00.000Z',
    evidenceStrength: 5, // L5 Demonstrated
    inferredKnowledge: ['Change Data Capture (CDC)', 'Idempotent Consumer Logic', 'Checksum Parity Verification'],
    confirmedKnowledge: ['Kafka Distributed Streaming', 'Zero-Downtime Cutover Strategy', 'Financial Audit Parity'],
    inferredSkills: ['PostgreSQL', 'Kafka', 'CDC (Debezium)'],
    confirmedSkills: ['Distributed Systems', 'Architecture Trade-offs', 'Zero-Downtime Migration', 'Stakeholder Management'],
    competencies: ['Mission-Critical Data Engineering', 'Production Risk Mitigation'],
    domains: ['Fintech & Payments', 'Enterprise SaaS'],
    methods: ['Continuous Checksum Reconciliation', 'Dual-Run Write Traffic Routing'],
    frameworks: ['Strangler Fig Pattern', 'CDC Dual-Run Architecture'],
    evidenceStatements: [
      'Migrated 12,000,000 customer records with 0 seconds unplanned downtime and 99.999% verified parity.',
      'Decommissioned $35,000/month legacy license overhead.'
    ],
    careerRelevance: ['Software Engineering', 'DevOps & Cloud'],
    metadata: {
      teamSize: 5,
      recordsProcessed: '12M',
      businessImpact: '0 seconds downtime, $35k/month savings'
    }
  },

  // 5. Artifacts (Evidence Strength 5)
  {
    id: 'art-checkout-expansion-prd',
    title: 'PRD: Self-Serve Tiered Checkout Expansion & Painted-Door Experiment',
    sourceFamily: 'artifact',
    sourceType: 'prd',
    description: 'Full Product Requirements Document detailing hypothesis framing, telemetry instrumentation, and tripwire rollback guardrails for a $49/mo tier.',
    organization: 'Cloud SaaS Co',
    dateStarted: '2026-08-01',
    dateCompleted: '2026-08-18',
    status: 'completed',
    language: 'en',
    languages: ['en', 'vi'],
    tags: ['prd', 'product-spec', 'pricing', 'plg', 'telemetry'],
    attachments: [],
    createdAt: '2026-08-19T10:00:00.000Z',
    updatedAt: '2026-08-19T10:00:00.000Z',
    evidenceStrength: 5, // L5 Demonstrated
    inferredKnowledge: ['Two-Way Door Decision Framing', 'Tripwire Telemetry Guardrails', 'Painted-Door Conversion Testing'],
    confirmedKnowledge: ['Falsifiable Product Hypothesis Design', 'Cannibalization Risk Guardrails'],
    inferredSkills: ['Ambiguity Framing', 'Product Operations'],
    confirmedSkills: ['Product Strategy', 'Hypothesis Testing', 'Tripwire Guardrails'],
    competencies: ['PRD Authoring', 'Cross-Functional Executive Framing'],
    domains: ['Enterprise SaaS', 'E-Commerce & Retail'],
    methods: ['Painted-Door Synthetic Funnel', 'Weekly Cohort Conversion Drop-off Analysis'],
    frameworks: ['Type 1 vs Type 2 Door Framework', 'RICE Scoring'],
    evidenceStatements: [
      'Authored PRD leading to +18% trial-to-paid conversion lift and patched a 35% mobile checkout drop-off in 48 hours.'
    ],
    careerRelevance: ['Product Management'],
    metadata: {
      targetPersona: 'Self-Serve SMB Engineering Leads',
      northStarMetric: 'Trial-to-Paid Conversion Rate (+18% achieved)'
    }
  },

  // 6. Assessments / Case Interviews (Evidence Strength 6 - Validated)
  {
    id: 'ass-grab-product-ops-case',
    title: 'Grab Product Operations Case: Driver Onboarding SLA & Churn Reduction',
    sourceFamily: 'assessment',
    sourceType: 'product_case',
    description: 'Take-home assessment case analyzing merchant/driver verification bottlenecks, OCR fraud detection trade-offs, and driver retention in Southeast Asia.',
    organization: 'Grab Holdings',
    provider: 'Grab Interview Process',
    dateStarted: '2026-07-05',
    dateCompleted: '2026-07-12',
    status: 'passed',
    language: 'vi',
    languages: ['vi', 'en'],
    tags: ['grab', 'product-ops', 'sla', 'churn', 'southeast-asia'],
    attachments: [],
    createdAt: '2026-07-13T09:00:00.000Z',
    updatedAt: '2026-07-13T09:00:00.000Z',
    evidenceStrength: 6, // L6 Validated
    inferredKnowledge: ['Two-Sided Marketplace Liquidity', 'Onboarding Verification Latency', 'Fraud False-Positive Trade-offs'],
    confirmedKnowledge: ['Driver Activation Funnel Economics', 'Operational SLA Escalation Matrix'],
    inferredSkills: ['Funnel Analytics', 'Stakeholder Management'],
    confirmedSkills: ['Product Operations', 'SOP Design', 'Process Optimization'],
    competencies: ['Marketplace Operations', 'Root Cause Diagnostics'],
    domains: ['E-Commerce & Retail', 'Enterprise SaaS'],
    methods: ['Pareto Churn Decomposition', 'Automated Verification Routing'],
    frameworks: ['Issue Tree Root Cause Analysis', 'SLA Risk Matrix'],
    evidenceStatements: [
      'Hiring panel awarded Top Tier rating for actionable SLA escalation design and realistic fraud vs conversion trade-offs.'
    ],
    careerRelevance: ['Product Management', 'Product Operations'],
    assessmentData: {
      assessmentType: 'Hiring Take-Home Case',
      score: '94/100 (Exceptional Tier)',
      result: 'passed',
      evaluationDate: '2026-07-14',
      relatedJobTitle: 'Senior Product Operations Manager',
      reviewerFeedback: 'Outstanding structuring of operational trade-offs; robust quantitative model balancing driver acquisition cost against manual audit overhead.',
      skillsDemonstrated: ['Product Operations', 'Root Cause Analysis', 'Executive Communication']
    },
    metadata: {
      hiringCompany: 'Grab Holdings',
      targetRole: 'Senior Product Operations Manager',
      score: '94/100'
    }
  },

  // 7. Research Paper (Knowledge Family)
  {
    id: 'res-kafka-stream-processing',
    title: 'Kafka: A Distributed Messaging System for Log Processing',
    sourceFamily: 'knowledge',
    sourceType: 'research_paper',
    description: 'Foundational research paper on distributed commit logs, disk sequential throughput, and pagecache zero-copy transfers by Jay Kreps et al.',
    url: 'https://www.microsoft.com/en-us/research/publication/kafka-a-distributed-messaging-system-for-log-processing/',
    author: 'Jay Kreps, Neha Narkhede, Jun Rao',
    organization: 'LinkedIn & Apache Software Foundation',
    datePublished: '2011-06-01',
    status: 'completed',
    language: 'en',
    languages: ['en'],
    tags: ['kafka', 'distributed-systems', 'zero-copy', 'log-structured'],
    attachments: [],
    createdAt: '2026-08-05T00:00:00.000Z',
    updatedAt: '2026-08-05T00:00:00.000Z',
    evidenceStrength: 1,
    inferredKnowledge: ['Zero-Copy Page Cache Transfer', 'Sequential Disk I/O Throughput', 'Distributed Consumer Groups'],
    confirmedKnowledge: ['Log-Structured Storage Engine', 'Partition Replication Semantics'],
    inferredSkills: ['Event-Driven Architecture', 'Kafka'],
    confirmedSkills: ['Distributed Systems'],
    competencies: ['Storage Engine Mechanics'],
    domains: ['Cloud Infrastructure & DevOps'],
    methods: ['Empirical Benchmark Sizing'],
    frameworks: ['Distributed Commit Log Paradigm'],
    evidenceStatements: [
      'Deep conceptual understanding of zero-copy disk transfers and partitioned log scaling.'
    ],
    careerRelevance: ['Software Engineering', 'DevOps & Cloud'],
    metadata: {
      authors: ['Jay Kreps', 'Neha Narkhede', 'Jun Rao'],
      citationCount: 4500
    }
  },

  // 7. Playbooks & Frameworks (Canonical Knowledge)
  {
    id: 'pb-shape-up-basecamp',
    title: 'Shape Up: Stop Running in Circles and Ship Work that Matters',
    sourceFamily: 'playbook',
    sourceType: 'industry_framework',
    description: 'Six-week product cycle framework featuring betting tables, pitch appetites, Hill charts, and un-estimated rabbit holes by Basecamp / 37signals.',
    url: 'https://basecamp.com/shapeup',
    author: 'Ryan Singer',
    organization: '37signals / Basecamp',
    provider: 'Basecamp',
    datePublished: '2019-08-01',
    status: 'completed',
    language: 'en',
    languages: ['en'],
    tags: ['product-management', 'agile-alternative', 'shape-up', 'appetite', 'hill-charts'],
    attachments: [],
    createdAt: '2026-08-10T00:00:00.000Z',
    updatedAt: '2026-08-10T00:00:00.000Z',
    evidenceStrength: 3,
    inferredKnowledge: ['Fixed Time Variable Scope', 'Hill Charts', 'Breadboarding & Fat Marker Sketches'],
    confirmedKnowledge: ['Betting Table Governance', 'Appetite Sizing'],
    inferredSkills: ['Agile Methodologies', 'Scrum', 'Product Strategy'],
    confirmedSkills: ['Product Management', 'Cross-Functional Leadership'],
    competencies: ['Product Delivery Architecture'],
    domains: ['Enterprise SaaS', 'Consumer Tech'],
    methods: ['Fixed-Time Variable Scope', 'Hill Charting'],
    frameworks: ['Shape Up Methodology'],
    evidenceStatements: [
      'Mastery of 6-week betting cycles and asynchronous pitch deconstruction.'
    ],
    careerRelevance: ['Product Management', 'Engineering Management', 'Software Engineering'],
    metadata: {
      standardsBody: 'Basecamp',
      version: '1.0'
    }
  },
  {
    id: 'pb-aws-well-architected',
    title: 'AWS Well-Architected Framework: Reliability & Security Pillars',
    sourceFamily: 'playbook',
    sourceType: 'industry_framework',
    description: 'Architectural best practices and operational guidelines across multi-AZ failover, disaster recovery RTO/RPO, least-privilege IAM, and blast-radius containment.',
    url: 'https://aws.amazon.com/architecture/well-architected/',
    author: 'Amazon Web Services Architecture Team',
    organization: 'Amazon Web Services',
    provider: 'AWS',
    datePublished: '2023-04-15',
    status: 'completed',
    language: 'en',
    languages: ['en'],
    tags: ['cloud-architecture', 'reliability', 'security', 'aws', 'disaster-recovery'],
    attachments: [],
    createdAt: '2026-08-12T00:00:00.000Z',
    updatedAt: '2026-08-12T00:00:00.000Z',
    evidenceStrength: 3,
    inferredKnowledge: ['Blast Radius Containment', 'Multi-Region Active-Active', 'RTO/RPO Recovery Tiers'],
    confirmedKnowledge: ['Reliability Pillar Checklists', 'IAM Least Privilege Boundaries'],
    inferredSkills: ['AWS', 'System Architecture'],
    confirmedSkills: ['Cloud Infrastructure & DevOps', 'Distributed Systems'],
    competencies: ['Resilient Cloud System Design'],
    domains: ['Cloud Infrastructure & DevOps', 'Fintech & Payments'],
    methods: ['Well-Architected Review (WAR)', 'Failure Mode Analysis'],
    frameworks: ['AWS Well-Architected Framework'],
    evidenceStatements: [
      'Validated understanding of cloud reliability trade-offs and blast-radius isolation.'
    ],
    careerRelevance: ['DevOps & Cloud', 'Software Engineering'],
    metadata: {
      standardsBody: 'Amazon Web Services',
      version: '2023.2'
    }
  },

  // 8. Global Voices & Publications (Expert Thought Leadership)
  {
    id: 'pub-pragmatic-engineer-high-load',
    title: 'The Pragmatic Engineer: Architecture Tradeoffs in High-Load Systems',
    sourceFamily: 'publication',
    sourceType: 'expert_newsletter',
    description: 'Deep-dive analysis on how high-growth scaleups handle distributed locking, database partitioning, and incident retrospectives by Gergely Orosz.',
    url: 'https://newsletter.pragmaticengineer.com/',
    author: 'Gergely Orosz',
    organization: 'The Pragmatic Engineer',
    provider: 'Substack',
    datePublished: '2024-02-14',
    status: 'completed',
    language: 'en',
    languages: ['en'],
    tags: ['architecture', 'high-load', 'career-growth', 'incident-response', 'tradeoffs'],
    attachments: [],
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
    evidenceStrength: 1,
    inferredKnowledge: ['Staff+ Engineering Impact', 'High-Load Scaleup Architecture'],
    confirmedKnowledge: ['System Architecture Trade-offs'],
    inferredSkills: ['Distributed Systems', 'System Architecture'],
    confirmedSkills: ['Software Engineering'],
    competencies: ['Engineering Leadership'],
    domains: ['Enterprise SaaS', 'Cloud Infrastructure & DevOps'],
    methods: ['Empirical Case Studies', 'Staff Engineer Synthesis'],
    frameworks: ['Pragmatic Architecture Review'],
    evidenceStatements: [
      'Exposure to real-world architectural tradeoffs and senior engineering execution patterns.'
    ],
    careerRelevance: ['Software Engineering', 'DevOps & Cloud'],
    metadata: {
      publicationPlatform: 'Substack',
      edition: 'Weekly Staff Edition'
    }
  },
  {
    id: 'pub-netflix-chaos-engineering',
    title: 'Netflix TechBlog: Principles of Chaos Engineering & Production Fault Injection',
    sourceFamily: 'publication',
    sourceType: 'engineering_techblog',
    description: 'Foundational lessons in building confidence in system resilience by experimenting on production microservices under turbulent conditions.',
    url: 'https://netflixtechblog.com/',
    author: 'Netflix Chaos Engineering Team',
    organization: 'Netflix',
    provider: 'Netflix TechBlog',
    datePublished: '2022-10-01',
    status: 'completed',
    language: 'en',
    languages: ['en'],
    tags: ['chaos-engineering', 'resilience', 'microservices', 'netflix', 'fault-injection'],
    attachments: [],
    createdAt: '2026-08-18T00:00:00.000Z',
    updatedAt: '2026-08-18T00:00:00.000Z',
    evidenceStrength: 1,
    inferredKnowledge: ['Hypothesis-Driven Steady State Verification', 'Automated Chaos Injection'],
    confirmedKnowledge: ['Failure Domain Isolation', 'Microservice Fault Tolerance'],
    inferredSkills: ['Chaos Engineering', 'Microservices'],
    confirmedSkills: ['System Architecture', 'DevOps & Cloud'],
    competencies: ['Resilience Engineering'],
    domains: ['Cloud Infrastructure & DevOps', 'Consumer Tech'],
    methods: ['Chaos Experimentation', 'Game Day Scenarios'],
    frameworks: ['Principles of Chaos Engineering'],
    evidenceStatements: [
      'Familiarity with steady-state hypotheses and automated production fault injection.'
    ],
    careerRelevance: ['Software Engineering', 'DevOps & Cloud'],
    metadata: {
      companyBlog: 'Netflix TechBlog',
      publicationPlatform: 'Medium'
    }
  }
];

class SourceStore {
  private sources: NormalizedSource[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.load();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try { fn(); } catch (err) { console.error('Error in sourceStore listener', err); }
    });
  }

  private sanitizeSource(source: NormalizedSource): NormalizedSource {
    const confirmedSkills = Array.from(new Set(source.confirmedSkills || []));
    const confirmedSet = new Set(confirmedSkills);
    const inferredSkills = Array.from(new Set((source.inferredSkills || []).filter(s => !confirmedSet.has(s))));

    const confirmedKnowledge = Array.from(new Set(source.confirmedKnowledge || []));
    const confirmedKnowledgeSet = new Set(confirmedKnowledge);
    const inferredKnowledge = Array.from(new Set((source.inferredKnowledge || []).filter(k => !confirmedKnowledgeSet.has(k))));

    return {
      ...source,
      confirmedSkills,
      inferredSkills,
      confirmedKnowledge,
      inferredKnowledge,
      tags: Array.from(new Set(source.tags || [])),
      competencies: Array.from(new Set(source.competencies || []))
    };
  }

  private load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const existingList = (Array.isArray(parsed) ? parsed : []).map(s => this.sanitizeSource(s));
        const existingIds = new Set(existingList.map(s => s.id));
        
        // Merge missing seeds so newly defined playbooks/publications are populated
        const missingSeeds = INITIAL_SEED_SOURCES
          .filter(seed => !existingIds.has(seed.id))
          .map(s => this.sanitizeSource(s));
          
        this.sources = [...existingList, ...missingSeeds];
        if (missingSeeds.length > 0) {
          this.save();
        }
      } else {
        this.sources = INITIAL_SEED_SOURCES.map(s => this.sanitizeSource(s));
        this.save();
      }
    } catch {
      this.sources = INITIAL_SEED_SOURCES.map(s => this.sanitizeSource(s));
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sources));
    } catch (e) {
      console.error('Failed to save sources to localStorage', e);
    }
    this.notify();
  }

  getSources(): NormalizedSource[] {
    return [...this.sources];
  }

  getSourceById(id: string): NormalizedSource | undefined {
    return this.sources.find(s => s.id === id);
  }

  addSource(source: NormalizedSource): NormalizedSource {
    const cleanSource = this.sanitizeSource(source);
    const existingIndex = this.sources.findIndex(s => s.id === cleanSource.id);
    if (existingIndex >= 0) {
      this.sources[existingIndex] = { ...cleanSource, updatedAt: new Date().toISOString() };
    } else {
      this.sources.unshift({
        ...cleanSource,
        createdAt: cleanSource.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    this.save();
    return this.sources[existingIndex >= 0 ? existingIndex : 0];
  }

  updateSource(id: string, updates: Partial<NormalizedSource>): NormalizedSource | undefined {
    const index = this.sources.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    const merged = {
      ...this.sources[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.sources[index] = this.sanitizeSource(merged);
    this.save();
    return this.sources[index];
  }

  deleteSource(id: string): boolean {
    const initialLen = this.sources.length;
    this.sources = this.sources.filter(s => s.id !== id);
    if (this.sources.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  resetToDefaults(): void {
    this.sources = [...INITIAL_SEED_SOURCES];
    this.save();
  }

  /**
   * Aggregate Skill Evidence Profiles (Answers: "Why does Career OS think I have this skill?")
   */
  /**
   * Aggregate Skill Evidence Profiles (Answers: "Why does Career OS think I have this skill?")
   * Enforces Canonical Multilingual Mapping: "Chiến lược sản phẩm", "Product Strategy", etc. map to same skill.
   * Multi-Factor Scoring prioritizes: 1. Relevance, 2. Recency, 3. Application, 4. Outcome, 5. External validation.
   */
  getSkillEvidenceProfiles(): SkillEvidenceProfile[] {
    const skillMap = new Map<string, {
      skillName: string;
      canonicalId: string;
      sources: NormalizedSource[];
    }>();

    // Map skills from all sources with Canonical Multilingual Resolution
    for (const src of this.sources) {
      const allSkills = new Set([...src.confirmedSkills, ...src.inferredSkills]);
      for (const skill of allSkills) {
        const canonical = CanonicalSkillRegistry.resolve(skill);
        const canonicalId = canonical.canonicalId;
        const canonicalName = canonical.canonicalName;

        if (!skillMap.has(canonicalId)) {
          skillMap.set(canonicalId, {
            skillName: canonicalName,
            canonicalId,
            sources: []
          });
        }
        
        // Deduplicate source references for the canonical entity
        const existingSources = skillMap.get(canonicalId)!.sources;
        if (!existingSources.some(s => s.id === src.id)) {
          existingSources.push(src);
        }
      }
    }

    const profiles: SkillEvidenceProfile[] = [];
    const now = new Date();

    skillMap.forEach(({ skillName, canonicalId, sources }) => {
      let maxStrength: EvidenceStrengthLevel = 0;
      let learningCount = 0;
      let credentialCount = 0;
      let projectCount = 0;
      let artifactCount = 0;
      let assessmentCount = 0;
      let experienceCount = 0;

      let hasDemonstrated = false;
      let hasValidated = false;
      let hasApplied = false;
      let hasMetrics = false;
      let minRecencyMonths = 999;

      const evidenceList = sources.map(src => {
        if (src.evidenceStrength > maxStrength) {
          maxStrength = src.evidenceStrength;
        }

        // Recency calculation
        const dateStr = src.dateCompleted || src.datePublished || src.createdAt;
        const srcDate = new Date(dateStr);
        if (!isNaN(srcDate.getTime())) {
          const diffMs = Math.max(0, now.getTime() - srcDate.getTime());
          const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.4));
          if (months < minRecencyMonths) minRecencyMonths = months;
        }

        // Check for quantified outcome metrics
        if ((src.evidenceStatements && src.evidenceStatements.length > 0) || src.assessmentData?.score) {
          hasMetrics = true;
        }

        let relationType: 'learned' | 'credentialed' | 'applied' | 'demonstrated' | 'validated' = 'learned';
        if (src.sourceFamily === 'assessment' || (src.assessmentData && src.assessmentData.result === 'passed')) {
          relationType = 'validated';
          assessmentCount++;
          hasValidated = true;
        } else if (src.sourceFamily === 'artifact' || src.sourceFamily === 'experience' || src.evidenceStrength >= 5) {
          relationType = 'demonstrated';
          if (src.sourceFamily === 'experience') experienceCount++;
          else artifactCount++;
          hasDemonstrated = true;
        } else if (src.sourceFamily === 'project' || src.evidenceStrength === 3) {
          relationType = 'applied';
          projectCount++;
          hasApplied = true;
        } else if (src.sourceFamily === 'credential') {
          if (src.evidenceStrength >= 4) {
            relationType = 'validated';
            hasValidated = true;
          } else {
            relationType = 'credentialed';
          }
          credentialCount++;
        } else {
          relationType = 'learned';
          learningCount++;
        }

        const strengthDef = getEvidenceStrengthDefinition(src.evidenceStrength);

        return {
          sourceId: src.id,
          sourceTitle: src.title,
          sourceFamily: src.sourceFamily,
          sourceType: src.sourceType,
          evidenceStrength: src.evidenceStrength,
          evidenceStrengthName: strengthDef.name,
          relationType,
          quoteOrStatement: src.evidenceStatements?.[0] || src.description,
          date: src.dateCompleted || src.datePublished || src.createdAt
        };
      });

      // Multi-Factor Proficiency Score (NOT simply counting sources!)
      // 1. Application Depth (30% weight)
      let applicationScore = 25;
      if (hasDemonstrated && hasApplied) applicationScore = 100;
      else if (hasDemonstrated) applicationScore = 90;
      else if (hasApplied) applicationScore = 65;

      // 2. External Validation (25% weight)
      let validationScore = 20;
      if (hasValidated) validationScore = 100;
      else if (maxStrength >= 5) validationScore = 55;

      // 3. Outcome & Impact (20% weight)
      const outcomeScore = hasMetrics ? (hasDemonstrated ? 95 : 75) : 35;

      // 4. Recency Currency (15% weight)
      let recencyScore = 50;
      if (minRecencyMonths <= 6) recencyScore = 100;
      else if (minRecencyMonths <= 12) recencyScore = 85;
      else if (minRecencyMonths <= 24) recencyScore = 70;

      // 5. Career & Domain Relevance (10% weight)
      const relevanceScore = 90;

      const multiFactorConfidence = Math.round(
        (applicationScore * 0.30) +
        (validationScore * 0.25) +
        (outcomeScore * 0.20) +
        (recencyScore * 0.15) +
        (relevanceScore * 0.10)
      );

      profiles.push({
        skillName,
        canonicalSkillId: canonicalId,
        confidenceScore: Math.min(99, Math.max(10, multiFactorConfidence)),
        totalSourcesCount: sources.length,
        maxStrength,
        breakdown: {
          learningSources: learningCount,
          credentials: credentialCount,
          projects: projectCount,
          artifacts: artifactCount,
          assessments: assessmentCount,
          experiences: experienceCount
        },
        evidenceList
      });
    });

    // Sort by multi-factor confidence descending
    return profiles.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }

  /**
   * Compare Job Requirements against User Evidence (Job / Role Connection)
   */
  getJobEvidenceMatch(job: JobListing): JobEvidenceMatchReport {
    const skillProfiles = this.getSkillEvidenceProfiles();
    const requirements: JobEvidenceMatchRequirement[] = [];
    const demonstratedGaps: string[] = [];
    const recommendedActions: string[] = [];

    const reqSkills = job.requiredSkills || [];
    const niceSkills = job.niceToHaveSkills || [];
    const allExpected = [...reqSkills, ...niceSkills];

    let satisfiedKnowledgeCount = 0;
    let satisfiedApplicationCount = 0;
    let totalStrengthSum = 0;

    for (const skill of allExpected) {
      const isPreferred = niceSkills.includes(skill);
      const targetCanonical = CanonicalSkillRegistry.resolve(skill);
      // Find matching profile via canonical ID or name
      const matchedProfile = skillProfiles.find(p => 
        p.canonicalSkillId === targetCanonical.canonicalId ||
        p.skillName.toLowerCase() === skill.toLowerCase() ||
        p.skillName.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(p.skillName.toLowerCase())
      );

      const userStrength = matchedProfile ? matchedProfile.maxStrength : 0;
      const userSourcesCount = matchedProfile ? matchedProfile.totalSourcesCount : 0;
      totalStrengthSum += userStrength;

      // Minimum expected strength for Senior/Lead roles is L4 (Applied) or L5 (Demonstrated)
      const expectedStrength: EvidenceStrengthLevel = job.level === 'Junior' ? 2 : job.level === 'Mid-Level' ? 3 : 4;

      let status: 'strongly_proven' | 'partially_proven' | 'learned_only' | 'gap' = 'gap';

      if (userStrength >= expectedStrength) {
        status = 'strongly_proven';
        satisfiedKnowledgeCount++;
        satisfiedApplicationCount++;
      } else if (userStrength >= 2) {
        status = 'learned_only';
        satisfiedKnowledgeCount++;
        demonstratedGaps.push(`Need applied/demonstrated proof for ${skill} (currently at Level ${userStrength}: ${getEvidenceStrengthDefinition(userStrength).name})`);
      } else if (userStrength === 1) {
        status = 'partially_proven';
        satisfiedKnowledgeCount += 0.5;
        demonstratedGaps.push(`Only conceptual exposure for ${skill}`);
      } else {
        status = 'gap';
        demonstratedGaps.push(`Missing evidence for required skill: ${skill}`);
      }

      requirements.push({
        skill,
        isPreferred,
        requiredEvidenceStrength: expectedStrength,
        userEvidenceStrength: userStrength,
        userSourcesCount,
        status,
        supportingSources: matchedProfile ? matchedProfile.evidenceList.map(e => ({
          id: e.sourceId,
          title: e.sourceTitle,
          type: e.sourceType,
          strength: e.evidenceStrength
        })) : []
      });
    }

    const totalCount = allExpected.length || 1;
    const knowledgeCoverage = Math.min(100, Math.round((satisfiedKnowledgeCount / totalCount) * 100));
    const applicationCoverage = Math.min(100, Math.round((satisfiedApplicationCount / totalCount) * 100));
    const avgStrength = Number((totalStrengthSum / totalCount).toFixed(1));

    if (demonstratedGaps.length > 0) {
      recommendedActions.push(`Add a concrete Project, PRD, or Case study demonstrating ${demonstratedGaps[0].split(':')[0] || 'core requirements'}.`);
    }
    if (applicationCoverage < 70) {
      recommendedActions.push('Calibrate and submit a practical take-home case or technical challenge to elevate evidence to Level 5/6.');
    }
    if (knowledgeCoverage === 100 && applicationCoverage >= 80) {
      recommendedActions.push('Candidate exhibits verified tier-1 evidence across all core competencies.');
    }

    return {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      knowledgeCoverage,
      applicationCoverage,
      overallEvidenceStrengthAvg: avgStrength,
      requirements,
      demonstratedGaps,
      recommendedActions
    };
  }

  /**
   * Aggregate Metrics across the entire Library & Career Intelligence OS
   */
  getAggregateMetrics() {
    let learningSources = 0;
    let credentials = 0;
    let knowledgeSources = 0;
    let experiences = 0;
    let projects = 0;
    let artifacts = 0;
    let assessments = 0;
    let contentSources = 0;
    let validatedEvidence = 0;

    const uniqueDomains = new Set<string>();
    const uniqueSkills = new Set<string>();
    const appliedSkills = new Set<string>();
    const demonstratedSkills = new Set<string>();
    const validatedSkills = new Set<string>();

    for (const src of this.sources) {
      switch (src.sourceFamily) {
        case 'learn': learningSources++; break;
        case 'credential': credentials++; break;
        case 'knowledge': knowledgeSources++; break;
        case 'experience': experiences++; break;
        case 'project': projects++; break;
        case 'artifact': artifacts++; break;
        case 'assessment': assessments++; break;
        case 'content': contentSources++; break;
      }

      if (src.evidenceStrength >= 5) {
        validatedEvidence++;
      }

      src.domains.forEach(d => uniqueDomains.add(d));
      
      const allSkills = [...src.confirmedSkills, ...src.inferredSkills];
      allSkills.forEach(s => {
        uniqueSkills.add(s);
        if (src.evidenceStrength >= 4) appliedSkills.add(s);
        if (src.evidenceStrength >= 5) demonstratedSkills.add(s);
        if (src.evidenceStrength >= 6) validatedSkills.add(s);
      });
    }

    const totalSources = this.sources.length || 1;
    const evidenceCoverage = Math.min(100, Math.round((validatedEvidence / totalSources) * 100));

    return {
      totalSources: this.sources.length,
      learningSources,
      credentials,
      knowledgeSources,
      experiences,
      projects,
      artifacts,
      assessments,
      contentSources,
      validatedEvidence,
      knowledgeBreadth: uniqueDomains.size,
      knowledgeDepth: uniqueSkills.size,
      appliedSkillsCount: appliedSkills.size,
      demonstratedSkillsCount: demonstratedSkills.size,
      validatedSkillsCount: validatedSkills.size,
      evidenceCoverage
    };
  }
}

export const sourceStore = new SourceStore();
