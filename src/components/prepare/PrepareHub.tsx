import React, { useState } from 'react';
import { 
  BookOpen, 
  Building2, 
  GitBranch, 
  Scale, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2,
  TrendingUp,
  Sparkle
} from 'lucide-react';
import { ROLES_DATA } from '../../data/rolesData';
import { DOMAINS_DATA } from '../../data/domainsData';
import { WORKFLOWS_DATA } from '../../data/workflowsData';
import { CASES_DATA } from '../../data/casesData';
import { RoleBlueprint, IndustryDomainGuide, ProfessionalWorkflow, PracticalCase, InterviewQuestion } from '../../types';
import { RoleDetailModal } from './RoleDetailModal';
import { DomainDetailModal } from './DomainDetailModal';
import { WorkflowDetailModal } from './WorkflowDetailModal';
import { CaseDetailModal } from './CaseDetailModal';
import { QuestionBankView } from './QuestionBankView';
import { IndustryDashboardView } from './IndustryDashboardView';
import { CasePracticeDetailModal } from './CasePracticeDetailModal';
import { CaseStudy } from '../../features/industry/types';
import { industryStore } from '../../features/industry/services/industryStore';

export type PrepareSubTab = 'roles' | 'domains' | 'workflows' | 'cases' | 'questions' | 'industry_intelligence';

interface PrepareHubProps {
  initialSubTab?: PrepareSubTab;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onStartPracticeRole: (role: RoleBlueprint) => void;
  onStartPracticeDomain: (domainName: string) => void;
  onStartPracticeQuestion: (question: InterviewQuestion) => void;
}

export const PrepareHub: React.FC<PrepareHubProps> = ({
  initialSubTab = 'roles',
  bookmarkedIds,
  onToggleBookmark,
  onStartPracticeRole,
  onStartPracticeDomain,
  onStartPracticeQuestion,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<PrepareSubTab>(initialSubTab);

  // Modals state
  const [selectedRole, setSelectedRole] = useState<RoleBlueprint | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<IndustryDomainGuide | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ProfessionalWorkflow | null>(null);
  const [selectedCase, setSelectedCase] = useState<PracticalCase | null>(null);
  const [selectedIndustryCase, setSelectedIndustryCase] = useState<CaseStudy | null>(null);

  const subTabs = [
    { id: 'industry_intelligence', label: 'Industry Intelligence & Cases', icon: TrendingUp, count: `${industryStore.getIndustries().length} Sectors`, isNew: true },
    { id: 'roles', label: 'Roles Encyclopedia', icon: BookOpen, count: ROLES_DATA.length },
    { id: 'domains', label: 'Industry Domains', icon: Building2, count: DOMAINS_DATA.length },
    { id: 'workflows', label: 'Workflows & SOPs', icon: GitBranch, count: WORKFLOWS_DATA.length },
    { id: 'cases', label: 'Practical Cases', icon: Scale, count: CASES_DATA.length },
    { id: 'questions', label: 'Question Bank & Rubrics', icon: HelpCircle, count: '6+' },
  ];

  return (
    <div className="space-y-6">
      {/* Subnav Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200/80">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`prepare-subtab-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as PrepareSubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-view Content */}
      {activeSubTab === 'industry_intelligence' && (
        <IndustryDashboardView
          onSelectCaseToPractice={(cs) => setSelectedIndustryCase(cs)}
        />
      )}

      {activeSubTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-5 rounded-2xl border border-blue-100">
            <h3 className="text-base font-bold text-slate-900">
              Role Blueprints & Day-in-the-Life
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Study what elite interviewers calibrate for across senior roles: day-in-the-life realities, core competencies, tech stacks, and career progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROLES_DATA.map(role => (
              <div
                key={role.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {role.category}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">
                      {role.salaryBenchmark.senior}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{role.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{role.overview}</p>

                  <div className="mt-4 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Competencies</div>
                    {role.competencies.slice(0, 2).map((comp, idx) => (
                      <div key={idx} className="text-xs text-slate-700 font-medium flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{comp.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedRole(role)}
                    className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onStartPracticeRole(role)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Practice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'domains' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50/50 p-5 rounded-2xl border border-teal-100">
            <h3 className="text-base font-bold text-slate-900">
              Industry Domains & Business Jargon
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Interviewers expect immediate domain fluency. Master regulatory constraints, architectural patterns, terminology glossaries, and common interview traps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DOMAINS_DATA.map(domain => (
              <div
                key={domain.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                      Domain Deep-Dive
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{domain.name}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{domain.summary}</p>

                  {/* High-stakes challenges */}
                  <div className="mt-4 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High-Stakes Challenges</div>
                    {domain.coreBusinessProblems.slice(0, 2).map((prob, idx) => (
                      <div key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                        <span>{prob}</span>
                      </div>
                    ))}
                  </div>

                  {/* Critical Term Preview */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Key Terminology:</span>
                    <span className="font-mono font-bold text-slate-800">{domain.criticalTerminology[0]?.term}: </span>
                    <span className="text-slate-600">{domain.criticalTerminology[0]?.definition.slice(0, 75)}...</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedDomain(domain)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Domain Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onStartPracticeDomain(domain.name)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Practice Domain Q&A</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'workflows' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50/50 p-5 rounded-2xl border border-blue-100">
            <h3 className="text-base font-bold text-slate-900">
              Professional Workflows & Standard Operating Procedures
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Step-by-step procedures that separate junior developers from senior staff: Zero-downtime database migrations, SEV-1 blameless postmortems, and PRD canary releases.
            </p>
          </div>

          <div className="space-y-4">
            {WORKFLOWS_DATA.map(workflow => (
              <div
                key={workflow.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {workflow.category}
                    </span>
                    <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {workflow.domain}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Duration: {workflow.estimatedDuration}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{workflow.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{workflow.summary}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedWorkflow(workflow)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>View Step-by-Step SOP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'cases' && (
        <div className="space-y-6">
          {/* Highlight banner for Industry Intelligence Layer */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-5 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">
                  New Feature
                </span>
                <span className="text-xs font-semibold text-purple-200">
                  Real Sector Benchmark Grounding
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Industry Intelligence & Exhibit-Driven Case Studies
              </h3>
              <p className="text-xs text-purple-200 max-w-xl leading-relaxed">
                Practice consultant-grade cases with interactive data exhibits, verified provenance, data-quality scoring, and assumption-tracking.
              </p>
            </div>

            <button
              onClick={() => setActiveSubTab('industry_intelligence')}
              className="px-4 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-purple-700" />
              <span>Explore Industry Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50/50 p-5 rounded-2xl border border-purple-100">
            <h3 className="text-base font-bold text-slate-900">
              Practical Business & Engineering Cases
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real-world trade-off scenarios frequently debated in system design and product sense rounds. Compare competing approaches and examine recommended resolutions.
            </p>
          </div>

          <div className="space-y-4">
            {CASES_DATA.map(c => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-400 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                      {c.roleCategory}
                    </span>
                    <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {c.sector}
                    </span>
                    <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {c.difficulty}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{c.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    <strong className="text-slate-800">The Conflict:</strong> {c.theCoreConflict}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedCase(c)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors cursor-pointer"
                  >
                    <span>Analyze Case & Trade-offs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'questions' && (
        <QuestionBankView
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={onToggleBookmark}
          onPracticeQuestion={onStartPracticeQuestion}
        />
      )}

      {/* Modals */}
      <RoleDetailModal
        role={selectedRole}
        isOpen={Boolean(selectedRole)}
        onClose={() => setSelectedRole(null)}
        onStartPractice={onStartPracticeRole}
      />

      <DomainDetailModal
        domain={selectedDomain}
        isOpen={Boolean(selectedDomain)}
        onClose={() => setSelectedDomain(null)}
        onStartPracticeDomain={onStartPracticeDomain}
      />

      <WorkflowDetailModal
        workflow={selectedWorkflow}
        isOpen={Boolean(selectedWorkflow)}
        onClose={() => setSelectedWorkflow(null)}
      />

      <CaseDetailModal
        caseStudy={selectedCase}
        isOpen={Boolean(selectedCase)}
        onClose={() => setSelectedCase(null)}
      />

      {/* Industry Grounded Case Practice Modal */}
      {selectedIndustryCase && (
        <CasePracticeDetailModal
          caseStudy={selectedIndustryCase}
          onClose={() => setSelectedIndustryCase(null)}
        />
      )}
    </div>
  );
};
