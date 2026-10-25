import React, { useState } from 'react';
import { 
  RoleIntelligenceItem, 
  ReferenceFrameworkId, 
  CareerOSDimensionKey 
} from '../../features/roleIntelligence/types';
import { roleIntelligenceStore } from '../../features/roleIntelligence/services/roleIntelligenceStore';
import { RoleEvaluationWorkspace } from './RoleEvaluationWorkspace';
import { RoleLevelingView } from './RoleLevelingView';
import { FrameworkComparisonView } from './FrameworkComparisonView';
import { SkillsCompetencyMappingView } from './SkillsCompetencyMappingView';
import { CareerMobilityView } from './CareerMobilityView';
import { RoleProfileView } from './RoleProfileView';
import { RoleReadinessModal } from './RoleReadinessModal';
import { RoleGraphModal } from './RoleGraphModal';
import { UserCareerProfile } from '../../types';
import { IntelligenceAccessBanner } from '../access/IntelligenceAccessBanner';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';
import { useAccessControl } from '../../services/accessControlService';
import { 
  Sliders, 
  GitBranch, 
  Compass, 
  Layers, 
  Award, 
  Search, 
  Target, 
  Sparkles, 
  FileText, 
  Briefcase,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

export type RoleIntelligenceSubTab = 
  | 'evaluation'
  | 'leveling'
  | 'frameworks'
  | 'skills'
  | 'mobility';

interface RoleIntelligenceWorkspaceProps {
  initialSubTab?: RoleIntelligenceSubTab;
  initialRoleId?: string;
  userProfile?: UserCareerProfile;
  onNavigateToLearning?: () => void;
  onNavigateToEvidenceIntelligence?: () => void;
  onNavigateToOpportunities?: () => void;
  onNavigateToParticipation?: () => void;
}

export const RoleIntelligenceWorkspace: React.FC<RoleIntelligenceWorkspaceProps> = ({
  initialSubTab = 'evaluation',
  initialRoleId = 'role-sr-product-manager',
  userProfile,
  onNavigateToLearning,
  onNavigateToEvidenceIntelligence,
  onNavigateToOpportunities,
  onNavigateToParticipation
}) => {
  const { recordMeaningfulInteraction, getIntelligenceAccess, consumeDemoIntelligenceSignal } = useAccessControl();
  const [activeSubTab, setActiveSubTab] = useState<RoleIntelligenceSubTab>(initialSubTab);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoleId);
  const [roleSearchQuery, setRoleSearchQuery] = useState<string>('');
  const [isReadinessOpen, setIsReadinessOpen] = useState(false);
  const [isRoleGraphOpen, setIsRoleGraphOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(false);
  const [gateModalOpen, setGateModalOpen] = useState(false);

  const roleIntelAccess = getIntelligenceAccess('role_intelligence_evaluation');
  const roles = roleIntelligenceStore.getRoles();
  const filteredRoles = roleSearchQuery.trim()
    ? roles.filter(r => 
        r.title.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
        r.jobFamily.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
        r.domain.toLowerCase().includes(roleSearchQuery.toLowerCase())
      )
    : roles;
  const activeRole = roleIntelligenceStore.getRoleById(selectedRoleId) || roles[0];

  const handleUpdateScore = (key: CareerOSDimensionKey, score: number) => {
    roleIntelligenceStore.updateDimensionScore(activeRole.id, key, score);
  };

  const navTabs: { id: RoleIntelligenceSubTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'evaluation', label: '1. Role Evaluation', icon: Sliders },
    { id: 'leveling', label: '2. Role Leveling', icon: Layers },
    { id: 'frameworks', label: '3. Role Frameworks', icon: Award },
    { id: 'skills', label: '4. Skills & Competencies', icon: Compass },
    { id: 'mobility', label: '5. Career Mobility', icon: GitBranch }
  ];

  return (
    <div className="space-y-6">
      
      {/* ==================================================
          1. PRIMARY NAVIGATION & ROLE SELECTOR STRIP (Section 1)
          ================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
        
        {/* Top Bar: Module Title & Role Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Career Intelligence
              </span>
              <IntelligenceModeBadge capability="role_intelligence_evaluation" />
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Product × Tech × BizOps Architecture</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Role Intelligence &amp; Evaluation
            </h1>
          </div>

          {/* Role Quick Selector & Triggers */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            
            {/* Search and Select Roles */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder={`Search ${roles.length} roles...`}
                  value={roleSearchQuery}
                  onChange={(e) => setRoleSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200/90 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-32 sm:w-40"
                />
              </div>

              <select
                value={selectedRoleId}
                onChange={(e) => {
                  const nextRoleId = e.target.value;
                  if (roleIntelAccess.isDemo) {
                    const allowed = consumeDemoIntelligenceSignal('role_intelligence_evaluation', nextRoleId);
                    if (!allowed) {
                      setGateModalOpen(true);
                      return;
                    }
                  }
                  setSelectedRoleId(nextRoleId);
                  setViewingProfile(false);
                  recordMeaningfulInteraction('detail_open');
                }}
                className="bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 cursor-pointer shadow-3xs hover:bg-slate-100/70 transition-all max-w-[200px] truncate"
              >
                {filteredRoles.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.levelMapping.levelCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Readiness Trigger */}
            <button
              type="button"
              onClick={() => {
                recordMeaningfulInteraction('detail_open');
                setIsReadinessOpen(true);
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Readiness</span>
            </button>

            {/* Role Graph Trigger */}
            <button
              type="button"
              onClick={() => {
                recordMeaningfulInteraction('detail_open');
                setIsRoleGraphOpen(true);
              }}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-3xs flex items-center gap-1.5 cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-600" />
              <span>Role Graph</span>
            </button>
          </div>
        </div>

        {/* 5 Primary Sub-Sections Tabs (Section 1) */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 py-1">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id && !viewingProfile;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveSubTab(tab.id);
                    setViewingProfile(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Toggle Profile View */}
          <button
            type="button"
            onClick={() => setViewingProfile(!viewingProfile)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border shrink-0 ${
              viewingProfile
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Role Profile</span>
          </button>
        </div>

      </div>

      {/* Intelligence Access Banner for Public/Guest/Demo tiers */}
      <IntelligenceAccessBanner featureName="Role Intelligence" className="mb-4" />

      {/* ==================================================
          2. WORKSPACE CONTENT BODY
          ================================================== */}
      {viewingProfile ? (
        <RoleProfileView
          role={activeRole}
          onBack={() => setViewingProfile(false)}
          onNavigateToEvaluation={() => {
            setViewingProfile(false);
            setActiveSubTab('evaluation');
          }}
          onNavigateToReadiness={() => setIsReadinessOpen(true)}
          onNavigateToMobility={() => {
            setViewingProfile(false);
            setActiveSubTab('mobility');
          }}
        />
      ) : (
        <>
          {activeSubTab === 'evaluation' && (
            <RoleEvaluationWorkspace
              role={activeRole}
              onUpdateScore={handleUpdateScore}
              onNavigateToLeveling={() => setActiveSubTab('leveling')}
              onNavigateToReadiness={() => setIsReadinessOpen(true)}
              onNavigateToProfile={() => setViewingProfile(true)}
              onNavigateToFrameworks={() => setActiveSubTab('frameworks')}
              onNavigateToEvidenceIntelligence={onNavigateToEvidenceIntelligence}
            />
          )}

          {activeSubTab === 'leveling' && (
            <RoleLevelingView
              role={activeRole}
              onNavigateToEvaluation={() => setActiveSubTab('evaluation')}
              onNavigateToReadiness={() => setIsReadinessOpen(true)}
            />
          )}

          {activeSubTab === 'frameworks' && (
            <FrameworkComparisonView
              onSelectFramework={() => {
                setActiveSubTab('evaluation');
              }}
            />
          )}

          {activeSubTab === 'skills' && (
            <SkillsCompetencyMappingView
              role={activeRole}
              onNavigateToReadiness={() => setIsReadinessOpen(true)}
            />
          )}

          {activeSubTab === 'mobility' && (
            <CareerMobilityView
              role={activeRole}
              onSelectRole={(rId) => setSelectedRoleId(rId)}
              onNavigateToReadiness={() => setIsReadinessOpen(true)}
            />
          )}
        </>
      )}

      {/* ==================================================
          3. MODALS (Readiness & Role Graph)
          ================================================== */}
      <RoleReadinessModal
        isOpen={isReadinessOpen}
        onClose={() => setIsReadinessOpen(false)}
        role={activeRole}
        userProfile={userProfile}
        onNavigateToLearning={onNavigateToLearning}
        onNavigateToOpportunities={onNavigateToOpportunities}
        onNavigateToParticipation={onNavigateToParticipation}
      />

      <RoleGraphModal
        isOpen={isRoleGraphOpen}
        onClose={() => setIsRoleGraphOpen(false)}
        activeRole={activeRole}
        onSelectRole={(rId) => {
          setSelectedRoleId(rId);
          setIsRoleGraphOpen(false);
        }}
      />

      {gateModalOpen && (
        <CareerOSIntelligenceGate
          capability="role_intelligence_evaluation"
          variant="modal"
          onClose={() => setGateModalOpen(false)}
        />
      )}

    </div>
  );
};
