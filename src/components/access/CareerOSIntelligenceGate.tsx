import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  Target,
  TrendingUp,
  Layers,
  CheckCircle2,
  ArrowRight,
  X,
  Lock,
  Unlock
} from 'lucide-react';
import {
  useAccessControl,
  ProtectedIntelligenceCapability,
  PROTECTED_INTELLIGENCE_CATALOG
} from '../../services/accessControlService';

interface IntelligenceModeBadgeProps {
  capability?: ProtectedIntelligenceCapability;
  sampleLabelOverride?: string;
  className?: string;
}

/**
 * High-contrast, authoritative badge making the distinction between
 * "Sample Intelligence" (Guest / Demo) and "Full Intelligence" (Full Access) unmistakably clear.
 */
export const IntelligenceModeBadge: React.FC<IntelligenceModeBadgeProps> = ({
  capability = 'evidence_intelligence',
  sampleLabelOverride,
  className = ''
}) => {
  const { getIntelligenceAccess } = useAccessControl();
  const intelState = getIntelligenceAccess(capability);

  if (intelState.isFullUnlocked) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-xs font-bold ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="uppercase tracking-wider text-[10px] font-black">Full Intelligence</span>
        <span className="text-emerald-600/70">·</span>
        <span className="text-[11px] font-medium">Complete Capability Unlocked</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 text-xs font-bold ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <span className="uppercase tracking-wider text-[10px] font-black">Sample Intelligence</span>
      <span className="text-amber-700/60">·</span>
      <span className="text-[11px] font-medium">
        {sampleLabelOverride || intelState.tierStatusLabel}
      </span>
    </div>
  );
};

interface CareerOSIntelligenceGateProps {
  capability?: ProtectedIntelligenceCapability;
  featureTitle?: string;
  variant?: 'inline' | 'modal' | 'compact';
  isOpen?: boolean;
  onClose?: () => void;
  onContinueDemo?: () => void;
  sampleContextNote?: string;
  className?: string;
}

const FEATURE_PILLARS = [
  {
    id: 'evidence_intelligence',
    title: 'Evidence Intelligence',
    subtitle: 'Activity-to-proof disambiguation & verified signal extraction',
    icon: ShieldCheck,
    accent: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    id: 'capability_signals',
    title: 'Capability Signals',
    subtitle: 'Multi-dimensional ownership & execution depth attribution',
    icon: Compass,
    accent: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'role_fit',
    title: 'Role Fit',
    subtitle: 'Cross-track leveling & role architecture alignment',
    icon: Layers,
    accent: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    id: 'readiness',
    title: 'Readiness',
    subtitle: 'Target role gap diagnostics & progression milestones',
    icon: Target,
    accent: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    id: 'market_intelligence',
    title: 'Market Intelligence',
    subtitle: 'Ecosystem demand, role benchmarks & opportunity signals',
    icon: TrendingUp,
    accent: 'text-amber-600 bg-amber-50 border-amber-200'
  }
] as const;

/**
 * CareerOS Intelligence Gate
 * Communicates the value of protected CareerOS Intelligence without exposing proprietary
 * scoring equations, weights, model names, system prompts, or hidden records in the DOM.
 */
export const CareerOSIntelligenceGate: React.FC<CareerOSIntelligenceGateProps> = ({
  capability = 'evidence_intelligence',
  featureTitle,
  variant = 'inline',
  isOpen = true,
  onClose,
  onContinueDemo,
  sampleContextNote,
  className = ''
}) => {
  const {
    accessLevel,
    sessionState,
    getIntelligenceAccess,
    requestFullAccess,
    openContextualPrompt
  } = useAccessControl();

  const [seatRequested, setSeatRequested] = useState(false);

  if (variant === 'modal' && !isOpen) {
    return null;
  }

  const intelState = getIntelligenceAccess(capability);
  if (intelState.isFullUnlocked && variant !== 'modal') {
    return null;
  }

  const catalogMeta =
    PROTECTED_INTELLIGENCE_CATALOG[capability] || PROTECTED_INTELLIGENCE_CATALOG.evidence_intelligence;
  const resolvedFeatureName = featureTitle || catalogMeta.title;
  const isSeatRequested = seatRequested || sessionState === 'FULL_ACCESS_REQUESTED';

  const handleRequestSeat = () => {
    requestFullAccess(false, `Intelligence Gate (${resolvedFeatureName})`);
    setSeatRequested(true);
  };

  const handleContinueWithDemo = () => {
    if (onContinueDemo) {
      onContinueDemo();
      return;
    }
    if (accessLevel === 'GUEST' || accessLevel === 'PUBLIC') {
      openContextualPrompt();
      if (onClose) onClose();
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  const gateCard = (
    <div
      data-protected-ip={`CareerOS Intelligence Preview · ${resolvedFeatureName}`}
      className={`relative rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden text-left ${className}`}
    >
      {/* Top Status Strip: Sample Intelligence vs Full Intelligence Distinction */}
      <div className="px-5 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Sample Intelligence
          </span>
          <span className="text-slate-500 text-xs">→</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-blue-300" />
            Full Intelligence
          </span>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            · {resolvedFeatureName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            {accessLevel === 'DEMO'
              ? `Demo Preview · ${intelState.demoSignalsUsed}/${intelState.demoSignalsLimit} demo signals used`
              : 'Guest Sample Preview'}
          </span>
          {variant === 'modal' && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Intelligence Gate"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-6 bg-gradient-to-b from-slate-50/70 via-white to-white">
        {/* Header & Value Proposition */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Protected Intelligence Layer · {catalogMeta.pillarLabel}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              CareerOS Intelligence
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Turn career activity into structured evidence, capabilities and readiness signals.
            </p>
            {sampleContextNote && (
              <p className="text-xs text-slate-500 bg-slate-100/80 border border-slate-200/70 rounded-xl px-3.5 py-2 leading-relaxed">
                {sampleContextNote}
              </p>
            )}
          </div>

          {/* Sample vs Full Comparison Pill Box */}
          <div className="grid grid-cols-2 gap-2.5 shrink-0 w-full lg:w-80 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                Sample Intelligence
              </div>
              <div className="text-[11px] text-amber-950 font-semibold">
                {accessLevel === 'DEMO' ? 'Limited Demo Signals' : 'Curated Examples'}
              </div>
              <p className="text-[10px] text-amber-800/80 leading-snug">
                {accessLevel === 'DEMO'
                  ? 'Inspect or generate up to 2 demo signals per capability.'
                  : 'Explore curated sample records and surface architecture.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-800">
                Full Intelligence
              </div>
              <div className="text-[11px] text-blue-950 font-semibold">
                Complete Signal Graph
              </div>
              <p className="text-[10px] text-blue-800/80 leading-snug">
                Live attribution, full knowledge pool &amp; readiness diagnostics.
              </p>
            </div>
          </div>
        </div>

        {/* Abstract / Blurred Structural Preview (Zero proprietary values in DOM) */}
        {variant !== 'compact' && (
          <div className="relative rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 sm:p-5 overflow-hidden">
            {/* Abstract Synthetic Signal Canvas (Pure visual structure, no hidden real values) */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 select-none pointer-events-none opacity-65 blur-[2px]"
              aria-hidden="true"
            >
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-24 rounded bg-blue-200" />
                  <div className="h-4 w-12 rounded-full bg-emerald-100" />
                </div>
                <div className="h-2 w-full rounded bg-slate-100" />
                <div className="h-2 w-4/5 rounded bg-slate-100" />
                <div className="pt-1 flex items-center gap-1.5">
                  <div className="h-1.5 flex-1 rounded-full bg-blue-500/40" />
                  <div className="h-1.5 w-8 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-28 rounded bg-purple-200" />
                  <div className="h-4 w-14 rounded-full bg-purple-100" />
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <div className="h-8 rounded bg-slate-100" />
                  <div className="h-8 rounded bg-indigo-100/70" />
                  <div className="h-8 rounded bg-blue-100/70" />
                  <div className="h-8 rounded bg-emerald-100/70" />
                </div>
                <div className="h-2 w-3/4 rounded bg-slate-100" />
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-20 rounded bg-indigo-200" />
                  <div className="h-4 w-10 rounded-full bg-blue-100" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded bg-slate-100" />
                  <div className="h-2 w-5/6 rounded bg-slate-100" />
                  <div className="h-2 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            </div>

            {/* Foreground Feature Pillar Cards */}
            <div className="mt-4 pt-4 border-t border-slate-200/80">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                CareerOS Intelligence Capabilities Included in Full Access
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {FEATURE_PILLARS.map((pillar) => {
                  const Icon = pillar.icon;
                  const isCurrentPillar = pillar.title === catalogMeta.pillarLabel;
                  return (
                    <div
                      key={pillar.id}
                      className={`p-3 rounded-xl border bg-white transition-all ${
                        isCurrentPillar
                          ? 'border-blue-400 ring-1 ring-blue-500/20 shadow-2xs'
                          : 'border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${pillar.accent}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                          {pillar.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {pillar.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Message when Seat is Requested */}
        {isSeatRequested && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">CareerOS Seat Request Recorded.</span>{' '}
                <span>
                  Your workspace is queued for Full Intelligence activation. You can continue exploring Sample &amp; Demo Intelligence in the meantime.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {accessLevel === 'DEMO'
                ? 'You are viewing Sample Intelligence in Demo Workspace. Unlock Full Intelligence for complete graph & attribution signals.'
                : 'You are viewing Sample Intelligence. Enter Demo for limited interactive signals or request a CareerOS Seat.'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleContinueWithDemo}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5 text-amber-600" />
              <span>Continue with Demo</span>
            </button>

            <button
              type="button"
              onClick={handleRequestSeat}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Request a CareerOS Seat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div
          className="fixed inset-0"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto">
          {gateCard}
        </div>
      </div>
    );
  }

  return gateCard;
};
