// =========================================================================
// CAREER OS - CAPABILITY ACTIVATION POLICY & SCORING CONFIGURATION
// =========================================================================

import { 
  CapabilityLevel, 
  UserFacingMode, 
  TriggerSignals, 
  ComputeBudget,
  UserOverrideMode 
} from './types';

export interface ActivationPolicyConfig {
  /** Signal weights for linear scoring combination (sums to 1.0) */
  signalWeights: Record<keyof TriggerSignals, number>;
  
  /** Level score thresholds */
  thresholds: {
    L0: [number, number]; // [0, 20]
    L1: [number, number]; // [21, 40]
    L2: [number, number]; // [41, 65]
    L3: [number, number]; // [66, 85]
    L4: [number, number]; // [86, 100]
  };

  /** Verification confidence cutoff below which escalation triggers */
  verifierConfidenceCutoff: number; // e.g. 0.70

  /** Maximum escalation hops permitted in a single workflow run */
  maxEscalations: number; // e.g. 2

  /** Maximum retry count on tool/reasoning failures */
  maxRetries: number; // e.g. 3

  /** Budget matrices per capability level */
  budgets: Record<CapabilityLevel, ComputeBudget>;
}

export const DEFAULT_ACTIVATION_POLICY: ActivationPolicyConfig = {
  signalWeights: {
    complexity: 0.12,
    number_of_steps: 0.10,
    external_information_required: 0.11,
    career_impact: 0.10,
    uncertainty: 0.08,
    personal_context_required: 0.08,
    tool_requirement: 0.08,
    data_analysis_required: 0.09,
    research_requirement: 0.11,
    previous_failure: 0.05,
    verification_failure: 0.05,
    user_requested_depth: 0.13,
    time_sensitivity: 0.05,
  },

  thresholds: {
    L0: [0, 20],
    L1: [21, 40],
    L2: [41, 65],
    L3: [66, 85],
    L4: [86, 100],
  },

  verifierConfidenceCutoff: 0.70,
  maxEscalations: 2,
  maxRetries: 3,

  budgets: {
    L0: {
      maxTokens: 800,
      maxToolCalls: 0,
      maxSteps: 1,
      maxLatencyMs: 1500,
      costTier: 'minimal',
    },
    L1: {
      maxTokens: 2000,
      maxToolCalls: 3,
      maxSteps: 4,
      maxLatencyMs: 3500,
      costTier: 'low',
    },
    L2: {
      maxTokens: 5000,
      maxToolCalls: 8,
      maxSteps: 8,
      maxLatencyMs: 7000,
      costTier: 'medium',
    },
    L3: {
      maxTokens: 9000,
      maxToolCalls: 15,
      maxSteps: 14,
      maxLatencyMs: 12000,
      costTier: 'high',
    },
    L4: {
      maxTokens: 18000,
      maxToolCalls: 30,
      maxSteps: 24,
      maxLatencyMs: 25000,
      costTier: 'maximum',
    },
  },
};

export class ActivationPolicy {
  private static activeConfig: ActivationPolicyConfig = { ...DEFAULT_ACTIVATION_POLICY };

  static getConfig(): ActivationPolicyConfig {
    return this.activeConfig;
  }

  static updateConfig(partial: Partial<ActivationPolicyConfig>) {
    this.activeConfig = {
      ...this.activeConfig,
      ...partial,
    };
  }

  static resetToDefault() {
    this.activeConfig = { ...DEFAULT_ACTIVATION_POLICY };
  }

  /**
   * Calculates overall activation score from signals using configured weights
   */
  static calculateScore(signals: TriggerSignals): number {
    const weights = this.activeConfig.signalWeights;
    let rawScore = 0;

    (Object.keys(weights) as (keyof TriggerSignals)[]).forEach(signalKey => {
      const val = Math.max(0, Math.min(100, signals[signalKey] || 0));
      rawScore += val * weights[signalKey];
    });

    return Math.round(Math.max(0, Math.min(100, rawScore)));
  }

  /**
   * Resolves raw activation score into corresponding CapabilityLevel
   */
  static scoreToLevel(score: number): CapabilityLevel {
    const { thresholds } = this.activeConfig;

    if (score <= thresholds.L0[1]) return 'L0';
    if (score <= thresholds.L1[1]) return 'L1';
    if (score <= thresholds.L2[1]) return 'L2';
    if (score <= thresholds.L3[1]) return 'L3';
    return 'L4';
  }

  /**
   * Maps capability level to polite user-facing terminology (Rule #10)
   */
  static levelToUserFacingMode(level: CapabilityLevel): UserFacingMode {
    switch (level) {
      case 'L0':
        return 'Quick';
      case 'L1':
        return 'Standard';
      case 'L2':
      case 'L3':
        return 'Deep Analysis';
      case 'L4':
        return 'Deep Research';
    }
  }

  /**
   * Gets allocated budget for a capability level
   */
  static getBudgetForLevel(level: CapabilityLevel): ComputeBudget {
    return { ...this.activeConfig.budgets[level] };
  }

  /**
   * Maps manual user override to base level candidate
   */
  static overrideToLevel(override: UserOverrideMode): CapabilityLevel | null {
    switch (override) {
      case 'quick':
        return 'L0';
      case 'standard':
        return 'L1';
      case 'deep_analysis':
        return 'L2';
      case 'deep_research':
        return 'L4';
      case 'auto':
      default:
        return null;
    }
  }
}
