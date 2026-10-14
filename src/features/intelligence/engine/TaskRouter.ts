// =========================================================================
// CAREER INTELLIGENCE ENGINE - TASK ROUTER
// =========================================================================

import { CareerSemanticParser } from '../services/careerSemanticParser';
import { VietnameseNormalizer } from '../services/vietnameseNormalizer';
import { CanonicalOntology } from '../services/canonicalOntology';
import { 
  CareerTaskType, 
  TaskComplexity, 
  TaskRouterDecision, 
  ComputeBudgetTier,
  ResearchDepth 
} from './types';
import { CapabilityLevel } from '../activation/types';
import { ResearchEngine } from './ResearchEngine';

export class TaskRouter {
  /**
   * Route and classify an incoming user prompt or task specification
   */
  public static routeTask(prompt: string, moduleContext?: string): TaskRouterDecision {
    const rawTrimmed = (prompt || '').trim();
    const normalized = VietnameseNormalizer.normalizeText(rawTrimmed);
    const intentResult = CareerSemanticParser.parseIntent(rawTrimmed);

    const allMatches = [
      ...(intentResult.skills || []),
      ...(intentResult.knowledge || []),
      ...(intentResult.industries || []),
      ...(intentResult.metrics || []),
      ...(intentResult.role ? [intentResult.role] : []),
      ...(intentResult.caseType ? [intentResult.caseType] : [])
    ];

    const detectedEntities = allMatches.map(e => e.canonicalId);
    const canonicalConcepts = allMatches.map(e => e.canonicalName);

    // 1. Identify Task Category
    const taskType = this.classifyTaskType(rawTrimmed, normalized, moduleContext);

    // 2. Assess Cognitive Complexity & Requirements
    const { 
      complexity, 
      requiresPlanning, 
      requiresRetrieval, 
      requiresTools, 
      requiresResearch, 
      requiresCode, 
      requiresVerification, 
      requiresLongTermMemory,
      computeBudget,
      suggestedLevel
    } = this.evaluateExecutionRequirements(taskType, rawTrimmed, normalized);

    // Dynamic capability evaluation for Research
    const researchEval = ResearchEngine.evaluateNeed(rawTrimmed, { complexity });
    const finalRequiresResearch = requiresResearch || researchEval.needed;
    const suggestedResearchDepth = finalRequiresResearch ? (taskType === 'deep_research' ? 'deep_research' : researchEval.depth) : undefined;

    const rationale = this.generateRoutingRationale(taskType, complexity, suggestedLevel, computeBudget);

    return {
      taskType,
      complexity,
      requiresPlanning,
      requiresRetrieval,
      requiresTools,
      requiresResearch: finalRequiresResearch,
      requiresCode,
      requiresVerification,
      requiresLongTermMemory,
      computeBudget,
      confidence: 0.92,
      rationale,
      detectedEntities,
      canonicalConcepts,
      suggestedLevel,
      suggestedResearchDepth,
    };
  }

  private static classifyTaskType(raw: string, norm: string, moduleContext?: string): CareerTaskType {
    const lower = norm.toLowerCase();

    // Deep Research triggers
    if (
      lower.includes('deep research') ||
      lower.includes('nghien cuu sau') ||
      (lower.includes('doi thu') && lower.includes('toan dien')) ||
      (lower.includes('market landscape') && lower.includes('exhaustive'))
    ) {
      return 'deep_research';
    }

    // Company & Industry Research
    if (
      lower.includes('tim hieu cong ty') ||
      lower.includes('company research') ||
      lower.includes('van hoa cong ty') ||
      lower.includes('salary benchmark') ||
      lower.includes('luong thi truong')
    ) {
      return 'company_research';
    }

    if (
      lower.includes('nganh') ||
      lower.includes('industry') ||
      lower.includes('xu huong thi truong') ||
      lower.includes('market trend')
    ) {
      return 'industry_research';
    }

    // Skill Gap Analysis
    if (
      lower.includes('skill gap') ||
      lower.includes('thieu ky nang') ||
      lower.includes('khoang cach ky nang') ||
      lower.includes('can hoc gi') ||
      lower.includes('lo trinh hoc')
    ) {
      return 'skill_gap_analysis';
    }

    // Job Matching
    if (
      lower.includes('match') ||
      lower.includes('phu hop voi job') ||
      lower.includes('cv hop voi') ||
      lower.includes('ti le do') ||
      lower.includes('so khop')
    ) {
      return 'job_matching';
    }

    // Case Analysis / Quantitative Case
    if (
      lower.includes('giai case') ||
      lower.includes('case study') ||
      lower.includes('tinh toan') ||
      lower.includes('cac') ||
      lower.includes('ltv') ||
      lower.includes('break even') ||
      lower.includes('unit economics') ||
      lower.includes('du lieu data')
    ) {
      return 'case_analysis';
    }

    // Data analysis
    if (
      lower.includes('phan tich data') ||
      lower.includes('tinh toan so lieu') ||
      lower.includes('mo hinh hoa') ||
      lower.includes('chay code') ||
      lower.includes('run code')
    ) {
      return 'data_analysis';
    }

    // Profile Analysis
    if (
      lower.includes('danh gia profile') ||
      lower.includes('danh gia cv') ||
      lower.includes('review resume') ||
      lower.includes('ho so cua toi')
    ) {
      return 'profile_analysis';
    }

    // Assessment & Rubric Evaluation
    if (
      lower.includes('cham diem') ||
      lower.includes('danh gia bai lam') ||
      lower.includes('rubric') ||
      lower.includes('grade') ||
      lower.includes('feedback bai')
    ) {
      return 'assessment';
    }

    // Interview Simulation
    if (
      lower.includes('phong van') ||
      lower.includes('interview') ||
      lower.includes('mock interview') ||
      lower.includes('tra loi cau hoi') ||
      lower.includes('star framework')
    ) {
      return 'interview_simulation';
    }

    // Career Recommendation & Planning
    if (
      lower.includes('lo trinh') ||
      lower.includes('roadmap') ||
      lower.includes('ke hoach phat trien') ||
      lower.includes('dinh huong nghe nghiep')
    ) {
      return 'planning';
    }

    // Multi-step Execution
    if (
      (lower.includes('va sau do') || lower.includes('buoc 1') || lower.includes('dong thoi')) &&
      lower.length > 50
    ) {
      return 'multi_step_execution';
    }

    // Writing / Drafting
    if (
      lower.includes('viet cover letter') ||
      lower.includes('viet thu ung tuyen') ||
      lower.includes('viet lai bullet') ||
      lower.includes('chinh sua cau')
    ) {
      return 'writing';
    }

    // Simple Summarization
    if (lower.includes('tom tat') || lower.includes('summarize') || lower.includes('rut gon')) {
      return 'summarization';
    }

    // Simple Retrieval
    if (
      lower.includes('tim tai lieu') ||
      lower.includes('sach nao') ||
      lower.includes('tai lieu doc ve')
    ) {
      return 'retrieval';
    }

    // Simple Q&A (Definitions, concepts)
    if (
      lower.startsWith('la gi') ||
      lower.includes('la gi') ||
      lower.includes('dinh nghia') ||
      lower.includes('what is') ||
      raw.split(' ').length <= 6
    ) {
      return 'simple_qa';
    }

    // Fallback based on module context
    if (moduleContext === 'practice') return 'interview_simulation';
    if (moduleContext === 'tracker') return 'job_matching';
    if (moduleContext === 'library') return 'retrieval';

    return 'simple_qa';
  }

  private static evaluateExecutionRequirements(
    taskType: CareerTaskType, 
    raw: string, 
    norm: string
  ): {
    complexity: TaskComplexity;
    requiresPlanning: boolean;
    requiresRetrieval: boolean;
    requiresTools: boolean;
    requiresResearch: boolean;
    requiresCode: boolean;
    requiresVerification: boolean;
    requiresLongTermMemory: boolean;
    computeBudget: ComputeBudgetTier;
    suggestedLevel: CapabilityLevel;
  } {
    switch (taskType) {
      case 'simple_qa':
      case 'summarization':
      case 'writing':
        return {
          complexity: 'low',
          requiresPlanning: false,
          requiresRetrieval: false,
          requiresTools: false,
          requiresResearch: false,
          requiresCode: false,
          requiresVerification: true,
          requiresLongTermMemory: false,
          computeBudget: 'low',
          suggestedLevel: 'L0',
        };

      case 'retrieval':
      case 'classification':
        return {
          complexity: 'low',
          requiresPlanning: false,
          requiresRetrieval: true,
          requiresTools: false,
          requiresResearch: false,
          requiresCode: false,
          requiresVerification: true,
          requiresLongTermMemory: false,
          computeBudget: 'low',
          suggestedLevel: 'L1',
        };

      case 'job_matching':
      case 'profile_analysis':
        return {
          complexity: 'medium',
          requiresPlanning: false,
          requiresRetrieval: true,
          requiresTools: true,
          requiresResearch: false,
          requiresCode: false,
          requiresVerification: true,
          requiresLongTermMemory: true,
          computeBudget: 'medium',
          suggestedLevel: 'L1',
        };

      case 'skill_gap_analysis':
      case 'career_recommendation':
      case 'planning':
        return {
          complexity: 'high',
          requiresPlanning: true,
          requiresRetrieval: true,
          requiresTools: true,
          requiresResearch: false,
          requiresCode: false,
          requiresVerification: true,
          requiresLongTermMemory: true,
          computeBudget: 'high',
          suggestedLevel: 'L2',
        };

      case 'case_analysis':
      case 'data_analysis':
      case 'multi_step_execution':
        return {
          complexity: 'high',
          requiresPlanning: true,
          requiresRetrieval: true,
          requiresTools: true,
          requiresResearch: false,
          requiresCode: true,
          requiresVerification: true,
          requiresLongTermMemory: true,
          computeBudget: 'high',
          suggestedLevel: 'L3',
        };

      case 'interview_simulation':
      case 'assessment':
        return {
          complexity: 'medium',
          requiresPlanning: false,
          requiresRetrieval: true,
          requiresTools: true,
          requiresResearch: false,
          requiresCode: false,
          requiresVerification: true,
          requiresLongTermMemory: true,
          computeBudget: 'medium',
          suggestedLevel: 'L2',
        };

      case 'company_research':
      case 'industry_research':
        return {
          complexity: 'medium',
          requiresPlanning: true,
          requiresRetrieval: true,
          requiresTools: true,
          requiresResearch: true,
          requiresCode: false,
          requiresVerification: true,
          requiresLongTermMemory: false,
          computeBudget: 'high',
          suggestedLevel: 'L2',
        };

      case 'deep_research':
        return {
          complexity: 'very_high',
          requiresPlanning: true,
          requiresRetrieval: true,
          requiresTools: true,
          requiresResearch: true,
          requiresCode: true,
          requiresVerification: true,
          requiresLongTermMemory: true,
          computeBudget: 'maximum',
          suggestedLevel: 'L4',
        };

      default:
        return {
          complexity: 'low',
          requiresPlanning: false,
          requiresRetrieval: false,
          requiresTools: false,
          requiresResearch: false,
          requiresCode: false,
          requiresVerification: true,
          requiresLongTermMemory: false,
          computeBudget: 'low',
          suggestedLevel: 'L0',
        };
    }
  }

  private static generateRoutingRationale(
    taskType: CareerTaskType,
    complexity: TaskComplexity,
    level: CapabilityLevel,
    budget: ComputeBudgetTier
  ): string {
    return `Classified as '${taskType}' with ${complexity} complexity. Routed to ${level} activation tier with ${budget} compute budget to maintain strict efficiency.`;
  }
}
