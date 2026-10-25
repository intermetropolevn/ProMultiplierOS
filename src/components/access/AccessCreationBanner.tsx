import React from 'react';
import { Shield, Sparkles, RotateCcw } from 'lucide-react';
import { useAccessControl } from '../../services/accessControlService';
import { useDemoWorkspace, DEMO_WORKFLOW_KEY_MAP } from '../../services/demoWorkspaceService';

interface AccessCreationBannerProps {
  workflowKey: string;
  workflowLabel?: string;
  currentCount?: number;
  className?: string;
}

export const AccessCreationBanner: React.FC<AccessCreationBannerProps> = ({
  workflowKey,
  workflowLabel = 'items',
  currentCount = 0,
  className = ''
}) => {
  const { accessLevel, capabilities, openContextualPrompt, requestFullAccess } = useAccessControl();
  const { getCategoryUsage, resetDemoWorkspace } = useDemoWorkspace();

  if (accessLevel === 'FULL') {
    return null;
  }

  if (accessLevel === 'PUBLIC' || accessLevel === 'GUEST') {
    return (
      <div className={`p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${className}`}>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>You&apos;re seeing the basic creation flow.</strong> Advanced CareerOS Intelligence is available in Demo / Full Access.
          </span>
        </div>
        <button
          type="button"
          onClick={() => openContextualPrompt()}
          className="self-start sm:self-auto px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer shrink-0"
        >
          Unlock in Demo
        </button>
      </div>
    );
  }

  if (accessLevel === 'DEMO') {
    const resolvedCategory = DEMO_WORKFLOW_KEY_MAP[workflowKey] || 'projects';
    const usage = getCategoryUsage(resolvedCategory);
    const usedCount = usage ? usage.used : currentCount;
    const limitCount = usage ? usage.limit : capabilities.maxCreationItems;
    const displayLabel = usage ? usage.label : workflowLabel;

    return (
      <div className={`px-3 py-2 bg-slate-50/90 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 ${className}`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong className="text-slate-900">{displayLabel}: {usedCount} / {limitCount}</strong>
            <span className="text-slate-400 mx-1.5">·</span>
            <span className="text-slate-600">Demo changes are isolated to this workspace and may be reset.</span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => resetDemoWorkspace()}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Workspace</span>
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={() => requestFullAccess(false, `Workflow Creation Banner (${displayLabel})`)}
            className="text-[11px] font-semibold text-slate-800 hover:text-slate-950 underline underline-offset-2 cursor-pointer"
          >
            Request a CareerOS Seat
          </button>
        </div>
      </div>
    );
  }

  return null;
};
