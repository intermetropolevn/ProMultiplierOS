import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  GitBranch, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  Award,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CrossSourceSynthesis } from '../../features/knowledge/types';
import { knowledgeStore } from '../../features/knowledge/services/knowledgeStore';

export const SynthesesView: React.FC = () => {
  const [syntheses] = useState<CrossSourceSynthesis[]>(knowledgeStore.getSyntheses());
  const [selectedSynthesis, setSelectedSynthesis] = useState<CrossSourceSynthesis | null>(syntheses[0] || null);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 to-slate-900 text-white p-6 rounded-2xl border border-purple-900/50 shadow-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded text-[11px] font-bold uppercase tracking-wider">
              Cross-Source Intelligence
            </span>
            <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[11px] font-bold">
              Multi-Author Syntheses
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Career OS Syntheses & Integrated Archetypes
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 max-w-3xl leading-relaxed">
            Industry mastery rarely comes from a single book. Career OS Syntheses cross-examine multiple authoritative texts, research papers, and frameworks to produce high-order interview strategies and architectural decision trees.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* List */}
        <div className="lg:col-span-5 space-y-3">
          {syntheses.map(synth => {
            const isSelected = selectedSynthesis?.id === synth.id;
            return (
              <div
                key={synth.id}
                onClick={() => setSelectedSynthesis(synth)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50/50 border-purple-500 shadow-sm ring-1 ring-purple-500/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                      {synth.domain}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded">
                      {synth.participatingSources.length} Sources
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {synth.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {synth.synthesizedTakeaway}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Synthesis Detail Inspector */}
        <div className="lg:col-span-7">
          {selectedSynthesis ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 sticky top-6">
              
              <div className="border-b border-slate-100 pb-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-[10px] font-extrabold uppercase">
                    Career OS Synthesis
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• {selectedSynthesis.domain}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedSynthesis.title}
                </h2>
                <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs sm:text-sm text-purple-950 font-medium leading-relaxed">
                  "{selectedSynthesis.synthesizedTakeaway}"
                </div>
              </div>

              {/* Participating Sources Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Participating Sources & Specific Author Contributions ({selectedSynthesis.participatingSources.length})
                </h4>
                <div className="space-y-2.5">
                  {selectedSynthesis.participatingSources.map((source, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-slate-900">
                          {source.sourceName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full uppercase">
                          {source.sourceType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-blue-600 block">
                        by {source.author}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        <strong>Contribution:</strong> {source.coreContribution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Synthesis Rationale */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Why This Synthesis Matters (Calibration Rationale)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedSynthesis.synthesisRationale}
                </p>
              </div>

              {/* Roles and Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Target Roles
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSynthesis.relevantRoles.map(r => (
                      <span key={r} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-bold">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Target Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSynthesis.relevantSkills.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-md text-xs font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
              Select a synthesis to view multi-author breakdown
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
