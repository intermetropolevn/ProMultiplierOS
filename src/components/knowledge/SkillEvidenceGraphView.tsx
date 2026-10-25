import React, { useState } from 'react';
import { sourceStore } from '../../features/sources/services/sourceStore';
import { SkillEvidenceProfile, SkillEvidenceItem } from '../../features/sources/types';
import { getEvidenceStrengthDefinition } from '../../features/sources/taxonomy';
import { SourceDetailModal } from '../library/SourceDetailModal';
import { SkillWhyEvidenceModal } from './SkillWhyEvidenceModal';
import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';
import { 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  Award, 
  FolderGit2, 
  Layout, 
  CheckCircle, 
  Briefcase, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Filter,
  CheckCircle2,
  HelpCircle,
  Layers
} from 'lucide-react';

interface SkillEvidenceGraphViewProps {
  onOpenSourceModal?: (sourceId: string) => void;
}

export const SkillEvidenceGraphView: React.FC<SkillEvidenceGraphViewProps> = ({
  onOpenSourceModal
}) => {
  const { accessLevel, getIntelligenceAccess, consumeDemoIntelligenceSignal } = useAccessControl();
  const [profiles, setProfiles] = useState<SkillEvidenceProfile[]>(() => sourceStore.getSkillEvidenceProfiles());
  const [expandedSkill, setExpandedSkill] = useState<string | null>(profiles[0]?.skillName || null);
  const [viewingSourceId, setViewingSourceId] = useState<string | null>(null);
  const [inspectingSkillWhy, setInspectingSkillWhy] = useState<string | null>(null);
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const isFullAccess = accessLevel === 'FULL_ACCESS';
  const isGuest = accessLevel === 'PUBLIC_GUEST';
  const intelAccess = getIntelligenceAccess('full_knowledge_graph');

  // Access-aware visible profiles: Guest/Demo only receive top 2 curated skills in DOM
  const visibleProfiles = isFullAccess ? profiles : profiles.slice(0, 2);

  const metrics = sourceStore.getAggregateMetrics();

  const toggleSkill = (skillName: string) => {
    if (expandedSkill === skillName) {
      setExpandedSkill(null);
      return;
    }
    if (isGuest && skillName !== profiles[0]?.skillName) {
      setIsGateModalOpen(true);
      return;
    }
    if (!isFullAccess) {
      const allowed = consumeDemoIntelligenceSignal('full_knowledge_graph', `skill-${skillName}`);
      if (!allowed) {
        setIsGateModalOpen(true);
        return;
      }
    }
    setExpandedSkill(skillName);
  };

  const handleInspectWhy = (skillName: string) => {
    if (isGuest) {
      setIsGateModalOpen(true);
      return;
    }
    if (!isFullAccess) {
      const allowed = consumeDemoIntelligenceSignal('proprietary_scoring_logic', `why-${skillName}`);
      if (!allowed) {
        setIsGateModalOpen(true);
        return;
      }
    }
    setInspectingSkillWhy(skillName);
  };

  const currentViewingSource = viewingSourceId ? sourceStore.getSourceById(viewingSourceId) : null;

  return (
    <div className="space-y-6">
      
      {/* Aggregated Intelligence Metrics Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-400/30 text-xs font-black uppercase tracking-wider">
                Aggregated Career Proof
              </span>
              <IntelligenceModeBadge capability="full_knowledge_graph" />
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-300">Skill → Evidence → Source Traceability</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Skill Evidence Graph &amp; Capability Ledger
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Every claimed skill is backed by an auditable chain of custody: from passive learning to validated real-world delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700 shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Validated Skills</span>
              <span className="text-sm font-black text-white">{isFullAccess ? metrics.validatedSkillsCount : 2} {isFullAccess ? 'Proven' : 'Sample'}</span>
            </div>
          </div>
        </div>

        {/* Aggregate Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Learning Sources</span>
            <span className="text-lg font-black text-blue-300 mt-0.5 block">{metrics.learningSources}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Credentials</span>
            <span className="text-lg font-black text-amber-300 mt-0.5 block">{metrics.credentials}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Projects</span>
            <span className="text-lg font-black text-indigo-300 mt-0.5 block">{metrics.projects}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Artifacts</span>
            <span className="text-lg font-black text-purple-300 mt-0.5 block">{metrics.artifacts}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Assessments</span>
            <span className="text-lg font-black text-rose-300 mt-0.5 block">{metrics.assessments}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Evidence Coverage</span>
            <span className="text-lg font-black text-emerald-400 mt-0.5 block">{metrics.evidenceCoverage}%</span>
          </div>
        </div>
      </div>

      {/* Skills Graph Drill-down List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="space-y-0.5">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              {isFullAccess
                ? `Verified Capability Breakdown (${visibleProfiles.length} Skills)`
                : `Sample Capability Breakdown (${visibleProfiles.length} Curated Skills)`}
            </h4>
            <p className="text-xs text-slate-500">
              Click any skill to drill down into the supporting evidence chain (Skill → Evidence → Source).
            </p>
          </div>
          <IntelligenceModeBadge capability="full_knowledge_graph" />
        </div>

        <div className="space-y-3 pt-1">
          {visibleProfiles.map(profile => {
            const isExpanded = expandedSkill === profile.skillName;
            const maxStrengthDef = getEvidenceStrengthDefinition(profile.maxStrength);

            return (
              <div 
                key={profile.canonicalSkillId}
                className={`rounded-2xl border transition-all ${
                  isExpanded ? 'bg-slate-50/70 border-blue-400 shadow-2xs' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Skill Item Header */}
                <div 
                  onClick={() => toggleSkill(profile.skillName)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 tracking-tight">
                          {profile.skillName}
                        </h4>
                        <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-blue-100 text-blue-800">
                          {isFullAccess ? `${profile.confidenceScore}% Confidence` : 'Verified Signal'}
                        </span>
                      </div>
                      
                      {/* Breakdown badges */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium mt-1">
                        <span>{profile.totalSourcesCount} sources total:</span>
                        {profile.breakdown.projects > 0 && (
                          <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                            {profile.breakdown.projects} {profile.breakdown.projects === 1 ? 'project' : 'projects'}
                          </span>
                        )}
                        {profile.breakdown.artifacts > 0 && (
                          <span className="text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                            {profile.breakdown.artifacts} {profile.breakdown.artifacts === 1 ? 'artifact' : 'artifacts'}
                          </span>
                        )}
                        {profile.breakdown.assessments > 0 && (
                          <span className="text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                            {profile.breakdown.assessments} {profile.breakdown.assessments === 1 ? 'case/assessment' : 'cases'}
                          </span>
                        )}
                        {profile.breakdown.credentials > 0 && (
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                            {profile.breakdown.credentials} {profile.breakdown.credentials === 1 ? 'credential' : 'credentials'}
                          </span>
                        )}
                        {profile.breakdown.learningSources > 0 && (
                          <span className="text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                            {profile.breakdown.learningSources} {profile.breakdown.learningSources === 1 ? 'learn source' : 'learn sources'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInspectWhy(profile.skillName);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                      title="Inspect transparent evidence explanation, 4 tiers, and relationship model"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Why do you think I have this?</span>
                    </button>

                    <div className={`px-2.5 py-1 rounded-lg text-xs font-black border flex items-center gap-1.5 ${maxStrengthDef.colorClass}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Peak: L{profile.maxStrength} ({maxStrengthDef.name})</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Drill-down (Skill → Evidence → Source) */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-3 border-t border-slate-200/80 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pt-2">
                      <span>Supporting Evidence Chain:</span>
                      <span className="text-[11px] text-slate-400 font-normal">Click a source to inspect full record</span>
                    </div>

                    <div className="space-y-2">
                      {(isFullAccess ? profile.evidenceList : profile.evidenceList.slice(0, 2)).map((item, idx) => {
                        const sDef = getEvidenceStrengthDefinition(item.evidenceStrength);
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (isGuest) {
                                setIsGateModalOpen(true);
                                return;
                              }
                              if (onOpenSourceModal) {
                                onOpenSourceModal(item.sourceId);
                              } else {
                                setViewingSourceId(item.sourceId);
                              }
                            }}
                            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-2xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-md ${sDef.badgeBg}`}>
                                  L{item.evidenceStrength} • {item.relationType.toUpperCase()}
                                </span>
                                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {item.sourceTitle}
                                </span>
                              </div>

                              {item.quoteOrStatement && (
                                <p className="text-xs text-slate-600 line-clamp-1 italic">
                                  "{item.quoteOrStatement}"
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0 text-xs font-semibold text-blue-600">
                              <span>Inspect Source</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Intelligence Gate for Guest / Demo */}
      {!isFullAccess && (
        <CareerOSIntelligenceGate
          capability="full_knowledge_graph"
          variant="inline"
          sampleCountLabel={
            isGuest
              ? `Showing ${visibleProfiles.length} sample skill nodes · Full Knowledge Graph is protected`
              : `Demo Preview · ${intelAccess.demoSignalsUsed} / ${intelAccess.demoSignalsLimit} graph skill inspections used`
          }
        />
      )}

      {/* Embedded Source Detail Modal if needed */}
      {currentViewingSource && (
        <SourceDetailModal
          source={currentViewingSource}
          onClose={() => setViewingSourceId(null)}
          onUpdate={(updated) => {
            sourceStore.updateSource(updated.id, updated);
            setProfiles(sourceStore.getSkillEvidenceProfiles());
          }}
        />
      )}

      {/* "Why do you think I have this?" Evidence Modal */}
      {inspectingSkillWhy && (
        <SkillWhyEvidenceModal
          skillName={inspectingSkillWhy}
          onClose={() => setInspectingSkillWhy(null)}
          onOpenSourceDetail={(sourceId) => {
            setInspectingSkillWhy(null);
            if (onOpenSourceModal) {
              onOpenSourceModal(sourceId);
            } else {
              setViewingSourceId(sourceId);
            }
          }}
          onSkillUpdated={() => {
            setProfiles(sourceStore.getSkillEvidenceProfiles());
          }}
        />
      )}

      {isGateModalOpen && (
        <CareerOSIntelligenceGate
          capability="full_knowledge_graph"
          variant="modal"
          onClose={() => setIsGateModalOpen(false)}
        />
      )}

    </div>
  );
};
