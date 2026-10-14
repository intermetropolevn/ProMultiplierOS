export type RealtimeSpeechState =
  | 'READY'
  | 'CONNECTING'
  | 'LISTENING'
  | 'SPEAKING'
  | 'PROCESSING'
  | 'PAUSED'
  | 'STOPPED'
  | 'ERROR';

// Backward compatibility with legacy state references
export type SpeechState =
  | RealtimeSpeechState
  | 'IDLE'
  | 'USER_SPEAKING'
  | 'INTERVIEWER_SPEAKING'
  | 'MATCHED'
  | 'NO_MATCH';

export type DetectedLanguage = 'en' | 'vi' | 'bilingual';

export type SpeakerRole = 'interviewer' | 'candidate' | 'unknown';

export interface TranscriptChunk {
  id: string;
  text: string;
  timestamp: number;
  speaker: SpeakerRole;
  isFinal: boolean;
  language: DetectedLanguage | string;
  confidence: number;
}

export interface LanguageProportions {
  englishPct: number;    // 0 - 100
  vietnamesePct: number; // 0 - 100
}

export interface SpeechLanguageDetails {
  primary: 'English' | 'Vietnamese' | 'Bilingual';
  code: DetectedLanguage;
  breakdown?: LanguageProportions;
  isCodeSwitching: boolean;
  displayBadge: string; // e.g. "EN 64% • VI 36%" or "English"
}

export interface WordTimestamp {
  word: string;
  startTime: number;
  endTime: number;
  confidence?: number;
}

export interface SpeechTimeline {
  startTime: number;
  endTime?: number;
  duration: number; // In seconds
}

export interface RealtimeTranscriptEvent {
  partialTranscript: string;
  finalTranscript: string;
  fullTranscript: string;
  isFinal: boolean;
  language: SpeechLanguageDetails;
  confidence: number;
  timeline: SpeechTimeline;
  words?: WordTimestamp[]; // Prepared for future word-level timestamps
}

export type TranscriptSubscriber = (event: RealtimeTranscriptEvent) => void;
export type StateSubscriber = (state: RealtimeSpeechState, message?: string) => void;

export type SpeechProviderType = 'web_speech' | 'gemini_realtime' | 'mock';

export interface SpeechProviderInfo {
  id: SpeechProviderType;
  name: string;
  isAvailable: boolean;
  isConfigured: boolean;
  unconfiguredReason?: string;
}

export interface SpeechErrorDetails {
  type: 
    | 'permission_denied' 
    | 'browser_unsupported' 
    | 'connection_failure' 
    | 'empty_audio' 
    | 'provider_failure' 
    | 'not_configured';
  message: string;
  recoverable: boolean;
}
