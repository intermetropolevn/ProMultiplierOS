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
  AlertTriangle
} from 'lucide-react';
import { 
  JobApplication, 
  ApplicationPrimaryState, 
  CANONICAL_PIPELINE_STAGES 
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
  onDelete
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start">
      {CANONICAL_PIPELINE_STAGES.map((stage, colIndex) => {
        const stageApps = applications.filter(a => (a.pipelineState || 'applied_screening') === stage.id);
        const nextStage = CANONICAL_PIPELINE_STAGES[colIndex + 1];

        return (
          <div 
            key={stage.id}
            className="bg-slate-50/80 rounded-3xl p-4 border border-slate-200/80 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    stage.id === 'applied_screening' ? 'bg-blue-500' :
                    stage.id === 'assessment_case' ? 'bg-purple-500' :
                    stage.id === 'interviews' ? 'bg-indigo-500' :
                    stage.id === 'offer_negotiation' ? 'bg-emerald-500' :
                    'bg-slate-400'
                  }`} />
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">
                    {stage.title}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {stage.description}
                </p>
              </div>

              <span className="text-xs font-black text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                {stageApps.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {stageApps.length === 0 ? (
                <div className="h-32 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-[11px] text-slate-400 font-medium text-center p-3">
                  No opportunities in this stage
                </div>
              ) : (
                stageApps.map(app => {
                  const hasCases = (app.assessmentIds && app.assessmentIds.length > 0) || (app.testAssignments && app.testAssignments.length > 0);
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
                      {/* Top badges */}
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {app.pipelineSubState?.replace(/_/g, ' ') || 'Active'}
                        </span>
                        {deadlineBadge}
                      </div>

                      {/* Company & Role */}
                      <div 
                        onClick={() => onSelectApplication(app.id)}
                        className="cursor-pointer"
                      >
                        <h5 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {app.roleTitle}
                        </h5>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span className="font-bold text-slate-700 truncate">{app.companyName}</span>
                          <span>•</span>
                          <span className="truncate">{app.location || 'Remote'}</span>
                        </div>
                      </div>

                      {/* Signals & Badges */}
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

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <button
                          onClick={() => onSelectApplication(app.id)}
                          className="text-[11px] font-bold text-slate-700 hover:text-blue-600 flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>Application Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>

                        <div className="flex items-center gap-1">
                          {nextStage && stage.id !== 'archived_closed' && (
                            <button
                              onClick={() => onQuickAdvance(app)}
                              title={`Advance to ${nextStage.title}`}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-[10px] font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}

                          <button
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
