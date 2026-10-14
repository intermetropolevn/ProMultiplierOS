import { 
  SpeechProvider, 
  RealtimeSpeechState, 
  RealtimeTranscriptEvent, 
  TranscriptSubscriber, 
  StateSubscriber,
  SpeechChunkListener,
  SpeechStateListener,
  SpeakerRole,
  SpeechProviderType,
  SpeechProviderInfo
} from './SpeechProvider';
import { WebSpeechAdapter } from './adapters/WebSpeechAdapter';
import { GeminiRealtimeSpeechAdapter } from './adapters/GeminiRealtimeSpeechAdapter';
import { MockSpeechAdapter } from './adapters/MockSpeechAdapter';

export class SpeechProviderManager implements SpeechProvider {
  private static instance: SpeechProviderManager | null = null;

  private webSpeechAdapter: WebSpeechAdapter;
  private geminiAdapter: GeminiRealtimeSpeechAdapter;
  private mockAdapter: MockSpeechAdapter;

  private activeProviderType: SpeechProviderType = 'web_speech';
  private activeProvider: SpeechProvider;

  private transcriptSubscribers: Set<TranscriptSubscriber> = new Set();
  private stateSubscribers: Set<StateSubscriber> = new Set();

  private activeTranscriptUnsub: (() => void) | null = null;
  private activeStateUnsub: (() => void) | null = null;

  private constructor() {
    this.webSpeechAdapter = new WebSpeechAdapter();
    this.geminiAdapter = new GeminiRealtimeSpeechAdapter();
    this.mockAdapter = new MockSpeechAdapter();

    // Default to Web Speech if available, otherwise Mock
    if (this.webSpeechAdapter.isConfigured()) {
      this.activeProviderType = 'web_speech';
      this.activeProvider = this.webSpeechAdapter;
    } else {
      this.activeProviderType = 'mock';
      this.activeProvider = this.mockAdapter;
    }

    this.bindActiveProvider();
  }

  public static getInstance(): SpeechProviderManager {
    if (!SpeechProviderManager.instance) {
      SpeechProviderManager.instance = new SpeechProviderManager();
    }
    return SpeechProviderManager.instance;
  }

  public getAvailableProviders(): SpeechProviderInfo[] {
    return [
      {
        id: 'web_speech',
        name: 'Browser Web Speech (Live Microphone)',
        isAvailable: this.webSpeechAdapter.isConfigured(),
        isConfigured: this.webSpeechAdapter.isConfigured(),
        unconfiguredReason: !this.webSpeechAdapter.isConfigured() 
          ? 'Browser speech recognition not supported in this browser' 
          : undefined,
      },
      {
        id: 'gemini_realtime',
        name: 'Gemini Realtime Audio Stream (WebSocket API)',
        isAvailable: false,
        isConfigured: this.geminiAdapter.isConfigured(),
        unconfiguredReason: 'Realtime speech provider not configured',
      },
      {
        id: 'mock',
        name: 'Simulated Speech Stream (Mock / Preview)',
        isAvailable: true,
        isConfigured: true,
      }
    ];
  }

  public switchProvider(type: SpeechProviderType): SpeechProvider {
    if (this.activeProviderType === type) {
      return this.activeProvider;
    }

    // Stop current provider before switching
    try {
      this.activeProvider.stop();
    } catch (_) {}

    this.activeProviderType = type;
    if (type === 'web_speech') {
      this.activeProvider = this.webSpeechAdapter;
    } else if (type === 'gemini_realtime') {
      this.activeProvider = this.geminiAdapter;
    } else {
      this.activeProvider = this.mockAdapter;
    }

    this.bindActiveProvider();
    this.notifyState(this.activeProvider.getState(), this.activeProvider.getStatusMessage() || undefined);
    return this.activeProvider;
  }

  public getActiveProviderType(): SpeechProviderType {
    return this.activeProviderType;
  }

  public getActiveProvider(): SpeechProvider {
    return this.activeProvider;
  }

  // --- SpeechProvider Interface Delegation ---

  public getId(): SpeechProviderType {
    return this.activeProvider.getId();
  }

  public getName(): string {
    return this.activeProvider.getName();
  }

  public isConfigured(): boolean {
    return this.activeProvider.isConfigured();
  }

  public getStatusMessage(): string | null {
    return this.activeProvider.getStatusMessage();
  }

  public getState(): RealtimeSpeechState {
    return this.activeProvider.getState();
  }

  public async start(
    legacyOnChunk?: SpeechChunkListener,
    legacyOnStateChange?: SpeechStateListener,
    options?: { language?: string }
  ): Promise<void> {
    return this.activeProvider.start(legacyOnChunk, legacyOnStateChange, options);
  }

  public pause(): void {
    this.activeProvider.pause();
  }

  public resume(): void {
    this.activeProvider.resume();
  }

  public stop(): void {
    this.activeProvider.stop();
  }

  public subscribeToTranscript(callback: TranscriptSubscriber): () => void {
    this.transcriptSubscribers.add(callback);
    return () => {
      this.transcriptSubscribers.delete(callback);
    };
  }

  public subscribeToState(callback: StateSubscriber): () => void {
    this.stateSubscribers.add(callback);
    return () => {
      this.stateSubscribers.delete(callback);
    };
  }

  public injectTestUtterance(text: string, speaker?: SpeakerRole): void {
    if (this.activeProvider.injectTestUtterance) {
      this.activeProvider.injectTestUtterance(text, speaker);
    }
  }

  private bindActiveProvider(): void {
    if (this.activeTranscriptUnsub) {
      this.activeTranscriptUnsub();
      this.activeTranscriptUnsub = null;
    }
    if (this.activeStateUnsub) {
      this.activeStateUnsub();
      this.activeStateUnsub = null;
    }

    this.activeTranscriptUnsub = this.activeProvider.subscribeToTranscript((event) => {
      this.transcriptSubscribers.forEach(cb => {
        try {
          cb(event);
        } catch (e) {
          console.error('Transcript dispatch error:', e);
        }
      });
    });

    if (this.activeProvider.subscribeToState) {
      this.activeStateUnsub = this.activeProvider.subscribeToState((state, msg) => {
        this.notifyState(state, msg);
      });
    }
  }

  private notifyState(state: RealtimeSpeechState, msg?: string): void {
    this.stateSubscribers.forEach(cb => {
      try {
        cb(state, msg);
      } catch (e) {
        console.error('State dispatch error:', e);
      }
    });
  }
}
