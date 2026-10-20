import React from 'react';
import { 
  Building2, 
  Clock, 
  FileText, 
  Video, 
  ChevronRight, 
  ArrowRight, 
  MoreVertical, 
  Copy, 
  Archive, 
  Trash2, 
  Plus, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Hammer,
  Users,
  Award,
  Briefcase
} from 'lucide-react';
import { 
  JobApplication, 
  CANONICAL_PIPELINE_STAGES,
  PARTICIPATION_LIFECYCLES,
  ParticipationType
} from '../../features/applications/types';

interface PipelineBoardViewProps {
  applications: JobApplication[];
  onSelectApplication: (applicationId: string) => void;
  onOpenTransitionModal: (app: JobApplication) => void;
  onQuickAdvance: (app: JobApplication) => void;
  onAddTest: (app: JobApplication) => void;
  onScheduleInterview: (app: JobApplication) => void;
  onDuplicate: (appId: string) => void;
  onArchive: (appId: string) => void;
  onDelete: (appId: string) => void;
  categoryTab?: 'all' | 'career' | 'challenge' | 'builder' | 'mentor' | 'credential_program';
  onAdvanceStage?: (appId: string, nextStageId: string, nextStageName: string) => void;
}

export const PipelineBoardView: React.FC<PipelineBoardViewProps> = ({
  applications,
  onSelectApplication,
  onOpenTransitionModal,
  onQuickAdvance,
  onAddTest,
  onScheduleInterview,
  onDuplicate,
  onArchive,
  onDelete,
  categoryTab = 'all',
  onAdvanceStage
}) => {
  // Determine columns based on categoryTab
  const getColumns = () => {
    if (categoryTab === 'challenge') {
      return PARTICIPATION_LIFECYCLES.challenge_hackathon.stages.map(s => ({
        id: s.id,
        title: s.label,
        description: s.description,
        dotColor: s.dotColor,
        isCustomType: true,
        type: 'challenge_hackathon' as ParticipationType
      }));
    }
    if (categoryTab === 'builder') {
      return PARTICIPATION_LIFECYCLES.builder_match.stages.map(s => ({
        id: s.id,
        title: s.label,
        description: s.description,
        dotColor: s.dotColor,
        isCustomType: true,
        type: 'builder_match' as ParticipationType
      }));
    }
    if (categoryTab === 'mentor') {
      return PARTICIPATION_LIFECYCLES.mentor_mentee.stages.map(s => ({
        id: s.id,
        title: s.label,
        description: s.description,
        dotColor: s.dotColor,
        isCustomType: true,
        type: 'mentor_mentee' as ParticipationType
      }));
    }
    if (categoryTab === 'credential_program') {
      return PARTICIPATION_LIFECYCLES.credential.stages.map(s => ({
        id: s.id,
        title: s.label,
        description: s.description,
        dotColor: s.dotColor,
        isCustomType: true,
        type: 'credential' as ParticipationType
      }));
    }
    // Default: 5 Canonical stages
    return CANONICAL_PIPELINE_STAGES.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      dotColor: 
        s.id === 'applied_screening' ? 'bg-blue-500' :
        s.id === 'assessment_case' ? 'bg-purple-500' :
        s.id === 'interviews' ? 'bg-indigo-500' :
        s.id === 'offer_negotiation' ? 'bg-emerald-500' :
        'bg-slate-400',
      isCustomType: false,
      type: 'career_opportunity' as ParticipationType
    }));
  };

  const columns = getColumns();

  const getColApps = (col: typeof columns[0]) => {
    if (col.isCustomType) {
      return applications.filter(a => {
        const itemStage = a.currentStageId || a.pipelineSubState || 'applied';
        return itemStage.toLowerCase() === col.id.toLowerCase();
      });
    }
    return applications.filter(a => (a.pipelineState || 'applied_screening') === col.id);
  };

  return (
    <div className="grid grid-flow-col auto-cols-[300px] gap-4 overflow-x-auto pb-4 items-start no-scrollbar">
      {columns.map((stage, colIndex) => {
        const stageApps = getColApps(stage);
        const nextStage = columns[colIndex + 1];

        return (
          <div 
            key={stage.id}
            className="bg-slate-50/80 rounded-3xl p-4 border border-slate-200/80 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`} />
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">
                    {stage.title}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1" title={stage.description}>
                  {stage.description}
                </p>
              </div>

              <span className="text-xs font-black text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                {stageApps.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {stageApps.length === 0 ? (
                <div className="h-32 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-[11px] text-slate-400 font-medium text-center p-3">
                  No items in this stage
                </div>
              ) : (
                stageApps.map(app => {
                  const pType = app.participationType || 'career_opportunity';
                  const hasCases = Boolean(app.assessmentIds && app.assessmentIds.length > 0);
                  const hasInterviews = app.interviews && app.interviews.length > 0;
                  
                  // Compute deadline display
                  let deadlineBadge = null;
                  if (app.deadline) {
                    const diffHours = Math.round((new Date(app.deadline).getTime() - Date.now()) / 3600000);
                    const isUrgent = diffHours < 48;
                    deadlineBadge = (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isUrgent 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <Clock className="w-2.5 h-2.5" />
                        {diffHours <= 0 ? 'Overdue' : diffHours < 48 ? `${diffHours}h left` : `${Math.round(diffHours / 24)}d left`}
                      </span>
                    );
                  }

                  return (
                    <div
                      key={app.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all space-y-3 group"
                    >
                      {/* Top type & stage badge */}
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          pType === 'challenge_hackathon' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          pType === 'builder_match' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                          pType === 'mentor_mentee' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          pType === 'credential' || pType === 'learning_program' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                          'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {pType === 'challenge_hackathon' && <Trophy className="w-2.5 h-2.5 text-amber-600" />}
                          {pType === 'builder_match' && <Hammer className="w-2.5 h-2.5 text-purple-600" />}
                          {pType === 'mentor_mentee' && <Users className="w-2.5 h-2.5 text-emerald-600" />}
                          {(pType === 'credential' || pType === 'learning_program') && <Award className="w-2.5 h-2.5 text-rose-600" />}
                          {pType === 'career_opportunity' && <Briefcase className="w-2.5 h-2.5 text-blue-600" />}
                          <span>{pType.replace(/_/g, ' ')}</span>
                        </span>
                        {deadlineBadge}
                      </div>

                      {/* Title & Organization */}
                      <div 
                        onClick={() => onSelectApplication(app.id)}
                        className="cursor-pointer"
                      >
                        <h5 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {app.roleTitle}
                        </h5>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-bold text-slate-700 truncate">{app.organization || app.companyName}</span>
                          <span>•</span>
                          <span className="truncate">{app.domain || app.location || 'Remote'}</span>
                        </div>
                      </div>

                      {/* Type-specific context cards */}
                      {pType === 'mentor_mentee' && app.mentorshipData && (
                        <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-950 space-y-0.5">
                          <div className="font-bold flex items-center justify-between">
                            <span>Sessions: {app.mentorshipData.completedSessions} / {app.mentorshipData.totalSessions}</span>
                            <span className="text-[10px] text-emerald-700 font-normal">
                              {Math.round((app.mentorshipData.completedSessions / app.mentorshipData.totalSessions) * 100)}%
                            </span>
                          </div>
                          {app.mentorshipData.nextSessionDate && (
                            <p className="text-[10px] text-emerald-700">
                              Next: {new Date(app.mentorshipData.nextSessionDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </p>
                          )}
                        </div>
                      )}

                      {pType === 'challenge_hackathon' && app.hackathonData && (
                        <div className="p-2 bg-amber-50/60 rounded-xl border border-amber-100 text-[11px] text-amber-950 space-y-0.5">
                          <div className="font-bold truncate">Team: {app.hackathonData.teamName}</div>
                          {app.hackathonData.deliverables && (
                            <div className="text-[10px] text-amber-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-amber-600" />
                              <span>{app.hackathonData.deliverables.filter(d => d.completed).length}/{app.hackathonData.deliverables.length} Deliverables done</span>
                            </div>
                          )}
                        </div>
                      )}

                      {pType === 'builder_match' && app.builderMatchData && (
                        <div className="p-2 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] text-purple-950 space-y-0.5">
                          <div className="font-bold flex items-center gap-1.5">
                            {app.builderMatchData.matchedBuilderAvatar && (
                              <img src={app.builderMatchData.matchedBuilderAvatar} alt="" className="w-4 h-4 rounded-full" />
                            )}
                            <span className="truncate">{app.builderMatchData.matchedBuilderName}</span>
                          </div>
                          <p className="text-[10px] text-purple-700 truncate capitalize">
                            Status: {app.builderMatchData.collaborationStatus?.replace(/_/g, ' ') || 'Exploring'}
                          </p>
                        </div>
                      )}

                      {/* Signals & Badges for Career Opportunity */}
                      {pType === 'career_opportunity' && (
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          {hasCases && (
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              <FileText className="w-2.5 h-2.5" />
                              Case Attached
                            </span>
                          )}
                          {hasInterviews && (
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Video className="w-2.5 h-2.5" />
                              {app.interviews?.length} Interview{app.interviews && app.interviews.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectApplication(app.id)}
                          className="text-[11px] font-bold text-slate-700 hover:text-blue-600 flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>

                        <div className="flex items-center gap-1">
                          {nextStage && (
                            <button
                              type="button"
                              onClick={() => {
                                if (onAdvanceStage) {
                                  onAdvanceStage(app.id, nextStage.id, nextStage.title);
                                } else {
                                  onQuickAdvance(app);
                                }
                              }}
                              title={`Advance to ${nextStage.title}`}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-[10px] font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenTransitionModal(app)}
                            title="Change Stage / State"
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
