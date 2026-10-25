import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Lightbulb, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { UserCareerProfile, InterviewQuestion } from '../../types';
import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';

interface AIDashboardWorkspaceProps {
  profile: UserCareerProfile;
  onStartPracticeQuestion?: (question: InterviewQuestion) => void;
  onNavigateToTab?: (tab: string) => void;
  pinnedContextSummary?: string;
  className?: string;
}

interface AIInsightCard {
  id: string;
  type: 'star_synthesis' | 'interview_diagnostic' | 'communication_polish';
  title: string;
  subtitle: string;
  badge: string;
  actionLabel: string;
  payloadText: string;
  questionPayload?: InterviewQuestion;
}

export const AIDashboardWorkspace: React.FC<AIDashboardWorkspaceProps> = ({
  profile,
  onStartPracticeQuestion,
  onNavigateToTab,
  className = '',
}) => {
  const { getIntelligenceAccess, consumeDemoIntelligenceSignal } = useAccessControl();
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [gateModalOpen, setGateModalOpen] = useState(false);
  const [activeResponse, setActiveResponse] = useState<{
    prompt: string;
    content: string;
    keyTakeaway: string;
    recommendedActions: string[];
  } | null>(null);

  const insightsAccess = getIntelligenceAccess('ai_career_insights');
  const isFull = insightsAccess.isFull;

  // Proactive Insights derived from user target calibration & pinned context
  const proactiveInsights: AIInsightCard[] = [
    {
      id: 'insight-1',
      type: 'star_synthesis',
      title: 'Synthesize STAR Narrative from Pinned Notes',
      subtitle: 'Your pinned note on distributed idempotency can be formulated into a Staff-level STAR answer with quantifiable MTTR metrics.',
      badge: 'STAR Synthesis',
      actionLabel: 'Preview STAR Response',
      payloadText: `SITUATION: At high transaction velocity, duplicate payment events caused lock contention and occasional double debits.\nTASK: Architect an idempotent payment ingestion layer guaranteeing exactly-once semantics without sacrificing sub-50ms latency.\nACTION: Designed Redis distributed locks with exponential backoff and dual-write write-ahead logging (WAL) paired with Debezium CDC for event reconstruction.\nRESULT: Eliminated 100% of duplicate debits, dropped lock contention by 74%, and maintained 99.999% availability during peak flash sales.`,
      questionPayload: {
        id: 'q-ai-idempotency',
        question: 'How do you design a high-throughput idempotent payment gateway handling concurrent duplicate requests?',
        roleCategory: profile.targetRole || 'Software Engineering',
        domain: profile.targetDomain || 'Fintech & Payments',
        level: profile.experienceLevel || 'Lead / Staff',
        type: 'Technical Architecture',
        context: 'High-throughput payment ingestion under concurrent duplicate triggers',
        rubricCriteria: [
          { criterion: 'Idempotency Key Lifecycle & Storage', weight: 50, whatStrongCandidatesSay: 'References atomic set-if-not-exists with TTL and two-phase write ahead logging.', redFlags: 'Relies on application memory or non-atomic DB lookups.' },
          { criterion: 'Failure Mode & Split-Brain Mitigation', weight: 50, whatStrongCandidatesSay: 'Outlines quorum reads, fencing tokens, and asynchronous reconciliation loops.', redFlags: 'Ignores partial network partitions.' }
        ],
        keywordsToMention: ['Idempotency Key', 'Redis SETNX with TTL', 'Fencing Tokens', 'Outbox Pattern', 'Debezium CDC'],
        exemplaryModelAnswer: 'A robust idempotent architecture uses unique client request tokens cached in a distributed in-memory store using atomic CAS operations, with transaction outbox patterns for asynchronous event dispatching.'
      }
    },
    {
      id: 'insight-2',
      type: 'interview_diagnostic',
      title: 'Target Interview Radar: Distributed Lock Contention',
      subtitle: `System architecture interviews for ${profile.targetRole || 'Software Engineering'} at ${profile.targetDomain || 'Fintech'} routinely probe split-brain and lock timeouts.`,
      badge: 'Interview Diagnostic',
      actionLabel: 'Practice Technical Question',
      payloadText: 'Recommendation: Practice answering how to prevent stale lock renewal when garbage collection pauses occur in high-concurrency Java/Go services.',
      questionPayload: {
        id: 'q-ai-locks',
        question: 'When using distributed locks in microservices, how do you protect against split-brain scenarios caused by long GC pauses or network delays?',
        roleCategory: profile.targetRole || 'Software Engineering',
        domain: profile.targetDomain || 'Fintech & Payments',
        level: profile.experienceLevel || 'Lead / Staff',
        type: 'Technical Architecture',
        context: 'Distributed locks, GC pauses, fencing tokens, and Redlock critique',
        rubricCriteria: [
          { criterion: 'Fencing Tokens & Monotonic Counters', weight: 50, whatStrongCandidatesSay: 'Explains fencing tokens passed to downstream storage to reject stale writes.', redFlags: 'Assumes lock expiration time is safe without verification.' },
          { criterion: 'Consensus Alternatives', weight: 50, whatStrongCandidatesSay: 'Contrasts distributed locking with Raft/Paxos state machine replication.', redFlags: 'Vague conceptual answer without protocol specifics.' }
        ],
        keywordsToMention: ['Fencing Tokens', 'Martin Kleppmann Redlock critique', 'Monotonic Sequence', 'Lease Renewal'],
        exemplaryModelAnswer: 'Distributed locks without fencing tokens cannot guarantee mutual exclusion in asynchronous networks because an unannounced pause can allow a second client to acquire the lock before the first client finishes writing.'
      }
    },
    {
      id: 'insight-3',
      type: 'communication_polish',
      title: 'Executive Framing: Engineering Trade-Offs',
      subtitle: 'Refine your opening hook to translate technical latency metrics into business velocity and risk reduction.',
      badge: 'Executive Polish',
      actionLabel: 'View Executive Phrasing',
      payloadText: 'Instead of saying "We reduced latency by 30ms with caching", say: "By eliminating database roundtrips on the checkout hotpath, we unlocked 14% higher checkout conversion while shielding backend services from downstream vendor spikes."'
    }
  ];

  const visibleInsights = isFull
    ? proactiveInsights
    : insightsAccess.isDemo
    ? proactiveInsights.slice(0, 2)
    : proactiveInsights.slice(0, 1);

  const handleRunInsight = (insight: AIInsightCard) => {
    if (insightsAccess.isGuest) {
      setGateModalOpen(true);
      return;
    }
    if (insightsAccess.isDemo) {
      const ok = consumeDemoIntelligenceSignal('ai_career_insights', insight.id);
      if (!ok) {
        setGateModalOpen(true);
        return;
      }
    }
    if (insight.questionPayload && onStartPracticeQuestion) {
      onStartPracticeQuestion(insight.questionPayload);
    } else {
      setActiveResponse({
        prompt: insight.title,
        content: insight.payloadText,
        keyTakeaway: insight.subtitle,
        recommendedActions: [
          'Add to Question & Answer Blueprints',
          'Practice live with simulated voice interviewer',
          'Pin to Your Pins workspace desk'
        ]
      });
    }
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (insightsAccess.isGuest) {
      setGateModalOpen(true);
      return;
    }
    if (!query.trim()) return;

    if (insightsAccess.isDemo) {
      const ok = consumeDemoIntelligenceSignal('ai_career_insights', `ask-${query.trim().slice(0, 24)}`);
      if (!ok) {
        setGateModalOpen(true);
        return;
      }
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setActiveResponse({
        prompt: query,
        content: `Based on your target calibration as a ${profile.targetRole || 'Staff Platform Architect'} (${profile.targetDomain || 'Fintech & Payments'}), here is the recommended structure:\n\n1. OPENING ANCHOR: State the core business constraint and operational scale (e.g. 15,000 TPS, 99.999% SLA).\n2. ARCHITECTURAL DECISION: Detail the primary trade-off made between consistency and availability (e.g. event-driven saga pattern vs two-phase commit).\n3. PRODUCTION OUTCOME: Conclude with hard metrics—sub-50ms p99 latency, zero financial discrepancies over 12 months.`,
        keyTakeaway: 'Lead with the architectural invariant you preserved rather than generic technology names.',
        recommendedActions: [
          'Convert into an interview blueprint',
          'Test in Live Interview workspace',
          'Review against rubric benchmarks'
        ]
      });
      setQuery('');
    }, 600);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`bg-white rounded-2xl border border-purple-200/90 shadow-2xs p-5 sm:p-6 space-y-5 relative overflow-hidden transition-all ${className}`}>
      {/* Background Subtle Gradient Aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200/80 shadow-3xs">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                AI Career Intelligence Workspace
              </h3>
              <IntelligenceModeBadge capability="ai_career_insights" />
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80">
                Contextual Copilot
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Continuous synthesis anchored to your target role ({profile.targetRole || 'Software Engineering'}) and pinned context.
            </p>
          </div>
        </div>

        {onNavigateToTab && (
          <button
            type="button"
            onClick={() => onNavigateToTab('qa_blueprints')}
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Explore Q&amp;A Blueprints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Proactive Intelligence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
        {visibleInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-xl border border-slate-200/80 hover:border-purple-300 bg-slate-50/50 hover:bg-white transition-all shadow-3xs hover:shadow-2xs flex flex-col justify-between group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-2xs font-semibold text-slate-500">
                <span className="text-purple-700 font-bold uppercase tracking-wider text-[10px]">
                  {insight.badge}
                </span>
                <Lightbulb className="w-3 h-3 text-amber-500 opacity-80" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                {insight.title}
              </h4>
              <p className="text-2xs text-slate-500 leading-relaxed line-clamp-3">
                {insight.subtitle}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleRunInsight(insight)}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{insight.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!isFull && (
        <div className="relative z-10">
          <CareerOSIntelligenceGate
            capability="ai_career_insights"
            variant="compact"
            sampleCountLabel={`Showing ${visibleInsights.length} of ${proactiveInsights.length} AI career insights`}
          />
        </div>
      )}

      {/* Active AI Response Preview if generated/clicked */}
      {activeResponse && (
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/90 space-y-3 animate-in fade-in relative z-10 shadow-3xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="text-xs font-bold text-purple-950">
                {activeResponse.prompt}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(activeResponse.content, 'active-resp')}
              className="p-1 text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-lg text-2xs flex items-center gap-1 cursor-pointer"
              title="Copy to clipboard"
            >
              {copiedId === 'active-resp' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap bg-white/80 p-3 rounded-lg border border-purple-100 shadow-3xs">
            {activeResponse.content}
          </pre>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-2xs text-purple-900 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>{activeResponse.keyTakeaway}</span>
            </div>
            <div className="flex items-center gap-2">
              {onStartPracticeQuestion && (
                <button
                  type="button"
                  onClick={() => {
                    const q: InterviewQuestion = {
                      id: `q-gen-${Date.now()}`,
                      question: activeResponse.prompt,
                      roleCategory: profile.targetRole || 'Software Engineering',
                      domain: profile.targetDomain || 'Fintech & Payments',
                      level: profile.experienceLevel || 'Lead / Staff',
                      type: 'Technical Architecture',
                      context: activeResponse.keyTakeaway,
                      rubricCriteria: [
                        { criterion: 'Technical Architecture & Idempotency', weight: 50, whatStrongCandidatesSay: 'Demonstrates distributed consensus and failure modes.', redFlags: 'Vague design.' },
                        { criterion: 'Quantified Production Outcomes', weight: 50, whatStrongCandidatesSay: 'References hard metrics and reliability SLA.', redFlags: 'No metrics.' }
                      ],
                      keywordsToMention: ['Distributed Architecture', 'Consistency', 'Idempotency'],
                      exemplaryModelAnswer: activeResponse.content
                    };
                    onStartPracticeQuestion(q);
                  }}
                  className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-2xs font-semibold cursor-pointer shadow-3xs"
                >
                  Practice This Answer →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive AI Prompt Query Bar */}
      <form onSubmit={handleAskAI} className="relative z-10 flex items-center gap-2">
        <div className="relative flex-1">
          <Sparkles className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask CareerOS Copilot (e.g. "How should I frame Kafka consumer rebalance in my ${profile.targetRole || 'Software Engineering'} interview?")...`}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 focus:border-purple-400 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-100 transition-all text-slate-800 placeholder:text-slate-400 shadow-3xs"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-3xs shrink-0 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isGenerating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>Synthesize</span>
        </button>
      </form>

      {gateModalOpen && (
        <CareerOSIntelligenceGate
          capability="ai_career_insights"
          variant="modal"
          onClose={() => setGateModalOpen(false)}
        />
      )}
    </div>
  );
};
