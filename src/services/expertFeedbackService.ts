import { 
  ExpertProfile, 
  FeedbackRequest, 
  CreateFeedbackPayload, 
  AIReviewEvaluation, 
  FeedbackContext, 
  ExpertHelpType,
  FollowUpMessage,
  FeedbackIteration
} from '../types/expertFeedback';
import { INITIAL_EXPERTS, INITIAL_FEEDBACK_REQUESTS } from '../data/expertNetworkData';

const REQUESTS_STORAGE_KEY = 'career_os_feedback_requests_v1';
const EXPERTS_STORAGE_KEY = 'career_os_experts_v1';

export class ExpertFeedbackService {
  /**
   * Get all feedback requests from localStorage or seed defaults
   */
  public static getAllRequests(): FeedbackRequest[] {
    try {
      const data = localStorage.getItem(REQUESTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to parse feedback requests from storage:', e);
    }
    this.saveRequests(INITIAL_FEEDBACK_REQUESTS);
    return INITIAL_FEEDBACK_REQUESTS;
  }

  /**
   * Save requests to localStorage and broadcast event
   */
  public static saveRequests(requests: FeedbackRequest[]): void {
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
      window.dispatchEvent(new CustomEvent('career_feedback_updated'));
    } catch (e) {
      console.warn('Failed to save feedback requests to storage:', e);
    }
  }

  /**
   * Get all experts in the Expert Network
   */
  public static getAllExperts(): ExpertProfile[] {
    try {
      const data = localStorage.getItem(EXPERTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to parse experts from storage:', e);
    }
    return INITIAL_EXPERTS;
  }

  /**
   * Find expert by ID
   */
  public static getExpertById(expertId: string): ExpertProfile | null {
    return this.getAllExperts().find(e => e.id === expertId) || null;
  }

  /**
   * Find feedback request by ID
   */
  public static getRequestById(requestId: string): FeedbackRequest | null {
    return this.getAllRequests().find(r => r.id === requestId) || null;
  }

  /**
   * Generate instantaneous AI Review evaluation on submitted work
   */
  public static generateAIReview(context: FeedbackContext, helpType: ExpertHelpType): AIReviewEvaluation {
    const isProduct = context.relevantCapability.toLowerCase().includes('product') || context.targetRole.toLowerCase().includes('product');
    const isTechnical = context.relevantCapability.toLowerCase().includes('system') || context.relevantCapability.toLowerCase().includes('engineer') || context.targetRole.toLowerCase().includes('engineer') || context.targetRole.toLowerCase().includes('lead');

    if (isProduct) {
      return {
        strengths: [
          'Strong framing of core user and business friction points',
          'Identifies root cause rather than treating superficial symptoms',
          'Proposes structured progression metrics'
        ],
        gaps: [
          'Weak strategic trade-off analysis: what will you deliberately NOT build?',
          'Compliance and procurement friction points need explicit boundary conditions',
          'Metrics require tighter connection to long-term enterprise retention'
        ],
        recommendedImprovement: 'Explicitly define scope elimination: explain what enterprise integrations you will reject in v1 to protect shipping velocity and validate activation first.',
        capabilityAssessment: {
          capability: context.relevantCapability || 'Product Strategy',
          score: Math.min(95, Math.max(60, context.readinessScore - 3))
        },
        recommendationNote: 'Human feedback from an experienced B2B practitioner would add significant value here because enterprise procurement involves nuanced political and security trade-offs.',
        shouldSeekHumanExpert: true,
        humanExpertRationale: 'Strategic B2B judgment and scope elimination benefit heavily from practitioner validation.'
      };
    }

    if (isTechnical) {
      return {
        strengths: [
          'Clear understanding of distributed partition risks',
          'Defines explicit idempotency keys and retry policies',
          'Accurate identification of p99 latency bottlenecks'
        ],
        gaps: [
          'Split-brain recovery protocol requires formal quorum definition',
          'Memory pressure under GC pause spikes is unaddressed',
          'Fallback state persistence guarantees are ambiguous'
        ],
        recommendedImprovement: 'Clarify Raft leader election timeouts and socket buffer limits under maximum network partition stress.',
        capabilityAssessment: {
          capability: context.relevantCapability || 'Distributed Systems Architecture',
          score: Math.min(95, Math.max(60, context.readinessScore - 2))
        },
        recommendationNote: 'Human feedback would add significant value because zero-downtime ledger failovers require real-world battle-tested operational verification.',
        shouldSeekHumanExpert: true,
        humanExpertRationale: 'High-throughput system cutovers require battle-tested practitioner advice.'
      };
    }

    // Default universal assessment
    return {
      strengths: [
        'Structured analytical reasoning and clear presentation',
        'Direct alignment with target role expectations'
      ],
      gaps: [
        'Could include more defensible quantitative proof points',
        'Risk mitigation could be addressed more proactively'
      ],
      recommendedImprovement: 'Synthesize your response using executive top-down narrative structure with clear counter-arguments considered.',
      capabilityAssessment: {
        capability: context.relevantCapability || 'Professional Domain Capability',
        score: Math.min(95, Math.max(60, context.readinessScore))
      },
      recommendationNote: 'Human review from a domain specialist will provide high-conviction calibration for your upcoming career interviews.',
      shouldSeekHumanExpert: true,
      humanExpertRationale: 'Senior-level roles prioritize nuanced judgment and executive storytelling.'
    };
  }

  /**
   * Rank and recommend experts based on context, capability, and help type
   */
  public static getRecommendedExperts(context: FeedbackContext, helpType: ExpertHelpType): ExpertProfile[] {
    const experts = this.getAllExperts();
    const capabilityLower = context.relevantCapability.toLowerCase();
    const roleLower = context.targetRole.toLowerCase();

    // Score and rank experts based on multi-signal matching
    const scored = experts.map(exp => {
      let score = exp.matchScore;

      // Capability matching
      const hasDirectSkill = exp.skills.some(s => capabilityLower.includes(s.toLowerCase()) || s.toLowerCase().includes(capabilityLower));
      if (hasDirectSkill) score += 5;

      // Role matching
      if (roleLower.includes('product') && exp.role.toLowerCase().includes('product')) score += 4;
      if (roleLower.includes('engineer') && exp.role.toLowerCase().includes('architect')) score += 4;

      // Help type mode matching
      if (helpType === 'review_work' && exp.modes.includes('reviewer')) score += 3;
      if (helpType === 'build_with_me' && exp.modes.includes('builder')) score += 5;
      if (helpType === 'career_advice' && exp.modes.includes('mentor')) score += 3;
      if (helpType === 'challenge_thinking' && exp.modes.includes('practitioner')) score += 4;

      return {
        ...exp,
        matchScore: Math.min(99, score)
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Create a new Career Feedback Session
   */
  public static createFeedbackRequest(payload: CreateFeedbackPayload): FeedbackRequest {
    const requests = this.getAllRequests();
    const aiReview = this.generateAIReview(payload.context, payload.helpType);
    const assignedExpert = payload.expertId ? this.getExpertById(payload.expertId) : null;
    const expertId = payload.expertId || assignedExpert?.id || 'expert-sarah-chen';
    const expertName = payload.expertName || assignedExpert?.name || 'Sarah Chen';
    const scoreBefore = payload.context.readinessScore || 68;
    const scoreAfter = Math.min(98, scoreBefore + 5);

    const newRequest: FeedbackRequest = {
      id: `req-${Date.now()}`,
      userId: 'current-user',
      helpType: payload.helpType,
      context: payload.context,
      selectedFocusAreas: payload.selectedFocusAreas,
      feedbackFormat: payload.feedbackFormat,
      expertId,
      expertName,
      status: payload.deliverImmediately !== false ? 'feedback_delivered' : 'waiting_for_expert',
      submittedAt: new Date().toISOString(),
      deadline: payload.deadline,
      privacyShared: payload.privacyShared || {
        practiceResponse: true,
        careerGoal: true,
        targetRole: true,
        relevantCapability: true,
        fullCareerProfile: false,
        otherCareerEvidence: false,
        currentApplications: false
      },
      aiReview: aiReview,
      expertFeedback: payload.deliverImmediately !== false ? {
        expertId,
        expertName,
        overallAssessment: 'Strong foundation with sharp execution instincts. Defining explicit strategic trade-offs makes this evidence-worthy.',
        whatWorked: [
          'Progressive Permission Staging is the exact right architectural framing for enterprise trial friction',
          'The 2-minute compliance audit export anticipates the primary blocker in IT procurement'
        ],
        whatCouldImprove: [
          'Declare explicit scope elimination: state what you are deliberately choosing NOT to build in v1',
          'Decline custom SAML/SCIM connectors until post-trial conversion to protect shipping velocity'
        ],
        expertRecommendation: 'Explicitly decline custom IdP/SCIM provisioning in v1. Support standard OAuth and OIDC first to protect your 3-week shipping velocity and validate user activation.',
        suggestedNextStep: 'find_build',
        scoreBefore,
        scoreAfter,
        deliveredAt: new Date().toISOString(),
        verifiedValidationBadge: true,
        recommendedResources: [
          {
            id: 'res-wardley-mapping',
            title: 'Wardley Mapping for B2B Enterprise Feature Staging',
            type: 'Knowledge System · Strategic Framework'
          },
          {
            id: 'res-b2b-activation',
            title: 'Stripe Billing Self-Serve Activation Architecture',
            type: 'Case Study · Proven Blueprints'
          }
        ]
      } : undefined,
      iterations: [
        {
          iterationNumber: 1,
          submittedAnswer: payload.context.workSubmittedContent,
          score: scoreBefore,
          date: new Date().toISOString(),
          deltaSummary: 'Baseline submission for expert calibration'
        }
      ],
      followUpMessages: []
    };

    requests.unshift(newRequest);
    this.saveRequests(requests);
    return newRequest;
  }

  /**
   * Deliver simulated expert feedback (for high-fidelity prototype testing)
   */
  public static deliverSimulatedFeedback(requestId: string): FeedbackRequest | null {
    const requests = this.getAllRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return null;

    const expert = this.getExpertById(req.expertId || 'expert-sarah-chen');
    const expertName = expert?.name || 'Sarah Chen';
    const scoreBefore = req.context.readinessScore;
    const scoreAfter = Math.min(98, scoreBefore + 5);

    req.status = 'feedback_delivered';
    req.expertFeedback = {
      expertId: req.expertId || 'expert-sarah-chen',
      expertName: expertName,
      overallAssessment: 'Exceptional foundation with clear practitioner focus. Concrete trade-offs will make this evidence-worthy.',
      whatWorked: [
        'Clear problem diagnosis grounded in realistic user friction',
        'Demonstrates understanding of high-stakes enterprise constraints'
      ],
      whatCouldImprove: [
        'Strengthen deliberate scope elimination: state what you refuse to build in v1',
        'Add a clear operational fallback plan if adoption lags initial targets'
      ],
      expertRecommendation: 'Explicitly reject custom SCIM/SAML bridges for v1. Prioritize standard OIDC to preserve 3-week shipping velocity and validate user activation first.',
      suggestedNextStep: 'find_build',
      scoreBefore: scoreBefore,
      scoreAfter: scoreAfter,
      deliveredAt: new Date().toISOString(),
      verifiedValidationBadge: true,
      recommendedResources: [
        {
          id: 'res-1',
          title: 'Strategic Scope Elimination in Enterprise Products',
          type: 'Knowledge System · Leadership Framework'
        }
      ]
    };

    this.saveRequests(requests);
    return req;
  }

  /**
   * Submit an improved iteration of the work based on feedback
   */
  public static submitPracticeImprovement(requestId: string, updatedAnswer: string): FeedbackRequest | null {
    const requests = this.getAllRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return null;

    const currentIterationCount = req.iterations?.length || 1;
    const previousScore = req.iterations?.[currentIterationCount - 1]?.score || req.context.readinessScore;
    const newScore = Math.min(98, previousScore + 5);

    const newIteration: FeedbackIteration = {
      iterationNumber: currentIterationCount + 1,
      submittedAnswer: updatedAnswer,
      score: newScore,
      date: new Date().toISOString(),
      deltaSummary: `Iteration #${currentIterationCount + 1}: +5% lift · Strategic trade-offs calibrated`
    };

    req.iterations = [...(req.iterations || []), newIteration];
    req.context.workSubmittedContent = updatedAnswer;
    req.context.readinessScore = newScore;
    if (req.expertFeedback) {
      req.expertFeedback.scoreAfter = newScore;
    }

    this.saveRequests(requests);
    return req;
  }

  /**
   * Add a follow-up question / response in the Feedback Workspace
   */
  public static sendFollowUpMessage(requestId: string, message: string): FeedbackRequest | null {
    const requests = this.getAllRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return null;

    const userMsg: FollowUpMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      content: message,
      timestamp: new Date().toISOString()
    };

    req.followUpMessages = [...(req.followUpMessages || []), userMsg];
    this.saveRequests(requests);

    // Auto-respond with simulated expert reply after brief moment
    setTimeout(() => {
      const expert = this.getExpertById(req.expertId || 'expert-sarah-chen');
      const expertReply: FollowUpMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'expert',
        senderName: expert?.name || 'Sarah Chen',
        content: `Great follow-up. Focus on proving user activation first with low-friction workflows. When sales requests enterprise exemptions, leverage the sandbox audit trail to demonstrate security compliance without custom engineering overhead.`,
        timestamp: new Date().toISOString()
      };
      const updatedReqs = this.getAllRequests();
      const targetReq = updatedReqs.find(r => r.id === requestId);
      if (targetReq) {
        targetReq.followUpMessages = [...(targetReq.followUpMessages || []), expertReply];
        this.saveRequests(updatedReqs);
      }
    }, 1200);

    return req;
  }
}
