import React, { useState, useMemo, useEffect } from 'react';
import { 
  CivicSystemEntry, 
  CivicEntityType, 
  CIVIC_ENTITY_TYPE_CONFIG 
} from '../../features/knowledge/types/civicSystems';
import { civicSystemsStore } from '../../features/knowledge/services/civicSystemsStore';
import { CivicSystemDetailModal } from './CivicSystemDetailModal';
import { CivicSystemFormModal } from './CivicSystemFormModal';
import { ProvenanceBadge } from './ProvenanceBadge';
import { resolveProvenance } from '../../features/knowledge/types/provenance';
import { 
  Building2, 
  Globe2, 
  Workflow, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Wrench, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Filter,
  Users,
  Briefcase,
  Award,
  Landmark,
  Scale,
  Plus,
  MoreVertical,
  Edit3,
  Copy,
  Archive,
  Trash2
} from 'lucide-react';

interface PublicSectorCivicSystemsViewProps {
  searchQuery?: string;
  selectedDomain?: string;
  selectedRole?: string;
}

export const PublicSectorCivicSystemsView: React.FC<PublicSectorCivicSystemsViewProps> = ({
  searchQuery = '',
  selectedDomain = 'all',
  selectedRole = 'all'
}) => {
  const [entries, setEntries] = useState<CivicSystemEntry[]>(() => civicSystemsStore.getEntries());
  const [selectedEntityType, setSelectedEntityType] = useState<CivicEntityType | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);

  // Modals
  const [activeSystemForModal, setActiveSystemForModal] = useState<CivicSystemEntry | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CivicSystemEntry | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = civicSystemsStore.subscribe(() => {
      setEntries(civicSystemsStore.getEntries());
    });
    return unsubscribe;
  }, []);

  // Distinct Entity Types in data
  const entityTypesList: { id: CivicEntityType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Entity Types' },
    { id: 'Digital Public Infrastructure', label: 'Digital Public Infrastructure (DPI)' },
    { id: 'Government Agency', label: 'Government Agency' },
    { id: 'Public Platform', label: 'Public Platform' },
    { id: 'Public Institution', label: 'Public Institution' },
    { id: 'NGO', label: 'NGO' },
    { id: 'Civic Tech Organization', label: 'Civic Tech Organization' },
    { id: 'International Organization', label: 'International Organization' },
    { id: 'Public Program', label: 'Public Program' },
    { id: 'Social Impact Initiative', label: 'Social Impact Initiative' }
  ];

  // Distinct Regions
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    entries.forEach(s => {
      const primary = s.countryRegion.split('(')[0].trim();
      set.add(primary);
    });
    return Array.from(set);
  }, [entries]);

  // Filtered Systems
  const filteredSystems = useMemo(() => {
    return entries.filter(sys => {
      // Archive filter
      if (!showArchived && sys.isArchived) return false;
      if (showArchived && !sys.isArchived) return false;

      // Entity Type filter
      if (selectedEntityType !== 'all' && sys.entityType !== selectedEntityType) {
        return false;
      }

      // Region filter
      if (selectedRegion !== 'all' && !sys.countryRegion.includes(selectedRegion)) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && sys.status !== selectedStatus) {
        return false;
      }

      // Role filter from parent
      if (selectedRole !== 'all') {
        const matchesRole = sys.relevantRoles.some(r => r.toLowerCase() === selectedRole.toLowerCase());
        if (!matchesRole) return false;
      }

      // Domain filter from parent
      if (selectedDomain !== 'all') {
        const matchesDomain = sys.domain.toLowerCase().includes(selectedDomain.toLowerCase());
        if (!matchesDomain) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = sys.name.toLowerCase().includes(q);
        const matchesMission = sys.missionPurpose.toLowerCase().includes(q);
        const matchesProblem = sys.problemAddressed.toLowerCase().includes(q);
        const matchesOperating = sys.operatingModel.toLowerCase().includes(q);
        const matchesRegion = sys.countryRegion.toLowerCase().includes(q);
        const matchesTech = sys.technologyInfrastructure.some(t => t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q));
        const matchesServices = sys.services.some(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
        const matchesSkills = sys.relatedSkills.some(s => s.name.toLowerCase().includes(q));
        const matchesRoles = sys.relevantRoles.some(r => r.toLowerCase().includes(q));

        if (!matchesName && !matchesMission && !matchesProblem && !matchesOperating && !matchesRegion && !matchesTech && !matchesServices && !matchesSkills && !matchesRoles) {
          return false;
        }
      }

      return true;
    });
  }, [entries, selectedEntityType, selectedRegion, selectedStatus, showArchived, selectedRole, selectedDomain, searchQuery]);

  const handleAddNew = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleEdit = (entry: CivicSystemEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
    if (activeSystemForModal) setActiveSystemForModal(null);
  };

  const handleDuplicate = (entry: CivicSystemEntry) => {
    civicSystemsStore.duplicateEntry(entry.id);
    setOpenMenuId(null);
  };

  const handleArchive = (entry: CivicSystemEntry) => {
    civicSystemsStore.archiveEntry(entry.id);
    setOpenMenuId(null);
    if (activeSystemForModal) setActiveSystemForModal(null);
  };

  const handleDelete = (id: string) => {
    civicSystemsStore.deleteEntry(id);
    setOpenMenuId(null);
    if (activeSystemForModal) setActiveSystemForModal(null);
  };

  const handleSave = (entry: CivicSystemEntry) => {
    if (editingEntry) {
      civicSystemsStore.updateEntry(editingEntry.id, entry);
    } else {
      civicSystemsStore.addEntry(entry);
    }
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Context & Scope Clarification Banner */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Public Sector & Civic Systems
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                  Operating Models & DPI
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-4xl pt-0.5">
                Knowledge, platforms, institutions, and operating models powering government service delivery, digital public infrastructure, and social innovation. Captures <strong>how public and civic systems work</strong> from governance and procurement to citizen delivery.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={handleAddNew}
              className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Civic System</span>
            </button>

            <span className="text-xs font-bold text-slate-600 bg-white/80 px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
              {entries.filter(e => !e.isArchived).length} Systems Documented
            </span>
          </div>
        </div>

        {/* Operating Model Flow Preview Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-white/90 border border-blue-100 text-slate-700">
            <strong className="text-blue-950 block font-bold">Government Program Flow:</strong>
            Policy & Law → Public Service Portal → DPI Platform → Citizen Delivery
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-blue-100 text-slate-700">
            <strong className="text-blue-950 block font-bold">NGO Social Delivery Flow:</strong>
            Humanitarian Mandate → Target Population → Field Delivery SOP → Verified Outcomes
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-blue-100 text-slate-700">
            <strong className="text-blue-950 block font-bold">DPI Ecosystem Architecture:</strong>
            Open Protocol Standards → Bank/Fintech PSPs → Citizens & Merchants
          </div>
        </div>
      </div>

      {/* 2. Secondary Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Entity Type Filter Chips */}
          {entityTypesList.map(type => {
            const isSelected = selectedEntityType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedEntityType(type.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Dropdowns for Region & Status */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Country / Region Dropdown */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
          >
            <option value="all">All Countries / Regions</option>
            {availableRegions.map(reg => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
          >
            <option value="all">All Operating Statuses</option>
            <option value="Nationwide Scaled">Nationwide Scaled</option>
            <option value="Operational">Operational</option>
            <option value="Active Program">Active Program</option>
            <option value="Global Standard">Global Standard</option>
            <option value="Piloting / Expanding">Piloting / Expanding</option>
          </select>

          {/* Archive Toggle */}
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
            <span>{showArchived ? 'Archived' : 'Archive'}</span>
          </button>

          {(selectedEntityType !== 'all' || selectedRegion !== 'all' || selectedStatus !== 'all' || showArchived || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedEntityType('all');
                setSelectedRegion('all');
                setSelectedStatus('all');
                setShowArchived(false);
              }}
              className="text-xs text-blue-700 font-bold hover:underline px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 3. Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong>{filteredSystems.length}</strong> of <strong>{entries.length}</strong> civic systems & public operating models
        </span>
      </div>

      {/* 4. Cards Grid */}
      {filteredSystems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSystems.map(system => {
            const typeConfig = CIVIC_ENTITY_TYPE_CONFIG[system.entityType] || {
              label: system.entityType,
              badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
            };
            const isMenuOpen = openMenuId === system.id;

            return (
              <div
                key={system.id}
                className="relative p-5 rounded-3xl border border-slate-200/90 bg-white hover:border-blue-500 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Entity Type, Region, Menu */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${typeConfig.badgeColor}`}>
                      {typeConfig.label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Globe2 className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[130px]">{system.countryRegion}</span>
                      </span>
                      <ProvenanceBadge provenance={system.provenance || resolveProvenance(system)} size="sm" />

                      {/* Card Action Menu Toggle */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : system.id);
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
                              onClick={() => { setActiveSystemForModal(system); setOpenMenuId(null); }}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Search className="w-3.5 h-3.5" />
                              <span>View Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => { handleEdit(system); setOpenMenuId(null); }}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(system)}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Duplicate</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleArchive(system)}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              <span>{system.isArchived ? 'Unarchive' : 'Archive'}</span>
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              type="button"
                              onClick={() => handleDelete(system.id)}
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

                  {/* Title & Domain */}
                  <div 
                    onClick={() => setActiveSystemForModal(system)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                      {system.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium line-clamp-1">
                      {system.domain}
                    </p>
                  </div>

                  {/* Mission / Purpose Snippet */}
                  <p 
                    onClick={() => setActiveSystemForModal(system)}
                    className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium cursor-pointer"
                  >
                    {system.missionPurpose}
                  </p>

                  {/* Problem Addressed Snippet */}
                  <div 
                    onClick={() => setActiveSystemForModal(system)}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Problem Solved:</span>
                    <p className="text-[11px] text-slate-700 line-clamp-2 font-medium">
                      {system.problemAddressed}
                    </p>
                  </div>

                  {/* Relationship Flow Preview */}
                  {system.systemRelationships && (
                    <div 
                      onClick={() => setActiveSystemForModal(system)}
                      className="space-y-1.5 pt-0.5 cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Workflow className="w-3 h-3 text-blue-600" />
                        <span>System Relationship Flow:</span>
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 overflow-x-auto no-scrollbar py-0.5">
                        {system.systemRelationships.nodes.slice(0, 3).map((node, nIdx) => (
                          <React.Fragment key={nIdx}>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs whitespace-nowrap">
                              {node.title}
                            </span>
                            {nIdx < 2 && (
                              <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technology & Digital Capabilities Pills */}
                  <div 
                    onClick={() => setActiveSystemForModal(system)}
                    className="flex flex-wrap gap-1 pt-1 cursor-pointer"
                  >
                    {system.technologyInfrastructure.slice(0, 2).map((tech, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-semibold">
                        {tech.name}
                      </span>
                    ))}
                    {system.digitalCapabilities.slice(0, 2).map((cap, cIdx) => (
                      <span key={cIdx} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 text-[10px] font-semibold">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div 
                  onClick={() => setActiveSystemForModal(system)}
                  className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] cursor-pointer"
                >
                  <span className="text-slate-400 font-medium">
                    {system.status}
                  </span>

                  <span className="font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Inspect System</span>
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
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No civic systems match your filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your entity type, country filter, or search query to explore other public systems.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSelectedEntityType('all');
                setSelectedRegion('all');
                setSelectedStatus('all');
                setShowArchived(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Civic System</span>
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activeSystemForModal && (
        <CivicSystemDetailModal
          system={activeSystemForModal}
          onClose={() => setActiveSystemForModal(null)}
          onEdit={(s) => handleEdit(s)}
          onDuplicate={(s) => handleDuplicate(s)}
          onArchive={(s) => handleArchive(s)}
          onDelete={(id) => handleDelete(id)}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <CivicSystemFormModal
          initialEntry={editingEntry}
          onClose={() => { setIsFormOpen(false); setEditingEntry(null); }}
          onSave={handleSave}
        />
      )}

    </div>
  );
};
