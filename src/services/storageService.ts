import { 
  SavedJobApplication, 
  JobListing, 
  MockInterviewSession, 
  UserCareerProfile, 
  SectorDomain, 
  JobApplicationStatus
} from '../types';
import { JOBS_DATA } from '../data/jobsData';
import { AccessControlService } from './accessControlService';
import { demoWorkspaceService } from './demoWorkspaceService';
import { dataExposureGuard } from './dataExposureGuardService';

const STORAGE_KEYS = {
  WISHLIST: 'career_os_wishlist_v1',
  SESSIONS: 'career_os_sessions_v1',
  BOOKMARKS: 'career_os_bookmarks_v1',
  PROFILE: 'career_os_profile_v1',
};

const DEFAULT_PROFILE: UserCareerProfile = {
  name: 'Alex Chen',
  targetRole: 'Product Management',
  targetRoleBlueprintId: 'role-product-mgr',
  targetTitle: 'Technical Product Manager',
  targetDomain: 'Enterprise SaaS',
  targetIndustryDomains: ['Enterprise SaaS', 'Fintech & Payments'],
  targetLevel: 'Senior',
  targetSalary: '$180,000 - $240,000',
  bookmarkedQuestionIds: ['q-tech-idempotency', 'q-star-disagreement'],
  readinessScore: 78,
};

export const StorageService = {
  getWishlist(): SavedJobApplication[] {
    const tier = AccessControlService.getAccessLevel();
    if (tier === 'DEMO') {
      return dataExposureGuard.projectCollectionForTier(demoWorkspaceService.getWishlist(), 'DEMO');
    }

    // Seed initial saved jobs (without persisting private contacts in PUBLIC/GUEST localStorage)
    const initialSaved: SavedJobApplication[] = [
      {
        id: 'saved-1',
        jobId: JOBS_DATA[0].id,
        job: dataExposureGuard.projectRecordForTier(JOBS_DATA[0], tier),
        status: 'Applied',
        savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Emphasized Postgres high-throughput experience and Kafka idempotency.',
        targetSalary: '$220,000 + Equity',
        ...(tier === 'FULL' ? { referralContact: 'alex.chen@alumni.net' } : {})
      },
      {
        id: 'saved-2',
        jobId: JOBS_DATA[1].id,
        job: dataExposureGuard.projectRecordForTier(JOBS_DATA[1], tier),
        status: 'Wishlist',
        savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Check portfolio for design token case studies before submitting.',
        targetSalary: '$190,000',
      },
    ];

    if (tier === 'PUBLIC') {
      return dataExposureGuard.projectCollectionForTier(initialSaved.slice(0, 1), 'PUBLIC');
    }
    if (tier === 'GUEST') {
      return dataExposureGuard.projectCollectionForTier(initialSaved, 'GUEST');
    }

    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(initialSaved));
        return initialSaved;
      }
      return JSON.parse(data);
    } catch {
      return initialSaved;
    }
  },

  saveJobToWishlist(job: JobListing, status: JobApplicationStatus = 'Wishlist'): SavedJobApplication[] {
    const auth = dataExposureGuard.assertWriteAuthorized('wishlist', 'create');
    if (!auth.allowed) {
      return this.getWishlist();
    }
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
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.saveWishlist(list);
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    return list;
  },

  removeJobFromWishlist(jobId: string): SavedJobApplication[] {
    const auth = dataExposureGuard.assertWriteAuthorized('wishlist', 'delete');
    if (!auth.allowed) {
      return this.getWishlist();
    }
    const list = this.getWishlist().filter(item => item.jobId !== jobId && item.id !== jobId);
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.saveWishlist(list);
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    return list;
  },

  updateJobApplication(id: string, updates: Partial<SavedJobApplication>): SavedJobApplication[] {
    const auth = dataExposureGuard.assertWriteAuthorized('wishlist', 'update');
    if (!auth.allowed) {
      return this.getWishlist();
    }
    const list = this.getWishlist();
    const index = list.findIndex(item => item.id === id || item.jobId === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      if (AccessControlService.getAccessLevel() === 'DEMO') {
        return demoWorkspaceService.saveWishlist(list);
      }
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
    const tier = AccessControlService.getAccessLevel();
    if (tier === 'DEMO') {
      return demoWorkspaceService.getSessions();
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!data) {
        return [];
      }
      const parsed: MockInterviewSession[] = JSON.parse(data);
      if (tier === 'PUBLIC') return parsed.slice(0, 1);
      if (tier === 'GUEST') return parsed.slice(0, 3);
      return parsed;
    } catch {
      return [];
    }
  },

  saveSession(session: MockInterviewSession): MockInterviewSession[] {
    const sessions = this.getSessions();
    const filtered = sessions.filter(s => s.id !== session.id);
    filtered.unshift(session);
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.saveSessions(filtered);
    }
    if (dataExposureGuard.canPersistFullCatalogToStorage()) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filtered));
    }
    return filtered;
  },

  getBookmarks(): string[] {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.getBookmarks();
    }
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
    const auth = dataExposureGuard.assertWriteAuthorized('bookmarks', 'update');
    if (!auth.allowed) {
      return this.getBookmarks();
    }
    const bookmarks = this.getBookmarks();
    let updated: string[];
    if (bookmarks.includes(questionId)) {
      updated = bookmarks.filter(id => id !== questionId);
    } else {
      updated = [...bookmarks, questionId];
    }
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.saveBookmarks(updated);
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  },

  toggleBookmarkQuestion(questionId: string): string[] {
    return this.toggleBookmark(questionId);
  },

  getProfile(): UserCareerProfile {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.getProfile();
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) {
        return DEFAULT_PROFILE;
      }
      const parsed = JSON.parse(data);
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
      let roleBpId = parsed.targetRoleBlueprintId;
      if (!roleBpId || roleBpId === 'role-staff-swe') {
        roleBpId = 'role-product-mgr';
      }
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        targetRoleBlueprintId: roleBpId,
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
    const auth = dataExposureGuard.assertWriteAuthorized('profile', 'update');
    if (!auth.allowed) {
      return this.getProfile();
    }
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.saveProfile(updates);
    }
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  saveUserProfile(updates: Partial<UserCareerProfile>): UserCareerProfile {
    return this.updateProfile(updates);
  },
};
