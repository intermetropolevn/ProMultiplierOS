import { TranscriptChunk, Utterance, DetectedLanguage } from '../types';
import { detectSpokenLanguage } from './languageDetector';

export interface UtteranceListener {
  (utterance: Utterance): void;
}

const QUESTION_INDICATOR_REGEX = /\?|(^(tell me about|walk me through|how would you|how did you|how do you|why did you|describe a time|give me an example|what is your approach|can you explain|what were the trade-offs|have you ever|bạn xử lý thế nào|làm thế nào để|kể về một lần|hãy chia sẻ về|theo bạn thì|tại sao lại))/i;

export class UtteranceAggregator {
  private buffer: string[] = [];
  private startTime: number = 0;
  private lastChunkTime: number = 0;
  private currentLanguage: DetectedLanguage = 'en';
  private confidenceScores: number[] = [];
  private onUtteranceComplete: UtteranceListener;
  private silenceTimer: any = null;
  private readonly SILENCE_TIMEOUT_MS = 1400;

  constructor(onUtteranceComplete: UtteranceListener) {
    this.onUtteranceComplete = onUtteranceComplete;
  }

  public pushChunk(chunk: TranscriptChunk): void {
    if (!chunk.text.trim()) return;

    if (this.buffer.length === 0) {
      this.startTime = chunk.timestamp;
    }

    this.lastChunkTime = chunk.timestamp;
    this.buffer.push(chunk.text.trim());
    this.confidenceScores.push(chunk.confidence || 0.9);

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }

    // If chunk is explicitly marked final and contains terminal punctuation, flush promptly
    const isTerminal = /[.?!]$/.test(chunk.text.trim());
    if (chunk.isFinal && isTerminal) {
      this.flushUtterance();
      return;
    }

    // Or wait for silence timeout
    this.silenceTimer = setTimeout(() => {
      this.flushUtterance();
    }, this.SILENCE_TIMEOUT_MS);
  }

  public flushUtterance(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.buffer.length === 0) return;

    // Join buffer into coherent text, removing duplicate repeated words at joins
    const rawJoined = this.buffer.join(' ').replace(/\s+/g, ' ').trim();
    this.buffer = [];

    if (rawJoined.length < 5) return; // ignore isolated noise fragments

    const avgConfidence = this.confidenceScores.length > 0
      ? this.confidenceScores.reduce((a, b) => a + b, 0) / this.confidenceScores.length
      : 0.92;
    this.confidenceScores = [];

    const detectedLang = detectSpokenLanguage(rawJoined);
    const isQuestion = this.checkIsQuestion(rawJoined);

    const utterance: Utterance = {
      id: `utt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      text: rawJoined,
      startTime: this.startTime || Date.now(),
      endTime: this.lastChunkTime || Date.now(),
      speaker: 'interviewer',
      language: detectedLang,
      confidence: Number(avgConfidence.toFixed(2)),
      isQuestion,
    };

    this.onUtteranceComplete(utterance);
  }

  public reset(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    this.buffer = [];
    this.confidenceScores = [];
    this.startTime = 0;
    this.lastChunkTime = 0;
  }

  private checkIsQuestion(text: string): boolean {
    const trimmed = text.trim().toLowerCase();
    if (trimmed.endsWith('?')) return true;
    return QUESTION_INDICATOR_REGEX.test(trimmed);
  }
}
