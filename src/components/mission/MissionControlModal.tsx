import React, { useState } from 'react';
import { 
  X, 
  Target, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Hammer, 
  Award, 
  Briefcase, 
  Search, 
  ChevronRight, 
  Plus, 
  RotateCcw, 
  Layers, 
  Filter,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Check
} from 'lucide-react';
import { 
  CareerMission, 
  GrowthLoopStep, 
  MissionCapabilityGap, 
  GrowthLoopStage 
} from '../../types/careerMission';
import { GrowthLoopVisualizer, STAGES } from './GrowthLoopVisualizer';

interface MissionControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: CareerMission;
  allMissions: CareerMission[];
  onSelectMission: (missionId: string) => void;
  onOpenCreateMission: () => void;
  onExecuteStep: (step: GrowthLoopStep) => void;
  onCompleteStep: (stepId: string) => void;
  onSkipStep: (stepId: string) => void;
  onGetFeedback?: (context?: any) => void;
}

export const MissionControlModal: React.FC<MissionControlModalProps> = ({
  isOpen,
  onClose,
  mission,
  allMissions,
  onSelectMission,
  onOpenCreateMission,
  onExecuteStep,
  onCompleteStep,
  onSkipStep,
  onGetFeedback,
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<GrowthLoopStage | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'loop' | 'gaps' | 'evidence'>('loop');
  const [isMissionDropdownOpen, setIsMissionDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const nextAction = mission.steps.find(s => s.id === mission.nextBestActionId)
    || mission.steps.find(s => s.status === 'in_progress' || s.status === 'pending')
    || mission.steps[0];

  const filteredSteps = selectedStageFilter === 'all'
    ? mission.steps
    : mission.steps.filter(s => s.stage === selectedStageFilter);

  const completedCount = mission.steps.filter(s => s.status === 'completed').length;
  const totalCount = mission.steps.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* ==================================================
            1. TOP HEADER & MISSION SWITCHER
            ================================================== */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Career Mission Control
              </span>
              <span className="text-2xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                Horizon: {mission.missionHorizon.replace('_', ' ')}
              </span>
            </div>

            {/* Mission Switcher Dropdown */}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setIsMissionDropdownOpen(!isMissionDropdownOpen)}
                className="flex items-center gap-2 text-left group cursor-pointer focus:outline-hidden"
              >
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  {mission.title}
                </h1>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform" />
              </button>

              {isMissionDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 space-y-1 animate-in fade-in slide-in-from-top-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Select Career Mission
                  </div>
                  {allMissions.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onSelectMission(m.id);
                        setIsMissionDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        m.id === mission.id ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{m.title}</div>
                        <div className="text-2xs text-slate-500">{m.targetRoleTitle} · {m.currentReadiness}% readiness</div>
                      </div>
                      {m.id === mission.id && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMissionDropdownOpen(false);
                        onOpenCreateMission();
                      }}
                      className="w-full text-left p-2 rounded-xl text-blue-600 hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New Mission</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Target Role: <strong className="text-slate-800">{mission.targetRoleTitle}</strong> ({mission.targetDomain})
            </p>
          </div>

          {/* Readiness gauge pill */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Readiness Score
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">
                  {mission.currentReadiness}%
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  / {mission.targetReadiness}% goal
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================================================
            2. NAV SUB-TABS (Growth Loop | Capability Gaps | Evidence)
            ================================================== */}
        <div className="px-6 border-b border-slate-100 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('loop')}
              className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'loop'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Growth Loop Journey ({completedCount}/{totalCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gaps')}
              className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'gaps'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Capability Gaps ({mission.capabilityGaps.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('evidence')}
              className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'evidence'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Evidence &amp; Artifacts ({mission.evidenceIds.length + mission.completedBuildIds.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenCreateMission}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Mission</span>
          </button>
        </div>

        {/* ==================================================
            3. SCROLLABLE CONTENT BODY
            ================================================== */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* TAB 1: GROWTH LOOP JOURNEY */}
          {activeTab === 'loop' && (
            <div className="space-y-6">
              
              {/* Full Growth Loop Stepper */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <GrowthLoopVisualizer
                  currentStage={mission.currentStage}
                  selectedStage={selectedStageFilter === 'all' ? null : selectedStageFilter}
                  onSelectStage={(stage) => {
                    setSelectedStageFilter(selectedStageFilter === stage ? 'all' : stage);
                  }}
                />
              </div>

              {/* NEXT BEST ACTION HERO CARD */}
              {nextAction && (
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-amber-300" />
                          Recommended Next Best Action
                        </span>
                        <span className="text-2xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          +{nextAction.readinessImpact}% Readiness Lift
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-white">
                        {nextAction.title}
                      </h3>

                      <p className="text-xs text-blue-100/90 leading-relaxed">
                        {nextAction.description}
                      </p>

                      {nextAction.contextHint && (
                        <div className="text-2xs text-blue-200 font-medium pt-1 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{nextAction.contextHint}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-row md:flex-col items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onExecuteStep(nextAction);
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{nextAction.actionCtaLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onCompleteStep(nextAction.id)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark as Done</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* READY FOR FEEDBACK CALLOUT (Requirement 2: From Career Mission) */}
              {onGetFeedback && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-500/30 shadow-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                        Growth Loop · Stage 5 Feedback
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-white">
                      Ready for feedback?
                    </h4>
                    <p className="text-2xs text-blue-200">
                      Submit your practice outputs to AI and experienced practitioners to stress-test your trade-offs before building evidence.
                    </p>
                  </div>

                  <button
                    type="button"
                    id="btn-mission-get-feedback"
                    onClick={() => {
                      onClose();
                      onGetFeedback({
                        careerGoal: mission.title,
                        targetRole: mission.targetRoleTitle,
                        relevantCapability: mission.capabilityGaps[0]?.capability || 'Product Strategy',
                        workSubmittedTitle: `${mission.title}: Practice Case Output`,
                        workSubmittedContent: `Problem Framing: Enterprise trial activation dropped from 31% to 19% following permissions redesign.\nDiagnosis: Self-serve teams were blocked by IT admin gatekeeping before value discovery.\nStrategic Intervention: Progressive sandbox permission staging + 2-minute IT SOC2 compliance audit exports.\nTarget Metrics: 28% trial activation recovery within 30 days.`,
                        sourceType: 'mission',
                        sourceId: mission.id,
                        readinessScore: mission.currentReadiness,
                        knownSkillGaps: mission.capabilityGaps.map(g => g.capability)
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4 fill-slate-900" />
                    <span>Get Feedback</span>
                  </button>
                </div>
              )}

              {/* ACTION PLAN SEQUENCE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Growth Loop Action Steps</h3>
                    <p className="text-2xs text-slate-500">
                      Sequential progression from diagnosis to tangible opportunities
                    </p>
                  </div>

                  {/* Filter chips */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedStageFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                        selectedStageFilter === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      All ({mission.steps.length})
                    </button>
                    {selectedStageFilter !== 'all' && (
                      <span className="text-2xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                        Filtering: {selectedStageFilter}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {filteredSteps.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.id === mission.nextBestActionId;

                    return (
                      <div
                        key={step.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCompleted
                            ? 'bg-slate-50/60 border-slate-200/70 opacity-80'
                            : isCurrent
                            ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-400/30 shadow-2xs'
                            : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-3xs'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => onCompleteStep(step.id)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-400 hover:text-emerald-700 border border-slate-200'
                            }`}
                            title={isCompleted ? 'Completed' : 'Click to mark complete'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                                Stage: {step.stage}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                +{step.readinessImpact}%
                              </span>
                              {step.estimatedMinutes && (
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {step.estimatedMinutes} min
                                </span>
                              )}
                            </div>

                            <h4 className={`text-xs font-bold ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                              {step.title}
                            </h4>

                            <p className="text-2xs text-slate-500 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        {/* CTA button */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          {!isCompleted && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                if ((step.stage === 'feedback' || step.actionType === 'feedback_review') && onGetFeedback) {
                                  onGetFeedback({
                                    careerGoal: mission.title,
                                    targetRole: mission.targetRoleTitle,
                                    relevantCapability: mission.capabilityGaps[0]?.capability || 'Product Strategy',
                                    workSubmittedTitle: `${mission.title}: ${step.title}`,
                                    workSubmittedContent: `Practice Drill Output for ${mission.targetRoleTitle}:\n\nProposed strategic solution addressing activation drop and governance requirements with measurable target outcomes.`,
                                    sourceType: 'mission',
                                    sourceId: step.id,
                                    readinessScore: mission.currentReadiness,
                                    knownSkillGaps: mission.capabilityGaps.map(g => g.capability)
                                  });
                                } else {
                                  onExecuteStep(step);
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>{step.actionCtaLabel}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {isCompleted && (
                            <span className="text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAPABILITY GAPS */}
          {activeTab === 'gaps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Diagnosed Capability Gaps</h3>
                  <p className="text-2xs text-slate-500">
                    High-leverage gaps calibrated against {mission.targetRoleTitle} standards
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mission.capabilityGaps.map(gap => (
                  <div 
                    key={gap.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          gap.gapSeverity === 'high'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : gap.gapSeverity === 'medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {gap.gapSeverity.toUpperCase()} PRIORITY GAP
                        </span>
                        <span className="text-2xs font-bold text-slate-500 uppercase">
                          {gap.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {gap.capability}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {gap.rationale}
                      </p>

                      {/* Level Calibration Bars */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-2xs font-semibold text-slate-600">
                          <span>Current Level: L{gap.currentLevel}</span>
                          <span className="text-blue-700 font-bold">Target Level: L{gap.targetLevel}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${(gap.currentLevel / gap.targetLevel) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-2xs font-semibold text-slate-500 mb-1.5">
                        Recommended Action:
                      </div>
                      <p className="text-xs text-slate-700 font-medium">
                        {gap.recommendedAction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE & ARTIFACTS */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Mission Evidence Ledger</h3>
                <p className="text-2xs text-slate-500">
                  Tangible artifacts, prototypes, and blueprints proving readiness for this mission
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Acme Cloud Activation &amp; Permission Prototype
                  </h4>
                  <p className="text-2xs text-slate-500">
                    Built via Builder Match strike team. Implemented progressive permission staging with verified +12% trial retention.
                  </p>
                  <span className="text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                    Verified Artifact
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Agentic Evaluation Quality Rubric
                  </h4>
                  <p className="text-2xs text-slate-500">
                    Mastered comprehensive LLM evaluation methodology. Documented ground-truth latency budgets in Answer Blueprints.
                  </p>
                  <span className="text-2xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                    Blueprint Linked
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ==================================================
            4. FOOTER ACTIONS
            ================================================== */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <div className="text-2xs text-slate-500 hidden sm:block">
            Created on {new Date(mission.createdAt).toLocaleDateString()} · Auto-synced with Career Profile
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>

            {nextAction && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExecuteStep(nextAction);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Execute Next Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
