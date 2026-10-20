// Types for Evidence Intelligence Module in CareerOS

export type ContributionType = 
  | 'Owner' 
  | 'Lead' 
  | 'Contributor' 
  | 'Collaborator' 
  | 'Reviewer' 
  | 'Participant';

export type EvidenceStatus = 
  | 'Detected' 
  | 'Suggested' 
  | 'Confirmed' 
  | 'Validated' 
  | 'Archived';

export type CapabilityDomain = 
  | 'PRODUCT' 
  | 'TECH' 
  | 'BUSINESS' 
  | 'OPERATIONS' 
  | 'LEADERSHIP';

export type ObservedProficiency = 
  | 'Foundational' 
  | 'Emerging' 
  | 'Intermediate' 
  | 'Advanced' 
  | 'Strategic';

export type GapClassification = 
  | 'Skill Gap' 
  | 'Experience Gap' 
  | 'Evidence Gap' 
  | 'Exposure Gap';

export type SourceType = 
  | 'Jira' 
  | 'Notion' 
  | 'Google Calendar / Meetings' 
  | 'GitHub' 
  | 'Analytics / Amplitude' 
  | 'Figma' 
  | 'Slack / Comm' 
  | 'Research Notes' 
  | 'Manual Reflection';

export interface ActivityCountSummary {
  tasks: number;
  documents: number;
  meetings: number;
  experiments: number;
  decisions: number;
  deliverables: number;
  notes: number;
}

export interface ActivitySourceItem {
  id: string;
  source: SourceType;
  title: string;
  type: 'task' | 'document' | 'meeting' | 'experiment' | 'decision' | 'deliverable' | 'research_note' | 'reflection';
  timestamp: string;
  authorOrParticipant: string;
  externalUrl?: string;
  summary: string;
}

export interface ArtifactItem {
  id: string;
  title: string;
  type: 'PRD' | 'Architecture RFC' | 'Figma Prototype' | 'SQL Query' | 'Dashboard' | 'Post-Mortem' | 'Presentation';
  url?: string;
  dateCreated: string;
  sizeOrScope?: string;
}

export interface OutcomeMetric {
  id: string;
  metricName: string;
  quantitativeLift: string; // e.g. "+34% Activation", "-28% Churn", "$2.4M ARR"
  baseline?: string;
  result?: string;
  timeframe: string;
  verified: boolean;
}

export interface AttributionParticipant {
  name: string;
  role: string;
  discipline: string;
  share: 'Primary' | 'Co-Lead' | 'Contributor' | 'Supporting';
}

export interface AttributionModel {
  userRole: string;
  userContributionSummary: string;
  attributionConfidence: number; // 0 - 100
  outcomeAttribution: 'Sole Owner' | 'Primary Driver' | 'Shared' | 'Contributor';
  coContributors: AttributionParticipant[];
}

export interface MultiDimensionScores {
  frequency: number; // 1-10
  complexity: number; // 1-10
  scope: number; // 1-10
  ownership: number; // 1-10
  impact: number; // 1-10
  evidenceQuality: number; // 1-10
  consistency: number; // 1-10
  validation: number; // 1-10
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  source: SourceType | string;
  linkedInitiativeId: string;
  linkedInitiativeTitle: string;
  role: string;
  contributionType: ContributionType;
  capabilities: string[]; // capability IDs
  capabilityLabels: string[];
  skills: string[];
  scope: string;
  complexity: 'Low' | 'Medium' | 'High' | 'Strategic';
  ownershipLevel: string;
  impactSummary: string;
  outcomes: OutcomeMetric[];
  supportingArtifacts: ArtifactItem[];
  date: string;
  monthYear: string; // e.g. "OCT 2026"
  year: number; // e.g. 2026
  month: string; // e.g. "OCT"
  evidenceConfidence: number; // 0 - 100%
  attributionConfidence: number; // 0 - 100%
  validationStatus: EvidenceStatus;
  attribution: AttributionModel;
  qualitySignals: {
    hasArtifact: boolean;
    hasDecisionLogged: boolean;
    hasCrossFunctionalLead: boolean;
    hasShippedOutcome: boolean;
    hasMeasuredMetric: boolean;
    hasPeerValidation: boolean;
    isRepeatedBehavior: boolean;
  };
  dimensionScores: MultiDimensionScores;
  detectedActivitiesSummary?: ActivityCountSummary;
  whyExplanation?: string;
  sourceBreakdown?: {
    source: SourceType;
    count: number;
    icon?: string;
  }[];
}

export interface WorkInitiative {
  id: string;
  title: string;
  status: 'In Progress' | 'Shipped' | 'Evaluating' | 'Archived';
  timeframe: string;
  objective: string;
  userRole: string;
  responsibilities: string[];
  activities: ActivitySourceItem[];
  activityCounts: ActivityCountSummary;
  artifacts: ArtifactItem[];
  decisions: {
    id: string;
    title: string;
    date: string;
    rationale: string;
    alternativesConsidered: string;
  }[];
  experiments: {
    id: string;
    hypothesis: string;
    variantChosen: string;
    metricObserved: string;
    result: 'Success' | 'Inconclusive' | 'Iterating';
  }[];
  outcomes: OutcomeMetric[];
  evidenceGeneratedIds: string[];
  capabilitiesDemonstrated: string[];
  sourceDistribution: {
    source: SourceType;
    count: number;
    details: string;
  }[];
}

export interface CapabilityDefinition {
  id: string;
  name: string;
  domain: CapabilityDomain;
  description: string;
  observedProficiency: ObservedProficiency;
  confidence: 'High' | 'Moderate' | 'Emerging' | 'Low';
  evidenceStrength: 'Strong' | 'Moderate' | 'Limited' | 'Insufficient';
  dimensionScores: MultiDimensionScores;
  verifiedEvidenceCount: number;
  recentEvidenceTitles: string[];
  historicalEvidenceTitles: string[];
  missingEvidenceNotes: string[];
  gapClassification?: GapClassification;
  gapReason?: string;
  recommendedAction?: string;
}

export interface RoleReadinessEvidenceCheck {
  targetRoleId: string;
  targetRoleTitle: string;
  overallReadinessPercentage: number;
  readinessBand: 'Ready for Transition' | 'Strong Contender' | 'Developing' | 'Early Stage';
  strongEvidenceCapabilities: string[];
  emergingEvidenceCapabilities: string[];
  evidenceGaps: {
    capabilityName: string;
    gapType: GapClassification;
    currentState: string;
    recommendedNextAction: string;
  }[];
  adjacentMobilityRoles: {
    roleId: string;
    title: string;
    overlapPercentage: number;
    evidenceOverlap: number;
    difficulty: 'Low' | 'Moderate' | 'Challenging';
    keyGap: string;
  }[];
}

export interface EvidenceSourceConnector {
  id: string;
  source: SourceType;
  category: 'Task Management' | 'Documents & Knowledge' | 'Calendar & Communication' | 'Code & Architecture' | 'Analytics & Product' | 'Design & UX' | 'Manual Reflection';
  status: 'Connected' | 'Syncing' | 'Paused' | 'Ready to Connect';
  evidenceTypesCaptured: string[];
  lastSync: string;
  privacyScope: string;
  recordsIngested: number;
  autoExtractEvidence: boolean;
  isExcluded: boolean;
}

export interface EvidenceGraphNode {
  id: string;
  label: string;
  type: 'user' | 'initiative' | 'activity' | 'artifact' | 'evidence' | 'capability' | 'outcome' | 'role_requirement';
  group: 'root' | 'work' | 'activity' | 'evidence' | 'capability' | 'outcome' | 'role';
  size: number;
  badge?: string;
  subText?: string;
}

export interface EvidenceGraphLink {
  source: string;
  target: string;
  relationship: 'undertakes' | 'comprises' | 'produces' | 'crystallizes_into' | 'demonstrates' | 'yields' | 'fulfills';
  label?: string;
}

export interface EvidenceGraphData {
  nodes: EvidenceGraphNode[];
  links: EvidenceGraphLink[];
}
