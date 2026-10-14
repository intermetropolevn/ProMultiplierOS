import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Briefcase, 
  FileText, 
  BookOpen, 
  Activity, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Mic2, 
  TrendingUp, 
  ShieldCheck, 
  ListTodo,
  Globe,
  FolderKanban,
  ArrowRight,
  Building2
} from 'lucide-react';
import { UserCareerProfile, SavedJobApplication, RoleBlueprint, InterviewQuestion } from '../../types';
import { ProfileHeader } from './ProfileHeader';
import { TargetSection } from './TargetSection';
import { ChecklistSection } from './ChecklistSection';
import { CompactSkillEvidenceGraph } from './CompactSkillEvidenceGraph';
import { CoreProcessVisualization, CareerProcessStage } from './CoreProcessVisualization';
import { BackgroundCapacityView } from './BackgroundCapacityView';
import { ProjectsStorybanksWorkspace } from './projects/ProjectsStorybanksWorkspace';
import { QuestionAnswerBlueprintsView } from './QuestionAnswerBlueprintsView';
import { RecentActivitiesView } from './RecentActivitiesView';
import { BusinessEnglishProfileSection } from './BusinessEnglishProfileSection';
import { AIDashboardWorkspace } from './AIDashboardWorkspace';
import { StructuredAnswerBlueprint } from '../../features/knowledge/types';
import { PersistentPins } from '../workspace/PersistentPins';

export type ProfileViewTab = 'background_capacity' | 'projects_storybanks' | 'qa_blueprints' | 'recent_activities' | 'business_english';

interface MyProfileDashboardProps {
  profile: UserCareerProfile;
  onUpdateProfile: (updates: Partial<UserCareerProfile>) => void;
  savedJobs: SavedJobApplication[];
  bookmarkedQuestionIds: string[];
  onToggleBookmarkQuestion: (questionId: string) => void;
  onStartLiveInterview: () => void;
  onStartMockPractice: () => void;
  onStartPracticeQuestion: (question: InterviewQuestion) => void;
  onStartPracticeRole: (role: RoleBlueprint) => void;
  onStartPracticeDomain: (domainName: string) => void;
  onOpenApplicationWorkspace?: (applicationId: string) => void;
  onNavigateToBusinessEnglish?: (tab?: string) => void;
  initialTab?: ProfileViewTab;
}

export const MyProfileDashboard: React.FC<MyProfileDashboardProps> = ({
  profile,
  onUpdateProfile,
  savedJobs,
  bookmarkedQuestionIds,
  onToggleBookmarkQuestion,
  onStartLiveInterview,
  onStartMockPractice,
  onStartPracticeQuestion,
  onStartPracticeRole,
  onStartPracticeDomain,
  onOpenApplicationWorkspace,
  onNavigateToBusinessEnglish,
  initialTab = 'qa_blueprints',
}) => {
  const [activeTab, setActiveTab] = useState<ProfileViewTab>(initialTab);

  // Convert blueprint to InterviewQuestion and start practice
  const handleStartPracticeBlueprint = (blueprint: StructuredAnswerBlueprint) => {
    const questionObj: InterviewQuestion = {
      id: blueprint.questionId || `q-${blueprint.id}`,
      question: blueprint.questionText,
      roleCategory: (blueprint.roleCategory as any) || (profile.targetRole as any) || 'Software Engineering',
      domain: (blueprint.domain as any) || (profile.targetDomain as any) || 'Fintech & Payments',
      level: profile.experienceLevel || 'Lead / Staff',
      type: blueprint.framework === 'STAR' ? 'Behavioral (STAR)' : 'Technical Architecture',
      context: blueprint.components.situation || blueprint.components.openingHook || 'Structured Interview Blueprint',
      rubricCriteria: [
        {
          criterion: 'Structure & Execution Framework',
          weight: 40,
          whatStrongCandidatesSay: blueprint.components.openingHook || 'Demonstrates clear, metrics-driven framework progression.',
          redFlags: 'Rambling narrative with no concrete decision-making.'
        },
        {
          criterion: 'Technical Depth & Production Realism',
          weight: 60,
          whatStrongCandidatesSay: (blueprint.metrics || []).join('; ') || 'Directly references measurable impact and tradeoffs.',
          redFlags: 'Vague conceptual claims without verifiable evidence.'
        }
      ],
      starGuidance: {
        situation: blueprint.components.situation || '',
        task: blueprint.components.task || '',
        action: Array.isArray(blueprint.components.action) ? blueprint.components.action.join('. ') : (blueprint.components.action || ''),
        result: Array.isArray(blueprint.components.result) ? blueprint.components.result.join('. ') : (blueprint.components.result || ''),
      },
      keywordsToMention: blueprint.metrics && blueprint.metrics.length > 0 ? blueprint.metrics : ['Production Architecture', 'Idempotency', 'Zero Downtime'],
      exemplaryModelAnswer: blueprint.components.openingHook || 'Structured response with empirical outcomes and architectural tradeoffs.',
    };

    onStartPracticeQuestion(questionObj);
  };

  const handleNavigateStage = (stage: CareerProcessStage) => {
    if (stage === 'build_profile') {
      setActiveTab('background_capacity');
    } else if (stage === 'prepare') {
      setActiveTab('qa_blueprints');
    } else if (stage === 'practice') {
      onStartLiveInterview();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. PERSONAL QUICK-ACCESS WORKSPACE: YOUR PINS (Starts Expanded -> Auto-Collapses to subtle horizontal bar) */}
      <PersistentPins
        variant="dashboard-strip"
        savedJobs={savedJobs}
        autoCollapseDelayMs={4500}
      />

      {/* 2. PROFILE HEADER & CAREER CALIBRATION SNAPSHOT */}
      <ProfileHeader
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        onOpenLivePractice={onStartLiveInterview}
        onOpenAIDiagnostic={() => {
          document.getElementById('ai-workspace-block')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. FLEXIBLE TWO-COLUMN WORKSPACE: CURRENT FOCUS (7 cols) & CAREER STATUS (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* CURRENT FOCUS & NEXT ACTIONS (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <TargetSection
            profile={profile}
            onEditClick={() => {
              const editBtn = document.getElementById('btn-edit-career-calibration');
              editBtn?.click();
            }}
          />

          <ChecklistSection />
        </div>

        {/* CAREER STATUS & READINESS SIGNALS (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Skill Evidence & Auditable Proof */}
          <CompactSkillEvidenceGraph
            onViewFullGraph={() => {
              setActiveTab('background_capacity');
            }}
          />

          {/* Active Application Radar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Application Radar
                  </h4>
                  <p className="text-2xs text-slate-500">
                    {savedJobs.length > 0 ? `${savedJobs.length} active opportunities tracked` : 'Track opportunities in your pipeline'}
                  </p>
                </div>
              </div>

              {onOpenApplicationWorkspace && (
                <button
                  type="button"
                  onClick={() => onOpenApplicationWorkspace('')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {savedJobs.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 text-center text-xs text-slate-500">
                No active applications in pipeline yet. Save opportunities from Job Opportunity to track them here.
              </div>
            ) : (
              <div className="space-y-2">
                {savedJobs.slice(0, 3).map((saved) => (
                  <div
                    key={saved.id}
                    className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {saved.job.title}
                      </div>
                      <div className="text-2xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{saved.job.company}</span>
                        <span>·</span>
                        <span className="text-blue-600 font-semibold capitalize">{saved.status.replace(/_/g, ' ')}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onStartPracticeRole({
                        id: saved.job.id,
                        title: saved.job.title,
                        category: saved.job.roleCategory,
                        level: saved.job.level,
                        tagline: saved.job.description.slice(0, 80),
                        primaryTechStack: saved.job.requiredSkills || [],
                        competencies: [],
                        marketDemand: 'High',
                        salaryBenchmark: { junior: '$100k - $140k', mid: '$140k - $180k', senior: '$180k - $240k', lead: '$220k - $300k' }
                      })}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 rounded-lg text-2xs font-semibold shrink-0 transition-colors shadow-3xs cursor-pointer"
                    >
                      Practice
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 4. CAREER ACTIVITY & SUBSTANTIVE WORKSPACE (Full Width Flexible Block) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Career Activity, Projects &amp; Answer Blueprints
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Substantive personal career assets: architectural case studies, STAR response blueprints, and practice timelines.
            </p>
          </div>

          {/* Segmented workspace navigation */}
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-medium overflow-x-auto max-w-full">
            
            {/* Tab 1: Question & Answer Blueprints */}
            <button
              id="tab-profile-qa-blueprints"
              onClick={() => setActiveTab('qa_blueprints')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'qa_blueprints'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'qa_blueprints' ? 'text-purple-600' : 'text-slate-500'}`} />
              <span>Q&amp;A Blueprints</span>
            </button>

            {/* Tab 2: Projects & Storybanks */}
            <button
              id="tab-profile-projects-storybanks"
              onClick={() => setActiveTab('projects_storybanks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'projects_storybanks'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FolderKanban className={`w-3.5 h-3.5 ${activeTab === 'projects_storybanks' ? 'text-blue-600' : 'text-slate-500'}`} />
              <span>Projects &amp; Storybanks</span>
            </button>

            {/* Tab 3: Recent Activities */}
            <button
              id="tab-profile-recent-activities"
              onClick={() => setActiveTab('recent_activities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'recent_activities'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${activeTab === 'recent_activities' ? 'text-slate-800' : 'text-slate-500'}`} />
              <span>Recent Activities</span>
            </button>

            {/* Tab 4: Background & Capacity */}
            <button
              id="tab-profile-background-capacity"
              onClick={() => setActiveTab('background_capacity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'background_capacity'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${activeTab === 'background_capacity' ? 'text-blue-600' : 'text-slate-500'}`} />
              <span>Background &amp; Capacity</span>
            </button>

            {/* Tab 5: Business English & Vocabulary */}
            <button
              id="tab-profile-business-english"
              onClick={() => setActiveTab('business_english')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'business_english'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${activeTab === 'business_english' ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span>Business English</span>
            </button>

          </div>
        </div>

        {/* Active Substantive Workspace Viewer */}
        <div className="pt-1">
          {activeTab === 'qa_blueprints' && (
            <div className="animate-in fade-in">
              <QuestionAnswerBlueprintsView
                onStartPracticeBlueprint={handleStartPracticeBlueprint}
                targetRole={profile.targetRole || 'Software Engineering'}
                targetDomain={profile.targetDomain || 'Fintech & Payments'}
              />
            </div>
          )}

          {activeTab === 'projects_storybanks' && (
            <div className="animate-in fade-in">
              <ProjectsStorybanksWorkspace
                onStartPracticeBlueprint={handleStartPracticeBlueprint}
                onNavigateToBlueprint={(bpId) => setActiveTab('qa_blueprints')}
              />
            </div>
          )}

          {activeTab === 'recent_activities' && (
            <div className="animate-in fade-in">
              <RecentActivitiesView
                onNavigateToTab={(tab) => {
                  if (tab === 'profile') setActiveTab('qa_blueprints');
                }}
              />
            </div>
          )}

          {activeTab === 'background_capacity' && (
            <div className="animate-in fade-in">
              <BackgroundCapacityView />
            </div>
          )}

          {activeTab === 'business_english' && (
            <div className="animate-in fade-in">
              <BusinessEnglishProfileSection
                profile={profile}
                onNavigateToBusinessEnglish={onNavigateToBusinessEnglish}
              />
            </div>
          )}
        </div>
      </div>

      {/* 5. CONTEXTUAL AI WORKSPACE & CAREER INTELLIGENCE */}
      <div id="ai-workspace-block">
        <AIDashboardWorkspace
          profile={profile}
          onStartPracticeQuestion={onStartPracticeQuestion}
          onNavigateToTab={(tab) => setActiveTab(tab as any)}
        />
      </div>

    </div>
  );
};
