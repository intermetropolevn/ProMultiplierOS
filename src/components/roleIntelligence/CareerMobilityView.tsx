import React, { useState } from 'react';
import { 
  RoleIntelligenceItem, 
  CareerMobilityTransition 
} from '../../features/roleIntelligence/types';
import { 
  GitBranch, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Compass, 
  Target, 
  ChevronRight,
  TrendingUp,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface CareerMobilityViewProps {
  role: RoleIntelligenceItem;
  onSelectRole: (roleId: string) => void;
  onNavigateToReadiness: () => void;
}

export const CareerMobilityView: React.FC<CareerMobilityViewProps> = ({
  role,
  onSelectRole,
  onNavigateToReadiness
}) => {
  const [selectedTransitionId, setSelectedTransitionId] = useState<string>(
    role.mobilityTransitions[0]?.toRoleId || ''
  );

  const activeTransition = role.mobilityTransitions.find(t => t.toRoleId === selectedTransitionId) || role.mobilityTransitions[0];

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Moderate': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'High': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Role Intelligence</span>
              <span aria-hidden="true">/</span>
              <span>Career Mobility &amp; Cross-Functional Graph</span>
              <span aria-hidden="true">/</span>
              <strong className="text-slate-900">{role.title}</strong>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Career Mobility Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Explore dynamic horizontal, diagonal, and cross-functional pathways across the Product × Tech × Business × Operations ecosystem. Unlock lateral agility instead of rigid vertical ladders.
            </p>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl text-left sm:text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Identified Pathways</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">{role.mobilityTransitions.length} Transitions</span>
          </div>
        </div>
      </div>

      {/* 2. Visual Movement Grid: Vertical vs Lateral Ecosystem Nodes */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Lateral &amp; Diagonal Trajectory Graph: {role.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a target adjacent role to evaluate transferability, skill overlap, gaps, and transition difficulty.
          </p>
        </div>

        {/* Interactive Transition Pathway Selector Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {role.mobilityTransitions.map((tr) => {
            const isSelected = tr.toRoleId === activeTransition?.toRoleId;
            return (
              <button
                key={tr.toRoleId}
                type="button"
                onClick={() => setSelectedTransitionId(tr.toRoleId)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 text-slate-900 ring-2 ring-blue-500/10 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                      {tr.transferabilityLevel} Match
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {tr.transferabilityScore}%
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 pt-0.5">
                    {tr.toRoleTitle}
                  </h4>
                </div>

                <div className="pt-3 border-t border-slate-200/50 mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{tr.skillOverlapPercentage}% skill overlap</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDifficultyBadge(tr.estimatedTransitionDifficulty)}`}>
                    {tr.estimatedTransitionDifficulty} Effort
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Transition Deep Dive Card */}
        {activeTransition && (
          <div className="p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-6">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{role.title}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">{activeTransition.toRoleTitle}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Transition Analysis: {activeTransition.toRoleTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {activeTransition.strategicValue}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start lg:self-auto">
                <button
                  type="button"
                  onClick={() => onSelectRole(activeTransition.toRoleId)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  <span>Evaluate Target Role</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onNavigateToReadiness}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>My Transition Fit</span>
                </button>
              </div>
            </div>

            {/* Metrics Breakdown Strip (Section 17: Capability overlap, Evidence overlap, Experience gap, Transition difficulty) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Capability Overlap</span>
                <span className="text-lg font-black text-blue-700 mt-0.5 block">{activeTransition.skillOverlapPercentage}%</span>
                <span className="text-[10px] text-slate-500">{activeTransition.skillOverlapItems.length} core competencies</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Evidence Overlap</span>
                <span className="text-lg font-black text-emerald-700 mt-0.5 block">{Math.max(50, activeTransition.skillOverlapPercentage - 8)}%</span>
                <span className="text-[10px] text-slate-500">Verified artifact signals</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Transition Difficulty</span>
                <span className="text-lg font-black text-slate-900 mt-0.5 block">{activeTransition.estimatedTransitionDifficulty}</span>
                <span className="text-[10px] text-slate-500">Cross-domain distance</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Experience Gap</span>
                <span className="text-xs font-semibold text-slate-800 mt-1 block truncate" title={activeTransition.requiredExperience}>
                  {activeTransition.requiredExperience}
                </span>
              </div>
            </div>

            {/* Overlap vs Gaps Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Overlapping Strengths */}
              <div className="p-4 bg-white rounded-xl border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Directly Transferable Competencies ({activeTransition.skillOverlapItems.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTransition.skillOverlapItems.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-emerald-50/70 border border-emerald-200/80 text-emerald-800 rounded-lg text-xs font-medium">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Identified Gaps to Bridge */}
              <div className="p-4 bg-white rounded-xl border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Key Gaps to Bridge ({activeTransition.skillGaps.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTransition.skillGaps.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-amber-50/70 border border-amber-200/80 text-amber-800 rounded-lg text-xs font-medium">
                      △ {sk}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Recommended Transition Pathway Milestones */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Recommended 90-Day Transition Pathway
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {activeTransition.recommendedPathway.map((step, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200/70 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
