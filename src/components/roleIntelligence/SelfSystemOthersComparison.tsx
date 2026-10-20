import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Briefcase, 
  AlertCircle, 
  HelpCircle,
  TrendingUp,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CareerOSDimensionScore } from '../../features/roleIntelligence/types';

interface SelfSystemOthersComparisonProps {
  dimensions: CareerOSDimensionScore[];
  highlightKey?: string;
  onSelectDimension?: (key: string) => void;
}

export const SelfSystemOthersComparison: React.FC<SelfSystemOthersComparisonProps> = ({
  dimensions,
  highlightKey,
  onSelectDimension
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Render a 10-block visual bar
  const renderBlocks = (score: number, max: number = 5, colorClass: string = 'bg-blue-600') => {
    const totalBlocks = 10;
    const filledCount = Math.round((score / max) * totalBlocks);
    
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <span
            key={i}
            className={`w-2 sm:w-2.5 h-3.5 rounded-xs transition-all ${
              i < filledCount ? colorClass : 'bg-slate-200/80'
            }`}
          />
        ))}
      </div>
    );
  };

  const displayedDimensions = isExpanded ? dimensions : dimensions.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Multi-Signal Concordance
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">Self vs System vs Stakeholders</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            Signal Concordance &amp; Perception Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Identifies alignment between what CareerOS observes in work artifacts, your self-perception, and cross-functional signals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>{isExpanded ? 'Show Top 4' : `View All ${dimensions.length} Dimensions`}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedDimensions.map((dim) => {
          const isSelected = highlightKey === dim.key;
          
          const systemScore = dim.systemEvidenceScore || (dim.score || 4);
          const selfScore = dim.selfAssessmentScore || Math.min(5, (dim.score || 4) + 0.5);
          const crossScore = dim.crossFunctionalScore || (dim.score || 4);
          const managerScore = dim.managerSignalScore || Math.max(3, (dim.score || 4) - 0.2);

          // Check for perception gap
          const isGap = Math.abs(selfScore - crossScore) >= 1.0;
          const isSelfHigher = selfScore > crossScore;

          return (
            <div
              key={dim.key}
              onClick={() => onSelectDimension && onSelectDimension(dim.key)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-500/20 shadow-2xs'
                  : 'bg-white border-slate-200/80 hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{dim.label}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {dim.assessmentConfidence || 'High'}-confidence
                </span>
              </div>

              {/* 4 Signals Bar Grid */}
              <div className="space-y-2 text-xs">
                
                {/* 1. System Evidence */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 w-32 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>System Evidence</span>
                  </span>
                  {renderBlocks(systemScore, 5, 'bg-emerald-600')}
                  <span className="font-mono text-[10px] text-slate-500 w-8 text-right font-bold">
                    {systemScore.toFixed(1)}
                  </span>
                </div>

                {/* 2. Self Assessment */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 w-32 shrink-0">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Self Assessment</span>
                  </span>
                  {renderBlocks(selfScore, 5, 'bg-blue-600')}
                  <span className="font-mono text-[10px] text-slate-500 w-8 text-right font-bold">
                    {selfScore.toFixed(1)}
                  </span>
                </div>

                {/* 3. Cross-Functional */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 w-32 shrink-0">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Cross-functional</span>
                  </span>
                  {renderBlocks(crossScore, 5, 'bg-indigo-600')}
                  <span className="font-mono text-[10px] text-slate-500 w-8 text-right font-bold">
                    {crossScore.toFixed(1)}
                  </span>
                </div>

                {/* 4. Manager Signal */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 w-32 shrink-0">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>Manager Signal</span>
                  </span>
                  {renderBlocks(managerScore, 5, 'bg-slate-700')}
                  <span className="font-mono text-[10px] text-slate-500 w-8 text-right font-bold">
                    {managerScore.toFixed(1)}
                  </span>
                </div>

              </div>

              {/* Perception Gap Reflection Box (Not a judgment, a reflection opportunity) */}
              {isGap ? (
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">Perception Opportunity</span>
                    <p className="leading-relaxed">
                      {isSelfHigher 
                        ? 'Your self-assessment is higher than cross-functional signals. Consider making your technical trade-off decisions more visible to engineering partners.' 
                        : 'Peers rate your strategic influence higher than your self-score. You may be under-attributing your domain ownership.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Strong Alignment across all 4 signal sources
                  </span>
                  <span className="font-mono">Delta &lt; 0.5</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
