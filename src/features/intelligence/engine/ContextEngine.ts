// =========================================================================
// CAREER INTELLIGENCE ENGINE - CONTEXT ENGINE
// =========================================================================

import { 
  CareerOSContextSnapshot, 
  AssembledContext, 
  CareerTaskType 
} from './types';
import { RetrievalEngine } from './RetrievalEngine';
import { MemoryEngine } from './MemoryEngine';
import { CareerSemanticParser } from '../services/careerSemanticParser';
import { CanonicalOntology } from '../services/canonicalOntology';

export class ContextEngine {
  /**
   * Builds an assembled, deduplicated, and relevance-filtered context for the agent.
   * Pipeline:
   * Intent → Entity Detection → Concept Mapping → Retrieval → Ranking → Deduplication → Relevance Filtering → Context Assembly
   */
  public static buildContext(
    taskPrompt: string,
    taskType: CareerTaskType,
    clientContext?: CareerOSContextSnapshot,
    maxRetrievedItems: number = 5
  ): AssembledContext {
    const raw = (taskPrompt || '').trim();

    // 1. Intent & Entity Detection
    const parsed = CareerSemanticParser.parseIntent(raw);

    const allMatches = [
      ...(parsed.skills || []),
      ...(parsed.knowledge || []),
      ...(parsed.industries || []),
      ...(parsed.metrics || []),
      ...(parsed.role ? [parsed.role] : []),
      ...(parsed.caseType ? [parsed.caseType] : [])
    ];

    const entitiesExtracted = allMatches.map(e => ({
      id: e.canonicalId,
      name: e.canonicalName,
      type: e.entityType,
    }));

    // 2. Concept Mapping (Multi-lingual & synonyms)
    const conceptsMapped = allMatches.map(e => ({
      raw: e.matchedAlias || e.canonicalName,
      canonicalId: e.canonicalId,
      canonicalName: e.canonicalName,
    }));

    // 3. Retrieval from Career OS Internal Stores (Cross-Language)
    const rawRetrieved = RetrievalEngine.retrieveRelevantEntities(raw, maxRetrievedItems * 2);

    // 4. Relevance Filtering & Ranking
    const filteredRetrieved = rawRetrieved
      .filter(item => item.relevanceScore >= 0.25)
      .slice(0, maxRetrievedItems)
      .map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        content: item.content,
        relevanceScore: item.relevanceScore,
        source: item.sourceUrl || `Career OS ${item.type.toUpperCase()} Catalog`,
      }));

    // 5. Inferred User Model Inferences (Strictly confidence >= 0.70)
    const userModelInferences = MemoryEngine.getUserModelInferences(0.70);

    // 6. System Instructions Assembly (Tailored to Task Type)
    const systemInstructions = this.composeSystemInstructions(
      taskType, 
      clientContext, 
      conceptsMapped.map(c => c.canonicalName)
    );

    // Rough token estimate (chars / 4)
    const contextBody = JSON.stringify({
      entitiesExtracted,
      conceptsMapped,
      filteredRetrieved,
      userModelInferences,
    });
    const tokenCountEstimate = Math.ceil((systemInstructions.length + contextBody.length) / 4);

    return {
      taskGoal: raw,
      entitiesExtracted,
      conceptsMapped,
      retrievedItems: filteredRetrieved,
      userModelInferences,
      systemInstructions,
      tokenCountEstimate,
    };
  }

  private static composeSystemInstructions(
    taskType: CareerTaskType,
    clientContext?: CareerOSContextSnapshot,
    concepts?: string[]
  ): string {
    const activeRole = clientContext?.activeApplication?.roleTitle || clientContext?.userProfile?.targetRole || 'Professional';
    const activeCompany = clientContext?.activeApplication?.companyName || 'Target Organization';

    return `You are the native Career OS Intelligence Engine.
You operate on structured career entities (Jobs, Roles, Cases, Questions, Evidence Ledger, and User Model).
Core Directives:
1. Ground answers strictly in verified evidence and Career OS canonical knowledge.
2. Maintain high domain rigor. When dealing with metrics (${concepts?.join(', ') || 'CAC, LTV, conversion'}), use precise definitions.
3. Distinguish clearly between verified candidate facts and provisional inferences.
4. Respond in the user's language (Vietnamese, English, or natural professional Vietnamese-English code-switching).
Current Focus Context: Role = ${activeRole}, Company = ${activeCompany}, Task = ${taskType}.`;
  }
}
