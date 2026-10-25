import { InnovationSystemEntry } from '../types/innovationSystems';
import { resolveProvenance } from '../types/provenance';
import { INNOVATION_SYSTEMS_DATA } from '../data/innovationSystemsData';
import { AccessControlService } from '../../../services/accessControlService';
import { dataExposureGuard } from '../../../services/dataExposureGuardService';

const STORAGE_KEY = 'career_os_innovation_systems_v3';

function normalizeInnovation(i: InnovationSystemEntry): InnovationSystemEntry {
  return {
    ...i,
    provenance: i.provenance || resolveProvenance(i)
  };
}

class InnovationSystemsStore {
  private entries: InnovationSystemEntry[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      if (!dataExposureGuard.canPersistFullCatalogToStorage()) {
        this.entries = INNOVATION_SYSTEMS_DATA.map(normalizeInnovation);
        return;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.entries = parsed.map(normalizeInnovation);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load innovation systems from storage:', err);
    }
    this.entries = INNOVATION_SYSTEMS_DATA.map(normalizeInnovation);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    if (dataExposureGuard.canPersistFullCatalogToStorage()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
      } catch (err) {
        console.error('Failed to persist innovation systems:', err);
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

  public getEntries(): InnovationSystemEntry[] {
    const tier = AccessControlService.getAccessLevel();
    if (tier === 'PUBLIC') {
      return dataExposureGuard.paginateAndProject('innovation_systems', this.entries.slice(0, 1), undefined, 'PUBLIC').items;
    }
    if (tier === 'GUEST') {
      return dataExposureGuard.paginateAndProject('innovation_systems', this.entries.slice(0, 3), undefined, 'GUEST').items;
    }
    if (tier === 'DEMO') {
      const custom = this.entries.filter(e => !INNOVATION_SYSTEMS_DATA.some(init => init.id === e.id));
      const curated = this.entries.filter(e => INNOVATION_SYSTEMS_DATA.some(init => init.id === e.id)).slice(0, 5);
      return dataExposureGuard.projectCollectionForTier([...custom.slice(0, 2), ...curated], 'DEMO');
    }
    return [...this.entries];
  }

  public getEntry(id: string): InnovationSystemEntry | undefined {
    return dataExposureGuard.authorizeSingleRecordLookup('innovation_systems', id, this.getEntries());
  }

  public addEntry(entry: InnovationSystemEntry): void {
    const auth = dataExposureGuard.assertWriteAuthorized('innovation_systems', 'create');
    if (!auth.allowed) {
      throw new Error(auth.reason || 'Creation restricted by active access tier.');
    }
    if (!dataExposureGuard.checkDuplicateSubmit('innovation_systems', `add:${entry.name}`)) {
      return;
    }
    this.entries.unshift(entry);
    this.saveToStorage();
  }

  public updateEntry(id: string, updates: Partial<InnovationSystemEntry>): void {
    const auth = dataExposureGuard.assertWriteAuthorized('innovation_systems', 'update');
    if (!auth.allowed) return;
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) return;
    this.entries[index] = {
      ...this.entries[index],
      ...updates,
      dateObserved: updates.dateObserved || new Date().toISOString().split('T')[0]
    };
    this.saveToStorage();
  }

  public duplicateEntry(id: string): InnovationSystemEntry | null {
    const auth = dataExposureGuard.assertWriteAuthorized('innovation_systems', 'create');
    if (!auth.allowed) return null;
    const existing = this.entries.find(e => e.id === id);
    if (!existing) return null;

    const duplicated: InnovationSystemEntry = {
      ...existing,
      id: `inno-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${existing.name} (Copy)`,
      dateObserved: new Date().toISOString().split('T')[0]
    };

    this.entries.unshift(duplicated);
    this.saveToStorage();
    return duplicated;
  }

  public archiveEntry(id: string): void {
    const auth = dataExposureGuard.assertWriteAuthorized('innovation_systems', 'update');
    if (!auth.allowed) return;
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) return;
    this.entries[index] = {
      ...this.entries[index],
      isArchived: !this.entries[index].isArchived
    };
    this.saveToStorage();
  }

  public deleteEntry(id: string): void {
    const auth = dataExposureGuard.assertWriteAuthorized('innovation_systems', 'delete');
    if (!auth.allowed) return;
    this.entries = this.entries.filter(e => e.id !== id);
    this.saveToStorage();
  }

  public resetToDefault(): void {
    this.entries = [...INNOVATION_SYSTEMS_DATA];
    this.saveToStorage();
  }
}

export const innovationSystemsStore = new InnovationSystemsStore();
