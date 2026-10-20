export type SourceFamily =
  | 'learn'
  | 'credential'
  | 'knowledge'
  | 'experience'
  | 'project'
  | 'artifact'
  | 'content'
  | 'assessment'
  | 'playbook'
  | 'publication';

export type EvidenceStrengthLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface EvidenceStrengthDefinition {
  level: EvidenceStrengthLevel;
  name: string;
  shortLabel: string;
  description: string;
  example: string;
  colorClass: string;
  badgeBg: string;
}

export type GenericSourceStatus = 'saved' | 'in_progress' | 'completed' | 'applied' | 'archived';
export type CredentialSourceStatus = 'in_progress' | 'earned' | 'expired' | 'renewed';
export type AssessmentSourceStatus = 'planned' | 'submitted' | 'passed' | 'failed' | 'reviewed';
export type ProjectSourceStatus = 'planned' | 'active' | 'completed' | 'archived';

export type SourceStatus = 
  | GenericSourceStatus 
  | CredentialSourceStatus 
  | AssessmentSourceStatus 
  | ProjectSourceStatus;

export interface SourceTypeMetadataField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'url' | 'select' | 'tags';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  helpText?: string;
}

export interface SourceTypeConfig {
  id: string; // e.g. 'book', 'certificate', 'prd', 'product_case'
  label: string; // e.g. 'Book', 'Certificate', 'PRD / Product Spec'
  family: SourceFamily;
  defaultEvidenceStrength: EvidenceStrengthLevel;
  description: string;
  allowedStatuses: SourceStatus[];
  metadataFields: SourceTypeMetadataField[];
}

export interface SourceFamilyConfig {
  id: SourceFamily;
  label: string;
  shortDescription: string;
  iconName: string;
  defaultStrength: EvidenceStrengthLevel;
  types: SourceTypeConfig[];
}

export interface SourceAttachment {
  id: string;
  name: string;
  fileType: string;
  fileSize?: string;
  url?: string;
  uploadedAt: string;
}

export interface NormalizedSource {
  id: string;
  title: string;
  sourceFamily: SourceFamily;
  sourceType: string; // matches SourceTypeConfig.id
  description?: string;
  url?: string;
  thumbnail?: string;
  author?: string;
  organization?: string;
  provider?: string;
  dateStarted?: string;
  dateCompleted?: string;
  datePublished?: string;
  status: SourceStatus;
  language: string; // e.g. 'en', 'vi', 'ja'
  languages: string[];
  tags: string[];
  notes?: string;
  attachments: SourceAttachment[];
  externalId?: string;
  createdAt: string;
  updatedAt: string;

  // Evidence & Strength
  evidenceStrength: EvidenceStrengthLevel;

  // Extracted Knowledge & Intelligence
  inferredKnowledge: string[];
  confirmedKnowledge: string[];
  inferredSkills: string[];
  confirmedSkills: string[];
  competencies: string[];
  domains: string[];
  methods: string[];
  frameworks: string[];
  evidenceStatements: string[];
  careerRelevance: string[]; // target roles/paths

  // Multilingual canonical mapping
  canonicalMappings?: Record<string, string>; // term -> canonical ID/skill

  // Graph Relationships
  relatedProjectIds?: string[];
  relatedArtifactIds?: string[];
  relatedRoleIds?: string[];
  relatedJobIds?: string[];
  relatedSourceIds?: string[];

  // Assessment / Case Specific Data
  assessmentData?: {
    assessmentType?: string;
    score?: number | string;
    result?: 'passed' | 'failed' | 'pending' | 'exceptional' | 'top_percentile';
    evaluationDate?: string;
    relatedJobId?: string;
    relatedJobTitle?: string;
    reviewerFeedback?: string;
    submissionUrl?: string;
    skillsDemonstrated?: string[];
  };

  // Type-Specific Metadata bag
  metadata: Record<string, any>;

  // Unified Knowledge Library Model (Sections 1-6)
  assetType?: KnowledgeAssetType;
  knowledgeType?: KnowledgeType;
  knowledgeTypes?: KnowledgeType[];
  accessModel?: KnowledgeAccessModel;
  affiliateUrl?: string;
  price?: string;
  hasFullText?: boolean;
  hasReader?: boolean;
  readerContent?: {
    chapters?: { title: string; content: string }[];
    summary?: string;
  };
  publisher?: string;
  externalUrl?: string;
  createdBy?: string;
  importedFrom?: string;
  importMethod?: string;
  lastSyncedAt?: string;
  verificationStatus?: 'verified' | 'unverified' | 'community';
  relatedRoles?: string[];
  relatedRoleBlueprintIds?: string[];
  relevanceScore?: number; // 0 - 100
  recommendedFor?: string[];
  skillGapsAddressed?: string[];
  rating?: number | string;
  duration?: string;
  courseLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  certificateAvailable?: boolean;

  // Credentials & Learning Metadata
  credentialLevel?: CredentialLevel;
  learningLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Executive' | 'All Levels';
  deliveryFormat?: 'Online' | 'Hybrid' | 'In-Person' | 'Self-Paced' | 'Live Cohort';
  examRequired?: boolean;
  validityPeriod?: string;
  renewalRequirements?: string;
  institution?: string;
  qualificationType?: string;
  fieldOfStudy?: string;
  accreditation?: string;
  learningPathSequence?: Array<{
    stepNumber: number;
    title: string;
    assetType: 'Course' | 'Book' | 'Certification' | 'Certificate' | 'Framework' | 'Project' | 'Assessment';
    sourceId?: string;
    duration?: string;
    isCompleted?: boolean;
    provider?: string;
  }>;

  // Additional taxonomy tags
  industry?: string;
  functionArea?: string;
  roleCategory?: string;
  version?: string;
  seniorityLevel?: string;
  technologyStack?: string[];
}

export type CredentialLevel = 
  | 'Entry' 
  | 'Foundation' 
  | 'Professional' 
  | 'Advanced' 
  | 'Expert' 
  | 'Graduate' 
  | 'Postgraduate';

export type KnowledgeAccessModel = 
  | 'owned' 
  | 'imported' 
  | 'external' 
  | 'affiliate' 
  | 'free' 
  | 'paid' 
  | 'subscription';

export type KnowledgeAssetType = 
  | 'Certification'
  | 'Certificate'
  | 'Diploma'
  | 'Degree'
  | 'Course'
  | 'Professional Program'
  | 'Assessment'
  | 'Learning Path'
  | 'Book'
  | 'eBook'
  | 'Framework'
  | 'Playbook'
  | 'SOP'
  | 'Operating Model'
  | 'Template'
  | 'Checklist'
  | 'Best Practice'
  | 'Implementation Guide'
  | 'Industry Report'
  | 'Market Research'
  | 'Research Paper'
  | 'Article / Publication'
  | 'Company Report'
  | 'Internal Document'
  | 'Reference Material'
  | 'Professional Standard'
  | string;

export type KnowledgeType = 
  | 'Professional Credential'
  | 'Training Completion'
  | 'Formal Education'
  | 'Structured Learning'
  | 'Applied Assessment'
  | 'Learning'
  | 'Executive Education'
  | 'Domain Knowledge'
  | 'Methodology'
  | 'Framework'
  | 'Practice'
  | 'Reference'
  | 'Standard'
  | 'Tool / Platform'
  | string;

export interface SkillEvidenceItem {
  sourceId: string;
  sourceTitle: string;
  sourceFamily: SourceFamily;
  sourceType: string;
  evidenceStrength: EvidenceStrengthLevel;
  evidenceStrengthName: string;
  relationType: 'learned' | 'credentialed' | 'applied' | 'demonstrated' | 'validated';
  quoteOrStatement?: string;
  date?: string;
}

export interface SkillEvidenceProfile {
  skillName: string;
  canonicalSkillId: string;
  confidenceScore: number; // 0 - 100
  totalSourcesCount: number;
  maxStrength: EvidenceStrengthLevel;
  breakdown: {
    learningSources: number;
    credentials: number;
    projects: number;
    artifacts: number;
    assessments: number;
    experiences: number;
  };
  evidenceList: SkillEvidenceItem[];
}

export interface JobEvidenceMatchRequirement {
  skill: string;
  isPreferred?: boolean;
  requiredEvidenceStrength: EvidenceStrengthLevel;
  userEvidenceStrength: EvidenceStrengthLevel;
  userSourcesCount: number;
  status: 'strongly_proven' | 'partially_proven' | 'learned_only' | 'gap';
  supportingSources: {
    id: string;
    title: string;
    type: string;
    strength: EvidenceStrengthLevel;
  }[];
}

export interface JobEvidenceMatchReport {
  jobId: string;
  jobTitle: string;
  company: string;
  knowledgeCoverage: number; // 0 - 100 %
  applicationCoverage: number; // 0 - 100 %
  overallEvidenceStrengthAvg: number; // 0.0 - 6.0
  requirements: JobEvidenceMatchRequirement[];
  demonstratedGaps: string[];
  recommendedActions: string[];
}

export interface SuggestedRelationship {
  entityId: string;
  entityType: 'project' | 'role' | 'job' | 'skill';
  title: string;
  subtitle?: string;
  matchReason: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ReviewItem<T = string> {
  id: string;
  value: T;
  origin: 'ai_suggested' | 'user_confirmed';
  status: 'pending' | 'accepted' | 'rejected';
  canonicalId?: string;
  category?: string;
  notes?: string;
}

export interface SmartImportResult {
  inferredFamily: SourceFamily;
  inferredType: string;
  title: string;
  provider?: string;
  author?: string;
  description?: string;
  url?: string;
  detectedLanguage: string;
  detectedLanguages?: string[];
  inferredKnowledge: string[];
  inferredSkills: string[];
  competencies: string[];
  domains: string[];
  methods: string[];
  frameworks: string[];
  careerRelevance: string[];
  evidenceStrength: EvidenceStrengthLevel;
  confidence: number;
  reasoning: string;
  suggestedMetadata?: Record<string, any>;

  // Deep Evidence & Relationship Extensions
  evidenceStatements?: string[];
  detectedApplication?: {
    hasApplication: boolean;
    appliedToTarget?: string;
    description?: string;
  };
  suggestedRelationships?: SuggestedRelationship[];
  reviewItems?: {
    knowledge: ReviewItem[];
    skills: ReviewItem[];
    domains: ReviewItem[];
    methods: ReviewItem[];
    frameworks: ReviewItem[];
    evidence: ReviewItem[];
    relationships: SuggestedRelationship[];
  };
}
