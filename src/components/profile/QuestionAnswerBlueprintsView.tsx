import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Sparkles, 
  Search, 
  Trash2, 
  Target, 
  Clock, 
  CheckCircle2, 
  Edit3,
  UserCheck,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckSquare,
  Square,
  Briefcase,
  Building2,
  LayoutList,
  LayoutGrid
} from 'lucide-react';
import { StructuredAnswerBlueprint } from '../../features/knowledge/types';
import { KnowledgeStorageService } from '../../features/knowledge/services/knowledgeStorageService';
import { CreateBlueprintModal } from './CreateBlueprintModal';
import { GenerateBlueprintModal } from './GenerateBlueprintModal';
import { AssignBlueprintModal } from './AssignBlueprintModal';
import { ImportExportBlueprintsModal } from './ImportExportBlueprintsModal';
import { BlueprintRichTextRenderer } from '../common/BlueprintRichTextRenderer';

interface QuestionAnswerBlueprintsViewProps {
  onStartPracticeBlueprint?: (blueprint: StructuredAnswerBlueprint) => void;
  targetRole?: string;
  targetDomain?: string;
}

export const QuestionAnswerBlueprintsView: React.FC<QuestionAnswerBlueprintsViewProps> = ({
  targetRole = 'Software Engineering',
  targetDomain = 'Fintech & Payments',
}) => {
  const [blueprints, setBlueprints] = useState<StructuredAnswerBlueprint[]>(() => 
    KnowledgeStorageService.getBlueprints()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [selectedInterviewerRole, setSelectedInterviewerRole] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Layout display mode: 1-column list vs 2-column grid (persisted in sessionStorage)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    const saved = sessionStorage.getItem('career_blueprints_view_mode');
    return saved === 'grid' ? 'grid' : 'list';
  });

  const handleSetViewMode = (mode: 'list' | 'grid') => {
    setViewMode(mode);
    sessionStorage.setItem('career_blueprints_view_mode', mode);
  };

  // Pagination state (default: 30/page, options: 30 or 50)
  const [pageSize, setPageSize] = useState<number>(30);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selection state for batch actions & selective export
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals & Active Edit/Assign states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBlueprint, setEditingBlueprint] = useState<StructuredAnswerBlueprint | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningBlueprint, setAssigningBlueprint] = useState<StructuredAnswerBlueprint | null>(null);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  // Listen for global storage changes
  useEffect(() => {
    const handleUpdate = () => {
      setBlueprints(KnowledgeStorageService.getBlueprints());
    };
    window.addEventListener('career_blueprints_updated', handleUpdate);
    return () => {
      window.removeEventListener('career_blueprints_updated', handleUpdate);
    };
  }, []);

  // Distinct interviewer roles: ONLY roles that blueprints are assigned to as interviewers
  const distinctInterviewerRoles = useMemo(() => {
    const set = new Set<string>();
    blueprints.forEach(b => {
      if (b.assignedRoles && Array.isArray(b.assignedRoles)) {
        b.assignedRoles.forEach(r => {
          if (r && r.trim()) set.add(r.trim());
        });
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [blueprints]);

  // Filtered blueprints based on search, framework, and interviewer role
  const filteredBlueprints = useMemo(() => {
    return blueprints.filter(bp => {
      if (selectedFramework !== 'all' && bp.framework !== selectedFramework) {
        return false;
      }
      if (selectedInterviewerRole !== 'all') {
        const matchesAssigned = bp.assignedRoles?.includes(selectedInterviewerRole);
        if (!matchesAssigned) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = bp.title.toLowerCase().includes(query);
        const matchesQ = bp.questionText.toLowerCase().includes(query);
        const matchesRole = bp.targetRole?.toLowerCase().includes(query) || false;
        const matchesCompany = bp.targetCompany?.toLowerCase().includes(query) || false;
        const matchesAssigned = bp.assignedRoles?.some(r => r.toLowerCase().includes(query)) || false;
        if (!matchesTitle && !matchesQ && !matchesRole && !matchesCompany && !matchesAssigned) return false;
      }
      return true;
    });
  }, [blueprints, selectedFramework, selectedInterviewerRole, searchQuery]);

  // Reset pagination to Page 1 whenever search, framework, interviewer role, or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFramework, selectedInterviewerRole, pageSize]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredBlueprints.length / pageSize));

  // Current page items
  const paginatedBlueprints = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBlueprints.slice(startIndex, startIndex + pageSize);
  }, [filteredBlueprints, currentPage, pageSize]);

  // Selected blueprint objects
  const selectedBlueprints = useMemo(() => {
    return blueprints.filter(b => selectedIds.has(b.id));
  }, [blueprints, selectedIds]);

  const toggleSelectBlueprint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Cross-page selection logic
  const isAllFilteredSelected = filteredBlueprints.length > 0 && 
    filteredBlueprints.every(b => selectedIds.has(b.id));

  const isCurrentPageSelected = paginatedBlueprints.length > 0 &&
    paginatedBlueprints.every(b => selectedIds.has(b.id));

  const selectedOnCurrentPageCount = paginatedBlueprints.filter(b => selectedIds.has(b.id)).length;
  const selectedFilteredCount = filteredBlueprints.filter(b => selectedIds.has(b.id)).length;

  const handleToggleSelectCurrentPage = () => {
    if (isCurrentPageSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        paginatedBlueprints.forEach(b => next.delete(b.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        paginatedBlueprints.forEach(b => next.add(b.id));
        return next;
      });
    }
  };

  const handleSelectAllFiltered = () => {
    setSelectedIds(new Set(filteredBlueprints.map(b => b.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Active filter text summary for export description
  const activeFilterDescription = useMemo(() => {
    const parts: string[] = [];
    if (selectedFramework !== 'all') {
      parts.push(`Framework: ${selectedFramework === 'Custom' ? 'Custom Structure' : selectedFramework}`);
    }
    if (selectedInterviewerRole !== 'all') {
      parts.push(`Interviewer Role: ${selectedInterviewerRole}`);
    }
    if (searchQuery.trim()) {
      parts.push(`Search: "${searchQuery.trim()}"`);
    }
    return parts.length > 0 ? parts.join(' • ') : 'All Blueprints (no active filters)';
  }, [selectedFramework, selectedInterviewerRole, searchQuery]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = KnowledgeStorageService.deleteBlueprint(id);
    setBlueprints(updated);
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleOpenEdit = (bp: StructuredAnswerBlueprint, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBlueprint(bp);
    setIsCreateModalOpen(true);
  };

  const handleOpenAssign = (bp: StructuredAnswerBlueprint, e: React.MouseEvent) => {
    e.stopPropagation();
    setAssigningBlueprint(bp);
    setIsAssignModalOpen(true);
  };

  // Page range numbers for condensed pagination
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    pages.push(1);
    if (currentPage > 3) {
      pages.push('...');
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, filteredBlueprints.length);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner & Primary Actions (No redundant category tags) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Question &amp; Answer Blueprints</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Structured library of calibrated question-answer blueprints. Create, edit, and assign to interviewer roles to power Live Interview intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="btn-ai-generate-blueprint"
            onClick={() => setIsGenerateModalOpen(true)}
            className="px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Generate
          </button>

          <button
            id="btn-import-export-blueprints"
            onClick={() => setIsImportExportModalOpen(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" /> Import / Export
          </button>

          <button
            id="btn-create-blueprint"
            onClick={() => {
              setEditingBlueprint(null);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create Blueprint
          </button>
        </div>
      </div>

      {/* Filter, Search Bar & Display Mode Switch */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search questions, assigned interviewer roles, or frameworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {/* Framework filter */}
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="all">All Frameworks</option>
            <option value="Custom">Custom Structure</option>
            <option value="STAR">STAR</option>
            <option value="CAR">CAR</option>
            <option value="Problem → Decision → Impact">P → D → I</option>
          </select>

          {/* Interviewer Roles Filter (Assigned roles ONLY) */}
          <select
            value={selectedInterviewerRole}
            onChange={(e) => setSelectedInterviewerRole(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="all">All Interviewer Roles</option>
            {distinctInterviewerRoles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {/* Display Mode Toggle: 1-Column List vs 2-Column Grid */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0 ml-1">
            <button
              type="button"
              onClick={() => handleSetViewMode('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-white text-purple-700 shadow-2xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="1-column list view"
              aria-label="1-column list view"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleSetViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white text-purple-700 shadow-2xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="2-column grid view"
              aria-label="2-column grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-2xs font-semibold text-slate-400 pl-1 shrink-0">
            {filteredBlueprints.length} Blueprints
          </span>
        </div>
      </div>

      {/* Batch Selection Bar (Multi-page selection transparency) */}
      {filteredBlueprints.length > 0 && (
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Page selection checkbox */}
            <button
              onClick={handleToggleSelectCurrentPage}
              className="flex items-center gap-1.5 text-2xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              {isCurrentPageSelected ? (
                <CheckSquare className="w-4 h-4 text-purple-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {isCurrentPageSelected ? 'Deselect page' : `Select current page (${paginatedBlueprints.length})`}
              </span>
            </button>

            {/* Selection Status & Cross-page "Select All Filtered" Prompt */}
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-2xs font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full border border-purple-200">
                  {isAllFilteredSelected ? (
                    `All ${filteredBlueprints.length} filtered selected`
                  ) : (
                    `${selectedFilteredCount} selected (${selectedOnCurrentPageCount} on this page)`
                  )}
                </span>

                {/* If some on current page selected but not all filtered across pages, show quick button */}
                {!isAllFilteredSelected && filteredBlueprints.length > paginatedBlueprints.length && (
                  <button
                    onClick={handleSelectAllFiltered}
                    className="text-2xs font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
                  >
                    Select all {filteredBlueprints.length} filtered Blueprints
                  </button>
                )}
              </div>
            )}
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsImportExportModalOpen(true)}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-2xs font-bold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowUpDown className="w-3 h-3" /> Export Selected ({selectedIds.size})
              </button>
              <button
                onClick={handleClearSelection}
                className="text-2xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* Blueprint Cards Container (1-Column List or 2-Column Grid) */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 items-start' : 'space-y-4'}>
        {paginatedBlueprints.map((bp) => {
          const isExpanded = expandedId === bp.id;
          const isSelected = selectedIds.has(bp.id);
          const frameworkLabel = bp.framework === 'Custom' ? 'Custom Structure' : bp.framework;

          return (
            <div
              key={bp.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col ${
                isSelected 
                  ? 'border-purple-300 ring-2 ring-purple-100 shadow-xs' 
                  : 'border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Card Header & Preview */}
              <div 
                className="p-5 cursor-pointer flex-1 flex flex-col"
                onClick={() => setExpandedId(isExpanded ? null : bp.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 flex-1">
                  <div className="space-y-2.5 flex-1 min-w-0">
                    
                    {/* Top Row: Checkbox + Blueprint Title */}
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={(e) => toggleSelectBlueprint(bp.id, e)}
                        className="p-0.5 text-slate-400 hover:text-purple-600 transition-colors cursor-pointer shrink-0"
                        title={isSelected ? 'Deselect blueprint' : 'Select blueprint'}
                        aria-label={isSelected ? 'Deselect blueprint' : 'Select blueprint'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                        )}
                      </button>

                      <h4 className="text-xs font-bold text-slate-800 truncate" title={bp.title}>
                        {bp.title}
                      </h4>
                    </div>

                    {/* ============================================================ */}
                    {/* PRIMARY PROMINENT INTERVIEW QUESTION + COMPACT METADATA ROW  */}
                    {/* ============================================================ */}
                    <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/90 text-slate-950">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-2xs font-bold uppercase tracking-wider text-purple-700">
                          INTERVIEW QUESTION
                        </span>
                        {/* Compact Subdued Metadata Row: Blueprint ID + Framework */}
                        <span className="text-[11px] font-mono text-slate-400 truncate">
                          {bp.id} · {frameworkLabel}
                        </span>
                      </div>
                      <p className="font-vietnamese text-base sm:text-lg font-bold text-slate-950 leading-snug tracking-tight">
                        &ldquo;{bp.questionText}&rdquo;
                      </p>
                    </div>

                    {/* Secondary Targeting & Technical Metadata (Visually Quieter) */}
                    <div className="flex flex-wrap items-center gap-1.5 text-2xs text-slate-600 pt-0.5">
                      {bp.targetRole && (
                        <span className="px-2 py-0.5 rounded-md font-medium bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1">
                          <Target className="w-2.5 h-2.5 text-slate-400" /> {bp.targetRole}
                        </span>
                      )}
                      {bp.targetJob && (
                        <span className="px-2 py-0.5 rounded-md font-medium bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1">
                          <Briefcase className="w-2.5 h-2.5 text-slate-400" /> {bp.targetJob}
                        </span>
                      )}
                      {bp.targetCompany && (
                        <span className="px-2 py-0.5 rounded-md font-medium bg-slate-50 text-slate-500 border border-slate-200 flex items-center gap-1">
                          <Building2 className="w-2.5 h-2.5 text-slate-400" /> {bp.targetCompany}
                        </span>
                      )}
                      {bp.targetDurationSeconds && (
                        <span className="text-slate-400 font-mono flex items-center gap-1 ml-auto sm:ml-0">
                          <Clock className="w-2.5 h-2.5" /> {Math.round(bp.targetDurationSeconds / 60)} min
                        </span>
                      )}
                    </div>

                    {/* Assigned Interviewer Roles */}
                    {bp.assignedRoles && bp.assignedRoles.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-slate-400" /> Assigned:
                        </span>
                        {bp.assignedRoles.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Actions & Expand/Collapse Affordance */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start pt-1 sm:pt-0">
                    <button
                      onClick={(e) => handleOpenEdit(bp, e)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Edit Blueprint Details & Architecture"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" /> Edit
                    </button>

                    <button
                      onClick={(e) => handleOpenAssign(bp, e)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                      title="Assign to Interviewer Roles"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Assign
                    </button>

                    <button
                      onClick={(e) => handleDelete(bp.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Blueprint"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Explicit Expand / Collapse Chevron Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(isExpanded ? null : bp.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer ml-0.5"
                      title={isExpanded ? 'Collapse answer' : 'Expand answer'}
                      aria-label={isExpanded ? 'Collapse answer' : 'Expand answer'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-purple-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Expanded Details (Simplified Answer: No Parent Wrapper, No (Formatted)/(Optional) Suffixes, Metrics inside) */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/50 text-xs space-y-3.5 animate-in slide-in-from-top-1">
                  
                  {/* Custom Structure Layout */}
                  {bp.framework === 'Custom' ? (
                    <div className="space-y-3">
                      {bp.components.context && bp.components.context.trim().length > 0 && (
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-1">
                            Context
                          </span>
                          <BlueprintRichTextRenderer content={bp.components.context} />
                        </div>
                      )}
                      
                      {bp.components.solutionAndImpact && bp.components.solutionAndImpact.trim().length > 0 && (
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-2">
                            Solution &amp; Impact
                          </span>
                          <BlueprintRichTextRenderer content={bp.components.solutionAndImpact} />
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Other Structured Frameworks (STAR, CAR, P->D->I) */
                    <div className="space-y-3">
                      {bp.components.situation && bp.components.situation.trim().length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-1">Situation</span>
                          <BlueprintRichTextRenderer content={bp.components.situation} />
                        </div>
                      )}

                      {bp.components.task && bp.components.task.trim().length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-1">Task</span>
                          <BlueprintRichTextRenderer content={bp.components.task} />
                        </div>
                      )}

                      {bp.components.context && !bp.components.situation && bp.components.context.trim().length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-1">Context</span>
                          <BlueprintRichTextRenderer content={bp.components.context} />
                        </div>
                      )}

                      {bp.components.action && bp.components.action.length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-1.5">Actions Taken</span>
                          <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 text-xs">
                            {bp.components.action.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {bp.components.result && bp.components.result.length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-1.5">Results &amp; Outcomes</span>
                          <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 text-xs">
                            {bp.components.result.map((res, i) => (
                              <li key={i}>{res}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {bp.components.problem && bp.components.problem.trim().length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-1">Problem</span>
                          <BlueprintRichTextRenderer content={bp.components.problem} />
                        </div>
                      )}

                      {bp.components.decision && bp.components.decision.trim().length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-1">Decision</span>
                          <BlueprintRichTextRenderer content={bp.components.decision} />
                        </div>
                      )}

                      {bp.components.impact && bp.components.impact.length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-1.5">Impact</span>
                          <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 text-xs">
                            {bp.components.impact.map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {bp.components.solutionAndImpact && bp.components.solutionAndImpact.trim().length > 0 && (
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-2">
                            Solution &amp; Impact
                          </span>
                          <BlueprintRichTextRenderer content={bp.components.solutionAndImpact} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metrics / Evidence moved into the expanded Answer ONLY (Requirement 6) */}
                  {bp.metrics && bp.metrics.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <span className="font-bold text-slate-900 block text-2xs uppercase tracking-wider mb-2">
                        Metrics / Evidence
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {bp.metrics.map((metric, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {filteredBlueprints.length === 0 && (
          <div className="py-12 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-300 col-span-full">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Question &amp; Answer Blueprints Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Create your first question blueprint or use the AI generator to synthesize questions for {targetRole}.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsGenerateModalOpen(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Generate
              </button>
              <button
                onClick={() => {
                  setEditingBlueprint(null);
                  setIsCreateModalOpen(true);
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Create Blueprint
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Real Pagination Bar (30/50 per page, Condensed page indicators) */}
      {filteredBlueprints.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-3 text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{startIndex}</strong>&ndash;<strong className="text-slate-800">{endIndex}</strong> of <strong className="text-slate-800">{filteredBlueprints.length}</strong> Blueprints
            </span>

            {/* Page size selector: 30 / 50 */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <span className="text-2xs text-slate-400">Per page:</span>
              {[30, 50].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPageSize(size)}
                  className={`px-2 py-0.5 rounded text-2xs font-semibold cursor-pointer transition-colors ${
                    pageSize === size
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Page navigation controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous page"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {pageNumbers.map((p, idx) => {
                if (p === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-1.5 text-slate-400 text-xs">
                      &hellip;
                    </span>
                  );
                }
                const pageNum = Number(p);
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={`page-${pageNum}`}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-2xs font-bold'
                        : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next page"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateBlueprintModal
          isOpen={isCreateModalOpen}
          initialBlueprint={editingBlueprint || undefined}
          defaultRole={targetRole}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingBlueprint(null);
          }}
          onCreated={(newBp) => {
            setBlueprints(KnowledgeStorageService.getBlueprints());
            setIsCreateModalOpen(false);
            setEditingBlueprint(null);
          }}
        />
      )}

      {isGenerateModalOpen && (
        <GenerateBlueprintModal
          isOpen={isGenerateModalOpen}
          targetRole={targetRole}
          targetDomain={targetDomain}
          onClose={() => setIsGenerateModalOpen(false)}
          onGenerated={(newBp) => {
            setBlueprints(KnowledgeStorageService.getBlueprints());
            setIsGenerateModalOpen(false);
          }}
        />
      )}

      {isAssignModalOpen && assigningBlueprint && (
        <AssignBlueprintModal
          isOpen={isAssignModalOpen}
          blueprint={assigningBlueprint}
          onClose={() => {
            setIsAssignModalOpen(false);
            setAssigningBlueprint(null);
          }}
          onAssigned={() => {
            setBlueprints(KnowledgeStorageService.getBlueprints());
            setIsAssignModalOpen(false);
            setAssigningBlueprint(null);
          }}
        />
      )}

      {isImportExportModalOpen && (
        <ImportExportBlueprintsModal
          isOpen={isImportExportModalOpen}
          onClose={() => setIsImportExportModalOpen(false)}
          filteredBlueprints={filteredBlueprints}
          selectedBlueprints={selectedBlueprints}
          allBlueprints={blueprints}
          activeFilterDescription={activeFilterDescription}
          onImportComplete={() => {
            setBlueprints(KnowledgeStorageService.getBlueprints());
          }}
        />
      )}

    </div>
  );
};
