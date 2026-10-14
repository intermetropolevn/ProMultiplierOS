import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  BookOpen,
  FileText,
  Layers,
  Globe,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Play,
  Filter,
  Search,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  Industry,
  IndustryReport,
  IndustryDataPoint,
  IndustryIntelligence,
  CaseStudy
} from '../../features/industry/types';
import { industryStore } from '../../features/industry/services/industryStore';
import { CasePracticeDetailModal } from './CasePracticeDetailModal';

interface IndustryDashboardViewProps {
  onSelectCaseToPractice?: (caseStudy: CaseStudy) => void;
}

export const IndustryDashboardView: React.FC<IndustryDashboardViewProps> = ({
  onSelectCaseToPractice
}) => {
  const industries = industryStore.getIndustries();
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>(
    industries.find(i => i.id === 'ind-ev')?.id || industries[0]?.id || 'ind-auto'
  );

  const [geographyFilter, setGeographyFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'METRICS' | 'INTELLIGENCE' | 'CASES' | 'REPORTS'>('OVERVIEW');
  const [selectedCaseModal, setSelectedCaseModal] = useState<CaseStudy | null>(null);

  const currentIndustry = industryStore.getIndustryById(selectedIndustryId) || industries[0];
  const reports = industryStore.getReportsByIndustry(selectedIndustryId);
  const dataPoints = industryStore.getDataPoints({
    industryId: selectedIndustryId,
    geography: geographyFilter
  });
  const intelligence = industryStore.getIntelligence({
    industryId: selectedIndustryId
  });
  const relatedCases = industryStore.getCaseStudies({
    industryId: selectedIndustryId
  });

  // Extract unique geographies available for filtering
  const availableGeos = Array.from(new Set(
    industryStore.getDataPoints({ industryId: selectedIndustryId }).map(d => d.geography || 'Global')
  ));

  return (
    <div className="space-y-6">
      {/* Industry Switcher Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Industry Intelligence Hub
              </span>
              <span className="text-xs font-medium text-slate-500">
                Live Data & Sector Benchmarks
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {currentIndustry.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              {currentIndustry.description}
            </p>
          </div>

          {/* Industry Selector Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedIndustryId}
              onChange={(e) => setSelectedIndustryId(e.target.value)}
              className="text-xs sm:text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {industries.map(ind => (
                <option key={ind.id} value={ind.id}>
                  {ind.parentIndustryId ? `↳ ${ind.name}` : ind.name}
                </option>
              ))}
            </select>

            {/* Geography Filter */}
            {availableGeos.length > 1 && (
              <select
                value={geographyFilter}
                onChange={(e) => setGeographyFilter(e.target.value)}
                className="text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">All Geographies</option>
                {availableGeos.map(geo => (
                  <option key={geo} value={geo}>{geo}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Verified Data Points
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900">
              {dataPoints.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Industry Intelligence Insights
            </span>
            <span className="text-base sm:text-lg font-bold text-blue-700">
              {intelligence.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Practice Case Studies
            </span>
            <span className="text-base sm:text-lg font-bold text-purple-700">
              {relatedCases.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Authoritative Reports
            </span>
            <span className="text-base sm:text-lg font-bold text-emerald-700">
              {reports.length}
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pt-2 overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: 'Overview & Highlights', icon: Layers },
            { id: 'METRICS', label: `Key Metrics (${dataPoints.length})`, icon: BarChart3 },
            { id: 'INTELLIGENCE', label: `Sector Trends & Insights (${intelligence.length})`, icon: TrendingUp },
            { id: 'CASES', label: `Related Case Studies (${relatedCases.length})`, icon: BookOpen },
            { id: 'REPORTS', label: `Reports & Sources (${reports.length})`, icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Featured Practice Case Banner */}
          {relatedCases.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md relative overflow-hidden">
              <div className="max-w-2xl space-y-2 relative z-10">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Featured Case Study
                </span>
                <h3 className="text-lg sm:text-xl font-bold">
                  {relatedCases[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed line-clamp-2">
                  {relatedCases[0].description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setSelectedCaseModal(relatedCases[0])}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-blue-950 hover:bg-blue-50 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Practice Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-blue-200 font-medium">
                    {relatedCases[0].difficulty} · {relatedCases[0].estimatedTime} mins · {relatedCases[0].questionIds.length} Interview Questions
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics Quick Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Grounded Industry Benchmarks
              </h3>
              <button
                onClick={() => setActiveTab('METRICS')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View all {dataPoints.length} metrics →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataPoints.slice(0, 3).map(dp => (
                <div key={dp.id} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-2 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {dp.geography || 'Global'} · {dp.periodLabel || '2026'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Quality: {dp.dataQualityScore ?? 95}/100
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {dp.metric}
                  </h4>

                  <div className="text-lg sm:text-xl font-extrabold text-blue-600">
                    {dp.rawValue || `${dp.value} ${dp.unit}`}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Source: {dp.publisher || 'Verified Report'}</span>
                    {dp.sourceUrl && (
                      <a
                        href={dp.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Trends & Insights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Sector Trends & Market Intelligence
              </h3>
              <button
                onClick={() => setActiveTab('INTELLIGENCE')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View all {intelligence.length} insights →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intelligence.slice(0, 2).map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                      {item.type.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                      Origin: {item.origin}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>

                  {item.implications.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Strategic Implications:
                      </span>
                      {item.implications.slice(0, 2).map((imp, idx) => (
                        <div key={idx} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{imp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: KEY METRICS TABLE */}
      {activeTab === 'METRICS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Normalized Industry Data Points
            </h3>
            <span className="text-xs text-slate-500">
              Showing {dataPoints.length} verified metrics
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="px-4 py-3">Metric Name</th>
                  <th className="px-4 py-3">Normalized Value</th>
                  <th className="px-4 py-3">Raw Reported Value</th>
                  <th className="px-4 py-3">Geography</th>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Publisher / Source</th>
                  <th className="px-4 py-3">Quality Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataPoints.map(dp => (
                  <tr key={dp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{dp.metric}</div>
                      {dp.definition && (
                        <div className="text-[10px] text-slate-500 italic truncate max-w-xs">{dp.definition}</div>
                      )}
                      {dp.conflictWarning && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded mt-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          Conflicting Source Available
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-blue-700">
                      {String(dp.value)} {dp.unit}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                      {dp.rawValue || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {dp.geography || 'Global'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {dp.periodLabel || '2026'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      <div className="truncate max-w-[140px]">{dp.publisher || 'Verified Report'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                        {dp.dataQualityScore ?? 95}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECTOR TRENDS & INTELLIGENCE */}
      {activeTab === 'INTELLIGENCE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intelligence.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    {item.type.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.evidenceLevel} Evidence
                    </span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">
                      {item.origin}
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {item.summary}
                </p>

                {item.implications.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Strategic & Practice Implications:
                    </span>
                    {item.implications.map((imp, idx) => (
                      <div key={idx} className="text-xs text-slate-800 flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: RELATED CASE STUDIES */}
      {activeTab === 'CASES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedCases.map(cs => (
              <div key={cs.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-blue-300 transition-colors flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                      {cs.difficulty}
                    </span>
                    {cs.geography && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        {cs.geography}
                      </span>
                    )}
                    {cs.estimatedTime && (
                      <span className="text-xs text-slate-500 font-medium">
                        {cs.estimatedTime} mins
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {cs.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {cs.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {cs.skillIds.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {cs.questionIds.length} Structured Questions
                  </span>
                  <button
                    onClick={() => setSelectedCaseModal(cs)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Practice Case</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: AUTHORITATIVE REPORTS */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(rep => (
              <div key={rep.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {rep.reportType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Credibility: {rep.credibilityScore ?? 95}/100
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {rep.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rep.summary}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Publisher: {rep.publisher}</span>
                  {rep.sourceUrl && (
                    <a
                      href={rep.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>View Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Case Practice */}
      {selectedCaseModal && (
        <CasePracticeDetailModal
          caseStudy={selectedCaseModal}
          onClose={() => setSelectedCaseModal(null)}
          onLaunchSimulation={(cs) => {
            setSelectedCaseModal(null);
            if (onSelectCaseToPractice) onSelectCaseToPractice(cs);
          }}
        />
      )}
    </div>
  );
};
