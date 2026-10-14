import React, { useState } from 'react';
import { X, Check, Sparkles, Layers, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { 
  StructuredAnswerBlueprint, 
  BlueprintFramework, 
  CandidateStory, 
  StructuredAnswerComponents 
} from '../../features/knowledge/types';
import { QUESTIONS_DATA } from '../../data/questionsData';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blueprint: StructuredAnswerBlueprint) => void;
  stories: CandidateStory[];
  initialBlueprint?: StructuredAnswerBlueprint | null;
  preselectedStory?: CandidateStory | null;
}

const FRAMEWORKS: BlueprintFramework[] = [
  'STAR',
  'CAR',
  'Problem → Decision → Impact',
  'Custom'
];

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  isOpen,
  onClose,
  onSave,
  stories,
  initialBlueprint,
  preselectedStory
}) => {
  const isEditing = !!initialBlueprint;

  const defaultStory = preselectedStory || (initialBlueprint ? stories.find(s => s.id === initialBlueprint.storyId) : stories[0]);
  const defaultQuestion = initialBlueprint 
    ? QUESTIONS_DATA.find(q => q.id === initialBlueprint.questionId) || QUESTIONS_DATA[0]
    : (defaultStory?.linkedQuestionIds?.[0] ? QUESTIONS_DATA.find(q => q.id === defaultStory.linkedQuestionIds[0]) : QUESTIONS_DATA[0]);

  const [framework, setFramework] = useState<BlueprintFramework>(initialBlueprint?.framework || 'STAR');
  const [title, setTitle] = useState(initialBlueprint?.title || '');
  const [selectedQuestionId, setSelectedQuestionId] = useState(initialBlueprint?.questionId || defaultQuestion?.id || 'q-star-disagreement');
  const [customQuestionText, setCustomQuestionText] = useState(initialBlueprint?.questionText || defaultQuestion?.question || '');
  const [selectedStoryId, setSelectedStoryId] = useState(initialBlueprint?.storyId || defaultStory?.id || stories[0]?.id || '');
  const [targetDuration, setTargetDuration] = useState(initialBlueprint?.targetDurationSeconds || 150);

  // Framework-specific state
  const [openingHook, setOpeningHook] = useState(initialBlueprint?.components.openingHook || '');
  
  // STAR
  const [situation, setSituation] = useState(initialBlueprint?.components.situation || defaultStory?.context || '');
  const [task, setTask] = useState(initialBlueprint?.components.task || defaultStory?.myRole || '');
  const [actionText, setActionText] = useState(initialBlueprint?.components.action?.join('\n') || defaultStory?.actions || '');
  const [resultText, setResultText] = useState(initialBlueprint?.components.result?.join('\n') || defaultStory?.outcome || '');

  // CAR
  const [carContext, setCarContext] = useState(initialBlueprint?.components.context || defaultStory?.context || '');

  // Problem → Decision → Impact
  const [problem, setProblem] = useState(initialBlueprint?.components.problem || defaultStory?.context || '');
  const [decision, setDecision] = useState(initialBlueprint?.components.decision || defaultStory?.decision || '');
  const [tradeoffsText, setTradeoffsText] = useState(initialBlueprint?.components.tradeoffs?.join('\n') || defaultStory?.tradeoffs || '');
  const [impactText, setImpactText] = useState(initialBlueprint?.components.impact?.join('\n') || defaultStory?.outcome || '');

  // Custom sections
  const [customSec1Label, setCustomSec1Label] = useState(initialBlueprint?.components.customSections?.[0]?.label || '1. Situation & Problem Framing');
  const [customSec1Content, setCustomSec1Content] = useState(initialBlueprint?.components.customSections?.[0]?.content || '');
  const [customSec2Label, setCustomSec2Label] = useState(initialBlueprint?.components.customSections?.[1]?.label || '2. Strategic Decision & Alignment');
  const [customSec2Content, setCustomSec2Content] = useState(initialBlueprint?.components.customSections?.[1]?.content || '');
  const [customSec3Label, setCustomSec3Label] = useState(initialBlueprint?.components.customSections?.[2]?.label || '3. Execution & Quantifiable Impact');
  const [customSec3Content, setCustomSec3Content] = useState(initialBlueprint?.components.customSections?.[2]?.content || '');

  // Rapid cues
  const [keyCuesText, setKeyCuesText] = useState(initialBlueprint?.components.keyCues?.join('\n') || '');
  const [avoidCuesText, setAvoidCuesText] = useState(initialBlueprint?.components.avoidCues?.join('\n') || '');
  const [metricsText, setMetricsText] = useState(initialBlueprint?.metrics?.join('\n') || defaultStory?.metrics?.join('\n') || '');

  if (!isOpen) return null;

  const handleStoryChange = (storyId: string) => {
    setSelectedStoryId(storyId);
    const chosen = stories.find(s => s.id === storyId);
    if (chosen) {
      if (!title) {
        setTitle(`${framework} Blueprint: ${chosen.title}`);
      }
      if (!situation) setSituation(chosen.context);
      if (!task) setTask(chosen.myRole);
      if (!actionText) setActionText(chosen.actions);
      if (!resultText) setResultText(chosen.outcome);
      if (!problem) setProblem(chosen.context);
      if (!decision) setDecision(chosen.decision);
      if (!metricsText) setMetricsText(chosen.metrics.join('\n'));
      if (chosen.linkedQuestionIds.length > 0 && !initialBlueprint) {
        setSelectedQuestionId(chosen.linkedQuestionIds[0]);
        const qObj = QUESTIONS_DATA.find(q => q.id === chosen.linkedQuestionIds[0]);
        if (qObj) setCustomQuestionText(qObj.question);
      }
    }
  };

  const handleQuestionChange = (qId: string) => {
    setSelectedQuestionId(qId);
    const qObj = QUESTIONS_DATA.find(q => q.id === qId);
    if (qObj) {
      setCustomQuestionText(qObj.question);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const chosenStory = stories.find(s => s.id === selectedStoryId);
    const resolvedTitle = title.trim() || `${framework} Blueprint: ${chosenStory?.title || 'Answer'}`;

    const actions = actionText.split('\n').map(s => s.trim()).filter(Boolean);
    const results = resultText.split('\n').map(s => s.trim()).filter(Boolean);
    const tradeoffs = tradeoffsText.split('\n').map(s => s.trim()).filter(Boolean);
    const impacts = impactText.split('\n').map(s => s.trim()).filter(Boolean);
    const keyCues = keyCuesText.split('\n').map(s => s.trim()).filter(Boolean);
    const avoidCues = avoidCuesText.split('\n').map(s => s.trim()).filter(Boolean);
    const metrics = metricsText.split('\n').map(s => s.trim()).filter(Boolean);

    const components: StructuredAnswerComponents = {
      openingHook: openingHook.trim(),
      keyCues: keyCues.length > 0 ? keyCues : undefined,
      avoidCues: avoidCues.length > 0 ? avoidCues : undefined
    };

    if (framework === 'STAR') {
      components.situation = situation.trim();
      components.task = task.trim();
      components.action = actions;
      components.result = results;
    } else if (framework === 'CAR') {
      components.context = carContext.trim() || situation.trim();
      components.action = actions;
      components.result = results;
    } else if (framework === 'Problem → Decision → Impact') {
      components.problem = problem.trim();
      components.decision = decision.trim();
      components.tradeoffs = tradeoffs;
      components.impact = impacts;
    } else if (framework === 'Custom') {
      components.customSections = [
        { label: customSec1Label, content: customSec1Content.trim() },
        { label: customSec2Label, content: customSec2Content.trim() },
        { label: customSec3Label, content: customSec3Content.trim() }
      ].filter(sec => sec.content.length > 0);
    }

    const blueprintToSave: StructuredAnswerBlueprint = {
      id: initialBlueprint?.id || `bp-${Date.now()}`,
      title: resolvedTitle,
      questionId: selectedQuestionId,
      questionText: customQuestionText.trim() || 'Custom Question Prompt',
      storyId: selectedStoryId,
      storyTitle: chosenStory?.title || 'Personal Story',
      framework,
      components,
      metrics,
      targetDurationSeconds: Number(targetDuration),
      createdAt: initialBlueprint?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(blueprintToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Answer Blueprint Builder
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Structured Interview Scripting
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {isEditing ? 'Edit Answer Blueprint' : 'Create Structured Answer Blueprint'}
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
          
          {/* Framework Selector Tabs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Answer Framework
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FRAMEWORKS.map(fw => {
                const isSelected = framework === fw;
                return (
                  <button
                    key={fw}
                    type="button"
                    onClick={() => setFramework(fw)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {fw}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blueprint Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Blueprint Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={`e.g. ${framework} Blueprint: Tech Lead Disagreement`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 font-bold"
            />
          </div>

          {/* Story & Question Association */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            {/* Story Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Base Story (from Story Bank)
              </label>
              <select
                value={selectedStoryId}
                onChange={e => handleStoryChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white font-medium cursor-pointer"
              >
                {stories.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            {/* Target Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Target Speaking Time
              </label>
              <select
                value={targetDuration}
                onChange={e => setTargetDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white font-medium cursor-pointer"
              >
                <option value={90}>1:30 min (Elevator/Concise)</option>
                <option value={120}>2:00 min (Standard Response)</option>
                <option value={150}>2:30 min (Deep Dive)</option>
                <option value={180}>3:00 min (Staff/Principal Level)</option>
              </select>
            </div>

            {/* Question Selector */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Target Interview Question
              </label>
              <select
                value={selectedQuestionId}
                onChange={e => handleQuestionChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white font-medium cursor-pointer"
              >
                {QUESTIONS_DATA.map(q => (
                  <option key={q.id} value={q.id}>
                    [{q.roleCategory.split(' ')[0]}] {q.question.slice(0, 90)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Opening Hook */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Opening Hook (First 15 seconds)
              </label>
              <span className="text-[11px] text-blue-600 font-semibold">Frame your core philosophy</span>
            </div>
            <textarea
              rows={2}
              value={openingHook}
              onChange={e => setOpeningHook(e.target.value)}
              placeholder="e.g. I believe technical disagreements are healthy when grounded in objective benchmarks rather than dogma or seniority."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* DYNAMIC FRAMEWORK INPUTS */}
          {framework === 'STAR' && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">STAR Components</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">Situation (S)</label>
                  <textarea
                    rows={3}
                    value={situation}
                    onChange={e => setSituation(e.target.value)}
                    placeholder="Where, when, what was broken or at stake?"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">Task (T)</label>
                  <textarea
                    rows={3}
                    value={task}
                    onChange={e => setTask(e.target.value)}
                    placeholder="What was YOUR specific responsibility?"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">Actions Taken (A) - Bullet per line</label>
                  <textarea
                    rows={4}
                    value={actionText}
                    onChange={e => setActionText(e.target.value)}
                    placeholder="1. Organized private 1-on-1&#10;2. Authored empirical benchmark&#10;3. Built collaborative RFC"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">Results & Numbers (R) - Bullet per line</label>
                  <textarea
                    rows={4}
                    value={resultText}
                    onChange={e => setResultText(e.target.value)}
                    placeholder="14ms p99 latency achieved&#10;Saved $4k/mo in licenses&#10;0 alerts on Black Friday"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {framework === 'CAR' && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">CAR Components</h4>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">Context (C)</label>
                <textarea
                  rows={3}
                  value={carContext}
                  onChange={e => setCarContext(e.target.value)}
                  placeholder="Context and stakes behind the problem"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">Action (A) - Bullet per line</label>
                  <textarea
                    rows={4}
                    value={actionText}
                    onChange={e => setActionText(e.target.value)}
                    placeholder="Key strategic actions"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">Result (R) - Bullet per line</label>
                  <textarea
                    rows={4}
                    value={resultText}
                    onChange={e => setResultText(e.target.value)}
                    placeholder="Measurable outcomes and deliverables"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {framework === 'Problem → Decision → Impact' && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Problem → Decision → Impact</h4>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">1. Problem</label>
                <textarea
                  rows={2}
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                  placeholder="Executive deadlock, missing telemetry, or scaling bottleneck"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">2. Decision & Architecture</label>
                  <textarea
                    rows={3}
                    value={decision}
                    onChange={e => setDecision(e.target.value)}
                    placeholder="Type 1 vs Type 2 door framework, painted-door experiment, etc."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">Trade-offs Weighed (One per line)</label>
                  <textarea
                    rows={3}
                    value={tradeoffsText}
                    onChange={e => setTradeoffsText(e.target.value)}
                    placeholder="Short term confusion vs 8 weeks engineering saved"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">3. Impact & Metrics (One per line)</label>
                <textarea
                  rows={3}
                  value={impactText}
                  onChange={e => setImpactText(e.target.value)}
                  placeholder="+18% conversion lift&#10;48h patch turnaround"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono text-xs"
                />
              </div>
            </div>
          )}

          {framework === 'Custom' && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Custom Structured Sections</h4>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={customSec1Label}
                    onChange={e => setCustomSec1Label(e.target.value)}
                    className="w-full font-bold text-xs text-slate-800 bg-white px-2 py-1 rounded border border-slate-300"
                  />
                  <textarea
                    rows={2}
                    value={customSec1Content}
                    onChange={e => setCustomSec1Content(e.target.value)}
                    placeholder="Content for section 1..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={customSec2Label}
                    onChange={e => setCustomSec2Label(e.target.value)}
                    className="w-full font-bold text-xs text-slate-800 bg-white px-2 py-1 rounded border border-slate-300"
                  />
                  <textarea
                    rows={2}
                    value={customSec2Content}
                    onChange={e => setCustomSec2Content(e.target.value)}
                    placeholder="Content for section 2..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={customSec3Label}
                    onChange={e => setCustomSec3Label(e.target.value)}
                    className="w-full font-bold text-xs text-slate-800 bg-white px-2 py-1 rounded border border-slate-300"
                  />
                  <textarea
                    rows={2}
                    value={customSec3Content}
                    onChange={e => setCustomSec3Content(e.target.value)}
                    placeholder="Content for section 3..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rapid Recall Cues (Glanceable during live interview) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Key Rapid Cues (3-4 bullet reminders)
              </label>
              <textarea
                rows={3}
                value={keyCuesText}
                onChange={e => setKeyCuesText(e.target.value)}
                placeholder="• Private 1-on-1 alignment&#10;• 2-day empirical benchmark&#10;• 14ms p99 latency & $4k/mo savings"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Avoid Cues (What NOT to say)
              </label>
              <textarea
                rows={3}
                value={avoidCuesText}
                onChange={e => setAvoidCuesText(e.target.value)}
                placeholder="• Do not frame tech lead as obstinate&#10;• Avoid theory without benchmark numbers"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-900 text-xs"
              />
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
            >
              {isEditing ? 'Save Blueprint' : 'Create Blueprint'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
