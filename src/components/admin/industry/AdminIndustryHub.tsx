import React, { useState } from 'react';
import {
  Layers,
  BarChart3,
  TrendingUp,
  BookOpen,
  FileText,
  Upload,
  Plus,
  Sparkles,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  HelpCircle,
  Eye,
  Clock,
  Globe
} from 'lucide-react';
import {
  Industry,
  IndustryReport,
  IndustryDataPoint,
  IndustryIntelligence,
  CaseStudy
} from '../../../features/industry/types';
import { industryStore } from '../../../features/industry/services/industryStore';
import { AdminDataImportModal } from './AdminDataImportModal';
import { AdminAiCaseGenModal } from './AdminAiCaseGenModal';
import { CasePracticeDetailModal } from '../../prepare/CasePracticeDetailModal';

export const AdminIndustryHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INDUSTRIES' | 'DATA_POINTS' | 'INTELLIGENCE' | 'CASES' | 'REPORTS'>('DATA_POINTS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState<string>('All');
  const [selectedGeographyFilter, setSelectedGeographyFilter] = useState<string>('All');

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isAiGenModalOpen, setIsAiGenModalOpen] = useState<boolean>(false);
  const [previewCase, setPreviewCase] = useState<CaseStudy | null>(null);

  // Trigger re-render on data modifications
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const industries = industryStore.getIndustries();
  const dataPoints = industryStore.getDataPoints({
    industryId: selectedIndustryFilter !== 'All' ? selectedIndustryFilter : undefined,
    geography: selectedGeographyFilter !== 'All' ? selectedGeographyFilter : undefined,
    search: searchQuery
  });
  const intelligence = industryStore.getIntelligence({
    industryId: selectedIndustryFilter !== 'All' ? selectedIndustryFilter : undefined
  });
  const caseStudies = industryStore.getCaseStudies({
    industryId: selectedIndustryFilter !== 'All' ? selectedIndustryFilter : undefined,
    search: searchQuery
  });
  const reports = industryStore.getReports();

  // Quick statistics
  const totalDataPoints = industryStore.getDataPoints().length;
  const conflictingDataPoints = industryStore.getDataPoints().filter(d => d.conflictWarning).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
              Admin Control Plane
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Industry Intelligence & Case Studies Layer
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Industry Intelligence, Data & Cases Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Manage sector taxonomies, normalize quantitative benchmarks, audit source credibility, and generate grounded case study exhibits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV / JSON</span>
          </button>

          <button
            onClick={() => setIsAiGenModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Case Generator</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Industries</span>
          <span className="text-lg font-bold text-slate-900">{industries.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Verified Data Points</span>
          <span className="text-lg font-bold text-blue-600">{totalDataPoints}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sector Intelligence</span>
          <span className="text-lg font-bold text-purple-600">{intelligence.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Case Studies</span>
          <span className="text-lg font-bold text-emerald-600">{caseStudies.length}</span>
        </div>
        <div className={`p-3.5 rounded-xl border shadow-xs ${
          conflictingDataPoints > 0 ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider block">Conflict Warnings</span>
          <span className="text-lg font-bold">{conflictingDataPoints} detected</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs overflow-x-auto">
        {[
          { id: 'DATA_POINTS', label: `Data Points (${totalDataPoints})`, icon: BarChart3 },
          { id: 'CASES', label: `Case Studies (${caseStudies.length})`, icon: BookOpen },
          { id: 'INTELLIGENCE', label: `Sector Intelligence (${intelligence.length})`, icon: TrendingUp },
          { id: 'INDUSTRIES', label: `Industries Taxonomy (${industries.length})`, icon: Layers },
          { id: 'REPORTS', label: `Reports & Sources (${reports.length})`, icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
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

      {/* Filter & Search Bar (for relevant tabs) */}
      {(activeTab === 'DATA_POINTS' || activeTab === 'CASES') && (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by metric, keyword, publisher, or skill..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-xs"
              />
            </div>

            <select
              value={selectedIndustryFilter}
              onChange={(e) => setSelectedIndustryFilter(e.target.value)}
              className="text-xs font-semibold p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer"
            >
              <option value="All">All Industries</option>
              {industries.map(ind => (
                <option key={ind.id} value={ind.id}>{ind.name}</option>
              ))}
            </select>
          </div>

          <span className="text-slate-500 font-medium">
            Showing {activeTab === 'DATA_POINTS' ? dataPoints.length : caseStudies.length} records
          </span>
        </div>
      )}

      {/* TAB 1: DATA POINTS */}
      {activeTab === 'DATA_POINTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="px-4 py-3">Metric Name</th>
                  <th className="px-4 py-3">Normalized Value</th>
                  <th className="px-4 py-3">Raw Reported String</th>
                  <th className="px-4 py-3">Geo & Period</th>
                  <th className="px-4 py-3">Publisher</th>
                  <th className="px-4 py-3">Quality Score</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataPoints.map(dp => (
                  <tr key={dp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{dp.metric}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{dp.id}</div>
                      {dp.conflictWarning && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5 max-w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          Conflicting Source Available
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-blue-700">
                      {String(dp.value)} {dp.unit}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {dp.rawValue || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {dp.geography || 'Global'} · {dp.periodLabel || '2026'}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div className="truncate max-w-[140px] font-medium">{dp.publisher || 'Verified Report'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        {dp.dataQualityScore ?? 95}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          industryStore.deleteDataPoint(dp.id);
                          setRefreshTrigger(t => t + 1);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Data Point"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CASE STUDIES */}
      {activeTab === 'CASES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseStudies.map(cs => {
            const exhibits = industryStore.getExhibitsForCase(cs.id);
            const questions = industryStore.getQuestionsForCase(cs.id);
            return (
              <div key={cs.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                      {cs.difficulty}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Quality: {cs.qualityScore ?? 95}/100
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {cs.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cs.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                    <div><strong>Exhibits:</strong> {exhibits.length} interactive charts/tables</div>
                    <div><strong>Questions:</strong> {questions.length} interview prompts</div>
                    <div><strong>Time:</strong> ~{cs.estimatedTime} mins</div>
                    <div><strong>Geography:</strong> {cs.geography || 'Global'}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">{cs.id}</span>
                  <button
                    onClick={() => setPreviewCase(cs)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview & Practice</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: SECTOR INTELLIGENCE */}
      {activeTab === 'INTELLIGENCE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intelligence.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                  {item.type.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                  {item.origin}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {item.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.summary}
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Implications for Cases & Strategy:
                </span>
                {item.implications.map((imp, idx) => (
                  <div key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: INDUSTRIES TAXONOMY */}
      {activeTab === 'INDUSTRIES' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Configured Sectors & Hierarchies
            </h3>
            <span className="text-xs text-slate-500">
              {industries.length} active industries
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {industries.map(ind => (
              <div key={ind.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {ind.parentIndustryId ? `↳ ${ind.name}` : ind.name}
                    </h4>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                      {ind.id}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {ind.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl">
                    {ind.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {ind.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500 shrink-0">
                  <div>Domain: {ind.domainId}</div>
                  <div>Geo: {ind.geography || 'Global'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REPORTS & SOURCES */}
      {activeTab === 'REPORTS' && (
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
                    <span>Inspect Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Import CSV / JSON */}
      {isImportModalOpen && (
        <AdminDataImportModal
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={(count) => {
            setRefreshTrigger(t => t + 1);
          }}
        />
      )}

      {/* MODAL: AI Case Generator */}
      {isAiGenModalOpen && (
        <AdminAiCaseGenModal
          onClose={() => setIsAiGenModalOpen(false)}
          onSuccess={(newCase) => {
            setRefreshTrigger(t => t + 1);
            setPreviewCase(newCase);
          }}
        />
      )}

      {/* MODAL: Preview Case Practice */}
      {previewCase && (
        <CasePracticeDetailModal
          caseStudy={previewCase}
          onClose={() => setPreviewCase(null)}
        />
      )}
    </div>
  );
};
