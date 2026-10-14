import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, History, Building2, Briefcase } from 'lucide-react';
import { 
  JobApplication, 
  ApplicationPrimaryState, 
  ApplicationSubState,
  CANONICAL_PIPELINE_STAGES 
} from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';

interface StageTransitionModalProps {
  application: JobApplication;
  isOpen: boolean;
  onClose: () => void;
  onTransitionComplete: (updatedApp: JobApplication) => void;
}

export const StageTransitionModal: React.FC<StageTransitionModalProps> = ({
  application,
  isOpen,
  onClose,
  onTransitionComplete
}) => {
  const [selectedStage, setSelectedStage] = useState<ApplicationPrimaryState>(
    application.pipelineState || 'applied_screening'
  );

  const stageDef = CANONICAL_PIPELINE_STAGES.find(s => s.id === selectedStage) || CANONICAL_PIPELINE_STAGES[0];

  const [selectedSubState, setSelectedSubState] = useState<ApplicationSubState>(
    application.pipelineSubState || stageDef.subStates[0].id
  );

  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleStageChange = (newStage: ApplicationPrimaryState) => {
    setSelectedStage(newStage);
    const def = CANONICAL_PIPELINE_STAGES.find(s => s.id === newStage);
    if (def && def.subStates.length > 0) {
      setSelectedSubState(def.subStates[0].id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applicationStore.moveApplicationToState(
      application.id,
      selectedStage,
      selectedSubState,
      reason.trim() || undefined
    );

    if (result) {
      onTransitionComplete(result.updatedApp);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">
                Update Pipeline Stage &amp; Status
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Stage Transition
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
              <span className="font-bold text-slate-700">{application.companyName}</span>
              <span>•</span>
              <span>{application.roleTitle}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Primary Stages Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              1. Select Target Canonical Stage
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CANONICAL_PIPELINE_STAGES.map(stage => {
                const isSelected = selectedStage === stage.id;
                const isCurrent = application.pipelineState === stage.id;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => handleStageChange(stage.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {stage.title}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {stage.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-State Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              2. Select Sub-Status / Phase
            </label>
            <div className="flex flex-wrap gap-2">
              {stageDef.subStates.map(sub => {
                const isSelected = selectedSubState === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubState(sub.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transition Note / Reason */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              3. Transition Reason / Note (Preserved in Pipeline History)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Passed technical interview, invited to VP architectural panel"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-hidden transition-colors"
            />
          </div>

          {/* Past History Preview */}
          {application.stateHistory && application.stateHistory.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Recent Pipeline State History</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-500 max-h-28 overflow-y-auto">
                {application.stateHistory.slice(-3).reverse().map((h, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-2 border-b border-slate-200/50 pb-1">
                    <span>
                      <strong className="text-slate-800">{h.toState.replace(/_/g, ' ')}</strong>
                      {h.toSubState && ` (${h.toSubState})`}
                      {h.reason && ` — "${h.reason}"`}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(h.changedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Confirm State Transition</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
