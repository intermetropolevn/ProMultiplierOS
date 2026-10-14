import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  Search, 
  Filter, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Info, 
  ChevronRight, 
  Star, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  X,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { KnowledgeGraphNode, KnowledgeGraphLink } from '../../features/knowledge/types';
import { knowledgeStore } from '../../features/knowledge/services/knowledgeStore';

interface KnowledgeGraphViewProps {
  initialSelectedId?: string;
  onSelectNode?: (nodeId: string) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  initialSelectedId
}) => {
  const graphData = useMemo(() => knowledgeStore.getKnowledgeGraph(), []);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(
    initialSelectedId ? graphData.nodes.find(n => n.id === initialSelectedId) || graphData.nodes[0] : graphData.nodes[0]
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Compute domains
  const domains = useMemo(() => {
    const d = new Set<string>();
    graphData.nodes.forEach(n => {
      if (n.domain) d.add(n.domain);
    });
    return Array.from(d);
  }, [graphData]);

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter(n => {
      const matchesType = selectedType === 'all' || n.type === selectedType;
      const matchesDomain = selectedDomain === 'all' || !n.domain || n.domain === selectedDomain;
      const matchesSearch = !searchQuery || n.label.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesDomain && matchesSearch;
    });
  }, [graphData, selectedType, selectedDomain, searchQuery]);

  // Node position layout: circular / bento layout based on types
  const positionedNodes = useMemo(() => {
    const width = 800;
    const height = 540;
    const centerX = width / 2;
    const centerY = height / 2;

    const count = filteredNodes.length;
    return filteredNodes.map((node, i) => {
      let r = 180;
      if (node.type === 'concept') r = 120;
      if (node.type === 'skill') r = 200;
      if (node.type === 'role') r = 230;
      if (node.type === 'source') r = 160;
      if (node.type === 'domain') r = 60;

      const angle = (i / count) * 2 * Math.PI;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      return {
        ...node,
        x,
        y
      };
    });
  }, [filteredNodes]);

  const filteredNodeIds = useMemo(() => new Set(positionedNodes.map(n => n.id)), [positionedNodes]);

  // Filter links where both source and target exist
  const visibleLinks = useMemo(() => {
    return graphData.links.filter(l => {
      const srcId = typeof l.source === 'string' ? l.source : (l.source as any).id;
      const tgtId = typeof l.target === 'string' ? l.target : (l.target as any).id;
      return filteredNodeIds.has(srcId) && filteredNodeIds.has(tgtId);
    });
  }, [graphData.links, filteredNodeIds]);

  // Connected edges for the selected node
  const connectedRelations = useMemo(() => {
    if (!selectedNode) return [];
    return graphData.links.filter(l => {
      const srcId = typeof l.source === 'string' ? l.source : (l.source as any).id;
      const tgtId = typeof l.target === 'string' ? l.target : (l.target as any).id;
      return srcId === selectedNode.id || tgtId === selectedNode.id;
    }).map(l => {
      const isOutbound = (typeof l.source === 'string' ? l.source : (l.source as any).id) === selectedNode.id;
      const otherId = isOutbound 
        ? (typeof l.target === 'string' ? l.target : (l.target as any).id)
        : (typeof l.source === 'string' ? l.source : (l.source as any).id);
      const otherNode = graphData.nodes.find(n => n.id === otherId);
      return {
        relation: l.relation,
        label: l.label,
        isOutbound,
        otherNode
      };
    });
  }, [selectedNode, graphData]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'concept':
        return '#3b82f6'; // blue
      case 'skill':
        return '#10b981'; // emerald
      case 'role':
        return '#8b5cf6'; // purple
      case 'source':
        return '#f59e0b'; // amber
      case 'domain':
        return '#0f172a'; // slate 900
      default:
        return '#64748b';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Graph Metrics */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-extrabold uppercase">
              Semantic Ontology Network
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {graphData.nodes.length} Nodes • {graphData.links.length} Relationship Edges
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Interactive Knowledge Graph Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Visualizing semantic links between foundational concepts, candidate competencies, target roles, academic papers, and canonical books.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/80 shrink-0 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white shadow-2xs border border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Concepts</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white shadow-2xs border border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Skills</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white shadow-2xs border border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Roles</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white shadow-2xs border border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Sources</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white shadow-2xs border border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <span>Domains</span>
          </span>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Find nodes in graph..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filter:</span>
          {['all', 'concept', 'skill', 'role', 'source'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold capitalize transition-colors shrink-0 ${
                selectedType === t
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All Types' : t + 's'}
            </button>
          ))}

          <div className="flex items-center gap-1 pl-2 border-l border-slate-200 shrink-0">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.15))}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-600 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.6, prev + 0.15))}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset view"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Area with Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Canvas */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner overflow-hidden relative min-h-[540px] flex items-center justify-center">
          
          <svg
            className="w-full h-[540px] select-none"
            viewBox="0 0 800 540"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
          >
            {/* Background Grid Accent */}
            <defs>
              <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#graph-grid)" opacity="0.7" />

            {/* Links / Edges */}
            <g>
              {visibleLinks.map((link, idx) => {
                const srcId = typeof link.source === 'string' ? link.source : (link.source as any).id;
                const tgtId = typeof link.target === 'string' ? link.target : (link.target as any).id;
                const srcNode = positionedNodes.find(n => n.id === srcId);
                const tgtNode = positionedNodes.find(n => n.id === tgtId);
                if (!srcNode || !tgtNode) return null;

                const isConnectedToSelected = selectedNode && (srcId === selectedNode.id || tgtId === selectedNode.id);

                return (
                  <line
                    key={idx}
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isConnectedToSelected ? '#60a5fa' : '#334155'}
                    strokeWidth={isConnectedToSelected ? 2 : 1}
                    strokeOpacity={isConnectedToSelected ? 0.9 : 0.4}
                    strokeDasharray={link.relation === 'REQUIRES' ? '4 2' : undefined}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {positionedNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const color = getNodeColor(node.type);
                const radius = node.type === 'domain' ? 18 : node.type === 'concept' ? 14 : 11;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-transform hover:scale-125"
                  >
                    {/* Pulsing highlight if selected */}
                    {isSelected && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        opacity="0.8"
                        className="animate-ping"
                      />
                    )}

                    <circle
                      r={radius}
                      fill={color}
                      stroke={isSelected ? '#ffffff' : '#0f172a'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />

                    {/* Node Text Label */}
                    <text
                      y={radius + 12}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none drop-shadow-md"
                    >
                      {node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Canvas Floating Overlay Controls */}
          <div className="absolute bottom-4 left-4 text-[11px] font-semibold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-xs">
            Showing {positionedNodes.length} nodes • Click any node to inspect relationships
          </div>
        </div>

        {/* Node Inspector Drawer */}
        <div className="lg:col-span-4">
          {selectedNode ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              
              <div className="border-b border-slate-100 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span 
                    className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase text-white"
                    style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                  >
                    {selectedNode.type}
                  </span>
                  {selectedNode.confidence && (
                    <span className="text-xs font-bold text-emerald-600">
                      {Math.round(selectedNode.confidence * 100)}% Confidence
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedNode.label}
                </h3>
                {selectedNode.domain && (
                  <p className="text-xs text-slate-500 font-medium">
                    Domain: {selectedNode.domain}
                  </p>
                )}
              </div>

              {/* Connected Semantic Edges */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Connected Graph Relations ({connectedRelations.length})
                </h4>

                {connectedRelations.length > 0 ? (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {connectedRelations.map((rel, idx) => (
                      <div
                        key={idx}
                        onClick={() => rel.otherNode && setSelectedNode(rel.otherNode)}
                        className="p-2.5 rounded-xl border border-slate-200/70 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded uppercase">
                              {rel.relation}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {rel.otherNode?.label || 'Node'}
                            </span>
                          </div>
                          {rel.label && (
                            <span className="text-[10px] text-slate-400 block pl-1">
                              {rel.label}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No direct edges visible in current filter</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Node Metadata:</span>
                <div><strong>ID:</strong> <code className="text-[11px] font-mono text-slate-500">{selectedNode.id}</code></div>
                {selectedNode.origin && <div><strong>Origin:</strong> {selectedNode.origin}</div>}
                {selectedNode.authority && <div><strong>Source Authority:</strong> {selectedNode.authority}/5</div>}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400">
              Select a node to inspect its ontology links
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
