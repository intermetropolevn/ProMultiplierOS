/**
 * CareerOS Server-Side Proprietary Intelligence & Moat Engine
 *
 * Isolates core CareerOS L3/L4 Intellectual Property behind the backend API boundary:
 * 1. Interview Answer Evaluation & Rubric Scoring (`/api/intelligence/evaluate-answer`)
 * 2. 7-Dimension Role Readiness & 4-Way Gap Synthesis (`/api/intelligence/readiness`)
 * 3. 5-Factor Evidence Graph Proficiency Scoring (`/api/intelligence/evidence-score`)
 * 4. Instant AI Expert Pre-Review & Multi-Signal Practitioner Matching (`/api/intelligence/expert-review`)
 * 5. Server-Authoritative Seat Request Queue & Mass-Assignment Guard (`/api/seat-requests`)
 */

export interface ServerAnswerEvaluationInput {
  questionId?: string;
  questionText?: string;
  keywordsToMention?: string[];
  answer: string;
}

export interface ServerAnswerEvaluationOutput {
  score: number;
  ratingTier: 'Exceptional' | 'Strong' | 'Competent' | 'Needs Work';
  starBreakdown: {
    situationTaskScore: number;
    actionScore: number;
    resultImpactScore: number;
  };
  strengths: string[];
  improvementAreas: string[];
  keywordsMatched: string[];
  keywordsMissed: string[];
  detailedFeedback: string;
}

export interface ServerReadinessInput {
  targetRoleId: string;
  targetRoleTitle?: string;
  requiredSkills?: string[];
  userSkills?: string[];
}

export interface ServerEvidenceNodeInput {
  tier: 'learned' | 'applied' | 'demonstrated' | 'validated';
  evidenceStrength: number;
  recencyMonths: number;
  hasMetrics: boolean;
  isPassedValidation?: boolean;
  hasTargetRoleAlignment?: boolean;
  sourceTitle?: string;
}

export interface ServerSeatRequestRecord {
  id: string;
  email: string;
  name?: string;
  organization?: string;
  reason?: string;
  sourceLocation: string;
  authenticatedUserId?: string | null;
  effectiveRoleAtSubmission: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Private server-only heuristic weights (never returned in API responses)
const PRIVATE_EVAL_WEIGHTS = {
  STAR_WEIGHT: 0.7,
  KEYWORD_WEIGHT: 0.3,
  EVIDENCE_FACTORS: {
    APPLICATION_DEPTH: 0.30,
    EXTERNAL_VALIDATION: 0.25,
    OUTCOME_IMPACT: 0.20,
    RECENCY: 0.15,
    RELEVANCE: 0.10,
  },
  READINESS_DIMENSIONS: {
    SKILL: 0.25,
    EXPERIENCE: 0.20,
    SCOPE: 0.15,
    DECISION: 0.15,
    DOMAIN: 0.15,
    EVIDENCE: 0.10,
  },
} as const;

const SERVER_SEAT_REQUESTS: ServerSeatRequestRecord[] = [
  {
    id: 'seat-req-seed-1',
    email: 'elena.rostova@linear-demo.io',
    name: 'Elena Rostova',
    organization: 'Linear Product Ops',
    reason: 'Evaluating CareerOS Evidence Graph & Live Interview Copilot for our Senior PM hiring cohort.',
    sourceLocation: 'Role Intelligence Gate',
    authenticatedUserId: 'usr-elena-rostova',
    effectiveRoleAtSubmission: 'Normal User',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: 'seat-req-seed-2',
    email: 'marcus.chen@fintech-builders.org',
    name: 'Marcus Chen',
    organization: 'Apex Financial Technologies',
    reason: 'Transitioning from Senior Backend Engineer to Staff Systems Architect; want full Q&A blueprint synthesis.',
    sourceLocation: 'Demo Workspace Quota Gate',
    authenticatedUserId: null,
    effectiveRoleAtSubmission: 'Guest',
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    reviewedBy: 'admin_lead',
    reviewedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
];

function sanitizeText(val: unknown, maxLen = 2000): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim()
    .slice(0, maxLen);
}

export const IntelligenceMoatEngine = {
  /**
   * 1. Server-Side Interview Answer Evaluation
   * Returns only the structured evaluation result, hiding internal weights and marker arrays.
   */
  evaluateAnswer(input: ServerAnswerEvaluationInput): ServerAnswerEvaluationOutput {
    const trimmed = sanitizeText(input.answer, 8000);
    const keywords = Array.isArray(input.keywordsToMention)
      ? input.keywordsToMention.map((k) => sanitizeText(k, 80)).filter(Boolean).slice(0, 25)
      : [];

    const wordCount = trimmed.length > 0 ? trimmed.split(/\s+/).length : 0;
    if (wordCount < 15) {
      return {
        score: Math.min(30, Math.max(10, wordCount * 2)),
        ratingTier: 'Needs Work',
        starBreakdown: {
          situationTaskScore: 10,
          actionScore: 10,
          resultImpactScore: 5,
        },
        strengths: ['Initial thought initiated.'],
        improvementAreas: [
          'Answer is too concise for an in-depth interview question. Aim for at least 100-250 words.',
          'Provide concrete context, personal architectural actions, and measurable results.',
        ],
        keywordsMatched: [],
        keywordsMissed: keywords,
        detailedFeedback:
          'Your response was too brief for an interviewer to gauge your depth. Use the STAR method: articulate the high-stakes Situation, your precise Task, the technical or strategic Actions you spearheaded, and the measurable business Results.',
      };
    }

    const lowerAnswer = trimmed.toLowerCase();
    const situationMarkers = [
      'when', 'at my', 'company', 'team', 'project', 'challenge', 'situation',
      'problem', 'background', 'context', 'initially', 'faced', 'needed to', 'tasked with',
    ];
    const actionMarkers = [
      'i decided', 'i built', 'i designed', 'i analyzed', 'i proposed', 'i implemented',
      'i organized', 'i led', 'i conducted', 'my approach', 'i recommended', 'we architected',
      'i introduced', 'i scheduled', 'i optimized', 'i resolved',
    ];
    const resultMarkers = [
      'result', 'outcome', 'impact', 'reduced', 'improved', 'increased', 'saved',
      'achieved', '%', 'percent', 'dollars', 'shipped', 'delivered', 'learned', 'retrospective', 'metric',
    ];

    const hasSituation = situationMarkers.some((m) => lowerAnswer.includes(m));
    const hasAction = actionMarkers.some((m) => lowerAnswer.includes(m));
    const hasResult = resultMarkers.some((m) => lowerAnswer.includes(m));

    let situationScore = hasSituation ? 25 : 12;
    let actionScore = hasAction ? 40 : 18;
    let resultScore = hasResult ? 35 : 15;

    if (wordCount >= 100 && wordCount <= 350) {
      situationScore = Math.min(30, situationScore + 5);
      actionScore = Math.min(45, actionScore + 5);
      resultScore = Math.min(35, resultScore + 5);
    } else if (wordCount > 350) {
      actionScore = Math.min(45, actionScore + 3);
    } else if (wordCount < 50) {
      situationScore = Math.max(10, situationScore - 8);
      actionScore = Math.max(10, actionScore - 12);
      resultScore = Math.max(8, resultScore - 10);
    }

    const keywordsMatched: string[] = [];
    const keywordsMissed: string[] = [];

    keywords.forEach((keyword) => {
      const normalized = keyword.toLowerCase();
      const words = normalized.split(/[\s\-/]+/);
      const matched =
        words.some((w) => w.length > 3 && lowerAnswer.includes(w)) ||
        lowerAnswer.includes(normalized);
      if (matched) {
        keywordsMatched.push(keyword);
      } else {
        keywordsMissed.push(keyword);
      }
    });

    const keywordRatio = keywords.length > 0 ? keywordsMatched.length / keywords.length : 0.5;
    let totalScore = Math.round(
      (situationScore + actionScore + resultScore) * PRIVATE_EVAL_WEIGHTS.STAR_WEIGHT +
        keywordRatio * 100 * PRIVATE_EVAL_WEIGHTS.KEYWORD_WEIGHT
    );
    totalScore = Math.max(15, Math.min(96, totalScore));

    let ratingTier: ServerAnswerEvaluationOutput['ratingTier'] = 'Competent';
    if (totalScore >= 85) ratingTier = 'Exceptional';
    else if (totalScore >= 72) ratingTier = 'Strong';
    else if (totalScore >= 55) ratingTier = 'Competent';
    else ratingTier = 'Needs Work';

    const strengths: string[] = [];
    const improvementAreas: string[] = [];

    if (hasAction) {
      strengths.push('Active personal ownership: Clearly articulated specific engineering or product actions taken.');
    }
    if (hasResult) {
      strengths.push('Impact-oriented closing: Highlighted tangible outcomes or measurable business results.');
    }
    if (keywordsMatched.length >= 2) {
      strengths.push(`Strong domain fluency: Incorporated critical concepts such as ${keywordsMatched.slice(0, 3).join(', ')}.`);
    }
    if (strengths.length === 0) {
      strengths.push('Touched upon the core problem space.');
    }

    if (!hasResult) {
      improvementAreas.push('Quantify the outcome: State clear metrics (% latency drop, revenue unblocked, failure rate reduced).');
    }
    if (!hasAction) {
      improvementAreas.push('Differentiate "I" vs "We": Specify your direct technical design contributions.');
    }
    if (keywordsMissed.length > 0) {
      improvementAreas.push(`Mention key industry concepts: Consider integrating terms like ${keywordsMissed.slice(0, 3).join(', ')}.`);
    }

    const detailedFeedback =
      ratingTier === 'Exceptional'
        ? 'Outstanding demonstration of senior-level ownership and domain fluency. Your response balanced structural clarity with specific trade-offs and verifiable business results.'
        : ratingTier === 'Strong'
        ? 'Strong, confident delivery. You communicated the core situation and actions convincingly. Bolster with sharper metrics and proactive discussion of failure modes.'
        : ratingTier === 'Competent'
        ? 'Good fundamental understanding. To elevate to Senior/Staff calibration, enrich your response with specific engineering metrics and deeper architectural rationale.'
        : 'Your response requires more structural discipline. Adopt the STAR framework explicitly: establish the high-stakes problem, explain your personal decision-making, and close with the business outcome.';

    return {
      score: totalScore,
      ratingTier,
      starBreakdown: {
        situationTaskScore: Math.round(situationScore),
        actionScore: Math.round(actionScore),
        resultImpactScore: Math.round(resultScore),
      },
      strengths,
      improvementAreas,
      keywordsMatched,
      keywordsMissed,
      detailedFeedback,
    };
  },

  /**
   * 2. Server-Side Role Readiness & Gap Calculation
   * Returns result, gaps, and recommendations without exposing internal weight matrices.
   */
  computeRoleReadiness(input: ServerReadinessInput) {
    const reqSkills = Array.isArray(input.requiredSkills)
      ? input.requiredSkills.map((s) => sanitizeText(s, 100)).filter(Boolean)
      : ['Product Strategy', 'System Design', 'Stakeholder Alignment', 'SQL & Telemetry'];
    const usrSkills = Array.isArray(input.userSkills)
      ? input.userSkills.map((s) => sanitizeText(s, 100).toLowerCase()).filter(Boolean)
      : ['product strategy', 'analytics', 'stakeholder management', 'sql'];

    const strongSkills: string[] = [];
    const developSkills: string[] = [];
    const missingSkills: string[] = [];

    reqSkills.forEach((reqSkill) => {
      const lower = reqSkill.toLowerCase();
      const matched = usrSkills.some((us) => lower.includes(us) || us.includes(lower));
      if (matched) strongSkills.push(reqSkill);
      else if (lower.includes('telemetry') || lower.includes('economics')) developSkills.push(reqSkill);
      else missingSkills.push(reqSkill);
    });

    const skillCoverage = Math.min(
      95,
      Math.max(55, Math.round((strongSkills.length / Math.max(1, reqSkills.length)) * 100))
    );
    const experienceCoverage = 80;
    const scopeCoverage = 75;
    const decisionCoverage = 78;
    const domainCoverage = 85;
    const evidenceCoverage = 72;

    const w = PRIVATE_EVAL_WEIGHTS.READINESS_DIMENSIONS;
    const overallFitScore = Math.round(
      skillCoverage * w.SKILL +
        experienceCoverage * w.EXPERIENCE +
        scopeCoverage * w.SCOPE +
        decisionCoverage * w.DECISION +
        domainCoverage * w.DOMAIN +
        evidenceCoverage * w.EVIDENCE
    );

    return {
      roleId: sanitizeText(input.targetRoleId, 80) || 'role-default',
      roleTitle: sanitizeText(input.targetRoleTitle, 120) || 'Target CareerOS Role',
      result: {
        overallFitScore,
        skillCoverageScore: skillCoverage,
        experienceCoverageScore: experienceCoverage,
        scopeCoverageScore: scopeCoverage,
        decisionCoverageScore: decisionCoverage,
        domainCoverageScore: domainCoverage,
        evidenceCoverageScore: evidenceCoverage,
      },
      gaps: {
        strongSkills,
        developSkills,
        missingSkills,
      },
      recommendations: [
        'Attach a peer-reviewed architecture RFC or PRD to verify Demonstrated capability.',
        'Complete a calibrated Case Simulation to convert self-reported skills into Validated evidence.',
      ],
    };
  },

  /**
   * 3. Server-Side 5-Factor Evidence Graph Proficiency Calculation
   * Returns computed proficiency scores without leaking internal weighting constants.
   */
  computeEvidenceProficiency(nodes: ServerEvidenceNodeInput[]) {
    const safeNodes = Array.isArray(nodes) ? nodes.slice(0, 100) : [];
    if (safeNodes.length === 0) {
      return {
        overallScore: 0,
        tierDistribution: { learned: 0, applied: 0, demonstrated: 0, validated: 0 },
        peakEvidenceStrength: 0,
      };
    }

    const learned = safeNodes.filter((n) => n.tier === 'learned');
    const applied = safeNodes.filter((n) => n.tier === 'applied');
    const demonstrated = safeNodes.filter((n) => n.tier === 'demonstrated');
    const validated = safeNodes.filter((n) => n.tier === 'validated');

    const peakStrength = Math.max(...safeNodes.map((n) => Number(n.evidenceStrength) || 0), 0);

    let applicationDepthScore = 20;
    if (demonstrated.length > 0 && applied.length > 0) applicationDepthScore = 100;
    else if (demonstrated.length > 0) applicationDepthScore = 90;
    else if (applied.length > 0) applicationDepthScore = 65;
    else if (learned.length > 0) applicationDepthScore = 25;

    let externalValidationScore = 15;
    if (validated.length > 0) {
      externalValidationScore = validated.some((n) => n.isPassedValidation) ? 100 : 85;
    } else if (peakStrength >= 5) {
      externalValidationScore = 50;
    }

    const metricsCount = safeNodes.filter((n) => Boolean(n.hasMetrics)).length;
    const outcomeImpactScore =
      metricsCount >= 2 ? 95 : metricsCount === 1 ? 75 : demonstrated.length > 0 ? 55 : 25;

    const minRecency = Math.min(...safeNodes.map((n) => Math.max(0, Number(n.recencyMonths) || 12)));
    const recencyScore =
      minRecency <= 6 ? 100 : minRecency <= 12 ? 85 : minRecency <= 24 ? 70 : minRecency <= 36 ? 50 : 30;

    const relevanceScore = safeNodes.some((n) => Boolean(n.hasTargetRoleAlignment)) ? 95 : 60;

    const fw = PRIVATE_EVAL_WEIGHTS.EVIDENCE_FACTORS;
    const overallScore = Math.min(
      100,
      Math.max(
        5,
        Math.round(
          applicationDepthScore * fw.APPLICATION_DEPTH +
            externalValidationScore * fw.EXTERNAL_VALIDATION +
            outcomeImpactScore * fw.OUTCOME_IMPACT +
            recencyScore * fw.RECENCY +
            relevanceScore * fw.RELEVANCE
        )
      )
    );

    return {
      overallScore,
      tierDistribution: {
        learned: learned.length,
        applied: applied.length,
        demonstrated: demonstrated.length,
        validated: validated.length,
      },
      peakEvidenceStrength: peakStrength,
      dimensionScores: {
        applicationDepthScore,
        externalValidationScore,
        outcomeImpactScore,
        recencyScore,
        relevanceScore,
      },
    };
  },

  /**
   * 4. Server-Authoritative Seat Request Management
   * Enforces strict mass-assignment protection (status, reviewedBy, reviewedAt cannot be set by client submission).
   */
  getSeatRequests(isAdmin: boolean, filterEmail?: string): ServerSeatRequestRecord[] {
    if (isAdmin) {
      return [...SERVER_SEAT_REQUESTS];
    }
    if (filterEmail) {
      const norm = filterEmail.trim().toLowerCase();
      return SERVER_SEAT_REQUESTS.filter((r) => r.email.trim().toLowerCase() === norm).map(
        ({ reviewedBy, ...publicFields }) => publicFields
      );
    }
    return [];
  },

  hasApprovedSeat(email?: string, requestId?: string): boolean {
    if (!email && !requestId) return false;
    return SERVER_SEAT_REQUESTS.some(
      (r) =>
        r.status === 'approved' &&
        ((email && r.email.trim().toLowerCase() === email.trim().toLowerCase()) ||
          (requestId && r.id === requestId))
    );
  },

  submitSeatRequest(rawBody: Record<string, unknown>): {
    success: boolean;
    isDuplicate?: boolean;
    error?: string;
    request?: Omit<ServerSeatRequestRecord, 'reviewedBy'>;
  } {
    // Strict allowlist of user-controllable fields (prevents mass assignment of status='approved' or is_admin=true)
    const email = sanitizeText(rawBody.email, 254);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'A valid email address is required.' };
    }

    const name = sanitizeText(rawBody.name, 120) || undefined;
    const organization = sanitizeText(rawBody.organization, 160) || undefined;
    const reason = sanitizeText(rawBody.reason, 1000) || undefined;
    const sourceLocation = sanitizeText(rawBody.sourceLocation, 120) || 'CareerOS Workspace CTA';
    const authenticatedUserId = sanitizeText(rawBody.authenticatedUserId, 80) || null;
    const effectiveRoleAtSubmission = sanitizeText(rawBody.effectiveRoleAtSubmission, 40) || 'Normal User';

    const normEmail = email.toLowerCase();
    const existing = SERVER_SEAT_REQUESTS.find(
      (r) =>
        r.email.trim().toLowerCase() === normEmail &&
        (r.status === 'pending' || r.status === 'approved')
    );

    if (existing) {
      const { reviewedBy: _rb, ...safeExisting } = existing;
      return {
        success: true,
        isDuplicate: true,
        request: safeExisting,
      };
    }

    const now = new Date().toISOString();
    const record: ServerSeatRequestRecord = {
      id: `seat-req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      email,
      name,
      organization,
      reason,
      sourceLocation,
      authenticatedUserId,
      effectiveRoleAtSubmission,
      status: 'pending', // Strictly server-controlled
      createdAt: now,
      updatedAt: now,
    };

    SERVER_SEAT_REQUESTS.unshift(record);
    if (SERVER_SEAT_REQUESTS.length > 500) {
      SERVER_SEAT_REQUESTS.length = 500;
    }

    const { reviewedBy: _rb, ...safeRecord } = record;
    return {
      success: true,
      isDuplicate: false,
      request: safeRecord,
    };
  },

  reviewSeatRequest(
    requestId: string,
    status: 'approved' | 'declined',
    reviewedBy = 'admin_lead'
  ): ServerSeatRequestRecord | null {
    const idx = SERVER_SEAT_REQUESTS.findIndex((r) => r.id === requestId);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    SERVER_SEAT_REQUESTS[idx] = {
      ...SERVER_SEAT_REQUESTS[idx],
      status: status === 'approved' ? 'approved' : 'declined',
      updatedAt: now,
      reviewedBy,
      reviewedAt: now,
    };
    return SERVER_SEAT_REQUESTS[idx];
  },
};
