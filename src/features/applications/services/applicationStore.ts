import { 
  JobApplication, 
  ApplicationAssessment, 
  ApplicationCase, 
  PreparationTask, 
  ApplicationEvidence,
  ApplicationOutcome,
  ApplicationRequirement,
  JobSnapshot,
  ApplicationPrimaryState,
  ApplicationSubState,
  ApplicationStateHistory,
  ApplicationInterview,
  UpcomingDeadlineItem,
  calculateUrgency,
  mapLegacyStatusToPipelineState,
  mapPipelineStateToLegacyStatus,
  AssessmentType,
  AssessmentStatus,
  JobApplicationStatus
} from '../types';
import { JobListing } from '../../../types';
import { ContextualIntelligenceEngine } from './contextualIntelligenceEngine';
import { CareerSemanticParser } from '../../intelligence/services/careerSemanticParser';

const STORAGE_KEYS = {
  APPLICATIONS: 'career_os_applications_v1',
  ASSESSMENTS: 'career_os_assessments_v1',
  CASES: 'career_os_cases_v1',
  TASKS: 'career_os_prep_tasks_v1',
  EVIDENCE: 'career_os_app_evidence_v1'
};

// Section 53: Pre-seeded synthetic example: Company X - Product Strategy Manager
const SEED_APPLICATION: JobApplication = {
  id: 'app-company-x-prod-strat',
  companyId: 'comp-x',
  companyName: 'Company X',
  companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
  roleId: 'role-prod-strat',
  roleTitle: 'Product Strategy Manager',
  jobUrl: 'https://companyx.careers/jobs/product-strategy-manager-sea',
  location: 'Singapore / Remote (Southeast Asia)',
  employmentType: 'Full-time',
  pipelineState: 'assessment_case',
  pipelineSubState: 'take_home',
  status: 'CASE',
  appliedAt: '2026-08-28T08:30:00.000Z',
  deadline: '2026-09-12T17:00:00.000Z',
  isSyntheticSample: true,
  stateHistory: [
    { toState: 'applied_screening', toSubState: 'applied', changedAt: '2026-08-28T08:30:00.000Z' },
    { fromState: 'applied_screening', toState: 'applied_screening', toSubState: 'screening', changedAt: '2026-08-30T10:00:00.000Z' },
    { fromState: 'applied_screening', toState: 'assessment_case', toSubState: 'take_home', changedAt: '2026-09-02T16:00:00.000Z', reason: 'Received take-home business case prompt' }
  ],
  requirementIds: ['req-1', 'req-2', 'req-3', 'req-4', 'req-5'],
  requirements: [
    {
      id: 'req-1',
      category: 'Strategic Thinking',
      text: 'Demonstrated experience in international market expansion, TAM sizing, and competitive moat definition.',
      mappedSkillName: 'Strategic Thinking',
      confidence: 'High'
    },
    {
      id: 'req-2',
      category: 'Analytical Skills',
      text: 'Advanced financial modeling, unit economics (LTV/CAC, payback), and pricing sensitivity analysis.',
      mappedSkillName: 'Unit Economics',
      confidence: 'High'
    },
    {
      id: 'req-3',
      category: 'Domain Knowledge',
      text: 'Deep familiarity with Southeast Asian SaaS, payment infrastructure, and regional cloud regulatory trends.',
      mappedSkillName: 'Domain Knowledge',
      confidence: 'High'
    },
    {
      id: 'req-4',
      category: 'Leadership',
      text: 'Ability to influence C-suite executives through concise data-driven syntheses (Minto Pyramid).',
      mappedSkillName: 'Executive Synthesis',
      confidence: 'High'
    },
    {
      id: 'req-5',
      category: 'Experience',
      text: '5+ years in management consulting, corporate strategy, or high-growth tech product strategy.',
      confidence: 'High'
    }
  ],
  skillIds: ['Market Sizing', 'Strategic Thinking', 'Competitive Analysis', 'Unit Economics', 'Executive Synthesis'],
  knowledgeIds: ['ku-market-entry', 'ku-unit-economics', 'ku-tam-sam-som'],
  assessmentIds: ['assess-company-x-case'],
  notes: 'Round 1 screening went very well. Received take-home business case prompt with 5 days turnaround. Hiring VP emphasized clear unit economics and go-to-market trade-offs.',
  documents: [
    {
      id: 'doc-1',
      name: 'Company_X_Candidate_Brief.pdf',
      type: 'PDF',
      uploadedAt: '2026-08-30T10:00:00.000Z',
      fileSize: '1.2 MB'
    }
  ],
  jobSnapshot: {
    title: 'Product Strategy Manager (Southeast Asia Expansion)',
    company: 'Company X',
    description: 'Company X is a high-growth B2B enterprise SaaS platform serving 40,000+ organizations across North America and Europe. We are hiring a Product Strategy Manager to spearhead our commercial entry into Southeast Asia, evaluating customer segments, local pricing models, partner ecosystems, and product localization roadmaps.',
    responsibilities: [
      'Lead quantitative market sizing and addressable revenue forecasting across Vietnam, Indonesia, and Thailand.',
      'Formulate go-to-market strategies, balancing direct enterprise sales vs local channel partnerships.',
      'Model 3-year unit economics, customer acquisition payback, and gross margin profiles under various pricing tiers.',
      'Deliver executive recommendations to the Chief Product Officer and regional General Manager.'
    ],
    requirements: [
      '5+ years in corporate strategy, management consulting (MBB/Tier 2), or tech product operations.',
      'Strong quantitative modeling skills (Excel/Sheets, SQL, DCF/cohort analytics).',
      'Track record of structuring complex, ambiguous business problems into actionable execution roadmaps.'
    ],
    preferredQualifications: [
      'Experience working directly in Southeast Asian technology markets.',
      'Familiarity with SaaS metrics: NRR, GRR, Magic Number, CAC Payback, Rule of 40.'
    ],
    skills: ['Market Sizing', 'Strategic Thinking', 'Unit Economics', 'Competitive Analysis', 'Executive Synthesis'],
    location: 'Singapore / Remote (Southeast Asia)',
    salary: '$135,000 - $165,000 USD + Equity',
    sourceUrl: 'https://companyx.careers/jobs/product-strategy-manager-sea',
    capturedAt: '2026-08-28T08:30:00.000Z',
    originalSourceText: 'Full job description snapshot preserved from company careers portal on Aug 28, 2026.'
  },
  companyIntelligence: {
    companyName: 'Company X',
    businessModel: 'B2B Enterprise SaaS subscription ($250-$1,200/seat/year) with tiered usage add-ons.',
    products: ['Product Y (Workflow & Knowledge Collaboration Suite)', 'Enterprise Governance Cloud', 'AI Semantic Search Add-on'],
    market: 'Enterprise Productivity & Collaboration Software ($58B Global Market)',
    competitors: ['Atlassian (Confluence/Jira)', 'Notion Enterprise', 'Microsoft 365 / SharePoint', 'Lark / Feishu'],
    strategicPriorities: [
      'Rapid geographic expansion into high-growth emerging tech hubs (Vietnam, Indonesia, Philippines).',
      'Accelerating enterprise NRR to >120% through AI assistant upgrades.',
      'Establishing regional distributor networks to lower initial local CAC.'
    ],
    recentDevelopments: [
      'Raised $85M Series C led by tier-1 global venture fund in Q1 2026.',
      'Released localized multi-currency billing and SOC2 Type II compliance.'
    ],
    industryPosition: 'Challenger brand with superior UX and API extensibility competing against legacy enterprise incumbents.',
    sourceUrl: 'https://techcrunch.com/company-x-expansion',
    verifiedSource: true,
    capturedAt: '2026-08-28T09:00:00.000Z'
  },
  createdAt: '2026-08-28T08:30:00.000Z',
  updatedAt: '2026-09-02T16:00:00.000Z'
};

const SEED_ASSESSMENT: ApplicationAssessment = {
  id: 'assess-company-x-case',
  applicationId: 'app-company-x-prod-strat',
  type: 'TAKE_HOME_CASE',
  title: 'Southeast Asia Regional Expansion Strategy Case',
  description: '5-day strategic take-home evaluation. The objective is to evaluate whether Company X should launch Product Y in Southeast Asia, recommending a target beachhead geography, pricing structure, and 24-month roadmap.',
  deadline: '2026-09-12T17:00:00.000Z',
  status: 'DRAFTING',
  caseId: 'case-company-x-sea',
  taskIds: ['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6'],
  createdAt: '2026-08-30T10:00:00.000Z',
  updatedAt: '2026-09-02T16:00:00.000Z'
};

const SEED_CASE: ApplicationCase = {
  id: 'case-company-x-sea',
  assessmentId: 'assess-company-x-case',
  applicationId: 'app-company-x-prod-strat',
  title: 'Should Company X Expand Product Y into Southeast Asia?',
  prompt: `Company X is evaluating expanding its flagship enterprise SaaS platform, Product Y, into Southeast Asia. As Product Strategy Manager, your objective is to evaluate market attractiveness, competitive defensibility, and commercial viability.

Deliver a structured recommendation addressing:
1. Market Sizing: What is the addressable market size (TAM/SAM/SOM) across the target regional markets?
2. Beachhead Market & GTM: Which specific country (Vietnam, Indonesia, or Singapore) should serve as the primary entry point, and why?
3. Unit Economics & Pricing: What pricing model and ACV ensures sustainable customer acquisition payback under local economic constraints?
4. Key Risks & Mitigations: What are the primary failure modes (e.g. price sensitivity, local competitors, distributor lock-in), and how will Company X mitigate them?`,
  context: `Company X currently generates $42M ARR in North America and Western Europe with a median ACV of $18,000 and 112% Net Revenue Retention (NRR).
Product Y is a cloud-based collaborative knowledge workspace for product and engineering teams.
Regional expansion into Southeast Asia has been proposed by the board to capture the boom in tech startups, digital banking, and offshore engineering centers.
However, executive leadership is concerned about lower willingness-to-pay, fragmented regional tax/regulatory regimes, and incumbent competition from regional platforms (e.g. Lark, local IT consultancies).`,
  companyContext: 'Company X has 280 employees, operates on AWS cloud infrastructure, and has $35M in cash reserves allocated for international expansion.',
  industryId: 'Technology / Enterprise SaaS',
  geography: 'Southeast Asia (Vietnam, Indonesia, Singapore)',
  caseTypeIds: ['Market Entry', 'Growth', 'Strategy'],
  skillIds: ['Market Sizing', 'Strategic Thinking', 'Competitive Analysis', 'Unit Economics', 'Executive Synthesis'],
  relatedKnowledgeIds: ['ku-market-entry', 'ku-unit-economics', 'ku-tam-sam-som'],
  relatedFrameworkIds: ["Porter's Five Forces", 'TAM/SAM/SOM Framework', 'LTV/CAC Rule'],
  relatedDataPointIds: ['dp-saas-nrr', 'dp-saas-margin', 'dp-sea-growth'],
  relatedIntelligenceIds: ['intel-saas-sea', 'intel-pricing-sea'],
  relatedResourceIds: ['book-crossing-chasm', 'book-high-growth-handbook'],
  relatedCaseStudyIds: ['cs-saas-expansion', 'cs-market-entry'],
  questions: [
    'What is the estimated SOM for Product Y in Vietnam and Indonesia by Year 3?',
    'Should Company X adopt local currency pricing at a 40% discount vs Western tiers or maintain USD enterprise pricing?',
    'What partnership model (local VAR vs direct sales team) maximizes Year 1 gross margin?',
    'What key assumptions are you making regarding churn and customer onboarding friction?'
  ],
  exhibits: [
    {
      id: 'ex-1',
      title: 'Exhibit 1: Southeast Asia Tech Enterprise & Developer Headcount',
      description: 'Breakdown of venture-backed startups, mid-market IT firms, and enterprise developers across Singapore, Vietnam, and Indonesia (2024-2026).',
      type: 'TABLE',
      dataPreview: {
        countries: [
          { country: 'Singapore', enterprises: '4,200', devHeadcount: '65,000', medianACV: '$14,500' },
          { country: 'Vietnam', enterprises: '8,900', devHeadcount: '120,000', medianACV: '$4,800' },
          { country: 'Indonesia', enterprises: '11,500', devHeadcount: '95,000', medianACV: '$5,200' }
        ]
      }
    },
    {
      id: 'ex-2',
      title: 'Exhibit 2: Benchmark SaaS Gross Margins & Payback Periods',
      description: 'Regional enterprise SaaS financial metrics collected from public filings and Gartner industry benchmarks.',
      type: 'CHART',
      dataPreview: {
        metric: 'Median Gross Margin: 78.5% | Median CAC Payback: 14 months | Target LTV/CAC: >3.5x'
      }
    }
  ],
  assumptions: [
    '[ASSUMPTION] Average engineering seat willingness-to-pay in Vietnam is approximately $15/seat/month vs $35/seat/month in the US.',
    '[ASSUMPTION] Direct sales hiring in Singapore requires $160k OTE, while regional business development reps in Vietnam cost $45k OTE.',
    '[ASSUMPTION] Cloud data residency regulations in Vietnam (Decree 53) will require an AWS/local cloud relay node by Month 6.'
  ],
  myNotes: `Key observations from initial reading:
- Vietnam represents the largest absolute engineering developer pool (120k developers) but lower willingness to pay ($4.8k ACV).
- Singapore has high ACV ($14.5k) but is heavily saturated with Atlassian and Notion enterprise reps.
- Best beachhead angle: Enter Vietnam first through engineering-focused mid-market outsourcing firms, then expand into Indonesia fintechs.`,
  myHypotheses: `Hypothesis 1: Company X can achieve $3.2M ARR in Vietnam within 24 months by offering a lightweight 'Team Tier' priced in VND ($12/user/month) through 2 premier local cloud distributors (e.g., CMC Telecom or FPT).
Hypothesis 2: Maintaining pure US pricing ($35/user) will cap Year 1 adoption to fewer than 25 regional enterprises.`,
  myAnalysis: `Quantitative TAM Sizing:
- Vietnam Mid-Market & Outsource IT companies: 8,900 firms.
- Target ICP: Companies with 20-200 technical staff = ~2,400 addressable companies.
- SAM @ 20 seats avg x $144/year = $6.9M annually in Vietnam alone.
- Unit Economics: CAC via distributor = $1,800. LTV with 2.5 year retention and 78% margin = $5,616. LTV/CAC ratio = 3.12x (healthy).`,
  myRecommendation: `Recommendation: Proceed with phased Southeast Asian entry starting with Vietnam as the initial beachhead.
1. Product Tiering: Launch 'Product Y Lite' with localized Vietnamese UI and VND invoicing.
2. Channel Strategy: Partner with top 2 IT distributors rather than building a heavy direct field sales force in Year 1.
3. Roadmap: Launch Singapore sales hub only after reaching $1.5M ARR milestone in Vietnam to fund regional expansion from operating cash flow.`,
  status: 'DRAFTING',
  isPrivate: true,
  visibility: 'PRIVATE',
  analysisReport: {
    overview: 'High-stakes strategic market entry assessment testing business acumen, numerical rigor, and go-to-market trade-offs.',
    decisionToMake: 'Whether and how Company X should enter the Southeast Asian market with Product Y.',
    constraints: [
      '$35M total allocated international expansion budget',
      'Lower local willingness-to-pay vs Western market',
      'Local data residency laws (Vietnam Decree 53)',
      'Tight 5-day submission deadline'
    ],
    providedInfo: [
      'Company X core financials ($42M ARR, $18k ACV, 112% NRR)',
      'Enterprise count and developer headcount for Vietnam, Indonesia, Singapore',
      'Benchmark SaaS margins and payback expectations'
    ],
    missingInfo: [
      'Exact customer churn rates for international peers in Southeast Asia',
      'Local payment gateway processing fees and withholding tax implications'
    ],
    suggestedSkills: [
      { name: 'Market Sizing', relevance: 95, reason: 'Must calculate realistic SAM and SOM based on developer count.' },
      { name: 'Strategic Thinking', relevance: 93, reason: 'Requires selecting a beachhead market and justifying the trade-off.' },
      { name: 'Unit Economics', relevance: 88, reason: 'Must validate LTV/CAC and payback period under lower pricing.' },
      { name: 'Executive Synthesis', relevance: 82, reason: 'The hiring committee expects a crisp, decision-oriented recommendation.' }
    ],
    detectedIndustry: 'Technology / Enterprise SaaS',
    detectedGeography: 'Southeast Asia (Vietnam, Indonesia, Singapore)',
    detectedCaseTypes: [
      { type: 'Market Entry', confidence: 'High' },
      { type: 'Growth', confidence: 'High' },
      { type: 'Strategy', confidence: 'High' }
    ],
    deliverablesExpected: [
      'Executive Memo / Deck (10-12 slides)',
      'Financial Model & Unit Economics Tab',
      '24-Month Go-to-Market Milestone Roadmap'
    ]
  },
  createdAt: '2026-08-30T10:00:00.000Z',
  updatedAt: '2026-09-02T16:00:00.000Z'
};

// Second example application to demonstrate pipeline diversity
const SEED_APPLICATION_2: JobApplication = {
  id: 'app-vinfast-senior-infra',
  companyId: 'comp-vinfast',
  companyName: 'VinFast Global',
  companyLogo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&auto=format&fit=crop&q=60',
  roleId: 'role-infra-eng',
  roleTitle: 'Senior Cloud & Platform Infrastructure Engineer',
  jobUrl: 'https://vinfastauto.com/careers/senior-platform-engineer',
  location: 'Hai Phong, Vietnam (Hybrid)',
  employmentType: 'Full-time',
  pipelineState: 'interviews',
  pipelineSubState: 'final',
  status: 'FINAL_INTERVIEW',
  appliedAt: '2026-08-15T09:00:00.000Z',
  deadline: '2026-09-18T14:00:00.000Z',
  isSyntheticSample: false,
  stateHistory: [
    { toState: 'applied_screening', toSubState: 'applied', changedAt: '2026-08-15T09:00:00.000Z' },
    { fromState: 'applied_screening', toState: 'interviews', toSubState: 'technical', changedAt: '2026-08-25T11:00:00.000Z' },
    { fromState: 'interviews', toState: 'interviews', toSubState: 'final', changedAt: '2026-09-01T10:00:00.000Z', reason: 'Passed technical deep-dive round' }
  ],
  requirementIds: ['req-vf-1', 'req-vf-2'],
  requirements: [
    {
      id: 'req-vf-1',
      category: 'Technical Knowledge',
      text: 'Distributed telematics ingestion using Kafka, Kubernetes, and Golang/Java with 99.99% uptime.',
      mappedSkillName: 'Distributed Systems',
      confidence: 'High'
    },
    {
      id: 'req-vf-2',
      category: 'Domain Knowledge',
      text: 'Connected vehicle telemetry protocols (MQTT, CAN bus) and battery monitoring data lake pipelines.',
      mappedSkillName: 'IoT & Telemetry',
      confidence: 'High'
    }
  ],
  skillIds: ['Distributed Systems', 'Kubernetes', 'Kafka', 'System Architecture'],
  knowledgeIds: ['ku-zero-downtime', 'ku-kafka-cdc'],
  assessmentIds: [],
  interviews: [
    {
      id: 'iv-vf-final',
      applicationId: 'app-vinfast-senior-infra',
      type: 'FINAL_EXECUTIVE',
      title: 'Final Architecture Review with VP of Software',
      interviewer: 'Nguyen Minh Tu',
      interviewerRole: 'VP of Vehicle Software Architecture',
      scheduledAt: new Date(Date.now() + 36 * 3600 * 1000).toISOString(), // ~36h from now (<48h)
      durationMinutes: 60,
      locationOrUrl: 'https://meet.google.com/vf-arch-review',
      status: 'SCHEDULED',
      notes: 'Focus on zero-downtime telematics pipeline and Kafka high availability.'
    }
  ],
  notes: 'Final executive round scheduled with VP of Vehicle Software Architecture. Focus on zero-downtime over-the-air (OTA) updates.',
  documents: [],
  jobSnapshot: {
    title: 'Senior Cloud & Platform Infrastructure Engineer',
    company: 'VinFast Global',
    description: 'Lead the telemetry pipeline processing millions of connected vehicle signals every minute across North America, Europe, and Southeast Asia.',
    responsibilities: [
      'Scale Kafka and Kubernetes telematics ingestion pipelines.',
      'Ensure high-availability battery health monitoring and fleet telemetry services.'
    ],
    requirements: ['5+ years high-throughput cloud infrastructure', 'Deep Kubernetes and Kafka internals expertise'],
    preferredQualifications: ['Automotive or IoT experience'],
    skills: ['Kafka', 'Kubernetes', 'Go', 'AWS'],
    location: 'Hai Phong, Vietnam (Hybrid)',
    salary: '60,000,000 - 85,000,000 VND / month',
    sourceUrl: 'https://vinfastauto.com/careers/senior-platform-engineer',
    capturedAt: '2026-08-15T09:00:00.000Z'
  },
  createdAt: '2026-08-15T09:00:00.000Z',
  updatedAt: '2026-09-01T10:00:00.000Z'
};

// Example 3: Grab - Applied / Screening
const SEED_APPLICATION_3: JobApplication = {
  id: 'app-grab-lead-platform',
  companyId: 'comp-grab',
  companyName: 'Grab Singapore',
  companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=60',
  roleId: 'role-grab-lead',
  roleTitle: 'Lead Cloud Platform Architect',
  jobUrl: 'https://grab.careers/jobs/lead-cloud-architect',
  location: 'Singapore / Hybrid',
  employmentType: 'Full-time',
  pipelineState: 'applied_screening',
  pipelineSubState: 'applied',
  status: 'APPLIED',
  appliedAt: '2026-09-04T10:00:00.000Z',
  deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
  stateHistory: [
    { toState: 'applied_screening', toSubState: 'applied', changedAt: '2026-09-04T10:00:00.000Z' }
  ],
  requirementIds: ['req-grab-1'],
  requirements: [
    {
      id: 'req-grab-1',
      category: 'Technical Knowledge',
      text: 'Multi-region Kubernetes mesh, Terraform governance, and FinOps cloud spend optimization.',
      mappedSkillName: 'Kubernetes',
      confidence: 'High'
    }
  ],
  skillIds: ['Kubernetes', 'Cloud Infrastructure', 'FinOps', 'System Architecture'],
  knowledgeIds: ['ku-zero-downtime'],
  assessmentIds: [],
  notes: 'Application submitted via executive referral. Recruiter introductory screening pending.',
  documents: [],
  jobSnapshot: {
    title: 'Lead Cloud Platform Architect',
    company: 'Grab Singapore',
    description: 'Drive multi-region cloud resilience and automated Kubernetes cluster lifecycle across Southeast Asia superapp workloads.',
    responsibilities: ['Architect multi-region service mesh and disaster recovery patterns.'],
    requirements: ['8+ years distributed systems architecture', 'Deep Kubernetes and AWS/GCP expertise'],
    preferredQualifications: ['Automotive or IoT experience'],
    skills: ['Kubernetes', 'Cloud Infrastructure', 'FinOps'],
    location: 'Singapore',
    salary: 'SGD 14,000 - 18,000 / month',
    sourceUrl: 'https://grab.careers/jobs/lead-cloud-architect',
    capturedAt: '2026-09-04T10:00:00.000Z'
  },
  createdAt: '2026-09-04T10:00:00.000Z',
  updatedAt: '2026-09-04T10:00:00.000Z'
};

// Example 4: Stripe - Offer / Negotiation
const SEED_APPLICATION_4: JobApplication = {
  id: 'app-stripe-staff-po',
  companyId: 'comp-stripe',
  companyName: 'Stripe',
  companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=100&auto=format&fit=crop&q=60',
  roleId: 'role-stripe-po',
  roleTitle: 'Staff Product Operations Manager',
  jobUrl: 'https://stripe.com/jobs/staff-product-ops',
  location: 'Singapore / Remote (Asia-Pacific)',
  employmentType: 'Full-time',
  pipelineState: 'offer_negotiation',
  pipelineSubState: 'offer_received',
  status: 'OFFER',
  appliedAt: '2026-08-01T09:00:00.000Z',
  deadline: new Date(Date.now() + 4 * 86400000).toISOString(),
  stateHistory: [
    { toState: 'applied_screening', toSubState: 'applied', changedAt: '2026-08-01T09:00:00.000Z' },
    { fromState: 'applied_screening', toState: 'assessment_case', toSubState: 'take_home', changedAt: '2026-08-10T14:00:00.000Z' },
    { fromState: 'assessment_case', toState: 'interviews', toSubState: 'panel', changedAt: '2026-08-20T11:00:00.000Z' },
    { fromState: 'interviews', toState: 'offer_negotiation', toSubState: 'offer_received', changedAt: '2026-09-05T14:00:00.000Z', reason: 'Received written offer package' }
  ],
  requirementIds: ['req-st-1'],
  requirements: [
    {
      id: 'req-st-1',
      category: 'Strategic Thinking',
      text: 'Global payments settlement ops, cross-border treasury routing, and partner bank reliability.',
      mappedSkillName: 'Strategic Thinking',
      confidence: 'High'
    }
  ],
  skillIds: ['Payment Systems', 'Unit Economics', 'Strategic Thinking', 'Stakeholder Management'],
  knowledgeIds: [],
  assessmentIds: [],
  offer: {
    id: 'off-stripe-1',
    applicationId: 'app-stripe-staff-po',
    baseSalary: '$190,000 USD',
    bonusOrEquity: '$120,000 RSUs (4-year vesting)',
    totalComp: '$220,000 USD/year',
    deadline: new Date(Date.now() + 4 * 86400000).toISOString(),
    receivedAt: '2026-09-05T14:00:00.000Z',
    status: 'OFFER_RECEIVED',
    notes: 'Written offer received. Evaluating equity refresh schedule and discussing signing bonus.'
  },
  notes: 'Formal offer received after 5 interview rounds. Outstanding package. Decision deadline in 4 days.',
  documents: [],
  jobSnapshot: {
    title: 'Staff Product Operations Manager',
    company: 'Stripe',
    description: 'Scale payments operations and financial partner integrations across the Asia-Pacific expansion corridors.',
    responsibilities: ['Partner with regional banks and product managers to ensure 99.999% settlement fidelity.'],
    requirements: ['7+ years payments operations or fintech product ops'],
    preferredQualifications: ['SQL or Python analytics background', 'Fintech industry experience'],
    skills: ['Payment Systems', 'Unit Economics'],
    location: 'Singapore',
    salary: '$180,000 - $210,000 USD',
    sourceUrl: 'https://stripe.com/jobs/staff-product-ops',
    capturedAt: '2026-08-01T09:00:00.000Z'
  },
  createdAt: '2026-08-01T09:00:00.000Z',
  updatedAt: '2026-09-05T14:00:00.000Z'
};

// Example 5: Shopee - Archived (Closed)
const SEED_APPLICATION_5: JobApplication = {
  id: 'app-shopee-infra',
  companyId: 'comp-shopee',
  companyName: 'Shopee Sea Group',
  companyLogo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=100&auto=format&fit=crop&q=60',
  roleId: 'role-shopee-infra',
  roleTitle: 'Infrastructure Reliability Lead',
  location: 'Singapore',
  employmentType: 'Full-time',
  pipelineState: 'archived_closed',
  pipelineSubState: 'rejected',
  status: 'REJECTED',
  appliedAt: '2026-07-10T09:00:00.000Z',
  stateHistory: [
    { toState: 'applied_screening', toSubState: 'applied', changedAt: '2026-07-10T09:00:00.000Z' },
    { fromState: 'applied_screening', toState: 'archived_closed', toSubState: 'rejected', changedAt: '2026-08-10T09:00:00.000Z', reason: 'Role frozen due to internal headcount reallocation' }
  ],
  requirementIds: [],
  requirements: [],
  skillIds: ['Kubernetes', 'Go'],
  knowledgeIds: [],
  assessmentIds: [],
  notes: 'Role closed due to internal reallocation of headcount.',
  documents: [],
  outcome: {
    applicationId: 'app-shopee-infra',
    status: 'REJECTED',
    decidedAt: '2026-08-10T09:00:00.000Z',
    companyFeedback: 'Strong candidate profile, but team priority shifted to search infrastructure.',
    learnings: ['Prepare deeper domain examples in e-commerce search architecture'],
    recommendedFollowUps: ['Re-engage recruiter in Q1 2027']
  },
  createdAt: '2026-07-10T09:00:00.000Z',
  updatedAt: '2026-08-10T09:00:00.000Z'
};

class ApplicationStore {
  private applications: JobApplication[] = [];
  private assessments: ApplicationAssessment[] = [];
  private cases: ApplicationCase[] = [];
  private tasks: PreparationTask[] = [];
  private evidence: ApplicationEvidence[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const storedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      const storedAssess = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      const storedCases = localStorage.getItem(STORAGE_KEYS.CASES);
      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      const storedEv = localStorage.getItem(STORAGE_KEYS.EVIDENCE);

      const defaultApps = [
        SEED_APPLICATION, 
        SEED_APPLICATION_2, 
        SEED_APPLICATION_3, 
        SEED_APPLICATION_4, 
        SEED_APPLICATION_5
      ];

      if (storedApps) {
        const parsed: JobApplication[] = JSON.parse(storedApps);
        // Map missing pipeline states and merge missing seed examples
        this.applications = parsed.map(app => {
          if (!app.pipelineState) {
            const { primary, sub } = mapLegacyStatusToPipelineState(app.status);
            app.pipelineState = primary;
            app.pipelineSubState = sub;
          }
          return app;
        });

        // Ensure key seed applications exist if user had an older 2-app storage
        defaultApps.forEach(defApp => {
          if (!this.applications.some(a => a.id === defApp.id)) {
            this.applications.push(defApp);
          }
        });
      } else {
        this.applications = defaultApps;
      }

      this.assessments = storedAssess ? JSON.parse(storedAssess) : [SEED_ASSESSMENT];
      this.cases = storedCases ? JSON.parse(storedCases) : [SEED_CASE];
      this.tasks = storedTasks ? JSON.parse(storedTasks) : ContextualIntelligenceEngine.generatePreparationPlan(SEED_APPLICATION, SEED_CASE);
      this.evidence = storedEv ? JSON.parse(storedEv) : [
        {
          id: 'app-ev-1',
          applicationId: SEED_APPLICATION.id,
          assessmentId: SEED_ASSESSMENT.id,
          skillName: 'Strategic Thinking',
          evidenceType: 'CASE_SOLUTION',
          title: 'Southeast Asia Market Entry Beachhead Analysis',
          description: 'Drafted complete unit economics and distribution model for Company X Vietnam expansion with 3.12x LTV/CAC.',
          score: 92,
          feedback: 'Strong alignment with regional economic realities and distributor partnership mechanics.',
          confidence: 'High',
          createdAt: '2026-09-02T16:00:00.000Z'
        }
      ];

      // Ensure seed application is always present if array is empty
      if (this.applications.length === 0) {
        this.applications = defaultApps;
        this.assessments = [SEED_ASSESSMENT];
        this.cases = [SEED_CASE];
        this.tasks = ContextualIntelligenceEngine.generatePreparationPlan(SEED_APPLICATION, SEED_CASE);
        this.saveToStorage();
      }
    } catch (e) {
      console.error('Failed to load applications from localStorage:', e);
      this.applications = [SEED_APPLICATION, SEED_APPLICATION_2, SEED_APPLICATION_3, SEED_APPLICATION_4, SEED_APPLICATION_5];
      this.assessments = [SEED_ASSESSMENT];
      this.cases = [SEED_CASE];
      this.tasks = ContextualIntelligenceEngine.generatePreparationPlan(SEED_APPLICATION, SEED_CASE);
      this.evidence = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(this.applications));
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(this.assessments));
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(this.cases));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(this.tasks));
      localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(this.evidence));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('career_applications_updated'));
      }
    } catch (e) {
      console.error('Failed to save applications to localStorage:', e);
    }
  }

  // --- Applications API ---
  getApplications(): JobApplication[] {
    return [...this.applications];
  }

  getApplicationById(id: string): JobApplication | undefined {
    return this.applications.find(a => a.id === id);
  }

  getApplicationByJobOpportunityId(jobOpportunityId: string): JobApplication | undefined {
    return this.applications.find(a => a.jobOpportunityId === jobOpportunityId);
  }

  isJobTracked(jobOpportunityId: string): boolean {
    return this.applications.some(a => a.jobOpportunityId === jobOpportunityId);
  }

  createApplicationFromJob(job: JobListing, initialStatus: JobApplicationStatus = 'APPLIED'): JobApplication {
    const existing = this.getApplicationByJobOpportunityId(job.id);
    if (existing) {
      return existing;
    }

    const { primary, sub } = mapLegacyStatusToPipelineState(initialStatus);
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobOpportunityId: job.id,
      companyName: job.company,
      roleTitle: job.title,
      jobUrl: job.externalUrl,
      location: `${job.location} (${job.workMode})`,
      employmentType: 'Full-time',
      pipelineState: primary,
      pipelineSubState: sub,
      status: initialStatus,
      appliedAt: new Date().toISOString(),
      deadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString() : new Date(Date.now() + 14 * 86400000).toISOString(),
      requirementIds: (job.requiredSkills || []).map((_, i) => `req-${job.id}-${i}`),
      requirements: (job.requiredSkills || []).map((sk, i) => ({
        id: `req-${job.id}-${i}`,
        category: 'Required Skills',
        text: `Proficiency with ${sk} and production systems`,
        mappedSkillName: sk,
        confidence: 'High'
      })),
      skillIds: job.requiredSkills || [],
      knowledgeIds: [],
      assessmentIds: [],
      documents: [],
      jobSnapshot: {
        title: job.title,
        company: job.company,
        description: job.description,
        responsibilities: job.keyResponsibilities || [],
        requirements: job.requiredSkills || [],
        preferredQualifications: job.niceToHaveSkills || [],
        skills: job.requiredSkills || [],
        location: job.location,
        salary: job.salaryRange,
        sourceUrl: job.externalUrl,
        capturedAt: new Date().toISOString(),
        originalSourceText: job.description
      },
      companyIntelligence: {
        companyName: job.company,
        businessModel: 'Enterprise technology services & cloud platforms',
        products: ['Core Platform', 'Developer APIs'],
        market: job.domain,
        competitors: ['Industry Peers'],
        strategicPriorities: ['Hiring senior engineering and product talent'],
        recentDevelopments: ['Actively expanding regional team'],
        industryPosition: 'Market leader in sector',
        verifiedSource: true,
        capturedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveApplication(newApp);
    return newApp;
  }

  saveApplication(app: JobApplication): JobApplication {
    const idx = this.applications.findIndex(a => a.id === app.id);
    if (idx >= 0) {
      this.applications[idx] = { ...app, updatedAt: new Date().toISOString() };
    } else {
      this.applications.unshift({
        ...app,
        createdAt: app.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    this.saveToStorage();
    return app;
  }

  deleteApplication(id: string): boolean {
    const initialLen = this.applications.length;
    this.applications = this.applications.filter(a => a.id !== id);
    this.assessments = this.assessments.filter(ass => ass.applicationId !== id);
    this.cases = this.cases.filter(c => c.applicationId !== id);
    this.tasks = this.tasks.filter(t => t.applicationId !== id);
    this.evidence = this.evidence.filter(e => e.applicationId !== id);
    this.saveToStorage();
    return this.applications.length < initialLen;
  }

  // --- Pipeline State Transition & Mutation API ---
  moveApplicationToState(
    applicationId: string,
    newState: ApplicationPrimaryState,
    newSubState?: ApplicationSubState,
    reason?: string
  ): { updatedApp: JobApplication; previousState: ApplicationPrimaryState; previousSubState?: ApplicationSubState } | undefined {
    const app = this.getApplicationById(applicationId);
    if (!app) return undefined;

    const previousState = app.pipelineState || mapLegacyStatusToPipelineState(app.status).primary;
    const previousSubState = app.pipelineSubState || mapLegacyStatusToPipelineState(app.status).sub;

    const historyEntry: ApplicationStateHistory = {
      fromState: previousState,
      toState: newState,
      fromSubState: previousSubState,
      toSubState: newSubState,
      changedAt: new Date().toISOString(),
      reason
    };

    app.pipelineState = newState;
    app.pipelineSubState = newSubState;
    app.status = mapPipelineStateToLegacyStatus(newState, newSubState);
    app.stateHistory = [...(app.stateHistory || []), historyEntry];
    app.updatedAt = new Date().toISOString();

    this.saveApplication(app);
    return { updatedApp: app, previousState, previousSubState };
  }

  duplicateApplication(applicationId: string): JobApplication | undefined {
    const existing = this.getApplicationById(applicationId);
    if (!existing) return undefined;

    const newApp: JobApplication = {
      ...existing,
      id: `app-${Date.now()}`,
      roleTitle: `${existing.roleTitle} (Copy)`,
      pipelineState: 'applied_screening',
      pipelineSubState: 'applied',
      status: 'APPLIED',
      appliedAt: new Date().toISOString(),
      stateHistory: [
        {
          toState: 'applied_screening',
          toSubState: 'applied',
          changedAt: new Date().toISOString(),
          reason: `Duplicated from ${existing.roleTitle}`
        }
      ],
      assessmentIds: [],
      interviews: [],
      offer: undefined,
      outcome: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveApplication(newApp);
    return newApp;
  }

  archiveApplication(applicationId: string, reason?: string, subState: 'accepted' | 'rejected' | 'withdrawn' = 'withdrawn'): JobApplication | undefined {
    const res = this.moveApplicationToState(applicationId, 'archived_closed', subState, reason);
    return res?.updatedApp;
  }

  // --- Assessments & Test Assignments API ---
  getAllAssessments(): ApplicationAssessment[] {
    return [...this.assessments];
  }

  createTestAssignment(data: {
    applicationId: string;
    title: string;
    type: AssessmentType;
    description?: string;
    deadline?: string;
    estimatedEffort?: string;
    submissionUrl?: string;
    submissionMethod?: string;
    status?: AssessmentStatus;
  }): ApplicationAssessment {
    const newAssessment: ApplicationAssessment = {
      id: `assess-${Date.now()}`,
      applicationId: data.applicationId,
      type: data.type,
      title: data.title,
      description: data.description || '',
      deadline: data.deadline,
      status: data.status || 'PREPARING',
      estimatedEffort: data.estimatedEffort,
      submissionUrl: data.submissionUrl,
      submissionMethod: data.submissionMethod,
      taskIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveAssessment(newAssessment);

    // If application is in applied_screening, advance it to assessment_case
    const app = this.getApplicationById(data.applicationId);
    if (app && app.pipelineState === 'applied_screening') {
      this.moveApplicationToState(
        app.id,
        'assessment_case',
        'take_home',
        `Assigned test challenge: ${data.title}`
      );
    }

    return newAssessment;
  }

  // --- Interviews API ---
  addInterview(applicationId: string, interviewData: Omit<ApplicationInterview, 'id' | 'applicationId'>): ApplicationInterview | undefined {
    const app = this.getApplicationById(applicationId);
    if (!app) return undefined;

    const interview: ApplicationInterview = {
      ...interviewData,
      id: `iv-${Date.now()}`,
      applicationId
    };

    app.interviews = [...(app.interviews || []), interview];
    // If application is in applied or assessment, advance to interviews stage
    if (app.pipelineState === 'applied_screening' || app.pipelineState === 'assessment_case') {
      this.moveApplicationToState(app.id, 'interviews', 'technical', `Scheduled interview: ${interview.title}`);
    } else {
      this.saveApplication(app);
    }

    return interview;
  }

  getInterviews(applicationId: string): ApplicationInterview[] {
    const app = this.getApplicationById(applicationId);
    return app?.interviews || [];
  }

  getAllInterviews(): ApplicationInterview[] {
    const list: ApplicationInterview[] = [];
    this.applications.forEach(app => {
      if (app.interviews) {
        list.push(...app.interviews);
      }
    });
    return list;
  }

  // --- Upcoming Deadlines Aggregation API ---
  getAllUpcomingDeadlines(): UpcomingDeadlineItem[] {
    const items: UpcomingDeadlineItem[] = [];

    // Priority 1: Test Assignment Deadlines
    this.assessments.forEach(ass => {
      if (ass.deadline && ass.status !== 'COMPLETED' && ass.status !== 'SUBMITTED') {
        const app = this.getApplicationById(ass.applicationId);
        if (app && app.pipelineState !== 'archived_closed') {
          const urgencyCalc = calculateUrgency(ass.deadline);
          items.push({
            id: `deadline-assess-${ass.id}`,
            sourceType: 'TEST_ASSIGNMENT',
            applicationId: app.id,
            applicationTitle: app.roleTitle,
            companyName: app.companyName,
            companyLogo: app.companyLogo,
            itemTitle: ass.title,
            categoryOrSubtype: ass.type.replace(/_/g, ' '),
            dueAt: ass.deadline,
            urgency: urgencyCalc.urgency,
            daysRemaining: urgencyCalc.daysRemaining,
            hoursRemaining: urgencyCalc.hoursRemaining,
            status: ass.status
          });
        }
      }
    });

    // Priority 2: Scheduled Interviews
    this.applications.forEach(app => {
      if (app.pipelineState !== 'archived_closed' && app.interviews) {
        app.interviews.forEach(iv => {
          if (iv.status === 'SCHEDULED' && iv.scheduledAt) {
            const urgencyCalc = calculateUrgency(iv.scheduledAt);
            items.push({
              id: `deadline-iv-${iv.id}`,
              sourceType: 'INTERVIEW',
              applicationId: app.id,
              applicationTitle: app.roleTitle,
              companyName: app.companyName,
              companyLogo: app.companyLogo,
              itemTitle: iv.title || `${iv.type.replace(/_/g, ' ')} Interview`,
              categoryOrSubtype: iv.type.replace(/_/g, ' '),
              dueAt: iv.scheduledAt,
              urgency: urgencyCalc.urgency,
              daysRemaining: urgencyCalc.daysRemaining,
              hoursRemaining: urgencyCalc.hoursRemaining,
              status: iv.status
            });
          }
        });
      }
    });

    // Priority 3: Pending Preparation Tasks
    this.tasks.forEach(task => {
      if (task.status === 'TODO') {
        const app = this.getApplicationById(task.applicationId);
        if (app && app.pipelineState !== 'archived_closed') {
          const dueAt = app.deadline || new Date(Date.now() + 5 * 86400000).toISOString();
          const urgencyCalc = calculateUrgency(dueAt);
          items.push({
            id: `deadline-task-${task.id}`,
            sourceType: 'PREPARATION_TASK',
            applicationId: app.id,
            applicationTitle: app.roleTitle,
            companyName: app.companyName,
            companyLogo: app.companyLogo,
            itemTitle: task.title,
            categoryOrSubtype: task.type.replace(/_/g, ' '),
            dueAt,
            urgency: urgencyCalc.urgency,
            daysRemaining: urgencyCalc.daysRemaining,
            hoursRemaining: urgencyCalc.hoursRemaining,
            status: task.status
          });
        }
      }
    });

    // Sort: nearest due date/time first
    return items.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  }

  // --- Assessments API ---
  getAssessments(applicationId: string): ApplicationAssessment[] {
    return this.assessments.filter(a => a.applicationId === applicationId);
  }

  getAssessmentById(id: string): ApplicationAssessment | undefined {
    return this.assessments.find(a => a.id === id);
  }

  saveAssessment(assessment: ApplicationAssessment): ApplicationAssessment {
    const idx = this.assessments.findIndex(a => a.id === assessment.id);
    if (idx >= 0) {
      this.assessments[idx] = { ...assessment, updatedAt: new Date().toISOString() };
    } else {
      this.assessments.push({
        ...assessment,
        createdAt: assessment.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Link into parent application
    const app = this.getApplicationById(assessment.applicationId);
    if (app && !app.assessmentIds.includes(assessment.id)) {
      app.assessmentIds.push(assessment.id);
      this.saveApplication(app);
    }

    this.saveToStorage();
    return assessment;
  }

  // --- Application Cases API ---
  getApplicationCase(caseOrAssessmentId: string): ApplicationCase | undefined {
    return this.cases.find(c => c.id === caseOrAssessmentId || c.assessmentId === caseOrAssessmentId);
  }

  saveApplicationCase(appCase: ApplicationCase): ApplicationCase {
    const idx = this.cases.findIndex(c => c.id === appCase.id);
    if (idx >= 0) {
      this.cases[idx] = { ...appCase, updatedAt: new Date().toISOString() };
    } else {
      this.cases.push({
        ...appCase,
        createdAt: appCase.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Link into parent assessment
    const assess = this.getAssessmentById(appCase.assessmentId);
    if (assess && assess.caseId !== appCase.id) {
      assess.caseId = appCase.id;
      this.saveAssessment(assess);
    }

    this.saveToStorage();
    return appCase;
  }

  // --- Preparation Tasks API ---
  getPreparationTasks(applicationId: string): PreparationTask[] {
    return this.tasks.filter(t => t.applicationId === applicationId);
  }

  savePreparationTask(task: PreparationTask): PreparationTask {
    const idx = this.tasks.findIndex(t => t.id === task.id);
    if (idx >= 0) {
      this.tasks[idx] = task;
    } else {
      this.tasks.push(task);
    }
    this.saveToStorage();
    return task;
  }

  toggleTaskStatus(taskId: string): PreparationTask | undefined {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = task.status === 'DONE' ? 'TODO' : 'DONE';
      task.completedAt = task.status === 'DONE' ? new Date().toISOString() : undefined;
      this.saveToStorage();
    }
    return task;
  }

  // --- Application Evidence API ---
  getEvidence(applicationId: string): ApplicationEvidence[] {
    return this.evidence.filter(e => e.applicationId === applicationId);
  }

  addEvidence(ev: ApplicationEvidence): ApplicationEvidence {
    this.evidence.unshift({
      ...ev,
      createdAt: ev.createdAt || new Date().toISOString()
    });
    this.saveToStorage();
    return ev;
  }

  // --- Outcome & Learning Loop API ---
  recordOutcome(applicationId: string, outcome: ApplicationOutcome): JobApplication | undefined {
    const app = this.getApplicationById(applicationId);
    if (!app) return undefined;

    app.outcome = outcome;
    if (outcome.status === 'OFFER') app.status = 'OFFER';
    else if (outcome.status === 'REJECTED') app.status = 'REJECTED';
    else if (outcome.status === 'WITHDRAWN') app.status = 'WITHDRAWN';
    else if (outcome.status === 'ADVANCED') app.status = 'FINAL_INTERVIEW';

    // Add learning loop evidence if feedback is provided
    if (outcome.companyFeedback || outcome.selfReview) {
      this.addEvidence({
        id: `ev-outcome-${Date.now()}`,
        applicationId,
        skillName: 'Case Performance & Interview Feedback',
        evidenceType: 'FEEDBACK',
        title: `Outcome: ${outcome.status} at ${app.companyName}`,
        description: outcome.companyFeedback || outcome.selfReview || 'Completed assessment cycle.',
        feedback: outcome.companyFeedback,
        confidence: 'High',
        createdAt: new Date().toISOString()
      });
    }

    this.saveApplication(app);
    return app;
  }

  // --- Helper: Parse & Ingest Case from raw text ---
  parseAndIngestCase(
    applicationId: string,
    assessmentId: string,
    rawText: string,
    title: string
  ): ApplicationCase {
    // Intelligent multilingual semantic parsing for context, constraints, and questions
    const parsedSemantic = CareerSemanticParser.parse(rawText);
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const questions: string[] = [];
    const constraints: string[] = [];

    lines.forEach(line => {
      const lineLower = line.toLowerCase();
      if (
        line.endsWith('?') || 
        lineLower.startsWith('question') || 
        lineLower.startsWith('prompt') ||
        lineLower.startsWith('câu hỏi') ||
        lineLower.startsWith('yêu cầu')
      ) {
        questions.push(line.replace(/^(question\s*\d*[:.-]?|prompt[:.-]?|câu hỏi\s*\d*[:.-]?|yêu cầu[:.-]?)/i, '').trim());
      } else if (
        lineLower.includes('constraint') || 
        lineLower.includes('budget') || 
        lineLower.includes('limit') ||
        lineLower.includes('giới hạn') ||
        lineLower.includes('ngân sách') ||
        lineLower.includes('ràng buộc')
      ) {
        constraints.push(line);
      }
    });

    if (questions.length === 0) {
      if (parsedSemantic.dominantLanguage === 'vi') {
        questions.push('Đề xuất chiến lược hành động của bạn cho bài toán kinh doanh này là gì?');
        questions.push('Những chỉ số kinh tế đơn vị (unit economics) và giả định định lượng nào củng cố cho đề xuất?');
      } else {
        questions.push('What is your strategic recommendation for this business problem?');
        questions.push('What unit economics and quantitative assumptions support your decision?');
      }
    }

    // Determine detected case types
    const detectedCaseTypesList: { type: string; confidence: 'High' | 'Medium' | 'Low' }[] = [];
    if (parsedSemantic.caseType) {
      detectedCaseTypesList.push({ type: parsedSemantic.caseType.canonicalName, confidence: 'High' });
    } else {
      detectedCaseTypesList.push({ type: 'Market Entry', confidence: 'High' }, { type: 'Strategy', confidence: 'Medium' });
    }

    // Determine detected skills
    const detectedSkillsList = parsedSemantic.skills.length > 0
      ? parsedSemantic.skills.map(s => s.canonicalName)
      : ['Market Sizing', 'Strategic Thinking', 'Quantitative Reasoning', 'Unit Economics', 'Executive Synthesis'];

    const geography = parsedSemantic.geographies.length > 0 ? parsedSemantic.geographies[0] : 'Southeast Asia';
    const industry = parsedSemantic.industries.length > 0 ? parsedSemantic.industries[0].canonicalName : 'Technology / Software';

    const appCase: ApplicationCase = {
      id: `case-${Date.now()}`,
      assessmentId,
      applicationId,
      title: title || (parsedSemantic.caseType ? `${parsedSemantic.caseType.canonicalName} Evaluation` : 'Strategic Case Evaluation'),
      prompt: rawText,
      context: rawText.slice(0, 500) + '...',
      industryId: industry,
      geography,
      caseTypeIds: detectedCaseTypesList.map(t => t.type),
      skillIds: detectedSkillsList,
      relatedKnowledgeIds: ['ku-market-entry', 'ku-unit-economics'],
      relatedFrameworkIds: ["Porter's Five Forces", 'TAM/SAM/SOM Framework'],
      relatedDataPointIds: [],
      relatedIntelligenceIds: [],
      relatedResourceIds: [],
      relatedCaseStudyIds: [],
      questions,
      exhibits: [],
      assumptions: [
        '[ASSUMPTION] Standard regional gross margins and customer adoption trajectories apply.'
      ],
      myNotes: '',
      myHypotheses: parsedSemantic.userHypotheses.length > 0 ? parsedSemantic.userHypotheses.join('\n') : '',
      myAnalysis: '',
      myRecommendation: '',
      status: 'PREPARING',
      isPrivate: true,
      visibility: 'PRIVATE',
      analysisReport: {
        overview: `Auto-analyzed ${parsedSemantic.dominantLanguage.toUpperCase()} prompt by Career OS Multilingual Intelligence Engine.`,
        decisionToMake: 'Determine feasibility and deliver an actionable execution plan.',
        constraints: constraints.length > 0 ? constraints : ['Standard commercial and capital constraints'],
        providedInfo: ['Problem description', 'Contextual prompt', ...parsedSemantic.userFacts],
        missingInfo: ['Historical company baseline metrics', 'Granular churn and acquisition benchmarks'],
        suggestedSkills: detectedSkillsList.slice(0, 3).map((name, i) => ({
          name,
          relevance: 92 - i * 4,
          reason: 'Extracted from canonical multilingual skill ontology.'
        })),
        detectedIndustry: industry,
        detectedGeography: geography,
        detectedCaseTypes: detectedCaseTypesList,
        deliverablesExpected: [
          'Written executive summary',
          'Structured analysis with supporting evidence'
        ]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveApplicationCase(appCase);
    return appCase;
  }

  // --- Helper: Anonymize Case for public or personal sharing ---
  anonymizeCase(caseId: string, newTitle: string): ApplicationCase | undefined {
    const existing = this.cases.find(c => c.id === caseId);
    if (!existing) return undefined;

    const anonymized: ApplicationCase = {
      ...existing,
      id: `case-anon-${Date.now()}`,
      title: newTitle || `Anonymized: ${existing.title.replace(/Company [A-Z]/g, 'Enterprise Corp')}`,
      prompt: existing.prompt.replace(/Company [A-Z]/g, 'Enterprise Corp').replace(/Product [A-Z]/g, 'Platform Core'),
      context: existing.context.replace(/Company [A-Z]/g, 'Enterprise Corp').replace(/Product [A-Z]/g, 'Platform Core'),
      companyContext: 'Global enterprise software provider with $40M+ ARR operating multi-region.',
      visibility: 'ANONYMIZED',
      isPrivate: false,
      myNotes: undefined, // Strip private user notes
      myHypotheses: undefined,
      submissionDocument: undefined,
      submissionUrl: undefined,
      updatedAt: new Date().toISOString()
    };

    return anonymized;
  }
}

export const applicationStore = new ApplicationStore();
