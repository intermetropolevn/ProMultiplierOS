import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Layers, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ExternalLink, 
  Edit3, 
  Copy, 
  Trash2, 
  Play, 
  Filter, 
  FolderKanban, 
  Tag, 
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { CandidateStory, StoryBestFor, StoryEvidenceQuality, StructuredAnswerBlueprint } from '../../../features/knowledge/types';
import { KnowledgeStorageService } from '../../../features/knowledge/services/knowledgeStorageService';
import { CareerProject } from '../../../features/projects/types';
import { StoryDetailModal } from './StoryDetailModal';
import { CreateStoryModal } from './CreateStoryModal';

interface StorybankDatabaseViewProps {
  projects: CareerProject[];
  onOpenProjectDetail: (projectId: string) => void;
  onStartPracticeQuestion?: (blueprint: StructuredAnswerBlueprint) => void;
  onNavigateToBlueprint?: (blueprintId: string) => void;
}

export const StorybankDatabaseView: React.FC<StorybankDatabaseViewProps> = ({
  projects,
  onOpenProjectDetail,
  onStartPracticeQuestion,
  onNavigateToBlueprint,
}) => {
  const [stories, setStories] = useState<CandidateStory[]>(() => KnowledgeStorageService.getStories());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetency, setSelectedCompetency] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Modals
  const [viewingStory, setViewingStory] = useState<CandidateStory | null>(null);
  const [editingStory, setEditingStory] = useState<CandidateStory | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync when storage updates
  const refreshStories = () => {
    setStories(KnowledgeStorageService.getStories());
  };

  // Competency options
  const competencyOptions: StoryBestFor[] = [
    'Conflict',
    'Leadership',
    'Ambiguity',
    'Failure',
    'Decision Making',
    'Technical Architecture',
    'Scale',
    'Turnaround',
    'Execution Under Pressure',
    'Customer Insights'
  ];

  // Filtered stories
  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      // Competency filter
      if (selectedCompetency !== 'all') {
        if (!story.bestFor.includes(selectedCompetency as StoryBestFor)) return false;
      }

      // Quality filter
      if (selectedQuality !== 'all') {
        if (story.evidenceQuality !== selectedQuality) return false;
      }

      // Project filter
      if (selectedProjectId !== 'all') {
        if (story.projectId !== selectedProjectId) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = story.title.toLowerCase().includes(q);
        const matchSynopsis = story.synopsis?.toLowerCase().includes(q);
        const matchContext = story.context?.toLowerCase().includes(q);
        const matchActions = story.actions?.toLowerCase().includes(q);
        const matchOutcome = story.outcome?.toLowerCase().includes(q);
        const matchSkills = story.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchSynopsis && !matchContext && !matchActions && !matchOutcome && !matchSkills) {
          return false;
        }
      }

      return true;
    });
  }, [stories, selectedCompetency, selectedQuality, selectedProjectId, searchQuery]);

  const handleDeleteStory = (id: string) => {
    if (confirm('Are you sure you want to delete this story from your Storybank?')) {
      KnowledgeStorageService.deleteStory(id);
      refreshStories();
    }
  };

  const handleDuplicateStory = (story: CandidateStory) => {
    const duplicated: CandidateStory = {
      ...story,
      id: `story-${Date.now()}`,
      title: `${story.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    KnowledgeStorageService.addOrUpdateStory(duplicated);
    refreshStories();
  };

  // Convert story directly into a Q&A Blueprint
  const handleConvertToBlueprint = (story: CandidateStory) => {
    const bpId = `bp-${Date.now()}`;
    const newBp: StructuredAnswerBlueprint = {
      id: bpId,
      title: story.title,
      questionId: `q-${bpId}`,
      questionText: `Tell me about a time you handled ${story.bestFor[0]?.toLowerCase() || 'a critical challenge'}: ${story.title}.`,
      storyId: story.id,
      storyTitle: story.title,
      framework: 'STAR',
      components: {
        situation: story.context,
        task: story.myRole,
        action: [story.actions, story.decision].filter(Boolean),
        result: story.metrics.length > 0 ? story.metrics : [story.outcome],
        solutionAndImpact: `### Situation & Context\n${story.context}\n\n### Actions & Decisions\n${story.actions}\n\n### Impact\n${story.outcome}`,
        openingHook: story.synopsis
      },
      metrics: story.metrics || [],
      targetDurationSeconds: 180,
      targetRole: story.relevantRoles[0] || 'Software Engineering',
      roleCategory: 'Software Engineering',
      tags: [...story.skills, 'From Storybank'],
      assignedRoles: ['Engineering Lead', 'Technical Interviewer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    KnowledgeStorageService.addOrUpdateBlueprint(newBp);
    alert(`Successfully generated Q&A Blueprint for "${story.title}"! You can find it under Question & Answer Blueprints.`);
    onNavigateToBlueprint?.(bpId);
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search stories by competency, keywords, skills, actions, or metrics..."
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

          {/* New Story CTA */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Story</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          
          {/* Competency Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-2xs font-bold uppercase text-slate-400">Competency:</span>
            <select
              value={selectedCompetency}
              onChange={e => setSelectedCompetency(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Competencies</option>
              {competencyOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Quality Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-2xs font-bold uppercase text-slate-400">Evidence Quality:</span>
            <select
              value={selectedQuality}
              onChange={e => setSelectedQuality(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Quality Levels</option>
              <option value="Strong evidence">Strong evidence</option>
              <option value="Partial evidence">Partial evidence</option>
              <option value="Needs metrics">Needs metrics</option>
            </select>
          </div>

          {/* Project Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-2xs font-bold uppercase text-slate-400">Project Link:</span>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[180px] truncate"
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-2xs text-slate-400 font-medium">
            Showing <span className="font-bold text-slate-700">{filteredStories.length}</span> stories
          </div>
        </div>
      </div>

      {/* Story Cards Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-2xs">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">
            {searchQuery ? 'No matching stories found' : 'No stories in Storybank yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? 'Try modifying your search query or filters.'
              : 'Add STAR/CAR stories directly or generate them automatically from your Projects.'}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Create New Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredStories.map(story => {
            const linkedProject = projects.find(p => p.id === story.projectId);

            return (
              <div
                key={story.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 transition-all duration-150 p-5 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3.5"
              >
                <div className="space-y-3">
                  
                  {/* Top: Competencies + Quality */}
                  <div className="flex items-center justify-between gap-2 text-2xs font-semibold">
                    <div className="flex flex-wrap items-center gap-1.5 truncate">
                      {story.bestFor.slice(0, 3).map((comp, i) => (
                        <span
                          key={i}
                          className="text-blue-700 font-bold uppercase tracking-wider"
                        >
                          {comp}{i < Math.min(story.bestFor.length, 3) - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                        story.evidenceQuality === 'Strong evidence'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : story.evidenceQuality === 'Partial evidence'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {story.evidenceQuality}
                    </span>
                  </div>

                  {/* Story Title */}
                  <h3
                    onClick={() => setViewingStory(story)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug tracking-tight"
                  >
                    {story.title}
                  </h3>

                  {/* Originating Project Link Badge */}
                  {linkedProject && (
                    <div className="flex items-center gap-1.5 text-2xs text-slate-600">
                      <FolderKanban className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-slate-400 font-medium">Originating Project:</span>
                      <button
                        type="button"
                        onClick={() => onOpenProjectDetail(linkedProject.id)}
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline truncate max-w-xs cursor-pointer text-left"
                        title="Jump to Project Detail"
                      >
                        {linkedProject.title}
                      </button>
                    </div>
                  )}

                  {/* Synopsis */}
                  {story.synopsis && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {story.synopsis}
                    </p>
                  )}

                  {/* STAR Quick Snippets */}
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1.5 text-2xs">
                    {story.actions && (
                      <div className="line-clamp-2">
                        <span className="font-bold text-slate-700">Actions: </span>
                        <span className="text-slate-600">{story.actions}</span>
                      </div>
                    )}
                    {story.outcome && (
                      <div className="line-clamp-1">
                        <span className="font-bold text-emerald-800">Outcome: </span>
                        <span className="text-emerald-900 font-medium">{story.outcome}</span>
                      </div>
                    )}
                  </div>

                  {/* Metrics Badge */}
                  {story.metrics && story.metrics.length > 0 && (
                    <div className="flex items-center gap-1.5 text-2xs text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{story.metrics[0]}</span>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-2xs">
                  
                  {/* Left: 1-click Convert to Q&A Blueprint */}
                  <button
                    type="button"
                    onClick={() => handleConvertToBlueprint(story)}
                    className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer hover:bg-purple-50 px-2 py-1 rounded transition-colors"
                    title="Generate structured Q&A Blueprint from this story"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Create Q&A Blueprint</span>
                  </button>

                  {/* Right actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingStory(story)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Story"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateStory(story)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Duplicate Story"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingStory(story)}
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
      )}

      {/* Story Detail Modal */}
      {viewingStory && (
        <StoryDetailModal
          story={viewingStory}
          projects={projects}
          onClose={() => setViewingStory(null)}
          onEdit={() => {
            const s = viewingStory;
            setViewingStory(null);
            setEditingStory(s);
          }}
          onConvertToBlueprint={() => handleConvertToBlueprint(viewingStory)}
          onOpenProjectDetail={(projId) => {
            setViewingStory(null);
            onOpenProjectDetail(projId);
          }}
        />
      )}

      {/* Create / Edit Story Modal */}
      {(isCreateModalOpen || editingStory) && (
        <CreateStoryModal
          isOpen={isCreateModalOpen || !!editingStory}
          story={editingStory}
          projects={projects}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingStory(null);
          }}
          onSave={(savedStory) => {
            KnowledgeStorageService.addOrUpdateStory(savedStory);
            refreshStories();
            setIsCreateModalOpen(false);
            setEditingStory(null);
          }}
        />
      )}

    </div>
  );
};
