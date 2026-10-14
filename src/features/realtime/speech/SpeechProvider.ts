import { 
  RealtimeSpeechState, 
  RealtimeTranscriptEvent, 
  TranscriptSubscriber, 
  StateSubscriber,
  SpeechProviderType,
  SpeechProviderInfo,
  SpeechLanguageDetails,
  WordTimestamp,
  SpeechTimeline,
  SpeechState,
  TranscriptChunk,
  SpeakerRole
} from './types';

export type { 
  RealtimeSpeechState, 
  RealtimeTranscriptEvent, 
  TranscriptSubscriber, 
  StateSubscriber,
  SpeechProviderType,
  SpeechProviderInfo,
  SpeechLanguageDetails,
  WordTimestamp,
  SpeechTimeline,
  SpeechState,
  TranscriptChunk,
  SpeakerRole
};

export interface SpeechChunkListener {
  (chunk: TranscriptChunk): void;
}

export interface SpeechStateListener {
  (state: SpeechState, message?: string): void;
}

/**
 * Standard Reusable Real-Time Speech Provider Interface
 */
export interface SpeechProvider {
  /**
   * Starts capturing speech from the provider.
   * Supports both argument-free invocation and legacy callback-style invocation.
   */
  start(
    legacyOnChunk?: SpeechChunkListener, 
    legacyOnStateChange?: SpeechStateListener,
    options?: { language?: string }
  ): Promise<void>;

  /**
   * Temporarily pauses speech capture
   */
  pause(): void;

  /**
   * Resumes speech capture from paused state
   */
  resume(): void;

  /**
   * Completely stops speech capture and releases audio resources
   */
  stop(): void;

  /**
   * Subscribes to continuous live transcript events (partial, final, language, timeline, confidence)
   * Returns an unsubscribe function.
   */
  subscribeToTranscript(callback: TranscriptSubscriber): () => void;

  /**
   * Subscribes to state changes (READY, CONNECTING, LISTENING, SPEAKING, PROCESSING, PAUSED, STOPPED, ERROR)
   */
  subscribeToState?(callback: StateSubscriber): () => void;

  /**
   * Gets the current operational realtime speech state
   */
  getState(): RealtimeSpeechState;

  /**
   * Identifier of this provider adapter
   */
  getId(): SpeechProviderType;

  /**
   * Human-readable name of the provider
   */
  getName(): string;

  /**
   * Whether the provider is configured and ready for live capture
   */
  isConfigured(): boolean;

  /**
   * Status description or configuration notice
   */
  getStatusMessage(): string | null;

  /**
   * Injects an utterance directly into the pipeline for testing/simulation
   */
  injectTestUtterance?(text: string, speaker?: SpeakerRole): void;
}
