import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { MetricLedgerItem, MetricCategoryType, EvidenceItem } from '../../features/knowledge/types';

interface MetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metric: MetricLedgerItem) => void;
  evidenceList: EvidenceItem[];
  initialMetric?: MetricLedgerItem | null;
}

const METRIC_TYPES: MetricCategoryType[] = [
  'Scale & Volume',
  'Reliability & Uptime',
  'Cost & Revenue',
  'Efficiency & Latency',
  'Team & Velocity',
  'Customer Impact'
];

export const MetricModal: React.FC<MetricModalProps> = ({
  isOpen,
  onClose,
  onSave,
  evidenceList,
  initialMetric
}) => {
  const isEditing = !!initialMetric;

  const [metricText, setMetricText] = useState(initialMetric?.metric || '');
  const [value, setValue] = useState(initialMetric?.value || '');
  const [metricType, setMetricType] = useState<MetricCategoryType>(initialMetric?.metricType || 'Scale & Volume');
  const [sourceEvidenceId, setSourceEvidenceId] = useState(initialMetric?.sourceEvidenceId || evidenceList[0]?.id || '');
  const [verificationStatus, setVerificationStatus] = useState<'Verified' | 'Estimated' | 'Needs Baseline'>(
    initialMetric?.verificationStatus || 'Verified'
  );
  const [notes, setNotes] = useState(initialMetric?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricText.trim()) return;

    const sourceEvidence = evidenceList.find(e => e.id === sourceEvidenceId);

    const itemToSave: MetricLedgerItem = {
      id: initialMetric?.id || `m-${Date.now()}`,
      metric: metricText.trim(),
      value: value.trim() || 'Proof metric',
      metricType,
      sourceEvidenceId,
      sourceTitle: sourceEvidence?.title || 'Personal Project',
      verificationStatus,
      notes: notes.trim()
    };

    onSave(itemToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Metric Ledger
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {isEditing ? 'Edit Quantifiable Proof Metric' : 'Record Proof Metric'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Metric Value / Stat Callout <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="e.g. 12M records, +18% lift"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Category
              </label>
              <select
                value={metricType}
                onChange={e => setMetricType(e.target.value as MetricCategoryType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {METRIC_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Full Metric Statement
            </label>
            <textarea
              rows={2}
              required
              value={metricText}
              onChange={e => setMetricText(e.target.value)}
              placeholder="e.g. Zero unplanned downtime achieved across 12M migrated customer accounts during real-time cutover"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Source Evidence Item
              </label>
              <select
                value={sourceEvidenceId}
                onChange={e => setSourceEvidenceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {evidenceList.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Verification Status
              </label>
              <select
                value={verificationStatus}
                onChange={e => setVerificationStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Verified">Verified (Backed by telemetry/audit)</option>
                <option value="Estimated">Estimated (Conservative approximation)</option>
                <option value="Needs Baseline">Needs Baseline (Missing metric)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Telemetry Notes / Verification Source
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Audit logs, Prometheus dashboard, sprint velocity retrospective"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
            >
              {isEditing ? 'Save Metric' : 'Record Metric'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
