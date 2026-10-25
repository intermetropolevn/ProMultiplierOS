import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Unlock,
  KeyRound,
  LogOut,
  Presentation
} from 'lucide-react';
import { useAccessControl } from '../../services/accessControlService';
import { useDemoWorkspace } from '../../services/demoWorkspaceService';
import { isShowcaseModeEnabled, setShowcaseModeEnabled } from './ShowcaseModeController';
import { RoleSimulationControl } from './RequestSeatModal';

export const BetaAccessBadge: React.FC = () => {
  const {
    accessLevel,
    sessionState,
    capabilities,
    setAccessLevel,
    openContextualPrompt,
    requestFullAccess,
    demoCredentials
  } = useAccessControl();

  const {
    usageBreakdowns,
    resetDemoWorkspace
  } = useDemoWorkspace();

  const [isOpen, setIsOpen] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [fullAccessConfirmed, setFullAccessConfirmed] = useState(false);
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

  const badgeStyle = isDemo
    ? 'bg-amber-50 text-amber-900 border-amber-200/90 hover:bg-amber-100/80'
    : isFull
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70'
    : 'bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100/70';

  const dotColor = isDemo
    ? 'bg-amber-500'
    : isFull
    ? 'bg-emerald-500'
    : 'bg-blue-500';

  const handleResetDemo = () => {
    resetDemoWorkspace();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 2200);
  };

  const handleRequestFullAccess = () => {
    setIsOpen(false);
    requestFullAccess(false, 'Header Workspace Badge');
    setFullAccessConfirmed(true);
    setTimeout(() => setFullAccessConfirmed(false), 2500);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Subtle Workspace Indicator in Header */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${badgeStyle}`}
        title={isDemo ? 'DEMO WORKSPACE — Click to view workspace usage and options' : 'CareerOS Beta — Click to view workspace status'}
        aria-label="Workspace Access Status"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className="font-semibold tracking-wide">
          {isDemo ? 'DEMO WORKSPACE' : capabilities.tierBadgeLabel}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Product Workspace Status Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200/90 shadow-2xl py-3.5 px-4 z-50 text-slate-800 animate-in fade-in zoom-in-95">
          {isDemo ? (
            <>
              {/* Demo Workspace Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-[10px] font-bold tracking-wider uppercase text-amber-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      DEMO WORKSPACE
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {demoCredentials.username}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Demo changes are isolated to this workspace and may be reset.
                  </p>
                </div>
              </div>

              {/* Demo Workspace Usage Table */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Demo Workspace Usage
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Created in workspace
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200/80 divide-y divide-slate-200/60 overflow-hidden">
                  {usageBreakdowns.map((item) => {
                    const isAtCap = item.used >= item.limit;
                    return (
                      <div
                        key={item.category}
                        className="px-3 py-1.5 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-700">
                          {item.label}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                            isAtCap
                              ? 'bg-amber-100 text-amber-900'
                              : item.used > 0
                              ? 'bg-white text-slate-900 border border-slate-200/80'
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

              {/* Confirmation Notifications */}
              {resetConfirmed && (
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Demo Workspace restored to its original seed state.</span>
                </div>
              )}

              {fullAccessConfirmed || sessionState === 'FULL_ACCESS_REQUESTED' ? (
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>CareerOS Seat request recorded for your workspace.</span>
                </div>
              ) : null}

              {/* Primary Demo Workspace Actions */}
              <div className="mt-3.5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = !showcaseEnabled;
                    setShowcaseModeEnabled(next);
                    setShowcaseEnabled(next);
                  }}
                  className={`w-full px-3.5 py-2 rounded-xl border font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    showcaseEnabled
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span>{showcaseEnabled ? 'Showcase Mode Active (12-Stage Narrative)' : 'Launch Showcase Mode Walkthrough'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRequestFullAccess}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Request a CareerOS Seat</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Demo Workspace</span>
                </button>
              </div>

              {/* QA Role Simulation Panel inside Demo Popover */}
              <RoleSimulationControl variant="panel" className="mt-3" />

              {/* Subtle Exit Demo Link */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Signed in as <strong className="font-mono text-slate-700">{demoCredentials.username}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setAccessLevel('GUEST');
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Exit to Guest Preview</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest / Preview Mode Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900">
                      You&apos;re exploring CareerOS Beta
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Most product workflows are available to explore. Advanced intelligence and creation features are available in the Demo Workspace.
                  </p>
                </div>
              </div>

              {/* Demo Credentials Card */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    Demo Workspace Account
                  </span>
                  <span className="text-[10px] text-slate-500">Isolated Sandbox</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5 text-xs">
                  <div className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      Username
                    </span>
                    <span className="font-mono font-semibold text-slate-900">
                      {demoCredentials.username}
                    </span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      Password
                    </span>
                    <span className="font-mono font-semibold text-slate-900">
                      {demoCredentials.password}
                    </span>
                  </div>
                </div>
              </div>

              {fullAccessConfirmed || sessionState === 'FULL_ACCESS_REQUESTED' ? (
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>CareerOS Seat request recorded for your session.</span>
                </div>
              ) : null}

              <div className="mt-3.5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openContextualPrompt();
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enter Demo Workspace</span>
                </button>
                <button
                  type="button"
                  onClick={handleRequestFullAccess}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Request a CareerOS Seat
                </button>
              </div>

              {/* QA Role Simulation Panel inside Guest Popover */}
              <RoleSimulationControl variant="panel" className="mt-3" />
            </>
          )}
        </div>
      )}
    </div>
  );
};
