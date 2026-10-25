import React from 'react';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { useAccessControl, AdvancedCategoryShell } from '../../services/accessControlService';

interface ProgressiveCreationSectionProps {
  workflowKey: string;
  sectionTitle?: string;
  customCategories?: AdvancedCategoryShell[];
  children: React.ReactNode;
  className?: string;
}

/**
 * Access-Aware Progressive Disclosure Section for CareerOS Creation Workflows.
 *
 * Critical Security & Architecture Guarantee:
 * - For GUEST / PUBLIC users (`!canAccessAdvancedFields`), `children` is NEVER mounted or rendered in the DOM.
 *   Only structural category shell labels are displayed in a visually locked preview state.
 * - For DEMO users, advanced fields are unlocked and interactive within the isolated Demo Workspace.
 * - For FULL users, all advanced fields and intelligence capabilities are available without restriction.
 */
export const ProgressiveCreationSection: React.FC<ProgressiveCreationSectionProps> = ({
  workflowKey,
  sectionTitle,
  customCategories,
  children,
  className = ''
}) => {
  const { getCreationDisclosure, openContextualPrompt } = useAccessControl();
  const disclosure = getCreationDisclosure(workflowKey);
  const categories = customCategories || disclosure.schema.advancedCategories;
  const resolvedTitle = sectionTitle || `Advanced ${disclosure.schema.workflowTitle} Intelligence`;

  // GUEST / PUBLIC: Do NOT mount or render `children` in the DOM.
  if (!disclosure.canAccessAdvancedFields) {
    return (
      <div
        className={`rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5 space-y-4 relative overflow-hidden ${className}`}
        data-testid={`progressive-disclosure-locked-${disclosure.schema.workflowId}`}
      >
        {/* Top Header & Unlock Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Advanced Section</span>
              </span>
              <span className="text-xs font-bold text-slate-800">{resolvedTitle}</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {disclosure.bannerMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openContextualPrompt()}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Unlock in Demo</span>
          </button>
        </div>

        {/* Visually Locked Structural Category Shells (Zero hidden values or proprietary logic in DOM) */}
        <div className="relative">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 select-none pointer-events-none"
            aria-hidden="true"
          >
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{cat.title}</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    Protected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {cat.summary}
                </p>
                {/* Neutral structural placeholder bars (blurred visual cue without real values) */}
                <div className="space-y-1.5 pt-1 blur-[2px] opacity-60">
                  <div className="h-6 w-full rounded-lg bg-slate-100 border border-slate-200/70" />
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1/3 rounded bg-slate-100" />
                    <div className="h-4 w-1/4 rounded bg-blue-50" />
                    <div className="h-4 w-1/5 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtle frosted CTA bar at bottom of locked section */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white/90 rounded-xl p-3 border">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Unlock <strong>{categories.map(c => c.title).join(', ')}</strong> in the isolated Demo Workspace.
              </span>
            </div>
            <button
              type="button"
              onClick={() => openContextualPrompt()}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Unlock in Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DEMO / FULL: Render unlocked Advanced Intelligence header and mount interactive children
  return (
    <div
      className={`space-y-5 pt-3 border-t border-slate-200/80 ${className}`}
      data-testid={`progressive-disclosure-unlocked-${disclosure.schema.workflowId}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50/90 border border-slate-200/80 rounded-xl px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>{disclosure.mode === 'demo_unlocked' ? 'Unlocked in Demo' : 'Full Intelligence Active'}</span>
          </span>
          <span className="text-xs font-bold text-slate-800">{resolvedTitle}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.slice(0, 4).map((cat, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200/80"
            >
              {cat.title}
            </span>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
};
