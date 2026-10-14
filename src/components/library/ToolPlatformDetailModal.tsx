import React, { useState } from 'react';
import { 
  ToolPlatformEntry, 
  TOOL_CATEGORY_CONFIG,
  TOOL_VERSION_STATUS_CONFIG 
} from '../../features/knowledge/types/toolsPlatforms';
import { resolveProvenance } from '../../features/knowledge/types/provenance';
import { ProvenanceBadge, ProvenanceAuditSection } from './ProvenanceBadge';
import { 
  X, 
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
  Database, 
  Cable, 
  Monitor, 
  Users, 
  Sparkles, 
  Compass, 
  Clock, 
  HardDrive,
  Cpu,
  History,
  Edit3,
  Copy as CopyIcon,
  Archive,
  Trash2,
  Globe,
  FileText,
  Code,
  Layers,
  Check
} from 'lucide-react';

interface ToolPlatformDetailModalProps {
  tool: ToolPlatformEntry;
  onClose: () => void;
  onEdit?: (tool: ToolPlatformEntry) => void;
  onDuplicate?: (tool: ToolPlatformEntry) => void;
  onArchive?: (tool: ToolPlatformEntry) => void;
  onDelete?: (toolId: string) => void;
}

export type ToolDetailTab = 
  | 'capabilities'
  | 'technical_operational'
  | 'experience'
  | 'career_os'
  | 'sources';

export const ToolPlatformDetailModal: React.FC<ToolPlatformDetailModalProps> = ({
  tool,
  onClose,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<ToolDetailTab>('capabilities');
  const [copiedLink, setCopiedLink] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const catConfig = TOOL_CATEGORY_CONFIG[tool.category] || {
    label: tool.category,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  };

  const statusConfig = TOOL_VERSION_STATUS_CONFIG[tool.status] || {
    label: tool.status,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const cap = tool.capabilitiesSummary;
  const provenance = tool.provenance || resolveProvenance(tool);

  const handleCopySummary = () => {
    const text = `TOOL: ${tool.name}\nCOMPANY/PROVIDER: ${tool.companyProvider}\nVERSION: ${tool.version || '1.0'}\nSTATUS: ${tool.status}\nOFFICIAL WEBSITE: ${tool.officialWebsite || tool.productUrl || 'N/A'}\n\n[CAPABILITY SUMMARY]\n- Philosophy: ${cap.productPhilosophy}\n- How It Works: ${cap.howItWorks}\n- Key Capacities: ${cap.keyCapacities.join('; ')}\n\n[TECHNICAL & OPERATIONAL]\n- Storage & Data Model: ${cap.usageAndStorage.dataModel} (${cap.usageAndStorage.environment})\n- Hosting: ${cap.usageAndStorage.hosting}\n- Integrations: ${cap.integrations.nativeIntegrations.join(', ')}`;
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
        {/* EDITORIAL HEADER: Tool Name, Provider, Version, Status, Link */}
        {/* ============================================================ */}
        <div className="p-6 border-b border-slate-100 bg-linear-to-b from-slate-50/90 to-white flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            {/* Metadata Pills & Provenance */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider border ${catConfig.badgeColor}`}>
                {catConfig.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {tool.subcategory}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider border ${statusConfig.badgeColor}`}>
                {statusConfig.label}
              </span>
              {tool.version && (
                <span className="text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                  v{tool.version}
                </span>
              )}
              {/* Provenance Badge */}
              <ProvenanceBadge provenance={provenance} size="sm" />
              {tool.isArchived && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700">
                  Archived
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {tool.name}
                </h1>
                <span className="text-sm font-bold text-slate-500">
                  by <strong className="text-slate-800">{tool.companyProvider}</strong>
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {tool.tagline}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start">
            {tool.officialWebsite && (
              <a
                href={tool.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Official Website</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(tool)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Edit Tool"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>Edit</span>
              </button>
            )}

            {onDuplicate && (
              <button
                type="button"
                onClick={() => onDuplicate(tool)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Duplicate Record"
              >
                <CopyIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>Duplicate</span>
              </button>
            )}

            {onArchive && (
              <button
                type="button"
                onClick={() => onArchive(tool)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Archive / Unarchive"
              >
                <Archive className="w-3.5 h-3.5 text-slate-600" />
                <span>{tool.isArchived ? 'Unarchive' : 'Archive'}</span>
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
            <span className="font-semibold text-slate-700">Domain: <strong className="text-slate-900">{tool.primaryDomain}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">Hosting: <strong className="text-slate-900">{cap.usageAndStorage.hosting}</strong> ({cap.usageAndStorage.environment})</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">License: <strong className="text-blue-700">{tool.pricingModel}</strong></span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Observed: {tool.observedDate || tool.lastUpdated}
          </div>
        </div>

        {/* ============================================================ */}
        {/* STRUCTURED EDITORIAL TAB NAVIGATION                          */}
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
            <Sparkles className="w-3.5 h-3.5" />
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
            <Database className="w-3.5 h-3.5" />
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
            <span>[Experience]</span>
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
        {/* TAB BODIES (Structured Editorial Layout)                     */}
        {/* ============================================================ */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ------------------------------------------------------------ */}
          {/* 1. [Capability Summary]                                      */}
          {/* Key Capacities, How It Works, Product Philosophy              */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'capabilities' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Product Philosophy */}
              <div className="p-5 rounded-2xl bg-linear-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-700" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-950">
                    Product Philosophy
                  </h4>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  "{cap.productPhilosophy}"
                </p>
              </div>

              {/* How It Works */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    How It Works (Operating Mechanism & Architecture)
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {cap.howItWorks}
                </p>
              </div>

              {/* Key Capacities */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Key Capacities ({cap.keyCapacities.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">Core platform strengths</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cap.keyCapacities.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200 flex items-start gap-2.5 shadow-2xs hover:border-blue-300 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 2. [Technical & Operational]                                 */}
          {/* Usage / Storage, Integrations, APIs, Infrastructure           */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'technical_operational' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Usage / Storage & Infrastructure */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Infrastructure, Storage & Data Model
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Data Model</span>
                    <p className="font-bold text-slate-800">{cap.usageAndStorage.dataModel}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Storage Model</span>
                    <p className="font-bold text-slate-800">{cap.usageAndStorage.storageModel}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hosting / Deployment</span>
                    <p className="font-bold text-slate-800">{cap.usageAndStorage.hosting}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Usage Model</span>
                    <p className="font-bold text-slate-800">{cap.usageAndStorage.usageModel}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Resource Limits</span>
                    <p className="font-bold text-slate-800">{cap.usageAndStorage.limits}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Data Retention & Governance</span>
                    <p className="font-bold text-slate-800">{cap.usageAndStorage.dataRetention}</p>
                  </div>
                </div>
              </div>

              {/* Integrations & APIs */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Cable className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    APIs, SDKs & Native Integrations
                  </h4>
                </div>

                <div className="space-y-4 text-xs">
                  {/* APIs & SDKs */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">APIs & Protocols</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cap.integrations.apis.map((api, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[11px] font-bold">
                          {api}
                        </span>
                      ))}
                      {cap.integrations.sdks.map((sdk, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono text-[11px] font-bold">
                          SDK: {sdk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Native Integrations */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Native Integrations & Connectors</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cap.integrations.nativeIntegrations.map((item, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Webhooks & MCP Support */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Webhooks & Streaming</span>
                      <p className="font-semibold text-slate-800">{cap.integrations.webhooks}</p>
                    </div>
                    {cap.integrations.mcpSupport && (
                      <div className="p-3 rounded-xl bg-purple-50 border border-purple-200/80 space-y-1">
                        <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">Model Context Protocol (MCP)</span>
                        <p className="font-bold text-purple-950">{cap.integrations.mcpSupport}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 3. [Experience]                                              */}
          {/* User Experiences, Best Suited For, Supporting Features        */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'experience' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* User Experiences */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    User Experiences & Surface Modalities
                  </h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex flex-wrap gap-2">
                    {cap.userExperiences.primaryInteractions.map((ux, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                        {ux}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {cap.userExperiences.details}
                  </p>
                </div>
              </div>

              {/* Best Suited For */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Best Suited For & Ideal Profiles
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Target Teams & Users</span>
                    <p className="font-bold text-slate-800">{cap.bestSuitedFor.userTypes.join(', ')}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Technical Proficiency Level</span>
                    <p className="font-bold text-blue-700">{cap.bestSuitedFor.technicalLevel}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Primary Use Cases</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cap.bestSuitedFor.useCases.map((uc, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-700">
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Supporting Features */}
              {cap.otherSupportingFeatures && cap.otherSupportingFeatures.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Supporting Features & Secondary Affordances
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {cap.otherSupportingFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 4. [Career OS Connections]                                   */}
          {/* Relevant Roles, Work Pathways, Skills, Projects, Innovations */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'career_os' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-xs text-blue-950 font-medium">
                <strong>Execution Graph:</strong> This tool directly connects into Career OS roles, execution pathways, and validated skill proofs.
              </div>

              {/* Relevant Roles */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Relevant Roles in Career OS</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tool.relevantRoles.map((role, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Pathways */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-indigo-600" />
                  <span>Work-Relevant Pathways ({tool.relatedWorkPathways.length})</span>
                </h4>
                <div className="space-y-2">
                  {tool.relatedWorkPathways.map((pathway, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{pathway}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Operational Workflow
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Required & Connected Skills</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tool.relatedSkills.map((skill, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{skill.name}</span>
                        {skill.category && <span className="text-[10px] text-slate-400">{skill.category}</span>}
                      </div>
                      {skill.proficiency && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {skill.proficiency}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 5. [Sources & Provenance]                                    */}
          {/* Official Website, Documentation, References, Observed Date   */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'sources' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Provenance Audit Section */}
              <ProvenanceAuditSection provenance={provenance} />

              {/* Source URLs & Documentation */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Documentation & External References</span>
                </h4>

                <div className="space-y-2.5 text-xs">
                  {tool.officialWebsite && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Website</span>
                        <a 
                          href={tool.officialWebsite} 
                          target="_blank" 
                          rel="noreferrer"
                          className="font-mono text-blue-700 hover:underline break-all font-bold"
                        >
                          {tool.officialWebsite}
                        </a>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                    </div>
                  )}

                  {tool.productUrl && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Product / Docs Portal</span>
                        <a 
                          href={tool.productUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="font-mono text-indigo-700 hover:underline break-all font-bold"
                        >
                          {tool.productUrl}
                        </a>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                    </div>
                  )}

                  {tool.referenceLinks && tool.referenceLinks.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Reference Links</span>
                      {tool.referenceLinks.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="font-mono text-[11px] text-slate-600 hover:underline break-all"
                          >
                            {link}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Version History Log */}
              {tool.versionHistory && tool.versionHistory.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Version History & Preserved State
                  </h4>
                  <div className="space-y-2">
                    {tool.versionHistory.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-slate-800">v{item.version}</span>
                          <span className="text-[10px] text-slate-500 block">{item.notes}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{item.observedDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ============================================================ */}
        {/* MODAL FOOTER                                                 */}
        {/* ============================================================ */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="text-slate-500 flex items-center gap-2">
              <span className="font-bold text-slate-700">Provider:</span> {tool.companyProvider}
              <span className="text-slate-300">•</span>
              <span className="font-bold text-slate-700">Model:</span> {tool.pricingModel}
            </div>

            {onDelete && (
              <>
                <span className="text-slate-300">•</span>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-700 font-bold">Confirm delete?</span>
                    <button
                      type="button"
                      onClick={() => onDelete(tool.id)}
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
                onClick={() => onEdit(tool)}
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
