import { InnovationSystemEntry } from '../types/innovationSystems';
import { resolveProvenance } from '../types/provenance';
import { INNOVATION_SYSTEMS_DATA } from '../data/innovationSystemsData';

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
      this.notifyListeners();
    } catch (err) {
      console.error('Failed to persist innovation systems:', err);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn());
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public getEntries(): InnovationSystemEntry[] {
    return [...this.entries];
  }

  public getEntry(id: string): InnovationSystemEntry | undefined {
    return this.entries.find(e => e.id === id);
  }

  public addEntry(entry: InnovationSystemEntry): void {
    this.entries.unshift(entry);
    this.saveToStorage();
  }

  public updateEntry(id: string, updates: Partial<InnovationSystemEntry>): void {
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
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) return;
    this.entries[index] = {
      ...this.entries[index],
      isArchived: !this.entries[index].isArchived
    };
    this.saveToStorage();
  }

  public deleteEntry(id: string): void {
    this.entries = this.entries.filter(e => e.id !== id);
    this.saveToStorage();
  }

  public resetToDefault(): void {
    this.entries = [...INNOVATION_SYSTEMS_DATA];
    this.saveToStorage();
  }
}

export const innovationSystemsStore = new InnovationSystemsStore();
