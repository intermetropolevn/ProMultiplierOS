import React from 'react';
import { 
  Building2, 
  AlertTriangle, 
  Scale, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PracticalCase } from '../../types';
import { Modal } from '../common/Modal';

interface CaseDetailModalProps {
  caseStudy: PracticalCase | null;
  isOpen: boolean;
  onClose: () => void;
  onPracticeCase?: (caseStudy: PracticalCase) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseStudy,
  isOpen,
  onClose,
  onPracticeCase,
}) => {
  if (!caseStudy) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-5 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              {caseStudy.roleCategory}
            </span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {caseStudy.sector}
            </span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {caseStudy.difficulty} Calibration
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {caseStudy.title}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Target Environment: <strong className="text-slate-700">{caseStudy.companyType}</strong></span>
          </div>
        </div>

        {/* Background & Conflict */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Production Background & Context
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {caseStudy.backgroundScenario}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              The Core Conflict & Business Stakes
            </h3>
            <p className="text-sm text-amber-950 font-medium leading-relaxed">
              {caseStudy.theCoreConflict}
            </p>
          </div>
        </div>

        {/* Trade-off Matrix */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-blue-600" />
            Architectural & Product Trade-off Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Option A */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-200">
                Option A: {caseStudy.engineeringOrProductTradeoffs.optionA}
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Pros:</div>
                <ul className="space-y-1">
                  {caseStudy.engineeringOrProductTradeoffs.prosA.map((pro, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1">Cons:</div>
                <ul className="space-y-1">
                  {caseStudy.engineeringOrProductTradeoffs.consA.map((con, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Option B */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 space-y-2">
              <div className="text-xs font-bold text-blue-900 pb-2 border-b border-blue-100">
                Option B: {caseStudy.engineeringOrProductTradeoffs.optionB}
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Pros:</div>
                <ul className="space-y-1">
                  {caseStudy.engineeringOrProductTradeoffs.prosB.map((pro, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1">Cons:</div>
                <ul className="space-y-1">
                  {caseStudy.engineeringOrProductTradeoffs.consB.map((con, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Recommended Resolution */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Recommended Production Blueprint & Resolution
          </h3>
          <p className="text-xs text-emerald-950 leading-relaxed">
            {caseStudy.recommendedResolution}
          </p>
        </div>

        {/* Interview Discussion Prompts */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            Interview Follow-up Questions to Master
          </h3>
          <div className="space-y-2">
            {caseStudy.interviewDiscussionPrompts.map((prompt, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                  Q{idx + 1}
                </span>
                <span>{prompt}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Modal>
  );
};
