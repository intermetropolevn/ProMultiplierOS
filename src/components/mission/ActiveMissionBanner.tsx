import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  Maximize2, 
  Minimize2, 
  ChevronDown,
  Layers,
  Calendar,
  Compass,
  Hammer,
  BookOpen
} from 'lucide-react';
import { CareerMission, GrowthLoopStep } from '../../types/careerMission';
import { GrowthLoopVisualizer } from './GrowthLoopVisualizer';

interface ActiveMissionBannerProps {
  mission: CareerMission;
  onOpenMissionControl: () => void;
  onExecuteStep: (step: GrowthLoopStep) => void;
  onCompleteStep: (stepId: string) => void;
  className?: string;
}

export const ActiveMissionBanner: React.FC<ActiveMissionBannerProps> = ({
  mission,
  onOpenMissionControl,
  onExecuteStep,
  onCompleteStep,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Find the next best action step
  const nextAction = mission.steps.find(s => s.id === mission.nextBestActionId) 
    || mission.steps.find(s => s.status === 'in_progress' || s.status === 'pending')
    || mission.steps[0];

  const completedStepsCount = mission.steps.filter(s => s.status === 'completed').length;
  const totalStepsCount = mission.steps.length;

  return (
    <div className={`bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl text-white shadow-xl border border-blue-500/30 overflow-hidden relative transition-all ${className}`}>
      {/* Background ambient decorative glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar / Header of Banner */}
      <div className="p-4 sm:p-5 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Mission Identity & Goal */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase tracking-wider bg-blue-500/25 text-blue-200 border border-blue-400/30 shadow-xs">
                <Target className="w-3 h-3 text-blue-300" />
                Active Career Mission
              </span>
              <span className="text-2xs font-bold text-slate-300 px-2 py-0.5 rounded-md bg-white/10">
                {mission.targetRoleTitle}
              </span>
              {mission.targetDomain && (
                <span className="text-2xs text-slate-400 hidden sm:inline-block">
                  · {mission.targetDomain}
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="truncate">{mission.title}</span>
            </h2>

            <p className="text-xs text-slate-300 font-medium line-clamp-1">
              {mission.tagline}
            </p>
          </div>

          {/* Readiness Gauge & Benchmark */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0 bg-white/5 backdrop-blur-md p-3 sm:px-4 sm:py-2.5 rounded-2xl border border-white/10">
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Current Readiness
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-white">
                  {mission.currentReadiness}%
                </span>
                <span className="text-2xs font-bold text-emerald-400">
                  Target: {mission.targetReadiness}%
                </span>
              </div>
            </div>

            {/* Visual mini-radial / bar */}
            <div className="w-24 sm:w-28 space-y-1">
              <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-emerald-400 h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(mission.currentReadiness, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-right text-slate-400 font-medium">
                {completedStepsCount}/{totalStepsCount} loop milestones
              </div>
            </div>

            <div className="flex items-center gap-1.5 border-l border-white/15 pl-3">
              <button
                type="button"
                onClick={onOpenMissionControl}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102"
              >
                <span>Mission Control</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
                title={isCollapsed ? 'Expand Growth Loop' : 'Collapse Details'}
              >
                {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            NEXT BEST ACTION SPOTLIGHT CARD
            ================================================== */}
        {nextAction && !isCollapsed && (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/5 rounded-2xl p-3.5 border border-white/10">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Zap className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                    Next Best Action · Phase: {nextAction.stage.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                    +{nextAction.readinessImpact}% Readiness
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white truncate">
                  {nextAction.title}
                </h3>
                <p className="text-2xs text-slate-300 line-clamp-1">
                  {nextAction.description}
                </p>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <button
                type="button"
                onClick={() => onExecuteStep(nextAction)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:shadow-blue-500/25"
              >
                <span>{nextAction.actionCtaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onCompleteStep(nextAction.id)}
                className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-emerald-600/30 hover:border-emerald-400/40 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                title="Mark this action as completed"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Mark Done</span>
              </button>
            </div>
          </div>
        )}

        {/* Compact Growth Loop Stepper when expanded */}
        {!isCollapsed && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <GrowthLoopVisualizer 
              currentStage={mission.currentStage} 
              onSelectStage={() => onOpenMissionControl()}
              compact={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
