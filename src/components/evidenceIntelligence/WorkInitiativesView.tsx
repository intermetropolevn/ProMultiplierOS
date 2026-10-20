import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Users,
  Compass,
  Briefcase
} from 'lucide-react';
import { WorkInitiative } from '../../features/evidenceIntelligence/types';
import { InitiativeDetailModal } from './InitiativeDetailModal';

interface WorkInitiativesViewProps {
  initiatives: WorkInitiative[];
  onOpenQuickCapture: () => void;
}

export const WorkInitiativesView: React.FC<WorkInitiativesViewProps> = ({
  initiatives,
  onOpenQuickCapture
}) => {
  const [selectedInitiative, setSelectedInitiative] = useState<WorkInitiative | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInitiatives = initiatives.filter(init => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      init.title.toLowerCase().includes(q) ||
      init.objective.toLowerCase().includes(q) ||
      init.userRole.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Work &amp; Initiatives
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Coherent Work Entity Resolution</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Work &amp; Initiatives Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Multiple fragmented activities belong to the same piece of work. An initiative unifies tasks, PRDs, meetings, and outcomes into one cohesive career signal.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenQuickCapture}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Initiative Signal</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search initiatives, objectives, roles..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredInitiatives.length}</strong> Initiatives
          </span>
        </div>
      </div>

      {/* 2. Visual Aggregation Initiatives List */}
      <div className="space-y-4">
        {filteredInitiatives.map((init) => (
          <div
            key={init.id}
            onClick={() => setSelectedInitiative(init)}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all cursor-pointer p-5 sm:p-6 space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {init.userRole}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-mono text-slate-500">{init.timeframe}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {init.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {init.status}
                </span>
                <span className="p-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {init.objective}
            </p>

            {/* Visual Evidence Sources Area (Section 5) */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Aggregated Evidence Sources ({init.activities.length} signals linked):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {init.sourceDistribution.map((sd, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                      {sd.source}
                    </span>
                    <span className="font-black text-slate-900 text-sm mt-0.5 block">{sd.count}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{sd.details}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Measured Outcomes Bar */}
            {init.outcomes.length > 0 && (
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-bold text-emerald-950">Primary Shipped Outcome:</span>
                  <span className="text-emerald-800 font-semibold">{init.outcomes[0].metricName}</span>
                </div>
                <span className="font-black text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {init.outcomes[0].quantitativeLift}
                </span>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Modal Detail */}
      <InitiativeDetailModal
        isOpen={Boolean(selectedInitiative)}
        onClose={() => setSelectedInitiative(null)}
        initiative={selectedInitiative}
      />

    </div>
  );
};
