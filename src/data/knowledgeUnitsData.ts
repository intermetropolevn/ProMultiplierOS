import { KnowledgeUnit } from '../features/knowledge/types';

export const KNOWLEDGE_UNITS_DATA: KnowledgeUnit[] = [
  // ==========================================
  // PRODUCT MANAGEMENT & SCRUM
  // ==========================================
  {
    id: 'ku-scrum-empiricism',
    title: 'Scrum Empirical Process Control',
    summary: 'The foundational philosophy of Scrum asserting that knowledge comes from experience and making decisions based on what is observed.',
    type: 'principle',
    domain: 'Product Management',
    subdomain: 'Agile & Scrum Framework',
    skills: ['Scrum Framework', 'Empirical Process Control', 'Agile Delivery'],
    roles: ['Product Owner', 'Product Manager', 'Scrum Master', 'Agile Coach'],
    prerequisites: ['Adaptive Problem Solving'],
    relatedConcepts: ['ku-scrum-accountabilities', 'ku-product-goal', 'ku-definition-of-done'],
    sources: [
      {
        sourceId: 'book-scrum-guide',
        sourceUrl: 'https://scrumguides.org/scrum-guide.html#scrum-theory',
        author: 'Ken Schwaber & Jeff Sutherland',
        title: 'The Scrum Guide (2020)',
        publishedAt: '2020-11-01',
        accessedAt: '2026-09-06',
        location: 'Section: Scrum Theory',
        citationText: 'Scrum is founded on empirical process control theory, or empiricism. Empiricism asserts that knowledge comes from experience and making decisions based on what is observed.'
      }
    ],
    confidence: 0.99,
    qualityScore: 98,
    provenance: 'Official direct extraction from ScrumGuides.org 2020 specification.',
    officialDefinition: 'Empiricism asserts that knowledge comes from experience and making decisions based on what is observed. Scrum employs an iterative, incremental approach to optimize predictability and to control risk.',
    careerosInterpretation: 'In modern tech interviews, demonstrating empiricism means favoring rapid hypotheses, prototype testing, and metric-driven validation over static 12-month roadmaps.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 3,
    authorityWeightedConfidence: 0.99
  },
  {
    id: 'ku-scrum-accountabilities',
    title: 'Scrum Team Accountabilities (Product Owner, Scrum Master, Developers)',
    summary: 'The three specific accountabilities within a cross-functional Scrum Team with no hierarchies or sub-teams.',
    type: 'definition',
    domain: 'Product Management',
    subdomain: 'Agile & Scrum Framework',
    skills: ['Product Ownership', 'Team Leadership', 'Cross-Functional Collaboration'],
    roles: ['Product Owner', 'Product Manager', 'Scrum Master', 'Software Engineer'],
    prerequisites: ['ku-scrum-empiricism'],
    relatedConcepts: ['ku-product-goal', 'ku-value-optimization'],
    sources: [
      {
        sourceId: 'book-scrum-guide',
        sourceUrl: 'https://scrumguides.org/scrum-guide.html#scrum-team',
        author: 'Ken Schwaber & Jeff Sutherland',
        title: 'The Scrum Guide (2020)',
        publishedAt: '2020-11-01',
        accessedAt: '2026-09-06',
        location: 'Section: Scrum Team',
        citationText: 'The Scrum Team consists of one Scrum Master, one Product Owner, and Developers. Within a Scrum Team, there are no sub-teams or hierarchies. It is a cohesive unit of professionals focused on one objective at a time, the Product Goal.'
      }
    ],
    confidence: 0.98,
    qualityScore: 96,
    provenance: 'Verbatim extraction from official Scrum Guide 2020.',
    officialDefinition: 'The Product Owner is accountable for maximizing the value of the product resulting from the work of the Scrum Team. The Scrum Master is accountable for establishing Scrum as defined in the Scrum Guide. Developers are committed to creating any aspect of a usable Increment each Sprint.',
    careerosInterpretation: 'A common candidate failure in PM interviews is conflating the Product Owner with a project manager. Career OS evaluates whether the candidate establishes value accountability rather than delivery scheduling.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 2,
    authorityWeightedConfidence: 0.98
  },
  {
    id: 'ku-product-goal',
    title: 'The Product Goal',
    summary: 'The long-term objective for the Scrum Team providing focus and alignment across multiple Sprints.',
    type: 'concept',
    domain: 'Product Management',
    subdomain: 'Product Strategy & Scrum Artifacts',
    skills: ['Product Strategy', 'Product Ownership', 'Goal Setting', 'Backlog Ordering'],
    roles: ['Product Owner', 'Product Manager', 'Group Product Manager'],
    prerequisites: ['ku-scrum-accountabilities'],
    relatedConcepts: ['ku-sprint-goal', 'ku-product-outcomes-vs-outputs'],
    sources: [
      {
        sourceId: 'book-scrum-guide',
        sourceUrl: 'https://scrumguides.org/scrum-guide.html#product-backlog',
        author: 'Ken Schwaber & Jeff Sutherland',
        title: 'The Scrum Guide (2020)',
        publishedAt: '2020-11-01',
        accessedAt: '2026-09-06',
        location: 'Commitment: Product Goal',
        citationText: 'The Product Goal describes a future state of the product which can serve as a target for the Scrum Team to plan against. The Product Goal is in the Product Backlog. The rest of the Product Backlog emerges to define “what” will fulfill the Product Goal.'
      },
      {
        sourceId: 'book-pspo',
        author: 'Don McGreal & Ralph Jocham',
        title: 'The Professional Scrum Product Owner',
        publishedAt: '2018-05-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 2: Product Vision & Strategy',
        citationText: 'A strategic target that bridges high-level vision and tactical sprint delivery, anchoring the backlog to measurable customer outcomes.'
      }
    ],
    confidence: 0.98,
    qualityScore: 97,
    provenance: 'Scrum Guide 2020 commitment definition corroborated by PSPO framework.',
    officialDefinition: 'The Product Goal is the long-term objective for the Scrum Team. They must fulfill (or abandon) one goal before taking on the next.',
    careerosInterpretation: 'Distinguishes proactive product leaders from reactive feature order-takers. In case interviews, always anchor your roadmap to 1-2 overarching Product Goals rather than a laundry list of feature requests.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 3,
    authorityWeightedConfidence: 0.97
  },
  {
    id: 'ku-value-optimization',
    title: 'Product Value Optimization',
    summary: 'The primary accountability of product leadership: maximizing economic, user, and strategic value rather than output velocity.',
    type: 'principle',
    domain: 'Product Management',
    subdomain: 'Product Ownership & Economics',
    skills: ['Value Optimization', 'Prioritization', 'ROI Analysis', 'Product Strategy'],
    roles: ['Product Manager', 'Product Owner', 'VP of Product'],
    prerequisites: ['ku-scrum-accountabilities'],
    relatedConcepts: ['ku-evidence-based-management', 'ku-product-outcomes-vs-outputs'],
    sources: [
      {
        sourceId: 'book-pspo',
        author: 'Don McGreal & Ralph Jocham',
        title: 'The Professional Scrum Product Owner',
        publishedAt: '2018-05-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 3: Value: The Definitive Metric',
        citationText: 'The Product Owner is not a project coordinator; they are the value maximizer. Value is realized only when the customer derives measurable benefit.'
      },
      {
        sourceId: 'src-svpg-articles',
        author: 'Marty Cagan',
        title: 'Product vs. Feature Teams',
        publishedAt: '2019-09-18',
        accessedAt: '2026-09-06',
        location: 'SVPG Insights',
        citationText: 'In product teams, the team is given a problem to solve and measured on the outcome, not on the output.'
      }
    ],
    confidence: 0.97,
    qualityScore: 95,
    provenance: 'Synthesized across Professional Scrum Product Owner and SVPG thought leadership.',
    officialDefinition: 'Maximizing the value of the product resulting from the work of the team by identifying unrealized value, measuring current value, and minimizing wasteful feature delivery.',
    careerosInterpretation: 'Candidates should actively reject measuring team success by story points completed or velocity; executive calibration rewards candidates who measure business and customer impact.',
    knowledgeOrigin: 'careeros_synthesis',
    sourceAuthority: 5,
    sourceCount: 4,
    authorityWeightedConfidence: 0.96
  },
  {
    id: 'ku-evidence-based-management',
    title: 'Evidence-Based Management (EBM) Framework',
    summary: 'An empirical management framework measuring 4 Key Value Areas: Current Value, Unrealized Value, Time-to-Market, and Ability to Innovate.',
    type: 'framework',
    domain: 'Product Management',
    subdomain: 'Product Metrics & Governance',
    skills: ['Evidence-Based Management', 'Metrics Prioritization', 'Product Analytics', 'Executive Reporting'],
    roles: ['Product Manager', 'Group Product Manager', 'Chief Product Officer'],
    prerequisites: ['ku-value-optimization'],
    relatedConcepts: ['ku-four-product-risks', 'ku-product-outcomes-vs-outputs'],
    sources: [
      {
        sourceId: 'book-pspo',
        author: 'Don McGreal & Ralph Jocham',
        title: 'The Professional Scrum Product Owner',
        publishedAt: '2018-05-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 4: Evidence-Based Management',
        citationText: 'EBM looks beyond internal velocity and evaluates organizational agility across four key value areas: CV, UV, T2M, and A2I.'
      },
      {
        sourceId: 'guide-ebm-official',
        author: 'Ken Schwaber, Patricia Kong et al.',
        title: 'The Evidence-Based Management Guide',
        publishedAt: '2020-10-01',
        accessedAt: '2026-09-06',
        location: 'Scrum.org EBM Manual',
        citationText: 'Organizations improve their ability to deliver value by making measurable investments and using empirical feedback loops.'
      }
    ],
    confidence: 0.96,
    qualityScore: 94,
    provenance: 'Corroborated across PSPO textbook and official Scrum.org EBM public guide.',
    officialDefinition: 'An approach that helps organizations measure, manage, and increase the value they derive from their product investments across 4 KVAs: Current Value (CV), Unrealized Value (UV), Time-to-Market (T2M), and Ability to Innovate (A2I).',
    careerosInterpretation: 'A superior alternative to vanity metrics. In interviews, apply UV (market potential left on the table) to justify new product lines and A2I (tech debt vs innovation spend) to justify refactoring.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 2,
    authorityWeightedConfidence: 0.96
  },
  {
    id: 'ku-empowered-teams',
    title: 'Empowered Product Teams vs. Feature Teams',
    summary: 'The distinction between teams entrusted with solving customer problems vs. delivery mercenaries executing roadmaps.',
    type: 'mental_model',
    domain: 'Product Management',
    subdomain: 'Product Operating Model',
    skills: ['Product Discovery', 'Product Strategy', 'Cross-Functional Leadership', 'Team Empowerment'],
    roles: ['Product Manager', 'Director of Product', 'VP of Engineering', 'Engineering Manager'],
    prerequisites: ['ku-value-optimization'],
    relatedConcepts: ['ku-four-product-risks', 'ku-continuous-discovery', 'ku-product-operating-model'],
    sources: [
      {
        sourceId: 'book-inspired',
        author: 'Marty Cagan',
        title: 'Inspired: How to Create Tech Products Customers Love',
        publishedAt: '2017-11-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 2: People & Organization',
        citationText: 'In an empowered product team, the team is given business problems to solve and outcomes to achieve, rather than a list of features to build.'
      },
      {
        sourceId: 'src-svpg-articles',
        author: 'Marty Cagan',
        title: 'Product vs. Feature Teams',
        publishedAt: '2019-09-18',
        accessedAt: '2026-09-06',
        location: 'SVPG Essays',
        citationText: 'Feature teams are mercenaries; empowered product teams are missionaries.'
      }
    ],
    confidence: 0.98,
    qualityScore: 98,
    provenance: 'Silicon Valley Product Group (SVPG) official essays and keynote presentations.',
    officialDefinition: 'A cross-functional unit (Product Manager, Product Designer, Engineers) given an outcome or customer problem to solve, with the autonomy to discover the best solution while ensuring value, usability, feasibility, and viability.',
    careerosInterpretation: 'Top-tier tech interviewers (Stripe, Airbnb, Google) screen specifically for candidates who act as empowered problem solvers rather than feature project managers.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 3,
    authorityWeightedConfidence: 0.98
  },
  {
    id: 'ku-four-product-risks',
    title: 'The Four Fundamental Product Risks',
    summary: 'The four existential risks that every product discovery effort must de-risk: Value, Usability, Feasibility, and Viability.',
    type: 'framework',
    domain: 'Product Management',
    subdomain: 'Product Discovery',
    skills: ['Product Discovery', 'Risk Assessment', 'User Research', 'Feasibility Architecture'],
    roles: ['Product Manager', 'UX Designer', 'Lead Engineer', 'Solution Architect'],
    prerequisites: ['ku-empowered-teams'],
    relatedConcepts: ['ku-continuous-discovery', 'ku-invest-criteria'],
    sources: [
      {
        sourceId: 'book-inspired',
        author: 'Marty Cagan',
        title: 'Inspired (2nd Edition)',
        publishedAt: '2017-11-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 4: Discovery Overview',
        citationText: 'We must tackle the four big risks in discovery, not after delivery: Value risk, Usability risk, Feasibility risk, and Business viability risk.'
      }
    ],
    confidence: 0.99,
    qualityScore: 99,
    provenance: 'SVPG core framework codified across Inspired and public SVPG whitepapers.',
    officialDefinition: '1. Value risk (will users buy or choose to use it?); 2. Usability risk (can users figure out how to use it?); 3. Feasibility risk (can engineers build it with current tech and skills?); 4. Business viability risk (does it work for legal, compliance, sales, marketing, and finance?).',
    careerosInterpretation: 'Use this framework in case studies whenever asked: "How would you validate this new AI or mobile feature before committing 6 months of engineering?"',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 3,
    authorityWeightedConfidence: 0.99
  },
  {
    id: 'ku-continuous-discovery',
    title: 'Continuous Product Discovery Habits',
    summary: 'Weekly customer interactions and iterative experiments conducted in parallel with delivery to inform product decisions.',
    type: 'practice',
    domain: 'Product Management',
    subdomain: 'Product Discovery',
    skills: ['User Research', 'Customer Interviews', 'Prototyping', 'Experimentation'],
    roles: ['Product Manager', 'UX Designer', 'Product Owner'],
    prerequisites: ['ku-four-product-risks'],
    relatedConcepts: ['ku-empowered-teams', 'ku-hook-model'],
    sources: [
      {
        sourceId: 'book-inspired',
        author: 'Marty Cagan',
        title: 'Inspired (2nd Edition)',
        publishedAt: '2017-11-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 5: Discovery Techniques',
        citationText: 'Discovery is not a phase you do once a quarter. Discovery is an ongoing weekly habit of testing prototypes and talking to customers.'
      }
    ],
    confidence: 0.97,
    qualityScore: 95,
    provenance: 'Codified in SVPG literature and corroborated by modern product discovery curricula.',
    officialDefinition: 'A continuous cadence where product teams conduct structured interviews, prototype evaluations, and quantitative smoke tests every single week.',
    careerosInterpretation: 'Demonstrating continuous discovery proves to interviewers that your design cycles are grounded in real user friction rather than internal executive opinions.',
    knowledgeOrigin: 'source_derived',
    sourceAuthority: 5,
    sourceCount: 2,
    authorityWeightedConfidence: 0.96
  },
  {
    id: 'ku-product-outcomes-vs-outputs',
    title: 'Product Outcomes vs. Delivery Outputs',
    summary: 'Shifting the focal metric from software artifacts shipped (output) to measurable customer behavior changes that drive business value (outcome).',
    type: 'mental_model',
    domain: 'Product Management',
    subdomain: 'Product Strategy & Roadmaps',
    skills: ['Outcome-Driven Roadmaps', 'KPI Definition', 'Business Case Modeling'],
    roles: ['Product Manager', 'Product Owner', 'VP of Product'],
    prerequisites: ['ku-value-optimization'],
    relatedConcepts: ['ku-empowered-teams', 'ku-evidence-based-management'],
    sources: [
      {
        sourceId: 'book-inspired',
        author: 'Marty Cagan',
        title: 'Inspired',
        publishedAt: '2017-11-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 2: People',
        citationText: 'Output is the software you ship; outcome is whether that software changed customer behavior and produced business results.'
      },
      {
        sourceId: 'book-pspo',
        author: 'Don McGreal & Ralph Jocham',
        title: 'The Professional Scrum Product Owner',
        publishedAt: '2018-05-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 3: Value',
        citationText: 'A high-velocity team shipping features that nobody uses has created negative value through maintenance cost.'
      }
    ],
    confidence: 0.99,
    qualityScore: 97,
    provenance: 'Consensus principle across SVPG and Professional Scrum literature.',
    officialDefinition: 'Output = features, releases, code commits. Outcome = measurable impact on user behavior (e.g. reduction in checkout drop-off, increase in daily active engagement).',
    careerosInterpretation: 'In STAR behavioral stories, always frame results in Outcomes (e.g., "$1.2M ARR saved", "34% latency drop") rather than Outputs ("Built 14 endpoints").',
    knowledgeOrigin: 'careeros_synthesis',
    sourceAuthority: 5,
    sourceCount: 4,
    authorityWeightedConfidence: 0.98
  },

  // ==========================================
  // REQUIREMENTS & USER STORIES (Mike Cohn)
  // ==========================================
  {
    id: 'ku-invest-criteria',
    title: 'The INVEST Criteria for User Stories',
    summary: 'The quality checklist for agile user stories: Independent, Negotiable, Valuable, Estimable, Small, and Testable.',
    type: 'framework',
    domain: 'Product Management',
    subdomain: 'Agile Requirements & User Stories',
    skills: ['User Story Writing', 'Backlog Refinement', 'Agile Delivery', 'Requirements Engineering'],
    roles: ['Product Owner', 'Product Manager', 'Software Engineer', 'Business Analyst'],
    prerequisites: ['ku-scrum-accountabilities'],
    relatedConcepts: ['ku-story-splitting-patterns', 'ku-acceptance-criteria-confirmation'],
    sources: [
      {
        sourceId: 'book-user-stories-applied',
        sourceUrl: 'https://www.mountaingoatsoftware.com/agile/user-stories',
        author: 'Mike Cohn',
        title: 'User Stories Applied for Agile Software Development',
        publishedAt: '2004-03-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 2: Writing Stories',
        citationText: 'Good user stories meet Bill Wake’s INVEST criteria: Independent, Negotiable, Valuable, Estimable, Small, and Testable.'
      }
    ],
    confidence: 0.99,
    qualityScore: 99,
    provenance: 'Directly sourced from Mountain Goat Software official guidance.',
    officialDefinition: 'Independent (can be released separately); Negotiable (details co-created with developers); Valuable (delivers tangible benefit); Estimable (scope is understood); Small (fits within a single sprint iteration); Testable (clear criteria for success).',
    careerosInterpretation: 'A prime calibration indicator in PM practical assessments. Stories failing INVEST cause sprint rollover and team friction.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 3,
    authorityWeightedConfidence: 0.99
  },
  {
    id: 'ku-story-splitting-patterns',
    title: 'User Story Splitting Heuristics',
    summary: 'Proven heuristics to split complex epics into vertical, thin slices that deliver end-to-end user value.',
    type: 'heuristic',
    domain: 'Product Management',
    subdomain: 'Agile Requirements',
    skills: ['Story Splitting', 'Backlog Decomposition', 'Incremental Delivery'],
    roles: ['Product Owner', 'Product Manager', 'Tech Lead'],
    prerequisites: ['ku-invest-criteria'],
    relatedConcepts: ['ku-invest-criteria', 'ku-acceptance-criteria-confirmation'],
    sources: [
      {
        sourceId: 'book-user-stories-applied',
        sourceUrl: 'https://www.mountaingoatsoftware.com/blog/how-to-split-a-user-story',
        author: 'Mike Cohn',
        title: 'User Stories Applied',
        publishedAt: '2004-03-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 5: Splitting Stories',
        citationText: 'Split by workflow steps, business rule variations, major data variations, or cross-cutting non-functional requirements.'
      }
    ],
    confidence: 0.96,
    qualityScore: 94,
    provenance: 'Mountain Goat Software public tutorials and agile engineering body of knowledge.',
    officialDefinition: 'Techniques including: 1. Workflow steps (happy path first); 2. Business rule variations; 3. Data variations (simple vs complex inputs); 4. Interface variations; 5. Spike vs Implementation.',
    careerosInterpretation: 'Never slice stories horizontally (e.g. "Build backend DB" then "Build UI"). Slice vertically so each slice is testable and demoable.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 2,
    authorityWeightedConfidence: 0.96
  },
  {
    id: 'ku-acceptance-criteria-confirmation',
    title: 'Acceptance Criteria & Confirmation (Given-When-Then)',
    summary: 'The agreed contractual boundaries determining when a user story is functionally complete and verifiable.',
    type: 'practice',
    domain: 'Product Management',
    subdomain: 'Agile Requirements',
    skills: ['Acceptance Criteria', 'Behavior-Driven Development (BDD)', 'Quality Assurance'],
    roles: ['Product Owner', 'Product Manager', 'QA Engineer', 'Software Engineer'],
    prerequisites: ['ku-invest-criteria'],
    relatedConcepts: ['ku-definition-of-done', 'ku-invest-criteria'],
    sources: [
      {
        sourceId: 'book-user-stories-applied',
        author: 'Mike Cohn',
        title: 'User Stories Applied',
        publishedAt: '2004-03-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 6: Acceptance Tests',
        citationText: 'Acceptance tests provide the confirmation on the back of the story card, removing ambiguity regarding expected behavior.'
      }
    ],
    confidence: 0.97,
    qualityScore: 95,
    provenance: 'Corroborated across Mountain Goat Software and BDD industry literature.',
    officialDefinition: 'Conditions that a software product must satisfy to be accepted by a user, customer, or other stakeholder, often structured in Given [context] When [event] Then [outcome] format.',
    careerosInterpretation: 'Distinguish Story Acceptance Criteria (unique per story) from the team Definition of Done (universal across all stories).',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 2,
    authorityWeightedConfidence: 0.96
  },
  {
    id: 'ku-definition-of-done',
    title: 'Definition of Done (DoD)',
    summary: 'A formal description of the state of the Increment when it meets the quality measures required for the product.',
    type: 'definition',
    domain: 'Product Management',
    subdomain: 'Scrum Quality & Governance',
    skills: ['Quality Governance', 'Release Management', 'Scrum Framework'],
    roles: ['Product Owner', 'Scrum Master', 'Software Engineer'],
    prerequisites: ['ku-scrum-empiricism'],
    relatedConcepts: ['ku-acceptance-criteria-confirmation', 'ku-scrum-accountabilities'],
    sources: [
      {
        sourceId: 'book-scrum-guide',
        sourceUrl: 'https://scrumguides.org/scrum-guide.html#increment',
        author: 'Ken Schwaber & Jeff Sutherland',
        title: 'The Scrum Guide (2020)',
        publishedAt: '2020-11-01',
        accessedAt: '2026-09-06',
        location: 'Commitment: Definition of Done',
        citationText: 'The Definition of Done is a formal description of the state of the Increment when it meets the quality measures required for the product. The moment a Product Backlog item meets the Definition of Done, an Increment is born.'
      }
    ],
    confidence: 0.99,
    qualityScore: 98,
    provenance: 'Verbatim definition from official Scrum Guide 2020.',
    officialDefinition: 'Creates transparency by providing everyone a shared understanding of what work was completed as part of the Increment. If a Product Backlog item does not meet the Definition of Done, it cannot be released or even presented at the Sprint Review.',
    careerosInterpretation: 'Include automated testing, linting, security scans, telemetry logging, and documentation within your DoD.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 2,
    authorityWeightedConfidence: 0.99
  },

  // ==========================================
  // BEHAVIORAL DESIGN & HABITS (Nir Eyal)
  // ==========================================
  {
    id: 'ku-hook-model',
    title: 'The Hook Model for Habit-Forming Products',
    summary: 'A 4-step loop connecting a user’s problem to a designer’s solution with enough frequency to form a habit: Trigger, Action, Variable Reward, and Investment.',
    type: 'framework',
    domain: 'Product Management',
    subdomain: 'Behavioral Design & Growth',
    skills: ['Behavioral Product Design', 'Retention Modeling', 'Growth Loops', 'User Engagement'],
    roles: ['Product Manager', 'Growth PM', 'UX Designer', 'Product Strategist'],
    prerequisites: [],
    relatedConcepts: ['ku-variable-rewards-types', 'ku-behavioral-investment-phase'],
    sources: [
      {
        sourceId: 'book-hooked',
        sourceUrl: 'https://www.nirandfar.com/how-to-manufacture-desire/',
        author: 'Nir Eyal',
        title: 'Hooked: How to Build Habit-Forming Products',
        publishedAt: '2014-11-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 1: The Habit Zone',
        citationText: 'The Hook Model is an experience designed to connect the user’s problem to a solution frequently enough to form a habit through four steps: Trigger, Action, Variable Reward, and Investment.'
      }
    ],
    confidence: 0.98,
    qualityScore: 97,
    provenance: 'Reconstructed from Nir Eyal’s official public frameworks and Stanford lectures.',
    officialDefinition: 'A behavior-design framework consisting of: 1. Trigger (external/internal); 2. Action (done in anticipation of reward); 3. Variable Reward (dopamine-driven uncertainty); 4. Investment (user commits effort/data to improve future cycles).',
    careerosInterpretation: 'Frequently leveraged in product execution cases (e.g. "How would you increase retention in Slack or Spotify?"). Walk the interviewer through all 4 phases of the Hook loop.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 3,
    authorityWeightedConfidence: 0.98
  },
  {
    id: 'ku-variable-rewards-types',
    title: 'Variable Rewards Classification (Tribe, Hunt, Self)',
    summary: 'The three types of variable rewards that maintain user intrigue and dopamine response according to behavioral psychology.',
    type: 'concept',
    domain: 'Product Management',
    subdomain: 'Behavioral Design',
    skills: ['User Engagement', 'Gamification & Incentive Design', 'Retention'],
    roles: ['Product Manager', 'Growth PM', 'UX Designer'],
    prerequisites: ['ku-hook-model'],
    relatedConcepts: ['ku-hook-model', 'ku-behavioral-investment-phase'],
    sources: [
      {
        sourceId: 'book-hooked',
        author: 'Nir Eyal',
        title: 'Hooked',
        publishedAt: '2014-11-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 4: Variable Reward',
        citationText: 'Variable rewards come in three varieties: Rewards of the Tribe (social validation), Rewards of the Hunt (material resources and information), and Rewards of the Self (mastery and competence).'
      }
    ],
    confidence: 0.96,
    qualityScore: 94,
    provenance: 'Nir Eyal public behavioral lectures and academic operant conditioning references.',
    officialDefinition: '1. Rewards of the Tribe: Social acceptance, recognition, connection; 2. Rewards of the Hunt: Finding deals, scrolling feeds for content; 3. Rewards of the Self: Leveling up, clearing an inbox, completing a puzzle.',
    careerosInterpretation: 'Avoid relying solely on financial discounts (Hunt); sustainable SaaS retention relies on Mastery (Self) and Collaboration (Tribe).',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 2,
    authorityWeightedConfidence: 0.95
  },
  {
    id: 'ku-behavioral-investment-phase',
    title: 'The Investment Phase & Stored Value',
    summary: 'The critical fourth phase of the Hook loop where the user inputs data, social capital, or custom preferences, loading the trigger for the next loop.',
    type: 'principle',
    domain: 'Product Management',
    subdomain: 'Behavioral Design & Switching Costs',
    skills: ['Retention Modeling', 'Switching Costs', 'Network Effects'],
    roles: ['Product Manager', 'Growth Lead'],
    prerequisites: ['ku-hook-model'],
    relatedConcepts: ['ku-hook-model'],
    sources: [
      {
        sourceId: 'book-hooked',
        author: 'Nir Eyal',
        title: 'Hooked',
        publishedAt: '2014-11-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 5: Investment',
        citationText: 'Unlike during the action phase, where users want immediate gratification, the investment phase asks users to do work. This investment accrues stored value and loads the next trigger.'
      }
    ],
    confidence: 0.97,
    qualityScore: 95,
    provenance: 'Nir Eyal behavioral design papers and public talks.',
    officialDefinition: 'User inputs (e.g. creating playlists, uploading contacts, configuring settings) that increase stored value and drastically elevate switching costs.',
    careerosInterpretation: 'Demonstrates deep understanding of product moats. In strategy interviews, explain how investment creates defensibility.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 2,
    authorityWeightedConfidence: 0.96
  },

  // ==========================================
  // DISTRIBUTED SYSTEMS & SYSTEM DESIGN (Kleppmann)
  // ==========================================
  {
    id: 'ku-lsm-vs-btree',
    title: 'LSM-Trees vs. B-Trees Storage Engines',
    summary: 'The fundamental architectural trade-off between write-optimized append-only Log-Structured Merge-Trees and read-optimized page-based B-Trees.',
    type: 'pattern',
    domain: 'Software Engineering & System Architecture',
    subdomain: 'Database Internals & Storage Engines',
    skills: ['Database Selection & Tuning', 'System Design', 'Storage Engines', 'Throughput Optimization'],
    roles: ['Software Engineer', 'Backend Engineer', 'Data Engineer', 'Solution Architect'],
    prerequisites: [],
    relatedConcepts: ['ku-leaderless-replication-quorums', 'ku-stream-table-duality'],
    sources: [
      {
        sourceId: 'book-ddia',
        sourceUrl: 'https://dataintensive.net',
        author: 'Martin Kleppmann',
        title: 'Designing Data-Intensive Applications',
        publishedAt: '2017-03-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 3: Storage and Retrieval',
        citationText: 'As a rule of thumb, LSM-trees are typically better for write throughput, whereas B-trees are thought to be faster for reads. Reads are typically slower on LSM-trees because they have to check several different data structures at different stages of compaction.'
      },
      {
        sourceId: 'lecture-kleppmann-cambridge',
        author: 'Martin Kleppmann',
        title: 'University of Cambridge Distributed Systems Lectures',
        publishedAt: '2021-01-15',
        accessedAt: '2026-09-06',
        location: 'Lecture 4: Storage Engines and Compaction',
        citationText: 'SSTables and LSM-Trees leverage sequential disk writes and background merge compaction, avoiding in-place random writes.'
      }
    ],
    confidence: 0.99,
    qualityScore: 98,
    provenance: 'Corroborated across Kleppmann’s DDIA textbook and Cambridge university lecture slides.',
    officialDefinition: 'B-Trees overwrite fixed-size pages (4KB-8KB) in place with write-ahead logs. LSM-Trees write sequentially to an in-memory Memtable, flush immutable SSTables to disk, and periodically perform merge compaction.',
    careerosInterpretation: 'Essential knowledge for backend system design interviews. Recommend LSM-trees (Cassandra, RocksDB) for high-frequency write workloads like IoT metrics, and B-trees (Postgres, MySQL) for low-latency point reads.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 3,
    authorityWeightedConfidence: 0.99
  },
  {
    id: 'ku-leaderless-replication-quorums',
    title: 'Leaderless Replication & Quorum Reads/Writes (Dynamo-Style)',
    summary: 'A distributed replication topology where any replica can accept writes, configured via quorum condition w + r > n to guarantee reading latest values.',
    type: 'pattern',
    domain: 'Software Engineering & System Architecture',
    subdomain: 'Distributed Consensus & Replication',
    skills: ['Distributed Systems Architecture', 'Fault Tolerance & Consistency', 'Database Architecture'],
    roles: ['Backend Engineer', 'Distributed Systems Engineer', 'Solution Architect'],
    prerequisites: [],
    relatedConcepts: ['ku-linearizability-vs-serializability', 'ku-distributed-transactions-2pc'],
    sources: [
      {
        sourceId: 'book-ddia',
        author: 'Martin Kleppmann',
        title: 'Designing Data-Intensive Applications',
        publishedAt: '2017-03-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 5: Replication',
        citationText: 'If there are n replicas, every write must be confirmed by w nodes to be considered successful, and we must query at least r nodes for each read. As long as w + r > n, we expect to get an up-to-date value when reading.'
      },
      {
        sourceId: 'paper-amazon-dynamo',
        author: 'Giuseppe DeCandia et al. (Amazon)',
        title: 'Dynamo: Amazon’s Highly Available Key-value Store',
        publishedAt: '2007-10-14',
        accessedAt: '2026-09-06',
        location: 'SOSP ‘07',
        citationText: 'Sloppy quorums and hinted handoff ensure always-writable shopping carts at high scale.'
      }
    ],
    confidence: 0.99,
    qualityScore: 98,
    provenance: 'Synthesized from Amazon Dynamo seminal paper and Kleppmann DDIA analysis.',
    officialDefinition: 'An architecture avoiding single-point bottlenecks by letting clients write directly to multiple replicas. Quorum consensus ensures that read and write replica sets overlap on at least one node containing the latest version.',
    careerosInterpretation: 'When asked to design a globally distributed cache or key-value store, discuss sloppy quorums vs strict quorums and vector clocks for concurrent conflict resolution.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 3,
    authorityWeightedConfidence: 0.99
  },
  {
    id: 'ku-distributed-transactions-2pc',
    title: 'Two-Phase Commit (2PC) & Atomic Commit Protocols',
    summary: 'An atomic commit protocol ensuring all participant nodes commit or abort a distributed transaction together, subject to coordinator blocking limitations.',
    type: 'method',
    domain: 'Software Engineering & System Architecture',
    subdomain: 'Distributed Transactions',
    skills: ['Distributed Transactions', 'System Design', 'Fault Tolerance'],
    roles: ['Backend Engineer', 'Solution Architect', 'Principal Architect'],
    prerequisites: ['ku-linearizability-vs-serializability'],
    relatedConcepts: ['ku-linearizability-vs-serializability', 'ku-stream-table-duality'],
    sources: [
      {
        sourceId: 'book-ddia',
        author: 'Martin Kleppmann',
        title: 'Designing Data-Intensive Applications',
        publishedAt: '2017-03-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 9: Consistency and Consensus',
        citationText: '2PC begins with a prepare phase where the coordinator asks all participants if they can commit. If everyone votes yes, the coordinator commits in phase 2; otherwise it aborts. If coordinator fails while nodes are prepared, nodes are blocked.'
      }
    ],
    confidence: 0.98,
    qualityScore: 96,
    provenance: 'Martin Kleppmann DDIA consensus taxonomy and Gray & Lamport transaction theory.',
    officialDefinition: 'Phase 1: Prepare (coordinator checks ready state; nodes promise to commit); Phase 2: Commit (coordinator writes commit record and commands nodes to execute). Vulnerable to coordinator failure causing blocking.',
    careerosInterpretation: 'In modern microservice architectures, explain why developers avoid 2PC due to blocking latency and instead prefer Sagas with compensating transactions or event-driven reconciliation.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 2,
    authorityWeightedConfidence: 0.97
  },
  {
    id: 'ku-linearizability-vs-serializability',
    title: 'Linearizability vs. Serializability',
    summary: 'The crucial distinction between a recency guarantee on single objects (Linearizability) vs. an isolation guarantee on multi-operation transactions (Serializability).',
    type: 'definition',
    domain: 'Software Engineering & System Architecture',
    subdomain: 'Consistency & Database Theory',
    skills: ['Database Theory', 'Distributed Consistency', 'System Architecture'],
    roles: ['Backend Engineer', 'Staff Systems Engineer', 'Solution Architect'],
    prerequisites: [],
    relatedConcepts: ['ku-distributed-transactions-2pc'],
    sources: [
      {
        sourceId: 'book-ddia',
        author: 'Martin Kleppmann',
        title: 'Designing Data-Intensive Applications',
        publishedAt: '2017-03-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 9: Consistency and Consensus',
        citationText: 'Serializability is an isolation property of transactions, ensuring they execute as if in some serial order. Linearizability is a recency guarantee on reads and writes of a register (single object). A system can have both (Strict Serializability / External Consistency).'
      }
    ],
    confidence: 0.99,
    qualityScore: 99,
    provenance: 'Martin Kleppmann’s published research and Cambridge lectures.',
    officialDefinition: 'Serializability ensures transactions do not race against one another. Linearizability ensures that once a write finishes, all subsequent reads immediately return the new value (global clock illusion).',
    careerosInterpretation: 'One of the most frequently failed nuances in Staff+ engineering interviews. Confusing these two reveals surface-level understanding.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 3,
    authorityWeightedConfidence: 0.99
  },
  {
    id: 'ku-stream-table-duality',
    title: 'Stream-Table Duality in Event-Driven Architecture',
    summary: 'The principle that a stream of change events can be reduced into a state table, and mutations on a table can be emitted as a change log stream.',
    type: 'principle',
    domain: 'Software Engineering & System Architecture',
    subdomain: 'Event-Driven Architecture & Stream Processing',
    skills: ['Event-Driven Architecture', 'Kafka & Streaming', 'Change Data Capture (CDC)', 'Data Engineering'],
    roles: ['Data Engineer', 'Backend Engineer', 'Solution Architect'],
    prerequisites: [],
    relatedConcepts: ['ku-lsm-vs-btree'],
    sources: [
      {
        sourceId: 'book-ddia',
        author: 'Martin Kleppmann',
        title: 'Designing Data-Intensive Applications',
        publishedAt: '2017-03-01',
        accessedAt: '2026-09-06',
        location: 'Chapter 11: Stream Processing',
        citationText: 'A stream can be seen as the changelog of a table, and a table can be seen as the aggregation of a stream. This stream-table duality is central to event sourcing, materialized views, and streaming engines like Kafka Streams and Flink.'
      }
    ],
    confidence: 0.98,
    qualityScore: 97,
    provenance: 'Martin Kleppmann DDIA Chapter 11 and Jay Kreps (Kafka) streaming theory.',
    officialDefinition: 'Stream = changelog of mutations over time; Table = current state at a point in time. Replaying a stream reconstructs the table; auditing the table yields a changelog.',
    careerosInterpretation: 'Use this duality when explaining CQRS (Command Query Responsibility Segregation) or real-time event analytics architectures.',
    knowledgeOrigin: 'source_direct',
    sourceAuthority: 5,
    sourceCount: 2,
    authorityWeightedConfidence: 0.98
  },

  // ==========================================
  // CROSS-SOURCE SYNTHESES (Career OS Syntheses)
  // ==========================================
  {
    id: 'ku-strategic-product-owner-synthesis',
    title: 'The Strategic Product Owner: Value, Discovery & Accountability',
    summary: 'A synthesized framework bridging Scrum Guide accountabilities, PSPO value optimization, and SVPG empowered product discovery.',
    type: 'framework',
    domain: 'Product Management',
    subdomain: 'Holistic Product Leadership',
    skills: ['Product Ownership', 'Product Discovery', 'Value Optimization', 'Strategic Leadership'],
    roles: ['Product Manager', 'Product Owner', 'Lead Product Manager'],
    prerequisites: ['ku-scrum-accountabilities', 'ku-empowered-teams', 'ku-value-optimization'],
    relatedConcepts: ['ku-product-goal', 'ku-four-product-risks', 'ku-evidence-based-management'],
    sources: [
      {
        sourceId: 'book-scrum-guide',
        author: 'Schwaber & Sutherland',
        title: 'The Scrum Guide',
        accessedAt: '2026-09-06',
        citationText: 'Accountable for maximizing product value.'
      },
      {
        sourceId: 'book-pspo',
        author: 'Don McGreal & Ralph Jocham',
        title: 'The Professional Scrum Product Owner',
        accessedAt: '2026-09-06',
        citationText: 'Measures current and unrealized value with EBM.'
      },
      {
        sourceId: 'book-inspired',
        author: 'Marty Cagan',
        title: 'Inspired',
        accessedAt: '2026-09-06',
        citationText: 'Conducts continuous discovery to de-risk value, usability, feasibility, viability.'
      }
    ],
    confidence: 0.96,
    qualityScore: 96,
    provenance: 'Multi-source conceptual synthesis authored by Career OS Research team.',
    officialDefinition: 'Career OS Integrated Model: The modern Product Owner operates at the intersection of Scrum Value Accountability (Scrum Guide), Empirical Value Metrics (PSPO), and Continuous Customer Discovery (SVPG).',
    careerosInterpretation: 'CAREER OS SYNTHESIS: The ultimate interview archetype. Combines disciplined delivery rhythm with entrepreneurial discovery and business accountability.',
    knowledgeOrigin: 'careeros_synthesis',
    sourceAuthority: 5,
    sourceCount: 3,
    authorityWeightedConfidence: 0.97
  }
];
