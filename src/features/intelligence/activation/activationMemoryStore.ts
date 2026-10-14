// =========================================================================
// CAREER OS - ACTIVATION MEMORY & DECISION AUDIT STORE
// =========================================================================

import { ActivationDecision, CapabilityLevel } from './types';
import { VietnameseNormalizer } from '../services/vietnameseNormalizer';

export interface MemoryEntry {
  fingerprint: string;
  queryNormalized: string;
  solvedLevel: CapabilityLevel;
  cachedResponseSummary: string;
  evidenceIds: string[];
  executionTimeMs: number;
  timestamp: string;
  usageCount: number;
}

const MEMORY_STORAGE_KEY = 'career_os_activation_memory';
const DECISIONS_STORAGE_KEY = 'career_os_activation_decisions';

export class ActivationMemoryStore {
  private static memoryEntries: Map<string, MemoryEntry> = new Map();
  private static decisions: ActivationDecision[] = [];
  private static initialized = false;

  private static init() {
    if (this.initialized) return;
    try {
      // Load episodic memories
      const storedMem = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (storedMem) {
        const parsed: MemoryEntry[] = JSON.parse(storedMem);
        parsed.forEach(entry => this.memoryEntries.set(entry.fingerprint, entry));
      }

      // Load decision audit trail
      const storedDec = localStorage.getItem(DECISIONS_STORAGE_KEY);
      if (storedDec) {
        this.decisions = JSON.parse(storedDec);
      }
    } catch (e) {
      console.warn('Could not initialize ActivationMemoryStore from localStorage', e);
    }
    this.initialized = true;
  }

  /**
   * Generates a normalized semantic fingerprint for task deduplication
   */
  static generateFingerprint(input: string): string {
    const clean = VietnameseNormalizer.toSearchKey(input || '')
      .replace(/[^\w\s]/g, '')
      .trim()
      .split(/\s+/)
      .sort()
      .join('_');
    return clean;
  }

  /**
   * Checks episodic / procedural memory for previous occurrences (Rule #11 Acceptance Test I)
   */
  static lookupEpisodicMemory(input: string): MemoryEntry | null {
    this.init();
    const fp = this.generateFingerprint(input);
    const entry = this.memoryEntries.get(fp);
    if (entry) {
      entry.usageCount += 1;
      this.persistMemory();
      return { ...entry };
    }
    return null;
  }

  /**
   * Records a successfully executed task into procedural / episodic memory
   */
  static recordEpisodicMemory(
    input: string, 
    level: CapabilityLevel, 
    summary: string, 
    evidenceIds: string[] = [], 
    executionTimeMs = 120
  ) {
    this.init();
    const fp = this.generateFingerprint(input);
    const entry: MemoryEntry = {
      fingerprint: fp,
      queryNormalized: VietnameseNormalizer.clean(input),
      solvedLevel: level,
      cachedResponseSummary: summary,
      evidenceIds,
      executionTimeMs,
      timestamp: new Date().toISOString(),
      usageCount: 1,
    };
    this.memoryEntries.set(fp, entry);
    this.persistMemory();
  }

  /**
   * Logs an activation decision for developer auditing (Rule #12)
   */
  static logDecision(decision: ActivationDecision) {
    this.init();
    this.decisions.unshift(decision);
    // Keep last 100 decisions
    if (this.decisions.length > 100) {
      this.decisions = this.decisions.slice(0, 100);
    }
    this.persistDecisions();

    // Broadcast update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('career_os_activation_decision_logged', {
        detail: decision
      }));
    }
  }

  static getRecentDecisions(limit = 20): ActivationDecision[] {
    this.init();
    return this.decisions.slice(0, limit);
  }

  static getDecisionById(id: string): ActivationDecision | undefined {
    this.init();
    return this.decisions.find(d => d.id === id);
  }

  static clearAuditHistory() {
    this.decisions = [];
    try {
      localStorage.removeItem(DECISIONS_STORAGE_KEY);
    } catch {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('career_os_activation_decision_logged'));
    }
  }

  private static persistMemory() {
    try {
      const arr = Array.from(this.memoryEntries.values());
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(arr.slice(-50)));
    } catch {}
  }

  private static persistDecisions() {
    try {
      localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(this.decisions));
    } catch {}
  }
}
