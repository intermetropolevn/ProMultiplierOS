import React from 'react';
import { RoleIntelligenceItem } from '../../features/roleIntelligence/types';
import { 
  ArrowLeft, 
  Target, 
  Sliders, 
  Briefcase, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  Wrench, 
  FileText, 
  Compass, 
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface RoleProfileViewProps {
  role: RoleIntelligenceItem;
  onBack: () => void;
  onNavigateToEvaluation: () => void;
  onNavigateToReadiness: () => void;
  onNavigateToMobility: () => void;
}

export const RoleProfileView: React.FC<RoleProfileViewProps> = ({
  role,
  onBack,
  onNavigateToEvaluation,
  onNavigateToReadiness,
  onNavigateToMobility
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Role Evaluation</span>
          </button>
          
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Role Intelligence</span>
            <span>/</span>
            <span className="font-bold text-slate-800">{role.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToEvaluation}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Evaluate Role Dimensions</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToReadiness}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Role Readiness Fit</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Job Family: <strong className="text-slate-800">{role.jobFamily}</strong></span>
              <span>·</span>
              <span>Domain: <strong className="text-slate-800">{role.domain}</strong></span>
              <span>·</span>
              <span className="text-blue-700 font-bold">{role.levelMapping.levelCode} ({role.currentLevel})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {role.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {role.overview}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Typical Seniority</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{role.typicalSeniority}</span>
            <span className="text-[11px] text-blue-700 font-semibold block mt-0.5">{role.track.toUpperCase()} Track</span>
          </div>
        </div>

        {/* Purpose & Impact Quick Strip */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Role Purpose</span>
            <p className="text-slate-800 font-medium leading-relaxed">{role.rolePurpose}</p>
          </div>

          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Expected Organizational Impact</span>
            <p className="text-slate-800 font-medium leading-relaxed">{role.expectedImpact}</p>
          </div>
        </div>
      </div>

      {/* 3. Visual Relationship Grid: Core Responsibilities, Scope, and Decision Rights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Responsibilities */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Core Responsibilities</span>
          </div>
          <ul className="space-y-2 text-xs">
            {role.coreResponsibilities.map((resp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scope Boundaries */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Organizational Scope</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {role.scope}
          </p>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 font-mono">
            <div>Inferred: {role.levelMapping.levelCode}</div>
            <div>Radford: {role.levelMapping.referenceFrameworkLevels.aonRadford}</div>
          </div>
        </div>

        {/* Decision Rights */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Decision Rights &amp; Authority</span>
          </div>
          <ul className="space-y-2 text-xs">
            {role.decisionRights.map((right, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                <span>{right}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* 4. Capabilities, Knowledge & Behavioral Competencies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Product & Core Skills */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
            Key Technical &amp; Product Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {role.keySkills.map((sk, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Business Domain Knowledge */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
            Business Domain Knowledge
          </span>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {role.businessKnowledge.map((bk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                <span>{bk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Behavioral Competencies */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
            Behavioral Competencies
          </span>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {role.behavioralCompetencies.map((bc, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 mt-1.5" />
                <span>{bc}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* 5. Tools, KPIs, and Typical Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tools & Platforms */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Wrench className="w-4 h-4 text-slate-500" />
            <span>Tools &amp; Platforms</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {role.toolsAndPlatforms.map((tool, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-mono font-medium">
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Common KPIs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Common Success KPIs</span>
          </div>
          <div className="space-y-2 text-xs">
            {role.commonKpis.map((kpi, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{kpi.metric}</span>
                  <span className="text-[10px] text-slate-500">{kpi.targetBenchmark}</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  {kpi.importance}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Typical Deliverables */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Typical Deliverables</span>
          </div>
          <div className="space-y-2 text-xs">
            {role.typicalDeliverables.map((del, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{del.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{del.frequency}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{del.purpose}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Adjacent Roles & Mobility Jump */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Adjacent Roles &amp; Ecosystem Mobility
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct lateral pivots sharing high skill overlap and common bridge competencies.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToMobility}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Mobility Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {role.adjacentRoles.map((adj, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                  {adj.transferability} Transferability
                </span>
                <span className="font-mono text-xs font-bold text-slate-700">
                  {adj.overlapPercentage}% overlap
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">
                {adj.roleTitle}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {adj.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
