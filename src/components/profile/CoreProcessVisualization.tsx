import React from 'react';
import { 
  UserCheck, 
  Compass, 
  Sparkles, 
  BookOpen, 
  Mic2, 
  Send, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export type CareerProcessStage = 
  | 'build_profile'
  | 'discover'
  | 'assess_fit'
  | 'prepare'
  | 'practice'
  | 'apply'
  | 'track_progress';

interface CoreProcessVisualizationProps {
  currentStage?: CareerProcessStage;
  onNavigateStage?: (stage: CareerProcessStage) => void;
}

const STAGES = [
  {
    id: 'build_profile' as CareerProcessStage,
    label: 'Build Profile',
    subtext: 'Evidence & Skills',
    icon: UserCheck,
    tab: 'profile',
  },
  {
    id: 'discover' as CareerProcessStage,
    label: 'Discover Opportunities',
    subtext: 'Market Intelligence',
    icon: Compass,
    tab: 'discover',
  },
  {
    id: 'assess_fit' as CareerProcessStage,
    label: 'Assess Fit',
    subtext: 'Calibration Score',
    icon: Sparkles,
    tab: 'discover',
  },
  {
    id: 'prepare' as CareerProcessStage,
    label: 'Prepare',
    subtext: 'Q&A Blueprints & Cases',
    icon: BookOpen,
    tab: 'knowledge',
  },
  {
    id: 'practice' as CareerProcessStage,
    label: 'Practice',
    subtext: 'Live AI Simulation',
    icon: Mic2,
    tab: 'practice',
  },
  {
    id: 'apply' as CareerProcessStage,
    label: 'Apply',
    subtext: 'Outreach & Submission',
    icon: Send,
    tab: 'tracker',
  },
  {
    id: 'track_progress' as CareerProcessStage,
    label: 'Track Progress',
    subtext: 'Offers & Velocity',
    icon: CheckCircle2,
    tab: 'tracker',
  },
];

export const CoreProcessVisualization: React.FC<CoreProcessVisualizationProps> = ({
  currentStage = 'prepare',
  onNavigateStage,
}) => {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Core Lifecycle
            </span>
            <h3 className="text-sm font-bold text-slate-900">Career Operating System Workflow</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            How Career OS transforms your raw work evidence into calibrated interview performance and job offers.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-200"></span> Current Active
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span> Upcoming
          </span>
        </div>
      </div>

      {/* Progress Flow Pipeline */}
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;

            return (
              <button
                key={stage.id}
                id={`process-stage-${stage.id}`}
                onClick={() => onNavigateStage?.(stage.id)}
                className={`group relative text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isCurrent 
                    ? 'bg-blue-50/70 border-blue-500/80 shadow-xs ring-2 ring-blue-500/20' 
                    : isCompleted
                      ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/80'
                      : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-400 group-hover:text-slate-600'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-2xs font-mono font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="font-semibold text-xs text-slate-900 leading-tight">
                    {stage.label}
                  </div>
                  <div className="text-2xs text-slate-500 mt-0.5 line-clamp-1">
                    {stage.subtext}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-2xs">
                  <span className={`font-semibold ${
                    isCurrent ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {isCurrent ? 'Current' : isCompleted ? 'Verified' : 'Target'}
                  </span>
                  <ChevronRight className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
