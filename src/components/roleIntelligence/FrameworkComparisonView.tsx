import React, { useState, useMemo } from 'react';
import { FrameworkMetadata, FrameworkType } from '../../features/roleIntelligence/types';
import { FRAMEWORK_METADATA_LIST } from '../../features/roleIntelligence/data/rolesIntelligenceData';
import { 
  SlidersHorizontal, 
  Search, 
  Layers, 
  CheckCircle, 
  ShieldCheck, 
  BookOpen, 
  Compass, 
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

interface FrameworkComparisonViewProps {
  onSelectFramework?: (frameworkId: string) => void;
}

export const FrameworkComparisonView: React.FC<FrameworkComparisonViewProps> = ({
  onSelectFramework
}) => {
  const [selectedType, setSelectedType] = useState<FrameworkType | 'all'>('all');
  const [selectedRoleFamily, setSelectedRoleFamily] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const frameworkTypes: { id: FrameworkType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Framework Types' },
    { id: 'job_evaluation', label: 'Job Evaluation' },
    { id: 'job_grading', label: 'Job Grading' },
    { id: 'job_leveling', label: 'Job Leveling' },
    { id: 'career_architecture', label: 'Career Architecture' },
    { id: 'skills_framework', label: 'Skills Framework' },
    { id: 'occupational_framework', label: 'Occupational Framework' }
  ];

  const filteredFrameworks = useMemo(() => {
    return FRAMEWORK_METADATA_LIST.filter(fw => {
      if (selectedType !== 'all' && fw.frameworkType !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = fw.name.toLowerCase().includes(q) || fw.shortName.toLowerCase().includes(q);
        const matchesDesc = fw.primaryPurpose.toLowerCase().includes(q) || fw.evaluationLogic.toLowerCase().includes(q);
        const matchesRoles = fw.bestSuitedRoles.some(r => r.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesRoles) return false;
      }
      return true;
    });
  }, [selectedType, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Role Intelligence</span>
            <span aria-hidden="true">/</span>
            <span>Methodology Observatory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Role Evaluation Frameworks
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Comparative analysis of global job evaluation, grading, and leveling methodologies. Understand the underlying philosophy, factor weightings, and organizational relevance for modern tech and product positions.
          </p>
        </div>

        {/* Filters Strip (Section 10) */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frameworks, factors, roles..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            
            {/* Filter: Framework Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 cursor-pointer"
            >
              {frameworkTypes.map(ft => (
                <option key={ft.id} value={ft.id}>{ft.label}</option>
              ))}
            </select>

            {/* Filter: Role Family */}
            <select
              value={selectedRoleFamily}
              onChange={(e) => setSelectedRoleFamily(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Role Family: All</option>
              <option value="product">Product Management</option>
              <option value="tech">Engineering &amp; Cloud</option>
              <option value="ops">Product &amp; Business Ops</option>
              <option value="solutions">Solutions &amp; Architecture</option>
            </select>

            {/* Filter: Career Track */}
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Track: All Tracks</option>
              <option value="ic">Individual Contributor</option>
              <option value="management">Management Track</option>
              <option value="hybrid">Hybrid / Matrixed</option>
            </select>

            {/* Filter: Industry */}
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Industry: Global Tech &amp; Enterprise</option>
              <option value="saas">B2B SaaS &amp; Cloud</option>
              <option value="fintech">Fintech &amp; Banking</option>
              <option value="deeptech">AI &amp; Deep Tech</option>
            </select>

          </div>

        </div>
      </div>

      {/* 2. Framework Comparison Cards Grid (Section 10) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFrameworks.map((fw) => {
          const isCareerOS = fw.id === 'careeros_native';
          return (
            <div
              key={fw.id}
              className={`rounded-2xl border p-5 sm:p-6 transition-all flex flex-col justify-between ${
                isCareerOS
                  ? 'bg-gradient-to-b from-blue-50/70 to-white border-blue-300 shadow-xs ring-1 ring-blue-500/20'
                  : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-wider block ${isCareerOS ? 'text-blue-700' : 'text-slate-500'}`}>
                      {fw.creator}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {fw.name}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border capitalize ${
                    isCareerOS 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {fw.frameworkType.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Primary Use */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Primary Use
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {fw.primaryPurpose}
                  </p>
                </div>

                {/* Best For */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Best Suited For
                  </span>
                  <ul className="space-y-1">
                    {fw.bestSuitedRoles.map((roleText, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span>{roleText}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Evaluation Logic */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Evaluation Logic
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {fw.evaluationLogic}
                  </p>
                </div>

                {/* Role Coverage */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Role Coverage
                  </span>
                  <p className="text-slate-600 leading-relaxed font-mono text-[11px]">
                    {fw.roleCoverage}
                  </p>
                </div>

                {/* CareerOS Relevance */}
                <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-200/60 space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    CareerOS Relevance
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {fw.careerosRelevance}
                  </p>
                </div>

                {/* Dimensions List */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Evaluation Dimensions ({fw.evaluationDimensions.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {fw.evaluationDimensions.map((dim, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        {dim}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {fw.strengths[0]}
                </span>
                {onSelectFramework && (
                  <button
                    type="button"
                    onClick={() => onSelectFramework(fw.id)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Use in Evaluation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
