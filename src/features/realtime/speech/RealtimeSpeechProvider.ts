import { 
  SpeechProvider, 
  SpeechChunkListener, 
  SpeechStateListener, 
  RealtimeSpeechState, 
  RealtimeTranscriptEvent,
  TranscriptSubscriber,
  SpeechProviderType,
  SpeakerRole
} from './SpeechProvider';
import { SpeechState, TranscriptChunk } from '../types';
import { SpeechProviderManager } from './SpeechProviderManager';

/**
 * Enhanced RealtimeSpeechProvider bridging the Realtime Pipeline
 * with the new Reusable Real-Time Speech Layer and Adapters.
 */
export class RealtimeSpeechProvider implements SpeechProvider {
  private manager: SpeechProviderManager;
  private preferredLanguage: string = 'en-US';

  constructor(preferredLanguage: string = 'en-US') {
    this.preferredLanguage = preferredLanguage;
    this.manager = SpeechProviderManager.getInstance();
  }

  public getManager(): SpeechProviderManager {
    return this.manager;
  }

  public getId(): SpeechProviderType {
    return this.manager.getId();
  }

  public getName(): string {
    return this.manager.getName();
  }

  public isConfigured(): boolean {
    return this.manager.isConfigured();
  }

  public getStatusMessage(): string | null {
    return this.manager.getStatusMessage();
  }

  public async start(
    onChunk?: SpeechChunkListener,
    onStateChange?: SpeechStateListener,
    options?: { language?: string }
  ): Promise<void> {
    if (options?.language) {
      this.preferredLanguage = options.language;
    }
    return this.manager.start(onChunk, onStateChange, { language: this.preferredLanguage });
  }

  public pause(): void {
    this.manager.pause();
  }

  public resume(): void {
    this.manager.resume();
  }

  public stop(): void {
    this.manager.stop();
  }

  public subscribeToTranscript(callback: TranscriptSubscriber): () => void {
    return this.manager.subscribeToTranscript(callback);
  }

  public subscribeToState(callback: (state: RealtimeSpeechState, message?: string) => void): () => void {
    return this.manager.subscribeToState(callback);
  }

  public getState(): RealtimeSpeechState {
    return this.manager.getState();
  }

  public isActive(): boolean {
    const state = this.manager.getState();
    return state === 'LISTENING' || state === 'SPEAKING' || state === 'PROCESSING';
  }

  public injectTestUtterance(text: string, speaker: SpeakerRole = 'interviewer'): void {
    this.manager.injectTestUtterance(text, speaker);
  }

  public setPreferredLanguage(lang: string): void {
    this.preferredLanguage = lang;
  }
}
