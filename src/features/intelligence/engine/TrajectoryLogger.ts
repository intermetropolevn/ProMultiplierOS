// =========================================================================
// CAREER INTELLIGENCE ENGINE - TRAJECTORY LOGGER
// =========================================================================

import { AgentTrajectoryRecord } from './types';

const STORAGE_KEY = 'career_os_agent_trajectories_v1';

export class TrajectoryLogger {
  private static trajectories: AgentTrajectoryRecord[] = [];
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.trajectories = JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    this.initialized = true;
  }

  public static logTrajectory(record: AgentTrajectoryRecord): void {
    this.initialize();
    this.trajectories.unshift(record);
    // Keep last 40 trajectories for review & debug
    if (this.trajectories.length > 40) {
      this.trajectories.pop();
    }
    this.persist();
  }

  public static getTrajectory(runId: string): AgentTrajectoryRecord | undefined {
    this.initialize();
    return this.trajectories.find(t => t.runId === runId);
  }

  public static getAllTrajectories(): AgentTrajectoryRecord[] {
    this.initialize();
    return [...this.trajectories];
  }

  public static clearTrajectories(): void {
    this.trajectories = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }

  private static persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.trajectories));
    } catch {
      // Ignore localStorage errors
    }
  }
}
