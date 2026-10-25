import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  MoreVertical,
  Edit3,
  Copy,
  Archive,
  Filter,
  Target
} from 'lucide-react';
import { RoleBlueprintService } from '../../services/roleBlueprintService';
import { RoleBlueprint, RoleCategory } from '../../types';
import { useAccessControl } from '../../services/accessControlService';

interface RolesExplorerProps {
  onSelectRole: (role: RoleBlueprint) => void;
  onPracticeRole: (role: RoleBlueprint) => void;
  onEditRole?: (role: RoleBlueprint) => void;
  onDuplicateRole?: (role: RoleBlueprint) => void;
  onStartMission?: (role: RoleBlueprint) => void;
}

export const RolesExplorer: React.FC<RolesExplorerProps> = ({
  onSelectRole,
  onPracticeRole,
  onEditRole,
  onDuplicateRole,
  onStartMission,
}) => {
  const { accessLevel, capabilities } = useAccessControl();
  const [roles, setRoles] = useState<RoleBlueprint[]>(() => RoleBlueprintService.getAllBlueprints(true));
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [openMenuRoleId, setOpenMenuRoleId] = useState<string | null>(null);

  // Sync with storage updates & access tier changes
  useEffect(() => {
    const handleSync = () => {
      setRoles(RoleBlueprintService.getAllBlueprints(true));
    };
    window.addEventListener('career_roles_updated', handleSync);
    window.addEventListener('career_access_changed', handleSync);
    return () => {
      window.removeEventListener('career_roles_updated', handleSync);
      window.removeEventListener('career_access_changed', handleSync);
    };
  }, []);

  // Close overflow menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuRoleId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const categories = ['All', ...Array.from(new Set(roles.map(r => r.category)))];

  const hasDrafts = roles.some(r => r.status === 'draft');

  const filteredRoles = roles.filter(role => {
    if (selectedCategory !== 'All' && role.category !== selectedCategory) {
      return false;
    }
    if (statusFilter === 'published' && role.status === 'draft') {
      return false;
    }
    if (statusFilter === 'draft' && role.status !== 'draft') {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Role Blueprints &amp; Career Ladders
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Showing {filteredRoles.length} curated {filteredRoles.length === 1 ? 'Blueprint' : 'Blueprints'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Curated Beta Preview
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Understand market expectations, compensation tiers, and core competency pillars across modern disciplines.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter if drafts exist */}
          {hasDrafts && (
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/70 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('published')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'published' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('draft')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'draft' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Drafts
              </button>
            </div>
          )}

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results & Beta Indicator */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 gap-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-bold text-slate-900">{filteredRoles.length}</strong> {filteredRoles.length === 1 ? 'role blueprint' : 'role blueprints'}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            accessLevel === 'FULL'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : accessLevel === 'DEMO'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : accessLevel === 'GUEST'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            {capabilities.tierBadgeLabel}
          </span>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map(role => (
          <div
            key={role.id}
            className={`group bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
              role.status === 'draft'
                ? 'border-dashed border-amber-300 bg-amber-50/15'
                : 'border-slate-200/90 hover:border-blue-400 hover:shadow-lg'
            }`}
          >
            <div>
              {/* Card Meta Header with quiet typography */}
              <div className="flex items-center justify-between gap-2 mb-2.5 text-2xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-700 font-bold uppercase tracking-wider">
                    {role.category}
                  </span>
                  {role.status === 'draft' && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold uppercase tracking-wider text-[9px] border border-amber-200">
                      Draft
                    </span>
                  )}
                  {role.isCustom && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold uppercase tracking-wider text-[9px]">
                      Custom
                    </span>
                  )}
                </div>

                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{role.marketDemand} Demand</span>
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {role.title}
              </h3>
              <p className="text-xs text-slate-600 font-normal mt-1 leading-relaxed line-clamp-2">
                {role.tagline}
              </p>

              {/* Salary benchmarks */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Senior Benchmark
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {role.salaryBenchmark.senior}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Lead/Staff: {role.salaryBenchmark.lead}
                </div>
              </div>

              {/* Core Competencies preview */}
              <div className="mt-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Competencies Evaluated ({role.competencies.length})
                </div>
                <ul className="space-y-1.5">
                  {role.competencies.slice(0, 3).map((comp, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{comp.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Primary Tech Stack with quiet styling */}
              <div className="mt-4 flex flex-wrap items-center gap-1 text-xs text-slate-500 font-medium">
                {role.primaryTechStack.slice(0, 4).map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-slate-700 text-[11px]">{tech}</span>
                    {idx < Math.min(role.primaryTechStack.length - 1, 3) && <span className="text-slate-300">·</span>}
                  </React.Fragment>
                ))}
                {role.primaryTechStack.length > 4 && (
                  <span className="text-slate-400 text-[10px] ml-1">
                    +{role.primaryTechStack.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                id={`view-blueprint-${role.id}`}
                onClick={() => onSelectRole(role)}
                className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Read Blueprint</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5">
                {onStartMission && (
                  <button
                    id={`start-mission-${role.id}`}
                    onClick={() => onStartMission(role)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-3xs"
                    title={`Start Career Mission for ${role.title}`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Start Mission</span>
                  </button>
                )}

                <button
                  id={`practice-role-${role.id}`}
                  onClick={() => onPracticeRole(role)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Practice Interview</span>
                </button>

                {/* Compact overflow menu (...) for secondary actions */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuRoleId(openMenuRoleId === role.id ? null : role.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Blueprint options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openMenuRoleId === role.id && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in-50"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuRoleId(null);
                          if (onEditRole) onEditRole(role);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit Blueprint</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuRoleId(null);
                          if (onDuplicateRole) onDuplicateRole(role);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Copy className="w-3.5 h-3.5 text-purple-600" />
                        <span>Duplicate</span>
                      </button>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuRoleId(null);
                          if (confirm(`Archive blueprint "${role.title}"?`)) {
                            RoleBlueprintService.archiveBlueprint(role.id);
                          }
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Archive className="w-3.5 h-3.5 text-rose-500" />
                        <span>Archive</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
