import { 
  SpeechProvider, 
  RealtimeSpeechState, 
  RealtimeTranscriptEvent, 
  TranscriptSubscriber, 
  StateSubscriber,
  SpeechChunkListener,
  SpeechStateListener,
  SpeakerRole,
  SpeechProviderType
} from '../SpeechProvider';

export class GeminiRealtimeSpeechAdapter implements SpeechProvider {
  private state: RealtimeSpeechState = 'READY';
  private transcriptSubscribers: Set<TranscriptSubscriber> = new Set();
  private stateSubscribers: Set<StateSubscriber> = new Set();

  private legacyChunkListener: SpeechChunkListener | null = null;
  private legacyStateListener: SpeechStateListener | null = null;

  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private statusMessage: string = 'Realtime speech provider not configured';

  // Gemini Live / Bidirectional streaming requires a server-side WebSocket proxy
  // or live streaming gateway credentials
  private streamingEndpointUrl?: string;

  constructor(endpointUrl?: string) {
    this.streamingEndpointUrl = endpointUrl;
    this.checkConfiguration();
  }

  public getId(): SpeechProviderType {
    return 'gemini_realtime';
  }

  public getName(): string {
    return 'Gemini Streaming Speech API';
  }

  public isConfigured(): boolean {
    return Boolean(this.streamingEndpointUrl);
  }

  public getStatusMessage(): string {
    return this.statusMessage;
  }

  public getState(): RealtimeSpeechState {
    return this.state;
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

  private checkConfiguration(): void {
    if (!this.streamingEndpointUrl) {
      this.statusMessage = 'Realtime speech provider not configured';
      this.setState('READY', this.statusMessage);
    } else {
      this.statusMessage = 'Gemini real-time streaming endpoint ready';
      this.setState('READY', this.statusMessage);
    }
  }

  public async start(
    legacyOnChunk?: SpeechChunkListener,
    legacyOnStateChange?: SpeechStateListener
  ): Promise<void> {
    if (legacyOnChunk) this.legacyChunkListener = legacyOnChunk;
    if (legacyOnStateChange) this.legacyStateListener = legacyOnStateChange;

    if (!this.isConfigured()) {
      const err = 'Realtime speech provider not configured';
      this.statusMessage = `${err}: Gemini Live streaming requires an active streaming gateway or server proxy. Switch to Browser Web Speech or Mock Provider to continue.`;
      this.setState('ERROR', this.statusMessage);
      throw new Error(this.statusMessage);
    }

    this.setState('CONNECTING', 'Connecting to Gemini Realtime Audio Gateway...');
    // Real connection would be established here if configured.
    // Never fake a live connection!
  }

  public pause(): void {
    this.isPaused = true;
    this.setState('PAUSED');
  }

  public resume(): void {
    this.isPaused = false;
    this.setState('LISTENING');
  }

  public stop(): void {
    this.isRunning = false;
    this.isPaused = false;
    this.setState('STOPPED');
  }

  public injectTestUtterance(text: string, speaker: SpeakerRole = 'interviewer'): void {
    // If not configured, advise user
    if (!this.isConfigured()) {
      this.statusMessage = 'Realtime speech provider not configured';
      this.setState('ERROR', this.statusMessage);
    }
  }

  private setState(newState: RealtimeSpeechState, message?: string): void {
    this.state = newState;
    this.stateSubscribers.forEach(cb => {
      try {
        cb(newState, message);
      } catch (err) {
        console.error('GeminiRealtimeSpeechAdapter state error:', err);
      }
    });

    if (this.legacyStateListener) {
      let legacyState: any = newState;
      if (newState === 'SPEAKING') legacyState = 'INTERVIEWER_SPEAKING';
      if (newState === 'STOPPED' || newState === 'READY') legacyState = 'IDLE';
      this.legacyStateListener(legacyState, message);
    }
  }
}
