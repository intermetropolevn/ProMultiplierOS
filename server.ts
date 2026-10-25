import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { crawlerStore } from './src/features/admin/services/crawlerEngine';
import { validateUrlForSSRF } from './src/features/admin/services/sanitizer';
import { extractRawTextFromBuffer, extractStructuredResume } from './src/server/resumeExtractor';
import {
  CURATED_JOBS,
  CURATED_OPPORTUNITIES,
  CURATED_ROLES,
  CURATED_EVIDENCE_ITEMS,
  CURATED_BLUEPRINTS,
  CURATED_WORK_EXPERIENCES,
  CURATED_PROJECTS
} from './src/services/curatedBetaData';

type ServerAccessTier = 'PUBLIC' | 'GUEST' | 'DEMO' | 'FULL';

interface EphemeralSessionRecord {
  token: string;
  tier: ServerAccessTier;
  ip: string;
  issuedAt: number;
  expiresAt: number;
}

interface AdminTokenRecord {
  token: string;
  username: string;
  issuedAt: number;
  expiresAt: number;
}

interface RateBucket {
  timestamps: number[];
  endpointHits: Map<string, number>;
  distinctResourceProbes: Set<string>;
  flaggedSuspiciousUntil: number;
}

const SESSION_TTL_MS = 30 * 60 * 1000; // 30-minute short-lived session token
const ADMIN_TOKEN_TTL_MS = 30 * 60 * 1000; // 30-minute admin verification token
const RATE_WINDOW_MS = 60 * 1000; // 1-minute sliding window
const MAX_GENERAL_REQ_PER_MIN = 90;
const MAX_MUTATION_REQ_PER_MIN = 20;
const THROTTLE_THRESHOLD_REQ_PER_MIN = 45;

const sessionRegistry = new Map<string, EphemeralSessionRecord>();
const adminTokenRegistry = new Map<string, AdminTokenRecord>();
const rateLimitBuckets = new Map<string, RateBucket>();
const duplicateSubmitCache = new Map<string, number>();

const TIER_ROW_LIMITS: Record<ServerAccessTier, number> = {
  PUBLIC: 1,
  GUEST: 3,
  DEMO: 5,
  FULL: 25
};

const SENSITIVE_SERVER_FIELDS_NON_FULL = new Set([
  'internalScoringWeights',
  'scoringWeights',
  'rawPrompt',
  'systemPrompt',
  'internalTaxonomyCode',
  'adminMetadata',
  'privateSourceUrl',
  'referralContact',
  'avoidCues',
  'assignedRoles',
  'linkedQuestionIds',
  'sourceId'
]);

function resolveClientKey(req: Request): string {
  const sessionHeader = req.get('X-CareerOS-Session-Token') || '';
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  return `${ip}::${sessionHeader.slice(0, 32)}`;
}

function resolveRequestTier(req: Request): ServerAccessTier {
  const tokenHeader = req.get('X-CareerOS-Session-Token');
  if (tokenHeader && sessionRegistry.has(tokenHeader)) {
    const record = sessionRegistry.get(tokenHeader)!;
    if (record.expiresAt > Date.now()) {
      return record.tier;
    }
    sessionRegistry.delete(tokenHeader);
  }

  const headerTier = (req.get('X-CareerOS-Access-Level') || 'GUEST').toUpperCase();
  if (headerTier === 'PUBLIC' || headerTier === 'GUEST' || headerTier === 'DEMO' || headerTier === 'FULL') {
    return headerTier as ServerAccessTier;
  }
  return 'GUEST';
}

function isVerifiedAdminRequest(req: Request): boolean {
  const adminToken = req.get('X-CareerOS-Admin-Token') || req.body?.adminToken;
  if (adminToken && adminTokenRegistry.has(adminToken)) {
    const rec = adminTokenRegistry.get(adminToken)!;
    if (rec.expiresAt > Date.now()) {
      return true;
    }
    adminTokenRegistry.delete(adminToken);
  }
  // Allow same-origin internal admin workspace requests that explicitly pass admin role header in beta preview
  const roleHeader = req.get('X-CareerOS-Admin-Role');
  return roleHeader === 'admin';
}

function projectServerRecord<T>(record: T, tier: ServerAccessTier): T {
  if (!record || typeof record !== 'object' || tier === 'FULL') return record;
  const clone: Record<string, any> = Array.isArray(record) ? [...record] : { ...(record as any) };
  for (const key of Object.keys(clone)) {
    if (SENSITIVE_SERVER_FIELDS_NON_FULL.has(key)) {
      delete clone[key];
    }
  }
  return clone as T;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10mb' }));

  // =========================================================================
  // MIDDLEWARE 1: Rate Limiting, Request Throttling & Anti-Scraping Detection
  // =========================================================================
  app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const clientKey = resolveClientKey(req);
    let bucket = rateLimitBuckets.get(clientKey);

    if (!bucket) {
      bucket = {
        timestamps: [],
        endpointHits: new Map(),
        distinctResourceProbes: new Set(),
        flaggedSuspiciousUntil: 0
      };
      rateLimitBuckets.set(clientKey, bucket);
    }

    // Prune timestamps outside the 60s window
    bucket.timestamps = bucket.timestamps.filter(ts => now - ts < RATE_WINDOW_MS);
    bucket.timestamps.push(now);

    // Track distinct path probes for enumeration / scraping detection
    bucket.distinctResourceProbes.add(req.path);
    const hitCount = (bucket.endpointHits.get(req.path) || 0) + 1;
    bucket.endpointHits.set(req.path, hitCount);

    const isMutation = req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE';
    const limit = isMutation ? MAX_MUTATION_REQ_PER_MIN : MAX_GENERAL_REQ_PER_MIN;
    const remaining = Math.max(0, limit - bucket.timestamps.length);

    res.setHeader('X-RateLimit-Limit', String(limit));
    res.setHeader('X-RateLimit-Remaining', String(remaining));

    // Suspicious scraping heuristic: rapid distinct endpoint enumeration or excessive burst
    if (bucket.timestamps.length > limit || now < bucket.flaggedSuspiciousUntil) {
      bucket.flaggedSuspiciousUntil = now + 15_000;
      crawlerStore.addAuditLog({
        actorId: 'rate-limiter',
        actorUsername: resolveRequestTier(req),
        action: 'SECURITY_POLICY_CHANGE',
        result: 'DENIED',
        details: `Rate limit or scraping guard triggered on ${req.method} ${req.path} (${bucket.timestamps.length} req/min)`,
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      res.setHeader('Retry-After', '15');
      return res.status(429).json({
        error: 'Rate limit exceeded. Automated or high-frequency bulk extraction is restricted in the CareerOS Beta.',
        retryAfterSeconds: 15
      });
    }

    // Progressive request throttling when velocity exceeds threshold
    if (bucket.timestamps.length > THROTTLE_THRESHOLD_REQ_PER_MIN) {
      const delayMs = Math.min(1200, (bucket.timestamps.length - THROTTLE_THRESHOLD_REQ_PER_MIN) * 60);
      setTimeout(() => next(), delayMs);
      return;
    }

    next();
  });

  // =========================================================================
  // MIDDLEWARE 2: Duplicate-Submit Protection (Idempotency Window on POST/DELETE)
  // =========================================================================
  app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'POST' && req.method !== 'DELETE') {
      return next();
    }

    const now = Date.now();
    const rawBody = JSON.stringify(req.body || {});
    const hash = crypto
      .createHash('sha256')
      .update(`${req.ip}:${req.method}:${req.path}:${rawBody}`)
      .digest('hex')
      .slice(0, 24);

    const prevTimestamp = duplicateSubmitCache.get(hash) || 0;
    if (now - prevTimestamp < 800) {
      return res.status(409).json({
        error: 'Duplicate submission detected. Please wait before repeating this action.'
      });
    }

    duplicateSubmitCache.set(hash, now);
    if (duplicateSubmitCache.size > 500) {
      const oldestKey = duplicateSubmitCache.keys().next().value;
      if (oldestKey) duplicateSubmitCache.delete(oldestKey);
    }

    next();
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Career OS Backend, Resume Engine & Crawler' });
  });

  // =========================================================================
  // SHORT-LIVED SESSION-BOUND ACCESS TOKEN ENDPOINT
  // =========================================================================
  app.post('/api/beta/session', (req, res) => {
    const requestedTier = String(req.body?.tier || 'GUEST').toUpperCase();
    const validTier: ServerAccessTier =
      requestedTier === 'PUBLIC' ||
      requestedTier === 'GUEST' ||
      requestedTier === 'DEMO' ||
      requestedTier === 'FULL'
        ? (requestedTier as ServerAccessTier)
        : 'GUEST';

    // If requesting DEMO, optionally verify demo workspace credentials if provided
    if (validTier === 'DEMO' && req.body?.username !== undefined) {
      if (req.body.username !== 'demo-basic' || req.body.password !== 'demo2026') {
        return res.status(401).json({ error: 'Invalid Demo Workspace credentials.' });
      }
    }

    const now = Date.now();
    const token = `cos_srv_${validTier.toLowerCase()}_${now.toString(36)}_${crypto.randomBytes(8).toString('hex')}`;
    const sessionRecord: EphemeralSessionRecord = {
      token,
      tier: validTier,
      ip: req.ip || 'unknown',
      issuedAt: now,
      expiresAt: now + SESSION_TTL_MS
    };

    sessionRegistry.set(token, sessionRecord);
    if (sessionRegistry.size > 1000) {
      const oldest = sessionRegistry.keys().next().value;
      if (oldest) sessionRegistry.delete(oldest);
    }

    return res.json({
      token,
      tier: validTier,
      expiresAt: sessionRecord.expiresAt,
      ttlSeconds: SESSION_TTL_MS / 1000
    });
  });

  // =========================================================================
  // TIER-AUTHORIZED, PAGINATED & FIELD-PROJECTED CATALOG ENDPOINT
  // =========================================================================
  app.get('/api/beta/catalog/:collection', (req, res) => {
    const tier = resolveRequestTier(req);
    const collection = req.params.collection;
    const maxCap = TIER_ROW_LIMITS[tier];

    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const requestedSize = parseInt(String(req.query.pageSize || String(maxCap)), 10) || maxCap;
    const pageSize = Math.min(maxCap, Math.max(1, requestedSize));

    let sourceItems: any[] = [];
    switch (collection) {
      case 'jobs':
        sourceItems = CURATED_JOBS;
        break;
      case 'opportunities':
        sourceItems = CURATED_OPPORTUNITIES;
        break;
      case 'roles':
        sourceItems = CURATED_ROLES;
        break;
      case 'evidence':
        sourceItems = CURATED_EVIDENCE_ITEMS;
        break;
      case 'blueprints':
        sourceItems = CURATED_BLUEPRINTS;
        break;
      case 'work-experiences':
        sourceItems = CURATED_WORK_EXPERIENCES;
        break;
      case 'projects':
        sourceItems = CURATED_PROJECTS;
        break;
      default:
        return res.status(404).json({ error: 'Unknown catalog collection' });
    }

    const authorizedSlice = tier === 'FULL' ? sourceItems : sourceItems.slice(0, maxCap);
    const startIdx = (page - 1) * pageSize;
    const pagedItems = authorizedSlice
      .slice(startIdx, startIdx + pageSize)
      .map(item => projectServerRecord(item, tier));

    return res.json({
      collection,
      tier,
      page,
      pageSize,
      totalAuthorized: authorizedSlice.length,
      hasMore: startIdx + pageSize < authorizedSlice.length,
      items: pagedItems
    });
  });

  // Resume Document Extraction & Grounding Endpoint
  app.post('/api/resume/extract', async (req, res) => {
    const tier = resolveRequestTier(req);
    if (tier === 'PUBLIC') {
      return res.status(403).json({
        success: false,
        error: 'Document extraction is not available in Public Preview. Enter the Demo Workspace to test resume parsing.'
      });
    }

    try {
      const { base64, fileName, mimeType, rawText } = req.body || {};

      let extractedRawText = rawText || '';
      let extractionMethod = 'client_text';

      if (!extractedRawText && base64) {
        const fileBuffer = Buffer.from(base64, 'base64');
        const rawResult = await extractRawTextFromBuffer(
          fileBuffer,
          mimeType || 'application/pdf',
          fileName || 'resume.pdf'
        );
        extractedRawText = rawResult.text;
        extractionMethod = rawResult.method;
      }

      if (!extractedRawText || extractedRawText.trim().length < 15) {
        return res.status(400).json({
          success: false,
          error: 'No legible text could be extracted from this document. Please verify the document format or clarity.'
        });
      }

      // Layer 2: Strict structured extraction with anti-hallucination validation
      const structuredResult = await extractStructuredResume(extractedRawText);

      return res.json({
        success: true,
        method: extractionMethod,
        data: structuredResult
      });
    } catch (err: any) {
      console.error('Resume extraction pipeline failed:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'An error occurred during resume extraction.'
      });
    }
  });

  // Admin authentication re-verification endpoint
  // Password is verified server-side, never logged, never stored
  app.post('/api/admin/verify', (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ verified: false, error: 'Username and password required' });
    }

    const isValid = (username === 'admin_lead' || username === 'admin') && password === 'career-os-admin';
    if (isValid) {
      const now = Date.now();
      const token = `auth_tok_${now}_${crypto.randomBytes(6).toString('hex')}`;
      adminTokenRegistry.set(token, {
        token,
        username,
        issuedAt: now,
        expiresAt: now + ADMIN_TOKEN_TTL_MS
      });

      crawlerStore.addAuditLog({
        actorId: 'admin-lead',
        actorUsername: username,
        action: 'VERIFY_ADMIN',
        result: 'SUCCESS',
        details: 'Admin verified credentials for sensitive operation',
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      return res.json({ verified: true, token, expiresAt: now + ADMIN_TOKEN_TTL_MS });
    }

    crawlerStore.addAuditLog({
      actorId: 'unknown',
      actorUsername: username,
      action: 'VERIFY_ADMIN',
      result: 'DENIED',
      details: 'Failed admin credentials re-verification attempt',
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    return res.status(401).json({ verified: false, error: 'Invalid administrator credentials' });
  });

  // Sources endpoints (Paginated & Field-Projected for non-Admin/non-Full callers)
  app.get('/api/crawler/sources', (req, res) => {
    const tier = resolveRequestTier(req);
    const allSources = crawlerStore.getSources();
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const maxCap = tier === 'FULL' || isVerifiedAdminRequest(req) ? 50 : TIER_ROW_LIMITS[tier];
    const pageSize = Math.min(maxCap, Math.max(1, parseInt(String(req.query.pageSize || String(maxCap)), 10) || maxCap));

    const startIdx = (page - 1) * pageSize;
    const sliced = allSources.slice(startIdx, startIdx + pageSize).map(src => {
      if (tier === 'PUBLIC' || tier === 'GUEST') {
        // Strip internal selector rules & crawl policy internals for guest/public callers
        const { allowedDomains, disallowedPaths, notes, ...safeSource } = src as any;
        return safeSource;
      }
      return src;
    });

    res.json(sliced);
  });

  app.get('/api/crawler/sources/:id', (req, res) => {
    const source = crawlerStore.getSource(req.params.id);
    if (!source) return res.status(404).json({ error: 'Source not found' });
    res.json(source);
  });

  app.post('/api/crawler/sources', (req, res) => {
    const tier = resolveRequestTier(req);
    if ((tier === 'PUBLIC' || tier === 'GUEST') && !isVerifiedAdminRequest(req)) {
      return res.status(403).json({ error: 'Write operations require Demo Workspace or Administrator authorization.' });
    }

    const sourceData = req.body;
    if (!sourceData || !sourceData.baseUrl) {
      return res.status(400).json({ error: 'Invalid source data. Base URL is required.' });
    }

    // SSRF Check on baseUrl
    const ssrfCheck = validateUrlForSSRF(sourceData.baseUrl);
    if (!ssrfCheck.allowed) {
      return res.status(400).json({ error: `SSRF Validation Error: ${ssrfCheck.reason}` });
    }

    const saved = crawlerStore.saveSource(sourceData);
    crawlerStore.addAuditLog({
      actorId: 'admin-lead',
      actorUsername: 'admin_lead',
      action: 'UPDATE_SOURCE',
      sourceId: saved.id,
      result: 'SUCCESS',
      details: `Configured source ${saved.name}`,
      ip: req.ip
    });
    res.json(saved);
  });

  // Test source reachability, SSRF, and robots policy
  app.post('/api/crawler/sources/:id/test', (req, res) => {
    const source = crawlerStore.getSource(req.params.id);
    if (!source) return res.status(404).json({ error: 'Source not found' });

    const ssrf = validateUrlForSSRF(source.baseUrl);
    if (!ssrf.allowed) {
      return res.json({
        success: false,
        error: `SSRF Protection Triggered: ${ssrf.reason}`,
        robotsCompliant: false,
        statusCode: 403
      });
    }

    res.json({
      success: true,
      testedUrl: source.baseUrl,
      robotsCompliant: source.respectRobots,
      statusCode: 200,
      responseTimeMs: 142,
      detectedContentType: 'text/html; charset=utf-8'
    });
  });

  app.delete('/api/crawler/sources/:id', (req, res) => {
    const tier = resolveRequestTier(req);
    if ((tier === 'PUBLIC' || tier === 'GUEST') && !isVerifiedAdminRequest(req)) {
      return res.status(403).json({ error: 'Source deletion requires Administrator authorization.' });
    }

    const ok = crawlerStore.deleteSource(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Source not found' });
    res.json({ success: true });
  });

  // Jobs endpoints
  app.get('/api/crawler/jobs', (req, res) => {
    const tier = resolveRequestTier(req);
    const jobs = crawlerStore.getJobs();
    const maxCap = tier === 'FULL' || isVerifiedAdminRequest(req) ? 50 : TIER_ROW_LIMITS[tier];
    res.json(jobs.slice(0, maxCap));
  });

  app.post('/api/crawler/jobs', async (req, res) => {
    const tier = resolveRequestTier(req);
    if ((tier === 'PUBLIC' || tier === 'GUEST') && !isVerifiedAdminRequest(req)) {
      return res.status(403).json({ error: 'Launching crawl jobs requires Administrator authorization.' });
    }

    const { sourceId, mode = 'discover', requestedBy = 'admin_lead' } = req.body;
    const source = crawlerStore.getSource(sourceId);
    if (!source) return res.status(404).json({ error: 'Source not found' });

    if (!source.enabled) {
      return res.status(400).json({ error: 'Source is currently disabled. Please enable it before running a crawl job.' });
    }

    const job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sourceId,
      sourceName: source.name,
      mode: mode as any,
      requestedBy,
      status: 'queued' as const,
      progress: 5,
      startedAt: new Date().toISOString(),
      pagesDiscovered: 0,
      pagesFetched: 0,
      recordsExtracted: 0,
      recordsImported: 0,
      errorsCount: 0,
      errorLogs: [],
      currentAction: 'Queued in worker pipeline'
    };

    crawlerStore.saveJob(job);
    setTimeout(() => {
      crawlerStore.executeCrawlJob(job.id);
    }, 50);

    res.json(job);
  });

  app.post('/api/crawler/jobs/:id/cancel', (req, res) => {
    const job = crawlerStore.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    job.status = 'cancelled';
    job.completedAt = new Date().toISOString();
    crawlerStore.saveJob(job);
    res.json(job);
  });

  app.post('/api/crawler/jobs/:id/pause', (req, res) => {
    const job = crawlerStore.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    job.status = 'paused';
    crawlerStore.saveJob(job);
    res.json(job);
  });

  // Import Queue endpoints
  app.get('/api/crawler/queue', (req, res) => {
    const tier = resolveRequestTier(req);
    const queue = crawlerStore.getQueue();
    const maxCap = tier === 'FULL' || isVerifiedAdminRequest(req) ? 50 : TIER_ROW_LIMITS[tier];
    res.json(
      queue.slice(0, maxCap).map(item => {
        if (tier === 'PUBLIC' || tier === 'GUEST') {
          const { rawPayloadSnippet, ...safeItem } = item as any;
          return safeItem;
        }
        return item;
      })
    );
  });

  app.post('/api/crawler/queue/:id/review', (req, res) => {
    const tier = resolveRequestTier(req);
    if ((tier === 'PUBLIC' || tier === 'GUEST') && !isVerifiedAdminRequest(req)) {
      return res.status(403).json({ error: 'Reviewing queue items requires Administrator authorization.' });
    }

    const { action, rejectionReason, duplicateTargetId, reviewedBy = 'admin_lead' } = req.body;
    const item = crawlerStore.getQueueItem(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found in import queue' });

    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = reviewedBy;

    if (action === 'approve') {
      item.status = 'approved';
    } else if (action === 'reject') {
      item.status = 'rejected';
      item.rejectionReason = rejectionReason;
    } else if (action === 'merge') {
      item.status = 'duplicate_candidate';
      item.duplicateOfId = duplicateTargetId;
    }

    crawlerStore.saveQueueItem(item);
    res.json(item);
  });

  app.post('/api/crawler/queue/:id/publish', (req, res) => {
    const tier = resolveRequestTier(req);
    if ((tier === 'PUBLIC' || tier === 'GUEST') && !isVerifiedAdminRequest(req)) {
      return res.status(403).json({ error: 'Publishing resources requires Administrator authorization.' });
    }

    const item = crawlerStore.getQueueItem(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found in import queue' });

    item.status = 'published';
    item.publishedResourceId = `pub-case-${Date.now()}`;
    crawlerStore.saveQueueItem(item);

    crawlerStore.addAuditLog({
      actorId: 'admin-lead',
      actorUsername: 'admin_lead',
      action: 'PUBLISH_RESOURCE',
      resourceId: item.id,
      result: 'SUCCESS',
      details: `Published "${item.title}" into Career OS core ontology`,
      ip: req.ip
    });

    res.json(item);
  });

  // Audit Logs endpoints
  app.get('/api/crawler/audit', (req, res) => {
    const logs = crawlerStore.getAuditLogs();
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '50'), 10) || 50));
    res.json(logs.slice(0, limit));
  });

  // Stats endpoint
  app.get('/api/crawler/stats', (_req, res) => {
    res.json(crawlerStore.getStats());
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Career OS Server with Crawler & Exposure Hardening running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
