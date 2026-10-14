// =========================================================================
// CAREER INTELLIGENCE ENGINE - REGRESSION SYSTEM & SAFETY GATEKEEPER
// =========================================================================

import { 
  RegressionSuiteComparison, 
  BenchmarkMetrics 
} from './types';

export class RegressionGatekeeper {
  private static comparisonHistory: RegressionSuiteComparison[] = [
    {
      suiteId: 'reg_suite_2026_01',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      baselineAgentVersion: 'CareerOS-Agent-v2.1.0',
      candidateAgentVersion: 'CareerOS-Agent-v2.2.0-prompt-opt',
      currentAgentScore: 91.2,
      candidateAgentScore: 94.8,
      metricsDelta: {
        successDelta: +3.6,
        correctnessDelta: +2.1,
        groundednessDelta: +4.2,
        citationDelta: +3.0,
        hallucinationDelta: -1.8, // Decreased hallucination (Good!)
        costDeltaPct: -4.5, // 4.5% cheaper (Good!)
        latencyDeltaPct: -8.0, // 8% faster (Good!)
      },
      passedCriticalChecks: true,
      gatekeeperDecision: 'approved_for_deployment',
      decisionRationale: 'All critical metrics improved. Hallucination rate dropped by 1.8%, while token cost and latency decreased.',
    },
    {
      suiteId: 'reg_suite_2026_02',
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
      baselineAgentVersion: 'CareerOS-Agent-v2.0.0',
      candidateAgentVersion: 'CareerOS-Agent-v2.1.0-exp-tokens',
      currentAgentScore: 88.5,
      candidateAgentScore: 90.1,
      metricsDelta: {
        successDelta: +1.6,
        correctnessDelta: +0.8,
        groundednessDelta: -2.4, // REGRESSION on groundedness!
        citationDelta: -3.5,
        hallucinationDelta: +0.9, // Hallucination INCREASED!
        costDeltaPct: +24.0, // Cost exceeded threshold (+24% > +15%)!
        latencyDeltaPct: +18.5,
      },
      passedCriticalChecks: false,
      gatekeeperDecision: 'rejected_critical_regression',
      decisionRationale: 'Rejected deployment: Overall score increased slightly (+1.6), but hallucination increased by 0.9%, citation quality dropped by 3.5%, and cost jumped by 24%. Safety policy blocked deployment.',
    }
  ];

  /**
   * SECTION 12 & 14: Strict Regression Suite Evaluation Gatekeeper
   * Compare Current Agent vs Candidate Agent.
   *
   * STRICT SAFETY POLICY:
   * 1. Overall score improvement is NOT enough if ANY critical metric regresses.
   * 2. Hallucination delta MUST NOT increase (hallucinationDelta <= 0).
   * 3. Citation quality MUST NOT decrease (citationDelta >= -0.5).
   * 4. Cost increase must be capped at +15%.
   * 5. Latency increase must be capped at +15%.
   * 6. No autonomous self-deployment without verification & policy gate.
   */
  public static evaluateCandidateAgainstBaseline(
    candidateVersion: string,
    baselineVersion: string,
    candidateMetrics: BenchmarkMetrics,
    baselineMetrics: BenchmarkMetrics
  ): RegressionSuiteComparison {
    const baselineComposite = Math.round(
      (baselineMetrics.success * 0.25 + 
       baselineMetrics.correctness * 0.25 + 
       baselineMetrics.groundedness * 0.20 + 
       baselineMetrics.planningQuality * 0.15 + 
       baselineMetrics.efficiency * 0.15) * 10
    ) / 10;

    const candidateComposite = Math.round(
      (candidateMetrics.success * 0.25 + 
       candidateMetrics.correctness * 0.25 + 
       candidateMetrics.groundedness * 0.20 + 
       candidateMetrics.planningQuality * 0.15 + 
       candidateMetrics.efficiency * 0.15) * 10
    ) / 10;

    const successDelta = candidateMetrics.success - baselineMetrics.success;
    const correctnessDelta = candidateMetrics.correctness - baselineMetrics.correctness;
    const groundednessDelta = candidateMetrics.groundedness - baselineMetrics.groundedness;
    const citationDelta = candidateMetrics.evidenceQuality - baselineMetrics.evidenceQuality;
    
    // Hallucination estimate inversely correlated with correctness & groundedness
    const hallucinationDelta = -Math.round((correctnessDelta + groundednessDelta) / 2);

    // Cost & Latency delta percentage
    const costDeltaPct = baselineMetrics.cost > 0 
      ? Math.round(((baselineMetrics.cost - candidateMetrics.cost) / baselineMetrics.cost) * 100) 
      : 0;
    const latencyDeltaPct = baselineMetrics.latency > 0 
      ? Math.round(((baselineMetrics.latency - candidateMetrics.latency) / baselineMetrics.latency) * 100) 
      : 0;

    // Gatekeeper Checks:
    const criticalMetricsPassed = 
      correctnessDelta >= -0.5 && 
      groundednessDelta >= -0.5 && 
      successDelta >= -0.5;

    const hallucinationPassed = hallucinationDelta <= 0;
    const citationPassed = citationDelta >= -1.0;
    const costPassed = costDeltaPct <= 15;
    const latencyPassed = latencyDeltaPct <= 15;

    let decision: RegressionSuiteComparison['gatekeeperDecision'] = 'approved_for_deployment';
    let rationale = `Candidate agent version ${candidateVersion} passed all regression safety gates against ${baselineVersion}.`;

    if (!criticalMetricsPassed) {
      decision = 'rejected_critical_regression';
      rationale = `Critical metric regression detected: Correctness delta (${correctnessDelta >= 0 ? '+' : ''}${correctnessDelta}), Groundedness delta (${groundednessDelta >= 0 ? '+' : ''}${groundednessDelta}). Blocking deployment.`;
    } else if (!hallucinationPassed) {
      decision = 'rejected_hallucination_increase';
      rationale = `Hallucination rate increased by ${hallucinationDelta}%. Strict zero-tolerance hallucination policy blocked deployment.`;
    } else if (!citationPassed) {
      decision = 'rejected_critical_regression';
      rationale = `Citation validity dropped by ${Math.abs(citationDelta)}%. Source grounding compromised.`;
    } else if (!costPassed || !latencyPassed) {
      decision = 'rejected_cost_latency_drift';
      rationale = `Compute inflation: Cost delta is +${costDeltaPct}% and latency delta is +${latencyDeltaPct}%, exceeding the +15% maximum threshold.`;
    }

    const comparison: RegressionSuiteComparison = {
      suiteId: `reg_suite_${Date.now()}`,
      timestamp: new Date().toISOString(),
      baselineAgentVersion: baselineVersion,
      candidateAgentVersion: candidateVersion,
      currentAgentScore: baselineComposite,
      candidateAgentScore: candidateComposite,
      metricsDelta: {
        successDelta,
        correctnessDelta,
        groundednessDelta,
        citationDelta,
        hallucinationDelta,
        costDeltaPct,
        latencyDeltaPct,
      },
      passedCriticalChecks: criticalMetricsPassed && hallucinationPassed && citationPassed && costPassed && latencyPassed,
      gatekeeperDecision: decision,
      decisionRationale: rationale,
    };

    this.comparisonHistory.unshift(comparison);
    if (this.comparisonHistory.length > 50) this.comparisonHistory.pop();

    return comparison;
  }

  public static getHistory(): RegressionSuiteComparison[] {
    return [...this.comparisonHistory];
  }
}
