export type GrowthLoopStage = 
  | 'goal' 
  | 'diagnose' 
  | 'learn' 
  | 'practice' 
  | 'feedback' 
  | 'build' 
  | 'prove' 
  | 'opportunity';

export interface MissionCapabilityGap {
  id: string;
  capability: string;
  category: 'technical' | 'strategy' | 'leadership' | 'domain' | 'execution';
  currentLevel: number; // 1 to 6
  targetLevel: number;  // 1 to 6
  gapSeverity: 'high' | 'medium' | 'low';
  rationale: string;
  recommendedAction: string;
  linkedResource?: {
    type: 'knowledge' | 'practice' | 'builder' | 'blueprint';
    id: string;
    label: string;
  };
  status: 'identified' | 'in_progress' | 'closed';
}

export type MissionActionType = 
  | 'knowledge_read'
  | 'practice_drill'
  | 'live_simulation'
  | 'builder_challenge'
  | 'evidence_document'
  | 'opportunity_apply'
  | 'feedback_review';

export interface GrowthLoopStep {
  id: string;
  stage: GrowthLoopStage;
  title: string;
  description: string;
  actionType: MissionActionType;
  targetEntityId?: string;
  targetEntityName?: string;
  targetTab?: 'knowledge' | 'practice' | 'builder_match' | 'discover' | 'profile';
  readinessImpact: number; // e.g. +6%
  estimatedMinutes?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: string;
  actionCtaLabel: string;
  contextHint?: string;
}

export interface CareerMission {
  id: string;
  title: string;
  tagline: string;
  targetRoleId: string;
  targetRoleTitle: string;
  targetDomain: string;
  targetCompany?: string;
  status: 'active' | 'completed' | 'paused' | 'archived';
  currentStage: GrowthLoopStage;
  baselineReadiness: number; // 0 - 100
  currentReadiness: number;  // 0 - 100
  targetReadiness: number;   // 0 - 100
  capabilityGaps: MissionCapabilityGap[];
  steps: GrowthLoopStep[];
  nextBestActionId: string;
  evidenceIds: string[];
  completedBuildIds: string[];
  createdAt: string;
  updatedAt: string;
  targetCompletionDate?: string;
  missionHorizon: '30_days' | '60_days' | '90_days' | '6_months';
}

export interface CreateMissionPayload {
  title: string;
  targetRoleId: string;
  targetRoleTitle: string;
  targetDomain: string;
  targetCompany?: string;
  missionHorizon: '30_days' | '60_days' | '90_days' | '6_months';
  targetReadiness?: number;
  selectedGapIds?: string[];
}
