import { BuildOpportunity, BuilderProfile, BuildTeam, MyBuildItem } from '../types/builderMatch';

export const INITIAL_BUILDERS: BuilderProfile[] = [
  {
    id: 'builder-liza',
    name: 'Liza Vance',
    handle: '@lizavance',
    headline: 'Product Lead & 2x Founder · Ex-ScaleAI',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    location: 'San Francisco, CA (Remote)',
    primaryRole: 'Product Lead',
    capabilities: ['Product Strategy', 'SaaS / B2B', 'Growth & PLG', 'GTM', 'User Research'],
    skills: ['0-to-1 Product', 'Cohort Retention', 'Pricing Experiments', 'Figma', 'Linear', 'SQL'],
    availability: '10–15 hrs/week · Evenings & Weekends',
    matchScore: 94,
    whyMatch: [
      'Deep SaaS / B2B activation & onboarding experience',
      'Proven track record taking 3 experimental products to revenue',
      'Strong international product & GTM framework execution'
    ],
    evidence: [
      {
        id: 'ev-1',
        title: 'Shipped Enterprise PLG Onboarding Overhaul',
        role: 'Head of Product',
        outcome: 'Lifted 14-day free-to-paid conversion from 3.2% to 7.8% across 45k monthly accounts.',
        skills: ['Product Strategy', 'Mixpanel', 'PLG', 'Interviews'],
        metrics: '+143% conversion velocity'
      },
      {
        id: 'ev-2',
        title: 'AI Workflow Copilot Prototype for Ops Teams',
        role: 'Co-founder',
        outcome: 'Built lightweight MVP validating voice command dispatch with 12 design partners.',
        skills: ['0-to-1 MVP', 'Customer Discovery', 'User Testing'],
        metrics: '88% weekly retention'
      }
    ],
    potentialGap: 'AI Engineering & Fine-tuning — Moderate (pairs best with ML Engineer)',
    pastBuildsCount: 6,
    verifiedEvidenceCount: 4,
    isOpenToTeams: true
  },
  {
    id: 'builder-marcus',
    name: 'Marcus Chen',
    handle: '@mchen_ai',
    headline: 'Senior AI Systems Engineer · Distributed Agents & LLMs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    location: 'Seattle, WA (Remote)',
    primaryRole: 'AI Engineer',
    capabilities: ['LLM Systems', 'Vector Search', 'Agent Tool-Use', 'Python / C++', 'Model Evaluation'],
    skills: ['LangChain', 'vLLM', 'Postgres pgvector', 'FastAPI', 'PyTorch', 'Docker'],
    availability: '12 hrs/week · Flexible async sprints',
    matchScore: 91,
    whyMatch: [
      'Built production multi-agent pipelines with automated tool calls',
      'Experienced in reducing inference latency and optimizing token budgets',
      'High open-source contribution velocity in AI tooling'
    ],
    evidence: [
      {
        id: 'ev-3',
        title: 'Low-latency Real-time Code Review Agent',
        role: 'Lead AI Engineer',
        outcome: 'Designed AST-aware parser and model prompt chain that reviews PRs in <12 seconds.',
        skills: ['Python', 'AST Analysis', 'Claude API', 'GitHub Webhooks'],
        metrics: '12s median review latency'
      }
    ],
    potentialGap: 'Visual Design & CSS — Low (focuses strictly on backend intelligence)',
    pastBuildsCount: 8,
    verifiedEvidenceCount: 5,
    isOpenToTeams: true
  },
  {
    id: 'builder-elena',
    name: 'Elena Rostova',
    handle: '@elenadesign',
    headline: 'Principal Product Designer · Design Systems & Complex Data',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    location: 'Berlin, Germany (Remote)',
    primaryRole: 'Product Designer',
    capabilities: ['UX Architecture', 'Design Systems', 'Micro-interactions', 'Data Visualization', 'Rapid Prototyping'],
    skills: ['Figma', 'Tailwind Tokens', 'Framer', 'User Testing', 'WCAG AA', 'Design Tokens'],
    availability: '8–10 hrs/week · European & US East overlap',
    matchScore: 89,
    whyMatch: [
      'Mastery in turning high-cognitive-load data into intuitive workflows',
      'Zero-pill clean layout discipline with strong typographic hierarchy',
      'Builds high-fidelity interactive prototypes directly in code/Framer'
    ],
    evidence: [
      {
        id: 'ev-4',
        title: 'Multi-Tenant Observability Canvas Redesign',
        role: 'Lead Designer',
        outcome: 'Reduced cognitive overload and support ticket volume for server telemetry by 35%.',
        skills: ['Complex UX', 'User Research', 'Design Systems'],
        metrics: '-35% support tickets'
      }
    ],
    potentialGap: 'Cloud DevOps & Infrastructure — Moderate',
    pastBuildsCount: 5,
    verifiedEvidenceCount: 3,
    isOpenToTeams: true
  },
  {
    id: 'builder-dev',
    name: 'Dev Patel',
    handle: '@devpatel_arch',
    headline: 'Fullstack Architect · Local-First & Realtime CRDTs',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    location: 'Austin, TX (Remote)',
    primaryRole: 'Fullstack Architect',
    capabilities: ['TypeScript / Node', 'React 19', 'WebSockets', 'SQLite / Local-First', 'CRDTs & Sync'],
    skills: ['TypeScript', 'Rust', 'Tailwind', 'Next.js', 'RxDB', 'ElectricSQL'],
    availability: '15 hrs/week · Weekend hackathons & night sprints',
    matchScore: 88,
    whyMatch: [
      'Author of open-source synchronization engine with 3.8k GitHub stars',
      'Specialist in sub-16ms responsive canvas interactions and offline sync',
      'Pragmatic delivery mindset with zero over-engineering'
    ],
    evidence: [
      {
        id: 'ev-5',
        title: 'Collaborative Markdown & Diagramming Workspace',
        role: 'Sole Architect',
        outcome: 'Engineered peer-to-peer WebRTC state sync handling 50 simultaneous cursors.',
        skills: ['WebRTC', 'CRDT', 'React', 'Canvas API'],
        metrics: '<5ms render latency'
      }
    ],
    potentialGap: 'Enterprise Sales & Pitching — Moderate',
    pastBuildsCount: 9,
    verifiedEvidenceCount: 6,
    isOpenToTeams: true
  },
  {
    id: 'builder-sarah',
    name: 'Sarah Jenkins',
    handle: '@sjenkins_growth',
    headline: 'Growth & PLG Strategist · High-Velocity Experimentation',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    location: 'New York, NY (Remote)',
    primaryRole: 'Growth Strategist',
    capabilities: ['Growth Loops', 'Self-Serve Funnels', 'Activation Velocity', 'Quantitative A/B Testing', 'Retention Cohorts'],
    skills: ['PostHog', 'Mixpanel', 'A/B Testing Frameworks', 'SQL', 'Segment', 'HubSpot'],
    availability: '10 hrs/week · Evenings',
    matchScore: 85,
    whyMatch: [
      'Ran over 120 rapid growth experiments across fintech & dev tools',
      'Expert in identifying activation drop-offs and designing behavioral nudges',
      'Tight loop between quantitative cohort data and qualitative UX feedback'
    ],
    evidence: [
      {
        id: 'ev-6',
        title: 'B2B Developer Self-Serve Sandbox Activation',
        role: 'Growth Lead',
        outcome: 'Decreased time-to-first-API-call from 18 minutes to 90 seconds.',
        skills: ['Funnel Analysis', 'Behavioral Psychology', 'Interactive Demos'],
        metrics: '-91% Time-to-Hello-World'
      }
    ],
    potentialGap: 'Machine Learning Training — Low',
    pastBuildsCount: 4,
    verifiedEvidenceCount: 3,
    isOpenToTeams: true
  },
  {
    id: 'builder-liam',
    name: 'Liam O’Connor',
    handle: '@liam_audio',
    headline: 'Applied ML & Speech Specialist · Edge Model Distillation',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
    location: 'Dublin, Ireland (Remote)',
    primaryRole: 'AI Engineer',
    capabilities: ['Voice & Audio AI', 'Model Quantization', 'WebAssembly', 'PyTorch', 'Whisper / TTS Tuning'],
    skills: ['C++', 'ONNX Runtime', 'WebAudio API', 'Python', 'WebRTC', 'CoreML'],
    availability: '10 hrs/week · Weekends',
    matchScore: 87,
    whyMatch: [
      'Shipped on-device audio transcription pipeline with 400k+ active users',
      'Deep expertise in low-latency WebAudio buffers and streaming neural TTS',
      'Excited about interactive voice agents and audio-first user interfaces'
    ],
    evidence: [
      {
        id: 'ev-7',
        title: 'Browser-Native Sub-100ms Voice Agent Loop',
        role: 'Research Engineer',
        outcome: 'Packaged quantized acoustic model into WebAssembly for offline mobile audio transcription.',
        skills: ['Wasm', 'Audio Worklet', 'Whisper.cpp', 'VAD'],
        metrics: '82ms median response loop'
      }
    ],
    potentialGap: 'Marketing & Brand Narrative — Moderate',
    pastBuildsCount: 7,
    verifiedEvidenceCount: 4,
    isOpenToTeams: true
  }
];

export const INITIAL_BUILD_OPPORTUNITIES: BuildOpportunity[] = [
  {
    id: 'build-saas-activation',
    title: 'Increase B2B SaaS Activation Velocity',
    intent: 'solve_challenge',
    type: 'business_challenge',
    status: 'open',
    creator: {
      name: 'Acme Cloud Platform',
      organization: 'Acme Technologies',
      type: 'company',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
      verified: true
    },
    domain: 'Enterprise SaaS',
    duration: '2–4 weeks',
    teamSizeNeeded: 'Team of 2–4',
    difficulty: 'Intermediate',
    workMode: 'Remote',
    matchScore: 94,
    shortDescription: 'Product activation declined from 31% to 19% following a multi-workspace release. We need a cross-functional builder squad to diagnose telemetry, develop intervention concepts, and prototype an interactive setup flow.',
    challenge: {
      context: 'Acme Cloud is an enterprise workflow orchestration platform used by 12,000 engineering teams. After releasing multi-workspace permission controls in Q3, onboarding friction spiked significantly.',
      currentSituation: 'New trial signups increased by 40%, but trial-to-active workspace completion dropped from 31% to 19%. Users stall out at team invite and API key permission setup.',
      problem: 'Enterprise compliance rules were injected into the self-serve signup flow without adaptive guidance, turning a 2-minute flow into an intimidating 9-step configuration maze.',
      whyItMatters: 'Trial activation is the #1 predictor of 6-month enterprise contract expansion. A 5% activation lift represents ~$1.2M in annual recurring pipeline.',
      whatHasBeenTried: 'Email drip reminders and documentation links were deployed, but had zero statistically significant effect on activation completion.',
      constraints: [
        'Must preserve SOC2 / ISO27001 permission boundaries in data schema',
        'Cannot mandate credit card entry during self-serve onboarding',
        'Solutions must be testable within a 14-day client-side rollout window'
      ]
    },
    expectedOutcomes: [
      'Diagnose telemetry root causes across segmented trial cohorts',
      'Develop 2 testable solution concepts (e.g. progressive permission staging vs interactive sandbox)',
      'Build a working interactive onboarding prototype in React/Tailwind',
      'Validate usability with 5 representative enterprise engineering managers',
      'Deliver an implementation roadmap with instrumentation specifications'
    ],
    availableResources: [
      { name: 'Anonymized Event Stream', type: 'data', detail: '25,000 anonymized PostHog session records covering signup funnel drops' },
      { name: 'Onboarding API Sandbox', type: 'api', detail: 'Staging environment with mock enterprise team provisioning endpoints' },
      { name: 'Design System Library', type: 'design_system', detail: 'Full Figma tokens and React component system ready for drop-in prototyping' },
      { name: 'Subject Matter Expert', type: 'sme', detail: 'Weekly 45-minute sync with Acme Principal PM and Enterprise Solutions Architect' }
    ],
    idealBuilderProfile: {
      capabilities: ['Product Strategy', 'UX Research', 'Data Analysis', 'Growth & PLG', 'Frontend Prototyping'],
      suggestedRoles: ['Product Lead', 'Product Designer', 'Growth Strategist', 'Fullstack Prototyper'],
      experienceLevel: 'Mid-Level to Senior'
    },
    recommendedBuilders: [INITIAL_BUILDERS[0], INITIAL_BUILDERS[2], INITIAL_BUILDERS[4]],
    userReadiness: {
      score: 82,
      strengths: ['Product Strategy', 'SaaS Funnel Diagnostics', 'Cohort Analysis'],
      gaps: ['AI Engineering', 'Complex Permission Schema Modeling'],
      whatToCloseGap: [
        'Review the Progressive Permission Staging Framework in Knowledge Library',
        'Partner with a Fullstack Architect for staging API mock integration'
      ]
    },
    recommendedKnowledge: [
      {
        id: 'kn-1',
        title: 'PLG Activation & Time-to-Value Frameworks',
        category: 'Framework',
        duration: '15 min read',
        tag: 'Product Strategy',
        relevanceReason: 'Direct methodologies for isolating drop-offs in complex enterprise multi-step onboarding.'
      },
      {
        id: 'kn-2',
        title: 'Instrumentation for Trial Retention Cohorts',
        category: 'Case Study',
        duration: '25 min study',
        tag: 'Data Analytics',
        relevanceReason: 'Telemetry design patterns to measure progressive activation lift vs baseline.'
      }
    ],
    tags: ['Product Growth', 'SaaS / B2B', 'Activation', 'UX Research', 'Prototyping'],
    createdAt: '2026-10-12',
    deadline: '2026-11-15'
  },
  {
    id: 'build-voice-review-agent',
    title: 'Can an Autonomous Voice Agent Conduct Technical Code Reviews?',
    intent: 'run_experiment',
    type: 'ai_experiment',
    status: 'recruiting',
    creator: {
      name: 'Agentic Research Lab',
      organization: 'Independent Innovation Collective',
      type: 'lab',
      avatar: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&q=80&w=120',
      verified: true
    },
    domain: 'AI & Developer Tools',
    duration: '14 days',
    teamSizeNeeded: '3 builders',
    difficulty: 'Advanced',
    workMode: 'Remote',
    matchScore: 91,
    isExperiment: true,
    experimentDetails: {
      hypothesis: 'Engineers digest architectural feedback faster through a 3-minute interactive conversational voice walkthrough than through 20 fragmented inline PR comments.',
      testDurationDays: 14,
      successMetric: 'Developers resolve 35%+ more high-severity architectural issues and report higher comprehension in blinded A/B test.',
      status: 'recruiting'
    },
    shortDescription: 'We are running a structured 14-day experiment to build a conversational voice interviewer that reviews pull requests, explains security vulnerabilities interactively, and answers live questions.',
    challenge: {
      context: 'Written GitHub pull request reviews often descend into bikeshedding on formatting, while critical architectural oversights and concurrency deadlocks are missed.',
      currentSituation: 'Current AI code review bots dump walls of repetitive Markdown that engineers reflexively dismiss or ignore.',
      problem: 'Code review requires dialogue, clarifying context, and collaborative problem solving — modalities poorly served by static text summaries.',
      whyItMatters: 'If code reviews can become an interactive 2-minute dialogue, team throughput increases 4x while security posture dramatically hardens.',
      whatHasBeenTried: 'Basic GPT-4 inline comment generators generated negative user sentiment due to noisy false positives.',
      constraints: [
        'Audio round-trip voice latency must remain strictly below 400ms',
        'Must ingest diffs up to 1,500 lines without token context overflow',
        'Must run in modern web browsers without native plugin downloads'
      ]
    },
    expectedOutcomes: [
      'Engineer AST-aware code summarization pipeline with semantic diff chunking',
      'Connect low-latency browser WebRTC audio streaming to multimodal LLM',
      'Implement voice turn-taking and graceful interruption handling',
      'Run blinded evaluation across 10 real open-source GitHub pull requests',
      'Publish benchmark results and open-source experiment repository'
    ],
    availableResources: [
      { name: 'LLM & Audio API Credits', type: 'budget', detail: '$2,500 API sponsored grant for Claude 3.5 Sonnet & OpenAI Realtime' },
      { name: 'Open-Source Benchmark Dataset', type: 'data', detail: 'Curated dataset of 200 reviewed pull requests with verified CVE flaws' },
      { name: 'WebRTC Audio Bridge Boilerplate', type: 'api', detail: 'Pre-configured browser-to-server audio streaming gateway' }
    ],
    idealBuilderProfile: {
      capabilities: ['AI Engineering', 'WebRTC Audio Worklets', 'Fullstack Node / TS', 'Dev Tools UX'],
      suggestedRoles: ['AI Engineer', 'Fullstack Audio Architect', 'Product Lead'],
      experienceLevel: 'Advanced'
    },
    recommendedBuilders: [INITIAL_BUILDERS[1], INITIAL_BUILDERS[5], INITIAL_BUILDERS[3]],
    userReadiness: {
      score: 79,
      strengths: ['Product Lead Direction', 'Dev Tools Familiarity'],
      gaps: ['WebAudio Worklet Buffering', 'PyTorch Voice Distillation'],
      whatToCloseGap: [
        'Explore the Real-Time Audio Agent Architecture blueprint',
        'Invite Marcus Chen (@mchen_ai) or Liam O’Connor (@liam_audio) to lead technical streaming'
      ]
    },
    recommendedKnowledge: [
      {
        id: 'kn-3',
        title: 'Real-Time Voice Agent Architecture & Latency Budgets',
        category: 'Framework',
        duration: '18 min read',
        tag: 'AI Engineering',
        relevanceReason: 'Essential guide for sub-400ms conversational turn-taking pipelines.'
      }
    ],
    tags: ['AI Experiment', 'Voice Agent', 'Developer Tools', 'WebRTC', 'Code Review'],
    createdAt: '2026-10-14',
    deadline: '2026-10-28'
  },
  {
    id: 'build-crdt-whiteboard',
    title: 'Cross-Platform Real-Time Collaborative Canvas',
    intent: 'build_prototype',
    type: 'tech_challenge',
    status: 'open',
    creator: {
      name: 'CanvasLab Studio',
      organization: 'CanvasLab',
      type: 'startup',
      avatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=120',
      verified: true
    },
    domain: 'Creative & Productivity Tools',
    duration: '3–4 weeks',
    teamSizeNeeded: '2–3 builders',
    difficulty: 'Advanced',
    workMode: 'Remote',
    matchScore: 88,
    shortDescription: 'Build an ultra-responsive, 60fps infinite whiteboard canvas supporting offline-first CRDT synchronization, vector strokes, and multi-user cursor presence without centralized database locking.',
    challenge: {
      context: 'Current browser whiteboards either rely on heavy cloud WebSocket state machines or lag when multiple users sketch complex vector shapes simultaneously.',
      currentSituation: 'Teams in remote or low-bandwidth environments experience desync glitches and high input latency.',
      problem: 'We need a lightweight, local-first canvas architecture that treats the browser as the primary database with optimistic peer-to-peer conflict resolution.',
      whyItMatters: 'Local-first architecture eliminates cloud database egress costs and guarantees 0ms local drawing latency.',
      whatHasBeenTried: 'Centralized Firebase Firestore sync produced noticeable input lag during rapid freehand stylus sketching.',
      constraints: [
        '60fps rendering under 10,000 active vector nodes on canvas',
        'Zero data loss during spontaneous network dropouts',
        'Bundle size for client canvas runtime must be under 120KB gzipped'
      ]
    },
    expectedOutcomes: [
      'Design hybrid Canvas / WebGL rendering loop with viewport culling',
      'Implement Yjs or Automerge CRDT state bridge for multi-user stroke merging',
      'Build minimal tool palette (pen, shapes, sticky notes, comments)',
      'Demonstrate peer-to-peer sync between 3 browser windows with simulated network jitter'
    ],
    availableResources: [
      { name: 'Canvas Core Starter', type: 'product', detail: 'Clean WebGL vector line renderer with pressure curve smoothing' },
      { name: 'Benchmarking Suite', type: 'api', detail: 'Automated Playwright harness testing 60fps frame drops under heavy load' }
    ],
    idealBuilderProfile: {
      capabilities: ['Canvas / WebGL', 'CRDTs & Local-First', 'TypeScript', 'UI/UX Design'],
      suggestedRoles: ['Fullstack Architect', 'Product Designer', 'Frontend Systems Engineer'],
      experienceLevel: 'Senior / Lead'
    },
    recommendedBuilders: [INITIAL_BUILDERS[3], INITIAL_BUILDERS[2]],
    userReadiness: {
      score: 75,
      strengths: ['Product Architecture', 'Technical Specifications'],
      gaps: ['WebGL Shaders', 'CRDT Vector Clocks'],
      whatToCloseGap: ['Review CRDT conflict resolution patterns in Knowledge Library']
    },
    recommendedKnowledge: [
      {
        id: 'kn-4',
        title: 'Local-First Software Architecture & CRDT Essentials',
        category: 'Framework',
        duration: '22 min read',
        tag: 'Distributed Systems',
        relevanceReason: 'Foundational mental models for state synchronization without servers.'
      }
    ],
    tags: ['Local-First', 'CRDT', 'WebGL', 'Collaborative Canvas', 'Performance'],
    createdAt: '2026-10-10',
    deadline: '2026-11-20'
  },
  {
    id: 'build-voice-to-sql',
    title: 'Voice-to-SQL Co-Pilot for Fractional CFOs',
    intent: 'validate_idea',
    type: 'product_idea',
    status: 'open',
    creator: {
      name: 'Alex Rivera',
      organization: 'Independent Fractional CFO',
      type: 'individual',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      verified: true
    },
    domain: 'Fintech & Analytics',
    duration: '2 weeks',
    teamSizeNeeded: 'Pair (2 builders)',
    difficulty: 'Intermediate',
    workMode: 'Remote',
    matchScore: 92,
    shortDescription: 'Fractional CFOs waste hours writing ad-hoc SQL queries during board prep. Let’s build an encrypted, conversational assistant that converts spoken financial questions into safe, sanitized SQL queries against Stripe and QuickBooks schemas.',
    challenge: {
      context: 'Fractional CFOs manage finances for 4 to 8 startups at once. Each startup uses slightly different database schemas or export structures.',
      currentSituation: 'During investor meetings or monthly closes, quick questions like "What was our net dollar retention by cohort excluding enterprise discounts?" require 30 minutes of manual spreadsheet wrangling.',
      problem: 'General-purpose LLMs hallucinate financial SQL calculations (e.g. confusing deferred revenue with cash collections).',
      whyItMatters: 'Saving 5 hours/week for high-earning financial consultants creates a clear $100+/mo SaaS willingness-to-pay.',
      whatHasBeenTried: 'Basic ChatGPT prompts with CSV paste; failed on multi-table joins and data security compliance.',
      constraints: [
        'Strict zero-data-retention for confidential financial schemas',
        'Deterministic calculation verification layer before running queries'
      ]
    },
    expectedOutcomes: [
      'Build domain-specific financial semantic layer & schema mapper',
      'Implement voice-to-text input with financial acronym recognition',
      'Create visual query explanation with interactive drill-down tables',
      'Test prototype with 6 practicing fractional CFOs'
    ],
    availableResources: [
      { name: 'Sanitized Financial Schemas', type: 'data', detail: 'Synthesized multi-company Stripe, QuickBooks, and Postgres financial records' },
      { name: 'CFO Design Partner Network', type: 'users', detail: 'Direct access to 6 active fractional CFOs ready for weekly prototype validation' }
    ],
    idealBuilderProfile: {
      capabilities: ['Fintech Knowledge', 'LLM Prompt Engineering', 'Fullstack React/Node', 'Product Strategy'],
      suggestedRoles: ['Product Lead', 'AI Engineer', 'Fintech Specialist'],
      experienceLevel: 'Mid-Level'
    },
    recommendedBuilders: [INITIAL_BUILDERS[0], INITIAL_BUILDERS[1]],
    userReadiness: {
      score: 89,
      strengths: ['Financial Product Strategy', 'SaaS Metrics', 'User Research'],
      gaps: ['Sanitized SQL Parsing Sandbox'],
      whatToCloseGap: ['Partner with Marcus Chen or Dev Patel for the SQL execution sandbox']
    },
    recommendedKnowledge: [
      {
        id: 'kn-5',
        title: 'Building Reliable Text-to-SQL Pipelines with Semantic Checks',
        category: 'Article',
        duration: '14 min read',
        tag: 'AI Engineering',
        relevanceReason: 'How to prevent hallucinated joins and ensure 100% calculation determinism.'
      }
    ],
    tags: ['Fintech', 'Voice-to-SQL', 'PLG', 'Product Idea', 'LLMs'],
    createdAt: '2026-10-15',
    deadline: '2026-11-10'
  },
  {
    id: 'build-social-impact-mesh',
    title: 'Decentralized Disaster Response Logistics Network',
    intent: 'social_impact',
    type: 'social_impact',
    status: 'open',
    creator: {
      name: 'Resilience Global Initiative',
      organization: 'Open Disaster Relief Alliance',
      type: 'community',
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=120',
      verified: true
    },
    domain: 'Healthcare & Emergency Response',
    duration: '3–5 weeks',
    teamSizeNeeded: 'Team of 3–4',
    difficulty: 'Advanced',
    workMode: 'Remote',
    matchScore: 86,
    shortDescription: 'In major earthquakes or floods, cellular towers collapse. We are building an offline-first mobile web app that coordinates urgent medical supply drops over ad-hoc Bluetooth and Wi-Fi Direct mesh networks.',
    challenge: {
      context: 'When catastrophic natural disasters strike, cellular connectivity drops within hours. Emergency responders and local community volunteers become isolated.',
      currentSituation: 'Relief supply distribution relies on paper sheets and megaphone broadcasts, leading to critical shortages in hard-to-reach neighborhood zones.',
      problem: 'Existing crisis coordination software requires continuous internet access to centralized cloud servers.',
      whyItMatters: 'Faster supply dispatch within the first 72 hours of a disaster saves hundreds of lives and prevents disease outbreaks.',
      whatHasBeenTried: 'Satellite phone hubs deployed at central camps, but neighborhood responders cannot access them.',
      constraints: [
        'Must function 100% offline on standard mobile browsers (PWA)',
        'Extremely low battery consumption profile',
        'Cryptographic validation of volunteer identity without central server lookups'
      ]
    },
    expectedOutcomes: [
      'PWA bundle that boots and operates completely offline from Service Worker cache',
      'Store-and-forward message protocol over Web Bluetooth & QR code relays',
      'Triage inventory tracker for water, antibiotics, and power banks',
      'Simulated offline field drill testing multi-hop message propagation'
    ],
    availableResources: [
      { name: 'Emergency Responder Advisory Group', type: 'sme', detail: 'Feedback from retired Red Cross and UN logistics field directors' },
      { name: 'Offline Map Vector Tiles', type: 'data', detail: 'Compact, compressed street-level vector tiles covering disaster-prone metro areas' }
    ],
    idealBuilderProfile: {
      capabilities: ['PWA / Offline-First', 'Mobile UX', 'Security & Cryptography', 'Product Lead'],
      suggestedRoles: ['Product Designer', 'Fullstack Engineer', 'Systems Architect'],
      experienceLevel: 'Mid-Level to Senior'
    },
    recommendedBuilders: [INITIAL_BUILDERS[2], INITIAL_BUILDERS[3]],
    userReadiness: {
      score: 81,
      strengths: ['User Empathy', 'Operational Workflows', 'Mobile Product Architecture'],
      gaps: ['Web Bluetooth Hardware Protocols'],
      whatToCloseGap: ['Connect with Dev Patel for offline PWA storage synchronization']
    },
    recommendedKnowledge: [
      {
        id: 'kn-6',
        title: 'Offline-First Progressive Web Applications for Field Operations',
        category: 'Framework',
        duration: '20 min read',
        tag: 'PWA Engineering',
        relevanceReason: 'Architecture principles for zero-network environments and device-to-device transport.'
      }
    ],
    tags: ['Social Impact', 'Offline-First', 'PWA', 'Emergency Logistics', 'Disaster Tech'],
    createdAt: '2026-10-08',
    deadline: '2026-11-30'
  },
  {
    id: 'build-hackathon-redteam',
    title: 'Open Source AI Safety & Agent Red-Teaming Challenge',
    intent: 'join_hackathon',
    type: 'hackathon',
    status: 'open',
    creator: {
      name: 'AI Safety Alliance',
      organization: 'Global AI Governance Consortium',
      type: 'community',
      avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=120',
      verified: true
    },
    domain: 'Cybersecurity & AI Alignment',
    duration: '48-hour sprint (Nov 21–23)',
    teamSizeNeeded: 'Team of 2–4',
    difficulty: 'Expert',
    workMode: 'Remote',
    matchScore: 90,
    shortDescription: 'Compete in a global 48-hour hackathon to benchmark jailbreak resilience and autonomous privilege escalation in next-generation multi-agent execution environments.',
    challenge: {
      context: 'As autonomous AI agents gain access to shell execution, API keys, and database writes, prompt injection attacks can hijack agent tool loops.',
      currentSituation: 'Current benchmark suites only test single-turn chat prompts, failing to evaluate compounding multi-turn social engineering on autonomous subagents.',
      problem: 'We need automated red-teaming harnesses that simulate sophisticated multi-step adversary attacks against agent workflows.',
      whyItMatters: 'Securing autonomous agent tool-calling is the defining safety challenge before enterprise agent adoption.',
      whatHasBeenTried: 'Static regex filters and system prompt guards, easily bypassed by indirect prompt injections.',
      constraints: [
        'Exploits must be reproducible in Dockerized target containers',
        'Solutions must include automated defensive mitigations'
      ]
    },
    expectedOutcomes: [
      'Develop automated adversarial prompt mutation generator',
      'Test resilience across 10 popular agent framework architectures',
      'Submit formal evaluation writeup and mitigation patch',
      'Present findings to panel of AI security researchers'
    ],
    availableResources: [
      { name: '$50,000 Hackathon Prize Pool', type: 'budget', detail: 'Cash awards for most novel vulnerability discovery and strongest defensive patch' },
      { name: 'Compute GPU Cluster Access', type: 'api', detail: 'Dedicated A100 GPU cluster instance provided during hackathon weekend' }
    ],
    idealBuilderProfile: {
      capabilities: ['AI Security', 'Prompt Injection Analysis', 'Python / Docker', 'Agent Frameworks'],
      suggestedRoles: ['Security Researcher', 'AI Engineer', 'Systems Architect'],
      experienceLevel: 'Advanced to Expert'
    },
    recommendedBuilders: [INITIAL_BUILDERS[1], INITIAL_BUILDERS[3]],
    userReadiness: {
      score: 78,
      strengths: ['Systems Thinking', 'Risk Modeling', 'Documentation & Pitch'],
      gaps: ['Low-level Jailbreak Obfuscation'],
      whatToCloseGap: ['Form a team with Marcus Chen for the exploit execution scripts']
    },
    recommendedKnowledge: [
      {
        id: 'kn-7',
        title: 'Indirect Prompt Injection Attacks & Agent Defense Taxonomy',
        category: 'Article',
        duration: '16 min read',
        tag: 'AI Security',
        relevanceReason: 'Comprehensive survey of tool-calling vulnerabilities in modern LLMs.'
      }
    ],
    tags: ['Hackathon', 'AI Safety', 'Red Teaming', 'Cybersecurity', 'Agentic Systems'],
    createdAt: '2026-10-14',
    deadline: '2026-11-21'
  },
  {
    id: 'build-growth-calculators',
    title: 'Interactive ROI Calculators vs Gated Whitepapers for PLG Funnel',
    intent: 'run_experiment',
    type: 'growth_experiment',
    status: 'open',
    creator: {
      name: 'HyperGrowth Lab',
      organization: 'PLG Research Institute',
      type: 'lab',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=120',
      verified: true
    },
    domain: 'Growth & MarTech',
    duration: '21 days',
    teamSizeNeeded: 'Pair (2 builders)',
    difficulty: 'Intermediate',
    workMode: 'Remote',
    matchScore: 89,
    isExperiment: true,
    experimentDetails: {
      hypothesis: 'Embedding interactive ROI calculators that show personalized dollar savings in real-time will generate 3x higher sales-qualified leads than downloading static PDF whitepapers.',
      testDurationDays: 21,
      successMetric: '300% lift in bottom-funnel discovery call booking rate with identical traffic spend.',
      status: 'recruiting'
    },
    shortDescription: 'We are testing whether interactive micro-tools convert high-intent B2B enterprise buyers faster than traditional gated content. Help us design, code, and analyze a real multi-variant growth experiment.',
    challenge: {
      context: 'B2B marketing teams spend millions generating 30-page whitepapers that buyers download with disposable email addresses and never read.',
      currentSituation: 'Lead capture forms generate high vanity numbers but low demo conversion rates (sub-2%).',
      problem: 'Enterprise buyers want immediate, self-serve answers tailored to their specific company size and infrastructure stack.',
      whyItMatters: 'Shifting from static content to interactive micro-calculators fundamentally redefines high-efficiency PLG acquisition.',
      whatHasBeenTried: 'Ungated blog posts; generated traffic but failed to capture qualified intent signals.',
      constraints: [
        'Must integrate seamlessly with existing CRM webhook endpoints',
        'Micro-calculator must render in <500ms with zero layout shifts'
      ]
    },
    expectedOutcomes: [
      'Design modular interactive ROI calculator with customizable formula parameters',
      'Implement client-side scenario slider and dynamic chart generation',
      'Run split A/B test across 20,000 paid search visitors',
      'Publish conclusive case study with statistical significance breakdown'
    ],
    availableResources: [
      { name: 'Live Traffic Allocation', type: 'data', detail: '20,000 monthly target visitors from high-intent Google Search campaigns' },
      { name: 'A/B Testing Infrastructure', type: 'api', detail: 'Pre-configured feature flag and cohort analytics environment' }
    ],
    idealBuilderProfile: {
      capabilities: ['Growth Strategy', 'Frontend React Prototyping', 'Analytics & SQL', 'Conversion Copywriting'],
      suggestedRoles: ['Growth Strategist', 'Frontend Engineer', 'Product Designer'],
      experienceLevel: 'Intermediate'
    },
    recommendedBuilders: [INITIAL_BUILDERS[4], INITIAL_BUILDERS[2]],
    userReadiness: {
      score: 87,
      strengths: ['Growth Strategy', 'Funnel Analytics', 'A/B Testing'],
      gaps: ['Dynamic Charting Canvas Animations'],
      whatToCloseGap: ['Collaborate with Sarah Jenkins (@sjenkins_growth) to structure the statistical model']
    },
    recommendedKnowledge: [
      {
        id: 'kn-8',
        title: 'Micro-Tools as Growth Engines: The Engineering-as-Marketing Playbook',
        category: 'Case Study',
        duration: '12 min study',
        tag: 'Growth & PLG',
        relevanceReason: 'Real-world benchmarks on how interactive utilities drive self-serve pipeline.'
      }
    ],
    tags: ['Growth Experiment', 'PLG', 'Calculators', 'A/B Testing', 'Conversion'],
    createdAt: '2026-10-13',
    deadline: '2026-11-18'
  },
  {
    id: 'build-cobuilder-knowledge-graph',
    title: 'Building Local-First Encrypted Personal Knowledge Graph',
    intent: 'find_cobuilder',
    type: 'product_idea',
    status: 'recruiting',
    creator: {
      name: 'Maya Lin',
      organization: 'Independent Founder',
      type: 'individual',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
      verified: true
    },
    domain: 'Personal Knowledge & AI',
    duration: 'Ongoing / 4-week MVP',
    teamSizeNeeded: 'Looking for 2 Co-Builders',
    difficulty: 'Advanced',
    workMode: 'Remote',
    matchScore: 93,
    shortDescription: 'I’m building an AI-assisted personal thinking environment that connects reading notes, daily reflections, and meeting transcripts into a private, zero-knowledge encrypted knowledge graph. Looking for a Product Designer and AI Engineer co-builder.',
    challenge: {
      context: 'Knowledge workers use Notion, Obsidian, and Apple Notes, but notes remain siloed and passive. Most people write notes that are never looked at again.',
      currentSituation: 'Cloud AI note apps require uploading private journals to third-party servers, creating severe privacy concerns.',
      problem: 'We want local embedding search and automatic cross-link suggestions that happen strictly on-device without exposing sensitive thoughts to the cloud.',
      whyItMatters: 'A truly private, intelligent second brain will become an indispensable personal operating system for millions of thinkers.',
      whatHasBeenTried: 'Desktop Obsidian plugins exist, but they are clunky and lack clean modern design systems.',
      constraints: [
        'End-to-end zero-knowledge encryption model',
        'Works seamlessly across desktop and mobile browsers'
      ]
    },
    expectedOutcomes: [
      'Design clean, minimalist typographic interface with zero visual clutter',
      'Implement on-device WebAssembly vector similarity search',
      'Create automatic associative backlinks when drafting new thoughts',
      'Test private beta with 50 avid thinkers and writers'
    ],
    availableResources: [
      { name: 'Core Architecture Prototype', type: 'product', detail: 'Working SQLite/Wasm local storage layer with Markdown parsing engine' },
      { name: '500+ User Waitlist', type: 'users', detail: 'Active community of research enthusiasts eager to test early alphas' }
    ],
    idealBuilderProfile: {
      capabilities: ['Product Design', 'Local AI / Wasm', 'Product Strategy', 'Clean Typography'],
      suggestedRoles: ['Product Designer', 'AI Systems Engineer'],
      experienceLevel: 'Mid to Senior'
    },
    recommendedBuilders: [INITIAL_BUILDERS[2], INITIAL_BUILDERS[1]],
    userReadiness: {
      score: 85,
      strengths: ['Knowledge Systems', 'UX Thinking', 'Product Strategy'],
      gaps: ['Wasm Vector Embeddings'],
      whatToCloseGap: ['Review the Local-First Knowledge Systems blueprint in Knowledge Library']
    },
    recommendedKnowledge: [
      {
        id: 'kn-9',
        title: 'Local-First Embeddings & Zero-Knowledge Architecture',
        category: 'Framework',
        duration: '18 min read',
        tag: 'Privacy Tech',
        relevanceReason: 'How to run quantized sentence transformers directly in browser memory.'
      }
    ],
    tags: ['Co-Builder', 'Local-First', 'Knowledge Graph', 'Privacy', 'Second Brain'],
    createdAt: '2026-10-15',
    deadline: '2026-11-25'
  }
];

export const INITIAL_TEAMS: BuildTeam[] = [
  {
    id: 'team-saas-strike',
    name: 'SaaS Activation Strike Team',
    challengeId: 'build-saas-activation',
    challengeTitle: 'Increase B2B SaaS Activation Velocity',
    purpose: 'Forming a dedicated 3-week builder squad to redesign and validate self-serve enterprise workspace onboarding.',
    targetOutcome: 'Deliver working interactive setup flow prototype and validate 5% projected lift with 5 enterprise pilot accounts.',
    requiredCapabilities: ['Product Strategy', 'UX Architecture', 'Growth Analytics', 'React Prototyping'],
    teamFitScore: 91,
    fitStrengths: [
      'Comprehensive product strategy & growth telemetry expertise',
      'Strong typographic and design system foundation',
      'Demonstrated PLG activation lift in prior projects'
    ],
    fitGaps: [
      'Enterprise security / SOC2 compliance edge case review',
      'Backend schema migration'
    ],
    members: [
      { builder: INITIAL_BUILDERS[0], role: 'Product Lead', isLead: true, status: 'confirmed' },
      { builder: INITIAL_BUILDERS[2], role: 'Product Designer', isLead: false, status: 'confirmed' },
      { builder: INITIAL_BUILDERS[4], role: 'Growth Strategist', isLead: false, status: 'invited' }
    ],
    neededRoles: ['Fullstack Prototyper'],
    duration: '3 weeks',
    workMode: 'Remote (Async)',
    createdAt: '2026-10-13',
    status: 'recruiting'
  },
  {
    id: 'team-voice-code-review',
    name: 'Agentic Voice Review Squad',
    challengeId: 'build-voice-review-agent',
    challengeTitle: 'Can an Autonomous Voice Agent Conduct Technical Code Reviews?',
    purpose: 'Prototyping an interactive conversational audio reviewer for GitHub pull requests within 14 days.',
    targetOutcome: 'Sub-400ms audio loop with blinded evaluation across 10 real open-source repositories.',
    requiredCapabilities: ['AI Engineering', 'WebAudio Worklets', 'Dev Tools UX', 'Model Evaluation'],
    teamFitScore: 92,
    fitStrengths: [
      'Deep LLM agent and tool-use architecture experience',
      'Proven low-latency WebRTC and speech processing capabilities',
      'Rapid iterative prototype shipping cadence'
    ],
    fitGaps: [
      'Visual branding & marketing narrative'
    ],
    members: [
      { builder: INITIAL_BUILDERS[1], role: 'Lead AI Engineer', isLead: true, status: 'confirmed' },
      { builder: INITIAL_BUILDERS[5], role: 'Audio & Speech Specialist', isLead: false, status: 'confirmed' }
    ],
    neededRoles: ['Dev Tools Product Lead'],
    duration: '14 days',
    workMode: 'Remote',
    createdAt: '2026-10-14',
    status: 'recruiting'
  }
];

export const INITIAL_MY_BUILDS: MyBuildItem[] = [
  {
    id: 'my-build-1',
    opportunityId: 'build-voice-review-agent',
    title: 'Can an Autonomous Voice Agent Conduct Technical Code Reviews?',
    type: 'ai_experiment',
    status: 'active',
    role: 'Product Lead & Prompt Architect',
    team: ['Marcus Chen', 'Liam O’Connor', 'You (Alex Chen)'],
    nextMilestone: 'Sprint 1: Complete AST chunking parser & test WebAudio latency',
    deadline: 'Oct 28, 2026',
    contribution: 'Designed conversation state machine, structured tool-calling schemas, and created evaluation rubric.',
    skills: ['Product Strategy', 'LLM Prompt Engineering', 'Dev Tools', 'Experimentation'],
    date: 'Oct 2026',
    isExperiment: true,
    hasCareerEvidence: false
  },
  {
    id: 'my-build-2',
    opportunityId: 'build-growth-calculators',
    title: 'Interactive ROI Calculators vs Gated Whitepapers for PLG Funnel',
    type: 'growth_experiment',
    status: 'experiment',
    role: 'Growth Experimenter',
    team: ['Sarah Jenkins', 'You (Alex Chen)'],
    nextMilestone: 'Variant B live deployment across Google Ads search cohort',
    deadline: 'Nov 18, 2026',
    contribution: 'Authored value calculation logic and structured user survey questions.',
    skills: ['PLG', 'Funnel Analytics', 'A/B Testing'],
    date: 'Oct 2026',
    isExperiment: true,
    hasCareerEvidence: false
  },
  {
    id: 'my-build-3',
    title: 'Built AI Workflow Automation Prototype',
    type: 'product_challenge',
    status: 'completed',
    role: 'Product Lead',
    team: ['Dev Patel', 'Elena Rostova', 'You (Alex Chen)'],
    contribution: 'Led 3-week prototype sprint validating autonomous voice dispatch for ops teams with 12 enterprise design partners.',
    outcome: 'Reduced manual administrative ticket routing time by 40% across 1,200 simulated workflows.',
    metrics: '-40% manual workflow duration, 92% pilot user satisfaction',
    skills: ['Product Strategy', 'AI Agents', 'UX Research', 'Rapid Experimentation'],
    artifacts: [
      { name: 'Prototype Demo & Architecture Spec', url: '#', type: 'PDF' },
      { name: 'GitHub Sprint Repository', url: '#', type: 'Code' }
    ],
    date: 'Sept 2026',
    hasCareerEvidence: true,
    careerEvidence: {
      id: 'ce-workflow-proto',
      buildId: 'my-build-3',
      challenge: 'Enterprise operations teams spent 45 minutes manually triaging customer refund requests with high error rates.',
      role: 'Product Lead',
      whatBuilt: 'Engineered an interactive conversational copilot that ingests transaction context, verifies webhook security, and proposes one-click refund batches.',
      skills: ['Product Strategy', 'AI Tool-Use', 'UX Research', 'Experimentation'],
      duration: '3 weeks',
      outcome: 'Reduced manual ticket turnaround from 45 min to 8 min with zero security escalations across 12 pilot design partners.',
      metrics: '40% reduction in manual cycle time',
      teamMembers: ['Dev Patel (Architect)', 'Elena Rostova (Designer)', 'Alex Chen (Product Lead)'],
      artifacts: [
        { label: 'Interactive Demo Video', url: '#' },
        { label: 'Architecture & Security Spec', url: '#' }
      ],
      verifiedAt: '2026-09-28',
      readinessBoost: 8
    }
  }
];
