import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { CareerProject } from '../../../features/projects/types';
import { ProjectStorageService } from '../../../features/projects/services/projectStorageService';
import { BlueprintFramework } from '../../../features/knowledge/types';

interface GenerateFromProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CareerProject;
  defaultMode?: 'story' | 'blueprint';
  onStoryGenerated?: (storyId: string) => void;
  onBlueprintGenerated?: (blueprintId: string) => void;
}

export const GenerateFromProjectModal: React.FC<GenerateFromProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  defaultMode = 'story',
  onStoryGenerated,
  onBlueprintGenerated,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'story' | 'blueprint'>(defaultMode);
  const [framework, setFramework] = useState<BlueprintFramework>('Custom');
  const [questionText, setQuestionText] = useState(
    `Tell me about a high-stakes technical or architectural project where you designed the system, handled difficult trade-offs, and verified production outcomes.`
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleGenerateStory = () => {
    const story = ProjectStorageService.generateStoryFromProject(project);
    setIsSuccess(true);
    setSuccessMessage(`Story "${story.title}" generated and added to Storybank!`);
    setTimeout(() => {
      onStoryGenerated?.(story.id);
      onClose();
    }, 1200);
  };

  const handleGenerateBlueprint = () => {
    const bp = ProjectStorageService.generateBlueprintFromProject(project, framework, questionText);
    setIsSuccess(true);
    setSuccessMessage(`Q&A Blueprint for "${bp.title}" generated and synced to Question & Answer Blueprints!`);
    setTimeout(() => {
      onBlueprintGenerated?.(bp.id);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Generate from Project
              </h2>
              <p className="text-2xs text-slate-500">
                Transform "{project.title}" into reusable interview assets.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('story')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'story'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Generate Candidate Story</span>
                <Layers className={`w-4 h-4 ${mode === 'story' ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Extracts a STAR/CAR competency story and stores it in your Storybank.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('blueprint')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'blueprint'
                  ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Generate Q&A Blueprint</span>
                <BookOpen className={`w-4 h-4 ${mode === 'blueprint' ? 'text-purple-600' : 'text-slate-400'}`} />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Creates a structured interview answer in the Question & Answer Blueprints database.
              </p>
            </button>
          </div>

          {/* Configuration for Blueprint */}
          {mode === 'blueprint' && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Answer Architecture Framework
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Custom', 'STAR', 'CAR'] as BlueprintFramework[]).map(fw => (
                    <button
                      key={fw}
                      type="button"
                      onClick={() => setFramework(fw)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        framework === fw
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {fw === 'Custom' ? 'Custom Structure' : fw}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Interview Question
                </label>
                <textarea
                  rows={2}
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* Project Summary Preview */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
              Source Material ({project.sections.length} Sections)
            </div>
            <div className="font-semibold text-slate-900">{project.title}</div>
            <div className="text-slate-600 line-clamp-2 text-[11px]">{project.tagline}</div>
            {project.metrics.length > 0 && (
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{project.metrics[0]}</span>
              </div>
            )}
          </div>

          {/* Success state notification */}
          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={mode === 'story' ? handleGenerateStory : handleGenerateBlueprint}
            className={`px-5 py-2 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              mode === 'story'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{mode === 'story' ? 'Generate & Save to Storybank' : 'Generate & Save to Q&A Blueprints'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
