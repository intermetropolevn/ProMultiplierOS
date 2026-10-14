import React, { useState } from 'react';
import { 
  MessageSquare, 
  HelpCircle, 
  Clock, 
  Sparkles, 
  RotateCcw, 
  Square, 
  Edit3, 
  Check, 
  X, 
  CheckCircle2, 
  Volume2, 
  Mic 
} from 'lucide-react';
import { LiveTimelineItem } from '../../../types';

interface LiveConversationTimelineProps {
  timeline: LiveTimelineItem[];
  activeSpeakerId: string;
  interviewStatus: 'ready' | 'speaking' | 'listening' | 'paused' | 'ended';
  candidateName: string;
  onSelectDetectedQuestion?: (item: LiveTimelineItem) => void;
  onFinishCandidateTurn?: () => void;
  onRestartInterview?: () => void;
  onUpdateTurnText?: (itemId: string, newText: string) => void;
}

export const LiveConversationTimeline: React.FC<LiveConversationTimelineProps> = ({
  timeline,
  activeSpeakerId,
  interviewStatus,
  candidateName,
  onSelectDetectedQuestion,
  onFinishCandidateTurn,
  onRestartInterview,
  onUpdateTurnText,
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const isCandidateRecording = interviewStatus === 'listening';

  const handleStartEdit = (item: LiveTimelineItem) => {
    setEditingItemId(item.id);
    setEditText(item.text);
  };

  const handleSaveEdit = (itemId: string) => {
    if (onUpdateTurnText && editText.trim()) {
      onUpdateTurnText(itemId, editText.trim());
    }
    setEditingItemId(null);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleRestartClick = () => {
    if (window.confirm('Restart interview from the beginning? This will reset active dialogue turns.')) {
      if (onRestartInterview) onRestartInterview();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Conversation Transcript
          </h3>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-50 text-purple-800 border border-purple-200/60">
            {timeline.length + (isCandidateRecording ? 1 : 0)} Turns
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onRestartInterview && (
            <button
              type="button"
              onClick={handleRestartClick}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Restart Interview from Turn 1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Restart</span>
            </button>
          )}
        </div>
      </div>

      {/* Timeline / Transcript Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
        {timeline.length === 0 && !isCandidateRecording ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">Interview Ready to Start</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Click "Start Interview" in the Live Interview Room above or the top banner to begin dialogue turns.
            </p>
          </div>
        ) : (
          <>
            {timeline.map(item => {
              const isQuestion = !!item.isQuestion;
              const isTurnActive = item.speakerId === activeSpeakerId && interviewStatus === 'speaking';
              const isEditing = editingItemId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isQuestion && onSelectDetectedQuestion) {
                      onSelectDetectedQuestion(item);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isTurnActive
                      ? 'bg-purple-50/70 border-purple-400 shadow-xs ring-1 ring-purple-300'
                      : isQuestion
                        ? 'bg-amber-50/50 border-amber-200/90 hover:border-amber-300 cursor-pointer shadow-3xs'
                        : item.isInterviewer
                          ? 'bg-slate-50/70 border-slate-200/90'
                          : 'bg-white border-purple-100'
                  }`}
                >
                  {/* Speaker Header */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${
                        isQuestion 
                          ? 'text-amber-900' 
                          : item.isInterviewer 
                            ? 'text-slate-900' 
                            : 'text-purple-900'
                      }`}>
                        {item.speakerName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.timestamp}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                        item.isInterviewer ? 'bg-slate-100 text-slate-600' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.isInterviewer ? 'Interviewer' : 'Candidate'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isQuestion && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold tracking-wide border border-amber-300/60">
                          <HelpCircle className="w-3 h-3 text-amber-700" />
                          <span>QUESTION DETECTED</span>
                        </div>
                      )}

                      {!item.isInterviewer && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          Context-Cleaned Script
                        </span>
                      )}

                      {/* Edit Button for Candidate Turns */}
                      {!item.isInterviewer && !isEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(item);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                          title="Edit transcript turn"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Text Content or Edit Area */}
                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full text-xs sm:text-sm p-2 bg-white border border-purple-300 rounded-lg text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-400"
                        rows={3}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-3 py-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-md flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Save / Push Update</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {item.text}
                    </p>
                  )}

                  {/* Question Intent Badge */}
                  {isQuestion && item.detectedIntent && (
                    <div className="mt-2 pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-amber-900 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Intent: {item.detectedIntent}
                      </span>
                      <span className="text-amber-700 font-bold hover:underline cursor-pointer">
                        View Blueprint Match →
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* LIVE CANDIDATE RECORDING IN-PROGRESS TURN */}
            {isCandidateRecording && (
              <div className="p-3.5 rounded-xl border-2 border-dashed border-purple-400 bg-purple-50/60 shadow-xs animate-in fade-in duration-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-purple-900">
                      {candidateName} (You)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-600 text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Recording... Listening to your response
                    </span>
                  </div>

                  {onFinishCandidateTurn && (
                    <button
                      type="button"
                      onClick={onFinishCandidateTurn}
                      className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Square className="w-3 h-3 fill-white" />
                      <span>Finish Turn</span>
                    </button>
                  )}
                </div>

                {/* Animated Speech Waveform */}
                <div className="flex items-center gap-1 h-5 px-2 bg-purple-100/70 rounded-lg">
                  <Mic className="w-3 h-3 text-purple-700 animate-pulse mr-1" />
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1 bg-purple-600 rounded-full animate-pulse"
                      style={{
                        height: `${Math.max(4, Math.sin(i * 0.8) * 16 + 8)}px`,
                        animationDelay: `${(i % 5) * 120}ms`
                      }}
                    />
                  ))}
                  <span className="text-[10px] font-mono font-bold text-purple-800 ml-auto">
                    Voice stream active
                  </span>
                </div>

                <p className="text-[11px] text-purple-700 italic">
                  Speak your answer clearly. When finished speaking, click "Finish Turn" or pause naturally for silence detection.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
