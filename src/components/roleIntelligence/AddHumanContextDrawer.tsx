import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  UserCheck, 
  Users, 
  Sparkles, 
  Check, 
  Plus, 
  ShieldCheck, 
  Tag,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { 
  CareerOSDimensionScore, 
  HumanSignalFeedback 
} from '../../features/roleIntelligence/types';

interface AddHumanContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dimension: CareerOSDimensionScore | null;
  onSaveContext: (
    dimensionKey: string, 
    selfScore: number | null, 
    newSignals: HumanSignalFeedback[], 
    contextChips: string[], 
    additionalContextText: string
  ) => void;
}

const CONTEXT_OPTIONS: { id: string; label: string; desc: string }[] = [
  { id: 'ctx-ambiguity', label: 'High Ambiguity', desc: 'Undefined problem space, shifting scope or nascent charter' },
  { id: 'ctx-resources', label: 'Limited Resources', desc: 'Operating with lean squad, no dedicated data analyst or QA' },
  { id: 'ctx-new-domain', label: 'New Domain', desc: 'First-time exposure to complex regulatory or infrastructure space' },
  { id: 'ctx-cross-func', label: 'Cross-Functional Ownership', desc: 'Rallying Design, Sales, Eng, Legal without direct authority' },
  { id: 'ctx-org-complexity', label: 'Organizational Complexity', desc: 'Matrixed dependencies, multi-geography stakeholders' },
  { id: 'ctx-tight-deadline', label: 'Tight Deadline', desc: 'Fixed hard launch date driven by contractual or market factors' },
  { id: 'ctx-high-stakes', label: 'High Business Stakes', desc: 'Directly impacted top-line ARR, mission-critical compliance' },
  { id: 'ctx-tech-complexity', label: 'Technical Complexity', desc: 'Distributed microservices, legacy migrations, vector retrieval' },
  { id: 'ctx-zero-to-one', label: 'New Product / Zero-to-One', desc: 'Greenfield product discovery with no pre-existing customer baseline' },
  { id: 'ctx-transformation', label: 'Transformation / Change Environment', desc: 'Navigating re-org, pivot in company strategy, or cultural reset' }
];

const STAKEHOLDER_DISCIPLINES: ('Engineering' | 'Design' | 'Business' | 'Operations' | 'Leadership' | 'Other')[] = [
  'Engineering',
  'Design',
  'Business',
  'Operations',
  'Leadership',
  'Other'
];

export const AddHumanContextDrawer: React.FC<AddHumanContextDrawerProps> = ({
  isOpen,
  onClose,
  dimension,
  onSaveContext
}) => {
  if (!isOpen || !dimension) return null;

  // Local state for self-signal
  const [selfScore, setSelfScore] = useState<number | null>(
    dimension.selfAssessmentScore || dimension.score || 4
  );

  // Local state for selected context chips
  const [selectedChips, setSelectedChips] = useState<string[]>(
    dimension.contextChips || ['ctx-cross-func', 'ctx-high-stakes']
  );

  // Local state for additional context text
  const [additionalContext, setAdditionalContext] = useState<string>(
    dimension.additionalContext || ''
  );

  // Local state for feedback items
  const [signalsList, setSignalsList] = useState<HumanSignalFeedback[]>(
    dimension.humanSignalsList && dimension.humanSignalsList.length > 0
      ? [...dimension.humanSignalsList]
      : [
          {
            id: 'sig-1',
            stakeholderDiscipline: 'Engineering',
            stakeholderRole: 'Staff Platform Engineer',
            demonstratedCapabilityNote: 'Strong at resolving Product × Engineering trade-offs and anticipating latency issues early in discovery.',
            date: '2 weeks ago'
          },
          {
            id: 'sig-2',
            stakeholderDiscipline: 'Design',
            stakeholderRole: 'Lead Product Designer',
            demonstratedCapabilityNote: 'Gives high clarity on customer problem definitions; collaborative during Figma prototype explorations.',
            date: 'Last month'
          }
        ]
  );

  // New feedback entry form state
  const [isAddingFeedback, setIsAddingFeedback] = useState(false);
  const [newDiscipline, setNewDiscipline] = useState<'Engineering' | 'Design' | 'Business' | 'Operations' | 'Leadership' | 'Other'>('Engineering');
  const [newRole, setNewRole] = useState('');
  const [newNote, setNewNote] = useState('');

  const toggleChip = (chipId: string) => {
    setSelectedChips(prev => 
      prev.includes(chipId) ? prev.filter(c => c !== chipId) : [...prev, chipId]
    );
  };

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const newFeedback: HumanSignalFeedback = {
      id: `sig-${Date.now()}`,
      stakeholderDiscipline: newDiscipline,
      stakeholderRole: newRole.trim() || `${newDiscipline} Colleague`,
      demonstratedCapabilityNote: newNote.trim(),
      date: 'Just now'
    };

    setSignalsList(prev => [newFeedback, ...prev]);
    setNewRole('');
    setNewNote('');
    setIsAddingFeedback(false);
  };

  const handleSaveAll = () => {
    onSaveContext(
      dimension.key,
      selfScore,
      signalsList,
      selectedChips,
      additionalContext
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/80 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                Human &amp; Context Signal
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">30% Default Weight</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              {dimension.label}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add qualitative peer observations, situational complexity, and self-assessment to ground the AI synthesis.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* 1. SELF SIGNAL */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Self Signal (Optional Assessment)
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-medium">Reflection score</span>
            </div>
            <p className="text-xs text-slate-500">
              Where do you honestly assess your demonstrated capability on this factor?
            </p>

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[
                { val: 1, label: '1 - Foundational' },
                { val: 2, label: '2 - Working' },
                { val: 3, label: '3 - Advanced' },
                { val: 4, label: '4 - Senior' },
                { val: 5, label: '5 - Strategic' }
              ].map(opt => {
                const isSelected = selfScore === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setSelfScore(opt.val)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="block text-sm">{opt.val}</span>
                    <span className="text-[9px] font-normal block truncate mt-0.5 opacity-90">
                      {opt.label.split(' - ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. CROSS-FUNCTIONAL SIGNALS */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Cross-Functional Signals
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-medium">{signalsList.length} inputs</span>
            </div>
            <p className="text-xs text-slate-500">
              Lightweight qualitative observations from Engineering, Design, Business, or Operations stakeholders. Not a lengthy formal review.
            </p>

            {/* List of existing signals */}
            <div className="space-y-2.5">
              {signalsList.map((sig) => (
                <div 
                  key={sig.id} 
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 font-mono text-[10px]">
                        {sig.stakeholderDiscipline}
                      </span>
                      <span>{sig.stakeholderRole}</span>
                    </div>
                    <span className="text-slate-400 text-[10px]">{sig.date}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed italic">
                    &ldquo;{sig.demonstratedCapabilityNote}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {/* Add new peer signal */}
            {!isAddingFeedback ? (
              <button
                type="button"
                onClick={() => setIsAddingFeedback(true)}
                className="w-full py-2 px-3 border border-dashed border-slate-300 hover:border-blue-400 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Qualitative Stakeholder Input</span>
              </button>
            ) : (
              <form onSubmit={handleAddFeedback} className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">
                    What capability did this person demonstrate?
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingFeedback(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Discipline
                    </label>
                    <select
                      value={newDiscipline}
                      onChange={(e) => setNewDiscipline(e.target.value as any)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-slate-800 text-xs font-medium focus:outline-hidden focus:border-blue-500"
                    >
                      {STAKEHOLDER_DISCIPLINES.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Stakeholder Role
                    </label>
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="e.g. Senior Tech Lead, Head of Design"
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-slate-800 text-xs placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Demonstrated Capability Observation
                  </label>
                  <textarea
                    rows={2}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g. Strong at resolving Product × Engineering trade-offs without compromising data integrity."
                    className="w-full p-2 bg-white rounded-lg border border-slate-200 text-slate-800 text-xs placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save Observation
                </button>
              </form>
            )}
          </div>

          {/* 3. CONTEXTUAL FACTORS CHIPS */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Situational Context Factors
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-medium">{selectedChips.length} selected</span>
            </div>
            <p className="text-xs text-slate-500">
              The same outcome achieved under heavy constraints represents higher capability. Select the reality you worked within:
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {CONTEXT_OPTIONS.map((opt) => {
                const isSelected = selectedChips.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleChip(opt.id)}
                    title={opt.desc}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs ring-1 ring-emerald-500/20'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-emerald-600" />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. ADDITIONAL CONTEXT (FREE TEXT) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              Additional Contextual Narrative
            </label>
            <p className="text-xs text-slate-500">
              Provide any unique nuances (e.g. unannounced company restructuring, legacy codebase hurdles, executive stakeholder shifts).
            </p>
            <textarea
              rows={3}
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="e.g. Orchestrated this initiative during a major organizational realignment while bootstrapping an offshore engineering squad."
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>AI will dynamically re-synthesize this capability with updated weights.</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save &amp; Recalibrate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
