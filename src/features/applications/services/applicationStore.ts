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
  JobApplicationStatus,
  ParticipationType,
  ParticipationStatus,
  TrackerActivity,
  PARTICIPATION_LIFECYCLES
} from '../types';
import { JobListing } from '../../../types';
import { ContextualIntelligenceEngine } from './contextualIntelligenceEngine';
import { CareerSemanticParser } from '../../intelligence/services/careerSemanticParser';
import { curatedBetaData } from '../../../services/curatedBetaData';
import { AccessControlService } from '../../../services/accessControlService';
import { demoWorkspaceService } from '../../../services/demoWorkspaceService';

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

// Example 6: Challenge / Hackathon - Shopee Hackathon 2026
const SEED_HACKATHON_1: JobApplication = {
  id: 'hack-shopee-ai-2026',
  participationType: 'challenge_hackathon',
  participationStatus: 'ACTIVE',
  companyName: 'Shopee Sea Group',
  organization: 'Shopee Engineering & Sea Labs',
  roleTitle: 'Shopee Hackathon 2026: AI Merchant Assistant',
  domain: 'AI & E-Commerce',
  location: 'Singapore & Regional (Hybrid)',
  currentStageId: 'submission',
  currentStageName: 'Submission',
  priority: 'HIGH',
  deadline: '2026-11-15T23:59:59.000Z',
  startDate: '2026-10-01T09:00:00.000Z',
  expectedOutcome: 'Finalist demo presentation & $20,000 top prototype prize',
  appliedAt: '2026-10-02T10:00:00.000Z',
  pipelineState: 'assessment_case',
  pipelineSubState: 'take_home',
  status: 'CASE',
  requirementIds: [],
  requirements: [],
  skillIds: ['Generative AI', 'Product Discovery', 'FastAPI', 'Vector Search'],
  knowledgeIds: [],
  assessmentIds: [],
  notes: 'Registered as squad lead with 3 engineers. Completed data flow RFC; currently finalizing live multimodal catalog demo.',
  hackathonData: {
    teamName: 'VectorVanguard',
    teamMembers: ['Alex (Product Lead)', 'Minh (AI Architect)', 'Sarah (Frontend)', 'Hao (Infra)'],
    projectName: 'CatalogVision: Multimodal Merchant Catalog Agent',
    projectDescription: 'Automated catalog ingestion, image enhancement, and automated localized Vietnamese/Indonesian product copy generation.',
    repositoryUrl: 'https://github.com/careeros/catalogvision-agent',
    pitchDeckUrl: 'https://pitch.careeros.app/shopee-hackathon-deck.pdf',
    submissionUrl: 'https://hackathon.shopee.com/submissions/vectorvanguard',
    deliverables: [
      { id: 'del-1', title: 'Architecture RFC & Data Flow Diagram', completed: true },
      { id: 'del-2', title: 'Core Agent Prototype & API Benchmarks', completed: true },
      { id: 'del-3', title: '3-Minute Demo Video & Final Pitch Deck', completed: false, dueDate: '2026-11-10' }
    ]
  },
  documents: [
    { id: 'doc-hack-1', name: 'CatalogVision_Architecture_RFC.pdf', type: 'PDF', uploadedAt: '2026-10-08T10:00:00.000Z', fileSize: '2.1 MB' }
  ],
  activities: [
    { id: 'act-h1', itemId: 'hack-shopee-ai-2026', type: 'STAGE_CHANGE', title: 'Registration confirmed & squad accepted', timestamp: '2026-10-02T10:00:00.000Z' },
    { id: 'act-h2', itemId: 'hack-shopee-ai-2026', type: 'UPDATE', title: 'Formed team VectorVanguard with 4 cross-functional builders', timestamp: '2026-10-05T14:30:00.000Z' },
    { id: 'act-h3', itemId: 'hack-shopee-ai-2026', type: 'STAGE_CHANGE', title: 'Advanced to Submission stage', timestamp: '2026-10-12T16:00:00.000Z' }
  ],
  createdAt: '2026-10-02T10:00:00.000Z',
  updatedAt: '2026-10-14T11:00:00.000Z'
};

// Example 7: Builder Match - AI Product Builder
const SEED_BUILDER_MATCH_1: JobApplication = {
  id: 'match-builder-ai-pm',
  participationType: 'builder_match',
  participationStatus: 'ACTIVE',
  companyName: 'ProMultiplier Builder Network',
  organization: 'Builder Match Network',
  roleTitle: 'Builder Match — AI Product Builder',
  domain: 'Developer Tools & AI Agents',
  location: 'Remote · Global',
  currentStageId: 'collaboration',
  currentStageName: 'Collaboration',
  priority: 'HIGH',
  deadline: '2026-11-30T18:00:00.000Z',
  startDate: '2026-09-18T10:00:00.000Z',
  expectedOutcome: 'Ship production-ready multi-tenant AI workflow MVP to 20 alpha testers',
  appliedAt: '2026-09-18T10:00:00.000Z',
  pipelineState: 'interviews',
  pipelineSubState: 'technical',
  status: 'INTERVIEW',
  requirementIds: [],
  requirements: [],
  skillIds: ['Agent Orchestration', 'PyTorch', 'Product Strategy', 'System Architecture'],
  knowledgeIds: [],
  assessmentIds: [],
  notes: 'Matched with Minh Tran. Complementary synergy: Minh handles backend vector infra and model fine-tuning; I lead product discovery, PRD, and user testing.',
  builderMatchData: {
    matchedBuilderId: 'builder-minh-tran',
    matchedBuilderName: 'Minh Tran',
    matchedBuilderRole: 'Lead AI Architect & Systems Engineer',
    matchedBuilderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    matchedBuilderSkills: ['PyTorch', 'FastAPI', 'Vector Search', 'Distributed Systems'],
    teamName: 'AgentFlow Core Squad',
    projectTitle: 'Self-Optimizing Knowledge Extraction Agent',
    availability: '15 hrs/week (Evenings & Weekends)',
    collaborationStatus: 'active_sprint',
    nextAction: 'Synchronize on vector indexing pipeline schema for MVP test run.'
  },
  documents: [],
  activities: [
    { id: 'act-bm1', itemId: 'match-builder-ai-pm', type: 'STAGE_CHANGE', title: 'Profile approved in Builder Match network', timestamp: '2026-09-18T10:00:00.000Z' },
    { id: 'act-bm2', itemId: 'match-builder-ai-pm', type: 'UPDATE', title: 'Matched with Minh Tran (96% compatibility score)', timestamp: '2026-09-22T11:00:00.000Z' },
    { id: 'act-bm3', itemId: 'match-builder-ai-pm', type: 'STAGE_CHANGE', title: 'Completed intro call & kicked off active sprint collaboration', timestamp: '2026-09-26T15:00:00.000Z' }
  ],
  createdAt: '2026-09-18T10:00:00.000Z',
  updatedAt: '2026-10-15T09:00:00.000Z'
};

// Example 8: Mentor & Mentee - Product Leadership Mentorship
const SEED_MENTORSHIP_1: JobApplication = {
  id: 'mentor-prod-leadership',
  participationType: 'mentor_mentee',
  participationStatus: 'ACTIVE',
  companyName: 'Executive Leadership Fellowship',
  organization: 'Product Mentorship Guild',
  roleTitle: 'Product Leadership Mentorship',
  domain: 'Enterprise SaaS & Executive Product',
  location: 'Remote 1-on-1',
  currentStageId: 'active',
  currentStageName: 'Active Cadence',
  priority: 'CRITICAL',
  deadline: '2026-12-15T18:00:00.000Z',
  startDate: '2026-08-15T10:00:00.000Z',
  expectedOutcome: 'Executive promotion readiness & board presentation mastery',
  appliedAt: '2026-08-15T10:00:00.000Z',
  pipelineState: 'interviews',
  pipelineSubState: 'hiring_manager',
  status: 'INTERVIEW',
  requirementIds: [],
  requirements: [],
  skillIds: ['Executive Synthesis', 'Product Strategy', 'Managing Up', 'Cross-Functional Leadership'],
  knowledgeIds: [],
  assessmentIds: [],
  notes: 'Bi-weekly 60m session cadence. Focus on structuring enterprise expansion trade-offs and communicating with C-suite stakeholders.',
  mentorshipData: {
    mentorOrMenteeName: 'Elena Vance (VP of Product @ FinTech Global)',
    mentorshipRole: 'mentee',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60',
    mentorTitle: 'VP of Product, ex-Stripe Product Director',
    programName: 'Executive Product Leadership Fellows 2026',
    completedSessions: 4,
    totalSessions: 8,
    nextSessionDate: '2026-10-24T14:00:00.000Z',
    nextSessionAgenda: 'Reviewing organizational growth loops and cross-functional C-suite alignment.',
    goals: [
      'Product Strategy: Scaling B2B enterprise SaaS multi-region expansion',
      'Leadership: Managing high-performing senior PMs and managing up',
      'Executive Communication: Minto Pyramid synthesis for board presentations'
    ],
    nextAction: 'Prepare 1-page memo on SEA GTM trade-offs before Oct 24 session.'
  },
  documents: [],
  activities: [
    { id: 'act-m1', itemId: 'mentor-prod-leadership', type: 'STAGE_CHANGE', title: 'Admitted into Executive Fellowship', timestamp: '2026-08-15T10:00:00.000Z' },
    { id: 'act-m2', itemId: 'mentor-prod-leadership', type: 'UPDATE', title: 'Completed Session 1: Core strengths diagnostic & growth roadmap', timestamp: '2026-08-25T14:00:00.000Z' },
    { id: 'act-m3', itemId: 'mentor-prod-leadership', type: 'UPDATE', title: 'Completed Session 4: Strategic prioritization framework review', timestamp: '2026-10-10T14:00:00.000Z' }
  ],
  createdAt: '2026-08-15T10:00:00.000Z',
  updatedAt: '2026-10-12T16:00:00.000Z'
};

// Example 9: Credential - Google UX Certificate
const SEED_CREDENTIAL_1: JobApplication = {
  id: 'cred-google-ux-cert',
  participationType: 'credential',
  participationStatus: 'ACTIVE',
  companyName: 'Google Career Certificates',
  organization: 'Google & Coursera',
  roleTitle: 'Google UX Certificate',
  domain: 'Product Design & UX Research',
  location: 'Online / Self-Paced Cohort',
  currentStageId: 'coursework',
  currentStageName: 'Coursework',
  priority: 'MEDIUM',
  deadline: '2026-12-01T23:59:59.000Z',
  startDate: '2026-09-01T10:00:00.000Z',
  expectedOutcome: 'Google Certified UX Practitioner Credential & 3 Shipped Case Studies',
  appliedAt: '2026-09-01T10:00:00.000Z',
  pipelineState: 'applied_screening',
  pipelineSubState: 'applied',
  status: 'APPLIED',
  requirementIds: [],
  requirements: [],
  skillIds: ['User Research', 'Figma', 'Wireframing', 'Usability Testing'],
  knowledgeIds: [],
  assessmentIds: [],
  notes: 'Enrolled under company continuing education stipend. Completing Course 3 prototype exercises.',
  credentialProgramData: {
    providerName: 'Google & Coursera',
    credentialType: 'certificate',
    credentialId: 'GOOG-UX-99214',
    credentialUrl: 'https://www.coursera.org/professional-certificates/google-ux-design',
    milestones: [
      { title: 'Course 1: Foundations of UX Design', completed: true, date: '2026-09-15' },
      { title: 'Course 2: Start the UX Design Process: Empathize, Define, Ideate', completed: true, date: '2026-09-30' },
      { title: 'Course 3: Build Wireframes and Low-Fidelity Prototypes', completed: true, date: '2026-10-10' },
      { title: 'Course 4: Conduct UX Research and Test Early Concepts', completed: false }
    ]
  },
  documents: [],
  activities: [
    { id: 'act-c1', itemId: 'cred-google-ux-cert', type: 'STAGE_CHANGE', title: 'Enrolled in 7-course Professional Certificate', timestamp: '2026-09-01T10:00:00.000Z' },
    { id: 'act-c2', itemId: 'cred-google-ux-cert', type: 'UPDATE', title: 'Completed Course 3 wireframing deliverables', timestamp: '2026-10-10T11:00:00.000Z' }
  ],
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-10-11T12:00:00.000Z'
};

// Example 10: Learning Program - Product Management Bootcamp
const SEED_LEARNING_PROG_1: JobApplication = {
  id: 'prog-pm-bootcamp-2026',
  participationType: 'learning_program',
  participationStatus: 'ACTIVE',
  companyName: 'Reforge Executive Academy',
  organization: 'Reforge',
  roleTitle: 'Product Management Bootcamp',
  domain: 'Product Strategy & Growth Loops',
  location: 'Cohort-Based Live Sessions',
  currentStageId: 'in_progress',
  currentStageName: 'In Progress',
  priority: 'HIGH',
  deadline: '2026-11-20T18:00:00.000Z',
  startDate: '2026-09-15T18:00:00.000Z',
  expectedOutcome: 'Executive Product Leadership Graduation & Cohort Capstone Defense',
  appliedAt: '2026-09-05T10:00:00.000Z',
  pipelineState: 'assessment_case',
  pipelineSubState: 'assessment',
  status: 'ASSESSMENT',
  requirementIds: [],
  requirements: [],
  skillIds: ['Growth Loops', 'Retention Cohorts', 'Monetization Strategy'],
  knowledgeIds: [],
  assessmentIds: [],
  notes: 'Intensive 8-week executive cohort. Module 3 case study due next Friday.',
  credentialProgramData: {
    providerName: 'Reforge',
    credentialType: 'bootcamp',
    credentialId: 'REFORGE-PM-2026-88',
    credentialUrl: 'https://www.reforge.com/programs/product-strategy',
    milestones: [
      { title: 'Sprint 1: Retention Cohort Analysis & Qualitative Moats', completed: true, date: '2026-09-25' },
      { title: 'Sprint 2: Compounding Growth Loops vs Linear Funnels', completed: true, date: '2026-10-08' },
      { title: 'Sprint 3: Enterprise Monetization & Pricing Tiering', completed: false }
    ]
  },
  documents: [],
  activities: [
    { id: 'act-lp1', itemId: 'prog-pm-bootcamp-2026', type: 'STAGE_CHANGE', title: 'Admitted to Fall 2026 cohort', timestamp: '2026-09-05T10:00:00.000Z' },
    { id: 'act-lp2', itemId: 'prog-pm-bootcamp-2026', type: 'UPDATE', title: 'Submitted Sprint 2 Growth Loops teardown', timestamp: '2026-10-08T18:00:00.000Z' }
  ],
  createdAt: '2026-09-05T10:00:00.000Z',
  updatedAt: '2026-10-09T09:00:00.000Z'
};

// Example 11: Workshop - Agentic AI & LLM Systems Masterclass (Completed / Attended)
const SEED_WORKSHOP_1: JobApplication = {
  id: 'workshop-agentic-ai-2026',
  participationType: 'workshop',
  participationStatus: 'COMPLETED',
  unifiedStatus: 'completed',
  participationRole: 'Participant',
  companyName: 'Stanford AI Lab & DeepLearning.AI',
  organization: 'Stanford AI Lab & DeepLearning.AI',
  roleTitle: 'Agentic AI & LLM Systems Masterclass',
  domain: 'Artificial Intelligence & Systems Engineering',
  location: 'Palo Alto, CA / Hybrid Virtual',
  currentStageId: 'completed',
  currentStageName: 'Completed',
  priority: 'HIGH',
  isOnline: true,
  startDate: '2026-09-18T09:00:00.000Z',
  startTime: '09:00 AM',
  endTime: '04:30 PM',
  duration: '7.5 hours',
  description: 'Deep-dive intensive workshop on orchestrating autonomous agents with LangGraph, tool-calling verification, and RAG evaluation pipelines.',
  topics: ['LangGraph', 'Agentic Workflows', 'RAG Evaluation', 'Pydantic Guardrails', 'Self-Reflection Loops'],
  skillIds: ['Agent Orchestration', 'LLM Evaluation', 'Prompt Engineering', 'Python', 'Vector Search'],
  readinessSkills: ['Agent Orchestration', 'LLM Evaluation', 'Vector Search'],
  readinessContribution: 18,
  expectedOutcome: 'Shipped production-tested multi-agent customer onboarding pipeline with 94% task completion score',
  outcomes: 'Successfully benchmarked RAG hallucination guardrails and designed an autonomous verification loop with sub-second latency.',
  keyTakeaways: [
    'Evaluate RAG retrieval independently from generation using contextual precision and recall metrics.',
    'Constrain agent output to Pydantic schemas to prevent runtime deserialization bugs.',
    'Implement dual-loop reflection: separate the reasoning planner from the code execution executor.'
  ],
  notes: 'Outstanding workshop led by Andrew Ng and guest engineers from Anthropic. All lab exercises submitted with 100% test coverage.',
  workshopDetails: {
    instructor: 'Dr. Andrew Ng & Harrison Chase',
    workshopTopic: 'Building Production-Grade Agentic LLM Architectures',
    learningObjectives: [
      'Master stateful multi-agent communication topologies',
      'Implement deterministic tool routing with function calling',
      'Benchmark hallucination rates using Ragas & TruLens'
    ],
    materials: [
      { title: 'Workshop Slide Deck & Architecture RFC (PDF)', url: 'https://deeplearning.ai/materials/agentic-ai-2026.pdf' },
      { title: 'Interactive Colab Lab Repo', url: 'https://github.com/deeplearning-ai/agentic-workshop-labs' }
    ],
    keyTakeaways: [
      'Evaluate retrieval precision independent of generation',
      'Use state machines (LangGraph) rather than unstructured prompts for complex workflows'
    ],
    certificateEvidence: 'https://credentials.deeplearning.ai/verify/DL-AGENTIC-2026-X992'
  },
  requirementIds: [],
  requirements: [],
  knowledgeIds: ['ku-agent-architecture'],
  assessmentIds: [],
  documents: [],
  evidenceItems: [
    {
      id: 'ev-ws-cert',
      title: 'Stanford & DeepLearning.AI Certificate of Completion',
      type: 'certificate',
      url: 'https://credentials.deeplearning.ai/verify/DL-AGENTIC-2026-X992',
      fileSize: '1.4 MB',
      uploadedAt: '2026-09-18T17:00:00.000Z',
      description: 'Official verified certificate of completion with credential ID DL-AGENTIC-2026-X992.',
      verificationBadge: true
    },
    {
      id: 'ev-ws-notes',
      title: 'Executive Workshop Notes & Architectural Synthesis',
      type: 'notes',
      url: 'https://notion.so/agentic-ai-masterclass-notes',
      fileSize: '420 KB',
      uploadedAt: '2026-09-19T08:30:00.000Z',
      description: 'Handwritten diagram transcriptions, latency trade-offs, and evaluation matrix.'
    },
    {
      id: 'ev-ws-project',
      title: 'AgentFlow Onboarding Prototype (GitHub Repo)',
      type: 'project_output',
      url: 'https://github.com/promultiplier/agentflow-core',
      fileSize: 'Repo',
      uploadedAt: '2026-09-18T16:00:00.000Z',
      description: 'Working repository implementing multi-agent tool-calling and self-healing error recovery.'
    }
  ],
  followUpTasks: [
    { id: 'task-ws-1', title: 'Publish workshop takeaways to engineering knowledge base', completed: true, dueDate: '2026-09-22', priority: 'HIGH' },
    { id: 'task-ws-2', title: 'Integrate Pydantic guardrail pattern into current sprint project', completed: true, dueDate: '2026-09-28', priority: 'MEDIUM' }
  ],
  relatedOpportunityId: 'app-company-x-prod-strat',
  relatedOpportunityTitle: 'Product Strategy Manager (Company X)',
  relatedProjectId: 'proj-vector-search',
  relatedProjectTitle: 'Enterprise Vector Search Architecture',
  relatedBlueprintId: 'bp-ai-product-manager',
  relatedBlueprintTitle: 'AI Product Manager Role Blueprint',
  relatedKnowledgeId: 'ku-market-entry',
  relatedKnowledgeTitle: 'LLM Systems & Production Benchmarks',
  activities: [
    { id: 'act-ws-1', itemId: 'workshop-agentic-ai-2026', type: 'STAGE_CHANGE', title: 'Registered for Stanford Agentic AI Masterclass', timestamp: '2026-09-01T10:00:00.000Z' },
    { id: 'act-ws-2', itemId: 'workshop-agentic-ai-2026', type: 'STAGE_CHANGE', title: 'Attended live masterclass & completed all 4 coding labs', timestamp: '2026-09-18T16:30:00.000Z' },
    { id: 'act-ws-3', itemId: 'workshop-agentic-ai-2026', type: 'UPDATE', title: 'Verified and uploaded completion certificate to Career OS Evidence Hub', timestamp: '2026-09-18T17:15:00.000Z' }
  ],
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-19T08:30:00.000Z',
  pipelineState: 'archived_closed',
  status: 'ACCEPTED'
};

// Example 12: Conference - Global Tech Summit & ProductCon 2026 (Upcoming / Confirmed)
const SEED_CONFERENCE_1: JobApplication = {
  id: 'conf-global-productcon-2026',
  participationType: 'conference',
  participationStatus: 'ACTIVE',
  unifiedStatus: 'confirmed',
  participationRole: 'Attendee',
  companyName: 'Product School & Tech Council',
  organization: 'ProductCon Global',
  roleTitle: 'Global Tech Summit & ProductCon 2026',
  domain: 'Product Management & Strategic Growth',
  location: 'San Francisco, CA & Online Livestream',
  currentStageId: 'confirmed',
  currentStageName: 'Confirmed',
  priority: 'CRITICAL',
  isOnline: true,
  startDate: new Date(Date.now() + 10 * 86400000).toISOString(),
  startTime: '08:30 AM',
  endTime: '06:00 PM',
  duration: '2 Days',
  description: 'The world’s premier product leadership conference gathering 15,000+ product leaders, founders, and innovators to discuss AI monetization, product strategy, and market expansion.',
  topics: ['AI Monetization', 'Enterprise Product Strategy', 'Global Market Entry', 'Product-Led Growth'],
  skillIds: ['Product Strategy', 'Strategic Thinking', 'Monetization Strategy', 'Cross-Functional Leadership'],
  readinessSkills: ['Product Strategy', 'Strategic Thinking'],
  readinessContribution: 12,
  expectedOutcome: 'Network with 20+ enterprise VP/Founders, attend 6 strategic sessions, and scout partner opportunities for Southeast Asia expansion.',
  notes: 'VIP Pass secured via company sponsorship. Keynotes by Satya Nadella and Claire Vo scheduled on Day 1.',
  conferenceDetails: {
    conferenceName: 'ProductCon Global 2026',
    venue: 'Moscone West, San Francisco & Virtual Stream Hub',
    speakers: ['Satya Nadella (CEO, Microsoft)', 'Claire Vo (CPO, LaunchDarkly)', 'Aakash Gupta (Author, Product Growth)'],
    sessions: [
      { title: 'The Economics of Enterprise AI Infrastructure', speaker: 'Satya Nadella', time: '09:00 AM PST' },
      { title: 'Building defensible product moats in the era of foundational models', speaker: 'Claire Vo', time: '11:15 AM PST' },
      { title: 'Multi-Region SaaS GTM Playbook: From Beachhead to $50M ARR', speaker: 'Aakash Gupta', time: '02:00 PM PST' }
    ],
    tracks: ['Executive Leadership & Strategy', 'AI Product Engineering', 'Go-to-Market & Retention'],
    networkingOpportunities: [
      'VIP Founders & VP of Product Breakfast Roundtable',
      'Southeast Asian & Global Tech Operators Mixer',
      'AI Startup Pitch & Demo Lounge'
    ],
    keyTakeaways: [
      'Schedule 1-on-1 chats with enterprise buyers',
      'Collect case study benchmarks on developer adoption'
    ],
    certificateBadge: 'ProductCon 2026 VIP Delegate Badge #99824'
  },
  evidenceItems: [
    {
      id: 'ev-conf-badge',
      title: 'ProductCon 2026 Official Delegate Pass & Ticket',
      type: 'badge',
      url: 'https://productcon.eventbrite.com/tickets/vip-99824',
      fileSize: '350 KB',
      uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      description: 'Confirmed VIP All-Access Pass with breakout track entry codes.',
      verificationBadge: true
    }
  ],
  followUpTasks: [
    { id: 'task-conf-1', title: 'Download speaker presentation decks and schedule 1-on-1 networking slots', completed: false, dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], priority: 'HIGH' },
    { id: 'task-conf-2', title: 'Prepare 30-second intro pitch for SEA Tech Mixer', completed: false, priority: 'MEDIUM' }
  ],
  relatedOpportunityId: 'app-company-x-prod-strat',
  relatedOpportunityTitle: 'Product Strategy Manager (Company X)',
  relatedBlueprintId: 'bp-prod-strategy',
  relatedBlueprintTitle: 'Product Strategy Manager Blueprint',
  requirementIds: [],
  requirements: [],
  knowledgeIds: ['ku-product-strategy'],
  assessmentIds: [],
  documents: [],
  activities: [
    { id: 'act-conf-1', itemId: 'conf-global-productcon-2026', type: 'STAGE_CHANGE', title: 'Saved conference from Opportunities & Events Radar', timestamp: new Date(Date.now() - 14 * 86400000).toISOString() },
    { id: 'act-conf-2', itemId: 'conf-global-productcon-2026', type: 'STAGE_CHANGE', title: 'Confirmed registration with VIP Pass', timestamp: new Date(Date.now() - 3 * 86400000).toISOString() }
  ],
  createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  pipelineState: 'applied_screening',
  status: 'OFFER'
};

// Example 13: Meeting - Q4 AI Infrastructure & Technical Architecture Review (Completed / Operational Layout)
const SEED_MEETING_1: JobApplication = {
  id: 'meeting-q4-arch-sync',
  participationType: 'meeting',
  participationStatus: 'COMPLETED',
  unifiedStatus: 'completed',
  participationRole: 'Organizer',
  companyName: 'Platform Core Team',
  organization: 'Platform Core Engineering Guild',
  roleTitle: 'Q4 AI Infrastructure & Technical Architecture Review',
  domain: 'Cloud Infrastructure & High-Availability Systems',
  location: 'Google Meet / HQ Room 4A',
  currentStageId: 'completed',
  currentStageName: 'Completed & Action Items',
  priority: 'HIGH',
  isOnline: true,
  startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
  startTime: '02:00 PM',
  endTime: '03:15 PM',
  duration: '75 minutes',
  description: 'Quarterly strategic alignment on distributed telemetry processing, Kafka partitioning strategy, and sub-50ms ingestion latency guarantees.',
  topics: ['Kafka Partitioning', 'Zero-Downtime Migration', 'Telemetry Data Lake', 'SLA Latency Targets'],
  skillIds: ['Distributed Systems', 'Kafka', 'System Architecture', 'Executive Synthesis'],
  readinessSkills: ['Distributed Systems', 'Kafka'],
  readinessContribution: 10,
  expectedOutcome: 'Reach cross-functional consensus on Kafka CDC connector vs direct NATS clustering; lock down sprint backlog assignments.',
  notes: 'Unanimous decision to adopt Kafka CDC with Schema Registry. Minh Tran will lead the connector benchmark; David Pham will configure Terraform staging cluster.',
  meetingDetails: {
    participants: [
      'Elena Vance (VP Product)',
      'Minh Tran (Lead Systems Architect)',
      'David Pham (Staff Platform Engineer)',
      'Alex Nguyen (Product Strategy)'
    ],
    agenda: '1. Review telemetry latency bottleneck during peak vehicle fleet ingestion\n2. Evaluate Kafka CDC vs NATS JetStream benchmark findings\n3. Finalize data residency compliance for SEA nodes (Decree 53)\n4. Assign sprint action items and follow-up timeline',
    meetingObjective: 'Approve final architecture RFC to support 150,000 events/sec with 99.99% uptime guarantee.',
    decisions: [
      'Decided to use Kafka CDC connectors with Schema Registry for structured telemetry schema evolution.',
      'Approved hybrid deployment: on-prem gateway in Hanoi with managed AWS Aurora analytics replica in Singapore.',
      'Deferred European cluster rollout to Q1 2027 to focus engineering resources on Southeast Asian production rollout.'
    ],
    actionItems: [
      { text: 'Publish final approved Architecture RFC to engineering Confluence space', assignee: 'Alex Nguyen', done: true },
      { text: 'Provision sandbox Kafka CDC cluster with Terraform', assignee: 'David Pham', done: true },
      { text: 'Execute 48-hour load test at 200,000 msg/sec and publish latency p99 report', assignee: 'Minh Tran', done: false }
    ],
    followUpDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    relatedProjectId: 'proj-vector-search'
  },
  evidenceItems: [
    {
      id: 'ev-mtg-rfc',
      title: 'Approved Architecture RFC Document v2.4 (PDF)',
      type: 'document',
      url: 'https://confluence.internal/rfc-q4-telemetry-arch.pdf',
      fileSize: '890 KB',
      uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      description: 'Formal architectural RFC with multi-region data flows, schema diagrams, and latency calculations.'
    },
    {
      id: 'ev-mtg-notes',
      title: 'Meeting Recording & Executive Transcript',
      type: 'recording',
      url: 'https://drive.google.com/file/d/rec-q4-arch-sync/view',
      fileSize: '48 MB',
      uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      description: 'Full 75-minute video recording and searchable transcript with speaker attribution.'
    }
  ],
  followUpTasks: [
    { id: 'task-mtg-1', title: 'Verify Terraform provisioning completed for staging cluster', completed: true, dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], priority: 'HIGH' },
    { id: 'task-mtg-2', title: 'Schedule follow-up review for load test findings', completed: false, dueDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0], priority: 'MEDIUM' }
  ],
  relatedOpportunityId: 'app-vinfast-senior-infra',
  relatedOpportunityTitle: 'Senior Cloud & Platform Infrastructure Engineer (VinFast)',
  relatedProjectId: 'proj-vector-search',
  relatedProjectTitle: 'Enterprise Vector Search Architecture',
  requirementIds: [],
  requirements: [],
  knowledgeIds: ['ku-cloud-infra'],
  assessmentIds: [],
  documents: [],
  activities: [
    { id: 'act-mtg-1', itemId: 'meeting-q4-arch-sync', type: 'STAGE_CHANGE', title: 'Scheduled sync with VP of Product & Systems Leads', timestamp: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 'act-mtg-2', itemId: 'meeting-q4-arch-sync', type: 'STAGE_CHANGE', title: 'Conducted meeting and recorded binding architecture decisions', timestamp: new Date(Date.now() - 2 * 86400000).toISOString() }
  ],
  createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  pipelineState: 'archived_closed',
  status: 'ACCEPTED'
};

// Example 14: Webinar - Mastering SaaS Retention & Growth Loops (Attended / Completed)
const SEED_WEBINAR_1: JobApplication = {
  id: 'webinar-retention-loops-2026',
  participationType: 'webinar',
  participationStatus: 'COMPLETED',
  unifiedStatus: 'attended',
  participationRole: 'Attendee',
  companyName: 'Reforge Executive Webinars',
  organization: 'Reforge',
  roleTitle: 'Mastering SaaS Retention & Compounding Growth Loops',
  domain: 'Growth Strategy & Product-Led Monetization',
  location: 'Zoom Livestream / Virtual',
  currentStageId: 'completed',
  currentStageName: 'Completed',
  priority: 'MEDIUM',
  isOnline: true,
  startDate: new Date(Date.now() - 12 * 86400000).toISOString(),
  startTime: '07:00 PM',
  endTime: '08:30 PM',
  duration: '90 minutes',
  description: 'Executive webinar dissecting why linear marketing funnels fail in B2B SaaS and how to model compounding retention loops and qualitative moats.',
  topics: ['Growth Loops', 'Cohorts Analysis', 'Retention Curves', 'B2B SaaS Moats'],
  skillIds: ['Growth Loops', 'Retention Cohorts', 'Unit Economics', 'Strategic Thinking'],
  readinessSkills: ['Growth Loops', 'Retention Cohorts'],
  readinessContribution: 8,
  expectedOutcome: 'Gain practical model template for projecting cohort net revenue retention under tiered enterprise usage pricing.',
  outcomes: 'Adapted Reforge growth loop framework into Company X market entry business case thesis.',
  keyTakeaways: [
    'Retention precedes acquisition: fixing leaky buckets multiplies marketing efficiency by 3x.',
    'Compounding loops outlive linear funnels because user activity directly fuels new user discovery.'
  ],
  webinarDetails: {
    speaker: 'Brian Balfour (CEO, Reforge; ex-VP Growth HubSpot)',
    topic: 'Product-Led Growth Loops vs Traditional Linear Marketing Funnels',
    platformOrVenue: 'Zoom Webinar Live & Interactive Q&A',
    resources: [
      { title: 'Reforge Retention Cohort Spreadsheets Template', url: 'https://reforge.com/tools/cohort-calculator' },
      { title: 'Growth Loops Deep-Dive Article', url: 'https://brianbalfour.com/essays/growth-loops' }
    ],
    keyTakeaways: [
      'Focus on cohort NRR stabilization before accelerating paid distribution channels',
      'Design product telemetry to detect retention drops 60 days before contract renewal'
    ]
  },
  evidenceItems: [
    {
      id: 'ev-web-notes',
      title: 'Growth Loop Teardowns & Mathematical Formulas (PDF)',
      type: 'notes',
      url: 'https://drive.google.com/file/d/growth-loop-notes/view',
      fileSize: '512 KB',
      uploadedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      description: 'Complete synthesized lecture notes with 4 quantitative cohort formulas.'
    }
  ],
  followUpTasks: [
    { id: 'task-web-1', title: 'Apply cohort retention model to Company X business case', completed: true, priority: 'HIGH' }
  ],
  relatedOpportunityId: 'app-company-x-prod-strat',
  relatedOpportunityTitle: 'Product Strategy Manager (Company X)',
  relatedKnowledgeId: 'ku-unit-economics',
  relatedKnowledgeTitle: 'Unit Economics & SaaS Cohort Analytics',
  requirementIds: [],
  requirements: [],
  knowledgeIds: ['ku-unit-economics'],
  assessmentIds: [],
  documents: [],
  activities: [
    { id: 'act-web-1', itemId: 'webinar-retention-loops-2026', type: 'STAGE_CHANGE', title: 'Registered for Reforge Live Executive Webinar', timestamp: new Date(Date.now() - 20 * 86400000).toISOString() },
    { id: 'act-web-2', itemId: 'webinar-retention-loops-2026', type: 'STAGE_CHANGE', title: 'Attended live broadcast and participated in interactive Q&A', timestamp: new Date(Date.now() - 12 * 86400000).toISOString() }
  ],
  createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  pipelineState: 'archived_closed',
  status: 'ACCEPTED'
};

// Example 15: Volunteer / NGO Event - Pro-Bono Tech Mentorship Day (Completed / Social Impact)
const SEED_VOLUNTEER_1: JobApplication = {
  id: 'vol-youth-steam-mentor',
  participationType: 'volunteer',
  participationStatus: 'COMPLETED',
  unifiedStatus: 'completed',
  participationRole: 'Mentor',
  companyName: 'VietTech Youth Innovation Foundation',
  organization: 'VietTech Youth Innovation Foundation',
  roleTitle: 'Pro-Bono Youth STEAM Mentorship Day',
  domain: 'Community & Social Impact Education',
  location: 'Da Nang & Hybrid Online',
  currentStageId: 'completed',
  currentStageName: 'Impact Verified',
  priority: 'MEDIUM',
  isOnline: true,
  startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
  startTime: '08:00 AM',
  endTime: '05:00 PM',
  duration: '12 Hours',
  description: 'Mentoring underrepresented university students and aspiring tech builders through resume optimization, technical portfolio reviews, and mock behavioral interviews.',
  topics: ['Career Guidance', 'Mock Interviews', 'Portfolio Review', 'STEAM Education'],
  skillIds: ['Managing Up', 'Executive Synthesis', 'Cross-Functional Leadership'],
  readinessSkills: ['Managing Up', 'Cross-Functional Leadership'],
  readinessContribution: 8,
  expectedOutcome: 'Provide actionable career roadmaps and technical portfolio feedback to at least 4 graduating engineers.',
  outcomes: 'Directly mentored 4 senior undergraduate students; 2 have already advanced to technical interview rounds at top regional software houses.',
  communityDetails: {
    organization: 'VietTech Youth Innovation Foundation',
    causeOrDomain: 'Equal Opportunity Youth STEAM Education & Tech Literacy',
    role: 'Senior Technical Mentor & Panelist',
    contribution: 'Delivered 4 1-on-1 60-minute portfolio review sessions and conducted 2 live mock interviews on algorithms and system design fundamentals.',
    impactOrOutcome: 'Guided 4 students to revamp their GitHub portfolios and resume narratives; 12 hours of pro-bono service documented and certified.',
    hours: 12,
    evidence: 'https://viettechfoundation.org/certificates/mentor-vol-2026-alex'
  },
  evidenceItems: [
    {
      id: 'ev-vol-cert',
      title: 'Official Social Impact Service Certificate (12 Hours)',
      type: 'certificate',
      url: 'https://viettechfoundation.org/certificates/mentor-vol-2026-alex',
      fileSize: '740 KB',
      uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      description: 'Officially certified volunteer leadership contribution certificate issued by NGO Board of Trustees.',
      verificationBadge: true
    }
  ],
  followUpTasks: [
    { id: 'task-vol-1', title: 'Send curated resource links and resume templates to mentee cohort', completed: true, priority: 'MEDIUM' }
  ],
  requirementIds: [],
  requirements: [],
  knowledgeIds: ['ku-leadership'],
  assessmentIds: [],
  documents: [],
  activities: [
    { id: 'act-vol-1', itemId: 'vol-youth-steam-mentor', type: 'STAGE_CHANGE', title: 'Accepted mentor invitation for NGO Youth STEAM drive', timestamp: new Date(Date.now() - 18 * 86400000).toISOString() },
    { id: 'act-vol-2', itemId: 'vol-youth-steam-mentor', type: 'STAGE_CHANGE', title: 'Completed 12 hours of mentorship and verified social impact', timestamp: new Date(Date.now() - 5 * 86400000).toISOString() }
  ],
  createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  pipelineState: 'archived_closed',
  status: 'ACCEPTED'
};

// Example 16: Saved Bootcamp - Generative AI Systems Design Bootcamp (Saved)
const SEED_SAVED_BOOTCAMP_1: JobApplication = {
  id: 'saved-genai-bootcamp-2026',
  participationType: 'bootcamp',
  participationStatus: 'SAVED',
  unifiedStatus: 'saved',
  participationRole: 'Participant',
  companyName: 'FullStack Academy & Weights and Biases',
  organization: 'FullStack Academy',
  roleTitle: 'Generative AI Systems Design Bootcamp',
  domain: 'Deep Learning & Cloud LLMOps',
  location: 'Online Cohort Live Labs',
  currentStageId: 'saved',
  currentStageName: 'Saved',
  priority: 'MEDIUM',
  isOnline: true,
  startDate: new Date(Date.now() + 25 * 86400000).toISOString(),
  duration: '6 Weeks',
  description: 'Curriculum focusing on distributed model fine-tuning with LoRA/QLoRA, vLLM inference acceleration, and building scalable production agent architectures.',
  topics: ['LoRA Fine-Tuning', 'vLLM', 'Inference Optimization', 'Agentic Systems', 'Kubernetes GPU Clusters'],
  skillIds: ['PyTorch', 'System Architecture', 'Distributed Systems'],
  readinessSkills: ['PyTorch', 'Distributed Systems'],
  readinessContribution: 14,
  expectedOutcome: 'Capstone: Fine-tune a 7B parameter reasoning model on specialized regional domain corpus and benchmark inference throughput on H100 GPUs.',
  notes: 'Saved for Winter 2026 cohort intake. Application deadline in 3 weeks; checking with company learning stipend eligibility.',
  bootcampDetails: {
    provider: 'FullStack Academy in partnership with Weights & Biases',
    curriculum: [
      'Module 1: Foundational Transformers Internals & KV Caching Mechanics',
      'Module 2: Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA)',
      'Module 3: High-Throughput Inference Engines (vLLM, TensorRT-LLM)',
      'Module 4: Multi-Agent Systems & Evaluation with Weights & Biases Weave',
      'Module 5: Capstone Project Defense & Industry Peer Review'
    ],
    startDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 67 * 86400000).toISOString().split('T')[0],
    completionStatus: 'Saved / Considering Enrollment',
    skillsAcquired: ['PyTorch', 'LoRA Fine-Tuning', 'vLLM', 'GPU Inference Benchmarking']
  },
  evidenceItems: [],
  followUpTasks: [
    { id: 'task-boot-1', title: 'Submit education reimbursement request to HR', completed: false, dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], priority: 'HIGH' }
  ],
  relatedBlueprintId: 'bp-ai-product-manager',
  relatedBlueprintTitle: 'AI Product Manager Role Blueprint',
  requirementIds: [],
  requirements: [],
  knowledgeIds: ['ku-ai-bootcamp'],
  assessmentIds: [],
  documents: [],
  activities: [
    { id: 'act-boot-1', itemId: 'saved-genai-bootcamp-2026', type: 'STAGE_CHANGE', title: 'Bookmarked bootcamp in Participation Tracker', timestamp: new Date(Date.now() - 4 * 86400000).toISOString() }
  ],
  createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  pipelineState: 'applied_screening',
  status: 'WISHLIST'
};

export const SEED_DEFAULT_APPLICATIONS: JobApplication[] = [
  SEED_APPLICATION, 
  SEED_APPLICATION_2, 
  SEED_APPLICATION_3, 
  SEED_APPLICATION_4, 
  SEED_APPLICATION_5,
  SEED_HACKATHON_1,
  SEED_BUILDER_MATCH_1,
  SEED_MENTORSHIP_1,
  SEED_CREDENTIAL_1,
  SEED_LEARNING_PROG_1,
  SEED_WORKSHOP_1,
  SEED_CONFERENCE_1,
  SEED_MEETING_1,
  SEED_WEBINAR_1,
  SEED_VOLUNTEER_1,
  SEED_SAVED_BOOTCAMP_1
];

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

      const defaultApps: JobApplication[] = SEED_DEFAULT_APPLICATIONS;

      if (storedApps) {
        const parsed: JobApplication[] = JSON.parse(storedApps);
        // Map missing pipeline states, assign default participationType, and merge missing seed examples
        this.applications = parsed.map(app => {
          if (!app.pipelineState) {
            const { primary, sub } = mapLegacyStatusToPipelineState(app.status);
            app.pipelineState = primary;
            app.pipelineSubState = sub;
          }
          if (!app.participationType) {
            app.participationType = 'career_opportunity';
          }
          if (!app.participationStatus) {
            app.participationStatus = app.pipelineState === 'archived_closed' ? 'ARCHIVED' : 'ACTIVE';
          }
          return app;
        });

        // Ensure key seed applications and participation items exist
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
    const access = AccessControlService.getAccessLevel();
    if (access === 'DEMO') {
      return demoWorkspaceService.getParticipations();
    }
    if (access === 'PUBLIC') {
      return this.applications.slice(0, 1);
    }
    if (access === 'GUEST') {
      return this.applications.slice(0, 3);
    }
    return [...this.applications];
  }

  getApplicationById(id: string): JobApplication | undefined {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.getParticipations().find(a => a.id === id) || this.applications.find(a => a.id === id);
    }
    return this.applications.find(a => a.id === id);
  }

  getApplicationByJobOpportunityId(jobOpportunityId: string): JobApplication | undefined {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.getParticipations().find(a => a.jobOpportunityId === jobOpportunityId);
    }
    return this.applications.find(a => a.jobOpportunityId === jobOpportunityId);
  }

  isJobTracked(jobOpportunityId: string): boolean {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.getParticipations().some(a => a.jobOpportunityId === jobOpportunityId);
    }
    return this.applications.some(a => a.jobOpportunityId === jobOpportunityId);
  }

  createApplicationFromJob(job: JobListing, initialStatus: JobApplicationStatus = 'APPLIED'): JobApplication {
    const existing = this.getApplicationByJobOpportunityId(job.id);
    if (existing) {
      return existing;
    }

    const isDemo = AccessControlService.getAccessLevel() === 'DEMO';
    const customApps = isDemo
      ? demoWorkspaceService.getParticipations().filter(a => a.createdByDemoUser)
      : this.applications.filter(a => a.id.startsWith('app-') || a.id.startsWith('track-'));
    const decision = AccessControlService.canCreateWorkflowItem('applications', customApps.length);
    if (!decision.allowed) {
      console.warn('Application creation blocked by access control:', decision.reason);
      throw new Error(decision.reason || 'Creation restricted by active access tier.');
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
      participationType: 'career_opportunity',
      participationStatus: 'ACTIVE',
      organization: job.company,
      domain: job.domain,
      currentStageId: sub || 'applied',
      currentStageName: sub === 'screening' ? 'Screening' : 'Applied',
      priority: 'MEDIUM',
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

    if (isDemo) {
      return demoWorkspaceService.saveParticipation(newApp, true);
    }

    this.saveApplication(newApp);
    return newApp;
  }

  createApplicationFromOpportunity(item: Partial<JobApplication>): JobApplication {
    return this.trackNewParticipation(item);
  }

  trackNewParticipation(item: Partial<JobApplication>): JobApplication {
    const isDemo = AccessControlService.getAccessLevel() === 'DEMO';
    const customApps = isDemo
      ? demoWorkspaceService.getParticipations().filter(a => a.createdByDemoUser)
      : this.applications.filter(a => a.id.startsWith('app-') || a.id.startsWith('track-'));
    const decision = AccessControlService.canCreateWorkflowItem('applications', customApps.length);
    if (!decision.allowed) {
      console.warn('Application tracking blocked by access control:', decision.reason);
      throw new Error(decision.reason || 'Creation restricted by active access tier.');
    }

    const pType: ParticipationType = item.participationType || 'career_opportunity';
    const lifecycle = PARTICIPATION_LIFECYCLES[pType];
    const initialStage = lifecycle.stages[0];

    const newItem: JobApplication = {
      id: item.id || `track-${pType.substring(0, 4)}-${Date.now()}`,
      companyName: item.companyName || item.organization || 'Organization',
      organization: item.organization || item.companyName || 'Organization',
      roleTitle: item.roleTitle || (item as Record<string, any>).title || 'Participation Item',
      domain: item.domain || 'General',
      location: item.location || 'Remote',
      participationType: pType,
      participationStatus: item.participationStatus || lifecycle.defaultStatus,
      currentStageId: item.currentStageId || initialStage.id,
      currentStageName: item.currentStageName || initialStage.label,
      priority: item.priority || 'MEDIUM',
      deadline: item.deadline,
      startDate: item.startDate || new Date().toISOString(),
      expectedOutcome: item.expectedOutcome || '',
      notes: item.notes || '',
      pipelineState: (item.pipelineState || (pType === 'career_opportunity' ? 'applied_screening' : 'assessment_case')) as ApplicationPrimaryState,
      status: (item.status || 'APPLIED') as JobApplicationStatus,
      requirementIds: item.requirementIds || [],
      requirements: item.requirements || [],
      skillIds: item.skillIds || [],
      knowledgeIds: item.knowledgeIds || [],
      assessmentIds: item.assessmentIds || [],
      documents: item.documents || [],
      hackathonData: item.hackathonData,
      builderMatchData: item.builderMatchData,
      mentorshipData: item.mentorshipData,
      credentialProgramData: item.credentialProgramData,
      activities: item.activities || [
        {
          id: `act-${Date.now()}`,
          itemId: item.id || `track-${pType.substring(0, 4)}-${Date.now()}`,
          type: 'STAGE_CHANGE',
          title: `Tracked in Participation Tracker (${initialStage.label})`,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isDemo) {
      return demoWorkspaceService.saveParticipation(newItem, true);
    }

    this.saveApplication(newItem);
    return newItem;
  }

  updateParticipationStage(id: string, stageId: string, stageName: string, reason?: string): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item) return undefined;

    item.currentStageId = stageId;
    item.currentStageName = stageName;
    item.updatedAt = new Date().toISOString();

    if (!item.activities) item.activities = [];
    item.activities.unshift({
      id: `act-${Date.now()}`,
      itemId: id,
      type: 'STAGE_CHANGE',
      title: `Advanced to ${stageName}`,
      description: reason,
      timestamp: new Date().toISOString()
    });

    this.saveApplication(item);
    return item;
  }

  updateMentorshipSessions(id: string, delta: number): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item || !item.mentorshipData) return undefined;

    const newCompleted = Math.max(0, Math.min(item.mentorshipData.totalSessions, item.mentorshipData.completedSessions + delta));
    item.mentorshipData.completedSessions = newCompleted;
    if (newCompleted >= item.mentorshipData.totalSessions) {
      item.currentStageId = 'completed';
      item.currentStageName = 'Completed';
      item.participationStatus = 'COMPLETED';
    }

    if (!item.activities) item.activities = [];
    item.activities.unshift({
      id: `act-${Date.now()}`,
      itemId: id,
      type: 'SESSION',
      title: delta > 0 ? `Logged Mentorship Session (${newCompleted}/${item.mentorshipData.totalSessions})` : `Adjusted session count (${newCompleted}/${item.mentorshipData.totalSessions})`,
      timestamp: new Date().toISOString()
    });

    this.saveApplication(item);
    return item;
  }

  toggleDeliverable(id: string, deliverableId: string): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item || !item.hackathonData?.deliverables) return undefined;

    const d = item.hackathonData.deliverables.find(x => x.id === deliverableId);
    if (d) {
      d.completed = !d.completed;
      item.updatedAt = new Date().toISOString();
      this.saveApplication(item);
    }
    return item;
  }

  addActivity(id: string, activity: TrackerActivity): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item) return undefined;

    if (!item.activities) item.activities = [];
    item.activities.unshift(activity);
    this.saveApplication(item);
    return item;
  }

  // --- Participation Unified Methods ---
  addEvidenceItem(id: string, evidence: import('../types').ParticipationEvidenceItem): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item) return undefined;
    if (!item.evidenceItems) item.evidenceItems = [];
    item.evidenceItems.unshift(evidence);
    this.addActivity(id, {
      id: `act-${Date.now()}`,
      itemId: id,
      type: 'UPDATE',
      title: `Added Evidence: ${evidence.title} (${evidence.type})`,
      timestamp: new Date().toISOString()
    });
    this.saveApplication(item);
    return item;
  }

  deleteEvidenceItem(id: string, evidenceId: string): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item || !item.evidenceItems) return undefined;
    item.evidenceItems = item.evidenceItems.filter(e => e.id !== evidenceId);
    this.saveApplication(item);
    return item;
  }

  addFollowUpTask(id: string, task: import('../types').ParticipationFollowUpTask): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item) return undefined;
    if (!item.followUpTasks) item.followUpTasks = [];
    item.followUpTasks.push(task);
    this.addActivity(id, {
      id: `act-${Date.now()}`,
      itemId: id,
      type: 'TASK',
      title: `Added Task: ${task.title}`,
      timestamp: new Date().toISOString()
    });
    this.saveApplication(item);
    return item;
  }

  toggleFollowUpTask(id: string, taskId: string): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item || !item.followUpTasks) return undefined;
    const t = item.followUpTasks.find(x => x.id === taskId);
    if (t) {
      t.completed = !t.completed;
      this.saveApplication(item);
    }
    return item;
  }

  updateParticipationUnifiedStatus(id: string, status: import('../types').UnifiedParticipationStatus): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item) return undefined;
    item.unifiedStatus = status;
    if (status === 'completed' || status === 'attended') {
      item.participationStatus = 'COMPLETED';
    } else if (status === 'saved') {
      item.participationStatus = 'SAVED';
    } else if (status === 'cancelled' || status === 'no_show') {
      item.participationStatus = 'CANCELLED';
    } else {
      item.participationStatus = 'ACTIVE';
    }
    this.addActivity(id, {
      id: `act-${Date.now()}`,
      itemId: id,
      type: 'STAGE_CHANGE',
      title: `Status changed to ${status.toUpperCase()}`,
      timestamp: new Date().toISOString()
    });
    this.saveApplication(item);
    return item;
  }

  addTakeaway(id: string, takeaway: string): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item) return undefined;
    if (!item.keyTakeaways) item.keyTakeaways = [];
    item.keyTakeaways.push(takeaway.trim());
    this.saveApplication(item);
    return item;
  }

  linkParticipationEntity(
    id: string, 
    entityType: 'opportunity' | 'project' | 'knowledge' | 'blueprint', 
    entityId: string, 
    entityTitle: string
  ): JobApplication | undefined {
    const item = this.getApplicationById(id);
    if (!item) return undefined;
    if (entityType === 'opportunity') {
      item.relatedOpportunityId = entityId;
      item.relatedOpportunityTitle = entityTitle;
    } else if (entityType === 'project') {
      item.relatedProjectId = entityId;
      item.relatedProjectTitle = entityTitle;
    } else if (entityType === 'knowledge') {
      item.relatedKnowledgeId = entityId;
      item.relatedKnowledgeTitle = entityTitle;
    } else if (entityType === 'blueprint') {
      item.relatedBlueprintId = entityId;
      item.relatedBlueprintTitle = entityTitle;
    }
    this.addActivity(id, {
      id: `act-${Date.now()}`,
      itemId: id,
      type: 'UPDATE',
      title: `Linked to ${entityType}: ${entityTitle}`,
      timestamp: new Date().toISOString()
    });
    this.saveApplication(item);
    return item;
  }

  resetParticipationSamples(): void {
    const sampleApps: JobApplication[] = [
      SEED_APPLICATION, 
      SEED_APPLICATION_2, 
      SEED_APPLICATION_3, 
      SEED_APPLICATION_4, 
      SEED_APPLICATION_5,
      SEED_HACKATHON_1,
      SEED_BUILDER_MATCH_1,
      SEED_MENTORSHIP_1,
      SEED_CREDENTIAL_1,
      SEED_LEARNING_PROG_1,
      SEED_WORKSHOP_1,
      SEED_CONFERENCE_1,
      SEED_MEETING_1,
      SEED_WEBINAR_1,
      SEED_VOLUNTEER_1,
      SEED_SAVED_BOOTCAMP_1
    ];
    this.applications = sampleApps;
    this.saveToStorage();
  }

  resetToDefaults(): void {
    this.resetParticipationSamples();
  }

  createApplication(data: Partial<JobApplication>): JobApplication {
    return this.createApplicationFromOpportunity(data);
  }

  saveApplication(app: JobApplication): JobApplication {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.saveParticipation(app, false);
    }

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
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.deleteParticipation(id);
    }

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
