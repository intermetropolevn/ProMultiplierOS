import React from 'react';
import { 
  Target, 
  Search, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Hammer, 
  Award, 
  Briefcase,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { GrowthLoopStage } from '../../types/careerMission';

interface GrowthLoopVisualizerProps {
  currentStage: GrowthLoopStage;
  onSelectStage?: (stage: GrowthLoopStage) => void;
  selectedStage?: GrowthLoopStage | null;
  compact?: boolean;
}

interface StageMeta {
  key: GrowthLoopStage;
  number: number;
  label: string;
  shortLabel: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}

export const STAGES: StageMeta[] = [
  { 
    key: 'goal', 
    number: 1, 
    label: 'Target Goal', 
    shortLabel: 'Goal', 
    icon: Target, 
    description: 'Define target role, domain, and benchmark ambition' 
  },
  { 
    key: 'diagnose', 
    number: 2, 
    label: 'Diagnose Gaps', 
    shortLabel: 'Diagnose', 
    icon: Search, 
    description: 'Uncover concrete capability gaps against target role' 
  },
  { 
    key: 'learn', 
    number: 3, 
    label: 'Learn Frameworks', 
    shortLabel: 'Learn', 
    icon: BookOpen, 
    description: 'Study verified knowledge units, books, and blueprints' 
  },
  { 
    key: 'practice', 
    number: 4, 
    label: 'Practice Drills', 
    shortLabel: 'Practice', 
    icon: Sparkles, 
    description: 'Deliberate simulation, timed scenarios, and live cases' 
  },
  { 
    key: 'feedback', 
    number: 5, 
    label: 'Calibrate Feedback', 
    shortLabel: 'Feedback', 
    icon: CheckCircle2, 
    description: 'Compare with senior answer blueprints & evaluation rubrics' 
  },
  { 
    key: 'build', 
    number: 6, 
    label: 'Build Prototypes', 
    shortLabel: 'Build', 
    icon: Hammer, 
    description: 'Solve real challenges with teams in Builder Match' 
  },
  { 
    key: 'prove', 
    number: 7, 
    label: 'Prove & Ledger', 
    shortLabel: 'Prove', 
    icon: Award, 
    description: 'Log metrics ledger, verifiable outcomes, and story bank' 
  },
  { 
    key: 'opportunity', 
    number: 8, 
    label: 'Win Opportunities', 
    shortLabel: 'Opportunity', 
    icon: Briefcase, 
    description: 'Pitch to roles, venture grants, and partner programs' 
  },
];

export const GrowthLoopVisualizer: React.FC<GrowthLoopVisualizerProps> = ({
  currentStage,
  onSelectStage,
  selectedStage,
  compact = false,
}) => {
  const currentIdx = STAGES.findIndex(s => s.key === currentStage);

  if (compact) {
    return (
      <div className="w-full">
        {/* Compact horizontal track */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
          {STAGES.map((stg, idx) => {
            const Icon = stg.icon;
            const isCompleted = idx < currentIdx;
            const isCurrent = stg.key === currentStage;
            const isSelected = selectedStage === stg.key;

            return (
              <React.Fragment key={stg.key}>
                <button
                  type="button"
                  onClick={() => onSelectStage && onSelectStage(stg.key)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-2xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : isCurrent
                      ? 'bg-blue-100/90 text-blue-900 border border-blue-300 ring-2 ring-blue-500/20'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                  title={`${stg.label}: ${stg.description}`}
                >
                  <Icon className={`w-3 h-3 ${isCompleted ? 'text-emerald-600' : isCurrent ? 'text-blue-600' : ''}`} />
                  <span>{stg.shortLabel}</span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </button>

                {idx < STAGES.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Title & Loop Mantra */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            The Career OS Growth Loop
          </span>
          <p className="text-xs text-slate-600 font-medium">
            Turn your career goal into a continuous, outcome-proven progression cycle
          </p>
        </div>

        <div className="text-2xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>Active Phase: <strong>{STAGES.find(s => s.key === currentStage)?.label}</strong></span>
        </div>
      </div>

      {/* Visual Stepper Loop Track */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {STAGES.map((stg, idx) => {
          const Icon = stg.icon;
          const isCompleted = idx < currentIdx;
          const isCurrent = stg.key === currentStage;
          const isSelected = selectedStage === stg.key;

          return (
            <button
              key={stg.key}
              type="button"
              onClick={() => onSelectStage && onSelectStage(stg.key)}
              className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                  : isCurrent
                  ? 'bg-blue-50/70 border-blue-300 shadow-2xs ring-2 ring-blue-500/20'
                  : isCompleted
                  ? 'bg-white hover:bg-slate-50 border-emerald-200/80 shadow-3xs'
                  : 'bg-white/60 hover:bg-white border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    {isCompleted && !isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  <span className={`text-[10px] font-black ${
                    isSelected ? 'text-blue-100' : isCurrent ? 'text-blue-700' : 'text-slate-400'
                  }`}>
                    0{stg.number}
                  </span>
                </div>

                <div className={`text-xs font-bold leading-tight ${
                  isSelected ? 'text-white' : isCurrent ? 'text-blue-900' : isCompleted ? 'text-slate-900' : 'text-slate-700'
                }`}>
                  {stg.label}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100/60">
                <span className={`text-[10px] font-medium line-clamp-2 leading-relaxed ${
                  isSelected ? 'text-blue-100' : isCurrent ? 'text-blue-800' : 'text-slate-500'
                }`}>
                  {stg.description}
                </span>
              </div>

              {isCurrent && (
                <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full shadow-xs">
                  Active
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
