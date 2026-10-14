import { RoleCategory, SectorDomain } from '../../../types';
import { EvidenceStrengthLevel } from '../../sources/types';
import { ProvenanceMetadata } from './provenance';

export type PathwayType =
  | 'Workstream'
  | 'Workflow'
  | 'Module'
  | 'Project Stage'
  | 'Git / Repository Workflow'
  | 'Product Workflow'
  | 'Engineering Workflow'
  | 'Research Workflow'
  | 'Operations Workflow'
  | 'Business Process'
  | 'Cross-functional Process'
  | 'Specialized Practice';

export type PathwayArchetype =
  | 'workstream'
  | 'work_package'
  | 'responsibility'
  | 'sub_role'
  | 'git_workflow'
  | 'repository_workflow'
  | 'product_module'
  | 'engineering_module'
  | 'business_process'
  | 'operational_procedure'
  | 'cross_functional_workflow'
  | 'project_stage'
  | 'repeatable_task_cluster';

export type PathwayDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type PathwayWorkType =
  | 'Execution & Delivery'
  | 'System Architecture & Design'
  | 'Discovery & Research'
  | 'Quality, Governance & Compliance'
  | 'Optimization & Maintenance'
  | 'Incident Response & Operations'
  | 'Strategic Planning & Alignment';

export type PathwayFunction =
  | 'Product Management'
  | 'Core Software Engineering'
  | 'DevOps, SRE & Cloud'
  | 'Data Engineering & Analytics'
  | 'Machine Learning & AI Engineering'
  | 'Cybersecurity & Governance'
  | 'UI/UX & Product Design'
  | 'Program & Technical Operations'
  | 'Quality Assurance & Testing'
  | 'Business Strategy & Finance'
  | 'Cross-Functional Operations';

export interface PathwayStepActivity {
  stepNumber: number;
  title: string;
  phase?: string;
  whatProfessionalsDo: string; // Detailed day-to-day actions professionals take
  toolsAndPlatforms: string[]; // Specific tools used in this step
  deliverable: string; // Concrete output produced
  organizationalOperations?: string; // Governance, approvals, SOPs
  emergingInnovations?: string; // AI assistance, automation
  commonPitfalls?: string[];
}

export type PathwayStage = PathwayStepActivity;

export interface PathwayDeliverable {
  title: string;
  type: string;
  format: string;
  description: string;
}

export interface PathwayConnectedSkill {
  name: string;
  relevance: 'primary' | 'secondary';
  proficiency: 'Fundamental' | 'Practitioner' | 'Expert';
}

export interface PathwayConnectedEvidence {
  title: string;
  strengthLevel: EvidenceStrengthLevel;
  roleReadinessImpact: string;
  suggestedSourceType?: string;
}

export interface WorkRelevantPathway {
  id: string;
  
  // Pathway Identity
  name?: string; // Canonical name
  title?: string; // backwards compatibility alias
  codeName: string;
  pathwayType?: PathwayType;
  pathwayArchetype?: PathwayArchetype; // backwards compatibility
  
  // Hierarchy & Categorization
  parentRole?: RoleCategory;
  role?: RoleCategory; // backwards compatibility alias
  domain: SectorDomain;
  function?: PathwayFunction | string;
  workType?: PathwayWorkType | string;
  
  // Narrative & Mechanics
  description?: string;
  summary?: string; // backwards compatibility alias
  objective?: string;
  triggerWhenUsed?: string; // When/why it is triggered or used
  scopeClarification?: string;
  organizationalContext?: string;
  organizationalOperations?: string;
  
  // Inputs & Outputs
  inputs?: string[];
  outputs?: string[];
  
  // Activities / Steps
  activities?: PathwayStepActivity[];
  stages?: PathwayStage[]; // backwards compatibility alias
  
  // Deliverables
  deliverables?: (PathwayDeliverable | string)[];
  deliverablesAndArtifacts?: PathwayDeliverable[]; // backwards compatibility alias
  
  // Skills & Tools
  requiredSkills?: (PathwayConnectedSkill | string)[];
  connectedSkills?: PathwayConnectedSkill[]; // backwards compatibility alias
  toolsAndPlatforms: string[];
  
  // Ecosystem & Institutional Connectivity
  knowledgeSources?: string[];
  relatedFrameworks?: string[];
  relatedProjects?: string[];
  relatedJobOpportunities?: string[];
  emergingInnovations?: string[];
  
  // Calibration & Evidence
  difficulty?: PathwayDifficulty;
  seniorityRelevance?: string[]; // e.g. ['Junior', 'Mid-Level', 'Senior', 'Lead / Staff']
  estimatedDuration?: string;
  executionCadence?: string;
  evidenceLevel?: EvidenceStrengthLevel;
  evidenceStrengthLevel?: EvidenceStrengthLevel; // backwards compatibility alias
  connectedEvidence?: PathwayConnectedEvidence[]; // backwards compatibility alias
  
  // Temporal, Provenance & Source Metadata
  provenance?: ProvenanceMetadata;
  tags: string[];
  sourceUrl?: string;
  officialWebsite?: string;
  referenceLinks?: string[];
  sourceName?: string;
  sourceType?: string;
  dateObserved?: string;
  createdDate?: string;
  updatedDate?: string;
  isArchived?: boolean;
}

export const PATHWAY_TYPES_LIST: PathwayType[] = [
  'Workstream',
  'Workflow',
  'Module',
  'Project Stage',
  'Git / Repository Workflow',
  'Product Workflow',
  'Engineering Workflow',
  'Research Workflow',
  'Operations Workflow',
  'Business Process',
  'Cross-functional Process',
  'Specialized Practice'
];

export const PATHWAY_TYPE_CONFIG: Record<PathwayType, { label: string; description: string; badgeColor: string }> = {
  'Workstream': {
    label: 'Workstream',
    description: 'A continuous stream of related operational or product tasks directed toward strategic milestones.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  'Workflow': {
    label: 'Workflow',
    description: 'A structured, repeatable sequence of defined tasks transforming specific inputs into outputs.',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  'Module': {
    label: 'Module',
    description: 'A self-contained architectural or functional component with defined interfaces.',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  'Project Stage': {
    label: 'Project Stage',
    description: 'A temporal gate or phase within the initiative lifecycle carrying defined entry and exit criteria.',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  'Git / Repository Workflow': {
    label: 'Git / Repository Workflow',
    description: 'Branching strategies, commit protocols, PR review standards, and CI validation checks.',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  'Product Workflow': {
    label: 'Product Workflow',
    description: 'Discovery, customer research, PRD authoring, prioritization, and feature rollout mechanics.',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200'
  },
  'Engineering Workflow': {
    label: 'Engineering Workflow',
    description: 'Technical RFC design, implementation, code review, automated testing, and release delivery.',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200'
  },
  'Research Workflow': {
    label: 'Research Workflow',
    description: 'Hypothesis generation, empirical data collection, experimentation, and statistical synthesis.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  'Operations Workflow': {
    label: 'Operations Workflow',
    description: 'Runbooks, incident triaging, service level management, and system maintenance SOPs.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  'Business Process': {
    label: 'Business Process',
    description: 'Stakeholder coordination, budget justification, compliance audit, and commercial execution.',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  'Cross-functional Process': {
    label: 'Cross-functional Process',
    description: 'Multi-stakeholder alignment synchronizing Product, Engineering, Design, Legal, and Marketing.',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  'Specialized Practice': {
    label: 'Specialized Practice',
    description: 'Deep-domain specialized craft requiring high-calibre mastery (e.g. distributed consensus, threat modeling).',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200'
  }
};

export const PATHWAY_DIFFICULTY_CONFIG: Record<PathwayDifficulty, { label: string; badgeColor: string }> = {
  'Beginner': {
    label: 'Beginner',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  'Intermediate': {
    label: 'Intermediate',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  'Advanced': {
    label: 'Advanced',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  'Expert': {
    label: 'Expert',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  }
};

// Backward compatibility map
export const PATHWAY_ARCHETYPE_LABELS: Record<string, { label: string; description: string; badgeColor: string }> = {
  ...PATHWAY_TYPE_CONFIG,
  workstream: PATHWAY_TYPE_CONFIG['Workstream'],
  workflow: PATHWAY_TYPE_CONFIG['Workflow'],
  module: PATHWAY_TYPE_CONFIG['Module'],
  project_stage: PATHWAY_TYPE_CONFIG['Project Stage'],
  git_workflow: PATHWAY_TYPE_CONFIG['Git / Repository Workflow'],
  repository_workflow: PATHWAY_TYPE_CONFIG['Git / Repository Workflow'],
  product_module: PATHWAY_TYPE_CONFIG['Product Workflow'],
  engineering_module: PATHWAY_TYPE_CONFIG['Engineering Workflow'],
  business_process: PATHWAY_TYPE_CONFIG['Business Process'],
  operational_procedure: PATHWAY_TYPE_CONFIG['Operations Workflow'],
  cross_functional_workflow: PATHWAY_TYPE_CONFIG['Cross-functional Process'],
  work_package: PATHWAY_TYPE_CONFIG['Module'],
  responsibility: PATHWAY_TYPE_CONFIG['Specialized Practice'],
  sub_role: PATHWAY_TYPE_CONFIG['Specialized Practice'],
  repeatable_task_cluster: PATHWAY_TYPE_CONFIG['Workflow']
};
