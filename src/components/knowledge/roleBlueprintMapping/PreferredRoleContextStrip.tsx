import React, { useState, useRef, useEffect } from 'react';
import { 
  Target, 
  ChevronDown, 
  X, 
  Plus, 
  Check, 
  Sparkles, 
  Briefcase,
  Compass,
  ExternalLink,
  Layers
} from 'lucide-react';
import { usePreferredRoleMappingContext } from '../../../features/knowledge/context/PreferredRoleMappingContext';
import { ROLES_DATA } from '../../../data/rolesData';
import { CANONICAL_DOMAINS } from '../../../data/jobTaxonomies';
import { RoleBlueprint } from '../../../types';

interface PreferredRoleContextStripProps {
  onInspectRoleSpec?: (role: RoleBlueprint) => void;
}

export const PreferredRoleContextStrip: React.FC<PreferredRoleContextStripProps> = ({
  onInspectRoleSpec
}) => {
  const {
    preferredRoleId,
    preferredRole,
    setPreferredRoleId,
    targetDomains,
    activeDomain,
    setActiveDomain,
    addTargetDomain,
    removeTargetDomain,
    isRolePickerOpen,
    setIsRolePickerOpen
  } = usePreferredRoleMappingContext();

  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [syncWithProfile, setSyncWithProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const domainDropdownRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRolePickerOpen(false);
      }
      if (domainDropdownRef.current && !domainDropdownRef.current.contains(event.target as Node)) {
        setIsAddDomainOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsRolePickerOpen]);

  const availableDomainsToAdd = CANONICAL_DOMAINS.filter(d => !targetDomains.includes(d));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs px-4 py-3 transition-all relative z-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Active Context > Preferred Role + Change Role button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              Active Context
            </span>
            <span className="text-slate-400">›</span>
            <span className="text-slate-700 font-bold">Preferred Role:</span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-2xs">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>{preferredRole.title}</span>
              </span>

              <button
                id="btn-change-preferred-role"
                onClick={() => setIsRolePickerOpen(!isRolePickerOpen)}
                className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200/80 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Change Role</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isRolePickerOpen ? 'rotate-180' : ''}`} />
              </button>

              {onInspectRoleSpec && (
                <button
                  onClick={() => onInspectRoleSpec(preferredRole)}
                  className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-2xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Inspect Canonical Blueprint Specification"
                >
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  <span>Spec</span>
                </button>
              )}
            </div>

            {/* Change Role Dropdown Popover */}
            {isRolePickerOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Select Canonical Role Blueprint</span>
                  </div>
                  <button
                    onClick={() => setIsRolePickerOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-2xs text-slate-500 mb-3">
                  Selecting a role updates contextual recommendations across Org Models, SOPs, Artifacts, and Cases.
                </p>

                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {ROLES_DATA.map(role => {
                    const isSelected = role.id === preferredRoleId;
                    return (
                      <button
                        key={role.id}
                        onClick={() => {
                          setPreferredRoleId(role.id, syncWithProfile);
                          setIsRolePickerOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold ring-1 ring-blue-500/20'
                            : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-medium'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs truncate">{role.title}</div>
                          <div className="text-2xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{role.category}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-semibold">{role.salaryBenchmark.senior}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-2xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={syncWithProfile}
                      onChange={(e) => setSyncWithProfile(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Update My Profile Target Role as well</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Target Domains List with removal and add */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Target Domains:
          </span>

          <div className="flex flex-wrap items-center gap-1.5">
            {targetDomains.map(domain => {
              const isActive = domain === activeDomain;
              return (
                <div
                  key={domain}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'
                  }`}
                >
                  <button
                    onClick={() => setActiveDomain(domain)}
                    className="cursor-pointer hover:underline"
                    title="Focus this domain context"
                  >
                    {domain}
                  </button>

                  {targetDomains.length > 1 && (
                    <button
                      onClick={() => removeTargetDomain(domain)}
                      className="text-slate-400 hover:text-red-600 rounded-full p-0.5 transition-colors cursor-pointer"
                      title={`Remove ${domain} from context`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Add Domain Trigger */}
            <div className="relative" ref={domainDropdownRef}>
              <button
                onClick={() => setIsAddDomainOpen(!isAddDomainOpen)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-xl border border-dashed border-slate-300 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3 h-3 text-slate-500" />
                <span>Add domain</span>
              </button>

              {isAddDomainOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1 text-2xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Canonical Domains
                  </div>
                  {availableDomainsToAdd.length === 0 ? (
                    <div className="p-2 text-xs text-slate-400">All domains added</div>
                  ) : (
                    availableDomainsToAdd.map(dom => (
                      <button
                        key={dom}
                        onClick={() => {
                          addTargetDomain(dom);
                          setIsAddDomainOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer truncate"
                      >
                        + {dom}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
