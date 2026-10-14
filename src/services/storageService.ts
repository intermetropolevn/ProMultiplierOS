import { 
  SavedJobApplication, 
  JobListing, 
  MockInterviewSession, 
  UserCareerProfile, 
  RoleCategory, 
  SectorDomain, 
  ExperienceLevel,
  JobApplicationStatus
} from '../types';
import { JOBS_DATA } from '../data/jobsData';

const STORAGE_KEYS = {
  WISHLIST: 'career_os_wishlist_v1',
  SESSIONS: 'career_os_sessions_v1',
  BOOKMARKS: 'career_os_bookmarks_v1',
  PROFILE: 'career_os_profile_v1',
};

const DEFAULT_PROFILE: UserCareerProfile = {
  targetRole: 'Software Engineering',
  targetRoleBlueprintId: 'role-staff-swe',
  targetDomain: 'Enterprise SaaS',
  targetIndustryDomains: ['Enterprise SaaS', 'Fintech & Payments'],
  targetLevel: 'Senior',
  targetSalary: '$180,000 - $240,000',
  bookmarkedQuestionIds: ['q-tech-idempotency', 'q-star-disagreement'],
  readinessScore: 78,
};

export const StorageService = {
  getWishlist(): SavedJobApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (!data) {
        // Seed initial saved jobs for realistic demo
        const initialSaved: SavedJobApplication[] = [
          {
            id: 'saved-1',
            jobId: JOBS_DATA[0].id,
            job: JOBS_DATA[0],
            status: 'Applied',
            savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: 'Referred by former colleague on Platform team. Emphasized Postgres high-throughput experience and Kafka idempotency.',
            targetSalary: '$220,000 + Equity',
            referralContact: 'alex.chen@alumni.net',
          },
          {
            id: 'saved-2',
            jobId: JOBS_DATA[1].id,
            job: JOBS_DATA[1],
            status: 'Wishlist',
            savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Check portfolio for design token case studies before submitting.',
            targetSalary: '$190,000',
          },
        ];
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(initialSaved));
        return initialSaved;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveJobToWishlist(job: JobListing, status: JobApplicationStatus = 'Wishlist'): SavedJobApplication[] {
    const list = this.getWishlist();
    const existingIndex = list.findIndex(item => item.jobId === job.id);
    if (existingIndex >= 0) {
      list[existingIndex].status = status;
    } else {
      list.unshift({
        id: `saved-${Date.now()}`,
        jobId: job.id,
        job,
        status,
        savedAt: new Date().toISOString(),
        notes: '',
      });
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    return list;
  },

  removeJobFromWishlist(jobId: string): SavedJobApplication[] {
    const list = this.getWishlist().filter(item => item.jobId !== jobId && item.id !== jobId);
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    return list;
  },

  updateJobApplication(id: string, updates: Partial<SavedJobApplication>): SavedJobApplication[] {
    const list = this.getWishlist();
    const index = list.findIndex(item => item.id === id || item.jobId === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    }
    return list;
  },

  updateJobStatus(id: string, status: JobApplicationStatus): SavedJobApplication[] {
    return this.updateJobApplication(id, { status });
  },

  updateJobNotes(id: string, notes: string): SavedJobApplication[] {
    return this.updateJobApplication(id, { notes });
  },

  isJobSaved(jobId: string): boolean {
    const list = this.getWishlist();
    return list.some(item => item.jobId === jobId);
  },

  getSessions(): MockInterviewSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveSession(session: MockInterviewSession): MockInterviewSession[] {
    const sessions = this.getSessions();
    const filtered = sessions.filter(s => s.id !== session.id);
    filtered.unshift(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filtered));
    return filtered;
  },

  getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (!data) {
        return ['q-tech-idempotency', 'q-star-disagreement'];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  getBookmarkedQuestions(): string[] {
    return this.getBookmarks();
  },

  toggleBookmark(questionId: string): string[] {
    const bookmarks = this.getBookmarks();
    let updated: string[];
    if (bookmarks.includes(questionId)) {
      updated = bookmarks.filter(id => id !== questionId);
    } else {
      updated = [...bookmarks, questionId];
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  },

  toggleBookmarkQuestion(questionId: string): string[] {
    return this.toggleBookmark(questionId);
  },

  getProfile(): UserCareerProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) {
        return DEFAULT_PROFILE;
      }
      const parsed = JSON.parse(data);
      // Migration: Ensure targetIndustryDomains[] exists and preserves existing single domain
      let domains: SectorDomain[] = parsed.targetIndustryDomains || parsed.targetDomains;
      if (!domains || !Array.isArray(domains) || domains.length === 0) {
        if (parsed.targetDomain) {
          domains = [parsed.targetDomain];
        } else if (parsed.targetIndustryDomain) {
          domains = [parsed.targetIndustryDomain];
        } else {
          domains = ['Enterprise SaaS', 'Fintech & Payments'];
        }
      }
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        targetIndustryDomains: domains,
        targetDomain: parsed.targetDomain || domains[0] || 'Enterprise SaaS'
      };
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  getUserProfile(): UserCareerProfile {
    return this.getProfile();
  },

  updateProfile(updates: Partial<UserCareerProfile>): UserCareerProfile {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  saveUserProfile(updates: Partial<UserCareerProfile>): UserCareerProfile {
    return this.updateProfile(updates);
  },
};
