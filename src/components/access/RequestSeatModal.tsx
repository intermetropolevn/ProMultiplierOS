import React, { useState, useEffect } from 'react';
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
  Sliders,
  AlertCircle,
  Clock,
  Check,
  XCircle,
  Lock,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';
import { useAccessControl } from '../../services/accessControlService';
import {
  useSeatRequestService,
  SIMULATED_ROLE_OPTIONS,
  SimulatedRoleOption,
} from '../../services/seatRequestService';

interface RoleSimulationControlProps {
  variant?: 'bar' | 'panel' | 'compact';
  className?: string;
}

/**
 * Development/Demo-only "User Simulation" control & QA indicator.
 * Allows testing the "Request a CareerOS Seat" flow across all roles even when the
 * current logged-in account is the platform Admin / Builder, without changing real production permissions.
 */
export const RoleSimulationControl: React.FC<RoleSimulationControlProps> = ({
  variant = 'bar',
  className = '',
}) => {
  const { isAdmin, role } = useAccessControl();
  const {
    simulatedRole,
    isSimulating,
    setSimulatedRole,
    resetSimulation,
    openRequestModal,
  } = useSeatRequestService();

  const actualRoleLabel = isAdmin || role === 'ADMIN' || role === 'OWNER' ? 'Admin' : 'Normal User';

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex flex-wrap items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
          isSimulating
            ? 'bg-amber-500/15 border-amber-400/40 text-amber-200'
            : 'bg-slate-900/80 border-slate-700/80 text-slate-300'
        } ${className}`}
      >
        <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
          <Sliders className="w-3 h-3" />
          Simulate role:
        </span>
        <select
          aria-label="Simulate role"
          value={simulatedRole}
          onChange={(e) => setSimulatedRole(e.target.value as SimulatedRoleOption)}
          className="bg-slate-950/90 text-white border border-slate-700 rounded px-1.5 py-0.5 text-[11px] font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          {SIMULATED_ROLE_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-900 text-white">
              {opt}
            </option>
          ))}
        </select>

        <span className="hidden xl:inline-flex items-center gap-1.5 text-[10px] text-slate-300 border-l border-slate-700/80 pl-2">
          <span>
            Current actual role: <strong className="text-white">{actualRoleLabel}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span>
            Simulated role:{' '}
            <strong className={isSimulating ? 'text-amber-300' : 'text-indigo-300'}>
              {simulatedRole}
            </strong>
          </span>
        </span>

        {isSimulating && (
          <button
            type="button"
            onClick={resetSimulation}
            title="Reset Simulation to Admin"
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-[10px] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Reset Simulation
          </button>
        )}
      </div>
    );
  }

  if (variant === 'panel') {
    return (
      <div
        className={`rounded-xl border p-3.5 transition-colors ${
          isSimulating
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-slate-900/90 border-slate-800'
        } ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Simulate role (QA / Dev Only)
            </span>
          </div>
          {isSimulating && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Simulated: {simulatedRole}
            </span>
          )}
        </div>

        {/* QA Role Indicator */}
        <div className="rounded-lg bg-slate-950/80 border border-slate-800/90 px-2.5 py-2 mb-2.5 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Current actual role:</span>
            <span className="font-semibold text-white">{actualRoleLabel}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Simulated role:</span>
            <span
              className={`font-semibold ${
                isSimulating ? 'text-amber-300' : 'text-indigo-300'
              }`}
            >
              {simulatedRole}
            </span>
          </div>
        </div>

        {/* Role Selector Buttons */}
        <div className="grid grid-cols-2 gap-1.5 mb-2.5">
          {SIMULATED_ROLE_OPTIONS.map((opt) => {
            const active = simulatedRole === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setSimulatedRole(opt)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition-all border cursor-pointer flex items-center justify-between ${
                  active
                    ? 'bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-sm'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <span className="truncate">{opt}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => openRequestModal('QA Simulation Panel')}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Test Seat CTA Now
          </button>
          <button
            type="button"
            onClick={resetSimulation}
            disabled={!isSimulating}
            className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
              isSimulating
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/40 cursor-pointer'
                : 'bg-slate-900/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            Reset Simulation
          </button>
        </div>
      </div>
    );
  }

  // Default: 'bar'
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg border text-xs ${
        isSimulating
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-100'
          : 'bg-slate-900/90 border-slate-800 text-slate-300'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
          <Sliders className="w-3.5 h-3.5" />
          Simulate role:
        </span>

        <div className="flex flex-wrap items-center gap-1">
          {SIMULATED_ROLE_OPTIONS.map((opt) => {
            const active = simulatedRole === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setSimulatedRole(opt)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all border cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                    : 'bg-slate-950/70 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
          <span className="text-slate-400">
            Current actual role: <strong className="text-white">{actualRoleLabel}</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            Simulated role:{' '}
            <strong className={isSimulating ? 'text-amber-300' : 'text-indigo-300'}>
              {simulatedRole}
            </strong>
          </span>
        </div>

        {isSimulating && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
            Simulated: {simulatedRole}
          </span>
        )}

        <button
          type="button"
          onClick={resetSimulation}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
            isSimulating
              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/40'
              : 'bg-slate-800/70 hover:bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          Reset Simulation
        </button>
      </div>
    </div>
  );
};

/**
 * Canonical CareerOS Seat Request Modal
 *
 * Dynamically adapts to the effective role (real or simulated via `RoleSimulationControl`):
 * - Normal User: User-facing modal associated with authenticated user account
 * - Guest: Unauthenticated user-facing modal (email strictly required, empty by default)
 * - Invited User: User-facing modal pre-filled with partner cohort invitation context
 * - Seat Requested: Pending confirmation state (duplicate submissions prevented)
 * - Seat Approved: Approved seat state with workspace unlock action
 * - Admin: Admin Seat Request Management & Review view (with 1-click switch to test Normal User / Guest flow)
 */
export const RequestSeatModal: React.FC = () => {
  const {
    user,
    isAdmin,
    role,
    markFullAccessRequested,
    setAccessLevel,
  } = useAccessControl();

  const {
    simulatedRole,
    isSimulating,
    requests,
    pendingCount,
    modalState,
    setSimulatedRole,
    resetSimulation,
    closeRequestModal,
    submitSeatRequest,
    reviewSeatRequest,
    getCurrentUserActiveRequest,
    getEffectiveUserIdentity,
    clearLastSubmittedSessionRequest,
  } = useSeatRequestService();

  const identity = getEffectiveUserIdentity({
    id: user.id,
    name: user.name,
    email: user.email,
    accessLevel: user.accessLevel,
    isAdmin: isAdmin || role === 'ADMIN' || role === 'OWNER',
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

  const actualRoleLabel = isAdmin || role === 'ADMIN' || role === 'OWNER' ? 'Admin' : 'Normal User';
  const activeUserRequest = getCurrentUserActiveRequest(
    simulatedRole === 'Guest' ? undefined : email
  );

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
        {/* Top Development / Demo QA Role Simulation Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold uppercase tracking-wider">
                <Sliders className="w-3 h-3" />
                QA User Simulation
              </span>
              <span className="text-slate-400">
                Current actual role: <strong className="text-white">{actualRoleLabel}</strong>
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-400">
                Simulated role:{' '}
                <strong className={isSimulating ? 'text-amber-300' : 'text-indigo-300'}>
                  {simulatedRole}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isSimulating && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  Simulated: {simulatedRole}
                </span>
              )}
              <button
                type="button"
                onClick={resetSimulation}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                Reset Simulation
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Simulate role:</span>
            {SIMULATED_ROLE_OPTIONS.map((opt) => {
              const active = simulatedRole === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSimulatedRole(opt)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all border cursor-pointer ${
                    active
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-800/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                identity.isAdminView
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                  : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
              }`}
            >
              {identity.isAdminView ? (
                <Shield className="w-5 h-5" />
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
                  {identity.isAdminView
                    ? 'Admin Seat Request Management'
                    : activeUserRequest?.status === 'approved'
                    ? 'Your CareerOS Seat is Approved'
                    : activeUserRequest?.status === 'pending'
                    ? 'CareerOS Seat Request Received'
                    : 'Request a CareerOS Seat'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Source: {modalState.sourceLocation}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {identity.isAdminView
                  ? 'Review incoming CareerOS seat requests or switch "Simulate role" above to test the Normal User or Guest request modal.'
                  : identity.effectiveRoleLabel === 'Guest'
                  ? 'Unauthenticated Guest Flow — Enter your email and context to request full workspace access.'
                  : identity.effectiveRoleLabel === 'Invited User'
                  ? 'Partner Cohort Invitation detected — Confirm your details to request seat activation.'
                  : 'Submit your details to unlock unlimited CareerOS creation, full AI coaching, and evidence synthesis.'}
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
          {identity.isAdminView ? (
            /* ============================================================
               ADMIN VIEW (When Simulated Role === 'Admin')
               ============================================================ */
            <div className="space-y-4">
              {/* Quick banner explaining why Admin sees this & 1-click switch to Normal User */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Shield className="w-4 h-4" />
                    Viewing as Platform Admin ({pendingCount} pending requests)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Because the active role is <strong>Admin</strong>, this CTA opens the Admin Seat
                    Management inbox. Switch to <strong>Normal User</strong> or{' '}
                    <strong>Guest</strong> to test the end-user seat request form.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSimulatedRole('Normal User')}
                    className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Simulate Normal User
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulatedRole('Guest')}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Simulate Guest
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
                      {tab} (
                      {tab === 'all'
                        ? requests.length
                        : requests.filter((r) => r.status === tab).length}
                      )
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">
                  Stored in <code className="text-slate-300">seatRequestService</code>
                </span>
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
                            {req.status}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                            Role: {req.effectiveRoleAtSubmission}
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
                          <span>CTA Source: {req.sourceLocation}</span>
                          <span>•</span>
                          <span>
                            Account: {req.authenticatedUserId ? req.authenticatedUserId : 'Guest'}
                          </span>
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
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : activeUserRequest ? (
            /* ============================================================
               CONFIRMATION / STATUS STATE (Pending or Approved)
               ============================================================ */
            <div className="space-y-5">
              <div
                className={`rounded-2xl border p-5 ${
                  activeUserRequest.status === 'approved'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-indigo-500/10 border-indigo-500/30'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      activeUserRequest.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {activeUserRequest.status === 'approved' ? (
                      <BadgeCheck className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-white">
                        {activeUserRequest.status === 'approved'
                          ? 'Full CareerOS Seat Approved'
                          : 'Seat Request Submitted & Pending Review'}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          activeUserRequest.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        }`}
                      >
                        {activeUserRequest.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeUserRequest.status === 'approved'
                        ? 'Your CareerOS practitioner seat has been approved. You now have access to full role calibration, unlimited projects, and live AI coaching.'
                        : 'Your request has been logged in the CareerOS Seat Queue. Duplicate submissions for this account/email are automatically prevented while your request is active.'}
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
                  <div>
                    <span className="text-slate-400 block text-[11px]">Account Association</span>
                    <span className="font-semibold text-slate-200">
                      {activeUserRequest.authenticatedUserId
                        ? `Authenticated (${activeUserRequest.authenticatedUserId})`
                        : 'Unauthenticated Guest Request'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Submitted From</span>
                    <span className="font-semibold text-slate-200">
                      {activeUserRequest.sourceLocation}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      clearLastSubmittedSessionRequest();
                      setSimulatedRole('Guest');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Test New Guest Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulatedRole('Admin')}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Inspect in Admin Inbox
                  </button>
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
                      Activate Full Workspace
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeRequestModal}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================
               END-USER SEAT REQUEST FORM (Normal User, Guest, Invited User)
               ============================================================ */
            <form onSubmit={handleUserSubmit} className="space-y-4">
              {/* Context Banner for Account Association */}
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {identity.isAuthenticatedAccount ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-300">
                        Associated with authenticated account:{' '}
                        <strong className="text-white">{identity.accountId}</strong>
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-slate-300">
                        Unauthenticated <strong>Guest</strong> session — valid email address is
                        required
                      </span>
                    </>
                  )}
                </div>

                {identity.invitationCode && (
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-semibold">
                    Invite: {identity.invitationCode}
                  </span>
                )}
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
                  Submitting as: <strong className="text-slate-200">{simulatedRole}</strong>
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
                    Submit Request
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
