import React from 'react';
import { X, Sparkles, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';
import { InterviewQuestion } from '../../types';

interface AnswerBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: InterviewQuestion;
  matchPct?: number;
  intent?: string;
  blueprint?: {
    directAnswer?: string;
    situation?: string;
    action?: string[];
    tradeOff?: string;
    metrics?: string[];
    pitfalls?: string[];
  };
}

export const AnswerBlueprintModal: React.FC<AnswerBlueprintModalProps> = ({
  isOpen,
  onClose,
  question,
  matchPct = 94,
  intent = 'Behavioral / Stakeholder Conflict',
  blueprint,
}) => {
  if (!isOpen) return null;

  // Derive sensible default blueprint fields from the question if not provided
  const directAnswer = blueprint?.directAnswer || 
    (question.exemplaryModelAnswer 
      ? question.exemplaryModelAnswer.split('.').slice(0, 2).join('.') + '.'
      : 'Address the core conflict directly by framing it around shared engineering and user impact metrics rather than personal authority.');

  const situation = blueprint?.situation || question.context || 
    'Facing opposing viewpoints on architectural tradeoffs with a senior partner or engineer under delivery pressure.';

  const actions = blueprint?.action && blueprint.action.length > 0 
    ? blueprint.action 
    : [
        'Isolated root disagreement into measurable benchmarks rather than theoretical paradigms.',
        'Organized a time-boxed spike to validate performance, developer ergonomics, and failure domains.',
        'Collaborated on explicit criteria for rollback and operational telemetry.'
      ];

  const tradeOff = blueprint?.tradeOff || 
    'Sacrificed short-term speed of implementation to achieve strict zero-downtime database consistency and auditability.';

  const metrics = blueprint?.metrics && blueprint.metrics.length > 0
    ? blueprint.metrics
    : [
        '12M customer records synchronized with 0 seconds unplanned downtime',
        '35% reduction in API response latency (p99 from 480ms to 310ms)',
        '100% stakeholder sign-off prior to scheduled production cutover'
      ];

  const pitfalls = blueprint?.pitfalls && blueprint.pitfalls.length > 0
    ? blueprint.pitfalls
    : [
        'Avoid making it sound like a personal or emotional victory over a colleague.',
        'Do not gloss over the genuine merits of the opposing approach.',
        'Ensure measurable outcomes are explicitly articulated.'
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="blueprint-modal-title"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                ANSWER BLUEPRINT
              </span>
              <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                ● {matchPct}% Match
              </span>
            </div>
            <h3 id="blueprint-modal-title" className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {intent}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Close blueprint"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guidance Notice */}
        <div className="px-6 py-2.5 bg-amber-50/90 border-b border-amber-200/80 flex items-center gap-2 text-xs font-medium text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Scaffolding only:</strong> Candidate must formulate and deliver their own response. The blueprint is not automatically inserted into the answer box.
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-slate-800">
          
          {/* Question Reference */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              QUESTION CONTEXT
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed">
              &ldquo;{question.question}&rdquo;
            </p>
          </div>

          {/* 1. Direct Opening / Headline */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              1. Direct Opening / Headline Answer
            </span>
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
              {directAnswer}
            </div>
          </div>

          {/* 2. Situation & Technical Constraints */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              2. Situation & System Constraints
            </span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {situation}
            </div>
          </div>

          {/* 3. Core Actions & Scaffolding */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              3. Recommended Technical / Leadership Actions
            </span>
            <div className="space-y-2">
              {actions.map((act, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. The Trade-off (Critical for Intent) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                4. The Critical Trade-off
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                High Caliber Signal
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs font-medium text-amber-950 leading-relaxed">
              {tradeOff}
            </div>
          </div>

          {/* 5. Quantifiable Production Metrics */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              5. Measurable Outcomes & Metrics
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {metrics.map((met, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{met}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Interviewer Traps & Watchouts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 block">
              6. Pitfalls & Anti-Patterns to Avoid
            </span>
            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1.5 text-xs text-rose-900">
              {pitfalls.map((pitfall, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{pitfall}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Formulate your answer verbally or in the candidate text area.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Got it, Return to Answer Box
          </button>
        </div>
      </div>
    </div>
  );
};
