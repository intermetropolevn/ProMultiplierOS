import { Utterance, RoleCategory, SectorDomain } from '../types';

export interface SemanticIntentMeta {
  intent: string;
  label: string;
  competencies: string[];
  defaultRole: RoleCategory;
  defaultDomain: SectorDomain;
  keywords: string[];
  phrases: string[];
}

export const SEMANTIC_INTENTS: SemanticIntentMeta[] = [
  {
    intent: 'stakeholder_conflict',
    label: 'Stakeholder Conflict & Alignment',
    competencies: ['stakeholder management', 'constructive dissent', 'data-driven persuasion', 'leadership'],
    defaultRole: 'Software Engineering',
    defaultDomain: 'Enterprise SaaS',
    keywords: [
      'disagree', 'disagreement', 'conflict', 'pushback', 'engineering lead', 'product partner', 
      'competing', 'dissent', 'architectural decision', 'bất đồng', 'tranh luận', 'quan điểm', 
      'ý kiến khác nhau', 'mâu thuẫn', 'xung đột', 'stakeholder'
    ],
    phrases: [
      'disagreed with a technical',
      'disagreement with engineering',
      'disagreement with product',
      'conflict with a team',
      'push back against a request',
      'bất đồng ý kiến với',
      'xung đột quan điểm'
    ]
  },
  {
    intent: 'idempotency_payments',
    label: 'Distributed Idempotency & Financial Safety',
    competencies: ['distributed systems', 'transactional safety', 'concurrency control', 'financial engineering'],
    defaultRole: 'Software Engineering',
    defaultDomain: 'Fintech & Payments',
    keywords: [
      'idempotency', 'duplicate charge', 'payment api', 'credit card', 'redis lock', 'distributed lock',
      'retry', 'at-most-once', 'timeout', 'packet loss', 'thanh toán', 'trùng lặp', 'giao dịch', 'double charge'
    ],
    phrases: [
      'zero duplicate charges',
      'payment processing api',
      'unreliable mobile client',
      'handle network timeouts in payment',
      'idempotency key',
      'tránh trừ tiền hai lần'
    ]
  },
  {
    intent: 'ambiguity_decision',
    label: 'Decision Making Under Ambiguity',
    competencies: ['decision making', 'ambiguity resolution', 'risk mitigation', 'data-driven thinking'],
    defaultRole: 'Product Management',
    defaultDomain: 'Enterprise SaaS',
    keywords: [
      'without enough data', 'incomplete data', 'ambiguity', 'uncertainty', 'no data', 'intuition', 
      'hypothesis', 'risk', 'mơ hồ', 'thiếu dữ liệu', 'không đủ thông tin', 'quyết định'
    ],
    phrases: [
      'without enough data',
      'product decision without enough data',
      'lack of data',
      'handle ambiguous requirements',
      'make a decision when data is missing',
      'quyết định khi thiếu dữ liệu'
    ]
  },
  {
    intent: 'prioritization_tradeoff',
    label: 'Strategic Prioritization & Capacity Trade-offs',
    competencies: ['strategic prioritization', 'opportunity sizing', 'revenue vs retention', 'executive communication'],
    defaultRole: 'Product Management',
    defaultDomain: 'Enterprise SaaS',
    keywords: [
      'prioritize', 'capacity', 'vp of sales', 'churn', 'onboarding', 'saml', 'scim', 'deals', 'tradeoff',
      'rice framework', 'backlog', 'ưu tiên', 'phân bổ nguồn lực', 'tính năng', 'đánh đổi'
    ],
    phrases: [
      'engineering capacity remaining',
      'vp of sales wants',
      'decide what to build',
      'churn rate vs enterprise',
      'feature prioritization dilemma',
      'lựa chọn ưu tiên giữa'
    ]
  },
  {
    intent: 'progressive_disclosure_design',
    label: 'Power User vs New User Usability',
    competencies: ['progressive disclosure', 'cohort empathy', 'telemetry analysis', 'interaction design'],
    defaultRole: 'UI/UX & Product Design',
    defaultDomain: 'Enterprise SaaS',
    keywords: [
      'power users', 'redesign core interaction', 'drop-offs', 'muscle memory', 'confusion', 
      'progressive disclosure', 'command palette', 'shortcuts', 'người dùng mới', 'trải nghiệm', 'thiết kế lại'
    ],
    phrases: [
      'power users loved',
      'redesign a core interaction',
      'balance their competing needs',
      'new user onboarding vs power user',
      'cân bằng người dùng mới và cũ'
    ]
  },
  {
    intent: 'zero_downtime_deploy',
    label: 'Zero-Downtime Deployment & Automated Rollbacks',
    competencies: ['Kubernetes architecture', 'CI/CD pipelines', 'canary deployments', 'observability gating'],
    defaultRole: 'DevOps & Cloud',
    defaultDomain: 'Cloud Infrastructure & DevOps',
    keywords: [
      'zero-downtime', 'ci/cd', 'kubernetes', 'rollback', 'canary', 'blue-green', 'traffic shifting',
      'health probe', 'spikes', 'triển khai', 'không gián đoạn', 'tự động rollback'
    ],
    phrases: [
      'ci/cd deployment pipeline',
      'zero-downtime rollouts',
      'automated rollbacks if error rates spike',
      'canary deployment strategy',
      'triển khai hệ thống zero downtime'
    ]
  },
  {
    intent: 'incident_postmortem',
    label: 'Critical SEV-1 Outage & Postmortem Analysis',
    competencies: ['incident response', 'distributed tracing', 'blameless postmortem', 'system resilience'],
    defaultRole: 'Software Engineering',
    defaultDomain: 'Cloud Infrastructure & DevOps',
    keywords: [
      'outage', 'sev-1', 'incident', 'downtime', 'postmortem', 'mttr', 'cascading failure',
      'circuit breaker', 'sự cố', 'sập hệ thống', 'khắc phục'
    ],
    phrases: [
      'production outage',
      'sev-1 incident',
      'system went down',
      'blameless postmortem',
      'sự cố nghiêm trọng'
    ]
  },
  {
    intent: 'code_quality_velocity',
    label: 'Engineering Velocity vs Technical Debt',
    competencies: ['engineering leadership', 'technical debt management', 'refactoring', 'release velocity'],
    defaultRole: 'Software Engineering',
    defaultDomain: 'Enterprise SaaS',
    keywords: [
      'technical debt', 'velocity', 'deadlines', 'refactor', 'test coverage', 'quality vs speed',
      'nợ kỹ thuật', 'tiến độ', 'chất lượng mã nguồn'
    ],
    phrases: [
      'balance speed and quality',
      'manage technical debt',
      'deadline pressure vs clean code',
      'nợ kỹ thuật và tiến độ'
    ]
  }
];

export interface QuestionDetectionResult {
  isQuestion: boolean;
  rawText: string;
  semanticIntent: string;
  intentLabel: string;
  competencies: string[];
  roleCategory: RoleCategory;
  domain: SectorDomain;
  matchedKeywords: string[];
  confidence: number;
}

export class QuestionDetectionService {
  /**
   * Analyzes an utterance or text snippet to determine:
   * 1. Is it an interviewer question?
   * 2. What is the semantic intent?
   * 3. What competencies are targeted?
   * 4. What is the primary role & domain?
   */
  public static analyzeQuestion(utterance: Utterance | string): QuestionDetectionResult {
    const text = typeof utterance === 'string' ? utterance : utterance.text;
    const normalized = text.toLowerCase().trim();

    // 1. Is it a question or interview scenario prompt?
    const isQuestion = this.detectIsQuestion(normalized);

    // 2. Score against each semantic intent
    let bestIntent = SEMANTIC_INTENTS[0];
    let highestScore = 0;
    let matchedKeywords: string[] = [];

    for (const intentMeta of SEMANTIC_INTENTS) {
      let score = 0;
      const localMatches: string[] = [];

      // Check phrase matches (high weight)
      for (const phrase of intentMeta.phrases) {
        if (normalized.includes(phrase)) {
          score += 45;
          localMatches.push(phrase);
        }
      }

      // Check keyword matches
      for (const kw of intentMeta.keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(normalized)) {
          score += 12;
          localMatches.push(kw);
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestIntent = intentMeta;
        matchedKeywords = localMatches;
      }
    }

    // Normalized intent confidence score (0.50 to 0.98)
    const normalizedConfidence = highestScore > 0 
      ? Math.min(0.98, Number((0.60 + Math.min(highestScore / 80, 0.38)).toFixed(2)))
      : 0.52;

    return {
      isQuestion,
      rawText: text,
      semanticIntent: bestIntent.intent,
      intentLabel: bestIntent.label,
      competencies: bestIntent.competencies,
      roleCategory: bestIntent.defaultRole,
      domain: bestIntent.defaultDomain,
      matchedKeywords,
      confidence: normalizedConfidence,
    };
  }

  private static detectIsQuestion(text: string): boolean {
    if (text.includes('?')) return true;

    const questionStarters = [
      'tell me about', 'walk me through', 'how would you', 'how do you', 'how did you',
      'why did you', 'describe a', 'give me an example', 'can you explain', 'what was your',
      'have you ever', 'what would you do', 'kể về', 'làm thế nào', 'bạn xử lý', 'chia sẻ về',
      'tại sao', 'theo bạn'
    ];

    return questionStarters.some(starter => text.startsWith(starter) || text.includes(` ${starter}`));
  }
}
