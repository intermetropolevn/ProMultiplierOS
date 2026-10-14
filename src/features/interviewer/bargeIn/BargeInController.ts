import { BargeInEvent } from '../types';
import { IVoiceProvider } from '../voice/VoiceProvider';

export interface BargeInConfig {
  enabled: boolean;
  minWordCountToInterrupt: number; // Conservative: requires at least 2 words to avoid false pops
  debounceMs: number;
}

export class BargeInController {
  private config: BargeInConfig;
  private voiceProvider: IVoiceProvider;
  private isAIInterviewerSpeaking = false;
  private onBargeInCallback?: (event: BargeInEvent) => void;
  private interruptionHistory: BargeInEvent[] = [];
  private lastBargeInTimestamp = 0;

  constructor(
    voiceProvider: IVoiceProvider,
    onBargeIn?: (event: BargeInEvent) => void,
    customConfig?: Partial<BargeInConfig>
  ) {
    this.voiceProvider = voiceProvider;
    this.onBargeInCallback = onBargeIn;
    this.config = {
      enabled: true,
      minWordCountToInterrupt: 2, // Non-aggressive barge-in
      debounceMs: 800,
      ...customConfig,
    };
  }

  public setAISpeaking(speaking: boolean): void {
    this.isAIInterviewerSpeaking = speaking;
  }

  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public getInterruptionCount(): number {
    return this.interruptionHistory.length;
  }

  public getInterruptionHistory(): BargeInEvent[] {
    return [...this.interruptionHistory];
  }

  /**
   * Candidate speech detector hook.
   * Evaluates if candidate speech meets reliable barge-in criteria.
   */
  public handleCandidateSpeechDetected(transcriptSnippet: string, currentSpokenPrompt: string): boolean {
    if (!this.config.enabled) return false;
    if (!this.isAIInterviewerSpeaking) return false;

    const now = Date.now();
    if (now - this.lastBargeInTimestamp < this.config.debounceMs) {
      return false;
    }

    const trimmed = (transcriptSnippet || '').trim();
    const words = trimmed.split(/\s+/).filter(Boolean);

    // Conservative barge-in: verify minimum word count or length to avoid audio clicks/coughs
    if (words.length < this.config.minWordCountToInterrupt && trimmed.length < 5) {
      return false;
    }

    // Reliable candidate barge-in detected!
    this.lastBargeInTimestamp = now;
    this.isAIInterviewerSpeaking = false;

    // Immediately stop AI speech output
    this.voiceProvider.stopSpeaking();

    const event: BargeInEvent = {
      timestamp: now,
      interruptedText: currentSpokenPrompt,
      candidateStartWords: trimmed,
      confidence: 0.92,
    };

    this.interruptionHistory.push(event);

    if (this.onBargeInCallback) {
      this.onBargeInCallback(event);
    }

    return true;
  }

  /**
   * Candidate speech handler called by RealTimeInterviewerStage
   */
  public onCandidateSpeech(transcriptSnippet: string, currentSpokenPrompt = ''): boolean {
    return this.handleCandidateSpeechDetected(transcriptSnippet, currentSpokenPrompt);
  }
}
