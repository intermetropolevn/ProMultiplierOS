import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Layers, 
  Clock, 
  Play, 
  BookOpen, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Quote, 
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react';
import { 
  StructuredAnswerBlueprint, 
  BlueprintFramework, 
  CandidateStory 
} from '../../features/knowledge/types';
import { KnowledgeInfoPopover } from './KnowledgeInfoPopover';

interface AnswerBlueprintsSectionProps {
  blueprints: StructuredAnswerBlueprint[];
  stories: CandidateStory[];
  onAddBlueprint: () => void;
  onEditBlueprint: (blueprint: StructuredAnswerBlueprint) => void;
  onDeleteBlueprint: (id: string) => void;
  onPracticeBlueprint: (blueprint: StructuredAnswerBlueprint) => void;
  onOpenQuestionDetail?: (questionId: string) => void;
}

const FRAMEWORK_FILTERS: ('All' | BlueprintFramework)[] = [
  'All',
  'STAR',
  'CAR',
  'Problem → Decision → Impact',
  'Custom'
];

export const AnswerBlueprintsSection: React.FC<AnswerBlueprintsSectionProps> = ({
  blueprints,
  stories,
  onAddBlueprint,
  onEditBlueprint,
  onDeleteBlueprint,
  onPracticeBlueprint,
  onOpenQuestionDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<'All' | BlueprintFramework>('All');
  const [expandedBpId, setExpandedBpId] = useState<string | null>(blueprints[0]?.id || null);

  const filteredBlueprints = useMemo(() => {
    return blueprints.filter(bp => {
      if (selectedFramework !== 'All' && bp.framework !== selectedFramework) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = bp.title.toLowerCase().includes(q);
      const matchQuestion = bp.questionText.toLowerCase().includes(q);
      const matchStory = bp.storyTitle.toLowerCase().includes(q);
      const matchHook = bp.components.openingHook?.toLowerCase().includes(q) || false;

      return matchTitle || matchQuestion || matchStory || matchHook;
    });
  }, [blueprints, selectedFramework, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedBpId(prev => (prev === id ? null : id));
  };

  const getFrameworkBadge = (framework: BlueprintFramework) => {
    switch (framework) {
      case 'STAR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CAR':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Problem → Decision → Impact':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Custom':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Section Sub-Header & Scope Education */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Answer Blueprints</h2>
            <KnowledgeInfoPopover
              label="Answer Blueprints"
              explanation="A ready-to-speak structure for answering a specific interview question using your best story."
              example="Connects 'Tell me about an architectural decision' to your CRM Migration story with rapid speaking cues."
              whyThisMatters="Prevents rambling. Gives you a battle-tested structure with proof points right when the question is asked."
            />
          </div>
          <p className="text-xs text-slate-600">
            Structured responses pairing interview questions with your best stories and rapid speaking cues.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddBlueprint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Blueprint</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search blueprints by question, blueprint title, or story..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Framework Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
          Framework:
        </span>
        {FRAMEWORK_FILTERS.map(fw => {
          const isSelected = selectedFramework === fw;
          const count = fw === 'All' 
            ? blueprints.length 
            : blueprints.filter(b => b.framework === fw).length;
          
          return (
            <button
              key={fw}
              type="button"
              onClick={() => setSelectedFramework(fw)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{fw}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Blueprints List */}
      {filteredBlueprints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Answer Blueprints found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Create an Answer Blueprint to connect a target question to your best story with rapid speaking cues.
          </p>
          <button
            type="button"
            onClick={onAddBlueprint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Blueprint</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredBlueprints.map(bp => {
            const isExpanded = expandedBpId === bp.id;
            const comp = bp.components;
            const durationMin = bp.targetDurationSeconds 
              ? `${Math.floor(bp.targetDurationSeconds / 60)}:${(bp.targetDurationSeconds % 60).toString().padStart(2, '0')}`
              : '2:30';

            // Extract proofs from results or impact
            const proofPoints = comp.result || comp.impact || [];

            return (
              <div
                key={bp.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
              >
                {/* Main Card Content arranged conceptually: QUESTION → STORY → ANSWER STRUCTURE → PROOF → GLANCEABLE CUES */}
                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* Top Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${getFrameworkBadge(bp.framework)}`}>
                        Framework: {bp.framework}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>Target: ~{durationMin} min</span>
                      </span>

                      <span className="text-[11px] font-bold text-slate-800">
                        {bp.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onPracticeBlueprint(bp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                        title="Launch Practice Simulator with this question and blueprint loaded"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Practice in Room</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditBlueprint(bp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit blueprint"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteBlueprint(bp.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete blueprint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 1. INTERVIEW QUESTION */}
                  <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
                      Target Interview Question
                    </span>
                    <p className="text-sm font-bold text-slate-900 leading-snug">
                      "{bp.questionText}"
                    </p>
                  </div>

                  {/* 2. BEST STORY */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Best Story:
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-bold border border-purple-200/80">
                      {bp.storyTitle}
                    </span>
                  </div>

                  {/* 3. ANSWER STRUCTURE (Opening Hook + Framework Summary) */}
                  {comp.openingHook && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 font-medium">
                      <Quote className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 rotate-180" />
                      <div className="flex-1">
                        <span className="font-bold text-slate-500 block text-[10px] uppercase tracking-wider">
                          Opening Philosophy Hook
                        </span>
                        <span className="text-slate-800 italic font-semibold">"{comp.openingHook}"</span>
                      </div>
                    </div>
                  )}

                  {/* 4. PROOF (Measurable Numbers & Results) */}
                  {proofPoints.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Proof
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {proofPoints.map((pt, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
                          >
                            <span className="text-emerald-600 font-bold font-mono">✓</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. RAPID GLANCEABLE INTERVIEW CUES */}
                  {comp.keyCues && comp.keyCues.length > 0 && (
                    <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">
                            Rapid Glanceable Interview Cues
                          </span>
                          <KnowledgeInfoPopover
                            label="Rapid Glanceable Cues"
                            explanation="These are short reminders for live speaking. They are intentionally not full scripts."
                            example="Open with 30s architectural pivot • Emphasize 0s downtime • Hand back with lesson learned"
                            whyThisMatters="During live speaking, your brain needs instant cues, not dense paragraphs."
                          />
                        </div>
                        <span className="text-[10px] text-amber-800 font-semibold">
                          Used during Practice & Live Interview
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {comp.keyCues.map((cue, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-slate-800 font-medium bg-white/70 px-2.5 py-1.5 rounded-lg border border-amber-200/50">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{cue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expand / Collapse Details Control */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => toggleExpand(bp.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Less' : 'View Full Narrative Structure'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Framework Components */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-3 bg-slate-50/70 border-t border-slate-100 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
                    
                    {/* STAR rendering */}
                    {bp.framework === 'STAR' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Situation (S)</span>
                            <p className="text-slate-800 leading-relaxed">{comp.situation || 'Not defined'}</p>
                          </div>

                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Task (T)</span>
                            <p className="text-slate-800 leading-relaxed">{comp.task || 'Not defined'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Actions Taken (A)</span>
                            <ul className="space-y-1">
                              {comp.action?.map((a, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-slate-800">
                                  <span className="text-blue-600 font-bold">•</span>
                                  <span>{a}</span>
                                </li>
                              )) || <li className="text-slate-400">None</li>}
                            </ul>
                          </div>

                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Results & Numbers (R)</span>
                            <ul className="space-y-1 font-mono text-xs">
                              {comp.result?.map((r, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-slate-800 font-semibold">
                                  <span className="text-emerald-600 font-bold">•</span>
                                  <span>{r}</span>
                                </li>
                              )) || <li className="text-slate-400">None</li>}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CAR rendering */}
                    {bp.framework === 'CAR' && (
                      <div className="space-y-3">
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Context (C)</span>
                          <p className="text-slate-800 leading-relaxed">{comp.context || 'Not defined'}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Action (A)</span>
                            <ul className="space-y-1">
                              {comp.action?.map((a, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-slate-800">
                                  <span className="text-emerald-600 font-bold">•</span>
                                  <span>{a}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Result (R)</span>
                            <ul className="space-y-1 font-mono text-xs">
                              {comp.result?.map((r, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-slate-800 font-semibold">
                                  <span className="text-emerald-600 font-bold">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Problem → Decision → Impact rendering */}
                    {bp.framework === 'Problem → Decision → Impact' && (
                      <div className="space-y-3">
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">1. Problem</span>
                          <p className="text-slate-800 leading-relaxed">{comp.problem || 'Not defined'}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">2. Decision & Architecture</span>
                            <p className="text-slate-800 leading-relaxed">{comp.decision || 'Not defined'}</p>
                            {comp.tradeoffs && comp.tradeoffs.length > 0 && (
                              <div className="pt-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Trade-offs Weighed:</span>
                                <ul className="text-xs text-slate-600 space-y-0.5 pt-0.5">
                                  {comp.tradeoffs.map((t, idx) => (
                                    <li key={idx}>• {t}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">3. Measurable Impact</span>
                            <ul className="space-y-1 font-mono text-xs">
                              {comp.impact?.map((imp, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-slate-800 font-semibold">
                                  <span className="text-purple-600 font-bold">•</span>
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Custom sections rendering */}
                    {bp.framework === 'Custom' && (
                      <div className="space-y-3">
                        {comp.customSections?.map((sec, idx) => (
                          <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{sec.label}</span>
                            <p className="text-slate-800 leading-relaxed whitespace-pre-line">{sec.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Avoid Cues Warning Strip */}
                    {comp.avoidCues && comp.avoidCues.length > 0 && (
                      <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[10px] uppercase tracking-wider">
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                          <span>Pitfalls & What to Avoid</span>
                        </div>
                        <ul className="space-y-0.5 text-slate-700">
                          {comp.avoidCues.map((avoid, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-rose-500 font-bold">✕</span>
                              <span>{avoid}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
