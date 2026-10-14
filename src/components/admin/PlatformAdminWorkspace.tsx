import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Database, 
  BrainCircuit, 
  Zap, 
  ExternalLink,
  Layers,
  Sparkles,
  Server,
  Settings,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { AdminDataManagementHub } from './AdminDataManagementHub';
import { CareerIntelligenceDashboard } from '../intelligence/observability/CareerIntelligenceDashboard';
import { CapabilityActivationInspector } from '../intelligence/activation/CapabilityActivationInspector';
import { CapabilityLedgerAdminView } from './CapabilityLedgerAdminView';

export type PlatformAdminTab = 'admin' | 'intelligence' | 'trigger_engine' | 'capability_ledger';

interface PlatformAdminWorkspaceProps {
  initialTab?: PlatformAdminTab;
  onBackToCareerOS: () => void;
  className?: string;
}

export const PlatformAdminWorkspace: React.FC<PlatformAdminWorkspaceProps> = ({
  initialTab = 'admin',
  onBackToCareerOS,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<PlatformAdminTab>(initialTab);

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Platform Admin Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Platform Level 2
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold text-slate-400">System Infrastructure & Intelligence Ops</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Sliders className="w-6 h-6 text-indigo-400" />
              <span>Platform Administration</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Manage core system registries, configure autonomous capability triggers, and inspect the Career Intelligence Engine.
            </p>
          </div>

          <button
            id="btn-back-to-career-os"
            type="button"
            onClick={onBackToCareerOS}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-all border border-white/10 shadow-xs cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Career OS</span>
          </button>
        </div>

        {/* Platform Admin Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Admin Data Hub</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('intelligence')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'intelligence'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Career Intelligence Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trigger_engine')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'trigger_engine'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Capability Activation / Trigger Engine</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/30 text-indigo-200 rounded-md font-mono">
              L0–L4
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('capability_ledger')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'capability_ledger'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Capability Ledger</span>
          </button>
        </div>
      </div>

      {/* Render Selected Platform Admin Area */}
      <div className="pt-2">
        {activeTab === 'admin' && (
          <div className="animate-in fade-in duration-150">
            <AdminDataManagementHub />
          </div>
        )}

        {activeTab === 'intelligence' && (
          <div className="animate-in fade-in duration-150">
            <CareerIntelligenceDashboard />
          </div>
        )}

        {activeTab === 'trigger_engine' && (
          <div className="animate-in fade-in duration-150 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">
                  Autonomous Capability Trigger Engine
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time trigger evaluation across L0 baseline retrieval, L1 entity resolution, L2 taxonomy alignment, L3 multi-source reconciliation, and L4 human-verified certification.
              </p>
            </div>

            <CapabilityActivationInspector />
          </div>
        )}

        {activeTab === 'capability_ledger' && (
          <div className="animate-in fade-in duration-150">
            <CapabilityLedgerAdminView />
          </div>
        )}
      </div>

    </div>
  );
};
