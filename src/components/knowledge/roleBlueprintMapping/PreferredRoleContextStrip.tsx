import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ChevronDown, 
  X, 
  Plus, 
  Check, 
  Briefcase, 
  Search,
  ExternalLink,
  Target
} from 'lucide-react';
import { usePreferredRoleMappingContext } from '../../../features/knowledge/context/PreferredRoleMappingContext';
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
    availableRoleBlueprints,
    setPreferredRoleId,
    targetDomains,
    addTargetDomain,
    removeTargetDomain,
    isRolePickerOpen,
    setIsRolePickerOpen
  } = usePreferredRoleMappingContext();

  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [domainSearchQuery, setDomainSearchQuery] = useState('');

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

  // Filter available role blueprints by search query
  const filteredRoles = useMemo(() => {
    const q = roleSearchQuery.toLowerCase().trim();
    if (!q) return availableRoleBlueprints;
    return availableRoleBlueprints.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      (r.level && r.level.toLowerCase().includes(q))
    );
  }, [availableRoleBlueprints, roleSearchQuery]);

  // Filter available domains that are not yet active
  const availableDomainsToAdd = useMemo(() => {
    const unadded = CANONICAL_DOMAINS.filter(d => !targetDomains.includes(d));
    const q = domainSearchQuery.toLowerCase().trim();
    if (!q) return unadded;
    return unadded.filter(d => d.toLowerCase().includes(q));
  }, [targetDomains, domainSearchQuery]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 transition-all relative z-20">
      
      {/* 1. SECTION EYEBROW & SPEC INSPECTION */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100/90">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Active Context
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-2xs text-slate-500 font-normal">
            Calibrated for role blueprints and sector domain intelligence
          </span>
        </div>

        {onInspectRoleSpec && (
          <button
            type="button"
            onClick={() => onInspectRoleSpec(preferredRole)}
            className="text-2xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
            title="Inspect Canonical Blueprint Specification"
          >
            <ExternalLink className="w-3 h-3 text-slate-400" />
            <span>Role Spec</span>
          </button>
        )}
      </div>

      {/* 2. RESTRAINED 2-COLUMN / RESPONSIVE STACKED CONTROL LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* PRIMARY VALUE: PREFERRED ROLE (Col 1-5) */}
        <div className="lg:col-span-5 flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 text-2xs font-medium text-slate-500">
            <span>Preferred Role</span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                {preferredRole.title}
              </span>

              {/* [Change Role] Button */}
              <button
                id="btn-change-preferred-role"
                type="button"
                onClick={() => {
                  setIsRolePickerOpen(!isRolePickerOpen);
                  setRoleSearchQuery('');
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-3xs"
              >
                <span>Change Role</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isRolePickerOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="text-2xs text-slate-400 font-normal mt-0.5">
              <span>{preferredRole.category}</span>
              {preferredRole.level && <span> · {preferredRole.level}</span>}
            </div>

            {/* Change Role Compact Popover */}
            {isRolePickerOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Select Role Blueprint</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRolePickerOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Search roles */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={roleSearchQuery}
                    onChange={(e) => setRoleSearchQuery(e.target.value)}
                    placeholder="Search roles..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    autoFocus
                  />
                </div>

                {/* Role Blueprint List */}
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {filteredRoles.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No matching role blueprints found
                    </div>
                  ) : (
                    filteredRoles.map(role => {
                      const isSelected = role.id === preferredRoleId;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            setPreferredRoleId(role.id, true);
                            setIsRolePickerOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold ring-1 ring-blue-500/20'
                              : 'border-slate-200/70 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              ) : (
                                <div className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span className={isSelected ? 'text-blue-900 font-bold' : 'text-slate-900'}>
                                {role.title}
                              </span>
                            </div>
                            <div className="text-2xs text-slate-400 flex items-center gap-1.5 mt-0.5 pl-5">
                              <span>{role.category}</span>
                              {role.level && (
                                <>
                                  <span>·</span>
                                  <span>{role.level}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full shrink-0">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SUBTLE DIVIDER ON DESKTOP */}
        <div className="hidden lg:block lg:col-span-1 flex justify-center">
          <div className="w-px h-10 bg-slate-200/80" />
        </div>

        {/* SECONDARY CONTEXT: TARGET DOMAINS (Col 7-12) */}
        <div className="lg:col-span-6 flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-medium text-slate-500">
              Target Domains {targetDomains.length > 0 && `(${targetDomains.length})`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Active Domain Chips with × button */}
            {targetDomains.map(domain => (
              <span
                key={domain}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-3xs transition-colors"
              >
                <span className="truncate max-w-[200px]">{domain}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTargetDomain(domain);
                  }}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full p-0.5 transition-colors cursor-pointer"
                  title={`Remove ${domain} from active context`}
                  aria-label={`Remove ${domain}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* [+ Add domain] Popover Trigger */}
            <div className="relative" ref={domainDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsAddDomainOpen(!isAddDomainOpen);
                  setDomainSearchQuery('');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-700 text-xs font-semibold rounded-lg border border-dashed border-blue-300 hover:border-blue-400 transition-colors cursor-pointer shadow-3xs"
              >
                <Plus className="w-3 h-3 text-blue-600" />
                <span>+ Add domain</span>
              </button>

              {/* Add Domain Popover with search and instant activation */}
              {isAddDomainOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900">Add Target Domain</span>
                    <button
                      type="button"
                      onClick={() => setIsAddDomainOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Search Input for domains */}
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={domainSearchQuery}
                      onChange={(e) => setDomainSearchQuery(e.target.value)}
                      placeholder="Search domains..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      autoFocus
                    />
                  </div>

                  {/* Domain List (Click immediately activates) */}
                  <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                    {availableDomainsToAdd.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        {CANONICAL_DOMAINS.every(d => targetDomains.includes(d)) 
                          ? 'All canonical domains active' 
                          : 'No matching domains found'}
                      </div>
                    ) : (
                      availableDomainsToAdd.map(dom => (
                        <button
                          key={dom}
                          type="button"
                          onClick={() => {
                            addTargetDomain(dom);
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <span className="truncate">{dom}</span>
                          <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
