/**
 * CareerOS Seat Request & Role Simulation Service
 *
 * Provides:
 * 1. Canonical seat request data model & persistence (`CareerOSSeatRequest`)
 * 2. Duplicate submission prevention (by account ID or normalized email)
 * 3. Development/Demo-only "Simulate role" layer so an Admin / Builder account
 *    can test the exact end-user seat request flow across every page without
 *    weakening or modifying real production permissions.
 */

import { useState, useEffect } from 'react';

export type SimulatedRoleOption =
  | 'Admin'
  | 'Normal User'
  | 'Guest'
  | 'Invited User'
  | 'Seat Requested'
  | 'Seat Approved';

export const SIMULATED_ROLE_OPTIONS: SimulatedRoleOption[] = [
  'Admin',
  'Normal User',
  'Guest',
  'Invited User',
  'Seat Requested',
  'Seat Approved',
];

export type SeatRequestStatus = 'pending' | 'approved' | 'declined';

export interface CareerOSSeatRequest {
  id: string;
  email: string;
  name?: string;
  organization?: string;
  reason?: string;
  sourceLocation: string;
  authenticatedUserId?: string | null;
  authenticatedUserName?: string | null;
  effectiveRoleAtSubmission: SimulatedRoleOption;
  status: SeatRequestStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SeatRequestModalState {
  isOpen: boolean;
  sourceLocation: string;
}

const STORAGE_KEY_SEAT_REQUESTS = 'careeros_seat_requests_v1';
const STORAGE_KEY_SIMULATED_ROLE = 'careeros_qa_simulated_role_v1';

const INITIAL_SEED_REQUESTS: CareerOSSeatRequest[] = [
  {
    id: 'seat-req-seed-1',
    email: 'elena.rostova@linear-demo.io',
    name: 'Elena Rostova',
    organization: 'Linear Product Ops',
    reason: 'Evaluating CareerOS Evidence Graph & Live Interview Copilot for our Senior PM hiring cohort.',
    sourceLocation: 'Role Intelligence Gate',
    authenticatedUserId: 'usr-elena-rostova',
    authenticatedUserName: 'Elena Rostova',
    effectiveRoleAtSubmission: 'Normal User',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: 'seat-req-seed-2',
    email: 'marcus.chen@fintech-builders.org',
    name: 'Marcus Chen',
    organization: 'Apex Financial Technologies',
    reason: 'Transitioning from Senior Backend Engineer to Staff Systems Architect; want full Q&A blueprint synthesis.',
    sourceLocation: 'Demo Workspace Quota Gate',
    authenticatedUserId: null,
    authenticatedUserName: null,
    effectiveRoleAtSubmission: 'Guest',
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    reviewedBy: 'admin_lead',
    reviewedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
];

class SeatRequestServiceManager {
  private requests: CareerOSSeatRequest[] = [];
  private simulatedRole: SimulatedRoleOption = 'Admin';
  private modalState: SeatRequestModalState = {
    isOpen: false,
    sourceLocation: 'Workspace CTA',
  };
  private lastSubmittedRequestId: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') {
      this.requests = [...INITIAL_SEED_REQUESTS];
      return;
    }

    try {
      const rawRequests = localStorage.getItem(STORAGE_KEY_SEAT_REQUESTS);
      if (rawRequests) {
        const parsed = JSON.parse(rawRequests);
        this.requests = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_SEED_REQUESTS];
      } else {
        this.requests = [...INITIAL_SEED_REQUESTS];
        localStorage.setItem(STORAGE_KEY_SEAT_REQUESTS, JSON.stringify(this.requests));
      }

      const savedSimRole = sessionStorage.getItem(STORAGE_KEY_SIMULATED_ROLE) as SimulatedRoleOption | null;
      if (savedSimRole && SIMULATED_ROLE_OPTIONS.includes(savedSimRole)) {
        this.simulatedRole = savedSimRole;
      }
    } catch {
      this.requests = [...INITIAL_SEED_REQUESTS];
    }
  }

  private saveRequests(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_SEAT_REQUESTS, JSON.stringify(this.requests));
    } catch {
      // Ignore storage errors
    }
  }

  public getSimulatedRole(): SimulatedRoleOption {
    return this.simulatedRole;
  }

  public isSimulating(): boolean {
    return this.simulatedRole !== 'Admin';
  }

  /**
   * Sets the temporary Demo/QA Simulated Role and synchronizes session state.
   * Does NOT alter real production admin permissions.
   */
  public setSimulatedRole(role: SimulatedRoleOption): void {
    if (!SIMULATED_ROLE_OPTIONS.includes(role)) return;
    this.simulatedRole = role;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY_SIMULATED_ROLE, role);
      } catch {
        // Ignore
      }
    }

    this.notify();
  }

  /**
   * One-click Reset Simulation: restores Simulated Role to 'Admin' (no active user simulation)
   * and clears transient session submission pointers so tests can be repeated cleanly.
   */
  public resetSimulation(): void {
    this.simulatedRole = 'Admin';
    this.lastSubmittedRequestId = null;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(STORAGE_KEY_SIMULATED_ROLE);
        // Also clear any stuck 'FULL_ACCESS_REQUESTED' session state if user is in DEMO or GUEST
        const currentAccess = localStorage.getItem('careeros_beta_access_level');
        if (currentAccess === 'DEMO') {
          localStorage.setItem('careeros_guest_session_state', 'DEMO_ACTIVE');
        } else if (currentAccess === 'GUEST' || currentAccess === 'PUBLIC') {
          localStorage.setItem('careeros_guest_session_state', 'RETURNING_GUEST');
        }
      } catch {
        // Ignore
      }
    }

    this.notify();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('career_simulation_reset'));
    }
  }

  /**
   * Opens the canonical Seat Request modal from any CTA across the application.
   */
  public openRequestModal(sourceLocation: string = 'CareerOS Workspace CTA'): void {
    this.modalState = {
      isOpen: true,
      sourceLocation,
    };
    this.notify();
  }

  public closeRequestModal(): void {
    this.modalState = {
      ...this.modalState,
      isOpen: false,
    };
    this.notify();
  }

  public getModalState(): SeatRequestModalState {
    return { ...this.modalState };
  }

  public getAllRequests(): CareerOSSeatRequest[] {
    return [...this.requests].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Returns the active seat request associated with the current user/simulation context, if any.
   */
  public getCurrentUserActiveRequest(emailInput?: string): CareerOSSeatRequest | null {
    if (this.simulatedRole === 'Seat Requested') {
      const existingPending = this.requests.find((r) => r.status === 'pending');
      return (
        existingPending || {
          id: 'sim-seat-req-pending',
          email: 'alex.rivera@careeros.io',
          name: 'Alex Rivera',
          organization: 'Product & Systems Group',
          reason: 'Requesting full CareerOS seat for role readiness and evidence graph calibration.',
          sourceLocation: this.modalState.sourceLocation,
          authenticatedUserId: 'usr-alex-rivera',
          authenticatedUserName: 'Alex Rivera',
          effectiveRoleAtSubmission: 'Seat Requested',
          status: 'pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        }
      );
    }

    if (this.simulatedRole === 'Seat Approved') {
      const existingApproved = this.requests.find((r) => r.status === 'approved');
      return (
        existingApproved || {
          id: 'sim-seat-req-approved',
          email: 'alex.rivera@careeros.io',
          name: 'Alex Rivera',
          organization: 'Product & Systems Group',
          reason: 'Full CareerOS Seat approved.',
          sourceLocation: this.modalState.sourceLocation,
          authenticatedUserId: 'usr-alex-rivera',
          authenticatedUserName: 'Alex Rivera',
          effectiveRoleAtSubmission: 'Seat Approved',
          status: 'approved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          reviewedBy: 'admin_lead',
          reviewedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        }
      );
    }

    if (emailInput) {
      const normalized = emailInput.trim().toLowerCase();
      const match = this.requests.find(
        (r) =>
          r.email.trim().toLowerCase() === normalized &&
          (r.status === 'pending' || r.status === 'approved')
      );
      if (match) return match;
    }

    if (this.lastSubmittedRequestId) {
      const found = this.requests.find((r) => r.id === this.lastSubmittedRequestId);
      if (found) return found;
    }

    return null;
  }

  /**
   * Returns pre-fill context based on the effective role (real or simulated).
   * - Guest: unauthenticated (empty email, email required)
   * - Normal User: authenticated user account (associated with account ID, pre-filled email/name)
   * - Invited User: invited cohort account (associated with invite token/account, pre-filled email)
   */
  public getEffectiveUserIdentity(actualUser: {
    id: string;
    name: string;
    email: string;
    accessLevel: string;
    isAdmin: boolean;
  }): {
    isAuthenticatedAccount: boolean;
    isAdminView: boolean;
    accountId: string | null;
    defaultEmail: string;
    defaultName: string;
    defaultOrganization: string;
    invitationCode?: string;
    effectiveRoleLabel: SimulatedRoleOption;
  } {
    const role = this.simulatedRole;

    if (role === 'Guest') {
      return {
        isAuthenticatedAccount: false,
        isAdminView: false,
        accountId: null,
        defaultEmail: '',
        defaultName: '',
        defaultOrganization: '',
        effectiveRoleLabel: 'Guest',
      };
    }

    if (role === 'Normal User') {
      return {
        isAuthenticatedAccount: true,
        isAdminView: false,
        accountId: actualUser.id || 'usr-alex-rivera',
        defaultEmail:
          actualUser.email && !actualUser.email.endsWith('@careeros.beta')
            ? actualUser.email
            : 'alex.rivera@workspace.io',
        defaultName:
          actualUser.name && !actualUser.name.includes('Guest') && !actualUser.name.includes('Demo')
            ? actualUser.name
            : 'Alex Rivera',
        defaultOrganization: '',
        effectiveRoleLabel: 'Normal User',
      };
    }

    if (role === 'Invited User') {
      return {
        isAuthenticatedAccount: true,
        isAdminView: false,
        accountId: 'usr-invited-cohort-2026',
        defaultEmail: 'invited.member@partner-cohort.org',
        defaultName: 'Jordan Taylor',
        defaultOrganization: 'Partner Accelerator Cohort',
        invitationCode: 'COS-INVITE-2026',
        effectiveRoleLabel: 'Invited User',
      };
    }

    if (role === 'Seat Requested' || role === 'Seat Approved') {
      return {
        isAuthenticatedAccount: true,
        isAdminView: false,
        accountId: actualUser.id || 'usr-alex-rivera',
        defaultEmail: 'alex.rivera@workspace.io',
        defaultName: 'Alex Rivera',
        defaultOrganization: 'Product & Systems Group',
        effectiveRoleLabel: role,
      };
    }

    // role === 'Admin' (no user override active)
    // If real user is Admin, preserve Admin behavior
    if (actualUser.isAdmin) {
      return {
        isAuthenticatedAccount: true,
        isAdminView: true,
        accountId: actualUser.id,
        defaultEmail: actualUser.email,
        defaultName: actualUser.name,
        defaultOrganization: 'CareerOS Platform Admin',
        effectiveRoleLabel: 'Admin',
      };
    }

    // Non-admin fallback
    const isGuestLevel = actualUser.accessLevel === 'PUBLIC' || actualUser.accessLevel === 'GUEST';
    return {
      isAuthenticatedAccount: !isGuestLevel,
      isAdminView: false,
      accountId: isGuestLevel ? null : actualUser.id,
      defaultEmail: isGuestLevel ? '' : actualUser.email,
      defaultName: isGuestLevel ? '' : actualUser.name,
      defaultOrganization: '',
      effectiveRoleLabel: isGuestLevel ? 'Guest' : 'Normal User',
    };
  }

  /**
   * Submits a new CareerOS Seat Request.
   * Enforces email validation, duplicate submission guard, and persistence.
   */
  public submitSeatRequest(input: {
    email: string;
    name?: string;
    organization?: string;
    reason?: string;
    sourceLocation?: string;
    authenticatedUserId?: string | null;
    authenticatedUserName?: string | null;
  }): {
    success: boolean;
    isDuplicate?: boolean;
    error?: string;
    request?: CareerOSSeatRequest;
  } {
    const cleanEmail = (input.email || '').trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return {
        success: false,
        error: 'Please provide a valid email address to request a CareerOS seat.',
      };
    }

    const normalizedEmail = cleanEmail.toLowerCase();

    // Check duplicate submission by email or authenticatedUserId
    const existing = this.requests.find((r) => {
      const sameEmail = r.email.trim().toLowerCase() === normalizedEmail;
      const sameAccount =
        Boolean(input.authenticatedUserId) &&
        Boolean(r.authenticatedUserId) &&
        r.authenticatedUserId === input.authenticatedUserId &&
        sameEmail;
      return (sameEmail || sameAccount) && (r.status === 'pending' || r.status === 'approved');
    });

    if (existing) {
      this.lastSubmittedRequestId = existing.id;
      this.notify();
      return {
        success: true,
        isDuplicate: true,
        request: existing,
      };
    }

    const now = new Date().toISOString();
    const newRequest: CareerOSSeatRequest = {
      id: `seat-req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      email: cleanEmail,
      name: input.name?.trim() || undefined,
      organization: input.organization?.trim() || undefined,
      reason: input.reason?.trim() || undefined,
      sourceLocation: input.sourceLocation || this.modalState.sourceLocation || 'CareerOS Workspace CTA',
      authenticatedUserId: input.authenticatedUserId || null,
      authenticatedUserName: input.authenticatedUserName || input.name?.trim() || null,
      effectiveRoleAtSubmission: this.simulatedRole,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    this.requests = [newRequest, ...this.requests];
    this.lastSubmittedRequestId = newRequest.id;
    this.saveRequests();
    this.notify();

    return {
      success: true,
      isDuplicate: false,
      request: newRequest,
    };
  }

  /**
   * Admin action: Approve or Decline a Seat Request
   */
  public reviewSeatRequest(
    requestId: string,
    status: 'approved' | 'declined',
    reviewedBy: string = 'admin_lead'
  ): CareerOSSeatRequest | null {
    const idx = this.requests.findIndex((r) => r.id === requestId);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    const updated: CareerOSSeatRequest = {
      ...this.requests[idx],
      status,
      updatedAt: now,
      reviewedBy,
      reviewedAt: now,
    };

    this.requests[idx] = updated;
    this.saveRequests();
    this.notify();
    return updated;
  }

  public clearLastSubmittedSessionRequest(): void {
    this.lastSubmittedRequestId = null;
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Error in seatRequestService listener:', err);
      }
    });
  }
}

export const seatRequestService = new SeatRequestServiceManager();

export function useSeatRequestService() {
  const [simulatedRole, setSimulatedRoleState] = useState<SimulatedRoleOption>(() =>
    seatRequestService.getSimulatedRole()
  );
  const [requests, setRequests] = useState<CareerOSSeatRequest[]>(() =>
    seatRequestService.getAllRequests()
  );
  const [modalState, setModalState] = useState<SeatRequestModalState>(() =>
    seatRequestService.getModalState()
  );

  useEffect(() => {
    return seatRequestService.subscribe(() => {
      setSimulatedRoleState(seatRequestService.getSimulatedRole());
      setRequests(seatRequestService.getAllRequests());
      setModalState(seatRequestService.getModalState());
    });
  }, []);

  return {
    simulatedRole,
    isSimulating: simulatedRole !== 'Admin',
    requests,
    pendingCount: requests.filter((r) => r.status === 'pending').length,
    modalState,
    setSimulatedRole: (role: SimulatedRoleOption) => seatRequestService.setSimulatedRole(role),
    resetSimulation: () => seatRequestService.resetSimulation(),
    openRequestModal: (sourceLocation?: string) =>
      seatRequestService.openRequestModal(sourceLocation),
    closeRequestModal: () => seatRequestService.closeRequestModal(),
    submitSeatRequest: (input: Parameters<typeof seatRequestService.submitSeatRequest>[0]) =>
      seatRequestService.submitSeatRequest(input),
    reviewSeatRequest: (id: string, status: 'approved' | 'declined') =>
      seatRequestService.reviewSeatRequest(id, status),
    getCurrentUserActiveRequest: (email?: string) =>
      seatRequestService.getCurrentUserActiveRequest(email),
    getEffectiveUserIdentity: (actualUser: Parameters<typeof seatRequestService.getEffectiveUserIdentity>[0]) =>
      seatRequestService.getEffectiveUserIdentity(actualUser),
    clearLastSubmittedSessionRequest: () => seatRequestService.clearLastSubmittedSessionRequest(),
  };
}
