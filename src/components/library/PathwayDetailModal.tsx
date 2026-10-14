import React, { useState } from 'react';
import { 
  WorkRelevantPathway, 
  PATHWAY_TYPE_CONFIG,
  PathwayStepActivity,
  PathwayDeliverable,
  PathwayConnectedSkill
} from '../../features/knowledge/types/workPathways';
import { resolveProvenance } from '../../features/knowledge/types/provenance';
import { ProvenanceBadge, ProvenanceAuditSection } from './ProvenanceBadge';
import { 
  X, 
  GitBranch, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Briefcase, 
  ShieldCheck, 
  Copy, 
  Check, 
  Building2, 
  FileCode, 
  Wrench, 
  AlertTriangle,
  ArrowRight,
  Target,
  ExternalLink,
  Workflow,
  Edit3,
  Archive,
  Trash2,
  FileText,
  Compass,
  Cpu,
  Award
} from 'lucide-react';
import { getEvidenceStrengthDefinition } from '../../features/sources/taxonomy';

interface PathwayDetailModalProps {
  pathway: WorkRelevantPathway;
  onClose: () => void;
  onEdit?: (pathway: WorkRelevantPathway) => void;
  onDuplicate?: (pathway: WorkRelevantPathway) => void;
  onArchive?: (pathway: WorkRelevantPathway) => void;
  onDelete?: (id: string) => void;
}

export type PathwayDetailTab =
  | 'capabilities'
  | 'technical_operational'
  | 'experience'
  | 'career_os'
  | 'sources';

export const PathwayDetailModal: React.FC<PathwayDetailModalProps> = ({ 
  pathway, 
  onClose,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<PathwayDetailTab>('capabilities');
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const typeConfig = PATHWAY_TYPE_CONFIG[pathway.pathwayType || 'Workstream'] || {
    label: pathway.pathwayType || 'Workstream',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  };

  const strengthDef = getEvidenceStrengthDefinition(pathway.evidenceLevel || pathway.evidenceStrengthLevel || 4);
  const activities = pathway.activities || pathway.stages || [];
  const currentStep: PathwayStepActivity | undefined = activities[activeStepIndex] || activities[0];
  const provenance = pathway.provenance || resolveProvenance(pathway);

  const pathwayName = pathway.name || pathway.title || 'Untitled Pathway';
  const roleName = pathway.parentRole || pathway.role || 'Software Engineering';
  const description = pathway.description || pathway.summary || '';

  const handleCopySpec = () => {
    const text = `PATHWAY: ${pathwayName} (${pathway.codeName})\nPARENT ROLE: ${roleName}\nTYPE: ${typeConfig.label}\nDOMAIN: ${pathway.domain}\n\n[CAPABILITY SUMMARY]\n- Objective: ${pathway.objective}\n- Trigger: ${pathway.triggerWhenUsed}\n\nSTAGES / ACTIVITIES:\n` +
      activities.map(s => `${s.stepNumber}. ${s.title} (${s.phase || 'Execution'}):\n  - Actions: ${s.whatProfessionalsDo}\n  - Tools: ${s.toolsAndPlatforms.join(', ')}\n  - Deliverable: ${s.deliverable}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* ============================================================ */}
        {/* EDITORIAL HEADER                                             */}
        {/* ============================================================ */}
        <div className="p-6 border-b border-slate-100 bg-linear-to-b from-slate-50/90 to-white flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${typeConfig.badgeColor}`}>
                {typeConfig.label}
              </span>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {roleName}
              </span>
              {pathway.domain && (
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                  {pathway.domain}
                </span>
              )}
              {pathway.difficulty && (
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                  {pathway.difficulty}
                </span>
              )}
              <ProvenanceBadge provenance={provenance} size="sm" />
              <span className="text-xs text-slate-400 font-mono font-bold">
                {pathway.codeName}
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {pathwayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-start shrink-0">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(pathway)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Edit Pathway"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>Edit</span>
              </button>
            )}

            {onDuplicate && (
              <button
                type="button"
                onClick={() => onDuplicate(pathway)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Duplicate Record"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Duplicate</span>
              </button>
            )}

            {onArchive && (
              <button
                type="button"
                onClick={() => onArchive(pathway)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Archive / Unarchive"
              >
                <Archive className="w-3.5 h-3.5 text-slate-600" />
                <span>{pathway.isArchived ? 'Unarchive' : 'Archive'}</span>
              </button>
            )}

            <button
              onClick={handleCopySpec}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Objective & Trigger Context Banner */}
        <div className="px-6 py-3 bg-linear-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border-b border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-indigo-950">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600 shrink-0" />
            <span><strong className="text-indigo-900 font-bold">Objective:</strong> {pathway.objective}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-slate-600">
            <span className="font-bold text-slate-700">Trigger:</span>
            <span className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">{pathway.triggerWhenUsed}</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* EDITORIAL NAVIGATION TABS                                    */}
        {/* ============================================================ */}
        <div className="flex items-center gap-1 px-6 pt-2.5 border-b border-slate-200 bg-white overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('capabilities')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'capabilities'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>[Capability Summary]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('technical_operational')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'technical_operational'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>[Technical & Operational]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'experience'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>[Experience & Deliverables]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('career_os')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'career_os'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>[Career OS Connections]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sources'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>[Sources & Provenance]</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB BODIES                                                   */}
        {/* ============================================================ */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* 1. [Capability Summary] */}
          {activeTab === 'capabilities' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-linear-to-r from-blue-50/70 to-indigo-50/40 border border-blue-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-700" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-950">
                    Pathway Mandate & Operating Scope
                  </h4>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  {pathway.description || pathway.summary}
                </p>
                {pathway.scopeClarification && (
                  <div className="pt-2 border-t border-blue-200/60 text-xs text-blue-900">
                    <strong className="font-bold">Scope Boundary:</strong> {pathway.scopeClarification}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Functional Area</span>
                  <p className="font-bold text-slate-800">{pathway.function || 'Core Operations'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Work Type</span>
                  <p className="font-bold text-slate-800">{pathway.workType || 'Execution & Delivery'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Target Seniority</span>
                  <p className="font-bold text-blue-700">{(pathway.seniorityRelevance || ['Mid-Level', 'Senior']).join(', ')}</p>
                </div>
              </div>

              {pathway.organizationalOperations && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <span>Organizational Governance & Operations</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {pathway.organizationalOperations}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. [Technical & Operational] Activities & Steps */}
          {activeTab === 'technical_operational' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-blue-600" />
                  <span>Activity & Execution Ledger ({activities.length} Stages)</span>
                </h4>
                <span className="text-xs text-slate-400 font-medium">Click step to inspect operational actions</span>
              </div>

              {/* Step Navigation Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activities.map((step, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepIndex === idx
                        ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Stage {step.stepNumber}</span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{step.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Step Operational Spec */}
              {currentStep && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                        Stage {currentStep.stepNumber} • {currentStep.phase || 'Execution Phase'}
                      </span>
                      <h3 className="text-base font-black text-slate-900">{currentStep.title}</h3>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                        What Professionals Do Day-to-Day
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        {currentStep.whatProfessionalsDo}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tools & Platforms Used</span>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {currentStep.toolsAndPlatforms.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-slate-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Deliverable Produced</span>
                        <p className="font-bold text-slate-900 pt-0.5">{currentStep.deliverable}</p>
                      </div>
                    </div>

                    {currentStep.emergingInnovations && (
                      <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 space-y-1">
                        <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span>AI & Emerging Automation in this Step</span>
                        </span>
                        <p className="font-medium text-[11px]">{currentStep.emergingInnovations}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. [Experience & Deliverables] Inputs & Deliverables */}
          {activeTab === 'experience' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Inputs */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span>Required Inputs & Upstream Triggers</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(pathway.inputs || ['Technical Specification', 'Product Requirements', 'Architecture Approval']).map((inp, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>{inp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concrete Deliverables */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-600" />
                  <span>Concrete Deliverables & Artifacts</span>
                </h4>
                <div className="space-y-2.5">
                  {(pathway.deliverables || pathway.deliverablesAndArtifacts || []).map((del, idx) => {
                    const isObj = typeof del === 'object' && del !== null;
                    const title = isObj ? (del as PathwayDeliverable).title : String(del);
                    const desc = isObj ? (del as PathwayDeliverable).description : 'Structured production deliverable produced within this pathway.';
                    const format = isObj ? (del as PathwayDeliverable).format : 'Document / Code Repository';

                    return (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{title}</span>
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {format}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. [Career OS Connections] */}
          {activeTab === 'career_os' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-xs text-blue-950 font-medium">
                <strong>Execution Graph:</strong> This pathway translates role expectations into direct skill proofs and interview signals.
              </div>

              {/* Skills */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Required Skills & Proficiency Calibration</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(pathway.requiredSkills || pathway.connectedSkills || []).map((skill, idx) => {
                    const isObj = typeof skill === 'object' && skill !== null;
                    const name = isObj ? (skill as PathwayConnectedSkill).name : String(skill);
                    const prof = isObj ? (skill as PathwayConnectedSkill).proficiency : 'Practitioner';

                    return (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                        <span className="font-bold text-slate-800">{name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          {prof}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tools & Platforms */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-slate-600" />
                  <span>Tools & Platforms</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {pathway.toolsAndPlatforms.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Frameworks & Projects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Related Frameworks</span>
                  <p className="font-bold text-slate-800">{(pathway.relatedFrameworks || ['Agile Scrum', 'CI/CD Best Practices']).join(', ')}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Related Job Opportunities</span>
                  <p className="font-bold text-blue-700">{(pathway.relatedJobOpportunities || [`Senior ${roleName}`]).join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. [Sources & Provenance] */}
          {activeTab === 'sources' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <ProvenanceAuditSection provenance={provenance} />

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Knowledge Sources & Documentation</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {pathway.sourceUrl && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Source URL</span>
                        <a 
                          href={pathway.sourceUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="font-mono text-blue-700 hover:underline break-all font-bold"
                        >
                          {pathway.sourceUrl}
                        </a>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                    </div>
                  )}

                  {pathway.knowledgeSources && pathway.knowledgeSources.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Curated Literature & Specs</span>
                      {pathway.knowledgeSources.map((ks, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 font-medium text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{ks}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ============================================================ */}
        {/* MODAL FOOTER                                                 */}
        {/* ============================================================ */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">Parent Role: {roleName}</span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-emerald-700">Evidence Level {pathway.evidenceLevel || pathway.evidenceStrengthLevel || 4}</span>

            {onDelete && (
              <>
                <span className="text-slate-300">•</span>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-700 font-bold">Confirm delete?</span>
                    <button
                      type="button"
                      onClick={() => onDelete(pathway.id)}
                      className="px-2 py-0.5 rounded-md bg-red-600 text-white font-bold cursor-pointer"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="text-red-600 hover:text-red-800 font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(pathway)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Pathway</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xs cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
