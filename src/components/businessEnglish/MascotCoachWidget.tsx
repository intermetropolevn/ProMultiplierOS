import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  ArrowRight, 
  BookOpen, 
  RotateCcw, 
  MessageSquare, 
  CheckCircle2,
  X,
  Volume2
} from 'lucide-react';
import { BusinessEnglishService } from '../../features/businessEnglish/services/businessEnglishService';

interface MascotCoachWidgetProps {
  activeTab?: string;
  scenarioTitle?: string;
  onNavigateTab?: (tab: any) => void;
  onSelectScenario?: (scenarioId: string) => void;
  className?: string;
}

export const MascotCoachWidget: React.FC<MascotCoachWidgetProps> = ({
  activeTab = 'role_play',
  scenarioTitle,
  onNavigateTab,
  onSelectScenario,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAskingPhrase, setIsAskingPhrase] = useState(false);
  const [inputPhrase, setInputPhrase] = useState('');
  const [suggestedRefinement, setSuggestedRefinement] = useState<{
    original: string;
    professional: string;
    executive: string;
    why: string;
  } | null>(null);

  // Contextual coaching tips based on active tab
  const getContextualTip = () => {
    switch (activeTab) {
      case 'role_play':
        return {
          title: "Leading with BLUF (Bottom Line Up Front)",
          tip: "In executive syncs, state your recommendation or key outcome in the first sentence. Context is secondary.",
          example: "'BLUF: We recommend shipping Phase 1 next week to avoid a 3-week dependency slip.'"
        };
      case 'vocabulary':
        return {
          title: "Context Over Memorization",
          tip: "Don't memorize isolated words. Group them into workplace situations like 'Scope Governance' or 'Executive Reviews'.",
          example: "Pair 'scope creep' with 'push back' and 'trade-offs' for natural usage."
        };
      case 'shadow_speaking':
        return {
          title: "Pause on Punctuation, Not Mid-Clause",
          tip: "Native business speakers group words into rhythmic chunks. Inhale briefly after clauses rather than after every two words.",
          example: "[Thanks everyone] [for hopping on right at the top of the hour.]"
        };
      case 'topics':
        return {
          title: "Turn Discussion Points into Stories",
          tip: "When discussing topics like AI adoption or tech debt, anchor your opinions in past real-world project outcomes.",
          example: "'In our previous migration, we found that developer guardrails actually increased shipping cadence.'"
        };
      case 'domain_knowledge':
        return {
          title: "Speak in Business Levers",
          tip: "Connect technical architecture directly to commercial metrics: latency, churn, SLA, or infrastructure cost.",
          example: "'Idempotency isn't just clean code; it prevents duplicate billing disputes.'"
        };
      case 'communication_patterns':
        return {
          title: "The Escalation of Seniority",
          tip: "Notice how senior phrasing doesn't sound more complicated—it sounds more risk-aware and solution-led.",
          example: "Shift from 'I don't agree' to 'Based on the telemetry, here is the exposure I see.'"
        };
      default:
        return {
          title: "Welcome to Business English Studio",
          tip: "Practice realistic workplace scenarios, learn contextual vocabulary, and master senior executive phrasing.",
          example: "Ready to calibrate your business communication?"
        };
    }
  };

  const currentTip = getContextualTip();

  const handleRefinePhrase = () => {
    if (!inputPhrase.trim()) return;

    // Fast contextual rule-based refinement engine
    const text = inputPhrase.trim();
    const lower = text.toLowerCase();

    let professional = `I'd recommend we review our capacity before proceeding with this request.`;
    let executive = `Based on our current strategic commitments, taking this on introduces material delivery risk. I suggest we phase this into our next milestone.`;
    let why = "Replaces informal or blunt phrasing with objective capacity constraints and a constructive phased release.";

    if (lower.includes('disagree') || lower.includes("don't think") || lower.includes("bad idea")) {
      professional = "I'm not sure I fully agree with that approach because of the delivery timeline.";
      executive = "I understand the commercial intent behind this date. However, moving forward without automated failover creates significant SLA exposure. I recommend we phase the rollout into two releases.";
      why = "Acknowledges the commercial intent first, quantifies the SLA exposure, and offers a two-stage release.";
    } else if (lower.includes('delay') || lower.includes('late') || lower.includes('slow')) {
      professional = "We are currently tracking a few days behind our initial estimate due to third-party integration blockers.";
      executive = "BLUF: We are tracking 7 days behind plan due to vendor API rate limits. We have mitigated this by deploying mock stubs, keeping frontend development unblocked.";
      why = "Uses BLUF (Bottom Line Up Front) and highlights active mitigation rather than just passive delay.";
    } else if (lower.includes('want') || lower.includes('need') || lower.includes('give me')) {
      professional = "Could we align on the necessary resources and timeline to prioritize this deliverable?";
      executive = "To ensure high-fidelity execution, what is the target business impact of this initiative relative to our current Q3 OKRs?";
      why = "Elevates the request into high-level business alignment and quarterly objectives.";
    } else {
      professional = `To ensure we're aligned on this: ${text.charAt(0).toUpperCase() + text.slice(1)}.`;
      executive = `From an executive perspective, our priority is ensuring high reliability while delivering: ${text.toLowerCase()}.`;
      why = "Frames the point with executive polish, active alignment, and commercial clarity.";
    }

    setSuggestedRefinement({
      original: text,
      professional,
      executive,
      why
    });
  };

  return (
    <aside 
      aria-label="Lexi AI Business English Coach"
      className={`bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-3xl p-5 border border-indigo-800/60 shadow-lg transition-all ${className}`}
    >
      {/* Top Bar: Mascot Avatar, Title, and Collapse Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-400 p-0.5 shadow-md flex items-center justify-center">
              <span className="text-xl">🦊</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white tracking-tight">
                Lexi <span className="text-indigo-300 font-medium">• Business English Coach</span>
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-bold uppercase tracking-wider">
                Active AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Personalized workplace communication guidance & real-time rephrasing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAskingPhrase(!isAskingPhrase)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs font-bold transition-colors border border-indigo-400/30 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Rephrase Phrase</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? "Collapse Coach" : "Expand Coach Guidance"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Coach Context Tip */}
      <div className="mt-3.5 pt-3.5 border-t border-indigo-800/40">
        <div className="flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-200">
              {currentTip.title}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTip.tip}
            </p>
            {currentTip.example && (
              <p className="text-[11px] text-indigo-300/90 font-mono bg-indigo-900/40 px-2.5 py-1.5 rounded-lg border border-indigo-800/50 mt-1">
                {currentTip.example}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Mode: Interactive Rephrasing Tool & Quick Suggestions */}
      {(isExpanded || isAskingPhrase) && (
        <div className="mt-4 pt-4 border-t border-indigo-800/40 space-y-4 animate-in fade-in duration-150">
          
          {/* Interactive Rephrase Input */}
          <div className="space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-indigo-900/80">
            <label className="text-xs font-bold text-indigo-200 flex items-center justify-between">
              <span>Ask Lexi: "How would a Senior Leader say this?"</span>
              <span className="text-[10px] text-slate-400 font-normal">Type informal phrase</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputPhrase}
                onChange={(e) => setInputPhrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRefinePhrase()}
                placeholder="e.g. I don't agree with this deadline, it's impossible..."
                className="flex-1 bg-slate-950 border border-indigo-800/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-400 font-sans"
              />
              <button
                type="button"
                onClick={handleRefinePhrase}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <span>Polish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-medium">Try:</span>
              {[
                "I can't finish this on time",
                "I don't think this is a good idea",
                "Give me more details"
              ].map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputPhrase(example);
                  }}
                  className="text-[10px] text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900 px-2 py-0.5 rounded-md border border-indigo-800/60 transition-colors cursor-pointer"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          {/* Rephrasing Output Card */}
          {suggestedRefinement && (
            <div className="bg-slate-950/90 rounded-2xl p-4 border border-indigo-700/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Lexi's Multi-Tier Phrasing Analysis
                </span>
                <button
                  type="button"
                  onClick={() => setSuggestedRefinement(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Original */}
              <div className="text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">You wrote:</span>
                <p className="text-slate-300 line-through mt-0.5 font-medium">"{suggestedRefinement.original}"</p>
              </div>

              {/* Level 1: Professional */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-blue-400">Professional (Direct & Courteous)</span>
                  <button
                    type="button"
                    onClick={() => BusinessEnglishService.speak(suggestedRefinement.professional)}
                    className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                    title="Listen to audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-100 font-medium leading-relaxed">
                  "{suggestedRefinement.professional}"
                </p>
              </div>

              {/* Level 2: Executive */}
              <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-400">Senior Executive (Strategic & Risk-Aware)</span>
                  <button
                    type="button"
                    onClick={() => BusinessEnglishService.speak(suggestedRefinement.executive)}
                    className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                    title="Listen to audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-amber-100 font-medium leading-relaxed">
                  "{suggestedRefinement.executive}"
                </p>
              </div>

              {/* Why it works */}
              <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Why this works:</strong> {suggestedRefinement.why}</span>
              </div>
            </div>
          )}

          {/* Quick Learning Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('communication_patterns')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                Senior Patterns
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                Basic → Senior Ladders
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('shadow_speaking')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                Shadow Speaking
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                Rhythm & Intonation
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('vocabulary')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                My Practice Sets
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                Custom Vocabulary
              </p>
            </button>
          </div>

        </div>
      )}
    </aside>
  );
};
