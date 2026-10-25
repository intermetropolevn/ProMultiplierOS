import React, { useState } from 'react';
import { JobListing } from '../../types';
import { sourceStore } from '../../features/sources/services/sourceStore';
import { getEvidenceStrengthDefinition } from '../../features/sources/taxonomy';
import { SkillWhyEvidenceModal } from '../knowledge/SkillWhyEvidenceModal';
import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ArrowRight, 
  TrendingUp, 
  ExternalLink,
  Target,
  Sparkles,
  Layers,
  FolderGit2,
  HelpCircle
} from 'lucide-react';

interface JobEvidenceMatchModalProps {
  job: JobListing;
  onClose: () => void;
  onOpenSourceDetail?: (sourceId: string) => void;
}

export const JobEvidenceMatchModal: React.FC<JobEvidenceMatchModalProps> = ({
  job,
  onClose,
  onOpenSourceDetail
}) => {
  const { getIntelligenceAccess, consumeDemoIntelligenceSignal } = useAccessControl();
  const matchAccess = getIntelligenceAccess('intelligent_matching');
  const isFull = matchAccess.isFull;
  const [inspectingSkill, setInspectingSkill] = useState<string | null>(null);
  const [showGateModal, setShowGateModal] = useState(false);
  const matchReport = sourceStore.getJobEvidenceMatch(job);
  const visibleRequirements = isFull ? matchReport.requirements : matchReport.requirements.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/60 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                Job Requirement vs User Evidence
              </span>
              <span className="text-xs text-slate-500 font-semibold">•</span>
              <span className="text-xs font-bold text-slate-700">{matchReport.company}</span>
              <IntelligenceModeBadge capability="intelligent_matching" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Evidence Match: {matchReport.jobTitle}
            </h2>
            <p className="text-xs text-slate-500">
              Validating candidate career proof across 8 source families against hiring criteria.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aggregate Match Metrics Bar */}
        <div className="p-6 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white">
          {/* Knowledge Coverage */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Knowledge Coverage
              </span>
              <span className="text-lg font-black text-blue-700">
                {matchReport.knowledgeCoverage}%
              </span>
            </div>
            <div className="w-full bg-blue-200/50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${matchReport.knowledgeCoverage}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-800">
              Theoretical understanding, courses, & books.
            </p>
          </div>

          {/* Application Coverage */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Application Coverage
              </span>
              <span className="text-lg font-black text-emerald-700">
                {matchReport.applicationCoverage}%
              </span>
            </div>
            <div className="w-full bg-emerald-200/50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${matchReport.applicationCoverage}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-800">
              Real projects, artifacts, code, & cases.
            </p>
          </div>

          {/* Average Evidence Strength */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                Average Evidence Strength
              </span>
              <span className="text-lg font-black text-purple-700">
                L{matchReport.overallEvidenceStrengthAvg} / 6.0
              </span>
            </div>
            <div className="w-full bg-purple-200/50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(matchReport.overallEvidenceStrengthAvg / 6) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-purple-800">
              Verified output tier across career artifacts.
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Requirement Breakdown Table / Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Skill Requirement vs User Evidence Breakdown</span>
              </h3>
              {!isFull && (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  Showing {visibleRequirements.length} sample requirements
                </span>
              )}
            </div>

            <div className="space-y-3">
              {visibleRequirements.map(req => {
                const strengthInfo = getEvidenceStrengthDefinition(req.userEvidenceStrength);
                return (
                  <div 
                    key={req.skill} 
                    className={`p-4 rounded-2xl border transition-all ${
                      req.status === 'strongly_proven' 
                        ? 'bg-emerald-50/30 border-emerald-200' 
                        : req.status === 'learned_only' 
                        ? 'bg-amber-50/30 border-amber-200'
                        : 'bg-rose-50/30 border-rose-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {req.skill}
                        </span>
                        {req.isPreferred && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            Preferred
                          </span>
                        )}
                        <button
                          onClick={() => {
                            if (matchAccess.isGuest) {
                              setShowGateModal(true);
                              return;
                            }
                            if (matchAccess.isDemo) {
                              const allowed = consumeDemoIntelligenceSignal('intelligent_matching', `${job.id}_${req.skill}`);
                              if (!allowed) {
                                setShowGateModal(true);
                                return;
                              }
                            }
                            setInspectingSkill(req.skill);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline px-2 py-0.5 rounded-md bg-blue-50/60 hover:bg-blue-100/60 cursor-pointer transition-colors"
                          title="View 'Why do you think I have this?' transparent evidence ledger"
                        >
                          <HelpCircle className="w-3 h-3 text-blue-500" />
                          <span>Why do you think I have this?</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          req.status === 'strongly_proven'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'learned_only'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {req.status === 'strongly_proven' ? 'Strongly Proven' : req.status === 'learned_only' ? 'Learned / Theoretical' : 'Evidence Gap'}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          User Strength: L{req.userEvidenceStrength} ({strengthInfo.name})
                        </span>
                      </div>
                    </div>

                    {/* Supporting Sources */}
                    <div className="pt-2">
                      {req.supportingSources.length > 0 ? (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-500">
                            Supporting Sources ({req.supportingSources.length}):
                          </span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {req.supportingSources.map(src => (
                              <button
                                key={src.id}
                                onClick={() => onOpenSourceDetail && onOpenSourceDetail(src.id)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-xs text-slate-800 transition-colors cursor-pointer shadow-2xs"
                              >
                                <span className="font-semibold truncate max-w-[200px]">{src.title}</span>
                                <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                                  L{src.strength}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-rose-600 flex items-center gap-1 pt-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>No direct learning, project, or credential sources found in library.</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Gaps & Actionable Recommendations */}
          {isFull ? (
            matchReport.demonstratedGaps.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                    Identified Evidence Gaps
                  </h4>
                </div>

                <ul className="space-y-1 text-xs text-amber-900">
                  {matchReport.demonstratedGaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>

                {matchReport.recommendedActions.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider block mb-1">
                      Recommended Gap-Closing Actions:
                    </span>
                    <ul className="space-y-1 text-xs text-amber-800">
                      {matchReport.recommendedActions.map((act, i) => (
                        <li key={i} className="flex items-center gap-1.5 font-medium">
                          <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          ) : (
            <CareerOSIntelligenceGate
              capability="intelligent_matching"
              title="Complete Job vs. Evidence Matching & Gap Analysis"
              subtitle="Unlock full multi-requirement match scoring, verified gap diagnostics, and personalized gap-closing build plans."
            />
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close Match Report
          </button>
        </div>

      </div>

      {/* "Why do you think I have this?" Evidence Modal */}
      {inspectingSkill && (
        <SkillWhyEvidenceModal
          skillName={inspectingSkill}
          onClose={() => setInspectingSkill(null)}
          onOpenSourceDetail={(sourceId) => {
            setInspectingSkill(null);
            if (onOpenSourceDetail) onOpenSourceDetail(sourceId);
          }}
        />
      )}

      {showGateModal && (
        <CareerOSIntelligenceGate
          capability="intelligent_matching"
          variant="modal"
          onClose={() => setShowGateModal(false)}
          onContinueDemo={() => setShowGateModal(false)}
        />
      )}
    </div>
  );
};
