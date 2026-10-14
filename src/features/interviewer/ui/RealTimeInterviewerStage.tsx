import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Bot, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { InterviewQuestion, InterviewConfig, AnswerEvaluation } from '../../../types';
import { InterviewerState, VoiceProviderInfo, FollowUpItem, BargeInEvent } from '../types';
import { VoiceManager, IVoiceProvider } from '../voice/VoiceProvider';
import { FollowUpService } from '../FollowUpService';
import { BargeInController } from '../bargeIn/BargeInController';
import { EvaluatorService } from '../../../services/evaluatorService';

interface RealTimeInterviewerStageProps {
  question: InterviewQuestion;
  questionIndex: number;
  totalQuestions: number;
  config: InterviewConfig;
  onQuestionCompleted: (fullTranscript: string, turns: { role: 'ai' | 'candidate'; text: string; isFollowUp?: boolean; source?: string }[]) => void;
  onAdvanceToNextQuestion: () => void;
  isLastQuestion: boolean;
  onCancelSession?: () => void;
}

export const RealTimeInterviewerStage: React.FC<RealTimeInterviewerStageProps> = ({
  question,
  questionIndex,
  totalQuestions,
  config: _config,
  onQuestionCompleted,
  onAdvanceToNextQuestion,
  isLastQuestion,
  onCancelSession,
}) => {
  // Interviewer state machine
  const [interviewerState, setInterviewerState] = useState<InterviewerState>('ASKING');
  
  // Voice provider status
  const [voiceProvider, setVoiceProvider] = useState<IVoiceProvider>(VoiceManager.getProvider());
  const [_providerInfo, setProviderInfo] = useState<VoiceProviderInfo>(VoiceManager.getProvider().getInfo());
  const [_forceMockSimulated, setForceMockSimulated] = useState<boolean>(VoiceManager.isForceSimulated());

  // Conversation turns for current question
  const [turns, setTurns] = useState<{ role: 'ai' | 'candidate'; text: string; isFollowUp?: boolean; source?: string }[]>([]);
  const [currentCandidateInput, setCurrentCandidateInput] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [activePrompt, setActivePrompt] = useState<string>(question.question);
  const [askedFollowUps, setAskedFollowUps] = useState<string[]>([]);
  const [activeFollowUpItem, setActiveFollowUpItem] = useState<FollowUpItem | null>(null);

  // Candidate speaking duration timer
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0);
  const [isMicPaused, setIsMicPaused] = useState<boolean>(false);

  // Scratchpad notes and evaluation critique state
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [scratchpadNotes, setScratchpadNotes] = useState<string>('');
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [_isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isRubricPeekOpen, setIsRubricPeekOpen] = useState<boolean>(false);

  // Barge-in & Interruption
  const [bargeInEnabled] = useState<boolean>(true);
  const [_lastBargeIn, setLastBargeIn] = useState<BargeInEvent | null>(null);
  const [_interruptionCount, setInterruptionCount] = useState<number>(0);

  // Silence detection / completion timer
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);
  const silenceTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  // Barge-in controller reference
  const bargeInControllerRef = useRef<BargeInController | null>(null);

  // Initialize Barge-In Controller
  useEffect(() => {
    const controller = new BargeInController(voiceProvider, (event) => {
      setLastBargeIn(event);
      setInterruptionCount(prev => prev + 1);
      // Non-aggressive barge-in triggered: immediately stop AI speaking and transition to LISTENING
      setInterviewerState('LISTENING');
    }, {
      enabled: bargeInEnabled,
      minWordCountToInterrupt: 2,
    });
    bargeInControllerRef.current = controller;
  }, [voiceProvider, bargeInEnabled]);

  // Keep barge-in controller aware of active AI speech
  useEffect(() => {
    if (bargeInControllerRef.current) {
      bargeInControllerRef.current.setAISpeaking(interviewerState === 'ASKING' || interviewerState === 'FOLLOW_UP');
    }
  }, [interviewerState]);

  // Speaking timer ticker
  useEffect(() => {
    let interval: any = null;
    if (interviewerState === 'LISTENING' && !isMicPaused) {
      interval = setInterval(() => {
        setSpeakingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [interviewerState, isMicPaused]);

  // Start question lifecycle when questionIndex or question changes
  useEffect(() => {
    setActivePrompt(question.question);
    setTurns([{ role: 'ai', text: question.question, isFollowUp: false }]);
    setAskedFollowUps([]);
    setActiveFollowUpItem(null);
    setCurrentCandidateInput('');
    setInterimTranscript('');
    setSilenceCountdown(null);
    setSpeakingSeconds(0);
    setIsMicPaused(false);
    setEvaluation(null);
    setInterviewerState('ASKING');

    // Automatically speak question
    const speakInitialQuestion = async () => {
      try {
        await voiceProvider.speak(question.question, {
          onStart: () => {
            if (bargeInControllerRef.current) bargeInControllerRef.current.setAISpeaking(true);
          },
          onEnd: () => {
            if (bargeInControllerRef.current) bargeInControllerRef.current.setAISpeaking(false);
            setInterviewerState('LISTENING');
          },
          onError: () => {
            if (bargeInControllerRef.current) bargeInControllerRef.current.setAISpeaking(false);
            setInterviewerState('LISTENING');
          }
        });
      } catch {
        setInterviewerState('LISTENING');
      }
    };

    speakInitialQuestion();

    return () => {
      if (typeof voiceProvider?.stopSpeaking === 'function') voiceProvider.stopSpeaking();
      if (typeof voiceProvider?.stopListening === 'function') voiceProvider.stopListening();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [questionIndex, question]);

  // Listen to candidate speech when state is LISTENING
  useEffect(() => {
    if (interviewerState !== 'LISTENING' || isMicPaused) {
      if (typeof voiceProvider?.stopListening === 'function') {
        voiceProvider.stopListening();
      }
      return;
    }

    const callbacks = {
      onInterim: (text: string) => {
        setInterimTranscript(text);
        if (bargeInControllerRef.current && (interviewerState === 'ASKING' || interviewerState === 'FOLLOW_UP')) {
          bargeInControllerRef.current.onCandidateSpeech(text);
        }
        resetSilenceDetection();
      },
      onFinal: (text: string) => {
        setCurrentCandidateInput(prev => prev ? `${prev} ${text}` : text);
        setInterimTranscript('');
        triggerSilenceDetection();
      },
      onError: () => {
        // Fallback gracefully
      }
    };

    if (typeof voiceProvider.startListening === 'function') {
      voiceProvider.startListening(callbacks);
    } else if (typeof voiceProvider.listen === 'function') {
      voiceProvider.listen(callbacks);
    }

    return () => {
      if (typeof voiceProvider?.stopListening === 'function') {
        voiceProvider.stopListening();
      }
    };
  }, [interviewerState, isMicPaused, voiceProvider]);

  // Reset silence timer on candidate speech
  const resetSilenceDetection = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setSilenceCountdown(null);
  };

  // Trigger silence countdown
  const triggerSilenceDetection = () => {
    resetSilenceDetection();
    let remaining = 6;
    setSilenceCountdown(remaining);

    countdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setSilenceCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }, 1000);

    silenceTimerRef.current = setTimeout(() => {
      handleCandidateFinishedSpeaking();
    }, 6000);
  };

  // Candidate clicks "Keep Speaking" to cancel auto-advance
  const handleKeepSpeaking = () => {
    resetSilenceDetection();
  };

  // Candidate finishes speaking
  const handleCandidateFinishedSpeaking = () => {
    resetSilenceDetection();
    if (typeof voiceProvider?.stopListening === 'function') {
      voiceProvider.stopListening();
    }
    setInterviewerState('PROCESSING');
  };

  // Process turn when state shifts to PROCESSING
  useEffect(() => {
    if (interviewerState !== 'PROCESSING') return;

    // Record candidate's answer into turns
    const answerText = currentCandidateInput.trim() || interimTranscript.trim() || '(Candidate provided verbal response)';
    const updatedTurns = [
      ...turns,
      { role: 'candidate' as const, text: answerText, isFollowUp: Boolean(activeFollowUpItem) }
    ];
    setTurns(updatedTurns);

    // AI Determines: Follow-up or Next Question
    const processTurnTimer = setTimeout(() => {
      // Check if we should ask a follow-up (max 2 follow-ups per primary question)
      if (askedFollowUps.length < 2) {
        const nextFollowUp = FollowUpService.getNextFollowUp(question, askedFollowUps, answerText);
        if (nextFollowUp) {
          setActiveFollowUpItem(nextFollowUp);
          setAskedFollowUps(prev => [...prev, nextFollowUp.question]);
          setActivePrompt(nextFollowUp.question);
          setCurrentCandidateInput('');
          setInterimTranscript('');
          setSpeakingSeconds(0);
          
          setTurns(prev => [
            ...prev,
            { role: 'ai', text: nextFollowUp.question, isFollowUp: true, source: nextFollowUp.source }
          ]);

          setInterviewerState('FOLLOW_UP');

          // Speak the follow-up
          voiceProvider.speak(nextFollowUp.question, {
            onStart: () => {
              if (bargeInControllerRef.current) bargeInControllerRef.current.setAISpeaking(true);
            },
            onEnd: () => {
              if (bargeInControllerRef.current) bargeInControllerRef.current.setAISpeaking(false);
              setInterviewerState('LISTENING');
            },
            onError: () => {
              if (bargeInControllerRef.current) bargeInControllerRef.current.setAISpeaking(false);
              setInterviewerState('LISTENING');
            }
          });
          return;
        }
      }

      // No more follow-ups: complete this question
      const fullTranscript = updatedTurns.map(t => `${t.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${t.text}`).join('\n\n');
      onQuestionCompleted(fullTranscript, updatedTurns);

      if (isLastQuestion) {
        setInterviewerState('COMPLETE');
      } else {
        setInterviewerState('NEXT_QUESTION');
      }
    }, 1800);

    return () => clearTimeout(processTurnTimer);
  }, [interviewerState]);

  // Insert STAR scaffolding into answer
  const insertStarPrompt = (phase: string, placeholder: string) => {
    const prefix = currentCandidateInput.trim() ? '\n\n' : '';
    setCurrentCandidateInput(prev => `${prev}${prefix}**${phase}:** ${placeholder}`);
    resetSilenceDetection();
  };

  // Evaluate candidate answer structure (Layer 3 tool)
  const handleEvaluate = () => {
    setIsEvaluating(true);
    const answerText = currentCandidateInput.trim() || interimTranscript.trim() || 'No answer recorded yet.';
    const result = EvaluatorService.evaluateAnswer(question, answerText);
    setEvaluation(result);
    setIsEvaluating(false);
  };

  // Format speaking seconds
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Word count & duration estimate
  const wordsCount = currentCandidateInput.trim() ? currentCandidateInput.trim().split(/\s+/).length : 0;
  const estimatedSpeakingMinutes = (wordsCount / 130).toFixed(1);

  // Fast sample simulation for deterministic testing
  const handleSimulateAnswer = () => {
    let mockResponse = '';
    if (activeFollowUpItem) {
      mockResponse = 'The measurable outcome was zero double charges, a 42% reduction in p99 checkout latency, and ~$4,000/month saved in licensing fees.';
    } else {
      mockResponse = 'We evaluated consistency versus latency trade-offs, and chose eventual consistency with Redis idempotency locks.';
    }
    setCurrentCandidateInput(mockResponse);
  };

  return (
    <div id="realtime-interviewer-stage" className="space-y-4">
      
      {/* ==================================================
          A. COMPACT INTERVIEW STATUS BAR
          Answers "What is happening?" — light surface, compact, no large dark block
          ================================================== */}
      <div 
        id="interview-status-bar"
        className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            AI INTERVIEWER
          </span>
          <span className="text-xs font-semibold text-slate-700">
            {interviewerState === 'ASKING' && 'AI speaking question'}
            {interviewerState === 'LISTENING' && (isMicPaused ? 'Microphone paused' : 'Listening to candidate')}
            {interviewerState === 'PROCESSING' && 'Evaluating response turn'}
            {interviewerState === 'FOLLOW_UP' && 'AI asking follow-up question'}
            {interviewerState === 'NEXT_QUESTION' && 'Turn complete'}
            {interviewerState === 'COMPLETE' && 'Interview complete'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500 font-mono font-medium">
            Question <strong className="text-slate-900">{questionIndex + 1}</strong> of {totalQuestions}
          </span>

          <div className="flex items-center gap-1 text-slate-400">
            <span>•</span>
            <span className="text-slate-600 font-mono font-semibold">{formatSeconds(speakingSeconds)}</span>
          </div>

          <div className="flex items-center gap-2">
            {interviewerState === 'LISTENING' && (
              <button
                type="button"
                onClick={() => setIsMicPaused(!isMicPaused)}
                className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                {isMicPaused ? 'Resume Mic' : 'Pause Mic'}
              </button>
            )}

            {onCancelSession && (
              <button
                type="button"
                onClick={onCancelSession}
                className="text-slate-400 hover:text-rose-600 text-xs font-medium cursor-pointer transition-colors"
              >
                Quit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          B. SPEAKER / CONVERSATION STATE
          One clear, unambiguous state at any given time
          ================================================== */}
      <div id="speaker-conversation-state">
        {/* State 1: INTERVIEWER SPEAKING */}
        {(interviewerState === 'ASKING' || interviewerState === 'FOLLOW_UP') && (
          <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200/90 flex items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-blue-950 font-mono flex items-center gap-2">
                  <span>INTERVIEWER SPEAKING</span>
                  {activeFollowUpItem && (
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-sm">
                      Follow-Up
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-800 font-medium">
                  Listening to interviewer question...
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-blue-700 border border-blue-200 text-xs font-bold font-mono shadow-2xs">
              <Volume2 className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>AI Voice</span>
            </div>
          </div>
        )}

        {/* State 2: CANDIDATE SPEAKING */}
        {interviewerState === 'LISTENING' && (
          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-950 font-mono flex items-center gap-2">
                    <span>CANDIDATE SPEAKING</span>
                    {isMicPaused ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-sm">
                        Paused
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-emerald-800 font-medium">
                    {isMicPaused ? 'Microphone paused. Click Resume to continue speaking.' : 'Listening to your response...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-black text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                  {formatSeconds(speakingSeconds)}
                </span>
              </div>
            </div>

            {/* Speaking audio activity line */}
            <div className="w-full bg-emerald-200/80 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`bg-emerald-600 h-full rounded-full transition-all duration-300 ${!isMicPaused ? 'animate-pulse' : ''}`} 
                style={{ width: `${Math.min(100, Math.max(5, (speakingSeconds / 120) * 100))}%` }} 
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <button
                type="button"
                onClick={() => setIsMicPaused(!isMicPaused)}
                className="text-emerald-900 hover:text-emerald-950 font-bold underline cursor-pointer"
              >
                {isMicPaused ? 'Resume Mic' : 'Pause Mic'}
              </button>

              <button
                type="button"
                onClick={handleCandidateFinishedSpeaking}
                disabled={!currentCandidateInput.trim() && !interimTranscript.trim()}
                className="text-xs font-bold text-emerald-900 bg-white hover:bg-emerald-100/60 px-3 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer shadow-2xs disabled:opacity-40"
              >
                Finish Answer
              </button>
            </div>
          </div>
        )}

        {/* State 3: PROCESSING / UNDERSTANDING */}
        {interviewerState === 'PROCESSING' && (
          <div className="p-4 rounded-2xl bg-purple-50/90 border border-purple-200/90 flex items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-purple-950 font-mono">
                  PROCESSING / UNDERSTANDING
                </div>
                <p className="text-xs text-purple-800 font-medium">
                  Understanding response &amp; evaluating next question...
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-purple-800 bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-2xs font-mono">
              Calibrating...
            </span>
          </div>
        )}
      </div>

      {/* ==================================================
          C. CURRENT QUESTION (MAIN FOCAL POINT)
          One clean, canonical white card. Never repeated in sidebar.
          ================================================== */}
      <div 
        id="primary-interview-question-card"
        className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
              activeFollowUpItem ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'
            }`}>
              {activeFollowUpItem ? 'FOLLOW-UP QUESTION' : 'PRIMARY INTERVIEW QUESTION'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {question.roleCategory} • {question.type}
            </span>
          </div>

          <button
            type="button"
            onClick={() => voiceProvider.speak(activePrompt)}
            className="text-xs text-slate-600 hover:text-blue-600 font-bold flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Replay Audio</span>
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
          {activePrompt}
        </h2>

        {activeFollowUpItem?.promptReason && (
          <p className="text-xs text-indigo-700 font-medium bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{activeFollowUpItem.promptReason}</span>
          </p>
        )}
      </div>

      {/* ==================================================
          D. CANDIDATE RESPONSE
          Unified response workspace: speak, type, edit, word count, speaking time
          ================================================== */}
      <div 
        id="candidate-response-workspace"
        className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              YOUR RESPONSE
            </h3>
            {interviewerState === 'LISTENING' && !isMicPaused ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Microphone Active
              </span>
            ) : isMicPaused ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Microphone Paused
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-400">
                (Type or speak response)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">
              {wordsCount} words • ~{estimatedSpeakingMinutes} min
            </span>
            <button
              type="button"
              onClick={handleSimulateAnswer}
              className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
              title="Insert sample candidate answer for instant verification"
            >
              + Sample Answer
            </button>
          </div>
        </div>

        {/* Live speech transcript ticker */}
        {interimTranscript && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="font-bold text-[11px] text-blue-700 uppercase tracking-wider">Hearing:</span>
            <span className="italic truncate">&ldquo;{interimTranscript}&rdquo;</span>
          </div>
        )}

        {/* Silence auto-advance notification */}
        {silenceCountdown !== null && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-700">Confirming answer completion:</span>
              <span>Submitting in <strong className="text-amber-900 font-mono text-sm">{silenceCountdown}s</strong>...</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleKeepSpeaking}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-bold cursor-pointer transition-colors"
              >
                Still Speaking
              </button>
              <button
                type="button"
                onClick={handleCandidateFinishedSpeaking}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Finish Now
              </button>
            </div>
          </div>
        )}

        {/* Unified Textarea / Transcript Editor */}
        <textarea
          id="interview-answer-textarea"
          rows={6}
          value={currentCandidateInput}
          onChange={(e) => {
            setCurrentCandidateInput(e.target.value);
            resetSilenceDetection();
          }}
          placeholder="Speak into your microphone or type your response here. The AI interviewer will listen, process your answer, and ask relevant follow-ups..."
          className="w-full p-4 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-sans leading-relaxed resize-y"
        />

        {/* ==================================================
            E. RESPONSE HELPERS
            Compact contextual helpers: STAR chips & private scratchpad toggle
            ================================================== */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              STAR:
            </span>
            <button
              type="button"
              onClick={() => insertStarPrompt('Situation', 'At my previous role, our team faced...')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 cursor-pointer transition-colors"
            >
              + Situation
            </button>
            <button
              type="button"
              onClick={() => insertStarPrompt('Task', 'My objective was to ensure reliability by...')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 cursor-pointer transition-colors"
            >
              + Task
            </button>
            <button
              type="button"
              onClick={() => insertStarPrompt('Action', 'I designed and deployed...')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 cursor-pointer transition-colors"
            >
              + Action
            </button>
            <button
              type="button"
              onClick={() => insertStarPrompt('Result', 'The final measured outcome was zero downtime and...')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 cursor-pointer transition-colors"
            >
              + Result
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{isScratchpadOpen ? 'Hide Notes' : 'Scratchpad Notes'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRubricPeekOpen(!isRubricPeekOpen)}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isRubricPeekOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>Rubric Signals</span>
            </button>
          </div>
        </div>

        {/* Expandable Scratchpad Notes Drawer */}
        {isScratchpadOpen && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Private Candidate Scratchpad (Not shared with interviewer)
              </span>
            </div>
            <textarea
              id="interview-scratchpad-textarea"
              rows={2}
              value={scratchpadNotes}
              onChange={(e) => setScratchpadNotes(e.target.value)}
              placeholder="Quick architecture bullets or metrics to remember..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 leading-relaxed"
            />
          </div>
        )}

        {/* Expandable Rubric Signals Drawer */}
        {isRubricPeekOpen && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in-50">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Senior Calibration Rubric Signals
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {question.rubricCriteria.map((c, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{c.criterion}</div>
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded">
                    {c.whatStrongCandidatesSay}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Secondary Evaluation Card */}
        {evaluation && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900">
                  Answer Score: <strong className="text-blue-600">{evaluation.score}/100</strong>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  evaluation.ratingTier === 'Exceptional' ? 'bg-emerald-100 text-emerald-800' :
                  evaluation.ratingTier === 'Strong' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {evaluation.ratingTier}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Evaluated against Senior Rubric</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {evaluation.detailedFeedback}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">Demonstrated Strengths</span>
                <ul className="space-y-0.5">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-700 block">Areas to Polish</span>
                <ul className="space-y-0.5">
                  {evaluation.improvementAreas.map((a, i) => (
                    <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            F. NEXT ACTION
            Single, obvious primary action depending on state
            ================================================== */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            {!evaluation ? (
              <button
                id="evaluate-answer-btn"
                type="button"
                onClick={handleEvaluate}
                disabled={!currentCandidateInput.trim() && !interimTranscript.trim()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold hover:bg-slate-100 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Evaluate Answer Structure</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEvaluate}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-evaluate Answer</span>
              </button>
            )}
          </div>

          <div>
            {/* Primary Action Button */}
            {interviewerState === 'LISTENING' && (
              <button
                id="finish-speaking-btn"
                type="button"
                onClick={handleCandidateFinishedSpeaking}
                disabled={!currentCandidateInput.trim() && !interimTranscript.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>I&apos;m Finished Speaking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {(interviewerState === 'NEXT_QUESTION' || interviewerState === 'COMPLETE') && (
              <button
                id="next-question-btn"
                type="button"
                onClick={onAdvanceToNextQuestion}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <span>{isLastQuestion ? 'Finish & Generate Report' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
