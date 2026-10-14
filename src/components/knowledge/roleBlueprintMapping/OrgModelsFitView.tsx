import React, { useState, useMemo } from 'react';
import { 
  Users, 
  GitPullRequest, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Briefcase, 
  ChevronRight, 
  GitBranch, 
  Target, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  Check, 
  Info
} from 'lucide-react';
import { usePreferredRoleMappingContext } from '../../../features/knowledge/context/PreferredRoleMappingContext';
import { ORG_MODELS_DATA } from '../../../features/knowledge/data/orgModelsData';
import { OrgModelBlueprint } from '../../../features/knowledge/types/knowledgeTaxonomy';

export const OrgModelsFitView: React.FC = () => {
  const {
    preferredRole,
    preferredRoleId,
    targetDomains,
    activeDomain
  } = usePreferredRoleMappingContext();

  // Local state for all models (allowing Add/Edit/Delete in session)
  const [orgModels, setOrgModels] = useState<OrgModelBlueprint[]>(ORG_MODELS_DATA);
  const [activeTab, setActiveTab] = useState<'topology' | 'reporting' | 'raci' | 'friction'>('topology');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<OrgModelBlueprint | null>(null);

  // Filter & rank 2-3 most relevant archetypes based on preferred role and domain
  const recommendedArchetypes = useMemo(() => {
    const isPlatformOrInfra = preferredRole.title.toLowerCase().includes('platform') || 
                              preferredRole.title.toLowerCase().includes('devops') || 
                              preferredRole.title.toLowerCase().includes('backend') ||
                              preferredRole.title.toLowerCase().includes('security');

    return orgModels.map(model => {
      let score = 80;
      let tag = 'Common in Series B+';

      if (model.id === 'org-platform-infra') {
        score = isPlatformOrInfra ? 96 : 86;
        tag = isPlatformOrInfra ? '96% Best Fit • Platform Team / Stream-Aligned' : '86% Fit • Platform Consumer';
      } else if (model.id === 'org-product-squads') {
        score = isPlatformOrInfra ? 90 : 95;
        tag = isPlatformOrInfra ? '90% Fit • Stream-Aligned Squad' : '95% Best Fit • Mission-Oriented';
      } else if (model.id === 'org-matrix-functional') {
        score = 84;
        tag = '84% Fit • Dual-Axis Matrix';
      } else if (model.id === 'org-embedded-hub-spoke') {
        score = 82;
        tag = '82% Fit • Specialist Enablement';
      }

      return { model, score, tag };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Take top 3 recommended
  }, [orgModels, preferredRole]);

  const [selectedModelId, setSelectedModelId] = useState<string>(() => {
    return recommendedArchetypes[0]?.model.id || orgModels[0].id;
  });

  // Keep selectedModelId valid if list updates
  const currentModel = useMemo(() => {
    return orgModels.find(m => m.id === selectedModelId) || recommendedArchetypes[0]?.model || orgModels[0];
  }, [orgModels, selectedModelId, recommendedArchetypes]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Operating Architecture
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-2xs font-bold text-slate-500">
                Calibrated for: <strong className="text-slate-900">{preferredRole.title}</strong> in <strong className="text-slate-900">{activeDomain || targetDomains[0]}</strong>
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Org Models & Role Fit Intelligence
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              Inspect how engineering, product, and leadership topologies structure ownership. Evaluate cross-functional handoffs, RACI decision rights, reporting lines, and latent organizational friction before committing to a role.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Add Org Archetype</span>
            </button>
          </div>
        </div>

        {/* 2-3 Recommended Archetypes Selector */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Recommended Archetypes for {preferredRole.title}:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendedArchetypes.map(({ model, score, tag }) => {
              const isSelected = model.id === currentModel.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-2xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-indigo-700'
                      }`}>
                        {tag}
                      </span>
                      <span className="text-2xs font-bold text-slate-400">{score}% match</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-1">
                      {model.title}
                    </h4>
                  </div>
                  <span className="text-2xs text-slate-500 line-clamp-1 mt-2">
                    {model.bestFitStage.split('(')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION: VISUALIZATION HIERARCHY CHART */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-2xs font-black uppercase tracking-wider text-indigo-600">Topology Visualization</span>
            <h3 className="text-sm font-black text-slate-900">Organizational Hierarchy & Role Placement</h3>
          </div>
          <span className="text-2xs font-semibold text-slate-500">
            Active Archetype: <strong>{currentModel.title}</strong>
          </span>
        </div>

        {/* Tree Layout */}
        <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 font-sans text-xs space-y-3">
          
          {/* Level 1: Organization */}
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Organization (Enterprise Scale)</span>
          </div>

          {/* Level 2: Executive / Business Unit */}
          <div className="ml-6 pl-4 border-l-2 border-indigo-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="text-indigo-400">├──</span>
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 shadow-2xs">
                Executive Leadership (VP of Engineering / VP of Product / CTO)
              </span>
            </div>

            {/* Level 3: Product / Platform Cluster */}
            <div className="ml-6 pl-4 border-l-2 border-indigo-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <span className="text-indigo-400">├──</span>
                <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-950 font-bold shadow-2xs">
                  Domain Core Group ({activeDomain || 'Enterprise SaaS'} Infrastructure & Services)
                </span>
              </div>

              {/* Level 4: Pod / Squad with Highlighted Role */}
              <div className="ml-6 pl-4 border-l-2 border-indigo-300 space-y-2">
                <div className="text-2xs font-bold uppercase tracking-wider text-indigo-700">
                  └── Autonomous Delivery Pod
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
                  
                  {/* Highlighted Role */}
                  <div className="p-2.5 rounded-xl bg-slate-900 text-white border-2 border-indigo-500 shadow-sm space-y-1 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Active Role</span>
                      <Target className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-xs font-black truncate">{preferredRole.title}</div>
                    <div className="text-[10px] text-slate-300">Ownership & Scope</div>
                  </div>

                  {/* Adjacent Squad Roles */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Architecture Lead</div>
                    <div className="text-xs font-bold text-slate-800 truncate">Principal / Tech Lead</div>
                    <div className="text-[10px] text-slate-500">System Design & SLOs</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Experience Lead</div>
                    <div className="text-xs font-bold text-slate-800 truncate">Staff Product Designer</div>
                    <div className="text-[10px] text-slate-500">Design Systems & Workflows</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Data Partner</div>
                    <div className="text-xs font-bold text-slate-800 truncate">Staff Data / BI Analyst</div>
                    <div className="text-[10px] text-slate-500">Metrics & Telemetry</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Engineering Core</div>
                    <div className="text-xs font-bold text-slate-800 truncate">3-5 Full-Stack Devs</div>
                    <div className="text-[10px] text-slate-500">Sprint Delivery & Tests</div>
                  </div>

                </div>
              </div>
            </div>

            {/* Level 5: Cross-Team Dependencies */}
            <div className="flex items-center gap-2 text-slate-600 text-2xs pt-1">
              <span className="text-indigo-400">└──</span>
              <span className="font-bold text-slate-700">Cross-Team Dependencies:</span>
              <span>InfoSec Gatekeeper • Shared Platform API • Cloud Ingress Squad • Enterprise SRE</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOUR FUNCTIONAL TABS DEEP-DIVE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        
        {/* Tab Controls Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveTab('topology')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'topology'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Pod Topology & Placement
            </button>
            <button
              onClick={() => setActiveTab('reporting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reporting'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Reporting & Escalation
            </button>
            <button
              onClick={() => setActiveTab('raci')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'raci'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. RACI Matrix
            </button>
            <button
              onClick={() => setActiveTab('friction')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'friction'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4. Friction Points & Questions
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingModel(currentModel)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Edit active model"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            {orgModels.length > 2 && (
              <button
                onClick={() => {
                  if (confirm(`Delete organization archetype "${currentModel.title}"?`)) {
                    const remaining = orgModels.filter(m => m.id !== currentModel.id);
                    setOrgModels(remaining);
                    setSelectedModelId(remaining[0].id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete model"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Pod Topology & Placement */}
        {activeTab === 'topology' && (
          <div className="p-6 space-y-5">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900">Unit Composition & Daily Collaboration</h4>
              <p className="text-xs text-slate-600">
                Detailed breakdowns of how work units are structured in {currentModel.title}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentModel.topologyBreakdown.map((unit, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{unit.unitName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Autonomy: {unit.autonomyLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{unit.description}</p>
                  <div className="pt-2 border-t border-slate-200/70">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Composition</span>
                    <p className="text-2xs font-semibold text-slate-800 mt-0.5">{unit.composition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Reporting Lines & Escalation */}
        {activeTab === 'reporting' && (
          <div className="p-6 space-y-5">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900">Reporting Lines, Decision Rights & Escalation</h4>
              <p className="text-xs text-slate-600">
                Direct hierarchy, cross-functional collaboration channels, and escalation paths when roadmap conflict arises.
              </p>
            </div>

            <div className="space-y-3">
              {currentModel.reportingStructure.map((rep, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900">{rep.role}</span>
                    <div className="flex items-center gap-1.5 text-2xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      <span>Reports to:</span>
                      <strong className="text-slate-900">{rep.reportsTo}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Primary Collaborators</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rep.primaryCollaborators.map((c, ci) => (
                          <span key={ci} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-2xs font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Review & Governance Cadence</span>
                      <p className="text-2xs font-medium text-slate-700 mt-1">{rep.cadence}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: RACI Matrix Tailored to Role */}
        {activeTab === 'raci' && (
          <div className="p-6 space-y-5">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900">RACI Matrix (Accountability & Decision Rights)</h4>
              <p className="text-xs text-slate-600">
                A = Accountable (Final decision maker) • R = Responsible (Does the work) • C = Consulted (Provides input) • I = Informed (Kept updated)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="p-3 font-black text-slate-900">Activity / Decision</th>
                    <th className="p-3 font-bold text-slate-700 text-center bg-indigo-50/50">
                      Accountable (A)
                    </th>
                    <th className="p-3 font-bold text-slate-700 text-center">
                      Responsible (R)
                    </th>
                    <th className="p-3 font-bold text-slate-700 text-center">
                      Consulted (C)
                    </th>
                    <th className="p-3 font-bold text-slate-700 text-center">
                      Informed (I)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentModel.raciMatrix.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800">{row.activity}</td>
                      <td className="p-3 text-center bg-indigo-50/30">
                        <span className="inline-flex px-2.5 py-1 rounded-lg font-bold text-xs bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {row.accountable}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex px-2.5 py-1 rounded-lg font-bold text-xs bg-blue-50 text-blue-800 border border-blue-200">
                          {row.responsible}
                        </span>
                      </td>
                      <td className="p-3 text-center text-slate-600 font-medium text-2xs">
                        {row.consulted.join(', ')}
                      </td>
                      <td className="p-3 text-center text-slate-500 font-medium text-2xs">
                        {row.informed.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Friction Points & Interview Signals */}
        {activeTab === 'friction' && (
          <div className="p-6 space-y-5">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900">Friction Points & Reverse-Interview Signals</h4>
              <p className="text-xs text-slate-600">
                Known operational failure modes in this archetype and precise questions to evaluate organizational health during interviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Friction Points */}
              <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/70 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Common Latent Friction Points</span>
                </div>
                <div className="space-y-2">
                  {currentModel.frictionPoints.map((pt, i) => (
                    <div key={i} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions to Ask HM */}
              <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-200/70 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Probing Questions for Hiring Managers</span>
                </div>
                <div className="space-y-2">
                  {currentModel.interviewSignals.map((sig, i) => (
                    <div key={i} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>"{sig}"</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ADD ORG ARCHETYPE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Organization Archetype</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem('modelTitle') as HTMLInputElement).value;
                const headline = (form.elements.namedItem('headline') as HTMLInputElement).value;
                const stage = (form.elements.namedItem('stage') as HTMLInputElement).value;

                const newModel: OrgModelBlueprint = {
                  id: `org-custom-${Date.now()}`,
                  type: 'cross_functional_pod',
                  title,
                  headline,
                  bestFitStage: stage,
                  corePhilosophy: 'Cross-functional alignment and fast-feedback iteration loops.',
                  advantages: ['Decentralized execution', 'Direct user feedback'],
                  frictionPoints: ['Inter-team dependency bottlenecks', 'Resource allocation disputes'],
                  applicableRoles: [preferredRole.category],
                  topologyBreakdown: [
                    {
                      unitName: 'Primary Core Unit',
                      description: 'Squad dedicated to value delivery.',
                      composition: 'Tech Lead, PM, 3-4 Developers',
                      autonomyLevel: 'High'
                    }
                  ],
                  reportingStructure: [
                    {
                      role: preferredRole.title,
                      reportsTo: 'Director of Engineering / VP Product',
                      primaryCollaborators: ['Tech Lead', 'Staff Designer'],
                      cadence: 'Weekly 1:1 strategy alignment'
                    }
                  ],
                  decisionDependencies: [
                    {
                      decisionType: 'Feature Architecture Sign-off',
                      ownerRole: preferredRole.title,
                      approverRole: 'Engineering Director',
                      consultedRoles: ['Tech Lead'],
                      escalationPath: 'VP Engineering'
                    }
                  ],
                  raciMatrix: [
                    {
                      activity: 'Roadmap & PRD Authoring',
                      responsible: preferredRole.title,
                      accountable: 'Director of Product',
                      consulted: ['Tech Lead'],
                      informed: ['Engineering Team']
                    },
                    {
                      activity: 'System Architecture & SLOs',
                      responsible: 'Tech Lead',
                      accountable: 'Director of Engineering',
                      consulted: [preferredRole.title],
                      informed: ['Support']
                    }
                  ],
                  roleFitChecklist: [
                    {
                      role: preferredRole.title,
                      whereItFits: 'Autonomous Delivery Pod',
                      keyOwnership: 'Scope, prioritization, SLO alignment',
                      frictionWarning: 'Watch for cross-team dependencies'
                    }
                  ]
                };

                setOrgModels(prev => [...prev, newModel]);
                setSelectedModelId(newModel.id);
                setIsAddModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">Archetype Title</label>
                <input
                  required
                  name="modelTitle"
                  placeholder="e.g. Distributed Tribe & Guild Topology"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">Headline</label>
                <input
                  required
                  name="headline"
                  placeholder="e.g. High-velocity autonomous squads coordinated via technical guilds"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">Best Fit Stage</label>
                <input
                  required
                  name="stage"
                  placeholder="e.g. Series B+ with 50-200 engineers"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-indigo-700"
                >
                  Create Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
