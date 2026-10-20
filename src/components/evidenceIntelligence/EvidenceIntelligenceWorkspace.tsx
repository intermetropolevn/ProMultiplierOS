import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Clock, 
  Layers, 
  Compass, 
  GitBranch, 
  Settings, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Sliders,
  ArrowRight
} from 'lucide-react';
import { evidenceIntelligenceStore } from '../../features/evidenceIntelligence/services/evidenceIntelligenceStore';
import { EvidenceItem, WorkInitiative } from '../../features/evidenceIntelligence/types';

import { EvidenceInboxView } from './EvidenceInboxView';
import { EvidenceTimelineView } from './EvidenceTimelineView';
import { WorkInitiativesView } from './WorkInitiativesView';
import { CapabilityEvidenceView } from './CapabilityEvidenceView';
import { EvidenceGraphView } from './EvidenceGraphView';
import { EvidenceSettingsView } from './EvidenceSettingsView';
import { AddEvidenceModal } from './AddEvidenceModal';
import { EvidenceDetailModal } from './EvidenceDetailModal';
import { CareerEvidenceProfileModal } from './CareerEvidenceProfileModal';

export type EvidenceSubTab = 
  | 'inbox' 
  | 'timeline' 
  | 'initiatives' 
  | 'capabilities' 
  | 'graph' 
  | 'settings';

interface EvidenceIntelligenceWorkspaceProps {
  initialSubTab?: EvidenceSubTab;
  onNavigateToRoleIntelligence?: (roleId?: string) => void;
}

export const EvidenceIntelligenceWorkspace: React.FC<EvidenceIntelligenceWorkspaceProps> = ({
  initialSubTab = 'inbox',
  onNavigateToRoleIntelligence
}) => {
  const [activeSubTab, setActiveSubTab] = useState<EvidenceSubTab>(initialSubTab);
  
  // Data from store
  const [inboxItems, setInboxItems] = useState<EvidenceItem[]>(evidenceIntelligenceStore.getInboxItems());
  const [timelineEvidence, setTimelineEvidence] = useState<EvidenceItem[]>(evidenceIntelligenceStore.getAllEvidence());
  const [initiatives, setInitiatives] = useState<WorkInitiative[]>(evidenceIntelligenceStore.getInitiatives());
  const [capabilities, setCapabilities] = useState(evidenceIntelligenceStore.getCapabilities());
  const roleReadiness = evidenceIntelligenceStore.getRoleReadiness();

  // Modals state
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
  const [isCareerProfileModalOpen, setIsCareerProfileModalOpen] = useState(false);
  const [selectedDetailEvidence, setSelectedDetailEvidence] = useState<EvidenceItem | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = evidenceIntelligenceStore.subscribe(() => {
      setInboxItems(evidenceIntelligenceStore.getInboxItems());
      setTimelineEvidence(evidenceIntelligenceStore.getAllEvidence());
      setInitiatives(evidenceIntelligenceStore.getInitiatives());
      setCapabilities(evidenceIntelligenceStore.getCapabilities());
    });
    return unsubscribe;
  }, []);

  const pendingInboxCount = inboxItems.length;
  const confirmedCount = timelineEvidence.filter(e => e.validationStatus === 'Confirmed' || e.validationStatus === 'Validated').length;

  const tabs: { id: EvidenceSubTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'inbox', label: 'Evidence Inbox', icon: Inbox, badge: pendingInboxCount > 0 ? pendingInboxCount : undefined },
    { id: 'timeline', label: 'Evidence Timeline', icon: Clock, badge: confirmedCount },
    { id: 'initiatives', label: 'Work & Initiatives', icon: Layers },
    { id: 'capabilities', label: 'Capability Evidence', icon: Compass },
    { id: 'graph', label: 'Evidence Graph', icon: GitBranch },
    { id: 'settings', label: 'Evidence Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb & Action bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Career Intelligence Platform
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Raw Activity → Initiative → Evidence → Capability → Readiness
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Evidence Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Automatically transforms fragmented work activity (Jira tasks, Notion PRDs, meetings, experiments, code commits) into structured, attributed career signals for role evaluation and promotion readiness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsCareerProfileModalOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Target Role Readiness</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                {roleReadiness.overallReadinessPercentage}%
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddEvidenceModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Extract Evidence</span>
            </button>

            {onNavigateToRoleIntelligence && (
              <button
                type="button"
                onClick={() => onNavigateToRoleIntelligence()}
                className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-blue-300 hover:text-blue-200 rounded-xl text-xs font-semibold transition-all border border-blue-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Role Intelligence</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Triage Inbox</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-white">{pendingInboxCount}</span>
              <span className="text-xs text-amber-400 font-medium">pending confirmation</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Validated Signals</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-emerald-400">{confirmedCount}</span>
              <span className="text-xs text-slate-400">confirmed items</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Work Initiatives</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-white">{initiatives.length}</span>
              <span className="text-xs text-blue-400">coherent clusters</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Senior PM Readiness</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-amber-300">{roleReadiness.overallReadinessPercentage}%</span>
              <span className="text-xs text-slate-400">{roleReadiness.readinessBand}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Sub-view content */}
      <div>
        {activeSubTab === 'inbox' && (
          <EvidenceInboxView
            inboxItems={inboxItems}
            onOpenDetail={(ev) => setSelectedDetailEvidence(ev)}
            onOpenQuickCapture={() => setIsAddEvidenceModalOpen(true)}
            onNavigateToTimeline={() => setActiveSubTab('timeline')}
          />
        )}

        {activeSubTab === 'timeline' && (
          <EvidenceTimelineView
            evidenceList={timelineEvidence}
            onOpenQuickCapture={() => setIsAddEvidenceModalOpen(true)}
          />
        )}

        {activeSubTab === 'initiatives' && (
          <WorkInitiativesView
            initiatives={initiatives}
            onOpenQuickCapture={() => setIsAddEvidenceModalOpen(true)}
          />
        )}

        {activeSubTab === 'capabilities' && (
          <CapabilityEvidenceView
            capabilities={capabilities}
            onOpenQuickCapture={() => setIsAddEvidenceModalOpen(true)}
          />
        )}

        {activeSubTab === 'graph' && (
          <EvidenceGraphView />
        )}

        {activeSubTab === 'settings' && (
          <EvidenceSettingsView />
        )}
      </div>

      {/* Modals */}
      <AddEvidenceModal
        isOpen={isAddEvidenceModalOpen}
        onClose={() => setIsAddEvidenceModalOpen(false)}
        onEvidenceCreated={(newEv) => {
          setSelectedDetailEvidence(newEv);
        }}
      />

      <EvidenceDetailModal
        isOpen={Boolean(selectedDetailEvidence)}
        onClose={() => setSelectedDetailEvidence(null)}
        evidence={selectedDetailEvidence}
        onConfirm={(id) => {
          evidenceIntelligenceStore.confirmEvidence(id);
          setSelectedDetailEvidence(null);
        }}
        onReject={(id) => {
          evidenceIntelligenceStore.rejectEvidence(id);
          setSelectedDetailEvidence(null);
        }}
      />

      <CareerEvidenceProfileModal
        isOpen={isCareerProfileModalOpen}
        onClose={() => setIsCareerProfileModalOpen(false)}
        onNavigateToInitiative={() => {
          setIsCareerProfileModalOpen(false);
          setActiveSubTab('initiatives');
        }}
      />
    </div>
  );
};
