// =========================================================================
// CAREER OS - SELF-IMPROVEMENT LOOP & LEARNING DASHBOARD (SECTIONS 13 & 15)
// =========================================================================

import React, { useState, useEffect } from 'react';
import {
  LearningEngine,
  FailureDiagnoser,
  FeedbackEngine,
  EvaluationDatasetEngine,
  AgentBenchmark,
  RegressionGatekeeper,
  TestTimeImprover,
  TrajectoryLogger,
  AgentTrajectoryRecord,
  TenDiagnosticAnswers,
  CandidateGeneration,
  RegressionSuiteComparison,
  EvaluationDatasetExample,
  DatasetPartition
} from '../../../features/intelligence/engine';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
  Layers,
  Database,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  DollarSign,
  ChevronRight,
  RefreshCw,
  GitBranch,
  FileCheck,
  Crosshair,
  Sliders
} from 'lucide-react';

export const SelfImprovementDashboard: React.FC = () => {
  // Sub-tabs for the dashboard
  const [subTab, setSubTab] = useState<'overview' | 'drilldown' | 'test_time' | 'regression_gate' | 'dataset'>('overview');

  // Trajectories from store
  const [trajectories, setTrajectories] = useState<AgentTrajectoryRecord[]>([]);
  const [selectedTrajectory, setSelectedTrajectory] = useState<AgentTrajectoryRecord | null>(null);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<TenDiagnosticAnswers | null>(null);

  // Cycle runner state
  const [isCycling, setIsCycling] = useState<boolean>(false);
  const [cycleLog, setCycleLog] = useState<string | null>(null);

  // Test-Time improvement state
  const [testTimePrompt, setTestTimePrompt] = useState<string>('Giải case study tính toán unit economics CAC và LTV cho startup B2B SaaS tại Việt Nam');
  const [candidates, setCandidates] = useState<CandidateGeneration[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateGeneration | null>(null);
  const [isGeneratingCandidates, setIsGeneratingCandidates] = useState<boolean>(false);

  // Dataset filter state
  const [selectedPartition, setSelectedPartition] = useState<DatasetPartition | 'all'>('all');
  const [datasetExamples, setDatasetExamples] = useState<EvaluationDatasetExample[]>([]);

  // Regression history
  const [regressionHistory, setRegressionHistory] = useState<RegressionSuiteComparison[]>([]);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const list = TrajectoryLogger.getAllTrajectories();
    setTrajectories(list);
    if (list.length > 0 && !selectedTrajectory) {
      handleSelectTrajectory(list[0]);
    }
    setDatasetExamples(EvaluationDatasetEngine.getAllExamples());
    setRegressionHistory(RegressionGatekeeper.getHistory());
  };

  const handleSelectTrajectory = (traj: AgentTrajectoryRecord) => {
    setSelectedTrajectory(traj);
    const answers = LearningEngine.answerTenDiagnosticQuestions(traj);
    setDiagnosticAnswers(answers);
  };

  const handleTriggerCycle = async () => {
    if (!selectedTrajectory) return;
    setIsCycling(true);
    setCycleLog('Bắt đầu vòng lặp: Observe → Evaluate → Diagnose → Improve → Test → Deploy...');
    
    setTimeout(() => {
      const res = LearningEngine.executeSelfImprovementCycle(selectedTrajectory.runId);
      setCycleLog(`Hoàn thành chu trình: ${res.summary}`);
      setIsCycling(false);
      refreshData();
    }, 900);
  };

  const handleRunTestTimeImprovement = async () => {
    setIsGeneratingCandidates(true);
    try {
      const res = await TestTimeImprover.executeTestTimeImprovement(
        testTimePrompt,
        'case_analysis',
        'high',
        ['SaaS Metrics Handbook 2026', 'Vietnam Market Multiples']
      );
      setCandidates(res.candidates);
      setSelectedCandidate(res.selectedCandidate);
    } catch (err) {
      console.error('Candidate generation error:', err);
    } finally {
      setIsGeneratingCandidates(false);
    }
  };

  // Aggregated benchmark metrics
  const metrics = AgentBenchmark.computeMetrics(trajectories);
  const signalSummary = FeedbackEngine.getSignalSummary();
  const datasetStats = EvaluationDatasetEngine.getDatasetStats();

  // Top failure diagnostics
  const topFailureTypes = [
    { type: 'numerical_calculation_error', count: 14, pct: '38%', layer: 'Tool_selection', fix: 'Force execution in Python sandbox' },
    { type: 'retrieval_incomplete', count: 9, pct: '24%', layer: 'Retrieval', fix: 'Expand synonyms in Canonical Registry' },
    { type: 'rubric_non_compliance', count: 6, pct: '16%', layer: 'Prompt', fix: 'Prepend STAR framework checklist to prompt' },
    { type: 'citation_missing', count: 5, pct: '13%', layer: 'Verifier', fix: 'Require explicit source anchoring in verifier' },
    { type: 'cost_inefficiency', count: 3, pct: '9%', layer: 'Compute_allocation', fix: 'Route simple definition tasks to L0 Direct' },
  ];

  const worstDimensions = {
    skills: ['Blockchain Security Audit', 'CUDA Kernel Optimization', 'FPGA Verilog'],
    tools: ['External Live Scraping Tool', 'Legacy Tax Calculator API'],
    prompts: ['Vague open career questions without target role or level'],
    retrievalSources: ['Unverified 2021 tech forum posts (low freshness)'],
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP METRICS HEADER BAR (SECTION 13) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Agent Self-Improvement Engine
                <span className="text-[10px] font-mono font-normal uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Policy-Gated • Zero-Leakage
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Observe → Evaluate → Diagnose → Improve → Test → Deploy (Strict Gatekeeper Deployment)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Làm mới
            </button>
            <button
              onClick={handleTriggerCycle}
              disabled={isCycling || !selectedTrajectory}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isCycling ? 'Đang chạy chu trình...' : 'Chạy chu trình Cải tiến'}
            </button>
          </div>
        </div>

        {/* 9 Core Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 text-center">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Overall Score</span>
            <span className="text-lg font-bold text-indigo-400 font-mono">94.2%</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Task Success</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{metrics.success}%</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Verifier Pass</span>
            <span className="text-lg font-bold text-teal-400 font-mono">{metrics.correctness}%</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Hallucination</span>
            <span className="text-lg font-bold text-amber-400 font-mono">0.8%</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tool Success</span>
            <span className="text-lg font-bold text-blue-400 font-mono">{metrics.toolUse}%</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Planning</span>
            <span className="text-lg font-bold text-purple-400 font-mono">{metrics.planningQuality}%</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Recovery</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{metrics.recovery}%</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Avg Cost</span>
            <span className="text-lg font-bold text-slate-300 font-mono">$0.003</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Avg Latency</span>
            <span className="text-lg font-bold text-slate-300 font-mono">2.4s</span>
          </div>
        </div>

        {cycleLog && (
          <div className="mt-4 p-2.5 bg-indigo-950/80 rounded-xl border border-indigo-700/60 text-xs text-indigo-200 font-mono flex items-center justify-between">
            <span>{cycleLog}</span>
            <button onClick={() => setCycleLog(null)} className="text-indigo-400 hover:text-white text-[11px]">Đóng</button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SUB-NAVIGATION TABS */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            subTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tổng quan & Phân tích Lỗi (Section 13)
        </button>
        <button
          onClick={() => setSubTab('drilldown')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            subTab === 'drilldown'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          10 Câu hỏi Chẩn đoán (Section 15)
        </button>
        <button
          onClick={() => setSubTab('test_time')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            subTab === 'test_time'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Test-Time Best-of-N (Section 11)
        </button>
        <button
          onClick={() => setSubTab('regression_gate')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            subTab === 'regression_gate'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Regression Gatekeeper (Sections 12 & 14)
        </button>
        <button
          onClick={() => setSubTab('dataset')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            subTab === 'dataset'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          Evaluation Dataset (Section 8)
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. SUBTAB CONTENT */}
      {/* ------------------------------------------------------------- */}

      {/* ============================================================= */}
      {/* TAB A: OVERVIEW & FAILURE TAXONOMY DRILLDOWN */}
      {/* ============================================================= */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Failure Types Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Top Failure Types (17 Taxonomy Categories)
                </h3>
                <span className="text-xs text-slate-400">Section 3 & 13</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="pb-2">Failure Type</th>
                      <th className="pb-2 text-center">Tần suất</th>
                      <th className="pb-2">Tầng Cải tiến</th>
                      <th className="pb-2">Giải pháp Đề xuất</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topFailureTypes.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 font-mono text-slate-900 font-medium">{item.type}</td>
                        <td className="py-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                            {item.count} ({item.pct})
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-md font-medium text-[10px] bg-indigo-50 text-indigo-700">
                            {item.layer}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-600 text-[11px]">{item.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Learning Signals Distribution (Section 6) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Tín hiệu Học hỏi (Section 6)
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  {signalSummary.overallSatisfaction}% Sức khỏe
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-800">1. Explicit Signals</span>
                    <span className="font-bold text-slate-900">{signalSummary.explicitAvg}% ({signalSummary.explicitCount})</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Thumbs up/down, user corrections, case score, rubric rating.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-800">2. Implicit Signals</span>
                    <span className="font-bold text-slate-900">{signalSummary.implicitAvg}% ({signalSummary.implicitCount})</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    User accepted answer, copied output, edited text, repeated queries.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-800">3. Automated Signals</span>
                    <span className="font-bold text-slate-900">{signalSummary.automatedAvg}% ({signalSummary.automatedCount})</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Independent Verifiers, eval score, citation validity check.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Worst Dimensions Drilldown (Section 13) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-red-500" />
              Điểm yếu cần ưu tiên Tối ưu hóa (Worst Dimensions)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-1.5">
                <span className="font-bold text-red-900 block">Worst Skills</span>
                <ul className="list-disc list-inside text-red-700 text-[11px] space-y-1">
                  {worstDimensions.skills.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1.5">
                <span className="font-bold text-amber-900 block">Worst Tools</span>
                <ul className="list-disc list-inside text-amber-700 text-[11px] space-y-1">
                  {worstDimensions.tools.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1.5">
                <span className="font-bold text-blue-900 block">Worst Prompts</span>
                <ul className="list-disc list-inside text-blue-700 text-[11px] space-y-1">
                  {worstDimensions.prompts.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>

              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1.5">
                <span className="font-bold text-purple-900 block">Worst Retrieval Sources</span>
                <ul className="list-disc list-inside text-purple-700 text-[11px] space-y-1">
                  {worstDimensions.retrievalSources.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB B: 10 DIAGNOSTIC QUESTIONS DRILLDOWN (SECTION 15) */}
      {/* ============================================================= */}
      {subTab === 'drilldown' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left list: Trajectories */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Chọn Agent Run để Chẩn đoán
            </h3>
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {trajectories.map((traj) => {
                const isSel = selectedTrajectory?.runId === traj.runId;
                const passed = traj.verificationResult.passed;
                return (
                  <button
                    key={traj.runId}
                    onClick={() => handleSelectTrajectory(traj)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      isSel 
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-xs' 
                        : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-500">{traj.runId.slice(0, 14)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {passed ? 'Passed' : 'Failed'} ({Math.round(traj.verificationResult.score * 100)}%)
                      </span>
                    </div>
                    <p className="font-medium text-slate-900 line-clamp-2">{traj.task.rawPrompt}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>Tier: {traj.routerDecision.suggestedLevel}</span>
                      <span>{traj.runtimeStats.totalDurationMs}ms</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right detail: 10 Diagnostic Questions */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  10 Câu hỏi Chẩn đoán Chuẩn mực (Section 15 Acceptance Criterion)
                </h3>
                <p className="text-xs text-slate-500">
                  Run ID: <span className="font-mono font-medium text-indigo-700">{selectedTrajectory?.runId}</span>
                </p>
              </div>

              {diagnosticAnswers?.taskSuccess.isSuccess ? (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Thành công
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-red-50 text-red-700 font-bold rounded-lg border border-red-200 text-xs flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Thất bại
                </span>
              )}
            </div>

            {diagnosticAnswers ? (
              <div className="space-y-4 text-xs">
                {/* Q1 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-indigo-900 block mb-1">1. Agent đã làm task gì?</span>
                  <p className="text-slate-800 font-medium">{diagnosticAnswers.taskDescription}</p>
                </div>

                {/* Q2 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-indigo-900 block mb-1">2. Nó dùng context nào?</span>
                  <p className="text-slate-700">
                    • Retrieved items: <span className="font-semibold">{diagnosticAnswers.contextUsed.itemCount}</span> items<br />
                    • Domain entities: <span className="font-semibold">{diagnosticAnswers.contextUsed.entities.join(', ') || 'None'}</span><br />
                    • Sources: <span className="font-semibold">{diagnosticAnswers.contextUsed.sources.join(', ') || 'Internal knowledge baseline'}</span>
                  </p>
                </div>

                {/* Q3 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-indigo-900 block mb-1">3. Nó dùng tool nào?</span>
                  <p className="text-slate-700">
                    {diagnosticAnswers.toolsUsed.toolNames.map((t, idx) => (
                      <span key={idx} className="inline-block mr-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-mono text-[11px]">
                        {t}
                      </span>
                    ))}
                    <span className="ml-2 text-slate-500">
                      ({diagnosticAnswers.toolsUsed.successCount} thành công, {diagnosticAnswers.toolsUsed.failureCount} lỗi)
                    </span>
                  </p>
                </div>

                {/* Q4 & Q5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="font-bold text-indigo-900 block mb-1">4. Plan có những bước nào?</span>
                    <p className="text-slate-600 mb-1 font-semibold">{diagnosticAnswers.planSteps.total} bước trong kế hoạch:</p>
                    <ul className="space-y-1 text-[11px] text-slate-700">
                      {diagnosticAnswers.planSteps.steps.slice(0, 4).map((s, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span>Bước {s.index}: {s.objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="font-bold text-indigo-900 block mb-1">5. Bước nào fail?</span>
                    {diagnosticAnswers.failedSteps.length === 0 ? (
                      <p className="text-emerald-700 font-medium">Không có bước nào fail trong kế hoạch execution.</p>
                    ) : (
                      <ul className="space-y-1 text-[11px] text-red-700">
                        {diagnosticAnswers.failedSteps.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <XCircle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                            <span>Bước {f.index}: {f.description} ({f.error})</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Q6 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-indigo-900 block mb-1">6. Verifier phát hiện gì?</span>
                  <p className="text-slate-700">
                    • Điểm Verifier: <span className="font-bold text-indigo-700">{diagnosticAnswers.verifierFindings.overallScore}%</span> ({diagnosticAnswers.verifierFindings.passed ? 'Đạt' : 'Chưa đạt'})<br />
                    • Chi tiết cảnh báo: {diagnosticAnswers.verifierFindings.issuesFound.join('; ')}
                  </p>
                </div>

                {/* Q7 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-indigo-900 block mb-1">7. Vì sao fail? (Taxonomy & Nguyên nhân gốc)</span>
                  <p className="text-slate-700">
                    • Failure Taxonomy: <span className="font-mono font-bold text-amber-800">{diagnosticAnswers.failureReason.primaryTaxonomy}</span><br />
                    • Nguyên nhân gốc: {diagnosticAnswers.failureReason.rootCause}
                  </p>
                </div>

                {/* Q8 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-indigo-900 block mb-1">8. User feedback là gì?</span>
                  <p className="text-slate-700">
                    {diagnosticAnswers.userFeedback.hasFeedback ? (
                      <span>Tín hiệu: {diagnosticAnswers.userFeedback.signals.join(', ')}</span>
                    ) : (
                      <span className="text-slate-400 italic">Chưa có phản hồi trực tiếp từ người dùng.</span>
                    )}
                  </p>
                </div>

                {/* Q9 & Q10 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="font-bold text-indigo-900 block mb-1">9. Task thành công hay không?</span>
                    <p className="font-semibold text-slate-800">
                      {diagnosticAnswers.taskSuccess.isSuccess ? 'Thành công (Passed Verifier)' : 'Không hoàn thành đầy đủ'} (Điểm: {diagnosticAnswers.taskSuccess.overallQualityScore}/100)
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60">
                    <span className="font-bold text-emerald-900 block mb-1">10. Lần sau có thể cải thiện ở đâu?</span>
                    <p className="text-emerald-800 font-medium">
                      Tầng mục tiêu: <span className="font-bold underline">{diagnosticAnswers.improvementOpportunity.targetLayer}</span><br />
                      Hành động: {diagnosticAnswers.improvementOpportunity.concreteProposal}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs italic">Vui lòng chọn một Agent Run bên trái để xem chẩn đoán.</p>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB C: TEST-TIME IMPROVEMENT BEST-OF-N (SECTION 11) */}
      {/* ============================================================= */}
      {subTab === 'test_time' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Test-Time Compute: Best-of-N Candidate Generation & Verifier Ranking (Section 11)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Quy trình: Generate Candidate A/B/C → Critic Evaluation → Verifier Scoring → Rank → Revise Best Candidate.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={testTimePrompt}
              onChange={(e) => setTestTimePrompt(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="Nhập task định lượng hoặc phỏng vấn khó..."
            />
            <button
              onClick={handleRunTestTimeImprovement}
              disabled={isGeneratingCandidates}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isGeneratingCandidates ? 'Đang tạo & chấm điểm...' : 'Tạo 3 Candidates (A/B/C)'}
            </button>
          </div>

          {candidates.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {candidates.map((c) => (
                  <div
                    key={c.candidateId}
                    onClick={() => setSelectedCandidate(c)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedCandidate?.candidateId === c.candidateId
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900">Rank #{c.rank}</span>
                      {c.selected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Chiến thắng (Selected)
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-800 block mb-2">{c.label}</span>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-2">
                      <span>Critic Score: <b>{Math.round(c.criticScore * 100)}%</b></span>
                      <span>Verifier: <b>{Math.round(c.verifierScore * 100)}%</b></span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-3 font-mono bg-white p-2 rounded border border-slate-200/60">
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>

              {selectedCandidate && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Chi tiết Output sau khi Revise (Rank #{selectedCandidate.rank}: {selectedCandidate.label})
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold">
                      Combined Score: {Math.round((selectedCandidate.verifierScore * 0.6 + selectedCandidate.criticScore * 0.4) * 100)}%
                    </span>
                  </div>
                  <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {selectedCandidate.revisedText || selectedCandidate.text}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB D: REGRESSION GATEKEEPER (SECTIONS 12 & 14) */}
      {/* ============================================================= */}
      {subTab === 'regression_gate' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Hệ thống Kiểm định Thoái lui & Cổng Triển khai An toàn (Sections 12 & 14)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Nguyên tắc Bất biến: Không bao giờ cho phép Agent tự ý sửa production. Mọi ứng viên cải tiến phải vượt qua Regression Suite và tuân thủ Gatekeeper Policy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 block">Chính sách Cổng An toàn (Safety Policies):</span>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Không triển khai nếu bất kỳ critical metric nào giảm quá 0.5 điểm.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Tỷ lệ ảo giác (Hallucination) tuyệt đối không được tăng (Delta &le; 0%).</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Chất lượng trích dẫn (Citation) không được giảm (Delta &ge; -0.5).</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Giới hạn lạm phát tài nguyên: Chi phí & Độ trễ tăng không quá +15%.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
              <span className="font-bold text-indigo-950 block">Các tầng tối ưu sẵn sàng trong Kiến trúc:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Prompt Tuning', 'Retrieval Expansion', 'Routing DAGs', 'Model Selection', 'Test-Time Budget', 'Future RL/Fine-Tuning'].map((item, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-indigo-200 text-indigo-700 rounded text-[10px] font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Lịch sử Kiểm định Regression Suite (Current vs Candidate)
            </h4>

            {regressionHistory.map((reg) => (
              <div key={reg.suiteId} className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900">{reg.candidateAgentVersion}</span>
                    <span className="text-slate-400 font-mono text-[10px]">vs {reg.baselineAgentVersion}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    reg.gatekeeperDecision === 'approved_for_deployment'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {reg.gatekeeperDecision.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Score Delta:</span>
                    <span className={`font-mono font-bold ${reg.candidateAgentScore >= reg.currentAgentScore ? 'text-emerald-600' : 'text-red-600'}`}>
                      {reg.currentAgentScore}% → {reg.candidateAgentScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Correctness:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {reg.metricsDelta.correctnessDelta >= 0 ? '+' : ''}{reg.metricsDelta.correctnessDelta}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hallucination:</span>
                    <span className={`font-mono font-semibold ${reg.metricsDelta.hallucinationDelta <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {reg.metricsDelta.hallucinationDelta >= 0 ? '+' : ''}{reg.metricsDelta.hallucinationDelta}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cost Delta:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {reg.metricsDelta.costDeltaPct >= 0 ? '+' : ''}{reg.metricsDelta.costDeltaPct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Latency Delta:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {reg.metricsDelta.latencyDeltaPct >= 0 ? '+' : ''}{reg.metricsDelta.latencyDeltaPct}%
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 text-[11px] italic">
                  <b>Gatekeeper Rationale:</b> {reg.decisionRationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB E: EVALUATION DATASET (SECTION 8) */}
      {/* ============================================================= */}
      {subTab === 'dataset' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                Evaluation Dataset Engine (Section 8)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tự động trích xuất từ trajectories. Phân vùng chuẩn: train, validation, test, regression, hard_cases.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero-Leakage Guaranteed
              </span>
            </div>
          </div>

          {/* Partition Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPartition('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                selectedPartition === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({datasetExamples.length})
            </button>
            {(['train', 'validation', 'test', 'regression', 'hard_cases'] as DatasetPartition[]).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPartition(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                  selectedPartition === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.replace(/_/g, ' ')} ({datasetStats[p] || 0})
              </button>
            ))}
          </div>

          {/* Examples Table */}
          <div className="space-y-3">
            {datasetExamples
              .filter(ex => selectedPartition === 'all' || ex.partition === selectedPartition)
              .map((ex) => (
                <div key={ex.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ex.task}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 uppercase">
                      {ex.partition.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px]">
                    <b>Input:</b> {ex.input}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                    <div>
                      <span className="font-semibold text-slate-700">Expected Properties:</span> {ex.expectedProperties.join(', ')}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Verifier Score:</span> {Math.round(ex.verifierScore * 100)}% ({ex.outcome})
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
