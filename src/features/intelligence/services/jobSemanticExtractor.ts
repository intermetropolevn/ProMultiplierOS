// =========================================================================
// CAREER OS - CONTEXT-AWARE JOB INTELLIGENCE & SEMANTIC EXTRACTION SERVICE
// Priority-based evidence ranking, section isolation, and deadline estimation
// =========================================================================

import { 
  RoleCategory, 
  SectorDomain, 
  ExperienceLevel, 
  WorkMode, 
  JobDeadlineType, 
  JobDeadlineSource,
  IndustryDomainSource,
  IndustryClassificationStatus
} from '../../../types';
import { 
  CANONICAL_ROLES, 
  CANONICAL_DOMAINS, 
  CANONICAL_LEVELS, 
  CANONICAL_WORK_MODES 
} from '../../../data/jobTaxonomies';
import { CareerSemanticParser } from './careerSemanticParser';
import { CANONICAL_SKILL_CATALOG } from './canonicalSkillRegistry';
import { VietnameseNormalizer } from './vietnameseNormalizer';
import { ClassificationMemoryService } from './classificationMemoryService';

export interface ExtractedAttributeResult<T> {
  value: T;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceScore?: number;
  evidence: string;
  sourceType: string;
}

export interface ExtractedJobFields {
  roleCategory: RoleCategory;
  domain: SectorDomain;
  customDomain?: string;
  industryDomainConfidence: number; // Normalized 0.0 - 1.0
  industryDomainSource: IndustryDomainSource;
  industryClassificationStatus: IndustryClassificationStatus;
  suggestedDomain?: SectorDomain;
  suggestedDomainConfidence?: number;
  level: ExperienceLevel;
  workMode: WorkMode;
  location: string;
  isGlobalLocation: boolean;
  salaryRange?: string;
  requiredSkills: string[];

  // Posting & Deadline Intelligence
  postedAt?: string | null;
  applicationDeadline?: string | null;
  deadlineType: JobDeadlineType;
  deadlineSource: JobDeadlineSource;
  deadlineLabel?: string;
  
  // Context-Aware Evidence & Confidence details
  attributeDetails: {
    workMode: ExtractedAttributeResult<WorkMode>;
    roleCategory: ExtractedAttributeResult<RoleCategory>;
    domain: ExtractedAttributeResult<SectorDomain>;
    level: ExtractedAttributeResult<ExperienceLevel>;
    location: ExtractedAttributeResult<string>;
    salaryRange?: ExtractedAttributeResult<string>;
    deadline?: ExtractedAttributeResult<string | null>;
    postedDate?: ExtractedAttributeResult<string | null>;
  };

  detectedCompanyContext?: string;
  detectedSignals: string[];
}

interface WorkModeSignal {
  mode: WorkMode;
  priority: number; // 5: Explicit arrangement, 4: Physical workplace address, 3: Office schedule, 1: Weak culture/benefits
  confidence: 'High' | 'Medium' | 'Low';
  evidence: string;
  sourceType: 'explicit_arrangement' | 'physical_workplace' | 'office_schedule' | 'weak_culture_benefit';
}

/**
 * Robust date parser for natural language job dates
 * Examples: "September 1, 2026", "Sep 1, 2026", "2026-09-01", "October 20, 2026", "Oct 31"
 */
export function parseDateString(raw: string, defaultYear = 2026): string | null {
  if (!raw || !raw.trim()) return null;
  const clean = raw.trim();

  // Check ISO format YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Month name mapping
  const monthMap: Record<string, number> = {
    jan: 1, january: 1,
    feb: 2, february: 2,
    mar: 3, march: 3,
    apr: 4, april: 4,
    may: 5,
    jun: 6, june: 6,
    jul: 7, july: 7,
    aug: 8, august: 8,
    sep: 9, sept: 9, september: 9,
    oct: 10, october: 10,
    nov: 11, november: 11,
    dec: 12, december: 12,
  };

  // Match e.g. "September 12, 2026" or "October 20" or "12 September 2026"
  const m1 = clean.match(/([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?/i);
  if (m1) {
    const monthName = m1[1].toLowerCase();
    if (monthMap[monthName]) {
      const month = String(monthMap[monthName]).padStart(2, '0');
      const day = m1[2].padStart(2, '0');
      const year = m1[3] || String(defaultYear);
      return `${year}-${month}-${day}`;
    }
  }

  const m2 = clean.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)(?:,?\s*(\d{4}))?/i);
  if (m2) {
    const monthName = m2[2].toLowerCase();
    if (monthMap[monthName]) {
      const month = String(monthMap[monthName]).padStart(2, '0');
      const day = m2[1].padStart(2, '0');
      const year = m2[3] || String(defaultYear);
      return `${year}-${month}-${day}`;
    }
  }

  // Support DD/MM/YYYY or DD-MM-YYYY or MM/DD/YYYY
  const slashMatch = clean.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})$/);
  if (slashMatch) {
    const p1 = parseInt(slashMatch[1], 10);
    const p2 = parseInt(slashMatch[2], 10);
    const y = slashMatch[3];
    if (p1 > 12) {
      // Definitely DD/MM/YYYY
      const d = String(p1).padStart(2, '0');
      const m = String(p2).padStart(2, '0');
      return `${y}-${m}-${d}`;
    } else if (p2 > 12) {
      // Definitely MM/DD/YYYY
      const m = String(p1).padStart(2, '0');
      const d = String(p2).padStart(2, '0');
      return `${y}-${m}-${d}`;
    } else {
      // Default standard DD/MM/YYYY
      const d = String(p1).padStart(2, '0');
      const m = String(p2).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }

  // Try standard Date parsing
  try {
    const parsed = new Date(clean);
    if (!isNaN(parsed.getTime())) {
      const y = parsed.getFullYear() || defaultYear;
      const m = String(parsed.getMonth() + 1).padStart(2, '0');
      const d = String(parsed.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Adds exactly 1 calendar month to an ISO date (YYYY-MM-DD)
 * Example: 2026-09-12 -> 2026-10-12
 * Handles month-end clamping (e.g. Jan 31 -> Feb 28)
 */
export function addOneCalendarMonth(dateStr: string): string | null {
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const day = parseInt(parts[2], 10);

    const targetDate = new Date(year, month + 1, day);
    // If day overflowed, clamp to last day of previous month
    if (targetDate.getMonth() !== ((month + 1) % 12)) {
      targetDate.setDate(0);
    }
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return null;
  }
}

export class JobSemanticExtractor {
  /**
   * Context-aware semantic extraction from Title, Company, URL, and Brief Overview.
   * Prioritizes Job Title for Role Family, About Us for Industry, and explicit statements for location & deadlines.
   */
  public static extractFromJobBrief(params: {
    title: string;
    company: string;
    overview: string;
    url?: string;
  }): ExtractedJobFields {
    const { title = '', company = '', overview = '', url = '' } = params;
    const combinedText = `${title}\n${company}\n${overview}`.trim();
    const cleanLower = combinedText.toLowerCase();
    const cleanNoDiacritics = VietnameseNormalizer.toSearchKey(combinedText);

    // 1. Multilingual Semantic Parser analysis
    const parsedIntent = CareerSemanticParser.parse(combinedText);
    const detectedSignals: string[] = [];

    // =========================================================================
    // 2. COMPANY CONTEXT SECTION DETECTION ("About Us / About Company")
    // =========================================================================
    let detectedCompanyContext = '';
    const aboutMatch = combinedText.match(
      /(?:about\s+(?:us|the\s+company|our\s+company|the\s+team|the\s+organization|[a-z0-9\s]+)|who\s+we\s+are|company\s+overview|our\s+company)\s*[:\n\-—]+([\s\S]*?)(?=(?:\n\s*(?:key\s+)?responsibilities|requirements|qualifications|what\s+you(?:'ll|\s+will)\s+do|benefits|perks|how\s+to\s+apply|work\s+location|$))/i
    );
    if (aboutMatch && aboutMatch[1]?.trim()) {
      detectedCompanyContext = aboutMatch[1].trim();
    } else {
      // Fallback: look at first paragraph if overview mentions company
      const firstPara = overview.split(/\n\s*\n/)[0] || '';
      if (firstPara.toLowerCase().includes(company.toLowerCase()) || /is\s+a|we\s+are|global\s+company/i.test(firstPara)) {
        detectedCompanyContext = firstPara.trim();
      }
    }

    // =========================================================================
    // 3. ROLE FAMILY — JOB TITLE HAS HIGHEST PRIORITY (PRIORITY 1)
    // =========================================================================
    let detectedRole: RoleCategory = 'Software Engineering';
    let roleConfidence: 'High' | 'Medium' | 'Low' = 'Medium';
    let roleEvidence = 'Default role classification';

    const titleLower = title.toLowerCase();

    // Priority 1A: Explicit Product Management titles
    // Technical Product Manager, Senior Product Manager, Product Owner, Group PM, Head of Product, etc.
    if (
      /\b(product\s+manager|technical\s+product\s+manager|senior\s+product\s+manager|lead\s+product\s+manager|group\s+product\s+manager|principal\s+product\s+manager|associate\s+product\s+manager|apm|product\s+owner|senior\s+product\s+owner|lead\s+product\s+owner|head\s+of\s+product|vp\s+of\s+product|cpo|chief\s+product\s+officer)\b/i.test(titleLower)
    ) {
      detectedRole = 'Product Management';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    } 
    // Priority 1B: Explicit Product & Technical Operations
    else if (
      /\b(product\s*(&|\+|and)?\s*technical\s+operations|product\s+operations|technical\s+operations\s+manager|tech\s+ops\s+manager|product\s+ops)\b/i.test(titleLower)
    ) {
      detectedRole = 'Product & Technical Operations';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    }
    // Priority 1C: Explicit Program & Project Management (TPM, Program Manager, Scrum Master)
    else if (
      /\b(technical\s+program\s+manager|tpm|program\s+manager|project\s+manager|scrum\s+master|delivery\s+manager|pmo\s+lead|agile\s+coach)\b/i.test(titleLower)
    ) {
      detectedRole = 'Program & Project Management';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    }
    // Priority 1D: UI/UX & Product Design
    else if (
      /\b(ui\/ux|ux\s+designer|ui\s+designer|product\s+designer|visual\s+designer|interaction\s+designer|design\s+lead|head\s+of\s+design)\b/i.test(titleLower)
    ) {
      detectedRole = 'UI/UX & Product Design';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    }
    // Priority 1E: DevOps & Cloud
    else if (
      /\b(devops|sre|site\s+reliability|cloud\s+engineer|platform\s+engineer|infrastructure\s+engineer)\b/i.test(titleLower)
    ) {
      detectedRole = 'DevOps & Cloud';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    }
    // Priority 1F: Data & Machine Learning (Engineer, Scientist)
    else if (
      /\b(data\s+engineer|machine\s+learning|ml\s+engineer|ai\s+engineer|data\s+scientist|ai\s+researcher|nlp\s+engineer|llm\s+engineer)\b/i.test(titleLower)
    ) {
      detectedRole = 'Data & Machine Learning';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    }
    // Priority 1G: Data Analytics & BI
    else if (
      /\b(data\s+analyst|bi\s+analyst|business\s+intelligence|bi\s+engineer|analytics\s+engineer)\b/i.test(titleLower)
    ) {
      detectedRole = 'Data Analytics & BI';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    }
    // Priority 1H: Business Analysis & Strategy
    else if (
      /\b(business\s+analyst|it\s+ba|technical\s+ba|strategy\s+analyst|business\s+system\s+analyst)\b/i.test(titleLower)
    ) {
      detectedRole = 'Business Analysis & Strategy';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    }
    // Priority 1I: Security & Systems
    else if (
      /\b(security\s+engineer|infosec|cybersecurity|application\s+security|secops|security\s+architect)\b/i.test(titleLower)
    ) {
      detectedRole = 'Security & Systems';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    }
    // Priority 1J: Growth & Product Marketing
    else if (
      /\b(growth\s+manager|product\s+marketing|pmm|growth\s+engineer|growth\s+marketer)\b/i.test(titleLower)
    ) {
      detectedRole = 'Growth & Product Marketing';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    }
    // Priority 1K: Software Engineering (Developers, Engineering Managers)
    else if (
      /\b(software\s+engineer|software\s+developer|engineering\s+manager|frontend|backend|fullstack|mobile\s+engineer|ios\s+engineer|android\s+engineer|golang|react|node|java|rust|c\+\+|embedded|firmware)\b/i.test(titleLower)
    ) {
      detectedRole = 'Software Engineering';
      roleConfidence = 'High';
      roleEvidence = `Job Title matched: "${title.trim()}"`;
    }
    // Priority 2: Title ambiguous or empty -> evaluate explicit role statements in Overview
    else {
      const explicitRoleDef = overview.match(/(?:seeking|looking\s+for|we\s+are\s+hiring)\s+(?:a|an)?\s*([a-z\s]+?)(?:to|\.|,|\n)/i);
      if (explicitRoleDef && /product\s+manager|product\s+owner/i.test(explicitRoleDef[1])) {
        detectedRole = 'Product Management';
        roleConfidence = 'Medium';
        roleEvidence = `Explicit role statement: "${explicitRoleDef[0].trim()}"`;
      } else if (parsedIntent.role?.canonicalName) {
        const matchedCanonical = CANONICAL_ROLES.find(r => 
          r.toLowerCase().includes(parsedIntent.role!.canonicalName.toLowerCase()) ||
          parsedIntent.role!.canonicalName.toLowerCase().includes(r.toLowerCase())
        );
        if (matchedCanonical) {
          detectedRole = matchedCanonical;
          roleConfidence = 'Medium';
          roleEvidence = `Ontology semantic match: ${parsedIntent.role.canonicalName}`;
        }
      }
    }
    detectedSignals.push(`Role: ${detectedRole}`);

    // =========================================================================
    // 4. INDUSTRY DOMAIN — CONTEXT-AWARE & 90% CONFIDENCE GATE
    // Default is 'Others' (unclassified). Only replace with a specific domain
    // when normalized confidence is STRICTLY HIGH >= 0.90 (90%).
    // Priority 1: About Us / About the Company / Who We Are / Company Overview
    // Priority 2: Company business description
    // Priority 3: Product / service description
    // Priority 4: Job responsibilities
    // Priority 5: Skills / technologies only (Tech stack does NOT infer domain)
    // =========================================================================
    const CONFIDENCE_THRESHOLD = 0.85;
    let detectedDomain: SectorDomain = 'Others';
    let customDomain: string | undefined = undefined;
    let domainConfidenceNum = 0.0;
    let domainConfidence: 'High' | 'Medium' | 'Low' = 'Low';
    let domainEvidence = 'Industry not confidently classified. Defaulted to Others';
    let industryDomainSource: IndustryDomainSource = 'default';
    let industryClassificationStatus: IndustryClassificationStatus = 'unclassified';
    let suggestedDomain: SectorDomain | undefined = undefined;
    let suggestedDomainConfidence: number | undefined = undefined;

    const companyContextLower = (detectedCompanyContext || '').toLowerCase();
    const companyContextNoDia = VietnameseNormalizer.toSearchKey(detectedCompanyContext || '');
    const overviewLower = overview.toLowerCase();

    // Check learned memory first
    const learnedDomain = ClassificationMemoryService.getLearnedRuleMatch({
      attribute: 'domain',
      combinedText,
      company,
    });

    if (learnedDomain) {
      detectedDomain = learnedDomain.preferredValue as SectorDomain;
      domainConfidenceNum = 0.95;
      domainConfidence = 'High';
      domainEvidence = `Learned preference for company ${company}: ${detectedDomain}`;
      industryDomainSource = 'ai';
      industryClassificationStatus = 'classified';
    } else {
      // Step A: Check if company is a Software Outsourcing / Digital Transformation / IT Services company
      // Critical distinction: an outsourcing company serving banking/insurance/manufacturing clients
      // is Software Outsourcing & IT Services, NOT Fintech & Payments or Manufacturing!
      const isOutsourcingOrServices = 
        /\b(outsourcing|software\s*services|software\s*house|offshore|it\s*services|consulting\s*partner|digital\s*transformation\s*(?:company|firm|consultancy)|client\s*projects|serving\s*clients|clients\s*in|for\s*clients|staff\s*augmentation|technology\s*consulting|global\s*technology\s*services)\b/i.test(companyContextLower) ||
        /\b(gft|tma|fpt|golden\s*owl|kms|vng|fram|orient|nash\s*tech|kore\s*wireless|luxoft|epam|globallogic|accenture|wipro|infosys|capgemini)\b/i.test(company.toLowerCase());

      if (isOutsourcingOrServices) {
        // High confidence match for Software Outsourcing
        domainConfidenceNum = 0.95;
        domainConfidence = 'High';
        detectedDomain = 'Software Outsourcing & IT Services';
        domainEvidence = detectedCompanyContext 
          ? `About Us / Company Overview describes digital transformation / IT services company` 
          : `Software Outsourcing & IT Services business model identified for ${company}`;
        industryDomainSource = 'ai';
        industryClassificationStatus = 'classified';
      } else {
        // Step B: Canonical Domain Taxonomy Signals with Priority Weights
        interface DomainRule {
          domain: SectorDomain;
          companyPatterns: RegExp[];
          strongKeywords: string[];
          secondaryKeywords: string[];
        }

        const domainRules: DomainRule[] = [
          {
            domain: 'Manufacturing & Industrial Tech',
            companyPatterns: [
              /\b(?:manufacturer\s+of\s+industrial|industrial\s+automation|robotics\s+and\s+factory|factory\s+equipment|industrial\s+machinery|smart\s+manufacturing|industrial\s+equipment|scada|programmable\s+logic\s+controller|plc\s+automation|cnc\s+machining|semiconductor\s+manufacturing)\b/i,
              /\b(?:manufacturing\s+plant|industrial\s+systems|factory\s+automation|industrial\s+iot)\b/i
            ],
            strongKeywords: [
              'industrial automation', 'robotics and factory', 'factory equipment',
              'industrial automation systems', 'industrial machinery', 'smart manufacturing',
              'industrial equipment', 'industrial iot', 'smart factory', 'scada',
              'programmable logic controller', 'cnc', 'semiconductor manufacturing',
              'factory automation', 'industrial control systems'
            ],
            secondaryKeywords: ['plc', 'manufacturing', 'machinery', 'automation systems']
          },
          {
            domain: 'Fintech & Payments',
            companyPatterns: [
              /\b(?:payment\s+infrastructure|merchant\s+acquiring|payment\s+processing|core\s+banking|digital\s+wallet|banking\s+platform|neobank|clearing\s+house|fintech\s+company|financial\s+services\s+company)\b/i
            ],
            strongKeywords: [
              'payment infrastructure', 'merchant acquiring', 'payment processing', 'payment gateway',
              'banking platform', 'crypto exchange', 'digital wallet', 'neobank', 'clearing house',
              'core banking', 'lending platform', 'fintech'
            ],
            secondaryKeywords: ['visa', 'mastercard', 'stripe', 'momo', 'zalopay', 'vnlife', 'financial services']
          },
          {
            domain: 'AI & Machine Learning',
            companyPatterns: [
              /\b(?:ai\s+platform|foundation\s+model|generative\s+ai\s+company|llm\s+provider|machine\s+learning\s+platform)\b/i
            ],
            strongKeywords: [
              'artificial intelligence', 'genai', 'generative ai', 'llm', 'foundation model',
              'deep learning platform', 'nlp platform', 'vector database'
            ],
            secondaryKeywords: ['neural network', 'machine learning models', 'model training']
          },
          {
            domain: 'Enterprise SaaS',
            companyPatterns: [
              /\b(?:b2b\s+saas|enterprise\s+saas|crm\s+platform|erp\s+software|workflow\s+management\s+platform|b2b\s+software)\b/i
            ],
            strongKeywords: [
              'b2b saas', 'enterprise saas', 'crm platform', 'erp software',
              'workflow management platform', 'multi-tenant saas'
            ],
            secondaryKeywords: ['cloud platform', 'b2b software', 'enterprise software']
          },
          {
            domain: 'Cloud Infrastructure & DevOps',
            companyPatterns: [
              /\b(?:cloud\s+infrastructure\s+provider|datacenter\s+infrastructure|observability\s+platform)\b/i
            ],
            strongKeywords: [
              'cloud infrastructure provider', 'cloud hosting platform', 'observability platform',
              'infrastructure as a service', 'iaas'
            ],
            secondaryKeywords: ['kubernetes', 'aws', 'gcp', 'terraform', 'cloud infrastructure']
          },
          {
            domain: 'Cybersecurity',
            companyPatterns: [
              /\b(?:cybersecurity\s+company|threat\s+detection\s+platform|infosec\s+solutions|penetration\s+testing\s+firm)\b/i
            ],
            strongKeywords: [
              'cybersecurity', 'infosec', 'threat detection', 'penetration testing',
              'zero trust security', 'identity access management', 'iam platform', 'firewall security'
            ],
            secondaryKeywords: ['soc', 'vulnerability management', 'security operations']
          },
          {
            domain: 'E-Commerce & Retail',
            companyPatterns: [
              /\b(?:ecommerce\s+platform|online\s+marketplace|retail\s+marketplace|omnichannel\s+retail)\b/i
            ],
            strongKeywords: [
              'ecommerce platform', 'e-commerce', 'online marketplace', 'cart checkout',
              'shopify storefront', 'marketplace platform'
            ],
            secondaryKeywords: ['shopee', 'lazada', 'tiki', 'retail tech']
          },
          {
            domain: 'Healthcare & MedTech',
            companyPatterns: [
              /\b(?:healthtech|medtech|telemedicine\s+platform|electronic\s+health\s+records|clinical\s+trials\s+platform)\b/i
            ],
            strongKeywords: [
              'healthcare platform', 'medtech', 'healthtech', 'medical device',
              'clinical trials platform', 'telemedicine platform', 'electronic health records', 'hipaa compliance'
            ],
            secondaryKeywords: ['hospital systems', 'patient records', 'medical imaging']
          },
          {
            domain: 'Logistics & Supply Chain',
            companyPatterns: [
              /\b(?:freight\s+forwarding|fleet\s+management\s+platform|warehouse\s+management\s+system|last\s+mile\s+delivery)\b/i
            ],
            strongKeywords: [
              'logistics platform', 'supply chain platform', 'freight forwarding', 'last mile delivery',
              'fleet management platform', 'warehouse management system', 'fulfillment platform'
            ],
            secondaryKeywords: ['logistics', 'supply chain', 'freight', 'warehouse operations']
          },
          {
            domain: 'EdTech & E-Learning',
            companyPatterns: [
              /\b(?:edtech|e-learning\s+platform|learning\s+management\s+system|online\s+education)\b/i
            ],
            strongKeywords: ['edtech', 'e-learning platform', 'learning management system', 'lms platform'],
            secondaryKeywords: ['online courses', 'educational tech', 'student learning']
          },
          {
            domain: 'Gaming & Entertainment',
            companyPatterns: [
              /\b(?:game\s+studio|game\s+publisher|mobile\s+game\s+developer)\b/i
            ],
            strongKeywords: ['game studio', 'mobile game developer', 'game engine development', 'unity studio', 'unreal engine studio'],
            secondaryKeywords: ['video games', 'multiplayer gaming']
          },
          {
            domain: 'Web3 & Blockchain',
            companyPatterns: [
              /\b(?:blockchain\s+platform|web3\s+company|defi\s+protocol|crypto\s+network)\b/i
            ],
            strongKeywords: ['web3 platform', 'blockchain protocol', 'smart contracts platform', 'defi protocol', 'tokenomics platform'],
            secondaryKeywords: ['blockchain', 'crypto', 'solidity']
          },
          {
            domain: 'PropTech & Real Estate',
            companyPatterns: [
              /\b(?:proptech|real\s+estate\s+platform|property\s+management\s+software)\b/i
            ],
            strongKeywords: ['proptech', 'real estate platform', 'property management software', 'mortgage tech'],
            secondaryKeywords: ['real estate', 'property listings']
          },
          {
            domain: 'AutoTech & Mobility',
            companyPatterns: [
              /\b(?:autotech|connected\s+vehicle|telematics\s+platform|ev\s+charging\s+network)\b/i
            ],
            strongKeywords: ['autotech', 'connected vehicle platform', 'automotive tech', 'telematics platform', 'ev charging network'],
            secondaryKeywords: ['automotive', 'electric vehicles', 'fleet telematics']
          },
          {
            domain: 'AdTech & MarTech',
            companyPatterns: [
              /\b(?:adtech|martech|programmatic\s+advertising|demand\s+side\s+platform|dsp|ssp)\b/i
            ],
            strongKeywords: ['adtech platform', 'martech platform', 'programmatic ad network', 'dsp platform', 'ssp platform'],
            secondaryKeywords: ['advertising tech', 'marketing automation']
          },
          {
            domain: 'HRTech & Recruitment',
            companyPatterns: [
              /\b(?:hrtech|applicant\s+tracking\s+system|ats\s+platform|payroll\s+software)\b/i
            ],
            strongKeywords: ['hrtech', 'applicant tracking system', 'payroll platform', 'talent management software'],
            secondaryKeywords: ['recruitment platform', 'hr software']
          },
          {
            domain: 'TravelTech & Hospitality',
            companyPatterns: [
              /\b(?:traveltech|hotel\s+booking\s+engine|flight\s+reservation\s+system)\b/i
            ],
            strongKeywords: ['traveltech', 'hotel booking engine', 'flight reservation platform', 'hospitality tech'],
            secondaryKeywords: ['travel booking', 'hotel management']
          },
          {
            domain: 'FoodTech & F&B',
            companyPatterns: [
              /\b(?:foodtech|food\s+delivery\s+platform|restaurant\s+pos\s+software|cloud\s+kitchen\s+tech)\b/i
            ],
            strongKeywords: ['foodtech', 'food delivery platform', 'restaurant pos platform', 'cloud kitchen tech'],
            secondaryKeywords: ['food ordering', 'restaurant management']
          },
          {
            domain: 'AgriTech',
            companyPatterns: [
              /\b(?:agritech|precision\s+agriculture|smart\s+farming)\b/i
            ],
            strongKeywords: ['agritech', 'precision agriculture', 'smart irrigation tech', 'farm management software'],
            secondaryKeywords: ['agriculture tech', 'smart farming']
          }
        ];

        // Evaluate domain candidates across evidence layers:
        // Layer 1: Priority 1 - About Us / Company Overview section
        // Layer 2: Priority 2 - Company business description / Title / Company Name
        // Layer 3: Priority 3 - Product / service description in overview
        // Layer 4: Priority 4 - Responsibilities in overview
        // Layer 5: Priority 5 - Skills / tech stack only (Confidence < 0.70)
        let bestCandidate: { domain: SectorDomain; confidence: number; evidence: string } | null = null;
        const candidateScores: { domain: SectorDomain; score: number; evidence: string }[] = [];

        for (const rule of domainRules) {
          let score = 0;
          let matchedEvidence = '';

          // Check Company Name directly
          const companyLower = company.toLowerCase();
          for (const pattern of rule.companyPatterns) {
            if (pattern.test(companyLower)) {
              score = Math.max(score, 0.95);
              matchedEvidence = `Company name matches domain pattern: "${company}"`;
            }
          }

          // Check Layer 1: About Us / Company Context (Strongest evidence: 0.92 - 0.96)
          if (detectedCompanyContext) {
            for (const pattern of rule.companyPatterns) {
              if (pattern.test(companyContextLower)) {
                score = Math.max(score, 0.95);
                matchedEvidence = `About Company section explicitly defines business: "${detectedCompanyContext.slice(0, 100)}..."`;
              }
            }
            if (score < 0.92) {
              for (const kw of rule.strongKeywords) {
                if (companyContextLower.includes(kw) || companyContextNoDia.includes(kw.replace(/[^a-z0-9]/g, ''))) {
                  score = Math.max(score, 0.94);
                  matchedEvidence = `About Company section contains core keyword: "${kw}"`;
                  break;
                }
              }
            }
          }

          // Check Layer 2: Opening company description in overview if no dedicated About section
          if (score < 0.90) {
            const firstPara = overviewLower.split(/\n\s*\n/)[0] || '';
            for (const pattern of rule.companyPatterns) {
              if (pattern.test(firstPara)) {
                score = Math.max(score, 0.92);
                matchedEvidence = `Opening company overview matches: "${pattern.source}"`;
                break;
              }
            }
            for (const kw of rule.strongKeywords) {
              if (firstPara.includes(kw)) {
                score = Math.max(score, 0.91);
                matchedEvidence = `Company introduction contains: "${kw}"`;
                break;
              }
            }
          }

          // Check Layer 3 & 4: General Overview description (Lower confidence: 0.75 - 0.85)
          if (score < 0.85) {
            for (const kw of rule.strongKeywords) {
              if (overviewLower.includes(kw)) {
                score = Math.max(score, 0.82);
                matchedEvidence = `Overview references: "${kw}"`;
                break;
              }
            }
          }

          // Check Layer 5: Secondary keywords (Lower confidence: 0.60 - 0.75)
          if (score < 0.70) {
            for (const kw of rule.secondaryKeywords) {
              if (overviewLower.includes(kw)) {
                score = Math.max(score, 0.65);
                matchedEvidence = `Job mentions secondary keyword: "${kw}"`;
                break;
              }
            }
          }

          if (score > 0) {
            candidateScores.push({ domain: rule.domain, score, evidence: matchedEvidence });
          }
        }

        // Sort candidates by confidence score
        candidateScores.sort((a, b) => b.score - a.score);

        // Conflict check: if top two candidates have very similar high scores from different domains,
        // penalize confidence as ambiguous (e.g. 78%)
        if (candidateScores.length >= 2 && candidateScores[0].score >= 0.85) {
          const diff = candidateScores[0].score - candidateScores[1].score;
          if (diff < 0.05) {
            // Ambiguous mixed signals
            candidateScores[0].score = 0.78;
            candidateScores[0].evidence += ` (Ambiguous: competing with ${candidateScores[1].domain})`;
          }
        }

        if (candidateScores.length > 0) {
          bestCandidate = {
            domain: candidateScores[0].domain,
            confidence: candidateScores[0].score,
            evidence: candidateScores[0].evidence,
          };
        }

        // Check if only technical stack was mentioned (Case C)
        const hasTechStackOnly = /\b(python|kafka|aws|apis?|microservices|docker|kubernetes|react|sql|node\.?js)\b/i.test(combinedText);
        if (hasTechStackOnly && (!bestCandidate || bestCandidate.confidence < 0.80)) {
          // Technical keywords alone must NOT force any specific domain
          if (bestCandidate) {
            bestCandidate.confidence = Math.min(bestCandidate.confidence, 0.65);
          }
        }

        // =====================================================================
        // STRICT 90% CONFIDENCE GATE
        // =====================================================================
        if (bestCandidate && bestCandidate.confidence >= CONFIDENCE_THRESHOLD) {
          detectedDomain = bestCandidate.domain;
          domainConfidenceNum = bestCandidate.confidence;
          domainConfidence = 'High';
          domainEvidence = bestCandidate.evidence;
          industryDomainSource = 'ai';
          industryClassificationStatus = 'classified';
        } else if (bestCandidate) {
          // Below 90% threshold -> remain Others!
          detectedDomain = 'Others';
          domainConfidenceNum = bestCandidate.confidence;
          domainConfidence = bestCandidate.confidence >= 0.70 ? 'Medium' : 'Low';
          domainEvidence = `Industry not confidently classified (${Math.round(bestCandidate.confidence * 100)}% confidence). Kept as Others`;
          industryDomainSource = 'default';
          industryClassificationStatus = 'unclassified';
          suggestedDomain = bestCandidate.domain;
          suggestedDomainConfidence = bestCandidate.confidence;
        } else {
          // No match found -> remain Others!
          detectedDomain = 'Others';
          domainConfidenceNum = 0.0;
          domainConfidence = 'Low';
          domainEvidence = 'No confident match found. Kept as Others';
          industryDomainSource = 'default';
          industryClassificationStatus = 'unclassified';
        }
      }
    }
    detectedSignals.push(`Domain: ${detectedDomain} (${Math.round(domainConfidenceNum * 100)}%)`);

    // =========================================================================
    // 5. CONTEXT-AWARE WORK MODE WITH EVIDENCE SPECIFICITY & PRIORITY RANKING
    // Priority 5.5: Explicit Work Arrangement field ("Work mode: Remote / Hybrid / On-site")
    // Priority 5.2: Explicit Work Arrangement phrases ("On-site", "Office-based", "100% remote", "Work from anywhere")
    // Priority 5.0: Explicit Hybrid (e.g. "3 days in office", "2 days remote", "Flexible hybrid")
    // Priority 4.5: Specific Physical Workplace Location / Address ("Work location: 173 Tran Nao...")
    // Priority 3.5: Office Work Hours Schedule ("Work hours: Monday - Friday...")
    // Priority 1.0: Weak / Generic Remote Phrases ("remote-friendly options", "remote collaboration tools")
    // =========================================================================
    const workModeSignals: WorkModeSignal[] = [];

    // Priority 5.5: Explicit labeled Work Mode / Arrangement field
    const labeledArrangementMatch = combinedText.match(/(?:work\s*mode|work\s*arrangement|working\s*arrangement|chế độ làm việc)\s*:\s*([^\n.;]+)/i);
    if (labeledArrangementMatch) {
      const val = labeledArrangementMatch[1].toLowerCase();
      if (/hybrid/i.test(val)) {
        workModeSignals.push({
          mode: 'Hybrid',
          priority: 5.5,
          confidence: 'High',
          evidence: labeledArrangementMatch[0].trim(),
          sourceType: 'explicit_arrangement',
        });
      } else if (/remote|từ xa/i.test(val)) {
        workModeSignals.push({
          mode: 'Remote',
          priority: 5.5,
          confidence: 'High',
          evidence: labeledArrangementMatch[0].trim(),
          sourceType: 'explicit_arrangement',
        });
      } else if (/on-?site|office/i.test(val)) {
        workModeSignals.push({
          mode: 'On-site',
          priority: 5.5,
          confidence: 'High',
          evidence: labeledArrangementMatch[0].trim(),
          sourceType: 'explicit_arrangement',
        });
      }
    }

    // Priority 5.2: Explicit Hybrid Arrangement (Over-rules generic remote/on-site language)
    const hybridDaysRegex = /(\d+\s*days?\s*(?:in\s*office|at\s*office|on-?site)|(?:in\s*office|at\s*office|on-?site)\s*\d+\s*days?|\d+\s*days?\s*remote|remote\s*\d+\s*days?)/i;
    const hybridRegex = /\b(hybrid\s*(?:work|working|model|arrangement|schedule|setup)?|office\s*\+\s*remote|remote\s*\+\s*office|flexible\s*hybrid|hybrid\s*work\s*arrangement|kết hợp văn phòng và từ xa|lam viec hybrid)\b/i;
    const hybridMatch = combinedText.match(hybridDaysRegex) || combinedText.match(hybridRegex);
    if (hybridMatch) {
      workModeSignals.push({
        mode: 'Hybrid',
        priority: 5.2,
        confidence: 'High',
        evidence: hybridMatch[0].trim(),
        sourceType: 'explicit_arrangement',
      });
    }

    // Priority 5.1: Explicit Fully Remote Position
    const explicitRemoteRegex = /\b(fully\s*remote|100%\s*remote|remote-first|remote\s*first|fully\s*distributed|work\s*from\s*anywhere|remote\s*position|no\s*office\s*attendance\s*required|location-independent|hoàn toàn từ xa|100%\s*từ xa|toàn thời gian từ xa)\b/i;
    const explicitRemoteMatch = combinedText.match(explicitRemoteRegex);
    if (explicitRemoteMatch) {
      workModeSignals.push({
        mode: 'Remote',
        priority: 5.1,
        confidence: 'High',
        evidence: explicitRemoteMatch[0].trim(),
        sourceType: 'explicit_arrangement',
      });
    }

    // Priority 5.1: Explicit On-Site / Office Presence Statements
    const explicitOnsiteRegex = /\b(on-site|onsite|office-based|office\s*based|work\s*from\s*office|work\s*at\s*(?:our|the)\s*office|required\s*to\s*work\s*from\s*office|must\s*work\s*from\s*office|based\s+(?:at|in)\s+our\s+[^\n.,]+?office|physical\s*presence\s*required|daily\s*presence\s*in\s*office|5\s*days\s*(?:a\s*week\s*)?in\s*office|monday\s*(?:–|-|to)\s*friday\s*at\s*office|tại\s*văn\s*phòng|lam\s*viec\s*tai\s*van\s*phong)\b/i;
    const explicitOnsiteMatch = combinedText.match(explicitOnsiteRegex);
    if (explicitOnsiteMatch) {
      workModeSignals.push({
        mode: 'On-site',
        priority: 5.1,
        confidence: 'High',
        evidence: explicitOnsiteMatch[0].trim(),
        sourceType: 'explicit_arrangement',
      });
    }

    // Priority 4.5: Specific Physical Workplace Location / Address
    const physicalWorkplaceRegex = /(?:work\s*location|office\s*location|job\s*location|workplace|office\s*address|địa điểm làm việc|dia diem lam viec)\s*:\s*([^\n.;]+)/i;
    const workplaceMatch = combinedText.match(physicalWorkplaceRegex);
    if (workplaceMatch) {
      workModeSignals.push({
        mode: 'On-site',
        priority: 4.5,
        confidence: 'High',
        evidence: workplaceMatch[0].trim(),
        sourceType: 'physical_workplace',
      });
    } else {
      const basedAtOfficeMatch = combinedText.match(/(?:based\s+at|based\s+in)\s+(?:our\s+)?([^.\n]+?(?:office|headquarters|campus|building))/i);
      if (basedAtOfficeMatch) {
        workModeSignals.push({
          mode: 'On-site',
          priority: 4.5,
          confidence: 'Medium',
          evidence: basedAtOfficeMatch[0].trim(),
          sourceType: 'physical_workplace',
        });
      }
    }

    // Priority 3.5: Office Schedule / Work Hours
    const scheduleMatch = combinedText.match(/(?:work\s*hours|working\s*hours|giờ làm việc)\s*:\s*([^.\n]+)/i);
    if (scheduleMatch && /monday|office|t2|thứ hai/i.test(scheduleMatch[1])) {
      workModeSignals.push({
        mode: 'On-site',
        priority: 3.5,
        confidence: 'Medium',
        evidence: scheduleMatch[0].trim(),
        sourceType: 'office_schedule',
      });
    }

    // Priority 1.0: Weak / Generic Remote Mentions (Culture / Benefits)
    // Must NOT classify as Remote if specific office or address exists!
    const weakRemoteRegex = /\b(remote-friendly\s*(?:options|culture|environment)?|remote\s*options|occasional\s*remote\s*work|remote\s*collaboration\s*tools|modern\s*remote\s*culture|flexible\s*(?:workplace|hours|working\s*environment)|work-life\s*balance|modern\s*workplace|môi trường làm việc linh hoạt)\b/i;
    const weakMatch = combinedText.match(weakRemoteRegex);
    if (weakMatch) {
      workModeSignals.push({
        mode: 'Remote',
        priority: 1.0,
        confidence: 'Low',
        evidence: weakMatch[0].trim(),
        sourceType: 'weak_culture_benefit',
      });
    }

    // Check learned memory for workMode
    const learnedWorkMode = ClassificationMemoryService.getLearnedRuleMatch({
      attribute: 'workMode',
      combinedText,
      company,
    });
    if (learnedWorkMode) {
      workModeSignals.push({
        mode: learnedWorkMode.preferredValue as WorkMode,
        priority: 4.8,
        confidence: 'High',
        evidence: `Learned pattern: ${learnedWorkMode.patternKey}`,
        sourceType: 'explicit_arrangement',
      });
    }

    // Sort signals descending by priority
    workModeSignals.sort((a, b) => b.priority - a.priority);

    let resolvedWorkMode: WorkMode = 'On-site';
    let workModeConfidence: 'High' | 'Medium' | 'Low' = 'Low';
    let workModeEvidenceText = 'No explicit work arrangement found';

    if (workModeSignals.length > 0) {
      const topSignal = workModeSignals[0];
      
      // Check for conflicting evidence: Office address vs Weak Remote
      const hasPhysicalOffice = workModeSignals.some(s => s.sourceType === 'physical_workplace' || s.sourceType === 'office_schedule');
      const hasHybrid = workModeSignals.some(s => s.mode === 'Hybrid' && s.priority >= 5.0);
      const hasWeakRemote = workModeSignals.some(s => s.sourceType === 'weak_culture_benefit');

      if (hasHybrid) {
        resolvedWorkMode = 'Hybrid';
        workModeConfidence = 'High';
        workModeEvidenceText = hasPhysicalOffice 
          ? `Hybrid arrangement with designated office (${topSignal.evidence})`
          : topSignal.evidence;
        detectedSignals.push(`Work Mode: Hybrid (${workModeEvidenceText})`);
      } else if (hasPhysicalOffice) {
        // Physical office overrides weak remote!
        const officeSignal = workModeSignals.find(s => s.sourceType === 'physical_workplace') || topSignal;
        resolvedWorkMode = 'On-site';
        workModeConfidence = 'High';
        workModeEvidenceText = hasWeakRemote
          ? `${officeSignal.evidence} (Generic remote-friendly mention does not override physical office)`
          : officeSignal.evidence;
        detectedSignals.push(`Work Mode: On-site (${workModeEvidenceText})`);
      } else if (topSignal.priority >= 3.0) {
        resolvedWorkMode = topSignal.mode;
        workModeConfidence = topSignal.confidence;
        workModeEvidenceText = topSignal.evidence;
        detectedSignals.push(`Work Mode: ${resolvedWorkMode} (${workModeEvidenceText})`);
      } else {
        // Only weak remote/generic benefits found with no office -> low confidence Remote or On-site
        resolvedWorkMode = 'Remote';
        workModeConfidence = 'Low';
        workModeEvidenceText = `Generic flexible/remote mention only ("${topSignal.evidence}") · Review recommended`;
      }
    }

    // =========================================================================
    // 6. LOCATION — CONTEXT-AWARE AUTO DETECTION
    // Separate Location from Work Mode
    // =========================================================================
    let isGlobal = true;
    let detectedLocation = 'Global';
    let locationConfidence: 'High' | 'Medium' | 'Low' = 'Low';
    let locationEvidence = 'Global default';

    // Priority 1: Explicit Work Location / Address
    if (workplaceMatch) {
      isGlobal = false;
      let rawLoc = workplaceMatch[1].trim();
      // Clean up city name
      if (/ho\s*chi\s*minh|hcmc|saigon|sài\s*gòn|tran\s*nao/i.test(rawLoc)) {
        detectedLocation = 'Ho Chi Minh City';
      } else if (/hanoi|ha\s*noi|hà\s*nội/i.test(rawLoc)) {
        detectedLocation = 'Hanoi';
      } else if (/da\s*nang|đà\s*nẵng/i.test(rawLoc)) {
        detectedLocation = 'Da Nang';
      } else if (/singapore/i.test(rawLoc)) {
        detectedLocation = 'Singapore';
      } else {
        detectedLocation = rawLoc;
      }
      locationConfidence = 'High';
      locationEvidence = `Work location address: "${workplaceMatch[0].trim()}"`;
    } 
    // Priority 2: City / Office Mentions
    else {
      const citySignals = [
        { name: 'Ho Chi Minh City', regex: /\b(based\s+in\s+ho\s*chi\s*minh|based\s+at\s+our\s+hcmc\s+office|office-based\s+in\s+ho\s*chi\s*minh|office\s+location:\s*ho\s*chi\s*minh|job\s+location:\s*ho\s*chi\s*minh|hybrid\s+in\s+ho\s*chi\s*minh|ho\s*chi\s*minh|hcmc|saigon|sài\s*gòn|tp\s*hcm)\b/i },
        { name: 'Hanoi', regex: /\b(based\s+in\s+hanoi|office-based\s+in\s+hanoi|job\s+location:\s*hanoi|office\s+location:\s*hanoi|hybrid\s+in\s+hanoi|hanoi|ha\s*noi|hà\s*nội)\b/i },
        { name: 'Da Nang', regex: /\b(based\s+in\s+da\s*nang|da\s*nang|đà\s*nẵng)\b/i },
        { name: 'Singapore', regex: /\b(work\s+from\s+our\s+singapore\s+office|based\s+in\s+singapore|location:\s*singapore|singapore)\b/i },
        { name: 'San Francisco, CA', regex: /\b(san\s+francisco|bay\s+area|sf)\b/i },
        { name: 'New York, NY', regex: /\b(new\s+york|nyc)\b/i },
        { name: 'London, UK', regex: /\b(london|united\s+kingdom)\b/i },
        { name: 'Tokyo, Japan', regex: /\b(tokyo|japan)\b/i },
        { name: 'Sydney, Australia', regex: /\b(sydney|australia)\b/i },
      ];

      // Check country-level remote (e.g. "Remote within Vietnam")
      const countryRemoteMatch = combinedText.match(/remote\s+(?:within|in)\s+(vietnam|viet\s*nam|singapore|us|usa|uk)/i);
      if (countryRemoteMatch) {
        isGlobal = false;
        detectedLocation = `${countryRemoteMatch[1].toUpperCase()} (Nationwide Remote)`;
        locationConfidence = 'High';
        locationEvidence = countryRemoteMatch[0].trim();
      } else {
        // Check worldwide global remote signals
        const globalRemoteMatch = combinedText.match(
          /\b(work\s+from\s+anywhere|global\s+remote|remote\s+anywhere|location\s+independent|fully\s+distributed|open\s+to\s+candidates\s+worldwide)\b/i
        );

        if (globalRemoteMatch) {
          isGlobal = true;
          detectedLocation = 'Global';
          locationConfidence = 'High';
          locationEvidence = globalRemoteMatch[0].trim();
        } else {
          for (const item of citySignals) {
            if (item.regex.test(combinedText)) {
              isGlobal = false;
              detectedLocation = item.name;
              locationConfidence = 'High';
              locationEvidence = `Location matched: "${item.name}"`;
              break;
            }
          }
        }
      }
    }
    detectedSignals.push(`Location: ${detectedLocation}`);

    // =========================================================================
    // 7. DATE EXTRACTION PRIORITY:
    // 1. Explicit Application Deadline
    // 2. Posted Date
    // 3. Estimated Deadline = Posted Date + 1 month
    // 4. No Deadline
    // =========================================================================
    let detectedPostedDate: string | null = null;
    let detectedDeadline: string | null = null;
    let deadlineType: JobDeadlineType = 'none';
    let deadlineSource: JobDeadlineSource = 'none';
    let deadlineLabel: string | undefined = undefined;

    // Priority 1: Check Explicit Application Deadline first
    // E.g. "Applications close October 20, 2026", "Apply by October 20", "Application deadline: Oct 20, 2026", "Applications accepted until October 20"
    const explicitDeadlineMatch = combinedText.match(
      /(?:applications?\s+(?:close|accepted\s+until)|apply\s+by|application\s+deadline\s*:?|deadline\s*:|hạn\s+nộp\s*(?:hồ\s*sơ)?)\s*[:\s]*([a-z0-9,\s–\/\-]+?)(?:\.|\n|$)/i
    );
    if (explicitDeadlineMatch && explicitDeadlineMatch[1]) {
      const parsedDeadline = parseDateString(explicitDeadlineMatch[1]);
      if (parsedDeadline) {
        detectedDeadline = parsedDeadline;
        deadlineType = 'explicit';
        deadlineSource = 'job_posting';
        deadlineLabel = `From job posting`;
        detectedSignals.push(`Explicit Deadline: ${detectedDeadline}`);
      }
    }

    // Priority 2: Check Posted Date
    // E.g. "Posted: September 1, 2026", "Posted date: 2026-09-01", "Date posted: ...", "Ngày đăng: ..."
    const postedDateMatch = combinedText.match(
      /(?:posted\s*(?:date)?|date\s*posted|posted\s+on|ngày\s+đăng)\s*[:\s]*([a-z0-9,\s–\/\-]+?)(?:\.|\n|$)/i
    );
    if (postedDateMatch && postedDateMatch[1]) {
      const parsedPosted = parseDateString(postedDateMatch[1]);
      if (parsedPosted) {
        detectedPostedDate = parsedPosted;
        detectedSignals.push(`Posted Date: ${detectedPostedDate}`);
      }
    }

    // Priority 3: Estimated Deadline = Posted Date + 1 Month (ONLY if NO explicit deadline was found!)
    if (!detectedDeadline && detectedPostedDate) {
      const estimated = addOneCalendarMonth(detectedPostedDate);
      if (estimated) {
        detectedDeadline = estimated;
        deadlineType = 'estimated';
        deadlineSource = 'posting_date_estimate';
        deadlineLabel = `Estimated · based on posting date + 1 month`;
        detectedSignals.push(`Estimated Deadline: ${detectedDeadline} (+1 month)`);
      }
    }

    // Priority 4: No Deadline
    // If both detectedPostedDate is null and no explicit deadline was found, deadline remains null and deadlineType = 'none'

    // =========================================================================
    // 8. SENIORITY LEVEL CLASSIFICATION
    // =========================================================================
    let detectedLevel: ExperienceLevel = 'Senior';
    let levelConfidence: 'High' | 'Medium' | 'Low' = 'Medium';
    let levelEvidence = 'Standard mid/senior baseline';

    if (/\b(intern|internship|thực tập|thuc tap)\b/i.test(titleLower) || /\b(intern|internship|thực tập)\b/i.test(combinedText)) {
      detectedLevel = 'Intern / Fresh Grad';
      levelConfidence = 'High';
      levelEvidence = 'Internship markers found';
    } else if (/\b(fresh grad|fresher|entry-level|entry level|mới tốt nghiệp)\b/i.test(titleLower) || /\b(fresh grad|fresher|entry-level)\b/i.test(combinedText)) {
      detectedLevel = 'Intern / Fresh Grad';
      levelConfidence = 'High';
      levelEvidence = 'Entry-level fresher markers found';
    } else if (/\b(junior|assoc|associate|1-2 years|1\+ years)\b/i.test(titleLower)) {
      detectedLevel = 'Junior';
      levelConfidence = 'High';
      levelEvidence = 'Junior/Associate in title';
    } else if (/\b(mid|mid-level|mid level|2-4 years|3\+ years)\b/i.test(titleLower)) {
      detectedLevel = 'Mid-Level';
      levelConfidence = 'High';
      levelEvidence = 'Mid-level in title';
    } else if (/\b(principal|distinguished|fellow)\b/i.test(titleLower)) {
      detectedLevel = 'Principal / Fellow';
      levelConfidence = 'High';
      levelEvidence = 'Principal level designation in title';
    } else if (/\b(lead|tech lead|team lead|staff|staff engineer)\b/i.test(titleLower)) {
      detectedLevel = 'Lead / Staff';
      levelConfidence = 'High';
      levelEvidence = 'Staff/Lead title markers';
    } else if (/\b(manager|engineering manager|director|head of|vp)\b/i.test(titleLower)) {
      detectedLevel = 'Manager / Director';
      levelConfidence = 'High';
      levelEvidence = 'Management designation in title';
    } else if (/\b(c-level|csuite|c-suite|cto|cpo|ceo)\b/i.test(titleLower)) {
      detectedLevel = 'Executive / C-Suite';
      levelConfidence = 'High';
      levelEvidence = 'Executive C-Suite role';
    } else if (/\b(senior|sr\.|sr|5\+ years|4\+ years)\b/i.test(titleLower)) {
      detectedLevel = 'Senior';
      levelConfidence = 'High';
      levelEvidence = 'Senior in title';
    }
    detectedSignals.push(`Seniority: ${detectedLevel}`);

    // =========================================================================
    // 9. SALARY RANGE EXTRACTION
    // =========================================================================
    let detectedSalary: string | undefined = undefined;
    const usdMatch = combinedText.match(/(\$\s*\d{2,3}(?:,\d{3})*(?:\s*k)?\s*(?:-|–|to)\s*\$?\s*\d{2,3}(?:,\d{3})*(?:\s*k)?)/i) ||
                     combinedText.match(/(\d{2,3}k\s*(?:-|–|to)\s*\d{2,3}k\s*(?:usd)?)/i);
    const vndMatch = combinedText.match(/(\d{1,3}\s*(?:-|–|đến|to)\s*\d{1,3}\s*(?:triệu|trieu|tr|m)\s*(?:vnd)?)/i);

    if (usdMatch) {
      detectedSalary = usdMatch[1].trim();
    } else if (vndMatch) {
      detectedSalary = `${vndMatch[1].trim()} VND`;
    }

    // =========================================================================
    // 10. REQUIRED SKILLS EXTRACTION
    // Technical keywords enrich skills rather than confusing Role Family
    // =========================================================================
    const matchedSkills = new Set<string>();

    CANONICAL_SKILL_CATALOG.forEach(catSkill => {
      for (const alias of catSkill.multilingualAliases.en) {
        const reg = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (reg.test(combinedText)) {
          matchedSkills.add(catSkill.canonicalName);
          break;
        }
      }
      for (const alias of catSkill.multilingualAliases.vi) {
        if (combinedText.toLowerCase().includes(alias.toLowerCase())) {
          matchedSkills.add(catSkill.canonicalName);
          break;
        }
      }
    });

    const commonTechs = [
      'PostgreSQL', 'React', 'Node.js', 'TypeScript', 'JavaScript', 'Go', 'Python',
      'Kafka', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'GraphQL', 'gRPC',
      'System Design', 'Microservices', 'Distributed Systems', 'Tailwind CSS',
      'Next.js', 'SQL', 'MongoDB', 'Elasticsearch', 'CI/CD', 'Product Strategy',
      'Roadmapping', 'API Design', 'Technical Architecture', 'Stakeholder Management',
      'User Research', 'Agile'
    ];

    commonTechs.forEach(tech => {
      const reg = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (reg.test(combinedText)) {
        matchedSkills.add(tech);
      }
    });

    if (parsedIntent.skills && parsedIntent.skills.length > 0) {
      parsedIntent.skills.forEach(s => matchedSkills.add(s.canonicalName));
    }

    let finalSkills = Array.from(matchedSkills).slice(0, 6);
    if (finalSkills.length === 0) {
      if (detectedRole === 'Product Management') {
        finalSkills = ['Product Strategy', 'Roadmapping', 'User Research', 'API Design'];
      } else if (detectedRole === 'UI/UX & Product Design') {
        finalSkills = ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping'];
      } else {
        finalSkills = ['System Architecture', 'Core Problem Solving', 'API Design'];
      }
    }

    return {
      roleCategory: detectedRole,
      domain: detectedDomain,
      customDomain,
      industryDomainConfidence: domainConfidenceNum,
      industryDomainSource,
      industryClassificationStatus,
      suggestedDomain,
      suggestedDomainConfidence,
      level: detectedLevel,
      workMode: resolvedWorkMode,
      location: detectedLocation,
      isGlobalLocation: isGlobal,
      salaryRange: detectedSalary,
      requiredSkills: finalSkills,
      postedAt: detectedPostedDate,
      applicationDeadline: detectedDeadline,
      deadlineType,
      deadlineSource,
      deadlineLabel,
      attributeDetails: {
        workMode: {
          value: resolvedWorkMode,
          confidence: workModeConfidence,
          evidence: workModeEvidenceText,
          sourceType: workModeSignals[0]?.sourceType || 'default',
        },
        roleCategory: {
          value: detectedRole,
          confidence: roleConfidence,
          evidence: roleEvidence,
          sourceType: 'role_classifier',
        },
        domain: {
          value: detectedDomain,
          confidence: domainConfidence,
          confidenceScore: domainConfidenceNum,
          evidence: domainEvidence,
          sourceType: 'domain_classifier',
        },
        level: {
          value: detectedLevel,
          confidence: levelConfidence,
          evidence: levelEvidence,
          sourceType: 'level_classifier',
        },
        location: {
          value: detectedLocation,
          confidence: locationConfidence,
          evidence: locationEvidence,
          sourceType: 'location_classifier',
        },
        salaryRange: detectedSalary ? {
          value: detectedSalary,
          confidence: 'High',
          evidence: `Extracted numeric pattern: ${detectedSalary}`,
          sourceType: 'compensation_parser',
        } : undefined,
        deadline: detectedDeadline ? {
          value: detectedDeadline,
          confidence: deadlineType === 'explicit' ? 'High' : 'Medium',
          evidence: deadlineLabel || 'Application deadline',
          sourceType: deadlineSource,
        } : undefined,
        postedDate: detectedPostedDate ? {
          value: detectedPostedDate,
          confidence: 'High',
          evidence: `Posted date: ${detectedPostedDate}`,
          sourceType: 'job_posting',
        } : undefined,
      },
      detectedCompanyContext,
      detectedSignals,
    };
  }
}
