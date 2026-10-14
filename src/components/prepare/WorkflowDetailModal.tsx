import React from 'react';
import { 
  GitBranch, 
  Clock, 
  Repeat, 
  CheckCircle2, 
  AlertOctagon, 
  Wrench, 
  FileText 
} from 'lucide-react';
import { ProfessionalWorkflow } from '../../types';
import { Modal } from '../common/Modal';

interface WorkflowDetailModalProps {
  workflow: ProfessionalWorkflow | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowDetailModal: React.FC<WorkflowDetailModalProps> = ({
  workflow,
  isOpen,
  onClose,
}) => {
  if (!workflow) return null;

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
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {workflow.category}
            </span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {workflow.domain}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {workflow.title}
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
            {workflow.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Duration: <strong className="text-slate-700">{workflow.estimatedDuration}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Repeat className="w-3.5 h-3.5 text-slate-400" />
              Frequency: <strong className="text-slate-700">{workflow.frequency}</strong>
            </span>
          </div>
        </div>

        {/* Real World Impact */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-blue-950 flex items-start gap-2.5 font-medium leading-relaxed">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-blue-900">High-Impact Business Outcome:</strong> {workflow.realWorldImpact}
          </div>
        </div>

        {/* Workflow Steps */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Standard Operating Procedure (Sequential Steps)
          </h3>
          <div className="space-y-4">
            {workflow.steps.map((step) => (
              <div 
                key={step.stepNumber}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3"
              >
                {/* Step Title Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {step.phase}
                  </span>
                </div>

                {/* Key Actions */}
                <div className="space-y-1.5 pl-8">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Key Execution Actions:</div>
                  <ul className="space-y-1">
                    {step.keyActions.map((action, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meta sub-grid (Tools, Deliverables, Pitfalls) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 pl-8 border-t border-slate-100 text-xs">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-slate-500" />
                      Tools & Stack
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {step.toolsUsed.map((tool, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-500" />
                      Deliverables
                    </div>
                    <div className="space-y-0.5">
                      {step.deliverables.map((deliv, idx) => (
                        <div key={idx} className="text-[11px] text-slate-600">{deliv}</div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1 flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3 text-rose-500" />
                      Common Pitfall
                    </div>
                    {step.commonPitfalls.map((pitfall, idx) => (
                      <div key={idx} className="text-[11px] text-rose-700 leading-snug">{pitfall}</div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </Modal>
  );
};
