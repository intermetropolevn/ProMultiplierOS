import { LiveParticipant, LiveTimelineItem } from '../../../types';
import { AnswerBlueprint } from '../../../features/realtime/types';
import { StructuredAnswerBlueprint } from '../../../features/knowledge/types';
import { KnowledgeStorageService } from '../../../features/knowledge/services/knowledgeStorageService';

export type InterviewerRoleType =
  | 'Hiring Manager'
  | 'Recruiter'
  | 'Engineering Lead'
  | 'Product Manager'
  | 'Peer'
  | 'Cross-functional Partner'
  | 'Executive'
  | 'Technical Interviewer';

export interface ConfiguredBlueprint {
  id: string;
  title: string;
  questionText: string;
  interviewerId: string;
  interviewerName: string;
  interviewerRole: InterviewerRoleType;
  matchScore: number;
  source: 'ai_recommended' | 'manually_added' | 'role_default';
  topic: string;
  category: string;
  canonicalBlueprint?: StructuredAnswerBlueprint;
  blueprint: AnswerBlueprint;
}

export interface BlueprintAssignmentRef {
  blueprintId: string;
  interviewerId: string;
  interviewerName: string;
  interviewerRole: InterviewerRoleType;
  source: 'ai_recommended' | 'manually_added' | 'role_default';
}

export interface ReusableQASet {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  interviewers: LiveParticipant[];
  blueprintRefs?: BlueprintAssignmentRef[];
  selectedBlueprints?: ConfiguredBlueprint[];
}

export interface SavedLiveInterviewRecord {
  id: string;
  title: string;
  companyName: string;
  roleCategory: string;
  domain: string;
  savedAt: string;
  durationSeconds: number;
  participants: LiveParticipant[];
  timeline: LiveTimelineItem[];
  audioPlaybackSeconds: number;
  isSimulatedAudio: boolean;
}

export const AVAILABLE_INTERVIEWER_ROLES: InterviewerRoleType[] = [
  'Hiring Manager',
  'Recruiter',
  'Engineering Lead',
  'Product Manager',
  'Technical Interviewer',
  'Peer',
  'Cross-functional Partner',
  'Executive'
];

/**
 * Adapter: Convert a canonical StructuredAnswerBlueprint into a ConfiguredBlueprint for the Live Interview Engine
 */
export function createConfiguredBlueprint(
  canonical: StructuredAnswerBlueprint,
  interviewerId: string,
  interviewerName: string,
  interviewerRole: InterviewerRoleType,
  source: 'ai_recommended' | 'manually_added' | 'role_default' = 'role_default'
): ConfiguredBlueprint {
  const comp = canonical.components || {};

  const actionList = comp.action && comp.action.length > 0
    ? comp.action
    : comp.solutionAndImpact
      ? [comp.solutionAndImpact]
      : [];

  const resultList = comp.result && comp.result.length > 0
    ? comp.result
    : canonical.metrics && canonical.metrics.length > 0
      ? canonical.metrics
      : [];

  return {
    id: canonical.id,
    title: canonical.title,
    questionText: canonical.questionText,
    interviewerId,
    interviewerName,
    interviewerRole,
    matchScore: 92,
    source,
    topic: canonical.domain || canonical.tags?.[0] || 'Behavioral & Technical Architecture',
    category: canonical.framework === 'Custom' ? 'Custom Structure' : `${canonical.framework} Framework`,
    canonicalBlueprint: canonical,
    blueprint: {
      id: canonical.id,
      questionId: canonical.questionId,
      evidenceIds: [canonical.storyId],
      framework: canonical.framework === 'Custom' ? 'Custom Structure' : canonical.framework,
      opening: comp.openingHook || (comp.context ? `Context: ${comp.context}` : undefined),
      situation: comp.situation || comp.context,
      task: comp.task,
      action: actionList,
      tradeoffs: comp.tradeoffs || (comp.decision ? [`Decision: ${comp.decision}`] : undefined),
      result: resultList,
      metrics: canonical.metrics || [],
      mustMention: comp.keyCues || (comp.solutionAndImpact ? [comp.solutionAndImpact.slice(0, 80)] : []),
      avoid: comp.avoidCues || [],
      targetDuration: canonical.targetDurationSeconds
        ? `${Math.round(canonical.targetDurationSeconds / 60)} minutes`
        : '2 - 3 minutes'
    }
  };
}

/**
 * Dynamically resolves assigned blueprints for a specific interviewer role from the canonical Knowledge storage
 */
export function getCanonicalBlueprintsForRole(
  role: InterviewerRoleType,
  interviewerId: string,
  interviewerName: string
): ConfiguredBlueprint[] {
  const allCanonical = KnowledgeStorageService.getBlueprints();
  
  // 1. Primary: Match blueprints explicitly assigned to this role in KnowledgeStorage
  let matching = allCanonical.filter(bp => bp.assignedRoles && bp.assignedRoles.includes(role));

  // 2. Fallback if no blueprints explicitly assigned to this role yet
  if (matching.length === 0) {
    if (role === 'Engineering Lead' || role === 'Technical Interviewer') {
      matching = allCanonical.filter(bp => bp.targetRole?.toLowerCase().includes('engineer'));
    } else if (role === 'Product Manager') {
      matching = allCanonical.filter(bp => bp.targetRole?.toLowerCase().includes('product'));
    } else {
      matching = allCanonical.slice(0, 2);
    }
  }

  return matching.map(bp => createConfiguredBlueprint(bp, interviewerId, interviewerName, role, 'role_default'));
}

/**
 * Dynamic getter for ALL_SYSTEM_BLUEPRINTS backed by canonical KnowledgeStorageService
 */
export function getDynamicSystemBlueprints(): ConfiguredBlueprint[] {
  const canonicalList = KnowledgeStorageService.getBlueprints();
  return canonicalList.map(bp => 
    createConfiguredBlueprint(bp, 'p-default', 'Interviewer', 'Engineering Lead', 'role_default')
  );
}

// For backward compatibility across any components importing ALL_SYSTEM_BLUEPRINTS
export const ALL_SYSTEM_BLUEPRINTS: ConfiguredBlueprint[] = getDynamicSystemBlueprints();

export class LiveInterviewStorageService {
  private static SAVED_INTERVIEWS_KEY = 'career_os_saved_live_interviews_v4';
  private static SAVED_QA_SETS_KEY = 'career_os_saved_qa_sets_v5';

  public static getSavedInterviews(): SavedLiveInterviewRecord[] {
    try {
      const data = localStorage.getItem(this.SAVED_INTERVIEWS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not read saved interviews', e);
    }
    return [];
  }

  public static saveInterview(record: SavedLiveInterviewRecord): SavedLiveInterviewRecord[] {
    try {
      const list = this.getSavedInterviews().filter(r => r.id !== record.id);
      list.unshift(record);
      localStorage.setItem(this.SAVED_INTERVIEWS_KEY, JSON.stringify(list.slice(0, 20)));
      return list;
    } catch (e) {
      console.warn('Could not save interview', e);
      return [];
    }
  }

  public static deleteInterview(id: string): SavedLiveInterviewRecord[] {
    try {
      const list = this.getSavedInterviews().filter(r => r.id !== id);
      localStorage.setItem(this.SAVED_INTERVIEWS_KEY, JSON.stringify(list));
      return list;
    } catch (e) {
      console.warn('Could not delete interview', e);
      return [];
    }
  }

  public static getSavedQASets(): ReusableQASet[] {
    try {
      const data = localStorage.getItem(this.SAVED_QA_SETS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not read saved Q&A sets', e);
    }

    // Default seeded Q&A Set linking dynamically to canonical blueprints
    const canonicalBlueprints = KnowledgeStorageService.getBlueprints();
    const defaultRefs: BlueprintAssignmentRef[] = [
      {
        blueprintId: canonicalBlueprints[0]?.id || 'bp-star-conflict-engineering',
        interviewerId: 'p-interviewer-1',
        interviewerName: 'Sarah Chen',
        interviewerRole: 'Engineering Lead',
        source: 'role_default'
      },
      {
        blueprintId: canonicalBlueprints[1]?.id || 'bp-pdi-ambiguity-pricing',
        interviewerId: 'p-interviewer-2',
        interviewerName: 'David Kim',
        interviewerRole: 'Product Manager',
        source: 'role_default'
      }
    ];

    const initialSet: ReusableQASet = {
      id: 'qa-set-standard-panel',
      name: 'Senior Full-Stack & Systems Architecture Panel',
      description: 'Pre-configured panel covering technical conflict, concurrency idempotency, and ambiguity decisions.',
      createdAt: '2026-09-08',
      interviewers: [
        {
          id: 'p-interviewer-1',
          name: 'Sarah Chen',
          role: 'Engineering Lead',
          isInterviewer: true,
          avatarColor: 'bg-purple-600'
        },
        {
          id: 'p-interviewer-2',
          name: 'David Kim',
          role: 'Product Manager',
          isInterviewer: true,
          avatarColor: 'bg-indigo-600'
        }
      ],
      blueprintRefs: defaultRefs
    };

    try {
      localStorage.setItem(this.SAVED_QA_SETS_KEY, JSON.stringify([initialSet]));
    } catch {
      // ignore
    }

    return [initialSet];
  }

  /**
   * Resolves a ReusableQASet's blueprint references into fresh ConfiguredBlueprints from the canonical store
   */
  public static resolveQASetBlueprints(qaSet: ReusableQASet): {
    resolved: ConfiguredBlueprint[];
    missingCount: number;
  } {
    const canonicalBlueprints = KnowledgeStorageService.getBlueprints();
    const canonicalMap = new Map(canonicalBlueprints.map(b => [b.id, b]));

    const resolved: ConfiguredBlueprint[] = [];
    let missingCount = 0;

    // Use blueprintRefs if present, otherwise fallback to existing selectedBlueprints
    if (qaSet.blueprintRefs && qaSet.blueprintRefs.length > 0) {
      for (const ref of qaSet.blueprintRefs) {
        const canonical = canonicalMap.get(ref.blueprintId);
        if (canonical) {
          resolved.push(
            createConfiguredBlueprint(
              canonical,
              ref.interviewerId,
              ref.interviewerName,
              ref.interviewerRole,
              ref.source
            )
          );
        } else {
          missingCount++;
        }
      }
    } else if (qaSet.selectedBlueprints && qaSet.selectedBlueprints.length > 0) {
      for (const bp of qaSet.selectedBlueprints) {
        const canonical = canonicalMap.get(bp.id);
        if (canonical) {
          resolved.push(
            createConfiguredBlueprint(
              canonical,
              bp.interviewerId,
              bp.interviewerName,
              bp.interviewerRole,
              bp.source
            )
          );
        } else {
          // If canonical was deleted, count as missing
          missingCount++;
        }
      }
    }

    return { resolved, missingCount };
  }

  public static saveQASet(
    name: string,
    description: string,
    interviewers: LiveParticipant[],
    selectedBlueprints: ConfiguredBlueprint[],
    existingId?: string
  ): ReusableQASet {
    const list = this.getSavedQASets();
    const now = new Date().toISOString();

    const blueprintRefs: BlueprintAssignmentRef[] = selectedBlueprints.map(bp => ({
      blueprintId: bp.id,
      interviewerId: bp.interviewerId,
      interviewerName: bp.interviewerName,
      interviewerRole: bp.interviewerRole,
      source: bp.source
    }));

    let updatedSet: ReusableQASet;

    if (existingId) {
      const existing = list.find(s => s.id === existingId);
      updatedSet = {
        id: existingId,
        name: name.trim(),
        description: description.trim(),
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        interviewers,
        blueprintRefs
      };
      const filtered = list.filter(s => s.id !== existingId);
      localStorage.setItem(this.SAVED_QA_SETS_KEY, JSON.stringify([updatedSet, ...filtered]));
    } else {
      updatedSet = {
        id: `qa-set-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        createdAt: now,
        updatedAt: now,
        interviewers,
        blueprintRefs
      };
      localStorage.setItem(this.SAVED_QA_SETS_KEY, JSON.stringify([updatedSet, ...list]));
    }

    return updatedSet;
  }

  public static deleteQASet(id: string): ReusableQASet[] {
    try {
      const list = this.getSavedQASets().filter(s => s.id !== id);
      localStorage.setItem(this.SAVED_QA_SETS_KEY, JSON.stringify(list));
      return list;
    } catch (e) {
      console.warn('Could not delete Q&A set', e);
      return [];
    }
  }

  public static updateQASetMeta(id: string, name: string, description: string): ReusableQASet[] {
    try {
      const list = this.getSavedQASets().map(s => {
        if (s.id === id) {
          return { ...s, name: name.trim(), description: description.trim(), updatedAt: new Date().toISOString() };
        }
        return s;
      });
      localStorage.setItem(this.SAVED_QA_SETS_KEY, JSON.stringify(list));
      return list;
    } catch (e) {
      console.warn('Could not update Q&A set', e);
      return [];
    }
  }
}
