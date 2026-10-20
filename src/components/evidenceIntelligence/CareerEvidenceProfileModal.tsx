import React from 'react';
import { 
  X, 
  Award, 
  TrendingUp, 
  Target, 
  GitBranch, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { evidenceIntelligenceStore } from '../../features/evidenceIntelligence/services/evidenceIntelligenceStore';

interface CareerEvidenceProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToInitiative?: (initiativeId: string) => void;
}

export const CareerEvidenceProfileModal: React.FC<CareerEvidenceProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigateToInitiative
}) => {
  if (!isOpen) return null;

  const roleReadiness = evidenceIntelligenceStore.getRoleReadiness();
  const capabilities = evidenceIntelligenceStore.getCapabilities();
  const initiatives = evidenceIntelligenceStore.getInitiatives();
  const confirmedEvidence = evidenceIntelligenceStore.getAllEvidence();

  const validatedCaps = capabilities.filter(c => c.evidenceStrength === 'Strong');
  const emergingCaps = capabilities.filter(c => c.observedProficiency === 'Emerging' || c.evidenceStrength === 'Limited' || c.evidenceStrength === 'Insufficient');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-white">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white shadow-3xs">
                Career Evidence Profile
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Evidence-Backed Foundation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Verified Career Evidence Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Consolidated evidence profile derived from shipped initiatives, verified quantitative outcomes, and validated peer contributions.
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Target Role Readiness Hero (Section 14) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                  Target Role Readiness Mapping
                </span>
                <h3 className="text-xl font-black tracking-tight text-white mt-0.5">
                  {roleReadiness.targetRoleTitle}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xl font-black text-white">{roleReadiness.overallReadinessPercentage}%</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">{roleReadiness.readinessBand}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-700 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Strong Evidence Capabilities
                </span>
                <ul className="space-y-1 text-slate-200">
                  {roleReadiness.strongEvidenceCapabilities.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  Identified Evidence &amp; Experience Gaps
                </span>
                <ul className="space-y-1.5 text-slate-200">
                  {roleReadiness.evidenceGaps.map((gap, i) => (
                    <li key={i} className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{gap.capabilityName}</span>
                        <span className="text-[9px] font-semibold text-amber-300 px-1.5 py-0.2 rounded bg-amber-950/70 border border-amber-800">
                          {gap.gapType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{gap.currentState}</p>
                      <span className="text-[10px] text-blue-300 font-semibold block">
                        Action: {gap.recommendedNextAction}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Signature Shipped Initiatives */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Signature Shipped Initiatives ({initiatives.length})
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {initiatives.map(init => (
                <div key={init.id} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {init.userRole}
                  </span>
                  <h4 className="font-bold text-slate-900 leading-tight">{init.title}</h4>
                  <p className="text-slate-600 text-[11px] leading-snug line-clamp-2">{init.objective}</p>
                  
                  {init.outcomes.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 truncate">{init.outcomes[0].metricName}</span>
                      <span className="font-bold text-emerald-700 shrink-0">{init.outcomes[0].quantitativeLift}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Validated vs Emerging Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Validated Core Capabilities */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Validated Core Capabilities ({validatedCaps.length})
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Strong Proof
                </span>
              </div>

              <div className="space-y-2">
                {validatedCaps.slice(0, 5).map(cap => (
                  <div key={cap.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{cap.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{cap.verifiedEvidenceCount} verified work signals</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {cap.observedProficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emerging & Gap Capabilities */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Identified Gaps &amp; Emerging Signals
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Target Focus
                </span>
              </div>

              <div className="space-y-2">
                {emergingCaps.map(cap => (
                  <div key={cap.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{cap.name}</span>
                      <span className="text-[10px] font-semibold text-slate-500 font-mono">
                        {cap.observedProficiency} ({cap.evidenceStrength})
                      </span>
                    </div>
                    {cap.recommendedAction && (
                      <p className="text-[11px] text-blue-800 bg-blue-50/60 p-1.5 rounded font-medium">
                        → {cap.recommendedAction}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Career Mobility Adjacent Transitions (Section 20) */}
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Career Mobility: Evidence-Backed Adjacent Pathways
                </span>
                <span className="text-[11px] text-slate-500">Lateral and diagonal agility backed by demonstrated proof</span>
              </div>
              <GitBranch className="w-4 h-4 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {roleReadiness.adjacentMobilityRoles.map(adj => (
                <div key={adj.roleId} className="p-3 bg-white rounded-xl border border-slate-200 shadow-3xs space-y-1.5">
                  <span className="font-bold text-slate-900 text-xs block truncate">{adj.title}</span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Overlap:</span>
                    <strong className="text-blue-700">{adj.overlapPercentage}%</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Difficulty:</span>
                    <span className="font-semibold text-slate-700">{adj.difficulty}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate" title={adj.keyGap}>
                    Key Gap: {adj.keyGap}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/60">
          <span className="text-xs text-slate-500">
            Backed by {confirmedEvidence.length} verified evidence records and {initiatives.length} initiatives.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
