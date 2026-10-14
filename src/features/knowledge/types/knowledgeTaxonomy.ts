import { RoleCategory, SectorDomain } from '../../../types';

// =========================================================================
// 1. GLOBAL KNOWLEDGE LIBRARY PILLARS
// =========================================================================

export type KnowledgePillarId = 
  | 'all'
  | 'domain_market_intelligence'
  | 'standards_certifications'
  | 'playbooks_frameworks'
  | 'global_voices_publications';

export interface KnowledgePillarConfig {
  id: KnowledgePillarId;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
  sourceFamiliesIncluded: string[];
}

export const KNOWLEDGE_PILLARS: KnowledgePillarConfig[] = [
  {
    id: 'all',
    label: 'All Sources',
    shortLabel: 'All',
    description: 'Complete cross-disciplinary library of verified career knowledge, sources, and evidence.',
    iconName: 'Layers',
    sourceFamiliesIncluded: ['learn', 'knowledge', 'credential', 'assessment', 'playbook', 'publication', 'experience', 'project', 'artifact', 'content'],
  },
  {
    id: 'domain_market_intelligence',
    label: 'Domain & Market Intelligence',
    shortLabel: 'Intelligence',
    description: 'Deep market analysis, sector reports, foundational literature, courses, and technical standards (Combines Learn + Knowledge).',
    iconName: 'TrendingUp',
    sourceFamiliesIncluded: ['learn', 'knowledge'],
  },
  {
    id: 'standards_certifications',
    label: 'Standards & Certifications',
    shortLabel: 'Standards & Certs',
    description: 'Accredited professional certifications, industry qualifications, and verified skill assessments (Combines Credentials + Assessments).',
    iconName: 'Award',
    sourceFamiliesIncluded: ['credential', 'assessment'],
  },
  {
    id: 'playbooks_frameworks',
    label: 'Playbooks & Frameworks',
    shortLabel: 'Playbooks',
    description: 'Mental models, professional playbooks, operational frameworks, and structured engineering/product methodologies.',
    iconName: 'GitBranch',
    sourceFamiliesIncluded: ['playbook', 'framework'],
  },
  {
    id: 'global_voices_publications',
    label: 'Global Voices & Publications',
    shortLabel: 'Global Voices',
    description: 'Trusted external perspectives, expert essays, engineering techblogs, and top analytical publications (Substack, Medium, LinkedIn, Industry Blogs).',
    iconName: 'Radio',
    sourceFamiliesIncluded: ['publication', 'voice'],
  },
];

// =========================================================================
// 2. ORG MODELS & FIT
// =========================================================================

export type OrgModelType = 
  | 'functional'
  | 'product_squad'
  | 'matrix'
  | 'squad_tribe_spotify'
  | 'cross_functional_pod'
  | 'startup_pod';

export interface ReportingStructure {
  role: string;
  reportsTo: string;
  primaryCollaborators: string[];
  cadence: string;
}

export interface DecisionDependency {
  decisionType: string;
  ownerRole: string;
  approverRole: string;
  consultedRoles: string[];
  escalationPath: string;
}

export interface RaciMatrixEntry {
  activity: string;
  responsible: string; // The doer
  accountable: string; // The buck stops here
  consulted: string[]; // Two-way communication
  informed: string[];  // One-way heads-up
}

export interface OrgModelBlueprint {
  id: string;
  type: OrgModelType;
  title: string;
  headline: string;
  bestFitStage: string;
  corePhilosophy: string;
  advantages: string[];
  frictionPoints: string[];
  applicableRoles: (RoleCategory | string)[];
  topologyBreakdown: {
    unitName: string;
    description: string;
    composition: string;
    autonomyLevel: 'High' | 'Medium' | 'Low';
  }[];
  reportingStructure: ReportingStructure[];
  decisionDependencies: DecisionDependency[];
  raciMatrix: RaciMatrixEntry[];
  roleFitChecklist: {
    role: string;
    whereItFits: string;
    keyOwnership: string;
    frictionWarning: string;
  }[];
}

// =========================================================================
// 3. SYSTEM WORKFLOWS & MICRO DATASETS
// =========================================================================

export interface OperationalMetric {
  name: string;
  value: string;
  benchmark: string;
  unit: string;
  health: 'optimal' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'degrading';
}

export interface MicroFunnelStep {
  stepIndex: number;
  label: string;
  throughput: string;
  conversionRate: string;
  dropOffRate: string;
  latencyP95: string;
  errorRate: string;
  failureMode: string;
}

export interface MicroDataset {
  serviceName: string;
  subsystemContext: string;
  sampleTimeframe: string;
  overallThroughput: string;
  errorRatePercent: number;
  latencyP50: string;
  latencyP95: string;
  latencyP99: string;
  metrics: OperationalMetric[];
  funnelSteps: MicroFunnelStep[];
}

export interface DetailedWorkflowItem {
  id: string;
  title: string;
  codeName: string; // e.g., 'SOR-01', 'IDEMPOTENCY-V2', 'DLQ-RETRY', 'MES-SCAN-04'
  category: RoleCategory | string;
  domain: SectorDomain | string;
  summary: string;
  context: string;
  architectureType: string;
  estimatedDuration: string;
  frequency: string;
  realWorldImpact: string;
  inputs: string[];
  outputs: string[];
  dependencies: string[];
  systemsAndComponents: string[];
  failureModesAndRecovery: {
    failureMode: string;
    detectionSignal: string;
    mitigationStrategy: string;
  }[];
  steps: {
    stepNumber: number;
    title: string;
    phase: string;
    keyActions: string[];
    toolsUsed: string[];
    deliverables: string[];
    commonPitfalls: string[];
  }[];
  microDataset?: MicroDataset;
}

// =========================================================================
// 4. AI PROMPTS & REASONING PATTERNS
// =========================================================================

export type ProductLifecycleStage =
  | 'Discovery'
  | 'Research'
  | 'Definition'
  | 'Design'
  | 'Build'
  | 'Launch'
  | 'Growth'
  | 'Optimization'
  | 'Maintenance';

export type PromptPurpose =
  | 'Multi-turn Reasoning'
  | 'Long-context'
  | 'Multimodal'
  | 'Coding'
  | 'Analysis'
  | 'Research'
  | 'Synthesis'
  | 'Critique'
  | 'Structured extraction'
  | 'Planning';

export type WorkflowPatternType =
  | 'Context Ingestion → Deconstruction → Devil\'s Advocate → Structured Output'
  | 'First-Principles Decomposition → Constraint Relaxation → Synthesis'
  | 'Socratic Diagnostic Probe → Counter-Example Stress Test → Consensus Rubric'
  | 'Code Architecture Review → Security Audit → Edge-Case Generation';

export interface ModelCapabilityProfile {
  recommendedModel: string; // e.g. 'Gemini 1.5 Pro (2M Context)', 'Gemini 1.5 Flash (Fast Execution)', 'Thinking / Deep Reasoning'
  reasonForModel: string;
  tokenContextTarget: 'Small (<8K)' | 'Medium (8K-32K)' | 'Large (32K-128K)' | 'Massive (128K-2M)';
  modality: 'Text-only' | 'Multimodal (Image/Doc/Audio)' | 'Code & Structured JSON';
}

export interface AIPromptTemplate {
  id: string;
  title: string;
  isCustom?: boolean;
  lifecycleStage: ProductLifecycleStage;
  purposes: PromptPurpose[];
  workflowPattern: WorkflowPatternType;
  modelProfile: ModelCapabilityProfile;
  summary: string;
  templateContent: string;
  exampleVariables: {
    variableName: string;
    description: string;
    placeholder: string;
  }[];
  suggestedInputArtifact: string;
  expectedOutputFormat: string;
  applicableRoles: (RoleCategory | string)[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// 5. UNIFIED KNOWLEDGE LIBRARY METADATA & RELATIONSHIPS
// =========================================================================

export interface UnifiedKnowledgeMetadata {
  domain?: SectorDomain | string;
  industry?: string;
  function?: string;
  role?: RoleCategory | string;
  skill?: string | string[];
  seniority?: string | string[];
  workPathway?: string | string[];
  technology?: string | string[];
  organization?: string | string[];
  project?: string | string[];
  sourceType?: string;
  evidenceLevel?: number | string;
  status?: string;
  version?: string;
  createdDate?: string;
  updatedDate?: string;
  sourceUrl?: string;
  tags?: string[];
}

export interface RoleToKnowledgeRelationship {
  role: string;
  workRelevantPathway: string;
  skills: string[];
  toolsAndPlatforms: string[];
  projects: string[];
  knowledgeSources: string[];
}

export interface CivicDeliveryRelationship {
  industry: string;
  domain: string;
  civicSystem: string;
  organizations: string[];
  programs: string[];
  technologyPlatforms: string[];
}

export interface InnovationToRoleRelationship {
  innovation: string;
  technology: string[];
  product: string;
  workPathway: string[];
  relevantRoles: string[];
}

