import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Square, 
  Circle, 
  Play, 
  Save, 
  ArrowLeft, 
  LogOut, 
  CheckCircle2, 
  Settings2, 
  Pause,
  Sparkles
} from 'lucide-react';
import { 
  InterviewConfig, 
  LiveParticipant, 
  LiveTimelineItem 
} from '../../../types';
import { LiveParticipantsGrid } from './LiveParticipantsGrid';
import { LiveConversationTimeline } from './LiveConversationTimeline';
import { LiveCopilotPanel } from './LiveCopilotPanel';
import { PreInterviewProcessingModal } from './PreInterviewProcessingModal';
import { SavedInterviewRecordModal } from './SavedInterviewRecordModal';
import { 
  ConfiguredBlueprint, 
  ALL_SYSTEM_BLUEPRINTS, 
  SavedLiveInterviewRecord, 
  LiveInterviewStorageService,
  createConfiguredBlueprint
} from './liveInterviewData';
import { useAccessControl } from '../../../services/accessControlService';
import { LiveInterviewEcosystemService } from '../../../services/liveInterviewEcosystemService';
import {
  ConnectedEcosystemChainStrip,
  InterviewIntelligenceOutcomePanel
} from '../InterviewIntelligenceOutcomePanel';
import { ProtectedFrameworkAttribution } from '../../access/ProtectedPreviewOverlay';
import { AudioPermissionGate } from '../../common/AudioPermissionGate';
import { AudioPermissionService } from '../../../services/audioPermissionService';

interface LiveInterviewWorkspaceProps {
  config: InterviewConfig;
  onExit: () => void;
  onOpenMissionControl?: () => void;
}

export type LiveInterviewStatus = 'ready' | 'speaking' | 'listening' | 'paused' | 'ended';

export const LiveInterviewWorkspace: React.FC<LiveInterviewWorkspaceProps> = ({
  config,
  onExit,
  onOpenMissionControl,
}) => {
  // 1. Session & Timing State - DEFAULT TO IDLE / READY (NO AUTO-PLAY!)
  const [interviewStatus, setInterviewStatus] = useState<LiveInterviewStatus>('ready');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showTranscriptWhileEnded, setShowTranscriptWhileEnded] = useState(false);

  // Modals state
  const [isPrepareModalOpen, setIsPrepareModalOpen] = useState(false);
  const [activeSavedRecord, setActiveSavedRecord] = useState<SavedLiveInterviewRecord | null>(null);

  // 2. Participants State
  const [participants, setParticipants] = useState<LiveParticipant[]>([
    {
      id: 'p-interviewer-1',
      name: 'Sarah Chen',
      role: 'Engineering Lead',
      isInterviewer: true,
      avatarColor: 'bg-purple-600',
    },
    {
      id: 'p-interviewer-2',
      name: 'David Kim',
      role: 'Technical Interviewer',
      isInterviewer: true,
      avatarColor: 'bg-indigo-600',
    },
    {
      id: 'p-candidate',
      name: 'Alex Rivera (You)',
      role: `Candidate • ${config.roleCategory}`,
      isInterviewer: false,
      avatarColor: 'bg-blue-600',
    }
  ]);

  const { accessLevel } = useAccessControl();
  const upstreamContext = LiveInterviewEcosystemService.resolveUpstreamContext(config);

  const getInitialBlueprints = (): ConfiguredBlueprint[] => {
    // Use role-aligned Q&A Blueprints from the connected upstream ecosystem if available
    if (upstreamContext.qaBlueprints.length > 0) {
      const mapped = upstreamContext.qaBlueprints.map((canonical, idx) =>
        createConfiguredBlueprint(
          canonical,
          idx % 2 === 0 ? 'p-interviewer-1' : 'p-interviewer-2',
          idx % 2 === 0 ? 'Sarah Chen' : 'David Kim',
          idx % 2 === 0 ? 'Engineering Lead' : 'Technical Interviewer',
          'ai_recommended'
        )
      );
      if (accessLevel === 'PUBLIC' || accessLevel === 'GUEST') return mapped.slice(0, 1);
      if (accessLevel === 'DEMO') return mapped.slice(0, 2);
      return mapped;
    }

    const raw: ConfiguredBlueprint[] = [
      {
        ...ALL_SYSTEM_BLUEPRINTS[0],
        interviewerId: 'p-interviewer-1',
        interviewerName: 'Sarah Chen',
        interviewerRole: 'Engineering Lead',
        source: 'ai_recommended'
      },
      {
        ...ALL_SYSTEM_BLUEPRINTS[1],
        interviewerId: 'p-interviewer-2',
        interviewerName: 'David Kim',
        interviewerRole: 'Technical Interviewer',
        source: 'ai_recommended'
      },
      {
        ...ALL_SYSTEM_BLUEPRINTS[2],
        interviewerId: 'p-interviewer-1',
        interviewerName: 'Sarah Chen',
        interviewerRole: 'Engineering Lead',
        source: 'manually_added'
      }
    ];
    if (accessLevel === 'PUBLIC' || accessLevel === 'GUEST') return raw.slice(0, 1);
    if (accessLevel === 'DEMO') return raw.slice(0, 2);
    return raw;
  };

  // 3. Configured Blueprints (from Pre-Interview Processing setup)
  const [configuredBlueprints, setConfiguredBlueprints] = useState<ConfiguredBlueprint[]>(getInitialBlueprints);

  // 4. Shared Active State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>('p-interviewer-1');
  const [activeBlueprintId, setActiveBlueprintId] = useState<string | null>(configuredBlueprints[0]?.id || null);

  // 5. Conversation Transcript Timeline
  const [timeline, setTimeline] = useState<LiveTimelineItem[]>([]);

  // 6. Contextual Microphone Permission Gate State
  const [isAudioGateOpen, setIsAudioGateOpen] = useState<boolean>(false);
  const [isNonVoiceMode, setIsNonVoiceMode] = useState<boolean>(false);

  // Timer & Speech References
  const timerRef = useRef<any>(null);
  const turnTimeoutRef = useRef<any>(null);
  const candidateSilenceTimerRef = useRef<any>(null);

  // Elapsed recording timer - ONLY runs when active
  useEffect(() => {
    if (interviewStatus === 'speaking' || interviewStatus === 'listening') {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interviewStatus]);

  // Cleanup timers, voice & microphone stream on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (turnTimeoutRef.current) clearTimeout(turnTimeoutRef.current);
      if (candidateSilenceTimerRef.current) clearTimeout(candidateSilenceTimerRef.current);
      AudioPermissionService.releaseStream();
    };
  }, []);

  // Format seconds to mm:ss
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Safe Speech Synthesis with timeout fallback
  const speakInterviewerPrompt = (text: string, onFinish: () => void) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to pick a natural English voice if available
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
        if (englishVoice) utterance.voice = englishVoice;

        let hasFinished = false;
        utterance.onend = () => {
          if (!hasFinished) {
            hasFinished = true;
            onFinish();
          }
        };
        utterance.onerror = () => {
          if (!hasFinished) {
            hasFinished = true;
            onFinish();
          }
        };

        window.speechSynthesis.speak(utterance);

        // Fallback timer in case onend doesn't trigger
        const estimatedDurationMs = Math.max(3500, Math.min(8000, text.split(' ').length * 300));
        turnTimeoutRef.current = setTimeout(() => {
          if (!hasFinished) {
            hasFinished = true;
            onFinish();
          }
        }, estimatedDurationMs);
        return;
      } catch (e) {
        console.warn('Speech synthesis error, falling back to simulated delay', e);
      }
    }

    // Fallback if speechSynthesis is unavailable
    turnTimeoutRef.current = setTimeout(onFinish, 4000);
  };

  // Start specific question turn
  const runQuestionTurn = (index: number) => {
    if (index >= configuredBlueprints.length) {
      // Completed all questions in the set -> Transition to finished intelligence signals
      setInterviewStatus('ended');
      setShowTranscriptWhileEnded(false);
      return;
    }

    const currentBp = configuredBlueprints[index];
    if (!currentBp) return;

    // 1. Interviewer speaks
    setInterviewStatus('speaking');
    setActiveSpeakerId(currentBp.interviewerId);
    setActiveBlueprintId(currentBp.id);
    setCurrentQuestionIndex(index);

    // Add interviewer question turn to timeline
    const interviewerTurn: LiveTimelineItem = {
      id: `turn-int-${Date.now()}`,
      speakerId: currentBp.interviewerId,
      speakerName: currentBp.interviewerName,
      isInterviewer: true,
      timestamp: formatSeconds(recordingSeconds),
      text: currentBp.questionText,
      isQuestion: true,
      detectedIntent: currentBp.topic,
      matchedBlueprintId: currentBp.id
    };

    setTimeline(prev => {
      // Avoid duplicate consecutive identical question
      const last = prev[prev.length - 1];
      if (last && last.text === currentBp.questionText) return prev;
      return [...prev, interviewerTurn];
    });

    // Speak interviewer dialogue
    speakInterviewerPrompt(currentBp.questionText, () => {
      // 2. Transition to Candidate Turn
      setInterviewStatus('listening');
      setActiveSpeakerId('p-candidate');

      // Candidate natural silence detection timer (12 seconds)
      candidateSilenceTimerRef.current = setTimeout(() => {
        handleFinishCandidateTurn();
      }, 12000);
    });
  };

  // Candidate finishes speaking their turn
  const handleFinishCandidateTurn = () => {
    if (candidateSilenceTimerRef.current) clearTimeout(candidateSilenceTimerRef.current);

    const currentBp = configuredBlueprints[currentQuestionIndex];
    if (!currentBp) return;

    // Generate context-aware response based on candidate's blueprint evidence
    const candidateAnswerText = currentBp.blueprint.opening 
      + ' ' + currentBp.blueprint.situation 
      + ' ' + currentBp.blueprint.action.slice(0, 2).join(' Furthermore, ') 
      + ' As a result, ' + (currentBp.blueprint.result[0] || 'we delivered measurable impact on schedule with zero customer-facing regressions.');

    const candidateTurn: LiveTimelineItem = {
      id: `turn-cand-${Date.now()}`,
      speakerId: 'p-candidate',
      speakerName: 'Alex Rivera (You)',
      isInterviewer: false,
      timestamp: formatSeconds(recordingSeconds),
      text: candidateAnswerText,
      isQuestion: false
    };

    setTimeline(prev => [...prev, candidateTurn]);

    // Advance to next question after a brief pause
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < configuredBlueprints.length) {
      turnTimeoutRef.current = setTimeout(() => {
        runQuestionTurn(nextIdx);
      }, 1800);
    } else {
      // Completed final question -> show connected Live Interview Intelligence outcome
      AudioPermissionService.releaseStream();
      setInterviewStatus('ended');
      setShowTranscriptWhileEnded(false);
    }
  };

  // Complete session at any time to inspect signals
  const handleFinishAndShowSignals = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (turnTimeoutRef.current) clearTimeout(turnTimeoutRef.current);
    if (candidateSilenceTimerRef.current) clearTimeout(candidateSilenceTimerRef.current);
    AudioPermissionService.releaseStream();
    setInterviewStatus('ended');
    setShowTranscriptWhileEnded(false);
  };

  // Explicit contextual trigger: Feature Intent -> Mic Pre-flight -> Browser Permission -> Mic Ready -> Session Started
  const requestStartLiveSession = async () => {
    if (isNonVoiceMode) {
      runQuestionTurn(0);
      return;
    }
    const { canStartImmediately } = await AudioPermissionService.initiateFeatureIntent('live_interview');
    if (canStartImmediately) {
      runQuestionTurn(0);
    } else {
      setIsAudioGateOpen(true);
    }
  };

  // 1. TOP BANNER GROUP 1: [Start / Pause / Resume]
  const handleStartOrPause = () => {
    if (interviewStatus === 'ready') {
      requestStartLiveSession();
    } else if (interviewStatus === 'speaking' || interviewStatus === 'listening') {
      // Pause
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      if (turnTimeoutRef.current) clearTimeout(turnTimeoutRef.current);
      if (candidateSilenceTimerRef.current) clearTimeout(candidateSilenceTimerRef.current);
      AudioPermissionService.releaseStream();
      setInterviewStatus('paused');
    } else if (interviewStatus === 'paused') {
      // Resume
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      runQuestionTurn(currentQuestionIndex);
    } else if (interviewStatus === 'ended') {
      handleRestartInterview();
    }
  };

  // 2. TOP BANNER GROUP 2: [Save]
  const handleSaveInterview = () => {
    const record: SavedLiveInterviewRecord = {
      id: `saved-interview-${Date.now()}`,
      title: `${config.companyName || 'Apex Financial'} — ${configuredBlueprints[0]?.title || 'Architecture & Leadership Panel'}`,
      companyName: config.companyName || 'Apex Financial Technologies',
      roleCategory: config.roleCategory,
      domain: config.domain,
      savedAt: new Date().toISOString(),
      durationSeconds: recordingSeconds,
      participants,
      timeline,
      audioPlaybackSeconds: recordingSeconds,
      isSimulatedAudio: true,
    };

    LiveInterviewStorageService.saveInterview(record);
    setActiveSavedRecord(record);
  };

  // 3. TOP BANNER GROUP 3: [End Interview]
  const handleEndInterview = () => {
    if (interviewStatus !== 'ended' && timeline.length > 0) {
      handleFinishAndShowSignals();
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    AudioPermissionService.releaseStream();
    onExit();
  };

  // Pre-Interview Setup completion
  const handleSaveAndLoadQASet = (newInterviewers: LiveParticipant[], newBlueprints: ConfiguredBlueprint[]) => {
    setParticipants(prev => {
      const candidate = prev.find(p => !p.isInterviewer) || {
        id: 'p-candidate',
        name: 'Alex Rivera (You)',
        role: `Candidate • ${config.roleCategory}`,
        isInterviewer: false,
        avatarColor: 'bg-blue-600',
      };
      return [...newInterviewers, candidate];
    });

    setConfiguredBlueprints(newBlueprints);
    if (newBlueprints.length > 0) {
      setActiveBlueprintId(newBlueprints[0].id);
    }
    setIsPrepareModalOpen(false);
  };

  // Restart Interview from beginning
  const handleRestartInterview = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (turnTimeoutRef.current) clearTimeout(turnTimeoutRef.current);
    if (candidateSilenceTimerRef.current) clearTimeout(candidateSilenceTimerRef.current);
    AudioPermissionService.releaseStream();

    setTimeline([]);
    setRecordingSeconds(0);
    setCurrentQuestionIndex(0);
    setActiveBlueprintId(configuredBlueprints[0]?.id || null);
    setActiveSpeakerId(configuredBlueprints[0]?.interviewerId || 'p-interviewer-1');
    setInterviewStatus('ready');
    setShowTranscriptWhileEnded(false);
  };

  // Edit transcript turn text
  const handleUpdateTurnText = (itemId: string, newText: string) => {
    setTimeline(prev => prev.map(t => (t.id === itemId ? { ...t, text: newText } : t)));
  };

  const interviewOutcome = LiveInterviewEcosystemService.synthesizeInterviewOutcome({
    config,
    timeline
  });

  return (
    <div className="max-w-[1560px] mx-auto space-y-4 pb-12">
      
      {/* 
        ==================================================
        SIMPLIFIED TOP LIVE INTERVIEW BANNER
        Contains ONLY the four requested functional groups:
        [Start/Pause] | [Save] | [End Interview] | [REC 03:07]
        Banner Label: Live Interview Copilot
        ==================================================
      */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Mode Badge & Target Role */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Exit Live Interview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/90 text-purple-900 border border-purple-200 text-xs font-black tracking-wide uppercase">
              <Radio className={`w-3.5 h-3.5 text-purple-600 ${interviewStatus === 'speaking' || interviewStatus === 'listening' ? 'animate-pulse' : ''}`} />
              Live Interview Copilot
            </span>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-800">
                {upstreamContext.targetRoleTitle}
              </span>
              <span className="text-slate-300 text-xs mx-1.5">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {config.domain}
              </span>
            </div>
          </div>
        </div>

        {/* 
          Right: The 4 Required Functional Groups + Subtle Tier Indicator
          1. [Start / Pause]
          2. [Save]
          3. [End Interview / Finish & View Signals]
          4. [REC 03:07]
        */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Subtle Beta Access Tier Indicator */}
          {(accessLevel === 'PUBLIC' || accessLevel === 'GUEST') && (
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Guest Sample · 1 Q
            </span>
          )}
          {accessLevel === 'DEMO' && (
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Demo Workspace · {configuredBlueprints.length} Qs
            </span>
          )}
          {accessLevel === 'FULL' && (
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Full Intelligence
            </span>
          )}

          {interviewStatus === 'ended' && (
            <button
              type="button"
              onClick={() => setShowTranscriptWhileEnded(prev => !prev)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              {showTranscriptWhileEnded ? 'View Interview Signals' : 'Inspect Room & Transcript'}
            </button>
          )}

          {/* GROUP 1: [Start / Pause] */}
          <button
            type="button"
            onClick={handleStartOrPause}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              interviewStatus === 'ready' || interviewStatus === 'paused' || interviewStatus === 'ended'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-50'
            }`}
          >
            {interviewStatus === 'ready' ? (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Interview</span>
              </>
            ) : interviewStatus === 'paused' ? (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Resume</span>
              </>
            ) : interviewStatus === 'ended' ? (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Restart Session</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-rose-600" />
                <span>Pause</span>
              </>
            )}
          </button>

          {/* Complete & View Signals shortcut */}
          {interviewStatus !== 'ended' && (
            <button
              type="button"
              onClick={handleFinishAndShowSignals}
              className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Finish &amp; View Signals</span>
            </button>
          )}

          {/* GROUP 2: [Save] */}
          <button
            type="button"
            onClick={handleSaveInterview}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs"
          >
            <Save className="w-3.5 h-3.5 text-slate-600" />
            <span>Save</span>
          </button>

          {/* GROUP 3: [End Interview] */}
          <button
            type="button"
            onClick={handleEndInterview}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{interviewStatus === 'ended' ? 'Exit Room' : 'End Interview'}</span>
          </button>

          {/* GROUP 4: [REC 03:07] / STATUS BADGE */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all ${
            interviewStatus === 'speaking' || interviewStatus === 'listening'
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : interviewStatus === 'paused'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : interviewStatus === 'ended'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}>
            <span className="relative flex h-2.5 w-2.5">
              {(interviewStatus === 'speaking' || interviewStatus === 'listening') && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                interviewStatus === 'speaking' || interviewStatus === 'listening'
                  ? 'bg-rose-600'
                  : interviewStatus === 'paused'
                    ? 'bg-amber-500'
                    : interviewStatus === 'ended'
                      ? 'bg-emerald-500'
                      : 'bg-slate-400'
              }`}></span>
            </span>
            <span>
              {interviewStatus === 'speaking' || interviewStatus === 'listening'
                ? 'REC'
                : interviewStatus === 'paused'
                  ? 'PAUSED'
                  : interviewStatus === 'ended'
                    ? 'COMPLETED'
                    : 'READY'}
            </span>
            <span className="text-slate-900 font-semibold">{formatSeconds(recordingSeconds)}</span>
          </div>

        </div>

      </div>

      {/* Connected Ecosystem Chain Strip (shown during live simulation) */}
      {interviewStatus !== 'ended' && (
        <ConnectedEcosystemChainStrip
          activeStage="live"
          upstream={upstreamContext}
          compact={true}
        />
      )}

      {/* 
        ==================================================
        POST-INTERVIEW CONNECTED INTELLIGENCE RESULT STATE
        Hosted directly in LiveInterviewWorkspace when finished
        ==================================================
      */}
      {interviewStatus === 'ended' && !showTranscriptWhileEnded ? (
        <InterviewIntelligenceOutcomePanel
          outcome={interviewOutcome}
          onOpenMissionControl={onOpenMissionControl}
          onRestartSession={handleRestartInterview}
        />
      ) : (
        /* 
          ==================================================
          MAIN WORKSPACE: 
          Left (7 cols): Live Interview Room & Conversation Transcript
          Right (5 cols): Live Copilot Accordion Panel
          ==================================================
        */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column (7 cols): Room & Transcript */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* COMPONENT A: Live Interview Room */}
            <LiveParticipantsGrid
              participants={participants}
              activeSpeakerId={activeSpeakerId}
              onSelectActiveSpeaker={(id) => setActiveSpeakerId(id)}
              interviewStatus={interviewStatus}
              onStartInterview={handleStartOrPause}
              onOpenPrepareModal={() => setIsPrepareModalOpen(true)}
            />

            {/* COMPONENT B: Conversation Transcript */}
            <LiveConversationTimeline
              timeline={timeline}
              activeSpeakerId={activeSpeakerId}
              interviewStatus={interviewStatus}
              candidateName="Alex Rivera"
              onSelectDetectedQuestion={(item) => {
                if (item.matchedBlueprintId) {
                  setActiveBlueprintId(item.matchedBlueprintId);
                }
              }}
              onFinishCandidateTurn={handleFinishCandidateTurn}
              onRestartInterview={handleRestartInterview}
              onUpdateTurnText={handleUpdateTurnText}
            />

          </div>

          {/* Right Column (5 cols): COMPONENT C: Live Copilot Accordion */}
          <div
            data-protected-ip="Live Interview Copilot & Proprietary Q&A Blueprints"
            className="lg:col-span-5 h-[710px]"
          >
            <LiveCopilotPanel
              blueprints={configuredBlueprints}
              activeBlueprintId={activeBlueprintId}
              activeSpeakerId={activeSpeakerId}
              onOpenPrepareModal={() => setIsPrepareModalOpen(true)}
              onSelectBlueprint={(bpId) => setActiveBlueprintId(bpId)}
            />
          </div>

        </div>
      )}

      {/* Subtle Proprietary Framework Attribution */}
      <ProtectedFrameworkAttribution
        areaLabel="Live Interview Copilot, Q&A Blueprints & Signal Synthesis"
        variant="minimal"
      />

      {/* Pre-Interview Processing & Intelligence Modal */}
      {isPrepareModalOpen && (
        <PreInterviewProcessingModal
          initialInterviewers={participants.filter(p => p.isInterviewer)}
          initialBlueprints={configuredBlueprints}
          onClose={() => setIsPrepareModalOpen(false)}
          onSaveAndLoad={handleSaveAndLoadQASet}
        />
      )}

      {/* Saved Interview Record Modal (Source Audio + Script Viewer) */}
      {activeSavedRecord && (
        <SavedInterviewRecordModal
          record={activeSavedRecord}
          onClose={() => setActiveSavedRecord(null)}
          onDeleteRecord={(id) => {
            LiveInterviewStorageService.deleteInterview(id);
          }}
        />
      )}

      {/* Contextual Microphone Permission Gate — Only shown when user clicks "Start Interview" */}
      <AudioPermissionGate
        isOpen={isAudioGateOpen}
        feature="live_interview"
        subFeatureLabel="Live Interview Copilot"
        onClose={() => setIsAudioGateOpen(false)}
        onMicrophoneReady={() => {
          setIsAudioGateOpen(false);
          setIsNonVoiceMode(false);
          runQuestionTurn(0);
        }}
        onContinueWithoutMicrophone={() => {
          setIsAudioGateOpen(false);
          setIsNonVoiceMode(true);
          runQuestionTurn(0);
        }}
      />

    </div>
  );
};

