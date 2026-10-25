import React, { useState } from 'react';
import { EvidenceGraphEngine } from '../../features/intelligence/services/evidenceGraphEngine';
import { 
  EvidenceTier, 
  EVIDENCE_TIER_DEFINITIONS, 
  DetailedSkillEvidenceProfile,
  EvidenceRelationshipNode 
} from '../../features/intelligence/types/evidenceGraph';
import { getEvidenceStrengthDefinition } from '../../features/sources/taxonomy';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Award, 
  Layers, 
  BookOpen, 
  FolderGit2, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  Edit3, 
  Save, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Plus,
  HelpCircle,
  FileText
} from 'lucide-react';

import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';

interface SkillWhyEvidenceModalProps {
  skillName: string;
  onClose: () => void;
  onOpenSourceDetail?: (sourceId: string) => void;
  onSkillUpdated?: () => void;
}

export const SkillWhyEvidenceModal: React.FC<SkillWhyEvidenceModalProps> = ({
  skillName,
  onClose,
  onOpenSourceDetail,
  onSkillUpdated
}) => {
  const { accessLevel } = useAccessControl();
  const isFullAccess = accessLevel === 'FULL_ACCESS';
  const [profile, setProfile] = useState<DetailedSkillEvidenceProfile | undefined>(() => 
    EvidenceGraphEngine.getDetailedSkillProfile(skillName)
  );

  const [activeTab, setActiveTab] = useState<'evidence_tiers' | 'timeline' | 'relationship_model' | 'scoring_audit'>('evidence_tiers');
  const [isEditingExplanation, setIsEditingExplanation] = useState(false);
  const [customExplanationText, setCustomExplanationText] = useState(
    profile?.explanation.userCustomExplanation || profile?.explanation.computedExplanation || ''
  );
  const [customRationaleText, setCustomRationaleText] = useState(
    profile?.explanation.userRationale || ''
  );

  const [movingTierSourceId, setMovingTierSourceId] = useState<string | null>(null);
  const [addingMetricSourceId, setAddingMetricSourceId] = useState<string | null>(null);
  const [newMetricInput, setNewMetricInput] = useState('');

  if (!profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Skill Not Found</h3>
          <p className="text-xs text-slate-500">Could not resolve canonical evidence profile for "{skillName}".</p>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const refreshProfile = () => {
    const updated = EvidenceGraphEngine.getDetailedSkillProfile(profile.canonicalSkillId);
    setProfile(updated);
    if (onSkillUpdated) onSkillUpdated();
  };

  const handleSaveExplanation = () => {
    EvidenceGraphEngine.setExplanationOverride(
      profile.canonicalSkillId,
      customExplanationText,
      customRationaleText
    );
    setIsEditingExplanation(false);
    refreshProfile();
  };

  const handleResetExplanation = () => {
    EvidenceGraphEngine.resetSkillOverrides(profile.canonicalSkillId);
    setCustomExplanationText(profile.explanation.computedExplanation);
    setCustomRationaleText('');
    setIsEditingExplanation(false);
    refreshProfile();
  };

  const handleMoveTier = (sourceId: string, newTier: EvidenceTier) => {
    EvidenceGraphEngine.setTierOverride(profile.canonicalSkillId, sourceId, newTier);
    setMovingTierSourceId(null);
    refreshProfile();
  };

  const handleAddMetric = (sourceId: string) => {
    if (!newMetricInput.trim()) return;
    EvidenceGraphEngine.addCustomMetric(profile.canonicalSkillId, sourceId, newMetricInput.trim());
    setNewMetricInput('');
    setAddingMetricSourceId(null);
    refreshProfile();
  };

  const peakStrengthDef = getEvidenceStrengthDefinition(profile.scoring.peakEvidenceStrength);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                Skill Evidence Ledger
              </span>
              <IntelligenceModeBadge capability="proprietary_scoring_logic" />
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">{profile.domain}</span>
              
              {/* Multilingual Canonical Indicator */}
              {profile.multilingualTags.map((tag, idx) => (
                <span 
                  key={`tag-${tag.lang}-${idx}`} 
                  className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold"
                  title={`Canonical multilingual mapping (${tag.lang})`}
                >
                  {tag.lang}: {tag.label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {profile.canonicalSkillName}
              </h2>
            </div>

            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {profile.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MULTI-FACTOR PROFICIENCY & EVIDENCE STRENGTH BANNER */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            
            {/* Left: Overall Verified Score */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-black tracking-wider uppercase text-slate-300">
                  Calculated Proficiency
                </span>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {profile.scoring.overallScore}%
                </span>
                <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg border ${peakStrengthDef.colorClass}`}>
                  Peak L{profile.scoring.peakEvidenceStrength} ({peakStrengthDef.name})
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Prioritizes execution depth, external validation, outcome metrics, and recency over raw source volume.
              </p>
            </div>

            {/* Middle: 4 Tier Distribution */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                <span>Proof Breakdown</span>
                <span className="text-[10px] text-slate-400 font-normal">Learned ≠ Applied ≠ Demonstrated ≠ Validated</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-400/20">
                  <span className="text-[10px] font-bold text-blue-300 block uppercase">Learned</span>
                  <span className="text-sm font-black text-white">{profile.scoring.tierDistribution.learned}</span>
                </div>
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-400/20">
                  <span className="text-[10px] font-bold text-indigo-300 block uppercase">Applied</span>
                  <span className="text-sm font-black text-white">{profile.scoring.tierDistribution.applied}</span>
                </div>
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-400/20">
                  <span className="text-[10px] font-bold text-purple-300 block uppercase">Demonstrated</span>
                  <span className="text-sm font-black text-white">{profile.scoring.tierDistribution.demonstrated}</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
                  <span className="text-[10px] font-bold text-emerald-300 block uppercase">Validated</span>
                  <span className="text-sm font-black text-emerald-400">{profile.scoring.tierDistribution.validated}</span>
                </div>
              </div>
            </div>

            {/* Right: Qualitative Signal Drivers (No raw weighting formulas exposed) */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span>Multi-Signal Evidence Drivers:</span>
              </div>
              <div className="space-y-1">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                    <span>1. Application Depth</span>
                    <span className="font-bold">Primary Driver</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${profile.scoring.applicationDepthScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                    <span>2. External Validation</span>
                    <span className="font-bold text-emerald-400">High Signal</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${profile.scoring.externalValidationScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                    <span>3. Outcome Impact</span>
                    <span className="font-bold">Core Driver</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: `${profile.scoring.outcomeImpactScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                    <span>4. Recency Currency</span>
                    <span className="font-bold">Active Signal</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${profile.scoring.recencyScore}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* "WHY DO YOU THINK I HAVE THIS?" TRANSPARENT & EDITABLE EXPLANATION */}
        <div className="p-5 border-b border-slate-100 bg-amber-50/40">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">
                  Why does Career OS think you have this skill?
                </h3>
                {profile.explanation.isOverridden && (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-amber-200 text-amber-900">
                    User Edited / Overridden
                  </span>
                )}
              </div>

              {!isEditingExplanation ? (
                <button
                  onClick={() => setIsEditingExplanation(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Explanation / Self-Reflection</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetExplanation}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to System</span>
                  </button>
                  <button
                    onClick={handleSaveExplanation}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save Edits</span>
                  </button>
                </div>
              )}
            </div>

            {isEditingExplanation ? (
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-amber-900 block mb-1">
                    Custom Evidence Rationale (Will be used in interview preparation and matching):
                  </label>
                  <textarea
                    value={customExplanationText}
                    onChange={e => setCustomExplanationText(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-3 rounded-xl border border-amber-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-sans"
                    placeholder="Provide your personal explanation of how you acquired and proven this skill..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-900 block mb-1">
                    Self-Reflection & Interview Framing Notes:
                  </label>
                  <input
                    type="text"
                    value={customRationaleText}
                    onChange={e => setCustomRationaleText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-amber-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Led the core stream migration under tight regulatory deadlines; top story for behavioral interview."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  {profile.explanation.userCustomExplanation || profile.explanation.computedExplanation}
                </p>
                {profile.explanation.userRationale && (
                  <p className="text-xs text-amber-900 font-medium italic">
                    Candidate Note: "{profile.explanation.userRationale}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('evidence_tiers')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'evidence_tiers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4 Evidence Tiers (Learned vs Applied vs Demonstrated vs Validated)</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Evidence Timeline ({profile.timeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('relationship_model')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'relationship_model'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Source → Job Relationship Chain</span>
          </button>

          <button
            onClick={() => setActiveTab('scoring_audit')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'scoring_audit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Multi-Factor Scoring Audit</span>
          </button>
        </div>

        {/* TAB 1: 4 EVIDENCE TIERS (LEARNED ≠ APPLIED ≠ DEMONSTRATED ≠ VALIDATED) */}
        {activeTab === 'evidence_tiers' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
            
            {(['validated', 'demonstrated', 'applied', 'learned'] as EvidenceTier[]).map(tierKey => {
              const tierDef = EVIDENCE_TIER_DEFINITIONS[tierKey];
              const items = profile.tiers[tierKey];

              return (
                <div key={tierKey} className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase ${tierDef.badgeBg} ${tierDef.badgeText} border ${tierDef.borderColor}`}>
                        {tierDef.label} ({items.length})
                      </span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">•</span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">{tierDef.shortDesc}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Target Strength: {tierDef.strengthRange}
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-white border border-dashed border-slate-200 text-center space-y-1">
                      <p className="text-xs text-slate-400 font-medium">
                        No {tierKey} evidence linked yet.
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Typical sources: {tierDef.typicalEvidenceSources}.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {items.map(node => {
                        const sDef = getEvidenceStrengthDefinition(node.evidenceStrength);

                        return (
                          <div
                            key={node.id}
                            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-2xs transition-all space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${sDef.badgeBg}`}>
                                    L{node.evidenceStrength} • {sDef.name}
                                  </span>
                                  <span className="text-xs font-bold text-slate-900">
                                    {node.sourceTitle}
                                  </span>
                                  {node.isUserOverridden && (
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                      Tier Manually Reclassified
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                  <span>{node.sourceType}</span>
                                  <span>•</span>
                                  <span>{node.authorOrProvider || 'Candidate'}</span>
                                  <span>•</span>
                                  <span>Achieved: {node.dateAchieved ? new Date(node.dateAchieved).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Ongoing'}</span>
                                  <span>•</span>
                                  <span>{node.recencyMonths} mos ago</span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                <button
                                  onClick={() => onOpenSourceDetail && onOpenSourceDetail(node.sourceId)}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                                >
                                  <span>Source</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>

                                {/* Move Tier Dropdown Trigger */}
                                <div className="relative">
                                  {movingTierSourceId === node.sourceId ? (
                                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                      {(['learned', 'applied', 'demonstrated', 'validated'] as EvidenceTier[]).map(t => (
                                        <button
                                          key={t}
                                          onClick={() => handleMoveTier(node.sourceId, t)}
                                          className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase cursor-pointer ${
                                            node.tier === t 
                                              ? 'bg-slate-800 text-white' 
                                              : 'bg-white text-slate-700 hover:bg-slate-200'
                                          }`}
                                        >
                                          {t}
                                        </button>
                                      ))}
                                      <button
                                        onClick={() => setMovingTierSourceId(null)}
                                        className="text-slate-400 hover:text-slate-600 text-xs px-1"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setMovingTierSourceId(node.sourceId)}
                                      className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-600 cursor-pointer"
                                    >
                                      Change Tier
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Quote or Evidence Statement */}
                            {node.evidenceStatement && (
                              <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                "{node.evidenceStatement}"
                              </p>
                            )}

                            {/* Tangible Manifestation & Outcome Metrics */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                              <div className="space-y-1">
                                {node.tangibleEntity && (
                                  <div className="flex items-center gap-1.5 text-slate-700">
                                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                                    <span className="font-semibold text-[11px]">Tangible Artifact:</span>
                                    <span className="text-[11px] text-slate-900 font-bold">{node.tangibleEntity.title}</span>
                                  </div>
                                )}

                                {node.validationMetadata && (
                                  <div className="flex items-center gap-1.5 text-emerald-800">
                                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="font-semibold text-[11px]">Validated By:</span>
                                    <span className="text-[11px] font-bold">
                                      {node.validationMetadata.evaluator || node.validationMetadata.credentialIssuer} 
                                      {node.validationMetadata.score && ` (Score: ${node.validationMetadata.score})`}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Concrete Outcome Metrics */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                {node.outcomeMetrics.map((metric, mIdx) => (
                                  <span 
                                    key={`metric-${mIdx}`} 
                                    className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-900 text-[10px] font-bold"
                                  >
                                    📈 {metric}
                                  </span>
                                ))}

                                {addingMetricSourceId === node.sourceId ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={newMetricInput}
                                      onChange={e => setNewMetricInput(e.target.value)}
                                      placeholder="e.g. +40% query throughput"
                                      className="text-[10px] p-1 rounded-md border border-slate-300 w-36"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => handleAddMetric(node.sourceId)}
                                      className="px-2 py-0.5 bg-purple-600 text-white rounded text-[10px] font-bold"
                                    >
                                      Add
                                    </button>
                                    <button
                                      onClick={() => setAddingMetricSourceId(null)}
                                      className="text-slate-400 text-xs px-1"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setAddingMetricSourceId(node.sourceId)}
                                    className="text-[10px] font-semibold text-purple-700 hover:text-purple-900 cursor-pointer"
                                  >
                                    + Add Outcome Metric
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Associated Knowledge Concepts */}
                            {node.knowledgeConcepts.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Knowledge Principles:</span>
                                {node.knowledgeConcepts.slice(0, 4).map((kc, kcIdx) => (
                                  <span key={`kc-${kcIdx}`} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.2 rounded">
                                    {kc}
                                  </span>
                                ))}
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        )}

        {/* TAB 2: CHRONOLOGICAL EVIDENCE TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Capability Maturity Journey: {profile.canonicalSkillName}
              </h4>
              <p className="text-xs text-slate-500">
                Auditable chronological timeline showing progression from theoretical study (Learned) through sandbox practice (Applied), commercial delivery (Demonstrated), and third-party verification (Validated).
              </p>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {profile.timeline.map((evt, idx) => {
                const tierDef = EVIDENCE_TIER_DEFINITIONS[evt.tier];
                
                return (
                  <div key={evt.id} className="relative space-y-1.5">
                    {/* Node Dot */}
                    <div className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-[9px] font-black ${
                      evt.tier === 'validated' 
                        ? 'bg-emerald-500 text-white' 
                        : evt.tier === 'demonstrated' 
                        ? 'bg-purple-600 text-white' 
                        : evt.tier === 'applied' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {idx + 1}
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${tierDef.badgeBg} ${tierDef.badgeText}`}>
                            {tierDef.label}
                          </span>
                          <span className="text-xs font-black text-slate-900">{evt.title}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{evt.formattedDate}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span>{evt.subtitle}</span>
                        {evt.concreteArtifact && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-slate-900">Artifact: {evt.concreteArtifact}</span>
                          </>
                        )}
                        {evt.outcomeMetric && (
                          <>
                            <span>•</span>
                            <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.2 rounded">
                              {evt.outcomeMetric}
                            </span>
                          </>
                        )}
                        {evt.validationBadge && (
                          <>
                            <span>•</span>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                              ✓ {evt.validationBadge}
                            </span>
                          </>
                        )}
                      </div>

                      {evt.summaryQuote && (
                        <p className="text-xs text-slate-500 italic">
                          "{evt.summaryQuote}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: RELATIONSHIP MODEL CHAIN */}
        {activeTab === 'relationship_model' && (
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-5">
            {!isFullAccess ? (
              <CareerOSIntelligenceGate
                capability="full_knowledge_graph"
                variant="inline"
                sampleCountLabel="Full Source → Capability → Role Lineage Chain requires Full CareerOS Access"
              />
            ) : (
              <>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    End-to-End Relationship Lineage
                  </h4>
                  <p className="text-xs text-slate-500">
                    Source → Knowledge → Skill → Competency → Evidence → Project / Artifact / Experience → Role → Job
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                      1. Backing Sources ({profile.relationshipChain.sources.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {profile.relationshipChain.sources.map(src => (
                        <span key={src.id} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
                          📖 {src.title} ({src.type})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center text-slate-400">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                      2. Extracted Knowledge Concepts ({profile.relationshipChain.knowledgeConcepts.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.relationshipChain.knowledgeConcepts.map((k, idx) => (
                        <span key={`k-${idx}`} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-100">
                          🧠 {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center text-slate-400">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 block">
                      3. Canonical Core Skill
                    </span>
                    <h3 className="text-base font-black tracking-tight">{profile.canonicalSkillName}</h3>
                  </div>

                  <div className="flex justify-center text-slate-400">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">
                      4. Professional Competencies ({profile.relationshipChain.competencies.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.relationshipChain.competencies.map((comp, idx) => (
                        <span key={`comp-${idx}`} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-100">
                          ⚡ {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center text-slate-400">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                      5. Project / Artifact / Work Experience ({profile.relationshipChain.tangibleEntities.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {profile.relationshipChain.tangibleEntities.map((t, idx) => (
                        <span key={`tangible-${idx}`} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                          📁 {t.title} ({t.type})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: SCORING AUDIT */}
        {activeTab === 'scoring_audit' && (
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-4">
            {!isFullAccess ? (
              <CareerOSIntelligenceGate
                capability="proprietary_scoring_logic"
                variant="inline"
                sampleCountLabel="Multi-Factor Evaluation Audit & Signal Drivers require Full CareerOS Access"
              />
            ) : (
              <>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Evaluation Synthesis: How {profile.scoring.overallScore}% Was Verified
                  </h4>
                  <p className="text-xs text-slate-500">
                    CareerOS prioritizes demonstrated production artifacts and verified outcomes over passive source counts.
                  </p>
                </div>

                <div className="space-y-3">
                  {profile.scoring.scoringFactors.map((factor, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{factor.name}</h4>
                          <span className="text-xs text-slate-400">• Verified Signal Driver</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                            {factor.score >= 80 ? 'Strong Signal' : factor.score >= 60 ? 'Moderate Signal' : 'Emerging Signal'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {factor.assessment}
                      </p>

                      {factor.evidenceHighlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {factor.evidenceHighlights.map((hl, hlIdx) => (
                            <span key={`hl-${hlIdx}`} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                              Proof: {hl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Audit-ready evidence verified across {profile.scoring.tierDistribution.learned + profile.scoring.tierDistribution.applied + profile.scoring.tierDistribution.demonstrated + profile.scoring.tierDistribution.validated} records.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
