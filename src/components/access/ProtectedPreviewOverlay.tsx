import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Shield, Lock, Mail, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

export type ProtectedTriggerReason =
  | 'shortcut_f12'
  | 'shortcut_inspect'
  | 'shortcut_console'
  | 'shortcut_view_source'
  | 'context_menu_protected'
  | 'manual_info';

interface ProtectedTriggerDetail {
  reason: ProtectedTriggerReason;
  areaLabel?: string;
}

const CUSTOM_EVENT_NAME = 'careeros:protected-preview-trigger';

/**
 * Helper to programmatically open the CareerOS Protected Preview overlay
 * if a user clicks a subtle "Protected Preview · © 2026 Dynaisys" badge.
 */
export function openProtectedPreviewNotice(areaLabel?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<ProtectedTriggerDetail>(CUSTOM_EVENT_NAME, {
      detail: { reason: 'manual_info', areaLabel }
    })
  );
}

/**
 * Subtle, non-intrusive copyright & proprietary framework awareness strip.
 * Designed for placement at the footer/header of advanced intelligence pages,
 * exported previews, and selected proprietary framework screens—never on every card.
 */
export const ProtectedFrameworkAttribution: React.FC<{
  areaLabel?: string;
  variant?: 'inline' | 'minimal' | 'dark';
  className?: string;
}> = ({ areaLabel = 'Proprietary Career Intelligence Framework', variant = 'inline', className = '' }) => {
  if (variant === 'minimal') {
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 select-none ${className}`}
      >
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-slate-400 shrink-0" />
          <span>CareerOS Protected Preview · {areaLabel}</span>
        </div>
        <button
          type="button"
          onClick={() => openProtectedPreviewNotice(areaLabel)}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer font-medium"
        >
          © 2026 Dynaisys · cpo@dynaisys.com
        </button>
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div
        className={`px-4 py-2.5 rounded-xl bg-slate-900/95 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 select-none ${className}`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px] tracking-wide uppercase border border-slate-700">
            <Lock className="w-2.5 h-2.5 text-blue-400" />
            Protected Preview
          </span>
          <span className="text-slate-300 font-medium">{areaLabel}</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-slate-400 hidden sm:inline">
            Proprietary product architecture &amp; curated intelligence
          </span>
        </div>
        <button
          type="button"
          onClick={() => openProtectedPreviewNotice(areaLabel)}
          className="text-slate-300 hover:text-white transition-colors cursor-pointer font-semibold flex items-center gap-1.5"
        >
          <span>© 2026 Dynaisys</span>
          <span className="text-slate-600">·</span>
          <span className="text-blue-400">Notice</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`px-4 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 select-none ${className}`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200/90 text-slate-700 font-bold text-[10px] tracking-wide uppercase">
          <Shield className="w-2.5 h-2.5 text-blue-600" />
          CareerOS Protected Preview
        </span>
        <span className="font-semibold text-slate-700">{areaLabel}</span>
        <span className="text-slate-300 hidden md:inline">·</span>
        <span className="text-slate-500 hidden md:inline">
          Original product materials &amp; curated intelligence
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-500 font-medium">© 2026 Dynaisys. All rights reserved.</span>
        <button
          type="button"
          onClick={() => openProtectedPreviewNotice(areaLabel)}
          className="text-blue-600 hover:text-blue-800 font-semibold hover:underline cursor-pointer"
        >
          Product Notice
        </button>
      </div>
    </div>
  );
};

/**
 * Global lightweight anti-copy and intellectual-property deterrence layer for the public CareerOS Beta.
 *
 * Listens non-destructively for:
 * - F12
 * - Ctrl+U / Cmd+Option+U (view source shortcut)
 * - Ctrl+Shift+I / Cmd+Option+I (inspector shortcut)
 * - Ctrl+Shift+J / Cmd+Option+J (console shortcut)
 * - Right-click (contextmenu) ONLY within containers marked with `data-protected-ip`,
 *   while ignoring interactive user text inputs (<input>, <textarea>, [contenteditable]).
 *
 * Never uses destructive loops, debugger traps, or false technical claims.
 */
export const ProtectedPreviewOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerArea, setTriggerArea] = useState<string | undefined>(undefined);
  const returnButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const isEditableElement = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tagName = target.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return true;
      }
      if (target.isContentEditable || target.closest('[contenteditable="true"]')) {
        return true;
      }
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Escape to close the overlay when open
      if (e.key === 'Escape' && isOpen) {
        e.stopPropagation();
        setIsOpen(false);
        return;
      }

      const key = e.key.toLowerCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      // 1. F12
      if (e.key === 'F12') {
        e.preventDefault();
        setTriggerArea('Protected Product Architecture & Intelligence Preview');
        setIsOpen(true);
        return;
      }

      // 2. Ctrl+Shift+I / Cmd+Option+I or Ctrl+Shift+J / Cmd+Option+J
      if (
        (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j')) ||
        (e.metaKey && e.altKey && (key === 'i' || key === 'j' || key === 'u'))
      ) {
        e.preventDefault();
        setTriggerArea('Proprietary Evaluation & Intelligence Surface');
        setIsOpen(true);
        return;
      }

      // 3. Ctrl+U (View Source) — only when not typing in an editable field
      if (ctrlOrMeta && !e.shiftKey && !e.altKey && key === 'u' && !isEditableElement(e.target)) {
        e.preventDefault();
        setTriggerArea('CareerOS Beta Source & Curated Intelligence');
        setIsOpen(true);
        return;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (isEditableElement(e.target)) {
        // Never interfere with right-click paste/spellcheck inside inputs or textareas
        return;
      }

      if (!(e.target instanceof HTMLElement)) return;

      const protectedContainer = e.target.closest('[data-protected-ip]');
      if (protectedContainer) {
        e.preventDefault();
        const label =
          protectedContainer.getAttribute('data-protected-ip') ||
          'Protected CareerOS Intelligence Surface';
        setTriggerArea(label === 'true' ? 'Protected CareerOS Intelligence Surface' : label);
        setIsOpen(true);
      }
    };

    const handleCustomTrigger = (event: Event) => {
      const customEvent = event as CustomEvent<ProtectedTriggerDetail>;
      setTriggerArea(
        customEvent.detail?.areaLabel || 'Protected CareerOS Intelligence Surface'
      );
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener(CUSTOM_EVENT_NAME, handleCustomTrigger);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomTrigger);
    };
  }, [isOpen]);

  // Focus the primary return button for keyboard accessibility when opened
  useEffect(() => {
    if (isOpen && returnButtonRef.current) {
      returnButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="careeros-protected-preview-title"
      aria-describedby="careeros-protected-preview-description"
    >
      {/* Clickable backdrop to return smoothly */}
      <div
        className="fixed inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden text-left animate-in zoom-in-95 duration-150">
        {/* Top Enterprise Header Band */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-400/30 text-blue-300 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-300">
                Enterprise Beta Protection Notice
              </div>
              <h2
                id="careeros-protected-preview-title"
                className="text-base font-extrabold text-white tracking-tight"
              >
                CareerOS Protected Preview
              </h2>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Public Beta
          </span>
        </div>

        {/* Main Content Body */}
        <div className="p-6 space-y-5">
          {triggerArea && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-blue-800">
              <Lock className="w-3 h-3 text-blue-600 shrink-0" />
              <span>Active Surface: {triggerArea}</span>
            </div>
          )}

          <p
            id="careeros-protected-preview-description"
            className="text-sm text-slate-700 leading-relaxed font-medium"
          >
            This beta environment contains proprietary product architecture, interaction patterns, curated intelligence and original product materials.
          </p>

          {/* Product & Developer Attribution Card */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>Developer / Product</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-1">
                  Dynaisys
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>Contact</span>
                </div>
                <a
                  href="mailto:cpo@dynaisys.com"
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline mt-1 block"
                >
                  cpo@dynaisys.com
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70 space-y-1.5 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>© 2026 Dynaisys. All rights reserved.</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Unauthorized reproduction, redistribution or commercial reuse of proprietary materials may be restricted.
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-1 flex items-center justify-end">
            <button
              ref={returnButtonRef}
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
            >
              <span>Return to CareerOS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
