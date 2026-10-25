import { CareerOpportunity, TrackedRadarOpportunity } from '../types';
import { INITIAL_OPPORTUNITIES } from '../data/opportunitiesData';
import { curatedBetaData } from './curatedBetaData';
import { AccessControlService } from './accessControlService';
import { demoWorkspaceService } from './demoWorkspaceService';

const STORAGE_KEYS = {
  OPPORTUNITIES: 'career_os_opportunities_v2',
  RADAR: 'career_os_tracked_opportunities_v1',
  UPVOTES: 'career_os_opportunity_upvotes_v1',
};

export const OpportunityService = {
  // Broadcast updates
  notifyOpportunities() {
    window.dispatchEvent(new CustomEvent('career_opportunities_updated'));
  },

  notifyRadar() {
    window.dispatchEvent(new CustomEvent('career_radar_updated'));
  },

  // 1. OPPORTUNITIES CRUD
  getAllOpportunities(): CareerOpportunity[] {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      return demoWorkspaceService.getOpportunities();
    }

    // In Public Beta mode (PUBLIC / GUEST): return curated 3-item signals and programs
    if (curatedBetaData.isCuratedBetaActive()) {
      return curatedBetaData.getOpportunities();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      if (stored) {
        const parsed: CareerOpportunity[] = JSON.parse(stored);
        // Sync local upvotes if stored
        const userUpvotes = this.getUserUpvotes();
        return parsed.map(opp => {
          if (opp.companySignal) {
            return {
              ...opp,
              companySignal: {
                ...opp.companySignal,
                userHasUpvoted: Boolean(userUpvotes[opp.id])
              }
            };
          }
          return opp;
        });
      }
    } catch (e) {
      console.error('Failed to parse opportunities', e);
    }
    return INITIAL_OPPORTUNITIES;
  },

  saveOpportunities(opportunities: CareerOpportunity[]): CareerOpportunity[] {
    if (AccessControlService.getAccessLevel() === 'DEMO') {
      demoWorkspaceService.saveOpportunities(opportunities, true);
      this.notifyOpportunities();
      return opportunities;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
    } catch (e) {
      console.error('Failed to persist opportunities', e);
    }
    this.notifyOpportunities();
    return opportunities;
  },

  getOpportunityById(id: string): CareerOpportunity | undefined {
    return this.getAllOpportunities().find(o => o.id === id);
  },

  createOpportunity(opportunityData: Omit<CareerOpportunity, 'id' | 'createdAt' | 'updatedAt'>): CareerOpportunity {
    const decision = AccessControlService.canCreateWorkflowItem('opportunities', 0);
    if (!decision.allowed) {
      throw new Error(decision.reason || 'Creation restricted by active access tier.');
    }

    const list = this.getAllOpportunities();
    const newOpportunity: CareerOpportunity = {
      ...opportunityData,
      id: `opp-${opportunityData.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newOpportunity, ...list];
    this.saveOpportunities(updated);
    return newOpportunity;
  },

  updateOpportunity(id: string, updates: Partial<CareerOpportunity>): CareerOpportunity | null {
    const list = this.getAllOpportunities();
    const index = list.findIndex(o => o.id === id);
    if (index === -1) return null;

    const updatedOpp: CareerOpportunity = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updatedOpp;
    this.saveOpportunities(list);
    return updatedOpp;
  },

  deleteOpportunity(id: string): boolean {
    const list = this.getAllOpportunities();
    const filtered = list.filter(o => o.id !== id);
    this.saveOpportunities(filtered);
    // Also remove from radar if tracked
    this.removeOpportunityFromRadar(id);
    return true;
  },

  resetToDefaultOpportunities(): CareerOpportunity[] {
    localStorage.removeItem(STORAGE_KEYS.OPPORTUNITIES);
    this.notifyOpportunities();
    return INITIAL_OPPORTUNITIES;
  },

  // 2. USER UPVOTES (PART 8: Transparent Community Ranking)
  getUserUpvotes(): Record<string, boolean> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.UPVOTES);
      return stored ? JSON.parse(stored) : { 'opp-company-stripe': true };
    } catch {
      return {};
    }
  },

  toggleUpvote(opportunityId: string): { upvoted: boolean; count: number } {
    const list = this.getAllOpportunities();
    const userUpvotes = this.getUserUpvotes();
    const hasUpvoted = Boolean(userUpvotes[opportunityId]);

    const targetIndex = list.findIndex(o => o.id === opportunityId);
    let newCount = 0;
    const nextState = !hasUpvoted;

    if (targetIndex !== -1 && list[targetIndex].companySignal) {
      const signal = list[targetIndex].companySignal!;
      newCount = nextState ? signal.upvoteCount + 1 : Math.max(0, signal.upvoteCount - 1);
      
      list[targetIndex] = {
        ...list[targetIndex],
        companySignal: {
          ...signal,
          upvoteCount: newCount,
          userHasUpvoted: nextState
        }
      };
      this.saveOpportunities(list);
    }

    userUpvotes[opportunityId] = nextState;
    try {
      localStorage.setItem(STORAGE_KEYS.UPVOTES, JSON.stringify(userUpvotes));
    } catch (e) {
      console.error('Failed to save upvotes', e);
    }

    return { upvoted: nextState, count: newCount };
  },

  // 3. CAREER RADAR MANAGEMENT (PART 9: Add to Radar)
  getRadarOpportunities(): TrackedRadarOpportunity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RADAR);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load tracked radar opportunities', e);
    }
    // Default initial tracked item (e.g. Gemini AI Hackathon)
    const initialOpp = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-challenge-gemini-ai');
    if (initialOpp) {
      return [{
        opportunityId: initialOpp.id,
        opportunity: initialOpp,
        addedAt: new Date().toISOString(),
        deadline: initialOpp.deadline,
        status: 'saved',
        notes: 'Targeting Autonomous Agent track with 3-person team.'
      }];
    }
    return [];
  },

  isOpportunityInRadar(opportunityId: string): boolean {
    const radar = this.getRadarOpportunities();
    return radar.some(r => r.opportunityId === opportunityId);
  },

  addOpportunityToRadar(opportunity: CareerOpportunity, notes: string = ''): TrackedRadarOpportunity {
    const radar = this.getRadarOpportunities();
    const existing = radar.find(r => r.opportunityId === opportunity.id);
    if (existing) {
      return existing;
    }

    const newTracked: TrackedRadarOpportunity = {
      opportunityId: opportunity.id,
      opportunity,
      addedAt: new Date().toISOString(),
      deadline: opportunity.deadline,
      status: 'saved',
      notes,
    };

    const updated = [newTracked, ...radar];
    try {
      localStorage.setItem(STORAGE_KEYS.RADAR, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist radar opportunities', e);
    }
    this.notifyRadar();
    return newTracked;
  },

  removeOpportunityFromRadar(opportunityId: string): boolean {
    const radar = this.getRadarOpportunities();
    const filtered = radar.filter(r => r.opportunityId !== opportunityId);
    try {
      localStorage.setItem(STORAGE_KEYS.RADAR, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to remove from radar', e);
    }
    this.notifyRadar();
    return true;
  },

  updateRadarStatus(
    opportunityId: string, 
    status: TrackedRadarOpportunity['status'], 
    notes?: string
  ): TrackedRadarOpportunity | null {
    const radar = this.getRadarOpportunities();
    const index = radar.findIndex(r => r.opportunityId === opportunityId);
    if (index === -1) return null;

    radar[index] = {
      ...radar[index],
      status,
      notes: notes !== undefined ? notes : radar[index].notes,
    };

    try {
      localStorage.setItem(STORAGE_KEYS.RADAR, JSON.stringify(radar));
    } catch (e) {
      console.error('Failed to update radar opportunity', e);
    }
    this.notifyRadar();
    return radar[index];
  }
};
