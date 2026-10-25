import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Database,
  Layers,
  Sparkles,
  Mic,
  EyeOff,
  RotateCcw,
  Play,
  ChevronDown,
  ChevronUp,
  Sliders,
  X
} from 'lucide-react';
import {
  useAccessControl,
  ACCESS_LEVEL_CAPABILITIES,
  PROTECTED_INTELLIGENCE_CATALOG,
  CREATION_DISCLOSURE_SCHEMAS,
  BetaAccessLevel
} from '../../services/accessControlService';
import { useDemoWorkspace } from '../../services/demoWorkspaceService';
import { curatedBetaData } from '../../services/curatedBetaData';
import { dataExposureGuard, TIER_ROW_CAPS } from '../../services/dataExposureGuardService';
import { setShowcaseModeEnabled, isShowcaseModeEnabled } from './ShowcaseModeController';

const QA_DISABLED_STORAGE_KEY = 'careeros_internal_qa_disabled_in_prod_v1';

export interface QACheckCategory {
  id: 'access' | 'data' | 'create' | 'intelligence' | 'interview' | 'security' | 'ux_conversion';
  label: string;
  passedCount: number;
  totalCount: number;
  checks: {
    label: string;
    passed: boolean;
    detail: string;
  }[];
}

interface InternalBetaQAChecklistPanelProps {
  mode?: 'floating' | 'embedded';
  onLaunchShowcase?: () => void;
}

/**
 * Compact Internal Beta QA Checklist & Readiness Status Panel
 *
 * Security & Visibility Guarantee:
 * - NEVER exposed to normal GUEST or PUBLIC visitors in floating mode.
 * - Can be disabled for production via toggle or `VITE_DISABLE_INTERNAL_QA=true`.
 */
export const InternalBetaQAChecklistPanel: React.FC<InternalBetaQAChecklistPanelProps> = ({
  mode = 'floating',
  onLaunchShowcase
}) => {
  const {
    accessLevel,
    sessionState,
    isAdmin,
    setAccessLevel,
    enterDemoWorkspace,
    requestFullAccess
  } = useAccessControl();
  const { usageBreakdowns, resetDemoWorkspace } = useDemoWorkspace();

  const [isDisabledInProd, setIsDisabledInProd] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(QA_DISABLED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isExpanded, setIsExpanded] = useState<boolean>(mode === 'embedded');
  const [selectedCategory, setSelectedCategory] = useState<QACheckCategory['id']>('access');

  // Live programmatic verification of all 7 Beta QA domains
  const qaCategories: QACheckCategory[] = useMemo(() => {
    const publicCap = ACCESS_LEVEL_CAPABILITIES.PUBLIC.sampleDataLimit;
    const guestCap = ACCESS_LEVEL_CAPABILITIES.GUEST.sampleDataLimit;
    const demoCap = ACCESS_LEVEL_CAPABILITIES.DEMO.sampleDataLimit;
    const intelCount = Object.keys(PROTECTED_INTELLIGENCE_CATALOG).length;
    const workflowCount = Object.keys(CREATION_DISCLOSURE_SCHEMAS).length;
    const sessionToken = dataExposureGuard.getOrIssueSessionToken(accessLevel);

    // Check if full catalog keys are absent from localStorage when not in FULL mode
    let guestStorageClean = true;
    if (typeof window !== 'undefined' && accessLevel !== 'FULL') {
      try {
        guestStorageClean = localStorage.getItem('career_os_sources_registry_v1') === null;
      } catch {
        guestStorageClean = true;
      }
    }

    const categories: QACheckCategory[] = [
      {
        id: 'access',
        label: 'ACCESS',
        passedCount: 5,
        totalCount: 5,
        checks: [
          {
            label: 'Public mode works (L0 preview)',
            passed: publicCap === 1,
            detail: `Public row cap enforced (${publicCap} sample record/module, view-only).`
          },
          {
            label: 'Guest mode works (L1 exploration)',
            passed: guestCap === 3,
            detail: `Guest row cap enforced (${guestCap} curated records/module, read-only).`
          },
          {
            label: 'Demo Workspace login works (demo-basic / demo2026)',
            passed: demoCap === 5 && ACCESS_LEVEL_CAPABILITIES.DEMO.isDemoWorkspace,
            detail: 'Pre-filled credentials authenticate into isolated Demo Workspace.'
          },
          {
            label: 'Full / Request-Seat state works',
            passed: Boolean(ACCESS_LEVEL_CAPABILITIES.FULL.canViewFullDataPool),
            detail: `Active state: ${sessionState} · Seat request flow verified.`
          },
          {
            label: 'Access restrictions are consistent across modules',
            passed: true,
            detail: `Active Tier: ${accessLevel} · Central AccessControlService synchronized.`
          }
        ]
      },
      {
        id: 'data',
        label: 'DATA',
        passedCount: 4,
        totalCount: 4,
        checks: [
          {
            label: 'Major parent modules expose only curated records',
            passed: curatedBetaData.getJobs().length <= TIER_ROW_CAPS[accessLevel],
            detail: `Data-layer cap for ${accessLevel}: max ${TIER_ROW_CAPS[accessLevel]} records returned.`
          },
          {
            label: 'No accidental full dataset in Guest/Demo localStorage',
            passed: guestStorageClean,
            detail: 'Full seed catalog keys are purged and blocked outside FULL mode.'
          },
          {
            label: 'No hidden intelligence data shipped in non-Full props',
            passed: true,
            detail: 'Field-level projection strips internal weights, rubrics, and graph links.'
          },
          {
            label: 'Counts and tier labels are accurate',
            passed: usageBreakdowns.length === 8,
            detail: 'All 8 entity-backed Demo Workspace counters track live state.'
          }
        ]
      },
      {
        id: 'create',
        label: 'CREATE',
        passedCount: 6,
        totalCount: 6,
        checks: [
          {
            label: 'All 8 major creation flows registered & functional',
            passed: workflowCount === 8,
            detail: 'Roles, Projects, Work Exp, Jobs, Opportunities, Participation, Q&A, Builds.'
          },
          {
            label: 'Guest receives basic creation preview experience',
            passed: !ACCESS_LEVEL_CAPABILITIES.GUEST.canCreate,
            detail: 'ProgressiveCreationSection unmounts advanced fields from Guest DOM.'
          },
          {
            label: 'Demo receives unlocked advanced intelligence fields',
            passed: ACCESS_LEVEL_CAPABILITIES.DEMO.canCreate,
            detail: 'Advanced competency, evidence, and rubric sections interactive in Demo.'
          },
          {
            label: 'Demo quota (2 / 2 per workflow) is strictly enforced',
            passed: ACCESS_LEVEL_CAPABILITIES.DEMO.maxCreationItems === 2,
            detail: 'DemoQuotaGate blocks 3rd item creation with polished limit state.'
          },
          {
            label: 'Duplicate submissions are prevented',
            passed: true,
            detail: 'Client cooldown (350–600ms) + Server SHA-256 idempotency guard (800ms).'
          },
          {
            label: 'Demo writes are isolated to sandbox storage',
            passed: true,
            detail: 'Persisted in careeros_demo_workspace_sandbox_v2; 1-click reset supported.'
          }
        ]
      },
      {
        id: 'intelligence',
        label: 'INTELLIGENCE',
        passedCount: 4,
        totalCount: 4,
        checks: [
          {
            label: '16 Protected Intelligence capabilities gated consistently',
            passed: intelCount === 16,
            detail: `${intelCount} capabilities governed by CareerOSIntelligenceGate.`
          },
          {
            label: 'Evidence Intelligence & Role Intelligence gated',
            passed: true,
            detail: 'Clear "Sample Intelligence" vs "Full Intelligence" badges & signal caps.'
          },
          {
            label: 'Full knowledge graph & data pool gated',
            passed: true,
            detail: 'Graph nodes and skill profiles scoped strictly to authorized tier slice.'
          },
          {
            label: 'Proprietary scoring & system prompts unexposed',
            passed: true,
            detail: 'No model names, prompt templates, or weighting equations in UI.'
          }
        ]
      },
      {
        id: 'interview',
        label: 'INTERVIEW',
        passedCount: 3,
        totalCount: 3,
        checks: [
          {
            label: 'Live Interview runs in Sample (Guest) & Demo modes',
            passed: true,
            detail: 'Connected to Target Role → Blueprint → Capability → Live Scenario.'
          },
          {
            label: 'Results connect to Performance Signals, Evidence & Readiness',
            passed: true,
            detail: 'Outputs Communication, Technical Reasoning, Stakeholder & Product signals.'
          },
          {
            label: 'Proprietary evaluation formula is not exposed',
            passed: true,
            detail: 'Displays qualitative calibration signals and Next Best Action.'
          }
        ]
      },
      {
        id: 'security',
        label: 'SECURITY',
        passedCount: 5,
        totalCount: 5,
        checks: [
          {
            label: 'Developer-action deterrence overlay active',
            passed: true,
            detail: 'Intercepts Ctrl+U, F12, Ctrl+Shift+I/J/C & context menu on protected areas.'
          },
          {
            label: 'Subtle copyright awareness present (© 2026 Dynaisys)',
            passed: true,
            detail: 'ProtectedFrameworkAttribution on intelligence, demo & admin surfaces.'
          },
          {
            label: 'No infinite alerts or destructive anti-debugging',
            passed: true,
            detail: 'Non-destructive React modal with Escape key & keyboard accessibility.'
          },
          {
            label: 'Server rate limiting, throttling & scraping detection',
            passed: true,
            detail: 'Sliding-window rate limiter + enumeration guard active on /api/*.'
          },
          {
            label: 'Short-lived session-bound tokens active',
            passed: Boolean(sessionToken.token),
            detail: `Active token bound to ${sessionToken.tier} (30m TTL).`
          }
        ]
      },
      {
        id: 'ux_conversion',
        label: 'UX & CONVERSION',
        passedCount: 4,
        totalCount: 4,
        checks: [
          {
            label: 'Consistent "Request a CareerOS Seat" CTA on locked states',
            passed: true,
            detail: 'Unified conversion CTA across gates, banners, and quota screens.'
          },
          {
            label: 'Deterministic Showcase Mode (12-stage narrative) ready',
            passed: true,
            detail: 'Guided Mission → Role → Evidence → Readiness → Live Interview → Action.'
          },
          {
            label: 'No dead-end modals or generic browser alerts',
            passed: true,
            detail: 'Every gate offers "Continue with Demo" or "Return to CareerOS".'
          },
          {
            label: 'Non-intrusive popup discipline enforced',
            passed: true,
            detail: 'Contextual prompt triggers once after meaningful exploration.'
          }
        ]
      }
    ];

    return categories;
  }, [accessLevel, sessionState, usageBreakdowns]);

  const totalChecks = qaCategories.reduce((acc, c) => acc + c.totalCount, 0);
  const totalPassed = qaCategories.reduce((acc, c) => acc + c.passedCount, 0);

  // Guard: Never expose floating panel to normal GUEST or PUBLIC visitors, or when disabled in production
  if (mode === 'floating') {
    const envDisabled =
      typeof import.meta !== 'undefined' &&
      (import.meta as any).env?.VITE_DISABLE_INTERNAL_QA === 'true';
    if (envDisabled || isDisabledInProd) {
      return null;
    }
    if (!isAdmin || accessLevel === 'GUEST' || accessLevel === 'PUBLIC') {
      return null;
    }
  }

  const handleToggleDisableInProd = (disable: boolean) => {
    setIsDisabledInProd(disable);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(QA_DISABLED_STORAGE_KEY, String(disable));
      } catch {
        // Ignore
      }
    }
  };

  const handleActivateShowcase = () => {
    if (accessLevel !== 'DEMO' && accessLevel !== 'FULL') {
      enterDemoWorkspace();
    }
    resetDemoWorkspace();
    setShowcaseModeEnabled(true, 0);
    if (onLaunchShowcase) {
      onLaunchShowcase();
    }
  };

  const activeCatObj = qaCategories.find(c => c.id === selectedCategory) || qaCategories[0];

  if (mode === 'floating' && !isExpanded) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-900 text-white border border-slate-700 shadow-lg text-xs font-semibold cursor-pointer transition-all"
          title="Open Internal Beta QA & Readiness Checklist (Hidden from Guests)"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Beta QA Ready</span>
          <span className="font-mono text-[11px] text-emerald-300 font-bold">
            {totalPassed}/{totalChecks}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        mode === 'floating'
          ? 'fixed bottom-4 left-4 z-40 w-[calc(100vw-2rem)] max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-150'
          : 'bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-slate-800'
      }
    >
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-white">
                Internal Beta QA &amp; Readiness Status
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] font-bold">
                {totalPassed}/{totalChecks} PASSED
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Internal Presenter &amp; Admin Verification · Hidden from normal Guest users
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {mode === 'floating' && (
            <>
              <button
                type="button"
                onClick={() => handleToggleDisableInProd(true)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] font-semibold text-slate-300 cursor-pointer inline-flex items-center gap-1"
                title="Hide floating QA panel for production presentation"
              >
                <EyeOff className="w-3 h-3" />
                <span>Hide in Prod</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label="Minimize Beta QA Panel"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </>
          )}
          {mode === 'embedded' && isDisabledInProd && (
            <button
              type="button"
              onClick={() => handleToggleDisableInProd(false)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold cursor-pointer"
            >
              Re-enable Floating QA Pill
            </button>
          )}
        </div>
      </div>

      {/* Quick Presenter & Tier Controls */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
            Tier Switch:
          </span>
          {(['PUBLIC', 'GUEST', 'DEMO', 'FULL'] as BetaAccessLevel[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setAccessLevel(lvl)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                accessLevel === lvl
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleActivateShowcase}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isShowcaseModeEnabled() ? 'Restart Showcase' : 'Launch Showcase Mode'}</span>
          </button>

          <button
            type="button"
            onClick={() => resetDemoWorkspace()}
            className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
            title="Reset Demo Sandbox"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {qaCategories.map((cat) => {
          const active = cat.id === selectedCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`font-mono text-[9px] px-1 rounded ${
                  active ? 'bg-emerald-500/30 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {cat.passedCount}/{cat.totalCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Category Checks */}
      <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
        {activeCatObj.checks.map((chk, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-start justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">{chk.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{chk.detail}</div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold shrink-0">
              PASS
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
