import React, { useState } from 'react';
import { 
  HelpCircle, 
  Lightbulb, 
  Layers, 
  CheckSquare, 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Clock, 
  Sparkles,
  Target
} from 'lucide-react';
import { InterviewQuestion } from '../../../types';

interface MockGuidancePanelProps {
  question: InterviewQuestion;
  framework?: string;
  hints?: string[];
  dimensionsTested?: string[];
  timeRecommendationMinutes?: number;
}

export const MockGuidancePanel: React.FC<MockGuidancePanelProps> = ({
  question,
  framework = 'STAR-T (Situation, Task, Action, Trade-off, Result)',
  hints,
  dimensionsTested = ['Structured Problem Solving', 'Communication Clarity', 'Technical Trade-offs', 'Measurable Impact'],
  timeRecommendationMinutes = 3,
}) => {
  // Progressive guidance levels: 1 = Hint, 2 = Framework, 3 = Deeper Guidance
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);

  const defaultHints = hints && hints.length > 0 ? hints : [
    'Frame the technical or business problem with clear constraints before discussing solutions.',
    'Focus on your specific decisions and trade-offs, rather than speaking generically about the team.',
    'Anchor your answer with measurable outcomes or failure-mode prevention metrics.'
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col h-full space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/60">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Practice Guidance
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Progressive hints &amp; interview frameworks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Target: ~{timeRecommendationMinutes} min</span>
        </div>
      </div>

      {/* Progressive Step Tracker */}
      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between text-xs shrink-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          Disclosure Level
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setUnlockedLevel(1)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
              unlockedLevel >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            1. Hint
          </button>
          <span className="text-slate-300">→</span>
          <button
            type="button"
            onClick={() => setUnlockedLevel(prev => Math.max(prev, 2))}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
              unlockedLevel >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            2. Framework
          </button>
          <span className="text-slate-300">→</span>
          <button
            type="button"
            onClick={() => setUnlockedLevel(3)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
              unlockedLevel >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            3. Deep Checklist
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
        
        {/* What the question is testing */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            What Interviewers Evaluate
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {dimensionsTested.map((dim, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold">
                {dim}
              </span>
            ))}
          </div>
        </div>

        {/* Level 1: HINT (Always unlocked or level 1) */}
        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
              Level 1: Core Hint
            </span>
            <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-1.5 py-0.2 rounded">
              Unlocked
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {defaultHints[0]}
          </p>
        </div>

        {/* Level 2: SUGGESTED FRAMEWORK */}
        {unlockedLevel < 2 ? (
          <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-semibold">Level 2: Suggested Response Framework</span>
            </div>
            <button
              type="button"
              onClick={() => setUnlockedLevel(2)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Reveal Framework
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                Level 2: Suggested Framework
              </span>
              <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 py-0.2 rounded">
                Unlocked
              </span>
            </div>
            <p className="text-xs font-bold text-purple-950">
              {framework}
            </p>
            <div className="text-[11px] text-slate-600 space-y-1 pt-1">
              <p>• <strong>Situation:</strong> Context, scale, and problem statement.</p>
              <p>• <strong>Task:</strong> Your specific responsibility and deliverables.</p>
              <p>• <strong>Action:</strong> Engineering/product execution &amp; decision logic.</p>
              <p>• <strong>Trade-off:</strong> What you balanced (latency vs cost, speed vs safety).</p>
              <p>• <strong>Result:</strong> Quantitative impact &amp; long-term durability.</p>
            </div>
          </div>
        )}

        {/* Level 3: DEEP GUIDANCE / COVERAGE CHECKLIST */}
        {unlockedLevel < 3 ? (
          <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-semibold">Level 3: Comprehensive Coverage Checklist</span>
            </div>
            <button
              type="button"
              onClick={() => setUnlockedLevel(3)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Reveal Checklist
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                Level 3: Deep Coverage Checklist
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                Full Guidance
              </span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Did you mention the baseline metric before the intervention?</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Did you explain why alternative options were discarded?</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Did you specify stakeholder consensus building steps?</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Are numbers specific (e.g. 14ms latency, $4k/month, 0 downtime)?</span>
              </li>
            </ul>
          </div>
        )}

      </div>

      {/* Footer advice */}
      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center shrink-0">
        Progressive hints train your natural recall under realistic interview timing.
      </div>

    </div>
  );
};
