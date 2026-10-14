import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Layers, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  AlertTriangle, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  FolderGit2, 
  BarChart3, 
  FileText, 
  Mic, 
  Flame, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Bookmark, 
  ShieldAlert, 
  Zap,
  Target
} from 'lucide-react';
import { usePreferredRoleMappingContext } from '../../../features/knowledge/context/PreferredRoleMappingContext';
import { CASES_DATA } from '../../../data/casesData';
import { PracticalCase } from '../../../types';

export type ScenarioTrack = 'system_resilience' | 'growth_funnels' | 'operational_crises';

interface CaseStudyExtended {
  id: string;
  track: ScenarioTrack;
  title: string;
  domain: string;
  severity: 'Critical SEV-1' | 'High Severity Incident' | 'Strategic P1 Failure';
  frameworkCue: 'P-D-I Blueprint' | 'STAR Method' | 'Circuits & Guardrails';
  status: 'Ready to Spar' | 'Practiced — Score 88%' | 'Practiced — Score 94%';
  background: string;
  monitoringSignals: string[];
  coreConflict: string;
  options: {
    optionA: { name: string; description: string; pros: string[]; cons: string[] };
    optionB: { name: string; description: string; pros: string[]; cons: string[] };
  };
  seniorDecision: {
    selectedOption: string;
    architecturalReasoning: string;
    acceptedTradeOffs: string[];
  };
  measurableImpact: {
    metrics: string[];
    interviewDefenseQuestions: string[];
  };
}

const INITIAL_EXTENDED_CASES: CaseStudyExtended[] = [
  {
    id: 'case-payment-double-spend',
    track: 'system_resilience',
    title: 'The Ghost Payment Bug: Preventing Double-Billing in Mobile Subway Networks',
    domain: 'Fintech & Payments',
    severity: 'Critical SEV-1',
    frameworkCue: 'P-D-I Blueprint',
    status: 'Ready to Spar',
    background: 'During peak commuter transit hours, subway riders in underground tunnels top up transit cards. Due to intermittent cell-service drops, mobile clients timeout after 3 seconds, triggering client-side automatic retries while the backend actually charged the credit card.',
    monitoringSignals: [
      'Card settlement chargeback rate spiked from 0.12% to 1.84%',
      'Merchant gateway interchange fees increased by 18% due to redundant auth attempts',
      'Customer support tickets mentioning "duplicate charge" surged by 340%'
    ],
    coreConflict: 'Customers are being billed 2 to 4 times for a single transit top-up. Turnstiles remain blocked, and payment networks are threatening interchange compliance penalties.',
    options: {
      optionA: {
        name: 'Client-Side Hard Throttling',
        description: 'Disable automatic retries in the mobile SDK and force manual user reload with confirmation modal.',
        pros: ['Instant release with 0 backend changes', 'Blocks duplicate API payloads from the client'],
        cons: ['Disastrous commuter UX; subway turnstiles remain blocked; increases transit abandonment']
      },
      optionB: {
        name: 'Distributed Idempotency Gateway with Redis Mutex',
        description: 'Mandate client-generated UUIDv4 Idempotency-Key. Backend acquires Redis lock with 30s TTL; subsequent requests poll until completion.',
        pros: ['Completely eliminates duplicate charges', 'Transparent to mobile clients', 'Handles network retry storms gracefully'],
        cons: ['Requires Redis cluster lock coordination', 'Requires defensive DB unique composite constraints']
      }
    },
    seniorDecision: {
      selectedOption: 'Option B: Distributed Idempotency Gateway with Redis Mutex + Database Unique Fallback',
      architecturalReasoning: 'Financial APIs must never rely on client network stability. By combining an in-memory Redis atomic lock (fast path) with a unique composite key on `(tenant_id, idempotency_key)` in PostgreSQL (durable safety net), we eliminate race conditions even during Redis failovers.',
      acceptedTradeOffs: [
        'Added ~15ms overhead per checkout mutation for lock acquisition',
        'Engineers must write custom recovery handlers for Redis network partition timeouts'
      ]
    },
    measurableImpact: {
      metrics: [
        'Duplicate transaction rate dropped to 0.00% across 14M monthly transactions',
        'Chargeback dispute costs reduced by $180,000/quarter',
        'Turnstile checkout latency held stable at p95 < 140ms'
      ],
      interviewDefenseQuestions: [
        'How do you handle the edge case where the third-party payment gateway (Stripe) hangs indefinitely while your service holds the distributed lock?',
        'If Redis suffers node eviction during the 30-second lease, how do you prevent the database from throwing unhandled deadlock exceptions?'
      ]
    }
  },
  {
    id: 'case-saas-noisy-neighbor',
    track: 'system_resilience',
    title: 'Taming the 800-Pound Gorilla: Multi-Tenant Database CPU Starvation',
    domain: 'Enterprise SaaS',
    severity: 'Critical SEV-1',
    frameworkCue: 'P-D-I Blueprint',
    status: 'Practiced — Score 88%',
    background: 'A multi-tenant SaaS runs 14,000 corporate tenants on a shared PostgreSQL cluster. A newly signed Fortune 50 enterprise imports 4 million historical tickets via the API during European peak hours, driving database CPU to 100% and timing out SMB customers.',
    monitoringSignals: [
      'PostgreSQL CPU utilization pegged at 99.8% for 42 minutes',
      'SMB API p99 latency breached SLA from 160ms to 8,200ms',
      'PgBouncer active connection pool saturated at maximum 200 connections'
    ],
    coreConflict: 'SMB customers cannot access their dashboards and are protesting on social media, while sales leadership refuses to throttle the new Fortune 50 enterprise client ($1.8M ARR contract).',
    options: {
      optionA: {
        name: 'Immediate Global API Rate-Limiting',
        description: 'Hard-cap the Fortune 50 API key to 10 req/s across all ingress gateways.',
        pros: ['Instantly saves small customers from ongoing timeout degradation'],
        cons: ['Fortune 50 onboarding import fails; risks immediate deal cancellation']
      },
      optionB: {
        name: 'Tenant-Aware Queue Tiering & PgBouncer Connection Caps',
        description: 'Decouple interactive REST traffic from bulk ingestion pipelines using tiered Redis/SQS queues with per-tenant fair-share scheduling.',
        pros: ['Protects interactive user SLAs while allowing bulk migration to progress', 'Eliminates database thread pool starvation'],
        cons: ['Requires high-urgency operational triage to redirect worker pools']
      }
    },
    seniorDecision: {
      selectedOption: 'Option B: Tenant-Aware Queue Tiering + Dynamic PgBouncer Connection Pools',
      architecturalReasoning: 'Interactive customer clicks and automated bulk background imports must never share synchronous database thread pools. By enforcing tenant-aware fair-share scheduling, the enterprise import progresses in background slices without degrading interactive queries.',
      acceptedTradeOffs: [
        'Fortune 50 migration duration extended from 4 hours to 7 hours',
        'Required continuous worker pool auto-scaling to prevent background backlog buildup'
      ]
    },
    measurableImpact: {
      metrics: [
        'Interactive SMB dashboard p99 latency restored to 125ms within 12 minutes',
        'Zero failed or dropped records during the 4M enterprise ticket migration',
        'Sales successfully closed the $1.8M ARR multi-year enterprise expansion'
      ],
      interviewDefenseQuestions: [
        'How would you pitch this queue decoupling to an aggressive Sales VP who insists on instant data synchronization?',
        'When does a customer become so large that you must migrate them from shared Row-Level Security (RLS) to a dedicated PostgreSQL database?'
      ]
    }
  },
  {
    id: 'case-growth-checkout-funnel',
    track: 'growth_funnels',
    title: 'The Silent Cart Dropper: Diagnosing Sub-Second Checkout Funnel Collapse',
    domain: 'E-Commerce & Retail',
    severity: 'High Severity Incident',
    frameworkCue: 'STAR Method',
    status: 'Practiced — Score 94%',
    background: 'Following a redesign of the payment checkout page, mobile checkout completion dropped from 3.4% to 2.1% over a 48-hour period. Analytics showed users reaching the final order review step but abandoning without triggering network errors.',
    monitoringSignals: [
      'Conversion rate plummeted by 38% across iOS Safari mobile sessions',
      'Average session duration on checkout step increased from 24s to 82s',
      'Core Web Vitals Cumulative Layout Shift (CLS) on mobile jumped from 0.04 to 0.32'
    ],
    coreConflict: 'Product Growth attributed the drop to seasonal post-holiday purchasing fatigue, while Frontend attributed it to payment gateway latency. Revenue losses exceeded $65,000/day.',
    options: {
      optionA: {
        name: 'Revert Checkout Redesign Completely',
        description: 'Rollback Git deployment to previous legacy checkout monolith.',
        pros: ['Instantly restores previous baseline conversion rate'],
        cons: ['Discards 3 months of engineering work and unblocks zero new payment methods']
      },
      optionB: {
        name: 'Telemetry Instrument Session Replays & Edge Micro-Fixes',
        description: 'Deploy Datadog RUM session replays; discover layout shift caused by asynchronous Apple Pay button injection shifting submit button below mobile viewport.',
        pros: ['Pinpoints precise UX failure mode', 'Preserves modern tech stack upgrades while fixing root cause within 2 hours'],
        cons: ['Requires rapid 2-hour root cause diagnosis and hotfix validation']
      }
    },
    seniorDecision: {
      selectedOption: 'Option B: Session Replay Root-Cause Triage + Layout Shift Stabilization',
      architecturalReasoning: 'Data showed users attempting to tap the "Submit Order" button right as the asynchronous Apple Pay wallet SDK hydrated and injected an iframe, shifting the submit CTA off-screen. Reserving static DOM container dimensions eliminated the CLS bug.',
      acceptedTradeOffs: [
        'Reserved static height for wallet buttons even when Apple Pay is unavailable on Android devices'
      ]
    },
    measurableImpact: {
      metrics: [
        'Mobile checkout conversion rate rebounded from 2.1% to 3.6% within 24 hours',
        'Mobile CLS reduced from 0.32 to 0.01 (green Core Web Vitals rating)',
        'Recovered an estimated $420,000 in monthly abandoned cart revenue'
      ],
      interviewDefenseQuestions: [
        'How do you instrument synthetic user monitoring to detect silent conversion drops before revenue metrics alert you?',
        'How do you manage cross-functional blame between Product, UX, and Engineering when conversion drops unexpectedly?'
      ]
    }
  },
  {
    id: 'case-llm-support-hallucination',
    track: 'operational_crises',
    title: 'When the AI Promises a Free Car: Guarding LLMs in Enterprise Support',
    domain: 'AI & Machine Learning',
    severity: 'High Severity Incident',
    frameworkCue: 'Circuits & Guardrails',
    status: 'Ready to Spar',
    background: 'An online automotive platform deployed an autonomous customer support LLM. An adversarial customer posted a viral social media screenshot showing the chatbot agreeing to sell a $45,000 vehicle for $1 under formal contract law.',
    monitoringSignals: [
      'Viral post on X reached 3.4M impressions within 4 hours',
      'Executive Legal team demanded immediate offline termination of chatbot',
      'Support queue wait times spiked from 3 minutes to 45 minutes on chatbot pause'
    ],
    coreConflict: 'Legal demanded turning off the bot completely, which handled 65% of customer volume. Support leadership warned that humans could not sustain the load.',
    options: {
      optionA: {
        name: 'Revert to Hardcoded Decision-Tree Bot',
        description: 'Replace LLM with rigid static canned response bot.',
        pros: ['Guaranteed zero hallucinated liability'],
        cons: ['Customer CSAT drops 45%; human agents immediately overwhelmed']
      },
      optionB: {
        name: 'Multi-Stage Semantic Guardrails & Deterministic Tool Calling',
        description: 'Deploy prompt injection filters (Llama Guard), strip model authority to author binding quotes, and enforce backend cryptographic pricing tool execution.',
        pros: ['Preserves natural language conversational benefits while preventing unauthorized promises'],
        cons: ['Adds ~120ms latency to model token generation']
      }
    },
    seniorDecision: {
      selectedOption: 'Option B: Multi-Stage Guardrail Pipeline with Cryptographic Tool Verification',
      architecturalReasoning: 'Generative AI must never possess autonomous authority to commit corporate assets or negotiate pricing. By removing pricing authority from the LLM system prompt and requiring signed tool-call tokens, hallucinations cannot execute legally binding actions.',
      acceptedTradeOffs: [
        'Added $0.002 per message cost for dual-pass input/output guardrail scanning',
        'Increased P95 response latency by 140ms'
      ]
    },
    measurableImpact: {
      metrics: [
        'Zero contract or pricing hallucinations across 2.2M subsequent user queries',
        'First-Contact Resolution rate maintained at 64% without legal incidents',
        'Successfully passed enterprise third-party AI safety and compliance audit'
      ],
      interviewDefenseQuestions: [
        'How do you test and benchmark your guardrail latency against sophisticated jailbreaks?',
        'How do you explain the probabilistic nature of LLMs to non-technical C-suite executives during an active PR crisis?'
      ]
    }
  }
];

interface CaseStudiesViewProps {
  onStartLivePractice?: (scenarioTitle?: string) => void;
}

export const CaseStudiesView: React.FC<CaseStudiesViewProps> = ({
  onStartLivePractice
}) => {
  const {
    preferredRole,
    targetDomains,
    activeDomain
  } = usePreferredRoleMappingContext();

  const [cases, setCases] = useState<CaseStudyExtended[]>(INITIAL_EXTENDED_CASES);
  const [selectedTrack, setSelectedTrack] = useState<ScenarioTrack | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INITIAL_EXTENDED_CASES[0].id);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter cases
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      if (selectedTrack !== 'all' && c.track !== selectedTrack) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchDomain = c.domain.toLowerCase().includes(q);
        const matchConflict = c.coreConflict.toLowerCase().includes(q);
        if (!matchTitle && !matchDomain && !matchConflict) return false;
      }
      return true;
    });
  }, [cases, selectedTrack, searchQuery]);

  const activeCase: CaseStudyExtended = useMemo(() => {
    return cases.find(c => c.id === selectedCaseId) || filteredCases[0] || cases[0];
  }, [cases, selectedCaseId, filteredCases]);

  return (
    <div className="space-y-6">
      
      {/* Context Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                Critical Incident & Strategy Archive
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-2xs font-bold text-slate-500">
                Target: <strong className="text-slate-900">{preferredRole.title}</strong> • <strong className="text-slate-900">{activeDomain || targetDomains[0]}</strong>
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Production Case Studies & Incident Defense
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              High-stakes operational crises, architectural deadlocks, and product-led growth breakdowns. Deconstruct how senior leaders formulate tradeoffs and defend decisions during executive grilling.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-rose-600" />
              <span>Add New Case / Import</span>
            </button>
          </div>
        </div>
      </div>

      {/* MASTER-DETAIL LAYOUT (Section 51) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ~380px Case List (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* CONTROL STRIP (Section 52) */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incident cases..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-rose-500 shadow-2xs"
              />
            </div>

            {/* Track Filter */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedTrack('all')}
                className={`px-2 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                  selectedTrack === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Scenarios ({cases.length})
              </button>
              <button
                onClick={() => setSelectedTrack('system_resilience')}
                className={`px-2 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                  selectedTrack === 'system_resilience'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                System & Edge Cases
              </button>
              <button
                onClick={() => setSelectedTrack('growth_funnels')}
                className={`px-2 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                  selectedTrack === 'growth_funnels'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                CRO & Funnels
              </button>
              <button
                onClick={() => setSelectedTrack('operational_crises')}
                className={`px-2 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                  selectedTrack === 'operational_crises'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Operational Crises
              </button>
            </div>
          </div>

          {/* Case List Cards */}
          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredCases.map(c => {
              const isSelected = c.id === activeCase.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/40 shadow-xs ring-2 ring-rose-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-2xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {c.domain}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      c.severity.includes('SEV-1')
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 leading-snug line-clamp-2">
                    {c.title}
                  </h4>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-2xs">
                    <span className="font-bold text-slate-500">
                      {c.frameworkCue}
                    </span>
                    <span className={`font-black ${
                      c.status.includes('Score') ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ~65% Case Detail Canvas (lg:col-span-8) (Section 53) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
          
          {/* Header & Launch AI Sparring CTA (Section 54) */}
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
                  {activeCase.domain}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-2xs font-bold text-slate-500">
                  Framework: <strong className="text-slate-900">{activeCase.frameworkCue}</strong>
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {activeCase.title}
              </h3>
            </div>

            {/* Launch AI Sparring CTA Button */}
            <button
              id="btn-launch-ai-sparring"
              onClick={() => {
                if (onStartLivePractice) {
                  onStartLivePractice(activeCase.title);
                } else {
                  alert(`Launching AI Sparring session for:\n"${activeCase.title}"\nOpening interactive practice room.`);
                }
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2 shrink-0 animate-pulse hover:animate-none"
            >
              <Mic className="w-4 h-4 text-white" />
              <span>Launch AI Sparring for this Case 🎙️</span>
            </button>
          </div>

          {/* FOUR DISTINCT ANALYTICAL LAYERS (Section 53) */}
          <div className="space-y-5">
            
            {/* LAYER 1: The Crisis */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Layer 1 — The Crisis (Background & Signals)</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {activeCase.background}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                  Real-time Monitoring Signals & Breach Telemetry:
                </span>
                <div className="space-y-1">
                  {activeCase.monitoringSignals.map((sig, i) => (
                    <div key={i} className="text-2xs font-semibold text-rose-950 bg-rose-50/70 p-2 rounded-xl border border-rose-100 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-xs font-bold text-slate-900 bg-white p-3 rounded-xl border border-slate-200">
                <strong>Core Conflict:</strong> {activeCase.coreConflict}
              </div>
            </div>

            {/* LAYER 2: Architectural / Strategic Conflict */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Layer 2 — Architectural & Strategic Trade-Off Conflict</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Option A */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{activeCase.options.optionA.name}</span>
                    <span className="text-[10px] font-bold text-slate-400">Option A</span>
                  </div>
                  <p className="text-2xs text-slate-600">{activeCase.options.optionA.description}</p>
                  
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold text-emerald-700">Pros:</div>
                    {activeCase.options.optionA.pros.map((p, i) => (
                      <div key={i} className="text-2xs text-slate-700 flex items-start gap-1">
                        <span className="text-emerald-500">+</span>
                        <span>{p}</span>
                      </div>
                    ))}
                    <div className="text-[10px] font-bold text-rose-700 pt-1">Cons:</div>
                    {activeCase.options.optionA.cons.map((c, i) => (
                      <div key={i} className="text-2xs text-slate-700 flex items-start gap-1">
                        <span className="text-rose-500">-</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Option B */}
                <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-950">{activeCase.options.optionB.name}</span>
                    <span className="text-[10px] font-bold text-indigo-600">Option B</span>
                  </div>
                  <p className="text-2xs text-slate-600">{activeCase.options.optionB.description}</p>
                  
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold text-emerald-700">Pros:</div>
                    {activeCase.options.optionB.pros.map((p, i) => (
                      <div key={i} className="text-2xs text-slate-700 flex items-start gap-1">
                        <span className="text-emerald-500">+</span>
                        <span>{p}</span>
                      </div>
                    ))}
                    <div className="text-[10px] font-bold text-rose-700 pt-1">Cons:</div>
                    {activeCase.options.optionB.cons.map((c, i) => (
                      <div key={i} className="text-2xs text-slate-700 flex items-start gap-1">
                        <span className="text-rose-500">-</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* LAYER 3: Senior Decision & Accepted Trade-offs */}
            <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Layer 3 — Senior Decision & Accepted Trade-Offs</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200/80 shadow-2xs space-y-1.5">
                <div className="text-xs font-black text-slate-900">
                  Selected Resolution: {activeCase.seniorDecision.selectedOption}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {activeCase.seniorDecision.architecturalReasoning}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                  Accepted Engineering / Product Trade-offs:
                </span>
                {activeCase.seniorDecision.acceptedTradeOffs.map((t, i) => (
                  <div key={i} className="text-2xs text-slate-700 font-medium flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LAYER 4: Measurable Impact & Interview Defense Prompts */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Layer 4 — Measurable Impact & Interview Defense Prompts</span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {activeCase.measurableImpact.metrics.map((m, i) => (
                  <div key={i} className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 text-2xs font-semibold text-emerald-300">
                    {m}
                  </div>
                ))}
              </div>

              {/* Defense Prompts */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                  Senior Interview Follow-up Grilling Questions:
                </span>
                {activeCase.measurableImpact.interviewDefenseQuestions.map((q, i) => (
                  <div key={i} className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-200 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-2xs shrink-0 font-bold">
                      Q{i + 1}
                    </span>
                    <span className="italic">"{q}"</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ADD NEW CASE MODAL (Section 49) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Production Incident / Case</h3>
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
                const title = (form.elements.namedItem('caseTitle') as HTMLInputElement).value;
                const track = (form.elements.namedItem('caseTrack') as HTMLSelectElement).value as ScenarioTrack;
                const conflict = (form.elements.namedItem('caseConflict') as HTMLTextAreaElement).value;

                const newCase: CaseStudyExtended = {
                  id: `case-custom-${Date.now()}`,
                  track,
                  title,
                  domain: activeDomain || 'Enterprise SaaS',
                  severity: 'High Severity Incident',
                  frameworkCue: 'P-D-I Blueprint',
                  status: 'Ready to Spar',
                  background: conflict,
                  monitoringSignals: ['System error budget alert triggered', 'Latency breach metric'],
                  coreConflict: conflict,
                  options: {
                    optionA: {
                      name: 'Option A: Immediate Stopgap',
                      description: 'Short-term tactical fix.',
                      pros: ['Fast to deploy'],
                      cons: ['Incurs technical debt']
                    },
                    optionB: {
                      name: 'Option B: Structural Architectural Refactor',
                      description: 'Long-term resilient redesign.',
                      pros: ['Eliminates root cause'],
                      cons: ['Requires sprint allocation']
                    }
                  },
                  seniorDecision: {
                    selectedOption: 'Option B: Structural Architectural Refactor',
                    architecturalReasoning: 'Addresses root-cause invariants rather than masking symptoms.',
                    acceptedTradeOffs: ['Short-term developer allocation to platform refactoring']
                  },
                  measurableImpact: {
                    metrics: ['SLA uptime restored to 99.99%', 'Zero repeated incidents'],
                    interviewDefenseQuestions: [
                      'How do you defend this architectural decision when business partners demand faster delivery?'
                    ]
                  }
                };

                setCases(prev => [newCase, ...prev]);
                setSelectedCaseId(newCase.id);
                setIsAddModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">Case Title</label>
                <input
                  required
                  name="caseTitle"
                  placeholder="e.g. Distributed Lock Starvation under Black Friday Spike"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">Scenario Track</label>
                <select
                  name="caseTrack"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                >
                  <option value="system_resilience">1. System Resilience & Architectural Conflicts</option>
                  <option value="growth_funnels">2. Product-Led Growth & Funnel Breakdowns</option>
                  <option value="operational_crises">3. Operational Crisis & Disaster Recovery</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase text-slate-600 mb-1">Core Conflict & Background</label>
                <textarea
                  required
                  name="caseConflict"
                  rows={3}
                  placeholder="Describe the production failure mode, trade-off tension, and stakeholders involved..."
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
                  className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-rose-700"
                >
                  Save Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
