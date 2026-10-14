import { 
  InterviewQuestion, 
  AnswerBlueprint, 
  CandidateEvidence, 
  MatchCategory, 
  RelevantExperienceItem 
} from '../types';

export interface AnswerDirectionStage {
  stage: 'OPENING' | 'DECISION' | 'REASONING' | 'TRADE-OFF' | 'RESULT';
  guidance: string;
}

export interface MissingEvidenceInfo {
  warning: string;
  instruction: string;
  field?: string;
}

export interface AnswerGuidanceOutput {
  matchCategory: MatchCategory;
  matchConfidence: number;
  matchedQuestionTitle?: string;
  bestStoryTitle?: string;
  bestStory?: CandidateEvidence;
  blueprint?: {
    situation: string;
    task: string;
    action: string[];
    tradeoffs: string[];
    result: string[];
  };
  keyPoints: string[];
  
  // For No Exact Match / Personal Answer Guidance Flow:
  intentLabel?: string;
  relevantCompetencies?: string[];
  relatedIntents?: string[];
  relevantExperience?: { title: string; confidencePct: number; metrics: string[] }[];
  answerDirectionStages?: AnswerDirectionStage[];
  answerDirection?: string[];
  missingEvidence?: MissingEvidenceInfo;
}

export class AnswerGuidanceService {
  /**
   * Generates concise, glanceable preparation cues based purely on stored candidate evidence.
   * Never fabricates experience. Never generates an invented essay answer.
   */
  public static generateGuidance(params: {
    matchCategory: MatchCategory;
    matchConfidence: number;
    matchedQuestion?: InterviewQuestion | null;
    bestStory?: CandidateEvidence | null;
    blueprint?: AnswerBlueprint | null;
    topEvidence: RelevantExperienceItem[];
    semanticIntent: string;
    competencies: string[];
  }): AnswerGuidanceOutput {
    const {
      matchCategory,
      matchConfidence,
      matchedQuestion,
      bestStory,
      blueprint,
      topEvidence,
      semanticIntent,
      competencies,
    } = params;

    // STRONG MATCH or RELATED MATCH:
    if (matchCategory === 'STRONG MATCH' || (matchCategory === 'RELATED MATCH' && matchedQuestion)) {
      const storyTitle = bestStory?.title || 'Personal Production Experience';
      
      const situation = blueprint?.situation || matchedQuestion?.starGuidance?.situation || 'Set up production context and stakes clearly.';
      const task = blueprint?.task || matchedQuestion?.starGuidance?.task || 'State your role and core objective.';
      const actions = blueprint?.action || (matchedQuestion?.starGuidance?.action ? [matchedQuestion.starGuidance.action] : ['Outline deliberate technical steps taken.']);
      const tradeoffs = blueprint?.tradeoffs || ['Balanced operational simplicity against engineering effort.'];
      const results = blueprint?.result || (matchedQuestion?.starGuidance?.result ? [matchedQuestion.starGuidance.result] : ['Quantify production impact and reliability outcome.']);

      const keyPoints = this.deriveKeyPoints(matchedQuestion, bestStory, blueprint, competencies);

      return {
        matchCategory,
        matchConfidence,
        matchedQuestionTitle: matchedQuestion?.question,
        bestStoryTitle: storyTitle,
        bestStory: bestStory || undefined,
        blueprint: {
          situation,
          task,
          action: actions,
          tradeoffs,
          result: results,
        },
        keyPoints,
      };
    }

    // ==================================================
    // NO-MATCH → PERSONAL ANSWER GUIDANCE FLOW
    // ==================================================
    // 1. Detect semantic intent
    let intentLabel = 'Decision Making Under Ambiguity';
    if (semanticIntent.includes('conflict')) {
      intentLabel = 'Stakeholder Conflict & Alignment';
    } else if (semanticIntent.includes('prioritization')) {
      intentLabel = 'Strategic Prioritization & Capacity Trade-offs';
    } else if (semanticIntent.includes('ambiguity') || semanticIntent.includes('decision')) {
      intentLabel = 'Decision Making Under Ambiguity';
    }

    // 2. Identify required competencies
    let relevantCompetencies: string[] = ['Decision Making', 'Structured Thinking', 'Risk Assessment'];
    if (competencies && competencies.length > 0) {
      relevantCompetencies = competencies.slice(0, 3).map(c => {
        return c.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      });
    }

    // 3. Retrieve relevant candidate evidence
    const relevantExperience = topEvidence.map(item => {
      return {
        title: item.evidence.title,
        confidencePct: Math.round(item.confidence * 100),
        metrics: item.evidence.metrics || [],
      };
    });

    // 4. Identify missing information in stored evidence
    // Check if any retrieved story lacks quantified metrics
    const hasUnquantifiedEvidence = topEvidence.some(item => !item.evidence.metrics || item.evidence.metrics.length === 0);
    const missingEvidence: MissingEvidenceInfo = {
      warning: 'Quantified outcome not found.',
      instruction: 'Add a concrete metric if you have one.',
      field: 'result_metrics',
    };

    // 5. Generate concise answer guidance based only on stored evidence
    const answerDirectionStages: AnswerDirectionStage[] = [
      { stage: 'OPENING', guidance: 'Set the ambiguous context.' },
      { stage: 'DECISION', guidance: 'Explain what you chose.' },
      { stage: 'REASONING', guidance: 'Explain what evidence you used.' },
      { stage: 'TRADE-OFF', guidance: 'Explain what you sacrificed.' },
      { stage: 'RESULT', guidance: 'Use a real measurable outcome if available.' },
    ];

    const answerDirection = answerDirectionStages.map(s => `${s.stage}: ${s.guidance}`);

    return {
      matchCategory: 'NO STRONG MATCH',
      matchConfidence,
      intentLabel,
      relevantCompetencies,
      relatedIntents: relevantCompetencies,
      relevantExperience,
      answerDirectionStages,
      answerDirection,
      missingEvidence: hasUnquantifiedEvidence ? missingEvidence : {
        warning: 'Quantified outcome not found.',
        instruction: 'Add a concrete metric if you have one.',
      },
      keyPoints: [
        'Set the ambiguous context and missing telemetry',
        'State your working assumption upfront',
        'Explain what you chose and what you sacrificed',
        'Use a real measurable outcome if available'
      ],
    };
  }

  private static deriveKeyPoints(
    question?: InterviewQuestion | null,
    story?: CandidateEvidence | null,
    blueprint?: AnswerBlueprint | null,
    competencies?: string[]
  ): string[] {
    const points: string[] = [];

    // Point 1: Opening framework
    if (blueprint?.opening) {
      points.push(blueprint.opening);
    } else if (question?.context) {
      points.push(question.context.slice(0, 110) + '...');
    } else {
      points.push('Acknowledge business constraints and state core architectural philosophy.');
    }

    // Point 2: Decisive action or benchmark
    if (story?.skills && story.skills.length > 0) {
      points.push(`Highlight key skills: ${story.skills.slice(0, 3).join(', ')}.`);
    } else if (question?.keywordsToMention && question.keywordsToMention.length > 0) {
      points.push(`Mention critical concepts: ${question.keywordsToMention.slice(0, 3).join(', ')}.`);
    } else {
      points.push('Walk through the concrete implementation actions taken.');
    }

    // Point 3: Explicit Trade-off
    if (blueprint?.tradeoffs && blueprint.tradeoffs.length > 0) {
      points.push(`Trade-off: ${blueprint.tradeoffs[0]}`);
    } else {
      points.push('State the trade-off made and why alternative options were discarded.');
    }

    // Point 4: Metric or outcome
    if (story?.metrics && story.metrics.length > 0) {
      points.push(`Outcome: ${story.metrics[0]}`);
    } else {
      points.push('Outcome: Add a concrete metric if available.');
    }

    return points.slice(0, 4);
  }
}
