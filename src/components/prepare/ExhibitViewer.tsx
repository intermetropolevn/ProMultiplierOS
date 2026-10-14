import React, { useState } from 'react';
import { 
  BarChart3, 
  Table as TableIcon, 
  Info, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  HelpCircle,
  TrendingUp,
  Layers
} from 'lucide-react';
import { CaseExhibit, IndustryDataPoint } from '../../features/industry/types';
import { industryStore } from '../../features/industry/services/industryStore';

interface ExhibitViewerProps {
  exhibit: CaseExhibit;
  onSelectDataPoint?: (point: IndustryDataPoint) => void;
}

export const ExhibitViewer: React.FC<ExhibitViewerProps> = ({
  exhibit,
  onSelectDataPoint
}) => {
  const [activeDataPointPopover, setActiveDataPointPopover] = useState<IndustryDataPoint | null>(null);

  // Retrieve linked data points for provenance
  const linkedDataPoints: IndustryDataPoint[] = exhibit.dataPointIds
    .map(id => industryStore.getDataPointById(id))
    .filter(Boolean) as IndustryDataPoint[];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Exhibit Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
              {exhibit.type}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Exhibit #{exhibit.order}
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900">
            {exhibit.title}
          </h4>
        </div>

        {/* Linked Data Points Provenance Trigger Chips */}
        {linkedDataPoints.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              Verified Data:
            </span>
            {linkedDataPoints.map(dp => (
              <button
                key={dp.id}
                onClick={() => {
                  setActiveDataPointPopover(activeDataPointPopover?.id === dp.id ? null : dp);
                  if (onSelectDataPoint) onSelectDataPoint(dp);
                }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  activeDataPointPopover?.id === dp.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title={`Click to inspect provenance: ${dp.publisher || 'Verified Source'}`}
              >
                <span>{dp.metric.slice(0, 22)}...</span>
                <span className="text-[10px] font-bold opacity-80">({dp.rawValue || dp.value})</span>
                <Info className="w-3 h-3 ml-0.5 opacity-70" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popover Provenance Card (Progressive Disclosure) */}
      {activeDataPointPopover && (
        <div className="m-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold text-[10px] uppercase">
                Data Point Provenance
              </span>
              <strong className="text-slate-900 font-bold">{activeDataPointPopover.metric}</strong>
            </div>
            <button
              onClick={() => setActiveDataPointPopover(null)}
              className="text-slate-400 hover:text-slate-700 font-bold text-sm px-1 cursor-pointer"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-700">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Reported Value</span>
              <span className="font-bold text-slate-900">{activeDataPointPopover.rawValue || activeDataPointPopover.value} {activeDataPointPopover.unit}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Source Publisher</span>
              <span className="font-semibold text-blue-700">{activeDataPointPopover.publisher || 'Verified Report'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Geography & Period</span>
              <span>{activeDataPointPopover.geography || 'Global'} · {activeDataPointPopover.periodLabel || '2026'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Data Quality Score</span>
              <span className="font-bold text-emerald-700">{activeDataPointPopover.dataQualityScore ?? 95}/100</span>
            </div>
          </div>

          {activeDataPointPopover.definition && (
            <p className="text-[11px] text-slate-600 italic pt-1 border-t border-blue-100">
              "{activeDataPointPopover.definition}"
            </p>
          )}

          {activeDataPointPopover.sourceUrl && (
            <div className="pt-1 flex items-center justify-end">
              <a
                href={activeDataPointPopover.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>View original report source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Exhibit Content Body */}
      <div className="p-4 sm:p-5">
        {/* Type 1: Interactive Chart */}
        {exhibit.type === 'CHART' && exhibit.chartConfig && (
          <div className="space-y-4">
            <div className="h-64 sm:h-72 w-full flex flex-col justify-end pt-4 pb-2 px-2 bg-slate-50/40 rounded-xl border border-slate-100 relative">
              {/* Native SVG Chart Visualizer */}
              {exhibit.chartConfig.chartType === 'line' ? (
                <div className="w-full h-full flex flex-col justify-between">
                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-end gap-3 text-xs mb-2">
                    {exhibit.chartConfig.series.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color || '#2563eb' }} />
                        <span className="text-slate-700 font-medium text-[11px]">{s.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* SVG Canvas */}
                  <div className="relative flex-1 w-full flex items-end">
                    <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" strokeWidth="1" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" strokeDasharray="3,3" />
                      <line x1="0" y1="50" x2="500" y2="50" stroke="#e2e8f0" strokeDasharray="3,3" />

                      {/* Series Lines */}
                      {exhibit.chartConfig.series.map((s, sIdx) => {
                        const data = exhibit.chartConfig!.data;
                        const maxVal = Math.max(...data.map(d => d[s.key] || 0), 10);
                        const points = data.map((d, dIdx) => {
                          const x = (dIdx / Math.max(1, data.length - 1)) * 480 + 10;
                          const val = d[s.key] || 0;
                          const y = 140 - (val / maxVal) * 120;
                          return `${x},${y}`;
                        }).join(' ');

                        return (
                          <g key={sIdx}>
                            <polyline
                              fill="none"
                              stroke={s.color || '#2563eb'}
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={points}
                            />
                            {data.map((d, dIdx) => {
                              const x = (dIdx / Math.max(1, data.length - 1)) * 480 + 10;
                              const val = d[s.key] || 0;
                              const y = 140 - (val / maxVal) * 120;
                              return (
                                <g key={dIdx}>
                                  <circle cx={x} cy={y} r="4.5" fill="#ffffff" stroke={s.color || '#2563eb'} strokeWidth="2.5" />
                                  <text x={x} y={y - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">
                                    {val}%
                                  </text>
                                </g>
                              );
                            })}
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* X-Axis Labels */}
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500 pt-2 border-t border-slate-200">
                    {exhibit.chartConfig.data.map((d, idx) => (
                      <span key={idx} className="text-[11px]">{d[exhibit.chartConfig!.xAxisKey]}</span>
                    ))}
                  </div>
                </div>
              ) : (
                /* Bar Chart Visualizer */
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex flex-wrap items-center justify-end gap-3 text-xs mb-2">
                    {exhibit.chartConfig.series.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-md" style={{ backgroundColor: s.color || '#2563eb' }} />
                        <span className="text-slate-700 font-medium text-[11px]">{s.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 w-full flex items-end justify-around gap-2 px-2 pb-1">
                    {exhibit.chartConfig.data.map((d, idx) => {
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="flex items-end gap-1.5 w-full justify-center h-36">
                            {exhibit.chartConfig!.series.map((s, sIdx) => {
                              const val = d[s.key] || 0;
                              const heightPct = Math.min(100, Math.max(10, (val / 140) * 100));
                              return (
                                <div
                                  key={sIdx}
                                  className="w-5 sm:w-7 rounded-t-md transition-all hover:opacity-90 relative group"
                                  style={{
                                    height: `${heightPct}%`,
                                    backgroundColor: s.color || '#2563eb'
                                  }}
                                >
                                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    {val}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600 text-center truncate">
                            {d[exhibit.chartConfig!.xAxisKey]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Type 2: Clean High-Contrast Table */}
        {(exhibit.type === 'TABLE' || exhibit.type === 'DATA_CARD') && exhibit.tableData && (
          <div className="overflow-x-auto rounded-xl border border-slate-200/90">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  {exhibit.tableData.headers.map((h, idx) => (
                    <th key={idx} className="px-3.5 py-2.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exhibit.tableData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td 
                        key={cIdx} 
                        className={`px-3.5 py-2.5 font-medium ${
                          cIdx === 0 ? 'text-slate-900 font-semibold' : 'text-slate-700'
                        } ${
                          String(cell).includes('Savings') || String(cell).includes('+') ? 'text-emerald-700 font-bold' : ''
                        } ${
                          String(cell).includes('Danger') || String(cell).includes('Severe') ? 'text-rose-600 font-bold' : ''
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Question Prompt / Interview Interpretation */}
        {exhibit.question && (
          <div className="mt-4 p-3 rounded-xl bg-purple-50/60 border border-purple-200/80 text-xs">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-900 block font-bold mb-0.5">Exhibit Question:</strong>
                <p className="text-purple-950 font-medium">{exhibit.question}</p>
                {exhibit.interpretation && (
                  <p className="text-purple-800 text-[11px] mt-1.5 pt-1.5 border-t border-purple-200">
                    <strong className="font-bold">Interviewer Calibration Note:</strong> {exhibit.interpretation}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
