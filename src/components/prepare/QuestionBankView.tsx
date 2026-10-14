import React, { useState } from 'react';
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Layers,
  BookOpen
} from 'lucide-react';
import { InterviewQuestion, RoleCategory, SectorDomain, QuestionType } from '../../types';
import { QUESTIONS_DATA } from '../../data/questionsData';
import { KnowledgeStorageService } from '../../features/knowledge/services/knowledgeStorageService';

interface QuestionBankViewProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onPracticeQuestion: (question: InterviewQuestion) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  bookmarkedIds,
  onToggleBookmark,
  onPracticeQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const roles = ['All', 'Software Engineering', 'Product Management', 'UI/UX & Product Design', 'Data & Machine Learning', 'DevOps & Cloud'];
  const types = ['All', 'Behavioral (STAR)', 'Technical Architecture', 'Product Sense & Strategy', 'System Design'];

  const filteredQuestions = QUESTIONS_DATA.filter(q => {
    if (searchQuery.trim()) {
      const matchText = q.question.toLowerCase() + ' ' + q.context.toLowerCase() + ' ' + q.keywordsToMention.join(' ').toLowerCase();
      if (!matchText.includes(searchQuery.toLowerCase())) return false;
    }
    if (selectedRole !== 'All' && q.roleCategory !== selectedRole) return false;
    if (selectedType !== 'All' && q.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interview questions by topic, keyword (e.g. idempotency, RAG, disagree)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              aria-label="Filter by Role"
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by Question Type"
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden"
            >
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.map(q => {
          const isExpanded = expandedQuestionId === q.id;
          const isBookmarked = bookmarkedIds.includes(q.id);

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
            >
              {/* Question header row */}
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {q.roleCategory}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {q.type}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {q.level}
                    </span>
                    <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                      {q.domain}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    <strong>Calibration Context:</strong> {q.context}
                  </p>

                  {/* Linked Profile Stories from Candidate Story Bank */}
                  {(() => {
                    const linkedStories = KnowledgeStorageService.getStoriesForQuestion(q.id);
                    if (linkedStories.length === 0) return null;
                    return (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span>Linked Story Bank:</span>
                        </span>
                        {linkedStories.map(story => (
                          <span
                            key={story.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200 text-xs font-semibold"
                          >
                            <span>{story.title}</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              story.evidenceQuality === 'Strong evidence' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`} />
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleBookmark(q.id)}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onPracticeQuestion(q)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Practice</span>
                  </button>

                  <button
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Toggle rubric details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Rubric & Model Answer */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  {/* Rubric criteria */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      Interviewer Evaluation Rubric
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {q.rubricCriteria.map((rubric, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                          <div className="font-bold text-slate-900 flex items-center justify-between">
                            <span>{rubric.criterion}</span>
                            <span className="text-[10px] text-blue-600 font-mono">Weight: {rubric.weight}%</span>
                          </div>
                          <div className="text-[11px] text-emerald-800 bg-emerald-50/60 p-2 rounded-md border border-emerald-100">
                            <strong>Strong signals:</strong> {rubric.whatStrongCandidatesSay}
                          </div>
                          <div className="text-[11px] text-rose-800 bg-rose-50/60 p-2 rounded-md border border-rose-100">
                            <strong>Red flags:</strong> {rubric.redFlags}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STAR Structure Guidance */}
                  {q.starGuidance && (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Recommended STAR Structure
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-slate-800 block text-[11px] uppercase">Situation</span>
                          <span className="text-slate-600 text-[11px]">{q.starGuidance.situation}</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-slate-800 block text-[11px] uppercase">Task</span>
                          <span className="text-slate-600 text-[11px]">{q.starGuidance.task}</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-slate-800 block text-[11px] uppercase">Action</span>
                          <span className="text-slate-600 text-[11px]">{q.starGuidance.action}</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-slate-800 block text-[11px] uppercase">Result</span>
                          <span className="text-slate-600 text-[11px]">{q.starGuidance.result}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Keywords to mention */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Key Technical Concepts to Weave In
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {q.keywordsToMention.map((keyword, idx) => (
                        <span key={idx} className="text-xs font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Exemplary model answer */}
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Exemplary Benchmark Model Answer (Top 1% Candidate Calibration)
                    </h4>
                    <p className="text-xs text-slate-800 leading-relaxed italic bg-white p-3.5 rounded-lg border border-blue-200/60 font-sans">
                      &ldquo;{q.exemplaryModelAnswer}&rdquo;
                    </p>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
