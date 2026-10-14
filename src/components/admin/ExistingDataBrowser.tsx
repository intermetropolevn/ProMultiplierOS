import React, { useState } from 'react';
import { 
  Briefcase, 
  BookOpen, 
  Building2, 
  GitBranch, 
  Scale, 
  HelpCircle, 
  Search, 
  ExternalLink, 
  Layers, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ROLES_DATA } from '../../data/rolesData';
import { DOMAINS_DATA } from '../../data/domainsData';
import { WORKFLOWS_DATA } from '../../data/workflowsData';
import { CASES_DATA } from '../../data/casesData';
import { QUESTIONS_DATA } from '../../data/questionsData';
import { JOBS_DATA } from '../../data/jobsData';
import { DataManagementTab } from '../../features/admin/types';

interface ExistingDataBrowserProps {
  section: 'jobs_roles' | 'skills' | 'domains' | 'knowledge' | 'workflows' | 'resources';
  onNavigateToPrepare?: () => void;
}

export const ExistingDataBrowser: React.FC<ExistingDataBrowserProps> = ({ section }) => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      
      {/* Header info */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 capitalize">
            {section.replace('_', ' ')} Master Directory
          </h3>
          <p className="text-xs text-slate-500">
            Core Career OS ontology. Resources crawled and published through the Import Queue are mapped directly into this taxonomy.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* JOBS / ROLES */}
      {section === 'jobs_roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES_DATA
            .filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()))
            .map((role) => (
              <div key={role.id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded text-[10px] uppercase">
                      {role.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{role.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{role.overview}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {role.competencies.slice(0, 4).map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* SKILLS */}
      {section === 'skills' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Case Structuring & MECE',
              'Market Sizing & Mental Math',
              'Profitability Trees',
              'Hypothesis-Driven Problem Solving',
              'Chart & Exhibit Reading',
              'M&A Valuation Diagnostics',
              'System Architecture & Trade-offs',
              'Distributed Consensus',
              'Database Sharding & Replication',
              'Product Sense & CIRCLES Method',
              'GTM & Metrics Prioritization',
              'Stakeholder Alignment',
              'Behavioral Leadership & STAR',
              'Conflict Resolution',
              'Post-Mortem Root Cause Analysis'
            ]
              .filter(s => s.toLowerCase().includes(search.toLowerCase()))
              .map((skill, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{skill}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold text-[10px]">
                    Standardized
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* DOMAINS */}
      {section === 'domains' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOMAINS_DATA
            .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
            .map((domain) => (
              <div key={domain.id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>{domain.name}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{domain.summary}</p>
                <div className="pt-2 flex flex-wrap gap-1">
                  {domain.coreBusinessProblems.slice(0, 3).map((sub, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* KNOWLEDGE (Cases & Questions) */}
      {section === 'knowledge' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CASES_DATA
              .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.sector.toLowerCase().includes(search.toLowerCase()))
              .map((caseStudy) => (
                <div key={caseStudy.id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold rounded text-[10px] uppercase">
                      {caseStudy.sector}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {caseStudy.difficulty}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{caseStudy.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{caseStudy.backgroundScenario}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* WORKFLOWS */}
      {section === 'workflows' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORKFLOWS_DATA
            .filter(w => w.title.toLowerCase().includes(search.toLowerCase()))
            .map((wf) => (
              <div key={wf.id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px] uppercase">
                  {wf.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{wf.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{wf.summary}</p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  {wf.steps.length} sequential execution stages
                </div>
              </div>
            ))}
        </div>
      )}

      {/* RESOURCES */}
      {section === 'resources' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Career OS integrates external official preparation libraries, casebooks, and video masterclasses.
            When resources pass administrator review in the Import Queue, they are automatically published here.
          </p>
          <div className="space-y-3">
            {[
              { title: 'McKinsey Problem-Solving Test & Practice Interactive Cases', provider: 'McKinsey Careers', type: 'Case Practice' },
              { title: 'BCG Interactive Case Simulations & Judgement Framework', provider: 'Boston Consulting Group', type: 'Simulation' },
              { title: 'Bain Written Case Preparation & Exhibit Walkthroughs', provider: 'Bain & Company', type: 'Written Case' },
              { title: 'Wharton MBA Consulting Club Casebook 2025', provider: 'Wharton Consulting Club', type: 'Casebook PDF' }
            ].map((res, i) => (
              <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{res.title}</h4>
                  <span className="text-[11px] text-slate-500">{res.provider}</span>
                </div>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold text-[10px]">
                  {res.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
