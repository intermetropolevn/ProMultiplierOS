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

export class WebSpeechAdapter implements SpeechProvider {
  private recognition: any = null;
  private state: RealtimeSpeechState = 'READY';
  private transcriptSubscribers: Set<TranscriptSubscriber> = new Set();
  private stateSubscribers: Set<StateSubscriber> = new Set();

  private legacyChunkListener: SpeechChunkListener | null = null;
  private legacyStateListener: SpeechStateListener | null = null;

  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private preferredLanguage: string = 'en-US';

  private sessionStartTime: number = 0;
  private sessionEndTime?: number;
  private timerInterval: any = null;

  private accumulatedFinalTranscript: string = '';
  private currentPartialTranscript: string = '';
  private lastConfidence: number = 0.95;
  private statusMessage: string | null = null;
  private chunkSequence: number = 0;

  constructor(preferredLanguage: string = 'en-US') {
    this.preferredLanguage = preferredLanguage;
    this.checkAvailability();
  }

  public getId(): SpeechProviderType {
    return 'web_speech';
  }

  public getName(): string {
    return 'Browser Web Speech API';
  }

  public isConfigured(): boolean {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return Boolean(SpeechRecognition);
  }

  public getStatusMessage(): string | null {
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

  private checkAvailability(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.statusMessage = 'Browser speech recognition is not supported in this browser. Please use Chrome/Edge/Safari or switch to the Mock Provider.';
      this.setState('ERROR', this.statusMessage);
    } else {
      this.statusMessage = 'Browser microphone speech recognition ready.';
      this.setState('READY');
    }
  }

  public async start(
    legacyOnChunk?: SpeechChunkListener,
    legacyOnStateChange?: SpeechStateListener,
    options?: { language?: string }
  ): Promise<void> {
    if (legacyOnChunk) this.legacyChunkListener = legacyOnChunk;
    if (legacyOnStateChange) this.legacyStateListener = legacyOnStateChange;
    if (options?.language) this.preferredLanguage = options.language;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const err = 'Browser speech recognition is not supported in this environment.';
      this.statusMessage = err;
      this.setState('ERROR', err);
      throw new Error(err);
    }

    this.setState('CONNECTING', 'Requesting microphone access...');
    this.accumulatedFinalTranscript = '';
    this.currentPartialTranscript = '';
    this.sessionStartTime = Date.now();
    this.sessionEndTime = undefined;
    this.startDurationTicker();

    try {
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch (_) {}
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.preferredLanguage;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isRunning = true;
        this.isPaused = false;
        this.statusMessage = 'Microphone listening active.';
        this.setState('LISTENING');
      };

      this.recognition.onspeechstart = () => {
        if (this.state === 'LISTENING') {
          this.setState('SPEAKING');
        }
      };

      this.recognition.onspeechend = () => {
        if (this.state === 'SPEAKING') {
          this.setState('PROCESSING');
        }
      };

      this.recognition.onresult = (event: any) => {
        if (this.isPaused) return;

        let interimText = '';
        let finalizedThisRound = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0]?.transcript || '';
          const confidence = res[0]?.confidence || 0.92;
          this.lastConfidence = Math.max(0.7, Math.min(0.99, confidence));

          if (res.isFinal) {
            finalizedThisRound += (finalizedThisRound ? ' ' : '') + text.trim();
          } else {
            interimText += (interimText ? ' ' : '') + text.trim();
          }
        }

        if (finalizedThisRound) {
          this.accumulatedFinalTranscript = this.accumulatedFinalTranscript
            ? `${this.accumulatedFinalTranscript} ${finalizedThisRound}`
            : finalizedThisRound;
          this.currentPartialTranscript = interimText;
          this.emitTranscript(true);
          this.setState('PROCESSING');
          setTimeout(() => {
            if (this.isRunning && !this.isPaused && this.state === 'PROCESSING') {
              this.setState('LISTENING');
            }
          }, 300);
        } else if (interimText) {
          this.currentPartialTranscript = interimText;
          this.emitTranscript(false);
          this.setState('SPEAKING');
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('WebSpeechAdapter error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          this.statusMessage = 'Microphone permission denied. Please allow microphone access in your browser.';
          this.setState('ERROR', this.statusMessage);
        } else if (event.error === 'no-speech') {
          // Empty audio / silent timeout: return to listening
          if (!this.isPaused && this.isRunning) {
            this.setState('LISTENING');
          }
        } else if (event.error === 'network') {
          this.statusMessage = 'Connection failure: Network issue during speech recognition.';
          this.setState('ERROR', this.statusMessage);
        } else if (event.error === 'audio-capture') {
          this.statusMessage = 'Audio capture failure: No working microphone detected.';
          this.setState('ERROR', this.statusMessage);
        } else {
          // General notice, keep active if possible
          if (!this.isPaused && this.isRunning) {
            this.setState('LISTENING');
          }
        }
      };

      this.recognition.onend = () => {
        if (this.isRunning && !this.isPaused) {
          try {
            this.recognition.start();
          } catch (_) {
            this.setState('LISTENING');
          }
        } else if (!this.isPaused && this.state !== 'ERROR') {
          this.setState('STOPPED');
        }
      };

      this.recognition.start();
    } catch (err: any) {
      console.warn('WebSpeechAdapter start failure:', err);
      this.statusMessage = err?.message || 'Failed to start browser microphone.';
      this.setState('ERROR', this.statusMessage);
      throw err;
    }
  }

  public pause(): void {
    this.isPaused = true;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (_) {}
    }
    this.statusMessage = 'Microphone paused.';
    this.setState('PAUSED');
  }

  public resume(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.statusMessage = 'Resuming microphone listening...';
    this.setState('CONNECTING');
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (_) {
        this.setState('LISTENING');
      }
    }
  }

  public stop(): void {
    this.isRunning = false;
    this.isPaused = false;
    this.stopDurationTicker();
    this.sessionEndTime = Date.now();

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (_) {}
      this.recognition = null;
    }

    this.statusMessage = 'Microphone stopped.';
    this.setState('STOPPED');
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
      confidence: this.lastConfidence,
      timeline: {
        startTime: this.sessionStartTime,
        endTime: this.sessionEndTime,
        duration,
      },
      words: [], // Prepared for future word-level timestamps
    };

    // Notify new subscribers
    this.transcriptSubscribers.forEach(cb => {
      try {
        cb(event);
      } catch (err) {
        console.error('WebSpeechAdapter transcript subscriber error:', err);
      }
    });

    // Notify legacy chunk listener
    if (this.legacyChunkListener && isFinal) {
      this.chunkSequence++;
      const chunk: TranscriptChunk = {
        id: `chunk-${Date.now()}-${this.chunkSequence}`,
        text: fullTranscript,
        timestamp: Date.now(),
        speaker: 'interviewer',
        isFinal: true,
        language: language.code,
        confidence: this.lastConfidence,
      };
      this.legacyChunkListener(chunk);
    }
  }

  public injectTestUtterance(text: string, speaker: SpeakerRole = 'interviewer'): void {
    if (!text.trim()) return;

    this.currentPartialTranscript = text.trim();
    this.setState('SPEAKING');

    setTimeout(() => {
      this.accumulatedFinalTranscript = this.accumulatedFinalTranscript
        ? `${this.accumulatedFinalTranscript} ${text.trim()}`
        : text.trim();
      this.currentPartialTranscript = '';
      this.emitTranscript(true);
      this.setState('PROCESSING');

      setTimeout(() => {
        if (this.isRunning && !this.isPaused) {
          this.setState('LISTENING');
        }
      }, 400);
    }, 200);
  }

  private startDurationTicker(): void {
    this.stopDurationTicker();
    this.timerInterval = setInterval(() => {
      if (this.isRunning && !this.isPaused && (this.accumulatedFinalTranscript || this.currentPartialTranscript)) {
        // Refresh timeline duration for live counter
        this.emitTranscript(false);
      }
    }, 1000);
  }

  private stopDurationTicker(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private setState(newState: RealtimeSpeechState, message?: string): void {
    this.state = newState;
    this.stateSubscribers.forEach(cb => {
      try {
        cb(newState, message);
      } catch (err) {
        console.error('WebSpeechAdapter state subscriber error:', err);
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
