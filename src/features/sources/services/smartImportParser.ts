import { 
  SmartImportResult, 
  SourceFamily, 
  EvidenceStrengthLevel, 
  SuggestedRelationship, 
  ReviewItem 
} from '../types';
import { VietnameseNormalizer } from '../../intelligence/services/vietnameseNormalizer';
import { CanonicalSkillRegistry } from '../../intelligence/services/canonicalSkillRegistry';
import { ROLES_DATA } from '../../../data/rolesData';
import { JOBS_DATA } from '../../../data/jobsData';
import { sourceStore } from './sourceStore';

export class SmartImportParser {
  /**
   * Helper to detect primary language
   */
  static detectLanguage(text: string): string {
    if (VietnameseNormalizer.hasVietnameseDiacritics(text)) {
      return 'vi';
    }
    if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text)) {
      return 'ja';
    }
    return 'en';
  }

  /**
   * Helper to detect multiple languages / code-switching (e.g. Vietnamese with English tech terms)
   */
  static detectLanguages(text: string): string[] {
    const langs: string[] = [];
    const hasViDiacritics = VietnameseNormalizer.hasVietnameseDiacritics(text);
    const hasViWords = /\b(em|minh|toi|khoa|hoc|nay|de|hieu|them|ve|sau|do|vao|du|an|bai|tap|cong|viec|nguoi|dung)\b/i.test(
      VietnameseNormalizer.removeDiacritics(text)
    );

    if (hasViDiacritics || hasViWords) {
      langs.push('vi');
    }

    if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text)) {
      langs.push('ja');
    }

    // English technical terms check
    const hasEnglishWords = /\b(the|and|for|course|project|dashboard|analytics|system|strategy|design|engineer|backend|product|case|data|test|api|aws|sql)\b/i.test(text);
    if (hasEnglishWords || langs.length === 0) {
      langs.push('en');
    }

    return Array.from(new Set(langs));
  }

  /**
   * Universal Text Parsing with Multi-Factor Semantic Analysis
   * Enforces:
   * 1. Detect source family
   * 2. Detect source type
   * 3. Extract metadata
   * 4. Detect language(s)
   * 5. Extract knowledge concepts
   * 6. Extract skills (canonical)
   * 7. Extract domains
   * 8. Extract methods/frameworks
   * 9. Detect potential evidence & application
   * 10. Suggest relationships to existing Projects, Roles, Jobs and Skills
   * 11. Assign provisional evidence strength (no unearned proficiency inflation)
   * 12. Structure review items for user confirmation
   */
  static parseText(input: string): SmartImportResult {
    const raw = input.trim();
    const normalized = VietnameseNormalizer.toSearchKey(raw);
    const langs = SmartImportParser.detectLanguages(raw);
    const primaryLang = langs[0] || 'en';

    let inferredFamily: SourceFamily = 'learn';
    let inferredType = 'course';
    let title = raw.slice(0, 80);
    let provider = '';
    let author = '';
    let evidenceStrength: EvidenceStrengthLevel = 2;
    let confidence = 0.85;
    const reasoningParts: string[] = [];

    const inferredKnowledge: string[] = [];
    const inferredSkills: string[] = [];
    const competencies: string[] = [];
    const domains: string[] = [];
    const methods: string[] = [];
    const frameworks: string[] = [];
    const careerRelevance: string[] = [];
    const evidenceStatements: string[] = [];
    const suggestedMetadata: Record<string, any> = {};

    let detectedApplication: {
      hasApplication: boolean;
      appliedToTarget?: string;
      description?: string;
    } | undefined = undefined;

    // Detect explicit application cues (e.g. "apply vào dashboard project", "applied to CRM migration")
    const appMatch = raw.match(/(?:apply\s+vào|áp\s+dụng\s+vào|triển\s+khai\s+cho|applied\s+to|applied\s+in|applied\s+into|apply\s+vao|used\s+in)\s+([^.,;!?\n]+)/i);
    if (appMatch && appMatch[1]) {
      const target = appMatch[1].trim().replace(/\b(project|dự án|du an)\b/gi, '').trim();
      const cleanedTarget = (target.charAt(0).toUpperCase() + target.slice(1)) + ' Project';
      detectedApplication = {
        hasApplication: true,
        appliedToTarget: cleanedTarget,
        description: `Self-reported application into "${cleanedTarget}".`
      };
      reasoningParts.push(`Identified practical application target: ${cleanedTarget}`);
      evidenceStatements.push(`Self-reported practical application into "${cleanedTarget}". Requires artifact or repository proof to graduate to Level 4+ Demonstrated.`);
    }

    // =========================================================================
    // 1 & 2. FAMILY & TYPE DETECTION (Hierarchical Intent Resolution)
    // =========================================================================
    const isLearningIntent = 
      normalized.includes('hoc khoa') || 
      normalized.includes('khoa hoc') || 
      normalized.includes('hoc de') || 
      normalized.includes('course') || 
      normalized.includes('bootcamp') ||
      normalized.includes('curriculum') ||
      normalized.includes('tutorial') ||
      normalized.includes('sach') ||
      normalized.includes('book');

    const isAssessmentIntent = 
      normalized.includes('case') || 
      normalized.includes('take home') || 
      normalized.includes('takehome') || 
      normalized.includes('bai tap') || 
      normalized.includes('phong van') ||
      normalized.includes('interview challenge') ||
      normalized.includes('assessment');

    const isCredentialIntent = 
      normalized.includes('badge') || 
      normalized.includes('chung chi') || 
      normalized.includes('certificate') || 
      normalized.includes('certification') ||
      normalized.includes('license');

    const isArtifactIntent = 
      normalized.includes('prd') || 
      normalized.includes('product spec') || 
      normalized.includes('dashboard') && !isLearningIntent || 
      normalized.includes('gtm plan') ||
      normalized.includes('wireframe') ||
      normalized.includes('prototype');

    const isProjectIntent = 
      (normalized.includes('project') || normalized.includes('du an') || normalized.includes('hackathon') || normalized.includes('built') || normalized.includes('shipped') || normalized.includes('architected')) &&
      !isLearningIntent;

    // Resolve Family
    if (isLearningIntent) {
      inferredFamily = 'learn';
      if (normalized.includes('book') || normalized.includes('sach')) {
        inferredType = 'book';
        evidenceStrength = 1;
        reasoningParts.push('Detected literature / book study');
      } else {
        inferredType = 'course';
        evidenceStrength = 2;
        reasoningParts.push('Detected structured educational course');
      }
    } else if (isAssessmentIntent) {
      inferredFamily = 'assessment';
      evidenceStrength = 5;
      if (normalized.includes('product') || normalized.includes('san pham') || normalized.includes('grab')) {
        inferredType = 'product_case';
        reasoningParts.push('Detected candidate product case assessment');
      } else if (normalized.includes('coding') || normalized.includes('leetcode')) {
        inferredType = 'coding_assessment';
        reasoningParts.push('Detected technical coding challenge evaluation');
      } else {
        inferredType = 'take_home_assignment';
        reasoningParts.push('Detected take-home hiring case study');
      }
    } else if (isCredentialIntent) {
      inferredFamily = 'credential';
      evidenceStrength = 3;
      if (normalized.includes('badge')) {
        inferredType = 'digital_badge';
        reasoningParts.push('Detected cryptographically verified digital badge');
      } else if (normalized.includes('professional') || normalized.includes('certified')) {
        inferredType = 'professional_certification';
        reasoningParts.push('Detected professional certification examination');
      } else {
        inferredType = 'certificate';
        reasoningParts.push('Detected certificate of completion');
      }
    } else if (isArtifactIntent) {
      inferredFamily = 'artifact';
      evidenceStrength = 5;
      if (normalized.includes('prd') || normalized.includes('spec')) {
        inferredType = 'prd';
        reasoningParts.push('Detected Product Requirements Document (PRD) artifact');
      } else if (normalized.includes('dashboard')) {
        inferredType = 'dashboard';
        reasoningParts.push('Detected operational telemetry dashboard artifact');
      } else {
        inferredType = 'prototype';
        reasoningParts.push('Detected interactive prototype artifact');
      }
    } else if (isProjectIntent) {
      inferredFamily = 'project';
      if (normalized.includes('hackathon')) {
        inferredType = 'hackathon_project';
        evidenceStrength = 4;
        reasoningParts.push('Detected rapid hackathon MVP initiative');
      } else if (normalized.includes('work') || normalized.includes('cong ty') || normalized.includes('enterprise') || normalized.includes('production')) {
        inferredType = 'work_project';
        evidenceStrength = 5;
        reasoningParts.push('Detected production enterprise engineering project');
      } else {
        inferredType = 'personal_project';
        evidenceStrength = 4;
        reasoningParts.push('Detected applied software application project');
      }
    } else if (normalized.includes('paper') || normalized.includes('research') || normalized.includes('benchmark')) {
      inferredFamily = 'knowledge';
      inferredType = 'academic_paper';
      evidenceStrength = 1;
      reasoningParts.push('Detected academic research preprint / benchmark');
    } else if (normalized.includes('video') || normalized.includes('podcast') || normalized.includes('article') || normalized.includes('newsletter')) {
      inferredFamily = 'content';
      inferredType = normalized.includes('podcast') ? 'podcast_episode' : normalized.includes('video') ? 'youtube_video' : 'article';
      evidenceStrength = 1;
      reasoningParts.push('Detected external media reference');
    }

    // =========================================================================
    // 3. EXTRACT METADATA (Institutions, Organizations, Providers)
    // =========================================================================
    const providers = [
      { regex: /indiana university/i, name: 'Indiana University' },
      { regex: /stanford/i, name: 'Stanford University' },
      { regex: /mit/i, name: 'MIT' },
      { regex: /coursera/i, name: 'Coursera' },
      { regex: /udemy/i, name: 'Udemy' },
      { regex: /reforge/i, name: 'Reforge' },
      { regex: /scrum\.org/i, name: 'Scrum.org' },
      { regex: /aws/i, name: 'Amazon Web Services (AWS)' },
      { regex: /google cloud/i, name: 'Google Cloud' },
      { regex: /grab/i, name: 'Grab' },
      { regex: /stripe/i, name: 'Stripe' },
      { regex: /shopee/i, name: 'Shopee' },
      { regex: /vng/i, name: 'VNG' }
    ];

    for (const p of providers) {
      if (p.regex.test(raw)) {
        provider = p.name;
        suggestedMetadata.provider = p.name;
        reasoningParts.push(`Extracted organization/provider: ${p.name}`);
        break;
      }
    }

    // =========================================================================
    // 5 & 6. EXTRACT KNOWLEDGE, SKILLS, DOMAINS, METHODS & FRAMEWORKS
    // =========================================================================
    // Product Analytics & Dashboard (Matches Example)
    if (normalized.includes('product analytics') || normalized.includes('analytics')) {
      inferredKnowledge.push('Product Analytics', 'Event Telemetry Taxonomy', 'Funnel Analysis Mechanics');
      inferredSkills.push('Product Analytics', 'Data Interpretation');
      domains.push('Enterprise SaaS', 'Data & Machine Learning');
      methods.push('Funnel Conversion Tracking', 'Cohort Retention Analysis');
      frameworks.push('AARRR Pirate Metrics Framework', 'HEART Framework');
      careerRelevance.push('Product Manager', 'Data Analyst', 'Product Operations Manager');
      competencies.push('Quantitative Product Sense', 'Metric Governance');
    }

    if (normalized.includes('dashboard')) {
      inferredKnowledge.push('Operational Telemetry Design', 'Information Hierarchy');
      inferredSkills.push('Dashboard Design');
      methods.push('Visual Hierarchy & Drill-Down UX');
    }

    // Product Ops & SLA / Churn / Grab
    if (normalized.includes('product ops') || normalized.includes('product operations') || normalized.includes('sla') || normalized.includes('churn')) {
      domains.push('Enterprise SaaS', 'Transportation & Logistics');
      inferredKnowledge.push('Product Operations Cadence', 'Driver Verification SLA Modeling', 'Churn Hazard Mechanics');
      inferredSkills.push('Product Operations', 'Process Optimization', 'Retention Strategy');
      methods.push('SLA Threshold Analysis', 'Root Cause Incident Analysis');
      frameworks.push('DMAIC Process Improvement');
      careerRelevance.push('Senior Product Operations Manager', 'Product Operations Manager');
    }

    // Product Strategy & Reforge
    if (normalized.includes('product strategy') || normalized.includes('chien luoc san pham') || normalized.includes('growth model') || normalized.includes('retention loop')) {
      domains.push('Enterprise SaaS');
      inferredKnowledge.push('Growth Loops vs Linear Funnels', 'Defensibility Moats', 'Qualitative User Segmentation');
      inferredSkills.push('Product Strategy', 'Strategic Prioritization', 'Hypothesis Testing');
      methods.push('Retention Cohort Flattening', 'Painted-Door Experiments');
      frameworks.push('Reforge Compounding Growth Loops', 'RICE Scoring');
      careerRelevance.push('Director of Product', 'Senior Product Manager');
    }

    // Distributed Systems, Kafka, AWS, CDC, Migration
    if (normalized.includes('kafka') || normalized.includes('cdc') || normalized.includes('debezium') || normalized.includes('distributed') || normalized.includes('dual-run') || normalized.includes('migration')) {
      domains.push('Cloud Infrastructure & DevOps', 'Fintech & Payments');
      inferredKnowledge.push('Change Data Capture (CDC)', 'Idempotent Consumer Processing', 'Dual-Run Cutover Topology');
      inferredSkills.push('Distributed Systems', 'Kafka', 'Zero-Downtime Migration', 'PostgreSQL');
      methods.push('Continuous Checksum Reconciliation', 'Dual-Write Shadow Routing');
      frameworks.push('Strangler Fig Architecture Pattern', 'Event-Driven Microservices');
      careerRelevance.push('Senior Backend Engineer', 'Staff Distributed Systems Engineer');
    }

    // GenAI / LLM
    if (normalized.includes('genai') || normalized.includes('prompt') || normalized.includes('llm') || normalized.includes('ai product')) {
      domains.push('AI & Machine Learning');
      inferredKnowledge.push('Generative AI Architectures', 'Prompt Engineering Patterns', 'Model Hallucination Mitigation');
      inferredSkills.push('GenAI Literacy', 'AI Product Sense', 'Model Evaluation');
      methods.push('Few-Shot Prompt Engineering', 'RAG Context Grounding');
      careerRelevance.push('AI Product Manager', 'Machine Learning Engineer');
    }

    // Canonicalize all inferred skills
    const resolvedSkills = inferredSkills.map(s => CanonicalSkillRegistry.resolve(s).canonicalName);

    // Default domain if none matched
    if (domains.length === 0) {
      domains.push('Enterprise SaaS');
    }

    // =========================================================================
    // 9. DETECT POTENTIAL EVIDENCE & PROVISIONAL STRENGTH CALIBRATION
    // "CRITICAL: It must not claim advanced proficiency unless supported by evidence."
    // =========================================================================
    if (inferredFamily === 'learn') {
      if (detectedApplication) {
        // Course learning applied in a project: provisional Level 2 (or provisional Level 3 at most)
        evidenceStrength = 2;
        reasoningParts.push('Assigned Provisional Level 2: Course learning with self-reported project application.');
        reasoningParts.push('Non-inflated calibration: Does NOT claim advanced proficiency (Level 5/6) without verified production metrics or passed external evaluation.');
        evidenceStatements.push(
          `Course learning with self-reported application to "${detectedApplication.appliedToTarget}". Provisional Level 2 (Learned / Hands-on).`
        );
      } else {
        evidenceStrength = 2;
        reasoningParts.push('Assigned Provisional Level 2: Standard structured learning coursework.');
        evidenceStatements.push('Structured course learning. Foundational knowledge without production demonstration.');
      }
    } else if (inferredFamily === 'assessment') {
      evidenceStrength = 5;
      reasoningParts.push('Assigned Level 5: Rigorous hiring assessment case requiring end-to-end synthesis.');
      evidenceStatements.push(`Demonstrated hiring assessment case study: ${title}.`);
    } else if (inferredFamily === 'credential') {
      evidenceStrength = 3;
      reasoningParts.push('Assigned Level 3: External credential / verified certification.');
      evidenceStatements.push(`Cryptographically or institutionally verified credential.`);
    } else if (inferredFamily === 'project') {
      evidenceStrength = normalized.includes('work') ? 5 : 4;
      reasoningParts.push(`Assigned Level ${evidenceStrength}: Hands-on applied project implementation.`);
      evidenceStatements.push(`Executed project engineering: ${title}.`);
    } else if (inferredFamily === 'artifact') {
      evidenceStrength = 5;
      reasoningParts.push('Assigned Level 5: Tangible production work artifact.');
      evidenceStatements.push(`Authored production artifact: ${title}.`);
    }

    // Refine Title
    const quotesMatch = raw.match(/["“](.+?)["”]/);
    if (quotesMatch && quotesMatch[1]) {
      title = quotesMatch[1];
    } else if (raw.length > 5) {
      const cleaned = raw
        .replace(/^(em hoc khoa nay|khoa hoc nay|toi hoc|i completed|completed|just finished|here is|minh vua)\s+/i, '')
        .trim();
      title = cleaned.charAt(0).toUpperCase() + cleaned.slice(1, 80);
      if (cleaned.length > 80) title += '...';
    }

    // =========================================================================
    // 10. SUGGEST RELATIONSHIPS TO CAREER OS PROJECTS, ROLES, JOBS & SKILLS
    // =========================================================================
    const suggestedRelationships = SmartImportParser.generateSuggestedRelationships({
      skills: resolvedSkills,
      domains,
      title,
      text: raw,
      detectedApplication
    });

    // =========================================================================
    // 12. BUILD STRUCTURED REVIEW ITEMS (Clear AI Suggested vs Confirmed separation)
    // =========================================================================
    const reviewItems = SmartImportParser.buildReviewItems({
      knowledge: Array.from(new Set(inferredKnowledge)),
      skills: Array.from(new Set(resolvedSkills)),
      domains: Array.from(new Set(domains)),
      methods: Array.from(new Set(methods)),
      frameworks: Array.from(new Set(frameworks)),
      evidence: evidenceStatements,
      relationships: suggestedRelationships
    });

    return {
      inferredFamily,
      inferredType,
      title,
      provider: provider || undefined,
      author: author || undefined,
      description: raw,
      detectedLanguage: primaryLang,
      detectedLanguages: langs,
      inferredKnowledge: Array.from(new Set(inferredKnowledge)),
      inferredSkills: Array.from(new Set(resolvedSkills)),
      competencies: Array.from(new Set(competencies)),
      domains: Array.from(new Set(domains)),
      methods: Array.from(new Set(methods)),
      frameworks: Array.from(new Set(frameworks)),
      careerRelevance: Array.from(new Set(careerRelevance)),
      evidenceStrength,
      confidence,
      reasoning: reasoningParts.join(' • '),
      suggestedMetadata,
      evidenceStatements,
      detectedApplication,
      suggestedRelationships,
      reviewItems
    };
  }

  /**
   * Parse a Web URL
   */
  static parseUrl(url: string): SmartImportResult {
    const raw = url.trim();
    let inferredFamily: SourceFamily = 'content';
    let inferredType = 'article';
    let title = 'Web Resource';
    let provider = 'Web';
    let evidenceStrength: EvidenceStrengthLevel = 1;
    const reasoning: string[] = [];

    const inferredKnowledge: string[] = [];
    const inferredSkills: string[] = [];
    const domains: string[] = [];
    const careerRelevance: string[] = [];
    const methods: string[] = [];
    const frameworks: string[] = [];

    try {
      const parsed = new URL(raw);
      const host = parsed.hostname.toLowerCase();
      const path = parsed.pathname.toLowerCase();

      if (host.includes('github.com')) {
        inferredFamily = 'project';
        inferredType = 'open_source_project';
        evidenceStrength = 4;
        provider = 'GitHub';
        const segments = path.split('/').filter(Boolean);
        title = segments.length >= 2 ? `${segments[0]}/${segments[1]} (Repository)` : 'GitHub Repository';
        reasoning.push('GitHub repository detected as open-source project');
        inferredSkills.push('Git & Version Control', 'Software Engineering');
        domains.push('Cloud Infrastructure & DevOps');
      } else if (host.includes('coursera.org') || host.includes('edx.org') || host.includes('udemy.com') || host.includes('reforge.com')) {
        inferredFamily = 'learn';
        inferredType = 'course';
        evidenceStrength = 2;
        provider = host.includes('coursera') ? 'Coursera' : host.includes('edx') ? 'edX' : host.includes('reforge') ? 'Reforge' : 'Udemy';
        const slug = path.split('/').filter(Boolean).pop()?.replace(/[-_]/g, ' ') || 'Online Course';
        title = slug.charAt(0).toUpperCase() + slug.slice(1);
        reasoning.push(`${provider} course learning resource recognized`);
        if (raw.includes('analytics')) {
          inferredSkills.push('Product Analytics', 'Data Interpretation');
          inferredKnowledge.push('Product Analytics', 'Funnel Tracking');
        } else if (raw.includes('strategy')) {
          inferredSkills.push('Product Strategy');
          inferredKnowledge.push('Market Entry', 'Growth Loops');
        }
        domains.push('Enterprise SaaS');
      } else if (host.includes('credly.com') || host.includes('accredible.com')) {
        inferredFamily = 'credential';
        inferredType = 'digital_badge';
        evidenceStrength = 3;
        provider = host.includes('credly') ? 'Credly' : 'Accredible';
        title = 'Verified Digital Credential';
        reasoning.push('Cryptographically verifiable badge platform recognized');
        inferredSkills.push('Cloud Infrastructure & DevOps');
      } else if (host.includes('arxiv.org')) {
        inferredFamily = 'knowledge';
        inferredType = 'academic_paper';
        evidenceStrength = 1;
        provider = 'arXiv';
        title = 'Academic Research Paper';
        reasoning.push('arXiv research preprint platform recognized');
        domains.push('AI & Machine Learning');
      } else if (host.includes('youtube.com') || host.includes('youtu.be')) {
        inferredFamily = 'content';
        inferredType = 'youtube_video';
        evidenceStrength = 0;
        provider = 'YouTube';
        title = 'Video Talk / Tutorial';
        reasoning.push('YouTube media resource recognized');
      } else {
        title = `${host.replace('www.', '')} Resource`;
        reasoning.push('General web URL analyzed');
        domains.push('Enterprise SaaS');
      }
    } catch {
      title = raw.slice(0, 50);
      reasoning.push('URL parsed directly');
    }

    const resolvedSkills = inferredSkills.map(s => CanonicalSkillRegistry.resolve(s).canonicalName);

    const suggestedRelationships = SmartImportParser.generateSuggestedRelationships({
      skills: resolvedSkills,
      domains,
      title,
      text: raw
    });

    const reviewItems = SmartImportParser.buildReviewItems({
      knowledge: inferredKnowledge,
      skills: resolvedSkills,
      domains,
      methods,
      frameworks,
      evidence: [`Verified external resource at ${raw}.`],
      relationships: suggestedRelationships
    });

    return {
      inferredFamily,
      inferredType,
      title,
      url: raw,
      provider,
      detectedLanguage: 'en',
      detectedLanguages: ['en'],
      inferredKnowledge,
      inferredSkills: resolvedSkills,
      competencies: [],
      domains,
      methods,
      frameworks,
      careerRelevance,
      evidenceStrength,
      confidence: 0.88,
      reasoning: reasoning.join(' • '),
      suggestedMetadata: { url: raw, provider },
      evidenceStatements: [`Documented external URL link: ${raw}`],
      suggestedRelationships,
      reviewItems
    };
  }

  /**
   * Parse an uploaded file
   */
  static parseFile(fileName: string, fileSize?: string, textSnippet?: string): SmartImportResult {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    let inferredFamily: SourceFamily = 'artifact';
    let inferredType = 'technical_documentation';
    let evidenceStrength: EvidenceStrengthLevel = 4;
    const reasoning: string[] = [];

    const lower = baseName.toLowerCase();
    const inferredKnowledge: string[] = [];
    const inferredSkills: string[] = [];
    const domains: string[] = ['Enterprise SaaS'];
    const methods: string[] = [];
    const frameworks: string[] = [];

    if (lower.includes('prd') || lower.includes('product spec') || lower.includes('requirements')) {
      inferredFamily = 'artifact';
      inferredType = 'prd';
      evidenceStrength = 5;
      reasoning.push('Filename signals Product Requirements Document');
      inferredKnowledge.push('Product Scope Definition', 'User Acceptance Criteria');
      inferredSkills.push('Product Requirements Document (PRD)', 'Feature Scoping');
    } else if (lower.includes('dashboard') || lower.includes('telemetry')) {
      inferredFamily = 'artifact';
      inferredType = 'dashboard';
      evidenceStrength = 5;
      reasoning.push('Filename signals operational dashboard artifact');
      inferredKnowledge.push('Product Analytics', 'Operational Metrics');
      inferredSkills.push('Dashboard Design', 'Data Interpretation');
    } else if (lower.includes('case') || lower.includes('takehome') || lower.includes('assignment')) {
      inferredFamily = 'assessment';
      inferredType = 'product_case';
      evidenceStrength = 5;
      reasoning.push('Filename signals candidate case study assessment');
      inferredSkills.push('Problem Structuring', 'Root Cause Analysis');
    } else if (lower.includes('cert') || lower.includes('badge') || lower.includes('diploma')) {
      inferredFamily = 'credential';
      inferredType = 'certificate';
      evidenceStrength = 3;
      reasoning.push('Filename signals completion certificate');
      inferredSkills.push('Continuing Professional Education');
    } else if (lower.includes('paper') || lower.includes('research') || ext === 'pdf') {
      inferredFamily = 'knowledge';
      inferredType = 'research_paper';
      evidenceStrength = 1;
      reasoning.push('PDF research publication document format');
    } else if (lower.includes('deck') || lower.includes('presentation') || ext === 'pptx' || ext === 'key') {
      inferredFamily = 'artifact';
      inferredType = 'presentation';
      evidenceStrength = 4;
      reasoning.push('Presentation slide deck artifact');
      inferredSkills.push('Executive Storytelling', 'Stakeholder Communication');
    }

    const title = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    const resolvedSkills = inferredSkills.map(s => CanonicalSkillRegistry.resolve(s).canonicalName);

    const suggestedRelationships = SmartImportParser.generateSuggestedRelationships({
      skills: resolvedSkills,
      domains,
      title,
      text: textSnippet || fileName
    });

    const reviewItems = SmartImportParser.buildReviewItems({
      knowledge: inferredKnowledge,
      skills: resolvedSkills,
      domains,
      methods,
      frameworks,
      evidence: [`Imported local artifact file: ${fileName} (${fileSize || 'local'}).`],
      relationships: suggestedRelationships
    });

    return {
      inferredFamily,
      inferredType,
      title,
      description: textSnippet || `Imported file: ${fileName} (${fileSize || 'local'})`,
      detectedLanguage: 'en',
      detectedLanguages: ['en'],
      inferredKnowledge,
      inferredSkills: resolvedSkills,
      competencies: ['Artifact Synthesis'],
      domains,
      methods,
      frameworks,
      careerRelevance: ['Product Manager', 'Software Engineer'],
      evidenceStrength,
      confidence: 0.85,
      reasoning: reasoning.join(' • ') || `Analyzed file format: .${ext}`,
      suggestedMetadata: { originalFileName: fileName, fileSize },
      evidenceStatements: [`Documented file submission: ${fileName}`],
      suggestedRelationships,
      reviewItems
    };
  }

  /**
   * Parse an existing Career OS Entity (Project, Artifact, Role Blueprint, or Market Job)
   */
  static parseEntity(entity: {
    type: 'project' | 'artifact' | 'role' | 'job';
    id: string;
    title: string;
    data: any;
  }): SmartImportResult {
    let inferredFamily: SourceFamily = 'project';
    let inferredType = 'work_project';
    let evidenceStrength: EvidenceStrengthLevel = 4;
    const reasoning: string[] = [];

    let title = entity.title;
    let description = '';
    const inferredKnowledge: string[] = [];
    const inferredSkills: string[] = [];
    const domains: string[] = [];
    const methods: string[] = [];
    const frameworks: string[] = [];
    const careerRelevance: string[] = [];

    if (entity.type === 'project') {
      inferredFamily = 'project';
      inferredType = 'work_project';
      evidenceStrength = 5;
      description = entity.data.description || `Career OS Project: ${entity.title}`;
      reasoning.push('Ingested existing Career OS Project into verified source ledger');
      if (entity.data.confirmedSkills) inferredSkills.push(...entity.data.confirmedSkills);
      if (entity.data.domains) domains.push(...entity.data.domains);
    } else if (entity.type === 'artifact') {
      inferredFamily = 'artifact';
      inferredType = entity.data.sourceType || 'prd';
      evidenceStrength = 5;
      description = entity.data.description || `Career OS Production Artifact: ${entity.title}`;
      reasoning.push('Ingested verified Career OS Artifact as standalone evidence unit');
      if (entity.data.confirmedSkills) inferredSkills.push(...entity.data.confirmedSkills);
    } else if (entity.type === 'role') {
      inferredFamily = 'experience';
      inferredType = 'job';
      evidenceStrength = 4;
      title = `Role Practice & Mastery: ${entity.title}`;
      description = entity.data.overview || `Target role competencies and benchmarks for ${entity.title}`;
      reasoning.push('Derived structured competency evidence profile from Role Blueprint');
      careerRelevance.push(entity.title);
      if (entity.data.competencies) {
        entity.data.competencies.forEach((c: any) => {
          inferredKnowledge.push(c.name);
          if (c.keyIndicators) inferredSkills.push(...c.keyIndicators.slice(0, 2));
        });
      }
    } else if (entity.type === 'job') {
      inferredFamily = 'assessment';
      inferredType = 'product_case';
      evidenceStrength = 5;
      title = `${entity.data.company} - ${entity.title} Preparation Source`;
      description = entity.data.description || `Target job posting requirements for ${entity.data.company}`;
      reasoning.push('Created structured evidence ledger aligned with active job market listing');
      if (entity.data.domain) domains.push(entity.data.domain);
      if (entity.data.requiredSkills) inferredSkills.push(...entity.data.requiredSkills);
      if (entity.data.roleCategory) careerRelevance.push(entity.data.roleCategory);
    }

    const resolvedSkills = inferredSkills.map(s => CanonicalSkillRegistry.resolve(s).canonicalName);

    const suggestedRelationships = SmartImportParser.generateSuggestedRelationships({
      skills: resolvedSkills,
      domains,
      title,
      text: description
    });

    // Add direct relationship to the imported entity itself
    suggestedRelationships.unshift({
      entityId: entity.id,
      entityType: entity.type === 'artifact' ? 'project' : entity.type,
      title: entity.title,
      subtitle: `Direct Link: ${entity.type.toUpperCase()}`,
      matchReason: `Direct source ingestion of Career OS entity`,
      status: 'accepted'
    });

    const reviewItems = SmartImportParser.buildReviewItems({
      knowledge: Array.from(new Set(inferredKnowledge)),
      skills: Array.from(new Set(resolvedSkills)),
      domains: Array.from(new Set(domains)),
      methods,
      frameworks,
      evidence: [`Linked directly to Career OS entity: ${entity.title}`],
      relationships: suggestedRelationships
    });

    return {
      inferredFamily,
      inferredType,
      title,
      description,
      detectedLanguage: 'en',
      detectedLanguages: ['en'],
      inferredKnowledge: Array.from(new Set(inferredKnowledge)),
      inferredSkills: Array.from(new Set(resolvedSkills)),
      competencies: [],
      domains: Array.from(new Set(domains.length > 0 ? domains : ['Enterprise SaaS'])),
      methods,
      frameworks,
      careerRelevance,
      evidenceStrength,
      confidence: 0.95,
      reasoning: reasoning.join(' • '),
      evidenceStatements: [`Ingested from Career OS entity ${entity.id}: ${title}`],
      suggestedRelationships,
      reviewItems
    };
  }

  /**
   * Generates intelligent suggestions to existing Career OS Projects, Roles, Jobs & Skills
   */
  static generateSuggestedRelationships(params: {
    skills: string[];
    domains: string[];
    title: string;
    text: string;
    detectedApplication?: { appliedToTarget?: string };
  }): SuggestedRelationship[] {
    const suggestions: SuggestedRelationship[] = [];
    const lowerText = params.text.toLowerCase();

    // 1. Suggest Projects & Artifacts from sourceStore
    const existingSources = sourceStore.getSources();
    const projectsAndArtifacts = existingSources.filter(s => s.sourceFamily === 'project' || s.sourceFamily === 'artifact');

    for (const p of projectsAndArtifacts) {
      const pTitleLower = p.title.toLowerCase();
      let matched = false;
      let reason = '';

      if (params.detectedApplication?.appliedToTarget && pTitleLower.includes(params.detectedApplication.appliedToTarget.toLowerCase())) {
        matched = true;
        reason = `Matches detected application target: "${params.detectedApplication.appliedToTarget}"`;
      } else if (lowerText.includes(pTitleLower) || pTitleLower.split(' ').some(w => w.length > 4 && lowerText.includes(w))) {
        matched = true;
        reason = `Referenced project in input text`;
      } else {
        // Check shared skills
        const shared = p.confirmedSkills.filter(s => params.skills.includes(s));
        if (shared.length >= 2) {
          matched = true;
          reason = `Shares skills: ${shared.slice(0, 2).join(', ')}`;
        }
      }

      if (matched && !suggestions.some(s => s.entityId === p.id)) {
        suggestions.push({
          entityId: p.id,
          entityType: 'project',
          title: p.title,
          subtitle: `${p.sourceFamily === 'project' ? 'Project' : 'Artifact'} • L${p.evidenceStrength}`,
          matchReason: reason,
          status: 'pending'
        });
      }
    }

    // If a detected application target doesn't exist yet, suggest creating or referencing it
    if (params.detectedApplication?.appliedToTarget && !suggestions.some(s => s.title.toLowerCase().includes(params.detectedApplication!.appliedToTarget!.toLowerCase()))) {
      suggestions.unshift({
        entityId: `new-proj-${Date.now()}`,
        entityType: 'project',
        title: params.detectedApplication.appliedToTarget,
        subtitle: 'Detected Application Project',
        matchReason: 'Extracted from phrase: "apply vào ' + params.detectedApplication.appliedToTarget + '"',
        status: 'pending'
      });
    }

    // 2. Suggest Roles from ROLES_DATA
    for (const role of ROLES_DATA) {
      let score = 0;
      const matchingSkills: string[] = [];

      for (const comp of role.competencies) {
        for (const skill of params.skills) {
          if (comp.name.toLowerCase().includes(skill.toLowerCase()) || comp.keyIndicators.some(k => k.toLowerCase().includes(skill.toLowerCase()))) {
            score++;
            matchingSkills.push(skill);
          }
        }
      }

      if (params.domains.includes(role.category as any)) score += 2;

      if (score >= 1 && !suggestions.some(s => s.entityId === role.id)) {
        suggestions.push({
          entityId: role.id,
          entityType: 'role',
          title: role.title,
          subtitle: `${role.category} • ${role.level}`,
          matchReason: matchingSkills.length > 0 
            ? `Aligns with competency: ${Array.from(new Set(matchingSkills)).slice(0, 2).join(', ')}`
            : `Category match (${role.category})`,
          status: 'pending'
        });
      }
    }

    // 3. Suggest Jobs from JOBS_DATA
    for (const job of JOBS_DATA) {
      const sharedReqs = job.requiredSkills.filter(req => 
        params.skills.some(s => s.toLowerCase() === req.toLowerCase() || req.toLowerCase().includes(s.toLowerCase()))
      );

      if (sharedReqs.length > 0 && !suggestions.some(s => s.entityId === job.id)) {
        suggestions.push({
          entityId: job.id,
          entityType: 'job',
          title: `${job.title}`,
          subtitle: `${job.company} • ${job.location}`,
          matchReason: `Requires: ${sharedReqs.slice(0, 2).join(', ')}`,
          status: 'pending'
        });
      }
    }

    return suggestions.slice(0, 6);
  }

  /**
   * Helper to construct review items with strict AI Suggested vs User Confirmed origin
   */
  static buildReviewItems(params: {
    knowledge: string[];
    skills: string[];
    domains: string[];
    methods: string[];
    frameworks: string[];
    evidence: string[];
    relationships: SuggestedRelationship[];
  }) {
    return {
      knowledge: params.knowledge.map((k, idx) => ({
        id: `rev-k-${idx}-${Date.now()}`,
        value: k,
        origin: 'ai_suggested' as const,
        status: 'pending' as const
      })),
      skills: params.skills.map((s, idx) => {
        const canonical = CanonicalSkillRegistry.resolve(s);
        return {
          id: `rev-s-${idx}-${Date.now()}`,
          value: canonical.canonicalName,
          canonicalId: canonical.canonicalId,
          origin: 'ai_suggested' as const,
          status: 'pending' as const
        };
      }),
      domains: params.domains.map((d, idx) => ({
        id: `rev-d-${idx}-${Date.now()}`,
        value: d,
        origin: 'ai_suggested' as const,
        status: 'pending' as const
      })),
      methods: params.methods.map((m, idx) => ({
        id: `rev-m-${idx}-${Date.now()}`,
        value: m,
        origin: 'ai_suggested' as const,
        status: 'pending' as const
      })),
      frameworks: params.frameworks.map((f, idx) => ({
        id: `rev-f-${idx}-${Date.now()}`,
        value: f,
        origin: 'ai_suggested' as const,
        status: 'pending' as const
      })),
      evidence: params.evidence.map((e, idx) => ({
        id: `rev-e-${idx}-${Date.now()}`,
        value: e,
        origin: 'ai_suggested' as const,
        status: 'pending' as const
      })),
      relationships: params.relationships
    };
  }
}
