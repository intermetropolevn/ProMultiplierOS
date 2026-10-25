import { 
  CareerMission, 
  GrowthLoopStep, 
  MissionCapabilityGap, 
  CreateMissionPayload,
  GrowthLoopStage
} from '../types/careerMission';
import { INITIAL_CAREER_MISSIONS } from '../data/careerMissionData';
import { curatedBetaData } from './curatedBetaData';
import { AccessControlService } from './accessControlService';

const MISSIONS_STORAGE_KEY = 'career_os_missions_v1';
const ACTIVE_MISSION_ID_KEY = 'career_os_active_mission_id_v1';

export class CareerMissionService {
  /**
   * Retrieve all missions from localStorage or initialize with seed data
   */
  public static getAllMissions(): CareerMission[] {
    const access = AccessControlService.getAccessLevel();

    if (curatedBetaData.isCuratedBetaActive()) {
      const curated = curatedBetaData.getCareerMissions();
      if (access === 'DEMO') {
        try {
          const data = localStorage.getItem(MISSIONS_STORAGE_KEY);
          if (data) {
            const parsed: CareerMission[] = JSON.parse(data);
            const userCreated = parsed.filter(item => !INITIAL_CAREER_MISSIONS.some(init => init.id === item.id));
            return [...userCreated.slice(0, 2), ...curated];
          }
        } catch {
          // Ignore
        }
      }
      return curated;
    }

    try {
      const data = localStorage.getItem(MISSIONS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to parse career missions from storage:', e);
    }
    // Initialize default seeds
    this.saveMissions(INITIAL_CAREER_MISSIONS);
    return INITIAL_CAREER_MISSIONS;
  }

  /**
   * Save missions to storage and broadcast event
   */
  public static saveMissions(missions: CareerMission[]): void {
    try {
      localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(missions));
      window.dispatchEvent(new CustomEvent('career_mission_updated'));
    } catch (e) {
      console.warn('Failed to save career missions to storage:', e);
    }
  }

  /**
   * Get the current active mission
   */
  public static getActiveMission(): CareerMission | null {
    const missions = this.getAllMissions();
    const activeId = localStorage.getItem(ACTIVE_MISSION_ID_KEY);
    
    if (activeId) {
      const found = missions.find(m => m.id === activeId);
      if (found) return found;
    }

    const firstActive = missions.find(m => m.status === 'active');
    if (firstActive) {
      this.setActiveMission(firstActive.id);
      return firstActive;
    }

    return missions.length > 0 ? missions[0] : null;
  }

  /**
   * Set a specific mission as active
   */
  public static setActiveMission(missionId: string): CareerMission | null {
    const missions = this.getAllMissions();
    const target = missions.find(m => m.id === missionId);
    if (!target) return null;

    const updated = missions.map(m => ({
      ...m,
      status: (m.id === missionId ? 'active' : (m.status === 'active' ? 'paused' : m.status)) as CareerMission['status']
    }));

    localStorage.setItem(ACTIVE_MISSION_ID_KEY, missionId);
    this.saveMissions(updated);
    return target;
  }

  /**
   * Create a new mission and set as active
   */
  public static createMission(payload: CreateMissionPayload): CareerMission {
    const missions = this.getAllMissions();
    const userCreatedCount = missions.filter(m => !INITIAL_CAREER_MISSIONS.some(init => init.id === m.id)).length;
    const decision = AccessControlService.canCreateWorkflowItem('missions', userCreatedCount);
    if (!decision.allowed) {
      console.warn('Mission creation blocked by access control:', decision.reason);
      throw new Error(decision.reason || 'Creation restricted by active access tier.');
    }
    
    // Auto-diagnose gaps if not fully provided
    const diagnosis = this.diagnoseGapsForRole(payload.targetRoleTitle, payload.targetDomain);
    const generatedSteps = this.generateGrowthLoopSteps(payload.targetRoleTitle, diagnosis.gaps);

    const newMission: CareerMission = {
      id: `mission-${Date.now()}`,
      title: payload.title || `Prepare for ${payload.targetRoleTitle}`,
      tagline: `Structured Growth Loop toward high-conviction readiness for ${payload.targetRoleTitle}`,
      targetRoleId: payload.targetRoleId,
      targetRoleTitle: payload.targetRoleTitle,
      targetDomain: payload.targetDomain || 'Technology & Innovation',
      targetCompany: payload.targetCompany,
      status: 'active',
      currentStage: 'learn',
      baselineReadiness: diagnosis.readiness,
      currentReadiness: diagnosis.readiness,
      targetReadiness: payload.targetReadiness || 90,
      capabilityGaps: diagnosis.gaps,
      steps: generatedSteps,
      nextBestActionId: generatedSteps[0]?.id || '',
      evidenceIds: [],
      completedBuildIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      missionHorizon: payload.missionHorizon || '90_days'
    };

    // Pause current active missions
    const updated = missions.map(m => ({
      ...m,
      status: (m.status === 'active' ? 'paused' : m.status) as CareerMission['status']
    }));

    updated.unshift(newMission);
    this.saveMissions(updated);
    localStorage.setItem(ACTIVE_MISSION_ID_KEY, newMission.id);
    return newMission;
  }

  /**
   * Update an existing mission
   */
  public static updateMission(missionId: string, updates: Partial<CareerMission>): CareerMission | null {
    const missions = this.getAllMissions();
    const index = missions.findIndex(m => m.id === missionId);
    if (index === -1) return null;

    const updatedMission: CareerMission = {
      ...missions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    missions[index] = updatedMission;
    this.saveMissions(missions);
    return updatedMission;
  }

  /**
   * Mark a step in the mission Growth Loop as completed
   */
  public static completeStep(missionId: string, stepId: string): CareerMission | null {
    const missions = this.getAllMissions();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return null;

    const stepIndex = mission.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return null;

    const step = mission.steps[stepIndex];
    const isAlreadyCompleted = step.status === 'completed';

    const updatedSteps = [...mission.steps];
    updatedSteps[stepIndex] = {
      ...step,
      status: 'completed',
      completedAt: new Date().toISOString()
    };

    // Calculate incremental readiness gain
    const readinessDelta = isAlreadyCompleted ? 0 : (step.readinessImpact || 5);
    const newReadiness = Math.min(100, Math.round(mission.currentReadiness + readinessDelta));

    // Determine the new next best action (first pending step)
    const nextPending = updatedSteps.find(s => s.status === 'pending' || s.status === 'in_progress');
    const newNextBestActionId = nextPending ? nextPending.id : '';
    const newStage: GrowthLoopStage = nextPending ? nextPending.stage : 'opportunity';

    return this.updateMission(missionId, {
      steps: updatedSteps,
      currentReadiness: newReadiness,
      nextBestActionId: newNextBestActionId,
      currentStage: newStage
    });
  }

  /**
   * Skip a step
   */
  public static skipStep(missionId: string, stepId: string): CareerMission | null {
    const missions = this.getAllMissions();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return null;

    const updatedSteps = mission.steps.map(s => {
      if (s.id === stepId) {
        return { ...s, status: 'skipped' as const };
      }
      return s;
    });

    const nextPending = updatedSteps.find(s => s.status === 'pending');
    return this.updateMission(missionId, {
      steps: updatedSteps,
      nextBestActionId: nextPending ? nextPending.id : mission.nextBestActionId
    });
  }

  /**
   * Link an evidence record to the active mission
   */
  public static linkEvidence(missionId: string, evidenceId: string): void {
    const missions = this.getAllMissions();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    if (!mission.evidenceIds.includes(evidenceId)) {
      this.updateMission(missionId, {
        evidenceIds: [...mission.evidenceIds, evidenceId],
        currentReadiness: Math.min(100, mission.currentReadiness + 3)
      });
    }
  }

  /**
   * Link a completed build to the mission
   */
  public static linkBuild(missionId: string, buildId: string): void {
    const missions = this.getAllMissions();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    if (!mission.completedBuildIds.includes(buildId)) {
      this.updateMission(missionId, {
        completedBuildIds: [...mission.completedBuildIds, buildId],
        currentReadiness: Math.min(100, mission.currentReadiness + 6)
      });
    }
  }

  /**
   * Auto-diagnose capability gaps based on target role
   */
  public static diagnoseGapsForRole(roleTitle: string, domain?: string): { readiness: number; gaps: MissionCapabilityGap[] } {
    const normalizedRole = roleTitle.toLowerCase();

    if (normalizedRole.includes('product') || normalizedRole.includes('pm')) {
      return {
        readiness: 72,
        gaps: [
          {
            id: `gap-${Date.now()}-1`,
            capability: 'Product Strategy & Horizon Roadmapping',
            category: 'strategy',
            currentLevel: 3,
            targetLevel: 5,
            gapSeverity: 'high',
            rationale: 'Senior PMs must defend 18-month strategic roadmaps tied to defensible business moats.',
            recommendedAction: 'Study the Strategic Roadmap & Moat Analysis framework in Knowledge System.',
            linkedResource: {
              type: 'knowledge',
              id: 'ku-prod-strategy',
              label: 'Knowledge System · Strategic Moats & Roadmaps'
            },
            status: 'identified'
          },
          {
            id: `gap-${Date.now()}-2`,
            capability: 'Experimentation & Statistical Significance',
            category: 'execution',
            currentLevel: 2,
            targetLevel: 4,
            gapSeverity: 'medium',
            rationale: 'Must design rigorous multi-armed bandit and A/B sample sizing without p-hacking risks.',
            recommendedAction: 'Complete the A/B Experiment Design drill in Practice question bank.',
            linkedResource: {
              type: 'practice',
              id: 'drill-ab-experiment',
              label: 'Practice · A/B Sample Sizing & Hypothesis Testing'
            },
            status: 'identified'
          },
          {
            id: `gap-${Date.now()}-3`,
            capability: 'Builder Challenge: Cross-functional Prototype',
            category: 'technical',
            currentLevel: 2,
            targetLevel: 4,
            gapSeverity: 'medium',
            rationale: 'Top tech employers look for tangible shipped solutions rather than purely theoretical slide decks.',
            recommendedAction: 'Partner with engineers on a Builder Match prototype opportunity.',
            linkedResource: {
              type: 'builder',
              id: 'build-opp-acme-cloud',
              label: 'Builder Match · Onboarding Strike Team'
            },
            status: 'identified'
          }
        ]
      };
    }

    if (normalizedRole.includes('engineer') || normalizedRole.includes('developer') || normalizedRole.includes('architect') || normalizedRole.includes('lead')) {
      return {
        readiness: 68,
        gaps: [
          {
            id: `gap-${Date.now()}-1`,
            capability: 'Distributed System Partition Resilience & Consensus',
            category: 'technical',
            currentLevel: 3,
            targetLevel: 5,
            gapSeverity: 'high',
            rationale: 'Must address network split-brain, leader election, and idempotent reconciliation during partitions.',
            recommendedAction: 'Review Distributed Consensus architectures in Knowledge Library.',
            linkedResource: {
              type: 'knowledge',
              id: 'ku-dist-consensus',
              label: 'Knowledge System · Distributed Consensus & Raft'
            },
            status: 'identified'
          },
          {
            id: `gap-${Date.now()}-2`,
            capability: 'Observability & P99 Latency Profiling',
            category: 'execution',
            currentLevel: 3,
            targetLevel: 5,
            gapSeverity: 'medium',
            rationale: 'Need practical experience profiling tail latencies with OpenTelemetry traces and heap analyzers.',
            recommendedAction: 'Run live system design case simulating unexpected traffic spikes.',
            linkedResource: {
              type: 'practice',
              id: 'case-latency-profiling',
              label: 'Live Practice · System Design Tail Latency'
            },
            status: 'identified'
          }
        ]
      };
    }

    // Default universal career diagnosis
    return {
      readiness: 65,
      gaps: [
        {
          id: `gap-${Date.now()}-1`,
          capability: 'Executive Communication & Narrative Structuring',
          category: 'leadership',
          currentLevel: 3,
          targetLevel: 5,
          gapSeverity: 'high',
          rationale: 'Senior roles require concise top-down Pyramid Principle executive briefings under pressure.',
          recommendedAction: 'Review Executive Presentation blueprints and practice mock scenarios.',
          linkedResource: {
            type: 'blueprint',
            id: 'bp-pyramid-principle',
            label: 'Answer Blueprint · Executive Communication'
          },
          status: 'identified'
        },
        {
          id: `gap-${Date.now()}-2`,
          capability: 'Domain Innovation & Real-World Evidence',
          category: 'domain',
          currentLevel: 2,
          targetLevel: 4,
          gapSeverity: 'medium',
          rationale: 'Hiring managers prioritize verifiable prototypes and metrics ledger evidence over claims.',
          recommendedAction: 'Join an active problem challenge in Builder Match to produce proof.',
          linkedResource: {
            type: 'builder',
            id: 'build-opp-general',
            label: 'Builder Match · Active Challenge Hub'
          },
          status: 'identified'
        }
      ]
    };
  }

  /**
   * Synthesize the actionable 8-stage Growth Loop for a target role
   */
  public static generateGrowthLoopSteps(roleTitle: string, gaps: MissionCapabilityGap[]): GrowthLoopStep[] {
    const timestamp = Date.now();
    return [
      {
        id: `step-${timestamp}-1`,
        stage: 'diagnose',
        title: `Calibrate Baseline Readiness for ${roleTitle}`,
        description: 'Review verified capability ledger and diagnostic benchmarks against industry expectations.',
        actionType: 'knowledge_read',
        targetTab: 'profile',
        readinessImpact: 5,
        estimatedMinutes: 10,
        status: 'completed',
        completedAt: new Date().toISOString(),
        actionCtaLabel: 'View Diagnostic Ledger',
        contextHint: 'Identified specific capability gaps to target in this growth cycle.'
      },
      {
        id: `step-${timestamp}-2`,
        stage: 'learn',
        title: `Study Core Frameworks: ${gaps[0]?.capability || 'Key Strategic Concepts'}`,
        description: 'Read the curated knowledge unit and absorb core mental models, formulas, and rubrics.',
        actionType: 'knowledge_read',
        targetTab: 'knowledge',
        targetEntityName: gaps[0]?.capability || 'Core Strategic Concept',
        readinessImpact: 6,
        estimatedMinutes: 20,
        status: 'pending',
        actionCtaLabel: 'Open Knowledge Unit',
        contextHint: 'Focus on why these trade-offs are prioritized in executive evaluations.'
      },
      {
        id: `step-${timestamp}-3`,
        stage: 'practice',
        title: `Practice Timed Drill: Defend ${roleTitle} Tradeoffs`,
        description: 'Complete high-pressure scenario simulation with real-time feedback and structured scoring.',
        actionType: 'practice_drill',
        targetTab: 'practice',
        targetEntityName: `${roleTitle} Scenario Drill`,
        readinessImpact: 8,
        estimatedMinutes: 25,
        status: 'pending',
        actionCtaLabel: 'Start Practice Drill',
        contextHint: 'Directly reinforces mental models in an interview or pitch setting.'
      },
      {
        id: `step-${timestamp}-4`,
        stage: 'feedback',
        title: 'Review Benchmark Answer Blueprint & Rubrics',
        description: 'Compare your performance against senior candidate exemplars and note corrective calibrations.',
        actionType: 'feedback_review',
        targetTab: 'knowledge',
        targetEntityName: 'Benchmark Evaluation Rubric',
        readinessImpact: 4,
        estimatedMinutes: 15,
        status: 'pending',
        actionCtaLabel: 'Review Blueprint Rubric',
        contextHint: 'Pinpoints specific phrases, frameworks, and metrics that unlock high scores.'
      },
      {
        id: `step-${timestamp}-5`,
        stage: 'build',
        title: 'Build Solution in Builder Match Challenge',
        description: 'Turn theoretical knowledge into a tangible prototype or experimental solution with other builders.',
        actionType: 'builder_challenge',
        targetTab: 'builder_match',
        targetEntityName: 'Targeted Build Challenge',
        readinessImpact: 9,
        estimatedMinutes: 90,
        status: 'pending',
        actionCtaLabel: 'Explore Build Challenge',
        contextHint: 'Tangible prototypes are 10x more compelling than resume bullet points.'
      },
      {
        id: `step-${timestamp}-6`,
        stage: 'prove',
        title: 'Convert Shipped Artifact into Career Evidence',
        description: 'Capture problem context, verified metrics, and repo/demo links in your Career Readiness Story Bank.',
        actionType: 'evidence_document',
        targetTab: 'profile',
        readinessImpact: 6,
        estimatedMinutes: 20,
        status: 'pending',
        actionCtaLabel: 'Document Career Evidence',
        contextHint: 'Permanently updates your verified capability score and interview stories.'
      },
      {
        id: `step-${timestamp}-7`,
        stage: 'opportunity',
        title: `Target Matching ${roleTitle} Opportunities & Programs`,
        description: 'Review personalized job postings, innovation challenges, and partner grants tailored to your calibrated score.',
        actionType: 'opportunity_apply',
        targetTab: 'discover',
        targetEntityName: `Curated ${roleTitle} Opportunities`,
        readinessImpact: 4,
        estimatedMinutes: 30,
        status: 'pending',
        actionCtaLabel: 'Explore Opportunities',
        contextHint: 'Apply with high conviction backed by verified evidence and fresh prototypes.'
      }
    ];
  }
}
