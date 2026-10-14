import React from 'react';
import { 
  X, 
  Layers, 
  BookOpen, 
  FolderKanban, 
  CheckCircle2, 
  Calendar, 
  Briefcase, 
  Edit3, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CandidateStory } from '../../../features/knowledge/types';
import { CareerProject } from '../../../features/projects/types';

interface StoryDetailModalProps {
  story: CandidateStory;
  projects: CareerProject[];
  onClose: () => void;
  onEdit: () => void;
  onConvertToBlueprint: () => void;
  onOpenProjectDetail: (projectId: string) => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  projects,
  onClose,
  onEdit,
  onConvertToBlueprint,
  onOpenProjectDetail,
}) => {
  const linkedProject = projects.find(p => p.id === story.projectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
          <div className="space-y-1 pr-4">
            <div className="flex flex-wrap items-center gap-2 text-2xs font-semibold">
              <span className="text-blue-600 font-bold uppercase tracking-wider">
                Candidate Story
              </span>
              <span>·</span>
              <span className="text-slate-500">
                {story.bestFor.join(' · ')}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {story.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-800">
          
          {/* Originating Project Banner if linked */}
          {linkedProject && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-blue-950 font-medium">
                <FolderKanban className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Originating Project: <strong className="font-bold text-blue-900">{linkedProject.title}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => onOpenProjectDetail(linkedProject.id)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-2xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                <span>View Project Case Study</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Synopsis */}
          {story.synopsis && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                Executive Hook / Synopsis
              </span>
              <p className="text-xs text-slate-900 font-medium leading-relaxed">
                {story.synopsis}
              </p>
            </div>
          )}

          {/* STAR Narrative Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Context & Situation */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
                Context & Situation
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {story.context || 'Not specified'}
              </p>
            </div>

            {/* My Role */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
                My Role & Ownership
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {story.myRole || 'Not specified'}
              </p>
            </div>

            {/* Actions Taken */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-1.5 md:col-span-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
                Actions & Execution
              </span>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {story.actions || 'Not specified'}
              </p>
            </div>

            {/* Decision */}
            {story.decision && (
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
                  Core Decision
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {story.decision}
                </p>
              </div>
            )}

            {/* Tradeoffs */}
            {story.tradeoffs && (
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
                  Trade-offs Weighed
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {story.tradeoffs}
                </p>
              </div>
            )}

            {/* Outcome */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1.5 md:col-span-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-emerald-800 block">
                Measurable Outcome & Impact
              </span>
              <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                {story.outcome || 'Not specified'}
              </p>
            </div>

          </div>

          {/* Metrics */}
          {story.metrics && story.metrics.length > 0 && (
            <div className="space-y-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
                Empirical Metrics Ledger
              </span>
              <div className="flex flex-wrap gap-2">
                {story.metrics.map((m, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{m}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills & Roles */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-2xs text-slate-500">
            <div>
              <span className="font-bold text-slate-700">Relevant Roles: </span>
              <span>{story.relevantRoles.join(', ')}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Skills: </span>
              <span>{story.skills.join(', ')}</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Story</span>
          </button>

          <button
            type="button"
            onClick={onConvertToBlueprint}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Convert to Q&A Blueprint</span>
          </button>
        </div>

      </div>
    </div>
  );
};
