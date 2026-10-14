// =========================================================================
// CAREER OS - BUSINESS ENGLISH CURATED SEED DATA
// =========================================================================

import { 
  BusinessEnglishScenario, 
  VocabularyItem, 
  UserVocabularySet, 
  ShadowSpeakingLesson, 
  CommunicationPattern, 
  BusinessTopic, 
  DomainConcept 
} from '../types';

// -------------------------------------------------------------------------
// 1. REALISTIC WORKPLACE SCENARIOS (Hero Role-Play)
// -------------------------------------------------------------------------
export const SEED_SCENARIOS: BusinessEnglishScenario[] = [
  {
    id: 'sc-first-day-onboarding',
    title: 'First Day Onboarding & Introduction',
    situation: 'Introducing yourself to your new manager and immediate squad members during welcome coffee.',
    category: 'Meetings & Syncs',
    partnerRole: 'Manager',
    partnerName: 'Sarah Jenkins',
    partnerAvatarColor: 'from-blue-600 to-indigo-700',
    partnerTitle: 'Director of Product Engineering',
    seniority: 'Mid-Level Specialist',
    difficulty: 'Foundational',
    businessContext: 'Establishing rapport, setting positive first impressions, and asking clarifying questions about team cadence.',
    learningObjectives: [
      'Articulate your background crisply in under 60 seconds',
      'Express enthusiasm without sounding rehearsed',
      'Inquire about team norms, documentation, and immediate 30-day priorities'
    ],
    initialMessage: "Welcome to the team! We're thrilled to have you onboard. Why don't you share a bit about your background and what you're most excited to tackle first?",
    suggestedPhrases: [
      "Prior to joining, my focus was primarily on...",
      "I'm eager to get up to speed on your current sprint priorities.",
      "What are the best resources to dive into during my first 48 hours?"
    ],
    expectedTone: 'Warm, professional, engaged, and structured.'
  },
  {
    id: 'sc-weekly-project-update',
    title: 'Giving a Crisp Sprint & Project Update',
    situation: 'Standup/Weekly sync update covering progress, blockers, and dependencies across squads.',
    category: 'Project Management & Delivery',
    partnerRole: 'Product Manager',
    partnerName: 'David Vance',
    partnerAvatarColor: 'from-amber-600 to-orange-700',
    partnerTitle: 'Principal Technical PM',
    seniority: 'Senior Professional',
    difficulty: 'Intermediate',
    businessContext: 'Communicating status effectively using the PPP framework (Progress, Plans, Problems) without rambling.',
    learningObjectives: [
      'Summarize key milestones completed this week',
      'Flag cross-functional dependencies transparently',
      'State estimated delivery timelines with confidence intervals'
    ],
    initialMessage: "Hey everyone. Let's run through our deliverables. David, could you walk us through where we stand on the payment gateway migration?",
    suggestedPhrases: [
      "On the payment migration front, we achieved our first milestone yesterday.",
      "The primary bottleneck right now is awaiting security audit approval.",
      "Assuming the sign-off lands by Thursday, we remain on track for staging release."
    ],
    expectedTone: 'Direct, structured, metrics-aware, and proactive.'
  },
  {
    id: 'sc-explaining-delay',
    title: 'Explaining a Delivery Delay & Proposing Mitigation',
    situation: 'Informing cross-functional leadership that a critical milestone will slip by one sprint.',
    category: 'Project Management & Delivery',
    partnerRole: 'Executive Sponsor',
    partnerName: 'Elena Rostova',
    partnerAvatarColor: 'from-purple-600 to-indigo-800',
    partnerTitle: 'VP of Product Strategy',
    seniority: 'Senior Professional',
    difficulty: 'Advanced',
    businessContext: 'Delivering bad news professionally: own the issue, explain the root cause, and present two viable mitigation options.',
    learningObjectives: [
      'Lead with the bottom line (BLUF: Bottom Line Up Front)',
      'Explain technical friction without sounding defensive',
      'Offer phased release or scope de-scoping proposals'
    ],
    initialMessage: "Thanks for meeting on short notice. I saw your notification about the Q3 mobile app launch date. What is our actual status, and why the sudden variance?",
    suggestedPhrases: [
      "To be completely transparent upfront, we are tracking 7 days behind our target date.",
      "The delay stems from an unpredicted rate-limit bottleneck in the third-party KYC vendor API.",
      "Rather than postponing the entire launch, I propose shipping Phase 1 with automated failover."
    ],
    expectedTone: 'Accountable, calm, solution-oriented, and decisive.'
  },
  {
    id: 'sc-disagreeing-professionally',
    title: 'Disagreeing Professionally on Technical Direction',
    situation: 'Challenging an architecture proposal during a design review without creating interpersonal friction.',
    category: 'Conflict & Negotiation',
    partnerRole: 'Engineering Lead',
    partnerName: 'Marcus Wright',
    partnerAvatarColor: 'from-emerald-600 to-teal-800',
    partnerTitle: 'Staff Infrastructure Architect',
    seniority: 'Lead / Principal',
    difficulty: 'Advanced',
    businessContext: 'Using diplomatic inquiry and data-backed counterproposals to challenge assumptions respectfully.',
    learningObjectives: [
      'Acknowledge the merits of the opposing view first',
      'Frame concerns around maintenance costs, latency, or scalability',
      'Use hypothetical framing ("What if we considered...") instead of confrontational phrases'
    ],
    initialMessage: "I really think we should mandate micro-frontends across all five client repos for Q4. It gives squads full autonomy.",
    suggestedPhrases: [
      "I definitely see the upside in squad autonomy, Marcus.",
      "My main reservation is the operational overhead in managing separate build pipelines right now.",
      "Could we consider a modular monolith approach first and benchmark bundle sizes before committing?"
    ],
    expectedTone: 'Diplomatic, evidence-based, collaborative, and constructive.'
  },
  {
    id: 'sc-pushing-back-scope',
    title: 'Pushing Back on Unplanned Scope Requests',
    situation: 'A business stakeholder asks to add three urgent features two weeks before code freeze.',
    category: 'Stakeholder Alignment',
    partnerRole: 'Cross-functional Stakeholder',
    partnerName: 'Rachel Kim',
    partnerAvatarColor: 'from-rose-600 to-pink-700',
    partnerTitle: 'Head of Growth Marketing',
    seniority: 'Senior Professional',
    difficulty: 'Intermediate',
    businessContext: 'Managing expectations and trade-offs politely without a hard negative rejection.',
    learningObjectives: [
      'Validate stakeholder urgency and commercial goals',
      'Make trade-offs explicit: Time, Quality, or Scope',
      'Offer Fast-Follow (Phase 1.5) release options'
    ],
    initialMessage: "We just finished our growth audit, and we absolutely need the custom referral engine and referral tier tracker in next week's release. Can we squeeze that in?",
    suggestedPhrases: [
      "I appreciate why this referral engine is top-of-mind for the campaign launch, Rachel.",
      "Our current sprint capacity is already locked with checkout latency optimization.",
      "If this is the #1 priority, we could swap out the localized receipt generator, or schedule this as a fast-follow for sprint 24."
    ],
    expectedTone: 'Empathetic, firm on capacity, transparent on trade-offs.'
  },
  {
    id: 'sc-explaining-tech-tradeoffs',
    title: 'Explaining Technical Trade-offs to Non-Tech Leaders',
    situation: 'Explaining why rebuilding legacy technical debt will slow feature velocity in the short term.',
    category: 'Technical Trade-offs',
    partnerRole: 'Manager',
    partnerName: 'Jonathan Hayes',
    partnerAvatarColor: 'from-cyan-600 to-blue-800',
    partnerTitle: 'General Manager & SVP',
    seniority: 'Lead / Principal',
    difficulty: 'Executive',
    businessContext: 'Translating engineering health into commercial terms: risk mitigation, cost-to-serve, and long-term velocity.',
    learningObjectives: [
      'Use non-technical business metaphors',
      'Quantify the operational risk of inaction',
      'Present a balanced roadmap with measurable payback periods'
    ],
    initialMessage: "Looking over your team's Q4 proposal, you're asking to spend 30% of engineering bandwidth on 'database refactoring'. Can you help me understand the ROI on this versus shipping customer-facing features?",
    suggestedPhrases: [
      "To put it in commercial terms, our current database architecture is running near 85% capacity during peak hours.",
      "If we don't address this technical debt now, our cost-to-serve will jump and outage risk increases by 4x during Black Friday.",
      "Investing two sprints now protects our 99.99% SLA and accelerates future feature delivery by 20%."
    ],
    expectedTone: 'Commercially astute, clear, articulate, and confident.'
  },
  {
    id: 'sc-presenting-metrics',
    title: 'Presenting Metrics & Quarterly Business Results',
    situation: 'Presenting key performance indicators (KPIs) and conversion gains to an executive committee.',
    category: 'Presentations & Pitches',
    partnerRole: 'Executive Sponsor',
    partnerName: 'Sophia Sterling',
    partnerAvatarColor: 'from-amber-500 to-orange-800',
    partnerTitle: 'Chief Operating Officer',
    seniority: 'Manager / Director',
    difficulty: 'Executive',
    businessContext: 'Delivering an executive summary with high signal-to-noise ratio, focusing on variance and underlying drivers.',
    learningObjectives: [
      'Deliver the key takeaway before delving into granular charts',
      'Explain positive and negative variances with underlying drivers',
      'Close with clear strategic recommendations'
    ],
    initialMessage: "Welcome Sophia. We're ready for your quarterly read-out. Please highlight our primary wins and the areas that fell short of plan.",
    suggestedPhrases: [
      "Overall, we exceeded our topline customer acquisition target by 14%, finishing at 112,000 active accounts.",
      "The standout driver was the organic referral loop we deployed in June.",
      "However, 30-day retention dipped 2.3% due to onboarding friction on Android, which we have already prioritized for remediation."
    ],
    expectedTone: 'Polished, authoritative, data-driven, and crisp.'
  },
  {
    id: 'sc-giving-feedback',
    title: 'Delivering Constructive Feedback to a Colleague',
    situation: 'Providing feedback to a peer who frequently submits pull requests without automated tests.',
    category: 'Feedback & Performance',
    partnerRole: 'Teammate / Peer',
    partnerName: 'Alex Mercer',
    partnerAvatarColor: 'from-violet-600 to-indigo-700',
    partnerTitle: 'Senior Software Engineer',
    seniority: 'Senior Professional',
    difficulty: 'Intermediate',
    businessContext: 'Using the SBI (Situation-Behavior-Impact) model to give actionable feedback without triggering defensiveness.',
    learningObjectives: [
      'Focus strictly on observable behaviors rather than personality traits',
      'Illustrate the team impact clearly and objectively',
      'Invite their perspective and co-create a standard'
    ],
    initialMessage: "Hey, thanks for setting up this 1-on-1. You mentioned you wanted to sync about our code review process?",
    suggestedPhrases: [
      "Thanks for making time, Alex. I wanted to chat about how we can streamline PR reviews across the squad.",
      "In the last two sprints, several critical PRs were merged without integration tests, which led to regression bugs in staging.",
      "How do you feel about pairing on our CI pipeline templates so we can automate these checks upfront?"
    ],
    expectedTone: 'Empathetic, clear, objective, and solution-focused.'
  }
];

// -------------------------------------------------------------------------
// 2. CURATED VOCABULARY BANK (Organized by Context)
// -------------------------------------------------------------------------
export const SEED_VOCABULARY: VocabularyItem[] = [
  {
    id: 'voc-stakeholder-alignment',
    term: 'Stakeholder Alignment',
    meaning: 'Ensuring that all cross-functional partners and decision-makers share the same understanding, priorities, and expectations.',
    businessContext: 'Crucial before committing roadmap items or launching cross-departmental programs.',
    naturalUsage: 'Used frequently in planning cycles, roadmap negotiations, and executive briefings.',
    relatedPhrases: ['Buy-in', 'Shared consensus', 'Cross-functional agreement'],
    difficulty: 'Intermediate',
    domain: 'Business & Strategy',
    contextCategory: 'Stakeholder Management',
    exampleSentences: [
      "We need to get stakeholder alignment across sales and product before announcing the pricing shift.",
      "Achieving stakeholder alignment early prevented costly mid-flight reversals."
    ],
    synonyms: ['Cross-functional consensus', 'Executive buy-in']
  },
  {
    id: 'voc-scope-creep',
    term: 'Scope Creep',
    meaning: 'The gradual and uncontrolled expansion of project deliverables beyond the agreed-upon initial boundaries.',
    businessContext: 'The primary reason software projects exceed deadlines and budget allocations.',
    naturalUsage: 'Commonly raised during sprint reviews and client negotiations when new requests arise.',
    relatedPhrases: ['Feature creep', 'Unplanned work', 'Gold-plating'],
    difficulty: 'Intermediate',
    domain: 'Product',
    contextCategory: 'Project Management',
    exampleSentences: [
      "To prevent scope creep, we strictly deferred additional UI widgets to Phase 2.",
      "The main risk to our delivery date is scope creep from the regional marketing teams."
    ]
  },
  {
    id: 'voc-trade-off',
    term: 'Trade-off',
    meaning: 'A strategic compromise where you sacrifice one desirable outcome (e.g. speed) to gain another (e.g. reliability).',
    businessContext: 'Core to engineering architecture, resource allocation, and product strategy.',
    naturalUsage: 'Standard in senior leadership discussions to make implicit sacrifices explicit.',
    relatedPhrases: ['Opportunity cost', 'Compromise', 'Prioritization matrix'],
    difficulty: 'Foundational',
    domain: 'Software Engineering',
    contextCategory: 'Engineering',
    exampleSentences: [
      "I'd suggest we make the trade-off explicit: faster time-to-market now in exchange for a tech debt payoff sprint in Q2.",
      "Every architecture decision involves a trade-off between latency, cost, and maintainability."
    ]
  },
  {
    id: 'voc-push-back',
    term: 'Push Back',
    meaning: 'To resist, question, or professionally disagree with a proposal, deadline, or unreasonable request.',
    businessContext: 'Essential skill for protecting team bandwidth and maintaining high technical quality.',
    naturalUsage: 'Used in 1-on-1s, sprint planning, and client management.',
    relatedPhrases: ['Challenge assumptions', 'Set boundaries', 'Counter-propose'],
    difficulty: 'Foundational',
    domain: 'Workplace Communication',
    contextCategory: 'Workplace Communication',
    exampleSentences: [
      "I had to push back on the aggressive timeline because security testing cannot be compromised.",
      "Don't hesitate to push back if the client asks for deliverables outside our statement of work."
    ]
  },
  {
    id: 'voc-bluf',
    term: 'BLUF (Bottom Line Up Front)',
    meaning: 'The practice of starting a communication with the conclusion or decision before providing supporting background.',
    businessContext: 'Mandatory standard for executive updates, async memos, and high-urgency notifications.',
    naturalUsage: 'Used in email subject lines, Slack headers, and executive briefings.',
    relatedPhrases: ['Executive summary', 'Core takeaway', 'Lead with the answer'],
    difficulty: 'Advanced',
    domain: 'Workplace Communication',
    contextCategory: 'Workplace Communication',
    exampleSentences: [
      "BLUF: We recommend migrating our cloud host by November to reduce infra expenditure by 22%.",
      "Executive leaders prefer BLUF formatting so they can make rapid go/no-go calls."
    ]
  },
  {
    id: 'voc-bandwidth',
    term: 'Bandwidth',
    meaning: 'Personal or team capacity and availability to take on additional work or cognitive load.',
    businessContext: 'Everyday workplace shorthand for scheduling, task intake, and burnout prevention.',
    naturalUsage: 'Extremely frequent in agile standups, project syncs, and 1-on-1s.',
    relatedPhrases: ['Capacity', 'Availability', 'Workload allocation'],
    difficulty: 'Foundational',
    domain: 'Operations',
    contextCategory: 'Meetings',
    exampleSentences: [
      "Our team doesn't currently have the bandwidth to support another ad-hoc analytics dashboard.",
      "Let's assess our sprint bandwidth before committing to the partner integration."
    ]
  },
  {
    id: 'voc-double-down',
    term: 'Double Down',
    meaning: 'To significantly increase commitment, capital, or effort behind a strategy that is showing early success.',
    businessContext: 'Used in strategic planning when an experiment yields positive customer signals.',
    naturalUsage: 'Common in marketing strategy, product investments, and venture pitches.',
    relatedPhrases: ['Scale up', 'Reinforce', 'Capitalize on momentum'],
    difficulty: 'Intermediate',
    domain: 'Business & Strategy',
    contextCategory: 'Strategy',
    exampleSentences: [
      "Given the 40% organic lift, we should double down on in-app viral referrals.",
      "Rather than spreading ourselves thin across four channels, let's double down on B2B partnerships."
    ]
  },
  {
    id: 'voc-table-the-discussion',
    term: 'Table the Discussion',
    meaning: 'To postpone or park a conversation for a later time or dedicated follow-up session.',
    businessContext: 'Helps keep meetings on schedule and prevents rabbit holes during group syncs.',
    naturalUsage: 'Meeting moderation phrase used by PMs, tech leads, and facilitators.',
    relatedPhrases: ['Park this topic', 'Take it offline', 'Defer to next agenda'],
    difficulty: 'Intermediate',
    domain: 'Meetings',
    contextCategory: 'Meetings',
    exampleSentences: [
      "In the interest of time, let's table this discussion and schedule a 30-minute deep dive on Thursday.",
      "I recommend we table the frontend styling debate until we finalize the core API schema."
    ]
  },
  {
    id: 'voc-buy-in',
    term: 'Buy-in',
    meaning: 'Active agreement, support, and psychological endorsement from leadership or affected peers.',
    businessContext: 'Essential for organizational change, architectural pivots, and product releases.',
    naturalUsage: 'Standard phrase in change management and strategy.',
    relatedPhrases: ['Sponsorship', 'Endorsement', 'Consensus'],
    difficulty: 'Foundational',
    domain: 'Stakeholder Management',
    contextCategory: 'Stakeholder Management',
    exampleSentences: [
      "Before rolling out the new linting rules, we secured buy-in from all five squad leads.",
      "Without executive buy-in, the digital transformation initiative stalled within two months."
    ]
  },
  {
    id: 'voc-guardrails',
    term: 'Guardrails',
    meaning: 'Predefined rules, safety boundaries, or automated limits that prevent catastrophic errors while enabling autonomy.',
    businessContext: 'Used widely in software architecture, risk management, and team governance.',
    naturalUsage: 'Used by engineering leaders, compliance teams, and directors.',
    relatedPhrases: ['Safety constraints', 'Operational limits', 'Governance bounds'],
    difficulty: 'Advanced',
    domain: 'Technology',
    contextCategory: 'Engineering',
    exampleSentences: [
      "We established budget guardrails so automated cloud scaling wouldn't exceed our monthly quota.",
      "The goal is to give developers fast shipping cadence while enforcing strict security guardrails."
    ]
  },
  {
    id: 'voc-table-stakes',
    term: 'Table Stakes',
    meaning: 'The minimum baseline features or qualifications required just to compete in a market.',
    businessContext: 'Distinguishes baseline hygiene requirements from true competitive differentiators.',
    naturalUsage: 'Used in competitive analysis and product requirements documents (PRDs).',
    relatedPhrases: ['Baseline requirements', 'Minimum viable criteria', 'Must-haves'],
    difficulty: 'Intermediate',
    domain: 'Product',
    contextCategory: 'Product',
    exampleSentences: [
      "Two-factor authentication and SOC2 compliance are table stakes for any enterprise B2B SaaS.",
      "Real-time notifications used to be a differentiator, but today they are table stakes."
    ]
  },
  {
    id: 'voc-unit-economics',
    term: 'Unit Economics',
    meaning: 'The direct revenues and costs associated with a single unit of business (e.g. per customer or per transaction).',
    businessContext: 'Determines whether a business model can scale profitably over time.',
    naturalUsage: 'Used in investor pitches, finance reviews, and growth strategy.',
    relatedPhrases: ['LTV/CAC ratio', 'Contribution margin', 'Payback period'],
    difficulty: 'Advanced',
    domain: 'Finance',
    contextCategory: 'Finance',
    exampleSentences: [
      "Our customer acquisition cost declined by 18%, significantly improving our overall unit economics.",
      "Before expanding into Europe, we need to prove that our unit economics remain positive under localized logistics."
    ]
  }
];

// -------------------------------------------------------------------------
// 3. INITIAL USER-CREATED VOCABULARY SETS (Persistent in Storage)
// -------------------------------------------------------------------------
export const INITIAL_USER_VOCABULARY_SETS: UserVocabularySet[] = [
  {
    id: 'set-executive-alignment',
    title: 'Executive Alignment & Scope Discipline',
    description: 'High-leverage phrases for managing executive expectations and preventing feature creep.',
    domainTag: 'Strategy & Product',
    terms: ['stakeholder alignment', 'scope creep', 'trade-off', 'push back'],
    exampleSentences: [
      {
        term: 'stakeholder alignment',
        sentence: 'We must secure stakeholder alignment across marketing and engineering before committing to the launch date.',
        context: 'Quarterly roadmap sync'
      },
      {
        term: 'scope creep',
        sentence: 'Adding custom PDF exports at this late stage is a classic case of scope creep.',
        context: 'Sprint backlog grooming'
      },
      {
        term: 'trade-off',
        sentence: 'I suggest we make the trade-off explicit: faster delivery now versus increased technical debt later.',
        context: 'Architecture review'
      },
      {
        term: 'push back',
        sentence: 'The team will push back on this request unless we deprioritize an equivalent item from the backlog.',
        context: 'Stakeholder negotiation'
      }
    ],
    generatedDialogue: [
      {
        speaker: 'Marcus (VP Product)',
        role: 'Executive Sponsor',
        text: "Can we sneak in three new reporting widgets before next Friday's client showcase?",
        highlightedTerms: []
      },
      {
        speaker: 'You (Senior Lead)',
        role: 'You',
        text: "Marcus, our current priority is finalizing the core API. Adding those widgets introduces severe scope creep. I suggest we push back on extra widgets to protect our trade-off on reliability. Once we have stakeholder alignment on Phase 1, we can tackle them immediately.",
        highlightedTerms: ['scope creep', 'push back', 'trade-off', 'stakeholder alignment']
      }
    ],
    createdAt: '2026-09-08T14:30:00.000Z',
    lastPracticed: '2026-09-09T18:15:00.000Z',
    isSyncedToProfile: true
  },
  {
    id: 'set-tech-debt-negotiation',
    title: 'Technical Debt & Architectural Defense',
    description: 'Crisp vocabulary to articulate engineering trade-offs to business stakeholders.',
    domainTag: 'Software Engineering',
    terms: ['guardrails', 'bandwidth', 'table stakes', 'double down'],
    exampleSentences: [
      {
        term: 'guardrails',
        sentence: 'We have put automated guardrails in place to ensure database CPU stays below 70%.',
        context: 'Infra post-mortem'
      },
      {
        term: 'bandwidth',
        sentence: 'Our DevOps team has zero bandwidth to take on ad-hoc CI pipelines this sprint.',
        context: 'Capacity planning'
      },
      {
        term: 'table stakes',
        sentence: 'Automated rollbacks are table stakes for a tier-1 banking application.',
        context: 'Architecture review'
      },
      {
        term: 'double down',
        sentence: 'Let us double down on synthetic monitoring before onboarding more enterprise tenants.',
        context: 'Reliability sprint'
      }
    ],
    generatedDialogue: [
      {
        speaker: 'Sarah (Director of Engineering)',
        role: 'Manager',
        text: "How are we ensuring this migration won't destabilize live transactions?",
        highlightedTerms: []
      },
      {
        speaker: 'You (Tech Lead)',
        role: 'You',
        text: "We established strict automated guardrails at the edge. Automated rollbacks are table stakes for us. Our bandwidth is concentrated on this rollout, and we plan to double down on load testing tomorrow.",
        highlightedTerms: ['guardrails', 'table stakes', 'bandwidth', 'double down']
      }
    ],
    createdAt: '2026-09-09T09:00:00.000Z',
    isSyncedToProfile: true
  }
];

// -------------------------------------------------------------------------
// 4. SHADOW SPEAKING PRACTICE MODULES
// -------------------------------------------------------------------------
export const SEED_SHADOW_LESSONS: ShadowSpeakingLesson[] = [
  {
    id: 'sh-opening-meeting',
    title: 'Opening a Cross-Functional Meeting with Authority',
    topic: 'Opening a Meeting',
    scenario: 'Kicking off a high-stakes alignment call with 12 attendees across engineering and product.',
    difficulty: 'Foundational',
    durationSeconds: 45,
    contextBackground: 'Establishes clear agenda control, time boundaries, and psychological safety.',
    learningFocus: 'Rhythm, confident cadence, and natural breath-pausing between clauses.',
    lines: [
      {
        id: 'sh-line-1',
        speaker: 'Meeting Host',
        role: 'Facilitator',
        text: "Thanks everyone for hopping on right at the top of the hour.",
        naturalGrouping: ["Thanks everyone", "for hopping on", "right at the top of the hour."],
        stressWords: ["Thanks", "hopping", "top", "hour"],
        pausePoints: ["after 'everyone'", "after 'on'"],
        phoneticsHint: "Link 'hopping on' -> /hɒpɪŋɒn/. Stress 'top' and 'hour'."
      },
      {
        id: 'sh-line-2',
        speaker: 'Meeting Host',
        role: 'Facilitator',
        text: "Our single objective today is to finalize the launch scope for Q4.",
        naturalGrouping: ["Our single objective today", "is to finalize", "the launch scope for Q4."],
        stressWords: ["single", "objective", "finalize", "scope", "Q4"],
        pausePoints: ["after 'today'", "after 'finalize'"],
        phoneticsHint: "Drop pitch slightly on 'Q4' to signal definitive closing."
      },
      {
        id: 'sh-line-3',
        speaker: 'Meeting Host',
        role: 'Facilitator',
        text: "We have 30 minutes, so let's jump straight into the decision matrix.",
        naturalGrouping: ["We have 30 minutes,", "so let's jump straight", "into the decision matrix."],
        stressWords: ["30", "minutes", "straight", "decision", "matrix"],
        pausePoints: ["after 'minutes'", "after 'straight'"],
        phoneticsHint: "Blend 'jump straight' with energetic upward inflection."
      }
    ]
  },
  {
    id: 'sh-disagreeing-politely',
    title: 'Disagreeing Professionally in a Design Critique',
    topic: 'Disagreeing Politely',
    scenario: 'Politely redirecting a peer who suggests skipping security verification for speed.',
    difficulty: 'Intermediate',
    durationSeconds: 50,
    contextBackground: 'Demonstrates professional diplomacy: validate first, insert friction softly, recommend alternative.',
    learningFocus: 'Softened intonation, diplomatic modal verbs (could, would, might), empathetic pause.',
    lines: [
      {
        id: 'sh-line-4',
        speaker: 'Senior Engineer',
        role: 'Peer',
        text: "I understand the rationale behind shipping early to beat the competitor to market.",
        naturalGrouping: ["I understand the rationale", "behind shipping early", "to beat the competitor to market."],
        stressWords: ["understand", "rationale", "shipping", "beat", "competitor"],
        pausePoints: ["after 'rationale'", "after 'early'"],
        phoneticsHint: "Keep tone warm on 'understand' to avoid appearing dismissive."
      },
      {
        id: 'sh-line-5',
        speaker: 'Senior Engineer',
        role: 'Peer',
        text: "However, based on our compliance telemetry, bypassing the token audit carries substantial downside risk.",
        naturalGrouping: ["However,", "based on our compliance telemetry,", "bypassing the token audit", "carries substantial downside risk."],
        stressWords: ["However", "telemetry", "bypassing", "substantial", "downside"],
        pausePoints: ["after 'However'", "after 'telemetry'", "after 'audit'"],
        phoneticsHint: "Pause deliberately after 'However' for gravitas."
      },
      {
        id: 'sh-line-6',
        speaker: 'Senior Engineer',
        role: 'Peer',
        text: "What if we parallelize the security scan so we don't lose a single business day?",
        naturalGrouping: ["What if we parallelize", "the security scan", "so we don't lose a single business day?"],
        stressWords: ["What if", "parallelize", "security", "single", "day"],
        pausePoints: ["after 'parallelize'", "after 'scan'"],
        phoneticsHint: "Rising question intonation on 'business day?' inviting collaboration."
      }
    ]
  },
  {
    id: 'sh-presenting-result',
    title: 'Presenting a High-Impact Business Result to Executives',
    topic: 'Presenting a Result',
    scenario: 'Delivering the lead impact statement during an executive review session.',
    difficulty: 'Executive',
    durationSeconds: 40,
    contextBackground: 'Combines authoritative pacing with numerical precision and bottom-line impact.',
    learningFocus: 'Downward terminal pitch, clean enunciations of percentages, and confident pause.',
    lines: [
      {
        id: 'sh-line-7',
        speaker: 'Product Lead',
        role: 'Presenter',
        text: "BLUF: The checkout redesign delivered an immediate fourteen percent bump in paid conversions.",
        naturalGrouping: ["BLUF:", "The checkout redesign", "delivered an immediate", "fourteen percent bump", "in paid conversions."],
        stressWords: ["BLUF", "redesign", "immediate", "fourteen", "paid", "conversions"],
        pausePoints: ["after 'BLUF'", "after 'redesign'", "after 'bump'"],
        phoneticsHint: "Articulate 'fourteen' distinctly from 'forty' by stressing the second syllable."
      },
      {
        id: 'sh-line-8',
        speaker: 'Product Lead',
        role: 'Presenter',
        text: "This directly translates to an annualized run-rate lift of one point two million dollars.",
        naturalGrouping: ["This directly translates", "to an annualized run-rate lift", "of one point two million dollars."],
        stressWords: ["directly", "translates", "annualized", "one point two", "million"],
        pausePoints: ["after 'translates'", "after 'lift'"],
        phoneticsHint: "Steady, rhythmic delivery. Avoid rushing through the financial metric."
      }
    ]
  }
];

// -------------------------------------------------------------------------
// 5. TOPICS & INSPIRATION (Practical Workplace Discussion Library)
// -------------------------------------------------------------------------
export const SEED_TOPICS: BusinessTopic[] = [
  {
    id: 'top-ai-adoption',
    title: 'Enterprise AI Adoption: Guardrails vs Velocity',
    category: 'Technology & Strategy',
    shortContext: 'Companies are balancing rapid developer adoption of LLM coding copilots with strict data privacy and intellectual property compliance.',
    whyItMatters: 'Every tech leader must be able to articulate the balance between speed and enterprise risk.',
    keyVocabulary: ['enterprise guardrails', 'data exfiltration', 'productivity multiplier', 'hallucination tolerance', 'vendor lock-in'],
    usefulPhrases: [
      "We want to empower engineers while maintaining strict zero-data-retention agreements.",
      "The ROI isn't just lines of code; it's reducing cycle time on automated tests.",
      "What is our risk posture regarding proprietary code ingestion?"
    ],
    discussionQuestions: [
      "How does your organization balance developer velocity against IP leakage?",
      "What metrics would you use to measure genuine engineering productivity gains from AI?"
    ],
    relatedScenarioId: 'sc-explaining-tech-tradeoffs',
    relatedDomain: 'AI & Machine Learning',
    readTimeMinutes: 3
  },
  {
    id: 'top-remote-productivity',
    title: 'Async Work Culture & Team Morale',
    category: 'People & Operations',
    shortContext: 'Transitioning from synchronous meeting-heavy culture to structured async documentation, PRDs, and RFCs.',
    whyItMatters: 'Async communication skills directly differentiate high-performing remote leaders.',
    keyVocabulary: ['async-first', 'cognitive overload', 'documentation debt', 'meeting hygiene', 'context switching'],
    usefulPhrases: [
      "If this topic doesn't require real-time debate, let's circulate an async memo first.",
      "We've established 'No-Meeting Wednesdays' to protect uninterrupted deep-work blocks.",
      "High-context documentation accelerates cross-timezone collaboration."
    ],
    discussionQuestions: [
      "How do you distinguish between issues that require a live call versus an async RFC?",
      "What strategies prevent async communication from turning into notification fatigue?"
    ],
    relatedScenarioId: 'sc-weekly-project-update',
    relatedDomain: 'Operations',
    readTimeMinutes: 4
  },
  {
    id: 'top-saas-metrics',
    title: 'SaaS Unit Economics & Net Revenue Retention',
    category: 'Finance & Strategy',
    shortContext: 'With shifting macroeconomic conditions, SaaS companies prioritize efficient growth, low CAC, and high NRR over hyper-scaling at all costs.',
    whyItMatters: 'Senior professionals across product, tech, and marketing must understand commercial levers.',
    keyVocabulary: ['Net Revenue Retention (NRR)', 'Customer Acquisition Cost (CAC)', 'LTV to CAC ratio', 'Churn mitigation', 'Expansion revenue'],
    usefulPhrases: [
      "Our expansion revenue from enterprise tiers is outpacing logo churn.",
      "We need to shorten the CAC payback period from 18 months down to 11 months.",
      "Retention is the ultimate validation of product-market fit."
    ],
    discussionQuestions: [
      "How do product decisions directly influence Net Revenue Retention?",
      "When is it justified to accept higher CAC to secure market dominance?"
    ],
    relatedScenarioId: 'sc-presenting-metrics',
    relatedDomain: 'Finance',
    readTimeMinutes: 4
  },
  {
    id: 'top-tech-debt-management',
    title: 'Managing Technical Debt in Fast-Growth Products',
    category: 'Software Engineering',
    shortContext: 'Balancing short-term feature delivery for sales wins versus long-term architectural stability and refactoring.',
    whyItMatters: 'Engineering and product managers frequently clash over tech debt allocation.',
    keyVocabulary: ['debt service', 'system entropy', 'code maintainability', 'refactoring sprint', 'outage surface area'],
    usefulPhrases: [
      "Tech debt isn't bad code; it's a financial loan we took out to ship early that now requires interest payments.",
      "We allocate 20% of every sprint buffer specifically for reliability and debt retirement.",
      "Unaddressed debt will compound until our release cadence slows to a crawl."
    ],
    discussionQuestions: [
      "How do you quantify technical debt in commercial terms for non-technical executives?",
      "What framework do you use to prioritize bug fixes against new feature requests?"
    ],
    relatedScenarioId: 'sc-explaining-tech-tradeoffs',
    relatedDomain: 'Software Engineering',
    readTimeMinutes: 3
  }
];

// -------------------------------------------------------------------------
// 6. DOMAIN KNOWLEDGE & BUSINESS TERMINOLOGY (11 Core Domains)
// -------------------------------------------------------------------------
export const SEED_DOMAIN_CONCEPTS: DomainConcept[] = [
  {
    id: 'dom-fin-unit-economics',
    domain: 'Finance',
    conceptName: 'Unit Economics & Contribution Margin',
    plainEnglishExplanation: 'Looking at how much profit or loss you make on a single transaction or single customer, before company-wide overhead costs.',
    businessMeaning: 'Validates whether a business will generate real cash as it grows, or whether it simply loses more money at scale.',
    commonWorkplaceUsage: 'Discussed in board meetings, quarterly business reviews (QBRs), and pricing committee syncs.',
    relatedTerminology: ['LTV (Lifetime Value)', 'CAC (Customer Acquisition Cost)', 'Gross Margin', 'Payback Window'],
    exampleSentences: [
      "If our unit economics are negative after factoring in cloud hosting, scaling users will accelerate our cash burn.",
      "The CFO asked for a breakdown of contribution margin per active subscriber."
    ],
    exampleMeetingUsage: "Let's review our unit economics before committing 500k to the paid marketing campaign.",
    relatedRoles: ['Product Manager', 'Business Analyst', 'Finance Director', 'Executive']
  },
  {
    id: 'dom-prod-discovery',
    domain: 'Product',
    conceptName: 'Product Discovery vs Delivery',
    plainEnglishExplanation: 'Discovery is figuring out WHAT to build (customer problem & value); delivery is figuring out HOW to build it and shipping on time.',
    businessMeaning: 'Prevents engineering teams from building polished, high-performing software that nobody actually wants or buys.',
    commonWorkplaceUsage: 'Used by PMs, UX researchers, and engineering leads during roadmap planning.',
    relatedTerminology: ['Opportunity Solution Tree', 'Customer Interviews', 'Prototyping', 'Validation Experiments'],
    exampleSentences: [
      "We spent three weeks in continuous discovery to validate that enterprise users truly need automated reconciliation.",
      "Our delivery cadence is solid, but our discovery process needs sharper customer feedback loops."
    ],
    exampleMeetingUsage: "Let's pause delivery on this epic until the discovery interviews confirm customer willingness to pay.",
    relatedRoles: ['Product Manager', 'UX Designer', 'Tech Lead', 'Growth Lead']
  },
  {
    id: 'dom-eng-idempotency',
    domain: 'Software Engineering',
    conceptName: 'Idempotency in Distributed Systems',
    plainEnglishExplanation: 'Designing an operation so that calling it multiple times has the exact same result as calling it just once.',
    businessMeaning: 'Critical for payment processing, billing systems, and messaging where duplicate network requests could accidentally double-charge customers.',
    commonWorkplaceUsage: 'Standard topic in architecture reviews, RFCs, and incident post-mortems.',
    relatedTerminology: ['Idempotency Key', 'Distributed Lock', 'Exactly-Once Semantics', 'Reconciliation Loop'],
    exampleSentences: [
      "By passing an idempotency key with every payment request, we prevent double charges during transient network timeouts.",
      "All event consumers in our Kafka cluster must be strictly idempotent."
    ],
    exampleMeetingUsage: "Have we ensured the webhook handler is completely idempotent before opening beta access?",
    relatedRoles: ['Backend Engineer', 'Solutions Architect', 'Engineering Manager']
  },
  {
    id: 'dom-strat-moat',
    domain: 'Business & Strategy',
    conceptName: 'Economic Moats & Defensibility',
    plainEnglishExplanation: 'A sustainable competitive advantage that protects a company from competitors copying its product and taking its market share.',
    businessMeaning: 'Ensures long-term pricing power and margins (e.g. Network Effects, Switching Costs, Proprietary Data, Economies of Scale).',
    commonWorkplaceUsage: 'Frequent in investor meetings, executive strategy offsites, and M&A evaluations.',
    relatedTerminology: ['Network Effects', 'High Switching Costs', 'Cost Advantages', 'IP & Patents'],
    exampleSentences: [
      "Our proprietary dataset on regional logistics gives us an algorithmic moat competitors cannot easily replicate.",
      "Features are easily copied; true defensibility comes from integrated workflow stickiness."
    ],
    exampleMeetingUsage: "What is our competitive moat against open-source alternatives entering the market next year?",
    relatedRoles: ['Head of Strategy', 'Product Director', 'Founder / CEO', 'Investor']
  }
];

// -------------------------------------------------------------------------
// 7. COMMUNICATION PATTERNS (4-Tier Progression Ladders)
// -------------------------------------------------------------------------
export const SEED_COMMUNICATION_PATTERNS: CommunicationPattern[] = [
  {
    id: 'pat-disagreeing',
    situation: 'Disagreeing Professionally',
    category: 'Conflict & Decision Making',
    purpose: 'Challenging an approach or proposal without damaging collaborative relationships or appearing confrontational.',
    basic: {
      text: "I don't agree with this plan. It will take too long.",
      tone: 'Blunt & potentially confrontational',
      explanation: 'States disagreement directly without context, alternative solutions, or empathy for the speaker.',
      idealSituation: 'Rarely ideal in professional corporate environments.'
    },
    professional: {
      text: "I'm not sure I fully agree with that approach because of the delivery timeline.",
      tone: 'Polite & softening',
      explanation: 'Softens the disagreement with qualifying language ("not sure I fully agree") and links to a business reason.',
      idealSituation: 'Standard peer-to-peer discussions and team meetings.'
    },
    confident: {
      text: "I see the merits of that timeline, but my concern is that compressing testing will introduce regression risks.",
      tone: 'Constructive & evidence-based',
      explanation: 'Validates the other perspective first, then introduces a concrete operational risk.',
      idealSituation: 'Design reviews, sprint planning, and cross-functional syncs.'
    },
    executive: {
      text: "I understand the commercial pressure driving this date. However, based on our deployment metrics, moving forward without automated failover creates significant SLA exposure. I recommend we phase the rollout into two releases.",
      tone: 'Authoritative, risk-aware, and solution-led',
      explanation: 'Acknowledges high-level business drivers, quantifies organizational exposure, and immediately presents a strategic alternative.',
      idealSituation: 'Executive briefings, steering committees, and leadership reviews.'
    },
    contextRationale: 'As seniority increases, effective communicators shift from expressing personal feelings to identifying business risk and offering calibrated alternatives.',
    keyPrinciples: [
      'Acknowledge the other perspective first to lower psychological defense',
      'Replace "I think" with observable data, metrics, or risk exposure',
      'Always follow a disagreement with a constructive alternative solution'
    ]
  },
  {
    id: 'pat-pushing-back',
    situation: 'Pushing Back on Unrealistic Scope or Deadlines',
    category: 'Negotiation & Boundary Setting',
    purpose: 'Saying no to unreasonable demands while preserving stakeholder trust and clarifying trade-offs.',
    basic: {
      text: "We can't do that. We don't have enough time.",
      tone: 'Defensive & closed',
      explanation: 'Presents a hard wall without opening room for trade-offs or prioritizing.',
      idealSituation: 'Not recommended; sounds uncooperative.'
    },
    professional: {
      text: "Unfortunately, our team doesn't have the bandwidth to take that on for this sprint.",
      tone: 'Polite & standard',
      explanation: 'Uses standard workplace language ("bandwidth") to explain capacity limits politely.',
      idealSituation: 'Standard backlog grooming and task intake.'
    },
    confident: {
      text: "We'd love to support this initiative. To hit that date, we'd need to de-scope the reporting module. Which of the two is the higher commercial priority?",
      tone: 'Partnership & trade-off oriented',
      explanation: 'Frames capacity around explicit trade-offs and puts prioritization back into the requester’s hands.',
      idealSituation: 'Cross-functional stakeholder requests and PM-engineering alignment.'
    },
    executive: {
      text: "To protect our Q3 reliability commitments, our engineering capacity is currently locked on the core architecture. If this new capability takes precedence, we can reallocate resources, but it will slip our payment gateway milestone by two weeks. Let's align on whether that trade-off serves our quarterly OKRs.",
      tone: 'Strategic, objective, and governance-driven',
      explanation: 'Grounds capacity in high-level company OKRs, quantifies the exact opportunity cost, and asks for strategic alignment.',
      idealSituation: 'VP/Director level scope negotiations and resource allocation disputes.'
    },
    contextRationale: 'Senior professionals never say "we cannot do it"; they say "here is the cost and trade-off of doing it".',
    keyPrinciples: [
      'Make the iron triangle (Time, Scope, Quality) visible to the requester',
      'Tie decisions to agreed-upon quarterly commitments (OKRs)',
      'Invite collaborative prioritization rather than creating an adversarial standoff'
    ]
  },
  {
    id: 'pat-asking-clarification',
    situation: 'Asking for Clarification Without Looking Uninformed',
    category: 'Meetings & Collaboration',
    purpose: 'Seeking necessary details or unblocking assumptions while projecting confidence and intellectual rigor.',
    basic: {
      text: "I don't understand what you mean. Can you explain?",
      tone: 'Passive & slightly insecure',
      explanation: 'Places the burden of misunderstanding entirely on yourself in a vulnerable manner.',
      idealSituation: 'Informal chats with close peers.'
    },
    professional: {
      text: "Could you clarify what you mean by that last point?",
      tone: 'Standard & polite',
      explanation: 'Direct and courteous, standard for day-to-day meetings.',
      idealSituation: 'General Q&A during team presentations.'
    },
    confident: {
      text: "Just to make sure we're completely aligned, are you suggesting we prioritize user growth over margin in Q4, or vice versa?",
      tone: 'Active listening & synthesizing',
      explanation: 'Demonstrates deep engagement by paraphrasing the core dilemma and offering two concrete choices.',
      idealSituation: 'Strategy debates, requirement gathering, and sprint kickoff.'
    },
    executive: {
      text: "Let me synthesize to ensure we're interpreting this correctly: the primary bottleneck isn't the API latency itself, but rather the downstream database lock contention under concurrency. Is that the precise failure mode you're observing?",
      tone: 'Diagnostic, crisp, and high-signal',
      explanation: 'Elevates the conversation by structuring the problem analytically and testing a specific hypothesis.',
      idealSituation: 'Incident war rooms, architectural deep dives, and executive summaries.'
    },
    contextRationale: 'Senior questions do not ask for basic information; they frame hypotheses and verify assumptions.',
    keyPrinciples: [
      'Echo back your understanding ("What I am hearing is...") before asking the clarifying question',
      'Provide structured options rather than an open-ended "I don\'t know"',
      'Focus the inquiry on underlying mechanisms and strategic intent'
    ]
  },
  {
    id: 'pat-giving-status-update',
    situation: 'Giving an Executive Project Status Update',
    category: 'Project Management & Reporting',
    purpose: 'Delivering a quick status read-out that answers: Are we on track? What is the risk? What do you need?',
    basic: {
      text: "We are working on the project and making good progress.",
      tone: 'Vague & unquantified',
      explanation: 'Provides zero actionable signal regarding milestones, blockers, or delivery dates.',
      idealSituation: 'Informal hallway chats.'
    },
    professional: {
      text: "The project is currently on track. We finished the frontend designs and are now working on API integration.",
      tone: 'Informative & clear',
      explanation: 'States the status and lists current activities clearly.',
      idealSituation: 'Weekly team standup or async slack update.'
    },
    confident: {
      text: "We are tracking green against our Friday milestone. 85% of endpoints are deployed to staging, and we have zero critical bugs. Our only dependency is awaiting final security sign-off on Thursday.",
      tone: 'Data-backed & proactive',
      explanation: 'Uses quantifiable progress percentages, quality indicators, and explicit dependency management.',
      idealSituation: 'Cross-functional program syncs and PM check-ins.'
    },
    executive: {
      text: "BLUF: The enterprise migration is 70% complete and tracking on schedule for the October 15 release. The primary risk factor is the vendor KYC latency, which we have mitigated with async webhooks. No executive escalation is required at this stage.",
      tone: 'Executive briefing (BLUF), risk-mitigated, and outcome-oriented',
      explanation: 'Leads with the bottom line, proactively addresses the #1 risk with a solution, and explicitly states whether leadership action is needed.',
      idealSituation: 'Executive QBRs, board memos, and leadership steering committees.'
    },
    contextRationale: 'Executives do not need a diary of your daily tasks; they need to know if the outcome is at risk and if they need to unblock you.',
    keyPrinciples: [
      'Lead with the overall status (Green, Yellow, Red) immediately',
      'Quantify completion percentage and concrete dates',
      'State explicitly whether you need help or whether the plan is self-sustaining'
    ]
  }
];
