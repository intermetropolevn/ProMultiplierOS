// =========================================================================
// CAREER OS - CAPABILITY ACTIVATION MODAL
// =========================================================================

import React from 'react';
import { X, BrainCircuit } from 'lucide-react';
import { CapabilityActivationInspector } from './CapabilityActivationInspector';

interface CapabilityActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const CapabilityActivationModal: React.FC<CapabilityActivationModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-slate-100 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Capability Activation / Trigger Engine
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  L0 – L4 Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Autonomous intelligence scaling, signal scoring, escalation, and acceptance verification.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <CapabilityActivationInspector initialPrompt={initialPrompt} />
        </div>
      </div>
    </div>
  );
};
