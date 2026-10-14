import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Layers, 
  BookOpen, 
  GitBranch, 
  ChevronRight, 
  Award,
  FileText,
  HelpCircle,
  Hash,
  Star
} from 'lucide-react';
import { KnowledgeUnit, KnowledgeUnitType, KnowledgeOrigin } from '../../features/knowledge/types';
import { knowledgeStore } from '../../features/knowledge/services/knowledgeStore';

interface KnowledgeUnitsViewProps {
  onSelectUnit?: (unit: KnowledgeUnit) => void;
  onOpenGraph?: (unitId: string) => void;
}

export const KnowledgeUnitsView: React.FC<KnowledgeUnitsViewProps> = ({
  onSelectUnit,
  onOpenGraph
}) => {
  const [units] = useState<KnowledgeUnit[]>(knowledgeStore.getKnowledgeUnits());
  const [selectedUnit, setSelectedUnit] = useState<KnowledgeUnit | null>(units[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const types: KnowledgeUnitType[] = Array.from(new Set(units.map(u => u.type)));
  const domains = Array.from(new Set(units.map(u => u.domain)));

  const filteredUnits = units.filter(u => {
    const matchesSearch = 
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || u.type === selectedType;
    const matchesDomain = selectedDomain === 'all' || u.domain === selectedDomain;
    return matchesSearch && matchesType && matchesDomain;
  });

  const getOriginBadge = (origin: KnowledgeOrigin) => {
    switch (origin) {
      case 'source_direct':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            Source Direct
          </span>
        );
      case 'careeros_synthesis':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-2.5 h-2.5" />
            Career OS Synthesis
          </span>
        );
      case 'source_derived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            Source Derived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
            {origin}
          </span>
        );
    }
  };

  const renderAuthorityStars = (authority: number) => {
    return (
      <div className="flex items-center gap-0.5" title={`Source Authority: ${authority}/5`}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= authority
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-200'
            }`}
          />
        ))}
        <span className="text-[11px] font-bold text-slate-600 ml-1">({authority}/5)</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-extrabold uppercase">
              Canonical Knowledge Units
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {units.length} total curated concepts
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Ontological Concepts & Theoretical Principles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Every Knowledge Unit preserves full provenance: distinguishing verifiable Source Definitions from Career OS Interview Interpretations with authority-weighted confidence scores.
          </p>
        </div>

        {onOpenGraph && selectedUnit && (
          <button
            onClick={() => onOpenGraph(selectedUnit.id)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
          >
            <GitBranch className="w-4 h-4 text-blue-400" />
            <span>Inspect in Knowledge Graph</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search concepts, frameworks, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-500 shrink-0">Type:</span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors shrink-0 ${
              selectedType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Types
          </button>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold capitalize transition-colors shrink-0 ${
                selectedType === t
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredUnits.map((unit) => {
            const isSelected = selectedUnit?.id === unit.id;
            return (
              <div
                key={unit.id}
                onClick={() => setSelectedUnit(unit)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-extrabold uppercase">
                        {unit.type.replace(/_/g, ' ')}
                      </span>
                      {getOriginBadge(unit.knowledgeOrigin)}
                    </div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {unit.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {unit.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  <span>{unit.domain}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-600">{Math.round(unit.confidence * 100)}% conf</span>
                    <span>•</span>
                    <span>{unit.sourceCount} {unit.sourceCount === 1 ? 'source' : 'sources'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Inspector */}
        <div className="lg:col-span-7">
          {selectedUnit ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 sticky top-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs font-bold uppercase tracking-wider">
                      {selectedUnit.type.replace(/_/g, ' ')}
                    </span>
                    {getOriginBadge(selectedUnit.knowledgeOrigin)}
                  </div>

                  <div className="flex items-center gap-3">
                    {renderAuthorityStars(selectedUnit.sourceAuthority)}
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedUnit.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedUnit.summary}
                </p>

                {/* Quantitative Verification Strip */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Confidence
                    </span>
                    <span className="text-base font-black text-emerald-600">
                      {Math.round(selectedUnit.confidence * 100)}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Quality Score
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {selectedUnit.qualityScore} / 100
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Corroborating Sources
                    </span>
                    <span className="text-base font-black text-blue-600">
                      {selectedUnit.sourceCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* DUAL INTERPRETATION COMPARISON (Source vs Career OS) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Source Concept vs. Career OS Synthesis
                  </h4>
                  <span className="text-[11px] text-slate-400 italic">
                    Strict boundary separation enforced
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Official Source Definition */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Official Source Definition</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedUnit.officialDefinition || 'Source definition preserved verbatim from official literature.'}
                    </p>
                  </div>

                  {/* Career OS Applied Interpretation */}
                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Career OS Interview Synthesis</span>
                    </div>
                    <p className="text-xs text-purple-800 leading-relaxed">
                      {selectedUnit.careerosInterpretation || 'Applied context for case studies and competency evaluation.'}
                    </p>
                  </div>

                </div>
              </div>

              {/* Roles and Skills Taxonomy Mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Associated Roles
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUnit.roles.map(r => (
                      <span key={r} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Competency Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUnit.skills.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Provenance & Citation Ledger */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Academic Citations & Provenance Ledger ({selectedUnit.sources.length})
                </h4>

                <div className="space-y-2.5">
                  {selectedUnit.sources.map((citation, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">
                            {citation.title}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            by {citation.author} {citation.publishedAt ? `(${citation.publishedAt})` : ''}
                          </span>
                        </div>

                        {citation.location && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-bold">
                            {citation.location}
                          </span>
                        )}
                      </div>

                      <blockquote className="text-xs text-slate-600 italic pl-3 border-l-2 border-blue-400">
                        "{citation.citationText}"
                      </blockquote>

                      {citation.sourceUrl && (
                        <a
                          href={citation.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 pt-1"
                        >
                          <span>Verify Original Source Reference</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Provenance Statement */}
              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span><strong>Provenance:</strong> {selectedUnit.provenance}</span>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Select a knowledge unit to view complete citations and interpretations</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
