import {
  Industry,
  IndustryReport,
  IndustryDataPoint,
  IndustryIntelligence,
  CaseStudy,
  CaseExhibit,
  CaseQuestion,
  ImportValidationResult,
  CaseDifficultyLevel,
  CaseTypeCategory
} from '../types';
import {
  SEED_INDUSTRIES,
  SEED_REPORTS,
  SEED_DATA_POINTS,
  SEED_INTELLIGENCE,
  SEED_CASE_STUDIES,
  SEED_EXHIBITS,
  SEED_QUESTIONS
} from '../../../data/industryData';
import { DataNormalizer } from './dataNormalizer';
import { crawlerStore } from '../../admin/services/crawlerEngine';

const STORAGE_KEY = 'career_os_industry_store_v1';

class IndustryStore {
  private industries: Industry[] = [...SEED_INDUSTRIES];
  private reports: IndustryReport[] = [...SEED_REPORTS];
  private dataPoints: IndustryDataPoint[] = [...SEED_DATA_POINTS];
  private intelligence: IndustryIntelligence[] = [...SEED_INTELLIGENCE];
  private caseStudies: CaseStudy[] = [...SEED_CASE_STUDIES];
  private exhibits: CaseExhibit[] = [...SEED_EXHIBITS];
  private questions: CaseQuestion[] = [...SEED_QUESTIONS];

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const payload = {
          industries: this.industries,
          reports: this.reports,
          dataPoints: this.dataPoints,
          intelligence: this.intelligence,
          caseStudies: this.caseStudies,
          exhibits: this.exhibits,
          questions: this.questions
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch {
      // Ignore localStorage errors in restricted environments
    }
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.industries && parsed.industries.length > 0) this.industries = parsed.industries;
          if (parsed.reports && parsed.reports.length > 0) this.reports = parsed.reports;
          if (parsed.dataPoints && parsed.dataPoints.length > 0) this.dataPoints = parsed.dataPoints;
          if (parsed.intelligence && parsed.intelligence.length > 0) this.intelligence = parsed.intelligence;
          if (parsed.caseStudies && parsed.caseStudies.length > 0) this.caseStudies = parsed.caseStudies;
          if (parsed.exhibits && parsed.exhibits.length > 0) this.exhibits = parsed.exhibits;
          if (parsed.questions && parsed.questions.length > 0) this.questions = parsed.questions;
        }
      }
    } catch {
      // Fallback to seed data
    }
  }

  // =========================================================================
  // INDUSTRIES
  // =========================================================================

  getIndustries(): Industry[] {
    return [...this.industries];
  }

  getIndustryById(id: string): Industry | undefined {
    return this.industries.find(i => i.id === id);
  }

  saveIndustry(industry: Industry): Industry {
    const idx = this.industries.findIndex(i => i.id === industry.id);
    if (idx >= 0) {
      this.industries[idx] = { ...industry, updatedAt: new Date().toISOString() };
    } else {
      this.industries.unshift({
        ...industry,
        createdAt: industry.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    this.saveToStorage();

    // Audit log
    crawlerStore.addAuditLog({
      actorId: 'admin-lead',
      actorUsername: 'admin_lead',
      action: 'UPDATE_INDUSTRY' as any,
      result: 'SUCCESS',
      details: `Configured industry "${industry.name}" (${industry.id})`
    });

    return industry;
  }

  deleteIndustry(id: string): boolean {
    const prevLen = this.industries.length;
    this.industries = this.industries.filter(i => i.id !== id);
    if (this.industries.length !== prevLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // =========================================================================
  // REPORTS
  // =========================================================================

  getReports(): IndustryReport[] {
    return [...this.reports];
  }

  getReportById(id: string): IndustryReport | undefined {
    return this.reports.find(r => r.id === id);
  }

  getReportsByIndustry(industryId: string): IndustryReport[] {
    return this.reports.filter(r => r.industryIds.includes(industryId));
  }

  saveReport(report: IndustryReport): IndustryReport {
    const idx = this.reports.findIndex(r => r.id === report.id);
    if (idx >= 0) {
      this.reports[idx] = { ...report, updatedAt: new Date().toISOString() };
    } else {
      this.reports.unshift({
        ...report,
        createdAt: report.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    this.saveToStorage();

    crawlerStore.addAuditLog({
      actorId: 'admin-lead',
      actorUsername: 'admin_lead',
      action: 'UPDATE_REPORT' as any,
      result: 'SUCCESS',
      details: `Saved industry report "${report.title}" from publisher "${report.publisher}"`
    });

    return report;
  }

  // =========================================================================
  // DATA POINTS
  // =========================================================================

  getDataPoints(filters?: {
    industryId?: string;
    geography?: string;
    metricSlug?: string;
    periodLabel?: string;
    status?: 'active' | 'staged' | 'archived';
    search?: string;
  }): IndustryDataPoint[] {
    let result = [...this.dataPoints];

    if (filters) {
      if (filters.industryId) {
        result = result.filter(dp => dp.industryId === filters.industryId);
      }
      if (filters.geography && filters.geography !== 'All') {
        result = result.filter(dp => dp.geography === filters.geography);
      }
      if (filters.metricSlug) {
        result = result.filter(dp => dp.metricSlug === filters.metricSlug);
      }
      if (filters.periodLabel && filters.periodLabel !== 'All') {
        result = result.filter(dp => dp.periodLabel === filters.periodLabel);
      }
      if (filters.status) {
        result = result.filter(dp => dp.status === filters.status);
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        result = result.filter(dp =>
          dp.metric.toLowerCase().includes(term) ||
          dp.publisher?.toLowerCase().includes(term) ||
          dp.geography?.toLowerCase().includes(term) ||
          dp.tags.some(t => t.toLowerCase().includes(term))
        );
      }
    }

    return result;
  }

  getDataPointById(id: string): IndustryDataPoint | undefined {
    return this.dataPoints.find(dp => dp.id === id);
  }

  saveDataPoint(point: IndustryDataPoint): IndustryDataPoint {
    // Normalization & Quality Score calculation
    const normalized = DataNormalizer.normalizeValue(point.rawValue || point.value, point.unit);
    const qualityScore = DataNormalizer.calculateDataQualityScore(
      point.credibilityScore ?? 85,
      point.confidenceScore ?? 0.95,
      point.periodLabel,
      Boolean(point.definition),
      Boolean(point.methodology)
    );

    const fullPoint: IndustryDataPoint = {
      ...point,
      value: normalized.value,
      valueType: normalized.valueType,
      unit: normalized.unit,
      metricSlug: DataNormalizer.toMetricSlug(point.metric),
      geography: DataNormalizer.normalizeGeography(point.geography),
      dataQualityScore: qualityScore,
      updatedAt: new Date().toISOString()
    };

    // Detect conflicts
    const conflicts = DataNormalizer.detectConflicts(fullPoint, this.dataPoints);
    if (conflicts.length > 0) {
      fullPoint.conflictWarning = true;
      fullPoint.conflictingDataPointIds = conflicts;
    }

    const idx = this.dataPoints.findIndex(dp => dp.id === point.id);
    if (idx >= 0) {
      this.dataPoints[idx] = fullPoint;
    } else {
      fullPoint.createdAt = fullPoint.createdAt || new Date().toISOString();
      this.dataPoints.unshift(fullPoint);
    }

    this.saveToStorage();

    crawlerStore.addAuditLog({
      actorId: 'admin-lead',
      actorUsername: 'admin_lead',
      action: 'UPDATE_DATA_POINT' as any,
      result: 'SUCCESS',
      details: `Saved data point "${fullPoint.metric}" = ${fullPoint.value} ${fullPoint.unit} (${fullPoint.geography}, ${fullPoint.periodLabel})`
    });

    return fullPoint;
  }

  deleteDataPoint(id: string): boolean {
    const prevLen = this.dataPoints.length;
    this.dataPoints = this.dataPoints.filter(dp => dp.id !== id);
    if (this.dataPoints.length !== prevLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // =========================================================================
  // INDUSTRY INTELLIGENCE
  // =========================================================================

  getIntelligence(filters?: {
    industryId?: string;
    type?: string;
    geography?: string;
  }): IndustryIntelligence[] {
    let result = [...this.intelligence];

    if (filters) {
      if (filters.industryId) {
        result = result.filter(item => item.industryId === filters.industryId);
      }
      if (filters.type && filters.type !== 'All') {
        result = result.filter(item => item.type === filters.type);
      }
      if (filters.geography && filters.geography !== 'All') {
        result = result.filter(item => item.geography.includes(filters.geography!));
      }
    }

    return result;
  }

  getIntelligenceById(id: string): IndustryIntelligence | undefined {
    return this.intelligence.find(i => i.id === id);
  }

  saveIntelligence(item: IndustryIntelligence): IndustryIntelligence {
    const idx = this.intelligence.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      this.intelligence[idx] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      this.intelligence.unshift({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    this.saveToStorage();

    crawlerStore.addAuditLog({
      actorId: 'admin-lead',
      actorUsername: 'admin_lead',
      action: 'UPDATE_INTELLIGENCE' as any,
      result: 'SUCCESS',
      details: `Saved industry intelligence: "${item.title}" [${item.type}]`
    });

    return item;
  }

  // =========================================================================
  // CASE STUDIES
  // =========================================================================

  getCaseStudies(filters?: {
    industryId?: string;
    caseType?: CaseTypeCategory;
    difficulty?: CaseDifficultyLevel;
    geography?: string;
    skillId?: string;
    search?: string;
  }): CaseStudy[] {
    let result = [...this.caseStudies];

    if (filters) {
      if (filters.industryId && filters.industryId !== 'All') {
        result = result.filter(c => c.industryId === filters.industryId);
      }
      if (filters.caseType && (filters.caseType as any) !== 'All') {
        result = result.filter(c => c.caseTypeIds.includes(filters.caseType!));
      }
      if (filters.difficulty && (filters.difficulty as any) !== 'All') {
        result = result.filter(c => c.difficulty === filters.difficulty);
      }
      if (filters.geography && filters.geography !== 'All') {
        result = result.filter(c => c.geography?.toLowerCase().includes(filters.geography!.toLowerCase()));
      }
      if (filters.skillId && filters.skillId !== 'All') {
        result = result.filter(c => c.skillIds.some(s => s.toLowerCase() === filters.skillId!.toLowerCase()));
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        result = result.filter(c =>
          c.title.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term) ||
          c.context.toLowerCase().includes(term) ||
          c.skillIds.some(s => s.toLowerCase().includes(term))
        );
      }
    }

    return result;
  }

  getCaseStudyById(id: string): CaseStudy | undefined {
    return this.caseStudies.find(c => c.id === id);
  }

  getCaseStudyBySlug(slug: string): CaseStudy | undefined {
    return this.caseStudies.find(c => c.slug === slug);
  }

  saveCaseStudy(caseStudy: CaseStudy): CaseStudy {
    const idx = this.caseStudies.findIndex(c => c.id === caseStudy.id);
    if (idx >= 0) {
      this.caseStudies[idx] = { ...caseStudy, updatedAt: new Date().toISOString() };
    } else {
      this.caseStudies.unshift({
        ...caseStudy,
        createdAt: caseStudy.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    this.saveToStorage();

    crawlerStore.addAuditLog({
      actorId: 'admin-lead',
      actorUsername: 'admin_lead',
      action: 'UPDATE_CASE_STUDY' as any,
      result: 'SUCCESS',
      details: `Saved case study "${caseStudy.title}" (${caseStudy.id})`
    });

    return caseStudy;
  }

  // =========================================================================
  // CASE EXHIBITS & QUESTIONS
  // =========================================================================

  getExhibitsForCase(caseStudyId: string): CaseExhibit[] {
    return this.exhibits
      .filter(e => e.caseStudyId === caseStudyId)
      .sort((a, b) => a.order - b.order);
  }

  saveExhibit(exhibit: CaseExhibit): CaseExhibit {
    const idx = this.exhibits.findIndex(e => e.id === exhibit.id);
    if (idx >= 0) {
      this.exhibits[idx] = exhibit;
    } else {
      this.exhibits.push(exhibit);
    }
    this.saveToStorage();
    return exhibit;
  }

  getQuestionsForCase(caseStudyId: string): CaseQuestion[] {
    return this.questions
      .filter(q => q.caseStudyId === caseStudyId)
      .sort((a, b) => a.order - b.order);
  }

  saveQuestion(question: CaseQuestion): CaseQuestion {
    const idx = this.questions.findIndex(q => q.id === question.id);
    if (idx >= 0) {
      this.questions[idx] = question;
    } else {
      this.questions.push(question);
    }
    this.saveToStorage();
    return question;
  }

  // =========================================================================
  // DATA IMPORT & VALIDATION (CSV / JSON)
  // =========================================================================

  validateImportCsv(csvText: string): ImportValidationResult {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) {
      return {
        validRows: [],
        invalidRows: [{ row: 1, data: '', errors: ['File is empty or missing headers'] }],
        duplicateCount: 0,
        conflictsCount: 0,
        unmappedIndustries: [],
        unmappedMetrics: []
      };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const industryIdx = headers.indexOf('industry');
    const metricIdx = headers.indexOf('metric');
    const valueIdx = headers.indexOf('value');
    const unitIdx = headers.indexOf('unit');
    const geoIdx = headers.indexOf('geography');
    const periodIdx = headers.indexOf('period');
    const sourceIdx = headers.indexOf('source');

    const validRows: Partial<IndustryDataPoint>[] = [];
    const invalidRows: { row: number; data: any; errors: string[] }[] = [];
    const unmappedIndustriesSet = new Set<string>();
    const unmappedMetricsSet = new Set<string>();
    let duplicateCount = 0;
    let conflictsCount = 0;

    const existingKeys = new Set(
      this.dataPoints.map(dp => `${dp.industryId}|${dp.metricSlug}|${dp.geography || 'Global'}|${dp.periodLabel || ''}`)
    );

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      const errors: string[] = [];

      const industryRaw = industryIdx >= 0 ? cols[industryIdx] : '';
      const metricRaw = metricIdx >= 0 ? cols[metricIdx] : '';
      const valueRaw = valueIdx >= 0 ? cols[valueIdx] : '';
      const unitRaw = unitIdx >= 0 ? cols[unitIdx] : 'units';
      const geoRaw = geoIdx >= 0 ? cols[geoIdx] : 'Global';
      const periodRaw = periodIdx >= 0 ? cols[periodIdx] : '2026';
      const sourceRaw = sourceIdx >= 0 ? cols[sourceIdx] : 'External CSV Import';

      if (!metricRaw) errors.push('Missing metric name');
      if (!valueRaw) errors.push('Missing value');

      // Resolve industry
      let matchedIndustry = this.industries.find(ind =>
        ind.name.toLowerCase() === industryRaw.toLowerCase() ||
        ind.slug.toLowerCase() === industryRaw.toLowerCase() ||
        ind.aliases.some(a => a.toLowerCase() === industryRaw.toLowerCase())
      );

      if (!matchedIndustry && industryRaw) {
        unmappedIndustriesSet.add(industryRaw);
        matchedIndustry = this.industries[0]; // fallback
      }

      if (errors.length > 0) {
        invalidRows.push({ row: i + 1, data: line, errors });
        continue;
      }

      const normalized = DataNormalizer.normalizeValue(valueRaw, unitRaw);
      const metricSlug = DataNormalizer.toMetricSlug(metricRaw);
      const geoNormalized = DataNormalizer.normalizeGeography(geoRaw);

      const compositeKey = `${matchedIndustry ? matchedIndustry.id : 'ind-auto'}|${metricSlug}|${geoNormalized}|${periodRaw}`;
      if (existingKeys.has(compositeKey)) {
        duplicateCount++;
      }

      const quality = DataNormalizer.calculateDataQualityScore(85, 0.92, periodRaw, true, false);

      const parsedPoint: Partial<IndustryDataPoint> = {
        id: `dp-import-${Date.now()}-${i}`,
        industryId: matchedIndustry ? matchedIndustry.id : 'ind-auto',
        metric: metricRaw,
        metricSlug,
        value: normalized.value,
        rawValue: valueRaw,
        valueType: normalized.valueType,
        unit: normalized.unit,
        geography: geoNormalized,
        periodLabel: periodRaw,
        publisher: sourceRaw,
        sourceUrl: 'https://data.import.local',
        confidenceScore: 0.92,
        credibilityScore: 85,
        dataQualityScore: quality,
        tags: ['Imported', matchedIndustry ? matchedIndustry.name : 'Automotive'],
        status: 'staged'
      };

      validRows.push(parsedPoint);
    }

    return {
      validRows,
      invalidRows,
      duplicateCount,
      conflictsCount,
      unmappedIndustries: Array.from(unmappedIndustriesSet),
      unmappedMetrics: Array.from(unmappedMetricsSet)
    };
  }

  commitImportedRows(rows: Partial<IndustryDataPoint>[]): number {
    let count = 0;
    for (const r of rows) {
      if (r.metric && r.value !== undefined) {
        this.saveDataPoint({
          id: r.id || `dp-imp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          industryId: r.industryId || 'ind-auto',
          metric: r.metric,
          metricSlug: r.metricSlug || DataNormalizer.toMetricSlug(r.metric),
          value: r.value,
          rawValue: r.rawValue,
          valueType: r.valueType || 'NUMBER',
          unit: r.unit || 'units',
          geography: r.geography || 'Global',
          periodLabel: r.periodLabel || '2026',
          publisher: r.publisher || 'Imported Source',
          confidenceScore: r.confidenceScore ?? 0.90,
          credibilityScore: r.credibilityScore ?? 85,
          dataQualityScore: r.dataQualityScore ?? 85,
          tags: r.tags || ['Imported'],
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        count++;
      }
    }
    return count;
  }
}

export const industryStore = new IndustryStore();
