import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Edit3, 
  Copy, 
  Trash2, 
  Archive, 
  RotateCcw, 
  Calendar, 
  Building2, 
  Briefcase, 
  Layers, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  Play, 
  Send, 
  ExternalLink,
  Save,
  Tag,
  Share2
} from 'lucide-react';
import { CareerProject } from '../../../features/projects/types';
import { ProjectStorageService } from '../../../features/projects/services/projectStorageService';
import { KnowledgeStorageService } from '../../../features/knowledge/services/knowledgeStorageService';
import { CandidateStory, StructuredAnswerBlueprint } from '../../../features/knowledge/types';
import { BlueprintRichTextRenderer } from '../../common/BlueprintRichTextRenderer';
import { GenerateFromProjectModal } from './GenerateFromProjectModal';

interface ProjectDetailViewProps {
  project: CareerProject;
  onBack: () => void;
  onEdit: (project: CareerProject) => void;
  onDuplicate: (project: CareerProject) => void;
  onDelete: (id: string) => void;
  onNavigateToStory?: (storyId: string) => void;
  onNavigateToBlueprint?: (blueprintId: string) => void;
  onStartPracticeQuestion?: (blueprint: StructuredAnswerBlueprint) => void;
}

export type ProjectDetailTab = 'overview' | 'notes' | 'evidence' | 'simulation' | 'generated';

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onEdit,
  onDuplicate,
  onDelete,
  onNavigateToStory,
  onNavigateToBlueprint,
  onStartPracticeQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<ProjectDetailTab>('overview');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateMode, setGenerateMode] = useState<'story' | 'blueprint'>('story');

  // Working Notes state
  const [workingNotes, setWorkingNotes] = useState(project.workingNotes || '');
  const [isNotesSaved, setIsNotesSaved] = useState(false);

  // Evidence Notes state
  const [evidenceNotes, setEvidenceNotes] = useState(project.evidenceNotes || '');
  const [isEvidenceSaved, setIsEvidenceSaved] = useState(false);

  // AI Simulation State
  const simulationQuestions = [
    {
      id: 'sim-1',
      question: `In your project "${project.title}", walk me through the key architectural decision you made and what major alternatives you evaluated.`,
      focus: 'System Architecture & Decision Making'
    },
    {
      id: 'sim-2',
      question: `What was the most painful technical or operational trade-off you had to accept, and how did you mitigate its downside?`,
      focus: 'Trade-off Analysis & Risk Mitigation'
    },
    {
      id: 'sim-3',
      question: `If this system experienced a 10x traffic spike or 100M records tomorrow, where would the primary bottleneck emerge first?`,
      focus: 'Scalability & Production Realism'
    }
  ];

  const [activeSimIndex, setActiveSimIndex] = useState(0);
  const [simAnswer, setSimAnswer] = useState('');
  const [simEvaluation, setSimEvaluation] = useState<{
    score: number;
    strengths: string[];
    gaps: string[];
    followUp: string;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Linked stories & blueprints
  const allStories = KnowledgeStorageService.getStories();
  const linkedStories = allStories.filter(
    s => s.projectId === project.id || project.linkedStoryIds.includes(s.id)
  );

  const allBlueprints = KnowledgeStorageService.getBlueprints();
  const linkedBlueprints = allBlueprints.filter(
    b => project.linkedBlueprintIds.includes(b.id) || b.storyId === project.id || b.title === project.title
  );

  const handleSaveNotes = () => {
    ProjectStorageService.addOrUpdateProject({
      ...project,
      workingNotes: workingNotes
    });
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 2000);
  };

  const handleSaveEvidence = () => {
    ProjectStorageService.addOrUpdateProject({
      ...project,
      evidenceNotes: evidenceNotes
    });
    setIsEvidenceSaved(true);
    setTimeout(() => setIsEvidenceSaved(false), 2000);
  };

  const handleRunSimulation = () => {
    if (!simAnswer.trim()) return;
    setIsSimulating(true);

    // Realistic evaluation heuristic based on answer richness and project metrics
    setTimeout(() => {
      const hasMetricsMention = project.metrics.some(m => simAnswer.toLowerCase().includes(m.slice(0, 10).toLowerCase()));
      const wordCount = simAnswer.trim().split(/\s+/).length;

      let score = 75;
      if (wordCount > 60) score += 10;
      if (hasMetricsMention) score += 10;

      setSimEvaluation({
        score: Math.min(score, 95),
        strengths: [
          'Clear progression from problem context to technical decision.',
          'Acknowledged system constraints and specific technology choices.'
        ],
        gaps: [
          'Could make the quantitative business outcome more prominent in the opening sentence.',
          'State concrete monitoring telemetry or rollback alarms used during verification.'
        ],
        followUp: `How did you align cross-functional stakeholders when making this decision?`
      });
      setIsSimulating(false);
    }, 800);
  };

  const handleSaveSimAsBlueprint = () => {
    const qObj = simulationQuestions[activeSimIndex];
    const newBp = ProjectStorageService.generateBlueprintFromProject(
      project,
      'Custom',
      qObj.question
    );
    // Update blueprint with simulated answer
    KnowledgeStorageService.addOrUpdateBlueprint({
      ...newBp,
      components: {
        ...newBp.components,
        solutionAndImpact: simAnswer || newBp.components.solutionAndImpact
      }
    });
    alert('Answer saved as Q&A Blueprint and linked to this project!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200 bg-white"
            title="Back to All Projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-2xs text-slate-500 font-semibold mb-0.5">
              <span>Projects & Storybanks</span>
              <span>/</span>
              <span>Projects</span>
              <span>/</span>
              <span className="text-slate-900 font-bold truncate max-w-xs">{project.title}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-950 tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onEdit(project)}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Project</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setGenerateMode('story');
              setIsGenerateModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Story / Q&A</span>
          </button>
        </div>
      </div>

      {/* Project Metadata Banner */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-5 space-y-4">
        {project.tagline && (
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            {project.tagline}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1 border-t border-slate-200/60">
          <div>
            <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-0.5">Role</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              {project.role}
            </span>
          </div>

          <div>
            <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-0.5">Company</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {project.company}
            </span>
          </div>

          <div>
            <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-0.5">Timeframe</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {project.timeframe}
            </span>
          </div>

          <div>
            <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-0.5">Domain</span>
            <span className="font-semibold text-blue-700">
              {project.domain}
            </span>
          </div>
        </div>

        {/* Metrics Bar */}
        {project.metrics.length > 0 && (
          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Verified Metrics:
            </span>
            {project.metrics.map((metric, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{metric}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Project Overview ({project.sections.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Working Notes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'evidence'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Evidence / Research</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'simulation'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Simulation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('generated')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'generated'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Generated Stories & Q&As ({linkedStories.length + linkedBlueprints.length})</span>
        </button>
      </div>

      {/* TAB 1: PROJECT OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {project.sections.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No sections added yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Add structured or free-form sections to build out this project case study.
              </p>
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700"
              >
                Add Sections in Editor
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {project.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        {section.title}
                      </h3>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      {section.type}
                    </span>
                  </div>

                  <div className="pt-1">
                    <BlueprintRichTextRenderer content={section.content} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-600">
              Need to add or rearrange case study sections?
            </span>
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
            >
              Open Full Case Study Editor
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: WORKING NOTES */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Working Notes & Scratchpad</h3>
              <p className="text-2xs text-slate-500">
                Keep ongoing technical brainstorms, sprint retrospectives, or interview talking points.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveNotes}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isNotesSaved ? 'Saved!' : 'Save Notes'}</span>
            </button>
          </div>

          <textarea
            rows={14}
            value={workingNotes}
            onChange={e => setWorkingNotes(e.target.value)}
            placeholder="Write notes in markdown, daily sprint logs, architectural ideas, or rough talking points..."
            className="w-full text-xs font-mono text-slate-800 leading-relaxed bg-slate-50/50 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      )}

      {/* TAB 3: EVIDENCE / RESEARCH */}
      {activeTab === 'evidence' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Empirical Evidence & Telemetry Logs</h3>
              <p className="text-2xs text-slate-500">
                Document query profiling outputs, benchmark numbers, Prometheus queries, or user interview quotes.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveEvidence}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEvidenceSaved ? 'Saved!' : 'Save Evidence'}</span>
            </button>
          </div>

          <textarea
            rows={14}
            value={evidenceNotes}
            onChange={e => setEvidenceNotes(e.target.value)}
            placeholder="Document empirical research, load testing benchmarks, A/B test data, or customer quotes..."
            className="w-full text-xs font-mono text-slate-800 leading-relaxed bg-slate-50/50 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      )}

      {/* TAB 4: AI SIMULATION */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="bg-purple-50/80 rounded-2xl border border-purple-200 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                Project Architectural Interview Simulation
              </h3>
            </div>
            <p className="text-xs text-purple-950 leading-relaxed">
              Test how effectively you defend the architectural decisions, trade-offs, and metrics of "{project.title}" under simulated interviewer interrogation.
            </p>
          </div>

          {/* Question Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {simulationQuestions.map((q, idx) => (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setActiveSimIndex(idx);
                  setSimEvaluation(null);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeSimIndex === idx
                    ? 'border-purple-600 bg-purple-50/40 ring-2 ring-purple-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="text-[10px] font-bold uppercase text-purple-700 mb-1">
                  Question {idx + 1} · {q.focus}
                </div>
                <p className="text-xs font-semibold text-slate-900 line-clamp-2">
                  {q.question}
                </p>
              </button>
            ))}
          </div>

          {/* Interactive Simulation Area */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Interviewer Prompt
              </span>
              <p className="text-sm font-bold text-slate-900">
                {simulationQuestions[activeSimIndex].question}
              </p>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Answer (Explain decisions, system dynamics, and business trade-offs)
              </label>
              <textarea
                rows={6}
                value={simAnswer}
                onChange={e => setSimAnswer(e.target.value)}
                placeholder="Structure your answer: context -> core architectural decision -> why alternatives were rejected -> verified impact..."
                className="w-full text-xs font-mono text-slate-800 leading-relaxed bg-white p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xs text-slate-400">
                Evaluates structure, trade-off clarity, and production realism.
              </span>
              <button
                type="button"
                disabled={!simAnswer.trim() || isSimulating}
                onClick={handleRunSimulation}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSimulating ? 'Analyzing Response...' : 'Simulate Evaluation'}</span>
              </button>
            </div>

            {/* Evaluation Results */}
            {simEvaluation && (
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-900">Simulated Interviewer Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-700">{simEvaluation.score}/100</span>
                    <span className="text-2xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold">
                      {simEvaluation.score >= 85 ? 'Strong Hire' : 'Promising'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-900 block">Demonstrated Strengths</span>
                    <ul className="list-disc list-outside pl-4 text-xs text-emerald-800 space-y-1">
                      {simEvaluation.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1.5">
                    <span className="text-xs font-bold text-amber-900 block">Areas for Sharpening</span>
                    <ul className="list-disc list-outside pl-4 text-xs text-amber-800 space-y-1">
                      {simEvaluation.gaps.map((gap, idx) => (
                        <li key={idx}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-[10px] font-bold uppercase text-blue-700 block mb-1">
                    Simulated Follow-up Probe
                  </span>
                  <p className="text-xs font-semibold text-blue-950">
                    "{simEvaluation.followUp}"
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveSimAsBlueprint}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Save Answer as Q&A Blueprint</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: GENERATED STORIES & Q&AS */}
      {activeTab === 'generated' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Connected Interview Assets
              </h3>
              <p className="text-2xs text-slate-500">
                Stories in Storybank and Blueprints in Q&A pool generated from this case study.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setGenerateMode('story');
                  setIsGenerateModalOpen(true);
                }}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-blue-200"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>+ Generate Story</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setGenerateMode('blueprint');
                  setIsGenerateModalOpen(true);
                }}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-purple-200"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>+ Generate Q&A</span>
              </button>
            </div>
          </div>

          {/* Section: Linked Stories in Storybank */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Candidate Stories in Storybank ({linkedStories.length})</span>
            </h4>

            {linkedStories.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                No stories generated yet. Click "+ Generate Story" to convert this case study into a STAR competency story.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {linkedStories.map(story => (
                  <div
                    key={story.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {story.title}
                      </h5>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium shrink-0">
                        {story.evidenceQuality}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {story.synopsis}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-2xs">
                      <span className="text-slate-400">
                        Best for: {story.bestFor.slice(0, 2).join(', ')}
                      </span>
                      {onNavigateToStory && (
                        <button
                          type="button"
                          onClick={() => onNavigateToStory(story.id)}
                          className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>View in Storybank</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Linked Q&A Blueprints */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              <span>Q&A Blueprints ({linkedBlueprints.length})</span>
            </h4>

            {linkedBlueprints.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                No Q&A Blueprints linked yet. Click "+ Generate Q&A" to create a structured interview blueprint.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {linkedBlueprints.map(bp => (
                  <div
                    key={bp.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {bp.questionText}
                      </h5>
                      <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-semibold shrink-0">
                        {bp.framework}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {bp.components.solutionAndImpact || bp.components.openingHook || bp.components.situation}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-2xs">
                      <span className="text-slate-400">
                        ID: {bp.id}
                      </span>
                      <div className="flex items-center gap-2">
                        {onStartPracticeQuestion && (
                          <button
                            type="button"
                            onClick={() => onStartPracticeQuestion(bp)}
                            className="font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3" />
                            <span>Practice</span>
                          </button>
                        )}
                        {onNavigateToBlueprint && (
                          <button
                            type="button"
                            onClick={() => onNavigateToBlueprint(bp.id)}
                            className="font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open in Blueprints</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Modal */}
      {isGenerateModalOpen && (
        <GenerateFromProjectModal
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          project={project}
          defaultMode={generateMode}
          onStoryGenerated={() => {
            setActiveTab('generated');
          }}
          onBlueprintGenerated={() => {
            setActiveTab('generated');
          }}
        />
      )}

    </div>
  );
};
