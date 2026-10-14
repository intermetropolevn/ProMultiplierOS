import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Timer, 
  CheckCircle2, 
  Lightbulb, 
  Award, 
  Sparkles,
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { 
  InterviewConfig, 
  InterviewQuestion, 
  QuestionResponse, 
  AnswerEvaluation, 
  MockInterviewSession,
  TimedAssignmentType
} from '../../../types';
import { MockChatView } from './MockChatView';
import { TimedAssignmentView } from './TimedAssignmentView';
import { MockGuidancePanel } from './MockGuidancePanel';
import { MockFeedbackPanel } from './MockFeedbackPanel';
import { EvaluatorService } from '../../../services/evaluatorService';

interface MockInterviewWorkspaceProps {
  questions: InterviewQuestion[];
  config: InterviewConfig;
  onFinishSession: (session: MockInterviewSession) => void;
  onExit: () => void;
}

export const MockInterviewWorkspace: React.FC<MockInterviewWorkspaceProps> = ({
  questions,
  config,
  onFinishSession,
  onExit,
}) => {
  // Practice Sub-Mode: Text Chat vs Timed Assignment
  const [practiceSubMode, setPracticeSubMode] = useState<'chat' | 'timed'>(
    config.mockExperienceType === 'timed_assignment' ? 'timed' : 'chat'
  );

  // Question navigation
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentQuestion = questions[currentIndex] || questions[0];

  // Responses and Evaluations mapped by question index
  const [responses, setResponses] = useState<Record<number, QuestionResponse>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Right Rail Tab: Guidance vs Feedback
  const [activeRightTab, setActiveRightTab] = useState<'guidance' | 'feedback'>('guidance');

  const currentResponse = responses[currentIndex];
  const currentEvaluation = currentResponse?.evaluation;

  // Handle Candidate Submitting Answer in Chat View
  const handleSubmitAnswer = (answerText: string) => {
    setIsSubmitting(true);

    // Simulate AI evaluation evaluation
    setTimeout(() => {
      const evalResult = EvaluatorService.evaluateAnswer(
        currentQuestion,
        answerText
      );

      const updatedResponse: QuestionResponse = {
        questionId: currentQuestion.id,
        question: currentQuestion,
        candidateAnswer: answerText,
        notes: '',
        timeSpentSeconds: 120,
        evaluation: evalResult
      };

      setResponses(prev => ({
        ...prev,
        [currentIndex]: updatedResponse
      }));

      setIsSubmitting(false);
      // Auto-switch right rail to Feedback
      setActiveRightTab('feedback');
    }, 800);
  };

  // Handle "Improve Answer"
  const handleImproveAnswer = () => {
    // Switch back to Guidance or Chat focus
    setActiveRightTab('guidance');
  };

  // Handle "Continue to Next Question"
  const handleContinueNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setActiveRightTab('guidance');
    } else {
      // Complete mock interview session and compute aggregate report
      const responseList: QuestionResponse[] = Object.values(responses);
      const scores = responseList.map(r => r.evaluation?.score || 70);
      const overallScore = scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
        : 82;

      const session: MockInterviewSession = {
        id: `mock-sess-${Date.now()}`,
        createdAt: new Date().toISOString(),
        config,
        responses: responseList,
        overallScore,
        readinessSummary: `Mock text calibration session completed with ${responseList.length} questions evaluated. Strong STAR structure across technical architecture and leadership domains.`,
        totalDurationSeconds: responseList.length * 180,
        completed: true
      };

      onFinishSession(session);
    }
  };

  // Handle Timed Assignment submission
  const handleTimedAssignmentSubmit = (assignmentId: string, answer: string, timeSpentSeconds: number) => {
    const evalResult = EvaluatorService.evaluateAnswer(
      currentQuestion,
      answer
    );

    const updatedResponse: QuestionResponse = {
      questionId: currentQuestion.id,
      question: currentQuestion,
      candidateAnswer: answer,
      notes: 'Timed Assignment Submission',
      timeSpentSeconds,
      evaluation: evalResult
    };

    setResponses(prev => ({
      ...prev,
      [currentIndex]: updatedResponse
    }));

    setActiveRightTab('feedback');
  };

  return (
    <div className="max-w-[1520px] mx-auto space-y-4 pb-12">
      
      {/* 1. TOP BAR: Mode Selector, Progress Tracker, Target Metadata, End Button */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Exit + Question Progress */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Exit Mock Practice"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-black tracking-wide uppercase">
              Mock Interview Simulator
            </span>

            {practiceSubMode === 'chat' && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <span className="text-xs font-bold text-slate-900">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="hidden sm:flex items-center gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentIndex
                          ? 'bg-blue-600 scale-125 ring-2 ring-blue-400/40'
                          : responses[i]
                          ? 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Sub-mode Selector (Text Chat vs Timed Assignment) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setPracticeSubMode('chat')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              practiceSubMode === 'chat'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Text Chat Practice</span>
          </button>

          <button
            type="button"
            onClick={() => setPracticeSubMode('timed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              practiceSubMode === 'timed'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Timed Assignments</span>
          </button>
        </div>

        {/* Right: Target Discipline & End Session */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-slate-500 font-medium">
            Target: <strong className="text-slate-800">{config.roleCategory}</strong> • {config.domain}
          </span>

          <button
            type="button"
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Exit Session
          </button>
        </div>

      </div>

      {/* 2. MAIN WORKSPACE: Chat / Timed on Left (7 cols), Guidance / Feedback on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column (7 cols): Text Chat OR Timed Assignment View */}
        <div className="lg:col-span-7">
          {practiceSubMode === 'chat' ? (
            <MockChatView
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              initialAnswer={currentResponse?.candidateAnswer || ''}
              onSubmitAnswer={handleSubmitAnswer}
              isSubmitting={isSubmitting}
              hasSubmittedAnswer={!!currentEvaluation}
              exampleAnswer={currentQuestion.sampleAnswer}
            />
          ) : (
            <TimedAssignmentView
              initialAssignmentType={config.timedAssignmentType || 'Behavioral'}
              onSubmitAssignment={handleTimedAssignmentSubmit}
            />
          )}
        </div>

        {/* Right Column (5 cols): Practice Guidance & Evaluation Feedback */}
        <div className="lg:col-span-5 flex flex-col h-[650px] space-y-3">
          
          {/* Right Rail Tabs: Practice Guidance vs Structured Feedback */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveRightTab('guidance')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeRightTab === 'guidance'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
              <span>Practice Guidance</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRightTab('feedback')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeRightTab === 'feedback'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Feedback &amp; STAR Rubric</span>
              {currentEvaluation && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-black">
                  {currentEvaluation.score}
                </span>
              )}
            </button>
          </div>

          {/* Active Right Panel */}
          <div className="flex-1 overflow-hidden">
            {activeRightTab === 'guidance' || !currentEvaluation ? (
              <MockGuidancePanel
                question={currentQuestion}
                framework="STAR-T (Situation, Task, Action, Trade-off, Result)"
                timeRecommendationMinutes={Math.round(config.timePerQuestionSeconds / 60) || 3}
              />
            ) : (
              <MockFeedbackPanel
                evaluation={currentEvaluation}
                onImproveAnswer={handleImproveAnswer}
                onShowExample={() => {}}
                onContinueNext={handleContinueNext}
                isLastQuestion={currentIndex >= questions.length - 1}
              />
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
