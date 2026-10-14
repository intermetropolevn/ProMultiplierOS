import { CivicSystemEntry } from '../types/civicSystems';
import { resolveProvenance } from '../types/provenance';
import { CIVIC_SYSTEMS_DATA } from '../data/civicSystemsData';

const STORAGE_KEY = 'career_os_civic_systems_v3';

function normalizeCivic(c: CivicSystemEntry): CivicSystemEntry {
  return {
    ...c,
    provenance: c.provenance || resolveProvenance(c)
  };
}

class CivicSystemsStore {
  private entries: CivicSystemEntry[] = [];
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
          this.entries = parsed.map(normalizeCivic);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load civic systems from storage:', err);
    }
    this.entries = CIVIC_SYSTEMS_DATA.map(normalizeCivic);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
      this.notifyListeners();
    } catch (err) {
      console.error('Failed to persist civic systems:', err);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn());
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public getEntries(): CivicSystemEntry[] {
    return [...this.entries];
  }

  public getEntry(id: string): CivicSystemEntry | undefined {
    return this.entries.find(e => e.id === id);
  }

  public addEntry(entry: CivicSystemEntry): void {
    this.entries.unshift(entry);
    this.saveToStorage();
  }

  public updateEntry(id: string, updates: Partial<CivicSystemEntry>): void {
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) return;
    this.entries[index] = {
      ...this.entries[index],
      ...updates,
      dateTime: new Date().toISOString().split('T')[0]
    };
    this.saveToStorage();
  }

  public duplicateEntry(id: string): CivicSystemEntry | null {
    const existing = this.entries.find(e => e.id === id);
    if (!existing) return null;

    const duplicated: CivicSystemEntry = {
      ...existing,
      id: `civic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${existing.name} (Copy)`,
      dateTime: new Date().toISOString().split('T')[0]
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
    this.entries = [...CIVIC_SYSTEMS_DATA];
    this.saveToStorage();
  }
}

export const civicSystemsStore = new CivicSystemsStore();
