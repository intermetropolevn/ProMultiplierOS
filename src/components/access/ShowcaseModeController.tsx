import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Target,
  Compass,
  BookOpen,
  CheckSquare,
  ShieldCheck,
  Layers,
  TrendingUp,
  Mic,
  Briefcase,
  Zap,
  X
} from 'lucide-react';
import { useAccessControl } from '../../services/accessControlService';
import { useDemoWorkspace } from '../../services/demoWorkspaceService';
import { RoleSimulationControl } from './RequestSeatModal';
import { useSeatRequestService } from '../../services/seatRequestService';
import type { ActiveTab } from '../layout/Header';

export interface ShowcaseStepDefinition {
  stepNumber: number;
  id:
    | 'active_mission'
    | 'target_role'
    | 'role_intelligence'
    | 'knowledge'
    | 'participation'
    | 'evidence'
    | 'capabilities'
    | 'readiness'
    | 'practice'
    | 'live_interview'
    | 'opportunity'
    | 'next_best_action';
  stageLabel: string;
  headline: string;
  curatedAnchor: string;
  narrativeNote: string;
  targetTab: ActiveTab;
  actionType?: 'open_mission' | 'start_live_interview' | 'focus_profile';
}

export const SHOWCASE_NARRATIVE_STEPS: ShowcaseStepDefinition[] = [
  {
    stepNumber: 1,
    id: 'active_mission',
    stageLabel: 'ACTIVE CAREER MISSION',
    headline: 'Mission-Driven Career Progression Loop',
    curatedAnchor: 'Staff / Lead Technical Product Manager · Enterprise SaaS & Fintech',
    narrativeNote: 'Anchors every learning, project, and interview activity around a single measurable career objective.',
    targetTab: 'profile'
  },
  {
    stepNumber: 2,
    id: 'target_role',
    stageLabel: 'TARGET ROLE',
    headline: 'Target Role Blueprint Calibration',
    curatedAnchor: 'Lead Product Manager — Collaborative Workspaces (Senior / Staff)',
    narrativeNote: 'Defines expected competency pillars, system scope, and evaluation stages for the target role.',
    targetTab: 'profile'
  },
  {
    stepNumber: 3,
    id: 'role_intelligence',
    stageLabel: 'ROLE INTELLIGENCE',
    headline: 'Cross-Track Role Architecture & Leveling',
    curatedAnchor: '10-Dimension Leveling Matrix · Product, Engineering & BizOps',
    narrativeNote: 'Compares demonstrated practitioner signals against target role benchmarks without exposing proprietary weights.',
    targetTab: 'role_intelligence'
  },
  {
    stepNumber: 4,
    id: 'knowledge',
    stageLabel: 'KNOWLEDGE',
    headline: 'Applied Knowledge Units & Frameworks',
    curatedAnchor: 'Shape Up, AWS Well-Architected & Two-Way Door Decision Framing',
    narrativeNote: 'Connects foundational books, research papers, and operational playbooks directly to role competencies.',
    targetTab: 'knowledge'
  },
  {
    stepNumber: 5,
    id: 'participation',
    stageLabel: 'PARTICIPATION / WORK ACTIVITY',
    headline: 'Verified Work Experience & Cohort Participation',
    curatedAnchor: 'Linear Product Infra · Stripe Core Platforms · Stanford HAI Workshop',
    narrativeNote: 'Tracks real-world work tenures, technical workshops, and active opportunity pipelines in one ledger.',
    targetTab: 'tracker'
  },
  {
    stepNumber: 6,
    id: 'evidence',
    stageLabel: 'EVIDENCE',
    headline: 'Structured Career Evidence & Proof Signals',
    curatedAnchor: 'Zero-Downtime 12M CRM Migration · +12% PLG Onboarding Lift',
    narrativeNote: 'Transforms raw work activity into verified, metric-backed proof points (L1 Exposure → L6 Validated).',
    targetTab: 'evidence_intelligence'
  },
  {
    stepNumber: 7,
    id: 'capabilities',
    stageLabel: 'CAPABILITIES',
    headline: 'Multi-Dimensional Capability Attribution',
    curatedAnchor: 'Product Strategy · Distributed Systems · PLG Funnels · Idempotency',
    narrativeNote: 'Synthesizes canonical skills and tool stacks from verified evidence rather than unverified self-claims.',
    targetTab: 'profile'
  },
  {
    stepNumber: 8,
    id: 'readiness',
    stageLabel: 'READINESS',
    headline: 'Target Role Readiness Diagnostics (82% Verified)',
    curatedAnchor: 'Strong Proof in Architecture & PLG · Calibrating Executive Case Depth',
    narrativeNote: 'Surfaces verified strengths and pinpoints exact evidence gaps before high-stakes interviews.',
    targetTab: 'profile'
  },
  {
    stepNumber: 9,
    id: 'practice',
    stageLabel: 'PRACTICE',
    headline: 'Role-Calibrated Q&A Blueprints (STAR / PDI)',
    curatedAnchor: 'STAR: Benchmarking Disagreements · PDI: Self-Serve Pricing Experiment',
    narrativeNote: 'Equips the practitioner with structured answer blueprints grounded in their own verified evidence.',
    targetTab: 'practice'
  },
  {
    stepNumber: 10,
    id: 'live_interview',
    stageLabel: 'LIVE INTERVIEW',
    headline: 'Connected Live Interview Intelligence Simulation',
    curatedAnchor: 'Live Scenario → Performance Signals → Potential Evidence → Readiness Impact',
    narrativeNote: 'Runs an interactive interview session where responses feed back into capability and readiness signals.',
    targetTab: 'practice',
    actionType: 'start_live_interview'
  },
  {
    stepNumber: 11,
    id: 'opportunity',
    stageLabel: 'OPPORTUNITY',
    headline: 'Intelligent Opportunity & Market Matching',
    curatedAnchor: 'Figma Lead PM · Stripe Senior Platform SWE · Anthropic AI Systems',
    narrativeNote: 'Matches verified evidence coverage against high-signal roles, fellowships, and ecosystem builds.',
    targetTab: 'discover'
  },
  {
    stepNumber: 12,
    id: 'next_best_action',
    stageLabel: 'NEXT BEST ACTION',
    headline: 'Closed-Loop Next Best Action Execution',
    curatedAnchor: 'Complete Product Strategy Case Review & Convert Build Outcome to Evidence',
    narrativeNote: 'Completes the CareerOS loop by recommending the highest-leverage action to advance readiness.',
    targetTab: 'profile',
    actionType: 'open_mission'
  }
];

const SHOWCASE_STORAGE_KEY = 'careeros_showcase_mode_active_v1';
const SHOWCASE_STEP_STORAGE_KEY = 'careeros_showcase_step_index_v1';

export function isShowcaseModeEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SHOWCASE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setShowcaseModeEnabled(enabled: boolean, stepIndex: number = 0): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SHOWCASE_STORAGE_KEY, String(enabled));
    sessionStorage.setItem(SHOWCASE_STEP_STORAGE_KEY, String(stepIndex));
    window.dispatchEvent(
      new CustomEvent('careeros_showcase_mode_changed', {
        detail: { enabled, stepIndex }
      })
    );
  } catch {
    // Ignore storage errors
  }
}

interface ShowcaseModeControllerProps {
  activeTab: ActiveTab;
  onNavigateTab: (tab: ActiveTab) => void;
  onStartShowcaseLiveInterview: () => void;
  onOpenMissionControl: () => void;
}

export const ShowcaseModeController: React.FC<ShowcaseModeControllerProps> = ({
  onNavigateTab,
  onStartShowcaseLiveInterview,
  onOpenMissionControl
}) => {
  const { accessLevel, isAdmin, role, enterDemoWorkspace, requestFullAccess } = useAccessControl();
  const { resetDemoWorkspace } = useDemoWorkspace();
  const {
    simulatedRole,
    simulatedAccessState,
    getDisplayAccessState,
    getCurrentUserActiveRequest
  } = useSeatRequestService();

  const [isActive, setIsActive] = useState<boolean>(() => isShowcaseModeEnabled());
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = parseInt(sessionStorage.getItem(SHOWCASE_STEP_STORAGE_KEY) || '0', 10);
      return Number.isNaN(saved) ? 0 : Math.min(SHOWCASE_NARRATIVE_STEPS.length - 1, Math.max(0, saved));
    } catch {
      return 0;
    }
  });
  const [resetToast, setResetToast] = useState(false);

  useEffect(() => {
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean; stepIndex?: number }>;
      if (custom.detail !== undefined) {
        setIsActive(Boolean(custom.detail.enabled));
        if (typeof custom.detail.stepIndex === 'number') {
          setCurrentStepIdx(custom.detail.stepIndex);
        }
      } else {
        setIsActive(isShowcaseModeEnabled());
      }
    };
    window.addEventListener('careeros_showcase_mode_changed', handleSync);
    return () => window.removeEventListener('careeros_showcase_mode_changed', handleSync);
  }, []);

  const executeStepNavigation = (index: number) => {
    const bounded = Math.min(SHOWCASE_NARRATIVE_STEPS.length - 1, Math.max(0, index));
    const step = SHOWCASE_NARRATIVE_STEPS[bounded];
    setCurrentStepIdx(bounded);
    try {
      sessionStorage.setItem(SHOWCASE_STEP_STORAGE_KEY, String(bounded));
    } catch {
      // Ignore
    }

    if (step.actionType === 'start_live_interview') {
      onStartShowcaseLiveInterview();
      return;
    }

    onNavigateTab(step.targetTab);

    if (step.actionType === 'open_mission') {
      setTimeout(() => {
        onOpenMissionControl();
      }, 120);
    }
  };

  const handleResetDeterministicDemo = () => {
    if (accessLevel !== 'DEMO' && accessLevel !== 'FULL') {
      enterDemoWorkspace();
    }
    resetDemoWorkspace();
    executeStepNavigation(0);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2400);
  };

  const handleCloseShowcase = () => {
    setShowcaseModeEnabled(false, 0);
    setIsActive(false);
  };

  if (!isActive || (accessLevel !== 'DEMO' && accessLevel !== 'FULL')) {
    return null;
  }

  const currentStep = SHOWCASE_NARRATIVE_STEPS[currentStepIdx] || SHOWCASE_NARRATIVE_STEPS[0];
  const actualIsAdmin = isAdmin || role === 'ADMIN' || role === 'OWNER';
  const activeRequest = getCurrentUserActiveRequest();
  const effectiveSeatState = activeRequest ? activeRequest.status : simulatedAccessState;
  const displayAccess = getDisplayAccessState({
    authState: 'AUTHENTICATED',
    actualRole: actualIsAdmin ? 'Admin' : 'User',
    simulatedRole,
    workspaceState: accessLevel,
    seatRequestState: effectiveSeatState
  });

  return (
    <div
      data-protected-ip="CareerOS Deterministic Showcase Mode Narrative"
      className="mb-5 rounded-2xl border border-indigo-200/90 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Bar: Showcase Mode Header + Deterministic Controls */}
      <div className="px-4 sm:px-5 py-2.5 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Showcase Mode · Guided Demo Narrative
          </span>
          <span className="text-xs text-slate-300 font-medium">
            Step <strong className="text-white font-mono">{currentStep.stepNumber} / {SHOWCASE_NARRATIVE_STEPS.length}</strong>
          </span>
          <span className="hidden md:inline text-[11px] text-indigo-200/80">
            · Curated Demo Dataset (Isolated Sandbox · Full Database Protected)
          </span>
          {resetToast && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              Deterministic Demo State Restored
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {accessLevel === 'FULL' && <RoleSimulationControl variant="compact" />}

          <button
            type="button"
            onClick={handleResetDeterministicDemo}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
            title="Reset Demo Workspace to deterministic baseline and restart at Step 1"
          >
            <RotateCcw className="w-3 h-3 text-amber-300" />
            <span>Reset Deterministic State</span>
          </button>

          {displayAccess.seatAccessStatus === 'pending' || displayAccess.seatAccessStatus === 'approved' ? (
            <button
              type="button"
              onClick={() => requestFullAccess(false, 'Showcase Mode Header')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              <span>{displayAccess.ctaLabel}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                requestFullAccess(false, 'Showcase Mode Header');
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold transition-colors cursor-pointer"
            >
              {displayAccess.ctaLabel}
            </button>
          )}

          <button
            type="button"
            onClick={handleCloseShowcase}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Exit Showcase Mode"
            aria-label="Exit Showcase Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive 12-Step Connected Narrative Ribbon */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-950/50 border-b border-white/10 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {SHOWCASE_NARRATIVE_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIdx;
            const isCompleted = idx < currentStepIdx;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => executeStepNavigation(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/40 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span className="font-mono text-[9px] opacity-75">{step.stepNumber}.</span>
                  <span>{step.stageLabel}</span>
                </button>
                {idx < SHOWCASE_NARRATIVE_STEPS.length - 1 && (
                  <span className="text-slate-600 text-[10px] select-none">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Narrative Step Presenter Card */}
      <div className="px-4 sm:px-5 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
              {currentStep.stageLabel}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-semibold text-amber-300">
              {currentStep.curatedAnchor}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {currentStep.headline}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentStep.narrativeNote}
          </p>
        </div>

        {/* Step Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={currentStepIdx === 0}
            onClick={() => executeStepNavigation(currentStepIdx - 1)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={() => executeStepNavigation(currentStepIdx)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-indigo-200 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
            title="Focus the current stage screen"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Focus View</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentStepIdx < SHOWCASE_NARRATIVE_STEPS.length - 1) {
                executeStepNavigation(currentStepIdx + 1);
              } else {
                executeStepNavigation(0);
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
          >
            <span>
              {currentStepIdx < SHOWCASE_NARRATIVE_STEPS.length - 1
                ? `Next: ${SHOWCASE_NARRATIVE_STEPS[currentStepIdx + 1].stageLabel}`
                : 'Restart Loop'}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
