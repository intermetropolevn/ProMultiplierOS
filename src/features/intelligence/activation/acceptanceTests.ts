// =========================================================================
// CAREER OS - CAPABILITY ACTIVATION ACCEPTANCE TEST SUITE (Section 11)
// =========================================================================

import { 
  AcceptanceTestDefinition, 
  AcceptanceTestResult, 
  CapabilityLevel, 
  UserFacingMode 
} from './types';
import { CapabilityActivationEngine } from './capabilityActivationEngine';

export const ACCEPTANCE_TEST_DEFINITIONS: AcceptanceTestDefinition[] = [
  {
    id: 'A',
    name: 'Simple Direct Q&A',
    prompt: 'CV là gì?',
    expectedLevel: 'L0',
    expectedMode: 'Quick',
    description: 'Basic definition inquiry without personal context or planning. Direct LLM response.',
    scenarioType: 'user_prompt',
  },
  {
    id: 'B',
    name: 'Contextual Fit Assessment',
    prompt: 'CV của mình match job này không?',
    expectedLevel: 'L1',
    expectedMode: 'Standard',
    description: 'Contextual intelligence requiring user profile, candidate CV, and target job description.',
    scenarioType: 'user_prompt',
  },
  {
    id: 'C',
    name: 'Multi-Step Roadmap & Gap Analysis',
    prompt: 'Phân tích job này, tìm skill gap và đề xuất roadmap.',
    expectedLevel: 'L2',
    expectedMode: 'Deep Analysis',
    description: 'Agentic multi-step planning with dependencies, gap identification, and learning roadmap generation.',
    scenarioType: 'user_prompt',
  },
  {
    id: 'D',
    name: 'Quantitative Case & Calculation',
    prompt: 'Giải case này bằng data, tính toán và đưa recommendation.',
    expectedLevel: 'L3',
    expectedMode: 'Deep Analysis',
    description: 'Advanced agent workflow requiring spreadsheet/math tools, exhibit analysis, and multiple solution candidates.',
    scenarioType: 'user_prompt',
  },
  {
    id: 'E',
    name: 'Exhaustive Market Deep Research',
    prompt: 'Deep research company X và market của nó.',
    expectedLevel: 'L4',
    expectedMode: 'Deep Research',
    description: 'Multi-source external web crawl, competitor triangulation, and market dynamics analysis under maximum compute.',
    scenarioType: 'user_prompt',
  },
  {
    id: 'F',
    name: 'User Override with Strict Budget Cap',
    prompt: 'CV là gì? Hãy deep research toàn diện cho tôi.',
    expectedLevel: 'L4',
    expectedMode: 'Deep Research',
    description: 'Simple question with explicit deep research request. Respects user requested depth, but binds token spend.',
    scenarioType: 'override',
    override: 'deep_research',
  },
  {
    id: 'G',
    name: 'Self-Escalation on Verifier Failure',
    prompt: 'CV của mình match job này không?',
    expectedLevel: 'L2',
    expectedMode: 'Deep Analysis',
    description: 'Initial L1 request where verifier confidence drops below 0.70, triggering automatic escalation to L2.',
    scenarioType: 'escalation',
    simulateVerifierFailure: true,
  },
  {
    id: 'H',
    name: 'De-escalation / Early Stop on Satisfied Evidence',
    prompt: 'Giải case này bằng data, tính toán và đưa recommendation.',
    expectedLevel: 'L1',
    expectedMode: 'Standard',
    description: 'Initial L3 task where target evidence is satisfied early from memory graph, triggering de-escalation.',
    scenarioType: 'deescalation',
    simulateEvidenceSufficientEarly: true,
  },
  {
    id: 'I',
    name: 'Episodic / Procedural Memory Check',
    prompt: 'Phân tích job này, tìm skill gap và đề xuất roadmap.',
    expectedLevel: 'L2',
    expectedMode: 'Deep Analysis',
    description: 'Repeated task query hitting episodic memory cache, preventing redundant full agent loop execution.',
    scenarioType: 'memory',
    isRepeatedTask: true,
  },
  {
    id: 'J',
    name: 'Mixed Vietnamese / English Intent & Concept Detection',
    prompt: 'Evaluate fit của mình cho job Fintech PM này và highlight các skill gaps cần improve.',
    expectedLevel: 'L2',
    expectedMode: 'Deep Analysis',
    description: 'Mixed-language code-switching query with semantic intent and entity extraction without keyword traps.',
    scenarioType: 'mixed_lang',
  },
];

export class AcceptanceTestRunner {
  /**
   * Executes a single acceptance test by ID
   */
  static runTest(def: AcceptanceTestDefinition): AcceptanceTestResult {
    const decision = CapabilityActivationEngine.evaluatePrompt(def.prompt, {
      userOverride: def.override,
      simulateVerifierFailure: def.simulateVerifierFailure,
      simulateEvidenceSufficientEarly: def.simulateEvidenceSufficientEarly,
      isRepeatedTask: def.isRepeatedTask,
    });

    const actualLevel = decision.selectedLevel;
    const actualMode = decision.userFacingMode;

    const levelPassed = actualLevel === def.expectedLevel;
    const modePassed = actualMode === def.expectedMode;

    let specialPassed = true;
    let notes = `Level matched: ${actualLevel}. Mode matched: ${actualMode}.`;

    if (def.scenarioType === 'escalation') {
      const hasEscalation = decision.escalations.length > 0;
      specialPassed = levelPassed && hasEscalation;
      notes = hasEscalation 
        ? `Escalated from L1 -> L2 due to verifier confidence: ${decision.escalations[0].reason}` 
        : 'Failed to record escalation.';
    } else if (def.scenarioType === 'deescalation') {
      const hasDeescalation = decision.deEscalations.length > 0;
      specialPassed = levelPassed && hasDeescalation;
      notes = hasDeescalation 
        ? `De-escalated from L3 -> L1 early: ${decision.deEscalations[0].reason}` 
        : 'Failed to record de-escalation.';
    } else if (def.scenarioType === 'memory') {
      const hasMemoryHit = Boolean(decision.episodicMemoryHit && decision.episodicMemoryHit.hit);
      specialPassed = levelPassed && hasMemoryHit;
      notes = hasMemoryHit 
        ? `Episodic memory hit verified. Cached key: ${decision.episodicMemoryHit?.cachedKey}` 
        : 'Failed to lookup episodic memory.';
    } else if (def.scenarioType === 'override') {
      const budgetBounded = decision.computeBudget.maxTokens <= 18000;
      specialPassed = levelPassed && budgetBounded;
      notes = `Overridden to ${actualLevel}. Budget bound verified: ${decision.computeBudget.maxTokens} max tokens.`;
    }

    const passed = levelPassed && modePassed && specialPassed;

    return {
      testId: def.id,
      name: def.name,
      prompt: def.prompt,
      expectedLevel: def.expectedLevel,
      actualLevel,
      expectedMode: def.expectedMode,
      actualMode,
      passed,
      score: decision.activationScore,
      notes,
      decision,
    };
  }

  /**
   * Executes all 10 acceptance tests and computes summary score
   */
  static runAll(): {
    results: AcceptanceTestResult[];
    totalPassed: number;
    totalTests: number;
    allPassed: boolean;
  } {
    const results = ACCEPTANCE_TEST_DEFINITIONS.map(def => this.runTest(def));
    const totalPassed = results.filter(r => r.passed).length;
    const totalTests = results.length;

    return {
      results,
      totalPassed,
      totalTests,
      allPassed: totalPassed === totalTests,
    };
  }
}
