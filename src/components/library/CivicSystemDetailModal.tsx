import React, { useState } from 'react';
import { 
  CivicSystemEntry, 
  CIVIC_ENTITY_TYPE_CONFIG 
} from '../../features/knowledge/types/civicSystems';
import { resolveProvenance } from '../../features/knowledge/types/provenance';
import { ProvenanceBadge, ProvenanceAuditSection } from './ProvenanceBadge';
import { 
  X, 
  Building2, 
  Globe2, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Wrench, 
  FileText, 
  Users, 
  Sparkles, 
  Workflow, 
  Briefcase, 
  Award,
  Landmark,
  Copy,
  TrendingUp,
  Scale,
  Edit3,
  Archive,
  Trash2,
  Check,
  Compass,
  Cpu,
  Globe
} from 'lucide-react';

interface CivicSystemDetailModalProps {
  system: CivicSystemEntry;
  onClose: () => void;
  onEdit?: (system: CivicSystemEntry) => void;
  onDuplicate?: (system: CivicSystemEntry) => void;
  onArchive?: (system: CivicSystemEntry) => void;
  onDelete?: (id: string) => void;
}

export type CivicDetailTab =
  | 'capabilities'
  | 'technical_operational'
  | 'experience'
  | 'career_os'
  | 'sources';

export const CivicSystemDetailModal: React.FC<CivicSystemDetailModalProps> = ({
  system,
  onClose,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<CivicDetailTab>('capabilities');
  const [copiedLink, setCopiedLink] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const typeConfig = CIVIC_ENTITY_TYPE_CONFIG[system.entityType] || {
    label: system.entityType,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200'
  };

  const provenance = system.provenance || resolveProvenance(system);

  const handleCopySpec = () => {
    const text = `PUBLIC SYSTEM: ${system.name}\nENTITY TYPE: ${system.entityType}\nREGION: ${system.countryRegion}\nDOMAIN: ${system.domain}\n\n[CAPABILITY SUMMARY]\n- Mission: ${system.missionPurpose}\n- Problem Addressed: ${system.problemAddressed}\n- Target Population: ${system.targetPopulation}\n- Operating Model: ${system.operatingModel}`;
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
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{system.countryRegion}</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider border ${
                system.status === 'Nationwide Scaled' || system.status === 'Global Standard'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                {system.status}
              </span>
              <ProvenanceBadge provenance={provenance} size="sm" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {system.name}
              </h1>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {system.missionPurpose}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start">
            {system.officialWebsite && (
              <a
                href={system.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Official Portal</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(system)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Edit Civic System"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>Edit</span>
              </button>
            )}

            {onDuplicate && (
              <button
                type="button"
                onClick={() => onDuplicate(system)}
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
                onClick={() => onArchive(system)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Archive / Unarchive"
              >
                <Archive className="w-3.5 h-3.5 text-slate-600" />
                <span>{system.isArchived ? 'Unarchive' : 'Archive'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopySpec}
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
            <span className="font-semibold text-slate-700">Domain: <strong className="text-slate-900">{system.domain}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">Target Population: <strong className="text-slate-900">{system.targetPopulation}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">Status: <strong className="text-emerald-700">{system.status}</strong></span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Observed: {system.dateObserved || system.dateTime}
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
            <Cpu className="w-3.5 h-3.5" />
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
            <Users className="w-3.5 h-3.5" />
            <span>[Experience & Governance]</span>
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
              <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-50/70 to-blue-50/40 border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                    Institutional Mission & Public Need
                  </h4>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  "{system.missionPurpose}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Problem Addressed</span>
                  <p className="font-semibold text-slate-800 leading-relaxed">{system.problemAddressed}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Target Population</span>
                  <p className="font-semibold text-slate-800 leading-relaxed">{system.targetPopulation}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Funding & Procurement Model</span>
                  <p className="font-semibold text-slate-800 leading-relaxed">{system.fundingProcurementModel}</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. [Technical & Operational] */}
          {activeTab === 'technical_operational' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Operating Model */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-blue-600" />
                  <span>Operating Model & Execution Mechanics</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {system.operatingModel}
                </p>
              </div>

              {/* Public Services Delivered */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Public Services Delivered ({system.services.length})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {system.services.map((svc, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-bold text-xs text-slate-900 block">{svc.name}</span>
                      <p className="text-[11px] text-slate-600">{svc.description}</p>
                      {svc.deliveryChannel && (
                        <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded-sm border border-slate-200 inline-block mt-1">
                          Channel: {svc.deliveryChannel}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Infrastructure */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>Technology Infrastructure & DPI Foundations</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {system.technologyInfrastructure.map((tech, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 block">{tech.name}</span>
                      <span className="text-[11px] text-slate-600">{tech.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. [Experience & Governance] */}
          {activeTab === 'experience' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Citizen Journey & Governance */}
              {system.systemWorkflowSummary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Citizen / User Journey</span>
                    <p className="font-medium text-slate-700 leading-relaxed">{system.systemWorkflowSummary.citizenJourney}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Governance & Compliance</span>
                    <p className="font-medium text-slate-700 leading-relaxed">{system.systemWorkflowSummary.governanceAndCompliance}</p>
                  </div>
                </div>
              )}

              {/* Stakeholders & Partners */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Stakeholders & Public-Private Partners</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {system.stakeholders.map((sh, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                      <span className="font-bold text-slate-900">{sh.group}</span>
                      <span className="text-[11px] text-slate-600 block">{sh.role}</span>
                    </div>
                  ))}
                  {system.partners.map((p, idx) => (
                    <div key={`p-${idx}`} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-0.5">
                      <span className="font-bold text-emerald-950">{p.name}</span>
                      <span className="text-[11px] text-emerald-800 block">{p.role} ({p.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. [Career OS Connections] */}
          {activeTab === 'career_os' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-xs text-blue-950 font-medium">
                <strong>Execution Graph:</strong> Public systems define massive institutional operational roles, civic tech skills, and procurement frameworks.
              </div>

              {/* Relevant Roles */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Public & Civic Institutional Roles</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {system.relevantRoles.map((role, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Civic Skills */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Civic Tech & Systemic Competencies</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {system.relatedSkills.map((skill, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                      <span className="font-bold text-slate-800">{skill.name}</span>
                      {skill.proficiency && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {skill.proficiency}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Platforms */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-slate-600" />
                  <span>Tools & Platforms Leveraged</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {system.relatedToolsPlatforms.map((t, idx) => (
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
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Official Legislation, Architecture Specs & References</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {system.officialWebsite && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Website</span>
                        <a 
                          href={system.officialWebsite} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="font-mono text-blue-700 hover:underline break-all font-bold"
                        >
                          {system.officialWebsite}
                        </a>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                    </div>
                  )}

                  {system.knowledgeSources && system.knowledgeSources.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Policy & Architecture References</span>
                      {system.knowledgeSources.map((ks, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{ks.title} ({ks.type})</span>
                          {ks.url && (
                            <a href={ks.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1 text-[11px]">
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
            <span className="font-bold text-slate-700">Entity: {system.entityType}</span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-emerald-700">{system.countryRegion}</span>

            {onDelete && (
              <>
                <span className="text-slate-300">•</span>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-700 font-bold">Confirm delete?</span>
                    <button
                      type="button"
                      onClick={() => onDelete(system.id)}
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
                onClick={() => onEdit(system)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
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
