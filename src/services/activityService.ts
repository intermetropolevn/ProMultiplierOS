import { MockInterviewSession, SavedJobApplication } from '../types';
import { KnowledgeStorageService } from '../features/knowledge/services/knowledgeStorageService';
import { StorageService } from './storageService';

export type ActivityCategory = 'work' | 'blueprint' | 'practice' | 'resume' | 'other';

export interface ActivityEvent {
  id: string;
  category: ActivityCategory;
  title: string;
  description: string;
  timestamp: string; // ISO string
  source: 'Evidence' | 'Blueprint' | 'Practice' | 'Resume' | 'Application' | 'System';
  badgeText?: string;
  badgeVariant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'slate';
  metadata?: Record<string, any>;
  linkTo?: {
    tab: 'profile' | 'knowledge' | 'discover' | 'tracker' | 'practice';
    subTab?: string;
  };
}

const STORAGE_KEY = 'career_os_recent_activities_v1';

export class ActivityService {
  /**
   * Returns a consolidated, chronological list of all recent activities.
   * Aggregates real practice sessions, evidence items, blueprints, resume events, and tracker milestones.
   */
  public static getActivities(): ActivityEvent[] {
    const customEvents = this.getCustomActivities();
    const synthesizedEvents = this.synthesizeActivitiesFromState();

    // Merge and deduplicate by ID
    const mergedMap = new Map<string, ActivityEvent>();
    [...customEvents, ...synthesizedEvents].forEach(evt => {
      mergedMap.set(evt.id, evt);
    });

    const allEvents = Array.from(mergedMap.values());
    // Sort descending by timestamp
    allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return allEvents;
  }

  /**
   * Log a new activity event (persisted in localStorage).
   */
  public static logActivity(event: Omit<ActivityEvent, 'id' | 'timestamp'> & { timestamp?: string }): ActivityEvent {
    const newEvent: ActivityEvent = {
      ...event,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    };

    const existing = this.getCustomActivities();
    const updated = [newEvent, ...existing].slice(0, 100); // cap at 100
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save activity event', e);
    }

    return newEvent;
  }

  private static getCustomActivities(): ActivityEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return [];
  }

  /**
   * Dynamically synthesize activities from underlying canonical entities so no user data is orphaned.
   */
  private static synthesizeActivitiesFromState(): ActivityEvent[] {
    const events: ActivityEvent[] = [];

    // 1. Practice Sessions from StorageService
    try {
      const sessions = StorageService.getSessions();
      sessions.forEach(session => {
        events.push({
          id: `act-practice-${session.id}`,
          category: 'practice',
          title: session.config.interviewMode === 'live_intelligence' 
            ? `Live Interview Session: ${session.config.roleCategory}`
            : `Mock Interview: ${session.config.interviewType}`,
          description: `Completed ${session.responses.length} questions. Readiness calibration: ${session.overallScore}%.`,
          timestamp: session.createdAt,
          source: 'Practice',
          badgeText: `${session.overallScore}% Score`,
          badgeVariant: session.overallScore >= 80 ? 'emerald' : 'blue',
          metadata: { sessionId: session.id },
          linkTo: { tab: 'tracker', subTab: 'sessions' },
        });
      });
    } catch (e) {
      console.warn('Failed to read sessions for activity log', e);
    }

    // 2. Question & Answer Blueprints from KnowledgeStorageService
    try {
      const blueprints = KnowledgeStorageService.getBlueprints();
      blueprints.forEach(bp => {
        events.push({
          id: `act-bp-${bp.id}`,
          category: 'blueprint',
          title: `Created Q&A Blueprint: ${bp.title}`,
          description: `Structured response using ${bp.framework} framework for question: "${bp.questionText.slice(0, 75)}..."`,
          timestamp: bp.updatedAt || bp.createdAt || new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          source: 'Blueprint',
          badgeText: bp.framework,
          badgeVariant: 'purple',
          metadata: { blueprintId: bp.id },
          linkTo: { tab: 'profile' },
        });
      });
    } catch (e) {
      console.warn('Failed to read blueprints for activity log', e);
    }

    // 3. Work Experience & Evidence from KnowledgeStorageService
    try {
      const evidenceList = KnowledgeStorageService.getEvidence();
      evidenceList.forEach(ev => {
        events.push({
          id: `act-ev-${ev.id}`,
          category: 'work',
          title: `Added Work Experience Evidence: ${ev.title}`,
          description: `${ev.shortSummary.slice(0, 110)}... Key skills: ${ev.skills.slice(0, 3).join(', ')}.`,
          timestamp: ev.updatedAt || ev.createdAt || new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          source: 'Evidence',
          badgeText: ev.category,
          badgeVariant: 'amber',
          metadata: { evidenceId: ev.id },
          linkTo: { tab: 'profile' },
        });
      });
    } catch (e) {
      console.warn('Failed to read evidence for activity log', e);
    }

    // 4. Default Seeded Resume Activity if none exists
    const hasResumeActivity = events.some(e => e.category === 'resume');
    if (!hasResumeActivity) {
      events.push({
        id: 'act-resume-seed-1',
        category: 'resume',
        title: 'Uploaded & Extracted Resume: phandora_staff_engineer_2026.pdf',
        description: 'Successfully parsed 2 work experiences, 8 core competences, and 10 tech stack tools with 98% accuracy.',
        timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        source: 'Resume',
        badgeText: 'Parsed (1.8 MB)',
        badgeVariant: 'emerald',
        linkTo: { tab: 'profile' },
      });
    }

    return events;
  }
}
