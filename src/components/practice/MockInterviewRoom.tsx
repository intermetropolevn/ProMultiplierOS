import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Clock, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  FileText, 
  AlertCircle,
  XCircle,
  ChevronRight,
  Send,
  Radio,
  ArrowUpRight
} from 'lucide-react';
import { 
  InterviewQuestion, 
  InterviewConfig, 
  QuestionResponse, 
  AnswerEvaluation, 
  MockInterviewSession 
} from '../../types';
import { EvaluatorService } from '../../services/evaluatorService';
import { LiveIntelligencePanel } from '../../features/realtime/ui/LiveIntelligencePanel';
import { AnswerBlueprintModal } from './AnswerBlueprintModal';
import { SessionMemoryService } from '../../features/realtime/memory/SessionMemoryService';
import { RealTimeInterviewerStage } from '../../features/interviewer/ui/RealTimeInterviewerStage';

interface MockInterviewRoomProps {
  questions: InterviewQuestion[];
  config: InterviewConfig;
  onFinishSession: (session: MockInterviewSession) => void;
  onCancelSession: () => void;
}

export const MockInterviewRoom: React.FC<MockInterviewRoomProps> = ({
  questions,
  config,
  onFinishSession,
  onCancelSession,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>(
    questions.map(q => ({
      questionId: q.id,
      question: q,
      candidateAnswer: '',
      notes: '',
      timeSpentSeconds: 0,
    }))
  );

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentNotes, setCurrentNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'answer' | 'notes'>('answer');
  const [isRubricPeekOpen, setIsRubricPeekOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);
  const [isLiveIntelligenceOpen, setIsLiveIntelligenceOpen] = useState(true);
  const [roomExperienceMode, setRoomExperienceMode] = useState<'realtime_ai' | 'classic'>(
    config.mockExperienceType === 'classic' ? 'classic' : 'realtime_ai'
  );

  // Live Intelligence integration states
  const [detectedMatchPercent, setDetectedMatchPercent] = useState<number>(94);
  const [detectedIntent, setDetectedIntent] = useState<string>('Behavioral / Stakeholder Conflict');
  const [blueprintAvailable, setBlueprintAvailable] = useState<boolean>(true);
  const [blueprintData, setBlueprintData] = useState<any>(null);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState<boolean>(false);

  // Timer states
  const [timeRemaining, setTimeRemaining] = useState(config.timePerQuestionSeconds);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  // Voice features
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const currentQuestion = questions[currentIndex];

  // Callback to receive detected match & intent from Live Intelligence
  const handleIntelligenceUpdate = (data: {
    matchPct: number;
    intent: string;
    hasStrongMatch: boolean;
    blueprintAvailable: boolean;
    blueprint?: any;
    rawQuestionText?: string;
  }) => {
    setDetectedMatchPercent(data.matchPct);
    setDetectedIntent(data.intent);
    setBlueprintAvailable(data.blueprintAvailable);
    if (data.blueprint) {
      setBlueprintData(data.blueprint);
    }
  };

  // Helper to determine contextual hint based on detected question intent
  const getStarContextualHint = (intent: string) => {
    const lower = (intent || '').toLowerCase();
    if (lower.includes('conflict') || lower.includes('disagree') || lower.includes('stakeholder')) {
      return 'Consider including the trade-off.';
    }
    if (lower.includes('ambiguity') || lower.includes('decision')) {
      return 'Consider explaining what evidence you had and what you sacrificed.';
    }
    if (lower.includes('system') || lower.includes('technical') || lower.includes('architecture')) {
      return 'Consider explaining latency vs consistency trade-offs.';
    }
    if (lower.includes('failure') || lower.includes('mistake')) {
      return 'Consider highlighting the root cause and long-term prevention.';
    }
    return 'Consider including the trade-off.';
  };

  const starContextualHint = getStarContextualHint(detectedIntent);

  // Initialize Speech Synthesis for Reading Question
  const speakQuestion = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Stop any lingering audio on unmount or question change
  useEffect(() => {
    return () => stopSpeaking();
  }, [currentIndex]);

  // Per-Question Timer & Total Timer
  useEffect(() => {
    setTimeRemaining(config.timePerQuestionSeconds);
    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
      setTotalElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, config.timePerQuestionSeconds]);

  // Sync state when currentIndex changes
  useEffect(() => {
    const existing = responses[currentIndex];
    if (existing) {
      setCurrentAnswer(existing.candidateAnswer);
      setCurrentNotes(existing.notes);
      setCurrentEvaluation(existing.evaluation || null);
    }
    setIsRubricPeekOpen(false);

    if (currentQuestion) {
      SessionMemoryService.setActiveQuestionFromRoom(currentQuestion, currentIndex);
    }
  }, [currentIndex, currentQuestion]);

  // Speech Recognition (Dictation) Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) {
          setCurrentAnswer(prev => prev ? `${prev} ${final.trim()}` : final.trim());
          setInterimTranscript('');
        } else if (interim) {
          setInterimTranscript(interim.trim());
        }
      };

      recognition.onerror = (event: any) => {
        setSpeechError(`Voice dictation notice: ${event.error}`);
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    setSpeechError(null);
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is not supported in this browser environment. You can type your response directly.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        setSpeechError('Could not start microphone. Please check permissions or type your answer.');
      }
    }
  };

  // Word count & approximate speaking duration
  const wordsCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;
  const estimatedSpeakingMinutes = (wordsCount / 130).toFixed(1);

  // Handle STAR scaffolding chips
  const insertStarPrompt = (phase: string, placeholder: string) => {
    const prefix = currentAnswer.trim() ? '\n\n' : '';
    setCurrentAnswer(prev => `${prev}${prefix}**${phase}:** ${placeholder}`);
  };

  // Evaluate current answer
  const handleEvaluate = () => {
    setIsEvaluating(true);
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Run evaluator
    const evalResult = EvaluatorService.evaluateAnswer(currentQuestion, currentAnswer);
    setCurrentEvaluation(evalResult);

    // Save into responses
    const updated = [...responses];
    updated[currentIndex] = {
      ...updated[currentIndex],
      candidateAnswer: currentAnswer,
      notes: currentNotes,
      timeSpentSeconds: config.timePerQuestionSeconds - timeRemaining,
      evaluation: evalResult,
    };
    setResponses(updated);
    setIsEvaluating(false);
  };

  // Real-Time Interviewer stage completion handler
  const handleStageQuestionCompleted = (
    fullTranscript: string,
    _turns: { role: 'ai' | 'candidate'; text: string; isFollowUp?: boolean; source?: string }[]
  ) => {
    setCurrentAnswer(fullTranscript);
    const evalResult = EvaluatorService.evaluateAnswer(currentQuestion, fullTranscript);
    setCurrentEvaluation(evalResult);

    const updated = [...responses];
    updated[currentIndex] = {
      ...updated[currentIndex],
      candidateAnswer: fullTranscript,
      notes: currentNotes,
      timeSpentSeconds: config.timePerQuestionSeconds - timeRemaining,
      evaluation: evalResult,
    };
    setResponses(updated);
  };

  // Navigate to Next Question or Finish
  const handleNextOrFinish = () => {
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // If answer wasn't evaluated yet, evaluate it now
    let finalEval = currentEvaluation;
    if (!finalEval && currentAnswer.trim()) {
      finalEval = EvaluatorService.evaluateAnswer(currentQuestion, currentAnswer);
    }

    const updated = [...responses];
    updated[currentIndex] = {
      ...updated[currentIndex],
      candidateAnswer: currentAnswer,
      notes: currentNotes,
      timeSpentSeconds: config.timePerQuestionSeconds - timeRemaining,
      evaluation: finalEval || undefined,
    };
    setResponses(updated);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Complete Session
      const totalScore = Math.round(
        updated.reduce((acc, r) => acc + (r.evaluation?.score || 40), 0) / updated.length
      );

      let readinessSummary = 'Session completed.';
      if (totalScore >= 85) readinessSummary = 'Calibrated at Exceptional: Ready for Staff/Senior Onsite loops.';
      else if (totalScore >= 72) readinessSummary = 'Calibrated at Strong: Solid foundational depth; sharpen metrics for top percentile.';
      else if (totalScore >= 55) readinessSummary = 'Calibrated at Competent: Focus on STAR structural rigor and domain jargon.';
      else readinessSummary = 'Developing: Recommend deep review of role blueprints and workflows.';

      const session: MockInterviewSession = {
        id: `session-${Date.now()}`,
        createdAt: new Date().toISOString(),
        config,
        responses: updated,
        overallScore: totalScore,
        readinessSummary,
        totalDurationSeconds: totalElapsedTime,
        completed: true,
      };

      onFinishSession(session);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`mx-auto space-y-6 transition-all duration-300 ${
      isLiveIntelligenceOpen ? 'max-w-[1520px]' : 'max-w-5xl'
    }`}>
      
      {/* Top Bar: Progress, Mode Toggle, Timer, End button */}
      <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 text-white">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="hidden sm:flex items-center gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : i < currentIndex
                    ? 'bg-emerald-500'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Experience Mode Selector: Real-Time AI vs Classic Practice */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              id="experience-mode-realtime-btn"
              type="button"
              onClick={() => setRoomExperienceMode('realtime_ai')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                roomExperienceMode === 'realtime_ai'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time AI</span>
            </button>
            <button
              id="experience-mode-classic-btn"
              type="button"
              onClick={() => setRoomExperienceMode('classic')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                roomExperienceMode === 'classic'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-700" />
              <span>Classic Practice</span>
            </button>
          </div>

          {/* Mode Badge & Live Toggle */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            {isLiveIntelligenceOpen ? (
              <button
                type="button"
                onClick={() => setIsLiveIntelligenceOpen(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all cursor-pointer"
                title="Collapse Live Intelligence panel"
              >
                <Radio className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                <span>Live Intelligence: Active</span>
                <span className="text-[10px] text-purple-600 underline ml-1">Hide</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLiveIntelligenceOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-900 hover:border-purple-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                title="Open Live Intelligence panel"
              >
                <Radio className="w-3.5 h-3.5 text-slate-500" />
                <span>Open Live Intelligence</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded-md">BETA</span>
              </button>
            )}
          </div>
        </div>

        {/* Timers */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
            timeRemaining < 30 
              ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Time: <strong className="font-mono">{formatSeconds(timeRemaining)}</strong></span>
          </div>

          <button
            onClick={onCancelSession}
            className="text-slate-400 hover:text-rose-600 text-xs font-medium transition-colors cursor-pointer"
          >
            Quit Interview
          </button>
        </div>
      </div>

      {/* Main Content Layout (Desktop: Main Area 70%, Side Area 30%) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left / Main Workspace: 70% Candidate Response Area (100% when collapsed) */}
        <div className={`space-y-6 transition-all duration-200 ${isLiveIntelligenceOpen ? 'w-full lg:w-[70%] shrink-0' : 'w-full'}`}>

          {/* MODE 1: REAL-TIME AI INTERVIEWER */}
          {roomExperienceMode === 'realtime_ai' && (
            <RealTimeInterviewerStage
              question={currentQuestion}
              questionIndex={currentIndex}
              totalQuestions={questions.length}
              config={config}
              onQuestionCompleted={handleStageQuestionCompleted}
              onAdvanceToNextQuestion={handleNextOrFinish}
              isLastQuestion={currentIndex >= questions.length - 1}
            />
          )}

          {/* MODE 2: CLASSIC PRACTICE (Standard Practice Interface) */}
          {roomExperienceMode === 'classic' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-100">
                    {currentQuestion.roleCategory}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {currentQuestion.type}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {currentQuestion.level}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {currentQuestion.domain}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="speak-question-btn"
                    type="button"
                    onClick={() => isSpeaking ? stopSpeaking() : speakQuestion(currentQuestion.question)}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isSpeaking ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                    }`}
                    title={isSpeaking ? 'Stop voice reading' : 'Read question aloud'}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span className="text-xs font-bold">{isSpeaking ? 'Stop Reading' : 'Listen to Question'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRubricPeekOpen(!isRubricPeekOpen)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                  >
                    {isRubricPeekOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{isRubricPeekOpen ? 'Hide Rubric Signals' : 'Peek Rubric Signals'}</span>
                  </button>
                </div>
              </div>

              {/* Question Title & Focus */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {currentQuestion.question}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  <strong className="text-slate-700">Senior Calibration Focus:</strong> {currentQuestion.seniorCalibrationFocus}
                </p>
              </div>

              {/* Collapsible Rubric Peek & Hints */}
              {isRubricPeekOpen && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in-50">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Senior Calibration Rubric Signals
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentQuestion.rubricCriteria.map((c, i) => (
                      <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1">
                        <div className="font-bold text-slate-900">{c.criterion}</div>
                        <div className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded">
                          Signals: {c.whatStrongCandidatesSay}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Keywords to mention:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentQuestion.keywordsToMention.map((k, i) => (
                        <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs for Candidate Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('answer')}
                      className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                        activeTab === 'answer'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Candidate Response
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('notes')}
                      className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                        activeTab === 'notes'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Scratchpad Notes
                    </button>
                  </div>

                  {/* Word count & Voice Dictation button */}
                  {activeTab === 'answer' && (
                    <div className="flex items-center gap-3 pb-2">
                      <span className="text-xs text-slate-400 font-mono">
                        {wordsCount} words (~{estimatedSpeakingMinutes} min speech)
                      </span>
                      <button
                        id="voice-dictation-btn"
                        type="button"
                        onClick={toggleListening}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isListening
                            ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        <span>{isListening ? 'Stop Dictating' : 'Voice Dictation'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {activeTab === 'answer' && (
                  <div className="space-y-3">
                    {/* STAR Prompts Injection */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-slate-400 mr-1">STAR scaffolding:</span>
                      <button
                        type="button"
                        onClick={() => insertStarPrompt('Situation', 'At my previous role, we were facing...')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 cursor-pointer"
                      >
                        + Situation
                      </button>
                      <button
                        type="button"
                        onClick={() => insertStarPrompt('Task', 'My objective was to deliver...')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 cursor-pointer"
                      >
                        + Task
                      </button>
                      <button
                        type="button"
                        onClick={() => insertStarPrompt('Action', 'I designed and executed...')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 cursor-pointer"
                      >
                        + Action
                      </button>
                      <button
                        type="button"
                        onClick={() => insertStarPrompt('Result', 'The final production impact was...')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 cursor-pointer"
                      >
                        + Result
                      </button>
                    </div>

                    <textarea
                      id="interview-answer-textarea"
                      rows={8}
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your structured response or use Voice Dictation above to speak your answer..."
                      className="w-full p-4 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 bg-white leading-relaxed resize-y font-normal"
                    />

                    {interimTranscript && (
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 italic animate-pulse">
                        Hearing: &ldquo;{interimTranscript}...&rdquo;
                      </div>
                    )}

                    {speechError && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>{speechError}</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-2">
                    <textarea
                      id="interview-scratchpad-textarea"
                      rows={8}
                      value={currentNotes}
                      onChange={(e) => setCurrentNotes(e.target.value)}
                      placeholder="Jot down quick bullet points or architecture sketches before answering..."
                      className="w-full p-4 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 bg-slate-50/50 leading-relaxed resize-y font-normal"
                    />
                  </div>
                )}
              </div>

              {/* Blueprint Available Notice */}
              {blueprintAvailable && (
                <div 
                  id="blueprint-available-banner"
                  className="flex items-center justify-between p-3.5 px-4 rounded-2xl bg-blue-50/90 border border-blue-200/90 shadow-2xs animate-in fade-in duration-150"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-blue-950 uppercase tracking-wide">
                          Blueprint available
                        </span>
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md border border-blue-200">
                          {detectedMatchPercent}% match
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-800 font-medium">
                        Answer direction &amp; architectural trade-offs ready. Review blueprint without affecting your response.
                      </p>
                    </div>
                  </div>
                  <button
                    id="view-blueprint-button"
                    type="button"
                    onClick={() => setIsBlueprintModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>View Blueprint</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Connected STAR Helpers with Detected Question Intent */}
              <div id="star-helpers-connected" className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Detected Question Intent:
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-900 shadow-2xs font-mono">
                      {detectedIntent || 'Behavioral / Stakeholder Conflict'}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-amber-950 bg-amber-100/70 px-3 py-1 rounded-xl border border-amber-200/80 flex items-center gap-1.5">
                    <span className="text-amber-600 font-bold">💡</span>
                    <span>&ldquo;{starContextualHint}&rdquo;</span>
                  </div>
                </div>
              </div>

              {/* Evaluation Critique Card */}
              {currentEvaluation && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-slate-900">
                        Answer Score: <strong className="text-blue-600">{currentEvaluation.score}/100</strong>
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        currentEvaluation.ratingTier === 'Exceptional' ? 'bg-emerald-100 text-emerald-800' :
                        currentEvaluation.ratingTier === 'Strong' ? 'bg-blue-100 text-blue-800' :
                        currentEvaluation.ratingTier === 'Competent' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {currentEvaluation.ratingTier}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">Evaluated against Senior Rubric</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {currentEvaluation.detailedFeedback}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Demonstrated Strengths</div>
                      <ul className="space-y-1">
                        {currentEvaluation.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Areas to Polish</div>
                      <ul className="space-y-1">
                        {currentEvaluation.improvementAreas.map((a, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-blue-100 space-y-2">
                    <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Benchmark Exemplary Answer to Compare
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                      &ldquo;{currentQuestion.exemplaryModelAnswer}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Action Controls */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  {!currentEvaluation ? (
                    <button
                      id="evaluate-answer-btn"
                      type="button"
                      onClick={handleEvaluate}
                      disabled={!currentAnswer.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Evaluate Answer Structure</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEvaluate}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-evaluate Answer</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {currentIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex(prev => prev - 1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Previous Q
                    </button>
                  )}

                  <button
                    id="next-or-finish-btn"
                    type="button"
                    onClick={handleNextOrFinish}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish & Generate Report'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* SIDE AREA: Live Intelligence (30% on desktop) */}
        {isLiveIntelligenceOpen && (
          <div className="w-full lg:w-[30%] lg:sticky lg:top-6 space-y-4 animate-in fade-in duration-200 shrink-0">
            <LiveIntelligencePanel
              roleCategory={config.roleCategory}
              domain={config.domain}
              currentInterviewQuestion={currentQuestion}
              onToggleCollapse={() => setIsLiveIntelligenceOpen(false)}
              onIntelligenceUpdate={handleIntelligenceUpdate}
            />
          </div>
        )}

      </div>

      {/* When Collapsed: Small floating indicator: ● 94% Match */}
      {!isLiveIntelligenceOpen && (
        <button
          id="floating-live-intelligence-indicator"
          type="button"
          onClick={() => setIsLiveIntelligenceOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white text-xs font-bold font-mono shadow-2xl border border-slate-700/80 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs group"
          title="Click to expand Live Intelligence panel"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="tracking-tight text-white group-hover:text-emerald-300 transition-colors">
            ● {detectedMatchPercent}% Match
          </span>
        </button>
      )}

      {/* Answer Blueprint Modal */}
      <AnswerBlueprintModal
        isOpen={isBlueprintModalOpen}
        onClose={() => setIsBlueprintModalOpen(false)}
        question={currentQuestion}
        matchPct={detectedMatchPercent}
        intent={detectedIntent}
        blueprint={blueprintData}
      />

    </div>
  );
};
