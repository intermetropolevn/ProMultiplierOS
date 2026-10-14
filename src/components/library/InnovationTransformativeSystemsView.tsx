import React, { useState, useMemo, useEffect } from 'react';
import { 
  InnovationSystemEntry, 
  InnovationType, 
  TransformationDimension,
  INNOVATION_TYPE_CONFIG,
  TRANSFORMATION_DIMENSION_CONFIG 
} from '../../features/knowledge/types/innovationSystems';
import { innovationSystemsStore } from '../../features/knowledge/services/innovationSystemsStore';
import { InnovationDetailModal } from './InnovationDetailModal';
import { InnovationSystemFormModal } from './InnovationSystemFormModal';
import { ProvenanceBadge } from './ProvenanceBadge';
import { resolveProvenance } from '../../features/knowledge/types/provenance';
import { 
  Sparkles, 
  Zap, 
  Search, 
  ArrowRight, 
  Layers, 
  Wrench, 
  GitBranch, 
  Building2, 
  TrendingUp, 
  Cpu, 
  Boxes, 
  Filter,
  Briefcase,
  Plus,
  MoreVertical,
  Edit3,
  Copy,
  Archive,
  Trash2
} from 'lucide-react';

interface InnovationTransformativeSystemsViewProps {
  searchQuery?: string;
  selectedDomain?: string;
  selectedRole?: string;
}

export const InnovationTransformativeSystemsView: React.FC<InnovationTransformativeSystemsViewProps> = ({
  searchQuery = '',
  selectedDomain = 'all',
  selectedRole = 'all'
}) => {
  const [entries, setEntries] = useState<InnovationSystemEntry[]>(() => innovationSystemsStore.getEntries());
  const [selectedType, setSelectedType] = useState<InnovationType | 'all'>('all');
  const [selectedDimension, setSelectedDimension] = useState<TransformationDimension | 'all'>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);

  // Modals
  const [activeInnovationForModal, setActiveInnovationForModal] = useState<InnovationSystemEntry | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<InnovationSystemEntry | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = innovationSystemsStore.subscribe(() => {
      setEntries(innovationSystemsStore.getEntries());
    });
    return unsubscribe;
  }, []);

  // Distinct Innovation Types in data
  const typesList: { id: InnovationType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Innovation Types' },
    { id: 'Infrastructure Innovation', label: 'Infrastructure Innovation' },
    { id: 'AI-native Product', label: 'AI-Native Products' },
    { id: 'Protocol', label: 'Protocols & Standards' },
    { id: 'Technology Innovation', label: 'Technology Innovations' },
    { id: 'UX Innovation', label: 'UX Innovations' },
    { id: 'Business Model Innovation', label: 'Business Model Innovations' },
    { id: 'Product Innovation', label: 'Product Innovations' }
  ];

  // Distinct Transformation Dimensions
  const dimensionsList: { id: TransformationDimension | 'all'; label: string }[] = [
    { id: 'all', label: 'All Dimensions' },
    { id: 'Workflow Transformation', label: 'Workflow' },
    { id: 'User Experience Transformation', label: 'User Experience' },
    { id: 'Infrastructure Transformation', label: 'Infrastructure' },
    { id: 'Business Model Transformation', label: 'Business Model' },
    { id: 'Industry Transformation', label: 'Industry' },
    { id: 'Distribution Transformation', label: 'Distribution' }
  ];

  // Filtered Innovations
  const filteredInnovations = useMemo(() => {
    return entries.filter(item => {
      // Archive filter
      if (!showArchived && item.isArchived) return false;
      if (showArchived && !item.isArchived) return false;

      // Type filter
      if (selectedType !== 'all' && item.innovationType !== selectedType) {
        return false;
      }

      // Dimension filter
      if (selectedDimension !== 'all' && !item.transformationDimensions.includes(selectedDimension)) {
        return false;
      }

      // Stage filter
      if (selectedStage !== 'all' && item.currentStage !== selectedStage) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      // Role filter from parent
      if (selectedRole !== 'all') {
        const matchesRole = item.relevantRoles.some(r => r.toLowerCase() === selectedRole.toLowerCase());
        if (!matchesRole) return false;
      }

      // Domain filter from parent
      if (selectedDomain !== 'all') {
        const matchesDomain = item.domain.toLowerCase().includes(selectedDomain.toLowerCase());
        if (!matchesDomain) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesShort = item.shortDescription.toLowerCase().includes(q);
        const matchesProblem = item.problemSolved.toLowerCase().includes(q);
        const matchesCore = item.coreInnovation.toLowerCase().includes(q);
        const matchesTech = item.keyTechnologies.some(t => t.toLowerCase().includes(q));
        const matchesAlt = item.existingAlternative.toLowerCase().includes(q);
        const matchesSkills = item.relatedSkills.some(s => s.name.toLowerCase().includes(q));
        const matchesRoles = item.relevantRoles.some(r => r.toLowerCase().includes(q));

        if (!matchesName && !matchesShort && !matchesProblem && !matchesCore && !matchesTech && !matchesAlt && !matchesSkills && !matchesRoles) {
          return false;
        }
      }

      return true;
    });
  }, [entries, selectedType, selectedDimension, selectedStage, selectedStatus, showArchived, selectedRole, selectedDomain, searchQuery]);

  const handleAddNew = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleEdit = (entry: InnovationSystemEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
    if (activeInnovationForModal) setActiveInnovationForModal(null);
  };

  const handleDuplicate = (entry: InnovationSystemEntry) => {
    innovationSystemsStore.duplicateEntry(entry.id);
    setOpenMenuId(null);
  };

  const handleArchive = (entry: InnovationSystemEntry) => {
    innovationSystemsStore.archiveEntry(entry.id);
    setOpenMenuId(null);
    if (activeInnovationForModal) setActiveInnovationForModal(null);
  };

  const handleDelete = (id: string) => {
    innovationSystemsStore.deleteEntry(id);
    setOpenMenuId(null);
    if (activeInnovationForModal) setActiveInnovationForModal(null);
  };

  const handleSave = (entry: InnovationSystemEntry) => {
    if (editingEntry) {
      innovationSystemsStore.updateEntry(editingEntry.id, entry);
    } else {
      innovationSystemsStore.addEntry(entry);
    }
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Context & Scope Clarification Banner */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-purple-50 via-fuchsia-50 to-slate-50 border border-purple-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Innovation & Transformative Systems
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                  Breakthrough Tech & Systems
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-4xl pt-0.5">
                Structured library of breakthrough ideas, transformative platforms, novel business models, AI-native architectures, and new computing paradigms. Not a generic startup news feed: captures <strong>why and how these approaches redefine industry workflows</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={handleAddNew}
              className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Innovation</span>
            </button>

            <span className="text-xs font-bold text-slate-600 bg-white/80 px-3 py-1.5 rounded-xl border border-purple-200 shadow-2xs">
              {entries.filter(e => !e.isArchived).length} Innovations Profiled
            </span>
          </div>
        </div>

        {/* 7 Transformation Dimensions Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1 text-[11px]">
          {dimensionsList.filter(d => d.id !== 'all').map(dim => {
            const isSelected = selectedDimension === dim.id;
            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => setSelectedDimension(isSelected ? 'all' : dim.id)}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                  isSelected
                    ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                    : 'bg-white/80 hover:bg-white text-slate-700 border-purple-100'
                }`}
              >
                {dim.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Secondary Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Innovation Type Filter Chips */}
          {typesList.map(type => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
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

        {/* Dropdowns for Stage & Status */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Dropdown */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-purple-500 shadow-2xs cursor-pointer"
          >
            <option value="all">All Innovation Stages</option>
            <option value="Production / Scaling">Production / Scaling</option>
            <option value="Open Protocol / Ecosystem">Open Protocol / Ecosystem</option>
            <option value="Mature / Category Leader">Mature / Category Leader</option>
            <option value="Prototype / Early Access">Prototype / Early Access</option>
            <option value="Concept / Speculative">Concept / Speculative</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-purple-500 shadow-2xs cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Emerging">Emerging</option>
            <option value="Disruptive">Disruptive</option>
            <option value="Mainstream">Mainstream</option>
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

          {(selectedType !== 'all' || selectedDimension !== 'all' || selectedStage !== 'all' || selectedStatus !== 'all' || showArchived || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedType('all');
                setSelectedDimension('all');
                setSelectedStage('all');
                setSelectedStatus('all');
                setShowArchived(false);
              }}
              className="text-xs text-purple-700 font-bold hover:underline px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 3. Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong>{filteredInnovations.length}</strong> of <strong>{entries.length}</strong> transformative innovations
        </span>
      </div>

      {/* 4. Cards Grid */}
      {filteredInnovations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInnovations.map(item => {
            const typeConfig = INNOVATION_TYPE_CONFIG[item.innovationType] || {
              label: item.innovationType,
              badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
            };
            const isMenuOpen = openMenuId === item.id;

            return (
              <div
                key={item.id}
                className="relative p-5 rounded-3xl border border-slate-200/90 bg-white hover:border-purple-500 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Innovation Type, Stage, Status, Menu */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${typeConfig.badgeColor}`}>
                      {typeConfig.label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {item.currentStage.split('/')[0].trim()}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
                        {item.status}
                      </span>
                      <ProvenanceBadge provenance={item.provenance || resolveProvenance(item)} size="sm" />

                      {/* Card Action Menu Toggle */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : item.id);
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
                              onClick={() => { setActiveInnovationForModal(item); setOpenMenuId(null); }}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Search className="w-3.5 h-3.5" />
                              <span>View Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => { handleEdit(item); setOpenMenuId(null); }}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(item)}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Duplicate</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleArchive(item)}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              <span>{item.isArchived ? 'Unarchive' : 'Archive'}</span>
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
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
                    onClick={() => setActiveInnovationForModal(item)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium line-clamp-1">
                      {item.domain} • {item.industry}
                    </p>
                  </div>

                  {/* Short Description */}
                  <p 
                    onClick={() => setActiveInnovationForModal(item)}
                    className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium cursor-pointer"
                  >
                    {item.shortDescription}
                  </p>

                  {/* Core Innovation Quote Box */}
                  <div 
                    onClick={() => setActiveInnovationForModal(item)}
                    className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1 cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3 text-purple-600" />
                      <span>Core Innovation:</span>
                    </span>
                    <p className="text-[11px] text-purple-950 font-semibold line-clamp-2">
                      {item.coreInnovation}
                    </p>
                  </div>

                  {/* Problem vs Alternative Snippet */}
                  <div 
                    onClick={() => setActiveInnovationForModal(item)}
                    className="p-2 rounded-xl bg-slate-50 text-[11px] space-y-1 cursor-pointer"
                  >
                    <div className="flex items-start gap-1">
                      <strong className="text-slate-700 shrink-0">Problem:</strong>
                      <span className="text-slate-600 line-clamp-1">{item.problemSolved}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <strong className="text-slate-500 shrink-0">Status Quo:</strong>
                      <span className="text-slate-500 line-clamp-1">{item.existingAlternative}</span>
                    </div>
                  </div>

                  {/* Transformation Dimensions Badges */}
                  <div 
                    onClick={() => setActiveInnovationForModal(item)}
                    className="flex flex-wrap gap-1 pt-0.5 cursor-pointer"
                  >
                    {item.transformationDimensions.slice(0, 2).map((dim, dIdx) => (
                      <span key={dIdx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {dim.replace('Transformation', '').trim()}
                      </span>
                    ))}
                    {item.transformationDimensions.length > 2 && (
                      <span className="text-[10px] text-slate-400 font-semibold self-center">
                        +{item.transformationDimensions.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div 
                  onClick={() => setActiveInnovationForModal(item)}
                  className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] cursor-pointer"
                >
                  <span className="text-slate-400 font-medium">
                    {item.keyTechnologies[0] || 'Modern Architecture'}
                  </span>

                  <span className="font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
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
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No innovations match your filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your innovation type, transformation dimension, or search query to explore other systems.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedDimension('all');
                setSelectedStage('all');
                setSelectedStatus('all');
                setShowArchived(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Innovation</span>
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activeInnovationForModal && (
        <InnovationDetailModal
          entry={activeInnovationForModal}
          onClose={() => setActiveInnovationForModal(null)}
          onEdit={(i) => handleEdit(i)}
          onDuplicate={(i) => handleDuplicate(i)}
          onArchive={(i) => handleArchive(i)}
          onDelete={(id) => handleDelete(id)}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <InnovationSystemFormModal
          initialEntry={editingEntry}
          onClose={() => { setIsFormOpen(false); setEditingEntry(null); }}
          onSave={handleSave}
        />
      )}

    </div>
  );
};
