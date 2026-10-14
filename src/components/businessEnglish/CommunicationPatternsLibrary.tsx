import React, { useState } from 'react';
import { 
  GitCommit, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Lightbulb, 
  Layers, 
  TrendingUp,
  Search
} from 'lucide-react';
import { CommunicationPattern } from '../../features/businessEnglish/types';
import { BusinessEnglishService } from '../../features/businessEnglish/services/businessEnglishService';

interface CommunicationPatternsLibraryProps {
  onSelectPatternForPractice?: (scenarioId?: string) => void;
  className?: string;
}

export const CommunicationPatternsLibrary: React.FC<CommunicationPatternsLibraryProps> = ({
  onSelectPatternForPractice,
  className = ''
}) => {
  const patterns = BusinessEnglishService.getCommunicationPatterns();
  const [selectedPattern, setSelectedPattern] = useState<CommunicationPattern>(patterns[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatterns = patterns.filter(p =>
    !searchQuery ||
    p.situation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-purple-800/40 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
            <GitCommit className="w-3.5 h-3.5" />
            <span>4-Tier Seniority Communication Progression</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Workplace Communication Patterns & Ladders
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            See how workplace phrasing elevates across 4 clear stages: from Basic to Professional, More Confident, and Senior Executive. Learn the strategic rationale behind why executive communicators frame messages around business risk, trade-offs, and solutions.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patterns (e.g. disagreeing, pushing back, status update, clarification)..."
          className="w-full pl-9 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-600 font-sans shadow-xs"
        />
      </div>

      {/* Main Grid: Pattern Selector (left 4 cols) & Detail Progression Ladder (right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Patterns List */}
        <div className="lg:col-span-4 space-y-3">
          {filteredPatterns.map((pat) => (
            <div
              key={pat.id}
              onClick={() => setSelectedPattern(pat)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedPattern.id === pat.id
                  ? 'bg-purple-50/80 border-purple-500 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {pat.category}
              </span>
              <h4 className="text-sm font-black text-slate-900 mt-1">
                {pat.situation}
              </h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {pat.purpose}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column: 4-Tier Ladder */}
        {selectedPattern && (
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {selectedPattern.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {selectedPattern.situation}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {selectedPattern.purpose}
              </p>
            </div>

            {/* 4 Progression Tiers Stack */}
            <div className="space-y-4">
              
              {/* Level 1: Basic */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    Tier 1: Basic (Informal / Direct)
                  </span>
                  <button
                    type="button"
                    onClick={() => BusinessEnglishService.speak(selectedPattern.basic.text)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-800 italic">
                  "{selectedPattern.basic.text}"
                </p>
                <div className="text-xs text-slate-500 pt-1">
                  <strong>Assessment:</strong> {selectedPattern.basic.explanation}
                </div>
              </div>

              {/* Level 2: Professional */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Tier 2: Professional (Standard Workplace)
                  </span>
                  <button
                    type="button"
                    onClick={() => BusinessEnglishService.speak(selectedPattern.professional.text)}
                    className="text-slate-400 hover:text-blue-700 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-blue-950">
                  "{selectedPattern.professional.text}"
                </p>
                <div className="text-xs text-blue-900/80 pt-1">
                  <strong>Why this works:</strong> {selectedPattern.professional.explanation}
                </div>
              </div>

              {/* Level 3: Confident */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    Tier 3: Confident (Evidence-Based & Collaborative)
                  </span>
                  <button
                    type="button"
                    onClick={() => BusinessEnglishService.speak(selectedPattern.confident.text)}
                    className="text-slate-400 hover:text-indigo-700 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-indigo-950">
                  "{selectedPattern.confident.text}"
                </p>
                <div className="text-xs text-indigo-900/80 pt-1">
                  <strong>Why this works:</strong> {selectedPattern.confident.explanation}
                </div>
              </div>

              {/* Level 4: Senior / Executive */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-800 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Tier 4: Senior Executive (Strategic & Solution-Led)
                  </span>
                  <button
                    type="button"
                    onClick={() => BusinessEnglishService.speak(selectedPattern.executive.text)}
                    className="text-slate-400 hover:text-amber-400 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm sm:text-base font-medium text-amber-50 leading-relaxed">
                  "{selectedPattern.executive.text}"
                </p>
                <div className="text-xs text-slate-300 pt-1 border-t border-slate-800">
                  <strong className="text-amber-300">Executive Rationale:</strong> {selectedPattern.executive.explanation}
                </div>
              </div>

            </div>

            {/* Strategic Principles Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Core Communication Principles to Retain
                </h4>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                {selectedPattern.keyPrinciples.map((principle, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{principle}</span>
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
