// =========================================================================
// CAREER OS - CLASSIFICATION FEEDBACK & INTELLIGENCE MEMORY SERVICE
// Lightweight structured memory for recording user corrections & weighting rules
// (Reuses CareerOS storage patterns without claiming model retraining)
// =========================================================================

export type ClassifiableAttribute = 
  | 'workMode' 
  | 'domain' 
  | 'roleCategory' 
  | 'level' 
  | 'location' 
  | 'salaryRange';

export interface ClassificationCorrectionEntry {
  id: string;
  attribute: ClassifiableAttribute;
  originalInference: string;
  userCorrection: string;
  matchedEvidence?: string;
  contextSnippet?: string;
  patternKey?: string;
  company?: string;
  timestamp: string;
}

export interface LearnedPatternRule {
  patternKey: string;
  attribute: ClassifiableAttribute;
  preferredValue: string;
  correctionCount: number;
  weightBoost: number;
  lastUpdated: string;
}

const MEMORY_STORAGE_KEY = 'career_os_classification_corrections_v1';
const RULES_STORAGE_KEY = 'career_os_classification_rules_v1';

export class ClassificationMemoryService {
  private static getCorrectionsFromStorage(): ClassificationCorrectionEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(MEMORY_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static saveCorrections(entries: ClassificationCorrectionEntry[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(entries.slice(0, 100)));
    } catch (e) {
      console.warn('Failed to save classification memory', e);
    }
  }

  private static getRulesFromStorage(): Record<string, LearnedPatternRule> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(RULES_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private static saveRules(rules: Record<string, LearnedPatternRule>): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
    } catch (e) {
      console.warn('Failed to save learned rules', e);
    }
  }

  /**
   * Derive a generalizable pattern key from the context snippet and attribute correction.
   */
  private static derivePatternKey(
    attribute: ClassifiableAttribute, 
    contextSnippet?: string, 
    company?: string
  ): string | undefined {
    if (!contextSnippet && !company) return undefined;
    const text = (contextSnippet || '').toLowerCase();

    if (attribute === 'workMode') {
      if (text.includes('work location:') || text.includes('office location:') || text.includes('dia diem lam viec')) {
        return 'has_physical_work_location_marker';
      }
      if (text.includes('remote-friendly') || text.includes('remote options')) {
        return 'remote_friendly_phrase_with_office_context';
      }
      if (text.includes('monday') && text.includes('friday')) {
        return 'weekday_office_schedule_marker';
      }
    }

    if (attribute === 'domain') {
      if (company && company.trim().length > 2) {
        return `company_domain_${company.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      }
    }

    return undefined;
  }

  /**
   * Records a user correction when a user overrides an AI-inferred field.
   * Silently updates evidence weights and pattern memory.
   */
  public static recordCorrection(params: {
    attribute: ClassifiableAttribute;
    originalInference: string;
    userCorrection: string;
    matchedEvidence?: string;
    contextSnippet?: string;
    company?: string;
  }): ClassificationCorrectionEntry | null {
    const { attribute, originalInference, userCorrection, matchedEvidence, contextSnippet, company } = params;

    // Ignore if no genuine change
    if (!userCorrection || userCorrection === originalInference) {
      return null;
    }

    const patternKey = this.derivePatternKey(attribute, contextSnippet, company);

    const newEntry: ClassificationCorrectionEntry = {
      id: `corr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      attribute,
      originalInference,
      userCorrection,
      matchedEvidence,
      contextSnippet: contextSnippet ? contextSnippet.slice(0, 200) : undefined,
      patternKey,
      company: company?.trim(),
      timestamp: new Date().toISOString(),
    };

    const current = this.getCorrectionsFromStorage();
    const updated = [newEntry, ...current];
    this.saveCorrections(updated);

    // Strengthen learned rules/weightings
    if (patternKey) {
      const rules = this.getRulesFromStorage();
      const existing = rules[patternKey];
      const count = (existing?.correctionCount || 0) + 1;
      rules[patternKey] = {
        patternKey,
        attribute,
        preferredValue: userCorrection,
        correctionCount: count,
        weightBoost: Math.min(2.5, 1.0 + count * 0.3),
        lastUpdated: new Date().toISOString(),
      };
      this.saveRules(rules);
    }

    return newEntry;
  }

  /**
   * Check if any learned rules apply to the given raw content and attribute.
   * If matched, returns the preferred value and learned boost weight.
   */
  public static getLearnedRuleMatch(params: {
    attribute: ClassifiableAttribute;
    combinedText: string;
    company?: string;
  }): { preferredValue: string; patternKey: string; weightBoost: number } | null {
    const { attribute, combinedText, company } = params;
    const rules = this.getRulesFromStorage();
    const cleanLower = combinedText.toLowerCase();

    // Check company-specific learned domain rule
    if (company) {
      const compKey = `company_domain_${company.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      if (rules[compKey] && rules[compKey].attribute === attribute) {
        return {
          preferredValue: rules[compKey].preferredValue,
          patternKey: compKey,
          weightBoost: rules[compKey].weightBoost,
        };
      }
    }

    // Check physical work location rule
    if (attribute === 'workMode') {
      if ((cleanLower.includes('work location:') || cleanLower.includes('office location:')) && rules['has_physical_work_location_marker']) {
        return {
          preferredValue: rules['has_physical_work_location_marker'].preferredValue,
          patternKey: 'has_physical_work_location_marker',
          weightBoost: rules['has_physical_work_location_marker'].weightBoost,
        };
      }
    }

    return null;
  }

  /**
   * Returns full history of corrections for inspection
   */
  public static getCorrections(): ClassificationCorrectionEntry[] {
    return this.getCorrectionsFromStorage();
  }

  /**
   * Returns map of learned rules
   */
  public static getLearnedRules(): Record<string, LearnedPatternRule> {
    return this.getRulesFromStorage();
  }
}
