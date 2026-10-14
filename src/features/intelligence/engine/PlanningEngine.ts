// =========================================================================
// CAREER INTELLIGENCE ENGINE - PLANNING ENGINE
// =========================================================================

import { 
  CareerTaskType, 
  TaskComplexity, 
  StructuredPlanGraph, 
  PlanStep 
} from './types';
import { MemoryEngine } from './MemoryEngine';

export class PlanningEngine {
  /**
   * Generates a structured DAG plan for multi-step tasks.
   * Simple tasks (L0/L1) return null to avoid unnecessary planning overhead.
   */
  public static createPlan(
    goal: string,
    taskType: CareerTaskType,
    complexity: TaskComplexity
  ): StructuredPlanGraph | null {
    // Rule: Skip planning for simple low-complexity tasks
    if (complexity === 'low' && (taskType === 'simple_qa' || taskType === 'retrieval' || taskType === 'summarization')) {
      return null;
    }

    // Check procedural memory for an existing proven pattern first!
    const proceduralPattern = MemoryEngine.getProceduralPattern(taskType);

    const steps: PlanStep[] = [];

    switch (taskType) {
      case 'skill_gap_analysis':
      case 'career_recommendation':
      case 'planning':
        steps.push(
          {
            id: 'step_1_job_requirements',
            objective: 'Extract and normalize required skills & competencies from the target role',
            dependencies: [],
            requiredTools: ['parseJobDescription', 'queryCareerOSDatabase'],
            expectedOutput: 'Normalized list of technical and soft skill competencies with priority weights',
            verificationCriteria: ['At least 3 core competencies extracted', 'Canonical IDs mapped'],
            status: 'pending',
            retryCount: 0,
          },
          {
            id: 'step_2_user_evidence',
            objective: 'Cross-examine user verified evidence ledger and inferred profile skills',
            dependencies: ['step_1_job_requirements'],
            requiredTools: ['inspectUserModelInferences', 'queryCareerOSDatabase'],
            expectedOutput: 'Baseline score and demonstrated evidence for each target competency',
            verificationCriteria: ['Evidence ledger consulted', 'Confidence thresholds applied'],
            status: 'pending',
            retryCount: 0,
          },
          {
            id: 'step_3_gap_prioritization',
            objective: 'Compute skill gaps and prioritize into Critical, High, and Stretch tiers',
            dependencies: ['step_2_user_evidence'],
            requiredTools: ['calculateMetrics'],
            expectedOutput: 'Ranked gap matrix with gap severity and time-to-acquire estimates',
            verificationCriteria: ['Gaps mathematically sorted', 'Actionable milestones included'],
            status: 'pending',
            retryCount: 0,
          },
          {
            id: 'step_4_roadmap_synthesis',
            objective: 'Synthesize concrete 4-week learning roadmap with recommended books and practice modules',
            dependencies: ['step_3_gap_prioritization'],
            requiredTools: ['queryCareerOSDatabase'],
            expectedOutput: 'Actionable weekly schedule referencing specific Career OS knowledge units & cases',
            verificationCriteria: ['Verified resources linked', 'Next steps clearly delineated'],
            status: 'pending',
            retryCount: 0,
          }
        );
        break;

      case 'case_analysis':
      case 'data_analysis':
        steps.push(
          {
            id: 'step_1_extract_financials',
            objective: 'Extract quantitative variables (e.g. CAC, LTV, conversion, revenue, churn) from scenario exhibits',
            dependencies: [],
            requiredTools: ['queryCareerOSDatabase'],
            expectedOutput: 'Structured parameters map for quantitative computation',
            verificationCriteria: ['Parameters non-empty', 'Units specified'],
            status: 'pending',
            retryCount: 0,
          },
          {
            id: 'step_2_execute_simulation',
            objective: 'Run code sandbox calculation for unit economics and break-even thresholds',
            dependencies: ['step_1_extract_financials'],
            requiredTools: ['executePythonOrJsSandbox', 'calculateMetrics'],
            expectedOutput: 'Verified numerical results with sensitivity bounds',
            verificationCriteria: ['Computation finished without runtime error', 'Sensible mathematical limits'],
            status: 'pending',
            retryCount: 0,
          },
          {
            id: 'step_3_tradeoff_evaluation',
            objective: 'Compare candidate options A vs B against strategic and financial tradeoffs',
            dependencies: ['step_2_execute_simulation'],
            requiredTools: ['verifyRubricCompliance'],
            expectedOutput: 'Comparative tradeoff matrix with pro/con arguments grounded in the math',
            verificationCriteria: ['Both options evaluated', 'Risks quantified'],
            status: 'pending',
            retryCount: 0,
          },
          {
            id: 'step_4_final_recommendation',
            objective: 'Formulate an executive recommendation with immediate 30-60-90 day execution milestones',
            dependencies: ['step_3_tradeoff_evaluation'],
            requiredTools: [],
            expectedOutput: 'Definitive recommendation supported by calculated metrics and risk mitigations',
            verificationCriteria: ['Actionable', 'Rubric compliant'],
            status: 'pending',
            retryCount: 0,
          }
        );
        break;

      case 'deep_research':
        steps.push(
          {
            id: 'step_1_research_scoping',
            objective: 'Decompose research query into distinct sub-questions & search vectors',
            dependencies: [],
            requiredTools: [],
            expectedOutput: 'Target search vectors covering market, competitors, and organizational culture',
            verificationCriteria: ['At least 3 search dimensions established'],
            status: 'pending',
            retryCount: 0,
          },
          {
            id: 'step_2_multi_source_harvest',
            objective: 'Search and collect external data across verified industry reports and market disclosures',
            dependencies: ['step_1_research_scoping'],
            requiredTools: ['searchWebResearch'],
            expectedOutput: 'Corpus of credible source items with credibility scores',
            verificationCriteria: ['At least 4 diverse sources gathered', 'Credibility >= 0.70'],
            status: 'pending',
            retryCount: 0,
          },
          {
            id: 'step_3_cross_check_and_triangulate',
            objective: 'Triangulate contradictory claims and extract concrete evidence quotes',
            dependencies: ['step_2_multi_source_harvest'],
            requiredTools: ['verifyRubricCompliance'],
            expectedOutput: 'Cross-checked evidence matrix with conflicting viewpoints resolved',
            verificationCriteria: ['No unverified claims', 'Conflicting data highlighted'],
            status: 'pending',
            retryCount: 0,
          },
          {
            id: 'step_4_deep_synthesis',
            objective: 'Synthesize comprehensive cited dossier with executive summary and tactical career advice',
            dependencies: ['step_3_cross_check_and_triangulate'],
            requiredTools: [],
            expectedOutput: 'Comprehensive research synthesis with inline citations',
            verificationCriteria: ['Full citation coverage', 'Executive takeaways included'],
            status: 'pending',
            retryCount: 0,
          }
        );
        break;

      default:
        // Generic multi-step
        steps.push(
          {
            id: 'step_1_gather_context',
            objective: 'Retrieve target Career OS entities and cross-reference user state',
            dependencies: [],
            requiredTools: ['queryCareerOSDatabase'],
            expectedOutput: 'Relevant context facts collected',
            verificationCriteria: ['Entities retrieved'],
            status: 'pending',
            retryCount: 0,
          },
          {
            id: 'step_2_synthesize_solution',
            objective: 'Analyze and formulate structured solution',
            dependencies: ['step_1_gather_context'],
            requiredTools: [],
            expectedOutput: 'Draft structured response',
            verificationCriteria: ['Addresses core prompt'],
            status: 'pending',
            retryCount: 0,
          }
        );
    }

    return {
      goal,
      complexity,
      steps,
      executionStrategy: 'sequential',
      estimatedDurationMs: steps.length * 1500,
      status: 'planned',
      replanCount: 0,
    };
  }

  /**
   * Re-plans in the event of a step failure or verification rejection
   */
  public static replanOnFailure(
    plan: StructuredPlanGraph,
    failedStepId: string,
    failureReason: string
  ): StructuredPlanGraph {
    const updatedSteps = plan.steps.map(step => {
      if (step.id === failedStepId) {
        return {
          ...step,
          retryCount: step.retryCount + 1,
          status: 'pending' as const,
          error: failureReason,
          objective: `${step.objective} (Replanned: Address failure - ${failureReason.slice(0, 60)})`,
        };
      }
      return step;
    });

    return {
      ...plan,
      steps: updatedSteps,
      status: 're-planning',
      replanCount: plan.replanCount + 1,
    };
  }
}
