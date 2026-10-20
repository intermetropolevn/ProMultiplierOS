import React from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Users, 
  Sparkles, 
  Target, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { WorkInitiative } from '../../features/evidenceIntelligence/types';

interface InitiativeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initiative: WorkInitiative | null;
  onOpenEvidenceDetail?: (evidenceId: string) => void;
}

export const InitiativeDetailModal: React.FC<InitiativeDetailModalProps> = ({
  isOpen,
  onClose,
  initiative,
  onOpenEvidenceDetail
}) => {
  if (!isOpen || !initiative) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Work / Initiative Entity
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium font-mono">{initiative.timeframe}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {initiative.status}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {initiative.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {initiative.objective}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* User Role & Responsibilities */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Your Role in Initiative</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {initiative.userRole}
              </span>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Responsibilities Owned</span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                {initiative.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fragmented Source Aggregation Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Fragmented Source Aggregation (Evidence Sources)
              </span>
              <span className="text-[11px] text-slate-500">Unifying raw signals into one cohesive entity</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {initiative.sourceDistribution.map((sd, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 shadow-3xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                    {sd.source}
                  </span>
                  <span className="text-lg font-black text-slate-900 block">{sd.count}</span>
                  <span className="text-[10px] text-slate-500 block truncate" title={sd.details}>
                    {sd.details}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Column Grid: Decisions & Experiments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Key Decisions Made */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Target className="w-4 h-4 text-purple-600" />
                <span>Decisions &amp; Trade-offs Made</span>
              </div>
              <div className="space-y-2.5">
                {initiative.decisions.map((dec) => (
                  <div key={dec.id} className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/60 space-y-1 text-xs">
                    <span className="font-bold text-slate-900 block">{dec.title}</span>
                    <p className="text-slate-600 leading-snug">{dec.rationale}</p>
                    <span className="text-[10px] text-slate-500 italic block mt-1">
                      Alt rejected: {dec.alternativesConsidered}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Controlled Experiments */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Experiments &amp; Variant Hypotheses</span>
              </div>
              <div className="space-y-2.5">
                {initiative.experiments.map((exp) => (
                  <div key={exp.id} className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/60 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{exp.variantChosen}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        {exp.result}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-snug">{exp.hypothesis}</p>
                    <span className="text-[10px] font-semibold text-emerald-700 block">
                      Metric Lift: {exp.metricObserved}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Measured Outcomes & Artifacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Quantitative Outcomes */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Verified Outcomes</span>
              <div className="space-y-2">
                {initiative.outcomes.map((out) => (
                  <div key={out.id} className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/70 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{out.metricName}</span>
                      <span className="text-[10px] text-slate-500">Baseline: {out.baseline} → Result: {out.result}</span>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-200 shadow-3xs">
                      {out.quantitativeLift}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting Artifacts */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Supporting Artifacts</span>
              <div className="space-y-2">
                {initiative.artifacts.map((art) => (
                  <div key={art.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <div>
                        <span className="font-semibold text-slate-900 block">{art.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{art.sizeOrScope} · {art.dateCreated}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {art.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/60">
          <span className="text-xs text-slate-500">
            {initiative.evidenceGeneratedIds.length} structured career evidence signals generated from this initiative.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
