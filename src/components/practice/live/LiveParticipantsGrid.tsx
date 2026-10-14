import React from 'react';
import { Mic, MicOff, Volume2, UserCheck, Play, Settings2, Sparkles, Pause } from 'lucide-react';
import { LiveParticipant } from '../../../types';

interface LiveParticipantsGridProps {
  participants: LiveParticipant[];
  activeSpeakerId: string;
  onSelectActiveSpeaker: (id: string) => void;
  interviewStatus: 'ready' | 'speaking' | 'listening' | 'paused' | 'ended';
  onStartInterview: () => void;
  onOpenPrepareModal: () => void;
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
      {/* Header / Active Turn Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Live Interview Room
          </h3>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600">
            {participants.length} Participants
          </span>
          <span className="text-slate-300">•</span>
          <span className={`text-[11px] font-bold ${
            isReady 
              ? 'text-amber-600' 
              : interviewStatus === 'paused'
                ? 'text-slate-500'
                : 'text-emerald-600'
          }`}>
            Status: {isReady ? 'Ready to start' : interviewStatus === 'paused' ? 'Session paused' : 'Active Session'}
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
                <span>Prepare Interview</span>
              </button>

              <button
                type="button"
                onClick={onStartInterview}
                className="px-3 py-1 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Interview</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200/70">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
              </span>
              <span>
                {activeSpeaker?.isInterviewer
                  ? `${activeSpeaker.name} (Interviewer Turn)`
                  : 'Candidate Turn (You)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Participant Cards / Speaker Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {participants.map(participant => {
          const isActive = !isReady && participant.id === activeSpeakerId;

          return (
            <div
              key={participant.id}
              onClick={() => {
                if (!isReady) onSelectActiveSpeaker(participant.id);
              }}
              className={`relative p-3.5 rounded-xl border transition-all select-none flex flex-col justify-between min-h-[115px] ${
                isReady
                  ? 'bg-slate-50/70 text-slate-800 border-slate-200 cursor-default'
                  : isActive
                    ? 'bg-slate-900 text-white border-purple-500 shadow-md ring-2 ring-purple-500/30 cursor-pointer'
                    : 'bg-slate-50/70 text-slate-800 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300 cursor-pointer'
              }`}
            >
              {/* Top Row: Avatar + Speaking wave */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-2xs ${
                    isActive
                      ? participant.avatarColor + ' text-white ring-2 ring-purple-400'
                      : participant.avatarColor + ' text-white'
                  }`}>
                    {participant.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {participant.name}
                      </p>
                    </div>
                    <p className={`text-[11px] font-medium leading-tight truncate max-w-[130px] ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {participant.role}
                    </p>
                  </div>
                </div>

                {/* Microphone / Audio Wave Animation when active */}
                {isActive ? (
                  <div className="flex items-center gap-1 bg-purple-600/40 border border-purple-400/50 px-2 py-1 rounded-md">
                    <div className="flex items-center gap-0.5 h-3.5">
                      <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
                      <span className="w-0.5 h-4 bg-emerald-400 rounded-full animate-pulse [animation-delay:150ms]"></span>
                      <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-pulse [animation-delay:300ms]"></span>
                      <span className="w-0.5 h-4.5 bg-emerald-400 rounded-full animate-pulse [animation-delay:450ms]"></span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 ml-1">
                      {participant.isInterviewer ? 'Speaking' : 'Listening'}
                    </span>
                  </div>
                ) : (
                  <div className="p-1.5 rounded-md text-slate-400">
                    <MicOff className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Bottom Row: Status badge */}
              <div className="mt-3 pt-2 border-t flex items-center justify-between text-[11px] border-slate-200/40">
                <span className={`font-semibold ${isActive ? 'text-purple-300' : 'text-slate-500'}`}>
                  {participant.isInterviewer ? 'Interviewer' : 'Candidate (You)'}
                </span>

                {isReady ? (
                  <span className="text-[10px] font-medium text-slate-400">
                    Standby
                  </span>
                ) : isActive ? (
                  <span className="text-[10px] font-bold text-purple-200 bg-purple-900/60 px-1.5 py-0.5 rounded border border-purple-400/30">
                    {participant.isInterviewer ? '● Speaking' : '● Recording'}
                  </span>
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
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>
          {isReady 
            ? 'Panel configured and ready. Click Start Interview when ready to begin speaking.'
            : 'Click any participant to switch active speaker turn.'}
        </span>
        <span className="font-semibold text-slate-600">
          Turn-based voice interaction &amp; speaker detection
        </span>
      </div>
    </div>
  );
};
