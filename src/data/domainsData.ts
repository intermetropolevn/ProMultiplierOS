import { IndustryDomainGuide } from '../types';

export const DOMAINS_DATA: IndustryDomainGuide[] = [
  {
    id: 'domain-fintech',
    name: 'Fintech & Payments',
    iconName: 'CreditCard',
    summary: 'Fintech systems require absolute data integrity, sub-second ledger reconciliation, distributed idempotency, and stringent compliance with PCI-DSS, SOC 2, and anti-money laundering (AML) protocols.',
    coreBusinessProblems: [
      'Dual-entry bookkeeping and zero-loss financial ledgers under concurrent distributed transactions.',
      'Payment gateway orchestration with automatic smart routing, fallback retries, and fee optimization.',
      'Real-time fraud scoring and anomaly detection at millisecond latency.',
      'Cross-border FX volatility mitigation, settlements, and liquidity management.',
    ],
    regulatoryAndCompliance: [
      'PCI-DSS Level 1: Strict tokenization of primary account numbers (PAN) and cryptographic key rotation.',
      'SOC 2 Type II: Continuous audit trails, change management validation, and zero-trust access.',
      'KYC / AML: Automated watchlist screening (OFAC), suspicious activity reporting (SAR), and identity verification.',
      'SCA (Strong Customer Authentication) & 3D Secure 2.0 under PSD2 in European payment corridors.',
    ],
    architecturalPatterns: [
      'Double-entry immutable ledgers: Every transaction is composed of balanced debit and credit entries; records are append-only.',
      'Idempotent APIs: Clients generate unique Idempotency-Keys cached in Redis/Postgres to prevent duplicate charges upon network retries.',
      'Outbox Pattern: Reliable delivery of payment state changes to message queues (Kafka) without distributed 2PC locking.',
      'Dead Letter Queues (DLQ) with automated alerting and manual replay capabilities for failed bank webhook deliveries.',
    ],
    criticalTerminology: [
      {
        term: 'Idempotency',
        definition: 'The property of an API where multiple identical requests produce the exact same outcome as a single request.',
        exampleUsage: '"We use an Idempotency-Key header stored in Redis with an atomic SETNX lock to prevent billing customers twice if their connection drops."',
      },
      {
        term: 'Chargeback & Representment',
        definition: 'A forced transaction reversal initiated by the cardholder bank due to dispute or fraud, followed by the merchants evidence submission.',
        exampleUsage: '"Our automated representment engine compiles proof of delivery and IP geolocation logs to contest unwarranted chargebacks."',
      },
      {
        term: 'Interchange Fee',
        definition: 'The fee paid by the merchant acquirer to the card-issuing bank for each credit or debit card swipe.',
        exampleUsage: '"We implemented debit routing logic to minimize interchange fees for transactions over $100."',
      },
      {
        term: 'ACH / SEPA Batches',
        definition: 'Automated Clearing House electronic funds transfer systems that process in batch files rather than immediate real-time rails.',
        exampleUsage: '"ACH transactions can take 2-3 business days to settle and require webhook listeners to catch delayed NACHA return codes."',
      },
    ],
    interviewTraps: [
      'Failing to mention idempotency when asked to design a checkout or payment API.',
      'Assuming floating-point math can be used for currency (Always use integers in lowest denomination like cents, or arbitrary-precision Decimal types).',
      'Forgetting distributed transaction race conditions when two concurrent requests try to withdraw from the same user balance.',
    ],
    sampleDiscussionTopics: [
      'How would you design a fault-tolerant payment gateway that integrates with Stripe, Adyen, and PayPal with automatic fallback?',
      'Explain how you would architect a double-entry ledger database schema in PostgreSQL.',
      'What happens when a bank webhook arrives out of order or 48 hours late?',
    ],
  },
  {
    id: 'domain-healthcare',
    name: 'Healthcare & MedTech',
    iconName: 'Activity',
    summary: 'Healthcare technology operates under strict patient privacy statutes (HIPAA, GDPR), clinical reliability standards, and complex healthcare data interoperability protocols like HL7 and FHIR.',
    coreBusinessProblems: [
      'PHI (Protected Health Information) segregation, field-level encryption, and strict least-privilege audit logging.',
      'Interoperability with legacy hospital Electronic Health Record (EHR) systems (Epic, Cerner).',
      'Clinical decision support algorithms with strict explainability and regulatory clearances (FDA Software as a Medical Device).',
      'Telehealth video streaming resilience across low-bandwidth rural clinical environments.',
    ],
    regulatoryAndCompliance: [
      'HIPAA Security & Privacy Rules: Business Associate Agreements (BAAs) required across all cloud infrastructure vendors.',
      'HITRUST CSF certification: Comprehensive healthcare data security controls framework.',
      '21 CFR Part 11: Electronic records and signatures validation for clinical trial systems.',
      'FHIR (Fast Healthcare Interoperability Resources) v4 compliance for patient data sharing.',
    ],
    architecturalPatterns: [
      'Field-level and column-level envelope encryption for PHI data columns with dedicated KMS key hierarchy.',
      'De-identification and anonymization pipelines (Safe Harbor method) prior to routing data to analytics or ML models.',
      'Immutable tamper-evident audit logs capturing every read, update, or export of patient clinical records.',
      'SMART on FHIR OAuth 2.0 integration allowing apps to securely launch inside EHR provider portals.',
    ],
    criticalTerminology: [
      {
        term: 'PHI (Protected Health Information)',
        definition: 'Any individually identifiable health information created or received by a covered entity or business associate.',
        exampleUsage: '"We never log patient emails, medical record numbers (MRN), or diagnostic codes in standard application logs to remain PHI clean."',
      },
      {
        term: 'FHIR (Fast Healthcare Interoperability Resources)',
        definition: 'A REST-based standard for exchanging healthcare information electronically using structured resources (Patient, Observation, Condition).',
        exampleUsage: '"We ingest patient lab results directly from hospital systems using FHIR Observation resources formatted in JSON."',
      },
      {
        term: 'BAA (Business Associate Agreement)',
        definition: 'A legally binding contract that establishes a vendor will safeguard PHI in accordance with HIPAA guidelines.',
        exampleUsage: '"Before spinning up AWS Aurora or Redis instances, we signed a BAA with AWS covering the database cluster."',
      },
    ],
    interviewTraps: [
      'Treating patient medical data like standard e-commerce user profiles without mentioning audit logs or encryption at rest/in transit.',
      'Proposing client-side analytics tools (e.g. Google Analytics or Meta Pixel) on pages where patient health symptoms or appointments are entered.',
      'Not knowing the difference between HIPAA compliance and HITRUST certification.',
    ],
    sampleDiscussionTopics: [
      'How do you design an EHR integration that synchronizes patient appointments without violating rate limits or leaking PHI?',
      'Walk through how you would architect an anonymized data pipeline for medical researchers.',
    ],
  },
  {
    id: 'domain-saas',
    name: 'Enterprise SaaS',
    iconName: 'Building',
    summary: 'Enterprise SaaS platforms must handle multi-tenancy, granular Role-Based Access Control (RBAC/ABAC), SSO (SAML/SCIM), audit logging, and strict data residency across global enterprise clients.',
    coreBusinessProblems: [
      'Multi-tenant isolation: balancing cost-efficiency with noisy-neighbor prevention and data leak security.',
      'Enterprise onboarding: Single Sign-On (Okta, Azure AD), directory synchronization (SCIM), and custom domains.',
      'Complex authorization: hierarchical permissions, team workspaces, custom roles, and sharing matrices.',
      'Extensible integrations: Webhooks, public REST/GraphQL APIs, rate limiting, and third-party app marketplaces.',
    ],
    regulatoryAndCompliance: [
      'SOC 2 Type II: Security, Availability, and Confidentiality trust service criteria.',
      'GDPR & CCPA: Right to be forgotten (data purging), data export tooling, and data residency in EU regions.',
      'ISO/IEC 27001: Information security management systems verification.',
    ],
    architecturalPatterns: [
      'Multi-tenancy models: Shared database with tenant_id row-level security (RLS) in Postgres vs. dedicated schema vs. dedicated database.',
      'SAML 2.0 & OIDC identity federation with just-in-time (JIT) user provisioning and SCIM group syncing.',
      'Tenant-level rate limiting using token bucket algorithms with Redis cluster keys partitioned by organization_id.',
      'Tenant data isolation testing in CI to mathematically verify zero cross-tenant data leakage.',
    ],
    criticalTerminology: [
      {
        term: 'Row-Level Security (RLS)',
        definition: 'A PostgreSQL security feature that restricts which database rows are returned based on user session context.',
        exampleUsage: '"We enabled PostgreSQL RLS with current_setting(app.current_tenant_id) to enforce tenant isolation at the database kernel level."',
      },
      {
        term: 'SCIM (System for Cross-domain Identity Management)',
        definition: 'An open standard protocol to automate the exchange of user identity information between identity providers and SaaS applications.',
        exampleUsage: '"When an enterprise client deactivates an employee in Okta, our SCIM endpoint instantly revokes their session tokens."',
      },
      {
        term: 'Noisy Neighbor Problem',
        definition: 'A multi-tenant architecture issue where one heavy customer monopolizes CPU, memory, or I/O, degrading performance for others.',
        exampleUsage: '"We isolated background report exports into tenant-throttled queue partitions to eliminate the noisy neighbor problem."',
      },
    ],
    interviewTraps: [
      'Neglecting tenant isolation in database queries, opening the company to cross-tenant data leaks.',
      'Overlooking SAML SSO / SCIM requirements when discussing enterprise adoption.',
      'Not factoring in soft deletes vs. hard GDPR deletion requirements.',
    ],
    sampleDiscussionTopics: [
      'Compare row-level multi-tenancy vs database-per-tenant for a B2B platform with 10,000 small companies and 5 Fortune 500 accounts.',
      'How would you architect an enterprise audit log system that is tamper-proof and searchable across millions of events?',
    ],
  },
  {
    id: 'domain-ai',
    name: 'AI & Machine Learning',
    iconName: 'Cpu',
    summary: 'Modern AI platforms focus on LLM orchestration, Retrieval-Augmented Generation (RAG), vector database retrieval, prompt caching, low-latency streaming, and continuous programmatic evaluation.',
    coreBusinessProblems: [
      'Context window cost and latency optimization under high user concurrency.',
      'Hallucination reduction and grounding in enterprise knowledge sources.',
      'Real-time streaming response delivery with low Time-to-First-Token (TTFT).',
      'Continuous evaluation (evals) to guard against prompt regressions and drift.',
    ],
    regulatoryAndCompliance: [
      'EU AI Act: Risk tier categorization, transparency reporting, and copyright data provenance.',
      'Enterprise IP indemnification and zero-data-retention agreements for proprietary customer prompts.',
      'Prompt injection & jailbreak vulnerability mitigations (OWASP Top 10 for LLM Applications).',
    ],
    architecturalPatterns: [
      'Hybrid Retrieval: Combining BM25 keyword search with dense vector embeddings and cross-encoder re-ranking for optimal accuracy.',
      'Chunking & Semantic Partitioning: Recursive character splitting with hierarchical parent-child document references.',
      'Server-Sent Events (SSE) / WebSockets for streaming token chunks with heartbeat connection management.',
      'Automated Evaluation Harness: Unit tests for prompts running against golden benchmark datasets with programmatic scoring.',
    ],
    criticalTerminology: [
      {
        term: 'RAG (Retrieval-Augmented Generation)',
        definition: 'A technique that enhances an LLM by retrieving relevant documents from an external knowledge base before generating responses.',
        exampleUsage: '"We implemented a hybrid RAG pipeline using pgvector and Cohere re-ranker, reducing factual hallucinations by 42%."',
      },
      {
        term: 'TTFT (Time-to-First-Token)',
        definition: 'The latency duration between when a user submits a prompt and when the model outputs its very first streamed character.',
        exampleUsage: '"By enabling KV-cache reuse and speculative decoding in vLLM, we lowered TTFT from 1.2s down to 240ms."',
      },
      {
        term: 'Prompt Injection',
        definition: 'A security vulnerability where malicious user input manipulates the LLM into ignoring system instructions or exfiltrating private context.',
        exampleUsage: '"We isolate untrusted user data in delimited XML tags and pass inputs through an adversarial classifier before LLM ingestion."',
      },
    ],
    interviewTraps: [
      'Treating vector similarity search as a silver bullet without mentioning keyword/semantic hybrid search or re-ranking.',
      'Failing to consider LLM token costs and latency trade-offs at scale.',
      'Lacking concrete strategies for measuring model accuracy and quality regressions.',
    ],
    sampleDiscussionTopics: [
      'Walk through how you would architect a production RAG system for a knowledge base with 500,000 PDF documents.',
      'How do you prevent prompt injection when building an agent that has tool-calling privileges to execute database queries or send emails?',
    ],
  },
  {
    id: 'domain-ecommerce',
    name: 'E-Commerce & Retail',
    iconName: 'ShoppingBag',
    summary: 'E-Commerce systems require massive read-heavy catalog caching, high-concurrency flash sale inventory reservations, distributed shopping carts, and dynamic pricing engines.',
    coreBusinessProblems: [
      'Inventory race conditions during flash sales (overselling prevention).',
      'Sub-100ms catalog search and faceted filtering over millions of SKUs.',
      'Cart abandonment recovery, dynamic pricing, and personalized recommendations.',
      'Omnichannel fulfillment, warehouse routing, and logistics supply chain tracking.',
    ],
    regulatoryAndCompliance: [
      'Sales Tax Compliance: Automated calculation via Avalara/TaxJar across varying state and international VAT jurisdictions.',
      'PCI-DSS Compliance for payment processing.',
      'Consumer Privacy & Cookie Consent (CCPA, GDPR) for ad tracking and retargeting.',
    ],
    architecturalPatterns: [
      'Two-phase inventory reservation: Soft-lock inventory in Redis with short TTL when user begins checkout; hard-commit in SQL upon payment capture.',
      'CQRS (Command Query Responsibility Segregation): Elasticsearch for fast faceted search queries; relational Postgres for transactional orders.',
      'Edge Caching: Storing product pages at Cloudflare edge workers with stale-while-revalidate cache purging.',
    ],
    criticalTerminology: [
      {
        term: 'SKU (Stock Keeping Unit)',
        definition: 'A distinct code that identifies an individual product variant based on size, color, and specifications.',
        exampleUsage: '"Our catalog contains 2.5 million active SKUs synchronized across three regional distribution centers."',
      },
      {
        term: 'Cart Abandonment Rate',
        definition: 'The percentage of shoppers who add items to their digital shopping cart but exit without completing the purchase.',
        exampleUsage: '"Introducing 1-click Apple Pay checkout reduced our mobile cart abandonment rate by 14%."',
      },
    ],
    interviewTraps: [
      'Allowing database locks to bottle-neck the entire product catalog during a high-traffic marketing campaign.',
      'Not explaining how to prevent inventory overselling when 5,000 customers try to buy the last 10 sneakers simultaneously.',
    ],
    sampleDiscussionTopics: [
      'How would you architect the checkout and inventory reservation system for a Black Friday flash sale?',
      'How do you design a search and recommendation engine for an e-commerce catalog with millions of items?',
    ],
  },
];
