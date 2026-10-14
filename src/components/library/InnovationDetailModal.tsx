import React, { useState } from 'react';
import { 
  InnovationSystemEntry, 
  INNOVATION_TYPE_CONFIG,
  TRANSFORMATION_DIMENSION_CONFIG 
} from '../../features/knowledge/types/innovationSystems';
import { resolveProvenance } from '../../features/knowledge/types/provenance';
import { ProvenanceBadge, ProvenanceAuditSection } from './ProvenanceBadge';
import { 
  X, 
  Sparkles, 
  Layers, 
  Wrench, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  ArrowRight, 
  Building2, 
  TrendingUp, 
  Workflow, 
  ShieldCheck, 
  Zap, 
  Lightbulb, 
  Compass, 
  FileText,
  Boxes,
  Cpu,
  Repeat,
  Edit3,
  Archive,
  Trash2,
  Check,
  Globe
} from 'lucide-react';

interface InnovationDetailModalProps {
  innovation?: InnovationSystemEntry;
  entry?: InnovationSystemEntry;
  onClose: () => void;
  onEdit?: (entry: InnovationSystemEntry) => void;
  onDuplicate?: (entry: InnovationSystemEntry) => void;
  onArchive?: (entry: InnovationSystemEntry) => void;
  onDelete?: (id: string) => void;
}

export type InnovationDetailTab =
  | 'capabilities'
  | 'technical_operational'
  | 'experience'
  | 'career_os'
  | 'sources';

export const InnovationDetailModal: React.FC<InnovationDetailModalProps> = ({
  innovation: innovationProp,
  entry: entryProp,
  onClose,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete
}) => {
  const innovation = (entryProp || innovationProp)!;
  const [activeTab, setActiveTab] = useState<InnovationDetailTab>('capabilities');
  const [copiedLink, setCopiedLink] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const typeConfig = INNOVATION_TYPE_CONFIG[innovation.innovationType] || {
    label: innovation.innovationType,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  };

  const provenance = innovation.provenance || resolveProvenance(innovation);

  const handleCopySummary = () => {
    const text = `INNOVATION: ${innovation.name}\nTYPE: ${innovation.innovationType}\nDOMAIN: ${innovation.domain}\nINDUSTRY: ${innovation.industry}\n\n[CAPABILITY SUMMARY]\n- Core Innovation: ${innovation.coreInnovation}\n- Problem Solved: ${innovation.problemSolved}\n- Differentiation: ${innovation.differentiation}\n- Transformative Potential: ${innovation.transformativePotential}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================ */}
        {/* EDITORIAL HEADER                                             */}
        {/* ============================================================ */}
        <div className="p-6 border-b border-slate-100 bg-linear-to-b from-slate-50/90 to-white flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider border ${typeConfig.badgeColor}`}>
                {typeConfig.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {innovation.currentStage}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider border ${
                innovation.status === 'Disruptive'
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : innovation.status === 'Mainstream'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                {innovation.status}
              </span>
              <ProvenanceBadge provenance={provenance} size="sm" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {innovation.name}
              </h1>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {innovation.shortDescription}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start">
            {innovation.officialWebsite && (
              <a
                href={innovation.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Official Link</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(innovation)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Edit Innovation"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>Edit</span>
              </button>
            )}

            {onDuplicate && (
              <button
                type="button"
                onClick={() => onDuplicate(innovation)}
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
                onClick={() => onArchive(innovation)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Archive / Unarchive"
              >
                <Archive className="w-3.5 h-3.5 text-slate-600" />
                <span>{innovation.isArchived ? 'Unarchive' : 'Archive'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Context Sub-Banner */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-600">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-slate-700">Domain: <strong className="text-purple-700 uppercase tracking-wider">{innovation.domain}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">Industry: <strong className="text-slate-900">{innovation.industry}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">Stage: <strong className="text-indigo-700">{innovation.currentStage}</strong></span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Observed: {innovation.dateObserved}
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
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>[Capability Summary]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('technical_operational')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'technical_operational'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>[Technical & Operational]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'experience'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>[Experience & Business Model]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('career_os')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'career_os'
                ? 'border-purple-600 text-purple-700'
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
                ? 'border-purple-600 text-purple-700'
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

          {/* 1. [Capability Summary / Paradigm Shift] */}
          {activeTab === 'capabilities' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-linear-to-r from-purple-50/70 via-indigo-50/40 to-slate-50 border border-purple-200/80 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-700" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-purple-950">
                    Core Innovation & Paradigm Shift
                  </h4>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  "{innovation.coreInnovation}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Problem Solved</span>
                  <p className="font-semibold text-slate-800 leading-relaxed">{innovation.problemSolved}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Existing Alternatives (Before)</span>
                  <p className="font-semibold text-slate-800 leading-relaxed">{innovation.existingAlternative}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Defensible Differentiation</span>
                  <p className="font-semibold text-slate-800 leading-relaxed">{innovation.differentiation}</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">Transformative Potential</span>
                  <p className="font-semibold text-purple-950 leading-relaxed">{innovation.transformativePotential}</p>
                </div>
              </div>

              {/* Transformation Dimensions */}
              {innovation.transformationDimensions && innovation.transformationDimensions.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Impacted Transformation Dimensions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {innovation.transformationDimensions.map((dim, idx) => {
                      const cfg = TRANSFORMATION_DIMENSION_CONFIG[dim] || { label: dim, chipColor: 'bg-slate-100 text-slate-800 border-slate-200' };
                      return (
                        <span key={idx} className={`px-3 py-1 rounded-xl text-xs font-bold border ${cfg.chipColor}`}>
                          {cfg.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. [Technical & Operational] */}
          {activeTab === 'technical_operational' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* How It Works */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>How It Works (Operating Mechanism)</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {innovation.howItWorks}
                </p>
              </div>

              {/* Product & System Architecture */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Product & System Architecture</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {innovation.productSystemArchitecture}
                </p>
              </div>

              {/* Key Technologies */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Key Technologies & Foundation Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {innovation.keyTechnologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. [Experience & Business Model] */}
          {activeTab === 'experience' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">User Experience Paradigm</span>
                  <p className="font-medium text-slate-700 leading-relaxed">{innovation.userExperience}</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Target Users</span>
                  <p className="font-medium text-slate-700 leading-relaxed">{innovation.targetUsers}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Business Model</span>
                  <p className="font-medium text-slate-700 leading-relaxed">{innovation.businessModel}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Distribution Strategy</span>
                  <p className="font-medium text-slate-700 leading-relaxed">{innovation.distributionModel}</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. [Career OS Connections] */}
          {activeTab === 'career_os' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70 text-xs text-purple-950 font-medium">
                <strong>Future Layer Graph:</strong> Connects emerging market innovations to next-generation job roles, required frontier skills, and modern work pathways.
              </div>

              {/* Relevant Roles */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>Connected Career OS Roles</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {innovation.relevantRoles.map((role, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Pathways */}
              {innovation.relatedWorkPathways && innovation.relatedWorkPathways.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4 text-indigo-600" />
                    <span>Work-Relevant Pathways Impacted</span>
                  </h4>
                  <div className="space-y-2">
                    {innovation.relatedWorkPathways.map((pathway, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                        {pathway}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Skills */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Frontier Skills Required</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {innovation.relatedSkills.map((skill, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                      <span className="font-bold text-slate-800">{skill.name}</span>
                      {skill.proficiency && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                          {skill.proficiency}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Tools */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-slate-600" />
                  <span>Related Tools & Platforms</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {innovation.relatedToolsPlatforms.map((t, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                      {t}
                    </span>
                  ))}
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
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Official Research Papers & Documentation</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {innovation.officialWebsite && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Website</span>
                        <a 
                          href={innovation.officialWebsite} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="font-mono text-purple-700 hover:underline break-all font-bold"
                        >
                          {innovation.officialWebsite}
                        </a>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                    </div>
                  )}

                  {innovation.relatedKnowledgeSources && innovation.relatedKnowledgeSources.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Knowledge Sources & Whitepapers</span>
                      {innovation.relatedKnowledgeSources.map((ks, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{ks.title} ({ks.type})</span>
                          {ks.url && (
                            <a href={ks.url} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline inline-flex items-center gap-1 text-[11px]">
                              <span>Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
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
            <span className="font-bold text-slate-700">Type: {innovation.innovationType}</span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-purple-700">{innovation.domain}</span>

            {onDelete && (
              <>
                <span className="text-slate-300">•</span>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-700 font-bold">Confirm delete?</span>
                    <button
                      type="button"
                      onClick={() => onDelete(innovation.id)}
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
                onClick={() => onEdit(innovation)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Innovation</span>
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
