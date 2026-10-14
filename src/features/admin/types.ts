import { ContentAccessMode } from '../knowledge/types';

export type CrawlerPermission = 
  | 'crawler.view'
  | 'crawler.create'
  | 'crawler.run'
  | 'crawler.cancel'
  | 'crawler.manage_sources'
  | 'crawler.import'
  | 'crawler.publish'
  | 'crawler.audit';

export type UserRole = 'admin' | 'candidate' | 'super_admin';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: CrawlerPermission[];
  mfaEnabled: boolean;
}

export type SourceType = 
  | 'book'
  | 'official_guide'
  | 'academic_paper'
  | 'research'
  | 'article'
  | 'essay'
  | 'blog'
  | 'documentation'
  | 'framework'
  | 'video'
  | 'podcast'
  | 'interview'
  | 'lecture'
  | 'course'
  | 'casebook'
  | 'community'
  | 'github'
  | 'website'
  | 'official'
  | 'university'
  | 'aggregator'
  | 'youtube'
  | 'other';

export type SourceStatus = 'active' | 'idle' | 'crawling' | 'error' | 'disabled';

export interface SourceStats {
  totalJobs: number;
  lastCrawl?: string;
  pagesDiscovered: number;
  pagesFetched: number;
  resourcesExtracted: number;
  resourcesImported: number;
  duplicates: number;
  errors: number;
}

export interface Source {
  id: string;
  name: string;
  provider: string;
  baseUrl: string;
  sourceType: SourceType;
  domain: string; // 'Consulting', 'Product Management', 'Engineering', 'Finance', 'UX / UI', etc.
  subdomain?: string;
  enabled: boolean;
  trustScore: number; // 0 - 100
  sourceAuthority?: number; // 1 - 5 (5=official/original, 4=university/academic, 3=established expert, 2=community, 1=unknown)
  contentAccessMode?: ContentAccessMode;
  allowedPaths: string[];
  blockedPaths: string[];
  maxPages: number;
  requestsPerMinute: number;
  respectRobots: boolean;
  followExternalLinks: boolean;
  lastCrawledAt?: string;
  lastVerifiedAt?: string;
  status: SourceStatus;
  notes?: string;
  stats: SourceStats;
}

export type CrawlMode = 'discover' | 'update' | 'full_sync';

export type CrawlJobStatus = 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface CrawlJob {
  id: string;
  sourceId: string;
  sourceName: string;
  mode: CrawlMode;
  requestedBy: string;
  status: CrawlJobStatus;
  progress: number; // 0 - 100
  startedAt: string;
  completedAt?: string;
  pagesDiscovered: number;
  pagesFetched: number;
  recordsExtracted: number;
  recordsImported: number;
  errorsCount: number;
  errorLogs: string[];
  currentAction?: string;
}

export type ImportStatus = 
  | 'new'
  | 'updated'
  | 'duplicate_candidate'
  | 'failed'
  | 'approved'
  | 'rejected'
  | 'published';

export type ContentMode = 'external' | 'metadata_only' | 'mirrored' | 'restricted';

export type LicenseStatus = 
  | 'public_domain'
  | 'creative_commons'
  | 'fair_use_metadata'
  | 'all_rights_reserved'
  | 'unknown';

export type CaseType = 
  | 'profitability'
  | 'market sizing'
  | 'market entry'
  | 'M&A'
  | 'pricing'
  | 'operations'
  | 'growth'
  | 'strategy'
  | 'organization'
  | 'other';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CaseExhibit {
  id: string;
  title: string;
  type: 'table' | 'chart' | 'document';
  dataDescription: string;
}

export interface CaseInterviewData {
  caseType: CaseType;
  difficultyLevel: DifficultyLevel;
  difficultyScore: number; // 0 - 100
  difficultyConfidence: number; // 0.0 - 1.0
  industry: string;
  firm: string;
  skills: string[];
  prompt: string;
  interviewerGuidance?: string;
  candidateClarifyingQuestions?: string[];
  frameworkOutline?: string[];
  caseMathCalculations?: string[];
  solution: string;
  synthesisRecommendation?: string;
  exhibits: CaseExhibit[];
}

export type ExtractedResourceType = 
  | 'case_study'
  | 'role_blueprint'
  | 'interview_question'
  | 'domain_guide'
  | 'workflow'
  | 'framework';

export interface ExtractedResource {
  id: string;
  jobId: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  canonicalUrl: string;
  title: string;
  description: string;
  resourceType: ExtractedResourceType;
  domain: string;
  contentMode: ContentMode;
  license: LicenseStatus;
  redistributionAllowed: boolean;
  attribution: string;
  extractionConfidence: number; // 0 - 100
  qualityScore: number; // 0 - 100
  qualityConfidence: number; // 0.0 - 1.0
  contentHash: string;
  status: ImportStatus;
  duplicateOfId?: string;
  similarityScore?: number;
  rawContentSnippet: string;
  extractedContent: string;
  caseData?: CaseInterviewData;
  crawledAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  publishedResourceId?: string;
}

export type AuditAction = 
  | 'RUN_CRAWL'
  | 'CANCEL_CRAWL'
  | 'PAUSE_CRAWL'
  | 'RETRY_CRAWL'
  | 'CREATE_SOURCE'
  | 'UPDATE_SOURCE'
  | 'DELETE_SOURCE'
  | 'IMPORT_RESOURCE'
  | 'APPROVE_RESOURCE'
  | 'REJECT_RESOURCE'
  | 'PUBLISH_RESOURCE'
  | 'MERGE_DUPLICATE'
  | 'VERIFY_ADMIN';

export type AuditResult = 'SUCCESS' | 'FAILURE' | 'DENIED' | 'FLAGGED';

export interface AuditLog {
  id: string;
  actorId: string;
  actorUsername: string;
  action: AuditAction;
  sourceId?: string;
  jobId?: string;
  resourceId?: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  result: AuditResult;
  details: string;
}

export interface AdminCrawlerStats {
  activeJobs: number;
  totalSources: number;
  enabledSources: number;
  resourcesDiscovered: number;
  resourcesAwaitingReview: number;
  importedResources: number;
  failedJobs: number;
  duplicateCandidates: number;
  lastSuccessfulCrawl?: string;
}

export type DataManagementTab = 
  | 'business_english_content'
  | 'multilingual_ontology'
  | 'industry_intelligence'
  | 'jobs_roles'
  | 'skills'
  | 'domains'
  | 'workflows'
  | 'knowledge_concepts'
  | 'knowledge_graph'
  | 'books_catalog'
  | 'research_papers'
  | 'syntheses'
  | 'sources'
  | 'pipeline_runner'
  | 'crawl_jobs'
  | 'import_queue'
  | 'audit_logs'
  | 'knowledge'
  | 'resources';
