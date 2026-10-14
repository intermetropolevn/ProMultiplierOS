import React, { useState } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { ROLES_DATA } from '../../data/rolesData';
import { RoleBlueprint, RoleCategory } from '../../types';
import { Badge } from '../common/Badge';

interface RolesExplorerProps {
  onSelectRole: (role: RoleBlueprint) => void;
  onPracticeRole: (role: RoleBlueprint) => void;
}

export const RolesExplorer: React.FC<RolesExplorerProps> = ({
  onSelectRole,
  onPracticeRole,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(ROLES_DATA.map(r => r.category)))];

  const filteredRoles = ROLES_DATA.filter(role => {
    if (selectedCategory !== 'All' && role.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Role Blueprints & Career Ladders
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Understand market expectations, compensation tiers, and core competency pillars across modern disciplines.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/70 self-start">
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

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map(role => (
          <div
            key={role.id}
            className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Meta Header with quiet typography */}
              <div className="flex items-center justify-between gap-2 mb-2.5 text-2xs font-semibold">
                <span className="text-blue-700 font-bold uppercase tracking-wider">
                  {role.category}
                </span>
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
                  Key Competencies Evaluated
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
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                id={`view-blueprint-${role.id}`}
                onClick={() => onSelectRole(role)}
                className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Read Blueprint</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                id={`practice-role-${role.id}`}
                onClick={() => onPracticeRole(role)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Practice Interview</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
