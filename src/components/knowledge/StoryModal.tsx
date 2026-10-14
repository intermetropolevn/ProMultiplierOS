import React, { useState } from 'react';
import { X, Check, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { CandidateStory, StoryBestFor, StoryEvidenceQuality } from '../../features/knowledge/types';
import { QUESTIONS_DATA } from '../../data/questionsData';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (story: CandidateStory) => void;
  initialStory?: CandidateStory | null;
}

const BEST_FOR_OPTIONS: StoryBestFor[] = [
  'Conflict',
  'Leadership',
  'Ambiguity',
  'Failure',
  'Decision Making',
  'Technical Architecture',
  'Scale',
  'Turnaround',
  'Execution Under Pressure'
];

export const StoryModal: React.FC<StoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStory
}) => {
  const isEditing = !!initialStory;

  const [title, setTitle] = useState(initialStory?.title || '');
  const [synopsis, setSynopsis] = useState(initialStory?.synopsis || '');
  const [bestFor, setBestFor] = useState<StoryBestFor[]>(initialStory?.bestFor || ['Conflict']);
  const [relevantRolesText, setRelevantRolesText] = useState(initialStory?.relevantRoles?.join(', ') || 'PM, Growth PM');
  const [skillsText, setSkillsText] = useState(initialStory?.skills?.join(', ') || 'Stakeholder Management, Communication');
  const [metricsText, setMetricsText] = useState(initialStory?.metrics?.join('\n') || '');
  const [metricsStatus, setMetricsStatus] = useState<'Available' | 'Missing'>(initialStory?.metricsStatus || 'Available');
  
  // Structured narrative components
  const [context, setContext] = useState(initialStory?.context || '');
  const [myRole, setMyRole] = useState(initialStory?.myRole || '');
  const [actions, setActions] = useState(initialStory?.actions || '');
  const [decision, setDecision] = useState(initialStory?.decision || '');
  const [tradeoffs, setTradeoffs] = useState(initialStory?.tradeoffs || '');
  const [outcome, setOutcome] = useState(initialStory?.outcome || '');

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(initialStory?.linkedQuestionIds || []);

  if (!isOpen) return null;

  const toggleBestFor = (option: StoryBestFor) => {
    setBestFor(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const toggleQuestion = (qId: string) => {
    setSelectedQuestionIds(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const metrics = metricsText
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    const relevantRoles = relevantRolesText
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const skills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Compute visual indicator: Strong evidence vs Partial evidence vs Needs metrics
    let evidenceQuality: StoryEvidenceQuality = 'Strong evidence';
    const hasUnverified = metrics.some(m => m.toLowerCase().includes('add a concrete metric') || m.toLowerCase().includes('missing'));
    if (metricsStatus === 'Missing' || metrics.length === 0 || hasUnverified) {
      evidenceQuality = 'Needs metrics';
    } else if (!decision.trim() || !tradeoffs.trim() || !actions.trim()) {
      evidenceQuality = 'Partial evidence';
    }

    const storyToSave: CandidateStory = {
      id: initialStory?.id || `story-${Date.now()}`,
      title: title.trim(),
      synopsis: synopsis.trim() || context.slice(0, 150),
      evidenceId: initialStory?.evidenceId,
      bestFor: bestFor.length > 0 ? bestFor : ['Decision Making'],
      relevantRoles: relevantRoles.length > 0 ? relevantRoles : ['PM'],
      skills: skills.length > 0 ? skills : ['Communication'],
      metricsStatus,
      metrics: metrics.length > 0 ? metrics : ['Add a concrete metric if available.'],
      evidenceQuality,
      context: context.trim(),
      myRole: myRole.trim(),
      actions: actions.trim(),
      decision: decision.trim(),
      tradeoffs: tradeoffs.trim(),
      outcome: outcome.trim(),
      linkedQuestionIds: selectedQuestionIds,
      createdAt: initialStory?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(storyToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Story Bank Card
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Reusable Interview Evidence
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {isEditing ? 'Edit Story Card' : 'Create New Story Card'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Story Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. CRM Migration & Real-Time Sync"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 placeholder:text-slate-400 font-bold"
            />
          </div>

          {/* Best For (Archetypes) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Best For: (Select all relevant interview behavioral themes)
            </label>
            <div className="flex flex-wrap gap-2">
              {BEST_FOR_OPTIONS.map(opt => {
                const isSelected = bestFor.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleBestFor(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Story Synopsis (Quick 2-line memory hook)
            </label>
            <textarea
              rows={2}
              value={synopsis}
              onChange={e => setSynopsis(e.target.value)}
              placeholder="Migrated 12M customer records to Postgres using CDC. Overcame tenant resistance through dual-run verification."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Relevant Roles & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Relevant Roles (comma-separated)
              </label>
              <input
                type="text"
                value={relevantRolesText}
                onChange={e => setRelevantRolesText(e.target.value)}
                placeholder="PM, Growth PM, Senior SWE"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Skills Highlighted (comma-separated)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={e => setSkillsText(e.target.value)}
                placeholder="Stakeholder Management, Communication, RFC"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Context & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Context
              </label>
              <textarea
                rows={2}
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="Business stakes and tension"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                My Role
              </label>
              <textarea
                rows={2}
                value={myRole}
                onChange={e => setMyRole(e.target.value)}
                placeholder="Your specific scope and contribution"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Actions & Decision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Actions
              </label>
              <textarea
                rows={2}
                value={actions}
                onChange={e => setActions(e.target.value)}
                placeholder="Specific steps and collaboration"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Decision & Trade-offs
              </label>
              <textarea
                rows={2}
                value={decision}
                onChange={e => setDecision(e.target.value)}
                placeholder="Strategic decision and trade-offs"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Outcome & Metrics Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Metrics (One per line)
              </label>
              <textarea
                rows={3}
                value={metricsText}
                onChange={e => setMetricsText(e.target.value)}
                placeholder="12M customer records&#10;0s unplanned downtime&#10;+18% conversion lift"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 font-mono text-xs placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Metrics Status
              </label>
              <select
                value={metricsStatus}
                onChange={e => setMetricsStatus(e.target.value as 'Available' | 'Missing')}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 bg-white font-semibold cursor-pointer"
              >
                <option value="Available">Metrics Available</option>
                <option value="Missing">Metrics Missing (Needs Baseline)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {metricsStatus === 'Available' 
                  ? 'Displays "Strong evidence" or "Partial evidence"'
                  : 'Displays "Needs metrics" warning indicator'}
              </p>
            </div>
          </div>

          {/* Linked Questions Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Link to Interview Questions ({selectedQuestionIds.length} linked)
              </label>
              <span className="text-xs text-purple-700 font-semibold">
                Bidirectional Question Link
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
              {QUESTIONS_DATA.map(q => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => toggleQuestion(q.id)}
                    className={`w-full text-left p-2 rounded-lg flex items-start gap-2 text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50 border border-purple-200 text-purple-950 font-medium'
                        : 'bg-white hover:bg-slate-100 border border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1">{q.question}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        <span className="font-semibold">{q.roleCategory}</span>
                        <span>•</span>
                        <span>{q.type}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs cursor-pointer"
            >
              {isEditing ? 'Save Story' : 'Add to Story Bank'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
