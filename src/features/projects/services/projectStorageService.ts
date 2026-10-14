import { CareerProject, ProjectSection } from '../types';
import { INITIAL_PROJECTS } from '../data/seedProjects';
import { CandidateStory, StructuredAnswerBlueprint, BlueprintFramework } from '../../knowledge/types';
import { KnowledgeStorageService } from '../../knowledge/services/knowledgeStorageService';

const STORAGE_KEY = 'career_os_projects_v2';

export class ProjectStorageService {
  public static getProjects(): CareerProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: CareerProject[] = JSON.parse(data);
        let updated = false;

        // Ensure default seed projects exist if not in storage
        for (const initial of INITIAL_PROJECTS) {
          if (!parsed.some(p => p.id === initial.id)) {
            parsed.push(initial);
            updated = true;
          }
        }

        if (updated) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  }

  public static saveProjects(projects: CareerProject[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('career_projects_updated'));
      }
    } catch (e) {
      console.warn('Failed to save projects to localStorage', e);
    }
  }

  public static getProjectById(id: string): CareerProject | undefined {
    return this.getProjects().find(p => p.id === id);
  }

  public static addOrUpdateProject(project: CareerProject): CareerProject[] {
    const list = this.getProjects();
    const existingIndex = list.findIndex(p => p.id === project.id);
    let updated: CareerProject[];
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = {
        ...project,
        updatedAt: now
      };
    } else {
      updated = [
        {
          ...project,
          createdAt: project.createdAt || now,
          updatedAt: now
        },
        ...list
      ];
    }

    this.saveProjects(updated);
    return updated;
  }

  public static deleteProject(id: string): CareerProject[] {
    const list = this.getProjects().filter(p => p.id !== id);
    this.saveProjects(list);
    return list;
  }

  public static duplicateProject(id: string): CareerProject | null {
    const project = this.getProjectById(id);
    if (!project) return null;

    const newId = `proj-${Date.now()}`;
    const duplicated: CareerProject = {
      ...project,
      id: newId,
      title: `${project.title} (Copy)`,
      linkedStoryIds: [],
      linkedBlueprintIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.addOrUpdateProject(duplicated);
    return duplicated;
  }

  public static archiveProject(id: string): CareerProject[] {
    const project = this.getProjectById(id);
    if (!project) return this.getProjects();

    return this.addOrUpdateProject({
      ...project,
      status: 'archived'
    });
  }

  public static restoreProject(id: string): CareerProject[] {
    const project = this.getProjectById(id);
    if (!project) return this.getProjects();

    return this.addOrUpdateProject({
      ...project,
      status: 'completed'
    });
  }

  public static linkStoryToProject(projectId: string, storyId: string): void {
    const project = this.getProjectById(projectId);
    if (!project) return;

    if (!project.linkedStoryIds.includes(storyId)) {
      this.addOrUpdateProject({
        ...project,
        linkedStoryIds: [...project.linkedStoryIds, storyId]
      });
    }
  }

  public static linkBlueprintToProject(projectId: string, blueprintId: string): void {
    const project = this.getProjectById(projectId);
    if (!project) return;

    if (!project.linkedBlueprintIds.includes(blueprintId)) {
      this.addOrUpdateProject({
        ...project,
        linkedBlueprintIds: [...project.linkedBlueprintIds, blueprintId]
      });
    }
  }

  /**
   * Helper to extract content from specific sections if available
   */
  public static getSectionContent(project: CareerProject, sectionType: string): string {
    const sec = project.sections.find(s => s.type === sectionType);
    return sec ? sec.content : '';
  }

  /**
   * Generates a CandidateStory from a Project's structured rich-text sections
   */
  public static generateStoryFromProject(project: CareerProject): CandidateStory {
    const problem = this.getSectionContent(project, 'problem') || this.getSectionContent(project, 'user_problem') || project.tagline;
    const context = this.getSectionContent(project, 'business_context') || `Project executed at ${project.company || 'Enterprise'} during ${project.timeframe}.`;
    const decision = this.getSectionContent(project, 'decision') || 'Formulated a strategic technical architecture with strict fallback boundaries.';
    const tradeoffs = this.getSectionContent(project, 'tradeoffs') || 'Weighed operational overhead against risk mitigation and time-to-market.';
    const result = this.getSectionContent(project, 'result') || (project.metrics.length > 0 ? project.metrics.join('. ') : 'Delivered on time with zero disruption.');

    const storyId = `story-proj-${Date.now()}`;
    const newStory: CandidateStory = {
      id: storyId,
      title: `${project.title}`,
      projectId: project.id,
      projectTitle: project.title,
      bestFor: ['Decision Making', 'Scale', 'Technical Architecture', 'Execution Under Pressure'],
      relevantRoles: [project.role || 'Staff Engineer', 'Product Management'],
      skills: project.techStack.length > 0 ? project.techStack : ['System Design', 'Strategic Decisions'],
      metricsStatus: project.metrics.length > 0 ? 'Available' : 'Missing',
      metrics: project.metrics.length > 0 ? [...project.metrics] : ['Measurable metric to be documented'],
      evidenceQuality: project.metrics.length > 0 ? 'Strong evidence' : 'Partial evidence',
      synopsis: project.tagline || `${project.title} - engineered solution delivering high-scale reliability.`,
      context: `${context} Problem: ${problem}`,
      myRole: project.role || 'Project Lead & Principal Architect',
      actions: `Led end-to-end design and execution. Evaluated architectural tradeoffs and aligned cross-functional teams on the implementation roadmap.`,
      decision: decision,
      tradeoffs: tradeoffs,
      outcome: result,
      linkedQuestionIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to KnowledgeStorageService stories
    KnowledgeStorageService.addOrUpdateStory(newStory);
    // Link to project
    this.linkStoryToProject(project.id, storyId);

    return newStory;
  }

  /**
   * Generates a StructuredAnswerBlueprint from a Project and adds to Blueprints database
   */
  public static generateBlueprintFromProject(
    project: CareerProject,
    framework: BlueprintFramework = 'Custom',
    customQuestion?: string
  ): StructuredAnswerBlueprint {
    const problem = this.getSectionContent(project, 'problem') || project.tagline;
    const context = this.getSectionContent(project, 'business_context') || `${project.title} at ${project.company}`;
    const decision = this.getSectionContent(project, 'decision') || 'Engineered scalable resilient architecture.';
    const tradeoffs = this.getSectionContent(project, 'tradeoffs') || 'Balanced execution speed and technical rigor.';
    const result = this.getSectionContent(project, 'result') || (project.metrics.length > 0 ? project.metrics.join('. ') : 'Achieved measurable impact.');

    const defaultQuestion = customQuestion || `Tell me about a high-stakes technical or product initiative where you led the architecture and made critical tradeoffs.`;
    const bpId = `bp-${Date.now()}`;

    const solutionAndImpact = `### Architectural Decision & Approach
${decision}

### Trade-offs & Compromises
${tradeoffs}

### Measurable Production Impact
${result}`;

    const newBlueprint: StructuredAnswerBlueprint = {
      id: bpId,
      title: project.title,
      questionId: `q-${bpId}`,
      questionText: defaultQuestion,
      storyId: project.id,
      storyTitle: project.title,
      framework: framework,
      components: {
        situation: context,
        task: problem,
        action: [decision],
        result: project.metrics.length > 0 ? project.metrics : [result],
        solutionAndImpact: solutionAndImpact,
        openingHook: `In leading the ${project.title}, I resolved ${problem.substring(0, 100)} by prioritizing ${project.techStack.slice(0, 2).join(' and ')} while protecting production uptime.`,
      },
      metrics: project.metrics.length > 0 ? [...project.metrics] : ['High-reliability delivery'],
      targetDurationSeconds: 180,
      targetRole: project.role,
      roleCategory: 'Software Engineering',
      targetCompany: project.company,
      domain: project.domain,
      tags: [...project.techStack, 'Project Case Study'],
      assignedRoles: ['Engineering Lead', 'Technical Interviewer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to KnowledgeStorageService blueprints
    KnowledgeStorageService.addOrUpdateBlueprint(newBlueprint);
    // Link to project
    this.linkBlueprintToProject(project.id, bpId);

    return newBlueprint;
  }
}
