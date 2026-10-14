import React from 'react';
import { 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Layers, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';
import { RoleBlueprint } from '../../types';
import { Modal } from '../common/Modal';

interface RoleDetailModalProps {
  role: RoleBlueprint | null;
  isOpen: boolean;
  onClose: () => void;
  onStartPractice: (role: RoleBlueprint) => void;
}

export const RoleDetailModal: React.FC<RoleDetailModalProps> = ({
  role,
  isOpen,
  onClose,
  onStartPractice,
}) => {
  if (!role) return null;

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
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {role.category}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {role.marketDemand} Market Demand
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {role.title}
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-1">
              {role.tagline}
            </p>
          </div>

          <button
            id="role-modal-practice-btn"
            onClick={() => {
              onClose();
              onStartPractice(role);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Practice Role Interview</span>
          </button>
        </div>

        {/* Overview */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Mission & Scope
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {role.overview}
          </p>
        </div>

        {/* Salary Benchmark Grid */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Market Compensation Benchmarks (Base + Variable)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Junior</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">{role.salaryBenchmark.junior}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Mid-Level</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">{role.salaryBenchmark.mid}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200 bg-blue-50/30">
              <div className="text-[11px] text-blue-700 font-bold">Senior (Benchmark)</div>
              <div className="text-xs font-bold text-blue-900 mt-0.5">{role.salaryBenchmark.senior}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Lead / Staff</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">{role.salaryBenchmark.lead}</div>
            </div>
          </div>
        </div>

        {/* Competencies */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Core Competencies & Calibration Standards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {role.competencies.map((comp, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {comp.name}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {comp.description}
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Key Calibration Signals:</div>
                  <ul className="space-y-1">
                    {comp.keyIndicators.map((ind, i) => (
                      <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day in the Life Timeline */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            Typical Day in the Life
          </h3>
          <div className="space-y-2.5">
            {role.dailyTasksTimeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-mono font-bold text-blue-600 whitespace-nowrap pt-0.5">
                  {item.time}
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.task}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack & Interview stages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Primary Tech Stack & Tools
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {role.primaryTechStack.concat(role.commonTools).map((tech, idx) => (
                <span key={idx} className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Standard Interview Pipeline
            </h4>
            <ol className="space-y-1.5">
              {role.typicalInterviewStages.map((stage, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{stage}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

      </div>
    </Modal>
  );
};
