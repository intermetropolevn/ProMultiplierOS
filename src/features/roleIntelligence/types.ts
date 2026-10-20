// Types for Role Intelligence & Evaluation Module

export type CareerOSTrack = 'ic' | 'management' | 'hybrid';

export type CareerOSProficiency = 'foundational' | 'working' | 'advanced' | 'senior' | 'strategic';

export type FrameworkType = 
  | 'job_evaluation'
  | 'job_grading'
  | 'job_leveling'
  | 'skills_framework'
  | 'occupational_framework'
  | 'career_architecture';

export type ReferenceFrameworkId = 
  | 'korn_ferry_hay'
  | 'mercer_ipe'
  | 'wtw_ggs'
  | 'aon_radford'
  | 'patterson'
  | 'careeros_native';

export type RoleCategoryFamily = 
  | 'product'
  | 'technology'
  | 'product_business_ops'
  | 'hybrid_cross_functional';

// 10 Native CareerOS Evaluation Dimensions
export type CareerOSDimensionKey = 
  | 'functional_technical_knowledge'
  | 'business_domain_knowledge'
  | 'problem_complexity'
  | 'decision_scope'
  | 'product_customer_impact'
  | 'business_impact'
  | 'operational_scope'
  | 'stakeholder_complexity'
  | 'strategic_influence'
  | 'leadership_ownership';

export type EvidenceCoverage = 'Strong' | 'Moderate' | 'Limited' | 'Insufficient';
export type AssessmentConfidence = 'High' | 'Medium' | 'Low';
export type DeltaStatus = 'Ready' | 'Strong' | 'Developing' | 'Evidence Gap' | 'Experience Gap' | 'Context Gap';

export interface SupportingWorkInitiative {
  initiativeId: string;
  initiativeTitle: string;
  activitiesCount: {
    tasks: number;
    docs: number;
    meetings: number;
    experiments: number;
    outcomes: number;
    notes?: number;
  };
  userContribution: 'Owner' | 'Lead' | 'Contributor' | 'Collaborator' | 'Reviewer' | 'Participant';
  attributionConfidence: 'High' | 'Medium' | 'Low';
  isSharedAttribution: boolean;
  attributionNotes?: string;
  artifacts: string[];
  observedOutcomes: string[];
  qualitySignals: string[];
}

export interface HumanSignalFeedback {
  id: string;
  stakeholderDiscipline: 'Engineering' | 'Design' | 'Business' | 'Operations' | 'Leadership' | 'Other';
  stakeholderRole: string;
  demonstratedCapabilityNote: string;
  date: string;
}

export interface AssessmentHistoryItem {
  id: string;
  date: string;
  roleTitle: string;
  levelCode: string;
  levelName: string;
  confidence: AssessmentConfidence;
  coveragePercentage: number;
  evaluatedDimensionsCount: number;
  summaryNote: string;
}

export interface RoleAssessmentSummaryData {
  currentLevel: string;
  currentLevelCode: string;
  targetLevel: string;
  targetLevelCode: string;
  systemEvidencePercentage: number;
  humanContextPercentage: number;
  evidenceCoveragePercentage: number;
  assessmentConfidence: AssessmentConfidence;
  lastAssessedDate: string;
  synthesisRationale: string;
  systemSignalsCount: number;
  humanSignalsCount: number;
  initiativesCount: number;
}

export interface CareerOSDimensionScore {
  key: CareerOSDimensionKey;
  label: string;
  score: number; // 1 to 5 (or 0 if insufficient evidence)
  proficiency: CareerOSProficiency;
  description: string;
  evidencePrompt: string;
  rationale: string;

  // Evidence-Backed & Human-in-the-Loop Extensions
  observedLevelLabel?: string; // e.g., "4 — Senior" or "Insufficient Evidence"
  evidenceCoverage?: EvidenceCoverage;
  assessmentConfidence?: AssessmentConfidence;
  confidenceReason?: string;
  systemEvidenceWeight?: number; // e.g. 76 (76%)
  humanSignalWeight?: number; // e.g. 24 (24%)

  // Multi-Signal Scores for Radar & Comparison View (1-5 scale)
  systemEvidenceScore?: number;
  humanSignalScore?: number;
  selfAssessmentScore?: number;
  crossFunctionalScore?: number;
  managerSignalScore?: number;
  targetRoleScore?: number;

  // Signal Details & Narrative
  observedEvidenceList?: string[];
  humanSignalSummary?: string;
  assessmentRationale?: string;
  supportingWork?: SupportingWorkInitiative[];
  humanSignalsList?: HumanSignalFeedback[];
  contextChips?: string[];
  additionalContext?: string;

  // User Control / Human-in-the-loop overrides
  isUserAdjusted?: boolean;
  userAdjustmentNotes?: string;
  validationStatus?: 'Detected' | 'Suggested' | 'Confirmed' | 'Validated';

  // Delta against Target Role
  deltaStatus?: DeltaStatus;
  deltaGuidance?: string;
  perceptionGap?: string;
}

export interface ReferenceFrameworkDimension {
  name: string;
  weightOrScope: string;
  scoreOrBand: string;
  interpretation: string;
}

export interface ReferenceFrameworkEvaluation {
  frameworkId: ReferenceFrameworkId;
  frameworkName: string;
  levelOrScore: string; // e.g. "Hay 540 Points", "Radford P4 / Senior", "Mercer IPE 54", "WTW Grade 13", "Patterson Band D"
  dimensions: ReferenceFrameworkDimension[];
  rationale: string;
  marketAlignmentNotes: string;
}

export interface FrameworkMetadata {
  id: ReferenceFrameworkId;
  name: string;
  shortName: string;
  creator: string;
  frameworkType: FrameworkType;
  primaryPurpose: string;
  bestSuitedRoles: string[];
  evaluationDimensions: string[];
  typicalUse: string;
  careerosRelevance: string;
  evaluationLogic: string;
  roleCoverage: string;
  strengths: string[];
  limitations: string[];
}

export interface RoleCompetencyItem {
  id: string;
  name: string;
  category: 'core' | 'technical' | 'product' | 'business' | 'operational' | 'leadership' | 'domain';
  requiredLevel: CareerOSProficiency;
  description: string;
  externalFrameworkRefs?: {
    framework: 'SFIA' | 'O*NET' | 'ESCO' | 'SHL';
    codeOrLevel: string;
    description: string;
  }[];
}

export interface RoleDeliverable {
  title: string;
  frequency: string;
  purpose: string;
}

export interface RoleKpi {
  metric: string;
  targetBenchmark: string;
  importance: 'critical' | 'primary' | 'supporting';
}

export interface AdjacentRoleLink {
  roleId: string;
  roleTitle: string;
  overlapPercentage: number;
  transferability: 'High' | 'Medium' | 'Low';
  commonBridgeSkills: string[];
  notes: string;
}

export interface CareerMobilityTransition {
  fromRoleId: string;
  toRoleId: string;
  toRoleTitle: string;
  toRoleTrack: CareerOSTrack;
  transferabilityScore: number; // 0-100
  transferabilityLevel: 'Very High' | 'High' | 'Moderate' | 'Challenging';
  skillOverlapPercentage: number;
  skillOverlapItems: string[];
  skillGaps: string[];
  requiredExperience: string;
  estimatedTransitionDifficulty: 'Low' | 'Moderate' | 'High';
  strategicValue: string;
  recommendedPathway: string[];
}

export interface RoleLevelMapping {
  careerosInferredLevel: string; // e.g., "P4 / Senior Product Specialist"
  levelCode: string; // e.g., "P4", "P5", "M1"
  icEquivalent: string; // e.g., "Staff / Principal Product IC"
  managementEquivalent: string; // e.g., "Group PM / Director of Product"
  scopeSummary: {
    roleScope: string;
    decisionScope: string;
    impactScope: string;
    complexity: string;
    leadershipScope: string;
  };
  referenceFrameworkLevels: {
    kornFerryHay: string;
    mercerIpe: string;
    wtwGgs: string;
    aonRadford: string;
    patterson: string;
  };
  evidenceRationale: string[];
}

export interface RoleIntelligenceItem {
  id: string;
  title: string;
  jobFamily: string;
  domain: string;
  roleFamilyCategory: RoleCategoryFamily;
  currentLevel: string;
  targetLevel: string;
  track: CareerOSTrack;
  evaluationStatus: 'Evaluated' | 'In Progress' | 'Reference Benchmark';
  rolePurpose: string;
  overview: string;
  coreResponsibilities: string[];
  scope: string;
  decisionRights: string[];
  expectedImpact: string;
  typicalSeniority: string;
  keySkills: string[];
  businessKnowledge: string[];
  technicalKnowledge: string[];
  behavioralCompetencies: string[];
  toolsAndPlatforms: string[];
  commonKpis: RoleKpi[];
  typicalDeliverables: RoleDeliverable[];
  adjacentRoles: AdjacentRoleLink[];
  careerProgression: {
    icTrack: string[];
    managementTrack: string[];
  };
  // Evaluation Models
  careerosDimensions: CareerOSDimensionScore[];
  referenceEvaluations: ReferenceFrameworkEvaluation[];
  levelMapping: RoleLevelMapping;
  competencies: RoleCompetencyItem[];
  mobilityTransitions: CareerMobilityTransition[];
}

export type ReadinessGapCategory = 'skill' | 'experience' | 'evidence' | 'exposure';

export interface ReadinessGapItem {
  id: string;
  category: ReadinessGapCategory;
  name: string;
  status: 'strong' | 'develop' | 'gap'; // strong = ✓, develop = △, gap = ○
  currentSignal: string;
  targetRequirement: string;
  remediationPath: string;
}

export interface RoleReadinessAnalysis {
  roleId: string;
  roleTitle: string;
  overallFitScore: number; // 0-100
  skillCoverageScore: number;
  experienceCoverageScore: number;
  scopeCoverageScore: number;
  decisionCoverageScore: number;
  domainCoverageScore: number;
  evidenceCoverageScore: number;
  strongAreas: string[];
  developAreas: string[];
  gapAreas: string[];
  gapBreakdown: {
    skillGaps: ReadinessGapItem[];
    experienceGaps: ReadinessGapItem[];
    evidenceGaps: ReadinessGapItem[];
    exposureGaps: ReadinessGapItem[];
  };
  recommendedNextActions: string[];
}

export interface RoleGraphNode {
  id: string;
  label: string;
  type: 'role' | 'level' | 'skill' | 'competency' | 'responsibility' | 'scope' | 'industry' | 'adjacent_role' | 'career_path' | 'learning' | 'opportunity';
  group?: string;
  size?: number;
  levelBadge?: string;
}

export interface RoleGraphLink {
  source: string;
  target: string;
  label?: string;
  relationship: 'requires' | 'progresses_to' | 'adjacent_to' | 'scoped_at' | 'empowers' | 'leads_to_opportunity';
}

export interface RoleGraphData {
  nodes: RoleGraphNode[];
  links: RoleGraphLink[];
}
