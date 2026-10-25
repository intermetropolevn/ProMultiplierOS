import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Search, 
  Filter, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react';
import { CapabilityDefinition, CapabilityDomain, GapClassification } from '../../features/evidenceIntelligence/types';
import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';

interface CapabilityEvidenceViewProps {
  capabilities: CapabilityDefinition[];
  onOpenQuickCapture: () => void;
}

export const CapabilityEvidenceView: React.FC<CapabilityEvidenceViewProps> = ({
  capabilities,
  onOpenQuickCapture
}) => {
  const { accessLevel, getIntelligenceAccess, consumeDemoIntelligenceSignal } = useAccessControl();
  const [selectedDomain, setSelectedDomain] = useState<CapabilityDomain | 'ALL'>('ALL');
  const [selectedGapFilter, setSelectedGapFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCapId, setExpandedCapId] = useState<string | null>('cap-product-strategy');
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const isFullAccess = accessLevel === 'FULL_ACCESS';
  const isGuest = accessLevel === 'PUBLIC_GUEST';
  const intelAccess = getIntelligenceAccess('capability_attribution');

  const filteredCapabilities = useMemo(() => {
    const base = capabilities.filter(cap => {
      if (selectedDomain !== 'ALL' && cap.domain !== selectedDomain) return false;
      if (selectedGapFilter !== 'all') {
        if (selectedGapFilter === 'has_gap' && !cap.gapClassification) return false;
        if (selectedGapFilter === 'no_gap' && cap.gapClassification) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return cap.name.toLowerCase().includes(q) || cap.description.toLowerCase().includes(q);
      }
      return true;
    });
    // Access-aware response: Guest/Demo only receive top 2 curated sample capability profiles in the DOM
    return isFullAccess ? base : base.slice(0, 2);
  }, [capabilities, selectedDomain, selectedGapFilter, searchQuery, isFullAccess]);

  const handleToggleExpand = (capId: string) => {
    if (expandedCapId === capId) {
      setExpandedCapId(null);
      return;
    }
    if (isGuest && capId !== 'cap-product-strategy') {
      setIsGateModalOpen(true);
      return;
    }
    if (!isFullAccess) {
      const allowed = consumeDemoIntelligenceSignal('capability_attribution', `cap-${capId}`);
      if (!allowed) {
        setIsGateModalOpen(true);
        return;
      }
    }
    setExpandedCapId(capId);
  };

  const getProficiencyColor = (prof: string) => {
    switch (prof) {
      case 'Strategic': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Advanced': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Intermediate': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Emerging': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Foundational': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStrengthColor = (str: string) => {
    switch (str) {
      case 'Strong': return 'text-emerald-700 font-bold';
      case 'Moderate': return 'text-blue-700 font-semibold';
      case 'Limited': return 'text-amber-700 font-semibold';
      case 'Insufficient': return 'text-rose-700 font-bold';
      default: return 'text-slate-600';
    }
  };

  const getGapBadge = (gap?: GapClassification) => {
    if (!gap) return null;
    switch (gap) {
      case 'Skill Gap':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">Skill Gap</span>;
      case 'Experience Gap':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">Experience Gap</span>;
      case 'Evidence Gap':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">Evidence Gap</span>;
      case 'Exposure Gap':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">Exposure Gap</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner & Critical Product Principle (Section 7) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Capability Evidence
            </span>
            <IntelligenceModeBadge capability="capability_attribution" />
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">Activity ≠ Capability Architecture</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Demonstrated Capability Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            100 completed tasks do not equal capability. CareerOS evaluates capabilities through balanced dimensions including Frequency, Complexity, Scope, Ownership, Impact, Evidence Quality, Consistency, and Validation.
          </p>
        </div>

        {/* Filter Controls Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {(['ALL', 'PRODUCT', 'TECH', 'BUSINESS', 'OPERATIONS', 'LEADERSHIP'] as (CapabilityDomain | 'ALL')[]).map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedDomain === dom 
                    ? 'bg-slate-900 text-white shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {dom === 'ALL' ? 'All Domains' : dom}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedGapFilter}
              onChange={(e) => setSelectedGapFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">All Capabilities</option>
              <option value="has_gap">Identified Gaps Only</option>
              <option value="no_gap">Strong Evidence Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Capability Cards List */}
      <div className="space-y-4">
        {filteredCapabilities.map((cap) => {
          const isExpanded = expandedCapId === cap.id;
          return (
            <div
              key={cap.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div 
                onClick={() => handleToggleExpand(cap.id)}
                className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                      {cap.domain}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getProficiencyColor(cap.observedProficiency)}`}>
                      {cap.observedProficiency}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className={`text-xs ${getStrengthColor(cap.evidenceStrength)}`}>
                      {cap.evidenceStrength} Evidence ({cap.confidence} Confidence)
                    </span>
                    {getGapBadge(cap.gapClassification)}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {cap.name}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {cap.verifiedEvidenceCount} Signals
                  </span>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Capability Multi-Dimension & Evidence Deep Dive */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 bg-slate-50/40 text-xs">
                  {isGuest ? (
                    <CareerOSIntelligenceGate
                      capability="capability_attribution"
                      variant="compact"
                      sampleCountLabel="Sample Capability Summary · Unlock 8-Dimension Signal Attribution in Demo or Full Access"
                    />
                  ) : (
                    <>
                      {/* 8 Multi-Dimension Visual Evaluation Bars */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Multi-Dimension Capability Signal Evaluation
                          </span>
                          <span className="text-[10px] text-slate-400">Qualitative multi-signal synthesis</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
                            <span className="text-[10px] font-semibold text-slate-500 block">Frequency</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${cap.dimensionScores.frequency * 10}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block font-mono">High Signal</span>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
                            <span className="text-[10px] font-semibold text-slate-500 block">Complexity</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${cap.dimensionScores.complexity * 10}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block font-mono">High Signal</span>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
                            <span className="text-[10px] font-semibold text-slate-500 block">Ownership</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-700 h-full rounded-full" style={{ width: `${cap.dimensionScores.ownership * 10}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block font-mono">Primary Lead</span>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
                            <span className="text-[10px] font-semibold text-slate-500 block">Impact</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${cap.dimensionScores.impact * 10}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block font-mono">Verified Lift</span>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
                            <span className="text-[10px] font-semibold text-slate-500 block">Evidence Quality</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${cap.dimensionScores.evidenceQuality * 10}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block font-mono">Strong Proof</span>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
                            <span className="text-[10px] font-semibold text-slate-500 block">Consistency</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${cap.dimensionScores.consistency * 10}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block font-mono">Sustained</span>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
                            <span className="text-[10px] font-semibold text-slate-500 block">Scope</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-slate-700 h-full rounded-full" style={{ width: `${cap.dimensionScores.scope * 10}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block font-mono">Cross-Team</span>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
                            <span className="text-[10px] font-semibold text-slate-500 block">Validation</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${cap.dimensionScores.validation * 10}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block font-mono">Confirmed</span>
                          </div>
                        </div>
                      </div>

                      {/* Recent Evidence & Missing Evidence Lists */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            ✓ Verified Evidence Signals
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {cap.recentEvidenceTitles.map((t, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{t}</span>
                              </li>
                            ))}
                            {cap.historicalEvidenceTitles.map((t, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-slate-500">
                                <span>✓</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              Identified Gap Analysis
                            </span>
                            {getGapBadge(cap.gapClassification)}
                          </div>

                          {cap.gapReason && (
                            <p className="text-xs text-slate-700 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/70">
                              {cap.gapReason}
                            </p>
                          )}

                          {cap.missingEvidenceNotes.map((m, idx) => (
                            <p key={idx} className="text-xs text-slate-600">
                              {m}
                            </p>
                          ))}

                          {cap.recommendedAction && (
                            <div className="pt-2 border-t border-slate-100 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                                Recommended Next Best Action
                              </span>
                              <p className="text-xs text-blue-900 font-medium">
                                &ldquo;{cap.recommendedAction}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Intelligence Gate for Guest / Demo */}
      {!isFullAccess && (
        <CareerOSIntelligenceGate
          capability="capability_attribution"
          variant="inline"
          sampleCountLabel={
            isGuest
              ? `Showing ${filteredCapabilities.length} sample capability attribution profiles`
              : `Demo Preview · ${intelAccess.demoSignalsUsed} / ${intelAccess.demoSignalsLimit} capability attribution inspections used`
          }
        />
      )}

      {isGateModalOpen && (
        <CareerOSIntelligenceGate
          capability="capability_attribution"
          variant="modal"
          onClose={() => setIsGateModalOpen(false)}
        />
      )}

    </div>
  );
};
