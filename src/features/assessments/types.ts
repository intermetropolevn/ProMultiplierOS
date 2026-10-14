import { RoleCategory } from '../../types';
import { EvidenceStrengthLevel } from '../sources/types';

export type AssessmentStage = 
  | 'prompt_received' 
  | 'in_progress' 
  | 'submitted' 
  | 'evaluated' 
  | 'converted_to_evidence';

export type AssessmentResult = 
  | 'passed' 
  | 'advanced' 
  | 'offer' 
  | 'top_tier' 
  | 'completed' 
  | 'rejected' 
  | 'failed'
  | 'pending'
  | 'withdrawn';

export interface AssessmentAttachment {
  id: string;
  name: string;
  size?: string;
  type: string; // 'PDF' | 'Figma' | 'Deck' | 'Spreadsheet' | 'Doc' | 'Code' | 'Video'
  url?: string;
}

export interface DemonstratedSkillItem {
  skillName: string;
  canonicalId?: string;
  level: number; // 1-6 (typically 5: Demonstrated, or 6: Validated)
  proofStatement: string;
}

export interface AssessmentRubricScore {
  criterion: string;
  score: number;
  maxScore: number;
  weightPercent?: number;
  comments?: string;
}

export interface AssessmentSubmission {
  id: string;
  submittedAt?: string;
  version: number;
  content: string; // The candidate's draft, proposal, executive summary, or answers
  url?: string; // Figma, Loom video, GitHub repo, Google Drive deck, live demo URL
  attachments: AssessmentAttachment[];
}

export interface AssessmentEvaluation {
  evaluatedAt?: string;
  evaluatorName?: string;
  evaluatorRole?: string; // e.g. "Hiring Committee", "VP of Product", "Lead Architect"
  score?: string | number; // e.g. "94/100", "Top 5%", 94, "A+"
  ratingTier?: 'Exceptional' | 'Strong' | 'Competent' | 'Needs Improvement';
  feedback?: string;
  result: AssessmentResult;
  rubricPerformance?: AssessmentRubricScore[];
}

export interface ReusableCareerOutputs {
  profileStatement?: string;
  skillIntelligenceProof?: string;
  jobMatchBoost?: string;
  interviewStory?: {
    situation: string;
    task: string;
    action: string;
    result: string;
    practicePrompt: string;
  };
  portfolioHighlight?: string;
  careerNarrativeBullet?: string;
}

/**
 * First-Class Job Assessment / Case Entity
 * Relationship:
 * Job → Assessment → Case → Submission → Evaluation → Demonstrated Skills → Evidence
 */
export interface JobAssessment {
  id: string;
  jobId?: string; // Links to JobListing or JobApplication
  jobTitle: string;
  company: string;
  companyLogo?: string;
  role: string;
  roleCategory: RoleCategory | string;
  assessmentType: string; // e.g., 'Product Case', 'GTM Challenge', 'Design Challenge', 'Prototype Submission', 'SEO Audit', 'Audit Report', 'Growth Case', 'Strategy Deck'
  title: string;
  deadline?: string;
  stage: AssessmentStage;
  createdAt: string;
  updatedAt: string;

  // Case Definition (Problem space, instructions, constraints)
  casePrompt: string;
  caseContext?: string;
  constraints?: string[];
  deliverablesExpected?: string[];
  exhibits?: {
    id: string;
    title: string;
    type: string;
    preview?: string;
  }[];

  // Submission (Candidate's work, deliverables, attachments, URLs)
  submission: AssessmentSubmission;

  // Evaluation (External/Company or Structured self-evaluation)
  evaluation?: AssessmentEvaluation;

  // Demonstrated Skills (Capabilities proven during this evaluation event)
  skillsDemonstrated: DemonstratedSkillItem[];

  // Lessons Learned & Retrospective
  lessonsLearned: string;
  whatWentWell?: string;
  whatToImprove?: string;

  // Evidence System Linkage
  convertedEvidenceId?: string; // References NormalizedSource.id in SourceStore
  convertedAt?: string;
  evidenceStrength?: EvidenceStrengthLevel; // Typically L5 (Demonstrated) or L6 (Validated)

  // Reusable multi-system career intelligence outputs
  reusableOutputs?: ReusableCareerOutputs;
}
