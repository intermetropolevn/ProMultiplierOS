import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  NormalizedSource, 
  SourceFamily, 
  EvidenceStrengthLevel, 
  SourceStatus 
} from '../../features/sources/types';
import { sourceStore } from '../../features/sources/services/sourceStore';
import { 
  SOURCE_TAXONOMY, 
  getEvidenceStrengthDefinition, 
  EVIDENCE_STRENGTH_LEVELS,
  getTypeConfig,
  getFamilyConfig
} from '../../features/sources/taxonomy';
import { SourceDetailModal } from './SourceDetailModal';
import { AddSourceModal } from './AddSourceModal';
import { SmartImportModal } from './SmartImportModal';
import { UniversalSourceIngestionModal, InputMethod } from './UniversalSourceIngestionModal';
import { WorkRelevantPathwaysView } from './WorkRelevantPathwaysView';
import { workPathwaysStore } from '../../features/knowledge/services/workPathwaysStore';
import { PublicSectorCivicSystemsView } from './PublicSectorCivicSystemsView';
import { civicSystemsStore } from '../../features/knowledge/services/civicSystemsStore';
import { InnovationTransformativeSystemsView } from './InnovationTransformativeSystemsView';
import { innovationSystemsStore } from '../../features/knowledge/services/innovationSystemsStore';
import { ToolsPlatformsView } from './ToolsPlatformsView';
import { toolsPlatformsStore } from '../../features/knowledge/services/toolsPlatformsStore';
import { 
  Search, 
  Plus, 
  Sparkles, 
  Filter, 
  BookOpen, 
  Award, 
  FileText, 
  Briefcase, 
  FolderGit2, 
  Layout, 
  Tv, 
  CheckCircle, 
  ShieldCheck, 
  SlidersHorizontal,
  ExternalLink,
  Calendar,
  Building,
  ArrowRight,
  TrendingUp,
  Layers,
  Compass,
  Bookmark,
  GitBranch,
  Workflow,
  Landmark,
  Lightbulb,
  Wrench,
  ChevronDown,
  Check
} from 'lucide-react';
import { CANONICAL_DOMAINS, CANONICAL_ROLES } from '../../data/jobTaxonomies';

export type LibraryPillar = 
  | 'all'
  | 'work_relevant_pathways'
  | 'public_sector_civic_systems'
  | 'innovation_transformative_systems'
  | 'tools_platforms'
  | 'domain_market_intelligence'
  | 'standards_certifications'
  | 'playbooks_frameworks'
  | 'global_voices_publications';

interface LibraryHubProps {
  onOpenSourceDetail?: (sourceId: string) => void;
  onNavigateToProfile?: () => void;
}

export const LibraryHub: React.FC<LibraryHubProps> = ({
  onOpenSourceDetail,
  onNavigateToProfile
}) => {
  const [sources, setSources] = useState<NormalizedSource[]>(() => sourceStore.getSources());
  const [selectedPillar, setSelectedPillar] = useState<LibraryPillar>('all');
  const [selectedFamily, setSelectedFamily] = useState<SourceFamily | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStrength, setSelectedStrength] = useState<EvidenceStrengthLevel | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modals
  const [activeDetailSource, setActiveDetailSource] = useState<NormalizedSource | null>(null);
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [ingestionMethod, setIngestionMethod] = useState<InputMethod>('text');

  // Secondary categories "More" dropdown
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreOpen]);

  // Aggregate Metrics
  const metrics = useMemo(() => sourceStore.getAggregateMetrics(), [sources]);

  const [storeTick, setStoreTick] = useState(0);

  useEffect(() => {
    const unsubTools = toolsPlatformsStore.subscribe(() => setStoreTick(t => t + 1));
    const unsubCivic = civicSystemsStore.subscribe(() => setStoreTick(t => t + 1));
    const unsubInno = innovationSystemsStore.subscribe(() => setStoreTick(t => t + 1));
    const unsubPath = workPathwaysStore.subscribe(() => setStoreTick(t => t + 1));
    const unsubSources = sourceStore.subscribe(() => {
      setSources(sourceStore.getSources());
      setStoreTick(t => t + 1);
    });
    return () => {
      unsubTools();
      unsubCivic();
      unsubInno();
      unsubPath();
      unsubSources();
    };
  }, []);

  // Pillar Counts
  const pillarCounts = useMemo(() => {
    const dmi = sources.filter(s => s.sourceFamily === 'learn' || s.sourceFamily === 'knowledge').length;
    const sc = sources.filter(s => s.sourceFamily === 'credential' || s.sourceFamily === 'assessment').length;
    const pf = sources.filter(s => s.sourceFamily === 'playbook' || s.sourceFamily === 'project').length;
    const gvp = sources.filter(s => s.sourceFamily === 'publication' || s.sourceFamily === 'content').length;
    const pathwaysCount = workPathwaysStore.getPathways().filter(p => !p.isArchived).length;
    const civicSystemsCount = civicSystemsStore.getEntries().filter(c => !c.isArchived).length;
    const innovationCount = innovationSystemsStore.getEntries().filter(i => !i.isArchived).length;
    const toolsCount = toolsPlatformsStore.getTools().filter(t => !t.isArchived).length;
    return {
      all: sources.length,
      work_relevant_pathways: pathwaysCount,
      public_sector_civic_systems: civicSystemsCount,
      innovation_transformative_systems: innovationCount,
      tools_platforms: toolsCount,
      domain_market_intelligence: dmi,
      standards_certifications: sc,
      playbooks_frameworks: pf,
      global_voices_publications: gvp
    };
  }, [sources, storeTick]);

  // Unique domains and languages for filters
  const allDomains = useMemo(() => {
    const set = new Set<string>();
    sources.forEach(s => s.domains?.forEach(d => set.add(d)));
    return Array.from(set);
  }, [sources]);

  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    sources.forEach(s => {
      if (s.language) set.add(s.language);
      s.languages?.forEach(l => set.add(l));
    });
    return Array.from(set);
  }, [sources]);

  // Subtypes available based on selected family (Two-Level progressive disclosure)
  const availableSubtypes = useMemo(() => {
    if (selectedFamily === 'all') {
      return SOURCE_TAXONOMY.flatMap(f => f.types);
    }
    const fam = SOURCE_TAXONOMY.find(f => f.id === selectedFamily);
    return fam ? fam.types : [];
  }, [selectedFamily]);

  // Filtered sources
  const filteredSources = useMemo(() => {
    return sources.filter(src => {
      // 5-Pillar Master Filter
      if (selectedPillar === 'domain_market_intelligence') {
        if (src.sourceFamily !== 'learn' && src.sourceFamily !== 'knowledge') return false;
      } else if (selectedPillar === 'standards_certifications') {
        if (src.sourceFamily !== 'credential' && src.sourceFamily !== 'assessment') return false;
      } else if (selectedPillar === 'playbooks_frameworks') {
        if (src.sourceFamily !== 'playbook' && src.sourceFamily !== 'project') return false;
      } else if (selectedPillar === 'global_voices_publications') {
        if (src.sourceFamily !== 'publication' && src.sourceFamily !== 'content') return false;
      }

      // Family filter
      if (selectedFamily !== 'all' && src.sourceFamily !== selectedFamily) return false;

      // Type filter
      if (selectedType !== 'all' && src.sourceType !== selectedType) return false;

      // Strength filter
      if (selectedStrength !== 'all' && src.evidenceStrength !== selectedStrength) return false;

      // Status filter
      if (selectedStatus !== 'all' && src.status !== selectedStatus) return false;

      // Domain filter
      if (selectedDomain !== 'all' && (!src.domains || !src.domains.includes(selectedDomain))) return false;

      // Role filter
      if (selectedRole !== 'all') {
        const matchesRole = src.careerRelevance.some(r => r.toLowerCase().includes(selectedRole.toLowerCase()));
        if (!matchesRole) return false;
      }

      // Language filter
      if (selectedLanguage !== 'all' && src.language !== selectedLanguage && !src.languages?.includes(selectedLanguage)) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = src.title.toLowerCase().includes(query);
        const matchesDesc = src.description?.toLowerCase().includes(query);
        const matchesProvider = src.provider?.toLowerCase().includes(query) || src.organization?.toLowerCase().includes(query);
        const matchesSkills = src.confirmedSkills.some(s => s.toLowerCase().includes(query)) ||
          src.inferredSkills.some(s => s.toLowerCase().includes(query));
        const matchesTags = src.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesProvider && !matchesSkills && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [sources, selectedPillar, selectedFamily, selectedType, selectedStrength, selectedStatus, selectedDomain, selectedRole, selectedLanguage, searchQuery]);

  const handleSourceUpdated = (updated: NormalizedSource) => {
    sourceStore.updateSource(updated.id, updated);
    setSources(sourceStore.getSources());
  };

  const handleSourceDeleted = (id: string) => {
    sourceStore.deleteSource(id);
    setSources(sourceStore.getSources());
    setActiveDetailSource(null);
  };

  const handleSourceAdded = (newSource: NormalizedSource) => {
    sourceStore.addSource(newSource);
    setSources(sourceStore.getSources());
    setActiveDetailSource(newSource);
  };

  const getFamilyIcon = (family: string) => {
    switch (family) {
      case 'learn': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'credential': return <Award className="w-4 h-4 text-amber-600" />;
      case 'knowledge': return <FileText className="w-4 h-4 text-sky-600" />;
      case 'experience': return <Briefcase className="w-4 h-4 text-slate-700" />;
      case 'project': return <FolderGit2 className="w-4 h-4 text-indigo-600" />;
      case 'artifact': return <Layout className="w-4 h-4 text-purple-600" />;
      case 'content': return <Tv className="w-4 h-4 text-emerald-600" />;
      case 'assessment': return <CheckCircle className="w-4 h-4 text-rose-600" />;
      case 'playbook': return <Compass className="w-4 h-4 text-violet-600" />;
      case 'publication': return <Bookmark className="w-4 h-4 text-sky-600" />;
      default: return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  const featuredTabs: { id: LibraryPillar; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Knowledge Sources', icon: Layers },
    { id: 'domain_market_intelligence', label: 'Domain & Market Intelligence', icon: BookOpen },
    { id: 'work_relevant_pathways', label: 'Work-relevant Pathways', icon: GitBranch },
  ];

  const secondaryTabs: { id: LibraryPillar; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'standards_certifications', label: 'Standards & Certifications', icon: Award },
    { id: 'playbooks_frameworks', label: 'Playbooks & Frameworks', icon: Compass },
    { id: 'tools_platforms', label: 'Tools & Platforms', icon: Wrench },
    { id: 'innovation_transformative_systems', label: 'Innovation & Transformative Systems', icon: Sparkles },
    { id: 'public_sector_civic_systems', label: 'Public Sector & Civic Systems', icon: Landmark },
    { id: 'global_voices_publications', label: 'Global Voices & Publications', icon: Bookmark }
  ];

  const isSecondaryActive = secondaryTabs.some(t => t.id === selectedPillar);
  const activeSecondaryTab = secondaryTabs.find(t => t.id === selectedPillar);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-6 animate-in fade-in duration-200">
      
      {/* Compact Featured + More Navigation */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {featuredTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = selectedPillar === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedPillar(tab.id);
                  setSelectedFamily('all');
                  setSelectedType('all');
                  setIsMoreOpen(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* More ▾ Dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen(prev => !prev)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                isSecondaryActive
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{isSecondaryActive && activeSecondaryTab ? activeSecondaryTab.label : 'More'}</span>
              {isSecondaryActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-2xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Specialized Categories
                </div>
                {secondaryTabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = selectedPillar === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setSelectedPillar(tab.id);
                        setSelectedFamily('all');
                        setSelectedType('all');
                        setIsMoreOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Search & Secondary Filter Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, provider, skills, or tags..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              <option value="all">All Domains</option>
              {CANONICAL_DOMAINS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              <option value="all">All Roles</option>
              {CANONICAL_ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {/* Subtype Dropdown (Filtered by Family) */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              <option value="all">All Subtypes ({availableSubtypes.length})</option>
              {availableSubtypes.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>

            {/* Evidence Strength Filter (0-6) */}
            <select
              value={selectedStrength === 'all' ? 'all' : String(selectedStrength)}
              onChange={(e) => setSelectedStrength(e.target.value === 'all' ? 'all' : Number(e.target.value) as EvidenceStrengthLevel)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              <option value="all">All Evidence Levels (0-6)</option>
              {EVIDENCE_STRENGTH_LEVELS.map(lvl => (
                <option key={lvl.level} value={lvl.level}>
                  L{lvl.level} - {lvl.name}
                </option>
              ))}
            </select>

            {/* Advanced Filters Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                showAdvancedFilters || selectedStatus !== 'all' || selectedLanguage !== 'all'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>More Filters</span>
            </button>

            {/* Reset Filters */}
            {(selectedPillar !== 'all' || selectedDomain !== 'all' || selectedRole !== 'all' || selectedStrength !== 'all' || selectedType !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPillar('all');
                  setSelectedDomain('all');
                  setSelectedRole('all');
                  setSelectedStrength('all');
                  setSelectedType('all');
                  setSearchQuery('');
                }}
                className="text-xs text-blue-600 font-bold hover:underline px-2 py-1 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150 text-xs">
            {/* Status filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Source Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="earned">Earned</option>
                <option value="passed">Passed</option>
                <option value="applied">Applied</option>
                <option value="saved">Saved</option>
              </select>
            </div>

            {/* Domain filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Industry Domain:</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800"
              >
                <option value="all">All Domains</option>
                {allDomains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Language filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 uppercase"
              >
                <option value="all">All Languages</option>
                {allLanguages.map(l => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 5. Main Content Area */}
      {selectedPillar === 'work_relevant_pathways' ? (
        <WorkRelevantPathwaysView
          searchQuery={searchQuery}
          selectedDomain={selectedDomain}
          selectedRole={selectedRole}
        />
      ) : selectedPillar === 'public_sector_civic_systems' ? (
        <PublicSectorCivicSystemsView
          searchQuery={searchQuery}
          selectedDomain={selectedDomain}
          selectedRole={selectedRole}
        />
      ) : selectedPillar === 'innovation_transformative_systems' ? (
        <InnovationTransformativeSystemsView
          searchQuery={searchQuery}
          selectedDomain={selectedDomain}
          selectedRole={selectedRole}
        />
      ) : selectedPillar === 'tools_platforms' ? (
        <ToolsPlatformsView
          searchQuery={searchQuery}
          selectedDomain={selectedDomain}
          selectedRole={selectedRole}
        />
      ) : (
        <div className="space-y-4">
          {/* Work-Relevant Pathways Prompt Banner when viewing 'all' */}
          {selectedPillar === 'all' && !searchQuery && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              <div className="p-4 rounded-3xl bg-linear-to-r from-indigo-50 via-blue-50 to-slate-50 border border-indigo-200/80 flex flex-col justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-indigo-950 text-sm">
                        Work Pathways ({pillarCounts.work_relevant_pathways})
                      </span>
                      <span className="px-2 py-0.2 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                        Units
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs line-clamp-2">
                      Granular work units, git workflows, and modules underneath monolithic roles.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPillar('work_relevant_pathways')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs self-start cursor-pointer"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Explore Pathways</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-3xl bg-linear-to-r from-blue-50 via-sky-50 to-slate-50 border border-blue-200/80 flex flex-col justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-blue-950 text-sm">
                        Public & Civic ({pillarCounts.public_sector_civic_systems})
                      </span>
                      <span className="px-2 py-0.2 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                        Civic
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs line-clamp-2">
                      DPI platforms, government portals, open procurement, and NGO operating models.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPillar('public_sector_civic_systems')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-2xs self-start cursor-pointer"
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Explore Civic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-3xl bg-linear-to-r from-purple-50 via-fuchsia-50 to-slate-50 border border-purple-200/80 flex flex-col justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-purple-950 text-sm">
                        Innovations ({pillarCounts.innovation_transformative_systems})
                      </span>
                      <span className="px-2 py-0.2 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                        Frontier
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs line-clamp-2">
                      Breakthrough products, AI-native platforms, and computing paradigms.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPillar('innovation_transformative_systems')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-2xs self-start cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore Innovation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-3xl bg-linear-to-r from-teal-50 via-cyan-50 to-slate-50 border border-teal-200/80 flex flex-col justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-teal-950 text-sm">
                        Tools ({pillarCounts.tools_platforms})
                      </span>
                      <span className="px-2 py-0.2 rounded-md text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                        Profiles
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs line-clamp-2">
                      In-depth capability profiles, operating mechanics, integrations, and storage models.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPillar('tools_platforms')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-2xs self-start cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Explore Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Results Count & Active Chips */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
            <span>
              Showing <strong>{filteredSources.length}</strong> of <strong>{sources.length}</strong> sources
            </span>

            {(selectedFamily !== 'all' || selectedType !== 'all' || selectedStrength !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedFamily('all');
                  setSelectedType('all');
                  setSelectedStrength('all');
                  setSelectedStatus('all');
                  setSelectedDomain('all');
                  setSelectedLanguage('all');
                  setSearchQuery('');
                }}
                className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Sources Cards Grid */}
          {filteredSources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSources.map(src => {
                const typeConfig = getTypeConfig(src.sourceType);
                const familyConfig = getFamilyConfig(src.sourceFamily);
                const strengthDef = getEvidenceStrengthDefinition(src.evidenceStrength);
                const allSkills = Array.from(new Set([...src.confirmedSkills, ...src.inferredSkills]));

                return (
                  <div
                    key={src.id}
                    onClick={() => {
                      setActiveDetailSource(src);
                      if (onOpenSourceDetail) onOpenSourceDetail(src.id);
                    }}
                    className="p-5 rounded-3xl border border-slate-200/90 bg-white hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Family, Type, Strength Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="p-1 rounded-lg bg-slate-50 border border-slate-200/60">
                            {getFamilyIcon(src.sourceFamily)}
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                            {typeConfig?.type.label || src.sourceType}
                          </span>
                        </div>

                        {/* Evidence Strength Level Badge */}
                        <div className={`px-2 py-0.5 rounded-md text-[10px] font-black border flex items-center gap-1 ${strengthDef.colorClass}`}>
                          <ShieldCheck className="w-3 h-3" />
                          <span>L{src.evidenceStrength} {strengthDef.shortLabel.split(' ')[1]}</span>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                          {src.title}
                        </h3>
                        {(src.provider || src.organization || src.author) && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium truncate">
                            <Building className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{src.provider || src.organization || src.author}</span>
                          </div>
                        )}
                      </div>

                      {/* Description Snippet */}
                      {src.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {src.description}
                        </p>
                      )}

                      {/* Key Skills Pills */}
                      {allSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {allSkills.slice(0, 3).map((skill, sIdx) => (
                            <span 
                              key={`${src.id}-skill-${skill}-${sIdx}`} 
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                          {allSkills.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-bold self-center">
                              +{allSkills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Status, Date, & Detail Link */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.2 rounded-md font-extrabold uppercase text-[9px] ${
                          src.status === 'completed' || src.status === 'earned' || src.status === 'passed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : src.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {src.status.replace(/_/g, ' ')}
                        </span>
                        {(src.dateCompleted || src.datePublished || src.createdAt) && (
                          <span className="text-slate-400">
                            {src.dateCompleted || src.datePublished || src.createdAt.split('T')[0]}
                          </span>
                        )}
                      </div>

                      <span className="font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No sources found matching your filters</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your search query, clearing specific family/type filters, or add a new source to expand your evidence ledger.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedFamily('all');
                  setSelectedType('all');
                  setSelectedStrength('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {activeDetailSource && (
        <SourceDetailModal
          source={activeDetailSource}
          onClose={() => setActiveDetailSource(null)}
          onUpdate={handleSourceUpdated}
          onDelete={handleSourceDeleted}
        />
      )}

      {/* Universal Source Ingestion & Smart Import Modal */}
      {isIngestionOpen && (
        <UniversalSourceIngestionModal
          onClose={() => setIsIngestionOpen(false)}
          onSaveSource={(newSource) => {
            handleSourceAdded(newSource);
            setIsIngestionOpen(false);
          }}
          initialMethod={ingestionMethod}
          initialFamily={selectedFamily !== 'all' ? selectedFamily : 'learn'}
        />
      )}

    </div>
  );
};
