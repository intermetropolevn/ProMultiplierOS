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
   * Selects model and hyper-parameters dynamically based on task constraints
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
        modelId: 'gemini-2.5-flash',
        temperature: 0.1,
        maxOutputTokens: 2048,
        enableCodeExecution: true,
        enableSearchGrounding: false,
        rationale: 'Routed to code execution model with deterministic low temperature for quantitative rigor.',
      };
    }

    // 2. Deep Research / Grounded Search
    if (requiresResearch || taskType === 'deep_research' || taskType === 'company_research') {
      return {
        profile: 'research',
        modelId: 'gemini-2.5-flash',
        temperature: 0.2,
        maxOutputTokens: 4096,
        enableSearchGrounding: true,
        enableCodeExecution: false,
        reasoningEffort: complexity === 'very_high' ? 'high' : 'medium',
        rationale: 'Routed to research model with web search grounding and cross-source synthesis.',
      };
    }

    // 3. High complexity reasoning (Cases, Planning, Complex skill gaps)
    if (complexity === 'high' || complexity === 'very_high' || taskType === 'case_analysis') {
      return {
        profile: 'reasoning',
        modelId: 'gemini-2.5-flash',
        temperature: 0.3,
        maxOutputTokens: 3072,
        reasoningEffort: 'high',
        enableSearchGrounding: false,
        enableCodeExecution: false,
        rationale: 'Routed to high-reasoning model for multi-step structured problem solving.',
      };
    }

    // 4. Low budget or simple tasks (Formatting, definition, writing, quick QA)
    if (budgetTier === 'low' || complexity === 'low') {
      return {
        profile: 'cheap_fast',
        modelId: 'gemini-2.5-flash-lite',
        temperature: 0.2,
        maxOutputTokens: 1024,
        reasoningEffort: 'low',
        enableSearchGrounding: false,
        enableCodeExecution: false,
        rationale: 'Routed to low-latency fast model to conserve tokens and minimize latency.',
      };
    }

    // Default general reasoning
    return {
      profile: 'reasoning',
      modelId: 'gemini-2.5-flash',
      temperature: 0.2,
      maxOutputTokens: 2048,
      reasoningEffort: 'medium',
      enableSearchGrounding: false,
      enableCodeExecution: false,
      rationale: 'Standard reasoning profile for contextual career analysis.',
    };
  }
}
