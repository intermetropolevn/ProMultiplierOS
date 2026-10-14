import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  Edit3, 
  Minimize2, 
  Maximize2, 
  X, 
  Paperclip, 
  AtSign, 
  Check, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw,
  Layers,
  ArrowUp,
  BrainCircuit,
  FileText
} from 'lucide-react';
import { UserCareerProfile, SavedJobApplication } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  thoughtDuration?: string;
  thoughtProcess?: string[];
  sourcesCount?: number;
  sources?: string[];
}

interface AIChatLauncherProps {
  profile?: UserCareerProfile;
  savedJobs?: SavedJobApplication[];
  onOpenApplication?: (appId: string) => void;
  className?: string;
}

export const AIChatLauncher: React.FC<AIChatLauncherProps> = ({
  profile,
  savedJobs = [],
  onOpenApplication,
  className = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      role: 'user',
      content: 'Analyze my interview readiness for Stripe Backend and summarize immediate priority tasks.',
      timestamp: 'Just now'
    },
    {
      id: 'm-2',
      role: 'assistant',
      content: `Here is your Career OS intelligence briefing based on your verified knowledge profile and target pipeline:

1. **Target Fit (Stripe Platform & Backend)**
   • **Verified Strength**: High-throughput transaction processing, idempotency keys, and Kafka stream consumer architecture are fully backed by your L4 delivery proof point.
   • **Potential Calibration Risk**: Need to rehearse behavioral trade-offs regarding distributed consensus failure recovery and database deadlocks under peak load.

2. **Immediate Priority Checklist**:
   • Complete **1 Live Interview simulation** focusing on Technical Architecture.
   • Refine your opening STAR hook for the cross-functional outage post-mortem story.
   • Connect your latest proof metrics to the active Stripe application workspace.`,
      timestamp: 'Just now',
      thoughtDuration: 'Thought for 9 seconds',
      thoughtProcess: [
        'Inspected target profile: Senior Software Engineer (Fintech & Payments)',
        'Cross-referenced 4 verified proof points in Metrics Ledger',
        'Retrieved Stripe Backend rubric requirements (Latency, Idempotency, Scale)',
        'Synthesized 2 immediate high-leverage practice actions'
      ],
      sourcesCount: 12,
      sources: ['Stripe Job Spec', 'Idempotency Blueprint', 'Kafka Incident Post-Mortem', 'Domain Guide']
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isThoughtOpen, setIsThoughtOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeContextChip, setActiveContextChip] = useState<string | null>('@Profile & Stripe App');
  const [showContextPicker, setShowContextPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsThinking(true);

    // Dynamic grounded AI response simulation
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('ready') || lower.includes('readiness') || lower.includes('score')) {
        reply = `Your current Career OS **Readiness Score is ${profile?.readinessScore || 78}%**.\n\n• **Core Strengths**: Strong system architecture and verifiable metric proofs.\n• **Recommended Next Step**: Practice a Live Interview session to calibrate timing and STAR delivery under the 180s per-question budget.`;
      } else if (lower.includes('stripe') || lower.includes('fintech') || lower.includes('job')) {
        reply = `Stripe senior engineering rounds evaluate **idempotency guarantees**, **failure isolation**, and **system boundary design**.\n\nYour Answer Blueprint *"Stripe Idempotent Payment API"* is ready to be loaded into the simulator. Would you like to launch Live Interview practice now?`;
      } else if (lower.includes('star') || lower.includes('story') || lower.includes('behavioral')) {
        reply = `Your Story Bank contains **3 polished STAR stories**. The highest-rated one is *"Post-Mortem of Database Deadlock During Black Friday"*, featuring an 85% reduction in MTTR. This matches Tier-1 leadership criteria.`;
      } else {
        reply = `Based on your Career OS workspace context (${activeContextChip || 'General Workspace'}):\n\n• **Identity**: ${profile?.targetRole || 'Software Engineering'} (${profile?.targetLevel || 'Senior'})\n• **Target Domain**: ${profile?.targetDomain || 'Fintech & Payments'}\n• **Action Suggestion**: You can formulate answers directly in the **My Profile** knowledge layers or trigger a **Live Interview** from the top action group.`;
      }

      const botMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: 'Just now',
        thoughtDuration: 'Thought for 4 seconds',
        thoughtProcess: [
          'Processed user query context with workspace intelligence',
          'Queried Career OS knowledge layers and verified metrics',
          'Formatted concise, actionable guidance'
        ],
        sourcesCount: 5,
        sources: ['Profile Ledger', 'Question Rubric', 'Application Workspace']
      };

      setMessages(prev => [...prev, botMsg]);
      setIsThinking(false);
    }, 1100);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`flex flex-col bg-white/95 rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all ${
      isExpanded ? 'h-[540px]' : 'h-[390px]'
    } ${className}`}>
      
      {/* Chat Top Header */}
      <div className="p-3 sm:p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900">
              New AI Chat
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMessages([messages[0], messages[1]])}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="New Chat Session"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isExpanded ? "Collapse height" : "Expand height"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto no-scrollbar text-xs">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.role === 'user' ? (
              <div className="bg-blue-600 text-white p-2.5 rounded-2xl rounded-tr-xs max-w-[90%] shadow-2xs font-medium">
                {msg.content}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs p-3 max-w-[96%] space-y-2 text-slate-800">
                
                {/* Thought process accordion */}
                {msg.thoughtDuration && (
                  <div className="border-b border-slate-200/60 pb-2">
                    <button
                      type="button"
                      onClick={() => setIsThoughtOpen(prev => !prev)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>{msg.thoughtDuration}</span>
                      {isThoughtOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>

                    {isThoughtOpen && msg.thoughtProcess && (
                      <ul className="mt-1.5 space-y-1 pl-4 border-l-2 border-indigo-200 text-[10px] text-slate-500 font-mono">
                        {msg.thoughtProcess.map((step, idx) => (
                          <li key={idx}>• {step}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Sources chip */}
                {msg.sourcesCount && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-600 shadow-3xs">
                      <Layers className="w-2.5 h-2.5 text-blue-500" />
                      <span>{msg.sourcesCount} workspace results</span>
                    </span>
                  </div>
                )}

                {/* Body content */}
                <div className="whitespace-pre-line leading-relaxed text-[11px] font-normal text-slate-700">
                  {msg.content}
                </div>

                {/* Action feedback tools */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
                    Share feedback
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="hover:text-slate-700 p-1 rounded-sm"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button type="button" className="hover:text-slate-700 p-1 rounded-sm" title="Helpful">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button type="button" className="hover:text-slate-700 p-1 rounded-sm" title="Not helpful">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleSendMessage()}
                      className="hover:text-slate-700 p-1 rounded-sm" 
                      title="Regenerate"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70 max-w-[70%]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="font-medium animate-pulse">Career OS synthesizing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Context mentions tag row */}
      <div className="px-3 py-1.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {activeContextChip ? (
            <span className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded-md font-semibold shrink-0">
              <AtSign className="w-2.5 h-2.5" />
              <span>{activeContextChip}</span>
              <button 
                type="button" 
                onClick={() => setActiveContextChip(null)} 
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                ×
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setActiveContextChip('@Stripe Backend & Profile')}
              className="text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <AtSign className="w-3 h-3" />
              <span>Press @ to add context</span>
            </button>
          )}
        </div>

        <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">
          Auto Intelligence
        </span>
      </div>

      {/* Chat Input Field */}
      <div className="p-2.5 sm:p-3 bg-white border-t border-slate-100">
        <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 bg-slate-50 rounded-2xl border border-slate-200 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <button
            type="button"
            onClick={() => setActiveContextChip(activeContextChip ? null : '@Active Workspace')}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
            title="Attach workspace context"
          >
            <AtSign className="w-3.5 h-3.5" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Write, or press '@' to add context..."
            className="flex-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
          />

          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
            title="Attach note or PDF"
          >
            <Paperclip className="w-3.5 h-3.5" />
          </button>

          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              inputValue.trim() && !isThinking
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Send prompt"
          >
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </form>
      </div>

    </div>
  );
};
