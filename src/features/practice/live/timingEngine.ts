import { ConfiguredBlueprint } from '../../../components/practice/live/liveInterviewData';

export type QuestionComplexityCategory = 
  | 'clarification'
  | 'behavioral'
  | 'technical_architecture'
  | 'business_case'
  | 'complex_multipart';

export interface EstimatedAnswerTiming {
  expectedSeconds: number;       // Base expected time to speak the answer points
  gracePeriodSeconds: number;    // Generous buffer so candidate can conclude naturally
  softTargetSeconds: number;     // Expected + Grace Period (indicator for candidate)
  hardMaxSeconds: number;        // Extended safety ceiling (prevents run-away recording)
  silenceThresholdMs: number;    // Sustained silence required to confirm completion
  thinkingPauseAllowanceMs: number; // Brief pause permitted without stopping (e.g., 2.5-3.5s)
  category: QuestionComplexityCategory;
  categoryLabel: string;
  rationale: string;
}

/**
 * Categorize question type based on text cues and blueprint structure
 */
export function categorizeQuestion(
  questionText: string,
  blueprint?: ConfiguredBlueprint
): QuestionComplexityCategory {
  const qLower = questionText.toLowerCase();

  // Multi-part complex question check
  if (
    (qLower.includes(' và ') && qLower.includes('như thế nào')) ||
    (qLower.includes('and') && (qLower.includes('how would you') || qLower.includes('trade-off'))) ||
    qLower.includes('quy trình các bước') ||
    qLower.includes('end-to-end')
  ) {
    return 'complex_multipart';
  }

  // Technical architecture check
  if (
    qLower.includes('architecture') ||
    qLower.includes('kiến trúc') ||
    qLower.includes('hệ thống') ||
    qLower.includes('system design') ||
    qLower.includes('scalab') ||
    qLower.includes('microservice') ||
    qLower.includes('kafka') ||
    qLower.includes('database') ||
    qLower.includes('idempotency') ||
    blueprint?.category?.toLowerCase().includes('technical') ||
    blueprint?.category?.toLowerCase().includes('software')
  ) {
    return 'technical_architecture';
  }

  // Case / Business Analysis check
  if (
    qLower.includes('case') ||
    qLower.includes('bài toán') ||
    qLower.includes('metric') ||
    qLower.includes('funnel') ||
    qLower.includes('roi') ||
    qLower.includes('tối ưu') ||
    qLower.includes('priorit') ||
    blueprint?.category?.toLowerCase().includes('product') ||
    blueprint?.category?.toLowerCase().includes('strategy')
  ) {
    return 'business_case';
  }

  // Behavioral STAR check
  if (
    qLower.includes('kể về') ||
    qLower.includes('tell me about') ||
    qLower.includes('time when') ||
    qLower.includes('xung đột') ||
    qLower.includes('conflict') ||
    qLower.includes('disagree') ||
    blueprint?.blueprint?.framework === 'STAR'
  ) {
    return 'behavioral';
  }

  // Short clarification or background check
  if (
    qLower.length < 40 ||
    qLower.includes('giới thiệu') ||
    qLower.includes('introduce') ||
    qLower.includes('what is your')
  ) {
    return 'clarification';
  }

  return 'behavioral';
}

/**
 * Calculates dynamic speaking window tailored to question depth, blueprint complexity,
 * and conversational breathing room.
 */
export function calculateDynamicAnswerTiming(
  questionText: string,
  blueprint?: ConfiguredBlueprint
): EstimatedAnswerTiming {
  const category = categorizeQuestion(questionText, blueprint);

  // 1. Measure blueprint content richness
  let totalBlueprintWords = 0;
  let actionPointsCount = 0;
  let hasTradeoffs = false;

  if (blueprint?.blueprint) {
    const bp = blueprint.blueprint;
    const allText = [
      bp.opening || '',
      bp.situation || '',
      bp.task || '',
      ...(bp.action || []),
      ...(bp.result || []),
      ...(bp.tradeoffs || []),
      ...(bp.metrics || [])
    ].join(' ');

    totalBlueprintWords = allText.split(/\s+/).filter(w => w.length > 0).length;
    actionPointsCount = (bp.action?.length || 0) + (bp.tradeoffs?.length || 0);
    hasTradeoffs = Boolean(bp.tradeoffs && bp.tradeoffs.length > 0);
  }

  // 2. Base duration calibrated by question complexity
  let baseSeconds = 60;
  let graceSeconds = 25;
  let categoryLabel = 'Standard Behavioral';
  let rationale = 'Calibrated for standard STAR response progression.';

  switch (category) {
    case 'clarification':
      baseSeconds = 35;
      graceSeconds = 20;
      categoryLabel = 'Quick Clarification';
      rationale = 'Focused concise response for introductory or clarifying inquiries.';
      break;

    case 'behavioral':
      baseSeconds = 70 + Math.min(25, actionPointsCount * 6);
      graceSeconds = 30;
      categoryLabel = 'Behavioral (STAR)';
      rationale = 'Allows structured storytelling across Situation, Task, Actions, and Results.';
      break;

    case 'technical_architecture':
      baseSeconds = 95 + Math.min(35, actionPointsCount * 8) + (hasTradeoffs ? 15 : 0);
      graceSeconds = 40;
      categoryLabel = 'Technical Architecture';
      rationale = 'Ample runway for system tradeoffs, data contracts, and failure modes.';
      break;

    case 'business_case':
      baseSeconds = 85 + Math.min(30, actionPointsCount * 7);
      graceSeconds = 35;
      categoryLabel = 'Case & Strategy Analysis';
      rationale = 'Supports problem deconstruction, metrics prioritization, and unit economics.';
      break;

    case 'complex_multipart':
      baseSeconds = 110 + Math.min(40, actionPointsCount * 8);
      graceSeconds = 45;
      categoryLabel = 'Complex Multi-Part Question';
      rationale = 'Extended window for multi-stage processes and end-to-end reasoning.';
      break;
  }

  // Add word-density modifier if blueprint has rich detail
  if (totalBlueprintWords > 120) {
    baseSeconds += Math.min(25, Math.round((totalBlueprintWords - 120) / 10));
  }

  const softTargetSeconds = baseSeconds + graceSeconds;
  // Generous hard safety maximum (never used as normal stop, only to prevent infinite run)
  const hardMaxSeconds = softTargetSeconds + 60;

  return {
    expectedSeconds: baseSeconds,
    gracePeriodSeconds: graceSeconds,
    softTargetSeconds,
    hardMaxSeconds,
    // Thinking pause allowance: 3 seconds without interrupting candidate
    thinkingPauseAllowanceMs: 3000,
    // Natural completion silence threshold: 5.5 seconds of sustained silence
    silenceThresholdMs: 5500,
    category,
    categoryLabel,
    rationale
  };
}
