import React, { useState } from 'react';
import { 
  Compass, 
  MessageSquare, 
  Volume2, 
  ArrowRight, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Clock, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { BusinessTopic } from '../../features/businessEnglish/types';
import { BusinessEnglishService } from '../../features/businessEnglish/services/businessEnglishService';

interface TopicsLibraryProps {
  onStartRolePlayWithTopic?: (scenarioId: string) => void;
  onSelectVocabularyTerm?: (term: string) => void;
  className?: string;
}

export const TopicsLibrary: React.FC<TopicsLibraryProps> = ({
  onStartRolePlayWithTopic,
  onSelectVocabularyTerm,
  className = ''
}) => {
  const topics = BusinessEnglishService.getTopics();
  const [selectedTopic, setSelectedTopic] = useState<BusinessTopic>(topics[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = topics.filter(top => 
    !searchQuery ||
    top.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    top.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    top.keyVocabulary.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-teal-800/40 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Workplace Topics & Conversation Inspiration</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Practical Business Topics & Discussion Guides
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Explore curated workplace topics with context briefings, core industry vocabulary, useful sentence structures, and discussion questions. Jump directly from any topic into a live simulated role-play.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics by title, domain, or key vocabulary..."
          className="w-full pl-9 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 font-sans shadow-xs"
        />
      </div>

      {/* Main Layout: Topic List (left 4 cols) & Detail Card (right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Topics Navigation */}
        <div className="lg:col-span-4 space-y-3">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedTopic.id === topic.id
                  ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>{topic.category}</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" />
                  {topic.readTimeMinutes} min read
                </span>
              </div>

              <h4 className="text-sm font-black text-slate-900 mt-1 leading-snug">
                {topic.title}
              </h4>

              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {topic.shortContext}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column: Active Topic Deep-Dive */}
        {selectedTopic && (
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            
            {/* Header with 1-Click Launch Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {selectedTopic.relatedDomain} • {selectedTopic.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                  {selectedTopic.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onStartRolePlayWithTopic && onStartRolePlayWithTopic(selectedTopic.relatedScenarioId)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Talk About This in Role-Play</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Context & Why It Matters */}
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Workplace Background & Context
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {selectedTopic.shortContext}
                </p>
              </div>

              <div className="flex items-start gap-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-950">
                <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Why this matters in career discussions:</strong> {selectedTopic.whyItMatters}</span>
              </div>
            </div>

            {/* High-Leverage Vocabulary Chips */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Key Workplace Vocabulary for This Topic:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTopic.keyVocabulary.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      BusinessEnglishService.speak(term);
                      if (onSelectVocabularyTerm) onSelectVocabularyTerm(term);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                  >
                    <span>{term}</span>
                    <Volume2 className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Useful Phrasing Structures */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Useful Sentence Starters & Speaking Structures:
              </h4>
              <div className="space-y-2">
                {selectedTopic.usefulPhrases.map((phrase, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 italic"
                  >
                    <span>"{phrase}"</span>
                    <button
                      type="button"
                      onClick={() => BusinessEnglishService.speak(phrase)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer ml-2"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion Prompts */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Recommended Discussion & Self-Reflection Prompts
                </h4>
              </div>

              <div className="space-y-2 text-xs text-slate-200">
                {selectedTopic.discussionQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">{qIdx + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
