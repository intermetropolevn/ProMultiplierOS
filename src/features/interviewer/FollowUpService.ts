import { InterviewQuestion } from '../../types';
import { STORED_FOLLOW_UPS_BY_ID, STORED_FOLLOW_UPS_BY_INTENT } from '../../data/storedFollowUps';
import { FollowUpItem } from './types';

export class FollowUpService {
  /**
   * Retrieves the next follow-up question.
   * STRICT DIRECTIVE:
   * 1. Use stored follow-up questions first.
   * 2. Only generate new follow-ups when no suitable stored follow-up exists.
   */
  public static getNextFollowUp(
    question: InterviewQuestion,
    askedFollowUps: string[],
    candidateAnswerText: string
  ): FollowUpItem | null {
    // 1. Check direct stored follow-ups on the question object or by ID
    const storedList: string[] = [];

    if (question.storedFollowUps && question.storedFollowUps.length > 0) {
      storedList.push(...question.storedFollowUps);
    }

    if (STORED_FOLLOW_UPS_BY_ID[question.id]) {
      for (const item of STORED_FOLLOW_UPS_BY_ID[question.id]) {
        if (!storedList.includes(item)) {
          storedList.push(item);
        }
      }
    }

    // Check intent-based stored follow-ups
    const questionText = `${question.question} ${question.context || ''}`;
    for (const mapping of STORED_FOLLOW_UPS_BY_INTENT) {
      if (mapping.pattern.test(questionText)) {
        for (const item of mapping.followUps) {
          if (!storedList.includes(item)) {
            storedList.push(item);
          }
        }
        break; // matched most specific pattern
      }
    }

    // Find the first unasked stored follow-up
    const nextStored = storedList.find(f => !askedFollowUps.some(a => a.toLowerCase().trim() === f.toLowerCase().trim()));

    if (nextStored) {
      return {
        id: `stored-fu-${Date.now()}`,
        question: nextStored,
        isStored: true,
        source: 'stored',
        promptReason: 'Retrieved from verified question library stored follow-ups.',
      };
    }

    // 2. Only generate new follow-ups when no suitable stored follow-up exists
    const generated = this.generateDynamicFollowUp(question, candidateAnswerText, askedFollowUps);
    return generated;
  }

  /**
   * Generates a context-aware follow-up question when stored follow-ups are exhausted
   */
  private static generateDynamicFollowUp(
    question: InterviewQuestion,
    candidateAnswer: string,
    askedFollowUps: string[]
  ): FollowUpItem | null {
    const text = (candidateAnswer || '').toLowerCase();
    const hasNumbersOrMetrics = /\b\d+(\.\d+)?%?\b/.test(text) || text.includes('percent') || text.includes('reduced') || text.includes('increased');
    const hasTradeOff = text.includes('trade-off') || text.includes('sacrifice') || text.includes('alternative') || text.includes('compromise');
    const hasRetrospective = text.includes('differently') || text.includes('looking back') || text.includes('lesson') || text.includes('learned');

    // Gap analysis: Metrics
    if (!hasNumbersOrMetrics && !askedFollowUps.some(f => f.toLowerCase().includes('measurable') || f.toLowerCase().includes('metric'))) {
      return {
        id: `gen-fu-metric-${Date.now()}`,
        question: 'What was the measurable outcome or quantitative impact of your decision?',
        isStored: false,
        source: 'generated',
        targetAspect: 'metric',
        promptReason: 'Candidate answer did not provide quantified outcome data.',
      };
    }

    // Gap analysis: Trade-off
    if (!hasTradeOff && !askedFollowUps.some(f => f.toLowerCase().includes('trade-off') || f.toLowerCase().includes('compromise'))) {
      return {
        id: `gen-fu-tradeoff-${Date.now()}`,
        question: 'What key technical or operational trade-offs did you have to weigh before moving forward?',
        isStored: false,
        source: 'generated',
        targetAspect: 'tradeoff',
        promptReason: 'Candidate response lacked explicit discussion of evaluated alternatives or trade-offs.',
      };
    }

    // Gap analysis: Retrospective
    if (!hasRetrospective && !askedFollowUps.some(f => f.toLowerCase().includes('differently'))) {
      return {
        id: `gen-fu-reflect-${Date.now()}`,
        question: 'Looking back with the benefit of hindsight, what would you do differently today?',
        isStored: false,
        source: 'generated',
        targetAspect: 'reflection',
        promptReason: 'Candidate response completed actions without reflection or retrospective takeaways.',
      };
    }

    // If candidate has already covered all major aspects and asked follow-ups exist, no more follow-ups needed
    return null;
  }
}
