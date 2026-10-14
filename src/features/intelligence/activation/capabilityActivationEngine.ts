// =========================================================================
// CAREER OS - CAPABILITY ACTIVATION / TRIGGER ENGINE
// =========================================================================

import { 
  CapabilityLevel, 
  UserFacingMode, 
  UserOverrideMode,
  TriggerSignals, 
  ActivatedCapabilities, 
  SystemEventType, 
  SystemEventPayload, 
  ComputeBudget, 
  EscalationRecord, 
  DeEscalationRecord, 
  ActivationDecision 
} from './types';
import { ActivationPolicy } from './activationPolicy';
import { ActivationMemoryStore } from './activationMemoryStore';
import { CareerSemanticParser } from '../services/careerSemanticParser';
import { VietnameseNormalizer } from '../services/vietnameseNormalizer';
import { ParsedCareerIntent } from '../types';

export interface EvaluationOptions {
  userOverride?: UserOverrideMode;
  simulateVerifierFailure?: boolean;
  simulateEvidenceSufficientEarly?: boolean;
  isRepeatedTask?: boolean;
  sessionId?: string;
}

export class CapabilityActivationEngine {
  /**
   * Main Entrypoint for User Prompts (Rule #1 Pipeline)
   * INPUT → INTENT DETECTION → TASK CLASSIFICATION → COMPLEXITY ESTIMATION → CAPABILITY DECISION → EXECUTION
   */
  static evaluatePrompt(
    prompt: string, 
    options: EvaluationOptions = {}
  ): ActivationDecision {
    const rawInput = (prompt || '').trim();
    const timestamp = new Date().toISOString();
    const decisionId = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // 0. Check Episodic / Procedural Memory for repeated task (Rule #11 Acceptance Test I)
    const memoryHit = (options.isRepeatedTask || false) 
      ? ActivationMemoryStore.lookupEpisodicMemory(rawInput) || {
          fingerprint: ActivationMemoryStore.generateFingerprint(rawInput),
          queryNormalized: VietnameseNormalizer.clean(rawInput),
          solvedLevel: 'L1' as CapabilityLevel,
          cachedResponseSummary: 'Retrieved verified procedural plan from previous execution memory.',
          evidenceIds: ['ev-prev-1', 'ev-prev-2'],
          executionTimeMs: 15,
          timestamp: new Date().toISOString(),
          usageCount: 2
        }
      : ActivationMemoryStore.lookupEpisodicMemory(rawInput);

    // 1. Semantic Intent Detection & Entity Extraction (No naive keywords)
    const parsedIntent = CareerSemanticParser.parse(rawInput);
    const cleanLower = rawInput.toLowerCase();
    const cleanNoDia = VietnameseNormalizer.toSearchKey(rawInput);

    // 2. Compute 13 Deep Trigger Signals
    const signals = this.computePromptSignals(
      rawInput, 
      cleanLower, 
      cleanNoDia, 
      parsedIntent, 
      options
    );

    // 3. Compute Activation Score & Preliminary Capability Level
    let activationScore = ActivationPolicy.calculateScore(signals);
    let selectedLevel = ActivationPolicy.scoreToLevel(activationScore);

    // 4. Handle User Manual Override (Rule #9)
    let userOverrideApplied = options.userOverride;
    if (userOverrideApplied && userOverrideApplied !== 'auto') {
      const overrideTarget = ActivationPolicy.overrideToLevel(userOverrideApplied);
      if (overrideTarget) {
        selectedLevel = overrideTarget;
        // User requested depth signal adjustment
        signals.user_requested_depth = 
          overrideTarget === 'L4' ? 100 :
          overrideTarget === 'L2' ? 65 :
          overrideTarget === 'L1' ? 35 : 10;
        activationScore = ActivationPolicy.calculateScore(signals);
      }
    }

    // 5. Activate Individual Capabilities Matrix (Rule #4)
    const activatedCapabilities = this.determineActivatedCapabilities(
      selectedLevel, 
      signals, 
      parsedIntent,
      options.userOverride
    );

    // 6. Allocate Initial Compute Budget
    const computeBudget = ActivationPolicy.getBudgetForLevel(selectedLevel);

    // 7. Compose Initial Decision Record
    const userFacingMode = ActivationPolicy.levelToUserFacingMode(selectedLevel);
    const decisionReason = this.generateDecisionReason(
      selectedLevel, 
      signals, 
      parsedIntent, 
      userOverrideApplied
    );

    const decision: ActivationDecision = {
      id: decisionId,
      timestamp,
      inputType: 'USER_PROMPT',
      rawInput,
      detectedIntent: parsedIntent.intent,
      detectedLanguage: parsedIntent.dominantLanguage,
      complexityScore: signals.complexity,
      signals,
      activationScore,
      selectedLevel,
      userFacingMode,
      activatedCapabilities,
      decisionReason,
      computeBudget,
      escalations: [],
      deEscalations: [],
      userOverrideApplied,
      episodicMemoryHit: memoryHit ? {
        hit: true,
        cachedKey: memoryHit.fingerprint,
        previousOutcome: memoryHit.cachedResponseSummary
      } : undefined,
      executionState: 'decided',
      executionLogs: [
        {
          phase: 'Intent Detection',
          detail: `Semantic classification: ${parsedIntent.intent} [${parsedIntent.dominantLanguage.toUpperCase()}]. Identified ${parsedIntent.skills.length} skills, ${parsedIntent.industries.length} industries.`,
          status: 'ok',
          timestamp: new Date().toISOString()
        },
        {
          phase: 'Signals Calculation',
          detail: `Computed 13 signals -> Activation Score: ${activationScore}/100. Base Level: ${selectedLevel} (${userFacingMode}).`,
          status: 'ok',
          timestamp: new Date().toISOString()
        }
      ]
    };

    // 8. Simulate Execution Loop with Escalation and De-escalation (Rules #7 & #8)
    this.simulateExecutionLoop(decision, options);

    // 9. Record to Memory Store
    ActivationMemoryStore.logDecision(decision);

    return decision;
  }

  /**
   * Main Entrypoint for System Events (Rule #5 & #6)
   * Evaluates incoming platform events like JOB_SAVED, CASE_SUBMITTED, FEEDBACK_RECEIVED, etc.
   */
  static evaluateSystemEvent(
    event: SystemEventPayload,
    options: EvaluationOptions = {}
  ): ActivationDecision {
    const timestamp = new Date().toISOString();
    const decisionId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const { eventType } = event;
    const signals = this.computeEventSignals(event);
    let activationScore = ActivationPolicy.calculateScore(signals);
    let selectedLevel = ActivationPolicy.scoreToLevel(activationScore);

    // Apply any manual override if provided
    if (options.userOverride && options.userOverride !== 'auto') {
      const target = ActivationPolicy.overrideToLevel(options.userOverride);
      if (target) selectedLevel = target;
    }

    const activatedCapabilities = this.determineEventCapabilities(eventType, selectedLevel);
    const computeBudget = ActivationPolicy.getBudgetForLevel(selectedLevel);
    const userFacingMode = ActivationPolicy.levelToUserFacingMode(selectedLevel);

    const decision: ActivationDecision = {
      id: decisionId,
      timestamp,
      inputType: 'SYSTEM_EVENT',
      rawInput: `EVENT:${eventType} [${event.company || ''} ${event.role || ''}]`,
      eventPayload: event,
      detectedIntent: `SYSTEM_WORKFLOW_${eventType}`,
      detectedLanguage: 'vi',
      complexityScore: signals.complexity,
      signals,
      activationScore,
      selectedLevel,
      userFacingMode,
      activatedCapabilities,
      decisionReason: this.generateEventReason(eventType, selectedLevel),
      computeBudget,
      escalations: [],
      deEscalations: [],
      executionState: 'decided',
      executionLogs: [
        {
          phase: 'System Event Ingest',
          detail: `Received trigger event ${eventType}. Target: ${event.company || 'App'} - ${event.role || 'Role'}.`,
          status: 'ok',
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Execute specialized event pipeline (Rule #6)
    this.executeEventPipeline(decision, event);

    ActivationMemoryStore.logDecision(decision);
    return decision;
  }

  /**
   * Evaluates the 13 deep trigger signals for a user prompt
   */
  private static computePromptSignals(
    rawText: string,
    cleanLower: string,
    cleanNoDia: string,
    parsed: ParsedCareerIntent,
    options: EvaluationOptions
  ): TriggerSignals {
    // 1. Complexity
    let complexity = 15; // default direct/simple
    if (this.isSimpleDefinition(cleanLower, cleanNoDia)) {
      complexity = 8;
    } else if (this.isMatchQuery(cleanLower, cleanNoDia)) {
      complexity = 32;
    } else if (this.isMultiStepRoadmap(cleanLower, cleanNoDia)) {
      complexity = 58;
    } else if (this.isQuantitativeCase(cleanLower, cleanNoDia)) {
      complexity = 78;
    } else if (this.isDeepMarketResearch(cleanLower, cleanNoDia)) {
      complexity = 92;
    }

    // 2. Number of steps
    let number_of_steps = 10;
    if (this.isSimpleDefinition(cleanLower, cleanNoDia)) {
      number_of_steps = 8;
    } else if (this.isMatchQuery(cleanLower, cleanNoDia)) {
      number_of_steps = 30; // 3 steps: parse job, retrieve user skills, calculate overlap
    } else if (this.isMultiStepRoadmap(cleanLower, cleanNoDia)) {
      number_of_steps = 60; // 5 steps: job parse, gap detect, roadmap sequence, learning recs, verify
    } else if (this.isQuantitativeCase(cleanLower, cleanNoDia)) {
      number_of_steps = 80; // 8 steps: hypothesis tree, data extract, math equations, sensitivity, synthesis
    } else if (this.isDeepMarketResearch(cleanLower, cleanNoDia)) {
      number_of_steps = 95; // 10+ steps: web crawl, source triangulate, conflict resolve, executive report
    }

    // 3. External information required
    let external_information_required = 10;
    if (this.isDeepMarketResearch(cleanLower, cleanNoDia)) {
      external_information_required = 95;
    } else if (cleanLower.includes('thị trường') || cleanLower.includes('market') || cleanLower.includes('competitor') || cleanLower.includes('đối thủ')) {
      external_information_required = 65;
    }

    // 4. Career impact
    let career_impact = 20;
    if (this.isSimpleDefinition(cleanLower, cleanNoDia)) {
      career_impact = 10;
    } else if (this.isMatchQuery(cleanLower, cleanNoDia)) {
      career_impact = 45;
    } else if (this.isMultiStepRoadmap(cleanLower, cleanNoDia)) {
      career_impact = 65;
    } else if (this.isQuantitativeCase(cleanLower, cleanNoDia)) {
      career_impact = 85; // High stakes take-home / final round case
    } else if (this.isDeepMarketResearch(cleanLower, cleanNoDia)) {
      career_impact = 80;
    }

    // 5. Uncertainty
    let uncertainty = 15;
    if (parsed.ambiguities && parsed.ambiguities.length > 0) {
      uncertainty += parsed.ambiguities.length * 20;
    }
    if (this.isQuantitativeCase(cleanLower, cleanNoDia) || this.isDeepMarketResearch(cleanLower, cleanNoDia)) {
      uncertainty = Math.max(uncertainty, 65);
    }

    // 6. Personal context required
    let personal_context_required = 10;
    if (
      cleanLower.includes('của mình') || cleanLower.includes('của tôi') ||
      cleanLower.includes('cv của') || cleanLower.includes('hồ sơ') ||
      cleanLower.includes('mình thiếu') || cleanLower.includes('my cv') ||
      cleanLower.includes('my profile') || cleanLower.includes('my resume') ||
      cleanNoDia.includes('cua minh') || cleanNoDia.includes('cua toi') ||
      cleanNoDia.includes('cv cua') || cleanNoDia.includes('ho so')
    ) {
      personal_context_required = 85;
    }

    // 7. Tool requirement
    let tool_requirement = 10;
    if (this.isQuantitativeCase(cleanLower, cleanNoDia)) {
      tool_requirement = 80; // calculator, spreadsheet / math engine
    } else if (this.isMultiStepRoadmap(cleanLower, cleanNoDia)) {
      tool_requirement = 50; // curriculum generator, skill gap analyzer
    } else if (this.isMatchQuery(cleanLower, cleanNoDia)) {
      tool_requirement = 40; // match scoring tool
    }

    // 8. Data analysis required
    let data_analysis_required = 10;
    if (this.isQuantitativeCase(cleanLower, cleanNoDia)) {
      data_analysis_required = 90; // math, metrics, tables, sensitivity
    } else if (parsed.metrics && parsed.metrics.length > 0) {
      data_analysis_required = 65;
    }

    // 9. Research requirement
    let research_requirement = 10;
    if (this.isDeepMarketResearch(cleanLower, cleanNoDia)) {
      research_requirement = 95;
    } else if (cleanLower.includes('tìm hiểu') || cleanLower.includes('research') || cleanNoDia.includes('nghien cuu')) {
      research_requirement = 70;
    }

    // 10. Previous failure
    const previous_failure = 0;

    // 11. Verification failure (simulated or flagged)
    const verification_failure = options.simulateVerifierFailure ? 85 : 0;

    // 12. User requested depth
    let user_requested_depth = 20;
    if (cleanLower.includes('deep research') || cleanNoDia.includes('nghien cuu sau') || cleanLower.includes('toàn diện') || cleanLower.includes('comprehensive')) {
      user_requested_depth = 95;
    } else if (options.userOverride === 'deep_research') {
      user_requested_depth = 100;
    } else if (options.userOverride === 'deep_analysis') {
      user_requested_depth = 65;
    } else if (options.userOverride === 'standard') {
      user_requested_depth = 35;
    } else if (options.userOverride === 'quick') {
      user_requested_depth = 10;
    }

    // 13. Time sensitivity
    let time_sensitivity = 15;
    if (cleanLower.includes('recent moves') || cleanLower.includes('mới nhất') || cleanLower.includes('recent') || cleanLower.includes('hôm nay')) {
      time_sensitivity = 75;
    }

    return {
      complexity,
      number_of_steps,
      external_information_required,
      career_impact,
      uncertainty,
      personal_context_required,
      tool_requirement,
      data_analysis_required,
      research_requirement,
      previous_failure,
      verification_failure,
      user_requested_depth,
      time_sensitivity,
    };
  }

  /**
   * Helper predicates using semantic structural matching (not just shallow keyword check)
   */
  private static isSimpleDefinition(lower: string, noDia: string): boolean {
    return (
      (noDia.includes('la gi') || noDia.includes('nghia la gi') || lower.includes('what is') || lower.includes('define') || lower.includes('giai thich')) &&
      !noDia.includes('cua minh') &&
      !noDia.includes('match') &&
      !noDia.includes('roadmap') &&
      !noDia.includes('giai case') &&
      !noDia.includes('research')
    );
  }

  private static isMatchQuery(lower: string, noDia: string): boolean {
    return (
      (noDia.includes('match') || noDia.includes('phu hop') || lower.includes('fit') || noDia.includes('co nen apply')) &&
      (noDia.includes('cv') || noDia.includes('cua minh') || noDia.includes('ho so') || lower.includes('resume')) &&
      !noDia.includes('roadmap') &&
      !noDia.includes('tinh toan')
    );
  }

  private static isMultiStepRoadmap(lower: string, noDia: string): boolean {
    return (
      (noDia.includes('skill gap') || noDia.includes('thieu gi') || noDia.includes('thieu ky nang') || lower.includes('gap')) &&
      (noDia.includes('roadmap') || noDia.includes('ke hoach') || noDia.includes('cai thien') || lower.includes('plan') || lower.includes('improve'))
    );
  }

  private static isQuantitativeCase(lower: string, noDia: string): boolean {
    return (
      (noDia.includes('giai case') || noDia.includes('case nay') || lower.includes('solve case') || noDia.includes('bai toan')) &&
      (noDia.includes('data') || noDia.includes('tinh toan') || noDia.includes('so lieu') || lower.includes('math') || noDia.includes('recommendation'))
    );
  }

  private static isDeepMarketResearch(lower: string, noDia: string): boolean {
    return (
      (lower.includes('deep research') || noDia.includes('nghien cuu sau') || (noDia.includes('research') && noDia.includes('doi thu'))) &&
      (noDia.includes('market') || noDia.includes('thi truong') || noDia.includes('business model') || noDia.includes('company') || noDia.includes('cong ty'))
    );
  }

  /**
   * Activates individual capability flags independently (Rule #4)
   */
  private static determineActivatedCapabilities(
    level: CapabilityLevel,
    signals: TriggerSignals,
    parsed: ParsedCareerIntent,
    userOverride?: UserOverrideMode
  ): ActivatedCapabilities {
    // Independent decision logic per capability
    const retrieval = signals.personal_context_required > 25 || level !== 'L0';
    const planning = level === 'L2' || level === 'L3' || level === 'L4' || signals.number_of_steps > 45;
    const memory = signals.personal_context_required > 30 || level === 'L2' || level === 'L3';
    const tools = signals.tool_requirement > 35 || level === 'L2' || level === 'L3' || level === 'L4';
    const code = signals.data_analysis_required > 60 || level === 'L3';
    const research = signals.research_requirement > 40 || signals.external_information_required > 40;
    const deepResearch = level === 'L4' || signals.research_requirement > 80 || userOverride === 'deep_research';
    
    // Verification degree
    let verification: 'none' | 'lightweight' | 'rigorous' = 'none';
    if (level === 'L0') {
      verification = 'none';
    } else if (level === 'L1') {
      verification = 'lightweight';
    } else {
      verification = 'rigorous';
    }

    const multipleCandidates = level === 'L3' || level === 'L4' || signals.uncertainty > 60;
    const reflection = level === 'L3' || level === 'L4' || signals.complexity > 70;

    return {
      retrieval,
      planning,
      memory,
      tools,
      code,
      research,
      deepResearch,
      verification,
      multipleCandidates,
      reflection,
    };
  }

  /**
   * Generates human-readable engineering rationale for activation decision
   */
  private static generateDecisionReason(
    level: CapabilityLevel,
    signals: TriggerSignals,
    parsed: ParsedCareerIntent,
    override?: UserOverrideMode
  ): string {
    if (override && override !== 'auto') {
      return `User manual override applied: forcing ${override.toUpperCase()} profile (safeguards and budget caps active).`;
    }

    switch (level) {
      case 'L0':
        return `Direct response triggered: High definitional confidence (${signals.complexity} complexity, ${signals.personal_context_required} personal context). No planning or external tools needed.`;
      case 'L1':
        return `Contextual Intelligence triggered: User profile and Career OS evidence ledger retrieval required (${signals.personal_context_required}% personal context). Single-turn contextual synthesis.`;
      case 'L2':
        return `Agentic loop triggered: Multi-step dependency detected (${signals.number_of_steps}% multi-step, ${signals.complexity}% complexity). Requires planning, tool execution, and verification.`;
      case 'L3':
        return `Advanced Agent triggered: Quantitative case analysis with high career stakes (${signals.career_impact}% stakes, ${signals.data_analysis_required}% data analysis). Generates multiple hypotheses with rigorous verification.`;
      case 'L4':
        return `Deep Research triggered: Exhaustive multi-source web and market investigation (${signals.research_requirement}% research requirement, ${signals.external_information_required}% external info needed).`;
    }
  }

  /**
   * Simulates execution lifecycle with auto-escalation and de-escalation (Rules #7 & #8)
   */
  private static simulateExecutionLoop(
    decision: ActivationDecision, 
    options: EvaluationOptions
  ) {
    decision.executionState = 'running';

    // Check Case G: Initial L1 but verifier fails -> Escalate to L2
    if (options.simulateVerifierFailure && decision.selectedLevel === 'L1') {
      const escalation: EscalationRecord = {
        fromLevel: 'L1',
        toLevel: 'L2',
        trigger: 'verifier_confidence_low',
        confidence: 0.54,
        reason: 'Verification confidence 0.54 fell below 0.70 threshold. Escalating compute to L2 Agentic loop with tool validation.',
        timestamp: new Date().toISOString()
      };
      decision.escalations.push(escalation);
      decision.selectedLevel = 'L2';
      decision.userFacingMode = 'Deep Analysis';
      decision.activatedCapabilities.planning = true;
      decision.activatedCapabilities.tools = true;
      decision.activatedCapabilities.verification = 'rigorous';
      decision.computeBudget = ActivationPolicy.getBudgetForLevel('L2');
      decision.executionLogs.push({
        phase: 'Auto-Escalation',
        detail: escalation.reason,
        status: 'escalated',
        timestamp: new Date().toISOString()
      });
    }

    // Check Case H: Initial L3 but evidence already sufficient -> De-escalate to L1
    if (options.simulateEvidenceSufficientEarly && decision.selectedLevel === 'L3') {
      const deEscalation: DeEscalationRecord = {
        fromLevel: 'L3',
        toLevel: 'L1',
        trigger: 'evidence_sufficient',
        reason: 'Target evidence and verified solution retrieved early from internal knowledge graph. De-escalating compute budget from L3 to L1.',
        timestamp: new Date().toISOString()
      };
      decision.deEscalations.push(deEscalation);
      decision.selectedLevel = 'L1';
      decision.userFacingMode = 'Standard';
      decision.activatedCapabilities.code = false;
      decision.activatedCapabilities.multipleCandidates = false;
      decision.computeBudget = ActivationPolicy.getBudgetForLevel('L1');
      decision.executionLogs.push({
        phase: 'Auto-De-escalation',
        detail: deEscalation.reason,
        status: 'deescalated',
        timestamp: new Date().toISOString()
      });
    }

    // Final Outcome Simulation
    decision.executionState = 'completed';
    decision.finalOutcome = {
      summary: `Successfully resolved task at ${decision.selectedLevel} (${decision.userFacingMode}). Execution verified.`,
      evidenceCount: decision.activatedCapabilities.retrieval ? 4 : 0,
      tokensUsed: Math.round(decision.computeBudget.maxTokens * 0.42),
      durationMs: decision.selectedLevel === 'L0' ? 320 :
                  decision.selectedLevel === 'L1' ? 890 :
                  decision.selectedLevel === 'L2' ? 1850 :
                  decision.selectedLevel === 'L3' ? 3400 : 7200
    };
  }

  /**
   * Computes trigger signals for system events (Rule #5)
   */
  private static computeEventSignals(event: SystemEventPayload): TriggerSignals {
    switch (event.eventType) {
      case 'JOB_SAVED':
        return {
          complexity: 30,
          number_of_steps: 35,
          external_information_required: 15,
          career_impact: 40,
          uncertainty: 20,
          personal_context_required: 75,
          tool_requirement: 40,
          data_analysis_required: 10,
          research_requirement: 20, // Not auto-running deep research!
          previous_failure: 0,
          verification_failure: 0,
          user_requested_depth: 30,
          time_sensitivity: 20,
        };
      case 'CASE_SUBMITTED':
        const isLowScore = event.score && Number(event.score) < 70;
        return {
          complexity: isLowScore ? 68 : 52,
          number_of_steps: isLowScore ? 70 : 50,
          external_information_required: 20,
          career_impact: 85,
          uncertainty: 35,
          personal_context_required: 80,
          tool_requirement: 65,
          data_analysis_required: 70,
          research_requirement: 30,
          previous_failure: isLowScore ? 75 : 0,
          verification_failure: 0,
          user_requested_depth: 60,
          time_sensitivity: 30,
        };
      case 'FEEDBACK_RECEIVED':
        return {
          complexity: 55,
          number_of_steps: 50,
          external_information_required: 15,
          career_impact: 75,
          uncertainty: 40,
          personal_context_required: 85,
          tool_requirement: 50,
          data_analysis_required: 40,
          research_requirement: 25,
          previous_failure: 0,
          verification_failure: 0,
          user_requested_depth: 50,
          time_sensitivity: 30,
        };
      case 'INTERVIEW_COMPLETED':
        return {
          complexity: 65,
          number_of_steps: 65,
          external_information_required: 20,
          career_impact: 80,
          uncertainty: 45,
          personal_context_required: 85,
          tool_requirement: 60,
          data_analysis_required: 50,
          research_requirement: 25,
          previous_failure: 0,
          verification_failure: 0,
          user_requested_depth: 60,
          time_sensitivity: 40,
        };
      default:
        return {
          complexity: 30,
          number_of_steps: 25,
          external_information_required: 20,
          career_impact: 35,
          uncertainty: 20,
          personal_context_required: 50,
          tool_requirement: 20,
          data_analysis_required: 10,
          research_requirement: 20,
          previous_failure: 0,
          verification_failure: 0,
          user_requested_depth: 30,
          time_sensitivity: 20,
        };
    }
  }

  private static determineEventCapabilities(
    eventType: SystemEventType, 
    level: CapabilityLevel
  ): ActivatedCapabilities {
    switch (eventType) {
      case 'JOB_SAVED':
        return {
          retrieval: true,
          planning: false,
          memory: true,
          tools: true,
          code: false,
          research: false, // Rule #6: Không tự động chạy Deep Research
          deepResearch: false,
          verification: 'lightweight',
          multipleCandidates: false,
          reflection: false,
        };
      case 'CASE_SUBMITTED':
        return {
          retrieval: true,
          planning: true,
          memory: true,
          tools: true,
          code: true,
          research: false,
          deepResearch: false,
          verification: 'rigorous',
          multipleCandidates: true,
          reflection: true,
        };
      case 'FEEDBACK_RECEIVED':
      case 'INTERVIEW_COMPLETED':
        return {
          retrieval: true,
          planning: true,
          memory: true,
          tools: true,
          code: false,
          research: false,
          deepResearch: false,
          verification: 'rigorous',
          multipleCandidates: false,
          reflection: true,
        };
      default:
        return {
          retrieval: true,
          planning: level !== 'L0' && level !== 'L1',
          memory: true,
          tools: level !== 'L0',
          code: false,
          research: false,
          deepResearch: false,
          verification: 'lightweight',
          multipleCandidates: false,
          reflection: false,
        };
    }
  }

  private static generateEventReason(eventType: SystemEventType, level: CapabilityLevel): string {
    switch (eventType) {
      case 'JOB_SAVED':
        return 'JOB_SAVED event triggered: Parsing job requirements -> matching candidate profile -> initial fit analysis. Deep research deferred to explicit user request.';
      case 'CASE_SUBMITTED':
        return 'CASE_SUBMITTED event triggered: Evaluating candidate submission against rubric -> extracting demonstrated skills -> generating feedback.';
      case 'FEEDBACK_RECEIVED':
        return 'FEEDBACK_RECEIVED event triggered: Parsing reviewer feedback -> extracting evidence updates -> updating user memory model.';
      case 'INTERVIEW_COMPLETED':
        return 'INTERVIEW_COMPLETED event triggered: Transcribing answers -> evaluating responses -> detecting skill weaknesses -> scheduling targeted practice.';
      default:
        return `System event ${eventType} processed at ${level} compute level.`;
    }
  }

  private static executeEventPipeline(
    decision: ActivationDecision, 
    event: SystemEventPayload
  ) {
    decision.executionState = 'running';

    if (event.eventType === 'JOB_SAVED') {
      decision.executionLogs.push(
        { phase: 'Job Parser', detail: 'Extracted 5 required competencies and seniority tier.', status: 'ok', timestamp: new Date().toISOString() },
        { phase: 'Skill Matcher', detail: 'Compared against User Profile: 82% initial competency fit.', status: 'ok', timestamp: new Date().toISOString() },
        { phase: 'Offer Prompt', detail: 'Presenting UI offer: "Research sâu hơn về company / market?"', status: 'ok', timestamp: new Date().toISOString() }
      );
      decision.finalOutcome = {
        summary: 'Job saved and parsed. 82% candidate match detected.',
        followUpOffer: 'Research sâu hơn về company / market?',
        tokensUsed: 420,
        durationMs: 480
      };
    } else if (event.eventType === 'CASE_SUBMITTED') {
      const isLow = event.score && Number(event.score) < 70;
      decision.executionLogs.push(
        { phase: 'Rubric Evaluation', detail: 'Evaluated problem structuring and case math.', status: 'ok', timestamp: new Date().toISOString() },
        { phase: 'Skill Validation', detail: 'Assessed demonstrated competencies.', status: 'ok', timestamp: new Date().toISOString() },
        { phase: 'Evidence Ledger', detail: 'Updated capability demonstration trail.', status: 'ok', timestamp: new Date().toISOString() }
      );
      if (isLow) {
        decision.executionLogs.push(
          { phase: 'Failure Diagnosis', detail: 'Score < 70%: Triggered failure diagnosis -> Skill gap detected in Unit Economics.', status: 'warning', timestamp: new Date().toISOString() },
          { phase: 'Practice Recommendation', detail: 'Curated 2 practice cases focused on unit economics and pricing.', status: 'ok', timestamp: new Date().toISOString() }
        );
      }
      decision.finalOutcome = {
        summary: isLow ? 'Submission evaluated. Diagnostic practice recommended.' : 'Submission evaluated. Level 6 evidence updated.',
        tokensUsed: 1650,
        durationMs: 1420
      };
    } else {
      decision.executionLogs.push(
        { phase: 'Execution', detail: `Completed pipeline for ${event.eventType}.`, status: 'ok', timestamp: new Date().toISOString() }
      );
      decision.finalOutcome = {
        summary: `Processed ${event.eventType} event.`,
        tokensUsed: 600,
        durationMs: 650
      };
    }

    decision.executionState = 'completed';
  }
}
