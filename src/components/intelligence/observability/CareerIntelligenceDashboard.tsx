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
  const [activeTab, setActiveTab] = useState<'executor' | 'research' | 'trajectory' | 'acceptance' | 'memory' | 'learning'>('executor');
  
  // Executor state
  const [prompt, setPrompt] = useState<string>('Phân tích skill gap của mình cho vị trí Stripe Backend Engineer, mình còn thiếu kỹ năng gì và đề xuất roadmap?');
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(3);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [response, setResponse] = useState<CareerIntelligenceResponse | null>(null);
  const [currentTrajectory, setCurrentTrajectory] = useState<AgentTrajectoryRecord | null>(null);
  
  // Selected inspection step inside trajectory
  const [inspectSection, setInspectSection] = useState<'router' | 'context' | 'plan' | 'tools' | 'verifier' | 'eval'>('router');

  // Acceptance test runner state
  const [isTestingAll, setIsTestingAll] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<Array<{ id: number; title: string; passed: boolean; note: string }>>([]);
  const [testProgress, setTestProgress] = useState<{ current: number; total: number } | null>(null);

  // Initial load
  useEffect(() => {
    MemoryEngine.initialize();
    TrajectoryLogger.initialize();
  }, []);

  const handleRunTask = async (customPrompt?: string) => {
    const textToRun = customPrompt || prompt;
    if (!textToRun.trim() || isRunning) return;

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
    if (isTestingAll) return;
    setIsTestingAll(true);
    setTestResults([]);
    setTestProgress({ current: 0, total: ACCEPTANCE_SCENARIOS.length });

    try {
      const results = await runAllAcceptanceTests((current, total, item) => {
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
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Career Intelligence Engine</h1>
                <span className="px-2 py-0.5 text-[11px] font-black rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                  Native Orchestrator
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  Reliability &gt; Observability
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Detect → Classify → Decide → Activate capabilities → Execute → Verify → Evaluate → Learn
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              id="tab-btn-executor"
              onClick={() => setActiveTab('executor')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'executor' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Live Executor & Inspector</span>
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
              <span>15 Acceptance Tests</span>
              {testResults.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-100 text-emerald-800">
                  {testResults.filter(r => r.passed).length}/{testResults.length}
                </span>
              )}
            </button>
            <button
              id="tab-btn-memory"
              onClick={() => setActiveTab('memory')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'memory' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>4 Memory Classes</span>
            </button>
            <button
              id="tab-btn-learning"
              onClick={() => setActiveTab('learning')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'learning' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Self-Improvement Loop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pt-6">

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
                  User Prompt / Career Intelligence Task
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Quick Presets:</span>
                  <select
                    value={selectedPresetId || ''}
                    onChange={(e) => handleSelectPreset(Number(e.target.value))}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    {ACCEPTANCE_SCENARIOS.map(s => (
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
                  placeholder="Nhập yêu cầu nghề nghiệp (ví dụ: giải case CAC/LTV, so khớp CV với job, tìm skill gap, deep research...)"
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
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Execute Engine</span>
                    </>
                  )}
                </button>
              </div>

              {/* Execution Summary Bar */}
              {response && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">Task Category</span>
                    <span className="font-bold text-slate-900 capitalize">{response.taskType.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">Level Activated</span>
                    <span className="font-bold text-indigo-700">{response.levelActivated} Tier</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">Verification Pass</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {Math.round(response.confidence * 100)}%
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">Tool Calls / Revisions</span>
                    <span className="font-bold text-slate-800">{response.stats.toolCallsMade} calls • {response.stats.revisionsMade} revs</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">Tokens & Latency</span>
                    <span className="font-bold text-slate-800">{response.stats.tokensUsed} tok • {response.stats.durationMs}ms</span>
                  </div>
                </div>
              )}
            </div>

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
                    <span className="text-[11px] text-slate-400 font-mono">ID: {currentTrajectory.runId.slice(0, 10)}</span>
                  </div>

                  <div className="prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed max-h-[550px] overflow-y-auto pr-1">
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                      {response.result}
                    </div>
                  </div>

                  {response.sources.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Cited Evidence & Catalog Sources ({response.sources.length})
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
                      Trajectory Inspection (Observe → Act → Verify → Learn)
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600">
                      {currentTrajectory.runtimeStats.finalStatus.toUpperCase()}
                    </span>
                  </div>

                  {/* Section Selector Buttons */}
                  <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setInspectSection('router')}
                      className={`px-3 py-1 rounded-lg cursor-pointer ${
                        inspectSection === 'router' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      1. Router & Decider
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
                      3. Plan Graph
                    </button>
                    <button
                      onClick={() => setInspectSection('tools')}
                      className={`px-3 py-1 rounded-lg cursor-pointer ${
                        inspectSection === 'tools' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      4. Tool Calls ({currentTrajectory.runtimeStats.toolCallsCount})
                    </button>
                    <button
                      onClick={() => setInspectSection('verifier')}
                      className={`px-3 py-1 rounded-lg cursor-pointer ${
                        inspectSection === 'verifier' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      5. Verifier (11 Cats)
                    </button>
                    <button
                      onClick={() => setInspectSection('eval')}
                      className={`px-3 py-1 rounded-lg cursor-pointer ${
                        inspectSection === 'eval' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      6. Trajectory Eval
                    </button>
                  </div>

                  {/* Inspection Panel Views */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs min-h-[360px]">
                    
                    {/* SECTION 1: ROUTER DECISION */}
                    {inspectSection === 'router' && (
                      <div className="space-y-3">
                        <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                          <span>Task Router & Intent Classification</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                            Confidence: {Math.round(currentTrajectory.routerDecision.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-slate-600 italic">"{currentTrajectory.routerDecision.rationale}"</p>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                          <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px]">Detected Task Category</span>
                            <span className="font-bold text-slate-800">{currentTrajectory.routerDecision.taskType}</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px]">Estimated Complexity</span>
                            <span className="font-bold text-slate-800 uppercase">{currentTrajectory.routerDecision.complexity}</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px]">Allocated Compute Budget</span>
                            <span className="font-bold text-slate-800 uppercase">{currentTrajectory.computeBudget.tier} (Max {currentTrajectory.computeBudget.maxTokens} tok)</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px]">Model Profile Selected</span>
                            <span className="font-bold text-slate-800">{currentTrajectory.modelSelection.profile} ({currentTrajectory.modelSelection.modelId})</span>
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
                          Filtered and ranked from Career OS catalog. Injected {currentTrajectory.contextSnapshot.retrievedItemsCount} catalog items and {currentTrajectory.contextSnapshot.userInferencesApplied} verified user model inferences.
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
                            <span className="font-bold text-emerald-700 block text-xs">Inferred User Model Integration:</span>
                            <p className="text-[11px] text-slate-600 mt-1">
                              Injected validated attributes (Confidence &ge; 70%). Strictly distinguishes inferred attributes from raw facts.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 3: PLAN GRAPH */}
                    {inspectSection === 'plan' && (
                      <div className="space-y-3">
                        <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                          <span>Structured Plan Graph (DAG)</span>
                          <span className="text-xs text-slate-500 font-mono">
                            {currentTrajectory.plan ? `${currentTrajectory.plan.steps.length} Steps` : 'No Planning (L0 Direct)'}
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
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    Required Tools: {st.requiredTools.length > 0 ? st.requiredTools.join(', ') : 'None (Cognitive)'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-slate-500 bg-white rounded-xl">
                            Planning skipped intentionally to prevent overhead on low-complexity task.
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 4: TOOL CALLS */}
                    {inspectSection === 'tools' && (
                      <div className="space-y-3">
                        <div className="font-bold text-slate-800 text-sm">
                          Tool Runtime Calls ({currentTrajectory.executionSteps.filter(s => s.actionType === 'tool_call').length})
                        </div>

                        {currentTrajectory.executionSteps.filter(s => s.actionType === 'tool_call').length > 0 ? (
                          <div className="space-y-2 pt-1">
                            {currentTrajectory.executionSteps.filter(s => s.actionType === 'tool_call').map((st, idx) => (
                              <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200/70 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-indigo-700 flex items-center gap-1">
                                    <Code className="w-3.5 h-3.5" />
                                    {st.toolCall?.toolName}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">{st.durationMs}ms</span>
                                </div>
                                <div className="p-2 bg-slate-900 text-emerald-400 rounded-md font-mono text-[10px] overflow-x-auto">
                                  {JSON.stringify(st.toolCall?.outputResult || {}, null, 2).slice(0, 300)}...
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-slate-500 bg-white rounded-xl">
                            0 tool calls made for this task (zero tool overhead).
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 5: VERIFIER ENGINE (11 CATEGORIES) */}
                    {inspectSection === 'verifier' && (
                      <div className="space-y-3">
                        <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                          <span>Verifier Engine Quality Audit (11 Categories)</span>
                          <span className="text-xs font-bold text-emerald-600">
                            Composite: {Math.round(currentTrajectory.verificationResult.score * 100)}%
                          </span>
                        </div>

                        {/* Category Score Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                          {Object.entries(currentTrajectory.verificationResult.detailsByCategory).map(([cat, val]) => {
                            const catVal = val as { score: number; passed: boolean; note?: string };
                            return (
                              <div key={cat} className="p-2 bg-white rounded-lg border border-slate-200/60 text-[11px]">
                                <span className="text-slate-500 block truncate capitalize text-[10px]">{cat.replace(/_/g, ' ')}</span>
                                <span className="font-bold text-emerald-700">{Math.round(catVal.score * 100)}%</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Revisions Log */}
                        {currentTrajectory.revisions.length > 0 && (
                          <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200/70 text-xs">
                            <span className="font-bold text-amber-900 block">Revision Remedy Loop Triggered:</span>
                            <p className="text-amber-800 text-[11px] mt-0.5">
                              {currentTrajectory.revisions[0].remedyApplied}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 6: EVALUATION SCORECARD */}
                    {inspectSection === 'eval' && currentTrajectory.evaluationResult && (
                      <div className="space-y-3">
                        <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                          <span>Trajectory & Answer Evaluation</span>
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Index: {currentTrajectory.evaluationResult.overallScore}/100
                          </span>
                        </div>
                        <p className="text-slate-600 italic text-[11px]">{currentTrajectory.evaluationResult.evaluationSummary}</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                          <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px]">Task Success</span>
                            <span className="font-bold text-slate-800">{currentTrajectory.evaluationResult.metrics.taskSuccess}%</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px]">Correctness</span>
                            <span className="font-bold text-slate-800">{currentTrajectory.evaluationResult.metrics.correctness}%</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px]">Groundedness</span>
                            <span className="font-bold text-slate-800">{currentTrajectory.evaluationResult.metrics.groundedness}%</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px]">Tool Accuracy</span>
                            <span className="font-bold text-slate-800">{currentTrajectory.evaluationResult.metrics.toolUseAccuracy}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: 15 ACCEPTANCE TEST SCENARIOS */}
        {/* ================================================================= */}
        {activeTab === 'acceptance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Career OS Acceptance Test Suite (15 Scenarios)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Validates all scenarios from simple questions, job matching, case solving, STAR feedback, to mixed-language parsing and revision loops.
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
                    <span>Run All 15 Acceptance Tests</span>
                  </>
                )}
              </button>
            </div>

            {/* Test Cards Grid */}
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

                    {result && (
                      <div className="mt-3 pt-2 border-t border-slate-100 text-xs">
                        <span className="font-bold text-slate-700">Validator Output:</span>
                        <p className={`text-[11px] mt-0.5 ${result.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {result.note}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: 4 MEMORY CLASSES */}
        {/* ================================================================= */}
        {activeTab === 'memory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Semantic Memory */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-600" />
                  1. Semantic Memory (Concepts & Facts)
                </h3>
                <span className="text-xs text-slate-400">Canonical Registry</span>
              </div>
              <p className="text-xs text-slate-500">
                Language-independent knowledge nodes for domain metrics (CAC, LTV, STAR, Concurrency, Microservices).
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-slate-900 block">Customer Acquisition Cost (CAC)</span>
                  <span className="text-slate-600 text-[11px]">Formula: Total Sales & Marketing Spend / Number of New Customers Acquired.</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-slate-900 block">Distributed Concurrency & Idempotency</span>
                  <span className="text-slate-600 text-[11px]">Zero duplicate side-effects under network retries via unique transaction idempotency keys.</span>
                </div>
              </div>
            </div>

            {/* 2. Episodic Memory */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-emerald-600" />
                  2. Episodic Memory (Previous Runs)
                </h3>
                <span className="text-xs text-slate-400">Task Trajectories</span>
              </div>
              <p className="text-xs text-slate-500">
                Remembers previous successful solutions to avoid redundant compute on repeated requests.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Job Matching: Stripe Senior Backend</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Score 94%</span>
                  </div>
                  <span className="text-slate-500 text-[11px] block mt-1">Reused in matching queries to accelerate context retrieval.</span>
                </div>
              </div>
            </div>

            {/* 3. Procedural Memory */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  3. Procedural Memory (Proven Workflows)
                </h3>
                <span className="text-xs text-slate-400">Reusable DAGs</span>
              </div>
              <p className="text-xs text-slate-500">
                Pre-compiled step sequences that achieved &gt;90% evaluation pass rate in prior runs.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                {MemoryEngine.getAllProceduralPatterns().map(p => (
                  <div key={p.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="font-bold text-slate-900 block">{p.patternName}</span>
                    <span className="text-slate-500 text-[11px] block">{p.stepSequence.length} Steps • Average Score: {p.averageScore}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Inferred User Model */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  4. Inferred User Model (Strictly Validated)
                </h3>
                <span className="text-xs text-slate-400">Confidence &ge; 70%</span>
              </div>
              <p className="text-xs text-slate-500">
                Strict Rule: Profile facts &ne; Inferred User Model. Every inference requires claim + evidence + confidence + timestamp + source.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                {MemoryEngine.getUserModelInferences().map(inf => (
                  <div key={inf.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 capitalize">{inf.dimension}</span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Conf: {Math.round(inf.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs font-medium mt-1">{inf.claim}</p>
                    <span className="text-slate-400 text-[10px] block mt-1">Source: {inf.source} • Evidence: {inf.evidence.slice(0, 70)}...</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: SELF-IMPROVEMENT LOOP (SECTIONS 1-15) */}
        {/* ================================================================= */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            <SelfImprovementDashboard />

            {/* Existing L1-L9 Optimization Registry */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Learning Engine Optimization Registry (Levels 1 to 9)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Self-improvement via disciplined benchmarking, never by blindly retraining models or applying unverified tweaks.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {LearningEngine.getOptimizations().map(opt => (
                  <div key={opt.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-800 text-sm">{opt.level.replace(/_/g, ' ')}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        {opt.benchmarkStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-slate-700 font-medium">
                      <span className="text-slate-500">Hypothesis:</span> {opt.hypothesis}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 text-slate-600">
                      <div>
                        <span className="font-semibold block text-slate-700">Trigger Signal:</span>
                        <span>{opt.triggerSignal}</span>
                      </div>
                      <div>
                        <span className="font-semibold block text-slate-700">Benchmark Delta:</span>
                        <span className="text-emerald-700 font-mono font-bold">
                          Pass Rate: +{opt.benchmarkDelta?.passRateDelta}% • Latency: {opt.benchmarkDelta?.latencyDelta}ms
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB RESEARCH: DYNAMIC RESEARCH ENGINE CAPABILITY */}
        {/* ================================================================= */}
        {activeTab === 'research' && (
          <ResearchEngineExplorer />
        )}

      </div>
    </div>
  );
};
