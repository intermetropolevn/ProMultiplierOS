import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { CareerOSDimensionScore } from '../../features/roleIntelligence/types';

interface AdjustAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dimension: CareerOSDimensionScore | null;
  onSaveAdjustment: (
    dimensionKey: string,
    adjustedScore: number, // 0 for insufficient, 1-5 for levels
    rationale: string,
    validationStatus: 'Detected' | 'Suggested' | 'Confirmed' | 'Validated'
  ) => void;
}

export const AdjustAssessmentModal: React.FC<AdjustAssessmentModalProps> = ({
  isOpen,
  onClose,
  dimension,
  onSaveAdjustment
}) => {
  if (!isOpen || !dimension) return null;

  const [selectedScore, setSelectedScore] = useState<number>(dimension.score || 4);
  const [rationale, setRationale] = useState<string>(dimension.userAdjustmentNotes || '');
  const [validationStatus, setValidationStatus] = useState<'Detected' | 'Suggested' | 'Confirmed' | 'Validated'>(
    dimension.validationStatus || 'Confirmed'
  );

  const levels = [
    { score: 0, label: 'Insufficient Evidence', sub: 'I don’t know yet — data is lacking' },
    { score: 1, label: '1 — Foundational', sub: 'Guided execution under supervision' },
    { score: 2, label: '2 — Working', sub: 'Autonomous on standard scope' },
    { score: 3, label: '3 — Advanced', sub: 'Complex problem-solving & mentoring' },
    { score: 4, label: '4 — Senior', sub: 'Organizational blast radius & strategic leadership' },
    { score: 5, label: '5 — Strategic', sub: 'Industry-level thought leadership & domain moats' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAdjustment(dimension.key, selectedScore, rationale, validationStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                Human Override
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Human-in-the-Loop</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Adjust Assessment: {dimension.label}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto">
          
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 text-xs text-blue-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Current System Synthesis</span>
            </span>
            <p className="text-blue-800 leading-relaxed font-normal">
              Observed level: <strong>{dimension.observedLevelLabel || (dimension.score ? `${dimension.score} — Senior` : 'Insufficient Evidence')}</strong> (Confidence: {dimension.assessmentConfidence || 'High'})
            </p>
          </div>

          {/* Level Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Adjusted Level
            </label>
            <div className="space-y-1.5">
              {levels.map((lvl) => {
                const isSelected = selectedScore === lvl.score;
                return (
                  <button
                    key={lvl.score}
                    type="button"
                    onClick={() => setSelectedScore(lvl.score)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? lvl.score === 0 
                          ? 'bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-400/30'
                          : 'bg-blue-50 border-blue-500 text-blue-950 ring-1 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">{lvl.label}</span>
                      <span className="text-[11px] text-slate-500 block">{lvl.sub}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className={`w-4 h-4 ${lvl.score === 0 ? 'text-amber-600' : 'text-blue-600'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Validation Status Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Status Tag
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Detected', 'Suggested', 'Confirmed', 'Validated'] as const).map(status => {
                const isSel = validationStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setValidationStatus(status)}
                    className={`py-1.5 px-2 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isSel
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Override Rationale Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Adjustment Rationale &amp; Context
            </label>
            <textarea
              rows={3}
              required
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Explain why this level differs from the automated evidence synthesis (e.g. Led additional untracked cross-organizational API initiatives)..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Confirm Adjustment
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
