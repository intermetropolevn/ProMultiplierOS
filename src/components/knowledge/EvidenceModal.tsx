import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Check, Sparkles, AlertCircle, Lock } from 'lucide-react';
import { EvidenceItem, EvidenceCategory } from '../../features/knowledge/types';
import { QUESTIONS_DATA } from '../../data/questionsData';
import { KnowledgeInfoPopover } from './KnowledgeInfoPopover';
import { AccessCreationBanner } from '../access/AccessCreationBanner';
import { ProgressiveCreationSection } from '../access/ProgressiveCreationSection';
import { DemoQuotaGate } from '../access/DemoQuotaGate';
import { useAccessControl } from '../../services/accessControlService';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: EvidenceItem) => void;
  initialItem?: EvidenceItem | null;
}

const CATEGORIES: EvidenceCategory[] = [
  'Experience',
  'Projects',
  'Achievements',
  'Metrics',
  'Leadership',
  'Stakeholder',
  'Failures',
  'Conflicts',
  'Experiments',
  'Customer Insights',
  'Technical Decisions',
  'Product Decisions'
];

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem
}) => {
  const isEditing = !!initialItem;
  const { capabilities, canCreate, openContextualPrompt } = useAccessControl();
  const isSubmittingRef = useRef(false);

  const [title, setTitle] = useState(initialItem?.title || '');
  const [shortSummary, setShortSummary] = useState(initialItem?.shortSummary || '');
  const [category, setCategory] = useState<EvidenceCategory>(initialItem?.category || 'Projects');
  const [projectStatus, setProjectStatus] = useState('Active / Verified');
  const [context, setContext] = useState(initialItem?.context || '');
  const [myRole, setMyRole] = useState(initialItem?.myRole || '');
  const [actions, setActions] = useState(initialItem?.actions || '');
  const [decision, setDecision] = useState(initialItem?.decision || '');
  const [tradeoffs, setTradeoffs] = useState(initialItem?.tradeoffs || '');
  const [outcome, setOutcome] = useState(initialItem?.outcome || '');
  
  // Array / string list inputs
  const [metricsText, setMetricsText] = useState(initialItem?.metrics?.join('\n') || '');
  const [skillsText, setSkillsText] = useState(initialItem?.skills?.join(', ') || '');
  const [domainsText, setDomainsText] = useState(initialItem?.domains?.join(', ') || 'Enterprise SaaS');
  const [rolesText, setRolesText] = useState(initialItem?.roles?.join(', ') || 'Software Engineering');
  const [tagsText, setTagsText] = useState(initialItem?.tags?.join(', ') || '');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(initialItem?.linkedQuestionIds || []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (!capabilities.canCreate) {
      openContextualPrompt();
      return;
    }
    if (!isEditing && !canCreate('projects')) {
      return;
    }
    if (!title.trim()) return;
    isSubmittingRef.current = true;

    const metrics = metricsText
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    const skills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const domains = domainsText
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);

    const roles = rolesText
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const tags = tagsText
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const itemToSave: EvidenceItem = {
      id: initialItem?.id || `ev-${Date.now()}`,
      title: title.trim(),
      shortSummary: shortSummary.trim() || context.slice(0, 140),
      category,
      context: context.trim(),
      myRole: myRole.trim(),
      actions: actions.trim(),
      decision: decision.trim(),
      tradeoffs: tradeoffs.trim(),
      outcome: outcome.trim(),
      metrics: metrics.length > 0 ? metrics : ['Add a concrete metric if available.'],
      skills: skills.length > 0 ? skills : ['Communication', 'Execution'],
      domains,
      roles,
      tags,
      linkedQuestionIds: selectedQuestionIds,
      createdAt: initialItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(itemToSave);
    onClose();
  };

  const toggleQuestion = (qId: string) => {
    setSelectedQuestionIds(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Evidence Record
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Personal Knowledge Base
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {isEditing ? 'Edit Evidence Item' : 'Add New Evidence Item'}
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
        <DemoQuotaGate workflowKey="projects" isEditing={isEditing} onViewExistingItems={onClose}>
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm">
          <AccessCreationBanner workflowKey="projects" workflowLabel="Projects" />

          {/* BASIC SECTION: Project Name, Project Type, Description, Status */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. CRM Migration & Real-Time Sync"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Project Type
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as EvidenceCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white font-medium cursor-pointer"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={projectStatus}
                  onChange={e => setProjectStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white font-medium cursor-pointer"
                >
                  <option value="Active / Verified">Active / Verified</option>
                  <option value="Shipped / Production">Shipped / Production</option>
                  <option value="In Review">In Review</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Description / Short Summary */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={2}
                value={shortSummary}
                onChange={e => setShortSummary(e.target.value)}
                placeholder="High-level summary of the project architecture, scope, and outcome"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* ADVANCED SECTION: Capability Mapping, Evidence Model, Outcome Metrics, Role Alignment, Intelligence Tags */}
          <ProgressiveCreationSection workflowKey="projects">
          {/* Context & My Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Context & Situation
              </label>
              <textarea
                rows={3}
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="What was the business challenge, technical constraint, or organizational deadlock?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  My Role & Ownership
                </label>
                <KnowledgeInfoPopover
                  label="My Role & Ownership"
                  explanation="What did you personally own, influence or decide? Avoid describing only what the team did."
                />
              </div>
              <textarea
                rows={3}
                value={myRole}
                onChange={e => setMyRole(e.target.value)}
                placeholder="Lead Engineer, Growth PM, Tech Lead? What did YOU specifically own?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Actions Taken
              </label>
              <KnowledgeInfoPopover
                label="Actions Taken"
                explanation="What did you actually do? Prefer concrete actions over responsibilities."
              />
            </div>
            <textarea
              rows={3}
              value={actions}
              onChange={e => setActions(e.target.value)}
              placeholder="What concrete steps, design reviews, prototypes, or negotiations did you execute?"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Decision & Trade-offs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Decision Made
                </label>
                <KnowledgeInfoPopover
                  label="Decision Made"
                  explanation="What was the pivotal choice or strategy you adopted?"
                />
              </div>
              <textarea
                rows={2}
                value={decision}
                onChange={e => setDecision(e.target.value)}
                placeholder="What was the pivotal choice or strategy adopted?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Trade-offs Weighed
                </label>
                <KnowledgeInfoPopover
                  label="Trade-offs"
                  explanation="What did you sacrifice or prioritize? Examples: speed vs quality, short-term vs long-term, cost vs reliability."
                />
              </div>
              <textarea
                rows={2}
                value={tradeoffs}
                onChange={e => setTradeoffs(e.target.value)}
                placeholder="What did you sacrifice (e.g. latency vs consistency, short-term vs long-term)?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Outcome & Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Outcome
                </label>
                <KnowledgeInfoPopover
                  label="Outcome"
                  explanation="What changed because of your work?"
                />
              </div>
              <textarea
                rows={3}
                value={outcome}
                onChange={e => setOutcome(e.target.value)}
                placeholder="What was the final business or engineering result?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Metrics (One per line)
                  </label>
                  <KnowledgeInfoPopover
                    label="Metrics"
                    explanation="Add measurable outcomes when possible. Use one concrete proof point per line."
                  />
                </div>
                <span className="text-[11px] text-blue-600 font-medium">Quantitative proof</span>
              </div>
              <textarea
                rows={3}
                value={metricsText}
                onChange={e => setMetricsText(e.target.value)}
                placeholder="12,000,000 records synchronized&#10;0 seconds unplanned downtime&#10;+18% conversion lift"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono text-xs placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Skills, Domains, Roles, Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Skills (comma-separated)
                </label>
                <KnowledgeInfoPopover
                  label="Skills"
                  explanation="Skills demonstrated by this experience."
                />
              </div>
              <input
                type="text"
                value={skillsText}
                onChange={e => setSkillsText(e.target.value)}
                placeholder="Stakeholder Management, PostgreSQL, Kafka, CRM"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Domains (comma-separated)
                </label>
                <KnowledgeInfoPopover
                  label="Domains"
                  explanation="Business or product domains where this experience is relevant."
                />
              </div>
              <input
                type="text"
                value={domainsText}
                onChange={e => setDomainsText(e.target.value)}
                placeholder="Enterprise SaaS, Fintech & Payments"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Roles (comma-separated)
                </label>
                <KnowledgeInfoPopover
                  label="Roles"
                  explanation="Roles for which this experience is useful."
                />
              </div>
              <input
                type="text"
                value={rolesText}
                onChange={e => setRolesText(e.target.value)}
                placeholder="Software Engineering, Product Management"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsText}
                onChange={e => setTagsText(e.target.value)}
                placeholder="migration, database, zero-downtime, kafka"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Linked Questions Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Link to Interview Questions ({selectedQuestionIds.length} selected)
                </label>
                <KnowledgeInfoPopover
                  label="Linked Interview Questions"
                  explanation="Connect this experience to questions it can answer. These links improve retrieval during Live Interview."
                />
              </div>
              <span className="text-xs text-slate-500">
                Enables instant retrieval during practice
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
                        ? 'bg-blue-50 border border-blue-200 text-blue-900 font-medium'
                        : 'bg-white hover:bg-slate-100 border border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
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
          </ProgressiveCreationSection>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            {!capabilities.canCreate ? (
              <button
                type="button"
                onClick={() => openContextualPrompt()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock in Demo</span>
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
              >
                {isEditing ? 'Save Changes' : 'Add to Evidence Library'}
              </button>
            )}
          </div>
        </form>
        </DemoQuotaGate>

      </div>
    </div>
  );
};
