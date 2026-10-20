import React from 'react';
import { Mic, MicOff, Volume2, UserCheck, Play, Settings2 } from 'lucide-react';
import { LiveParticipant } from '../../../types';

interface LiveParticipantsGridProps {
  participants: LiveParticipant[];
  activeSpeakerId: string;
  onSelectActiveSpeaker: (id: string) => void;
  interviewStatus: 'ready' | 'speaking' | 'listening' | 'paused' | 'ended';
  onStartInterview: () => void;
  onOpenPrepareModal: () => void;
  audioActivityLevel?: number; // 0 - 100
}

export const LiveParticipantsGrid: React.FC<LiveParticipantsGridProps> = ({
  participants,
  activeSpeakerId,
  onSelectActiveSpeaker,
  interviewStatus,
  onStartInterview,
  onOpenPrepareModal,
}) => {
  const activeSpeaker = participants.find(p => p.id === activeSpeakerId) || participants[0];
  const isReady = interviewStatus === 'ready';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
      
      {/* Room Header & Unified Active Turn Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Live Interview Room
          </h3>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600">
            {participants.length} Participants
          </span>
          <span className="text-slate-300">•</span>
          <span className={`text-[11px] font-semibold ${
            isReady 
              ? 'text-amber-600' 
              : interviewStatus === 'paused'
                ? 'text-slate-500'
                : 'text-slate-600'
          }`}>
            {isReady ? 'Ready to begin' : interviewStatus === 'paused' ? 'Paused' : 'Active Session'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isReady ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenPrepareModal}
                className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-purple-700 bg-slate-50 hover:bg-purple-50 border border-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Settings2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Prepare</span>
              </button>

              <button
                type="button"
                onClick={onStartInterview}
                className="px-3.5 py-1 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Interview</span>
              </button>
            </div>
          ) : (
            /* Clear Room-level Turn Identifier (Requirement 9) */
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span>
                {activeSpeaker?.isInterviewer
                  ? `${activeSpeaker.name} · Interviewer Turn`
                  : 'Candidate Turn · You'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Participant Cards Grid (Requirements 6, 7, 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {participants.map(participant => {
          const isActive = !isReady && participant.id === activeSpeakerId && interviewStatus !== 'paused';
          const isInterviewer = participant.isInterviewer;

          // Participant Visual Family (Requirement 7):
          // All interviewers share the SAME cool slate visual family.
          // Candidate uses a distinct blue highlighted family.
          // Active state is layered on top with border + pulse.
          const cardBackgroundClasses = isInterviewer
            ? isActive
              ? 'bg-slate-100/90 text-slate-900 border-purple-500 shadow-sm ring-2 ring-purple-400/30'
              : 'bg-slate-50/70 text-slate-800 border-slate-200 hover:bg-slate-100/70'
            : isActive
              ? 'bg-blue-50/90 text-blue-950 border-blue-500 shadow-sm ring-2 ring-blue-500/30'
              : 'bg-blue-50/40 text-slate-800 border-blue-200/80 hover:bg-blue-50/70';

          return (
            <div
              key={participant.id}
              onClick={() => {
                if (!isReady) onSelectActiveSpeaker(participant.id);
              }}
              className={`relative p-3.5 rounded-xl border transition-all select-none flex flex-col justify-between min-h-[110px] cursor-pointer ${cardBackgroundClasses}`}
            >
              {/* Top Row: Avatar + Name + Role */}
              <div className="flex items-start gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-3xs shrink-0 ${
                  isInterviewer 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {participant.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold leading-snug text-slate-900 truncate">
                    {participant.name}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 truncate">
                    {participant.role}
                  </p>
                </div>
              </div>

              {/* Bottom Row: Clear Single Status Hierarchy (Requirements 6 & 8) */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                {/* Role Badge */}
                <span className={`font-semibold ${
                  isInterviewer ? 'text-slate-500' : 'text-blue-700'
                }`}>
                  {isInterviewer ? 'Interviewer' : 'Candidate'}
                </span>

                {/* Single State Badge with Animated Waveform Icon */}
                {isReady ? (
                  <span className="text-[10px] font-medium text-slate-400">
                    Standby
                  </span>
                ) : isActive ? (
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-3xs ${
                    isInterviewer
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-blue-100 text-blue-900 border-blue-300'
                  }`}>
                    {/* Subtle Animated Voice Waveform (Requirement 6) */}
                    <div className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-2 bg-current rounded-full animate-pulse"></span>
                      <span className="w-0.5 h-3 bg-current rounded-full animate-pulse [animation-delay:150ms]"></span>
                      <span className="w-0.5 h-1.5 bg-current rounded-full animate-pulse [animation-delay:300ms]"></span>
                      <span className="w-0.5 h-3 bg-current rounded-full animate-pulse [animation-delay:450ms]"></span>
                    </div>
                    <span>
                      {isInterviewer ? 'Speaking' : 'Recording'}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400">
                    Listening
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-0.5">
        <span>
          {isReady 
            ? 'Panel ready. Click Start Interview when ready to begin speaking.'
            : 'Turn-based dialogue active. Click any participant to switch active turn.'}
        </span>
        <span className="font-semibold text-slate-600">
          Auto-synchronized voice engine
        </span>
      </div>
    </div>
  );
};
