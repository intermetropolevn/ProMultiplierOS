import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Layers, 
  BookOpen, 
  FolderPlus,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target
} from 'lucide-react';
import { LiveParticipant } from '../../../types';
import { 
  InterviewerRoleType, 
  AVAILABLE_INTERVIEWER_ROLES, 
  ConfiguredBlueprint, 
  createConfiguredBlueprint,
  getCanonicalBlueprintsForRole,
  LiveInterviewStorageService,
  ReusableQASet
} from './liveInterviewData';
import { KnowledgeStorageService } from '../../../features/knowledge/services/knowledgeStorageService';
import { StructuredAnswerBlueprint } from '../../../features/knowledge/types';
import { QASetLibraryModal } from './QASetLibraryModal';

interface PreInterviewProcessingModalProps {
  initialInterviewers: LiveParticipant[];
  initialBlueprints: ConfiguredBlueprint[];
  onClose: () => void;
  onSaveAndLoad: (interviewers: LiveParticipant[], blueprints: ConfiguredBlueprint[]) => void;
}

export const PreInterviewProcessingModal: React.FC<PreInterviewProcessingModalProps> = ({
  initialInterviewers,
  initialBlueprints,
  onClose,
  onSaveAndLoad,
}) => {
  // Active Tab: 'configuration' (Interviewers & Roles + Blueprints) or 'extracted' (Extracted Questions & Blueprints)
  const [activeTab, setActiveTab] = useState<'configuration' | 'extracted'>('configuration');

  // Interviewers State
  const [interviewers, setInterviewers] = useState<LiveParticipant[]>(() => {
    if (initialInterviewers && initialInterviewers.length > 0) {
      return initialInterviewers;
    }
    return [
      {
        id: 'p-interviewer-1',
        name: 'Sarah Chen',
        role: 'Engineering Lead',
        isInterviewer: true,
        avatarColor: 'bg-purple-600'
      }
    ];
  });

  // Configured Blueprints State (dynamic canonical resolution)
  const [blueprints, setBlueprints] = useState<ConfiguredBlueprint[]>(() => {
    if (initialBlueprints && initialBlueprints.length > 0) {
      // Re-resolve against canonical library to ensure freshness
      const canonicals = KnowledgeStorageService.getBlueprints();
      const canonicalMap = new Map(canonicals.map(b => [b.id, b]));
      const refreshed: ConfiguredBlueprint[] = [];
      for (const bp of initialBlueprints) {
        const canonical = canonicalMap.get(bp.id);
        if (canonical) {
          refreshed.push(
            createConfiguredBlueprint(canonical, bp.interviewerId, bp.interviewerName, bp.interviewerRole, bp.source)
          );
        } else {
          refreshed.push(bp);
        }
      }
      return refreshed;
    }

    // Default initialization from canonical library for first interviewer
    const defaultInterviewer = initialInterviewers?.[0] || {
      id: 'p-interviewer-1',
      name: 'Sarah Chen',
      role: 'Engineering Lead' as InterviewerRoleType
    };
    return getCanonicalBlueprintsForRole(
      defaultInterviewer.role as InterviewerRoleType,
      defaultInterviewer.id,
      defaultInterviewer.name
    );
  });

  // Search & Add Blueprint Modal/Picker state
  const [isAddPickerOpen, setIsAddPickerOpen] = useState(false);
  const [selectedInterviewerForAdd, setSelectedInterviewerForAdd] = useState<string>(
    interviewers[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrameworkFilter, setSelectedFrameworkFilter] = useState<string>('All');

  // Inline expanded blueprint cards (stores key: `${blueprintId}-${interviewerId}`)
  const [expandedCardKey, setExpandedCardKey] = useState<string | null>(null);

  // Save as Q&A Set state
  const [isSavingQASet, setIsSavingQASet] = useState(false);
  const [qaSetName, setQaSetName] = useState('Senior Systems & Leadership Panel');
  const [qaSetDescription, setQaSetDescription] = useState('');
  const [qaSetSavedNotice, setQaSetSavedNotice] = useState(false);

  // Reusable Q&A Set Library Modal state
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryNotice, setLibraryNotice] = useState<string | null>(null);

  // Avatar colors rotation
  const avatarColors = ['bg-purple-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-sky-600', 'bg-amber-600'];

  // Add interviewer
  const handleAddInterviewer = () => {
    const newIdx = interviewers.length + 1;
    const newId = `p-interviewer-${Date.now()}`;
    const defaultRole: InterviewerRoleType = 'Technical Interviewer';
    const newInterviewer: LiveParticipant = {
      id: newId,
      name: `Interviewer ${newIdx}`,
      role: defaultRole,
      isInterviewer: true,
      avatarColor: avatarColors[newIdx % avatarColors.length]
    };

    setInterviewers(prev => [...prev, newInterviewer]);

    // Dynamically fetch canonical blueprints assigned to this role
    const roleBlueprints = getCanonicalBlueprintsForRole(defaultRole, newId, newInterviewer.name);
    if (roleBlueprints.length > 0) {
      setBlueprints(prev => [...prev, ...roleBlueprints]);
    }
  };

  // Remove interviewer
  const handleRemoveInterviewer = (id: string) => {
    if (interviewers.length <= 1) return; // Keep at least one
    setInterviewers(prev => prev.filter(i => i.id !== id));
    setBlueprints(prev => prev.filter(b => b.interviewerId !== id));
  };

  // Update interviewer name
  const handleUpdateInterviewerName = (id: string, name: string) => {
    setInterviewers(prev => prev.map(i => (i.id === id ? { ...i, name } : i)));
    setBlueprints(prev => prev.map(b => (b.interviewerId === id ? { ...b, interviewerName: name } : b)));
  };

  // Update interviewer role & update recommendations from canonical library
  const handleUpdateInterviewerRole = (id: string, newRole: InterviewerRoleType) => {
    setInterviewers(prev => prev.map(i => (i.id === id ? { ...i, role: newRole } : i)));

    const targetInterviewer = interviewers.find(i => i.id === id);
    const intName = targetInterviewer ? targetInterviewer.name : 'Interviewer';

    // Keep blueprints that were manually added, but re-populate recommendations from canonical store
    const roleBlueprints = getCanonicalBlueprintsForRole(newRole, id, intName);

    setBlueprints(prev => {
      // Remove old role_default or ai_recommended for this interviewer
      const preservedManuallyAdded = prev.filter(
        b => !(b.interviewerId === id && (b.source === 'ai_recommended' || b.source === 'role_default'))
      );

      // Add new role blueprints avoiding duplicates
      const newItems = roleBlueprints.filter(
        rb => !preservedManuallyAdded.some(p => p.id === rb.id && p.interviewerId === id)
      );

      return [...preservedManuallyAdded, ...newItems];
    });
  };

  // Remove blueprint
  const handleRemoveBlueprint = (blueprintId: string, interviewerId: string) => {
    setBlueprints(prev => prev.filter(b => !(b.id === blueprintId && b.interviewerId === interviewerId)));
    if (expandedCardKey === `${blueprintId}-${interviewerId}`) {
      setExpandedCardKey(null);
    }
  };

  // Add blueprint manually from picker (canonical store)
  const handleSelectBlueprintFromPicker = (canonicalBp: StructuredAnswerBlueprint) => {
    const targetInterviewer = interviewers.find(i => i.id === selectedInterviewerForAdd) || interviewers[0];
    if (!targetInterviewer) return;

    // Prevent duplicate assignment of the same blueprint to the same interviewer
    const alreadyExists = blueprints.some(
      b => b.id === canonicalBp.id && b.interviewerId === targetInterviewer.id
    );

    if (!alreadyExists) {
      const newBp: ConfiguredBlueprint = createConfiguredBlueprint(
        canonicalBp,
        targetInterviewer.id,
        targetInterviewer.name,
        targetInterviewer.role as InterviewerRoleType,
        'manually_added'
      );
      setBlueprints(prev => [...prev, newBp]);
    }

    setIsAddPickerOpen(false);
  };

  // Save as Q&A Set into persistent storage
  const handleSaveAsQASet = () => {
    if (!qaSetName.trim()) return;
    const desc = qaSetDescription.trim() || `${interviewers.length} interviewers, ${blueprints.length} configured blueprints.`;
    
    LiveInterviewStorageService.saveQASet(
      qaSetName,
      desc,
      interviewers,
      blueprints
    );

    setQaSetSavedNotice(true);
    setIsSavingQASet(false);
    setTimeout(() => setQaSetSavedNotice(false), 3500);
  };

  // Load a Q&A Set from the Library
  const handleLoadQASet = (qaSet: ReusableQASet) => {
    const { resolved, missingCount } = LiveInterviewStorageService.resolveQASetBlueprints(qaSet);

    setInterviewers(qaSet.interviewers);
    setBlueprints(resolved);

    if (missingCount > 0) {
      setLibraryNotice(`Loaded "${qaSet.name}". Note: ${missingCount} blueprint(s) were previously deleted in My Profile and were excluded.`);
    } else {
      setLibraryNotice(`Successfully loaded "${qaSet.name}" with ${resolved.length} canonical blueprints.`);
    }

    setTimeout(() => setLibraryNotice(null), 5000);
  };

  // Toggle card expansion
  const toggleCardExpansion = (key: string) => {
    setExpandedCardKey(prev => (prev === key ? null : key));
  };

  // Canonical blueprints for the picker
  const canonicalBlueprintsList = KnowledgeStorageService.getBlueprints();
  const filteredPickerBlueprints = canonicalBlueprintsList.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.targetRole && b.targetRole.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.assignedRoles && b.assignedRoles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesFramework = selectedFrameworkFilter === 'All' || b.framework === selectedFrameworkFilter;
    return matchesSearch && matchesFramework;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Pre-Interview Processing &amp; Intelligence
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase tracking-wide">
                  Canonical Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Configure interview participants and dynamic Q&amp;A blueprints linked to your Profile library for Live Copilot.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-navigation with persistent Library button */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center justify-between gap-4 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('configuration')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'configuration'
                  ? 'border-purple-600 text-purple-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Interviewers &amp; Blueprint Mapping</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
                {interviewers.length} Int • {blueprints.length} Bp
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('extracted')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'extracted'
                  ? 'border-purple-600 text-purple-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Extracted Questions &amp; Blueprints</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                {blueprints.length}
              </span>
            </button>
          </div>

          {/* Action Triggers: Persistent [ Library ] and [ Save as Q&A Set ] */}
          <div className="pb-2.5 flex items-center gap-2">
            {qaSetSavedNotice && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved to Library
              </span>
            )}

            {/* Persistent Library button */}
            <button
              type="button"
              id="btn-qa-set-library"
              onClick={() => setIsLibraryOpen(true)}
              className="text-xs font-bold text-slate-700 hover:text-purple-700 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-purple-300 bg-white hover:bg-purple-50/50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Browse previously saved reusable panels and blueprints"
            >
              <FolderOpen className="w-3.5 h-3.5 text-purple-600" />
              <span>Library</span>
            </button>

            {/* Save as Q&A Set button */}
            <button
              type="button"
              id="btn-save-as-qa-set"
              onClick={() => setIsSavingQASet(prev => !prev)}
              className="text-xs font-bold text-slate-700 hover:text-purple-700 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5 text-purple-600" />
              <span>Save as Q&amp;A Set</span>
            </button>
          </div>
        </div>

        {/* Notice Banner (e.g., when a set is loaded or blueprint was deleted) */}
        {libraryNotice && (
          <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-200 text-xs font-semibold text-blue-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{libraryNotice}</span>
            </div>
            <button
              onClick={() => setLibraryNotice(null)}
              className="text-blue-500 hover:text-blue-800 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Save as Q&A Set Drawer / Inline Form */}
        {isSavingQASet && (
          <div className="p-4 bg-purple-50/80 border-b border-purple-200 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-150 shrink-0">
            <div className="flex-1 min-w-[240px] space-y-2">
              <div>
                <label className="block text-[11px] font-bold text-purple-900 mb-1">
                  Name this reusable Q&amp;A panel configuration:
                </label>
                <input
                  type="text"
                  value={qaSetName}
                  onChange={(e) => setQaSetName(e.target.value)}
                  placeholder="e.g. Senior Product Manager — E-commerce Panel"
                  className="w-full bg-white border border-purple-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={qaSetDescription}
                  onChange={(e) => setQaSetDescription(e.target.value)}
                  placeholder="Optional brief notes or panel context..."
                  className="w-full bg-white border border-purple-200 rounded-xl px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveAsQASet}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Save Reusable Set
              </button>
              <button
                type="button"
                onClick={() => setIsSavingQASet(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: INTERVIEWERS & ROLES CONFIGURATION */}
          {activeTab === 'configuration' && (
            <div className="space-y-6">
              
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Interviewers &amp; Roles</span>
                    <span className="text-xs font-medium text-slate-500">
                      (Configure the panel and their role-aligned blueprints)
                    </span>
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleAddInterviewer}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Interviewer</span>
                </button>
              </div>

              {/* Interviewer Cards */}
              <div className="space-y-4">
                {interviewers.map((interviewer) => {
                  const assignedBlueprints = blueprints.filter(b => b.interviewerId === interviewer.id);

                  return (
                    <div
                      key={interviewer.id}
                      className="p-4.5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-purple-200 transition-all shadow-3xs space-y-3.5"
                    >
                      {/* Interviewer Row: Name + Role Dropdown + Remove */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase text-white shadow-2xs ${interviewer.avatarColor}`}>
                            {interviewer.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={interviewer.name}
                              onChange={(e) => handleUpdateInterviewerName(interviewer.id, e.target.value)}
                              className="text-xs font-extrabold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400 w-36 sm:w-44"
                              placeholder="Interviewer Name"
                            />

                            <span className="text-xs text-slate-400 font-medium">as</span>

                            {/* Role Dropdown */}
                            <select
                              value={interviewer.role}
                              onChange={(e) => handleUpdateInterviewerRole(interviewer.id, e.target.value as InterviewerRoleType)}
                              className="text-xs font-bold text-purple-950 bg-purple-50/80 border border-purple-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
                            >
                              {AVAILABLE_INTERVIEWER_ROLES.map(role => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Interviewer Action Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInterviewerForAdd(interviewer.id);
                              setIsAddPickerOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-50 text-purple-700 border border-purple-200/80 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Blueprint</span>
                          </button>

                          {interviewers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveInterviewer(interviewer.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove Interviewer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Associated Blueprints for this Interviewer */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                            Assigned Q&amp;A Blueprints ({assignedBlueprints.length})
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Synced with Canonical Library
                          </span>
                        </div>

                        {assignedBlueprints.length === 0 ? (
                          <div className="p-3 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 bg-white">
                            No blueprints assigned yet. Click "Add Blueprint" to assign questions to {interviewer.name}.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {assignedBlueprints.map(bp => {
                              const cardKey = `${bp.id}-${interviewer.id}`;
                              const isExpanded = expandedCardKey === cardKey;
                              const canonical = bp.canonicalBlueprint;
                              const comp = canonical?.components;

                              return (
                                <div
                                  key={cardKey}
                                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-purple-300 shadow-3xs transition-all space-y-2.5"
                                >
                                  {/* Compact Header */}
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1 flex-1">
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                          bp.blueprint.framework === 'Custom Structure'
                                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                            : 'bg-purple-50 text-purple-800 border border-purple-200'
                                        }`}>
                                          {bp.blueprint.framework}
                                        </span>

                                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                          bp.source === 'manually_added'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'bg-purple-50 text-purple-700'
                                        }`}>
                                          {bp.source === 'manually_added' ? 'Manually Added' : 'Role Default'}
                                        </span>

                                        {canonical?.targetRole && (
                                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                            <Target className="w-2.5 h-2.5" /> {canonical.targetRole}
                                          </span>
                                        )}
                                      </div>

                                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                                        {bp.title}
                                      </h5>

                                      <p className="text-[11px] text-slate-600 line-clamp-2 italic font-serif">
                                        "{bp.questionText}"
                                      </p>
                                    </div>

                                    {/* Action Buttons: See Details / Collapse + Remove */}
                                    <div className="flex items-center gap-1.5 shrink-0 self-start">
                                      <button
                                        type="button"
                                        onClick={() => toggleCardExpansion(cardKey)}
                                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                      >
                                        <span>{isExpanded ? 'Collapse' : 'See Details'}</span>
                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleRemoveBlueprint(bp.id, interviewer.id)}
                                        className="text-slate-300 hover:text-rose-600 transition-colors cursor-pointer p-1 rounded-md hover:bg-rose-50"
                                        title="Remove blueprint"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* INLINE CARD EXPANSION (Accordian - NO separate bottom drawer!) */}
                                  {isExpanded && (
                                    <div className="pt-2.5 border-t border-slate-100 space-y-2.5 text-xs animate-in slide-in-from-top-1">
                                      
                                      {/* Custom Structure View */}
                                      {canonical?.framework === 'Custom' ? (
                                        <div className="space-y-2">
                                          {comp?.context && (
                                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                                              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-0.5">
                                                Context (Optional)
                                              </span>
                                              <p className="text-slate-700 leading-relaxed text-[11px]">
                                                {comp.context}
                                              </p>
                                            </div>
                                          )}

                                          {comp?.solutionAndImpact && (
                                            <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-200">
                                              <span className="font-bold text-purple-900 uppercase tracking-wider text-[10px] block mb-0.5">
                                                Solution &amp; Impact
                                              </span>
                                              <p className="text-slate-800 leading-relaxed text-[11px]">
                                                {comp.solutionAndImpact}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        /* Standard Framework (STAR, CAR, PDI) View */
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                          {/* Context / Situation */}
                                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                                            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                                              Situation &amp; Task
                                            </span>
                                            <p className="text-slate-600 leading-relaxed">
                                              {bp.blueprint.situation || bp.blueprint.opening}
                                            </p>
                                            {bp.blueprint.task && (
                                              <p className="text-slate-500 pt-0.5">
                                                <strong>Task:</strong> {bp.blueprint.task}
                                              </p>
                                            )}
                                          </div>

                                          {/* Actions Taken */}
                                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                                            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                                              Actions &amp; Decisions
                                            </span>
                                            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                                              {bp.blueprint.action.map((act, i) => (
                                                <li key={i}>{act}</li>
                                              ))}
                                            </ul>
                                          </div>

                                          {/* Results & Impact */}
                                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                                            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                                              Results &amp; Impact
                                            </span>
                                            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                                              {bp.blueprint.result.map((res, i) => (
                                                <li key={i}>{res}</li>
                                              ))}
                                            </ul>

                                            {/* Metrics */}
                                            {bp.blueprint.metrics && bp.blueprint.metrics.length > 0 && (
                                              <div className="flex flex-wrap gap-1.5 pt-1.5">
                                                {bp.blueprint.metrics.map((m, i) => (
                                                  <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                                                    ✓ {m}
                                                  </span>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Cues */}
                                      {comp?.keyCues && comp.keyCues.length > 0 && (
                                        <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-1.5">
                                          <span className="font-bold uppercase text-[10px] shrink-0">Key Delivery Cues:</span>
                                          <span>{comp.keyCues.join(' • ')}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: EXTRACTED QUESTIONS & BLUEPRINTS */}
          {activeTab === 'extracted' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Extracted Questions &amp; Blueprints
                  </h4>
                  <p className="text-xs text-slate-500">
                    Regenerated from the configured interview setup: roles, recommendations, and custom additions.
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                  {blueprints.length} Active Blueprints Loaded
                </span>
              </div>

              <div className="space-y-3">
                {blueprints.map((item, idx) => {
                  const cardKey = `extracted-${item.id}-${item.interviewerId}-${idx}`;
                  const isExpanded = expandedCardKey === cardKey;

                  return (
                    <div
                      key={cardKey}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-200 transition-all shadow-3xs space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-black uppercase">
                            QUESTION {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            Assigned to: <strong className="text-slate-800">{item.interviewerName}</strong> ({item.interviewerRole})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            {item.matchScore}% Match
                          </span>

                          {/* See Details / Collapse inline button */}
                          <button
                            type="button"
                            onClick={() => toggleCardExpansion(cardKey)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-800 hover:text-purple-900 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                            <span>{isExpanded ? 'Collapse' : 'See Details'}</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                          "{item.questionText}"
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-600">
                          <span className="text-purple-600 font-bold">Matched Blueprint:</span>
                          <span className="font-bold text-slate-800">{item.title}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">{item.topic}</span>
                        </div>
                      </div>

                      {/* Extracted Tab Inline Card Expansion */}
                      {isExpanded && (
                        <div className="mt-2 pt-3 border-t border-slate-100 space-y-2 text-xs animate-in slide-in-from-top-1 bg-slate-50/50 p-3 rounded-xl">
                          <div>
                            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                              Framework: {item.blueprint.framework}
                            </span>
                            {item.blueprint.situation && (
                              <p className="text-slate-700 mt-1">
                                <strong>Situation:</strong> {item.blueprint.situation}
                              </p>
                            )}
                          </div>

                          {item.blueprint.action && item.blueprint.action.length > 0 && (
                            <div>
                              <strong className="text-slate-700 block">Actions:</strong>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px] mt-0.5">
                                {item.blueprint.action.map((a, i) => <li key={i}>{a}</li>)}
                              </ul>
                            </div>
                          )}

                          {item.blueprint.result && item.blueprint.result.length > 0 && (
                            <div>
                              <strong className="text-slate-700 block">Results:</strong>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px] mt-0.5">
                                {item.blueprint.result.map((r, i) => <li key={i}>{r}</li>)}
                              </ul>
                            </div>
                          )}

                          {item.blueprint.metrics && item.blueprint.metrics.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {item.blueprint.metrics.map((m, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                                  ✓ {m}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer / CTAs */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            <strong className="text-slate-900">{blueprints.length}</strong> canonical Q&amp;A blueprints configured for this session.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onSaveAndLoad(interviewers, blueprints)}
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Load Q&amp;A Set</span>
            </button>
          </div>
        </div>

      </div>

      {/* SEARCHABLE ADD BLUEPRINT SELECTOR POPUP (From Canonical Knowledge Storage) */}
      {isAddPickerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Select From Canonical Q&amp;A Library
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPickerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Interviewer Indicator */}
            <div className="px-4 py-2 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-semibold">Assigning to interviewer:</span>
              <select
                value={selectedInterviewerForAdd}
                onChange={(e) => setSelectedInterviewerForAdd(e.target.value)}
                className="font-bold text-purple-900 bg-white border border-purple-200 rounded-md px-2 py-0.5 text-xs"
              >
                {interviewers.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions, role categories, frameworks, or metrics..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Framework Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1">
                {['All', 'Custom', 'STAR', 'CAR', 'Problem → Decision → Impact'].map(fw => (
                  <button
                    key={fw}
                    type="button"
                    onClick={() => setSelectedFrameworkFilter(fw)}
                    className={`px-2 py-0.5 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedFrameworkFilter === fw
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {fw === 'Custom' ? 'Custom Structure' : fw}
                  </button>
                ))}
              </div>
            </div>

            {/* Blueprint Results List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {filteredPickerBlueprints.map(bp => {
                const isAssignedToSelected = blueprints.some(
                  b => b.id === bp.id && b.interviewerId === selectedInterviewerForAdd
                );

                return (
                  <div
                    key={bp.id}
                    onClick={() => !isAssignedToSelected && handleSelectBlueprintFromPicker(bp)}
                    className={`p-3 rounded-xl border transition-all shadow-3xs flex items-center justify-between gap-3 ${
                      isAssignedToSelected
                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                        : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 cursor-pointer group'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-purple-900">
                          {bp.title}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold border ${
                          bp.framework === 'Custom'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {bp.framework === 'Custom' ? 'Custom Structure' : bp.framework}
                        </span>
                        {bp.targetRole && (
                          <span className="text-[10px] text-slate-500">
                            • {bp.targetRole}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                        "{bp.questionText}"
                      </p>

                      {bp.assignedRoles && bp.assignedRoles.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          <span className="text-[10px] text-slate-400">Assigned:</span>
                          {bp.assignedRoles.map(r => (
                            <span key={r} className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold">
                      {isAssignedToSelected ? (
                        <span className="text-slate-400 text-2xs">Already added</span>
                      ) : (
                        <div className="text-purple-600 group-hover:text-purple-800 flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Select</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredPickerBlueprints.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching blueprints found in your Profile library.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* REUSABLE Q&A SET LIBRARY MODAL */}
      <QASetLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onLoadSet={handleLoadQASet}
      />

    </div>
  );
};
