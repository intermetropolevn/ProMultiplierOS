import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  Calendar, 
  ExternalLink, 
  ChevronRight, 
  FileText, 
  Video, 
  CheckSquare, 
  Building2,
  Sparkles
} from 'lucide-react';
import { UpcomingDeadlineItem } from '../../features/applications/types';

interface UpcomingDeadlinesWidgetProps {
  deadlines: UpcomingDeadlineItem[];
  onOpenWorkspace?: (applicationId: string) => void;
  onSelectAction?: (applicationId: string, item: UpcomingDeadlineItem) => void;
  onAddTestAssignment?: () => void;
}

export const UpcomingDeadlinesWidget: React.FC<UpcomingDeadlinesWidgetProps> = ({
  deadlines,
  onOpenWorkspace,
  onSelectAction,
  onAddTestAssignment
}) => {
  const [filter, setFilter] = useState<'ALL' | 'TEST_ASSIGNMENT' | 'INTERVIEW' | 'PREPARATION_TASK'>('ALL');
  const [isExpanded, setIsExpanded] = useState(true);

  const filtered = deadlines.filter(d => {
    if (filter === 'ALL') return true;
    return d.sourceType === filter;
  });

  const highUrgencyCount = deadlines.filter(d => d.urgency === 'HIGH').length;

  if (deadlines.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-linear-to-r from-amber-50/50 via-white to-blue-50/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/50">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Upcoming Deadlines & Time-Sensitive Commitments
              </h3>
              {highUrgencyCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  {highUrgencyCount} Urgent (&lt;48h)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Prioritized test assignments, scheduled interviews, and preparation milestones across your pipeline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl text-[11px] font-bold">
            {[
              { id: 'ALL', label: `All (${deadlines.length})` },
              { id: 'TEST_ASSIGNMENT', label: 'Tests & Cases' },
              { id: 'INTERVIEW', label: 'Interviews' },
              { id: 'PREPARATION_TASK', label: 'Tasks' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* List */}
      {isExpanded && (
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No items matching this category filter.
            </div>
          ) : (
            filtered.map(item => {
              const isHighUrgency = item.urgency === 'HIGH';
              const isInterview = item.sourceType === 'INTERVIEW';
              const isTest = item.sourceType === 'TEST_ASSIGNMENT';

              return (
                <div 
                  key={item.id}
                  className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/80 ${
                    isHighUrgency ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isTest 
                        ? 'bg-purple-100 text-purple-700' 
                        : isInterview 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {isTest && <FileText className="w-4 h-4" />}
                      {isInterview && <Video className="w-4 h-4" />}
                      {!isTest && !isInterview && <CheckSquare className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-slate-900 truncate">
                          {item.itemTitle}
                        </span>
                        
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-md ${
                          isTest 
                            ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                            : isInterview 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {item.categoryOrSubtype}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {item.companyName}
                        </span>
                        <span>•</span>
                        <span className="text-slate-500 truncate">{item.applicationTitle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Countdown & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-xl ${
                        isHighUrgency
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : item.urgency === 'MODERATE'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>
                          {item.hoursRemaining <= 0
                            ? 'Overdue'
                            : item.hoursRemaining < 48
                            ? `Due in ${item.hoursRemaining} hours`
                            : `Due in ${item.daysRemaining} days`}
                        </span>
                      </div>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {new Date(item.dueAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {(() => {
                      let actionLabel = 'Review & Prepare';
                      if (item.sourceType === 'TEST_ASSIGNMENT') {
                        actionLabel = 'Prepare Test';
                      } else if (item.sourceType === 'INTERVIEW') {
                        actionLabel = 'Prepare Interview';
                      } else if (item.sourceType === 'PREPARATION_TASK') {
                        actionLabel = 'Complete Task';
                      } else if (item.hoursRemaining <= 48) {
                        actionLabel = 'Review & Prepare';
                      }

                      return (
                        <button
                          onClick={() => {
                            if (onSelectAction) {
                              onSelectAction(item.applicationId, item);
                            } else if (onOpenWorkspace) {
                              onOpenWorkspace(item.applicationId);
                            }
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
                        >
                          <span>{actionLabel}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
