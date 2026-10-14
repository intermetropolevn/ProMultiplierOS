// =========================================================================
// CAREER OS - CAPABILITY ACTIVATION INSPECTOR & SIMULATOR
// =========================================================================

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Search, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Sliders, 
  Database, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  Check,
  Code2,
  BrainCircuit,
  Eye,
  Settings,
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';
import { CapabilityActivationEngine } from '../../../features/intelligence/activation/capabilityActivationEngine';
import { 
  ActivationDecision, 
  CapabilityLevel, 
  UserFacingMode, 
  UserOverrideMode, 
  TriggerSignals, 
  SystemEventType 
} from '../../../features/intelligence/activation/types';
import { ActivationMemoryStore } from '../../../features/intelligence/activation/activationMemoryStore';
import { AcceptanceTestRunner, ACCEPTANCE_TEST_DEFINITIONS } from '../../../features/intelligence/activation/acceptanceTests';

interface CapabilityActivationInspectorProps {
  initialPrompt?: string;
  onApplyPrompt?: (prompt: string) => void;
}

export const CapabilityActivationInspector: React.FC<CapabilityActivationInspectorProps> = ({
  initialPrompt = 'Phân tích job này, tìm skill gap và đề xuất roadmap.',
  onApplyPrompt,
}) => {
  // Input State
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [userOverride, setUserOverride] = useState<UserOverrideMode>('auto');
  const [isDevMode, setIsDevMode] = useState(true);

  // Active Decision
  const [currentDecision, setCurrentDecision] = useState<ActivationDecision>(() => {
    return CapabilityActivationEngine.evaluatePrompt(initialPrompt);
  });

  // Recent Decisions History
  const [recentDecisions, setRecentDecisions] = useState<ActivationDecision[]>(() => {
    return ActivationMemoryStore.getRecentDecisions(15);
  });

  // Acceptance Tests State
  const [acceptanceResults, setAcceptanceResults] = useState<ReturnType<typeof AcceptanceTestRunner.runAll> | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Re-run evaluation on prompt or override change
  const handleEvaluate = (promptToEval = inputPrompt, override = userOverride) => {
    if (!promptToEval.trim()) return;
    const decision = CapabilityActivationEngine.evaluatePrompt(promptToEval, {
      userOverride: override,
    });
    setCurrentDecision(decision);
    setRecentDecisions(ActivationMemoryStore.getRecentDecisions(15));
  };

  // System Event Trigger
  const handleTriggerEvent = (eventType: SystemEventType) => {
    let payload: any = { eventType };
    if (eventType === 'JOB_SAVED') {
      payload = {
        eventType,
        jobId: 'job-fintech-lead',
        company: 'Stripe Asia',
        role: 'Senior Product Manager',
      };
    } else if (eventType === 'CASE_SUBMITTED') {
      payload = {
        eventType,
        caseId: 'case-sea-expansion',
        company: 'Grab Financial',
        role: 'Strategy & Ops Manager',
        score: 64, // Low score triggering diagnostic failure loop
        submissionText: 'Market expansion proposal with revenue waterfall model.'
      };
    } else if (eventType === 'FEEDBACK_RECEIVED') {
      payload = {
        eventType,
        company: 'ShopeePay',
        role: 'Product Lead',
        evaluatorFeedback: 'Candidate showed strong MECE structuring, but lacked depth in Unit Economics sensitivity analysis.'
      };
    } else if (eventType === 'INTERVIEW_COMPLETED') {
      payload = {
        eventType,
        role: 'Staff Solutions Architect',
        company: 'AWS Vietnam',
        interviewTranscript: 'Technical system design covering multi-region active-active database replication and failover.'
      };
    }

    const decision = CapabilityActivationEngine.evaluateSystemEvent(payload, {
      userOverride,
    });
    setCurrentDecision(decision);
    setRecentDecisions(ActivationMemoryStore.getRecentDecisions(15));
  };

  // Run Acceptance Tests
  const handleRunAllAcceptanceTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const suite = AcceptanceTestRunner.runAll();
      setAcceptanceResults(suite);
      setIsRunningTests(false);
      setRecentDecisions(ActivationMemoryStore.getRecentDecisions(15));
    }, 250);
  };

  // Level Badge Theme
  const getLevelTheme = (level: CapabilityLevel) => {
    switch (level) {
      case 'L0':
        return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', dot: 'bg-slate-500' };
      case 'L1':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
      case 'L2':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
      case 'L3':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' };
      case 'L4':
        return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', dot: 'bg-amber-600' };
    }
  };

  const levelTheme = getLevelTheme(currentDecision.selectedLevel);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Capability Activation & Trigger Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Core v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Decides "Task này cần activate intelligence đến mức nào?" across 5 tiers (L0 Direct to L4 Deep Research).
            </p>
          </div>
        </div>

        {/* User / Dev Mode Toggle */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setIsDevMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                !isDevMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>User Mode</span>
            </button>
            <button
              onClick={() => setIsDevMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                isDevMode ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Developer Inspect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Inputs & Override Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Task / Prompt Simulator</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">User Override:</span>
            <select
              value={userOverride}
              onChange={(e) => {
                const val = e.target.value as UserOverrideMode;
                setUserOverride(val);
                handleEvaluate(inputPrompt, val);
              }}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="auto">Auto (Engine Decides)</option>
              <option value="quick">Quick (L0 Direct)</option>
              <option value="standard">Standard (L1 Contextual)</option>
              <option value="deep_analysis">Deep Analysis (L2 Agentic)</option>
              <option value="deep_research">Deep Research (L4 Max Compute)</option>
            </select>
          </div>
        </div>

        {/* Text Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEvaluate()}
            placeholder="Nhập câu hỏi hoặc yêu cầu (VD: 'CV là gì?', 'CV của mình match job này không?')..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleEvaluate()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Evaluate</span>
          </button>
        </div>

        {/* Quick Sample Presets (from Acceptance Criteria A-E) */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Standard Acceptance Scenarios (1-Click Test):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'A: CV là gì? (L0)', prompt: 'CV là gì?' },
              { label: 'B: CV của mình match job này không? (L1)', prompt: 'CV của mình match job này không?' },
              { label: 'C: Phân tích job, skill gap & roadmap (L2)', prompt: 'Phân tích job này, tìm skill gap và đề xuất roadmap.' },
              { label: 'D: Giải case bằng data & tính toán (L3)', prompt: 'Giải case này bằng data, tính toán và đưa recommendation.' },
              { label: 'E: Deep research company X & market (L4)', prompt: 'Deep research company X và market của nó.' },
              { label: 'J: Mixed VN/EN Code-Switching', prompt: 'Evaluate fit của mình cho job Fintech PM này và highlight các skill gaps cần improve.' }
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputPrompt(preset.prompt);
                  handleEvaluate(preset.prompt);
                }}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* System Event Trigger Row (Rule #5) */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            System Event Triggers (Rule #5 & #6):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { event: 'JOB_SAVED' as SystemEventType, label: 'Trigger JOB_SAVED' },
              { event: 'CASE_SUBMITTED' as SystemEventType, label: 'Trigger CASE_SUBMITTED (Diagnostic)' },
              { event: 'FEEDBACK_RECEIVED' as SystemEventType, label: 'Trigger FEEDBACK_RECEIVED' },
              { event: 'INTERVIEW_COMPLETED' as SystemEventType, label: 'Trigger INTERVIEW_COMPLETED' }
            ].map((evt, idx) => (
              <button
                key={idx}
                onClick={() => handleTriggerEvent(evt.event)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/60 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-purple-600" />
                <span>{evt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Decision Output Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5">
        
        {/* Level & Mode Indicator Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Active Execution Mode
            </span>
            <div className="flex items-center gap-3 mt-1">
              {/* User-facing label (Rule #10) */}
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{currentDecision.userFacingMode}</span>
                <span className="text-xs font-medium text-slate-400">Mode</span>
              </h3>

              {/* Developer badge */}
              {isDevMode && (
                <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${levelTheme.bg} ${levelTheme.text} ${levelTheme.border} flex items-center gap-1.5`}>
                  <span className={`w-2 h-2 rounded-full ${levelTheme.dot}`} />
                  <span>{currentDecision.selectedLevel}</span>
                </span>
              )}

              {currentDecision.userOverrideApplied && currentDecision.userOverrideApplied !== 'auto' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                  User Override
                </span>
              )}

              {currentDecision.episodicMemoryHit && currentDecision.episodicMemoryHit.hit && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>Memory Hit</span>
                </span>
              )}
            </div>
          </div>

          {/* Activation Score Gauge */}
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/80">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-500">Activation Score</span>
                <span className="text-sm font-extrabold text-slate-900">{currentDecision.activationScore}/100</span>
              </div>
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                <div 
                  className={`h-full rounded-full ${
                    currentDecision.activationScore <= 20 ? 'bg-slate-400' :
                    currentDecision.activationScore <= 40 ? 'bg-blue-500' :
                    currentDecision.activationScore <= 65 ? 'bg-emerald-500' :
                    currentDecision.activationScore <= 85 ? 'bg-purple-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.max(5, currentDecision.activationScore)}%` }}
                />
              </div>
            </div>
            <div className="text-right pl-3 border-l border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Intent</span>
              <span className="text-xs font-bold text-slate-800">{currentDecision.detectedIntent}</span>
            </div>
          </div>
        </div>

        {/* Decision Rationale */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Engine Justification:
          </span>
          <p className="leading-relaxed font-medium text-slate-700">
            {currentDecision.decisionReason}
          </p>
        </div>

        {/* CAPABILITIES MATRIX (Rule #4 Independent Flags) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Independent Capabilities Activation Matrix (Rule #4)</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">
              Activated based on individual task necessity, not monolithic package
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'retrieval', label: 'Retrieval', active: currentDecision.activatedCapabilities.retrieval, desc: 'Internal Evidence Ledger' },
              { id: 'planning', label: 'Planning', active: currentDecision.activatedCapabilities.planning, desc: 'Multi-Step Goal DAG' },
              { id: 'memory', label: 'Memory', active: currentDecision.activatedCapabilities.memory, desc: 'Episodic & Procedural' },
              { id: 'tools', label: 'Tools', active: currentDecision.activatedCapabilities.tools, desc: 'Calculators / Parsers' },
              { id: 'code', label: 'Code / Math', active: currentDecision.activatedCapabilities.code, desc: 'Quantitative Sandbox' },
              { id: 'research', label: 'Research', active: currentDecision.activatedCapabilities.research, desc: 'Secondary Research' },
              { id: 'deepResearch', label: 'Deep Research', active: currentDecision.activatedCapabilities.deepResearch, desc: 'Exhaustive Multi-Source' },
              { 
                id: 'verification', 
                label: `Verify: ${currentDecision.activatedCapabilities.verification}`, 
                active: currentDecision.activatedCapabilities.verification !== 'none', 
                desc: currentDecision.activatedCapabilities.verification === 'rigorous' ? 'Multi-Criteria Rubric' : 'Lightweight Check'
              },
              { id: 'multipleCandidates', label: 'Candidates', active: currentDecision.activatedCapabilities.multipleCandidates, desc: 'Hypothesis Ranking' },
              { id: 'reflection', label: 'Reflection', active: currentDecision.activatedCapabilities.reflection, desc: 'Self-Correction Loop' },
            ].map(cap => (
              <div 
                key={cap.id}
                className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                  cap.active 
                    ? 'bg-indigo-50/60 border-indigo-200 text-indigo-900 shadow-2xs' 
                    : 'bg-slate-50/60 border-slate-200/70 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{cap.label}</span>
                  <span className={`w-2 h-2 rounded-full ${cap.active ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DEVELOPER / DEBUG VIEW ONLY (Rule #10) */}
        {isDevMode && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* 13 Trigger Signals Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>13 Trigger Signals Analysis (Rule #3)</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  Non-keyword semantic weighting
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {(Object.entries(currentDecision.signals) as [keyof TriggerSignals, number][]).map(([key, value]) => (
                  <div key={key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[11px] font-semibold text-slate-600 truncate pr-1" title={key}>
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-extrabold text-slate-800">{value}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          value > 70 ? 'bg-amber-500' : value > 40 ? 'bg-blue-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.max(4, value)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compute Budget & Guardrails */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Token Budget</span>
                <span className="text-sm font-extrabold text-slate-800">{currentDecision.computeBudget.maxTokens.toLocaleString()} tokens</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Tier: {currentDecision.computeBudget.costTier.toUpperCase()}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Max Tool Calls</span>
                <span className="text-sm font-extrabold text-slate-800">{currentDecision.computeBudget.maxToolCalls} tool ops</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Max steps: {currentDecision.computeBudget.maxSteps}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Latency Ceiling</span>
                <span className="text-sm font-extrabold text-slate-800">{currentDecision.computeBudget.maxLatencyMs} ms</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Hard timeout cutoff</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Actual Outcome</span>
                <span className="text-sm font-extrabold text-emerald-700">{currentDecision.finalOutcome?.durationMs || 450} ms</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Tokens: ~{currentDecision.finalOutcome?.tokensUsed || 350}</span>
              </div>
            </div>

            {/* Escalation & De-escalation Audit Timeline */}
            {(currentDecision.escalations.length > 0 || currentDecision.deEscalations.length > 0) && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dynamic Escalation / De-escalation Trail</span>
                </span>
                {currentDecision.escalations.map((esc, i) => (
                  <div key={i} className="flex items-start gap-2 text-amber-900">
                    <ArrowUpRight className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{esc.fromLevel} → {esc.toLevel}</span>: {esc.reason}
                    </div>
                  </div>
                ))}
                {currentDecision.deEscalations.map((de, i) => (
                  <div key={i} className="flex items-start gap-2 text-emerald-900">
                    <ArrowDownRight className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{de.fromLevel} → {de.toLevel}</span>: {de.reason}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Execution Trace Logs */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Execution Trace Logs:
              </span>
              <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto max-h-40">
                {currentDecision.executionLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0">[{log.phase}]</span>
                    <span className={
                      log.status === 'escalated' ? 'text-amber-400' :
                      log.status === 'deescalated' ? 'text-emerald-400' :
                      log.status === 'warning' ? 'text-orange-300' : 'text-slate-300'
                    }>
                      {log.detail}
                    </span>
                  </div>
                ))}
                {currentDecision.finalOutcome?.followUpOffer && (
                  <div className="text-blue-400 pt-1">
                    → UI Offer: "{currentDecision.finalOutcome.followUpOffer}"
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ACCEPTANCE TEST SUITE (Section 11) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Acceptance Test Verification Suite (A – J)</span>
              </h3>
              {acceptanceResults && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  acceptanceResults.allPassed 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {acceptanceResults.totalPassed}/{acceptanceResults.totalTests} Passed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verifies all 10 specific acceptance criteria from specification (L0 definition to L4 deep research, escalation, de-escalation, memory, mixed lang).
            </p>
          </div>

          <button
            onClick={handleRunAllAcceptanceTests}
            disabled={isRunningTests}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isRunningTests ? 'Running Suite...' : 'Run All 10 Tests'}</span>
          </button>
        </div>

        {/* Tests List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACCEPTANCE_TEST_DEFINITIONS.map(test => {
            const res = acceptanceResults?.results.find(r => r.testId === test.id);
            return (
              <div 
                key={test.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  res 
                    ? res.passed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center">
                        {test.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{test.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        Exp: {test.expectedLevel}
                      </span>
                      {res && (
                        res.passed ? (
                          <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>PASS</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-extrabold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                            <XCircle className="w-3 h-3 text-red-600" />
                            <span>FAIL ({res.actualLevel})</span>
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-mono text-slate-700 bg-white/80 p-2 rounded-lg border border-slate-200/70 mt-2">
                    "{test.prompt}"
                  </p>

                  <p className="text-[11px] text-slate-500 font-medium mt-1.5">
                    {test.description}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Mode: {test.expectedMode}
                  </span>
                  <button
                    onClick={() => {
                      setInputPrompt(test.prompt);
                      setUserOverride(test.override || 'auto');
                      const singleRes = AcceptanceTestRunner.runTest(test);
                      setCurrentDecision(singleRes.decision);
                      setRecentDecisions(ActivationMemoryStore.getRecentDecisions(15));
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
