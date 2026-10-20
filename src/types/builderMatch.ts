export type BuildOpportunityType =
  | 'business_challenge'
  | 'product_challenge'
  | 'tech_challenge'
  | 'ai_experiment'
  | 'growth_experiment'
  | 'hackathon'
  | 'open_innovation'
  | 'social_impact'
  | 'product_idea'
  | 'prototype_opportunity'
  | 'research_to_product';

export type BuildIntent =
  | 'all'
  | 'solve_challenge'
  | 'build_product'
  | 'run_experiment'
  | 'validate_idea'
  | 'build_prototype'
  | 'join_hackathon'
  | 'find_cobuilder'
  | 'social_impact'
  | 'commercialize_research';

export type BuildStatus =
  | 'open'
  | 'recruiting'
  | 'in_progress'
  | 'experimenting'
  | 'completed'
  | 'archived';

export interface BuilderEvidenceItem {
  id: string;
  title: string;
  role: string;
  outcome: string;
  artifacts?: string[];
  metrics?: string;
  skills: string[];
}

export interface BuilderProfile {
  id: string;
  name: string;
  handle: string;
  headline: string;
  avatar: string;
  location: string;
  primaryRole: string; // e.g. "Product Lead", "AI Engineer", "Product Designer"
  capabilities: string[];
  skills: string[];
  availability: string; // e.g. "10-15 hrs/week · Evenings & Weekends"
  matchScore: number; // e.g. 94
  whyMatch: string[];
  evidence: BuilderEvidenceItem[];
  potentialGap: string; // e.g. "AI Engineering — Moderate"
  pastBuildsCount: number;
  verifiedEvidenceCount: number;
  isSaved?: boolean;
  isOpenToTeams?: boolean;
}

export interface BuildResource {
  name: string;
  type: 'data' | 'api' | 'product' | 'design_system' | 'sme' | 'budget' | 'users' | 'support';
  detail: string;
}

export interface BuildChallengeDeepDive {
  context: string;
  currentSituation: string;
  problem: string;
  whyItMatters: string;
  whatHasBeenTried: string;
  constraints: string[];
}

export interface BuildReadinessAnalysis {
  score: number; // 0-100
  strengths: string[];
  gaps: string[];
  whatToCloseGap: string[];
}

export interface RecommendedKnowledgeItem {
  id: string;
  title: string;
  category: 'Course' | 'Framework' | 'Article' | 'Tool' | 'Case Study';
  duration?: string;
  tag: string;
  relevanceReason: string;
}

export interface BuildOpportunity {
  id: string;
  title: string;
  intent: BuildIntent;
  type: BuildOpportunityType;
  status: BuildStatus;
  creator: {
    name: string;
    organization?: string;
    type: 'company' | 'startup' | 'individual' | 'community' | 'lab';
    avatar?: string;
    verified?: boolean;
  };
  domain: string;
  duration: string;
  teamSizeNeeded: string;
  difficulty: 'Introductory' | 'Intermediate' | 'Advanced' | 'Expert';
  workMode: 'Remote' | 'Hybrid' | 'Flexible';
  matchScore: number; // e.g. 94
  shortDescription: string;
  challenge: BuildChallengeDeepDive;
  expectedOutcomes: string[];
  availableResources: BuildResource[];
  idealBuilderProfile: {
    capabilities: string[];
    suggestedRoles: string[];
    experienceLevel: string;
  };
  recommendedBuilders: BuilderProfile[];
  userReadiness: BuildReadinessAnalysis;
  recommendedKnowledge: RecommendedKnowledgeItem[];
  tags: string[];
  isSaved?: boolean;
  isExperiment?: boolean;
  experimentDetails?: {
    hypothesis: string;
    testDurationDays: number;
    successMetric: string;
    status: 'hypothesizing' | 'recruiting' | 'running' | 'analyzed';
  };
  createdAt: string;
  deadline?: string;
  joinedAsRole?: string;
}

export interface BuildTeamMember {
  builder: BuilderProfile;
  role: string;
  isLead?: boolean;
  status: 'confirmed' | 'invited' | 'pending';
}

export interface BuildTeam {
  id: string;
  name: string;
  challengeId?: string;
  challengeTitle?: string;
  purpose: string;
  targetOutcome: string;
  requiredCapabilities: string[];
  teamFitScore: number; // 0-100
  fitStrengths: string[];
  fitGaps: string[];
  members: BuildTeamMember[];
  neededRoles: string[];
  duration: string;
  workMode: string;
  createdAt: string;
  status: 'recruiting' | 'ready' | 'building' | 'completed';
}

export interface CareerEvidence {
  id: string;
  buildId: string;
  challenge: string;
  role: string;
  whatBuilt: string;
  skills: string[];
  duration: string;
  outcome: string;
  metrics: string;
  teamMembers: string[];
  artifacts: { label: string; url: string }[];
  verifiedAt: string;
  readinessBoost: number; // e.g. 8
}

export interface MyBuildItem {
  id: string;
  opportunityId?: string;
  title: string;
  type: BuildOpportunityType;
  status: 'active' | 'experiment' | 'completed';
  role: string;
  team: string[];
  nextMilestone?: string;
  deadline?: string;
  contribution?: string;
  outcome?: string;
  metrics?: string;
  skills: string[];
  artifacts?: { name: string; url: string; type: string }[];
  date: string;
  isExperiment?: boolean;
  hasCareerEvidence?: boolean;
  careerEvidence?: CareerEvidence;
}
