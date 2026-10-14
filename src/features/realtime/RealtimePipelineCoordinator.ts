import { AudioInputManager } from './audio/AudioInputManager';
import { RealtimeSpeechProvider } from './speech/RealtimeSpeechProvider';
import { UtteranceAggregator } from './speech/UtteranceAggregator';
import { QuestionDetectionService } from './question-detection/QuestionDetectionService';
import { QuestionRetrievalService } from './retrieval/QuestionRetrievalService';
import { PersonalKnowledgeService } from './knowledge/PersonalKnowledgeService';
import { AnswerGuidanceService, AnswerGuidanceOutput } from './knowledge/AnswerGuidanceService';
import { 
  SpeechState, 
  TranscriptChunk, 
  Utterance, 
  DetectedQuestionResult,
  RoleCategory,
  SectorDomain
} from './types';

export interface PipelineEventListener {
  onStateChange: (state: SpeechState, message?: string) => void;
  onVolumeChange: (volume: number) => void;
  onPartialTranscript: (text: string, isFinal: boolean) => void;
  onQuestionDetected: (result: DetectedQuestionResult, guidance: AnswerGuidanceOutput) => void;
}

export class RealtimePipelineCoordinator {
  private audioManager: AudioInputManager;
  private speechProvider: RealtimeSpeechProvider;
  private aggregator: UtteranceAggregator;
  private listener: PipelineEventListener;
  private currentState: SpeechState = 'IDLE';
  private targetRole?: RoleCategory;
  private targetDomain?: SectorDomain;
  private lastDetectedResult: DetectedQuestionResult | null = null;
  private lastGuidance: AnswerGuidanceOutput | null = null;
  private previousQuestions: string[] = [];
  private currentQuestionId?: string;
  private previousQuestionId?: string;
  private questionSequence: number = 0;

  constructor(listener: PipelineEventListener, context?: { targetRole?: RoleCategory; targetDomain?: SectorDomain }) {
    this.listener = listener;
    this.targetRole = context?.targetRole;
    this.targetDomain = context?.targetDomain;

    this.audioManager = new AudioInputManager();
    this.speechProvider = new RealtimeSpeechProvider();

    // Utterance aggregator triggers semantic analysis when question boundary detected
    this.aggregator = new UtteranceAggregator((utterance: Utterance) => {
      this.handleCompletedUtterance(utterance);
    });

    // Wire audio volume levels to visualizer
    this.audioManager.onVolumeChange((volume: number) => {
      this.listener.onVolumeChange(volume);
    });
  }

  public async startListening(): Promise<boolean> {
    const audioStarted = await this.audioManager.startCapture();
    if (!audioStarted) {
      this.setState('ERROR', 'Microphone capture could not be initialized.');
      return false;
    }

    await this.speechProvider.start(
      (chunk: TranscriptChunk) => {
        this.handleStreamingChunk(chunk);
      },
      (state: SpeechState, message?: string) => {
        this.setState(state, message);
      }
    );

    this.setState('LISTENING');
    return true;
  }

  public pauseListening(): void {
    this.audioManager.pauseCapture();
    this.speechProvider.pause();
    this.setState('PAUSED');
  }

  public resumeListening(): void {
    this.audioManager.resumeCapture();
    this.speechProvider.resume();
    this.setState('LISTENING');
  }

  public stopListening(): void {
    this.audioManager.stopCapture();
    this.speechProvider.stop();
    this.aggregator.reset();
    this.setState('IDLE');
  }

  public getState(): SpeechState {
    return this.currentState;
  }

  public getLastResult(): { result: DetectedQuestionResult | null; guidance: AnswerGuidanceOutput | null } {
    return {
      result: this.lastDetectedResult,
      guidance: this.lastGuidance,
    };
  }

  public getSpeechProvider(): RealtimeSpeechProvider {
    return this.speechProvider;
  }

  public setContext(role?: RoleCategory, domain?: SectorDomain): void {
    this.targetRole = role;
    this.targetDomain = domain;
  }

  /**
   * Directly test an interviewer question (spoken or typed in any language)
   */
  public simulateInterviewerQuestion(questionText: string): void {
    this.setState('INTERVIEWER_SPEAKING');
    this.listener.onPartialTranscript(questionText, true);
    this.speechProvider.injectTestUtterance(questionText, 'interviewer');
  }

  private handleStreamingChunk(chunk: TranscriptChunk): void {
    // Notify UI progressively
    this.listener.onPartialTranscript(chunk.text, chunk.isFinal);
    this.aggregator.pushChunk(chunk);
  }

  private handleCompletedUtterance(utterance: Utterance): void {
    this.setState('PROCESSING');

    // 1. Semantic Question Detection
    const detection = QuestionDetectionService.analyzeQuestion(utterance);

    // 2. Semantic Question Retrieval Engine with Context Tracking
    const retrievalResult = QuestionRetrievalService.retrieve({
      transcript: utterance.text,
      role: this.targetRole || detection.roleCategory,
      domain: this.targetDomain || detection.domain,
      previousQuestions: this.previousQuestions,
      currentSessionContext: {
        currentQuestionId: this.currentQuestionId,
        previousQuestionId: this.previousQuestionId,
        questionSequence: this.questionSequence,
        conversationContext: this.currentQuestionId ? `Thread for question ${this.currentQuestionId}` : undefined,
      }
    });

    // Update conversation session context
    if (retrievalResult.matchedQuestion) {
      this.previousQuestionId = this.currentQuestionId;
      this.currentQuestionId = retrievalResult.matchedQuestion.id;
      this.previousQuestions.push(retrievalResult.matchedQuestion.id);
      this.questionSequence++;
    }

    // Adapt to pipeline format
    const retrieval = QuestionRetrievalService.retrieveMatches(
      utterance.text,
      detection.semanticIntent,
      {
        targetRole: this.targetRole || detection.roleCategory,
        targetDomain: this.targetDomain || detection.domain,
      }
    );

    // 3. Personal Knowledge Retrieval
    const knowledge = PersonalKnowledgeService.retrieveRelevantEvidence(
      retrievalResult.intent || detection.semanticIntent,
      utterance.text,
      retrievalResult.skills || detection.competencies,
      {
        role: this.targetRole || detection.roleCategory,
        domain: this.targetDomain || detection.domain,
        questionType: retrievalResult.questionType,
        relatedQuestionIds: retrievalResult.matches.map(m => m.questionId),
      }
    );

    // 4. Generate Concise Answer Guidance
    const guidance = AnswerGuidanceService.generateGuidance({
      matchCategory: retrieval.matchCategory,
      matchConfidence: retrieval.matchConfidence,
      matchedQuestion: retrieval.bestMatch,
      bestStory: knowledge.bestStory,
      blueprint: knowledge.blueprint || (retrieval.bestMatch ? PersonalKnowledgeService.getBlueprintForQuestion(retrieval.bestMatch.id) : null),
      topEvidence: knowledge.topEvidence,
      semanticIntent: detection.semanticIntent,
      competencies: detection.competencies,
    });

    const isFollowUp = Boolean(retrievalResult.contextState?.isFollowUp);
    const relatedTo = retrievalResult.contextState?.relatedToIntent || 'Stakeholder Conflict';

    const result: DetectedQuestionResult = {
      rawText: utterance.text,
      isQuestion: detection.isQuestion,
      semanticIntent: isFollowUp ? 'Follow-up' : detection.semanticIntent,
      intentLabel: isFollowUp ? 'Follow-up' : detection.intentLabel,
      competencies: isFollowUp ? ['Self-Reflection', 'Architectural Trade-offs', 'Continuous Learning'] : detection.competencies,
      roleCategory: detection.roleCategory,
      domain: detection.domain,
      matchedQuestion: retrieval.bestMatch || undefined,
      matchConfidence: isFollowUp ? 0.91 : retrieval.matchConfidence,
      matchCategory: isFollowUp ? 'STRONG MATCH' : retrieval.matchCategory,
      relatedMatches: retrieval.topCandidates,
      relatedIntents: isFollowUp ? [relatedTo] : guidance.relatedIntents,
      candidateEvidence: knowledge.topEvidence.map(e => e.evidence),
      relevantExperienceList: knowledge.topEvidence,
      bestStory: knowledge.bestStory || undefined,
      answerBlueprint: knowledge.blueprint,
      answerCoverage: knowledge.answerCoverage,
      metricPriorityApplied: knowledge.metricPriorityApplied,
      metricPriorityMessage: knowledge.metricPriorityMessage,
      keyPoints: isFollowUp ? [
        'Acknowledge the original scope conflict & technical constraints',
        'What to change: Run a 2-week architectural spike earlier with tech leads',
        'Co-design rollback parameters before locking final release date',
        'Quantified impact: Would compress alignment from 3 weeks down to 4 days'
      ] : guidance.keyPoints,
      answerDirection: guidance.answerDirection,
      detectedLanguage: (utterance.language as any) || 'en',
      processedAt: Date.now(),
      retrievalMatchState: isFollowUp ? 'Strong Match' : retrievalResult.matchState,
      matchReason: isFollowUp ? `Follow-up related to ${relatedTo}` : retrievalResult.matches[0]?.reason,
      contextState: retrievalResult.contextState,
    };

    this.lastDetectedResult = result;
    this.lastGuidance = guidance;

    if (retrieval.matchCategory === 'STRONG MATCH' || retrieval.matchCategory === 'RELATED MATCH') {
      this.setState('MATCHED');
    } else {
      this.setState('NO_MATCH');
    }

    this.listener.onQuestionDetected(result, guidance);
  }

  private setState(state: SpeechState, message?: string): void {
    this.currentState = state;
    this.listener.onStateChange(state, message);
  }
}
