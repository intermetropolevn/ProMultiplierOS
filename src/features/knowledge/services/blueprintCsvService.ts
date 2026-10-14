import { 
  StructuredAnswerBlueprint, 
  BlueprintFramework,
  StructuredAnswerComponents 
} from '../types';
import { AVAILABLE_INTERVIEWER_ROLES, InterviewerRoleType } from '../../../components/practice/live/liveInterviewData';

// ---------------------------------------------------------------------------
// 14. Canonical Field Definition Configuration (Single Source of Truth)
// ---------------------------------------------------------------------------

export interface BlueprintCsvFieldDefinition {
  field: string;
  header: string;
  label: string;
  required: boolean | 'CONDITIONAL';
  description: string;
  example: string;
  aliases?: string[];
}

export const BLUEPRINT_CSV_FIELD_DEFINITIONS: BlueprintCsvFieldDefinition[] = [
  {
    field: 'operation',
    header: 'operation',
    label: 'Operation',
    required: true,
    description: 'The mutation action: CREATE, UPDATE, or DELETE',
    example: 'CREATE',
    aliases: ['op', 'action']
  },
  {
    field: 'blueprint_id',
    header: 'blueprint_id',
    label: 'Blueprint ID',
    required: 'CONDITIONAL',
    description: 'Unique identifier required for UPDATE or DELETE (e.g. bp-123456)',
    example: 'bp-custom-career-trajectory',
    aliases: ['id', 'blueprintId']
  },
  {
    field: 'blueprint_title',
    header: 'blueprint_title',
    label: 'Blueprint Title',
    required: true,
    description: 'Internal reference title / scenario name for this answer blueprint',
    example: 'Payment Gateway Idempotency & Latency Optimization',
    aliases: ['title', 'blueprintTitle']
  },
  {
    field: 'interview_question',
    header: 'interview_question',
    label: 'Interview Question',
    required: true,
    description: 'Actual prompt question asked by the interviewer',
    example: 'Tell me about a high-stakes production system failure you diagnosed under pressure.',
    aliases: ['question', 'prompt', 'prompt_question', 'question_text']
  },
  {
    field: 'framework',
    header: 'framework',
    label: 'Answer Framework',
    required: true,
    description: 'CUSTOM, STAR, CAR, or PROBLEM_DECISION_IMPACT',
    example: 'CUSTOM',
    aliases: ['structure', 'framework_code']
  },
  {
    field: 'target_role_category',
    header: 'target_role_category',
    label: 'Target Role Category',
    required: false,
    description: 'Career discipline (e.g. Software Engineering, Product Management)',
    example: 'Software Engineering',
    aliases: ['role', 'targetRole', 'category']
  },
  {
    field: 'target_job_title',
    header: 'target_job_title',
    label: 'Target Job Title',
    required: false,
    description: 'Specific target job title (e.g. Senior Distributed Systems Engineer)',
    example: 'Staff Backend Architect',
    aliases: ['targetJob', 'job_title', 'job']
  },
  {
    field: 'target_company',
    header: 'target_company',
    label: 'Target Company',
    required: false,
    description: 'Target company or employer name if tailored',
    example: 'Stripe',
    aliases: ['company', 'targetCompany']
  },
  {
    field: 'context',
    header: 'context',
    label: 'Context',
    required: false,
    description: 'Background environment, high-level situation, or organizational stakes',
    example: 'Led a zero-downtime database cutover for 12M customer records.',
    aliases: ['background', 'situation']
  },
  {
    field: 'solution_impact',
    header: 'solution_impact',
    label: 'Solution & Impact',
    required: false,
    description: 'Structured answer content supporting multiline Markdown (## Headings, - Bullets, **Bold**)',
    example: '## Approach\\n- Implemented Redis atomic locks\\n- Zero duplicate charges across $45M volume',
    aliases: ['solution_and_impact', 'answer', 'solution', 'impact']
  },
  {
    field: 'assigned_roles',
    header: 'assigned_roles',
    label: 'Assigned Interviewer Roles',
    required: false,
    description: 'Interviewer roles mapped to this blueprint separated by semicolon ; or |',
    example: 'Engineering Lead;Technical Interviewer;Peer',
    aliases: ['roles', 'assignedRoles', 'interviewer_roles']
  }
];

export const CANONICAL_CSV_HEADERS = BLUEPRINT_CSV_FIELD_DEFINITIONS.map(d => d.header);

export type CsvOperation = 'CREATE' | 'UPDATE' | 'DELETE';

export type CsvFrameworkCode = 'CUSTOM' | 'STAR' | 'CAR' | 'PROBLEM_DECISION_IMPACT';

export interface ParsedCsvRow {
  rowNumber: number;
  operation: CsvOperation;
  rawOperation: string;
  blueprint_id: string;
  blueprint_title: string;
  interview_question: string;
  framework: BlueprintFramework;
  rawFramework: string;
  target_role_category: string;
  target_job_title: string;
  target_company: string;
  context: string;
  solution_impact: string;
  assigned_roles: string[];
  metrics?: string[];
  rawFields: Record<string, string>;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  // For update/delete preview
  existingBlueprint?: StructuredAnswerBlueprint;
  diffSummary?: string[];
}

export interface CsvValidationResult {
  totalRows: number;
  validCount: number;
  createCount: number;
  updateCount: number;
  deleteCount: number;
  errorCount: number;
  rows: ParsedCsvRow[];
  globalErrors: string[];
}

// ---------------------------------------------------------------------------
// RFC 4180 CSV Generator & Parser Helpers
// ---------------------------------------------------------------------------

/**
 * Safely escape a single cell value according to RFC 4180 rules.
 */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Join row values into a valid CSV line.
 */
export function stringifyCsvRow(cells: unknown[]): string {
  return cells.map(escapeCsvCell).join(',');
}

/**
 * Robust RFC 4180 CSV parser handling multi-line strings, quotes, and commas.
 */
export function parseCsvText(csvText: string): string[][] {
  const cleanText = csvText.replace(/^\uFEFF/, ''); // strip BOM if present
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;
  let i = 0;

  while (i < cleanText.length) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped double quote
          currentCell += '"';
          i += 2;
          continue;
        } else {
          // Closing quote
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentCell += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
        i++;
        continue;
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++; // skip \r, next will handle \n
        }
        currentRow.push(currentCell.trim());
        currentCell = '';
        rows.push(currentRow);
        currentRow = [];
        i++;
        continue;
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        currentCell = '';
        rows.push(currentRow);
        currentRow = [];
        i++;
        continue;
      } else {
        currentCell += char;
        i++;
        continue;
      }
    }
  }

  // Final flush
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  // Filter out completely empty rows
  return rows.filter(r => r.length > 0 && r.some(cell => cell.trim().length > 0));
}

// ---------------------------------------------------------------------------
// Framework & Role Taxonomy Normalizers
// ---------------------------------------------------------------------------

export function normalizeFrameworkCode(raw: string): { framework: BlueprintFramework; code: CsvFrameworkCode } | null {
  const norm = (raw || '').trim().toUpperCase().replace(/[\s_\-→]+/g, '_');
  if (norm === 'CUSTOM' || norm === 'CUSTOM_STRUCTURE') {
    return { framework: 'Custom', code: 'CUSTOM' };
  }
  if (norm === 'STAR') {
    return { framework: 'STAR', code: 'STAR' };
  }
  if (norm === 'CAR') {
    return { framework: 'CAR', code: 'CAR' };
  }
  if (
    norm === 'PROBLEM_DECISION_IMPACT' || 
    norm === 'PDI' || 
    norm.includes('PROBLEM')
  ) {
    return { framework: 'Problem → Decision → Impact', code: 'PROBLEM_DECISION_IMPACT' };
  }
  return null;
}

export function frameworkToCsvCode(fw: BlueprintFramework): CsvFrameworkCode {
  switch (fw) {
    case 'Custom':
      return 'CUSTOM';
    case 'STAR':
      return 'STAR';
    case 'CAR':
      return 'CAR';
    case 'Problem → Decision → Impact':
      return 'PROBLEM_DECISION_IMPACT';
    default:
      return 'CUSTOM';
  }
}

/**
 * Match a raw role string against AVAILABLE_INTERVIEWER_ROLES taxonomy
 */
export function normalizeInterviewerRole(rawRole: string): { matchedRole?: InterviewerRoleType; error?: string } {
  const clean = rawRole.trim();
  if (!clean) return {};

  const exactMatch = AVAILABLE_INTERVIEWER_ROLES.find(
    r => r.toLowerCase() === clean.toLowerCase()
  );

  if (exactMatch) {
    return { matchedRole: exactMatch };
  }

  // Fuzzy mapping
  const lower = clean.toLowerCase();
  if (lower.includes('hiring') || lower.includes('hm')) return { matchedRole: 'Hiring Manager' };
  if (lower.includes('recruit') || lower.includes('talent') || lower.includes('sourcer')) return { matchedRole: 'Recruiter' };
  if (lower.includes('eng lead') || lower.includes('engineering lead') || lower.includes('em') || lower.includes('tech lead')) return { matchedRole: 'Engineering Lead' };
  if (lower.includes('product') || lower.includes('pm')) return { matchedRole: 'Product Manager' };
  if (lower.includes('tech') || lower.includes('coding') || lower.includes('system design')) return { matchedRole: 'Technical Interviewer' };
  if (lower.includes('peer') || lower.includes('colleague')) return { matchedRole: 'Peer' };
  if (lower.includes('cross') || lower.includes('partner') || lower.includes('stakeholder')) return { matchedRole: 'Cross-functional Partner' };
  if (lower.includes('exec') || lower.includes('director') || lower.includes('vp') || lower.includes('c-level')) return { matchedRole: 'Executive' };

  return { error: `Unknown interviewer role: "${clean}". Allowed: ${AVAILABLE_INTERVIEWER_ROLES.join(', ')}` };
}

// ---------------------------------------------------------------------------
// 14. Dynamic Template Generator from Blueprint Schema
// ---------------------------------------------------------------------------

export function generateCsvTemplate(): string {
  // Headers dynamically generated from single schema definition
  const header = stringifyCsvRow(CANONICAL_CSV_HEADERS);

  const rows = [
    // 1. Custom Structure CREATE
    stringifyCsvRow([
      'CREATE',
      '',
      'Stakeholder Conflict Resolution',
      'Tell me about a time you disagreed with a technical leader. How did you resolve the conflict?',
      'CUSTOM',
      'Product Management',
      'Senior Product Manager',
      'Acme Corp',
      'Led an infrastructure migration where engineering and product disagreed on timeline vs technical debt.',
      '## Solution Approach\n- Scheduled a 1-on-1 discovery session to reframe the conflict around cost-of-delay and customer reliability.\n- Agreed on a 2-week spike with empirical latency benchmarks.\n\n## Impact\n- Successfully launched migration on schedule with 0 unplanned downtime.\n- Established a reusable tech-debt negotiation rubric across 4 teams.',
      'Product Manager;Engineering Lead;Hiring Manager'
    ]),

    // 2. STAR Framework CREATE
    stringifyCsvRow([
      'CREATE',
      '',
      'Payment Gateway Idempotency & Latency Optimization',
      'Tell me about a high-stakes production system failure or race condition you diagnosed and resolved under pressure.',
      'STAR',
      'Software Engineering',
      'Staff Distributed Systems Engineer',
      'Stripe',
      'Mobile checkout race conditions were triggering duplicate charges during 3G cellular network reconnects.',
      '## Situation\nA double-charge race condition occurred during cellular reconnects.\n\n## Task\nArchitect at-most-once payment processing with 0 duplicate transactions and <100ms response time.\n\n## Actions\n- Enforced client-side UUID idempotency keys\n- Implemented Redis atomic distributed locks (SET NX EX 30)\n- Added serializable transactional write guarantees\n\n## Results\n- 0 duplicate charges recorded across $45M in processed volume\n- P99 replay latency reduced to 85ms',
      'Technical Interviewer;Engineering Lead;Peer'
    ]),

    // 3. UPDATE Operation Example
    stringifyCsvRow([
      'UPDATE',
      'bp-custom-career-trajectory',
      'Custom Blueprint: Career Evolution & Technical Philosophy',
      'Walk me through your background, your transition into staff-level technical architecture, and what you look for in your next role.',
      'CUSTOM',
      'Software Engineering',
      'Staff Backend Architect',
      'Fintech Enterprise',
      '8+ years evolving from full-stack engineer to staff platform architect leading multi-team infrastructure decisions.',
      '## Core Focus\n- High-concurrency distributed systems and payment reliability.\n- Technical debt negotiation using business cost-of-delay.\n- Mentoring senior engineers toward staff-plus impact.',
      'Recruiter;Hiring Manager;Executive'
    ]),

    // 4. DELETE Operation Example
    stringifyCsvRow([
      'DELETE',
      'BP-DEPRECATED-EXAMPLE',
      'Deprecated Legacy Interview Blueprint',
      'Archived question to remove from library.',
      'CUSTOM',
      '',
      '',
      '',
      '',
      '',
      ''
    ])
  ];

  return [header, ...rows].join('\r\n');
}

// ---------------------------------------------------------------------------
// 9. Export Blueprints to CSV
// ---------------------------------------------------------------------------

export function exportBlueprintsToCsv(blueprints: StructuredAnswerBlueprint[]): string {
  const header = stringifyCsvRow(CANONICAL_CSV_HEADERS);

  const rows = blueprints.map(bp => {
    const comp = bp.components || {};
    const frameworkCode = frameworkToCsvCode(bp.framework);
    // Use semicolon separation for assigned roles as requested
    const assignedRolesStr = (bp.assignedRoles || []).join(';');

    // Format rich text answer
    let solutionImpactStr = comp.solutionAndImpact || '';
    if (!solutionImpactStr) {
      if (bp.framework === 'STAR') {
        const parts: string[] = [];
        if (comp.situation) parts.push(`## Situation\n${comp.situation}`);
        if (comp.task) parts.push(`## Task\n${comp.task}`);
        if (comp.action && comp.action.length > 0) parts.push(`## Actions\n${comp.action.map(a => `- ${a}`).join('\n')}`);
        if (comp.result && comp.result.length > 0) parts.push(`## Results\n${comp.result.map(r => `- ${r}`).join('\n')}`);
        solutionImpactStr = parts.join('\n\n');
      } else if (bp.framework === 'CAR') {
        const parts: string[] = [];
        if (comp.action && comp.action.length > 0) parts.push(`## Actions\n${comp.action.map(a => `- ${a}`).join('\n')}`);
        if (comp.result && comp.result.length > 0) parts.push(`## Results\n${comp.result.map(r => `- ${r}`).join('\n')}`);
        solutionImpactStr = parts.join('\n\n');
      } else if (bp.framework === 'Problem → Decision → Impact') {
        const parts: string[] = [];
        if (comp.problem) parts.push(`## Problem\n${comp.problem}`);
        if (comp.decision) parts.push(`## Decision\n${comp.decision}`);
        if (comp.impact && comp.impact.length > 0) parts.push(`## Impact\n${comp.impact.map(i => `- ${i}`).join('\n')}`);
        solutionImpactStr = parts.join('\n\n');
      }
    }

    return stringifyCsvRow([
      'UPDATE',
      bp.id,
      bp.title || '',
      bp.questionText || '',
      frameworkCode,
      bp.roleCategory || bp.targetRole || '',
      bp.targetJob || '',
      bp.targetCompany || '',
      comp.context || comp.situation || '',
      solutionImpactStr,
      assignedRolesStr
    ]);
  });

  return [header, ...rows].join('\r\n');
}

// ---------------------------------------------------------------------------
// Trigger Client-Side Download
// ---------------------------------------------------------------------------

export function triggerCsvDownload(csvContent: string, fileName: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// CSV Parser, Validator & Preview Generator
// ---------------------------------------------------------------------------

export function parseAndValidateBlueprintCsv(
  csvText: string, 
  existingBlueprints: StructuredAnswerBlueprint[]
): CsvValidationResult {
  const rawRows = parseCsvText(csvText);
  const globalErrors: string[] = [];

  if (rawRows.length === 0) {
    return {
      totalRows: 0,
      validCount: 0,
      createCount: 0,
      updateCount: 0,
      deleteCount: 0,
      errorCount: 0,
      rows: [],
      globalErrors: ['The uploaded CSV file is empty.']
    };
  }

  // Header matching with alias support
  const headerRow = rawRows[0].map(h => h.trim().toLowerCase());
  
  // Find column index mapping
  const colIndex: Record<string, number> = {};
  for (const def of BLUEPRINT_CSV_FIELD_DEFINITIONS) {
    const candidates = [def.header.toLowerCase(), ...(def.aliases || []).map(a => a.toLowerCase())];
    const matchIdx = headerRow.findIndex(h => candidates.includes(h));
    if (matchIdx >= 0) {
      colIndex[def.field] = matchIdx;
    }
  }

  // Check required primary headers
  const essentialFields = ['operation', 'blueprint_title', 'interview_question', 'framework'];
  const missingEssentials = essentialFields.filter(f => colIndex[f] === undefined);

  if (missingEssentials.length > 0) {
    globalErrors.push(
      `CSV is missing essential column(s): ${missingEssentials.join(', ')}. Please use the canonical CSV template.`
    );
    return {
      totalRows: rawRows.length - 1,
      validCount: 0,
      createCount: 0,
      updateCount: 0,
      deleteCount: 0,
      errorCount: rawRows.length - 1,
      rows: [],
      globalErrors
    };
  }

  const getCell = (row: string[], fieldName: string): string => {
    const idx = colIndex[fieldName];
    if (idx === undefined || idx >= row.length) return '';
    return row[idx].trim();
  };

  const existingMap = new Map<string, StructuredAnswerBlueprint>();
  existingBlueprints.forEach(b => existingMap.set(b.id, b));

  const seenUpdateIds = new Set<string>();
  const seenDeleteIds = new Set<string>();
  const parsedRows: ParsedCsvRow[] = [];

  // Parse data rows
  for (let r = 1; r < rawRows.length; r++) {
    const row = rawRows[r];
    const rowNumber = r + 1;

    const rawOp = getCell(row, 'operation').toUpperCase();
    const blueprintId = getCell(row, 'blueprint_id');
    const title = getCell(row, 'blueprint_title');
    const question = getCell(row, 'interview_question');
    const rawFw = getCell(row, 'framework');
    const roleCat = getCell(row, 'target_role_category');
    const jobTitle = getCell(row, 'target_job_title');
    const company = getCell(row, 'target_company');
    const context = getCell(row, 'context');
    const solutionImpact = getCell(row, 'solution_impact');
    const assignedRolesRaw = getCell(row, 'assigned_roles');

    const rowErrors: string[] = [];
    const rowWarnings: string[] = [];

    // 1. Operation validation (CREATE, UPDATE, DELETE)
    let op: CsvOperation = 'CREATE';
    if (rawOp === 'UPDATE') {
      op = 'UPDATE';
    } else if (rawOp === 'DELETE') {
      op = 'DELETE';
    } else if (rawOp === 'CREATE') {
      op = 'CREATE';
    } else if (!rawOp) {
      op = blueprintId ? 'UPDATE' : 'CREATE';
    } else {
      rowErrors.push(`Invalid operation "${rawOp}". Must be CREATE, UPDATE, or DELETE.`);
    }

    // 2. Blueprint ID validation
    if (op === 'CREATE') {
      if (blueprintId) {
        if (existingMap.has(blueprintId)) {
          rowErrors.push(`CREATE records cannot use an existing Blueprint ID: "${blueprintId}". Leave blank or use UPDATE.`);
        } else {
          rowWarnings.push(`Blueprint ID "${blueprintId}" for CREATE will be preserved or assigned canonically.`);
        }
      }
    } else if (op === 'UPDATE') {
      if (!blueprintId) {
        rowErrors.push('blueprint_id is required for UPDATE operation.');
      } else if (!existingMap.has(blueprintId)) {
        rowErrors.push(`Blueprint ID not found in library: "${blueprintId}".`);
      } else if (seenUpdateIds.has(blueprintId)) {
        rowErrors.push(`Duplicate UPDATE for Blueprint ID: "${blueprintId}". Multiple updates in one CSV not allowed.`);
      } else {
        seenUpdateIds.add(blueprintId);
      }
    } else if (op === 'DELETE') {
      if (!blueprintId) {
        rowErrors.push('blueprint_id is required for DELETE operation.');
      } else if (!existingMap.has(blueprintId)) {
        rowErrors.push(`Blueprint ID not found in library: "${blueprintId}". Cannot delete.`);
      } else if (seenDeleteIds.has(blueprintId)) {
        rowErrors.push(`Duplicate DELETE for Blueprint ID: "${blueprintId}".`);
      } else {
        seenDeleteIds.add(blueprintId);
      }
    }

    // 3. Required base fields (Only required for CREATE or UPDATE, not DELETE)
    if (op !== 'DELETE') {
      if (!title && op === 'CREATE') {
        rowErrors.push('Missing required field: blueprint_title.');
      }
      if (!question && op === 'CREATE') {
        rowErrors.push('Missing required field: interview_question.');
      }
    }

    // 4. Framework validation
    const fwNorm = normalizeFrameworkCode(rawFw || 'CUSTOM');
    if (!fwNorm && op !== 'DELETE') {
      rowErrors.push(`Unknown framework: "${rawFw}". Allowed: CUSTOM, STAR, CAR, PROBLEM_DECISION_IMPACT.`);
    }
    const resolvedFramework: BlueprintFramework = fwNorm ? fwNorm.framework : 'Custom';

    // 5. Assigned Roles validation
    const assignedRoles: string[] = [];
    if (assignedRolesRaw && assignedRolesRaw.toUpperCase() !== '[NULL]') {
      // Split by semicolon ; or pipe | or newline
      const roleTokens = assignedRolesRaw
        .split(/[;|\n]+/)
        .map(r => r.trim())
        .filter(Boolean);

      roleTokens.forEach(r => {
        const { matchedRole, error } = normalizeInterviewerRole(r);
        if (matchedRole) {
          if (!assignedRoles.includes(matchedRole)) {
            assignedRoles.push(matchedRole);
          }
        } else if (error) {
          rowErrors.push(error);
        }
      });
    }

    // Existing blueprint lookup for preview
    const existing = blueprintId ? existingMap.get(blueprintId) : undefined;
    const diffSummary: string[] = [];

    if (op === 'UPDATE' && existing) {
      if (title && title !== existing.title) diffSummary.push('Title');
      if (question && question !== existing.questionText) diffSummary.push('Question');
      if (rawFw && resolvedFramework !== existing.framework) diffSummary.push('Framework');
      if (roleCat && roleCat !== existing.roleCategory) diffSummary.push('Role Category');
      if (jobTitle && jobTitle !== existing.targetJob) diffSummary.push('Job Title');
      if (company && company !== existing.targetCompany) diffSummary.push('Company');
      if (context && context !== (existing.components?.context || existing.components?.situation)) diffSummary.push('Context');
      if (solutionImpact) diffSummary.push('Solution & Impact');
      if (assignedRolesRaw) diffSummary.push('Assigned Roles');
    } else if (op === 'DELETE' && existing) {
      diffSummary.push(`Will permanently remove "${existing.title}" (${existing.id})`);
    }

    const isValid = rowErrors.length === 0;

    parsedRows.push({
      rowNumber,
      operation: op,
      rawOperation: rawOp,
      blueprint_id: blueprintId,
      blueprint_title: title || (existing ? existing.title : ''),
      interview_question: question || (existing ? existing.questionText : ''),
      framework: resolvedFramework,
      rawFramework: rawFw,
      target_role_category: roleCat,
      target_job_title: jobTitle,
      target_company: company,
      context,
      solution_impact: solutionImpact,
      assigned_roles: assignedRoles,
      rawFields: {
        title,
        question,
        rawFw,
        context,
        solutionImpact,
        assignedRolesRaw
      },
      isValid,
      errors: rowErrors,
      warnings: rowWarnings,
      existingBlueprint: existing,
      diffSummary
    });
  }

  const validRows = parsedRows.filter(r => r.isValid);
  const createCount = validRows.filter(r => r.operation === 'CREATE').length;
  const updateCount = validRows.filter(r => r.operation === 'UPDATE').length;
  const deleteCount = validRows.filter(r => r.operation === 'DELETE').length;
  const errorCount = parsedRows.filter(r => !r.isValid).length;

  return {
    totalRows: parsedRows.length,
    validCount: validRows.length,
    createCount,
    updateCount,
    deleteCount,
    errorCount,
    rows: parsedRows,
    globalErrors
  };
}

// ---------------------------------------------------------------------------
// Apply Import to Storage (Commit)
// ---------------------------------------------------------------------------

export interface ImportCommitResult {
  createdCount: number;
  updatedCount: number;
  deletedCount: number;
  createdBlueprints: StructuredAnswerBlueprint[];
  updatedBlueprints: StructuredAnswerBlueprint[];
  allBlueprints: StructuredAnswerBlueprint[];
}

export function commitBlueprintImport(
  validRows: ParsedCsvRow[],
  currentBlueprints: StructuredAnswerBlueprint[]
): ImportCommitResult {
  const bpMap = new Map<string, StructuredAnswerBlueprint>();
  currentBlueprints.forEach(b => bpMap.set(b.id, { ...b }));

  const createdList: StructuredAnswerBlueprint[] = [];
  const updatedList: StructuredAnswerBlueprint[] = [];
  let deletedCount = 0;
  const now = new Date().toISOString();

  for (const row of validRows) {
    if (row.operation === 'DELETE') {
      if (bpMap.has(row.blueprint_id)) {
        bpMap.delete(row.blueprint_id);
        deletedCount++;
      }
    } else if (row.operation === 'CREATE') {
      const newId = row.blueprint_id && !bpMap.has(row.blueprint_id)
        ? row.blueprint_id
        : `bp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const questionId = `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const storyId = `story-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const components: StructuredAnswerComponents = {
        context: row.context || undefined,
        solutionAndImpact: row.solution_impact || undefined
      };

      const assignedRoles = row.assigned_roles.length > 0 
        ? row.assigned_roles 
        : ['Engineering Lead', 'Technical Interviewer'];

      const newBp: StructuredAnswerBlueprint = {
        id: newId,
        title: row.blueprint_title,
        questionId,
        questionText: row.interview_question,
        storyId,
        storyTitle: row.blueprint_title,
        framework: row.framework,
        components,
        metrics: [],
        targetRole: row.target_role_category || 'Software Engineering',
        roleCategory: row.target_role_category || 'Software Engineering',
        targetJob: row.target_job_title || undefined,
        targetCompany: row.target_company || undefined,
        assignedRoles,
        createdAt: now,
        updatedAt: now
      };

      bpMap.set(newBp.id, newBp);
      createdList.push(newBp);
    } else if (row.operation === 'UPDATE') {
      const existing = bpMap.get(row.blueprint_id);
      if (!existing) continue;

      const patchString = (incoming: string, current?: string): string | undefined => {
        if (!incoming) return current;
        if (incoming.toUpperCase() === '[NULL]') return undefined;
        return incoming.trim();
      };

      const updatedTitle = patchString(row.blueprint_title, existing.title) || existing.title;
      const updatedQuestion = patchString(row.interview_question, existing.questionText) || existing.questionText;
      const updatedFramework = row.framework || existing.framework;
      const updatedRoleCategory = patchString(row.target_role_category, existing.roleCategory as string);
      const updatedJob = patchString(row.target_job_title, existing.targetJob);
      const updatedCompany = patchString(row.target_company, existing.targetCompany);

      const comp: StructuredAnswerComponents = { ...(existing.components || {}) };
      if (row.context) comp.context = patchString(row.context, comp.context);
      if (row.solution_impact) comp.solutionAndImpact = patchString(row.solution_impact, comp.solutionAndImpact);

      let updatedAssignedRoles = existing.assignedRoles || [];
      if (row.rawFields.assignedRolesRaw) {
        if (row.rawFields.assignedRolesRaw.toUpperCase() === '[NULL]') {
          updatedAssignedRoles = [];
        } else if (row.assigned_roles.length > 0) {
          updatedAssignedRoles = row.assigned_roles;
        }
      }

      const updatedBp: StructuredAnswerBlueprint = {
        ...existing,
        title: updatedTitle,
        questionText: updatedQuestion,
        framework: updatedFramework,
        roleCategory: updatedRoleCategory,
        targetRole: updatedRoleCategory || existing.targetRole,
        targetJob: updatedJob,
        targetCompany: updatedCompany,
        components: comp,
        assignedRoles: updatedAssignedRoles,
        updatedAt: now
      };

      bpMap.set(updatedBp.id, updatedBp);
      updatedList.push(updatedBp);
    }
  }

  const allBlueprints = Array.from(bpMap.values());

  return {
    createdCount: createdList.length,
    updatedCount: updatedList.length,
    deletedCount,
    createdBlueprints: createdList,
    updatedBlueprints: updatedList,
    allBlueprints
  };
}
