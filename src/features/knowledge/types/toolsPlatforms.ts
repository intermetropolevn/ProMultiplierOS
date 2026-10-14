import { ProvenanceMetadata } from './provenance';

export type ToolCategory =
  | 'AI & Machine Learning'
  | 'Developer Tools'
  | 'Design & Creative'
  | 'Product Management'
  | 'Analytics & Data'
  | 'Marketing & Growth'
  | 'Automation'
  | 'Collaboration'
  | 'Communication'
  | 'Cloud Infrastructure'
  | 'Databases'
  | 'Security'
  | 'DevOps'
  | 'Observability'
  | 'Finance'
  | 'Commerce'
  | 'E-commerce'
  | 'CRM'
  | 'HR / People'
  | 'Knowledge Management'
  | 'Research'
  | 'Education'
  | 'No-code / Low-code'
  | 'Workflow Platforms'
  | 'API Platforms'
  | 'Open Source'
  | 'Enterprise Software'
  | 'Consumer Applications'
  | 'Other';

export type ToolPricingModel =
  | 'Open Source'
  | 'Freemium'
  | 'Usage-Based'
  | 'Commercial / SaaS'
  | 'Free'
  | 'Enterprise';

export type ToolHostingType =
  | 'Cloud SaaS'
  | 'Self-Hosted'
  | 'Local / Desktop'
  | 'Hybrid'
  | 'Edge';

export type ToolVersionStatus =
  | 'Current'
  | 'Previous Version'
  | 'Beta'
  | 'Experimental'
  | 'Deprecated'
  | 'Discontinued'
  | 'Acquired'
  | 'Merged'
  | 'Unknown';

export type IngestionSourceState =
  | 'Imported'
  | 'AI Suggested'
  | 'User Edited'
  | 'Verified';

export interface ToolHistoricalVersion {
  id?: string;
  version: string;
  releaseDate?: string;
  observedDate: string;
  lastVerified?: string;
  dataSourceDate?: string;
  status: ToolVersionStatus;
  notes?: string;
  capabilitiesSnapshot?: string;
  archivedAt?: string;
}

export interface ToolCapabilitySummary {
  keyCapacities: string[]; // 1. Key Capacities: A concise summary of platform's most important capabilities
  howItWorks: string; // 2. How It Works: Underlying operating mechanism, architecture, workflow
  productPhilosophy: string; // 3. Product Philosophy: Core design philosophy, operating principles
  usageAndStorage: { // 4. Usage / Storage
    usageModel: string;
    storageModel: string;
    dataModel: string;
    limits: string;
    hosting: ToolHostingType;
    dataRetention: string;
    environment: 'Local' | 'Cloud' | 'Hybrid';
    consumptionModel?: string;
  };
  integrations: { // 5. Integrations
    apis: string[];
    sdks: string[];
    connectors: string[];
    nativeIntegrations: string[];
    mcpSupport?: string; // Model Context Protocol support where relevant
    webhooks: string;
    importExport: string;
    automationIntegrations: string[];
  };
  userExperiences: { // 6. User Experiences (Web, Desktop, CLI, API, IDE, Dashboard, Workflow Builder, Agent, etc.)
    primaryInteractions: string[];
    details: string;
  };
  bestSuitedFor: { // 7. Best Suited For
    userTypes: string[];
    teams: string[];
    companySizes: string[];
    useCases: string[];
    workflows: string[];
    industries: string[];
    technicalLevel: 'No-Code' | 'Low-Code' | 'Pro-Code' | 'All Levels';
  };
  otherSupportingFeatures: string[]; // 8. Other Supporting Features
}

export interface ToolConnectedSkill {
  name: string;
  category?: string;
  proficiency?: 'Fundamental' | 'Practitioner' | 'Expert';
}

export interface ToolPlatformEntry {
  id: string;
  name: string;
  companyProvider: string;
  category: ToolCategory;
  subcategory: string;
  primaryDomain: string;
  targetUsers: string;
  officialWebsite?: string;
  productUrl?: string;
  sourceUrl?: string;
  referenceLinks?: string[];
  sourceName?: string;
  sourceType?: string;
  
  // Version & Temporal Data
  version?: string;
  releaseDate?: string;
  observedDate: string;
  lastVerified: string;
  dataSourceDate: string;
  status: ToolVersionStatus;
  versionHistory?: ToolHistoricalVersion[];
  
  pricingModel: ToolPricingModel;
  tagline: string;
  capabilitiesSummary: ToolCapabilitySummary;
  relevantRoles: string[]; // Connected to Career OS roles
  relatedSkills: ToolConnectedSkill[]; // Connected to Career OS skills
  relatedWorkPathways: string[]; // Connected to Career OS Work-Relevant Pathways
  
  // Source, Provenance and State Management
  provenance?: ProvenanceMetadata;
  sourceState?: IngestionSourceState;
  isArchived?: boolean;
  lastUpdated: string;
  createdAt?: string;
}

export const TOOL_CATEGORIES_LIST: ToolCategory[] = [
  'AI & Machine Learning',
  'Developer Tools',
  'Design & Creative',
  'Product Management',
  'Analytics & Data',
  'Marketing & Growth',
  'Automation',
  'Collaboration',
  'Communication',
  'Cloud Infrastructure',
  'Databases',
  'Security',
  'DevOps',
  'Observability',
  'Finance',
  'Commerce',
  'E-commerce',
  'CRM',
  'HR / People',
  'Knowledge Management',
  'Research',
  'Education',
  'No-code / Low-code',
  'Workflow Platforms',
  'API Platforms',
  'Open Source',
  'Enterprise Software',
  'Consumer Applications',
  'Other'
];

export const TOOL_CATEGORY_CONFIG: Record<ToolCategory, { label: string; badgeColor: string }> = {
  'AI & Machine Learning': { label: 'AI & Machine Learning', badgeColor: 'bg-purple-50 text-purple-800 border-purple-200' },
  'Developer Tools': { label: 'Developer Tools', badgeColor: 'bg-blue-50 text-blue-800 border-blue-200' },
  'Design & Creative': { label: 'Design & Creative', badgeColor: 'bg-pink-50 text-pink-800 border-pink-200' },
  'Product Management': { label: 'Product Management', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
  'Analytics & Data': { label: 'Analytics & Data', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  'Marketing & Growth': { label: 'Marketing & Growth', badgeColor: 'bg-rose-50 text-rose-800 border-rose-200' },
  'Automation': { label: 'Automation', badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  'Collaboration': { label: 'Collaboration', badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  'Communication': { label: 'Communication', badgeColor: 'bg-teal-50 text-teal-800 border-teal-200' },
  'Cloud Infrastructure': { label: 'Cloud Infrastructure', badgeColor: 'bg-sky-50 text-sky-800 border-sky-200' },
  'Databases': { label: 'Databases', badgeColor: 'bg-blue-50 text-blue-900 border-blue-300' },
  'Security': { label: 'Security', badgeColor: 'bg-red-50 text-red-800 border-red-200' },
  'DevOps': { label: 'DevOps', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  'Observability': { label: 'Observability', badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-300' },
  'Finance': { label: 'Finance', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  'Commerce': { label: 'Commerce', badgeColor: 'bg-lime-50 text-lime-800 border-lime-200' },
  'E-commerce': { label: 'E-commerce', badgeColor: 'bg-teal-50 text-teal-800 border-teal-200' },
  'CRM': { label: 'CRM', badgeColor: 'bg-orange-50 text-orange-800 border-orange-200' },
  'HR / People': { label: 'HR / People', badgeColor: 'bg-violet-50 text-violet-800 border-violet-200' },
  'Knowledge Management': { label: 'Knowledge Management', badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  'Research': { label: 'Research', badgeColor: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200' },
  'Education': { label: 'Education', badgeColor: 'bg-blue-50 text-blue-800 border-blue-200' },
  'No-code / Low-code': { label: 'No-code / Low-code', badgeColor: 'bg-amber-50 text-amber-900 border-amber-300' },
  'Workflow Platforms': { label: 'Workflow Platforms', badgeColor: 'bg-teal-50 text-teal-800 border-teal-200' },
  'API Platforms': { label: 'API Platforms', badgeColor: 'bg-purple-50 text-purple-900 border-purple-200' },
  'Open Source': { label: 'Open Source', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  'Enterprise Software': { label: 'Enterprise Software', badgeColor: 'bg-slate-100 text-slate-900 border-slate-300' },
  'Consumer Applications': { label: 'Consumer Applications', badgeColor: 'bg-pink-50 text-pink-800 border-pink-200' },
  'Other': { label: 'Other', badgeColor: 'bg-slate-50 text-slate-700 border-slate-200' }
};

export const TOOL_VERSION_STATUS_CONFIG: Record<ToolVersionStatus, { label: string; badgeColor: string }> = {
  'Current': { label: 'Current', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  'Previous Version': { label: 'Previous Version', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' },
  'Beta': { label: 'Beta', badgeColor: 'bg-blue-50 text-blue-800 border-blue-200' },
  'Experimental': { label: 'Experimental', badgeColor: 'bg-purple-50 text-purple-800 border-purple-200' },
  'Deprecated': { label: 'Deprecated', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
  'Discontinued': { label: 'Discontinued', badgeColor: 'bg-red-50 text-red-800 border-red-200' },
  'Acquired': { label: 'Acquired', badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  'Merged': { label: 'Merged', badgeColor: 'bg-violet-50 text-violet-800 border-violet-200' },
  'Unknown': { label: 'Unknown', badgeColor: 'bg-slate-50 text-slate-600 border-slate-200' }
};
