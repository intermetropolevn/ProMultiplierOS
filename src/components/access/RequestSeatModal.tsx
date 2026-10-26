import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  Shield,
  Mail,
  User,
  Building2,
  MessageSquare,
  RotateCcw,
  Terminal,
  AlertCircle,
  Clock,
  Check,
  XCircle,
  Lock,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAccessControl } from '../../services/accessControlService';
import {
  useSeatRequestService,
  SIMULATED_ROLE_OPTIONS,
  SIMULATED_ACCESS_STATE_OPTIONS,
} from '../../services/seatRequestService';

interface RoleSimulationControlProps {
  variant?: 'bar' | 'panel' | 'compact';
  className?: string;
}

/**
 * Compact Developer / QA Simulation Control.
 *
 * Intentionally styled as an internal developer utility (monospace typography,
 * console-slate surface, dashed technical border) so it never looks like normal
 * CareerOS product UI.
 *
 * - Primary control: "QA Simulation" dropdown with 4 options:
 *   Admin | Guest | Demo User | Request Full Access
 * - Active state indicated solely by the selected option's highlighted background
 *   (no "Active", "Current", or "Simulated" labels next to options).
 * - Technical details (Actual role, Simulated state, Access state, Workspace) and
 *   the secondary "Access State" selector (No Request | Pending | Approved | Rejected)
 *   remain hidden when collapsed and are revealed only when the QA panel is expanded.
 */
export const RoleSimulationControl: React.FC<RoleSimulationControlProps> = ({
  variant = 'bar',
  className = '',
}) => {
  const { isAdmin, role, accessLevel } = useAccessControl();
  const {
    simulatedRole,
    userFacingSimulatedState,
    simulatedAccessState,
    isSimulating,
    setSimulatedRole,
    setSimulatedAccessState,
    resetSimulation,
    openRequestModal,
  } = useSeatRequestService();

  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actualRoleLabel = isAdmin || role === 'ADMIN' || role === 'OWNER' ? 'Admin' : 'User';

  const workspaceLabel =
    simulatedRole === 'Demo User' || accessLevel === 'DEMO'
      ? 'Demo Workspace'
      : simulatedRole === 'Guest' || accessLevel === 'GUEST' || accessLevel === 'PUBLIC'
      ? 'Guest Preview'
      : 'Demo Workspace';

  return (
    <div
      data-qa-simulation-control={variant}
      className={`font-mono text-[11px] rounded-lg border border-dashed border-slate-700/90 bg-slate-950 text-slate-200 ${className}`}
    >
      {/* Compact Collapsed Toolbar Row */}
      <div className="px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-tight text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>QA Simulation</span>
          </span>

          {/* Custom Dropdown with Highlighted Background for Selected Option */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-label="QA Simulation"
              className="inline-flex items-center justify-between gap-2 min-w-[148px] px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-white transition-colors cursor-pointer"
            >
              <span>{userFacingSimulatedState}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {isDropdownOpen && (
              <div
                role="listbox"
                aria-label="QA Simulation Options"
                className="absolute left-0 top-full mt-1 w-48 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl py-1 z-50"
              >
                {SIMULATED_ROLE_OPTIONS.map((opt) => {
                  const isSelected = simulatedRole === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSimulatedRole(opt);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[11px] font-medium transition-colors cursor-pointer block ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Controls: Expand/Collapse QA Panel & Reset */}
        <div className="flex items-center gap-1.5">
          {isSimulating && (
            <button
              type="button"
              onClick={resetSimulation}
              title="Reset QA Simulation"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5 text-slate-400" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsPanelExpanded((prev) => !prev)}
            aria-expanded={isPanelExpanded}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium transition-colors cursor-pointer"
          >
            <span>{isPanelExpanded ? 'Hide QA Panel' : 'QA Panel'}</span>
            {isPanelExpanded ? (
              <ChevronUp className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded QA Panel (Hidden when collapsed) */}
      {isPanelExpanded && (
        <div className="px-3 py-2.5 border-t border-dashed border-slate-800 bg-slate-900/70 space-y-2.5">
          {/* Technical Details */}
          <div className="rounded bg-slate-950 border border-slate-800/90 px-2.5 py-2 space-y-1 text-[11px] leading-relaxed">
            <div className="text-slate-300">
              Actual role: <span className="text-white font-semibold">{actualRoleLabel}</span>
            </div>
            <div className="text-slate-300">
              Simulated state:{' '}
              <span className="text-white font-semibold">{userFacingSimulatedState}</span>
            </div>
            <div className="text-slate-300">
              Access state:{' '}
              <span className="text-white font-semibold">{simulatedAccessState}</span>
            </div>
            <div className="text-slate-300">
              Workspace: <span className="text-white font-semibold">{workspaceLabel}</span>
            </div>
          </div>

          {/* Secondary Access State Selector */}
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Access State
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {SIMULATED_ACCESS_STATE_OPTIONS.map((stateOpt) => {
                const isSelected = simulatedAccessState === stateOpt;
                return (
                  <button
                    key={stateOpt}
                    type="button"
                    onClick={() => setSimulatedAccessState(stateOpt)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors border cursor-pointer text-center ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {stateOpt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Developer Modal Trigger */}
          <div className="pt-1 flex items-center justify-end gap-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => openRequestModal('QA Simulation Panel')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Open Seat Request Modal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Canonical CareerOS Seat Request Modal
 *
 * Uses the centralized `getDisplayAccessState` mapping:
 * - Admin (no seat request state override) -> Admin Seat Request Management
 * - Guest / Demo User / Request Full Access -> End-user "Request Full Access" modal
 *   ("Leave your email to request a CareerOS seat." + CTA "Request a CareerOS Seat")
 * - Pending -> "Pending" ("Your CareerOS seat request is under review.")
 * - Approved -> "CareerOS Access"
 * - Rejected -> "Request again" retry flow
 */
export const RequestSeatModal: React.FC = () => {
  const {
    user,
    isAdmin,
    role,
    accessLevel,
    markFullAccessRequested,
    setAccessLevel,
  } = useAccessControl();

  const {
    simulatedRole,
    simulatedAccessState,
    requests,
    pendingCount,
    modalState,
    getDisplayAccessState,
    setSimulatedRole,
    setSimulatedAccessState,
    closeRequestModal,
    submitSeatRequest,
    reviewSeatRequest,
    getCurrentUserActiveRequest,
    getEffectiveUserIdentity,
    clearLastSubmittedSessionRequest,
  } = useSeatRequestService();

  const actualIsAdmin = isAdmin || role === 'ADMIN' || role === 'OWNER';

  const identity = getEffectiveUserIdentity({
    id: user.id,
    name: user.name,
    email: user.email,
    accessLevel: user.accessLevel,
    isAdmin: actualIsAdmin,
  });

  const [email, setEmail] = useState(identity.defaultEmail);
  const [name, setName] = useState(identity.defaultName);
  const [organization, setOrganization] = useState(identity.defaultOrganization);
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState(false);
  const [adminFilter, setAdminFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');

  // Re-initialize form fields when modal opens or simulatedRole changes
  useEffect(() => {
    if (!modalState.isOpen) return;
    setEmail(identity.defaultEmail);
    setName(identity.defaultName);
    setOrganization(identity.defaultOrganization);
    setErrorMessage(null);
    setDuplicateNotice(false);
  }, [
    modalState.isOpen,
    simulatedRole,
    identity.defaultEmail,
    identity.defaultName,
    identity.defaultOrganization,
  ]);

  if (!modalState.isOpen) {
    return null;
  }

  const activeUserRequest = getCurrentUserActiveRequest(
    simulatedRole === 'Guest' ? undefined : email
  );

  const effectiveSeatState = activeUserRequest
    ? activeUserRequest.status
    : simulatedAccessState;

  const displayAccess = getDisplayAccessState({
    authState: identity.isAuthenticatedAccount ? 'AUTHENTICATED' : 'GUEST',
    actualRole: actualIsAdmin ? 'Admin' : 'User',
    simulatedRole,
    workspaceState: accessLevel,
    seatRequestState: effectiveSeatState,
  });

  const showUserAccessStateView = displayAccess.isEndUserRequestFlow;

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = submitSeatRequest({
      email,
      name,
      organization,
      reason,
      sourceLocation: modalState.sourceLocation,
      authenticatedUserId: identity.accountId,
      authenticatedUserName: identity.isAuthenticatedAccount ? name || identity.defaultName : null,
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Unable to submit request. Please check your email.');
      return;
    }

    setDuplicateNotice(Boolean(result.isDuplicate));
    markFullAccessRequested();
  };

  const filteredAdminRequests = requests.filter((req) =>
    adminFilter === 'all' ? true : req.status === adminFilter
  );

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="careeros-seat-request-title"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Compact Developer / QA Simulation Control Bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5">
          <RoleSimulationControl variant="bar" />
        </div>

        {/* Main Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-800/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                !showUserAccessStateView
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                  : activeUserRequest?.status === 'declined'
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : activeUserRequest?.status === 'approved'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
              }`}
            >
              {!showUserAccessStateView ? (
                <Shield className="w-5 h-5" />
              ) : activeUserRequest?.status === 'declined' ? (
                <XCircle className="w-5 h-5" />
              ) : activeUserRequest?.status === 'approved' ? (
                <BadgeCheck className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="careeros-seat-request-title"
                  className="text-lg font-bold text-white tracking-tight"
                >
                  {!showUserAccessStateView
                    ? 'Admin'
                    : activeUserRequest?.status === 'approved'
                    ? 'CareerOS Access'
                    : activeUserRequest?.status === 'pending'
                    ? 'Pending'
                    : activeUserRequest?.status === 'declined'
                    ? 'Request Full Access'
                    : 'Request Full Access'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {!showUserAccessStateView ? 'Admin Seat Queue' : displayAccess.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {!showUserAccessStateView
                  ? 'Platform management access — Review incoming seat requests or use QA Simulation above to test Guest, Demo User, or Request Full Access.'
                  : activeUserRequest?.status === 'pending'
                  ? 'Your CareerOS seat request is under review.'
                  : activeUserRequest?.status === 'approved'
                  ? 'Your CareerOS seat has been approved.'
                  : activeUserRequest?.status === 'declined'
                  ? 'Leave your email to request a CareerOS seat.'
                  : 'Leave your email to request a CareerOS seat.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeRequestModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!showUserAccessStateView ? (
            /* ============================================================
               ADMIN VIEW (When Resolved State === 'Admin' & No Request)
               ============================================================ */
            <div className="space-y-4">
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Shield className="w-4 h-4" />
                    Platform management access ({pendingCount} pending requests)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Switch QA Simulation to <strong>Demo User</strong>,{' '}
                    <strong>Guest</strong>, or <strong>Request Full Access</strong> to test the
                    end-user seat request modal.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSimulatedRole('Request Full Access')}
                    className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Request Full Access
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulatedRole('Demo User')}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Demo User
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  {(['all', 'pending', 'approved', 'declined'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setAdminFilter(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                        adminFilter === tab
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800/70 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab === 'declined' ? 'rejected' : tab} (
                      {tab === 'all'
                        ? requests.length
                        : requests.filter((r) => r.status === tab).length}
                      )
                    </button>
                  ))}
                </div>
              </div>

              {/* Seat Requests List */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {filteredAdminRequests.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No seat requests match the selected filter.
                  </div>
                ) : (
                  filteredAdminRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {req.name || 'Unnamed Applicant'}
                          </span>
                          <span className="text-xs text-indigo-300 font-mono">{req.email}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              req.status === 'approved'
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : req.status === 'declined'
                                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {req.status === 'declined' ? 'Rejected' : req.status}
                          </span>
                        </div>

                        {req.organization && (
                          <div className="text-xs text-slate-400 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>{req.organization}</span>
                          </div>
                        )}

                        {req.reason && (
                          <p className="text-xs text-slate-300 bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 leading-relaxed">
                            "{req.reason}"
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span>Source: {req.sourceLocation}</span>
                          <span>•</span>
                          <span>{new Date(req.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => reviewSeatRequest(req.id, 'approved')}
                          disabled={req.status === 'approved'}
                          className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                            req.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400/50 border border-emerald-500/20 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => reviewSeatRequest(req.id, 'declined')}
                          disabled={req.status === 'declined'}
                          className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                            req.status === 'declined'
                              ? 'bg-rose-500/10 text-rose-400/50 border border-rose-500/20 cursor-not-allowed'
                              : 'bg-slate-800 hover:bg-rose-600/20 text-slate-300 hover:text-rose-300 border border-slate-700 cursor-pointer'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : activeUserRequest ? (
            /* ============================================================
               SEAT ACCESS STATE VIEW (Pending, CareerOS Access, or Request again)
               ============================================================ */
            <div className="space-y-5">
              <div
                className={`rounded-2xl border p-5 ${
                  activeUserRequest.status === 'approved'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : activeUserRequest.status === 'declined'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : 'bg-indigo-500/10 border-indigo-500/30'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      activeUserRequest.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : activeUserRequest.status === 'declined'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {activeUserRequest.status === 'approved' ? (
                      <BadgeCheck className="w-5 h-5" />
                    ) : activeUserRequest.status === 'declined' ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-white">
                        {activeUserRequest.status === 'approved'
                          ? 'CareerOS Access'
                          : activeUserRequest.status === 'declined'
                          ? 'Seat Request Not Approved'
                          : 'Pending'}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          activeUserRequest.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : activeUserRequest.status === 'declined'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        }`}
                      >
                        {activeUserRequest.status === 'approved'
                          ? 'CareerOS Access'
                          : activeUserRequest.status === 'declined'
                          ? 'Rejected'
                          : 'Pending'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeUserRequest.status === 'approved'
                        ? 'Your CareerOS practitioner seat has been approved. You now have access to full role calibration, unlimited projects, and live AI coaching.'
                        : activeUserRequest.status === 'declined'
                        ? 'Your previous CareerOS seat request was not approved for the current cohort allocation. Click "Request again" below to submit an updated request.'
                        : 'Your CareerOS seat request is under review. Duplicate submissions for this account/email are automatically prevented while your request is active.'}
                    </p>

                    {duplicateNotice && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Duplicate submission prevented — displaying your existing active request.
                      </div>
                    )}
                  </div>
                </div>

                {/* Submitted Record Details */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Applicant Email</span>
                    <span className="font-semibold text-white font-mono">
                      {activeUserRequest.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Name & Organization</span>
                    <span className="font-semibold text-white">
                      {activeUserRequest.name || 'Not specified'}
                      {activeUserRequest.organization
                        ? ` · ${activeUserRequest.organization}`
                        : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {activeUserRequest.status === 'declined' ? (
                    <button
                      type="button"
                      onClick={() => {
                        clearLastSubmittedSessionRequest();
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request again</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        clearLastSubmittedSessionRequest();
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Test New Request Form
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {activeUserRequest.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAccessLevel('FULL');
                        closeRequestModal();
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Activate CareerOS Access
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeRequestModal}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================
               END-USER SEAT REQUEST FORM (Guest, Demo User, Request Full Access)
               ============================================================ */
            <form onSubmit={handleUserSubmit} className="space-y-4">
              {/* Context Banner for Account Association */}
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {identity.isAuthenticatedAccount ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-300">
                        Leave your email to request a CareerOS seat for your workspace.
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-slate-300">
                        Leave your email to request a CareerOS seat (valid email required).
                      </span>
                    </>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 px-4 py-3 text-xs text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Field (Required) */}
              <div>
                <label
                  htmlFor="seat-request-email"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  Work or Personal Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="seat-request-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/90 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Name & Organization Grid (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="seat-request-name"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Full Name <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="seat-request-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="seat-request-org"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Company / Organization{' '}
                    <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="seat-request-org"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Acme Corp / Cohort"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Why they want access (Optional) */}
              <div>
                <label
                  htmlFor="seat-request-reason"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Why do you want access?{' '}
                  <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <textarea
                    id="seat-request-reason"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Share your target role, career mission, or how you plan to use CareerOS..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit / Cancel Footer */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400">
                  Leave your email to request a CareerOS seat
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={closeRequestModal}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Request a CareerOS Seat
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
