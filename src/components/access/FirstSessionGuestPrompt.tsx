import React, { useState, useEffect } from 'react';
import { Shield, KeyRound, Check, Copy, X, ArrowRight, Unlock, CheckCircle2, RotateCcw, ChevronDown, ChevronUp, Presentation } from 'lucide-react';
import {
  useAccessControl,
  DEMO_WORKSPACE_CREDENTIALS,
  GuestSessionState
} from '../../services/accessControlService';
import { useDemoWorkspace } from '../../services/demoWorkspaceService';
import { isShowcaseModeEnabled, setShowcaseModeEnabled } from './ShowcaseModeController';
import { RoleSimulationControl } from './RequestSeatModal';
import { useSeatRequestService } from '../../services/seatRequestService';

const SESSION_STATE_LABELS: Record<GuestSessionState, string> = {
  FIRST_VISIT: 'First Visit · Guest Preview',
  RETURNING_GUEST: 'Returning Guest · Curated Exploration',
  DEMO_AVAILABLE: 'Demo Workspace Available',
  DEMO_ACTIVE: 'Demo Workspace Active',
  FULL_ACCESS_REQUESTED: 'CareerOS Seat Requested'
};

/**
 * Lightweight, non-intrusive contextual prompt shown after meaningful interaction
 * or when a guest clicks to enter the Demo Workspace.
 * Does NOT force a login modal on initial entry and does NOT repeat on every page once dismissed.
 */
export const FirstSessionGuestPrompt: React.FC = () => {
  const {
    accessLevel,
    sessionState,
    isContextualPromptOpen,
    continueExploring,
    enterDemoWorkspace,
    requestFullAccess
  } = useAccessControl();

  const [username, setUsername] = useState<string>(DEMO_WORKSPACE_CREDENTIALS.username);
  const [password, setPassword] = useState<string>(DEMO_WORKSPACE_CREDENTIALS.password);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'user' | 'pass' | null>(null);
  const [fullAccessSubmitted, setFullAccessSubmitted] = useState(false);

  if (!isContextualPromptOpen || accessLevel === 'DEMO' || accessLevel === 'FULL') {
    return null;
  }

  const handleCopy = (value: string, field: 'user' | 'pass') => {
    try {
      navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      // Ignore clipboard errors
    }
  };

  const handleEnterDemo = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = enterDemoWorkspace(username, password);
    if (!result.success) {
      setErrorMsg(result.message || 'Invalid credentials.');
    }
  };

  const handleRequestFullAccess = () => {
    requestFullAccess(false, 'First-Session Guest Prompt');
    setFullAccessSubmitted(true);
    setTimeout(() => {
      continueExploring();
      setFullAccessSubmitted(false);
    }, 600);
  };

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5 text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-200"
      role="dialog"
      aria-labelledby="careeros-beta-prompt-title"
      aria-describedby="careeros-beta-prompt-desc"
    >
      {/* Top Kicker & Dismiss */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              {SESSION_STATE_LABELS[sessionState]}
            </div>
            <h3
              id="careeros-beta-prompt-title"
              className="text-sm font-bold text-slate-900 tracking-tight"
            >
              You&apos;re exploring CareerOS Beta
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={continueExploring}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Continue Exploring"
          aria-label="Close prompt and continue exploring"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Explanation */}
      <p
        id="careeros-beta-prompt-desc"
        className="text-xs text-slate-600 leading-relaxed mt-3"
      >
        Most product workflows are available to explore. Advanced intelligence and creation features are available in the Demo Workspace.
      </p>

      {/* Demo Credentials Box */}
      <form onSubmit={handleEnterDemo} className="mt-3.5 space-y-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              Demo Workspace Credentials
            </span>
            <span>Pre-filled for instant access</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Username
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-2.5 py-1.5 pr-7 rounded-lg bg-white border border-slate-200 text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  aria-label="Demo Username"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(DEMO_WORKSPACE_CREDENTIALS.username, 'user')}
                  className="absolute right-1.5 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Copy username"
                >
                  {copiedField === 'user' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-2.5 py-1.5 pr-7 rounded-lg bg-white border border-slate-200 text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  aria-label="Demo Password"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(DEMO_WORKSPACE_CREDENTIALS.password, 'pass')}
                  className="absolute right-1.5 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Copy password"
                >
                  {copiedField === 'pass' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-medium">
            {errorMsg}
          </div>
        )}

        {fullAccessSubmitted && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>CareerOS Seat request recorded for this session.</span>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={continueExploring}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Continue Exploring
          </button>
          <button
            type="submit"
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Unlock className="w-3.5 h-3.5 text-amber-400" />
            <span>Enter Demo Workspace</span>
          </button>
        </div>

        {/* Subtle Request a CareerOS Seat footer */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>Exploring with 3 curated records per module</span>
          <button
            type="button"
            onClick={handleRequestFullAccess}
            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer hover:underline"
          >
            Request a CareerOS Seat
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * Subtle, single-line contextual status bar at the top of the workspace
 * that explains Guest vs Demo mode without blocking exploration.
 */
export const FirstSessionContextBar: React.FC = () => {
  const {
    accessLevel,
    isAdmin,
    role,
    openContextualPrompt,
    requestFullAccess
  } = useAccessControl();
  const {
    simulatedRole,
    simulatedAccessState,
    getDisplayAccessState,
    getCurrentUserActiveRequest
  } = useSeatRequestService();
  const { usageBreakdowns, resetDemoWorkspace } = useDemoWorkspace();
  const [showUsageDetails, setShowUsageDetails] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showcaseEnabled, setShowcaseEnabled] = useState<boolean>(() => isShowcaseModeEnabled());

  useEffect(() => {
    const syncShowcase = () => setShowcaseEnabled(isShowcaseModeEnabled());
    window.addEventListener('career_showcase_mode_changed', syncShowcase);
    return () => window.removeEventListener('career_showcase_mode_changed', syncShowcase);
  }, []);

  if (accessLevel === 'FULL') {
    return null;
  }

  const actualIsAdmin = isAdmin || role === 'ADMIN' || role === 'OWNER';
  const activeRequest = getCurrentUserActiveRequest();
  const effectiveSeatState = activeRequest ? activeRequest.status : simulatedAccessState;

  const displayAccess = getDisplayAccessState({
    authState: accessLevel === 'GUEST' || accessLevel === 'PUBLIC' ? 'GUEST' : 'AUTHENTICATED',
    actualRole: actualIsAdmin ? 'Admin' : 'User',
    simulatedRole,
    workspaceState: accessLevel,
    seatRequestState: effectiveSeatState
  });

  const renderSeatCtaButton = (sourceLabel: string) => {
    if (displayAccess.seatAccessStatus === 'pending') {
      return (
        <button
          type="button"
          onClick={() => requestFullAccess(false, sourceLabel)}
          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-semibold text-amber-900 inline-flex items-center gap-1 transition-colors cursor-pointer"
          title="Your CareerOS seat request is under review."
        >
          <CheckCircle2 className="w-3 h-3 text-amber-600" />
          <span>Pending</span>
        </button>
      );
    }

    if (displayAccess.seatAccessStatus === 'approved') {
      return (
        <button
          type="button"
          onClick={() => requestFullAccess(false, sourceLabel)}
          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold text-emerald-800 inline-flex items-center gap-1 transition-colors cursor-pointer"
          title="Your CareerOS seat has been approved."
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>CareerOS Access</span>
        </button>
      );
    }

    if (displayAccess.seatAccessStatus === 'rejected') {
      return (
        <button
          type="button"
          onClick={() => requestFullAccess(false, sourceLabel)}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition-colors cursor-pointer"
        >
          Request again
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => requestFullAccess(false, sourceLabel)}
        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition-colors cursor-pointer"
      >
        Request a CareerOS Seat
      </button>
    );
  };

  if (accessLevel === 'DEMO') {
    const handleReset = () => {
      resetDemoWorkspace();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2200);
    };

    const handleToggleShowcase = () => {
      const next = !showcaseEnabled;
      setShowcaseModeEnabled(next);
      setShowcaseEnabled(next);
    };

    return (
      <div className="mb-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-slate-800 overflow-hidden">
        <div className="px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          {/* ONE Primary Access Label + ONE Contextual Description */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100/90 border border-amber-300/80 text-[10px] font-bold tracking-wider text-amber-950 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {displayAccess.displayLabel}
            </span>
            <span className="text-slate-700 font-medium">
              {displayAccess.supportingText}
            </span>
            {resetSuccess && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                Workspace reset to seed state
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleToggleShowcase}
              className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                showcaseEnabled
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}
              title="Toggle deterministic 12-stage Showcase Mode narrative"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>{showcaseEnabled ? 'Showcase Mode: ON' : 'Showcase Mode'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUsageDetails(prev => !prev)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-amber-200/90 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span>Workspace Usage</span>
              {showUsageDetails ? (
                <ChevronUp className="w-3 h-3 text-slate-500" />
              ) : (
                <ChevronDown className="w-3 h-3 text-slate-500" />
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Reset Demo Workspace</span>
            </button>

            {renderSeatCtaButton('Demo Workspace Context Bar')}
          </div>
        </div>

        {/* Compact Developer / QA Simulation Control */}
        <div className="px-3.5 py-1.5 bg-slate-950 border-t border-amber-200/60">
          <RoleSimulationControl variant="bar" />
        </div>

        {/* Expandable Entity-Backed Demo Workspace Usage Bar */}
        {showUsageDetails && (
          <div className="px-3.5 py-2.5 bg-white/90 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2 w-full">
              {usageBreakdowns.map((item) => {
                const isAtLimit = item.used >= item.limit;
                return (
                  <div
                    key={item.category}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <span className="text-[11px] font-medium text-slate-700 truncate">
                      {item.label}
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold shrink-0 ${
                        isAtLimit
                          ? 'text-amber-700'
                          : item.used > 0
                          ? 'text-slate-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.used} / {item.limit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // GUEST or PUBLIC mode
  return (
    <div className="mb-4 rounded-xl bg-blue-50/60 border border-blue-200/70 text-xs text-slate-700 overflow-hidden">
      <div className="px-3.5 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* ONE Primary Access Label + ONE Contextual Description */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100/90 border border-blue-200 text-[10px] font-bold tracking-wider text-blue-950 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {displayAccess.displayLabel}
          </span>
          <span className="text-slate-700 font-medium">
            {displayAccess.supportingText}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Demo login: <strong className="font-mono text-slate-700">demo-basic</strong> / <strong className="font-mono text-slate-700">demo2026</strong>
          </span>
          <button
            type="button"
            onClick={openContextualPrompt}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Enter Demo Workspace</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          {renderSeatCtaButton('Guest Mode Context Bar')}
        </div>
      </div>

      {/* Compact Developer / QA Simulation Control */}
      <div className="px-3.5 py-1.5 bg-slate-950 border-t border-blue-200/60">
        <RoleSimulationControl variant="bar" />
      </div>
    </div>
  );
};
