/**
 * Stored Follow-up Questions Repository
 * 
 * Priority rule: Use stored follow-up questions first.
 * Example:
 * Primary: "Tell me about a conflict with engineering."
 * Follow-up: "What would you do differently?"
 * Follow-up: "What was the measurable outcome?"
 * 
 * Only generate new follow-ups when no suitable stored follow-up exists.
 */

export interface StoredFollowUpMap {
  [questionIdOrIntent: string]: string[];
}

export const STORED_FOLLOW_UPS_BY_ID: StoredFollowUpMap = {
  // Disagreement with engineering / tech lead
  'q-star-disagreement': [
    'What would you do differently?',
    'What was the measurable outcome?',
    'How did this affect your working relationship and trust with engineering afterward?'
  ],
  // Fintech payment idempotency
  'q-tech-idempotency': [
    'What failure modes did you consider if the network partition occurred between the gateway and Redis?',
    'What would you do differently if the throughput grew by a factor of 10?',
    'What was the measurable outcome on duplicate transaction rate and p99 latency?'
  ],
  // Enterprise SaaS PM prioritization
  'q-pm-feature-prioritization': [
    'What would you do differently looking back on that quarter?',
    'What was the measurable outcome on onboarding churn and closed enterprise pipeline?',
    'How did you communicate the trade-off to executive stakeholders when pushback occurred?'
  ],
  // AI RAG Architecture
  'q-ai-rag-latency': [
    'What would you do differently regarding embedding chunking or caching strategies?',
    'What was the measurable outcome on query latency and hallucination rate?',
    'How did you validate that semantic retrieval remained grounded under adversarial queries?'
  ],
  // Healthcare HIPAA & PII Data
  'q-health-hipaa-pipeline': [
    'What would you do differently regarding audit logging and data residency?',
    'What was the measurable outcome during compliance audits or security drills?',
    'How did you handle developer debugging ergonomics without exposing live PHI?'
  ]
};

export const STORED_FOLLOW_UPS_BY_INTENT: { pattern: RegExp; followUps: string[] }[] = [
  {
    // Disagreement, conflict, engineering friction
    pattern: /conflict|disagree|pushback|stakeholder|engineering team/i,
    followUps: [
      'What would you do differently?',
      'What was the measurable outcome?',
      'How did you maintain alignment with engineering once the decision was finalized?'
    ]
  },
  {
    // Workflow redesign, process improvement, operational optimization
    pattern: /workflow|process|improve|redesign|automation|pipeline/i,
    followUps: [
      'What would you do differently?',
      'What was the measurable outcome on operational efficiency or cycle time?',
      'How did you get buy-in from team members who were accustomed to the old process?'
    ]
  },
  {
    // Decision under ambiguity, incomplete information
    pattern: /ambiguity|uncertain|decision without|incomplete|risk/i,
    followUps: [
      'What would you do differently in validating your assumptions?',
      'What was the measurable outcome or impact of that decision?',
      'What was the primary trade-off you had to accept?'
    ]
  },
  {
    // Architecture, distributed systems, scalability, database
    pattern: /architect|latency|distributed|scale|system design|database|idempotency/i,
    followUps: [
      'What would you do differently regarding fault tolerance or edge failure modes?',
      'What was the measurable outcome on system reliability and latency?',
      'How did you evaluate consistency versus availability trade-offs?'
    ]
  },
  {
    // Product sense, prioritization, roadmap
    pattern: /priorit|product sense|feature|roadmap|trade-off|churn/i,
    followUps: [
      'What would you do differently in how you prioritized those conflicting demands?',
      'What was the measurable outcome on customer adoption and key business metrics?',
      'How did you validate user feedback before committing engineering capacity?'
    ]
  },
  {
    // General fallback stored follow-ups
    pattern: /.*/,
    followUps: [
      'What would you do differently?',
      'What was the measurable outcome?',
      'What was the most difficult trade-off you made during this initiative?'
    ]
  }
];
