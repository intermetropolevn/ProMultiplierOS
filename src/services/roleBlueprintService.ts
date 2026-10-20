import { RoleBlueprint, RoleCategory, SectorDomain, ExperienceLevel, CompetencyPillar, CompensationBenchmarkTier, InterviewPipelineStage } from '../types';
import { ROLES_DATA } from '../data/rolesData';

const CUSTOM_ROLES_STORAGE_KEY = 'career_os_custom_blueprints_v1';
const DELETED_ROLES_STORAGE_KEY = 'career_os_deleted_blueprints_v1';

export class RoleBlueprintService {
  /**
   * Get all custom blueprints stored in localStorage
   */
  public static getCustomBlueprints(): RoleBlueprint[] {
    try {
      const data = localStorage.getItem(CUSTOM_ROLES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (e) {
      console.warn('Failed to parse custom blueprints from localStorage', e);
      return [];
    }
  }

  /**
   * Get deleted/archived role IDs
   */
  public static getArchivedRoleIds(): string[] {
    try {
      const data = localStorage.getItem(DELETED_ROLES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save custom blueprints to localStorage
   */
  public static saveCustomBlueprints(blueprints: RoleBlueprint[]): void {
    try {
      localStorage.setItem(CUSTOM_ROLES_STORAGE_KEY, JSON.stringify(blueprints));
      window.dispatchEvent(new CustomEvent('career_roles_updated'));
    } catch (e) {
      console.warn('Failed to save custom blueprints', e);
    }
  }

  /**
   * Get all active blueprints (predefined + custom, minus archived)
   */
  public static getAllBlueprints(includeDrafts = true): RoleBlueprint[] {
    const archivedIds = new Set(this.getArchivedRoleIds());
    const customList = this.getCustomBlueprints();

    // Map base roles and apply any custom overrides
    const baseRoles: RoleBlueprint[] = ROLES_DATA.map(role => ({
      ...role,
      status: role.status || 'published',
      missionScope: role.overview,
      techStack: role.primaryTechStack,
      typicalDay: role.dailyTasksTimeline.map(d => ({
        time: d.time,
        activity: d.task,
        description: d.description,
      })),
      interviewPipeline: role.typicalInterviewStages.map((stage, idx) => ({
        order: idx + 1,
        name: stage.replace(/\s*\(\d+m\)/, ''),
        duration: stage.match(/\((\d+m)\)/)?.[1] || '60m',
        description: `Evaluation stage for ${stage}`
      }))
    }));

    // Merge: custom blueprints override by ID or are appended
    const mergedMap = new Map<string, RoleBlueprint>();
    baseRoles.forEach(r => mergedMap.set(r.id, r));
    customList.forEach(r => mergedMap.set(r.id, r));

    const all = Array.from(mergedMap.values()).filter(r => !archivedIds.has(r.id));
    if (!includeDrafts) {
      return all.filter(r => r.status !== 'draft');
    }
    return all;
  }

  /**
   * Get blueprint by ID
   */
  public static getBlueprintById(id: string): RoleBlueprint | undefined {
    return this.getAllBlueprints(true).find(b => b.id === id);
  }

  /**
   * Create a new blueprint
   */
  public static createBlueprint(blueprint: Omit<RoleBlueprint, 'id' | 'createdAt' | 'updatedAt'>): RoleBlueprint {
    const newBlueprint: RoleBlueprint = {
      ...blueprint,
      id: `role-custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCustom: true,
      status: blueprint.status || 'published'
    };

    const current = this.getCustomBlueprints();
    current.unshift(newBlueprint);
    this.saveCustomBlueprints(current);
    return newBlueprint;
  }

  /**
   * Update an existing blueprint
   */
  public static updateBlueprint(id: string, updates: Partial<RoleBlueprint>): RoleBlueprint | null {
    const existing = this.getBlueprintById(id);
    if (!existing) return null;

    const updated: RoleBlueprint = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      isCustom: true
    };

    const current = this.getCustomBlueprints();
    const idx = current.findIndex(b => b.id === id);
    if (idx >= 0) {
      current[idx] = updated;
    } else {
      current.unshift(updated);
    }
    this.saveCustomBlueprints(current);
    return updated;
  }

  /**
   * Duplicate an existing blueprint
   */
  public static duplicateBlueprint(sourceId: string, customTitle?: string): RoleBlueprint | null {
    const source = this.getBlueprintById(sourceId);
    if (!source) return null;

    const title = customTitle || `${source.title} (Variant)`;
    const duplicated: RoleBlueprint = {
      ...source,
      id: `role-custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      tagline: source.tagline,
      status: 'draft', // duplicated starts as draft
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCustom: true
    };

    const current = this.getCustomBlueprints();
    current.unshift(duplicated);
    this.saveCustomBlueprints(current);
    return duplicated;
  }

  /**
   * Archive / soft-delete a blueprint
   */
  public static archiveBlueprint(id: string): void {
    const archived = this.getArchivedRoleIds();
    if (!archived.includes(id)) {
      archived.push(id);
      try {
        localStorage.setItem(DELETED_ROLES_STORAGE_KEY, JSON.stringify(archived));
      } catch (e) {
        console.warn('Failed to archive blueprint', e);
      }
    }
    // Also remove from custom if present
    const custom = this.getCustomBlueprints().filter(b => b.id !== id);
    this.saveCustomBlueprints(custom);
    window.dispatchEvent(new CustomEvent('career_roles_updated'));
  }

  /**
   * Intelligent Field Suggestions based on Role Title, Category, Domain & Seniority
   */
  public static getIntelligentSuggestions(params: {
    title: string;
    category: RoleCategory | string;
    domain?: SectorDomain | string;
    seniority?: ExperienceLevel | string;
  }): {
    suggestedCompetencies: CompetencyPillar[];
    suggestedCompensation: {
      junior: { min: number; max: number; formatted: string };
      mid: { min: number; max: number; formatted: string };
      senior: { min: number; max: number; formatted: string };
      lead: { min: number; max: number; formatted: string };
    };
    suggestedTechStack: string[];
    suggestedInterviewPipeline: InterviewPipelineStage[];
    suggestedTypicalDay: { time: string; activity: string; description: string }[];
    suggestedMarketDemand: 'High' | 'Very High' | 'Surging';
    suggestedMissionScope: string;
  } {
    const t = params.title.toLowerCase();
    const cat = params.category;
    const isEng = cat === 'Software Engineering' || t.includes('engineer') || t.includes('developer') || t.includes('architect');
    const isPM = cat === 'Product Management' || t.includes('product') || t.includes('pm');
    const isData = cat === 'Data & Machine Learning' || cat === 'Data Analytics & BI' || t.includes('data') || t.includes('ai') || t.includes('ml');
    const isDesign = cat === 'UI/UX & Product Design' || t.includes('design') || t.includes('ux');
    const isSecurity = cat === 'Security & Systems' || t.includes('security') || t.includes('devops') || t.includes('cloud');

    let suggestedCompetencies: CompetencyPillar[] = [];
    let suggestedTechStack: string[] = [];
    let suggestedInterviewPipeline: InterviewPipelineStage[] = [];
    let suggestedTypicalDay: { time: string; activity: string; description: string }[] = [];
    let suggestedMissionScope = '';

    if (isEng) {
      suggestedMissionScope = `Responsible for architecting robust, scalable distributed services, ensuring resilient API orchestration, high transaction throughput, and zero-downtime operational reliability. Solves complex scalability bottlenecks and aligns technical implementation with cross-functional product requirements.`;
      suggestedCompetencies = [
        {
          name: 'Distributed Systems & Concurrency',
          description: 'Design fault-tolerant services that scale horizontally and handle partial network partitions.',
          keyIndicators: ['CAP theorem trade-offs', 'Raft/Paxos consensus awareness', 'Distributed locking & idempotency', 'Deadlock avoidance']
        },
        {
          name: 'Database Architecture & Query Optimization',
          description: 'Relational & NoSQL modeling, indexing strategy, transaction isolation levels, and replication.',
          keyIndicators: ['Postgres EXPLAIN ANALYZE tuning', 'ACID vs BASE trade-offs', 'Partitioning and sharding', 'Connection pooling']
        },
        {
          name: 'API Reliability & Observability',
          description: 'RESTful standards, gRPC protocols, rate limiting, distributed tracing, and SLO/SLA management.',
          keyIndicators: ['Semantic versioning', 'Idempotency keys', 'OpenTelemetry metrics', 'Circuit breaker resilience']
        },
        {
          name: 'System Security & Scalability Standards',
          description: 'Zero-trust network boundaries, OWASP mitigation, cryptographic storage, and asynchronous processing.',
          keyIndicators: ['Role-based access control', 'Kafka streaming backpressure', 'Audit logging compliance', 'Horizontal pod autoscaling']
        }
      ];
      suggestedTechStack = ['Go', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'Datadog', 'Terraform', 'GitHub Actions', 'AWS'];
      suggestedInterviewPipeline = [
        { order: 1, name: 'Recruiter Alignment & Values Screen', duration: '30m', description: 'Career trajectory, compensation expectations, and culture alignment.' },
        { order: 2, name: 'Technical Coding & Data Structures', duration: '60m', description: 'Algorithmic problem solving, clean code readability, and time/space complexity analysis.' },
        { order: 3, name: 'System Design & Distributed Scalability', duration: '60m', description: 'Architecting high-scale distributed systems under network constraints and latency budgets.' },
        { order: 4, name: 'Past Architecture & Code Deep Dive', duration: '60m', description: 'Technical walkthrough of an architectural system previously built and defended.' },
        { order: 5, name: 'Cross-functional Collaboration & Values', duration: '45m', description: 'Conflict resolution, incident leadership, and cross-team trade-off discussions.' }
      ];
      suggestedTypicalDay = [
        { time: '09:00 AM', activity: 'Observability & Metrics Review', description: 'Review Datadog latency dashboards, p99 spikes, and asynchronous queue health.' },
        { time: '10:00 AM', activity: 'Cross-functional Architecture Sync', description: 'Align with Frontend and Product on payload contracts and error codes.' },
        { time: '11:00 AM', activity: 'Deep Coding & Implementation', description: 'Develop distributed locking and event-driven pipeline components.' },
        { time: '02:00 PM', activity: 'System RFC Architecture Review', description: 'Present technical proposal for database partitioning and schema migration.' },
        { time: '04:00 PM', activity: 'Code Review & Team Mentorship', description: 'Review pull requests focusing on query optimization and connection leak prevention.' }
      ];
    } else if (isPM) {
      suggestedMissionScope = `Steers the product strategy, technical roadmap, and execution cadence. Excels at deciphering ambiguous market opportunities, authoring rigorous PRDs, aligning engineering and design partners, and driving customer-obsessed business outcomes.`;
      suggestedCompetencies = [
        {
          name: 'Product Discovery & Opportunity Sizing',
          description: 'Validating market problems through user research, data analysis, and competitive landscape evaluation.',
          keyIndicators: ['TAM/SAM estimation', 'User interview synthesis', 'Problem-solution fit validation', 'Risk hypothesis testing']
        },
        {
          name: 'Technical Depth & Architecture Trade-offs',
          description: 'Understanding complex systems, latency constraints, and data flows to collaborate with engineering.',
          keyIndicators: ['API contract awareness', 'Build vs Buy analysis', 'Technical debt prioritization', 'Telemetry and analytics instrumentation']
        },
        {
          name: 'Product Execution & GTM Alignment',
          description: 'Leading sprint cycles, managing beta releases, pricing experiments, and cross-functional launch plans.',
          keyIndicators: ['Pragmatic PRD specification', 'Sprint release management', 'Cross-functional launch readiness', 'Customer feedback loops']
        },
        {
          name: 'Metrics Architecture & Growth Levers',
          description: 'Defining North Star metrics, input KPIs, retention cohorts, and conversion funnel optimizations.',
          keyIndicators: ['A/B testing statistical rigor', 'Retention cohort decomposition', 'Unit economics modeling', 'Feature adoption tracking']
        }
      ];
      suggestedTechStack = ['Figma', 'Linear', 'Jira', 'Mixpanel', 'Amplitude', 'SQL', 'Postman', 'Notion', 'Segment', 'Tableau'];
      suggestedInterviewPipeline = [
        { order: 1, name: 'Recruiter Initial Fit Screen', duration: '30m', description: 'Role alignment, past achievements, and scope expectations.' },
        { order: 2, name: 'Product Sense & Problem Discovery', duration: '60m', description: 'Designing a product for a specific user segment from first principles.' },
        { order: 3, name: 'Analytical Execution & Metrics Case', duration: '60m', description: 'Deconstructing feature failure, defining success metrics, and prioritization trade-offs.' },
        { order: 4, name: 'Technical Depth & Engineering Collaboration', duration: '45m', description: 'Technical sparring with engineering lead on trade-offs and architectural feasibility.' },
        { order: 5, name: 'Executive Leadership & Cross-Functional Bar', duration: '45m', description: 'Stakeholder management, crisis navigation, and product vision defense.' }
      ];
      suggestedTypicalDay = [
        { time: '09:00 AM', activity: 'Metrics & Funnel Performance Review', description: 'Analyze daily cohort retention, conversion funnels, and error reports in Mixpanel.' },
        { time: '10:00 AM', activity: 'Engineering Standup & Triage', description: 'Clarify edge cases on current sprint deliverables and unblock team.' },
        { time: '11:30 AM', activity: 'User Research Interview', description: 'Conduct discovery session with enterprise customers on friction points.' },
        { time: '02:00 PM', activity: 'PRD Drafting & Roadmap Grooming', description: 'Author detailed feature specs, acceptance criteria, and edge-case behaviors.' },
        { time: '04:00 PM', activity: 'Design Critique & Prototype Review', description: 'Iterate with design on user interaction paradigms and microcopy clarity.' }
      ];
    } else if (isData) {
      suggestedMissionScope = `Designs and deploys scalable data pipelines, feature stores, and predictive models. Ensures enterprise data integrity, feature freshness, model governance, and drives metric-driven decision intelligence across the organization.`;
      suggestedCompetencies = [
        {
          name: 'Machine Learning Engineering & MLOps',
          description: 'Model training, hyperparameter tuning, model serving, drift monitoring, and feature pipelines.',
          keyIndicators: ['Low-latency inference', 'Model drift detection', 'Feature store orchestration', 'GPU compute optimization']
        },
        {
          name: 'Data Warehousing & Distributed Compute',
          description: 'Designing Lakehouse architectures, dimensional modeling, and high-throughput transformations.',
          keyIndicators: ['dbt model architecture', 'Spark optimization', 'BigQuery/Snowflake cost control', 'Data lineage enforcement']
        },
        {
          name: 'Statistical Experimentation & Causal Inference',
          description: 'A/B testing design, power calculations, counterfactual analysis, and metric stabilization.',
          keyIndicators: ['Sample ratio mismatch detection', 'Causal impact modeling', 'Variance reduction (CUPED)', 'Multi-armed bandits']
        }
      ];
      suggestedTechStack = ['Python', 'PyTorch', 'SQL', 'Snowflake', 'BigQuery', 'dbt', 'Apache Spark', 'Airflow', 'MLflow', 'Docker', 'Kubeflow', 'Pandas'];
      suggestedInterviewPipeline = [
        { order: 1, name: 'Recruiter & Background Alignment', duration: '30m', description: 'Past projects, domain expertise, and technical preferences.' },
        { order: 2, name: 'Data Structures & SQL / Python Coding', duration: '60m', description: 'Complex querying, data wrangling, and algorithmic efficiency.' },
        { order: 3, name: 'Machine Learning & System Design', duration: '60m', description: 'End-to-end ML architecture: ingestion, feature store, training, and real-time inference.' },
        { order: 4, name: 'Take-Home Model / Case Study Defense', duration: '60m', description: 'Walkthrough of statistical analysis and code quality from take-home challenge.' },
        { order: 5, name: 'Business Value & Stakeholder Synthesis', duration: '45m', description: 'Translating complex model telemetry to executive business leaders.' }
      ];
      suggestedTypicalDay = [
        { time: '09:00 AM', activity: 'Pipeline Health & Drift Monitoring', description: 'Inspect overnight DAG runs in Airflow and check model prediction distribution shifts.' },
        { time: '10:30 AM', activity: 'Feature Engineering & Data Modeling', description: 'Build and test new aggregations in dbt and validate Snowflake query execution plans.' },
        { time: '01:30 PM', activity: 'Model Experimentation & Training', description: 'Run ablation studies in PyTorch and benchmark offline evaluation metrics.' },
        { time: '03:30 PM', activity: 'Stakeholder Insights Presentation', description: 'Share model impact findings and conversion lift results with product team.' }
      ];
    } else {
      // General High-Tech Role
      suggestedMissionScope = `Leads domain initiatives, establishing operational excellence and delivering measurable business impact. Collaborates across functions to solve mission-critical challenges and scale team capabilities.`;
      suggestedCompetencies = [
        {
          name: 'Strategic Problem Solving & Synthesis',
          description: 'Deconstructing complex, ambiguous business problems into actionable, phased initiatives.',
          keyIndicators: ['First-principles reasoning', 'Root cause decomposition', 'Clear structured documentation', 'KPI alignment']
        },
        {
          name: 'Operational Excellence & Process Design',
          description: 'Building repeatable systems, SLAs, feedback mechanisms, and high-quality deliverables.',
          keyIndicators: ['Process automation', 'Error rate reduction', 'Knowledge documentation', 'Continuous improvement']
        },
        {
          name: 'Cross-functional Influence & Alignment',
          description: 'Driving consensus across engineering, product, and leadership stakeholders.',
          keyIndicators: ['Conflict resolution', 'Executive communication', 'Stakeholder empathy', 'Transparent trade-off negotiation']
        }
      ];
      suggestedTechStack = ['Figma', 'Notion', 'Linear', 'SQL', 'Postman', 'Slack', 'Google Workspace', 'GitHub'];
      suggestedInterviewPipeline = [
        { order: 1, name: 'Introductory Recruiter Screen', duration: '30m', description: 'Background overview, motivations, and expectations.' },
        { order: 2, name: 'Functional Capability Deep-Dive', duration: '60m', description: 'Role-specific domain competencies and past deliverables analysis.' },
        { order: 3, name: 'Practical Problem Solving & Case Study', duration: '60m', description: 'Live problem scenario with interactive scoping and solution design.' },
        { order: 4, name: 'Behavioral & Leadership Collaboration', duration: '45m', description: 'Values alignment, conflict resolution, and working style evaluation.' }
      ];
      suggestedTypicalDay = [
        { time: '09:00 AM', activity: 'Daily Planning & Priority Alignment', description: 'Review critical metrics, urgent communications, and unblock key tasks.' },
        { time: '10:30 AM', activity: 'Core Deep-Work Execution', description: 'Focus on primary deliverables, analytical artifacts, and strategic documentation.' },
        { time: '02:00 PM', activity: 'Cross-functional Working Session', description: 'Collaborate with teammates on high-impact milestone solutions.' },
        { time: '04:00 PM', activity: 'Feedback Review & Synthesis', description: 'Incorporate review notes and prepare progress updates for leadership.' }
      ];
    }

    // Dynamic compensation calculation based on seniority and category
    let mult = 1.0;
    if (params.seniority?.includes('Junior')) mult = 0.75;
    else if (params.seniority?.includes('Lead') || params.seniority?.includes('Staff')) mult = 1.35;
    else if (params.seniority?.includes('Principal') || params.seniority?.includes('Director')) mult = 1.6;

    const baseJunior = Math.round(95000 * mult);
    const baseMid = Math.round(135000 * mult);
    const baseSenior = Math.round(180000 * mult);
    const baseLead = Math.round(245000 * mult);

    return {
      suggestedCompetencies,
      suggestedCompensation: {
        junior: { min: baseJunior, max: Math.round(baseJunior * 1.3), formatted: `$${(baseJunior/1000).toFixed(0)}k – $${((baseJunior*1.3)/1000).toFixed(0)}k` },
        mid: { min: baseMid, max: Math.round(baseMid * 1.3), formatted: `$${(baseMid/1000).toFixed(0)}k – $${((baseMid*1.3)/1000).toFixed(0)}k` },
        senior: { min: baseSenior, max: Math.round(baseSenior * 1.35), formatted: `$${(baseSenior/1000).toFixed(0)}k – $${((baseSenior*1.35)/1000).toFixed(0)}k` },
        lead: { min: baseLead, max: Math.round(baseLead * 1.3), formatted: `$${(baseLead/1000).toFixed(0)}k – $${((baseLead*1.3)/1000).toFixed(0)}k+` },
      },
      suggestedTechStack,
      suggestedInterviewPipeline,
      suggestedTypicalDay,
      suggestedMarketDemand: 'Very High',
      suggestedMissionScope
    };
  }
}
