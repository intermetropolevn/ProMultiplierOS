// =========================================================================
// CAREER OS - MULTILINGUAL INTELLIGENCE & AUDIT DASHBOARD
// =========================================================================

import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Search, 
  BookOpen, 
  TrendingUp, 
  Terminal, 
  Play, 
  RotateCcw,
  Languages,
  Check,
  ChevronRight,
  ExternalLink,
  Tag,
  Lightbulb,
  FileCheck,
  Zap,
  BrainCircuit
} from 'lucide-react';
import { CareerSemanticParser } from '../../features/intelligence/services/careerSemanticParser';
import { CrossLanguageRetriever } from '../../features/intelligence/services/crossLanguageRetriever';
import { MultilingualAuditSuite, AuditSuiteSummary } from '../../features/intelligence/services/multilingualAuditSuite';
import { ParsedCareerIntent, MultilingualRetrievalResult } from '../../features/intelligence/types';
import { CapabilityActivationInspector } from './activation/CapabilityActivationInspector';

interface MultilingualIntelligenceDashboardProps {
  initialQuery?: string;
  onSelectResource?: (entityId: string, entityType: string) => void;
  onApplyToWorkspace?: (intent: ParsedCareerIntent) => void;
}

const SAMPLE_QUERIES = [
  {
    id: 's27',
    label: 'Sec 27: Fintech Strategy Manager (Indonesia)',
    query: 'Mình đang apply job Product Strategy Manager ở một công ty fintech tại Indonesia. Họ gửi take-home case yêu cầu đánh giá có nên expand vào thị trường này không. Cần research ngành và gợi ý các frameworks để phân tích.'
  },
  {
    id: 's28',
    label: 'Sec 28: Profitability Structure (Rev/Cost vs Segment)',
    query: 'Case này hỏi về profitability bị giảm, mình nên structure theo revenue/cost hay customer segment trước?'
  },
  {
    id: 's29',
    label: 'Sec 29: Vietnamese-only Market Expansion',
    query: 'Bài toán yêu cầu đánh giá khả năng mở rộng sang thị trường mới.'
  },
  {
    id: 's30',
    label: 'Sec 30: English-only Market Expansion (Canonical Match)',
    query: 'The prompt asks whether the company should expand into a new regional market.'
  },
  {
    id: 's31',
    label: 'Sec 31: Code-Switching (Market Sizing + Unit Econ)',
    query: 'Mình muốn practice market sizing model và research thêm về competitor landscape, đặc biệt là unit economics và recommendation.'
  },
  {
    id: 's32',
    label: 'Sec 32: PM Disambiguation (Discovery + Roadmap)',
    query: 'Job PM này khá heavy về product discovery, roadmap và stakeholder management.'
  },
  {
    id: 's33',
    label: 'Sec 33: Non-Diacritic Vietnamese ("Minh dang apply...")',
    query: 'Minh dang apply job PM, case yeu cau uoc luong quy mo thi truong va phan tich doi thu.'
  },
  {
    id: 's34',
    label: 'Sec 34: Hypothesis Separation ("Mình nghĩ bottleneck...")',
    query: 'Với bài toán này, mình nghĩ bottleneck chính lại nằm ở economics chứ không phải demand.'
  }
];

export const MultilingualIntelligenceDashboard: React.FC<MultilingualIntelligenceDashboardProps> = ({
  initialQuery = SAMPLE_QUERIES[0].query,
  onSelectResource,
  onApplyToWorkspace
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'parser' | 'audit' | 'retrieval' | 'activation'>('parser');
  const [auditSummary, setAuditSummary] = useState<AuditSuiteSummary | null>(() => MultilingualAuditSuite.runFullAudit());
  const [isAuditing, setIsAuditing] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState<'en' | 'vi'>('vi');

  // Semantic parsing of current query
  const parsedIntent = useMemo(() => {
    if (!query.trim()) return null;
    return CareerSemanticParser.parse(query);
  }, [query]);

  // Cross-language retrieval
  const retrievalResults = useMemo(() => {
    if (!parsedIntent) return [];
    return CrossLanguageRetriever.retrieve(parsedIntent, 8);
  }, [parsedIntent]);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const results = MultilingualAuditSuite.runFullAudit();
      setAuditSummary(results);
      setIsAuditing(false);
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Multilingual Intelligence & Semantic Ontology
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Dual VI / EN Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Real-time code-switching detection, Vietnamese diacritic normalization, abbreviation disambiguation, and cross-language retrieval.
              </p>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              id="tab-semantic-parser"
              onClick={() => setActiveTab('parser')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'parser' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Parser
            </button>
            <button
              id="tab-cross-retrieval"
              onClick={() => setActiveTab('retrieval')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'retrieval' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cross-Language ({retrievalResults.length})
            </button>
            <button
              id="tab-audit-suite"
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'audit' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Audit Suite</span>
              {auditSummary && (
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                  {auditSummary.passedTests}/{auditSummary.totalTests}
                </span>
              )}
            </button>
            <button
              id="tab-capability-activation"
              onClick={() => setActiveTab('activation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'activation' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Trigger Engine (L0-L4)</span>
            </button>
          </div>
        </div>

        {/* Query Input Section */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-600" />
              <span>Input Query / Case Prompt (Vietnamese, English, or Mixed Code-Switching)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Display Reason:</span>
              <button
                onClick={() => setDisplayLanguage('vi')}
                className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer ${displayLanguage === 'vi' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                VI
              </button>
              <button
                onClick={() => setDisplayLanguage('en')}
                className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer ${displayLanguage === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="multilingual-query-input"
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Mình đang apply job Product Strategy Manager ở một công ty fintech tại Indonesia..."
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden resize-none"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Sample Scenarios:
            </span>
            {SAMPLE_QUERIES.map(sample => (
              <button
                key={sample.id}
                onClick={() => setQuery(sample.query)}
                className="text-[11px] font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: PARSER ANALYSIS */}
      {activeTab === 'parser' && parsedIntent && (
        <div className="space-y-5">
          {/* Signal Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Language Mode</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-extrabold uppercase px-2 py-0.5 rounded-md ${
                  parsedIntent.dominantLanguage === 'vi' ? 'bg-amber-100 text-amber-800' :
                  parsedIntent.dominantLanguage === 'en' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {parsedIntent.dominantLanguage === 'mixed' ? 'Mixed Code-Switching' : parsedIntent.dominantLanguage === 'vi' ? 'Vietnamese (VI)' : 'English (EN)'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Code-switching: {parsedIntent.codeSwitchingDetected ? 'Active (Detected)' : 'None'}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Resolved Role</span>
              <div className="mt-1">
                {parsedIntent.role ? (
                  <div>
                    <span className="text-sm font-black text-slate-900 block">{parsedIntent.role.canonicalName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{parsedIntent.role.canonicalId}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">None detected</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Case Archetype</span>
              <div className="mt-1">
                {parsedIntent.caseType ? (
                  <div>
                    <span className="text-sm font-black text-slate-900 block">{parsedIntent.caseType.canonicalName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{parsedIntent.caseType.canonicalId}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">General / Inferred</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Target Geography</span>
              <div className="mt-1">
                {parsedIntent.geographies.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {parsedIntent.geographies.map((g, idx) => (
                      <span key={`geo-${g}-${idx}`} className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-800">
                        {g}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Regional / Global</span>
                )}
              </div>
            </div>
          </div>

          {/* Canonical Skills & Knowledge Units */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Canonical Skills Extracted ({parsedIntent.skills.length})</span>
                </h3>
              </div>

              {parsedIntent.skills.length > 0 ? (
                <div className="space-y-2">
                  {parsedIntent.skills.map(skill => (
                    <div key={skill.canonicalId} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{skill.canonicalName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{skill.canonicalId}</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        Match {Math.round(skill.matchConfidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No specific skill keywords resolved.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>Knowledge Units & Frameworks ({parsedIntent.knowledge.length})</span>
                </h3>
              </div>

              {parsedIntent.knowledge.length > 0 ? (
                <div className="space-y-2">
                  {parsedIntent.knowledge.map(k => (
                    <div key={k.canonicalId} className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{k.canonicalName}</span>
                        <span className="text-[10px] font-mono text-purple-400">{k.canonicalId}</span>
                      </div>
                      <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                        {k.type}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No specific frameworks resolved in prompt.</p>
              )}
            </div>
          </div>

          {/* Fact Classification & Candidate Hypotheses Separation (Section 34) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Epistemic Fact vs. Candidate Hypothesis Classification (Section 34)</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                Audited for clean separation of user assumptions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Ground Truth / User Facts ({parsedIntent.userFacts.length})
                </span>
                {parsedIntent.userFacts.length > 0 ? (
                  <ul className="text-xs text-slate-700 space-y-1">
                    {parsedIntent.userFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No objective facts extracted.</p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-amber-600" />
                  <span>Candidate Hypotheses (USER_HYPOTHESIS) ({parsedIntent.userHypotheses.length})</span>
                </span>
                {parsedIntent.userHypotheses.length > 0 ? (
                  <ul className="text-xs text-amber-900 space-y-1 font-medium">
                    {parsedIntent.userHypotheses.map((hyp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>"{hyp}"</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No personal candidate hypotheses detected.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CROSS-LANGUAGE RETRIEVAL */}
      {activeTab === 'retrieval' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Cross-Language Grounded Resources ({retrievalResults.length})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Multilingual semantic search matches English and Vietnamese assets with localized justifications.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {retrievalResults.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {item.intelligenceType}
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-800">{item.relevanceScore}% Match</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2">
                    {displayLanguage === 'vi' ? item.localizedTitle.vi : item.localizedTitle.en}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{item.subtitle}</p>

                  <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      {displayLanguage === 'vi' ? 'Lý do đề xuất:' : 'Relevance Justification:'}
                    </span>
                    <p className="text-xs leading-relaxed">
                      {displayLanguage === 'vi' ? item.localizedReason.vi : item.localizedReason.en}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px]">{item.sourceEntityType}</span>
                  <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {item.factType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT SUITE RUNNER */}
      {activeTab === 'audit' && auditSummary && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black tracking-tight">
                  Multilingual Intelligence Audit Suite
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Comprehensive automated verification covering Sections 27–34, code-switching robustness, non-diacritic Vietnamese, abbreviation disambiguation, and canonical equivalence.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400 block">
                  {auditSummary.passRatePercentage}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {auditSummary.passedTests} of {auditSummary.totalTests} Passed
                </span>
              </div>

              <button
                id="btn-rerun-audit"
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>Re-run Audit</span>
              </button>
            </div>
          </div>

          {/* Audit Results Table */}
          <div className="space-y-3">
            {auditSummary.results.map(r => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {r.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <h4 className="text-xs font-bold text-slate-900">{r.title}</h4>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    r.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {r.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-mono text-[11px] text-slate-600">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Input:</span>
                  "{r.input}"
                </div>

                <div className="flex flex-wrap gap-2 text-[10px]">
                  {r.extractedRole && (
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                      Role: {r.extractedRole}
                    </span>
                  )}
                  {r.extractedCaseType && (
                    <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">
                      Case: {r.extractedCaseType}
                    </span>
                  )}
                  {r.extractedSkills.map((sk, idx) => (
                    <span key={`rec-sk-${sk}-${idx}`} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      Skill: {sk}
                    </span>
                  ))}
                  {r.extractedGeographies.map((g, idx) => (
                    <span key={`rec-g-${g}-${idx}`} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                      Geo: {g}
                    </span>
                  ))}
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
                    Lang: {r.detectedLanguage}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium pt-1 border-t border-slate-100">
                  {r.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBVIEW 4: CAPABILITY ACTIVATION & TRIGGER ENGINE (L0-L4) */}
      {activeTab === 'activation' && (
        <CapabilityActivationInspector initialPrompt={query} />
      )}
    </div>
  );
};
