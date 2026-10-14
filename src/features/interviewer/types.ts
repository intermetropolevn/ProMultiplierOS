import { InterviewQuestion } from '../../types';

export type InterviewerState = 
  | 'ASKING'
  | 'LISTENING'
  | 'PROCESSING'
  | 'FOLLOW_UP'
  | 'NEXT_QUESTION'
  | 'COMPLETE';

export type VoiceProviderType = 'web_speech' | 'gemini_realtime' | 'simulated_mock';

export interface VoiceProviderInfo {
  type: VoiceProviderType;
  label: string;
  isSimulated: boolean;
  statusDescription: string;
  supportsBargeIn: boolean;
  isAudioHardwareAvailable: boolean;
}

export interface InterviewerTurn {
  id: string;
  speaker: 'ai' | 'candidate';
  state: InterviewerState;
  text: string;
  timestamp: number;
  isFollowUp: boolean;
  followUpSource?: 'stored' | 'generated';
}

export interface FollowUpItem {
  id: string;
  question: string;
  isStored: boolean;
  source: 'stored' | 'generated';
  targetAspect?: 'tradeoff' | 'metric' | 'behavior' | 'failure_mode' | 'reflection';
  promptReason: string;
}

export interface BargeInEvent {
  timestamp: number;
  interruptedText: string;
  candidateStartWords: string;
  confidence: number;
}
