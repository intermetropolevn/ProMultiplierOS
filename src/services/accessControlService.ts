/**
 * CareerOS / ProMultiplier OS — Centralized Access Control & First-Session Guest Architecture
 * 
 * Four User-Facing Access Levels:
 * L0 — PUBLIC: Anonymous visitor / marketing preview (1 sample record, no meaningful creation)
 * L1 — GUEST: First-session / returning guest with curated read-only exploration (~3 records/module, advanced intelligence locked)
 * L2 — DEMO: Controlled Demo Workspace with expanded curated data & limited write capabilities (max 2 created items/workflow)
 * L3 — FULL: Full CareerOS access / approved workspace (unlimited creation, full data pool, intelligence, AI, exports)
 * 
 * Five First-Session & Guest Lifecycle States:
 * - FIRST_VISIT: Visitor entering CareerOS for the first time in a new browser/session (starts in GUEST mode)
 * - RETURNING_GUEST: Guest who has explored or dismissed the initial prompt and continues exploring
 * - DEMO_AVAILABLE: Guest who has completed meaningful interaction; contextual Demo Workspace prompt is available
 * - DEMO_ACTIVE: Authenticated in Demo Workspace (demo-basic / demo2026)
 * - FULL_ACCESS_REQUESTED: User has requested or activated Full CareerOS access
 * 
 * Internal ADMIN/OWNER permissions are kept completely separate from these public beta levels.
 */

import { useState, useEffect } from 'react';
import { demoWorkspaceService, DemoEntityCategory } from './demoWorkspaceService';
import { dataExposureGuard } from './dataExposureGuardService';
import { seatRequestService } from './seatRequestService';

export type BetaAccessLevel = 'PUBLIC' | 'GUEST' | 'DEMO' | 'FULL';
export type AccessLevel = BetaAccessLevel;
export type UserRole = 'USER' | 'ADMIN' | 'OWNER';

export type GuestSessionState =
  | 'FIRST_VISIT'
  | 'RETURNING_GUEST'
  | 'DEMO_AVAILABLE'
  | 'DEMO_ACTIVE'
  | 'FULL_ACCESS_REQUESTED';

export const DEMO_WORKSPACE_CREDENTIALS = {
  username: 'demo-basic',
  password: 'demo2026'
} as const;

export interface CareerOsUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  accessLevel: BetaAccessLevel;
  sessionState: GuestSessionState;
  role: UserRole;
  isAdmin: boolean;
  isOwner: boolean;
}

export interface AccessCapabilities {
  canViewBasicData: boolean;
  canViewCuratedData: boolean;
  canViewIntelligence: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canUseAI: boolean;
  canExport: boolean;
  canStartBuild: boolean;
  canRunInterview: boolean;
  canViewFullDataPool: boolean;
  // Quantitative limits & metadata
  maxCreationItems: number; // 0 for PUBLIC/GUEST, 2 for DEMO, Infinity for FULL
  sampleDataLimit: number;  // 1 for PUBLIC, 3 for GUEST, 5 for DEMO, Infinity for FULL
  isDemoWorkspace: boolean;
  isReadOnly: boolean;
  tierBadgeLabel: string;
  tierDescription: string;
}

export const ACCESS_LEVEL_CAPABILITIES: Record<BetaAccessLevel, AccessCapabilities> = {
  PUBLIC: {
    canViewBasicData: true,
    canViewCuratedData: false,
    canViewIntelligence: false,
    canCreate: false,
    canEdit: false,
    canUseAI: false,
    canExport: false,
    canStartBuild: false,
    canRunInterview: false,
    canViewFullDataPool: false,
    maxCreationItems: 0,
    sampleDataLimit: 1,
    isDemoWorkspace: false,
    isReadOnly: true,
    tierBadgeLabel: 'Public Preview',
    tierDescription: 'Visitor preview with single sample records and view-only access.'
  },
  GUEST: {
    canViewBasicData: true,
    canViewCuratedData: true,
    canViewIntelligence: false,
    canCreate: false,
    canEdit: false,
    canUseAI: false,
    canExport: false,
    canStartBuild: false,
    canRunInterview: false,
    canViewFullDataPool: false,
    maxCreationItems: 0,
    sampleDataLimit: 3,
    isDemoWorkspace: false,
    isReadOnly: true,
    tierBadgeLabel: 'Guest',
    tierDescription: 'Exploration session with 3 curated records per module. Read-only preview.'
  },
  DEMO: {
    canViewBasicData: true,
    canViewCuratedData: true,
    canViewIntelligence: true,
    canCreate: true,
    canEdit: true,
    canUseAI: true,
    canExport: false,
    canStartBuild: true,
    canRunInterview: true,
    canViewFullDataPool: false,
    maxCreationItems: 2,
    sampleDataLimit: 5,
    isDemoWorkspace: true,
    isReadOnly: false,
    tierBadgeLabel: 'DEMO WORKSPACE',
    tierDescription: 'Isolated Demo Workspace with curated seed data and entity-tracked sandbox creation.'
  },
  FULL: {
    canViewBasicData: true,
    canViewCuratedData: true,
    canViewIntelligence: true,
    canCreate: true,
    canEdit: true,
    canUseAI: true,
    canExport: true,
    canStartBuild: true,
    canRunInterview: true,
    canViewFullDataPool: true,
    maxCreationItems: Infinity,
    sampleDataLimit: Infinity,
    isDemoWorkspace: false,
    isReadOnly: false,
    tierBadgeLabel: 'Full Access',
    tierDescription: 'Full CareerOS access with unrestricted data pools, complete intelligence, AI, and exports.'
  }
};

const STORAGE_KEY_LEVEL = 'careeros_beta_access_level';
const STORAGE_KEY_ROLE = 'careeros_user_role';
const STORAGE_KEY_ADMIN = 'careeros_user_is_admin';
const STORAGE_KEY_SESSION_STATE = 'careeros_guest_session_state';
const STORAGE_KEY_HAS_VISITED = 'careeros_has_visited_v1';
const STORAGE_KEY_PROMPT_DISMISSED = 'careeros_guest_prompt_dismissed_v1';
const SESSION_KEY_INTERACTION_COUNT = 'careeros_session_interactions_v1';
const SESSION_KEY_PROMPT_SHOWN = 'careeros_session_prompt_shown_v1';

class AccessControlServiceManager {
  private user: CareerOsUser;
  private interactionCount: number = 0;
  private isContextualPromptOpen: boolean = false;
  private listeners: Set<(user: CareerOsUser, caps: AccessCapabilities) => void> = new Set();

  constructor() {
    let savedLevel: BetaAccessLevel = 'GUEST';
    let savedRole: UserRole = 'USER';
    let savedAdmin = true;
    let resolvedSessionState: GuestSessionState = 'FIRST_VISIT';

    if (typeof window !== 'undefined') {
      try {
        const storedLevel = localStorage.getItem(STORAGE_KEY_LEVEL) as BetaAccessLevel | null;
        if (storedLevel && ACCESS_LEVEL_CAPABILITIES[storedLevel]) {
          savedLevel = storedLevel;
        } else {
          // First time in browser: ensure GUEST mode is persisted as starting state
          savedLevel = 'GUEST';
          localStorage.setItem(STORAGE_KEY_LEVEL, 'GUEST');
        }

        const storedRole = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole | null;
        if (storedRole === 'ADMIN' || storedRole === 'OWNER' || storedRole === 'USER') {
          savedRole = storedRole;
        }

        const storedAdmin = localStorage.getItem(STORAGE_KEY_ADMIN);
        if (storedAdmin !== null) {
          savedAdmin = storedAdmin === 'true';
        }

        const hasVisitedBefore = localStorage.getItem(STORAGE_KEY_HAS_VISITED) === 'true';
        const storedSessionState = localStorage.getItem(STORAGE_KEY_SESSION_STATE) as GuestSessionState | null;

        if (savedLevel === 'DEMO') {
          resolvedSessionState = 'DEMO_ACTIVE';
        } else if (savedLevel === 'FULL') {
          resolvedSessionState = 'FULL_ACCESS_REQUESTED';
        } else if (storedSessionState === 'FULL_ACCESS_REQUESTED') {
          resolvedSessionState = 'FULL_ACCESS_REQUESTED';
        } else if (!hasVisitedBefore) {
          resolvedSessionState = 'FIRST_VISIT';
          localStorage.setItem(STORAGE_KEY_HAS_VISITED, 'true');
          localStorage.setItem(STORAGE_KEY_SESSION_STATE, 'FIRST_VISIT');
        } else {
          resolvedSessionState = storedSessionState === 'DEMO_AVAILABLE' ? 'DEMO_AVAILABLE' : 'RETURNING_GUEST';
          localStorage.setItem(STORAGE_KEY_SESSION_STATE, resolvedSessionState);
        }

        const storedInteractions = sessionStorage.getItem(SESSION_KEY_INTERACTION_COUNT);
        if (storedInteractions) {
          this.interactionCount = parseInt(storedInteractions, 10) || 0;
        }
      } catch {
        // Fallback to defaults
      }
    }

    this.user = {
      id: 'usr-careeros-practitioner',
      name: savedLevel === 'DEMO' ? 'Demo Practitioner (demo-basic)' : 'Guest Explorer',
      email: savedLevel === 'DEMO' ? 'demo-basic@careeros.beta' : 'guest@careeros.beta',
      accessLevel: savedLevel,
      sessionState: resolvedSessionState,
      role: savedRole,
      isAdmin: savedAdmin,
      isOwner: savedRole === 'OWNER'
    };

    dataExposureGuard.sanitizeUnauthorizedLocalStorage(savedLevel);
    dataExposureGuard.getOrIssueSessionToken(savedLevel);

    if (typeof window !== 'undefined') {
      window.addEventListener('career_simulation_reset', () => {
        if (this.user.accessLevel === 'DEMO') {
          this.user.sessionState = 'DEMO_ACTIVE';
        } else if (this.user.accessLevel === 'GUEST' || this.user.accessLevel === 'PUBLIC') {
          this.user.sessionState = 'RETURNING_GUEST';
        }
        this.notify();
      });
    }
  }

  public getUser(): CareerOsUser {
    return { ...this.user };
  }

  public getAccessLevel(): BetaAccessLevel {
    return this.user.accessLevel;
  }

  public getSessionState(): GuestSessionState {
    return this.user.sessionState;
  }

  public getInteractionCount(): number {
    return this.interactionCount;
  }

  public getIsContextualPromptOpen(): boolean {
    return this.isContextualPromptOpen;
  }

  public getCapabilities(): AccessCapabilities {
    return ACCESS_LEVEL_CAPABILITIES[this.user.accessLevel];
  }

  /**
   * Capability-based check
   */
  public can(capability: keyof AccessCapabilities): boolean {
    const caps = this.getCapabilities();
    return Boolean(caps[capability]);
  }

  /**
   * Internal Admin check (independent of beta access level)
   */
  public isAdmin(): boolean {
    return this.user.isAdmin || this.user.role === 'ADMIN' || this.user.role === 'OWNER';
  }

  public setAccessLevel(level: BetaAccessLevel): void {
    if (!ACCESS_LEVEL_CAPABILITIES[level]) return;
    this.user.accessLevel = level;

    if (level === 'DEMO') {
      this.user.sessionState = 'DEMO_ACTIVE';
      this.user.name = 'Demo Practitioner (demo-basic)';
      this.isContextualPromptOpen = false;
    } else if (level === 'FULL') {
      this.user.sessionState = 'FULL_ACCESS_REQUESTED';
      this.user.name = 'CareerOS Practitioner';
      this.isContextualPromptOpen = false;
    } else if (level === 'GUEST' && (this.user.sessionState === 'DEMO_ACTIVE' || this.user.sessionState === 'FULL_ACCESS_REQUESTED')) {
      this.user.sessionState = 'RETURNING_GUEST';
      this.user.name = 'Guest Explorer';
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_LEVEL, level);
        localStorage.setItem(STORAGE_KEY_SESSION_STATE, this.user.sessionState);
      } catch {
        // Ignore
      }
    }
    dataExposureGuard.sanitizeUnauthorizedLocalStorage(level);
    dataExposureGuard.getOrIssueSessionToken(level);
    this.notify();
  }

  public setSessionState(state: GuestSessionState): void {
    this.user.sessionState = state;
    if (state === 'DEMO_ACTIVE' && this.user.accessLevel !== 'DEMO') {
      this.user.accessLevel = 'DEMO';
      this.user.name = 'Demo Practitioner (demo-basic)';
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_LEVEL, 'DEMO');
        } catch {
          // Ignore
        }
      }
    } else if ((state === 'FIRST_VISIT' || state === 'RETURNING_GUEST' || state === 'DEMO_AVAILABLE') && (this.user.accessLevel === 'DEMO' || this.user.accessLevel === 'FULL')) {
      this.user.accessLevel = 'GUEST';
      this.user.name = 'Guest Explorer';
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_LEVEL, 'GUEST');
        } catch {
          // Ignore
        }
      }
    }

    if (state === 'DEMO_AVAILABLE') {
      this.isContextualPromptOpen = true;
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_SESSION_STATE, state);
      } catch {
        // Ignore
      }
    }
    this.notify();
  }

  /**
   * Records a meaningful user interaction during a Guest session.
   * After meaningful exploration (e.g., 2+ module switches or detail views, or attempting a protected action),
   * transitions state to DEMO_AVAILABLE and opens the lightweight contextual prompt once per session.
   */
  public recordMeaningfulInteraction(
    reason: 'navigation' | 'detail_view' | 'detail_open' | 'protected_action' | 'creation_preview' = 'navigation'
  ): void {
    if (this.user.accessLevel === 'DEMO' || this.user.accessLevel === 'FULL') {
      return;
    }

    this.interactionCount += 1;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_KEY_INTERACTION_COUNT, String(this.interactionCount));
      } catch {
        // Ignore
      }
    }

    // When opening a creation modal in Guest mode, allow the lightweight creation preview modal
    // to be inspected first without immediately covering it with the contextual prompt modal.
    if (reason === 'creation_preview') {
      return;
    }

    // If user explicitly clicked a protected action, always surface the Demo Workspace prompt
    if (reason === 'protected_action') {
      this.user.sessionState = 'DEMO_AVAILABLE';
      this.isContextualPromptOpen = true;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_SESSION_STATE, 'DEMO_AVAILABLE');
          sessionStorage.setItem(SESSION_KEY_PROMPT_SHOWN, 'true');
        } catch {
          // Ignore
        }
      }
      this.notify();
      return;
    }

    // For organic exploration (navigation / detail view), show once after 2 meaningful interactions
    // if not already shown in this session or dismissed previously
    if (this.interactionCount >= 2) {
      let alreadyShownOrDismissed = false;
      if (typeof window !== 'undefined') {
        try {
          const shownInSession = sessionStorage.getItem(SESSION_KEY_PROMPT_SHOWN) === 'true';
          const dismissedPreviously = localStorage.getItem(STORAGE_KEY_PROMPT_DISMISSED) === 'true';
          alreadyShownOrDismissed = shownInSession || dismissedPreviously;
        } catch {
          // Ignore
        }
      }

      if (!alreadyShownOrDismissed) {
        this.user.sessionState = 'DEMO_AVAILABLE';
        this.isContextualPromptOpen = true;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_SESSION_STATE, 'DEMO_AVAILABLE');
            sessionStorage.setItem(SESSION_KEY_PROMPT_SHOWN, 'true');
          } catch {
            // Ignore
          }
        }
        this.notify();
      }
    }
  }

  /**
   * Dismisses the contextual prompt and continues Guest exploration without nagging on every page
   */
  public continueExploring(): void {
    this.isContextualPromptOpen = false;
    if (this.user.accessLevel === 'GUEST' || this.user.accessLevel === 'PUBLIC') {
      this.user.sessionState = 'RETURNING_GUEST';
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_PROMPT_DISMISSED, 'true');
        localStorage.setItem(STORAGE_KEY_SESSION_STATE, this.user.sessionState);
        sessionStorage.setItem(SESSION_KEY_PROMPT_SHOWN, 'true');
      } catch {
        // Ignore
      }
    }
    this.notify();
  }

  /**
   * Opens the lightweight contextual Demo Workspace prompt on demand
   */
  public openContextualPrompt(): void {
    if (this.user.accessLevel === 'GUEST' || this.user.accessLevel === 'PUBLIC') {
      this.user.sessionState = 'DEMO_AVAILABLE';
    }
    this.isContextualPromptOpen = true;
    this.notify();
  }

  public closeContextualPrompt(): void {
    this.continueExploring();
  }

  /**
   * Validates Demo credentials (demo-basic / demo2026) and activates DEMO_ACTIVE workspace
   */
  public enterDemoWorkspace(username?: string, password?: string): {
    success: boolean;
    message?: string;
  } {
    const cleanUser = username !== undefined ? username.trim() : DEMO_WORKSPACE_CREDENTIALS.username;
    const cleanPass = password !== undefined ? password.trim() : DEMO_WORKSPACE_CREDENTIALS.password;

    if (
      cleanUser !== DEMO_WORKSPACE_CREDENTIALS.username ||
      cleanPass !== DEMO_WORKSPACE_CREDENTIALS.password
    ) {
      return {
        success: false,
        message: `Invalid demo credentials. Use username "${DEMO_WORKSPACE_CREDENTIALS.username}" and password "${DEMO_WORKSPACE_CREDENTIALS.password}".`
      };
    }

    this.user.accessLevel = 'DEMO';
    this.user.sessionState = 'DEMO_ACTIVE';
    this.user.name = 'Demo Practitioner (demo-basic)';
    this.isContextualPromptOpen = false;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_LEVEL, 'DEMO');
        localStorage.setItem(STORAGE_KEY_SESSION_STATE, 'DEMO_ACTIVE');
        localStorage.setItem(STORAGE_KEY_PROMPT_DISMISSED, 'true');
        sessionStorage.setItem(SESSION_KEY_PROMPT_SHOWN, 'true');
      } catch {
        // Ignore
      }
    }

    this.notify();
    return { success: true };
  }

  /**
   * Opens the canonical CareerOS Seat Request flow (or activates full access immediately for QA override).
   * All "Request a CareerOS Seat" CTAs across the application route through this method.
   */
  public requestFullAccess(activateImmediately: boolean = false, sourceLocation?: string): void {
    this.isContextualPromptOpen = false;

    if (activateImmediately) {
      this.user.sessionState = 'FULL_ACCESS_REQUESTED';
      this.user.accessLevel = 'FULL';
      this.user.name = 'CareerOS Practitioner';
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_SESSION_STATE, 'FULL_ACCESS_REQUESTED');
          localStorage.setItem(STORAGE_KEY_LEVEL, 'FULL');
        } catch {
          // Ignore
        }
      }
      this.notify();
      return;
    }

    // Open the canonical Seat Request modal (respecting active role or simulated role)
    seatRequestService.openRequestModal(sourceLocation || 'CareerOS Workspace CTA');
    this.notify();
  }

  /**
   * Marks the session state as FULL_ACCESS_REQUESTED after a seat request is submitted.
   */
  public markFullAccessRequested(): void {
    this.user.sessionState = 'FULL_ACCESS_REQUESTED';
    this.isContextualPromptOpen = false;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_SESSION_STATE, 'FULL_ACCESS_REQUESTED');
      } catch {
        // Ignore
      }
    }
    this.notify();
  }

  public setAdmin(isAdmin: boolean): void {
    this.user.isAdmin = isAdmin;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_ADMIN, String(isAdmin));
      } catch {
        // Ignore
      }
    }
    this.notify();
  }

  public setUserRole(role: UserRole): void {
    this.user.role = role;
    this.user.isOwner = role === 'OWNER';
    if (role === 'ADMIN' || role === 'OWNER') {
      this.user.isAdmin = true;
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_ROLE, role);
      } catch {
        // Ignore
      }
    }
    this.notify();
  }

  /**
   * Checks whether creation is allowed in a specific workflow given current count of custom items.
   * Returns a structured decision object.
   */
  public canCreateWorkflowItem(workflowKey: string, currentCustomCount: number): {
    allowed: boolean;
    reason?: string;
    limit: number;
    current: number;
    remaining: number;
  } {
    const caps = this.getCapabilities();

    if (!caps.canCreate) {
      if (this.user.accessLevel === 'PUBLIC') {
        return {
          allowed: false,
          reason: 'Creation is not available in Public Preview. Enter the Demo Workspace to create items.',
          limit: 0,
          current: currentCustomCount,
          remaining: 0
        };
      }
      return {
        allowed: false,
        reason: 'Guest mode is read-only for exploration. Enter the Demo Workspace (demo-basic / demo2026) to create up to 2 items.',
        limit: 0,
        current: currentCustomCount,
        remaining: 0
      };
    }

    // When in Demo Workspace, evaluate directly against the isolated entity-backed Demo Sandbox tracker
    if (this.user.accessLevel === 'DEMO') {
      const categoryMap: Record<string, DemoEntityCategory> = {
        projects: 'projects',
        evidence: 'projects',
        work_experiences: 'work_experience',
        work_experience: 'work_experience',
        jobs: 'jobs',
        opportunities: 'opportunities',
        roles: 'role_blueprints',
        role_blueprints: 'role_blueprints',
        applications: 'participation',
        participation: 'participation',
        blueprints: 'qa_blueprints',
        qa_blueprints: 'qa_blueprints',
        build_opportunities: 'builds',
        teams: 'builds',
        builds: 'builds'
      };
      const mappedCategory = categoryMap[workflowKey];
      if (mappedCategory) {
        const usage = demoWorkspaceService.getCategoryUsage(mappedCategory);
        if (usage.isAtLimit) {
          return {
            allowed: false,
            reason: 'Demo limit reached',
            limit: usage.limit,
            current: usage.used,
            remaining: 0
          };
        }
        return {
          allowed: true,
          limit: usage.limit,
          current: usage.used,
          remaining: usage.remaining
        };
      }
    }

    if (caps.maxCreationItems !== Infinity && currentCustomCount >= caps.maxCreationItems) {
      return {
        allowed: false,
        reason: `Demo Workspace limit reached (${currentCustomCount}/${caps.maxCreationItems} created items in this workflow). Request Full Access for unlimited creation.`,
        limit: caps.maxCreationItems,
        current: currentCustomCount,
        remaining: 0
      };
    }

    const remaining = caps.maxCreationItems === Infinity ? Infinity : Math.max(0, caps.maxCreationItems - currentCustomCount);

    return {
      allowed: true,
      limit: caps.maxCreationItems,
      current: currentCustomCount,
      remaining
    };
  }

  public resetDemoWorkspace(): void {
    demoWorkspaceService.resetDemoWorkspace();
    this.resetDemoIntelligenceSignals();
    this.notify();
  }

  // =========================================================================
  // ADVANCED INTELLIGENCE ACCESS LAYER (16 Protected Capabilities)
  // =========================================================================
  public getDemoSignalsUsedMap(): Record<string, string[]> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem('careeros_demo_intelligence_signals_v1');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  public getDemoSignalsUsedCount(capability?: ProtectedIntelligenceCapability): number {
    const map = this.getDemoSignalsUsedMap();
    if (capability) {
      return (map[capability] || []).length;
    }
    return Object.values(map).reduce((acc, list) => acc + (Array.isArray(list) ? list.length : 0), 0);
  }

  public consumeDemoIntelligenceSignal(
    capability: ProtectedIntelligenceCapability,
    signalId: string = `sig-${Date.now()}`
  ): {
    allowed: boolean;
    used: number;
    limit: number;
    remaining: number;
  } {
    const level = this.user.accessLevel;
    const limit = 2;

    if (level === 'FULL') {
      return { allowed: true, used: 0, limit: Infinity, remaining: Infinity };
    }
    if (level !== 'DEMO') {
      return { allowed: false, used: 0, limit: 0, remaining: 0 };
    }

    const map = this.getDemoSignalsUsedMap();
    const currentList = Array.isArray(map[capability]) ? map[capability] : [];

    if (currentList.includes(signalId)) {
      return {
        allowed: true,
        used: currentList.length,
        limit,
        remaining: Math.max(0, limit - currentList.length)
      };
    }

    if (currentList.length >= limit) {
      return {
        allowed: false,
        used: currentList.length,
        limit,
        remaining: 0
      };
    }

    const nextList = [...currentList, signalId];
    map[capability] = nextList;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('careeros_demo_intelligence_signals_v1', JSON.stringify(map));
      } catch {
        // Ignore storage error
      }
    }
    this.notify();

    return {
      allowed: true,
      used: nextList.length,
      limit,
      remaining: Math.max(0, limit - nextList.length)
    };
  }

  public resetDemoIntelligenceSignals(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('careeros_demo_intelligence_signals_v1');
      } catch {
        // Ignore
      }
    }
  }

  public getIntelligenceAccess(
    capability: ProtectedIntelligenceCapability = 'evidence_intelligence'
  ): IntelligenceAccessState {
    const level = this.user.accessLevel;
    const meta = PROTECTED_INTELLIGENCE_CATALOG[capability] || PROTECTED_INTELLIGENCE_CATALOG.evidence_intelligence;
    const demoLimit = 2;
    const demoUsed = this.getDemoSignalsUsedCount(capability);

    if (level === 'FULL') {
      return {
        capability,
        title: meta.title,
        summary: meta.summary,
        mode: 'full_intelligence',
        intelligenceLabel: 'Full Intelligence',
        tierStatusLabel: 'Complete CareerOS Intelligence Unlocked',
        isSampleMode: false,
        isDemoPreview: false,
        isFullUnlocked: true,
        canInspectSample: true,
        canInteractLimitedDemo: true,
        canAccessFullCapability: true,
        demoSignalsUsed: 0,
        demoSignalsLimit: Infinity,
        demoSignalsRemaining: Infinity,
        sampleRecordLimit: Infinity
      };
    }

    if (level === 'DEMO') {
      const remaining = Math.max(0, demoLimit - demoUsed);
      return {
        capability,
        title: meta.title,
        summary: meta.summary,
        mode: 'demo_limited_intelligence',
        intelligenceLabel: 'Sample Intelligence',
        tierStatusLabel: `Demo Signal Preview (${demoUsed} / ${demoLimit} signals used)`,
        isSampleMode: true,
        isDemoPreview: true,
        isFullUnlocked: false,
        canInspectSample: true,
        canInteractLimitedDemo: remaining > 0,
        canAccessFullCapability: false,
        demoSignalsUsed: demoUsed,
        demoSignalsLimit: demoLimit,
        demoSignalsRemaining: remaining,
        sampleRecordLimit: 3
      };
    }

    // GUEST or PUBLIC
    return {
      capability,
      title: meta.title,
      summary: meta.summary,
      mode: 'sample_intelligence',
      intelligenceLabel: 'Sample Intelligence',
      tierStatusLabel: 'Curated Sample Preview',
      isSampleMode: true,
      isDemoPreview: false,
      isFullUnlocked: false,
      canInspectSample: true,
      canInteractLimitedDemo: false,
      canAccessFullCapability: false,
      demoSignalsUsed: 0,
      demoSignalsLimit: 0,
      demoSignalsRemaining: 0,
      sampleRecordLimit: level === 'PUBLIC' ? 1 : 2
    };
  }

  /**
   * Action guard with descriptive reasons
   */
  public checkActionAllowed(action: 'create' | 'edit' | 'ai' | 'export' | 'interview' | 'start_build'): {
    allowed: boolean;
    message?: string;
  } {
    const caps = this.getCapabilities();
    switch (action) {
      case 'create':
        if (!caps.canCreate) {
          return {
            allowed: false,
            message: this.user.accessLevel === 'PUBLIC'
              ? 'Public Preview is read-only. Enter the Demo Workspace to test creation.'
              : 'Guest exploration is read-only. Enter the Demo Workspace to create records.'
          };
        }
        return { allowed: true };

      case 'edit':
        if (!caps.canEdit) {
          return {
            allowed: false,
            message: 'Editing is protected in Guest mode. Enter the Demo Workspace to modify records.'
          };
        }
        return { allowed: true };

      case 'ai':
        if (!caps.canUseAI) {
          return {
            allowed: false,
            message: 'Advanced intelligence and AI copilots are available in the Demo Workspace.'
          };
        }
        return { allowed: true };

      case 'export':
        if (!caps.canExport) {
          return {
            allowed: false,
            message: 'Data export is available in Full Access.'
          };
        }
        return { allowed: true };

      case 'interview':
        if (!caps.canRunInterview) {
          return {
            allowed: false,
            message: 'Interactive Live Interview simulation is available in the Demo Workspace.'
          };
        }
        return { allowed: true };

      case 'start_build':
        if (!caps.canStartBuild) {
          return {
            allowed: false,
            message: 'Starting or joining builds is available in the Demo Workspace.'
          };
        }
        return { allowed: true };

      default:
        return { allowed: true };
    }
  }

  /**
   * Filter dataset based on active access level rules
   */
  public filterDataset<T>(
    collectionKey: string,
    fullCatalog: T[],
    curatedSubset: T[],
    customCreated: T[] = []
  ): T[] {
    const level = this.user.accessLevel;

    if (level === 'FULL') {
      return [...customCreated, ...fullCatalog];
    }

    if (level === 'DEMO') {
      // In Demo Workspace: up to 2 user created items + curated subset
      const allowedCustom = customCreated.slice(0, 2);
      return dataExposureGuard.projectCollectionForTier([...allowedCustom, ...curatedSubset.slice(0, 5)], 'DEMO');
    }

    if (level === 'GUEST') {
      // Curated subset (3 items per module), field-projected
      return dataExposureGuard.projectCollectionForTier(curatedSubset.slice(0, 3), 'GUEST');
    }

    // PUBLIC: strictly 1 sample record, field-projected
    return dataExposureGuard.projectCollectionForTier(curatedSubset.slice(0, 1), 'PUBLIC');
  }

  public subscribe(callback: (user: CareerOsUser, caps: AccessCapabilities) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(): void {
    const user = this.getUser();
    const caps = this.getCapabilities();

    this.listeners.forEach(cb => {
      try {
        cb(user, caps);
      } catch (err) {
        console.error('Error in access control listener:', err);
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('career_access_changed', {
        detail: {
          user,
          capabilities: caps,
          sessionState: user.sessionState,
          isContextualPromptOpen: this.isContextualPromptOpen
        }
      }));
      window.dispatchEvent(new CustomEvent('career_access_level_changed', {
        detail: { level: user.accessLevel }
      }));
    }
  }
}

export type ProtectedIntelligenceCapability =
  | 'ai_career_diagnosis'
  | 'ai_role_mapping'
  | 'evidence_intelligence'
  | 'evidence_graph'
  | 'capability_attribution'
  | 'readiness_intelligence'
  | 'role_intelligence_evaluation'
  | 'advanced_role_evaluation'
  | 'intelligent_matching'
  | 'advanced_builder_match'
  | 'ai_qa_blueprint_generation'
  | 'ai_interview_analysis'
  | 'ai_career_insights'
  | 'full_knowledge_graph'
  | 'full_knowledge_data_pool'
  | 'proprietary_scoring_logic';

export interface IntelligenceAccessState {
  capability: ProtectedIntelligenceCapability;
  title: string;
  summary: string;
  mode: 'sample_intelligence' | 'demo_limited_intelligence' | 'full_intelligence';
  intelligenceLabel: 'Sample Intelligence' | 'Full Intelligence';
  tierStatusLabel: string;
  isSampleMode: boolean;
  isDemoPreview: boolean;
  isFullUnlocked: boolean;
  canInspectSample: boolean;
  canInteractLimitedDemo: boolean;
  canAccessFullCapability: boolean;
  demoSignalsUsed: number;
  demoSignalsLimit: number;
  demoSignalsRemaining: number;
  sampleRecordLimit: number;
}

export const PROTECTED_INTELLIGENCE_CATALOG: Record<
  ProtectedIntelligenceCapability,
  { title: string; summary: string; pillarLabel: string }
> = {
  ai_career_diagnosis: {
    title: 'AI Career Diagnosis',
    summary: 'Synthesizes career trajectory, target calibration, and narrative positioning across your verified work.',
    pillarLabel: 'Readiness'
  },
  ai_role_mapping: {
    title: 'AI Role Mapping',
    summary: 'Maps your demonstrated capabilities to target role blueprints, industry sectors, and organizational models.',
    pillarLabel: 'Role Fit'
  },
  evidence_intelligence: {
    title: 'Evidence Intelligence',
    summary: 'Transforms fragmented work activity into structured, attributed career evidence and proof signals.',
    pillarLabel: 'Evidence Intelligence'
  },
  evidence_graph: {
    title: 'Evidence Graph',
    summary: 'End-to-end lineage tracing from raw tasks and artifacts to verified capabilities and target role readiness.',
    pillarLabel: 'Evidence Intelligence'
  },
  capability_attribution: {
    title: 'Capability Attribution',
    summary: 'Multi-dimensional capability evaluation distinguishing individual ownership from shared team outcomes.',
    pillarLabel: 'Capability Signals'
  },
  readiness_intelligence: {
    title: 'Readiness Intelligence',
    summary: 'Target role readiness diagnostics identifying verified strengths, experience gaps, and next best actions.',
    pillarLabel: 'Readiness'
  },
  role_intelligence_evaluation: {
    title: 'Role Intelligence & Evaluation',
    summary: 'Cross-framework role calibration across Product, Engineering, and BizOps tracks.',
    pillarLabel: 'Role Fit'
  },
  advanced_role_evaluation: {
    title: 'Advanced Role Evaluation',
    summary: '10-dimension evidence-backed leveling calibration comparing observed signals, peer context, and target benchmarks.',
    pillarLabel: 'Role Fit'
  },
  intelligent_matching: {
    title: 'Intelligent Matching',
    summary: 'Deep requirement-to-evidence alignment across knowledge coverage, hands-on application, and proof strength.',
    pillarLabel: 'Market Intelligence'
  },
  advanced_builder_match: {
    title: 'Advanced Builder Match',
    summary: 'Complementary builder matching, team capability synergy, and build-to-evidence conversion.',
    pillarLabel: 'Capability Signals'
  },
  ai_qa_blueprint_generation: {
    title: 'AI Q&A Blueprint Generation',
    summary: 'Synthesizes role-calibrated interview questions and structured STAR/CAR answer blueprints from your evidence.',
    pillarLabel: 'Readiness'
  },
  ai_interview_analysis: {
    title: 'AI Interview Analysis',
    summary: 'Executive interview calibration evaluating structural clarity, ownership signals, and domain depth.',
    pillarLabel: 'Readiness'
  },
  ai_career_insights: {
    title: 'AI-Generated Career Insights',
    summary: 'Proactive STAR synthesis, interview radar diagnostics, and executive communication framing.',
    pillarLabel: 'Capability Signals'
  },
  full_knowledge_graph: {
    title: 'Full Knowledge Graph',
    summary: 'Complete Skill → Evidence → Source traceability and multi-tier capability progression lineage.',
    pillarLabel: 'Evidence Intelligence'
  },
  full_knowledge_data_pool: {
    title: 'Full Knowledge / Data Pool',
    summary: 'Unrestricted access to the complete CareerOS library of role architectures, pathways, and market signals.',
    pillarLabel: 'Market Intelligence'
  },
  proprietary_scoring_logic: {
    title: 'CareerOS Evaluation & Signal Architecture',
    summary: 'Multi-factor signal synthesis prioritizing demonstrated production impact and external verification.',
    pillarLabel: 'Capability Signals'
  }
};

export interface AdvancedCategoryShell {
  title: string;
  summary: string;
}

export interface CreationWorkflowDisclosureSchema {
  workflowId: string;
  workflowTitle: string;
  basicFields: string[];
  advancedCategories: AdvancedCategoryShell[];
}

export const CREATION_DISCLOSURE_SCHEMAS: Record<string, CreationWorkflowDisclosureSchema> = {
  roles: {
    workflowId: 'roles',
    workflowTitle: 'Role Blueprint',
    basicFields: ['Role Title', 'Role Family', 'Seniority', 'Domain', 'Short Description'],
    advancedCategories: [
      { title: 'Capability Architecture', summary: 'Structured technical & leadership capability pillars for this role.' },
      { title: 'Competency Mapping', summary: 'Behavioral & execution indicators aligned with role seniority.' },
      { title: 'Evidence Requirements', summary: 'Verified project & production artifacts expected from candidates.' },
      { title: 'Evaluation Criteria', summary: 'Multi-stage interview pipeline & calibration dimensions.' },
      { title: 'Career Progression Mapping', summary: 'Leveling trajectory from IC to staff/leadership tracks.' },
      { title: 'Market Benchmark', summary: 'Compensation bands, demand signals, and ecosystem stack.' }
    ]
  },
  projects: {
    workflowId: 'projects',
    workflowTitle: 'Project',
    basicFields: ['Project Name', 'Project Type', 'Description', 'Status'],
    advancedCategories: [
      { title: 'Capability Mapping', summary: 'Canonical skills and engineering capabilities demonstrated.' },
      { title: 'Evidence Model', summary: 'Architecture artifacts, tradeoffs, and verification anchors.' },
      { title: 'Outcome Metrics', summary: 'Quantified business, latency, or user impact signals.' },
      { title: 'Role Alignment', summary: 'Target role blueprint fit and readiness weight.' },
      { title: 'Intelligence Tags', summary: 'Semantic indexing for interview retrieval and gap closure.' }
    ]
  },
  work_experiences: {
    workflowId: 'work_experiences',
    workflowTitle: 'Work Experience',
    basicFields: ['Company', 'Role', 'Dates', 'Short Description'],
    advancedCategories: [
      { title: 'Capability Mapping', summary: 'Core competencies and technical stack attributed to this tenure.' },
      { title: 'Responsibility Architecture', summary: 'Structured ownership statements and system scope.' },
      { title: 'Outcome Metrics', summary: 'Quantified production KPIs and business deliverables.' },
      { title: 'Role Alignment', summary: 'Seniority calibration and target role relevance.' },
      { title: 'Evidence Attribution', summary: 'Cross-linked portfolio projects and Q&A blueprints.' }
    ]
  },
  jobs: {
    workflowId: 'jobs',
    workflowTitle: 'Job Opportunity',
    basicFields: ['Job Title', 'Company', 'Location', 'URL', 'Short Description'],
    advancedCategories: [
      { title: 'Required Core Skills', summary: 'Extracted canonical technical & functional skill requirements.' },
      { title: 'Salary Intelligence', summary: 'Compensation range parsing and market band calibration.' },
      { title: 'Role Fit Signals', summary: 'Seniority level, work mode, and role family alignment.' },
      { title: 'Market Signals', summary: 'Industry domain classification and hiring velocity.' },
      { title: 'Opportunity Intelligence', summary: 'Deadline estimation, company context, and readiness gap mapping.' }
    ]
  },
  opportunities: {
    workflowId: 'opportunities',
    workflowTitle: 'Career Opportunity',
    basicFields: ['Opportunity Type', 'Title', 'Organization', 'Location / URL', 'Short Description'],
    advancedCategories: [
      { title: 'Required Core Skills', summary: 'Target builder capabilities and technical stack.' },
      { title: 'Salary & Reward Intelligence', summary: 'Prize pool, equity/grant value, and funding structure.' },
      { title: 'Role Fit Signals', summary: 'Eligibility, commitment level, and difficulty tier.' },
      { title: 'Market Signals', summary: 'Ecosystem backing, sponsor tier, and strategic domain.' },
      { title: 'Opportunity Intelligence', summary: 'Deliverable requirements, evaluation timeline, and career signal.' }
    ]
  },
  participation: {
    workflowId: 'participation',
    workflowTitle: 'Participation',
    basicFields: ['Activity Type', 'Title', 'Organization', 'Date', 'Role'],
    advancedCategories: [
      { title: 'Evidence Mapping', summary: 'Linked deliverables, repositories, and proof-of-work artifacts.' },
      { title: 'Capability Attribution', summary: 'Skills exercised and validated during participation.' },
      { title: 'Readiness Impact', summary: 'Preparation plan tasks, interview stages, and skill gap closure.' },
      { title: 'Verification', summary: 'Outcome status, placement/credential verification, and reflection notes.' }
    ]
  },
  blueprints: {
    workflowId: 'blueprints',
    workflowTitle: 'Q&A Blueprint',
    basicFields: ['Question', 'Role', 'Category', 'Difficulty'],
    advancedCategories: [
      { title: 'Capability Mapping', summary: 'Core competencies and domain tags validated by this response.' },
      { title: 'Evaluation Rubric', summary: 'Structured STAR / CAR / PDI narrative blocks and signal weight.' },
      { title: 'Evidence Criteria', summary: 'Linked portfolio projects, metrics, and production proof points.' },
      { title: 'Interview Intelligence', summary: 'Follow-up probes, anti-patterns to avoid, and delivery cues.' }
    ]
  },
  builds: {
    workflowId: 'builds',
    workflowTitle: 'Build',
    basicFields: ['Challenge / Build Title', 'Objective', 'Duration', 'Team Size'],
    advancedCategories: [
      { title: 'Capability Objectives', summary: 'Target engineering, product, and design skills to validate.' },
      { title: 'Evidence Capture', summary: 'Expected prototype milestones, deliverables, and portfolio proof.' },
      { title: 'Team Fit', summary: 'Complementary builder roles, collaboration cadence, and constraints.' },
      { title: 'Career Signal Mapping', summary: 'How completed build outcomes convert into verified Career Evidence.' }
    ]
  }
};

const WORKFLOW_SCHEMA_ALIASES: Record<string, string> = {
  roles: 'roles',
  role_blueprints: 'roles',
  projects: 'projects',
  evidence: 'projects',
  work_experiences: 'work_experiences',
  work_experience: 'work_experiences',
  jobs: 'jobs',
  opportunities: 'opportunities',
  participation: 'participation',
  applications: 'participation',
  blueprints: 'blueprints',
  qa_blueprints: 'blueprints',
  builds: 'builds',
  build_opportunities: 'builds',
  teams: 'builds'
};

export interface CreationWorkflowDisclosureResponse {
  mode: 'guest_preview' | 'demo_unlocked' | 'full_unlocked';
  canAccessAdvancedFields: boolean;
  bannerMessage: string;
  schema: CreationWorkflowDisclosureSchema;
}

export function getCreationWorkflowDisclosure(
  workflowKey: string,
  level: BetaAccessLevel = AccessControlService.getAccessLevel()
): CreationWorkflowDisclosureResponse {
  const normalizedKey = WORKFLOW_SCHEMA_ALIASES[workflowKey] || 'projects';
  const schema = CREATION_DISCLOSURE_SCHEMAS[normalizedKey] || CREATION_DISCLOSURE_SCHEMAS.projects;
  const canAccessAdvancedFields = level === 'DEMO' || level === 'FULL';
  const mode = level === 'FULL' ? 'full_unlocked' : level === 'DEMO' ? 'demo_unlocked' : 'guest_preview';

  return {
    mode,
    canAccessAdvancedFields,
    bannerMessage:
      "You're seeing the basic creation flow. Advanced CareerOS Intelligence is available in Demo / Full Access.",
    schema
  };
}

export const AccessControlService = new AccessControlServiceManager();

/**
 * React Hook for consuming centralized access control & first-session guest state in components
 */
export function useAccessControl() {
  const [user, setUser] = useState<CareerOsUser>(() => AccessControlService.getUser());
  const [capabilities, setCapabilities] = useState<AccessCapabilities>(() => AccessControlService.getCapabilities());
  const [isContextualPromptOpen, setIsContextualPromptOpen] = useState<boolean>(() =>
    AccessControlService.getIsContextualPromptOpen()
  );

  useEffect(() => {
    return AccessControlService.subscribe((newUser, newCaps) => {
      setUser(newUser);
      setCapabilities(newCaps);
      setIsContextualPromptOpen(AccessControlService.getIsContextualPromptOpen());
    });
  }, []);

  return {
    user,
    accessLevel: user.accessLevel,
    sessionState: user.sessionState,
    isContextualPromptOpen,
    role: user.role,
    isAdmin: user.isAdmin,
    capabilities,
    can: (cap: keyof AccessCapabilities) => Boolean(capabilities[cap]),
    canCreate: (workflowKey: string, currentCount: number = 0) =>
      AccessControlService.canCreateWorkflowItem(workflowKey, currentCount).allowed,
    checkActionAllowed: (action: 'create' | 'edit' | 'ai' | 'export' | 'interview' | 'start_build') =>
      AccessControlService.checkActionAllowed(action),
    canCreateWorkflowItem: (workflowKey: string, currentCount: number) =>
      AccessControlService.canCreateWorkflowItem(workflowKey, currentCount),
    getCreationDisclosure: (workflowKey: string) =>
      getCreationWorkflowDisclosure(workflowKey, user.accessLevel),
    getIntelligenceAccess: (capability?: ProtectedIntelligenceCapability) =>
      AccessControlService.getIntelligenceAccess(capability),
    consumeDemoIntelligenceSignal: (capability: ProtectedIntelligenceCapability, signalId?: string) =>
      AccessControlService.consumeDemoIntelligenceSignal(capability, signalId),
    setAccessLevel: (level: BetaAccessLevel) => AccessControlService.setAccessLevel(level),
    setSessionState: (state: GuestSessionState) => AccessControlService.setSessionState(state),
    recordMeaningfulInteraction: (
      reason?: 'navigation' | 'detail_view' | 'detail_open' | 'protected_action' | 'creation_preview'
    ) => AccessControlService.recordMeaningfulInteraction(reason),
    continueExploring: () => AccessControlService.continueExploring(),
    openContextualPrompt: () => AccessControlService.openContextualPrompt(),
    openAccessModal: (_target?: string) => AccessControlService.openContextualPrompt(),
    closeContextualPrompt: () => AccessControlService.closeContextualPrompt(),
    enterDemoWorkspace: (username?: string, password?: string) =>
      AccessControlService.enterDemoWorkspace(username, password),
    resetDemoWorkspace: () => AccessControlService.resetDemoWorkspace(),
    requestFullAccess: (activateImmediately?: boolean, sourceLocation?: string) =>
      AccessControlService.requestFullAccess(activateImmediately, sourceLocation),
    markFullAccessRequested: () => AccessControlService.markFullAccessRequested(),
    demoCredentials: DEMO_WORKSPACE_CREDENTIALS,
    setAdmin: (isAdmin: boolean) => AccessControlService.setAdmin(isAdmin),
    setUserRole: (role: UserRole) => AccessControlService.setUserRole(role)
  };
}


