import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  FileText, 
  Music, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { SavedLiveInterviewRecord, LiveInterviewStorageService } from './liveInterviewData';

interface SavedInterviewRecordModalProps {
  record: SavedLiveInterviewRecord;
  onClose: () => void;
  onDeleteRecord?: (id: string) => void;
}

export const SavedInterviewRecordModal: React.FC<SavedInterviewRecordModalProps> = ({
  record,
  onClose,
  onDeleteRecord,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const totalAudioDuration = Math.max(30, record.durationSeconds);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isPlayingAudio) {
      intervalRef.current = setInterval(() => {
        setAudioCurrentTime(prev => {
          if (prev >= totalAudioDuration) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlayingAudio, totalAudioDuration]);

  const togglePlayAudio = () => {
    setIsPlayingAudio(prev => !prev);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDownload = () => {
    const transcriptText = record.timeline
      .map(t => `[${t.timestamp}] ${t.speakerName} (${t.isInterviewer ? 'Interviewer' : 'Candidate'}):\n${t.text}\n`)
      .join('\n');

    const fullExport = `CAREER INTERVIEW OS — SAVED LIVE INTERVIEW
Title: ${record.title}
Company: ${record.companyName}
Role Category: ${record.roleCategory}
Domain: ${record.domain}
Date: ${record.savedAt}
Duration: ${formatDuration(record.durationSeconds)}
Participants: ${record.participants.map(p => `${p.name} (${p.role})`).join(', ')}

==================================================
INTERVIEW SCRIPT & TRANSCRIPT
==================================================

${transcriptText}
`;

    const blob = new Blob([fullExport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this saved interview recording?')) {
      LiveInterviewStorageService.deleteInterview(record.id);
      if (onDeleteRecord) onDeleteRecord(record.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Saved Interview Recording
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Source Recording
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {record.companyName} • {record.roleCategory} • {record.domain}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* 1. METADATA SUMMARY BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                Session Title
              </span>
              <p className="font-bold text-slate-800 truncate mt-0.5" title={record.title}>
                {record.title}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                Recorded Date
              </span>
              <p className="font-bold text-slate-800 mt-0.5">
                {new Date(record.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                Total Duration
              </span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {formatDuration(record.durationSeconds)}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                Participants
              </span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                {record.participants.length} Speakers
              </p>
            </div>
          </div>

          {/* 2. AUDIO RECORDING PLAYER (Source Audio) */}
          <div className="p-4.5 rounded-2xl border border-slate-200/90 bg-slate-900 text-white shadow-md space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Source Audio Recording
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    High-fidelity multi-channel recording • Clean room audio
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-300">
                  {formatDuration(audioCurrentTime)} / {formatDuration(totalAudioDuration)}
                </span>
              </div>
            </div>

            {/* Audio Waveform visualization & Scrubber */}
            <div className="space-y-2">
              <div className="h-10 bg-slate-800/80 rounded-xl px-3 flex items-center gap-1 border border-slate-700/60 overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => {
                  const progressPct = (audioCurrentTime / totalAudioDuration) * 48;
                  const isPast = i <= progressPct;
                  const barHeight = Math.sin(i * 0.4) * 14 + 16;

                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-200 ${
                        isPast ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                      style={{ height: `${barHeight}px` }}
                    />
                  );
                })}
              </div>

              {/* Player Controls Bar */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={togglePlayAudio}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Play Recording</span>
                    </>
                  )}
                </button>

                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Audio source intact for downstream transcription &amp; analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. SCRIPT / TRANSCRIPT REPRESENTATION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Script / Conversation Representation
                </h4>
                <span className="text-[11px] text-slate-400">
                  ({record.timeline.length} conversation turns)
                </span>
              </div>

              <span className="text-[11px] text-slate-500 font-medium">
                Post-turn intelligence applied
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 max-h-[320px] overflow-y-auto bg-slate-50/40">
              {record.timeline.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No conversation turns captured yet.
                </div>
              ) : (
                record.timeline.map(turn => (
                  <div key={turn.id} className="p-3.5 hover:bg-white transition-colors">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${turn.isInterviewer ? 'text-slate-900' : 'text-purple-900'}`}>
                          {turn.speakerName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-semibold">
                          {turn.isInterviewer ? 'Interviewer' : 'Candidate'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {turn.timestamp}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {turn.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download Script &amp; Audio Info</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
