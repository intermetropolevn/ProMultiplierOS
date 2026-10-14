// =========================================================================
// CAREER OS - MULTILINGUAL CAREER SEMANTIC PARSER & ENTITY RESOLVER
// =========================================================================

import { 
  ParsedCareerIntent, 
  ExtractedEntityMatch, 
  CareerIntentType, 
  EntityType 
} from '../types';
import { VietnameseNormalizer } from './vietnameseNormalizer';
import { LanguageDetector } from './languageDetector';
import { 
  CANONICAL_ONTOLOGY_ENTITIES, 
  CAREER_ABBREVIATIONS 
} from './canonicalOntology';

export class CareerSemanticParser {
  /**
   * Alias for parse
   */
  static parseIntent(query: string): ParsedCareerIntent {
    return this.parse(query);
  }

  /**
   * Parses arbitrary user prompt or query (in VN, EN, or mixed language)
   * into a language-independent structured intent representation.
   */
  static parse(query: string): ParsedCareerIntent {
    const rawText = query || '';
    const langResult = LanguageDetector.detect(rawText);
    const normalizedQuery = VietnameseNormalizer.clean(rawText);
    const normalizedNoDiacritics = VietnameseNormalizer.toSearchKey(rawText);
    const slangNormalized = VietnameseNormalizer.normalizeCareerSlang(rawText);
    const slangNoDiacritics = VietnameseNormalizer.toSearchKey(slangNormalized);

    // 1. Resolve Abbreviations & Context Disambiguation
    const { abbreviationsResolved, ambiguities } = this.resolveAbbreviations(
      rawText, 
      normalizedNoDiacritics
    );

    // 2. Extract Entities from Ontology
    const extractedEntities = this.extractEntities(
      rawText, 
      normalizedQuery, 
      normalizedNoDiacritics, 
      slangNoDiacritics,
      abbreviationsResolved
    );

    // 3. Classify High-Level Intent
    const intent = this.classifyIntent(
      rawText, 
      normalizedNoDiacritics, 
      extractedEntities
    );

    // 4. Extract Geographies
    const geographies = this.extractGeographies(rawText, normalizedNoDiacritics);

    // 5. Separate Hypotheses vs Facts
    const { userHypotheses, userFacts } = this.extractHypothesesAndFacts(rawText);

    // 6. Extract Requested Deliverables
    const requestedDeliverables = this.extractDeliverables(rawText, normalizedNoDiacritics);

    // 7. Group entities by category
    const skills = extractedEntities.filter(e => e.entityType === 'SKILL');
    const knowledge = extractedEntities.filter(e => e.entityType === 'KNOWLEDGE');
    const industries = extractedEntities.filter(e => e.entityType === 'INDUSTRY');
    const metrics = extractedEntities.filter(e => e.entityType === 'METRIC');
    const caseType = extractedEntities.find(e => e.entityType === 'CASE_TYPE');
    const role = extractedEntities.find(e => e.entityType === 'ROLE');

    return {
      originalQuery: rawText,
      normalizedQuery,
      normalizedNoDiacritics,
      dominantLanguage: langResult.dominantLanguage,
      isMixedLanguage: langResult.isMixedLanguage,
      codeSwitchingDetected: langResult.codeSwitchingDetected,
      intent,
      role,
      caseType,
      skills,
      knowledge,
      industries,
      geographies,
      metrics,
      userHypotheses,
      userFacts,
      ambiguities,
      requestedDeliverables
    };
  }

  /**
   * Detects and disambiguates abbreviations such as 'PM' based on surrounding lexical context
   */
  private static resolveAbbreviations(
    originalText: string,
    noDiacriticsText: string
  ): {
    abbreviationsResolved: ExtractedEntityMatch[];
    ambiguities: {
      term: string;
      resolvedTo: string;
      confidence: number;
      alternatives: string[];
      reason: string;
    }[];
  } {
    const resolved: ExtractedEntityMatch[] = [];
    const ambiguities: {
      term: string;
      resolvedTo: string;
      confidence: number;
      alternatives: string[];
      reason: string;
    }[] = [];

    const words = originalText.split(/[\s,./?!;:]+/).filter(Boolean);

    Object.entries(CAREER_ABBREVIATIONS).forEach(([abbr, def]) => {
      // Word boundary check (case-sensitive or uppercase abbreviation match)
      const exactRegex = new RegExp(`\\b${abbr}\\b`, 'i');
      if (exactRegex.test(originalText)) {
        let selectedId = def.canonicalId;
        let selectedTitle = def.fullTitle;
        let confidence = 0.85;
        let reason = `Direct abbreviation match for ${abbr} (${def.fullTitle})`;

        // Check if there are conflicting options (e.g. PM -> Product Manager vs Project Manager)
        if (def.conflictingOptions && def.conflictingOptions.length > 0) {
          const defaultSignalsMatch = def.contextSignals.filter(sig => 
            noDiacriticsText.includes(sig) || originalText.toLowerCase().includes(sig)
          ).length;

          let bestAlt = null;
          let bestAltMatches = 0;

          def.conflictingOptions.forEach(alt => {
            const matches = alt.contextSignals.filter(sig => 
              noDiacriticsText.includes(sig) || originalText.toLowerCase().includes(sig)
            ).length;
            if (matches > bestAltMatches) {
              bestAltMatches = matches;
              bestAlt = alt;
            }
          });

          if (bestAltMatches > defaultSignalsMatch) {
            selectedId = bestAlt!.canonicalId;
            selectedTitle = bestAlt!.fullTitle;
            confidence = 0.92;
            reason = `Context signals (${bestAlt!.contextSignals.slice(0, 3).join(', ')}) disambiguated ${abbr} as ${bestAlt!.fullTitle}`;
          } else if (defaultSignalsMatch > 0) {
            confidence = 0.94;
            reason = `Context signals (${def.contextSignals.slice(0, 3).join(', ')}) disambiguated ${abbr} as ${def.fullTitle}`;
          } else {
            // Default to Product Manager in Career OS context with slight uncertainty
            confidence = 0.78;
            reason = `Surrounding context neutral; default disambiguation to ${def.fullTitle}`;
          }

          ambiguities.push({
            term: abbr,
            resolvedTo: selectedTitle,
            confidence,
            alternatives: [def.fullTitle, ...def.conflictingOptions.map(o => o.fullTitle)],
            reason
          });
        }

        const matchedEntity = CANONICAL_ONTOLOGY_ENTITIES.find(e => e.entityId === selectedId);
        if (matchedEntity) {
          resolved.push({
            canonicalId: matchedEntity.entityId,
            entityType: matchedEntity.entityType,
            canonicalName: matchedEntity.canonicalName,
            matchedText: abbr,
            matchedAlias: abbr,
            confidence,
            disambiguationReason: reason
          });
        }
      }
    });

    return { abbreviationsResolved: resolved, ambiguities };
  }

  /**
   * Extracts canonical entities across English, Vietnamese, and no-diacritics aliases
   */
  private static extractEntities(
    rawText: string,
    cleanText: string,
    noDiacritics: string,
    slangNoDiacritics: string,
    preResolved: ExtractedEntityMatch[]
  ): ExtractedEntityMatch[] {
    const results: Map<string, ExtractedEntityMatch> = new Map();

    // Add pre-resolved abbreviations
    preResolved.forEach(e => results.set(e.canonicalId, e));

    CANONICAL_ONTOLOGY_ENTITIES.forEach(entity => {
      // 1. Check English aliases
      for (const alias of entity.aliases) {
        const regex = new RegExp(`\\b${this.escapeRegExp(alias)}\\b`, 'i');
        if (regex.test(cleanText) || regex.test(rawText)) {
          if (!results.has(entity.entityId) || results.get(entity.entityId)!.confidence < 0.95) {
            results.set(entity.entityId, {
              canonicalId: entity.entityId,
              entityType: entity.entityType,
              canonicalName: entity.canonicalName,
              matchedText: alias,
              matchedAlias: alias,
              confidence: 0.96
            });
            break;
          }
        }
      }

      // 2. Check Vietnamese diacritic aliases
      for (const alias of entity.vietnameseAliases) {
        const cleanAlias = VietnameseNormalizer.clean(alias);
        if (cleanText.includes(cleanAlias) || rawText.toLowerCase().includes(alias.toLowerCase())) {
          if (!results.has(entity.entityId) || results.get(entity.entityId)!.confidence < 0.98) {
            results.set(entity.entityId, {
              canonicalId: entity.entityId,
              entityType: entity.entityType,
              canonicalName: entity.canonicalName,
              matchedText: alias,
              matchedAlias: alias,
              confidence: 0.98
            });
            break;
          }
        }
      }

      // 3. Check Vietnamese no-diacritics aliases
      for (const alias of entity.vietnameseNoDiacriticsAliases) {
        const cleanNoDia = VietnameseNormalizer.toSearchKey(alias);
        if (noDiacritics.includes(cleanNoDia) || slangNoDiacritics.includes(cleanNoDia)) {
          if (!results.has(entity.entityId) || results.get(entity.entityId)!.confidence < 0.92) {
            results.set(entity.entityId, {
              canonicalId: entity.entityId,
              entityType: entity.entityType,
              canonicalName: entity.canonicalName,
              matchedText: alias,
              matchedAlias: alias,
              confidence: 0.92
            });
            break;
          }
        }
      }
    });

    // Special contextual inference for compound phrases
    if (
      (noDiacritics.includes('uoc luong') || noDiacritics.includes('quy mo thi truong') || noDiacritics.includes('market size')) &&
      !results.has('skill_market_sizing')
    ) {
      const entity = CANONICAL_ONTOLOGY_ENTITIES.find(e => e.entityId === 'skill_market_sizing')!;
      results.set(entity.entityId, {
        canonicalId: entity.entityId,
        entityType: entity.entityType,
        canonicalName: entity.canonicalName,
        matchedText: 'quy mô thị trường',
        matchedAlias: 'ước lượng quy mô thị trường',
        confidence: 0.94
      });
    }

    if (
      (noDiacritics.includes('doi thu') || noDiacritics.includes('canh tranh') || cleanText.includes('competitor')) &&
      !results.has('skill_competitive_analysis')
    ) {
      const entity = CANONICAL_ONTOLOGY_ENTITIES.find(e => e.entityId === 'skill_competitive_analysis')!;
      results.set(entity.entityId, {
        canonicalId: entity.entityId,
        entityType: entity.entityType,
        canonicalName: entity.canonicalName,
        matchedText: 'đối thủ cạnh tranh',
        matchedAlias: 'phân tích đối thủ',
        confidence: 0.93
      });
    }

    if (
      (noDiacritics.includes('kinh te don vi') || cleanText.includes('unit economics') || cleanText.includes('economics')) &&
      !results.has('skill_unit_economics')
    ) {
      const entity = CANONICAL_ONTOLOGY_ENTITIES.find(e => e.entityId === 'skill_unit_economics')!;
      results.set(entity.entityId, {
        canonicalId: entity.entityId,
        entityType: entity.entityType,
        canonicalName: entity.canonicalName,
        matchedText: 'economics',
        matchedAlias: 'unit economics',
        confidence: 0.95
      });
    }

    return Array.from(results.values());
  }

  /**
   * Determines user intent
   */
  private static classifyIntent(
    rawText: string,
    noDiacritics: string,
    extractedEntities: ExtractedEntityMatch[]
  ): CareerIntentType {
    const textLower = rawText.toLowerCase();

    // Practice recommendation intent
    if (
      textLower.includes('luyện') || textLower.includes('practice') || 
      noDiacritics.includes('luyen') || noDiacritics.includes('on lai') ||
      noDiacritics.includes('on tap') || textLower.includes('gợi ý case') ||
      textLower.includes('suggest case')
    ) {
      return 'PRACTICE_RECOMMENDATION';
    }

    // Research intent
    if (
      textLower.includes('research') || noDiacritics.includes('tim hieu') ||
      noDiacritics.includes('nghien cuu') || textLower.includes('báo cáo') ||
      textLower.includes('industry data') || textLower.includes('market data')
    ) {
      return 'RESEARCH';
    }

    // Preparation intent
    if (
      textLower.includes('apply') || noDiacritics.includes('dang apply') ||
      textLower.includes('take-home') || textLower.includes('take home') ||
      textLower.includes('phỏng vấn') || textLower.includes('interview') ||
      textLower.includes('chuẩn bị') || noDiacritics.includes('chuan bi')
    ) {
      return 'PREPARATION';
    }

    // Case analysis intent
    if (
      extractedEntities.some(e => e.entityType === 'CASE_TYPE') ||
      textLower.includes('case prompt') || textLower.includes('bài toán') ||
      textLower.includes('khung phân tích') || textLower.includes('giải bài')
    ) {
      return 'CASE_ANALYSIS';
    }

    // Skill gap intent
    if (
      textLower.includes('skill gap') || textLower.includes('thiếu kỹ năng') ||
      textLower.includes('cần học') || noDiacritics.includes('yeu cau ky nang')
    ) {
      return 'SKILL_GAP';
    }

    return 'GENERAL_INQUIRY';
  }

  /**
   * Extracts targeted geographies
   */
  private static extractGeographies(rawText: string, noDiacritics: string): string[] {
    const geos: string[] = [];
    const textLower = rawText.toLowerCase();

    const geoMap: Record<string, string[]> = {
      'Indonesia': ['indonesia', 'indo', 'jakarta'],
      'Vietnam': ['vietnam', 'việt nam', 'vn', 'hanoi', 'ho chi minh', 'hcm'],
      'Singapore': ['singapore', 'sg'],
      'Southeast Asia': ['southeast asia', 'đông nam á', 'dong nam a', 'sea', 'asean'],
      'United States': ['united states', 'usa', 'us', 'mỹ'],
      'Europe': ['europe', 'châu âu', 'eu']
    };

    Object.entries(geoMap).forEach(([geo, keywords]) => {
      if (keywords.some(kw => textLower.includes(kw) || noDiacritics.includes(kw))) {
        geos.push(geo);
      }
    });

    return geos;
  }

  /**
   * Distinguishes user hypotheses from factual inputs
   * Examples: "mình nghĩ bottleneck chính lại nằm ở economics", "I hypothesize that..."
   */
  private static extractHypothesesAndFacts(rawText: string): {
    userHypotheses: string[];
    userFacts: string[];
  } {
    const userHypotheses: string[] = [];
    const userFacts: string[] = [];

    // Split into sentences or clauses
    const sentences = rawText.split(/[.\n;]+/).map(s => s.trim()).filter(Boolean);

    const hypothesisTriggers = [
      'mình nghĩ', 'minh nghi', 'tôi nghĩ', 'toi nghi', 'cho rằng', 'cho rang',
      'giả thuyết', 'gia thuyet', 'bottleneck chính lại nằm ở', 'bottleneck chinh lai nam o',
      'chứ không phải', 'chu khong phai', 'có thể do', 'co the do', 'nghi ngờ',
      'i think', 'hypothesis', 'hypothesize', 'suspect that', 'might be',
      'seems to be', 'assuming that', 'my hypothesis is'
    ];

    sentences.forEach(sentence => {
      const sentLower = sentence.toLowerCase();
      const sentNoDia = VietnameseNormalizer.toSearchKey(sentence);

      const isHypothesis = hypothesisTriggers.some(trigger => 
        sentLower.includes(trigger) || sentNoDia.includes(trigger)
      );

      if (isHypothesis) {
        userHypotheses.push(sentence);
      } else if (sentence.length > 8) {
        userFacts.push(sentence);
      }
    });

    return { userHypotheses, userFacts };
  }

  /**
   * Detects requested deliverables
   */
  private static extractDeliverables(
    rawText: string, 
    noDiacritics: string
  ): ('RESEARCH' | 'FRAMEWORKS' | 'KNOWLEDGE' | 'CASES' | 'PRACTICE' | 'DATA')[] {
    const deliverables: Set<'RESEARCH' | 'FRAMEWORKS' | 'KNOWLEDGE' | 'CASES' | 'PRACTICE' | 'DATA'> = new Set();
    const textLower = rawText.toLowerCase();

    if (textLower.includes('research') || noDiacritics.includes('nghien cuu') || textLower.includes('báo cáo')) {
      deliverables.add('RESEARCH');
    }
    if (textLower.includes('framework') || textLower.includes('khung') || textLower.includes('cấu trúc')) {
      deliverables.add('FRAMEWORKS');
    }
    if (textLower.includes('knowledge') || textLower.includes('kiến thức') || textLower.includes('lý thuyết')) {
      deliverables.add('KNOWLEDGE');
    }
    if (textLower.includes('case') || textLower.includes('bài tập') || textLower.includes('tình huống')) {
      deliverables.add('CASES');
    }
    if (textLower.includes('luyện') || textLower.includes('practice') || textLower.includes('ôn')) {
      deliverables.add('PRACTICE');
    }
    if (textLower.includes('data') || textLower.includes('số liệu') || textLower.includes('chỉ số')) {
      deliverables.add('DATA');
    }

    return Array.from(deliverables);
  }

  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
