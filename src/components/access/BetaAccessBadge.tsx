import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  Unlock,
  KeyRound,
  LogOut,
  Presentation,
  User,
  Layers,
  BarChart3,
  ExternalLink,
  Clock
} from 'lucide-react';
import { useAccessControl } from '../../services/accessControlService';
import { useDemoWorkspace } from '../../services/demoWorkspaceService';
import { useSeatRequestService } from '../../services/seatRequestService';
import { isShowcaseModeEnabled, setShowcaseModeEnabled } from './ShowcaseModeController';
import { RoleSimulationControl } from './RequestSeatModal';

interface BetaAccessBadgeProps {
  onNavigateProfile?: () => void;
}

export const BetaAccessBadge: React.FC<BetaAccessBadgeProps> = ({
  onNavigateProfile
}) => {
  const {
    accessLevel,
    isAdmin,
    role,
    setAccessLevel,
    openContextualPrompt,
    enterDemoWorkspace,
    requestFullAccess,
    demoCredentials
  } = useAccessControl();

  const {
    simulatedRole,
    simulatedAccessState,
    getDisplayAccessState,
    getCurrentUserActiveRequest
  } = useSeatRequestService();

  const {
    usageBreakdowns,
    resetDemoWorkspace
  } = useDemoWorkspace();

  const [isOpen, setIsOpen] = useState(false);
  const [isUsageExpanded, setIsUsageExpanded] = useState(true);
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [showcaseEnabled, setShowcaseEnabled] = useState<boolean>(() => isShowcaseModeEnabled());
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncShowcase = () => setShowcaseEnabled(isShowcaseModeEnabled());
    window.addEventListener('career_showcase_mode_changed', syncShowcase);
    return () => window.removeEventListener('career_showcase_mode_changed', syncShowcase);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDemo = accessLevel === 'DEMO';
  const isFull = accessLevel === 'FULL';
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

  const statusDotColor =
    displayAccess.seatAccessStatus === 'approved' || isFull
      ? 'bg-emerald-500'
      : displayAccess.category === 'Guest'
      ? 'bg-blue-500'
      : 'bg-amber-500';

  const totalUsed = usageBreakdowns.reduce((sum, item) => sum + item.used, 0);
  const totalLimit = usageBreakdowns.reduce((sum, item) => sum + item.limit, 0);

  const handleResetDemo = () => {
    resetDemoWorkspace();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 2200);
  };

  const handleRequestFullAccess = () => {
    setIsOpen(false);
    requestFullAccess(false, 'Profile Menu');
  };

  const handleEnterDemo = () => {
    enterDemoWorkspace(demoCredentials.username, demoCredentials.password);
  };

  return (
    <div className="relative inline-block shrink-0" ref={menuRef}>
      {/* Profile Avatar Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`group relative inline-flex items-center gap-1.5 p-0.5 pr-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
          isOpen
            ? 'bg-slate-100 border-slate-300 ring-2 ring-blue-500/20'
            : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300'
        }`}
        title={`${displayAccess.displayLabel} — ${displayAccess.supportingText}`}
        aria-label="Open Profile and Workspace Menu"
        aria-expanded={isOpen}
      >
        <span className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-200 to-rose-200 flex items-center justify-center font-bold text-xs text-slate-800 shadow-2xs shrink-0">
          AC
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${statusDotColor}`}
          />
        </span>
        <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-800 transition-colors shrink-0" />
      </button>

      {/* Profile, Workspace & Access Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[85vh] overflow-y-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl py-3.5 px-4 z-50 text-slate-800 animate-in fade-in zoom-in-95">
          {/* ==================================================
              SECTION 1: PROFILE (Single Canonical Resolved Access Label)
              ================================================== */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              PROFILE
            </div>
            <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-200 to-rose-200 flex items-center justify-center font-bold text-xs text-slate-800 shrink-0 shadow-2xs mt-0.5">
                  AC
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      Alex Chen
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                      {displayAccess.displayLabel}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {displayAccess.supportingText}
                  </div>
                </div>
              </div>

              {onNavigateProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateProfile();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200/90 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
                >
                  <User className="w-3 h-3 text-slate-500" />
                  <span>My Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* ==================================================
              SECTION 2: WORKSPACE (Clearly distinguishable)
              ================================================== */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              WORKSPACE
            </div>

            <div
              className={`rounded-xl border p-3 space-y-2.5 ${
                isDemo
                  ? 'bg-amber-50/40 border-amber-200/80'
                  : 'bg-slate-50/90 border-slate-200/80'
              }`}
            >
              {/* Demo Workspace Identity Row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-900">
                      Demo Workspace
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({demoCredentials.username})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {isDemo
                      ? 'Demo changes are isolated to this workspace and may be reset.'
                      : 'Switch to the isolated Demo Workspace sandbox to test creation and intelligence workflows.'}
                  </p>
                </div>
              </div>

              {!isDemo && (
                <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-amber-600" />
                      Sandbox Credentials
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {demoCredentials.username} / {demoCredentials.password}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleEnterDemo}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Unlock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Enter Demo Workspace</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        openContextualPrompt();
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
                      title="Open Demo Login Prompt"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Workspace Usage */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsUsageExpanded(prev => !prev)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Workspace Usage</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-mono text-[11px] text-slate-500">
                      {totalUsed} / {totalLimit}
                    </span>
                    {isUsageExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </span>
                </button>

                {isUsageExpanded && (
                  <div className="mt-1.5 rounded-lg bg-white border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
                    {usageBreakdowns.map((item) => {
                      const isAtCap = item.used >= item.limit;
                      return (
                        <div
                          key={item.category}
                          className="px-2.5 py-1.25 flex items-center justify-between text-[11px]"
                        >
                          <span className="font-medium text-slate-600">
                            {item.label}
                          </span>
                          <span
                            className={`font-mono text-[10.5px] font-semibold px-1.5 py-0.5 rounded ${
                              isAtCap
                                ? 'bg-amber-100 text-amber-900'
                                : item.used > 0
                                ? 'bg-slate-100 text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {item.used} / {item.limit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {resetConfirmed && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Demo Workspace restored to its original seed state.</span>
                </div>
              )}

              {/* Reset Demo Workspace & Showcase Controls */}
              <div className="flex flex-col gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Demo Workspace</span>
                </button>

                {isDemo && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = !showcaseEnabled;
                      setShowcaseModeEnabled(next);
                      setShowcaseEnabled(next);
                    }}
                    className={`w-full px-3 py-1.5 rounded-lg border font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      showcaseEnabled
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
                    }`}
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>
                      {showcaseEnabled
                        ? 'Showcase Mode Active (12-Stage Narrative)'
                        : 'Launch Showcase Mode Walkthrough'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ==================================================
              SECTION 3: ACCESS
              ================================================== */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              ACCESS
            </div>

            {displayAccess.seatAccessStatus === 'pending' ? (
              <div className="mb-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Pending</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Your CareerOS seat request is under review.
                </p>
              </div>
            ) : displayAccess.seatAccessStatus === 'approved' ? (
              <div className="mb-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>CareerOS Access</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Your CareerOS seat has been approved.
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 mb-2 leading-snug">
                Leave your email to request a CareerOS seat
              </p>
            )}

            <button
              type="button"
              onClick={handleRequestFullAccess}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {displayAccess.seatAccessStatus === 'rejected'
                  ? 'Request again'
                  : 'Request a CareerOS Seat'}
              </span>
            </button>

            {/* QA Role Simulation Panel inside Profile Menu */}
            <RoleSimulationControl variant="panel" className="mt-3" />

            {/* Sign out / Account Workspace Action */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                {isDemo ? 'Demo Workspace active' : 'Guest exploration active'}
              </span>
              {isDemo ? (
                <button
                  type="button"
                  onClick={() => {
                    setAccessLevel('GUEST');
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Exit Demo Workspace</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEnterDemo}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  <Unlock className="w-3 h-3" />
                  <span>Enter Demo Workspace</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
