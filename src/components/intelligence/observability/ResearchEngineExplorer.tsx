// =========================================================================
// CAREER OS - RESEARCH ENGINE CAPABILITY EXPLORER
// =========================================================================

import React, { useState, useEffect } from 'react';
import { 
  ResearchEngine,
  ResearchReportOutput,
  ResearchDepth,
  RankedSource,
  ConflictRecord,
  ResearchMemoryItem
} from '../../../features/intelligence/engine';
import { 
  Search, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Database, 
  TrendingUp, 
  Briefcase, 
  Cpu, 
  DollarSign, 
  Layers, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Scale
} from 'lucide-react';

export const ResearchEngineExplorer: React.FC = () => {
  const [query, setQuery] = useState<string>('Deep research toàn diện về văn hóa kỹ thuật, tech stack phân tán và mức lương Senior Backend tại Stripe 2025');
  const [userDepth, setUserDepth] = useState<ResearchDepth | 'auto'>('auto');
  const [careerImpact, setCareerImpact] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [uncertainty, setUncertainty] = useState<number>(0.4);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [report, setReport] = useState<ResearchReportOutput | null>(null);
  const [expandedSection, setExpandedSection] = useState<'all' | 'plan' | 'sources' | 'conflicts' | 'career_os' | 'memory'>('all');
  const [memories, setMemories] = useState<ResearchMemoryItem[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<ResearchMemoryItem | null>(null);

  // Live evaluation of research need
  const evaluation = ResearchEngine.evaluateNeed(query, {
    userRequestedDepth: userDepth,
    careerImpact,
    existingUncertainty: uncertainty
  });

  const loadMemories = () => {
    const list = ResearchEngine.getAllMemories();
    setMemories(list);
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const handleExecute = async (forceFresh = false) => {
    setIsExecuting(true);
    try {
      const res = await ResearchEngine.executeResearch({
        query,
        userRequestedDepth: userDepth,
        careerImpact,
        existingUncertainty: uncertainty,
        forceFresh
      });
      setReport(res);
      loadMemories();
    } catch (err) {
      console.error('Research execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const presetQueries = [
    {
      label: '1. Simple QA (No Research)',
      text: 'CV là gì? Định nghĩa cơ bản về resume.',
      depth: 'auto' as const,
      impact: 'low' as const
    },
    {
      label: '2. Standard Company Benchmark',
      text: 'Tìm hiểu công ty Stripe: văn hóa kỹ thuật, tech stack chính và salary benchmark cho Senior level.',
      depth: 'standard_research' as const,
      impact: 'high' as const
    },
    {
      label: '3. Deep Research (L4 Exhaustive)',
      text: 'Deep research toàn diện về kiến trúc thanh toán phân tán, đối thủ cạnh tranh và dải lương của Stripe.',
      depth: 'deep_research' as const,
      impact: 'critical' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-800">
                DYNAMIC CAPABILITY
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Research Engine Architecture & Evaluation
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              ResearchEngine vận hành như một capability tự động kích hoạt (không phải chatbot riêng), tuân thủ nghiêm ngặt quy trình 12 bước: 
              <span className="font-mono text-indigo-600 font-semibold ml-1">
                Goal → Plan → Query Gen → Search → Source Collection → Ranking → Extraction → Cross-check → Conflict Detection → Synthesis → Verification → Citation
              </span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExecute(false)}
              disabled={isExecuting}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>{isExecuting ? 'Đang nghiên cứu...' : 'Thực thi Nghiên cứu'}</span>
            </button>
            <button
              onClick={() => handleExecute(true)}
              disabled={isExecuting}
              title="Bỏ qua cache bộ nhớ, tìm kiếm nguồn mới"
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Force Fresh</span>
            </button>
          </div>
        </div>

        {/* Preset Queries */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Mẫu kiểm thử:</span>
          {presetQueries.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p.text);
                setUserDepth(p.depth);
                setCareerImpact(p.impact);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Control Panel: Adaptive Depth & Need Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input and Settings */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Mục tiêu Nghiên cứu (Research Goal)</span>
          </h3>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            placeholder="Nhập câu hỏi hoặc chủ đề cần nghiên cứu..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Requested Depth (Ghi đè)
              </label>
              <select
                value={userDepth}
                onChange={(e) => setUserDepth(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="auto">Auto (Tự động theo độ phức tạp)</option>
                <option value="quick_lookup">Quick Lookup (Tra cứu nhanh)</option>
                <option value="standard_research">Standard Research (Nghiên cứu chuẩn)</option>
                <option value="deep_research">Deep Research (Chuyên sâu L4)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Tác động Sự nghiệp (Career Impact)
              </label>
              <select
                value={careerImpact}
                onChange={(e) => setCareerImpact(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="low">Low (Tìm hiểu tổng quan)</option>
                <option value="medium">Medium (So khớp kỹ năng)</option>
                <option value="high">High (Phỏng vấn doanh nghiệp)</option>
                <option value="critical">Critical (Đàm phán offer/chuyển ngành)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Độ Bất định ngữ cảnh ({Math.round(uncertainty * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={uncertainty}
                onChange={(e) => setUncertainty(parseFloat(e.target.value))}
                className="w-full mt-2 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Real-time Evaluation Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Đánh giá Kích hoạt (Evaluation)
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                evaluation.needed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-700 text-slate-300'
              }`}>
                {evaluation.needed ? 'CẦN NGHIÊN CỨU' : 'KHÔNG CẦN NGHIÊN CỨU'}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-[11px] text-slate-400">Độ sâu xác định (Adaptive Depth):</div>
              <div className="text-xl font-black text-indigo-400 mt-0.5 uppercase tracking-wide">
                {evaluation.depth.replace('_', ' ')}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">Lý do điều phối: </span>
              {evaluation.reason}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Nguyên tắc: Simple QA ➔ No Deep Research</span>
            <span className="font-bold text-indigo-400">Pristine Craft</span>
          </div>
        </div>
      </div>

      {/* Main Research Output Inspector */}
      {report && (
        <div className="space-y-6">
          {/* Executive Summary & Metrics Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  {report.metrics.depth} Complete
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Báo cáo Nghiên cứu Career Intelligence Dossier
                </h3>
              </div>

              {/* Metrics pill */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400">Nguồn xếp hạng:</span> <strong className="text-slate-900">{report.metrics.sourcesRanked}</strong>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400">Xung đột phát hiện:</span> <strong className="text-amber-600">{report.metrics.conflictsDetected}</strong>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400">Độ phủ bằng chứng:</span> <strong className="text-indigo-600">{Math.round(report.metrics.evidenceCoverage * 100)}%</strong>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400">Độ tin cậy xác minh:</span> <strong className="text-emerald-600">{Math.round(report.metrics.confidence * 100)}%</strong>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400">Thời gian:</span> <strong className="text-slate-700">{report.metrics.durationMs}ms</strong>
                </div>
              </div>
            </div>

            {/* 1. Executive Summary */}
            <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-indigo-700" />
                <span>1. Tóm tắt Điều hành (Executive Summary)</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {report.executiveSummary}
              </p>
            </div>

            {/* 2. Key Findings with Source Traces */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                2. Phát hiện Trọng yếu (Key Findings with Citations)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.keyFindings.map((kf) => (
                  <div key={kf.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {kf.id.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-600">
                          {Math.round(kf.confidence * 100)}% Verified
                        </span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {kf.text}
                      </p>
                    </div>
                    {kf.evidenceTrace.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 italic">
                        Chứng cứ: &ldquo;{kf.evidenceTrace[0]}&rdquo;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Implications */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                3. Hàm ý Chiến lược & Định vị Nghề nghiệp (Implications)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {report.implications.map((imp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/60 text-xs">
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-200 text-amber-900 uppercase">
                      {imp.area}
                    </span>
                    <p className="text-slate-700 mt-2 leading-relaxed">
                      {imp.statement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Research Planner Details & Stop Conditions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Research Plan & Stop Conditions (Khởi tạo Trước khi Search)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800">5 Phân rã Câu hỏi Thứ cấp (Sub-questions):</div>
                <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                  {report.plan.subQuestions.map((sq, idx) => (
                    <li key={idx} className="leading-relaxed">{sq}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800">Điều kiện Dừng (Stop Conditions):</div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-400">Max Queries:</div>
                    <div className="font-bold text-slate-800">{report.plan.stopConditions.maxQueries}</div>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-400">Target Coverage:</div>
                    <div className="font-bold text-indigo-600">{Math.round(report.plan.stopConditions.targetCoverage * 100)}%</div>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-400">Min Diversity:</div>
                    <div className="font-bold text-slate-800">{report.plan.stopConditions.minSourceDiversity} domains</div>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-400">Lý do Dừng:</div>
                    <div className="font-bold text-emerald-600 font-mono text-[11px]">{report.metrics.stopReason}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Source Ranking & Quality Evaluation Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-600" />
                  <span>Xếp hạng Chất lượng Nguồn (Source Quality Evaluation)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đánh giá đa chiều theo 6 tiêu chí: Authority, Recency, Directness, Independence, Evidence Quality, Relevance.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {report.sources.length} Nguồn đã kiểm định
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Nguồn</th>
                    <th className="py-2.5 px-3">Nhà XB & Loại</th>
                    <th className="py-2.5 px-2 text-center">Authority</th>
                    <th className="py-2.5 px-2 text-center">Recency</th>
                    <th className="py-2.5 px-2 text-center">Directness</th>
                    <th className="py-2.5 px-2 text-center">Independence</th>
                    <th className="py-2.5 px-2 text-center">Evidence</th>
                    <th className="py-2.5 px-3 text-right">Composite Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {report.sources.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-900 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-indigo-600">[S{idx + 1}]</span>
                          <span className="truncate" title={s.title}>{s.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">{s.url}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <div className="font-medium text-slate-800">{s.authorOrPublisher}</div>
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 text-slate-600 uppercase font-mono">
                          {s.sourceType}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono">{Math.round(s.quality.authority * 100)}%</td>
                      <td className="py-3 px-2 text-center font-mono">{Math.round(s.quality.recency * 100)}%</td>
                      <td className="py-3 px-2 text-center font-mono">{Math.round(s.quality.directness * 100)}%</td>
                      <td className="py-3 px-2 text-center font-mono">{Math.round(s.quality.independence * 100)}%</td>
                      <td className="py-3 px-2 text-center font-mono">{Math.round(s.quality.evidenceQuality * 100)}%</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          s.quality.compositeScore >= 0.85 ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {Math.round(s.quality.compositeScore * 100)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conflict Detection & Cross-Check (Preserves Both Claims) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Đối chiếu Xung đột & Bảo lưu Hai Quan điểm (Conflict Detection)</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                Rule: Never choose claim just because it appears often
              </span>
            </div>

            <div className="space-y-4 mt-4">
              {report.conflicts.map((conflict) => (
                <div key={conflict.id} className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 text-xs space-y-3">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{conflict.topic}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      {conflict.natureOfConflict}
                    </span>
                  </div>

                  {/* Two Preserved Claims Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white border border-amber-200/80">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span>Quan điểm A ({conflict.claimA.date})</span>
                        <span className="text-indigo-600">CL: {Math.round(conflict.claimA.qualityScore * 100)}%</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {conflict.claimA.claim}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-1">Nguồn: {conflict.claimA.sourceTitle}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-amber-200/80">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span>Quan điểm B ({conflict.claimB.date})</span>
                        <span className="text-indigo-600">CL: {Math.round(conflict.claimB.qualityScore * 100)}%</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {conflict.claimB.claim}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-1">Nguồn: {conflict.claimB.sourceTitle}</div>
                    </div>
                  </div>

                  {/* Quality Comparison & Uncertainty Rationale */}
                  <div className="pt-2 border-t border-amber-200/60 text-slate-700 space-y-1">
                    <div>
                      <strong>So sánh chất lượng nguồn:</strong> {conflict.sourceComparison}
                    </div>
                    <div>
                      <strong>Bản chất bất định (Uncertainty):</strong> {conflict.explanationOfUncertainty}
                    </div>
                    <div className="text-amber-900 font-semibold pt-1">
                      💡 <strong>Khuyến nghị ứng viên:</strong> {conflict.recommendedStance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career OS Entity Mappings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Ánh xạ Thực thể Career OS (Career OS Entity Integration)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Company & Business Model */}
              {report.careerMapping.company && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                    Company Entity
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{report.careerMapping.company.name}</div>
                  <div className="text-slate-600 leading-relaxed">
                    <strong>Mô hình KD:</strong> {report.careerMapping.company.businessModel}
                  </div>
                  <div className="text-slate-600 leading-relaxed">
                    <strong>Sản phẩm:</strong> {report.careerMapping.company.product}
                  </div>
                  <div className="text-slate-600">
                    <strong>Đối thủ:</strong> {report.careerMapping.company.competitors.join(', ')}
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-indigo-700 font-medium">
                    <strong>User Fit:</strong> {report.careerMapping.company.userFitAnalysis}
                  </div>
                </div>
              )}

              {/* Role & Salary Band */}
              {report.careerMapping.role && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    Role & Salary Entity
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{report.careerMapping.role.title}</div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                    <div className="text-[10px] text-emerald-700 font-semibold uppercase">Median Base Salary</div>
                    <div className="text-xl font-black text-emerald-900">
                      ${report.careerMapping.role.salaryRange.median.toLocaleString()} {report.careerMapping.role.salaryRange.currency}
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">
                      Dải: ${report.careerMapping.role.salaryRange.min.toLocaleString()} - ${report.careerMapping.role.salaryRange.max.toLocaleString()} (n={report.careerMapping.role.salaryRange.sampleSize})
                    </div>
                  </div>
                  <div className="text-slate-600 leading-relaxed">
                    <strong>Kỳ vọng cốt lõi:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {report.careerMapping.role.coreExpectations.map((exp, idx) => (
                        <li key={idx}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Skill Matrix */}
              {report.careerMapping.skill && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                    Skill Matrix Entity
                  </span>
                  <div className="space-y-2">
                    <div>
                      <span className="font-bold text-slate-800">In-Demand Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.careerMapping.skill.inDemand.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-800">Emerging Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.careerMapping.skill.emerging.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[11px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-800">Declining Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.careerMapping.skill.declining.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-[11px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Research Memory & Freshness Ledger */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Research Memory & Freshness Ledger</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bộ nhớ nghiên cứu lưu trữ có kiểm soát hạn dùng (Fresh / Aging / Expired). Thông tin nhạy cảm thời gian không được coi là kiến thức vĩnh cửu.
            </p>
          </div>
          <button
            onClick={loadMemories}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới Cache</span>
          </button>
        </div>

        {memories.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Chưa có mục nghiên cứu nào trong bộ nhớ. Hãy chạy một truy vấn nghiên cứu phía trên.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories.map((mem) => {
              const expiresDate = new Date(mem.expiresAt).toLocaleDateString();
              const researchDate = new Date(mem.researchDate).toLocaleDateString();

              return (
                <div 
                  key={mem.id} 
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        mem.freshnessStatus === 'fresh' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : mem.freshnessStatus === 'aging' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {mem.freshnessStatus}
                      </span>
                      <span className="text-[10px] text-slate-400">TTL: {mem.ttlDays} ngày</span>
                    </div>

                    <h4 className="font-bold text-slate-900 line-clamp-2" title={mem.topic}>
                      {mem.topic}
                    </h4>

                    <div className="mt-2 text-[11px] text-slate-500 space-y-1">
                      <div>Ngày nghiên cứu: {researchDate}</div>
                      <div>Hết hạn: <strong className="text-slate-700">{expiresDate}</strong></div>
                      <div>Nguồn: {mem.sources.length} | Xác minh: {Math.round(mem.confidence * 100)}%</div>
                    </div>

                    {mem.timeSensitiveDimensions.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Nhạy cảm thời gian:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mem.timeSensitiveDimensions.map((dim, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">
                              {dim}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setQuery(mem.topic);
                        handleExecute(false);
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Đọc từ Memory ➔
                    </button>
                    <button
                      onClick={() => {
                        setQuery(mem.topic);
                        handleExecute(true);
                      }}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Cập nhật mới
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
