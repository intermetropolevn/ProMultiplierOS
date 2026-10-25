import { useState, useEffect } from 'react';
import type { JobListing, RoleBlueprint, CareerOpportunity, UserCareerProfile, SavedJobApplication, MockInterviewSession } from '../types';
import type { BuildOpportunity, BuilderProfile, BuildTeam, MyBuildItem, CareerEvidence } from '../types/builderMatch';
import type { EvidenceItem, StructuredAnswerBlueprint, CandidateStory } from '../features/knowledge/types';
import type { CareerProject } from '../features/projects/types';
import { INITIAL_PROJECTS } from '../features/projects/data/seedProjects';
import type { JobApplication } from '../features/applications/types';
import type { WorkExperienceRecord } from './workExperienceService';
import {
  CURATED_WORK_EXPERIENCES,
  CURATED_EVIDENCE_ITEMS,
  CURATED_JOBS,
  CURATED_OPPORTUNITIES,
  CURATED_ROLES,
  CURATED_BLUEPRINTS,
  CURATED_BUILD_OPPORTUNITIES,
  CURATED_BUILDERS,
  CURATED_TEAMS
} from './curatedBetaData';

export type DemoEntityCategory =
  | 'qa_blueprints'
  | 'projects'
  | 'work_experience'
  | 'jobs'
  | 'opportunities'
  | 'role_blueprints'
  | 'participation'
  | 'builds';

export interface DemoEntityMetadata {
  workspaceAccount?: 'demo-basic';
  isDemoSeed?: boolean;
  createdByDemoUser?: boolean;
  demoCreatedAt?: string;
}

export type DemoWorkExperience = WorkExperienceRecord & DemoEntityMetadata;
export type DemoEvidenceItem = EvidenceItem & DemoEntityMetadata;
export type DemoCareerProject = CareerProject & DemoEntityMetadata;
export type DemoJobListing = JobListing & DemoEntityMetadata;
export type DemoCareerOpportunity = CareerOpportunity & DemoEntityMetadata;
export type DemoRoleBlueprint = RoleBlueprint & DemoEntityMetadata;
export type DemoJobApplication = JobApplication & DemoEntityMetadata;
export type DemoAnswerBlueprint = StructuredAnswerBlueprint & DemoEntityMetadata;
export type DemoBuildOpportunity = BuildOpportunity & DemoEntityMetadata;
export type DemoBuildTeam = BuildTeam & DemoEntityMetadata;
export type DemoMyBuildItem = MyBuildItem & DemoEntityMetadata;

export interface DemoUsageCategoryStatus {
  category: DemoEntityCategory;
  label: string;
  used: number;
  limit: number;
  remaining: number;
  isAtLimit: boolean;
  createdEntityIds: string[];
  createdEntityTitles: string[];
}

export interface DemoSandboxState {
  version: number;
  accountUsername: 'demo-basic';
  initializedAt: string;
  lastResetAt: string;
  profile: UserCareerProfile;
  workExperiences: DemoWorkExperience[];
  evidenceItems: DemoEvidenceItem[];
  projects: DemoCareerProject[];
  stories: CandidateStory[];
  jobs: DemoJobListing[];
  jobStatusOverrides: Record<string, 'active' | 'expired' | 'archived'>;
  deletedJobIds: string[];
  opportunities: DemoCareerOpportunity[];
  roleBlueprints: DemoRoleBlueprint[];
  archivedRoleIds: string[];
  participations: DemoJobApplication[];
  qaBlueprints: DemoAnswerBlueprint[];
  buildOpportunities: DemoBuildOpportunity[];
  builders: BuilderProfile[];
  teams: DemoBuildTeam[];
  myBuilds: DemoMyBuildItem[];
  savedBuildIds: string[];
  savedBuilderIds: string[];
  careerEvidence: CareerEvidence[];
  wishlist: SavedJobApplication[];
  sessions: MockInterviewSession[];
  bookmarkedQuestionIds: string[];
}

const DEMO_SANDBOX_STORAGE_KEY = 'careeros_demo_workspace_sandbox_v2';
export const DEMO_MAX_ENTITIES_PER_CATEGORY = 2;

export const DEMO_USAGE_CATEGORY_LABELS: Record<DemoEntityCategory, string> = {
  qa_blueprints: 'Q&A Blueprints',
  projects: 'Projects',
  work_experience: 'Work Experiences',
  jobs: 'Job Opportunities',
  opportunities: 'Career Opportunities',
  role_blueprints: 'Role Blueprints',
  participation: 'Participation',
  builds: 'Builds'
};

export const DEMO_WORKFLOW_KEY_MAP: Record<string, DemoEntityCategory> = {
  projects: 'projects',
  evidence: 'projects',
  work_experience: 'work_experience',
  work_experiences: 'work_experience',
  jobs: 'jobs',
  opportunities: 'opportunities',
  roles: 'role_blueprints',
  role_blueprints: 'role_blueprints',
  applications: 'participation',
  participation: 'participation',
  blueprints: 'qa_blueprints',
  qa_blueprints: 'qa_blueprints',
  builds: 'builds',
  build_opportunities: 'builds',
  teams: 'builds'
};

/**
 * Pre-seeded Demo-Created Work Experience (1 / 2 in initial Demo Workspace seed state)
 */
const INITIAL_DEMO_CREATED_WORK_EXPERIENCE: DemoWorkExperience = {
  id: 'demo-exp-linear-1',
  company: 'Linear · Product Infrastructure',
  role: 'Staff Product & Systems Lead',
  dates: '2024 — Present',
  location: 'San Francisco, CA (Hybrid)',
  scope: 'Led real-time sync engine reliability, enterprise workspace governance, and multi-region latency architecture across 18,000+ engineering teams.',
  responsibilities: [
    'Architected local-first delta sync protocol reducing initial workspace hydration time by 64%.',
    'Partnered with enterprise security leads to ship automated audit trails and SOC2 role boundaries.',
    'Established cross-functional product quality review cadence across Product, Infra, and Design.'
  ],
  achievements: [
    'Cut p99 client sync latency from 410ms to 38ms across distributed enterprise workspaces.',
    'Unlocked $4.2M in expansion ARR from enterprise accounts requiring granular RBAC governance.',
    'Maintained 99.995% sync availability across 42M daily state mutations.'
  ],
  measurableOutcomes: [
    '38ms p99 sync latency (-90%)',
    '$4.2M enterprise expansion ARR',
    '99.995% sync engine uptime'
  ],
  relevantSkills: ['Product Strategy', 'Distributed Systems', 'Local-First Sync', 'Enterprise Governance', 'SQL & Telemetry'],
  linkedEvidenceId: 'demo-ev-linear-sync',
  provenance: 'manual',
  isDemo: true,
  workspaceAccount: 'demo-basic',
  isDemoSeed: false,
  createdByDemoUser: true,
  demoCreatedAt: '2026-10-15T10:00:00.000Z',
  updatedAt: '2026-10-15T10:00:00.000Z'
};

/**
 * Pre-seeded Demo-Created Participation item (1 / 2 in initial Demo Workspace seed state)
 */
const INITIAL_DEMO_CREATED_PARTICIPATION: DemoJobApplication = {
  id: 'track-demo-ai-arch-workshop',
  jobOpportunityId: 'opp-stanford-ai-workshop',
  companyName: 'Anthropic & Stanford HAI',
  organization: 'Anthropic & Stanford HAI',
  roleTitle: 'Production Agentic Systems & Evaluation Workshop',
  location: 'Palo Alto, CA / Hybrid',
  employmentType: 'Workshop & Technical Cohort',
  pipelineState: 'assessment_case',
  pipelineSubState: 'case_study',
  status: 'INTERVIEW',
  participationType: 'workshop',
  participationStatus: 'ACTIVE',
  unifiedStatus: 'confirmed',
  domain: 'AI & Machine Learning',
  currentStageId: 'active_session',
  currentStageName: 'Lab Evaluation In Progress',
  priority: 'HIGH',
  appliedAt: '2026-10-10T09:00:00.000Z',
  startDate: '2026-10-14T09:00:00.000Z',
  deadline: '2026-11-12T18:00:00.000Z',
  expectedOutcome: 'Published evaluation harness for multi-step tool-use reliability and latency benchmarking.',
  notes: 'Demo Workspace tracked cohort. Completed Session 1 on deterministic evaluation rubrics; preparing capstone architecture review.',
  requirementIds: ['req-demo-1', 'req-demo-2'],
  requirements: [
    {
      id: 'req-demo-1',
      category: 'Required Skills',
      text: 'Design deterministic evaluation harnesses for agentic workflows',
      mappedSkillName: 'AI Evaluation & Benchmarking',
      confidence: 'High'
    },
    {
      id: 'req-demo-2',
      category: 'Required Skills',
      text: 'Balance latency, token economics, and fallback reliability in production',
      mappedSkillName: 'Distributed Systems',
      confidence: 'High'
    }
  ],
  skillIds: ['AI Evaluation & Benchmarking', 'Distributed Systems', 'Product Strategy'],
  knowledgeIds: [],
  assessmentIds: [],
  documents: [],
  keyTakeaways: [
    'Replace open-ended LLM judges with decomposed binary rubric assertions for 94% inter-rater agreement.',
    'Stage tool-execution permissions progressively to prevent cascading side effects.'
  ],
  activities: [
    {
      id: 'act-demo-part-1',
      itemId: 'track-demo-ai-arch-workshop',
      type: 'STAGE_CHANGE',
      title: 'Added to Demo Workspace Participation Tracker (Lab Evaluation In Progress)',
      timestamp: '2026-10-14T09:00:00.000Z'
    }
  ],
  createdAt: '2026-10-14T09:00:00.000Z',
  updatedAt: '2026-10-16T15:30:00.000Z',
  workspaceAccount: 'demo-basic',
  isDemoSeed: false,
  createdByDemoUser: true,
  demoCreatedAt: '2026-10-14T09:00:00.000Z'
};

const INITIAL_DEMO_SEED_PARTICIPATIONS: DemoJobApplication[] = [
  {
    id: 'demo-seed-app-stripe',
    jobOpportunityId: 'curated-job-stripe-platform',
    companyName: 'Stripe',
    organization: 'Stripe',
    roleTitle: 'Senior Platform Software Engineer',
    location: 'San Francisco, CA / Remote (US)',
    employmentType: 'Full-time',
    pipelineState: 'interviews',
    pipelineSubState: 'technical',
    status: 'INTERVIEW',
    participationType: 'career_opportunity',
    participationStatus: 'ACTIVE',
    unifiedStatus: 'confirmed',
    domain: 'Fintech & Payments',
    currentStageId: 'technical',
    currentStageName: 'Technical Architecture Round',
    priority: 'HIGH',
    appliedAt: '2026-10-02T10:00:00.000Z',
    deadline: '2026-10-28T17:00:00.000Z',
    notes: 'Prepared zero-downtime PostgreSQL migration and Redis idempotency deep-dive artifacts.',
    requirementIds: ['req-stripe-1', 'req-stripe-2'],
    requirements: [
      {
        id: 'req-stripe-1',
        category: 'Required Skills',
        text: 'Architect zero-downtime ledger migration pipelines with automated parity checks',
        mappedSkillName: 'Distributed Systems',
        confidence: 'High'
      },
      {
        id: 'req-stripe-2',
        category: 'Required Skills',
        text: 'Enforce distributed idempotency semantics across high-volume event streams',
        mappedSkillName: 'PostgreSQL',
        confidence: 'High'
      }
    ],
    skillIds: ['Distributed Systems', 'PostgreSQL', 'Kafka', 'Idempotency'],
    knowledgeIds: [],
    assessmentIds: [],
    documents: [],
    createdAt: '2026-10-02T10:00:00.000Z',
    updatedAt: '2026-10-12T14:00:00.000Z',
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  },
  {
    id: 'demo-seed-app-figma',
    jobOpportunityId: 'curated-job-figma-pm',
    companyName: 'Figma',
    organization: 'Figma',
    roleTitle: 'Lead Product Manager — Collaborative Workspaces',
    location: 'San Francisco, CA (Hybrid)',
    employmentType: 'Full-time',
    pipelineState: 'assessment_case',
    pipelineSubState: 'product_case' as any,
    status: 'CASE',
    participationType: 'career_opportunity',
    participationStatus: 'ACTIVE',
    unifiedStatus: 'registered',
    domain: 'Enterprise SaaS',
    currentStageId: 'case_study',
    currentStageName: 'Product Strategy Case Review',
    priority: 'HIGH',
    appliedAt: '2026-10-05T11:00:00.000Z',
    deadline: '2026-11-01T18:00:00.000Z',
    notes: 'Structuring enterprise workspace permissions and PLG funnel case study.',
    requirementIds: ['req-figma-1'],
    requirements: [
      {
        id: 'req-figma-1',
        category: 'Required Skills',
        text: 'Drive roadmap execution for multi-team collaborative workspaces',
        mappedSkillName: 'Product Strategy',
        confidence: 'High'
      }
    ],
    skillIds: ['Product Strategy', 'PLG Funnels', 'User Research', 'Enterprise Permissions'],
    knowledgeIds: [],
    assessmentIds: [],
    documents: [],
    createdAt: '2026-10-05T11:00:00.000Z',
    updatedAt: '2026-10-11T09:00:00.000Z',
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  }
];

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function buildInitialDemoSandboxState(): DemoSandboxState {
  const now = new Date().toISOString();

  // Seed Work Experiences: 1 demo-created ("1 / 2") + curated seed records
  const curatedWorkExps = deepClone(CURATED_WORK_EXPERIENCES.slice(0, 5)).map((exp): DemoWorkExperience => ({
    ...exp,
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  }));
  const workExperiences: DemoWorkExperience[] = [
    deepClone(INITIAL_DEMO_CREATED_WORK_EXPERIENCE),
    ...curatedWorkExps
  ];

  // Seed Evidence / Projects: 0 demo-created Projects ("0 / 2") + curated seed evidence items & projects
  const curatedEvidence = deepClone(CURATED_EVIDENCE_ITEMS.slice(0, 5)).map((ev): DemoEvidenceItem => ({
    ...ev,
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  }));

  const curatedProjects = deepClone(INITIAL_PROJECTS.slice(0, 5)).map((proj): DemoCareerProject => ({
    ...proj,
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  }));

  // Seed Jobs & Ecosystem Opportunities: 0 demo-created ("0 / 2") + curated seed records
  const curatedJobs = deepClone(CURATED_JOBS.slice(0, 5)).map((job): DemoJobListing => ({
    ...job,
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  }));

  const curatedOpportunities = deepClone(CURATED_OPPORTUNITIES.slice(0, 5)).map((opp): DemoCareerOpportunity => ({
    ...opp,
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  }));

  // Seed Role Blueprints: 0 demo-created ("0 / 2") + curated seed blueprints
  const curatedRoles = deepClone(CURATED_ROLES.slice(0, 5)).map((role): DemoRoleBlueprint => ({
    ...role,
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  }));

  // Seed Participations: 1 demo-created ("1 / 2") + curated seed participations
  const participations: DemoJobApplication[] = [
    deepClone(INITIAL_DEMO_CREATED_PARTICIPATION),
    ...deepClone(INITIAL_DEMO_SEED_PARTICIPATIONS)
  ];

  // Seed Q&A Blueprints: 0 demo-created ("0 / 2") + curated seed Q&A blueprints
  const curatedQaBlueprints = deepClone(CURATED_BLUEPRINTS.slice(0, 5)).map((bp): DemoAnswerBlueprint => ({
    ...bp,
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  }));

  // Seed Builds: 0 demo-created ("0 / 2") + curated seed build opportunities & teams
  const curatedBuildOpps = deepClone(CURATED_BUILD_OPPORTUNITIES.slice(0, 5)).map((b): DemoBuildOpportunity => ({
    ...b,
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  }));

  const curatedTeams = deepClone(CURATED_TEAMS.slice(0, 5)).map((t): DemoBuildTeam => ({
    ...t,
    workspaceAccount: 'demo-basic',
    isDemoSeed: true,
    createdByDemoUser: false
  }));

  const initialMyBuilds: DemoMyBuildItem[] = [
    {
      id: 'demo-seed-my-build-1',
      opportunityId: curatedBuildOpps[0]?.id || 'build-saas-activation',
      title: curatedBuildOpps[0]?.title || 'Enterprise SaaS Trial-to-Active Workflow Redesign',
      type: 'product_challenge',
      status: 'active',
      role: 'Product Architecture Lead',
      team: ['Demo Practitioner (demo-basic)', 'Liza Hoang'],
      nextMilestone: 'Sandbox Permission Staging Prototype',
      deadline: 'In 14 days',
      contribution: 'Leading progressive permission staging spec & telemetry funnel instrumentation.',
      skills: ['Product Strategy', 'Activation Funnel', 'Enterprise RBAC'],
      date: 'Oct 2026',
      isExperiment: false,
      hasCareerEvidence: false,
      workspaceAccount: 'demo-basic',
      isDemoSeed: true,
      createdByDemoUser: false
    }
  ];

  const initialProfile: UserCareerProfile = {
    name: 'Alex Chen (Demo Workspace)',
    targetRole: 'Product Management',
    targetRoleBlueprintId: 'role-product-mgr',
    targetTitle: 'Senior / Staff Technical Product Manager',
    targetDomain: 'Enterprise SaaS',
    targetIndustryDomains: ['Enterprise SaaS', 'Fintech & Payments', 'AI & Machine Learning'],
    targetLevel: 'Senior',
    targetSalary: '$195,000 - $245,000',
    bookmarkedQuestionIds: ['q-tech-idempotency', 'q-star-disagreement'],
    readinessScore: 82
  };

  const initialWishlist: SavedJobApplication[] = curatedJobs.slice(0, 2).map((job, idx) => ({
    id: `demo-saved-${idx + 1}`,
    jobId: job.id,
    job,
    status: idx === 0 ? 'Applied' : 'Wishlist',
    savedAt: now,
    appliedDate: idx === 0 ? now.split('T')[0] : undefined,
    notes: idx === 0
      ? 'Demo Workspace tracked application — highlighted zero-downtime migration and sync latency outcomes.'
      : 'Saved in Demo Workspace for competency comparison.',
    targetSalary: '$220,000 + Equity'
  }));

  return {
    version: 2,
    accountUsername: 'demo-basic',
    initializedAt: now,
    lastResetAt: now,
    profile: initialProfile,
    workExperiences,
    evidenceItems: curatedEvidence,
    projects: curatedProjects,
    stories: [],
    jobs: curatedJobs,
    jobStatusOverrides: {},
    deletedJobIds: [],
    opportunities: curatedOpportunities,
    roleBlueprints: curatedRoles,
    archivedRoleIds: [],
    participations,
    qaBlueprints: curatedQaBlueprints,
    buildOpportunities: curatedBuildOpps,
    builders: deepClone(CURATED_BUILDERS.slice(0, 5)),
    teams: curatedTeams,
    myBuilds: initialMyBuilds,
    savedBuildIds: [curatedBuildOpps[0]?.id || 'build-saas-activation'],
    savedBuilderIds: ['builder-liza'],
    careerEvidence: [],
    wishlist: initialWishlist,
    sessions: [],
    bookmarkedQuestionIds: ['q-tech-idempotency', 'q-star-disagreement']
  };
}

class DemoWorkspaceServiceManager {
  private _state: DemoSandboxState | null = null;
  private listeners: Set<() => void> = new Set();
  private lastCreationAtByCategory: Partial<Record<DemoEntityCategory, number>> = {};

  private get state(): DemoSandboxState {
    if (!this._state) {
      this._state = this.loadState();
    }
    return this._state;
  }

  private set state(val: DemoSandboxState) {
    this._state = val;
  }

  private loadState(): DemoSandboxState {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(DEMO_SANDBOX_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as DemoSandboxState;
          if (parsed && parsed.version === 2 && Array.isArray(parsed.workExperiences) && Array.isArray(parsed.participations)) {
            if (!Array.isArray(parsed.projects)) {
              parsed.projects = deepClone(INITIAL_PROJECTS.slice(0, 5)).map((proj): DemoCareerProject => ({
                ...proj,
                workspaceAccount: 'demo-basic',
                isDemoSeed: true,
                createdByDemoUser: false
              }));
            }
            return parsed;
          }
        }
      } catch {
        // Fallback to fresh seed state
      }
    }
    const fresh = buildInitialDemoSandboxState();
    this.persistState(fresh);
    return fresh;
  }

  private persistState(nextState?: DemoSandboxState): void {
    if (nextState) {
      this._state = nextState;
    }
    if (typeof window !== 'undefined' && this._state) {
      try {
        localStorage.setItem(DEMO_SANDBOX_STORAGE_KEY, JSON.stringify(this._state));
      } catch (e) {
        console.warn('Failed to persist isolated demo workspace state:', e);
      }
    }
  }

  private checkDuplicateSubmissionGuard(category: DemoEntityCategory): boolean {
    const now = Date.now();
    const last = this.lastCreationAtByCategory[category] || 0;
    if (now - last < 350) {
      return false;
    }
    this.lastCreationAtByCategory[category] = now;
    return true;
  }

  public notifyAll(): void {
    this.listeners.forEach(fn => fn());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('career_demo_workspace_updated'));
      window.dispatchEvent(new CustomEvent('career_jobs_updated'));
      window.dispatchEvent(new CustomEvent('career_opportunities_updated'));
      window.dispatchEvent(new CustomEvent('career_roles_updated'));
      window.dispatchEvent(new CustomEvent('career_applications_updated'));
      window.dispatchEvent(new CustomEvent('builder_match_updated'));
      window.dispatchEvent(new CustomEvent('career_blueprints_updated'));
      window.dispatchEvent(new CustomEvent('career_evidence_updated'));
      window.dispatchEvent(new CustomEvent('career_projects_updated'));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Resets the isolated Demo Workspace back to its original curated seed state.
   * Never touches production/public storage keys.
   */
  public resetDemoWorkspace(): DemoSandboxState {
    this.lastCreationAtByCategory = {};
    const fresh = buildInitialDemoSandboxState();
    this.persistState(fresh);
    this.notifyAll();
    return fresh;
  }

  public getSandboxState(): DemoSandboxState {
    return this.state;
  }

  /**
   * Computes real, entity-backed usage counts directly from demo-created entities
   * stored in the isolated Demo Workspace sandbox across all 8 independent workflows.
   */
  public getCategoryUsage(category: DemoEntityCategory): DemoUsageCategoryStatus {
    const limit = DEMO_MAX_ENTITIES_PER_CATEGORY;
    let createdEntities: { id: string; title: string }[] = [];

    switch (category) {
      case 'projects': {
        const evidenceProjects = (this.state.evidenceItems || [])
          .filter(item => item.createdByDemoUser === true && item.category === 'Projects')
          .map(item => ({ id: item.id, title: item.title }));
        const careerProjects = (this.state.projects || [])
          .filter(proj => proj.createdByDemoUser === true && proj.status !== 'archived')
          .map(proj => ({ id: proj.id, title: proj.title }));
        const map = new Map<string, string>();
        [...careerProjects, ...evidenceProjects].forEach(item => map.set(item.id, item.title));
        createdEntities = Array.from(map.entries()).map(([id, title]) => ({ id, title }));
        break;
      }
      case 'work_experience': {
        createdEntities = this.state.workExperiences
          .filter(item => item.createdByDemoUser === true)
          .map(item => ({ id: item.id, title: `${item.role} · ${item.company}` }));
        break;
      }
      case 'jobs': {
        createdEntities = this.state.jobs
          .filter(j => j.createdByDemoUser === true && !this.state.deletedJobIds.includes(j.id))
          .map(j => ({ id: j.id, title: `${j.title} (${j.company})` }));
        break;
      }
      case 'opportunities': {
        createdEntities = this.state.opportunities
          .filter(o => o.createdByDemoUser === true)
          .map(o => ({ id: o.id, title: o.title }));
        break;
      }
      case 'role_blueprints': {
        createdEntities = this.state.roleBlueprints
          .filter(r => r.createdByDemoUser === true && !this.state.archivedRoleIds.includes(r.id))
          .map(r => ({ id: r.id, title: r.title }));
        break;
      }
      case 'participation': {
        createdEntities = this.state.participations
          .filter(p => p.createdByDemoUser === true)
          .map(p => ({ id: p.id, title: `${p.roleTitle} · ${p.organization || p.companyName}` }));
        break;
      }
      case 'qa_blueprints': {
        createdEntities = this.state.qaBlueprints
          .filter(bp => bp.createdByDemoUser === true)
          .map(bp => ({ id: bp.id, title: bp.questionText || bp.title || bp.id }));
        break;
      }
      case 'builds': {
        const completedOpportunityIds = new Set(
          this.state.myBuilds
            .filter(m => m.status === 'completed' && m.opportunityId)
            .map(m => m.opportunityId!)
        );
        const buildOpps = this.state.buildOpportunities
          .filter(b => b.createdByDemoUser === true && !completedOpportunityIds.has(b.id))
          .map(b => ({ key: b.id, title: b.title }));
        const joinedActiveBuilds = this.state.myBuilds
          .filter(m => m.createdByDemoUser === true && m.status !== 'completed')
          .map(m => ({ key: m.opportunityId || m.id, title: m.title }));
        const buildTeams = this.state.teams
          .filter(t => t.createdByDemoUser === true)
          .map(t => ({ key: t.challengeId || t.id, title: t.name }));
        // Deduplicate by canonical build key so creating + auto-joining a build counts as 1 active build
        const map = new Map<string, string>();
        [...buildOpps, ...joinedActiveBuilds, ...buildTeams].forEach(item => {
          if (!map.has(item.key)) {
            map.set(item.key, item.title);
          }
        });
        createdEntities = Array.from(map.entries()).map(([id, title]) => ({ id, title }));
        break;
      }
    }

    const used = createdEntities.length;
    return {
      category,
      label: DEMO_USAGE_CATEGORY_LABELS[category],
      used,
      limit,
      remaining: Math.max(0, limit - used),
      isAtLimit: used >= limit,
      createdEntityIds: createdEntities.map(e => e.id),
      createdEntityTitles: createdEntities.map(e => e.title)
    };
  }

  public getAllUsageBreakdowns(): DemoUsageCategoryStatus[] {
    const order: DemoEntityCategory[] = [
      'qa_blueprints',
      'projects',
      'work_experience',
      'jobs',
      'opportunities',
      'role_blueprints',
      'participation',
      'builds'
    ];
    return order.map(cat => this.getCategoryUsage(cat));
  }

  public canCreateEntity(category: DemoEntityCategory): {
    allowed: boolean;
    used: number;
    limit: number;
    reason?: string;
  } {
    const status = this.getCategoryUsage(category);
    if (status.isAtLimit) {
      return {
        allowed: false,
        used: status.used,
        limit: status.limit,
        reason: 'Demo limit reached'
      };
    }
    return {
      allowed: true,
      used: status.used,
      limit: status.limit
    };
  }

  // ============================================================================
  // ISOLATED CRUD OPERATIONS FOR EACH MODULE
  // ============================================================================

  // 1. Work Experience
  public getWorkExperiences(): DemoWorkExperience[] {
    return [...this.state.workExperiences];
  }

  public saveWorkExperiences(records: WorkExperienceRecord[], markNewAsDemoCreated = true): void {
    const existingMap = new Map(this.state.workExperiences.map(r => [r.id, r]));
    let newItemsCount = 0;
    const currentUsage = this.getCategoryUsage('work_experience');

    const nextRecords: DemoWorkExperience[] = [];
    for (const r of records) {
      const prev = existingMap.get(r.id);
      if (prev) {
        nextRecords.push({
          ...r,
          workspaceAccount: 'demo-basic',
          isDemoSeed: prev.isDemoSeed,
          createdByDemoUser: prev.createdByDemoUser,
          demoCreatedAt: prev.demoCreatedAt
        });
      } else {
        if (markNewAsDemoCreated) {
          if (currentUsage.used + newItemsCount >= DEMO_MAX_ENTITIES_PER_CATEGORY) {
            continue;
          }
          if (newItemsCount === 0 && !this.checkDuplicateSubmissionGuard('work_experience')) {
            continue;
          }
          newItemsCount++;
        }
        nextRecords.push({
          ...r,
          workspaceAccount: 'demo-basic',
          isDemoSeed: !markNewAsDemoCreated,
          createdByDemoUser: markNewAsDemoCreated,
          demoCreatedAt: new Date().toISOString()
        });
      }
    }

    this.state.workExperiences = nextRecords;
    this.persistState();
    this.notifyAll();
  }

  // 2. Evidence & Projects
  public getEvidenceItems(): DemoEvidenceItem[] {
    return [...this.state.evidenceItems];
  }

  public saveEvidenceItems(items: EvidenceItem[], markNewAsDemoCreated = true): void {
    const existingMap = new Map(this.state.evidenceItems.map(i => [i.id, i]));
    const currentUsage = this.getCategoryUsage('projects');
    let newProjectsCount = 0;

    const nextItems: DemoEvidenceItem[] = [];
    for (const item of items) {
      const prev = existingMap.get(item.id);
      if (prev) {
        nextItems.push({
          ...item,
          workspaceAccount: 'demo-basic',
          isDemoSeed: prev.isDemoSeed,
          createdByDemoUser: prev.createdByDemoUser,
          demoCreatedAt: prev.demoCreatedAt
        });
      } else {
        // Note: If an EvidenceItem was auto-created from WorkExperienceService (category === 'Experience'),
        // it is linked to Work Experience so we only count category === 'Projects' towards Projects (0 / 2).
        const isProject = item.category === 'Projects';
        if (markNewAsDemoCreated && isProject) {
          if (currentUsage.used + newProjectsCount >= DEMO_MAX_ENTITIES_PER_CATEGORY) {
            continue;
          }
          if (newProjectsCount === 0 && !this.checkDuplicateSubmissionGuard('projects')) {
            continue;
          }
          newProjectsCount++;
        }
        nextItems.push({
          ...item,
          workspaceAccount: 'demo-basic',
          isDemoSeed: !markNewAsDemoCreated,
          createdByDemoUser: markNewAsDemoCreated && isProject,
          demoCreatedAt: new Date().toISOString()
        });
      }
    }

    this.state.evidenceItems = nextItems;
    this.persistState();
    this.notifyAll();
  }

  public getProjects(): DemoCareerProject[] {
    return [...(this.state.projects || [])];
  }

  public saveProjects(projects: CareerProject[], markNewAsDemoCreated = true): void {
    const existingMap = new Map((this.state.projects || []).map(p => [p.id, p]));
    const currentUsage = this.getCategoryUsage('projects');
    let newProjectsCount = 0;

    const nextProjects: DemoCareerProject[] = [];
    for (const proj of projects) {
      const prev = existingMap.get(proj.id);
      if (prev) {
        nextProjects.push({
          ...proj,
          workspaceAccount: 'demo-basic',
          isDemoSeed: prev.isDemoSeed,
          createdByDemoUser: prev.createdByDemoUser,
          demoCreatedAt: prev.demoCreatedAt
        });
      } else {
        if (markNewAsDemoCreated) {
          if (currentUsage.used + newProjectsCount >= DEMO_MAX_ENTITIES_PER_CATEGORY) {
            continue;
          }
          if (newProjectsCount === 0 && !this.checkDuplicateSubmissionGuard('projects')) {
            continue;
          }
          newProjectsCount++;
        }
        nextProjects.push({
          ...proj,
          workspaceAccount: 'demo-basic',
          isDemoSeed: !markNewAsDemoCreated,
          createdByDemoUser: markNewAsDemoCreated,
          demoCreatedAt: new Date().toISOString()
        });
      }
    }

    this.state.projects = nextProjects;
    this.persistState();
    this.notifyAll();
  }

  // 3. Jobs & Ecosystem Opportunities
  public getJobs(): DemoJobListing[] {
    return this.state.jobs.filter(j => !this.state.deletedJobIds.includes(j.id));
  }

  public getJobStatusOverrides(): Record<string, 'active' | 'expired' | 'archived'> {
    return { ...this.state.jobStatusOverrides };
  }

  public setJobStatusOverride(jobId: string, status: 'active' | 'expired' | 'archived'): void {
    this.state.jobStatusOverrides[jobId] = status;
    this.persistState();
    this.notifyAll();
  }

  public addOrUpdateJob(job: JobListing, isNewCreation = false): DemoJobListing {
    const idx = this.state.jobs.findIndex(j => j.id === job.id);
    if (idx >= 0) {
      const prev = this.state.jobs[idx];
      const updated: DemoJobListing = {
        ...job,
        workspaceAccount: 'demo-basic',
        isDemoSeed: prev.isDemoSeed,
        createdByDemoUser: prev.createdByDemoUser,
        demoCreatedAt: prev.demoCreatedAt
      };
      this.state.jobs[idx] = updated;
      this.persistState();
      this.notifyAll();
      return updated;
    }

    if (isNewCreation) {
      const usage = this.getCategoryUsage('jobs');
      if (usage.isAtLimit || !this.checkDuplicateSubmissionGuard('jobs')) {
        return (this.state.jobs[0] || { ...job, workspaceAccount: 'demo-basic' }) as DemoJobListing;
      }
    }

    const created: DemoJobListing = {
      ...job,
      workspaceAccount: 'demo-basic',
      isDemoSeed: !isNewCreation,
      createdByDemoUser: isNewCreation,
      demoCreatedAt: new Date().toISOString()
    };
    this.state.jobs.unshift(created);
    this.persistState();
    this.notifyAll();
    return created;
  }

  public deleteJob(jobId: string): void {
    this.state.jobs = this.state.jobs.filter(j => j.id !== jobId || j.isDemoSeed);
    if (!this.state.deletedJobIds.includes(jobId)) {
      this.state.deletedJobIds.push(jobId);
    }
    this.persistState();
    this.notifyAll();
  }

  public getOpportunities(): DemoCareerOpportunity[] {
    return [...this.state.opportunities];
  }

  public saveOpportunities(opps: CareerOpportunity[], markNewAsDemoCreated = true): void {
    const existingMap = new Map(this.state.opportunities.map(o => [o.id, o]));
    const currentUsage = this.getCategoryUsage('opportunities');
    let newOppsCount = 0;

    const nextOpps: DemoCareerOpportunity[] = [];
    for (const opp of opps) {
      const prev = existingMap.get(opp.id);
      if (prev) {
        nextOpps.push({
          ...opp,
          workspaceAccount: 'demo-basic',
          isDemoSeed: prev.isDemoSeed,
          createdByDemoUser: prev.createdByDemoUser,
          demoCreatedAt: prev.demoCreatedAt
        });
      } else {
        if (markNewAsDemoCreated) {
          if (currentUsage.used + newOppsCount >= DEMO_MAX_ENTITIES_PER_CATEGORY) {
            continue;
          }
          if (newOppsCount === 0 && !this.checkDuplicateSubmissionGuard('opportunities')) {
            continue;
          }
          newOppsCount++;
        }
        nextOpps.push({
          ...opp,
          workspaceAccount: 'demo-basic',
          isDemoSeed: !markNewAsDemoCreated,
          createdByDemoUser: markNewAsDemoCreated,
          demoCreatedAt: new Date().toISOString()
        });
      }
    }

    this.state.opportunities = nextOpps;
    this.persistState();
    this.notifyAll();
  }

  // 4. Role Blueprints
  public getRoleBlueprints(): DemoRoleBlueprint[] {
    return this.state.roleBlueprints.filter(r => !this.state.archivedRoleIds.includes(r.id));
  }

  public addOrUpdateRoleBlueprint(blueprint: RoleBlueprint, isNewCreation = false): DemoRoleBlueprint {
    const idx = this.state.roleBlueprints.findIndex(r => r.id === blueprint.id);
    if (idx >= 0) {
      const prev = this.state.roleBlueprints[idx];
      const updated: DemoRoleBlueprint = {
        ...blueprint,
        workspaceAccount: 'demo-basic',
        isDemoSeed: prev.isDemoSeed,
        createdByDemoUser: prev.createdByDemoUser,
        demoCreatedAt: prev.demoCreatedAt
      };
      this.state.roleBlueprints[idx] = updated;
      this.persistState();
      this.notifyAll();
      return updated;
    }

    if (isNewCreation) {
      const usage = this.getCategoryUsage('role_blueprints');
      if (usage.isAtLimit || !this.checkDuplicateSubmissionGuard('role_blueprints')) {
        return (this.state.roleBlueprints[0] || { ...blueprint, workspaceAccount: 'demo-basic' }) as DemoRoleBlueprint;
      }
    }

    const created: DemoRoleBlueprint = {
      ...blueprint,
      workspaceAccount: 'demo-basic',
      isDemoSeed: !isNewCreation,
      createdByDemoUser: isNewCreation,
      demoCreatedAt: new Date().toISOString()
    };
    this.state.roleBlueprints.unshift(created);
    this.persistState();
    this.notifyAll();
    return created;
  }

  public archiveRoleBlueprint(roleId: string): void {
    this.state.roleBlueprints = this.state.roleBlueprints.filter(r => r.id !== roleId || r.isDemoSeed);
    if (!this.state.archivedRoleIds.includes(roleId)) {
      this.state.archivedRoleIds.push(roleId);
    }
    this.persistState();
    this.notifyAll();
  }

  // 5. Participation Tracker
  public getParticipations(): DemoJobApplication[] {
    return [...this.state.participations];
  }

  public saveParticipation(app: JobApplication, isNewCreation = false): DemoJobApplication {
    const idx = this.state.participations.findIndex(a => a.id === app.id);
    if (idx >= 0) {
      const prev = this.state.participations[idx];
      const updated: DemoJobApplication = {
        ...app,
        workspaceAccount: 'demo-basic',
        isDemoSeed: prev.isDemoSeed,
        createdByDemoUser: prev.createdByDemoUser,
        demoCreatedAt: prev.demoCreatedAt
      };
      this.state.participations[idx] = updated;
      this.persistState();
      this.notifyAll();
      return updated;
    }

    if (isNewCreation) {
      const usage = this.getCategoryUsage('participation');
      if (usage.isAtLimit || !this.checkDuplicateSubmissionGuard('participation')) {
        return (this.state.participations[0] || { ...app, workspaceAccount: 'demo-basic' }) as DemoJobApplication;
      }
    }

    const created: DemoJobApplication = {
      ...app,
      workspaceAccount: 'demo-basic',
      isDemoSeed: !isNewCreation,
      createdByDemoUser: isNewCreation,
      demoCreatedAt: new Date().toISOString()
    };
    this.state.participations.unshift(created);
    this.persistState();
    this.notifyAll();
    return created;
  }

  public deleteParticipation(id: string): boolean {
    const before = this.state.participations.length;
    this.state.participations = this.state.participations.filter(a => a.id !== id);
    this.persistState();
    this.notifyAll();
    return this.state.participations.length < before;
  }

  // 6. Q&A Blueprints
  public getQaBlueprints(): DemoAnswerBlueprint[] {
    return [...this.state.qaBlueprints];
  }

  public saveQaBlueprints(blueprints: StructuredAnswerBlueprint[], markNewAsDemoCreated = true): void {
    const existingMap = new Map(this.state.qaBlueprints.map(b => [b.id, b]));
    const currentUsage = this.getCategoryUsage('qa_blueprints');
    let newCount = 0;

    const nextBlueprints: DemoAnswerBlueprint[] = [];
    for (const bp of blueprints) {
      const prev = existingMap.get(bp.id);
      if (prev) {
        nextBlueprints.push({
          ...bp,
          workspaceAccount: 'demo-basic',
          isDemoSeed: prev.isDemoSeed,
          createdByDemoUser: prev.createdByDemoUser,
          demoCreatedAt: prev.demoCreatedAt
        });
      } else {
        if (markNewAsDemoCreated) {
          if (currentUsage.used + newCount >= DEMO_MAX_ENTITIES_PER_CATEGORY) {
            continue;
          }
          if (newCount === 0 && !this.checkDuplicateSubmissionGuard('qa_blueprints')) {
            continue;
          }
          newCount++;
        }
        nextBlueprints.push({
          ...bp,
          workspaceAccount: 'demo-basic',
          isDemoSeed: !markNewAsDemoCreated,
          createdByDemoUser: markNewAsDemoCreated,
          demoCreatedAt: new Date().toISOString()
        });
      }
    }

    this.state.qaBlueprints = nextBlueprints;
    this.persistState();
    this.notifyAll();
  }

  // 7. Builds (Builder Match)
  public getBuildOpportunities(): DemoBuildOpportunity[] {
    return this.state.buildOpportunities.map(b => ({
      ...b,
      isSaved: this.state.savedBuildIds.includes(b.id)
    }));
  }

  public saveBuildOpportunity(opp: BuildOpportunity, isNewCreation = false): DemoBuildOpportunity {
    const idx = this.state.buildOpportunities.findIndex(b => b.id === opp.id);
    if (idx >= 0) {
      const prev = this.state.buildOpportunities[idx];
      const updated: DemoBuildOpportunity = {
        ...opp,
        workspaceAccount: 'demo-basic',
        isDemoSeed: prev.isDemoSeed,
        createdByDemoUser: prev.createdByDemoUser,
        demoCreatedAt: prev.demoCreatedAt
      };
      this.state.buildOpportunities[idx] = updated;
      this.persistState();
      this.notifyAll();
      return updated;
    }

    if (isNewCreation) {
      const usage = this.getCategoryUsage('builds');
      if (usage.isAtLimit || !this.checkDuplicateSubmissionGuard('builds')) {
        return (this.state.buildOpportunities[0] || { ...opp, workspaceAccount: 'demo-basic' }) as DemoBuildOpportunity;
      }
    }

    const created: DemoBuildOpportunity = {
      ...opp,
      workspaceAccount: 'demo-basic',
      isDemoSeed: !isNewCreation,
      createdByDemoUser: isNewCreation,
      demoCreatedAt: new Date().toISOString()
    };
    this.state.buildOpportunities.unshift(created);
    this.persistState();
    this.notifyAll();
    return created;
  }

  public getBuilders(): BuilderProfile[] {
    return this.state.builders.map(b => ({
      ...b,
      isSaved: this.state.savedBuilderIds.includes(b.id)
    }));
  }

  public getTeams(): DemoBuildTeam[] {
    return [...this.state.teams];
  }

  public addTeam(team: BuildTeam): DemoBuildTeam {
    const usage = this.getCategoryUsage('builds');
    const isLinkedToExistingDemoBuild = Boolean(
      team.challengeId && usage.createdEntityIds.includes(team.challengeId)
    );
    if (!isLinkedToExistingDemoBuild && (usage.isAtLimit || !this.checkDuplicateSubmissionGuard('builds'))) {
      return (this.state.teams[0] || { ...team, workspaceAccount: 'demo-basic' }) as DemoBuildTeam;
    }

    const created: DemoBuildTeam = {
      ...team,
      workspaceAccount: 'demo-basic',
      isDemoSeed: false,
      createdByDemoUser: true,
      demoCreatedAt: new Date().toISOString()
    };
    this.state.teams.unshift(created);
    this.persistState();
    this.notifyAll();
    return created;
  }

  public getMyBuilds(): DemoMyBuildItem[] {
    return [...this.state.myBuilds];
  }

  public saveMyBuilds(items: MyBuildItem[], markNewAsDemoCreated = true): void {
    const existingMap = new Map(this.state.myBuilds.map(m => [m.id, m]));
    const currentUsage = this.getCategoryUsage('builds');
    let newCount = 0;

    const nextMyBuilds: DemoMyBuildItem[] = [];
    for (const item of items) {
      const prev = existingMap.get(item.id);
      if (prev) {
        nextMyBuilds.push({
          ...item,
          workspaceAccount: 'demo-basic',
          isDemoSeed: prev.isDemoSeed,
          createdByDemoUser: prev.createdByDemoUser,
          demoCreatedAt: prev.demoCreatedAt
        });
      } else {
        const canonicalKey = item.opportunityId || item.id;
        const alreadyCountedInDemoBuilds = currentUsage.createdEntityIds.includes(canonicalKey);
        if (markNewAsDemoCreated && !alreadyCountedInDemoBuilds) {
          if (currentUsage.used + newCount >= DEMO_MAX_ENTITIES_PER_CATEGORY) {
            continue;
          }
          newCount++;
        }
        nextMyBuilds.push({
          ...item,
          workspaceAccount: 'demo-basic',
          isDemoSeed: !markNewAsDemoCreated,
          createdByDemoUser: markNewAsDemoCreated,
          demoCreatedAt: new Date().toISOString()
        });
      }
    }

    this.state.myBuilds = nextMyBuilds;
    this.persistState();
    this.notifyAll();
  }

  public getSavedBuildIds(): string[] {
    return [...this.state.savedBuildIds];
  }

  public toggleSaveBuild(id: string): boolean {
    const idx = this.state.savedBuildIds.indexOf(id);
    let isNowSaved = false;
    if (idx >= 0) {
      this.state.savedBuildIds.splice(idx, 1);
      isNowSaved = false;
    } else {
      this.state.savedBuildIds.push(id);
      isNowSaved = true;
    }
    this.persistState();
    this.notifyAll();
    return isNowSaved;
  }

  public getSavedBuilderIds(): string[] {
    return [...this.state.savedBuilderIds];
  }

  public toggleSaveBuilder(id: string): boolean {
    const idx = this.state.savedBuilderIds.indexOf(id);
    let isNowSaved = false;
    if (idx >= 0) {
      this.state.savedBuilderIds.splice(idx, 1);
      isNowSaved = false;
    } else {
      this.state.savedBuilderIds.push(id);
      isNowSaved = true;
    }
    this.persistState();
    this.notifyAll();
    return isNowSaved;
  }

  // 8. Profile, Wishlist & Sessions in Demo Sandbox
  public getProfile(): UserCareerProfile {
    return { ...this.state.profile };
  }

  public saveProfile(updates: Partial<UserCareerProfile>): UserCareerProfile {
    this.state.profile = { ...this.state.profile, ...updates };
    this.persistState();
    return { ...this.state.profile };
  }

  public getWishlist(): SavedJobApplication[] {
    return [...this.state.wishlist];
  }

  public saveWishlist(items: SavedJobApplication[]): SavedJobApplication[] {
    this.state.wishlist = [...items];
    this.persistState();
    return [...this.state.wishlist];
  }

  public getSessions(): MockInterviewSession[] {
    return [...this.state.sessions];
  }

  public saveSessions(sessions: MockInterviewSession[]): MockInterviewSession[] {
    this.state.sessions = [...sessions];
    this.persistState();
    return [...this.state.sessions];
  }

  public getBookmarks(): string[] {
    return [...this.state.bookmarkedQuestionIds];
  }

  public saveBookmarks(ids: string[]): string[] {
    this.state.bookmarkedQuestionIds = [...ids];
    this.persistState();
    return [...this.state.bookmarkedQuestionIds];
  }
}

export const demoWorkspaceService = new DemoWorkspaceServiceManager();

/**
 * React hook for live entity-backed Demo Workspace usage and reset controls.
 */
export function useDemoWorkspace() {
  const [usageBreakdowns, setUsageBreakdowns] = useState<DemoUsageCategoryStatus[]>(() =>
    demoWorkspaceService.getAllUsageBreakdowns()
  );
  const [lastResetAt, setLastResetAt] = useState<string>(() =>
    demoWorkspaceService.getSandboxState().lastResetAt
  );

  useEffect(() => {
    const refresh = () => {
      setUsageBreakdowns(demoWorkspaceService.getAllUsageBreakdowns());
      setLastResetAt(demoWorkspaceService.getSandboxState().lastResetAt);
    };
    const unsubscribe = demoWorkspaceService.subscribe(refresh);
    window.addEventListener('career_demo_workspace_updated', refresh);
    window.addEventListener('career_access_changed', refresh);
    return () => {
      unsubscribe();
      window.removeEventListener('career_demo_workspace_updated', refresh);
      window.removeEventListener('career_access_changed', refresh);
    };
  }, []);

  return {
    usageBreakdowns,
    lastResetAt,
    getCategoryUsage: (category: DemoEntityCategory) => demoWorkspaceService.getCategoryUsage(category),
    canCreateEntity: (category: DemoEntityCategory) => demoWorkspaceService.canCreateEntity(category),
    resetDemoWorkspace: () => demoWorkspaceService.resetDemoWorkspace()
  };
}
