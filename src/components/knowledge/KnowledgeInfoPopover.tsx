import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info, X } from 'lucide-react';

export interface KnowledgeInfoPopoverProps {
  label?: string;
  explanation: string;
  example?: string;
  whyThisMatters?: string;
  variant?: 'subtle' | 'standard' | 'pill';
  align?: 'left' | 'right' | 'center';
  customTrigger?: React.ReactNode;
  className?: string;
}

export const KnowledgeInfoPopover: React.FC<KnowledgeInfoPopoverProps> = ({
  label,
  explanation,
  example,
  whyThisMatters,
  variant = 'subtle',
  align = 'left',
  customTrigger,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on escape or outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getAlignmentClass = () => {
    if (align === 'right') return 'right-0';
    if (align === 'center') return 'left-1/2 -translate-x-1/2';
    return 'left-0 sm:left-auto';
  };

  return (
    <div className={`relative inline-flex items-center align-middle ${className}`}>
      {customTrigger ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          aria-expanded={isOpen}
          aria-label={label ? `Help for ${label}` : 'Information'}
          className="inline-flex items-center cursor-pointer focus:outline-hidden"
        >
          {customTrigger}
        </button>
      ) : variant === 'pill' ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          aria-expanded={isOpen}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <span>{label || 'How this works'}</span>
          <Info className="w-3 h-3 text-slate-500" />
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          aria-expanded={isOpen}
          aria-label={label ? `Help for ${label}` : 'Help information'}
          className={`inline-flex items-center justify-center rounded-full transition-colors cursor-pointer ${
            variant === 'standard'
              ? 'w-5 h-5 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              : 'w-4 h-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Popover Card */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="tooltip"
          className={`absolute top-full mt-1.5 z-50 w-72 sm:w-80 p-3.5 bg-white text-slate-800 rounded-2xl border border-slate-200/90 shadow-xl text-left animate-in fade-in zoom-in-95 duration-150 ${getAlignmentClass()}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                {label || 'Interview Guidance'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close popover"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-2 space-y-2 text-xs leading-relaxed text-slate-600">
            <p className="text-slate-700 font-medium">{explanation}</p>

            {example && (
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[9px]">
                  Example
                </span>
                <p className="italic text-slate-700">{example}</p>
              </div>
            )}

            {whyThisMatters && (
              <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100/80 text-[11px] text-blue-900 space-y-0.5">
                <span className="font-bold text-blue-800 block uppercase tracking-wider text-[9px]">
                  Why this matters
                </span>
                <p className="text-blue-950 font-normal">{whyThisMatters}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
