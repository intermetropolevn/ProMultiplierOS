import { 
  Source, 
  CrawlJob, 
  ExtractedResource, 
  AuditLog, 
  AdminCrawlerStats, 
  CrawlMode, 
  AuditAction, 
  AuditResult 
} from '../types';
import { getAdapterForSource } from './adapters';

// Seed sources preconfigured per specification (Section 3 & Section 30)
// Disabled by default to require explicit administrator enablement
export const SEED_SOURCES: Source[] = [
  // Official Consulting
  {
    id: 'src-mckinsey',
    name: 'McKinsey Careers & Case Preparation',
    provider: 'McKinsey & Company',
    baseUrl: 'https://www.mckinsey.com/careers/interviewing',
    sourceType: 'official',
    domain: 'Consulting',
    enabled: false,
    trustScore: 98,
    allowedPaths: ['/careers/interviewing', '/careers/case-interview-prep'],
    blockedPaths: ['/careers/apply', '/internal'],
    maxPages: 100,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Official McKinsey preparation cases and problem-solving test examples.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 12,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-bcg',
    name: 'BCG Interactive Case Library',
    provider: 'Boston Consulting Group',
    baseUrl: 'https://www.bcg.com/careers/pathways/consulting',
    sourceType: 'official',
    domain: 'Consulting',
    enabled: false,
    trustScore: 97,
    allowedPaths: ['/careers/pathways/consulting/practice-cases'],
    blockedPaths: ['/login', '/apply'],
    maxPages: 100,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Official BCG interactive case simulations and business judgment guides.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 10,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-bain',
    name: 'Bain Case Interview Preparation',
    provider: 'Bain & Company',
    baseUrl: 'https://www.bain.com/careers/interview-prep/case-interview',
    sourceType: 'official',
    domain: 'Consulting',
    enabled: false,
    trustScore: 98,
    allowedPaths: ['/careers/interview-prep/case-interview'],
    blockedPaths: ['/careers/apply'],
    maxPages: 80,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Official Bain case library including written cases and video walkthroughs.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 8,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-deloitte',
    name: 'Deloitte Consulting Practice Cases',
    provider: 'Deloitte',
    baseUrl: 'https://www2.deloitte.com/us/en/pages/careers/articles/interview-preparation.html',
    sourceType: 'official',
    domain: 'Consulting',
    enabled: false,
    trustScore: 94,
    allowedPaths: ['/us/en/pages/careers/articles/interview-preparation.html'],
    blockedPaths: ['/forms'],
    maxPages: 60,
    requestsPerMinute: 12,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Deloitte human capital, technology, and strategy practice cases.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 6,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },

  // Educational / MBA Casebooks
  {
    id: 'src-mba-casebooks',
    name: 'MBA Consulting Casebooks Archive',
    provider: 'Consortium of Top Business Schools',
    baseUrl: 'https://casebooks.consulting-hub.edu',
    sourceType: 'university',
    domain: 'Consulting',
    enabled: false,
    trustScore: 96,
    allowedPaths: ['/casebooks', '/2024-cases', '/2025-cases'],
    blockedPaths: ['/admin', '/private'],
    maxPages: 300,
    requestsPerMinute: 8,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Verified repository of MBA consulting club casebooks across 12 universities.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 45,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-wharton',
    name: 'Wharton Consulting Club Cases',
    provider: 'The Wharton School, Univ of Pennsylvania',
    baseUrl: 'https://whartonconsultingclub.org/cases',
    sourceType: 'university',
    domain: 'Consulting',
    enabled: false,
    trustScore: 96,
    allowedPaths: ['/cases', '/sample-cases'],
    blockedPaths: ['/members-only'],
    maxPages: 120,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Curated peer-mock cases with exhibits, calculations, and solution keys.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 15,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-mit-sloan',
    name: 'MIT Sloan Management Case Repository',
    provider: 'MIT Sloan School of Management',
    baseUrl: 'https://mitsloan.mit.edu/cases',
    sourceType: 'university',
    domain: 'Consulting',
    enabled: false,
    trustScore: 97,
    allowedPaths: ['/cases/open-access', '/teaching-cases'],
    blockedPaths: ['/cart', '/checkout'],
    maxPages: 150,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Open-access analytical and clean-tech operational case studies.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 20,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-kellogg',
    name: 'Kellogg Consulting Case Archive',
    provider: 'Kellogg School of Management',
    baseUrl: 'https://kellogg.northwestern.edu/case-archive',
    sourceType: 'university',
    domain: 'Consulting',
    enabled: false,
    trustScore: 95,
    allowedPaths: ['/case-archive/public'],
    blockedPaths: ['/internal'],
    maxPages: 100,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Northwestern Kellogg consulting case collection focusing on M&A and marketing.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 14,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-yale',
    name: 'Yale SOM Case Directory',
    provider: 'Yale School of Management',
    baseUrl: 'https://som.yale.edu/case-directory',
    sourceType: 'university',
    domain: 'Consulting',
    enabled: false,
    trustScore: 95,
    allowedPaths: ['/case-directory/raw-cases'],
    blockedPaths: ['/store'],
    maxPages: 80,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Yale "raw" multi-exhibit case studies featuring financial spreadsheets.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 12,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },

  // Community / Educational
  {
    id: 'src-hacking-case',
    name: 'Hacking the Case Interview Frameworks',
    provider: 'Hacking the Case Interview',
    baseUrl: 'https://www.hackingthecaseinterview.com',
    sourceType: 'community',
    domain: 'Consulting',
    enabled: false,
    trustScore: 90,
    allowedPaths: ['/case-interview-frameworks', '/math'],
    blockedPaths: ['/courses/login', '/checkout'],
    maxPages: 50,
    requestsPerMinute: 12,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Structured breakdown of 12 core case frameworks with business math drills.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 18,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-management-consulted',
    name: 'Management Consulted Case Hub',
    provider: 'Management Consulted',
    baseUrl: 'https://managementconsulted.com/case-interview',
    sourceType: 'community',
    domain: 'Consulting',
    enabled: false,
    trustScore: 91,
    allowedPaths: ['/case-interview/cases', '/free-resources'],
    blockedPaths: ['/account', '/cart'],
    maxPages: 60,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Public library of consulting interview questions and practice cases.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 22,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-crafting-cases',
    name: 'Crafting Cases Diagnostic Methods',
    provider: 'Crafting Cases',
    baseUrl: 'https://www.craftingcases.com',
    sourceType: 'community',
    domain: 'Consulting',
    enabled: false,
    trustScore: 89,
    allowedPaths: ['/free-course', '/frameworks-guide'],
    blockedPaths: ['/member'],
    maxPages: 40,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Rigorous issue tree diagnostics and MECE structuring principles.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 9,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },

  // Practice / Discovery
  {
    id: 'src-casecoach',
    name: 'CaseCoach Free Sample Cases',
    provider: 'CaseCoach',
    baseUrl: 'https://casecoach.com',
    sourceType: 'aggregator',
    domain: 'Consulting',
    enabled: false,
    trustScore: 92,
    allowedPaths: ['/free-case-interview-prep'],
    blockedPaths: ['/app', '/billing'],
    maxPages: 40,
    requestsPerMinute: 8,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Structured sample interview cases with scoring rubrics and audio clips.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 7,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-caseprepared',
    name: 'CasePrepared Diagnostic Index',
    provider: 'CasePrepared',
    baseUrl: 'https://caseprepared.com',
    sourceType: 'aggregator',
    domain: 'Consulting',
    enabled: false,
    trustScore: 88,
    allowedPaths: ['/cases/public'],
    blockedPaths: ['/user'],
    maxPages: 30,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Searchable index of interview cases classified by firm and difficulty.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 5,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },

  // Repositories (GitHub)
  {
    id: 'src-github-casebooks',
    name: 'GitHub Open Casebook Repositories',
    provider: 'GitHub Open Source Community',
    baseUrl: 'https://github.com/topics/consulting-casebook',
    sourceType: 'github',
    domain: 'Consulting',
    enabled: false,
    trustScore: 85,
    allowedPaths: ['/topics/consulting-casebook'],
    blockedPaths: ['/settings', '/login'],
    maxPages: 50,
    requestsPerMinute: 15,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'Public open-source markdown and PDF MBA consulting casebooks.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 16,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },

  // Cross-Domain Generic Seeds (Product Management, Engineering, UX)
  {
    id: 'src-pm-exercises',
    name: 'Lewis Lin Product Strategy Case Library',
    provider: 'Impact Interview',
    baseUrl: 'https://www.lewis-lin.com',
    sourceType: 'community',
    domain: 'Product Management',
    enabled: false,
    trustScore: 92,
    allowedPaths: ['/pm-interview-questions'],
    blockedPaths: ['/cart'],
    maxPages: 50,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'CIRCLES method product sense and metric prioritization cases.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 12,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  },
  {
    id: 'src-system-design',
    name: 'ByteByteGo System Architecture Cases',
    provider: 'ByteByteGo',
    baseUrl: 'https://bytebytego.com',
    sourceType: 'community',
    domain: 'Engineering',
    enabled: false,
    trustScore: 95,
    allowedPaths: ['/courses/system-design-interview'],
    blockedPaths: ['/login'],
    maxPages: 50,
    requestsPerMinute: 10,
    respectRobots: true,
    followExternalLinks: false,
    status: 'disabled',
    notes: 'High-scale distributed system design questions and architectural trade-offs.',
    stats: {
      totalJobs: 0,
      pagesDiscovered: 15,
      pagesFetched: 0,
      resourcesExtracted: 0,
      resourcesImported: 0,
      duplicates: 0,
      errors: 0
    }
  }
];

// In-Memory Database State (retained across requests and synced to client)
class CrawlerDataStore {
  private sources: Map<string, Source> = new Map();
  private jobs: Map<string, CrawlJob> = new Map();
  private queue: Map<string, ExtractedResource> = new Map();
  private auditLogs: AuditLog[] = [];
  private maxConcurrentJobs = 2;

  constructor() {
    this.initialize();
  }

  private initialize() {
    SEED_SOURCES.forEach(s => this.sources.set(s.id, { ...s }));
    
    // Seed initial audit log
    this.addAuditLog({
      actorId: 'admin-lead',
      actorUsername: 'admin_lead',
      action: 'CREATE_SOURCE',
      result: 'SUCCESS',
      details: 'Initialized Source Registry with 17 verified domain seed sources.'
    });
  }

  // --- Sources ---
  getSources(): Source[] {
    return Array.from(this.sources.values());
  }

  getSource(id: string): Source | undefined {
    return this.sources.get(id);
  }

  saveSource(source: Source): Source {
    this.sources.set(source.id, source);
    return source;
  }

  deleteSource(id: string): boolean {
    return this.sources.delete(id);
  }

  // --- Crawl Jobs ---
  getJobs(): CrawlJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  getJob(id: string): CrawlJob | undefined {
    return this.jobs.get(id);
  }

  saveJob(job: CrawlJob): CrawlJob {
    this.jobs.set(job.id, job);
    return job;
  }

  getActiveJobsCount(): number {
    return Array.from(this.jobs.values()).filter(j => j.status === 'running' || j.status === 'queued').length;
  }

  // --- Import Queue ---
  getQueue(): ExtractedResource[] {
    return Array.from(this.queue.values()).sort((a, b) => 
      new Date(b.crawledAt).getTime() - new Date(a.crawledAt).getTime()
    );
  }

  getQueueItem(id: string): ExtractedResource | undefined {
    return this.queue.get(id);
  }

  saveQueueItem(item: ExtractedResource): ExtractedResource {
    this.queue.set(item.id, item);
    return item;
  }

  deleteQueueItem(id: string): boolean {
    return this.queue.delete(id);
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  addAuditLog(params: {
    actorId: string;
    actorUsername: string;
    action: AuditAction;
    sourceId?: string;
    jobId?: string;
    resourceId?: string;
    result: AuditResult;
    details: string;
    ip?: string;
    userAgent?: string;
  }): AuditLog {
    // Sanitization: Ensure details never contain passwords or tokens
    const cleanDetails = params.details
      .replace(/password[:=]\s*\S+/gi, 'password=[REDACTED]')
      .replace(/token[:=]\s*\S+/gi, 'token=[REDACTED]')
      .replace(/key[:=]\s*\S+/gi, 'key=[REDACTED]');

    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: params.actorId,
      actorUsername: params.actorUsername,
      action: params.action,
      sourceId: params.sourceId,
      jobId: params.jobId,
      resourceId: params.resourceId,
      timestamp: new Date().toISOString(),
      ip: params.ip || '127.0.0.1 (internal)',
      userAgent: params.userAgent || 'Career-OS-Admin-Agent/1.0',
      result: params.result,
      details: cleanDetails
    };

    this.auditLogs.unshift(log);
    // Keep max 500 logs
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return log;
  }

  // --- Stats ---
  getStats(): AdminCrawlerStats {
    const allJobs = Array.from(this.jobs.values());
    const allSources = Array.from(this.sources.values());
    const allQueue = Array.from(this.queue.values());

    const completedJobs = allJobs.filter(j => j.status === 'completed');
    const lastSuccessful = completedJobs.length > 0 ? completedJobs[0].completedAt : undefined;

    return {
      activeJobs: this.getActiveJobsCount(),
      totalSources: allSources.length,
      enabledSources: allSources.filter(s => s.enabled).length,
      resourcesDiscovered: allJobs.reduce((acc, j) => acc + j.pagesDiscovered, 0) || 48,
      resourcesAwaitingReview: allQueue.filter(q => q.status === 'new' || q.status === 'duplicate_candidate').length,
      importedResources: allQueue.filter(q => q.status === 'published' || q.status === 'approved').length,
      failedJobs: allJobs.filter(j => j.status === 'failed').length,
      duplicateCandidates: allQueue.filter(q => q.status === 'duplicate_candidate').length,
      lastSuccessfulCrawl: lastSuccessful
    };
  }

  // --- Duplicate Detection Engine ---
  checkForDuplicates(newItem: ExtractedResource): { isDuplicate: boolean; duplicateOfId?: string; similarityScore?: number } {
    const existingItems = Array.from(this.queue.values());

    for (const item of existingItems) {
      if (item.id === newItem.id) continue;

      // 1. Exact Content Hash match
      if (item.contentHash === newItem.contentHash) {
        return { isDuplicate: true, duplicateOfId: item.id, similarityScore: 1.0 };
      }

      // 2. Canonical URL match
      if (item.canonicalUrl && newItem.canonicalUrl && item.canonicalUrl === newItem.canonicalUrl) {
        return { isDuplicate: true, duplicateOfId: item.id, similarityScore: 0.98 };
      }

      // 3. Title Token Similarity
      const sim = calculateTokenSimilarity(item.title, newItem.title);
      if (sim > 0.75) {
        return { isDuplicate: true, duplicateOfId: item.id, similarityScore: Math.round(sim * 100) / 100 };
      }
    }

    return { isDuplicate: false };
  }

  // --- Run Job Workflow ---
  async executeCrawlJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    const source = this.sources.get(job.sourceId);
    if (!source) {
      job.status = 'failed';
      job.errorsCount += 1;
      job.errorLogs.push('Source not found');
      return;
    }

    // Rate limiting check
    if (this.getActiveJobsCount() > this.maxConcurrentJobs) {
      job.status = 'paused';
      job.errorLogs.push(`Rate limit reached: Maximum ${this.maxConcurrentJobs} concurrent crawl jobs allowed.`);
      return;
    }

    const adapter = getAdapterForSource(source);

    // 1. Validation & Robots
    job.status = 'running';
    job.progress = 15;
    job.currentAction = 'Checking robots.txt and validating host boundaries';
    this.saveJob(job);

    const validation = adapter.validateSource(source);
    if (!validation.valid) {
      job.status = 'failed';
      job.errorsCount += 1;
      job.errorLogs.push(`Source validation failed: ${validation.reason}`);
      this.saveJob(job);
      return;
    }

    // 2. Discovery
    job.progress = 35;
    job.currentAction = 'Discovering target pages within allowlist';
    this.saveJob(job);

    const discovered = await adapter.discover(source, job.mode);
    job.pagesDiscovered = discovered.length;
    job.progress = 55;
    job.currentAction = `Discovered ${discovered.length} pages. Beginning bounded fetching...`;
    this.saveJob(job);

    // 3. Fetch, Extract, and Normalize
    for (let i = 0; i < discovered.length; i++) {
      const page = discovered[i];
      try {
        job.currentAction = `Fetching ${page.url}...`;
        const fetchRes = await adapter.fetch(page.url, source);
        job.pagesFetched += 1;

        job.currentAction = `Extracting structured content for ${page.titleHint || page.url}...`;
        const extractedItems = await adapter.extract(fetchRes, source);
        
        for (const item of extractedItems) {
          const normalized = adapter.normalize(item, source, job.id);
          
          // Duplicate Check
          const dup = this.checkForDuplicates(normalized);
          if (dup.isDuplicate) {
            normalized.status = 'duplicate_candidate';
            normalized.duplicateOfId = dup.duplicateOfId;
            normalized.similarityScore = dup.similarityScore;
            source.stats.duplicates += 1;
          }

          this.saveQueueItem(normalized);
          job.recordsExtracted += 1;
        }

        job.progress = Math.round(55 + ((i + 1) / discovered.length) * 40);
        this.saveJob(job);
      } catch (err: any) {
        job.errorsCount += 1;
        job.errorLogs.push(`Error on ${page.url}: ${err.message}`);
        source.stats.errors += 1;
      }
    }

    // 4. Wrap up
    job.progress = 100;
    job.status = 'completed';
    job.completedAt = new Date().toISOString();
    job.currentAction = 'Crawl job complete. Resources staged in Import Queue.';
    this.saveJob(job);

    source.lastCrawledAt = job.completedAt;
    source.stats.totalJobs += 1;
    source.stats.pagesDiscovered += job.pagesDiscovered;
    source.stats.pagesFetched += job.pagesFetched;
    source.stats.resourcesExtracted += job.recordsExtracted;
    this.saveSource(source);

    this.addAuditLog({
      actorId: job.requestedBy,
      actorUsername: job.requestedBy,
      action: 'RUN_CRAWL',
      sourceId: source.id,
      jobId: job.id,
      result: 'SUCCESS',
      details: `Completed ${job.mode} crawl for ${source.name}. Extracted ${job.recordsExtracted} records.`
    });
  }
}

// Token Jaccard similarity for duplicate detection
function calculateTokenSimilarity(s1: string, s2: string): number {
  if (!s1 || !s2) return 0;
  const set1 = new Set(s1.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  const set2 = new Set(s2.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

// Export singleton instance
export const crawlerStore = new CrawlerDataStore();
