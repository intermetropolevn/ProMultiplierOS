import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Check, 
  Link as LinkIcon, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  BookmarkPlus,
  BookOpen
} from 'lucide-react';
import { 
  CandidateStory, 
  StoryBestFor, 
  StoryEvidenceQuality, 
  StructuredAnswerBlueprint 
} from '../../features/knowledge/types';
import { QUESTIONS_DATA } from '../../data/questionsData';
import { KnowledgeInfoPopover } from './KnowledgeInfoPopover';

interface StoryBankSectionProps {
  stories: CandidateStory[];
  blueprints?: StructuredAnswerBlueprint[];
  onAddStory: () => void;
  onEditStory: (story: CandidateStory) => void;
  onDeleteStory: (id: string) => void;
  onCreateBlueprintFromStory: (story: CandidateStory) => void;
  onOpenBlueprint?: (blueprintId: string) => void;
  onToggleQuestionLink: (storyId: string, questionId: string) => void;
  onOpenQuestionDetail?: (questionId: string) => void;
}

const BEST_FOR_FILTERS: ('All' | StoryBestFor)[] = [
  'All',
  'Conflict',
  'Leadership',
  'Ambiguity',
  'Failure',
  'Decision Making',
  'Scale',
  'Technical Architecture'
];

export const StoryBankSection: React.FC<StoryBankSectionProps> = ({
  stories,
  blueprints = [],
  onAddStory,
  onEditStory,
  onDeleteStory,
  onCreateBlueprintFromStory,
  onOpenBlueprint,
  onToggleQuestionLink,
  onOpenQuestionDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBestFor, setSelectedBestFor] = useState<'All' | StoryBestFor>('All');
  const [selectedQuality, setSelectedQuality] = useState<'All' | StoryEvidenceQuality>('All');
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
  const [linkingModalStoryId, setLinkingModalStoryId] = useState<string | null>(null);

  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      if (selectedBestFor !== 'All' && !story.bestFor.includes(selectedBestFor)) {
        return false;
      }
      if (selectedQuality !== 'All' && story.evidenceQuality !== selectedQuality) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = story.title.toLowerCase().includes(q);
      const matchSynopsis = story.synopsis.toLowerCase().includes(q);
      const matchSkills = story.skills.some(s => s.toLowerCase().includes(q));
      const matchRoles = story.relevantRoles.some(r => r.toLowerCase().includes(q));
      const matchBestFor = story.bestFor.some(b => b.toLowerCase().includes(q));

      return matchTitle || matchSynopsis || matchSkills || matchRoles || matchBestFor;
    });
  }, [stories, selectedBestFor, selectedQuality, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedStoryId(prev => (prev === id ? null : id));
  };

  const getQuestion = (qId: string) => {
    return QUESTIONS_DATA.find(q => q.id === qId);
  };

  const getBlueprintForStory = (storyId: string) => {
    return blueprints.find(b => b.storyId === storyId);
  };

  const renderQualityBadge = (quality: StoryEvidenceQuality) => {
    switch (quality) {
      case 'Strong evidence':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Strong evidence</span>
          </span>
        );
      case 'Partial evidence':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Partial evidence</span>
          </span>
        );
      case 'Needs metrics':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Needs metrics</span>
          </span>
        );
    }
  };

  const activeStoryForLinking = stories.find(s => s.id === linkingModalStoryId);

  return (
    <div className="space-y-6">
      {/* Section Sub-Header & Scope Education */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Stories</h2>
            <KnowledgeInfoPopover
              label="Stories"
              explanation="Stories package your evidence for common interview themes such as conflict, leadership, ambiguity and decision making."
              example="Frame your backend scaling initiative as an ambiguity story for executive cross-functional interviews."
              whyThisMatters="Interviewers ask thematic questions ('Tell me about a time you disagreed...'). Stories package raw project evidence into memorable narratives."
            />
          </div>
          <p className="text-xs text-slate-600">
            Turn your experience into answers you can actually tell.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddStory}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Story</span>
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
            placeholder="Search stories by title, behavioral tag (Conflict, Ambiguity), role, or skill..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Filter Rows: Best For & Quality */}
      <div className="space-y-2.5">
        {/* Best For Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Best For:
          </span>
          {BEST_FOR_FILTERS.map(tag => {
            const isSelected = selectedBestFor === tag;
            const count = tag === 'All' 
              ? stories.length 
              : stories.filter(s => s.bestFor.includes(tag)).length;
            
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedBestFor(tag)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{tag}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-purple-900 text-purple-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quality Filter Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Evidence Quality:
          </span>
          {(['All', 'Strong evidence', 'Partial evidence', 'Needs metrics'] as const).map(qual => {
            const isSelected = selectedQuality === qual;
            return (
              <button
                key={qual}
                type="button"
                onClick={() => setSelectedQuality(qual)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {qual}
              </button>
            );
          })}
        </div>
      </div>

      {/* Story Cards List */}
      {filteredStories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No stories match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Add a new story card or promote an item from your Evidence repository into Stories.
          </p>
          <button
            type="button"
            onClick={onAddStory}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Story Card</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredStories.map(story => {
            const isExpanded = expandedStoryId === story.id;
            const existingBlueprint = getBlueprintForStory(story.id);
            const linkedQuestions = story.linkedQuestionIds.map(qId => getQuestion(qId)).filter(Boolean);
            const validMetrics = story.metrics.filter(m => !m.toLowerCase().includes('add a concrete metric'));

            return (
              <div
                key={story.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
              >
                {/* Main Card Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top Status Badges & Controls */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {renderQualityBadge(story.evidenceQuality)}

                      {story.relevantRoles.map(role => (
                        <span key={role} className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                          {role}
                        </span>
                      ))}

                      {existingBlueprint && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          <BookOpen className="w-3 h-3 text-blue-600" />
                          <span>Blueprint Ready</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditStory(story)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit story card"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteStory(story.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete story card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 1. Story Title */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {story.title}
                  </h3>

                  {/* 2. Short Narrative (Synopsis) */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {story.synopsis}
                  </p>

                  {/* 3. BEST FOR */}
                  {story.bestFor.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 block">
                        Best For
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {story.bestFor.map(bf => (
                          <span
                            key={bf}
                            className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200/70 font-semibold text-xs"
                          >
                            • {bf}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. PROOF (Concrete Metrics) */}
                  {validMetrics.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Proof
                        </span>
                        <KnowledgeInfoPopover
                          label="Proof"
                          explanation="Proof makes your stories concrete. Add real numbers, outcomes or measurable signals from your work."
                          example="12M records, 0s downtime, $420K / year"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {validMetrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80"
                          >
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="font-mono">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. SKILLS */}
                  {story.skills.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Skills
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {story.skills.map((skill, sIdx) => (
                          <span
                            key={`${story.id}-skill-${skill}-${sIdx}`}
                            className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. LINKED QUESTIONS & 7. Blueprint Availability & Details */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Linked Questions
                      </span>
                      <button
                        type="button"
                        onClick={() => setLinkingModalStoryId(story.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                        title="Click to manage linked questions"
                      >
                        <LinkIcon className="w-3 h-3 text-purple-600" />
                        <span>{story.linkedQuestionIds.length} {story.linkedQuestionIds.length === 1 ? 'question' : 'questions'}</span>
                      </button>
                      <KnowledgeInfoPopover
                        label="Linked Question"
                        explanation="A relationship used by Live Interview retrieval. Connects this story to questions so Career OS can retrieve it live."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {existingBlueprint ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenBlueprint) {
                              onOpenBlueprint(existingBlueprint.id);
                            } else {
                              onCreateBlueprintFromStory(story);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 transition-all cursor-pointer shadow-2xs"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          <span>Open Blueprint</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onCreateBlueprintFromStory(story)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 transition-all cursor-pointer shadow-2xs"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
                          <span>Create Blueprint</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleExpand(story.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Less' : 'Details'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Structured Narrative (Progressive Disclosure) */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-3 bg-slate-50/70 border-t border-slate-100 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
                    
                    {/* Context & Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Context</span>
                        <p className="text-slate-800 leading-relaxed">{story.context}</p>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">My Role</span>
                        <p className="text-slate-800 leading-relaxed">{story.myRole}</p>
                      </div>
                    </div>

                    {/* Actions, Decision & Trade-offs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Actions</span>
                        <p className="text-slate-800 leading-relaxed">{story.actions}</p>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Decision & Trade-offs</span>
                        <p className="text-slate-800 leading-relaxed">{story.decision}</p>
                        {story.tradeoffs && (
                          <p className="text-slate-600 text-xs italic pt-1">Trade-off: {story.tradeoffs}</p>
                        )}
                      </div>
                    </div>

                    {/* Question Links Preview List */}
                    {linkedQuestions.length > 0 && (
                      <div className="p-3.5 bg-white rounded-xl border border-purple-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
                            Linked Interview Questions
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Candidate story during Live Interview retrieval
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {linkedQuestions.map(q => (
                            <div
                              key={q!.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-800"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                                  {q!.roleCategory.split(' ')[0]}
                                </span>
                                <span className="font-medium line-clamp-1">{q!.question}</span>
                              </div>

                              {onOpenQuestionDetail && (
                                <button
                                  type="button"
                                  onClick={() => onOpenQuestionDetail(q!.id)}
                                  className="text-blue-600 hover:text-blue-800 text-[11px] font-bold ml-2 shrink-0 cursor-pointer"
                                >
                                  Rubric
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Question Linking Modal */}
      {activeStoryForLinking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
            
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  Profile → Question Relationship
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Link Questions to "{activeStoryForLinking.title}"
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLinkingModalStoryId(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-2 flex-1 text-xs">
              <p className="text-slate-500 pb-1">
                Toggle interview questions that this story serves as strong candidate evidence for:
              </p>

              {QUESTIONS_DATA.map(q => {
                const isLinked = activeStoryForLinking.linkedQuestionIds.includes(q.id);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => onToggleQuestionLink(activeStoryForLinking.id, q.id)}
                    className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-colors cursor-pointer ${
                      isLinked
                        ? 'bg-purple-50 border-purple-200 text-purple-950 font-semibold'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isLinked ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isLinked && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2">{q.question}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                        <span className="font-semibold">{q.roleCategory}</span>
                        <span>•</span>
                        <span>{q.type}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 flex justify-end bg-slate-50">
              <button
                type="button"
                onClick={() => setLinkingModalStoryId(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
