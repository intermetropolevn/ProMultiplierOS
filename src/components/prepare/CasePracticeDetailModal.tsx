import React, { useState } from 'react';
import {
  X,
  Clock,
  Briefcase,
  Globe,
  Award,
  Layers,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  FileText,
  Play,
  Copy,
  Check,
  ShieldCheck,
  BarChart2,
  Eye,
  EyeOff
} from 'lucide-react';
import { CaseStudy, CaseExhibit, CaseQuestion, IndustryDataPoint } from '../../features/industry/types';
import { industryStore } from '../../features/industry/services/industryStore';
import { ExhibitViewer } from './ExhibitViewer';

interface CasePracticeDetailModalProps {
  caseStudy: CaseStudy;
  onClose: () => void;
  onLaunchSimulation?: (caseStudy: CaseStudy) => void;
}

export const CasePracticeDetailModal: React.FC<CasePracticeDetailModalProps> = ({
  caseStudy,
  onClose,
  onLaunchSimulation
}) => {
  const exhibits = industryStore.getExhibitsForCase(caseStudy.id);
  const questions = industryStore.getQuestionsForCase(caseStudy.id);
  const industry = caseStudy.industryId ? industryStore.getIndustryById(caseStudy.industryId) : undefined;

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXHIBITS' | 'QUESTIONS' | 'SOLUTION'>('OVERVIEW');
  const [selectedExhibitIndex, setSelectedExhibitIndex] = useState<number>(0);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

  // Question interaction state
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [showSolutionForQuestion, setShowSolutionForQuestion] = useState<Record<string, boolean>>({});
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const activeQuestion = questions[selectedQuestionIndex] || questions[0];
  const activeExhibit = exhibits[selectedExhibitIndex] || exhibits[0];

  const handleRevealHint = (qId: string) => {
    const current = revealedHints[qId] || 0;
    setRevealedHints({ ...revealedHints, [qId]: current + 1 });
  };

  const handleToggleSolution = (qId: string) => {
    setShowSolutionForQuestion({
      ...showSolutionForQuestion,
      [qId]: !showSolutionForQuestion[qId]
    });
  };

  const handleCopySetup = () => {
    const fullText = `Case Study: ${caseStudy.title}\n\nContext:\n${caseStudy.context}\n\nObjective:\n${caseStudy.objective}\n\nSetup:\n${caseStudy.setup}`;
    navigator.clipboard.writeText(fullText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                caseStudy.difficulty === 'EXPERT'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : caseStudy.difficulty === 'ADVANCED'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {caseStudy.difficulty}
              </span>
              {industry && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                  {industry.name}
                </span>
              )}
              {caseStudy.geography && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {caseStudy.geography}
                </span>
              )}
              {caseStudy.estimatedTime && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {caseStudy.estimatedTime} mins
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
              {caseStudy.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
              {caseStudy.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopySetup}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
              title="Copy Case Context to Clipboard"
            >
              {copiedPrompt ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Case Context & Setup</span>
          </button>

          {exhibits.length > 0 && (
            <button
              onClick={() => setActiveTab('EXHIBITS')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'EXHIBITS'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Exhibits ({exhibits.length})</span>
            </button>
          )}

          {questions.length > 0 && (
            <button
              onClick={() => setActiveTab('QUESTIONS')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'QUESTIONS'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Interview Questions ({questions.length})</span>
            </button>
          )}

          {caseStudy.solution && (
            <button
              onClick={() => setActiveTab('SOLUTION')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'SOLUTION'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Model Solution</span>
            </button>
          )}
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Context Block */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Background & Industry Context
                </h3>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {caseStudy.context}
                </div>
              </div>

              {/* Objective Block */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  Core Objective & Problem Statement
                </h3>
                <div className="text-sm text-slate-800 font-medium leading-relaxed">
                  {caseStudy.objective}
                </div>
              </div>

              {/* Setup & Role Block */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Candidate Setup & Assumptions
                </h3>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {caseStudy.setup}
                </div>
              </div>

              {/* Skills & Frameworks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Skills Practiced
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {caseStudy.skillIds.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Recommended Frameworks
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {caseStudy.frameworkIds.map((fr, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                        {fr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Callout to Start Questions */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ready to tackle the interview questions?</h4>
                  <p className="text-xs text-slate-600">Review exhibits or proceed directly through the 4-phase structured problem solving flow.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {exhibits.length > 0 && (
                    <button
                      onClick={() => setActiveTab('EXHIBITS')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Inspect Exhibits
                    </button>
                  )}
                  {questions.length > 0 && (
                    <button
                      onClick={() => setActiveTab('QUESTIONS')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Start Questions</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXHIBITS */}
          {activeTab === 'EXHIBITS' && exhibits.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Exhibit Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {exhibits.map((exh, idx) => (
                  <button
                    key={exh.id}
                    onClick={() => setSelectedExhibitIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedExhibitIndex === idx
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Exhibit {idx + 1}: {exh.title.slice(0, 26)}...</span>
                  </button>
                ))}
              </div>

              {/* Active Exhibit Viewer */}
              {activeExhibit && (
                <ExhibitViewer exhibit={activeExhibit} />
              )}
            </div>
          )}

          {/* TAB 3: QUESTIONS */}
          {activeTab === 'QUESTIONS' && questions.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Question Pagination Header */}
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Question {selectedQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {activeQuestion.type}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedQuestionIndex(Math.max(0, selectedQuestionIndex - 1))}
                    disabled={selectedQuestionIndex === 0}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedQuestionIndex(Math.min(questions.length - 1, selectedQuestionIndex + 1))}
                    disabled={selectedQuestionIndex === questions.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    Q{selectedQuestionIndex + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {activeQuestion.question}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeQuestion.skillIds.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progressive Hints Section */}
                {activeQuestion.hints && activeQuestion.hints.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        Progressive Hints ({revealedHints[activeQuestion.id] || 0}/{activeQuestion.hints.length})
                      </span>
                      {(revealedHints[activeQuestion.id] || 0) < activeQuestion.hints.length && (
                        <button
                          onClick={() => handleRevealHint(activeQuestion.id)}
                          className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Reveal Hint {(revealedHints[activeQuestion.id] || 0) + 1}
                        </button>
                      )}
                    </div>

                    {/* Display Revealed Hints */}
                    {activeQuestion.hints.slice(0, revealedHints[activeQuestion.id] || 0).map((hint, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2">
                        <span className="font-bold text-amber-800">Hint {idx + 1}:</span>
                        <p>{hint}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Candidate Scratchpad */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Your Approach & Scratchpad Notes
                  </label>
                  <textarea
                    rows={3}
                    value={userNotes[activeQuestion.id] || ''}
                    onChange={(e) => setUserNotes({ ...userNotes, [activeQuestion.id]: e.target.value })}
                    placeholder="Draft your structuring framework, calculation notes, or synthesis here..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  />
                </div>

                {/* Model Answer Toggle */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleSolution(activeQuestion.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    {showSolutionForQuestion[activeQuestion.id] ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide Calibrated Model Answer</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show Calibrated Model Answer</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {selectedQuestionIndex < questions.length - 1 ? (
                      <button
                        onClick={() => setSelectedQuestionIndex(selectedQuestionIndex + 1)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('SOLUTION')}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>View Final Solution</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Calibrated Model Answer Box */}
                {showSolutionForQuestion[activeQuestion.id] && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-3 animate-in fade-in duration-150">
                    {activeQuestion.expectedApproach && (
                      <div>
                        <strong className="text-emerald-950 font-bold block mb-0.5">Expected Problem-Solving Structure:</strong>
                        <p className="text-emerald-900 leading-relaxed">{activeQuestion.expectedApproach}</p>
                      </div>
                    )}
                    {activeQuestion.expectedCalculation && (
                      <div className="pt-2 border-t border-emerald-100">
                        <strong className="text-emerald-950 font-bold block mb-0.5">Expected Quantitative Mechanics:</strong>
                        <p className="text-emerald-900 font-mono text-[11px] bg-white/70 p-2 rounded-lg border border-emerald-200">
                          {activeQuestion.expectedCalculation}
                        </p>
                      </div>
                    )}
                    {activeQuestion.answer && (
                      <div className="pt-2 border-t border-emerald-100">
                        <strong className="text-emerald-950 font-bold block mb-0.5">Calibrated Executive Answer:</strong>
                        <p className="text-emerald-900 leading-relaxed font-medium">{activeQuestion.answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MODEL SOLUTION */}
          {activeTab === 'SOLUTION' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Comprehensive Case Synthesis & Calibrated Solution
                  </h3>
                </div>

                {caseStudy.solutionFramework && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                      Solution Framework Architecture:
                    </span>
                    <p className="text-slate-900 font-medium">{caseStudy.solutionFramework}</p>
                  </div>
                )}

                <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line p-4 rounded-xl bg-emerald-50/40 border border-emerald-100">
                  {caseStudy.solution}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Grounded with verified Industry Intelligence & Data Points</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
            {onLaunchSimulation && (
              <button
                onClick={() => onLaunchSimulation(caseStudy)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Practice Simulator</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
