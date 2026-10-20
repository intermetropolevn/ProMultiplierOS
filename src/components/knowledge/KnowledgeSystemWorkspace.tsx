import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  Plus,
  Sparkles,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { RoleBlueprintMappingWorkspace } from './roleBlueprintMapping/RoleBlueprintMappingWorkspace';
import { LibraryHub } from '../library/LibraryHub';
import { RoleIntelligenceWorkspace } from '../roleIntelligence/RoleIntelligenceWorkspace';
import { EvidenceIntelligenceWorkspace } from '../evidenceIntelligence/EvidenceIntelligenceWorkspace';
import { RoleBlueprint, InterviewQuestion, UserCareerProfile } from '../../types';
import { UniversalSourceIngestionModal, InputMethod } from '../library/UniversalSourceIngestionModal';
import { sourceStore } from '../../features/sources/services/sourceStore';

export type KnowledgeChildDestination = 'role_blueprint_mapping' | 'global_knowledge_library' | 'role_intelligence' | 'evidence_intelligence';

interface KnowledgeSystemWorkspaceProps {
  initialDestination?: KnowledgeChildDestination;
  bookmarkedQuestionIds: string[];
  profile?: UserCareerProfile;
  onUpdateProfile?: (updates: Partial<UserCareerProfile>) => void;
  onToggleBookmarkQuestion: (id: string) => void;
  onStartPracticeRole: (role: RoleBlueprint) => void;
  onStartPracticeDomain: (domainName: string) => void;
  onStartPracticeQuestion: (question: InterviewQuestion) => void;
  onStartLivePractice?: (scenarioTitle?: string) => void;
  onNavigateToProfile?: () => void;
  onOpenSourceDetail?: (sourceId: string) => void;
  onNavigateToOpportunities?: () => void;
  onNavigateToParticipation?: () => void;
}

export const KnowledgeSystemWorkspace: React.FC<KnowledgeSystemWorkspaceProps> = ({
  initialDestination = 'role_blueprint_mapping',
  bookmarkedQuestionIds,
  profile,
  onUpdateProfile,
  onToggleBookmarkQuestion,
  onStartPracticeRole,
  onStartPracticeDomain,
  onStartPracticeQuestion,
  onStartLivePractice,
  onNavigateToProfile,
  onOpenSourceDetail,
  onNavigateToOpportunities,
  onNavigateToParticipation,
}) => {
  const [activeDestination, setActiveDestination] = useState<KnowledgeChildDestination>(initialDestination);
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [ingestionMethod, setIngestionMethod] = useState<InputMethod>('text');

  return (
    <div className="space-y-6">
      
      {/* 1. Unified Knowledge System Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Career Knowledge &amp; Domain Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Explore structural blueprints, industry encyclopedias, workflow SOPs, and role intelligence evaluation models.
            </p>
          </div>

          {/* Quick Actions in Top-Right Corner */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={() => {
                setActiveDestination('global_knowledge_library');
                setIngestionMethod('text');
                setIsIngestionOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Smart Import (AI)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveDestination('global_knowledge_library');
                setIngestionMethod('manual');
                setIsIngestionOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Source</span>
            </button>
          </div>
        </div>

        {/* Primary Knowledge System Mode Switch Directly Underneath */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <button
            id="knowledge-dest-role-intelligence"
            type="button"
            onClick={() => setActiveDestination('role_intelligence')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeDestination === 'role_intelligence'
                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Sliders className={`w-4 h-4 ${activeDestination === 'role_intelligence' ? 'text-white' : 'text-slate-500'}`} />
            <span>Role Intelligence &amp; Evaluation</span>
            <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded ${activeDestination === 'role_intelligence' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
              Featured
            </span>
          </button>

          <button
            id="knowledge-dest-evidence-intelligence"
            type="button"
            onClick={() => setActiveDestination('evidence_intelligence')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeDestination === 'evidence_intelligence'
                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeDestination === 'evidence_intelligence' ? 'text-white' : 'text-slate-500'}`} />
            <span>Evidence Intelligence</span>
            <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded ${activeDestination === 'evidence_intelligence' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
              Signals
            </span>
          </button>

          <button
            id="knowledge-dest-role-blueprints"
            type="button"
            onClick={() => setActiveDestination('role_blueprint_mapping')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeDestination === 'role_blueprint_mapping'
                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Compass className={`w-4 h-4 ${activeDestination === 'role_blueprint_mapping' ? 'text-white' : 'text-slate-500'}`} />
            <span>Preferred Role Mapping</span>
          </button>

          <button
            id="knowledge-dest-global-library"
            type="button"
            onClick={() => setActiveDestination('global_knowledge_library')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeDestination === 'global_knowledge_library'
                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeDestination === 'global_knowledge_library' ? 'text-white' : 'text-slate-500'}`} />
            <span>Global Knowledge Library</span>
          </button>
        </div>
      </div>

      {/* Destination 1: Role Intelligence & Evaluation */}
      {activeDestination === 'role_intelligence' && (
        <div className="animate-in fade-in">
          <RoleIntelligenceWorkspace
            userProfile={profile}
            onNavigateToLearning={() => setActiveDestination('global_knowledge_library')}
            onNavigateToEvidenceIntelligence={() => setActiveDestination('evidence_intelligence')}
            onNavigateToOpportunities={onNavigateToOpportunities}
            onNavigateToParticipation={onNavigateToParticipation}
          />
        </div>
      )}

      {/* Destination 1b: Evidence Intelligence */}
      {activeDestination === 'evidence_intelligence' && (
        <div className="animate-in fade-in">
          <EvidenceIntelligenceWorkspace
            onNavigateToRoleIntelligence={() => setActiveDestination('role_intelligence')}
          />
        </div>
      )}

      {/* Destination 2: Preferred Role Mapping */}
      {activeDestination === 'role_blueprint_mapping' && (
        <div className="animate-in fade-in">
          <RoleBlueprintMappingWorkspace
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onStartPracticeRole={onStartPracticeRole}
            onStartPracticeDomain={onStartPracticeDomain}
            onStartPracticeQuestion={onStartPracticeQuestion}
            onStartLivePractice={onStartLivePractice}
          />
        </div>
      )}

      {/* Destination 3: Global Knowledge Library */}
      {activeDestination === 'global_knowledge_library' && (
        <div className="animate-in fade-in">
          <LibraryHub
            onOpenSourceDetail={onOpenSourceDetail}
            onNavigateToProfile={onNavigateToProfile}
          />
        </div>
      )}

      {/* Universal Source Ingestion Modal */}
      {isIngestionOpen && (
        <UniversalSourceIngestionModal
          onClose={() => setIsIngestionOpen(false)}
          onSaveSource={(newSource) => {
            sourceStore.addSource(newSource);
            setIsIngestionOpen(false);
          }}
          initialMethod={ingestionMethod}
          initialFamily="learn"
        />
      )}

    </div>
  );
};
