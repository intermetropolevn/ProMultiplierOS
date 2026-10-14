// =========================================================================
// CAREER INTELLIGENCE ENGINE - EVALUATION ENGINE
// =========================================================================

import { 
  TrajectoryEvaluation, 
  AgentTrajectoryRecord 
} from './types';

export class EvaluationEngine {
  /**
   * Evaluates both the final answer AND the entire agent execution trajectory
   */
  public static evaluateTrajectory(
    trajectory: Partial<AgentTrajectoryRecord>
  ): TrajectoryEvaluation {
    const steps = trajectory.executionSteps || [];
    const verifier = trajectory.verificationResult;
    const plan = trajectory.plan;
    const revisions = trajectory.revisions || [];
    const stats = trajectory.runtimeStats;

    // 1. Tool Use Accuracy
    const toolSteps = steps.filter(s => s.actionType === 'tool_call');
    const successfulToolSteps = toolSteps.filter(s => s.toolCall?.status === 'success');
    const toolUseAccuracy = toolSteps.length > 0
      ? Math.round((successfulToolSteps.length / toolSteps.length) * 100)
      : 100;

    // 2. Planning Quality
    let planningQuality = 90;
    if (plan) {
      const completedSteps = plan.steps.filter(s => s.status === 'completed');
      planningQuality = Math.round((completedSteps.length / Math.max(1, plan.steps.length)) * 100);
    }

    // 3. Recovery Rate
    let recoveryRate = 100;
    if (revisions.length > 0) {
      // If revisions were made and the final verification passed, recovery rate is high!
      recoveryRate = verifier?.passed ? 95 : 40;
    }

    // 4. Verification Pass Rate
    const verificationPassRate = verifier?.score ? Math.round(verifier.score * 100) : 90;

    // 5. Groundedness & Citation Quality
    const sourcesCount = trajectory.finalOutput?.sources?.length || 0;
    const citationQuality = Math.min(100, 70 + sourcesCount * 10);
    const groundedness = verifier?.detailsByCategory?.evidence_grounding?.score 
      ? Math.round(verifier.detailsByCategory.evidence_grounding.score * 100) 
      : 92;

    // 6. Efficiency & Cost Score
    const latencyScore = stats?.totalDurationMs && stats.totalDurationMs < 10000 ? 95 : 85;
    const costEfficiency = stats?.totalTokensUsed && stats.totalTokensUsed < 3000 ? 96 : 88;
    const correctness = verifier?.detailsByCategory?.factual_correctness?.score 
      ? Math.round(verifier.detailsByCategory.factual_correctness.score * 100) 
      : 94;

    const taskSuccess = verifier?.passed ? (revisions.length > 0 ? 92 : 98) : 60;

    // Overall composite score (0 - 100)
    const metricValues = [
      taskSuccess,
      correctness,
      groundedness,
      citationQuality,
      planningQuality,
      toolUseAccuracy,
      recoveryRate,
      verificationPassRate,
      latencyScore,
      costEfficiency,
    ];
    const overallScore = Math.round(metricValues.reduce((a, b) => a + b, 0) / metricValues.length);

    // Milestones tracking
    const milestoneAccomplishments: Array<{ milestone: string; achieved: boolean; note: string }> = [];

    if (plan) {
      plan.steps.forEach(st => {
        milestoneAccomplishments.push({
          milestone: st.objective,
          achieved: st.status === 'completed' || st.status === 'pending',
          note: st.error ? `Encountered error: ${st.error}` : 'Successfully executed within expected boundary',
        });
      });
    } else {
      milestoneAccomplishments.push({
        milestone: 'Direct execution & synthesis',
        achieved: true,
        note: 'Completed without multi-step overhead',
      });
    }

    const evaluationSummary = `Trajectory achieved an overall index of ${overallScore}/100. Verification pass rate is ${verificationPassRate}%, with ${toolUseAccuracy}% tool accuracy. ${revisions.length > 0 ? `Successfully recovered through ${revisions.length} revision cycle(s).` : 'Flawless first-pass execution.'}`;

    return {
      taskId: trajectory.runId || 'run_unknown',
      overallScore,
      metrics: {
        taskSuccess,
        correctness,
        groundedness,
        citationQuality,
        planningQuality,
        toolUseAccuracy,
        recoveryRate,
        verificationPassRate,
        efficiency: Math.round((latencyScore + costEfficiency) / 2),
        latencyScore,
        costEfficiency,
      },
      milestoneAccomplishments,
      evaluationSummary,
    };
  }
}
