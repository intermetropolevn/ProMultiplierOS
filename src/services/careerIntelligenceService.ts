// =========================================================================
// CAREER OS - UNIFIED CAREER INTELLIGENCE & CAPABILITY LEDGER SERVICE
// =========================================================================

import { careerGraphEventBus } from './careerGraphEventBus';
import { WorkExperienceService, WorkExperienceRecord } from './workExperienceService';

export interface UnderlyingSkill {
  id: string;
  name: string;
  level: number; // 1 to 6 (L1: Exposure, L2: Working, L3: Competent, L4: Proficient, L5: Advanced, L6: Expert)
  category?: 'competence' | 'tool_stack';
  source?: 'Resume' | 'Manual Record';
}

export interface CoreCompetenceRecord {
  id: string;
  canonicalName: string;
  category: 'competence';
  underlyingSkills: string[];
  source: 'Resume' | 'Manual Record';
  status: 'verified' | 'in_progress' | 'draft';
  evidenceReferences: string[];
  isDemo?: boolean;
  updatedAt: string;
}

export interface ToolStackRecord {
  id: string;
  canonicalName: string;
  category: 'tool_stack';
  aliases: string[];
  source: 'Resume' | 'Manual Record';
  relatedSkills: string[];
  isDemo?: boolean;
  updatedAt: string;
}

export interface SupportingEvidenceSource {
  type: 'Resume' | 'Manual Record';
  title: string;
  roleOrContext?: string;
  date?: string;
  detail?: string;
  experienceId?: string;
}

export interface CapabilityRecord {
  id: string;
  name: string;
  confidence: number; // e.g. 98%
  level: number; // Level 1 to 6, strictly calculated by deterministic average rounding
  shortExplanation: string;
  keySupportingEvidence: string[];
  supportingEvidenceSources: SupportingEvidenceSource[];
  underlyingSkills: UnderlyingSkill[];
  relatedExperienceIds: string[];
  source: 'Resume' | 'Manual Record';
  isDemo?: boolean;
  updatedAt: string;
}

// STORAGE KEYS
const STORAGE_KEYS = {
  COMPETENCES: 'career_os_core_competences_v2',
  TOOLS: 'career_os_tools_stacks_v2',
  CAPABILITIES: 'career_os_verified_capabilities_v2',
};

// Known Technology Aliases map for canonical normalization
const TECH_ALIAS_MAP: Record<string, { canonical: string; aliases: string[] }> = {
  'postgres': { canonical: 'PostgreSQL', aliases: ['postgres', 'postgresql', 'psql', 'pg'] },
  'postgresql': { canonical: 'PostgreSQL', aliases: ['postgres', 'postgresql', 'psql', 'pg'] },
  'psql': { canonical: 'PostgreSQL', aliases: ['postgres', 'postgresql', 'psql', 'pg'] },
  'react': { canonical: 'React', aliases: ['react', 'reactjs', 'react.js'] },
  'reactjs': { canonical: 'React', aliases: ['react', 'reactjs', 'react.js'] },
  'node': { canonical: 'Node.js', aliases: ['node', 'nodejs', 'node.js'] },
  'nodejs': { canonical: 'Node.js', aliases: ['node', 'nodejs', 'node.js'] },
  'ts': { canonical: 'TypeScript', aliases: ['ts', 'typescript'] },
  'typescript': { canonical: 'TypeScript', aliases: ['ts', 'typescript'] },
  'js': { canonical: 'JavaScript', aliases: ['js', 'javascript'] },
  'javascript': { canonical: 'JavaScript', aliases: ['js', 'javascript'] },
  'k8s': { canonical: 'Kubernetes', aliases: ['k8s', 'kubernetes'] },
  'kubernetes': { canonical: 'Kubernetes', aliases: ['k8s', 'kubernetes'] },
  'kafka': { canonical: 'Kafka', aliases: ['kafka', 'apache kafka'] },
  'redis': { canonical: 'Redis', aliases: ['redis'] },
  'debezium': { canonical: 'Debezium (CDC)', aliases: ['debezium', 'cdc'] },
  'docker': { canonical: 'Docker', aliases: ['docker', 'containers'] },
  'aws': { canonical: 'AWS', aliases: ['aws', 'amazon web services'] },
  'gcp': { canonical: 'Google Cloud (GCP)', aliases: ['gcp', 'google cloud'] },
  'graphql': { canonical: 'GraphQL', aliases: ['graphql', 'gql'] },
  'grpc': { canonical: 'gRPC', aliases: ['grpc'] },
  'python': { canonical: 'Python', aliases: ['python', 'python3', 'py'] },
  'golang': { canonical: 'Go (Golang)', aliases: ['go', 'golang'] },
  'tailwind': { canonical: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss'] }
};

export class CareerIntelligenceService {
  /**
   * Normalizes technology names to canonical versions and detects aliases.
   */
  public static normalizeTool(inputName: string): { canonicalName: string; aliases: string[] } {
    const cleanKey = inputName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [key, config] of Object.entries(TECH_ALIAS_MAP)) {
      if (cleanKey === key.replace(/[^a-z0-9]/g, '') || config.aliases.some(a => a.replace(/[^a-z0-9]/g, '') === cleanKey)) {
        return {
          canonicalName: config.canonical,
          aliases: config.aliases.filter(a => a.toLowerCase() !== config.canonical.toLowerCase())
        };
      }
    }
    return {
      canonicalName: inputName.trim(),
      aliases: []
    };
  }

  // ==========================================
  // CORE COMPETENCES (CRUD)
  // ==========================================
  public static getCompetences(): CoreCompetenceRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPETENCES);
      if (data) {
        return JSON.parse(data);
      }
      const initial = this.getInitialCompetences();
      localStorage.setItem(STORAGE_KEYS.COMPETENCES, JSON.stringify(initial));
      return initial;
    } catch {
      return this.getInitialCompetences();
    }
  }

  public static saveCompetences(list: CoreCompetenceRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPETENCES, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save competences', e);
    }
    this.recalculateAllIntelligence();
  }

  public static addCompetence(competence: {
    canonicalName: string;
    underlyingSkills?: string[];
    source?: 'Resume' | 'Manual Record';
    evidenceReferences?: string[];
  }): CoreCompetenceRecord {
    const list = this.getCompetences();
    const newRecord: CoreCompetenceRecord = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      canonicalName: competence.canonicalName.trim(),
      category: 'competence',
      underlyingSkills: competence.underlyingSkills || [competence.canonicalName.trim()],
      source: competence.source || 'Manual Record',
      status: 'verified',
      evidenceReferences: competence.evidenceReferences || [],
      isDemo: false,
      updatedAt: new Date().toISOString()
    };
    const updated = [newRecord, ...list];
    this.saveCompetences(updated);
    return newRecord;
  }

  public static updateCompetence(id: string, updates: Partial<CoreCompetenceRecord>): CoreCompetenceRecord | undefined {
    const list = this.getCompetences();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    this.saveCompetences(list);
    return updated;
  }

  public static deleteCompetence(id: string): void {
    const list = this.getCompetences().filter(c => c.id !== id);
    this.saveCompetences(list);
  }

  // ==========================================
  // TOOLS & STACKS (CRUD)
  // ==========================================
  public static getTools(): ToolStackRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TOOLS);
      if (data) {
        return JSON.parse(data);
      }
      const initial = this.getInitialTools();
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(initial));
      return initial;
    } catch {
      return this.getInitialTools();
    }
  }

  public static saveTools(list: ToolStackRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save tools', e);
    }
    this.recalculateAllIntelligence();
  }

  public static addTool(tool: {
    canonicalName: string;
    aliases?: string[];
    source?: 'Resume' | 'Manual Record';
    relatedSkills?: string[];
  }): ToolStackRecord {
    const list = this.getTools();
    const { canonicalName, aliases: detectedAliases } = this.normalizeTool(tool.canonicalName);

    // Check if canonical entry already exists
    const existingIndex = list.findIndex(t => t.canonicalName.toLowerCase() === canonicalName.toLowerCase());
    if (existingIndex >= 0) {
      // Merge aliases
      const existing = list[existingIndex];
      const mergedAliases = Array.from(new Set([...existing.aliases, ...(tool.aliases || []), ...detectedAliases]));
      const updated: ToolStackRecord = {
        ...existing,
        aliases: mergedAliases,
        updatedAt: new Date().toISOString()
      };
      list[existingIndex] = updated;
      this.saveTools(list);
      return updated;
    }

    const newRecord: ToolStackRecord = {
      id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      canonicalName,
      category: 'tool_stack',
      aliases: tool.aliases && tool.aliases.length > 0 ? tool.aliases : detectedAliases,
      source: tool.source || 'Manual Record',
      relatedSkills: tool.relatedSkills || [],
      isDemo: false,
      updatedAt: new Date().toISOString()
    };
    const updated = [newRecord, ...list];
    this.saveTools(updated);
    return newRecord;
  }

  public static updateTool(id: string, updates: Partial<ToolStackRecord>): ToolStackRecord | undefined {
    const list = this.getTools();
    const index = list.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    this.saveTools(list);
    return updated;
  }

  public static deleteTool(id: string): void {
    const list = this.getTools().filter(t => t.id !== id);
    this.saveTools(list);
  }

  // ==========================================
  // CAPABILITY LEDGER (CRUD & RECALCULATION)
  // ==========================================
  public static getCapabilities(): CapabilityRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CAPABILITIES);
      if (data) {
        return JSON.parse(data);
      }
      const initial = this.buildCapabilitiesFromSources(
        WorkExperienceService.getWorkExperiences(),
        this.getCompetences(),
        this.getTools()
      );
      localStorage.setItem(STORAGE_KEYS.CAPABILITIES, JSON.stringify(initial));
      return initial;
    } catch {
      return [];
    }
  }

  public static saveCapabilities(capabilities: CapabilityRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CAPABILITIES, JSON.stringify(capabilities));
    } catch (e) {
      console.warn('Failed to save capabilities', e);
    }
    careerGraphEventBus.emit({ type: 'CAPABILITIES_UPDATED' });
  }

  public static updateCapability(id: string, updates: Partial<CapabilityRecord>): CapabilityRecord | undefined {
    const list = this.getCapabilities();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    const existing = list[index];
    const newUnderlying = updates.underlyingSkills || existing.underlyingSkills;
    
    // Deterministic level calculation if underlying skills changed
    let newLevel = existing.level;
    if (newUnderlying.length > 0) {
      const sum = newUnderlying.reduce((acc, curr) => acc + curr.level, 0);
      newLevel = Math.min(6, Math.max(1, Math.round(sum / newUnderlying.length)));
    }

    const updated: CapabilityRecord = {
      ...existing,
      ...updates,
      underlyingSkills: newUnderlying,
      level: newLevel,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    this.saveCapabilities(list);
    return updated;
  }

  public static updateUnderlyingSkillLevel(capId: string, skillId: string, newLevel: number): CapabilityRecord | undefined {
    const list = this.getCapabilities();
    const capIndex = list.findIndex(c => c.id === capId);
    if (capIndex === -1) return undefined;

    const existing = list[capIndex];
    const updatedSkills = existing.underlyingSkills.map(s => {
      if (s.id === skillId) {
        return { ...s, level: Math.min(6, Math.max(1, newLevel)) };
      }
      return s;
    });

    const sum = updatedSkills.reduce((acc, curr) => acc + curr.level, 0);
    const calculatedLevel = updatedSkills.length > 0 
      ? Math.min(6, Math.max(1, Math.round(sum / updatedSkills.length))) 
      : existing.level;

    const updated: CapabilityRecord = {
      ...existing,
      underlyingSkills: updatedSkills,
      level: calculatedLevel,
      updatedAt: new Date().toISOString()
    };

    list[capIndex] = updated;
    this.saveCapabilities(list);
    return updated;
  }

  public static deleteCapability(id: string): void {
    const list = this.getCapabilities().filter(c => c.id !== id);
    this.saveCapabilities(list);
  }

  /**
   * Recalculate the entire Career Intelligence graph from primary data sources:
   * 1. Resume (Work Experiences & skills)
   * 2. Manual Records (Competences, tools, manual experiences)
   * Deterministic Level 1-6 mapping rule: Math.round(average).
   */
  public static recalculateAllIntelligence(): void {
    const experiences = WorkExperienceService.getWorkExperiences();
    const competences = this.getCompetences();
    const tools = this.getTools();

    const capabilities = this.buildCapabilitiesFromSources(experiences, competences, tools);
    this.saveCapabilities(capabilities);
    careerGraphEventBus.emit({ type: 'GRAPH_RECALCULATED' });
  }

  /**
   * Imports resume extracted competences and tools, clearing demo records if present.
   */
  public static importFromResume(extractedCompetences: string[], extractedTools: string[]): void {
    // 1. Clean out demo competences, preserve manual records
    const currentCompetences = this.getCompetences();
    const preservedCompetences = currentCompetences.filter(c => c.source === 'Manual Record' && !c.isDemo);
    const existingNames = new Set(preservedCompetences.map(c => c.canonicalName.toLowerCase()));

    const newCompetences: CoreCompetenceRecord[] = [...preservedCompetences];
    extractedCompetences.forEach((comp, idx) => {
      if (!existingNames.has(comp.toLowerCase())) {
        newCompetences.push({
          id: `comp-res-${Date.now()}-${idx}`,
          canonicalName: comp.trim(),
          category: 'competence',
          underlyingSkills: [comp.trim()],
          source: 'Resume',
          status: 'verified',
          evidenceReferences: ['Extracted from uploaded resume'],
          isDemo: false,
          updatedAt: new Date().toISOString()
        });
        existingNames.add(comp.toLowerCase());
      }
    });

    // 2. Clean out demo tools, preserve manual records
    const currentTools = this.getTools();
    const preservedTools = currentTools.filter(t => t.source === 'Manual Record' && !t.isDemo);
    const existingToolNames = new Set(preservedTools.map(t => t.canonicalName.toLowerCase()));

    const newTools: ToolStackRecord[] = [...preservedTools];
    extractedTools.forEach((toolStr, idx) => {
      const { canonicalName, aliases } = this.normalizeTool(toolStr);
      if (!existingToolNames.has(canonicalName.toLowerCase())) {
        newTools.push({
          id: `tool-res-${Date.now()}-${idx}`,
          canonicalName,
          category: 'tool_stack',
          aliases,
          source: 'Resume',
          relatedSkills: [],
          isDemo: false,
          updatedAt: new Date().toISOString()
        });
        existingToolNames.add(canonicalName.toLowerCase());
      }
    });

    // Persist and recalculate
    try {
      localStorage.setItem(STORAGE_KEYS.COMPETENCES, JSON.stringify(newCompetences));
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(newTools));
    } catch (e) {
      console.warn('Failed to store imported competences and tools', e);
    }

    this.recalculateAllIntelligence();
  }

  // ==========================================
  // INTERNAL MAPPERS & REASONING ENGINE
  // ==========================================
  private static buildCapabilitiesFromSources(
    experiences: WorkExperienceRecord[],
    competences: CoreCompetenceRecord[],
    tools: ToolStackRecord[]
  ): CapabilityRecord[] {
    // 1. Group skills into primary capability domains
    const domainMap: Record<string, {
      name: string;
      skills: Array<{ name: string; level: number; source: 'Resume' | 'Manual Record' }>;
      evidenceSources: SupportingEvidenceSource[];
      explanations: string[];
      keyEvidence: string[];
    }> = {};

    // Helper to add skill to capability domain
    const addDomainSkill = (
      domainName: string,
      skillName: string,
      level: number,
      source: 'Resume' | 'Manual Record',
      evidenceItem?: SupportingEvidenceSource,
      keyPoint?: string
    ) => {
      if (!domainMap[domainName]) {
        domainMap[domainName] = {
          name: domainName,
          skills: [],
          evidenceSources: [],
          explanations: [],
          keyEvidence: []
        };
      }
      const existingSkill = domainMap[domainName].skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
      if (!existingSkill) {
        domainMap[domainName].skills.push({ name: skillName, level, source });
      } else if (level > existingSkill.level) {
        existingSkill.level = level;
      }

      if (evidenceItem && !domainMap[domainName].evidenceSources.some(e => e.title === evidenceItem.title)) {
        domainMap[domainName].evidenceSources.push(evidenceItem);
      }
      if (keyPoint && !domainMap[domainName].keyEvidence.includes(keyPoint)) {
        domainMap[domainName].keyEvidence.push(keyPoint);
      }
    };

    // Integrate Work Experiences (Resume + Manual)
    experiences.forEach(exp => {
      const expSource: 'Resume' | 'Manual Record' = exp.provenance === 'manual' ? 'Manual Record' : 'Resume';
      const evidenceEntry: SupportingEvidenceSource = {
        type: expSource,
        title: `${exp.company} — ${exp.role}`,
        roleOrContext: exp.role,
        date: exp.dates,
        detail: exp.scope || (exp.responsibilities && exp.responsibilities[0]) || '',
        experienceId: exp.id
      };

      // Add key achievements as evidence
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach(ach => {
          // Attribute to Distributed Systems or Technical Leadership
          if (ach.toLowerCase().includes('downtime') || ach.toLowerCase().includes('database') || ach.toLowerCase().includes('latency')) {
            addDomainSkill('Distributed Systems Architecture', 'High-Throughput Data Infrastructure', 5, expSource, evidenceEntry, ach);
          }
          if (ach.toLowerCase().includes('team') || ach.toLowerCase().includes('review') || ach.toLowerCase().includes('aligned')) {
            addDomainSkill('Stakeholder Management & Alignment', 'Cross-Functional Technical Alignment', 5, expSource, evidenceEntry, ach);
          }
        });
      }

      // Map relevant skills
      (exp.relevantSkills || []).forEach(sk => {
        const lower = sk.toLowerCase();
        if (lower.includes('system') || lower.includes('postgres') || lower.includes('kafka') || lower.includes('migration') || lower.includes('redis')) {
          addDomainSkill('Distributed Systems Architecture', sk, 5, expSource, evidenceEntry);
        } else if (lower.includes('stakeholder') || lower.includes('rfc') || lower.includes('consensus') || lower.includes('conflict')) {
          addDomainSkill('Stakeholder Management & Alignment', sk, 5, expSource, evidenceEntry);
        } else {
          addDomainSkill('Cloud Infrastructure & Production Operations', sk, 4, expSource, evidenceEntry);
        }
      });
    });

    // Integrate Core Competences
    competences.forEach(comp => {
      const compSource = comp.source;
      const compEvidence: SupportingEvidenceSource = {
        type: compSource,
        title: `${compSource} — ${comp.canonicalName}`,
        detail: comp.underlyingSkills.join(', ')
      };

      const lower = comp.canonicalName.toLowerCase();
      let targetDomain = 'Technical Strategy & Architecture';
      if (lower.includes('stakeholder') || lower.includes('conflict') || lower.includes('consensus') || lower.includes('product')) {
        targetDomain = 'Stakeholder Management & Alignment';
      } else if (lower.includes('system') || lower.includes('idempotency') || lower.includes('throughput') || lower.includes('migration')) {
        targetDomain = 'Distributed Systems Architecture';
      } else if (lower.includes('incident') || lower.includes('post-mortem') || lower.includes('chaos')) {
        targetDomain = 'Cloud Infrastructure & Production Operations';
      }

      comp.underlyingSkills.forEach(skill => {
        addDomainSkill(targetDomain, skill, 5, compSource, compEvidence);
      });
    });

    // Integrate Tools & Stacks
    tools.forEach(tool => {
      const toolSource = tool.source;
      const lower = tool.canonicalName.toLowerCase();
      let targetDomain = 'Cloud Infrastructure & Production Operations';
      if (lower.includes('postgres') || lower.includes('kafka') || lower.includes('redis') || lower.includes('debezium')) {
        targetDomain = 'Distributed Systems Architecture';
      }
      addDomainSkill(targetDomain, tool.canonicalName, 4, toolSource);
    });

    // Fallback default capabilities if no data exists
    if (Object.keys(domainMap).length === 0) {
      return this.getInitialCapabilities();
    }

    // Convert domainMap to CapabilityRecords with Level 1-6 calculation
    const capabilities: CapabilityRecord[] = Object.values(domainMap).map((item, idx) => {
      // Deterministic calculation: Math.round(average of underlying skill levels)
      const skillLevels = item.skills.map(s => s.level);
      const avg = skillLevels.length > 0 ? (skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length) : 4;
      const roundedLevel = Math.min(6, Math.max(1, Math.round(avg)));

      // Calculate confidence based on evidence volume
      const evidenceCount = item.evidenceSources.length + item.keyEvidence.length;
      const confidence = Math.min(99, Math.max(82, 85 + evidenceCount * 3));

      return {
        id: `cap-${idx + 1}`,
        name: item.name,
        confidence,
        level: roundedLevel,
        shortExplanation: `Verified across ${item.skills.length} underlying skills with verifiable source provenance in your career records.`,
        keySupportingEvidence: item.keyEvidence.slice(0, 3),
        supportingEvidenceSources: item.evidenceSources.slice(0, 4),
        underlyingSkills: item.skills.map((s, sIdx) => ({
          id: `sk-under-${idx}-${sIdx}`,
          name: s.name,
          level: s.level,
          source: s.source
        })),
        relatedExperienceIds: item.evidenceSources.map(e => e.experienceId).filter(Boolean) as string[],
        source: item.evidenceSources.some(e => e.type === 'Resume') ? 'Resume' : 'Manual Record',
        isDemo: experiences.some(e => e.isDemo),
        updatedAt: new Date().toISOString()
      };
    });

    return capabilities;
  }

  // Initial seed data for clean first experience
  private static getInitialCompetences(): CoreCompetenceRecord[] {
    return [
      {
        id: 'comp-seed-1',
        canonicalName: 'Stakeholder Management & Alignment',
        category: 'competence',
        underlyingSkills: ['Stakeholder Communication', 'Conflict Resolution', 'Cross-functional Alignment', 'RFC Consensus'],
        source: 'Resume',
        status: 'verified',
        evidenceReferences: ['Stripe Platform Project Lead', 'Ramp Architecture Review'],
        isDemo: true,
        updatedAt: '2026-09-01T12:00:00.000Z'
      },
      {
        id: 'comp-seed-2',
        canonicalName: 'Distributed Systems Architecture',
        category: 'competence',
        underlyingSkills: ['High-Throughput Idempotency', 'Zero-Downtime Migration', 'Event-Driven Consistency', 'Replication Topologies'],
        source: 'Resume',
        status: 'verified',
        evidenceReferences: ['12M customer records PostgreSQL migration', 'Redis atomic locks'],
        isDemo: true,
        updatedAt: '2026-09-01T12:00:00.000Z'
      },
      {
        id: 'comp-seed-3',
        canonicalName: 'Technical Debt & Cost of Delay',
        category: 'competence',
        underlyingSkills: ['Cost of Delay Quantification', 'Sprint Capacity Negotiation', 'Refactoring Trade-Offs'],
        source: 'Manual Record',
        status: 'verified',
        evidenceReferences: ['20% engineering sprint allocation consensus'],
        isDemo: true,
        updatedAt: '2026-08-25T12:00:00.000Z'
      }
    ];
  }

  private static getInitialTools(): ToolStackRecord[] {
    return [
      {
        id: 'tool-seed-1',
        canonicalName: 'PostgreSQL',
        category: 'tool_stack',
        aliases: ['postgres', 'psql'],
        source: 'Resume',
        relatedSkills: ['Query Optimization', 'Serializable Isolation'],
        isDemo: true,
        updatedAt: '2026-09-01T12:00:00.000Z'
      },
      {
        id: 'tool-seed-2',
        canonicalName: 'Kafka',
        category: 'tool_stack',
        aliases: ['apache kafka'],
        source: 'Resume',
        relatedSkills: ['Event Streaming', 'Change Data Capture'],
        isDemo: true,
        updatedAt: '2026-09-01T12:00:00.000Z'
      },
      {
        id: 'tool-seed-3',
        canonicalName: 'Redis',
        category: 'tool_stack',
        aliases: [],
        source: 'Resume',
        relatedSkills: ['Atomic Locks', 'SET NX EX', 'Distributed Caching'],
        isDemo: true,
        updatedAt: '2026-09-01T12:00:00.000Z'
      },
      {
        id: 'tool-seed-4',
        canonicalName: 'TypeScript',
        category: 'tool_stack',
        aliases: ['ts'],
        source: 'Resume',
        relatedSkills: ['Node.js', 'Type Safety', 'High-Scale Services'],
        isDemo: true,
        updatedAt: '2026-09-01T12:00:00.000Z'
      }
    ];
  }

  private static getInitialCapabilities(): CapabilityRecord[] {
    return [
      {
        id: 'cap-seed-1',
        name: 'Stakeholder Management & Alignment',
        confidence: 98,
        level: 5,
        shortExplanation: 'Demonstrated consensus building across multi-tenant engineering leaders and executive stakeholders.',
        keySupportingEvidence: [
          'Led RFC review cycle and aligned 3 enterprise tenant leadership teams on migration safety.',
          'Negotiated 20% sprint refactoring capacity using Cost of Delay metrics.',
          'Resolved heated architecture conflict via empirical benchmarking.'
        ],
        supportingEvidenceSources: [
          { type: 'Resume', title: 'Stripe — Lead Platform Engineer & Project Owner', roleOrContext: 'Platform Project Owner', date: '2023 — Present' },
          { type: 'Resume', title: 'Ramp — Senior Backend Engineer / Tech Lead', roleOrContext: 'Senior Backend Engineer', date: '2021 — 2023' },
          { type: 'Manual Record', title: 'Product Operations Case — Architecture RFC Consensus' }
        ],
        underlyingSkills: [
          { id: 'sk-seed-1', name: 'Stakeholder Communication', level: 5, category: 'competence', source: 'Resume' },
          { id: 'sk-seed-2', name: 'Conflict Resolution', level: 5, category: 'competence', source: 'Resume' },
          { id: 'sk-seed-3', name: 'Cross-functional Alignment', level: 5, category: 'competence', source: 'Resume' },
          { id: 'sk-seed-4', name: 'RFC Consensus & Tech Debt Trade-offs', level: 5, category: 'competence', source: 'Manual Record' }
        ],
        relatedExperienceIds: ['exp-stripe-1', 'exp-ramp-2'],
        source: 'Resume',
        isDemo: true,
        updatedAt: '2026-09-01T12:00:00.000Z'
      },
      {
        id: 'cap-seed-2',
        name: 'Distributed Systems Architecture',
        confidence: 97,
        level: 5,
        shortExplanation: 'Hands-on architectural delivery of mission-critical zero-downtime transactional systems.',
        keySupportingEvidence: [
          'Architected zero-downtime dual-run data pipeline migrating 12M customer records to PostgreSQL.',
          'Cut over mission-critical database with 0 seconds unplanned downtime.',
          'Enforced client-side idempotency keys with atomic Redis locks.'
        ],
        supportingEvidenceSources: [
          { type: 'Resume', title: 'Stripe — Lead Platform Engineer', date: '2023 — Present' },
          { type: 'Resume', title: 'Ramp — Tech Lead', date: '2021 — 2023' }
        ],
        underlyingSkills: [
          { id: 'sk-seed-5', name: 'Zero-Downtime Migration', level: 6, category: 'competence', source: 'Resume' },
          { id: 'sk-seed-6', name: 'High-Throughput Idempotency', level: 5, category: 'competence', source: 'Resume' },
          { id: 'sk-seed-7', name: 'PostgreSQL Query Optimization', level: 5, category: 'tool_stack', source: 'Resume' },
          { id: 'sk-seed-8', name: 'Kafka Change Data Capture', level: 4, category: 'tool_stack', source: 'Resume' }
        ],
        relatedExperienceIds: ['exp-stripe-1', 'exp-ramp-2'],
        source: 'Resume',
        isDemo: true,
        updatedAt: '2026-09-01T12:00:00.000Z'
      }
    ];
  }
}
