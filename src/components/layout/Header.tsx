import React, { useState, useRef, useEffect } from 'react';
import { 
  UserCheck, 
  Compass, 
  BookOpen, 
  Globe, 
  CheckSquare, 
  Search, 
  Layers, 
  HelpCircle, 
  Sliders, 
  Pin, 
  ArrowUpRight,
  MoreHorizontal,
  X,
  Hammer,
  Target,
  ShieldCheck
} from 'lucide-react';
import { PracticeActionType } from '../practice/PracticeActionGroup';
import { BetaAccessBadge } from '../access/BetaAccessBadge';

export type ActiveTab = 'discover' | 'profile' | 'knowledge' | 'practice' | 'tracker' | 'prepare' | 'library' | 'business_english' | 'builder_match' | 'role_intelligence' | 'evidence_intelligence';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  savedJobsCount: number;
  onOpenCommand: () => void;
  onOpenHelp: () => void;
  onOpenPlatformAdmin: () => void;
  onSelectPracticeAction: (actionType: PracticeActionType) => void;
  activePracticeAction?: PracticeActionType | null;
  isPlatformAdminOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  savedJobsCount,
  onOpenCommand,
  onOpenHelp,
  onOpenPlatformAdmin,
  onSelectPracticeAction,
  activePracticeAction,
  isPlatformAdminOpen = false,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close more menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Level 1 User Career OS Navigation Items (Strictly Prioritized)
  const primaryNavItems: { 
    id: ActiveTab; 
    label: string; 
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'profile', label: 'My Profile', icon: UserCheck },
    { id: 'discover', label: 'Job Opportunity', icon: Compass },
    { id: 'tracker', label: 'Participation Tracker', icon: CheckSquare },
    { id: 'builder_match', label: 'Builder Match', icon: Hammer },
    { id: 'knowledge', label: 'Knowledge System', icon: BookOpen },
    { id: 'business_english', label: 'Business English', icon: Globe },
  ];

  // Visual active tab check
  const getIsActive = (id: ActiveTab) => {
    if (isPlatformAdminOpen) return false;
    if (id === 'profile' && (activeTab === 'profile' || activeTab === 'prepare')) return true;
    if (id === 'knowledge' && (
      activeTab === 'knowledge' || 
      activeTab === 'library' || 
      activeTab === 'role_intelligence' || 
      activeTab === 'evidence_intelligence'
    )) return true;
    return activeTab === id;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs w-full max-w-full">
      <div className="w-full max-w-[2560px] mx-auto px-2.5 sm:px-4 xl:px-5 2xl:px-6 py-1.5 xl:py-2 flex items-center justify-between gap-2 lg:gap-2.5 xl:gap-3 2xl:gap-5">
        
        {/* ==================================================
            LEFT: Brand & OS Identification
            ================================================== */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            id="brand-home-link"
            onClick={() => onTabChange('profile')}
            className="flex items-center gap-2 text-left focus:outline-hidden group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-sm xl:text-[15px] 2xl:text-base tracking-tight text-slate-900 whitespace-nowrap">
                  ProMultiplier <span className="text-blue-600">OS</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 hidden min-[1680px]:inline-block whitespace-nowrap">
                  Career OS
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* ==================================================
            CENTER: Primary Navigation (Priority 1)
            - 6 Primary Items: My Profile, Job Opportunity, Participation Tracker,
              Builder Match, Knowledge System, Business English
            - Narrower item widths with natural, balanced 2-line wrapping
            - Zero ellipsis truncation, accessible tap targets across 14", 16", 23"
            ================================================== */}
        <nav 
          className="hidden lg:flex items-stretch gap-0.5 xl:gap-1 2xl:gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-medium min-w-0 shrink" 
          aria-label="Global Career OS Navigation"
        >
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = getIsActive(item.id);
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                type="button"
                onClick={() => {
                  if (isPlatformAdminOpen) onOpenPlatformAdmin();
                  onTabChange(item.id);
                }}
                className={`group relative px-2 xl:px-2.5 2xl:px-3 py-1.5 min-h-[38px] rounded-lg transition-all flex items-center gap-1.5 xl:gap-2 cursor-pointer text-left select-none ${
                  isActive
                    ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                />
                
                {/* Balanced 2-line wrapping label: never truncated, wraps naturally by width */}
                <span className="block text-[11.5px] xl:text-xs leading-[1.15] tracking-tight whitespace-normal break-normal [text-wrap:balance] max-w-[68px] xl:max-w-[76px] 2xl:max-w-[84px]">
                  {item.label}
                </span>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 ml-0.5" />
                )}
                {item.id === 'tracker' && savedJobsCount > 0 && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 shrink-0">
                    {savedJobsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ==================================================
            RIGHT: Secondary / Utility Controls (Priority 2)
            Visually separated from Primary Navigation.
            Progressively compacts secondary controls on 14" & 16" screens.
            ================================================== */}
        <div className="flex items-center gap-1.5 xl:gap-2 2xl:gap-2.5 shrink-0">
          
          {/* --------------------------------------------------
              SUB-GROUP A: Core Secondary Utilities (Search + Live Interview)
              -------------------------------------------------- */}
          <div className="flex items-center gap-1.5 xl:gap-2 shrink-0" data-header-group="secondary-utility">
            {/* Omni Search Trigger */}
            <button
              id="cmd-palette-btn"
              onClick={onOpenCommand}
              type="button"
              title="Search CareerOS (⌘K)"
              className="relative bg-slate-50 hover:bg-white text-xs px-2 xl:px-2.5 min-[1720px]:pl-7 min-[1720px]:pr-2.5 py-1.5 min-h-[36px] rounded-lg border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 flex items-center gap-1.5 transition-colors shadow-3xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 min-[1720px]:absolute min-[1720px]:left-2.5" />
              <span className="hidden min-[1720px]:inline whitespace-nowrap">Search...</span>
              <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200/70 text-slate-600 border border-slate-300/60">
                ⌘K
              </kbd>
            </button>

            {/* Live Interview CTA */}
            <button
              type="button"
              onClick={() => onSelectPracticeAction('live')}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition active:scale-95 cursor-pointer shadow-xs whitespace-nowrap ${
                activeTab === 'practice' && activePracticeAction === 'live'
                  ? 'bg-blue-700 text-white ring-2 ring-blue-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              title="Launch Live Interview Workspace"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="hidden sm:inline">Live Interview</span>
              <span className="sm:hidden">Live</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </button>
          </div>

          {/* --------------------------------------------------
              SUB-GROUP B: System & Account Controls
              -------------------------------------------------- */}
          <div className="flex items-center gap-1 xl:gap-1.5 pl-1 xl:pl-1.5 border-l border-slate-200/80 shrink-0" data-header-group="system-account-controls">
            {/* Direct Help & Admin Buttons on Wide Desktop */}
            <div className="hidden 2xl:flex items-center gap-1">
              <button
                id="btn-platform-help-tour"
                type="button"
                onClick={onOpenHelp}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Platform Help & Guides"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                id="btn-platform-admin-toggle"
                type="button"
                onClick={onOpenPlatformAdmin}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isPlatformAdminOpen
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                title="Platform Administration"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Compact "More" Menu for Help & Admin when screen < 2xl */}
            <div className="relative 2xl:hidden" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(prev => !prev)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="More Actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 text-xs font-medium text-slate-700 animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onTabChange('role_intelligence');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-800 font-semibold"
                  >
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>Role Intelligence</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onTabChange('evidence_intelligence');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-800 font-semibold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Evidence Intelligence</span>
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenHelp();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Platform Help</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenPlatformAdmin();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    <span>Platform Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* CareerOS Beta Access Tier Indicator & Switcher */}
            <BetaAccessBadge />

            {/* User Profile Avatar */}
            <button
              type="button"
              onClick={() => onTabChange('profile')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-slate-200/80 overflow-hidden bg-gradient-to-tr from-amber-200 to-rose-200 flex items-center justify-center cursor-pointer shadow-xs font-bold text-xs text-slate-800 hover:ring-blue-500 transition-all shrink-0"
              title="View My Profile & Career Dashboard"
            >
              PH
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Nav Strip for Tablets & Phones (<lg) */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-1.5 border-t border-slate-100 overflow-x-auto no-scrollbar">
        {primaryNavItems.map(item => {
          const Icon = item.icon;
          const isActive = getIsActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => {
                if (isPlatformAdminOpen) onOpenPlatformAdmin();
                onTabChange(item.id);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
