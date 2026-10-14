import { ProvenanceMetadata } from './provenance';

export type InnovationType =
  | 'Product Innovation'
  | 'Platform Innovation'
  | 'Technology Innovation'
  | 'Business Model Innovation'
  | 'UX Innovation'
  | 'Infrastructure Innovation'
  | 'AI-native Product'
  | 'Developer Tool'
  | 'Consumer Product'
  | 'Enterprise Product'
  | 'Marketplace'
  | 'Open Source'
  | 'Protocol'
  | 'Digital Public Infrastructure'
  | 'Social Innovation'
  | 'Experimental / Speculative';

export type TransformationDimension =
  | 'Workflow Transformation'
  | 'User Experience Transformation'
  | 'Business Model Transformation'
  | 'Industry Transformation'
  | 'Infrastructure Transformation'
  | 'Distribution Transformation'
  | 'Organizational Transformation';

export type InnovationStage =
  | 'Concept / Speculative'
  | 'Prototype / Early Access'
  | 'Production / Scaling'
  | 'Mature / Category Leader'
  | 'Open Protocol / Ecosystem';

export type InnovationStatus =
  | 'Active'
  | 'Emerging'
  | 'Mainstream'
  | 'Speculative'
  | 'Disruptive';

export interface InnovationConnectedSkill {
  name: string;
  category?: string;
  proficiency?: 'Fundamental' | 'Practitioner' | 'Expert';
}

export interface InnovationKnowledgeSource {
  title: string;
  type: 'Paper' | 'Documentation' | 'Whitepaper' | 'Spec' | 'Analysis' | 'Case Study';
  url?: string;
  publishedDate?: string;
}

export interface InnovationSystemEntry {
  id: string;
  name: string;
  shortDescription: string;
  innovationType: InnovationType;
  domain: string;
  industry: string;
  problemSolved: string;
  existingAlternative: string;
  coreInnovation: string;
  howItWorks: string;
  productSystemArchitecture: string;
  keyTechnologies: string[];
  userExperience: string;
  businessModel: string;
  distributionModel: string;
  differentiation: string;
  transformativePotential: string;
  transformationDimensions: TransformationDimension[];
  currentStage: InnovationStage;
  targetUsers: string;
  relevantRoles: string[]; // Connected to Career OS roles
  relatedSkills: InnovationConnectedSkill[];
  relatedToolsPlatforms: string[];
  relatedWorkPathways: string[]; // Connected to Career OS Work-Relevant Pathways
  relatedOrganizations: string[];
  relatedKnowledgeSources: InnovationKnowledgeSource[];
  officialWebsite?: string;
  sourceUrl?: string;
  referenceLinks?: string[];
  sourceName?: string;
  sourceType?: string;
  provenance?: ProvenanceMetadata;
  dateObserved: string;
  versionRelease?: string;
  status: InnovationStatus;
  isArchived?: boolean;
}

export const INNOVATION_TYPE_CONFIG: Record<InnovationType, { label: string; badgeColor: string }> = {
  'Product Innovation': { label: 'Product Innovation', badgeColor: 'bg-blue-50 text-blue-800 border-blue-200' },
  'Platform Innovation': { label: 'Platform Innovation', badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  'Technology Innovation': { label: 'Technology Innovation', badgeColor: 'bg-violet-50 text-violet-800 border-violet-200' },
  'Business Model Innovation': { label: 'Business Model Innovation', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  'UX Innovation': { label: 'UX Innovation', badgeColor: 'bg-pink-50 text-pink-800 border-pink-200' },
  'Infrastructure Innovation': { label: 'Infrastructure Innovation', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
  'AI-native Product': { label: 'AI-Native Product', badgeColor: 'bg-purple-50 text-purple-800 border-purple-200' },
  'Developer Tool': { label: 'Developer Tool', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  'Consumer Product': { label: 'Consumer Product', badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  'Enterprise Product': { label: 'Enterprise Product', badgeColor: 'bg-blue-50 text-blue-900 border-blue-200' },
  'Marketplace': { label: 'Marketplace', badgeColor: 'bg-teal-50 text-teal-800 border-teal-200' },
  'Open Source': { label: 'Open Source', badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
  'Protocol': { label: 'Protocol', badgeColor: 'bg-orange-50 text-orange-800 border-orange-200' },
  'Digital Public Infrastructure': { label: 'Digital Public Infrastructure', badgeColor: 'bg-rose-50 text-rose-800 border-rose-200' },
  'Social Innovation': { label: 'Social Innovation', badgeColor: 'bg-lime-50 text-lime-800 border-lime-200' },
  'Experimental / Speculative': { label: 'Experimental / Speculative', badgeColor: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200' }
};

export const TRANSFORMATION_DIMENSION_CONFIG: Record<TransformationDimension, { label: string; chipColor: string }> = {
  'Workflow Transformation': { label: 'Workflow', chipColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  'User Experience Transformation': { label: 'UX Experience', chipColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  'Business Model Transformation': { label: 'Business Model', chipColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'Industry Transformation': { label: 'Industry Shift', chipColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Infrastructure Transformation': { label: 'Infrastructure', chipColor: 'bg-slate-100 text-slate-700 border-slate-300' },
  'Distribution Transformation': { label: 'Distribution', chipColor: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  'Organizational Transformation': { label: 'Organizational', chipColor: 'bg-rose-50 text-rose-700 border-rose-200' }
};
