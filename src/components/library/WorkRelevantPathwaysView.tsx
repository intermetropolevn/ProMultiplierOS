import React, { useState, useMemo, useEffect } from 'react';
import { 
  WorkRelevantPathway, 
  PathwayType,
  PathwayDifficulty,
  PATHWAY_TYPES_LIST,
  PATHWAY_TYPE_CONFIG,
  PATHWAY_DIFFICULTY_CONFIG 
} from '../../features/knowledge/types/workPathways';
import { workPathwaysStore } from '../../features/knowledge/services/workPathwaysStore';
import { PathwayDetailModal } from './PathwayDetailModal';
import { WorkPathwayFormModal } from './WorkPathwayFormModal';
import { ProvenanceBadge } from './ProvenanceBadge';
import { resolveProvenance } from '../../features/knowledge/types/provenance';
import { 
  GitBranch, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Wrench, 
  Plus, 
  MoreVertical, 
  Edit3, 
  Copy, 
  Archive, 
  Trash2,
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { CANONICAL_ROLES, CANONICAL_DOMAINS } from '../../data/jobTaxonomies';

interface WorkRelevantPathwaysViewProps {
  searchQuery?: string;
  selectedDomain?: string;
  selectedRole?: string;
}

export const WorkRelevantPathwaysView: React.FC<WorkRelevantPathwaysViewProps> = ({
  searchQuery: parentSearch = '',
  selectedDomain: parentDomain = 'all',
  selectedRole: parentRole = 'all'
}) => {
  const [pathways, setPathways] = useState<WorkRelevantPathway[]>(() => workPathwaysStore.getPathways());
  const [viewMode, setViewMode] = useState<'cards' | 'rows'>('cards');
  const [internalSearch, setInternalSearch] = useState('');

  // 9 Explicit Filters requested by user
  const [roleFilter, setRoleFilter] = useState<string>(parentRole);
  const [domainFilter, setDomainFilter] = useState<string>(parentDomain);
  const [functionFilter, setFunctionFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<PathwayType | 'all'>('all');
  const [seniorityFilter, setSeniorityFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [toolFilter, setToolFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<PathwayDifficulty | 'all'>('all');
  const [evidenceLevelFilter, setEvidenceLevelFilter] = useState<number | 'all'>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modals & Menu
  const [activePathwayForModal, setActivePathwayForModal] = useState<WorkRelevantPathway | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPathway, setEditingPathway] = useState<WorkRelevantPathway | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Subscribe to reactive store
  useEffect(() => {
    const unsub = workPathwaysStore.subscribe(() => {
      setPathways(workPathwaysStore.getPathways());
    });
    return unsub;
  }, []);

  // Sync parent props
  useEffect(() => {
    if (parentRole !== 'all') setRoleFilter(parentRole);
  }, [parentRole]);

  useEffect(() => {
    if (parentDomain !== 'all') setDomainFilter(parentDomain);
  }, [parentDomain]);

  // Dynamic filter option lists extracted from dataset
  const availableFunctions = useMemo(() => {
    const set = new Set<string>();
    pathways.forEach(p => { if (p.function) set.add(p.function); });
    return Array.from(set);
  }, [pathways]);

  const availableSkills = useMemo(() => {
    const set = new Set<string>();
    pathways.forEach(p => {
      const skills = p.requiredSkills || p.connectedSkills || [];
      skills.forEach(s => set.add(typeof s === 'string' ? s : s.name));
    });
    return Array.from(set).sort();
  }, [pathways]);

  const availableTools = useMemo(() => {
    const set = new Set<string>();
    pathways.forEach(p => {
      p.toolsAndPlatforms?.forEach(t => set.add(t));
    });
    return Array.from(set).sort();
  }, [pathways]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (roleFilter !== 'all') count++;
    if (domainFilter !== 'all') count++;
    if (functionFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    if (seniorityFilter !== 'all') count++;
    if (skillFilter !== 'all') count++;
    if (toolFilter !== 'all') count++;
    if (difficultyFilter !== 'all') count++;
    if (evidenceLevelFilter !== 'all') count++;
    if (showArchived) count++;
    return count;
  }, [roleFilter, domainFilter, functionFilter, typeFilter, seniorityFilter, skillFilter, toolFilter, difficultyFilter, evidenceLevelFilter, showArchived]);

  // Filter evaluation
  const filteredPathways = useMemo(() => {
    const q = (internalSearch || parentSearch).trim().toLowerCase();

    return pathways.filter(p => {
      // Archive filter
      if (!showArchived && p.isArchived) return false;
      if (showArchived && !p.isArchived) return false;

      // 1. Role Filter
      if (roleFilter !== 'all') {
        const r = (p.parentRole || p.role || '').toLowerCase();
        if (r !== roleFilter.toLowerCase()) return false;
      }

      // 2. Domain Filter
      if (domainFilter !== 'all') {
        const d = (p.domain || '').toLowerCase();
        if (!d.includes(domainFilter.toLowerCase())) return false;
      }

      // 3. Function Filter
      if (functionFilter !== 'all') {
        if (p.function !== functionFilter) return false;
      }

      // 4. Pathway Type Filter
      if (typeFilter !== 'all') {
        if (p.pathwayType !== typeFilter) return false;
      }

      // 5. Seniority Filter
      if (seniorityFilter !== 'all') {
        const matchesSeniority = p.seniorityRelevance?.some(s => s.toLowerCase().includes(seniorityFilter.toLowerCase()));
        if (!matchesSeniority) return false;
      }

      // 6. Skill Filter
      if (skillFilter !== 'all') {
        const skills = (p.requiredSkills || p.connectedSkills || []).map(s => typeof s === 'string' ? s : s.name);
        if (!skills.some(s => s.toLowerCase() === skillFilter.toLowerCase())) return false;
      }

      // 7. Tool Filter
      if (toolFilter !== 'all') {
        if (!p.toolsAndPlatforms?.some(t => t.toLowerCase() === toolFilter.toLowerCase())) return false;
      }

      // 8. Difficulty Filter
      if (difficultyFilter !== 'all') {
        if (p.difficulty !== difficultyFilter) return false;
      }

      // 9. Evidence Level Filter
      if (evidenceLevelFilter !== 'all') {
        const level = p.evidenceLevel || p.evidenceStrengthLevel;
        if (level !== evidenceLevelFilter) return false;
      }

      // Text Search
      if (q) {
        const name = (p.name || p.title || '').toLowerCase();
        const code = (p.codeName || '').toLowerCase();
        const desc = (p.description || p.summary || '').toLowerCase();
        const obj = (p.objective || '').toLowerCase();
        const tools = (p.toolsAndPlatforms || []).join(' ').toLowerCase();
        const skills = (p.requiredSkills || p.connectedSkills || []).map(s => typeof s === 'string' ? s : s.name).join(' ').toLowerCase();

        if (!name.includes(q) && !code.includes(q) && !desc.includes(q) && !obj.includes(q) && !tools.includes(q) && !skills.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [pathways, internalSearch, parentSearch, roleFilter, domainFilter, functionFilter, typeFilter, seniorityFilter, skillFilter, toolFilter, difficultyFilter, evidenceLevelFilter, showArchived]);

  const resetAllFilters = () => {
    setRoleFilter('all');
    setDomainFilter('all');
    setFunctionFilter('all');
    setTypeFilter('all');
    setSeniorityFilter('all');
    setSkillFilter('all');
    setToolFilter('all');
    setDifficultyFilter('all');
    setEvidenceLevelFilter('all');
    setShowArchived(false);
    setInternalSearch('');
  };

  const handleAddNew = () => {
    setEditingPathway(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pathway: WorkRelevantPathway) => {
    setEditingPathway(pathway);
    setIsFormOpen(true);
    setActivePathwayForModal(null);
  };

  const handleDuplicate = (pathway: WorkRelevantPathway) => {
    workPathwaysStore.duplicatePathway(pathway.id);
    setOpenMenuId(null);
  };

  const handleArchive = (pathway: WorkRelevantPathway) => {
    workPathwaysStore.archivePathway(pathway.id);
    setOpenMenuId(null);
    if (activePathwayForModal) setActivePathwayForModal(null);
  };

  const handleDelete = (id: string) => {
    workPathwaysStore.deletePathway(id);
    setOpenMenuId(null);
    if (activePathwayForModal) setActivePathwayForModal(null);
  };

  const handleSave = (pathway: WorkRelevantPathway) => {
    if (editingPathway) {
      workPathwaysStore.updatePathway(editingPathway.id, pathway);
    } else {
      workPathwaysStore.addPathway(pathway);
    }
    setIsFormOpen(false);
    setEditingPathway(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header & Controls Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-indigo-50/90 via-blue-50/70 to-slate-50 border border-indigo-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Work-Relevant Pathway Library
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                  12 Pathway Types
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-3xl pt-0.5">
                Structured operational blueprints capturing day-to-day execution units: inputs, outputs, deliverables, tool stacks, required skills, and calibrated evidence.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
            {/* View Mode Toggle: Cards vs Structured Rows */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('rows')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'rows'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Structured Rows View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Archive Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowArchived(!showArchived)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                showArchived
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{showArchived ? 'Viewing Archived' : 'Active'}</span>
            </button>

            {/* Add Pathway Button */}
            <button
              type="button"
              onClick={handleAddNew}
              className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Pathway</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder="Search pathways by name, objective, skills, or tools..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              showAdvancedFilters || activeFilterCount > 0
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-700 text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 9-Filter Panel: Role, Domain, Function, Pathway Type, Seniority, Skill, Tool, Difficulty, Evidence Level */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 animate-in fade-in duration-150 text-xs">
            {/* 1. Pathway Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Pathway Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as PathwayType | 'all')}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
              >
                <option value="all">All Types (12)</option>
                {PATHWAY_TYPES_LIST.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* 2. Parent Role */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Parent Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
              >
                <option value="all">All Roles</option>
                {CANONICAL_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* 3. Domain */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Domain</label>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
              >
                <option value="all">All Domains</option>
                {CANONICAL_DOMAINS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 4. Function */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Function</label>
              <select
                value={functionFilter}
                onChange={(e) => setFunctionFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
              >
                <option value="all">All Functions</option>
                {availableFunctions.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* 5. Seniority */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Seniority</label>
              <select
                value={seniorityFilter}
                onChange={(e) => setSeniorityFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
              >
                <option value="all">All Seniority</option>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead / Staff</option>
                <option value="Principal">Principal / Fellow</option>
              </select>
            </div>

            {/* 6. Skill */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Skill</label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
              >
                <option value="all">All Skills ({availableSkills.length})</option>
                {availableSkills.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 7. Tool */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Tool / Platform</label>
              <select
                value={toolFilter}
                onChange={(e) => setToolFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
              >
                <option value="all">All Tools ({availableTools.length})</option>
                {availableTools.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* 8. Difficulty */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as PathwayDifficulty | 'all')}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
              >
                <option value="all">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* 9. Evidence Level */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Evidence Level</label>
              <select
                value={evidenceLevelFilter}
                onChange={(e) => setEvidenceLevelFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
              >
                <option value="all">All Evidence Levels</option>
                <option value={1}>Level 1: Foundational</option>
                <option value={2}>Level 2: Applied</option>
                <option value={3}>Level 3: Verified Project</option>
                <option value={4}>Level 4: Production Output</option>
                <option value={5}>Level 5: Authoritative Standard</option>
              </select>
            </div>

            {/* Reset Actions */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={resetAllFilters}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* Counter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
          <span>
            Showing <strong>{filteredPathways.length}</strong> of <strong>{pathways.length}</strong> pathways
          </span>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-indigo-600 hover:underline font-bold cursor-pointer"
            >
              Clear {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Pathway View: CARDS or STRUCTURED ROWS */}
      {filteredPathways.length > 0 ? (
        viewMode === 'cards' ? (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPathways.map(pathway => {
              const typeConfig = PATHWAY_TYPE_CONFIG[pathway.pathwayType] || {
                label: pathway.pathwayType || 'Workstream',
                badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
              };
              const roleName = pathway.parentRole || pathway.role;
              const pathwayName = pathway.name || pathway.title;
              const shortDesc = pathway.description || pathway.summary;
              const skillsList = (pathway.requiredSkills || pathway.connectedSkills || [])
                .map(s => typeof s === 'string' ? s : s.name);
              const toolsList = pathway.toolsAndPlatforms || [];
              const evLevel = pathway.evidenceLevel || pathway.evidenceStrengthLevel || 4;
              const isMenuOpen = openMenuId === pathway.id;

              return (
                <div
                  key={pathway.id}
                  className="relative p-5 rounded-3xl border border-slate-200/90 bg-white hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header Badges & Actions */}
                    <div className="flex items-center justify-between gap-2">
                      {/* [Pathway Type] */}
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${typeConfig.badgeColor}`}>
                        {typeConfig.label}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Parent Role */}
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {roleName}
                        </span>
                        <ProvenanceBadge provenance={pathway.provenance || resolveProvenance(pathway)} size="sm" />

                        {/* Card Menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(isMenuOpen ? null : pathway.id);
                            }}
                            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div 
                              className="absolute right-0 top-8 z-30 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 text-xs animate-in fade-in duration-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => { setActivePathwayForModal(pathway); setOpenMenuId(null); }}
                                className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                              >
                                <Search className="w-3.5 h-3.5" />
                                <span>View Details</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => { handleEdit(pathway); setOpenMenuId(null); }}
                                className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicate(pathway)}
                                className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleArchive(pathway)}
                                className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                              >
                                <Archive className="w-3.5 h-3.5" />
                                <span>{pathway.isArchived ? 'Unarchive' : 'Archive'}</span>
                              </button>
                              <div className="border-t border-slate-100 my-1" />
                              <button
                                type="button"
                                onClick={() => handleDelete(pathway.id)}
                                className="w-full px-3 py-1.5 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 cursor-pointer font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pathway Name */}
                    <div 
                      onClick={() => setActivePathwayForModal(pathway)}
                      className="cursor-pointer"
                    >
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                        {pathwayName}
                      </h3>
                      {/* Domain */}
                      <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mt-0.5">
                        {pathway.domain}
                      </p>
                    </div>

                    {/* Short Description */}
                    <p 
                      onClick={() => setActivePathwayForModal(pathway)}
                      className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium cursor-pointer"
                    >
                      {shortDesc}
                    </p>

                    {/* Skills: xxx, xxx, xxx */}
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Skills:
                      </div>
                      <div className="line-clamp-1 font-semibold text-slate-800">
                        {skillsList.slice(0, 3).join(', ')}{skillsList.length > 3 ? ` +${skillsList.length - 3}` : ''}
                      </div>
                    </div>

                    {/* Tools: xxx, xxx */}
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Tools:
                      </div>
                      <div className="line-clamp-1 font-semibold text-slate-700">
                        {toolsList.slice(0, 3).join(', ')}{toolsList.length > 3 ? ` +${toolsList.length - 3}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Evidence: Level X and [View Pathway] */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {/* Evidence: Level X */}
                    <div className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Evidence: Level {evLevel}</span>
                    </div>

                    {/* [View Pathway] */}
                    <button
                      type="button"
                      onClick={() => setActivePathwayForModal(pathway)}
                      className="inline-flex items-center gap-1 font-bold text-indigo-700 hover:text-indigo-900 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <span>View Pathway</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Structured Rows View */
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
            {filteredPathways.map(pathway => {
              const typeConfig = PATHWAY_TYPE_CONFIG[pathway.pathwayType] || {
                label: pathway.pathwayType || 'Workstream',
                badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
              };
              const roleName = pathway.parentRole || pathway.role;
              const pathwayName = pathway.name || pathway.title;
              const shortDesc = pathway.description || pathway.summary;
              const skillsList = (pathway.requiredSkills || pathway.connectedSkills || [])
                .map(s => typeof s === 'string' ? s : s.name);
              const toolsList = pathway.toolsAndPlatforms || [];
              const evLevel = pathway.evidenceLevel || pathway.evidenceStrengthLevel || 4;
              const isMenuOpen = openMenuId === pathway.id;

              return (
                <div
                  key={pathway.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* [Pathway Type] */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${typeConfig.badgeColor}`}>
                        {typeConfig.label}
                      </span>
                      {/* Parent Role */}
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {roleName}
                      </span>
                      {/* Domain */}
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {pathway.domain}
                      </span>
                      {pathway.difficulty && (
                        <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          {pathway.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Pathway Name */}
                    <h3 
                      onClick={() => setActivePathwayForModal(pathway)}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                    >
                      {pathwayName}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 line-clamp-1 max-w-4xl">
                      {shortDesc}
                    </p>

                    {/* Skills & Tools metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                      <span><strong>Skills:</strong> {skillsList.slice(0, 3).join(', ')}</span>
                      <span>•</span>
                      <span><strong>Tools:</strong> {toolsList.slice(0, 3).join(', ')}</span>
                    </div>
                  </div>

                  {/* Row Actions: Evidence: Level X and [View Pathway] */}
                  <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                    <div className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Level {evLevel}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePathwayForModal(pathway)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>View Pathway</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Action Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(isMenuOpen ? null : pathway.id)}
                        className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <div 
                          className="absolute right-0 top-9 z-30 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 text-xs animate-in fade-in duration-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => { handleEdit(pathway); setOpenMenuId(null); }}
                            className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(pathway)}
                            className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleArchive(pathway)}
                            className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                          >
                            <Archive className="w-3.5 h-3.5" />
                            <span>{pathway.isArchived ? 'Unarchive' : 'Archive'}</span>
                          </button>
                          <div className="border-t border-slate-100 my-1" />
                          <button
                            type="button"
                            onClick={() => handleDelete(pathway.id)}
                            className="w-full px-3 py-1.5 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 cursor-pointer font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <GitBranch className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No pathways match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your role, domain, pathway type, or skill filters to explore other operational work units.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 rounded-xl bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pathway</span>
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activePathwayForModal && (
        <PathwayDetailModal
          pathway={activePathwayForModal}
          onClose={() => setActivePathwayForModal(null)}
          onEdit={(p) => handleEdit(p)}
          onDuplicate={(p) => handleDuplicate(p)}
          onArchive={(p) => handleArchive(p)}
          onDelete={(id) => handleDelete(id)}
        />
      )}

      {/* Form Modal (Add & Edit) */}
      {isFormOpen && (
        <WorkPathwayFormModal
          initialPathway={editingPathway}
          onClose={() => { setIsFormOpen(false); setEditingPathway(null); }}
          onSave={handleSave}
        />
      )}

    </div>
  );
};
