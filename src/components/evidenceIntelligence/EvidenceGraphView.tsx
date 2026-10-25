import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  Target, 
  Compass, 
  TrendingUp, 
  FileText, 
  Users,
  Info
} from 'lucide-react';
import { EvidenceGraphData, EvidenceGraphNode } from '../../features/evidenceIntelligence/types';
import { evidenceIntelligenceStore } from '../../features/evidenceIntelligence/services/evidenceIntelligenceStore';
import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';

export const EvidenceGraphView: React.FC = () => {
  const { accessLevel, getIntelligenceAccess, consumeDemoIntelligenceSignal } = useAccessControl();
  const rawGraphData = evidenceIntelligenceStore.getGraphData();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-init-onboarding');
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>('all');
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const isFullAccess = accessLevel === 'FULL_ACCESS';
  const isGuest = accessLevel === 'PUBLIC_GUEST';
  const intelAccess = getIntelligenceAccess('evidence_graph');

  // Access-aware graph data: do not send hidden graph nodes to Guest/Demo DOM
  const graphData: EvidenceGraphData = useMemo(() => {
    if (isFullAccess) return rawGraphData;
    const maxPerType = isGuest ? 1 : 2;
    const typeCounts: Record<string, number> = {};
    const visibleNodes = rawGraphData.nodes.filter(n => {
      if (n.type === 'user') return true;
      const limit = n.type === 'activity' || n.type === 'artifact' ? maxPerType + 1 : maxPerType;
      typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
      return typeCounts[n.type] <= limit;
    });
    const visibleIds = new Set(visibleNodes.map(n => n.id));
    const visibleLinks = rawGraphData.links.filter(
      l => visibleIds.has(l.source) && visibleIds.has(l.target)
    );
    return { nodes: visibleNodes, links: visibleLinks };
  }, [rawGraphData, isFullAccess, isGuest]);

  const groups = [
    { id: 'all', label: 'Complete Lineage' },
    { id: 'work', label: 'Work / Initiatives' },
    { id: 'activity', label: 'Activities & Artifacts' },
    { id: 'evidence', label: 'Career Evidence' },
    { id: 'capability', label: 'Capabilities' },
    { id: 'outcome', label: 'Outcomes' },
    { id: 'role', label: 'Role Requirements' }
  ];

  const filteredNodes = useMemo(() => {
    if (activeGroupFilter === 'all') return graphData.nodes;
    return graphData.nodes.filter(n => n.group === activeGroupFilter || n.group === 'root');
  }, [graphData.nodes, activeGroupFilter]);

  const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId) || graphData.nodes[0];

  const connectedLinks = useMemo(() => {
    if (!selectedNode) return [];
    return graphData.links.filter(
      l => l.source === selectedNode.id || l.target === selectedNode.id
    );
  }, [graphData.links, selectedNode]);

  const handleSelectNode = (nodeId: string) => {
    if (isGuest && nodeId !== selectedNodeId) {
      setIsGateModalOpen(true);
      return;
    }
    if (!isFullAccess && nodeId !== selectedNodeId) {
      const allowed = consumeDemoIntelligenceSignal('evidence_graph', `node-${nodeId}`);
      if (!allowed) {
        setIsGateModalOpen(true);
        return;
      }
    }
    setSelectedNodeId(nodeId);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-slate-900 text-white border-slate-900';
      case 'initiative': return 'bg-blue-600 text-white border-blue-600';
      case 'activity': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'artifact': return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'evidence': return 'bg-purple-600 text-white border-purple-600';
      case 'capability': return 'bg-indigo-600 text-white border-indigo-600';
      case 'outcome': return 'bg-emerald-600 text-white border-emerald-600';
      case 'role_requirement': return 'bg-rose-600 text-white border-rose-600';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Evidence Graph
            </span>
            <IntelligenceModeBadge capability="evidence_graph" />
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">End-to-End Lineage &amp; Grounding</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Work → Evidence → Capability → Role Lineage Graph
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Trace how raw sprint tasks and authored PRDs crystallize into demonstrated career evidence, validate professional capabilities, produce measurable business outcomes, and fulfill target role requirements.
          </p>
        </div>

        {/* Filter Strip */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 py-0.5">
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveGroupFilter(g.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeGroupFilter === g.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-mono shrink-0">
            {isFullAccess ? `${filteredNodes.length} Nodes · ${graphData.links.length} Relations` : `Sample Lineage Preview`}
          </span>
        </div>
      </div>

      {/* 2. Visual Interactive Graph Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Visual Lineage Matrix Canvas */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {isFullAccess ? 'Lineage Hierarchy (Click any node to trace lineage)' : 'Sample Lineage Hierarchy Preview'}
            </span>
            <span className="text-[11px] text-slate-400">
              {isFullAccess ? 'Full Verified Proof Graph' : 'Curated Sample Branch'}
            </span>
          </div>

          {/* Interactive Structured Step-down Pipeline Map */}
          <div className="space-y-4">
            
            {/* Level 1: Role Requirement Target */}
            <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                Target Role Requirements
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {graphData.nodes.filter(n => n.type === 'role_requirement').map(node => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => handleSelectNode(node.id)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedNode?.id === node.id 
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-400/20' 
                        : 'bg-white border-rose-200 text-rose-900 hover:bg-rose-50'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>{node.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <span className="text-slate-300 font-bold">▲ requires</span>
            </div>

            {/* Level 2: Capabilities Fulfillments */}
            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                Demonstrated Capabilities
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {graphData.nodes.filter(n => n.type === 'capability').map(node => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => handleSelectNode(node.id)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedNode?.id === node.id 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-400/20' 
                        : 'bg-white border-indigo-200 text-indigo-900 hover:bg-indigo-50'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{node.label}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-800 ml-1">
                      {node.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <span className="text-slate-300 font-bold">▲ demonstrated by</span>
            </div>

            {/* Level 3: Crystallized Career Evidence */}
            <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                Crystallized Career Evidence
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {graphData.nodes.filter(n => n.type === 'evidence').map(node => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => handleSelectNode(node.id)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedNode?.id === node.id 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs ring-2 ring-purple-400/20' 
                        : 'bg-white border-purple-200 text-purple-900 hover:bg-purple-50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{node.label}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-purple-100 text-purple-800 ml-1">
                      {node.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <span className="text-slate-300 font-bold">▲ synthesized from</span>
            </div>

            {/* Level 4: Work / Initiatives Intermediate Entities */}
            <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                Work / Initiatives Entities
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {graphData.nodes.filter(n => n.type === 'initiative').map(node => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => handleSelectNode(node.id)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedNode?.id === node.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-400/20' 
                        : 'bg-white border-blue-200 text-blue-900 hover:bg-blue-50'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{node.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <span className="text-slate-300 font-bold">▲ aggregates</span>
            </div>

            {/* Level 5: Raw Fragmented Activities & Artifacts */}
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Raw Fragmented Activities &amp; Artifacts
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {graphData.nodes.filter(n => n.type === 'activity' || n.type === 'artifact').map(node => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => handleSelectNode(node.id)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      selectedNode?.id === node.id 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {node.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right 4 Cols: Active Node Inspector & Lineage Traversal */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          {selectedNode && (
            <>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  Node Inspector
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedNode.label}
                </h3>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${getNodeColor(selectedNode.type)}`}>
                  Category: {selectedNode.type.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Connected Relationships in Graph */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Connected Lineage Paths ({connectedLinks.length})
                </span>

                <div className="space-y-2 text-xs">
                  {connectedLinks.map((link, idx) => {
                    const isSource = link.source === selectedNode.id;
                    const otherNodeId = isSource ? link.target : link.source;
                    const otherNode = graphData.nodes.find(n => n.id === otherNodeId);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectNode(otherNodeId)}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-blue-700">
                          <span>{isSource ? '→ Linked Signal' : '← Grounded In'}</span>
                          {link.label && <span className="bg-blue-100/70 text-blue-800 px-1.5 py-0.2 rounded">{link.label}</span>}
                        </div>
                        <span className="font-bold text-slate-900 block truncate">
                          {otherNode?.label || 'Verified Signal Node'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
            <Info className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
            Graph relationships substantiate that career capabilities originate in verified engineering &amp; product work rather than unanchored resume bullet points.
          </div>
        </div>

      </div>

      {/* Intelligence Gate for Guest / Demo */}
      {!isFullAccess && (
        <CareerOSIntelligenceGate
          capability="evidence_graph"
          variant="inline"
          sampleCountLabel={
            isGuest
              ? 'Showing 1 sample lineage path · Full multi-initiative Evidence Graph is protected'
              : `Demo Preview · ${intelAccess.demoSignalsUsed} / ${intelAccess.demoSignalsLimit} graph lineage inspections used`
          }
        />
      )}

      {isGateModalOpen && (
        <CareerOSIntelligenceGate
          capability="evidence_graph"
          variant="modal"
          onClose={() => setIsGateModalOpen(false)}
        />
      )}

    </div>
  );
};
