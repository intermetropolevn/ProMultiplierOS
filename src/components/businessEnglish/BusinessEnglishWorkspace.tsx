import React, { useState } from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  Activity, 
  Compass, 
  Layers, 
  GitCommit, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';
import { BusinessEnglishTab, RolePlaySessionFeedback, UserVocabularySet } from '../../features/businessEnglish/types';
import { RolePlayStudio } from './RolePlayStudio';
import { VocabularyWorkspace } from './VocabularyWorkspace';
import { ShadowSpeakingStudio } from './ShadowSpeakingStudio';
import { TopicsLibrary } from './TopicsLibrary';
import { DomainKnowledgeGlossary } from './DomainKnowledgeGlossary';
import { CommunicationPatternsLibrary } from './CommunicationPatternsLibrary';
import { MascotCoachWidget } from './MascotCoachWidget';
import { UserCareerProfile } from '../../types';

interface BusinessEnglishWorkspaceProps {
  profile?: UserCareerProfile;
  initialTab?: BusinessEnglishTab;
  onUpdateProfile?: (updates: Partial<UserCareerProfile>) => void;
  className?: string;
}

export const BusinessEnglishWorkspace: React.FC<BusinessEnglishWorkspaceProps> = ({
  profile,
  initialTab = 'role_play',
  onUpdateProfile,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<BusinessEnglishTab>(initialTab);
  const [activeScenarioId, setActiveScenarioId] = useState<string | undefined>(undefined);

  // Tabs Configuration
  const navTabs: { id: BusinessEnglishTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'role_play', label: 'Role-Play Studio', icon: MessageSquare },
    { id: 'vocabulary', label: 'Vocabulary Workspace', icon: BookOpen },
    { id: 'shadow_speaking', label: 'Shadow Speaking', icon: Activity },
    { id: 'topics', label: 'Topics & Inspiration', icon: Compass },
    { id: 'domain_knowledge', label: 'Domain Knowledge', icon: Layers },
    { id: 'communication_patterns', label: 'Communication Patterns', icon: GitCommit },
  ];

  // Callback from Topics or Domain Knowledge to jump directly into Role-Play
  const handleLaunchRolePlayWithScenario = (scenarioId?: string) => {
    setActiveScenarioId(scenarioId);
    setActiveTab('role_play');
  };

  // Callback to sync vocabulary sets to profile
  const handleSyncVocabSetToProfile = (vocabSet: UserVocabularySet) => {
    // Stored in localStorage and synced
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-150 ${className}`}>
      
      {/* UNIFIED BANNER & CONTROL SURFACE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        {/* ROW 1: Heading & Supporting Description (LEFT) + Profile Context (RIGHT) */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Business English &amp; Workplace Communication
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-2xl leading-relaxed">
              Immersive, context-aware workplace communication practice. Master executive framing, cross-functional alignment, domain vocabulary, and native rhythm.
            </p>
          </div>

          {/* Profile Context Widget in top-right */}
          {profile && (
            <div className="bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-200/80 flex items-center gap-3 shrink-0 self-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {profile.targetRole ? profile.targetRole.charAt(0) : 'U'}
              </div>
              <div className="min-w-0 text-xs">
                <div className="font-semibold text-slate-900 truncate">
                  {profile.targetRole || 'Software Engineering'}
                </div>
                <div className="text-slate-500 text-[11px] truncate">
                  {profile.targetDomain || 'Fintech & Payments'} · {profile.experienceLevel || 'Senior'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ROW 2: Primary Business English Mode Controls */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-medium overflow-x-auto max-w-full">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-biz-${tab.id}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer select-none ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AREA 2: PERSISTENT MASCOT COACH COMPONENT (LEXI) */}
      <MascotCoachWidget
        activeTab={activeTab}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* AREA 3: PRIMARY ACTIVE VIEW CONTAINER */}
      <div className="transition-all">
        {activeTab === 'role_play' && (
          <RolePlayStudio
            initialScenarioId={activeScenarioId}
            onSaveToProfile={() => {}}
            onSaveVocabTerm={() => {}}
          />
        )}

        {activeTab === 'vocabulary' && (
          <VocabularyWorkspace
            onStartRolePlayWithTerm={(term) => handleLaunchRolePlayWithScenario()}
            onSyncToProfile={handleSyncVocabSetToProfile}
          />
        )}

        {activeTab === 'shadow_speaking' && (
          <ShadowSpeakingStudio />
        )}

        {activeTab === 'topics' && (
          <TopicsLibrary
            onStartRolePlayWithTopic={handleLaunchRolePlayWithScenario}
            onSelectVocabularyTerm={() => setActiveTab('vocabulary')}
          />
        )}

        {activeTab === 'domain_knowledge' && (
          <DomainKnowledgeGlossary
            onPracticeInRolePlay={handleLaunchRolePlayWithScenario}
            onAddToVocabulary={() => setActiveTab('vocabulary')}
          />
        )}

        {activeTab === 'communication_patterns' && (
          <CommunicationPatternsLibrary
            onSelectPatternForPractice={handleLaunchRolePlayWithScenario}
          />
        )}
      </div>

    </div>
  );
};
