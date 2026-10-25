// =========================================================================
// CAREER INTELLIGENCE ENGINE - MODEL ROUTER
// =========================================================================

import { 
  CareerTaskType, 
  TaskComplexity, 
  ComputeBudgetTier, 
  ModelSelection, 
  ModelProfile 
} from './types';

export class ModelRouter {
  /**
   * Selects synthesis profile dynamically based on task constraints
   */
  public static selectModel(
    taskType: CareerTaskType,
    complexity: TaskComplexity,
    budgetTier: ComputeBudgetTier,
    requiresCode: boolean = false,
    requiresResearch: boolean = false
  ): ModelSelection {
    // 1. Coding / Quantitative calculations
    if (requiresCode || taskType === 'data_analysis') {
      return {
        profile: 'coding',
        modelId: 'careeros-quantitative-tier',
        temperature: 0.1,
        maxOutputTokens: 2048,
        enableCodeExecution: true,
        enableSearchGrounding: false,
        rationale: 'Routed to quantitative synthesis profile for structured analytical verification.',
      };
    }

    // 2. Deep Research / Grounded Search
    if (requiresResearch || taskType === 'deep_research' || taskType === 'company_research') {
      return {
        profile: 'research',
        modelId: 'careeros-research-tier',
        temperature: 0.2,
        maxOutputTokens: 4096,
        enableSearchGrounding: true,
        enableCodeExecution: false,
        reasoningEffort: complexity === 'very_high' ? 'high' : 'medium',
        rationale: 'Routed to grounded research synthesis profile with cross-source verification.',
      };
    }

    // 3. High complexity reasoning (Cases, Planning, Complex skill gaps)
    if (complexity === 'high' || complexity === 'very_high' || taskType === 'case_analysis') {
      return {
        profile: 'reasoning',
        modelId: 'careeros-reasoning-tier',
        temperature: 0.3,
        maxOutputTokens: 3072,
        reasoningEffort: 'high',
        enableSearchGrounding: false,
        enableCodeExecution: false,
        rationale: 'Routed to multi-step reasoning profile for structured capability evaluation.',
      };
    }

    // 4. Low budget or simple tasks (Formatting, definition, writing, quick QA)
    if (budgetTier === 'low' || complexity === 'low') {
      return {
        profile: 'cheap_fast',
        modelId: 'careeros-fast-tier',
        temperature: 0.2,
        maxOutputTokens: 1024,
        reasoningEffort: 'low',
        enableSearchGrounding: false,
        enableCodeExecution: false,
        rationale: 'Routed to low-latency synthesis profile for rapid career signal feedback.',
      };
    }

    // Default general reasoning
    return {
      profile: 'reasoning',
      modelId: 'careeros-standard-tier',
      temperature: 0.2,
      maxOutputTokens: 2048,
      reasoningEffort: 'medium',
      enableSearchGrounding: false,
      enableCodeExecution: false,
      rationale: 'Standard synthesis profile for contextual career analysis.',
    };
  }
}
