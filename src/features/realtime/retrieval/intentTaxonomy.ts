export interface IntentTaxonomyEntry {
  intent: string;
  label: string;
  category: 'behavioral' | 'product' | 'technical' | 'strategy' | 'execution';
  canonicalPatterns: string[];
  keywords: string[];
  synonyms: Record<string, string[]>;
  typicalSkills: string[];
  questionType: string;
  relatedIntents: string[];
  defaultConfidence: number;
}

export const DEFAULT_INTENT_TAXONOMY: IntentTaxonomyEntry[] = [
  {
    intent: 'stakeholder_conflict',
    label: 'Stakeholder Conflict & Alignment',
    category: 'behavioral',
    canonicalPatterns: [
      'conflict with engineering',
      'disagreed with your developers',
      'disagree with technical lead',
      'competing stakeholder conflict',
      'pushback from partners',
      'bất đồng với lập trình viên'
    ],
    keywords: [
      'conflict', 'disagree', 'disagreement', 'dispute', 'clash', 'friction', 'pushback',
      'dissent', 'opposed', 'argument', 'tension', 'constructive dissent', 'bất đồng', 'mâu thuẫn'
    ],
    synonyms: {
      engineering: ['developers', 'devs', 'engineers', 'dev team', 'tech lead', 'programmers', 'architect'],
      conflict: ['disagree', 'disagreed', 'disagreement', 'dispute', 'pushback', 'dissent', 'clash', 'bất đồng'],
      stakeholder: ['sales', 'leadership', 'product', 'marketing', 'executives', 'clients']
    },
    typicalSkills: ['Stakeholder Management', 'Constructive Dissent', 'Data-driven Persuasion', 'Communication', 'Empathy'],
    questionType: 'Behavioral (STAR)',
    relatedIntents: ['communication', 'decision_making', 'leadership', 'prioritization'],
    defaultConfidence: 0.88,
  },
  {
    intent: 'prioritization',
    label: 'Strategic Prioritization & Capacity Trade-offs',
    category: 'product',
    canonicalPatterns: [
      'prioritize competing stakeholder requests',
      'sales engineering leadership all want different things',
      'decide what to build with limited capacity',
      'feature prioritization backlog dilemma',
      'ưu tiên tính năng khi nguồn lực có hạn'
    ],
    keywords: [
      'prioritize', 'prioritizing', 'prioritization', 'competing', 'different things', 'capacity',
      'backlog', 'tradeoff', 'trade-off', 'rice framework', 'balance', 'scarcity', 'resources', 'ưu tiên'
    ],
    synonyms: {
      competing_requests: ['all want different things', 'conflicting requests', 'multiple demands', 'differing priorities'],
      prioritize: ['rank', 'allocate', 'decide what to build', 'triage', 'tradeoff', 'balance'],
      stakeholders: ['sales', 'engineering', 'leadership', 'customers', 'executives']
    },
    typicalSkills: ['Strategic Prioritization', 'Opportunity Sizing', 'RICE Framework', 'Executive Communication', 'Capacity Planning'],
    questionType: 'Product Sense & Strategy',
    relatedIntents: ['strategy', 'decision_making', 'stakeholder_conflict', 'metrics'],
    defaultConfidence: 0.86,
  },
  {
    intent: 'product_sense',
    label: 'Product Sense & User Problem Definition',
    category: 'product',
    canonicalPatterns: [
      'design a new product for a specific audience',
      'improve an existing product feature',
      'diagnose why a product metric dropped',
      'product critique and UX flow'
    ],
    keywords: [
      'product sense', 'design a product', 'improve product', 'user persona', 'pain point',
      'job to be done', 'jtbd', 'usability', 'ux flow', 'onboarding', 'activation'
    ],
    synonyms: {
      design: ['build', 'create', 're-imagine', 'architect a feature', 'conceptualize'],
      audience: ['users', 'customers', 'segments', 'cohorts', 'personas']
    },
    typicalSkills: ['Product Sense', 'Jobs to Be Done (JTBD)', 'User Empathy', 'Wireframing', 'Cohort Analysis'],
    questionType: 'Product Sense & Strategy',
    relatedIntents: ['user_research', 'prioritization', 'metrics', 'experimentation'],
    defaultConfidence: 0.84,
  },
  {
    intent: 'user_research',
    label: 'User Research & Customer Insights',
    category: 'product',
    canonicalPatterns: [
      'conduct customer interviews to discover pain points',
      'balance power users and novice feedback',
      'usability testing and qualitative feedback'
    ],
    keywords: [
      'user research', 'interviews', 'customer feedback', 'usability testing', 'contextual inquiry',
      'observations', 'qualitative', 'survey', 'pain points', 'customer insights'
    ],
    synonyms: {
      research: ['interviews', 'feedback sessions', 'usability tests', 'discovery calls'],
      users: ['power users', 'new cohorts', 'customers', 'analysts']
    },
    typicalSkills: ['User Research', 'Usability Testing', 'Contextual Inquiries', 'Empathy Mapping', 'Synthesis'],
    questionType: 'Product Sense & Strategy',
    relatedIntents: ['product_sense', 'experimentation', 'metrics'],
    defaultConfidence: 0.82,
  },
  {
    intent: 'metrics',
    label: 'North Star & Success Metrics Definition',
    category: 'product',
    canonicalPatterns: [
      'define success metrics for a launch',
      'pick a north star metric',
      'leading vs lagging indicators',
      'counter metrics and guardrails'
    ],
    keywords: [
      'metrics', 'north star', 'kpi', 'okr', 'leading indicator', 'lagging indicator',
      'guardrail metric', 'telemetry', 'measurement', 'tracking', 'chỉ số'
    ],
    synonyms: {
      metrics: ['kpis', 'key results', 'telemetry data', 'tracking indicators', 'success signals'],
      define: ['measure', 'evaluate', 'track', 'quantify']
    },
    typicalSkills: ['Metrics Definition', 'North Star Framing', 'Telemetry Instrumentation', 'Data Fluency'],
    questionType: 'Product Sense & Strategy',
    relatedIntents: ['analytics', 'experimentation', 'retention', 'growth'],
    defaultConfidence: 0.85,
  },
  {
    intent: 'analytics',
    label: 'Data Analytics & Funnel Diagnostics',
    category: 'product',
    canonicalPatterns: [
      'diagnose sudden conversion funnel drop',
      'segment user cohorts to explain metric dip',
      'sql telemetry root cause analysis'
    ],
    keywords: [
      'analytics', 'funnel', 'conversion drop', 'cohort', 'dip', 'anomaly',
      'root cause analysis', 'sql', 'telemetry', 'drop-off', 'phân tích số liệu'
    ],
    synonyms: {
      diagnose: ['investigate', 'troubleshoot', 'break down', 'analyze', 'root cause'],
      drop: ['dip', 'fall', 'decrease', 'churn spike', 'decline']
    },
    typicalSkills: ['Funnel Diagnostics', 'Cohort Analysis', 'Root Cause Analysis', 'SQL Telemetry', 'Quantitative Reasoning'],
    questionType: 'Product Sense & Strategy',
    relatedIntents: ['metrics', 'retention', 'experimentation'],
    defaultConfidence: 0.83,
  },
  {
    intent: 'experimentation',
    label: 'A/B Testing & Hypothesis Validation',
    category: 'product',
    canonicalPatterns: [
      'design an ab test for new onboarding',
      'handle inconclusive experiment results',
      'painted door test to validate demand'
    ],
    keywords: [
      'experimentation', 'a/b test', 'ab testing', 'hypothesis', 'sample size',
      'statistical significance', 'p-value', 'painted door', 'variant', 'thử nghiệm'
    ],
    synonyms: {
      experiment: ['split test', 'a/b test', 'multivariate test', 'experimentation cycle'],
      hypothesis: ['assumption', 'working theory', 'validation test']
    },
    typicalSkills: ['A/B Testing', 'Hypothesis Framing', 'Statistical Rigor', 'Painted Door MVPs', 'Experiment Design'],
    questionType: 'Product Sense & Strategy',
    relatedIntents: ['metrics', 'analytics', 'growth', 'ambiguity'],
    defaultConfidence: 0.85,
  },
  {
    intent: 'retention',
    label: 'Customer Retention & Churn Mitigation',
    category: 'product',
    canonicalPatterns: [
      'reduce onboarding churn rate',
      'improve Day-30 and Day-90 user retention',
      'habit loop and user stickiness'
    ],
    keywords: [
      'retention', 'churn', 'onboarding drop-off', 'stickiness', 'losing customers',
      'activation', 'cohort retention curve', 'churn rate', 'giữ chân khách hàng'
    ],
    synonyms: {
      churn: ['drop-offs', 'abandonment', 'attrition', 'unsubscribes', 'cancellations'],
      retention: ['habituation', 'long-term engagement', 'loyalty', 'repeat usage']
    },
    typicalSkills: ['Churn Analysis', 'Cohort Retention Curves', 'Activation Optimization', 'Customer Health Scoring'],
    questionType: 'Product Sense & Strategy',
    relatedIntents: ['metrics', 'analytics', 'growth', 'prioritization'],
    defaultConfidence: 0.84,
  },
  {
    intent: 'growth',
    label: 'Product-Led Growth & Funnel Optimization',
    category: 'product',
    canonicalPatterns: [
      'scale top of funnel acquisition',
      'build a product-led viral growth loop',
      'improve conversion rate from free to paid'
    ],
    keywords: [
      'growth', 'acquisition', 'viral loop', 'product-led growth', 'plg',
      'conversion rate', 'monetization', 'expansion', 'funnel velocity', 'tăng trưởng'
    ],
    synonyms: {
      growth: ['scaling users', 'expansion', 'acquisition engine', 'top of funnel'],
      conversion: ['upgrade rate', 'free to paid', 'monetization']
    },
    typicalSkills: ['Product-Led Growth (PLG)', 'Viral Loops', 'Monetization Mechanics', 'Acquisition Funnels'],
    questionType: 'Product Sense & Strategy',
    relatedIntents: ['retention', 'metrics', 'experimentation'],
    defaultConfidence: 0.82,
  },
  {
    intent: 'leadership',
    label: 'Team Leadership & Cultural Influence',
    category: 'behavioral',
    canonicalPatterns: [
      'rally a demoralized team through a tight deadline',
      'mentor an underperforming team member',
      'set architectural vision across teams'
    ],
    keywords: [
      'leadership', 'lead', 'mentor', 'mentoring', 'rally', 'align team',
      'vision', 'coaching', 'influence without authority', 'ownership', 'lãnh đạo'
    ],
    synonyms: {
      mentor: ['coach', 'guide', 'support', 'upskill'],
      lead: ['rally', 'inspire', 'align', 'orchestrate']
    },
    typicalSkills: ['Leadership', 'Mentorship', 'Influence Without Authority', 'Team Morale', 'Vision Setting'],
    questionType: 'Behavioral (STAR)',
    relatedIntents: ['communication', 'stakeholder_conflict', 'execution'],
    defaultConfidence: 0.85,
  },
  {
    intent: 'failure',
    label: 'Failure, Post-Mortems & Learning',
    category: 'behavioral',
    canonicalPatterns: [
      'tell me about a project that failed or missed deadline',
      'describe your biggest professional mistake',
      'conduct a blameless engineering post-mortem'
    ],
    keywords: [
      'failure', 'failed', 'mistake', 'blameless', 'post-mortem', 'postmortem',
      'outage', 'went wrong', 'incident', 'regret', 'lesson learned', 'thất bại'
    ],
    synonyms: {
      failed: ['missed deadline', 'went wrong', 'unsuccessful', 'fell short', 'crashed'],
      mistake: ['error', 'misjudgment', 'bug in production', 'blunder']
    },
    typicalSkills: ['Blameless Post-mortems', 'Accountability', 'Root Cause Identification', 'Resilience', 'Growth Mindset'],
    questionType: 'Behavioral (STAR)',
    relatedIntents: ['decision_making', 'ambiguity', 'execution'],
    defaultConfidence: 0.88,
  },
  {
    intent: 'ambiguity',
    label: 'Decision Making Under Ambiguity',
    category: 'product',
    canonicalPatterns: [
      'make high-impact decision without enough data',
      'handle unclear and changing requirements',
      'structure an ambiguous roadmap from scratch',
      'quyết định khi thông tin mơ hồ thiếu dữ liệu'
    ],
    keywords: [
      'ambiguity', 'uncertainty', 'without enough data', 'incomplete data', 'lack of data',
      'no data', 'intuition', 'vague', 'unclear requirements', 'mơ hồ', 'thiếu thông tin'
    ],
    synonyms: {
      ambiguity: ['uncertainty', 'no telemetry', 'incomplete specifications', 'vague scope'],
      without_data: ['missing data', 'no baseline', 'anecdotal only', 'limited signals']
    },
    typicalSkills: ['Ambiguity Resolution', 'Hypothesis Framing', 'Tripwire Metrics', 'Type 1 vs Type 2 Decisions'],
    questionType: 'Product Sense & Strategy',
    relatedIntents: ['decision_making', 'experimentation', 'strategy'],
    defaultConfidence: 0.87,
  },
  {
    intent: 'decision_making',
    label: 'Strategic Decision Making & Trade-offs',
    category: 'strategy',
    canonicalPatterns: [
      'how do you make irreversible type 1 decisions',
      'evaluate complex architectural or business trade-offs',
      'saying no to high-profile executive feature request'
    ],
    keywords: [
      'decision', 'decide', 'tradeoff', 'trade-off', 'evaluating options', 'type 1',
      'type 2', 'reversibility', 'framework', 'deciding', 'lựa chọn', 'đánh đổi'
    ],
    synonyms: {
      decide: ['choose between', 'weigh options', 'adjudicate', 'select path'],
      tradeoffs: ['pros and cons', 'opportunity cost', 'compromises', 'downside risk']
    },
    typicalSkills: ['Decision Frameworks', 'Reversibility Analysis', 'Opportunity Cost Sizing', 'Pragmatism'],
    questionType: 'Behavioral (STAR)',
    relatedIntents: ['ambiguity', 'technical_tradeoff', 'prioritization'],
    defaultConfidence: 0.85,
  },
  {
    intent: 'execution',
    label: 'Execution, Delivery Velocity & Sprint Triaging',
    category: 'execution',
    canonicalPatterns: [
      'deliver aggressive deadline under high pressure',
      'unblock engineering blockers during a critical launch',
      'balance tech debt with feature velocity'
    ],
    keywords: [
      'execution', 'delivery', 'deadline', 'shipping', 'velocity', 'blockers',
      'sprint triaging', 'launch readiness', 'milestones', 'thực thi', 'tiến độ'
    ],
    synonyms: {
      delivery: ['shipping', 'releasing', 'hitting the milestone', 'deploying on schedule'],
      pressure: ['tight deadline', 'crunch time', 'high stakes']
    },
    typicalSkills: ['Execution Rigor', 'Blocker Removal', 'Agile Triaging', 'Delivery Velocity', 'Risk De-escalation'],
    questionType: 'Behavioral (STAR)',
    relatedIntents: ['technical_tradeoff', 'leadership', 'prioritization'],
    defaultConfidence: 0.84,
  },
  {
    intent: 'strategy',
    label: 'Long-term Product & Technical Strategy',
    category: 'strategy',
    canonicalPatterns: [
      'develop a 3-year technology or product roadmap',
      'build a competitive moat against industry incumbents',
      'platform thinking and developer ecosystem'
    ],
    keywords: [
      'strategy', 'strategic', 'roadmap', 'north star', 'competitive moat', 'incumbents',
      'market positioning', 'platform thinking', 'long-term', 'chiến lược'
    ],
    synonyms: {
      strategy: ['vision', 'multi-year plan', 'market moat', 'positioning'],
      roadmap: ['milestones', 'horizon 1 2 3', 'strategic trajectory']
    },
    typicalSkills: ['Strategic Vision', 'Competitive Moat Analysis', 'Platform Architecture', 'Roadmap Modeling'],
    questionType: 'Product Sense & Strategy',
    relatedIntents: ['prioritization', 'decision_making', 'growth'],
    defaultConfidence: 0.83,
  },
  {
    intent: 'technical_tradeoff',
    label: 'Technical Architecture & Engineering Trade-offs',
    category: 'technical',
    canonicalPatterns: [
      'balance technical debt vs fast product shipping',
      'microservices vs monolithic architecture split',
      'zero downtime deployment in high traffic kubernetes',
      'payment idempotency and at-most-once safety'
    ],
    keywords: [
      'technical tradeoff', 'architecture', 'scalability', 'latency', 'throughput',
      'zero downtime', 'idempotency', 'distributed systems', 'tech debt', 'microservices', 'đánh đổi kỹ thuật'
    ],
    synonyms: {
      tradeoff: ['cost of delay', 'boy scout rule', 'refactor vs ship', 'architecture split'],
      architecture: ['system design', 'distributed locks', 'canary rollout', 'database constraint']
    },
    typicalSkills: ['Technical Architecture', 'Distributed Systems', 'Cost of Delay Translation', 'Reliability Engineering'],
    questionType: 'Technical Architecture',
    relatedIntents: ['decision_making', 'execution', 'stakeholder_conflict'],
    defaultConfidence: 0.89,
  },
  {
    intent: 'communication',
    label: 'Executive Presentation & Cross-Functional Alignment',
    category: 'behavioral',
    canonicalPatterns: [
      'present bad news or delayed roadmap to executives',
      'communicate complex technical architecture to non-technical stakeholders',
      'write a clear decision RFC for asynchronous alignment'
    ],
    keywords: [
      'communication', 'executive briefing', 'presenting', 'non-technical', 'rfc',
      'asynchronous', 'clarity', 'storytelling', 'persuasion', 'giao tiếp'
    ],
    synonyms: {
      communicate: ['present', 'articulate', 'brief', 'synthesize', 'explain'],
      executives: ['c-suite', 'vp', 'board', 'business partners', 'leadership']
    },
    typicalSkills: ['Executive Presence', 'Technical Translation', 'Written RFC Rigor', 'Active Listening'],
    questionType: 'Behavioral (STAR)',
    relatedIntents: ['stakeholder_conflict', 'leadership', 'decision_making'],
    defaultConfidence: 0.84,
  }
];

export class IntentTaxonomyRegistry {
  private static registry: Map<string, IntentTaxonomyEntry> = new Map();

  static {
    // Initialize default intents
    DEFAULT_INTENT_TAXONOMY.forEach(item => {
      this.registry.set(item.intent, item);
    });
  }

  public static registerIntent(entry: IntentTaxonomyEntry): void {
    this.registry.set(entry.intent, entry);
  }

  public static getIntent(key: string): IntentTaxonomyEntry | undefined {
    return this.registry.get(key);
  }

  public static getAllIntents(): IntentTaxonomyEntry[] {
    return Array.from(this.registry.values());
  }

  public static searchByKeyword(keyword: string): IntentTaxonomyEntry[] {
    const kw = keyword.toLowerCase();
    return this.getAllIntents().filter(item => 
      item.intent.includes(kw) ||
      item.keywords.some(k => k.includes(kw)) ||
      item.canonicalPatterns.some(p => p.includes(kw))
    );
  }
}
