import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Plus, 
  Search, 
  Filter, 
  Cpu, 
  Tag, 
  Layers, 
  Trash2, 
  GitBranch, 
  Compass, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { 
  AIPromptTemplate, 
  ProductLifecycleStage, 
  PromptPurpose, 
  WorkflowPatternType 
} from '../../../features/knowledge/types/knowledgeTaxonomy';
import { AIPromptsStore } from '../../../features/knowledge/data/aiPromptsData';
import { CANONICAL_ROLES } from '../../../data/jobTaxonomies';
import { RoleBlueprint } from '../../../types';

interface AIPromptsLibraryViewProps {
  selectedRoleBlueprint?: RoleBlueprint | null;
}

const ALL_LIFECYCLE_STAGES: ProductLifecycleStage[] = [
  'Discovery',
  'Research',
  'Definition',
  'Design',
  'Build',
  'Launch',
  'Growth',
  'Optimization',
  'Maintenance'
];

const ALL_PURPOSES: PromptPurpose[] = [
  'Multi-turn Reasoning',
  'Long-context',
  'Multimodal',
  'Coding',
  'Analysis',
  'Research',
  'Synthesis',
  'Critique',
  'Structured extraction',
  'Planning'
];

export const AIPromptsLibraryView: React.FC<AIPromptsLibraryViewProps> = ({
  selectedRoleBlueprint
}) => {
  const [prompts, setPrompts] = useState<AIPromptTemplate[]>(() => AIPromptsStore.getAllPrompts());
  const [selectedPromptId, setSelectedPromptId] = useState<string>(prompts[0]?.id || '');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state for creating custom prompt
  const [newTitle, setNewTitle] = useState('');
  const [newStage, setNewStage] = useState<ProductLifecycleStage>('Definition');
  const [newPurposes, setNewPurposes] = useState<PromptPurpose[]>(['Analysis', 'Structured extraction']);
  const [newWorkflowPattern, setNewWorkflowPattern] = useState<WorkflowPatternType>(
    'Context Ingestion → Deconstruction → Devil\'s Advocate → Structured Output'
  );
  const [newSummary, setNewSummary] = useState('');
  const [newTemplate, setNewTemplate] = useState('');
  const [newRecommendedModel, setNewRecommendedModel] = useState('Gemini 1.5 Pro (2M Context)');
  const [newTags, setNewTags] = useState('custom, prompt');

  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSummary = p.summary.toLowerCase().includes(q);
        const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchTags) return false;
      }

      if (selectedStage !== 'all' && p.lifecycleStage !== selectedStage) {
        return false;
      }

      if (selectedPurpose !== 'all' && !p.purposes.includes(selectedPurpose as PromptPurpose)) {
        return false;
      }

      return true;
    });
  }, [prompts, searchQuery, selectedStage, selectedPurpose]);

  const activePrompt = 
    filteredPrompts.find(p => p.id === selectedPromptId) || filteredPrompts[0] || prompts[0];

  const handleCopy = (prompt: AIPromptTemplate) => {
    navigator.clipboard.writeText(prompt.templateContent);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTemplate.trim()) return;

    const created = AIPromptsStore.saveCustomPrompt({
      title: newTitle.trim(),
      lifecycleStage: newStage,
      purposes: newPurposes,
      workflowPattern: newWorkflowPattern,
      modelProfile: {
        recommendedModel: newRecommendedModel,
        reasonForModel: 'Custom user prompt pattern tuned for specific operational workflows.',
        tokenContextTarget: 'Medium (8K-32K)',
        modality: 'Text-only'
      },
      summary: newSummary.trim() || 'User-authored custom reasoning prompt pattern.',
      templateContent: newTemplate.trim(),
      exampleVariables: [],
      suggestedInputArtifact: 'Raw user specification or context notes',
      expectedOutputFormat: 'Structured output',
      applicableRoles: ['Product Management', 'Software Engineering'],
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    const updated = AIPromptsStore.getAllPrompts();
    setPrompts(updated);
    setSelectedPromptId(created.id);
    setIsCreateModalOpen(false);

    // Reset
    setNewTitle('');
    setNewSummary('');
    setNewTemplate('');
  };

  const handleDeleteCustomPrompt = (id: string) => {
    AIPromptsStore.deleteCustomPrompt(id);
    const updated = AIPromptsStore.getAllPrompts();
    setPrompts(updated);
    if (selectedPromptId === id && updated[0]) {
      setSelectedPromptId(updated[0].id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-violet-50/90 via-fuchsia-50/40 to-slate-50 p-6 rounded-3xl border border-violet-100/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-700 bg-violet-100/80 px-2 py-0.5 rounded-md">
                Reasoning Patterns
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-500">
                ROLE BLUEPRINT → AI PROMPTS LIBRARY
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI Prompts & Reasoning Patterns
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Curated and user-created prompt templates structured across Product Lifecycle Stages and Reasoning Purposes. Pre-configured with recommended Gemini model capabilities and structured workflow patterns.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Prompt</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompt templates, tags..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-violet-500 shadow-2xs"
            />
          </div>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-violet-500 shadow-2xs text-slate-700 font-medium"
          >
            <option value="all">All Lifecycle Stages (9)</option>
            {ALL_LIFECYCLE_STAGES.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>

          <select
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-violet-500 shadow-2xs text-slate-700 font-medium"
          >
            <option value="all">All Purposes (10)</option>
            {ALL_PURPOSES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Showing <strong>{filteredPrompts.length}</strong> reasoning prompt patterns</span>
          {(selectedStage !== 'all' || selectedPurpose !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedStage('all');
                setSelectedPurpose('all');
                setSearchQuery('');
              }}
              className="text-violet-600 font-bold hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Prompts Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Prompt Cards */}
        <div className="lg:col-span-4 space-y-2.5">
          {filteredPrompts.map(p => {
            const isSelected = p.id === activePrompt?.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPromptId(p.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-violet-600 bg-violet-50/50 shadow-xs ring-2 ring-violet-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-violet-700' : 'text-slate-400'}`}>
                      {p.lifecycleStage}
                    </span>
                    {p.isCustom ? (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-violet-100 text-violet-800">
                        Custom
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700">
                        Curated
                      </span>
                    )}
                  </div>
                  <h4 className={`text-xs font-bold line-clamp-2 ${isSelected ? 'text-violet-950' : 'text-slate-900'}`}>
                    {p.title}
                  </h4>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[170px]">{p.modelProfile.recommendedModel.split('(')[0]}</span>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-violet-700' : 'text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Prompt Inspection */}
        <div className="lg:col-span-8 space-y-5">
          {activePrompt ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full">
                        {activePrompt.lifecycleStage} Stage
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-bold text-slate-600">
                        {activePrompt.purposes.join(', ')}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">
                      {activePrompt.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(activePrompt)}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all shrink-0"
                    >
                      {copiedId === activePrompt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied Template</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>

                    {activePrompt.isCustom && (
                      <button
                        onClick={() => handleDeleteCustomPrompt(activePrompt.id)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 cursor-pointer"
                        title="Delete custom prompt"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activePrompt.summary}
                </p>
              </div>

              {/* Workflow Pattern & Recommended Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-violet-600" />
                    <span>Structured Workflow Pattern</span>
                  </span>
                  <div className="text-xs text-violet-900 font-bold bg-violet-50/60 p-2 rounded-xl border border-violet-100">
                    {activePrompt.workflowPattern}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>Recommended Model Profile</span>
                  </span>
                  <div className="text-xs text-indigo-900 font-bold">
                    {activePrompt.modelProfile.recommendedModel}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {activePrompt.modelProfile.reasonForModel}
                  </p>
                </div>
              </div>

              {/* Prompt Template Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Prompt Template Text
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Variables enclosed in {"{{variable}}"}
                  </span>
                </div>

                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[380px]">
                    {activePrompt.templateContent}
                  </pre>
                </div>
              </div>

              {/* Variables & I/O Guidance */}
              {activePrompt.exampleVariables.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-900">Variables Breakdown:</span>
                  <div className="space-y-1.5">
                    {activePrompt.exampleVariables.map((v, i) => (
                      <div key={i} className="text-xs flex items-baseline gap-2">
                        <code className="text-violet-700 font-bold bg-violet-50 px-1.5 py-0.5 rounded-md font-mono text-[11px]">
                          {"{{" + v.variableName + "}}"}
                        </code>
                        <span className="text-slate-600">{v.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {activePrompt.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500">
              No matching prompts found.
            </div>
          )}
        </div>

      </div>

      {/* Create Custom Prompt Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Create Custom Reasoning Prompt
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePrompt} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Prompt Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Lock Failure Analyzer"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-violet-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Lifecycle Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as ProductLifecycleStage)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-violet-500 shadow-2xs"
                  >
                    {ALL_LIFECYCLE_STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Recommended Model</label>
                  <select
                    value={newRecommendedModel}
                    onChange={(e) => setNewRecommendedModel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-violet-500 shadow-2xs"
                  >
                    <option value="Gemini 1.5 Pro (2M Context)">Gemini 1.5 Pro (2M Context)</option>
                    <option value="Gemini 1.5 Flash (Fast Execution)">Gemini 1.5 Flash (Fast Execution)</option>
                    <option value="Gemini Thinking / Deep Reasoning">Gemini Thinking / Deep Reasoning</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Summary</label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="What does this prompt achieve?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-violet-500 shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Prompt Template Content</label>
                <textarea
                  required
                  rows={6}
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  placeholder="Write your prompt instructions here. Use {{variable_name}} for placeholder inputs."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-violet-500 shadow-2xs font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="architecture, idempotency, testing"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-violet-500 shadow-2xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Save to My Prompts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
