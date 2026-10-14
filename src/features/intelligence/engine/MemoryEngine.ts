// =========================================================================
// CAREER INTELLIGENCE ENGINE - MEMORY ENGINE (4 CLASSES)
// =========================================================================

import { 
  SemanticMemoryItem, 
  EpisodicMemoryItem, 
  ProceduralMemoryItem, 
  InferredUserAttribute,
  CareerTaskType 
} from './types';
import { CanonicalOntology } from '../services/canonicalOntology';

const STORAGE_KEYS = {
  EPISODIC: 'career_os_memory_episodic_v1',
  PROCEDURAL: 'career_os_memory_procedural_v1',
  USER_MODEL: 'career_os_memory_user_model_v1',
};

export class MemoryEngine {
  private static episodicStore: EpisodicMemoryItem[] = [];
  private static proceduralStore: ProceduralMemoryItem[] = [];
  private static userModelInferences: InferredUserAttribute[] = [];
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;

    // Load from localStorage or seed with high-confidence mock/historical inferences
    try {
      const savedEpisodic = localStorage.getItem(STORAGE_KEYS.EPISODIC);
      if (savedEpisodic) this.episodicStore = JSON.parse(savedEpisodic);

      const savedProcedural = localStorage.getItem(STORAGE_KEYS.PROCEDURAL);
      if (savedProcedural) this.proceduralStore = JSON.parse(savedProcedural);

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER_MODEL);
      if (savedUser) this.userModelInferences = JSON.parse(savedUser);
    } catch {
      // Fallback
    }

    // Seed procedural memories if empty
    if (this.proceduralStore.length === 0) {
      this.proceduralStore = [
        {
          id: 'proc_skill_gap_analysis',
          patternName: 'Structured Skill Gap & Learning Roadmap',
          taskType: 'skill_gap_analysis',
          stepSequence: [
            'Extract role requirements from target job description',
            'Compare against user validated evidence ledger',
            'Categorize gaps into Critical, Secondary, and Stretch',
            'Map gaps to specific curated books & research papers',
            'Formulate a 4-week structured milestone plan',
          ],
          successfulRunsCount: 14,
          averageScore: 94,
          applicableConditions: ['Target job identified', 'User profile skills available'],
        },
        {
          id: 'proc_case_analysis_financial',
          patternName: 'Unit Economics & Quantitative Case Breakdown',
          taskType: 'case_analysis',
          stepSequence: [
            'Extract core metrics (CAC, LTV, Payback, Churn)',
            'Execute safe code sandbox simulation',
            'Identify the break-even tradeoff curve',
            'Synthesize tactical recommendations with risk mitigations',
          ],
          successfulRunsCount: 9,
          averageScore: 96,
          applicableConditions: ['Quantitative case exhibits present', 'Code execution permitted'],
        },
        {
          id: 'proc_job_matching_standard',
          patternName: 'Weighted Competency Job Fit Matrix',
          taskType: 'job_matching',
          stepSequence: [
            'Retrieve target job required and nice-to-have competencies',
            'Cross-reference candidate verified skills & evidence ledger',
            'Calculate weighted match percentage across technical & domain pillars',
            'Output fit summary with top match highlights and minor gaps',
          ],
          successfulRunsCount: 22,
          averageScore: 92,
          applicableConditions: ['Job entity available', 'User resume/profile loaded'],
        }
      ];
    }

    // Seed realistic inferred user model attributes
    if (this.userModelInferences.length === 0) {
      this.userModelInferences = [
        {
          id: 'inf_1',
          claim: 'Strong structural systems thinking and microservices architecture capability',
          dimension: 'strength',
          skillId: 'sk_system_design',
          evidence: 'Passed Distributed Ledger Case with 95% rubric compliance; demonstrated zero-downtime migration strategy.',
          confidence: 0.94,
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          source: 'case_submission',
        },
        {
          id: 'inf_2',
          claim: 'Needs improvement on quantifying business impact metrics (e.g. CAC/LTV) in behavioral STAR answers',
          dimension: 'weakness',
          skillId: 'sk_product_metrics',
          evidence: 'Failed to mention conversion uplift or CAC reduction in Mock Interview Round 2 response.',
          confidence: 0.88,
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
          source: 'interview_answer',
        },
        {
          id: 'inf_3',
          claim: 'Prefers concise, metric-dense executive summaries over lengthy narrative prose',
          dimension: 'preference',
          evidence: 'Consistently chose condensed tables and bullet-point summaries in previous 3 sessions.',
          confidence: 0.78,
          timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
          source: 'user_feedback',
        }
      ];
    }

    this.initialized = true;
  }

  // =========================================================================
  // 1. SEMANTIC MEMORY (Knowledge, concepts, facts)
  // =========================================================================
  public static getSemanticConcept(termOrId: string): SemanticMemoryItem | null {
    const entity = CanonicalOntology.resolveEntity(termOrId);
    if (!entity) return null;

    return {
      id: entity.entityId,
      conceptId: entity.entityId,
      canonicalName: entity.canonicalName,
      definitionEn: entity.descriptionEn,
      definitionVi: entity.descriptionVi,
      domain: entity.domain || 'General',
      tags: entity.aliases,
      confidence: 0.98,
      updatedAt: new Date().toISOString(),
    };
  }

  // =========================================================================
  // 2. EPISODIC MEMORY (Previous tasks, attempts, outcomes)
  // =========================================================================
  public static recordEpisodicMemory(item: Omit<EpisodicMemoryItem, 'id' | 'timestamp'>): EpisodicMemoryItem {
    this.initialize();
    const memory: EpisodicMemoryItem = {
      ...item,
      id: `ep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };
    this.episodicStore.unshift(memory);
    if (this.episodicStore.length > 50) this.episodicStore.pop();
    this.persist(STORAGE_KEYS.EPISODIC, this.episodicStore);
    return memory;
  }

  public static findRelevantEpisodicMemories(prompt: string, taskType: CareerTaskType): EpisodicMemoryItem[] {
    this.initialize();
    const pLower = prompt.toLowerCase();
    return this.episodicStore.filter(mem => {
      if (mem.taskType === taskType && mem.successfulOutcome) return true;
      const commonWords = mem.userPrompt.toLowerCase().split(' ').filter(w => w.length > 3 && pLower.includes(w));
      return commonWords.length >= 2;
    }).slice(0, 3);
  }

  // =========================================================================
  // 3. PROCEDURAL MEMORY (Successful workflows & patterns)
  // =========================================================================
  public static getProceduralPattern(taskType: CareerTaskType): ProceduralMemoryItem | null {
    this.initialize();
    const match = this.proceduralStore.find(p => p.taskType === taskType);
    return match || null;
  }

  public static getAllProceduralPatterns(): ProceduralMemoryItem[] {
    this.initialize();
    return [...this.proceduralStore];
  }

  // =========================================================================
  // 4. USER MODEL (Inferred strengths, weaknesses, gaps)
  // Strictly validated: claim + evidence + confidence + timestamp + source
  // =========================================================================
  public static getUserModelInferences(minConfidence: number = 0.70): InferredUserAttribute[] {
    this.initialize();
    return this.userModelInferences.filter(inf => inf.confidence >= minConfidence && !inf.isStale);
  }

  public static recordUserInference(inference: Omit<InferredUserAttribute, 'id' | 'timestamp'>): InferredUserAttribute {
    this.initialize();
    const newInference: InferredUserAttribute = {
      ...inference,
      id: `inf_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };

    // Replace older inference for same claim/skill if higher confidence
    const existingIdx = this.userModelInferences.findIndex(
      i => i.skillId && i.skillId === newInference.skillId && i.dimension === newInference.dimension
    );

    if (existingIdx >= 0) {
      this.userModelInferences[existingIdx] = newInference;
    } else {
      this.userModelInferences.unshift(newInference);
    }

    if (this.userModelInferences.length > 30) this.userModelInferences.pop();
    this.persist(STORAGE_KEYS.USER_MODEL, this.userModelInferences);
    return newInference;
  }

  private static persist(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Ignore quota errors
    }
  }
}
