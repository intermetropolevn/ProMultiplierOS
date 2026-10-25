import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  GitBranch, 
  Sparkles, 
  ArrowRight,
  Filter,
  Sliders,
  Check
} from 'lucide-react';
import { 
  CareerOSDimensionScore, 
  SupportingWorkInitiative 
} from '../../features/roleIntelligence/types';
import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';

interface SystemEvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dimension: CareerOSDimensionScore | null;
  onNavigateToEvidenceIntelligence?: () => void;
  onUpdateAttribution?: (initiativeId: string, newRole: string) => void;
}

const QUALITY_LADDER_STEPS = [
  { level: 1, label: 'Task Execution', desc: 'Raw ticket completion' },
  { level: 2, label: 'Task + Artifact', desc: 'PRD, RFC, Figma prototype' },
  { level: 3, label: 'Logged Decision', desc: 'Trade-off memo with rationale' },
  { level: 4, label: 'Cross-Func Lead', desc: 'Rallied engineering & design' },
  { level: 5, label: 'Shipped Outcome', desc: 'Live in customer production' },
  { level: 6, label: 'Measured Impact', desc: 'Quantitative telemetry metrics' },
  { level: 7, label: 'Peer Validation', desc: 'Confirmed by squad leads' },
  { level: 8, label: 'Repeated Pattern', desc: 'Sustained across 3+ initiatives' },
];

export const SystemEvidenceDrawer: React.FC<SystemEvidenceDrawerProps> = ({
  isOpen,
  onClose,
  dimension,
  onNavigateToEvidenceIntelligence,
  onUpdateAttribution
}) => {
  const { getIntelligenceAccess } = useAccessControl();
  const [activeAttribution, setActiveAttribution] = useState<{ [id: string]: string }>({
    'init-onboarding-revamp': 'Lead',
    'init-api-v2': 'Contributor'
  });

  if (!isOpen || !dimension) return null;

  const attrAccess = getIntelligenceAccess('capability_attribution');
  const isFull = attrAccess.isFull;

  // Mock sample initiatives if dimension doesn't have custom ones populated
  const allInitiatives: SupportingWorkInitiative[] = dimension.supportingWork && dimension.supportingWork.length > 0 
    ? dimension.supportingWork 
    : [
        {
          initiativeId: 'init-onboarding-revamp',
          initiativeTitle: 'Onboarding Revamp & Self-Serve Conversion',
          activitiesCount: {
            tasks: 14,
            docs: 3,
            meetings: 7,
            experiments: 4,
            outcomes: 2,
            notes: 18
          },
          userContribution: 'Lead',
          attributionConfidence: 'High',
          isSharedAttribution: true,
          attributionNotes: 'Shared ownership with Growth Engineering Lead & Product Designer',
          artifacts: ['PRD: 2-Minute Time-To-Value Funnel', 'Figma Clickable Spec v3', 'SQL Amplitude Cohort Script'],
          observedOutcomes: ['+34% Day-1 Activation Rate', '-18% Drop-off at OAuth Step'],
          qualitySignals: [
            'PRD Spec Attached',
            'Cross-Functional Alignment Meeting',
            'Live Experiment Shipped',
            'Telemetry Confirmed Lift'
          ]
        },
        {
          initiativeId: 'init-api-v2',
          initiativeTitle: 'Next-Gen Developer API Gateway & Rate Limiting',
          activitiesCount: {
            tasks: 9,
            docs: 2,
            meetings: 4,
            experiments: 1,
            outcomes: 1,
            notes: 6
          },
          userContribution: 'Contributor',
          attributionConfidence: 'High',
          isSharedAttribution: true,
          attributionNotes: 'Technical specification co-authored with Principal Backend Architect',
          artifacts: ['RFC 402: Token Bucket Throttling Architecture', 'DevPortal Documentation'],
          observedOutcomes: ['Zero Throttling Outages during Black Friday', '99.98% Gateway Uptime'],
          qualitySignals: [
            'Architecture RFC Published',
            'API Constraint Trade-Off Logged',
            'Shipped to Production'
          ]
        }
      ];

  const initiatives = isFull ? allInitiatives : allInitiatives.slice(0, 1);

  const handleAttributionChange = (initId: string, val: string) => {
    setActiveAttribution(prev => ({ ...prev, [initId]: val }));
    if (onUpdateAttribution) {
      onUpdateAttribution(initId, val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/80 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                System Evidence
              </span>
              <IntelligenceModeBadge capability="capability_attribution" />
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">
                Primary Signal Driver
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              {dimension.label}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregated work signals synthesized across Jira, Notion, Calendar, and telemetry into cohesive initiative evidence.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* 1. EVIDENCE COVERAGE & CONFIDENCE SUMMARY */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Synthesized Evidence Signal
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Coverage: {dimension.evidenceCoverage || 'Strong'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-800">
              <div className="p-2 bg-slate-800/60 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Observed Level</span>
                <span className="text-base font-black text-white mt-0.5 block">
                  {dimension.observedLevelLabel || (dimension.score ? `${dimension.score} — Senior` : 'Insufficient Evidence')}
                </span>
              </div>

              <div className="p-2 bg-slate-800/60 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Signal Tier</span>
                <span className="text-base font-black text-emerald-400 mt-0.5 block">
                  Primary Driver
                </span>
              </div>

              <div className="p-2 bg-slate-800/60 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Confidence</span>
                <span className="text-base font-black text-amber-300 mt-0.5 block">
                  {dimension.assessmentConfidence || 'High'}
                </span>
              </div>
            </div>

            {dimension.confidenceReason && (
              <p className="text-xs text-slate-300 pt-1 leading-relaxed border-t border-slate-800/80">
                <strong className="text-white">Confidence Basis:</strong> {dimension.confidenceReason}
              </p>
            )}
          </div>

          {/* 2. EVIDENCE QUALITY HIERARCHY LADDER */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  CareerOS Evidence Quality Ladder
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Quality &gt; Raw Volume</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              100 completed tasks does not automatically mean high capability. Evidence strengthens as signals climb the verification ladder:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {QUALITY_LADDER_STEPS.map((step) => {
                const isObserved = step.level <= 6; // Example demonstrated ladder
                return (
                  <div 
                    key={step.level}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      isObserved
                        ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-400">Step {step.level}</span>
                      {isObserved && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                    </div>
                    <span className="font-bold text-xs block mt-1 leading-tight">{step.label}</span>
                    <span className="text-[9.5px] text-slate-500 block mt-0.5">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. GROUPED WORK / INITIATIVES (Entity Resolution) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Evidence Grouped from Related Work
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Activities clustered into cohesive initiatives, not isolated micro-tasks.
                </p>
              </div>
              <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {initiatives.length} {isFull ? 'Work Clusters' : 'Sample Cluster'}
              </span>
            </div>

            <div className="space-y-4">
              {initiatives.map((init) => {
                const currentRole = activeAttribution[init.initiativeId] || init.userContribution;
                return (
                  <div 
                    key={init.initiativeId}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            Work Initiative
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500 font-medium">Clustered Activities</span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-900 mt-1">
                          {init.initiativeTitle}
                        </h5>
                      </div>

                      {/* Clustered micro-activities pills */}
                      <div className="flex items-center gap-1.5 flex-wrap shrink-0 text-[10px] font-mono text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {init.activitiesCount.tasks} Tasks
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {init.activitiesCount.docs} Docs
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {init.activitiesCount.meetings} Meetings
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {init.activitiesCount.experiments} Experiments
                        </span>
                      </div>
                    </div>

                    {/* Attribution & Ownership Controls */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>Attribution &amp; Ownership:</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Attribution Confidence: {init.attributionConfidence}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['Owner', 'Lead', 'Contributor', 'Collaborator', 'Reviewer', 'Participant'].map(roleOpt => (
                          <button
                            key={roleOpt}
                            type="button"
                            onClick={() => handleAttributionChange(init.initiativeId, roleOpt)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              currentRole === roleOpt
                                ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {roleOpt}
                          </button>
                        ))}
                      </div>

                      {init.attributionNotes && (
                        <p className="text-[11px] text-slate-500 italic mt-1 font-sans">
                          {init.attributionNotes}
                        </p>
                      )}
                    </div>

                    {/* Supporting Artifacts */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                        Produced Artifacts
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {init.artifacts.map((art, aIdx) => (
                          <span 
                            key={aIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-200/60 text-blue-900 text-xs font-medium"
                          >
                            <FileText className="w-3 h-3 text-blue-600" />
                            <span>{art}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Measured Outcomes */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                        Observed Outcomes &amp; Telemetry
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {init.observedOutcomes.map((out, oIdx) => (
                          <span 
                            key={oIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold"
                          >
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            <span>{out}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {!isFull && (
              <CareerOSIntelligenceGate
                capability="capability_attribution"
                title="CareerOS Intelligence — Capability Attribution"
                description="Turn career activity into structured evidence, capabilities and readiness signals. Unlock full cross-initiative entity resolution and multi-stakeholder ownership calibration."
                sampleCountLabel="Showing 1 of 2 work initiative clusters"
              />
            )}
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Observing 2 Initiatives · 8 Verified Quality Signals
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToEvidenceIntelligence && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToEvidenceIntelligence();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Evidence Intelligence</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
