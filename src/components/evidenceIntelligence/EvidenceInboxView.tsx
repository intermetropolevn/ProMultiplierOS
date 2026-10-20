import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Edit3, 
  Merge, 
  Link2, 
  Plus, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Users, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { EvidenceItem } from '../../features/evidenceIntelligence/types';
import { evidenceIntelligenceStore } from '../../features/evidenceIntelligence/services/evidenceIntelligenceStore';

interface EvidenceInboxViewProps {
  inboxItems: EvidenceItem[];
  onOpenDetail: (evidence: EvidenceItem) => void;
  onOpenQuickCapture: () => void;
  onNavigateToTimeline: () => void;
}

export const EvidenceInboxView: React.FC<EvidenceInboxViewProps> = ({
  inboxItems,
  onOpenDetail,
  onOpenQuickCapture,
  onNavigateToTimeline
}) => {
  const [selectedMergeSourceId, setSelectedMergeSourceId] = useState<string | null>(null);

  const handleConfirm = (id: string) => {
    evidenceIntelligenceStore.confirmEvidence(id);
  };

  const handleDismiss = (id: string) => {
    evidenceIntelligenceStore.rejectEvidence(id);
  };

  const handleTriggerMerge = (sourceId: string, targetId: string) => {
    evidenceIntelligenceStore.mergeEvidence(sourceId, targetId);
    setSelectedMergeSourceId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Evidence Inbox
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Automatic Activity Disambiguation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Evidence Triage &amp; Detection Inbox
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              CareerOS continuously aggregates fragmented activity signals (tasks, PRDs, meetings, experiments) into unified candidate career evidence for your confirmation.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={onOpenQuickCapture}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Quick Capture</span>
            </button>
          </div>
        </div>

        {/* Triage Status Stats */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span>
              Candidate Signals Pending: <strong className="text-slate-900">{inboxItems.length}</strong>
            </span>
            <span className="text-slate-300">·</span>
            <span>
              Confirmed Signals: <strong className="text-emerald-700">{evidenceIntelligenceStore.getConfirmedEvidenceCount()}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateToTimeline}
            className="text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Verified Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Candidate Evidence Cards Stream */}
      {inboxItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Evidence Inbox Zero</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            All detected work signals have been triaged and confirmed into your permanent Career Evidence Profile.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenQuickCapture}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Log New Activity Reflection
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {inboxItems.map((item) => {
            const isMergingThis = selectedMergeSourceId === item.id;
            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
              >
                {/* Card Top Strip */}
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 font-mono">
                      Potential Evidence Detected
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-medium">
                      Confidence: <strong className="text-emerald-700">{item.evidenceConfidence}%</strong>
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    Detected {item.date}
                  </span>
                </div>

                {/* Card Body (Matches Section 3 layout) */}
                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* Initiative Title & Source Counts */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {item.linkedInitiativeTitle.toUpperCase()}
                    </h3>

                    {/* Detected from activity breakdown */}
                    {item.detectedActivitiesSummary && (
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap font-medium">
                        <span>Detected from:</span>
                        <span className="font-bold text-slate-800">{item.detectedActivitiesSummary.tasks} Tasks</span>
                        <span>·</span>
                        <span className="font-bold text-slate-800">{item.detectedActivitiesSummary.documents} Docs</span>
                        <span>·</span>
                        <span className="font-bold text-slate-800">{item.detectedActivitiesSummary.meetings} Meetings</span>
                        <span>·</span>
                        <span className="font-bold text-slate-800">{item.detectedActivitiesSummary.experiments} Experiments</span>
                      </div>
                    )}
                  </div>

                  {/* Potential Capabilities */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Potential Capabilities Demonstrated:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.capabilityLabels.map((cap, i) => (
                        <span 
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold"
                        >
                          • {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Evidence Text Box */}
                  <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Suggested Career Evidence:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      &ldquo;{item.description}&rdquo;
                    </p>
                  </div>

                  {/* Primary & Secondary Actions Strip */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                    
                    {/* Secondary Actions */}
                    <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-600">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(item)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Edit Evidence Attributes"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMergeSourceId(isMergingThis ? null : item.id)}
                        className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                          isMergingThis ? 'bg-purple-100 text-purple-800' : 'hover:bg-slate-100'
                        }`}
                        title="Merge with existing evidence"
                      >
                        <Merge className="w-3.5 h-3.5 text-slate-500" />
                        <span>Merge</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenDetail(item)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Add missing quantitative outcome"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                        <span>Add Outcome</span>
                      </button>
                    </div>

                    {/* Primary CTA Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleDismiss(item.id)}
                        className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Dismiss
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConfirm(item.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Evidence</span>
                      </button>
                    </div>

                  </div>

                  {/* Merge Selection Drawer */}
                  {isMergingThis && (
                    <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2 text-xs">
                      <span className="font-bold text-purple-900 block">
                        Select an existing initiative or evidence to merge into:
                      </span>
                      <div className="space-y-1">
                        {inboxItems.filter(other => other.id !== item.id).map(target => (
                          <button
                            key={target.id}
                            type="button"
                            onClick={() => handleTriggerMerge(item.id, target.id)}
                            className="w-full text-left p-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-100 text-slate-800 font-medium flex items-center justify-between"
                          >
                            <span>Merge into: {target.title}</span>
                            <ArrowRight className="w-3 h-3 text-purple-600" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
