import { DetailedWorkflowItem } from '../types/knowledgeTaxonomy';

export const DETAILED_WORKFLOWS_DATA: DetailedWorkflowItem[] = [
  {
    id: 'wf-order-ingestion-sor',
    title: 'High-Throughput Order Ingestion & System of Record (SOR) Pipeline',
    codeName: 'INGESTION-SOR-01',
    category: 'Software Engineering',
    domain: 'E-Commerce & Retail',
    summary: 'A resilient, multi-stage checkout ingestion pipeline guaranteeing durable System of Record (SOR) persistence before dispatching asynchronous fulfillment events.',
    context: 'During flash sales and Black Friday traffic spikes (3,000+ checkout submissions/sec), synchronous database writes saturate connection pools and cause gateway 504 timeouts. The system must decouple durable transaction ledger recording from downstream inventory and notification workflows.',
    architectureType: 'Event-Driven Microservices with Outbox Pattern & Redis Fast Validation',
    estimatedDuration: 'End-to-end execution: 120ms p95; background worker completion: <1.5s',
    frequency: 'Continuous mission-critical transactional execution (millions of orders/day)',
    realWorldImpact: 'Eliminates checkout dropping, prevents overselling inventory, and provides an auditable, tamper-proof System of Record for financial reconciliation.',
    inputs: [
      'Customer Checkout Payload (cart items, payment token, shipping address, idempotency key)',
      'Real-time Inventory Lease Token (Redis TTL)',
      'Tax & Discount Computed Signature'
    ],
    outputs: [
      'Durable Immutable Order Record in Primary PostgreSQL DB (SOR)',
      'Transactional Outbox Event in Apache Kafka (`order.created.v1`)',
      'Instant HTTP 201 Created Response with Order Tracking UUID'
    ],
    dependencies: [
      'Stripe/Adyen Payment Gateway Webhook Verification',
      'Redis Cluster for Fast Ephemeral Inventory Reservation',
      'Managed Kafka Cluster with Replica Ingestion Factor 3'
    ],
    systemsAndComponents: [
      'Edge Envoy Ingress Gateway (Rate Limiting & JWT Validation)',
      'Checkout Microservice (Go / TypeScript Node)',
      'Transactional PostgreSQL Cluster (Primary Writer with Multi-AZ)',
      'Debezium Change Data Capture (CDC) / Outbox Publisher to Kafka',
      'Asynchronous Warehouse Routing Consumer'
    ],
    failureModesAndRecovery: [
      {
        failureMode: 'Kafka Broker Unreachable during Order Creation',
        detectionSignal: 'CDC publisher alert; Kafka producer timeout metrics spike',
        mitigationStrategy: 'Transactional Outbox pattern ensures order is saved in Postgres first; background worker retries Kafka publishing without dropping customer order.'
      },
      {
        failureMode: 'Database Replica Lag exceeding 2 seconds',
        detectionSignal: 'Read replica lag metric in Datadog triggers P2 warning',
        mitigationStrategy: 'Force critical immediate post-checkout order confirmation lookups to read from Primary DB (Write-Through Read) using short-lived sticky session headers.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Edge Validation & Idempotency Key Acquisition',
        phase: 'Ingress & Deduplication',
        keyActions: [
          'Validate client JWT session and request payload checksum.',
          'Execute atomic Redis `SET order:idem:{idempotency_key} "PENDING" NX EX 60` to block duplicate submit button clicks.',
          'If key already exists, return previous cached order status or 409 Conflict.'
        ],
        toolsUsed: ['Cloudflare / Envoy', 'Redis v7.2 cluster', 'JSON Schema Validator'],
        deliverables: ['Validated request context and lock lease'],
        commonPitfalls: ['Using client IP address instead of cryptographically signed UUID for idempotency.']
      },
      {
        stepNumber: 2,
        title: 'Step 2: Atomically Commit Order to Primary SOR Database',
        phase: 'Transactional Ledger Commitment',
        keyActions: [
          'Begin relational database ACID transaction.',
          'Insert order record with status `PENDING_FULFILLMENT`.',
          'Insert corresponding domain event in the local `outbox_events` table within the SAME transaction boundary.',
          'Commit transaction, releasing database row locks in under 12ms.'
        ],
        toolsUsed: ['PostgreSQL 16 Enterprise', 'PgBouncer connection pool'],
        deliverables: ['Durable immutable order row and outbox entry'],
        commonPitfalls: ['Calling an external third-party API (like payment capture) inside the open DB transaction, locking connections.']
      },
      {
        stepNumber: 3,
        title: 'Step 3: Asynchronous Outbox Event Emission to Kafka',
        phase: 'Event Streaming & Decoupled Dispatch',
        keyActions: [
          'Debezium / Outbox poller reads committed events from `outbox_events` using low-overhead CDC log tailing.',
          'Emits structured Protobuf / CloudEvents message to `orders.events` topic.',
          'Inventory service, Warehouse MES, and Email worker consume the topic independently.'
        ],
        toolsUsed: ['Apache Kafka', 'Debezium CDC Engine', 'Protobuf Schema Registry'],
        deliverables: ['Published Kafka record with partition key `order_id`'],
        commonPitfalls: ['Publishing events before database commit succeeds, leading to phantom events.']
      }
    ],
    microDataset: {
      serviceName: 'Checkout-Ingestion-Service (v2.4.1)',
      subsystemContext: 'Global Cart Checkout & Order Processing Tier',
      sampleTimeframe: 'Peak Traffic Window (Last 60 Minutes)',
      overallThroughput: '4,280 orders/sec',
      errorRatePercent: 0.018,
      latencyP50: '38ms',
      latencyP95: '92ms',
      latencyP99: '145ms',
      metrics: [
        { name: 'Gateway Ingestion Rate', value: '4,280', benchmark: '5,000 max', unit: 'req/sec', health: 'optimal', trend: 'improving' },
        { name: 'SOR Database Transaction Time', value: '11.4', benchmark: '< 25.0', unit: 'ms', health: 'optimal', trend: 'stable' },
        { name: 'Redis Lock Contention Rate', value: '0.42', benchmark: '< 1.5', unit: '%', health: 'optimal', trend: 'stable' },
        { name: 'Kafka Outbox Dispatch Lag', value: '62', benchmark: '< 200', unit: 'ms', health: 'optimal', trend: 'improving' },
        { name: 'Order Ingestion Error Rate (5xx)', value: '0.018', benchmark: '< 0.05', unit: '%', health: 'optimal', trend: 'improving' }
      ],
      funnelSteps: [
        {
          stepIndex: 1,
          label: 'Client Payload Submit',
          throughput: '4,310 req/s',
          conversionRate: '100%',
          dropOffRate: '0%',
          latencyP95: '8ms',
          errorRate: '0.002%',
          failureMode: 'Network timeout / dropped packets'
        },
        {
          stepIndex: 2,
          label: 'Redis Idempotency Check',
          throughput: '4,309 req/s',
          conversionRate: '99.6%',
          dropOffRate: '0.4%',
          latencyP95: '14ms',
          errorRate: '0.001%',
          failureMode: 'Duplicate rapid double-clicks short-circuited'
        },
        {
          stepIndex: 3,
          label: 'ACID DB Commit (SOR & Outbox)',
          throughput: '4,292 req/s',
          conversionRate: '99.8%',
          dropOffRate: '0.2%',
          latencyP95: '64ms',
          errorRate: '0.012%',
          failureMode: 'Transient connection pool wait'
        },
        {
          stepIndex: 4,
          label: 'Kafka CDC Ingestion Dispatch',
          throughput: '4,280 msg/s',
          conversionRate: '99.9%',
          dropOffRate: '0.08%',
          latencyP95: '92ms',
          errorRate: '0.003%',
          failureMode: 'Replication sync backpressure'
        }
      ]
    }
  },
  {
    id: 'wf-idempotency-distributed-locks',
    title: 'Distributed Idempotency & Concurrency Control Protocol',
    codeName: 'IDEMPOTENCY-V2',
    category: 'Software Engineering',
    domain: 'Fintech & Payments',
    summary: 'A standardized protocol combining HTTP client idempotency keys, Redis distributed atomic token leases, and database unique constraints to prevent double-spending and race conditions.',
    context: 'Unstable mobile client networks trigger rapid retry storms when responses take longer than 2.5 seconds. Without distributed idempotency, payment card captures or ledger balance deductions execute multiple times, incurring massive chargeback fees and user distress.',
    architectureType: 'Two-Tier Defense: Fast Redis Distributed Lock + Relational Unique Constraint Guarantee',
    estimatedDuration: 'Lock acquisition: < 4ms; Full idempotent transaction: ~75ms',
    frequency: 'Required for all mutative financial, credit deduction, and subscription mutation endpoints',
    realWorldImpact: 'Eliminates 100% of duplicate payment captures and prevents concurrent debit race conditions.',
    inputs: [
      'HTTP Header: `Idempotency-Key: {UUIDv4}`',
      'Tenant/User ID',
      'Transaction Amount & Currency Checksum'
    ],
    outputs: [
      'Guaranteed Single-Execution Transaction',
      'Cached Exact Replay Payload for subsequent retried calls with same Idempotency-Key'
    ],
    dependencies: [
      'Redis 7 with Lua Scripting Support',
      'PostgreSQL with Composite Unique Index `(tenant_id, idempotency_key)`'
    ],
    systemsAndComponents: [
      'Idempotency Middleware Interceptor',
      'Distributed Redis Lock Engine (Redlock algorithm / atomic Lua script)',
      'Ledger Transaction Service',
      'Cached Response Repository'
    ],
    failureModesAndRecovery: [
      {
        failureMode: 'Worker crashes mid-transaction while holding Redis lock',
        detectionSignal: 'Redis key TTL active without completed DB record',
        mitigationStrategy: 'Lock key uses strict 30-second TTL (`EX 30`). Deadlock auto-expires. Database unique constraint prevents any conflicting write.'
      },
      {
        failureMode: 'Client reuses Idempotency Key with modified payment amount',
        detectionSignal: 'Payload hash comparison mismatch error in middleware',
        mitigationStrategy: 'Reject request immediately with HTTP 422 Unprocessable Entity ("Idempotency key payload mismatch").'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Compute Hash & Inspect Existing Key Status',
        phase: 'Validation & Fast Path Check',
        keyActions: [
          'Extract `Idempotency-Key` header and compute SHA-256 hash of incoming request body.',
          'Query Redis key `idem:{tenant_id}:{key}`.',
          'If key status is `COMPLETED`, return the cached serialized HTTP response headers and body with `X-Cache: Idempotent-Hit` without executing service logic.'
        ],
        toolsUsed: ['Node.js / Go crypto', 'Redis hash lookups'],
        deliverables: ['Instant replay response or permission to proceed'],
        commonPitfalls: ['Allowing client to change the transaction amount while keeping the same idempotency key.']
      },
      {
        stepNumber: 2,
        title: 'Acquire Distributed Mutex via Atomic Lua Script',
        phase: 'Locking',
        keyActions: [
          'Execute Lua script to set status `PROCESSING` only if key does not exist.',
          'Set expiration to 30 seconds to prevent permanent lock abandonment.',
          'If lock is already in `PROCESSING`, poll for up to 3,000ms with exponential backoff before returning HTTP 409 Conflict.'
        ],
        toolsUsed: ['Redis Lua Scripting', 'Redlock Protocol'],
        deliverables: ['Distributed execution lock acquired'],
        commonPitfalls: ['Setting lock TTL too short before downstream slow payment gateway returns.']
      },
      {
        stepNumber: 3,
        title: 'Execute Ledger Write & Store Cached Response',
        phase: 'Execution & Cache Sealing',
        keyActions: [
          'Execute core balance transfer inside database transaction with unique constraint.',
          'Save response payload into Redis `idem:{tenant_id}:{key}` with status `COMPLETED` and 24-hour TTL.',
          'Return HTTP 200 OK with newly committed transaction details.'
        ],
        toolsUsed: ['PostgreSQL', 'Redis JSON / String storage'],
        deliverables: ['Committed balance transfer and sealed replay cache'],
        commonPitfalls: ['Failing to release the lock in a finally{} block when an unhandled exception occurs.']
      }
    ],
    microDataset: {
      serviceName: 'Ledger-Idempotency-Gateway',
      subsystemContext: 'Payment & Wallet Core Debit Engine',
      sampleTimeframe: 'Live Window (Past 24 Hours)',
      overallThroughput: '1,840 calls/sec',
      errorRatePercent: 0.004,
      latencyP50: '18ms',
      latencyP95: '48ms',
      latencyP99: '82ms',
      metrics: [
        { name: 'Total Idempotent Transactions', value: '158.4M', benchmark: '100M+', unit: 'calls/day', health: 'optimal', trend: 'stable' },
        { name: 'Duplicate Request Rate Intercepted', value: '4.8', benchmark: '< 10.0', unit: '%', health: 'optimal', trend: 'improving' },
        { name: 'Double-Spend Prevented Count', value: '74,210', benchmark: '0 leaks', unit: 'prevented', health: 'optimal', trend: 'improving' },
        { name: 'Average Lock Hold Duration', value: '24.2', benchmark: '< 50.0', unit: 'ms', health: 'optimal', trend: 'stable' },
        { name: 'Lock Timeout / Leak Rate', value: '0.000', benchmark: '0.000', unit: '%', health: 'optimal', trend: 'stable' }
      ],
      funnelSteps: [
        {
          stepIndex: 1,
          label: 'Client Payment Request',
          throughput: '1,840 req/s',
          conversionRate: '100%',
          dropOffRate: '0%',
          latencyP95: '4ms',
          errorRate: '0.001%',
          failureMode: 'Malformed header syntax'
        },
        {
          stepIndex: 2,
          label: 'Cache Hit Lookup',
          throughput: '1,838 req/s',
          conversionRate: '95.2%',
          dropOffRate: '4.8%',
          latencyP95: '12ms',
          errorRate: '0.000%',
          failureMode: '4.8% duplicate calls returned from cache without DB touch'
        },
        {
          stepIndex: 3,
          label: 'Distributed Lua Lock Acquired',
          throughput: '1,750 req/s',
          conversionRate: '99.9%',
          dropOffRate: '0.1%',
          latencyP95: '22ms',
          errorRate: '0.002%',
          failureMode: 'Concurrent in-flight race condition blocked'
        },
        {
          stepIndex: 4,
          label: 'DB Unique Write & Response Cached',
          throughput: '1,748 req/s',
          conversionRate: '100%',
          dropOffRate: '0%',
          latencyP95: '48ms',
          errorRate: '0.001%',
          failureMode: 'Postgres row serialization'
        }
      ]
    }
  },
  {
    id: 'wf-dead-letter-queue-redrive',
    title: 'Dead Letter Queue (DLQ) & Poison Pill Retry Protocol',
    codeName: 'DLQ-RETRY-03',
    category: 'DevOps & Cloud',
    domain: 'Enterprise SaaS',
    summary: 'A bulletproof asynchronous consumer protocol that isolates unprocessable poison-pill messages into a quarantined Dead Letter Queue while maintaining real-time stream throughput.',
    context: 'When an unhandled schema change, malformed third-party webhook, or corrupted customer payload arrives in an asynchronous event stream, consumer pods can crash in a continuous reboot loop (crash loop backoff), stalling the entire queue partition for millions of healthy events.',
    architectureType: '3-Tier Retry Schedule with Jitter, Dead Letter Queue (DLQ), and Re-drive Admin Tooling',
    estimatedDuration: 'Instant isolation in < 5 retries; manual re-drive after bug fix',
    frequency: 'Triggered whenever message unmarshalling or transactional worker fails repeatedly',
    realWorldImpact: 'Guarantees zero queue blockage for healthy tenants while preserving failed messages for post-mortem analysis and re-drive without data loss.',
    inputs: [
      'Kafka / SQS Stream Message Envelope',
      'Exception Stack Trace & Retry Header (`x-retry-count`)',
      'Target Consumer Dead Letter Queue Configuration'
    ],
    outputs: [
      'Isolated DLQ Record with Metadata Diagnostic Headers',
      'Prometheus Alert Counter Increment (`consumer_dlq_routed_total`)',
      'Continued Processing of Healthy Queue Stream'
    ],
    dependencies: [
      'Apache Kafka or AWS SQS with DLQ Redrive Policies',
      'OpenTelemetry Distributed Tracing',
      'PagerDuty Alerting Rules'
    ],
    systemsAndComponents: [
      'Consumer Worker Pods with Graceful Shutdown',
      'Retry Topic Chain (`events.retry.10s`, `events.retry.60s`)',
      'Quarantined Dead Letter Queue (`events.dlq`)',
      'DLQ Inspection & Re-drive UI / CLI'
    ],
    failureModesAndRecovery: [
      {
        failureMode: 'Poison pill causes Out of Memory (OOM) before retry logic catches it',
        detectionSignal: 'Kubernetes OOMKilled pod status events in Datadog',
        mitigationStrategy: 'Enforce strict payload size limits (max 512KB) at ingress; pre-parse message metadata in a lightweight sandbox.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Initial Consumer Failure & Transient Retry with Exponential Jitter',
        phase: 'Transient Fault Tolerance',
        keyActions: [
          'Catch unhandled exception during message processing.',
          'Check if error is transient (e.g. database timeout) vs fatal (e.g. invalid JSON syntax).',
          'If transient and `x-retry-count < 3`, re-publish to delayed retry topic with exponential backoff and randomized jitter.'
        ],
        toolsUsed: ['Node.js Worker / Go Consumer', 'Backoff Algorithm'],
        deliverables: ['Message delayed without blocking main partition'],
        commonPitfalls: ['Retrying indefinitely without jitter, causing thundering herd on downstream database.']
      },
      {
        stepNumber: 2,
        title: 'Route to Quarantined Dead Letter Queue (DLQ)',
        phase: 'Isolation & Circuit Breaking',
        keyActions: [
          'If retry count reaches max threshold (e.g. 3 attempts), serialize message payload.',
          'Inject diagnostic headers: `x-original-topic`, `x-error-message`, `x-failed-at`, `x-worker-host`.',
          'Commit message to DLQ and ACK original stream message to resume consumer partition.'
        ],
        toolsUsed: ['Kafka Producer to `events.dlq`', 'Prometheus Metrics'],
        deliverables: ['Quarantined DLQ message with forensic diagnostic headers'],
        commonPitfalls: ['Dropping the failed message to /dev/null without saving payload for audit.']
      },
      {
        stepNumber: 3,
        title: 'Inspection, Bug Patch & Controlled Batch Re-drive',
        phase: 'Resolution & Replay',
        keyActions: [
          'Engineer reviews DLQ payload and stack trace; deploys software bug fix.',
          'Runs DLQ Re-drive job to replay quarantined messages back to primary ingestion topic at controlled rate (100 msg/sec).',
          'Verify clean consumer processing without triggering secondary alerts.'
        ],
        toolsUsed: ['DLQ Re-drive Script', 'Grafana Consumer Dashboard'],
        deliverables: ['100% of failed customer messages successfully processed without data loss'],
        commonPitfalls: ['Re-driving millions of DLQ messages all at once, overwhelming downstream services.']
      }
    ],
    microDataset: {
      serviceName: 'Async-Event-Processor-DLQ',
      subsystemContext: 'Worker Pool & Stream Consumer Tier',
      sampleTimeframe: 'Last 7 Days Operating Log',
      overallThroughput: '12,400 msg/sec',
      errorRatePercent: 0.008,
      latencyP50: '12ms',
      latencyP95: '35ms',
      latencyP99: '68ms',
      metrics: [
        { name: 'Total Stream Messages Processed', value: '7.5B', benchmark: '5B+', unit: 'msgs/month', health: 'optimal', trend: 'stable' },
        { name: 'First-Pass Success Rate', value: '99.982', benchmark: '> 99.95', unit: '%', health: 'optimal', trend: 'improving' },
        { name: 'Transient Retries Resolved', value: '14,810', benchmark: '< 50K', unit: 'resolved', health: 'optimal', trend: 'stable' },
        { name: 'Total Messages Quarantined to DLQ', value: '248', benchmark: '< 500', unit: 'msgs', health: 'optimal', trend: 'improving' },
        { name: 'DLQ Re-drive Success Rate', value: '100', benchmark: '100', unit: '%', health: 'optimal', trend: 'stable' }
      ],
      funnelSteps: [
        {
          stepIndex: 1,
          label: 'Stream Consumer Polling',
          throughput: '12,400 msg/s',
          conversionRate: '100%',
          dropOffRate: '0%',
          latencyP95: '6ms',
          errorRate: '0.000%',
          failureMode: 'Network partition / rebalance'
        },
        {
          stepIndex: 2,
          label: 'Worker Message Processing',
          throughput: '12,398 msg/s',
          conversionRate: '99.98%',
          dropOffRate: '0.02%',
          latencyP95: '28ms',
          errorRate: '0.018%',
          failureMode: 'Downstream timeout or malformed JSON'
        },
        {
          stepIndex: 3,
          label: 'Transient Retry Handling',
          throughput: '2.4 msg/s',
          conversionRate: '96.2%',
          dropOffRate: '3.8%',
          latencyP95: '35ms',
          errorRate: '0.002%',
          failureMode: 'Transient network glitch resolved in retry'
        },
        {
          stepIndex: 4,
          label: 'Quarantine to DLQ with Diagnostics',
          throughput: '0.09 msg/s',
          conversionRate: '100%',
          dropOffRate: '0%',
          latencyP95: '18ms',
          errorRate: '0.000%',
          failureMode: 'Poison pill successfully quarantined'
        }
      ]
    }
  },
  {
    id: 'wf-barcode-mes-print-on-demand',
    title: 'Barcode MES (Manufacturing Execution System) Scanning & Batch Verification',
    codeName: 'MES-SCAN-04',
    category: 'Program & Project Management',
    domain: 'Logistics & Supply Chain',
    summary: 'An operational shop-floor protocol coordinating physical 2D DataMatrix/barcode hardware scanners, real-time MES event streaming, and quality assurance checkpoints for Print-on-Demand (POD) and warehouse fulfillment.',
    context: 'In high-speed fulfillment facilities producing 50,000 customized garments/items per shift, any mis-scan or desynchronization between a physical barcode label and the digital print routing file causes misprinted apparel, incorrect customer shipping labels, and costly return waste.',
    architectureType: 'Edge Industrial IoT Scanners connected to Local MES Gateway with Cloud Sync',
    estimatedDuration: 'Scan-to-validation: < 180ms on shop floor; Batch cycle: 45 minutes',
    frequency: 'Continuous operation across 12 manufacturing production lines (24/7)',
    realWorldImpact: 'Reduces misprint and mis-pack error rates from 2.4% down to 0.04%, saving hundreds of thousands of dollars in lost garment inventory.',
    inputs: [
      '2D DataMatrix / Code 128 Laser Barcode Scan',
      'Station ID (Cutting, Direct-to-Garment DTG Print, Heat Press, Quality Assurance, Packing)',
      'Worker Operator RFID Badge Token'
    ],
    outputs: [
      'Sub-200ms Audio/Visual Green Go / Red Stop Terminal Signal',
      'Dynamic Laser Alignment & Artwork File Preload to Printing Machine',
      'Immutable Production Audit Event logged to Cloud MES Database'
    ],
    dependencies: [
      'Zebra / Cognex Industrial Barcode Scanners',
      'On-Premise Industrial Edge Gateway with Local SQLite Cache',
      'Cloud MES ERP WebSocket Connection'
    ],
    systemsAndComponents: [
      'Station Touchscreen Terminal running React Embedded Client',
      'Local Edge Hub (Go Daemon buffering scans during internet outages)',
      'Central Fulfillment Inventory & Routing Service',
      'Automated Conveyor Diverter PLC (Programmable Logic Controller)'
    ],
    failureModesAndRecovery: [
      {
        failureMode: 'Internet connection to central cloud drops during warehouse shift',
        detectionSignal: 'Edge gateway heartbeat disconnection alert',
        mitigationStrategy: 'Local edge hub continues validating barcodes using pre-cached local SQLite batch manifests; automatically replays synced events upon internet reconnect.'
      },
      {
        failureMode: 'Damaged or unreadable barcode label on conveyor belt',
        detectionSignal: 'Vision camera "No-Read" event triggered at diverter switch',
        mitigationStrategy: 'Pneumatic diverter automatically shunts item to Exception Inspection Lane; sounds non-blocking operator yellow chime.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Scan Acquisition & Local Manifest Check',
        phase: 'Shop Floor Acquisition',
        keyActions: [
          'Worker scans item barcode at work station with high-speed 2D imager.',
          'Local station validates item checksum and checks state machine: "Is item in valid upstream state (e.g. PRINTED before PACKED)?"',
          'If valid, trigger green LED and display operator instructions on 15" touchscreen.'
        ],
        toolsUsed: ['Industrial Scanner', 'Local Edge Daemon'],
        deliverables: ['Operator green signal and screen instructions in < 150ms'],
        commonPitfalls: ['Allowing items to skip mandatory quality inspection steps due to out-of-order scanning.']
      },
      {
        stepNumber: 2,
        title: 'Automated Artwork File Transmission to Machine',
        phase: 'Machine Coordination',
        keyActions: [
          'MES pulls high-resolution 300 DPI vector artwork file from edge cache.',
          'Transmits calibrated color profile and print coordinates directly to printer RIP software over local LAN.',
          'Locks order status as `IN_PRODUCTION` to prevent duplicate parallel prints.'
        ],
        toolsUsed: ['Ethernet IP Protocol', 'Kornit / Brother DTG RIP Software'],
        deliverables: ['Active print job loaded into machine memory'],
        commonPitfalls: ['Printing with incorrect color profile settings due to missing garment fabric type metadata.']
      },
      {
        stepNumber: 3,
        title: 'Quality Verification & Shipping Label Generation',
        phase: 'Final QA & Packaging',
        keyActions: [
          'Post-cure QA station scans completed garment and checks against digital proof photo.',
          'Thermal printer immediately generates FedEx / DHL shipping label with matching order barcode.',
          'Order marked as `FULFILLED_SHIPPED` and tracking number sent to customer.'
        ],
        toolsUsed: ['Zebra Thermal Label Printer', 'FedEx ShipManager API'],
        deliverables: ['Printed shipping label and customer notification'],
        commonPitfalls: ['Attaching the wrong shipping label to a package due to batch printing without item scan.']
      }
    ],
    microDataset: {
      serviceName: 'Shop-Floor-MES-Controller',
      subsystemContext: 'POD Manufacturing Plant 1 (Line 3 & 4)',
      sampleTimeframe: 'Day Shift (8 Hours Log)',
      overallThroughput: '18 scans/minute/station',
      errorRatePercent: 0.042,
      latencyP50: '65ms',
      latencyP95: '160ms',
      latencyP99: '210ms',
      metrics: [
        { name: 'Shift Completed Garments', value: '18,420', benchmark: '15,000+', unit: 'units', health: 'optimal', trend: 'improving' },
        { name: 'Barcode Scan Read Rate', value: '99.88', benchmark: '> 99.5', unit: '%', health: 'optimal', trend: 'stable' },
        { name: 'Scan-to-Signal Latency', value: '142', benchmark: '< 200', unit: 'ms', health: 'optimal', trend: 'stable' },
        { name: 'Out-of-Sequence Scans Prevented', value: '38', benchmark: '< 50', unit: 'catches', health: 'optimal', trend: 'improving' },
        { name: 'Defect / Misprint Rate', value: '0.042', benchmark: '< 0.20', unit: '%', health: 'optimal', trend: 'improving' }
      ],
      funnelSteps: [
        {
          stepIndex: 1,
          label: 'Barcode Laser Hardware Trigger',
          throughput: '18.2 scans/min',
          conversionRate: '100%',
          dropOffRate: '0%',
          latencyP95: '25ms',
          errorRate: '0.001%',
          failureMode: 'Dirty laser optic lens'
        },
        {
          stepIndex: 2,
          label: 'Edge Gateway State Verification',
          throughput: '18.1 scans/min',
          conversionRate: '99.8%',
          dropOffRate: '0.2%',
          latencyP95: '75ms',
          errorRate: '0.002%',
          failureMode: 'Out-of-order station sequence rejected'
        },
        {
          stepIndex: 3,
          label: 'Machine Artwork Preload',
          throughput: '18.1 jobs/min',
          conversionRate: '100%',
          dropOffRate: '0%',
          latencyP95: '120ms',
          errorRate: '0.001%',
          failureMode: 'Local LAN socket timeout'
        },
        {
          stepIndex: 4,
          label: 'QA Check & Final Label Generation',
          throughput: '18.0 labels/min',
          conversionRate: '99.9%',
          dropOffRate: '0.1%',
          latencyP95: '160ms',
          errorRate: '0.002%',
          failureMode: 'Thermal ribbon out of stock'
        }
      ]
    }
  }
];
