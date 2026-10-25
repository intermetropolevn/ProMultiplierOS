import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  Pause, 
  ChevronRight, 
  ArrowRight, 
  Activity, 
  Sliders, 
  Award,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { ShadowSpeakingLesson, ShadowSpeakingLine } from '../../features/businessEnglish/types';
import { BusinessEnglishService } from '../../features/businessEnglish/services/businessEnglishService';
import { AudioPermissionGate } from '../common/AudioPermissionGate';
import { AudioPermissionService } from '../../services/audioPermissionService';

interface ShadowSpeakingStudioProps {
  className?: string;
}

export const ShadowSpeakingStudio: React.FC<ShadowSpeakingStudioProps> = ({
  className = ''
}) => {
  const lessons = BusinessEnglishService.getShadowLessons();
  const [selectedLesson, setSelectedLesson] = useState<ShadowSpeakingLesson>(lessons[0]);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);

  // Audio Playback & Mic State
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordedCurrentLine, setHasRecordedCurrentLine] = useState(false);
  const [lineFeedback, setLineFeedback] = useState<{
    accuracyScore: number;
    fluencyScore: number;
    rhythmScore: number;
    phoneticsFeedback: string;
    tips: string[];
  } | null>(null);
  const [isAudioGateOpen, setIsAudioGateOpen] = useState(false);

  // Release any active microphone stream on unmount
  useEffect(() => {
    return () => {
      AudioPermissionService.releaseStream();
    };
  }, []);

  const activeLine: ShadowSpeakingLine = selectedLesson.lines[activeLineIndex] || selectedLesson.lines[0];

  const handlePlayModelAudio = (text: string) => {
    setIsPlayingModelAudio(true);
    BusinessEnglishService.speak(text, () => {
      setIsPlayingModelAudio(false);
    });
  };

  const runShadowingCapture = () => {
    setIsRecording(true);
    setHasRecordedCurrentLine(false);

    // Capture speech & rhythm analysis
    setTimeout(() => {
      setIsRecording(false);
      setHasRecordedCurrentLine(true);
      const feedback = BusinessEnglishService.analyzeShadowAttempt(
        activeLine,
        activeLine.text.split(/\s+/).length
      );
      setLineFeedback(feedback);
      AudioPermissionService.releaseStream();
    }, 2800);
  };

  const handleRecordShadowing = async () => {
    if (isRecording) {
      setIsRecording(false);
      AudioPermissionService.releaseStream();
      return;
    }

    const { canStartImmediately } = await AudioPermissionService.initiateFeatureIntent('business_english');
    if (canStartImmediately) {
      runShadowingCapture();
    } else {
      setIsAudioGateOpen(true);
    }
  };

  const handleNextLine = () => {
    if (activeLineIndex < selectedLesson.lines.length - 1) {
      setActiveLineIndex(prev => prev + 1);
      setHasRecordedCurrentLine(false);
      setLineFeedback(null);
    }
  };

  const handlePrevLine = () => {
    if (activeLineIndex > 0) {
      setActiveLineIndex(prev => prev - 1);
      setHasRecordedCurrentLine(false);
      setLineFeedback(null);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Lesson Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-black text-slate-900">
              Select Shadow Speaking Cadence Lesson
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Native Speech Rhythm & Intonation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {lessons.map((les) => (
            <button
              key={les.id}
              type="button"
              onClick={() => {
                setSelectedLesson(les);
                setActiveLineIndex(0);
                setLineFeedback(null);
                setHasRecordedCurrentLine(false);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedLesson.id === les.id
                  ? 'bg-blue-50/80 border-blue-500 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>{les.topic}</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  les.difficulty === 'Foundational' ? 'bg-emerald-50 text-emerald-700' :
                  les.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                }`}>
                  {les.difficulty}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                {les.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Shadowing Stage Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Top Lesson Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {selectedLesson.topic}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {selectedLesson.title}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {selectedLesson.contextBackground}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              Line {activeLineIndex + 1} of {selectedLesson.lines.length}
            </span>
          </div>
        </div>

        {/* Sentence Natural Grouping & Waveform Visualization */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-inner">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Speaker: {activeLine.speaker} ({activeLine.role})
              </span>
            </div>

            <button
              type="button"
              onClick={() => handlePlayModelAudio(activeLine.text)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              {isPlayingModelAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingModelAudio ? 'Playing Model...' : 'Listen to Model'}</span>
            </button>
          </div>

          {/* Natural Phrasing Chunks */}
          <div className="space-y-3">
            <div className="text-xs text-slate-400 font-medium">
              Natural Rhythmic Phrase Chunks (Inhale / pause between blocks):
            </div>

            <div className="flex flex-wrap gap-2.5">
              {activeLine.naturalGrouping.map((chunk, cIdx) => (
                <div
                  key={cIdx}
                  className="px-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-sm sm:text-base font-semibold text-white tracking-wide shadow-xs flex items-center gap-2"
                >
                  <span>{chunk}</span>
                  {cIdx < activeLine.naturalGrouping.length - 1 && (
                    <span className="text-slate-500 text-xs font-mono">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Full Sentence with Highlighted Stress Words */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Stress & Phonetics Guidance:
            </div>
            <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
              "{activeLine.text}"
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-amber-400 font-bold">Key Stress Words:</span>
              {activeLine.stressWords.map((sw, swIdx) => (
                <span
                  key={swIdx}
                  className="text-xs px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30"
                >
                  {sw}
                </span>
              ))}
            </div>
            {activeLine.phoneticsHint && (
              <p className="text-xs text-indigo-300 pt-1 font-mono">
                💡 {activeLine.phoneticsHint}
              </p>
            )}
          </div>

          {/* Voice Shadowing Recording Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRecordShadowing}
                className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center gap-2.5 text-sm font-bold ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg'
                    : 'bg-white hover:bg-slate-100 text-slate-900 shadow-md'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-blue-600" />}
                <span>{isRecording ? 'Listening... Speak Now' : 'Repeat & Shadow This Line'}</span>
              </button>

              {hasRecordedCurrentLine && (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Recorded & Analyzed
                </span>
              )}
            </div>

            {/* Next / Prev Line Steppers */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevLine}
                disabled={activeLineIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Previous Line
              </button>

              <button
                type="button"
                onClick={handleNextLine}
                disabled={activeLineIndex === selectedLesson.lines.length - 1}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Next Line</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Speaking Analysis Feedback Box */}
        {lineFeedback && (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-black text-slate-900">
                  Cadence & Intonation Feedback
                </h4>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {lineFeedback.accuracyScore}% Cadence Match
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500">Rhythm & Timing</div>
                <div className="text-lg font-black text-blue-600">{lineFeedback.rhythmScore}%</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500">Fluency & Pacing</div>
                <div className="text-lg font-black text-purple-600">{lineFeedback.fluencyScore}%</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500">Pronunciation Match</div>
                <div className="text-lg font-black text-emerald-600">{lineFeedback.accuracyScore}%</div>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-700">
              <div className="font-bold text-slate-900">Coach Recommendations:</div>
              {lineFeedback.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Contextual Microphone Permission Gate — Only shown when user initiates voice shadowing */}
      <AudioPermissionGate
        isOpen={isAudioGateOpen}
        feature="business_english"
        subFeatureLabel="Shadowing & Pronunciation Practice"
        onClose={() => setIsAudioGateOpen(false)}
        onMicrophoneReady={() => {
          setIsAudioGateOpen(false);
          runShadowingCapture();
        }}
        onContinueWithoutMicrophone={() => {
          setIsAudioGateOpen(false);
          runShadowingCapture();
        }}
      />

    </div>
  );
};
