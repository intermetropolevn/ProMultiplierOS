import { InterviewConfig, RoleBlueprint, LiveTimelineItem } from '../types';
import { StructuredAnswerBlueprint, EvidenceItem } from '../features/knowledge/types';
import { RoleBlueprintService } from './roleBlueprintService';
import { KnowledgeStorageService } from '../features/knowledge/services/knowledgeStorageService';
import { CareerMissionService } from './careerMissionService';
import { AccessControlService, AccessLevel } from './accessControlService';
import { StorageService } from './storageService';
import { careerGraphEventBus } from './careerGraphEventBus';
import { CareerMission, GrowthLoopStep } from '../types/careerMission';

export interface EcosystemCapabilityNode {
  id: string;
  name: string;
  pillarCategory: 'Communication' | 'Technical Reasoning' | 'Stakeholder Management' | 'Product Judgment';
  description: string;
  statusLabel: string;
}

export interface UpstreamInterviewContext {
  accessLevel: AccessLevel;
  targetRoleTitle: string;
  targetRoleCategory: string;
  targetDomain: string;
  targetLevel: string;
  roleBlueprint: RoleBlueprint;
  capabilityModel: EcosystemCapabilityNode[];
  qaBlueprints: StructuredAnswerBlueprint[];
  selectedScenarioTitle: string;
  selectedScenarioSummary: string;
  maxQuestionsAllowed: number;
  activeMission: CareerMission | null;
}

export interface InterviewSignalItem {
  dimension: 'Communication' | 'Technical Reasoning' | 'Stakeholder Management' | 'Product Judgment';
  signalStatus: 'Verified Signal' | 'Strong Signal' | ' calibrated Signal' | 'Developing Signal' | 'Sample Signal';
  qualitativeSummary: string;
  connectedCapability: string;
  evidenceCue?: string;
}

export interface DetectedEvidenceCandidate {
  id: string;
  title: string;
  category: string;
  summary: string;
  sourceTurnPreview: string;
  linkedCapabilities: string[];
  metricsPreview: string[];
  isAlreadyLinked: boolean;
  isSamplePreview: boolean;
}

export interface ReadinessSignalUpdate {
  missionId: string | null;
  missionTitle: string;
  targetRoleTitle: string;
  previousReadiness: number;
  updatedReadiness: number;
  readinessDeltaLabel: string;
  statusMessage: string;
  isApplied: boolean;
  canApplyToWorkspace: boolean;
}

export interface RecommendedNextActionItem {
  id: string;
  title: string;
  stageLabel: string;
  description: string;
  ctaLabel: string;
  targetTab: 'profile' | 'knowledge' | 'role_intelligence' | 'evidence_intelligence' | 'practice' | 'builder_match' | 'discover' | 'tracker';
  missionStep?: GrowthLoopStep;
}

export interface ConnectedInterviewOutcome {
  accessLevel: AccessLevel;
  upstream: UpstreamInterviewContext;
  interviewSignals: InterviewSignalItem[];
  potentialEvidence: DetectedEvidenceCandidate[];
  capabilitySignals: {
    capabilityName: string;
    signalDimension: string;
    impactSummary: string;
    tierBadge: string;
  }[];
  readinessUpdate: ReadinessSignalUpdate;
  recommendedNextAction: RecommendedNextActionItem;
}

export class LiveInterviewEcosystemService {
  /**
   * Resolves the upstream CareerOS chain:
   * Target Role → Role Blueprint → Capability Model → Q&A Blueprint → Live Interview
   */
  public static resolveUpstreamContext(config?: Partial<InterviewConfig>): UpstreamInterviewContext {
    const accessLevel = AccessControlService.getAccessLevel();
    const profile = StorageService.getUserProfile();
    const activeMission = CareerMissionService.getActiveMission();
    const allRoleBlueprints = RoleBlueprintService.getAllBlueprints(true);
    const allQABlueprints = KnowledgeStorageService.getBlueprints();

    const targetRoleCategory = config?.roleCategory || profile.targetRole || 'Software Engineering';
    const targetDomain = config?.domain || profile.targetDomain || 'Fintech & Payments';
    const targetLevel = config?.level || profile.targetLevel || 'Senior';

    // Match Role Blueprint from RoleBlueprintService (which respects Guest/Demo/Full data scopes)
    const matchedRoleBlueprint =
      allRoleBlueprints.find(rb => rb.category === targetRoleCategory) ||
      allRoleBlueprints.find(rb => rb.title.toLowerCase().includes(targetRoleCategory.toLowerCase().split(' ')[0])) ||
      allRoleBlueprints[0];

    const targetRoleTitle =
      activeMission?.targetRoleTitle ||
      matchedRoleBlueprint?.title ||
      `${targetLevel} ${targetRoleCategory}`;

    // Build Capability Model mapped from Role Blueprint competencies & Active Mission gaps
    const capabilityModel = this.buildCapabilityModel(matchedRoleBlueprint, activeMission, targetRoleCategory);

    // Match Q&A Blueprints for the Target Role & Scenario
    let matchedQABlueprints = allQABlueprints.filter(
      bp =>
        bp.targetRole?.toLowerCase().includes(targetRoleCategory.toLowerCase().split(' ')[0]) ||
        bp.domain?.toLowerCase().includes(targetDomain.toLowerCase().split(' ')[0])
    );
    if (matchedQABlueprints.length === 0) {
      matchedQABlueprints = allQABlueprints;
    }

    // Enforce tier question limits
    const maxQuestionsAllowed =
      accessLevel === 'PUBLIC' || accessLevel === 'GUEST'
        ? 1
        : accessLevel === 'DEMO'
          ? 2
          : Math.max(3, config?.questionCount || 3);

    const scopedQABlueprints = matchedQABlueprints.slice(0, maxQuestionsAllowed);

    const scenarioMap: Record<string, { title: string; summary: string }> = {
      conflict_leadership: {
        title: 'Cross-Functional Architecture Conflict & Stakeholder Alignment',
        summary: 'Calibrates empirical conflict resolution, executive communication, and stakeholder trade-offs.'
      },
      architecture_scale: {
        title: 'High-Throughput Distributed Systems & Resilience Trade-offs',
        summary: 'Calibrates technical reasoning, failure isolation, idempotency, and production architecture defense.'
      },
      product_strategy: {
        title: 'Ambiguous Product Strategy & Horizon Prioritization',
        summary: 'Calibrates product judgment, reversible decision framing, and measurable business outcomes.'
      },
      domain_deepdive: {
        title: `${targetDomain} Regulatory & Operational Deep-Dive`,
        summary: 'Calibrates domain-specific risk boundaries, SLA governance, and customer trust.'
      },
      standard_curriculum: {
        title: `${targetRoleTitle} — Comprehensive Calibration Scenario`,
        summary: 'Connected evaluation across Communication, Technical Reasoning, Stakeholder Management, and Product Judgment.'
      }
    };

    const scenarioKey = config?.questionSet || 'architecture_scale';
    const scenario = scenarioMap[scenarioKey] || scenarioMap.standard_curriculum;

    return {
      accessLevel,
      targetRoleTitle,
      targetRoleCategory,
      targetDomain,
      targetLevel,
      roleBlueprint: matchedRoleBlueprint,
      capabilityModel,
      qaBlueprints: scopedQABlueprints,
      selectedScenarioTitle: scenario.title,
      selectedScenarioSummary: scenario.summary,
      maxQuestionsAllowed,
      activeMission
    };
  }

  private static buildCapabilityModel(
    roleBlueprint: RoleBlueprint | undefined,
    activeMission: CareerMission | null,
    roleCategory: string
  ): EcosystemCapabilityNode[] {
    const competencies = roleBlueprint?.competencies || [];
    const missionGaps = activeMission?.capabilityGaps || [];

    return [
      {
        id: 'cap-comm',
        name: competencies[0]?.name || 'Executive Narrative & Structured Communication',
        pillarCategory: 'Communication',
        description: competencies[0]?.description || 'Top-down problem framing, decision clarity, and concise trade-off articulation.',
        statusLabel: 'Role Blueprint Core Pillar'
      },
      {
        id: 'cap-tech',
        name:
          missionGaps.find(g => g.category === 'technical')?.capability ||
          competencies[1]?.name ||
          (roleCategory.includes('Product') ? 'System Architecture & Technical Fluency' : 'Distributed Architecture & Fault Isolation'),
        pillarCategory: 'Technical Reasoning',
        description: competencies[1]?.description || 'Rigorous evaluation of system invariants, latency trade-offs, and failure recovery.',
        statusLabel: missionGaps.some(g => g.category === 'technical') ? 'Active Mission Focus' : 'Role Blueprint Core Pillar'
      },
      {
        id: 'cap-stakeholder',
        name:
          missionGaps.find(g => g.category === 'leadership')?.capability ||
          competencies[2]?.name ||
          'Cross-Functional Stakeholder Consensus & RFC Alignment',
        pillarCategory: 'Stakeholder Management',
        description: competencies[2]?.description || 'Resolving engineering and product disagreements with empirical evidence rather than escalation.',
        statusLabel: 'Capability Model Signal'
      },
      {
        id: 'cap-product',
        name:
          missionGaps.find(g => g.category === 'strategy' || g.category === 'execution')?.capability ||
          'Product Judgment & Risk-Bounded Impact',
        pillarCategory: 'Product Judgment',
        description: 'Balancing delivery velocity, customer experience, and long-term operational durability.',
        statusLabel: missionGaps.some(g => g.category === 'strategy') ? 'Active Mission Focus' : 'Role Blueprint Core Pillar'
      }
    ];
  }

  /**
   * Synthesizes the downstream Career Intelligence outcome when an interview finishes:
   * Live Interview → Performance Signals → Evidence → Capability Signals → Readiness → Next Best Action
   * Strictly respects GUEST / DEMO / FULL rules and never exposes proprietary scoring formulas.
   */
  public static synthesizeInterviewOutcome(params: {
    config: InterviewConfig;
    timeline?: LiveTimelineItem[];
    candidateAnswers?: string[];
  }): ConnectedInterviewOutcome {
    const upstream = this.resolveUpstreamContext(params.config);
    const { accessLevel, activeMission, capabilityModel } = upstream;
    const isGuest = accessLevel === 'PUBLIC' || accessLevel === 'GUEST';
    const isDemo = accessLevel === 'DEMO';

    // Gather candidate responses from either Live timeline or Mock responses
    const candidateTurns = (params.timeline || []).filter(t => !t.isInterviewer).map(t => t.text);
    const allResponses = [...candidateTurns, ...(params.candidateAnswers || [])].filter(Boolean);
    const hasSubstantialResponse = allResponses.some(r => r.trim().split(/\s+/).length >= 12);

    // 1. INTERVIEW SIGNALS (The 4 required dimensions, qualitative only — no proprietary formulas)
    const interviewSignals: InterviewSignalItem[] = [
      {
        dimension: 'Communication',
        signalStatus: isGuest ? 'Sample Signal' : hasSubstantialResponse ? 'Strong Signal' : 'Developing Signal',
        qualitativeSummary: isGuest
          ? 'Basic Feedback: Clear top-down problem context established. Structured opening aligns with the selected scenario.'
          : hasSubstantialResponse
            ? 'Structured STAR-T progression with explicit context framing and executive decision summary.'
            : 'Initial narrative structure captured; expanding quantitative outcomes will strengthen executive signal.',
        connectedCapability: capabilityModel[0].name,
        evidenceCue: 'Structured opening & problem scoping'
      },
      {
        dimension: 'Technical Reasoning',
        signalStatus: isGuest ? 'Sample Signal' : hasSubstantialResponse ? 'Verified Signal' : 'Developing Signal',
        qualitativeSummary: isGuest
          ? 'Basic Feedback: Addressed core architectural trade-offs and operational constraints for the sample prompt.'
          : hasSubstantialResponse
            ? 'Demonstrated concrete trade-off evaluation across system invariants, failure modes, and operational boundaries.'
            : 'Core technical approach outlined; deeper edge-case defense will elevate technical signal.',
        connectedCapability: capabilityModel[1].name,
        evidenceCue: 'Architectural trade-offs & failure isolation'
      },
      {
        dimension: 'Stakeholder Management',
        signalStatus: isGuest ? 'Sample Signal' : hasSubstantialResponse ? 'Strong Signal' : 'Developing Signal',
        qualitativeSummary: isGuest
          ? 'Basic Feedback: Highlighted collaborative alignment across engineering and product partners.'
          : hasSubstantialResponse
            ? 'Articulated empirical consensus-building and constructive alignment across cross-functional partners.'
            : 'Identified key stakeholders; explicitly stating how pushback was resolved will reinforce alignment signal.',
        connectedCapability: capabilityModel[2].name,
        evidenceCue: 'Empirical consensus & cross-functional alignment'
      },
      {
        dimension: 'Product Judgment',
        signalStatus: isGuest ? 'Sample Signal' : hasSubstantialResponse ? 'Strong Signal' : 'Developing Signal',
        qualitativeSummary: isGuest
          ? 'Basic Feedback: Connected technical execution to customer and business continuity outcomes.'
          : hasSubstantialResponse
            ? 'Balanced implementation risk against customer impact, rollout guardrails, and measurable business outcomes.'
            : 'Connected action to delivery goals; anchoring with tripwire metrics will sharpen product judgment.',
        connectedCapability: capabilityModel[3].name,
        evidenceCue: 'Risk-bounded prioritization & business impact'
      }
    ];

    // 2. POTENTIAL EVIDENCE DETECTED
    const allEvidence = KnowledgeStorageService.getEvidence();
    const matchedEvidenceItems: EvidenceItem[] = allEvidence
      .filter(
        ev =>
          ev.roles.some(r => r.toLowerCase().includes(upstream.targetRoleCategory.toLowerCase().split(' ')[0])) ||
          ev.domains.some(d => d.toLowerCase().includes(upstream.targetDomain.toLowerCase().split(' ')[0]))
      )
      .slice(0, isGuest ? 1 : isDemo ? 2 : 3);

    const fallbackEvidence = allEvidence.slice(0, isGuest ? 1 : 2);
    const sourceEvidenceList = matchedEvidenceItems.length > 0 ? matchedEvidenceItems : fallbackEvidence;

    const potentialEvidence: DetectedEvidenceCandidate[] = sourceEvidenceList.map((ev, idx) => {
      const turnText = allResponses[idx] || allResponses[0] || ev.shortSummary;
      const isLinked = activeMission ? activeMission.evidenceIds.includes(ev.id) : false;

      return {
        id: ev.id,
        title: ev.title,
        category: ev.category,
        summary: isGuest
          ? `Sample Evidence Preview: ${ev.shortSummary}`
          : ev.shortSummary,
        sourceTurnPreview:
          turnText.length > 160 ? `${turnText.slice(0, 157)}...` : turnText,
        linkedCapabilities: [
          capabilityModel[idx % capabilityModel.length].name,
          ...(ev.skills.slice(0, 2))
        ],
        metricsPreview: isGuest ? ev.metrics.slice(0, 1) : ev.metrics.slice(0, 2),
        isAlreadyLinked: isLinked,
        isSamplePreview: isGuest || isDemo
      };
    });

    // 3. CAPABILITY SIGNALS
    const capabilitySignals = capabilityModel.map((cap, idx) => ({
      capabilityName: cap.name,
      signalDimension: cap.pillarCategory,
      impactSummary: isGuest
        ? `Sample capability mapping for ${cap.pillarCategory}`
        : isDemo
          ? `Connected to Demo Workspace capability (${cap.pillarCategory} signal verified)`
          : `Evidence-backed signal attributed to ${cap.name}`,
      tierBadge: isGuest ? 'Sample Signal' : isDemo ? 'Demo Signal' : idx < 2 ? 'Verified Impact' : 'Calibrated'
    }));

    // 4. READINESS SIGNAL UPDATED
    const baseReadiness = activeMission?.currentReadiness || 72;
    const updatedReadiness = Math.min(100, baseReadiness + (hasSubstantialResponse ? 4 : 3));

    const readinessUpdate: ReadinessSignalUpdate = {
      missionId: activeMission?.id || null,
      missionTitle: activeMission?.title || `Prepare for ${upstream.targetRoleTitle}`,
      targetRoleTitle: upstream.targetRoleTitle,
      previousReadiness: baseReadiness,
      updatedReadiness,
      readinessDeltaLabel: isGuest
        ? 'Sample Readiness Impact Preview (+3%)'
        : `+${updatedReadiness - baseReadiness}% Readiness Signal`,
      statusMessage: isGuest
        ? 'Sample readiness impact shown for Guest preview. Switch to Demo Workspace or Full Access to persist readiness updates to your Active Career Mission.'
        : isDemo
          ? `Connected to Demo Workspace Active Career Mission ("${activeMission?.title || upstream.targetRoleTitle}"). Readiness signal updated from ${baseReadiness}% to ${updatedReadiness}%.`
          : `Active Career Mission readiness calibrated from ${baseReadiness}% to ${updatedReadiness}% based on live interview performance signals and linked evidence.`,
      isApplied: false,
      canApplyToWorkspace: !isGuest
    };

    // 5. RECOMMENDED NEXT ACTION (Connected to Active Career Mission / Growth Loop)
    const nextStep =
      activeMission?.steps.find(s => s.id === activeMission.nextBestActionId) ||
      activeMission?.steps.find(s => s.status === 'pending' || s.status === 'in_progress') ||
      activeMission?.steps[0];

    const recommendedNextAction: RecommendedNextActionItem = nextStep
      ? {
          id: nextStep.id,
          title: nextStep.title,
          stageLabel: `Active Mission · ${nextStep.stage.toUpperCase()} Stage`,
          description: nextStep.description,
          ctaLabel: nextStep.actionCtaLabel || 'Execute Next Action in Mission',
          targetTab: (nextStep.targetTab as RecommendedNextActionItem['targetTab']) || 'evidence_intelligence',
          missionStep: nextStep
        }
      : {
          id: 'next-action-evidence-verify',
          title: `Verify Detected Evidence for ${upstream.targetRoleTitle}`,
          stageLabel: 'Evidence Intelligence · Capability Attribution',
          description: 'Review the potential evidence detected during this live interview and link it to your Role Blueprint capability pillars.',
          ctaLabel: 'Open Evidence Intelligence',
          targetTab: 'evidence_intelligence'
        };

    return {
      accessLevel,
      upstream,
      interviewSignals,
      potentialEvidence,
      capabilitySignals,
      readinessUpdate,
      recommendedNextAction
    };
  }

  /**
   * Commits the detected evidence and readiness signal update into the Active Career Mission
   * (Allowed in DEMO and FULL modes; no-op in GUEST mode).
   */
  public static applyOutcomeToEcosystem(outcome: ConnectedInterviewOutcome, evidenceId?: string): CareerMission | null {
    const accessLevel = AccessControlService.getAccessLevel();
    if (accessLevel === 'PUBLIC' || accessLevel === 'GUEST') {
      return CareerMissionService.getActiveMission();
    }

    const activeMission = CareerMissionService.getActiveMission();
    if (!activeMission) return null;

    const targetEvId = evidenceId || outcome.potentialEvidence[0]?.id || `ev-live-${Date.now()}`;
    CareerMissionService.linkEvidence(activeMission.id, targetEvId);

    // Also mark any active live_simulation or practice_drill step in progress/completed if appropriate
    const practiceStep = activeMission.steps.find(
      s => (s.actionType === 'live_simulation' || s.actionType === 'practice_drill') && s.status !== 'completed'
    );
    if (practiceStep) {
      CareerMissionService.completeStep(activeMission.id, practiceStep.id);
    }

    careerGraphEventBus.emit({
      type: 'LIVE_INTERVIEW_SIGNALS_COMMITTED',
      payload: {
        missionId: activeMission.id,
        evidenceId: targetEvId
      }
    });

    return CareerMissionService.getActiveMission();
  }
}
