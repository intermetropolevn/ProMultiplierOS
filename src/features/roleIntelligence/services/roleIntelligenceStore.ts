import { 
  RoleIntelligenceItem, 
  FrameworkMetadata, 
  RoleReadinessAnalysis,
  CareerOSDimensionKey,
  CareerOSProficiency,
  ReadinessGapItem,
  RoleGraphData
} from '../types';
import { 
  ROLES_INTELLIGENCE_DATA, 
  FRAMEWORK_METADATA_LIST, 
  ROLE_GRAPH_DATA 
} from '../data/rolesIntelligenceData';
import { UserCareerProfile } from '../../../types';
import { AccessControlService } from '../../../services/accessControlService';

class RoleIntelligenceStore {
  private roles: RoleIntelligenceItem[] = [];
  private frameworks: FrameworkMetadata[] = [];

  constructor() {
    this.roles = [...ROLES_INTELLIGENCE_DATA];
    this.frameworks = [...FRAMEWORK_METADATA_LIST];
  }

  getRoles(): RoleIntelligenceItem[] {
    const level = AccessControlService.getAccessLevel();
    if (level === 'PUBLIC') return this.roles.slice(0, 1);
    if (level === 'GUEST') return this.roles.slice(0, 3);
    if (level === 'DEMO') return this.roles.slice(0, 5);
    return this.roles;
  }

  getRoleById(id: string): RoleIntelligenceItem | undefined {
    const visible = this.getRoles();
    return visible.find(r => r.id === id) || visible[0];
  }

  getFrameworks(): FrameworkMetadata[] {
    return this.frameworks;
  }

  getFrameworkById(id: string): FrameworkMetadata | undefined {
    return this.frameworks.find(f => f.id === id);
  }

  updateDimensionScore(
    roleId: string, 
    dimensionKey: CareerOSDimensionKey, 
    newScore: number
  ): RoleIntelligenceItem | undefined {
    const role = this.getRoleById(roleId);
    if (!role) return undefined;

    const dim = role.careerosDimensions.find(d => d.key === dimensionKey);
    if (dim) {
      dim.score = Math.max(1, Math.min(5, newScore));
      dim.proficiency = this.scoreToProficiency(dim.score);
    }

    return role;
  }

  private scoreToProficiency(score: number): CareerOSProficiency {
    switch (score) {
      case 1: return 'foundational';
      case 2: return 'working';
      case 3: return 'advanced';
      case 4: return 'senior';
      case 5: return 'strategic';
      default: return 'advanced';
    }
  }

  // Generates complete 7-dimension and 4-way gap readiness analysis
  generateReadinessAnalysis(
    targetRoleId: string, 
    userProfile?: UserCareerProfile
  ): RoleReadinessAnalysis {
    const role = this.getRoleById(targetRoleId) || this.roles[0];
    
    // Evaluate user skills vs role required skills
    const profileSkills: string[] | undefined = (userProfile as any)?.skills;
    const userSkills = profileSkills?.map(s => s.toLowerCase()) || [
      'product strategy', 'analytics', 'stakeholder management', 'sql', 'agile', 'wireframing'
    ];

    const strongSkills: string[] = [];
    const developSkills: string[] = [];
    const missingSkills: string[] = [];

    role.keySkills.forEach(reqSkill => {
      const isPresent = userSkills.some(us => reqSkill.toLowerCase().includes(us) || us.includes(reqSkill.toLowerCase()));
      if (isPresent) {
        strongSkills.push(reqSkill);
      } else if (reqSkill.toLowerCase().includes('telemetry') || reqSkill.toLowerCase().includes('economics')) {
        developSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const skillCoverage = Math.min(95, Math.max(55, Math.round((strongSkills.length / Math.max(1, role.keySkills.length)) * 100)));
    const experienceCoverage = 80;
    const scopeCoverage = 75;
    const decisionCoverage = 78;
    const domainCoverage = 85;
    const evidenceCoverage = 72;

    const overallFit = Math.round(
      skillCoverage * 0.25 + 
      experienceCoverage * 0.20 + 
      scopeCoverage * 0.15 + 
      decisionCoverage * 0.15 + 
      domainCoverage * 0.15 + 
      evidenceCoverage * 0.10
    );

    // 4-Way Gap Categorization: Skill vs Experience vs Evidence vs Exposure
    const skillGaps: ReadinessGapItem[] = [
      {
        id: 'gap-sk-1',
        category: 'skill',
        name: 'Algorithmic RAG & Vector Telemetry',
        status: 'develop',
        currentSignal: 'Working knowledge of API endpoints and prompt engineering',
        targetRequirement: 'Advanced benchmarking of vector retrieval precision and contextual recall',
        remediationPath: 'Complete Stanford Agentic AI Masterclass lab assignments'
      },
      {
        id: 'gap-sk-2',
        category: 'skill',
        name: 'Unit Economics & FinOps Modeling',
        status: 'develop',
        currentSignal: 'Familiarity with gross margin calculation and basic CAC',
        targetRequirement: 'Multi-tiered cohort net revenue retention (NRR) and compute cost modeling',
        remediationPath: 'Execute Reforge SaaS cohort retention spreadsheets project'
      }
    ];

    const experienceGaps: ReadinessGapItem[] = [
      {
        id: 'gap-exp-1',
        category: 'experience',
        name: 'End-to-End Enterprise GTM Launch',
        status: 'gap',
        currentSignal: 'Shipped internal tooling and mid-market consumer features',
        targetRequirement: 'Led GTM rollout for $500k+ ARR enterprise-tier contract with legal and sales enablement',
        remediationPath: 'Partner with Enterprise Sales lead to co-pilot upcoming enterprise security feature launch'
      }
    ];

    const evidenceGaps: ReadinessGapItem[] = [
      {
        id: 'gap-evi-1',
        category: 'evidence',
        name: 'Verified Technical RFC / Architecture Spec',
        status: 'develop',
        currentSignal: 'Informal Notion sprint specs and Jira acceptance criteria',
        targetRequirement: 'Published, peer-reviewed engineering RFC for public API contract or stateful agent workflow',
        remediationPath: 'Attach ratified system architecture RFC to Participation Tracker as formal Evidence artifact'
      },
      {
        id: 'gap-evi-2',
        category: 'evidence',
        name: 'Public Presentation / Industry Thought Leadership',
        status: 'gap',
        currentSignal: 'Internal demo day recordings',
        targetRequirement: 'Conference panel, technical podcast, or published technical teardown',
        remediationPath: 'Submit lighting talk proposal to upcoming ProductCon or SEA Tech Mixer'
      }
    ];

    const exposureGaps: ReadinessGapItem[] = [
      {
        id: 'gap-expo-1',
        category: 'exposure',
        name: 'Executive Committee Disagreements & Alignment',
        status: 'develop',
        currentSignal: 'Reports primarily to Engineering Manager and Product Lead',
        targetRequirement: 'Directly defends roadmap trade-offs and capital allocations before VP and C-Suite',
        remediationPath: 'Present monthly telemetry business review to VP of Product'
      }
    ];

    return {
      roleId: role.id,
      roleTitle: role.title,
      overallFitScore: overallFit,
      skillCoverageScore: skillCoverage,
      experienceCoverageScore: experienceCoverage,
      scopeCoverageScore: scopeCoverage,
      decisionCoverageScore: decisionCoverage,
      domainCoverageScore: domainCoverage,
      evidenceCoverageScore: evidenceCoverage,
      strongAreas: [
        'Product Strategy & Roadmap Narrative',
        'Continuous User Discovery',
        'Quantitative Analytics (SQL / Funnels)',
        'Cross-Functional Stakeholder Empathy'
      ],
      developAreas: [
        'Unit Economics & Multi-Tier Pricing',
        'Algorithmic System Trade-Offs',
        'Enterprise Security & Compliance'
      ],
      gapAreas: [
        'Direct People Management & Team Reviews',
        'Formal Board & Executive Committee Reporting'
      ],
      gapBreakdown: {
        skillGaps,
        experienceGaps,
        evidenceGaps,
        exposureGaps
      },
      recommendedNextActions: [
        'Complete Agentic AI Workshop & attach verified certificate as first-class evidence',
        'Co-author public API idempotency RFC with Principal Systems Engineer',
        'Execute pricing sensitivity analysis model for Company X opportunity'
      ]
    };
  }

  getRoleGraph(): RoleGraphData {
    return ROLE_GRAPH_DATA;
  }
}

export const roleIntelligenceStore = new RoleIntelligenceStore();
