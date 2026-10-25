import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Target,
  Layers,
  FileCheck2,
  TrendingUp,
  Zap,
  ShieldCheck,
  BookOpen,
  Radio,
  Compass
} from 'lucide-react';
import {
  ConnectedInterviewOutcome,
  LiveInterviewEcosystemService,
  UpstreamInterviewContext
} from '../../services/liveInterviewEcosystemService';
import { IntelligenceModeBadge, CareerOSIntelligenceGate } from '../access/CareerOSIntelligenceGate';
import { ProtectedFrameworkAttribution } from '../access/ProtectedPreviewOverlay';
import { useAccessControl } from '../../services/accessControlService';

export const ECOSYSTEM_FLOW_STEPS = [
  { id: 'target_role', label: 'Target Role', phase: 'upstream' },
  { id: 'role_blueprint', label: 'Role Blueprint', phase: 'upstream' },
  { id: 'capability_model', label: 'Capability Model', phase: 'upstream' },
  { id: 'qa_blueprint', label: 'Q&A Blueprint', phase: 'upstream' },
  { id: 'live_interview', label: 'Live Interview', phase: 'active' },
  { id: 'performance_signals', label: 'Performance Signals', phase: 'downstream' },
  { id: 'evidence', label: 'Evidence', phase: 'downstream' },
  { id: 'capability_signals', label: 'Capability Signals', phase: 'downstream' },
  { id: 'readiness', label: 'Readiness', phase: 'downstream' },
  { id: 'next_best_action', label: 'Next Best Action', phase: 'downstream' }
] as const;

interface ConnectedEcosystemChainStripProps {
  activeStage: 'setup' | 'live' | 'completed';
  upstream?: UpstreamInterviewContext;
  compact?: boolean;
}

export const ConnectedEcosystemChainStrip: React.FC<ConnectedEcosystemChainStripProps> = ({
  activeStage,
  upstream,
  compact = false
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Compass className="w-3 h-3 text-indigo-600" />
            CareerOS Connected Intelligence Pipeline
          </span>
          <IntelligenceModeBadge capability="ai_interview_analysis" />
        </div>
        {upstream && (
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
            <span>Role Blueprint: <strong className="text-slate-800">{upstream.roleBlueprint?.title || upstream.targetRoleTitle}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Q&amp;A Blueprints: <strong className="text-slate-800">{upstream.qaBlueprints.length} loaded</strong></span>
          </div>
        )}
      </div>

      {/* 10-Step Connected Chain */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
        {ECOSYSTEM_FLOW_STEPS.map((step, index) => {
          const isCompletedOrActive =
            activeStage === 'completed'
              ? true
              : activeStage === 'live'
                ? index <= 4
                : index <= 3;

          const isCurrentHighlight =
            (activeStage === 'setup' && index === 3) ||
            (activeStage === 'live' && index === 4) ||
            (activeStage === 'completed' && index >= 5);

          return (
            <React.Fragment key={step.id}>
              <div
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                  isCurrentHighlight
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : isCompletedOrActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {isCompletedOrActive && !isCurrentHighlight && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                )}
                {isCurrentHighlight && (
                  <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                )}
                <span>{step.label}</span>
              </div>
              {index < ECOSYSTEM_FLOW_STEPS.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Upstream Context Summary Bar (when not compact) */}
      {!compact && upstream && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              1. Target Role
            </span>
            <p className="font-bold text-slate-900 truncate mt-0.5">
              {upstream.targetRoleTitle}
            </p>
            <span className="text-[10px] text-slate-500">{upstream.targetDomain}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              2. Role Blueprint
            </span>
            <p className="font-bold text-slate-900 truncate mt-0.5">
              {upstream.roleBlueprint?.title || `${upstream.targetLevel} ${upstream.targetRoleCategory}`}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {upstream.roleBlueprint?.competencies?.length || 4} Core Pillars Mapped
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              3. Capability Model
            </span>
            <p className="font-bold text-slate-900 truncate mt-0.5">
              {upstream.capabilityModel.map(c => c.pillarCategory).join(' · ')}
            </p>
            <span className="text-[10px] text-slate-500">4 Signal Dimensions Active</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              4. Q&amp;A Blueprint
            </span>
            <p className="font-bold text-slate-900 truncate mt-0.5">
              {upstream.qaBlueprints[0]?.title || upstream.selectedScenarioTitle}
            </p>
            <span className="text-[10px] text-purple-700 font-semibold">
              {upstream.qaBlueprints.length} {upstream.qaBlueprints.length === 1 ? 'Blueprint' : 'Blueprints'} Bound
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

interface InterviewIntelligenceOutcomePanelProps {
  outcome: ConnectedInterviewOutcome;
  onNavigateTab?: (tab: string) => void;
  onOpenMissionControl?: () => void;
  onExecuteNextAction?: () => void;
  onRestartSession?: () => void;
}

export const InterviewIntelligenceOutcomePanel: React.FC<InterviewIntelligenceOutcomePanelProps> = ({
  outcome,
  onNavigateTab,
  onOpenMissionControl,
  onExecuteNextAction,
  onRestartSession
}) => {
  const { accessLevel } = useAccessControl();
  const isGuest = accessLevel === 'PUBLIC' || accessLevel === 'GUEST';
  const isDemo = accessLevel === 'DEMO';
  const isFull = accessLevel === 'FULL';

  const [committedEvidenceIds, setCommittedEvidenceIds] = useState<string[]>(
    outcome.potentialEvidence.filter(e => e.isAlreadyLinked).map(e => e.id)
  );
  const [readinessApplied, setReadinessApplied] = useState<boolean>(false);

  const handleConfirmSignalAndEvidence = (evidenceId?: string) => {
    if (isGuest) return;
    LiveInterviewEcosystemService.applyOutcomeToEcosystem(outcome, evidenceId);
    if (evidenceId && !committedEvidenceIds.includes(evidenceId)) {
      setCommittedEvidenceIds(prev => [...prev, evidenceId]);
    } else if (outcome.potentialEvidence[0] && !committedEvidenceIds.includes(outcome.potentialEvidence[0].id)) {
      setCommittedEvidenceIds(prev => [...prev, outcome.potentialEvidence[0].id]);
    }
    setReadinessApplied(true);
  };

  const handleRunNextAction = () => {
    if (!readinessApplied && !isGuest) {
      handleConfirmSignalAndEvidence();
    }
    if (onExecuteNextAction) {
      onExecuteNextAction();
      return;
    }
    if (onNavigateTab) {
      onNavigateTab(outcome.recommendedNextAction.targetTab);
    } else {
      window.dispatchEvent(
        new CustomEvent('career_navigate_tab', { detail: outcome.recommendedNextAction.targetTab })
      );
    }
  };

  return (
    <div
      data-protected-ip="Live Interview Performance Signals & Readiness Attribution"
      className="space-y-5 animate-in fade-in duration-200"
    >
      {/* 1. Connected Pipeline Strip */}
      <ConnectedEcosystemChainStrip activeStage="completed" upstream={outcome.upstream} />

      {/* 2. Main Concise Connected Intelligence Result Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
                <Radio className="w-3 h-3 text-purple-600" />
                Live Interview Intelligence Outcome
              </span>
              <IntelligenceModeBadge capability="ai_interview_analysis" />
              {isGuest && (
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Guest Sample Preview · Basic Feedback
                </span>
              )}
              {isDemo && (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Demo Workspace Connected · Sample Evidence &amp; Readiness
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Connected Career Intelligence Synthesis
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Target Role: <strong className="text-slate-900">{outcome.upstream.targetRoleTitle}</strong> ({outcome.upstream.targetDomain}) · Scenario: <strong className="text-slate-800">{outcome.upstream.selectedScenarioTitle}</strong>
            </p>
          </div>

          {!isGuest && (
            <button
              type="button"
              onClick={() => handleConfirmSignalAndEvidence()}
              disabled={readinessApplied}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-xs ${
                readinessApplied
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${readinessApplied ? 'text-emerald-600' : 'text-emerald-400'}`} />
              <span>
                {readinessApplied ? 'Synced to Active Career Mission' : 'Sync Signals to Active Mission'}
              </span>
            </button>
          )}
        </div>

        {/* ============================================================
            SECTION A: INTERVIEW SIGNALS
            Communication | Technical Reasoning | Stakeholder Management | Product Judgment
           ============================================================ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              INTERVIEW SIGNALS
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              {isGuest
                ? 'Basic qualitative feedback (evaluation model protected)'
                : isDemo
                  ? 'Connected to Demo Workspace capabilities'
                  : 'Full multi-dimensional signal attribution'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {outcome.interviewSignals.map(sig => (
              <div
                key={sig.dimension}
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white transition-all flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {sig.dimension}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                        sig.signalStatus === 'Verified Signal' || sig.signalStatus === 'Strong Signal'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : sig.signalStatus === 'Sample Signal'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {sig.signalStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sig.qualitativeSummary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Connected Capability
                  </span>
                  <span className="text-[11px] font-bold text-indigo-900 truncate block mt-0.5">
                    {sig.connectedCapability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            SECTION B & C:
            "Potential Evidence Detected" + "Capability Signals" & "Readiness Signal Updated"
           ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          {/* Left 7 Cols: Potential Evidence Detected */}
          <div className="lg:col-span-7 p-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                    Potential Evidence Detected
                  </h4>
                  <p className="text-[11px] text-emerald-800/80 font-medium">
                    Structured career proof mapped from your interview dialogue turns
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-emerald-800 border border-emerald-200">
                {outcome.potentialEvidence.length} {outcome.potentialEvidence.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>

            <div className="space-y-2.5">
              {outcome.potentialEvidence.map(ev => {
                const isLinked = committedEvidenceIds.includes(ev.id);
                return (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl bg-white border border-emerald-200/90 shadow-3xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-slate-900">
                            {ev.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-700">
                            {ev.category}
                          </span>
                          {ev.isSamplePreview && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {isGuest ? 'Curated Sample' : 'Demo Evidence'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {ev.summary}
                        </p>
                      </div>

                      {!isGuest && (
                        <button
                          type="button"
                          onClick={() => handleConfirmSignalAndEvidence(ev.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                            isLinked
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isLinked ? 'Linked to Evidence' : 'Link Evidence'}</span>
                        </button>
                      )}
                    </div>

                    {/* Linked Capabilities & Metrics */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                      {ev.linkedCapabilities.slice(0, 3).map((cap, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-100"
                        >
                          Capability: {cap}
                        </span>
                      ))}
                      {ev.metricsPreview.map((m, idx) => (
                        <span
                          key={`m-${idx}`}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 Cols: Capability Signals + Readiness Signal Updated */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Readiness Signal Updated */}
            <div className="p-5 rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-blue-950">
                      Readiness Signal Updated
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Connected to Active Career Mission
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {outcome.readinessUpdate.readinessDeltaLabel}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {outcome.readinessUpdate.missionTitle}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 font-semibold line-through">
                      {outcome.readinessUpdate.previousReadiness}%
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-xl font-black text-blue-700">
                      {outcome.readinessUpdate.updatedReadiness}%
                    </span>
                    <span className="text-[11px] font-bold text-slate-600">
                      Role Readiness
                    </span>
                  </div>
                </div>

                {onOpenMissionControl && (
                  <button
                    type="button"
                    onClick={onOpenMissionControl}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 transition-colors cursor-pointer"
                  >
                    Mission Control
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {outcome.readinessUpdate.statusMessage}
              </p>
            </div>

            {/* Capability Signals */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Capability Signals Attributed
                </span>
                <span className="text-[10px] font-bold text-indigo-700">
                  Role Blueprint Aligned
                </span>
              </div>
              <div className="space-y-1.5">
                {outcome.capabilitySignals.slice(0, isGuest ? 2 : 4).map((cs, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 block truncate">
                        {cs.capabilityName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {cs.signalDimension} · {cs.impactSummary}
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 shrink-0">
                      {cs.tierBadge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION D: "Recommended Next Action"
           ============================================================ */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-500/30 shadow-md">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-5 h-5 fill-amber-300" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                  Recommended Next Action
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-blue-200 border border-white/10">
                  {outcome.recommendedNextAction.stageLabel}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                {outcome.recommendedNextAction.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {outcome.recommendedNextAction.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            {onRestartSession && (
              <button
                type="button"
                onClick={onRestartSession}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Practice Again
              </button>
            )}
            <button
              type="button"
              onClick={handleRunNextAction}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{outcome.recommendedNextAction.ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Intelligence Gate for Guest / Demo to communicate full CareerOS Intelligence value */}
      {!isFull && (
        <CareerOSIntelligenceGate
          capability="ai_interview_analysis"
          featureTitle="CareerOS Live Interview & Readiness Intelligence"
          sampleContextNote={
            isGuest
              ? 'Guest Sample Live Interview · Showing basic signal feedback (1 sample question)'
              : 'Demo Workspace Session · Connected to Demo capabilities, sample evidence, and readiness impact'
          }
        />
      )}

      {/* 4. Subtle Proprietary Framework Attribution */}
      <ProtectedFrameworkAttribution
        areaLabel="Connected Interview Signals, Evidence & Readiness Attribution"
        variant="minimal"
      />
    </div>
  );
};
