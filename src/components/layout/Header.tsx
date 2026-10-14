import React from 'react';
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
  Sparkles
} from 'lucide-react';
import { PracticeActionType } from '../practice/PracticeActionGroup';

export type ActiveTab = 'discover' | 'profile' | 'knowledge' | 'practice' | 'tracker' | 'prepare' | 'library' | 'business_english';

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
  onTogglePins?: () => void;
  pinsCount?: number;
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
  onTogglePins,
  pinsCount = 4,
}) => {
  // Level 1 User Career OS Navigation Items
  const primaryNavItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'profile', label: 'My Profile', icon: UserCheck },
    { id: 'discover', label: 'Job Opportunity', icon: Compass },
    { id: 'knowledge', label: 'Knowledge System', icon: BookOpen },
    { id: 'business_english', label: 'Business English', icon: Globe },
    { id: 'tracker', label: 'Application Tracker', icon: CheckSquare },
  ];

  // Check which tab is visually active (map 'prepare' -> 'profile', 'library' -> 'knowledge')
  const getIsActive = (id: ActiveTab) => {
    if (isPlatformAdminOpen) return false;
    if (id === 'profile' && (activeTab === 'profile' || activeTab === 'prepare')) return true;
    if (id === 'knowledge' && (activeTab === 'knowledge' || activeTab === 'library')) return true;
    return activeTab === id;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        
        {/* LEFT: Brand & OS Identification */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            id="brand-home-link"
            onClick={() => onTabChange('profile')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900">
                  ProMultiplier <span className="text-blue-600">OS</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Career OS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none hidden xl:block mt-0.5">
                Career Execution &amp; Domain Intelligence System
              </p>
            </div>
          </button>
        </div>

        {/* CENTER: Primary Modules Nav (Level 1) */}
        <nav className="hidden lg:flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 text-xs font-medium" aria-label="Global Career OS Navigation">
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = getIsActive(item.id);
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  if (isPlatformAdminOpen) onOpenPlatformAdmin();
                  onTabChange(item.id);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                )}
                {item.id === 'tracker' && savedJobsCount > 0 && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                    {savedJobsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Global Search, Live Interview CTA, Your Pins Drawer Trigger, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Omni Search Trigger */}
          <div className="relative hidden md:block w-40 xl:w-56">
            <button
              id="cmd-palette-btn"
              onClick={onOpenCommand}
              type="button"
              className="w-full bg-slate-50 hover:bg-white text-xs pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 flex items-center justify-between transition-colors shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                <span className="truncate">Global search...</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 border border-slate-300/60">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Live Interview CTA (Solid Blue with Pulsing Indicator) */}
          <button
            type="button"
            onClick={() => onSelectPracticeAction('live')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition active:scale-95 cursor-pointer shadow-xs ${
              activeTab === 'practice' && activePracticeAction === 'live'
                ? 'bg-blue-700 text-white ring-2 ring-blue-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title="Launch Live Interview Workspace"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>Live Interview</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Your Pins Header Button */}
          <button
            id="header-toggle-pins-btn"
            type="button"
            onClick={onTogglePins}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer shadow-2xs"
            title="Toggle Your Pins & Quick Context"
          >
            <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span className="hidden sm:inline font-medium">Your Pins</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {pinsCount}
            </span>
          </button>

          {/* Help & Architecture Tour */}
          <button
            id="btn-platform-help-tour"
            type="button"
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Platform Help & Guides"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Platform Admin Toggle */}
          <button
            id="btn-platform-admin-toggle"
            type="button"
            onClick={onOpenPlatformAdmin}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isPlatformAdminOpen
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
            title="Open Platform Administration"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className="w-8 h-8 rounded-full ring-2 ring-slate-200/80 overflow-hidden bg-gradient-to-tr from-amber-200 to-rose-200 flex items-center justify-center cursor-pointer shadow-xs font-bold text-xs text-slate-800 hover:ring-blue-500 transition-all"
            title="View My Profile & Career Dashboard"
          >
            PH
          </button>

        </div>

      </div>

      {/* Mobile Nav Drawer Strip for Smaller Screens (<lg) */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-1.5 border-t border-slate-100 overflow-x-auto no-scrollbar">
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
