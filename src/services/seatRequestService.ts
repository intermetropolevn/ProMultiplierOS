/**
 * CareerOS Seat Request, Central Display Access Mapping & QA Simulation Service
 *
 * Provides:
 * 1. Canonical seat request data model & persistence (`CareerOSSeatRequest`)
 * 2. Duplicate submission prevention (by account ID or normalized email)
 * 3. Centralized UI presentation mapping (`getDisplayAccessState`) that consolidates
 *    complex internal roles/states into 4 primary user-facing categories:
 *    - Admin ("Platform management access")
 *    - Guest ("Explore CareerOS with limited access")
 *    - Demo User ("Explore CareerOS in demo mode")
 *    - Request Full Access ("Leave your email to request a CareerOS seat")
 *    without modifying database role records or real production authorization.
 */

import { useState, useEffect } from 'react';

export type SimulatedRoleOption =
  | 'Admin'
  | 'Guest'
  | 'Demo User'
  | 'Request Full Access';

export const SIMULATED_ROLE_OPTIONS: SimulatedRoleOption[] = [
  'Admin',
  'Guest',
  'Demo User',
  'Request Full Access',
];

export const USER_FACING_ROLE_MAP: Record<SimulatedRoleOption, string> = {
  Admin: 'Admin',
  Guest: 'Guest',
  'Demo User': 'Demo User',
  'Request Full Access': 'Request Full Access',
};

export type SimulatedAccessState =
  | 'No Request'
  | 'Pending'
  | 'Approved'
  | 'Rejected';

export const SIMULATED_ACCESS_STATE_OPTIONS: SimulatedAccessState[] = [
  'No Request',
  'Pending',
  'Approved',
  'Rejected',
];

export type SeatRequestStatus = 'pending' | 'approved' | 'declined';

export type DisplayAccessCategory =
  | 'Admin'
  | 'Guest'
  | 'Demo User'
  | 'Request Full Access';

export interface DisplayAccessStateInput {
  authState?: 'GUEST' | 'AUTHENTICATED' | string;
  actualRole?: string;
  simulatedRole?: SimulatedRoleOption | string | null;
  workspaceState?: string;
  seatRequestState?: SimulatedAccessState | SeatRequestStatus | null;
}

export interface ResolvedDisplayAccessState {
  category: DisplayAccessCategory;
  displayLabel: string;
  supportingText: string;
  ctaLabel: string;
  seatAccessStatus: 'no_request' | 'pending' | 'approved' | 'rejected';
  seatStatusTitle: string;
  seatStatusSupportingText: string;
  isEndUserRequestFlow: boolean;
}

/**
 * Centralized UI Presentation Mapping:
 * Resolves the visible user-facing access category, supporting text, and seat request state
 * without changing underlying database roles, invitations, or permissions.
 */
export function getDisplayAccessState({
  authState = 'AUTHENTICATED',
  actualRole = 'Admin',
  simulatedRole = 'Admin',
  workspaceState = 'DEMO',
  seatRequestState = 'No Request',
}: DisplayAccessStateInput): ResolvedDisplayAccessState {
  // 1. Resolve Seat Request State independently of role
  let seatAccessStatus: 'no_request' | 'pending' | 'approved' | 'rejected' = 'no_request';
  let seatStatusTitle = 'Request Full Access';
  let seatStatusSupportingText = 'Leave your email to request a CareerOS seat.';
  let ctaLabel = 'Request a CareerOS Seat';

  if (seatRequestState === 'Pending' || seatRequestState === 'pending') {
    seatAccessStatus = 'pending';
    seatStatusTitle = 'Pending';
    seatStatusSupportingText = 'Your CareerOS seat request is under review.';
    ctaLabel = 'Pending';
  } else if (seatRequestState === 'Approved' || seatRequestState === 'approved') {
    seatAccessStatus = 'approved';
    seatStatusTitle = 'CareerOS Access';
    seatStatusSupportingText = 'Your CareerOS seat has been approved.';
    ctaLabel = 'CareerOS Access';
  } else if (seatRequestState === 'Rejected' || seatRequestState === 'declined') {
    seatAccessStatus = 'rejected';
    seatStatusTitle = 'Request again';
    seatStatusSupportingText = 'Your previous CareerOS seat request was not approved. You can submit an updated request.';
    ctaLabel = 'Request again';
  }

  // 2. Resolve the 4 Primary User-Facing Categories
  const normalizedSim = normalizeLegacyRole(simulatedRole ? String(simulatedRole) : null);

  if (normalizedSim === 'Request Full Access') {
    return {
      category: 'Request Full Access',
      displayLabel:
        seatAccessStatus === 'pending'
          ? 'Pending'
          : seatAccessStatus === 'approved'
          ? 'CareerOS Access'
          : 'Request Full Access',
      supportingText:
        seatAccessStatus === 'pending'
          ? 'Your CareerOS seat request is under review.'
          : seatAccessStatus === 'approved'
          ? 'Your CareerOS seat has been approved.'
          : 'Leave your email to request a CareerOS seat',
      ctaLabel,
      seatAccessStatus,
      seatStatusTitle,
      seatStatusSupportingText,
      isEndUserRequestFlow: true,
    };
  }

  if (normalizedSim === 'Guest') {
    return {
      category: 'Guest',
      displayLabel: 'Guest',
      supportingText: 'Explore CareerOS with limited access',
      ctaLabel,
      seatAccessStatus,
      seatStatusTitle,
      seatStatusSupportingText,
      isEndUserRequestFlow: true,
    };
  }

  if (normalizedSim === 'Demo User') {
    return {
      category: 'Demo User',
      displayLabel: 'Demo User',
      supportingText: 'Explore CareerOS in demo mode',
      ctaLabel,
      seatAccessStatus,
      seatStatusTitle,
      seatStatusSupportingText,
      isEndUserRequestFlow: true,
    };
  }

  // When simulatedRole is 'Admin' (or no simulation override is active):
  const isActualAdmin =
    actualRole === 'Admin' || actualRole === 'ADMIN' || actualRole === 'OWNER';

  if (isActualAdmin) {
    return {
      category: 'Admin',
      displayLabel: 'Admin',
      supportingText: 'Platform management access',
      ctaLabel,
      seatAccessStatus,
      seatStatusTitle,
      seatStatusSupportingText,
      isEndUserRequestFlow: seatAccessStatus !== 'no_request',
    };
  }

  // Non-admin fallback based on workspace / auth state
  if (authState === 'GUEST' || workspaceState === 'GUEST' || workspaceState === 'PUBLIC') {
    return {
      category: 'Guest',
      displayLabel: 'Guest',
      supportingText: 'Explore CareerOS with limited access',
      ctaLabel,
      seatAccessStatus,
      seatStatusTitle,
      seatStatusSupportingText,
      isEndUserRequestFlow: true,
    };
  }

  if (workspaceState === 'DEMO') {
    return {
      category: 'Demo User',
      displayLabel: 'Demo User',
      supportingText: 'Explore CareerOS in demo mode',
      ctaLabel,
      seatAccessStatus,
      seatStatusTitle,
      seatStatusSupportingText,
      isEndUserRequestFlow: true,
    };
  }

  return {
    category: 'Request Full Access',
    displayLabel: 'Request Full Access',
    supportingText: 'Leave your email to request a CareerOS seat',
    ctaLabel,
    seatAccessStatus,
    seatStatusTitle,
    seatStatusSupportingText,
    isEndUserRequestFlow: true,
  };
}

export interface CareerOSSeatRequest {
  id: string;
  email: string;
  name?: string;
  organization?: string;
  reason?: string;
  sourceLocation: string;
  authenticatedUserId?: string | null;
  authenticatedUserName?: string | null;
  effectiveRoleAtSubmission: string;
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
const STORAGE_KEY_SIMULATED_ROLE = 'careeros_qa_simulated_role_v2';
const STORAGE_KEY_SIMULATED_ACCESS_STATE = 'careeros_qa_simulated_access_state_v1';

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
    effectiveRoleAtSubmission: 'Demo User',
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

function normalizeLegacyRole(raw: string | null): SimulatedRoleOption | null {
  if (!raw) return null;
  if (raw === 'Admin' || raw === 'Guest' || raw === 'Demo User' || raw === 'Request Full Access') {
    return raw;
  }
  if (raw === 'Normal User' || raw === 'Invited User') {
    return 'Demo User';
  }
  if (raw === 'Seat Requested' || raw === 'Seat Approved') {
    return 'Request Full Access';
  }
  return null;
}

class SeatRequestServiceManager {
  private requests: CareerOSSeatRequest[] = [];
  private simulatedRole: SimulatedRoleOption = 'Admin';
  private simulatedAccessState: SimulatedAccessState = 'No Request';
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

      const savedSimRole = normalizeLegacyRole(sessionStorage.getItem(STORAGE_KEY_SIMULATED_ROLE));
      if (savedSimRole) {
        this.simulatedRole = savedSimRole;
      }

      const savedAccessState = sessionStorage.getItem(STORAGE_KEY_SIMULATED_ACCESS_STATE) as SimulatedAccessState | null;
      if (savedAccessState && SIMULATED_ACCESS_STATE_OPTIONS.includes(savedAccessState)) {
        this.simulatedAccessState = savedAccessState;
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

  public getUserFacingSimulatedState(): string {
    return USER_FACING_ROLE_MAP[this.simulatedRole] || this.simulatedRole;
  }

  public getSimulatedAccessState(): SimulatedAccessState {
    return this.simulatedAccessState;
  }

  public isSimulating(): boolean {
    return this.simulatedRole !== 'Admin' || this.simulatedAccessState !== 'No Request';
  }

  public setSimulatedRole(role: SimulatedRoleOption): void {
    const normalized = normalizeLegacyRole(role);
    if (!normalized) return;
    this.simulatedRole = normalized;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY_SIMULATED_ROLE, normalized);
      } catch {
        // Ignore
      }
    }

    this.notify();
  }

  public setSimulatedAccessState(accessState: SimulatedAccessState): void {
    if (!SIMULATED_ACCESS_STATE_OPTIONS.includes(accessState)) return;
    this.simulatedAccessState = accessState;

    if (accessState === 'No Request') {
      this.lastSubmittedRequestId = null;
    }

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY_SIMULATED_ACCESS_STATE, accessState);
      } catch {
        // Ignore
      }
    }

    this.notify();
  }

  public resetSimulation(): void {
    this.simulatedRole = 'Admin';
    this.simulatedAccessState = 'No Request';
    this.lastSubmittedRequestId = null;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(STORAGE_KEY_SIMULATED_ROLE);
        sessionStorage.removeItem(STORAGE_KEY_SIMULATED_ACCESS_STATE);
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

  public getCurrentUserActiveRequest(emailInput?: string): CareerOSSeatRequest | null {
    const isGuestRole = this.simulatedRole === 'Guest';
    const fallbackEmail = isGuestRole
      ? emailInput || 'guest.applicant@workspace.io'
      : emailInput || 'alex.rivera@workspace.io';

    if (this.simulatedAccessState === 'Pending') {
      const existingPending = this.requests.find((r) => r.status === 'pending');
      return (
        existingPending || {
          id: 'sim-seat-req-pending',
          email: fallbackEmail,
          name: isGuestRole ? 'Guest Applicant' : 'Alex Rivera',
          organization: isGuestRole ? 'Independent Practitioner' : 'Product & Systems Group',
          reason: 'Requesting full CareerOS seat for role readiness and evidence graph calibration.',
          sourceLocation: this.modalState.sourceLocation,
          authenticatedUserId: isGuestRole ? null : 'usr-alex-rivera',
          authenticatedUserName: isGuestRole ? null : 'Alex Rivera',
          effectiveRoleAtSubmission: USER_FACING_ROLE_MAP[this.simulatedRole],
          status: 'pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        }
      );
    }

    if (this.simulatedAccessState === 'Approved') {
      const existingApproved = this.requests.find((r) => r.status === 'approved');
      return (
        existingApproved || {
          id: 'sim-seat-req-approved',
          email: fallbackEmail,
          name: isGuestRole ? 'Guest Applicant' : 'Alex Rivera',
          organization: isGuestRole ? 'Independent Practitioner' : 'Product & Systems Group',
          reason: 'Full CareerOS Seat approved.',
          sourceLocation: this.modalState.sourceLocation,
          authenticatedUserId: isGuestRole ? null : 'usr-alex-rivera',
          authenticatedUserName: isGuestRole ? null : 'Alex Rivera',
          effectiveRoleAtSubmission: USER_FACING_ROLE_MAP[this.simulatedRole],
          status: 'approved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          reviewedBy: 'admin_lead',
          reviewedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        }
      );
    }

    if (this.simulatedAccessState === 'Rejected') {
      const existingDeclined = this.requests.find((r) => r.status === 'declined');
      return (
        existingDeclined || {
          id: 'sim-seat-req-rejected',
          email: fallbackEmail,
          name: isGuestRole ? 'Guest Applicant' : 'Alex Rivera',
          organization: isGuestRole ? 'Independent Practitioner' : 'Product & Systems Group',
          reason: 'Requesting full CareerOS workspace access.',
          sourceLocation: this.modalState.sourceLocation,
          authenticatedUserId: isGuestRole ? null : 'usr-alex-rivera',
          authenticatedUserName: isGuestRole ? null : 'Alex Rivera',
          effectiveRoleAtSubmission: USER_FACING_ROLE_MAP[this.simulatedRole],
          status: 'declined',
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          reviewedBy: 'admin_lead',
          reviewedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        }
      );
    }

    // simulatedAccessState === 'No Request'
    if (this.lastSubmittedRequestId) {
      const found = this.requests.find((r) => r.id === this.lastSubmittedRequestId);
      if (found) return found;
    }

    return null;
  }

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
    userFacingRole: string;
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
        userFacingRole: USER_FACING_ROLE_MAP['Guest'],
      };
    }

    if (role === 'Demo User' || role === 'Request Full Access') {
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
        defaultOrganization: 'Product & Systems Group',
        effectiveRoleLabel: role,
        userFacingRole: USER_FACING_ROLE_MAP[role],
      };
    }

    // role === 'Admin'
    if (actualUser.isAdmin) {
      return {
        isAuthenticatedAccount: true,
        isAdminView: true,
        accountId: actualUser.id,
        defaultEmail: actualUser.email,
        defaultName: actualUser.name,
        defaultOrganization: 'CareerOS Platform Admin',
        effectiveRoleLabel: 'Admin',
        userFacingRole: USER_FACING_ROLE_MAP['Admin'],
      };
    }

    const isGuestLevel = actualUser.accessLevel === 'PUBLIC' || actualUser.accessLevel === 'GUEST';
    const fallbackRole: SimulatedRoleOption = isGuestLevel ? 'Guest' : 'Demo User';
    return {
      isAuthenticatedAccount: !isGuestLevel,
      isAdminView: false,
      accountId: isGuestLevel ? null : actualUser.id,
      defaultEmail: isGuestLevel ? '' : actualUser.email,
      defaultName: isGuestLevel ? '' : actualUser.name,
      defaultOrganization: '',
      effectiveRoleLabel: fallbackRole,
      userFacingRole: USER_FACING_ROLE_MAP[fallbackRole],
    };
  }

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
      this.simulatedAccessState = existing.status === 'approved' ? 'Approved' : 'Pending';
      this.notify();
      return {
        success: true,
        isDuplicate: true,
        request: existing,
      };
    }

    const now = new Date().toISOString();
    const sanitizeField = (val?: string, max = 500) =>
      val ? val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim().slice(0, max) : undefined;

    const newRequest: CareerOSSeatRequest = {
      id: `seat-req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      email: cleanEmail.slice(0, 254),
      name: sanitizeField(input.name, 120),
      organization: sanitizeField(input.organization, 160),
      reason: sanitizeField(input.reason, 1000),
      sourceLocation: sanitizeField(input.sourceLocation || this.modalState.sourceLocation, 120) || 'CareerOS Workspace CTA',
      authenticatedUserId: input.authenticatedUserId || null,
      authenticatedUserName: sanitizeField(input.authenticatedUserName || input.name, 120) || null,
      effectiveRoleAtSubmission: USER_FACING_ROLE_MAP[this.simulatedRole],
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    this.requests = [newRequest, ...this.requests];
    this.lastSubmittedRequestId = newRequest.id;
    this.simulatedAccessState = 'Pending';
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY_SIMULATED_ACCESS_STATE, 'Pending');
      } catch {
        // Ignore
      }
    }
    this.saveRequests();
    this.notify();

    if (typeof window !== 'undefined') {
      fetch('/api/seat-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newRequest.email,
          name: newRequest.name,
          organization: newRequest.organization,
          reason: newRequest.reason,
          sourceLocation: newRequest.sourceLocation,
          authenticatedUserId: newRequest.authenticatedUserId,
          effectiveRoleAtSubmission: newRequest.effectiveRoleAtSubmission,
        }),
      }).catch(() => {
        // Local persistence already updated
      });
    }

    return {
      success: true,
      isDuplicate: false,
      request: newRequest,
    };
  }

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
    this.simulatedAccessState = 'No Request';
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY_SIMULATED_ACCESS_STATE, 'No Request');
      } catch {
        // Ignore
      }
    }
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
  const [simulatedAccessState, setSimulatedAccessStateLocal] = useState<SimulatedAccessState>(() =>
    seatRequestService.getSimulatedAccessState()
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
      setSimulatedAccessStateLocal(seatRequestService.getSimulatedAccessState());
      setRequests(seatRequestService.getAllRequests());
      setModalState(seatRequestService.getModalState());
    });
  }, []);

  return {
    simulatedRole,
    userFacingSimulatedState: USER_FACING_ROLE_MAP[simulatedRole] || simulatedRole,
    simulatedAccessState,
    isSimulating: simulatedRole !== 'Admin' || simulatedAccessState !== 'No Request',
    requests,
    pendingCount: requests.filter((r) => r.status === 'pending').length,
    modalState,
    getDisplayAccessState: (overrides?: Partial<DisplayAccessStateInput>) =>
      getDisplayAccessState({
        simulatedRole,
        seatRequestState: simulatedAccessState,
        ...overrides,
      }),
    setSimulatedRole: (role: SimulatedRoleOption) => seatRequestService.setSimulatedRole(role),
    setSimulatedAccessState: (state: SimulatedAccessState) =>
      seatRequestService.setSimulatedAccessState(state),
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
