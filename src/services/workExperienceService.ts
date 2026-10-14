import { KnowledgeStorageService } from '../features/knowledge/services/knowledgeStorageService';
import { EvidenceItem } from '../features/knowledge/types';
import { ActivityService } from './activityService';
import { sourceStore } from '../features/sources/services/sourceStore';
import { careerGraphEventBus } from './careerGraphEventBus';

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
  updatedAt: string;
}

const STORAGE_KEY = 'career_os_work_experiences_v1';

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
  public static getWorkExperiences(): WorkExperienceRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WORK_EXPERIENCES));
      return INITIAL_WORK_EXPERIENCES;
    } catch {
      return INITIAL_WORK_EXPERIENCES;
    }
  }

  public static saveWorkExperiences(records: WorkExperienceRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to save work experiences', e);
    }
    careerGraphEventBus.emit({ type: 'WORK_EXPERIENCES_UPDATED' });
  }

  /**
   * Adds a new Work Experience record.
   * Seamlessly persists both in WorkExperienceService and KnowledgeStorageService as Evidence,
   * avoiding data silos and preserving complete auditability.
   */
  public static addWorkExperience(record: Omit<WorkExperienceRecord, 'id' | 'updatedAt'>): WorkExperienceRecord {
    const newId = `exp-${Date.now()}`;
    const now = new Date().toISOString();

    // 1. Create Evidence Item in KnowledgeStorageService
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

    // 2. Create canonical WorkExperienceRecord
    const newExperience: WorkExperienceRecord = {
      ...record,
      id: newId,
      linkedEvidenceId: evidenceItem.id,
      updatedAt: now
    };

    const currentList = this.getWorkExperiences();
    const updated = [newExperience, ...currentList];
    this.saveWorkExperiences(updated);

    // 3. Log Activity
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

    list[index] = updatedRecord;
    this.saveWorkExperiences(list);

    // Sync to KnowledgeStorageService if linked
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

  /**
   * Imports extracted experiences from an uploaded resume.
   * CRITICAL REQUIREMENT:
   * Replaces previous default / mock / extracted experiences,
   * while STRICTLY PRESERVING any manually added ('manual') or user-edited ('edited') records!
   */
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

    // Preserve user manual entries and user-edited entries
    const preservedRecords = currentList.filter(
      r => r.provenance === 'manual' || r.provenance === 'edited'
    );

    // Transform extracted experiences into canonical records
    const newlyExtractedRecords: WorkExperienceRecord[] = extractedList.map((ext, idx) => {
      const expId = `exp-ext-${Date.now()}-${idx}`;
      const evId = `ev-ext-${Date.now()}-${idx}`;

      const measurableOutcomes = ext.achievements && ext.achievements.length > 0
        ? ext.achievements.slice(0, 3)
        : ['Delivered zero-regression production roadmap', '99.9% reliability parity'];

      // Also register into KnowledgeStorageService
      KnowledgeStorageService.addOrUpdateEvidence({
        id: evId,
        title: `${ext.role} at ${ext.company}`,
        shortSummary: ext.summary || ext.responsibilities[0] || 'Resume Extracted Experience',
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
        tags: ['resume-extracted', ext.company.toLowerCase().replace(/[^a-z0-9]/g, '')],
        linkedQuestionIds: [],
        createdAt: now,
        updatedAt: now
      });

      // Register into SourceStore to update the Skill Evidence Graph
      sourceStore.addSource({
        id: `source-exp-${expId}`,
        title: `${ext.role} — ${ext.company}`,
        sourceFamily: 'experience',
        sourceType: 'work_project',
        description: ext.summary,
        organization: ext.company,
        dateCompleted: ext.dates.split('—')[1]?.trim() || ext.dates,
        status: 'completed',
        language: 'en',
        languages: ['en'],
        tags: ['resume', 'experience', ...ext.skills.map(s => s.toLowerCase())],
        attachments: [],
        createdAt: now,
        updatedAt: now,
        evidenceStrength: 4, // L4 Applied
        inferredKnowledge: ext.skills.slice(0, 3),
        confirmedKnowledge: ext.skills.slice(0, 2),
        inferredSkills: ext.skills,
        confirmedSkills: ext.skills,
        competencies: ext.skills.slice(0, 3),
        domains: ['Enterprise SaaS'],
        methods: ['Production Delivery'],
        frameworks: [],
        evidenceStatements: [
          ext.summary,
          ...(ext.achievements || []).slice(0, 2)
        ],
        careerRelevance: ['Software Engineering'],
        metadata: {
          company: ext.company,
          role: ext.role,
          dates: ext.dates,
          location: ext.location || 'Remote'
        }
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

    // Merge: newly extracted first, then preserved manual/edited
    const merged = [...newlyExtractedRecords, ...preservedRecords];
    this.saveWorkExperiences(merged);

    ActivityService.logActivity({
      category: 'resume',
      title: `Imported ${newlyExtractedRecords.length} Work Experiences from Resume`,
      description: `Refreshed experience chronology with auditable proof. Preserved ${preservedRecords.length} manual/edited records.`,
      source: 'Resume',
      badgeText: `${newlyExtractedRecords.length} Roles`,
      badgeVariant: 'emerald'
    });

    return merged;
  }

  public static removeWorkExperience(id: string): void {
    const list = this.getWorkExperiences().filter(e => e.id !== id);
    this.saveWorkExperiences(list);
  }
}
