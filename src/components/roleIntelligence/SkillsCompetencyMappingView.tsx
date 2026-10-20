import React, { useState, useMemo } from 'react';
import { 
  RoleIntelligenceItem, 
  RoleCompetencyItem,
  CareerOSProficiency
} from '../../features/roleIntelligence/types';
import { 
  BookOpen, 
  Award, 
  Search, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Target
} from 'lucide-react';

interface SkillsCompetencyMappingViewProps {
  role: RoleIntelligenceItem;
  onNavigateToReadiness: () => void;
}

export const SkillsCompetencyMappingView: React.FC<SkillsCompetencyMappingViewProps> = ({
  role,
  onNavigateToReadiness
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Skill Families' },
    { id: 'product', label: 'Product Skills' },
    { id: 'technical', label: 'Technical Skills' },
    { id: 'business', label: 'Business Skills' },
    { id: 'operational', label: 'Operational Skills' },
    { id: 'leadership', label: 'Leadership Skills' },
    { id: 'core', label: 'Core Competencies' }
  ];

  const getProficiencyBadge = (level: CareerOSProficiency) => {
    switch (level) {
      case 'strategic': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'senior': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'advanced': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'working': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'foundational': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredCompetencies = useMemo(() => {
    return role.competencies.filter(c => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [role.competencies, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Role Intelligence</span>
              <span aria-hidden="true">/</span>
              <span>Skills &amp; Competency Architecture</span>
              <span aria-hidden="true">/</span>
              <strong className="text-slate-900">{role.title}</strong>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Skills &amp; Competency Mapping
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Standardized capability taxonomy connecting role expectations to external occupational references (SFIA, O*NET, ESCO, SHL).
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToReadiness}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Check My Skill Readiness</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter competencies..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Skills Summary Cards: Breakdown by Skill Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Core Product Skills */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
            Product Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {role.keySkills.slice(0, 4).map((s, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-blue-50/60 border border-blue-200/60 text-slate-800 text-[11px] rounded-md font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Systems */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
            Technical Knowledge
          </span>
          <div className="flex flex-wrap gap-1.5">
            {role.technicalKnowledge.map((s, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-purple-50/60 border border-purple-200/60 text-slate-800 text-[11px] rounded-md font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Business & Commercial */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
            Business Domain
          </span>
          <div className="flex flex-wrap gap-1.5">
            {role.businessKnowledge.map((s, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-emerald-50/60 border border-emerald-200/60 text-slate-800 text-[11px] rounded-md font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Behavioral Competencies */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
            Behavioral Leadership
          </span>
          <div className="flex flex-wrap gap-1.5">
            {role.behavioralCompetencies.map((s, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-amber-50/60 border border-amber-200/60 text-slate-800 text-[11px] rounded-md font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Detailed Competencies Table with External Framework Cross-References */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Evaluated Competencies &amp; External Standards Cross-Reference
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mapped against international occupational frameworks: SFIA (Skills Framework for the Information Age), O*NET, ESCO, and SHL.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {filteredCompetencies.length} Competencies
          </span>
        </div>

        <div className="space-y-4">
          {filteredCompetencies.map((comp) => (
            <div
              key={comp.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{comp.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 capitalize px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                    {comp.category}
                  </span>
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize self-start sm:self-auto ${getProficiencyBadge(comp.requiredLevel)}`}>
                  {comp.requiredLevel} Level
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {comp.description}
              </p>

              {/* External Framework Badges */}
              {comp.externalFrameworkRefs && comp.externalFrameworkRefs.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    External References:
                  </span>
                  {comp.externalFrameworkRefs.map((ref, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 shadow-3xs"
                    >
                      <strong className="text-blue-700 font-mono text-[11px]">{ref.framework}</strong>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-[10px] text-slate-600 font-semibold">{ref.codeOrLevel}</span>
                      <span className="text-slate-500 text-[11px] hidden md:inline">({ref.description})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
