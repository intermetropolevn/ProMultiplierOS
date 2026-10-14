import { RoleCategory, SectorDomain, ExperienceLevel, InterviewQuestion } from '../../../types';

export interface FlowStep {
  sequence: number;
  stepNumber: string; // "01", "02", "03"
  label: string;      // "Product Sense", "Stakeholder Conflict", "Follow-up"
  intent: string;     // Intent identifier / label
  isCompleted: boolean;
  isCurrent: boolean;
  isFollowUp?: boolean;
  relatedToIntent?: string; // e.g. "Stakeholder Conflict"
}

export interface StoredQuestionItem {
  sequence: number;
  question: string;
  intent: string;
  timestamp: number;
  isFollowUp: boolean;
  relatedToIntent?: string;
}

export interface SessionMemoryData {
  sessionId: string;
  role: string;
  sector: string;
  domain: string;
  level: string;
  currentQuestion: string;
  previousQuestions: StoredQuestionItem[];
  detectedIntents: string[];
  usedStories: string[];
  candidateTopics: string[];
  questionSequence: number;
  flowSteps: FlowStep[];
}

export class SessionMemoryService {
  private static memory: SessionMemoryData = {
    sessionId: `session-${Date.now()}`,
    role: 'Software Engineering',
    sector: 'Enterprise SaaS',
    domain: 'Enterprise SaaS',
    level: 'Senior',
    currentQuestion: 'Tell me about a time you had a significant disagreement with an engineering team.',
    previousQuestions: [
      {
        sequence: 1,
        question: 'How do you define and prioritize product goals under competing customer requirements?',
        intent: 'Product Sense',
        timestamp: Date.now() - 300000,
        isFollowUp: false,
      }
    ],
    detectedIntents: ['Product Sense', 'Stakeholder Conflict'],
    usedStories: ['CRM Migration'],
    candidateTopics: ['Product Strategy', 'Engineering Alignment', 'Trade-offs'],
    questionSequence: 2,
    flowSteps: [
      {
        sequence: 1,
        stepNumber: '01',
        label: 'Product Sense',
        intent: 'Product Sense',
        isCompleted: true,
        isCurrent: false,
      },
      {
        sequence: 2,
        stepNumber: '02',
        label: 'Stakeholder Conflict',
        intent: 'Stakeholder Conflict',
        isCompleted: false,
        isCurrent: true,
      }
    ]
  };

  private static listeners: Array<(memory: SessionMemoryData) => void> = [];

  /**
   * Get current session memory snapshot
   */
  public static getMemory(): SessionMemoryData {
    return { ...this.memory };
  }

  /**
   * Subscribe to session memory changes
   */
  public static subscribe(listener: (memory: SessionMemoryData) => void): () => void {
    this.listeners.push(listener);
    listener(this.getMemory());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notify() {
    const snap = this.getMemory();
    this.listeners.forEach(l => {
      try {
        l(snap);
      } catch (err) {
        console.error('Error in SessionMemory listener', err);
      }
    });
  }

  /**
   * Initialize or update session configuration
   */
  public static initSession(config: {
    sessionId?: string;
    role?: string;
    sector?: string;
    domain?: string;
    level?: string;
    initialQuestion?: string;
    initialIntent?: string;
  }): SessionMemoryData {
    const role = config.role || 'Software Engineering';
    const domain = config.domain || 'Enterprise SaaS';
    const level = config.level || 'Senior';

    this.memory = {
      sessionId: config.sessionId || `session-${Date.now()}`,
      role,
      sector: domain,
      domain,
      level,
      currentQuestion: config.initialQuestion || 'Tell me about a time you had a significant disagreement with an engineering team.',
      previousQuestions: [
        {
          sequence: 1,
          question: 'How do you design scalable system architectures under tight deadlines?',
          intent: 'Product Sense',
          timestamp: Date.now() - 300000,
          isFollowUp: false,
        }
      ],
      detectedIntents: ['Product Sense', config.initialIntent || 'Stakeholder Conflict'],
      usedStories: ['CRM Migration'],
      candidateTopics: ['Product Sense', 'Technical Alignment'],
      questionSequence: 2,
      flowSteps: [
        {
          sequence: 1,
          stepNumber: '01',
          label: 'Product Sense',
          intent: 'Product Sense',
          isCompleted: true,
          isCurrent: false,
        },
        {
          sequence: 2,
          stepNumber: '02',
          label: config.initialIntent || 'Stakeholder Conflict',
          intent: config.initialIntent || 'Stakeholder Conflict',
          isCompleted: false,
          isCurrent: true,
        }
      ]
    };

    this.notify();
    return this.getMemory();
  }

  /**
   * Check if an utterance is a follow-up question
   */
  public static isFollowUpQuestion(utterance: string): boolean {
    const text = utterance.toLowerCase().trim();
    if (!text) return false;

    // Direct follow-up patterns
    if (
      text.includes('differently') ||
      text.includes('what would you do differently') ||
      text.includes('if you could do it again') ||
      text.includes('looking back') ||
      text.includes('what did you learn') ||
      text.includes('how did they respond') ||
      text.includes('why did you choose that over') ||
      text.includes('elaborate on that') ||
      text.includes('go deeper') ||
      text.includes('what happened next')
    ) {
      return true;
    }

    // Short reflective follow-ups
    if (text.startsWith('why?') || text.startsWith('how so?') || text.startsWith('and then?')) {
      return true;
    }

    return false;
  }

  /**
   * Register a new question or follow-up in the session memory
   */
  public static registerQuestion(
    questionText: string,
    detectedIntent: string,
    isFollowUp = false,
    relatedToIntent?: string
  ): SessionMemoryData {
    const parentIntent = relatedToIntent || this.getActiveTopic();

    if (isFollowUp) {
      const nextSeq = this.memory.flowSteps.length + 1;
      const stepNumber = nextSeq < 10 ? `0${nextSeq}` : `${nextSeq}`;

      // Mark all previous steps as completed
      const updatedSteps = this.memory.flowSteps.map(s => ({
        ...s,
        isCompleted: true,
        isCurrent: false,
      }));

      // Add follow-up step
      updatedSteps.push({
        sequence: nextSeq,
        stepNumber,
        label: 'Follow-up',
        intent: 'Follow-up',
        isCompleted: false,
        isCurrent: true,
        isFollowUp: true,
        relatedToIntent: parentIntent,
      });

      this.memory.previousQuestions.push({
        sequence: this.memory.questionSequence,
        question: this.memory.currentQuestion,
        intent: parentIntent,
        timestamp: Date.now(),
        isFollowUp: false,
      });

      this.memory.currentQuestion = questionText;
      this.memory.questionSequence = nextSeq;
      this.memory.flowSteps = updatedSteps;
      if (!this.memory.detectedIntents.includes('Follow-up')) {
        this.memory.detectedIntents.push('Follow-up');
      }
    } else {
      // Normal new question
      const nextSeq = this.memory.flowSteps.length + 1;
      const stepNumber = nextSeq < 10 ? `0${nextSeq}` : `${nextSeq}`;

      const updatedSteps = this.memory.flowSteps.map(s => ({
        ...s,
        isCompleted: true,
        isCurrent: false,
      }));

      const cleanLabel = this.cleanIntentLabel(detectedIntent);

      updatedSteps.push({
        sequence: nextSeq,
        stepNumber,
        label: cleanLabel,
        intent: cleanLabel,
        isCompleted: false,
        isCurrent: true,
        isFollowUp: false,
      });

      this.memory.previousQuestions.push({
        sequence: this.memory.questionSequence,
        question: this.memory.currentQuestion,
        intent: this.getActiveTopic(),
        timestamp: Date.now(),
        isFollowUp: false,
      });

      this.memory.currentQuestion = questionText;
      this.memory.questionSequence = nextSeq;
      this.memory.flowSteps = updatedSteps;
      if (!this.memory.detectedIntents.includes(cleanLabel)) {
        this.memory.detectedIntents.push(cleanLabel);
      }
    }

    this.notify();
    return this.getMemory();
  }

  /**
   * Set current active question when candidate or room advances
   */
  public static setActiveQuestionFromRoom(question: InterviewQuestion, index: number) {
    const cleanLabel = this.cleanIntentLabel(
      question.type === 'Behavioral (STAR)' ? 'Stakeholder Conflict' : question.type
    );

    // If starting or on index 0
    if (index === 0) {
      this.memory.flowSteps = [
        {
          sequence: 1,
          stepNumber: '01',
          label: cleanLabel,
          intent: cleanLabel,
          isCompleted: false,
          isCurrent: true,
        }
      ];
      this.memory.currentQuestion = question.question;
      this.memory.questionSequence = 1;
      this.memory.detectedIntents = [cleanLabel];
    } else {
      // Ensure step 01 (Product Sense) and step 02 (Stakeholder Conflict) are preserved in flow
      const steps: FlowStep[] = [
        {
          sequence: 1,
          stepNumber: '01',
          label: 'Product Sense',
          intent: 'Product Sense',
          isCompleted: true,
          isCurrent: false,
        },
        {
          sequence: 2,
          stepNumber: '02',
          label: cleanLabel,
          intent: cleanLabel,
          isCompleted: false,
          isCurrent: true,
        }
      ];

      this.memory.flowSteps = steps;
      this.memory.currentQuestion = question.question;
      this.memory.questionSequence = 2;
      this.memory.detectedIntents = ['Product Sense', cleanLabel];
    }

    this.notify();
  }

  /**
   * Helper to get active topic label (e.g. "Stakeholder Conflict")
   */
  public static getActiveTopic(): string {
    const current = this.memory.flowSteps.find(s => s.isCurrent);
    if (current) {
      if (current.isFollowUp && current.relatedToIntent) {
        return current.relatedToIntent;
      }
      return current.label;
    }
    return 'Stakeholder Conflict';
  }

  /**
   * Record a story that was used by candidate
   */
  public static recordUsedStory(storyTitle: string) {
    if (!this.memory.usedStories.includes(storyTitle)) {
      this.memory.usedStories.push(storyTitle);
      this.notify();
    }
  }

  private static cleanIntentLabel(intent: string): string {
    if (!intent) return 'Stakeholder Conflict';
    const lower = intent.toLowerCase();
    if (lower.includes('conflict') || lower.includes('disagree')) return 'Stakeholder Conflict';
    if (lower.includes('product sense') || lower.includes('product')) return 'Product Sense';
    if (lower.includes('ambiguity') || lower.includes('decision')) return 'Decision Under Ambiguity';
    if (lower.includes('system') || lower.includes('technical')) return 'System Architecture';
    return intent.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
