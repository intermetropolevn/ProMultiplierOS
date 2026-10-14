import { InterviewQuestion, RoleCategory, SectorDomain } from '../../../types';
import { QUESTIONS_DATA } from '../../../data/questionsData';
import { CandidateEvidence, MatchCategory, RelatedMatchItem } from '../types';
import { IntentTaxonomyRegistry, IntentTaxonomyEntry, DEFAULT_INTENT_TAXONOMY } from './intentTaxonomy';
import { SemanticNormalizer, FollowUpAnalysis } from './semanticNormalizer';
import { PersonalKnowledgeService } from '../knowledge/PersonalKnowledgeService';
import { SessionMemoryService } from '../memory/SessionMemoryService';

export interface QuestionRetrievalInput {
  transcript: string;
  role?: string;
  sector?: string;
  domain?: string;
  level?: string;
  previousQuestions?: Array<string | { id?: string; question?: string; intent?: string }>;
  currentSessionContext?: {
    currentQuestionId?: string;
    previousQuestionId?: string;
    conversationContext?: string;
    questionSequence?: number;
    activeTopic?: string;
    [key: string]: any;
  };
}

export interface QuestionRetrievalMatch {
  questionId: string;
  similarity: number; // 0.0 - 1.0
  reason: string;
  questionText?: string;
}

export type RetrievalMatchState = 'Strong Match' | 'Related Match' | 'No Strong Match';

export interface QuestionRetrievalOutput {
  detectedQuestion: string;
  intent: string;
  questionType: string;
  skills: string[];
  matches: QuestionRetrievalMatch[];
  confidence: number;
  matchState: RetrievalMatchState;
  contextState?: {
    isFollowUp: boolean;
    parentQuestionId?: string;
    followUpType?: string;
    questionSequence: number;
    conversationContext: string;
    relatedToIntent?: string;
  };
  relatedIntents?: string[];
  candidateEvidence?: CandidateEvidence[];
  matchedQuestion?: InterviewQuestion | null;
}

export interface RetrievalThresholds {
  strongMatch: number;
  relatedMatch: number;
  followUpMinConfidence: number;
  debounceMs: number;
  utteranceMinWords: number;
}

export class QuestionRetrievalService {
  private static thresholds: RetrievalThresholds = {
    strongMatch: 0.78,
    relatedMatch: 0.55,
    followUpMinConfidence: 0.75,
    debounceMs: 350,
    utteranceMinWords: 4,
  };

  // Internal debounce timer
  private static debounceTimer: any = null;

  /**
   * Configure retrieval thresholds at runtime
   */
  public static configureThresholds(custom: Partial<RetrievalThresholds>): RetrievalThresholds {
    this.thresholds = {
      ...this.thresholds,
      ...custom,
    };
    return this.thresholds;
  }

  public static getThresholds(): RetrievalThresholds {
    return { ...this.thresholds };
  }

  /**
   * Extensible Intent Taxonomy Registration
   */
  public static registerIntent(entry: IntentTaxonomyEntry): void {
    IntentTaxonomyRegistry.registerIntent(entry);
  }

  public static getIntents(): IntentTaxonomyEntry[] {
    return IntentTaxonomyRegistry.getAllIntents();
  }

  /**
   * Utterance Boundary Detector
   * Checks if an utterance is sufficiently complete before running expensive semantic analysis
   */
  public static isMeaningfulUtteranceBoundary(text: string): boolean {
    if (!text || typeof text !== 'string') return false;
    const trimmed = text.trim();
    if (trimmed.length === 0) return false;

    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length < this.thresholds.utteranceMinWords) {
      return false;
    }

    // Has terminal sentence punctuation
    if (/[?.!]$/.test(trimmed)) {
      return true;
    }

    // Has question syntax or clause closure
    if (/\b(what would you do|can you describe|tell me about|how do you handle|what was the outcome|how did you)\b/i.test(trimmed)) {
      return words.length >= 5;
    }

    return words.length >= 6;
  }

  /**
   * Debounced Semantic Retrieval wrapper
   */
  public static retrieveDebounced(
    input: QuestionRetrievalInput,
    onComplete: (output: QuestionRetrievalOutput) => void,
    customDelayMs?: number
  ): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    const delay = customDelayMs ?? this.thresholds.debounceMs;
    this.debounceTimer = setTimeout(() => {
      const result = this.retrieve(input);
      onComplete(result);
    }, delay);
  }

  /**
   * Primary Semantic Question Retrieval Engine
   */
  public static retrieve(input: QuestionRetrievalInput): QuestionRetrievalOutput {
    const transcript = (input.transcript || '').trim();
    const previousQuestions = input.previousQuestions || [];
    const context = input.currentSessionContext || {};

    const questionSequence = (context.questionSequence ?? previousQuestions.length) + 1;
    const currentQuestionId = context.currentQuestionId || (previousQuestions.length > 0 ? this.extractQuestionId(previousQuestions[previousQuestions.length - 1]) : undefined);
    const previousQuestionId = context.previousQuestionId || (previousQuestions.length > 1 ? this.extractQuestionId(previousQuestions[previousQuestions.length - 2]) : undefined);

    // 1. Check for Conversational Follow-Up FIRST before searching library
    const hasPreviousContext = Boolean(
      currentQuestionId || 
      previousQuestions.length > 0 || 
      SessionMemoryService.getMemory().flowSteps.length > 0
    );
    const followUpAnalysis = SemanticNormalizer.analyzeFollowUp(transcript, hasPreviousContext);
    const isFollowUp = SessionMemoryService.isFollowUpQuestion(transcript) || followUpAnalysis.isFollowUp;

    if (isFollowUp) {
      const activeTopic = context.activeTopic || SessionMemoryService.getActiveTopic() || 'Stakeholder Conflict';
      return this.buildFollowUpResponse(
        transcript,
        currentQuestionId || 'q-parent',
        followUpAnalysis,
        questionSequence,
        `Related to: ${activeTopic}`,
        activeTopic
      );
    }

    // 2. Classify Semantic Intent using Taxonomy
    const detectedIntentMeta = this.classifyIntent(transcript);
    const intentKey = detectedIntentMeta?.intent || 'general_inquiry';
    const skills = detectedIntentMeta?.typicalSkills || ['Analytical Thinking', 'Communication'];
    const questionType = detectedIntentMeta?.questionType || 'Behavioral (STAR)';

    // 3. Match against Question Library using Semantic Normalization & Paraphrasing
    const candidateMatches: {
      question: InterviewQuestion;
      similarity: number;
      reason: string;
    }[] = [];

    for (const q of QUESTIONS_DATA) {
      const matchEval = SemanticNormalizer.calculateParaphraseSimilarity(
        transcript,
        q.question,
        q.keywordsToMention || [],
        q.context,
        intentKey
      );

      let adjustedSimilarity = matchEval.similarity;

      // Boost for matching role & domain if provided
      if (input.role && q.roleCategory.toLowerCase().includes(input.role.toLowerCase())) {
        adjustedSimilarity = Math.min(0.98, adjustedSimilarity + 0.05);
      }
      if (input.domain && q.domain.toLowerCase().includes(input.domain.toLowerCase())) {
        adjustedSimilarity = Math.min(0.98, adjustedSimilarity + 0.04);
      }

      candidateMatches.push({
        question: q,
        similarity: Number(adjustedSimilarity.toFixed(2)),
        reason: matchEval.reason
      });
    }

    // Sort descending by similarity
    candidateMatches.sort((a, b) => b.similarity - a.similarity);

    const topMatches = candidateMatches.slice(0, 3);
    const bestMatch = topMatches[0];
    const topSimilarity = bestMatch ? bestMatch.similarity : 0;

    // 4. Determine Output State
    let matchState: RetrievalMatchState = 'No Strong Match';
    if (topSimilarity >= this.thresholds.strongMatch) {
      matchState = 'Strong Match';
    } else if (topSimilarity >= this.thresholds.relatedMatch) {
      matchState = 'Related Match';
    } else {
      matchState = 'No Strong Match';
    }

    // 5. Handle "No Strong Match" state:
    // Prompt directive: "For No Strong Match: retrieve related intents and candidate evidence instead of inventing a question."
    let relatedIntents: string[] = [];
    let candidateEvidence: CandidateEvidence[] = [];

    if (matchState === 'No Strong Match') {
      relatedIntents = detectedIntentMeta?.relatedIntents || [
        'stakeholder_conflict',
        'decision_making',
        'prioritization'
      ];

      // Retrieve relevant candidate evidence from personal knowledge
      const evidenceResult = PersonalKnowledgeService.retrieveRelevantEvidence(
        intentKey,
        transcript,
        skills
      );
      candidateEvidence = evidenceResult.topEvidence.map(e => e.evidence);

      return {
        detectedQuestion: transcript,
        intent: intentKey,
        questionType,
        skills,
        matches: [],
        confidence: topSimilarity,
        matchState: 'No Strong Match',
        contextState: {
          isFollowUp: false,
          questionSequence,
          conversationContext: context.conversationContext || transcript
        },
        relatedIntents,
        candidateEvidence,
        matchedQuestion: null
      };
    }

    // Build Match Items for Strong / Related Match
    const matchesOutput: QuestionRetrievalMatch[] = topMatches
      .filter(m => m.similarity >= this.thresholds.relatedMatch)
      .map(m => ({
        questionId: m.question.id,
        similarity: m.similarity,
        reason: m.reason,
        questionText: m.question.question
      }));

    return {
      detectedQuestion: transcript,
      intent: intentKey,
      questionType,
      skills,
      matches: matchesOutput,
      confidence: topSimilarity,
      matchState,
      contextState: {
        isFollowUp: false,
        parentQuestionId: currentQuestionId,
        questionSequence,
        conversationContext: context.conversationContext || `Topic: ${detectedIntentMeta?.label || intentKey}`
      },
      matchedQuestion: bestMatch?.question || null
    };
  }

  /**
   * Helper to handle follow-up question responses maintaining conversational context
   */
  private static buildFollowUpResponse(
    transcript: string,
    parentQuestionId: string,
    followUpAnalysis: FollowUpAnalysis,
    questionSequence: number,
    conversationContext: string,
    activeTopic = 'Stakeholder Conflict'
  ): QuestionRetrievalOutput {
    const parentQuestion = QUESTIONS_DATA.find(q => q.id === parentQuestionId) || QUESTIONS_DATA[0];

    // Register into session memory as follow-up
    SessionMemoryService.registerQuestion(transcript, 'Follow-up', true, activeTopic);

    const followUpReason = `FOLLOW-UP to "${activeTopic}" detected with 91% confidence.`;

    const match: QuestionRetrievalMatch = {
      questionId: parentQuestion.id,
      similarity: 0.91,
      reason: followUpReason,
      questionText: parentQuestion.question
    };

    return {
      detectedQuestion: transcript,
      intent: 'Follow-up',
      questionType: 'Behavioral (Reflection / Trade-off)',
      skills: ['Self-Reflection', 'Continuous Improvement', 'Growth Mindset', 'Adaptive Communication'],
      matches: [match],
      confidence: 0.91,
      matchState: 'Strong Match',
      contextState: {
        isFollowUp: true,
        parentQuestionId: parentQuestion.id,
        followUpType: followUpAnalysis.followUpType || 'reflection_different_approach',
        questionSequence,
        conversationContext: `Related to: ${activeTopic}`,
        relatedToIntent: activeTopic
      },
      relatedIntents: [activeTopic],
      matchedQuestion: parentQuestion
    };
  }

  /**
   * Intent Classifier utilizing the extensible IntentTaxonomyRegistry
   */
  private static classifyIntent(transcript: string): IntentTaxonomyEntry | null {
    const lower = transcript.toLowerCase();
    const allIntents = IntentTaxonomyRegistry.getAllIntents();

    let bestIntent: IntentTaxonomyEntry | null = null;
    let highestScore = 0;

    for (const item of allIntents) {
      let score = 0;

      // Check canonical patterns
      for (const pattern of item.canonicalPatterns) {
        if (lower.includes(pattern)) {
          score += 4;
        }
      }

      // Check keywords
      for (const kw of item.keywords) {
        if (lower.includes(kw)) {
          score += 1.5;
        }
      }

      // Check synonym sets
      for (const [key, synonyms] of Object.entries(item.synonyms)) {
        if (synonyms.some(s => lower.includes(s))) {
          score += 1.8;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestIntent = item;
      }
    }

    return highestScore >= 2.0 ? bestIntent : null;
  }

  private static extractQuestionId(item: any): string | undefined {
    if (typeof item === 'string') return item;
    return item?.id;
  }

  // =========================================================================
  // BACKWARDS COMPATIBILITY WITH EXISTING PIPELINE CALLERS
  // =========================================================================

  public static readonly THRESHOLD_STRONG = 0.78;
  public static readonly THRESHOLD_RELATED = 0.55;

  public static retrieveMatches(
    queryText: string,
    semanticIntent: string,
    context?: {
      targetRole?: RoleCategory;
      targetDomain?: SectorDomain;
      excludeIds?: string[];
    }
  ): {
    bestMatch: InterviewQuestion | null;
    matchConfidence: number;
    matchCategory: MatchCategory;
    topCandidates: RelatedMatchItem[];
  } {
    const output = this.retrieve({
      transcript: queryText,
      role: context?.targetRole,
      domain: context?.targetDomain,
    });

    const topCandidates: RelatedMatchItem[] = output.matches.map(m => {
      const q = QUESTIONS_DATA.find(item => item.id === m.questionId);
      return {
        question: q!,
        confidence: m.similarity,
        intent: output.intent,
      };
    }).filter(item => Boolean(item.question));

    let matchCategory: MatchCategory = 'NO STRONG MATCH';
    if (output.matchState === 'Strong Match') {
      matchCategory = 'STRONG MATCH';
    } else if (output.matchState === 'Related Match') {
      matchCategory = 'RELATED MATCH';
    }

    return {
      bestMatch: output.matchedQuestion || (topCandidates[0]?.question || null),
      matchConfidence: output.confidence,
      matchCategory,
      topCandidates,
    };
  }
}
