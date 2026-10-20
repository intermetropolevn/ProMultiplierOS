import React from 'react';
import { X, BookOpen, CheckCircle2, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

interface KnowledgePreviewModalProps {
  title: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToKnowledge: () => void;
}

export const KnowledgePreviewModal: React.FC<KnowledgePreviewModalProps> = ({
  title,
  isOpen,
  onClose,
  onNavigateToKnowledge
}) => {
  if (!isOpen || !title) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Knowledge Blueprint
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">{title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-950 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-xs text-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Why this Knowledge closes your Build Gap
            </span>
            <p className="text-2xs text-slate-700 leading-relaxed">
              Applying this proven architecture framework directly overcomes the technical friction identified in the challenge, elevating prototype fidelity and team fit.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-2xs">Core Takeaways for this Sprint:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Isolate Key Invariants:</strong> Define explicit input/output boundaries before prototyping components.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Progressive Staging:</strong> Defer complex configuration to secondary steps; achieve user "Hello World" in &lt;90 seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Measure Verification Velocity:</strong> Track qualitative user sentiment alongside quantitative cohort telemetry.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-2xs text-slate-500 font-medium">Synced with Career OS Knowledge Base</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToKnowledge();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>Open in Knowledge System</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
