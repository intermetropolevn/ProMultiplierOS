export type SkillCategory = 'competence' | 'tool_stack';
export type SkillProvenance = 'verified' | 'extracted' | 'manual' | 'edited';

export interface CanonicalSkill {
  id: string;
  name: string;
  category: SkillCategory;
  provenance: SkillProvenance;
  linkedEvidenceCount?: number;
  level?: 'Proficient' | 'Advanced' | 'Expert';
}

const STORAGE_KEY = 'career_os_canonical_skills_v1';

export const INITIAL_SKILLS: CanonicalSkill[] = [
  // Core Competences
  { id: 'sk-c-1', name: 'Distributed Systems Architecture', category: 'competence', provenance: 'verified', linkedEvidenceCount: 3, level: 'Expert' },
  { id: 'sk-c-2', name: 'High-Throughput Idempotency', category: 'competence', provenance: 'verified', linkedEvidenceCount: 2, level: 'Expert' },
  { id: 'sk-c-3', name: 'Zero-Downtime Migration Design', category: 'competence', provenance: 'verified', linkedEvidenceCount: 2, level: 'Expert' },
  { id: 'sk-c-4', name: 'Stakeholder Management & RFC Consensus', category: 'competence', provenance: 'verified', linkedEvidenceCount: 4, level: 'Advanced' },
  { id: 'sk-c-5', name: 'Constructive Conflict Resolution', category: 'competence', provenance: 'verified', linkedEvidenceCount: 2, level: 'Advanced' },
  { id: 'sk-c-6', name: 'Technical Debt & Cost of Delay', category: 'competence', provenance: 'verified', linkedEvidenceCount: 2, level: 'Advanced' },
  { id: 'sk-c-7', name: 'Product Strategy & Type 1/2 Decisions', category: 'competence', provenance: 'verified', linkedEvidenceCount: 2, level: 'Advanced' },
  { id: 'sk-c-8', name: 'Incident Post-Mortem & Chaos Engineering', category: 'competence', provenance: 'manual', linkedEvidenceCount: 1, level: 'Proficient' },

  // Tools & Stacks
  { id: 'sk-t-1', name: 'PostgreSQL & Query Optimization', category: 'tool_stack', provenance: 'verified', linkedEvidenceCount: 3, level: 'Expert' },
  { id: 'sk-t-2', name: 'Kafka & Event Streaming', category: 'tool_stack', provenance: 'verified', linkedEvidenceCount: 2, level: 'Expert' },
  { id: 'sk-t-3', name: 'Debezium (CDC)', category: 'tool_stack', provenance: 'verified', linkedEvidenceCount: 1, level: 'Advanced' },
  { id: 'sk-t-4', name: 'Redis (Atomic Locks & Replay)', category: 'tool_stack', provenance: 'verified', linkedEvidenceCount: 2, level: 'Expert' },
  { id: 'sk-t-5', name: 'TypeScript & Node.js', category: 'tool_stack', provenance: 'verified', linkedEvidenceCount: 4, level: 'Expert' },
  { id: 'sk-t-6', name: 'Docker & Microservices', category: 'tool_stack', provenance: 'extracted', linkedEvidenceCount: 1, level: 'Advanced' },
  { id: 'sk-t-7', name: 'Kubernetes & Argo Rollouts', category: 'tool_stack', provenance: 'verified', linkedEvidenceCount: 1, level: 'Advanced' },
  { id: 'sk-t-8', name: 'Prometheus & Alerting', category: 'tool_stack', provenance: 'extracted', linkedEvidenceCount: 1, level: 'Proficient' },
  { id: 'sk-t-9', name: 'AWS (ECS, SQS, RDS, IAM)', category: 'tool_stack', provenance: 'manual', linkedEvidenceCount: 1, level: 'Advanced' },
  { id: 'sk-t-10', name: 'REST & gRPC APIs', category: 'tool_stack', provenance: 'extracted', linkedEvidenceCount: 2, level: 'Expert' },
];

export class SkillService {
  public static getSkills(): CanonicalSkill[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SKILLS));
      return INITIAL_SKILLS;
    } catch {
      return INITIAL_SKILLS;
    }
  }

  public static saveSkills(skills: CanonicalSkill[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
    } catch (e) {
      console.warn('Failed to save canonical skills', e);
    }
  }

  public static addSkill(skill: Omit<CanonicalSkill, 'id'>): CanonicalSkill {
    const list = this.getSkills();
    const newSkill: CanonicalSkill = {
      ...skill,
      id: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [newSkill, ...list];
    this.saveSkills(updated);
    return newSkill;
  }

  public static updateSkill(id: string, updates: Partial<CanonicalSkill>): CanonicalSkill | undefined {
    const list = this.getSkills();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    const existing = list[index];
    const newProvenance: SkillProvenance = 
      existing.provenance === 'extracted' ? 'edited' : (updates.provenance || existing.provenance);

    const updated: CanonicalSkill = {
      ...existing,
      ...updates,
      id: existing.id,
      provenance: newProvenance
    };

    list[index] = updated;
    this.saveSkills(list);
    return updated;
  }

  /**
   * Imports skills parsed from resume.
   * Preserves manual and edited skills while refreshing extracted skills.
   */
  public static importExtractedSkills(competences: string[], tools: string[]): CanonicalSkill[] {
    const currentList = this.getSkills();

    // Preserve manual & edited
    const preservedSkills = currentList.filter(s => s.provenance === 'manual' || s.provenance === 'edited');
    const preservedNames = new Set(preservedSkills.map(s => s.name.toLowerCase()));

    const newExtractedSkills: CanonicalSkill[] = [];

    // Add competences
    competences.forEach((comp, idx) => {
      if (!preservedNames.has(comp.toLowerCase())) {
        newExtractedSkills.push({
          id: `sk-c-ext-${Date.now()}-${idx}`,
          name: comp,
          category: 'competence',
          provenance: 'extracted',
          linkedEvidenceCount: 1,
          level: 'Advanced'
        });
      }
    });

    // Add tools
    tools.forEach((tool, idx) => {
      if (!preservedNames.has(tool.toLowerCase())) {
        newExtractedSkills.push({
          id: `sk-t-ext-${Date.now()}-${idx}`,
          name: tool,
          category: 'tool_stack',
          provenance: 'extracted',
          linkedEvidenceCount: 1,
          level: 'Proficient'
        });
      }
    });

    const merged = [...preservedSkills, ...newExtractedSkills];
    this.saveSkills(merged);
    return merged;
  }

  public static removeSkill(id: string): void {
    const list = this.getSkills().filter(s => s.id !== id);
    this.saveSkills(list);
  }
}
