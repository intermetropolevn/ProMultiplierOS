import React, { useMemo } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Award, 
  CheckCircle2, 
  Database, 
  TrendingUp, 
  FileText,
  Briefcase,
  FolderGit2,
  Layout,
  Tv,
  CheckCircle
} from 'lucide-react';
import { sourceStore } from '../../features/sources/services/sourceStore';
import { EVIDENCE_STRENGTH_LEVELS } from '../../features/sources/taxonomy';

export const CapabilityLedgerAdminView: React.FC = () => {
  const sources = useMemo(() => sourceStore.getSources(), []);
  const metrics = useMemo(() => sourceStore.getAggregateMetrics(), [sources]);

  // Aggregate verified capabilities by strength level
  const strengthDistribution = useMemo(() => {
    return EVIDENCE_STRENGTH_LEVELS.map(def => {
      const count = sources.filter(s => s.evidenceStrength === def.level).length;
      const percentage = sources.length > 0 ? Math.round((count / sources.length) * 100) : 0;
      return {
        ...def,
        count,
        percentage
      };
    });
  }, [sources]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Core Governance
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">System Source Ledger & Proof Ledger</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Verified Capability Ledger & Aggregations</span>
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl">
              System-wide audit trail of all verified candidate evidence, skill attestations, and level calibrations ingested across the Career OS.
            </p>
          </div>
        </div>

        {/* 8-Metric Primary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-bold text-slate-500 block">Total Sources</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">{metrics.totalSources}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-center">
            <span className="text-[11px] font-bold text-blue-700 block">Learning</span>
            <span className="text-2xl font-black text-blue-900 mt-0.5 block">{metrics.learningSources}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 text-center">
            <span className="text-[11px] font-bold text-amber-700 block">Credentials</span>
            <span className="text-2xl font-black text-amber-900 mt-0.5 block">{metrics.credentials}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
            <span className="text-[11px] font-bold text-indigo-700 block">Projects</span>
            <span className="text-2xl font-black text-indigo-900 mt-0.5 block">{metrics.projects}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 text-center">
            <span className="text-[11px] font-bold text-purple-700 block">Artifacts</span>
            <span className="text-2xl font-black text-purple-900 mt-0.5 block">{metrics.artifacts}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 text-center">
            <span className="text-[11px] font-bold text-rose-700 block">Assessments</span>
            <span className="text-2xl font-black text-rose-900 mt-0.5 block">{metrics.assessments}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center">
            <span className="text-[11px] font-bold text-emerald-700 block">Validated (≥L5)</span>
            <span className="text-2xl font-black text-emerald-900 mt-0.5 block">{metrics.validatedEvidence}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-center">
            <span className="text-[11px] font-bold text-slate-300 block">Coverage</span>
            <span className="text-2xl font-black text-emerald-400 mt-0.5 block">{metrics.evidenceCoverage}%</span>
          </div>
        </div>
      </div>

      {/* Strength Level Distribution (L0 - L6) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Evidence Strength Calibration Breakdown (L0 - L6)
        </h3>

        <div className="space-y-3">
          {strengthDistribution.map(item => (
            <div key={item.level} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeBg}`}>
                    {item.shortLabel}
                  </span>
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <span className="text-slate-400 text-[11px] hidden sm:inline">— {item.description}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-900">{item.count}</span>
                  <span className="text-slate-400 text-[11px]">({item.percentage}%)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(item.percentage, item.count > 0 ? 3 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
