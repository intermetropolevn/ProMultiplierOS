import React, { useState, useEffect, useMemo } from 'react';
import { Search, Briefcase, BookOpen, Sparkles, ArrowRight, X } from 'lucide-react';
import { ROLES_DATA } from '../../data/rolesData';
import { DOMAINS_DATA } from '../../data/domainsData';
import { WORKFLOWS_DATA } from '../../data/workflowsData';
import { CASES_DATA } from '../../data/casesData';
import { JOBS_DATA } from '../../data/jobsData';
import { industryStore } from '../../features/industry/services/industryStore';
import { ActiveTab } from '../layout/Header';

interface QuickCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab, subTarget?: { type: string; id: string }) => void;
  onStartPracticeWithRole?: (roleTitle: string) => void;
}

export const QuickCommandModal: React.FC<QuickCommandModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onStartPracticeWithRole,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default suggested items
      return [
        { type: 'Role Guide', title: 'Senior Backend Engineer', category: 'prepare', subType: 'role', id: 'role-backend-eng' },
        { type: 'Domain Deep-Dive', title: 'Fintech & Payments', category: 'prepare', subType: 'domain', id: 'domain-fintech' },
        { type: 'Workflow', title: 'Zero-Downtime Database Schema Migration', category: 'prepare', subType: 'workflow', id: 'wf-zero-downtime-migration' },
        { type: 'Case Study', title: 'The Ghost Payment Bug (Idempotency)', category: 'prepare', subType: 'case', id: 'case-payment-double-spend' },
        { type: 'Job Opportunity', title: 'Senior Backend Engineer at Stripe', category: 'discover', subType: 'job', id: 'job-stripe-backend' },
      ];
    }

    const items: Array<{
      type: string;
      title: string;
      category: ActiveTab;
      subType: string;
      id: string;
      description?: string;
    }> = [];

    // Search Roles
    ROLES_DATA.forEach(r => {
      if (r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.overview.toLowerCase().includes(q)) {
        items.push({
          type: 'Role Blueprint',
          title: r.title,
          category: 'prepare',
          subType: 'role',
          id: r.id,
          description: r.tagline,
        });
      }
    });

    // Search Domains
    DOMAINS_DATA.forEach(d => {
      if (d.name.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q)) {
        items.push({
          type: 'Domain Guide',
          title: d.name,
          category: 'prepare',
          subType: 'domain',
          id: d.id,
          description: d.summary.slice(0, 80) + '...',
        });
      }
    });

    // Search Workflows
    WORKFLOWS_DATA.forEach(w => {
      if (w.title.toLowerCase().includes(q) || w.summary.toLowerCase().includes(q)) {
        items.push({
          type: 'Workflow Procedure',
          title: w.title,
          category: 'prepare',
          subType: 'workflow',
          id: w.id,
          description: w.summary.slice(0, 80) + '...',
        });
      }
    });

    // Search Cases
    CASES_DATA.forEach(c => {
      if (c.title.toLowerCase().includes(q) || c.theCoreConflict.toLowerCase().includes(q)) {
        items.push({
          type: 'Practical Case',
          title: c.title,
          category: 'prepare',
          subType: 'case',
          id: c.id,
          description: c.companyType,
        });
      }
    });

    // Search Industry Case Studies & Data
    industryStore.getCaseStudies().forEach(cs => {
      if (cs.title.toLowerCase().includes(q) || cs.description.toLowerCase().includes(q)) {
        items.push({
          type: 'Industry Case Study',
          title: cs.title,
          category: 'prepare',
          subType: 'industry_case',
          id: cs.id,
          description: `${cs.geography} • ${cs.difficulty} • Data Grounded`,
        });
      }
    });

    // Search Jobs
    JOBS_DATA.forEach(j => {
      if (j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.requiredSkills.some(s => s.toLowerCase().includes(q))) {
        items.push({
          type: 'Job Listing',
          title: `${j.title} • ${j.company}`,
          category: 'discover',
          subType: 'job',
          id: j.id,
          description: `${j.location} • ${j.salaryRange}`,
        });
      }
    });

    return items.slice(0, 8);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            id="command-palette-input"
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles, domains, workflows, cases, or jobs..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base focus:outline-hidden"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500 font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching &ldquo;Stripe&rdquo;, &ldquo;Backend&rdquo;, &ldquo;Fintech&rdquo;, or &ldquo;Migration&rdquo;.</p>
            </div>
          ) : (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {query ? 'Results' : 'Suggested Topics & Positions'}
              </div>
              {searchResults.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    onNavigate(item.category, { type: item.subType, id: item.id });
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                        {item.type}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                        {item.title}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5 ml-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">Esc</kbd> to close</span>
            <span><kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">↵</kbd> to select</span>
          </div>
          <span className="font-medium text-blue-600">Career Interview OS</span>
        </div>

      </div>
    </div>
  );
};
