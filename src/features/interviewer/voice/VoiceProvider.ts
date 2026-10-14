import { VoiceProviderInfo, VoiceProviderType } from '../types';

export interface VoiceSpeakCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface VoiceListenCallbacks {
  onSpeechStart?: () => void;
  onInterim?: (text: string) => void;
  onFinal?: (text: string) => void;
  onError?: (err: any) => void;
  onEnd?: () => void;
}

export interface IVoiceProvider {
  readonly id: VoiceProviderType;
  readonly name: string;
  readonly isSimulated: boolean;
  readonly supportsBargeIn: boolean;
  getInfo(): VoiceProviderInfo;
  speak(text: string, callbacks?: VoiceSpeakCallbacks): Promise<void>;
  stopSpeaking(): void;
  startListening(callbacks?: VoiceListenCallbacks): void;
  listen(callbacks?: VoiceListenCallbacks): void;
  stopListening(): void;
  isSpeaking(): boolean;
  isListening(): boolean;
}

/**
 * Real-Time Web Speech Provider
 * Uses standard browser SpeechSynthesis and SpeechRecognition APIs.
 * This is a REAL audio connection (isSimulated = false).
 */
export class WebSpeechVoiceProvider implements IVoiceProvider {
  public readonly id: VoiceProviderType = 'web_speech';
  public readonly name = 'Real-Time Browser Audio';
  public readonly isSimulated = false;
  public readonly supportsBargeIn = true;

  private _isSpeaking = false;
  private _isListening = false;
  private recognitionInstance: any = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  public getInfo(): VoiceProviderInfo {
    const hasSpeechSynth = typeof window !== 'undefined' && 'speechSynthesis' in window;
    const hasSpeechRec = typeof window !== 'undefined' && (
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    );

    return {
      type: 'web_speech',
      label: 'Real-Time Audio (Web Speech API)',
      isSimulated: false,
      statusDescription: hasSpeechSynth && hasSpeechRec
        ? 'Real-time audio connected (Microphone & TTS active)'
        : 'Browser audio partially supported',
      supportsBargeIn: true,
      isAudioHardwareAvailable: Boolean(hasSpeechSynth && hasSpeechRec),
    };
  }

  public async speak(text: string, callbacks?: VoiceSpeakCallbacks): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      callbacks?.onError?.('Speech synthesis not supported in this environment');
      return;
    }

    this.stopSpeaking();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.96;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick a professional natural sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => 
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))
      );
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onstart = () => {
        this._isSpeaking = true;
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        this._isSpeaking = false;
        this.activeUtterance = null;
        callbacks?.onEnd?.();
        resolve();
      };

      utterance.onerror = (err) => {
        this._isSpeaking = false;
        this.activeUtterance = null;
        callbacks?.onError?.(err);
        resolve();
      };

      this.activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this._isSpeaking = false;
    this.activeUtterance = null;
  }

  public startListening(callbacks?: VoiceListenCallbacks): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      callbacks?.onError?.('Speech recognition API not supported in browser');
      return;
    }

    this.stopListening();

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onspeechstart = () => {
        callbacks?.onSpeechStart?.();
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) {
          callbacks?.onFinal?.(final.trim());
        } else if (interim) {
          callbacks?.onInterim?.(interim.trim());
        }
      };

      recognition.onerror = (event: any) => {
        callbacks?.onError?.(event.error);
      };

      recognition.onend = () => {
        this._isListening = false;
        callbacks?.onEnd?.();
      };

      recognition.start();
      this.recognitionInstance = recognition;
      this._isListening = true;
    } catch (err: any) {
      callbacks?.onError?.(err);
      this._isListening = false;
    }
  }

  public listen(callbacks?: VoiceListenCallbacks): void {
    this.startListening(callbacks);
  }

  public stopListening(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch {
        // ignore
      }
      this.recognitionInstance = null;
    }
    this._isListening = false;
  }

  public isSpeaking(): boolean {
    return this._isSpeaking;
  }

  public isListening(): boolean {
    return this._isListening;
  }
}

/**
 * Clearly Identified Simulated Mock Voice Provider
 * Used when browser audio hardware is unavailable or in offline/simulation test environments.
 * MANDATORY: Always explicitly labeled as SIMULATED (isSimulated = true).
 */
export class SimulatedMockVoiceProvider implements IVoiceProvider {
  public readonly id: VoiceProviderType = 'simulated_mock';
  public readonly name = 'Simulated Audio Provider (Mock Connection)';
  public readonly isSimulated = true;
  public readonly supportsBargeIn = true;

  private _isSpeaking = false;
  private _isListening = false;
  private timer: any = null;

  public getInfo(): VoiceProviderInfo {
    return {
      type: 'simulated_mock',
      label: 'Simulated Audio Provider (Mock Connection)',
      isSimulated: true,
      statusDescription: '[SIMULATED AUDIO PROVIDER - MOCK CONNECTION] Simulated cadence & synthetic text-stream active.',
      supportsBargeIn: true,
      isAudioHardwareAvailable: false,
    };
  }

  public async speak(text: string, callbacks?: VoiceSpeakCallbacks): Promise<void> {
    this.stopSpeaking();
    this._isSpeaking = true;
    callbacks?.onStart?.();

    // Estimate speaking duration: ~55ms per word + 500ms base
    const words = text.split(/\s+/).length;
    const duration = Math.min(6000, Math.max(1200, words * 55));

    return new Promise((resolve) => {
      this.timer = setTimeout(() => {
        this._isSpeaking = false;
        callbacks?.onEnd?.();
        resolve();
      }, duration);
    });
  }

  public stopSpeaking(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this._isSpeaking = false;
  }

  public startListening(callbacks?: VoiceListenCallbacks): void {
    this._isListening = true;
    callbacks?.onSpeechStart?.();
  }

  public listen(callbacks?: VoiceListenCallbacks): void {
    this.startListening(callbacks);
  }

  public stopListening(): void {
    this._isListening = false;
  }

  public isSpeaking(): boolean {
    return this._isSpeaking;
  }

  public isListening(): boolean {
    return this._isListening;
  }
}

/**
 * Voice Manager & Provider Resolver
 */
export class VoiceManager {
  private static activeProvider: IVoiceProvider | null = null;
  private static forceSimulated = false;

  public static getProvider(): IVoiceProvider {
    if (this.forceSimulated) {
      if (!this.activeProvider || this.activeProvider.id !== 'simulated_mock') {
        this.activeProvider = new SimulatedMockVoiceProvider();
      }
      return this.activeProvider;
    }

    const hasAudio = typeof window !== 'undefined' && 'speechSynthesis' in window;
    if (hasAudio) {
      if (!this.activeProvider || this.activeProvider.id !== 'web_speech') {
        this.activeProvider = new WebSpeechVoiceProvider();
      }
      return this.activeProvider;
    }

    if (!this.activeProvider || this.activeProvider.id !== 'simulated_mock') {
      this.activeProvider = new SimulatedMockVoiceProvider();
    }
    return this.activeProvider;
  }

  public static setForceSimulated(simulated: boolean): void {
    this.forceSimulated = simulated;
    if (this.activeProvider) {
      this.activeProvider.stopSpeaking();
      this.activeProvider.stopListening();
      this.activeProvider = null;
    }
  }

  public static isForceSimulated(): boolean {
    return this.forceSimulated;
  }
}
