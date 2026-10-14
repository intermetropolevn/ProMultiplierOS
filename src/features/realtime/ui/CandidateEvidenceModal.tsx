import React, { useState } from 'react';
import { X, Plus, Sparkles, Briefcase, Award, CheckCircle2 } from 'lucide-react';
import { CandidateEvidence, EvidenceType } from '../types';
import { PersonalKnowledgeService } from '../knowledge/PersonalKnowledgeService';

interface CandidateEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvidenceUpdated?: () => void;
}

export const CandidateEvidenceModal: React.FC<CandidateEvidenceModalProps> = ({
  isOpen,
  onClose,
  onEvidenceUpdated,
}) => {
  const [evidenceList, setEvidenceList] = useState<CandidateEvidence[]>(() => PersonalKnowledgeService.getEvidence());
  const [isAdding, setIsAdding] = useState(false);

  // New item form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EvidenceType>('project');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [metrics, setMetrics] = useState('');

  if (!isOpen) return null;

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const metricItems = metrics.split('\n').map(m => m.trim()).filter(Boolean);
    const finalMetrics = metricItems.length > 0 ? metricItems : ['Add a concrete metric if available.'];

    const newEvidence: CandidateEvidence = {
      id: `ev-custom-${Date.now()}`,
      title: title.trim(),
      type,
      description: description.trim(),
      role: 'Software Engineering',
      domains: ['Enterprise SaaS'],
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      metrics: finalMetrics,
      keywords: title.toLowerCase().split(/\s+/).concat(skills.toLowerCase().split(',').map(s => s.trim())),
      source: 'Candidate Personal Knowledge Profile',
      confidence: 0.95,
      relatedQuestions: [],
    };

    const updated = PersonalKnowledgeService.addOrUpdateEvidence(newEvidence);
    setEvidenceList(updated);
    setIsAdding(false);
    setTitle('');
    setDescription('');
    setSkills('');
    setMetrics('');
    onEvidenceUpdated?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Personal Knowledge & Experience Stories
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Your real experience retrieved by Live Intelligence during interview questions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Stored Evidence Items ({evidenceList.length})
            </span>
            {!isAdding && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Career Story</span>
              </button>
            )}
          </div>

          {/* Add New Form */}
          {isAdding && (
            <form onSubmit={handleSaveNew} className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  New Career Story / Project
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Story or Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Core Payment Gateway Idempotency & Latency Optimization"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as EvidenceType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                  >
                    <option value="project">Project</option>
                    <option value="story">Behavioral Story</option>
                    <option value="decision">Technical Decision</option>
                    <option value="incident">Incident Resolution</option>
                    <option value="achievement">Achievement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Key Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Postgres, Redis, Stakeholder Management"
                    value={skills}
                    onChange={e => setSkills(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Description & Context
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe the business scenario and the core technical or product trade-off..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Concrete Production Metrics (1 per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Zero duplicate charges across $45M volume&#10;P99 latency dropped from 420ms to 85ms"
                  value={metrics}
                  onChange={e => setMetrics(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-500 italic mt-0.5 block">
                  *If metrics are missing, system displays: "Add a concrete metric if available."
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save to Profile
                </button>
              </div>
            </form>
          )}

          {/* List of Evidence */}
          <div className="space-y-3">
            {evidenceList.map(ev => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                      {ev.type === 'project' ? <Briefcase className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {ev.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    {ev.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ev.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {ev.skills.map((s, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Verified Production Metrics:
                  </span>
                  {ev.metrics.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
