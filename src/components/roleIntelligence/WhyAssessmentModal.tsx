import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Target,
  BrainCircuit,
  Info
} from 'lucide-react';
import { RoleAssessmentSummaryData } from '../../features/roleIntelligence/types';
import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';

interface WhyAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: RoleAssessmentSummaryData;
  onNavigateToTarget?: () => void;
}

export const WhyAssessmentModal: React.FC<WhyAssessmentModalProps> = ({
  isOpen,
  onClose,
  summary,
}) => {
  const { getIntelligenceAccess } = useAccessControl();
  if (!isOpen) return null;

  const scoringAccess = getIntelligenceAccess('proprietary_scoring_logic');
  const isFull = scoringAccess.isFull;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                AI Synthesis Rationale
              </span>
              <IntelligenceModeBadge capability="proprietary_scoring_logic" />
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Explainable Career Intelligence</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Why {summary.currentLevelCode} Senior Assessment?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of how system-observed work, human signals, and organizational context were synthesized.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Conceptual Model Flow Ribbon */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Core Assessment Model
            </span>
            <div className="flex items-center gap-1.5 flex-wrap font-mono text-[11px] text-blue-200">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-white">System Evidence (Primary Driver)</span>
              <span>+</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-white">Human &amp; Context (Calibrated Signal)</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold">CareerOS Synthesis</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">{summary.currentLevelCode} Assessment</span>
            </div>
          </div>

          {/* AI Narrative Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Key Synthesis Findings
            </h4>

            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/70 space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>1. Repeated Cross-Functional Ownership:</strong> Across {summary.initiativesCount || 4} verified initiatives (including <em>Onboarding Revamp</em> and <em>Enterprise API Gateway</em>), system evidence detected 28 completed PRDs, architectural decision records (ADRs), and live production experiments.
              </p>
              {isFull && (
                <>
                  <p>
                    <strong>2. Strong Peer Concordance:</strong> Peer feedback from Staff Platform Engineering and Design Leads corroborates senior-level product judgment, specifically praising trade-off resolution without escalating to management.
                  </p>
                  <p>
                    <strong>3. Attribution Calibration:</strong> While top-line activation lift was partially shared with Growth marketing, attribution models confirm primary authoring of the critical discovery and technical RFC artifacts.
                  </p>
                  <p>
                    <strong>4. High Confidence ({summary.assessmentConfidence}):</strong> 8 of 10 dimensions have Strong evidence coverage. Only People Management / Direct Team Ownership has limited signals, which is typical for an advanced Individual Contributor.
                  </p>
                </>
              )}
            </div>
          </div>

          {!isFull ? (
            <CareerOSIntelligenceGate
              capability="proprietary_scoring_logic"
              title="CareerOS Intelligence — Synthesis & Calibration"
              description="Turn career activity into structured evidence, capabilities and readiness signals. Unlock full multi-signal concordance, attribution calibration, and longitudinal readiness synthesis."
              sampleCountLabel="Showing 1 sample synthesis finding"
            />
          ) : (
            /* Evidence Coverage & Confidence Breakdown */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Evidence Coverage (Strong)
                </span>
                <p className="text-slate-600">
                  Covers product discovery, tech architecture, business telemetry, and stakeholder diplomacy.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  What&apos;s Needed for {summary.targetLevelCode} (Staff PM)?
                </span>
                <p className="text-slate-600">
                  Closing the organization-wide strategic influence gap and leading multi-squad roadmaps.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-mono">
            Last assessed: {summary.lastAssessedDate}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
