import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Users, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { MetricLedgerItem, MetricCategoryType, EvidenceItem } from '../../features/knowledge/types';
import { KnowledgeInfoPopover } from './KnowledgeInfoPopover';

interface MetricsLedgerSectionProps {
  metrics: MetricLedgerItem[];
  evidenceList: EvidenceItem[];
  onAddMetric: () => void;
  onEditMetric: (metric: MetricLedgerItem) => void;
  onDeleteMetric: (id: string) => void;
  onViewSourceEvidence?: (evidenceId: string) => void;
}

const CATEGORIES: ('All' | MetricCategoryType)[] = [
  'All',
  'Scale & Volume',
  'Reliability & Uptime',
  'Cost & Revenue',
  'Efficiency & Latency',
  'Team & Velocity',
  'Customer Impact'
];

export const MetricsLedgerSection: React.FC<MetricsLedgerSectionProps> = ({
  metrics,
  evidenceList,
  onAddMetric,
  onEditMetric,
  onDeleteMetric,
  onViewSourceEvidence
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | MetricCategoryType>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Verified' | 'Needs Baseline' | 'Estimated'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = metrics.length;
    const verified = metrics.filter(m => m.verificationStatus === 'Verified').length;
    const needsBaseline = metrics.filter(m => m.verificationStatus === 'Needs Baseline').length;
    const estimated = metrics.filter(m => m.verificationStatus === 'Estimated').length;
    return { total, verified, needsBaseline, estimated };
  }, [metrics]);

  const filteredMetrics = useMemo(() => {
    return metrics.filter(m => {
      if (selectedCategory !== 'All' && m.metricType !== selectedCategory) return false;
      if (selectedStatus !== 'All' && m.verificationStatus !== selectedStatus) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        m.metric.toLowerCase().includes(q) ||
        m.value.toLowerCase().includes(q) ||
        m.sourceTitle.toLowerCase().includes(q) ||
        (m.notes?.toLowerCase().includes(q) || false)
      );
    });
  }, [metrics, selectedCategory, selectedStatus, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (type: MetricCategoryType) => {
    switch (type) {
      case 'Scale & Volume':
        return <TrendingUp className="w-3.5 h-3.5 text-blue-600" />;
      case 'Reliability & Uptime':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Cost & Revenue':
        return <DollarSign className="w-3.5 h-3.5 text-amber-600" />;
      case 'Efficiency & Latency':
        return <Zap className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Team & Velocity':
        return <Users className="w-3.5 h-3.5 text-purple-600" />;
      case 'Customer Impact':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-rose-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Section Sub-Header & Scope Education */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Metrics & Proof</h2>
            <KnowledgeInfoPopover
              label="Metrics & Proof"
              explanation="Concrete evidence behind your experiences. Use real numbers whenever possible."
              example="12M records synchronized, 0s unplanned downtime, $4,000/month savings"
              whyThisMatters="Proof makes your stories concrete. Add real numbers, outcomes or measurable signals from your work."
            />
          </div>
          <p className="text-xs text-slate-600">
            Concrete evidence behind your experiences. Use real numbers whenever possible.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddMetric}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Proof Point</span>
        </button>
      </div>

      {/* Top Stat Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Proof Points
          </span>
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          <span className="text-[11px] text-slate-500 font-medium">Across all evidence</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 shadow-2xs space-y-1 bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Verified
            </span>
            <KnowledgeInfoPopover
              label="Verified"
              explanation="Evidence-backed metric with a reliable source or record."
            />
          </div>
          <p className="text-2xl font-black text-emerald-700">{stats.verified}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Audit-backed data</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200/90 shadow-2xs space-y-1 bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
              Needs Baseline
            </span>
            <KnowledgeInfoPopover
              label="Needs Baseline"
              explanation="An outcome is mentioned but lacks enough context or a comparison point to make the metric useful."
            />
          </div>
          <p className="text-2xl font-black text-rose-600">{stats.needsBaseline}</p>
          <span className="text-[11px] text-rose-500 font-medium">Missing quantitative metric</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Estimated
            </span>
            <KnowledgeInfoPopover
              label="Estimated"
              explanation="An approximate value. Do not present it as an exact measured result."
            />
          </div>
          <p className="text-2xl font-black text-slate-700">{stats.estimated}</p>
          <span className="text-[11px] text-slate-500 font-medium">Approximate bounds</span>
        </div>
      </div>

      {/* Missing Metrics Alert Callout if any exist */}
      {stats.needsBaseline > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold text-rose-900">Missing Metric Alert:</span>
              <p className="text-rose-700">
                You have {stats.needsBaseline} story item marked as "Needs metrics". Adding concrete numbers upgrades your Story Bank quality to "Strong evidence".
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedStatus('Needs Baseline')}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition-colors shrink-0"
          >
            Review Missing Baselines
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search proof points by metric value, project name, or keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          const count = cat === 'All' 
            ? metrics.length 
            : metrics.filter(m => m.metricType === cat).length;
          
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{cat}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Verification Filter Status Pills with Native Tooltips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
          Status:
        </span>
        <button
          type="button"
          onClick={() => setSelectedStatus('All')}
          className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
            selectedStatus === 'All'
              ? 'bg-slate-900 text-white font-semibold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>

        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSelectedStatus('Verified')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedStatus === 'Verified'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            Verified
          </button>
          <KnowledgeInfoPopover
            label="Verified Status"
            explanation="Evidence-backed metric with a reliable source or record."
          />
        </div>

        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSelectedStatus('Needs Baseline')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedStatus === 'Needs Baseline'
                ? 'bg-rose-700 text-white font-semibold'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            Needs Baseline
          </button>
          <KnowledgeInfoPopover
            label="Needs Baseline Status"
            explanation="An outcome is mentioned but lacks enough context or a comparison point to make the metric useful."
          />
        </div>

        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSelectedStatus('Estimated')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedStatus === 'Estimated'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Estimated
          </button>
          <KnowledgeInfoPopover
            label="Estimated Status"
            explanation="An approximate value. Do not present it as an exact measured result."
          />
        </div>
      </div>

      {/* Metrics & Proof Grid */}
      {filteredMetrics.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No proof metrics found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Record quantifiable achievements to provide hard evidence during interview evaluations.
          </p>
          <button
            type="button"
            onClick={onAddMetric}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Proof Point</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMetrics.map(item => {
            const isVerified = item.verificationStatus === 'Verified';
            const isNeedsBaseline = item.verificationStatus === 'Needs Baseline';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 space-y-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between ${
                  isNeedsBaseline
                    ? 'border-rose-200/90 bg-rose-50/10'
                    : 'border-slate-200/90'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {getCategoryIcon(item.metricType)}
                      <span>{item.metricType}</span>
                    </span>

                    {/* Verification Status with Native Tooltip */}
                    <div className="flex items-center gap-1">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : isNeedsBaseline ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          <AlertCircle className="w-3 h-3" />
                          <span>Needs Baseline</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          <span>Estimated</span>
                        </span>
                      )}

                      <KnowledgeInfoPopover
                        label={item.verificationStatus}
                        explanation={
                          isVerified
                            ? 'Evidence-backed metric with a reliable source or record.'
                            : isNeedsBaseline
                            ? 'An outcome is mentioned but lacks enough context or a comparison point to make the metric useful.'
                            : 'An approximate value. Do not present it as an exact measured result.'
                        }
                      />
                    </div>
                  </div>

                  {/* Big Callout Value */}
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                      {item.value}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug pt-1">
                      {item.metric}
                    </p>
                  </div>

                  {/* Source Evidence Link */}
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span className="font-semibold text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">
                      Source Experience:
                    </span>
                    <span className="font-medium text-slate-700 line-clamp-1">{item.sourceTitle}</span>
                  </div>

                  {/* Telemetry Notes */}
                  {item.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      Note: {item.notes}
                    </p>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, `${item.value} - ${item.metric}`)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Statement</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditMetric(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit metric"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteMetric(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete metric"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
