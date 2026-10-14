import React from 'react';
import { 
  Building2, 
  ShieldAlert, 
  Layers, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { IndustryDomainGuide } from '../../types';
import { Modal } from '../common/Modal';

interface DomainDetailModalProps {
  domain: IndustryDomainGuide | null;
  isOpen: boolean;
  onClose: () => void;
  onStartPracticeDomain?: (domainName: string) => void;
}

export const DomainDetailModal: React.FC<DomainDetailModalProps> = ({
  domain,
  isOpen,
  onClose,
  onStartPracticeDomain,
}) => {
  if (!domain) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 mb-2 inline-block">
              Domain Master Guide
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {domain.name}
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
              {domain.summary}
            </p>
          </div>

          {onStartPracticeDomain && (
            <button
              id="domain-practice-btn"
              onClick={() => {
                onClose();
                onStartPracticeDomain(domain.name);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Practice {domain.name} Questions</span>
            </button>
          )}
        </div>

        {/* Core Business Problems */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            Core High-Stakes Business & System Challenges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {domain.coreBusinessProblems.map((problem, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5 font-medium leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{problem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory & Compliance Frameworks */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            Regulatory Constraints & Compliance Mandates
          </h3>
          <ul className="space-y-2">
            {domain.regulatoryAndCompliance.map((reg, idx) => (
              <li key={idx} className="text-xs text-amber-950 flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{reg}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Architectural Patterns */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-600" />
            Standard Architectural Blueprints & Patterns
          </h3>
          <div className="space-y-2.5">
            {domain.architecturalPatterns.map((pat, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>{pat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminology Glossary */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-teal-600" />
            Critical Domain Jargon Glossary
          </h3>
          <div className="space-y-3">
            {domain.criticalTerminology.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-mono text-[11px]">
                    {item.term}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.definition}
                </p>
                <div className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                  Example in conversation: {item.exampleUsage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Interview Traps */}
        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Common Interview Traps to Avoid
          </h3>
          <ul className="space-y-1.5">
            {domain.interviewTraps.map((trap, idx) => (
              <li key={idx} className="text-xs text-rose-900 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>{trap}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </Modal>
  );
};
