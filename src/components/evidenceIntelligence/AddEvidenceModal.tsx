import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  FileText, 
  TrendingUp, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';
import { evidenceIntelligenceStore } from '../../features/evidenceIntelligence/services/evidenceIntelligenceStore';
import { ContributionType, EvidenceItem, OutcomeMetric } from '../../features/evidenceIntelligence/types';
import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';

interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvidenceCreated?: (evidence: EvidenceItem) => void;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  isOpen,
  onClose,
  onEvidenceCreated
}) => {
  const { accessLevel, getIntelligenceAccess, consumeDemoIntelligenceSignal } = useAccessControl();
  const [rawText, setRawText] = useState(
    'Led cross-functional onboarding redesign with engineering and design to launch a 3-step activation wizard.'
  );
  const [extractedData, setExtractedData] = useState<{
    suggestedTitle: string;
    suggestedInitiative: string;
    detectedCapabilities: { id: string; name: string }[];
    suggestedContribution: ContributionType;
    confidenceScore: number;
    recommendedOutcomeQuestion: string;
  } | null>(null);

  const [hasOutcome, setHasOutcome] = useState(false);
  const [outcomeMetricName, setOutcomeMetricName] = useState('');
  const [outcomeLift, setOutcomeLift] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGate, setShowGate] = useState(false);

  if (!isOpen) return null;

  const isFullAccess = accessLevel === 'FULL_ACCESS';
  const isGuest = accessLevel === 'PUBLIC_GUEST';
  const intelAccess = getIntelligenceAccess('evidence_intelligence');

  const handleExtract = () => {
    if (!rawText.trim()) return;
    if (isGuest) {
      setShowGate(true);
      return;
    }
    if (!isFullAccess) {
      const allowed = consumeDemoIntelligenceSignal('evidence_intelligence');
      if (!allowed) {
        setShowGate(true);
        return;
      }
    }
    setIsProcessing(true);
    setTimeout(() => {
      const extracted = evidenceIntelligenceStore.quickExtractFromText(rawText);
      setExtractedData(extracted);
      setIsProcessing(false);
    }, 300);
  };

  const handleConfirmAndSave = () => {
    if (!extractedData) return;
    if (isGuest) {
      setShowGate(true);
      return;
    }

    const outcomes: OutcomeMetric[] = [];
    if (hasOutcome && outcomeMetricName.trim() && outcomeLift.trim()) {
      outcomes.push({
        id: `out-${Date.now()}`,
        metricName: outcomeMetricName.trim(),
        quantitativeLift: outcomeLift.trim(),
        timeframe: 'Recent Milestone',
        verified: true
      });
    }

    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthStr = months[now.getMonth()];
    const yearNum = now.getFullYear();

    const newEvidence: EvidenceItem = {
      id: `ev-manual-${Date.now()}`,
      title: extractedData.suggestedTitle,
      description: rawText.trim(),
      source: 'Manual Reflection',
      linkedInitiativeId: 'init-onboarding-revamp',
      linkedInitiativeTitle: extractedData.suggestedInitiative,
      role: 'Lead Practitioner',
      contributionType: extractedData.suggestedContribution,
      capabilities: extractedData.detectedCapabilities.map(c => c.id),
      capabilityLabels: extractedData.detectedCapabilities.map(c => c.name),
      skills: ['Initiative Execution', 'Cross-functional Collaboration'],
      scope: 'Project surface area',
      complexity: 'High',
      ownershipLevel: 'Primary Lead',
      impactSummary: outcomes.length > 0 ? outcomes[0].quantitativeLift : 'Demonstrated capability in production work',
      outcomes,
      supportingArtifacts: [],
      date: now.toISOString().split('T')[0],
      monthYear: `${monthStr} ${yearNum}`,
      year: yearNum,
      month: monthStr,
      evidenceConfidence: extractedData.confidenceScore,
      attributionConfidence: 90,
      validationStatus: 'Confirmed',
      attribution: {
        userRole: 'Lead',
        userContributionSummary: 'Spearheaded execution and cross-functional coordination.',
        attributionConfidence: 90,
        outcomeAttribution: 'Shared',
        coContributors: []
      },
      qualitySignals: {
        hasArtifact: false,
        hasDecisionLogged: true,
        hasCrossFunctionalLead: true,
        hasShippedOutcome: outcomes.length > 0,
        hasMeasuredMetric: outcomes.length > 0,
        hasPeerValidation: false,
        isRepeatedBehavior: false
      },
      dimensionScores: {
        frequency: 7,
        complexity: 8,
        scope: 7,
        ownership: 8,
        impact: outcomes.length > 0 ? 8 : 7,
        evidenceQuality: outcomes.length > 0 ? 8 : 7,
        consistency: 7,
        validation: 8
      }
    };

    evidenceIntelligenceStore.addManualEvidence(newEvidence);
    if (onEvidenceCreated) {
      onEvidenceCreated(newEvidence);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Quick Evidence Capture
                </h2>
                <IntelligenceModeBadge capability="evidence_intelligence" />
              </div>
              <p className="text-[11px] text-slate-500">
                Write a quick summary. CareerOS extracts initiative, capabilities &amp; contribution.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs overflow-y-auto">
          
          {/* Quick Capture Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              What work did you lead, ship, or contribute to?
            </label>
            <textarea
              rows={3}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g., I led the onboarding redesign and worked with design and engineering to launch a 3-step activation wizard that reduced user drop-off..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs leading-relaxed"
            />
            <div className="flex justify-between items-center pt-1 flex-wrap gap-2">
              <span className="text-[11px] text-slate-400">
                {isFullAccess
                  ? 'Full Intelligence Signal Extraction Active'
                  : isGuest
                  ? 'Sample Intelligence Preview · Live extraction unlocks in Demo / Full Access'
                  : `Demo Signal Extractions: ${intelAccess.demoSignalsUsed} / ${intelAccess.demoSignalsLimit} used`}
              </span>
              <button
                type="button"
                onClick={handleExtract}
                disabled={!rawText.trim() || isProcessing}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-3xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Synthesizing...' : 'Extract Signals'}</span>
              </button>
            </div>
          </div>

          {/* Curated Sample Signal Preview for Guest */}
          {isGuest && !showGate && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                  Curated Sample Extraction Preview
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Sample Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Example output: <strong>Onboarding Activation Redesign</strong> → Attributed to <strong>Product Strategy</strong> &amp; <strong>Growth Experimentation</strong> (Primary Lead).
              </p>
            </div>
          )}

          {/* Intelligence Gate when Guest clicks Extract or Demo hits signal limit */}
          {showGate && !isFullAccess && (
            <CareerOSIntelligenceGate
              capability="evidence_intelligence"
              variant="compact"
              onContinueWithDemo={() => setShowGate(false)}
            />
          )}

          {/* Extracted Structured Card */}
          {extractedData && (
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                  CareerOS Signal Extraction
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Verified Attribution Signal
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Suggested Title</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{extractedData.suggestedTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Contribution</span>
                  <span className="font-bold text-blue-700 block mt-0.5">{extractedData.suggestedContribution}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Detected Capabilities
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {extractedData.detectedCapabilities.map(cap => (
                    <span key={cap.id} className="px-2 py-0.5 rounded bg-white text-purple-800 border border-purple-200 text-[11px] font-bold">
                      {cap.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Measurable Outcome Prompt */}
              <div className="pt-2 border-t border-blue-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    {extractedData.recommendedOutcomeQuestion}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHasOutcome(!hasOutcome)}
                    className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    {hasOutcome ? 'Remove' : '+ Add Outcome'}
                  </button>
                </div>

                {hasOutcome && (
                  <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in">
                    <input
                      type="text"
                      placeholder="Metric Name (e.g. TTFV)"
                      value={outcomeMetricName}
                      onChange={(e) => setOutcomeMetricName(e.target.value)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Lift (e.g. -68% time)"
                      value={outcomeLift}
                      onChange={(e) => setOutcomeLift(e.target.value)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/60">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-all text-xs"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmAndSave}
            disabled={!extractedData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-xs text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm &amp; Record Evidence</span>
          </button>
        </div>

      </div>
    </div>
  );
};
