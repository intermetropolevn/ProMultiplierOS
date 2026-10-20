import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  FileText, 
  Layers, 
  Target, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Share2, 
  TrendingUp, 
  Check, 
  Sliders
} from 'lucide-react';
import { EvidenceItem, ContributionType, OutcomeMetric } from '../../features/evidenceIntelligence/types';
import { evidenceIntelligenceStore } from '../../features/evidenceIntelligence/services/evidenceIntelligenceStore';

interface EvidenceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceItem | null;
  onConfirm?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({
  isOpen,
  onClose,
  evidence,
  onConfirm,
  onReject
}) => {
  const [isAddingOutcome, setIsAddingOutcome] = useState(false);
  const [newMetricName, setNewMetricName] = useState('');
  const [newQuantitativeLift, setNewQuantitativeLift] = useState('');
  const [isEditingContribution, setIsEditingContribution] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<ContributionType>(
    evidence?.contributionType || 'Lead'
  );

  if (!isOpen || !evidence) return null;

  const handleSaveOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetricName.trim() || !newQuantitativeLift.trim()) return;
    const newOutcome: OutcomeMetric = {
      id: `out-${Date.now()}`,
      metricName: newMetricName.trim(),
      quantitativeLift: newQuantitativeLift.trim(),
      timeframe: 'Recent Milestone',
      verified: true
    };
    evidenceIntelligenceStore.addOutcomeToEvidence(evidence.id, newOutcome);
    setNewMetricName('');
    setNewQuantitativeLift('');
    setIsAddingOutcome(false);
  };

  const handleUpdateContribution = (type: ContributionType) => {
    evidenceIntelligenceStore.updateEvidence(evidence.id, { contributionType: type });
    setSelectedContribution(type);
    setIsEditingContribution(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="space-y-1.5 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Career Evidence Record
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium font-mono">{evidence.monthYear}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Confidence: {evidence.evidenceConfidence}%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {evidence.title}
            </h2>
            <div className="text-xs text-slate-500">
              Linked Initiative: <strong className="text-slate-800">{evidence.linkedInitiativeTitle}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Description & Impact Summary */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Observed Synthesis
            </span>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-medium">
              {evidence.description}
            </p>
          </div>

          {/* Explicit Attribution Model (Section 9) */}
          <div className="bg-blue-50/50 rounded-xl border border-blue-200/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                <span className="font-bold text-slate-900 text-xs">Explicit Attribution &amp; Role Contribution</span>
              </div>
              <span className="text-[11px] font-semibold text-blue-800">
                Attribution Confidence: {evidence.attributionConfidence}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-blue-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Your Contribution</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{evidence.contributionType}</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingContribution(!isEditingContribution)}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>
                <p className="text-slate-600 mt-1">{evidence.attribution.userContributionSummary}</p>

                {isEditingContribution && (
                  <div className="pt-2 flex items-center gap-1 flex-wrap border-t border-slate-100 mt-2">
                    {(['Owner', 'Lead', 'Contributor', 'Collaborator', 'Reviewer', 'Participant'] as ContributionType[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleUpdateContribution(c)}
                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                          evidence.contributionType === c 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Outcome Attribution</span>
                <span className="font-bold text-emerald-800 text-sm block">
                  {evidence.attribution.outcomeAttribution} Outcome
                </span>
                <span className="text-[10px] text-slate-500 block">Co-Contributors Recognized:</span>
                <div className="space-y-1 pt-0.5">
                  {evidence.attribution.coContributors.map((cc, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>{cc.name} ({cc.discipline})</span>
                      <span className="font-semibold text-slate-800">{cc.share}</span>
                    </div>
                  ))}
                  {evidence.attribution.coContributors.length === 0 && (
                    <span className="text-[10px] text-slate-400 italic">No co-contributors logged</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities Demonstrated */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Capabilities Demonstrated (Capability Mapping)
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {evidence.capabilityLabels.map((cap, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-bold">
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Evidence Quality Signals (Section 8) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Evidence Quality Signals (Proof Strength Hierarchy)
              </span>
              <span className="text-[11px] text-slate-400">Multi-factor validation</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${evidence.qualitySignals.hasArtifact ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium">Artifact Authored</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${evidence.qualitySignals.hasDecisionLogged ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium">Decision Documented</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${evidence.qualitySignals.hasCrossFunctionalLead ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium">Cross-Functional Lead</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${evidence.qualitySignals.hasShippedOutcome ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium">Shipped Outcome</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${evidence.qualitySignals.hasMeasuredMetric ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium">Measured Metric Lift</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${evidence.qualitySignals.isRepeatedBehavior ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium">Repeated Behavior</span>
              </div>
            </div>
          </div>

          {/* Quantitative Outcomes & Add Outcome form */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Quantitative Outcomes &amp; Impact
              </span>
              <button
                type="button"
                onClick={() => setIsAddingOutcome(!isAddingOutcome)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Outcome</span>
              </button>
            </div>

            {isAddingOutcome && (
              <form onSubmit={handleSaveOutcome} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Metric Name (e.g. Day-7 User Retention)"
                    value={newMetricName}
                    onChange={(e) => setNewMetricName(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Quantitative Lift (e.g. +22% lift)"
                    value={newQuantitativeLift}
                    onChange={(e) => setNewQuantitativeLift(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingOutcome(false)}
                    className="px-3 py-1 text-slate-500 hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                  >
                    Save Outcome
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {evidence.outcomes.map((out) => (
                <div key={out.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{out.metricName}</span>
                  <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {out.quantitativeLift}
                  </span>
                </div>
              ))}
              {evidence.outcomes.length === 0 && (
                <p className="text-slate-400 italic">No quantitative outcomes logged yet.</p>
              )}
            </div>
          </div>

          {/* Supporting Artifacts */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Supporting Artifacts ({evidence.supportingArtifacts.length})
            </span>
            <div className="space-y-1.5">
              {evidence.supportingArtifacts.map((art) => (
                <div key={art.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-medium text-slate-900">{art.title}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 font-mono">
                    {art.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/60">
          <button
            type="button"
            onClick={() => {
              if (onReject) onReject(evidence.id);
              onClose();
            }}
            className="px-3.5 py-2 text-rose-700 hover:bg-rose-50 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reject Signal</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
            {evidence.validationStatus !== 'Confirmed' && evidence.validationStatus !== 'Validated' && (
              <button
                type="button"
                onClick={() => {
                  if (onConfirm) onConfirm(evidence.id);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Confirm Evidence
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
