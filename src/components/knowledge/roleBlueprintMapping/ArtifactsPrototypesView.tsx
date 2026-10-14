import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  ExternalLink, 
  Layers, 
  Search, 
  Filter, 
  Tag, 
  Award, 
  Sparkles, 
  Eye, 
  FolderGit2, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Bookmark, 
  Compass,
  Building2
} from 'lucide-react';
import { usePreferredRoleMappingContext } from '../../../features/knowledge/context/PreferredRoleMappingContext';
import { sourceStore } from '../../../features/sources/services/sourceStore';
import { NormalizedSource } from '../../../features/sources/types';

export type ArtifactCategory = 'prds_specs' | 'system_diagrams' | 'interactive_prototypes' | 'data_contracts';

interface ArtifactItem {
  id: string;
  category: ArtifactCategory;
  title: string;
  proofLevel: 'Production Verified' | 'High-Fidelity Prototype' | 'Architecture RFC' | 'Contract Spec';
  summary: string;
  externalLink?: string;
  skillTags: string[];
  applicableRoles: string[];
  keyExcerpts: {
    title: string;
    content: string;
    type: 'gherkin' | 'error_matrix' | 'diagram_flow' | 'schema_snippet';
  };
  interviewTalkingPoints: string[];
}

const INITIAL_ARTIFACTS: ArtifactItem[] = [
  {
    id: 'art-platform-prd-idempotency',
    category: 'prds_specs',
    title: 'Platform RFC & Technical PRD: Distributed Idempotency Gateway',
    proofLevel: 'Production Verified',
    summary: 'Comprehensive 18-page engineering PRD specifying double-spend mitigation, Redis distributed mutex leases, and HTTP 409 conflict handling.',
    externalLink: 'https://github.com/platform-engineering/distributed-idempotency-rfc',
    skillTags: ['Technical PRD', 'CAP Theorem', 'Idempotency', 'Distributed Systems'],
    applicableRoles: ['Senior Platform PO', 'Technical Product Manager', 'Senior Backend Engineer'],
    keyExcerpts: {
      title: 'Gherkin Acceptance Criteria & Invariants',
      type: 'gherkin',
      content: `Feature: Idempotent Payment & Mutex Lease
  Scenario: Client duplicate click within 300ms window
    Given a valid request with Idempotency-Key "idem-8291-a1"
    When the edge gateway acquires the Redis lock with TTL 60s
    And a duplicate request arrives before the first completes
    Then the second request MUST return HTTP 409 Conflict with "Request In Flight" header
    And no secondary database mutation shall be initiated.`
    },
    interviewTalkingPoints: [
      'Authored the complete specification resolving $240K/month in accidental duplicate order charges.',
      'Defines exact error codes (409 Conflict vs 422 Unprocessable) preventing silent client retry storms.',
      'Collaborated with 4 stream-aligned squads to standardize the Idempotency-Key HTTP protocol.'
    ]
  },
  {
    id: 'art-seq-diagram-outbox',
    category: 'system_diagrams',
    title: 'System Architecture Sequence Diagram: Transactional Outbox Pattern',
    proofLevel: 'Architecture RFC',
    summary: 'Full plantUML / Mermaid sequence blueprint demonstrating zero-loss Kafka event publication using PostgreSQL outbox table and Debezium CDC.',
    externalLink: 'https://figma.com/@platform/transactional-outbox-topology',
    skillTags: ['Sequence Diagram', 'Kafka CDC', 'PostgreSQL', 'Debezium'],
    applicableRoles: ['Senior Backend Engineer', 'Senior Platform PO', 'System Architecture'],
    keyExcerpts: {
      title: 'Decoupled Event Streaming Flow',
      type: 'diagram_flow',
      content: `Client -> Envoy Gateway: POST /orders
Envoy -> Order Service: Validate JWT & Schema
Order Service -> PostgreSQL: BEGIN Transaction
  - INSERT INTO orders (...)
  - INSERT INTO outbox_events (topic, payload)
Order Service -> PostgreSQL: COMMIT Transaction
PostgreSQL -> Debezium CDC: Write-Ahead Log (WAL) Streaming
Debezium -> Kafka: Produce "order.created.v1"`
    },
    interviewTalkingPoints: [
      'Proves system architecture mastery by solving the dual-write problem without distributed two-phase commits.',
      'Shows how async event streaming insulates core order creation from downstream Kafka broker latency.',
      'Includes WAL replication lag alerting thresholds for mission-critical SRE monitoring.'
    ]
  },
  {
    id: 'art-proto-checkout-devex',
    category: 'interactive_prototypes',
    title: 'Developer Platform Console: Self-Service API Gateway Provisioner',
    proofLevel: 'High-Fidelity Prototype',
    summary: 'Interactive React/Tailwind developer portal allowing internal engineers to spin up sandboxed microservice route groups with token rate-limiting.',
    externalLink: 'https://v0.dev/chat/platform-route-console',
    skillTags: ['React / Vite', 'Internal DevEx', 'Self-Service UI', 'API Governance'],
    applicableRoles: ['Senior Platform PO', 'Technical Product Manager', 'Senior Product Designer (UI/UX)'],
    keyExcerpts: {
      title: 'DevEx Console Error Matrix & Edge States',
      type: 'error_matrix',
      content: `State: Rate Limit Quota Exceeded (429 Too Many Requests)
Visual Feedback: Instant banner showing retry-after countdown ticker + "Request Temporary Limit Burst" CTA.
Telemetry: Emits datadog.rum event "gateway.rate_limit_burst_requested" for platform capacity planning.`
    },
    interviewTalkingPoints: [
      'Decreased Time-to-First-Hello-World (TTFHW) for new internal services from 4 days to 14 minutes.',
      'Built interactive high-fidelity prototype in v0/React to align engineering managers before committing sprint capacity.',
      'Demonstrates strong visual craftsmanship paired with developer-centric usability heuristics.'
    ]
  },
  {
    id: 'art-schema-event-registry',
    category: 'data_contracts',
    title: 'Enterprise Event Schema Registry: Protobuf & OpenAPI 3.0 Contracts',
    proofLevel: 'Contract Spec',
    summary: 'Strict semantic schemas governing backward compatibility, JSON schema validation, and schema registry CI/CD linters.',
    externalLink: 'https://buf.build/platform-core/apis',
    skillTags: ['Protobuf / gRPC', 'OpenAPI 3.0', 'Schema Registry', 'Semantic Versioning'],
    applicableRoles: ['Senior Platform PO', 'Senior Backend Engineer', 'Lead Security & Systems Engineer'],
    keyExcerpts: {
      title: 'Protobuf Backward Compatibility Linter Rule',
      type: 'schema_snippet',
      content: `syntax = "proto3";
package platform.events.v1;

message OrderCreatedEvent {
  string order_id = 1;
  string tenant_id = 2;
  int64 amount_cents = 3;
  string currency = 4;
  // Field 5 was deprecated in favor of payment_intent_id
  reserved 5;
  reserved "raw_card_token";
  string payment_intent_id = 6;
}`
    },
    interviewTalkingPoints: [
      'Enforces schema validation in CI to eliminate breaking changes across distributed microservice squads.',
      'Incorporates reserved field safety to prevent accidental card data leakage in audit logs.',
      'Used as gold-standard technical evidence during Senior and Staff architectural interviews.'
    ]
  }
];

export const ArtifactsPrototypesView: React.FC = () => {
  const {
    preferredRole,
    targetDomains,
    activeDomain
  } = usePreferredRoleMappingContext();

  const [artifacts, setArtifacts] = useState<ArtifactItem[]>(INITIAL_ARTIFACTS);
  const [selectedCategory, setSelectedCategory] = useState<ArtifactCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDrawerArtifact, setActiveDrawerArtifact] = useState<ArtifactItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter artifacts
  const filteredArtifacts = useMemo(() => {
    return artifacts.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchTags = item.skillTags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchTags) return false;
      }
      return true;
    });
  }, [artifacts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Context Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                Tangible Evidence & Deliverables
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-2xs font-bold text-slate-500">
                Target: <strong className="text-slate-900">{preferredRole.title}</strong> • <strong className="text-slate-900">{activeDomain || targetDomains.join(' / ')}</strong>
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Artifacts & Prototypes Evidence Library
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              Concrete proof of execution: complete PRDs, system architecture sequence diagrams, interactive UI prototypes, and production schemas that prove seniority in hiring evaluations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-purple-600" />
              <span>Add New Asset / Import</span>
            </button>
          </div>
        </div>

        {/* TOOLBAR & SEGMENTED FILTER (Section 42) */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Segmented Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Proofs ({artifacts.length})
            </button>
            <button
              onClick={() => setSelectedCategory('prds_specs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'prds_specs'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              PRDs & Specs
            </button>
            <button
              onClick={() => setSelectedCategory('system_diagrams')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'system_diagrams'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              System Diagrams
            </button>
            <button
              onClick={() => setSelectedCategory('interactive_prototypes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'interactive_prototypes'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Interactive Prototypes
            </button>
            <button
              onClick={() => setSelectedCategory('data_contracts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'data_contracts'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Data Contracts / APIs
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PRDs, schemas, prototypes..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-purple-500 shadow-2xs"
            />
          </div>
        </div>

      </div>

      {/* ARTIFACT CARDS GRID (Section 43) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArtifacts.map(art => {
          const categoryLabels: Record<ArtifactCategory, string> = {
            prds_specs: 'PRD & Technical Spec',
            system_diagrams: 'System Architecture Flow',
            interactive_prototypes: 'Interactive Prototype',
            data_contracts: 'API & Data Contract'
          };

          return (
            <div
              key={art.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-purple-400"
            >
              <div className="space-y-3">
                {/* Header: Type + Proof Level */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    {categoryLabels[art.category]}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {art.proofLevel}
                  </span>
                </div>

                {/* Title & 2-Line Summary */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {art.skillTags.map((tag, i) => (
                    <span key={i} className="text-2xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveDrawerArtifact(art)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-300" />
                  <span>Quick Preview</span>
                </button>

                {art.externalLink && (
                  <a
                    href={art.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Open External</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 650–720px PREVIEW DRAWER (Section 44) */}
      {activeDrawerArtifact && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/70 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                      {activeDrawerArtifact.proofLevel}
                    </span>
                    <span className="text-2xs text-slate-500">
                      Calibrated Proof
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {activeDrawerArtifact.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveDrawerArtifact(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body Scrollable */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
              
              {/* SECTION 1: Meta, Live Links & Which Roles Use this Evidence */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Section 1 — Evidence Meta & Role Applicability
                </h4>

                <p className="text-slate-700 leading-relaxed font-medium">
                  {activeDrawerArtifact.summary}
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Which roles use this evidence?
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDrawerArtifact.applicableRoles.map((role, i) => (
                      <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-2xs font-bold">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {activeDrawerArtifact.externalLink && (
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={activeDrawerArtifact.externalLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-2xs flex items-center gap-1 border border-blue-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{activeDrawerArtifact.externalLink}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* SECTION 2: Key Excerpts (User Stories, Gherkin Criteria, Error Matrix) */}
              <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-purple-300 uppercase tracking-wider">
                    Section 2 — {activeDrawerArtifact.keyExcerpts.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {activeDrawerArtifact.keyExcerpts.type}
                  </span>
                </div>

                <pre className="font-mono text-2xs leading-relaxed text-slate-200 p-3 bg-slate-950/70 rounded-xl overflow-x-auto whitespace-pre-wrap">
                  {activeDrawerArtifact.keyExcerpts.content}
                </pre>
              </div>

              {/* SECTION 3: Interview Talking Points */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Section 3 — Interview Talking Points (Why this proves Seniority)
                  </span>
                </div>

                <div className="space-y-2">
                  {activeDrawerArtifact.interviewTalkingPoints.map((pt, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-xl border border-emerald-100 text-slate-800 font-medium leading-relaxed flex items-start gap-2 shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xs shrink-0 font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="text-2xs text-slate-500">
                Calibrated against {preferredRole.title}
              </div>
              <button
                onClick={() => setActiveDrawerArtifact(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD / IMPORT ASSET MODAL (Section 39) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add New Evidence Asset / Import</h3>
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
                const title = (form.elements.namedItem('artTitle') as HTMLInputElement).value;
                const cat = (form.elements.namedItem('artCat') as HTMLSelectElement).value as ArtifactCategory;
                const link = (form.elements.namedItem('artLink') as HTMLInputElement).value;
                const summary = (form.elements.namedItem('artSummary') as HTMLTextAreaElement).value;

                const newItem: ArtifactItem = {
                  id: `art-custom-${Date.now()}`,
                  category: cat,
                  title,
                  proofLevel: 'High-Fidelity Prototype',
                  summary,
                  externalLink: link || undefined,
                  skillTags: ['System Design', 'Deliverable', preferredRole.title],
                  applicableRoles: [preferredRole.title],
                  keyExcerpts: {
                    title: 'Specification Summary',
                    type: 'gherkin',
                    content: summary
                  },
                  interviewTalkingPoints: [
                    'Demonstrates proactive deliverable creation for real-world production environments.',
                    'Directly addresses high-scale architectural tradeoffs.'
                  ]
                };

                setArtifacts(prev => [newItem, ...prev]);
                setIsAddModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">Asset Title</label>
                <input
                  required
                  name="artTitle"
                  placeholder="e.g. Distributed Rate Limiter Token Bucket Specification"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">Category</label>
                  <select
                    name="artCat"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  >
                    <option value="prds_specs">PRD & Specs</option>
                    <option value="system_diagrams">System Architecture</option>
                    <option value="interactive_prototypes">Interactive Prototype</option>
                    <option value="data_contracts">Data Contract / API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">External Link (Optional)</label>
                  <input
                    name="artLink"
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">2-Line Executive Summary</label>
                <textarea
                  required
                  name="artSummary"
                  rows={3}
                  placeholder="Summarize the tangible deliverable and why it represents senior-level execution..."
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
                  className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-purple-700"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
