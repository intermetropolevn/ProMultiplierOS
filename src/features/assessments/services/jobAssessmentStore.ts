import { JobAssessment, AssessmentSubmission, AssessmentEvaluation } from '../types';
import { sourceStore } from '../../sources/services/sourceStore';
import { NormalizedSource } from '../../sources/types';
import { RoleCategory } from '../../../types';

const STORAGE_KEY = 'career_os_job_assessments_v2';

export const INITIAL_JOB_ASSESSMENTS: JobAssessment[] = [
  // Example 1: Product Manager -> Product Case & GTM Challenge
  {
    id: 'assess-pm-sea-case',
    jobId: 'app-company-x-prod-strat',
    jobTitle: 'Product Strategy Manager',
    company: 'Company X',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    role: 'Product Strategy Manager (Southeast Asia Expansion)',
    roleCategory: 'Product Manager',
    assessmentType: 'Product Case',
    title: 'Southeast Asia Regional Expansion Strategy Case',
    deadline: '2026-09-12T17:00:00.000Z',
    stage: 'converted_to_evidence',
    createdAt: '2026-08-30T10:00:00.000Z',
    updatedAt: '2026-09-02T16:00:00.000Z',
    casePrompt: `Company X is evaluating expanding its flagship enterprise SaaS platform, Product Y, into Southeast Asia.
As Product Strategy Manager candidate, evaluate market attractiveness, competitive defensibility, and commercial viability.

Deliver a structured recommendation addressing:
1. Market Sizing: Addressable TAM/SAM/SOM across Vietnam, Indonesia, and Singapore.
2. Beachhead Market & GTM: Select primary entry country with qualitative & quantitative justification.
3. Unit Economics & Pricing: Pricing model and ACV ensuring sustainable payback under local economic constraints.
4. Key Risks & Mitigations: Primary failure modes and concrete mitigation roadmap.`,
    caseContext: 'Company X has 280 employees, operates on AWS cloud infrastructure, and has $35M in cash reserves allocated for international expansion.',
    constraints: [
      '$35M total allocated international expansion budget',
      'Lower local willingness-to-pay vs Western market ($4.8k ACV vs $18k)',
      'Local data residency regulations (Vietnam Decree 53)',
      'Tight 5-day turnaround deadline'
    ],
    deliverablesExpected: [
      'Executive Summary (Minto Pyramid structure)',
      '3-Year Financial Model & Unit Economics sensitivity table',
      'Country Beachhead Comparison Matrix',
      'Mitigation Playbook for local incumbent competition'
    ],
    exhibits: [
      {
        id: 'ex-1',
        title: 'Exhibit 1: Regional Developer Pool & ACV Data',
        type: 'TABLE',
        preview: 'Vietnam (120k devs, $4.8k ACV), Indonesia (95k devs, $5.2k ACV), Singapore (65k devs, $14.5k ACV).'
      },
      {
        id: 'ex-2',
        title: 'Exhibit 2: Benchmark SaaS Payback Periods',
        type: 'CHART',
        preview: 'Median Gross Margin: 78.5% | Median CAC Payback: 14 months | Target LTV/CAC: >3.5x.'
      }
    ],
    submission: {
      id: 'sub-pm-sea-1',
      submittedAt: '2026-09-01T14:30:00.000Z',
      version: 1,
      content: `Executive Summary & Strategic Recommendation:
1. Primary Beachhead: Select Vietnam as the initial expansion beachhead due to its high engineering density (120,000 developers) and lower direct sales overhead.
2. Tiered Pricing Model: Introduce 'Product Y Lite' priced in VND at $12/user/month (40% discount vs Western tiers), protecting gross margin above 76%.
3. Distribution Channel: Partner with top 2 regional cloud distributors (CMC Telecom & FPT) for Year 1 to keep CAC under $1,800 with 3.12x LTV/CAC.
4. Capital Phasing: Deploy $6.2M in Phase 1; fund Singapore enterprise direct sales hub only after achieving $1.5M ARR run-rate in Vietnam.`,
      url: 'https://docs.google.com/presentation/d/company-x-sea-expansion-strategy',
      attachments: [
        {
          id: 'att-1',
          name: 'Company_X_SEA_Strategy_Deck.pdf',
          size: '3.8 MB',
          type: 'Deck',
          url: 'https://storage.googleapis.com/career-os/sample-decks/company-x-deck.pdf'
        },
        {
          id: 'att-2',
          name: 'Vietnam_Indonesia_TAM_Unit_Economics.xlsx',
          size: '1.4 MB',
          type: 'Spreadsheet',
          url: 'https://storage.googleapis.com/career-os/sample-sheets/sea-unit-econ.xlsx'
        }
      ]
    },
    evaluation: {
      evaluatedAt: '2026-09-02T16:00:00.000Z',
      evaluatorName: 'Marcus Vance',
      evaluatorRole: 'VP of Product & Expansion Committee',
      score: '94/100 (Top 3%)',
      ratingTier: 'Exceptional',
      feedback: 'Outstanding unit economics modeling. The candidate avoided the common trap of recommending Singapore first, correctly analyzing customer acquisition efficiency in Vietnam. Clear executive synthesis and rigorous defense of the distributor margin model.',
      result: 'passed',
      rubricPerformance: [
        { criterion: 'Strategic Problem Framing & MECE Rigor', score: 19, maxScore: 20, comments: 'Clear beachhead logic.' },
        { criterion: 'Quantitative Modeling & Unit Economics', score: 20, maxScore: 20, comments: 'Flawless LTV/CAC sensitivity calculations.' },
        { criterion: 'GTM Strategy & Channel Selection', score: 18, maxScore: 20, comments: 'Distributor partnership agreements well-defended.' },
        { criterion: 'Risk Identification & Mitigation', score: 18, maxScore: 20, comments: 'Decree 53 data residency addressed proactively.' },
        { criterion: 'Executive Communication & Presentation', score: 19, maxScore: 20, comments: 'Minto pyramid structure in deck.' }
      ]
    },
    skillsDemonstrated: [
      {
        skillName: 'Market Sizing',
        level: 6,
        proofStatement: 'Rigorously sized bottom-up SOM of $6.9M across 2,400 target Vietnamese tech firms with sensitivity on developer seat density.'
      },
      {
        skillName: 'Unit Economics',
        level: 6,
        proofStatement: 'Constructed 3-year LTV/CAC model demonstrating 3.12x return and 14-month payback under localized VND pricing tiers.'
      },
      {
        skillName: 'Go-To-Market (GTM) Strategy',
        level: 6,
        proofStatement: 'Architected indirect distributor channel model lowering initial CAC by 42% compared to direct sales forces.'
      },
      {
        skillName: 'Strategic Thinking',
        level: 6,
        proofStatement: 'Defended contrarian beachhead entry in Vietnam over saturated Singapore incumbent landscape.'
      },
      {
        skillName: 'Executive Synthesis',
        level: 6,
        proofStatement: 'Packaged complex multi-country regulatory, operational, and financial trade-offs into an unambiguous 10-slide executive deck.'
      }
    ],
    lessonsLearned: 'In emerging market expansion, customer willingness-to-pay cannot be decoupled from local distributor commissions. Future cases should model cash-flow timing delays from regional currency withholding taxes earlier.',
    whatWentWell: 'Defending the contrarian Vietnam beachhead with unit economics won strong consensus with the hiring committee.',
    whatToImprove: 'Could include more granular customer interview quotes or voice-of-customer proxies from regional developer communities.',
    convertedEvidenceId: 'source-ev-assess-company-x',
    convertedAt: '2026-09-02T16:30:00.000Z',
    evidenceStrength: 6,
    reusableOutputs: {
      profileStatement: 'Demonstrated high-stakes international market entry & unit economics modeling evaluated by Company X executive leadership (Score: 94/100, Exceptional Tier).',
      skillIntelligenceProof: 'Validated Level 6 proficiency in Market Sizing, Unit Economics, and GTM Strategy based on verified enterprise hiring evaluation.',
      jobMatchBoost: 'Provides Level 6 validated evidence satisfying senior Product Strategy & Expansion role competencies.',
      interviewStory: {
        situation: 'Company X was evaluating a $35M multi-country Southeast Asian expansion with conflicting executive viewpoints on whether to target Singapore or emerging tech hubs.',
        task: 'Deliver a comprehensive 5-day market entry business case recommending beachhead geography, pricing tiers, and a 24-month roadmap.',
        action: 'Analyzed 120k developer headcounts across 8,900 Vietnamese firms, constructed localized $12/user VND unit economics with 3.12x LTV/CAC, and proposed indirect distribution via FPT/CMC.',
        result: 'Achieved a 94/100 evaluation score (Top 3% of candidates), advanced immediately to executive committee presentation.',
        practicePrompt: 'Tell me about a time you made a contrarian strategic recommendation backed by quantitative unit economics.'
      },
      portfolioHighlight: 'Southeast Asia SaaS Market Entry Deck & 3-Year Unit Economics Model (Company X Product Case).',
      careerNarrativeBullet: 'Formulated Southeast Asia B2B SaaS market entry playbook for Company X, validating $6.9M addressable SOM and 3.12x LTV/CAC distributor model (Ranked top 3% by hiring committee).'
    }
  },
  {
    id: 'assess-pm-sea-gtm',
    jobId: 'app-company-x-prod-strat',
    jobTitle: 'Product Strategy Manager',
    company: 'Company X',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    role: 'Product Strategy Manager (Southeast Asia Expansion)',
    roleCategory: 'Product Manager',
    assessmentType: 'GTM Challenge',
    title: 'Tiered Enterprise Distributor GTM Playbook',
    deadline: '2026-09-18T17:00:00.000Z',
    stage: 'submitted',
    createdAt: '2026-09-03T09:00:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
    casePrompt: `Following up on the Market Entry case, detail the operational Go-To-Market execution plan for signing the first 25 regional enterprise accounts.
Specify:
1. Distributor incentive tiers (margin share vs SPIF).
2. Customer onboarding SLA to mitigate time-to-value friction.
3. Churn retention safeguards for annual renewals.`,
    caseContext: 'Follow-up second-round assessment for Company X candidate pipeline.',
    constraints: [
      'Maximum 20% distributor commission allowance',
      'Under 14 days time-to-first-value onboarding requirement'
    ],
    deliverablesExpected: [
      'GTM Distribution Playbook (5-page executive briefing)',
      'Distributor Partner Agreement Framework'
    ],
    submission: {
      id: 'sub-pm-gtm-1',
      submittedAt: '2026-09-05T10:30:00.000Z',
      version: 1,
      content: `GTM Distribution Playbook:
- Tier 1: 15% recurring margin for Gold Partners who commit to certified solutions architect staffing.
- Accelerated Onboarding: Automated workspace migration wizard cutting time-to-value from 18 days to 5 days.
- Retention: Co-marketing funds tied to quarterly NRR benchmarks exceeding 115%.`,
      url: 'https://notion.so/company-x/gtm-distributor-playbook-draft',
      attachments: [
        {
          id: 'att-gtm-1',
          name: 'Distributor_GTM_Playbook.pdf',
          size: '2.1 MB',
          type: 'Doc',
          url: 'https://storage.googleapis.com/career-os/sample-docs/gtm-playbook.pdf'
        }
      ]
    },
    skillsDemonstrated: [
      {
        skillName: 'Channel Strategy',
        level: 5,
        proofStatement: 'Designed tiered distributor incentive architecture aligning margin share with customer retention.'
      },
      {
        skillName: 'Customer Onboarding Optimization',
        level: 5,
        proofStatement: 'Streamlined enterprise time-to-value to under 5 days via automated workspace templates.'
      }
    ],
    lessonsLearned: 'Channel partners require dedicated localized sales enablement collateral; technical certifications must precede commercial quota rollout.',
    evidenceStrength: 5
  },

  // Example 2: UX Designer -> Design Challenge & Prototype Submission
  {
    id: 'assess-ux-design-challenge',
    jobId: 'job-ux-lead-designlab',
    jobTitle: 'Senior Product Designer',
    company: 'DesignLab & Co',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&auto=format&fit=crop&q=60',
    role: 'Senior Product Designer (Design Systems & Mobile)',
    roleCategory: 'UX Designer',
    assessmentType: 'Design Challenge',
    title: 'Cross-Platform Gestural Navigation & Design Token Hierarchy',
    deadline: '2026-08-20T17:00:00.000Z',
    stage: 'converted_to_evidence',
    createdAt: '2026-08-14T09:00:00.000Z',
    updatedAt: '2026-08-22T15:00:00.000Z',
    casePrompt: `Design a fluid, gesture-first navigation system for a pro-consumer creative tablet app.
Address ergonomic thumb zones, accessibility compliance (WCAG AAA), and build a semantic design token hierarchy supporting dark/light mode and high-contrast environments.`,
    caseContext: 'Hiring design challenge evaluating information architecture, interaction ergonomics, and scalable design system foundations.',
    constraints: [
      'Must work across 10-inch tablets down to 6-inch mobile screens',
      'Target sub-16ms touch latency feedback',
      'Full compliance with WCAG AAA touch target spacing (min 44px)'
    ],
    deliverablesExpected: [
      'Interactive Figma prototype with auto-layout and components',
      'Design Token Documentation (Color, Spacing, Typography)',
      'User Flow Diagram detailing edge cases and error states'
    ],
    submission: {
      id: 'sub-ux-1',
      submittedAt: '2026-08-19T18:00:00.000Z',
      version: 1,
      content: `Delivered end-to-end tokenized component architecture and interactive Figma prototype:
- Ergonomic radial dock anchored to lower corner thumb zones for one-handed operation.
- Tokenized palette mapped across 3 tiers (Global -> Semantic -> Component).
- Motion choreography: Spring-physics transitions with tactile haptic cues on state commit.`,
      url: 'https://www.figma.com/proto/designlab-challenge-gestural-system',
      attachments: [
        {
          id: 'att-ux-1',
          name: 'Gestural_Navigation_System.fig',
          size: '18.4 MB',
          type: 'Figma',
          url: 'https://figma.com/file/gestural-nav'
        },
        {
          id: 'att-ux-2',
          name: 'Design_Tokens_Spec.pdf',
          size: '4.2 MB',
          type: 'PDF',
          url: 'https://storage.googleapis.com/career-os/sample-docs/design-tokens.pdf'
        }
      ]
    },
    evaluation: {
      evaluatedAt: '2026-08-22T14:00:00.000Z',
      evaluatorName: 'Elena Rostova',
      evaluatorRole: 'Head of Design',
      score: '96/100 (Top Tier)',
      ratingTier: 'Exceptional',
      feedback: 'One of the best design challenge submissions we have ever reviewed. The token hierarchy is production-ready, and the ergonomics testing for left-handed users showed rare attention to detail. Offer extended.',
      result: 'offer',
      rubricPerformance: [
        { criterion: 'Ergonomic & Gestural UX', score: 20, maxScore: 20, comments: 'Thumb zone mapping was textbook perfection.' },
        { criterion: 'Design System & Token Scalability', score: 20, maxScore: 20, comments: 'Clean three-tier variable tokens.' },
        { criterion: 'Accessibility & Contrast (WCAG AAA)', score: 19, maxScore: 20, comments: 'Exceeded standard requirements.' },
        { criterion: 'Prototyping Fidelity & Micro-interactions', score: 19, maxScore: 20, comments: 'Smooth spring animations.' },
        { criterion: 'Documentation & Presentation', score: 18, maxScore: 20, comments: 'Comprehensive component library notes.' }
      ]
    },
    skillsDemonstrated: [
      {
        skillName: 'Design Systems',
        level: 6,
        proofStatement: 'Engineered 3-tier semantic design token hierarchy in Figma supporting seamless dark mode and accessibility variants.'
      },
      {
        skillName: 'Mobile UX & Interaction Design',
        level: 6,
        proofStatement: 'Architected radial gestural dock adhering to thumb zone ergonomics and sub-16ms visual response feedback.'
      },
      {
        skillName: 'Accessibility (WCAG AAA)',
        level: 6,
        proofStatement: 'Validated all tap targets >48px and color contrast ratios exceeding 7:1 across 4 display modes.'
      },
      {
        skillName: 'Interactive Prototyping',
        level: 6,
        proofStatement: 'Created high-fidelity Figma prototype using advanced variables, component properties, and physics transitions.'
      }
    ],
    lessonsLearned: 'Testing interactive components with actual hardware tablets rather than desktop viewports reveals subtle finger occlusion issues that change layout decisions.',
    whatWentWell: 'Comprehensive Figma variable token architecture blew the hiring team away and resulted in an immediate offer.',
    whatToImprove: 'Could provide automated JSON export scripts for direct import into iOS Swift / React Native codebases.',
    convertedEvidenceId: 'source-ev-assess-ux-designlab',
    convertedAt: '2026-08-22T16:00:00.000Z',
    evidenceStrength: 6,
    reusableOutputs: {
      profileStatement: 'Demonstrated mastery in mobile gestural ergonomics and production design tokens, evaluated by DesignLab leadership (Score: 96/100, Offer Extended).',
      skillIntelligenceProof: 'Validated Level 6 evidence for Design Systems, Mobile UX, and Interactive Prototyping backed by top-tier hiring assessment.',
      jobMatchBoost: 'Substantially elevates match score for Senior / Lead Product Design and Design System Architect roles.',
      interviewStory: {
        situation: 'DesignLab needed a senior product designer capable of rethinking navigation for their flagship tablet creative suite.',
        task: 'Deliver an accessible, gesture-first navigation system with scalable multi-tier design tokens within 6 days.',
        action: 'Conducted ergonomic thumb zone reachability studies, built a 3-tier semantic token hierarchy in Figma, and animated physics-based spring transitions.',
        result: 'Received a 96/100 score with an immediate job offer and praise for production-ready design tokens.',
        practicePrompt: 'Describe a design challenge where you balanced complex ergonomics with rigorous design system constraints.'
      },
      portfolioHighlight: 'Ergonomic Tablet Navigation & Tokenized Design System (DesignLab Hiring Case).',
      careerNarrativeBullet: 'Architected gestural navigation and 3-tier design token system for DesignLab creative tablet app, scoring 96/100 and securing lead designer offer.'
    }
  },
  {
    id: 'assess-ux-prototype-submission',
    jobId: 'job-ux-lead-designlab',
    jobTitle: 'Senior Product Designer',
    company: 'DesignLab & Co',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&auto=format&fit=crop&q=60',
    role: 'Senior Product Designer (Design Systems & Mobile)',
    roleCategory: 'UX Designer',
    assessmentType: 'Prototype Submission',
    title: 'Interactive Multi-Modal Component Sandbox Walkthrough',
    deadline: '2026-08-21T17:00:00.000Z',
    stage: 'converted_to_evidence',
    createdAt: '2026-08-18T10:00:00.000Z',
    updatedAt: '2026-08-22T15:30:00.000Z',
    casePrompt: 'Submit a live screen-recorded interactive walkthrough demonstrating keyboard shortcuts, screen-reader accessibility, and touch states.',
    submission: {
      id: 'sub-ux-proto-1',
      submittedAt: '2026-08-20T11:00:00.000Z',
      version: 1,
      content: 'Loom video presentation walking through micro-interactions, responsive flex layouts, and edge-case error handlings.',
      url: 'https://www.loom.com/share/designlab-prototype-walkthrough',
      attachments: [
        {
          id: 'att-proto-1',
          name: 'Prototype_Loom_Summary.pdf',
          size: '1.1 MB',
          type: 'Video',
          url: 'https://loom.com/share/designlab-walkthrough'
        }
      ]
    },
    evaluation: {
      evaluatedAt: '2026-08-22T14:30:00.000Z',
      evaluatorName: 'Elena Rostova',
      evaluatorRole: 'Head of Design',
      score: '95/100',
      ratingTier: 'Exceptional',
      feedback: 'Very thorough video presentation. Demonstrated deep empathy for accessibility and edge cases.',
      result: 'passed'
    },
    skillsDemonstrated: [
      {
        skillName: 'Design Communication',
        level: 6,
        proofStatement: 'Delivered crisp 5-minute Loom walkthrough explaining interaction rationale and accessibility trade-offs.'
      },
      {
        skillName: 'Accessible Prototyping',
        level: 6,
        proofStatement: 'Demonstrated screen-reader navigation and keyboard focus rings in high-fidelity prototype.'
      }
    ],
    lessonsLearned: 'Video walkthroughs prevent misinterpretations by interviewers who might test prototypes on unsupported browser configurations.',
    convertedEvidenceId: 'source-ev-assess-ux-proto',
    convertedAt: '2026-08-22T16:15:00.000Z',
    evidenceStrength: 6
  },

  // Example 3: SEO Specialist -> SEO Audit & Audit Report
  {
    id: 'assess-seo-audit-case',
    jobId: 'job-seo-lead-ecomm',
    jobTitle: 'Lead SEO Specialist',
    company: 'E-Commerce Corp',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67e557229b?w=100&auto=format&fit=crop&q=60',
    role: 'Lead Technical SEO Specialist',
    roleCategory: 'SEO Specialist',
    assessmentType: 'SEO Audit',
    title: 'Large-Scale Technical Crawl & Core Web Vitals Optimization (2.4M URLs)',
    deadline: '2026-07-15T17:00:00.000Z',
    stage: 'converted_to_evidence',
    createdAt: '2026-07-08T10:00:00.000Z',
    updatedAt: '2026-07-16T14:00:00.000Z',
    casePrompt: `E-Commerce Corp has 2.4 million product SKU URLs across 8 country locales.
Identify primary crawl budget bottlenecks, faceted navigation canonical loops, and Core Web Vitals (INP and LCP) degradation across PDPs.
Deliver prioritized remediation roadmap.`,
    caseContext: 'Technical SEO evaluation for high-traffic marketplace platform.',
    constraints: [
      'Must maintain indexation of high-converting long-tail keyword combinations',
      'No loss of organic revenue during faceted filter canonical restructuring'
    ],
    deliverablesExpected: [
      'Technical Crawl Audit Report (Screaming Frog / Log Analysis)',
      'Faceted Navigation Indexing Decision Tree',
      'Core Web Vitals INP/LCP Optimization Ticket Specifications'
    ],
    submission: {
      id: 'sub-seo-1',
      submittedAt: '2026-07-14T16:00:00.000Z',
      version: 1,
      content: `Audit Findings & Remediation Plan:
1. Crawl Waste: 62% of Googlebot requests wasted on multi-attribute filter permutations with 0 search volume. Implemented robots.txt directive and parameter handling in Cloudflare edge worker.
2. Canonical Fix: Standardized self-referencing canonicals on primary category pages, applying noindex to filters with >2 parameters.
3. INP Reduction: Diagnosed JavaScript main-thread lockup caused by third-party tracking scripts; deferred non-critical tags yielding 180ms INP improvement.`,
      url: 'https://docs.google.com/document/d/ecommerce-technical-seo-audit-report',
      attachments: [
        {
          id: 'att-seo-1',
          name: 'Ecommerce_2.4M_Technical_SEO_Audit.pdf',
          size: '5.6 MB',
          type: 'PDF',
          url: 'https://storage.googleapis.com/career-os/sample-docs/seo-audit.pdf'
        }
      ]
    },
    evaluation: {
      evaluatedAt: '2026-07-16T11:00:00.000Z',
      evaluatorName: 'Darren Price',
      evaluatorRole: 'VP of Growth & Acquisition',
      score: '92/100',
      ratingTier: 'Exceptional',
      feedback: 'Extremely detailed technical understanding. The edge-worker parameter handling solution showed true enterprise scale knowledge beyond routine SEO checklists.',
      result: 'passed'
    },
    skillsDemonstrated: [
      {
        skillName: 'Technical SEO & Crawl Budget',
        level: 6,
        proofStatement: 'Identified 62% crawl waste across 2.4M URLs and architected Cloudflare edge parameter handling.'
      },
      {
        skillName: 'Core Web Vitals Optimization',
        level: 6,
        proofStatement: 'Diagnosed PDP main-thread bottlenecks and documented 180ms INP reduction.'
      },
      {
        skillName: 'Information Architecture & Canonicalization',
        level: 6,
        proofStatement: 'Structured faceted navigation decision tree preserving organic long-tail search volume.'
      }
    ],
    lessonsLearned: 'When dealing with millions of faceted URLs, canonical tags alone are insufficient; robots.txt crawl directives or CDN edge blocking must be deployed to preserve bot budget.',
    convertedEvidenceId: 'source-ev-assess-seo-ecomm',
    convertedAt: '2026-07-16T15:00:00.000Z',
    evidenceStrength: 6,
    reusableOutputs: {
      profileStatement: 'Demonstrated enterprise technical SEO audit & crawl budget optimization on 2.4M URLs for E-Commerce Corp (Score: 92/100).',
      skillIntelligenceProof: 'Validated Level 6 evidence in Technical SEO, Crawl Budget Optimization, and Core Web Vitals.',
      jobMatchBoost: 'Directly validates capability for Lead / Principal SEO Specialist and Organic Growth roles.',
      interviewStory: {
        situation: 'E-Commerce Corp was suffering from severe crawl budget exhaustion across 2.4M e-commerce pages.',
        task: 'Conduct an in-depth technical audit identifying why high-value product pages were taking weeks to get indexed.',
        action: 'Analyzed server access logs, diagnosed 62% crawl waste on infinite faceted filter URLs, and implemented edge-layer parameter normalization.',
        result: 'Scored 92/100 from VP of Growth and advanced to final committee.',
        practicePrompt: 'How do you handle crawl budget optimization and canonicalization for multi-million URL platforms?'
      },
      portfolioHighlight: '2.4M URL Technical Crawl & Core Web Vitals Audit Report (E-Commerce Corp).',
      careerNarrativeBullet: 'Audited and restructured crawl architecture across 2.4M URLs for E-Commerce Corp, eliminating 62% bot waste and cutting PDP INP by 180ms.'
    }
  },

  // Example 4: Marketing Manager -> Growth Case & Strategy Deck
  {
    id: 'assess-growth-marketing-case',
    jobId: 'job-growth-lead-saas',
    jobTitle: 'Head of Growth Marketing',
    company: 'CloudScale SaaS',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=60',
    role: 'Growth Marketing Lead (PLG & Expansion)',
    roleCategory: 'Marketing Manager',
    assessmentType: 'Growth Case',
    title: 'PLG Self-Serve Funnel CAC Payback & Expansion Loop',
    deadline: '2026-06-25T17:00:00.000Z',
    stage: 'converted_to_evidence',
    createdAt: '2026-06-18T10:00:00.000Z',
    updatedAt: '2026-06-27T16:00:00.000Z',
    casePrompt: `CloudScale's self-serve freemium conversion rate dropped from 4.2% to 2.8% over the past two quarters while blended CAC increased by 35%.
Analyze user drop-off across the signup-to-activation funnel and model a virality/expansion loop that recovers CAC payback to under 9 months.`,
    caseContext: 'Senior Growth Marketing evaluation focusing on product-led growth metrics and unit economics.',
    submission: {
      id: 'sub-mkt-1',
      submittedAt: '2026-06-24T15:00:00.000Z',
      version: 1,
      content: `Growth Strategy Analysis:
1. Root Cause: Friction during team invite onboarding step causing 44% drop-off prior to reaching 'Aha' moment (creation of first shared board).
2. Frictionless Onboarding: Shifted from upfront mandatory team invites to single-player value discovery with in-app milestone triggers.
3. K-Factor Virality Loop: Introduced collaborative export link sharing, generating 0.28 organic invite loops per active seat and recovering CAC payback from 13.8 months to 7.9 months.`,
      url: 'https://docs.google.com/presentation/d/cloudscale-plg-growth-case-deck',
      attachments: [
        {
          id: 'att-mkt-1',
          name: 'PLG_Funnel_CAC_Payback_Model.xlsx',
          size: '1.8 MB',
          type: 'Spreadsheet',
          url: 'https://storage.googleapis.com/career-os/sample-sheets/growth-funnel.xlsx'
        }
      ]
    },
    evaluation: {
      evaluatedAt: '2026-06-27T14:00:00.000Z',
      evaluatorName: 'Sarah Jenkins',
      evaluatorRole: 'Chief Marketing Officer',
      score: '95/100',
      ratingTier: 'Exceptional',
      feedback: 'Candidate demonstrated exceptional mastery of PLG funnels. Rather than just proposing paid ad tweaks, they identified product onboarding friction and virality mechanics that fundamentally fixed the unit economics.',
      result: 'passed'
    },
    skillsDemonstrated: [
      {
        skillName: 'Product-Led Growth (PLG)',
        level: 6,
        proofStatement: 'Redesigned user onboarding flow recovering freemium-to-paid conversion and lowering payback to 7.9 months.'
      },
      {
        skillName: 'Funnel Optimization & Analytics',
        level: 6,
        proofStatement: 'Identified 44% drop-off friction at team invite step via cohort retention analytics.'
      },
      {
        skillName: 'Viral Loops & Expansion Marketing',
        level: 6,
        proofStatement: 'Constructed 0.28 K-factor organic collaborative sharing loop.'
      }
    ],
    lessonsLearned: 'Premature team invite requests destroy self-serve PLG funnels; users must experience individual utility before they are willing to invite colleagues.',
    convertedEvidenceId: 'source-ev-assess-growth-cloudscale',
    convertedAt: '2026-06-27T17:00:00.000Z',
    evidenceStrength: 6,
    reusableOutputs: {
      profileStatement: 'Demonstrated PLG funnel recovery and viral expansion loop modeling for CloudScale SaaS (Score: 95/100, Exceptional Tier).',
      skillIntelligenceProof: 'Validated Level 6 evidence in Product-Led Growth, Funnel Analytics, and CAC Payback Optimization.',
      jobMatchBoost: 'Fulfills core leadership competencies for Growth Marketing Manager and Head of PLG positions.',
      interviewStory: {
        situation: 'CloudScale SaaS experienced freemium conversion decay from 4.2% to 2.8% and rising acquisition costs.',
        task: 'Diagnose the funnel leakage and formulate a product-led growth turnaround strategy with under 9-month payback.',
        action: 'Pinpointed 44% drop-off at team invitation stage, restructured onboarding to single-player first, and engineered an export sharing viral loop.',
        result: 'Scored 95/100 with praise from the CMO and modeled 7.9-month CAC payback.',
        practicePrompt: 'Tell me about how you diagnose and turnaround a decaying self-serve conversion funnel.'
      },
      portfolioHighlight: 'PLG Funnel Breakdown & Virality Expansion Loop Model (CloudScale Growth Case).',
      careerNarrativeBullet: 'Redesigned CloudScale PLG onboarding and modeled collaboration viral loops, decreasing CAC payback from 13.8 to 7.9 months (Scored 95/100 by CMO).'
    }
  }
];

class JobAssessmentStore {
  private assessments: JobAssessment[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.assessments = JSON.parse(stored);
      } else {
        this.assessments = [...INITIAL_JOB_ASSESSMENTS];
        this.saveToStorage();
      }
    } catch (e) {
      console.error('Error loading job assessments:', e);
      this.assessments = [...INITIAL_JOB_ASSESSMENTS];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.assessments));
      window.dispatchEvent(new CustomEvent('career_os_assessments_updated'));
    } catch (e) {
      console.error('Error saving job assessments:', e);
    }
  }

  public getAssessments(): JobAssessment[] {
    return [...this.assessments];
  }

  public getAssessmentById(id: string): JobAssessment | undefined {
    return this.assessments.find(a => a.id === id);
  }

  public getAssessmentsByJob(jobId: string): JobAssessment[] {
    return this.assessments.filter(a => a.jobId === jobId);
  }

  public getAssessmentsByRoleCategory(category: RoleCategory): JobAssessment[] {
    return this.assessments.filter(a => a.roleCategory === category);
  }

  public saveAssessment(assessment: JobAssessment): JobAssessment {
    assessment.updatedAt = new Date().toISOString();
    const idx = this.assessments.findIndex(a => a.id === assessment.id);
    if (idx >= 0) {
      this.assessments[idx] = assessment;
    } else {
      this.assessments.unshift(assessment);
    }
    this.saveToStorage();
    return assessment;
  }

  public createAssessment(data: Partial<JobAssessment> & {
    jobTitle: string;
    company: string;
    role: string;
    roleCategory: RoleCategory;
    assessmentType: string;
    title: string;
    casePrompt: string;
  }): JobAssessment {
    const newAssessment: JobAssessment = {
      id: `assess-${Date.now()}`,
      jobId: data.jobId,
      jobTitle: data.jobTitle,
      company: data.company,
      companyLogo: data.companyLogo,
      role: data.role,
      roleCategory: data.roleCategory,
      assessmentType: data.assessmentType,
      title: data.title,
      deadline: data.deadline,
      stage: data.stage || 'prompt_received',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      casePrompt: data.casePrompt,
      caseContext: data.caseContext || '',
      constraints: data.constraints || [],
      deliverablesExpected: data.deliverablesExpected || [],
      exhibits: data.exhibits || [],
      submission: data.submission || {
        id: `sub-${Date.now()}`,
        version: 1,
        content: '',
        attachments: []
      },
      evaluation: data.evaluation,
      skillsDemonstrated: data.skillsDemonstrated || [],
      lessonsLearned: data.lessonsLearned || '',
      whatWentWell: data.whatWentWell,
      whatToImprove: data.whatToImprove,
      evidenceStrength: data.evidenceStrength || 5
    };

    return this.saveAssessment(newAssessment);
  }

  public deleteAssessment(id: string): boolean {
    const idx = this.assessments.findIndex(a => a.id === id);
    if (idx >= 0) {
      this.assessments.splice(idx, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * CORE ACTION: Convert Case to Reusable Career Evidence Item
   * Transitions an assessment from a standalone event into a durable Career OS evidence item
   * that automatically supports:
   * 1. Profile (Level 6 Capability Badge)
   * 2. Skill Intelligence (Verified proof for demonstrated skills)
   * 3. Job Matching (Strongly proven skill satisfaction)
   * 4. Interview Preparation (STAR Story & Case Interview practice blueprint)
   * 5. Portfolio (Verified Deliverable Showcase)
   * 6. Career Narrative (Executive Resume Bullet & Pitch)
   */
  public convertToEvidence(assessmentId: string): { assessment: JobAssessment; source: NormalizedSource } {
    const assessment = this.getAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error(`Assessment with ID ${assessmentId} not found`);
    }

    const hasEvaluationScore = Boolean(assessment.evaluation?.score);
    // Level 6: Validated by Hiring Committee / Evaluator, or Level 5: Demonstrated in rigorous case
    const evidenceStrength = hasEvaluationScore ? 6 : 5;
    const sourceId = assessment.convertedEvidenceId || `source-ev-${assessment.id}`;

    // Map assessmentType to taxonomy source type
    const normalizedSubtype = assessment.assessmentType.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    
    // Build canonical demonstrated skills list
    const confirmedSkills = assessment.skillsDemonstrated.map(s => s.skillName);
    if (confirmedSkills.length === 0 && assessment.roleCategory) {
      // Fallback sensible demonstrated skills if none explicitly listed
      confirmedSkills.push('Problem Solving', 'Structured Thinking');
    }

    // Build evidence statements
    const evidenceStatements = [
      `Evaluated in ${assessment.company} hiring assessment for ${assessment.role} (${assessment.assessmentType}). Outcome: ${assessment.evaluation?.result?.toUpperCase() || 'COMPLETED'} with score ${assessment.evaluation?.score || 'High Distinction'}.`,
      ...assessment.skillsDemonstrated.map(s => s.proofStatement)
    ];

    // Compute the 6 Reusable Outputs
    const reusableOutputs = {
      profileStatement: `Demonstrated ${assessment.assessmentType} capability for ${assessment.role} at ${assessment.company} (Score: ${assessment.evaluation?.score || 'Validated'}).`,
      skillIntelligenceProof: `Verified Level ${evidenceStrength} proof for [${confirmedSkills.slice(0, 3).join(', ')}] based on hiring case evaluation at ${assessment.company}.`,
      jobMatchBoost: `Provides validated Level ${evidenceStrength} evidence covering core competencies required for ${assessment.roleCategory} roles.`,
      interviewStory: {
        situation: `During the ${assessment.company} ${assessment.assessmentType} evaluation for the ${assessment.role} position:`,
        task: assessment.casePrompt.slice(0, 180) + '...',
        action: assessment.submission.content.slice(0, 240) + '...',
        result: `Achieved evaluation outcome: ${assessment.evaluation?.result || 'Passed'} with score ${assessment.evaluation?.score || 'Top Tier'}. Feedback: "${assessment.evaluation?.feedback?.slice(0, 120) || 'Strong performance'}"`,
        practicePrompt: `Tell me about a time you solved the ${assessment.title} challenge for ${assessment.company}.`
      },
      portfolioHighlight: `${assessment.title} (${assessment.company} ${assessment.assessmentType} Deliverable)`,
      careerNarrativeBullet: `Developed ${assessment.title} for ${assessment.company}, demonstrating ${confirmedSkills.slice(0, 3).join(', ')} (Evaluation Result: ${assessment.evaluation?.result || 'Passed'}, Score: ${assessment.evaluation?.score || 'Top Tier'}).`
    };

    // Construct NormalizedSource for SourceStore
    const normalizedSource: NormalizedSource = {
      id: sourceId,
      title: `${assessment.company} ${assessment.assessmentType}: ${assessment.title}`,
      sourceFamily: 'assessment',
      sourceType: normalizedSubtype,
      description: `${assessment.assessmentType} solved for ${assessment.company} (${assessment.role}). ${assessment.casePrompt.slice(0, 200)}...`,
      url: assessment.submission.url,
      organization: assessment.company,
      provider: assessment.company,
      dateStarted: assessment.createdAt.split('T')[0],
      dateCompleted: assessment.evaluation?.evaluatedAt?.split('T')[0] || assessment.submission.submittedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      status: assessment.evaluation?.result === 'rejected' ? 'failed' : 'passed',
      language: 'en',
      languages: ['en'],
      tags: [
        'hiring-case',
        assessment.roleCategory.toLowerCase().replace(/\s+/g, '-'),
        assessment.company.toLowerCase().replace(/\s+/g, '-'),
        assessment.assessmentType.toLowerCase().replace(/\s+/g, '-')
      ],
      notes: assessment.lessonsLearned,
      attachments: assessment.submission.attachments.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        fileType: a.type,
        size: a.size || '1.2 MB',
        uploadedAt: new Date().toISOString(),
        url: a.url
      })),
      createdAt: assessment.createdAt,
      updatedAt: new Date().toISOString(),
      evidenceStrength,
      inferredKnowledge: [assessment.roleCategory, assessment.assessmentType],
      confirmedKnowledge: [assessment.roleCategory, assessment.assessmentType],
      inferredSkills: confirmedSkills,
      confirmedSkills,
      competencies: confirmedSkills.slice(0, 3),
      domains: [assessment.roleCategory],
      methods: ['Case Evaluation', 'Hypothesis-Driven Problem Solving', 'Deliverable Synthesis'],
      frameworks: ['Executive Problem Solving'],
      evidenceStatements,
      careerRelevance: [assessment.roleCategory, assessment.role],
      relatedJobIds: assessment.jobId ? [assessment.jobId] : [],
      assessmentData: {
        assessmentType: assessment.assessmentType,
        score: assessment.evaluation?.score,
        result: assessment.evaluation?.result === 'offer' || assessment.evaluation?.result === 'passed' ? 'passed' : 'pending',
        evaluationDate: assessment.evaluation?.evaluatedAt || new Date().toISOString(),
        relatedJobId: assessment.jobId,
        relatedJobTitle: assessment.jobTitle,
        reviewerFeedback: assessment.evaluation?.feedback,
        submissionUrl: assessment.submission.url,
        skillsDemonstrated: confirmedSkills
      },
      metadata: {
        casePrompt: assessment.casePrompt,
        company: assessment.company,
        role: assessment.role,
        deadline: assessment.deadline,
        submissionContent: assessment.submission.content,
        score: assessment.evaluation?.score,
        evaluatorFeedback: assessment.evaluation?.feedback,
        result: assessment.evaluation?.result,
        skillsDemonstrated: assessment.skillsDemonstrated,
        lessonsLearned: assessment.lessonsLearned,
        whatWentWell: assessment.whatWentWell,
        whatToImprove: assessment.whatToImprove,
        reusableOutputs
      }
    };

    // Save into SourceStore
    const existingSource = sourceStore.getSourceById(sourceId);
    if (existingSource) {
      sourceStore.updateSource(sourceId, normalizedSource);
    } else {
      sourceStore.addSource(normalizedSource);
    }

    // Update Assessment record
    assessment.stage = 'converted_to_evidence';
    assessment.convertedEvidenceId = sourceId;
    assessment.convertedAt = new Date().toISOString();
    assessment.evidenceStrength = evidenceStrength;
    assessment.reusableOutputs = reusableOutputs;
    this.saveAssessment(assessment);

    // Broadcast conversion event
    window.dispatchEvent(new CustomEvent('career_os_assessment_converted', { 
      detail: { assessment, source: normalizedSource } 
    }));

    return { assessment, source: normalizedSource };
  }
}

export const jobAssessmentStore = new JobAssessmentStore();
