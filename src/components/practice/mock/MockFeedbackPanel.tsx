import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight, 
  RotateCcw, 
  Eye, 
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { AnswerEvaluation } from '../../../types';

interface MockFeedbackPanelProps {
  evaluation: AnswerEvaluation;
  onImproveAnswer: () => void;
  onShowExample: () => void;
  onContinueNext: () => void;
  isLastQuestion?: boolean;
}

export const MockFeedbackPanel: React.FC<MockFeedbackPanelProps> = ({
  evaluation,
  onImproveAnswer,
  onShowExample,
  onContinueNext,
  isLastQuestion = false,
}) => {
  const getRatingBadgeClass = (tier: string) => {
    switch (tier) {
      case 'Exceptional':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Strong':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Competent':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col h-full space-y-4">
      
      {/* Header with Score & Tier */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-2xs">
            {evaluation.score}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Evaluation &amp; Feedback
            </div>
            <div className="text-xs font-bold text-slate-900">
              Calibration Score: {evaluation.score}/100
            </div>
          </div>
        </div>

        <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg border ${getRatingBadgeClass(evaluation.ratingTier)}`}>
          {evaluation.ratingTier}
        </span>
      </div>

      {/* Scrollable Feedback Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        
        {/* Detailed Feedback Statement */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
            Executive Assessment
          </span>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {evaluation.detailedFeedback || 
              'Strong technical articulation with clear problem scoping. Adding concrete benchmarks and measurable business impact will elevate this answer to top-tier calibration.'}
          </p>
        </div>

        {/* STAR Structure Breakdown */}
        <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              STAR Structure Analysis
            </span>
            <span className="text-[10px] text-blue-700 font-bold">Standard Rubric</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-blue-100">
              <span className="font-semibold text-slate-800">Situation &amp; Context</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Well Established
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-blue-100">
              <span className="font-semibold text-slate-800">Task &amp; Responsibility</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Clear Ownership
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-blue-100">
              <span className="font-semibold text-slate-800">Action &amp; Technical Trade-off</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strong Execution
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
              <span className="font-semibold">Result &amp; Measurable Impact</span>
              <span className="text-amber-800 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Needs Stronger Metrics
              </span>
            </div>
          </div>
        </div>

        {/* Strengths & Missing Points */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* Strengths */}
          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
              Key Strengths Detected
            </span>
            <ul className="text-xs text-slate-700 space-y-1">
              {evaluation.strengths.slice(0, 3).map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Points / Improvements */}
          <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-900 block">
              Improvement Opportunities &amp; Missing Dimensions
            </span>
            <ul className="text-xs text-slate-700 space-y-1">
              {evaluation.improvementAreas.slice(0, 3).map((imp, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">△</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Action Buttons: Improve Answer, Show Example, Continue */}
      <div className="pt-3 border-t border-slate-100 space-y-2 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onImproveAnswer}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Improve Answer</span>
          </button>

          <button
            type="button"
            onClick={onShowExample}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Show Example</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onContinueNext}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span>{isLastQuestion ? 'Complete Mock Interview' : 'Continue to Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
