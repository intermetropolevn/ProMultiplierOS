import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  Briefcase, 
  Building2, 
  Calendar, 
  Layers, 
  BookOpen, 
  Sparkles, 
  Edit3, 
  Copy, 
  Trash2, 
  Archive, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  LayoutGrid, 
  LayoutList, 
  TrendingUp, 
  Tag, 
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { CareerProject, ProjectStatus } from '../../../features/projects/types';
import { ProjectStorageService } from '../../../features/projects/services/projectStorageService';
import { GenerateFromProjectModal } from './GenerateFromProjectModal';

interface ProjectsDatabaseViewProps {
  projects: CareerProject[];
  onOpenProjectDetail: (project: CareerProject) => void;
  onCreateProject: () => void;
  onEditProject: (project: CareerProject) => void;
  onDuplicateProject: (project: CareerProject) => void;
  onDeleteProject: (projectId: string) => void;
  onArchiveToggle: (project: CareerProject) => void;
  onNavigateToStory?: (storyId: string) => void;
  onNavigateToBlueprint?: (blueprintId: string) => void;
}

export const ProjectsDatabaseView: React.FC<ProjectsDatabaseViewProps> = ({
  projects,
  onOpenProjectDetail,
  onCreateProject,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
  onArchiveToggle,
  onNavigateToStory,
  onNavigateToBlueprint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title' | 'metrics'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Active project for quick generate modal
  const [quickGenProject, setQuickGenProject] = useState<CareerProject | null>(null);

  // Distinct domains
  const distinctDomains = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (p.domain) set.add(p.domain);
    });
    return Array.from(set).sort();
  }, [projects]);

  // Filtered & sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        // Status filter
        if (statusFilter !== 'all') {
          if (p.status !== statusFilter) return false;
        } else {
          // By default in 'all', hide archived unless explicitly chosen
          if (p.status === 'archived') return false;
        }

        // Domain filter
        if (domainFilter !== 'all' && p.domain !== domainFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          const matchCompany = p.company.toLowerCase().includes(q);
          const matchRole = p.role.toLowerCase().includes(q);
          const matchTech = p.techStack.some(t => t.toLowerCase().includes(q));
          const matchContent = p.sections.some(s => s.content.toLowerCase().includes(q) || s.title.toLowerCase().includes(q));
          if (!matchTitle && !matchTagline && !matchCompany && !matchRole && !matchTech && !matchContent) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'created') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'metrics') {
          return b.metrics.length - a.metrics.length;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [projects, statusFilter, domainFilter, searchQuery, sortBy]);

  const activeCount = projects.filter(p => p.status === 'active').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const archivedCount = projects.filter(p => p.status === 'archived').length;

  return (
    <div className="space-y-6">
      
      {/* Search, Filter, Sort & Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, tech stack, company, metrics, or content..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* New Project CTA */}
          <button
            type="button"
            onClick={onCreateProject}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-2xs font-bold uppercase text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All ({projects.length - archivedCount})</option>
                <option value="active">Active ({activeCount})</option>
                <option value="completed">Completed ({completedCount})</option>
                <option value="in_review">In Review</option>
                <option value="archived">Archived ({archivedCount})</option>
              </select>
            </div>

            {/* Domain Filter */}
            {distinctDomains.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-2xs font-bold uppercase text-slate-400">Domain:</span>
                <select
                  value={domainFilter}
                  onChange={e => setDomainFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[180px] truncate"
                >
                  <option value="all">All Domains</option>
                  {distinctDomains.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-2xs font-bold uppercase text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="updated">Recently Updated</option>
                <option value="created">Newest Added</option>
                <option value="title">Title (A-Z)</option>
                <option value="metrics">Most Metrics</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1 rounded cursor-pointer transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Compact List View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results & Beta Indicator */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 gap-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-bold text-slate-900">{filteredProjects.length}</strong> curated sample {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Curated Beta Preview
          </span>
        </div>
      </div>

      {/* Project Cards / List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-2xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">
            {searchQuery ? 'No matching projects found' : 'No projects yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? 'Try adjusting your search terms or filters.'
              : 'Create your first project case study to document high-impact work, generate STAR competency stories, and produce interview Q&As.'}
          </p>
          <button
            type="button"
            onClick={onCreateProject}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Create New Project
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map(project => {
            const isArchived = project.status === 'archived';

            return (
              <div
                key={project.id}
                className={`bg-white rounded-2xl border transition-all duration-150 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md ${
                  isArchived ? 'opacity-70 border-slate-200 bg-slate-50/50' : 'border-slate-200/90 hover:border-blue-400'
                }`}
              >
                {/* Card Top */}
                <div className="p-5 space-y-3.5">
                  {/* Subtle Unboxed Metadata Line */}
                  <div className="flex items-center justify-between text-2xs text-slate-400 font-semibold">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-blue-600 font-bold uppercase tracking-wider">{project.domain}</span>
                      <span>·</span>
                      <span>{project.timeframe}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          project.status === 'completed'
                            ? 'bg-emerald-500'
                            : project.status === 'active'
                            ? 'bg-blue-500'
                            : project.status === 'in_review'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span className="capitalize text-slate-600 font-medium">
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Main Project Title & Role/Company */}
                  <div>
                    <h3 
                      onClick={() => onOpenProjectDetail(project)}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug tracking-tight"
                    >
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                      <span>{project.role}</span>
                      <span>·</span>
                      <span className="text-slate-700 font-semibold">{project.company}</span>
                    </div>
                  </div>

                  {/* Executive Tagline */}
                  {project.tagline && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {project.tagline}
                    </p>
                  )}

                  {/* Verified Impact Metrics snippet */}
                  {project.metrics.length > 0 && (
                    <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Key Verified Metric</span>
                      </div>
                      <p className="text-xs text-emerald-950 font-semibold line-clamp-1">
                        {project.metrics[0]}
                      </p>
                    </div>
                  )}

                  {/* Tech stack badges */}
                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.techStack.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-1.5 py-0.5 text-slate-400 text-[10px]">
                          +{project.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-2xs">
                  
                  {/* Linked assets counts */}
                  <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <span title={`${project.sections.length} case study sections`}>
                      {project.sections.length} sections
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-blue-600 font-bold" title="Linked Candidate Stories in Storybank">
                      <Layers className="w-3 h-3" />
                      {project.linkedStoryIds.length} stories
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-purple-600 font-bold" title="Linked Q&A Blueprints in Q&A pool">
                      <BookOpen className="w-3 h-3" />
                      {project.linkedBlueprintIds.length} Q&As
                    </span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQuickGenProject(project)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100/70 rounded-lg transition-colors cursor-pointer"
                      title="Generate Story or Q&A Blueprint"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditProject(project)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Edit Project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateProject(project)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Duplicate Project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onArchiveToggle(project)}
                      className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                      title={isArchived ? 'Restore Project' : 'Archive Project'}
                    >
                      {isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenProjectDetail(project)}
                      className="ml-1 px-2.5 py-1 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-2xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Detail</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPACT LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-blue-600">{project.domain}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-2xs text-slate-500">{project.company}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-2xs text-slate-400">{project.timeframe}</span>
                </div>
                <h4 
                  onClick={() => onOpenProjectDetail(project)}
                  className="text-xs font-bold text-slate-900 hover:text-blue-600 cursor-pointer truncate"
                >
                  {project.title}
                </h4>
                {project.tagline && (
                  <p className="text-[11px] text-slate-500 truncate max-w-2xl">
                    {project.tagline}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0 text-2xs">
                <div className="text-slate-500 hidden md:block">
                  <span className="font-semibold text-slate-700">{project.sections.length}</span> sections
                  <span className="mx-1">·</span>
                  <span className="font-semibold text-blue-700">{project.linkedStoryIds.length}</span> stories
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQuickGenProject(project)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer"
                    title="Generate Story or Q&A"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditProject(project)}
                    className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenProjectDetail(project)}
                    className="px-3 py-1 bg-slate-900 text-white rounded-lg font-bold text-2xs hover:bg-black transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Generate Modal */}
      {quickGenProject && (
        <GenerateFromProjectModal
          isOpen={!!quickGenProject}
          onClose={() => setQuickGenProject(null)}
          project={quickGenProject}
          defaultMode="story"
          onStoryGenerated={(storyId) => {
            onNavigateToStory?.(storyId);
          }}
          onBlueprintGenerated={(bpId) => {
            onNavigateToBlueprint?.(bpId);
          }}
        />
      )}

    </div>
  );
};
