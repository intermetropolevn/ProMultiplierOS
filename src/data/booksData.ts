import { Book } from '../features/knowledge/types';

export const BOOKS_DATA: Book[] = [
  {
    id: 'book-scrum-guide',
    title: 'The Scrum Guide',
    subtitle: 'The Definitive Guide to Scrum: The Rules of the Game',
    authors: ['Ken Schwaber', 'Jeff Sutherland'],
    publisher: 'Scrum.org & Scrum Inc.',
    publicationYear: 2020,
    edition: 'November 2020 Edition',
    officialUrl: 'https://scrumguides.org',
    publisherUrl: 'https://www.scrum.org/resources/scrum-guide',
    authorUrl: 'https://jeffsutherland.com',
    domain: 'Product Management',
    subdomain: 'Agile & Scrum Framework',
    topics: [
      'Empiricism',
      'Transparency',
      'Inspection',
      'Adaptation',
      'Scrum Accountabilities',
      'Scrum Events',
      'Scrum Artifacts',
      'Definition of Done',
      'Product Goal',
      'Sprint Goal'
    ],
    skills: [
      'Scrum Framework',
      'Product Ownership',
      'Agile Delivery',
      'Empirical Process Control',
      'Sprint Cadence & Ceremonies'
    ],
    roles: [
      'Product Manager',
      'Product Owner',
      'Scrum Master',
      'Agile Coach',
      'Software Engineer'
    ],
    accessMode: 'public_full',
    license: 'Creative Commons Attribution Share-Alike 4.0 International',
    redistributionAllowed: true,
    summary: 'The authoritative reference manual for Scrum, codifying the definition of Scrum, empirical pillars (transparency, inspection, adaptation), values (commitment, focus, openness, respect, courage), three accountabilities, five events, and three artifacts with their commitments.',
    provenance: 'Acquired directly from official ScrumGuides.org CC-BY-SA public release. Verbatim official definitions preserved alongside Career OS professional interpretation.',
    tableOfContents: [
      { chapterNumber: 1, title: 'Purpose of the Scrum Guide', concepts: ['Scrum Definition', 'Adaptive Problem Solving'] },
      { chapterNumber: 2, title: 'Scrum Theory & Values', concepts: ['Empiricism', 'Transparency', 'Inspection', 'Adaptation', 'Scrum Values'] },
      { chapterNumber: 3, title: 'The Scrum Team', concepts: ['Developers', 'Product Owner', 'Scrum Master', 'Cross-Functional Team'] },
      { chapterNumber: 4, title: 'Scrum Events', concepts: ['Sprint', 'Sprint Planning', 'Daily Scrum', 'Sprint Review', 'Sprint Retrospective'] },
      { chapterNumber: 5, title: 'Scrum Artifacts & Commitments', concepts: ['Product Backlog', 'Product Goal', 'Sprint Backlog', 'Sprint Goal', 'Increment', 'Definition of Done'] }
    ],
    publicResources: [
      { title: 'The 2020 Scrum Guide Official Text (English)', url: 'https://scrumguides.org/scrum-guide.html', type: 'guide', authority: 5 },
      { title: 'Scrum.org Official Learning Pathways', url: 'https://www.scrum.org/pathway/product-owner-learning-path', type: 'documentation', authority: 5 },
      { title: 'Scruminc Jeff Sutherland Keynote: Empirical Foundations', url: 'https://www.scruminc.com/scrum-lab/', type: 'talk', authority: 5 }
    ],
    extractedKnowledgeUnitIds: [
      'ku-scrum-empiricism',
      'ku-scrum-accountabilities',
      'ku-product-goal',
      'ku-sprint-goal',
      'ku-definition-of-done'
    ]
  },
  {
    id: 'book-pspo',
    title: 'The Professional Scrum Product Owner',
    subtitle: 'Guiding Products to Success with Agile Product Management',
    authors: ['Don McGreal', 'Ralph Jocham'],
    publisher: 'Addison-Wesley Professional / Scrum.org Professional Series',
    publicationYear: 2018,
    isbn: '978-0134686479',
    edition: '1st Edition',
    officialUrl: 'https://www.scrum.org/resources/professional-scrum-product-owner-book',
    publisherUrl: 'https://www.informit.com/store/professional-scrum-product-owner-guiding-products-9780134686479',
    domain: 'Product Management',
    subdomain: 'Product Ownership & Value Optimization',
    topics: [
      'Product Value',
      'Evidence-Based Management (EBM)',
      'Product Backlog Ordering',
      'Stakeholder Management',
      'Product Vision',
      'Release Planning',
      'Empirical Measurement'
    ],
    skills: [
      'Product Ownership',
      'Value Optimization',
      'Backlog Refinement',
      'Stakeholder Alignment',
      'Prioritization Metrics',
      'Evidence-Based Management'
    ],
    roles: [
      'Product Manager',
      'Product Owner',
      'Strategy & Operations Lead'
    ],
    accessMode: 'concept_only',
    redistributionAllowed: false,
    summary: 'Focuses on the Product Owner as an entrepreneurial value maximizer rather than a mere backlog typist. Details how to define product vision, measure current value vs. unrealized value with EBM, and establish hypothesis-driven delivery.',
    provenance: 'Concept-level ontology reconstructed from author-published articles on Scrum.org, public webinars, conference talks, and official publisher overview. No copyrighted book text reproduced.',
    tableOfContents: [
      { chapterNumber: 1, title: 'A Scrum Overview for Product Owners', concepts: ['Value Focus in Scrum', 'Accountability Boundaries'] },
      { chapterNumber: 2, title: 'Product Vision & Strategy', concepts: ['Product Vision Canvas', 'Target Group Alignment'] },
      { chapterNumber: 3, title: 'Value: The Definitive Metric', concepts: ['Current Value', 'Unrealized Value', 'Ability to Innovate', 'Time-to-Market'] },
      { chapterNumber: 4, title: 'Evidence-Based Management (EBM)', concepts: ['Key Value Areas', 'Empirical Measurement'] },
      { chapterNumber: 5, title: 'Ordering the Product Backlog', concepts: ['Value vs. Effort', 'Risk Mitigation Ordering', 'Dependency Management'] },
      { chapterNumber: 6, title: 'Release Planning & Forecasting', concepts: ['Empirical Forecasting', 'Cone of Uncertainty', 'Burn-down/Burn-up'] }
    ],
    publicResources: [
      { title: 'Scrum.org Evidence-Based Management (EBM) Guide', url: 'https://www.scrum.org/resources/evidence-based-management-guide', type: 'guide', authority: 5 },
      { title: 'Don McGreal: The Product Owner as Value Maximizer (Public Lecture)', url: 'https://www.scrum.org/resources/webinar-product-owner-value-maximizer', type: 'talk', authority: 5 },
      { title: 'Ralph Jocham: Agile Product Strategy & Roadmapping Articles', url: 'https://effectiveagile.com/publications/', type: 'article', authority: 4 }
    ],
    extractedKnowledgeUnitIds: [
      'ku-value-optimization',
      'ku-evidence-based-management',
      'ku-backlog-ordering-heuristics'
    ]
  },
  {
    id: 'book-inspired',
    title: 'Inspired',
    subtitle: 'How to Create Tech Products Customers Love',
    authors: ['Marty Cagan'],
    publisher: 'Silicon Valley Product Group (SVPG) / John Wiley & Sons',
    publicationYear: 2017,
    isbn: '978-1119387503',
    edition: '2nd Edition',
    officialUrl: 'https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love-2nd-edition/',
    publisherUrl: 'https://www.wiley.com/en-us/Inspired%3A+How+to+Create+Tech+Products+Customers+Love%2C+2nd+Edition-p-9781119387503',
    authorUrl: 'https://www.svpg.com/marty-cagan/',
    domain: 'Product Management',
    subdomain: 'Modern Product Discovery & Leadership',
    topics: [
      'Empowered Product Teams',
      'Continuous Product Discovery',
      'Product Risks (Value, Usability, Feasibility, Viability)',
      'Product Vision & Strategy',
      'Opportunity Solution Trees',
      'Outcome-driven Roadmaps'
    ],
    skills: [
      'Product Discovery',
      'Product Strategy',
      'Risk Assessment',
      'User Research & Prototyping',
      'Cross-Functional Leadership'
    ],
    roles: [
      'Product Manager',
      'Group Product Manager',
      'VP of Product',
      'UX Designer',
      'Engineering Manager'
    ],
    accessMode: 'concept_only',
    redistributionAllowed: false,
    summary: 'The seminal guide to modern technology product management. Establishes the contrast between feature teams (mercenaries) and empowered product teams (missionaries) tasked with solving problems and delivering customer value and business outcomes.',
    provenance: 'Concept extraction synthesizes public SVPG articles, Marty Cagan keynote talks, podcasts (Lenny’s Podcast), and official SVPG essays. No full book text stored.',
    tableOfContents: [
      { chapterNumber: 1, title: 'Lessons from Top Tech Companies', concepts: ['Root Causes of Failed Product Efforts', 'Beyond Lean & Agile'] },
      { chapterNumber: 2, title: 'People & Organization', concepts: ['Empowered Product Team', 'Product Manager Role', 'Product Designer', 'Tech Lead'] },
      { chapterNumber: 3, title: 'Product Vision & Principles', concepts: ['Product Vision', 'Product Strategy', 'Product Principles'] },
      { chapterNumber: 4, title: 'Product Discovery Overview', concepts: ['The Four Product Risks', 'Continuous Discovery Habits'] },
      { chapterNumber: 5, title: 'Discovery Techniques', concepts: ['Customer Interviews', 'Prototyping Tests', 'Quantitative Analytics'] }
    ],
    publicResources: [
      { title: 'SVPG Official Essay: Product vs Feature Teams', url: 'https://www.svpg.com/product-vs-feature-teams/', type: 'essay', authority: 5 },
      { title: 'SVPG Official Essay: The Four Product Risks', url: 'https://www.svpg.com/the-four-product-risks/', type: 'essay', authority: 5 },
      { title: 'Marty Cagan Keynote: Building Empowered Teams', url: 'https://www.mindtheproduct.com/marty-cagan-building-empowered-product-teams/', type: 'talk', authority: 5 },
      { title: 'Lennys Podcast: Marty Cagan on Real Product Management', url: 'https://www.lennyspodcast.com/marty-cagan/', type: 'interview', authority: 4 }
    ],
    extractedKnowledgeUnitIds: [
      'ku-empowered-teams',
      'ku-four-product-risks',
      'ku-continuous-discovery',
      'ku-product-outcomes-vs-outputs'
    ]
  },
  {
    id: 'book-transformed',
    title: 'Transformed',
    subtitle: 'Moving to the Product Operating Model',
    authors: ['Marty Cagan', 'Jon Moore', 'Christian Idiodi', 'Lea Hickman'],
    publisher: 'Silicon Valley Product Group (SVPG) / Wiley',
    publicationYear: 2024,
    isbn: '978-1119697336',
    edition: '1st Edition',
    officialUrl: 'https://www.svpg.com/books/transformed-moving-to-the-product-operating-model/',
    authorUrl: 'https://www.svpg.com',
    domain: 'Product Management',
    subdomain: 'Organizational Transformation & Product Operating Model',
    topics: [
      'Product Operating Model',
      'Transformation Competencies',
      'Product Leadership Coaching',
      'Team Topology & Empowerment',
      'Governance & Capital Allocation'
    ],
    skills: [
      'Product Leadership',
      'Organizational Design',
      'Change Management',
      'Executive Stakeholder Alignment',
      'Strategic Governance'
    ],
    roles: [
      'Chief Product Officer',
      'VP of Product',
      'Head of Engineering',
      'Agile Transformation Director'
    ],
    accessMode: 'concept_only',
    redistributionAllowed: false,
    summary: 'Codifies how non-digital-native legacy organizations successfully transition from project-driven IT feature factories into modern product operating models where teams are empowered and leaders coach.',
    provenance: 'Constructed from public SVPG Transformation workshops, public case studies (CarMax, Trainline, Discovery Inc.), and public essays. Concept-only extraction.',
    tableOfContents: [
      { chapterNumber: 1, title: 'The Product Operating Model', concepts: ['Operating Model Fundamentals', 'Product Model vs Project Model'] },
      { chapterNumber: 2, title: 'Product Leadership', concepts: ['Staffing & Coaching', 'Product Vision & Architecture', 'Strategic Context'] },
      { chapterNumber: 3, title: 'The Transformation Process', concepts: ['Pilot Teams', 'Readiness Assessment', 'Iterative Rollout'] },
      { chapterNumber: 4, title: 'Common Transformation Impediments', concepts: ['IT Legacy Mindset', 'Feature Roadmap Addiction', 'Executive Skepticism'] }
    ],
    publicResources: [
      { title: 'SVPG: Moving to the Product Operating Model Overview', url: 'https://www.svpg.com/the-product-operating-model/', type: 'essay', authority: 5 },
      { title: 'SVPG Video: Transformed Launch Masterclass', url: 'https://www.youtube.com/watch?v=svpg-transformed-overview', type: 'talk', authority: 5 }
    ],
    extractedKnowledgeUnitIds: [
      'ku-product-operating-model',
      'ku-product-leadership-coaching'
    ]
  },
  {
    id: 'book-user-stories-applied',
    title: 'User Stories Applied',
    subtitle: 'For Agile Software Development',
    authors: ['Mike Cohn'],
    publisher: 'Addison-Wesley Professional',
    publicationYear: 2004,
    isbn: '978-0321205681',
    edition: '1st Edition',
    officialUrl: 'https://www.mountaingoatsoftware.com/books/user-stories-applied',
    publisherUrl: 'https://www.informit.com/store/user-stories-applied-for-agile-software-development-9780321205681',
    authorUrl: 'https://www.mountaingoatsoftware.com',
    domain: 'Product Management',
    subdomain: 'Agile Requirements & User Stories',
    topics: [
      'User Story Structure',
      'INVEST Criteria',
      'Acceptance Criteria',
      'Story Splitting',
      'User Role Modeling',
      'Story Smells'
    ],
    skills: [
      'User Story Writing',
      'Requirements Elicitation',
      'Acceptance Test Definition',
      'Backlog Decomposition',
      'Estimation Techniques'
    ],
    roles: [
      'Product Manager',
      'Product Owner',
      'Business Analyst',
      'Software Engineer'
    ],
    accessMode: 'concept_only',
    redistributionAllowed: false,
    summary: 'The foundational guide for capturing customer requirements as short user stories rather than monolithic specification documents. Introduces the Card, Conversation, Confirmation formula, the Connextra template, and the INVEST criteria.',
    provenance: 'Synthesized from Mountain Goat Software public articles, Mike Cohn conference presentations, and public Agile community frameworks. No copyrighted book text reproduced.',
    tableOfContents: [
      { chapterNumber: 1, title: 'An Overview of User Stories', concepts: ['Card Conversation Confirmation', 'Why User Stories?'] },
      { chapterNumber: 2, title: 'Writing Stories & INVEST', concepts: ['Independent', 'Negotiable', 'Valuable', 'Estimable', 'Small', 'Testable'] },
      { chapterNumber: 3, title: 'User Role Modeling', concepts: ['User Personas', 'Extreme Characters'] },
      { chapterNumber: 4, title: 'Gathering Stories', concepts: ['Story-Writing Workshops', 'Customer Interviews'] },
      { chapterNumber: 5, title: 'Splitting Stories', concepts: ['Workflow Splitting', 'Data Boundary Splitting', 'Spikes'] },
      { chapterNumber: 6, title: 'Acceptance Tests', concepts: ['Given-When-Then', 'Boundary Testing'] }
    ],
    publicResources: [
      { title: 'Mountain Goat Software: User Story Foundations Guide', url: 'https://www.mountaingoatsoftware.com/agile/user-stories', type: 'guide', authority: 5 },
      { title: 'Mike Cohn: Ten Tips for Writing Better User Stories (Public Article)', url: 'https://www.mountaingoatsoftware.com/blog/ten-tips-for-writing-better-user-stories', type: 'article', authority: 5 },
      { title: 'Mountain Goat Software: How to Split a User Story Flowchart', url: 'https://www.mountaingoatsoftware.com/blog/how-to-split-a-user-story', type: 'documentation', authority: 5 }
    ],
    extractedKnowledgeUnitIds: [
      'ku-invest-criteria',
      'ku-story-splitting-patterns',
      'ku-acceptance-criteria-confirmation'
    ]
  },
  {
    id: 'book-hooked',
    title: 'Hooked',
    subtitle: 'How to Build Habit-Forming Products',
    authors: ['Nir Eyal', 'Ryan Hoover'],
    publisher: 'Portfolio / Penguin Random House',
    publicationYear: 2014,
    isbn: '978-1591847786',
    edition: '1st Edition',
    officialUrl: 'https://www.nirandfar.com/hooked/',
    publisherUrl: 'https://www.penguinrandomhouse.com/books/316492/hooked-by-nir-eyal-with-ryan-hoover/',
    authorUrl: 'https://www.nirandfar.com',
    domain: 'Product Management',
    subdomain: 'Behavioral Design & Growth',
    topics: [
      'Hook Model',
      'Internal & External Triggers',
      'Action (Fogg Behavior Model)',
      'Variable Rewards',
      'Investment Phase',
      'Ethical Manipulation Matrix'
    ],
    skills: [
      'Behavioral Product Design',
      'Retention Modeling',
      'User Engagement',
      'Growth Loops',
      'Ethical Product Evaluation'
    ],
    roles: [
      'Product Manager',
      'Growth Product Manager',
      'UX Designer',
      'Behavioral Researcher'
    ],
    accessMode: 'concept_only',
    redistributionAllowed: false,
    summary: 'Details the four-step Hook Model (Trigger, Action, Variable Reward, Investment) that underpins successful habit-forming consumer products, coupled with an ethical framework (The Manipulation Matrix) for responsible design.',
    provenance: 'Concept extraction from Nir Eyal’s official NirAndFar.com essays, public keynote talks, Stanford lecture materials, and academic behavioral psychology references. Zero copyrighted book text reproduced.',
    tableOfContents: [
      { chapterNumber: 1, title: 'The Habit Zone', concepts: ['Habit Loop', 'Customer Lifetime Value', 'Price Flexibility'] },
      { chapterNumber: 2, title: 'Trigger: The First Step', concepts: ['External Triggers', 'Internal Triggers (Pain Points)'] },
      { chapterNumber: 3, title: 'Action: Behavior Driven by Simplicity', concepts: ['Fogg Behavior Model (B=MAP)', 'Heuristics & Biases'] },
      { chapterNumber: 4, title: 'Variable Reward: Searching for Satisfaction', concepts: ['Rewards of the Tribe', 'Rewards of the Hunt', 'Rewards of the Self'] },
      { chapterNumber: 5, title: 'Investment: Building Capital in the Product', concepts: ['Stored Value', 'Loading the Next Trigger'] },
      { chapterNumber: 6, title: 'The Manipulation Matrix', concepts: ['Facilitator', 'Peddler', 'Entertainer', 'Dealer'] }
    ],
    publicResources: [
      { title: 'NirAndFar.com: The Hook Model Official Visual Framework', url: 'https://www.nirandfar.com/how-to-manufacture-desire/', type: 'framework', authority: 5 },
      { title: 'Stanford d.school Public Lecture: Habit-Forming Products by Nir Eyal', url: 'https://www.youtube.com/watch?v=nir-eyal-stanford-habits', type: 'talk', authority: 4 },
      { title: 'Nir Eyal Essay: An Introduction to Behavioral Design', url: 'https://www.nirandfar.com/behavioral-design/', type: 'essay', authority: 5 }
    ],
    extractedKnowledgeUnitIds: [
      'ku-hook-model',
      'ku-variable-rewards-types',
      'ku-behavioral-investment-phase'
    ]
  },
  {
    id: 'book-ddia',
    title: 'Designing Data-Intensive Applications',
    subtitle: 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems',
    authors: ['Martin Kleppmann'],
    publisher: 'O’Reilly Media',
    publicationYear: 2017,
    isbn: '978-1449373320',
    edition: '1st Edition',
    officialUrl: 'https://dataintensive.net',
    publisherUrl: 'https://www.oreilly.com/library/view/designing-data-intensive-applications/9781449373320/',
    authorUrl: 'https://martin.kleppmann.com',
    domain: 'Software Engineering & System Architecture',
    subdomain: 'Distributed Systems & Data Engineering',
    topics: [
      'Reliability, Scalability, Maintainability',
      'Data Models (Relational, Document, Graph)',
      'Storage Engines (LSM-Trees vs B-Trees)',
      'Encoding Formats (Avro, Protobuf, Thrift)',
      'Replication (Single-Leader, Multi-Leader, Leaderless)',
      'Partitioning & Secondary Indexes',
      'Transactions (ACID, Isolation Levels, 2PC)',
      'Distributed Consensus & Raft/Paxos',
      'Batch Processing & Stream Processing'
    ],
    skills: [
      'System Design',
      'Distributed Systems Architecture',
      'Database Selection & Tuning',
      'Data Modeling',
      'Fault Tolerance & Consistency',
      'High-Throughput Stream Processing'
    ],
    roles: [
      'Software Engineer',
      'Backend Engineer',
      'Data Engineer',
      'Solution Architect',
      'Principal Systems Architect',
      'Engineering Manager'
    ],
    accessMode: 'concept_only',
    redistributionAllowed: false,
    summary: 'The definitive architectural guide to building reliable, scalable, and maintainable systems. Dissects trade-offs in storage engines, distributed consensus, data replication protocols, and stream processing pipelines.',
    provenance: 'Reconstructed at the conceptual level from Martin Kleppmann’s University of Cambridge lecture series on Distributed Systems (freely published on YouTube and university pages), author research papers, and public conference presentations. No copyrighted O’Reilly text reproduced.',
    tableOfContents: [
      { chapterNumber: 1, title: 'Reliable, Scalable, and Maintainable Applications', concepts: ['SLOs & SLIs', 'Faults vs Failures', 'Latency percentiles'] },
      { chapterNumber: 2, title: 'Data Models and Query Languages', concepts: ['Relational Model', 'Document Model', 'Graph-Like Data Models'] },
      { chapterNumber: 3, title: 'Storage and Retrieval', concepts: ['Log-Structured Merge-Trees (LSM)', 'B-Trees', 'OLAP vs OLTP Columnar Storage'] },
      { chapterNumber: 4, title: 'Encoding and Evolution', concepts: ['Binary Encodings', 'Schema Evolution (Avro, Protobuf)'] },
      { chapterNumber: 5, title: 'Replication', concepts: ['Single-Leader', 'Multi-Leader', 'Leaderless (Dynamo-Style Quorums)'] },
      { chapterNumber: 6, title: 'Partitioning', concepts: ['Range Partitioning', 'Hash Partitioning', 'Secondary Index Partitioning'] },
      { chapterNumber: 7, title: 'Transactions', concepts: ['ACID Semantics', 'Read Committed', 'Snapshot Isolation', 'Two-Phase Locking (2PL)'] },
      { chapterNumber: 8, title: 'The Trouble with Distributed Systems', concepts: ['Unreliable Networks', 'Clock Drift & Monotonic Clocks', 'Byzantine Faults'] },
      { chapterNumber: 9, title: 'Consistency and Consensus', concepts: ['Linearizability', 'Total Order Broadcast', 'Two-Phase Commit (2PC)', 'Raft & Paxos Consensus'] },
      { chapterNumber: 10, title: 'Batch Processing', concepts: ['MapReduce Philosophy', 'Dataflow Engines (Spark, Flink)'] },
      { chapterNumber: 11, title: 'Stream Processing', concepts: ['Event Sourcing', 'Change Data Capture (CDC)', 'Stream-Table Duality'] }
    ],
    publicResources: [
      { title: 'Martin Kleppmann: Cambridge Distributed Systems Course Lectures', url: 'https://www.cl.cam.ac.uk/teaching/2021/ConcDisSys/dist-sys-notes.pdf', type: 'lecture', authority: 5 },
      { title: 'Martin Kleppmann YouTube Lecture Series (8 Hours, University of Cambridge)', url: 'https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_mTpHdbrr5gv-v', type: 'lecture', authority: 5 },
      { title: 'Martin Kleppmann Personal Research & Papers Archive', url: 'https://martin.kleppmann.com/papers.html', type: 'paper', authority: 5 }
    ],
    extractedKnowledgeUnitIds: [
      'ku-lsm-vs-btree',
      'ku-leaderless-replication-quorums',
      'ku-distributed-transactions-2pc',
      'ku-linearizability-vs-serializability',
      'ku-stream-table-duality'
    ]
  }
];
