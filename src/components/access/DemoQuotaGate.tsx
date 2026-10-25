import React, { useState } from 'react';
import { Layers, Shield, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { useAccessControl } from '../../services/accessControlService';
import { useDemoWorkspace, DEMO_WORKFLOW_KEY_MAP } from '../../services/demoWorkspaceService';

interface DemoQuotaGateProps {
  workflowKey: string;
  isEditing?: boolean;
  onViewExistingItems: () => void;
  children: React.ReactNode;
}

/**
 * Controlled Demo Workspace Quota Gate
 * 
 * Before creating an item in Demo Workspace (`accessLevel === 'DEMO'` and `!isEditing`),
 * checks the live sandbox application state:
 * - If quota is available (`used < 2`), renders the creation workflow (`children`).
 * - If quota is exhausted (`used >= 2`), does NOT open/render the full creation flow;
 *   instead renders the polished product demonstration limit state.
 */
export const DemoQuotaGate: React.FC<DemoQuotaGateProps> = ({
  workflowKey,
  isEditing = false,
  onViewExistingItems,
  children
}) => {
  const { accessLevel, sessionState, requestFullAccess } = useAccessControl();
  const { getCategoryUsage, resetDemoWorkspace } = useDemoWorkspace();
  const [requestedFullAccess, setRequestedFullAccess] = useState(false);

  if (accessLevel !== 'DEMO' || isEditing) {
    return <>{children}</>;
  }

  const category = DEMO_WORKFLOW_KEY_MAP[workflowKey] || 'projects';
  const usage = getCategoryUsage(category);

  if (!usage.isAtLimit) {
    return <>{children}</>;
  }

  const handleRequestFullAccess = () => {
    requestFullAccess(false, `Demo Quota Gate (${usage.label})`);
    setRequestedFullAccess(true);
  };

  return (
    <div className="p-6 sm:p-8 flex flex-col items-center text-center max-w-lg mx-auto my-auto">
      {/* Subtle Product Status Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-900 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span>DEMO WORKSPACE</span>
        <span className="text-amber-300">·</span>
        <span className="font-mono font-bold">
          {usage.label}: {usage.used} / {usage.limit}
        </span>
      </div>

      {/* Icon */}
      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 mb-4 shadow-2xs">
        <Layers className="w-6 h-6" />
      </div>

      {/* Exact Required Copy */}
      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        Demo limit reached
      </h3>

      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
        You&apos;ve used the 2 available demo records for this workflow.
      </p>

      <p className="text-xs font-medium text-slate-500 mt-1">
        Your existing demo data is still available.
      </p>

      {/* Created Demo Items Preview */}
      {usage.createdEntityTitles.length > 0 && (
        <div className="w-full mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Active Demo Records ({usage.label})</span>
            <span className="font-mono text-slate-700">{usage.used} / {usage.limit}</span>
          </div>
          <ul className="space-y-1.5">
            {usage.createdEntityTitles.slice(0, 2).map((title, idx) => (
              <li
                key={idx}
                className="text-xs font-medium text-slate-800 bg-white px-3 py-2 rounded-lg border border-slate-200/70 truncate flex items-center justify-between gap-2"
              >
                <span className="truncate">{title}</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                  Available
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Full Access Confirmation */}
      {(requestedFullAccess || sessionState === 'FULL_ACCESS_REQUESTED') && (
        <div className="w-full mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>CareerOS Seat request recorded for your workspace.</span>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={handleRequestFullAccess}
          className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Request a CareerOS Seat</span>
        </button>

        <button
          type="button"
          onClick={onViewExistingItems}
          className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
        >
          <span>View Existing Items</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Subtle Reset Helper */}
      <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-[11px] text-slate-400">
        <span>Demo changes are isolated to this workspace.</span>
        <button
          type="button"
          onClick={() => resetDemoWorkspace()}
          className="text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Workspace</span>
        </button>
      </div>
    </div>
  );
};
