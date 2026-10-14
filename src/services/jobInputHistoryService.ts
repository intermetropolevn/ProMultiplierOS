export interface JobHistoryEntry {
  value: string;
  usageCount: number;
  lastUsedAt: string;
  metadata?: {
    relatedDomain?: string;
    relatedLocation?: string;
  };
}

export type JobHistoryField = 
  | 'company'
  | 'title'
  | 'location'
  | 'salaryRange'
  | 'requiredSkills'
  | 'customIndustryDomain'
  | 'customPlatform'
  | 'description';

const STORAGE_KEY = 'career_os_job_form_history_v1';

export class JobInputHistoryService {
  private static getHistory(): Record<string, JobHistoryEntry[]> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private static saveHistory(data: Record<string, JobHistoryEntry[]>): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to persist job input history', e);
    }
  }

  /**
   * Save successful Job Opportunity input values into field-scoped history.
   * Only called AFTER job creation or update succeeds.
   */
  public static recordJobSaved(params: {
    company?: string;
    title?: string;
    location?: string;
    salaryRange?: string;
    requiredSkills?: string[];
    customIndustryDomain?: string;
    customPlatform?: string;
    domain?: string;
  }): void {
    const history = this.getHistory();

    const recordValue = (field: JobHistoryField, val?: string, metadata?: { relatedDomain?: string; relatedLocation?: string }) => {
      if (!val || !val.trim()) return;
      const cleanVal = val.trim();
      // Enforce sanity & security (no excessively long or sensitive strings)
      if (cleanVal.length < 2 || cleanVal.length > 250) return;

      if (!history[field]) {
        history[field] = [];
      }

      const existingIndex = history[field].findIndex(
        item => item.value.toLowerCase() === cleanVal.toLowerCase()
      );

      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        history[field][existingIndex].usageCount += 1;
        history[field][existingIndex].lastUsedAt = now;
        if (metadata) {
          history[field][existingIndex].metadata = {
            ...history[field][existingIndex].metadata,
            ...metadata
          };
        }
      } else {
        history[field].unshift({
          value: cleanVal,
          usageCount: 1,
          lastUsedAt: now,
          metadata
        });
      }

      // Limit each field to 100 historical entries
      if (history[field].length > 100) {
        history[field] = history[field].slice(0, 100);
      }
    };

    if (params.company) {
      recordValue('company', params.company, {
        relatedDomain: params.domain,
        relatedLocation: params.location
      });
    }

    if (params.title) recordValue('title', params.title);
    if (params.location) recordValue('location', params.location);
    if (params.salaryRange) recordValue('salaryRange', params.salaryRange);
    if (params.customIndustryDomain) recordValue('customIndustryDomain', params.customIndustryDomain);
    if (params.customPlatform) recordValue('customPlatform', params.customPlatform);

    if (params.requiredSkills && Array.isArray(params.requiredSkills)) {
      params.requiredSkills.forEach(skill => {
        if (skill && skill.trim()) {
          recordValue('requiredSkills', skill.trim());
        }
      });
    }

    this.saveHistory(history);
  }

  /**
   * Search suggestions for a specific field when input has at least 3 characters.
   * Ranked:
   * 1. Exact match
   * 2. Prefix match
   * 3. Contains match
   * 4. Most recently used
   * Maximum 5 results.
   */
  public static getSuggestions(field: JobHistoryField, query: string, maxResults: number = 5): JobHistoryEntry[] {
    const trimmed = (query || '').trim().toLowerCase();
    if (trimmed.length < 3) return [];

    const history = this.getHistory();
    const entries = history[field] || [];

    const matches = entries.filter(e => e.value.toLowerCase().includes(trimmed));

    matches.sort((a, b) => {
      const aVal = a.value.toLowerCase();
      const bVal = b.value.toLowerCase();

      const aExact = aVal === trimmed;
      const bExact = bVal === trimmed;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aPrefix = aVal.startsWith(trimmed);
      const bPrefix = bVal.startsWith(trimmed);
      if (aPrefix && !bPrefix) return -1;
      if (!aPrefix && bPrefix) return 1;

      // Sort by lastUsedAt descending
      return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
    });

    return matches.slice(0, maxResults);
  }

  /**
   * Look up previously remembered metadata for a company (e.g. domain, location)
   */
  public static getCompanyMetadata(companyName: string): { relatedDomain?: string; relatedLocation?: string } | null {
    if (!companyName || !companyName.trim()) return null;
    const history = this.getHistory();
    const entries = history['company'] || [];
    const entry = entries.find(e => e.value.toLowerCase() === companyName.trim().toLowerCase());
    return entry?.metadata || null;
  }
}
