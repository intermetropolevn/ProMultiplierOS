import React, { useState } from 'react';
import { 
  X, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  CircleDot, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  TrendingUp,
  FileText,
  Award
} from 'lucide-react';
import { 
  RoleIntelligenceItem, 
  RoleReadinessAnalysis,
  ReadinessGapCategory 
} from '../../features/roleIntelligence/types';
import { roleIntelligenceStore } from '../../features/roleIntelligence/services/roleIntelligenceStore';
import { UserCareerProfile } from '../../types';

interface RoleReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleIntelligenceItem;
  userProfile?: UserCareerProfile;
  onNavigateToLearning?: () => void;
  onNavigateToOpportunities?: () => void;
  onNavigateToParticipation?: () => void;
}

export const RoleReadinessModal: React.FC<RoleReadinessModalProps> = ({
  isOpen,
  onClose,
  role,
  userProfile,
  onNavigateToLearning,
  onNavigateToOpportunities,
  onNavigateToParticipation
}) => {
  const [activeGapTab, setActiveGapTab] = useState<ReadinessGapCategory | 'all'>('all');

  if (!isOpen) return null;

  const analysis: RoleReadinessAnalysis = roleIntelligenceStore.generateReadinessAnalysis(
    role.id, 
    userProfile
  );

  const allGaps = [
    ...analysis.gapBreakdown.skillGaps,
    ...analysis.gapBreakdown.experienceGaps,
    ...analysis.gapBreakdown.evidenceGaps,
    ...analysis.gapBreakdown.exposureGaps
  ];

  const filteredGaps = activeGapTab === 'all' 
    ? allGaps 
    : allGaps.filter(g => g.category === activeGapTab);

  const getStatusIcon = (status: 'strong' | 'develop' | 'gap') => {
    switch (status) {
      case 'strong': return <span className="text-emerald-600 font-black text-sm">✓</span>;
      case 'develop': return <span className="text-amber-600 font-black text-sm">△</span>;
      case 'gap': return <span className="text-rose-600 font-black text-sm">○</span>;
    }
  };

  const getCategoryBadge = (cat: ReadinessGapCategory) => {
    switch (cat) {
      case 'skill': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'experience': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'evidence': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'exposure': return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-700 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Current Profile</span>
                <span>vs</span>
                <strong className="text-slate-800">{role.title}</strong>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Role Readiness &amp; Gap Diagnostics
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          
          {/* Top Hero Score & Coverage Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
            
            {/* Visual Readiness Score */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-slate-200 shadow-3xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Overall Role Readiness
              </span>
              <div className="relative flex items-center justify-center my-2">
                <span className="text-4xl sm:text-5xl font-black text-blue-700 tracking-tight">
                  {analysis.overallFitScore}%
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800">
                {analysis.overallFitScore >= 80 ? 'High Readiness · Ready to Pursue' : 'Moderate Match · Target Gaps'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Based on synthesized skills, verified experiences, and demonstrated deliverables.
              </p>
            </div>

            {/* 6 Coverage Dimension Bars */}
            <div className="md:col-span-8 space-y-2.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">Skill Coverage</span>
                  <span className="font-mono text-slate-900">{analysis.skillCoverageScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${analysis.skillCoverageScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">Experience Coverage</span>
                  <span className="font-mono text-slate-900">{analysis.experienceCoverageScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${analysis.experienceCoverageScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">Decision-Making Scope Coverage</span>
                  <span className="font-mono text-slate-900">{analysis.decisionCoverageScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${analysis.decisionCoverageScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">Evidence &amp; Artifact Verification</span>
                  <span className="font-mono text-slate-900">{analysis.evidenceCoverageScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${analysis.evidenceCoverageScore}%` }} />
                </div>
              </div>
            </div>

          </div>

          {/* Strong vs Developing vs Evidence Gap vs Experience Gap (Section 16) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            {/* STRONG EVIDENCE (✓) */}
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/70 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <span className="font-black text-sm text-emerald-600">✓</span>
                <span>Strong Evidence</span>
              </div>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                {analysis.strongAreas.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DEVELOPING (△) */}
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <span className="font-black text-sm text-amber-600">△</span>
                <span>Developing</span>
              </div>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                {analysis.developAreas.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold shrink-0">△</span>
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EVIDENCE GAP (○) */}
            <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200/70 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-purple-900">
                <span className="font-black text-sm text-purple-600">○</span>
                <span>Evidence Gap</span>
              </div>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold shrink-0">○</span>
                  <span className="leading-tight">People Leadership / Direct Reporting</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold shrink-0">○</span>
                  <span className="leading-tight">External Industry Moat Defense</span>
                </li>
              </ul>
            </div>

            {/* EXPERIENCE GAP (○) */}
            <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/70 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-rose-900">
                <span className="font-black text-sm text-rose-600">○</span>
                <span>Experience Gap</span>
              </div>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold shrink-0">○</span>
                  <span className="leading-tight">Organization-wide Ownership</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold shrink-0">○</span>
                  <span className="leading-tight">Multi-portfolio Resource Allocation</span>
                </li>
              </ul>
            </div>

          </div>

          {/* CRITICAL 4-WAY GAP TAXONOMY (Skill vs Experience vs Evidence vs Exposure) */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Critical 4-Way Gap Diagnostic
                </h3>
                <p className="text-xs text-slate-500">
                  Distinguishes pure knowledge deficits from lack of real experience, verified evidence, or executive exposure.
                </p>
              </div>

              {/* Taxonomy Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs shrink-0">
                {(['all', 'skill', 'experience', 'evidence', 'exposure'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveGapTab(tab)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      activeGapTab === tab
                        ? 'bg-white text-slate-900 shadow-3xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredGaps.map(gap => (
                <div
                  key={gap.id}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-3xs hover:border-slate-300 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(gap.status)}
                      <h4 className="font-bold text-xs text-slate-900">{gap.name}</h4>
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border capitalize self-start sm:self-auto ${getCategoryBadge(gap.category)}`}>
                      {gap.category} Gap
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Your Current Signal</span>
                      <p className="text-slate-700 text-[11px] leading-snug">{gap.currentSignal}</p>
                    </div>

                    <div className="p-2.5 bg-blue-50/40 rounded-lg border border-blue-200/60 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Target Requirement</span>
                      <p className="text-slate-800 text-[11px] leading-snug font-medium">{gap.targetRequirement}</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50/70 rounded-lg text-xs flex items-center justify-between gap-2 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-[11px]">Recommended Remediation: <strong>{gap.remediationPath}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/70 rounded-2xl border border-blue-200/80 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
              Recommended Next Best Actions
            </span>
            <ul className="space-y-1.5 text-xs text-slate-800">
              {analysis.recommendedNextActions.map((action, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex items-center gap-2">
            {onNavigateToParticipation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToParticipation();
                }}
                className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Log Participation Evidence
              </button>
            )}

            {onNavigateToOpportunities && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToOpportunities();
                }}
                className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Explore Matching Opportunities
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
