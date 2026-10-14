import { ContentAccessMode } from '../knowledge/types';
import { SectorDomain } from '../../types';

// =========================================================================
// 1. INDUSTRY ENTITY
// =========================================================================

export type IndustryStatus = 'active' | 'draft' | 'archived';

export interface Industry {
  id: string;
  name: string;
  slug: string;
  domainId: SectorDomain | string;
  parentIndustryId?: string;
  description?: string;
  geography?: string;
  aliases: string[];
  tags: string[];
  status: IndustryStatus;
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// 2. INDUSTRY REPORT / RESOURCE
// =========================================================================

export type IndustryReportType =
  | 'MARKET_REPORT'
  | 'INDUSTRY_OUTLOOK'
  | 'ANNUAL_REPORT'
  | 'MARKET_RESEARCH'
  | 'GOVERNMENT_REPORT'
  | 'INDUSTRY_ASSOCIATION'
  | 'CONSULTING_REPORT'
  | 'ACADEMIC_RESEARCH'
  | 'COMPANY_REPORT'
  | 'STATISTICAL_DATASET'
  | 'OTHER';

export interface IndustryReport {
  id: string;
  resourceId?: string;
  title: string;
  industryIds: string[];
  publisher: string;
  publicationDate?: string;
  reportingPeriod?: string;
  geography: string[];
  reportType: IndustryReportType;
  sourceUrl: string;
  accessMode: ContentAccessMode;
  license?: string;
  credibilityScore?: number; // 0 - 100
  summary?: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// 3. INDUSTRY DATA POINT & NORMALIZATION
// =========================================================================

export type DataPointValueType =
  | 'NUMBER'
  | 'PERCENTAGE'
  | 'CURRENCY'
  | 'RATIO'
  | 'INDEX'
  | 'COUNT'
  | 'TEXT'
  | 'RANGE'
  | 'BOOLEAN';

export interface IndustryDataPoint {
  id: string;
  industryId: string;
  metric: string;
  metricSlug: string;

  // Normalized value & raw original representation
  value: number | string | boolean;
  rawValue?: string; // original reported string e.g. "$420 billion"
  valueType: DataPointValueType;
  unit: string; // e.g. "USD", "%", "units", "ratio"

  geography?: string; // e.g. "Global", "Vietnam", "North America", "China"
  segment?: string;
  company?: string;
  periodStart?: string;
  periodEnd?: string;
  periodLabel?: string; // e.g. "2026", "Q1 2026", "2023-2026"

  sourceResourceId?: string;
  sourceReportId?: string;
  sourceUrl?: string;
  publisher?: string;
  pageOrSection?: string;

  methodology?: string;
  definition?: string;

  confidenceScore?: number; // 0.0 - 1.0 (e.g. 0.94)
  credibilityScore?: number; // 0 - 100
  dataQualityScore?: number; // 0 - 100 calculated from credibility, recency, confidence, corroboration

  // Conflict handling
  conflictWarning?: boolean;
  conflictingDataPointIds?: string[];

  tags: string[];
  status: 'active' | 'staged' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// 4. INDUSTRY INTELLIGENCE
// =========================================================================

export type IndustryIntelligenceType =
  | 'MARKET_TREND'
  | 'GROWTH_TREND'
  | 'COST_TREND'
  | 'CONSUMER_TREND'
  | 'COMPETITIVE_DYNAMIC'
  | 'REGULATORY_CHANGE'
  | 'TECHNOLOGY_TREND'
  | 'SUPPLY_CHAIN_DYNAMIC'
  | 'INDUSTRY_BENCHMARK'
  | 'RISK'
  | 'OPPORTUNITY'
  | 'STRUCTURAL_DRIVER';

export type IntelligenceEvidenceLevel = 'HIGH' | 'MEDIUM' | 'EMERGING';

export type IntelligenceOrigin = 'FACT' | 'INTERPRETATION' | 'CAREER_OS_SYNTHESIS';

export interface IndustryIntelligence {
  id: string;
  industryId: string;
  title: string;
  type: IndustryIntelligenceType;
  summary: string;
  dataPointIds: string[];
  sourceResourceIds: string[];
  geography: string[];
  period?: string;
  confidenceScore: number; // 0.0 - 1.0
  evidenceLevel: IntelligenceEvidenceLevel;
  implications: string[];
  tags: string[];
  origin: IntelligenceOrigin;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// 5. CASE STUDY & COMPONENTS
// =========================================================================

export type CaseTypeCategory =
  | 'PROFITABILITY'
  | 'MARKET_ENTRY'
  | 'MARKET_SIZING'
  | 'GROWTH'
  | 'PRICING'
  | 'M_AND_A'
  | 'OPERATIONS'
  | 'COST_REDUCTION'
  | 'GO_TO_MARKET'
  | 'PRODUCT'
  | 'STRATEGY'
  | 'COMPETITIVE_RESPONSE'
  | 'INVESTMENT'
  | 'DIGITAL_TRANSFORMATION'
  | 'OTHER';

export type CaseDifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type CaseExhibitType =
  | 'CHART'
  | 'TABLE'
  | 'MAP'
  | 'TIMELINE'
  | 'INFOGRAPHIC'
  | 'TEXT'
  | 'DATA_CARD';

export interface ExhibitSeries {
  key: string;
  name: string;
  color?: string;
}

export interface ExhibitChartConfig {
  chartType: 'line' | 'bar' | 'pie' | 'area';
  xAxisKey: string;
  series: ExhibitSeries[];
  data: Record<string, any>[];
}

export interface ExhibitTableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface CaseExhibit {
  id: string;
  caseStudyId: string;
  title: string;
  type: CaseExhibitType;
  dataPointIds: string[];
  chartConfig?: ExhibitChartConfig;
  tableData?: ExhibitTableData;
  imageUrl?: string;
  question?: string;
  interpretation?: string;
  order: number;
}

export type CaseQuestionType =
  | 'STRUCTURING'
  | 'QUANTITATIVE'
  | 'MARKET_SIZING'
  | 'CHART_READING'
  | 'BRAINSTORMING'
  | 'SYNTHESIS'
  | 'RECOMMENDATION'
  | 'FOLLOW_UP';

export interface CaseQuestion {
  id: string;
  caseStudyId: string;
  question: string;
  type: CaseQuestionType;
  skillIds: string[];
  difficulty?: CaseDifficultyLevel;
  expectedApproach?: string;
  expectedCalculation?: string;
  answer?: string;
  hints: string[];
  exhibitId?: string;
  order: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  description: string;

  domainId?: string;
  industryId?: string;
  geography?: string;

  caseTypeIds: CaseTypeCategory[];
  difficulty: CaseDifficultyLevel;

  context: string;
  objective: string;
  setup: string;

  questionIds: string[];
  exhibitIds: string[];

  industryReportIds: string[];
  dataPointIds: string[];
  intelligenceIds: string[];

  knowledgeIds: string[];
  frameworkIds: string[];
  skillIds: string[];

  sourceResourceIds: string[];

  estimatedTime?: number; // in minutes e.g. 45
  recommendedLevel?: string;

  solution?: string;
  solutionFramework?: string;
  expectedApproach?: string;

  qualityScore?: number; // 0 - 100
  status: 'active' | 'draft' | 'archived';

  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// 6. CSV / JSON IMPORT & VALIDATION TYPES
// =========================================================================

export interface ImportValidationResult {
  validRows: Partial<IndustryDataPoint>[];
  invalidRows: { row: number; data: any; errors: string[] }[];
  duplicateCount: number;
  conflictsCount: number;
  unmappedIndustries: string[];
  unmappedMetrics: string[];
}
