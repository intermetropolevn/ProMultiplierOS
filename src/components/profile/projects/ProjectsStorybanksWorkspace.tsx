import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Layers, 
  Plus, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle,
  Database
} from 'lucide-react';
import { CareerProject } from '../../../features/projects/types';
import { ProjectStorageService } from '../../../features/projects/services/projectStorageService';
import { ProjectsDatabaseView } from './ProjectsDatabaseView';
import { ProjectDetailView } from './ProjectDetailView';
import { ProjectEditorModal } from './ProjectEditorModal';
import { StorybankDatabaseView } from './StorybankDatabaseView';
import { StructuredAnswerBlueprint } from '../../../features/knowledge/types';

interface ProjectsStorybanksWorkspaceProps {
  onStartPracticeBlueprint?: (blueprint: StructuredAnswerBlueprint) => void;
  onNavigateToBlueprint?: (blueprintId: string) => void;
}

export const ProjectsStorybanksWorkspace: React.FC<ProjectsStorybanksWorkspaceProps> = ({
  onStartPracticeBlueprint,
  onNavigateToBlueprint,
}) => {
  // Navigation: Primary Projects module vs Child Storybanks module
  const [activeSubNav, setActiveSubNav] = useState<'projects' | 'storybanks'>('projects');

  // Projects state
  const [projects, setProjects] = useState<CareerProject[]>(() => ProjectStorageService.getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Editor modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<CareerProject | null>(null);

  // Listen for storage events
  useEffect(() => {
    const handleUpdate = () => {
      setProjects(ProjectStorageService.getProjects());
    };
    window.addEventListener('career_projects_updated', handleUpdate);
    return () => {
      window.removeEventListener('career_projects_updated', handleUpdate);
    };
  }, []);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Handlers for Projects
  const handleOpenDetail = (project: CareerProject) => {
    setSelectedProjectId(project.id);
  };

  const handleBackToProjectsList = () => {
    setSelectedProjectId(null);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsEditorOpen(true);
  };

  const handleEditProject = (project: CareerProject) => {
    setEditingProject(project);
    setIsEditorOpen(true);
  };

  const handleSaveProject = (savedProject: CareerProject) => {
    ProjectStorageService.addOrUpdateProject(savedProject);
    setProjects(ProjectStorageService.getProjects());
    setIsEditorOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      ProjectStorageService.deleteProject(projectId);
      setProjects(ProjectStorageService.getProjects());
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
      }
    }
  };

  const handleDuplicateProject = (project: CareerProject) => {
    const dup = ProjectStorageService.duplicateProject(project.id);
    if (dup) {
      setProjects(ProjectStorageService.getProjects());
    }
  };

  const handleArchiveToggle = (project: CareerProject) => {
    if (project.status === 'archived') {
      ProjectStorageService.restoreProject(project.id);
    } else {
      ProjectStorageService.archiveProject(project.id);
    }
    setProjects(ProjectStorageService.getProjects());
  };

  // Cross navigation from Storybanks to Project Detail
  const handleJumpToProjectFromStory = (projId: string) => {
    setSelectedProjectId(projId);
    setActiveSubNav('projects');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* SECTION HEADER & SUB-NAVIGATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Career Knowledge Repositories
              </span>
              <span className="text-2xs text-slate-400 font-medium">Deeply Linked</span>
            </div>
            <h1 className="text-xl font-bold text-slate-950 tracking-tight">
              Projects & Storybanks
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              Document your high-impact engineering and product case studies in a flexible rich-text workspace, automatically generate behavioral candidate stories for your Storybank, and transform production experience into canonical Q&A Blueprints.
            </p>
          </div>

          {/* Sub-Navigation Tabs Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveSubNav('projects');
                setSelectedProjectId(null);
              }}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubNav === 'projects'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-blue-600" />
              <span>Projects ({projects.filter(p => p.status !== 'archived').length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSubNav('storybanks');
                setSelectedProjectId(null);
              }}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubNav === 'storybanks'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Storybanks</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: PROJECTS MODULE */}
      {activeSubNav === 'projects' && (
        <>
          {selectedProject ? (
            <ProjectDetailView
              project={selectedProject}
              onBack={handleBackToProjectsList}
              onEdit={handleEditProject}
              onDuplicate={handleDuplicateProject}
              onDelete={handleDeleteProject}
              onNavigateToStory={(storyId) => {
                setActiveSubNav('storybanks');
              }}
              onNavigateToBlueprint={onNavigateToBlueprint}
              onStartPracticeQuestion={onStartPracticeBlueprint}
            />
          ) : (
            <ProjectsDatabaseView
              projects={projects}
              onOpenProjectDetail={handleOpenDetail}
              onCreateProject={handleCreateProject}
              onEditProject={handleEditProject}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onArchiveToggle={handleArchiveToggle}
              onNavigateToStory={() => setActiveSubNav('storybanks')}
              onNavigateToBlueprint={onNavigateToBlueprint}
            />
          )}
        </>
      )}

      {/* SUB-VIEW 2: STORYBANKS CHILD MODULE */}
      {activeSubNav === 'storybanks' && (
        <StorybankDatabaseView
          projects={projects}
          onOpenProjectDetail={handleJumpToProjectFromStory}
          onStartPracticeQuestion={onStartPracticeBlueprint}
          onNavigateToBlueprint={onNavigateToBlueprint}
        />
      )}

      {/* Project Editor Modal */}
      {isEditorOpen && (
        <ProjectEditorModal
          isOpen={isEditorOpen}
          project={editingProject}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
        />
      )}

    </div>
  );
};
