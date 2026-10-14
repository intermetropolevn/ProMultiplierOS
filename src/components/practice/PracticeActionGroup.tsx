import React, { useState } from 'react';
import { Sparkles, Radio, MessageSquare, Mic, Globe, ChevronRight } from 'lucide-react';
import { InterviewConfig } from '../../types';

export type PracticeActionType = 'live' | 'mock' | 'biz_english';

interface PracticeActionGroupProps {
  onSelectAction: (actionType: PracticeActionType) => void;
  activeAction?: PracticeActionType | null;
  className?: string;
}

export const PracticeActionGroup: React.FC<PracticeActionGroupProps> = ({
  onSelectAction,
  activeAction,
  className = '',
}) => {
  const [hoveredAction, setHoveredAction] = useState<PracticeActionType | null>(null);

  const handleActionClick = (action: PracticeActionType) => {
    onSelectAction(action);
  };

  return (
    <div 
      className={`inline-flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs backdrop-blur-xs ${className}`}
      role="group"
      aria-label="Practice Launch Actions"
    >
      {/* 1. PRIMARY ACTION: Live Interview */}
      <button
        id="btn-practice-live-interview"
        type="button"
        onClick={() => handleActionClick('live')}
        onMouseEnter={() => setHoveredAction('live')}
        onMouseLeave={() => setHoveredAction(null)}
        className={`group relative flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
          activeAction === 'live' || (!activeAction && hoveredAction !== 'mock' && hoveredAction !== 'biz_english')
            ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700 active:bg-blue-800'
            : 'bg-blue-600/90 text-white hover:bg-blue-600'
        }`}
        title="Live Interview — Real-time interview intelligence, speaker awareness, and quiet copilot"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        <span className="whitespace-nowrap">Live Interview</span>
      </button>

      {/* 2. SECONDARY ACTION: Mock Interview */}
      <button
        id="btn-practice-mock-interview"
        type="button"
        onClick={() => handleActionClick('mock')}
        onMouseEnter={() => setHoveredAction('mock')}
        onMouseLeave={() => setHoveredAction(null)}
        className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ml-1 ${
          activeAction === 'mock'
            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 active:bg-white'
        }`}
        title="Mock Interview — Text chat practice, timed assignments, progressive guidance, and STAR evaluation"
      >
        <MessageSquare className={`w-3.5 h-3.5 ${activeAction === 'mock' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className="hidden sm:inline whitespace-nowrap">Mock Interview</span>
        <span className="sm:hidden whitespace-nowrap">Mock</span>
      </button>

      {/* 3. SECONDARY ACTION: Biz English Session */}
      <button
        id="btn-practice-biz-english"
        type="button"
        onClick={() => handleActionClick('biz_english')}
        onMouseEnter={() => setHoveredAction('biz_english')}
        onMouseLeave={() => setHoveredAction(null)}
        className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
          activeAction === 'biz_english'
            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 active:bg-white'
        }`}
        title="Biz English Session — Executive communication, timed briefing, and commercial framing"
      >
        <Globe className={`w-3.5 h-3.5 ${activeAction === 'biz_english' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className="hidden sm:inline whitespace-nowrap">Biz English</span>
        <span className="sm:hidden whitespace-nowrap">English</span>
      </button>
    </div>
  );
};
