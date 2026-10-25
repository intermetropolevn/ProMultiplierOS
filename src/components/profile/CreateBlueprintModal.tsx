import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, BookOpen, Layers, Target, Plus, Trash2, Lock } from 'lucide-react';
import { BlueprintFramework, StructuredAnswerBlueprint } from '../../features/knowledge/types';
import { KnowledgeStorageService } from '../../features/knowledge/services/knowledgeStorageService';
import { ActivityService } from '../../services/activityService';
import { BlueprintRichTextEditor } from '../common/BlueprintRichTextEditor';
import { AccessCreationBanner } from '../access/AccessCreationBanner';
import { ProgressiveCreationSection } from '../access/ProgressiveCreationSection';
import { DemoQuotaGate } from '../access/DemoQuotaGate';
import { useAccessControl } from '../../services/accessControlService';

interface CreateBlueprintModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onCreated: (blueprint: StructuredAnswerBlueprint) => void;
  initialBlueprint?: StructuredAnswerBlueprint | null;
  defaultRole?: string;
  defaultDomain?: string;
}

export const CreateBlueprintModal: React.FC<CreateBlueprintModalProps> = ({
  isOpen = true,
  onClose,
  onCreated,
  initialBlueprint,
  defaultRole = 'Software Engineering',
  defaultDomain = 'Fintech & Payments',
}) => {
  const isEditing = Boolean(initialBlueprint);
  const { capabilities, canCreate, openContextualPrompt } = useAccessControl();
  const isSubmittingRef = useRef(false);

  if (!isOpen) return null;

  // Core metadata (Basic Fields: Question, Role, Category, Difficulty)
  const [title, setTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('System Architecture & Tradeoffs');
  const [difficulty, setDifficulty] = useState('Senior');
  // 1A: Default Structure Framework is Custom Structure ('Custom')
  const [framework, setFramework] = useState<BlueprintFramework>('Custom');
  const [targetRole, setTargetRole] = useState(defaultRole);
  const [targetCompany, setTargetCompany] = useState('');
  const [targetJob, setTargetJob] = useState('');
  
  // Custom Structure fields
  const [context, setContext] = useState('');
  const [solutionAndImpact, setSolutionAndImpact] = useState('');

  // STAR fields
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [actions, setActions] = useState<string[]>(['']);
  const [results, setResults] = useState<string[]>(['']);

  // Problem → Decision → Impact fields
  const [problem, setProblem] = useState('');
  const [decision, setDecision] = useState('');
  const [impact, setImpact] = useState<string[]>(['']);

  // Shared metrics (STAR, CAR, PDI)
  const [metrics, setMetrics] = useState<string[]>(['']);
  const [targetDurationSeconds, setTargetDurationSeconds] = useState(150);

  // Populate/reset on open or initialBlueprint change
  useEffect(() => {
    if (!isOpen) return;
    isSubmittingRef.current = false;

    if (initialBlueprint && capabilities.canViewIntelligence) {
      setTitle(initialBlueprint.title || '');
      setQuestionText(initialBlueprint.questionText || '');
      setFramework(initialBlueprint.framework || 'Custom');
      setTargetRole(initialBlueprint.targetRole || defaultRole);
      setTargetJob(initialBlueprint.targetJob || '');
      setTargetCompany(initialBlueprint.targetCompany || '');
      setTargetDurationSeconds(initialBlueprint.targetDurationSeconds || 150);

      const comp = initialBlueprint.components || {};
      setContext(comp.context || comp.situation || '');
      setSolutionAndImpact(comp.solutionAndImpact || (comp.action && comp.result ? `${comp.action.join('. ')}. Result: ${comp.result.join('. ')}` : ''));
      setSituation(comp.situation || comp.context || '');
      setTask(comp.task || '');
      setActions(comp.action && comp.action.length > 0 ? comp.action : ['']);
      setResults(comp.result && comp.result.length > 0 ? comp.result : ['']);
      setProblem(comp.problem || comp.situation || '');
      setDecision(comp.decision || comp.task || '');
      setImpact(comp.impact && comp.impact.length > 0 ? comp.impact : comp.result || ['']);
      setMetrics(initialBlueprint.metrics && initialBlueprint.metrics.length > 0 ? initialBlueprint.metrics : ['']);
    } else {
      // Clean reset for new creation
      setTitle('');
      setQuestionText('');
      setCategory('System Architecture & Tradeoffs');
      setDifficulty('Senior');
      setFramework('Custom'); // Default: Custom Structure
      setTargetRole(defaultRole);
      setTargetJob('');
      setTargetCompany('');
      setTargetDurationSeconds(150);
      setContext('');
      setSolutionAndImpact('');
      setSituation('');
      setTask('');
      setActions(['']);
      setResults(['']);
      setProblem('');
      setDecision('');
      setImpact(['']);
      setMetrics(['']);
    }
  }, [isOpen, initialBlueprint, defaultRole, capabilities.canViewIntelligence]);

  if (!isOpen) return null;

  const handleAddAction = () => setActions(prev => [...prev, '']);
  const handleRemoveAction = (idx: number) => setActions(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : ['']);

  const handleAddResult = () => setResults(prev => [...prev, '']);
  const handleRemoveResult = (idx: number) => setResults(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : ['']);

  const handleAddImpact = () => setImpact(prev => [...prev, '']);
  const handleRemoveImpact = (idx: number) => setImpact(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : ['']);

  const handleAddMetric = () => setMetrics(prev => [...prev, '']);
  const handleRemoveMetric = (idx: number) => setMetrics(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : ['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (!capabilities.canCreate) {
      openContextualPrompt();
      return;
    }
    if (!isEditing && !canCreate('blueprints')) {
      return;
    }
    const resolvedTitle = title.trim() || questionText.trim().slice(0, 60) || 'Q&A Blueprint';
    if (!questionText.trim()) return;
    isSubmittingRef.current = true;

    const filteredActions = actions.map(a => a.trim()).filter(Boolean);
    const filteredResults = results.map(r => r.trim()).filter(Boolean);
    const filteredImpact = impact.map(i => i.trim()).filter(Boolean);
    const filteredMetrics = metrics.map(m => m.trim()).filter(Boolean);

    let componentsPayload: StructuredAnswerBlueprint['components'] = {};

    if (framework === 'Custom') {
      componentsPayload = {
        context: context.trim() || undefined,
        solutionAndImpact: solutionAndImpact.trim()
      };
    } else if (framework === 'STAR') {
      componentsPayload = {
        situation: situation.trim(),
        task: task.trim(),
        action: filteredActions,
        result: filteredResults
      };
    } else if (framework === 'CAR') {
      componentsPayload = {
        context: context.trim(),
        action: filteredActions,
        result: filteredResults
      };
    } else if (framework === 'Problem → Decision → Impact') {
      componentsPayload = {
        problem: problem.trim(),
        decision: decision.trim(),
        impact: filteredImpact
      };
    }

    const now = new Date().toISOString();

    const savedBlueprint: StructuredAnswerBlueprint = {
      id: initialBlueprint?.id || `bp-${Date.now()}`,
      title: resolvedTitle,
      questionId: initialBlueprint?.questionId || `q-custom-${Date.now()}`,
      questionText: questionText.trim(),
      storyId: initialBlueprint?.storyId || `story-custom-${Date.now()}`,
      storyTitle: resolvedTitle,
      framework,
      components: componentsPayload,
      metrics: framework === 'Custom' ? [] : filteredMetrics,
      targetDurationSeconds,
      targetRole: targetRole.trim() || defaultRole,
      roleCategory: targetRole.trim() || defaultRole,
      targetCompany: targetCompany.trim() || undefined,
      targetJob: targetJob.trim() || undefined,
      assignedRoles: initialBlueprint?.assignedRoles || ['Engineering Lead', 'Technical Interviewer'],
      createdAt: initialBlueprint?.createdAt || now,
      updatedAt: now,
    };

    KnowledgeStorageService.addOrUpdateBlueprint(savedBlueprint);

    // Log recent activity
    ActivityService.logActivity({
      category: 'blueprint',
      title: isEditing ? `Updated Q&A Blueprint: ${savedBlueprint.title}` : `Created Q&A Blueprint: ${savedBlueprint.title}`,
      description: `Structured response using ${savedBlueprint.framework} framework for: "${savedBlueprint.questionText.slice(0, 75)}..."`,
      source: 'Blueprint',
      badgeText: savedBlueprint.framework,
      badgeVariant: 'purple',
      metadata: { blueprintId: savedBlueprint.id },
    });

    onCreated(savedBlueprint);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Question & Answer Blueprint' : 'Create Question & Answer Blueprint'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing 
                  ? 'Update your blueprint details, framework, and answer architecture. Changes sync across all assigned roles.' 
                  : 'Define both the target interview prompt and your structured, battle-tested answer.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <DemoQuotaGate workflowKey="blueprints" isEditing={isEditing} onViewExistingItems={onClose}>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          <AccessCreationBanner workflowKey="blueprints" workflowLabel="Q&A Blueprints" />

          {/* BASIC SECTION: Question, Role, Category, Difficulty */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Basic Q&amp;A Blueprint Fields
              </span>
              <span className="text-[11px] text-slate-400">
                Question · Role · Category · Difficulty
              </span>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Question *</label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Tell me about a time you had to balance aggressive product feature deadlines against technical debt. How did you negotiate and execute the technical payoff?"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-900 font-vietnamese font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineering"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium cursor-pointer"
                >
                  <option value="System Architecture & Tradeoffs">System Architecture &amp; Tradeoffs</option>
                  <option value="Technical Leadership & Alignment">Technical Leadership &amp; Alignment</option>
                  <option value="Execution & Incident Recovery">Execution &amp; Incident Recovery</option>
                  <option value="Product Strategy & Prioritization">Product Strategy &amp; Prioritization</option>
                  <option value="Cross-Functional Collaboration">Cross-Functional Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Difficulty *</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium cursor-pointer"
                >
                  <option value="Foundational">Foundational</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Senior">Senior</option>
                  <option value="Staff / Principal">Staff / Principal</option>
                </select>
              </div>
            </div>
          </div>

          {/* ADVANCED SECTION: Capability Mapping, Evaluation Rubric, Evidence Criteria, Interview Intelligence */}
          <ProgressiveCreationSection workflowKey="blueprints">
            {/* Blueprint Title & Framework */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Blueprint Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cost of Delay Tech Debt Negotiation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Evaluation Rubric Framework</label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value as BlueprintFramework)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-900 font-semibold cursor-pointer"
                >
                  <option value="Custom">Custom Structure</option>
                  <option value="STAR">STAR (Situation, Task, Action, Result)</option>
                  <option value="CAR">CAR (Context, Action, Result)</option>
                  <option value="Problem → Decision → Impact">Problem → Decision → Impact</option>
                </select>
              </div>
            </div>

            {/* Capability & Job Taxonomy Mappings */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Target className="w-3.5 h-3.5 text-purple-600" />
                <span>Capability Mapping &amp; Target Job Calibration</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Target Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Staff Backend Architect"
                    value={targetJob}
                    onChange={(e) => setTargetJob(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Target Company (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Ramp"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Structured Answer Architecture Section */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> Answer Architecture ({framework})
                </h4>
                <span className="text-[11px] text-slate-400">
                  {framework === 'Custom' ? 'Simplified two-tier architecture' : 'Structured behavioral framework'}
                </span>
              </div>

            {/* 1B: CUSTOM STRUCTURE: Context (Optional) + Solution & Impact */}
            {framework === 'Custom' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">Context (Optional)</label>
                    <span className="text-[11px] text-slate-400">Optional background or situation</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Explain the background, stakes, or situational context if relevant (e.g. Frequent billing regressions were eating 140 hours a quarter...)"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <BlueprintRichTextEditor
                  value={solutionAndImpact}
                  onChange={setSolutionAndImpact}
                  required
                  placeholder="Describe what you did, your specific technical decisions/actions, and the tangible results or impact (e.g. ## Approach\n- Framed tech debt as business Cost of Delay\n- Modularized billing engine, cutting defect rates by 45%)."
                />
              </div>
            )}

            {/* 1C: STAR FRAMEWORK (No Opening Hook) */}
            {framework === 'STAR' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Situation *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Context, scale, and stakes..."
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Task *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Specific mandate or personal responsibility..."
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">Actions Taken</label>
                    <button type="button" onClick={handleAddAction} className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> Add Action
                    </button>
                  </div>
                  {actions.map((act, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 mb-1.5">
                      <input
                        type="text"
                        placeholder={`Action step ${idx + 1}...`}
                        value={act}
                        onChange={(e) => {
                          const updated = [...actions];
                          updated[idx] = e.target.value;
                          setActions(updated);
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                      {actions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAction(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">Results &amp; Outcomes</label>
                    <button type="button" onClick={handleAddResult} className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> Add Result
                    </button>
                  </div>
                  {results.map((res, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 mb-1.5">
                      <input
                        type="text"
                        placeholder={`Outcome result ${idx + 1}...`}
                        value={res}
                        onChange={(e) => {
                          const updated = [...results];
                          updated[idx] = e.target.value;
                          setResults(updated);
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                      {results.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveResult(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1C: CAR FRAMEWORK: Context, Action, Result (No Opening Hook) */}
            {framework === 'CAR' && (
              <div className="space-y-3 animate-in fade-in">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Context *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Describe context, constraints, and business environment..."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">Actions Taken</label>
                    <button type="button" onClick={handleAddAction} className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> Add Action
                    </button>
                  </div>
                  {actions.map((act, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 mb-1.5">
                      <input
                        type="text"
                        placeholder={`Action step ${idx + 1}...`}
                        value={act}
                        onChange={(e) => {
                          const updated = [...actions];
                          updated[idx] = e.target.value;
                          setActions(updated);
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                      {actions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAction(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">Results &amp; Outcomes</label>
                    <button type="button" onClick={handleAddResult} className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> Add Result
                    </button>
                  </div>
                  {results.map((res, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 mb-1.5">
                      <input
                        type="text"
                        placeholder={`Outcome result ${idx + 1}...`}
                        value={res}
                        onChange={(e) => {
                          const updated = [...results];
                          updated[idx] = e.target.value;
                          setResults(updated);
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                      {results.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveResult(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1C: PROBLEM → DECISION → IMPACT (No Opening Hook) */}
            {framework === 'Problem → Decision → Impact' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Problem *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Root cause dilemma or deadlock..."
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Decision *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Tradeoff, hypothesis, & path chosen..."
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">Impact</label>
                    <button type="button" onClick={handleAddImpact} className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> Add Impact
                    </button>
                  </div>
                  {impact.map((imp, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 mb-1.5">
                      <input
                        type="text"
                        placeholder={`Measurable impact ${idx + 1}...`}
                        value={imp}
                        onChange={(e) => {
                          const updated = [...impact];
                          updated[idx] = e.target.value;
                          setImpact(updated);
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                      {impact.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImpact(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics & Proof (shown for STAR, CAR, PDI — NOT for Custom Structure) */}
            {framework !== 'Custom' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold">Measurable Proof Points &amp; Metrics</label>
                  <button type="button" onClick={handleAddMetric} className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3 h-3" /> Add Metric
                  </button>
                </div>
                {metrics.map((met, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 mb-1.5">
                    <input
                      type="text"
                      placeholder="e.g. 14ms p99 latency, 0 downtime, $35k/mo license saved..."
                      value={met}
                      onChange={(e) => {
                        const updated = [...metrics];
                        updated[idx] = e.target.value;
                        setMetrics(updated);
                      }}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                    />
                    {metrics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMetric(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
          </ProgressiveCreationSection>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {!capabilities.canCreate ? (
              <button
                type="button"
                onClick={() => openContextualPrompt()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock in Demo</span>
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Update Blueprint in Library' : 'Save Blueprint to Library'}</span>
              </button>
            )}
          </div>
        </form>
        </DemoQuotaGate>

      </div>
    </div>
  );
};
