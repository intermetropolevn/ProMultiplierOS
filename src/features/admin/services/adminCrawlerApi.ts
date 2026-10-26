import { 
  AdminUser, 
  Source, 
  CrawlJob, 
  ExtractedResource, 
  AuditLog, 
  AdminCrawlerStats, 
  CrawlMode,
  CrawlerPermission 
} from '../types';
import { crawlerStore } from './crawlerEngine';
import { dataExposureGuard } from '../../../services/dataExposureGuardService';

// Current active session state (Admin by default with option to test Candidate role)
const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'admin-lead',
  username: 'admin_lead',
  name: 'Lead Career Architect',
  email: 'admin@career-os.internal',
  role: 'admin',
  permissions: [
    'crawler.view',
    'crawler.create',
    'crawler.run',
    'crawler.cancel',
    'crawler.manage_sources',
    'crawler.import',
    'crawler.publish',
    'crawler.audit'
  ],
  mfaEnabled: true
};

const CANDIDATE_USER: AdminUser = {
  id: 'user-cand-01',
  username: 'alex_candidate',
  name: 'Alex Candidate',
  email: 'alex@candidate.example',
  role: 'candidate',
  permissions: [],
  mfaEnabled: false
};

const AUTH_STORAGE_KEY = 'career_os_admin_session';

export const AdminCrawlerApi = {
  // Session management
  getCurrentUser(): AdminUser {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_ADMIN_USER;
  },

  setCurrentUser(user: AdminUser): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  switchRole(role: 'admin' | 'candidate'): AdminUser {
    const user = role === 'admin' ? DEFAULT_ADMIN_USER : CANDIDATE_USER;
    this.setCurrentUser(user);
    return user;
  },

  hasPermission(permission: CrawlerPermission): boolean {
    const user = this.getCurrentUser();
    if (user.role === 'candidate') return false;
    return user.permissions.includes(permission);
  },

  // Password verification for sensitive actions (Run Crawl, Publish, Delete, Policy edit)
  // Security Hardening (SEC-01): Verified strictly server-side via /api/admin/verify; no plaintext secret in client bundle.
  async verifyAdminPassword(username: string, passwordAttempt: string): Promise<{ verified: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: passwordAttempt })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.verified && data.token) {
        try {
          sessionStorage.setItem('careeros_verified_admin_token', data.token);
        } catch {
          // Ignore storage error
        }
        return { verified: true, token: data.token };
      }
      return {
        verified: false,
        error: data.error || 'Invalid administrator credentials. Verification rejected by server.'
      };
    } catch {
      return {
        verified: false,
        error: 'Unable to reach server-side administrator verification service.'
      };
    }
  },

  buildHeaders(includeJson = false): Record<string, string> {
    let adminToken = '';
    if (typeof window !== 'undefined') {
      try {
        adminToken = sessionStorage.getItem('careeros_verified_admin_token') || '';
      } catch {
        // Ignore
      }
    }
    return {
      ...dataExposureGuard.getSecurityHeaders(),
      ...(adminToken ? { 'X-CareerOS-Admin-Token': adminToken } : {}),
      ...(includeJson ? { 'Content-Type': 'application/json' } : {})
    };
  },

  // Sources API
  async getSources(): Promise<Source[]> {
    try {
      const res = await fetch('/api/crawler/sources', { headers: this.buildHeaders() });
      if (res.ok) return await res.json();
    } catch {}
    return crawlerStore.getSources();
  },

  async getSource(id: string): Promise<Source | null> {
    try {
      const res = await fetch(`/api/crawler/sources/${id}`, { headers: this.buildHeaders() });
      if (res.ok) return await res.json();
    } catch {}
    return crawlerStore.getSource(id) || null;
  },

  async saveSource(source: Source): Promise<Source> {
    if (!this.hasPermission('crawler.manage_sources')) {
      throw new Error('403 Forbidden: Missing crawler.manage_sources permission');
    }
    try {
      const res = await fetch('/api/crawler/sources', {
        method: 'POST',
        headers: this.buildHeaders(true),
        body: JSON.stringify(source)
      });
      if (res.ok) return await res.json();
    } catch {}

    crawlerStore.addAuditLog({
      actorId: this.getCurrentUser().id,
      actorUsername: this.getCurrentUser().username,
      action: 'UPDATE_SOURCE',
      sourceId: source.id,
      result: 'SUCCESS',
      details: `Updated source policy and configuration for "${source.name}".`
    });
    return crawlerStore.saveSource(source);
  },

  async deleteSource(id: string): Promise<boolean> {
    if (!this.hasPermission('crawler.manage_sources')) {
      throw new Error('403 Forbidden: Missing crawler.manage_sources permission');
    }
    try {
      const res = await fetch(`/api/crawler/sources/${id}`, {
        method: 'DELETE',
        headers: this.buildHeaders()
      });
      if (res.ok) return true;
    } catch {}

    const source = crawlerStore.getSource(id);
    crawlerStore.addAuditLog({
      actorId: this.getCurrentUser().id,
      actorUsername: this.getCurrentUser().username,
      action: 'DELETE_SOURCE',
      sourceId: id,
      result: 'SUCCESS',
      details: `Deleted source "${source?.name || id}".`
    });
    return crawlerStore.deleteSource(id);
  },

  // Crawl Jobs API
  async getJobs(): Promise<CrawlJob[]> {
    try {
      const res = await fetch('/api/crawler/jobs');
      if (res.ok) return await res.json();
    } catch {}
    return crawlerStore.getJobs();
  },

  async createAndRunJob(sourceId: string, mode: CrawlMode = 'discover'): Promise<CrawlJob> {
    if (!this.hasPermission('crawler.run')) {
      throw new Error('403 Forbidden: Missing crawler.run permission');
    }

    const source = crawlerStore.getSource(sourceId);
    if (!source) throw new Error('Source not found');

    const job: CrawlJob = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sourceId,
      sourceName: source.name,
      mode,
      requestedBy: this.getCurrentUser().username,
      status: 'queued',
      progress: 5,
      startedAt: new Date().toISOString(),
      pagesDiscovered: 0,
      pagesFetched: 0,
      recordsExtracted: 0,
      recordsImported: 0,
      errorsCount: 0,
      errorLogs: [],
      currentAction: 'Enqueued in job runner'
    };

    crawlerStore.saveJob(job);

    // Trigger execution asynchronously
    setTimeout(() => {
      crawlerStore.executeCrawlJob(job.id);
    }, 100);

    return job;
  },

  async cancelJob(jobId: string): Promise<CrawlJob | null> {
    if (!this.hasPermission('crawler.cancel')) {
      throw new Error('403 Forbidden: Missing crawler.cancel permission');
    }
    const job = crawlerStore.getJob(jobId);
    if (job) {
      job.status = 'cancelled';
      job.currentAction = 'Cancelled by administrator';
      job.completedAt = new Date().toISOString();
      crawlerStore.saveJob(job);
      crawlerStore.addAuditLog({
        actorId: this.getCurrentUser().id,
        actorUsername: this.getCurrentUser().username,
        action: 'CANCEL_CRAWL',
        jobId,
        result: 'SUCCESS',
        details: `Cancelled active crawl job ${jobId}.`
      });
      return job;
    }
    return null;
  },

  async pauseJob(jobId: string): Promise<CrawlJob | null> {
    const job = crawlerStore.getJob(jobId);
    if (job && job.status === 'running') {
      job.status = 'paused';
      job.currentAction = 'Paused by administrator';
      crawlerStore.saveJob(job);
      crawlerStore.addAuditLog({
        actorId: this.getCurrentUser().id,
        actorUsername: this.getCurrentUser().username,
        action: 'PAUSE_CRAWL',
        jobId,
        result: 'SUCCESS',
        details: `Paused crawl job ${jobId}.`
      });
      return job;
    }
    return null;
  },

  // Import Queue API
  async getQueue(): Promise<ExtractedResource[]> {
    try {
      const res = await fetch('/api/crawler/queue');
      if (res.ok) return await res.json();
    } catch {}
    return crawlerStore.getQueue();
  },

  async reviewQueueItem(id: string, action: 'approve' | 'reject' | 'merge', rejectionReason?: string, duplicateTargetId?: string): Promise<ExtractedResource | null> {
    if (!this.hasPermission('crawler.import')) {
      throw new Error('403 Forbidden: Missing crawler.import permission');
    }

    const item = crawlerStore.getQueueItem(id);
    if (!item) return null;

    const user = this.getCurrentUser();
    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = user.username;

    if (action === 'approve') {
      item.status = 'approved';
      crawlerStore.addAuditLog({
        actorId: user.id,
        actorUsername: user.username,
        action: 'APPROVE_RESOURCE',
        resourceId: id,
        result: 'SUCCESS',
        details: `Approved extracted resource "${item.title}".`
      });
    } else if (action === 'reject') {
      item.status = 'rejected';
      item.rejectionReason = rejectionReason || 'Rejected by reviewer';
      crawlerStore.addAuditLog({
        actorId: user.id,
        actorUsername: user.username,
        action: 'REJECT_RESOURCE',
        resourceId: id,
        result: 'SUCCESS',
        details: `Rejected extracted resource "${item.title}". Reason: ${item.rejectionReason}`
      });
    } else if (action === 'merge') {
      item.status = 'duplicate_candidate';
      item.duplicateOfId = duplicateTargetId;
      crawlerStore.addAuditLog({
        actorId: user.id,
        actorUsername: user.username,
        action: 'MERGE_DUPLICATE',
        resourceId: id,
        result: 'SUCCESS',
        details: `Merged resource "${item.title}" with canonical target ${duplicateTargetId}.`
      });
    }

    return crawlerStore.saveQueueItem(item);
  },

  async publishQueueItem(id: string): Promise<ExtractedResource | null> {
    if (!this.hasPermission('crawler.publish')) {
      throw new Error('403 Forbidden: Missing crawler.publish permission');
    }

    const item = crawlerStore.getQueueItem(id);
    if (!item) return null;

    const user = this.getCurrentUser();
    item.status = 'published';
    item.publishedResourceId = `pub-${Date.now()}`;
    crawlerStore.saveQueueItem(item);

    crawlerStore.addAuditLog({
      actorId: user.id,
      actorUsername: user.username,
      action: 'PUBLISH_RESOURCE',
      resourceId: id,
      result: 'SUCCESS',
      details: `Published "${item.title}" into Career OS core ontology.`
    });

    return item;
  },

  // Audit Logs API
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch('/api/crawler/audit');
      if (res.ok) return await res.json();
    } catch {}
    return crawlerStore.getAuditLogs();
  },

  // Stats
  async getStats(): Promise<AdminCrawlerStats> {
    try {
      const res = await fetch('/api/crawler/stats');
      if (res.ok) return await res.json();
    } catch {}
    return crawlerStore.getStats();
  }
};
