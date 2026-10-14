import { WorkRelevantPathway } from '../types/workPathways';
import { resolveProvenance } from '../types/provenance';
import { WORK_RELEVANT_PATHWAYS } from '../data/workRelevantPathwaysData';

const STORAGE_KEY = 'career_os_work_pathways_v3';

function normalizePathway(p: any): WorkRelevantPathway {
  const name = p.name || p.title || 'Untitled Pathway';
  const parentRole = p.parentRole || p.role || 'Software Engineering';
  const description = p.description || p.summary || '';
  const activities = p.activities || p.stages || [];
  const deliverables = p.deliverables || p.deliverablesAndArtifacts || [];
  const requiredSkills = p.requiredSkills || p.connectedSkills || [];
  const evidenceLevel = p.evidenceLevel || p.evidenceStrengthLevel || 4;
  const pathwayType = p.pathwayType || 'Workstream';
  const today = new Date().toISOString().split('T')[0];

  return {
    ...p,
    provenance: p.provenance || resolveProvenance(p),
    id: p.id || `pathway-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name,
    title: name,
    codeName: p.codeName || 'PW-01',
    parentRole,
    role: parentRole,
    domain: p.domain || 'Enterprise SaaS',
    function: p.function || 'Core Software Engineering',
    workType: p.workType || 'Execution & Delivery',
    pathwayType,
    description,
    summary: description,
    objective: p.objective || 'Execute structured operational workflow delivering verified business value.',
    triggerWhenUsed: p.triggerWhenUsed || 'Triggered on sprint planning or feature initiation.',
    inputs: p.inputs && p.inputs.length > 0 ? p.inputs : ['User requirements', 'Technical specification', 'Architecture approval'],
    outputs: p.outputs && p.outputs.length > 0 ? p.outputs : ['Production release', 'Test report', 'Documentation'],
    activities,
    stages: activities,
    deliverables,
    deliverablesAndArtifacts: deliverables,
    requiredSkills,
    connectedSkills: requiredSkills,
    toolsAndPlatforms: p.toolsAndPlatforms || [],
    knowledgeSources: p.knowledgeSources || ['RFC specifications', 'Internal architecture runbook'],
    relatedFrameworks: p.relatedFrameworks || ['Agile Scrum', 'CI/CD best practices'],
    relatedProjects: p.relatedProjects || ['Enterprise platform migration'],
    relatedJobOpportunities: p.relatedJobOpportunities || [`Senior ${parentRole}`],
    difficulty: p.difficulty || 'Advanced',
    seniorityRelevance: p.seniorityRelevance || ['Mid-Level', 'Senior'],
    evidenceLevel,
    evidenceStrengthLevel: evidenceLevel,
    tags: p.tags || ['workflow'],
    sourceUrl: p.sourceUrl || '',
    officialWebsite: p.officialWebsite || '',
    referenceLinks: p.referenceLinks || [],
    createdDate: p.createdDate || today,
    updatedDate: p.updatedDate || today,
    isArchived: !!p.isArchived
  };
}

class WorkPathwaysStore {
  private pathways: WorkRelevantPathway[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.pathways = parsed.map(normalizePathway);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load work pathways from storage:', err);
    }
    this.pathways = WORK_RELEVANT_PATHWAYS.map(normalizePathway);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pathways));
      this.notifyListeners();
    } catch (err) {
      console.error('Failed to persist work pathways:', err);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn());
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public getPathways(): WorkRelevantPathway[] {
    return [...this.pathways];
  }

  public getPathway(id: string): WorkRelevantPathway | undefined {
    return this.pathways.find(p => p.id === id);
  }

  public addPathway(pathway: WorkRelevantPathway): void {
    this.pathways.unshift(pathway);
    this.saveToStorage();
  }

  public updatePathway(id: string, updates: Partial<WorkRelevantPathway>): void {
    const index = this.pathways.findIndex(p => p.id === id);
    if (index === -1) return;
    this.pathways[index] = {
      ...this.pathways[index],
      ...updates
    };
    this.saveToStorage();
  }

  public duplicatePathway(id: string): WorkRelevantPathway | null {
    const existing = this.pathways.find(p => p.id === id);
    if (!existing) return null;

    const duplicated: WorkRelevantPathway = {
      ...existing,
      id: `pathway-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: `${existing.title} (Copy)`,
      codeName: `${existing.codeName}-copy`
    };

    this.pathways.unshift(duplicated);
    this.saveToStorage();
    return duplicated;
  }

  public archivePathway(id: string): void {
    const index = this.pathways.findIndex(p => p.id === id);
    if (index === -1) return;
    this.pathways[index] = {
      ...this.pathways[index],
      isArchived: !this.pathways[index].isArchived
    };
    this.saveToStorage();
  }

  public deletePathway(id: string): void {
    this.pathways = this.pathways.filter(p => p.id !== id);
    this.saveToStorage();
  }

  public resetToDefault(): void {
    this.pathways = [...WORK_RELEVANT_PATHWAYS];
    this.saveToStorage();
  }
}

export const workPathwaysStore = new WorkPathwaysStore();
