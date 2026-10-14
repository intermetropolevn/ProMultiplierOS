import { ProvenanceMetadata } from './provenance';

export type CivicEntityType =
  | 'Government Agency'
  | 'Public Institution'
  | 'NGO'
  | 'Non-profit'
  | 'International Organization'
  | 'Development Organization'
  | 'Civic Tech Organization'
  | 'Public Program'
  | 'Public Platform'
  | 'Digital Public Infrastructure'
  | 'Social Impact Initiative'
  | 'Policy / Regulatory Program'
  | 'Public Service';

export type CivicSystemStatus =
  | 'Nationwide Scaled'
  | 'Operational'
  | 'Active Program'
  | 'Global Standard'
  | 'Piloting / Expanding';

export interface CivicServiceItem {
  name: string;
  description: string;
  deliveryChannel?: string;
  targetGroup?: string;
}

export interface CivicTechComponent {
  name: string;
  role: string;
  architecture?: string;
}

export interface CivicStakeholder {
  group: string;
  role: string;
  responsibility?: string;
}

export interface CivicPartner {
  name: string;
  type: string;
  role: string;
}

export interface CivicConnectedSkill {
  name: string;
  category?: string;
  proficiency?: 'Fundamental' | 'Practitioner' | 'Expert';
}

export interface CivicKnowledgeSource {
  title: string;
  type: 'Legislation' | 'Whitepaper' | 'Open Standard' | 'Architecture Spec' | 'Impact Evaluation' | 'Case Study';
  url?: string;
  publicationDate?: string;
}

export interface RelationshipChainNode {
  stageLabel: string;
  title: string;
  description: string;
  colorClass: string;
}

export interface CivicSystemRelationship {
  modelType: 'government_service_delivery' | 'ngo_social_delivery' | 'dpi_ecosystem' | 'civic_participation';
  flowTitle: string;
  nodes: RelationshipChainNode[];
}

export interface CivicSystemEntry {
  id: string;
  name: string;
  entityType: CivicEntityType;
  countryRegion: string;
  domain: string;
  missionPurpose: string;
  problemAddressed: string;
  targetPopulation: string;
  operatingModel: string;
  keyPrograms: string[];
  services: CivicServiceItem[];
  technologyInfrastructure: CivicTechComponent[];
  digitalCapabilities: string[];
  fundingProcurementModel: string;
  stakeholders: CivicStakeholder[];
  partners: CivicPartner[];
  impactAreas: string[];
  relevantRoles: string[];
  relatedSkills: CivicConnectedSkill[];
  relatedToolsPlatforms: string[];
  relatedInnovation: string[];
  knowledgeSources: CivicKnowledgeSource[];
  officialWebsite?: string;
  sourceUrl?: string;
  referenceLinks?: string[];
  sourceName?: string;
  sourceType?: string;
  provenance?: ProvenanceMetadata;
  dateObserved?: string;
  dateTime: string;
  status: CivicSystemStatus;
  versionEdition?: string;
  isArchived?: boolean;
  systemRelationships: CivicSystemRelationship;
  systemWorkflowSummary: {
    howItWorks: string;
    governanceAndCompliance: string;
    citizenJourney: string;
  };
}

export const CIVIC_ENTITY_TYPE_CONFIG: Record<CivicEntityType, { label: string; badgeColor: string }> = {
  'Government Agency': {
    label: 'Government Agency',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  'Public Institution': {
    label: 'Public Institution',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  'NGO': {
    label: 'NGO',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  'Non-profit': {
    label: 'Non-profit',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200'
  },
  'International Organization': {
    label: 'International Organization',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  'Development Organization': {
    label: 'Development Organization',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  'Civic Tech Organization': {
    label: 'Civic Tech Organization',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  'Public Program': {
    label: 'Public Program',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200'
  },
  'Public Platform': {
    label: 'Public Platform',
    badgeColor: 'bg-violet-50 text-violet-800 border-violet-200'
  },
  'Digital Public Infrastructure': {
    label: 'Digital Public Infrastructure (DPI)',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  'Social Impact Initiative': {
    label: 'Social Impact Initiative',
    badgeColor: 'bg-green-50 text-green-800 border-green-200'
  },
  'Policy / Regulatory Program': {
    label: 'Policy / Regulatory Program',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  'Public Service': {
    label: 'Public Service',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200'
  }
};
