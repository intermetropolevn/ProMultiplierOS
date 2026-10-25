import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Sparkles, 
  Link as LinkIcon,
  Check,
  Award
} from 'lucide-react';
import { EvidenceItem, EvidenceCategory, CandidateStory } from '../../features/knowledge/types';
import { QUESTIONS_DATA } from '../../data/questionsData';
import { KnowledgeInfoPopover } from './KnowledgeInfoPopover';

interface EvidenceSectionProps {
  evidenceList: EvidenceItem[];
  stories?: CandidateStory[];
  onAddEvidence: () => void;
  onEditEvidence: (item: EvidenceItem) => void;
  onDeleteEvidence: (id: string) => void;
  onPromoteToStory: (item: EvidenceItem) => void;
  onOpenQuestionDetail?: (questionId: string) => void;
}

const ALL_CATEGORIES: ('All' | EvidenceCategory)[] = [
  'All',
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

export const EvidenceSection: React.FC<EvidenceSectionProps> = ({
  evidenceList,
  stories = [],
  onAddEvidence,
  onEditEvidence,
  onDeleteEvidence,
  onPromoteToStory,
  onOpenQuestionDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | EvidenceCategory>('All');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const filteredEvidence = useMemo(() => {
    return evidenceList.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.shortSummary.toLowerCase().includes(q);
      const matchRole = item.myRole.toLowerCase().includes(q);
      const matchSkills = item.skills.some(s => s.toLowerCase().includes(q));
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      const matchDecision = item.decision.toLowerCase().includes(q);

      return matchTitle || matchSummary || matchRole || matchSkills || matchTags || matchDecision;
    });
  }, [evidenceList, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  const getQuestionTitle = (qId: string) => {
    const found = QUESTIONS_DATA.find(q => q.id === qId);
    return found ? found.question : qId;
  };

  // Check if a story already exists for this evidence item
  const getStoryForEvidence = (evidenceId: string) => {
    return stories.find(s => s.evidenceId === evidenceId);
  };

  return (
    <div className="space-y-6">
      {/* Section Sub-Header & Scope Education */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Evidence</h2>
            <KnowledgeInfoPopover
              label="Evidence"
              explanation="Evidence is the source material for your interview preparation. Projects, decisions, conflicts, experiments, achievements and other real experiences you can talk about."
              example="Migrated 12M customer records to PostgreSQL with real-time Kafka CDC reconciliation."
              whyThisMatters="Interviewers evaluate what you personally did and decided, not generic theory."
            />
          </div>
          <p className="text-xs text-slate-600">
            Capture what you actually did, decided, and sacrificed. Attach proof points and link to questions.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddEvidence}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Evidence</span>
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
            placeholder="Search evidence by title, skill, decision, or tag..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Categories Horizontal Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {ALL_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          const count = cat === 'All' 
            ? evidenceList.length 
            : evidenceList.filter(e => e.category === cat).length;
          
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{cat}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results & Beta Indicator */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 gap-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-bold text-slate-900">{filteredEvidence.length}</strong> sample evidence {filteredEvidence.length === 1 ? 'signal' : 'signals'}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Curated Beta Preview
          </span>
        </div>
      </div>

      {/* Evidence Cards List */}
      {filteredEvidence.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No evidence found in this category</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Start by adding one real project, conflict, or technical decision from your experience.
          </p>
          <button
            type="button"
            onClick={onAddEvidence}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Evidence Item</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEvidence.map(item => {
            const isExpanded = expandedCardId === item.id;
            const existingStory = getStoryForEvidence(item.id);
            const validMetrics = item.metrics.filter(m => !m.toLowerCase().includes('add a concrete metric'));

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
              >
                {/* Main Card Header & Core Details */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Category & Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/60">
                        {item.category}
                      </span>

                      {item.roles.map(r => (
                        <span key={r} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {r}
                        </span>
                      ))}

                      {existingStory && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                          <Sparkles className="w-3 h-3" />
                          <span>In Story Bank</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditEvidence(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit evidence"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteEvidence(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete evidence"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 1. Title */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  {/* 2. Short Summary */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {item.shortSummary}
                  </p>

                  {/* 3. PROOF / Metrics Block */}
                  {validMetrics.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Proof
                        </span>
                        <KnowledgeInfoPopover
                          label="Proof"
                          explanation="Proof makes your stories concrete. Add real numbers, outcomes or measurable signals from your work."
                          example="12M records synchronized, 0s unplanned downtime, $420K annual savings."
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

                  {/* 4. SKILLS Block */}
                  {item.skills.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Skills
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.skills.map((skill, sIdx) => (
                          <span
                            key={`${item.id}-skill-${skill}-${sIdx}`}
                            className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. LINKED QUESTIONS & 6. Story Status & 7. Details */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    {/* Linked Questions Indicator */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Linked Questions
                      </span>
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
                        <LinkIcon className="w-3 h-3 text-blue-600" />
                        <span>{item.linkedQuestionIds.length} {item.linkedQuestionIds.length === 1 ? 'question' : 'questions'}</span>
                      </div>
                      <KnowledgeInfoPopover
                        label="Linked Interview Questions"
                        explanation="Why link this? During Live Interview, Career OS uses these relationships to find the most relevant experience when an interviewer asks a similar question."
                        whyThisMatters="Connects your raw experience to practice questions and real-time retrieval."
                      />
                    </div>

                    {/* Story status + Details Button */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPromoteToStory(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          existingStory
                            ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                            : 'bg-white hover:bg-purple-50 text-purple-700 border-purple-200 shadow-2xs'
                        }`}
                        title={existingStory ? 'View or edit this Story in Story Bank' : 'Turn this evidence into a Story'}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{existingStory ? 'Story Bank' : 'Create Story'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Less' : 'Details'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Structured Details (Progressive Disclosure) */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-3 bg-slate-50/70 border-t border-slate-100 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
                    
                    {/* Context & Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Context & Situation</span>
                        <p className="text-slate-800 leading-relaxed">{item.context}</p>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">My Role & Ownership</span>
                        <p className="text-slate-800 leading-relaxed">{item.myRole}</p>
                      </div>
                    </div>

                    {/* Actions Taken */}
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Actions Taken</span>
                      <p className="text-slate-800 leading-relaxed">{item.actions}</p>
                    </div>

                    {/* Decision & Trade-offs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Decision Made</span>
                        <p className="text-slate-800 leading-relaxed">{item.decision}</p>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Trade-offs Weighed</span>
                        <p className="text-slate-800 leading-relaxed">{item.tradeoffs}</p>
                      </div>
                    </div>

                    {/* Outcome */}
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Outcome</span>
                      <p className="text-slate-800 leading-relaxed">{item.outcome}</p>
                    </div>

                    {/* Linked Questions List Detail */}
                    {item.linkedQuestionIds.length > 0 && (
                      <div className="p-3.5 bg-white rounded-xl border border-blue-200/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                            Linked Interview Questions
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Retrieved by Career OS during mock simulation
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {item.linkedQuestionIds.map(qId => (
                            <div
                              key={qId}
                              className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-slate-800 font-medium"
                            >
                              <span className="line-clamp-1">{getQuestionTitle(qId)}</span>
                              {onOpenQuestionDetail && (
                                <button
                                  type="button"
                                  onClick={() => onOpenQuestionDetail(qId)}
                                  className="text-blue-600 hover:text-blue-800 text-[11px] font-bold underline ml-2 shrink-0 cursor-pointer"
                                >
                                  View Rubric
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags & Domains */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      {item.domains.length > 0 && (
                        <div>
                          <span className="font-semibold text-slate-600">Domains: </span>
                          <span>{item.domains.join(', ')}</span>
                        </div>
                      )}
                      {item.tags.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-slate-400" />
                          <span>Tags:</span>
                          {item.tags.map(tag => (
                            <span key={tag} className="text-slate-600 font-medium">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

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
