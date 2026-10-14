import React, { useState, useMemo, useEffect } from 'react';
import { 
  ToolPlatformEntry, 
  ToolCategory, 
  ToolPricingModel,
  ToolVersionStatus,
  TOOL_CATEGORIES_LIST,
  TOOL_CATEGORY_CONFIG,
  TOOL_VERSION_STATUS_CONFIG 
} from '../../features/knowledge/types/toolsPlatforms';
import { toolsPlatformsStore } from '../../features/knowledge/services/toolsPlatformsStore';
import { ToolPlatformDetailModal } from './ToolPlatformDetailModal';
import { ToolPlatformFormModal } from './ToolPlatformFormModal';
import { ProvenanceBadge } from './ProvenanceBadge';
import { resolveProvenance } from '../../features/knowledge/types/provenance';
import { 
  Wrench, 
  Search, 
  ArrowRight, 
  Layers, 
  GitBranch, 
  Building2, 
  TrendingUp, 
  Database, 
  Cable, 
  Monitor, 
  Sparkles, 
  Compass, 
  Filter,
  CheckCircle2,
  Briefcase,
  Plus,
  History,
  MoreVertical,
  Edit3,
  Copy,
  Archive,
  Trash2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ToolsPlatformsViewProps {
  searchQuery?: string;
  selectedDomain?: string;
  selectedRole?: string;
}

export const ToolsPlatformsView: React.FC<ToolsPlatformsViewProps> = ({
  searchQuery = '',
  selectedDomain = 'all',
  selectedRole = 'all'
}) => {
  const [tools, setTools] = useState<ToolPlatformEntry[]>(() => toolsPlatformsStore.getTools());
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [selectedPricing, setSelectedPricing] = useState<ToolPricingModel | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ToolVersionStatus | 'all'>('all');
  const [showArchived, setShowArchived] = useState(false);

  // Modals
  const [activeToolForModal, setActiveToolForModal] = useState<ToolPlatformEntry | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolPlatformEntry | null>(null);

  // Card action menu dropdown state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = toolsPlatformsStore.subscribe(() => {
      setTools(toolsPlatformsStore.getTools());
    });
    return unsubscribe;
  }, []);

  // Filtered Tools
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      // Archive filter
      if (!showArchived && tool.isArchived) return false;
      if (showArchived && !tool.isArchived) return false;

      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // Pricing filter
      if (selectedPricing !== 'all' && tool.pricingModel !== selectedPricing) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && tool.status !== selectedStatus) {
        return false;
      }

      // Role filter from parent
      if (selectedRole !== 'all') {
        const matchesRole = tool.relevantRoles.some(r => r.toLowerCase() === selectedRole.toLowerCase());
        if (!matchesRole) return false;
      }

      // Domain filter from parent
      if (selectedDomain !== 'all') {
        const matchesDomain = tool.primaryDomain.toLowerCase().includes(selectedDomain.toLowerCase());
        if (!matchesDomain) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = tool.name.toLowerCase().includes(q);
        const matchesProvider = tool.companyProvider.toLowerCase().includes(q);
        const matchesTagline = tool.tagline.toLowerCase().includes(q);
        const matchesCategory = tool.category.toLowerCase().includes(q);
        const matchesSubcategory = tool.subcategory.toLowerCase().includes(q);
        const matchesDomain = tool.primaryDomain.toLowerCase().includes(q);
        const matchesPhilosophy = tool.capabilitiesSummary.productPhilosophy.toLowerCase().includes(q);
        const matchesCapacities = tool.capabilitiesSummary.keyCapacities.some(c => c.toLowerCase().includes(q));
        const matchesSkills = tool.relatedSkills.some(s => s.name.toLowerCase().includes(q));
        const matchesRoles = tool.relevantRoles.some(r => r.toLowerCase().includes(q));
        const matchesPathways = tool.relatedWorkPathways.some(p => p.toLowerCase().includes(q));

        if (!matchesName && !matchesProvider && !matchesTagline && !matchesCategory && !matchesSubcategory && !matchesDomain && !matchesPhilosophy && !matchesCapacities && !matchesSkills && !matchesRoles && !matchesPathways) {
          return false;
        }
      }

      return true;
    });
  }, [tools, selectedCategory, selectedPricing, selectedStatus, showArchived, selectedRole, selectedDomain, searchQuery]);

  // Handlers
  const handleAddNew = () => {
    setEditingTool(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tool: ToolPlatformEntry) => {
    setEditingTool(tool);
    setIsFormOpen(true);
    if (activeToolForModal) setActiveToolForModal(null);
  };

  const handleDuplicate = (tool: ToolPlatformEntry) => {
    const dup = toolsPlatformsStore.duplicateTool(tool.id);
    if (dup) {
      setOpenMenuId(null);
    }
  };

  const handleArchive = (tool: ToolPlatformEntry) => {
    toolsPlatformsStore.archiveTool(tool.id);
    setOpenMenuId(null);
    if (activeToolForModal) {
      setActiveToolForModal(null);
    }
  };

  const handleDelete = (toolId: string) => {
    toolsPlatformsStore.deleteTool(toolId);
    setOpenMenuId(null);
    if (activeToolForModal) {
      setActiveToolForModal(null);
    }
  };

  const handleSaveTool = (tool: ToolPlatformEntry, preserveHistory: boolean) => {
    if (editingTool) {
      toolsPlatformsStore.updateTool(editingTool.id, tool, preserveHistory);
    } else {
      toolsPlatformsStore.addTool(tool);
    }
    setIsFormOpen(false);
    setEditingTool(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Context & Scope Clarification Banner with CRUD Action Buttons */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-teal-50 via-cyan-50 to-slate-50 border border-teal-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Tools & Platforms
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                  Capability Directory
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Version-Aware
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-4xl pt-0.5">
                A structured technology directory of software, developer tools, cloud infrastructure, AI models, and SaaS products. Every entry features an <strong>in-depth 8-part capability profile</strong>, historical version changelogs, and Career OS work pathway mappings.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={handleAddNew}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Tool / Platform</span>
            </button>

            <button
              type="button"
              onClick={handleAddNew}
              className="px-3.5 py-2 rounded-xl border border-teal-300 bg-white hover:bg-teal-50 text-teal-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Smart URL Import</span>
            </button>

            <span className="text-xs font-bold text-slate-600 bg-white/80 px-3 py-1.5 rounded-xl border border-teal-200 shadow-2xs">
              {tools.filter(t => !t.isArchived).length} Active Tools
            </span>
          </div>
        </div>

        {/* 8-Part Capability Summary Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-white/90 border border-teal-100 text-slate-700">
            <strong className="text-teal-950 block font-bold">1-2. Capacities & Mechanics:</strong>
            What the tool does and its underlying operating architecture.
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-teal-100 text-slate-700">
            <strong className="text-teal-950 block font-bold">3-4. Philosophy & Data Model:</strong>
            Strategic design principles, storage limits, and hosting models.
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-teal-100 text-slate-700">
            <strong className="text-teal-950 block font-bold">5-6. Integrations & UX:</strong>
            APIs, SDKs, MCP servers, webhooks, and interaction models.
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-teal-100 text-slate-700">
            <strong className="text-teal-950 block font-bold">7-8. Suitability & Secondary:</strong>
            Target teams, use cases, company stages, and supporting features.
          </div>
        </div>
      </div>

      {/* 2. Filter Controls (29 Categories, Pricing, Version Status, Archive Toggle) */}
      <div className="space-y-3">
        {/* Category Scrollable Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories ({tools.filter(t => !t.isArchived).length})
          </button>

          {TOOL_CATEGORIES_LIST.map(cat => {
            const count = tools.filter(t => t.category === cat && !t.isArchived).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat} {count > 0 && <span className="opacity-70 text-[10px] ml-1">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Dropdowns Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Pricing Dropdown */}
            <select
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value as ToolPricingModel | 'all')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500 shadow-2xs cursor-pointer"
            >
              <option value="all">All Pricing Models</option>
              <option value="Freemium">Freemium</option>
              <option value="Open Source">Open Source</option>
              <option value="Usage-Based">Usage-Based</option>
              <option value="Commercial / SaaS">Commercial / SaaS</option>
              <option value="Free">Free</option>
              <option value="Enterprise">Enterprise</option>
            </select>

            {/* Version Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ToolVersionStatus | 'all')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500 shadow-2xs cursor-pointer"
            >
              <option value="all">All Version Statuses</option>
              <option value="Current">Current</option>
              <option value="Previous Version">Previous Version</option>
              <option value="Beta">Beta</option>
              <option value="Experimental">Experimental</option>
              <option value="Deprecated">Deprecated</option>
              <option value="Discontinued">Discontinued</option>
              <option value="Acquired">Acquired</option>
              <option value="Merged">Merged</option>
            </select>

            {/* Archived Toggle */}
            <button
              type="button"
              onClick={() => setShowArchived(!showArchived)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                showArchived
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{showArchived ? 'Viewing Archived' : 'Show Archived'}</span>
            </button>

            {(selectedCategory !== 'all' || selectedPricing !== 'all' || selectedStatus !== 'all' || showArchived || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPricing('all');
                  setSelectedStatus('all');
                  setShowArchived(false);
                }}
                className="text-xs text-teal-700 font-bold hover:underline px-2 py-1 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong>{filteredTools.length}</strong> of <strong>{tools.length}</strong> tools
          </div>
        </div>
      </div>

      {/* 3. Cards Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => {
            const catConfig = TOOL_CATEGORY_CONFIG[tool.category] || {
              label: tool.category,
              badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
            };
            const statusCfg = TOOL_VERSION_STATUS_CONFIG[tool.status] || {
              label: tool.status,
              badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
            };
            const cap = tool.capabilitiesSummary;
            const isMenuOpen = openMenuId === tool.id;

            return (
              <div
                key={tool.id}
                className="relative p-5 rounded-3xl border border-slate-200/90 bg-white hover:border-teal-500 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category, Subcategory, Status, Menu */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${catConfig.badgeColor}`}>
                      {catConfig.label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${statusCfg.badgeColor}`}>
                        {statusCfg.label}
                      </span>
                      {tool.version && (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md font-mono">
                          v{tool.version}
                        </span>
                      )}
                      <ProvenanceBadge provenance={tool.provenance || resolveProvenance(tool)} size="sm" />

                      {/* Card Action Menu Toggle */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : tool.id);
                          }}
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div 
                            className="absolute right-0 top-8 z-30 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 text-xs animate-in fade-in duration-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => { setActiveToolForModal(tool); setOpenMenuId(null); }}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Search className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => { handleEdit(tool); setOpenMenuId(null); }}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(tool)}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Duplicate</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleArchive(tool)}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              <span>{tool.isArchived ? 'Unarchive' : 'Archive'}</span>
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              type="button"
                              onClick={() => handleDelete(tool.id)}
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

                  {/* Title & Company */}
                  <div 
                    onClick={() => setActiveToolForModal(tool)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug line-clamp-2">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                      <span className="text-slate-700 font-semibold">{tool.companyProvider}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 truncate">{tool.subcategory}</span>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p 
                    onClick={() => setActiveToolForModal(tool)}
                    className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium cursor-pointer"
                  >
                    {tool.tagline}
                  </p>

                  {/* Product Philosophy Quote Box */}
                  <div 
                    onClick={() => setActiveToolForModal(tool)}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Compass className="w-3 h-3 text-teal-600" />
                      <span>Product Philosophy:</span>
                    </span>
                    <p className="text-[11px] text-slate-700 italic line-clamp-2">
                      "{cap.productPhilosophy}"
                    </p>
                  </div>

                  {/* Key Capacities Summary (Top 2) */}
                  <div 
                    onClick={() => setActiveToolForModal(tool)}
                    className="space-y-1 pt-0.5 cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Core Capacities:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-700">
                      {cap.keyCapacities.slice(0, 2).map((item, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Temporal Info & Version History Count */}
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <History className="w-3 h-3 text-slate-400" />
                      <span>Observed: {tool.observedDate || tool.lastUpdated}</span>
                    </span>
                    {tool.versionHistory && tool.versionHistory.length > 0 && (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                        {tool.versionHistory.length} previous versions
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div 
                  onClick={() => setActiveToolForModal(tool)}
                  className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] cursor-pointer"
                >
                  <span className="text-slate-400 font-medium">
                    {cap.usageAndStorage.hosting}
                  </span>

                  <span className="font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Inspect Profile</span>
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
            <Wrench className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No tools or platforms match your filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your category, pricing model, or search query, or use "+ Add Tool / Platform" to add a new tool.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPricing('all');
                setSelectedStatus('all');
                setShowArchived(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tool</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Inspection Detail Modal */}
      {activeToolForModal && (
        <ToolPlatformDetailModal
          tool={activeToolForModal}
          onClose={() => setActiveToolForModal(null)}
          onEdit={(t) => handleEdit(t)}
          onDuplicate={(t) => handleDuplicate(t)}
          onArchive={(t) => handleArchive(t)}
          onDelete={(id) => handleDelete(id)}
        />
      )}

      {/* 5. Add / Edit Form Modal with Smart URL Import */}
      {isFormOpen && (
        <ToolPlatformFormModal
          initialTool={editingTool}
          onClose={() => { setIsFormOpen(false); setEditingTool(null); }}
          onSave={handleSaveTool}
        />
      )}

    </div>
  );
};
