import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  Layers, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Target,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { RoleIntelligenceItem, RoleGraphData } from '../../features/roleIntelligence/types';
import { ROLE_GRAPH_DATA } from '../../features/roleIntelligence/data/rolesIntelligenceData';
import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';

interface RoleGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: RoleIntelligenceItem;
  onSelectRole: (roleId: string) => void;
}

export const RoleGraphModal: React.FC<RoleGraphModalProps> = ({
  isOpen,
  onClose,
  onSelectRole
}) => {
  const { getIntelligenceAccess, consumeDemoIntelligenceSignal } = useAccessControl();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('role-sr-pm');
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>('all');
  const [gateModalOpen, setGateModalOpen] = useState(false);

  if (!isOpen) return null;

  const roleMapAccess = getIntelligenceAccess('ai_role_mapping');
  const isFull = roleMapAccess.isFull;

  const graphData: RoleGraphData = ROLE_GRAPH_DATA;

  const nodeGroups = [
    { id: 'all', label: 'All Node Types' },
    { id: 'product', label: 'Product Roles' },
    { id: 'product_business_ops', label: 'Product & BizOps' },
    { id: 'technology', label: 'Technology / TPM' },
    { id: 'skills', label: 'Skills & Competencies' },
    { id: 'learning', label: 'Learning Paths' },
    { id: 'opportunity', label: 'Live Opportunities' }
  ];

  const allFilteredNodes = activeGroupFilter === 'all' 
    ? graphData.nodes 
    : graphData.nodes.filter(n => n.group === activeGroupFilter);

  const filteredNodes = isFull ? allFilteredNodes : allFilteredNodes.slice(0, 5);

  const selectedNode = filteredNodes.find(n => n.id === selectedNodeId) || filteredNodes[0] || graphData.nodes[1];

  const allConnectedLinks = graphData.links.filter(
    l => l.source === selectedNode.id || l.target === selectedNode.id
  );
  const connectedLinks = isFull ? allConnectedLinks : allConnectedLinks.slice(0, 2);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'role': return 'bg-blue-600 text-white border-blue-600';
      case 'career_path': return 'bg-indigo-600 text-white border-indigo-600';
      case 'adjacent_role': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'skill':
      case 'competency': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'scope': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'industry': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'learning': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'opportunity': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-700 shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                <span>Role Architecture Topology</span>
                <IntelligenceModeBadge capability="ai_role_mapping" />
                <span>·</span>
                <span className="text-purple-700 font-bold">{filteredNodes.length} {isFull ? 'Nodes' : 'Sample Nodes'}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Role Intelligence Knowledge Graph
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar">
          {nodeGroups.map(grp => (
            <button
              key={grp.id}
              type="button"
              onClick={() => setActiveGroupFilter(grp.id)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeGroupFilter === grp.id
                  ? 'bg-slate-900 text-white shadow-3xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {grp.label}
            </button>
          ))}
        </div>

        {/* Graph Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
          
          {/* LEFT 7 COLS: Interactive Graph Topology Nodes Canvas */}
          <div className="lg:col-span-7 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-800">Connected System Topology</span>
              <span>Click node to inspect relationships</span>
            </div>

            {/* Structured Cluster Display */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {filteredNodes.map(node => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      if (roleMapAccess.isDemo) {
                        const ok = consumeDemoIntelligenceSignal('ai_role_mapping', node.id);
                        if (!ok) {
                          setGateModalOpen(true);
                          return;
                        }
                      }
                      setSelectedNodeId(node.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'ring-2 ring-blue-500 shadow-xs scale-105'
                        : 'opacity-90 hover:opacity-100 hover:scale-102'
                    } ${getNodeColor(node.type)}`}
                  >
                    <span>{node.label}</span>
                    {node.levelBadge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-white">
                        {node.levelBadge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {!isFull && (
              <div className="pt-3">
                <CareerOSIntelligenceGate
                  capability="ai_role_mapping"
                  title="CareerOS Intelligence — Role Mapping & Mobility Graph"
                  description="Turn career activity into structured evidence, capabilities and readiness signals. Unlock the complete cross-domain role transferability topology and live career progression graph."
                  sampleCountLabel={`Showing ${filteredNodes.length} curated sample nodes`}
                />
              </div>
            )}

            {/* Tree Structure Visualizer for Active Role */}
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Structural Hierarchy: Role → Skills → Adjacent Roles → Career Paths
              </span>

              <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 space-y-1.5 leading-relaxed">
                <div className="font-bold text-blue-700">Senior Product Manager (P4)</div>
                <div className="pl-4 text-slate-500">│</div>
                <div className="pl-4 text-slate-600">├── <strong className="text-slate-800">Skills &amp; Competencies</strong></div>
                <div className="pl-8 text-slate-500">├── Product Strategy &amp; Roadmapping</div>
                <div className="pl-8 text-slate-500">└── Quantitative Telemetry (SQL / Amplitude)</div>
                <div className="pl-4 text-slate-500">│</div>
                <div className="pl-4 text-slate-600">├── <strong className="text-purple-700">Adjacent Ecosystem Mobility</strong></div>
                <div className="pl-8 text-purple-600">├── Product Operations Manager (High Transferability)</div>
                <div className="pl-8 text-purple-600">└── Technical Product Manager (High Transferability)</div>
                <div className="pl-4 text-slate-500">│</div>
                <div className="pl-4 text-slate-600">└── <strong className="text-emerald-700">Next Progression Roles</strong></div>
                <div className="pl-8 text-emerald-600">├── Staff / Principal PM (IC Track P5/P6)</div>
                <div className="pl-8 text-emerald-600">└── Group PM / Director of Product (Management Track M1/M2)</div>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Active Node Inspection & Relationship Matrix */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Inspecting Node ({selectedNode.type.replace(/_/g, ' ')})
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedNode.label}
                </h3>
              </div>

              {/* Connections List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Connected Relationships ({connectedLinks.length})
                </span>

                <div className="space-y-2 text-xs">
                  {connectedLinks.map((link, idx) => {
                    const otherNodeId = link.source === selectedNode.id ? link.target : link.source;
                    const otherNode = graphData.nodes.find(n => n.id === otherNodeId);
                    return (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block font-mono">
                            {link.relationship.replace(/_/g, ' ')}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">
                            {otherNode?.label || 'Connected Node'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedNodeId(otherNodeId)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Jump to Role Evaluation if Node is Role */}
              {selectedNode.type.includes('role') && (
                <button
                  type="button"
                  onClick={() => {
                    const mapNodeToRoleId: Record<string, string> = {
                      'role-pm': 'role-product-manager',
                      'role-sr-pm': 'role-sr-product-manager',
                      'role-staff-pm': 'role-sr-product-manager',
                      'role-gpm': 'role-sr-product-manager',
                      'role-product-ops': 'role-product-ops-mgr',
                      'role-bizops': 'role-bizops-mgr',
                      'role-tpm-node': 'role-tpm',
                      'role-sa-node': 'role-solutions-architect',
                      'role-tech-pm-node': 'role-tech-product-mgr'
                    };
                    const targetId = mapNodeToRoleId[selectedNode.id] || selectedNode.id;
                    onClose();
                    onSelectRole(targetId);
                  }}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <span>Evaluate {selectedNode.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/60">
          <span className="text-xs text-slate-500 font-medium">
            Role Graph powers CareerOS ecosystem mobility and contextual opportunity matching.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Graph
          </button>
        </div>

      </div>

      {gateModalOpen && (
        <CareerOSIntelligenceGate
          capability="ai_role_mapping"
          variant="modal"
          onClose={() => setGateModalOpen(false)}
        />
      )}
    </div>
  );
};
