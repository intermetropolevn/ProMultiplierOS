import { InterviewQuestion, AnswerEvaluation } from '../types';

export const EvaluatorService = {
  evaluateAnswer(question: InterviewQuestion, answer: string): AnswerEvaluation {
    const trimmed = answer.trim();
    const wordCount = trimmed.length > 0 ? trimmed.split(/\s+/).length : 0;

    if (wordCount < 15) {
      return {
        score: Math.min(30, Math.max(10, wordCount * 2)),
        ratingTier: 'Needs Work',
        starBreakdown: {
          situationTaskScore: 10,
          actionScore: 10,
          resultImpactScore: 5,
        },
        strengths: ['Initial thought initiated.'],
        improvementAreas: [
          'Answer is too concise for an in-depth interview question. Aim for at least 100-250 words.',
          'Provide concrete context, personal architectural actions, and measurable results.',
          'Explicitly address the rubric criteria.',
        ],
        keywordsMatched: [],
        keywordsMissed: question.keywordsToMention,
        detailedFeedback: 'Your response was too brief for an interviewer to gauge your depth. Use the STAR method: articulate the high-stakes Situation, your precise Task, the technical or strategic Actions you spearheaded, and the measurable business Results.',
      };
    }

    const lowerAnswer = trimmed.toLowerCase();

    // 1. STAR marker detection
    const situationMarkers = [
      'when', 'at my', 'company', 'team', 'project', 'challenge', 'situation', 
      'problem', 'background', 'context', 'initially', 'faced', 'needed to', 'tasked with'
    ];
    const actionMarkers = [
      'i decided', 'i built', 'i designed', 'i analyzed', 'i proposed', 'i implemented',
      'i organized', 'i led', 'i conducted', 'my approach', 'i recommended', 'we architected',
      'i introduced', 'i scheduled', 'i optimized', 'i resolved'
    ];
    const resultMarkers = [
      'result', 'outcome', 'impact', 'reduced', 'improved', 'increased', 'saved',
      'achieved', '%', 'percent', 'dollars', 'shipped', 'delivered', 'learned', 'retrospective', 'metric'
    ];

    const hasSituation = situationMarkers.some(m => lowerAnswer.includes(m));
    const hasAction = actionMarkers.some(m => lowerAnswer.includes(m));
    const hasResult = resultMarkers.some(m => lowerAnswer.includes(m));

    // Calculate STAR subscores
    let situationScore = hasSituation ? 25 : 12;
    let actionScore = hasAction ? 40 : 18;
    let resultScore = hasResult ? 35 : 15;

    // Word count bonus/penalty
    if (wordCount >= 100 && wordCount <= 350) {
      situationScore = Math.min(30, situationScore + 5);
      actionScore = Math.min(45, actionScore + 5);
      resultScore = Math.min(35, resultScore + 5);
    } else if (wordCount > 350) {
      // Good depth but potentially slightly verbose
      actionScore = Math.min(45, actionScore + 3);
    } else if (wordCount < 50) {
      situationScore = Math.max(10, situationScore - 8);
      actionScore = Math.max(10, actionScore - 12);
      resultScore = Math.max(8, resultScore - 10);
    }

    // 2. Keyword detection
    const keywordsMatched: string[] = [];
    const keywordsMissed: string[] = [];

    question.keywordsToMention.forEach(keyword => {
      const normalized = keyword.toLowerCase();
      // Test either exact or parts (e.g. "idempotency-key" or "idempotency")
      const words = normalized.split(/[\s\-/]+/);
      const matched = words.some(w => w.length > 3 && lowerAnswer.includes(w)) || lowerAnswer.includes(normalized);
      if (matched) {
        keywordsMatched.push(keyword);
      } else {
        keywordsMissed.push(keyword);
      }
    });

    // Keyword coverage ratio
    const keywordRatio = question.keywordsToMention.length > 0 
      ? keywordsMatched.length / question.keywordsToMention.length 
      : 0.5;

    // 3. Compute final score
    let totalScore = Math.round(
      (situationScore + actionScore + resultScore) * 0.7 + (keywordRatio * 100) * 0.3
    );
    totalScore = Math.max(15, Math.min(96, totalScore));

    // Determine tier
    let ratingTier: AnswerEvaluation['ratingTier'] = 'Competent';
    if (totalScore >= 85) ratingTier = 'Exceptional';
    else if (totalScore >= 72) ratingTier = 'Strong';
    else if (totalScore >= 55) ratingTier = 'Competent';
    else ratingTier = 'Needs Work';

    // Formulate strengths & improvements
    const strengths: string[] = [];
    const improvementAreas: string[] = [];

    if (hasAction) {
      strengths.push('Active personal ownership: Clearly articulated specific engineering or product actions taken.');
    }
    if (hasResult) {
      strengths.push('Impact-oriented closing: Highlighted tangible outcomes or measurable business results.');
    }
    if (keywordsMatched.length >= 2) {
      strengths.push(`Strong domain fluency: Incorporated critical concepts such as ${keywordsMatched.slice(0, 3).join(', ')}.`);
    }
    if (wordCount >= 90) {
      strengths.push('Comprehensive narrative depth: Provided adequate technical context for senior interviewers.');
    }
    if (strengths.length === 0) {
      strengths.push('Touched upon the core problem space.');
    }

    if (!hasResult) {
      improvementAreas.push('Quantify the outcome: State clear metrics (% latency drop, revenue unblocked, failure rate reduced).');
    }
    if (!hasAction) {
      improvementAreas.push('Differentiate "I" vs "We": Specify your direct technical design contributions versus general team actions.');
    }
    if (keywordsMissed.length > 0) {
      improvementAreas.push(`Mention key industry concepts: Consider integrating terms like ${keywordsMissed.slice(0, 3).join(', ')}.`);
    }
    if (wordCount < 80) {
      improvementAreas.push('Elaborate with concrete architectural nuances and edge-case handling.');
    }

    let detailedFeedback = '';
    if (ratingTier === 'Exceptional') {
      detailedFeedback = 'Outstanding demonstration of senior-level ownership and domain fluency. Your response balanced structural clarity with specific trade-offs and verifiable business results.';
    } else if (ratingTier === 'Strong') {
      detailedFeedback = 'Strong, confident delivery. You communicated the core situation and actions convincingly. Bolster with sharper metrics and proactive discussion of failure modes to reach the top percentile.';
    } else if (ratingTier === 'Competent') {
      detailedFeedback = 'Good fundamental understanding. To elevate to Senior/Staff calibration, enrich your response with specific engineering metrics, edge-case mitigation, and deeper architectural rationale.';
    } else {
      detailedFeedback = 'Your response requires more structural discipline. Adopt the STAR framework explicitly: establish the high-stakes problem, explain your personal technical decision-making, and close with the business outcome.';
    }

    return {
      score: totalScore,
      ratingTier,
      starBreakdown: {
        situationTaskScore: Math.round(situationScore),
        actionScore: Math.round(actionScore),
        resultImpactScore: Math.round(resultScore),
      },
      strengths,
      improvementAreas,
      keywordsMatched,
      keywordsMissed,
      detailedFeedback,
    };
  },

  /**
   * Server-Side Moat Evaluation (`/api/intelligence/evaluate-answer`)
   * Executes proprietary scoring on the backend and falls back cleanly if offline.
   */
  async evaluateAnswerAsync(question: InterviewQuestion, answer: string): Promise<AnswerEvaluation> {
    try {
      const res = await fetch('/api/intelligence/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          questionText: question.question,
          keywordsToMention: question.keywordsToMention,
          answer,
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local evaluation when offline
    }
    return this.evaluateAnswer(question, answer);
  },
};
