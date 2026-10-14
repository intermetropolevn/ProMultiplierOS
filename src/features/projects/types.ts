export type ProjectStatus = 'active' | 'completed' | 'in_review' | 'archived';

export type ProjectSectionType =
  | 'business_context'
  | 'problem'
  | 'user_problem'
  | 'kpi'
  | 'root_cause'
  | 'research'
  | 'options'
  | 'tradeoffs'
  | 'decision'
  | 'roadmap'
  | 'result'
  | 'lessons_learned'
  | 'custom';

export interface ProjectSection {
  id: string;
  type: ProjectSectionType;
  title: string;
  content: string; // Structured markdown rich text
  order: number;
}

export interface CareerProject {
  id: string;
  title: string;
  tagline: string;
  role: string;
  company: string;
  domain: string;
  status: ProjectStatus;
  timeframe: string;
  techStack: string[];
  metrics: string[];
  sections: ProjectSection[];
  workingNotes: string;
  evidenceNotes: string;
  linkedStoryIds: string[];
  linkedBlueprintIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SuggestedSectionPreset {
  type: ProjectSectionType;
  label: string;
  defaultTitle: string;
  description: string;
  placeholder: string;
}

export const SUGGESTED_SECTION_PRESETS: SuggestedSectionPreset[] = [
  {
    type: 'business_context',
    label: 'Business Context',
    defaultTitle: 'Business Context & Objective',
    description: 'Market landscape, business goals, and organizational setup.',
    placeholder: 'Describe the macro business environment, company priorities, and strategic reasons this project was funded...'
  },
  {
    type: 'problem',
    label: 'Problem',
    defaultTitle: 'Core Problem Statement',
    description: 'Systemic breakdown, bottlenecks, or critical friction points.',
    placeholder: 'What was broken or failing? What were the quantifiable pains or risks if left unaddressed?...'
  },
  {
    type: 'user_problem',
    label: 'User Problem',
    defaultTitle: 'User & Customer Impact',
    description: 'How real users and customers suffered from the existing issue.',
    placeholder: 'How did customers experience this problem? What was their emotional or operational friction?...'
  },
  {
    type: 'kpi',
    label: 'KPI & Goals',
    defaultTitle: 'Target KPIs & North Star Metrics',
    description: 'Primary and counter-guardrail metrics used to measure success.',
    placeholder: 'List target metrics (e.g. latency, conversion, revenue, error budget, adoption rate)...'
  },
  {
    type: 'root_cause',
    label: 'Root Cause',
    defaultTitle: 'Root Cause Analysis',
    description: 'Technical, architectural, or organizational origins of the issue.',
    placeholder: 'Why did this problem exist originally? Technical debt, obsolete assumptions, or uncoordinated scale?...'
  },
  {
    type: 'research',
    label: 'Research',
    defaultTitle: 'Research, Telemetry & Diagnostics',
    description: 'User interviews, query profiling, benchmarks, or competitive audit.',
    placeholder: 'What telemetry, customer interviews, load testing, or market benchmarks did you collect?...'
  },
  {
    type: 'options',
    label: 'Options Evaluated',
    defaultTitle: 'Architecture / Solution Options',
    description: 'Comparative analysis of evaluated alternatives.',
    placeholder: 'Option A vs Option B vs Option C: Outline the candidates evaluated before picking the winner...'
  },
  {
    type: 'tradeoffs',
    label: 'Trade-offs',
    defaultTitle: 'Strategic & Architectural Trade-offs',
    description: 'Deliberate compromises made (speed vs perfection, cost vs latency).',
    placeholder: 'What did you willingly sacrifice? Cost, engineering time, complexity, or short-term flexibility?...'
  },
  {
    type: 'decision',
    label: 'Decision',
    defaultTitle: 'Decision & Technical Strategy',
    description: 'Final architectural direction and consensus building.',
    placeholder: 'What was the decisive path forward? How did you align the team, stakeholders, and leadership?...'
  },
  {
    type: 'roadmap',
    label: 'Roadmap',
    defaultTitle: 'Execution Roadmap & Phases',
    description: 'Milestones, phased rollouts, dark launches, and feature flagging.',
    placeholder: 'Phase 1: Proof of concept, Phase 2: Dual-run shadow traffic, Phase 3: 100% production cutover...'
  },
  {
    type: 'result',
    label: 'Result & Impact',
    defaultTitle: 'Measurable Outcomes & Business Impact',
    description: 'Empirical ROI, performance gains, and bottom-line impact.',
    placeholder: 'List quantitative metrics achieved, verified production numbers, and financial/efficiency savings...'
  },
  {
    type: 'lessons_learned',
    label: 'Lessons Learned',
    defaultTitle: 'Lessons Learned & Retrospective',
    description: 'What worked, what failed, and what you would do differently today.',
    placeholder: 'If starting this project again from scratch, what architectural or team decisions would you adjust?...'
  }
];
