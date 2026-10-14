import { ResearchPaper, ArticleSource, CrossSourceSynthesis } from '../features/knowledge/types';

export const RESEARCH_PAPERS_DATA: ResearchPaper[] = [
  {
    id: 'paper-raft-consensus',
    title: 'In Search of an Understandable Consensus Algorithm (Extended Version)',
    authors: ['Diego Ongaro', 'John Ousterhout'],
    year: 2014,
    abstract: 'Raft is a consensus algorithm for managing a replicated log. It produces a result equivalent to (multi-)Paxos and is as efficient as Paxos, but its structure is different: Raft decomposes consensus into relatively independent subproblems (leader election, log replication, and safety) and enforces a stronger degree of coherency to reduce state transitions.',
    doi: '10.5555/2643634.2643666',
    publisher: 'USENIX Association',
    conference: 'USENIX Annual Technical Conference (ATC ‘14)',
    citationCount: 4820,
    url: 'https://raft.github.io/raft.pdf',
    openAccess: true,
    topics: ['Distributed Systems', 'Consensus Algorithms', 'Fault Tolerance', 'State Machine Replication'],
    concepts: ['Raft Consensus', 'Leader Election', 'Log Replication', 'Election Safety', 'Term Numbers'],
    methodology: 'Formal specification of states and invariants, user study comparing Raft vs Paxos comprehension across 43 graduate students from Stanford and UC Berkeley, and empirical performance benchmarking against Chubby and ZooKeeper implementations.',
    findings: [
      'Raft achieves identical fault-tolerance bounds to multi-Paxos while demonstrating significantly higher human comprehension scores in randomized tests.',
      'Decomposing consensus into Leader Election, Log Replication, and Safety guarantees enables formal model checking using TLA+.',
      'Raft requires no message re-ordering or out-of-order log entries, simplifying state machine compaction and snapshotting.'
    ],
    limitations: [
      'Single leader bottleneck under ultra-high write concurrency across wide geographical latencies.',
      'Split-vote deadlocks during simultaneous election timeouts if election timeouts are not randomized.'
    ],
    claims: [
      'Understandability is a first-class metric in system design that directly reduces production implementation bugs.',
      'Strong leader invariants eliminate complex hole-filling protocols present in classic Paxos.'
    ],
    evidence: [
      'Stanford user-study statistically proved 33% higher test scores and faster debugging times with Raft.',
      'Production adoptions in etcd (Kubernetes backing store), HashiCorp Consul, and TiKV.'
    ],
    implications: [
      'Forms the foundational control plane consensus layer for cloud-native orchestration (Kubernetes, Cloud Spanner).',
      'Essential reference for distributed systems engineering interviews when discussing consistency vs availability.'
    ],
    skills: ['Distributed Systems Architecture', 'Consensus Protocols', 'Fault Tolerance'],
    roles: ['Backend Engineer', 'Systems Architect', 'Staff Infrastructure Engineer'],
    sourceAuthority: 5,
    accessMode: 'public_full',
    provenance: 'Official Stanford University & USENIX open-access publication.'
  },
  {
    id: 'paper-dynamo-amazon',
    title: 'Dynamo: Amazon’s Highly Available Key-value Store',
    authors: ['Giuseppe DeCandia', 'Deniz Hastorun', 'Madan Jampani', 'Goran Kakulapati', 'Alex Lakshman', 'Alex Pilchin', 'Swaminathan Sivasubramanian', 'Peter Vosshall', 'Werner Vogels'],
    year: 2007,
    abstract: 'Seamless scaling and always-writable guarantees for Amazon e-commerce platform shopping carts. Combines consistent hashing, vector clocks for versioning, sloppy quorums with hinted handoff, and anti-entropy with Merkle trees.',
    doi: '10.1145/1294261.1294281',
    publisher: 'ACM',
    conference: 'ACM Symposium on Operating Systems Principles (SOSP ‘07)',
    citationCount: 7150,
    url: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf',
    openAccess: true,
    topics: ['NoSQL Databases', 'Eventual Consistency', 'High Availability', 'Decentralized Storage'],
    concepts: ['Consistent Hashing', 'Vector Clocks', 'Sloppy Quorums', 'Hinted Handoff', 'Merkle Trees'],
    methodology: 'Empirical production deployment across Amazon datacenter tier-1 services with p99.9 latency and 100% write-availability SLAs under peak holiday traffic.',
    findings: [
      'Sacrificing strict ACID consistency for eventual consistency enabled zero-downtime shopping carts.',
      'Client-side conflict resolution using vector clocks handles network partitions without blocking writes.',
      'Consistent hashing with virtual nodes achieves balanced partitioning across heterogeneous server hardware.'
    ],
    limitations: [
      'Application logic must reconcile concurrent divergent versions (sibling reconciliation).',
      'No multi-record transactions or relational join capabilities.'
    ],
    claims: [
      'In high-volume e-commerce, losing a customer write during checkout is economically worse than resolving conflicts later.',
      'Targeting 99.9th percentile latency guarantees is more critical than average latency for multi-dependency distributed services.'
    ],
    evidence: [
      'Empirical measurements over 3 years in Amazon production serving millions of concurrent customers.',
      'Direct conceptual ancestor to Apache Cassandra, AWS DynamoDB, and Riak.'
    ],
    implications: [
      'Pioneered modern NoSQL architectures and SLA-driven percentile latency design.',
      'Canonical study for system design interviews regarding the CAP theorem and eventual consistency.'
    ],
    skills: ['System Design', 'NoSQL Database Architecture', 'Percentile Latency Optimization'],
    roles: ['Software Engineer', 'Backend Engineer', 'Solutions Architect'],
    sourceAuthority: 5,
    accessMode: 'public_full',
    provenance: 'ACM SOSP 2007 landmark paper published with open access by Werner Vogels.'
  },
  {
    id: 'paper-attention-transformer',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
    year: 2017,
    abstract: 'The dominant sequence transduction models were based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.',
    doi: '10.48550/arXiv.1706.03762',
    publisher: 'NeurIPS',
    conference: 'Advances in Neural Information Processing Systems (NeurIPS 2017)',
    citationCount: 125000,
    url: 'https://arxiv.org/abs/1706.03762',
    openAccess: true,
    topics: ['Artificial Intelligence', 'Transformers', 'Deep Learning', 'Self-Attention'],
    concepts: ['Self-Attention', 'Multi-Head Attention', 'Positional Encoding', 'Scaled Dot-Product Attention'],
    methodology: 'Empirical translation evaluation on WMT 2014 English-to-German and English-to-French tasks with parallel training across 8 NVIDIA P100 GPUs.',
    findings: [
      'Self-attention mechanisms drastically reduce sequential training constraints, enabling massive GPU parallelization.',
      'Achieved state-of-the-art BLEU scores of 28.4 on En-De while requiring a fraction of the training time of recurrent networks.',
      'Positional encodings successfully retain sequential order without recurrent loop overhead.'
    ],
    limitations: [
      'Quadratic memory complexity O(N^2) relative to input sequence length.',
      'High compute requirements during inference without KV caching.'
    ],
    claims: [
      'Recurrence and convolution are unnecessary for sequential modeling when multi-head attention is utilized.',
      'Attention layers connect all positions with a constant number of sequentially executed operations.'
    ],
    evidence: [
      'Foundational bedrock of modern LLMs (GPT, Gemini, Claude, Llama, PaLM).',
      'Demonstrated superior transfer learning across translation, summarization, and reasoning.'
    ],
    implications: [
      'Essential theoretical foundation for AI Engineering, ML Systems Design, and modern Product Management integrating generative models.'
    ],
    skills: ['AI Engineering', 'Machine Learning Architecture', 'Generative AI Systems'],
    roles: ['AI/ML Engineer', 'Data Scientist', 'AI Product Manager'],
    sourceAuthority: 5,
    accessMode: 'public_full',
    provenance: 'Cornell arXiv.org and NeurIPS open-access archive.'
  }
];

export const ARTICLES_DATA: ArticleSource[] = [
  {
    id: 'art-good-pm-bad-pm',
    title: 'Good Product Manager / Bad Product Manager',
    author: 'Ben Horowitz',
    publication: 'Andreessen Horowitz (a16z)',
    date: '1998-05-15 (Updated 2012)',
    canonicalUrl: 'https://a16z.com/good-product-manager-bad-product-manager/',
    classification: 'primary_source',
    summary: 'The classic technology essay defining the role of the Product Manager as the CEO of the product, outlining accountability, communication discipline, and marketing alignment.',
    concepts: ['Product Ownership Accountability', 'Problem Definition Clarity', 'Strategic Context Setting'],
    claims: [
      'A good product manager knows the market, the product, the product line, and the competition extremely well and operates from a strong basis of knowledge and confidence.',
      'Bad product managers have lots of excuses: not enough engineers, marketing didn’t do their job, the VP changed direction. Good product managers take accountability.'
    ],
    examples: [
      'Good PM creates crisp written collateral, FAQs, and positioning papers; Bad PM leaves teams guessing and creates confusion.',
      'Good PM focuses on the job to be done; Bad PM micromanages how engineering implements the code.'
    ],
    frameworks: ['Horowitz PM Discipline Checklist'],
    references: ['Netscape Communications Internal Leadership Memo'],
    domain: 'Product Management',
    skills: ['Product Leadership', 'Executive Communication', 'Strategic Ownership'],
    roles: ['Product Manager', 'Group Product Manager', 'VP of Product'],
    sourceAuthority: 5,
    accessMode: 'public_full',
    provenance: 'Published publicly on a16z.com insights library.'
  },
  {
    id: 'art-cagan-product-vs-feature',
    title: 'Product vs. Feature Teams',
    author: 'Marty Cagan',
    publication: 'Silicon Valley Product Group (SVPG)',
    date: '2019-09-18',
    canonicalUrl: 'https://www.svpg.com/product-vs-feature-teams/',
    classification: 'primary_source',
    summary: 'Clarifies the critical distinction between feature delivery teams (assigned roadmaps and features to build) vs true product teams (assigned problems and held accountable to business outcomes).',
    concepts: ['Empowered Product Teams', 'Feature Factory Traps', 'Business Outcomes vs Feature Delivery'],
    claims: [
      'Most companies claiming to do Agile are actually doing Waterfall disguised as Agile, using sprint cadences to build stakeholder feature roadmaps.',
      'In true product teams, the Product Manager is responsible for deep understanding of customers, data, industry, and business viability.'
    ],
    examples: [
      'Feature team: "Build PayPal payment integration by Q3."',
      'Empowered product team: "Reduce European checkout drop-off rate from 42% to 15%."'
    ],
    frameworks: ['SVPG Team Archetypes'],
    references: ['Inspired 2nd Edition', 'Transformed'],
    domain: 'Product Management',
    skills: ['Product Strategy', 'Outcome-Oriented Roadmapping', 'Team Autonomy'],
    roles: ['Product Manager', 'Director of Product', 'Agile Coach'],
    sourceAuthority: 5,
    accessMode: 'public_full',
    provenance: 'SVPG official essay archive.'
  }
];

export const SYNTHESES_DATA: CrossSourceSynthesis[] = [
  {
    id: 'synth-modern-product-ownership',
    title: 'Modern Product Ownership: From Delivery Typist to Value Maximizer',
    domain: 'Product Management',
    synthesizedTakeaway: 'The modern Product Owner transcends tactical backlog refinement by synthesizing Scrum Guide value accountabilities with SVPG continuous discovery and Mountain Goat Software vertical user slicing.',
    participatingSources: [
      {
        sourceName: 'The Scrum Guide (2020)',
        author: 'Ken Schwaber & Jeff Sutherland',
        coreContribution: 'Codified the Product Owner as single accountability for maximizing product value and managing the Product Goal commitment.',
        sourceType: 'official_guide'
      },
      {
        sourceName: 'The Professional Scrum Product Owner',
        author: 'Don McGreal & Ralph Jocham',
        coreContribution: 'Introduced Evidence-Based Management (EBM) and Key Value Areas to measure economic and unrealized value.',
        sourceType: 'book'
      },
      {
        sourceName: 'Inspired (2nd Edition)',
        author: 'Marty Cagan (SVPG)',
        coreContribution: 'Shifted focus from feature roadmaps to continuous customer discovery and de-risking the four existential product risks.',
        sourceType: 'book'
      },
      {
        sourceName: 'User Stories Applied',
        author: 'Mike Cohn',
        coreContribution: 'Established INVEST criteria and vertical slicing to maintain deliverable increments in single sprints.',
        sourceType: 'book'
      }
    ],
    synthesizedConcepts: [
      'ku-scrum-accountabilities',
      'ku-product-goal',
      'ku-value-optimization',
      'ku-four-product-risks',
      'ku-invest-criteria'
    ],
    relevantRoles: ['Product Manager', 'Product Owner', 'VP of Product'],
    relevantSkills: ['Product Ownership', 'Product Discovery', 'Value Optimization', 'Outcome-Driven Roadmaps'],
    knowledgeOrigin: 'careeros_synthesis',
    synthesisRationale: 'While each author focuses on a specific aspect (Scrum Guide on boundary rules, PSPO on value metrics, Inspired on discovery habits, Cohn on story mechanics), top-tier tech firms require candidates to embody all four dimensions simultaneously.',
    confidence: 0.98
  },
  {
    id: 'synth-distributed-systems-design',
    title: 'High-Throughput Distributed Architecture: Storage, Replication & Consistency',
    domain: 'Software Engineering & System Architecture',
    synthesizedTakeaway: 'Architecting resilient cloud-scale backends requires balancing write-optimized LSM storage engines, leaderless quorum replication, and atomic consensus while avoiding distributed transaction blocking.',
    participatingSources: [
      {
        sourceName: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        coreContribution: 'Storage engine trade-offs (LSM vs B-Tree), Linearizability vs Serializability taxonomy, and Stream-Table duality.',
        sourceType: 'book'
      },
      {
        sourceName: 'Dynamo: Amazon’s Key-Value Store (SOSP ‘07)',
        author: 'DeCandia et al.',
        coreContribution: 'Pioneered sloppy quorums with hinted handoff and vector clock versioning for always-writable reliability.',
        sourceType: 'academic_paper'
      },
      {
        sourceName: 'In Search of an Understandable Consensus Algorithm (Raft ATC ‘14)',
        author: 'Ongaro & Ousterhout',
        coreContribution: 'Formalized replicated log state machine consensus with leader election and term safety.',
        sourceType: 'academic_paper'
      }
    ],
    synthesizedConcepts: [
      'ku-lsm-vs-btree',
      'ku-leaderless-replication-quorums',
      'ku-distributed-transactions-2pc',
      'ku-linearizability-vs-serializability',
      'ku-stream-table-duality'
    ],
    relevantRoles: ['Backend Engineer', 'Software Engineer', 'Systems Architect', 'Data Engineer'],
    relevantSkills: ['System Design', 'Distributed Systems Architecture', 'Database Tuning'],
    knowledgeOrigin: 'careeros_synthesis',
    synthesisRationale: 'Provides candidates with an integrated decision tree: choose storage engine based on read/write bias (Kleppmann), choose replication based on availability requirements (Dynamo quorums), and isolate coordination into dedicated Raft clusters (etcd) rather than blocking on 2PC.',
    confidence: 0.99
  }
];
