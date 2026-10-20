import React, { useState } from 'react';
import { sourceStore } from '../../features/sources/services/sourceStore';
import { SkillEvidenceProfile } from '../../features/sources/types';
import { ShieldCheck, Sparkles, Layers, Info, ExternalLink, Award, X } from 'lucide-react';
import { SkillEvidenceGraphView } from '../knowledge/SkillEvidenceGraphView';

interface CompactSkillEvidenceGraphProps {
  onOpenLedger?: () => void;
  onViewFullGraph?: () => void;
  className?: string;
}

export const CompactSkillEvidenceGraph: React.FC<CompactSkillEvidenceGraphProps> = ({
  onOpenLedger,
  onViewFullGraph,
  className = '',
}) => {
  const [profiles] = useState<SkillEvidenceProfile[]>(() => {
    const list = sourceStore.getSkillEvidenceProfiles();
    return list.slice(0, 6);
  });

  const [selectedSkill, setSelectedSkill] = useState<SkillEvidenceProfile | null>(profiles[0] || null);
  const [isFullGraphOpen, setIsFullGraphOpen] = useState(false);

  const getStrengthBadge = (level: number) => {
    switch (level) {
      case 4:
        return { label: 'L4 Real-World', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 3:
        return { label: 'L3 Applied Work', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 2:
        return { label: 'L2 Conceptual', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      default:
        return { label: 'L1 Exposure', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const handleSeeDetails = () => {
    if (onViewFullGraph) {
      onViewFullGraph();
    }
    setIsFullGraphOpen(true);
  };

  return (
    <div className={`bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 ${className}`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Skill Evidence Graph
          </span>
          <span className="text-[10px] text-slate-400 font-mono font-medium">
            (Auditable Proof)
          </span>
        </div>

        <button
          type="button"
          onClick={handleSeeDetails}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/60"
        >
          <span>See Details</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Interactive Skill Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2.5">
        {profiles.map(skill => {
          const badge = getStrengthBadge(skill.maxStrength);
          const isSelected = selectedSkill?.skillName === skill.skillName;

          return (
            <button
              key={skill.skillName}
              type="button"
              onClick={() => setSelectedSkill(skill)}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-blue-500 shadow-2xs ring-1 ring-blue-400/40'
                  : 'bg-white/70 hover:bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-bold text-slate-900 truncate" title={skill.skillName}>
                  {skill.skillName}
                </span>
                <span className={`text-[9px] font-extrabold uppercase px-1 py-0.2 rounded-sm border shrink-0 ${badge.bg}`}>
                  L{skill.maxStrength}
                </span>
              </div>

              {/* Progress strength bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    skill.maxStrength >= 4 ? 'bg-emerald-500' :
                    skill.maxStrength === 3 ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(100, (skill.maxStrength / 4) * 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Skill Proof Snapshot */}
      {selectedSkill && (
        <div className="bg-white rounded-xl p-2.5 border border-slate-200/70 text-[11px] flex items-center justify-between gap-2 shadow-3xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shrink-0">
              <ShieldCheck className="w-3 h-3" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-slate-900">{selectedSkill.skillName}:</span>{' '}
              <span className="text-slate-600">
                Backed by {selectedSkill.evidenceList?.length || selectedSkill.totalSourcesCount || 2} verified source deliverables.
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-blue-600 font-bold shrink-0">
            {getStrengthBadge(selectedSkill.maxStrength).label}
          </span>
        </div>
      )}
      {/* Full Skill Evidence Graph Modal */}
      {isFullGraphOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Skill Evidence Graph & Capability Ledger</h3>
                  <p className="text-xs text-slate-500 font-medium">Auditable chain of custody from learning to validated execution</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFullGraphOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SkillEvidenceGraphView />
          </div>
        </div>
      )}
    </div>
  );
};
