import { RoleCategory, SectorDomain, ExperienceLevel, WorkMode } from '../types';

export const CANONICAL_ROLES: RoleCategory[] = [
  'Software Engineering',
  'Product Management',
  'Product & Technical Operations',
  'UI/UX & Product Design',
  'Data Analytics & BI',
  'Data & Machine Learning',
  'Business Analysis & Strategy',
  'Program & Project Management',
  'Growth & Product Marketing',
  'DevOps & Cloud',
  'Security & Systems',
];

export const CANONICAL_DOMAINS: SectorDomain[] = [
  'Fintech & Payments',
  'Enterprise SaaS',
  'AI & Machine Learning',
  'Cloud Infrastructure & DevOps',
  'Cybersecurity',
  'E-Commerce & Retail',
  'Healthcare & MedTech',
  'Logistics & Supply Chain',
  'EdTech & E-Learning',
  'Gaming & Entertainment',
  'Web3 & Blockchain',
  'PropTech & Real Estate',
  'AutoTech & Mobility',
  'Digital Media & Entertainment',
  'AdTech & MarTech',
  'Software Outsourcing & IT Services',
  'LegalTech & Compliance',
  'Management Consulting & Advisory',
  'HRTech & Recruitment',
  'ClimateTech & GreenTech',
  'TravelTech & Hospitality',
  'FoodTech & F&B',
  'AgriTech',
  'Manufacturing & Industrial Tech',
  'Others',
];

export const CANONICAL_LEVELS: ExperienceLevel[] = [
  'Intern / Fresh Grad',
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead / Staff',
  'Principal / Fellow',
  'Manager / Director',
  'Executive / C-Suite',
];

export const CANONICAL_WORK_MODES: WorkMode[] = [
  'Remote',
  'Hybrid',
  'On-site',
];

export interface CanonicalJobSource {
  id: string;
  name: string;
  region: 'global' | 'vietnam' | 'social' | 'direct' | 'other';
  domains: string[];
  ctaLabel: string;
}

export const CANONICAL_JOB_SOURCES: CanonicalJobSource[] = [
  // Global / International Job Platforms
  { id: 'src-linkedin', name: 'LinkedIn', region: 'global', domains: ['linkedin.com'], ctaLabel: 'View on LinkedIn' },
  { id: 'src-wellfound', name: 'Wellfound', region: 'global', domains: ['wellfound.com', 'angel.co'], ctaLabel: 'View on Wellfound' },
  { id: 'src-yc', name: 'Y Combinator', region: 'global', domains: ['ycombinator.com', 'workatastartup.com'], ctaLabel: 'View on Y Combinator' },
  { id: 'src-wttj', name: 'Welcome to the Jungle', region: 'global', domains: ['welcometothejungle.com'], ctaLabel: 'View on Welcome to the Jungle' },
  { id: 'src-wwr', name: 'We Work Remotely', region: 'global', domains: ['weworkremotely.com'], ctaLabel: 'View on We Work Remotely' },
  { id: 'src-remoteok', name: 'Remote OK', region: 'global', domains: ['remoteok.com', 'remoteok.io'], ctaLabel: 'View on Remote OK' },
  { id: 'src-himalayas', name: 'Himalayas', region: 'global', domains: ['himalayas.app'], ctaLabel: 'View on Himalayas' },
  { id: 'src-remotive', name: 'Remotive', region: 'global', domains: ['remotive.com', 'remotive.io'], ctaLabel: 'View on Remotive' },
  { id: 'src-upwork', name: 'Upwork', region: 'global', domains: ['upwork.com'], ctaLabel: 'View on Upwork' },
  { id: 'src-contra', name: 'Contra', region: 'global', domains: ['contra.com'], ctaLabel: 'View on Contra' },
  { id: 'src-fiverr', name: 'Fiverr', region: 'global', domains: ['fiverr.com'], ctaLabel: 'View on Fiverr' },
  { id: 'src-freec', name: 'FreeC', region: 'global', domains: ['freec.asia'], ctaLabel: 'View on FreeC' },
  { id: 'src-glassdoor', name: 'Glassdoor', region: 'global', domains: ['glassdoor.com'], ctaLabel: 'View on Glassdoor' },

  // Vietnam Platforms
  { id: 'src-itviec', name: 'ITviec', region: 'vietnam', domains: ['itviec.com'], ctaLabel: 'View on ITviec' },
  { id: 'src-topdev', name: 'TopDev', region: 'vietnam', domains: ['topdev.vn'], ctaLabel: 'View on TopDev' },
  { id: 'src-topcv', name: 'TopCV', region: 'vietnam', domains: ['topcv.vn'], ctaLabel: 'View on TopCV' },
  { id: 'src-vietnamworks', name: 'VietnamWorks', region: 'vietnam', domains: ['vietnamworks.com'], ctaLabel: 'View on VietnamWorks' },
  { id: 'src-careerviet', name: 'CareerViet', region: 'vietnam', domains: ['careerviet.vn', 'careerbuilder.vn'], ctaLabel: 'View on CareerViet' },
  { id: 'src-indeed', name: 'Indeed', region: 'vietnam', domains: ['indeed.com', 'indeed.vn'], ctaLabel: 'View on Indeed' },
  { id: 'src-glints', name: 'Glints', region: 'vietnam', domains: ['glints.com'], ctaLabel: 'View on Glints' },
  { id: 'src-ybox', name: 'Ybox', region: 'vietnam', domains: ['ybox.vn'], ctaLabel: 'View on Ybox' },
  { id: 'src-trustingsocial', name: 'TrustingSocial', region: 'vietnam', domains: ['trustingsocial.com'], ctaLabel: 'View on TrustingSocial' },
  { id: 'src-jobsgo', name: 'JobsGO', region: 'vietnam', domains: ['jobsgo.vn'], ctaLabel: 'View on JobsGO' },

  // Social / Community
  { id: 'src-facebook', name: 'Facebook', region: 'social', domains: ['facebook.com', 'fb.com'], ctaLabel: 'View on Facebook' },
  { id: 'src-x', name: 'X', region: 'social', domains: ['x.com', 'twitter.com'], ctaLabel: 'View on X' },
  { id: 'src-threads', name: 'Threads', region: 'social', domains: ['threads.com', 'threads.net'], ctaLabel: 'View on Threads' },

  // Direct
  { id: 'src-company', name: 'Company Site', region: 'direct', domains: [], ctaLabel: 'View on Company Site' },

  // Other
  { id: 'src-others', name: 'Others', region: 'other', domains: [], ctaLabel: 'View Opportunity' },
];

/**
 * Normalizes user-entered URL before validation and storage:
 * - If user enters valid hostname/path without protocol (e.g., linkedin.com/jobs/...), automatically prepends https://
 * - Preserves existing http:// or https://
 * - Rejects genuinely malformed inputs (spaces, missing TLD, invalid schemes like foo://, bare words like linkedin)
 */
export function normalizeJobUrl(input: string): { normalized: string; isValid: boolean; hostname: string; error?: string } {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return { normalized: '', isValid: false, hostname: '', error: 'URL is required' };
  }

  // Reject obvious invalid strings like text with spaces
  if (/\s/.test(trimmed)) {
    return { normalized: trimmed, isValid: false, hostname: '', error: 'URL cannot contain spaces' };
  }

  let testUrl = trimmed;
  // If no scheme present, prepend https://
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    testUrl = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(testUrl);
    // Protocol must be http: or https:
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { normalized: testUrl, isValid: false, hostname: '', error: 'URL must use http or https' };
    }

    const host = parsed.hostname.toLowerCase();
    // Hostname must contain at least one dot (e.g. linkedin.com, ybox.vn) and not end/start with dot
    if (!host.includes('.') || host.startsWith('.') || host.endsWith('.')) {
      return { normalized: testUrl, isValid: false, hostname: '', error: 'Please enter a valid domain name' };
    }

    const parts = host.split('.');
    const tld = parts[parts.length - 1];
    if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
      return { normalized: testUrl, isValid: false, hostname: '', error: 'Please enter a valid top-level domain' };
    }

    return { normalized: testUrl, isValid: true, hostname: host };
  } catch {
    return { normalized: testUrl, isValid: false, hostname: '', error: 'Please enter a valid URL' };
  }
}

/**
 * Resolve Job Source and CTA action label from URL and optional fallback name using hostname/domain mapping
 */
export function resolveJobSource(
  url?: string,
  manualSource?: string,
  companyName?: string
): { sourceName: string; ctaLabel: string; isCompanySite: boolean; sourceId: string } {
  if (url && url.trim()) {
    const norm = normalizeJobUrl(url);
    if (norm.isValid && norm.hostname) {
      const hostname = norm.hostname;

      for (const src of CANONICAL_JOB_SOURCES) {
        if (src.domains.some(d => hostname === d || hostname.endsWith('.' + d))) {
          return {
            sourceName: src.name,
            ctaLabel: src.ctaLabel,
            isCompanySite: false,
            sourceId: src.id,
          };
        }
      }

      // If it's a valid URL with a company or custom domain, identify as Company Site
      const cleanHost = hostname.replace(/^www\./, '');
      const cta = companyName ? `Apply on ${companyName}` : `Apply on ${cleanHost}`;
      return {
        sourceName: 'Company Site',
        ctaLabel: cta,
        isCompanySite: true,
        sourceId: 'src-company',
      };
    }
  }

  // If manual source provided
  if (manualSource) {
    const matched = CANONICAL_JOB_SOURCES.find(
      s => s.name.toLowerCase() === manualSource.toLowerCase() || s.id === manualSource
    );
    if (matched) {
      return {
        sourceName: matched.name,
        ctaLabel: matched.ctaLabel,
        isCompanySite: matched.id === 'src-company',
        sourceId: matched.id,
      };
    }
    return {
      sourceName: manualSource,
      ctaLabel: `View on ${manualSource}`,
      isCompanySite: manualSource.toLowerCase().includes('company'),
      sourceId: 'src-others',
    };
  }

  return {
    sourceName: 'Company Site',
    ctaLabel: companyName ? `Apply at ${companyName}` : 'View Opportunity',
    isCompanySite: true,
    sourceId: 'src-company',
  };
}

/**
 * Helper to assess deadline status
 */
export function getDeadlineInfo(
  deadlineStr?: string,
  deadlineType?: 'explicit' | 'estimated' | 'manual' | 'none'
): {
  status: 'active' | 'approaching' | 'passed' | 'none';
  label: string;
  isEstimated?: boolean;
  daysRemaining?: number;
  formattedDate?: string;
} {
  if (!deadlineStr || deadlineStr === 'No deadline specified' || deadlineStr === 'Open until filled / Not specified' || deadlineStr.trim() === '') {
    return {
      status: 'none',
      label: 'Open until filled / Not specified',
      isEstimated: false,
    };
  }

  try {
    const deadlineDate = new Date(deadlineStr);
    if (isNaN(deadlineDate.getTime())) {
      return {
        status: 'none',
        label: deadlineStr,
        isEstimated: deadlineType === 'estimated',
      };
    }

    const now = new Date();
    // Reset hours for day difference calculation
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = deadlineDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const isEstimated = deadlineType === 'estimated';

    if (diffDays < 0) {
      return {
        status: 'passed',
        label: isEstimated ? `Estimated deadline passed (${formattedDate})` : `Deadline passed (${formattedDate})`,
        isEstimated,
        daysRemaining: diffDays,
        formattedDate,
      };
    } else if (diffDays <= 7) {
      return {
        status: 'approaching',
        label: isEstimated 
          ? `Estimated: ${diffDays === 0 ? 'today' : diffDays === 1 ? '1 day left' : `${diffDays} days left`} (+1 mo)`
          : (diffDays === 0 ? 'Deadline today' : diffDays === 1 ? '1 day left' : `${diffDays} days left`),
        isEstimated,
        daysRemaining: diffDays,
        formattedDate,
      };
    } else {
      return {
        status: 'active',
        label: isEstimated ? `Estimated: ${formattedDate} (+1 month from posting)` : `Deadline: ${formattedDate}`,
        isEstimated,
        daysRemaining: diffDays,
        formattedDate,
      };
    }
  } catch {
    return {
      status: 'none',
      label: deadlineStr,
      isEstimated: deadlineType === 'estimated',
    };
  }
}
