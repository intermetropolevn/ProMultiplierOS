/**
 * CareerOS Beta — Data Exposure, Field Projection, Pagination & Anti-Scraping Guard Service
 *
 * Implements defense-in-depth at the client service & local persistence layer:
 * 1. Tier-aware Row-Level Authorization & Data-Layer Pagination (PUBLIC: 1, GUEST: 3, DEMO: 5+2, FULL: paginated)
 * 2. Field-Level Projection (strips internal scoring weights, rubric internals, graph edge IDs, admin metadata, and private contacts/URLs for non-FULL tiers)
 * 3. Write Authorization (strictly blocks writes/imports/exports in PUBLIC and GUEST tiers; isolates DEMO writes)
 * 4. LocalStorage Exposure Prevention (prevents dumping full seed catalogs into browser localStorage during PUBLIC/GUEST/DEMO sessions)
 * 5. Duplicate-Submit Protection (idempotency fingerprint & cooldown window)
 * 6. Basic Suspicious Scraping & Enumeration Detection (burst read & sequential ID probe detection)
 * 7. Short-Lived Session-Bound Token Management (30-minute rolling TTL bound to active access tier)
 * 8. Structured Security & Data Exposure Audit Logging
 */

import type { BetaAccessLevel } from './accessControlService';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalAuthorized: number;
  hasMore: boolean;
  tier: BetaAccessLevel;
}

export interface SecurityAuditEvent {
  id: string;
  timestamp: string;
  eventType:
    | 'ACCESS_CHECK_DENIED'
    | 'WRITE_BLOCKED'
    | 'EXPORT_BLOCKED'
    | 'DUPLICATE_SUBMIT_BLOCKED'
    | 'RATE_LIMIT_THROTTLED'
    | 'SUSPICIOUS_ENUMERATION_DETECTED'
    | 'ROW_UNAUTHORIZED_PROBE'
    | 'SESSION_TOKEN_ISSUED'
    | 'SESSION_TOKEN_EXPIRED';
  tier: BetaAccessLevel;
  resource: string;
  action: string;
  details: string;
}

export interface SessionBoundToken {
  token: string;
  tier: BetaAccessLevel;
  issuedAt: number;
  expiresAt: number;
  sessionId: string;
}

const SESSION_TOKEN_STORAGE_KEY = 'careeros_ephemeral_session_token_v1';
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes short-lived session token
const MAX_AUDIT_LOGS = 150;

/**
 * Maximum records allowed at the data layer per collection query by tier
 */
export const TIER_ROW_CAPS: Record<BetaAccessLevel, number> = {
  PUBLIC: 1,
  GUEST: 3,
  DEMO: 7, // Up to 5 curated + 2 demo-created
  FULL: 50 // Default page cap per query in Full mode
};

/**
 * Sensitive / internal fields stripped from PUBLIC and GUEST responses
 * so raw objects in memory or component props never carry hidden internal metadata.
 */
const SENSITIVE_INTERNAL_FIELDS_GUEST: ReadonlySet<string> = new Set([
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
  'stateHistory',
  'jobStatusOverrides',
  'deletedJobIds',
  'archivedRoleIds'
]);

const SENSITIVE_INTERNAL_FIELDS_DEMO: ReadonlySet<string> = new Set([
  'internalScoringWeights',
  'scoringWeights',
  'rawPrompt',
  'systemPrompt',
  'internalTaxonomyCode',
  'adminMetadata',
  'privateSourceUrl'
]);

class DataExposureGuardManager {
  private auditLogs: SecurityAuditEvent[] = [];
  private mutationFingerprints: Map<string, number> = new Map();
  private readTimestamps: number[] = [];
  private idProbeWindow: { timestamp: number; resource: string; id: string }[] = [];
  private isThrottledUntil: number = 0;

  /**
   * Resolves current active access tier safely without circular dependency issues
   */
  public resolveActiveTier(explicitTier?: BetaAccessLevel): BetaAccessLevel {
    if (explicitTier) return explicitTier;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('careeros_beta_access_level') as BetaAccessLevel | null;
        if (stored === 'PUBLIC' || stored === 'GUEST' || stored === 'DEMO' || stored === 'FULL') {
          return stored;
        }
      } catch {
        // Ignore storage read error
      }
    }
    return 'GUEST';
  }

  /**
   * 12. Short-Lived / Session-Bound Access Token Management
   */
  public getOrIssueSessionToken(tier?: BetaAccessLevel): SessionBoundToken {
    const activeTier = this.resolveActiveTier(tier);
    const now = Date.now();

    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as SessionBoundToken;
          if (parsed && parsed.expiresAt > now && parsed.tier === activeTier) {
            return parsed;
          }
          if (parsed && parsed.expiresAt <= now) {
            this.recordAuditEvent(
              'SESSION_TOKEN_EXPIRED',
              activeTier,
              'session',
              'validate_token',
              'Ephemeral session token expired; rotating token.'
            );
          }
        }
      } catch {
        // Fallback to new token
      }
    }

    const sessionId = `sess_${Math.random().toString(36).substring(2, 10)}`;
    const entropy = Math.random().toString(36).substring(2, 12);
    const tokenObj: SessionBoundToken = {
      token: `cos_${activeTier.toLowerCase()}_${now.toString(36)}_${entropy}`,
      tier: activeTier,
      issuedAt: now,
      expiresAt: now + SESSION_TTL_MS,
      sessionId
    };

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, JSON.stringify(tokenObj));
      } catch {
        // Ignore
      }
    }

    return tokenObj;
  }

  /**
   * Builds standard security headers for backend API calls
   */
  public getSecurityHeaders(tier?: BetaAccessLevel): Record<string, string> {
    const tokenObj = this.getOrIssueSessionToken(tier);
    return {
      'X-CareerOS-Session-Token': tokenObj.token,
      'X-CareerOS-Access-Level': tokenObj.tier,
      'X-CareerOS-Client-Timestamp': String(Date.now())
    };
  }

  /**
   * 7. LocalStorage Exposure Guard:
   * Prevents writing full static catalogs into browser localStorage when the user is in PUBLIC or GUEST mode
   * (or when DEMO mode uses its own isolated sandbox key).
   */
  public canPersistFullCatalogToStorage(tier?: BetaAccessLevel): boolean {
    const activeTier = this.resolveActiveTier(tier);
    return activeTier === 'FULL';
  }

  /**
   * Purges any legacy full-catalog keys from localStorage when running in PUBLIC or GUEST mode
   * so inspecting Application -> LocalStorage does not leak the full knowledge pool.
   */
  public sanitizeUnauthorizedLocalStorage(tier?: BetaAccessLevel): void {
    if (typeof window === 'undefined') return;
    const activeTier = this.resolveActiveTier(tier);
    if (activeTier === 'FULL') return;

    const fullCatalogStorageKeys = [
      'career_os_sources_registry_v1',
      'career_os_civic_systems_v3',
      'career_os_innovation_systems_v3',
      'career_os_tools_platforms_v3',
      'career_os_work_pathways_v3',
      'career_os_profile_evidence_v2',
      'career_os_profile_stories_v2',
      'career_os_profile_blueprints_v2',
      'career_os_profile_metrics_v2',
      'career_os_work_experiences_v1',
      'career_os_projects_v2',
      'career_os_opportunities_v2',
      'career_os_builder_match_opportunities_v1',
      'career_os_builder_match_builders_v1',
      'career_os_builder_match_teams_v1',
      'career_os_applications_v1',
      'career_os_wishlist_v1'
    ];

    try {
      for (const key of fullCatalogStorageKeys) {
        if (localStorage.getItem(key) !== null) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }

  /**
   * 8. Write Authorization Guard
   */
  public assertWriteAuthorized(
    resource: string,
    action: 'create' | 'update' | 'delete' | 'import' | 'export',
    tier?: BetaAccessLevel
  ): { allowed: boolean; reason?: string } {
    const activeTier = this.resolveActiveTier(tier);

    if (action === 'export') {
      if (activeTier !== 'FULL') {
        this.recordAuditEvent(
          'EXPORT_BLOCKED',
          activeTier,
          resource,
          action,
          `Blocked bulk export on ${resource} for tier ${activeTier}`
        );
        return {
          allowed: false,
          reason: 'Bulk data export is restricted to Full CareerOS Access.'
        };
      }
      return { allowed: true };
    }

    if (activeTier === 'PUBLIC' || activeTier === 'GUEST') {
      this.recordAuditEvent(
        'WRITE_BLOCKED',
        activeTier,
        resource,
        action,
        `Blocked unauthorized ${action} on ${resource} in ${activeTier} mode`
      );
      return {
        allowed: false,
        reason: `${activeTier === 'PUBLIC' ? 'Public Preview' : 'Guest mode'} is read-only. Enter the Demo Workspace to modify records.`
      };
    }

    return { allowed: true };
  }

  /**
   * 10. Duplicate-Submit Protection (Idempotency / Cooldown Guard)
   */
  public checkDuplicateSubmit(
    resource: string,
    operationKey: string,
    cooldownMs: number = 600
  ): boolean {
    const now = Date.now();
    const compositeKey = `${resource}:${operationKey}`;
    const lastSubmittedAt = this.mutationFingerprints.get(compositeKey) || 0;

    if (now - lastSubmittedAt < cooldownMs) {
      this.recordAuditEvent(
        'DUPLICATE_SUBMIT_BLOCKED',
        this.resolveActiveTier(),
        resource,
        operationKey,
        ` suppressed rapid duplicate submission within ${cooldownMs}ms window.`
      );
      return false;
    }

    this.mutationFingerprints.set(compositeKey, now);
    // Keep map bounded
    if (this.mutationFingerprints.size > 200) {
      const oldestKey = this.mutationFingerprints.keys().next().value;
      if (oldestKey) this.mutationFingerprints.delete(oldestKey);
    }
    return true;
  }

  /**
   * 4, 5 & 11. Client-Side Rate / Burst & Suspicious Scraping Detection
   */
  public recordDataAccessAndCheckScraping(resource: string, recordId?: string): {
    isSuspicious: boolean;
    throttled: boolean;
  } {
    const now = Date.now();
    const activeTier = this.resolveActiveTier();

    // Clean timestamps older than 5 seconds
    this.readTimestamps = this.readTimestamps.filter(ts => now - ts < 5000);
    this.readTimestamps.push(now);

    if (recordId) {
      this.idProbeWindow = this.idProbeWindow.filter(p => now - p.timestamp < 10000);
      this.idProbeWindow.push({ timestamp: now, resource, id: recordId });

      // Detect rapid distinct ID enumeration (> 15 distinct IDs probed in 10s by non-FULL user)
      if (activeTier !== 'FULL') {
        const distinctIds = new Set(
          this.idProbeWindow.filter(p => p.resource === resource).map(p => p.id)
        );
        if (distinctIds.size > 15) {
          this.isThrottledUntil = now + 5000;
          this.recordAuditEvent(
            'SUSPICIOUS_ENUMERATION_DETECTED',
            activeTier,
            resource,
            'id_enumeration',
            `Detected ${distinctIds.size} rapid distinct ID lookups on ${resource} within 10s.`
          );
          return { isSuspicious: true, throttled: true };
        }
      }
    }

    // Detect abnormally high burst reads (> 120 service reads in 5s)
    if (this.readTimestamps.length > 120 && activeTier !== 'FULL') {
      this.isThrottledUntil = now + 3000;
      this.recordAuditEvent(
        'RATE_LIMIT_THROTTLED',
        activeTier,
        resource,
        'burst_read',
        `High-frequency data access burst (${this.readTimestamps.length} calls / 5s) throttled.`
      );
      return { isSuspicious: true, throttled: true };
    }

    return {
      isSuspicious: false,
      throttled: now < this.isThrottledUntil
    };
  }

  /**
   * 2. Field-Level Projection per Access Tier
   * Clones and strips internal/sensitive properties before returning records to callers.
   */
  public projectRecordForTier<T>(record: T, tier?: BetaAccessLevel): T {
    if (!record || typeof record !== 'object') return record;
    const activeTier = this.resolveActiveTier(tier);
    if (activeTier === 'FULL') {
      return record;
    }

    const forbiddenFields =
      activeTier === 'DEMO' ? SENSITIVE_INTERNAL_FIELDS_DEMO : SENSITIVE_INTERNAL_FIELDS_GUEST;

    const clone: Record<string, any> = Array.isArray(record) ? [...record] : { ...(record as any) };

    for (const key of Object.keys(clone)) {
      if (forbiddenFields.has(key)) {
        delete clone[key];
      }
    }

    // Additional targeted projections for PUBLIC / GUEST
    if (activeTier === 'PUBLIC' || activeTier === 'GUEST') {
      // Sanitize NormalizedSource internal metadata & assessment feedback
      if ('sourceFamily' in clone && 'evidenceStrength' in clone) {
        if (clone.metadata && typeof clone.metadata === 'object') {
          const { credentialId, score, ...safeMeta } = clone.metadata;
          clone.metadata = safeMeta;
        }
        if (clone.assessmentData && typeof clone.assessmentData === 'object') {
          clone.assessmentData = {
            assessmentType: clone.assessmentData.assessmentType,
            result: clone.assessmentData.result
          };
        }
        if (Array.isArray(clone.inferredKnowledge) && clone.inferredKnowledge.length > 3) {
          clone.inferredKnowledge = clone.inferredKnowledge.slice(0, 3);
        }
      }

      // Sanitize StructuredAnswerBlueprint internal rubric cues in PUBLIC preview
      if (activeTier === 'PUBLIC' && 'framework' in clone && clone.components) {
        clone.components = {
          ...clone.components,
          avoidCues: undefined
        };
      }
    }

    return clone as T;
  }

  /**
   * Projects an array of records for the active access tier
   */
  public projectCollectionForTier<T>(items: T[], tier?: BetaAccessLevel): T[] {
    const activeTier = this.resolveActiveTier(tier);
    if (activeTier === 'FULL') return items;
    return items.map(item => this.projectRecordForTier(item, activeTier));
  }

  /**
   * 3 & 6. Row-Level Authorization & Data-Layer Pagination
   */
  public paginateAndProject<T>(
    resource: string,
    authorizedItems: T[],
    pagination?: PaginationParams,
    tier?: BetaAccessLevel
  ): PaginatedResult<T> {
    const activeTier = this.resolveActiveTier(tier);
    const { throttled } = this.recordDataAccessAndCheckScraping(resource);

    const maxTierCap = throttled ? 1 : TIER_ROW_CAPS[activeTier];
    const cappedPool =
      activeTier === 'FULL' ? authorizedItems : authorizedItems.slice(0, maxTierCap);

    const requestedPage = Math.max(1, pagination?.page || 1);
    const requestedPageSize = Math.min(
      maxTierCap,
      Math.max(1, pagination?.pageSize || maxTierCap)
    );

    const startIndex = (requestedPage - 1) * requestedPageSize;
    const sliced = cappedPool.slice(startIndex, startIndex + requestedPageSize);
    const projected = this.projectCollectionForTier(sliced, activeTier);

    return {
      items: projected,
      page: requestedPage,
      pageSize: requestedPageSize,
      totalAuthorized: cappedPool.length,
      hasMore: startIndex + requestedPageSize < cappedPool.length,
      tier: activeTier
    };
  }

  /**
   * Enforces Row-Level Authorization on single-record ID lookups (`getById`).
   * Prevents a PUBLIC or GUEST user from probing arbitrary IDs outside their authorized slice.
   */
  public authorizeSingleRecordLookup<T extends { id: string }>(
    resource: string,
    id: string,
    authorizedPool: T[],
    tier?: BetaAccessLevel
  ): T | undefined {
    const activeTier = this.resolveActiveTier(tier);
    this.recordDataAccessAndCheckScraping(resource, id);

    const found = authorizedPool.find(item => item.id === id);
    if (!found) {
      if (activeTier !== 'FULL') {
        this.recordAuditEvent(
          'ROW_UNAUTHORIZED_PROBE',
          activeTier,
          resource,
          'get_by_id',
          `Blocked lookup for unauthorized or non-curated record ID "${id}" in ${activeTier} tier.`
        );
      }
      return undefined;
    }

    return this.projectRecordForTier(found, activeTier);
  }

  /**
   * 9. Security & Data Exposure Audit Logging
   */
  public recordAuditEvent(
    eventType: SecurityAuditEvent['eventType'],
    tier: BetaAccessLevel,
    resource: string,
    action: string,
    details: string
  ): void {
    const entry: SecurityAuditEvent = {
      id: `sec_aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      eventType,
      tier,
      resource,
      action,
      details
    };

    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > MAX_AUDIT_LOGS) {
      this.auditLogs.length = MAX_AUDIT_LOGS;
    }
  }

  public getAuditLogs(): SecurityAuditEvent[] {
    return [...this.auditLogs];
  }
}

export const dataExposureGuard = new DataExposureGuardManager();
