import {
  WorkExperienceRecord,
  UserProvidedExperienceData,
  CareerOSInferredExperienceIntelligence
} from './workExperienceService';

export type CsvImportProcessingStep =
  | 'importing'
  | 'reading_records'
  | 'structuring_experience'
  | 'classifying_roles_domains'
  | 'extracting_evidence'
  | 'ready_for_review';

export const CSV_PROCESSING_STEPS: {
  id: CsvImportProcessingStep;
  label: string;
  shortLabel: string;
}[] = [
  { id: 'importing', label: 'Importing', shortLabel: '1. Importing CSV' },
  { id: 'reading_records', label: 'Reading records', shortLabel: '2. Reading records' },
  { id: 'structuring_experience', label: 'Structuring experience', shortLabel: '3. Structuring experience' },
  { id: 'classifying_roles_domains', label: 'Classifying roles & domains', shortLabel: '4. Classifying roles & domains' },
  { id: 'extracting_evidence', label: 'Extracting evidence', shortLabel: '5. Extracting evidence' },
  { id: 'ready_for_review', label: 'Ready for review', shortLabel: '6. Ready for review' }
];

export interface RawCsvWorkExperienceRow {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  currentRole?: string;
  location?: string;
  description?: string;
  achievements?: string;
}

export interface StagedWorkExperienceImportItem {
  stagingId: string;
  status: 'pending' | 'accepted' | 'discarded';
  record: Omit<WorkExperienceRecord, 'id' | 'updatedAt'> & {
    userProvided: UserProvidedExperienceData;
    inferredIntelligence: CareerOSInferredExperienceIntelligence;
  };
}

export interface CsvImportBatchSummary {
  fileName: string;
  importedAt: string;
  items: StagedWorkExperienceImportItem[];
  totalDetected: number;
  rolesClassifiedCount: number;
  competenciesDetectedCount: number;
  measurableOutcomesCount: number;
}

/**
 * Canonical lightweight CSV template columns:
 * Required: Company, Role / Job Title, Start Date
 * Optional: End Date, Current Role, Location, Description / What You Did, Key Achievements / Outcomes
 */
export const WORK_EXPERIENCE_CSV_HEADERS = [
  'Company',
  'Role / Job Title',
  'Start Date',
  'End Date',
  'Current Role',
  'Location',
  'Description / What You Did',
  'Key Achievements / Outcomes'
] as const;

export const SAMPLE_WORK_EXPERIENCE_CSV = `Company,Role / Job Title,Start Date,End Date,Current Role,Location,Description / What You Did,Key Achievements / Outcomes
Stripe,Product Manager,2023-06,Present,Yes,"San Francisco, CA","Led platform improvements for enterprise customers across global payment APIs, checkout reliability, and multi-workspace permissions.","Increased enterprise onboarding velocity by 38%; Reduced API integration errors by 45%; Supported $40M+ daily payment volume"
Figma,Senior Product Manager — Workspaces,2021-04,2023-05,No,"San Francisco, CA (Hybrid)","Owned collaborative design-to-code handoff workflows, developer inspection tools, and enterprise admin governance controls.","Lifted trial-to-paid conversion from 19% to 31% (+12% lift); Cut time-to-first-collaboration to 90 seconds"
Plaid,Platform Software Engineer,2019-07,2021-03,No,"New York, NY","Built financial data aggregation connectors, idempotent webhook delivery pipelines, and developer SDK diagnostics.","Achieved 99.98% webhook delivery reliability; Reduced p99 sync latency from 320ms to 42ms"
Datadog,Product & Systems Operations Analyst,2018-01,2019-06,No,"Boston, MA","Analyzed cloud infrastructure telemetry adoption and partnered with engineering teams on alerting reliability and customer activation.","Automated onboarding health checks across 1,200+ cloud accounts; Cut support escalations by 28%"`;

/**
 * Triggers a browser download of the lightweight CareerOS Work Experience CSV template
 */
export function downloadWorkExperienceCsvTemplate(): void {
  const blob = new Blob([SAMPLE_WORK_EXPERIENCE_CSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'careeros_work_experience_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * RFC-4180 compliant CSV parser supporting quoted strings, commas, and multiline cells
 */
function parseCsvGrid(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  const normalized = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!normalized) return [];

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    const nextCh = normalized[i + 1];

    if (inQuotes) {
      if (ch === '"' && nextCh === '"') {
        currentCell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentCell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (ch === '\n') {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += ch;
      }
    }
  }

  currentRow.push(currentCell.trim());
  if (currentRow.some(cell => cell.length > 0)) {
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Parses CSV text into RawCsvWorkExperienceRow items.
 * Enforces minimal required fields: Company, Role / Job Title, Start Date.
 */
export function parseWorkExperienceCsv(csvText: string): {
  rows: RawCsvWorkExperienceRow[];
  errors: string[];
} {
  const grid = parseCsvGrid(csvText);
  if (grid.length < 2) {
    return {
      rows: [],
      errors: ['The CSV file must contain a header row and at least one work experience row.']
    };
  }

  const headerRow = grid[0].map(h => h.toLowerCase().trim());

  const findColIndex = (patterns: string[], fallbackIdx: number): number => {
    const found = headerRow.findIndex(h => patterns.some(p => h.includes(p)));
    return found !== -1 ? found : fallbackIdx;
  };

  const companyIdx = findColIndex(['company', 'organization', 'employer'], 0);
  const roleIdx = findColIndex(['role', 'job title', 'title', 'position'], 1);
  const startIdx = findColIndex(['start date', 'start', 'from'], 2);
  const endIdx = findColIndex(['end date', 'end', 'to'], 3);
  const currentIdx = findColIndex(['current role', 'current', 'present'], 4);
  const locationIdx = findColIndex(['location', 'city', 'work mode'], 5);
  const descIdx = findColIndex(['description', 'what you did', 'summary', 'responsibilities', 'scope'], 6);
  const achIdx = findColIndex(['achievement', 'outcome', 'impact', 'metric', 'result'], 7);

  const validRows: RawCsvWorkExperienceRow[] = [];
  const errors: string[] = [];

  for (let r = 1; r < grid.length; r++) {
    const row = grid[r];
    const company = (row[companyIdx] || '').trim();
    const role = (row[roleIdx] || '').trim();
    const startDate = (row[startIdx] || '').trim();

    // Skip completely blank lines
    if (!company && !role && !startDate) continue;

    const missing: string[] = [];
    if (!company) missing.push('Company');
    if (!role) missing.push('Role / Job Title');
    if (!startDate) missing.push('Start Date');

    if (missing.length > 0) {
      errors.push(`Row ${r + 1}: Missing required field(s): ${missing.join(', ')}.`);
      continue;
    }

    validRows.push({
      company,
      role,
      startDate,
      endDate: (row[endIdx] || '').trim() || undefined,
      currentRole: (row[currentIdx] || '').trim() || undefined,
      location: (row[locationIdx] || '').trim() || undefined,
      description: (row[descIdx] || '').trim() || undefined,
      achievements: (row[achIdx] || '').trim() || undefined
    });
  }

  if (validRows.length === 0 && errors.length === 0) {
    errors.push('No valid work experience rows found. Required fields: Company, Role / Job Title, Start Date.');
  }

  return { rows: validRows, errors };
}

/**
 * Formats user-provided start/end dates into a clean display range
 */
function formatDateRange(startDate: string, endDate?: string, isCurrent?: boolean): {
  displayDates: string;
  compactDates: string;
} {
  const startYearMatch = startDate.match(/\b(19|20)\d{2}\b/);
  const startYear = startYearMatch ? startYearMatch[0] : startDate;

  if (isCurrent || !endDate || /present|current|now/i.test(endDate)) {
    return {
      displayDates: `${startDate} — Present`,
      compactDates: `${startYear}–Present`
    };
  }

  const endYearMatch = endDate.match(/\b(19|20)\d{2}\b/);
  const endYear = endYearMatch ? endYearMatch[0] : endDate;

  return {
    displayDates: `${startDate} — ${endDate}`,
    compactDates: `${startYear}–${endYear}`
  };
}

/**
 * CareerOS Post-Import Intelligence & Taxonomy Classification Engine
 * Infers Role Family, Functional Area, Domain, Industry, Seniority,
 * Product/Technology/Business/Operations relationships, Capabilities, Skills, Tools,
 * Responsibilities, Achievements, Quantitative Evidence, Stakeholders, and Career Trajectory
 * while preserving the user's raw text as the source material.
 */
export function classifyAndStructureCsvRow(
  raw: RawCsvWorkExperienceRow,
  index: number
): StagedWorkExperienceImportItem {
  const isCurrent =
    /^(yes|true|1|y|current|present)$/i.test(raw.currentRole || '') ||
    /present|current|now/i.test(raw.endDate || '');

  const { displayDates, compactDates } = formatDateRange(raw.startDate, raw.endDate, isCurrent);

  const combinedCorpus = `${raw.company} ${raw.role} ${raw.description || ''} ${raw.achievements || ''}`.toLowerCase();

  // 1. Infer Role Family & Functional Area
  let roleFamily = 'Product Management';
  let functionalArea = 'Platform Product';
  let relationshipPillars: string[] = ['Product', 'Technology', 'Business'];

  if (/engineer|developer|architect|sre|devops|backend|frontend|fullstack|infrastructure/i.test(raw.role)) {
    roleFamily = 'Software Engineering';
    if (/platform|infra|distributed|systems|backend|data/i.test(combinedCorpus)) {
      functionalArea = 'Platform & Core Infrastructure';
      relationshipPillars = ['Technology', 'Product', 'Operations'];
    } else {
      functionalArea = 'Product & Application Engineering';
      relationshipPillars = ['Technology', 'Product'];
    }
  } else if (/data|machine learning|ai |ml |analytics|scientist/i.test(raw.role)) {
    roleFamily = 'Data & Machine Learning';
    functionalArea = 'Applied AI & Decision Intelligence';
    relationshipPillars = ['Technology', 'Product', 'Business'];
  } else if (/operations|ops|analyst|program|strategy|delivery/i.test(raw.role) && !/product manager/i.test(raw.role)) {
    roleFamily = 'Product & Technical Operations';
    functionalArea = 'Systems & Growth Operations';
    relationshipPillars = ['Operations', 'Product', 'Business'];
  } else {
    roleFamily = 'Product Management';
    if (/platform|api|infra|enterprise|developer|permissions|sync/i.test(combinedCorpus)) {
      functionalArea = 'Platform Product';
      relationshipPillars = ['Product', 'Technology', 'Business'];
    } else if (/growth|onboarding|activation|funnel|plg/i.test(combinedCorpus)) {
      functionalArea = 'Growth & Product-Led Activation';
      relationshipPillars = ['Product', 'Business', 'Operations'];
    } else {
      functionalArea = 'Core Product Strategy';
      relationshipPillars = ['Product', 'Business', 'Technology'];
    }
  }

  // 2. Infer Domain & Industry
  let domain = 'Enterprise SaaS';
  let industry = 'SaaS';

  if (/stripe|plaid|ramp|robinhood|brex|block|adyen|paypal|fintech|payment|billing|ledger|financial|bank/i.test(combinedCorpus)) {
    domain = 'FinTech';
    industry = 'SaaS';
  } else if (/anthropic|openai|cohere|huggingface|ai |llm|agentic|machine learning|model/i.test(combinedCorpus)) {
    domain = 'AI & Machine Learning';
    industry = 'AI Systems & SaaS';
  } else if (/datadog|aws|cloudflare|vercel|hashicorp|snowflake|cloud|telemetry|observability|kubernetes|infra/i.test(combinedCorpus)) {
    domain = 'Cloud Infrastructure';
    industry = 'Cloud & DevTools';
  } else if (/figma|linear|notion|slack|atlassian|workspace|collaborat|design/i.test(combinedCorpus)) {
    domain = 'Collaborative Workspaces';
    industry = 'SaaS';
  }

  // 3. Infer Seniority
  let seniority = 'Senior-level scope';
  if (/principal|staff|director|vp|head of|lead/i.test(raw.role)) {
    seniority = 'Lead / Staff-level scope';
  } else if (/associate|junior|intern|coordinator|analyst/i.test(raw.role)) {
    seniority = 'Foundational / Mid-level scope';
  } else if (/enterprise|platform|global|\$\d+m|architecture|multi-workspace/i.test(combinedCorpus)) {
    seniority = 'Senior-level scope';
  } else {
    seniority = 'Senior-level scope';
  }

  // 4. Parse user-provided Description & Achievements into structured Responsibilities, Achievements & Quantitative Outcomes
  const splitSentences = (text?: string): string[] => {
    if (!text) return [];
    return text
      .split(/[;\n•]+|(?<=\.)\s+(?=[A-Z])/)
      .map(s => s.replace(/^[-*•\s]+/, '').trim())
      .filter(s => s.length > 4);
  };

  const userDescSentences = splitSentences(raw.description);
  const userAchSentences = splitSentences(raw.achievements);

  // Executive Scope & Mandate (preserves user description at forefront + contextual scope framing)
  const scope = raw.description
    ? raw.description.trim()
    : `Led ${functionalArea.toLowerCase()} execution and cross-functional delivery as ${raw.role} at ${raw.company} within the ${domain} domain.`;

  // Responsibilities
  const responsibilities: string[] =
    userDescSentences.length > 0
      ? [
          ...userDescSentences,
          ...(userDescSentences.length === 1
            ? [
                `Defined ${functionalArea.toLowerCase()} priorities, system requirements, and stakeholder alignment across ${relationshipPillars.join(', ')} teams at ${raw.company}.`,
                `Established operational quality checkpoints and delivery governance for ${domain} customers.`
              ]
            : [])
        ]
      : [
          `Owned ${functionalArea.toLowerCase()} roadmap and execution as ${raw.role} at ${raw.company}.`,
          `Collaborated across ${relationshipPillars.join(', ')} stakeholders to ship reliable ${domain} capabilities.`
        ];

  // Extract quantitative metrics from raw achievements or description
  const allSentences = [...userAchSentences, ...userDescSentences];
  const metricMatches = allSentences.filter(s =>
    /(\d+%|\$\d+|\d+x|\d+\s*(ms|s|seconds|mins|minutes|hours|days|m|k|b|customers|accounts|users|records|uptime|reliability))/i.test(s)
  );

  const achievements: string[] =
    userAchSentences.length > 0
      ? userAchSentences
      : metricMatches.length > 0
      ? metricMatches
      : [
          `Delivered core ${functionalArea.toLowerCase()} milestones for ${raw.company} enterprise and platform stakeholders.`,
          `Improved workflow reliability and cross-team execution velocity across ${domain} initiatives.`
        ];

  const measurableOutcomes: string[] =
    metricMatches.length > 0
      ? metricMatches.slice(0, 4).map(m => (m.length > 72 ? `${m.slice(0, 69)}...` : m))
      : userAchSentences.length > 0
      ? userAchSentences.slice(0, 3)
      : [
          `${functionalArea} delivery at ${raw.company}`,
          `${seniority} execution across ${relationshipPillars.slice(0, 2).join(' & ')}`
        ];

  // 5. Infer Capabilities, Skills, and Tools/Technologies
  const capabilitiesSet = new Set<string>();
  const skillsSet = new Set<string>();
  const toolsSet = new Set<string>();
  const stakeholdersSet = new Set<string>(['Engineering Teams', 'Product Leadership']);

  if (roleFamily === 'Product Management') {
    capabilitiesSet.add('Product Strategy & Roadmapping');
    capabilitiesSet.add('Cross-Functional Execution & Governance');
    skillsSet.add('Product Strategy');
    skillsSet.add('Stakeholder Alignment');
    toolsSet.add('SQL & Product Telemetry');
  } else if (roleFamily === 'Software Engineering') {
    capabilitiesSet.add('Distributed Systems & Platform Architecture');
    capabilitiesSet.add('Production Reliability & Latency Optimization');
    skillsSet.add('Distributed Systems');
    skillsSet.add('System Architecture');
    toolsSet.add('PostgreSQL');
  } else {
    capabilitiesSet.add('Operational Systems & Analytics');
    capabilitiesSet.add('Cross-Functional Process Optimization');
    skillsSet.add('Product Operations');
    skillsSet.add('Data & Funnel Analytics');
    toolsSet.add('SQL & BI Dashboards');
  }

  if (domain === 'FinTech') {
    capabilitiesSet.add('Enterprise Payment & Platform Systems');
    skillsSet.add('FinTech & Payment APIs');
    skillsSet.add('Enterprise Platform Scaling');
    toolsSet.add('Payment Ledger APIs');
    stakeholdersSet.add('Enterprise Customers');
    stakeholdersSet.add('Compliance & Risk Partners');
  }
  if (/enterprise|customer|b2b|permission|governance/i.test(combinedCorpus)) {
    capabilitiesSet.add('Enterprise Customer Scaling & Governance');
    skillsSet.add('Enterprise Permissions & Governance');
    stakeholdersSet.add('Enterprise Customers');
  }
  if (/onboarding|conversion|trial|plg|funnel|activation/i.test(combinedCorpus)) {
    capabilitiesSet.add('PLG Funnel & Activation Optimization');
    skillsSet.add('PLG Funnels');
    skillsSet.add('Activation Analytics');
    toolsSet.add('Cohort & Funnel Telemetry');
    stakeholdersSet.add('Growth & Design Squads');
  }
  if (/api|webhook|sdk|developer|integration|platform/i.test(combinedCorpus)) {
    capabilitiesSet.add('API Platform & Developer Experience');
    skillsSet.add('API Design & Governance');
    skillsSet.add('Developer Experience');
    toolsSet.add('REST / Webhook APIs');
  }
  if (/latency|reliability|99\.9|idempoten|sync|pipeline|telemetry/i.test(combinedCorpus)) {
    skillsSet.add('High-Availability Systems');
    toolsSet.add('Observability & Telemetry');
  }

  const capabilities = Array.from(capabilitiesSet).slice(0, 4);
  const skills = Array.from(skillsSet).slice(0, 5);
  const tools = Array.from(toolsSet).slice(0, 4);
  const relevantSkills = Array.from(new Set([...skills, ...tools])).slice(0, 6);
  const stakeholders = Array.from(stakeholdersSet).slice(0, 4);

  const keywords = Array.from(
    new Set([roleFamily, domain, industry, functionalArea, ...skills.slice(0, 3)])
  );

  const importedSummaryLine = `${raw.role} — ${raw.company} — ${compactDates}`;
  const intelligenceSummaryLine = `${roleFamily} · ${domain} · ${industry} · ${functionalArea} · ${seniority}`;

  const userProvided: UserProvidedExperienceData = {
    company: raw.company,
    role: raw.role,
    startDate: raw.startDate,
    endDate: raw.endDate || (isCurrent ? 'Present' : undefined),
    currentRole: isCurrent,
    location: raw.location,
    rawDescription: raw.description,
    rawAchievements: raw.achievements,
    importedSummaryLine
  };

  const inferredIntelligence: CareerOSInferredExperienceIntelligence = {
    roleFamily,
    functionalArea,
    domain,
    industry,
    seniority,
    relationshipPillars,
    capabilities,
    skills,
    tools,
    stakeholders,
    keywords,
    careerTrajectory: `${raw.role} (${domain}) → ${seniority}`,
    evidenceRelationships: [
      'Indexed in CareerOS Evidence Ledger',
      `Mapped to ${roleFamily} & ${domain} Readiness`
    ],
    intelligenceSummaryLine
  };

  return {
    stagingId: `csv-stage-${Date.now()}-${index}`,
    status: 'pending',
    record: {
      company: raw.company,
      role: raw.role,
      dates: displayDates,
      location: raw.location || 'Remote / Hybrid',
      scope,
      responsibilities,
      achievements,
      measurableOutcomes,
      relevantSkills,
      provenance: 'extracted',
      sourceText: [raw.description, raw.achievements].filter(Boolean).join(' | '),
      userProvided,
      inferredIntelligence
    }
  };
}

/**
 * Runs the 6-step progressive CareerOS CSV Import & Classification pipeline:
 * Importing → Reading records → Structuring experience → Classifying roles & domains → Extracting evidence → Ready for review
 */
export async function processWorkExperienceCsvImport(
  csvText: string,
  fileName: string,
  onStepChange?: (step: CsvImportProcessingStep, progressPercent: number) => void
): Promise<{
  batch?: CsvImportBatchSummary;
  errors: string[];
}> {
  onStepChange?.('importing', 15);
  await new Promise(r => setTimeout(r, 180));

  onStepChange?.('reading_records', 32);
  const { rows, errors } = parseWorkExperienceCsv(csvText);
  if (rows.length === 0) {
    return { errors };
  }
  await new Promise(r => setTimeout(r, 200));

  onStepChange?.('structuring_experience', 54);
  await new Promise(r => setTimeout(r, 220));

  onStepChange?.('classifying_roles_domains', 76);
  const stagedItems = rows.map((row, idx) => classifyAndStructureCsvRow(row, idx));
  await new Promise(r => setTimeout(r, 220));

  onStepChange?.('extracting_evidence', 92);
  await new Promise(r => setTimeout(r, 180));

  const uniqueCompetencies = new Set<string>();
  let totalOutcomes = 0;

  stagedItems.forEach(item => {
    item.record.relevantSkills.forEach(sk => uniqueCompetencies.add(sk));
    item.record.inferredIntelligence.capabilities.forEach(cap => uniqueCompetencies.add(cap));
    totalOutcomes += item.record.measurableOutcomes.length;
  });

  const batch: CsvImportBatchSummary = {
    fileName,
    importedAt: new Date().toISOString(),
    items: stagedItems,
    totalDetected: stagedItems.length,
    rolesClassifiedCount: stagedItems.length,
    competenciesDetectedCount: uniqueCompetencies.size,
    measurableOutcomesCount: totalOutcomes
  };

  onStepChange?.('ready_for_review', 100);
  return { batch, errors };
}
