import React, { useState, useEffect, useRef } from 'react';
import { 
  Pause, 
  Play, 
  Square, 
  ChevronDown, 
  Sparkles, 
  AlertCircle, 
  Mic, 
  Sliders, 
  CheckCircle2, 
  ArrowUpRight, 
  Zap 
} from 'lucide-react';
import { RealtimePipelineCoordinator } from '../RealtimePipelineCoordinator';
import { 
  SpeechState, 
  DetectedQuestionResult, 
  RoleCategory, 
  SectorDomain 
} from '../types';
import { AnswerGuidanceOutput } from '../knowledge/AnswerGuidanceService';
import { CandidateEvidenceModal } from './CandidateEvidenceModal';
import { InterviewQuestion } from '../../../types';
import { SessionMemoryService, SessionMemoryData } from '../memory/SessionMemoryService';
import { EvidenceRankingService, AnswerCoverageStatus } from '../knowledge/EvidenceRankingService';
import { PersonalKnowledgeService } from '../knowledge/PersonalKnowledgeService';

interface LiveIntelligencePanelProps {
  roleCategory?: RoleCategory;
  domain?: SectorDomain;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  currentInterviewQuestion?: InterviewQuestion;
  onIntelligenceUpdate?: (data: {
    matchPct: number;
    intent: string;
    hasStrongMatch: boolean;
    blueprintAvailable: boolean;
    blueprint?: any;
    rawQuestionText?: string;
  }) => void;
}

export const LiveIntelligencePanel: React.FC<LiveIntelligencePanelProps> = ({
  roleCategory,
  domain,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
  currentInterviewQuestion,
  onIntelligenceUpdate,
}) => {
  const [speechState, setSpeechState] = useState<SpeechState>('LISTENING');
  const [recentTranscript, setRecentTranscript] = useState<string>("Okay, let's move on to...");
  const [detectedResult, setDetectedResult] = useState<DetectedQuestionResult | null>(null);
  const [guidance, setGuidance] = useState<AnswerGuidanceOutput | null>(null);
  
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [showSimTester, setShowSimTester] = useState(false);
  const [testInputText, setTestInputText] = useState('');
  const [sessionMemory, setSessionMemory] = useState<SessionMemoryData>(() => SessionMemoryService.getMemory());
  const [activeTab, setActiveTab] = useState<'guidance' | 'evidence' | 'session'>('guidance');

  // Subscribe to Session Memory changes
  useEffect(() => {
    const unsubscribe = SessionMemoryService.subscribe((mem) => {
      setSessionMemory(mem);
    });
    return unsubscribe;
  }, []);

  const coordinatorRef = useRef<RealtimePipelineCoordinator | null>(null);

  // Initialize pipeline coordinator
  useEffect(() => {
    const coordinator = new RealtimePipelineCoordinator(
      {
        onStateChange: (state: SpeechState) => {
          setSpeechState(state);
        },
        onVolumeChange: () => {},
        onPartialTranscript: (text: string) => {
          if (text.trim()) {
            setRecentTranscript(text.trim());
          }
        },
        onQuestionDetected: (result: DetectedQuestionResult, guide: AnswerGuidanceOutput) => {
          setDetectedResult(result);
          setGuidance(guide);
        },
      },
      { targetRole: roleCategory, targetDomain: domain }
    );

    coordinatorRef.current = coordinator;

    // Start in active listening mode by default
    coordinator.startListening().catch(() => {});

    return () => {
      coordinator.stopListening();
    };
  }, [roleCategory, domain]);

  // Synchronize when active interview question changes
  useEffect(() => {
    if (currentInterviewQuestion?.question && coordinatorRef.current) {
      handleSimulateQuestion(currentInterviewQuestion.question);
    }
  }, [currentInterviewQuestion?.id, currentInterviewQuestion?.question]);

  // Notify parent of intelligence updates
  useEffect(() => {
    if (!onIntelligenceUpdate) return;
    if (detectedResult) {
      const raw = (detectedResult.rawText || '').toLowerCase();
      const isAmbiguity = guidance?.matchCategory === 'NO STRONG MATCH' || 
        detectedResult.matchConfidence < 0.65 || 
        raw.includes('without enough information') || 
        raw.includes('difficult decision');

      const matchPct = isAmbiguity ? 54 : (Math.round(detectedResult.matchConfidence * 100) || 94);
      const isStrong = !isAmbiguity && detectedResult.matchConfidence >= 0.65;
      
      onIntelligenceUpdate({
        matchPct,
        intent: isAmbiguity 
          ? 'Decision Making Under Ambiguity' 
          : (detectedResult.intentLabel || 'Behavioral / Stakeholder Conflict'),
        hasStrongMatch: isStrong,
        blueprintAvailable: isStrong,
        blueprint: guidance?.blueprint,
        rawQuestionText: detectedResult.rawText,
      });
    } else if (currentInterviewQuestion) {
      onIntelligenceUpdate({
        matchPct: 94,
        intent: 'Behavioral / Stakeholder Conflict',
        hasStrongMatch: true,
        blueprintAvailable: true,
        rawQuestionText: currentInterviewQuestion.question,
      });
    }
  }, [detectedResult, guidance, currentInterviewQuestion, onIntelligenceUpdate]);

  // Handlers for audio control
  const handlePause = () => {
    if (coordinatorRef.current) {
      coordinatorRef.current.pauseListening();
      setSpeechState('PAUSED');
    }
  };

  const handleResume = () => {
    if (coordinatorRef.current) {
      coordinatorRef.current.resumeListening();
      setSpeechState('LISTENING');
    }
  };

  const handleStop = () => {
    if (coordinatorRef.current) {
      coordinatorRef.current.stopListening();
      setSpeechState('IDLE');
    }
  };

  const handleStart = async () => {
    if (coordinatorRef.current) {
      await coordinatorRef.current.startListening();
      setSpeechState('LISTENING');
    }
  };

  // Trigger question simulation
  const handleSimulateQuestion = (questionText: string) => {
    if (coordinatorRef.current) {
      setRecentTranscript(questionText);
      coordinatorRef.current.simulateInterviewerQuestion(questionText);
    }
  };

  // Reset to quiet listening state
  const handleResetToListening = () => {
    setDetectedResult(null);
    setGuidance(null);
    setRecentTranscript("Okay, let's move on to...");
    if (speechState === 'IDLE' || speechState === 'PAUSED') {
      handleStart();
    }
  };

  const isListening = speechState === 'LISTENING' || speechState === 'INTERVIEWER_SPEAKING' || speechState === 'PROCESSING' || speechState === 'MATCHED' || speechState === 'NO_MATCH';
  const isPaused = speechState === 'PAUSED';

  // Compute Guidance structured data
  const computeGlanceData = () => {
    if (!detectedResult) {
      return null;
    }

    const raw = (detectedResult.rawText || '').toLowerCase();
    const intentLabel = (detectedResult.intentLabel || '').toUpperCase();
    const matchPct = Math.round(detectedResult.matchConfidence * 100);

    // Follow-up check: "What would you do differently?"
    const isFollowUp = Boolean(
      detectedResult.contextState?.isFollowUp ||
      raw.includes('differently') ||
      raw.includes('do it again') ||
      raw.includes('looking back') ||
      intentLabel.includes('FOLLOW-UP') ||
      detectedResult.semanticIntent === 'Follow-up'
    );

    // Get ranked candidate evidence
    let rankedEvidence: Array<{
      title: string;
      relevancePct: number;
      relevanceReason: string;
      hasMetrics: boolean;
      metricPriorityApplied?: boolean;
      metricPriorityReason?: string;
      metrics?: string[];
    }> = [];

    if (detectedResult.relevantExperienceList && detectedResult.relevantExperienceList.length > 0) {
      rankedEvidence = detectedResult.relevantExperienceList.map(item => ({
        title: item.evidence.title,
        relevancePct: item.relevancePct ?? Math.round(item.confidence * 100),
        relevanceReason: item.relevanceReason || (item.evidence.metrics && item.evidence.metrics.length > 0
          ? `Strong match because this story includes: ${item.evidence.skills.slice(0, 2).join(' + ')} + measurable outcome.`
          : `Match based on: ${item.evidence.skills.slice(0, 2).join(' + ')}.`),
        hasMetrics: item.hasMetrics ?? Boolean(item.evidence.metrics && item.evidence.metrics.length > 0 && item.evidence.metrics.some(m => /\d/.test(m) && !m.toLowerCase().includes('add a concrete metric'))),
        metricPriorityApplied: item.metricPriorityApplied,
        metricPriorityReason: item.metricPriorityReason,
        metrics: item.evidence.metrics,
      }));
    } else {
      const retrieved = PersonalKnowledgeService.retrieveRelevantEvidence(
        detectedResult.semanticIntent,
        detectedResult.rawText,
        detectedResult.competencies
      );
      rankedEvidence = retrieved.topEvidence.map(item => ({
        title: item.evidence.title,
        relevancePct: item.relevancePct ?? Math.round(item.confidence * 100),
        relevanceReason: item.relevanceReason || 'Relevant experience based on competencies and context.',
        hasMetrics: item.hasMetrics ?? Boolean(item.evidence.metrics && item.evidence.metrics.length > 0 && item.evidence.metrics.some(m => /\d/.test(m) && !m.toLowerCase().includes('add a concrete metric'))),
        metricPriorityApplied: item.metricPriorityApplied,
        metricPriorityReason: item.metricPriorityReason,
        metrics: item.evidence.metrics,
      }));
    }

    const bestStoryItem = rankedEvidence[0] || {
      title: guidance?.bestStoryTitle || 'CRM Workflow Redesign',
      relevancePct: matchPct || 94,
      relevanceReason: 'Strong match because this story includes: workflow redesign + stakeholder coordination + measurable outcome.',
      hasMetrics: true,
      metricPriorityApplied: false,
      metricPriorityReason: '',
    };

    const secondaryStoryItem = rankedEvidence[1] || null;

    const answerCoverage: AnswerCoverageStatus = detectedResult.answerCoverage || 
      EvidenceRankingService.evaluateAnswerCoverage(detectedResult.answerBlueprint || (guidance?.blueprint as any));

    const metricPriorityApplied = Boolean(detectedResult.metricPriorityApplied || bestStoryItem.metricPriorityApplied);
    const metricPriorityMessage = detectedResult.metricPriorityMessage || bestStoryItem.metricPriorityReason || 'Recommended because measurable outcome is available.';

    if (isFollowUp) {
      const relatedTo = detectedResult.contextState?.relatedToIntent || 'Stakeholder Conflict';
      return {
        isFollowUp: true,
        matchPct: 91,
        intent: 'FOLLOW-UP',
        relatedTo,
        bestStory: bestStoryItem.title,
        bestStoryRelevancePct: 91,
        bestStoryReason: bestStoryItem.relevanceReason,
        bestStoryHasMetrics: bestStoryItem.hasMetrics,
        metricPriorityApplied: false,
        metricPriorityMessage,
        rankedEvidence,
        secondaryStory: secondaryStoryItem ? { title: secondaryStoryItem.title, score: secondaryStoryItem.relevancePct } : undefined,
        answerCoverage,
        keyPoints: [
          'Scope conflict',
          'Engineering constraint',
          'Reframed problem',
          'Trade-off',
          'Result'
        ],
        reminder: 'Quantify the impact.'
      };
    }

    if (raw.includes('disagree') || raw.includes('conflict') || intentLabel.includes('CONFLICT')) {
      return {
        matchPct: matchPct || 94,
        intent: 'STAKEHOLDER CONFLICT',
        bestStory: bestStoryItem.title,
        bestStoryRelevancePct: bestStoryItem.relevancePct || 94,
        bestStoryReason: bestStoryItem.relevanceReason,
        bestStoryHasMetrics: bestStoryItem.hasMetrics,
        metricPriorityApplied,
        metricPriorityMessage,
        rankedEvidence,
        secondaryStory: secondaryStoryItem ? { title: secondaryStoryItem.title, score: secondaryStoryItem.relevancePct } : undefined,
        answerCoverage,
        keyPoints: [
          'Scope conflict',
          'Engineering constraint',
          'Reframed problem',
          'Trade-off',
          'Result'
        ],
        reminder: 'Quantify the impact.'
      };
    }

    if (guidance?.matchCategory === 'NO STRONG MATCH' || detectedResult.matchConfidence < 0.65 || raw.includes('data') || raw.includes('ambiguity')) {
      return {
        matchPct: matchPct || 54,
        intent: 'DECISION UNDER AMBIGUITY',
        bestStory: bestStoryItem.title,
        bestStoryRelevancePct: bestStoryItem.relevancePct || 54,
        bestStoryReason: bestStoryItem.relevanceReason,
        bestStoryHasMetrics: bestStoryItem.hasMetrics,
        metricPriorityApplied,
        metricPriorityMessage,
        rankedEvidence,
        secondaryStory: secondaryStoryItem ? { title: secondaryStoryItem.title, score: secondaryStoryItem.relevancePct } : undefined,
        answerCoverage,
        keyPoints: [
          'Scope uncertainty',
          'Proxy metrics identified',
          'Working assumption',
          'Reversible trade-off',
          'Early validation cohort'
        ],
        reminder: 'State your working assumption upfront.'
      };
    }

    const points: string[] = [];
    if (guidance?.blueprint) {
      points.push('Scope & problem context');
      points.push('Key technical constraint');
      if (guidance.blueprint.action?.[0]) {
        points.push(guidance.blueprint.action[0].split(' ').slice(0, 3).join(' '));
      } else {
        points.push('Collaborative decision');
      }
      points.push('Evaluated trade-off');
      points.push('Quantified outcome');
    } else {
      points.push('Problem context', 'Core constraint', 'Action taken', 'Trade-off', 'Result');
    }

    return {
      matchPct: matchPct || 92,
      intent: intentLabel || 'PRODUCT WORKFLOW & PROCESS OPTIMIZATION',
      bestStory: bestStoryItem.title,
      bestStoryRelevancePct: bestStoryItem.relevancePct || 94,
      bestStoryReason: bestStoryItem.relevanceReason,
      bestStoryHasMetrics: bestStoryItem.hasMetrics,
      metricPriorityApplied,
      metricPriorityMessage,
      rankedEvidence,
      secondaryStory: secondaryStoryItem ? { title: secondaryStoryItem.title, score: secondaryStoryItem.relevancePct } : undefined,
      answerCoverage,
      keyPoints: points.slice(0, 5),
      reminder: 'Quantify the impact.'
    };
  };

  const glanceData = computeGlanceData();
  
  const isNoMatch = Boolean(
    detectedResult && !glanceData?.isFollowUp && (
      guidance?.matchCategory === 'NO STRONG MATCH' || 
      detectedResult.matchConfidence < 0.65 ||
      detectedResult.retrievalMatchState === 'No Strong Match' ||
      !detectedResult.matchedQuestion ||
      (detectedResult.rawText && detectedResult.rawText.toLowerCase().includes('without enough information')) ||
      (detectedResult.rawText && detectedResult.rawText.toLowerCase().includes('difficult decision')) ||
      (detectedResult.rawText && detectedResult.rawText.toLowerCase().includes('without enough data'))
    )
  );

  const noMatchData = {
    interviewerQuestion: detectedResult?.rawText || "Tell me about a time you had to make a difficult decision without enough information.",
    intent: guidance?.intentLabel || 'Decision Making Under Ambiguity',
    competencies: guidance?.relevantCompetencies && guidance.relevantCompetencies.length > 0
      ? guidance.relevantCompetencies
      : ['Decision Making', 'Structured Thinking', 'Risk Assessment'],
    relevantExperience: guidance?.relevantExperience && guidance.relevantExperience.length > 0
      ? guidance.relevantExperience
      : [
          { title: 'CRM Migration', confidencePct: 89, metrics: ['12M customer records synchronized', '0 seconds unplanned downtime', '99.999% verification parity'] },
          { title: 'SEO Migration', confidencePct: 81, metrics: [] },
          { title: 'Partnership', confidencePct: 72, metrics: [] },
        ],
    answerDirectionStages: guidance?.answerDirectionStages && guidance.answerDirectionStages.length > 0
      ? guidance.answerDirectionStages
      : [
          { stage: 'OPENING', guidance: 'Set the ambiguous context.' },
          { stage: 'DECISION', guidance: 'Explain what you chose.' },
          { stage: 'REASONING', guidance: 'Explain what evidence you used.' },
          { stage: 'TRADE-OFF', guidance: 'Explain what you sacrificed.' },
          { stage: 'RESULT', guidance: 'Use a real measurable outcome if available.' },
        ],
    missingEvidence: guidance?.missingEvidence || {
      warning: 'Quantified outcome not found.',
      instruction: 'Add a concrete metric if you have one.',
    }
  };

  return (
    <div id="live-intelligence-panel" className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col transition-all duration-200 ${className}`}>
      
      {/* ==================================================
          PANEL HEADER: COMPACT CONTROLS
          ================================================== */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3 bg-white">
        <div>
          <h2 className="text-xs font-black tracking-wider text-slate-900 uppercase">
            LIVE GUIDANCE
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[11px]">
            {isListening ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Listening
              </span>
            ) : isPaused ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Paused
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                Stopped
              </span>
            )}
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-1.5">
          {isListening ? (
            <button
              id="live-intel-pause-btn"
              type="button"
              onClick={handlePause}
              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              title="Pause Listening"
            >
              <Pause className="w-3 h-3 text-slate-500" />
              <span>Pause</span>
            </button>
          ) : isPaused ? (
            <button
              id="live-intel-resume-btn"
              type="button"
              onClick={handleResume}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-100 shadow-2xs transition-colors cursor-pointer"
              title="Resume Listening"
            >
              <Play className="w-3 h-3 text-emerald-600" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              id="live-intel-start-btn"
              type="button"
              onClick={handleStart}
              className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center gap-1 hover:bg-blue-100 shadow-2xs transition-colors cursor-pointer"
              title="Start Listening"
            >
              <Mic className="w-3 h-3 text-blue-600" />
              <span>Listen</span>
            </button>
          )}

          <button
            id="live-intel-stop-btn"
            type="button"
            onClick={handleStop}
            disabled={!isListening && !isPaused}
            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors disabled:opacity-40 cursor-pointer"
            title="Stop Listening"
          >
            <Square className="w-3 h-3 text-slate-500" />
            <span>Stop</span>
          </button>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Collapse panel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ==================================================
          TAB BAR: GUIDANCE | EVIDENCE | SESSION
          ================================================== */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 p-1 gap-1 shrink-0">
        <button
          id="tab-btn-guidance"
          type="button"
          onClick={() => setActiveTab('guidance')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer text-center font-mono ${
            activeTab === 'guidance'
              ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/50'
          }`}
        >
          Guidance
        </button>
        <button
          id="tab-btn-evidence"
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer text-center font-mono ${
            activeTab === 'evidence'
              ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/50'
          }`}
        >
          Evidence
        </button>
        <button
          id="tab-btn-session"
          type="button"
          onClick={() => setActiveTab('session')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer text-center font-mono ${
            activeTab === 'session'
              ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/50'
          }`}
        >
          Session
        </button>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)]">

        {/* ==================================================
            TAB 1: GUIDANCE (DEFAULT)
            ================================================== */}
        {activeTab === 'guidance' && (
          <div className="space-y-4 animate-in fade-in duration-150">

            {/* When No Question Is Detected Yet */}
            {!detectedResult && (
              <div id="live-intel-no-question-state" className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>Listening for interviewer question...</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    Recent audio transcript:
                  </span>
                  <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200 leading-relaxed font-sans">
                    &ldquo;{recentTranscript}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* When Question Is Detected (Strong Match Flow) */}
            {detectedResult && glanceData && !isNoMatch && (
              <div className="space-y-3.5">
                
                {/* SECTION 1 — DETECTED INTENT */}
                <div id="guidance-section-intent" className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  {glanceData.isFollowUp ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-700 font-mono">
                          FOLLOW-UP (91% Confidence)
                        </span>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-mono">
                          THREADED
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        Related to: <strong className="text-slate-900">{glanceData.relatedTo || 'Stakeholder Conflict'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
                          DETECTED INTENT
                        </span>
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                          {glanceData.matchPct}% MATCH
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                        {glanceData.intent}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Category: {detectedResult?.roleCategory || 'Behavioral · Leadership'}
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 2 — ANSWER BLUEPRINT (STAR, SCANNABLE IN < 3 SECONDS) */}
                <div id="guidance-section-blueprint" className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      ANSWER BLUEPRINT
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-mono">
                      Framework: STAR
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 font-mono block">Situation:</span>
                      <p className="text-slate-700 leading-snug font-medium">
                        {guidance?.blueprint?.situation || 'Complex technical rollout across multiple squads with conflicting priorities.'}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 font-mono block">Task:</span>
                      <p className="text-slate-700 leading-snug font-medium">
                        {guidance?.blueprint?.task || 'Reconcile conflicting requirements and unblock delivery on deadline.'}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 font-mono block">Action:</span>
                      <p className="text-slate-700 leading-snug font-medium">
                        {guidance?.blueprint?.action?.[0] || 'Established shared decision matrix and aligned engineering leads on architectural trade-offs.'}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 font-mono block">Trade-off:</span>
                      <p className="text-slate-700 leading-snug font-medium">
                        {guidance?.blueprint?.tradeoffs?.[0] || 'Deferred non-critical feature flags to guarantee 99.9% core release stability.'}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 font-mono block">Result:</span>
                      <p className="text-emerald-900 font-bold leading-snug">
                        {guidance?.blueprint?.result?.[0] || 'Zero production downtime, delivered 2 weeks ahead of target.'}
                      </p>
                    </div>
                  </div>

                  {/* Bullet Key Points */}
                  {glanceData.keyPoints && glanceData.keyPoints.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                        Key Points:
                      </span>
                      <div className="space-y-1">
                        {glanceData.keyPoints.slice(0, 5).map((pt, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 3 — ONE BEST STORY */}
                <div id="guidance-section-best-story" className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 font-mono">
                      BEST MATCHED STORY
                    </span>
                    <div className="flex items-center gap-1.5 font-mono">
                      {glanceData.bestStoryHasMetrics ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Metric available ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          Metric unavailable
                        </span>
                      )}
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white text-blue-700 border border-blue-200">
                        {glanceData.bestStoryRelevancePct}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-900">{glanceData.bestStory}</h4>
                    {glanceData.bestStoryReason && (
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">
                        &ldquo;{glanceData.bestStoryReason}&rdquo;
                      </p>
                    )}
                  </div>

                  {glanceData.metricPriorityApplied && (
                    <div className="p-2 rounded-xl bg-emerald-100/90 border border-emerald-200 text-[11px] font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{glanceData.metricPriorityMessage || 'Recommended because measurable outcome is available.'}</span>
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setIsEvidenceModalOpen(true)}
                      className="text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View full story</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('evidence')}
                      className="text-slate-500 font-semibold hover:text-slate-800 cursor-pointer"
                    >
                      View other relevant experiences →
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* When Question Is Detected (No-Match Flow) */}
            {detectedResult && isNoMatch && (
              <div className="space-y-3.5">
                
                {/* SECTION 1 — NO EXACT MATCH INTENT */}
                <div id="guidance-section-no-match-intent" className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900 font-mono">
                      NO EXACT MATCH
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300 font-mono">
                      54% MATCH
                    </span>
                  </div>
                  <div className="text-xs font-black text-slate-900">
                    Intent: {noMatchData.intent}
                  </div>
                  <div className="text-[11px] text-amber-900 font-medium">
                    Related concepts: Decision Making, Risk, Trade-offs
                  </div>
                </div>

                {/* SECTION 2 — ANSWER DIRECTION (5-STEP BULLETS) */}
                <div id="guidance-section-answer-direction" className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 font-mono block">
                    ANSWER DIRECTION:
                  </span>
                  
                  <div className="space-y-1.5 text-xs">
                    {noMatchData.answerDirectionStages.map((stageItem, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <span className="text-[10px] font-black text-blue-700 uppercase font-mono block">
                          {stageItem.stage}:
                        </span>
                        <p className="text-slate-700 font-medium leading-snug">
                          {stageItem.guidance}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Missing Evidence Alert */}
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-xs">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{noMatchData.missingEvidence.warning}</span>
                    </div>
                    <p className="text-amber-800 pl-5 text-[11px]">
                      Show: &ldquo;{noMatchData.missingEvidence.instruction}&rdquo;
                    </p>
                    <p className="text-amber-700 italic pl-5 text-[10px] font-semibold">
                      Do not invent the metric.
                    </p>
                  </div>
                </div>

                {/* SECTION 3 — ONE BEST STORY (NO-MATCH) */}
                <div id="guidance-section-best-story-no-match" className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 font-mono">
                      BEST MATCHED STORY
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white text-blue-700 border border-blue-200 font-mono">
                      89% Relevance
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">CRM Workflow Redesign</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">
                      Why: Strong match based on decision under ambiguity + metrics.
                    </p>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setIsEvidenceModalOpen(true)}
                      className="text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View full story</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('evidence')}
                      className="text-slate-500 font-semibold hover:text-slate-800 cursor-pointer"
                    >
                      View other relevant experiences →
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* SECTION 4 — SIMULATION TOOLS (COLLAPSED BY DEFAULT) */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <button
                id="simulation-tools-toggle-btn"
                type="button"
                onClick={() => setShowSimTester(!showSimTester)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  SIMULATION TOOLS
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {showSimTester ? '▾ Collapse' : '▸ Expand'}
                </span>
              </button>

              {showSimTester && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in fade-in duration-150 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Simulate Interview Audio:
                    </span>
                    {detectedResult && (
                      <button
                        type="button"
                        onClick={handleResetToListening}
                        className="text-[11px] font-semibold text-slate-400 hover:text-blue-600 underline cursor-pointer"
                      >
                        Reset to Listening
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSimulateQuestion('Tell me about a time you improved a product workflow.')}
                      className="p-2 rounded-xl bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 flex items-center justify-between text-xs">
                        <span>1. Product Workflow (Relevance Ranking Demo)</span>
                        <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">94%</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateQuestion('Tell me about a high impact decision where outcomes were critical.')}
                      className="p-2 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 flex items-center justify-between text-xs">
                        <span>2. High Impact Decision (Metric Priority Demo)</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">METRIC</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateQuestion('What would you do differently?')}
                      className="p-2 rounded-xl bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 flex items-center justify-between text-xs">
                        <span>3. Follow-up: &ldquo;What would you do differently?&rdquo;</span>
                        <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">FOLLOW-UP</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateQuestion('Tell me about a time you disagreed with an engineering team.')}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 flex items-center justify-between text-xs">
                        <span>4. Disagree with Engineering (Stakeholder Conflict)</span>
                        <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">94%</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateQuestion('Tell me about a time you had to make a difficult decision without enough information.')}
                      className="p-2 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 flex items-center justify-between text-xs">
                        <span>5. Decision Without Information (No Match Demo)</span>
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">NO MATCH</span>
                      </div>
                    </button>

                    {currentInterviewQuestion && (
                      <button
                        type="button"
                        onClick={() => handleSimulateQuestion(currentInterviewQuestion.question)}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all cursor-pointer"
                      >
                        <div className="font-bold text-purple-900 flex items-center justify-between text-xs">
                          <span>Analyze Current Interview Question</span>
                          <Sparkles className="w-3 h-3 text-purple-600" />
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Custom question input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (testInputText.trim()) {
                        handleSimulateQuestion(testInputText.trim());
                        setTestInputText('');
                      }
                    }}
                    className="pt-1 flex gap-1.5"
                  >
                    <input
                      type="text"
                      placeholder="Type custom test question..."
                      value={testInputText}
                      onChange={(e) => setTestInputText(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                    >
                      Simulate
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================================
            TAB 2: EVIDENCE (FULL RELEVANCE RANKED LIST)
            ================================================== */}
        {activeTab === 'evidence' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono block">
                  CANDIDATE EVIDENCE
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Relevance ranked to current question
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEvidenceModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer font-mono"
              >
                + Manage Stories
              </button>
            </div>

            <div className="space-y-2.5">
              {glanceData?.rankedEvidence && glanceData.rankedEvidence.length > 0 ? (
                glanceData.rankedEvidence.map((story, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                          Rank #{idx + 1}
                        </span>
                        <h4 className="text-xs font-black text-slate-900">{story.title}</h4>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                          {story.relevancePct}%
                        </span>
                        {story.hasMetrics ? (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                            Metric available ✓
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                            Metric unavailable
                          </span>
                        )}
                      </div>
                    </div>

                    {story.relevanceReason && (
                      <p className="text-[11px] text-slate-600 pl-2 border-l-2 border-blue-200 font-medium leading-snug">
                        {story.relevanceReason}
                      </p>
                    )}

                    {story.metrics && story.metrics.length > 0 && (
                      <div className="pt-1 text-[11px] text-slate-700 space-y-0.5 font-mono">
                        {story.metrics.map((m, mi) => (
                          <div key={mi} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No evidence stories loaded. Click &ldquo;Manage Stories&rdquo; to add your experiences.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================
            TAB 3: SESSION (INTERVIEW FLOW & MEMORY)
            ================================================== */}
        {activeTab === 'session' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="space-y-0.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono block">
                INTERVIEW FLOW
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Session Memory sequence tracking
              </span>
            </div>

            <div className="space-y-1.5">
              {sessionMemory.flowSteps.map((step) => {
                const isCurrent = step.isCurrent;
                const isCompleted = step.isCompleted;

                return (
                  <div
                    key={step.sequence}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-slate-900 text-white font-bold shadow-xs border border-slate-800'
                        : isCompleted
                        ? 'bg-slate-50 text-slate-700 border border-slate-200/80 font-medium'
                        : 'text-slate-400 font-normal bg-transparent border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <span className={isCurrent ? 'text-blue-400 font-bold' : 'text-slate-400'}>
                        {step.stepNumber}
                      </span>
                      <span className={isCurrent ? 'text-white font-black' : 'text-slate-700 font-semibold'}>
                        {step.label}
                      </span>
                    </div>

                    <div className="flex items-center font-mono text-xs">
                      {isCompleted && (
                        <span className="text-emerald-600 font-black">✓</span>
                      )}
                      {isCurrent && (
                        <span className="text-emerald-400 font-black flex items-center gap-1 animate-pulse">
                          ● Current
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Session Context Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                Session Context:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-mono">Role:</span>
                  <span className="font-bold text-slate-800">{roleCategory || 'Software Engineering'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Domain:</span>
                  <span className="font-bold text-slate-800">{domain || 'Enterprise SaaS'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">State:</span>
                  <span className="font-bold text-slate-800">{isListening ? 'Listening' : isPaused ? 'Paused' : 'Stopped'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Memory Mode:</span>
                  <span className="font-bold text-emerald-700">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Candidate Evidence Modal */}
      <CandidateEvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onEvidenceUpdated={() => {
          if (detectedResult && coordinatorRef.current) {
            coordinatorRef.current.simulateInterviewerQuestion(detectedResult.rawText);
          }
        }}
      />

    </div>
  );
};
