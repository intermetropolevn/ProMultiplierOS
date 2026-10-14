// =========================================================================
// CAREER INTELLIGENCE ENGINE - FEEDBACK & LEARNING SIGNALS NORMALIZER
// =========================================================================

import { 
  NormalizedFeedback, 
  FeedbackSource 
} from './types';
import { MemoryEngine } from './MemoryEngine';

export type LearningSignalCategory = 'explicit' | 'implicit' | 'automated';

export interface ComprehensiveSignalRecord extends NormalizedFeedback {
  category: LearningSignalCategory;
  normalizedScore: number; // 0.0 - 1.0
  metadata?: Record<string, any>;
}

export class FeedbackEngine {
  private static feedbackStore: ComprehensiveSignalRecord[] = [
    // Pre-seeded realistic signals
    {
      id: 'sig_exp_01',
      targetId: 'run_init_01',
      targetType: 'agent_output',
      category: 'explicit',
      feedbackType: 'positive',
      severity: 'info',
      signal: 'thumbs_up',
      evidence: 'User clicked thumbs up on Job Match breakdown',
      source: 'user_rating',
      confidence: 0.95,
      normalizedScore: 1.0,
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 'sig_imp_01',
      targetId: 'run_init_02',
      targetType: 'agent_output',
      category: 'implicit',
      feedbackType: 'positive',
      severity: 'info',
      signal: 'user_accepted_answer',
      evidence: 'User copied tailored CV bullet points directly to clipboard',
      source: 'application_outcome',
      confidence: 0.90,
      normalizedScore: 0.95,
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'sig_auto_01',
      targetId: 'run_init_03',
      targetType: 'plan_step',
      category: 'automated',
      feedbackType: 'positive',
      severity: 'info',
      signal: 'verifier_score',
      evidence: 'NumericalVerifier & RubricVerifier passed at 98%',
      source: 'verifier_auto',
      confidence: 1.0,
      normalizedScore: 0.98,
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    }
  ];

  /**
   * SECTION 6: Explicit Learning Signals
   * - thumbs up/down
   * - user correction
   * - user rating (1-5 stars)
   * - assessment score (0-100)
   * - interviewer feedback
   * - case score
   */
  public static ingestExplicitSignal(data: {
    targetId: string;
    type: 'thumbs_up' | 'thumbs_down' | 'user_correction' | 'user_rating' | 'assessment_score' | 'interviewer_feedback' | 'case_score';
    value: number | string;
    correctionText?: string;
    evidenceText?: string;
  }): ComprehensiveSignalRecord {
    let normalizedScore = 0.5;
    let feedbackType: NormalizedFeedback['feedbackType'] = 'positive';
    let severity: NormalizedFeedback['severity'] = 'info';

    if (data.type === 'thumbs_up') {
      normalizedScore = 1.0;
      feedbackType = 'positive';
    } else if (data.type === 'thumbs_down') {
      normalizedScore = 0.1;
      feedbackType = 'complaint';
      severity = 'major';
    } else if (data.type === 'user_rating') {
      const num = Number(data.value);
      normalizedScore = Math.min(1.0, Math.max(0.0, num / 5));
      feedbackType = normalizedScore >= 0.7 ? 'positive' : 'complaint';
      severity = normalizedScore < 0.6 ? 'moderate' : 'info';
    } else if (data.type === 'assessment_score' || data.type === 'case_score') {
      const num = Number(data.value);
      normalizedScore = Math.min(1.0, Math.max(0.0, num / 100));
      feedbackType = normalizedScore >= 0.75 ? 'positive' : 'correction';
      severity = normalizedScore < 0.6 ? 'major' : 'minor';
    } else if (data.type === 'user_correction') {
      normalizedScore = 0.3;
      feedbackType = 'correction';
      severity = 'moderate';
    } else if (data.type === 'interviewer_feedback') {
      normalizedScore = typeof data.value === 'number' ? data.value / 100 : 0.8;
      feedbackType = normalizedScore >= 0.7 ? 'positive' : 'correction';
    }

    const record: ComprehensiveSignalRecord = {
      id: `sig_exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      targetId: data.targetId,
      targetType: 'agent_output',
      category: 'explicit',
      feedbackType,
      severity,
      signal: `${data.type}: ${data.value}`,
      evidence: data.correctionText || data.evidenceText || `Explicit user action: ${data.type}`,
      source: data.type === 'user_correction' ? 'user_correction' : 'user_rating',
      confidence: 0.95,
      normalizedScore,
      timestamp: new Date().toISOString(),
    };

    this.storeSignal(record);
    return record;
  }

  /**
   * SECTION 6: Implicit Learning Signals
   * - user accepted answer
   * - user edited output
   * - user rejected recommendation
   * - user repeated request (dissatisfaction signal)
   * - user abandoned task
   * - application outcome (interview invite, offer, rejection)
   */
  public static ingestImplicitSignal(data: {
    targetId: string;
    type: 'user_accepted_answer' | 'user_edited_output' | 'user_rejected_recommendation' | 'user_repeated_request' | 'user_abandoned_task' | 'application_outcome';
    outcomeDetail?: string;
    editDistancePct?: number;
  }): ComprehensiveSignalRecord {
    let normalizedScore = 0.5;
    let feedbackType: NormalizedFeedback['feedbackType'] = 'positive';
    let severity: NormalizedFeedback['severity'] = 'info';

    switch (data.type) {
      case 'user_accepted_answer':
        normalizedScore = 0.95;
        feedbackType = 'outcome_success';
        break;
      case 'user_edited_output':
        const distance = data.editDistancePct || 20;
        normalizedScore = Math.max(0.3, 1.0 - (distance / 100));
        feedbackType = distance > 50 ? 'correction' : 'positive';
        severity = distance > 50 ? 'moderate' : 'minor';
        break;
      case 'user_rejected_recommendation':
        normalizedScore = 0.2;
        feedbackType = 'outcome_rejection';
        severity = 'moderate';
        break;
      case 'user_repeated_request':
        normalizedScore = 0.25;
        feedbackType = 'complaint';
        severity = 'moderate';
        break;
      case 'user_abandoned_task':
        normalizedScore = 0.15;
        feedbackType = 'complaint';
        severity = 'major';
        break;
      case 'application_outcome':
        if (data.outcomeDetail?.includes('offer') || data.outcomeDetail?.includes('interview')) {
          normalizedScore = 1.0;
          feedbackType = 'outcome_success';
        } else {
          normalizedScore = 0.4;
          feedbackType = 'outcome_rejection';
        }
        break;
    }

    const record: ComprehensiveSignalRecord = {
      id: `sig_imp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      targetId: data.targetId,
      targetType: 'agent_output',
      category: 'implicit',
      feedbackType,
      severity,
      signal: data.type,
      evidence: data.outcomeDetail || `Behavioral telemetry detected ${data.type}`,
      source: 'application_outcome',
      confidence: 0.85,
      normalizedScore,
      timestamp: new Date().toISOString(),
    };

    this.storeSignal(record);
    return record;
  }

  /**
   * SECTION 6: Automated Learning Signals
   * - verifier score
   * - eval score
   * - task success
   * - tool success
   * - citation validity
   */
  public static ingestAutomatedSignal(data: {
    targetId: string;
    type: 'verifier_score' | 'eval_score' | 'task_success' | 'tool_success' | 'citation_validity';
    score: number; // 0 - 100 or 0.0 - 1.0
    details?: string;
  }): ComprehensiveSignalRecord {
    const norm = data.score > 1 ? data.score / 100 : data.score;
    const feedbackType: NormalizedFeedback['feedbackType'] = norm >= 0.75 ? 'positive' : 'factual_dispute';

    const record: ComprehensiveSignalRecord = {
      id: `sig_auto_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      targetId: data.targetId,
      targetType: 'agent_output',
      category: 'automated',
      feedbackType,
      severity: norm < 0.6 ? 'moderate' : 'info',
      signal: `${data.type}: ${Math.round(norm * 100)}%`,
      evidence: data.details || `Automated engine verification check: ${data.type}`,
      source: 'verifier_auto',
      confidence: 1.0,
      normalizedScore: norm,
      timestamp: new Date().toISOString(),
    };

    this.storeSignal(record);
    return record;
  }

  private static storeSignal(record: ComprehensiveSignalRecord): void {
    this.feedbackStore.unshift(record);
    if (this.feedbackStore.length > 200) this.feedbackStore.pop();

    // High confidence corrections feed User Model
    if (record.confidence >= 0.85 && record.feedbackType === 'correction') {
      MemoryEngine.recordUserInference({
        claim: `User correction signal: ${record.evidence.slice(0, 100)}`,
        dimension: 'weakness',
        evidence: record.evidence,
        confidence: record.confidence,
        source: 'user_feedback',
      });
    }
  }

  public static getAllSignals(): ComprehensiveSignalRecord[] {
    return [...this.feedbackStore];
  }

  public static getSignalsByCategory(category: LearningSignalCategory): ComprehensiveSignalRecord[] {
    return this.feedbackStore.filter(s => s.category === category);
  }

  public static getSignalsForTarget(targetId: string): ComprehensiveSignalRecord[] {
    return this.feedbackStore.filter(s => s.targetId === targetId);
  }

  /**
   * Computes normalized satisfaction / health across the 3 categories
   */
  public static getSignalSummary(): {
    overallSatisfaction: number;
    explicitCount: number;
    explicitAvg: number;
    implicitCount: number;
    implicitAvg: number;
    automatedCount: number;
    automatedAvg: number;
  } {
    const explicit = this.getSignalsByCategory('explicit');
    const implicit = this.getSignalsByCategory('implicit');
    const automated = this.getSignalsByCategory('automated');

    const avg = (items: ComprehensiveSignalRecord[]) => 
      items.length > 0 ? Math.round((items.reduce((s, i) => s + i.normalizedScore, 0) / items.length) * 100) : 90;

    const expAvg = avg(explicit);
    const impAvg = avg(implicit);
    const autoAvg = avg(automated);

    const overall = Math.round(expAvg * 0.4 + impAvg * 0.3 + autoAvg * 0.3);

    return {
      overallSatisfaction: overall,
      explicitCount: explicit.length,
      explicitAvg: expAvg,
      implicitCount: implicit.length,
      implicitAvg: impAvg,
      automatedCount: automated.length,
      automatedAvg: autoAvg,
    };
  }

  /**
   * Compatibility alias for legacy callers
   */
  public static ingestFeedback(raw: {
    targetId: string;
    targetType: 'agent_output' | 'plan_step' | 'tool_call' | 'user_inference' | 'application';
    source: FeedbackSource;
    ratingOrSignal: string | number;
    correctionText?: string;
    evidenceText?: string;
    confidence?: number;
  }): NormalizedFeedback {
    return this.ingestExplicitSignal({
      targetId: raw.targetId,
      type: typeof raw.ratingOrSignal === 'number' ? 'assessment_score' : 'user_correction',
      value: raw.ratingOrSignal,
      correctionText: raw.correctionText,
      evidenceText: raw.evidenceText,
    });
  }

  public static getFeedbacksForTarget(targetId: string): NormalizedFeedback[] {
    return this.getSignalsForTarget(targetId);
  }

  public static getAllFeedbacks(): NormalizedFeedback[] {
    return this.getAllSignals();
  }
}
