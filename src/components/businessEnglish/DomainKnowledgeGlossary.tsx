import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Volume2, 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { DomainConcept } from '../../features/businessEnglish/types';
import { BusinessEnglishService } from '../../features/businessEnglish/services/businessEnglishService';

interface DomainKnowledgeGlossaryProps {
  onPracticeInRolePlay?: (scenarioId?: string) => void;
  onAddToVocabulary?: (term: string) => void;
  className?: string;
}

export const DomainKnowledgeGlossary: React.FC<DomainKnowledgeGlossaryProps> = ({
  onPracticeInRolePlay,
  onAddToVocabulary,
  className = ''
}) => {
  const concepts = BusinessEnglishService.getDomainConcepts();
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedTerms, setAddedTerms] = useState<string[]>([]);

  const domains = [
    'All',
    'Finance',
    'Product',
    'Software Engineering',
    'Business & Strategy',
    'Technology',
    'AI & Machine Learning',
    'Data & Analytics',
    'Operations'
  ];

  const filteredConcepts = concepts.filter(c => {
    const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
    const matchesSearch = !searchQuery || 
      c.conceptName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plainEnglishExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.businessMeaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleAddTerm = (term: string) => {
    setAddedTerms(prev => [...prev, term]);
    if (onAddToVocabulary) {
      onAddToVocabulary(term);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-blue-800/40 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Cross-Functional Business Terminology</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Domain Knowledge & Practical Terminology
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Bridge the gap between functional jargon and commercial reality. Understand the plain-English meaning, workplace meeting usage, and executive levers behind core concepts across Product, Engineering, Finance, and Strategy.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts across Finance, Product, Engineering, or Strategy..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 font-sans"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {domains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Concepts Cards List */}
      <div className="space-y-4">
        {filteredConcepts.map((concept) => (
          <div
            key={concept.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all space-y-5"
          >
            {/* Top Bar: Domain, Name, Pronunciation, Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {concept.domain}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {concept.conceptName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => BusinessEnglishService.speak(concept.conceptName)}
                    className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                    title="Listen to pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleAddTerm(concept.conceptName)}
                  disabled={addedTerms.includes(concept.conceptName)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {addedTerms.includes(concept.conceptName) ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-slate-500" />
                      <span>Add to Vocabulary</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onPracticeInRolePlay && onPracticeInRolePlay(concept.relatedScenarioId)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Practice in Role-Play</span>
                </button>
              </div>
            </div>

            {/* Plain English vs Business Meaning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Plain-English Explanation
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {concept.plainEnglishExplanation}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Commercial & Business Value
                </div>
                <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
                  {concept.businessMeaning}
                </p>
              </div>
            </div>

            {/* Real Meeting Usage */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Example Executive / Meeting Usage:
                </span>
                <button
                  type="button"
                  onClick={() => BusinessEnglishService.speak(concept.exampleMeetingUsage)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                  title="Listen to meeting sentence"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 italic">
                "{concept.exampleMeetingUsage}"
              </p>
            </div>

            {/* Associated Roles & Related Terms */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-medium">Relevant Functions:</span>
                <span className="text-slate-800 font-bold">{concept.relatedRoles.join(', ')}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400">Related Terms:</span>
                {concept.relatedTerminology.map((term, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
