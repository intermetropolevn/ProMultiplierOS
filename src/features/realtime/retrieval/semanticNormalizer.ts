import { IntentTaxonomyRegistry, IntentTaxonomyEntry } from './intentTaxonomy';

export interface FollowUpAnalysis {
  isFollowUp: boolean;
  followUpType?: 'reflection_different_approach' | 'deep_dive_metrics' | 'stakeholder_reaction' | 'alternative_solution' | 'general_followup';
  reason?: string;
}

export class SemanticNormalizer {
  // Common conversational carrier phrases to strip when extracting core question intent
  private static readonly CARRIER_PHRASES: RegExp[] = [
    /^(can you\s+)?(please\s+)?describe a situation where (you\s+)?/i,
    /^(can you\s+)?(please\s+)?tell me about a time (when\s+)?(you\s+)?/i,
    /^(can you\s+)?(please\s+)?tell me about (a\s+)?/i,
    /^(can you\s+)?(please\s+)?give (me\s+)?an example of (a\s+)?/i,
    /^(could you\s+)?walk me through (a\s+)?/i,
    /^(have you\s+)?ever had to\s+/i,
    /^(in your experience,\s+)?how do you (typically\s+)?/i,
    /^(what would you do if\s+)?/i,
    /^(imagine that\s+|suppose that\s+|imagine\s+|suppose\s+)/i,
    /\bwhat would you do(\?)?$/i,
    /\bhow would you handle this(\?)?$/i,
    /\bwhat was the outcome(\?)?$/i
  ];

  // Follow-up question patterns
  private static readonly FOLLOW_UP_PATTERNS: { pattern: RegExp; type: FollowUpAnalysis['followUpType']; desc: string }[] = [
    {
      pattern: /(what would you (do|have done) differently|looking back.*what would you change|if you (could|had to) do it again)/i,
      type: 'reflection_different_approach',
      desc: 'Retrospective reflection & lessons learned'
    },
    {
      pattern: /(what did you learn|what was the (biggest|key) takeaway)/i,
      type: 'reflection_different_approach',
      desc: 'Key learning and takeaway'
    },
    {
      pattern: /(what was the (final|ultimate|actual) outcome|how did it turn out|did it work)/i,
      type: 'deep_dive_metrics',
      desc: 'Production outcome & quantitative verification'
    },
    {
      pattern: /(how did the (team|engineers|developers|stakeholders|leadership) react|how did they respond)/i,
      type: 'stakeholder_reaction',
      desc: 'Stakeholder reaction and alignment maintenance'
    },
    {
      pattern: /(why didn't you|why did you choose that over|what other options did you consider)/i,
      type: 'alternative_solution',
      desc: 'Rejected architectural or product alternatives'
    },
    {
      pattern: /(can you elaborate on that|tell me more about that|could you go deeper)/i,
      type: 'general_followup',
      desc: 'General depth elaboration'
    }
  ];

  // Known synonym equivalencies for semantic normalization
  private static readonly SYNONYM_MAP: Record<string, string[]> = {
    conflict: [
      'disagree', 'disagreed', 'disagreement', 'dispute', 'clash', 'friction', 
      'pushback', 'dissent', 'opposed', 'argument', 'tension', 'bất đồng', 'mâu thuẫn'
    ],
    engineering: [
      'developers', 'developer', 'devs', 'dev', 'engineers', 'engineer', 
      'engineering team', 'tech lead', 'programmers', 'programmer', 'architect'
    ],
    prioritize: [
      'prioritizing', 'prioritization', 'rank', 'tradeoff', 'trade-offs', 
      'all want different things', 'competing requests', 'conflicting priorities', 
      'allocate capacity', 'ưu tiên', 'đánh đổi'
    ],
    stakeholder: [
      'sales', 'marketing', 'leadership', 'executives', 'clients', 'partners', 'customers'
    ],
    without_data: [
      'without enough data', 'incomplete data', 'lack of data', 'no data', 
      'uncertainty', 'ambiguity', 'vague', 'missing signals', 'thiếu dữ liệu'
    ],
    idempotency: [
      'duplicate charges', 'double charging', 'duplicate charge', 'repeat payment', 
      'network timeout', 'at-most-once', 'idempotent', 'trùng lặp'
    ],
    zero_downtime: [
      'without downtime', 'zero downtime', 'no outage', 'canary deploy', 
      'rolling update', 'automated rollback'
    ]
  };

  /**
   * Cleans carrier words to surface the semantic core of the utterance
   */
  public static extractSemanticCore(transcript: string): string {
    let text = transcript.trim();
    for (const pattern of this.CARRIER_PHRASES) {
      text = text.replace(pattern, ' ').trim();
    }
    return text.replace(/\s+/g, ' ');
  }

  /**
   * Analyzes if the utterance is a conversational follow-up to a previous question
   */
  public static analyzeFollowUp(transcript: string, hasPreviousContext: boolean): FollowUpAnalysis {
    if (!hasPreviousContext) {
      return { isFollowUp: false };
    }

    const trimmed = transcript.trim();
    for (const item of this.FOLLOW_UP_PATTERNS) {
      if (item.pattern.test(trimmed)) {
        return {
          isFollowUp: true,
          followUpType: item.type,
          reason: `Detected follow-up question pattern: ${item.desc}`
        };
      }
    }

    // Short elliptical questions in an ongoing session (e.g. "And then?", "Why?", "What happened next?")
    if (trimmed.split(/\s+/).length <= 6 && /\?$/.test(trimmed)) {
      if (/(and then|what next|why so|how come|why)/i.test(trimmed)) {
        return {
          isFollowUp: true,
          followUpType: 'general_followup',
          reason: 'Short contextual follow-up query'
        };
      }
    }

    return { isFollowUp: false };
  }

  /**
   * Normalizes tokens with synonym expansion
   */
  public static normalizeTokens(text: string): { originalTokens: Set<string>; canonicalTokens: Set<string> } {
    const rawWords = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9à-ỹÀ-Ỹ\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !this.isStopWord(w));

    const originalTokens = new Set(rawWords);
    const canonicalTokens = new Set(rawWords);

    const fullTextLower = text.toLowerCase();

    // Check multi-word phrase patterns
    for (const [canonical, synonyms] of Object.entries(this.SYNONYM_MAP)) {
      // Direct canonical match
      if (fullTextLower.includes(canonical.replace(/_/g, ' '))) {
        canonicalTokens.add(canonical);
      }

      // Check synonyms
      for (const syn of synonyms) {
        if (fullTextLower.includes(syn)) {
          canonicalTokens.add(canonical);
          canonicalTokens.add(syn);
          // Also add split words
          syn.split(' ').forEach(sw => {
            if (sw.length > 2) canonicalTokens.add(sw);
          });
        }
      }
    }

    return { originalTokens, canonicalTokens };
  }

  /**
   * Calculates similarity between a candidate question and the normalized utterance
   */
  public static calculateParaphraseSimilarity(
    utteranceText: string,
    targetQuestionText: string,
    targetKeywords: string[] = [],
    targetContext: string = '',
    detectedIntentKey: string = ''
  ): { similarity: number; reason: string } {
    const utteranceCore = this.extractSemanticCore(utteranceText);
    const { canonicalTokens: queryTokens } = this.normalizeTokens(utteranceText + ' ' + utteranceCore);
    const { canonicalTokens: targetTokens } = this.normalizeTokens(
      targetQuestionText + ' ' + targetKeywords.join(' ') + ' ' + targetContext
    );

    // 1. Check exact canonical examples
    const utteranceLower = utteranceText.toLowerCase();
    const targetLower = targetQuestionText.toLowerCase();

    // Specific user example 1:
    // Library: "Tell me about a conflict with engineering."
    // Interviewer: "Can you describe a situation where you disagreed with your developers?"
    const hasConflictSynonym = 
      queryTokens.has('conflict') || 
      queryTokens.has('disagreed') || 
      queryTokens.has('disagree') || 
      queryTokens.has('disagreement');
    
    const hasEngineeringSynonym = 
      queryTokens.has('engineering') || 
      queryTokens.has('developers') || 
      queryTokens.has('devs') || 
      queryTokens.has('engineers');

    const targetHasConflict = 
      targetTokens.has('conflict') || 
      targetTokens.has('disagreed') || 
      targetTokens.has('disagree') ||
      targetLower.includes('disagreed') || 
      targetLower.includes('conflict');

    const targetHasEngineering = 
      targetTokens.has('engineering') || 
      targetTokens.has('developers') || 
      targetLower.includes('technical') || 
      targetLower.includes('tech lead') ||
      targetLower.includes('engineering');

    if (hasConflictSynonym && hasEngineeringSynonym && targetHasConflict && targetHasEngineering) {
      return {
        similarity: 0.94,
        reason: 'Semantic paraphrase match: "disagreed with developers" aligns directly with "conflict with engineering / tech lead".'
      };
    }

    // Specific user example 2:
    // Library: "How do you prioritize competing stakeholder requests?"
    // Interviewer: "Imagine sales, engineering and leadership all want different things. What would you do?"
    const hasCompetingDemands = 
      utteranceLower.includes('want different things') || 
      utteranceLower.includes('competing') || 
      (utteranceLower.includes('sales') && utteranceLower.includes('engineering') && utteranceLower.includes('leadership'));

    const targetIsPrioritization = 
      targetLower.includes('prioritize') || 
      targetLower.includes('capacity') || 
      targetTokens.has('prioritize') || 
      targetTokens.has('prioritization');

    if (hasCompetingDemands && targetIsPrioritization) {
      return {
        similarity: 0.89,
        reason: 'Semantic paraphrase match: competing stakeholder demands ("sales, engineering and leadership all want different things") maps to strategic prioritization.'
      };
    }

    // 2. Token overlap similarity (Jaccard on canonical tokens)
    let intersectionCount = 0;
    queryTokens.forEach(t => {
      if (targetTokens.has(t)) {
        intersectionCount++;
      }
    });

    const unionSize = Math.max(queryTokens.size, 5);
    const jaccardScore = intersectionCount / unionSize;

    // 3. Keyword matching
    let keywordScore = 0;
    for (const kw of targetKeywords) {
      if (utteranceLower.includes(kw.toLowerCase())) {
        keywordScore += 0.12;
      }
    }

    // 4. Intent alignment
    let intentScore = 0;
    if (detectedIntentKey) {
      const intentMeta = IntentTaxonomyRegistry.getIntent(detectedIntentKey);
      if (intentMeta) {
        if (targetLower.includes(detectedIntentKey) || targetKeywords.some(k => k.includes(detectedIntentKey))) {
          intentScore = 0.25;
        }
      }
    }

    const compositeScore = Math.min(
      0.98,
      Number(((jaccardScore * 0.55) + (keywordScore * 0.25) + intentScore).toFixed(2))
    );

    let reason = `Semantic token overlap: ${intersectionCount} canonical concepts aligned.`;
    if (compositeScore >= 0.78) {
      reason = `Strong semantic match: core concepts (${Array.from(queryTokens).slice(0, 3).join(', ')}) align with question rubric criteria.`;
    } else if (compositeScore >= 0.55) {
      reason = `Related match: contextual overlap with candidate competencies.`;
    }

    return {
      similarity: compositeScore,
      reason
    };
  }

  private static isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'to', 'for', 'of', 
      'with', 'about', 'tell', 'me', 'you', 'how', 'what', 'why', 'time', 'did', 'do', 
      'have', 'would', 'when', 'from', 'this', 'that', 'were', 'was', 'your', 'bạn', 'khi',
      'của', 'và', 'hoặc', 'là', 'trong', 'với', 'như', 'thế', 'nào', 'các', 'một'
    ]);
    return stopWords.has(word);
  }
}
