import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  AlertCircle,
  Lock,
  Workflow,
  Sparkles,
  Info
} from 'lucide-react';
import { usePreferredRoleMappingContext } from '../../../features/knowledge/context/PreferredRoleMappingContext';
import { CANONICAL_DOMAINS } from '../../../data/jobTaxonomies';
import { SectorDomain } from '../../../types';

interface DomainLayerContent {
  tagline: string;
  businessModels: {
    revenueModels: string[];
    coreUnits: string[];
    northStarMetrics: string[];
    unitEconomics: string[];
  };
  techArchitecture: {
    techStacks: string[];
    architecturePatterns: string[];
    dataApiStandards: string[];
    infrastructurePatterns: string[];
  };
  governanceCompliance: {
    complianceStandards: string[];
    enterpriseSecurity: string[];
    reliabilitySla: string[];
    resilienceMechanisms: string[];
  };
  deepDiveAnalysis?: string;
  interviewTalkingPoints?: string[];
}

const DOMAIN_INTELLIGENCE: Record<string, DomainLayerContent> = {
  'Enterprise SaaS': {
    tagline: 'Multi-tenant workflows, AI-accelerated operational efficiency, and consumption-based monetization.',
    businessModels: {
      revenueModels: ['Annual Contract Value (ACV) Tiering', 'Seat-based + Usage Hybrid Licensing', 'Enterprise Multi-Year Commitments'],
      coreUnits: ['Sales-Assisted Enterprise Enterprise (AE/SE)', 'Product-Led Growth (PLG) Expansion', 'Customer Success & Renewal Ops'],
      northStarMetrics: ['Net Revenue Retention (NRR > 120%)', 'Gross Margin > 78%', 'Rule of 40 (Growth + FCF Margin)'],
      unitEconomics: ['LTV/CAC Ratio > 3.5x', 'CAC Payback Period < 12 Months', 'Logo Churn < 0.8% / mo']
    },
    techArchitecture: {
      techStacks: ['TypeScript / Next.js', 'Go / Node.js Microservices', 'PostgreSQL (RLS Partitioning)', 'Redis Sentinel', 'Kafka / AWS SQS'],
      architecturePatterns: ['Multi-tenant Shared DB with tenant_id routing', 'Transactional Outbox pattern for webhook dispatch', 'CQRS for high-read dashboards'],
      dataApiStandards: ['RESTful OpenAPI 3.0 & GraphQL Federation', 'Idempotency-Key HTTP headers', 'Semantic versioning with deprecation headers'],
      infrastructurePatterns: ['Kubernetes Multi-Cluster Deployment', 'ArgoCD GitOps deployment', 'Terraform cloud modular workspaces']
    },
    governanceCompliance: {
      complianceStandards: ['SOC 2 Type II Certification', 'ISO/IEC 27001 Information Security', 'GDPR & CCPA Data Privacy Mandates'],
      enterpriseSecurity: ['Enterprise SSO (SAML 2.0 / OIDC)', 'SCIM Automated User Deprovisioning', 'Row-Level RBAC & Immutable Audit Trails'],
      reliabilitySla: ['99.99% Availability Commitment (< 52 min downtime/year)', 'P99 API Latency < 180ms', 'RPO < 5m, RTO < 30m'],
      resilienceMechanisms: ['Circuit breakers (Netflix Hystrix pattern)', 'Exponential backoff with jittered retry', 'Multi-AZ database automated failover']
    },
    deepDiveAnalysis: 'Enterprise SaaS architecture requires balancing tenant isolation with operational cost efficiency. Row-Level Security (RLS) in PostgreSQL offers high density for lower tiers, whereas dedicated read-replicas or schema-per-tenant designs are reserved for Fortune 500 accounts demanding custom encryption keys (BYOK).',
    interviewTalkingPoints: [
      'How to isolate noisy neighbors in shared multi-tenant Redis and PostgreSQL clusters.',
      'Balancing PLG free-tier conversion funnels against infrastructure compute consumption.',
      'Designing backward-compatible webhook systems with automated dead-letter queues.'
    ]
  },
  'Fintech & Payments': {
    tagline: 'Instant settlement rails, double-entry ledger immutability, and zero-tolerance transaction idempotency.',
    businessModels: {
      revenueModels: ['Interchange basis points (bps) take rate', 'Float yield on funds in transit', 'Value-added risk & fraud scoring SaaS fees'],
      coreUnits: ['Treasury & Liquidity Management', 'Risk, Fraud & AML Operations', 'Payment Gateway Integration Squads'],
      northStarMetrics: ['Gross Payment Volume (GPV)', 'Net Take Rate (bps)', 'Payment Authorization Rate > 97.5%'],
      unitEconomics: ['Cost per Transaction ($0.08 - $0.15)', 'Fraud Loss Rate < 5 bps', 'Dispute / Chargeback Rate < 0.65%']
    },
    techArchitecture: {
      techStacks: ['Go (High-Concurrency Settlement)', 'Java / Kotlin (Spring Boot Ledger)', 'PostgreSQL (Strict Serialized Isolation)', 'Redis Cluster', 'Kafka Streams'],
      architecturePatterns: ['Immutable Double-Entry Ledger (Credit/Debit invariants)', 'Distributed Redis Redlock for balance reservations', 'Saga Pattern for multi-leg money movement'],
      dataApiStandards: ['ISO 20022 Financial Messaging Format', 'Mandatory client-provided Idempotency-Keys', 'Mutual TLS (mTLS) with tokenized payload encryption'],
      infrastructurePatterns: ['PCI-DSS Level 1 isolated network enclave', 'Hardware Security Modules (HSM) for PIN/Card crypto', 'Active-Active multi-region database clustering']
    },
    governanceCompliance: {
      complianceStandards: ['PCI-DSS Level 1 Service Provider', 'KYC / AML FinCEN regulatory compliance', 'SOC 1 Type II (SSAE 18) Financial Reporting'],
      enterpriseSecurity: ['Zero-Trust tokenized primary account numbers (PAN)', 'Encrypted at rest with AWS KMS / HSM', 'Tamper-proof append-only ledger audit logs'],
      reliabilitySla: ['99.999% Four-Nines-Five Availability for Payment Ingress', 'P99 Authorization Latency < 80ms', 'Zero tolerated ledger write loss'],
      resilienceMechanisms: ['Two-phase commit with automated reconciliation engines', 'Dead-Letter Queue replay with ledger drift checks', 'Automatic banking gateway failover routing']
    },
    deepDiveAnalysis: 'Fintech systems fundamentally prioritize consistency over availability under the CAP theorem. Distributed transactions are decomposed into compensating transactions using the Saga Pattern, accompanied by nightly automated reconciliation batches that cross-check internal ledgers against bank clearing files.',
    interviewTalkingPoints: [
      'Handling payment gateway timeout ambiguity without triggering double charges.',
      'Designing immutable double-entry ledgers with zero floating-point rounding errors.',
      'Implementing real-time fraud velocity detection with sub-50ms P99 latency.'
    ]
  },
  'E-Commerce & Retail': {
    tagline: 'Omnichannel fulfillment, sub-second checkout conversion, and flash-sale inventory reservation.',
    businessModels: {
      revenueModels: ['Marketplace GMV Commission (8-15%)', 'Direct Product Margin & Private Label', 'Fulfillment & Logistics Value-Add Fees'],
      coreUnits: ['Merchandising & Catalog Operations', 'Warehouse Management (WMS / MES)', 'Conversion Rate Optimization (CRO) Team'],
      northStarMetrics: ['Gross Merchandise Value (GMV)', 'Cart-to-Checkout Conversion Rate > 3.2%', 'Average Order Value (AOV)'],
      unitEconomics: ['Customer Acquisition Cost (CAC)', 'Return on Ad Spend (ROAS > 3.0x)', 'Order Return Rate < 8%']
    },
    techArchitecture: {
      techStacks: ['Next.js / React (Edge SSR)', 'Go / Node.js Services', 'PostgreSQL / DynamoDB', 'Elasticsearch / Algolia', 'Kafka'],
      architecturePatterns: ['Redis Lease Pattern for cart inventory reservation', 'CQRS for catalog search vs checkout transaction', 'Edge CDN caching for dynamic product pages'],
      dataApiStandards: ['GraphQL for headless commerce storefronts', 'Webhook event streaming for courier status updates', 'JSON-LD structured schema for SEO rich snippets'],
      infrastructurePatterns: ['Auto-scaling Kubernetes worker pools for flash sales', 'Cloudflare Workers for edge geolocation pricing', 'Decoupled headless checkout gateway']
    },
    governanceCompliance: {
      complianceStandards: ['PCI-DSS Merchant Level 2/3', 'Consumer Data Privacy (CCPA/GDPR)', 'Accessibility WCAG 2.1 AA Certification'],
      enterpriseSecurity: ['Bot protection & CAPTCHA rate limiting (Cloudflare Turnstile)', 'Encrypted customer PII and shipping details', 'Strict payment tokenization'],
      reliabilitySla: ['99.95% Storefront Availability', 'P95 Edge Page Load < 600ms', 'P99 Checkout Execution < 250ms'],
      resilienceMechanisms: ['Graceful degradation to static cached catalog on backend lag', 'Asynchronous order queue buffering during flash spikes', 'Automated inventory release on abandoned session TTL']
    },
    deepDiveAnalysis: 'The central tension in e-commerce architecture is high concurrency inventory leasing without overselling. When 10,000 buyers compete for 100 items during a drop, a two-phase Redis reservation token prevents database row lock contention.',
    interviewTalkingPoints: [
      'Mitigating race conditions in flash-sale inventory decrements using atomic Redis Lua scripts.',
      'Optimizing edge Core Web Vitals to maximize checkout conversion rate.',
      'Designing resilient courier webhook ingestion pipelines with payload validation.'
    ]
  },
  'AI & Machine Learning': {
    tagline: 'Compound AI systems, semantic vector retrieval, and low-latency agentic tool orchestration.',
    businessModels: {
      revenueModels: ['Token-based Inference Consumption', 'Enterprise Model Fine-Tuning & Hosting Licenses', 'Outcome-Based Automation Value Pricing'],
      coreUnits: ['AI Research & Prompt Engineering', 'Data Ingestion & Annotation Pipeline', 'MLOps & Inference Infrastructure'],
      northStarMetrics: ['Token Throughput per Second', 'Task Completion Accuracy Rate > 94%', 'Time to First Token (TTFT < 300ms)'],
      unitEconomics: ['Inference Cost per Completed Query', 'GPU Cluster Utilization > 85%', 'Gross Margin on AI Compute (> 65%)']
    },
    techArchitecture: {
      techStacks: ['Python (PyTorch / FastAPI)', 'TypeScript (Agent Orchestration)', 'pgvector / Pinecone', 'Redis Semantic Cache', 'vLLM / Triton'],
      architecturePatterns: ['Retrieval-Augmented Generation (RAG) with Re-Ranking', 'Agentic ReAct loops with structured function calling', 'Semantic Caching to bypass redundant LLM calls'],
      dataApiStandards: ['Server-Sent Events (SSE) for streaming responses', 'OpenAPI schemas for LLM tool invocation', 'OpenTelemetry Tracing for LLM chains (Langfuse)'],
      infrastructurePatterns: ['GPU auto-scaling clusters on Kubernetes (KEDA)', 'Spot instance fallback for async batch evaluations', 'Model quantization (AWQ/GPTQ) for edge latency']
    },
    governanceCompliance: {
      complianceStandards: ['EU AI Act Transparency Compliance', 'SOC 2 Type II with AI Data Non-Training Clauses', 'NIST AI Risk Management Framework'],
      enterpriseSecurity: ['Prompt Injection Defense & Guardrail Ensembles (Llama Guard)', 'PII Masking before external LLM dispatch', 'Model Weights & Checkpoint cryptographic signing'],
      reliabilitySla: ['99.9% Model Inference Availability', 'TTFT < 250ms on Flash Models', 'Zero ungrounded hallucinations in factual workflows'],
      resilienceMechanisms: ['Frontier-to-Flash model cascading on timeout or error', 'Circuit breaking on external provider rate limits', 'Graceful fallback to deterministic rule engine']
    },
    deepDiveAnalysis: 'Production AI architectures diverge from hobbyist RAG through hybrid search (dense embeddings + BM25 keyword matching) paired with cross-encoder re-ranking. Streaming responses via SSE is mandatory to maintain perceived responsiveness.',
    interviewTalkingPoints: [
      'Architecting resilient fallback cascades between Frontier models and local fine-tuned models.',
      'Preventing context window blowup through hierarchical summarization and token budgeting.',
      'Securing agentic tool execution against indirect prompt injection via untrusted inputs.'
    ]
  }
};

export const DomainSectorMappingView: React.FC = () => {
  const {
    preferredRole,
    targetDomains,
    activeDomain,
    setActiveDomain,
    addTargetDomain,
    removeTargetDomain
  } = usePreferredRoleMappingContext();

  const [selectedDomain, setSelectedDomain] = useState<string>(activeDomain || targetDomains[0] || 'Enterprise SaaS');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customTagline, setCustomTagline] = useState('');

  // Synchronize with activeDomain if changed externally
  React.useEffect(() => {
    if (activeDomain && activeDomain !== selectedDomain) {
      setSelectedDomain(activeDomain);
    }
  }, [activeDomain]);

  const currentIntel: DomainLayerContent = useMemo(() => {
    return DOMAIN_INTELLIGENCE[selectedDomain] || {
      tagline: `${selectedDomain} technical architecture, business unit economics, and operational standards.`,
      businessModels: {
        revenueModels: ['Subscription SaaS Licensing', 'Usage-Based Consumption', 'Professional Services Tier'],
        coreUnits: ['Enterprise Sales Squad', 'Product Growth Operations', 'Engineering Core'],
        northStarMetrics: ['Net Revenue Retention (> 115%)', 'Gross Margin (> 70%)', 'Customer LTV / CAC (> 3.0x)'],
        unitEconomics: ['CAC Payback < 14 Months', 'Annual Churn < 5%', 'Customer Acquisition Cost']
      },
      techArchitecture: {
        techStacks: ['TypeScript / React', 'Go / Node.js Microservices', 'PostgreSQL / Redis', 'Kafka / RabbitMQ', 'Docker / Kubernetes'],
        architecturePatterns: ['Multi-tenant partitioned architecture', 'Transactional Outbox pattern', 'Event-driven message routing'],
        dataApiStandards: ['RESTful OpenAPI specifications', 'Idempotent HTTP headers', 'Distributed trace context propagation'],
        infrastructurePatterns: ['Multi-region high availability', 'Automated CI/CD canary deployment', 'Centralized observability dashboards']
      },
      governanceCompliance: {
        complianceStandards: ['SOC 2 Type II', 'ISO 27001 Security Standard', 'GDPR Regional Data Residency'],
        enterpriseSecurity: ['Enterprise SAML 2.0 / SCIM', 'Role-Based Access Control (RBAC)', 'Immutable audit log streams'],
        reliabilitySla: ['99.95% Availability SLA', 'P99 Latency < 200ms', 'RPO < 15m, RTO < 1h'],
        resilienceMechanisms: ['Circuit breaker patterns', 'Graceful service degradation', 'Automated cluster failover']
      },
      deepDiveAnalysis: `Domain architecture for ${selectedDomain} requires aligning engineering throughput with sector-specific regulatory constraints and high-scale operational requirements.`,
      interviewTalkingPoints: [
        `Explaining core unit economics and margin constraints in ${selectedDomain}.`,
        `Addressing latency and high-availability failure modes under peak traffic.`,
        `Designing compliant data pipelines and auditability structures for enterprise customers.`
      ]
    };
  }, [selectedDomain]);

  // Keep selectedDomain valid if targetDomains changes
  React.useEffect(() => {
    if (targetDomains.length > 0 && !targetDomains.includes(selectedDomain)) {
      setSelectedDomain(targetDomains[0]);
    }
  }, [targetDomains, selectedDomain]);

  return (
    <div className="space-y-6">
      
      {/* Clean Domain Architecture Header & Quick Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {selectedDomain}
              </h3>
              <span className="text-2xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80">
                Calibrated for {preferredRole.title}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {currentIntel.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Multi-Domain Architecture Switcher when multiple domains are active */}
            {targetDomains.length > 1 && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                {targetDomains.map(dom => (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => setSelectedDomain(dom)}
                    className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                      selectedDomain === dom
                        ? 'bg-white text-slate-900 shadow-3xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 font-medium'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setDetailModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>More Details</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingDomain(selectedDomain);
                setCustomTagline(currentIntel.tagline);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Edit domain summary"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* THREE THINKING LAYERS (Columns 1, 2, 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: Business Models & Core Units */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Thinking Layer 1</span>
                <h4 className="text-sm font-black text-slate-900">Business Models & Core Units</h4>
              </div>
            </div>

            {/* Revenue Models */}
            <div className="space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Pricing & Revenue Models</span>
              <div className="space-y-1">
                {currentIntel.businessModels.revenueModels.map((item, i) => (
                  <div key={i} className="text-xs font-semibold text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Business Units */}
            <div className="space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Core Business Units & Teams</span>
              <div className="flex flex-wrap gap-1.5">
                {currentIntel.businessModels.coreUnits.map((item, i) => (
                  <span key={i} className="px-2.5 py-1 text-2xs font-bold bg-amber-50/80 text-amber-900 border border-amber-200/60 rounded-lg">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* North Star & Unit Economics */}
            <div className="space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">North Star Metrics & Unit Economics</span>
              <div className="space-y-1">
                {currentIntel.businessModels.northStarMetrics.map((metric, i) => (
                  <div key={i} className="text-xs font-medium text-slate-700 flex items-center justify-between p-1.5 bg-slate-50/70 rounded-lg">
                    <span className="font-semibold text-slate-900">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-2xs text-slate-500">
            Defines ROI expectations and budget authority for {preferredRole.title} initiatives.
          </div>
        </div>

        {/* COLUMN 2: Dominant Tech Stacks & Architecture */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Thinking Layer 2</span>
                <h4 className="text-sm font-black text-slate-900">Dominant Tech Stacks & Architecture</h4>
              </div>
            </div>

            {/* Dominant Tech Stacks */}
            <div className="space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Production Tech Stacks</span>
              <div className="flex flex-wrap gap-1.5">
                {currentIntel.techArchitecture.techStacks.map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 text-2xs font-bold bg-blue-50 text-blue-900 border border-blue-200/70 rounded-lg">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture Patterns */}
            <div className="space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Architecture & Scalability Patterns</span>
              <div className="space-y-1">
                {currentIntel.techArchitecture.architecturePatterns.map((pat, i) => (
                  <div key={i} className="text-xs font-semibold text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{pat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* API & Data Standards */}
            <div className="space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Data Contracts & API Standards</span>
              <div className="space-y-1">
                {currentIntel.techArchitecture.dataApiStandards.map((std, i) => (
                  <div key={i} className="text-2xs font-medium text-slate-700 p-1.5 bg-slate-50/70 rounded-lg">
                    • {std}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-2xs text-slate-500">
            Grounds technical system design and PRD specifications in battle-tested patterns.
          </div>
        </div>

        {/* COLUMN 3: Governance, Security & Compliance */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Thinking Layer 3</span>
                <h4 className="text-sm font-black text-slate-900">Governance, Security & Compliance</h4>
              </div>
            </div>

            {/* Compliance Standards */}
            <div className="space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Certifications & Compliance Standards</span>
              <div className="space-y-1">
                {currentIntel.governanceCompliance.complianceStandards.map((std, i) => (
                  <div key={i} className="text-xs font-semibold text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{std}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Security */}
            <div className="space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Enterprise Security & Identity</span>
              <div className="flex flex-wrap gap-1.5">
                {currentIntel.governanceCompliance.enterpriseSecurity.map((sec, i) => (
                  <span key={i} className="px-2.5 py-1 text-2xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/70 rounded-lg">
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            {/* Reliability & SLAs */}
            <div className="space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Reliability, SLAs & Resilience</span>
              <div className="space-y-1">
                {currentIntel.governanceCompliance.reliabilitySla.map((sla, i) => (
                  <div key={i} className="text-2xs font-medium text-slate-700 p-1.5 bg-slate-50/70 rounded-lg">
                    • {sla}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-2xs text-slate-500">
            Defines zero-tolerance guardrails, audit trails, and enterprise sign-off criteria.
          </div>
        </div>

      </div>

      {/* MORE DETAILS MODAL / DRAWER */}
      {detailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-2xs font-bold uppercase tracking-wider text-blue-600">Deep-Dive Specification</span>
                <h3 className="text-lg font-black text-slate-900">{selectedDomain} Architectural Intelligence</h3>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Deep Dive Analysis */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Architectural Context & Trade-Offs</h4>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-700 font-medium">
                {currentIntel.deepDiveAnalysis}
              </div>
            </div>

            {/* Interview Talking Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Domain Interview Talking Points for {preferredRole.title}
              </h4>
              <div className="space-y-2">
                {currentIntel.interviewTalkingPoints?.map((point, i) => (
                  <div key={i} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs font-semibold text-blue-950 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xs shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD DOMAIN MAPPING MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Target Domain Mapping</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select an industry domain from the canonical taxonomy to link into your active role context.
            </p>

            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {CANONICAL_DOMAINS.filter(d => !targetDomains.includes(d)).map(dom => (
                <button
                  key={dom}
                  onClick={() => {
                    addTargetDomain(dom);
                    setSelectedDomain(dom);
                    setIsAddModalOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200/80 hover:border-blue-500 hover:bg-blue-50 text-xs font-bold text-slate-800 transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>{dom}</span>
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
