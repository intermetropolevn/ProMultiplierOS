import { 
  ToolPlatformEntry, 
  ToolHistoricalVersion 
} from '../types/toolsPlatforms';
import { resolveProvenance } from '../types/provenance';
import { TOOLS_PLATFORMS_DATA } from '../data/toolsPlatformsData';
import { AccessControlService } from '../../../services/accessControlService';
import { dataExposureGuard } from '../../../services/dataExposureGuardService';

const STORAGE_KEY = 'career_os_tools_platforms_v3';

function normalizeTool(t: ToolPlatformEntry): ToolPlatformEntry {
  return {
    ...t,
    provenance: t.provenance || resolveProvenance(t)
  };
}

class ToolsPlatformsStore {
  private tools: ToolPlatformEntry[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      if (!dataExposureGuard.canPersistFullCatalogToStorage()) {
        this.tools = TOOLS_PLATFORMS_DATA.map(normalizeTool);
        return;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.tools = parsed.map(normalizeTool);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load tools & platforms from storage:', err);
    }
    this.tools = TOOLS_PLATFORMS_DATA.map(normalizeTool);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    if (dataExposureGuard.canPersistFullCatalogToStorage()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tools));
      } catch (err) {
        console.error('Failed to persist tools & platforms:', err);
      }
    }
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn());
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public getTools(): ToolPlatformEntry[] {
    const access = AccessControlService.getAccessLevel();
    if (access === 'PUBLIC') {
      return dataExposureGuard.paginateAndProject('tools', this.tools.slice(0, 1), undefined, 'PUBLIC').items;
    }
    if (access === 'GUEST') {
      return dataExposureGuard.paginateAndProject('tools', this.tools.slice(0, 3), undefined, 'GUEST').items;
    }
    if (access === 'DEMO') {
      const custom = this.tools.filter(t => !TOOLS_PLATFORMS_DATA.some(init => init.id === t.id));
      const curated = this.tools.filter(t => TOOLS_PLATFORMS_DATA.some(init => init.id === t.id)).slice(0, 5);
      return dataExposureGuard.projectCollectionForTier([...custom.slice(0, 2), ...curated], 'DEMO');
    }
    return [...this.tools];
  }

  public getTool(id: string): ToolPlatformEntry | undefined {
    return dataExposureGuard.authorizeSingleRecordLookup('tools', id, this.getTools());
  }

  public addTool(tool: ToolPlatformEntry): void {
    const auth = dataExposureGuard.assertWriteAuthorized('tools', 'create');
    if (!auth.allowed) {
      throw new Error(auth.reason || 'Creation restricted by active access tier.');
    }
    const customCount = this.tools.filter(t => !TOOLS_PLATFORMS_DATA.some(init => init.id === t.id)).length;
    const decision = AccessControlService.canCreateWorkflowItem('tools', customCount);
    if (!decision.allowed) {
      console.warn('Tool creation blocked by access control:', decision.reason);
      throw new Error(decision.reason || 'Creation restricted by active access tier.');
    }
    if (!dataExposureGuard.checkDuplicateSubmit('tools', `add:${tool.name}`)) {
      return;
    }
    this.tools.unshift(tool);
    this.saveToStorage();
  }

  public updateTool(
    id: string, 
    updates: Partial<ToolPlatformEntry>, 
    preserveVersionHistory: boolean = true
  ): void {
    const auth = dataExposureGuard.assertWriteAuthorized('tools', 'update');
    if (!auth.allowed) return;
    const index = this.tools.findIndex(t => t.id === id);
    if (index === -1) return;

    const existing = this.tools[index];
    let updatedHistory: ToolHistoricalVersion[] = existing.versionHistory ? [...existing.versionHistory] : [];

    // If version changed or user requested preservation, archive the previous version info
    const versionChanged = updates.version && updates.version !== existing.version;
    if (preserveVersionHistory && (versionChanged || updates.status === 'Previous Version')) {
      const historyItem: ToolHistoricalVersion = {
        version: existing.version || 'Previous Edition',
        releaseDate: existing.releaseDate,
        observedDate: existing.observedDate || new Date().toISOString().split('T')[0],
        lastVerified: existing.lastVerified,
        dataSourceDate: existing.dataSourceDate,
        status: 'Previous Version',
        notes: `Archived on ${new Date().toISOString().split('T')[0]} during version update to ${updates.version || 'newer release'}.`,
        capabilitiesSnapshot: existing.tagline || existing.capabilitiesSummary.keyCapacities[0],
        archivedAt: new Date().toISOString()
      };
      // Prepend to history
      updatedHistory.unshift(historyItem);
    }

    const updatedTool: ToolPlatformEntry = {
      ...existing,
      ...updates,
      versionHistory: updatedHistory,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    this.tools[index] = updatedTool;
    this.saveToStorage();
  }

  public duplicateTool(id: string): ToolPlatformEntry | null {
    const auth = dataExposureGuard.assertWriteAuthorized('tools', 'create');
    if (!auth.allowed) return null;
    const existing = this.tools.find(t => t.id === id);
    if (!existing) return null;

    const duplicated: ToolPlatformEntry = {
      ...existing,
      id: `tool-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${existing.name} (Copy)`,
      lastUpdated: new Date().toISOString().split('T')[0],
      sourceState: 'User Edited'
    };

    this.tools.unshift(duplicated);
    this.saveToStorage();
    return duplicated;
  }

  public archiveTool(id: string): void {
    const auth = dataExposureGuard.assertWriteAuthorized('tools', 'update');
    if (!auth.allowed) return;
    const index = this.tools.findIndex(t => t.id === id);
    if (index === -1) return;
    this.tools[index] = {
      ...this.tools[index],
      isArchived: !this.tools[index].isArchived,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    this.saveToStorage();
  }

  public deleteTool(id: string): void {
    const auth = dataExposureGuard.assertWriteAuthorized('tools', 'delete');
    if (!auth.allowed) return;
    this.tools = this.tools.filter(t => t.id !== id);
    this.saveToStorage();
  }

  public resetToDefault(): void {
    this.tools = [...TOOLS_PLATFORMS_DATA];
    this.saveToStorage();
  }
}

export const toolsPlatformsStore = new ToolsPlatformsStore();
