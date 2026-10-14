import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Square, 
  Radio, 
  AlertCircle, 
  CheckCircle2, 
  Globe2, 
  Clock, 
  Sparkles, 
  RefreshCw,
  Sliders
} from 'lucide-react';
import { SpeechProviderManager } from '../speech/SpeechProviderManager';
import { 
  RealtimeSpeechState, 
  RealtimeTranscriptEvent, 
  SpeechProviderType,
  SpeechProviderInfo
} from '../speech/types';
import { MOCK_SPEECH_SCENARIOS } from '../speech/adapters/MockSpeechAdapter';

interface RealtimeTranscriptBoxProps {
  onTranscriptFinalized?: (text: string) => void;
  className?: string;
  compact?: boolean;
}

export const RealtimeTranscriptBox: React.FC<RealtimeTranscriptBoxProps> = ({
  onTranscriptFinalized,
  className = '',
  compact = false,
}) => {
  const manager = SpeechProviderManager.getInstance();

  const [state, setState] = useState<RealtimeSpeechState>(manager.getState());
  const [providerType, setProviderType] = useState<SpeechProviderType>(manager.getActiveProviderType());
  const [providers, setProviders] = useState<SpeechProviderInfo[]>(manager.getAvailableProviders());
  const [statusMessage, setStatusMessage] = useState<string | null>(manager.getStatusMessage());
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [currentEvent, setCurrentEvent] = useState<RealtimeTranscriptEvent | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [showProviderMenu, setShowProviderMenu] = useState<boolean>(false);

  // Subscribe to real-time speech events and state
  useEffect(() => {
    const unsubTranscript = manager.subscribeToTranscript((event) => {
      setCurrentEvent(event);
      setDurationSeconds(event.timeline.duration);

      if (event.isFinal && event.finalTranscript && onTranscriptFinalized) {
        onTranscriptFinalized(event.finalTranscript);
      }
    });

    const unsubState = manager.subscribeToState?.((newState, msg) => {
      setState(newState);
      if (msg) setStatusMessage(msg);

      if (newState === 'ERROR') {
        setErrorNotice(msg || 'Speech recognition encountered an unexpected error.');
      } else if (newState === 'LISTENING' || newState === 'SPEAKING' || newState === 'READY') {
        if (newState !== 'READY') setErrorNotice(null);
      }
    });

    return () => {
      unsubTranscript();
      if (unsubState) unsubState();
    };
  }, [manager, onTranscriptFinalized]);

  // Duration counter when active
  useEffect(() => {
    let interval: any = null;
    if (state === 'LISTENING' || state === 'SPEAKING' || state === 'PROCESSING') {
      interval = setInterval(() => {
        setDurationSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state]);

  const handleStart = async () => {
    setErrorNotice(null);
    try {
      await manager.start();
    } catch (err: any) {
      console.warn('Speech start error:', err);
      setErrorNotice(err?.message || 'Could not start microphone.');
    }
  };

  const handlePause = () => {
    manager.pause();
  };

  const handleResume = () => {
    manager.resume();
  };

  const handleStop = () => {
    manager.stop();
  };

  const handleSwitchProvider = (type: SpeechProviderType) => {
    setErrorNotice(null);
    manager.switchProvider(type);
    setProviderType(type);
    setState(manager.getState());
    setStatusMessage(manager.getStatusMessage());
    setProviders(manager.getAvailableProviders());
    setShowProviderMenu(false);

    if (type === 'gemini_realtime' && !manager.isConfigured()) {
      setErrorNotice('Realtime speech provider not configured: Gemini real-time bidirectional streaming requires an active streaming gateway. Switch to Browser Web Speech or Mock Provider to continue.');
    }
  };

  const handleInjectSample = (text: string) => {
    manager.injectTestUtterance(text);
  };

  const isMicActive = state === 'LISTENING' || state === 'SPEAKING' || state === 'PROCESSING';

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // State styling helper
  const getStateBadge = () => {
    switch (state) {
      case 'READY':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-slate-800 text-slate-300 border border-slate-700">Ready</span>;
      case 'CONNECTING':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">Connecting</span>;
      case 'LISTENING':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Listening...</span>;
      case 'SPEAKING':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-950 text-blue-300 border border-blue-700 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Speaking</span>;
      case 'PROCESSING':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700">Processing</span>;
      case 'PAUSED':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-950 text-amber-300 border border-amber-800">Paused</span>;
      case 'STOPPED':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-slate-800 text-slate-400 border border-slate-700">Stopped</span>;
      case 'ERROR':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-rose-950 text-rose-300 border border-rose-800">Error</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-slate-900/90 rounded-2xl border border-slate-800 p-4 backdrop-blur-md shadow-xl text-slate-100 ${className}`}>
      {/* Header bar: Status, Microphone Indicator, and Provider Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          {/* Active Microphone Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            isMicActive 
              ? 'bg-rose-950/70 border-rose-600/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]' 
              : 'bg-slate-800/80 border-slate-700 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isMicActive ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'
            }`} />
            <span>{isMicActive ? 'Microphone Active' : 'Microphone Standby'}</span>
          </div>

          {getStateBadge()}
        </div>

        {/* Right tools: Duration & Provider Switcher */}
        <div className="flex items-center gap-2">
          {/* Timeline duration */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDuration(durationSeconds)}</span>
          </div>

          {/* Provider Selector Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProviderMenu(!showProviderMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 cursor-pointer transition-colors"
              title="Select speech adapter"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {providerType === 'web_speech' ? 'Web Speech' : providerType === 'gemini_realtime' ? 'Gemini Audio' : 'Mock Stream'}
              </span>
            </button>

            {showProviderMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-64 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Speech Provider
                </div>
                {providers.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSwitchProvider(p.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      providerType === p.id 
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
                        : 'hover:bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      {p.unconfiguredReason && (
                        <div className="text-[10px] text-amber-400">{p.unconfiguredReason}</div>
                      )}
                    </div>
                    {providerType === p.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error / Notice Display */}
      {errorNotice && (
        <div className="mt-3 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-200 flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold">Notice / Error</div>
            <div className="text-[11px] text-rose-300/90 mt-0.5">{errorNotice}</div>
            {providerType === 'gemini_realtime' && (
              <button
                type="button"
                onClick={() => handleSwitchProvider('web_speech')}
                className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-[11px] font-bold text-white border border-rose-700/50 cursor-pointer"
              >
                Switch to Browser Microphone
              </button>
            )}
            {providerType === 'web_speech' && errorNotice.includes('Browser speech recognition is not supported') && (
              <button
                type="button"
                onClick={() => handleSwitchProvider('mock')}
                className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-900/60 hover:bg-blue-800 text-[11px] font-bold text-white border border-blue-700/50 cursor-pointer"
              >
                Switch to Mock Provider
              </button>
            )}
          </div>
        </div>
      )}

      {/* Small Live Transcript Area */}
      <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 min-h-[90px] flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              {isMicActive ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Listening...</span>
                </>
              ) : (
                <span>Transcript Stream</span>
              )}
            </span>

            {/* Language Detection Pill */}
            {currentEvent?.language && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${
                currentEvent.language.isCodeSwitching
                  ? 'bg-purple-950/80 text-purple-300 border-purple-600/40'
                  : currentEvent.language.code === 'vi'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600/40'
                  : 'bg-blue-950/80 text-blue-300 border-blue-600/40'
              }`}>
                <Globe2 className="w-3 h-3" />
                {currentEvent.language.displayBadge}
              </span>
            )}
          </div>

          {/* Continuous Transcript Text */}
          <div className="text-sm leading-relaxed tracking-normal">
            {currentEvent?.fullTranscript ? (
              <p>
                {/* Stable Final Text */}
                <span className="text-slate-100 font-medium">
                  {currentEvent.finalTranscript}
                </span>
                {/* Visually Lighter Partial Text */}
                {currentEvent.partialTranscript && (
                  <span className="text-slate-400 font-normal italic opacity-90 pl-1">
                    {currentEvent.partialTranscript}
                  </span>
                )}
              </p>
            ) : (
              <p className="text-slate-500 italic text-xs">
                {isMicActive 
                  ? 'Listening for speech... Speak clearly into your microphone.' 
                  : 'Microphone standby. Click "Start Listening" or run a sample to test continuous transcription.'}
              </p>
            )}
          </div>
        </div>

        {/* Confidence rating when active */}
        {currentEvent && currentEvent.confidence > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
            <span>Speech Recognition Confidence: {Math.round(currentEvent.confidence * 100)}%</span>
            {currentEvent.language?.breakdown && currentEvent.language.isCodeSwitching && (
              <span className="text-purple-300 font-semibold">
                Mixed Speech Preserved (No auto-translation)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Controls: Start Listening, Pause, Stop */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {!isMicActive && state !== 'PAUSED' ? (
            <button
              type="button"
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer transition-all active:scale-95"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start Listening</span>
            </button>
          ) : state === 'PAUSED' ? (
            <button
              type="button"
              onClick={handleResume}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer transition-all"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          )}

          {(isMicActive || state === 'PAUSED') && (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer transition-all"
            >
              <Square className="w-3.5 h-3.5 text-rose-400" />
              <span>Stop</span>
            </button>
          )}
        </div>

        {/* Quick simulation sample triggers for fast interactive testing */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">
            Test Speech:
          </span>
          <button
            type="button"
            onClick={() => handleInjectSample('Em would first look at the activation funnel, sau đó compare retention by cohort.')}
            className="px-2.5 py-1 rounded-lg bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 border border-purple-600/40 text-[11px] font-medium cursor-pointer transition-all shrink-0"
            title="Inject Prompt's Bilingual Code-switching Example"
          >
            🇻🇳 Code-Switching Funnel
          </button>
          <button
            type="button"
            onClick={() => handleInjectSample('Can you describe a situation where you disagreed with your developers?')}
            className="px-2.5 py-1 rounded-lg bg-blue-950/70 hover:bg-blue-900/80 text-blue-200 border border-blue-600/40 text-[11px] font-medium cursor-pointer transition-all shrink-0"
          >
            Behavioral Disagreement
          </button>
        </div>
      </div>
    </div>
  );
};
