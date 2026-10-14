import React, { useState } from 'react';
import { 
  Compass, 
  Users, 
  Workflow, 
  FileCode, 
  Briefcase, 
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Target,
  Award
} from 'lucide-react';
import { DomainSectorMappingView } from './DomainSectorMappingView';
import { OrgModelsFitView } from './OrgModelsFitView';
import { SystemWorkflowsSopsView } from './SystemWorkflowsSopsView';
import { ArtifactsPrototypesView } from './ArtifactsPrototypesView';
import { CaseStudiesView } from './CaseStudiesView';
import { AIPromptsLibraryView } from './AIPromptsLibraryView';
import { RoleBlueprint, InterviewQuestion, UserCareerProfile } from '../../../types';
import { ROLES_DATA } from '../../../data/rolesData';
import { RoleDetailModal } from '../../prepare/RoleDetailModal';
import { 
  PreferredRoleMappingProvider, 
  usePreferredRoleMappingContext 
} from '../../../features/knowledge/context/PreferredRoleMappingContext';
import { PreferredRoleContextStrip } from './PreferredRoleContextStrip';

export type RoleBlueprintMappingTab =
  | 'domain_sector_mapping'
  | 'org_models_fit'
  | 'system_workflows_sops'
  | 'artifacts_prototypes'
  | 'case_studies'
  | 'ai_prompts_library';

export interface RoleBlueprintMappingWorkspaceProps {
  profile?: UserCareerProfile;
  onUpdateProfile?: (updates: Partial<UserCareerProfile>) => void;
  onStartPracticeRole?: (role: RoleBlueprint) => void;
  onStartPracticeDomain?: (domainName: string) => void;
  onStartPracticeQuestion?: (question: InterviewQuestion) => void;
  onStartLivePractice?: (scenarioTitle?: string) => void;
}

const RoleBlueprintMappingContent: React.FC<RoleBlueprintMappingWorkspaceProps> = ({
  onStartPracticeRole,
  onStartPracticeDomain,
  onStartPracticeQuestion,
  onStartLivePractice
}) => {
  const [activeTab, setActiveTab] = useState<RoleBlueprintMappingTab>('domain_sector_mapping');
  const [inspectModalRole, setInspectModalRole] = useState<RoleBlueprint | null>(null);

  const { preferredRole } = usePreferredRoleMappingContext();

  const tabs: { id: RoleBlueprintMappingTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'domain_sector_mapping', label: 'Domain & Sector Mapping', icon: Compass },
    { id: 'org_models_fit', label: 'Org Models & Fit', icon: Users },
    { id: 'system_workflows_sops', label: 'System Workflows & SOPs', icon: Workflow },
    { id: 'artifacts_prototypes', label: 'Artifacts & Prototypes', icon: FileCode },
    { id: 'case_studies', label: 'Case Studies & Incidents', icon: Briefcase },
    { id: 'ai_prompts_library', label: 'AI Prompts Library', icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      
      {/* 6-Pillar Child Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto shadow-2xs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Unified Preferred Role Context Strip (Requirements 2, 4-10) */}
      <PreferredRoleContextStrip
        onInspectSpec={() => setInspectModalRole(preferredRole)}
        onStartPractice={() => {
          if (onStartPracticeRole) {
            onStartPracticeRole(preferredRole);
          }
        }}
      />

      {/* Tab Content Panels */}
      <div className="animate-in fade-in duration-150">
        {activeTab === 'domain_sector_mapping' && (
          <DomainSectorMappingView
            selectedRoleBlueprint={preferredRole}
            onStartPracticeRole={onStartPracticeRole}
            onStartPracticeDomain={onStartPracticeDomain}
          />
        )}

        {activeTab === 'org_models_fit' && (
          <OrgModelsFitView />
        )}

        {activeTab === 'system_workflows_sops' && (
          <SystemWorkflowsSopsView />
        )}

        {activeTab === 'artifacts_prototypes' && (
          <ArtifactsPrototypesView />
        )}

        {activeTab === 'case_studies' && (
          <CaseStudiesView
            onStartLivePractice={onStartLivePractice}
          />
        )}

        {activeTab === 'ai_prompts_library' && (
          <AIPromptsLibraryView
            selectedRoleBlueprint={preferredRole}
          />
        )}
      </div>

      {/* Inspect Role Detail Modal */}
      {inspectModalRole && (
        <RoleDetailModal
          role={inspectModalRole}
          isOpen={Boolean(inspectModalRole)}
          onClose={() => setInspectModalRole(null)}
          onStartPractice={(role) => {
            setInspectModalRole(null);
            if (onStartPracticeRole) onStartPracticeRole(role);
          }}
        />
      )}

    </div>
  );
};

export const RoleBlueprintMappingWorkspace: React.FC<RoleBlueprintMappingWorkspaceProps> = (props) => {
  return (
    <PreferredRoleMappingProvider profile={props.profile} onUpdateProfile={props.onUpdateProfile}>
      <RoleBlueprintMappingContent {...props} />
    </PreferredRoleMappingProvider>
  );
};
