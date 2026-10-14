import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Plus, 
  Trash2, 
  FolderKanban, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { CandidateStory, StoryBestFor, StoryEvidenceQuality } from '../../../features/knowledge/types';
import { CareerProject } from '../../../features/projects/types';
import { ProjectStorageService } from '../../../features/projects/services/projectStorageService';

interface CreateStoryModalProps {
  isOpen: boolean;
  story?: CandidateStory | null;
  projects: CareerProject[];
  onClose: () => void;
  onSave: (story: CandidateStory) => void;
}

const ALL_COMPETENCIES: StoryBestFor[] = [
  'Conflict',
  'Leadership',
  'Ambiguity',
  'Failure',
  'Decision Making',
  'Technical Architecture',
  'Scale',
  'Turnaround',
  'Execution Under Pressure',
  'Customer Insights',
  'Customer Impact',
  'Cross-functional'
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  story,
  projects,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(story?.title || '');
  const [projectId, setProjectId] = useState<string>(story?.projectId || '');
  const [synopsis, setSynopsis] = useState(story?.synopsis || '');
  const [selectedCompetencies, setSelectedCompetencies] = useState<StoryBestFor[]>(
    story?.bestFor || ['Decision Making']
  );
  const [context, setContext] = useState(story?.context || '');
  const [myRole, setMyRole] = useState(story?.myRole || '');
  const [actions, setActions] = useState(story?.actions || '');
  const [decision, setDecision] = useState(story?.decision || '');
  const [tradeoffs, setTradeoffs] = useState(story?.tradeoffs || '');
  const [outcome, setOutcome] = useState(story?.outcome || '');
  const [metricsInput, setMetricsInput] = useState(story?.metrics.join('\n') || '');
  const [skillsInput, setSkillsInput] = useState(story?.skills.join(', ') || '');
  const [relevantRolesInput, setRelevantRolesInput] = useState(story?.relevantRoles.join(', ') || 'Software Engineering');
  const [evidenceQuality, setEvidenceQuality] = useState<StoryEvidenceQuality>(
    story?.evidenceQuality || 'Strong evidence'
  );

  const toggleCompetency = (comp: StoryBestFor) => {
    if (selectedCompetencies.includes(comp)) {
      if (selectedCompetencies.length > 1) {
        setSelectedCompetencies(selectedCompetencies.filter(c => c !== comp));
      }
    } else {
      setSelectedCompetencies([...selectedCompetencies, comp]);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const metricsArr = metricsInput
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    const skillsArr = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const rolesArr = relevantRolesInput
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const matchedProject = projects.find(p => p.id === projectId);

    const storyId = story?.id || `story-${Date.now()}`;
    const updatedStory: CandidateStory = {
      id: storyId,
      title: title.trim(),
      projectId: projectId || undefined,
      projectTitle: matchedProject?.title || undefined,
      bestFor: selectedCompetencies,
      relevantRoles: rolesArr.length > 0 ? rolesArr : ['Software Engineering'],
      skills: skillsArr,
      metricsStatus: metricsArr.length > 0 ? 'Available' : 'Missing',
      metrics: metricsArr,
      evidenceQuality: evidenceQuality,
      synopsis: synopsis.trim(),
      context: context.trim(),
      myRole: myRole.trim(),
      actions: actions.trim(),
      decision: decision.trim(),
      tradeoffs: tradeoffs.trim(),
      outcome: outcome.trim(),
      linkedQuestionIds: story?.linkedQuestionIds || [],
      linkedBlueprintIds: story?.linkedBlueprintIds || [],
      createdAt: story?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If linked to a project, ensure the project's linkedStoryIds is updated
    if (projectId) {
      ProjectStorageService.linkStoryToProject(projectId, storyId);
    }

    onSave(updatedStory);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {story ? 'Edit Candidate Story' : 'Create Candidate Story'}
              </h2>
              <p className="text-2xs text-slate-500">
                STAR narrative optimized for behavioral interviews.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Title & Project Link */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-7">
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Story Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Microservices Split vs Monolith Benchmarking"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-5">
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Link to Originating Project
              </label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">None (Standalone Story)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Competency selector */}
          <div>
            <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Best For Competencies (Select 1-3)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_COMPETENCIES.map(comp => {
                const isSelected = selectedCompetencies.includes(comp);
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleCompetency(comp)}
                    className={`px-2.5 py-1 rounded-lg text-2xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {comp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Opening Hook / Synopsis (2-3 sentences)
            </label>
            <textarea
              rows={2}
              value={synopsis}
              onChange={e => setSynopsis(e.target.value)}
              placeholder="High-level narrative summary of the conflict, challenge, and resolution..."
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Context & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Context & Situation
              </label>
              <textarea
                rows={3}
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="What was the baseline situation, constraints, or friction?"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                My Role & Ownership
              </label>
              <textarea
                rows={3}
                value={myRole}
                onChange={e => setMyRole(e.target.value)}
                placeholder="What specifically was your individual accountability?"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions & Execution */}
          <div>
            <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Actions & Concrete Execution
            </label>
            <textarea
              rows={3}
              value={actions}
              onChange={e => setActions(e.target.value)}
              placeholder="Step-by-step actions you took, methodologies applied, cross-functional consensus..."
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Decision & Tradeoffs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Decisive Turning Point
              </label>
              <input
                type="text"
                value={decision}
                onChange={e => setDecision(e.target.value)}
                placeholder="What choice did you make and why?"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Trade-off Accepted
              </label>
              <input
                type="text"
                value={tradeoffs}
                onChange={e => setTradeoffs(e.target.value)}
                placeholder="What downside did you accept or mitigate?"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Outcome & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Outcome & Impact
              </label>
              <textarea
                rows={3}
                value={outcome}
                onChange={e => setOutcome(e.target.value)}
                placeholder="Final result, customer reaction, team health, or financial outcomes..."
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Verified Metrics</span>
                <span className="text-slate-400 font-normal">One per line</span>
              </label>
              <textarea
                rows={3}
                value={metricsInput}
                onChange={e => setMetricsInput(e.target.value)}
                placeholder="14ms p99 query latency achieved&#10;$4,000/mo saved in licensing"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!title.trim()}
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            {story ? 'Save Story Changes' : 'Create Story'}
          </button>
        </div>

      </div>
    </div>
  );
};
