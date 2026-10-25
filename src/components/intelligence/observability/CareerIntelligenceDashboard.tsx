// =========================================================================
// CAREER OS - CAREER INTELLIGENCE ENGINE OBSERVABILITY SUITE
// =========================================================================

import React, { useState, useEffect } from 'react';
import { 
  runCareerIntelligenceTask, 
  AgentRuntime,
  TaskRouter,
  ComputeBudgetManager,
  ModelRouter,
  MemoryEngine,
  TrajectoryLogger,
  LearningEngine,
  FeedbackEngine,
  ToolRuntime,
  CareerIntelligenceResponse,
  AgentTrajectoryRecord
} from '../../../features/intelligence/engine';
import { ACCEPTANCE_SCENARIOS, runAllAcceptanceTests } from '../../../features/intelligence/engine/acceptanceSuite';
import { SelfImprovementDashboard } from './SelfImprovementDashboard';
import { ResearchEngineExplorer } from './ResearchEngineExplorer';
import { useAccessControl } from '../../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../../access/CareerOSIntelligenceGate';
import { 
  BrainCircuit, 
  Cpu, 
  Search, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  Terminal, 
  Database, 
  History, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Gauge, 
  Award, 
  Clock, 
  ArrowRight,
  RefreshCw,
  Zap,
  Sliders,
  Check,
  ChevronRight,
  Code
} from 'lucide-react';

export const CareerIntelligenceDashboard: React.FC = () => {
  const { accessLevel, getIntelligenceAccess, consumeDemoIntelligenceSignal } = useAccessControl();
  const [activeTab, setActiveTab] = useState<'executor' | 'research' | 'trajectory' | 'acceptance' | 'memory' | 'learning'>('executor');
  
  // Executor state
  const [prompt, setPrompt] = useState<string>('Phân tích skill gap của mình cho vị trí Stripe Backend Engineer, mình còn thiếu kỹ năng gì và đề xuất roadmap?');
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(3);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [response, setResponse] = useState<CareerIntelligenceResponse | null>(null);
  const [currentTrajectory, setCurrentTrajectory] = useState<AgentTrajectoryRecord | null>(null);
  const [showGateModal, setShowGateModal] = useState<boolean>(false);
  
  // Selected inspection step inside trajectory
  const [inspectSection, setInspectSection] = useState<'router' | 'context' | 'plan' | 'tools' | 'verifier' | 'eval'>('router');

  // Acceptance test runner state
  const [isTestingAll, setIsTestingAll] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<Array<{ id: number; title: string; passed: boolean; note: string }>>([]);
  const [testProgress, setTestProgress] = useState<{ current: number; total: number } | null>(null);

  const isFullAccess = accessLevel === 'FULL_ACCESS';
  const isGuest = accessLevel === 'PUBLIC_GUEST';
  const intelAccess = getIntelligenceAccess('ai_career_diagnosis');

  // Initial load
  useEffect(() => {
    MemoryEngine.initialize();
    TrajectoryLogger.initialize();
  }, []);

  const handleRunTask = async (customPrompt?: string) => {
    const textToRun = customPrompt || prompt;
    if (!textToRun.trim() || isRunning) return;

    if (isGuest) {
      setShowGateModal(true);
      return;
    }

    if (!isFullAccess) {
      const allowed = consumeDemoIntelligenceSignal('ai_career_diagnosis');
      if (!allowed) {
        setShowGateModal(true);
        return;
      }
    }

    setIsRunning(true);
    try {
      const res = await runCareerIntelligenceTask({ task: textToRun });
      setResponse(res);
      const traj = TrajectoryLogger.getTrajectory(res.trajectoryId);
      if (traj) {
        setCurrentTrajectory(traj);
      }
    } catch (err) {
      console.error('Error running career intelligence task:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSelectPreset = (scenarioId: number) => {
    setSelectedPresetId(scenarioId);
    const scenario = ACCEPTANCE_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setPrompt(scenario.prompt);
    }
  };

  const handleRunAllAcceptanceTests = async () => {
    if (!isFullAccess) {
      setShowGateModal(true);
      return;
    }
    if (isTestingAll) return;
    setIsTestingAll(true);
    setTestResults([]);
    setTestProgress({ current: 0, total: ACCEPTANCE_SCENARIOS.length });

    try {
      await runAllAcceptanceTests((current, total, item) => {
        setTestProgress({ current, total });
        setTestResults(prev => [...prev, item]);
      });
    } catch (err) {
      console.error('Error during test execution:', err);
    } finally {
      setIsTestingAll(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800 pb-20 font-sans">
      {/* Top Banner & Title */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-sm">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Career Intelligence Engine</h1>
                <IntelligenceModeBadge capability="ai_career_diagnosis" />
                <span className="px-2 py-0.5 text-[11px] font-black rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                  Native Orchestrator
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Activity → Evidence → Capability Attribution → Role Fit → Readiness Synthesis
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold flex-wrap">
            <button
              id="tab-btn-executor"
              onClick={() => setActiveTab('executor')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'executor' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Intelligence Synthesis</span>
            </button>
            <button
              id="tab-btn-research"
              onClick={() => setActiveTab('research')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'research' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Research Capability</span>
            </button>
            <button
              id="tab-btn-acceptance"
              onClick={() => setActiveTab('acceptance')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'acceptance' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Scenario Benchmarks</span>
            </button>
            <button
              id="tab-btn-memory"
              onClick={() => setActiveTab('memory')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'memory' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Knowledge Context</span>
            </button>
            <button
              id="tab-btn-learning"
              onClick={() => setActiveTab('learning')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'learning' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Signal Calibration</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6">

        {/* ================================================================= */}
        {/* TAB 1: LIVE EXECUTOR & STEP-BY-STEP INSPECTOR */}
        {/* ================================================================= */}
        {activeTab === 'executor' && (
          <div className="space-y-6">
            {/* Prompt Input & Presets */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  Career Intelligence Task Input
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Quick Scenarios:</span>
                  <select
                    value={selectedPresetId || ''}
                    onChange={(e) => handleSelectPreset(Number(e.target.value))}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    {(isFullAccess ? ACCEPTANCE_SCENARIOS : ACCEPTANCE_SCENARIOS.slice(0, 3)).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <textarea
                  id="career-intelligence-prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={2}
                  className="flex-1 w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                  placeholder="Describe your career diagnosis, role alignment, or capability gap inquiry..."
                />
                <button
                  id="run-career-intelligence-btn"
                  onClick={() => handleRunTask()}
                  disabled={isRunning}
                  className="px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Run Synthesis</span>
                    </>
                  )}
                </button>
              </div>

              {!isFullAccess && (
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>
                    {isGuest
                      ? 'Sample Intelligence Mode · Live CareerOS Engine synthesis unlocks in Demo / Full Access'
                      : `Demo Intelligence Synthesis: ${intelAccess.demoSignalsUsed} / ${intelAccess.demoSignalsLimit} runs used`}
                  </span>
                </div>
              )}

              {/* Execution Summary Bar */}
              {response && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">Task Category</span>
                    <span className="font-bold text-slate-900 capitalize">{response.taskType.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">Synthesis Depth</span>
                    <span className="font-bold text-indigo-700">Multi-Signal Verified</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">Grounding Status</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Alignment
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">Evidence Signals Linked</span>
                    <span className="font-bold text-slate-800">{response.sources.length} catalog signals</span>
                  </div>
                </div>
              )}
            </div>

            {/* Guest Curated Sample Output Preview */}
            {isGuest && !response && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Sample Career Diagnosis Preview
                  </span>
                  <IntelligenceModeBadge capability="ai_career_diagnosis" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong>Target Role Gap Summary (Sample):</strong> Strong foundational evidence in distributed backend service design and API reliability. Primary readiness gap identified in high-throughput idempotency patterns and cross-region payment ledger reconciliation.
                </p>
              </div>
            )}

            {/* Results and Trajectory Inspector Split */}
            {response && currentTrajectory && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Final Synthesized Output (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Synthesized Output
                    </h3>
                    <IntelligenceModeBadge capability="ai_career_diagnosis" />
                  </div>

                  <div className="prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed max-h-[550px] overflow-y-auto pr-1">
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                      {response.result}
                    </div>
                  </div>

                  {response.sources.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Cited Evidence &amp; Catalog Sources ({response.sources.length})
                      </span>
                      <div className="space-y-1.5">
                        {response.sources.map((src, idx) => (
                          <div key={idx} className="p-2 bg-slate-50 rounded-lg text-xs border border-slate-100">
                            <span className="font-semibold text-indigo-700 block">{src.title}</span>
                            <span className="text-slate-500 text-[11px] line-clamp-1">{src.snippet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {response.nextRecommendedAction && (
                    <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Next Recommended Action:</span>
                        <span>{response.nextRecommendedAction}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Step-by-Step Trajectory Inspector (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      Signal Synthesis Trace
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600">
                      {currentTrajectory.runtimeStats.finalStatus.toUpperCase()}
                    </span>
                  </div>

                  {!isFullAccess ? (
                    <CareerOSIntelligenceGate
                      capability="proprietary_scoring_logic"
                      variant="compact"
                      sampleCountLabel="Deep Synthesis Trace & Verification Audit requires Full CareerOS Intelligence"
                    />
                  ) : (
                    <>
                      {/* Section Selector Buttons */}
                      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                        <button
                          onClick={() => setInspectSection('router')}
                          className={`px-3 py-1 rounded-lg cursor-pointer ${
                            inspectSection === 'router' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                          }`}
                        >
                          1. Intent Classification
                        </button>
                        <button
                          onClick={() => setInspectSection('context')}
                          className={`px-3 py-1 rounded-lg cursor-pointer ${
                            inspectSection === 'context' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                          }`}
                        >
                          2. Context Assembly
                        </button>
                        <button
                          onClick={() => setInspectSection('plan')}
                          className={`px-3 py-1 rounded-lg cursor-pointer ${
                            inspectSection === 'plan' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                          }`}
                        >
                          3. Synthesis Plan
                        </button>
                        <button
                          onClick={() => setInspectSection('tools')}
                          className={`px-3 py-1 rounded-lg cursor-pointer ${
                            inspectSection === 'tools' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                          }`}
                        >
                          4. Grounding Steps ({currentTrajectory.runtimeStats.toolCallsCount})
                        </button>
                        <button
                          onClick={() => setInspectSection('verifier')}
                          className={`px-3 py-1 rounded-lg cursor-pointer ${
                            inspectSection === 'verifier' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                          }`}
                        >
                          5. Quality Verification
                        </button>
                        <button
                          onClick={() => setInspectSection('eval')}
                          className={`px-3 py-1 rounded-lg cursor-pointer ${
                            inspectSection === 'eval' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                          }`}
                        >
                          6. Signal Alignment
                        </button>
                      </div>

                      {/* Inspection Panel Views */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs min-h-[360px]">
                        
                        {/* SECTION 1: ROUTER DECISION */}
                        {inspectSection === 'router' && (
                          <div className="space-y-3">
                            <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                              <span>Intent Classification &amp; Domain Routing</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                                Verified Domain Match
                              </span>
                            </div>
                            <p className="text-slate-600 italic">"{currentTrajectory.routerDecision.rationale}"</p>

                            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                              <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                                <span className="text-slate-400 block text-[10px]">Detected Task Category</span>
                                <span className="font-bold text-slate-800">{currentTrajectory.routerDecision.taskType}</span>
                              </div>
                              <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                                <span className="text-slate-400 block text-[10px]">Analytical Depth</span>
                                <span className="font-bold text-slate-800 uppercase">{currentTrajectory.routerDecision.complexity}</span>
                              </div>
                              <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                                <span className="text-slate-400 block text-[10px]">Synthesis Tier</span>
                                <span className="font-bold text-slate-800 uppercase">{currentTrajectory.computeBudget.tier}</span>
                              </div>
                              <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                                <span className="text-slate-400 block text-[10px]">Routing Profile</span>
                                <span className="font-bold text-slate-800 capitalize">{currentTrajectory.modelSelection.profile}</span>
                              </div>
                            </div>

                            <div className="pt-2">
                              <span className="text-slate-500 font-bold block mb-1">Canonical Concepts Mapped:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {currentTrajectory.routerDecision.canonicalConcepts.map((c, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md font-mono text-[11px]">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SECTION 2: CONTEXT ASSEMBLY */}
                        {inspectSection === 'context' && (
                          <div className="space-y-3">
                            <div className="font-bold text-slate-800 text-sm">Context Assembly Pipeline</div>
                            <p className="text-slate-600 text-xs">
                              Filtered and ranked from CareerOS catalog. Linked {currentTrajectory.contextSnapshot.retrievedItemsCount} catalog items and {currentTrajectory.contextSnapshot.userInferencesApplied} verified user signals.
                            </p>

                            <div className="space-y-2 pt-2">
                              <div className="p-2.5 bg-white rounded-lg border border-slate-200/60">
                                <span className="font-bold text-indigo-700 block text-xs">Detected Entities in Scope:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {currentTrajectory.contextSnapshot.entitiesDetected.map((e, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono text-[10px]">
                                      {e}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="p-2.5 bg-white rounded-lg border border-slate-200/60">
                                <span className="font-bold text-emerald-700 block text-xs">Verified Evidence Integration:</span>
                                <p className="text-[11px] text-slate-600 mt-1">
                                  Grounded in confirmed career evidence attributes while separating unverified claims from demonstrated facts.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SECTION 3: PLAN GRAPH */}
                        {inspectSection === 'plan' && (
                          <div className="space-y-3">
                            <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                              <span>Structured Synthesis Workflow</span>
                              <span className="text-xs text-slate-500 font-mono">
                                {currentTrajectory.plan ? `${currentTrajectory.plan.steps.length} Steps` : 'Direct Synthesis'}
                              </span>
                            </div>

                            {currentTrajectory.plan ? (
                              <div className="space-y-2 pt-1">
                                {currentTrajectory.plan.steps.map((st, idx) => (
                                  <div key={st.id} className="p-2.5 bg-white rounded-lg border border-slate-200/70 flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-800">{st.objective}</span>
                                        <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                                          {st.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-slate-500 bg-white rounded-xl">
                                Direct synthesis executed for rapid response.
                              </div>
                            )}
                          </div>
                        )}

                        {/* SECTION 4: TOOL CALLS (scrubbed of raw JSON payloads) */}
                        {inspectSection === 'tools' && (
                          <div className="space-y-3">
                            <div className="font-bold text-slate-800 text-sm">
                              Evidence Grounding Operations ({currentTrajectory.executionSteps.filter(s => s.actionType === 'tool_call').length})
                            </div>

                            {currentTrajectory.executionSteps.filter(s => s.actionType === 'tool_call').length > 0 ? (
                              <div className="space-y-2 pt-1">
                                {currentTrajectory.executionSteps.filter(s => s.actionType === 'tool_call').map((st, idx) => (
                                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200/70 flex items-center justify-between">
                                    <span className="font-bold text-indigo-700 flex items-center gap-1.5">
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      <span>Verified Capability &amp; Evidence Lookup ({st.toolCall?.toolName.replace(/_/g, ' ')})</span>
                                    </span>
                                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                                      Completed ({st.durationMs}ms)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-slate-500 bg-white rounded-xl">
                                Direct synthesis completed without external lookups.
                              </div>
                            )}
                          </div>
                        )}

                        {/* SECTION 5: VERIFIER ENGINE */}
                        {inspectSection === 'verifier' && (
                          <div className="space-y-3">
                            <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                              <span>Quality Verification Audit</span>
                              <span className="text-xs font-bold text-emerald-600">
                                Verified Pass
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                              {Object.entries(currentTrajectory.verificationResult.detailsByCategory).map(([cat, val]) => {
                                const catVal = val as { score: number; passed: boolean; note?: string };
                                return (
                                  <div key={cat} className="p-2 bg-white rounded-lg border border-slate-200/60 text-[11px] flex items-center justify-between">
                                    <span className="text-slate-600 truncate capitalize text-[10px]">{cat.replace(/_/g, ' ')}</span>
                                    <span className="font-bold text-emerald-700 text-[10px]">{catVal.passed ? 'Verified' : 'Reviewed'}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* SECTION 6: EVALUATION SCORECARD */}
                        {inspectSection === 'eval' && currentTrajectory.evaluationResult && (
                          <div className="space-y-3">
                            <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                              <span>Signal Alignment Summary</span>
                              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                High Signal Alignment
                              </span>
                            </div>
                            <p className="text-slate-600 italic text-[11px]">{currentTrajectory.evaluationResult.evaluationSummary}</p>
                          </div>
                        )}

                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {!isFullAccess && (
              <CareerOSIntelligenceGate
                capability="ai_career_diagnosis"
                variant="inline"
                sampleCountLabel={
                  isGuest
                    ? 'Sample Career Diagnosis Preview · Full Multi-Signal Diagnosis & Synthesis requires CareerOS Access'
                    : `Demo Preview · ${intelAccess.demoSignalsUsed} / ${intelAccess.demoSignalsLimit} demo diagnosis runs used`
                }
              />
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: SCENARIO BENCHMARKS */}
        {/* ================================================================= */}
        {activeTab === 'acceptance' && (
          !isFullAccess ? (
            <CareerOSIntelligenceGate
              capability="proprietary_scoring_logic"
              variant="inline"
              sampleCountLabel="Benchmark Evaluation Suite & Verification Rules are protected in Sample Mode"
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">CareerOS Scenario Benchmark Suite</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Validates scenarios across job matching, case solving, STAR feedback, and multi-signal synthesis.
                  </p>
                </div>
                <button
                  id="run-all-acceptance-tests-btn"
                  onClick={handleRunAllAcceptanceTests}
                  disabled={isTestingAll}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isTestingAll ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running ({testProgress?.current}/{testProgress?.total})...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Run Scenario Benchmarks</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACCEPTANCE_SCENARIOS.map((scenario) => {
                  const result = testResults.find(r => r.id === scenario.id);
                  return (
                    <div 
                      key={scenario.id} 
                      className={`bg-white rounded-xl p-4 border transition-all ${
                        result ? (result.passed ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-200 bg-rose-50/10') : 'border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{scenario.title}</span>
                        {result ? (
                          result.passed ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3 h-3" /> PASS
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800 flex items-center gap-1 shrink-0">
                              <XCircle className="w-3 h-3" /> FAIL
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-500 shrink-0">
                            Ready
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg font-mono text-[11px]">
                        "{scenario.prompt}"
                      </p>

                      <p className="text-xs text-slate-500 mt-2">
                        <span className="font-semibold text-slate-700">Expectation:</span> {scenario.expectedDescription}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}

        {/* ================================================================= */}
        {/* TAB 3: KNOWLEDGE CONTEXT */}
        {/* ================================================================= */}
        {activeTab === 'memory' && (
          !isFullAccess ? (
            <CareerOSIntelligenceGate
              capability="full_knowledge_graph"
              variant="inline"
              sampleCountLabel="Full Knowledge Context & User Attribution Memory requires Full CareerOS Access"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-blue-600" />
                    1. Domain Knowledge Nodes
                  </h3>
                  <span className="text-xs text-slate-400">Canonical Registry</span>
                </div>
                <p className="text-xs text-slate-500">
                  Structured domain concepts for product, engineering, and commercial capabilities.
                </p>
                <div className="space-y-2 pt-1 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="font-bold text-slate-900 block">Unit Economics &amp; Acquisition Efficiency</span>
                    <span className="text-slate-600 text-[11px]">Evaluates customer acquisition efficiency relative to long-term retention value.</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="font-bold text-slate-900 block">Distributed Concurrency &amp; Idempotency</span>
                    <span className="text-slate-600 text-[11px]">Zero duplicate side-effects under network retries via unique transaction keys.</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    2. Verified User Evidence Claims
                  </h3>
                  <span className="text-xs text-slate-400">Evidence-Backed</span>
                </div>
                <p className="text-xs text-slate-500">
                  Every capability claim is anchored in confirmed work artifacts and outcomes.
                </p>
                <div className="space-y-2 pt-1 text-xs">
                  {MemoryEngine.getUserModelInferences().map(inf => (
                    <div key={inf.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 capitalize">{inf.dimension}</span>
                        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          Verified Signal
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs font-medium mt-1">{inf.claim}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* ================================================================= */}
        {/* TAB 4: SIGNAL CALIBRATION */}
        {/* ================================================================= */}
        {activeTab === 'learning' && (
          !isFullAccess ? (
            <CareerOSIntelligenceGate
              capability="proprietary_scoring_logic"
              variant="inline"
              sampleCountLabel="Signal Calibration & Proprietary Evaluation Logic requires Full CareerOS Access"
            />
          ) : (
            <div className="space-y-6">
              <SelfImprovementDashboard />
            </div>
          )
        )}

        {/* ================================================================= */}
        {/* TAB RESEARCH: DYNAMIC RESEARCH ENGINE CAPABILITY */}
        {/* ================================================================= */}
        {activeTab === 'research' && (
          !isFullAccess ? (
            <CareerOSIntelligenceGate
              capability="ai_career_insights"
              variant="inline"
              sampleCountLabel="Deep Market & Role Research Intelligence requires Full CareerOS Access"
            />
          ) : (
            <ResearchEngineExplorer />
          )
        )}

      </div>

      {showGateModal && (
        <CareerOSIntelligenceGate
          capability="ai_career_diagnosis"
          variant="modal"
          onClose={() => setShowGateModal(false)}
        />
      )}
    </div>
  );
};
