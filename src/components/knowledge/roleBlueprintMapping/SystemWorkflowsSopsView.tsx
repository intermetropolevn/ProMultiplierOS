import React, { useState, useMemo } from 'react';
import { 
  Workflow, 
  Layers, 
  Activity, 
  ShieldAlert, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  Zap, 
  AlertOctagon, 
  ChevronRight, 
  Database, 
  BarChart3, 
  Filter, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Copy, 
  Check, 
  Code, 
  Bookmark, 
  Flame, 
  Cpu, 
  RefreshCw, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { usePreferredRoleMappingContext } from '../../../features/knowledge/context/PreferredRoleMappingContext';
import { DETAILED_WORKFLOWS_DATA } from '../../../features/knowledge/data/workflowsAndMicroData';
import { WORKFLOWS_DATA } from '../../../data/workflowsData';
import { DetailedWorkflowItem } from '../../../features/knowledge/types/knowledgeTaxonomy';

export type LifecyclePhase = 'ingestion_gateways' | 'core_transactions' | 'resilience_failures' | 'delivery_release';

interface PhaseConfig {
  id: LifecyclePhase;
  label: string;
  stageNumber: string;
  description: string;
}

const LIFECYCLE_PHASES: PhaseConfig[] = [
  { id: 'ingestion_gateways', stageNumber: '1', label: 'Ingestion & Gateways', description: 'Request ingress, JWT validation, rate limits & deduplication' },
  { id: 'core_transactions', stageNumber: '2', label: 'Core Transactions', description: 'System of record persistence, double-entry ledgers, and atomic leases' },
  { id: 'resilience_failures', stageNumber: '3', label: 'Resilience & Failures', description: 'Dead-letter queues, poison pill isolation & circuit breakers' },
  { id: 'delivery_release', stageNumber: '4', label: 'Delivery & Release', description: 'Canary deployments, zero-downtime migrations & rollouts' }
];

// Helper to map workflow items to lifecycle phase
const categorizePhase = (wf: DetailedWorkflowItem): LifecyclePhase => {
  const code = (wf.codeName || '').toUpperCase();
  const title = wf.title.toLowerCase();
  if (code.includes('INGEST') || title.includes('ingestion') || title.includes('gateway') || title.includes('scan') || title.includes('api')) {
    return 'ingestion_gateways';
  }
  if (code.includes('INCIDENT') || code.includes('SEV') || title.includes('incident') || title.includes('failover') || title.includes('dead-letter') || title.includes('poison')) {
    return 'resilience_failures';
  }
  if (code.includes('GROWTH') || code.includes('MIGRATION') || title.includes('rollout') || title.includes('migration') || title.includes('deploy') || title.includes('release')) {
    return 'delivery_release';
  }
  return 'core_transactions';
};

// Adapted list including legacy and detailed
const INITIAL_WORKFLOWS: (DetailedWorkflowItem & { phaseCategory: LifecyclePhase; nodeState?: 'normal' | 'active' | 'blocked' | 'failed' | 'retrying' | 'recovered' })[] = [
  ...DETAILED_WORKFLOWS_DATA.map(w => ({
    ...w,
    phaseCategory: categorizePhase(w),
    nodeState: 'active' as const
  })),
  ...WORKFLOWS_DATA.map((wf, idx) => ({
    id: wf.id,
    title: wf.title,
    codeName: wf.id === 'wf-zero-downtime-migration' ? 'SCHEMA-EXPAND-01' :
              wf.id === 'wf-incident-response-sev1' ? 'INCIDENT-SEV1-02' :
              wf.id === 'wf-growth-experiment-launch' ? 'GROWTH-EXP-03' : 'LEDGER-RECON-04',
    category: wf.category,
    domain: wf.domain,
    summary: wf.summary,
    context: 'Operational protocol designed for high-availability environments where errors compromise data integrity.',
    architectureType: wf.category === 'Software Engineering' ? 'Transactional Outbox & Distributed Locks' : 'Continuous Delivery & Rollout Guardrails',
    estimatedDuration: wf.estimatedDuration,
    frequency: wf.frequency,
    realWorldImpact: wf.realWorldImpact,
    inputs: ['Trigger event or client mutation payload', 'Active telemetry baseline & lease tokens'],
    outputs: ['State mutation written to SOR', 'Kafka event dispatched and confirmed'],
    dependencies: ['Managed Primary DB Cluster', 'Kafka / SQS messaging bus'],
    systemsAndComponents: ['Edge Gateway', 'Primary PostgreSQL Database', 'Redis Cluster', 'Worker Queue'],
    failureModesAndRecovery: [
      {
        failureMode: 'Network partition during transactional commit',
        detectionSignal: 'Timeout metric breach > 250ms',
        mitigationStrategy: 'Execute automated idempotent retry with exponential backoff and jitter.'
      }
    ],
    steps: wf.steps.map(s => ({
      stepNumber: s.stepNumber,
      title: s.title,
      phase: s.phase,
      keyActions: s.keyActions,
      toolsUsed: s.toolsUsed,
      deliverables: s.deliverables,
      commonPitfalls: s.commonPitfalls
    })),
    phaseCategory: categorizePhase({ title: wf.title, codeName: wf.id } as DetailedWorkflowItem),
    nodeState: (idx % 2 === 0 ? 'recovered' : 'normal') as 'recovered' | 'normal'
  }))
];

export const SystemWorkflowsSopsView: React.FC = () => {
  const {
    preferredRole,
    targetDomains,
    activeDomain
  } = usePreferredRoleMappingContext();

  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);
  const [selectedPhase, setSelectedPhase] = useState<LifecyclePhase | 'all'>('all');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkflow, setActiveWorkflow] = useState<typeof INITIAL_WORKFLOWS[0] | null>(null);
  const [drawerTab, setDrawerTab] = useState<'contract' | 'dependencies' | 'resilience'>('contract');
  const [copiedContract, setCopiedContract] = useState(false);
  const [flaggedAsTalkingPoint, setFlaggedAsTalkingPoint] = useState<Record<string, boolean>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter workflows
  const filteredWorkflows = useMemo(() => {
    return workflows.filter(wf => {
      // Lifecycle phase filter
      if (selectedPhase !== 'all' && wf.phaseCategory !== selectedPhase) {
        return false;
      }
      // Domain filter
      if (selectedDomainFilter !== 'all' && wf.domain !== selectedDomainFilter) {
        return false;
      }
      // Pattern filter
      if (selectedPattern !== 'all' && !wf.architectureType?.toLowerCase().includes(selectedPattern.toLowerCase())) {
        return false;
      }
      // Search query (Ctrl+K friendly)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = (wf.codeName || '').toLowerCase().includes(q);
        const matchTitle = wf.title.toLowerCase().includes(q);
        const matchSummary = (wf.summary || '').toLowerCase().includes(q);
        const matchArch = (wf.architectureType || '').toLowerCase().includes(q);
        if (!matchCode && !matchTitle && !matchSummary && !matchArch) return false;
      }
      return true;
    });
  }, [workflows, selectedPhase, selectedDomainFilter, selectedPattern, searchQuery]);

  // Available architecture patterns
  const availablePatterns = useMemo(() => {
    const list = new Set<string>();
    workflows.forEach(w => {
      if (w.architectureType) {
        if (w.architectureType.includes('Outbox')) list.add('Outbox Pattern');
        if (w.architectureType.includes('Redis')) list.add('Redis Lock');
        if (w.architectureType.includes('Event')) list.add('Event-Driven');
        if (w.architectureType.includes('Rollout') || w.architectureType.includes('Delivery')) list.add('Canary Delivery');
      }
    });
    return Array.from(list);
  }, [workflows]);

  const handleCopySchema = (wf: typeof INITIAL_WORKFLOWS[0]) => {
    const payloadSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: `${wf.codeName}_Contract`,
      description: wf.summary,
      type: 'object',
      properties: {
        idempotencyKey: { type: 'string', format: 'uuid' },
        timestamp: { type: 'string', format: 'date-time' },
        actor: { type: 'string', default: preferredRole.title },
        inputs: wf.inputs,
        outputs: wf.outputs
      },
      required: ['idempotencyKey', 'timestamp']
    };
    navigator.clipboard.writeText(JSON.stringify(payloadSchema, null, 2));
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Context Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Operational Reliability
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-2xs font-bold text-slate-500">
                Target Role: <strong className="text-slate-900">{preferredRole.title}</strong>
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Workflows & Production SOPs
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              Inspect verified Standard Operating Procedures (SOPs), transaction boundaries, failure modes, and circuit breakers. Technical SOPs bridge system architecture with day-to-day production execution.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Workflow / SOP</span>
            </button>
          </div>
        </div>

        {/* PRIMARY FILTER: LIFECYCLE PHASE (Section 29) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Primary Lifecycle Phase:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPhase === 'all'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="text-xs font-black">All Phases</div>
              <div className="text-2xs text-slate-400 mt-0.5">{workflows.length} total procedures</div>
            </button>

            {LIFECYCLE_PHASES.map(phase => {
              const isSelected = selectedPhase === phase.id;
              const count = workflows.filter(w => w.phaseCategory === phase.id).length;
              return (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-500/20 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      Stage {phase.stageNumber}
                    </span>
                    <span className="text-2xs font-bold text-slate-400">{count}</span>
                  </div>
                  <div className="text-xs font-bold mt-1 truncate">{phase.label}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{phase.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECONDARY CONTROLS: Domain Filter, Pattern Chips, Search (Section 30) */}
        <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SOP ID or pattern (Ctrl+K)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-emerald-500 shadow-2xs"
              />
            </div>

            {/* Domain Filter */}
            <select
              value={selectedDomainFilter}
              onChange={(e) => setSelectedDomainFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500"
            >
              <option value="all">All Domains ({targetDomains.join(', ')})</option>
              {targetDomains.map(dom => (
                <option key={dom} value={dom}>{dom}</option>
              ))}
            </select>

            {/* Architecture Patterns */}
            <div className="flex items-center gap-1">
              {availablePatterns.map(pat => (
                <button
                  key={pat}
                  onClick={() => setSelectedPattern(selectedPattern === pat ? 'all' : pat)}
                  className={`px-2 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer border ${
                    selectedPattern === pat
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          </div>

          <div className="text-2xs font-semibold text-slate-400 shrink-0">
            Showing {filteredWorkflows.length} procedure{filteredWorkflows.length === 1 ? '' : 's'}
          </div>
        </div>

      </div>

      {/* WORKFLOW CARDS GRID (Section 31) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkflows.map(wf => {
          const isSelected = activeWorkflow?.id === wf.id;
          const isFlagged = flaggedAsTalkingPoint[wf.id];

          // Node State visual badge (Section 32)
          const stateColors = {
            active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            normal: 'bg-slate-100 text-slate-600 border-slate-200',
            blocked: 'bg-amber-50 text-amber-700 border-amber-200',
            failed: 'bg-red-50 text-red-700 border-red-200',
            retrying: 'bg-blue-50 text-blue-700 border-blue-200',
            recovered: 'bg-purple-50 text-purple-700 border-purple-200'
          };

          return (
            <div
              key={wf.id}
              onClick={() => setActiveWorkflow(wf)}
              className={`bg-white rounded-3xl border p-5 shadow-2xs transition-all cursor-pointer flex flex-col justify-between hover:shadow-md hover:border-emerald-500/60 relative ${
                isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20' : 'border-slate-200/90'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Code + Domain Tag + Node State */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                      {wf.codeName || 'SOP-01'}
                    </span>
                    <span className="text-2xs font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      {wf.domain}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${stateColors[wf.nodeState || 'active']}`}>
                      ● {wf.nodeState || 'active'}
                    </span>
                    {isFlagged && (
                      <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 line-clamp-2 leading-snug">
                    {wf.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {wf.summary}
                  </p>
                </div>

                {/* Architecture Pattern Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md">
                    {wf.architectureType?.split(' ')[0] || 'Transactional'}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md">
                    Idempotency-Key
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md">
                    Circuit Breaker
                  </span>
                </div>
              </div>

              {/* Performance Benchmark Footer */}
              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-2xs font-medium text-slate-500">
                <div className="flex items-center gap-1 text-slate-700">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>p95: <strong>120ms</strong></span>
                </div>
                <div>
                  Recovery: <strong>&lt; 5s</strong>
                </div>
                <div className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SLIDE-OVER INSPECTOR DRAWER (~680px) (Section 33 & 34) */}
      {activeWorkflow && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/70 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      {activeWorkflow.codeName || 'SOP-CANONICAL'}
                    </span>
                    <span className="text-2xs font-bold text-slate-500">
                      {activeWorkflow.domain}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-2xs font-bold text-indigo-600">
                      {activeWorkflow.frequency}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {activeWorkflow.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveWorkflow(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions (Section 35) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => handleCopySchema(activeWorkflow)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedContract ? 'Schema Copied!' : 'Copy JSON Schema'}</span>
                </button>

                <button
                  onClick={() => {
                    alert(`OpenAPI 3.0 Contract for ${activeWorkflow.codeName}:\nEndpoint: POST /api/v1/${activeWorkflow.id}\nHeaders: Idempotency-Key, X-Trace-Id\nAuth: Bearer JWT\nStatus: 201 Created`);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5 text-blue-600" />
                  <span>View OpenAPI Spec</span>
                </button>

                <button
                  onClick={() => {
                    setFlaggedAsTalkingPoint(prev => ({
                      ...prev,
                      [activeWorkflow.id]: !prev[activeWorkflow.id]
                    }));
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                    flaggedAsTalkingPoint[activeWorkflow.id]
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                  <span>{flaggedAsTalkingPoint[activeWorkflow.id] ? 'Flagged in Notes' : 'Flag as Interview Point'}</span>
                </button>
              </div>

              {/* Three Inspector Tabs */}
              <div className="flex items-center gap-1 pt-2 border-t border-slate-200/80">
                <button
                  onClick={() => setDrawerTab('contract')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    drawerTab === 'contract'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tab 1: Job Specs & Contract
                </button>
                <button
                  onClick={() => setDrawerTab('dependencies')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    drawerTab === 'dependencies'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tab 2: Dependencies & Flow
                </button>
                <button
                  onClick={() => setDrawerTab('resilience')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    drawerTab === 'resilience'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tab 3: Failure Protocols & Breakers
                </button>
              </div>
            </div>

            {/* Drawer Body Scrollable */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
              
              {/* TAB 1: Job Specs & Contract */}
              {drawerTab === 'contract' && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Contextual Narrative</span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {activeWorkflow.context}
                    </p>
                  </div>

                  {/* Input / Output Contracts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <span className="text-2xs font-bold uppercase tracking-wider text-blue-600">Input Payload Contract</span>
                      <div className="space-y-1">
                        {activeWorkflow.inputs.map((inp, i) => (
                          <div key={i} className="p-1.5 bg-slate-50 rounded-lg text-slate-800 font-semibold flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                            <span>{inp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <span className="text-2xs font-bold uppercase tracking-wider text-emerald-600">Output Delivery Contract</span>
                      <div className="space-y-1">
                        {activeWorkflow.outputs.map((out, i) => (
                          <div key={i} className="p-1.5 bg-slate-50 rounded-lg text-slate-800 font-semibold flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                            <span>{out}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Idempotency & Locking Mechanism */}
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Idempotency & Concurrency Lock Mechanism</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      Guaranteed via distributed Redis Mutex lock with short TTL lease (60s) keyed on <code className="px-1.5 py-0.5 bg-white rounded-md text-amber-900 font-mono text-2xs border border-amber-200">idempotency_key:tenant_id:entity_id</code>. Secondary database unique composite key guarantees deduplication if Redis fails over.
                    </p>
                  </div>

                  {/* Interactive JSON Payload Schema Preview */}
                  <div className="space-y-1.5">
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">JSON Payload Contract</span>
                    <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-2xs overflow-x-auto">
{JSON.stringify({
  traceId: "tr-7f9a1b82",
  idempotencyKey: "idem-2026-uuid",
  domain: activeWorkflow.domain,
  callerRole: preferredRole.title,
  inputs: activeWorkflow.inputs,
  slaExpectedMs: 120
}, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 2: Dependencies & Blockers */}
              {drawerTab === 'dependencies' && (
                <div className="space-y-5">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Prerequisite Upstream Systems</h4>
                    <div className="space-y-1.5">
                      {activeWorkflow.dependencies.map((dep, i) => (
                        <div key={i} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{dep}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Healthy</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Execution Pipeline Steps</h4>
                    <div className="space-y-3">
                      {activeWorkflow.steps.map((s, i) => (
                        <div key={i} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{s.title}</span>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">{s.phase}</span>
                          </div>
                          <div className="space-y-1 pt-1">
                            {s.keyActions.map((act, ai) => (
                              <div key={ai} className="text-2xs text-slate-600 flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 shrink-0" />
                                <span>{act}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Failure Protocols & Circuit Breakers */}
              {drawerTab === 'resilience' && (
                <div className="space-y-5">
                  <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200 space-y-3">
                    <div className="flex items-center gap-2 text-red-900 font-bold">
                      <AlertOctagon className="w-4 h-4 text-red-600" />
                      <span>Failure Conditions & Circuit Breaker Triggers</span>
                    </div>

                    <div className="space-y-3">
                      {activeWorkflow.failureModesAndRecovery.map((fm, i) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-red-100 shadow-2xs space-y-1.5">
                          <div className="font-bold text-red-950">{fm.failureMode}</div>
                          <div className="text-2xs text-slate-500">
                            <strong>Detection Signal:</strong> {fm.detectionSignal}
                          </div>
                          <div className="text-2xs text-emerald-800 bg-emerald-50 p-2 rounded-lg font-medium">
                            <strong>Mitigation & Recovery:</strong> {fm.mitigationStrategy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Retry Protocol with Jitter</h4>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      Backoff Formula: <code className="px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-900 font-mono text-2xs">t = min(max_backoff, base * 2^attempt) + rand(0, jitter)</code>.
                      If retry budget exceeds 5 attempts or error rate exceeds 10% over 60s, the circuit breaker transitions to <strong className="text-red-600">OPEN</strong> state and diverts payloads to Dead-Letter Queue (DLQ).
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="text-2xs text-slate-500">
                Calibrated against {preferredRole.title} competencies
              </div>
              <button
                onClick={() => setActiveWorkflow(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD WORKFLOW MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Technical Workflow / SOP</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem('wfTitle') as HTMLInputElement).value;
                const codeName = (form.elements.namedItem('wfCode') as HTMLInputElement).value;
                const phase = (form.elements.namedItem('wfPhase') as HTMLSelectElement).value as LifecyclePhase;
                const arch = (form.elements.namedItem('wfArch') as HTMLInputElement).value;

                const newWf: typeof INITIAL_WORKFLOWS[0] = {
                  id: `wf-custom-${Date.now()}`,
                  title,
                  codeName,
                  category: preferredRole.category,
                  domain: activeDomain || 'Enterprise SaaS',
                  summary: 'Custom operational SOP for distributed reliability and verified state transition.',
                  context: 'Engineered for zero-downtime execution and auditable compliance.',
                  architectureType: arch,
                  estimatedDuration: 'p95 < 200ms',
                  frequency: 'Continuous / Per Transaction',
                  realWorldImpact: 'Prevents data loss and ensures fault-tolerant state recovery.',
                  inputs: ['Client request with idempotency token', 'Session validation headers'],
                  outputs: ['State written to primary store', 'Asynchronous event dispatched'],
                  dependencies: ['Primary DB cluster', 'Event queue broker'],
                  systemsAndComponents: ['API Gateway', 'PostgreSQL', 'Redis'],
                  failureModesAndRecovery: [
                    {
                      failureMode: 'Database write timeout',
                      detectionSignal: 'p99 latency breach',
                      mitigationStrategy: 'Automated retry with exponential backoff and circuit breaker fallback.'
                    }
                  ],
                  steps: [
                    {
                      stepNumber: 1,
                      title: 'Ingress Verification',
                      phase: 'Validation',
                      keyActions: ['Verify payload hash and idempotency key'],
                      toolsUsed: ['Envoy / Redis'],
                      deliverables: ['Acquired lock'],
                      commonPitfalls: ['Missing deduplication check']
                    }
                  ],
                  phaseCategory: phase,
                  nodeState: 'active'
                };

                setWorkflows(prev => [newWf, ...prev]);
                setIsAddModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">SOP Title</label>
                <input
                  required
                  name="wfTitle"
                  placeholder="e.g. Asynchronous Webhook Retry with Exponential Jitter"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">SOP Code ID</label>
                  <input
                    required
                    name="wfCode"
                    placeholder="e.g. RETRY-DLQ-05"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">Lifecycle Phase</label>
                  <select
                    name="wfPhase"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  >
                    <option value="ingestion_gateways">1. Ingestion & Gateways</option>
                    <option value="core_transactions">2. Core Transactions</option>
                    <option value="resilience_failures">3. Resilience & Failures</option>
                    <option value="delivery_release">4. Delivery & Release</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">Architecture Pattern</label>
                <input
                  required
                  name="wfArch"
                  placeholder="e.g. Transactional Outbox & Redis Lock"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700"
                >
                  Save SOP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
