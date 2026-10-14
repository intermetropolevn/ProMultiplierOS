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
import { TranscriptChunk } from '../types';
import { detectSpokenLanguageDetails } from '../languageDetector';

export const MOCK_SPEECH_SCENARIOS = [
  {
    title: 'Bilingual Funnel & Retention (Code-Switching)',
    text: 'Em would first look at the activation funnel, sau đó compare retention by cohort.',
  },
  {
    title: 'Stakeholder Conflict (Paraphrased)',
    text: 'Can you describe a situation where you disagreed with your developers?',
  },
  {
    title: 'Competing Demands Prioritization',
    text: 'Imagine sales, engineering and leadership all want different things. What would you do?',
  },
  {
    title: 'Reflective Retrospective Follow-up',
    text: 'What would you do differently looking back on that project?',
  },
  {
    title: 'Technical Idempotency & Payments',
    text: 'How do you handle duplicate charges and network timeouts in payment webhooks?',
  }
];

export class MockSpeechAdapter implements SpeechProvider {
  private state: RealtimeSpeechState = 'READY';
  private transcriptSubscribers: Set<TranscriptSubscriber> = new Set();
  private stateSubscribers: Set<StateSubscriber> = new Set();

  private legacyChunkListener: SpeechChunkListener | null = null;
  private legacyStateListener: SpeechStateListener | null = null;

  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private statusMessage: string = 'Simulated speech stream ready (Clearly identified test mock)';

  private sessionStartTime: number = 0;
  private sessionEndTime?: number;

  private accumulatedFinalTranscript: string = '';
  private currentPartialTranscript: string = '';
  private streamInterval: any = null;
  private currentScenarioIndex: number = 0;
  private chunkSequence: number = 0;

  constructor() {
    this.statusMessage = 'Simulated mock speech provider ready for controlled testing and preview.';
  }

  public getId(): SpeechProviderType {
    return 'mock';
  }

  public getName(): string {
    return 'Simulated Speech Stream (Mock Provider)';
  }

  public isConfigured(): boolean {
    return true;
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

  public async start(
    legacyOnChunk?: SpeechChunkListener,
    legacyOnStateChange?: SpeechStateListener
  ): Promise<void> {
    if (legacyOnChunk) this.legacyChunkListener = legacyOnChunk;
    if (legacyOnStateChange) this.legacyStateListener = legacyOnStateChange;

    this.isRunning = true;
    this.isPaused = false;
    this.sessionStartTime = Date.now();
    this.sessionEndTime = undefined;
    this.accumulatedFinalTranscript = '';
    this.currentPartialTranscript = '';

    this.setState('CONNECTING', 'Initializing mock audio stream...');

    setTimeout(() => {
      if (!this.isRunning) return;
      this.setState('LISTENING', 'Mock audio stream listening. Stream will begin shortly...');
      // Start streaming first sample scenario
      this.streamScenario(MOCK_SPEECH_SCENARIOS[this.currentScenarioIndex % MOCK_SPEECH_SCENARIOS.length].text);
      this.currentScenarioIndex++;
    }, 400);
  }

  public pause(): void {
    this.isPaused = true;
    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = null;
    }
    this.setState('PAUSED', 'Mock speech playback paused.');
  }

  public resume(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.setState('LISTENING', 'Mock speech playback resumed.');
    if (this.currentPartialTranscript) {
      this.streamScenario(this.currentPartialTranscript);
    }
  }

  public stop(): void {
    this.isRunning = false;
    this.isPaused = false;
    this.sessionEndTime = Date.now();

    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = null;
    }

    this.setState('STOPPED', 'Mock speech playback stopped.');
  }

  /**
   * Simulates word-by-word streaming of a sentence
   * Emits partial transcript continuously, then finalizes to stable text.
   */
  public streamScenario(sentence: string): void {
    if (this.streamInterval) {
      clearInterval(this.streamInterval);
    }

    const words = sentence.split(' ');
    let wordIdx = 0;
    this.currentPartialTranscript = '';

    this.setState('SPEAKING', 'Speaker active in simulated stream.');

    this.streamInterval = setInterval(() => {
      if (this.isPaused || !this.isRunning) {
        clearInterval(this.streamInterval);
        return;
      }

      if (wordIdx < words.length) {
        this.currentPartialTranscript = words.slice(0, wordIdx + 1).join(' ');
        wordIdx++;
        // Emit continuously updating partial transcript
        this.emitTranscript(false);
      } else {
        // Finalize transcript
        clearInterval(this.streamInterval);
        this.streamInterval = null;

        this.accumulatedFinalTranscript = this.accumulatedFinalTranscript
          ? `${this.accumulatedFinalTranscript} ${sentence}`
          : sentence;
        this.currentPartialTranscript = '';

        this.setState('PROCESSING', 'Processing final speech utterance...');
        this.emitTranscript(true);

        setTimeout(() => {
          if (this.isRunning && !this.isPaused) {
            this.setState('LISTENING', 'Mock stream standing by for next utterance.');
          }
        }, 500);
      }
    }, 180);
  }

  public injectTestUtterance(text: string, speaker: SpeakerRole = 'interviewer'): void {
    if (!text.trim()) return;
    this.isRunning = true;
    this.isPaused = false;
    this.streamScenario(text.trim());
  }

  private emitTranscript(isFinal: boolean): void {
    const fullTranscript = (
      this.accumulatedFinalTranscript + (this.currentPartialTranscript ? ` ${this.currentPartialTranscript}` : '')
    ).trim();

    if (!fullTranscript) return;

    const language = detectSpokenLanguageDetails(fullTranscript);
    const duration = this.sessionStartTime > 0 
      ? Math.max(0, Math.round((Date.now() - this.sessionStartTime) / 1000))
      : 0;

    const event: RealtimeTranscriptEvent = {
      partialTranscript: this.currentPartialTranscript,
      finalTranscript: this.accumulatedFinalTranscript,
      fullTranscript,
      isFinal,
      language,
      confidence: 0.96,
      timeline: {
        startTime: this.sessionStartTime,
        endTime: this.sessionEndTime,
        duration,
      },
      words: [], // Prepared for future word-level timestamps
    };

    this.transcriptSubscribers.forEach(cb => {
      try {
        cb(event);
      } catch (err) {
        console.error('MockSpeechAdapter subscriber error:', err);
      }
    });

    if (this.legacyChunkListener && isFinal) {
      this.chunkSequence++;
      const chunk: TranscriptChunk = {
        id: `mock-chunk-${Date.now()}-${this.chunkSequence}`,
        text: fullTranscript,
        timestamp: Date.now(),
        speaker: 'interviewer',
        isFinal: true,
        language: language.code,
        confidence: 0.96,
      };
      this.legacyChunkListener(chunk);
    }
  }

  private setState(newState: RealtimeSpeechState, message?: string): void {
    this.state = newState;
    this.statusMessage = message || '';
    this.stateSubscribers.forEach(cb => {
      try {
        cb(newState, message);
      } catch (err) {
        console.error('MockSpeechAdapter state error:', err);
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
