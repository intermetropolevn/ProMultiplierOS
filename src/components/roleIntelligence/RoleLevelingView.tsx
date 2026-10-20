import React from 'react';
import { RoleIntelligenceItem } from '../../features/roleIntelligence/types';
import { 
  GitBranch, 
  Layers, 
  ShieldCheck, 
  Compass, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

interface RoleLevelingViewProps {
  role: RoleIntelligenceItem;
  onNavigateToEvaluation: () => void;
  onNavigateToReadiness: () => void;
}

export const RoleLevelingView: React.FC<RoleLevelingViewProps> = ({
  role,
  onNavigateToEvaluation,
  onNavigateToReadiness
}) => {
  const lm = role.levelMapping;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner & Inferred Level Hero */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Role Intelligence</span>
              <span aria-hidden="true">/</span>
              <span>Leveling & Career Ladder Profile</span>
              <span aria-hidden="true">/</span>
              <strong className="text-slate-900">{role.title}</strong>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Role Level Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Multi-framework calibrated leveling architecture comparing CareerOS inferred scope against global technology benchmark standards.
            </p>
          </div>

          {/* Hero Inferred Level Box */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-200/80 shadow-2xs text-left lg:text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
              CareerOS Inferred Level
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 block mt-0.5">
              {lm.careerosInferredLevel}
            </span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">
              Level Code: <strong className="text-blue-700 font-mono">{lm.levelCode}</strong>
            </span>
          </div>
        </div>

        {/* 2. Key Scopes Strip: Current, Target, Role Scope, Decision, Impact, Complexity, Leadership */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Role Scope</span>
            <p className="text-slate-800 font-medium leading-snug">{lm.scopeSummary.roleScope}</p>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Decision Scope</span>
            <p className="text-slate-800 font-medium leading-snug">{lm.scopeSummary.decisionScope}</p>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Impact Scope</span>
            <p className="text-slate-800 font-medium leading-snug">{lm.scopeSummary.impactScope}</p>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Complexity</span>
            <p className="text-slate-800 font-medium leading-snug">{lm.scopeSummary.complexity}</p>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Leadership Scope</span>
            <p className="text-slate-800 font-medium leading-snug">{lm.scopeSummary.leadershipScope}</p>
          </div>
        </div>
      </div>

      {/* 3. Reference Frameworks Cross-Leveling Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Reference Framework Level Concordance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How this role sizes across established market compensation and organizational leveling architectures.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">5 Methodologies</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">Aon Radford</span>
            <span className="text-base font-black text-slate-900 block">{lm.referenceFrameworkLevels.aonRadford}</span>
            <span className="text-[11px] text-slate-500 block">Tech benchmark standard</span>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">Korn Ferry Hay</span>
            <span className="text-base font-black text-slate-900 block">{lm.referenceFrameworkLevels.kornFerryHay}</span>
            <span className="text-[11px] text-slate-500 block">Point-factor job size</span>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">Mercer IPE</span>
            <span className="text-base font-black text-slate-900 block">{lm.referenceFrameworkLevels.mercerIpe}</span>
            <span className="text-[11px] text-slate-500 block">Position class evaluation</span>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">WTW GGS</span>
            <span className="text-base font-black text-slate-900 block">{lm.referenceFrameworkLevels.wtwGgs}</span>
            <span className="text-[11px] text-slate-500 block">Global grading system</span>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">Patterson Band</span>
            <span className="text-base font-black text-slate-900 block">{lm.referenceFrameworkLevels.patterson}</span>
            <span className="text-[11px] text-slate-500 block">Decision complexity band</span>
          </div>
        </div>

        {/* Evidence / Rationale Cards */}
        <div className="pt-2 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Leveling Evidence &amp; Calibration Rationale
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lm.evidenceRationale.map((rationale, idx) => (
              <div key={idx} className="p-3 bg-blue-50/40 rounded-xl border border-blue-200/60 text-xs text-slate-700 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rationale}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Dual-Track Progression Ladder: Individual Contributor vs Management Tracks */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Career Track Progression: Dual Ladder Architecture
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Preserves technical leverage and organizational impact without forcing engineers and product builders into people management.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Dual Ladder
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Track 1: Individual Contributor Ladder */}
          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Individual Contributor (IC) Track</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 font-mono">Specialist / Technical Leverage</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Focuses on autonomous architectural depth, complex product strategy, and organizational force multiplication without formal administrative headcount reporting.
            </p>

            <div className="space-y-2 pt-1">
              {role.careerProgression.icTrack.map((step, idx) => {
                const isCurrent = step.includes(role.levelMapping.levelCode) || step.includes('Senior');
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500 text-white">
                        Current Scope
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Track 2: Management Ladder */}
          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                <span>Management Track</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 font-mono">People &amp; Portfolio Leadership</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Focuses on organizational design, hiring, talent development, cross-departmental budgeting, and multi-squad portfolio delivery.
            </p>

            <div className="space-y-2 pt-1">
              {role.careerProgression.managementTrack.map((step, idx) => {
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border bg-white border-slate-200/80 text-slate-700 text-xs font-medium flex items-center justify-between hover:bg-slate-100/60 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      M{idx + 1} Equivalent
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Level Progression Call-to-Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
          <div className="text-xs text-slate-600">
            Compare your current skill and experience signals against <strong className="text-slate-900">{role.title}</strong> requirements.
          </div>
          <button
            type="button"
            onClick={onNavigateToReadiness}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Run Readiness Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
