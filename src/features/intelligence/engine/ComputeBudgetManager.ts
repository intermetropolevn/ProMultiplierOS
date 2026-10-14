// =========================================================================
// CAREER INTELLIGENCE ENGINE - COMPUTE BUDGET MANAGER
// =========================================================================

import { ComputeBudgetTier, ComputeBudgetLimits, TaskComplexity } from './types';

export class ComputeBudgetManager {
  /**
   * Determine strict execution boundaries according to compute budget tier
   */
  public static getBudgetLimits(
    tier: ComputeBudgetTier, 
    complexity: TaskComplexity = 'medium',
    hasRecentFailure: boolean = false
  ): ComputeBudgetLimits {
    // If a recent failure occurred, slightly increase revision tolerance
    const revisionBonus = hasRecentFailure ? 1 : 0;

    switch (tier) {
      case 'low':
        return {
          tier: 'low',
          maxTokens: 800,
          maxToolCalls: 0,
          maxSteps: 1,
          maxLatencyMs: 3000,
          allowCandidateGeneration: false,
          maxRevisions: 0 + revisionBonus,
          estimatedCostUsd: 0.0002,
        };

      case 'medium':
        return {
          tier: 'medium',
          maxTokens: 2200,
          maxToolCalls: 3,
          maxSteps: 3,
          maxLatencyMs: 8000,
          allowCandidateGeneration: false,
          maxRevisions: 1 + revisionBonus,
          estimatedCostUsd: 0.001,
        };

      case 'high':
        return {
          tier: 'high',
          maxTokens: 5500,
          maxToolCalls: 8,
          maxSteps: 6,
          maxLatencyMs: 22000,
          allowCandidateGeneration: true,
          maxRevisions: 2 + revisionBonus,
          estimatedCostUsd: 0.006,
        };

      case 'maximum':
        return {
          tier: 'maximum',
          maxTokens: 12000,
          maxToolCalls: 20,
          maxSteps: 12,
          maxLatencyMs: 60000,
          allowCandidateGeneration: true,
          maxRevisions: 3,
          estimatedCostUsd: 0.025,
        };
    }
  }

  /**
   * Check if execution remains within allowed budget envelope
   */
  public static isWithinBudget(
    limits: ComputeBudgetLimits, 
    tokensUsed: number, 
    toolCallsMade: number, 
    elapsedMs: number
  ): { ok: boolean; reason?: string } {
    if (tokensUsed > limits.maxTokens) {
      return { ok: false, reason: `Token ceiling exceeded: ${tokensUsed} > ${limits.maxTokens}` };
    }
    if (toolCallsMade > limits.maxToolCalls) {
      return { ok: false, reason: `Tool call limit reached: ${toolCallsMade} > ${limits.maxToolCalls}` };
    }
    if (elapsedMs > limits.maxLatencyMs) {
      return { ok: false, reason: `Latency budget exceeded: ${elapsedMs}ms > ${limits.maxLatencyMs}ms` };
    }
    return { ok: true };
  }
}
