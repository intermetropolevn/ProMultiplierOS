import { 
  BuildOpportunity, 
  BuilderProfile, 
  BuildTeam, 
  MyBuildItem, 
  CareerEvidence,
  BuildIntent,
  BuildOpportunityType
} from '../types/builderMatch';
import { 
  INITIAL_BUILD_OPPORTUNITIES, 
  INITIAL_BUILDERS, 
  INITIAL_TEAMS, 
  INITIAL_MY_BUILDS 
} from '../data/builderMatchData';

const STORAGE_KEYS = {
  OPPORTUNITIES: 'career_os_builder_match_opportunities_v1',
  BUILDERS: 'career_os_builder_match_builders_v1',
  TEAMS: 'career_os_builder_match_teams_v1',
  MY_BUILDS: 'career_os_builder_match_my_builds_v1',
  SAVED_BUILDS: 'career_os_builder_match_saved_builds_v1',
  SAVED_BUILDERS: 'career_os_builder_match_saved_builders_v1',
  CAREER_EVIDENCE: 'career_os_builder_match_evidence_v1'
};

export const BuilderMatchService = {
  // Broadcast update
  notify() {
    window.dispatchEvent(new CustomEvent('builder_match_updated'));
  },

  notifyEvidence() {
    window.dispatchEvent(new CustomEvent('career_evidence_updated'));
  },

  // 1. OPPORTUNITIES
  getAllBuildOpportunities(): BuildOpportunity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      const savedIds = this.getSavedBuildIds();
      let list: BuildOpportunity[] = stored ? JSON.parse(stored) : INITIAL_BUILD_OPPORTUNITIES;
      return list.map(item => ({
        ...item,
        isSaved: savedIds.includes(item.id)
      }));
    } catch (e) {
      console.error('Failed to get build opportunities', e);
      return INITIAL_BUILD_OPPORTUNITIES;
    }
  },

  getBuildById(id: string): BuildOpportunity | undefined {
    return this.getAllBuildOpportunities().find(o => o.id === id);
  },

  saveBuildOpportunity(opportunity: BuildOpportunity): BuildOpportunity {
    const list = this.getAllBuildOpportunities();
    const index = list.findIndex(o => o.id === opportunity.id);
    if (index >= 0) {
      list[index] = opportunity;
    } else {
      list.unshift(opportunity);
    }
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(list));
    this.notify();
    return opportunity;
  },

  toggleSaveBuild(id: string): boolean {
    const saved = this.getSavedBuildIds();
    let isNowSaved = false;
    if (saved.includes(id)) {
      const filtered = saved.filter(i => i !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_BUILDS, JSON.stringify(filtered));
      isNowSaved = false;
    } else {
      saved.push(id);
      localStorage.setItem(STORAGE_KEYS.SAVED_BUILDS, JSON.stringify(saved));
      isNowSaved = true;
    }
    this.notify();
    return isNowSaved;
  },

  getSavedBuildIds(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_BUILDS);
      return stored ? JSON.parse(stored) : ['build-saas-activation', 'build-cobuilder-knowledge-graph'];
    } catch {
      return ['build-saas-activation'];
    }
  },

  // 2. BUILDERS
  getAllBuilders(): BuilderProfile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUILDERS);
      const savedIds = this.getSavedBuilderIds();
      let list: BuilderProfile[] = stored ? JSON.parse(stored) : INITIAL_BUILDERS;
      return list.map(b => ({
        ...b,
        isSaved: savedIds.includes(b.id)
      }));
    } catch {
      return INITIAL_BUILDERS;
    }
  },

  getBuilderById(id: string): BuilderProfile | undefined {
    return this.getAllBuilders().find(b => b.id === id);
  },

  toggleSaveBuilder(id: string): boolean {
    const saved = this.getSavedBuilderIds();
    let isNowSaved = false;
    if (saved.includes(id)) {
      const filtered = saved.filter(i => i !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_BUILDERS, JSON.stringify(filtered));
      isNowSaved = false;
    } else {
      saved.push(id);
      localStorage.setItem(STORAGE_KEYS.SAVED_BUILDERS, JSON.stringify(saved));
      isNowSaved = true;
    }
    this.notify();
    return isNowSaved;
  },

  getSavedBuilderIds(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_BUILDERS);
      return stored ? JSON.parse(stored) : ['builder-liza', 'builder-marcus'];
    } catch {
      return ['builder-liza'];
    }
  },

  // 3. TEAMS
  getAllTeams(): BuildTeam[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEAMS);
      return stored ? JSON.parse(stored) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  },

  createTeam(teamData: Omit<BuildTeam, 'id' | 'createdAt'>): BuildTeam {
    const teams = this.getAllTeams();
    const newTeam: BuildTeam = {
      ...teamData,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    teams.unshift(newTeam);
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    this.notify();
    return newTeam;
  },

  // 4. MY BUILDS
  getMyBuilds(): MyBuildItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MY_BUILDS);
      return stored ? JSON.parse(stored) : INITIAL_MY_BUILDS;
    } catch {
      return INITIAL_MY_BUILDS;
    }
  },

  saveMyBuilds(items: MyBuildItem[]) {
    localStorage.setItem(STORAGE_KEYS.MY_BUILDS, JSON.stringify(items));
    this.notify();
  },

  joinBuild(opportunity: BuildOpportunity, role: string): MyBuildItem {
    const myBuilds = this.getMyBuilds();
    const existing = myBuilds.find(b => b.opportunityId === opportunity.id);
    if (existing) {
      existing.role = role;
      this.saveMyBuilds(myBuilds);
      return existing;
    }

    const newItem: MyBuildItem = {
      id: `my-build-${Date.now()}`,
      opportunityId: opportunity.id,
      title: opportunity.title,
      type: opportunity.type,
      status: opportunity.isExperiment ? 'experiment' : 'active',
      role: role || 'Builder Collaborator',
      team: ['You (Alex Chen)', opportunity.creator.name],
      nextMilestone: 'Sprint Kickoff & Setup Alignment',
      deadline: opportunity.deadline || 'In 3 weeks',
      contribution: 'Joined as ' + role,
      skills: opportunity.idealBuilderProfile.capabilities.slice(0, 3),
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isExperiment: opportunity.isExperiment,
      hasCareerEvidence: false
    };

    myBuilds.unshift(newItem);
    this.saveMyBuilds(myBuilds);
    return newItem;
  },

  // 5. CAREER EVIDENCE CONVERSION (Requirement 13)
  convertBuildToEvidence(buildId: string, evidenceData: Omit<CareerEvidence, 'id' | 'verifiedAt' | 'readinessBoost'>): CareerEvidence {
    const myBuilds = this.getMyBuilds();
    const build = myBuilds.find(b => b.id === buildId);

    const evidence: CareerEvidence = {
      ...evidenceData,
      id: `ce-${Date.now()}`,
      verifiedAt: new Date().toISOString().split('T')[0],
      readinessBoost: 8 // +8% Career Readiness
    };

    if (build) {
      build.status = 'completed';
      build.hasCareerEvidence = true;
      build.careerEvidence = evidence;
      this.saveMyBuilds(myBuilds);
    }

    // Save to global career evidence list
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CAREER_EVIDENCE);
      const list: CareerEvidence[] = stored ? JSON.parse(stored) : [];
      list.unshift(evidence);
      localStorage.setItem(STORAGE_KEYS.CAREER_EVIDENCE, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save career evidence', e);
    }

    this.notifyEvidence();
    this.notify();
    return evidence;
  },

  getAllCareerEvidence(): CareerEvidence[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CAREER_EVIDENCE);
      if (stored) return JSON.parse(stored);
      // Fallback: extract evidence from initial builds
      const initial = INITIAL_MY_BUILDS.filter(b => b.careerEvidence).map(b => b.careerEvidence!);
      return initial;
    } catch {
      return [];
    }
  },

  // 6. AI STRUCTURING ASSISTANT (Requirement 10 & 17)
  // Converts rough / incomplete user ideas into structured Build Opportunities
  aiStructureBuild(rawText: string, intent: BuildIntent = 'solve_challenge'): Partial<BuildOpportunity> {
    const lower = rawText.toLowerCase();

    // Determine type
    let type: BuildOpportunityType = 'product_challenge';
    if (lower.includes('experiment') || lower.includes('test') || lower.includes('validate')) {
      type = 'ai_experiment';
    } else if (lower.includes('hackathon') || lower.includes('bounty')) {
      type = 'hackathon';
    } else if (lower.includes('cfo') || lower.includes('saas') || lower.includes('churn') || lower.includes('activation')) {
      type = 'business_challenge';
    } else if (lower.includes('social') || lower.includes('climate') || lower.includes('disaster') || lower.includes('medical')) {
      type = 'social_impact';
    } else if (lower.includes('cobuilder') || lower.includes('co-founder') || lower.includes('looking for')) {
      type = 'product_idea';
    }

    // Determine domain
    let domain = 'AI & Machine Learning';
    if (lower.includes('saas') || lower.includes('b2b')) domain = 'Enterprise SaaS';
    else if (lower.includes('cfo') || lower.includes('finance') || lower.includes('stripe')) domain = 'Fintech & Payments';
    else if (lower.includes('canvas') || lower.includes('crdt') || lower.includes('markdown')) domain = 'Developer Tools';
    else if (lower.includes('disaster') || lower.includes('relief') || lower.includes('health')) domain = 'Healthcare & Impact';

    const title = rawText.length > 50 ? rawText.slice(0, 50).trim() + '...' : rawText;

    return {
      title: title || 'Experimental Innovation Build',
      intent,
      type,
      domain,
      duration: '2–3 weeks',
      teamSizeNeeded: 'Team of 2–3 builders',
      difficulty: 'Intermediate',
      workMode: 'Remote',
      matchScore: 92,
      shortDescription: `A collaborative builder initiative to explore, prototype, and validate: "${rawText}".`,
      challenge: {
        context: `Modern builders need rapid, iterative problem discovery. This build tackles the practical friction highlighted in: "${rawText}".`,
        currentSituation: 'Current solutions are fragmented, manual, or lack intuitive collaborative user interfaces.',
        problem: 'Users spend excessive cognitive energy bridging disconnected tools without unified workflow automation.',
        whyItMatters: 'Creating a working prototype demonstrates tangible validation and generates valuable, verifiable portfolio evidence.',
        whatHasBeenTried: 'Off-the-shelf generic tools require cumbersome manual configuration.',
        constraints: [
          'Must be functional as a lightweight interactive prototype',
          'Clean, accessible design adhering to zero-pill UI guidelines',
          'Sub-second response latency for key user interactions'
        ]
      },
      expectedOutcomes: [
        'Formulate solution architecture and user journey diagram',
        'Build interactive MVP prototype in React / TypeScript',
        'Conduct usability sessions with 3–5 representative target builders',
        'Document outcomes and convert results into verified Career Evidence'
      ],
      availableResources: [
        { name: 'Core Design Tokens', type: 'design_system', detail: 'Pre-configured typography, colors, and layout components' },
        { name: 'Mock API Staging Sandbox', type: 'api', detail: 'Simulated backend endpoints and JSON schema generator' },
        { name: 'Community Feedback Channel', type: 'sme', detail: 'Direct access to experienced peer builders for weekly design review' }
      ],
      idealBuilderProfile: {
        capabilities: ['Product Strategy', 'UI/UX Prototyping', 'Frontend Systems', 'Rapid Experimentation'],
        suggestedRoles: ['Product Lead', 'Product Designer', 'AI / Fullstack Engineer'],
        experienceLevel: 'Intermediate to Senior'
      },
      recommendedKnowledge: [
        {
          id: 'kn-ai-struct',
          title: '0-to-1 Product Prototyping & Rapid Validation',
          category: 'Framework',
          duration: '15 min read',
          tag: 'Product Strategy',
          relevanceReason: 'Best-practice guide to validate assumptions before writing production code.'
        }
      ],
      tags: ['Innovation', 'Prototype', 'Experiment', 'Collaborative Build', domain]
    };
  },

  // 7. AI TEAM COMPOSITION HELPER (Requirement 9)
  aiRecommendTeam(purpose: string, requiredRoles: string[]): {
    fitScore: number;
    roleBreakdown: { role: string; matchPercent: number }[];
    strengths: string[];
    gaps: string[];
    recommendedMembers: BuilderProfile[];
  } {
    const allBuilders = this.getAllBuilders();
    const roleBreakdown = [
      { role: 'Product Lead', matchPercent: 94 },
      { role: 'AI / Systems Engineer', matchPercent: 91 },
      { role: 'Product Designer', matchPercent: 88 },
      { role: 'Growth Strategist', matchPercent: 82 }
    ];

    const strengths = [
      'Exceptional product strategy & rapid prototyping coverage',
      'Strong distributed systems and LLM tool-calling experience',
      'Complementary cross-functional capabilities with verified portfolio evidence'
    ];

    const gaps = [
      'Enterprise security & SOC2 compliance (advisory recommended)',
      'High-throughput database index optimization'
    ];

    return {
      fitScore: 89,
      roleBreakdown,
      strengths,
      gaps,
      recommendedMembers: allBuilders.slice(0, 3)
    };
  }
};
