import React, { useState } from 'react';
import { Sparkles, Unlock, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  useAccessControl,
  ProtectedIntelligenceCapability
} from '../../services/accessControlService';
import { CareerOSIntelligenceGate } from './CareerOSIntelligenceGate';

interface IntelligenceAccessBannerProps {
  featureName?: string;
  capability?: ProtectedIntelligenceCapability;
  className?: string;
}

export const IntelligenceAccessBanner: React.FC<IntelligenceAccessBannerProps> = ({
  featureName = 'CareerOS Intelligence',
  capability = 'evidence_intelligence',
  className = ''
}) => {
  const { accessLevel, getIntelligenceAccess, openContextualPrompt, requestFullAccess } = useAccessControl();
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const intelState = getIntelligenceAccess(capability);

  if (accessLevel === 'FULL') {
    return (
      <div
        className={`rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-emerald-950 ${className}`}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            Full Intelligence
          </span>
          <span className="font-semibold text-emerald-900">{featureName}</span>
          <span className="text-emerald-700">
            · Complete CareerOS evidence graph, capability attribution, and readiness signals active.
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`rounded-xl border border-slate-200/90 bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 shadow-2xs ${className}`}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Sample Intelligence
          </span>
          <span className="font-bold text-slate-900">{featureName}:</span>
          {accessLevel === 'DEMO' ? (
            <span className="text-slate-600">
              Viewing Demo Sample Intelligence ({intelState.demoSignalsUsed} / {intelState.demoSignalsLimit} interactive demo signals used). Full Intelligence unlocks complete graph &amp; attribution depth.
            </span>
          ) : (
            <span className="text-slate-600">
              Viewing curated sample signals. Enter Demo Workspace for limited interactive previews or request a CareerOS Seat for Full Intelligence.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {accessLevel !== 'DEMO' && (
            <button
              type="button"
              onClick={openContextualPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5 text-amber-600" />
              <span>Continue with Demo</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => requestFullAccess(false, `Intelligence Access Banner (${featureName})`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Request a CareerOS Seat</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <CareerOSIntelligenceGate
        capability={capability}
        featureTitle={featureName}
        variant="modal"
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
      />
    </>
  );
};

