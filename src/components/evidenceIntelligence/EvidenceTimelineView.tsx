import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Filter, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  FileText,
  Clock,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { EvidenceItem } from '../../features/evidenceIntelligence/types';
import { EvidenceDetailModal } from './EvidenceDetailModal';

interface EvidenceTimelineViewProps {
  evidenceList: EvidenceItem[];
  onOpenQuickCapture: () => void;
}

export const EvidenceTimelineView: React.FC<EvidenceTimelineViewProps> = ({
  evidenceList,
  onOpenQuickCapture
}) => {
  const [selectedCapability, setSelectedCapability] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEvidenceDetail, setActiveEvidenceDetail] = useState<EvidenceItem | null>(null);

  // Group evidence by Year -> Month
  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((item) => {
      if (selectedCapability !== 'all' && !item.capabilities.includes(selectedCapability)) return false;
      if (selectedStatus !== 'all' && item.validationStatus !== selectedStatus) return false;
      if (selectedSource !== 'all' && !item.source.toLowerCase().includes(selectedSource.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesInit = item.linkedInitiativeTitle.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesInit) return false;
      }
      return true;
    });
  }, [evidenceList, selectedCapability, selectedStatus, selectedSource, searchQuery]);

  const timelineYears = useMemo(() => {
    const yearsMap = new Map<number, EvidenceItem[]>();
    filteredEvidence.forEach((item) => {
      const yr = item.year || 2026;
      if (!yearsMap.has(yr)) {
        yearsMap.set(yr, []);
      }
      yearsMap.get(yr)!.push(item);
    });
    return Array.from(yearsMap.entries()).sort((a, b) => b[0] - a[0]);
  }, [filteredEvidence]);

  const allCapabilities = useMemo(() => {
    const caps = new Set<string>();
    evidenceList.forEach(e => e.capabilities.forEach(c => caps.add(c)));
    return Array.from(caps);
  }, [evidenceList]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Evidence Timeline
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Demonstrated Progression Over Time</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Chronological Career Evidence Stream
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Track how real work demonstrates evolving capabilities across product, technology, commercial monetization, and leadership over quarters and years.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenQuickCapture}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          >
            + Add Reflection
          </button>
        </div>

        {/* Filter Controls Strip (Section 12) */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timeline..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Filter by Capability */}
            <select
              value={selectedCapability}
              onChange={(e) => setSelectedCapability(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Capability: All Domains</option>
              <option value="cap-product-strategy">Product Strategy</option>
              <option value="cap-experimentation">Experimentation</option>
              <option value="cap-technical-understanding">Technical Architecture</option>
              <option value="cap-monetization">Monetization</option>
              <option value="cap-stakeholder-mgmt">Stakeholder Management</option>
            </select>

            {/* Filter by Validation Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Status: All Statuses</option>
              <option value="Validated">Validated</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Suggested">Suggested</option>
            </select>

            {/* Filter by Source */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Source: All Connectors</option>
              <option value="Jira">Jira</option>
              <option value="Notion">Notion</option>
              <option value="GitHub">GitHub</option>
              <option value="Meetings">Google Calendar</option>
              <option value="Analytics">Analytics / Amplitude</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Chronological Timeline Stream */}
      <div className="space-y-8">
        {timelineYears.map(([year, itemsInYear]) => (
          <div key={year} className="space-y-4">
            
            {/* Year Header */}
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-slate-900 tracking-tight font-mono">{year}</span>
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-xs text-slate-400 font-mono">{itemsInYear.length} Verified Evidence Records</span>
            </div>

            {/* Evidence items under year */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 ml-4 space-y-4">
              {itemsInYear.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setActiveEvidenceDetail(ev)}
                  className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-blue-400 transition-all p-5 cursor-pointer group"
                >
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white border border-blue-600 group-hover:scale-125 transition-transform" />

                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {ev.month}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {ev.capabilityLabels[0] || 'Core Capability'}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {ev.linkedInitiativeTitle}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      ev.validationStatus === 'Validated' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      {ev.validationStatus}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {ev.description}
                  </p>

                  {/* Badges strip: capabilities + outcomes */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {ev.capabilityLabels.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded text-[11px] font-bold">
                          {c}
                        </span>
                      ))}
                      <span className="text-[11px] text-slate-400">· Role: {ev.role} ({ev.contributionType})</span>
                    </div>

                    {ev.outcomes.length > 0 && (
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        {ev.outcomes[0].quantitativeLift}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

        {timelineYears.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No evidence records matched your active filter criteria.
          </div>
        )}
      </div>

      {/* Evidence Detail Modal */}
      <EvidenceDetailModal
        isOpen={Boolean(activeEvidenceDetail)}
        onClose={() => setActiveEvidenceDetail(null)}
        evidence={activeEvidenceDetail}
      />

    </div>
  );
};
