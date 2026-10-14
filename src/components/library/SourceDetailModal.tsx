import React, { useState } from 'react';
import { 
  NormalizedSource, 
  EvidenceStrengthLevel, 
  SourceStatus 
} from '../../features/sources/types';
import { 
  getEvidenceStrengthDefinition, 
  EVIDENCE_STRENGTH_LEVELS,
  getTypeConfig,
  getFamilyConfig
} from '../../features/sources/taxonomy';
import { 
  X, 
  ExternalLink, 
  Award, 
  BookOpen, 
  Briefcase, 
  FolderGit2, 
  Layout, 
  CheckCircle, 
  Tv, 
  FileText,
  Sparkles, 
  Tag, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  Check, 
  Edit3,
  Calendar,
  Building,
  User,
  ArrowRight
} from 'lucide-react';

interface SourceDetailModalProps {
  source: NormalizedSource;
  onClose: () => void;
  onUpdate: (updated: NormalizedSource) => void;
  onDelete?: (id: string) => void;
}

export const SourceDetailModal: React.FC<SourceDetailModalProps> = ({
  source,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'knowledge' | 'skills' | 'relationships' | 'insights'>('overview');
  const [currentSource, setCurrentSource] = useState<NormalizedSource>(source);
  const [isEditingStrength, setIsEditingStrength] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newKnowledgeInput, setNewKnowledgeInput] = useState('');

  const typeConfig = getTypeConfig(currentSource.sourceType);
  const familyConfig = getFamilyConfig(currentSource.sourceFamily);
  const strengthDef = getEvidenceStrengthDefinition(currentSource.evidenceStrength);

  const handleStrengthChange = (newLevel: EvidenceStrengthLevel) => {
    const updated = { ...currentSource, evidenceStrength: newLevel };
    setCurrentSource(updated);
    onUpdate(updated);
    setIsEditingStrength(false);
  };

  const handleStatusChange = (newStatus: SourceStatus) => {
    const updated = { ...currentSource, status: newStatus };
    setCurrentSource(updated);
    onUpdate(updated);
  };

  const confirmInferredSkill = (skill: string) => {
    const updatedInferred = currentSource.inferredSkills.filter(s => s !== skill);
    const updatedConfirmed = Array.from(new Set([...currentSource.confirmedSkills, skill]));
    const updated = {
      ...currentSource,
      inferredSkills: updatedInferred,
      confirmedSkills: updatedConfirmed
    };
    setCurrentSource(updated);
    onUpdate(updated);
  };

  const removeConfirmedSkill = (skill: string) => {
    const updatedConfirmed = currentSource.confirmedSkills.filter(s => s !== skill);
    const updated = {
      ...currentSource,
      confirmedSkills: updatedConfirmed
    };
    setCurrentSource(updated);
    onUpdate(updated);
  };

  const addManualSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const skill = newSkillInput.trim();
    const updated = {
      ...currentSource,
      confirmedSkills: Array.from(new Set([...currentSource.confirmedSkills, skill]))
    };
    setCurrentSource(updated);
    onUpdate(updated);
    setNewSkillInput('');
  };

  const confirmInferredKnowledge = (item: string) => {
    const updatedInferred = currentSource.inferredKnowledge.filter(k => k !== item);
    const updatedConfirmed = Array.from(new Set([...currentSource.confirmedKnowledge, item]));
    const updated = {
      ...currentSource,
      inferredKnowledge: updatedInferred,
      confirmedKnowledge: updatedConfirmed
    };
    setCurrentSource(updated);
    onUpdate(updated);
  };

  const addManualKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKnowledgeInput.trim()) return;
    const item = newKnowledgeInput.trim();
    const updated = {
      ...currentSource,
      confirmedKnowledge: Array.from(new Set([...currentSource.confirmedKnowledge, item]))
    };
    setCurrentSource(updated);
    onUpdate(updated);
    setNewKnowledgeInput('');
  };

  const getFamilyIcon = (family: string) => {
    switch (family) {
      case 'learn': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'credential': return <Award className="w-5 h-5 text-amber-600" />;
      case 'knowledge': return <FileText className="w-5 h-5 text-sky-600" />;
      case 'experience': return <Briefcase className="w-5 h-5 text-slate-700" />;
      case 'project': return <FolderGit2 className="w-5 h-5 text-indigo-600" />;
      case 'artifact': return <Layout className="w-5 h-5 text-purple-600" />;
      case 'content': return <Tv className="w-5 h-5 text-emerald-600" />;
      case 'assessment': return <CheckCircle className="w-5 h-5 text-rose-600" />;
      default: return <Layers className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                {getFamilyIcon(currentSource.sourceFamily)}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-800">
                {familyConfig?.label || currentSource.sourceFamily}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-600">
                {typeConfig?.type.label || currentSource.sourceType}
              </span>

              {/* Status Pill */}
              <select
                value={currentSource.status}
                onChange={(e) => handleStatusChange(e.target.value as SourceStatus)}
                className="text-xs font-bold px-2 py-0.5 rounded-md border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="earned">Earned</option>
                <option value="applied">Applied</option>
                <option value="passed">Passed</option>
                <option value="saved">Saved</option>
                <option value="archived">Archived</option>
              </select>

              {/* Language tag */}
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                {currentSource.language.toUpperCase()}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {currentSource.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              {(currentSource.provider || currentSource.organization) && (
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentSource.provider || currentSource.organization}</span>
                </div>
              )}
              {currentSource.author && (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentSource.author}</span>
                </div>
              )}
              {(currentSource.dateCompleted || currentSource.datePublished || currentSource.createdAt) && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentSource.dateCompleted || currentSource.datePublished || currentSource.createdAt.split('T')[0]}</span>
                </div>
              )}
              {currentSource.url && (
                <a
                  href={currentSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Source</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Evidence Strength Banner (0 - 6) */}
        <div className="px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-300 font-black text-sm">
              L{currentSource.evidenceStrength}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Evidence Strength:</span>
                <span className="text-xs font-black text-white">{strengthDef.name}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {strengthDef.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingStrength ? (
              <button
                onClick={() => setIsEditingStrength(true)}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3 h-3" />
                <span>Adjust Level</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                {EVIDENCE_STRENGTH_LEVELS.map(lvl => (
                  <button
                    key={lvl.level}
                    onClick={() => handleStrengthChange(lvl.level)}
                    title={`Level ${lvl.level}: ${lvl.name}`}
                    className={`px-2 py-1 rounded-md text-xs font-black transition-all cursor-pointer ${
                      currentSource.evidenceStrength === lvl.level
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    L{lvl.level}
                  </button>
                ))}
                <button
                  onClick={() => setIsEditingStrength(false)}
                  className="text-xs text-slate-400 hover:text-white px-1.5 py-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-4 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview & Context
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Skills & Competencies</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
              {currentSource.confirmedSkills.length + currentSource.inferredSkills.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'knowledge'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Knowledge & Methods</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
              {currentSource.confirmedKnowledge.length + currentSource.inferredKnowledge.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('relationships')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'relationships'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Career Relevance & Graph
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-purple-700 ${
              activeTab === 'insights'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-purple-600 hover:text-purple-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Insights</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {currentSource.description || 'No detailed description provided for this source.'}
                </p>
              </div>

              {/* Assessment details if present */}
              {currentSource.assessmentData && (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-900 uppercase tracking-wider">
                      Assessment & Case Evaluation
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      Result: {currentSource.assessmentData.result?.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Score / Tier:</span>
                      <span className="font-bold text-slate-900">{currentSource.assessmentData.score || 'Not graded'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Target Position:</span>
                      <span className="font-bold text-slate-900">{currentSource.assessmentData.relatedJobTitle || 'General'}</span>
                    </div>
                  </div>

                  {currentSource.assessmentData.reviewerFeedback && (
                    <div className="pt-2 border-t border-rose-100 text-xs">
                      <span className="text-slate-500 block font-medium">Reviewer Feedback:</span>
                      <p className="text-slate-800 mt-1 italic">
                        "{currentSource.assessmentData.reviewerFeedback}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Evidence Statements */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Evidence Statements</h4>
                {currentSource.evidenceStatements && currentSource.evidenceStatements.length > 0 ? (
                  <ul className="space-y-2">
                    {currentSource.evidenceStatements.map((stmt, idx) => (
                      <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{stmt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">No specific evidence statement generated yet.</p>
                )}
              </div>

              {/* Tags & Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSource.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Type Metadata</h4>
                  <div className="space-y-1 text-xs">
                    {Object.entries(currentSource.metadata || {}).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-slate-600 border-b border-slate-50 pb-1">
                        <span className="capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS & COMPETENCIES (Inferred vs User Confirmed) */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Human-in-the-Loop Integrity:</strong> AI inferences are marked as <em>Inferred</em> until you confirm them. Confirmed skills feed directly into your official Profile Skill Evidence Graph.
                </p>
              </div>

              {/* Confirmed Skills */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>User Confirmed Skills ({currentSource.confirmedSkills.length})</span>
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentSource.confirmedSkills.map((skill, sIdx) => (
                    <span 
                      key={`conf-${skill}-${sIdx}`} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeConfirmedSkill(skill)}
                        title="Remove confirmation"
                        className="text-emerald-500 hover:text-emerald-800 cursor-pointer ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {currentSource.confirmedSkills.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No confirmed skills yet. Confirm an inferred skill below or add one manually.</span>
                  )}
                </div>

                {/* Manual skill add form */}
                <form onSubmit={addManualSkill} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Add custom confirmed skill..."
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 flex-1 max-w-sm"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Inferred Skills */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI Inferred Skills ({currentSource.inferredSkills.length})</span>
                </h4>

                <div className="flex flex-wrap gap-2">
                  {currentSource.inferredSkills.map((skill, sIdx) => (
                    <div 
                      key={`inf-${skill}-${sIdx}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-900 text-xs font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => confirmInferredSkill(skill)}
                        className="px-2 py-0.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3 h-3" />
                        <span>Confirm</span>
                      </button>
                    </div>
                  ))}
                  {currentSource.inferredSkills.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No remaining inferred skills.</span>
                  )}
                </div>
              </div>

              {/* Competencies */}
              {currentSource.competencies && currentSource.competencies.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Demonstrated Competencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSource.competencies.map((comp, cIdx) => (
                      <span key={`comp-${comp}-${cIdx}`} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: KNOWLEDGE & METHODS */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              {/* Confirmed Knowledge */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Confirmed Knowledge Concepts ({currentSource.confirmedKnowledge.length})</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentSource.confirmedKnowledge.map((k, kIdx) => (
                    <div key={`conf-k-${k}-${kIdx}`} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between">
                      <span>{k}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Confirmed</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={addManualKnowledge} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newKnowledgeInput}
                    onChange={(e) => setNewKnowledgeInput(e.target.value)}
                    placeholder="Add conceptual knowledge..."
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 flex-1 max-w-sm"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Inferred Knowledge */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Inferred Conceptual Knowledge ({currentSource.inferredKnowledge.length})</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentSource.inferredKnowledge.map((k, kIdx) => (
                    <div key={`inf-k-${k}-${kIdx}`} className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-200/70 text-xs text-purple-950 flex items-center justify-between">
                      <span>{k}</span>
                      <button
                        onClick={() => confirmInferredKnowledge(k)}
                        className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold cursor-pointer"
                      >
                        Confirm
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Methods & Frameworks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Execution Methods</h4>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {currentSource.methods && currentSource.methods.length > 0 ? (
                      currentSource.methods.map((m, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span>{m}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400 italic">No methods linked</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Frameworks Used</h4>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {currentSource.frameworks && currentSource.frameworks.length > 0 ? (
                      currentSource.frameworks.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          <span>{f}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400 italic">No frameworks linked</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAREER RELEVANCE & RELATIONSHIPS */}
          {activeTab === 'relationships' && (
            <div className="space-y-6">
              {/* Target Roles & Paths */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Career Relevance</h4>
                <div className="flex flex-wrap gap-2">
                  {currentSource.careerRelevance && currentSource.careerRelevance.length > 0 ? (
                    currentSource.careerRelevance.map((role, rIdx) => (
                      <span key={`rel-${role}-${rIdx}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        <span>{role}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No specific role paths mapped.</span>
                  )}
                </div>
              </div>

              {/* Target Domains */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Applicable Industry Domains</h4>
                <div className="flex flex-wrap gap-2">
                  {currentSource.domains && currentSource.domains.length > 0 ? (
                    currentSource.domains.map((dom, dIdx) => (
                      <span key={`dom-${dom}-${dIdx}`} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold">
                        {dom}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">General / Domain-agnostic</span>
                  )}
                </div>
              </div>

              {/* Source-to-Experience Pipeline Diagram */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Ontological Pipeline Position
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white">Source</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900">Knowledge</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900">Skills</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900">Evidence</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white">Career Relevance</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                  This source provides evidence at <strong>Level {currentSource.evidenceStrength} ({strengthDef.name})</strong>, feeding directly into interview answer blueprints and role readiness scoring.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: AI INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/90 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                    AI Semantic Reasoning & Intelligence Extraction
                  </h4>
                </div>
                <p className="text-xs text-purple-900 leading-relaxed">
                  Extracted from structured metadata, taxonomy rules, and semantic disambiguation. Evaluated against industry role requirements for <strong>{currentSource.careerRelevance?.join(', ') || 'Software Engineering & Product Management'}</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recommended Next Steps for Higher Evidence</h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2">
                  {currentSource.evidenceStrength < 4 ? (
                    <p>
                      • To elevate this capability to <strong>Level 4 (Applied)</strong>, link this source to a real project or code repository where you implemented these concepts.
                    </p>
                  ) : currentSource.evidenceStrength === 4 ? (
                    <p>
                      • You have applied this in a project. To reach <strong>Level 5 (Demonstrated)</strong>, author a structured PRD or architecture RFC capturing key trade-offs and outcomes.
                    </p>
                  ) : (
                    <p>
                      • You have demonstrated or validated proof. This evidence is ready to be referenced directly in mock interview answers and portfolio decks.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this source?')) {
                    onDelete(currentSource.id);
                    onClose();
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Delete Source
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
