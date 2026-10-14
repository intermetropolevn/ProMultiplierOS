import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  CheckCircle2, 
  Settings2, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { ConfiguredBlueprint } from './liveInterviewData';

interface LiveCopilotPanelProps {
  blueprints: ConfiguredBlueprint[];
  activeBlueprintId: string | null;
  activeSpeakerId: string;
  detectedQuestionText?: string;
  onOpenPrepareModal: () => void;
  onSelectBlueprint?: (blueprintId: string) => void;
}

export const LiveCopilotPanel: React.FC<LiveCopilotPanelProps> = ({
  blueprints,
  activeBlueprintId,
  activeSpeakerId,
  detectedQuestionText,
  onOpenPrepareModal,
  onSelectBlueprint,
}) => {
  // Store expanded state per blueprint ID
  const [expandedBlueprintIds, setExpandedBlueprintIds] = useState<Record<string, boolean>>({});

  // When activeBlueprintId changes, auto-expand the active one
  useEffect(() => {
    if (activeBlueprintId) {
      setExpandedBlueprintIds(prev => ({
        ...prev,
        [activeBlueprintId]: true
      }));
    }
  }, [activeBlueprintId]);

  const toggleExpand = (id: string) => {
    setExpandedBlueprintIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    if (onSelectBlueprint) {
      onSelectBlueprint(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col h-full space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Live Copilot
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {blueprints.length} Q&amp;A Blueprints Loaded
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPrepareModal}
          className="text-xs font-bold text-slate-700 hover:text-purple-700 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          title="Configure Interviewers & Blueprints"
        >
          <Settings2 className="w-3.5 h-3.5 text-purple-600" />
          <span>Prepare Interview</span>
        </button>
      </div>

      {/* Blueprints Accordion Collection */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {blueprints.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">No Blueprints Loaded</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Click "Prepare Interview" to configure interviewers and load role-aligned Q&amp;A blueprints.
            </p>
            <button
              type="button"
              onClick={onOpenPrepareModal}
              className="mt-3 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              Configure Q&amp;A Blueprints
            </button>
          </div>
        ) : (
          blueprints.map((item) => {
            const isMatched = item.id === activeBlueprintId;
            const isExpanded = !!expandedBlueprintIds[item.id] || (isMatched && expandedBlueprintIds[item.id] !== false);

            return (
              <div
                key={`${item.id}-${item.interviewerId}`}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isMatched
                    ? 'border-purple-400 bg-purple-50/40 shadow-xs ring-1 ring-purple-300'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Accordion Card Header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                    isMatched ? 'bg-purple-50/70' : 'bg-slate-50/40 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      isMatched ? 'bg-purple-600 ring-2 ring-purple-300 animate-pulse' : 'bg-slate-300'
                    }`} />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`text-xs font-black truncate ${
                          isMatched ? 'text-purple-950' : 'text-slate-800'
                        }`}>
                          {item.title}
                        </h4>

                        <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold shrink-0">
                          {item.matchScore}% Match
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        Interviewer: <strong className="text-slate-700">{item.interviewerName}</strong> • {item.interviewerRole}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isMatched && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-black uppercase tracking-wide">
                        Active Match
                      </span>
                    )}

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Accordion Card Expanded Body */}
                {isExpanded && (
                  <div className="p-4 space-y-3.5 border-t border-slate-100 text-xs animate-in fade-in duration-150 bg-white">
                    
                    {/* Target Question */}
                    <div className="p-2.5 rounded-xl bg-slate-900 text-white space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-purple-400" />
                        Target Question
                      </span>
                      <p className="text-xs font-medium text-slate-100 leading-snug">
                        "{item.questionText}"
                      </p>
                    </div>

                    {/* Custom Structure Layout vs Standard Framework */}
                    {item.blueprint.framework === 'Custom Structure' ? (
                      <div className="space-y-2.5">
                        {(item.canonicalBlueprint?.components?.context || item.blueprint.situation) && (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                              Context (Optional)
                            </span>
                            <p className="text-slate-700 leading-relaxed">
                              {item.canonicalBlueprint?.components?.context || item.blueprint.situation}
                            </p>
                          </div>
                        )}

                        <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900 block">
                            Solution &amp; Impact
                          </span>
                          <p className="text-slate-800 leading-relaxed">
                            {item.canonicalBlueprint?.components?.solutionAndImpact || item.blueprint.action.join(' ') || item.blueprint.result.join(' ')}
                          </p>
                        </div>

                        {item.blueprint.metrics && item.blueprint.metrics.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                              Evidence Metrics
                            </span>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {item.blueprint.metrics.map((m, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-white text-emerald-900 border border-emerald-200 text-[10px] font-bold"
                                >
                                  ✓ {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {/* Situation & Context */}
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                            Situation &amp; Context
                          </span>
                          <p className="text-slate-700 leading-relaxed">
                            {item.blueprint.situation}
                          </p>
                        </div>

                        {/* Key Actions & Talking Points */}
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 block">
                            Key Talking Points &amp; Actions
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                            {item.blueprint.action.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Trade-offs & Decisions */}
                        {item.blueprint.tradeoffs && item.blueprint.tradeoffs.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
                              Key Trade-off Evaluated
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-amber-950 font-medium">
                              {item.blueprint.tradeoffs.map((t, i) => (
                                <li key={i}>{t}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Result & Evidence Metrics */}
                        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                            Result &amp; Evidence Metrics
                          </span>
                          <p className="text-emerald-950 font-medium leading-relaxed">
                            {item.blueprint.result.join(' ')}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.blueprint.metrics.map((m, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-white text-emerald-900 border border-emerald-200 text-[10px] font-bold"
                              >
                                ✓ {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Framework Note */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Framework: {item.blueprint.framework}</span>
                      <span>Target: {item.blueprint.targetDuration}</span>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Quiet Reassurance */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <span>Quiet Live Copilot</span>
        <span className="text-slate-500 font-semibold">Realtime Context Layer</span>
      </div>

    </div>
  );
};
