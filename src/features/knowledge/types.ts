import { RoleCategory, SectorDomain } from '../../types';

export type EvidenceCategory =
  | 'Experience'
  | 'Projects'
  | 'Achievements'
  | 'Metrics'
  | 'Leadership'
  | 'Stakeholder'
  | 'Failures'
  | 'Conflicts'
  | 'Experiments'
  | 'Customer Insights'
  | 'Technical Decisions'
  | 'Product Decisions';

export interface EvidenceItem {
  id: string;
  title: string;
  shortSummary: string;
  category: EvidenceCategory;
  context: string;
  myRole: string;
  actions: string;
  decision: string;
  tradeoffs: string;
  outcome: string;
  metrics: string[];
  skills: string[];
  domains: (SectorDomain | string)[];
  roles: (RoleCategory | string)[];
  tags: string[];
  linkedQuestionIds: string[];
  linkedStoryIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type StoryBestFor =
  | 'Conflict'
  | 'Leadership'
  | 'Ambiguity'
  | 'Failure'
  | 'Decision Making'
  | 'Technical Architecture'
  | 'Scale'
  | 'Turnaround'
  | 'Execution Under Pressure'
  | 'Customer Insights'
  | 'Customer Impact'
  | 'Cross-functional';

export type StoryEvidenceQuality = 'Strong evidence' | 'Partial evidence' | 'Needs metrics';

export interface CandidateStory {
  id: string;
  title: string;
  evidenceId?: string;
  projectId?: string;
  projectTitle?: string;
  linkedBlueprintIds?: string[];
  bestFor: StoryBestFor[];
  relevantRoles: string[];
  skills: string[];
  metricsStatus: 'Available' | 'Missing';
  metrics: string[];
  evidenceQuality: StoryEvidenceQuality;
  synopsis: string;
  context: string;
  myRole: string;
  actions: string;
  decision: string;
  tradeoffs: string;
  outcome: string;
  linkedQuestionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type BlueprintFramework = 'STAR' | 'CAR' | 'Problem → Decision → Impact' | 'Custom';

export interface StructuredAnswerComponents {
  // STAR components
  situation?: string;
  task?: string;
  action?: string[];
  result?: string[];
  
  // CAR components
  context?: string;
  
  // Problem → Decision → Impact components
  problem?: string;
  decision?: string;
  tradeoffs?: string[];
  impact?: string[];
  
  // Universal / Custom components
  solutionAndImpact?: string; // What the candidate did, decisions/actions, impact/outcome
  openingHook?: string;
  keyCues?: string[]; // 3-4 rapid scannable prompts
  avoidCues?: string[];
  customSections?: { label: string; content: string }[];
}

export interface StructuredAnswerBlueprint {
  id: string;
  title: string;
  questionId: string;
  questionText: string;
  storyId: string;
  storyTitle: string;
  framework: BlueprintFramework;
  components: StructuredAnswerComponents;
  metrics: string[];
  targetDurationSeconds?: number;
  targetRole?: string;
  roleCategory?: RoleCategory | string;
  roleId?: string;
  targetJob?: string;
  targetCompany?: string;
  jobId?: string;
  domain?: SectorDomain | string;
  tags?: string[];
  assignedRoles?: string[]; // Canonical many-to-many interviewer role assignments
  classificationMetadata?: {
    engineConfidence?: number;
    mappedRoleIds?: string[];
    mappedJobIds?: string[];
    classifiedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type MetricCategoryType =
  | 'Scale & Volume'
  | 'Reliability & Uptime'
  | 'Cost & Revenue'
  | 'Efficiency & Latency'
  | 'Team & Velocity'
  | 'Customer Impact';

export interface MetricLedgerItem {
  id: string;
  metric: string;
  value: string;
  metricType: MetricCategoryType;
  sourceEvidenceId: string;
  sourceTitle: string;
  verificationStatus: 'Verified' | 'Estimated' | 'Needs Baseline';
  notes?: string;
}

export type ProfileKnowledgeSection = 'overview' | 'evidence' | 'stories' | 'metrics' | 'blueprints' | 'skill_evidence';

// =========================================================================
// KNOWLEDGE ACQUISITION & RESEARCH INGESTION SYSTEM ONTOLOGY
// =========================================================================

export type KnowledgeSourceType =
  | 'book'
  | 'official_guide'
  | 'academic_paper'
  | 'research'
  | 'article'
  | 'essay'
  | 'blog'
  | 'documentation'
  | 'framework'
  | 'video'
  | 'podcast'
  | 'interview'
  | 'lecture'
  | 'course'
  | 'casebook'
  | 'community'
  | 'github'
  | 'website';

export type ContentAccessMode =
  | 'public_full'
  | 'public_partial'
  | 'metadata_only'
  | 'concept_only'
  | 'external_reference'
  | 'restricted'
  | 'unavailable';

export type KnowledgeUnitType =
  | 'concept'
  | 'principle'
  | 'framework'
  | 'method'
  | 'mental_model'
  | 'definition'
  | 'practice'
  | 'workflow'
  | 'pattern'
  | 'anti_pattern'
  | 'heuristic'
  | 'metric'
  | 'question'
  | 'example';

export type KnowledgeOrigin =
  | 'source_direct'
  | 'source_derived'
  | 'careeros_synthesis'
  | 'ai_inferred';

export interface Citation {
  sourceId: string;
  sourceUrl?: string;
  author: string;
  title: string;
  publishedAt?: string;
  accessedAt: string;
  location?: string; // e.g., "Chapter 3, p. 45" or "Section: Product Goal" or "DOI: 10.1145/..."
  citationText: string;
}

export interface KnowledgeUnit {
  id: string;
  title: string;
  summary: string;
  type: KnowledgeUnitType;
  domain: string;
  subdomain?: string;
  skills: string[];
  roles: string[];
  prerequisites?: string[];
  relatedConcepts?: string[];
  conflictingConcepts?: string[];
  sources: Citation[];
  confidence: number; // 0.0 - 1.0 (e.g., 0.98)
  qualityScore: number; // 0 - 100
  provenance: string;
  officialDefinition?: string;
  careerosInterpretation?: string;
  knowledgeOrigin: KnowledgeOrigin;
  sourceAuthority: number; // 1 - 5: 5=official/original author, 4=university/academic, 3=established expert, 2=community, 1=unknown
  sourceCount: number;
  authorityWeightedConfidence?: number;
}

export interface BookTableOfContentsItem {
  chapterNumber: number;
  title: string;
  concepts: string[];
}

export interface PublicResourceReference {
  title: string;
  url: string;
  type: 'article' | 'interview' | 'talk' | 'paper' | 'guide' | 'repository' | 'video' | 'documentation' | 'essay' | 'framework' | 'lecture' | 'podcast';
  description?: string;
  authority: number;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publicationYear?: number;
  isbn?: string;
  edition?: string;
  officialUrl?: string;
  publisherUrl?: string;
  authorUrl?: string;
  domain: string;
  subdomain?: string;
  topics: string[];
  skills: string[];
  roles: string[];
  accessMode: ContentAccessMode;
  license?: string;
  redistributionAllowed: boolean;
  tableOfContents?: BookTableOfContentsItem[];
  publicResources?: PublicResourceReference[];
  provenance: string;
  summary?: string;
  extractedKnowledgeUnitIds?: string[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  doi?: string;
  publisher?: string;
  journal?: string;
  conference?: string;
  citationCount?: number;
  url: string;
  openAccess: boolean;
  topics: string[];
  concepts: string[];
  methodology?: string;
  findings?: string[];
  limitations?: string[];
  claims?: string[];
  evidence?: string[];
  implications?: string[];
  skills: string[];
  roles: string[];
  sourceAuthority: number;
  accessMode: ContentAccessMode;
  provenance: string;
}

export type ArticleClassification =
  | 'primary_source'
  | 'secondary_analysis'
  | 'commentary'
  | 'tutorial'
  | 'opinion';

export interface ArticleSource {
  id: string;
  title: string;
  author: string;
  publication: string;
  date: string;
  canonicalUrl: string;
  classification: ArticleClassification;
  summary: string;
  concepts: string[];
  claims: string[];
  examples: string[];
  frameworks: string[];
  references: string[];
  domain: string;
  skills: string[];
  roles: string[];
  sourceAuthority: number;
  accessMode: ContentAccessMode;
  provenance: string;
}

export interface CrossSourceSynthesis {
  id: string;
  title: string;
  domain: string;
  synthesizedTakeaway: string;
  participatingSources: {
    sourceName: string;
    author: string;
    coreContribution: string;
    sourceType: KnowledgeSourceType;
  }[];
  synthesizedConcepts: string[];
  relevantRoles: string[];
  relevantSkills: string[];
  knowledgeOrigin: 'careeros_synthesis';
  synthesisRationale: string;
  confidence: number;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'concept' | 'skill' | 'role' | 'source' | 'domain';
  category?: string;
  confidence?: number;
  authority?: number;
  origin?: KnowledgeOrigin;
  domain?: string;
  x?: number;
  y?: number;
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  relation: 'RELATED_TO' | 'REQUIRES' | 'USED_BY' | 'PART_OF' | 'SOURCE' | 'CORROBORATES';
  label?: string;
}
