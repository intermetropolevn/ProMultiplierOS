// =========================================================================
// CAREER OS - MULTILINGUAL & MIXED-LANGUAGE INTELLIGENCE TYPES
// =========================================================================

export type SupportedLanguage = 'en' | 'vi' | 'mixed' | 'other';
export type TerminologyPreference = 'prefer_english' | 'prefer_vietnamese' | 'mixed_natural';
export type LanguagePreference = 'auto' | 'vi' | 'en';

export type EntityType = 
  | 'SKILL' 
  | 'KNOWLEDGE' 
  | 'INDUSTRY' 
  | 'CASE_TYPE' 
  | 'METRIC' 
  | 'ROLE' 
  | 'FRAMEWORK';

export type FactType = 
  | 'USER_FACT' 
  | 'SOURCE_FACT' 
  | 'CAREER_OS_KNOWLEDGE' 
  | 'AI_INFERENCE' 
  | 'AI_RECOMMENDATION' 
  | 'USER_HYPOTHESIS';

export interface LocalizedLabel {
  en: string[];
  vi: string[];
}

export interface CanonicalEntity {
  entityId: string;
  entityType: EntityType;
  canonicalName: string;
  labels: LocalizedLabel;
  aliases: string[];
  vietnameseAliases: string[];
  vietnameseNoDiacriticsAliases: string[];
  descriptionEn: string;
  descriptionVi: string;
  domain?: string;
  categoryTag?: string;
}

export interface AbbreviationDefinition {
  abbreviation: string;
  canonicalId: string;
  fullTitle: string;
  contextSignals: string[];
  conflictingOptions?: {
    fullTitle: string;
    canonicalId: string;
    contextSignals: string[];
  }[];
}

export interface LanguageDetectionResult {
  dominantLanguage: SupportedLanguage;
  confidence: number;
  isMixedLanguage: boolean;
  codeSwitchingDetected: boolean;
  vietnameseRatio: number;
  englishRatio: number;
  hasDiacritics: boolean;
  segments: {
    text: string;
    language: 'vi' | 'en';
    type: 'domain_term' | 'slang' | 'general';
  }[];
}

export interface ExtractedEntityMatch {
  canonicalId: string;
  entityType: EntityType;
  canonicalName: string;
  matchedText: string;
  matchedAlias: string;
  confidence: number; // 0.0 - 1.0
  isAmbiguous?: boolean;
  disambiguationOptions?: string[];
  disambiguationReason?: string;
}

export type CareerIntentType =
  | 'PREPARATION'
  | 'PRACTICE_RECOMMENDATION'
  | 'CASE_ANALYSIS'
  | 'RESEARCH'
  | 'SKILL_GAP'
  | 'JOB_SEARCH'
  | 'GENERAL_INQUIRY';

export interface ParsedCareerIntent {
  originalQuery: string;
  normalizedQuery: string;
  normalizedNoDiacritics: string;
  dominantLanguage: SupportedLanguage;
  isMixedLanguage: boolean;
  codeSwitchingDetected: boolean;
  intent: CareerIntentType;
  
  // Canonical extracted entities
  role?: ExtractedEntityMatch;
  caseType?: ExtractedEntityMatch;
  skills: ExtractedEntityMatch[];
  knowledge: ExtractedEntityMatch[];
  industries: ExtractedEntityMatch[];
  geographies: string[];
  metrics: ExtractedEntityMatch[];
  
  // Separation of facts vs hypotheses
  userHypotheses: string[];
  userFacts: string[];
  
  // Ambiguities and clarifications
  ambiguities: {
    term: string;
    resolvedTo: string;
    confidence: number;
    alternatives: string[];
    reason: string;
  }[];
  
  // User specific requests
  requestedDeliverables: ('RESEARCH' | 'FRAMEWORKS' | 'KNOWLEDGE' | 'CASES' | 'PRACTICE' | 'DATA')[];
}

export interface MultilingualRetrievalResult {
  id: string;
  sourceEntityId: string;
  sourceEntityType: string;
  title: string;
  localizedTitle?: { en: string; vi: string };
  subtitle?: string;
  relevanceScore: number;
  relevanceReason: string;
  localizedReason?: { en: string; vi: string };
  intelligenceType: 'Skills' | 'Knowledge' | 'Industry Data' | 'Industry Intelligence' | 'Similar Cases' | 'Resources';
  categoryTag?: string;
  canonicalEntities: string[];
  inputLanguage: SupportedLanguage;
  sourceLanguage: SupportedLanguage;
  factType: FactType;
  confidence: number;
}

export interface AuditScenarioResult {
  id: string;
  title: string;
  input: string;
  passed: boolean;
  detectedLanguage: SupportedLanguage;
  isMixed: boolean;
  extractedRole?: string;
  extractedCaseType?: string;
  extractedSkills: string[];
  extractedKnowledge: string[];
  extractedGeographies: string[];
  extractedHypotheses: string[];
  details: string;
}
