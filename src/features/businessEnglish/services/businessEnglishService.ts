// =========================================================================
// CAREER OS - BUSINESS ENGLISH INTELLIGENCE & EVALUATION SERVICE
// =========================================================================

import { 
  BusinessEnglishScenario, 
  RolePlayMessage, 
  RolePlaySessionFeedback, 
  UserVocabularySet, 
  ShadowSpeakingLesson,
  ShadowSpeakingLine,
  PracticeDifficulty
} from '../types';
import { 
  SEED_SCENARIOS, 
  SEED_VOCABULARY, 
  INITIAL_USER_VOCABULARY_SETS, 
  SEED_SHADOW_LESSONS, 
  SEED_TOPICS, 
  SEED_DOMAIN_CONCEPTS, 
  SEED_COMMUNICATION_PATTERNS 
} from '../data/businessEnglishData';

const BIZ_STORAGE_KEYS = {
  VOCAB_SETS: 'career_os_biz_vocab_sets_v1',
  COMPLETED_SESSIONS: 'career_os_biz_sessions_v1',
  BOOKMARKED_VOCAB: 'career_os_biz_bookmarks_v1',
  RECENT_PRACTICED_TOPICS: 'career_os_biz_topics_v1'
};

export const BusinessEnglishService = {
  // -----------------------------------------------------------------------
  // 1. DATA ACCESS & RETRIEVAL
  // -----------------------------------------------------------------------
  getScenarios(): BusinessEnglishScenario[] {
    return SEED_SCENARIOS;
  },

  getScenarioById(id: string): BusinessEnglishScenario | undefined {
    return SEED_SCENARIOS.find(s => s.id === id);
  },

  getVocabularyItems() {
    return SEED_VOCABULARY;
  },

  getShadowLessons(): ShadowSpeakingLesson[] {
    return SEED_SHADOW_LESSONS;
  },

  getTopics() {
    return SEED_TOPICS;
  },

  getDomainConcepts() {
    return SEED_DOMAIN_CONCEPTS;
  },

  getCommunicationPatterns() {
    return SEED_COMMUNICATION_PATTERNS;
  },

  // -----------------------------------------------------------------------
  // 2. USER VOCABULARY SET PERSISTENCE & GENERATION
  // -----------------------------------------------------------------------
  getUserVocabularySets(): UserVocabularySet[] {
    try {
      const stored = localStorage.getItem(BIZ_STORAGE_KEYS.VOCAB_SETS);
      if (!stored) {
        localStorage.setItem(BIZ_STORAGE_KEYS.VOCAB_SETS, JSON.stringify(INITIAL_USER_VOCABULARY_SETS));
        return INITIAL_USER_VOCABULARY_SETS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_USER_VOCABULARY_SETS;
    }
  },

  saveUserVocabularySet(vocabSet: UserVocabularySet): UserVocabularySet[] {
    const list = this.getUserVocabularySets();
    const existingIndex = list.findIndex(s => s.id === vocabSet.id);
    if (existingIndex >= 0) {
      list[existingIndex] = vocabSet;
    } else {
      list.unshift(vocabSet);
    }
    localStorage.setItem(BIZ_STORAGE_KEYS.VOCAB_SETS, JSON.stringify(list));
    return list;
  },

  deleteUserVocabularySet(setId: string): UserVocabularySet[] {
    const list = this.getUserVocabularySets().filter(s => s.id !== setId);
    localStorage.setItem(BIZ_STORAGE_KEYS.VOCAB_SETS, JSON.stringify(list));
    return list;
  },

  /**
   * AI-generated context-aware sentence samples and workplace dialogue
   */
  generateContextAwareSetContent(title: string, terms: string[], domainTag: string): {
    exampleSentences: { term: string; sentence: string; context: string }[];
    generatedDialogue: { speaker: string; role: string; text: string; highlightedTerms: string[] }[];
  } {
    const cleanedTerms = terms.map(t => t.trim()).filter(Boolean);

    // Dynamic contextual templates based on term semantic markers
    const exampleSentences = cleanedTerms.map(term => {
      const lower = term.toLowerCase();
      let sample = `We should prioritize ${term} during our next sprint planning session.`;
      let context = 'Sprint Planning Sync';

      if (lower.includes('align') || lower.includes('stakeholder') || lower.includes('buy-in')) {
        sample = `We need to secure ${term} before sharing the updated release timeline with executive leadership.`;
        context = 'Cross-functional Executive Review';
      } else if (lower.includes('creep') || lower.includes('scope') || lower.includes('backlog')) {
        sample = `To prevent ${term}, our team agreed to defer non-critical customer requests to Phase 2.`;
        context = 'Project Scope Governance';
      } else if (lower.includes('trade') || lower.includes('risk') || lower.includes('debt')) {
        sample = `Let's make the ${term} explicit: shipping faster now versus dedicating a sprint to architectural resilience.`;
        context = 'Architecture Review Board';
      } else if (lower.includes('push') || lower.includes('boundary') || lower.includes('priority')) {
        sample = `It's healthy to ${term} when incoming ad-hoc deliverables threaten our core delivery commitments.`;
        context = 'Resource Capacity Planning';
      } else if (lower.includes('metric') || lower.includes('nrr') || lower.includes('cac') || lower.includes('revenue')) {
        sample = `Improving our ${term} directly strengthens our commercial defensibility and unit economics.`;
        context = 'Quarterly Business Review (QBR)';
      } else if (lower.includes('guardrail') || lower.includes('sla') || lower.includes('test')) {
        sample = `Automated ${term} give our development squads confidence to ship multiple times per day.`;
        context = 'Engineering Operations & CI/CD';
      }

      return {
        term,
        sentence: sample,
        context
      };
    });

    // Workplace dialogue generation connecting user terms
    const partnerRole = domainTag.includes('Eng') ? 'Engineering Manager' : 'Product Lead';
    const firstTerm = cleanedTerms[0] || 'strategic alignment';
    const secondTerm = cleanedTerms[1] || 'scope creep';
    const thirdTerm = cleanedTerms[2] || 'trade-offs';

    const generatedDialogue = [
      {
        speaker: 'Partner (Manager)',
        role: partnerRole,
        text: `Given the aggressive Q4 deadlines, how do you suggest we approach ${firstTerm} across our squads?`,
        highlightedTerms: [firstTerm]
      },
      {
        speaker: 'You (Professional)',
        role: 'You',
        text: `I'd recommend establishing clear guardrails early to prevent ${secondTerm}. By making our ${thirdTerm} transparent, we protect our delivery commitments and maintain high execution quality.`,
        highlightedTerms: [secondTerm, thirdTerm]
      }
    ];

    return {
      exampleSentences,
      generatedDialogue
    };
  },

  // -----------------------------------------------------------------------
  // 3. DYNAMIC ROLE-PLAY SIMULATION ENGINE
  // -----------------------------------------------------------------------
  generatePartnerReply(
    scenario: BusinessEnglishScenario,
    conversationHistory: RolePlayMessage[],
    userMessageText: string
  ): {
    replyText: string;
    coachingFeedback: {
      strength: string;
      suggestion: string;
      betterPhrasing: string;
    };
  } {
    const userTurnCount = conversationHistory.filter(m => m.sender === 'user').length + 1;
    const lower = userMessageText.toLowerCase();

    // Check for high-signal phrases
    const hasDataOrMetric = /\d+%|\d+\s*(days|weeks|months|dollars|k|m)/i.test(userMessageText);
    const hasSoftening = /(from my perspective|i recommend|could we consider|what if we|based on the data)/i.test(lower);
    const isTooBrief = userMessageText.trim().split(/\s+/).length < 10;

    let replyText = "";
    let strength = "Clear direct response.";
    let suggestion = "Consider offering concrete alternatives.";
    let betterPhrasing = userMessageText;

    // Craft contextual replies based on turn count and scenario type
    if (scenario.id === 'sc-first-day-onboarding') {
      if (userTurnCount === 1) {
        replyText = "That's a fantastic background! Your experience with distributed systems will be super valuable for our checkout migration. What questions do you have about our sprint cadence or how we run standups?";
        strength = "Friendly and welcoming tone.";
        suggestion = "Inquire about documentation or immediate 30-day onboarding milestones.";
        betterPhrasing = "Thank you! I'm thrilled to be here. Over my first few weeks, I'd love to understand our team's immediate sprint priorities and how we coordinate cross-functional releases.";
      } else {
        replyText = "Great questions. We run two-week sprints with async daily check-ins on Slack and bi-weekly retros. I'll pair you with David for your first PR review tomorrow so you can get familiar with our CI pipelines!";
        strength = "Proactive engagement and active listening.";
        suggestion = "Summarize your next steps to confirm alignment.";
        betterPhrasing = "Sounds like a solid rhythm. I'll connect with David first thing tomorrow and review the onboarding architecture docs in the meantime.";
      }
    } else if (scenario.id === 'sc-weekly-project-update') {
      if (userTurnCount === 1) {
        replyText = "Thanks for the update. You mentioned awaiting security sign-off—if that gets pushed past Thursday, what is our contingency plan so we don't block the frontend squad?";
        strength = "Structured milestone delivery.";
        suggestion = "State an explicit mitigation path (e.g. mock API stubs or phased staging).";
        betterPhrasing = "On the security sign-off: if approval is delayed past Thursday, we'll unblock frontend integration by deploying stubbed sandbox endpoints in staging.";
      } else {
        replyText = "That mitigation makes complete sense. Let's document that in the sprint board so stakeholders have full visibility. Anything else blocking the team?";
        strength = "Clear risk mitigation plan.";
        suggestion = "Wrap up with a confident closing summary.";
        betterPhrasing = "No other blockers on our end. We're fully aligned and will keep you updated in the standup channel.";
      }
    } else if (scenario.id === 'sc-disagreeing-professionally') {
      if (userTurnCount === 1) {
        replyText = "I see your point about operational overhead, but if we don't modularize now, won't our monolithic repo become an even bigger bottleneck as we hire 10 more engineers next quarter?";
        strength = "Professional acknowledgement of the opposing view.";
        suggestion = "Propose a phased approach or benchmark experiment.";
        betterPhrasing = "I share your concern about scaling team headcount. Perhaps we could pilot micro-frontends on a single internal dashboard first, benchmark build and CI times, and evaluate before committing our main client repos.";
      } else {
        replyText = "A pilot on the internal dashboard sounds like a very pragmatic compromise. Let's draft a 2-page RFC detailing the evaluation criteria and review it on Friday.";
        strength = "Constructive compromise achieved without confrontation.";
        suggestion = "Commit to the next milestone and assign ownership.";
        betterPhrasing = "Agreed. I will draft the two-page RFC by Thursday afternoon and tag you for feedback before the review.";
      }
    } else {
      // General workplace response engine
      if (isTooBrief) {
        replyText = `Understood. Could you expand on that with a bit more detail regarding the timeline and who on the team is leading the effort?`;
        strength = "Direct and concise.";
        suggestion = "Elaborate with business rationale and timeline to sound more senior.";
        betterPhrasing = `To provide more context: our primary focus is ensuring stability, and we anticipate having initial deliverables ready by mid-next sprint.`;
      } else if (hasSoftening) {
        replyText = `I appreciate your thoughtful approach. That gives us a clear path forward. How do you plan to communicate this to the rest of the stakeholders?`;
        strength = "Diplomatic and collaborative tone.";
        suggestion = "Use an executive summary format (BLUF) when cascading updates.";
        betterPhrasing = `I will share a brief async memo highlighting our key trade-offs and next steps so all cross-functional partners remain aligned.`;
      } else {
        replyText = `Thanks for walking through that. What do you see as the biggest potential risk to this plan, and how are we mitigating it?`;
        strength = "Covers key operational points.";
        suggestion = "Tie your answer back to risk management and business impact.";
        betterPhrasing = `The main operational risk is API latency under peak traffic, which we are proactively mitigating through automated caching and load testing.`;
      }
    }

    return {
      replyText,
      coachingFeedback: {
        strength,
        suggestion,
        betterPhrasing
      }
    };
  },

  // -----------------------------------------------------------------------
  // 4. POST-SESSION COMPREHENSIVE EVALUATION ENGINE
  // -----------------------------------------------------------------------
  evaluateRolePlaySession(
    scenario: BusinessEnglishScenario,
    messages: RolePlayMessage[]
  ): RolePlaySessionFeedback {
    const userMessages = messages.filter(m => m.sender === 'user');
    const totalWords = userMessages.reduce((sum, m) => sum + m.text.trim().split(/\s+/).length, 0);
    const avgWordsPerTurn = userMessages.length > 0 ? Math.round(totalWords / userMessages.length) : 0;

    const allUserText = userMessages.map(m => m.text).join(' ').toLowerCase();

    // Check vocabulary matching
    const businessTerms = [
      'stakeholder', 'alignment', 'trade-off', 'bandwidth', 'scope', 'milestone',
      'mitigate', 'propose', 'recommend', 'bottleneck', 'bluf', 'deliverable',
      'priority', 'objective', 'cadence', 'transparent', 'contingency', 'roi'
    ];
    const matchedTerms = businessTerms.filter(term => allUserText.includes(term));
    const vocabScore = Math.min(98, Math.max(65, 60 + matchedTerms.length * 6));

    // Tone & structure markers
    const hasPoliteOpeners = /(i understand|from my perspective|thanks for|could we|what if)/i.test(allUserText);
    const toneScore = hasPoliteOpeners ? 92 : 78;
    const clarityScore = avgWordsPerTurn >= 15 && avgWordsPerTurn <= 60 ? 94 : 80;
    const confidenceScore = /(i recommend|our plan is|we have mitigated|we achieved)/i.test(allUserText) ? 90 : 76;
    const domainScore = Math.min(96, Math.max(70, 75 + matchedTerms.length * 4));

    const overallScore = Math.round(
      (vocabScore * 0.25) +
      (toneScore * 0.2) +
      (clarityScore * 0.2) +
      (confidenceScore * 0.2) +
      (domainScore * 0.15)
    );

    // In-context alternatives
    const inContextAlternatives = [
      {
        original: userMessages[0]?.text.slice(0, 80) || "I don't think we can do that right now.",
        improved: "Based on our current sprint commitments, taking this on introduces significant delivery risk. I'd recommend we phase this into our next milestone.",
        why: "Replaces flat refusal with objective capacity constraints and a constructive phased release.",
        toneCategory: 'Senior Executive' as const
      },
      {
        original: userMessages[1]?.text.slice(0, 80) || "We are working on the bug fixes today.",
        improved: "Our primary focus today is resolving the high-priority edge-case defects in staging, keeping us on track for Friday's code freeze.",
        why: "Adds specificity, business impact, and milestone anchoring.",
        toneCategory: 'More Natural' as const
      }
    ];

    return {
      id: `biz-sess-${Date.now()}`,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      completedAt: new Date().toISOString(),
      overallScore,
      metrics: {
        englishAccuracy: Math.min(96, Math.max(82, overallScore + 2)),
        naturalness: Math.min(95, Math.max(78, overallScore - 1)),
        businessVocabulary: vocabScore,
        clarityConciseness: clarityScore,
        professionalTone: toneScore,
        confidenceAssertiveness: confidenceScore,
        communicationEffectiveness: overallScore,
        domainTerminology: domainScore
      },
      strengths: [
        "Structured responses with clear communication of intent.",
        `Actively integrated ${matchedTerms.length} high-leverage workplace terms (${matchedTerms.slice(0, 3).join(', ')}).`,
        "Professional and collaborative interpersonal tone."
      ],
      improvementAreas: [
        "Use Bottom Line Up Front (BLUF) to state conclusions before secondary context.",
        "Ground recommendations in concrete business impact (e.g. sprint velocity, customer SLA).",
        "Practice using softening modal verbs ('would recommend', 'could explore') when offering counter-proposals."
      ],
      inContextAlternatives,
      coachSummary: `Strong conversational calibration in '${scenario.title}'. Your pacing and clarity were solid. Focusing on explicit trade-offs and senior framing will make your updates even more compelling in executive settings.`,
      recommendedNextTopics: [
        'Pushing Back on Scope Requests',
        'Explaining Technical Trade-offs to Non-Tech Leaders',
        'Executive Status Briefings'
      ]
    };
  },

  // -----------------------------------------------------------------------
  // 5. SHADOW SPEAKING ANALYSIS
  // -----------------------------------------------------------------------
  analyzeShadowAttempt(line: ShadowSpeakingLine, spokenWordsCount: number): {
    accuracyScore: number;
    fluencyScore: number;
    rhythmScore: number;
    phoneticsFeedback: string;
    tips: string[];
  } {
    const targetWords = line.text.split(/\s+/).length;
    const ratio = Math.min(1, spokenWordsCount / targetWords);
    const accuracyScore = Math.round(75 + ratio * 20);
    const fluencyScore = Math.round(78 + Math.random() * 15);
    const rhythmScore = Math.round(82 + Math.random() * 12);

    return {
      accuracyScore,
      fluencyScore,
      rhythmScore,
      phoneticsFeedback: line.phoneticsHint || "Focus on natural word blending and downward pitch cadence at clause boundaries.",
      tips: [
        `Stress the high-leverage words: ${line.stressWords.join(', ')}.`,
        `Pause naturally ${line.pausePoints[0] || 'between clauses'}.`,
        "Keep vocal pitch steady without trailing off at the end of statements."
      ]
    };
  },

  // -----------------------------------------------------------------------
  // 6. TEXT-TO-SPEECH (TTS) AUDIO SYNTHESIS HELPER
  // -----------------------------------------------------------------------
  speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Slightly measured for clear professional cadence
    utterance.pitch = 1.0;

    // Pick English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  },

  stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
};
