// =========================================================================
// CAREER INTELLIGENCE ENGINE - FAILURE DIAGNOSER & TAXONOMY CLASSIFIER
// =========================================================================

import { 
  AgentTrajectoryRecord, 
  CareerFailureType, 
  FailureDiagnosis, 
  ImprovementTargetLayer,
  VerifierAggregatorResult,
  PlanStep
} from './types';

export class FailureDiagnoser {
  /**
   * Diagnoses an agent trajectory against the 17-Type Failure Taxonomy (Section 3).
   * Identifies root cause, affected steps, targeted architectural layer (Section 7),
   * and prepares targeted step re-execution (Section 5).
   */
  public static diagnose(
    trajectory: Partial<AgentTrajectoryRecord>,
    aggregatorResult?: VerifierAggregatorResult
  ): FailureDiagnosis {
    const runId = trajectory.runId || `run_${Date.now()}`;
    const steps = trajectory.executionSteps || [];
    const plan = trajectory.plan;
    const stats = trajectory.runtimeStats;
    const finalStatus = stats?.finalStatus;
    const prompt = trajectory.task?.rawPrompt || '';

    const failures: CareerFailureType[] = [];
    let rootCause = 'Normal healthy execution';
    const affectedStepIndices: number[] = [];
    let targetedLayer: ImprovementTargetLayer = 'Prompt';
    let remedyProposal = 'No revision needed.';

    // 1. Check Tool Failures
    const failedToolSteps = steps.filter(s => s.actionType === 'tool_call' && s.toolCall?.status === 'failed');
    if (failedToolSteps.length > 0) {
      failures.push('tool_execution_failure');
      rootCause = `Tool execution failed in step(s): ${failedToolSteps.map(s => s.stepNumber).join(', ')}`;
      failedToolSteps.forEach(s => affectedStepIndices.push(s.stepNumber));
      targetedLayer = 'Tool_selection';
      remedyProposal = 'Retry tool call with sanitized parameters or fallback to local deterministic helper.';
    }

    // 2. Check Planning Failures
    if (plan) {
      const failedPlanSteps = plan.steps.filter(s => s.status === 'failed');
      if (failedPlanSteps.length > 0) {
        failures.push('planning_failure');
        rootCause = `Plan decomposition stalled on step: "${failedPlanSteps[0].objective}"`;
        failedPlanSteps.forEach((s, idx) => affectedStepIndices.push(idx + 1));
        targetedLayer = 'Planning';
        remedyProposal = 'Decompose complex step into smaller sub-tasks or re-order dependencies.';
      }
    }

    // 3. Check Verifier Aggregator primary/secondary failures
    if (aggregatorResult && !aggregatorResult.passed) {
      if (aggregatorResult.primaryFailureType && !failures.includes(aggregatorResult.primaryFailureType)) {
        failures.push(aggregatorResult.primaryFailureType);
      }
      aggregatorResult.secondaryFailureTypes.forEach(ft => {
        if (!failures.includes(ft)) failures.push(ft);
      });

      // Inspect specific verifier outputs
      const ind = aggregatorResult.independentOutputs;
      if (ind?.NumericalVerifier && !ind.NumericalVerifier.passed) {
        if (!failures.includes('reasoning_failure')) failures.push('reasoning_failure');
        rootCause = 'Numerical computation was inaccurate or missing required quantitative metrics.';
        targetedLayer = 'Tool_selection'; // Route to Code Sandbox
        remedyProposal = 'Re-execute computation step via deterministic Python/JS sandbox.';
      }

      if (ind?.FactualVerifier && !ind.FactualVerifier.passed) {
        if (!failures.includes('hallucination')) failures.push('hallucination');
        rootCause = 'Hallucinated generic placeholder tokens or chronologically inconsistent claims.';
        targetedLayer = 'Retrieval';
        remedyProposal = 'Ground claims directly with verified entities from Canonical Ontology.';
      }

      if (ind?.CitationVerifier && !ind.CitationVerifier.passed) {
        if (!failures.includes('citation_failure')) failures.push('citation_failure');
        rootCause = 'Missing explicit source citations for substantive claims.';
        targetedLayer = 'Prompt';
        remedyProposal = 'Append bracketed citations referencing retrieved knowledge documents.';
      }

      if (ind?.RubricVerifier && !ind.RubricVerifier.passed) {
        if (!failures.includes('verification_failure')) failures.push('verification_failure');
        rootCause = 'Failed STAR or Case framework rubric compliance.';
        targetedLayer = 'Prompt';
        remedyProposal = 'Structure response explicitly according to STAR / McKinsey 7S rubric.';
      }

      if (ind?.EvidenceVerifier && !ind.EvidenceVerifier.passed) {
        if (!failures.includes('context_failure')) failures.push('context_failure');
        rootCause = 'Claims not grounded in candidate profile evidence ledger or job specification.';
        targetedLayer = 'Context';
        remedyProposal = 'Inject candidate verified skill ledger directly into working prompt.';
      }
    }

    // 4. Check Efficiency Failures (Overthinking, Underthinking, Cost, Latency)
    if (stats) {
      if (stats.totalTokensUsed > 4500 && prompt.length < 50) {
        failures.push('overthinking');
        failures.push('cost_inefficiency');
        rootCause = 'Excessive token expenditure on simple query (overthinking detected).';
        targetedLayer = 'Compute_allocation';
        remedyProposal = 'Downgrade to L0 Direct Tier and enforce strict token cap.';
      } else if (stats.totalTokensUsed < 120 && prompt.length > 80) {
        failures.push('underthinking');
        rootCause = 'Premature completion: answer lacked sufficient elaboration for a complex prompt.';
        targetedLayer = 'Model_routing';
        remedyProposal = 'Upgrade model tier to high-reasoning engine or increase compute budget.';
      }

      if (stats.totalDurationMs > 12000) {
        failures.push('latency_inefficiency');
        if (targetedLayer === 'Prompt') targetedLayer = 'Model_routing';
        remedyProposal = 'Optimize tool latency or parallelize multi-source retrieval.';
      }
    }

    // 5. Check Context & Retrieval Failures
    if (trajectory.contextSnapshot && trajectory.contextSnapshot.retrievedItemsCount === 0 && prompt.length > 30) {
      if (!failures.includes('retrieval_failure')) failures.push('retrieval_failure');
      rootCause = 'Retrieval engine returned zero relevant knowledge units or job records.';
      targetedLayer = 'Retrieval';
      remedyProposal = 'Expand search terms using Vietnamese diacritic normalizer and Canonical Skill aliases.';
    }

    const hasFailure = failures.length > 0 || (finalStatus === 'failed' || finalStatus === 'partial');
    const primary = failures[0] || (hasFailure ? 'task_interpretation_failure' : undefined);
    const secondaries = failures.slice(1);

    return {
      runId,
      hasFailure,
      primaryFailureType: primary,
      secondaryFailureTypes: secondaries,
      rootCauseAnalysis: rootCause,
      affectedStepIndices: affectedStepIndices.length > 0 ? affectedStepIndices : (hasFailure ? [1] : []),
      canTargetedSelfCorrect: hasFailure && primary !== 'insufficient_information',
      targetedLayer,
      recommendedRevisionAction: remedyProposal,
      confidence: hasFailure ? 0.92 : 0.98,
    };
  }

  /**
   * Targeted Re-Execution Planner (Section 5):
   * Given a structured plan and affected failed steps, determines which steps
   * can be preserved (e.g. Research is valid) and which steps must be re-run
   * (e.g. only re-run Calculation and downstream Synthesis).
   */
  public static planTargetedReExecution(
    planSteps: PlanStep[],
    affectedIndices: number[]
  ): {
    preservedSteps: PlanStep[];
    rerunSteps: PlanStep[];
    strategyDescription: string;
  } {
    if (!planSteps || planSteps.length === 0) {
      return {
        preservedSteps: [],
        rerunSteps: [],
        strategyDescription: 'Direct single-pass task: apply targeted patch directly to generated text.',
      };
    }

    const minAffectedIndex = affectedIndices.length > 0 
      ? Math.min(...affectedIndices) 
      : planSteps.length;

    // Steps before minAffectedIndex are preserved!
    const preservedSteps = planSteps.filter((_, idx) => (idx + 1) < minAffectedIndex);
    // Steps from minAffectedIndex onwards must be rerun
    const rerunSteps = planSteps.filter((_, idx) => (idx + 1) >= minAffectedIndex);

    return {
      preservedSteps,
      rerunSteps,
      strategyDescription: `Preserving ${preservedSteps.length} verified upstream step(s) (${preservedSteps.map(s => s.objective).join(', ')}). Only re-running ${rerunSteps.length} affected step(s) (${rerunSteps.map(s => s.objective).join(', ')}).`,
    };
  }
}
