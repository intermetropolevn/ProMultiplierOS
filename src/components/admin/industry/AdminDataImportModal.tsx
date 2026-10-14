import React, { useState } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  FileText
} from 'lucide-react';
import { industryStore } from '../../../features/industry/services/industryStore';
import { ImportValidationResult } from '../../../features/industry/types';

interface AdminDataImportModalProps {
  onClose: () => void;
  onSuccess: (count: number) => void;
}

const SAMPLE_CSV = `industry,metric,value,unit,geography,period,source
Automotive,Electric Two-Wheeler Penetration,22.5,%,Vietnam,2026,Vietnam Ministry of Transport
Automotive,Lithium Battery Pack Cost,$84/kWh,USD,Global,2026,IEA Global EV Outlook
Technology,Enterprise SaaS Median NRR,112,%,Global,2026,Gartner Research
Technology,SaaS Benchmark Gross Margin,78.5,%,Global,2026,Gartner Research`;

export const AdminDataImportModal: React.FC<AdminDataImportModalProps> = ({
  onClose,
  onSuccess
}) => {
  const [csvContent, setCsvContent] = useState<string>(SAMPLE_CSV);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleValidate = () => {
    const result = industryStore.validateImportCsv(csvContent);
    setValidationResult(result);
  };

  const handleCommit = () => {
    if (!validationResult || validationResult.validRows.length === 0) return;
    setIsProcessing(true);
    const count = industryStore.commitImportedRows(validationResult.validRows);
    setIsProcessing(false);
    onSuccess(count);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Batch Import Industry Data (CSV / JSON)
              </h3>
              <p className="text-xs text-slate-500">
                Strict schema validation, auto-normalization, duplicate detection & staging
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                CSV Input Data (Comma-Separated)
              </label>
              <button
                type="button"
                onClick={() => setCsvContent(SAMPLE_CSV)}
                className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Reset to Sample CSV
              </button>
            </div>
            <textarea
              rows={8}
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                setValidationResult(null); // Reset validation on edit
              }}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/40"
              placeholder="industry,metric,value,unit,geography,period,source..."
            />
            <p className="text-[11px] text-slate-500">
              Expected headers: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">industry, metric, value, unit, geography, period, source</code>
            </p>
          </div>

          {/* Validation Action */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleValidate}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Validate & Stage Records</span>
            </button>

            {validationResult && (
              <span className="text-xs font-medium text-slate-500">
                Found {validationResult.validRows.length} valid, {validationResult.invalidRows.length} invalid
              </span>
            )}
          </div>

          {/* Validation Results Display */}
          {validationResult && (
            <div className="space-y-3 pt-3 border-t border-slate-100 animate-in fade-in duration-150">
              {/* Stat summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Valid Rows</span>
                  <span className="text-lg font-bold text-emerald-900">{validationResult.validRows.length}</span>
                </div>
                <div className={`p-3 rounded-xl border ${
                  validationResult.invalidRows.length > 0 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="text-[10px] uppercase font-bold block">Invalid Rows</span>
                  <span className="text-lg font-bold">{validationResult.invalidRows.length}</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Existing Duplicates</span>
                  <span className="text-lg font-bold text-amber-900">{validationResult.duplicateCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] uppercase font-bold text-blue-700 block">Unmapped Industries</span>
                  <span className="text-lg font-bold text-blue-900">{validationResult.unmappedIndustries.length}</span>
                </div>
              </div>

              {/* Unmapped Industries Warning */}
              {validationResult.unmappedIndustries.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Unmapped industry categories detected:</strong>{' '}
                    {validationResult.unmappedIndustries.join(', ')}. These will be mapped to default fallback industry.
                  </div>
                </div>
              )}

              {/* Invalid Rows Errors List */}
              {validationResult.invalidRows.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                  <span className="font-bold block">Parsing Errors:</span>
                  {validationResult.invalidRows.map((inv, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-mono">Row {inv.row}:</span>
                      <span>{inv.errors.join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview of Valid Parsed Data Points */}
              {validationResult.validRows.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Normalized Data Preview ({validationResult.validRows.length} records ready)
                  </span>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-2">Metric</th>
                          <th className="px-3 py-2">Normalized Value</th>
                          <th className="px-3 py-2">Raw Value</th>
                          <th className="px-3 py-2">Geography</th>
                          <th className="px-3 py-2">Period</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {validationResult.validRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-bold text-slate-900">{row.metric}</td>
                            <td className="px-3 py-2 font-bold text-blue-600">{String(row.value)} {row.unit}</td>
                            <td className="px-3 py-2 text-slate-500 font-mono text-[11px]">{row.rawValue}</td>
                            <td className="px-3 py-2 text-slate-700">{row.geography}</td>
                            <td className="px-3 py-2 text-slate-700">{row.periodLabel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleCommit}
            disabled={!validationResult || validationResult.validRows.length === 0 || isProcessing}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Commit {validationResult?.validRows.length || 0} Data Points</span>
          </button>
        </div>
      </div>
    </div>
  );
};
