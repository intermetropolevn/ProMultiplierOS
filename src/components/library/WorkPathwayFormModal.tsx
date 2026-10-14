import React, { useState } from 'react';
import { 
  WorkRelevantPathway, 
  PathwayType,
  PathwayDifficulty,
  PathwayWorkType,
  PathwayFunction,
  PATHWAY_TYPES_LIST,
  PATHWAY_TYPE_CONFIG,
  PATHWAY_DIFFICULTY_CONFIG
} from '../../features/knowledge/types/workPathways';
import { RoleCategory, SectorDomain } from '../../types';
import { EvidenceStrengthLevel } from '../../features/sources/types';
import { X, GitBranch, ShieldCheck } from 'lucide-react';
import { CANONICAL_ROLES, CANONICAL_DOMAINS } from '../../data/jobTaxonomies';

const ALL_FUNCTIONS: PathwayFunction[] = [
  'Product Management',
  'Core Software Engineering',
  'DevOps, SRE & Cloud',
  'Data Engineering & Analytics',
  'Machine Learning & AI Engineering',
  'Cybersecurity & Governance',
  'UI/UX & Product Design',
  'Program & Technical Operations',
  'Quality Assurance & Testing',
  'Business Strategy & Finance',
  'Cross-Functional Operations'
];

const ALL_WORK_TYPES: PathwayWorkType[] = [
  'Execution & Delivery',
  'System Architecture & Design',
  'Discovery & Research',
  'Quality, Governance & Compliance',
  'Optimization & Maintenance',
  'Incident Response & Operations',
  'Strategic Planning & Alignment'
];

const ALL_SENIORITIES = [
  'Intern / Fresh Grad',
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead / Staff',
  'Principal / Fellow',
  'Manager / Director'
];

interface WorkPathwayFormModalProps {
  initialPathway?: WorkRelevantPathway | null;
  onClose: () => void;
  onSave: (pathway: WorkRelevantPathway) => void;
}

export const WorkPathwayFormModal: React.FC<WorkPathwayFormModalProps> = ({
  initialPathway,
  onClose,
  onSave
}) => {
  const isEditing = !!initialPathway;
  const today = new Date().toISOString().split('T')[0];

  // Core Identity & Classification
  const [name, setName] = useState(initialPathway?.name || initialPathway?.title || '');
  const [codeName, setCodeName] = useState(initialPathway?.codeName || '');
  const [parentRole, setParentRole] = useState<RoleCategory>(initialPathway?.parentRole || initialPathway?.role || 'Software Engineering');
  const [domain, setDomain] = useState<SectorDomain>((initialPathway?.domain as SectorDomain) || 'Enterprise SaaS');
  const [pathwayType, setPathwayType] = useState<PathwayType>(initialPathway?.pathwayType || 'Workstream');
  const [functionArea, setFunctionArea] = useState<PathwayFunction | string>(initialPathway?.function || 'Core Software Engineering');
  const [workType, setWorkType] = useState<PathwayWorkType | string>(initialPathway?.workType || 'Execution & Delivery');

  // Narrative & Operational Mechanics
  const [description, setDescription] = useState(initialPathway?.description || initialPathway?.summary || '');
  const [objective, setObjective] = useState(initialPathway?.objective || '');
  const [triggerWhenUsed, setTriggerWhenUsed] = useState(initialPathway?.triggerWhenUsed || '');
  const [scopeClarification, setScopeClarification] = useState(
    initialPathway?.scopeClarification || 'Granular unit of work representing operational day-to-day execution, not a generic monolithic role description.'
  );
  const [organizationalContext, setOrganizationalContext] = useState(
    initialPathway?.organizationalContext || 'Operates within sprint cycles with cross-functional alignment and code review approvals.'
  );

  // Inputs & Outputs
  const [inputsText, setInputsText] = useState((initialPathway?.inputs || ['User requirements', 'Technical specification', 'Architecture approval']).join(', '));
  const [outputsText, setOutputsText] = useState((initialPathway?.outputs || ['Production release', 'Test report', 'Documentation']).join(', '));
  const [deliverablesText, setDeliverablesText] = useState(
    (initialPathway?.deliverables || []).map(d => typeof d === 'string' ? d : d.title).join(', ') || 'Production Artifact, Architecture Document, Test Coverage Report'
  );

  // Skills & Tools
  const [skillsText, setSkillsText] = useState(
    (initialPathway?.requiredSkills || initialPathway?.connectedSkills || []).map(s => typeof s === 'string' ? s : s.name).join(', ') || 'API Architecture, Git Workflows, Automated Testing'
  );
  const [toolsText, setToolsText] = useState((initialPathway?.toolsAndPlatforms || ['GitHub', 'Linear', 'Docker']).join(', '));

  // Ecosystem & Career Alignment
  const [knowledgeSourcesText, setKnowledgeSourcesText] = useState((initialPathway?.knowledgeSources || ['RFC specifications', 'Engineering runbooks']).join(', '));
  const [frameworksText, setFrameworksText] = useState((initialPathway?.relatedFrameworks || ['Agile Scrum', 'CI/CD pipeline standard']).join(', '));
  const [projectsText, setProjectsText] = useState((initialPathway?.relatedProjects || ['Microservice backend modernization', 'Zero-downtime database rollout']).join(', '));
  const [jobOpportunitiesText, setJobOpportunitiesText] = useState((initialPathway?.relatedJobOpportunities || [`Senior ${parentRole}`, `Lead ${parentRole}`]).join(', '));

  // Calibration & Evidence
  const [difficulty, setDifficulty] = useState<PathwayDifficulty>(initialPathway?.difficulty || 'Advanced');
  const [seniorityRelevance, setSeniorityRelevance] = useState<string[]>(initialPathway?.seniorityRelevance || ['Mid-Level', 'Senior']);
  const [evidenceLevel, setEvidenceLevel] = useState<EvidenceStrengthLevel>(initialPathway?.evidenceLevel || initialPathway?.evidenceStrengthLevel || 4);
  const [tagsText, setTagsText] = useState((initialPathway?.tags || ['Engineering', 'Production']).join(', '));

  // URLs & Sources
  const [officialWebsite, setOfficialWebsite] = useState(initialPathway?.officialWebsite || '');
  const [sourceUrl, setSourceUrl] = useState(initialPathway?.sourceUrl || '');
  const [sourceName, setSourceName] = useState(initialPathway?.sourceName || 'Engineering SOP & Standard Operating Framework');
  const [sourceType, setSourceType] = useState(initialPathway?.sourceType || 'Industry Standard');
  const [dateObserved, setDateObserved] = useState(initialPathway?.dateObserved || today);
  const [referenceLinksText, setReferenceLinksText] = useState((initialPathway?.referenceLinks || []).join('\n'));

  const toggleSeniority = (s: string) => {
    setSeniorityRelevance(prev => 
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    if (!finalName) return;

    const autoCode = codeName.trim() || finalName.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 15);
    const parsedSkills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    const parsedTools = toolsText.split(',').map(s => s.trim()).filter(Boolean);
    const parsedInputs = inputsText.split(',').map(s => s.trim()).filter(Boolean);
    const parsedOutputs = outputsText.split(',').map(s => s.trim()).filter(Boolean);
    const parsedDeliverables = deliverablesText.split(',').map(s => s.trim()).filter(Boolean);
    const parsedTags = tagsText.split(',').map(s => s.trim()).filter(Boolean);

    const pathway: WorkRelevantPathway = {
      id: initialPathway?.id || `pathway-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: finalName,
      title: finalName,
      codeName: autoCode,
      pathwayType,
      parentRole,
      role: parentRole,
      domain,
      function: functionArea,
      workType,
      description: description.trim() || 'Professional work unit delivering production value.',
      summary: description.trim() || 'Professional work unit delivering production value.',
      objective: objective.trim() || 'Execute structured operational workflow delivering verified business value.',
      triggerWhenUsed: triggerWhenUsed.trim() || 'Triggered during sprint planning or product initiative kick-off.',
      scopeClarification: scopeClarification.trim(),
      organizationalContext: organizationalContext.trim(),
      inputs: parsedInputs.length > 0 ? parsedInputs : ['User requirements', 'Technical specification'],
      outputs: parsedOutputs.length > 0 ? parsedOutputs : ['Production release', 'Test report'],
      deliverables: parsedDeliverables.map(d => ({
        title: d,
        type: 'Work Deliverable',
        format: 'Verified Document / Code',
        description: `Delivered output of ${d}`
      })),
      deliverablesAndArtifacts: parsedDeliverables.map(d => ({
        title: d,
        type: 'Work Deliverable',
        format: 'Verified Document / Code',
        description: `Delivered output of ${d}`
      })),
      requiredSkills: parsedSkills.map(sk => ({
        name: sk,
        relevance: 'primary',
        proficiency: 'Practitioner'
      })),
      connectedSkills: parsedSkills.map(sk => ({
        name: sk,
        relevance: 'primary',
        proficiency: 'Practitioner'
      })),
      toolsAndPlatforms: parsedTools.length > 0 ? parsedTools : ['Git', 'Linear'],
      knowledgeSources: knowledgeSourcesText.split(',').map(s => s.trim()).filter(Boolean),
      relatedFrameworks: frameworksText.split(',').map(s => s.trim()).filter(Boolean),
      relatedProjects: projectsText.split(',').map(s => s.trim()).filter(Boolean),
      relatedJobOpportunities: jobOpportunitiesText.split(',').map(s => s.trim()).filter(Boolean),
      activities: initialPathway?.activities || initialPathway?.stages || [
        {
          stepNumber: 1,
          title: 'Planning & Specification',
          phase: 'Inception',
          whatProfessionalsDo: 'Review incoming inputs, scope technical boundaries, and formulate delivery approach.',
          toolsAndPlatforms: parsedTools.slice(0, 2),
          deliverable: 'Technical Specification'
        },
        {
          stepNumber: 2,
          title: 'Execution & Verification',
          phase: 'Delivery',
          whatProfessionalsDo: 'Execute operational steps, run automated tests, and produce deliverables.',
          toolsAndPlatforms: parsedTools.slice(0, 3),
          deliverable: 'Production Output & Review Sign-off'
        }
      ],
      stages: initialPathway?.stages || initialPathway?.activities || [
        {
          stepNumber: 1,
          title: 'Planning & Specification',
          phase: 'Inception',
          whatProfessionalsDo: 'Review incoming inputs, scope technical boundaries, and formulate delivery approach.',
          toolsAndPlatforms: parsedTools.slice(0, 2),
          deliverable: 'Technical Specification'
        },
        {
          stepNumber: 2,
          title: 'Execution & Verification',
          phase: 'Delivery',
          whatProfessionalsDo: 'Execute operational steps, run automated tests, and produce deliverables.',
          toolsAndPlatforms: parsedTools.slice(0, 3),
          deliverable: 'Production Output & Review Sign-off'
        }
      ],
      difficulty,
      seniorityRelevance: seniorityRelevance.length > 0 ? seniorityRelevance : ['Mid-Level', 'Senior'],
      evidenceLevel,
      evidenceStrengthLevel: evidenceLevel,
      tags: parsedTags.length > 0 ? parsedTags : ['workflow', 'operations'],
      sourceUrl: sourceUrl.trim() || undefined,
      officialWebsite: officialWebsite.trim() || undefined,
      referenceLinks: referenceLinksText.split('\n').map(s => s.trim()).filter(Boolean),
      sourceName: sourceName.trim() || undefined,
      sourceType: sourceType.trim() || undefined,
      dateObserved: dateObserved.trim() || today,
      createdDate: initialPathway?.createdDate || today,
      updatedDate: today,
      isArchived: initialPathway?.isArchived || false
    };

    onSave(pathway);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 my-6 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-xs">
                <GitBranch className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isEditing ? `Edit Pathway: ${name}` : 'Add Work-Relevant Pathway'}
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Captures structured, day-to-day execution units: inputs, outputs, deliverables, required skills, and tools.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Classification & Core Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
              1. Pathway Identity & Classification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Pathway Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Feature Delivery & Production Engineering Lifecycle"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Pathway Type *</label>
                <select
                  value={pathwayType}
                  onChange={(e) => setPathwayType(e.target.value as PathwayType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  {PATHWAY_TYPES_LIST.map(t => (
                    <option key={t} value={t}>{t} ({PATHWAY_TYPE_CONFIG[t]?.description?.slice(0, 45)}...)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Parent Role *</label>
                <select
                  value={parentRole}
                  onChange={(e) => setParentRole(e.target.value as RoleCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  {CANONICAL_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Domain *</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as SectorDomain)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  {CANONICAL_DOMAINS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Function Area *</label>
                <select
                  value={functionArea}
                  onChange={(e) => setFunctionArea(e.target.value as PathwayFunction)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  {ALL_FUNCTIONS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Work Type *</label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value as PathwayWorkType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  {ALL_WORK_TYPES.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Narrative & Purpose */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
              2. Description, Objective & Trigger
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed"
                  placeholder="Concise overview of what this pathway accomplishes..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Objective *</label>
                  <input
                    type="text"
                    required
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    placeholder="e.g. Deliver resilient, zero-downtime production features."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Trigger / When it is used *</label>
                  <input
                    type="text"
                    required
                    value={triggerWhenUsed}
                    onChange={(e) => setTriggerWhenUsed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    placeholder="e.g. Triggered at sprint kickoff upon approved PRD."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Inputs, Outputs & Deliverables */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
              3. Inputs, Outputs & Tangible Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Inputs (comma-separated)</label>
                <input
                  type="text"
                  value={inputsText}
                  onChange={(e) => setInputsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="PRD, OpenAPI Spec, Architecture Decision Record"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Outputs (comma-separated)</label>
                <input
                  type="text"
                  value={outputsText}
                  onChange={(e) => setOutputsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="Merged PR, Passing CI, Production Deployment"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Deliverables (comma-separated)</label>
                <input
                  type="text"
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="Production Pull Request, OpenAPI 3.1 Contract, Zero-Downtime Migration"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Skills, Tools & Ecosystem */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
              4. Skills, Tools & Ecosystem Connections
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="Git Branching, REST APIs, Database Migrations, Observability"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Tools / Platforms (comma-separated)</label>
                <input
                  type="text"
                  value={toolsText}
                  onChange={(e) => setToolsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="Git, Docker, PostgreSQL, Prisma, Vitest, Datadog"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Knowledge Sources (comma-separated)</label>
                <input
                  type="text"
                  value={knowledgeSourcesText}
                  onChange={(e) => setKnowledgeSourcesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="RFC specifications, Internal Engineering SOPs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Related Frameworks (comma-separated)</label>
                <input
                  type="text"
                  value={frameworksText}
                  onChange={(e) => setFrameworksText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="Agile Scrum, DORA metrics, Twelve-Factor App"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Related Projects (comma-separated)</label>
                <input
                  type="text"
                  value={projectsText}
                  onChange={(e) => setProjectsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="Payment gateway overhaul, Multi-tenant migration"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Related Job Opportunities (comma-separated)</label>
                <input
                  type="text"
                  value={jobOpportunitiesText}
                  onChange={(e) => setJobOpportunitiesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="Senior Backend Engineer, Staff Platform Engineer"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Difficulty, Seniority & Evidence */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
              5. Calibration & Evidence Proof
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Difficulty / Complexity</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as PathwayDifficulty)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as PathwayDifficulty[]).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Evidence Level</label>
                <select
                  value={evidenceLevel}
                  onChange={(e) => setEvidenceLevel(Number(e.target.value) as EvidenceStrengthLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  <option value={1}>Level 1: Foundational / Theoretical</option>
                  <option value={2}>Level 2: Applied / Coursework</option>
                  <option value={3}>Level 3: Verified Professional Project</option>
                  <option value={4}>Level 4: Production Enterprise Output</option>
                  <option value={5}>Level 5: Authoritative Standard</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Seniority Relevance (select all that apply)</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {ALL_SENIORITIES.map(s => {
                    const active = seniorityRelevance.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSeniority(s)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          active 
                            ? 'bg-indigo-700 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="production, devops, database, backend"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Source & Attribution URLs */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
              6. Source Attribution & Reference Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Official Website / Documentation</label>
                <input
                  type="url"
                  value={officialWebsite}
                  onChange={(e) => setOfficialWebsite(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="https://engineering.org/sops/..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Source URL / Code Repository</label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Additional Reference Links (one per line)</label>
                <textarea
                  rows={2}
                  value={referenceLinksText}
                  onChange={(e) => setReferenceLinksText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                  placeholder="https://martinfowler.com/...\nhttps://kubernetes.io/docs/..."
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Update Pathway' : 'Save Pathway'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
