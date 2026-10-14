import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Layers, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  Play, 
  Pause,
  Award,
  ArrowRight
} from 'lucide-react';
import { TimedAssignment, TimedAssignmentType } from '../../../types';
import { TIMED_ASSIGNMENTS_DATA } from '../../../data/timedAssignmentsData';

interface TimedAssignmentViewProps {
  initialAssignmentType?: TimedAssignmentType;
  onSubmitAssignment: (assignmentId: string, answer: string, timeSpentSeconds: number) => void;
}

export const TimedAssignmentView: React.FC<TimedAssignmentViewProps> = ({
  initialAssignmentType = 'Behavioral',
  onSubmitAssignment,
}) => {
  const [selectedType, setSelectedType] = useState<TimedAssignmentType>(initialAssignmentType);
  const [currentAssignment, setCurrentAssignment] = useState<TimedAssignment>(() => {
    return TIMED_ASSIGNMENTS_DATA.find(a => a.type === initialAssignmentType) || TIMED_ASSIGNMENTS_DATA[0];
  });

  const [timeRemaining, setTimeRemaining] = useState<number>(currentAssignment.timeLimitSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [candidateResponse, setCandidateResponse] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // When assignment changes, reset state
  const handleSelectAssignment = (assign: TimedAssignment) => {
    setCurrentAssignment(assign);
    setSelectedType(assign.type);
    setTimeRemaining(assign.timeLimitSeconds);
    setIsTimerRunning(true);
    setCandidateResponse('');
    setIsSubmitted(false);
    setTimeSpent(0);
  };

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !isSubmitted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Auto submit when timer reaches 0 if there is text
            return 0;
          }
          return prev - 1;
        });
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted, timeRemaining]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / currentAssignment.timeLimitSeconds) * 100));

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!candidateResponse.trim()) return;

    setIsSubmitted(true);
    setIsTimerRunning(false);
    onSubmitAssignment(currentAssignment.id, candidateResponse.trim(), timeSpent);
  };

  const handleReset = () => {
    setTimeRemaining(currentAssignment.timeLimitSeconds);
    setIsTimerRunning(true);
    setCandidateResponse('');
    setIsSubmitted(false);
    setTimeSpent(0);
  };

  const wordCount = candidateResponse.trim() ? candidateResponse.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      
      {/* 1. Header: Assignment Selector Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Select Timed Interview Assignment Track
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">
            Constrained-time interview calibration
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {TIMED_ASSIGNMENTS_DATA.map(assign => (
            <button
              key={assign.id}
              type="button"
              onClick={() => handleSelectAssignment(assign)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                currentAssignment.id === assign.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {assign.type} ({Math.round(assign.timeLimitSeconds / 60)} min)
            </button>
          ))}
        </div>
      </div>

      {/* 2. Challenge Card & Countdown Timer */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
              {currentAssignment.type} Assignment
            </span>
            <h3 className="text-base font-extrabold text-white mt-1">
              {currentAssignment.title}
            </h3>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono text-base font-black ${
              timeRemaining < 30
                ? 'bg-rose-950/80 border-rose-500 text-rose-400 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-100'
            }`}>
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{formatTimer(timeRemaining)}</span>
            </div>

            {/* Timer Play/Pause & Reset */}
            {!isSubmitted && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(prev => !prev)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Reset Assignment"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Prompt */}
        <div className="space-y-1.5">
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            "{currentAssignment.prompt}"
          </p>
          <p className="text-[11px] text-slate-400">
            {currentAssignment.context}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              timeRemaining < 30 ? 'bg-rose-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Candidate Response Area OR Submission State */}
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold">Your Solution / Spoken Script:</span>
            <span>{wordCount} words typed</span>
          </div>

          <textarea
            value={candidateResponse}
            onChange={(e) => setCandidateResponse(e.target.value)}
            placeholder="Type your structured solution under the timed constraint... Include technical decisions, trade-offs, and metrics."
            rows={7}
            disabled={timeRemaining === 0}
            className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none font-normal leading-relaxed text-slate-800"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-400">
              {timeRemaining === 0 ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Time expired! Click Submit to evaluate.
                </span>
              ) : (
                <span>Simulating real-world hiring loop pressure. Submit before time expires.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={!candidateResponse.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Submit Assignment</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      ) : (
        /* Submission Completed View */
        <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Timed Assignment Completed!
                </h4>
                <p className="text-xs text-slate-600">
                  Time taken: {formatTimer(timeSpent)} • Words: {wordCount} words
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Assignment</span>
            </button>
          </div>

          {/* Candidate response copy */}
          <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed max-h-[140px] overflow-y-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Your Submitted Answer
            </span>
            {candidateResponse}
          </div>

          {/* Calibrated Model Solution */}
          <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Calibrated Benchmark Answer
            </span>
            <p className="leading-relaxed text-slate-700 font-normal">
              {currentAssignment.sampleStrongAnswer}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
