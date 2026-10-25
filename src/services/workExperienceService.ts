import { KnowledgeStorageService } from '../features/knowledge/services/knowledgeStorageService';
import { EvidenceItem } from '../features/knowledge/types';
import { ActivityService } from './activityService';
import { sourceStore } from '../features/sources/services/sourceStore';
import { careerGraphEventBus } from './careerGraphEventBus';
import { curatedBetaData } from './curatedBetaData';
import { AccessControlService } from './accessControlService';
import { demoWorkspaceService } from './demoWorkspaceService';

import { SkillService } from './skillService';

export interface UserProvidedExperienceData {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  currentRole?: boolean;
  location?: string;
  rawDescription?: string;
  rawAchievements?: string;
  importedSummaryLine: string;
}

export interface CareerOSInferredExperienceIntelligence {
  roleFamily: string;
  functionalArea: string;
  domain: string;
  industry: string;
  seniority: string;
  relationshipPillars: string[];
  capabilities: string[];
  skills: string[];
  tools: string[];
  stakeholders: string[];
  keywords: string[];
  careerTrajectory: string;
  evidenceRelationships: string[];
  intelligenceSummaryLine: string;
}

export interface WorkExperienceRecord {
  id: string;
  company: string;
  role: string;
  dates: string;
  location?: string;
  scope?: string;
  responsibilities: string[];
  achievements: string[];
  measurableOutcomes: string[];
  relevantSkills: string[];
  linkedEvidenceId?: string;
  provenance: 'evidence' | 'manual' | 'extracted' | 'edited';
  isDemo?: boolean;
  sourceText?: string;
  userProvided?: UserProvidedExperienceData;
  inferredIntelligence?: CareerOSInferredExperienceIntelligence;
  updatedAt: string;
}

const STORAGE_KEY = 'career_os_work_experiences_v1';
const CSV_SESSION_STORAGE_KEY = 'careeros_csv_imported_work_experiences_v1';
const DELETED_IDS_SESSION_KEY = 'careeros_deleted_work_experience_ids_v1';

export const INITIAL_WORK_EXPERIENCES: WorkExperienceRecord[] = [
  {
    id: 'exp-stripe-1',
    company: 'Stripe / Fintech Core Platforms',
    role: 'Lead Platform Engineer & Project Owner',
    dates: '2023 — Present',
    location: 'San Francisco, CA (Remote)',
    scope: 'Core payments infrastructure, transaction ledgers, and database replication engines processing over $40M daily volume.',
    responsibilities: [
      'Architected zero-downtime dual-run data pipeline migrating 12M customer records to PostgreSQL.',
      'Designed and executed real-time Debezium CDC and Kafka change-log streaming reconciliation.',
      'Led RFC review cycle and aligned 3 enterprise tenant leadership teams on migration safety.'
    ],
    achievements: [
      'Cut over mission-critical database with 0 seconds unplanned downtime.',
      'Eliminated $35,000/month in legacy third-party database licenses.',
      'Achieved 99.999% data verification parity across all financial records during dual-run.'
    ],
    measurableOutcomes: [
      '0 seconds downtime across 12M records',
      '$35,000 / month license savings',
      '99.999% audit accuracy'
    ],
    relevantSkills: ['PostgreSQL', 'Kafka', 'CDC (Debezium)', 'Distributed Systems', 'Zero-Downtime Migration', 'Stakeholder Management'],
    linkedEvidenceId: 'ev-crm-migration',
    provenance: 'evidence',
    isDemo: true,
    updatedAt: '2026-09-01T14:30:00.000Z'
  },
  {
    id: 'exp-ramp-2',
    company: 'Ramp / High-Scale Financial Infra',
    role: 'Senior Backend Engineer / Tech Lead',
    dates: '2021 — 2023',
    location: 'New York, NY',
    scope: 'Transactional idempotency, merchant settlement APIs, and backend platform latency optimizations.',
    responsibilities: [
      'Enforced client-side idempotency keys with atomic Redis locks (SET NX EX 30) and serializable DB transactions.',
      'Resolved heated architecture conflict with tech lead via empirical 2-day benchmarking on 10,000 concurrent writes.',
      'Negotiated 20% sprint refactoring capacity using Cost of Delay metrics to pay down brittle billing tech debt.'
    ],
    achievements: [
      'Zero duplicate charges recorded over $45,000,000 in processed volume.',
      'Achieved 14ms p99 query latency vs 180ms failover spikes on alternative graph database designs.',
      'Reduced customer defect rate by 45% and compressed PR review cycle time from 4 days to 6 hours.'
    ],
    measurableOutcomes: [
      '0 duplicate charges over $45M volume',
      '14ms p99 query latency',
      '-45% customer defect rate'
    ],
    relevantSkills: ['Redis', 'PostgreSQL Serializable Transactions', 'Distributed Systems', 'Idempotency', 'Cost of Delay', 'RFC Consensus'],
    linkedEvidenceId: 'ev-payment-idempotency',
    provenance: 'evidence',
    isDemo: true,
    updatedAt: '2026-08-28T12:00:00.000Z'
  }
];

export class WorkExperienceService {
  private static getSessionImportedRecords(): WorkExperienceRecord[] {
    try {
      const raw = sessionStorage.getItem(CSV_SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private static saveSessionImportedRecords(records: WorkExperienceRecord[]): void {
    try {
      sessionStorage.setItem(CSV_SESSION_STORAGE_KEY, JSON.stringify(records));
    } catch {}
  }

  private static getDeletedIds(): Set<string> {
    try {
      const raw = sessionStorage.getItem(DELETED_IDS_SESSION_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }

  private static addDeletedId(id: string): void {
    try {
      const set = this.getDeletedIds();
      set.add(id);
      sessionStorage.setItem(DELETED_IDS_SESSION_KEY, JSON.stringify(Array.from(set)));
    } catch {}
  }

  public static getWorkExperiences(): WorkExperienceRecord[] {
    const access = AccessControlService.getAccessLevel();
    const sessionRecords = this.getSessionImportedRecords();
    const deletedIds = this.getDeletedIds();

    let baseList: WorkExperienceRecord[] = [];
    if (access === 'DEMO') {
      baseList = demoWorkspaceService.getWorkExperiences();
    } else if (curatedBetaData.isCuratedBetaActive()) {
      baseList = curatedBetaData.getWorkExperiences();
    } else {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          baseList = JSON.parse(data);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WORK_EXPERIENCES));
          baseList = INITIAL_WORK_EXPERIENCES;
        }
      } catch {
        baseList = INITIAL_WORK_EXPERIENCES;
      }
    }

    const sessionMap = new Map(sessionRecords.map(r => [r.id, r]));
    const merged: WorkExperienceRecord[] = [];

    // First include any newly imported session records not already in baseList
    for (const sRec of sessionRecords) {
      if (!deletedIds.has(sRec.id) && !baseList.some(b => b.id === sRec.id)) {
        merged.push(sRec);
      }
    }

    // Then include baseList records (applying any session edits)
    for (const bRec of baseList) {
      if (deletedIds.has(bRec.id)) continue;
      const override = sessionMap.get(bRec.id);
      merged.push(override || bRec);
    }

    return merged;
  }

  public static saveWorkExperiences(records: WorkExperienceRecord[]): void {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      demoWorkspaceService.saveWorkExperiences(records, false);
      careerGraphEventBus.emit({ type: 'WORK_EXPERIENCES_UPDATED' });
      return;
    }

    if (!curatedBetaData.isCuratedBetaActive()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      } catch (e) {
        console.warn('Failed to save work experiences', e);
      }
    }
    careerGraphEventBus.emit({ type: 'WORK_EXPERIENCES_UPDATED' });
  }

  /**
   * Commits one or more structured CSV-imported Work Experience records after user review.
   * Creates canonical WorkExperienceRecord entries, syncs with KnowledgeStorageService,
   * SourceStore, and SkillService, and preserves both user-provided and CareerOS inferred fields.
   */
  public static commitCsvImportedExperiences(
    stagedRecords: Array<
      Omit<WorkExperienceRecord, 'id' | 'updatedAt'> & {
        userProvided: UserProvidedExperienceData;
        inferredIntelligence: CareerOSInferredExperienceIntelligence;
      }
    >
  ): WorkExperienceRecord[] {
    const now = new Date().toISOString();
    const existingSession = this.getSessionImportedRecords();
    const committed: WorkExperienceRecord[] = [];
    const allInferredCompetences: string[] = [];
    const allInferredTools: string[] = [];

    stagedRecords.forEach((rec, idx) => {
      const expId = `exp-csv-${Date.now()}-${idx}`;
      const evId = `ev-csv-${Date.now()}-${idx}`;

      const evidenceItem: EvidenceItem = {
        id: evId,
        title: `${rec.role} at ${rec.company}`,
        shortSummary: rec.scope || rec.responsibilities[0] || 'CSV Imported Work Experience',
        category: 'Experience',
        context: rec.scope || '',
        myRole: rec.role,
        actions: rec.responsibilities.join('; '),
        decision: `Focused on ${rec.inferredIntelligence.functionalArea} and ${rec.inferredIntelligence.domain} execution.`,
        tradeoffs: 'Balanced delivery velocity with enterprise reliability and measurable outcomes.',
        outcome: rec.achievements.join('; '),
        metrics: rec.measurableOutcomes,
        skills: rec.relevantSkills,
        domains: [rec.inferredIntelligence.domain as any],
        roles: [rec.inferredIntelligence.roleFamily as any],
        tags: ['csv-imported', rec.company.toLowerCase().replace(/[^a-z0-9]/g, '')],
        linkedQuestionIds: [],
        createdAt: now,
        updatedAt: now
      };

      KnowledgeStorageService.addOrUpdateEvidence(evidenceItem);

      sourceStore.addSource({
        id: `source-exp-${expId}`,
        title: `${rec.role} — ${rec.company}`,
        sourceFamily: 'experience',
        sourceType: 'work_project',
        description: rec.scope || '',
        organization: rec.company,
        dateCompleted: rec.dates.split('—')[1]?.trim() || rec.dates,
        status: 'completed',
        language: 'en',
        languages: ['en'],
        tags: ['csv-import', 'experience', ...rec.relevantSkills.map(s => s.toLowerCase())],
        attachments: [],
        createdAt: now,
        updatedAt: now,
        evidenceStrength: 4,
        inferredKnowledge: rec.inferredIntelligence.capabilities,
        confirmedKnowledge: rec.inferredIntelligence.skills.slice(0, 2),
        inferredSkills: rec.relevantSkills,
        confirmedSkills: rec.relevantSkills,
        competencies: rec.inferredIntelligence.capabilities,
        domains: [rec.inferredIntelligence.domain],
        methods: [rec.inferredIntelligence.functionalArea],
        frameworks: [],
        evidenceStatements: [
          rec.scope || '',
          ...(rec.achievements || []).slice(0, 2)
        ].filter(Boolean),
        careerRelevance: [rec.inferredIntelligence.roleFamily],
        metadata: {
          company: rec.company,
          role: rec.role,
          dates: rec.dates,
          location: rec.location || 'Remote'
        }
      });

      allInferredCompetences.push(...rec.inferredIntelligence.capabilities, ...rec.inferredIntelligence.skills);
      allInferredTools.push(...rec.inferredIntelligence.tools);

      const newRecord: WorkExperienceRecord = {
        ...rec,
        id: expId,
        linkedEvidenceId: evId,
        provenance: 'extracted',
        isDemo: false,
        updatedAt: now
      };

      committed.push(newRecord);
    });

    if (allInferredCompetences.length > 0 || allInferredTools.length > 0) {
      SkillService.importExtractedSkills(
        Array.from(new Set(allInferredCompetences)),
        Array.from(new Set(allInferredTools))
      );
    }

    const nextSession = [...committed, ...existingSession];
    this.saveSessionImportedRecords(nextSession);

    const allExperiences = this.getWorkExperiences();
    this.saveWorkExperiences(allExperiences);

    ActivityService.logActivity({
      category: 'work',
      title: `Imported ${committed.length} Work Experience Record${committed.length === 1 ? '' : 's'} via CSV`,
      description: `CareerOS structured ${committed.length} role${committed.length === 1 ? '' : 's'} and classified capabilities, domains, and measurable outcomes.`,
      source: 'Evidence',
      badgeText: `${committed.length} Imported`,
      badgeVariant: 'emerald'
    });

    return allExperiences;
  }

  /**
   * Adds a new Work Experience record.
   * Seamlessly persists both in WorkExperienceService and KnowledgeStorageService as Evidence,
   * avoiding data silos and preserving complete auditability.
   */
  public static addWorkExperience(record: Omit<WorkExperienceRecord, 'id' | 'updatedAt'>): WorkExperienceRecord {
    let customCount = 0;
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      customCount = demoWorkspaceService.getCategoryUsage('work_experience').used;
    } else {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          const list: WorkExperienceRecord[] = JSON.parse(data);
          customCount = list.filter(item => !INITIAL_WORK_EXPERIENCES.some(init => init.id === item.id)).length;
        }
      } catch {}
    }

    const decision = AccessControlService.canCreateWorkflowItem('work_experiences', customCount);
    if (!decision.allowed) {
      console.warn('Work experience creation blocked by access control:', decision.reason);
      throw new Error(decision.reason || 'Creation restricted by active access tier.');
    }

    const newId = `exp-${Date.now()}`;
    const now = new Date().toISOString();

    const evidenceItem: EvidenceItem = {
      id: `ev-${Date.now()}`,
      title: `${record.role} at ${record.company}`,
      shortSummary: record.scope || record.responsibilities[0] || 'Work Experience record',
      category: 'Experience',
      context: record.scope || '',
      myRole: record.role,
      actions: record.responsibilities.join('; '),
      decision: 'Prioritized architectural resilience, data integrity, and high-velocity delivery.',
      tradeoffs: 'Invested in automated test parity to eliminate production downtime.',
      outcome: record.achievements.join('; '),
      metrics: record.measurableOutcomes,
      skills: record.relevantSkills,
      domains: ['Enterprise SaaS', 'Fintech & Payments'],
      roles: ['Software Engineering'],
      tags: ['experience', record.company.toLowerCase().replace(/[^a-z0-9]/g, '')],
      linkedQuestionIds: [],
      createdAt: now,
      updatedAt: now
    };

    KnowledgeStorageService.addOrUpdateEvidence(evidenceItem);

    const newExperience: WorkExperienceRecord = {
      ...record,
      id: newId,
      linkedEvidenceId: evidenceItem.id,
      updatedAt: now
    };

    const existingSession = this.getSessionImportedRecords();
    this.saveSessionImportedRecords([newExperience, ...existingSession]);

    const currentList = this.getWorkExperiences();
    this.saveWorkExperiences(currentList);

    ActivityService.logActivity({
      category: 'work',
      title: `Added Work Experience: ${record.role} at ${record.company}`,
      description: `${record.scope || record.responsibilities[0] || ''}. Recorded ${record.measurableOutcomes.length} measurable outcomes.`,
      source: 'Evidence',
      badgeText: record.company,
      badgeVariant: 'amber',
      metadata: { workExperienceId: newId, evidenceId: evidenceItem.id }
    });

    return newExperience;
  }

  /**
   * Updates an existing Work Experience record.
   * If the record was previously 'extracted', updates provenance to 'edited'.
   * Synchronizes changes to KnowledgeStorageService and logs recent activity.
   */
  public static updateWorkExperience(id: string, updates: Partial<WorkExperienceRecord>): WorkExperienceRecord | null {
    const list = this.getWorkExperiences();
    const index = list.findIndex(e => e.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const newProvenance = existing.provenance === 'extracted' ? 'edited' : (updates.provenance || existing.provenance);

    const updatedRecord: WorkExperienceRecord = {
      ...existing,
      ...updates,
      id: existing.id,
      provenance: newProvenance,
      updatedAt: new Date().toISOString()
    };

    // Update session store so edits persist across Guest/Demo/Full
    const sessionList = this.getSessionImportedRecords();
    const sIdx = sessionList.findIndex(s => s.id === id);
    if (sIdx !== -1) {
      sessionList[sIdx] = updatedRecord;
      this.saveSessionImportedRecords(sessionList);
    } else {
      this.saveSessionImportedRecords([updatedRecord, ...sessionList]);
    }

    list[index] = updatedRecord;
    this.saveWorkExperiences(list);

    if (updatedRecord.linkedEvidenceId) {
      KnowledgeStorageService.addOrUpdateEvidence({
        id: updatedRecord.linkedEvidenceId,
        title: `${updatedRecord.role} at ${updatedRecord.company}`,
        shortSummary: updatedRecord.scope || updatedRecord.responsibilities[0] || 'Work Experience record',
        category: 'Experience',
        context: updatedRecord.scope || '',
        myRole: updatedRecord.role,
        actions: updatedRecord.responsibilities.join('; '),
        decision: 'Prioritized architectural resilience, data integrity, and high-velocity delivery.',
        tradeoffs: 'Invested in automated test parity to eliminate production downtime.',
        outcome: updatedRecord.achievements.join('; '),
        metrics: updatedRecord.measurableOutcomes,
        skills: updatedRecord.relevantSkills,
        domains: ['Enterprise SaaS', 'Fintech & Payments'],
        roles: ['Software Engineering'],
        tags: ['experience', updatedRecord.company.toLowerCase().replace(/[^a-z0-9]/g, '')],
        linkedQuestionIds: [],
        createdAt: existing.updatedAt || new Date().toISOString(),
        updatedAt: updatedRecord.updatedAt
      });
    }

    ActivityService.logActivity({
      category: 'work',
      title: `Updated Work Experience: ${updatedRecord.role} at ${updatedRecord.company}`,
      description: `Saved changes to ${updatedRecord.company} history. Status: ${newProvenance}.`,
      source: 'Evidence',
      badgeText: updatedRecord.company,
      badgeVariant: 'blue',
      metadata: { workExperienceId: id }
    });

    return updatedRecord;
  }

  public static importExtractedExperiences(
    extractedList: Array<{
      company: string;
      role: string;
      dates: string;
      location?: string;
      summary: string;
      responsibilities: string[];
      achievements: string[];
      skills: string[];
    }>
  ): WorkExperienceRecord[] {
    const currentList = this.getWorkExperiences();
    const now = new Date().toISOString();

    const preservedRecords = currentList.filter(
      r => r.provenance === 'manual' || r.provenance === 'edited'
    );

    const newlyExtractedRecords: WorkExperienceRecord[] = extractedList.map((ext, idx) => {
      const expId = `exp-ext-${Date.now()}-${idx}`;
      const evId = `ev-ext-${Date.now()}-${idx}`;

      const measurableOutcomes = ext.achievements && ext.achievements.length > 0
        ? ext.achievements.slice(0, 3)
        : ['Delivered zero-regression production roadmap', '99.9% reliability parity'];

      KnowledgeStorageService.addOrUpdateEvidence({
        id: evId,
        title: `${ext.role} at ${ext.company}`,
        shortSummary: ext.summary || ext.responsibilities[0] || 'Imported Experience',
        category: 'Experience',
        context: ext.summary || '',
        myRole: ext.role,
        actions: ext.responsibilities.join('; '),
        decision: 'Prioritized system stability and operational excellence.',
        tradeoffs: 'Optimized for scalability and predictable delivery.',
        outcome: ext.achievements.join('; '),
        metrics: measurableOutcomes,
        skills: ext.skills,
        domains: ['Enterprise SaaS', 'Fintech & Payments'],
        roles: ['Software Engineering'],
        tags: ['experience', ext.company.toLowerCase().replace(/[^a-z0-9]/g, '')],
        linkedQuestionIds: [],
        createdAt: now,
        updatedAt: now
      });

      return {
        id: expId,
        company: ext.company,
        role: ext.role,
        dates: ext.dates,
        location: ext.location || 'Remote',
        scope: ext.summary,
        responsibilities: ext.responsibilities,
        achievements: ext.achievements,
        measurableOutcomes,
        relevantSkills: ext.skills,
        linkedEvidenceId: evId,
        provenance: 'extracted',
        isDemo: false,
        sourceText: (ext as any).sourceText || '',
        updatedAt: now
      };
    });

    const merged = [...newlyExtractedRecords, ...preservedRecords];
    this.saveSessionImportedRecords(newlyExtractedRecords);
    this.saveWorkExperiences(merged);
    return merged;
  }

  public static removeWorkExperience(id: string): void {
    this.addDeletedId(id);
    const sessionList = this.getSessionImportedRecords().filter(e => e.id !== id);
    this.saveSessionImportedRecords(sessionList);
    const list = this.getWorkExperiences().filter(e => e.id !== id);
    this.saveWorkExperiences(list);
  }
}
