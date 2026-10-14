// =========================================================================
// CAREER OS - MULTILINGUAL CANONICAL SKILL REGISTRY & MAPPER
// =========================================================================

import { VietnameseNormalizer } from './vietnameseNormalizer';

export interface CanonicalSkillDefinition {
  canonicalId: string;
  canonicalName: string;
  domain: string;
  description: string;
  multilingualAliases: {
    en: string[];
    vi: string[];
    ja?: string[];
  };
  competencies: string[];
  targetRoles: string[];
  primaryKnowledgeConcepts: string[];
}

export const CANONICAL_SKILL_CATALOG: CanonicalSkillDefinition[] = [
  {
    canonicalId: 'skill-product-strategy',
    canonicalName: 'Product Strategy',
    domain: 'Product Management',
    description: 'Defining competitive moats, market positioning, prioritization trade-offs, and product roadmaps.',
    multilingualAliases: {
      en: [
        'product strategy',
        'strategic product management',
        'product roadmapping',
        'gtm strategy',
        'go-to-market strategy',
        'market defensibility',
        'strategic roadmapping',
        'competitive product strategy'
      ],
      vi: [
        'chiến lược sản phẩm',
        'hoạch định chiến lược sản phẩm',
        'định hướng sản phẩm',
        'lộ trình sản phẩm',
        'xây dựng chiến lược sản phẩm',
        'chiến lược gtm',
        'tư duy chiến lược sản phẩm'
      ],
      ja: [
        'プロダクト戦略',
        '製品戦略',
        'ロードマップ策定'
      ]
    },
    competencies: ['Strategic Roadmapping', 'Metric Hierarchy Design', 'Competitive Moat Design', 'Cross-Functional Framing'],
    targetRoles: ['Lead Product Manager', 'Group Product Manager', 'Director of Product', 'VP of Product'],
    primaryKnowledgeConcepts: ['Two-Way Door Decision Framing', 'Defensibility Moats', 'Cannibalization Risk Guardrails', 'Growth Loops vs Linear Funnels']
  },
  {
    canonicalId: 'skill-distributed-systems',
    canonicalName: 'Distributed Systems',
    domain: 'Software Architecture & Data',
    description: 'Designing high-throughput, fault-tolerant, partition-tolerant distributed architectures, streaming pipelines, and microservices.',
    multilingualAliases: {
      en: [
        'distributed systems',
        'distributed computing',
        'distributed architecture',
        'high availability systems',
        'event-driven architecture',
        'distributed streaming',
        'microservice architecture'
      ],
      vi: [
        'hệ thống phân tán',
        'kiến trúc phân tán',
        'tính toán phân tán',
        'hệ thống chịu lỗi',
        'xử lý phân tán',
        'kiến trúc microservices'
      ],
      ja: [
        '分散システム',
        '分散アーキテクチャ',
        'マイクロサービス'
      ]
    },
    competencies: ['Mission-Critical Data Engineering', 'Production Risk Mitigation', 'Fault-Tolerant System Design'],
    targetRoles: ['Staff Backend Engineer', 'Principal Architect', 'Data Infrastructure Lead', 'Distributed Systems Specialist'],
    primaryKnowledgeConcepts: ['Change Data Capture (CDC)', 'Idempotent Consumer Logic', 'Partition Replication Semantics', 'Zero-Copy Page Cache Transfer']
  },
  {
    canonicalId: 'skill-kafka-streaming',
    canonicalName: 'Kafka & Event Streaming',
    domain: 'Data Engineering',
    description: 'Distributed log-structured message brokers, topic partitioning, high-throughput consumer groups, and stream processing.',
    multilingualAliases: {
      en: [
        'kafka',
        'apache kafka',
        'kafka distributed streaming',
        'event streaming',
        'debezium',
        'cdc (debezium)',
        'stream processing',
        'kafka streams'
      ],
      vi: [
        'xử lý luồng dữ liệu kafka',
        'hệ thống kafka',
        'luồng sự kiện',
        'truyền luồng kafka',
        'xử lý sự kiện phân tán'
      ]
    },
    competencies: ['Real-Time Stream Processing', 'Message Bus Hardening', 'Zero-Downtime Data Migration'],
    targetRoles: ['Data Engineer', 'Backend Streaming Engineer', 'Platform Infrastructure Engineer'],
    primaryKnowledgeConcepts: ['Log-Structured Storage Engine', 'Partition Replication Semantics', 'Rebalance Protocol', 'Exactly-Once Processing']
  },
  {
    canonicalId: 'skill-hypothesis-testing',
    canonicalName: 'Hypothesis Testing & Experimentation',
    domain: 'Product & Analytics',
    description: 'Falsifiable hypothesis design, A/B testing, statistical significance, and painted-door feature discovery.',
    multilingualAliases: {
      en: [
        'hypothesis testing',
        'experimentation',
        'ab testing',
        'a/b testing',
        'split testing',
        'product experiments',
        'falsifiable hypothesis design'
      ],
      vi: [
        'kiểm thử giả thuyết',
        'thử nghiệm a/b',
        'thử nghiệm sản phẩm',
        'thiết kế thí nghiệm',
        'kiểm định giả thuyết'
      ]
    },
    competencies: ['Falsifiable Product Hypothesis Design', 'Statistical Validation', 'Rapid Prototyping'],
    targetRoles: ['Growth Product Manager', 'Product Analyst', 'Conversion Optimization Lead'],
    primaryKnowledgeConcepts: ['Tripwire Telemetry Guardrails', 'Painted-Door Conversion Testing', 'Sample Size Power Calculations']
  },
  {
    canonicalId: 'skill-product-operations',
    canonicalName: 'Product Operations & SOP Design',
    domain: 'Operations & Product',
    description: 'Scaling operational playbooks, cross-functional execution, SLA escalation, and incident retrospectives.',
    multilingualAliases: {
      en: [
        'product operations',
        'product ops',
        'sop design',
        'operational process design',
        'process optimization',
        'operational scaling'
      ],
      vi: [
        'vận hành sản phẩm',
        'tối ưu hóa quy trình',
        'thiết kế sop',
        'quy trình vận hành',
        'chuẩn hóa quy trình'
      ]
    },
    competencies: ['Marketplace Operations', 'Root Cause Diagnostics', 'SOP Authoring'],
    targetRoles: ['Product Operations Lead', 'Operations Program Manager', 'Chief of Staff'],
    primaryKnowledgeConcepts: ['Two-Sided Marketplace Liquidity', 'Onboarding Verification Latency', 'Operational SLA Escalation Matrix']
  },
  {
    canonicalId: 'skill-growth-analytics',
    canonicalName: 'Growth Analytics & Retention',
    domain: 'Data & Growth',
    description: 'Retention cohort curves, growth loops, churn modeling, LTV/CAC payback, and conversion funnel analysis.',
    multilingualAliases: {
      en: [
        'growth analytics',
        'customer retention',
        'funnel analytics',
        'retention analysis',
        'cohort analysis',
        'conversion rate optimization',
        'churn analysis'
      ],
      vi: [
        'phân tích tăng trưởng',
        'giữ chân khách hàng',
        'phân tích phễu',
        'phân tích cohort',
        'tỷ lệ rời bỏ khách hàng'
      ]
    },
    competencies: ['Cohort Curve Diagnostics', 'Growth Loop Synthesis', 'LTV Forecasting'],
    targetRoles: ['Head of Growth', 'Senior Growth Analyst', 'Retention PM'],
    primaryKnowledgeConcepts: ['Growth Loops vs Linear Funnels', 'Retention Cohort Flattening', 'Feature Product Fit vs Product Market Fit']
  },
  {
    canonicalId: 'skill-scrum-ownership',
    canonicalName: 'Product Ownership & Scrum',
    domain: 'Agile Delivery',
    description: 'Empirical process control, backlog refinement, sprint planning, and value maximization metrics.',
    multilingualAliases: {
      en: [
        'scrum framework',
        'product ownership',
        'scrum',
        'agile delivery',
        'sprint cadence & ceremonies',
        'backlog refinement'
      ],
      vi: [
        'khung làm việc scrum',
        'quản trị sản phẩm',
        'quy trình scrum',
        'sprint agile',
        'quản lý backlog'
      ]
    },
    competencies: ['Value Delivery Prioritization', 'Scope Negotiation', 'Agile Ceremonies Facilitation'],
    targetRoles: ['Product Owner', 'Agile Delivery Lead', 'Scrum Master / PM'],
    primaryKnowledgeConcepts: ['Empirical Process Control', 'Product Goal Alignment', 'Backlog Ordering Algorithms']
  },
  {
    canonicalId: 'skill-system-architecture',
    canonicalName: 'System Architecture & Trade-offs',
    domain: 'Software Architecture',
    description: 'Evaluating CAP theorem trade-offs, zero-downtime cutover migrations, and database indexing strategies.',
    multilingualAliases: {
      en: [
        'architecture trade-offs',
        'system architecture',
        'software architecture',
        'zero-downtime migration',
        'system design',
        'technical decision making'
      ],
      vi: [
        'kiến trúc hệ thống',
        'đánh đổi kiến trúc',
        'chuyển đổi dữ liệu không gián đoạn',
        'thiết kế hệ thống phần mềm'
      ]
    },
    competencies: ['Architecture Trade-offs', 'Zero-Downtime Migration', 'Production Resiliency'],
    targetRoles: ['Staff Software Engineer', 'Chief Architect', 'Technical Lead'],
    primaryKnowledgeConcepts: ['Zero-Downtime Cutover Strategy', 'Financial Audit Parity', 'CAP Theorem Constraints']
  },
  {
    canonicalId: 'skill-stakeholder-management',
    canonicalName: 'Stakeholder Management & Alignment',
    domain: 'Leadership & Executive Communication',
    description: 'Aligning cross-functional executive peers, managing conflicting requirements, and board-level reporting.',
    multilingualAliases: {
      en: [
        'stakeholder management',
        'executive alignment',
        'cross-functional leadership',
        'influence without authority',
        'executive communication'
      ],
      vi: [
        'quản lý các bên liên quan',
        'giao tiếp cấp cao',
        'đồng thuận liên phòng ban',
        'quản trị kỳ vọng cổ đông'
      ]
    },
    competencies: ['Cross-Functional Executive Framing', 'Expectation Calibration', 'Conflict Resolution'],
    targetRoles: ['Product Director', 'Engineering Director', 'VP of Product'],
    primaryKnowledgeConcepts: ['Two-Way Door Decision Framing', 'RACI Matrix', 'Executive Escalation Protocols']
  },
  {
    canonicalId: 'skill-database-engineering',
    canonicalName: 'Database Engineering (PostgreSQL & SQL)',
    domain: 'Data & Backend',
    description: 'Relational data modeling, ACID transactions, index optimization, query tuning, and connection pooling.',
    multilingualAliases: {
      en: [
        'postgresql',
        'postgres',
        'sql',
        'relational database',
        'database engineering',
        'query optimization',
        'database indexing'
      ],
      vi: [
        'cơ sở dữ liệu postgresql',
        'cơ sở dữ liệu quan hệ',
        'kỹ thuật database',
        'tối ưu hóa truy vấn sql'
      ]
    },
    competencies: ['Data Modeling', 'Query Optimization', 'Transactional Consistency'],
    targetRoles: ['Backend Engineer', 'Database Administrator', 'Data Infrastructure Engineer'],
    primaryKnowledgeConcepts: ['ACID Guarantees', 'B-Tree vs GiST Indexing', 'Write-Ahead Logging (WAL)']
  }
];

export class CanonicalSkillRegistry {
  private static lookupIndex: Map<string, CanonicalSkillDefinition> = new Map();
  private static initialized: boolean = false;

  private static init() {
    if (this.initialized) return;

    for (const def of CANONICAL_SKILL_CATALOG) {
      // Index canonical name
      this.indexKey(def.canonicalName, def);
      this.indexKey(def.canonicalId, def);

      // Index English aliases
      for (const alias of def.multilingualAliases.en || []) {
        this.indexKey(alias, def);
      }

      // Index Vietnamese aliases (both accented and unaccented)
      for (const alias of def.multilingualAliases.vi || []) {
        this.indexKey(alias, def);
        this.indexKey(VietnameseNormalizer.removeDiacritics(alias), def);
      }

      // Index Japanese aliases
      for (const alias of def.multilingualAliases.ja || []) {
        this.indexKey(alias, def);
      }
    }

    this.initialized = true;
  }

  private static indexKey(rawKey: string, def: CanonicalSkillDefinition) {
    const normalized = this.normalizeKey(rawKey);
    if (normalized) {
      this.lookupIndex.set(normalized, def);
    }
  }

  private static normalizeKey(text: string): string {
    return VietnameseNormalizer.removeDiacritics(text)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  /**
   * Resolves any multilingual string, alias, or typo to its canonical skill definition.
   * If not explicitly matched in the catalog, safely generates a formatted canonical representation.
   */
  public static resolve(rawSkill: string): {
    canonicalId: string;
    canonicalName: string;
    definition?: CanonicalSkillDefinition;
    isPredefined: boolean;
  } {
    this.init();

    if (!rawSkill || typeof rawSkill !== 'string') {
      return {
        canonicalId: 'skill-general',
        canonicalName: 'General Capability',
        isPredefined: false
      };
    }

    const normalized = this.normalizeKey(rawSkill);
    const directMatch = this.lookupIndex.get(normalized);

    if (directMatch) {
      return {
        canonicalId: directMatch.canonicalId,
        canonicalName: directMatch.canonicalName,
        definition: directMatch,
        isPredefined: true
      };
    }

    // Try substring / token containment matching
    for (const [key, def] of this.lookupIndex.entries()) {
      if (key.length > 4 && (normalized.includes(key) || key.includes(normalized))) {
        return {
          canonicalId: def.canonicalId,
          canonicalName: def.canonicalName,
          definition: def,
          isPredefined: true
        };
      }
    }

    // Fallback: standard Title Case canonical name with stable kebab id
    const cleanTitle = rawSkill
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    const fallbackId = `skill-${this.normalizeKey(rawSkill).replace(/\s+/g, '-')}`;

    return {
      canonicalId: fallbackId,
      canonicalName: cleanTitle,
      isPredefined: false
    };
  }

  /**
   * Get all registered canonical skills
   */
  public static getAll(): CanonicalSkillDefinition[] {
    this.init();
    return CANONICAL_SKILL_CATALOG;
  }

  /**
   * Get definition by canonicalId
   */
  public static getById(canonicalId: string): CanonicalSkillDefinition | undefined {
    this.init();
    return CANONICAL_SKILL_CATALOG.find(d => d.canonicalId === canonicalId);
  }
}
