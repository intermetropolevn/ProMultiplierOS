import { 
  EvidenceItem, 
  WorkInitiative, 
  CapabilityDefinition, 
  EvidenceSourceConnector, 
  EvidenceGraphData,
  RoleReadinessEvidenceCheck,
  OutcomeMetric,
  ArtifactItem,
  ContributionType,
  EvidenceStatus
} from '../types';
import { 
  SEED_WORK_INITIATIVES, 
  SEED_INBOX_ITEMS, 
  SEED_TIMELINE_EVIDENCE, 
  SEED_CAPABILITY_DEFINITIONS_CATALOG, 
  SEED_SOURCE_CONNECTORS, 
  SEED_EVIDENCE_GRAPH_DATA, 
  SEED_ROLE_READINESS_CHECK 
} from '../data/evidenceIntelligenceData';

class EvidenceIntelligenceStore {
  private initiatives: WorkInitiative[] = [];
  private inbox: EvidenceItem[] = [];
  private timelineEvidence: EvidenceItem[] = [];
  private capabilities: CapabilityDefinition[] = [];
  private connectors: EvidenceSourceConnector[] = [];
  private graphData: EvidenceGraphData = { nodes: [], links: [] };
  private roleReadiness: RoleReadinessEvidenceCheck = { ...SEED_ROLE_READINESS_CHECK };
  private listeners: (() => void)[] = [];

  constructor() {
    this.initiatives = [...SEED_WORK_INITIATIVES];
    this.inbox = [...SEED_INBOX_ITEMS];
    this.timelineEvidence = [...SEED_TIMELINE_EVIDENCE];
    this.capabilities = [...SEED_CAPABILITY_DEFINITIONS_CATALOG];
    this.connectors = [...SEED_SOURCE_CONNECTORS];
    this.graphData = {
      nodes: [...SEED_EVIDENCE_GRAPH_DATA.nodes],
      links: [...SEED_EVIDENCE_GRAPH_DATA.links]
    };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  // --- Initiatives ---
  getInitiatives(): WorkInitiative[] {
    return this.initiatives;
  }

  getInitiativeById(id: string): WorkInitiative | undefined {
    return this.initiatives.find(i => i.id === id);
  }

  addInitiative(newInit: WorkInitiative): void {
    this.initiatives.unshift(newInit);
    this.notify();
  }

  // --- Inbox Operations ---
  getInboxItems(): EvidenceItem[] {
    return this.inbox.filter(item => item.validationStatus === 'Suggested' || item.validationStatus === 'Detected');
  }

  getConfirmedEvidenceCount(): number {
    return this.timelineEvidence.length;
  }

  confirmEvidence(id: string, updates?: Partial<EvidenceItem>): EvidenceItem | undefined {
    const itemIndex = this.inbox.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      // Check if already in timeline
      const existing = this.timelineEvidence.find(e => e.id === id);
      if (existing) {
        existing.validationStatus = 'Confirmed';
        if (updates) Object.assign(existing, updates);
        this.notify();
        return existing;
      }
      return undefined;
    }

    const item = { ...this.inbox[itemIndex] };
    this.inbox.splice(itemIndex, 1);

    item.validationStatus = 'Confirmed';
    if (updates) {
      Object.assign(item, updates);
    }

    // Add to timeline evidence
    this.timelineEvidence.unshift(item);

    // Update capability verified count
    item.capabilities.forEach(capId => {
      const cap = this.capabilities.find(c => c.id === capId);
      if (cap) {
        cap.verifiedEvidenceCount += 1;
        if (!cap.recentEvidenceTitles.includes(item.title)) {
          cap.recentEvidenceTitles.unshift(item.title);
        }
      }
    });

    this.notify();
    return item;
  }

  rejectEvidence(id: string): void {
    this.inbox = this.inbox.filter(item => item.id !== id);
    this.timelineEvidence = this.timelineEvidence.filter(item => item.id !== id);
    this.notify();
  }

  updateEvidence(id: string, updates: Partial<EvidenceItem>): EvidenceItem | undefined {
    let target = this.inbox.find(i => i.id === id);
    if (!target) {
      target = this.timelineEvidence.find(e => e.id === id);
    }
    if (target) {
      Object.assign(target, updates);
      this.notify();
    }
    return target;
  }

  mergeEvidence(sourceId: string, targetId: string): void {
    const source = this.inbox.find(i => i.id === sourceId) || this.timelineEvidence.find(e => e.id === sourceId);
    const target = this.inbox.find(i => i.id === targetId) || this.timelineEvidence.find(e => e.id === targetId);

    if (source && target) {
      // Combine capabilities and skills
      target.capabilities = Array.from(new Set([...target.capabilities, ...source.capabilities]));
      target.capabilityLabels = Array.from(new Set([...target.capabilityLabels, ...source.capabilityLabels]));
      target.skills = Array.from(new Set([...target.skills, ...source.skills]));
      target.outcomes = [...target.outcomes, ...source.outcomes];
      target.supportingArtifacts = [...target.supportingArtifacts, ...source.supportingArtifacts];
      target.description += `\n[Merged signal]: ${source.description}`;

      // Remove source
      this.rejectEvidence(sourceId);
    }
  }

  addOutcomeToEvidence(evidenceId: string, outcome: OutcomeMetric): void {
    const item = this.inbox.find(i => i.id === evidenceId) || this.timelineEvidence.find(e => e.id === evidenceId);
    if (item) {
      item.outcomes.push(outcome);
      item.qualitySignals.hasMeasuredMetric = true;
      item.evidenceConfidence = Math.min(98, item.evidenceConfidence + 6);
      this.notify();
    }
  }

  // --- Timeline & Search ---
  getAllEvidence(): EvidenceItem[] {
    return this.timelineEvidence;
  }

  getEvidenceById(id: string): EvidenceItem | undefined {
    return this.timelineEvidence.find(e => e.id === id) || this.inbox.find(i => i.id === id);
  }

  addManualEvidence(evidence: EvidenceItem): void {
    this.timelineEvidence.unshift(evidence);
    // Link to initiative if matches
    const init = this.initiatives.find(i => i.id === evidence.linkedInitiativeId);
    if (init && !init.evidenceGeneratedIds.includes(evidence.id)) {
      init.evidenceGeneratedIds.push(evidence.id);
    }
    this.notify();
  }

  // --- Capabilities ---
  getCapabilities(): CapabilityDefinition[] {
    return this.capabilities;
  }

  getCapabilityById(id: string): CapabilityDefinition | undefined {
    return this.capabilities.find(c => c.id === id);
  }

  // --- Connectors & Settings ---
  getConnectors(): EvidenceSourceConnector[] {
    return this.connectors;
  }

  toggleConnector(id: string): void {
    const conn = this.connectors.find(c => c.id === id);
    if (conn) {
      conn.status = conn.status === 'Connected' ? 'Paused' : 'Connected';
      this.notify();
    }
  }

  updatePrivacyScope(id: string, scopeText: string): void {
    const conn = this.connectors.find(c => c.id === id);
    if (conn) {
      conn.privacyScope = scopeText;
      this.notify();
    }
  }

  toggleSourceExclusion(id: string): void {
    const conn = this.connectors.find(c => c.id === id);
    if (conn) {
      conn.isExcluded = !conn.isExcluded;
      this.notify();
    }
  }

  // --- Graph ---
  getGraphData(): EvidenceGraphData {
    return this.graphData;
  }

  // --- Role Readiness ---
  getRoleReadiness(): RoleReadinessEvidenceCheck {
    return this.roleReadiness;
  }

  // --- Simulated AI Quick Capture Extraction ---
  quickExtractFromText(rawText: string): {
    suggestedTitle: string;
    suggestedInitiative: string;
    detectedCapabilities: { id: string; name: string }[];
    suggestedContribution: ContributionType;
    confidenceScore: number;
    recommendedOutcomeQuestion: string;
  } {
    const textLower = rawText.toLowerCase();

    // Determine title / initiative
    let suggestedTitle = 'Work Activity Demonstration';
    let suggestedInitiative = 'General Product Execution';
    let contribution: ContributionType = 'Lead';
    let confidence = 75;

    if (textLower.includes('onboard') || textLower.includes('signup') || textLower.includes('activation')) {
      suggestedTitle = 'User Onboarding & Activation Experience';
      suggestedInitiative = 'Self-Serve Onboarding Revamp & Activation Loop';
      confidence = 88;
    } else if (textLower.includes('data') || textLower.includes('schema') || textLower.includes('api') || textLower.includes('contract')) {
      suggestedTitle = 'Data Contracts & Architectural Governance';
      suggestedInitiative = 'Enterprise Data Contracts & Event Schema Registry';
      confidence = 90;
    } else if (textLower.includes('pricing') || textLower.includes('monetiz') || textLower.includes('arr') || textLower.includes('revenue')) {
      suggestedTitle = 'Pricing Model Restructuring & Expansion';
      suggestedInitiative = 'Automated Pricing Tier & Expansion Monetization';
      confidence = 86;
    } else if (textLower.includes('incident') || textLower.includes('post-mortem') || textLower.includes('sop') || textLower.includes('process')) {
      suggestedTitle = 'Cross-Functional Operational Process Optimization';
      suggestedInitiative = 'Operational Excellence & Post-Mortem Cadence';
      confidence = 82;
    }

    if (textLower.includes('i led') || textLower.includes('spearheaded') || textLower.includes('owned')) {
      contribution = 'Owner';
    } else if (textLower.includes('partnered') || textLower.includes('collaborated')) {
      contribution = 'Collaborator';
    } else if (textLower.includes('reviewed')) {
      contribution = 'Reviewer';
    }

    // Detect capabilities
    const detectedCaps: { id: string; name: string }[] = [];
    if (textLower.includes('strategy') || textLower.includes('roadmap') || textLower.includes('vision') || textLower.includes('prd')) {
      detectedCaps.push({ id: 'cap-product-strategy', name: 'Product Strategy' });
    }
    if (textLower.includes('experiment') || textLower.includes('a/b') || textLower.includes('variant')) {
      detectedCaps.push({ id: 'cap-experimentation', name: 'Experimentation' });
    }
    if (textLower.includes('design') || textLower.includes('engineer') || textLower.includes('cross-functional') || textLower.includes('stakeholder')) {
      detectedCaps.push({ id: 'cap-stakeholder-mgmt', name: 'Stakeholder Management' });
    }
    if (textLower.includes('tech') || textLower.includes('api') || textLower.includes('architecture') || textLower.includes('schema')) {
      detectedCaps.push({ id: 'cap-technical-understanding', name: 'Technical Understanding' });
    }
    if (textLower.includes('pricing') || textLower.includes('revenue') || textLower.includes('business')) {
      detectedCaps.push({ id: 'cap-monetization', name: 'Monetization' });
    }
    if (detectedCaps.length === 0) {
      detectedCaps.push({ id: 'cap-product-strategy', name: 'Product Strategy' });
      detectedCaps.push({ id: 'cap-stakeholder-mgmt', name: 'Stakeholder Management' });
    }

    return {
      suggestedTitle,
      suggestedInitiative,
      detectedCapabilities: detectedCaps,
      suggestedContribution: contribution,
      confidenceScore: confidence,
      recommendedOutcomeQuestion: 'Did this initiative deliver a quantitative metric (e.g., +30% conversion, -$200k infra cost, 14-day cycle time reduction)?'
    };
  }
}

export const evidenceIntelligenceStore = new EvidenceIntelligenceStore();
