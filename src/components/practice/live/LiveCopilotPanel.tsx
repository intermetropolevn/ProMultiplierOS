import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Settings2, 
  HelpCircle, 
  BookOpen,
  Target,
  ArrowRight
} from 'lucide-react';
import { ConfiguredBlueprint } from './liveInterviewData';
import { ScannableAnswerBlueprint } from './ScannableAnswerBlueprint';

interface LiveCopilotPanelProps {
  blueprints: ConfiguredBlueprint[];
  activeBlueprintId: string | null;
  activeSpeakerId: string;
  detectedQuestionText?: string;
  currentTurnIndex?: number;
  onOpenPrepareModal: () => void;
  onSelectBlueprint?: (blueprintId: string) => void;
}

export const LiveCopilotPanel: React.FC<LiveCopilotPanelProps> = ({
  blueprints,
  activeBlueprintId,
  activeSpeakerId,
  detectedQuestionText,
  currentTurnIndex = 0,
  onOpenPrepareModal,
  onSelectBlueprint,
}) => {
  // Only the current active blueprint is expanded by default (auto-follow behavior)
  const [expandedId, setExpandedId] = useState<string | null>(activeBlueprintId);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 4. AUTO-FOLLOW CURRENT TURN:
  // When activeBlueprintId transitions, collapse previous item, expand active item,
  // and smoothly scroll it into visible viewport.
  useEffect(() => {
    if (activeBlueprintId) {
      setExpandedId(activeBlueprintId);

      // Smoothly scroll into visible container
      const timer = setTimeout(() => {
        const el = cardRefs.current[activeBlueprintId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [activeBlueprintId]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
    if (onSelectBlueprint) {
      onSelectBlueprint(id);
    }
  };

  const hasMatchedBlueprint = Boolean(
    activeBlueprintId && blueprints.some(b => b.id === activeBlueprintId)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col h-full space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Live Copilot
              </h3>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                Auto-Follow Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {blueprints.length} Q&amp;A Blueprints Loaded · Auto-following Turn #{currentTurnIndex + 1}
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
          <span>Prepare</span>
        </button>
      </div>

      {/* Blueprints Accordion Collection with Smooth Auto-Follow */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        
        {/* Subtle un-matched warning if turn has no matched blueprint */}
        {!hasMatchedBlueprint && blueprints.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
            <HelpCircle className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="font-semibold text-slate-700">No matching blueprint found</p>
            <p className="text-2xs text-slate-400 mt-0.5">
              Listening for relevant competency cues in upcoming turn...
            </p>
          </div>
        )}

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
          blueprints.map((item, idx) => {
            const isMatched = item.id === activeBlueprintId;
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={`${item.id}-${item.interviewerId}`}
                ref={el => { cardRefs.current[item.id] = el; }}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isMatched
                    ? 'border-purple-400 bg-purple-50/30 shadow-xs ring-1 ring-purple-300'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
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
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Q#{idx + 1}
                        </span>

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
                      <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-black uppercase tracking-wide animate-in fade-in">
                        Active Turn
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

                {/* Accordion Card Expanded Body with Scannable Essential Format */}
                {isExpanded && (
                  <div className="p-4 space-y-3.5 border-t border-slate-100 animate-in fade-in duration-150 bg-white">
                    {/* Target Question */}
                    <div className="p-2.5 rounded-xl bg-slate-900 text-white space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-purple-400" />
                        Target Question Prompt
                      </span>
                      <p className="text-xs font-semibold text-slate-100 leading-snug">
                        "{item.questionText}"
                      </p>
                    </div>

                    {/* Scannable Essential Rich Format */}
                    <ScannableAnswerBlueprint blueprint={item} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <span>Quiet Live Copilot</span>
        <span className="text-slate-500 font-semibold">Realtime Context Layer</span>
      </div>

    </div>
  );
};
