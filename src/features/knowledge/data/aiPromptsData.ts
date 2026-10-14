import { 
  AIPromptTemplate, 
  ProductLifecycleStage, 
  PromptPurpose, 
  WorkflowPatternType,
  ModelCapabilityProfile 
} from '../types/knowledgeTaxonomy';

const CUSTOM_PROMPTS_KEY = 'career_os_custom_ai_prompts_v1';

export const AI_RECOMMENDED_PROMPTS: AIPromptTemplate[] = [
  {
    id: 'prompt-prd-first-principles',
    title: 'PRD Deconstruction & First-Principles Trade-off Analyzer',
    lifecycleStage: 'Definition',
    purposes: ['Multi-turn Reasoning', 'Analysis', 'Critique', 'Structured extraction'],
    workflowPattern: 'Context Ingestion → Deconstruction → Devil\'s Advocate → Structured Output',
    modelProfile: {
      recommendedModel: 'Gemini 1.5 Pro (2M Context)',
      reasonForModel: 'Excels at multi-document PRD context digestion, spotting hidden assumption leaps, and generating comprehensive structured JSON schemas.',
      tokenContextTarget: 'Large (32K-128K)',
      modality: 'Text-only'
    },
    summary: 'Ingests complex product specifications, challenges unverified business assumptions, stress-tests edge-case states, and synthesizes an executive decision matrix.',
    templateContent: `You are an elite Staff Product Manager and Principal Systems Architect.
Analyze the following Product Requirement Document (PRD) using the 4-stage reasoning protocol:

## STAGE 1: CONTEXT INGESTION & SCOPE EXTRACTION
Extract:
- Primary Customer Job-To-Be-Done (JTBD)
- Success Metrics & Guardrail Metrics (e.g. Conversion vs P99 Latency)
- Critical Non-Goals / Explicit Out-of-Scope boundaries

## STAGE 2: FIRST-PRINCIPLES DECONSTRUCTION
Break down the proposal into its absolute fundamental assumptions:
1. What user behavioral hypotheses must hold true for this feature to succeed?
2. What distributed systems constraints (CAP theorem, storage latency, third-party SLA) are implicitly assumed?

## STAGE 3: DEVIL'S ADVOCATE & FAILURE MODE STRESS TEST
Generate 3 realistic nightmare failure scenarios:
- The Scalability Bottleneck: What breaks at 100x traffic?
- The Malicious / Abusive Actor: How could this feature be exploited?
- The Cannibalization Risk: How does this detract from other product lines?

## STAGE 4: STRUCTURED OUTPUT & GO/NO-GO RUBRIC
Provide a concise executive synthesis table:
| Dimension | Current Score (1-5) | Critical Risk | Recommended Mitigation |
| Tech Feasibility | ... | ... | ... |
| User Value | ... | ... | ... |
| Business Viability | ... | ... | ... |

PRD CONTEXT:
{{prd_text}}`,
    exampleVariables: [
      {
        variableName: 'prd_text',
        description: 'Raw product specification or feature RFC text',
        placeholder: 'Paste the draft PRD, feature summary, or API contract here...'
      }
    ],
    suggestedInputArtifact: 'Product Requirement Document (PRD), Feature Spec, or Notion RFC',
    expectedOutputFormat: '4-Stage Markdown Report with executive risk matrix',
    applicableRoles: ['Product Management', 'Software Engineering', 'Business Analysis & Strategy'],
    tags: ['prd', 'product-strategy', 'architecture', 'first-principles', 'risk-analysis'],
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'prompt-distributed-systems-audit',
    title: 'Distributed Architecture & Failure Mode Resilience Auditor',
    lifecycleStage: 'Build',
    purposes: ['Coding', 'Analysis', 'Multi-turn Reasoning', 'Critique'],
    workflowPattern: 'Code Architecture Review → Security Audit → Edge-Case Generation',
    modelProfile: {
      recommendedModel: 'Gemini Thinking / Deep Reasoning',
      reasonForModel: 'Requires rigorous step-by-step verification of race conditions, network split-brain scenarios, and atomic transaction locks.',
      tokenContextTarget: 'Medium (8K-32K)',
      modality: 'Code & Structured JSON'
    },
    summary: 'Audits distributed service architectures, database migration schemas, and API contracts for idempotency leaks, deadlock hazards, and cascading failures.',
    templateContent: `You are a Principal Infrastructure Architect specializing in high-throughput distributed systems.
Review the following technical architecture specification, database schema, or code snippet:

1. IDEMPOTENCY AUDIT:
- Are mutative endpoints protected by atomic distributed locks and database-level unique constraints?
- What happens if the network drops after the write occurs but before the HTTP 200 response is received?

2. CONCURRENCY & ISOLATION RISKS:
- What PostgreSQL / MySQL transaction isolation level is assumed (Read Committed vs Repeatable Read vs Serializable)?
- Are there opportunities for phantom reads, deadlocks, or row lock contention during bulk updates?

3. CIRCUIT BREAKER & ASYNC RESILIENCE:
- If downstream dependency {{dependency_name}} experiences a 5,000ms latency spike, how does the caller avoid exhausting connection pools?
- Is there an explicit Dead Letter Queue (DLQ) strategy for poison pill messages?

4. RECOMMENDED ARCHITECTURAL PATCH:
Provide the concrete code or SQL patch to harden this implementation.

SPECIFICATION CODE / SCHEMA:
{{code_or_schema}}`,
    exampleVariables: [
      {
        variableName: 'dependency_name',
        description: 'Name of the critical third-party or internal dependency',
        placeholder: 'e.g. Stripe Payment Gateway / Redis Cluster / Auth0'
      },
      {
        variableName: 'code_or_schema',
        description: 'SQL schema, TypeScript backend handler, or architecture text',
        placeholder: 'Paste your service code, SQL migration, or Kafka consumer logic...'
      }
    ],
    suggestedInputArtifact: 'Backend controller, DB schema script, or system architecture document',
    expectedOutputFormat: 'Technical audit report with prioritized vulnerability patches',
    applicableRoles: ['Software Engineering', 'DevOps & Cloud', 'Security & Systems'],
    tags: ['distributed-systems', 'idempotency', 'sql', 'concurrency', 'resilience'],
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z'
  },
  {
    id: 'prompt-discovery-customer-interview-synthesis',
    title: 'Qualitative User Research & Unmet Needs Synthesizer',
    lifecycleStage: 'Discovery',
    purposes: ['Research', 'Synthesis', 'Long-context', 'Analysis'],
    workflowPattern: 'Context Ingestion → Deconstruction → Devil\'s Advocate → Structured Output',
    modelProfile: {
      recommendedModel: 'Gemini 1.5 Pro (2M Context)',
      reasonForModel: 'Effortlessly digests multiple raw 45-minute user interview transcripts simultaneously to cluster latent behavioral patterns without hallucination.',
      tokenContextTarget: 'Massive (128K-2M)',
      modality: 'Text-only'
    },
    summary: 'Transforms raw customer interview transcripts into actionable behavioral personas, JTBD opportunity scores, and quote-backed pain points.',
    templateContent: `You are a Lead User Researcher and Staff Product Strategist.
Read through the attached interview transcripts for target segment: {{target_segment}}.

Perform a rigorous thematic synthesis:

1. JOBS-TO-BE-DONE (JTBD) HIERARCHY:
- Functional Job: What task is the user literally trying to accomplish?
- Emotional Job: How does the user want to feel during and after the task?
- Social Job: How does the user want to be perceived by their peers or manager?

2. PAIN POINTS & WORKAROUND HACKS:
List the top 4 frustrating bottlenecks mentioned. For each bottleneck:
- Extract the verbatim quote demonstrating emotional friction.
- Describe the current "duct-tape" workaround the user currently relies on.

3. OPPORTUNITY SCORING MATRIX:
Rate each identified unmet need:
- Importance (1-10)
- Current Satisfaction with Existing Solutions (1-10)
- Opportunity Score = Importance + Max(Importance - Satisfaction, 0)

TRANSCRIPTS:
{{transcripts}}`,
    exampleVariables: [
      {
        variableName: 'target_segment',
        description: 'Customer persona or user cohort being analyzed',
        placeholder: 'e.g. B2B Enterprise IT Admins / Freelance Designers'
      },
      {
        variableName: 'transcripts',
        description: 'Raw customer interview transcript text or interview notes',
        placeholder: 'Paste 1 or more interview transcripts here...'
      }
    ],
    suggestedInputArtifact: 'Raw customer interview transcripts, audio transcriptions, or customer support tickets',
    expectedOutputFormat: 'Opportunity matrix with verbatim quote citations and JTBD scoring',
    applicableRoles: ['Product Management', 'UI/UX & Product Design', 'Business Analysis & Strategy'],
    tags: ['user-research', 'jtbd', 'discovery', 'transcripts', 'customer-empathy'],
    createdAt: '2026-08-25T00:00:00.000Z',
    updatedAt: '2026-09-04T00:00:00.000Z'
  },
  {
    id: 'prompt-growth-loop-teardown',
    title: 'Compounding Growth Loop & Retention Cohort Modeler',
    lifecycleStage: 'Growth',
    purposes: ['Analysis', 'Planning', 'Synthesis', 'Multi-turn Reasoning'],
    workflowPattern: 'First-Principles Decomposition → Constraint Relaxation → Synthesis',
    modelProfile: {
      recommendedModel: 'Gemini 1.5 Flash (Fast Execution)',
      reasonForModel: 'Fast iterative mathematical modeling and growth funnel simulation loops.',
      tokenContextTarget: 'Medium (8K-32K)',
      modality: 'Code & Structured JSON'
    },
    summary: 'Deconstructs linear marketing funnels into compounding viral, paid, content, or product-led growth loops with sensitivity formulas.',
    templateContent: `You are an Executive Growth Advisor from Reforge.
Analyze the following product monetization and acquisition model: {{product_name}} (Domain: {{domain}}).

1. DECONSTRUCT COMPOUNDING GROWTH LOOPS:
Identify which primary loop archetype powers this business:
- Viral Product Loop (User invites collaborator -> Collaborator signs up)
- Content / SEO Loop (User creates public artifact -> Google indexes -> Visitor signs up)
- Paid CAC/LTV Loop (Revenue generated -> Reinvested into customer acquisition)

2. IDENTIFY THE TIGHTEST BOTTLENECK IN THE LOOP:
At which transition step is the loop decay factor highest?
- Input Velocity vs Output Conversion
- Time-to-Value (TTV) Friction

3. SENSITIVITY FORMULA & SIMULATION:
Provide the step-by-step mathematical loop formula and identify the single highest-leverage lever to test in the next 30-day growth sprint.

PRODUCT CONTEXT:
{{product_context}}`,
    exampleVariables: [
      {
        variableName: 'product_name',
        description: 'Name of the application or product',
        placeholder: 'e.g. Figma / Linear / Notion / Stripe'
      },
      {
        variableName: 'domain',
        description: 'Industry domain',
        placeholder: 'e.g. Enterprise SaaS / POD E-Commerce'
      },
      {
        variableName: 'product_context',
        description: 'Current metrics, pricing tiers, and acquisition channels',
        placeholder: 'Provide MAU, churn rate, referral flow, and conversion numbers...'
      }
    ],
    suggestedInputArtifact: 'Growth dashboard export, analytics funnel report, or pitch deck',
    expectedOutputFormat: 'Compounding loop model with step-by-step sensitivity equations',
    applicableRoles: ['Product Management', 'Growth & Product Marketing', 'Data Analytics & BI'],
    tags: ['growth-loops', 'reforge', 'retention', 'virality', 'cac-ltv'],
    createdAt: '2026-08-28T00:00:00.000Z',
    updatedAt: '2026-09-05T00:00:00.000Z'
  },
  {
    id: 'prompt-incident-postmortem-generator',
    title: 'P1 Blameless Postmortem & Root Cause (5-Whys) Generator',
    lifecycleStage: 'Maintenance',
    purposes: ['Analysis', 'Synthesis', 'Structured extraction', 'Critique'],
    workflowPattern: 'Context Ingestion → Deconstruction → Devil\'s Advocate → Structured Output',
    modelProfile: {
      recommendedModel: 'Gemini 1.5 Pro (2M Context)',
      reasonForModel: 'Integrates complex timeline Slack logs, Datadog alerts, and commit diffs into a clean, blameless executive postmortem document.',
      tokenContextTarget: 'Large (32K-128K)',
      modality: 'Text-only'
    },
    summary: 'Translates chaotic incident Slack channels and monitoring metrics into an industry-standard blameless postmortem with 5-Whys analysis and preventive action items.',
    templateContent: `You are a Principal Site Reliability Engineer (SRE) and Incident Commander.
Synthesize the provided raw incident notes into an executive Blameless Postmortem:

1. EXECUTIVE SUMMARY:
- Incident Title: P1 Outage: {{incident_title}}
- Date & Duration: Time to Detect (TTD) and Time to Recover (TTR)
- Customer & Financial Impact: Downtime SLA impact, affected users

2. DETAILED TIMELINE (UTC):
Chronological bulleted sequence from initial bad deployment / trigger through detection, triage, mitigation, and all-clear.

3. 5-WHYS ROOT CAUSE ANALYSIS:
Drill down from surface symptom to the systemic organizational and architectural vulnerabilities:
- Why 1: (Immediate trigger)
- Why 2: (Why did the trigger bypass defenses?)
- Why 3: (Why was testing insufficient?)
- Why 4: (Why was architectural redundancy missing?)
- Why 5: (Root systemic organizational reason)

4. PREVENTATIVE ACTION ITEMS (SMART):
| ID | Action Item | Type (Prevent/Detect/Mitigate) | Owner Role | Priority (P0-P2) |
| A-01 | ... | Prevent | ... | P0 |

RAW INCIDENT NOTES & LOGS:
{{raw_notes}}`,
    exampleVariables: [
      {
        variableName: 'incident_title',
        description: 'Short name for the outage',
        placeholder: 'e.g. EU Region Database Connection Pool Starvation'
      },
      {
        variableName: 'raw_notes',
        description: 'Slack channel exports, PagerDuty alerts, or developer notes',
        placeholder: 'Paste timeline messages, alerts, and commit SHAs...'
      }
    ],
    suggestedInputArtifact: 'Slack incident war-room export, Datadog dashboard screenshots, PagerDuty log',
    expectedOutputFormat: 'Blameless Postmortem Markdown Document',
    applicableRoles: ['DevOps & Cloud', 'Software Engineering', 'Program & Project Management'],
    tags: ['sre', 'postmortem', 'incident-response', '5-whys', 'blameless'],
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-06T00:00:00.000Z'
  }
];

export class AIPromptsStore {
  static getCustomPrompts(): AIPromptTemplate[] {
    try {
      const stored = localStorage.getItem(CUSTOM_PROMPTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load custom AI prompts from localStorage:', e);
    }
    return [];
  }

  static saveCustomPrompt(prompt: Omit<AIPromptTemplate, 'id' | 'isCustom' | 'createdAt' | 'updatedAt'>): AIPromptTemplate {
    const existing = this.getCustomPrompts();
    const newPrompt: AIPromptTemplate = {
      ...prompt,
      id: `custom-prompt-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newPrompt, ...existing];
    try {
      localStorage.setItem(CUSTOM_PROMPTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist custom prompt:', e);
    }
    return newPrompt;
  }

  static deleteCustomPrompt(id: string): boolean {
    const existing = this.getCustomPrompts();
    const filtered = existing.filter(p => p.id !== id);
    if (filtered.length !== existing.length) {
      try {
        localStorage.setItem(CUSTOM_PROMPTS_KEY, JSON.stringify(filtered));
        return true;
      } catch (e) {
        console.error('Failed to delete custom prompt:', e);
      }
    }
    return false;
  }

  static getAllPrompts(): AIPromptTemplate[] {
    const custom = this.getCustomPrompts();
    return [...custom, ...AI_RECOMMENDED_PROMPTS];
  }
}
